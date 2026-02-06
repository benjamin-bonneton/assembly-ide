import { useEffect, type RefObject } from 'react';

function useEditorOverlaySync(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  overlayRef: RefObject<HTMLDivElement | null>,
  value: string
) {
  useEffect(() => {
    const textarea = textareaRef.current;
    const overlay = overlayRef.current;
    if (!textarea || !overlay) return;

    const content = overlay.querySelector('.editor-overlay-content');

    // Apply computed styles to overlay and inner content to keep metrics identical
    const applyComputedStyles = () => {
      const style = window.getComputedStyle(textarea);

      const props: (keyof CSSStyleDeclaration)[] = [
        'font',
        'fontSize',
        'fontFamily',
        'lineHeight',
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
        'textAlign',
        'letterSpacing',
        'boxSizing',
      ];

      props.forEach((p) => {
        const val = style[p];
        if (val) {
          overlay.style[p] = val as string;
          if (content) (content as HTMLElement).style[p] = val as string;
        }
      });

      // Ensure content has pre whitespace and absolute positioning inside overlay
      if (content) {
        const contentEl = content as HTMLElement;
        contentEl.style.whiteSpace = 'pre';
        contentEl.style.position = 'absolute';
        contentEl.style.top = '0px';
        contentEl.style.left = '0px';
        contentEl.style.willChange = 'transform';
        contentEl.style.transformOrigin = '0 0';

        // Prevent any wrapping or width differences
        contentEl.style.minWidth = `${String(textarea.scrollWidth)}px`;

        // Initialize transform to avoid jump
        contentEl.style.transform = 'translate3d(0px, 0px, 0px)';
      }

      // copy tab size if available
      const tabSize = style.getPropertyValue('tab-size');
      if (tabSize) {
        overlay.style.setProperty('tab-size', tabSize);
        if (content) (content as HTMLElement).style.setProperty('tab-size', tabSize);
      }
    };

    applyComputedStyles();

    // Update sizing and force a sync of transform
    const updateSizing = () => {
      if (content) {
        const contentEl = content as HTMLElement;
        contentEl.style.minHeight = `${String(textarea.scrollHeight)}px`;
        contentEl.style.minWidth = `${String(textarea.scrollWidth)}px`;
      }

      applyComputedStyles();
      syncScroll();
    };

    const syncScroll = () => {
      try {
        const top = textarea.scrollTop;
        const left = textarea.scrollLeft;

        if (content) {
          (content as HTMLElement).style.transform = `translate3d(${String(-left)}px, ${String(-top)}px, 0px)`;
        } else {
          overlay.scrollTop = top;
          overlay.scrollLeft = left;
        }
      } catch {
        overlay.scrollTop = textarea.scrollTop;
        overlay.scrollLeft = textarea.scrollLeft;
      }
    };
    textarea.addEventListener('scroll', syncScroll);

    // Update when content changes
    textarea.addEventListener('input', updateSizing);
    window.addEventListener('resize', updateSizing);
    updateSizing();

    // Cleanup
    return () => {
      textarea.removeEventListener('scroll', syncScroll);
      textarea.removeEventListener('input', updateSizing);
      window.removeEventListener('resize', updateSizing);
    };
  }, [textareaRef, overlayRef, value]);
}

export default useEditorOverlaySync;
