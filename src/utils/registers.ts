// Env
import { NB_REGISTERS } from "../vite-env.d";

// Types
import type { RegistersType } from "src/types/assembleur";

// Check
export const isRegister = (instructionItem: string) => {
  return /^r[0-9]+$/.test(instructionItem);
};

// Getter
export const getRegisterValue = (
  register: string,
  registers: RegistersType
): number => {
  const registerIndex = parseInt(register.slice(1), 10);

  // Validate register index
  if (registerIndex < 0 || registerIndex >= NB_REGISTERS) {
    throw new Error(
      `Register index out of bounds: r${String(
        registerIndex
      )} (valid range: r0-r${String(NB_REGISTERS - 1)})`
    );
  }

  return registers[registerIndex];
};

// Setter (with validation)
export const setRegisterValue = (
  register: string,
  value: number,
  registers: RegistersType
): void => {
  const registerIndex = parseInt(register.slice(1), 10);

  // Validate register index
  if (registerIndex < 0 || registerIndex >= NB_REGISTERS) {
    throw new Error(
      `Register index out of bounds: r${String(
        registerIndex
      )} (valid range: r0-r${String(NB_REGISTERS - 1)})`
    );
  }

  // Apply modulo 256 to keep value in range 0-255 (handle negative numbers)
  const normalizedValue = ((value % 256) + 256) % 256;

  // r0 is read-only and always 0
  if (registerIndex === 0) {
    return;
  }

  registers[registerIndex] = normalizedValue;
};
