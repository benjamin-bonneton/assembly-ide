// Providers
import { useAssembleur } from "@providers/assembleur/useAssembleur";

// Types
import { ErrorType } from "../types/errors";

function useRaiseError() {
  // Get assembleur context at the hook level
  const { assembleur, setAssembleur } = useAssembleur();

  // Raise error function
  function raiseError(
    errorKey: keyof typeof ErrorType,
    message: string,
    line?: number
  ): never {
    // Construct error message
    const errorMessage = `${ErrorType[errorKey]}${
      line ? ` at line ${String(line)}` : ""
    }: ${message}`;

    // Update assembleur state with error
    setAssembleur({
      ...assembleur,
      error: errorMessage,
      isRunning: false,
    });

    // Throw error to stop execution
    throw new Error(errorMessage);
  }

  return { raiseError };
}

export default useRaiseError;
