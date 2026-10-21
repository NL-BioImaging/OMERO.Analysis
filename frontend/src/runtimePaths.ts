/** The basename used inside browser Python; keep display/provenance names unchanged. */
export function runtimeInputName(name: string): string {
  return name.replace(/[^A-Za-z0-9._ -]/g, "_");
}
