import { useCallback, useEffect, useRef, useState } from "react";

// Helper to parse pixel values
const parseValue = (v: string) =>
  v.endsWith("px") ? parseInt(v.slice(0, -2), 10) : 0;

function useEditorLines(value: string) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);

  // Calculate number of lines for a given string
  const calculateNumLines = useCallback(
    (
      str: string,
      context: CanvasRenderingContext2D,
      textareaWidth: number
    ): number => {
      const words = str.split(" ");
      let lineCount = 0;
      let currentLine = "";
      for (const word of words) {
        const wordWidth = context.measureText(word + " ").width;
        const lineWidth = context.measureText(currentLine).width;
        if (lineWidth + wordWidth > textareaWidth) {
          lineCount++;
          currentLine = word + " ";
        } else {
          currentLine += word + " ";
        }
      }
      if (currentLine.trim() !== "") {
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

    const textareaStyles = window.getComputedStyle(textarea);
    const font = `${textareaStyles.fontSize} ${textareaStyles.fontFamily}`;
    const paddingLeft = parseValue(textareaStyles.paddingLeft);
    const paddingRight = parseValue(textareaStyles.paddingRight);
    const textareaWidth =
      textarea.getBoundingClientRect().width - paddingLeft - paddingRight;

    // Prepare canvas for text width calculation
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    context.font = font;

    // Split the textarea content into logical lines
    const lines = value.split("\n");
    const numLines = lines.map((line: string) =>
      calculateNumLines(line, context, textareaWidth)
    );

    const lineNumbersArr: string[] = [];
    let i = 0;
    const numLinesCopy = [...numLines];
    while (numLinesCopy.length > 0) {
      const numLinesOfSentence = numLinesCopy.shift();
      if (numLinesOfSentence !== undefined) {
        lineNumbersArr.push(i.toString());
        if (numLinesOfSentence > 1) {
          Array(numLinesOfSentence - 1)
            .fill("")
            .forEach(() => lineNumbersArr.push(""));
        }
        i++;
      }
    }
    setLineNumbers(lineNumbersArr);

    // Determine the current logical line based on the cursor position
    const caret = textarea.selectionStart || 0;
    const currLine = value.slice(0, caret).split("\n").length;
    setCurrentLine(currLine);
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
    const currLine = value.slice(0, caret).split("\n").length;
    setCurrentLine(currLine);
  }, [value]);

  // Update line numbers when value changes
  useEffect(() => {
    updateLineNumbers();
  }, [updateLineNumbers]);

  // Attach event listeners for scroll and cursor position
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.addEventListener("click", updateCurrentLine);
    textarea.addEventListener("keyup", updateCurrentLine);
    textarea.addEventListener("scroll", syncScroll);

    return () => {
      textarea.removeEventListener("click", updateCurrentLine);
      textarea.removeEventListener("keyup", updateCurrentLine);
      textarea.removeEventListener("scroll", syncScroll);
    };
  }, [updateCurrentLine, syncScroll]);

  return {
    textareaRef,
    lineNumbersRef,
    lineNumbers,
    currentLine,
    updateLineNumbers,
  };
}

export default useEditorLines;
