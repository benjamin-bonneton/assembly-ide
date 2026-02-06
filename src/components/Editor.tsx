// React
import { useRef, useImperativeHandle } from 'react';

// Hooks
import useEditorLines from '@hooks/editor/useEditorLines';
import useEditorColors from '@hooks/editor/useEditorColors';
import useEditorHistory from '@hooks/editor/useEditorHistory';
import useEditorIndentation from '@hooks/editor/useEditorIndentation';
import useEditorOverlaySync from '@hooks/editor/useEditorOverlaySync';
import useEditorAutoComplete from '@hooks/editor/useEditorAutoComplete';

export interface EditorHandle {
  undo: () => void;
  redo: () => void;
  newFile: () => void;
  openFile: () => void;
  saveAs: (filename?: string) => void;
  getValue: () => string;
  setValue: (s: string) => void;
}

interface EditorProps {
  editorRef?: React.Ref<EditorHandle>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  executionLine: number;
  onExecute?: () => void;
  onStep?: () => void;
}

function Editor({
  editorRef,
  value,
  setValue,
  executionLine,
  onExecute,
  onStep,
}: EditorProps) {
  // Refs
  const {
    textareaRef,
    lineNumbersRef,
    lineNumbers,
    currentLine,
    executionLineMapping,
  } = useEditorLines(value);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Hooks
  const colorizedHtml = useEditorColors(value);
  const { addToHistory, undo, redo } = useEditorHistory(setValue, textareaRef);
  const { indent, unindent } = useEditorIndentation();
  useEditorOverlaySync(textareaRef, overlayRef, value);
  const {
    autoComplete,
    dropdownRef,
    hideAutoComplete,
    selectNext,
    selectPrevious,
    setSelectedIndex,
    confirmSelection,
    updateSuggestions,
  } = useEditorAutoComplete(textareaRef);

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Handle autocomplete navigation
    if (autoComplete.isVisible) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectNext();
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectPrevious();
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const result = confirmSelection(textarea);
        if (result) {
          addToHistory(
            result.newValue,
            result.newCursorStart,
            result.newCursorEnd
          );
          setTimeout(() => {
            textarea.selectionStart = result.newCursorStart;
            textarea.selectionEnd = result.newCursorEnd;
          }, 0);
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        hideAutoComplete();
        return;
      }
    }

    // Handle Ctrl+Z (Undo)
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
      return;
    }

    // Handle Ctrl+Shift+Z or Ctrl+Y (Redo)
    if (
      (e.ctrlKey || e.metaKey) &&
      ((e.key === 'z' && e.shiftKey) || e.key === 'y')
    ) {
      e.preventDefault();
      redo();
      return;
    }

    // Handle Ctrl+S (Save)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (
        editorRef &&
        typeof editorRef === 'object' &&
        'current' in editorRef &&
        editorRef.current?.saveAs
      ) {
        editorRef.current.saveAs();
      }
      return;
    }

    // Handle Ctrl+O (Open)
    if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
      e.preventDefault();
      if (
        editorRef &&
        typeof editorRef === 'object' &&
        'current' in editorRef &&
        editorRef.current?.openFile
      ) {
        editorRef.current.openFile();
      }
      return;
    }

    // Handle Ctrl+W (Close/New)
    if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
      e.preventDefault();
      if (
        editorRef &&
        typeof editorRef === 'object' &&
        'current' in editorRef &&
        editorRef.current?.newFile
      ) {
        editorRef.current.newFile();
      }
      return;
    }

    // Handle Ctrl+Shift+Enter (Next Step)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      onStep?.();
      return;
    }

    // Handle Ctrl+Enter (Execute)
    else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onExecute?.();
      return;
    }

    // Handle Tab indentation (when autocomplete is not visible)
    if (e.key === 'Tab') {
      e.preventDefault();

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const result = e.shiftKey
        ? unindent(value, start, end)
        : indent(value, start, end);

      addToHistory(result.newValue, result.newCursorStart, result.newCursorEnd);

      setTimeout(() => {
        textarea.selectionStart = result.newCursorStart;
        textarea.selectionEnd = result.newCursorEnd;
      }, 0);
    }
  };

  // Handle textarea change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    // Capture selection from the event target immediately
    const selectionStart = e.target.selectionStart;
    const selectionEnd = e.target.selectionEnd;

    addToHistory(newValue, selectionStart, selectionEnd);

    // Restore cursor position after React re-render
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.selectionStart = selectionStart;
        textarea.selectionEnd = selectionEnd;
        updateSuggestions(textarea);
      }
    });
  };

  // Exposed methods for parent components
  useImperativeHandle(editorRef, () => ({
    undo: () => {
      undo();
    },
    redo: () => {
      redo();
    },
    newFile: () => {
      const textarea = textareaRef.current;
      if (textarea) {
        addToHistory('', 0, 0);
      }
      setValue('');
    },
    openFile: () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.as';
      input.onchange = async (ev: Event) => {
        const target = ev.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;
        const text = await file.text();
        const textarea = textareaRef.current;
        setValue(text);
        if (textarea) {
          addToHistory(text, 0, 0);
        }
      };
      input.click();
    },
    saveAs: () => {
      const filename = window.prompt(
        'Enter filename to save as:',
        'code-' + String(new Date().getTime()) + '.as'
      );

      if (filename === null) return;

      const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'code-' + String(new Date().getTime()) + '.as';
      document.body.appendChild(a);

      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
    getValue: () => value,
    setValue: (s: string) => {
      setValue(s);
    },
  }));

  // Render
  return (
    <>
      {/* Line Numbers */}
      <div ref={lineNumbersRef} id="editor_lines">
        {lineNumbers.map((num: string, i: number) => (
          <div
            // eslint-disable-next-line react-x/no-array-index-key
            key={i}
            style={i + 1 === currentLine ? { color: 'var(--color-text)' } : {}}
            className="cursor-default select-none"
          >
            <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
              {executionLineMapping[i] === executionLine &&
                executionLineMapping[i] !== -1 &&
                '•'}
            </span>
            <p>{num === '' ? '\u00A0' : num}</p>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', flexGrow: 1 }}>
        {/* Overlay for syntax highlighting */}
        <div
          ref={overlayRef}
          id="editor_overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            background: 'transparent',
            overflow: 'hidden',
            boxSizing: 'border-box',
            zIndex: 1,
            color: 'white',
          }}
          aria-hidden="true"
        >
          <div
            className="editor-overlay-content"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 'auto',
              whiteSpace: 'pre',
            }}
            // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
            dangerouslySetInnerHTML={{ __html: colorizedHtml }}
          />
        </div>

        {/* Textarea */}
        <textarea
          name="editor_container"
          id="editor_container"
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            background: 'transparent',
            whiteSpace: 'pre',
            overflow: 'auto',
            zIndex: 2,
            color: 'transparent',
            caretColor: 'white',
            textShadow: 'none',
            resize: 'none',
          }}
          spellCheck={false}
        />

        {/* Autocomplete Dropdown */}
        {autoComplete.isVisible && autoComplete.suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="autocomplete-dropdown"
            style={{
              position: 'absolute',
              top: `${String(autoComplete.position.top)}px`,
              left: `${String(autoComplete.position.left)}px`,
              zIndex: 1000,
            }}
          >
            {autoComplete.suggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                data-index={index}
                className={`autocomplete-item ${
                  index === autoComplete.selectedIndex ? 'selected' : ''
                }`}
                onClick={() => {
                  const textarea = textareaRef.current;
                  if (textarea) {
                    const result = confirmSelection(textarea);
                    if (result) {
                      addToHistory(
                        result.newValue,
                        result.newCursorStart,
                        result.newCursorEnd
                      );
                      setTimeout(() => {
                        textarea.selectionStart = result.newCursorStart;
                        textarea.selectionEnd = result.newCursorEnd;
                      }, 0);
                    }
                  }
                }}
                onMouseEnter={() => {
                  // Update selected index on hover
                  if (index !== autoComplete.selectedIndex) {
                    setSelectedIndex(index);
                  }
                }}
              >
                <div className="autocomplete-item-name">{suggestion}</div>
                <div className="autocomplete-item-description">
                  {autoComplete.descriptions[index]}
                </div>
                <div className="autocomplete-item-usage">
                  {autoComplete.usages[index]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Editor;
