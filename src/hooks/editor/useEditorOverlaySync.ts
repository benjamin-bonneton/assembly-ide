import { useEffect, type RefObject } from "react";

function useEditorOverlaySync(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  overlayRef: RefObject<HTMLDivElement | null>,
  value: string
) {
  useEffect(() => {
    const textarea = textareaRef.current;
    const overlay = overlayRef.current;
    if (!textarea || !overlay) return;

    // Sync scroll
    const syncScroll = () => {
      overlay.scrollTop = textarea.scrollTop;
      overlay.scrollLeft = textarea.scrollLeft;
    };
    textarea.addEventListener("scroll", syncScroll);

    // Sync font
    const style = window.getComputedStyle(textarea);
    overlay.style.font = style.font;
    overlay.style.fontSize = style.fontSize;
    overlay.style.fontFamily = style.fontFamily;
    overlay.style.lineHeight = style.lineHeight;
    overlay.style.padding = style.padding;
    overlay.style.textAlign = style.textAlign;
    overlay.style.letterSpacing = style.letterSpacing;

    return () => {
      textarea.removeEventListener("scroll", syncScroll);
    };
  }, [textareaRef, overlayRef, value]);
}

export default useEditorOverlaySync;
