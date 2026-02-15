import {marked} from 'marked';
import {markedHighlight} from 'marked-highlight';

marked.use({
  gfm: true,
  breaks: true
});

export interface PrismInstance {
  languages?: Record<string, unknown>;
  highlight?(code: string, grammar: unknown, language: string): string;
}

const configuredPrisms = new WeakSet<PrismInstance>();

function configureHighlightExtension(prism: PrismInstance): void {
  if (configuredPrisms.has(prism)) {
    return;
  }

  marked.use(markedHighlight({
    langPrefix: 'language-',
    highlight(code, lang) {
      if (prism.highlight) {
        try {
          const prismLang = prism.languages?.[lang];
          return prism.highlight(code, prismLang, lang);
        } catch {
          return code;
        }
      }
      return code;
    }
  }));

  configuredPrisms.add(prism);
}

export function parseMarkdownToHTML(markdown: string, prism?: PrismInstance): string {
  if (!markdown.trim()) return '';

  if (prism) {
    configureHighlightExtension(prism);
  }

  const result = marked(markdown);
  if (typeof result === 'string') {
    return result;
  }
  return '';
}
