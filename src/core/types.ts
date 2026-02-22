export interface EditorOptions {
  container: HTMLElement
  content?: string
  readonly?: boolean
  theme?: 'light' | 'dark' | 'auto'
  placeholder?: string
  prism?: object
  cssVars?: Record<string, string>
}

export interface EditorOutput {
  markdown: string
  html: string
}

export interface PaneConfig {
  container: HTMLElement
  onUpdate?: (content: string) => void
  onScroll?: (ratio: number) => void
  prism?: object
}
