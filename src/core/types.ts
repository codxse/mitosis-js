export interface EditorOptions {
  container: HTMLElement;
  content?: string;
  readonly?: boolean;
  theme?: 'light' | 'dark';
  placeholder?: string;
  prism?: object;
}

export interface EditorOutput {
  markdown: string;
  html: string;
}

export interface PaneConfig {
  container: HTMLElement;
  onUpdate?: (content: string) => void;
  onScroll?: (scrollTop: number, scrollHeight: number) => void;
}
