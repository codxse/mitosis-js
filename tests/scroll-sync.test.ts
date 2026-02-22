import { describe, it, expect, afterEach } from 'vitest'
import { EditorPane } from '../src/view/editor-pane'

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
