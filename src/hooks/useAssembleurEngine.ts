// Env
import {
  NB_REGISTERS,
  NB_DATA_MEMORY,
  NB_INSTRUCTION_MEMORY,
} from "../vite-env.d";

// React
import { useRef } from "react";

// Provider
import { useAssembleur } from "@providers/assembleur/useAssembleur";

// Hook
import useRaiseError from "./useRaiseError";

// Utils
import { extractLabelsAndAliases, parseCode } from "@utils/assembleur";
import { isLabel } from "@utils/labels";
import { getInstructionFunction } from "@utils/instructions";
import { isValidFunctionName, resolveFunctionSyntax } from "@utils/functions";
import { resolveAlias } from "@utils/aliases";

// Types
import type {
  AddressesStackType,
  AliasesType,
  AssembleurType,
  InstructionsType,
  LabelsType,
} from "src/types/assembleur";
import { functionHandler } from "@utils/customFunctions";

const useAssembleurEngine = () => {
  const { assembleur, setAssembleur } = useAssembleur();
  const { raiseError } = useRaiseError();
  const executionTimerRef = useRef<number | null>(null);

  const startProgram = (stepLimit = -1) => {
    // Stop any existing execution
    stopProgram();

    // Initialize assembleur state
    const newAssembleur = getInitialState(stepLimit);

    // Prepare assembleur code
    const instructions = parseCode(assembleur.code);

    // Validate instruction count
    if (instructions.length > NB_INSTRUCTION_MEMORY) {
      raiseError(
        "SYNTAX_ERROR",
        `Program too large: ${String(
          instructions.length
        )} instructions (maximum: ${String(NB_INSTRUCTION_MEMORY)})`
      );
      return;
    }

    // Extract labels and aliases
    const { labels, aliases } = extractLabelsAndAliases(instructions);

    // Set Addresses stack
    const addressesStack: AddressesStackType = [];

    // Check instructions syntax
    const instructionsChecked = checkProgramSyntax(
      instructions,
      aliases,
      labels
    );

    // Execute program
    if (stepLimit === -1) {
      executeStepByStep(newAssembleur, instructionsChecked, addressesStack);
    } else {
      iterateProgram(newAssembleur, instructionsChecked, addressesStack);
    }
  };

  const stopProgram = () => {
    if (executionTimerRef.current !== null) {
      clearInterval(executionTimerRef.current);
      executionTimerRef.current = null;
      setAssembleur((prev) => ({ ...prev, isRunning: false }));
    }
  };

  const getInitialState = (stepLimit: number): AssembleurType => {
    const newCodeHash = hashCode(assembleur.code);

    // Preserve randomCache if code hasn't changed and if step mode
    const shouldPreserveCache =
      stepLimit >= 0 &&
      assembleur.codeHash === newCodeHash &&
      assembleur.randomCache.size > 0;

    return {
      registers: Array.from({ length: NB_REGISTERS }, () => 0),
      memories: Array.from({ length: NB_DATA_MEMORY }, () => 0),
      screenNumber: 0,
      screenNumberIsSigned: true,
      screenTextBuffer: Array.from({ length: 10 }, () => ""),
      screenText: Array.from({ length: 10 }, () => ""),
      screenPixelX: 0,
      screenPixelY: 0,
      screenPixelsBuffer: Array.from({ length: 1024 }, () => false),
      screenPixels: Array.from({ length: 1024 }, () => false),
      programCounter: 0,
      code: assembleur.code,
      flags: {
        carry: false,
        zero: false,
      },
      stepLimit: stepLimit,
      instructionsPerSecond: assembleur.instructionsPerSecond,
      error: null,
      isRunning: false,
      randomCache: shouldPreserveCache
        ? new Map(assembleur.randomCache)
        : (new Map() as Map<number, number>),
      codeHash: newCodeHash,
      controllerInput: assembleur.controllerInput || 0,
    };
  };

  const hashCode = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString();
  };

  const resetState = () => {
    stopProgram();
    setAssembleur(getInitialState(-1));
  };

  const executeStepByStep = (
    initialAssembleur: AssembleurType,
    instructions: InstructionsType,
    initialAddressesStack: AddressesStackType
  ) => {
    let currentAssembleur = { ...initialAssembleur, isRunning: true };
    let addressesStack = initialAddressesStack;
    let stepCount = 0;

    // Calculate delay between instructions (milliseconds)
    const delayMs = 1000 / currentAssembleur.instructionsPerSecond;

    // Update state immediately to show starting position
    setAssembleur({ ...currentAssembleur });

    executionTimerRef.current = window.setInterval(() => {
      try {
        // Execute one step
        const result = executeOneStep(
          currentAssembleur,
          instructions,
          addressesStack,
          stepCount
        );

        if (result.shouldStop) {
          stopProgram();
          setAssembleur({ ...result.assembleur, isRunning: false });
          return;
        }

        currentAssembleur = result.assembleur;
        addressesStack = result.addressesStack;
        stepCount = result.stepCount;

        // Update UI after each step
        setAssembleur({ ...currentAssembleur, isRunning: true });
      } catch {
        // Stop execution on error
        stopProgram();
      }
    }, delayMs);
  };

  const executeOneStep = (
    currentAssembleur: AssembleurType,
    instructions: InstructionsType,
    addressesStack: AddressesStackType,
    stepCount: number
  ): {
    assembleur: AssembleurType;
    addressesStack: AddressesStackType;
    stepCount: number;
    shouldStop: boolean;
  } => {
    // Get current address
    const currentAddress = currentAssembleur.programCounter;

    // Check program end
    if (currentAddress >= instructions.length) {
      raiseError("RUNTIME_ERROR", "Program counter out of bounds");
    }

    // Get current instruction
    const currentInstruction = instructions[currentAddress];

    // Get instruction function
    const functionName = getInstructionFunction(currentInstruction);

    // Skip empty lines
    if (!functionName) {
      currentAssembleur.programCounter += 1;
      return {
        assembleur: currentAssembleur,
        addressesStack,
        stepCount: stepCount + 1,
        shouldStop: false,
      };
    }

    // Skip labels
    if (isLabel(functionName)) {
      currentAssembleur.programCounter += 1;
      return {
        assembleur: currentAssembleur,
        addressesStack,
        stepCount: stepCount + 1,
        shouldStop: false,
      };
    }

    // Handle instruction
    const oldProgramCounter = currentAssembleur.programCounter;

    let result;
    try {
      result = functionHandler(
        functionName,
        currentInstruction.slice(1),
        currentAssembleur,
        addressesStack
      );
    } catch (error) {
      raiseError(
        "RUNTIME_ERROR",
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }

    // Update assembleur state
    currentAssembleur = result.newAssembleur;
    addressesStack = result.addressesStack;

    if (result.endProgram) {
      return {
        assembleur: currentAssembleur,
        addressesStack,
        stepCount,
        shouldStop: true,
      };
    }

    if (currentAssembleur.programCounter === oldProgramCounter) {
      currentAssembleur.programCounter += 1;
    }

    return {
      assembleur: currentAssembleur,
      addressesStack,
      stepCount: stepCount + 1,
      shouldStop: false,
    };
  };

  const checkProgramSyntax = (
    instructions: InstructionsType,
    aliases: AliasesType,
    labels: LabelsType
  ) => {
    instructions.forEach((inst, index) => {
      // Get instruction function
      const functionName = getInstructionFunction(inst);

      // Skip empty lines
      if (!functionName) {
        return;
      }

      // Skip labels
      if (isLabel(functionName)) return;

      // Check function name
      if (!isValidFunctionName(functionName)) {
        raiseError(
          "SYNTAX_ERROR",
          "Unknow function " + functionName,
          index + 1
        );
      }

      // Check aliases cycles
      if (functionName === "DEFINE") {
        const aliasName = inst[1];
        try {
          resolveAlias(aliasName, aliases);
          return;
        } catch (error) {
          raiseError(
            "SYNTAX_ERROR",
            error instanceof Error ? error.message : String(error),
            index + 1
          );
        }
      }

      // Check function syntax
      inst = resolveFunctionSyntax(
        functionName,
        inst.slice(1),
        aliases,
        labels,
        index + 1,
        raiseError
      );

      // Update instruction after alias resolution
      instructions[index] = [functionName, ...inst];
    });

    return instructions;
  };

  const iterateProgram = (
    newAssembleur: AssembleurType,
    instructions: InstructionsType,
    addressesStack: AddressesStackType
  ) => {
    let stepCount = 0;

    while (
      newAssembleur.stepLimit >= 0 ? stepCount < newAssembleur.stepLimit : true
    ) {
      // Get current address
      const currentAddress = newAssembleur.programCounter;

      // Check program end
      if (currentAddress >= instructions.length) {
        raiseError("RUNTIME_ERROR", "Program counter out of bounds");
        break;
      }

      // Get current instruction
      const currentInstruction = instructions[currentAddress];

      // Get instruction function
      const functionName = getInstructionFunction(currentInstruction);

      // Skip empty lines
      if (!functionName) {
        newAssembleur.programCounter += 1;
        stepCount += 1;
        continue;
      }

      // Skip labels
      if (isLabel(functionName)) {
        newAssembleur.programCounter += 1;
        stepCount += 1;
        continue;
      }

      // Handle instruction
      const oldProgramCounter = newAssembleur.programCounter;

      let result;
      try {
        result = functionHandler(
          functionName,
          currentInstruction.slice(1),
          newAssembleur,
          addressesStack
        );
      } catch (error) {
        raiseError(
          "RUNTIME_ERROR",
          error instanceof Error ? error.message : String(error)
        );
        break;
      }

      // Update assembleur state
      newAssembleur = result.newAssembleur;
      addressesStack = result.addressesStack;

      if (result.endProgram) {
        break;
      }

      if (newAssembleur.programCounter === oldProgramCounter) {
        newAssembleur.programCounter += 1;
      }
      stepCount += 1;
    }

    // Update assembleur state in context
    setAssembleur(newAssembleur);
  };

  return {
    startProgram,
    stopProgram,
    resetState,
  };
};

export default useAssembleurEngine;
