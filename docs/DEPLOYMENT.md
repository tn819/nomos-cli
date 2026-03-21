# Documentation Worktree Setup

The documentation is deployed to GitHub Pages using a git worktree.

## Structure

- `main` branch: Source code and documentation source
- `gh-pages` branch: Built static site (via worktree at `docs-dist/`)
- `docs-dist/`: Git worktree pointing to `gh-pages` branch

## Setup

Already done:
```bash
# Created gh-pages branch
git checkout --orphan gh-pages
git rm -rf .
echo "# Documentation" > README.md
git add README.md
git commit -m "Initial gh-pages commit"
git checkout main

# Added worktree
mkdir -p docs-dist
git worktree add docs-dist gh-pages
```

## Commands

### Development
```bash
bun run docs:dev          # Start dev server
bun run docs:build        # Build to docs-dist/
bun run docs:preview      # Preview built site
```

### Deployment
```bash
bun run docs:deploy       # Build and deploy to GitHub Pages
```

Or manually:
```bash
bun run docs:generate     # Generate SDK + CLI docs
bun run docs:build        # Build VitePress to docs-dist/
cd docs-dist
git add -A
git commit -m "Deploy docs"
git push origin gh-pages
```

## GitHub Pages Configuration

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`
4. Site will be at: `https://tn819.github.io/nomos-cli/`

## Worktree Management

```bash
# List worktrees
git worktree list

# Remove worktree (if needed)
git worktree remove docs-dist

# Re-add worktree
git worktree add docs-dist gh-pages
```
