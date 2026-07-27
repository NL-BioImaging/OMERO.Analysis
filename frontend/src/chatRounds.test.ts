import {
  chatRoundPolicy,
  FINAL_SYNTHESIS_INSTRUCTION,
  MAX_TOOL_ROUNDS
} from "./chatRounds";

describe("chat round policy", () => {
  const tools = [{ type: "function", function: { name: "inspect" } }];

  it("allows tools for all eight bounded tool rounds", () => {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
      expect(chatRoundPolicy(round, tools)).toEqual({
        finalSynthesis: false,
        tools
      });
    }
  });

  it("forces a tool-free final synthesis after the eighth tool round", () => {
    expect(chatRoundPolicy(MAX_TOOL_ROUNDS, tools)).toEqual({
      finalSynthesis: true,
      tools: []
    });
    expect(FINAL_SYNTHESIS_INSTRUCTION).toContain("Do not call more tools");
  });
});
