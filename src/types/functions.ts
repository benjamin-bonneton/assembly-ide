import type { ArgumentType } from "./assembleur";
import type { categories } from "./categories";

export interface FunctionType {
  category: keyof typeof categories;
  description: string;
  usage: string;
  args: ArgumentType[][];
  options: ArgumentType[][];
}

export const functions = {
  NOP: {
    category: "execution",
    description: "Do nothing",
    usage: "NOP",
    args: [],
    options: [],
  },
  HLT: {
    category: "execution",
    description: "Stop the program",
    usage: "HLT",
    args: [],
    options: [],
  },
  ADD: {
    category: "operations",
    description: "Add rA and rB, store in rC",
    usage: "ADD <rA> <rB> <rC>",
    args: [["register"], ["register"], ["register"]],
    options: [],
  },
  SUB: {
    category: "operations",
    description: "Subtract rB from rA, store in rC",
    usage: "SUB <rA> <rB> <rC>",
    args: [["register"], ["register"], ["register"]],
    options: [],
  },
  NOR: {
    category: "operations",
    description: "Bitwise NOR of rA and rB, store in rC",
    usage: "NOR <rA> <rB> <rC>",
    args: [["register"], ["register"], ["register"]],
    options: [],
  },
  AND: {
    category: "operations",
    description: "Bitwise AND of rA and rB, store in rC",
    usage: "AND <rA> <rB> <rC>",
    args: [["register"], ["register"], ["register"]],
    options: [],
  },
  XOR: {
    category: "operations",
    description: "Bitwise XOR of rA and rB, store in rC",
    usage: "XOR <rA> <rB> <rC>",
    args: [["register"], ["register"], ["register"]],
    options: [],
  },
  RSH: {
    category: "operations",
    description: "Right shift rA, store in rB",
    usage: "RSH <rA> <rB>",
    args: [["register"], ["register"]],
    options: [],
  },
  CMP: {
    category: "operations",
    description: "Compare rB to rA, and set flags",
    usage: "CMP <rA> <rB>",
    args: [["register"], ["register"]],
    options: [],
  },
  MOV: {
    category: "operations",
    description: "Move rA to rB",
    usage: "MOV <rA> <rB>",
    args: [["register"], ["register"]],
    options: [],
  },
  LSH: {
    category: "operations",
    description: "Left shift rA, store in rB",
    usage: "LSH <rA> <rB>",
    args: [["register"], ["register"]],
    options: [],
  },
  INC: {
    category: "operations",
    description: "Increment rA by 1",
    usage: "INC <rA>",
    args: [["register"]],
    options: [],
  },
  DEC: {
    category: "operations",
    description: "Decrement rA by 1",
    usage: "DEC <rA>",
    args: [["register"]],
    options: [],
  },
  NOT: {
    category: "operations",
    description: "Bitwise NOT of rA, store in rB",
    usage: "NOT <rA> <rB>",
    args: [["register"], ["register"]],
    options: [],
  },
  NEG: {
    category: "operations",
    description: "Negate rA, store in rB",
    usage: "NEG <rA> <rB>",
    args: [["register"], ["register"]],
    options: [],
  },
  LDI: {
    category: "memory",
    description: "Load immediate value into rA",
    usage: "LDI <rA> <value>",
    args: [["register"], ["immediate"]],
    options: [],
  },
  ADI: {
    category: "memory",
    description: "Add immediate value to rA, store in rA",
    usage: "ADI <rA> <value>",
    args: [["register"], ["immediate"]],
    options: [],
  },
  JMP: {
    category: "control",
    description: "Jump to address",
    usage: "JMP <address>",
    args: [["label", "immediate"]],
    options: [],
  },
  BRH: {
    category: "control",
    description: "Branch to address if condition is true",
    usage: "BRH <cond> <address>",
    args: [["condition"], ["label", "immediate"]],
    options: [],
  },
  CAL: {
    category: "control",
    description: "Save current address and jump to subroutine",
    usage: "CAL <address>",
    args: [["label", "immediate"]],
    options: [],
  },
  RET: {
    category: "control",
    description: "Return to first saved address",
    usage: "RET",
    args: [],
    options: [],
  },
  LOD: {
    category: "storage",
    description: "Load memory rA + offset into rB",
    usage: "LOD <rA> <rB> [offset]",
    args: [["register"], ["register"]],
    options: [["immediate"]],
  },
  STR: {
    category: "storage",
    description: "Store rB into memory rA + offset",
    usage: "STR <rA> <rB> [offset]",
    args: [["register"], ["register"]],
    options: [["immediate"]],
  },
  DEFINE: {
    category: "define",
    description: "Define a name for a value",
    usage: "define <name> <value>",
    args: [["alias"], ["immediate", "alias", "register"]],
    options: [],
  },
};
