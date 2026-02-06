// React
import { useEffect } from 'react';

// Icons
import HideIcon from '@images/hide.svg';

// Types
import { functions } from '../types/functions';
import { conditions } from '../types/conditions';
import { categories } from '../types/categories';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  // Close on Escape
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

  // Group functions by category
  const groupedInstructions: Record<
    string,
    { name: string; description: string; usage: string }[]
  > = {};

  // Add functions
  Object.entries(functions).forEach(([name, func]) => {
    const categoryKey = func.category || 'uncategorized';

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!groupedInstructions[categoryKey]) {
      groupedInstructions[categoryKey] = [];
    }
    groupedInstructions[categoryKey].push({
      name,
      description: func.description,
      usage: func.usage,
    });
  });

  // Add conditions
  Object.entries(conditions).forEach(([name, cond]) => {
    const categoryKey = cond.category || 'condition';

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!groupedInstructions[categoryKey]) {
      groupedInstructions[categoryKey] = [];
    }
    groupedInstructions[categoryKey].push({
      name,
      description: cond.description,
      usage: name,
    });
  });

  // Sort items alphabetically within each category
  Object.keys(groupedInstructions).forEach((categoryKey) => {
    groupedInstructions[categoryKey].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  });

  // Sort categories alphabetically by category name
  const sortedCategories = Object.keys(groupedInstructions).sort((a, b) => {
    const nameA = categories[a].name || a;
    const nameB = categories[b].name || b;
    return nameA.localeCompare(nameB);
  });

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
            maxWidth: '800px',
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
              Instructions
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

          {/* Instructions List */}
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
              {sortedCategories.map((categoryKey) => {
                const category = categories[categoryKey];
                const items = groupedInstructions[categoryKey];

                return (
                  <div
                    key={categoryKey}
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
                        color: category.color,
                      }}
                    >
                      {category.name}
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {items.map((item) => (
                        <div
                          key={item.name}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '12px',
                            backgroundColor: 'var(--color-surface)',
                            borderRadius: '4px',
                            gap: '6px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '16px',
                            }}
                          >
                            <span
                              style={{
                                color: 'var(--color-text)',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              {item.name}
                            </span>
                            <code
                              style={{
                                backgroundColor: 'var(--color-background)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                color: category.color,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.usage}
                            </code>
                          </div>
                          <span
                            style={{
                              color: 'var(--color-text)',
                              fontSize: '13px',
                              opacity: 0.9,
                            }}
                          >
                            {item.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InstructionsModal;
