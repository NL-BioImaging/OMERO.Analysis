import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SharedLibrary } from "./SharedLibrary";
import type { OmeroBridge } from "../api";
import type { AnalysisWorkspace, SharedLibraryCatalogue } from "../types";

const workspace = { workspace: { id: "workspace" }, files: [], notebooks: [] } as unknown as AnalysisWorkspace;
const catalogue: SharedLibraryCatalogue = { available: true, libraryId: "lib", canPublish: false, items: [
  { id: "n", name: "Legacy.ipynb", kind: "notebook", revision: "rev", sha256: "rev", available: true, size: 40, error: "", revisionCount: 1 },
  { id: "t", name: "layout.csv", kind: "template", revision: "rev", sha256: "rev", available: true, size: 20, error: "", revisionCount: 1 }
] };
afterEach(cleanup);
function mount(value = catalogue, initialSelection: Array<{ id: string; revision: string; libraryId: string }> = []) {
  const bridge = { sharedLibrary: vi.fn(async () => value) } as unknown as OmeroBridge;
  const onImport = vi.fn(async () => {});
  render(<SharedLibrary bridge={bridge} workspace={workspace} onImport={onImport} inspectLocal={async () => ({})} initialSelection={initialSelection} />);
  return onImport;
}
it("shows legacy notebooks by default and imports explicit templates", async () => {
  const imported = mount();
  await screen.findByText("Legacy.ipynb");
  expect(screen.getByText(/Not checked/)).toBeVisible();
  expect(screen.queryByText("Publish to shared library")).not.toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("layout.csv"));
  fireEvent.click(screen.getByRole("button", { name: "Import selected shared items" }));
  await waitFor(() => expect(imported).toHaveBeenCalledWith("lib", [catalogue.items[1]]));
});
it("revalidates handoff revisions and never silently imports changed selections", async () => {
  const imported = mount(catalogue, [{ libraryId: "lib", id: "n", revision: "old" }]);
  await screen.findByRole("alert");
  expect(screen.getByLabelText("Legacy.ipynb")).not.toBeChecked();
  expect(imported).not.toHaveBeenCalled();
});
it("hides disabled mode and explains blocked capability", async () => {
  mount({ ...catalogue, available: false, disabled: true, items: [] });
  await waitFor(() => expect(screen.queryByRole("region", { name: "Shared library" })).not.toBeInTheDocument());
  cleanup();
  mount({ ...catalogue, available: false, error: "Group Folder Mapping unavailable", items: [] });
  expect(await screen.findByRole("status")).toHaveTextContent("Group Folder Mapping unavailable");
});
it("keeps selection when its panel is collapsed, refreshed, and reopened", async () => {
  mount();
  fireEvent.click(await screen.findByLabelText("layout.csv"));
  const heading = screen.getByText("Shared notebooks and plate templates");
  const panel = heading.closest("details")!;
  fireEvent.click(heading);
  expect(panel).not.toHaveAttribute("open");
  fireEvent.click(heading);
  fireEvent.click(screen.getByRole("button", { name: "Refresh shared library" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Refresh shared library" })).toBeEnabled());
  expect(screen.getByLabelText("layout.csv")).toBeChecked();
  expect(screen.getByText("1 selected")).toBeVisible();
  expect(screen.getByText("Plate templates").closest("details")).toHaveClass("library-tree-group");
});
