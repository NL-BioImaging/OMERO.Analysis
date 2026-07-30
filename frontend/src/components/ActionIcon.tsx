import {
  Add,
  Clean,
  Download,
  Duplicate,
  Edit,
  FloppyDisk,
  FlowBranch,
  Import,
  Manual,
  Paperclip,
  Play,
  Refresh,
  Reset,
  Stop,
  Trash,
  Upload,
  type SVGIconProps
} from "@blueprintjs/icons";
import type { ComponentType } from "react";

export type ActionIconName =
  | "add"
  | "attach"
  | "clear"
  | "copy"
  | "delete"
  | "download"
  | "edit"
  | "import"
  | "notebook"
  | "pipeline"
  | "reset"
  | "run"
  | "save"
  | "stop"
  | "sync"
  | "upload";

export function ActionIcon({ name }: { name: ActionIconName }) {
  const icons: Record<ActionIconName, ComponentType<SVGIconProps>> = {
    add: Add,
    attach: Paperclip,
    clear: Clean,
    copy: Duplicate,
    delete: Trash,
    download: Download,
    edit: Edit,
    import: Import,
    notebook: Manual,
    pipeline: FlowBranch,
    reset: Reset,
    run: Play,
    save: FloppyDisk,
    stop: Stop,
    sync: Refresh,
    upload: Upload,
  };
  const BlueprintIcon = icons[name];
  return (
    <BlueprintIcon
      aria-hidden="true"
      className={`ui-icon action-icon action-icon-${name}`}
      size={14}
    />
  );
}
