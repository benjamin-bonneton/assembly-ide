// Types
import type {
  AliasesType,
  InstructionsType,
  LabelsType,
} from "src/types/assembleur";

// Parse Function
export const parseCode = (code: string) => {
  // Split code into lines
  const lines = code.split("\n").map((line) => line.trim());

  // Split lines into instructions
  const instructions = new Array(lines.length) as InstructionsType;

  // Remove comments (// or ;) and split into instructions
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const regex = /^(.*?)(?:\s*(\/\/|;).*)?$/;
    const match = regex.exec(line);
    const codePart = match ? match[1].trim() : "";
    instructions[i] = codePart ? codePart.split(" ") : [""];
  }

  return instructions;
};

// Extract Labels and Aliases
export const extractLabelsAndAliases = (instructions: InstructionsType) => {
  const labels: LabelsType = {};
  const aliases: AliasesType = {};

  // Loop through instructions
  instructions.forEach((inst, index) => {
    // Extract Labels
    if (inst[0].startsWith(".")) {
      labels[inst[0]] = index;
    }

    // Extract Aliases
    else if (inst.length == 3 && inst[0].startsWith("DEFINE")) {
      const varName = inst[1];
      const varValue = inst[2];
      aliases[varName] = varValue;
    }
  });

  return { labels, aliases };
};
