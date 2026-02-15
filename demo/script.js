import { createEditor } from '../src/index.js';

const sampleMarkdown = `# Welcome to Mitosis JS

A **framework-agnostic** markdown editor with a beautiful split-view interface.

## Features

- **Live Preview**: See your markdown rendered instantly
- **Syntax Highlighting**: Easy-to-read markdown highlighting
- **Scroll Sync**: Panels stay in sync as you scroll
- **Resizable Panels**: Drag the divider to adjust panel sizes
- **Framework Agnostic**: Works with React, Vue, Svelte, or vanilla JS

## Code Example

\`\`\`javascript
function createEditor(options) {
  return new Editor(options);
}

const editor = createEditor({
  container: document.getElementById('editor'),
  content: '# Hello World'
});
\`\`\`

## Lists

### Unordered List
- First item
- Second item
- Third item

### Ordered List
1. Step one
2. Step two
3. Step three

## Blockquote

> "The best way to predict the future is to invent it."
> — Alan Kay

## Links and Images

[Visit GitHub](https://github.com)

## Task Lists

- [x] Implement core editor
- [x] Add syntax highlighting
- [ ] Add more themes
- [ ] Write tests

---

*Start typing in the editor to see the magic!*
`;

let editor;

try {
  editor = createEditor({
    container: document.getElementById('editor'),
    content: sampleMarkdown
  });

  document.getElementById('btn-markdown').addEventListener('click', () => {
    const markdown = editor.getMarkdown();
    showOutput('Markdown Output', markdown);
  });

  document.getElementById('btn-html').addEventListener('click', () => {
    const html = editor.getHTML();
    showOutput('HTML Output', html);
  });

  document.getElementById('btn-both').addEventListener('click', () => {
    const { markdown, html } = editor.getBoth();
    showOutput('Both Outputs', `Markdown:\n\n${markdown}\n\n\nHTML:\n\n${html}`);
  });

  document.getElementById('btn-set-sample').addEventListener('click', () => {
    editor.setMarkdown(sampleMarkdown);
  });

  document.getElementById('btn-clear').addEventListener('click', () => {
    editor.setMarkdown('');
  });

  function showOutput(title, content) {
    document.getElementById('output-title').textContent = title;
    document.getElementById('output-content').textContent = content;
    document.getElementById('output').classList.add('visible');
  }
} catch (error) {
  console.error('Failed to initialize editor:', error);
  document.getElementById('editor').innerHTML = `
    <div style="padding: 20px; color: red;">
      <h3>Error initializing editor</h3>
      <pre>${error.message}</pre>
    </div>
  `;
}
