import { describe, it, expect } from 'vitest'
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
    const mockPrism = {
      languages: {
        javascript: true,
        typescript: true,
        python: true,
      },
      highlight: (code: string, _grammar: unknown, _language: string) => {
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

      // Verify Prism highlighting was applied (not just base markdown parsing)
      expect(html).toContain('class="language-python"')
      expect(html).toContain('token keyword')
    })
  })
})
