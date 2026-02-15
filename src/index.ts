export { Editor } from './core/editor.js'
export type { EditorOptions, EditorOutput } from './core/types.js'
export { EditorPane } from './view/editor-pane.js'
export { PreviewPane } from './view/preview-pane.js'
export { TwoPanelLayout } from './view/two-panel-layout.js'
export { parseMarkdownToHTML } from './parser/markdown.js'
export { highlightMarkdown } from './highlight/markdown.js'

import { Editor } from './core/editor.js'

export function createEditor(options: { container: HTMLElement; content?: string }): Editor {
  return new Editor(options)
}
// test
