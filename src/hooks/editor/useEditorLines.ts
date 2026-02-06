import { useCallback, useEffect, useRef, useState } from 'react';

// Helper to parse pixel values
const parseValue = (v: string) =>
  v.endsWith('px') ? parseInt(v.slice(0, -2), 10) : 0;

const isEmptyOrCommentLine = (line: string): boolean => {
  const trimmed = line.trim();
  return trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith(';');
};

function useEditorLines(value: string) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [executionLineMapping, setExecutionLineMapping] = useState<number[]>(
    []
  );

  // Calculate number of lines for a given string
  const calculateNumLines = useCallback(
    (
      str: string,
      context: CanvasRenderingContext2D,
      textareaWidth: number
    ): number => {
      const words = str.split(' ');
      let lineCount = 0;
      let currentLine = '';
      for (const word of words) {
        const wordWidth = context.measureText(word + ' ').width;
        const lineWidth = context.measureText(currentLine).width;
        if (lineWidth + wordWidth > textareaWidth) {
          lineCount++;
          currentLine = word + ' ';
        } else {
          currentLine += word + ' ';
        }
      }
      if (currentLine.trim() !== '') {
        lineCount++;
      }
      return lineCount;
    },
    []
  );

  // Calculate line numbers for the textarea content
  const updateLineNumbers = useCallback(() => {
    const textarea = textareaRef.current;
    const lineNumbersEle = lineNumbersRef.current;
    if (!textarea || !lineNumbersEle) return;

    // Detect if the user is currently scrolled to the bottom (within 1px)
    const atBottom =
      Math.abs(
        textarea.scrollHeight - textarea.clientHeight - textarea.scrollTop
      ) <= 1;

    const textareaStyles = window.getComputedStyle(textarea);
    const font = `${textareaStyles.fontSize} ${textareaStyles.fontFamily}`;
    const paddingLeft = parseValue(textareaStyles.paddingLeft);
    const paddingRight = parseValue(textareaStyles.paddingRight);
    const textareaWidth =
      textarea.getBoundingClientRect().width - paddingLeft - paddingRight;

    // Prepare canvas for text width calculation
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    context.font = font;

    // Split the textarea content into logical lines
    const lines = value.split('\n');
    const numLines = lines.map((line: string) =>
      calculateNumLines(line, context, textareaWidth)
    );

    const lineNumbersArr: string[] = [];
    const executionMapping: number[] = [];
    let executionIndex = 0;
    let i = 0;
    const numLinesCopy = [...numLines];

    while (numLinesCopy.length > 0) {
      const numLinesOfSentence = numLinesCopy.shift();
      if (numLinesOfSentence !== undefined) {
        const isEmptyLine = isEmptyOrCommentLine(lines[i]);

        if (isEmptyLine) {
          lineNumbersArr.push('');
          executionMapping.push(-1);
        } else {
          lineNumbersArr.push(executionIndex.toString());
          executionMapping.push(executionIndex);
          executionIndex++;
        }

        // Lignes supplémentaires pour le wrapping
        if (numLinesOfSentence > 1) {
          Array(numLinesOfSentence - 1)
            .fill('')
            .forEach(() => {
              lineNumbersArr.push('');
              executionMapping.push(
                isEmptyLine ? -1 : executionMapping[executionMapping.length - 1]
              );
            });
        }
        i++;
      }
    }
    setLineNumbers(lineNumbersArr);
    setExecutionLineMapping(executionMapping);

    // Determine the current logical line based on the cursor position
    const caret = textarea.selectionStart || 0;
    const currLine = value.slice(0, caret).split('\n').length;
    setCurrentLine(currLine);

    // If the user was at bottom, keep them pinned to the bottom after layout changes
    if (atBottom) {
      // Wait for DOM updates (fonts/line wrapping)
      requestAnimationFrame(() => {
        textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
        lineNumbersEle.scrollTop = textarea.scrollTop;
      });
    }
  }, [calculateNumLines, value]);

  // Sync scroll positions
  const syncScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const lineNumbersEle = lineNumbersRef.current;
    if (textarea && lineNumbersEle) {
      lineNumbersEle.scrollTop = textarea.scrollTop;
    }
  }, []);

  // Update current line on cursor position change
  const updateCurrentLine = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const caret = textarea.selectionStart || 0;
    const currLine = value.slice(0, caret).split('\n').length;
    setCurrentLine(currLine);

    // If the caret is on the last line, ensure the editor stays pinned to bottom
    const totalLines = value.split('\n').length;
    const lineNumbersEle = lineNumbersRef.current;

    if (currLine === totalLines && lineNumbersEle) {
      // Wait for layout updates then pin to bottom
      requestAnimationFrame(() => {
        textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
        lineNumbersEle.scrollTop = textarea.scrollTop;
      });
    }
  }, [value]);

  // Update line numbers when value changes
  useEffect(() => {
    updateLineNumbers();
  }, [updateLineNumbers]);

  // Attach event listeners for scroll and cursor position
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.addEventListener('click', updateCurrentLine);
    textarea.addEventListener('keyup', updateCurrentLine);
    textarea.addEventListener('scroll', syncScroll);

    return () => {
      textarea.removeEventListener('click', updateCurrentLine);
      textarea.removeEventListener('keyup', updateCurrentLine);
      textarea.removeEventListener('scroll', syncScroll);
    };
  }, [updateCurrentLine, syncScroll]);

  return {
    textareaRef,
    lineNumbersRef,
    lineNumbers,
    currentLine,
    updateLineNumbers,
    executionLineMapping,
  };
}

export default useEditorLines;
