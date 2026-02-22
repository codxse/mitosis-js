import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { EditorPane } from '../src/view/editor-pane'

const FIGURE_TEMPLATE = '<figure>\n  <img src="" alt="">\n  <figcaption></figcaption>\n</figure>'
const CURSOR_INSIDE_SRC = 21 // position of the cursor inside src=""

describe('Media shortcut (Cmd/Ctrl+M)', () => {
  let container: HTMLElement
  let editorPane: EditorPane

  beforeEach(() => {
    container = document.createElement('div')
    editorPane = new EditorPane({ container })
  })

  afterEach(() => {
    editorPane.destroy()
    container.remove()
  })

  function pressCtrlM(textarea: HTMLTextAreaElement) {
    textarea.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'm', ctrlKey: true, bubbles: true })
    )
  }

  it('inserts figure template at cursor position', () => {
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    textarea.value = ''
    textarea.selectionStart = textarea.selectionEnd = 0

    pressCtrlM(textarea)

    expect(textarea.value).toBe(FIGURE_TEMPLATE)
  })

  it('places cursor inside src="" after insert', () => {
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    textarea.value = ''
    textarea.selectionStart = textarea.selectionEnd = 0

    pressCtrlM(textarea)

    expect(textarea.selectionStart).toBe(CURSOR_INSIDE_SRC)
    expect(textarea.selectionEnd).toBe(CURSOR_INSIDE_SRC)
  })

  it('inserts figure template in the middle of existing content', () => {
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    textarea.value = 'before after'
    textarea.selectionStart = textarea.selectionEnd = 7 // between "before " and "after"

    pressCtrlM(textarea)

    expect(textarea.value).toBe('before ' + FIGURE_TEMPLATE + 'after')
    expect(textarea.selectionStart).toBe(7 + CURSOR_INSIDE_SRC)
  })

  it('inserts figure template at end of document', () => {
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    textarea.value = 'existing content'
    textarea.selectionStart = textarea.selectionEnd = 16

    pressCtrlM(textarea)

    expect(textarea.value).toBe('existing content' + FIGURE_TEMPLATE)
    expect(textarea.selectionStart).toBe(16 + CURSOR_INSIDE_SRC)
  })

  it('does not conflict with other shortcuts', () => {
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    textarea.value = 'hello'
    textarea.selectionStart = 0
    textarea.selectionEnd = 5

    textarea.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'b', ctrlKey: true, bubbles: true })
    )

    expect(textarea.value).toBe('**hello**')
  })
})
