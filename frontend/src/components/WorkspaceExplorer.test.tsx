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
