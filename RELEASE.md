# Release Guide

This project uses [standard-version](https://github.com/conventional-changelog/standard-version) for versioning and changelog management.

## Prerequisites

- Node.js and pnpm installed
- Commit access to the repository

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat:` | New feature | minor (x.**y**.z) |
| `fix:` | Bug fix | patch (x.y.**z**) |
| `BREAKING CHANGE:` | Breaking change | major (**x**.y.z) |

Other types (`chore:`, `docs:`, `refactor:`, etc.) won't trigger a version bump.

### Examples

```bash
git commit -m "feat: add dark mode support"
git commit -m "fix: resolve login redirect issue"
git commit -m "feat: change API response format

BREAKING CHANGE: The API now returns JSON instead of XML"
```

---

## Bump Version

### Auto-detect (based on commits)

```bash
pnpm release
```

standard-version will analyze your commits since last release and determine the appropriate bump.

### Using shortcuts

```bash
# Patch release (1.2.0 → 1.2.1)
pnpm run release:patch

# Minor release (1.2.0 → 1.3.0)
pnpm run release:minor

# Major release (1.2.0 → 2.0.0)
pnpm run release:major

# Dry run (preview only)
pnpm run release:dry
```

### Force specific version bump

```bash
# Specific version
pnpm release -- --release-as 2.0.0
```

---

## Changelog

CHANGELOG.md is automatically generated when running `pnpm release`. It includes:

- All `feat:` commits under "Features"
- All `fix:` commits under "Bug Fixes"
- Links to commits and issues

### Preview changelog without releasing

```bash
pnpm release -- --dry-run
```

---

## Release Process

### 1. Ensure working directory is clean

```bash
git status
```

### 2. Run release

```bash
pnpm release
```

This will:
- Bump version in `package.json`
- Update `CHANGELOG.md`
- Create a git tag (e.g., `v1.2.0`)
- Commit changes

### 3. Push to remote

```bash
git push --follow-tags origin master
```

The `--follow-tags` flag pushes both commits and tags.

---

## Publish to npm

### Manual publish

After pushing tags:

```bash
npm publish
```

### Automated publish

Add to your CI workflow (GitHub Actions example):

```yaml
name: Release

on:
  push:
    branches: [master]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - run: pnpm install

      - run: pnpm release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

      - run: git push --follow-tags origin master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Create an NPM token at https://www.npmjs.com/settings/[your-username]/tokens and add it as `NPM_TOKEN` secret in your repository settings.

---

## First Time Setup

If this is your first release:

```bash
# Install dependencies
pnpm install

# Create initial release (will bump from 0.0.0 to 1.0.0)
pnpm release -- --release-as minor
```

---

## Rollback

If something goes wrong:

```bash
# Remove the last tag
git tag -d v1.2.0

# Remove the release commit
git reset --hard HEAD~1

# Push the changes
git push --force origin master
```
