// Providers
import { useAssembleur } from '@providers/assembleur/useAssembleur';

// Components
import Editor, { type EditorHandle } from '@components/Editor';
import NavBar from '@components/NavBar';
import { useEffect, useRef, useState } from 'react';

// Hooks
import useAssembleurEngine from '@hooks/useAssembleurEngine';

// Styles
import '@styles/Editor.css';

// Icons
import HideIcon from '@images/hide.svg';

function EditorPanel() {
  // Assembleur Provider
  const { assembleur, setAssembleur } = useAssembleur();

  // Assembleur Engine
  const { startProgram } = useAssembleurEngine();

  // Editor State
  const editorRef = useRef<EditorHandle | null>(null);
  const [editorValue, setEditorValue] = useState('');

  // Handlers for shortcuts
  const handleExecute = () => {
    startProgram(-1);
  };

  const handleStep = () => {
    if (assembleur.stepLimit < 0) {
      startProgram(1);
    } else {
      startProgram(assembleur.stepLimit + 1);
    }
  };

  // Sync editor value with assembleur code
  useEffect(() => {
    setAssembleur((prev) => ({
      ...prev,
      code: editorValue,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorValue]);

  return (
    <main>
      {/* Navigation Bar */}
      <NavBar
        onUndo={() => editorRef.current?.undo()}
        onRedo={() => editorRef.current?.redo()}
        onNew={() => editorRef.current?.newFile()}
        onOpen={() => editorRef.current?.openFile()}
        onSaveAs={() => editorRef.current?.saveAs()}
      />

      {/* Editor Container */}
      <div className="container">
        <Editor
          editorRef={editorRef}
          value={editorValue}
          setValue={setEditorValue}
          executionLine={assembleur.programCounter}
          onExecute={handleExecute}
          onStep={handleStep}
        />
      </div>

      {/* Error */}
      {assembleur.error && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-red-400 border-red-900 rounded-md border-3 w-fit max-w-200 z-50 px-10 py-2 shadow">
          <span className="whitespace-pre-wrap text-sm">
            {assembleur.error}
          </span>
          <img
            src={HideIcon}
            alt="Hide error"
            className="absolute top-0 right-0 inline-block ml-2 cursor-pointer w-6 h-6"
            onClick={() => {
              setAssembleur((prev) => ({
                ...prev,
                error: null,
              }));
            }}
          />
        </div>
      )}
    </main>
  );
}

export default EditorPanel;
