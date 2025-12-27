// Utils
import { getArgumentType } from "./arguments";
import { resolveAlias } from "./aliases";

// Types
import { functions } from "../types/functions";
import type {
  AliasesType,
  InstructionType,
  LabelsType,
} from "src/types/assembleur";
import type { ErrorType } from "src/types/errors";

export const isValidFunctionName = (functionName: string) => {
  return functionName in functions;
};

export const resolveFunctionSyntax = (
  functionName: keyof typeof functions,
  args: InstructionType,
  aliases: AliasesType,
  labels: LabelsType,
  index: number,
  raiseError: (
    type: keyof typeof ErrorType,
    message: string,
    line: number
  ) => void
) => {
  // If function has no options and args length does not match
  if (
    functions[functionName].options.length === 0 &&
    functions[functionName].args.length !== args.length
  ) {
    raiseError(
      "SYNTAX_ERROR",
      `Function ${functionName} expects ${String(
        functions[functionName].args.length
      )} arguments, got ${String(args.length)}`,
      index
    );
  }

  // If function has options and options length does not match
  if (functions[functionName].options.length > 0) {
    const expectedArgsLength = functions[functionName].args.length;
    const providedArgsLength =
      args.length - functions[functionName].options.length;

    if (providedArgsLength > expectedArgsLength) {
      raiseError(
        "SYNTAX_ERROR",
        `Function ${functionName} expects at most ${String(
          expectedArgsLength
        )} options, got ${String(providedArgsLength)}`,
        index
      );
    }
  }

  // Check each argument type
  for (let i = 0; i < functions[functionName].args.length; i++) {
    // Get expected and provided types
    const expectedTypes = functions[functionName].args[i];
    let providedType = getArgumentType(args[i]);
    let resolvedArg: string | undefined = undefined;

    // If provided type is an alias, get its resolved type
    if (providedType === "alias" && functionName !== "DEFINE") {
      try {
        resolvedArg = resolveAlias(args[i], aliases);
        providedType = getArgumentType(resolvedArg);
      } catch (error) {
        raiseError(
          "SYNTAX_ERROR",
          error instanceof Error ? error.message : String(error),
          index
        );
      }
    }

    // Validate argument type
    if (!expectedTypes.includes(providedType)) {
      raiseError(
        "SYNTAX_ERROR",
        `Invalid type for argument ${String(
          i + 1
        )} in function ${functionName}: expected ${expectedTypes.join(
          " or "
        )}, got ${providedType}`,
        index
      );
    }

    // Replace alias with resolved argument
    if (resolvedArg) {
      args[i] = resolvedArg;
    }

    // Replace label with its address
    if (providedType === "label") {
      if (Object.keys(labels).includes(args[i])) {
        args[i] = labels[args[i]].toString();
      } else {
        raiseError(
          "SYNTAX_ERROR",
          `Undefined label ${args[i]} in function ${functionName}`,
          index
        );
      }
    }
  }

  // Check each option type
  for (let i = 0; i < functions[functionName].options.length; i++) {
    // If no more options to check
    if (args.length <= functions[functionName].args.length + i) {
      break;
    }

    // Get expected and provided types
    const expectedTypes = functions[functionName].options[i];
    let providedType = getArgumentType(
      args[functions[functionName].args.length + i]
    );
    let resolvedArg: string | undefined = undefined;

    // If provided type is an alias, get its resolved type
    if (providedType === "alias" && functionName !== "DEFINE") {
      try {
        resolvedArg = resolveAlias(
          args[functions[functionName].args.length + i],
          aliases
        );
        providedType = getArgumentType(resolvedArg);
      } catch (error) {
        raiseError(
          "SYNTAX_ERROR",
          error instanceof Error ? error.message : String(error),
          index
        );
      }
    }

    // Validate option type
    if (!expectedTypes.includes(providedType)) {
      raiseError(
        "SYNTAX_ERROR",
        `Invalid type for option ${String(
          i + 1
        )} in function ${functionName}: expected ${expectedTypes.join(
          " or "
        )}, got ${providedType}`,
        index
      );
    }

    // Replace alias with resolved argument
    if (resolvedArg) {
      args[functions[functionName].args.length + i] = resolvedArg;
    }

    // Replace label with its address
    if (providedType === "label") {
      if (
        Object.keys(labels).includes(
          args[functions[functionName].args.length + i]
        )
      ) {
        args[functions[functionName].args.length + i] =
          labels[args[functions[functionName].args.length + i]].toString();
      } else {
        raiseError(
          "SYNTAX_ERROR",
          `Undefined label ${
            args[functions[functionName].args.length + i]
          } in function ${functionName}`,
          index
        );
      }
    }
  }

  return args;
};
