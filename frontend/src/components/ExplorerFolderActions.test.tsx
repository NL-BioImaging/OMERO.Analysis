import {fireEvent,render,screen,within} from "@testing-library/react";
import {WorkspaceExplorer} from "./WorkspaceExplorer";
import type {NotebookRecord,WorkspaceFile} from "../types";

function fixture(options: {query?:string; busy?:boolean} = {}) {
  const remove=vi.fn(), open=vi.fn();
  const inputs=[{id:"input",name:"template.xlsx",size:1,source:"local",state:"ready"}] as WorkspaceFile[];
  const notebooks=[{id:"nb",name:"counts.ipynb"},{id:"other",name:"other.ipynb"}] as NotebookRecord[];
  const results=[
    ...["png","csv","svg"].map(extension=>({id:extension,name:`counts.${extension}`,size:10,source:"result",state:"ready",notebookId:"nb",logicalPath:`results/counts.${extension}`})),
    {id:"quality",name:"quality.csv",size:10,source:"result",state:"ready",notebookId:"nb",logicalPath:"results/quality.csv"},
    {id:"other-result",name:"other.csv",size:10,source:"result",state:"ready",notebookId:"other",logicalPath:"results/other.csv"},
    {id:"orphan",name:"orphan.csv",size:10,source:"result",state:"ready",logicalPath:"results/orphan.csv"}
  ] as WorkspaceFile[];
  render(<WorkspaceExplorer name="Fixture" inputs={inputs} notebooks={notebooks} results={results}
    query={options.query||""} busy={options.busy} onQuery={()=>{}} compatibility={{}}
    selectedFileId={null} selectedNotebookId={null} onFile={open} onNotebook={open}
    onAttach={()=>{}} onRefresh={()=>{}} onDropFiles={()=>{}} onDelete={remove}/>);
  return {remove,open};
}

it("selects all results in a notebook without selecting its notebook or another result folder",()=>{
  const {remove,open}=fixture();
  const folder=screen.getByRole("checkbox",{name:"Select results for counts.ipynb"});
  const details=folder.closest("details")!;
  fireEvent.click(folder);
  expect(details).toHaveAttribute("open");
  for (const ext of ["png","csv","svg"]) expect(screen.getByRole("checkbox",{name:`Select counts.${ext}`})).toBeChecked();
  expect(screen.getByRole("checkbox",{name:"Select quality.csv"})).toBeChecked();
  expect(screen.getByRole("checkbox",{name:"Select counts.ipynb"})).not.toBeChecked();
  expect(screen.getByRole("checkbox",{name:"Select results for other.ipynb"})).not.toBeChecked();
  expect(open).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button",{name:"Remove selected items"}));
  expect(remove).toHaveBeenCalledWith(["png","csv","svg","quality"].map(id=>({kind:"file",id})));
});

it("shows partial folder selection and toggles the complete group even when some files are hidden by search",()=>{
  const {remove}=fixture({query:"counts.png"});
  const group=screen.getByRole("checkbox",{name:"Select result group counts in counts.ipynb"});
  fireEvent.click(screen.getByRole("checkbox",{name:"Select counts.png"}));
  expect(group).toBePartiallyChecked();
  expect(screen.getByRole("checkbox",{name:"Select results for counts.ipynb"})).toBePartiallyChecked();
  fireEvent.click(group);
  expect(group).toBeChecked();
  fireEvent.click(screen.getByRole("button",{name:"Remove selected items"}));
  expect(remove).toHaveBeenCalledWith(["png","csv","svg"].map(id=>({kind:"file",id})));
});

it("deletes only the right-clicked result group and retains unrelated checked items",()=>{
  const {remove,open}=fixture();
  const unrelated=screen.getByRole("checkbox",{name:"Select template.xlsx"});
  fireEvent.click(unrelated);
  const group=screen.getByRole("checkbox",{name:"Select result group counts in counts.ipynb"});
  fireEvent.contextMenu(group.closest("summary")!,{clientX:120,clientY:140});
  const menu=screen.getByRole("menu",{name:"Actions for result group counts in counts.ipynb"});
  fireEvent.click(within(menu).getByRole("menuitem",{name:"Delete"}));
  expect(remove).toHaveBeenCalledWith(["png","csv","svg"].map(id=>({kind:"file",id})));
  expect(unrelated).toBeChecked();
  expect(open).not.toHaveBeenCalled();
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
});

it.each([
  ["template.xlsx",[{kind:"file",id:"input"}]],
  ["counts.ipynb",[{kind:"notebook",id:"nb"}]],
  ["counts.png",[{kind:"file",id:"png"}]],
])("offers a node-only context deletion for %s",(name,items)=>{
  const {remove}=fixture();
  fireEvent.click(screen.getByRole("checkbox",{name:"Select other.ipynb"}));
  fireEvent.contextMenu(screen.getByRole("checkbox",{name:`Select ${name}`}).closest(".explorer-selectable")!);
  fireEvent.click(screen.getByRole("menuitem",{name:"Delete"}));
  expect(remove).toHaveBeenCalledWith(items);
});

it("supports keyboard context access, Escape focus return and outside dismissal",()=>{
  fixture();
  const file=screen.getByRole("button",{name:"template.xlsx"});
  fireEvent.keyDown(file,{key:"F10",shiftKey:true});
  expect(screen.getByRole("menuitem",{name:"Delete"})).toHaveFocus();
  fireEvent.keyDown(document,{key:"Escape"});
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(screen.getByRole("checkbox",{name:"Select template.xlsx"})).toHaveFocus();
  fireEvent.contextMenu(file);
  fireEvent.pointerDown(document.body);
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
});

it("provides the same folder action for unassigned results",()=>{
  const {remove}=fixture();
  fireEvent.contextMenu(screen.getByRole("checkbox",{name:"Select other results"}).closest("summary")!);
  fireEvent.click(screen.getByRole("menuitem",{name:"Delete"}));
  expect(remove).toHaveBeenCalledWith([{kind:"file",id:"orphan"}]);
});

it("disables selection and context deletion while workspace operations are busy",()=>{
  fixture({busy:true});
  expect(screen.getByRole("checkbox",{name:"Select results for counts.ipynb"})).toBeDisabled();
  fireEvent.contextMenu(screen.getByRole("button",{name:"counts.png"}));
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
});
