// Env
import { NB_DATA_MEMORY } from "../vite-env.d";

// Types
import type { MemoriesType } from "src/types/assembleur";

// Normalize memory value with modulo 256
const normalizeValue = (value: number): number => {
  return ((value % 256) + 256) % 256;
};

// Getter
export const getMemoryValue = (
  address: number,
  memories: MemoriesType
): number => {
  // Validate memory address
  if (address < 0 || address >= NB_DATA_MEMORY) {
    throw new Error(
      `Memory address out of bounds: ${String(
        address
      )} (valid range: 0-${String(NB_DATA_MEMORY - 1)})`
    );
  }

  return memories[address];
};

// Setter (with validation and normalization)
export const setMemoryValue = (
  address: number,
  value: number,
  memories: MemoriesType
): void => {
  // Validate memory address
  if (address < 0 || address >= NB_DATA_MEMORY) {
    throw new Error(
      `Memory address out of bounds: ${String(
        address
      )} (valid range: 0-${String(NB_DATA_MEMORY - 1)})`
    );
  }

  // Normalize value to 0-255
  const normalizedValue = normalizeValue(value);

  memories[address] = normalizedValue;
};
