# Lab Website

A "lab notebook" style personal website showcasing interactive Rust+WASM experiments.

## Tech Stack

- **Experiments**: Rust compiled to WebAssembly
- **WASM build**: wasm-pack + wasm-bindgen
- **Site shell**: Plain HTML/CSS/JS
- **Deployment**: GitHub Pages via GitHub Actions

## Development

```bash
# Build an experiment
wasm-pack build experiments/game-of-life --target web --out-dir ../../site/experiments/game-of-life/pkg

# Serve locally
cd site && python -m http.server
```

## Project Structure

```
LabWebsite/
├── Cargo.toml              # Rust workspace root
├── experiments/            # Rust WASM crates
│   └── game-of-life/
├── site/                   # Static site files
│   ├── index.html
│   └── experiments/
└── .github/workflows/      # CI/CD
```
