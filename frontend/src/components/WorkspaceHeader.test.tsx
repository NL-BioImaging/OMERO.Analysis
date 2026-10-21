import {fireEvent,render,screen} from "@testing-library/react";
import {WorkspaceHeader} from "./WorkspaceHeader";
import {AnalysisNavigation} from "./AnalysisNavigation";
import type {WorkspaceRecord} from "../types";
it("shows a fixed analysis name and right-side icon actions without workspace navigation",()=>{
 const onRename=vi.fn(),onTheme=vi.fn(),onHelp=vi.fn();
 const view=render(<WorkspaceHeader workspace={{id:"one",name:"SolHunt"} as WorkspaceRecord} disabled={false} theme="dark" embedded={false} onRename={onRename} onTheme={onTheme} onHelp={onHelp}/>);
 expect(screen.getByLabelText("Analysis workspace")).toHaveTextContent("SolHunt");
 expect(view.container.querySelector("select")).toBeNull();
 expect(screen.queryByRole("button",{name:"New workspace"})).not.toBeInTheDocument();
 expect(screen.getAllByRole("button").map(b=>b.getAttribute("aria-label"))).toEqual(["Rename workspace","Change theme","Analysis help"]);
 fireEvent.click(screen.getByRole("button",{name:"Rename workspace"}));expect(onRename).toHaveBeenCalledTimes(1);
 fireEvent.click(screen.getByRole("button",{name:"Change theme"}));expect(onTheme).toHaveBeenCalledTimes(1);
});
it("keeps embedded theme ownership with BIOMERO",()=>{
 render(<WorkspaceHeader workspace={{id:"one",name:"SolHunt"} as WorkspaceRecord} disabled={false} theme="dark" embedded onRename={()=>{}} onTheme={()=>{}} onHelp={()=>{}}/>);
 expect(screen.queryByRole("button",{name:"Change theme"})).not.toBeInTheDocument();
});
it("renders plain connected tabs without auto-generated icons",()=>{
 const navigate=vi.fn();const view=render(<AnalysisNavigation activeTab="inspector" onNavigate={navigate}/>);
 expect(screen.getAllByRole("button").map(b=>b.textContent)).toEqual(["Inspector","Notebooks","Libraries","Skills"]);
 expect(view.container.querySelector(".bp5-icon")).toBeNull();
 fireEvent.click(screen.getByRole("button",{name:"Notebooks"}));expect(navigate).toHaveBeenCalledWith("notebooks");
});
