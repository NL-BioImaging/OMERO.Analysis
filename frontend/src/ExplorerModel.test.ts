import {resultGroups,resultOwner} from "./ExplorerModel";
import type {WorkspaceFile,NotebookRecord} from "./types";
it("groups plot companions but preserves distinct notebook ownership",()=>{
  const notebooks=[{id:"one",name:"one.ipynb"},{id:"two",name:"two.ipynb"}] as NotebookRecord[];
  const file=(name:string,notebookId?:string)=>({id:name,name,notebookId,logicalPath:"Results/legacy.csv"} as WorkspaceFile);
  const companions=[file("counts.csv","one"),file("counts.png","one"),file("counts.svg","one")];
  expect(resultGroups(companions)).toEqual([{name:"counts",files:companions}]);
  expect(resultOwner(companions[0],notebooks)).toBe("one");
  expect(resultOwner(file("counts.csv","two"),notebooks)).toBe("two");
  expect(resultOwner(file("legacy.csv"),notebooks)).toBeNull();
  expect(resultOwner({...file("old.csv"),logicalPath:"Workspace/Notebooks/Results/one.ipynb/old.csv"},notebooks)).toBe("one");
});

it("sorts result groups naturally and plot companions alphabetically without changing the source list",()=>{
  const names=["well10.svg","well2.svg","well10.csv","well2.png","well2.csv","well10.png"];
  const files=names.map(name=>({id:name,name} as WorkspaceFile));
  expect(resultGroups(files).map(group=>({name:group.name,files:group.files.map(file=>file.name)}))).toEqual([
    {name:"well2",files:["well2.csv","well2.png","well2.svg"]},
    {name:"well10",files:["well10.csv","well10.png","well10.svg"]},
  ]);
  expect(files.map(file=>file.name)).toEqual(names);
});
