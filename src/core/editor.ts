import type {EditorOptions, EditorOutput} from './types.js';
import {TwoPanelLayout} from '../view/two-panel-layout.js';
import {parseMarkdownToHTML} from '../parser/markdown.js';

export class Editor {
  private layout: TwoPanelLayout;
  private container: HTMLElement;
  private options: EditorOptions;

  constructor(options: EditorOptions) {
    this.options = options;
    this.container = options.container;

    const wrapper = document.createElement('div');
    wrapper.className = 'mitosis-editor-wrapper';
    Object.assign(wrapper.style, {
      width: '100%',
      height: '600px',
      position: 'relative'
    });

    const layoutConfig: {container: HTMLElement; initialContent?: string} = {
      container: wrapper
    };
    if (options.content !== undefined) {
      layoutConfig.initialContent = options.content;
    }

    this.layout = new TwoPanelLayout(layoutConfig);

    this.container.appendChild(wrapper);
  }

  getMarkdown(): string {
    return this.layout.getMarkdown();
  }

  getHTML(): string {
    return parseMarkdownToHTML(this.layout.getMarkdown(), this.options.prism);
  }

  getBoth(): EditorOutput {
    const markdown = this.getMarkdown();
    return {
      markdown,
      html: parseMarkdownToHTML(markdown, this.options.prism)
    };
  }

  setMarkdown(content: string): void {
    this.layout.setContent(content);
  }

  destroy(): void {
    this.layout.destroy();
    this.container.innerHTML = '';
  }
}
