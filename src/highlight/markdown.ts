export type HighlightMarkdownFn = (text: string) => string

export function highlightMarkdown(text: string): string {
  return escapeHtml(text)
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function getHighlightStyles(): string {
  return ''
}
