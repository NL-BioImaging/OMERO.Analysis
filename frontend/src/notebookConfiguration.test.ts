import {configurationLiteral,replaceConfiguration} from "./configurationLiteral";
import {applyNotebookSetup,convertNotebookSetup,setupContract,setupFingerprint} from "./notebookConfiguration";
import {parseNotebookProtocol} from "./notebookProtocol";
import type {NotebookRecord,WorkspaceFile} from "./types";
export const contract=()=>({schema:"nl.bioimaging.omero-analysis-notebook.v1",inputs:[{id:"measurements",kind:"query",path:"input/data.csv",formats:["csv"],required:true,schema:{tables:[{name:"data",columns:[{name:"count"}]}]},custom_input:{retained:true}}],results:{path:"results",custom:1},parameters:[{name:"minimum",type:"integer",default:0,minimum:0,label:"Minimum count"}],requirements:["pandas"],custom:{quote:"researcher's ''' label",path:"C:\\files",unicode:"µ"}});
export function record():NotebookRecord {const value=contract();return {id:"nb",workspaceId:"w",name:"test.ipynb",createdAt:"now",updatedAt:"now",attachmentIds:[],selectedDataFileIds:[],parameterValues:{minimum:5},document:{nbformat:4,nbformat_minor:5,metadata:{custom:{keep:true}},cells:[{id:"config",cell_type:"code",source:`# preserve\nimport omero_analysis_notebook as oan\ncustom = 42\nctx = oan.configure(r'''${JSON.stringify(value).replace(/'/g,"\\u0027")}''')\nctx.display_parameters()\n`,metadata:{tags:["omero-analysis-config","keep"],custom:123},execution_count:1,outputs:[{output_type:"stream",text:"old"}]},{id:"analysis",cell_type:"code",source:"answer = custom + ctx.params['minimum']\nanswer",metadata:{},outputs:[{output_type:"stream",text:"old answer"}],execution_count:2}]}};}
it("replaces only the actual literal and round trips quotes/backslashes/unknown fields without executing Python",()=>{
 const original=record(),value=contract();value.parameters[0].default=3;
 const changed=applyNotebookSetup(original,value,setupFingerprint(original.document));
 const source=String(changed.document.cells[0].source);
 expect(source).toContain("# preserve\nimport omero_analysis_notebook as oan\ncustom = 42\nctx = oan.configure(");
 expect(source).toContain(")\nctx.display_parameters()\n");
 expect((parseNotebookProtocol(changed.document) as any)?.custom).toEqual(value.custom);
 expect(changed.document.cells[0].id).toBe("config");expect(changed.document.cells[0].metadata.custom).toBe(123);
 expect(changed.document.metadata.custom).toEqual({keep:true});expect(changed.document.cells[1].source).toBe(original.document.cells[1].source);
 expect(changed.parameterValues).toEqual({minimum:5});expect(changed.document.cells[1].metadata["omero-analysis-stale"]).toBe(true);
 expect(changed.document.cells[0].outputs).toEqual(original.document.cells[0].outputs);
});
it("ignores fake calls in comments and strings and rejects ambiguous, computed, f-string and malformed Python",()=>{
 const valid=String(record().document.cells[0].source);
 expect(configurationLiteral('# oan.configure(r\'\'\'fake\'\'\')\nnote="oan.configure(fake)"\n'+valid).value).toBeTruthy();
 for(const source of [valid+"\nctx2 = oan.configure(r'''{}''')", "ctx=oan.configure(make_config())",'ctx=oan.configure(f"""{foo}""")',"ctx=oan.configure(r'''{}''')\nif :", "ctx=oan.configure(r'''{}''', another)"]){expect(()=>configurationLiteral(source)).toThrow();}
});
it("preserves effective metadata requirements in source and removes their overriding copy",()=>{
 const original=record();(original.document.cells[0].source as string); const raw=contract(); (raw.inputs[0].schema as any).custom_schema="keep"; original.document.cells[0].source=replaceConfiguration(String(original.document.cells[0].source),raw);original.document.metadata.omero_analysis={other:"keep",schema_requirements:{measurements:{tables:[{name:"overridden",columns:[{name:"special"}]}]}}};
 const effective=setupContract(original.document)!;expect((effective.inputs[0] as any).schema.tables[0].name).toBe("overridden");
 const changed=applyNotebookSetup(original,effective,setupFingerprint(original.document));
 expect(changed.document.metadata.omero_analysis).toEqual({other:"keep"});expect((parseNotebookProtocol(changed.document)!.inputs[0] as any).schema.custom_schema).toBe("keep");expect((parseNotebookProtocol(changed.document)!.inputs[0] as any).schema.tables[0].name).toBe("overridden");
});
it("rejects source conflicts, invalid defaults and unsafe readiness without changing the notebook",()=>{
 const original=record(),base=setupFingerprint(original.document);original.document.cells[0].source+="\nmanual = 1";
 expect(()=>applyNotebookSetup(original,contract(),base)).toThrow(/changed/);
 const value=contract();value.parameters[0].default=-1;expect(()=>applyNotebookSetup(record(),value,setupFingerprint(record().document))).toThrow(/minimum/);
 const unsafe=contract();(unsafe.inputs[0] as any).readiness=[{sql:"DELETE FROM data",message:"bad"}];expect(()=>applyNotebookSetup(record(),unsafe,setupFingerprint(record().document))).toThrow(/SELECT/);
});
it("keeps the execution fingerprint stable when outputs change and converts legacy only explicitly",()=>{
 const original=record(),base=setupFingerprint(original.document);original.document.cells[0].outputs=[];original.document.cells[0].execution_count=9;expect(setupFingerprint(original.document)).toBe(base);
 const legacy=record();legacy.document.cells.shift();const converted=convertNotebookSetup(legacy,[{id:"file",name:"template.xlsx"}] as WorkspaceFile[]);
 expect(converted.document.cells[1]).toEqual({...legacy.document.cells[0],metadata:{"omero-analysis-stale":true}});expect(parseNotebookProtocol(converted.document)?.inputs[0].kind).toBe("file");
 expect(legacy.document.cells).toHaveLength(1);
});
it("decodes Python literal escapes before interpreting JSON",()=>{
 const json=JSON.stringify({message:"line\nnew"});const source=`ctx=oan.configure('''${json.replace(/\\/g,"\\\\")}''')`;
 expect(configurationLiteral(source).value).toEqual({message:"line\nnew"});expect(configurationLiteral(replaceConfiguration(source,{x:"'''"})).value).toEqual({x:"'''"});
});
