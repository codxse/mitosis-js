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
    this.container.className = 'preview-pane'
    Object.assign(this.container.style, {
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    })

    const styleEl = document.createElement('style')
    styleEl.textContent = this.getStyles()
    this.container.appendChild(styleEl)

    this.content = document.createElement('div')
    this.content.className = 'preview-content'
    Object.assign(this.content.style, {
      padding: '16px',
      overflow: 'auto',
      flex: '1',
      background: 'var(--preview-bg)',
      color: 'var(--preview-text)',
    })

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

  private getStyles(): string {
    return `
      .preview-pane {
        border: 1px solid var(--preview-border);
        border-radius: 4px;
        background: var(--preview-bg);
      }
      .preview-content h1,
      .preview-content h2,
      .preview-content h3,
      .preview-content h4,
      .preview-content h5,
      .preview-content h6 {
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        font-weight: 600;
        line-height: 1.25;
      }
      .preview-content h1 { font-size: 2em; border-bottom: 1px solid var(--preview-border); padding-bottom: 0.3em; }
      .preview-content h2 { font-size: 1.5em; border-bottom: 1px solid var(--preview-border); padding-bottom: 0.3em; }
      .preview-content h3 { font-size: 1.25em; }
      .preview-content h4 { font-size: 1em; }
      .preview-content h5 { font-size: 0.875em; }
      .preview-content h6 { font-size: 0.85em; color: var(--preview-text); opacity: 0.7; }
      .preview-content p { margin: 1em 0; }
      .preview-content ul, .preview-content ol { padding-left: 2em; margin: 1em 0; }
      .preview-content li { margin: 0.25em 0; }
      .preview-content code {
        background: var(--preview-code-bg);
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-family: ui-monospace, monospace;
        font-size: 0.9em;
      }
      .preview-content pre {
        background: var(--preview-code-bg);
        padding: 16px;
        border-radius: 6px;
        overflow: auto;
        margin: 1em 0;
      }
      .preview-content pre code {
        background: transparent;
        padding: 0;
      }
      .preview-content blockquote {
        border-left: 4px solid var(--preview-border);
        padding-left: 1em;
        color: var(--preview-text);
        opacity: 0.7;
        margin: 1em 0;
      }
      .preview-content img {
        max-width: 100%;
        height: auto;
      }
      .preview-content a {
        color: var(--preview-link);
        text-decoration: none;
      }
      .preview-content a:hover {
        text-decoration: underline;
      }
      .preview-content hr {
        border: none;
        border-top: 1px solid var(--preview-border);
        margin: 2em 0;
      }
    `
  }

  destroy(): void {
    this.content.removeEventListener('scroll', this.scrollHandler)
    this.container.remove()
  }
}
