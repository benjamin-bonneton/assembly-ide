/// <reference types="vite/client" />
export const NB_REGISTERS: number =
  (import.meta.env.VITE_NB_REGISTERS as number) || 16;
export const NB_DATA_MEMORY: number =
  (import.meta.env.VITE_NB_DATA_MEMORY as number) || 256;
export const NB_INSTRUCTION_MEMORY: number =
  (import.meta.env.VITE_NB_INSTRUCTION_MEMORY as number) || 2048;
export const MAX_DEPTH_CALL_STACK: number =
  (import.meta.env.VITE_MAX_DEPTH_CALL_STACK as number) || 16;
export const START_RESERVED_MEMORY: number =
  (import.meta.env.VITE_START_RESERVED_MEMORY as number) || 240;
export const VERSION: string =
  (import.meta.env.VITE_VERSION as string) || "Unknown";
