import {schemaLinks} from "./SchemaDiagram";
it("suggests identifier joins without inventing links for arbitrary matching values",()=>{
  const links=schemaLinks([{name:"images",columns:[{name:"image_id"}]},{name:"objects",columns:[{name:"object_id"},{name:"image_id"}]},{name:"unrelated",columns:[{name:"name"}]}]);
  expect(links).toEqual([{from:"objects",to:"images",column:"image_id"}]);
});
