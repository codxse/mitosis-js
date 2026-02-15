# @codxse/mitosis-js

A framework-agnostic markdown editor with a split-view interface, optimized for technical blogs and documentation.

## Features

- **Split-View Editor**: Write markdown on the left, see live HTML preview on the right
- **Syntax Highlighting**: Color-coded markdown syntax in the editor for better readability
- **Keyboard Shortcuts**: Quick formatting with Cmd/Ctrl key combinations
- **Scroll Sync**: Panels stay synchronized as you scroll
- **Resizable Panels**: Drag the divider to adjust panel sizes
- **Framework Agnostic**: Works with React, Vue, Svelte, or vanilla JavaScript
- **Lightweight**: Simple markdown-to-HTML conversion using [`marked`](https://github.com/markedjs/marked)

## Syntax Highlighting

Code blocks in the preview can be syntax-highlighted using Prism.js. Provide your configured Prism instance via the `prism` option:

````jsx
import { createEditor } from '@codxse/mitosis-js'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/themes/prism-tomorrow.css'

const editor = createEditor({
  container: document.getElementById('editor'),
  content: '# Hello\n```js\nconst x = 1;\n```',
  prism: Prism, // Optional - without this, code blocks render without highlighting
})
````

**Note:** You must install Prism.js and the language components you need separately. Prism is not bundled with this package.

## Keyboard Shortcuts

| Shortcut           | Action                      |
| ------------------ | --------------------------- |
| `Cmd/Ctrl+B`       | Wrap in `**bold**`          |
| `Cmd/Ctrl+I`       | Wrap in `*italic*`          |
| `Cmd/Ctrl+K`       | Insert `[link](url)`        |
| `Cmd/Ctrl+E`       | Wrap in `` `inline code` `` |
| `Cmd/Ctrl+Shift+S` | Wrap in `~~strikethrough~~` |
| `Tab`              | Insert 2 spaces (indent)    |

## Theming

The editor supports light, dark, and auto themes. Import the base CSS and theme files you need:

```bash
# Core package
pnpm add @codxse/mitosis-js
```

```js
// Dark mode
import '@codxse/mitosis-js/dist/styles/editor.min.css'
import '@codxse/mitosis-js/dist/styles/theme-dark.min.css'

// Light mode
import '@codxse/mitosis-js/dist/styles/editor.min.css'
import '@codxse/mitosis-js/dist/styles/theme-light.min.css'

// Auto (follows system preference)
import '@codxse/mitosis-js/dist/styles/editor.min.css'
import '@codxse/mitosis-js/dist/styles/theme-light.min.css'
import '@codxse/mitosis-js/dist/styles/theme-dark.min.css'
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
| `--editor-placeholder` | Placeholder text | #999999 | #6272a4 |
| `--editor-selection` | Selection background | #b3d9ff | #44475a |
| `--preview-bg` | Preview background | #ffffff | #282a36 |
| `--preview-text` | Preview text | #282a36 | #f8f8f2 |
| `--preview-border` | Preview border | #e0e0e0 | #44475a |
| `--preview-code-bg` | Code block background | #f6f8fa | #44475a |
| `--preview-link` | Link color | #0366d6 | #8be9fd |
| `--divider-bg` | Divider color | #e0e0e0 | #44475a |
| `--divider-hover` | Divider hover | #bdbdbd | #6272a4 |

## Installation

```bash
# Core package
pnpm add @codxse/mitosis-js

# Optional: for syntax highlighting in code blocks
pnpm add prismjs
```

## Usage

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="node_modules/@codxse/mitosis-js/dist/styles/editor.min.css" />
  </head>
  <body>
    <div id="editor"></div>

    <script type="module">
      import { createEditor } from '@codxse/mitosis-js'

      const editor = createEditor({
        container: document.getElementById('editor'),
        content: '# Hello World',
      })

      // Get content
      const markdown = editor.getMarkdown()
      const html = editor.getHTML()
      const { markdown, html } = editor.getBoth()

      // Set content
      editor.setMarkdown('# New content')
    </script>
  </body>
</html>
```

### React

```jsx
import { createEditor } from '@codxse/mitosis-js'
import { useEffect, useRef } from 'react'

function Editor() {
  const containerRef = useRef(null)
  const editorRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = createEditor({
        container: containerRef.current,
        content: '# Hello World',
      })
    }

    return () => editorRef.current?.destroy()
  }, [])

  return <div ref={containerRef} style={{ height: '500px' }} />
}
```

### Vue

```vue
<template>
  <div ref="editorContainer" style="height: 500px"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { createEditor } from '@codxse/mitosis-js'

const editorContainer = ref(null)
let editor = null

onMounted(() => {
  if (editorContainer.value) {
    editor = createEditor({
      container: editorContainer.value,
      content: '# Hello World',
    })
  }
})

onUnmounted(() => {
  editor?.destroy()
})
</script>
```

## API

### `createEditor(options: EditorOptions): Editor`

Creates a new markdown editor instance.

**Options:**

- `container: HTMLElement` - The DOM element to mount the editor into
- `content?: string` - Initial markdown content
- `prism?: object` - Optional Prism.js instance for syntax highlighting code blocks

### Methods

#### `getMarkdown(): string`

Returns the current markdown content.

#### `getHTML(): string`

Returns the current content as HTML.

#### `getBoth(): { markdown: string; html: string }`

Returns both markdown and HTML representations.

#### `setMarkdown(content: string): void`

Sets the editor content to the provided markdown string.

#### `destroy(): void`

Cleans up the editor and removes all event listeners.

## Development

```bash
# Install dependencies
pnpm install

# Run demo
pnpm run demo

# Build
pnpm run build
```

## License

MIT
