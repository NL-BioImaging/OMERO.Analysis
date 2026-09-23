import { compatibilityLabel, notebookCompatibility } from "./notebookCompatibility";
import type { SharedLibraryCatalogue } from "./types";

export async function mountSharedLibrary(root: HTMLElement, endpoint: string, tokenUrl: string) {
  const host = root.querySelector<HTMLElement>(".oa-shared-library");
  if (!host) return;
  const selected = new Set<string>();
  let catalogue: SharedLibraryCatalogue;
  let filter = "", compatibleOnly = false;
  let panelOpen = true;
  const folders = new Map<string, boolean>();
  const node = <K extends keyof HTMLElementTagNameMap>(tag: K, text = "") => {
    const value = document.createElement(tag); value.textContent = text; return value;
  };
  const csrf = () => decodeURIComponent(document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/)?.[1] || "");
  const load = async (refresh = false) => {
    const auth = await fetch(tokenUrl, { method: "POST", credentials: "same-origin",
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrf() },
      body: JSON.stringify({ object_type: root.dataset.objectType, object_id: Number(root.dataset.objectId) }) });
    const token = await auth.json();
    if (!auth.ok) throw new Error(token.error?.message || "Could not authorize shared library");
    const response = await fetch(endpoint + (refresh ? "?refresh=1" : ""), { credentials: "same-origin",
      headers: { "X-OMERO-Analysis-Context": token.context_token } });
    const body = await response.json();
    if (body.error?.code === "shared_library_disabled") { host.hidden = true; return; }
    if (!response.ok) { host.replaceChildren(node("p", body.error?.message || "Shared library unavailable")); return; }
    catalogue = body; host.hidden = false; root.dataset.sharedSelection = JSON.stringify(references()); render();
  };
  const references = () => catalogue.items.filter(i => selected.has(i.id) && i.available)
    .map(i => ({ id: i.id, revision: i.revision, libraryId: catalogue.libraryId }));
  const renderItems = (list: HTMLElement) => {
    const sources = [
      ...Array.from(root.querySelectorAll<HTMLInputElement>(".oa-data-attachment:checked")).map(input => ({
        id: input.value, name: input.closest("label")?.querySelector("strong")?.textContent?.trim() || "" })),
      ...Array.from(root.querySelectorAll<HTMLInputElement>(".oa-staged-attachment:checked")).map(input => ({
        id: input.value, name: input.closest("label")?.querySelector("strong")?.textContent?.trim() || "" })),
      ...catalogue.items.filter(i => i.kind === "template" && i.available && selected.has(i.id)).map(i => ({ id: i.id, name: i.name }))
    ];
    list.replaceChildren();
    const count = host.querySelector(".oa-shared-selected-count");
    if (count) count.textContent = `${references().length} selected`;
    for (const kind of ["template", "notebook"] as const) {
      const folder = node("details"); folder.className = "oa-tree-group";
      folder.open = !!filter || (folders.get(kind) ?? true);
      folder.addEventListener("toggle", () => { if (!filter) folders.set(kind, folder.open); });
      const heading = node("summary"), chevron = node("span", "›"), icon = node("img");
      chevron.className = "oa-tree-chevron"; icon.className = "oa-tree-folder";
      icon.src = "/static/webclient/image/folder_yellow16.png"; icon.alt = "";
      const visible = catalogue.items.filter(i => i.kind === kind && i.name.toLowerCase().includes(filter))
        .filter(i => kind !== "notebook" || !compatibleOnly || notebookCompatibility(i.contract, sources).status === "compatible");
      heading.append(chevron, icon, node("strong", kind === "template" ? "Plate templates" : "Notebooks"), node("small", String(visible.length)));
      const items = node("ul"); folder.append(heading, items); list.append(folder);
      for (const item of visible) {
        const status = notebookCompatibility(item.contract, sources);
        if (kind === "notebook" && compatibleOnly && status.status !== "compatible") continue;
        const row = node("li"), label = node("label"), check = node("input");
        row.className = "oa-library-item"; check.setAttribute("aria-label", item.name);
        check.type = "checkbox"; check.checked = selected.has(item.id); check.disabled = !item.available;
        check.addEventListener("change", () => {
          check.checked ? selected.add(item.id) : selected.delete(item.id);
          root.dataset.sharedSelection = JSON.stringify(references()); renderItems(list);
        });
        const badge = node("span", kind === "notebook" ? "NB" : "XLS"); badge.className = `oa-library-kind oa-library-kind-${kind}`;
        const copy = node("span"); copy.className = "oa-file-details";
        copy.append(node("strong", item.name), node("small", !item.available ? `Unavailable: ${item.error}` : kind === "notebook"
          ? `${compatibilityLabel[status.status]}: ${status.reasons.join("; ")}` : "Plate template · independent Workspace input"));
        label.append(check, badge, copy); row.append(label); items.append(row);
      }
      if (!visible.length) items.append(node("li", "No matching items."));
    }
    if (!catalogue.items.length) list.append(node("p", "No shared items yet."));
  };
  const render = () => {
    const panel = node("details"); panel.className = "oa-card oa-library-panel"; panel.open = panelOpen;
    panel.addEventListener("toggle", () => { panelOpen = panel.open; });
    const summary = node("summary"); summary.className = "oa-section-heading";
    const title = node("div"), step = node("span", "+"); step.className = "oa-step";
    title.append(step, node("h3", "Shared notebooks and plate templates"));
    const count = node("span"); count.className = "oa-shared-selected-count"; summary.append(title, count);
    const help = node("p", "Select shared files to copy into the new Workspace. Existing Workspaces: open Libraries in the Explorer. Shared originals remain unchanged."); help.className = "oa-help";
    panel.append(summary, help); host.replaceChildren(panel);
    const refresh = node("button", "Refresh shared library"); refresh.type = "button";
    refresh.className = "oa-button";
    refresh.addEventListener("click", () => { refresh.disabled = true; void load(true).catch(e => { host.append(node("p", String(e))); refresh.disabled = false; }); });
    const search = node("input"); search.type = "search"; search.placeholder = "Filter shared notebooks and templates"; search.value = filter;
    search.setAttribute("aria-label", "Filter shared library");
    const label = node("label"), only = node("input"); only.type = "checkbox"; only.checked = compatibleOnly;
    label.append(only, document.createTextNode(" Compatible notebooks only"));
    const list = node("div"); list.className = "oa-library-tree"; list.setAttribute("aria-label", "Shared library items");
    search.addEventListener("input", () => { filter = search.value.toLowerCase(); renderItems(list); });
    only.addEventListener("change", () => { compatibleOnly = only.checked; renderItems(list); });
    root.onchange = () => renderItems(list);
    const toolbar = node("div"); toolbar.className = "oa-shared-controls"; toolbar.append(search, refresh, label);
    panel.append(toolbar, list); renderItems(list);
    if (catalogue.canPublish) { const hint = node("p", "To publish: open a Workspace → Libraries → Publish to shared library."); hint.className = "oa-help oa-publish-hint"; panel.append(hint); }
  };
  await load();
}
