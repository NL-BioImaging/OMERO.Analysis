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
