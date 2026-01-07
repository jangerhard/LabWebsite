# CLAUDE.md

Project context for Claude Code sessions.

## Project Overview

Lab Website - a portfolio site with interactive Rust+WASM experiments. Each experiment is a self-contained demo with a canvas-based visualization.

## Repository Structure

- `Cargo.toml` - Workspace root with `members = ["experiments/*"]`
- `experiments/` - Rust crates compiled to WASM
  - `game-of-life/` - Conway's Game of Life implementation
- `site/` - Static HTML/CSS/JS
  - `index.html` - Home page
  - `experiments/<name>/` - Individual experiment pages with WASM
- `docs/PRD.md` - Product requirements document
- `.github/workflows/deploy.yml` - CI/CD pipeline

## Common Commands

```bash
# Check Rust code
cargo check

# Build WASM for an experiment
wasm-pack build experiments/game-of-life --target web --out-dir ../../site/experiments/game-of-life/pkg

# Serve site locally
cd site && python -m http.server 8000
```

## Key Dependencies

- `wasm-bindgen` - Rust/JS interop
- `web-sys` - Browser API bindings
- `js-sys` - JavaScript types

## Adding a New Experiment

1. Create crate: `cargo new experiments/<name> --lib`
2. Configure Cargo.toml with cdylib + wasm dependencies
3. Create `site/experiments/<name>/` with index.html and index.js
4. Add card to home page
