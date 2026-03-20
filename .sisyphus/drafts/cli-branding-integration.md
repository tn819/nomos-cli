# Draft: Nomos CLI Branding Integration

## Research Findings

### 1. Brand Design System (from monorepo)

**Primary Brand Colors (OKLCH color space):**
- `--nomos: oklch(50.07% 0.281 270.84)` - Main purple/blue brand color
- `--nomos-foreground: oklch(100% 0 0)` - White text on brand color
- Gray scale: `--nomos-gray-5` (lightest) to `--nomos-gray-100` (darkest)

**Semantic Colors:**
- Primary: `oklch(50.07% 0.281 270.84)` - Same as nomos brand
- Success: `oklch(72.3% 0.219 149.579)` - Green
- Warning: `oklch(76.9% 0.188 70.08)` - Amber
- Destructive: `oklch(57.7% 0.245 27.325)` - Red
- Info: `oklch(62.3% 0.214 259.815)` - Blue

**Design Tokens Location:**
- `/packages/ui/src/styles/globals.css` - Full CSS variables
- `/packages/ui/src/lib/utils.ts` - Color conversion utilities

### 2. Logo Structure (from SVGs)

**Symbol (`symbol.svg`):**
- Abstract "N" formed by 3 geometric paths
- Central vertical bar (8.494 units)
- Two diagonal arms creating dynamic "N" shape
- Black fill, designed for multi-color usage

**Wordmark (`wordmark.svg`):**
- "NOMOS" in custom geometric sans-serif
- Distinctive letter forms: angular O's, geometric S

**Lockup (`lockup.svg`):**
- Combined symbol + wordmark
- Full horizontal composition

### 3. Current CLI Implementation

**Entry Point:** `/Users/thomasneil/Code/nomos/src/cli.ts`
- Uses Commander.js (v14.0.3)
- No styling libraries (no chalk, ink, boxen, etc.)
- Plain `console.log()` and `console.error()` output
- Binary: `nomos` command

**Commands:**
- `help`, `login`, `versions`, `capabilities`, `everything`, `new-endpoints`, `operations`, `call`
- Subcommands: `grid-fee-reductions`, `meter-orders`
- Config storage: `~/.nomos/config.json`

**Current README:**
- Basic structure: Install, CLI usage, SDK usage
- No badges, no visual hierarchy
- Missing: badges, quality signals, architecture overview

## Questions for User

1. **Logo Integration Preference:**
   - ASCII art banner with "N" symbol?
   - Just styled text "NOMOS" ?
   - Both with command-line switch?

2. **Color Strategy:**
   - Full color output (requires chalk)?
   - Minimal color (primary only)?
   - No color option for CI/CD?

3. **README Enhancement Scope:**
   - Badges: npm version, license, CI/CD, coverage, quality?
   - Architecture diagram?
   - Interactive examples with code blocks?
   - Changelog / contributing sections?

4. **SonarQube Integration:**
   - Is there an existing SonarQube project for this SDK?
   - Quality gate requirements?

## Dependencies to Add

```json
{
  "chalk": "^5.x",// Terminal colors
  "boxen": "^8.x",     // Box drawing
  "ora": "^8.x",        // Spinners/loaders
  "cli-table3": "^0.6.x",// Tables
  "gradient-string": "^2.x" // Gradients (optional)
}
```

## Implementation Areas

1. **Branded Output Module** (`src/branding/`)
   - ASCII logo generator
   - Color theme constants
   - Box/panel formatting utilities

2. **README Enhancement**
   - Badges section
   - Logo/badge
   - Feature highlights
   - Architecture diagram
   - Quality signals

3. **CLI Enhancements**
   - Branded help output
   - Styled error messages
   - Color-coded operation categories

## Technical Notes

- OKLCH colors need conversion to ANSI/256-color for terminal
- Primary brand: ~Purple-blue (hue 270.84)
- Can use closest ANSI color: Magenta (35) or Blue (33-39)
- Consider `supports-color` package for capability detection