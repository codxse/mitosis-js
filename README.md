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
pnpm add @codxse/mitosis-js
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
