# Dark Mode & CSS Customization Design

**Date:** 2026-02-15
**Status:** Approved

## Overview

Add dark/light theme support to the editor with CSS variable-based theming, allowing users to customize via external CSS files or custom variables.

## Theme Values

- **Default:** `auto` (system preference via `prefers-color-scheme`)
- **Options:** `'light' | 'dark' | 'auto'`
- **Dark theme:** Dracula-inspired colors
- **Light theme:** Plain white paper

## File Structure

```
dist/styles/
├── editor.css          # Base + CSS variables only (always imported)
├── theme-light.css     # Light theme overrides (optional import)
└── theme-dark.css      # Dark theme overrides (optional import)
```

### Import Examples

```js
// Dark mode only
import '@codxse/mitosis-js/dist/styles/editor.css'
import '@codxse/mitosis-js/dist/styles/theme-dark.css'

// Light mode only
import '@codxse/mitosis-js/dist/styles/editor.css'
import '@codxse/mitosis-js/dist/styles/theme-light.css'

// Auto (both themes)
import '@codxse/mitosis-js/dist/styles/editor.css'
import '@codxse/mitosis-js/dist/styles/theme-light.css'
import '@codxse/mitosis-js/dist/styles/theme-dark.css'
```

## CSS Variables (in editor.css)

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
}
```

## Dark Theme (theme-dark.css)

```css
.mitosis-editor-wrapper[data-theme="dark"] {
  --editor-bg: #282a36;
  --editor-text: #f8f8f2;
  --editor-border: #44475a;
  --editor-caret: #f8f8f2;
  --editor-placeholder: #6272a4;
  --editor-selection: #44475a;

  --preview-bg: #282a36;
  --preview-text: #f8f8f2;
  --preview-border: #44475a;
  --preview-code-bg: #44475a;
  --preview-link: #8be9fd;

  --divider-bg: #44475a;
  --divider-hover: #6272a4;
}
```

## Light Theme (theme-light.css)

```css
.mitosis-editor-wrapper[data-theme="light"] {
  /* Uses default values from editor.css */
}
```

## API Changes

### types.ts

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

### Editor Class (editor.ts)

New methods:
- `setTheme(theme: 'light' | 'dark' | 'auto'): void`
- `getTheme(): 'light' | 'dark'`

## Implementation Steps

1. Refactor inline CSS in `two-panel-layout.ts`, `editor-pane.ts`, `preview-pane.ts` to use CSS variables
2. Extract base CSS variables to `src/styles/editor.css`
3. Create `src/styles/theme-light.css`
4. Create `src/styles/theme-dark.css`
5. Update build to output separate CSS files
6. Update `Editor` class to apply `data-theme` attribute and handle `auto` with `matchMedia`
7. Update README with theming documentation
