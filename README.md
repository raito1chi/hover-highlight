# Hover Highlight

An Obsidian plugin that adds a soft cursor glow effect to Canvas, creating a subtle dot-grid spotlight that follows your mouse.

## Features

- **Dot-grid spotlight** — two overlaid dot grids (base gray + lit white) with a CSS mask creating a radial glow effect
- **Smooth cursor following** — configurable lerp-based animation for buttery-smooth movement
- **Fade animation** — glow fades out when the cursor stops moving
- **Customizable settings**:
  - Glow radius (50–500px)
  - Dot brightness (1–100%)
  - Cursor follow smoothness
  - Fade animation toggle
- **Performance-friendly** — uses `requestAnimationFrame`, GPU-accelerated CSS transforms, and `will-change` hints
- **Canvas-only** — activates only when viewing an Obsidian Canvas

## How it works

The plugin replaces the default Canvas dot background with a dynamic spotlight:
1. A base grid of gray dots is always visible at 40% opacity
2. A second grid of bright white dots is masked with a radial gradient centered on the cursor
3. The mask smoothly follows the cursor via linear interpolation
4. When the cursor stops, the mask fades out over 800ms

## Installation

### From Obsidian Community Plugins (once published)

1. Open **Settings** → **Community plugins**
2. Disable **Safe mode**
3. Click **Browse** and search for "Hover Highlight"
4. Install and enable

### Manual

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/raito1chi/hover-highlight/releases/latest)
2. Copy them into your vault's `.obsidian/plugins/hover-highlight/` folder
3. Enable the plugin in Obsidian Settings > Community Plugins

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Enable glow | Toggle the dot glow effect | On |
| Glow radius | Size of the glow in pixels (50–500) | 120 |
| Dot brightness | How bright the lit dots appear (1–100%) | 50% |
| Smoothness | How smoothly the glow follows the cursor (lower = smoother) | 0.12 |
| Fade animation | Fade the glow out after cursor stops moving | On |

## Development

```bash
git clone https://github.com/raito1chi/hover-highlight.git
cd hover-highlight
npm install
npm run dev       # watch mode
npm run build     # production build
npm run lint      # type check
```

## Structure

```
src/
  main.ts         Plugin entry point, canvas detection, lifecycle
  spotlight.ts    Core dot-grid renderer with CSS mask animation
  settings.ts     Settings tab UI
  styles.css      Dot layer styles
```

## Compatibility

- Requires Obsidian v0.15.0+
- Works on desktop and mobile

## License

MIT
