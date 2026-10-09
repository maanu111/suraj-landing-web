# Admin Panel — Style Reference

Source: Refero style `5c7acdfb-996b-4c6f-b361-264a3f580f7d` — Perplexity AI
("Digital Parchment, Subtle Authority"). Chosen because its warm off-white
canvas sits naturally beside the landing page's `#faf9f7` paper canvas, and its
fixed-sidebar + constrained-main layout is the pattern shared by every strong
admin reference (Linear settings, Monday admin, Zendesk Admin Center, Navan).

**Theme:** light · **Density:** compact

---

## Layout

Two columns: a fixed-width left navigation sidebar and a flexible main content
area. Main content is centered and constrained, never full-bleed. Section rhythm
comes from spacing and grouping rather than visual dividers. Navigation is a
persistent left-aligned sidebar holding both hierarchical and utility links.

- Section gap: 32px
- Card padding: 12px
- Element gap: 8px

## Colors

| Name | Value | Role |
|------|-------|------|
| Canvas Creme | `#faf8f5` | Page + card background. Never pure white. |
| Text Charcoal | `#27251e` | Primary body text and UI elements |
| Accent Teal | `#016a71` | Active nav, selected items, high-priority interactive text — only |
| Secondary Text | `#72706b` | Secondary text, muted links, inactive icons |
| Border Slate | `#d1d1cd` | Card and input borders, 1px |
| Subtle Gray | `#92918b` | Placeholder and tertiary text |
| Deep Black | `#000000` | Strong headings, high contrast |

## Typography

pplxSans, substituted with **Inter**. Weights 400 and 500 only.

| Role | Size | Line height |
|------|------|-------------|
| caption | 12px | 1.25 |
| body-sm | 14px | 1.43 |
| body | 16px | 1.5 |

## Radius

| Element | Value |
|---------|-------|
| pill | 9999px |
| cards | 16px |
| buttons | 6px |
| input field | 12px |

## Shadow

Content card only: `rgba(0, 0, 0, 0.08) 0px 1px 2px 0px`

## Do

- Canvas Creme `#faf8f5` as the background for every page section and card
- Text Charcoal `#27251e` for primary text — soft readability, not stark contrast
- Reserve Accent Teal `#016a71` for active nav states and selected items
- 9999px radius for tags and pills, 16px for cards, 6px for buttons, 12px for inputs
- Inter at weight 400 for standard UI, 500 for subtle emphasis
- 8px spacing unit for element gaps

## Don't

- No saturated colors beyond Accent Teal — the palette is deliberately restrained
- No sharp corners; minimum 6px radius on functional elements
- No shadows beyond the single card shadow above
- No weights heavier than 500
- No pure white `#ffffff` backgrounds — Canvas Creme is warmer
- No excessive dividers; rely on background shifts and spacing
- No outlines on inputs except for focus state

## Imagery

UI-dominant, minimal decoration. Icons are monochrome, Text Charcoal by default
and Accent Teal when active. No photography or illustration — this is a
utilitarian, information-focused surface.
