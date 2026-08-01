export interface StorageCapacity {
  usage: number;
  quota: number;
}

export function capacityWarning(
  currentWorkspaceBytes: number,
  additionalBytes: number,
  storage: StorageCapacity,
  maxWorkspaceBytes: number
): string | null {
  if (additionalBytes < 0) return "The requested download size is invalid";
  if (currentWorkspaceBytes + additionalBytes > maxWorkspaceBytes) {
    return "The workspace would exceed the configured browser Workspace limit";
  }
  if (!storage.quota) return null;
  // IndexedDB implementations need room for transaction copies and metadata.
  const required = Math.ceil(additionalBytes * 1.1);
  const available = Math.max(0, storage.quota - storage.usage);
  if (required > available) {
    return `The browser has insufficient storage available (${available} bytes available; approximately ${required} bytes required)`;
  }
  return null;
}
