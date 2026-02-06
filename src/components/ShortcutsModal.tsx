// React
import { useEffect } from 'react';

// Icons
import HideIcon from '@images/hide.svg';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Edit',
      items: [
        { keys: 'Tab', description: 'Indent' },
        { keys: 'Shift + Tab', description: 'Outdent' },
        { keys: 'Ctrl + Y / Ctrl + Shift + Z', description: 'Redo' },
        { keys: 'Ctrl + Z', description: 'Undo' },
      ],
    },
    {
      category: 'Execution',
      items: [
        { keys: 'Ctrl + Enter', description: 'Run the program' },
        {
          keys: 'Ctrl + Maj + Enter',
          description: 'Step to the next execution stage',
        },
      ],
    },
    {
      category: 'File',
      items: [
        { keys: 'Ctrl + O', description: 'Open a file' },
        { keys: 'Ctrl + W', description: 'Close the current tab or file' },
        { keys: 'Ctrl + S', description: 'Save the current file' },
      ],
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          style={{
            backgroundColor: 'var(--color-background)',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid var(--color-border)',
              padding: '12px 24px',
              flexShrink: 0,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'var(--color-text)',
              }}
            >
              Shortcuts
            </h2>
            <img
              src={HideIcon}
              alt="Hide"
              onClick={onClose}
              width="32px"
              height="32px"
              title="Close (Esc)"
              style={{
                cursor: 'pointer',
                userSelect: 'none',
                filter: 'invert(100%)',
              }}
            />
          </div>

          {/* Shortcuts List */}
          <div
            style={{
              overflow: 'auto',
              flex: 1,
              padding: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              {shortcuts.map((section) => (
                <div
                  key={section.category}
                  style={{
                    backgroundColor: 'var(--color-background-panels)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginBottom: '12px',
                      color: 'var(--color-white)',
                    }}
                  >
                    {section.category}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {section.items.map((item) => (
                      <div
                        key={item.description}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          backgroundColor: 'var(--color-surface)',
                          borderRadius: '4px',
                          gap: '16px',
                        }}
                      >
                        <span
                          style={{
                            color: 'var(--color-text)',
                            flex: 1,
                          }}
                        >
                          {item.description}
                        </span>
                        <kbd
                          style={{
                            backgroundColor: 'var(--color-background)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '13px',
                            fontFamily: 'monospace',
                            color: 'var(--color-text)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.keys}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShortcutsModal;
