# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Syntax highlighting for code blocks using Prism.js via `prism` option
- `PrismInstance` interface for type-safe Prism integration
- ESLint and Prettier for code quality and consistent formatting

### Changed

- Improved cursor positioning logic extraction for better code readability

### Fixed

- Event listener memory leak in PreviewPane (handler now stored as class property)
- TypeScript strict mode compliance issues

## [1.0.0] - 2025-02-15

### Added

- Split-view markdown editor with live preview
- Syntax highlighting for markdown syntax in editor
- Keyboard shortcuts (Cmd/Ctrl+B, I, K, E, Shift+S, Tab)
- Scroll sync between editor and preview panels
- Resizable panels with drag handle
- Framework-agnostic design (works with React, Vue, Svelte, vanilla JS)
- `getMarkdown()`, `getHTML()`, `getBoth()` methods for content retrieval
- `setContent()` method for updating editor content
- Optional `readonly` and `theme` configuration options

[Unreleased]: https://github.com/codxse/mitosis-js/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/codxse/mitosis-js/releases/tag/v1.0.0
