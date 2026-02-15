import {marked} from 'marked';
import {markedHighlight} from 'marked-highlight';

marked.use({
  gfm: true,
  breaks: true
});

export function parseMarkdownToHTML(markdown: string, prism?: object): string {
  if (!markdown.trim()) return '';

  if (prism) {
    marked.use(markedHighlight({
      langPrefix: 'language-',
      highlight(code, lang) {
        if ((prism as any).highlight) {
          try {
            const prismLang = (prism as any).languages?.[lang];
            return (prism as any).highlight(code, prismLang, lang);
          } catch {
            return code;
          }
        }
        return code;
      }
    }));
  }

  const result = marked(markdown);
  if (typeof result === 'string') {
    return result;
  }
  return '';
}
