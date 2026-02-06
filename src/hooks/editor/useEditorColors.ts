import { useCallback } from 'react';
import { functions } from '../../types/functions';
import { conditions } from '../../types/conditions';
import { categories } from '../../types/categories';

// Build keywords structure from functions and categories
const buildKeywords = () => {
  type CategoryKey = keyof typeof categories;

  const keywords = {} as Record<
    CategoryKey,
    { items: string[]; color: string }
  >;

  // Initialize all categories
  Object.entries(categories).forEach(([key, category]) => {
    keywords[key] = {
      items: [],
      color: category.color,
    };
  });

  // Populate keywords from functions
  Object.entries(functions).forEach(([functionName, functionData]) => {
    const category = functionData.category;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (keywords[category]) {
      keywords[category].items.push(functionName);
    }
  });

  // Populate keywords from conditions
  Object.entries(conditions).forEach(([conditionName, conditionData]) => {
    const category = conditionData.category;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (category && keywords[category]) {
      keywords[category].items.push(conditionName);
    }
  });

  // Add register pattern to register category
  keywords.register.items.push('r0');

  // Add comment syntax
  keywords.comment.items.push('//', ';');

  return keywords;
};

const keywords = buildKeywords();

// Escape HTML special characters to prevent XSS in the overlay
function escapeHtml(text: string) {
  return text.replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[c] ?? ''
  );
}

// Colorize the input text for syntax highlighting.
function colorize(text: string) {
  // First, escape HTML to prevent XSS
  let html = escapeHtml(text);

  // Highlight comments: everything after // or ; on each line
  html = html.replace(
    /(\/\/.*|;.*)$/gm,
    (match) =>
      `<span style="color:${keywords.comment.color}; font-style:italic">${match}</span>`
  );

  // Highlight all other keywords, but skip already highlighted comments
  Object.entries(keywords).forEach(([cat, { items, color }]) => {
    if (cat === 'comment' || !items.length) return;

    // Build regex for keywords (special handling for registers)
    const regex = new RegExp(
      items
        .map((kw) => {
          if (kw === 'r0') {
            return '\\br\\d+\\b';
          } else {
            return `\\b${kw}\\b`;
          }
        })
        .join('|'),
      'g'
    );

    // Replace only outside of comment spans
    html = html.replace(
      /(<span style="color:[^>]+; font-style:italic">.*?<\/span>)|([^<]+)/g,
      (m: string, commentSpan: string, nonComment: string) => {
        if (commentSpan) return commentSpan;

        if (nonComment) {
          return nonComment.replace(
            regex,
            (match: string) =>
              `<span style="color:${color};text-shadow: 0.05em 0 ${color};">${match}</span>`
          );
        }

        return m;
      }
    );
  });

  return html;
}

// React hook for syntax highlighting
function useEditorColors(value: string) {
  const getColorizedHtml = useCallback(() => colorize(value), [value]);
  return getColorizedHtml();
}

export default useEditorColors;
