import { useCallback } from 'react';

interface IndentationResult {
  newValue: string;
  newCursorStart: number;
  newCursorEnd: number;
}

function useEditorIndentation() {
  const indent = useCallback(
    (value: string, start: number, end: number): IndentationResult => {
      // Get start and end of selection in terms of lines
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      let lineEnd = value.indexOf('\n', end);
      if (lineEnd === -1) lineEnd = value.length;

      let newValue: string;
      let newCursorStart: number;
      let newCursorEnd: number;

      // If selection is empty, insert tab at cursor
      if (start === end) {
        const before = value.substring(0, start);
        const after = value.substring(end);
        newValue = before + '\t' + after;
        newCursorStart = newCursorEnd = start + 1;
      } else {
        // Indent all selected lines
        const selection = value.substring(lineStart, lineEnd);
        const indented = selection.replace(/^/gm, '\t');
        const addedChars = indented.length - selection.length;
        newValue =
          value.substring(0, lineStart) + indented + value.substring(lineEnd);
        newCursorStart = start + 1;
        newCursorEnd = end + addedChars;
      }

      return { newValue, newCursorStart, newCursorEnd };
    },
    []
  );

  const unindent = useCallback(
    (value: string, start: number, end: number): IndentationResult => {
      // Get start and end of selection in terms of lines
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      let lineEnd = value.indexOf('\n', end);
      if (lineEnd === -1) lineEnd = value.length;

      // Unindent
      const selection = value.substring(lineStart, lineEnd);
      const unindented = selection.replace(/^(\t|[ ]{1,4})/gm, '');
      const removedChars = selection.length - unindented.length;
      const newValue =
        value.substring(0, lineStart) + unindented + value.substring(lineEnd);

      let newCursorStart: number;
      let newCursorEnd: number;

      // Adjust cursor position based on how many characters were removed
      if (start === end) {
        // Single cursor position
        newCursorStart = newCursorEnd = Math.max(
          lineStart,
          start - Math.min(1, removedChars)
        );
      } else {
        // Selection
        newCursorStart = start;
        newCursorEnd = end - removedChars;
      }

      return { newValue, newCursorStart, newCursorEnd };
    },
    []
  );

  return { indent, unindent };
}

export default useEditorIndentation;
