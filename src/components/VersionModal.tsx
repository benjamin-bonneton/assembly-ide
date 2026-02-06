// React
import { useEffect } from 'react';

// Icons
import HideIcon from '@images/hide.svg';

// Data
import versionsData from '../data/versions.json';

interface VersionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PatchNote {
  features?: string[];
  changes?: string[];
  bugFixes?: string[];
}

interface Version {
  version: string;
  date: string;
  notes: PatchNote;
}

function VersionModal({ isOpen, onClose }: VersionModalProps) {
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

  const versions: Version[] = versionsData as Version[];

  const getSectionColor = (type: 'features' | 'changes' | 'bugFixes') => {
    switch (type) {
      case 'features':
        return 'var(--syntax-control)';
      case 'changes':
        return 'var(--syntax-memory)';
      case 'bugFixes':
        return 'var(--syntax-operations)';
      default:
        return 'var(--color-text)';
    }
  };

  const getSectionTitle = (type: 'features' | 'changes' | 'bugFixes') => {
    switch (type) {
      case 'features':
        return 'Features';
      case 'changes':
        return 'Changes';
      case 'bugFixes':
        return 'Bug Fixes';
      default:
        return '';
    }
  };

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
              Version History
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

          {/* Version List */}
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
              {versions.map((version) => (
                <div
                  key={version.version}
                  style={{
                    backgroundColor: 'var(--color-background-panels)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                  }}
                >
                  {/* Version Header */}
                  <div
                    style={{
                      marginBottom: '16px',
                      borderBottom: '1px solid var(--color-border)',
                      paddingBottom: '12px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        margin: 0,
                        marginBottom: '4px',
                        color: 'var(--color-primary)',
                      }}
                    >
                      Version {version.version}
                    </h3>
                    <p
                      style={{
                        fontSize: '13px',
                        margin: 0,
                        color: 'var(--color-text)',
                        opacity: 0.7,
                      }}
                    >
                      {version.date}
                    </p>
                  </div>

                  {/* Patch Notes Sections */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {/* Features */}
                    {version.notes.features &&
                      version.notes.features.length > 0 && (
                        <div>
                          <h4
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              margin: 0,
                              marginBottom: '8px',
                              color: getSectionColor('features'),
                            }}
                          >
                            {getSectionTitle('features')}
                          </h4>
                          <ul
                            style={{
                              margin: 0,
                              paddingLeft: '20px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              listStyleType: 'disc',
                            }}
                          >
                            {version.notes.features.map((feature) => (
                              <li
                                key={feature}
                                style={{
                                  color: 'var(--color-text)',
                                  fontSize: '14px',
                                  lineHeight: '1.5',
                                  display: 'list-item',
                                }}
                              >
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {/* Changes */}
                    {version.notes.changes &&
                      version.notes.changes.length > 0 && (
                        <div>
                          <h4
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              margin: 0,
                              marginBottom: '8px',
                              color: getSectionColor('changes'),
                            }}
                          >
                            {getSectionTitle('changes')}
                          </h4>
                          <ul
                            style={{
                              margin: 0,
                              paddingLeft: '20px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              listStyleType: 'disc',
                            }}
                          >
                            {version.notes.changes.map((change) => (
                              <li
                                key={change}
                                style={{
                                  color: 'var(--color-text)',
                                  fontSize: '14px',
                                  lineHeight: '1.5',
                                  display: 'list-item',
                                }}
                              >
                                {change}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {/* Bug Fixes */}
                    {version.notes.bugFixes &&
                      version.notes.bugFixes.length > 0 && (
                        <div>
                          <h4
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              margin: 0,
                              marginBottom: '8px',
                              color: getSectionColor('bugFixes'),
                            }}
                          >
                            {getSectionTitle('bugFixes')}
                          </h4>
                          <ul
                            style={{
                              margin: 0,
                              paddingLeft: '20px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              listStyleType: 'disc',
                            }}
                          >
                            {version.notes.bugFixes.map((fix) => (
                              <li
                                key={fix}
                                style={{
                                  color: 'var(--color-text)',
                                  fontSize: '14px',
                                  lineHeight: '1.5',
                                  display: 'list-item',
                                }}
                              >
                                {fix}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
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

export default VersionModal;
