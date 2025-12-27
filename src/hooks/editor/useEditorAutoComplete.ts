import { useState, useEffect, type RefObject } from "react";
import { functions } from "../../types/functions";
import type { FunctionType } from "../../types/functions";
import { conditions } from "../../types/conditions";
import type { ConditionType } from "../../types/conditions";

const REGISTERS = Array.from({ length: 16 }, (_, i) => `r${String(i)}`);
const DEFAULT_KEYWORDS = [
  ...Object.keys(functions),
  ...Object.keys(conditions),
  ...REGISTERS,
];

interface AutoCompleteState {
  isVisible: boolean;
  suggestions: string[];
  descriptions: string[];
  usages: string[];
  selectedIndex: number;
  position: { top: number; left: number };
}

interface UseEditorAutoCompleteReturn {
  autoComplete: AutoCompleteState;
  showAutoComplete: (textarea: HTMLTextAreaElement) => void;
  hideAutoComplete: () => void;
  selectNext: () => void;
  selectPrevious: () => void;
  setSelectedIndex: (index: number) => void;
  confirmSelection: (
    textarea: HTMLTextAreaElement
  ) => {
    newValue: string;
    newCursorStart: number;
    newCursorEnd: number;
  } | null;
  updateSuggestions: (textarea: HTMLTextAreaElement | null) => void;
}

function useEditorAutoComplete(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  keywords: string[] = DEFAULT_KEYWORDS
): UseEditorAutoCompleteReturn {
  const [autoComplete, setAutoComplete] = useState<AutoCompleteState>({
    isVisible: false,
    suggestions: [],
    descriptions: [],
    usages: [],
    selectedIndex: 0,
    position: { top: 0, left: 0 },
  });

  // Get the current word being typed
  const getCurrentWord = (
    text: string,
    cursorPos: number
  ): { word: string; start: number; end: number } => {
    const beforeCursor = text.substring(0, cursorPos);
    const afterCursor = text.substring(cursorPos);

    // Find word boundaries (alphanumeric characters)
    const wordBefore = /[a-zA-Z0-9_]*$/.exec(beforeCursor);
    const wordAfter = /^[a-zA-Z0-9_]*/.exec(afterCursor);

    const wordStart = wordBefore ? cursorPos - wordBefore[0].length : cursorPos;
    const wordEnd = wordAfter ? cursorPos + wordAfter[0].length : cursorPos;
    const word = text.substring(wordStart, wordEnd);

    return { word, start: wordStart, end: wordEnd };
  };

  // Get cursor position in pixels
  const getCursorCoordinates = (
    textarea: HTMLTextAreaElement
  ): { top: number; left: number } => {
    // Simple approach: calculate based on line height and character position
    const { value, selectionStart } = textarea;
    const textBeforeCursor = value.substring(0, selectionStart);
    const lines = textBeforeCursor.split("\n");
    const currentLineNumber = lines.length - 1;
    const currentLineText = lines[currentLineNumber];

    // Get computed styles
    const computed = window.getComputedStyle(textarea);
    const lineHeight = parseInt(computed.lineHeight) || 20;
    const fontSize = parseInt(computed.fontSize) || 16;
    const charWidth = fontSize * 0.6;

    return {
      top: (currentLineNumber + 1) * lineHeight + 10,
      left: currentLineText.length * charWidth + 10,
    };
  };

  // Update suggestions based on current word
  const updateSuggestions = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;

    const { word } = getCurrentWord(textarea.value, textarea.selectionStart);

    if (word.length === 0) {
      hideAutoComplete();
      return;
    }

    const filtered = keywords.filter((keyword) =>
      keyword.toLowerCase().startsWith(word.toLowerCase())
    );

    if (filtered.length === 0) {
      hideAutoComplete();
      return;
    }

    // Get description information for filtered suggestions
    const descriptions: string[] = filtered.map((keyword) => {
      const func: FunctionType | undefined = (
        functions as Record<string, FunctionType | undefined>
      )[keyword];
      const cond: ConditionType | undefined = (
        conditions as Record<string, ConditionType | undefined>
      )[keyword];
      return func?.description ?? cond?.description ?? "";
    });

    // Get usage information for filtered suggestions
    const usages: string[] = filtered.map((keyword) => {
      const func: FunctionType | undefined = (
        functions as Record<string, FunctionType | undefined>
      )[keyword];
      return func?.usage ?? keyword;
    });

    const position = getCursorCoordinates(textarea);

    setAutoComplete({
      isVisible: true,
      suggestions: filtered,
      descriptions,
      usages,
      selectedIndex: 0,
      position,
    });
  };

  // Show autocomplete
  const showAutoComplete = (textarea: HTMLTextAreaElement) => {
    updateSuggestions(textarea);
  };

  // Hide autocomplete
  const hideAutoComplete = () => {
    setAutoComplete((prev) => ({ ...prev, isVisible: false }));
  };

  // Select next suggestion
  const selectNext = () => {
    setAutoComplete((prev) => ({
      ...prev,
      selectedIndex: (prev.selectedIndex + 1) % prev.suggestions.length,
    }));
  };

  // Select previous suggestion
  const selectPrevious = () => {
    setAutoComplete((prev) => ({
      ...prev,
      selectedIndex:
        prev.selectedIndex === 0
          ? prev.suggestions.length - 1
          : prev.selectedIndex - 1,
    }));
  };

  // Set selected index directly
  const setSelectedIndex = (index: number) => {
    setAutoComplete((prev) => ({
      ...prev,
      selectedIndex: index,
    }));
  };

  // Confirm selection and insert into textarea
  const confirmSelection = (
    textarea: HTMLTextAreaElement
  ): {
    newValue: string;
    newCursorStart: number;
    newCursorEnd: number;
  } | null => {
    if (!autoComplete.isVisible || autoComplete.suggestions.length === 0) {
      return null;
    }

    const selectedSuggestion =
      autoComplete.suggestions[autoComplete.selectedIndex];
    const { start, end } = getCurrentWord(
      textarea.value,
      textarea.selectionStart
    );

    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    const needsSpace = after.length === 0 || !/^[ \t]/.test(after);
    const insertion = selectedSuggestion + (needsSpace ? " " : "");
    const newValue = before + insertion + after;

    const newCursorStart = before.length + insertion.length;
    const newCursorEnd = newCursorStart;

    hideAutoComplete();

    return { newValue, newCursorStart, newCursorEnd };
  };

  // Update suggestions when textarea changes
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !autoComplete.isVisible) return;

    const handleScroll = () => {
      if (autoComplete.isVisible) {
        const position = getCursorCoordinates(textarea);
        setAutoComplete((prev) => ({ ...prev, position }));
      }
    };

    textarea.addEventListener("scroll", handleScroll);
    return () => {
      textarea.removeEventListener("scroll", handleScroll);
    };
  }, [autoComplete.isVisible, textareaRef]);

  return {
    autoComplete,
    showAutoComplete,
    hideAutoComplete,
    selectNext,
    selectPrevious,
    setSelectedIndex,
    confirmSelection,
    updateSuggestions,
  };
}

export default useEditorAutoComplete;
