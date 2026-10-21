import { assistantNotebook, browserHandoffPrompt, workspaceSkillsUrl } from "./browserHandoff";

it("copies a workspace deep link without tokens, receipts, embed flags or fragments", () => {
  expect(workspaceSkillsUrl("http://localhost:4080/omero_analysis/?type=Screen&id=152&workspace_id=old&token=secret&embedded_host=biomero#private", "new"))
    .toBe("http://localhost:4080/omero_analysis/?type=Screen&id=152&workspace_id=new&tab=skills");
});
it("scopes browser automation to approved context and a new unexecuted notebook", () => {
  const prompt = browserHandoffPrompt("http://localhost/workspace", "Count spots", false, "chatgpt");
  expect(prompt).toContain("@Chrome");
  expect(prompt).toContain("Count spots");
  expect(prompt).toContain("not enabled sharing");
  expect(prompt).toContain("Import created notebook");
  expect(prompt).toContain("do not click Run");
  expect(browserHandoffPrompt("http://localhost", "", true, "claude")).toContain("I allow you to enable");
});
const notebook = () => ({nbformat:4,nbformat_minor:5,metadata:{widgets:{state:"private"}},cells:[{
  cell_type:"code",metadata:{tags:["omero-analysis-config"]},execution_count:2,outputs:[{output_type:"stream",text:"private-output"}],
  source:`import omero_analysis_notebook as oan\nctx = oan.configure(r'''${JSON.stringify({schema:"nl.bioimaging.omero-analysis-notebook.v1",inputs:[{id:"data",kind:"query",path:"input/data.csv",formats:["csv"]}],results:{path:"results"},parameters:[],requirements:["pandas"]})}''')`
}]});
it("validates the portable contract and removes outputs without executing cells", async () => {
  const file = assistantNotebook("new-analysis.ipynb", JSON.stringify(notebook()));
  const text = await new Promise<string>((resolve,reject) => {const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsText(file);});
  expect(file.name).toBe("new-analysis.ipynb");
  expect(text).not.toMatch(/private-output|widgets/);
  expect(JSON.parse(text).cells[0].execution_count).toBeNull();
  expect(JSON.parse(text).cells[0].outputs).toEqual([]);
});
it("rejects malformed JSON, legacy notebooks and filenames containing paths", () => {
  expect(()=>assistantNotebook("../bad.ipynb","{}")).toThrow(/without folders/);
  expect(()=>assistantNotebook("file.ipynb","bad")).toThrow(/valid UTF-8 JSON/);
  const legacy=notebook();legacy.cells[0].metadata.tags=[];
  expect(()=>assistantNotebook("file.ipynb",JSON.stringify(legacy))).toThrow(/portable input/);
});
