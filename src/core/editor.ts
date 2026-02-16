import type { EditorOptions, EditorOutput } from './types.js'
import { TwoPanelLayout } from '../view/two-panel-layout.js'
import { parseMarkdownToHTML } from '../parser/markdown.js'

export class Editor {
  private layout: TwoPanelLayout
  private container: HTMLElement
  private options: EditorOptions
  private wrapper: HTMLDivElement
  private currentTheme: 'light' | 'dark' = 'light'
  private mediaQuery: MediaQueryList | null = null
  private themeChangeHandler: (() => void) | null = null

  constructor(options: EditorOptions) {
    this.options = options
    this.container = options.container
    const theme = options.theme ?? 'auto'

    this.wrapper = document.createElement('div')
    this.wrapper.className = 'mitosis-editor-wrapper'

    if (options.cssVars) {
      for (const [key, value] of Object.entries(options.cssVars)) {
        this.wrapper.style.setProperty(key, value)
      }
    }

    this.applyTheme(theme)

    if (theme === 'auto') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      this.themeChangeHandler = () => {
        this.applyTheme('auto')
      }
      this.mediaQuery.addEventListener('change', this.themeChangeHandler)
    }

    const layoutConfig: { container: HTMLElement; initialContent?: string; prism?: object } = {
      container: this.wrapper,
    }
    if (options.content !== undefined) {
      layoutConfig.initialContent = options.content
    }
    if (options.prism !== undefined) {
      layoutConfig.prism = options.prism
    }

    this.layout = new TwoPanelLayout(layoutConfig)

    this.container.appendChild(this.wrapper)
  }

  private applyTheme(theme: 'light' | 'dark' | 'auto'): void {
    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.currentTheme = isDark ? 'dark' : 'light'
    } else {
      this.currentTheme = theme
    }
    this.wrapper.setAttribute('data-theme', this.currentTheme)
  }

  setTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.applyTheme(theme)
    if (theme !== 'auto' && this.mediaQuery && this.themeChangeHandler) {
      this.mediaQuery.removeEventListener('change', this.themeChangeHandler)
      this.mediaQuery = null
      this.themeChangeHandler = null
    }
    if (theme === 'auto') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      this.themeChangeHandler = () => {
        this.applyTheme('auto')
      }
      this.mediaQuery.addEventListener('change', this.themeChangeHandler)
    }
  }

  getTheme(): 'light' | 'dark' {
    return this.currentTheme
  }

  getMarkdown(): string {
    return this.layout.getMarkdown()
  }

  getHTML(): string {
    return parseMarkdownToHTML(this.layout.getMarkdown(), this.options.prism)
  }

  getBoth(): EditorOutput {
    const markdown = this.getMarkdown()
    return {
      markdown,
      html: parseMarkdownToHTML(markdown, this.options.prism),
    }
  }

  setMarkdown(content: string): void {
    this.layout.setContent(content)
  }

  destroy(): void {
    this.layout.destroy()
    if (this.mediaQuery && this.themeChangeHandler) {
      this.mediaQuery.removeEventListener('change', this.themeChangeHandler)
    }
    this.container.innerHTML = ''
  }
}
