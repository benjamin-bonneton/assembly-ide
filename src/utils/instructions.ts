// Types
import type { InstructionType } from "src/types/assembleur";
import type { functions } from "src/types/functions";

export const getInstructionFunction = (instruction: InstructionType) => {
  if (instruction.length === 0) return null;

  return instruction[0] as keyof typeof functions;
};
