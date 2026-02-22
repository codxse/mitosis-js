import { describe, it, expect, afterEach } from 'vitest'
import { EditorPane } from '../src/view/editor-pane'
import { PreviewPane } from '../src/view/preview-pane'
import { TwoPanelLayout } from '../src/view/two-panel-layout'

function mockScrollable(element: HTMLElement, scrollHeight: number, clientHeight: number) {
  let _scrollTop = 0
  Object.defineProperty(element, 'scrollHeight', { value: scrollHeight, configurable: true })
  Object.defineProperty(element, 'clientHeight', { value: clientHeight, configurable: true })
  Object.defineProperty(element, 'scrollTop', {
    get: () => _scrollTop,
    set: (v: number) => { _scrollTop = v },
    configurable: true,
  })
  return { setScrollTop: (v: number) => { _scrollTop = v } }
}

describe('EditorPane scroll ratio', () => {
  let container: HTMLElement
  let editorPane: EditorPane

  afterEach(() => {
    editorPane.destroy()
    container.remove()
  })

  it('sends 0-1 ratio on scroll', () => {
    let receivedRatio: number | null = null
    container = document.createElement('div')
    editorPane = new EditorPane({
      container,
      onScroll: (ratio) => { receivedRatio = ratio },
    })

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    const mock = mockScrollable(textarea, 1000, 200) // maxScroll = 800
    mock.setScrollTop(400) // ratio = 400/800 = 0.5
    textarea.dispatchEvent(new Event('scroll'))

    expect(receivedRatio).toBeCloseTo(0.5)
  })

  it('sends 0 when content fits without scrollbar', () => {
    let receivedRatio: number | null = null
    container = document.createElement('div')
    editorPane = new EditorPane({
      container,
      onScroll: (ratio) => { receivedRatio = ratio },
    })

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    mockScrollable(textarea, 200, 200) // maxScroll = 0
    textarea.dispatchEvent(new Event('scroll'))

    expect(receivedRatio).toBe(0)
  })
})

describe('PreviewPane scroll ratio', () => {
  let container: HTMLElement
  let previewPane: PreviewPane

  afterEach(() => {
    previewPane.destroy()
    container.remove()
  })

  it('sends 0-1 ratio on scroll', () => {
    let receivedRatio: number | null = null
    container = document.createElement('div')
    previewPane = new PreviewPane({
      container,
      onScroll: (ratio) => { receivedRatio = ratio },
    })

    const content = container.querySelector('.mitosis-preview-content') as HTMLDivElement
    const mock = mockScrollable(content, 2000, 300) // maxScroll = 1700
    mock.setScrollTop(850) // ratio = 850/1700 = 0.5
    content.dispatchEvent(new Event('scroll'))

    expect(receivedRatio).toBeCloseTo(0.5)
  })

  it('sends 0 when content fits without scrollbar', () => {
    let receivedRatio: number | null = null
    container = document.createElement('div')
    previewPane = new PreviewPane({
      container,
      onScroll: (ratio) => { receivedRatio = ratio },
    })

    const content = container.querySelector('.mitosis-preview-content') as HTMLDivElement
    mockScrollable(content, 300, 300) // maxScroll = 0
    content.dispatchEvent(new Event('scroll'))

    expect(receivedRatio).toBe(0)
  })
})

describe('TwoPanelLayout scroll sync', () => {
  let container: HTMLElement
  let layout: TwoPanelLayout
  let textarea: HTMLTextAreaElement
  let previewContent: HTMLDivElement

  function setup() {
    container = document.createElement('div')
    layout = new TwoPanelLayout({ container })
    textarea = container.querySelector('.mitosis-textarea') as HTMLTextAreaElement
    previewContent = container.querySelector('.mitosis-preview-content') as HTMLDivElement
    return {
      editor: mockScrollable(textarea, 1000, 200),    // maxScroll = 800
      preview: mockScrollable(previewContent, 2000, 300), // maxScroll = 1700
    }
  }

  afterEach(() => {
    layout.destroy()
    container.remove()
  })

  it('editor scroll moves preview by delta from current position', () => {
    const { editor, preview } = setup()

    // Preview manually scrolled to 70%
    preview.setScrollTop(1190) // 1700 * 0.7
    previewContent.dispatchEvent(new Event('scroll'))

    // Editor scrolls from 0% to 12.5%
    editor.setScrollTop(100) // 100/800 = 0.125
    textarea.dispatchEvent(new Event('scroll'))

    // Preview: 70% + 12.5% = 82.5% → 1700 * 0.825 = 1402.5
    expect(previewContent.scrollTop).toBeCloseTo(1402.5, 0)
  })

  it('multiple editor scrolls accumulate deltas', () => {
    const { editor } = setup()

    // Editor scrolls 0% → 25%
    editor.setScrollTop(200) // 200/800 = 0.25
    textarea.dispatchEvent(new Event('scroll'))
    expect(previewContent.scrollTop).toBeCloseTo(1700 * 0.25, 0) // 425

    // Editor scrolls 25% → 50%
    editor.setScrollTop(400) // 400/800 = 0.5
    textarea.dispatchEvent(new Event('scroll'))
    expect(previewContent.scrollTop).toBeCloseTo(1700 * 0.5, 0) // 850
  })

  it('clamps preview ratio to 0-1 range', () => {
    const { editor, preview } = setup()

    // Preview at 90%
    preview.setScrollTop(1530) // 1700 * 0.9
    previewContent.dispatchEvent(new Event('scroll'))

    // Editor scrolls 0% → 50% (delta 0.5, total would be 1.4)
    editor.setScrollTop(400)
    textarea.dispatchEvent(new Event('scroll'))

    // Should clamp to 100% → 1700
    expect(previewContent.scrollTop).toBeCloseTo(1700, 0)
  })

  it('typing preserves preview scroll position', () => {
    const { preview } = setup()

    // Preview manually scrolled to 60%
    preview.setScrollTop(1020) // 1700 * 0.6
    previewContent.dispatchEvent(new Event('scroll'))

    // User types — simulate by changing textarea value and dispatching input
    textarea.value = '# Hello\n\nSome new content'
    textarea.dispatchEvent(new Event('input', { bubbles: true }))

    // Preview should be restored to 60%
    expect(previewContent.scrollTop).toBeCloseTo(1020, 0)
  })

  it('preview scroll does not move editor', () => {
    const { editor, preview } = setup()

    editor.setScrollTop(400) // 50%
    textarea.dispatchEvent(new Event('scroll'))

    preview.setScrollTop(1700) // 100%
    previewContent.dispatchEvent(new Event('scroll'))

    expect(textarea.scrollTop).toBe(400)
  })
})
