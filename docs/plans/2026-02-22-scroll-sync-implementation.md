# Delta-based Scroll Sync Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement delta-based scroll sync so preview maintains position during typing and follows editor scroll via delta rather than absolute ratio.

**Architecture:** Store preview's scroll ratio (0-1). On editor scroll, apply change delta to preview. On typing, restore preview to stored ratio after re-render. Preview scrolls independently without moving editor.

**Tech Stack:** TypeScript, Vitest with jsdom

**Design doc:** `docs/plans/2026-02-22-scroll-sync-design.md`

**Note:** jsdom has no layout engine — `scrollHeight`, `clientHeight`, `scrollTop` are 0 by default. Tests use `mockScrollable()` helper with `Object.defineProperty` to simulate scroll geometry. jsdom also does NOT fire scroll events on programmatic `scrollTop` changes, so feedback-loop issues won't surface in tests. Manual browser testing recommended after implementation.

---

### Task 1: EditorPane emits 0-1 scroll ratio

**Files:**
- Create: `tests/scroll-sync.test.ts`
- Modify: `src/view/editor-pane.ts`

**Step 1: Write the failing test**

```ts
// tests/scroll-sync.test.ts
import { describe, it, expect, afterEach } from 'vitest'
import { EditorPane } from '../src/view/editor-pane'

function mockScrollable(element: HTMLElement, scrollHeight: number, clientHeight: number) {
  let _scrollTop = 0
  Object.defineProperty(element, 'scrollHeight', { value: scrollHeight, configurable: true })
  Object.defineProperty(element, 'clientHeight', { value: clientHeight, configurable: true })
  Object.defineProperty(element, 'scrollTop', {
    get: () => _scrollTop,
    set: (v: number) => { _scrollTop = v },
    configurable: true,
  })
  return { setScrollTop: (v: number) => { _scrollTop = v } }
}

describe('EditorPane scroll ratio', () => {
  let container: HTMLElement
  let editorPane: EditorPane

  afterEach(() => {
    editorPane.destroy()
    container.remove()
  })

  it('sends 0-1 ratio on scroll', () => {
    let receivedRatio: number | null = null
    container = document.createElement('div')
    editorPane = new EditorPane({
      container,
      onScroll: (ratio) => { receivedRatio = ratio },
    })

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    const mock = mockScrollable(textarea, 1000, 200) // maxScroll = 800
    mock.setScrollTop(400) // ratio = 400/800 = 0.5
    textarea.dispatchEvent(new Event('scroll'))

    expect(receivedRatio).toBeCloseTo(0.5)
  })

  it('sends 0 when content fits without scrollbar', () => {
    let receivedRatio: number | null = null
    container = document.createElement('div')
    editorPane = new EditorPane({
      container,
      onScroll: (ratio) => { receivedRatio = ratio },
    })

    const textarea = container.querySelector('textarea') as HTMLTextAreaElement
    mockScrollable(textarea, 200, 200) // maxScroll = 0
    textarea.dispatchEvent(new Event('scroll'))

    expect(receivedRatio).toBe(0)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/scroll-sync.test.ts`
Expected: FAIL — onScroll currently expects `(scrollTop, scrollHeight)`, ratio assertion fails

**Step 3: Write minimal implementation**

In `src/view/editor-pane.ts`:

Change the callback type:
```ts
private onScroll: (ratio: number) => void
```

Change the constructor config type:
```ts
onScroll?: (ratio: number) => void
```

Change `handleScroll`:
```ts
private handleScroll(): void {
  const { scrollTop, scrollHeight, clientHeight } = this.textarea
  this.highlightOverlay.scrollTop = scrollTop
  const maxScroll = scrollHeight - clientHeight
  this.onScroll(maxScroll > 0 ? scrollTop / maxScroll : 0)
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/scroll-sync.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/scroll-sync.test.ts src/view/editor-pane.ts
git commit -m "feat: EditorPane emits 0-1 scroll ratio"
```

---

### Task 2: PreviewPane emits 0-1 scroll ratio

**Files:**
- Modify: `tests/scroll-sync.test.ts`
- Modify: `src/view/preview-pane.ts`

**Step 1: Write the failing test**

Add to `tests/scroll-sync.test.ts`:

```ts
import { PreviewPane } from '../src/view/preview-pane'

describe('PreviewPane scroll ratio', () => {
  let container: HTMLElement
  let previewPane: PreviewPane

  afterEach(() => {
    previewPane.destroy()
    container.remove()
  })

  it('sends 0-1 ratio on scroll', () => {
    let receivedRatio: number | null = null
    container = document.createElement('div')
    previewPane = new PreviewPane({
      container,
      onScroll: (ratio) => { receivedRatio = ratio },
    })

    const content = container.querySelector('.mitosis-preview-content') as HTMLDivElement
    const mock = mockScrollable(content, 2000, 300) // maxScroll = 1700
    mock.setScrollTop(850) // ratio = 850/1700 = 0.5
    content.dispatchEvent(new Event('scroll'))

    expect(receivedRatio).toBeCloseTo(0.5)
  })

  it('sends 0 when content fits without scrollbar', () => {
    let receivedRatio: number | null = null
    container = document.createElement('div')
    previewPane = new PreviewPane({
      container,
      onScroll: (ratio) => { receivedRatio = ratio },
    })

    const content = container.querySelector('.mitosis-preview-content') as HTMLDivElement
    mockScrollable(content, 300, 300) // maxScroll = 0
    content.dispatchEvent(new Event('scroll'))

    expect(receivedRatio).toBe(0)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/scroll-sync.test.ts`
Expected: FAIL — PreviewPane onScroll currently expects `(scrollTop, scrollHeight)`

**Step 3: Write minimal implementation**

In `src/view/preview-pane.ts`:

Change the callback type:
```ts
private onScroll: (ratio: number) => void
```

Change the constructor config type:
```ts
onScroll?: (ratio: number) => void
```

Change `handleScroll`:
```ts
private handleScroll(): void {
  const { scrollTop, scrollHeight, clientHeight } = this.content
  const maxScroll = scrollHeight - clientHeight
  this.onScroll(maxScroll > 0 ? scrollTop / maxScroll : 0)
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/scroll-sync.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/scroll-sync.test.ts src/view/preview-pane.ts
git commit -m "feat: PreviewPane emits 0-1 scroll ratio"
```

---

### Task 3: Delta-based editor-to-preview scroll sync

**Files:**
- Modify: `tests/scroll-sync.test.ts`
- Modify: `src/view/two-panel-layout.ts`

**Step 1: Write the failing test**

Add to `tests/scroll-sync.test.ts`:

```ts
import { TwoPanelLayout } from '../src/view/two-panel-layout'

describe('TwoPanelLayout scroll sync', () => {
  let container: HTMLElement
  let layout: TwoPanelLayout
  let textarea: HTMLTextAreaElement
  let previewContent: HTMLDivElement

  function setup() {
    container = document.createElement('div')
    layout = new TwoPanelLayout({ container })
    textarea = container.querySelector('.mitosis-textarea') as HTMLTextAreaElement
    previewContent = container.querySelector('.mitosis-preview-content') as HTMLDivElement
    return {
      editor: mockScrollable(textarea, 1000, 200),    // maxScroll = 800
      preview: mockScrollable(previewContent, 2000, 300), // maxScroll = 1700
    }
  }

  afterEach(() => {
    layout.destroy()
    container.remove()
  })

  it('editor scroll moves preview by delta from current position', () => {
    const { editor, preview } = setup()

    // Preview manually scrolled to 70%
    preview.setScrollTop(1190) // 1700 * 0.7
    previewContent.dispatchEvent(new Event('scroll'))

    // Editor scrolls from 0% to 12.5%
    editor.setScrollTop(100) // 100/800 = 0.125
    textarea.dispatchEvent(new Event('scroll'))

    // Preview: 70% + 12.5% = 82.5% → 1700 * 0.825 = 1402.5
    expect(previewContent.scrollTop).toBeCloseTo(1402.5, 0)
  })

  it('multiple editor scrolls accumulate deltas', () => {
    const { editor } = setup()

    // Editor scrolls 0% → 25%
    editor.setScrollTop(200) // 200/800 = 0.25
    textarea.dispatchEvent(new Event('scroll'))
    expect(previewContent.scrollTop).toBeCloseTo(1700 * 0.25, 0) // 425

    // Editor scrolls 25% → 50%
    editor.setScrollTop(400) // 400/800 = 0.5
    textarea.dispatchEvent(new Event('scroll'))
    expect(previewContent.scrollTop).toBeCloseTo(1700 * 0.5, 0) // 850
  })

  it('clamps preview ratio to 0-1 range', () => {
    const { editor, preview } = setup()

    // Preview at 90%
    preview.setScrollTop(1530) // 1700 * 0.9
    previewContent.dispatchEvent(new Event('scroll'))

    // Editor scrolls 0% → 50% (delta 0.5, total would be 1.4)
    editor.setScrollTop(400)
    textarea.dispatchEvent(new Event('scroll'))

    // Should clamp to 100% → 1700
    expect(previewContent.scrollTop).toBeCloseTo(1700, 0)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/scroll-sync.test.ts`
Expected: FAIL — TwoPanelLayout still uses old syncScroll with absolute ratio

**Step 3: Write minimal implementation**

In `src/view/two-panel-layout.ts`:

Add state:
```ts
private previewScrollRatio = 0
private lastEditorScrollRatio = 0
```

Update EditorPane config callback:
```ts
onScroll: (ratio) => this.handleEditorScroll(ratio),
```

Update PreviewPane config callback:
```ts
onScroll: (ratio) => this.handlePreviewScroll(ratio),
```

Replace `syncScroll` with:
```ts
private handleEditorScroll(ratio: number): void {
  const delta = ratio - this.lastEditorScrollRatio
  this.lastEditorScrollRatio = ratio
  this.previewScrollRatio = Math.max(0, Math.min(1, this.previewScrollRatio + delta))
  this.previewPane.setScrollRatio(this.previewScrollRatio)
}

private handlePreviewScroll(ratio: number): void {
  this.previewScrollRatio = ratio
}
```

Remove old `syncScroll` method entirely.

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/scroll-sync.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/scroll-sync.test.ts src/view/two-panel-layout.ts
git commit -m "feat: delta-based editor-to-preview scroll sync"
```

---

### Task 4: Preview scroll does not move editor

**Files:**
- Modify: `tests/scroll-sync.test.ts`

**Step 1: Write the regression test**

Add to the `TwoPanelLayout scroll sync` describe block:

```ts
it('preview scroll does not move editor', () => {
  const { editor, preview } = setup()

  // Editor at 50%
  editor.setScrollTop(400)

  // Preview scrolls to 100%
  preview.setScrollTop(1700)
  previewContent.dispatchEvent(new Event('scroll'))

  // Editor unchanged
  expect(textarea.scrollTop).toBe(400)
})
```

**Step 2: Run test to verify it passes**

Run: `pnpm vitest run tests/scroll-sync.test.ts`
Expected: PASS (already implemented — handlePreviewScroll only stores ratio)

**Step 3: Commit**

```bash
git add tests/scroll-sync.test.ts
git commit -m "test: verify preview scroll does not move editor"
```

---

### Task 5: Typing preserves preview scroll position

**Files:**
- Modify: `tests/scroll-sync.test.ts`
- Modify: `src/view/two-panel-layout.ts`

**Step 1: Write the failing test**

Add to the `TwoPanelLayout scroll sync` describe block:

```ts
it('typing preserves preview scroll position', () => {
  const { preview } = setup()

  // Preview manually scrolled to 60%
  preview.setScrollTop(1020) // 1700 * 0.6
  previewContent.dispatchEvent(new Event('scroll'))

  // User types
  textarea.value = '# Hello\n\nSome new content'
  textarea.dispatchEvent(new Event('input', { bubbles: true }))

  // Preview restored to 60%
  expect(previewContent.scrollTop).toBeCloseTo(1020, 0)
})
```

**Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/scroll-sync.test.ts`
Expected: FAIL — handleEditorUpdate doesn't restore scroll after setContent

**Step 3: Write minimal implementation**

In `src/view/two-panel-layout.ts`, update `handleEditorUpdate`:

```ts
private handleEditorUpdate(content: string): void {
  this.content = content
  this.previewPane.setContent(content)
  this.previewPane.setScrollRatio(this.previewScrollRatio)
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/scroll-sync.test.ts`
Expected: PASS

**Step 5: Run full test suite**

Run: `pnpm vitest run`
Expected: ALL tests pass (scroll-sync + keyboard-shortcuts + theme + overlay-alignment + syntax-highlight)

**Step 6: Commit**

```bash
git add tests/scroll-sync.test.ts src/view/two-panel-layout.ts
git commit -m "feat: typing preserves preview scroll position"
```

---

### Task 6: Final verification and cleanup

**Step 1: Run full test suite**

Run: `pnpm vitest run`
Expected: All tests pass

**Step 2: Verify no leftover debug code**

Check `src/view/two-panel-layout.ts` for any `console.log` statements. Remove if found.

**Step 3: Manual browser test** (recommended)

Open the dev server, verify:
- [ ] Editor scroll → preview follows with delta (not absolute jump)
- [ ] Preview scroll → editor stays put
- [ ] Type text → preview stays at same position
- [ ] Scroll preview to see long image → type → preview stays on image
- [ ] Empty document → no errors

**Step 4: Final commit if cleanup needed**

```bash
git add -A
git commit -m "chore: cleanup scroll sync implementation"
```
