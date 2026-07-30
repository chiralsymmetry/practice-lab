# Color and Visual-Design Practice — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, color-math oracle, semantic SVG renderer, typography-metrics engine, layout solver, accessibility checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Color and Visual-Design Practice

### Topic goal

Develop fast, defensible visual-design reasoning. The learner should become able to:

- read and convert common color representations without confusing encoded values with light intensity;
- predict additive, subtractive-model, alpha-compositing, and interpolation results under an explicitly named model;
- construct hue relationships and controlled palette variations;
- distinguish a declared harmony rule from a subjective claim that a palette is beautiful;
- calculate WCAG 2.2 relative luminance and contrast ratios;
- select accessible foreground/background pairs for text, controls, states, and graphical objects;
- avoid conveying essential meaning through color alone;
- read typographic anatomy and calculate font-relative units, line height, leading, measure, advances, kerning, and tracking;
- construct consistent type scales and hierarchy under a supplied design brief;
- align boxes and baselines, distribute space, calculate grids and gutters, and diagnose near-miss alignment;
- reason about responsive constraints, wrapping, whitespace, grouping, and visual weight;
- apply reusable design tokens consistently across components and states;
- explain whether a conclusion is mathematical, standards-based, rubric-based, or genuinely subjective.

The central habit is:

> Name the model and design intent, calculate the measurable relationships, test the required constraints, and reserve aesthetic claims for evidence or preference.

### Relationship to neighboring Practice Lab topics

- **Data Literacy and Chart Reading** owns truthful chart encoding and interpretation. This app may style a miniature chart but does not teach chart choice or statistical claims.
- **Photography and Optics** owns capture, sensor, illumination, and photographic color-temperature reasoning. This app treats display colors and designed layouts.
- **Geometry and Trigonometry** owns general geometric proofs. This app applies rectangles, ratios, coordinates, and alignment to visual composition.
- **Signals and Systems** owns physical signal mixing. This app uses bounded color models rather than spectral power distributions.
- **Music Practice** also contains aesthetic conventions, but each app keeps subjective judgment separate from exact mechanics.

### Audience and prerequisites

The initial audience ranges from a visually curious beginner to a developer or designer seeking more fluent technical judgment.

Early categories assume:

- arithmetic with percentages, ratios, and simple decimals;
- Cartesian coordinates and rectangle dimensions;
- hexadecimal digits for optional color-code questions;
- basic familiarity with text, buttons, cards, and page layouts.

Later categories locally introduce:

- piecewise sRGB decoding;
- powers for luminance calculations, with calculator mode available;
- HSL and OkLCh component semantics;
- alpha compositing;
- CSS font-relative units and box alignment terms.

No drawing ability, design software, programming, color-calibrated display, or prior art training is required.

### Authority and model versions

The default technical profile is:

```text
pl-visual-design-srgb-wcag22-v1
```

It pins:

- legacy color input and contrast evaluation to sRGB;
- contrast requirements and terminology to [WCAG 2.2](https://www.w3.org/TR/WCAG22/);
- color-space and interpolation terminology to [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/);
- CSS unit relationships to [CSS Values and Units Level 4](https://www.w3.org/TR/css-values-4/);
- alignment vocabulary to [CSS Box Alignment Level 3](https://www.w3.org/TR/css-align-3/).

Standards profiles, conversion implementations, palette-rule sets, typography-metric sets, and layout-rule sets must have version IDs saved with each question. Future standards or teaching changes must not silently alter saved answers.

This specification distinguishes four kinds of answer:

```text
exact-model       // arithmetic or deterministic geometry
standards-profile // conformance under the pinned standard
declared-rubric   // best answer under rules printed in the prompt
subjective        // preference; not exact-graded
```

The generator must never turn a subjective preference into a single “correct” answer by hiding an aesthetic opinion inside the oracle.

### Canonical color representation

Core opaque colors are 8-bit sRGB:

```text
ColorSRGB8 { r: 0..255, g: 0..255, b: 0..255 }
```

Canonical display is uppercase `#RRGGBB`. Input may also use `rgb(r g b)` or normalized sRGB components when the family permits. Alpha is a real number in `[0,1]`, displayed as a decimal or percentage:

```text
ColorSRGBA { r, g, b, alpha }
```

Hex shorthand `#RGB` and `#RGBA` appear only after expansion is taught; each digit is duplicated. Named CSS colors are excluded from exact recall except `black`, `white`, and `transparent` when their value is supplied.

Channel values are **encoded sRGB coordinates**, not direct light intensities. Any family that adds emitted light must first decode to a linear-light space. Any family that imitates legacy encoded-sRGB interpolation must say so.

### sRGB decoding and encoding

For encoded channel `c` normalized to `[0,1]`, the WCAG-compatible linear channel is:

```text
linear(c) =
  c / 12.92                         when c <= 0.04045
  ((c + 0.055) / 1.055) ^ 2.4      otherwise
```

The inverse used for rendering computed linear colors is:

```text
encoded(v) =
  12.92v                            when v <= 0.0031308
  1.055 * v^(1/2.4) - 0.055        otherwise
```

Unless a family deliberately studies gamut, linear values are clamped to `[0,1]` only after the complete operation and before encoding. Intermediate clipping is forbidden because it can change the result.

Core hand-calculation questions use channels chosen from a lookup table of precomputed exact/rounded linear values or provide decoded components. Calculator questions may apply the formula directly. Display rounding never feeds back into later calculation.

### Relative luminance and WCAG contrast

For decoded linear sRGB channels:

```text
L = 0.2126R + 0.7152G + 0.0722B
```

For the lighter luminance `L1` and darker `L2`:

```text
contrast = (L1 + 0.05) / (L2 + 0.05)
```

The ratio lies from `1:1` through `21:1`. Do not round a ratio before comparing it with a threshold. Display to two decimal places afterward.

The pinned WCAG 2.2 teaching subset is:

| Use | Level AA | Level AAA |
|---|---:|---:|
| normal text | `4.5:1` | `7:1` |
| large-scale text | `3:1` | `4.5:1` |
| required visual information in active UI components and graphical objects | `3:1` against adjacent color(s) | not extended here |

For Latin text in this profile, large-scale means at least:

```text
18pt regular = 24 CSS px
14pt bold    = 18.666... CSS px
```

The prompt supplies weight classification; the app does not infer “bold enough” from a numeric font weight. CJK and other writing systems may need equivalent language-specific large-print sizes; a locale profile must supply them rather than reusing Latin thresholds blindly.

Text exceptions such as logotypes, incidental/decorative text, and inactive components appear only in explicit classification questions. The app should still prefer readable demonstrations even when a formal exception applies.

Contrast is checked against the actual adjacent background. If text spans a gradient or image-like synthetic background, calculate every declared sample region and use the **lowest** relevant contrast. A global average is not sufficient.

### Alpha compositing and transparency

The web-style teaching profile for an sRGB source over an opaque sRGB backdrop is:

```text
Cout = alpha * Csource + (1-alpha) * Cbackdrop
```

applied independently to encoded sRGB components, retaining floating precision until final rendering. Contrast is then computed from the resulting visible sRGB color. This is a declared compositing model, not physical light mixing.

For multiple translucent layers, apply source-over in back-to-front order. Source-over is not commutative; changing layer order can change the answer.

Color interpolation with transparency uses premultiplied coordinates in the named interpolation space:

1. convert both colors to the named space;
2. premultiply non-hue components by alpha;
3. interpolate components and alpha;
4. undo premultiplication when output alpha is nonzero.

The simpler source-over and interpolation models must not be conflated.

### Color-space and mixing models

The app supports several deliberately distinct models:

#### Additive light

Physical-intensity-style additive questions operate in `srgb-linear`:

```text
linearResult = w1*linearColor1 + w2*linearColor2
```

Weights and whether they sum to 1 are stated. Unnormalized addition may clip; normalized interpolation normally does not.

#### Legacy encoded-sRGB interpolation

```text
encodedResult = (1-t)*encodedColor1 + t*encodedColor2
```

This is included to demonstrate why the interpolation space changes the result. It is not labeled physically linear or perceptually uniform.

#### HSL

HSL uses hue angle modulo `360°`, saturation and lightness in `[0%,100%]`. It is useful for teaching hue-wheel relationships and simple UI manipulations, but equal HSL lightness does not imply equal WCAG luminance or equal perceived lightness.

#### Oklab and OkLCh

OkLCh is represented as:

```text
oklch(L C h)
L: 0..1
C: non-negative
h: angle modulo 360°, powerless at zero chroma
```

It is used for perceptual-lightness ordering, chroma ramps, hue relationships, and named interpolation. Full conversion to/from sRGB is performed by a tested library/algorithm derived from CSS Color 4, not re-invented in question code. Mental questions normally supply the relevant coordinates.

#### Ideal subtractive CMY

The v1 subtractive teaching model is an ideal filter/ink over white:

```text
cyan    = (0,1,1)
magenta = (1,0,1)
yellow  = (1,1,0)
overprint channels multiply
```

This predicts idealized channel removal, not real paint, ink, paper, metamerism, or spectral mixing. Real-material color matching is excluded.

### Hue-harmony teaching profile

Harmony questions use hue angles under an explicitly displayed rule set:

```text
complementary:       h, h+180°
analogous-30:        h-30°, h, h+30°
split-complementary: h, h+150°, h+210°
triadic:             h, h+120°, h+240°
square tetradic:     h, h+90°, h+180°, h+270°
```

All angles normalize to `[0°,360°)`. These are construction conventions, not proofs of beauty, emotional meaning, cultural meaning, accessibility, or practical palette completeness.

A palette exercise also declares roles such as:

```text
canvas
surface
primary
secondary
accent
text
mutedText
border
focus
success
warning
error
```

Role suitability is graded only against supplied constraints: contrast thresholds, distinctness threshold, state consistency, permitted hue family, or a declared proportion/rubric.

### Color difference and simulated vision

Selected advanced questions use Euclidean Oklab distance:

```text
deltaEOK = sqrt((L1-L2)^2 + (a1-a2)^2 + (b1-b2)^2)
```

A prompt may provide a task-specific distinction threshold. The threshold is a **teaching rubric**, not a universal just-noticeable difference for every display, observer, size, context, or color-vision condition.

Color-vision simulations use a pinned matrix and then convert/clamp as specified. The matrix is supplied with the question or referenced by a versioned preset. Simulation can expose likely collisions, but the app must not claim to reproduce any individual's perception.

### Typography metric contract

Typography questions use versioned synthetic font metric records:

```text
FontMetrics {
  unitsPerEm
  ascent
  descent
  lineGap
  capHeight
  xHeight
  glyphAdvance[glyph]
  kerning[pair]
}
```

Coordinates above the alphabetic baseline are positive; descent magnitude is stored positive in question data. A glyph's advance width is not necessarily its visible bounding-box width.

CSS relationships:

```text
1in = 96px
1pt = 1/72in = 4/3px
1pc = 12pt = 16px

1em  = computed font size of the element
1rem = computed font size of the root
1ex  = used x-height of the font
1cap = used cap height
1ch  = advance measure of the "0" glyph
1lh  = computed line height of the element
```

When an exact font-relative question is asked, all necessary font metrics are supplied. The app never measures an unpinned system fallback font and treats the result as universal.

Unitless line height multiplies the element's own computed font size:

```text
usedLineHeight = lineHeightNumber * fontSize
```

For the app's centered-leading teaching model:

```text
extraLeading = usedLineHeight - fontSize
halfLeading = extraLeading / 2
```

This simplified box model is named in the prompt. It does not claim that every glyph is vertically centered or that every browser/font exposes identical ink bounds.

Width of a shaped single-line synthetic string:

```text
width =
  sum(glyphAdvance) +
  sum(enabledKerningAdjustments) +
  letterSpacing * max(glyphCount-1, 0)
```

Complex shaping, ligatures, contextual forms, bidirectional layout, and real-script line breaking require dedicated profiles and are outside v1 exact-width questions.

### Layout geometry contract

Every exact layout begins with semantic rectangles:

```text
Rect { x, y, width, height }
right  = x + width
bottom = y + height
centerX = x + width/2
centerY = y + height/2
```

The default canvas origin is top-left, `+x` right, `+y` down. CSS pixels are abstract design units; no claim is made about device pixels or physical size.

Alignment tests use a declared tolerance, normally exact for generated coordinates:

```text
left aligned:       x values equal
right aligned:      right values equal
horizontal centers: centerX values equal
top aligned:        y values equal
bottom aligned:     bottom values equal
vertical centers:   centerY values equal
baseline aligned:   baselineY values equal
```

Equal-gap distribution for sorted non-overlapping items uses:

```text
gap_i = next.x - current.right
```

For `n` equal columns inside content width `W` with gutter `g`:

```text
columnWidth = (W - (n-1)g) / n
spanWidth(k) = k*columnWidth + (k-1)g
```

The CSS-like box model uses:

```text
borderBoxWidth =
  contentWidth + paddingLeft + paddingRight + borderLeft + borderRight

outerWidth =
  borderBoxWidth + marginLeft + marginRight
```

Questions state `content-box` or `border-box` sizing when CSS property interpretation matters.

### Responsive and composition contract

Responsive questions evaluate a finite set of declared viewport/container widths. They do not depend on the user's current browser size.

Supported rules include:

```text
min/max/clamp
fixed or fractional grid tracks
minimum card width
column count
gap
wrap/no-wrap
aspect ratio
min/max content constraints supplied numerically
```

For a simple equal-card layout:

```text
fit n cards iff
n*minCardWidth + (n-1)*gap <= availableWidth
```

Composition questions use supplied measurable proxies, such as occupied area, distance from a declared balance axis, contrast ratio, scale ratio, or number of alignment lines. “Visual weight” is never inferred from arbitrary artwork. If a family uses weighted objects:

```text
moment = declaredWeight * signedDistanceFromAxis
```

and balance is the declared moment criterion, not a universal aesthetic law.

### Semantic-first rendering

Every prompt is generated from data before SVG/HTML rendering:

```text
DesignScene {
  colors
  textRuns
  fontMetrics
  boxes
  alignmentGuides
  designTokens
  constraints
  rubric
}
```

Correct answers come from the semantic scene, not from measuring antialiased screenshots. SVG geometry is checked independently against scene data. Raster previews may enrich a question but can never be the sole answer oracle.

### Scope

Included:

- sRGB hex/RGB representation, HSL hue operations, selected OkLCh/Oklab use, alpha, gamut flags, and named interpolation spaces;
- additive linear-light, legacy encoded-sRGB, ideal subtractive CMY, tint/shade, gradient, and alpha exercises;
- complementary, analogous, split-complementary, triadic, and square-tetradic construction;
- palette roles, ramps, proportion rules, theme tokens, and bounded color-vision simulation;
- WCAG 2.2 text and non-text contrast, large-text classification, varying backgrounds, and color-only cues;
- type anatomy, CSS units, font metrics, line height, leading, measure, kerning, tracking, type scales, hierarchy, and spacing resilience;
- box model, edge/center/baseline alignment, distribution, grids, gutters, spans, proximity, whitespace, responsive fit, and composition;
- integrated component, form, card, and poster-like synthetic design decisions under declared constraints.

### Exclusions

- free-form artistic critique or claims that one palette, typeface, composition, culture, emotion, gender association, or style is objectively superior;
- logo generation, brand strategy, marketing persuasion, dark patterns, political messaging, or demographic stereotyping;
- current design trends, commercial font licensing, product recommendations, or live design-system documentation;
- exact color appearance across uncalibrated displays, print proofing, ICC workflows, spectral colorimetry, metamerism, HDR, spot colors, ink limits, and real pigment/paint recipes;
- diagnosis of color-vision conditions or claims that simulation equals lived perception;
- APCA or future contrast algorithms in the initial profile; they may be added only as separately named profiles;
- complex font shaping, variable-font internals, hinting, rasterization, optical-size behavior, script-specific typography, and font-file parsing in v1;
- browser-layout edge cases requiring a full CSS engine;
- image composition, illustration, animation, motion design, 3D design, and video editing;
- grading by screenshot pixel sampling when semantic values are available.

### Global answer conventions

- Surrounding whitespace is ignored.
- Hex input is case-insensitive; feedback uses uppercase `#RRGGBB`.
- RGB integer channels must be `0..255`; normalized channels accept decimals `0..1` only when requested.
- Hue answers normalize modulo `360°`; `360°` is accepted as `0°` only in input, then canonicalized.
- Percent signs and units may be entered when shown by the prompt; the checker stores canonical numeric values.
- Contrast answers may include `:1`; comparison uses the unrounded internal ratio.
- Color lists are ordered when roles or wheel order matter; otherwise the prompt explicitly says order does not matter.
- Multiple valid foregrounds, repairs, or layouts are all accepted when they satisfy the declared constraints.
- Typographic lengths accept equivalent `px`, `pt`, `em`, or `rem` forms only when the reference sizes needed for conversion are supplied.
- Rectangle answers use named fields rather than an ambiguous comma sequence.
- Subjective preference responses may be saved for reflection but are not marked correct/incorrect.

### Difficulty philosophy

Difficulty should increase through:

- changing direction between representation and result;
- requiring the learner to choose the correct color/mixing model;
- adding alpha, interpolation space, gamut, or varying background;
- using near-threshold contrast without rounding traps;
- combining role, state, contrast, and redundancy constraints;
- nesting font-relative units and introducing real metric distinctions;
- moving from one alignment relation to multi-column and baseline systems;
- combining constraints across viewport widths;
- comparing several valid solutions under an explicit rubric;
- diagnosing a single root defect whose consequences cross color, type, and layout.

Difficulty must not increase through imperceptibly different colors, color-memory tests, low-quality displays, tiny text, inaccessible controls, hidden standards exceptions, arbitrary personal taste, excessive calculator labor, or pixel hunting.

## 2. Category: Color representation and color spaces

### Category purpose

Build exact fluency in reading color coordinates and choosing a representation whose semantics fit the operation.

### Learn

Hex and `rgb()` encode the same sRGB channels. `#3A80C0` means red `0x3A`, green `0x80`, blue `0xC0`. HSL separates hue angle, saturation, and a model-specific lightness; OkLCh separates perceptual-lightness-oriented `L`, chroma `C`, and hue `h`. Equal numeric values in different spaces do not imply equal appearance, and encoded sRGB is not linear light.

### Prerequisites

Hexadecimal digits and percentages; conversion help is included at Level 1.

### Category boundaries

This category reads and converts coordinates. Mixing belongs in Category 3, harmony construction in Category 4, and contrast in Category 5.

### Common misconceptions

- Reading a hex pair as decimal digits.
- Treating normalized `0.5` as 50 out of 255.
- Assuming equal HSL lightness means equal WCAG luminance.
- Adding encoded sRGB channels as if they were light intensities.
- Assigning hue to a neutral OkLCh color with zero chroma.
- Clamping intermediate out-of-gamut values before conversion is complete.

### Families

#### Family `hex_rgb_convert`

**Task.** Convert between `#RRGGBB`, optional shorthand, and integer `rgb()`.  
**Response/template.** three channels or hex text; “Convert `{color}` to `{format}`.”  
**Derivation.** Parse/format each byte independently; shorthand duplicates each nibble.  
**Difficulty.** direction, non-decimal pairs, shorthand, leading zeroes.  
**Distractors.** decimal reading of pairs, swapped channels, shorthand nibble padded rather than duplicated.  
**Feedback.** Expand into three labeled byte conversions.  
**Examples.** (1) `#FF0000` → `rgb(255 0 0)`. (2) `rgb(58 128 192)` → `#3A80C0`. (3) `#3A7` → `#33AA77`.  
**Validation.** Exactly three in-range channels; preserve two digits per full hex channel.

#### Family `rgb_normalize`

**Task.** Convert 8-bit channels to/from normalized sRGB coordinates.  
**Response/template.** three decimals or integers.  
**Derivation.** Divide/multiply by 255 with declared rounding.  
**Difficulty.** direction, rounding, mixed zero/full channels.  
**Distractors.** division by 100, premature integer rounding, channel swap.  
**Feedback.** Show each independent channel ratio.  
**Examples.** (1) `(255,0,0)` → `(1,0,0)`. (2) `(128,64,32)` → approximately `(0.502,0.251,0.125)`. (3) `(0.2,0.6,1)` → `(51,153,255)`.  
**Validation.** Prompt states decimal precision and inverse rounding mode.

#### Family `rgb_hsl_convert`

**Task.** Convert controlled sRGB colors and HSL coordinates using the pinned CSS algorithm.  
**Response/template.** HSL or RGB fields.  
**Derivation.** Apply the CSS Color conversion; mental sets favor primaries, secondaries, neutrals, and simple midpoints.  
**Difficulty.** achromatic case, non-primary hue, calculator mode.  
**Distractors.** HSV value substituted for HSL lightness, hue sector reversal, percent/channel confusion.  
**Feedback.** Show max/min, chroma, lightness, saturation, and hue sector.  
**Examples.** (1) red → `hsl(0 100% 50%)`. (2) gray `#808080` → saturation 0%, hue powerless. (3) `hsl(210 50% 40%)` → computed RGB under profile.  
**Validation.** Cross-check a standards-tested implementation; accept any hue when saturation is zero only if prompt asks raw coordinates.

#### Family `hue_wrap`

**Task.** Normalize a hue or apply a signed rotation.  
**Response/template.** degree value in `[0,360)`.  
**Derivation.** Euclidean modulo 360.  
**Difficulty.** negative input, multiple turns, inverse rotation.  
**Distractors.** negative remainder, clamp at endpoints, forget direction.  
**Feedback.** Show turns removed/added on a labeled wheel.  
**Examples.** (1) `390°` → `30°`. (2) `-45°` → `315°`. (3) rotate `350°` by `+40°` → `30°`.  
**Validation.** Canonical output never equals 360.

#### Family `oklch_component_read`

**Task.** Identify or change lightness, chroma, or hue while holding other coordinates fixed.  
**Response/template.** component name/value or tuple.  
**Derivation.** Read the tuple; apply requested component operation.  
**Difficulty.** percentage/decimal L, powerless hue, multi-step edit.  
**Distractors.** confuse chroma with saturation, rotate L, treat zero chroma hue as visible.  
**Feedback.** Explain each axis without promising uniform perception in every context.  
**Examples.** (1) in `oklch(0.7 0.12 40)`, `0.7` is L. (2) reduce chroma by 0.04 → `0.08`. (3) at `C=0`, changing hue does not change the neutral color.  
**Validation.** Generated values remain in declared numeric ranges; gamut is a separate question.

#### Family `color_space_choose`

**Task.** Select the appropriate named space/model for a stated operation.  
**Response/template.** single choice.  
**Derivation.** physical additive intensity → linear-light; perceptually even gradient → Oklab; hue-wheel construction → HSL/OkLCh; legacy compatibility example → encoded sRGB.  
**Difficulty.** competing goals and explicitly labeled compromises.  
**Distractors.** choose familiar sRGB for every task, HSL for luminance, linear RGB for hue-wheel arithmetic.  
**Feedback.** Connect space coordinates to operation semantics.  
**Examples.** (1) mix emitted-light intensities → `srgb-linear`. (2) perceptual gradient → Oklab. (3) reproduce a legacy encoded midpoint → sRGB.  
**Validation.** Scenario states one primary goal; acknowledge alternatives when goals conflict.

#### Family `alpha_parse`

**Task.** Expand, parse, or compare alpha notation.  
**Response/template.** RGBA fields or opacity.  
**Derivation.** Convert hex alpha byte or percentage to `[0,1]`.  
**Difficulty.** `#RGBA`, `#RRGGBBAA`, rounding.  
**Distractors.** treat alpha as transparency rather than opacity, reverse byte order, divide by 100 instead of 255.  
**Feedback.** State opacity and visible backdrop fraction.  
**Examples.** (1) `alpha 25%` → `0.25`. (2) `#FF000080` → red with alpha about `0.502`. (3) `#0F08` → `#00FF0088`.  
**Validation.** Prompt distinguishes opacity `alpha` from transparency `1-alpha`.

#### Family `gamut_check`

**Task.** Decide whether supplied converted coordinates lie inside a named RGB gamut.  
**Response/template.** yes/no plus offending channels.  
**Derivation.** For the named normalized RGB space, every component must be in `[0,1]`.  
**Difficulty.** near-boundary values, several channels, gamut mapping choice.  
**Distractors.** clamp then declare original in gamut, check only positive values, confuse OkLCh ranges with RGB gamut.  
**Feedback.** List out-of-range components and distinguish detection from mapping.  
**Examples.** (1) `(0.2,0.8,1)` → in gamut. (2) `(1.04,0.4,0.2)` → out. (3) `(-0.01,1.02,0.5)` → two violations.  
**Validation.** Coordinates and target space are explicit; converted values retain adequate precision.

#### Family `color_coordinate_compare`

**Task.** Compare two colors along a named coordinate without inferring other properties.  
**Response/template.** first/second/equal.  
**Derivation.** Compare supplied coordinate values.  
**Difficulty.** different spaces, near ties, powerless coordinates.  
**Distractors.** answer by visual appearance or another component.  
**Feedback.** State exactly what the coordinate comparison establishes and does not establish.  
**Examples.** (1) larger OkLCh L. (2) same HSL hue but different saturation. (3) two equal sRGB red channels do not imply equal luminance.  
**Validation.** Render preview is supplemental; semantic coordinates determine answer.

#### Family `color_representation_audit`

**Task.** Find one representation, conversion, gamut, or model-label error.  
**Response/template.** select and correct.  
**Derivation.** Recompute from canonical color data.  
**Difficulty.** plausible swapped space or premature clipping.  
**Distractors.** each non-answer row remains valid.  
**Feedback.** Name the exact coordinate/model mismatch.  
**Examples.** (1) `#10FF00` parsed as `(10,255,0)` instead of `(16,255,0)`. (2) `0.5` normalized labeled 50/255. (3) encoded sRGB values mislabeled linear-light.  
**Validation.** Exactly one root defect; preview appearance is not the defect.

## 3. Category: Color mixing, compositing, and interpolation

### Category purpose

Train prediction of color combination while making the chosen physical or mathematical model explicit.

### Learn

“Mix these colors” is incomplete. Colored light adds in a linear-light space. Ideal CMY filters remove channels multiplicatively. A translucent foreground uses source-over compositing. A gradient interpolates in a named space. Encoded-sRGB and linear-light midpoints are usually different.

### Prerequisites

Core representations and space selection from Category 2.

### Category boundaries

This category computes combination results. Harmony and palette role belong in Category 4; contrast of the visible result belongs in Category 5.

### Common misconceptions

- Averaging hex bytes and calling it physical light mixing.
- Treating paint, light, alpha, and gradients as one operation.
- Assuming layer order never matters.
- Forgetting premultiplied alpha in interpolation.
- Interpolating hue across the long arc accidentally.
- Clipping each input before a defined conversion/mix.

### Families

#### Family `additive_primary_mix`

**Task.** Combine ideal linear RGB primary lights.  
**Response/template.** resulting RGB triplet or color name.  
**Derivation.** Add declared channel intensities and clamp only at output.  
**Difficulty.** intensity weights and clipping.  
**Distractors.** subtractive result, encoded average, missing overlapping channel.  
**Feedback.** Show channel addition.  
**Examples.** (1) red + green at full intensity → yellow `(1,1,0)`. (2) green + blue → cyan. (3) `(0.7,0.2,0)+(0.4,0,0.5)` → `(1,0.2,0.5)` after clipping red.  
**Validation.** Inputs are explicitly linear-light and addition/normalization policy is stated.

#### Family `linear_rgb_weighted_mix`

**Task.** Compute a weighted linear-light interpolation.  
**Response/template.** linear triplet, optionally encoded output.  
**Derivation.** `(1-t)A+tB` per linear channel, then encode if requested.  
**Difficulty.** unequal weights, decode/encode steps, gamut.  
**Distractors.** use encoded channels, reverse weights, average regardless of `t`.  
**Feedback.** show decode, weighted sum, and encoding separately.  
**Examples.** (1) midpoint of linear red/green → `(0.5,0.5,0)` linear. (2) 25% B uses `0.75A+0.25B`. (3) encode a supplied linear result with the inverse transfer curve.  
**Validation.** Independent implementation reproduces result within `1e-6`.

#### Family `encoded_vs_linear_midpoint`

**Task.** Compare midpoints produced in encoded sRGB and linear-light sRGB.  
**Response/template.** matching or brighter/darker choice.  
**Derivation.** calculate both named paths.  
**Difficulty.** grayscale then multichannel colors.  
**Distractors.** declare results identical, reverse brightness relation, decode only one endpoint.  
**Feedback.** explain why encoded values are nonlinear.  
**Examples.** (1) black/white encoded midpoint `#808080`. (2) linear-light midpoint encodes near `#BCBCBC`. (3) compare red/blue results under both spaces.  
**Validation.** Store full-precision values; displayed hex uses declared rounding.

#### Family `subtractive_cmy_overprint`

**Task.** Predict ideal CMY overprint over white.  
**Response/template.** transmitted RGB or resulting ideal color.  
**Derivation.** multiply transmission channels.  
**Difficulty.** partial transmissions and three layers.  
**Distractors.** additive primary result, arithmetic average, real-paint claims.  
**Feedback.** show which channels each layer removes.  
**Examples.** (1) cyan × magenta → blue. (2) magenta × yellow → red. (3) cyan × magenta × yellow → ideal black.  
**Validation.** Every prompt labels this ideal model and never predicts real pigment appearance.

#### Family `alpha_source_over`

**Task.** Composite one translucent sRGB source over an opaque backdrop.  
**Response/template.** RGB/hex visible color.  
**Derivation.** encoded-sRGB `alpha*source+(1-alpha)*backdrop`.  
**Difficulty.** non-50% alpha and all channels active.  
**Distractors.** reverse alpha, use transparency as opacity, linear-light mix.  
**Feedback.** calculate each channel and state this is compositing, not light addition.  
**Examples.** (1) 50% black over white → about `#808080`. (2) 25% red over black → `#400000`. (3) 60% `#2080E0` over `#F0E0C0` → computed output.  
**Validation.** Retain float precision through all channels and round once.

#### Family `alpha_layer_order`

**Task.** Compare or compute two translucent layers in different orders.  
**Response/template.** result(s) or order choice.  
**Derivation.** composite back-to-front twice.  
**Difficulty.** unequal alpha and non-neutral backdrop.  
**Distractors.** assume commutativity, apply both directly to original backdrop, swap opacity.  
**Feedback.** show intermediate visible color for each ordering.  
**Examples.** (1) red-over-blue versus blue-over-red at 50%. (2) opaque top layer makes lower layer irrelevant. (3) identify when equal colors make order immaterial.  
**Validation.** Reject comparison instances where orders accidentally match unless equality is the target.

#### Family `tint_shade_mix`

**Task.** Construct a tint or shade by mixing with white or black in a named space.  
**Response/template.** color coordinates.  
**Derivation.** interpolate with white/black at supplied `t` in the named space.  
**Difficulty.** encoded versus Oklab, non-50% proportion.  
**Distractors.** confuse tint/shade, alter only HSL lightness under a different named model, reverse weights.  
**Feedback.** state endpoint, proportion, and interpolation space.  
**Examples.** (1) 25% white tint in encoded RGB. (2) 40% black shade. (3) compare an encoded-sRGB tint with an Oklab tint.  
**Validation.** “Tint” and “shade” never imply an unstated mixing space.

#### Family `gradient_stop_interpolate`

**Task.** Compute a color at a position between generated gradient stops.  
**Response/template.** tuple/hex.  
**Derivation.** find enclosing stops, normalize local `t`, interpolate in named space.  
**Difficulty.** unequal stop positions, alpha, three or more stops.  
**Distractors.** use global instead of local `t`, wrong stop pair, wrong space.  
**Feedback.** show interval selection and component interpolation.  
**Examples.** (1) midpoint of stops at 0%/100%. (2) position 40% between stops at 20%/60% gives local `t=0.5`. (3) alpha gradient uses premultiplied coordinates.  
**Validation.** Position lies on/inside declared domain; stop order is strict.

#### Family `hue_interpolation_arc`

**Task.** Determine intermediate hue under shorter, longer, increasing, or decreasing arc.  
**Response/template.** hue angle.  
**Derivation.** choose directed arc, interpolate angular distance, normalize.  
**Difficulty.** wrap across zero, tie at 180°, non-midpoint.  
**Distractors.** arithmetic average without wrap, wrong arc, no normalization.  
**Feedback.** draw selected arc and directed distance.  
**Examples.** (1) shorter midpoint 350°→10° is 0°. (2) increasing midpoint 10°→350° is 180°. (3) 25% along decreasing 60°→300° follows the declared negative arc.  
**Validation.** Exact 180° ties use a stated tie rule.

#### Family `mixing_audit`

**Task.** Find one wrong model, order, weight, interpolation-space, or clipping step.  
**Response/template.** select and repair.  
**Derivation.** recompute named operation from source data.  
**Difficulty.** plausible result from a different valid model.  
**Distractors.** other rows use correct but varied models.  
**Feedback.** identify the model whose result the wrong answer actually matches.  
**Examples.** (1) encoded midpoint labeled linear. (2) alpha source/backdrop reversed. (3) ideal CMY overprint computed by addition.  
**Validation.** Exactly one root error and every model label is visible.

## 4. Category: Harmony rules and palette construction

### Category purpose

Build fluent palette construction and role reasoning while keeping formal hue schemes separate from taste and cultural interpretation.

### Learn

Harmony names specify geometric relationships on a chosen hue circle: a complement is 180° away, a triad uses 120° steps, and so on. These rules generate related hues, not guaranteed good design. A usable palette also needs lightness, chroma, role, contrast, state, and proportion decisions.

### Prerequisites

Hue normalization and OkLCh/HSL component semantics.

### Category boundaries

This category applies declared palette rules. Accessibility thresholds belong in Category 5, semantic/state robustness in Category 6, and unconstrained aesthetic ranking is excluded.

### Common misconceptions

- Treating a hue scheme as proof that a palette is attractive.
- Forgetting angle wrap.
- Changing hue when a ramp asks to vary only lightness.
- Assuming same hue means same role.
- Using a saturated accent for large surfaces despite a contrary supplied brief.
- Believing a 60/30/10 rule is universal rather than a declared exercise constraint.

### Families

#### Family `harmony_complement`

**Task.** Compute the complementary hue.  
**Response/template.** angle or matching swatch.  
**Derivation.** `(h+180) mod 360`.  
**Difficulty.** inverse prompt and wrap.  
**Distractors.** ±90, ±120, no wrap.  
**Feedback.** show the diameter across the hue circle.  
**Examples.** (1) 30° → 210°. (2) 240° → 60°. (3) missing base when complement is 15° → 195°.  
**Validation.** Swatches keep L/C or S/L fixed when hue alone is trained.

#### Family `harmony_analogous`

**Task.** Construct the `analogous-30` three-hue set.  
**Response/template.** unordered or wheel-ordered angles as stated.  
**Derivation.** normalize `h-30`, `h`, `h+30`.  
**Difficulty.** wrap and identify center hue from set.  
**Distractors.** use 60° steps, duplicate wrapped endpoint, call any neighbors analogous.  
**Feedback.** label the declared ±30° rule.  
**Examples.** (1) base 120° → 90°,120°,150°. (2) base 10° → 340°,10°,40°. (3) infer center 355° from 325°,355°,25°.  
**Validation.** Rule ID travels with question; other analogous widths are not silently rejected.

#### Family `harmony_split_complement`

**Task.** Construct or recognize the declared split-complementary set.  
**Response/template.** hue angles.  
**Derivation.** `h`, `h+150`, `h+210` modulo 360.  
**Difficulty.** wrap and missing member.  
**Distractors.** exact complement, triad, ±150 around base rather than complement.  
**Feedback.** locate complement then split ±30°.  
**Examples.** (1) base 0° → 0°,150°,210°. (2) base 300° → 300°,90°,150°. (3) fill missing hue for base 80°.  
**Validation.** Three distinct hues.

#### Family `harmony_triad`

**Task.** Construct or recognize a 120° triad.  
**Response/template.** hue set.  
**Derivation.** `h`, `h+120`, `h+240` modulo 360.  
**Difficulty.** infer base-equivalent set and wheel order.  
**Distractors.** 90° square step, 180° complement, arithmetic without wrap.  
**Feedback.** show three equal arcs.  
**Examples.** (1) 0° → 0°,120°,240°. (2) 250° → 250°,10°,130°. (3) identify whether `{35,155,275}` is triadic.  
**Validation.** Set equivalence ignores which member was originally called base when appropriate.

#### Family `harmony_tetrad`

**Task.** Construct the square-tetradic four-hue set.  
**Response/template.** hue set.  
**Derivation.** 90° increments.  
**Difficulty.** missing member, rotation-equivalent sets, wrap.  
**Distractors.** four 120° steps, rectangle tetrad not declared, duplicated 360°.  
**Feedback.** show four equal arcs and distinguish other tetrad conventions.  
**Examples.** (1) 0° → 0°,90°,180°,270°. (2) 330° → 330°,60°,150°,240°. (3) missing member in `{20,110,200,?}` → 290°.  
**Validation.** Profile says “square”; rectangular tetrads are not graded by this family.

#### Family `palette_lightness_steps`

**Task.** Complete or order a palette ramp with hue/chroma fixed and declared L steps.  
**Response/template.** ordered OkLCh tuples or missing L.  
**Derivation.** apply arithmetic or supplied non-linear L sequence.  
**Difficulty.** descending ramps, missing interior tokens, gamut flags.  
**Distractors.** change chroma/hue, use HSL lightness, reverse order.  
**Feedback.** display all coordinates and a grayscale structural preview.  
**Examples.** (1) L `0.3,0.5,0.7`. (2) missing 0.65 in 0.45/0.55/0.65/0.75. (3) select ramp preserving constant `C=0.08,h=240`.  
**Validation.** If conversion leaves sRGB gamut, question states mapping policy or rejects instance.

#### Family `palette_chroma_steps`

**Task.** Vary chroma while holding OkLCh L and hue fixed.  
**Response/template.** ordered tuples or missing C.  
**Derivation.** apply declared chroma step sequence.  
**Difficulty.** decreasing saturation emphasis and gamut boundary.  
**Distractors.** alter L, confuse HSL saturation with OkLCh C, exceed declared gamut.  
**Feedback.** separate colorfulness change from lightness change.  
**Examples.** (1) `C=.04,.08,.12` at constant L/h. (2) mute accent by reducing C. (3) choose highest in-gamut supplied candidate.  
**Validation.** Conversion oracle tests gamut after complete conversion.

#### Family `palette_role_assign`

**Task.** Assign supplied colors to design roles under explicit constraints.  
**Response/template.** matching.  
**Derivation.** solve role predicates such as lightness range, contrast, hue family, and emphasis rank.  
**Difficulty.** interacting constraints and multiple themes.  
**Distractors.** visually plausible but violate one stated role constraint.  
**Feedback.** list satisfied/violated predicates by role.  
**Examples.** (1) lightest neutral → canvas. (2) highest-chroma permitted hue → accent. (3) choose text color meeting 4.5:1 on supplied surface.  
**Validation.** Generate backward from a unique assignment or accept all satisfying assignments.

#### Family `palette_proportion`

**Task.** Allocate area/count under a declared palette proportion such as 60/30/10.  
**Response/template.** areas, counts, or choice.  
**Derivation.** multiply total by declared percentages.  
**Difficulty.** indivisible units and closest valid allocation with tie rule.  
**Distractors.** percentages applied cumulatively, swapped roles, total not preserved.  
**Feedback.** emphasize that the ratio is the prompt's brief, not a universal rule.  
**Examples.** (1) 1000 px² → 600/300/100. (2) 20 tiles → 12/6/2. (3) 17 tiles uses declared largest-remainder rounding.  
**Validation.** allocations sum exactly to total.

#### Family `harmony_audit`

**Task.** Find one false harmony, ramp, role, or universality claim.  
**Response/template.** select and correct.  
**Derivation.** test angles/components/declared constraints and claim type.  
**Difficulty.** numerically valid palette paired with invalid aesthetic conclusion.  
**Distractors.** all other statements remain narrowly true.  
**Feedback.** separate computation from taste.  
**Examples.** (1) hues 0/100/240 called a triad. (2) “complementary means accessible.” (3) a lightness ramp accidentally changes hue.  
**Validation.** Exactly one root defect; subjective wording is not silently accepted as fact.

## 5. Category: Contrast and color accessibility

### Category purpose

Develop exact WCAG 2.2 contrast reasoning and the ability to select or repair colors without confusing formal conformance with complete accessibility.

### Learn

Decode sRGB channels to linear values, calculate relative luminance, put the lighter luminance on top of the contrast formula, and compare the **unrounded** ratio with the threshold for the content type. Normal text needs `4.5:1` for Level AA; large-scale text needs `3:1`; required visual information in active controls and graphics needs `3:1` against adjacent colors. Contrast alone does not make a design accessible, and passing colors can still fail when color is the only cue.

### Prerequisites

sRGB normalization/decoding, ratios, alpha compositing, and basic text/component roles.

### Category boundaries

This category covers the pinned WCAG contrast subset and color-only cues. Broader accessibility conformance, legal certification, usability testing, and future algorithms are excluded.

### Common misconceptions

- Applying luminance weights directly to encoded 8-bit channels.
- Putting foreground luminance in the numerator even when it is darker.
- Rounding `4.499` to `4.50` before threshold comparison.
- Applying the large-text threshold to any bold text regardless of size.
- Averaging a varying background.
- Assuming a passing contrast ratio makes color-only status cues acceptable.
- Treating AA and AAA as subjective quality grades.

### Families

#### Family `relative_luminance`

**Task.** Compute WCAG relative luminance for an opaque sRGB color.  
**Response/template.** decimal number.  
**Derivation.** normalize, piecewise-decode each channel, then apply `0.2126R+0.7152G+0.0722B`.  
**Difficulty.** supplied linear lookup, direct calculator formula, near breakpoint.  
**Distractors.** weighted encoded channels, simple average, swapped coefficients.  
**Feedback.** show normalized, linear, weighted, and summed values.  
**Examples.** (1) black → 0. (2) white → 1. (3) `#336699` → computed profile luminance.  
**Validation.** Compare with independent double-precision oracle within `1e-7`.

#### Family `contrast_ratio`

**Task.** Calculate contrast between two opaque sRGB colors.  
**Response/template.** ratio to two decimals.  
**Derivation.** compute both luminances, choose lighter/darker, apply WCAG formula.  
**Difficulty.** colored pairs and near-threshold values.  
**Distractors.** luminance difference, channel difference, inverted formula.  
**Feedback.** expose both luminances and numerator order.  
**Examples.** (1) black/white → `21:1`. (2) same color → `1:1`. (3) `#777777` on white → about `4.48:1`.  
**Validation.** Threshold decisions use full precision, not the displayed two-decimal ratio.

#### Family `contrast_order`

**Task.** Rank candidate foregrounds by contrast against one background.  
**Response/template.** ordered sequence.  
**Derivation.** calculate every candidate ratio.  
**Difficulty.** non-neutral colors, close candidates, light/dark sides.  
**Distractors.** rank by channel sum, HSL lightness, or hue distance.  
**Feedback.** show luminance and ratio table.  
**Examples.** (1) rank black/gray/white on white. (2) compare blue and red with similar HSL L. (3) identify equal-ratio tie when generated.  
**Validation.** Reject accidental near-ties below display precision unless tie is intended.

#### Family `wcag_text_classify`

**Task.** Decide which WCAG 2.2 AA/AAA text thresholds a pair meets.  
**Response/template.** multiple choice or checkbox set.  
**Derivation.** compute ratio and compare with normal/large thresholds.  
**Difficulty.** multiple levels, exceptions supplied separately, near boundaries.  
**Distractors.** rounded pass, swap AA/AAA, apply non-text threshold to text.  
**Feedback.** show full ratio and every applicable threshold.  
**Examples.** (1) `7.2:1` → AA and AAA normal. (2) `4.6:1` → AA normal and AAA large, not AAA normal. (3) `3.2:1` → AA large only among those thresholds.  
**Validation.** Classification is generated from numeric predicates; choices can have multiple true labels.

#### Family `wcag_large_text_threshold`

**Task.** Decide whether supplied Latin text qualifies as large-scale under the profile.  
**Response/template.** yes/no plus threshold.  
**Derivation.** regular ≥24 px or bold-classified ≥18.666… px, using exact CSS unit conversion.  
**Difficulty.** pt/px conversion and boundary cases.  
**Distractors.** any bold text, 18 px regular, physical device-pixel reasoning.  
**Feedback.** show `1pt=4/3px` and selected branch.  
**Examples.** (1) 24 px regular → yes. (2) 18 px bold → no. (3) 14 pt bold → yes.  
**Validation.** Prompt declares Latin profile and bold classification; do not infer from font file.

#### Family `wcag_nontext_classify`

**Task.** Apply the `3:1` non-text threshold to required component/state/graphic information.  
**Response/template.** pass/fail or candidate choice.  
**Derivation.** identify adjacent colors relevant to the required visual information, then compute ratio.  
**Difficulty.** multi-edge component, state indicator, decorative exception.  
**Distractors.** use 4.5 text threshold, compare to wrong neighbor, require decoration.  
**Feedback.** mark the exact required boundary or object.  
**Examples.** (1) input border against page. (2) focus indicator against adjacent background. (3) decorative divider explicitly conveys nothing and is outside this tested requirement.  
**Validation.** Semantic scene labels required information and adjacent colors.

#### Family `contrast_choose_foreground`

**Task.** Select every foreground that meets a specified threshold on a background.  
**Response/template.** multiple choice.  
**Derivation.** compute each ratio and filter.  
**Difficulty.** colored candidates, alpha, simultaneous light/dark surfaces.  
**Distractors.** candidates just below threshold and candidates with high hue difference but low luminance contrast.  
**Feedback.** table all candidate results.  
**Examples.** (1) choose text on white. (2) choose icon on dark surface. (3) choose one text token that passes on two supplied backgrounds.  
**Validation.** Accept full satisfying set; never force one “best-looking” answer.

#### Family `contrast_minimum_gray`

**Task.** Find the nearest grayscale foreground/background step satisfying a contrast threshold.  
**Response/template.** 8-bit gray or token index.  
**Derivation.** search monotonic grayscale candidates using full WCAG math.  
**Difficulty.** light-on-dark versus dark-on-light and discrete token steps.  
**Distractors.** solve using encoded difference, choose first failing neighbor, round ratio.  
**Feedback.** show failing adjacent step and passing chosen step.  
**Examples.** (1) darkest allowed text from supplied gray scale on black. (2) lightest allowed dark text on white. (3) choose nearest token, not arbitrary RGB.  
**Validation.** Exhaustive search proves minimality within declared candidate set.

#### Family `contrast_alpha_background`

**Task.** Evaluate translucent text/object contrast after compositing on a solid background.  
**Response/template.** visible color, ratio, and pass/fail fields.  
**Derivation.** source-over encoded sRGB, then WCAG luminance/ratio.  
**Difficulty.** non-neutral layers and solve for candidate alpha.  
**Distractors.** contrast raw source color, multiply ratio by alpha, linear-light composite.  
**Feedback.** show composited color before contrast.  
**Examples.** (1) 50% black on white. (2) translucent white icon on blue. (3) select minimum alpha from supplied steps.  
**Validation.** Background is opaque and model ID explicit.

#### Family `contrast_gradient_worst_case`

**Task.** Determine whether text passes across a synthetic gradient or patterned set of regions.  
**Response/template.** minimum ratio, location, pass/fail.  
**Derivation.** compute contrast at every semantically declared background sample and take minimum.  
**Difficulty.** several stops, interpolation, alpha overlay.  
**Distractors.** average ratio, endpoints only when interior sample is worst, choose maximum.  
**Feedback.** chart ratio by sample position.  
**Examples.** (1) black text over white→gray gradient. (2) white text where lightest region is limiting. (3) overlay scrim changes every sample before checking.  
**Validation.** Exact sample set is disclosed; do not claim unsampled photographic backgrounds conform.

#### Family `color_only_cue`

**Task.** Identify or repair information conveyed only by color.  
**Response/template.** select defect and redundant cue(s).  
**Derivation.** inspect semantic encodings for label, icon, shape, pattern, position, or text redundancy.  
**Difficulty.** several states and subtle reliance on legend color.  
**Distractors.** change hue only, raise contrast without adding another cue, add decoration unrelated to state.  
**Feedback.** state which non-color cue preserves the distinction.  
**Examples.** (1) red/green form borders gain error icon and message. (2) chart lines gain labels/dash patterns. (3) selected tab gains underline and `aria-current` semantics.  
**Validation.** At least one repair works without color preview; accessibility semantics are represented in scene data.

#### Family `contrast_audit`

**Task.** Find one contrast algorithm, threshold, adjacency, rounding, or color-only error.  
**Response/template.** select and correct.  
**Derivation.** independently recompute profile conformance.  
**Difficulty.** visible rounded ratio disagrees with exact result, formal exception, varying background.  
**Distractors.** other statements are correct but may describe incomplete accessibility.  
**Feedback.** identify exact violated step and distinguish conformance from overall quality.  
**Examples.** (1) `4.499` rounded before AA check. (2) average gradient used instead of minimum. (3) 3:1 icon passes but status still uses color alone.  
**Validation.** Exactly one earliest/root defect.

## 6. Category: Palette semantics and perceptual robustness

### Category purpose

Train consistent use of color roles, states, themes, and redundant distinctions under explicit perceptual and accessibility checks.

### Learn

A palette becomes a system when colors have roles and state relationships. “Blue 600” is a primitive token; “action background” is a semantic token. Light and dark themes may map the same role to different primitives. Simulations and color-difference thresholds can reveal fragile pairs, but labels, icons, and shape remain important because no simulation represents every viewer.

### Prerequisites

Palette roles, contrast calculations, OkLCh/Oklab coordinates, and color-only-cue reasoning.

### Category boundaries

This category manages semantics and robustness. It does not diagnose vision, guarantee perception, or replace user testing.

### Common misconceptions

- Assigning raw colors directly everywhere and calling the result a design system.
- Reusing one semantic token for roles with conflicting contrast needs.
- Assuming dark theme is a channel inversion.
- Treating a simulation threshold as universal human perception.
- Creating categorical palettes that differ only by hue.
- Forgetting hover, selected, disabled, focus, and error states.

### Families

#### Family `palette_role_consistency`

**Task.** Find or apply consistent semantic-role mappings across components.  
**Response/template.** matching or anomaly selection.  
**Derivation.** resolve each semantic token through theme mapping and compare role constraints.  
**Difficulty.** aliases, several components, state overrides.  
**Distractors.** match primitive names instead of semantics, treat one intentional override as inconsistency.  
**Feedback.** trace role → primitive → rendered color.  
**Examples.** (1) all primary actions use `action.bg`. (2) destructive action uses distinct `danger.bg` by brief. (3) one card hard-codes blue instead of surface token.  
**Validation.** Brief explicitly identifies required shared and distinct roles.

#### Family `state_color_redundancy`

**Task.** Choose a state design that remains distinguishable without color.  
**Response/template.** multiple choice.  
**Derivation.** check color plus label/icon/shape/underline/position semantics.  
**Difficulty.** hover/focus/selected/error combinations.  
**Distractors.** hue-only or low-opacity-only variants.  
**Feedback.** list cues available in grayscale/text alternative.  
**Examples.** (1) selected item adds checkmark. (2) invalid field adds icon/message. (3) focused button adds outline distinct from hover.  
**Validation.** Correct option has a programmatically represented non-color cue.

#### Family `categorical_color_assignment`

**Task.** Assign palette colors to categories under contrast and pairwise-distinction constraints.  
**Response/template.** matching or select palette.  
**Derivation.** solve constraints over supplied background contrast and deltaEOK matrix.  
**Difficulty.** more categories, reuse across adjacency graph, labels.  
**Distractors.** high distinction but insufficient background contrast, or vice versa.  
**Feedback.** show constraint matrix and accepted alternatives.  
**Examples.** (1) three adjacent categories require pairwise threshold. (2) nonadjacent categories may reuse color if brief permits. (3) label every category so color is redundant.  
**Validation.** Graph/color assignment oracle enumerates all satisfying solutions.

#### Family `cvd_matrix_transform`

**Task.** Apply a supplied color-vision simulation matrix to linear RGB coordinates.  
**Response/template.** transformed triplet.  
**Derivation.** matrix-vector multiply, then declared clamp/encode.  
**Difficulty.** non-diagonal matrix and conversion steps.  
**Distractors.** multiply encoded channels, transpose matrix, clip before full multiply.  
**Feedback.** show row dot products and simulation caveat.  
**Examples.** (1) identity preset leaves color. (2) one supplied 3×3 transform. (3) compare original and transformed pair.  
**Validation.** Pinned matrices have unit tests; no diagnosis labels are inferred from result.

#### Family `cvd_pair_distinguish`

**Task.** Decide whether a pair passes a supplied deltaEOK threshold before/after simulation.  
**Response/template.** pass/fail matrix.  
**Derivation.** transform if needed, convert to Oklab, calculate distance, compare without early rounding.  
**Difficulty.** several simulation presets and background contrast constraint.  
**Distractors.** use hue-angle difference, channel Euclidean distance, original pair only.  
**Feedback.** report distances and reiterate rubric limits.  
**Examples.** (1) pair passes original and simulated. (2) passes original but collides after preset. (3) fails distinctness but remains distinguishable via labels.  
**Validation.** The threshold is printed and stored as rubric metadata.

#### Family `light_dark_theme_role`

**Task.** map semantic roles across light and dark theme primitives while preserving constraints.  
**Response/template.** matching or candidate set.  
**Derivation.** test per-theme contrast, role order, and state relationships.  
**Difficulty.** several surfaces and same accent across themes.  
**Distractors.** numeric inversion, reuse light text in dark theme, violate muted hierarchy.  
**Feedback.** table each role's two mappings and ratios.  
**Examples.** (1) canvas L order reverses while semantic role persists. (2) primary accent needs separate shade in dark theme. (3) focus token must contrast in both themes.  
**Validation.** Accept all mappings satisfying the full constraint set.

#### Family `token_alias_resolve`

**Task.** Resolve nested design-token aliases to final color and detect cycles/missing targets.  
**Response/template.** primitive token or error classification.  
**Derivation.** follow aliases with visited-set cycle detection.  
**Difficulty.** theme branches and state overrides.  
**Distractors.** stop at intermediate alias, follow wrong theme, loop forever.  
**Feedback.** display resolution path.  
**Examples.** (1) `button.bg→action.bg→blue.600`. (2) dark theme selects `blue.300`. (3) `a→b→a` is a cycle.  
**Validation.** Valid questions terminate; audits contain exactly one missing/cyclic defect.

#### Family `palette_accessibility_audit`

**Task.** Find one role, contrast, redundancy, simulation, or token-resolution flaw.  
**Response/template.** select and repair.  
**Derivation.** execute all declared palette constraints.  
**Difficulty.** defect appears only in one theme/state/simulation.  
**Distractors.** alternative stylistic preferences that meet constraints.  
**Feedback.** cite violated predicate, not “looks wrong.”  
**Examples.** (1) disabled/error share color and no other cue. (2) dark theme focus ring fails adjacency contrast. (3) token cycle affects only hover state.  
**Validation.** Exactly one root defect and at least one valid repair.

## 7. Category: Typography anatomy and measurements

### Category purpose

Make typographic size, line, spacing, and glyph metrics concrete enough to calculate rather than judge by vague appearance.

### Learn

The em square sets the design scale; the baseline anchors text; cap height and x-height describe common visible heights; ascenders rise and descenders fall around the baseline. Font size is not glyph height. Advance width moves the text cursor and differs from the visible ink box. Kerning adjusts specific pairs; tracking/letter-spacing affects every inter-glyph position.

### Prerequisites

Ratios, units, and simple coordinates.

### Category boundaries

This category computes metrics for supplied synthetic fonts. Hierarchy and readable composition belong in Category 8; complex script shaping and real system fonts are excluded.

### Common misconceptions

- Treating `font-size` as cap height.
- Assuming `1em` always means 16 px.
- Resolving child `rem` against the parent.
- Counting letter spacing after the final glyph.
- Treating kerning and tracking as synonyms.
- Using glyph bounding-box width in place of advance width.
- Assuming `ch` equals average character width for every font/string.

### Families

#### Family `type_anatomy_identify`

**Task.** Name a labeled typographic metric or feature.  
**Response/template.** matching/single choice.  
**Derivation.** map semantic guide to baseline, x-height, cap height, ascender, descender, advance, or ink box.  
**Difficulty.** more guides, mixed glyphs, horizontal and vertical metrics.  
**Distractors.** commonly confused neighboring metrics.  
**Feedback.** highlight the metric and explain what it measures.  
**Examples.** (1) line lowercase letters sit on → baseline. (2) nominal height of lowercase `x` → x-height. (3) cursor movement after glyph → advance width.  
**Validation.** Diagram derives from metric record; labels never depend on font rendering guesswork.

#### Family `css_absolute_unit_convert`

**Task.** Convert among CSS px, pt, pc, and inches.  
**Response/template.** length with unit.  
**Derivation.** `96px=1in`, `72pt=1in`, `12pt=1pc`.  
**Difficulty.** fractions and inverse conversion.  
**Distractors.** 72 px per inch, device pixels, decimal point confusion.  
**Feedback.** show common-inch basis.  
**Examples.** (1) 12pt → 16px. (2) 24px → 18pt. (3) 2pc → 32px.  
**Validation.** CSS abstract units only; physical screen measurement is not implied.

#### Family `font_relative_unit_resolve`

**Task.** Resolve `em`, `rem`, `ex`, `cap`, `ch`, or `lh` using supplied context/metrics.  
**Response/template.** px value.  
**Derivation.** multiply unit amount by named reference metric.  
**Difficulty.** select correct reference and combine units.  
**Distractors.** use root for `em`, element for `rem`, assume `ex=.5em` despite supplied metric.  
**Feedback.** name the reference value before multiplication.  
**Examples.** (1) 2em at 18px → 36px. (2) 3rem with 16px root → 48px. (3) 20ch with zero advance 9px → 180px.  
**Validation.** Every needed metric is explicit.

#### Family `nested_em_rem`

**Task.** Trace computed font sizes through a small element tree.  
**Response/template.** named px fields.  
**Derivation.** `em` in `font-size` resolves from parent; `rem` from root; percentages from parent.  
**Difficulty.** depth, mixed units, sibling comparison.  
**Distractors.** compound rem through parents, use element's new size to resolve itself, apply one parent's scale globally.  
**Feedback.** annotate tree with inherited/computed values.  
**Examples.** (1) root16, child1.25em →20. (2) grandchild1.2em →24. (3) grandchild1.5rem →24 regardless of child.  
**Validation.** Tree acyclic; all computed sizes positive and within display bounds.

#### Family `line_height_compute`

**Task.** Calculate used line height from unitless, px, or em declaration.  
**Response/template.** px.  
**Derivation.** unitless × own font size; fixed px stays fixed; declared em reference per profile.  
**Difficulty.** inheritance of unitless versus computed fixed value in a provided tree.  
**Distractors.** add multiplier rather than multiply, use parent font size, treat 150% as 150px.  
**Feedback.** show specified and used values separately.  
**Examples.** (1) 16px ×1.5 →24px. (2) 20px text with inherited unitless 1.4 →28px. (3) inherited computed 24px remains 24px under stated case.  
**Validation.** Prompt makes inheritance form explicit rather than relying on full CSS-engine behavior.

#### Family `leading_compute`

**Task.** Compute extra and half leading under the centered-leading teaching model.  
**Response/template.** two lengths.  
**Derivation.** `lineHeight-fontSize`, then divide by 2.  
**Difficulty.** negative-leading audit and several lines.  
**Distractors.** use ascent+descent, put all leading below, divide line height itself.  
**Feedback.** draw em box and line box.  
**Examples.** (1) 16/24 → 8px extra, 4px each side. (2) 20/30 →10/5. (3) 20/18 → negative leading flagged by rubric.  
**Validation.** Negative values appear only in explicit diagnostic questions.

#### Family `baseline_position`

**Task.** Calculate baseline or glyph-extents position from supplied box/metrics.  
**Response/template.** y-coordinate(s).  
**Derivation.** apply declared top leading and ascent; descender extends below baseline.  
**Difficulty.** multiple runs, mixed font sizes, shared baseline.  
**Distractors.** align tops/cap heights instead of baseline, subtract descent upward.  
**Feedback.** plot baseline and extents.  
**Examples.** (1) top 10 + half-leading4 + ascent12 → baseline26. (2) descent4 → ink/metric bottom30. (3) shift second run to match first baseline.  
**Validation.** Coordinate sign convention is displayed.

#### Family `xheight_capheight`

**Task.** Convert font-unit x-height/cap-height to px or compare apparent scale.  
**Response/template.** length or ratio.  
**Derivation.** `metric/unitsPerEm * fontSize`.  
**Difficulty.** two fonts and solve matching size.  
**Distractors.** metric equals font size, compare raw units across different UPM, swap x/cap height.  
**Feedback.** normalize through units per em.  
**Examples.** (1) xHeight500/UPM1000 at 20px →10px. (2) cap700 →14px. (3) find size for font B to match font A's 11px x-height.  
**Validation.** Metrics are positive and below/within supplied ascent as appropriate.

#### Family `glyph_advance_sum`

**Task.** Compute unkerned width of a synthetic string from glyph advances.  
**Response/template.** font units or px.  
**Derivation.** sum advances, then scale by `fontSize/unitsPerEm`.  
**Difficulty.** repeated glyphs and unit conversion.  
**Distractors.** use bounding boxes, omit repeated advances, add one per character incorrectly.  
**Feedback.** show per-glyph advance row.  
**Examples.** (1) advances 600+500 →1100 units. (2) at 20px/1000UPM →22px. (3) compare strings with same glyph count but different advances.  
**Validation.** All glyphs have supplied advances; no shaping ambiguity.

#### Family `kerning_tracking_width`

**Task.** Calculate text width with supplied kerning pairs and letter spacing.  
**Response/template.** width.  
**Derivation.** sum advances + enabled pair adjustments + spacing × `(n-1)`.  
**Difficulty.** negative kerning, repeated pairs, px conversion.  
**Distractors.** spacing after last glyph, apply kerning to wrong pair, subtract negative adjustment twice.  
**Feedback.** itemize base, kerning, and tracking totals.  
**Examples.** (1) `AV` advances1200, kern−80 →1120. (2) add 20 tracking once →1140. (3) `AVA` applies two listed pairs if present.  
**Validation.** No ligatures/contextual substitutions; pair order matters.

#### Family `measure_ch_estimate`

**Task.** Resolve a measure in `ch` and distinguish estimate from exact shaped text width.  
**Response/template.** px or claim choice.  
**Derivation.** multiply by supplied zero-glyph advance; separately compute exact synthetic string when requested.  
**Difficulty.** proportional versus monospace font, compare estimate/error.  
**Distractors.** `ch` equals character count universally, use x-height, count spaces incorrectly.  
**Feedback.** explain that `ch` references the `0` advance.  
**Examples.** (1) 60ch at 8px →480px. (2) monospace 40 characters exactly fit 40ch. (3) proportional 40-character string may not.  
**Validation.** Exact/estimate language is explicit.

#### Family `type_metrics_audit`

**Task.** Find one anatomy, unit, line-height, advance, kerning, or tracking error.  
**Response/template.** select and repair.  
**Derivation.** recompute from font metric record and unit context.  
**Difficulty.** plausible visual equivalence but wrong metric.  
**Distractors.** all other calculations use varied correct rules.  
**Feedback.** name the confused metric/reference.  
**Examples.** (1) 1rem resolved from parent. (2) letter spacing counted after last glyph. (3) cap height equated with font size.  
**Validation.** Exactly one root defect.

## 8. Category: Type scales, hierarchy, and text composition

### Category purpose

Train construction of coherent typographic systems and text blocks under measurable, declared constraints.

### Learn

Hierarchy uses more than size: role, weight, spacing, contrast, and position can reinforce it. A modular scale multiplies adjacent sizes by a declared ratio. Line measure, line height, and paragraph spacing affect composition, but no single numeric range guarantees readability for every script, font, device, or reader. Exact questions therefore state the target range or design brief.

### Prerequisites

Typography measurements and basic palette contrast.

### Category boundaries

This category works with supplied content lengths, metric estimates, and rubrics. It does not grade prose quality, typeface personality, cultural suitability, or universal readability.

### Common misconceptions

- Increasing every heading by an arbitrary fixed number in a ratio-based scale.
- Relying on size alone for hierarchy.
- Treating a recommended line length as a universal accessibility requirement.
- Assuming justified text is always better because both edges align.
- Applying paragraph spacing on top of collapsed margins without a declared model.
- Pairing fonts based only on vague “contrast” without a role rubric.

### Families

#### Family `modular_scale`

**Task.** Generate or complete a type scale from base and ratio.  
**Response/template.** size(s).  
**Derivation.** `size_k = base * ratio^k`, with declared rounding.  
**Difficulty.** negative steps, missing interior, token rounding.  
**Distractors.** additive increments, repeated rounding drift, inverse error.  
**Feedback.** show exponent and unrounded value.  
**Examples.** (1) base16 ratio1.25 →20. (2) next →25. (3) step−1 →12.8.  
**Validation.** Compute from base for every step rather than chaining rounded outputs.

#### Family `hierarchy_ratio`

**Task.** Calculate or compare size/weight/contrast ratios in a type hierarchy.  
**Response/template.** ratio or ordered roles.  
**Derivation.** apply the metric named by the rubric.  
**Difficulty.** multiple cues and competing role requirements.  
**Distractors.** compare area instead of font size, use color hue instead of contrast, ignore role.  
**Feedback.** separate each hierarchy cue.  
**Examples.** (1) 32px heading /16px body →2. (2) subtitle 20 versus body16 →1.25. (3) choose hierarchy satisfying both size and contrast constraints.  
**Validation.** Do not combine heterogeneous cues into one score unless formula is supplied.

#### Family `style_role_match`

**Task.** assign text styles to heading, body, caption, label, or metadata under a supplied brief.  
**Response/template.** matching.  
**Derivation.** solve explicit predicates for size order, weight, line height, case, and contrast.  
**Difficulty.** several plausible styles and multiple constraints.  
**Distractors.** meet size but fail contrast/line-height role, or confuse label/caption.  
**Feedback.** list predicates per role.  
**Examples.** (1) largest/highest emphasis → title. (2) body requires 16–18px and 1.4–1.7 line height under brief. (3) metadata must be visually quieter but still pass text contrast.  
**Validation.** Backward-generate unique mapping or accept all satisfying mappings.

#### Family `line_count_fit`

**Task.** estimate or exactly determine line count using supplied word/glyph widths and wrapping rule.  
**Response/template.** integer and break positions.  
**Derivation.** greedy line fill including spaces under the tiny declared line breaker.  
**Difficulty.** variable word widths and unbreakable token.  
**Distractors.** total width/container rounded division, omit spaces, split forbidden word.  
**Feedback.** show each filled line.  
**Examples.** (1) fixed-width words in 200px. (2) one word moves to next line because space+word exceeds. (3) unbreakable token overflows under stated rule.  
**Validation.** Text is synthetic and every advance known; no browser shaping dependence.

#### Family `line_length_select`

**Task.** choose a measure satisfying a declared characters-per-line or pixel range.  
**Response/template.** all valid choices.  
**Derivation.** compute `ch` estimate or exact representative line width as stated.  
**Difficulty.** several fonts, responsive widths, simultaneous min/max.  
**Distractors.** universalize the range, use viewport rather than content width, confuse characters with words.  
**Feedback.** show range and candidate measures.  
**Examples.** (1) brief requests 45–75ch; choose 60ch. (2) 80ch violates upper bound. (3) CJK locale uses separately supplied target, not Latin range.  
**Validation.** Wording says “under this brief,” never “always readable.”

#### Family `vertical_rhythm`

**Task.** align type sizes, line boxes, and block spacing to a supplied baseline/spacing unit.  
**Response/template.** multiples or repaired positions.  
**Derivation.** test y-coordinates/heights modulo rhythm unit with declared origin.  
**Difficulty.** mixed styles and cumulative blocks.  
**Distractors.** align glyph tops, ignore paragraph spacing, round each block inconsistently.  
**Feedback.** overlay rhythm lines and show remainder.  
**Examples.** (1) 24px line height on 4px unit →6 units. (2) next baseline at y72 from y48. (3) repair a 2px off-grid caption.  
**Validation.** Rhythm is a brief constraint, not a universal necessity.

#### Family `paragraph_spacing`

**Task.** calculate block height or inter-paragraph gap under a declared spacing model.  
**Response/template.** length(s).  
**Derivation.** lines × line height plus stated paragraph/block gaps; no implicit margin collapse unless modeled.  
**Difficulty.** several paragraphs and different last-line policy.  
**Distractors.** add gap after final paragraph, count font size instead of line height, collapse without instruction.  
**Feedback.** itemize line boxes and gaps.  
**Examples.** (1) 3 lines×24=72px. (2) two such paragraphs with 16px gap →160px total. (3) compare two spacing tokens under brief.  
**Validation.** Final-gap and margin-collapse policies are explicit.

#### Family `text_spacing_resilience`

**Task.** determine whether a component retains content/function when text-spacing overrides are applied.  
**Response/template.** pass/fail and failure cause.  
**Derivation.** reflow exact synthetic text under supplied override and container constraints.  
**Difficulty.** labels, buttons, multiple lines, fixed heights.  
**Distractors.** judge original only, clip overflow, shrink text to fit.  
**Feedback.** show before/after geometry and identify clipping/overlap.  
**Examples.** (1) flexible-height card grows and passes. (2) fixed-height button clips enlarged spacing. (3) label wraps but remains visible and functional.  
**Validation.** Uses a pinned subset inspired by WCAG text-spacing resilience; does not claim full-page conformance.

#### Family `type_pairing_rubric`

**Task.** choose type-style pairing under explicit role and metric constraints.  
**Response/template.** one or all valid pairings.  
**Derivation.** test supplied x-height ratio, weight availability, width contrast, script coverage, and role predicates.  
**Difficulty.** several independent constraints.  
**Distractors.** aesthetically plausible but violates coverage or metric threshold.  
**Feedback.** table constraint results and state that taste remains open.  
**Examples.** (1) body font must include required glyph set. (2) heading/body x-height ratio within brief. (3) choose among synthetic fonts without personality labels.  
**Validation.** No claims such as “serif + sans is always best”; accept every satisfying pair.

#### Family `type_hierarchy_audit`

**Task.** find one scale, role, line, rhythm, spacing-resilience, or unsupported aesthetic claim.  
**Response/template.** select and repair.  
**Derivation.** run metric and rubric checks.  
**Difficulty.** defect appears only after wrap/override or in one role.  
**Distractors.** stylistic alternatives that meet constraints.  
**Feedback.** cite violated measurement or distinguish preference.  
**Examples.** (1) rounded scale compounds from prior rounded step. (2) muted caption falls below contrast threshold. (3) “this typeface is objectively friendlier” is ungradeable.  
**Validation.** Exactly one root defect with a measurable or classification basis.

## 9. Category: Layout geometry, alignment, and grids

### Category purpose

Train recognition and construction of strong geometric relationships: common edges, centers, baselines, equal gaps, grids, spans, and proximity groups.

### Learn

Alignment creates shared invisible lines. Compare the relevant coordinates: left edges use `x`, right edges use `x+width`, centers use `x+width/2`, and text aligns typographically by baseline rather than by bounding-box top. Grids divide available width after gutters are removed. Proximity can express grouping, but only when the intended groups and spacing rule are declared.

### Prerequisites

Rectangle coordinates, arithmetic, and baseline metrics.

### Category boundaries

This category solves fixed-layout geometry. Responsive changes belong in Category 10. Optical correction may be discussed, but exact optical alignment requires a supplied correction value and is never guessed from taste.

### Common misconceptions

- Comparing widths instead of edge coordinates.
- Centering by equal `x` rather than equal center coordinate.
- Aligning text boxes at the top instead of their baselines.
- Dividing total width into columns before subtracting gutters.
- Omitting internal gutters from a multi-column span.
- Treating margins and gaps as interchangeable in every layout.
- Inferring groups from color alone when distance contradicts the declared rule.

### Families

#### Family `box_model_size`

**Task.** compute content, padding, border, margin, border-box, or outer size.  
**Response/template.** named width/height fields.  
**Derivation.** sum relevant sides under declared `content-box`/`border-box` rule.  
**Difficulty.** asymmetric sides, solve missing dimension, nested boxes.  
**Distractors.** omit one side, include margin in border box, double-subtract padding.  
**Feedback.** diagram concentric boxes with subtotals.  
**Examples.** (1) content100 + 10px padding each side →120 borderless border box. (2) add 2px borders →124. (3) border-box width200 with padding16×2/border1×2 → content166.  
**Validation.** Dimensions non-negative; sizing mode explicit.

#### Family `edge_alignment`

**Task.** determine whether rectangles share a left/right/top/bottom edge or calculate a repair shift.  
**Response/template.** alignment choice and delta.  
**Derivation.** compare corresponding edge coordinates.  
**Difficulty.** unequal sizes, several candidates, tolerance.  
**Distractors.** compare origins for right alignment, compare centers, choose visually nearest.  
**Feedback.** extend the relevant alignment guide.  
**Examples.** (1) x values both20 → left aligned. (2) boxes `(20,w80)` and `(40,w60)` share right edge100. (3) move x=33,w40 to right edge100 → x=60, shift+27.  
**Validation.** Coordinates derive from semantic scene; no screenshot measurement.

#### Family `center_alignment`

**Task.** calculate centers or position an item centered in a container/with another item.  
**Response/template.** coordinate or yes/no.  
**Derivation.** `center=start+size/2`; centered child start `(containerSize-childSize)/2 + containerStart`.  
**Difficulty.** nonzero origins, two axes, odd/fractional sizes.  
**Distractors.** set child x to container center, equal left/right coordinates rather than spaces.  
**Feedback.** show centerline and side spaces.  
**Examples.** (1) 40px item in 200px container → x80. (2) container starts30 → x110. (3) center both axes in `(x10,y20,w300,h180)`.  
**Validation.** Preserve subpixel coordinates when needed; rounding policy stated.

#### Family `baseline_alignment`

**Task.** align text runs/components by supplied baseline positions.  
**Response/template.** shift or final y-coordinate.  
**Derivation.** set `baselineY` equal, moving whole subject by the difference.  
**Difficulty.** mixed sizes, internal offsets, first/last baseline.  
**Distractors.** align tops, bottoms, cap heights, or vertical centers.  
**Feedback.** overlay baseline rather than box guide.  
**Examples.** (1) baselines at30/34 → move first +4. (2) icon has supplied optical/baseline anchor. (3) first-baseline align two multiline cards under declared rule.  
**Validation.** Baseline anchor is explicit for non-text subjects.

#### Family `equal_gap_distribution`

**Task.** test, compute, or repair equal gaps among ordered objects.  
**Response/template.** gap values or moved coordinate.  
**Derivation.** `next.x-current.right` (or vertical equivalent).  
**Difficulty.** unequal sizes, fixed endpoints, one missing coordinate.  
**Distractors.** compare origins, use center distances, include outer margin unintentionally.  
**Feedback.** label every internal gap.  
**Examples.** (1) `[x0,w20],[x30,w10],[x50,w25]` has gaps10/10. (2) place third for 12px gaps. (3) identify one 1px near-miss.  
**Validation.** Items do not overlap unless overlap is the audit target.

#### Family `space_between`

**Task.** compute `space-between` positions for items in a container.  
**Response/template.** gap and positions.  
**Derivation.** extra space `(containerWidth-sumWidths)/(n-1)`; first and last flush to edges.  
**Difficulty.** unequal widths and nonzero container origin.  
**Distractors.** divide by `n+1` (space-evenly), by `n` (space-around-like), ignore widths.  
**Feedback.** distinguish fixed `gap` from distributed remaining space.  
**Examples.** (1) 3×20 in 100 → gaps20. (2) widths10/20/30 in120 → gaps30. (3) one item invokes stated fallback rather than divide by zero.  
**Validation.** At least two items except explicit fallback questions.

#### Family `grid_column_width`

**Task.** compute equal column width from content width, column count, and gutter.  
**Response/template.** length.  
**Derivation.** `(W-(n-1)g)/n`.  
**Difficulty.** solve inverse width/count and fractional columns.  
**Distractors.** subtract `ng`, divide before subtracting, include outer margins as gutters.  
**Feedback.** show total gutter width then remaining track width.  
**Examples.** (1) W1200,n12,g24 →78px. (2) W600,n3,g20 →186.667px. (3) solve W for 4×160 columns and 24 gutters →712px.  
**Validation.** Remaining width positive; subpixel policy explicit.

#### Family `grid_span_width`

**Task.** calculate the width or end coordinate of an item spanning `k` columns.  
**Response/template.** length/coordinate.  
**Derivation.** `k*c+(k-1)g`.  
**Difficulty.** start column, offset, nested grid.  
**Distractors.** omit internal gutters, include a trailing gutter, multiply span by `(c+g)`.  
**Feedback.** color tracks and included internal gutters.  
**Examples.** (1) 2×80 columns with20 gutter →180. (2) 4-column span →`4c+3g`. (3) derive right edge from grid origin/start index.  
**Validation.** Span within grid bounds.

#### Family `grid_place_item`

**Task.** determine x/width from start line and span in a numbered equal grid.  
**Response/template.** rectangle fields.  
**Derivation.** `x=origin+(start-1)(c+g)`, width by span formula.  
**Difficulty.** one-based line/column terminology and several items.  
**Distractors.** zero-based off-by-one, add outer gutter, span line count instead of columns.  
**Feedback.** label grid lines and tracks.  
**Examples.** (1) start column1 → origin. (2) start3 with c80,g20 → origin+200. (3) start4 span3 → computed x/width.  
**Validation.** Prompt says whether `start` names a column or grid line.

#### Family `margin_gutter_distinguish`

**Task.** classify or calculate space caused by container padding, item margin, or grid/flex gap.  
**Response/template.** label and length.  
**Derivation.** inspect semantic layout property and affected boundaries.  
**Difficulty.** nested components and asymmetric spacing.  
**Distractors.** call every blank area margin, assume margins collapse in flex/grid, treat padding as outside.  
**Feedback.** shade owner box and space region.  
**Examples.** (1) space inside card border → padding. (2) fixed separation between grid tracks → gap/gutter. (3) outside component boundary → margin under supplied model.  
**Validation.** Scene stores ownership; no inference from appearance alone.

#### Family `proximity_group`

**Task.** infer or enforce groups under a supplied distance threshold/rule.  
**Response/template.** grouping or moved coordinate.  
**Derivation.** build adjacency from declared distance metric and threshold, then apply stated grouping method.  
**Difficulty.** chain-link versus complete-link rule, distracting color similarity.  
**Distractors.** group solely by hue, use center distance instead of edge gap, ignore rule.  
**Feedback.** show measured gaps and resulting graph/groups.  
**Examples.** (1) label 4px from field versus 20px from next field. (2) cards separated by larger section gap. (3) identify ambiguous chaining under one rule and reject it.  
**Validation.** Use backward generation for unique grouping; ambiguous cases only in audits.

#### Family `alignment_line_count`

**Task.** compare layouts by number of distinct declared alignment lines or violations.  
**Response/template.** count/rank.  
**Derivation.** cluster exact/tolerance-qualified edges/baselines named by rubric.  
**Difficulty.** several edge types and intentional exceptions.  
**Distractors.** count every object edge, reward fewer lines without declared goal, ignore baselines.  
**Feedback.** draw counted guides.  
**Examples.** (1) three left edges share one line. (2) one 2px offset creates a violation under 0px tolerance. (3) choose layout using at most three declared primary guides.  
**Validation.** The rubric states which anchors count; fewer lines is not universally “better.”

#### Family `layout_geometry_audit`

**Task.** find one box-model, edge, center, baseline, distribution, grid, or proximity error.  
**Response/template.** select and repair coordinates/property.  
**Derivation.** evaluate semantic geometry constraints.  
**Difficulty.** small near-miss or downstream span effect.  
**Distractors.** intentional asymmetry explicitly permitted by brief.  
**Feedback.** show violated equation and corrected value.  
**Examples.** (1) span omits internal gutter. (2) text tops align but baselines do not. (3) one internal gap is 15px versus required16.  
**Validation.** Exactly one root defect; rendering tolerances cannot create accidental false positives.

## 10. Category: Responsive layout, whitespace, and composition

### Category purpose

Train layout decisions across declared sizes and constraints, including wrapping, flexible measures, spacing scales, and quantitative composition rubrics.

### Learn

Responsive design changes relationships when constraints become active. Determine available width, subtract fixed gaps/padding, test whether the intended content fits, and then apply the declared fallback. `clamp(min, preferred, max)` is the preferred value bounded by min/max. Whitespace is allocated space with a role; it is not automatically wasted space.

### Prerequisites

Fixed layout geometry, typography width/line calculations, and palette/type roles.

### Category boundaries

This category uses a small declarative constraint solver, not a full browser CSS engine. It evaluates finite named viewports, not arbitrary real devices.

### Common misconceptions

- Treating a breakpoint as a device category rather than a condition.
- Forgetting gaps/padding in fit calculations.
- Choosing a column count whose minimum card widths cannot fit.
- Assuming `clamp()` always returns the preferred expression.
- Preserving desktop whitespace so rigidly that content clips.
- Calling all empty space accidental.
- Treating a declared balance proxy as objective beauty.

### Families

#### Family `constraint_fit`

**Task.** decide whether objects fit within a container under supplied widths/gaps/padding.  
**Response/template.** yes/no and remaining/overflow length.  
**Derivation.** sum occupied widths and compare with available content width.  
**Difficulty.** min/max sizes, asymmetric padding, several rows.  
**Distractors.** omit gaps/padding, compare with viewport not container, ignore min constraint.  
**Feedback.** show width budget.  
**Examples.** (1) 3×200 +2×24 in700 → fits with52. (2) add 32px side padding → overflow12. (3) solve largest fitting item count.  
**Validation.** Boundary equality counts as fit.

#### Family `responsive_columns`

**Task.** choose maximum equal-card column count at a declared container width.  
**Response/template.** integer.  
**Derivation.** largest `n` satisfying `n*m+(n-1)g<=W`, within configured max.  
**Difficulty.** several viewport widths and max-column cap.  
**Distractors.** floor `W/m` without gaps, round up, ignore configured cap.  
**Feedback.** show first failing and largest passing count.  
**Examples.** (1) W640,m200,g20 →3 columns. (2) W639 →2. (3) W1200 fits5 but max4 →4.  
**Validation.** Exhaustively test candidate integers.

#### Family `breakpoint_state`

**Task.** determine active layout state from ordered min/max-width conditions.  
**Response/template.** state name.  
**Derivation.** evaluate inclusive/exclusive predicates with source-order tie rule supplied.  
**Difficulty.** exact boundary, overlapping rules, container versus viewport query.  
**Distractors.** device-name guessing, wrong inequality, use viewport for container condition.  
**Feedback.** show each predicate truth value.  
**Examples.** (1) `<600 compact`, `>=600 regular`: 600→regular. (2) container500 inside viewport1200 still compact under container rule. (3) overlapping state resolved by explicit priority.  
**Validation.** Every width maps to exactly one state after declared priority.

#### Family `fluid_clamp`

**Task.** evaluate a numeric `clamp(min,preferred,max)`-style design value.  
**Response/template.** length.  
**Derivation.** `max(min, min(preferred,max))` after resolving units.  
**Difficulty.** viewport-relative preferred term and multiple widths.  
**Distractors.** average min/max, ignore cap, clamp before unit resolution.  
**Feedback.** show resolved preferred value and active bound.  
**Examples.** (1) clamp(16,20,32)→20. (2) preferred12→16. (3) `2vw` at 1200=24 within 18–28.  
**Validation.** All quantities converted to common units first.

#### Family `aspect_ratio_box`

**Task.** compute missing box dimension or fit/crop under a declared aspect-ratio rule.  
**Response/template.** length or mode.  
**Derivation.** `width/height=ratio`; contain uses min scale, cover uses max scale.  
**Difficulty.** nested padding and crop amount.  
**Distractors.** invert ratio, use container ratio, confuse contain/cover.  
**Feedback.** show scale factors and overflow/letterbox.  
**Examples.** (1) 16:9 at width320 →height180. (2) fit 4:3 in 300×300 using contain →300×225. (3) cover same box →400×300, crop100 horizontally.  
**Validation.** Ratio positive; rounding policy explicit.

#### Family `content_wrap`

**Task.** predict which items/words wrap under a declared simple flow.  
**Response/template.** rows or break indices.  
**Derivation.** greedily place item plus preceding gap if it fits, otherwise start new row.  
**Difficulty.** unequal item widths, max rows, unbreakable content.  
**Distractors.** balance rows optimally when greedy rule specified, include leading row gap, split item.  
**Feedback.** display row width budgets.  
**Examples.** (1) chips widths80/90/70 in200 with10 gap → two rows. (2) exact fit remains same row. (3) oversize item overflows under `no-shrink` rule.  
**Validation.** Stable item order and deterministic tie behavior.

#### Family `spacing_scale`

**Task.** select or compute spacing tokens from a declared base/multiplier scale.  
**Response/template.** token/value or repaired layout.  
**Derivation.** resolve token table or formula; compare use with role rule.  
**Difficulty.** nested component/section scales and exceptions.  
**Distractors.** arbitrary off-scale near value, confuse token index with pixels, use section gap inside control.  
**Feedback.** show scale and semantic tier.  
**Examples.** (1) base4 scale →4/8/12/16. (2) `space.4=16px`. (3) replace 15px near-miss with allowed16px token.  
**Validation.** A scale is a declared system constraint, not proof that off-scale spacing is aesthetically wrong.

#### Family `visual_weight_balance`

**Task.** compute a declared visual-weight moment and choose/position an item to meet balance tolerance.  
**Response/template.** moment, coordinate, or candidate.  
**Derivation.** sum `weight*signedDistance` around supplied axis.  
**Difficulty.** several objects and solve missing distance/weight.  
**Distractors.** use area instead of declared weight, ignore sign, demand exact symmetry when tolerance allows.  
**Feedback.** show moment table and warn that proxy is not universal perception.  
**Examples.** (1) equal weights at ±40 balance. (2) weight2 at−20 balances weight1 at+40. (3) choose candidate bringing total within ±5 moment units.  
**Validation.** Weights are given, never inferred from arbitrary color/artwork.

#### Family `whitespace_allocate`

**Task.** allocate remaining space among declared regions or identify its role.  
**Response/template.** lengths or classification.  
**Derivation.** subtract occupied content/gaps and apply supplied distribution rule.  
**Difficulty.** asymmetric emphasis, min/max region constraints.  
**Distractors.** distribute total instead of remainder, treat every blank region as margin, violate content minimum.  
**Feedback.** label functional whitespace: padding, group gap, breathing room, alignment reserve.  
**Examples.** (1) split 120px remainder 2:1 →80/40. (2) reserve minimum32 then distribute rest. (3) identify whitespace separating sections versus internal label gap.  
**Validation.** Intent/rule is supplied; no arbitrary praise of “more whitespace.”

#### Family `responsive_audit`

**Task.** find one fit, breakpoint, clamp, ratio, wrap, spacing, or composition error across named widths.  
**Response/template.** failing width/rule and repair.  
**Derivation.** evaluate all constraints at every test width.  
**Difficulty.** defect only at boundary or localized content expansion.  
**Distractors.** alternate valid layouts or preferences.  
**Feedback.** show exact first failing constraint and width.  
**Examples.** (1) three cards overflow by1px at breakpoint. (2) fixed-height text clips after wrapping. (3) preferred clamp value exceeds max but implementation fails to cap.  
**Validation.** Exactly one root defect; all tested widths are stored.

## 11. Category: Integrated visual-design decisions

### Category purpose

Combine palette, accessibility, typography, and layout into small, exact design problems without using a language model as an aesthetic judge.

### Learn

Integrated design has several gates. First meet hard constraints such as content, contrast, state distinction, and fit. Then apply the declared hierarchy and alignment rubric. If several solutions remain, they are all valid unless a tie-breaker is explicitly supplied. A design can conform technically and still warrant human testing; the app teaches disciplined reasoning, not automatic taste.

### Prerequisites

Relevant component families from Categories 4–10.

### Category boundaries

Scenes are synthetic cards, forms, controls, navigation, and poster-like blocks. The app does not grade real brands, uploaded work, persuasive effectiveness, or personal style.

### Common misconceptions

- Optimizing visual harmony before satisfying content/accessibility constraints.
- Fixing low contrast by making text larger without checking large-scale qualification.
- Aligning containers while their text baselines remain inconsistent.
- Treating one theme/state/viewport as the whole component.
- Selecting the most visually dramatic option despite the supplied brief.
- Assuming the oracle has authority over subjective taste.

### Families

#### Family `component_token_apply`

**Task.** resolve and apply color, type, and spacing tokens to a component under a state/theme.  
**Response/template.** named token assignments or rendered candidate choice.  
**Derivation.** resolve semantic aliases, compute metrics, and test component predicates.  
**Difficulty.** theme/state overrides and nested tokens.  
**Distractors.** hard-coded primitives, wrong state branch, off-scale spacing.  
**Feedback.** trace every resolved token and check.  
**Examples.** (1) default primary button. (2) dark-theme hover button. (3) disabled state retains label legibility under supplied rules.  
**Validation.** Accept all token sets meeting the component contract.

#### Family `button_state_contrast`

**Task.** select or repair a complete set of button states.  
**Response/template.** palette/state matching.  
**Derivation.** check label/background, border/background, focus adjacency, and non-color state cues.  
**Difficulty.** hover/focus/pressed/disabled across two themes.  
**Distractors.** each fixes one ratio but breaks another state.  
**Feedback.** state-by-state contrast matrix and cue inventory.  
**Examples.** (1) choose default label. (2) focus ring must contrast with surface and button where relevant. (3) pressed state gains shape/position cue in addition to color.  
**Validation.** Disabled exceptions are explicitly scoped; demonstrations remain readable.

#### Family `card_layout_repair`

**Task.** repair one card's alignment, hierarchy, contrast, or responsive-fit defect with minimum declared changes.  
**Response/template.** select edit(s) or numeric values.  
**Derivation.** evaluate hard constraints, then minimize weighted edit cost supplied by rubric.  
**Difficulty.** several possible repairs and cross-effect.  
**Distractors.** cosmetic edit that leaves root defect, valid but higher cost when minimum is asked.  
**Feedback.** show before/after constraint results and edit cost.  
**Examples.** (1) align title/body left edge. (2) change muted token to pass contrast. (3) allow card height to grow when text wraps.  
**Validation.** Enumerate candidate edits and accept all minimum-cost satisfying repairs.

#### Family `form_alignment_accessibility`

**Task.** diagnose or construct a small form using labels, fields, help/error text, focus, and grouping.  
**Response/template.** layout choice or repairs.  
**Derivation.** test label association metadata, proximity, baseline/edge rules, contrast, and redundant error cues.  
**Difficulty.** multi-field grid and narrow viewport.  
**Distractors.** placeholder-only label, color-only error, aligned visuals with incorrect semantic association.  
**Feedback.** separate visual and programmatic relationships.  
**Examples.** (1) labels close to own field. (2) error includes icon/text and sufficient contrast. (3) narrow state stacks without changing meaningful order.  
**Validation.** Exact semantic tree accompanies geometry; this remains a bounded exercise, not full WCAG certification.

#### Family `poster_hierarchy_plan`

**Task.** arrange synthetic title, subtitle, details, and action under a supplied poster-like hierarchy/grid brief.  
**Response/template.** ordered style/layout candidate or named positions.  
**Derivation.** test prominence ratios, reading order, alignment lines, contrast, and fit.  
**Difficulty.** several valid compositions and explicit tie rubric.  
**Distractors.** visually dramatic but violates reading order/contrast/grid.  
**Feedback.** show each candidate's constraint table; avoid aesthetic absolutes.  
**Examples.** (1) title gets highest declared emphasis. (2) details remain readable and grouped. (3) asymmetric option passes a supplied balance tolerance.  
**Validation.** Accept every satisfying layout unless a numerical tie-breaker exists.

#### Family `palette_type_layout_constraints`

**Task.** select a mini design satisfying simultaneous palette, typography, and layout constraints.  
**Response/template.** multiple choice or constrained construction.  
**Derivation.** evaluate all predicates independently and return satisfying set.  
**Difficulty.** 5–10 interacting constraints and two viewports.  
**Distractors.** each violates one known misconception while passing others.  
**Feedback.** matrix of constraints, not one opaque score.  
**Examples.** (1) accessible card theme. (2) triadic accent brief plus neutral readable text. (3) type scale and grid both adapt at narrow width.  
**Validation.** Backward-generate at least one solution; reject accidental extra solutions only when response expects uniqueness.

#### Family `design_compare_rubric`

**Task.** compare alternatives using an explicitly weighted or lexicographic design rubric.  
**Response/template.** rank or best candidate with score breakdown.  
**Derivation.** apply hard constraints first, then supplied scoring/tie rules.  
**Difficulty.** tradeoffs, ties, sensitivity to weights.  
**Distractors.** choose personal preference, maximize one cue while ignoring hard fail, average incomparable scores without rubric.  
**Feedback.** show score/constraint contribution and note that another rubric could rank differently.  
**Examples.** (1) eliminate contrast failures before alignment score. (2) minimize token deviations after all pass. (3) two candidates tie and both are correct.  
**Validation.** Score formula fully disclosed and independently recomputed.

#### Family `integrated_audit`

**Task.** find the first/root technical, standards-profile, rubric, or answer-authority defect in a generated design exercise.  
**Response/template.** layer, defect, and repair.  
**Derivation.** compare semantic scene, renderer, color/type/layout oracles, wording, and grader.  
**Difficulty.** downstream symptoms cross several domains.  
**Distractors.** subjective differences or consequences rather than root defect.  
**Feedback.** identify source layer and all affected outputs.  
**Examples.** (1) rendered swatch differs from semantic hex. (2) checker measures screenshot instead of source rectangles. (3) prompt asks “most beautiful” but expects one hard-coded palette.  
**Validation.** Exactly one root defect; audit fixture deterministic.

## 12. Topic-level progression

### Level 1 — Coordinates and visible relationships

- hex/RGB conversion using simple channels;
- hue wrap and complementary colors;
- additive primary and ideal CMY demonstrations;
- black/white/gray contrast using supplied luminance;
- type anatomy and px/pt/em;
- left, right, center, and equal-gap alignment;
- generous visual labels and formula cards.

### Level 2 — Controlled systems

- normalized channels, alpha, HSL component reading;
- analogous, triadic, and palette ramps;
- direct relative-luminance calculation with lookup values;
- AA text classification;
- font metrics, line height, leading, advances;
- box model, grids, gutters, and spans;
- one theme and one viewport at a time.

### Level 3 — Model selection and roles

- encoded versus linear-light mixing;
- gradients and hue interpolation;
- palette roles, token aliases, states, and non-text contrast;
- large-scale text and varying backgrounds;
- modular type scales, measure, paragraph rhythm;
- proximity grouping, responsive column fit, wrapping;
- short cross-domain component questions.

### Level 4 — Robustness and responsive behavior

- OkLCh/Oklab operations and gamut checks;
- color-vision simulation under supplied matrices;
- light/dark themes and color-independent cues;
- alpha contrast and near-threshold classification;
- text-spacing resilience and type pairing rubrics;
- breakpoint, clamp, aspect-ratio, whitespace, and balance constraints;
- multi-state, multi-viewport scenes.

### Level 5 — Integrated design reasoning

- multiple color/mixing models in one audit;
- complete component state matrices;
- palette/type/layout constraint solving;
- minimum-cost repairs and rubric-sensitive comparison;
- generator/renderer/checker audits;
- explicit identification of exact, standards-based, rubric-based, and subjective claims.

Progression changes one or two meaningful dimensions at a time. Higher levels must not simply show more decorative elements or smaller differences.

## 13. Adaptive practice guidance

Track mastery separately by:

```text
representation and direction
color space / mixing model
channel and transfer-function step
hue rule
palette role and state
contrast content type / threshold / background type
color-independent cue
typography unit / metric / inheritance
text composition rule
alignment anchor
grid / distribution / proximity rule
responsive constraint
misconception
exact / standards / rubric classification
```

Recommended responses to errors:

- Hex-decimal errors trigger byte/nibble drills before returning to palette work.
- Encoded/linear confusion triggers paired midpoint comparisons with the model name visible.
- Harmony angle errors trigger hue-wrap and missing-member practice, not subjective palette ranking.
- Near-threshold contrast errors trigger unrounded comparisons and threshold classification separately.
- Repeated use of HSL lightness as luminance triggers same-HSL-L/different-luminance contrasts.
- Color-only solutions trigger grayscale/label/icon alternatives.
- `em`/`rem` errors trigger shallow element trees before deeper nesting.
- Top-alignment answers in baseline tasks trigger overlaid baseline comparison.
- Grid span errors trigger one- and two-span width decompositions.
- Responsive failures trigger one width-budget calculation before multi-viewport scenes.
- Choosing aesthetically preferred but invalid alternatives triggers a hard-constraints-first comparison.

Slow but correct visual inspection should not be penalized by forced timing. Fluency may be measured, but accessibility accommodations and zoom do not lower correctness.

## 14. Answer checking and worked feedback

### Color checking

- Parse inputs to semantic color objects.
- Preserve floating precision through conversion/mixing.
- Compare tuple results with absolute tolerance `1e-6`, or integer channels after declared rounding.
- Hue equality uses circular normalization and treats hue as powerless where the profile says so.
- Hex alternatives normalize before comparison.
- Gamut detection occurs before mapping/clamping unless prompt asks for mapped result.

### Contrast checking

- Recompute from canonical sRGB source or visible composited color.
- Never parse displayed rounded luminance/ratio back into the oracle.
- Classification compares exact ratio with exact threshold.
- Varying backgrounds return the minimum relevant ratio and its location.
- Multiple thresholds may be true simultaneously.

### Typography and geometry checking

- Resolve all units to rational or double-precision CSS px.
- Font answers derive from supplied metric records, not runtime system-font measurement.
- Rectangle/alignment answers derive from semantic coordinates.
- Tolerance defaults to `1e-6` for exact generated geometry; visual near-miss questions supply their own tolerance.
- Constraint solvers enumerate all satisfying assignments when feasible.

### Rubric checking

Hard predicates and soft scores are separate:

```text
if any hard predicate fails:
    candidate is invalid
else:
    compute disclosed rubric score/tie
```

If the prompt has no declared rubric capable of distinguishing valid alternatives, all valid alternatives are accepted. Subjective reflection has no correctness score.

### Feedback sequence

For an integrated failure:

1. identify the answer type: exact, standard, or rubric;
2. show source semantic values;
3. calculate the failed relation;
4. name the likely misconception when it matches a known alternative;
5. show all hard constraints;
6. offer a minimally changed valid repair;
7. follow with a near-transfer item changing one dimension.

Feedback must never say only “this looks better.”

## 15. Rendering, interaction, localization, and accessibility

### Rendering

- Use SVG for swatches, hue wheels, metric diagrams, guides, grids, and component scenes.
- Use CSS/HTML for text-entry and controls, but exact text geometry comes from synthetic metrics.
- All visible colors are accompanied by a textual token/coordinate view on request.
- “Audio-like” sensory lockout is inappropriate: color tasks always have a semantic alternative.
- Anti-aliasing must not change the answer; do not sample screenshots for contrast or geometry.
- A display-gamut warning appears when preview cannot faithfully render a semantic color.
- Near-threshold exercises show numeric values after response so display variation cannot hide the lesson.

### Interaction

- Dragging swatches or boxes may be offered, but every drag has keyboard/numeric alternatives.
- Snapping guides may be disabled in diagnosis tasks and enabled in construction practice; the state is visible.
- Color pickers expose coordinates and do not require color matching by eye.
- Zoom and browser text scaling must not break question controls or hide answer fields.
- No exercise uses rapid flashing, afterimages, or timed color-memory.

### Accessibility

- The app itself meets the pinned WCAG contrast requirements for its controls and text.
- Question correctness is never communicated by green/red alone.
- Swatches include names/coordinates/patterns or labels.
- Hue-wheel tasks have numeric angle alternatives.
- Layout diagrams expose rectangle tables and alignment relationships to screen readers.
- Typography diagrams expose metric names and values.
- Learners with color-vision differences can complete every color family via coordinates and semantic labels; visual previews remain supplemental.
- Color-vision simulation families explicitly support numeric/matrix routes.
- Reduced motion disables animated reflow or sliding guides.
- Focus indicators remain visible across every rendered swatch/theme.

### Localization

Localized:

- prose, Learn text, feedback, role names, and rubric labels;
- decimal separators and unit phrasing;
- synthetic word-copy content and text-direction-specific scenes where supported;
- large-scale-text and typography teaching notes by locale profile.

Invariant:

- color coordinates and formulas;
- standard/profile IDs;
- CSS token syntax;
- semantic rectangle geometry;
- contrast thresholds under the selected standard profile.

Do not mirror physical `left/right` geometry automatically in an RTL locale. Prefer logical `inline-start/end` in localized layout families or explicitly state physical axes. Font metrics and line-breaking datasets are locale-specific.

## 16. Generator and implementation architecture

Recommended modules:

```text
seededRng
colorParser
colorConversion
colorMixer
alphaCompositor
gamutChecker
contrastOracle
paletteRuleEngine
visionSimulation
tokenResolver
fontMetricStore
typographySolver
textLineBreaker
rectangleGeometry
gridSolver
constraintSolver
rubricEvaluator
semanticSceneBuilder
svgRenderer
answerChecker
adaptiveScheduler
localeCatalog
```

### Deterministic question record

```text
VisualDesignQuestion {
  familyId
  seed
  generatorVersion
  technicalProfileId
  paletteRuleId?
  fontMetricSetId?
  layoutRuleId?
  localeProfileId
  semanticScene
  constraints
  rubric?
  expectedAnswers
  workedDerivation
}
```

The same record must recreate the same semantic answer and SVG geometry. Browser font rasterization and color-management differences may change appearance slightly but never answer meaning.

### Generation strategy

- Construct backward from valid solutions for multi-constraint assignments.
- Derive distractors from explicit misconception transforms.
- Independently recompute every numeric answer.
- Store source colors and transformed visible colors separately.
- Store both unrounded and displayed values.
- Separate scene generation, solving, and rendering.
- Keep all required conversion data offline; no backend, font CDN, image service, or network lookup.
- A tested bundled color-conversion implementation is preferable to scattered hand-coded formulas.

## 17. Automated validation

### Color and contrast tests

- Exhaustive round-trip all 16.7 million 8-bit sRGB colors through hex parse/format is optional but feasible offline; minimum tests exhaust all channel byte values and random combinations.
- Test shorthand expansion for every nibble.
- Compare sRGB transfer functions around both breakpoints.
- Verify black luminance 0, white luminance 1, and contrast 21.
- Cross-check representative contrast pairs with an independent WCAG implementation.
- Test ratios just below, equal to, and just above 3, 4.5, and 7 without display rounding.
- Verify source-over endpoints at alpha 0 and 1 and noncommutative layer fixtures.
- Compare encoded and linear interpolation fixtures from independent code.
- Test hue normalization and every harmony rule across wrap boundaries.
- Verify out-of-gamut detection before mapping.

### Palette and token tests

- All generated role assignments satisfy declared predicates.
- Enumerate all assignments for small constraint problems and verify expected solution set.
- Resolve token aliases across themes/states; detect missing targets and cycles.
- Test simulation matrices and deltaEOK against pinned fixtures.
- Ensure simulation questions carry the non-diagnostic caveat.
- Ensure color-only-cue correct answers contain a semantic redundant cue.

### Typography tests

- Verify CSS unit equivalences and boundary conversions.
- Property-test `em`/`rem` trees against a second resolver.
- Check line-height, leading, baseline, x-height, and cap-height calculations.
- Sum advances/kerning/tracking independently.
- Ensure letter spacing count is `max(n-1,0)`.
- Run deterministic line-break fixtures including exact fit and unbreakable overflow.
- Ensure no exact family falls back to a runtime system font.

### Layout tests

- Verify rectangle derived coordinates and alignment predicates.
- Test equal gaps with unequal item sizes.
- Test `space-between` and one-item fallback.
- Property-test grid width/span/start equations.
- Enumerate fit/column counts at boundary widths.
- Test `clamp` below/inside/above range.
- Test aspect contain/cover and wrap algorithms.
- Verify all integrated expected answers satisfy every hard constraint.

### Renderer and policy tests

- Compare SVG element geometry/data attributes with semantic scene.
- Ensure no screenshot sampling enters answer derivation.
- Verify text alternatives contain no hidden answer before submission when that matters.
- Run keyboard-only and high-zoom flows.
- Apply color-independent correctness/error indicators.
- Scan question copy for unqualified subjective superlatives such as “best-looking,” “beautiful,” or “professional.”
- Ensure every exact aesthetic-adjacent family has a declared rule or rubric.

### Random-seed validation

For at least 10,000 seeds per family:

- substitute every placeholder;
- ensure finite in-range numeric answers;
- reject degenerate/no-effect instances;
- ensure choice questions have the intended complete answer set;
- ensure distractors are distinct after display rounding;
- ensure rendered differences remain perceivable or provide numeric labels;
- ensure no recent-history concentration dominates;
- ensure every audit has one root defect.

## 18. Coverage requirements

Minimum release coverage:

- every hex nibble and low/high channel range appears;
- both branches of sRGB decode appear in calculator/test coverage;
- encoded-sRGB, linear-light, alpha, ideal CMY, and named hue interpolation all appear;
- every harmony scheme appears across zero wrap and inverse/missing-member forms;
- palette ramps vary L and C separately;
- all WCAG thresholds appear below/equal/above boundary;
- normal/large text, non-text, varying background, alpha, and color-only cues all appear;
- palette roles cover canvas, surfaces, actions, text, borders, focus, and status;
- light/dark themes and at least two state sets appear;
- every typography unit and metric appears in direct and applied form;
- kerning, tracking, advance, baseline, line-height, measure, hierarchy, and spacing resilience appear;
- left/right/top/bottom/center/baseline alignment and equal gaps appear;
- box model, grid columns, spans, starts, margins/padding/gutters, and proximity appear;
- responsive fit, breakpoints, clamp, wrapping, aspect ratio, spacing scale, whitespace, and balance appear;
- integrated scenes cover component, button, card, form, and poster-like contexts;
- every misconception seeds distractors/audits over time.

Recent-history constraints prevent:

- overuse of red/green/blue primaries;
- all accessible examples being black on white;
- `599`-like fixed answers—here, repeated `21:1` and 60/30/10—dominating;
- one hue scheme or one font size dominating;
- every layout being symmetric/centered;
- all errors being 1px near-misses;
- every responsive problem using the same three widths;
- subjective audits dominating exact constructive practice.

## 19. Recommended views and v1 priorities

### Views

1. **Learn** — formulas, model distinctions, standards profile, and interactive labeled diagrams.
2. **Color Lab** — representations, mixing, harmony, palettes, and contrast.
3. **Type Lab** — anatomy, units, metrics, scales, and text blocks.
4. **Layout Lab** — alignment guides, box model, grids, and responsive constraints.
5. **Design Challenge** — bounded integrated scenes and repairs.
6. **Review** — misconception diagnosis, worked calculation, and near-transfer retry.
7. **Settings** — locale, calculator mode, color labels, reduced motion, coordinate precision, and accessibility preferences.

### Recommended v1

Ship first:

- hex/RGB, hue wrap, HSL component reading;
- linear versus encoded RGB, ideal CMY, and simple alpha;
- five harmony constructions and OkLCh L/C ramps;
- WCAG luminance, contrast, text/non-text thresholds, and color-only cues;
- semantic palette roles and light/dark token mapping;
- px/pt/em/rem/ch, anatomy, line height, advances, kerning, and tracking;
- modular scales, hierarchy, and simple text reflow;
- box model, edge/center/baseline alignment, gaps, and equal grids;
- fit, column count, breakpoints, clamp, and wrapping;
- cards/buttons/forms with exact constraints;
- SVG and table alternatives, localization, and deterministic validation.

Defer:

- wide-gamut authoring beyond detection and supplied-coordinate exercises;
- complex gamut mapping, ΔE2000, spectral or print workflows;
- advanced color appearance models and HDR;
- arbitrary font upload/parsing and complex-script exact shaping;
- full CSS layout emulation;
- uploaded-design critique or screenshot accessibility auditing;
- real brand/design-system import;
- aesthetic recommendation engines.

## 20. Topic-level quality checklist

Before release, confirm:

- [ ] Every question identifies an exact model, standards profile, declared rubric, or non-graded subjective response.
- [ ] sRGB encoded values and linear-light intensities are never conflated.
- [ ] Alpha compositing, color interpolation, additive light, and ideal CMY remain separate operations.
- [ ] Harmony schemes are presented as constructions, not guarantees of beauty, emotion, culture, or accessibility.
- [ ] WCAG relative luminance uses the `0.04045` breakpoint and unrounded threshold comparison.
- [ ] Normal text, large-scale text, non-text, exceptions, and color-only cues remain distinct.
- [ ] Varying backgrounds use the minimum relevant contrast, not an average.
- [ ] Color-vision simulation carries a version and non-diagnostic caveat.
- [ ] The app itself never relies on color alone.
- [ ] Exact typography questions use pinned synthetic metrics, not system-font pixels.
- [ ] Font size, cap height, x-height, advance, ink box, kerning, and tracking remain distinct.
- [ ] Layout answers derive from semantic rectangles and baselines, not screenshots.
- [ ] Grid calculations subtract gutters before dividing and include internal gutters in spans.
- [ ] Responsive questions evaluate finite declared widths and explicit fallback rules.
- [ ] Every multi-solution problem accepts the full satisfying set or supplies a tie-breaker.
- [ ] Subjective taste is never hidden in distractors or a hard-coded answer.
- [ ] Every family supports meaningful variation, known misconceptions, three examples, and deterministic validation.
- [ ] Automated tests cover formulas, boundaries, assignments, rendering, accessibility, localization, and large seed samples.
