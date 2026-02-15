# marked-highlight Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add syntax highlighting to code blocks in HTML preview using marked-highlight and Prism.js

**Architecture:** Accept optional Prism instance in EditorOptions, configure marked-highlight when provided, gracefully degrade when not

**Tech Stack:** marked-highlight, Prism.js (user-provided), Vitest

---

### Task 1: Add marked-highlight dependency

**Files:**

- Modify: `package.json`

**Step 1: Add marked-highlight to dependencies**

```json
"dependencies": {
  "marked": "^17.0.2",
  "marked-highlight": "^2.2.1"
}
```

**Step 2: Install dependency**

Run: `pnpm install`
Expected: marked-highlight added to node_modules and pnpm-lock.yaml

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "deps: add marked-highlight dependency"
```

---

### Task 2: Update EditorOptions type

**Files:**

- Modify: `src/core/types.ts`

**Step 1: Add prism option to EditorOptions**

```typescript
export interface EditorOptions {
  container: HTMLElement
  content?: string
  readonly?: boolean
  theme?: 'light' | 'dark'
  placeholder?: string
  prism?: object
}
```

**Step 2: Commit**

```bash
git add src/core/types.ts
git commit -m "feat: add prism option to EditorOptions"
```

---

### Task 3: Write failing test for syntax highlighting

**Files:**

- Create: `tests/syntax-highlight.test.ts`

**Step 1: Write test file**

````typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { parseMarkdownToHTML } from '../src/parser/markdown.js'

describe('Syntax Highlighting', () => {
  describe('without Prism', () => {
    it('should render code blocks without highlighting', () => {
      const markdown = '```js\nconst x = 1;\n```'
      const html = parseMarkdownToHTML(markdown)

      expect(html).toContain('<pre><code class="language-js">')
      expect(html).toContain('const x = 1;')
    })
  })

  describe('with Prism', () => {
    // Mock Prism with minimal highlighting
    const mockPrism = {
      languages: {
        javascript: true,
        typescript: true,
        python: true,
      },
      highlight: (code: string, grammar: unknown, language: string) => {
        return `<span class="token keyword">const</span> ${code.slice(6)}`
      },
    }

    it('should render code blocks with highlighting when Prism provided', () => {
      const markdown = '```js\nconst x = 1;\n```'
      const html = parseMarkdownToHTML(markdown, mockPrism)

      expect(html).toContain('<pre><code class="language-js">')
      expect(html).toContain('token keyword')
    })

    it('should support multiple languages', () => {
      const pythonCode = '```python\ndef foo():\n    pass\n```'
      const html = parseMarkdownToHTML(pythonCode, mockPrism)

      expect(html).toContain('class="language-python"')
    })
  })
})
````

**Step 2: Run test to verify it fails**

Run: `pnpm test tests/syntax-highlight.test.ts`
Expected: FAIL - parseMarkdownToHTML doesn't accept second parameter

**Step 3: Commit**

```bash
git add tests/syntax-highlight.test.ts
git commit -m "test: add syntax highlighting tests"
```

---

### Task 4: Update markdown parser to accept Prism

**Files:**

- Modify: `src/parser/markdown.ts`

**Step 1: Rewrite to accept optional prism parameter**

```typescript
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'

marked.use({
  gfm: true,
  breaks: true,
})

export function parseMarkdownToHTML(markdown: string, prism?: object): string {
  if (!markdown.trim()) return ''

  if (prism) {
    marked.use(
      markedHighlight({
        langPrefix: 'language-',
        highlight(code, lang) {
          const prismLang = (prism as any).languages?.[lang]
          if (prismLang && (prism as any).highlight) {
            try {
              return (prism as any).highlight(code, prismLang, lang)
            } catch {
              return code
            }
          }
          return code
        },
      })
    )
  }

  const result = marked(markdown)
  if (typeof result === 'string') {
    return result
  }
  return ''
}
```

**Step 2: Run test to verify it passes**

Run: `pnpm test tests/syntax-highlight.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add src/parser/markdown.ts
git commit -m "feat: add syntax highlighting support with marked-highlight"
```

---

### Task 5: Update Editor to pass Prism to parser

**Files:**

- Modify: `src/core/editor.ts`

**Step 1: Pass prism option to parseMarkdownToHTML**

Read the current editor.ts to find where parseMarkdownToHTML is called, then update it to pass the prism option.

**Step 2: Run tests**

Run: `pnpm test`
Expected: All tests pass

**Step 3: Commit**

```bash
git add src/core/editor.ts
git commit -m "feat: wire prism option to markdown parser"
```

---

### Task 6: Update README documentation

**Files:**

- Modify: `README.md`

**Step 1: Add syntax highlighting section to README**

Add after the Features section:

```markdown
## Syntax Highlighting

Code blocks in the preview can be syntax-highlighted using Prism.js. Provide your configured Prism instance via the `prism` option:

\`\`\`jsx
import { createEditor } from '@codxse/mitosis-js';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css';

const editor = createEditor({
container: document.getElementById('editor'),
content: '# Hello\n`js\nconst x = 1;\n`',
prism: Prism // Optional - without this, code blocks render without highlighting
});
\`\`\`

**Note:** You must install Prism.js and the language components you need separately. Prism is not bundled with this package.
```

**Step 2: Update dependencies section**

Add Prism.js to the example dependencies:

```bash
pnpm add prismjs
```

**Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add syntax highlighting documentation"
```

---

### Task 7: Final verification

**Step 1: Build the project**

Run: `pnpm run build`
Expected: Clean build with no errors

**Step 2: Run all tests**

Run: `pnpm test`
Expected: All tests pass

**Step 3: Commit any remaining changes**

```bash
git add -A
git commit -m "chore: final cleanup after marked-highlight integration"
```
