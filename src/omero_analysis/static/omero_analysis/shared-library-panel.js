import { n as A, c as I } from "./notebookCompatibility-gwiA47EZ.js";
async function $(p, O, q) {
  const h = p.querySelector(".oa-shared-library");
  if (!h) return;
  const g = /* @__PURE__ */ new Set();
  let b, k = "", N = !1, w = !0;
  const L = /* @__PURE__ */ new Map(), e = (t, i = "") => {
    const c = document.createElement(t);
    return c.textContent = i, c;
  }, T = () => {
    var t;
    return decodeURIComponent(((t = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/)) == null ? void 0 : t[1]) || "");
  }, x = async (t = !1) => {
    var l, s, r;
    const i = await fetch(q, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", "X-CSRFToken": T() },
      body: JSON.stringify({ object_type: p.dataset.objectType, object_id: Number(p.dataset.objectId) })
    }), c = await i.json();
    if (!i.ok) throw new Error(((l = c.error) == null ? void 0 : l.message) || "Could not authorize shared library");
    const a = await fetch(O + (t ? "?refresh=1" : ""), {
      credentials: "same-origin",
      headers: { "X-OMERO-Analysis-Context": c.context_token }
    }), o = await a.json();
    if (((s = o.error) == null ? void 0 : s.code) === "shared_library_disabled") {
      h.hidden = !0;
      return;
    }
    if (!a.ok) {
      h.replaceChildren(e("p", ((r = o.error) == null ? void 0 : r.message) || "Shared library unavailable"));
      return;
    }
    b = o, h.hidden = !1, p.dataset.sharedSelection = JSON.stringify(S()), _();
  }, S = () => b.items.filter((t) => g.has(t.id) && t.available).map((t) => ({ id: t.id, revision: t.revision, libraryId: b.libraryId })), v = (t) => {
    const i = [
      ...Array.from(p.querySelectorAll(".oa-data-attachment:checked")).map((a) => {
        var o, l, s;
        return {
          id: a.value,
          name: ((s = (l = (o = a.closest("label")) == null ? void 0 : o.querySelector("strong")) == null ? void 0 : l.textContent) == null ? void 0 : s.trim()) || ""
        };
      }),
      ...Array.from(p.querySelectorAll(".oa-staged-attachment:checked")).map((a) => {
        var o, l, s;
        return {
          id: a.value,
          name: ((s = (l = (o = a.closest("label")) == null ? void 0 : o.querySelector("strong")) == null ? void 0 : l.textContent) == null ? void 0 : s.trim()) || ""
        };
      }),
      ...b.items.filter((a) => a.kind === "template" && a.available && g.has(a.id)).map((a) => ({ id: a.id, name: a.name }))
    ];
    t.replaceChildren();
    const c = h.querySelector(".oa-shared-selected-count");
    c && (c.textContent = `${S().length} selected`);
    for (const a of ["template", "notebook"]) {
      const o = e("details");
      o.className = "oa-tree-group", o.open = !!k || (L.get(a) ?? !0), o.addEventListener("toggle", () => {
        k || L.set(a, o.open);
      });
      const l = e("summary"), s = e("span", "›"), r = e("img");
      s.className = "oa-tree-chevron", r.className = "oa-tree-folder", r.src = "/static/webclient/image/folder_yellow16.png", r.alt = "";
      const f = b.items.filter((n) => n.kind === a && n.name.toLowerCase().includes(k)).filter((n) => a !== "notebook" || !N || A(n.contract, i).status === "compatible");
      l.append(s, r, e("strong", a === "template" ? "Plate templates" : "Notebooks"), e("small", String(f.length)));
      const d = e("ul");
      o.append(l, d), t.append(o);
      for (const n of f) {
        const u = A(n.contract, i);
        if (a === "notebook" && N && u.status !== "compatible") continue;
        const m = e("li"), E = e("label"), y = e("input");
        m.className = "oa-library-item", y.setAttribute("aria-label", n.name), y.type = "checkbox", y.checked = g.has(n.id), y.disabled = !n.available, y.addEventListener("change", () => {
          y.checked ? g.add(n.id) : g.delete(n.id), p.dataset.sharedSelection = JSON.stringify(S()), v(t);
        });
        const j = e("span", a === "notebook" ? "NB" : "XLS");
        j.className = `oa-library-kind oa-library-kind-${a}`;
        const C = e("span");
        C.className = "oa-file-details", C.append(e("strong", n.name), e("small", n.available ? a === "notebook" ? `${I[u.status]}: ${u.reasons.join("; ")}` : "Plate template · independent Workspace input" : `Unavailable: ${n.error}`)), E.append(y, j, C), m.append(E), d.append(m);
      }
      f.length || d.append(e("li", "No matching items."));
    }
    b.items.length || t.append(e("p", "No shared items yet."));
  }, _ = () => {
    const t = e("details");
    t.className = "oa-card oa-library-panel", t.open = w, t.addEventListener("toggle", () => {
      w = t.open;
    });
    const i = e("summary");
    i.className = "oa-section-heading";
    const c = e("div"), a = e("span", "+");
    a.className = "oa-step", c.append(a, e("h3", "Shared notebooks and plate templates"));
    const o = e("span");
    o.className = "oa-shared-selected-count", i.append(c, o);
    const l = e("p", "Select shared files to copy into the new Workspace. Existing Workspaces: open Libraries in the Explorer. Shared originals remain unchanged.");
    l.className = "oa-help", t.append(i, l), h.replaceChildren(t);
    const s = e("button", "Refresh shared library");
    s.type = "button", s.className = "oa-button", s.addEventListener("click", () => {
      s.disabled = !0, x(!0).catch((m) => {
        h.append(e("p", String(m))), s.disabled = !1;
      });
    });
    const r = e("input");
    r.type = "search", r.placeholder = "Filter shared notebooks and templates", r.value = k, r.setAttribute("aria-label", "Filter shared library");
    const f = e("label"), d = e("input");
    d.type = "checkbox", d.checked = N, f.append(d, document.createTextNode(" Compatible notebooks only"));
    const n = e("div");
    n.className = "oa-library-tree", n.setAttribute("aria-label", "Shared library items"), r.addEventListener("input", () => {
      k = r.value.toLowerCase(), v(n);
    }), d.addEventListener("change", () => {
      N = d.checked, v(n);
    }), p.onchange = () => v(n);
    const u = e("div");
    if (u.className = "oa-shared-controls", u.append(r, s, f), t.append(u, n), v(n), b.canPublish) {
      const m = e("p", "To publish: open a Workspace → Libraries → Publish to shared library.");
      m.className = "oa-help oa-publish-hint", t.append(m);
    }
  };
  await x();
}
export {
  $ as mountSharedLibrary
};
