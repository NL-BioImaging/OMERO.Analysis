import {fireEvent,render,screen} from "@testing-library/react";
import {WorkspaceExplorer} from "./WorkspaceExplorer";
import type {NotebookRecord,WorkspaceFile} from "../types";
it("selects several items without opening them, removes only those items, and exposes undo",()=>{
  const remove=vi.fn(), open=vi.fn(), undo=vi.fn();
  const inputs=[{id:"input",name:"template.xlsx",size:1,source:"local",state:"ready"}] as WorkspaceFile[];
  const notebooks=[{id:"nb",name:"counts.ipynb"}] as NotebookRecord[];
  const results=[{id:"png",name:"counts.png",size:10,source:"result",state:"ready",notebookId:"nb",logicalPath:"results/counts.png"},{id:"csv",name:"counts.csv",size:10,source:"result",state:"ready",notebookId:"nb",logicalPath:"results/counts.csv"}] as WorkspaceFile[];
  render(<WorkspaceExplorer name="Fixture" inputs={inputs} notebooks={notebooks} results={results} query="" onQuery={()=>{}}
    compatibility={{}} selectedFileId={null} selectedNotebookId={null} onFile={open} onNotebook={open} onAttach={()=>{}} onRefresh={()=>{}} onDropFiles={()=>{}} onDelete={remove} onUndo={undo} canUndo />);
  expect(screen.getByRole("button",{name:"counts.png"}).closest(".explorer-notebook")).toHaveTextContent("counts.ipynb");
  fireEvent.click(screen.getByRole("checkbox",{name:"Select template.xlsx"}));
  fireEvent.click(screen.getByRole("checkbox",{name:"Select counts.ipynb"}));
  expect(open).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button",{name:"Remove selected items"}));
  expect(remove).toHaveBeenCalledWith([{kind:"file",id:"input"},{kind:"notebook",id:"nb"}]);
  fireEvent.click(screen.getByRole("button",{name:"Undo last removal"}));
  expect(undo).toHaveBeenCalled();
});

it("keeps database and CSV inputs inspectable without deletion controls or bulk selection", () => {
  const onFile=vi.fn(), remove=vi.fn();
  const inputs=["input.duckdb","input.sqlite","input.sqlite3","input.db","input.csv","input.tsv","plate.xlsx"].map((name,index)=>({id:String(index),name,source:"omero",state:"ready",size:1})) as WorkspaceFile[];
  render(<WorkspaceExplorer name="Fixture" inputs={inputs} notebooks={[]} results={[]} query="" onQuery={()=>{}}
    compatibility={{}} selectedFileId={null} selectedNotebookId={null} onFile={onFile} onNotebook={()=>{}} onAttach={()=>{}} onRefresh={()=>{}} onDropFiles={()=>{}} onDelete={remove} />);
  for(const file of inputs.slice(0,-1)) {
    expect(screen.queryByRole("checkbox",{name:`Select ${file.name}`})).toBeNull();
    fireEvent.contextMenu(screen.getByRole("button",{name:file.name}));
    expect(screen.queryByRole("menu")).toBeNull();
  }
  fireEvent.click(screen.getByRole("button",{name:"input.csv"})); expect(onFile).toHaveBeenCalledWith("4");
  fireEvent.click(screen.getByRole("checkbox",{name:"Select all workspace items"}));
  fireEvent.click(screen.getByRole("button",{name:"Remove selected items"}));
  expect(remove).toHaveBeenCalledWith([{kind:"file",id:"6"}]);
});

it("keeps recorded runs and parameters in tooltips without crowding result names",()=>{
  const notebooks:NotebookRecord[]=[{id:"nb",name:"counts.ipynb",workspaceId:"w",document:{nbformat:4,nbformat_minor:5,metadata:{},cells:[]},attachmentIds:[],selectedDataFileIds:[],createdAt:"2026-10-21",updatedAt:"2026-10-21",parameterValues:{minimum:99},protocolRuns:[
    {id:"one",startedAt:"2026-10-21T12:00:00Z",parameters:{minimum:1},status:"success",sources:[],outputs:[]},
    {id:"two",startedAt:"2026-10-21T13:00:00Z",parameters:{minimum:2},status:"success",sources:[],outputs:[]}]}] as NotebookRecord[];
  const results=["one","two"].map(id=>({id,name:"counts.csv",size:10,source:"result",state:"ready",notebookId:"nb",notebookRunId:id,logicalPath:"results/counts.csv"})) as WorkspaceFile[];
  const {rerender}=render(<WorkspaceExplorer name="Fixture" inputs={[]} notebooks={notebooks} results={results} query="" onQuery={()=>{}}
    compatibility={{}} selectedFileId={null} selectedNotebookId={null} onFile={()=>{}} onNotebook={()=>{}} onAttach={()=>{}} onRefresh={()=>{}} onDropFiles={()=>{}} onDelete={()=>{}} />);
  const first=screen.getByText("Result set 1").closest("summary")!;
  const second=screen.getByText("Result set 2").closest("summary")!;
  expect(first).toHaveAttribute("title",expect.stringContaining("minimum=2"));
  expect(second).toHaveAttribute("title",expect.stringContaining("minimum=1"));
  expect(first).not.toHaveTextContent("Parameters:");
  expect(first).not.toHaveTextContent("Run ");
  expect(screen.queryByText("Parameters: minimum=99")).toBeNull();
  fireEvent.click(first);
  expect(first).toBeVisible();
  expect(first).toHaveAttribute("title",expect.stringContaining("minimum=2"));
  rerender(<WorkspaceExplorer name="Fixture" inputs={[]} notebooks={notebooks} results={results.slice(0,1)} query="" onQuery={()=>{}}
    compatibility={{}} selectedFileId={null} selectedNotebookId={null} onFile={()=>{}} onNotebook={()=>{}} onAttach={()=>{}} onRefresh={()=>{}} onDropFiles={()=>{}} onDelete={()=>{}} />);
  expect(screen.queryByText("Result set 1")).toBeNull();
  expect(screen.getByText("Results").closest("summary")).toHaveAttribute("title",expect.stringContaining("minimum=1"));
  expect(screen.getByRole("button",{name:"counts.csv"})).toHaveAttribute("title",expect.stringContaining("minimum=1"));

});
