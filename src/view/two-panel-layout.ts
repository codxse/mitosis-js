import { EditorPane } from './editor-pane.js'
import { PreviewPane } from './preview-pane.js'
import type { PrismInstance } from '../parser/markdown.js'

export class TwoPanelLayout {
  private container: HTMLDivElement
  private editorPaneContainer: HTMLDivElement
  private previewPaneContainer: HTMLDivElement
  private divider: HTMLDivElement
  private editorPane: EditorPane
  private previewPane: PreviewPane
  private content = ''
  private isDragging = false
  private prism?: object

  constructor(config: { container: HTMLElement; initialContent?: string; prism?: object }) {
    this.content = config.initialContent ?? ''
    if (config.prism !== undefined) {
      this.prism = config.prism
    }
    this.container = document.createElement('div')
    this.container.className = 'two-panel-layout'
    Object.assign(this.container.style, {
      display: 'flex',
      height: '100%',
      gap: '0',
    })

    const styleEl = document.createElement('style')
    styleEl.textContent = this.getStyles()
    this.container.appendChild(styleEl)

    this.editorPaneContainer = document.createElement('div')
    this.editorPaneContainer.className = 'panel editor-panel'
    Object.assign(this.editorPaneContainer.style, {
      flex: '1',
      minHeight: '0',
      display: 'flex',
      flexDirection: 'column',
    })

    this.divider = document.createElement('div')
    this.divider.className = 'panel-divider'
    Object.assign(this.divider.style, {
      width: '8px',
      cursor: 'col-resize',
      background: 'var(--divider-bg)',
      position: 'relative',
      flexShrink: '0',
    })
    this.divider.addEventListener('mousedown', () => this.startDrag())

    this.previewPaneContainer = document.createElement('div')
    this.previewPaneContainer.className = 'panel preview-panel'
    Object.assign(this.previewPaneContainer.style, {
      flex: '1',
      minHeight: '0',
      display: 'flex',
      flexDirection: 'column',
    })

    this.editorPane = new EditorPane({
      container: this.editorPaneContainer,
      onUpdate: (content) => this.handleEditorUpdate(content),
      onScroll: (scrollTop, scrollHeight) => this.syncScroll(scrollTop, scrollHeight, 'editor'),
    })

    const previewConfig: {
      container: HTMLDivElement
      onScroll: (scrollTop: number, scrollHeight: number) => void
      prism?: PrismInstance
    } = {
      container: this.previewPaneContainer,
      onScroll: (scrollTop, scrollHeight) => this.syncScroll(scrollTop, scrollHeight, 'preview'),
    }
    if (this.prism !== undefined) {
      previewConfig.prism = this.prism as PrismInstance
    }
    this.previewPane = new PreviewPane(previewConfig)

    this.container.appendChild(this.editorPaneContainer)
    this.container.appendChild(this.divider)
    this.container.appendChild(this.previewPaneContainer)

    config.container.appendChild(this.container)

    if (this.content) {
      this.editorPane.setContent(this.content)
      this.previewPane.setContent(this.content)
    }

    document.addEventListener('mousemove', (e) => this.handleDrag(e))
    document.addEventListener('mouseup', () => this.stopDrag())
  }

  private handleEditorUpdate(content: string): void {
    this.content = content
    this.previewPane.setContent(content)
  }

  private syncScroll(scrollTop: number, scrollHeight: number, source: 'editor' | 'preview'): void {
    if (source === 'editor') {
      const ratio = scrollTop / scrollHeight
      this.previewPane.setScrollRatio(ratio)
    } else {
      const ratio = scrollTop / scrollHeight
      const editorScrollTop = ratio * this.editorPaneContainer.scrollHeight
      this.editorPaneContainer.scrollTop = editorScrollTop
    }
  }

  private startDrag(): void {
    this.isDragging = true
    this.divider.style.background = 'var(--divider-hover)'
  }

  private handleDrag(e: MouseEvent): void {
    if (!this.isDragging) return

    const containerRect = this.container.getBoundingClientRect()
    const x = e.clientX - containerRect.left
    const percentage = (x / containerRect.width) * 100

    if (percentage > 10 && percentage < 90) {
      this.editorPaneContainer.style.flex = `0 0 ${percentage}%`
      this.previewPaneContainer.style.flex = `0 0 ${100 - percentage}%`
    }
  }

  private stopDrag(): void {
    if (this.isDragging) {
      this.isDragging = false
      this.divider.style.background = 'var(--divider-bg)'
    }
  }

  getMarkdown(): string {
    return this.editorPane.getContent()
  }

  getHTML(): string {
    return this.content
  }

  getBoth(): { markdown: string; html: string } {
    const markdown = this.getMarkdown()
    return {
      markdown,
      html: this.content,
    }
  }

  setContent(content: string): void {
    this.content = content
    this.editorPane.setContent(content)
    this.previewPane.setContent(content)
  }

  private getStyles(): string {
    return `
      .two-panel-layout {
        border: 1px solid var(--editor-border);
        border-radius: 4px;
        overflow: hidden;
      }
      .panel-divider:hover {
        background: var(--divider-hover) !important;
      }
    `
  }

  destroy(): void {
    this.editorPane.destroy()
    this.previewPane.destroy()
    document.removeEventListener('mousemove', (e) => this.handleDrag(e))
    document.removeEventListener('mouseup', () => this.stopDrag())
    this.container.remove()
  }
}
