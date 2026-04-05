# Guitar Codes — Style Guide

## Color Palette

All colors defined in `src/styles.css` via CSS custom properties:

| Variable | Value | Usage |
|----------|-------|-------|
| `--color-bg-primary` | `#0a0a0a` | Page background |
| `--color-bg-fretboard` | `#1a1a1a` | Fretboard cell background, card backgrounds |
| `--color-text-primary` | `#cccccc` | Main text |
| `--color-fret-line` | `#333333` | Borders, dividers, fret lines |
| `--color-note-root` | `#44cc66` | Root/tonic note (green) |
| `--color-note-scale` | `#888888` | Regular scale notes |
| `--color-note-non-scale` | `#222222` | Non-scale notes (nearly invisible) |
| `--color-note-neutral` | `#444444` | Neutral mode (tunings tab) |

### Text Colors (Tailwind)

| Class | Usage |
|-------|-------|
| `text-text-primary` | Main content, note names |
| `text-gray-300` | Descriptions, character text |
| `text-gray-400` | Labels, secondary info |
| `text-gray-500` | Uppercase labels, subtle text |
| `text-note-root` | Root note highlights, active states |

## Typography

- **Body**: `system-ui, -apple-system, sans-serif`
- **Notes/formulas**: `font-mono` (ui-monospace)
- **Labels**: `text-xs uppercase tracking-wider`
- **Scale degrees on fretboard**: `font-mono font-bold text-sm`

## Component Patterns

### Fretboard (`shared/fretboard/`)
- CSS Grid layout: `40px` label column + `repeat(N, minmax(28px, 1fr))`
- Each note is a `<button>` with inline `background-color` and `color`
- Strings displayed bottom-to-top (low E at bottom)
- Fret markers: dots at 3,5,7,9,12,15,17,19,21,24 (double at 12,24)
- `showDegrees` input: shows scale degree numbers (1-7) instead of note names

### Cheat Sheet (`shared/cheat-sheet/`)
- Compact inline layout: notes · formula · character in one line
- Separator: `<span class="text-fret-line mx-0.5">·</span>` or `|` between sections
- Collapsible interval reference below (open by default)
- Click formula symbol → flash matching interval card

### Select Dropdowns
- Use `[selected]` on `<option>`, NOT `[value]` on `<select>`
- Class: `bg-bg-fretboard text-text-primary border border-fret-line rounded px-3 py-2 text-sm`

### Buttons
- Default: `border border-fret-line rounded hover:bg-fret-line transition-colors`
- Active state: `border-note-root/50 bg-note-root/10 text-note-root`

## Data Architecture

### Scale Definition (`core/models/scale.model.ts`)
```typescript
interface ScaleDefinition {
  name: string;           // internal ID
  labelKey: string;       // i18n key for display name
  intervals: number[];    // semitone intervals from root [0, 2, 4, 5, ...]
  defaultRoot: string;    // canonical root note ('C', 'A', etc.)
  characterKey?: string;  // i18n key for description
}
```

### All scales in one list (`core/data/scales.data.ts`)
11 scales: 7 modes + harmonic/melodic minor + 2 pentatonics

### CAGED Box Algorithm (`core/services/note.service.ts`)
1. Find root on low E string
2. Collect 7 (or 5) scale notes ascending from root
3. Remove upper note of each half-step pair → 5 anchors
4. Window: `[anchor - 1, anchor + 3]` on all strings
5. Collect all scale notes within window

### Note Roles
| Role | Color | When |
|------|-------|------|
| `root` | Green (`note-root`) | Interval = 0 from root |
| `scale` | Grey (`note-scale`) | In scale, not root |
| `nonScale` | Dark (`note-non-scale`) | Not in scale |
| `neutral` | Mid-grey (`note-neutral`) | No scale context (tunings tab) |
| `outOfBox` | Nearly invisible | In scale but outside selected box |

## i18n

- Runtime switching via `@jsverse/transloco`
- Translation files: `public/assets/i18n/{en,ru}.json`
- Auto-detect browser language, persist to localStorage
- All UI strings use `{{ 'key' | transloco }}` pipe

## State Management

- Angular signals (`signal()`, `computed()`)
- `StorageService` for localStorage with `gc_` prefix
- Signals initialized from storage at field declaration time (not ngOnInit)

## Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/gammas` | ScalesComponent | All scales with fretboard + boxes |
| `/tunings` | TuningsComponent | Tuning reference |
| `/eq` | EqComponent | EQ cheat sheet |
