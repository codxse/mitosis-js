import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { EditorPane } from '../src/view/editor-pane'

describe('Keyboard Shortcuts', () => {
  let container: HTMLElement
  let editorPane: EditorPane
  let updateCalls: string[]

  beforeEach(() => {
    container = document.createElement('div')
    updateCalls = []
    editorPane = new EditorPane({
      container,
      onUpdate: (content) => updateCalls.push(content),
    })
  })

  afterEach(() => {
    editorPane.destroy()
    container.remove()
  })

  describe('Bold shortcut (Cmd/Ctrl+B)', () => {
    it('should wrap selection with ** on Cmd+B (Mac)', () => {
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      textarea.value = 'hello world'
      textarea.selectionStart = 0
      textarea.selectionEnd = 5

      const event = new KeyboardEvent('keydown', {
        key: 'b',
        metaKey: true,
        ctrlKey: false,
        bubbles: true,
      })

      textarea.dispatchEvent(event)

      expect(textarea.value).toBe('**hello** world')
    })

    it('should wrap selection with ** on Ctrl+B (Windows/Linux)', () => {
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      textarea.value = 'hello world'
      textarea.selectionStart = 0
      textarea.selectionEnd = 5

      const event = new KeyboardEvent('keydown', {
        key: 'b',
        metaKey: false,
        ctrlKey: true,
        bubbles: true,
      })

      textarea.dispatchEvent(event)

      expect(textarea.value).toBe('**hello** world')
    })
  })

  describe('Italic shortcut (Cmd/Ctrl+I)', () => {
    it('should wrap selection with * on Cmd+I (Mac)', () => {
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      textarea.value = 'hello world'
      textarea.selectionStart = 0
      textarea.selectionEnd = 5

      const event = new KeyboardEvent('keydown', {
        key: 'i',
        metaKey: true,
        ctrlKey: false,
        bubbles: true,
      })

      textarea.dispatchEvent(event)

      expect(textarea.value).toBe('*hello* world')
    })

    it('should wrap selection with * on Ctrl+I (Windows/Linux)', () => {
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      textarea.value = 'hello world'
      textarea.selectionStart = 0
      textarea.selectionEnd = 5

      const event = new KeyboardEvent('keydown', {
        key: 'i',
        metaKey: false,
        ctrlKey: true,
        bubbles: true,
      })

      textarea.dispatchEvent(event)

      expect(textarea.value).toBe('*hello* world')
    })
  })

  describe('Link shortcut (Cmd/Ctrl+K)', () => {
    it('should insert link syntax on Cmd+K (Mac)', () => {
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      textarea.value = 'hello world'
      textarea.selectionStart = 0
      textarea.selectionEnd = 5

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        ctrlKey: false,
        bubbles: true,
      })

      textarea.dispatchEvent(event)

      expect(textarea.value).toBe('[hello](url) world')
    })

    it('should insert link syntax on Ctrl+K (Windows/Linux)', () => {
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      textarea.value = 'hello world'
      textarea.selectionStart = 0
      textarea.selectionEnd = 5

      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: false,
        ctrlKey: true,
        bubbles: true,
      })

      textarea.dispatchEvent(event)

      expect(textarea.value).toBe('[hello](url) world')
    })
  })

  describe('Inline code shortcut (Cmd/Ctrl+E)', () => {
    it('should wrap selection with backticks on Cmd+E (Mac)', () => {
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      textarea.value = 'hello world'
      textarea.selectionStart = 0
      textarea.selectionEnd = 5

      const event = new KeyboardEvent('keydown', {
        key: 'e',
        metaKey: true,
        ctrlKey: false,
        bubbles: true,
      })

      textarea.dispatchEvent(event)

      expect(textarea.value).toBe('`hello` world')
    })

    it('should wrap selection with backticks on Ctrl+E (Windows/Linux)', () => {
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      textarea.value = 'hello world'
      textarea.selectionStart = 0
      textarea.selectionEnd = 5

      const event = new KeyboardEvent('keydown', {
        key: 'e',
        metaKey: false,
        ctrlKey: true,
        bubbles: true,
      })

      textarea.dispatchEvent(event)

      expect(textarea.value).toBe('`hello` world')
    })
  })

  describe('Strikethrough shortcut (Cmd/Ctrl+Shift+S)', () => {
    it('should wrap selection with ~~ on Cmd+Shift+S (Mac)', () => {
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      textarea.value = 'hello world'
      textarea.selectionStart = 0
      textarea.selectionEnd = 5

      const event = new KeyboardEvent('keydown', {
        key: 's',
        metaKey: true,
        ctrlKey: false,
        shiftKey: true,
        bubbles: true,
      })

      textarea.dispatchEvent(event)

      expect(textarea.value).toBe('~~hello~~ world')
    })

    it('should wrap selection with ~~ on Ctrl+Shift+S (Windows/Linux)', () => {
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      textarea.value = 'hello world'
      textarea.selectionStart = 0
      textarea.selectionEnd = 5

      const event = new KeyboardEvent('keydown', {
        key: 's',
        metaKey: false,
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
      })

      textarea.dispatchEvent(event)

      expect(textarea.value).toBe('~~hello~~ world')
    })
  })

  describe('Tab handling', () => {
    it('should insert 2 spaces on Tab', () => {
      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
      textarea.value = 'hello'
      textarea.selectionStart = 5
      textarea.selectionEnd = 5

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      })

      textarea.dispatchEvent(event)

      expect(textarea.value).toBe('hello  ')
    })
  })
})
