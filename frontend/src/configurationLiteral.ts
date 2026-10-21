import { pythonLanguage } from "@codemirror/lang-python";

/** Locate a real Python call, never a matching comment or another string. */
export function configurationLiteral(source: string): {from:number; to:number; value:unknown} {
  const tree=pythonLanguage.parser.parse(source);
  const calls: Array<{from:number;to:number;text:string}>=[];
  let broken=false;
  tree.iterate({enter(node){
    if(node.type.isError) broken=true;
    if(node.name!=="CallExpression") return;
    const callee=node.node.firstChild;
    if(!callee || !["oan.configure","configure"].includes(source.slice(callee.from,callee.to).replace(/\s/g,""))) return;
    const args=callee.nextSibling;
    const children=[];
    for(let child=args?.firstChild;child;child=child.nextSibling) if(!["(",")"].includes(child.name)) children.push(child);
    if(children.length!==1 || children[0].name!=="String") throw new Error("Configuration cell must call oan.configure() with one triple-quoted literal JSON string; edit setup in Python.");
    calls.push({from:children[0].from,to:children[0].to,text:source.slice(children[0].from,children[0].to)});
  }});
  if(broken || calls.length!==1) throw new Error("Setup needs one unambiguous oan.configure() call in valid Python. Edit setup in Python.");
  const literal=calls[0], opening=literal.text.match(/^([rRuU]*)("""|''')/);
  if(!opening) throw new Error("Configuration must use a triple-quoted literal JSON string; edit setup in Python.");
  let body=literal.text.slice(opening[0].length,-3);
  if(!/r/i.test(opening[1])) body=body.replace(/\\(\r?\n|[\\'"abfnrtv]|x[\da-fA-F]{2}|u[\da-fA-F]{4}|U[\da-fA-F]{8}|[0-7]{1,3})/g,(_,escape:string)=>{
    const simple:Record<string,string>={"\\":"\\","'":"'",'"':'"',a:"\x07",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t",v:"\v"};
    if(escape in simple) return simple[escape];
    if(escape.includes("\n")) return "";
    return String.fromCodePoint(parseInt(/[xuU]/.test(escape[0])?escape.slice(1):escape,/[xuU]/.test(escape[0])?16:8));
  });
  try {return {...literal,value:JSON.parse(body)};} catch {throw new Error("Configuration is not literal JSON; edit setup in Python.");}
}

export function replaceConfiguration(source:string,value:unknown):string {
  const range=configurationLiteral(source);
  const json=JSON.stringify(value,null,2).replace(/'/g,"\\u0027");
  return source.slice(0,range.from)+"r'''"+json+"'''"+source.slice(range.to);
}
