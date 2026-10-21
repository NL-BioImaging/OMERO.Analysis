import {configurationLiteral,replaceConfiguration} from "./configurationLiteral";
import {NOTEBOOK_CONFIG_TAG,NOTEBOOK_PROTOCOL_SCHEMA,parseNotebookProtocol,validateNotebookContract,validateParameterValues,type NotebookProtocolContract} from "./notebookProtocol";
import type {NotebookDocument,NotebookRecord,WorkspaceFile} from "./types";

export const setupFingerprint=(doc:NotebookDocument)=>JSON.stringify([doc.cells[0]?.source,doc.cells[0]?.metadata?.tags,doc.metadata?.omero_analysis?.schema_requirements]);
export function setupContract(doc:NotebookDocument):NotebookProtocolContract|null {
  const value=parseNotebookProtocol(doc,true);
  for(const input of value?.inputs||[])if(input.kind==="query" && input.schema){
    const tables=input.schema.tables;
    if(tables!==undefined && (!Array.isArray(tables)||tables.some(t=>!t||typeof t.name!=="string"||!t.name.trim()||(t.columns!==undefined&&(!Array.isArray(t.columns)||t.columns.some(c=>!c||typeof c.name!=="string"||!c.name.trim()||(c.type!==undefined&&typeof c.type!=="string"))))))) throw new Error("Table requirements need named tables and columns. Correct the setup in Python.");
  }
  return value;
}
export function markNotebookStale(record:NotebookRecord):NotebookRecord {
  return {...record,document:{...record.document,cells:record.document.cells.map(cell=>cell.cell_type==="code"?{...cell,metadata:{...cell.metadata,"omero-analysis-stale":true}}:cell)},updatedAt:new Date().toISOString()};
}
export function applyNotebookSetup(record:NotebookRecord,value:unknown,expected:string):NotebookRecord {
  if(setupFingerprint(record.document)!==expected) throw new Error("Python setup changed while this form was open. Reload setup or keep editing Python.");
  const contract=validateNotebookContract(value);
  validateParameterValues(contract,{});
  const first=record.document.cells[0];
  if(!first || !first.metadata?.tags || !(first.metadata.tags as string[]).includes(NOTEBOOK_CONFIG_TAG)) throw new Error("This notebook has no portable setup cell.");
  const source=Array.isArray(first.source)?first.source.join(""):first.source;
  configurationLiteral(source);
  const metadata={...record.document.metadata};
  if(metadata.omero_analysis?.schema_requirements){
    const {schema_requirements:_,...other}=metadata.omero_analysis;
    metadata.omero_analysis=other;
  }
  const document={...record.document,metadata,cells:record.document.cells.map((cell,index)=>index===0?{...cell,source:replaceConfiguration(source,contract)}:cell)};
  parseNotebookProtocol(document);
  const parameterValues:NonNullable<NotebookRecord["parameterValues"]>={};
  for(const parameter of contract.parameters) if(Object.hasOwn(record.parameterValues||{},parameter.name)) {
    const v=record.parameterValues![parameter.name];
    try {validateParameterValues({...contract,parameters:[parameter]},{[parameter.name]:v}); parameterValues[parameter.name]=v;} catch {/* A changed definition falls back to its validated default. */}
  }
  return markNotebookStale({...record,document,parameterValues,parameterChoices:{},parameterChoiceLabels:{},
    protocolBindings:record.protocolBindings?.filter(binding=>contract.inputs.some(input=>input.id===binding.inputId&&input.kind===binding.kind))});
}
export function convertNotebookSetup(record:NotebookRecord,files:WorkspaceFile[]):NotebookRecord {
  if(record.document.cells.some(cell=>(cell.metadata.tags as string[]|undefined)?.includes(NOTEBOOK_CONFIG_TAG))) throw new Error("A setup cell already exists; correct its Python source.");
  const file=files.find(f=>/\.(duckdb|sqlite3?|csv)$/i.test(f.name)) || files[0];
  if(!file) throw new Error("Attach an input before adding portable setup.");
  const format=file.name.split(".").at(-1)!.toLowerCase();
  const query=["duckdb","sqlite","sqlite3","csv"].includes(format);
  const contract={schema:NOTEBOOK_PROTOCOL_SCHEMA,inputs:[{id:"data",kind:query?"query":"file",path:`input/${file.name}`,required:true,...(query?{formats:[format]}:{extensions:[`.${format}`]})}],results:{path:"results"},parameters:[],requirements:[]};
  validateNotebookContract(contract);
  const source=`import omero_analysis_notebook as oan\nctx = oan.configure(r'''${JSON.stringify(contract,null,2).replace(/'/g,"\\u0027")}''')\n`;
  return markNotebookStale({...record,document:{...record.document,cells:[{id:crypto.randomUUID(),cell_type:"code",source,metadata:{tags:[NOTEBOOK_CONFIG_TAG]},execution_count:null,outputs:[]},...record.document.cells]}});
}
