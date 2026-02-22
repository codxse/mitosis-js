import { describe, it, expect, afterEach } from 'vitest'
import { EditorPane } from '../src/view/editor-pane'
import { PreviewPane } from '../src/view/preview-pane'

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
