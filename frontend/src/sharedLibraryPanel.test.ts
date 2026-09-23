import { mountSharedLibrary } from "./sharedLibraryPanel";

afterEach(() => { vi.unstubAllGlobals(); document.body.replaceChildren(); });
it("keeps middle-pane choices as references, updates compatibility on selection and refresh", async () => {
  document.body.innerHTML = `<section data-user-id="0" data-group-id="0" data-object-type="Screen" data-object-id="152">
    <label><input class="oa-data-attachment" type="checkbox"><strong>data.csv</strong></label>
    <div class="oa-shared-library"></div></section>`;
  let revision = "old";
  vi.stubGlobal("fetch", vi.fn(async (url: string) => ({ ok: true, json: async () => url === "/token/"
    ? { context_token: "token" }
    : { libraryId: "lib", available: true, canPublish: false, items: [
      { id: "n", kind: "notebook", name: "Notebook.ipynb", available: true, revision, contract: null },
      { id: "t", kind: "template", name: "layout.csv", available: true, revision }
    ] } })));
  const root = document.querySelector("section")!;
  await mountSharedLibrary(root, "/catalogue/", "/token/");
  expect(root.querySelector(".oa-shared-library details")).toHaveClass("oa-library-panel");
  expect(root.querySelectorAll(".oa-tree-group")).toHaveLength(2);
  const check = root.querySelectorAll<HTMLInputElement>(".oa-shared-library input[type=checkbox]")[1];
  check.click();
  expect(JSON.parse(root.dataset.sharedSelection!)).toEqual([{ id: "t", revision: "old", libraryId: "lib" }]);
  expect(root.querySelector(".oa-shared-selected-count")).toHaveTextContent("1 selected");
  revision = "new";
  root.querySelector<HTMLButtonElement>("button")!.click();
  await vi.waitFor(() => expect(root.dataset.sharedSelection).toContain('"revision":"new"'));
});
