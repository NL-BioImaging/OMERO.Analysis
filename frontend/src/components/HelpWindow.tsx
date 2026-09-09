import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import manualMarkdown from "../../../docs/MANUAL.md?raw";
import { MarkdownPreview } from "./WorkspacePanels";
import { Button, Input } from "./BlueprintControls";

function slug(value: string): string {
  return value.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
}

function manualSections(markdown: string) {
  const parts = markdown.split(/(?=^##\s+)/m);
  return parts.map((content, index) => {
    const heading = content.match(/^##\s+(.+)$/m)?.[1]?.trim()
      || (index === 0 ? "Overview" : `Section ${index + 1}`);
    return { heading, id: `manual-${slug(heading)}`, content };
  });
}

export function HelpWindow({ onClose }: { onClose: () => void }) {
  const panel = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState({
    x: Math.max(8, window.innerWidth - Math.min(900, window.innerWidth - 48) - 24),
    y: Math.min(92, Math.max(8, window.innerHeight - 328))
  });
  useEffect(() => {
    const clamp = () => setPosition(current => ({
      x: Math.max(8, Math.min(current.x, window.innerWidth - (panel.current?.offsetWidth || 0) - 8)),
      y: Math.max(8, Math.min(current.y, window.innerHeight - (panel.current?.offsetHeight || 0) - 8))
    }));
    const observer = new ResizeObserver(clamp);
    if (panel.current) observer.observe(panel.current);
    window.addEventListener("resize", clamp);
    return () => { observer.disconnect(); window.removeEventListener("resize", clamp); };
  }, []);
  const sections = useMemo(() => manualSections(manualMarkdown), []);
  const normalized = query.trim().toLowerCase();
  const visible = normalized
    ? sections.filter((section) =>
      `${section.heading}\n${section.content}`.toLowerCase().includes(normalized))
    : sections;

  const startDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button, input")) return;
    const origin = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      left: position.x,
      top: position.y
    };
    const move = (next: PointerEvent) => setPosition({
      x: Math.max(0, Math.min(
        window.innerWidth - (panel.current?.offsetWidth || 900) - 8,
        origin.left + next.clientX - origin.pointerX
      )),
      y: Math.max(0, Math.min(
        window.innerHeight - (panel.current?.offsetHeight || 320) - 8,
        origin.top + next.clientY - origin.pointerY
      ))
    });
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };

  return (
    <aside
      ref={panel}
      className="help-window"
      aria-label="OMERO Analysis manual"
      style={{ left: position.x, top: position.y }}
    >
      <header className="help-window-titlebar" onPointerDown={startDrag}>
        <strong>OMERO.Analysis Manual</strong>
        <Button aria-label="Close Help" onClick={onClose}>×</Button>
      </header>
      <div className="help-window-search">
        <label>
          <span className="sr-only">Search manual</span>
          <Input
            type="search"
            placeholder="Search the manual…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <small>{visible.length} section{visible.length === 1 ? "" : "s"}</small>
      </div>
      <div className="help-window-layout">
        <nav aria-label="Manual table of contents">
          <strong>Contents</strong>
          {sections.map((section) => (
            <Button
              key={section.id}
              onClick={() => document.getElementById(section.id)?.scrollIntoView({
                behavior: "smooth",
                block: "start"
              })}
            >
              {section.heading}
            </Button>
          ))}
        </nav>
        <div className="help-window-content">
          {visible.map((section) => (
            <section id={section.id} key={section.id}>
              <MarkdownPreview markdown={section.content} />
            </section>
          ))}
          {!visible.length && <p>No manual sections match “{query}”.</p>}
        </div>
      </div>
    </aside>
  );
}
