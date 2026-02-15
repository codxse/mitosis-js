# Dark Mode & CSS Customization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add dark/light theme support to the editor with CSS variable-based theming, allowing users to customize via external CSS files or custom variables.

**Architecture:** Use CSS custom properties scoped to `.mitosis-editor-wrapper` with theme class variants. The wrapper gets `data-theme` attribute applied based on theme option. CSS files are separate for tree-shaking.

**Tech Stack:** TypeScript, CSS custom properties, matchMedia API

---

### Task 1: Update types.ts with new theme options

**Files:**
- Modify: `src/core/types.ts`

**Step 1: Update EditorOptions interface**

```typescript
export interface EditorOptions {
  container: HTMLElement
  content?: string
  readonly?: boolean
  theme?: 'light' | 'dark' | 'auto'  // default: 'auto'
  placeholder?: string
  prism?: object
  cssVars?: Record<string, string>   // custom CSS variable overrides
}
```

**Step 2: Commit**

```bash
git add src/core/types.ts && git commit -m "feat: add theme options to EditorOptions"
```

---

### Task 2: Create base CSS file with CSS variables

**Files:**
- Modify: `src/styles/editor.css`

**Step 1: Write CSS variables**

Replace existing content with:

```css
.mitosis-editor-wrapper {
  /* Editor pane */
  --editor-bg: #ffffff;
  --editor-text: #282a36;
  --editor-border: #e0e0e0;
  --editor-caret: #000000;
  --editor-placeholder: #999999;
  --editor-selection: #b3d9ff;

  /* Preview pane */
  --preview-bg: #ffffff;
  --preview-text: #282a36;
  --preview-border: #e0e0e0;
  --preview-code-bg: #f6f8fa;
  --preview-link: #0366d6;

  /* Layout */
  --divider-bg: #e0e0e0;
  --divider-hover: #bdbdbd;

  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  box-sizing: border-box;
}

.mitosis-editor-wrapper *,
.mitosis-editor-wrapper *::before,
.mitosis-editor-wrapper *::after {
  box-sizing: inherit;
}
```

**Step 2: Commit**

```bash
git add src/styles/editor.css && git commit -m "feat: add CSS variables to editor.css"
```

---

### Task 3: Create theme-dark.css

**Files:**
- Create: `src/styles/theme-dark.css`

**Step 1: Write dark theme CSS**

```css
.mitosis-editor-wrapper[data-theme="dark"] {
  /* Editor pane */
  --editor-bg: #282a36;
  --editor-text: #f8f8f2;
  --editor-border: #44475a;
  --editor-caret: #f8f8f2;
  --editor-placeholder: #6272a4;
  --editor-selection: #44475a;

  /* Preview pane */
  --preview-bg: #282a36;
  --preview-text: #f8f8f2;
  --preview-border: #44475a;
  --preview-code-bg: #44475a;
  --preview-link: #8be9fd;

  /* Layout */
  --divider-bg: #44475a;
  --divider-hover: #6272a4;
}
```

**Step 2: Commit**

```bash
git add src/styles/theme-dark.css && git commit -m "feat: add dark theme CSS"
```

---

### Task 4: Create theme-light.css

**Files:**
- Create: `src/styles/theme-light.css`

**Step 1: Write light theme CSS**

```css
.mitosis-editor-wrapper[data-theme="light"] {
  /* Light theme uses default values - explicit for clarity */
  --editor-bg: #ffffff;
  --editor-text: #282a36;
  --editor-border: #e0e0e0;
  --editor-caret: #000000;
  --editor-placeholder: #999999;
  --editor-selection: #b3d9ff;

  --preview-bg: #ffffff;
  --preview-text: #282a36;
  --preview-border: #e0e0e0;
  --preview-code-bg: #f6f8fa;
  --preview-link: #0366d6;

  --divider-bg: #e0e0e0;
  --divider-hover: #bdbdbd;
}
```

**Step 2: Commit**

```bash
git add src/styles/theme-light.css && git commit -m "feat: add light theme CSS"
```

---

### Task 5: Update two-panel-layout.ts to use CSS variables

**Files:**
- Modify: `src/view/two-panel-layout.ts:29-50` (divider styles)
- Modify: `src/view/two-panel-layout.ts:159-169` (getStyles method)

**Step 1: Update inline styles to use CSS variables**

In constructor, change divider style:
```typescript
// Before:
Object.assign(this.divider.style, {
  width: '8px',
  cursor: 'col-resize',
  background: '#e0e0e0',  // REMOVE THIS
  position: 'relative',
  flexShrink: '0',
})

// After:
Object.assign(this.divider.style, {
  width: '8px',
  cursor: 'col-resize',
  background: 'var(--divider-bg)',
  position: 'relative',
  flexShrink: '0',
})
```

**Step 2: Update startDrag and stopDrag methods**

```typescript
// startDrag - change:
this.divider.style.background = 'var(--divider-hover)'

// stopDrag - change:
this.divider.style.background = 'var(--divider-bg)'
```

**Step 3: Update getStyles method**

```typescript
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
```

**Step 4: Commit**

```bash
git add src/view/two-panel-layout.ts && git commit -feat: use CSS variables in two-panel-layout"
```

---

### Task 6: Update editor-pane.ts to use CSS variables

**Files:**
- Modify: `src/view/editor-pane.ts:44-64` (textarea styles)
- Modify: `src/view/editor-pane.ts:179-192` (getStyles method)

**Step 1: Update textarea styles**

```typescript
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
  caretColor: 'var(--editor-caret)',
  zIndex: '2',
})
```

**Step 2: Update highlightOverlay styles**

```typescript
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
  zIndex: '1',
  color: 'var(--editor-text)',
})
```

**Step 3: Update getStyles method**

```typescript
private getStyles(): string {
  return `
    .editor-pane-container {
      border: 1px solid var(--editor-border);
      border-radius: 4px;
      background: var(--editor-bg);
    }
    .editor-textarea::placeholder {
      color: var(--editor-placeholder);
    }
    .editor-textarea::selection {
      background: var(--editor-selection);
    }
  `
}
```

**Step 4: Commit**

```bash
git add src/view/editor-pane.ts && git commit -m "feat: use CSS variables in editor-pane"
```

---

### Task 7: Update preview-pane.ts to use CSS variables

**Files:**
- Modify: `src/view/preview-pane.ts:35-41` (content styles)
- Modify: `src/view/preview-pane.ts:63-130` (getStyles method)

**Step 1: Update content styles**

```typescript
Object.assign(this.content.style, {
  padding: '16px',
  overflow: 'auto',
  flex: '1',
  background: 'var(--preview-bg)',
  color: 'var(--preview-text)',
})
```

**Step 2: Update getStyles method**

```typescript
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
```

**Step 3: Commit**

```bash
git add src/view/preview-pane.ts && git commit -m "feat: use CSS variables in preview-pane"
```

---

### Task 8: Update Editor class to handle theme

**Files:**
- Modify: `src/core/editor.ts`

**Step 1: Add theme handling**

```typescript
import type { EditorOptions, EditorOutput } from './types.js'
import { TwoPanelLayout } from '../view/two-panel-layout.js'
import { parseMarkdownToHTML } from '../parser/markdown.js'

export class Editor {
  private layout: TwoPanelLayout
  private container: HTMLElement
  private options: EditorOptions
  private wrapper: HTMLDivElement
  private currentTheme: 'light' | 'dark' = 'light'
  private mediaQuery: MediaQueryList

  constructor(options: EditorOptions) {
    this.options = options
    this.container = options.container
    const theme = options.theme ?? 'auto'

    this.wrapper = document.createElement('div')
    this.wrapper.className = 'mitosis-editor-wrapper'
    Object.assign(this.wrapper.style, {
      width: '100%',
      height: '600px',
      position: 'relative',
    })

    // Apply custom CSS vars if provided
    if (options.cssVars) {
      for (const [key, value] of Object.entries(options.cssVars)) {
        this.wrapper.style.setProperty(key, value)
      }
    }

    // Handle theme
    this.applyTheme(theme)

    // Listen for system theme changes if auto
    if (theme === 'auto') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      this.mediaQuery.addEventListener('change', (e) => {
        this.applyTheme('auto')
      })
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
    if (theme !== 'auto' && this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', () => {})
    }
    if (theme === 'auto') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      this.mediaQuery.addEventListener('change', () => {
        this.applyTheme('auto')
      })
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
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', () => {})
    }
    this.container.innerHTML = ''
  }
}
```

**Step 2: Commit**

```bash
git add src/core/editor.ts && git commit -m "feat: add theme support to Editor class"
```

---

### Task 9: Update tsconfig to include CSS files in build

 Modify: `tsconfig.json`

** Add toStep 1: css**Files:**
- already includes include` which should include**

The tsconfig CSS files. Verify by running build.

**Step 2 `src/**/*: Commit (if needed)**

---

### Task 10: Update build script to copy CSS files

**Files:**
package.json`

**- Modify: `Step 1:```json
" Update build script**

scripts": {
  "prepublishOnly": "pnpm run build",
  "test": "vitest",
  "dev": "tsx watch src/index.ts",
  "c && pbuild": "tsnpm run copy-css",
  "copy-css": "node -e \"const fs=require('fs');const p=require('path');['editor.css','theme-light.css','theme-dark.css'].forEach(f=>{const s=p.join('src/styles',f);const d=p.join('dist/styles',f);fs.mkdirSync(p.dirname(d),{recursive:true});fs.copyFileSync(s,d)})\"",
  "build:bundle": "esbuild dist/index.js --bundle --format=iife --outfile=dist/mitosis-editor.bundle.js --global-name=MitosisEditor --define:process.env.NODE_ENV=\\\"production\\\"",
  "start": "node dist/index.js",
  "demo": "vite serve demo",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --check .",
  "format:fix": "prettier --write .",
  "release": "standard-version",
  "release:patch": "standard-version --release-as patch",
  "release:minor": "standard-version --release-as minor",
  "release:major": "standard-version --release-as major",
  "release:dry": "standard-version --dry-run"
}
```

**Step 2: Commit**

```bash
git add package.json && git commit -m "feat: add CSS copy to build script"
```

---

### Task 11: Run build and verify

**Step 1: Run build**

```bash
pnpm run build
```

**Step 2: Verify dist/styles exists**

```bash
ls -la dist/styles/
```

Expected output:
```
editor.css
theme-light.css
theme-dark.css
```

**Step 3: Commit**

---

### Task 12: Update README with theming documentation

**Files:**
- Modify: `README.md`

**Step 1: Add theming section after Features**

```markdown
## Theming

The editor supports light, dark, and auto themes. Import the base CSS and theme files you need:

```bash
# Core package
pnpm add @codxse/mitosis-js
```

```js
// Dark mode
import '@codxse/mitosis-js/dist/styles/editor.css'
import '@codxse/mitosis-js/dist/styles/theme-dark.css'

// Light mode
import '@codxse/mitosis-js/dist/styles/editor.css'
import '@codxse/mitosis-js/dist/styles/theme-light.css'

// Auto (follows system preference)
import '@codxse/mitosis-js/dist/styles/editor.css'
import '@codxse/mitosis-js/dist/styles/theme-light.css'
import '@codxse/mitosis-js/dist/styles/theme-dark.css'
```

### Theme Options

```js
const editor = createEditor({
  container: document.getElementById('editor'),
  theme: 'auto',    // 'light' | 'dark' | 'auto' (default: 'auto')
})

// Change theme at runtime
editor.setTheme('dark')
editor.getTheme() // 'dark' or 'light'
```

### Custom CSS Variables

Override any CSS variable:

```js
const editor = createEditor({
  container: document.getElementById('editor'),
  cssVars: {
    '--editor-bg': '#000000',
    '--editor-text': '#00ff00',
    '--preview-link': '#ff00ff',
  },
})
```

### CSS Variables Reference

| Variable | Description | Default (Light) | Default (Dark) |
|----------|-------------|-----------------|----------------|
| `--editor-bg` | Editor background | #ffffff | #282a36 |
| `--editor-text` | Editor text color | #282a36 | #f8f8f2 |
| `--editor-border` | Editor border | #e0e0e0 | #44475a |
| `--editor-caret` | Cursor color | #000000 | #f8f8f2 |
| `--preview-bg` | Preview background | #ffffff | #282a36 |
| `--preview-text` | Preview text | #282a36 | #f8f8f2 |
| `--preview-code-bg` | Code block background | #f6f8fa | #44475a |
| `--preview-link` | Link color | #0366d6 | #8be9fd |
| `--divider-bg` | Divider color | #e0e0e0 | #44475a |
```

**Step 2: Commit**

```bash
git add README.md && git commit -m "docs: add theming documentation"
```

---

### Task 13: Test with demo

**Step 1: Run demo**

```bash
pnpm run demo
```

**Step 2: Verify visually**
- Light theme works
- Dark theme works
- Auto theme follows system

**Step 3: Commit**
