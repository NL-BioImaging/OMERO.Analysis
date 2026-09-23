# OMERO.Analysis Manual

For group-mapped `.analysis` storage, see [BIOMERO importer and `.analysis` storage compatibility](importer-analysis-storage-compatibility.md). That contract is authoritative for optional dependency versions, environment/mount requirements, capability failure codes, pending imports, and backfill.

OMERO.Analysis combines browser-local data analysis, reusable Methods and Pipelines, run-only Notebooks, and automatic synchronization with OMERO. Notebook code and generated Python run locally in the browser. Source data are not sent to the configured AI provider.

## Getting started

1. Select an Image, Dataset, Plate, or Screen in OMERO.web. Multiple Images or multiple Plates may be selected together to create one selection-specific Workspace.
2. Choose **Analysis** in the center-panel menu.
3. Select the data attachments needed for the analysis.
4. Open Analysis. Inputs appear in the Workspace **Input** folder.

While Analysis restores OMERO data, settings, reusable artifacts, and input bindings, a **Preparing Workspace** progress indicator reports each stage. Explorer is rooted directly at the Workspace launched by the OMERO center panel; it does not browse parent OMERO objects or alternate local Workspaces.

The OMERO.web middle pane adapts to the selected object:

- ordinary Datasets, Screens, Plates, and Images offer a new or existing source Workspace;
- multiple Images or Plates create one Workspace while remaining distinct from each individually opened object;
- a managed Dataset under `+AnalysisWorkspaces` offers to resume its source Workspace and summarizes its revision and reusable contents;
- a synchronized result Image links back to its source Workspace;
- the `+AnalysisWorkspaces` Project explains and displays the managed library;
- `~AnalysisSettings`, **AI Settings**, and **Skills** show information only;
- Projects, Wells, mixed selections, and unsupported objects explain which Dataset, Screen, Plate, or Image selection to use.

Analysis opens on **Home**. Choose **Run a Method**, **Run a Pipeline**, **Run a Notebook**, **Create a Method**, **Create a Pipeline**, or **Create a Notebook**.

## Workspace structure

Use the workspace selector to keep multiple analyses for the same source. **New workspace** assigns a numbered name prefixed by the full source path; **Rename** changes its analysis label while keeping that prefix. Workspaces have stable IDs, so renaming does not mix their Methods, runs, or conversations.

**Manage workspaces** offers **Move to Trash**, **Restore**, and **Delete permanently**. Trash has no automatic expiry. Methods, Pipelines, and Notebooks have equivalent controls in **Trash and Restore**. A Method used by an active Pipeline cannot be trashed until that dependency is replaced or the Pipeline is trashed. Historical runs and pinned versions remain protected.

- **Input** contains OMERO attachments and browser-local files used by analyses.
- **Methods** contains reusable Python analyses and Method results. Its nested **Assistant** folder contains Method-development conversations, attachments, and browser-local validation results.
- **Pipelines** contains ordered Method executions and Pipeline results.
- **Notebooks** contains attached, uploaded, or converted notebooks and Notebook results.

The Artifact Inspector can inspect every selectable Workspace item. The left Explorer and right Artifact Inspector are resizable and can each be hidden or restored with the buttons in the application header. This visibility choice is remembered for the current user and group in the browser.

## Home and Method-authoring Assistant

Home is the default landing page and keeps reusable analyses prominent. The Assistant inspects supported data locally and may test Python in the isolated browser runtime, but its final deliverable must be a complete reusable Python Method script. The final Assistant card starts with a concise **Summary**, **Review**, and **Recommendations**; its complete script is kept in a collapsed **Show reusable Method code** section. If a model returns only prose, plots, files, or source code without the review, Analysis asks it for the complete structured response. Saved Methods and Pipelines are run from Home, Explorer, the Artifact Inspector, or the **Methods** and **Pipelines** tabs, not from the Assistant. The Home **Create a Method** card offers **With Assistant** and, while the artifact editor is enabled, **New Method**. New Methods include explicit paths for all ready Workspace inputs. Editing existing artifacts is available in the corresponding **Methods**, **Pipelines**, or **Notebooks** tab and in Explorer and Artifact Inspector actions, keeping Home focused on running and creating.

For offline and fallback model choices by CPU, GPU memory, context budget, and LM Studio profile, see [Local LLM Recommendations](local-llm-recommendations.md).

Use **Attach files** or **File URL** beside the composer to add up to ten Assistant-wide attachments of at most 25 MiB each. Supported formats are UTF-8 TXT, searchable PDF, DOCX, PNG, JPEG, and WebP. Direct URLs must be public HTTPS file URLs that the browser can fetch without credentials; webpages are not supported. PDF and DOCX extraction runs in browser Python, and OCR is not performed. A missing, unreadable, oversized, or image-only document blocks sending until it is reselected or removed.

Attachment text must fit the displayed model-context budget and is never silently truncated. Images require a vision-capable model; Analysis uses local server metadata when available and performs one harmless cached image probe when support is unknown. Changing to a non-vision model keeps the originals but blocks sending while image attachments remain active.

Every user message is followed by a collapsed **AI activity** card. The final Assistant response appears next, followed by any **Analysis (local)** results. Local plots remain hidden until the Assistant turn has finished. Expand the activity card to see the live response, concise progress and validation steps, tool purposes, and the completed user-facing AI transcript for that turn. Private model chain-of-thought is neither displayed nor stored.

When the assistant cannot continue without a real choice, the activity card opens automatically and presents two to four answer buttons. Selecting an answer resumes the same AI turn. **Stop** cancels a waiting question as well as the running analysis. A question restored after reloading the page is shown as inactive; answer it as a new Assistant message.

Each assistant response has two small controls:

- The **copy icon** immediately before the star copies the complete assistant response, including its Markdown, to the clipboard.
- The **star** pins or unpins the message. An empty star means the message is not pinned; a filled star means it is pinned. Pinned messages are retained in the context sent to the AI even when an older, long conversation is compacted. Use this for important decisions, definitions, caveats, or results that later questions still need. Pinning does not save a Method, attach anything to OMERO, or prevent the Assistant conversation itself from being deleted.

Recent messages are included automatically, so it is not necessary to pin every response. Pin only information that should remain available throughout a long Assistant conversation. Click the filled star again to unpin it.

Saving is available only after the assistant has finished the turn. A saved Method contains the final assistant summary as Python comments above the reproducible code.

When an answer is supported by generated files, **Supporting results** buttons name the actual image or data file they open in the Artifact Inspector. Repeated executions that produced identical bytes are shown only once; an image and its corresponding CSV remain separate because they are different forms of evidence.

## Methods and Pipelines

A Method is reusable Python with version history and an inferred input contract. Select at least two Methods and use **To Pipeline** to create an ordered Pipeline. Use **To Notebook** to convert selected Methods or Pipelines that do not depend on ZarrViewer.

Methods and Pipelines provide **New**, **Edit**, **Rename**, **Run**, **Download**, and **Move to Trash** where applicable. Use **Trash and Restore** to restore items or permanently remove unreferenced items. Restore a Pipeline's required Methods before restoring the Pipeline.

With **Enable artifact editor** on, saved Methods and Pipelines open unchanged, including when input data is missing. Repair unresolved inputs explicitly in the binding panel. Execution validates inputs separately. Pipelines show ordered steps and pinned Method versions; changing a pin requires an explicit edit. Historical runs retain their original versions and bindings.

**New Method** opens an `untitled01.py`-style draft. The first **Save** or **Save and Run** persists version 1. Closing an untouched draft leaves no saved item. Python uses semantic syntax colors, and SQL in a triple-quoted `sql`, `query`, or `statement` assignment is highlighted as SQL.

Home **Create a Pipeline** opens the Pipeline builder in **Pipelines**. Select Methods in execution order and create the Pipeline with the same shared flow as **To Pipeline** in Explorer.

Running a Method opens **Methods** and running a Pipeline opens **Pipelines**. Both tabs have independent, type-specific run histories. Each direct run has durable status, resolved bindings, execution details, and generated files. A Pipeline additionally shows the status of every ordered step. On the first run after opening Analysis, a progress bar reports browser-Python startup and package-loading progress. Direct runs do not add synthetic prompts or results to the Assistant, and deleting an Assistant conversation does not delete their run history or outputs.

## Notebooks

Notebooks are Python nbformat-4 documents. Outside the optional artifact Editor they are read-only and never run automatically. Use **Open** to inspect a Notebook and **Run** to reset the kernel, attach current inputs, and execute all cells in order.

The Notebook menu provides **Open**, **Run**, **Rename**, **Download**, and **Move to Trash**. Restore it from **Trash and Restore**. Permanent deletion is separate and is blocked while its saved result provenance is still needed.

With the artifact editor enabled, **Edit** opens the saved document unchanged. Missing inputs remain editable; use **Apply input bindings** explicitly to repair them before running. The generated input-binding cell is read-only for legacy notebooks. Portable notebooks instead retain their visible tagged protocol cell as the first cell. Saving edited content clears stored execution counts and outputs so stale results are not presented as current. Code cells use Python and embedded SQL syntax highlighting. Markdown cells render formatted text when run or previewed. Raw text cells preserve text exactly and are neither executed nor formatted. The Notebooks folder **New** button creates the first available `untitled01.ipynb`-style name and opens it in the Editor. Home **Create a Notebook** uses the same creation path, or converts a selected Pipeline. A new Notebook is a draft until its first **Save** or **Save and Run**. Closing an untouched draft leaves no saved item. It contains the read-only OMERO.Analysis input-binding cell, an editable code cell, and references to all ready Workspace inputs.

An uploaded portable notebook uses the `nl.bioimaging.omero-analysis-notebook.v1` contract. Analysis validates and sanitizes it, binds query sources and supporting files separately, and shows a native parameter form above the cells. The same `await ctx.query(...)` code can run against a compatible small Local or large Remote DuckDB, SQLite, SQLite3, or CSV attachment. Query transport files are transient and never appear in Workspace Input. Generated files under `ctx.results` appear below the Notebook's results folder. See [the developer guide](portable-notebooks.md).

Remote query limits depend on the worker deployment. The tested large-export profile supports up to 10,000,000 rows and 2 GiB of CSV, including the header. Other profiles can impose smaller limits, and the browser still needs enough memory to consume a result. An oversized query fails explicitly. Use SQL aggregation when only a summary is needed; existing scientific sampling choices are not changed automatically.

Use **Reattach input data** after the Workspace inputs change. Analysis synchronizes the ready local inputs under `/input`, adds or updates one visible first code cell named **OMERO.Analysis input bindings**, and updates unambiguous `/input/...` filenames in the remaining code cells. Reattaching the same inputs updates that binding cell instead of creating duplicates. For a portable notebook, Reattach preserves the protocol cell and rebinds logical input IDs instead.

Notebook execution does not load AI providers, Assistant skills, JupyterLab, widget JavaScript, shell commands, or network package downloads. Developers may use `ctx.display_parameters()` for optional ipywidgets offline; Analysis always uses its native form.

## Workspace synchronization

Analysis automatically mirrors reusable Workspace content into the marked `+AnalysisWorkspaces` Project for the current user and group. It sends only changed items and does not create or upload a large Workspace ZIP. PNG results from direct Method, Pipeline, and Notebook runs become OMERO Images. Other direct results, Methods, Pipelines, and Notebooks become typed attachments. Same-stem plot CSV and SVG FileAnnotations are linked to the corresponding PNG Image rather than to the managed Dataset. Saved Method and Pipeline executions automatically create an SVG companion whenever Matplotlib writes a PNG.

Ready input files with `template` anywhere in the filename are also synchronized under `Templates`. Other source inputs are excluded. Assistant conversations, attachments, and validation results are always excluded. They remain browser-local; extracted text and source URLs are never synchronized.

Synchronization is automatic and incremental. Creating, editing, trashing, or running a reusable artifact schedules an incremental save. Missing, unlinked, inaccessible, or remotely purged data never silently deletes the browser copy. Automatic republishing pauses while access or lifecycle conflicts are unresolved. Use workspace management to review recovery. Other tabs observe lifecycle changes, and stale saves cannot resurrect a trashed workspace.

The status strip reports browser saving, OMERO synchronization, pending imports, and the readable filesystem copy separately. A failed save or partial cleanup stays visible and can be retried. Automatic recovery snapshots reference saved result bytes by identity and checksum instead of packaging them again. Restoring those bytes rechecks access and integrity. Explicit portable ZIP downloads have a size limit and fail clearly when they cannot include the requested content.

Plots show one PNG preview with compact PNG/SVG/CSV download buttons. SVG-only plots remain visible. All formats remain in saved results and archives; separate runs with the same filenames retain their distinct provenance.

Identical result bytes are stored only once in the synchronized Dataset, even when the same PNG or CSV belongs to multiple direct Method, Pipeline, or Notebook runs. A managed Key-Value Pair records every originating Workspace item, so deduplication does not discard provenance.

## Reusing AnalysisWorkspaces

Use **Reuse from +AnalysisWorkspaces** to browse synchronized Datasets and copy Methods, Pipelines, or Notebooks into the current browser Workspace. Imports are independent copies and do not modify the library original.

The single Analysis OMERO panel can import Methods, Pipelines, and Notebooks.

## Analysis Settings

**Enable artifact editor** is off by default. Enabling it adds the **Editor** tab beside the standard Analysis tabs and adds **Edit** to Method, Pipeline, and Notebook menus and Artifact Inspector views. Methods save as a new version, Pipelines increment their version, and Notebooks update in place. **Save and Run** always saves before delegating to the existing runner. Use Ctrl+S or Cmd+S to save; leaving a dirty editor asks before discarding changes. The preference applies to the current user and group and is saved automatically.

**Plot + CSV** asks the Assistant-authored Method to save both a visual plot and the corresponding tabular data. This preference is saved automatically.

Analysis Settings, AI profiles, and user-added skills are saved automatically to the encrypted `~AnalysisSettings` bundle for the current user and group. There are no synchronization switches or manual Settings sync button.

Use the sun/moon button immediately before **Settings** to switch between the default dark interface and the BIOMERO-inspired light interface. The selected theme is remembered in the browser and saved automatically.

## AI profiles

An AI profile contains:

- A profile name
- OpenAI-compatible Chat Completions or Anthropic Messages protocol
- Provider endpoint
- Authentication-header type
- Model or deployment name
- API key
- Optional context-window size

Use **Validate connection** after editing a profile. The validation request is small but may be billed by the provider. When validation succeeds in an OMERO context that supports Settings synchronization, Analysis synchronizes the updated profiles and other Settings automatically.

The **Local AI server** panel is collapsed by default. Expand it to detect LM Studio or Ollama, enter another local OpenAI-compatible URL, select a detected model, or create a local AI profile.

All profiles are saved automatically in the marked `~AnalysisSettings` Project and its **AI Settings** Dataset. The settings JSON is placed in an encrypted server-side bundle before it is attached to OMERO. Encryption is scoped to the current OMERO user and group.

## Skills

A skill is Markdown guidance that helps the Assistant understand a data format or domain. It does not execute code and is never loaded by Notebook.

Automatically discovered BIOMERO and ZarrViewer skills are shown as collapsed cards. Their source links open the provider repository or skill URL.

You can upload a Markdown skill or link a direct HTTPS Markdown URL. User skills can be enabled or disabled. Enabled skills match all inputs unless their metadata lists file extensions.

## Simple skill format

A simple skill can be one Markdown file:

```markdown
---
name: my-table-guide
description: Explains the exported measurement tables
extensions: csv, xlsx
---

# Tables

`objects.csv` contains one row per segmented object.
`images.csv` contains image metadata.

# Relationships

Join `objects.image_id` to `images.id`.

# Analysis guidance

Use `well` as the experimental unit and do not treat individual objects as
independent replicates.
```

Useful skill content includes table meanings, primary keys, relationships, units, missing-value conventions, experimental units, and analysis caveats. Do not put API keys or other secrets in skill files.

Uploaded skills are copied into the **Skills** Dataset in `~AnalysisSettings` automatically.

## Settings synchronization

Analysis automatically synchronizes:

- Analysis Settings
- Every AI profile
- User-added skills

Settings are scoped to the current OMERO user and group. Opening Analysis in the same group restores the latest synchronized settings when available.

## Privacy and security

- Data analysis and Notebook execution run in the browser.
- Ordinary Workspace input files remain browser-local. AI requests contain prompts, generated code, bounded previews and summaries, errors, and—for selected Assistant attachments only—extracted text or metadata-stripped image pixels. Original PDF and DOCX bytes are never sent to the provider.
- API keys synchronized to OMERO are encrypted at rest.
- Custom skills are instructions and can influence Assistant behavior. Add skills only from sources you trust.
- Notebook HTML and JavaScript output are not executed.

## Troubleshooting

Browser Python starts lazily when the Assistant, a Method, a Pipeline, a Notebook, or a database inspection first needs it. Merely opening Analysis, Settings, or a Notebook does not copy inputs into Python.

If the Assistant is unavailable, check that the Workspace inputs are ready and that the active AI profile has an endpoint, model, and any required key. Use **Validate connection** for specific endpoint, authentication, model, CORS, or response-format errors.

If synchronization fails, confirm that the selected OMERO group permits Project/Dataset creation and FileAnnotation creation, then retry after the session keepalive has renewed the connection. Unexpected server failures show a short request ID; include it when checking server logs or reporting the problem.

If a custom URL skill cannot be loaded, use a direct HTTPS Markdown URL or upload the file. GitHub `blob` URLs are converted to their raw-content form.
