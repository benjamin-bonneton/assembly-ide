// React
import { createContext, use } from 'react';

// Types
import type { AssembleurContextType } from '../../types/assembleur';

export const AssembleurContext = createContext<
  AssembleurContextType | undefined
>(undefined);

export const useAssembleur = () => {
  const context = use(AssembleurContext);
  if (!context) {
    throw new Error('useAssembleur must be used within a AssembleurProvider');
  }
  return context;
};
