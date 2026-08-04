export const MAX_TOOL_ROUNDS = 8;

export const FINAL_SYNTHESIS_INSTRUCTION =
  "The tool-round limit has been reached. Do not call more tools. " +
  "Give the best final answer using the results already available, and clearly state any remaining limitation.";

const GENERATED_ARTIFACT_EXTENSION = /\.(?:png|svg|csv|tsv|xlsx|parquet|json|html|pdf)\b/i;
const GENERATED_ARTIFACT_NAME = /(?:\/output\/)?([A-Za-z0-9][A-Za-z0-9._-]*\.(?:png|svg|csv|tsv|xlsx|parquet|json|html|pdf))\b/gi;

export interface ArtifactEvidenceGap {
  missingOutputNames: string[];
  noCurrentOutput: boolean;
}

export function requestsGeneratedArtifact(request: string): boolean {
  const artifact = /\b(?:plot|chart|figure|graph|heatmap|grafiek|diagram|csv|spreadsheet|table)\b/i;
  if (!artifact.test(request)) return false;
  return /\b(?:create|generate|make|draw|plot|export|save|maak|maken|genereer|teken|exporteer|opslaan)\b/i.test(request) ||
    /^\s*(?:please\s+)?plot\b/i.test(request) ||
    /\b(?:as|in)\s+(?:(?:a|an|een|the)\s+)?(?:bar\s+)?(?:plot|chart|figure|graph|heatmap|grafiek|diagram)\b/i.test(request);
}

export function generatedArtifactNames(text: string): string[] {
  return Array.from(
    new Set(Array.from(text.matchAll(GENERATED_ARTIFACT_NAME), (match) => match[1]))
  );
}

export function artifactEvidenceGap(
  request: string,
  response: string,
  currentOutputNames: readonly string[],
  availableOutputNames: readonly string[] = currentOutputNames
): ArtifactEvidenceGap | null {
  if (!requestsGeneratedArtifact(request)) return null;
  const currentArtifacts = currentOutputNames.filter((name) => GENERATED_ARTIFACT_EXTENSION.test(name));
  const available = new Set(availableOutputNames.map((name) => name.toLowerCase()));
  const missingOutputNames = generatedArtifactNames(response)
    .filter((name) => !available.has(name.toLowerCase()));
  if (currentArtifacts.length && !missingOutputNames.length) return null;
  return {
    missingOutputNames,
    noCurrentOutput: currentArtifacts.length === 0
  };
}

export interface ChatRoundPolicy {
  finalSynthesis: boolean;
  tools: readonly unknown[];
}

export function chatRoundPolicy(
  round: number,
  tools: readonly unknown[]
): ChatRoundPolicy {
  const finalSynthesis = round >= MAX_TOOL_ROUNDS;
  return {
    finalSynthesis,
    tools: finalSynthesis ? [] : tools
  };
}
