const b = "nl.bioimaging.omero-analysis-notebook.v1", E = "omero-analysis-config", g = /* @__PURE__ */ new Set([
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
function _(r) {
  return Array.isArray(r.source) ? r.source.join("") : r.source;
}
function y(r, s, o) {
  if (typeof r != "string" || !r.trim()) throw new Error(`${o} must be a relative path`);
  const m = r.replace(/\\/g, "/"), t = m.split("/");
  if (m.startsWith("/") || t[0] !== s || t.includes(".."))
    throw new Error(`${o} must stay inside ${s}/`);
  return m;
}
function A(r) {
  if (typeof r != "string" || !r.trim()) throw new Error("choices_query.sql is required");
  const s = r.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, " ").trim();
  if (!/^(select|with)\b/i.test(s) || s.replace(/;\s*$/, "").includes(";"))
    throw new Error("choices_query must contain one SELECT or WITH … SELECT statement");
  if (/\b(attach|copy|pragma|install|load|create|alter|drop|insert|update|delete|merge|call|set|reset)\b/i.test(s))
    throw new Error("choices_query contains a prohibited operation");
  if (/\b(read_csv|read_csv_auto|read_parquet|read_json|sqlite_scan|postgres_scan|httpfs|delta_scan|iceberg_scan|shell|system)\s*\(/i.test(s))
    throw new Error("choices_query contains a prohibited file or external function");
  return r;
}
function k(r) {
  const s = r.match(/\b(?:oan\.)?configure\s*\(\s*(?:[rubfRUBF]*)('''|""")([\s\S]*?)\1\s*\)/);
  if (!s) throw new Error("Configuration cell must call oan.configure() with a triple-quoted literal JSON string");
  try {
    return JSON.parse(s[2]);
  } catch (o) {
    throw new Error(`Configuration is not literal JSON: ${String(o)}`);
  }
}
function P(r, s = !1) {
  if (!r || typeof r != "object" || Array.isArray(r)) throw new Error("Notebook configuration must be an object");
  const o = r;
  if (o.schema !== b) throw new Error(`schema must equal ${b}`);
  if (!Array.isArray(o.inputs) || !o.inputs.length) throw new Error("inputs must be a non-empty list");
  const m = /* @__PURE__ */ new Set(), t = o.inputs.map((e, p) => {
    if (!e || typeof e != "object" || Array.isArray(e)) throw new Error(`inputs[${p}] must be an object`);
    if (typeof e.id != "string" || !/^[a-z][a-z0-9_-]{0,63}$/.test(e.id)) throw new Error(`inputs[${p}].id is invalid`);
    if (m.has(e.id)) throw new Error(`Duplicate input id: ${e.id}`);
    m.add(e.id);
    const f = y(e.path, "input", `Input ${e.id} path`), h = e.required ?? !0;
    if (typeof h != "boolean") throw new Error(`Input ${e.id} required must be boolean`);
    if (e.filename_globs !== void 0 && (!Array.isArray(e.filename_globs) || !e.filename_globs.length || e.filename_globs.length > 20 || e.filename_globs.some((c) => typeof c != "string" || !c.trim() || c.length > 180 || /[\\/\x00-\x1f\[\]]/.test(c))))
      throw new Error(`Input ${e.id} filename_globs must contain 1..20 basename patterns using * or ?`);
    if (e.kind === "query") {
      const c = /* @__PURE__ */ new Set(["duckdb", "sqlite", "sqlite3", "csv"]);
      if (!Array.isArray(e.formats) || !e.formats.length || e.formats.some((q) => !c.has(q)))
        throw new Error(`Input ${e.id} formats are invalid`);
      return { ...e, path: f, required: h, formats: Array.from(new Set(e.formats)) };
    }
    if (e.kind === "file") {
      if (!Array.isArray(e.extensions) || !e.extensions.length || e.extensions.some((c) => typeof c != "string" || !/^\.[A-Za-z0-9][A-Za-z0-9._-]*$/.test(c)))
        throw new Error(`Input ${e.id} extensions are invalid`);
      return { ...e, path: f, required: h, extensions: e.extensions.map((c) => c.toLowerCase()) };
    }
    throw new Error(`Input ${e.id} kind must be query or file`);
  });
  if (!o.results || typeof o.results != "object" || Array.isArray(o.results)) throw new Error("results must be an object");
  const a = { ...o.results, path: y(o.results.path, "results", "results.path") };
  if (o.parameters != null && !Array.isArray(o.parameters)) throw new Error("parameters must be a list");
  const n = /* @__PURE__ */ new Set(), u = (o.parameters || []).map((e, p) => {
    if (!e || typeof e != "object" || Array.isArray(e)) throw new Error(`parameters[${p}] must be an object`);
    if (typeof e.name != "string" || !/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(e.name)) throw new Error(`parameters[${p}].name is invalid`);
    if (n.has(e.name)) throw new Error(`Duplicate parameter name: ${e.name}`);
    if (n.add(e.name), !["boolean", "integer", "number", "string", "choice"].includes(e.type)) throw new Error(`Parameter ${e.name} type is invalid`);
    if (e.label != null && typeof e.label != "string") throw new Error(`Parameter ${e.name} label must be a string`);
    if (e.help != null && typeof e.help != "string") throw new Error(`Parameter ${e.name} help must be a string`);
    if (e.type === "boolean" && e.default != null && typeof e.default != "boolean") throw new Error(`Parameter ${e.name} default must be boolean`);
    if (e.type === "integer" && e.default != null && !Number.isSafeInteger(e.default)) throw new Error(`Parameter ${e.name} default must be integer`);
    if (e.type === "number" && e.default != null && (typeof e.default != "number" || !Number.isFinite(e.default))) throw new Error(`Parameter ${e.name} default must be numeric`);
    if (e.type === "string" && e.default != null && typeof e.default != "string") throw new Error(`Parameter ${e.name} default must be a string`);
    if (["integer", "number"].includes(e.type)) {
      for (const f of ["minimum", "maximum", "step"])
        if (e[f] != null && (typeof e[f] != "number" || !Number.isFinite(e[f]))) throw new Error(`Parameter ${e.name} ${f} must be numeric`);
      if (e.minimum != null && e.maximum != null && e.minimum > e.maximum) throw new Error(`Parameter ${e.name} minimum exceeds maximum`);
      if (e.step != null && e.step <= 0) throw new Error(`Parameter ${e.name} step must be positive`);
    }
    if (e.type === "choice") {
      if (!e.choices && !e.choices_query) throw new Error(`Parameter ${e.name} requires choices or choices_query`);
      if (e.choices && (!Array.isArray(e.choices) || !e.choices.length || e.choices.some((f) => !["boolean", "number", "string"].includes(typeof f))))
        throw new Error(`Parameter ${e.name} choices must be a non-empty scalar list`);
      if (e.default != null && !["boolean", "number", "string"].includes(typeof e.default)) throw new Error(`Parameter ${e.name} default must be scalar`);
      if (e.choices_query) {
        if (!m.has(e.choices_query.source)) throw new Error(`Parameter ${e.name} choices_query source is unknown`);
        if (typeof e.choices_query.sql != "string" || !e.choices_query.sql.trim()) throw new Error(`Parameter ${e.name} choices_query sql is required`);
        for (const h of ["value_column", "label_column"])
          if (e.choices_query[h] != null && typeof e.choices_query[h] != "string") throw new Error(`Parameter ${e.name} choices_query ${h} must be a string`);
        const f = e.choices_query.limit ?? 100;
        if (!Number.isSafeInteger(f) || f < 1 || f > 1e3) throw new Error(`Parameter ${e.name} choices_query limit must be 1..1000`);
        e = { ...e, choices_query: { ...e.choices_query, limit: f, sql: A(e.choices_query.sql) } };
      }
    }
    return { ...e };
  });
  if (o.requirements != null && (!Array.isArray(o.requirements) || o.requirements.some((e) => typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9._<>=!~,-]*$/.test(e))))
    throw new Error("requirements must contain package requirement strings");
  const i = Array.from(new Set(o.requirements || [])), l = i.map((e) => e.split(/[<>=!~]/, 1)[0].toLowerCase().replace(/[_.]/g, "-")).filter((e) => !g.has(e));
  if (l.length && !s)
    throw new Error(`Unsupported package requirement(s): ${Array.from(new Set(l)).sort().join(", ")}`);
  return { ...o, schema: b, inputs: t, results: a, parameters: u, requirements: i };
}
function O(r, s = !1) {
  var a, n;
  const o = r.cells.filter(
    (u) => {
      var i;
      return u.cell_type === "code" && Array.isArray((i = u.metadata) == null ? void 0 : i.tags) && u.metadata.tags.includes(E);
    }
  );
  if (!o.length) return null;
  if (o.length !== 1 || r.cells[0] !== o[0]) throw new Error("The configuration cell must be the first cell and uniquely tagged omero-analysis-config");
  const m = P(k(_(o[0])), s), t = (n = (a = r.metadata) == null ? void 0 : a.omero_analysis) == null ? void 0 : n.schema_requirements;
  return !t || typeof t != "object" || Array.isArray(t) ? m : {
    ...m,
    inputs: m.inputs.map((u) => {
      var i;
      return u.kind === "query" && ((i = t[u.id]) != null && i.tables) ? { ...u, schema: { tables: t[u.id].tables } } : u;
    })
  };
}
function S(r) {
  const s = { ...r.metadata };
  return delete s.widgets, {
    ...r,
    metadata: s,
    cells: r.cells.map((o) => o.cell_type === "code" ? { ...o, execution_count: null, outputs: [] } : o)
  };
}
function x(r) {
  return Object.fromEntries(r.parameters.map((s) => [s.name, s.default ?? null]));
}
function j(r, s, o = {}) {
  const m = x(r);
  for (const t of r.parameters) {
    const a = s[t.name] ?? m[t.name];
    if (a == null) {
      m[t.name] = null;
      continue;
    }
    if (t.type === "boolean" && typeof a != "boolean") throw new Error(`Parameter ${t.name} must be boolean`);
    if (t.type === "integer" && !Number.isSafeInteger(a)) throw new Error(`Parameter ${t.name} must be integer`);
    if (t.type === "number" && (typeof a != "number" || !Number.isFinite(a))) throw new Error(`Parameter ${t.name} must be numeric`);
    if (t.type === "string" && typeof a != "string") throw new Error(`Parameter ${t.name} must be a string`);
    if ((t.type === "integer" || t.type === "number") && typeof a == "number") {
      if (t.minimum != null && a < t.minimum) throw new Error(`Parameter ${t.name} is below its minimum`);
      if (t.maximum != null && a > t.maximum) throw new Error(`Parameter ${t.name} exceeds its maximum`);
    }
    if (t.type === "choice") {
      const n = t.choices || o[t.name] || [];
      if (n.length && !n.some((u) => Object.is(u, a))) throw new Error(`Parameter ${t.name} is not an available choice`);
    }
    m[t.name] = a;
  }
  return m;
}
function $(r) {
  var s;
  return ((s = r.toLowerCase().match(/(\.[^.\\/]+)$/)) == null ? void 0 : s[1]) || "";
}
function v(r, s, o) {
  return s.filter((m) => m.source !== "result" && !m.deletedAt && m.state === "ready" && C(m.id === o ? { ...r, filename_globs: void 0 } : r, m.name));
}
function C(r, s) {
  var m;
  return (r.kind === "query" ? r.formats.flatMap((t) => t === "sqlite" ? [".sqlite"] : t === "sqlite3" ? [".sqlite3"] : [`.${t}`]) : r.extensions).includes($(s)) ? !r.filename_globs || s.toLowerCase() === ((m = r.path.split(/[\\/]/).at(-1)) == null ? void 0 : m.toLowerCase()) ? !0 : r.filename_globs.some((t) => {
    const a = s.toLowerCase(), n = t.toLowerCase();
    let u = 0, i = 0, l = -1, e = 0;
    for (; u < a.length; )
      if (n[i] === "?" || n[i] === a[u])
        u++, i++;
      else if (n[i] === "*")
        l = i++, e = u;
      else if (l >= 0)
        i = l + 1, u = ++e;
      else return !1;
    for (; n[i] === "*"; ) i++;
    return i === n.length;
  }) : !1;
}
function w(r) {
  const s = r.trim().toLowerCase().replace(/\(.*/, "");
  return /^(varchar|text|str|string|object)$/.test(s) ? "string" : /^(tinyint|smallint|integer|int|bigint|int\d+|uint\d+)$/.test(s) ? "integer" : /^(float\d*|double|real|decimal|numeric)$/.test(s) ? "number" : /^(bool|boolean)$/.test(s) ? "boolean" : s;
}
function N(r, s) {
  var m, t, a;
  if (!(r.kind === "query" ? r.formats.map((n) => `.${n}`) : r.extensions).includes($(s.name))) return { status: "incompatible", reasons: ["File format does not match"] };
  if (r.kind === "query" && ((t = (m = r.schema) == null ? void 0 : m.tables) != null && t.length)) {
    if (!((a = s.schema) != null && a.tables)) return { status: "unchecked", reasons: [`${r.id}: schema not checked`] };
    for (const n of r.schema.tables) {
      const u = s.schema.tables.find((i) => i.name === n.name);
      if (!u) return { status: "incompatible", reasons: [`${r.id}: missing table ${n.name}`] };
      for (const i of n.columns || []) {
        if (!u.columns) return { status: "unchecked", reasons: [`${r.id}: columns not checked for ${n.name}`] };
        const l = u.columns.find((e) => e.name === i.name);
        if (!l)
          return { status: "incompatible", reasons: [`${r.id}: missing column ${n.name}.${i.name}`] };
        if (i.type && !l.type) return { status: "unchecked", reasons: [`${r.id}: type not checked for ${i.name}`] };
        if (i.type && l.type && w(i.type) !== w(l.type))
          return { status: "incompatible", reasons: [`${r.id}: ${i.name} requires ${i.type}, found ${l.type}`] };
      }
    }
  }
  return { status: "compatible", reasons: [] };
}
function L(r, s) {
  if (!r) return { status: "unchecked", reasons: ["Legacy notebook: no portable input contract"] };
  const o = (r.requirements || []).map((n) => n.split(/[<>=!~]/)[0].toLowerCase().replace(/[_.]/g, "-")).filter((n) => !g.has(n));
  if (o.length) return { status: "incompatible", reasons: [`Unsupported packages: ${o.join(", ")}`] };
  const m = [], t = [], a = [];
  (r.requirements || []).some((n) => /[<>=!~]/.test(n)) && t.push("Package version constraints must be checked against the runtime");
  for (const n of r.inputs.filter((u) => u.required)) {
    const u = s.map((l) => N(n, l)), i = u.filter((l) => l.status === "compatible");
    if (i.length)
      i.length > 1 && a.push(`${n.id}: choose between ${i.length} matching inputs`);
    else if (u.some((l) => l.status === "unchecked")) t.push(`${n.id}: schema not checked`);
    else {
      const l = u.flatMap((e) => e.reasons).filter((e) => e !== "File format does not match");
      m.push(...l.length ? [...new Set(l)] : [`Needs a matching input for ${n.id}`]);
    }
  }
  return m.length ? { status: "incompatible", reasons: m } : t.length ? { status: "unchecked", reasons: t } : { status: "compatible", reasons: a.length ? a : ["Declared input requirements match"] };
}
const z = { compatible: "Compatible", incompatible: "Incompatible", unchecked: "Not checked" };
export {
  x as a,
  C as b,
  z as c,
  N as d,
  $ as e,
  v as i,
  L as n,
  O as p,
  S as s,
  j as v
};
