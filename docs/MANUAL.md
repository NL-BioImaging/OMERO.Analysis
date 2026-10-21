# OMERO.Analysis user manual — 1.1 beta

## Quick start: from data to a result

1. Open BIOMERO Data Analysis from your OMERO image, plate or screen. Choose the source, select the input attachments and create or open a workspace. Back and Next keep your choices. Recent workspaces are available on this launch screen.
2. In Analysis, Explorer opens on the left and Inspector selects the first database or CSV. Check that this is the intended data. Select a spreadsheet, image or another input to inspect it instead.
3. Open Libraries and import a starter or workflow example. Alternatively, choose New or Upload in Notebooks. Importing a library notebook makes a workspace copy.
4. Check compatibility and Notebook setup. Select the intended input if more than one matches. Set Run parameters if the notebook declares them.
5. Review the Python cells, then choose Run all. Outputs appear below each cell. Generated files appear below the notebook in Explorer.
6. Check the thin status row for successful OMERO synchronization before closing. Download the notebook if you also want a portable copy.

An Analysis workspace combines input references, notebooks, run settings and generated files. It does not change the source measurements. Remote database inspection uses bounded read-only queries; opening a large database does not download it into the browser.

## Find your way around

The four tabs are Inspector, Notebooks, Libraries and Skills. Explorer is always visible. Selecting a file opens Inspector; selecting a notebook opens Notebooks. Switching tabs does not restart notebook Python. The highlighted Explorer row shows the current selection.

The top row names this workspace. The icons on the right rename it, change the standalone theme and open this help. Embedded Analysis follows BIOMERO's theme. The smaller second row shows loading, local saving, OMERO synchronization and destination information. Hover over an icon for its explanation.

Open another workspace from the BIOMERO launch screen. Analysis deliberately does not contain a workspace switcher. Open in new tab opens the current workspace separately; it does not create a copy. Avoid editing the same notebook simultaneously in several tabs.

## Explorer, attachments and selection

Inputs contains attached measurement files, supporting spreadsheets/templates and source image or plate entries. Use Attach input to add data. A local file is available in this browser; a remote OMERO attachment retains its source reference. Hover over a filename for its origin, path and size.

Drag the vertical splitter to resize Explorer. When the splitter is focused, arrow keys also adjust its width. Expand or collapse folders with their arrows. Find a file narrows visible rows without changing the files in the workspace. Refresh workspace updates the available workspace data; it is not a kernel restart.

Click a filename to inspect it. Database and CSV/TSV inputs have no deletion checkbox or Delete menu and are excluded from bulk removal. Other checkboxes select items for removal without opening them. Select all includes selectable workspace items. A Results-folder, run-folder or plot-group checkbox includes all its children, including files currently hidden by search. A partial checkbox means only some children are selected.

Right-click a row with a checkbox, or focus it and press Shift+F10, to open its context menu. Delete removes only that row and its children. It does not remove other checked items. Remove selected items applies to the entire checked selection. Escape closes the context menu.

Removing an input detaches it from this workspace; it does not delete its source OMERO image or plate. Source image/plate rows do not offer deletion checkboxes. Undo last removal recovers the last Analysis removal, including after reload. Results deleted in OMERO itself cannot be recovered with Analysis Undo.

## Inspect database tables and CSV

Select a DuckDB, SQLite or CSV input. Choose a table or view to see its columns and types, then browse its rows. Database results use 100-row pages by default. Page navigation fetches the next bounded page rather than the complete database.

Choose visible columns to focus on useful measurements. Sort a column, apply the available filters and request a column summary when you need ranges, missing-value counts or distributions. Summaries run on demand; a wide table does not automatically trigger a query for every column.

Inspector uses a query environment separate from the notebook kernel. Changing the inspected input or viewing a result does not clear notebook variables. A local inspection environment may need a first-time download, then stays warm across local files. Remote sources use the configured DataQueryWorker.

Use column names and types from the actual schema. A file being a measurement database does not guarantee it contains cells, nuclei, tracking or a particular biological measurement. Missing tables are different from tables containing measured zero counts.

## Database diagram and relationships

Choose Diagram to see table cards with their columns. Select a card to inspect that table. Lines can help identify possible joins between tables, such as an image identifier shared by object measurements and an image table.

Dashed relationships inferred from identifier names are suggestions, not proof of a declared foreign-key constraint. Check the columns, identifier values and expected relationship before joining. Joining two tables with several rows per identifier can multiply rows and inflate counts. Aggregate at the intended biological level before combining many-to-many data.

## SQL, export and query notebooks

Use the SQL editor for bounded, read-only inspection. Start with a small query and the actual table/column names shown in Inspector. For example, if your schema has an images table:

```sql
SELECT * FROM images LIMIT 20
```

Read-only restrictions, timeouts and row limits also apply to custom SQL. Modification statements, attaching arbitrary databases and unrestricted file access are not supported. An error names the failed query or requirement; changing a source is not a solution to a syntax error.

Export downloads the returned result as CSV. A paged preview or bounded query export is not a full database backup. Create notebook from query puts the query into an editable notebook so you can develop the analysis further. Review its inputs and compatibility before running.

## Spreadsheets, templates and image viewers

Select an Excel workbook to preview its sheets. Choose the intended sheet and inspect its headings before using it in a notebook. A plate template is an ordinary supporting input; attaching one does not automatically join it to measurements. Match well identifiers, plate identifiers and timepoints explicitly.

Select the source image or plate entry in Explorer to see provenance and available viewer links. Open source in OMERO opens the validated source object. A ZarrViewer link appears only when that viewer is installed and the source has a supported, validated Zarr reference. Selecting a CSV or plot does not show unrelated image links.

A missing viewer link can mean the source has no supported viewer reference. It does not mean the measurement file is unusable. Analysis never builds viewer URLs from arbitrary database filenames or filesystem paths.

## Choose a notebook and understand compatibility

Libraries and Notebooks show compatibility beside notebook entries. Ready means the notebook's declared checks passed for the current input and supported packages. It does not validate the scientific interpretation of the analysis.

Missing requirements lists the absent input format, required file, table, column, package or workflow readiness condition. Not checked means checks have not completed or could not complete; inspect the message before proceeding. Choose input means a compatible binding needs a decision, often because several inputs match.

Analysis automatically binds an unambiguous compatible input. Recheck after attaching or changing data. Importing or editing an incompatible notebook is allowed so you can adapt it. Execution requires resolved prerequisites. Fix a wrong declaration only after checking the code really supports the data; removing a warning alone does not make an analysis correct.

Workflow examples come from configured workflow revisions and retain source/checksum provenance. Local, unreleased examples can be imported explicitly. Their presence does not change the workflow execution version. CI Segmentation examples are owned by that workflow, not built into Analysis.

## New, upload, download and rename

New creates an editable notebook. Upload imports a valid .ipynb file. It does not execute imported code. Download saves the current notebook as an .ipynb, including its saved cell outputs. Rename changes its workspace name. Notebook files and whole-workspace recovery snapshots are different artifacts.

Use Libraries to reuse an existing notebook or template. Importing makes a copy, preserving access and publication rules on the original. Shared content still follows OMERO owner/group permissions. Library imports do not grant access to another user's input data.

## Notebook setup: describe what the notebook needs

Open Notebook setup above the cells. It describes input roles, file formats, portable paths, required tables/columns, parameters, packages and results. This is the notebook author's configuration, shared with anyone who reuses the notebook.

Inspect input structure loads the available tables and columns using read-only inspection. Only the requirements you select are added. It does not download a large remote database or restart notebook Python. Give inputs meaningful roles, for example measurements and plate_template. Existing input IDs remain fixed because Python cells may refer to them.

Advanced options cover filename patterns, column types, bounded read-only readiness checks and database-backed parameter choices. Readiness checks should answer a small question such as whether tracking observations exist. They should not perform the analysis or modify data.

Apply setup validates the form and updates the existing first Python configuration cell. Surrounding code, cell IDs, notebook metadata and supported unknown contract fields are preserved. Cancel returns to the saved setup. Preview configuration source shows the proposed Python change before applying it.

Unapplied setup drafts are stored locally and can survive a reload. If the Python configuration changed while a form draft was open, Reload setup discards that draft in favor of current source; conflicting drafts cannot overwrite each other. Legacy notebooks gain a contract only through Add portable setup. Their analysis is not automatically converted.

## Run parameters: values for this execution

Run parameters is separate from Notebook setup. Setup defines a parameter's type, meaning, default and valid choices. Run parameters selects its value for this notebook's next execution. Changing a run value does not rewrite the Python default. The chosen values are stored with the notebook and recorded in run provenance.

For example, setup might define minimum_count with a default of 10. Choosing 20 in Run parameters runs with 20, while the reusable notebook still declares default 10. Reset to defaults is explicit.

Load choices performs bounded read-only queries in the inspection service. Select the intended values after loading. Missing choices, invalid numbers or other invalid values block running and explain what needs correction. Notebooks without declared parameters do not need a run-parameter form.

Setup, input binding and parameter edits mark earlier outputs stale. They do not restart the kernel while you are editing. Initialize setup prepares the current configuration explicitly. Use Run all for a complete clean execution.

## Edit Python and Markdown cells

Existing Python cells start collapsed, with outputs visible below them. Expand a cell to inspect or edit its source. New cells and cells in a newly created notebook open for editing. Markdown cells hold headings, explanations and interpretation. Raw is not offered as a cell type.

Add or delete a cell, move it up or down, or change it between Python and Markdown. Keep the portable configuration cell first. Edit setup in Python opens that cell directly. Valid source changes update the graphical setup; the Python source remains the portable source of truth.

An invalid configuration or source draft remains recoverable locally and cannot overwrite the last valid notebook. Correct the highlighted issue before running. An edited cell's old output is marked stale until rerun. A plot shown under stale code is historical output, not evidence that the edited code executed.

## Run cells, Run all, Stop and Restart

Run cell or Shift+Enter executes that cell with the current notebook variables. It does not silently run earlier analytical cells. If a portable analysis cell needs initialization, choose Initialize setup first, then run the needed cells in order. A NameError often means a variable was never created in this kernel.

Run all starts a clean kernel, binds inputs and runs code cells from top to bottom. Use this to check the complete notebook is reproducible. A single-cell execution retains variables for an interactive edit/run loop. Both complete and individual-cell executions have their own run identity for generated files.

Stop cancels execution. Restart kernel clears variables. Outputs already saved may remain visible; restarting is not the same as deleting results. If preparation was still loading inputs when you stopped, Analysis does not continue running afterward.

Switching between Inspector, Notebooks, Libraries and Skills keeps notebook state. Selecting another notebook or executing after changing input bindings starts the appropriate clean state. Inspecting a CSV, database table or plot must not reset the notebook kernel.

## Input paths and portable Python

Use the actual binding examples shown with the selected notebook. Portable notebook inputs live under input/ and generated files under results/. These logical paths are not server filesystem paths. A remote database binding uses the read-only query service rather than copying the database into Python.

Use the selected authoring skill for the exact SDK contract and remote-query examples. For supporting spreadsheets, obtain the declared path through the notebook context, inspect sheet names and headings, then read the intended sheet. Never assume a plate template is available merely because the source is a plate.

Packages must be supported by the browser Python runtime and declared when required. A package installed on your workstation is not automatically installed in the notebook kernel. A notebook using unrestricted local filesystem paths or a desktop-only library needs adaptation before running here.

## Results, plot companions and different runs

Generated files appear under their notebook's Results folder. Current outputs have Run folders labeled with UTC time and a short unique identifier. Only one current version of each result filename is kept per notebook, parameter combination and input binding. Different parameter combinations remain separate. Inside a run, matching PNG, SVG and CSV basenames form a plot group. The PNG is a convenient preview, SVG supports scalable graphics, and CSV holds exported tabular values. Check that a notebook actually writes the formats you need.

OMERO filenames include the notebook name, run timestamp/identifier and original output filename. For example, counts__20261021T120000000Z-a1b2c3d4__cells_per_well.png has companions ending in .svg and .csv with the same run prefix. After a successful Run all with the same parameters and inputs, its outputs replace the previous matching run. Other parameter combinations remain available. A successful single-cell run replaces only the filenames it generated, preserving other current results. Failed or stopped runs do not replace saved results. Downloaded workspace files retain their original useful basenames.

On first use of this version, older duplicate result versions are compacted to the most recently created active file per notebook, parameter/input identity and filename. Analysis does not invent missing legacy run provenance. Superseded versions are removed from the synchronized inventory and recovery snapshot. Keep an explicit download outside the workspace if you need a historical comparison.

CSV/SVG companions are attached to their plot Image in OMERO. Standalone files are attached to the workspace Dataset. Legacy results without a reliable notebook owner stay under Other results. Select a file to inspect or download it; remove a group or run with its checkbox or context menu.

## Automatic saving and OMERO synchronization

Local drafts are saved in this browser. Valid notebooks, generated results, templates and workspace recovery state synchronize automatically to the managed OMERO workspace destination. The status row distinguishes saving, saved, pending imports and sync failure. A plot may wait for the configured image importer after its bytes have been saved.

Wait for synchronization to complete before relying on another browser or computer. Local saved does not guarantee OMERO has received the latest change. A network failure preserves local work and reports a retryable sync error. An unavailable importer or query worker needs its service/configuration restored; repeatedly changing notebook parameters will not fix it.

Analysis checks remote workspace status on focus and periodically while open. Results deleted or unlinked directly in OMERO disappear from Explorer after reconciliation. There is one current synchronized notebook and recovery snapshot per workspace, and one result version per parameter/input combination. Replaced objects are cleaned after the new manifest commits successfully. Deletion receipts persist on the server, so stale browser copies and old snapshots cannot upload those result records again. Re-running a notebook can intentionally generate a new result with a new identity.

Analysis Undo applies only to reversible removals made inside Analysis. It cannot restore a file deleted in OMERO. Deletion reconciliation preserves notebook source, inputs, templates and unrelated OMERO objects. Historical inline outputs saved inside a notebook can still show a past figure even after its separate generated file was deleted.

## Skills: ask an external browser assistant

1. Open Skills and describe your question, including the intended biological level: object, image, well, plate or timepoint. Choose the available notebook-authoring, workflow measurement and optional viewer guidance.
2. Review Share input names and table structure, selected by default. The preview includes attached input names, formats, roles, portable paths, table/column names and capabilities. Uncheck it if you do not want this context shared. It excludes measurement rows, notebook outputs, passwords and tokens by default.
3. Choose the browser instruction for ChatGPT with Chrome or Claude in Chrome. Copy it into your browser-enabled chat and keep Analysis signed in. Your assistant's browser/site permissions must allow access to this local page. A cloud-only browser cannot reach your localhost.
4. The assistant uses Browser assistant area → Read guidance to retrieve the selected skills and approved context. It can inspect the input list, including plate_template.xlsx. Supporting spreadsheets/templates offer on-request downloads up to 32 MiB; database inputs remain remote. Approve sharing file contents in your external chat if needed.
5. The assistant creates a compatible portable .ipynb and submits Notebook filename and Notebook JSON through Import created notebook. This uses the normal parser, contract validation and workspace import API. It preserves existing notebooks and does not execute the new notebook.
6. Review compatibility, bindings, code and run values in Notebooks, then choose Run all yourself. Invalid imports remain editable for correction.

Analysis does not connect an AI account, send a prompt to an AI provider or run an in-application assistant. Your external chat controls its own browser access. Guidance is not a guarantee that generated code is correct. Review code and interpretation before running it.

For a chat without browser access, download the skills bundle, unzip it and attach the selected guidance/context yourself. Copy the prepared prompt. Download the generated .ipynb and use Notebooks → Upload. Individual skill previews and downloads are also available.

## Counts, segmentation and tracking examples

Generic CSV/database starters belong to Analysis. Workflow examples supply their own measurement assumptions. CI Segmentation can contain cells/nuclei, other objects/spots, tracking, or combinations of these. Check actual label types and available tables before choosing an example.

Cell counts per well should aggregate fields while keeping timepoints and label sets separate. For an ordinary image, report the appropriate image-level count. No template should be required for a basic count. A missing cell label set means cells were not measured; it must not be displayed as zero cells.

Object/spot counts can work without cell or nucleus segmentation. Tracking examples require recorded tracking tables and must use the recorded time/speed units. A measured zero is distinct from missing data. Plate-quality plots, distributions and focus summaries need the relevant measurements; absence of a quality measurement is not evidence of good quality.

## Troubleshooting and readable errors

**I deleted results in OMERO but still see them.** Bring Analysis to the foreground or refresh it. Reconciliation checks the managed result links and hides externally removed files. Allow a periodic status check to finish. A figure inside a notebook cell may be a historical inline output; it is separate from its generated file. Do not rerun merely to refresh Explorer, because rerunning creates new outputs.

**Not checked or missing requirements.** Read the specific reason. Attach the intended file, choose a matching input, or use a notebook for this schema. Check available label sets before interpreting counts. Tracking absent is a missing prerequisite, not a track count of zero.

**Remote query worker unavailable.** The input can still be listed while remote querying is unavailable. Ask the deployment maintainer to restore DataQueryWorker/configuration. A permission denial needs access correction; an expired session needs login; a network failure needs connectivity. These are distinct conditions.

**A Python cell fails.** Read the message below it and expand the traceback. Check that setup was initialized, preceding required analytical cells ran, names match the schema and packages are supported. Run all from a clean state to find hidden dependencies on previous interactive work.

**A setup draft cannot apply.** Correct the validation message. If Python changed concurrently, copy any useful draft values before Reload setup. Invalid source remains local, while the last valid notebook stays safe.

**The plot looks old.** Check stale markers and the run timestamp. Edits do not recalculate outputs. Review Run parameters, then run the intended cell or Run all. A matching filename alone does not identify an execution.

**Saving or importing stays pending.** Check the status row and Retry when offered. A pending plot import may require the importer to finish. Avoid several tabs saving the same workspace. Keep the tab open or download your notebook before clearing browser storage.

**A notebook cannot find a template.** Check Inputs and its exact portable path, sheet names and headings. Import a template from Libraries or attach it explicitly. A plate source does not imply an attached template.

## Login, privacy and keyboard reference

An expired OMERO session preserves local drafts and redirects the top-level window to login, with a same-origin return destination. Sign in again to resume. Permission denial does not mean your session expired. Embedded theme follows the host; use the standalone theme control only outside it.

Do not clear browser site data to solve a sync error without first saving/downloading your local work. Browser-only inputs and unapplied drafts are not guaranteed to exist elsewhere. Skills context sharing is visible and optional; no raw measurements or credentials are included by default.

- Shift+Enter in a Python cell runs that cell.
- Shift+F10 on a selectable Explorer row opens its context menu.
- Escape closes the Explorer context menu or this help dialog.
- Arrow keys on the focused Explorer splitter resize it.
- Tab and Shift+Tab move between controls. The help dialog keeps focus inside until closed.
- Search manual filters these help sections; use Contents to jump to a topic. Clear the search to see the full manual.
