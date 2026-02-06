import { useRef, useCallback } from 'react';

interface HistoryEntry {
  value: string;
  selection: { start: number; end: number };
}

function useEditorHistory(
  setValue: (value: string) => void,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
) {
  const historyRef = useRef<HistoryEntry[]>([
    { value: '', selection: { start: 0, end: 0 } },
  ]);
  const historyIndexRef = useRef(0);

  const addToHistory = useCallback(
    (newValue: string, selectionStart: number, selectionEnd: number) => {
      // Remove any future history if we're not at the end
      const newHistory = historyRef.current.slice(
        0,
        historyIndexRef.current + 1
      );
      newHistory.push({
        value: newValue,
        selection: { start: selectionStart, end: selectionEnd },
      });

      // Limit history to 100 entries
      if (newHistory.length > 100) {
        newHistory.shift();
      } else {
        historyIndexRef.current++;
      }

      historyRef.current = newHistory;
      setValue(newValue);
    },
    [setValue]
  );

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const historyEntry = historyRef.current[historyIndexRef.current];
      setValue(historyEntry.value);
      setTimeout(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.selectionStart = historyEntry.selection.start;
          textarea.selectionEnd = historyEntry.selection.end;
        }
      }, 0);
      return true;
    }
    return false;
  }, [setValue, textareaRef]);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const historyEntry = historyRef.current[historyIndexRef.current];
      setValue(historyEntry.value);
      setTimeout(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.selectionStart = historyEntry.selection.start;
          textarea.selectionEnd = historyEntry.selection.end;
        }
      }, 0);
      return true;
    }
    return false;
  }, [setValue, textareaRef]);

  return { addToHistory, undo, redo };
}

export default useEditorHistory;
