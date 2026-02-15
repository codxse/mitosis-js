# marked-highlight with Prism.js Integration

## Overview

Add syntax highlighting to code blocks in the HTML preview using `marked-highlight` and Prism.js, with extensible and configurable language support.

## API Design

Add optional `prism` property to `EditorOptions`:

```typescript
export interface EditorOptions {
  container: HTMLElement
  content?: string
  readonly?: boolean
  theme?: 'light' | 'dark'
  placeholder?: string
  prism?: object // User's configured Prism instance
}
```

## Architecture

**When Prism IS provided:**

- Configure `marked-highlight` extension with the user's Prism instance
- Register the extension with `marked.use()`
- Code blocks render with syntax highlighting

**When Prism is NOT provided:**

- Skip `marked-highlight` registration entirely
- Code blocks render as plain `<pre><code>` elements
- No errors, graceful degradation

## Implementation Changes

1. **Update `src/parser/markdown.ts`** - Accept optional Prism and configure highlight
2. **Update `src/core/types.ts`** - Add `prism?: object` to EditorOptions
3. **Update `src/core/editor.ts`** - Pass prism to markdown parser
4. **Add `marked-highlight` dependency** - To package.json

## Testing

Create `tests/syntax-highlight.test.ts`:

- Test with Prism → code blocks have language classes and highlighting markup
- Test without Prism → code blocks render as plain HTML
- Test multiple languages (js, ts, python)
