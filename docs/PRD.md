# PRD: Lab Website

## Overview

A "lab notebook" style personal website showcasing interactive Rust+WASM experiments. Each experiment is a self-contained demo with a short write-up explaining what it does and what was learned. The site demonstrates systems programming expertise through creative, playable web experiences.

---

## Context & Motivation

### Problem
Traditional developer portfolio sites (resume + project links) are no longer differentiating in 2026. AI agents can summarize anyone's LinkedIn instantly. Static portfolios don't showcase how someone thinks.

### Solution
Build a collection of small, interactive experiments that:
- Demonstrate technical depth (Rust, WASM, systems thinking)
- Are immediately playable in the browser
- Include short-form write-ups showing the builder's thought process
- Use the tech stack itself as a differentiator

### Target Audience
- Potential employers/clients evaluating technical skills
- Other developers who enjoy creative coding experiments
- The builder (Jan) - as a playground for learning and expression

---

## Goals

### Primary Goals
1. **Working pipeline**: Rust code → WASM build → deployed to web
2. **First experiment live**: Game of Life as proof of concept
3. **Minimal viable site**: Home page + experiment page, functional not fancy

### Non-Goals (for v1)
- No blog engine or CMS
- No categories, tags, or search
- No analytics or tracking
- No complex frameworks (React, etc.)

---

## Technical Architecture

### Repository Structure
```
LabWebsite/
├── Cargo.toml                    # Rust workspace root
├── experiments/
│   └── game-of-life/
│       ├── Cargo.toml            # WASM crate config
│       └── src/
│           └── lib.rs            # Rust implementation
├── site/
│   ├── index.html                # Home page (list of experiments)
│   ├── styles.css                # Global styles
│   └── experiments/
│       └── game-of-life/
│           ├── index.html        # Demo page with canvas + write-up
│           └── index.js          # WASM loader + canvas rendering
├── docs/
│   ├── PRD.md                    # This document (committed)
│   └── plans/                    # Local working plans (gitignored)
│       └── .gitkeep
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI: build WASM + deploy to GitHub Pages
├── .gitignore                    # Includes docs/plans/*
├── README.md
└── CLAUDE.md                     # Instructions for Claude Code sessions
```

### .gitignore Content
```gitignore
# Build artifacts
target/
site/experiments/*/pkg/

# Local plans (not committed)
docs/plans/*
!docs/plans/.gitkeep

# OS files
.DS_Store
```

### Tech Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Experiments | Rust | Systems language, compiles to efficient WASM |
| WASM build | wasm-pack + wasm-bindgen | Standard Rust→WASM toolchain |
| DOM/Canvas | web-sys | Direct browser API access from Rust |
| Site shell | Plain HTML/CSS/JS | No framework overhead, experiments are the focus |
| Deployment | GitHub Pages | Free, simple, good enough for static sites |
| CI | GitHub Actions | Build WASM on push, deploy automatically |

### Key Dependencies (Rust)
```toml
[dependencies]
wasm-bindgen = "0.2"
web-sys = { version = "0.3", features = ["Window", "Document", "CanvasRenderingContext2d", "HtmlCanvasElement"] }
js-sys = "0.3"
```

---

## Feature Specifications

### F1: Home Page

**Description**: Landing page showing all available experiments.

**Requirements**:
- Grid/list layout of experiment cards
- Each card shows: title, one-line description, thumbnail (optional)
- Cards link to individual experiment pages
- Most recent experiment first
- Responsive: works on mobile

**Acceptance Criteria**:
- [ ] Page loads and displays at least one experiment card
- [ ] Clicking card navigates to experiment page
- [ ] Looks reasonable on phone and desktop

---

### F2: Experiment Page Template

**Description**: Template for individual experiment pages.

**Requirements**:
- Live WASM demo embedded at top (canvas element)
- Controls below demo (play/pause, reset, etc. as needed)
- Write-up section below controls (rendered from markdown or inline HTML)
- Link to source code (GitHub)
- Date published

**Acceptance Criteria**:
- [ ] WASM module loads and runs
- [ ] Demo is interactive
- [ ] Write-up is readable
- [ ] Source link works

---

### F3: Game of Life Experiment (Proof of Concept)

**Description**: Conway's Game of Life implemented in Rust, rendered to canvas.

**Rust Implementation**:
- `Universe` struct holding grid of cells
- `Cell` enum: Alive | Dead
- `tick()` method: advance one generation using standard rules
- Expose to JS: `new()`, `tick()`, `toggle_cell(row, col)`, `cells() -> *const Cell`

**JS/Canvas**:
- Load WASM module
- Render grid to canvas (black = alive, white = dead)
- Animation loop calling `tick()` + render
- Click to toggle cells
- Play/pause button

**Write-up Content** (300-500 words):
- What is Game of Life
- Why it's a good first WASM project
- Interesting bits: memory layout, passing data to JS
- What's next

**Acceptance Criteria**:
- [ ] Grid renders correctly
- [ ] Cells evolve according to GoL rules
- [ ] Can pause/resume simulation
- [ ] Can click to toggle cells
- [ ] Runs at reasonable frame rate (30+ fps)

---

### F4: Build & Deploy Pipeline

**Description**: Automated build and deployment via GitHub Actions.

**Workflow Steps**:
1. Trigger on push to main
2. Install Rust + wasm-pack
3. Build each experiment: `wasm-pack build experiments/<name> --target web --out-dir ../../site/experiments/<name>/pkg`
4. Deploy `site/` folder to GitHub Pages

**Acceptance Criteria**:
- [ ] Push to main triggers build
- [ ] WASM artifacts appear in site folder
- [ ] Site is accessible at `<username>.github.io/LabWebsite`

---

## Implementation Tasks

### Phase 1: Repository Setup
1. Initialize git in `LabWebsite` folder
2. Create docs/ folder with PRD.md and plans/ subfolder
3. Create .gitignore (includes docs/plans/*, target/, pkg/)
4. Create Cargo.toml workspace config
5. Create experiments/game-of-life crate with WASM config
6. Create site/ folder structure
7. Create .github/workflows/deploy.yml
8. Create CLAUDE.md with project context
9. Create README.md with basic project description

### Phase 2: Game of Life Implementation
1. Implement Universe and Cell structs
2. Implement tick() logic
3. Add wasm-bindgen exports
4. Build with wasm-pack and verify .wasm output

### Phase 3: Canvas Rendering
1. Create game-of-life/index.html with canvas
2. Create index.js to load WASM and render
3. Implement animation loop
4. Add click-to-toggle interaction
5. Add play/pause button

### Phase 4: Site Shell
1. Create home page with experiment card
2. Create shared styles.css
3. Add write-up content to experiment page

### Phase 5: Deployment
1. Configure GitHub Pages in repo settings
2. Test GitHub Actions workflow
3. Verify live site works

---

## Future Experiments (Ideas)

After Game of Life is working, potential next experiments:
- **Raytracer**: Real-time software raytracing, shows off Rust performance
- **Audio Visualizer**: WebAudio API + canvas, music-reactive graphics
- **Physics Sim**: 2D rigid body physics with collisions
- **Particle System**: GPU-like effects with thousands of particles
- **Maze Generator**: Various algorithms visualized (DFS, Prim's, etc.)

Each new experiment follows the same pattern: add crate to experiments/, add page to site/experiments/.

---

## Success Criteria

**v1 is complete when**:
1. Game of Life is playable at the live URL
2. Home page links to the experiment
3. Experiment page has working demo + write-up
4. Adding a new experiment is straightforward (documented process)
