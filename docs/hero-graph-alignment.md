# Hero Graph Alignment

## Problem
- Hero graph nodes were positioned with fixed coordinates and uneven radii, which made the layout look skewed and inconsistent across screen sizes.
- Labels were outside the circles and collided with lines/background, breaking the premium look.

## Solution
- Switched to a centered orbit layout: nodes are placed from the container center, with one orbit on desktop and two orbits on smaller screens.
- Labels are rendered inside each circle with a two-line cap and compact titles on mobile.
- Responsive sizing is derived from the container size, with packets disabled on compact screens and all animations limited to transforms.

## Parameters
- Container size: `clamp(360px, 44vw, 560px)` desktop, `clamp(320px, 86vw, 420px)` mobile.
- Orbit radius: `size * 0.39` (single) or `size * 0.41` / `size * 0.28` (two orbits).
- Node radius: `clamp(size * 0.088, 32, 54)`; core radius: `clamp(size * 0.125, 54, 70)`.
- Label typography: 2 lines max, `maxChars` = 16 desktop, 10 mobile, centered inside the circle.
