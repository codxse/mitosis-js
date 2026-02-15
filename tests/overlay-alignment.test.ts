import { describe, it, expect } from 'vitest'
import { highlightMarkdown } from '../src/highlight/markdown'

describe('Overlay Alignment - Critical', () => {
  it('should not corrupt text when highlighting code fences', () => {
    const originalText = '```javascript\nconst x = 5;\n```'
    const result = highlightMarkdown(originalText)

    // Extract plain text from HTML (remove all tags)
    const plainText = result.replace(/<span[^>]*>/g, '').replace(/<\/span>/g, '')

    // The escaped text should match original
    expect(plainText).toContain('javascript')
    expect(plainText).toContain('const x = 5;')
  })

  it('should preserve exact line structure with code fences', () => {
    const text = '```javascript\nconst x = 5;\n```'
    const result = highlightMarkdown(text)

    // Count newlines - should be preserved
    const originalNewlines = (text.match(/\n/g) || []).length
    const resultNewlines = (result.match(/\n/g) || []).length

    expect(resultNewlines).toBe(originalNewlines)
  })

  it('should not add extra backticks when highlighting', () => {
    const text = '```\ncode\n```'
    const result = highlightMarkdown(text)

    // Count backticks - original: 6, result should have 6
    const originalBackticks = 6
    const resultBackticks = (result.match(/`/g) || []).length

    expect(resultBackticks).toBe(originalBackticks)
  })

  it('should not auto-complete incomplete code fences', () => {
    const text = '```javascript\nconst x = 5;' // No closing ```
    const result = highlightMarkdown(text)

    // Count backticks - original: 3, result should have 3 (no extra added)
    const originalBackticks = 3
    const resultBackticks = (result.match(/`/g) || []).length

    expect(resultBackticks).toBe(originalBackticks)
  })

  it('typing progression should not corrupt display', () => {
    const progression = [
      '`',
      '``',
      '```',
      '```j',
      '```ja',
      '```jav',
      '```java',
      '```javas',
      '```javasc',
      '```javascr',
      '```javascri',
      '```javascript',
      '```javascript\n',
      '```javascript\nco',
      '```javascript\ncon',
      '```javascript\ncons',
      '```javascript\nconst',
      '```javascript\nconst ',
      '```javascript\nconst x',
      '```javascript\nconst x ',
      '```javascript\nconst x =',
      '```javascript\nconst x = ',
      '```javascript\nconst x = 5',
      '```javascript\nconst x = 5;',
      '```javascript\nconst x = 5;\n',
      '```javascript\nconst x = 5;\n`',
      '```javascript\nconst x = 5;\n``',
      '```javascript\nconst x = 5;\n```',
    ]

    progression.forEach((text) => {
      const result = highlightMarkdown(text)

      // Should never add extra characters/backticks
      const originalBackticks = (text.match(/`/g) || []).length
      const resultBackticks = (result.match(/`/g) || []).length
      expect(resultBackticks).toBe(originalBackticks)

      // Result should be valid string
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })
  })
})
