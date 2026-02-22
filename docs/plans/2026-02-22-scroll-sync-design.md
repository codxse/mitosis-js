# Delta-based Scroll Sync

## Problem

- User scrolls preview to see something (long image), types more content, preview jumps away
- Switching to editor and scrolling causes preview to jump to editor's absolute position, losing preview context

## Design

### Mental Model

Preview remembers where it is. Editor scroll moves preview by the same *delta*, not to the same absolute position. Typing preserves preview position. Preview scrolls independently without moving editor.

### Behavior

| Event | Preview | Editor |
|-------|---------|--------|
| User types | Re-renders, restores to stored ratio | No change |
| Editor scrolls | Moves by same delta | N/A |
| Preview scrolls | Stores new ratio | No change |

### State (TwoPanelLayout)

```
previewScrollRatio: number = 0       // preview's current 0-1 position
lastEditorScrollRatio: number = 0    // for computing deltas
```

### Flows

**Editor scrolls 30% → 40%, preview at 70%:**
```
delta = 0.40 - 0.30 = 0.10
previewScrollRatio = 0.70 + 0.10 = 0.80
```

**User types (preview at 80%):**
```
setContent(newHTML)    // innerHTML replaced, scroll resets
setScrollRatio(0.80)   // restore to stored ratio
```

**User scrolls preview to 50%:**
```
previewScrollRatio = 0.50  // just remember it, editor unchanged
```

### Ratio Fix

Current: `scrollTop / scrollHeight` → values 0–0.85, not 0–1.
Fix: `scrollTop / (scrollHeight - clientHeight)` → true 0–1 percentage.
Panes compute and send ratio directly via `onScroll(ratio)`.

### Files Changed

- `src/view/editor-pane.ts` — onScroll sends ratio
- `src/view/preview-pane.ts` — onScroll sends ratio
- `src/view/two-panel-layout.ts` — delta-based sync logic, scroll restoration on typing
