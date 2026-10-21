import {runInNewContext} from "node:vm";
import {runtimeWorker} from "./runtime";
it("exports identically rewritten outputs, excludes untouched files and restores tracking after errors", async () => {
  const files=new Map<string, Uint8Array>([['/output/same.csv',new Uint8Array([1,2])],['/output/same.png',new Uint8Array([3,4])],['/output/untouched.csv',new Uint8Array([5])]]);
  const messages:any[]=[];let receive:(event:{data:unknown})=>void=()=>{};
  const FS={mkdirTree(){},readdir:(dir:string)=>dir==='/output'?['.','..',...files.keys()].map(v=>v.replace('/output/','')):['.','..'],
    stat:()=>({mode:0}),isDir:()=>false,readFile:(path:string)=>files.get(path)!,
    write:(stream:{path:string},bytes:Uint8Array)=>{files.set(stream.path,bytes);return bytes.length;}};
  const originalWrite=FS.write;
  const pyodide={FS,loadPackage:async()=>{},globals:{set(){}},setStdout(){},setStderr(){},
    runPythonAsync:async(code:string)=>{
      if(code==='rewrite'){FS.write({path:'/output/same.csv'},new Uint8Array([1,2]));FS.write({path:'/output/same.png'},new Uint8Array([3,4]));}
      if(code==='fail')throw Error('test failure');return 'null';
    }};
  const context:any={mockModule:{loadPyodide:async()=>pyodide},fetch:async()=>({ok:true}),postMessage:(value:any)=>messages.push(value),addEventListener:(_name:string,listener:typeof receive)=>{receive=listener;}};
  runInNewContext(runtimeWorker('https://omero.example/runtime').replace('const module = await import(runtimeBase + "/pyodide.mjs");','const module = globalThis.mockModule;'),context);
  await vi.waitFor(()=>expect(context.XMLHttpRequest).toBeDefined());
  const run=(id:string,code:string)=>receive({data:{source:'oa-parent',id,type:'run',value:{code}}});
  run('first','rewrite');await vi.waitFor(()=>expect(messages.some(m=>m.id==='first'&&m.type==='result')).toBe(true));
  expect(messages.find(m=>m.id==='first').value.files.map((f:any)=>f.name).sort()).toEqual(['same.csv','same.png']);
  expect(FS.write).toBe(originalWrite);
  run('second','read only');await vi.waitFor(()=>expect(messages.some(m=>m.id==='second'&&m.type==='result')).toBe(true));
  expect(messages.find(m=>m.id==='second').value.files).toHaveLength(0);
  run('failed','fail');await vi.waitFor(()=>expect(messages.some(m=>m.id==='failed'&&m.type==='error')).toBe(true));
  expect(FS.write).toBe(originalWrite);
});
