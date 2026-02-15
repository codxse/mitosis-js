import { highlightMarkdown, getHighlightStyles } from '../highlight/markdown.js';

interface Shortcut {
  key: string;
  shiftKey?: boolean;
  syntax: { prefix: string; suffix: string } | string;
}

const SHORTCUTS: Shortcut[] = [
  { key: 'b', syntax: { prefix: '**', suffix: '**' } },  // Bold
  { key: 'i', syntax: { prefix: '*', suffix: '*' } },   // Italic
  { key: 'k', syntax: { prefix: '[', suffix: '](url)' } }, // Link
  { key: 'e', syntax: { prefix: '`', suffix: '`' } },    // Inline code
  { key: 's', shiftKey: true, syntax: { prefix: '~~', suffix: '~~' } }, // Strikethrough
];

export class EditorPane {
  private textarea: HTMLTextAreaElement;
  private highlightOverlay: HTMLDivElement;
  private container: HTMLDivElement;
  private onUpdate: (content: string) => void;
  private onScroll: (scrollTop: number, scrollHeight: number) => void;

  constructor(config: { container: HTMLElement; onUpdate?: (content: string) => void; onScroll?: (scrollTop: number, scrollHeight: number) => void }) {
    this.onUpdate = config.onUpdate ?? (() => { });
    this.onScroll = config.onScroll ?? (() => { });

    this.container = document.createElement('div');
    this.container.className = 'editor-pane-container';
    Object.assign(this.container.style, {
      position: 'relative',
      height: '100%',
      overflow: 'hidden'
    });

    const styleEl = document.createElement('style');
    styleEl.textContent = this.getStyles() + getHighlightStyles();
    this.container.appendChild(styleEl);

    this.textarea = document.createElement('textarea');
    this.textarea.className = 'editor-textarea';
    this.textarea.placeholder = 'Write markdown here...';
    Object.assign(this.textarea.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      padding: '16px',
      border: 'none',
      outline: 'none',
      resize: 'none',
      fontFamily: 'ui-monospace, monospace',
      fontSize: '14px',
      lineHeight: '1.6',
      background: 'transparent',
      color: 'transparent',
      caretColor: '#000',
      zIndex: '2'
    });

    this.highlightOverlay = document.createElement('div');
    this.highlightOverlay.className = 'editor-highlight';
    Object.assign(this.highlightOverlay.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      padding: '16px',
      pointerEvents: 'none',
      fontFamily: 'ui-monospace, monospace',
      fontSize: '14px',
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      overflow: 'auto',
      zIndex: '1'
    });

    this.textarea.addEventListener('input', () => this.handleInput());
    this.textarea.addEventListener('scroll', () => this.handleScroll());
    this.textarea.addEventListener('keydown', (e) => this.handleKeyDown(e));

    this.container.appendChild(this.highlightOverlay);
    this.container.appendChild(this.textarea);
    config.container.appendChild(this.container);
  }

  private handleInput(): void {
    const content = this.textarea.value;
    this.highlightOverlay.innerHTML = highlightMarkdown(content) + '\n';
    this.onUpdate(content);
  }

  private handleScroll(): void {
    const { scrollTop, scrollHeight } = this.textarea;
    this.highlightOverlay.scrollTop = scrollTop;
    this.onScroll(scrollTop, scrollHeight);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      this.insertText('  ');
      return;
    }

    // Keyboard shortcuts
    for (const shortcut of SHORTCUTS) {
      if (e.key === shortcut.key &&
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey === (shortcut.shiftKey ?? false)) {
        e.preventDefault();

        if (typeof shortcut.syntax === 'string') {
          this.insertText(shortcut.syntax);
        } else {
          this.wrapSelection(shortcut.syntax.prefix, shortcut.syntax.suffix);
        }
        return;
      }
    }
  }

  private insertText(text: string): void {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const value = this.textarea.value;

    this.textarea.value = value.substring(0, start) + text + value.substring(end);
    this.textarea.selectionStart = this.textarea.selectionEnd = start + text.length;
    this.textarea.focus();
    this.handleInput();
  }

  private wrapSelection(prefix: string, suffix: string): void {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const value = this.textarea.value;
    const selectedText = value.substring(start, end);

    const newText = prefix + selectedText + suffix;
    this.textarea.value = value.substring(0, start) + newText + value.substring(end);

    // Position cursor after the suffix if no text was selected, otherwise select the wrapped text
    if (selectedText.length === 0) {
      this.textarea.selectionStart = this.textarea.selectionEnd = start + prefix.length;
    } else {
      this.textarea.selectionStart = start;
      this.textarea.selectionEnd = start + newText.length;
    }
    this.textarea.focus();
    this.handleInput();
  }

  setContent(content: string): void {
    this.textarea.value = content;
    this.handleInput();
  }

  getContent(): string {
    return this.textarea.value;
  }

  private getStyles(): string {
    return `
      .editor-pane-container {
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        background: #ffffff;
      }
      .editor-textarea::placeholder {
        color: #999;
      }
      .editor-textarea::selection {
        background: #b3d9ff;
      }
    `;
  }

  destroy(): void {
    this.textarea.removeEventListener('input', () => this.handleInput());
    this.textarea.removeEventListener('scroll', () => this.handleScroll());
    this.textarea.removeEventListener('keydown', (e) => this.handleKeyDown(e));
    this.container.remove();
  }
}
