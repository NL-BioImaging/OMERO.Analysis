const y = "nl.bioimaging.omero-analysis-notebook.v1", E = "omero-analysis-config", g = /* @__PURE__ */ new Set([
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
function b(r, s, o) {
  if (typeof r != "string" || !r.trim()) throw new Error(`${o} must be a relative path`);
  const n = r.replace(/\\/g, "/"), t = n.split("/");
  if (n.startsWith("/") || t[0] !== s || t.includes(".."))
    throw new Error(`${o} must stay inside ${s}/`);
  return n;
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
  if (o.schema !== y) throw new Error(`schema must equal ${y}`);
  if (!Array.isArray(o.inputs) || !o.inputs.length) throw new Error("inputs must be a non-empty list");
  const n = /* @__PURE__ */ new Set(), t = o.inputs.map((e, h) => {
    if (!e || typeof e != "object" || Array.isArray(e)) throw new Error(`inputs[${h}] must be an object`);
    if (typeof e.id != "string" || !/^[a-z][a-z0-9_-]{0,63}$/.test(e.id)) throw new Error(`inputs[${h}].id is invalid`);
    if (n.has(e.id)) throw new Error(`Duplicate input id: ${e.id}`);
    n.add(e.id);
    const f = b(e.path, "input", `Input ${e.id} path`), c = e.required ?? !0;
    if (typeof c != "boolean") throw new Error(`Input ${e.id} required must be boolean`);
    if (e.kind === "query") {
      const p = /* @__PURE__ */ new Set(["duckdb", "sqlite", "sqlite3", "csv"]);
      if (!Array.isArray(e.formats) || !e.formats.length || e.formats.some((q) => !p.has(q)))
        throw new Error(`Input ${e.id} formats are invalid`);
      return { ...e, path: f, required: c, formats: Array.from(new Set(e.formats)) };
    }
    if (e.kind === "file") {
      if (!Array.isArray(e.extensions) || !e.extensions.length || e.extensions.some((p) => typeof p != "string" || !/^\.[A-Za-z0-9][A-Za-z0-9._-]*$/.test(p)))
        throw new Error(`Input ${e.id} extensions are invalid`);
      return { ...e, path: f, required: c, extensions: e.extensions.map((p) => p.toLowerCase()) };
    }
    throw new Error(`Input ${e.id} kind must be query or file`);
  });
  if (!o.results || typeof o.results != "object" || Array.isArray(o.results)) throw new Error("results must be an object");
  const m = { ...o.results, path: b(o.results.path, "results", "results.path") };
  if (o.parameters != null && !Array.isArray(o.parameters)) throw new Error("parameters must be a list");
  const i = /* @__PURE__ */ new Set(), u = (o.parameters || []).map((e, h) => {
    if (!e || typeof e != "object" || Array.isArray(e)) throw new Error(`parameters[${h}] must be an object`);
    if (typeof e.name != "string" || !/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(e.name)) throw new Error(`parameters[${h}].name is invalid`);
    if (i.has(e.name)) throw new Error(`Duplicate parameter name: ${e.name}`);
    if (i.add(e.name), !["boolean", "integer", "number", "string", "choice"].includes(e.type)) throw new Error(`Parameter ${e.name} type is invalid`);
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
        if (!n.has(e.choices_query.source)) throw new Error(`Parameter ${e.name} choices_query source is unknown`);
        if (typeof e.choices_query.sql != "string" || !e.choices_query.sql.trim()) throw new Error(`Parameter ${e.name} choices_query sql is required`);
        for (const c of ["value_column", "label_column"])
          if (e.choices_query[c] != null && typeof e.choices_query[c] != "string") throw new Error(`Parameter ${e.name} choices_query ${c} must be a string`);
        const f = e.choices_query.limit ?? 100;
        if (!Number.isSafeInteger(f) || f < 1 || f > 1e3) throw new Error(`Parameter ${e.name} choices_query limit must be 1..1000`);
        e = { ...e, choices_query: { ...e.choices_query, limit: f, sql: A(e.choices_query.sql) } };
      }
    }
    return { ...e };
  });
  if (o.requirements != null && (!Array.isArray(o.requirements) || o.requirements.some((e) => typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9._<>=!~,-]*$/.test(e))))
    throw new Error("requirements must contain package requirement strings");
  const a = Array.from(new Set(o.requirements || [])), l = a.map((e) => e.split(/[<>=!~]/, 1)[0].toLowerCase().replace(/[_.]/g, "-")).filter((e) => !g.has(e));
  if (l.length && !s)
    throw new Error(`Unsupported package requirement(s): ${Array.from(new Set(l)).sort().join(", ")}`);
  return { ...o, schema: y, inputs: t, results: m, parameters: u, requirements: a };
}
function S(r, s = !1) {
  var m, i;
  const o = r.cells.filter(
    (u) => {
      var a;
      return u.cell_type === "code" && Array.isArray((a = u.metadata) == null ? void 0 : a.tags) && u.metadata.tags.includes(E);
    }
  );
  if (!o.length) return null;
  if (o.length !== 1 || r.cells[0] !== o[0]) throw new Error("The configuration cell must be the first cell and uniquely tagged omero-analysis-config");
  const n = P(k(_(o[0])), s), t = (i = (m = r.metadata) == null ? void 0 : m.omero_analysis) == null ? void 0 : i.schema_requirements;
  return !t || typeof t != "object" || Array.isArray(t) ? n : {
    ...n,
    inputs: n.inputs.map((u) => {
      var a;
      return u.kind === "query" && ((a = t[u.id]) != null && a.tables) ? { ...u, schema: { tables: t[u.id].tables } } : u;
    })
  };
}
function N(r) {
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
function C(r, s, o = {}) {
  const n = x(r);
  for (const t of r.parameters) {
    const m = s[t.name] ?? n[t.name];
    if (m == null) {
      n[t.name] = null;
      continue;
    }
    if (t.type === "boolean" && typeof m != "boolean") throw new Error(`Parameter ${t.name} must be boolean`);
    if (t.type === "integer" && !Number.isSafeInteger(m)) throw new Error(`Parameter ${t.name} must be integer`);
    if (t.type === "number" && (typeof m != "number" || !Number.isFinite(m))) throw new Error(`Parameter ${t.name} must be numeric`);
    if (t.type === "string" && typeof m != "string") throw new Error(`Parameter ${t.name} must be a string`);
    if ((t.type === "integer" || t.type === "number") && typeof m == "number") {
      if (t.minimum != null && m < t.minimum) throw new Error(`Parameter ${t.name} is below its minimum`);
      if (t.maximum != null && m > t.maximum) throw new Error(`Parameter ${t.name} exceeds its maximum`);
    }
    if (t.type === "choice") {
      const i = t.choices || o[t.name] || [];
      if (i.length && !i.some((u) => Object.is(u, m))) throw new Error(`Parameter ${t.name} is not an available choice`);
    }
    n[t.name] = m;
  }
  return n;
}
function $(r) {
  var s;
  return ((s = r.toLowerCase().match(/(\.[^.\\/]+)$/)) == null ? void 0 : s[1]) || "";
}
function j(r, s) {
  const o = r.kind === "query" ? r.formats.flatMap((n) => n === "sqlite" ? [".sqlite"] : n === "sqlite3" ? [".sqlite3"] : [`.${n}`]) : r.extensions;
  return s.filter((n) => n.source !== "result" && !n.deletedAt && n.state === "ready" && o.includes($(n.name)));
}
function w(r) {
  const s = r.trim().toLowerCase().replace(/\(.*/, "");
  return /^(varchar|text|str|string|object)$/.test(s) ? "string" : /^(tinyint|smallint|integer|int|bigint|int\d+|uint\d+)$/.test(s) ? "integer" : /^(float\d*|double|real|decimal|numeric)$/.test(s) ? "number" : /^(bool|boolean)$/.test(s) ? "boolean" : s;
}
function O(r, s) {
  var n, t, m;
  if (!(r.kind === "query" ? r.formats.map((i) => `.${i}`) : r.extensions).includes($(s.name))) return { status: "incompatible", reasons: ["File format does not match"] };
  if (r.kind === "query" && ((t = (n = r.schema) == null ? void 0 : n.tables) != null && t.length)) {
    if (!((m = s.schema) != null && m.tables)) return { status: "unchecked", reasons: [`${r.id}: schema not checked`] };
    for (const i of r.schema.tables) {
      const u = s.schema.tables.find((a) => a.name === i.name);
      if (!u) return { status: "incompatible", reasons: [`${r.id}: missing table ${i.name}`] };
      for (const a of i.columns || []) {
        if (!u.columns) return { status: "unchecked", reasons: [`${r.id}: columns not checked for ${i.name}`] };
        const l = u.columns.find((e) => e.name === a.name);
        if (!l)
          return { status: "incompatible", reasons: [`${r.id}: missing column ${i.name}.${a.name}`] };
        if (a.type && !l.type) return { status: "unchecked", reasons: [`${r.id}: type not checked for ${a.name}`] };
        if (a.type && l.type && w(a.type) !== w(l.type))
          return { status: "incompatible", reasons: [`${r.id}: ${a.name} requires ${a.type}, found ${l.type}`] };
      }
    }
  }
  return { status: "compatible", reasons: [] };
}
function v(r, s) {
  if (!r) return { status: "unchecked", reasons: ["Legacy notebook: no portable input contract"] };
  const o = (r.requirements || []).map((i) => i.split(/[<>=!~]/)[0].toLowerCase().replace(/[_.]/g, "-")).filter((i) => !g.has(i));
  if (o.length) return { status: "incompatible", reasons: [`Unsupported packages: ${o.join(", ")}`] };
  const n = [], t = [], m = [];
  (r.requirements || []).some((i) => /[<>=!~]/.test(i)) && t.push("Package version constraints must be checked against the runtime");
  for (const i of r.inputs.filter((u) => u.required)) {
    const u = s.map((l) => O(i, l)), a = u.filter((l) => l.status === "compatible");
    if (a.length)
      a.length > 1 && m.push(`${i.id}: choose between ${a.length} matching inputs`);
    else if (u.some((l) => l.status === "unchecked")) t.push(`${i.id}: schema not checked`);
    else {
      const l = u.flatMap((e) => e.reasons).filter((e) => e !== "File format does not match");
      n.push(...l.length ? [...new Set(l)] : [`Needs a matching input for ${i.id}`]);
    }
  }
  return n.length ? { status: "incompatible", reasons: n } : t.length ? { status: "unchecked", reasons: t } : { status: "compatible", reasons: m.length ? m : ["Declared input requirements match"] };
}
const z = { compatible: "Compatible", incompatible: "Incompatible", unchecked: "Not checked" };
export {
  x as a,
  O as b,
  z as c,
  $ as e,
  j as i,
  v as n,
  S as p,
  N as s,
  C as v
};
