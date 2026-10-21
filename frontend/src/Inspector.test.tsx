import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Inspector } from "./Inspector";
import type { Bootstrap, WorkspaceFile } from "./types";
import type { OmeroBridge } from "./api";

const mocked = vi.hoisted(() => ({ profile: vi.fn(), run: vi.fn(), sync: vi.fn(), stop: vi.fn(), start: vi.fn(), configure: vi.fn() }));
vi.mock("./runtime", () => ({ PythonRuntime: class {
  start = mocked.start;
  stop = mocked.stop;
  syncInputs = mocked.sync;
  dispose = () => {};
  configureNotebook = mocked.configure;
  profileInputs = mocked.profile;
  runNotebookCell = mocked.run;
} }));

const internal = { path: "/input/.omero", format: "omero", size: 0, summary: {} };
const fixture = (name: string): WorkspaceFile => ({ id: "input", workspaceId: "test", name, logicalPath: `Input/${name}`, type: "application/octet-stream", size: 1, sha256: "test", createdAt: "2026-10-20T12:00:00Z", data: new ArrayBuffer(1), state: "ready", source: "local" });
function show(name: string) {
  return render(<Inspector file={fixture(name)} bootstrap={{ runtimeBase: "/runtime", context: null } as Bootstrap}
    bridge={{} as OmeroBridge} theme="light" onAttach={() => {}} onNotebook={() => {}} onDownload={() => {}} />);
}

it("shows the selected workbook's sheets even when another profile precedes it", async () => {
  mocked.profile.mockImplementation(async (sheets: Record<string, string> = {}) => {
    const sheet = sheets["fixture_.xlsx"] || "Measurements";
    return [internal, { path: "/input/fixture_.xlsx", format: "xlsx", size: 5, summary: {
      sheets: ["Measurements", "Notes"], sheet,
      preview: { columns: [sheet === "Notes" ? "description" : "well"], data: [[sheet === "Notes" ? "Synthetic note" : "A1"]] }
    } }];
  });
  show("fixture+.xlsx");
  const selector = await screen.findByLabelText("Spreadsheet sheet");
  expect(selector).toHaveTextContent("Measurements");
  expect(selector).toHaveTextContent("Notes");
  fireEvent.change(selector, { target: { value: "Notes" } });
  await screen.findByText("Synthetic note");
  expect(selector).toHaveValue("Notes");
  expect(mocked.profile).toHaveBeenLastCalledWith({"fixture_.xlsx":"Notes"});
});

it("derives local CSV columns from that file rather than an internal profile", async () => {
  mocked.profile.mockResolvedValue([internal, { path: "/input/fixture.csv", format: "csv", size: 5,
    summary: { preview: { columns: ["well", "count"], data: [["A1", "12"]] } } }]);
  mocked.run.mockResolvedValue({ preview: { columns: ["well", "count"], data: [["A1", "12"]] } });
  show("fixture.csv");
  await waitFor(() => expect(screen.getByLabelText("Filter column")).toHaveTextContent("well"));
  expect(screen.getByLabelText("Filter column")).toHaveTextContent("count");
  await screen.findByText("A1");
});

it("reports the selected file's parser error instead of claiming its preview is ready", async () => {
  mocked.profile.mockResolvedValue([internal, { path: "/input/fixture.xlsx", format: "xlsx", size: 5,
    summary: {}, error: "Workbook is damaged" }]);
  show("fixture.xlsx");
  expect(await screen.findByRole("alert")).toHaveTextContent("Workbook is damaged");
  expect(screen.queryByText("Preview ready.")).not.toBeInTheDocument();
});

it("keeps the Inspector runtime alive when changing local input", async () => {
  mocked.stop.mockClear(); mocked.start.mockClear(); mocked.sync.mockClear();
  mocked.profile.mockResolvedValue([
    {path:"/input/first.xlsx",format:"xlsx",size:1,summary:{preview:{columns:["first"],data:[["one"]]}}},
    {path:"/input/second.xlsx",format:"xlsx",size:1,summary:{preview:{columns:["second"],data:[["two"]]}}}
  ]);
  const bootstrap = {runtimeBase:"/runtime",context:null} as Bootstrap;
  const bridge = {} as OmeroBridge;
  const props = {bootstrap,bridge,theme:"light" as const,onAttach:()=>{},onNotebook:()=>{},onDownload:()=>{}};
  const view = render(<Inspector {...props} file={{...fixture("first.xlsx"),id:"first"}} />);
  await screen.findByText("one");
  view.rerender(<Inspector {...props} file={{...fixture("second.xlsx"),id:"second"}} />);
  await screen.findByText("two");
  expect(mocked.sync).toHaveBeenCalledTimes(2);
  expect(mocked.stop).not.toHaveBeenCalled();
  expect(mocked.start).not.toHaveBeenCalled();
});

it("previews ordinary images without loading Python", async () => {
  mocked.sync.mockClear(); mocked.profile.mockClear(); mocked.start.mockClear();
  show("picture.png");
  await screen.findByText("Preview ready.");
  expect(mocked.sync).not.toHaveBeenCalled();
  expect(mocked.profile).not.toHaveBeenCalled();
  expect(mocked.start).not.toHaveBeenCalled();
});

it("restarts a failed local sandbox only when Retry is requested", async () => {
  mocked.stop.mockClear(); mocked.sync.mockRejectedValueOnce(new Error("The Python sandbox did not load within 60 seconds")).mockResolvedValue(undefined);
  mocked.profile.mockResolvedValue([{path:"/input/fixture.xlsx",format:"xlsx",size:1,summary:{preview:{columns:["recovered"],data:[["Recovered preview"]]}}}]);
  show("fixture.xlsx");
  await screen.findByRole("alert");
  expect(mocked.stop).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button",{name:"Retry inspection"}));
  await screen.findByText("Recovered preview");
  expect(mocked.stop).toHaveBeenCalledTimes(1);
});


it('keeps file previews free of source provenance and viewer links', async () => {
  show('plot.png');
  await screen.findByText('Preview ready.');
  expect(screen.queryByText(/Source:|Browser-local preview/)).not.toBeInTheDocument();
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});

it.each([["png","image/png"],["svg","image/svg+xml"],["mp4","video/mp4"]])("offers one working download action for %s previews", async(extension,type)=>{
  const file={...fixture(`plot.${extension}`),type};
  const download=vi.fn();
  render(<Inspector file={file} bootstrap={{runtimeBase:"/runtime",context:null} as Bootstrap}
    bridge={{} as OmeroBridge} theme="light" onAttach={()=>{}} onNotebook={()=>{}} onDownload={download}/>);
  await screen.findByText("Preview ready.");
  expect(screen.getAllByRole("button",{name:/^(Download|PNG|SVG|MP4)$/})).toHaveLength(1);
  fireEvent.click(screen.getByRole("button",{name:"Download"}));
  expect(download).toHaveBeenCalledExactlyOnceWith(file);
  expect(screen.getByRole("button",{name:"Open full view"})).toBeVisible();
});

it("inspects a result CSV using its runtime filename while retaining the original display name",async()=>{
  mocked.configure.mockClear();
  mocked.profile.mockResolvedValue([{path:"/input/marker__cells.csv",format:"csv",size:5,
    summary:{preview:{columns:["well","count"],data:[["A1",12]]}}}]);
  mocked.run.mockResolvedValue({preview:{columns:["well","count"],data:[["A1",12]]}});
  show("marker+_cells.csv");
  await screen.findByText("A1");
  expect(screen.getByRole("heading",{name:"marker+_cells.csv"})).toBeVisible();
  expect(mocked.configure).toHaveBeenCalledWith(expect.objectContaining({bindings:[expect.objectContaining({path:"/input/marker__cells.csv",name:"marker+_cells.csv"})]}));
  expect(screen.queryByRole("alert")).toBeNull();
});

it("automatically inspects result bytes recovered after selecting the remote file",async()=>{
  const file=fixture("recovered.csv");
  const props={bootstrap:{runtimeBase:"/runtime",context:null} as Bootstrap,bridge:{} as OmeroBridge,theme:"light" as const,onAttach:()=>{},onNotebook:()=>{},onDownload:()=>{}};
  mocked.profile.mockResolvedValue([{path:"/input/recovered.csv",format:"csv",size:5,summary:{preview:{columns:["count"],data:[[42]]}}}]);
  mocked.run.mockResolvedValue({preview:{columns:["count"],data:[[42]]}});
  const view=render(<Inspector {...props} file={{...file,data:undefined}}/>);
  await screen.findByRole("alert");
  view.rerender(<Inspector {...props} file={file}/>);
  await screen.findByText("42");
  expect(screen.queryByRole("alert")).toBeNull();
});

it("does not make a local CSV wait for the previously selected remote database",async()=>{
  let finishRemote:(schema:unknown)=>void=()=>{};
  const bridge={remoteSchema:vi.fn(()=>new Promise(resolve=>{finishRemote=resolve;}))} as unknown as OmeroBridge;
  const props={bootstrap:{runtimeBase:"/runtime",context:null} as Bootstrap,bridge,theme:"light" as const,onAttach:()=>{},onNotebook:()=>{},onDownload:()=>{}};
  mocked.profile.mockResolvedValue([{path:"/input/local.csv",format:"csv",size:5,summary:{preview:{columns:["count"],data:[[42]]}}}]);
  mocked.run.mockResolvedValue({preview:{columns:["count"],data:[[42]]}});
  const remote={...fixture("remote.duckdb"),id:"remote",data:undefined,annotationId:752,dataQueryMode:"remote" as const};
  const view=render(<Inspector {...props} file={remote}/>);
  await waitFor(()=>expect(bridge.remoteSchema).toHaveBeenCalled());
  view.rerender(<Inspector {...props} file={fixture("local.csv")}/>);
  await screen.findByText("42");
  finishRemote({tables:[{name:"obsolete_remote_table"}]});
  await waitFor(()=>expect(screen.getByLabelText("Table or view")).toHaveValue("data"));
  expect(screen.queryByText("obsolete_remote_table")).toBeNull();
});
