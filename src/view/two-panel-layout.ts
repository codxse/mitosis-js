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
  private previewScrollRatio = 0
  private lastEditorScrollRatio = 0

  constructor(config: { container: HTMLElement; initialContent?: string; prism?: object }) {
    this.content = config.initialContent ?? ''
    if (config.prism !== undefined) {
      this.prism = config.prism
    }
    this.container = document.createElement('div')
    this.container.className = 'mitosis-layout'

    this.editorPaneContainer = document.createElement('div')
    this.editorPaneContainer.className = 'mitosis-panel editor-panel'

    this.divider = document.createElement('div')
    this.divider.className = 'mitosis-divider'
    this.divider.addEventListener('mousedown', () => this.startDrag())

    this.previewPaneContainer = document.createElement('div')
    this.previewPaneContainer.className = 'mitosis-panel preview-panel'

    this.editorPane = new EditorPane({
      container: this.editorPaneContainer,
      onUpdate: (content) => this.handleEditorUpdate(content),
      onScroll: (ratio) => this.handleEditorScroll(ratio),
    })

    const previewConfig: {
      container: HTMLDivElement
      onScroll: (ratio: number) => void
      prism?: PrismInstance
    } = {
      container: this.previewPaneContainer,
      onScroll: (ratio) => this.handlePreviewScroll(ratio),
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

  private handleEditorScroll(ratio: number): void {
    const delta = ratio - this.lastEditorScrollRatio
    this.lastEditorScrollRatio = ratio
    this.previewScrollRatio = Math.max(0, Math.min(1, this.previewScrollRatio + delta))
    this.previewPane.setScrollRatio(this.previewScrollRatio)
  }

  private handlePreviewScroll(ratio: number): void {
    this.previewScrollRatio = ratio
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

  destroy(): void {
    this.editorPane.destroy()
    this.previewPane.destroy()
    document.removeEventListener('mousemove', (e) => this.handleDrag(e))
    document.removeEventListener('mouseup', () => this.stopDrag())
    this.container.remove()
  }
}
