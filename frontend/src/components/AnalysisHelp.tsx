import { useEffect, useMemo, useRef, useState } from "react";
import manual from "../../../docs/MANUAL.md?raw";
import { MarkdownPreview } from "./WorkspacePanels";
import { Button, Input } from "./BlueprintControls";

export function helpSections(markdown: string) {
  return markdown.split(/(?=^##\s+)/m).filter(content => /^##\s/m.test(content)).map((content, index) => ({
    heading: content.match(/^##\s+(.+)$/m)![1], content, id: `analysis-help-${index}`
  }));
}
export function AnalysisHelp({onClose}: {onClose: () => void}) {
  const panel = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const sections = useMemo(() => helpSections(manual), []);
  const visible = sections.filter(section => section.content.toLowerCase().includes(query.trim().toLowerCase()));
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLInputElement>('input')?.focus();
    return () => previous?.focus();
  }, []);
  return <div className="dialog-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={panel} className="app-dialog analysis-help" role="dialog" aria-modal="true" aria-label="Analysis help" onKeyDown={event => {
      if (event.key === "Escape") {event.stopPropagation(); onClose();}
      if (event.key === "Tab") {
        const nodes = Array.from(panel.current!.querySelectorAll<HTMLElement>('button:not([disabled]), input, a[href]'));
        const target = event.shiftKey ? nodes.at(-1) : nodes[0];
        if (event.shiftKey ? document.activeElement === nodes[0] : document.activeElement === nodes.at(-1)) {event.preventDefault(); target?.focus();}
      }
    }}>
      <header><div><h2>OMERO.Analysis help</h2><small>1.1 beta · Practical guide from input to saved results</small></div><Button onClick={onClose}>Close help</Button></header>
      <div className="analysis-help-search"><label>Search manual<Input type="search" value={query} placeholder="Try parameters, delete, tracking or skills…" onChange={event => setQuery(event.target.value)} /></label><span role="status">{visible.length} of {sections.length} topics</span></div>
      <div className="analysis-help-layout"><nav aria-label="Help contents">{visible.map(section => <Button icon={false} key={section.id} onClick={() => document.getElementById(section.id)?.scrollIntoView({block: "start"})}>{section.heading}</Button>)}</nav>
        <div className="analysis-help-content">{visible.map(section => <section id={section.id} key={section.id}><MarkdownPreview markdown={section.content} /></section>)}
          {!visible.length && <p>No topics match “{query}”. Try another word or clear the search.</p>}
        </div>
      </div>
    </section>
  </div>;
}
