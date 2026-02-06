// Utils
import { getArgumentType } from '@utils/arguments';

// Types
import type { AliasesType } from 'src/types/assembleur';

export const resolveAlias = (arg: string, aliases: AliasesType) => {
  const visited = new Set<string>();
  let currentValue = arg;

  // Resolve aliases until a base type is found
  while (
    !['register', 'immediate', 'condition'].includes(
      getArgumentType(currentValue)
    ) &&
    !visited.has(currentValue)
  ) {
    // Mark as visited
    visited.add(currentValue);

    // Resolve alias
    if (currentValue in aliases) {
      currentValue = aliases[currentValue];
    } else {
      break;
    }
  }

  // If resolved to a valid type, return it
  if (
    ['register', 'immediate', 'condition'].includes(
      getArgumentType(currentValue)
    )
  ) {
    return currentValue;
  }

  // If alias does not exist
  if (!Object.keys(aliases).includes(arg)) {
    throw new Error(`Undefined « ${arg} »`);
  }

  // Detect cyclic aliases
  if (visited.has(currentValue)) {
    throw new Error(`Cyclic alias detected involving ${currentValue}`);
  }

  // Unable to resolve
  throw new Error(`Unable to resolve alias: ${arg}`);
};
