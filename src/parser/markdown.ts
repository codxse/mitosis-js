import {marked} from 'marked';

marked.use({
  gfm: true,
  breaks: true
});

export function parseMarkdownToHTML(markdown: string): string {
  if (!markdown.trim()) return '';
  const result = marked(markdown);
  if (typeof result === 'string') {
    return result;
  }
  return '';
}
