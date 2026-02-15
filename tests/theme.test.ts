import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createEditor } from '../src/index.js'

describe('Theme Support', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)

    // Mock window.matchMedia for jsdom
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('should apply dark theme when theme option is set to dark', () => {
    const editor = createEditor({
      container,
      content: '# Hello',
      theme: 'dark',
    })

    const wrapper = container.querySelector('.mitosis-editor-wrapper')
    expect(wrapper).toBeTruthy()
    expect(wrapper.getAttribute('data-theme')).toBe('dark')
    expect(editor.getTheme()).toBe('dark')

    editor.destroy()
  })

  it('should apply light theme when theme option is set to light', () => {
    const editor = createEditor({
      container,
      content: '# Hello',
      theme: 'light',
    })

    const wrapper = container.querySelector('.mitosis-editor-wrapper')
    expect(wrapper).toBeTruthy()
    expect(wrapper.getAttribute('data-theme')).toBe('light')
    expect(editor.getTheme()).toBe('light')

    editor.destroy()
  })

  it('should apply auto theme by default and detect system preference', () => {
    const editor = createEditor({
      container,
      content: '# Hello',
    })

    const wrapper = container.querySelector('.mitosis-editor-wrapper')
    expect(wrapper).toBeTruthy()
    expect(wrapper.getAttribute('data-theme')).toMatch(/^(light|dark)$/)
    expect(editor.getTheme()).toMatch(/^(light|dark)$/)

    editor.destroy()
  })

  it('should change theme at runtime with setTheme', () => {
    const editor = createEditor({
      container,
      content: '# Hello',
      theme: 'light',
    })

    let wrapper = container.querySelector('.mitosis-editor-wrapper')
    expect(wrapper.getAttribute('data-theme')).toBe('light')

    editor.setTheme('dark')
    wrapper = container.querySelector('.mitosis-editor-wrapper')
    expect(wrapper.getAttribute('data-theme')).toBe('dark')
    expect(editor.getTheme()).toBe('dark')

    editor.destroy()
  })

  it('should apply custom css variables', () => {
    const editor = createEditor({
      container,
      content: '# Hello',
      theme: 'light',
      cssVars: {
        '--editor-bg': '#000000',
        '--editor-text': '#00ff00',
      },
    })

    const wrapper = container.querySelector('.mitosis-editor-wrapper')
    expect(wrapper.style.getPropertyValue('--editor-bg')).toBe('#000000')
    expect(wrapper.style.getPropertyValue('--editor-text')).toBe('#00ff00')

    editor.destroy()
  })
})
