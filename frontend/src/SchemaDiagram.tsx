import { useMemo, useState } from "react";
import { Button } from "./components/BlueprintControls";
export type DiagramTable = {name: string; columns?: {name: string; type?: string}[]};
export function schemaLinks(tables: DiagramTable[]) {
  // Names suggest useful joins, but never prove foreign-key constraints.
  const links: {from: string; to: string; column: string}[] = [];
  for (const target of tables) {
    const singular = target.name.replace(/^.*\./, "").replace(/ies$/, "y").replace(/s$/, "");
    const key = `${singular}_id`;
    if (!target.columns?.some(c => c.name === key)) continue;
    for (const source of tables) if (source !== target && source.columns?.some(c => c.name === key)) {
      links.push({from: source.name, to: target.name, column: key});
    }
  }
  return links;
}
export function SchemaDiagram({tables, selected, onSelect}: {tables: DiagramTable[]; selected: string; onSelect: (name: string) => void}) {
  const [filter, setFilter] = useState("");
  const [zoom, setZoom] = useState(1);
  const visible = useMemo(() => tables.filter(t => t.name.toLowerCase().includes(filter.toLowerCase())).slice(0, 100), [tables, filter]);
  const links = schemaLinks(visible);
  const cardWidth = 270, gap = 110;
  const positions = new Map<string, {x: number; y: number; height: number}>();
  const heights = [25, 25, 25];
  visible.forEach((table, i) => {
    const col = i % 3, height = 46 + Math.min(table.columns?.length || 0, 30) * 20;
    positions.set(table.name, {x: 25 + col * (cardWidth + gap), y: heights[col], height});
    heights[col] += height + 65;
  });
  const width = 3 * (cardWidth + gap), height = Math.max(...heights, 250);
  return <section className="schema-diagram" aria-label="Database relationships">
    <div className="inspector-toolbar"><label>Find table <input aria-label="Find diagram table" value={filter} onChange={e => setFilter(e.target.value)} /></label>
      <Button onClick={() => setZoom(z => Math.max(.4, z - .15))} title="Zoom out">−</Button><span>{Math.round(zoom * 100)}%</span>
      <Button onClick={() => setZoom(z => Math.min(2, z + .15))} title="Zoom in">+</Button><Button onClick={() => { setFilter(""); setZoom(1); }}>Reset view</Button></div>
    <p className="schema-legend">Dashed lines suggest joins between matching identifier columns. They are inferred, not declared foreign keys. Click a table to browse it. Scroll to explore; zoom with the controls.</p>
    <div className="schema-canvas"><svg width={width * zoom} height={height * zoom} viewBox={`0 0 ${width} ${height}`} role="group" aria-label="Tables and candidate relationships">
      <defs><marker id="schema-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" /></marker></defs>
      {links.map((link, index) => {
        const a = positions.get(link.from)!, b = positions.get(link.to)!;
        const x1 = a.x + cardWidth, y1 = a.y + 25, x2 = b.x, y2 = b.y + 25;
        return <path key={`${link.from}:${link.to}:${index}`} d={`M ${x1} ${y1} C ${x1 + 55} ${y1},${x2 - 55} ${y2},${x2} ${y2}`} className="schema-edge" markerEnd="url(#schema-arrow)"><title>{link.from}.{link.column} → {link.to}.{link.column} (inferred)</title></path>;
      })}
      {visible.map(table => {
        const p = positions.get(table.name)!;
        return <g key={table.name} className={`schema-node ${selected === table.name ? "selected" : ""}`} transform={`translate(${p.x},${p.y})`} role="button" aria-label={`Browse ${table.name}`} tabIndex={0}
          onClick={() => onSelect(table.name)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(table.name); } }}>
          <rect width={cardWidth} height={p.height} rx="6" /><text x="12" y="25" className="schema-table-title">{table.name.length > 30 ? `${table.name.slice(0, 29)}…` : table.name}<title>{table.name}</title></text>
          {(table.columns || []).slice(0, 30).map((column, i) => <text key={column.name} x="12" y={48 + i * 20} className="schema-column"><title>{column.name} · {column.type || "type unspecified"}</title>{column.name.length > 28 ? `${column.name.slice(0, 27)}…` : column.name}</text>)}
        </g>;
      })}
    </svg></div>
    {!links.length && <p>No candidate relationships found in these column names. This does not prove that the tables are unrelated.</p>}
    {visible.length === 100 && <p>Showing the first 100 matching tables. Use Find table to narrow the diagram.</p>}
  </section>;
}
