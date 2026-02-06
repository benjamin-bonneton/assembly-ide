// Env
import { NB_REGISTERS, NB_DATA_MEMORY } from '../../vite-env.d';

// React
import { useState, useMemo } from 'react';

// Context
import { AssembleurContext } from '@providers/assembleur/useAssembleur';

// Types
import type { AssembleurType } from '../../types/assembleur';

export function AssembleurProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize departure state
  const [assembleur, setAssembleur] = useState<AssembleurType>({
    registers: Array.from({ length: NB_REGISTERS }, () => 0),
    memories: Array.from({ length: NB_DATA_MEMORY }, () => 0),
    screenNumber: 0,
    screenNumberIsSigned: true,
    screenText: Array.from({ length: 10 }, () => ''),
    screenTextBuffer: Array.from({ length: 10 }, () => ''),
    screenPixelX: 0,
    screenPixelY: 0,
    screenPixelsBuffer: Array.from({ length: 1024 }, () => false),
    screenPixels: Array.from({ length: 1024 }, () => false),
    programCounter: 0,
    code: '',
    flags: {
      carry: false,
      zero: false,
    },
    stepLimit: -1,
    instructionsPerSecond: 100,
    error: null,
    isRunning: false,
    randomCache: new Map(),
    codeHash: '',
    controllerInput: 0,
  });

  // Provide the departure state and setter function to context consumers
  const value = useMemo(
    () => ({ assembleur, setAssembleur }),
    [assembleur, setAssembleur]
  );

  // Render the context provider with children
  return <AssembleurContext value={value}>{children}</AssembleurContext>;
}
