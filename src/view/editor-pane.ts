import { highlightMarkdown } from '../highlight/markdown.js'

interface Shortcut {
  key: string
  shiftKey?: boolean
  syntax: { prefix: string; suffix: string } | string
  cursorOffset?: number
}

const FIGURE_TEMPLATE = '<figure>\n  <img src="" alt="">\n  <figcaption></figcaption>\n</figure>'

const SHORTCUTS: Shortcut[] = [
  { key: 'b', syntax: { prefix: '**', suffix: '**' } },
  { key: 'i', syntax: { prefix: '*', suffix: '*' } },
  { key: 'k', syntax: { prefix: '[', suffix: '](url)' } },
  { key: 'e', syntax: { prefix: '`', suffix: '`' } },
  { key: 's', shiftKey: true, syntax: { prefix: '~~', suffix: '~~' } },
  { key: 'm', syntax: FIGURE_TEMPLATE, cursorOffset: 21 },
]

export class EditorPane {
  private textarea: HTMLTextAreaElement
  private highlightOverlay: HTMLDivElement
  private container: HTMLDivElement
  private onUpdate: (content: string) => void
  private onScroll: (ratio: number) => void

  constructor(config: {
    container: HTMLElement
    onUpdate?: (content: string) => void
    onScroll?: (ratio: number) => void
  }) {
    this.onUpdate = config.onUpdate ?? (() => {})
    this.onScroll = config.onScroll ?? (() => {})

    this.container = document.createElement('div')
    this.container.className = 'mitosis-editor-container'

    this.textarea = document.createElement('textarea')
    this.textarea.className = 'mitosis-textarea'
    this.textarea.placeholder = 'Write markdown here...'

    this.highlightOverlay = document.createElement('div')
    this.highlightOverlay.className = 'mitosis-highlight'

    this.textarea.addEventListener('input', () => this.handleInput())
    this.textarea.addEventListener('scroll', () => this.handleScroll())
    this.textarea.addEventListener('keydown', (e) => this.handleKeyDown(e))

    this.container.appendChild(this.highlightOverlay)
    this.container.appendChild(this.textarea)
    config.container.appendChild(this.container)
  }

  private handleInput(): void {
    const content = this.textarea.value
    this.highlightOverlay.innerHTML = highlightMarkdown(content) + '\n'
    this.onUpdate(content)
  }

  private handleScroll(): void {
    const { scrollTop, scrollHeight, clientHeight } = this.textarea
    this.highlightOverlay.scrollTop = scrollTop
    const maxScroll = scrollHeight - clientHeight
    this.onScroll(maxScroll > 0 ? scrollTop / maxScroll : 0)
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Tab') {
      e.preventDefault()
      this.insertText('  ')
      return
    }

    for (const shortcut of SHORTCUTS) {
      if (
        e.key === shortcut.key &&
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey === (shortcut.shiftKey ?? false)
      ) {
        e.preventDefault()

        if (typeof shortcut.syntax === 'string') {
          this.insertText(shortcut.syntax, shortcut.cursorOffset)
        } else {
          this.wrapSelection(shortcut.syntax.prefix, shortcut.syntax.suffix)
        }
        return
      }
    }
  }

  private insertText(text: string, cursorOffset?: number): void {
    const start = this.textarea.selectionStart
    const end = this.textarea.selectionEnd
    const value = this.textarea.value

    this.textarea.value = value.substring(0, start) + text + value.substring(end)
    const cursor = cursorOffset !== undefined ? start + cursorOffset : start + text.length
    this.textarea.selectionStart = this.textarea.selectionEnd = cursor
    this.textarea.focus()
    this.handleInput()
  }

  private wrapSelection(prefix: string, suffix: string): void {
    const start = this.textarea.selectionStart
    const end = this.textarea.selectionEnd
    const value = this.textarea.value
    const selectedText = value.substring(start, end)

    const newText = prefix + selectedText + suffix
    this.textarea.value = value.substring(0, start) + newText + value.substring(end)

    this.setCursorAfterWrap(selectedText, start, prefix, newText)
    this.textarea.focus()
    this.handleInput()
  }

  private setCursorAfterWrap(
    selectedText: string,
    start: number,
    prefix: string,
    newText: string
  ): void {
    if (selectedText.length === 0) {
      this.textarea.selectionStart = this.textarea.selectionEnd = start + prefix.length
    } else {
      this.textarea.selectionStart = start
      this.textarea.selectionEnd = start + newText.length
    }
  }

  setContent(content: string): void {
    this.textarea.value = content
    this.handleInput()
  }

  getContent(): string {
    return this.textarea.value
  }

  destroy(): void {
    this.textarea.removeEventListener('input', () => this.handleInput())
    this.textarea.removeEventListener('scroll', () => this.handleScroll())
    this.textarea.removeEventListener('keydown', (e) => this.handleKeyDown(e))
    this.container.remove()
  }
}
