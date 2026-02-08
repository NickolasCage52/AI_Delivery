# Hero FX budget

## Shader background (WebGL)
- `linesPerGroup`: **12** (was 16).
- Target FPS: **high 50**, **medium 45**, **low 30** (`getCanvasTargetFPS`).
- Shader opacity (Hero): **low 0.35**, **medium 0.55**, **high 0.65**.

## Hero blur/orbs
- `getHeroBlurClass`:
  - **high**: orb1 `blur-[80px]`, orb2 `blur-[64px]`
  - **medium**: orb1 `blur-[56px]`, orb2 `blur-[44px]`
  - **low**: orb1 `blur-[32px]`, orb2 `blur-[24px]`

## BusinessCoverageGraph
- Packet count: **high 3**, **medium 1**, **low 0**.
- SVG glow: blur stdDeviation **3** (was 4).
- Drop shadow: **0 0 38px @ 0.14** (was 50px @ 0.18).

## HeroIntegrationGraph
- Packet count: **2** (was 3).
- SVG glow blur: stdDeviation **2.5** (was 3).
- Drop shadow: **0 0 32px @ 0.14** (was 40px @ 0.15).

## HeroServiceGraph
- Particles: **1** per branch (was 2 on high).
- SVG glow blur: stdDeviation **3** (was 4).
- Drop shadow: **0 0 32px @ 0.10** (was 40px @ 0.12).

## DataStreams SVG
- Opacity: **0.30** (was 0.40).
