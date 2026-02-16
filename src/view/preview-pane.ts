import { parseMarkdownToHTML } from '../parser/markdown.js'
import type { PrismInstance } from '../parser/markdown.js'

export class PreviewPane {
  private container: HTMLDivElement
  private content: HTMLDivElement
  private onScroll: (scrollTop: number, scrollHeight: number) => void
  private prism?: PrismInstance
  private scrollHandler: () => void

  constructor(config: {
    container: HTMLElement
    onScroll?: (scrollTop: number, scrollHeight: number) => void
    prism?: PrismInstance
  }) {
    this.onScroll = config.onScroll ?? (() => {})
    if (config.prism !== undefined) {
      this.prism = config.prism
    }
    this.scrollHandler = () => this.handleScroll()

    this.container = document.createElement('div')
    this.container.className = 'mitosis-preview'

    this.content = document.createElement('div')
    this.content.className = 'mitosis-preview-content'

    this.content.addEventListener('scroll', this.scrollHandler)

    this.container.appendChild(this.content)
    config.container.appendChild(this.container)
  }

  private handleScroll(): void {
    const { scrollTop, scrollHeight } = this.content
    this.onScroll(scrollTop, scrollHeight)
  }

  setContent(markdown: string): void {
    this.content.innerHTML = parseMarkdownToHTML(markdown, this.prism)
  }

  setScrollRatio(ratio: number): void {
    const maxScroll = this.content.scrollHeight - this.content.clientHeight
    this.content.scrollTop = maxScroll * ratio
  }

  destroy(): void {
    this.content.removeEventListener('scroll', this.scrollHandler)
    this.container.remove()
  }
}
