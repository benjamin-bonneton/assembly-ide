// Env
import { NB_REGISTERS } from "../vite-env.d";

// Utils
import { isLabel } from "./labels";
import { isRegister } from "./registers";

// Types
import { conditions } from "../types/conditions";
import {
  type AliasesType,
  type ArgumentType,
  type LabelsType,
} from "../types/assembleur";

export const getArgumentType = (arg: string): ArgumentType => {
  // Check if argument is a label
  if (isLabel(arg)) {
    return "label";
  }

  // Check if argument is a register
  if (isRegister(arg)) {
    return "register";
  }

  // Check if argument is a condition
  if (Object.keys(conditions).includes(arg)) {
    return "condition";
  }

  // Check if argument is a defined alias (start with a letter or _)
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(arg)) {
    return "alias";
  }

  // Check if argument is an immediate value
  if (!isNaN(parseInt(arg, 10))) {
    return "immediate";
  }

  return "unknown";
};

export const checkArgumentExistence = (
  arg: string,
  type: ArgumentType,
  labels: LabelsType,
  aliases: AliasesType
) => {
  switch (type) {
    case "label":
      return arg in labels;
    case "register":
      return Array.from(
        { length: NB_REGISTERS },
        (_, i) => `r${String(i)}`
      ).includes(arg);
    case "condition":
      return arg in conditions;
    case "alias":
      return arg in aliases;
    case "immediate":
      return true;
    case "unknown":
    default:
      return false;
  }
};
