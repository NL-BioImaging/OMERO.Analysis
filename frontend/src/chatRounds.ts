export const MAX_TOOL_ROUNDS = 8;

export const FINAL_SYNTHESIS_INSTRUCTION =
  "The tool-round limit has been reached. Do not call more tools. " +
  "Give the best final answer using the results already available, and clearly state any remaining limitation.";

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
