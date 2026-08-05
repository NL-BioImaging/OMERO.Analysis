import type {
  HierarchyItem,
  OmeroContext,
  OmeroHierarchy,
  ZarrBinding,
  ZarrFocusTarget,
  ZarrOverlay,
  ZarrRenderRecipe,
  ZarrViewerCapability,
  ZarrViewerIntegrationStatus,
  ZarrViewerProvenance
} from "./types";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_RENDERED_PNG = 32 * 1024 * 1024;
const DEFAULT_RENDER_LIMIT = 2048;
const OVERSIZED_FIELD_PREVIEW = 1024;

function object(value: unknown, label: string): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} is not a valid object`);
  }
  return value as Record<string, any>;
}

function integer(value: unknown, label: string, minimum = 0): number {
  if (!Number.isInteger(value) || Number(value) < minimum) {
    throw new Error(`${label} must be an integer of at least ${minimum}`);
  }
  return Number(value);
}

function finite(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number`);
  }
  return value;
}

function safePath(value: unknown, label: string): string {
  if (typeof value !== "string" || !value || value.length > 1024) {
    throw new Error(`${label} must be a non-empty relative path`);
  }
  const normalized = value.replaceAll("\\", "/").replace(/^\.\/+/, "");
  if (
    normalized.startsWith("/") ||
    normalized.split("/").some((part) => !part || part === ".." || part === ".")
  ) {
    if (normalized !== ".") throw new Error(`${label} is not a safe relative path`);
  }
  return normalized;
}

export function zarrViewerStatusFrom(value: unknown): ZarrViewerIntegrationStatus {
  const body = object(value, "ZarrViewer integration status");
  if (
    body.schema_version !== 1 ||
    typeof body.available !== "boolean" ||
    typeof body.installed !== "boolean" ||
    typeof body.enabled !== "boolean" ||
    !(body.version == null || typeof body.version === "string") ||
    typeof body.minimum_version !== "string" ||
    !["ready", "not-installed", "incompatible-version", "app-disabled"].includes(body.reason)
  ) {
    throw new Error("OMERO returned invalid ZarrViewer integration metadata");
  }
  if (
    body.available &&
    (
      typeof body.viewer_url !== "string" ||
      typeof body.image_capabilities_template !== "string" ||
      typeof body.plate_capabilities_template !== "string" ||
      typeof body.skill_catalog_url !== "string"
    )
  ) {
    throw new Error("The available ZarrViewer integration has no route templates");
  }
  return body as ZarrViewerIntegrationStatus;
}

export function zarrViewerCapabilityFrom(value: unknown): ZarrViewerCapability {
  const body = object(value, "ZarrViewer capability");
  const image = object(body.image, "ZarrViewer image");
  const store = object(body.store, "ZarrViewer store");
  if (
    body.schema_version !== 1 ||
    body.supported !== true ||
    !["image", "plate"].includes(body.kind) ||
    !Number.isInteger(image.id) ||
    typeof image.name !== "string" ||
    typeof store.uuid !== "string" ||
    !UUID.test(store.uuid) ||
    typeof store.roi_url !== "string" ||
    typeof store.render_url !== "string" ||
    typeof body.initial_path !== "string" ||
    !Array.isArray(body.channels) ||
    !Array.isArray(body.labels)
  ) {
    throw new Error("ZarrViewer returned an invalid capability");
  }
  const channels = body.channels.map((raw: unknown) => {
    const channel = object(raw, "ZarrViewer channel");
    if (
      !Number.isInteger(channel.index) ||
      typeof channel.label !== "string" ||
      typeof channel.active !== "boolean"
    ) throw new Error("ZarrViewer returned an invalid channel");
    return { index: channel.index, label: channel.label, active: channel.active };
  });
  const labels = body.labels.map((raw: unknown) => {
    const label = object(raw, "ZarrViewer label");
    if (
      typeof label.id !== "string" ||
      typeof label.name !== "string" ||
      typeof label.path !== "string"
    ) throw new Error("ZarrViewer returned an invalid label");
    return { id: label.id, name: label.name, path: label.path };
  });
  let plate: ZarrViewerCapability["plate"];
  if (body.plate != null) {
    const rawPlate = object(body.plate, "ZarrViewer plate");
    if (
      typeof rawPlate.name !== "string" ||
      !Array.isArray(rawPlate.rows) ||
      !rawPlate.rows.every((value: unknown) => typeof value === "string") ||
      !Array.isArray(rawPlate.columns) ||
      !rawPlate.columns.every((value: unknown) => typeof value === "string") ||
      !Array.isArray(rawPlate.wells)
    ) throw new Error("ZarrViewer returned an invalid plate");
    plate = {
      name: rawPlate.name,
      rows: rawPlate.rows,
      columns: rawPlate.columns,
      wells: rawPlate.wells.map((rawWell: unknown) => {
        const well = object(rawWell, "ZarrViewer well");
        if (typeof well.path !== "string" || !Array.isArray(well.fields)) {
          throw new Error("ZarrViewer returned an invalid well");
        }
        return {
          path: well.path,
          fields: well.fields.map((rawField: unknown) => {
            const field = object(rawField, "ZarrViewer field");
            if (typeof field.path !== "string" || typeof field.name !== "string") {
              throw new Error("ZarrViewer returned an invalid field");
            }
            return { path: field.path, name: field.name };
          })
        };
      })
    };
  }
  // Deliberately discard store.context, store.url, and expires_at. Analysis
  // needs only the identity and the authenticated ROI route.
  return {
    schema_version: 1,
    supported: true,
    image: { id: image.id, name: image.name },
    store: {
      uuid: store.uuid.toLowerCase(),
      name: typeof store.name === "string" ? store.name : undefined,
      roi_url: store.roi_url,
      render_url: store.render_url
    },
    kind: body.kind,
    initial_path: body.initial_path,
    channels,
    labels,
    ...(plate ? { plate } : {})
  };
}

function centeredPoint(
  centroid: [number, number],
  sizeX: number,
  sizeY: number
): [number, number, number, number] {
  const width = Math.min(64, sizeX);
  const height = Math.min(64, sizeY);
  const x0 = Math.max(0, Math.min(sizeX - width, Math.floor(centroid[0] - width / 2)));
  const y0 = Math.max(0, Math.min(sizeY - height, Math.floor(centroid[1] - height / 2)));
  return [x0, y0, x0 + width, y0 + height];
}

function centeredField(sizeX: number, sizeY: number): [number, number, number, number] {
  const width = Math.min(OVERSIZED_FIELD_PREVIEW, sizeX);
  const height = Math.min(OVERSIZED_FIELD_PREVIEW, sizeY);
  const x0 = Math.floor((sizeX - width) / 2);
  const y0 = Math.floor((sizeY - height) / 2);
  return [x0, y0, x0 + width, y0 + height];
}

function zarrOverlay(value: unknown): ZarrOverlay {
  const raw = object(value, "Zarr overlay");
  const labelPath = raw.label_path == null
    ? undefined
    : safePath(raw.label_path, "overlay label_path");
  const labelChannel = raw.label_channel == null
    ? undefined
    : integer(raw.label_channel, "overlay label_channel", 1);
  if (Boolean(labelPath) === Boolean(labelChannel)) {
    throw new Error("Each overlay requires either label_path or label_channel");
  }
  const values = raw.values == null
    ? undefined
    : Array.from(new Set(
      (Array.isArray(raw.values) ? raw.values : [])
        .map((item, index) => integer(item, `overlay values[${index}]`, 1))
    ));
  if (values && values.length > 256) throw new Error("An overlay supports at most 256 values");
  const mode = raw.mode == null ? "outline" : String(raw.mode);
  if (!["outline", "fill", "outline-fill"].includes(mode)) {
    throw new Error("overlay mode must be outline, fill, or outline-fill");
  }
  const opacity = raw.opacity == null
    ? mode === "fill" ? 0.3 : 1
    : finite(raw.opacity, "overlay opacity");
  if (opacity < 0 || opacity > 1) throw new Error("overlay opacity must be between 0 and 1");
  const outlineWidth = raw.outline_width == null
    ? 2
    : integer(raw.outline_width, "overlay outline_width", 1);
  if (outlineWidth > 8) throw new Error("overlay outline_width must be at most 8");
  const color = raw.color == null ? undefined : String(raw.color);
  if (color && !/^#[0-9a-f]{6}$/i.test(color)) {
    throw new Error("overlay color must use #RRGGBB");
  }
  return {
    labelPath,
    labelChannel,
    values,
    mode: mode as ZarrOverlay["mode"],
    color,
    opacity,
    outlineWidth,
    name: typeof raw.name === "string" ? raw.name.trim().slice(0, 80) : undefined
  };
}

function evidenceIds(value: unknown): string[] {
  if (!Array.isArray(value) || !value.length || value.some((item) => typeof item !== "string")) {
    throw new Error("evidence_ids must contain at least one evidence ID");
  }
  return Array.from(new Set(value)).slice(0, 32);
}

export function zarrFocusFromToolArgs(value: unknown): ZarrFocusTarget {
  const raw = object(value, "ZarrViewer focus");
  if (typeof raw.store_uuid !== "string" || !UUID.test(raw.store_uuid)) {
    throw new Error("store_uuid must be a canonical UUID from the measurement database");
  }
  const field = safePath(raw.field, "field");
  if (!["object", "point", "field"].includes(raw.target_kind)) {
    throw new Error("target_kind must be object, point, or field");
  }
  const sizeX = integer(raw.size_x, "size_x", 1);
  const sizeY = integer(raw.size_y, "size_y", 1);
  const sizeZ = raw.size_z == null ? undefined : integer(raw.size_z, "size_z", 1);
  const sizeT = raw.size_t == null ? undefined : integer(raw.size_t, "size_t", 1);
  const t = raw.t == null ? 0 : integer(raw.t, "t");
  const z = raw.z == null ? 0 : integer(raw.z, "z");
  if (sizeT != null && t >= sizeT) throw new Error("t is outside the database image bounds");
  if (sizeZ != null && z >= sizeZ) throw new Error("z is outside the database image bounds");

  let bbox: ZarrFocusTarget["bbox"];
  if (raw.bbox != null) {
    if (!Array.isArray(raw.bbox) || raw.bbox.length !== 4) {
      throw new Error("bbox must contain x0,y0,x1,y1");
    }
    bbox = raw.bbox.map((item, index) => integer(item, `bbox[${index}]`)) as [
      number,
      number,
      number,
      number
    ];
    if (
      bbox[0] >= bbox[2] ||
      bbox[1] >= bbox[3] ||
      bbox[2] > sizeX ||
      bbox[3] > sizeY
    ) throw new Error("bbox is empty or outside the database image bounds");
  }

  let centroid: ZarrFocusTarget["centroid"];
  if (raw.centroid != null) {
    if (!Array.isArray(raw.centroid) || raw.centroid.length !== 2) {
      throw new Error("centroid must contain x,y");
    }
    centroid = [
      finite(raw.centroid[0], "centroid[0]"),
      finite(raw.centroid[1], "centroid[1]")
    ];
  }

  let roi: [number, number, number, number];
  let croppedField = false;
  if (raw.target_kind === "object") {
    if (!bbox) throw new Error("An object preview requires its database bounding box");
    roi = bbox;
  } else if (raw.target_kind === "point") {
    if (!centroid) throw new Error("A point preview requires its database centroid");
    roi = centeredPoint(centroid, sizeX, sizeY);
  } else if (sizeX <= DEFAULT_RENDER_LIMIT && sizeY <= DEFAULT_RENDER_LIMIT) {
    roi = [0, 0, sizeX, sizeY];
  } else {
    roi = centeredField(sizeX, sizeY);
    croppedField = true;
  }

  const sourceChannels = raw.source_channels == null
    ? []
    : Array.from(new Set(
      (Array.isArray(raw.source_channels) ? raw.source_channels : [])
        .map((item, index) => integer(item, `source_channels[${index}]`, 1))
    ));
  if (sourceChannels.length > 4) throw new Error("At most four source channels may be rendered");
  const labelPath = raw.label_path == null ? undefined : safePath(raw.label_path, "label_path");
  const labelChannel = raw.label_channel == null
    ? undefined
    : integer(raw.label_channel, "label_channel", 1);
  if (labelPath && labelChannel != null) {
    throw new Error("Use either label_path or label_channel, not both");
  }
  const labelValue = raw.label_value == null
    ? undefined
    : integer(raw.label_value, "label_value", 1);
  if ((labelPath || labelChannel != null) && labelValue == null) {
    throw new Error("A label overlay requires label_value");
  }
  const overlays = raw.overlays == null
    ? []
    : (Array.isArray(raw.overlays) ? raw.overlays : []).map(zarrOverlay);
  if (overlays.length > 8) throw new Error("At most eight overlays may be rendered");
  if (!overlays.length && (labelPath || labelChannel != null)) {
    overlays.push({
      labelPath,
      labelChannel,
      values: labelValue == null ? undefined : [labelValue],
      mode: "outline",
      opacity: 1,
      outlineWidth: 2
    });
  }
  return {
    evidenceIds: evidenceIds(raw.evidence_ids),
    storeUuid: raw.store_uuid.toLowerCase(),
    field,
    targetKind: raw.target_kind,
    sizeX,
    sizeY,
    sizeZ,
    sizeT,
    bbox,
    centroid,
    sourceChannels,
    labelPath,
    labelChannel,
    labelValue,
    overlays,
    t,
    z,
    roi,
    croppedField,
    title: typeof raw.title === "string" && raw.title.trim()
      ? raw.title.trim().slice(0, 180)
      : `${field} ${raw.target_kind} preview`
  };
}

export function zarrRecipeFromToolArgs(value: unknown): {
  recipe: ZarrRenderRecipe;
  evidenceIds: string[];
} {
  const raw = object(value, "Zarr gallery");
  if (typeof raw.store_uuid !== "string" || !UUID.test(raw.store_uuid)) {
    throw new Error("store_uuid must be a canonical UUID from the measurement database");
  }
  if (!Array.isArray(raw.panels) || raw.panels.length < 2 || raw.panels.length > 25) {
    throw new Error("A gallery requires 2 through 25 panels");
  }
  const panels = raw.panels.map((value: unknown, panelIndex: number) => {
    const panel = object(value, `gallery panel ${panelIndex + 1}`);
    if (!Array.isArray(panel.roi) || panel.roi.length !== 4) {
      throw new Error(`gallery panel ${panelIndex + 1} roi must contain x0,y0,x1,y1`);
    }
    const roi = panel.roi.map((item, index) =>
      integer(item, `gallery panel ${panelIndex + 1} roi[${index}]`)
    ) as [number, number, number, number];
    if (roi[0] >= roi[2] || roi[1] >= roi[3] ||
        roi[2] - roi[0] > 2048 || roi[3] - roi[1] > 2048) {
      throw new Error(`gallery panel ${panelIndex + 1} roi is empty or exceeds 2048×2048`);
    }
    const sourceChannels = Array.from(new Set(
      (Array.isArray(panel.source_channels) ? panel.source_channels : [])
        .map((item, index) => integer(item, `source_channels[${index}]`, 1))
    ));
    if (sourceChannels.length > 4) throw new Error("At most four source channels may be rendered");
    const overlays = (Array.isArray(panel.overlays) ? panel.overlays : []).map(zarrOverlay);
    if (overlays.length > 8) throw new Error("At most eight overlays may be rendered");
    return {
      field: safePath(panel.field, `gallery panel ${panelIndex + 1} field`),
      roi,
      sourceChannels,
      t: panel.t == null ? 0 : integer(panel.t, "t"),
      z: panel.z == null ? 0 : integer(panel.z, "z"),
      title: typeof panel.title === "string"
        ? panel.title.trim().slice(0, 160)
        : `Panel ${panelIndex + 1}`,
      caption: typeof panel.caption === "string"
        ? panel.caption.trim().slice(0, 320)
        : undefined,
      overlays,
      scaleBar: true
    };
  });
  const columns = raw.columns == null ? undefined : integer(raw.columns, "columns", 1);
  if (columns != null && columns > 5) throw new Error("columns must be at most 5");
  return {
    evidenceIds: evidenceIds(raw.evidence_ids),
    recipe: {
      storeUuid: raw.store_uuid.toLowerCase(),
      title: typeof raw.title === "string" ? raw.title.trim().slice(0, 200) : undefined,
      filename: typeof raw.filename === "string" ? raw.filename.trim().slice(0, 100) : undefined,
      layout: columns == null ? undefined : { columns },
      panels
    }
  };
}

export function zarrCandidates(
  context: OmeroContext | null,
  hierarchy: OmeroHierarchy | null
): HierarchyItem[] {
  if (!context) return [];
  const selected = (context.selected_objects || []).filter(
    (item) => item.supported && (item.type === "Image" || item.type === "Plate")
  );
  if (selected.length > 1) return selected;
  const current = hierarchy?.current || {
    type: context.object_type,
    id: context.object_id,
    name: context.name,
    supported: true
  };
  if (current.type === "Image" || current.type === "Plate") return [current];
  const wanted = current.type === "Screen" ? "Plate" : current.type === "Dataset" ? "Image" : "";
  if (!wanted) return [];
  return (hierarchy?.children || []).filter(
    (item) => item.supported && item.type === wanted
  );
}

function route(template: string, id: number): string {
  return template.replace("/0/", `/${id}/`);
}

async function readJson(response: Response): Promise<any> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error?.message || `${response.status} ${response.statusText}`);
  }
  return body;
}

export async function fetchZarrCapability(
  status: ZarrViewerIntegrationStatus,
  candidate: Pick<HierarchyItem, "type" | "id">
): Promise<ZarrViewerCapability> {
  if (!status.available) throw new Error(`ZarrViewer is unavailable: ${status.reason}`);
  const template = candidate.type === "Plate"
    ? status.plate_capabilities_template
    : candidate.type === "Image"
      ? status.image_capabilities_template
      : undefined;
  if (!template) throw new Error(`ZarrViewer cannot bind an OMERO ${candidate.type}`);
  const response = await fetch(route(template, candidate.id), { credentials: "same-origin" });
  return zarrViewerCapabilityFrom(await readJson(response));
}

function validFieldPaths(capability: ZarrViewerCapability): Set<string> {
  return new Set([
    capability.initial_path,
    ...(capability.plate?.wells.flatMap((well) => well.fields.map((field) => field.path)) || [])
  ]);
}

function validateAgainstCapability(
  capability: ZarrViewerCapability,
  focus: ZarrFocusTarget
): void {
  if (capability.store.uuid.toLowerCase() !== focus.storeUuid) {
    throw new Error("The measurement database belongs to a different OME-Zarr store");
  }
  if (!validFieldPaths(capability).has(focus.field)) {
    throw new Error(`Field ${focus.field} is not available in the matched OME-Zarr store`);
  }
  const availableChannels = new Set(capability.channels.map((channel) => channel.index + 1));
  if (focus.sourceChannels.some((channel) => !availableChannels.has(channel))) {
    throw new Error("A requested source channel is not available in ZarrViewer");
  }
  if (focus.labelChannel != null && !availableChannels.has(focus.labelChannel)) {
    throw new Error("The requested label channel is not available in ZarrViewer");
  }
  if (focus.labelPath) {
    const requestedName = focus.labelPath.split("/").at(-1);
    const available = capability.labels.some(
      (label) => label.path === focus.labelPath || label.path.split("/").at(-1) === requestedName
    );
    if (!available) throw new Error("The requested label path is not available in ZarrViewer");
  }
  for (const overlay of focus.overlays) {
    if (overlay.labelChannel != null && !availableChannels.has(overlay.labelChannel)) {
      throw new Error("A requested overlay label channel is not available in ZarrViewer");
    }
    if (overlay.labelPath) {
      const requestedName = overlay.labelPath.split("/").at(-1);
      const available = capability.labels.some(
        (label) => label.path === overlay.labelPath || label.path.split("/").at(-1) === requestedName
      );
      if (!available) throw new Error("A requested overlay label path is not available in ZarrViewer");
    }
  }
}

export function validateRecipeAgainstCapability(
  capability: ZarrViewerCapability,
  recipe: ZarrRenderRecipe
): void {
  if (capability.store.uuid !== recipe.storeUuid) {
    throw new Error("The measurement database belongs to a different OME-Zarr store");
  }
  const fields = validFieldPaths(capability);
  const channels = new Set(capability.channels.map((channel) => channel.index + 1));
  for (const panel of recipe.panels) {
    if (!fields.has(panel.field)) throw new Error(`Field ${panel.field} is unavailable`);
    if (panel.sourceChannels.some((channel) => !channels.has(channel))) {
      throw new Error("A gallery source channel is unavailable");
    }
    for (const overlay of panel.overlays) {
      if (overlay.labelChannel != null && !channels.has(overlay.labelChannel)) {
        throw new Error("A gallery label channel is unavailable");
      }
      if (overlay.labelPath) {
        const name = overlay.labelPath.split("/").at(-1);
        if (!capability.labels.some(
          (label) => label.path === overlay.labelPath || label.path.split("/").at(-1) === name
        )) throw new Error("A gallery label path is unavailable");
      }
    }
  }
}

function appendFocus(url: URL, focus: ZarrFocusTarget): URL {
  url.searchParams.set("v", "2");
  url.searchParams.set("field", focus.field);
  url.searchParams.set("roi", focus.roi.join(","));
  url.searchParams.set("t", String(focus.t));
  url.searchParams.set("z", String(focus.z));
  url.searchParams.set("storeUuid", focus.storeUuid);
  if (focus.sourceChannels.length) {
    url.searchParams.set("sourceChannels", focus.sourceChannels.join(","));
  }
  if (focus.labelPath) url.searchParams.set("labelPath", focus.labelPath);
  if (focus.labelChannel != null) {
    url.searchParams.set("labelChannel", String(focus.labelChannel));
  }
  if (focus.labelValue != null) {
    url.searchParams.set("labelValue", String(focus.labelValue));
  }
  if (focus.overlays.length) {
    url.searchParams.set("overlays", JSON.stringify(focus.overlays));
  }
  return url;
}

export function zarrViewerUrl(
  status: ZarrViewerIntegrationStatus,
  capability: ZarrViewerCapability,
  focus: ZarrFocusTarget
): string {
  validateAgainstCapability(capability, focus);
  if (!status.viewer_url) throw new Error("ZarrViewer has no viewer route");
  const url = new URL(status.viewer_url, window.location.href);
  url.searchParams.set("image", String(capability.image.id));
  return appendFocus(url, focus).toString();
}

export async function renderZarrPreview(
  capability: ZarrViewerCapability,
  focus: ZarrFocusTarget
): Promise<ArrayBuffer> {
  validateAgainstCapability(capability, focus);
  const recipe: ZarrRenderRecipe = {
    storeUuid: focus.storeUuid,
    filename: `${focus.title}.png`,
    panels: [{
      field: focus.field,
      roi: focus.roi,
      sourceChannels: focus.sourceChannels,
      t: focus.t,
      z: focus.z,
      title: focus.title,
      overlays: focus.overlays,
      scaleBar: true
    }]
  };
  return renderZarrRecipe(capability, recipe);
}

export async function renderZarrRecipe(
  capability: ZarrViewerCapability,
  recipe: ZarrRenderRecipe
): Promise<ArrayBuffer> {
  validateRecipeAgainstCapability(capability, recipe);
  const response = await fetch(
    new URL(capability.store.render_url, window.location.href),
    {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/)?.[1] || ""
      },
      body: JSON.stringify(recipe)
    }
  );
  if (!response.ok) throw new Error(await response.text() || `${response.status} ${response.statusText}`);
  const contentType = (response.headers.get("content-type") || "").split(";", 1)[0].toLowerCase();
  if (contentType !== "image/png") throw new Error("ZarrViewer did not return a PNG preview");
  const declared = Number(response.headers.get("content-length") || 0);
  if (declared > MAX_RENDERED_PNG) throw new Error("ZarrViewer preview exceeds 32 MiB");
  const data = await response.arrayBuffer();
  if (data.byteLength > MAX_RENDERED_PNG) throw new Error("ZarrViewer preview exceeds 32 MiB");
  return data;
}

export function zarrBinding(
  capability: ZarrViewerCapability,
  candidate: Pick<HierarchyItem, "type" | "id">,
  groupId: number,
  viewerVersion: string
): ZarrBinding {
  if (candidate.type !== "Image" && candidate.type !== "Plate") {
    throw new Error("A Zarr binding requires an OMERO Image or Plate");
  }
  return {
    storeUuid: capability.store.uuid,
    objectType: candidate.type,
    objectId: candidate.id,
    groupId,
    capabilityImageId: capability.image.id,
    viewerVersion,
    validatedAt: new Date().toISOString(),
    verified: true
  };
}

export function zarrProvenance(
  binding: ZarrBinding,
  focus: ZarrFocusTarget,
  viewerUrl: string
): ZarrViewerProvenance {
  return {
    application: "biomero-zarr-viewer",
    viewerVersion: binding.viewerVersion,
    storeUuid: binding.storeUuid,
    objectType: binding.objectType,
    objectId: binding.objectId,
    capabilityImageId: binding.capabilityImageId,
    field: focus.field,
    roi: focus.roi,
    sourceChannels: focus.sourceChannels,
    labelPath: focus.labelPath,
    labelChannel: focus.labelChannel,
    labelValue: focus.labelValue,
    overlays: focus.overlays,
    evidenceIds: focus.evidenceIds,
    renderRecipe: {
      storeUuid: focus.storeUuid,
      panels: [{
        field: focus.field,
        roi: focus.roi,
        sourceChannels: focus.sourceChannels,
        t: focus.t,
        z: focus.z,
        title: focus.title,
        overlays: focus.overlays
      }]
    },
    renderKind: "roi",
    t: focus.t,
    z: focus.z,
    viewerUrl,
    croppedField: focus.croppedField
  };
}

export function zarrGalleryProvenance(
  binding: ZarrBinding,
  recipe: ZarrRenderRecipe,
  evidence: string[]
): ZarrViewerProvenance {
  const first = recipe.panels[0];
  return {
    application: "biomero-zarr-viewer",
    viewerVersion: binding.viewerVersion,
    storeUuid: binding.storeUuid,
    objectType: binding.objectType,
    objectId: binding.objectId,
    capabilityImageId: binding.capabilityImageId,
    field: first.field,
    roi: first.roi,
    sourceChannels: first.sourceChannels,
    overlays: first.overlays,
    evidenceIds: evidence,
    renderRecipe: recipe,
    renderKind: "gallery",
    t: first.t,
    z: first.z,
    viewerUrl: "",
    croppedField: false
  };
}
