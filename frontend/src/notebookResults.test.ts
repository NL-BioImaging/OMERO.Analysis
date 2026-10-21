import {completeNotebookResults, notebookParameterKey, compactResultVersions, remoteResultName, runParametersLabel} from './notebookResults';
import type {NotebookRecord, WorkspaceFile} from './types';
import type {NotebookRunProvenance} from './notebookProtocol';
const run = (id:string, mode:"all"|"cell"="all", status:"running"|"success"|"failed"="success") => ({id,mode,status,
  startedAt:`2026-10-21T12:00:00.000Z`,completedAt:`2026-10-21T12:00:01.000Z`,parameters:{minimum:2},sources:[],outputs:[{name:"plot.csv",size:10}]} as NotebookRunProvenance);
const notebook = (runs:NotebookRunProvenance[]) => ({id:"nb",name:"counts.ipynb",updatedAt:"2026-10-21",protocolRuns:runs} as NotebookRecord);
const file = (id:string,name="plot.csv",runId="old") => ({id,name,notebookId:"nb",notebookRunId:runId,notebookRunStartedAt:"2026-10-21T12:00:00.000Z",workspaceId:"w",
  createdAt:"2026-10-21T12:00:00.500Z",source:"result",state:"ready",type:"text/csv",size:10,data:new ArrayBuffer(10),logicalPath:"results/"+name} as WorkspaceFile);
it('replaces an earlier complete run only for matching parameters and inputs',async()=>{
  const key=await notebookParameterKey('nb',run('new'));
  const files=[file('old'),file('old-other','other.svg'),file('new','plot.csv','new')].map(f=>({...f,notebookParameterKey:key}));
  const result=await completeNotebookResults(files,notebook([run('old'),run('new')]),'root');
  expect(result.filter(f=>!f.deletedAt).map(f=>f.id)).toEqual(['new']);
  expect(result[0].supersededAt).toBeTruthy();expect(result[0].data).toBeUndefined();
});
it('a single cell replaces only the filenames it produced',async()=>{
  const key=await notebookParameterKey('nb',run('new'));
  const files=[file('old'),file('other','other.svg'),file('new','plot.csv','new')].map(f=>({...f,notebookParameterKey:key}));
  const result=await completeNotebookResults(files,notebook([run('new','cell')]),'root');
  expect(result.filter(f=>!f.deletedAt).map(f=>f.id)).toEqual(['other','new']);
});
it('a failed run discards its partial files and preserves the prior successful result',async()=>{
  const files=[file('old'),file('new','plot.csv','new')];
  const result=await completeNotebookResults(files,notebook([run('new','all','failed')]),'root');
  expect(result.filter(f=>!f.deletedAt).map(f=>f.id)).toEqual(['old']);
  expect(await completeNotebookResults(files,notebook([run('new','all','running')]),'root')).toBe(files);
});
it('compacts legacy duplicates once, per notebook and exact filename',()=>{
  const original=[{...file('old'),createdAt:'2026-10-20'},file('current'),{...file('other'),notebookId:'other'},
    {...file('removed'),deletedAt:'2026-10-20'}];
  const result=compactResultVersions(original,'2026-10-21');
  expect(result.filter(f=>!f.deletedAt).map(f=>f.id)).toEqual(['current','other']);
  expect(compactResultVersions(result,'later')).toEqual(result);
});
it('parameter identity is independent of run identity and ordering',async()=>{
  expect(await notebookParameterKey('nb',run('one'))).toBe(await notebookParameterKey('nb',run('two')));
});
it('keeps long OMERO filenames bounded with intact extension',()=>{
  const name=remoteResultName({...file('long'),'name':'a'.repeat(220)+'.svg'},[{...notebook([]),name:'b'.repeat(200)+'.ipynb'}]);
  expect(name.length).toBeLessThanOrEqual(180);expect(name.endsWith('.svg')).toBe(true);
});

it('preserves results for different parameters or a different input identity',async()=>{
  const oldKey=await notebookParameterKey('nb',run('old'));
  const changed={...run('new'),parameters:{minimum:3}};
  const newKey=await notebookParameterKey('nb',changed);
  const files=[{...file('old'),notebookParameterKey:oldKey},{...file('new','plot.csv','new'),notebookParameterKey:newKey}];
  const result=await completeNotebookResults(files,notebook([run('old'),changed]),'root');
  expect(result.filter(f=>!f.deletedAt)).toHaveLength(2);
  const differentInput={...changed,sources:[{inputId:'db',name:'different.duckdb',sourceDigest:'other'}]};
  expect(await notebookParameterKey('nb',differentInput)).not.toBe(newKey);
  expect(compactResultVersions(result,'later').filter(f=>!f.deletedAt)).toHaveLength(2);
});

it('shows the recorded run parameters, including false, zero and empty values, instead of edited settings',()=>{
  const recorded={...run('one'),parameters:{threshold:0,normalize:false,channel:"",optional:null,method:"Otsu"}};
  const nb={...notebook([recorded]),parameterValues:{threshold:99,normalize:true}};
  expect(runParametersLabel(file('result','plot.csv','one'),nb)).toBe('Parameters: threshold=0 · normalize=false · channel="" · optional=null · method="Otsu"');
  expect(runParametersLabel(file('result','plot.csv','two'),nb)).toBe('Parameters not recorded');
});
it('distinguishes runs with no parameters from missing or ambiguous legacy provenance',()=>{
  expect(runParametersLabel(file('result'),notebook([{...run('old'),parameters:{}}]))).toBe('No run parameters');
  expect(runParametersLabel({...file('legacy'),notebookRunId:undefined},notebook([run('one')]))).toBe('Parameters: minimum=2');
  expect(runParametersLabel({...file('legacy'),notebookRunId:undefined},notebook([run('one'),run('two')]))).toBe('Parameters not recorded');
  expect(runParametersLabel(file('unknown'))).toBe('Parameters not recorded');
});
