// Provider
export interface AssembleurContextType {
  assembleur: AssembleurType;
  setAssembleur: React.Dispatch<React.SetStateAction<AssembleurType>>;
}
export interface AssembleurType {
  programCounter: number;
  registers: RegistersType;
  memories: MemoriesType;
  screenNumber: ScreenNumberType;
  screenNumberIsSigned: boolean;
  screenTextBuffer: ScreenTextType;
  screenText: ScreenTextType;
  screenPixelX: number;
  screenPixelY: number;
  screenPixelsBuffer: ScreenPixelsType;
  screenPixels: ScreenPixelsType;
  code: string;
  flags: {
    carry: boolean;
    zero: boolean;
  };
  instructionsPerSecond: number;
  stepLimit: number;
  error: string | null;
  isRunning: boolean;
  randomCache: RandomCacheType;
  codeHash: string;
  controllerInput: number;
}

// Argument types
export type ArgumentType =
  | "register"
  | "immediate"
  | "label"
  | "alias"
  | "condition"
  | "unknown";

// Data structures
export type RegistersType = number[];
export type MemoriesType = number[];

// Instructions
export type InstructionsType = string[][];
export type InstructionType = string[];

// References
export type LabelsType = Record<string, number>;
export type AliasesType = Record<string, string>;
export type AddressesStackType = number[];

// Interfaces
export type ScreenNumberType = number;
export type ScreenTextType = string[];
export type ScreenPixelsType = boolean[];

// Random cache
export type RandomCacheType = Map<number, number>;
