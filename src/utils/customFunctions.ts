// Env
import { MAX_DEPTH_CALL_STACK } from '../vite-env.d';

// Utils
import { getRegisterValue, setRegisterValue } from './registers';
import { getMemoryValue, setMemoryValue } from './memory';
import { isConditionValid } from './customConditions';

// Types
import type {
  AddressesStackType,
  AssembleurType,
  MemoriesType,
  RandomCacheType,
  RegistersType,
  ScreenNumberType,
  ScreenPixelsType,
  ScreenTextType,
} from 'src/types/assembleur';
import type { conditions } from 'src/types/conditions';
import type { functions } from 'src/types/functions';

// Functions handlers
export function functionHandler(
  functionName: keyof typeof functions,
  args: string[],
  newAssembleur: AssembleurType,
  addressesStack: AddressesStackType
): {
  newAssembleur: AssembleurType;
  addressesStack: AddressesStackType;
  endProgram: boolean;
} {
  switch (functionName) {
    // Execution
    case 'NOP':
      return { newAssembleur, addressesStack, endProgram: false };
    case 'HLT':
      return { newAssembleur, addressesStack, endProgram: true };
    // Operations
    case 'ADD':
      newAssembleur.registers = ADD(
        args[0],
        args[1],
        args[2],
        newAssembleur.registers
      );

      newAssembleur.flags = CMP(args[0], args[1], newAssembleur.registers);

      return { newAssembleur, addressesStack, endProgram: false };
    case 'SUB':
      newAssembleur.registers = SUB(
        args[0],
        args[1],
        args[2],
        newAssembleur.registers
      );

      newAssembleur.flags = CMP(args[0], args[1], newAssembleur.registers);

      return { newAssembleur, addressesStack, endProgram: false };
    case 'NOR':
      newAssembleur.registers = NOR(
        args[0],
        args[1],
        args[2],
        newAssembleur.registers
      );

      newAssembleur.flags = CMP(args[0], args[1], newAssembleur.registers);

      return { newAssembleur, addressesStack, endProgram: false };
    case 'AND':
      newAssembleur.registers = AND(
        args[0],
        args[1],
        args[2],
        newAssembleur.registers
      );

      newAssembleur.flags = CMP(args[0], args[1], newAssembleur.registers);

      return { newAssembleur, addressesStack, endProgram: false };
    case 'XOR':
      newAssembleur.registers = XOR(
        args[0],
        args[1],
        args[2],
        newAssembleur.registers
      );

      newAssembleur.flags = CMP(args[0], args[1], newAssembleur.registers);

      return { newAssembleur, addressesStack, endProgram: false };
    case 'RSH':
      newAssembleur.registers = RSH(args[0], args[1], newAssembleur.registers);

      newAssembleur.flags = CMP(args[0], args[1], newAssembleur.registers);

      return { newAssembleur, addressesStack, endProgram: false };
    case 'CMP':
      newAssembleur.flags = CMP(args[0], args[1], newAssembleur.registers);
      return { newAssembleur, addressesStack, endProgram: false };
    case 'MOV':
      newAssembleur.registers = MOV(args[0], args[1], newAssembleur.registers);
      return { newAssembleur, addressesStack, endProgram: false };
    case 'LSH':
      newAssembleur.registers = LSH(args[0], args[1], newAssembleur.registers);
      return { newAssembleur, addressesStack, endProgram: false };
    case 'INC':
      newAssembleur.registers = INC(args[0], newAssembleur.registers);
      return { newAssembleur, addressesStack, endProgram: false };
    case 'DEC':
      newAssembleur.registers = DEC(args[0], newAssembleur.registers);
      return { newAssembleur, addressesStack, endProgram: false };
    case 'NOT':
      newAssembleur.registers = NOT(args[0], args[1], newAssembleur.registers);
      return { newAssembleur, addressesStack, endProgram: false };
    case 'NEG':
      newAssembleur.registers = NEG(args[0], args[1], newAssembleur.registers);
      return { newAssembleur, addressesStack, endProgram: false };
    // Memory
    case 'LDI':
      newAssembleur.registers = LDI(args[0], args[1], newAssembleur.registers);
      return { newAssembleur, addressesStack, endProgram: false };
    case 'ADI':
      newAssembleur.registers = ADI(args[0], args[1], newAssembleur.registers);

      newAssembleur.flags = CMP(args[0], args[1], newAssembleur.registers);

      return { newAssembleur, addressesStack, endProgram: false };
    // Control
    case 'JMP':
      newAssembleur.programCounter = JMP(Number(args[0]));
      return { newAssembleur, addressesStack, endProgram: false };
    case 'BRH':
      newAssembleur.programCounter = BRH(
        args[0] as keyof typeof conditions,
        newAssembleur.flags,
        newAssembleur.programCounter,
        Number(args[1])
      );
      return { newAssembleur, addressesStack, endProgram: false };
    case 'CAL': {
      const result = CAL(
        addressesStack,
        newAssembleur.programCounter,
        Number(args[0])
      );
      newAssembleur.programCounter = result.nextAddress;
      return {
        newAssembleur,
        addressesStack: result.addressesStack,
        endProgram: false,
      };
    }
    case 'RET':
      newAssembleur.programCounter = RET(addressesStack);
      return { newAssembleur, addressesStack, endProgram: false };
    // Storage
    case 'LOD': {
      const result = LOD(
        args[0],
        args[1],
        args[2] || null,
        newAssembleur.registers,
        newAssembleur.memories,
        newAssembleur.screenPixelX,
        newAssembleur.screenPixelY,
        newAssembleur.screenPixelsBuffer,
        newAssembleur.randomCache,
        newAssembleur.programCounter,
        newAssembleur.controllerInput
      );

      newAssembleur.registers = result.registers;
      newAssembleur.randomCache = result.randomCache;
      return { newAssembleur, addressesStack, endProgram: false };
    }
    case 'STR': {
      const result = STR(
        args[0],
        args[1],
        args[2] || null,
        newAssembleur.registers,
        newAssembleur.memories,
        newAssembleur.screenNumber,
        newAssembleur.screenNumberIsSigned,
        newAssembleur.screenTextBuffer,
        newAssembleur.screenText,
        newAssembleur.screenPixelX,
        newAssembleur.screenPixelY,
        newAssembleur.screenPixelsBuffer,
        newAssembleur.screenPixels
      );

      newAssembleur.memories = result.memories;
      newAssembleur.screenNumber = result.screenNumber;
      newAssembleur.screenNumberIsSigned = result.screenNumberIsSigned;
      newAssembleur.screenTextBuffer = result.screenTextBuffer;
      newAssembleur.screenText = result.screenText;
      newAssembleur.screenPixelX = result.screenPixelX;
      newAssembleur.screenPixelY = result.screenPixelY;
      newAssembleur.screenPixelsBuffer = result.screenPixelsBuffer;
      newAssembleur.screenPixels = result.screenPixels;

      return { newAssembleur, addressesStack, endProgram: false };
    }
    default:
      return { newAssembleur, addressesStack, endProgram: false };
  }
}

// Operations
function ADD(
  rA: string,
  rB: string,
  rC: string,
  registers: RegistersType
): RegistersType {
  // Get values
  const valA = getRegisterValue(rA, registers);
  const valB = getRegisterValue(rB, registers);

  // Perform operation
  const result = valA + valB;

  // Store result
  setRegisterValue(rC, result, registers);

  return registers;
}

function SUB(
  rA: string,
  rB: string,
  rC: string,
  registers: RegistersType
): RegistersType {
  // Get values
  const valA = getRegisterValue(rA, registers);
  const valB = getRegisterValue(rB, registers);

  // Perform operation
  const result = valA - valB;

  // Store result
  setRegisterValue(rC, result, registers);

  return registers;
}

function NOR(
  rA: string,
  rB: string,
  rC: string,
  registers: RegistersType
): RegistersType {
  // Get values
  const valA = getRegisterValue(rA, registers);
  const valB = getRegisterValue(rB, registers);

  // Perform operation
  const result = ~(valA | valB);

  // Store result
  setRegisterValue(rC, result, registers);

  return registers;
}

function AND(
  rA: string,
  rB: string,
  rC: string,
  registers: RegistersType
): RegistersType {
  // Get values
  const valA = getRegisterValue(rA, registers);
  const valB = getRegisterValue(rB, registers);

  // Perform operation
  const result = valA & valB;

  // Store result
  setRegisterValue(rC, result, registers);

  return registers;
}

function XOR(
  rA: string,
  rB: string,
  rC: string,
  registers: RegistersType
): RegistersType {
  // Get values
  const valA = getRegisterValue(rA, registers);
  const valB = getRegisterValue(rB, registers);

  // Perform operation
  const result = valA ^ valB;

  // Store result
  setRegisterValue(rC, result, registers);

  return registers;
}

function RSH(rA: string, rB: string, registers: RegistersType): RegistersType {
  // Get value
  const valA = getRegisterValue(rA, registers);

  // Perform operation
  const result = valA >>> 1;

  // Store result
  setRegisterValue(rB, result, registers);

  return registers;
}

function CMP(
  rA: string,
  rB: string,
  registers: RegistersType
): AssembleurType['flags'] {
  // Get values
  const valA = getRegisterValue(rA, registers);
  const valB = getRegisterValue(rB, registers);

  // Perform comparison
  const carry = valA < valB;
  const zero = valA === valB;

  return { carry, zero };
}

function MOV(rA: string, rB: string, registers: RegistersType): RegistersType {
  // Get value
  const valA = getRegisterValue(rA, registers);

  // Store value
  setRegisterValue(rB, valA, registers);

  return registers;
}

function LSH(rA: string, rB: string, registers: RegistersType): RegistersType {
  // Get value
  const valA = getRegisterValue(rA, registers);

  // Perform operation
  const result = valA << 1;

  // Store result
  setRegisterValue(rB, result, registers);

  return registers;
}

function INC(rA: string, registers: RegistersType): RegistersType {
  // Get value
  const valA = getRegisterValue(rA, registers);

  // Perform operation
  const result = valA + 1;

  // Store result
  setRegisterValue(rA, result, registers);

  return registers;
}

function DEC(rA: string, registers: RegistersType): RegistersType {
  // Get value
  const valA = getRegisterValue(rA, registers);

  // Perform operation
  const result = valA - 1;

  // Store result
  setRegisterValue(rA, result, registers);

  return registers;
}

function NOT(rA: string, rB: string, registers: RegistersType): RegistersType {
  // Get value
  const valA = getRegisterValue(rA, registers);

  // Perform operation
  const result = ~valA;

  // Store result
  setRegisterValue(rB, result, registers);

  return registers;
}

function NEG(rA: string, rB: string, registers: RegistersType): RegistersType {
  // Get value
  const valA = getRegisterValue(rA, registers);

  // Perform operation
  const result = -valA;

  // Store result
  setRegisterValue(rB, result, registers);

  return registers;
}

// Memory
function LDI(
  rA: string,
  immediate: string,
  registers: RegistersType
): RegistersType {
  // Parse immediate value
  const value = parseInt(immediate, 10);

  // Store value
  setRegisterValue(rA, value, registers);

  return registers;
}

function ADI(
  rA: string,
  immediate: string,
  registers: RegistersType
): RegistersType {
  // Get current value
  const valA = getRegisterValue(rA, registers);

  // Parse immediate value
  const value = parseInt(immediate, 10);

  // Perform operation
  const result = valA + value;

  // Store result
  setRegisterValue(rA, result, registers);

  return registers;
}

// Control
function JMP(nextAddress: number): number {
  return nextAddress;
}

function BRH(
  conditionName: keyof typeof conditions,
  flags: AssembleurType['flags'],
  currentAddress: number,
  calledAddress: number
): number {
  // Check condition and branch if true
  if (isConditionValid(conditionName, flags)) {
    return calledAddress;
  }

  // Continue to next instruction (will be incremented by the engine)
  return currentAddress;
}

function CAL(
  addressesStack: AddressesStackType,
  currentAddress: number,
  nextAddress: number
): { addressesStack: AddressesStackType; nextAddress: number } {
  // Check call stack depth limit
  if (addressesStack.length >= MAX_DEPTH_CALL_STACK) {
    throw new Error(
      `Call stack overflow: maximum depth of ${String(
        MAX_DEPTH_CALL_STACK
      )} reached`
    );
  }

  // Push current address onto stack
  addressesStack.push(currentAddress + 1);

  return { addressesStack, nextAddress };
}

function RET(addressesStack: AddressesStackType): number {
  const popped = addressesStack.pop();

  if (popped === undefined) {
    throw new Error('Return stack underflow');
  }

  return popped;
}

// Storage
function LOD(
  rA: string,
  rB: string,
  offset: string | null,
  registers: RegistersType,
  memories: MemoriesType,
  screenPixelX: number,
  screenPixelY: number,
  screenPixelsBuffer: ScreenPixelsType,
  randomCache: RandomCacheType,
  programCounter: number,
  controllerInput: number
): { registers: RegistersType; randomCache: RandomCacheType } {
  // Get base address
  const baseAddress = getRegisterValue(rA, registers);

  // Validate and parse offset
  let offsetValue = 0;
  if (offset !== null && offset !== '') {
    offsetValue = parseInt(offset, 10);
    if (isNaN(offsetValue)) {
      throw new Error(`Invalid offset: ${offset}`);
    }
    if (offsetValue < -8 || offsetValue > 7) {
      throw new Error(
        `Offset out of bounds: ${String(offsetValue)} (valid range: -8 to 7)`
      );
    }
  }

  // Calculate final address
  const finalAddress = baseAddress + offsetValue;

  // Handle case based on final address
  let value;
  switch (finalAddress) {
    // Screen Pixel Operations
    case 240:
    case 241:
    case 242:
    case 243:
    case 245:
    case 246:
      value = 0;
      break;
    case 244:
      value = getScreenPixelValue(
        screenPixelX,
        screenPixelY,
        screenPixelsBuffer
      );
      break;
    // Screen Text Operations
    case 247:
    case 248:
    case 249:
      value = 0;
      break;
    // Screen Number Operations
    case 250:
    case 251:
    case 252:
    case 253:
      value = 0;
      break;
    // Random Operations
    case 254:
      // Check if we already have a cached value for this instruction
      if (randomCache.has(programCounter)) {
        value = randomCache.get(programCounter);

        if (value === undefined) {
          throw new Error('Unexpected error retrieving random cache value');
        }
      } else {
        // Generate new random value and cache it
        value = Math.floor(Math.random() * 256);
        randomCache.set(programCounter, value);
      }
      break;
    // Controller Operations
    case 255:
      value = controllerInput;
      break;
    // Load value from memory
    default:
      value = getMemoryValue(finalAddress, memories);
  }

  // Store value in register
  setRegisterValue(rB, value, registers);

  return { registers, randomCache };
}

function STR(
  rA: string,
  rB: string,
  offset: string | null,
  registers: RegistersType,
  memories: MemoriesType,
  screenNumber: ScreenNumberType,
  screenNumberIsSigned: boolean,
  screenTextBuffer: ScreenTextType,
  screenText: ScreenTextType,
  screenPixelX: number,
  screenPixelY: number,
  screenPixelsBuffer: ScreenPixelsType,
  screenPixels: ScreenPixelsType
): {
  memories: MemoriesType;
  screenNumber: ScreenNumberType;
  screenNumberIsSigned: boolean;
  screenTextBuffer: ScreenTextType;
  screenText: ScreenTextType;
  screenPixelX: number;
  screenPixelY: number;
  screenPixelsBuffer: ScreenPixelsType;
  screenPixels: ScreenPixelsType;
} {
  // Get base address
  const baseAddress = getRegisterValue(rA, registers);

  // Validate and parse offset
  let offsetValue = 0;
  if (offset !== null && offset !== '') {
    offsetValue = parseInt(offset, 10);
    if (isNaN(offsetValue)) {
      throw new Error(`Invalid offset: ${offset}`);
    }
    if (offsetValue < -8 || offsetValue > 7) {
      throw new Error(
        `Offset out of bounds: ${String(offsetValue)} (valid range: -8 to 7)`
      );
    }
  }

  // Calculate final address
  const finalAddress = baseAddress + offsetValue;

  // Get value from register
  const value = getRegisterValue(rB, registers);

  // Handle case based on final address
  switch (finalAddress) {
    // Screen Pixel Operations
    case 240:
      screenPixelX = value;
      break;
    case 241:
      screenPixelY = value;
      break;
    case 242:
      screenPixelsBuffer = updateScreenPixelBuffer(
        screenPixelX,
        screenPixelY,
        screenPixelsBuffer
      );
      break;
    case 243:
      screenPixelsBuffer = clearScreenPixelBuffer(
        screenPixelX,
        screenPixelY,
        screenPixelsBuffer
      );
      break;
    case 244:
      break;
    case 245:
      screenPixels = [...screenPixelsBuffer];
      break;
    case 246:
      screenPixelsBuffer = Array.from({ length: 1024 }, () => false);
      break;
    // Screen Text Operations
    case 247:
      screenTextBuffer = updateScreenTextBuffer(value, screenTextBuffer);
      break;
    case 248:
      screenText = [...screenTextBuffer];
      break;
    case 249:
      screenTextBuffer = clearScreenTextBuffer();
      break;
    // Screen Number Operations
    case 250:
      screenNumber = showScreenNumber(value, screenNumberIsSigned);
      break;
    case 251:
      screenNumber = clearScreenNumber();
      break;
    case 252:
      ({ isSigned: screenNumberIsSigned, value: screenNumber } =
        switchSignedModeScreenNumber(screenNumber));
      break;
    case 253:
      ({ isSigned: screenNumberIsSigned, value: screenNumber } =
        switchUnsignedModeScreenNumber(screenNumber));
      break;
    // Random Operations
    case 254:
      break;
    // Controller Operations
    case 255:
      break;
    // Store value in memory
    default:
      setMemoryValue(finalAddress, value, memories);
      break;
  }

  return {
    memories,
    screenNumber,
    screenNumberIsSigned,
    screenTextBuffer,
    screenText,
    screenPixelX,
    screenPixelY,
    screenPixelsBuffer,
    screenPixels,
  };
}

// Screen Pixels Functions //
function updateScreenPixelBuffer(
  pixelX: number,
  pixelY: number,
  screenPixelsBuffer: ScreenPixelsType
): ScreenPixelsType {
  // Validate X pixel coordinate
  if (pixelX < 0 || pixelX > 31) {
    throw new Error(
      `Screen pixel X coordinate out of bounds: ${String(
        pixelX
      )} (valid range: 0 to 31)`
    );
  }

  // Validate Y pixel coordinate
  if (pixelY < 0 || pixelY > 31) {
    throw new Error(
      `Screen pixel Y coordinate out of bounds: ${String(
        pixelY
      )} (valid range: 0 to 31)`
    );
  }

  // Set pixel in buffer
  const pixelIndex = pixelY * 32 + pixelX;
  screenPixelsBuffer[pixelIndex] = true;

  return screenPixelsBuffer;
}

function clearScreenPixelBuffer(
  pixelX: number,
  pixelY: number,
  screenPixelsBuffer: ScreenPixelsType
): ScreenPixelsType {
  // Validate X pixel coordinate
  if (pixelX < 0 || pixelX > 31) {
    throw new Error(
      `Screen pixel X coordinate out of bounds: ${String(
        pixelX
      )} (valid range: 0 to 31)`
    );
  }

  // Validate Y pixel coordinate
  if (pixelY < 0 || pixelY > 31) {
    throw new Error(
      `Screen pixel Y coordinate out of bounds: ${String(
        pixelY
      )} (valid range: 0 to 31)`
    );
  }

  // Set pixel in buffer
  const pixelIndex = pixelY * 32 + pixelX;
  screenPixelsBuffer[pixelIndex] = false;

  return screenPixelsBuffer;
}

function getScreenPixelValue(
  pixelX: number,
  pixelY: number,
  screenPixelsBuffer: ScreenPixelsType
): number {
  // Validate X pixel coordinate
  if (pixelX < 0 || pixelX > 31) {
    throw new Error(
      `Screen pixel X coordinate out of bounds: ${String(
        pixelX
      )} (valid range: 0 to 31)`
    );
  }

  // Validate Y pixel coordinate
  if (pixelY < 0 || pixelY > 31) {
    throw new Error(
      `Screen pixel Y coordinate out of bounds: ${String(
        pixelY
      )} (valid range: 0 to 31)`
    );
  }

  // Get pixel from buffer
  const pixelIndex = pixelY * 32 + pixelX;
  return screenPixelsBuffer[pixelIndex] ? 1 : 0;
}

// Screen Text Functions //
function updateScreenTextBuffer(
  value: number,
  screenTextBuffer: ScreenTextType
): ScreenTextType {
  // Convert value to character
  const char = getCharacter(value);

  const emptyIndex = screenTextBuffer.indexOf('');

  // If buffer is not full, append character
  if (emptyIndex !== -1) {
    const newBuffer = [...screenTextBuffer];
    newBuffer[emptyIndex] = char;

    return newBuffer;
  }

  // If buffer is full, shift and append character
  const newBuffer = [...screenTextBuffer];
  newBuffer[0] = char;

  return newBuffer;
}

function clearScreenTextBuffer(): ScreenTextType {
  return ['', '', '', '', '', '', '', '', '', ''];
}

function getCharacter(value: number): string {
  if (value === 0) {
    return ' ';
  }

  if (value >= 1 && value <= 26) {
    return String.fromCharCode(64 + value);
  }

  if (value === 27) {
    return '.';
  }
  if (value === 28) {
    return '!';
  }
  if (value === 29) {
    return '?';
  }

  throw new Error(
    `Invalid screen text value: ${String(value)} (valid range: 0 to 29)`
  );
}

// Screen Number Functions //
function showScreenNumber(screenNumber: number, isSigned: boolean) {
  if (isSigned) {
    return convertSignedModeNumber(screenNumber);
  }
  return convertUnsignedModeNumber(screenNumber);
}

function clearScreenNumber() {
  return 0;
}

function convertSignedModeNumber(value: number): number {
  return ((value + 128) % 256) - 128;
}

function convertUnsignedModeNumber(value: number): number {
  return ((value % 256) + 256) % 256;
}

function switchSignedModeScreenNumber(value: number) {
  return { isSigned: true, value: convertSignedModeNumber(value) };
}

function switchUnsignedModeScreenNumber(value: number) {
  return { isSigned: false, value: convertUnsignedModeNumber(value) };
}
