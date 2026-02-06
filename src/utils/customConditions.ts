// Types
import type { AssembleurType } from 'src/types/assembleur';
import type { conditions } from 'src/types/conditions';

// Condition validation handler
export function isConditionValid(
  conditionName: keyof typeof conditions,
  flags: AssembleurType['flags']
): boolean {
  switch (conditionName) {
    case 'EQ':
      return EQ(flags);
    case 'NE':
      return NE(flags);
    case 'GE':
      return GE(flags);
    case 'LT':
      return LT(flags);
    default:
      return false;
  }
}

// Check Zero flag
function EQ(flags: AssembleurType['flags']): boolean {
  return flags.zero;
}
function NE(flags: AssembleurType['flags']): boolean {
  return !flags.zero;
}

// Check Carry flag
function GE(flags: AssembleurType['flags']): boolean {
  return flags.carry;
}
function LT(flags: AssembleurType['flags']): boolean {
  return !flags.carry;
}
