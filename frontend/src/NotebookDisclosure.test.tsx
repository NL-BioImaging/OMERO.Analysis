import {fireEvent,render,screen} from "@testing-library/react";
import {useState} from "react";
import NotebookView from "./NotebookView";
import type {NotebookRecord} from "./types";
import type {PythonRuntime} from "./runtime";
vi.mock("./CodeEditor",()=>({CodeEditor:({label,value,onChange}:any)=><textarea aria-label={label} value={value} onChange={e=>onChange(e.target.value)}/>}));
function record(id="one"):NotebookRecord {return {id,workspaceId:"work",name:"analysis.ipynb",createdAt:"now",updatedAt:"now",attachmentIds:[],selectedDataFileIds:[],document:{nbformat:4,nbformat_minor:5,metadata:{},cells:[{id:"python",cell_type:"code",metadata:{},source:"x = 1",execution_count:1,outputs:[{output_type:"stream",name:"stdout",text:"Existing output"}]},{id:"markdown",cell_type:"markdown",metadata:{},source:"Explanation"}]}};}
const props={inputs:[],runtime:{stop:vi.fn()} as unknown as PythonRuntime,runRequest:null,workspaceActions:null,onBeforeRun:async()=>{},onFiles:async()=>{}};
it("folds existing Python source, retains outputs and opens newly added cells",()=>{
 function Harness(){const [notebook,setNotebook]=useState(record());return <NotebookView {...props} notebook={notebook} onChange={async n=>{setNotebook(n);}}/>;}
 render(<Harness/>);
 expect(screen.getByLabelText("Cell 1 source")).not.toBeVisible();
 expect(screen.getByText("Existing output")).toBeVisible();
 expect(screen.getByLabelText("Cell 2 source")).toBeVisible();
 fireEvent.click(screen.getByRole("button",{name:"Expand Python cell 1"}));expect(screen.getByLabelText("Cell 1 source")).toBeVisible();
 fireEvent.click(screen.getByRole("button",{name:"Collapse Python cell 1"}));expect(screen.getByLabelText("Cell 1 source")).not.toBeVisible();
 fireEvent.click(screen.getByRole("button",{name:"Add cell"}));expect(screen.getByLabelText("Cell 3 source")).toBeVisible();
 expect(screen.getByRole("button",{name:"Collapse Python cell 3"})).toHaveAttribute("aria-expanded","true");
});
it("opens a newly created notebook once and folds saved notebooks when switching",()=>{
 const first=record();first.document.cells.push({id:"second-code",cell_type:"code",metadata:{},source:"",outputs:[],execution_count:null});const request={notebookId:first.id,cellIds:["python","second-code"],nonce:1};
 const view=render(<NotebookView {...props} notebook={first} onChange={async()=>{}} openCellRequest={request}/>);
 expect(screen.getByLabelText("Cell 1 source")).toBeVisible();
 expect(screen.getByLabelText("Cell 3 source")).toBeVisible();
 view.rerender(<NotebookView {...props} notebook={record("other")} onChange={async()=>{}} openCellRequest={request}/>);
 expect(screen.getByLabelText("Cell 1 source")).not.toBeVisible();
 view.rerender(<NotebookView {...props} notebook={first} onChange={async()=>{}} openCellRequest={request}/>);
 expect(screen.getByLabelText("Cell 1 source")).not.toBeVisible();
});
