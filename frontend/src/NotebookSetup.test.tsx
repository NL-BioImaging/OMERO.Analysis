import {fireEvent,render,screen,waitFor,within} from "@testing-library/react";
import {useState} from "react";
import {NotebookSetup} from "./NotebookSetup";
import {RunParameters} from "./RunParameters";
import NotebookView from "./NotebookView";
import {parseNotebookProtocol} from "./notebookProtocol";
import type {NotebookRecord,WorkspaceFile} from "./types";
import type {PythonRuntime} from "./runtime";
vi.mock("./CodeEditor",()=>({CodeEditor:({label,value,onChange}:any)=><textarea aria-label={label} value={value} onChange={e=>onChange(e.target.value)}/>}));
const make=():NotebookRecord=>({id:"gui",workspaceId:"workspace",name:"gui.ipynb",createdAt:"now",updatedAt:"now",attachmentIds:[],selectedDataFileIds:[],document:{nbformat:4,nbformat_minor:5,metadata:{},cells:[{id:"config",cell_type:"code",metadata:{tags:["omero-analysis-config"]},source:`import omero_analysis_notebook as oan\nctx=oan.configure(r'''${JSON.stringify({schema:"nl.bioimaging.omero-analysis-notebook.v1",inputs:[{id:"data",kind:"query",path:"input/data.csv",formats:["csv"],required:true}],results:{path:"results"},parameters:[{name:"minimum",label:"Minimum count",type:"integer",default:0,minimum:0}],requirements:[]})}''')`,outputs:[]},{id:"analysis",cell_type:"code",source:"x = ctx.params['minimum']",metadata:{},outputs:[]}]}});
const inputs=[{id:"csv",name:"data.csv",source:"local",state:"ready",size:20,sha256:"abc"}] as WorkspaceFile[];
beforeEach(()=>localStorage.clear());
it("applies form definitions to source, preserves a local draft, and reports source conflicts",async()=>{
 const onApply=vi.fn(async(_record:NotebookRecord)=>{}),onDraftState=vi.fn();const original=make();
 const view=render(<NotebookSetup record={original} inputs={inputs} disabled={false} onApply={onApply} onDraftState={onDraftState} onPython={()=>{}} onBind={async()=>{}}/>);
 fireEvent.click(screen.getByText("Notebook setup"));fireEvent.change(screen.getByLabelText("Parameter 1 default"),{target:{value:"3"}});
 expect(localStorage.getItem("omero-analysis:setup-draft:workspace:gui")).toContain('"default":3');
 fireEvent.click(screen.getByRole("button",{name:"Apply setup"}));await waitFor(()=>expect(onApply).toHaveBeenCalled());
 expect(parseNotebookProtocol(onApply.mock.calls[0][0].document)?.parameters[0].default).toBe(3);
 fireEvent.change(screen.getByLabelText("Parameter 1 default"),{target:{value:"4"}});
 const changed=make();changed.document.cells[0].source+="\nmanual=2";
 view.rerender(<NotebookSetup record={changed} inputs={inputs} disabled={false} onApply={onApply} onDraftState={onDraftState} onPython={()=>{}} onBind={async()=>{}}/>);
 expect(screen.getByRole("button",{name:"Apply setup"})).toBeDisabled();expect(screen.getByText(/Python setup changed while/)).toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"Reload setup"}));expect(screen.getByLabelText("Parameter 1 default")).toHaveValue(0);
});
it("selects only requested schema fields and adds supporting inputs without changing a binding",async()=>{
 const onApply=vi.fn(async(_record:NotebookRecord)=>{}),onBind=vi.fn(async(_id:string,_fileId:string)=>{});
 render(<NotebookSetup record={make()} inputs={inputs} disabled={false} onApply={onApply} onDraftState={()=>{}} onPython={()=>{}} onBind={onBind} onInspect={async()=>({tables:[{name:"data",columns:[{name:"count",type:"INTEGER"},{name:"condition",type:"VARCHAR"}]}]})}/>);
 fireEvent.click(screen.getByText("Notebook setup"));fireEvent.click(screen.getByText(/Required tables and columns/));fireEvent.click(screen.getByRole("button",{name:"Inspect input structure"}));
 await waitFor(()=>expect(screen.getByLabelText("Require table data",{exact:true})).toBeInTheDocument());fireEvent.click(screen.getByLabelText("Require table data",{exact:true}));fireEvent.click(screen.getByText("data",{exact:true}).closest("summary")!);fireEvent.click(screen.getByLabelText("count",{exact:true}));
 fireEvent.click(screen.getByRole("button",{name:"Add input"}));const supporting=screen.getByRole("region",{name:"Input 2"});fireEvent.change(within(supporting).getByLabelText("Kind"),{target:{value:"file"}});
 fireEvent.click(screen.getByRole("button",{name:"Apply setup"}));await waitFor(()=>expect(onApply).toHaveBeenCalled());
 const contract=parseNotebookProtocol(onApply.mock.calls[0][0].document)!;expect((contract.inputs[0] as any).schema.tables).toEqual([{name:"data",columns:[{name:"count"}]}]);expect(contract.inputs[1].kind).toBe("file");expect(onBind).not.toHaveBeenCalled();
});
it("saves run values separately, rejects fractional integers, and leaves source defaults unchanged",async()=>{
 let saved:NotebookRecord|undefined;function Harness(){const [r,set]=useState(make());return <RunParameters record={r} contract={parseNotebookProtocol(r.document)!} disabled={false} onValidity={()=>{}} onChange={async v=>{saved=v;set(v);}}/>;}
 render(<Harness/>);const source=String(make().document.cells[0].source);
 fireEvent.change(screen.getByLabelText("Minimum count"),{target:{value:"8"}});await waitFor(()=>expect(saved?.parameterValues?.minimum).toBe(8));
 expect(saved!.document.cells[0].source).toBe(source);expect(parseNotebookProtocol(saved!.document)?.parameters[0].default).toBe(0);
 fireEvent.change(screen.getByLabelText("Minimum count"),{target:{value:"1.5"}});expect(screen.getByRole("alert")).toHaveTextContent(/integer/);expect(saved?.parameterValues?.minimum).toBe(8);
 fireEvent.click(screen.getByRole("button",{name:"Reset to defaults"}));await waitFor(()=>expect(saved?.parameterValues?.minimum).toBe(0));
});
it("loads bounded choices on demand without rewriting source",async()=>{
 const r=make(),c=parseNotebookProtocol(r.document)!;c.parameters=[{name:"time",type:"choice",choices_query:{source:"data",sql:"SELECT 0 AS t",limit:2,value_column:"t"}}];
 const source=r.document.cells[0].source,onChange=vi.fn(async(_record:NotebookRecord)=>{}),load=vi.fn(async()=>({choices:{time:[0,1]},labels:{time:["Start","Next"]}}));
 render(<RunParameters record={r} contract={c} disabled={false} onValidity={()=>{}} onChange={onChange} onLoadChoices={load}/>);
 expect(load).not.toHaveBeenCalled();fireEvent.click(screen.getByRole("button",{name:"Load choices"}));await waitFor(()=>expect(screen.getByRole("option",{name:"Start"})).toBeInTheDocument());
 expect(onChange.mock.calls[0][0].document.cells[0].source).toBe(source);expect(onChange.mock.calls[0][0].parameterValues?.time).toBe(0);
});
it("does not start Python on setup inspection or value edits, and requires explicit setup before analysis cells",async()=>{
 const run=vi.fn(async()=>({stdout:"",stderr:"",files:[]})),reset=vi.fn(async(_record:NotebookRecord)=>{}),stop=vi.fn();
 const runtime={runNotebookCell:run,reset,stop,syncInputs:async()=>{}} as unknown as PythonRuntime;
 function Harness(){const [r,set]=useState(make());return <NotebookView notebook={r} inputs={inputs} runtime={runtime} runRequest={null} workspaceActions={null} onBeforeRun={async()=>{}} onChange={async v=>set(v)} onFiles={async()=>{}}/>;}
 render(<Harness/>);fireEvent.click(screen.getByText("Notebook setup"));expect(reset).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole("button",{name:"Run cell 2"}));expect(run).not.toHaveBeenCalled();expect(screen.getByText(/Initialize setup first/)).toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"Initialize setup"}));await waitFor(()=>expect(run).toHaveBeenCalledTimes(1));
 await waitFor(()=>expect(screen.getByRole("button",{name:"Run cell 2"})).toBeEnabled());fireEvent.click(screen.getByRole("button",{name:"Run cell 2"}));await waitFor(()=>expect(run).toHaveBeenCalledTimes(2));expect(reset).toHaveBeenCalledTimes(1);
 fireEvent.change(screen.getByLabelText("Minimum count"),{target:{value:"2"}});expect(stop).not.toHaveBeenCalled();fireEvent.click(screen.getByRole("button",{name:"Run cell 2"}));expect(run).toHaveBeenCalledTimes(2);
});

it("recovers an unapplied setup draft after remounting",()=>{
 const props={record:make(),inputs,disabled:false,onApply:async()=>{},onDraftState:()=>{},onPython:()=>{},onBind:async()=>{}};
 const view=render(<NotebookSetup {...props}/>);fireEvent.click(screen.getByText("Notebook setup"));fireEvent.change(screen.getByLabelText("Parameter 1 default"),{target:{value:"7"}});view.unmount();
 render(<NotebookSetup {...props}/>);fireEvent.click(screen.getByText("Notebook setup"));expect(screen.getByLabelText("Parameter 1 default")).toHaveValue(7);expect(screen.getByRole("button",{name:"Apply setup"})).toBeEnabled();
});

it("keeps execution blocked when unapplied database choices survive a setup edit",()=>{
 const r=make(),c=parseNotebookProtocol(r.document)!;c.parameters=[{name:"time",type:"choice",choices_query:{source:"data",sql:"SELECT 0 AS t",limit:2}}];
 const validity=vi.fn();const onChange=async()=>{};
 const view=render(<RunParameters record={r} contract={c} disabled={false} onValidity={validity} onChange={onChange}/>);
 expect(validity.mock.calls.at(-1)?.[0]).toMatch(/Load database choices/);
 const changed={...c,requirements:["pandas"]};
 view.rerender(<RunParameters record={r} contract={changed} disabled={false} onValidity={validity} onChange={onChange}/>);
 expect(validity.mock.calls.at(-1)?.[0]).toMatch(/Load database choices/);
});
