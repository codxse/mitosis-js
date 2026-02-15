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

```jsx
import { createEditor } from '@codxse/mitosis-js';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css';

const editor = createEditor({
  container: document.getElementById('editor'),
  content: '# Hello\n```js\nconst x = 1;\n```',
  prism: Prism  // Optional - without this, code blocks render without highlighting
});
```

**Note:** You must install Prism.js and the language components you need separately. Prism is not bundled with this package.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl+B` | Wrap in `**bold**` |
| `Cmd/Ctrl+I` | Wrap in `*italic*` |
| `Cmd/Ctrl+K` | Insert `[link](url)` |
| `Cmd/Ctrl+E` | Wrap in `` `inline code` `` |
| `Cmd/Ctrl+Shift+S` | Wrap in `~~strikethrough~~` |
| `Tab` | Insert 2 spaces (indent) |

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
  <link rel="stylesheet" href="node_modules/@codxse/mitosis-js/dist/styles/editor.css">
</head>
<body>
  <div id="editor"></div>

  <script type="module">
    import { createEditor } from '@codxse/mitosis-js';
    
    const editor = createEditor({
      container: document.getElementById('editor'),
      content: '# Hello World'
    });

    // Get content
    const markdown = editor.getMarkdown();
    const html = editor.getHTML();
    const { markdown, html } = editor.getBoth();
    
    // Set content
    editor.setMarkdown('# New content');
  </script>
</body>
</html>
```

### React

```jsx
import { createEditor } from '@codxse/mitosis-js';
import { useEffect, useRef } from 'react';

function Editor() {
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = createEditor({
        container: containerRef.current,
        content: '# Hello World'
      });
    }

    return () => editorRef.current?.destroy();
  }, []);

  return <div ref={containerRef} style={{ height: '500px' }} />;
}
```

### Vue

```vue
<template>
  <div ref="editorContainer" style="height: 500px"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { createEditor } from '@codxse/mitosis-js';

const editorContainer = ref(null);
let editor = null;

onMounted(() => {
  if (editorContainer.value) {
    editor = createEditor({
      container: editorContainer.value,
      content: '# Hello World'
    });
  }
});

onUnmounted(() => {
  editor?.destroy();
});
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
