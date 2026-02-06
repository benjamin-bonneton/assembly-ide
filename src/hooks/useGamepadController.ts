// React
import { useEffect } from 'react';

// Provider
import { useAssembleur } from '@providers/assembleur/useAssembleur';

// Key mapping
const KEY_VALUES = {
  a: 1,
  s: 2,
  d: 4,
  w: 8,
  j: 16,
  k: 32,
  t: 64,
  y: 128,
};

const useGamepadController = () => {
  const { assembleur, setAssembleur } = useAssembleur();

  useEffect(() => {
    // Track currently pressed keys
    const pressedKeys = new Set<string>();

    const isUserTyping = (): boolean => {
      const activeElement = document.activeElement;
      return (
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLInputElement
      );
    };

    // Calculate combined value from pressed keys
    const calculateControllerInput = (): number => {
      let value = 0;
      pressedKeys.forEach((key) => {
        const keyValue = KEY_VALUES[key as keyof typeof KEY_VALUES];
        value |= keyValue;
      });
      return value;
    };

    // Handle key down
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isUserTyping()) {
        return;
      }

      const key = event.key.toLowerCase();

      // Only process if it's a valid gamepad key
      if (key in KEY_VALUES) {
        event.preventDefault();

        // Add to pressed keys set
        const wasPressed = pressedKeys.has(key);
        pressedKeys.add(key);

        // Only update if this is a new key press
        if (!wasPressed) {
          const newValue = calculateControllerInput();
          setAssembleur((prev) => ({
            ...prev,
            controllerInput: newValue,
          }));
        }
      }
    };

    // Handle key up
    const handleKeyUp = (event: KeyboardEvent) => {
      if (isUserTyping()) {
        return;
      }

      const key = event.key.toLowerCase();

      // Only process if it's a valid gamepad key
      if (key in KEY_VALUES) {
        // Remove from pressed keys set
        const wasPressed = pressedKeys.has(key);
        pressedKeys.delete(key);

        // Only update if the key was actually pressed
        if (wasPressed) {
          const newValue = calculateControllerInput();
          setAssembleur((prev) => ({
            ...prev,
            controllerInput: newValue,
          }));
        }
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setAssembleur]);

  return assembleur.controllerInput;
};

export default useGamepadController;
