(function () {
  "use strict";
  const config = document.getElementById("analysis-retired-records");
  if (!config) return;
  const {kind, records} = JSON.parse(config.textContent);
  const table = document.getElementById(kind === "users" ? "experimenterTable" : "groupTable");
  if (!table || table.dataset.retirementFilter) return;
  table.dataset.retirementFilter = "true";
  let count = 0;
  for (const row of table.querySelectorAll("tbody tr")) {
    const cells = Array.from(row.cells);
    const id = cells[0]?.textContent.trim();
    const name = cells[kind === "users" ? 2 : 1]?.textContent.trim();
    if (records[id] !== name) continue;
    row.classList.add("analysis-retired-fixture");
    count++;
  }
  if (!count) return;
  const style = document.createElement("style");
  // Keep quicksearch's independent inline visibility when retired rows are shown.
  style.textContent = "table:not(.analysis-show-retired) tr.analysis-retired-fixture { display:none !important; } .analysis-retired-toggle { display:block; margin:8px 12px; }";
  document.head.appendChild(style);
  const label = document.createElement("label");
  label.className = "analysis-retired-toggle";
  const toggle = document.createElement("input");
  toggle.type = "checkbox";
  toggle.addEventListener("change", () => table.classList.toggle("analysis-show-retired", toggle.checked));
  label.append(toggle, document.createTextNode(` Show retired test records (${count})`));
  table.before(label);
}());
