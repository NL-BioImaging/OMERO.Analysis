import {
  artifactEvidenceGap,
  chatRoundPolicy,
  FINAL_SYNTHESIS_INSTRUCTION,
  generatedArtifactNames,
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

describe("generated artifact evidence", () => {
  it("recognizes English and Dutch artifact-creation requests", () => {
    expect(artifactEvidenceGap(
      "kan je een plot maken van het aantal cellen per well in een bar grafiek",
      "Opgeslagen als cell_count_per_well_bar.png en cell_count_per_well_bar.csv.",
      [],
      []
    )).toEqual({
      noCurrentOutput: true,
      missingOutputNames: ["cell_count_per_well_bar.png", "cell_count_per_well_bar.csv"]
    });
    expect(artifactEvidenceGap("as heatmap", "Done", [], [])).toEqual({
      noCurrentOutput: true,
      missingOutputNames: []
    });
  });

  it("accepts only a current generated artifact with no missing filename claims", () => {
    expect(artifactEvidenceGap(
      "Create a bar chart",
      "Created current.png using prior.csv.",
      ["current.png"],
      ["current.png", "prior.csv"]
    )).toBeNull();
    expect(artifactEvidenceGap(
      "Create a bar chart",
      "Created missing.png.",
      ["current.png"],
      ["current.png"]
    )).toEqual({
      noCurrentOutput: false,
      missingOutputNames: ["missing.png"]
    });
  });

  it("does not require execution for an explanatory question", () => {
    expect(artifactEvidenceGap(
      "What does the existing heatmap mean?",
      "It shows counts per well.",
      [],
      []
    )).toBeNull();
    expect(generatedArtifactNames("Use /output/a.png and `b.csv`."))
      .toEqual(["a.png", "b.csv"]);
  });
});
