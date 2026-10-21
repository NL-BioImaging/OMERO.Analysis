import {useEffect,useRef,useState} from "react";
import {Button} from "./components/BlueprintControls";
import {parameterDefaults,validateParameterValues,type NotebookProtocolContract} from "./notebookProtocol";
import {markNotebookStale} from "./notebookConfiguration";
import type {NotebookRecord} from "./types";

export interface ParameterOptions {choices:NonNullable<NotebookRecord["parameterChoices"]>;labels:NonNullable<NotebookRecord["parameterChoiceLabels"]>}
export function RunParameters({record,contract,disabled,onChange,onValidity,onLoadChoices}: {
  record:NotebookRecord;contract:NotebookProtocolContract;disabled:boolean;onChange:(value:NotebookRecord)=>Promise<void>;
  onValidity:(error:string)=>void;onLoadChoices?:(record:NotebookRecord)=>Promise<ParameterOptions>;
}){
  const [draft,setDraft]=useState<Record<string,boolean|number|string|null>>({...parameterDefaults(contract),...record.parameterValues});
  const [error,setError]=useState(""),[choiceError,setChoiceError]=useState(""),[loading,setLoading]=useState(false);
  const [options,setOptions]=useState<ParameterOptions>({choices:record.parameterChoices||{},labels:record.parameterChoiceLabels||{}});
  const generation=useRef(0),latest=useRef(record);latest.current=record;
  const identity=JSON.stringify([contract,record.protocolBindings?.map(b=>[b.inputId,b.fileId,b.sourceDigest])]);
  useEffect(()=>{generation.current++;setOptions({choices:record.parameterChoices||{},labels:record.parameterChoiceLabels||{}});setDraft({...parameterDefaults(contract),...record.parameterValues});setError("");setChoiceError("");setLoading(false);},[identity]);
  useEffect(()=>()=>{generation.current++;onValidity("");},[]);
  function validate(value:typeof draft){
    const result=validateParameterValues(contract,value,options.choices);
    for(const p of contract.parameters)if(p.choices_query){const available=options.choices[p.name];if(!available?.length)throw new Error(`Load choices for ${p.label||p.name} before running.`);if(result[p.name]===null)throw new Error(`Choose ${p.label||p.name} before running.`);}
    return result;
  }
  let currentError="";
  try{validateParameterValues(contract,draft,options.choices);}catch(e){currentError=String(e);}
  const missing=contract.parameters.some(p=>p.choices_query&&!options.choices[p.name]?.length);
  useEffect(()=>{onValidity(error||currentError||(missing?"Load database choices before running.":""));},[error,currentError,missing,identity]);
  async function save(value:typeof draft){setDraft(value);try{const valid=validate(value);await onChange(markNotebookStale({...latest.current,parameterValues:valid}));setError("");}catch(e){setError(String(e));}}
  async function load(){if(!onLoadChoices)return;const request=++generation.current;setLoading(true);setChoiceError("");try{
    const loaded=await onLoadChoices(latest.current);if(request!==generation.current)return;
    setOptions(loaded);const values={...draft};for(const p of contract.parameters)if(p.choices_query){const choices=loaded.choices[p.name]||[];if(!choices.length)throw new Error(`No choices returned for ${p.label||p.name}. Check its query/input in Notebook setup.`);if(!choices.some(c=>Object.is(c,values[p.name])))values[p.name]=choices[0];}
    const valid=validateParameterValues(contract,values,loaded.choices);setDraft(valid);await onChange(markNotebookStale({...latest.current,parameterValues:valid,parameterChoices:loaded.choices,parameterChoiceLabels:loaded.labels}));setError("");
  }catch(e){if(request===generation.current)setChoiceError(String(e));}finally{if(request===generation.current)setLoading(false);}}
  if(!contract.parameters.length)return null;
  return <details className="notebook-run-parameters notebook-form-panel" open><summary><strong>Run parameters</strong><small>Values for this run · notebook defaults stay unchanged</small></summary><div className="notebook-form-body">
    <p>Saved with this notebook and recorded in each run. Changed values make previous outputs stale. Initialize setup before running individual analysis cells.</p>
    <fieldset disabled={disabled||loading}><div className="notebook-form-grid">
      {contract.parameters.map(p=>{const value=draft[p.name]??"";const choices=p.choices||options.choices[p.name]||[];const labels=options.labels[p.name]||[];return <label key={p.name} className={p.type==="boolean"?"setup-check":""}>{p.label||p.name}
        {p.type==="boolean"?<input type="checkbox" checked={!!value} onChange={e=>void save({...draft,[p.name]:e.target.checked})}/>:p.type==="choice"?<select value={choices.findIndex(c=>Object.is(c,value))} disabled={!choices.length} onChange={e=>void save({...draft,[p.name]:choices[Number(e.target.value)]??null})}><option value={-1}>{p.choices_query?"Load choices, then choose":"Choose a value"}</option>{choices.map((c,i)=><option key={i} value={i}>{labels[i]||String(c)}</option>)}</select>:
          <input type={p.type==="number"||p.type==="integer"?"number":"text"} value={String(value)} min={p.minimum} max={p.maximum} step={p.step??(p.type==="integer"?1:"any")} onChange={e=>void save({...draft,[p.name]:e.target.value===""?null:p.type==="number"||p.type==="integer"?Number(e.target.value):e.target.value})}/>}{p.help&&<small>{p.help}</small>}</label>;})}
    </div><div className="notebook-form-actions"><Button onClick={()=>void save(parameterDefaults(contract))}>Reset to defaults</Button>{contract.parameters.some(p=>p.choices_query)&&<Button disabled={!onLoadChoices} onClick={()=>void load()}>{loading?"Loading choices…":choiceError?"Retry choices":"Load choices"}</Button>}</div></fieldset>
    {missing&&<p role="status">Load the database choices before running. This uses read-only queries without starting the notebook kernel.</p>}
    {(error||currentError||choiceError)&&<p role="alert">{error||currentError||choiceError}</p>}
  </div></details>;
}
