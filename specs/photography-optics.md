# Photography and Optics — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, synthetic-scene/image renderer, optics oracle, numeric checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Photography and Optics

### Topic goal

Develop fast, technically sound photographic reasoning: predict how settings alter captured light and rendered brightness, choose settings under explicit constraints, understand how lenses form and frame images, and diagnose claims about focus, motion, noise, flash, histograms, and sensor resolution.

Repeated practice should make the learner able to:

- calculate exposure changes in stops and construct equivalent setting combinations;
- distinguish physical exposure from ISO-dependent image brightness;
- read a synthetic meter and histogram without treating either as a verdict about artistic intent;
- reason about aperture, entrance pupil, depth of field, diffraction, and focus placement;
- relate shutter time to subject motion, camera motion, panning, stabilization, and rolling-shutter timing;
- calculate angle of view, framing, crop factor, projection size, and perspective consequences;
- apply bounded thin-lens, magnification, diopter, transmission, and macro models;
- balance ambient and flash exposure under an explicitly supplied synchronization model;
- calculate and audit bounded color-temperature, white-balance, and channel transformations;
- reason about pixels, print resolution, bit depth, photon noise, read noise, and dynamic range;
- choose or audit a capture plan while stating which conclusions the supplied model cannot support.

The app should build the habit:

> Decide what must remain constant, identify which setting affects physical light, focus, motion, or output brightness, count the change in stops, then check the image and model limits.

### Relationship to neighboring Practice Lab topics

- **Physics** owns general waves, refraction, and thin-lens mechanics outside photographic application.
- **Geometry and Trigonometry** owns general similar-triangle and angle calculations.
- **Data Literacy and Chart Reading** owns general histogram and graph literacy.
- **Music Practice** provides useful precedent for an offline sensory app, but Photography and Optics uses synthetic images rather than audio.

Photography and Optics owns the integration of camera settings, image formation, framing, focus, motion, illumination, and digital-capture tradeoffs.

### Audience and prerequisites

Early categories assume:

- multiplication, division, fractions, ratios, squares, and powers of two;
- simple logarithms when a calculator is explicitly permitted;
- basic length and time units;
- the idea that a digital image contains pixels.

Later categories locally introduce:

- base-2 logarithms and stop differences;
- basic trigonometry for angle of view;
- the thin-lens equation;
- interval coverage and simple signal-to-noise ratios.

No camera ownership, darkroom knowledge, programming, or prior physics course is required.

### Scope

The initial model ID is `photography-optics-v1`. It includes:

- full-, half-, and third-stop reasoning for aperture, shutter time, ISO setting, filters, and flash power;
- physical exposure, metered/output-brightness equivalence, exposure compensation, `EV100`, and bracketing;
- reflected/incident metering under declared synthetic models, raw-linear histograms, channel clipping, headroom, and scene dynamic range;
- f-number, entrance pupil, focus distance, circle of confusion, hyperfocal distance, near/far depth-of-field limits, defocus blur, and focus stacking;
- shutter-time motion blur, angular camera blur, pixel blur, panning, supplied stabilization ratings, and rolling-shutter scan time;
- focal length, rectilinear angle of view, framing at distance, crop factor, sensor aspect ratio, panorama overlap, and viewpoint-dependent perspective;
- photographic thin-lens image distance, magnification, extension, optical power, thin lenses in contact, T-stops, macro effective f-number, distortion, aberration evidence, and vignetting;
- idealized inverse-square illumination, direct-flash guide number, flash power, ambient/flash separation, synchronization, neutral-density filters, and ideal polarizers;
- correlated color temperature, reciprocal-megakelvin shifts, linear RGB balance gains, neutral-target checks, channel filters, and mixed-illuminant limits;
- pixel count, pitch, crop resolution, print PPI, code levels, uncompressed data size, shot noise, read noise, and idealized dynamic range;
- integrated setting selection, comparison, diagnosis, and multi-frame planning using synthetic equipment and scenes.

The intended ceiling is advanced enthusiast and introductory photographic-science fluency, not optical engineering.

### Exclusions

Do not include:

- brand-specific menus, proprietary metering/ISO behavior, current camera specifications, buying advice, or firmware instructions;
- real-world event, wildlife, street, surveillance, drone, traffic, aviation, medical, forensic, or security photography guidance;
- instructions to photograph the sun, lasers, eclipses, welding arcs, intense lamps, people without consent, dangerous locations, or any hazardous subject;
- artistic-quality grading, universal composition rules, aesthetic rankings, or free-form critique requiring subjective judgment;
- legal conclusions about copyright, privacy, releases, public access, or permitted photography;
- film development chemistry, reciprocity failure, sensitometry curves, enlarger operation, or chemical darkroom safety in v1;
- detailed radiometry, photometry calibration, spectral power distributions, color-management profiles, gamut mapping, demosaicing algorithms, computational photography, deconvolution, or machine-learning enhancement;
- lens-design optimization, thick-lens principal-plane derivation, modulation-transfer functions, interferometry, or wave optics beyond a bounded Airy-disk model and ideal polarization;
- fisheye projections, tilt/shift movements, Scheimpflug calculations, anamorphic optics, telescope/microscope design, or multi-element ray tracing;
- video frame-rate/shutter-angle practice, audio synchronization, codecs, or cinematography workflows;
- claims that a heuristic shutter speed, stabilization rating, histogram, focus criterion, or computed setting guarantees a successful or safe real photograph.

### Educational and safety boundary

All cameras, lenses, flashes, scenes, people, and places are fictional. Exercises are calculations and simulated capture decisions, not operating instructions for a real assignment.

- No prompt asks the learner to aim a camera or optical device at a hazardous source.
- Flash questions use abstract targets or still-life scenes and do not recommend firing a flash toward a person or animal.
- Stabilization and exposure rules are explicitly modeled performance estimates, never guarantees.
- A histogram establishes code-value distribution and clipping under the supplied pipeline; it does not establish artistic correctness.
- Synthetic image defects are described without diagnosing a real person's equipment or ability.

### Normative exposure model

#### Physical exposure and stops

For the same scene and framing, the core ideal model treats sensor radiant exposure `H` as proportional to:

```text
H ∝ t × τ / N²
```

where:

- `t` is shutter exposure time;
- `N` is f-number;
- `τ` is total optical transmittance, including declared filters.

The physical-exposure change from setup 1 to setup 2 is:

```text
ΔH_stops = log₂(H₂/H₁)
          = log₂(t₂/t₁) - 2log₂(N₂/N₁) + log₂(τ₂/τ₁)
```

Positive `ΔH_stops` means more light reaches the sensor. One stop is exactly a factor of two in the modeled quantity.

ISO is **not** part of `H`. Under the app's simplified linear brightness-index model:

```text
ΔB_stops = ΔH_stops + log₂(ISO₂/ISO₁)
```

`ΔB_stops` predicts a relative metered/raw-code brightness before clipping for a declared ideal pipeline. It does not imply that ISO creates photons or that two equal-brightness settings have equal noise, highlight headroom, or dynamic range.

#### Filter loss

A filter with transmittance `q`, where `0<q≤1`, has loss:

```text
filter_stops = -log₂(q)
```

If optical density `OD` is supplied:

```text
q = 10^(-OD)
filter_stops = OD / log₁₀(2)
```

Marketing names such as `ND8`, `ND64`, or “0.9 ND” are parsed only through a displayed convention; the app never assumes that all manufacturers use a label identically.

#### Exposure value

At ISO 100:

```text
EV100 = log₂(N²/t)
```

where `t` is in seconds. Higher `EV100` describes a setting that admits less physical light. EV questions distinguish a camera-setting EV from scene luminance or a proprietary meter reading.

### Nominal camera-setting sequences

Dial-step questions use versioned nominal tables rather than treating rounded printed labels as exact powers of two.

Core full-stop aperture sequence:

```text
f/1, f/1.4, f/2, f/2.8, f/4, f/5.6,
f/8, f/11, f/16, f/22, f/32, f/45, f/64
```

Core full-stop shutter sequence:

```text
1 s, 1/2, 1/4, 1/8, 1/15, 1/30, 1/60,
1/125, 1/250, 1/500, 1/1000, 1/2000, 1/4000, 1/8000 s
```

Core ISO sequence:

```text
ISO 50, 100, 200, 400, 800, 1600, 3200, 6400, 12800
```

- Adjacent entries are treated as one nominal stop for dial-navigation exercises.
- Analytical formula questions use the displayed numeric value exactly unless the prompt says “nominal dial stops.”
- Half-/third-stop tables are bundled and displayed with the question; manufacturer-specific rounding is excluded.
- Aperture labels always include `f/`; shutter fractions always carry or inherit seconds.

### Normative lens and focus model

Unless another model is explicitly shown:

- focal length `f`, object/focus distance `s` or `d_o`, image distance `d_i`, aperture diameter, and circle of confusion use consistent units;
- object distance is measured from the ideal thin lens/principal plane, not from the front element;
- a photographic converging lens has `f>0`, a real object has `d_o>f`, and the sensor image has `d_i>0`;
- the sensor image is inverted; interface diagrams may display it upright for convenience only when labeled;
- rectilinear angle of view along sensor dimension `d` is:

  ```text
  θ = 2atan(d/(2f))
  ```

- thin-lens focus and magnification are:

  ```text
  1/f = 1/d_o + 1/d_i
  m = -d_i/d_o
  ```

- f-number uses entrance-pupil diameter `D`:

  ```text
  N = f/D
  ```

The entrance pupil is the aperture stop as seen through the front of the lens; it need not equal the physical iris diameter.

#### Depth of field

The app always supplies the adopted sensor-plane circle of confusion `c`. It is a chosen acceptability criterion, not a physical line between “sharp” and “unsharp.”

For focus distance `s`:

```text
H  = f²/(N c) + f
Dn = (H-f)s / (H+s-2f)
Df = (H-f)s / (H-s)       when s < H
Df = infinity             when s ≥ H
```

All variables use the same length unit. Depth of field is the interval `[Dn,Df]` under this model and is generally not symmetric around `s`.

For a thin lens focused at `s`, let `v_s=f s/(s-f)`. For another object distance `u`, let `v_u=f u/(u-f)`. The ideal geometric defocus-circle diameter at the sensor plane is:

```text
b = D × |v_s-v_u| / v_u
```

Use this only for bounded paraxial synthetic questions.

#### Diffraction

For wavelength `λ` and f-number `N`, the diameter to the first dark Airy ring in the ideal circular-aperture model is:

```text
d_Airy = 2.44 λ N
```

The app does not equate one Airy diameter with a universal perceptual-resolution limit. Pixel or output comparisons state their criterion explicitly.

### Normative motion model

- Constant transverse subject motion during one exposure is linear.
- If image magnification magnitude is `|m|`, sensor-plane blur from transverse subject speed `v` is `b=|m|vt`.
- For small angular motion `ω` in radians per second, sensor-plane blur is `b≈fωt`.
- Pixel blur is sensor-plane blur divided by pixel pitch.
- A panning question uses relative angular speed between camera and subject.
- A supplied stabilization rating of `S` stops permits a modeled shutter time up to `2^S` times the supplied unstabilized baseline. It affects modeled camera motion only, not subject motion.
- Rolling-shutter questions use a declared scan direction and scan time. If image motion is constant at `q` pixels/s, displacement between first and last scanned rows is `qT_scan`.

### Normative flash and illumination model

Ideal point-source illumination in the far-enough geometric regime follows:

```text
E ∝ power / distance²
```

Direct bare-flash guide-number questions use:

```text
GN = N × distance              at ISO 100
GN_ISO = GN_100 × √(ISO/100)
```

Distance units must match the guide-number unit. Guide number is an ideal exposure-rating model, not a physical claim that ISO changes emitted light.

Below or at the declared synchronization limit, an ideal instantaneous flash is unaffected by shutter time while modeled ambient exposure is proportional to shutter time. Aperture and ISO-brightness index affect both; flash power and flash-to-subject distance affect flash only. Bounce, zoom, diffusers, high-speed sync, and ambient variation appear only through supplied loss/output models.

### Normative digital-capture model

- Pixel dimensions are exact integer sample counts. Megapixels are `width×height/1,000,000`.
- Pixel pitch along one dimension is physical sensor length divided by pixel count.
- Print PPI is pixels along the printed dimension divided by inches along that dimension.
- An `n`-bit code has `2^n` possible integer code values, but bit depth alone does not establish dynamic range, color accuracy, or visible gradation.
- Pure photon shot noise has standard deviation `√P` for expected signal `P` photoelectrons, so shot-noise-limited SNR is `√P`.
- With independent RMS read noise `R`, the simplified SNR is:

  ```text
  SNR = P / √(P + R²)
  ```

- An idealized usable dynamic range is:

  ```text
  DR_stops = log₂(full_well / noise_floor)
  ```

Every sensor/noise question supplies the model parameters. Real sensors may have ISO-dependent read noise, dual conversion gain, color filters, clipping, quantization, and processing that the simplified family does not infer.

### Synthetic images, diagrams, and histograms

Canonical answers come from a semantic scene and capture pipeline, never by reverse-measuring antialiased pixels.

- Synthetic raw-linear code values are proportional to modeled exposure until a displayed clipping value.
- A one-stop physical increase doubles unclipped raw-linear values.
- Histograms store exact bin counts and channel identity.
- A histogram does not retain spatial arrangement; two different scenes may share it.
- Tone curves, gamma, white balance, local contrast, JPEG rendering, and highlight reconstruction are absent unless explicitly modeled.
- Lens, sensor, ray, blur, and framing diagrams expose their exact coordinates and accessible text.
- Visual differences used for quantitative questions exceed rendering and display tolerances.

### Global answer conventions

- Surrounding whitespace is ignored.
- Locale controls decimal comma/point in ordinary numeric fields; shutter fractions always use `/`.
- Shutter input accepts a fraction (`1/125 s`) or an equivalent decimal within tolerance.
- Aperture input accepts `f/5.6`, `5.6`, or the localized equivalent when the field is labeled `f/`.
- ISO accepts `400`, `ISO 400`, or `ISO400`.
- Stop answers accept signed decimals or exact simple fractions such as `1/3`; the sign convention is displayed.
- `∞`, `infinity`, and the localized word are accepted for an infinite far depth-of-field limit.
- Compatible length/time units are accepted unless conversion is the target skill.
- Angles default to degrees; trigonometric calculations internally use radians.
- Multiple values use named fields or structured choices, never an ambiguous comma-only string.
- Candidate-setting questions accept every setting tuple that satisfies all declared constraints and the stated optimization/tie rule.
- Nominal-dial questions are checked by table index. Analytical questions are checked by the numeric formula.

Unless overridden, numeric tolerance is the larger of half the final displayed unit and `0.2%` of the nonzero answer. Exact setting labels, stop counts on a nominal table, pixel counts, code levels, family classifications, and feasibility claims require exact semantic agreement.

### Difficulty philosophy

Difficulty should rise through:

- distinguishing physical exposure from ISO-dependent brightness;
- reversing a familiar stop relationship;
- coordinating two or three controls with different side effects;
- choosing the correct invariant: light, rendered brightness, depth of field, motion blur, framing, or perspective;
- transferring between settings, formulas, diagrams, histograms, and synthetic images;
- reasoning with intervals, clipping, uncertainty, ties, and infeasible constraints;
- diagnosing a plausible explanation rather than merely calculating a nearby number.

Difficulty must not rise through obscure camera trivia, proprietary behavior, gratuitous logarithm arithmetic, unreadable synthetic images, unmarked approximations, huge candidate lists, or subjective “best photo” judgments.

### Family specification contract

Every family below defines:

- **Task:** exact learner skill and preferred prompt form;
- **Response/template:** semantic answer and interaction mode;
- **Derivation:** canonical solver;
- **Difficulty:** meaningful progression;
- **Misconceptions/constraints:** distractor sources, acceptance, and rejection rules;
- **Feedback:** diagnostic and worked-solution behavior;
- **Examples:** three complete fixtures from straightforward to advanced;
- **Validation/coverage:** independent checks and distribution obligations.

Shared rejection rules:

- reject hidden or undeclared model assumptions;
- reject rounded displays that change the correct stop index or ordering;
- reject accidental ties unless set-valued answers are intended;
- reject settings outside the displayed camera/lens capability table;
- reject a synthetic image whose visual cue disagrees with semantic data;
- reject cases dominated by arithmetic rather than photographic reasoning;
- reject language implying ISO creates light, blur guarantees safety, or a setting is universally “correct.”

## 2. Category: Exposure Stops and Camera Settings

### Category purpose

Build a precise stop-based model of shutter time, aperture, ISO-dependent brightness, filters, compensation, and equivalent setting combinations.

### Learn

One stop is a factor of two. Doubling shutter time adds one stop of sensor light. Moving aperture by one nominal full-stop step changes light by one stop because exposure varies as `1/N²`. Doubling ISO raises the simplified output-brightness index by one stop but does not increase the photons captured. State whether “equivalent” means equal physical exposure or equal modeled brightness.

### Prerequisites

Ratios, squares, powers of two, and signed differences.

### Category boundaries

This category calculates setting changes. Meter placement and histograms belong to Category 3; visible motion and focus consequences belong to Categories 4 and 5.

### Subcategories

1. Stop factors
2. Individual controls
3. Equivalent combinations
4. EV, compensation, filters, and brackets

### Common misconceptions

- Treating one stop as an additive fixed amount.
- Reversing the aperture direction.
- Assuming a doubled f-number is one stop rather than two.
- Saying ISO 800 captures three stops more light than ISO 100 at unchanged aperture/shutter.
- Mixing nominal dial indexing with exact ratios of rounded labels.
- Applying exposure compensation with the wrong sign.
- Treating equal brightness as equal signal/noise.

### Family `light_ratio_to_stops`

**Task.** Convert a physical-light or brightness ratio to a signed stop change.

**Response/template.** Numeric stops: `{quantity} changes from {old} to {new}. What is the change in stops?`

**Derivation.** `Δ=log₂(new/old)`.

**Difficulty.** L1 powers of two; L2 reductions; L3 non-power ratios; L4 compare chained changes.

**Misconceptions/constraints.** Quantity and sign are explicit. Distractors use raw ratio, reversed ratio, or natural log.

**Feedback.** Show ratio first, then base-2 logarithm.

**Examples.**

1. Light doubles → `+1 stop`; `log₂2=1`. L1.
2. Light falls to one quarter → `−2 stops`; `log₂(1/4)=−2`. L2.
3. Signal rises from 200 to 300 → `+0.585 stops` approximately. L3.

**Validation/coverage.** Round-trip through `2^Δ`; balance increases/decreases and integer/fractional stops.

### Family `stops_to_light_ratio`

**Task.** Convert a signed stop change to a multiplicative factor.

**Response/template.** Ratio/factor: `A change of {stops} stops multiplies {quantity} by what factor?`

**Derivation.** `factor=2^stops`.

**Difficulty.** L1 positive integers; L2 negative; L3 half/third stops; L4 inverse missing starting value.

**Misconceptions/constraints.** Accept exact powers/rationals and decimals. Reject fractional-stop displays that round alternatives together.

**Feedback.** Expand integer stops or evaluate `2^s`.

**Examples.**

1. `+3 stops` → `8×`. L1.
2. `−2 stops` → `1/4×`. L2.
3. `+1/3 stop` → `2^(1/3)≈1.260×`. L3.

**Validation/coverage.** Inverse-check with logarithm and cover signed thirds/halves.

### Family `shutter_stop_change`

**Task.** Count or construct a shutter-time change in nominal or analytical stops.

**Response/template.** Signed stops or shutter setting: `At fixed aperture and ISO, change {oldTime} to {newTime}. How many physical-exposure stops?`

**Derivation.** Nominal mode subtracts shutter-table indices; analytical mode uses `log₂(t₂/t₁)`.

**Difficulty.** L1 adjacent; L2 several steps; L3 solve target time; L4 distinguish nominal versus exact.

**Misconceptions/constraints.** Longer time means more light. Prompt always names mode.

**Feedback.** Walk the dial sequence or show the time ratio.

**Examples.**

1. `1/125 s → 1/60 s` → `+1 nominal stop`. L1.
2. `1/250 s → 1/1000 s` → `−2 nominal stops`. L2.
3. Exact `0.010 s → 0.015 s` → `+0.585 stops`, not a nominal step count. L3.

**Validation/coverage.** Table-index and exact-ratio oracles agree on exact powers; both directions represented.

### Family `aperture_stop_change`

**Task.** Count or construct an aperture change and its physical-light effect.

**Response/template.** Signed stops or f-number: `At fixed shutter time, change {oldAperture} to {newAperture}. What is the physical-exposure change?`

**Derivation.** Analytical `Δ=-2log₂(N₂/N₁)`; nominal mode uses aperture-table indices with sign reversed.

**Difficulty.** L1 adjacent full stops; L2 several; L3 solve f-number; L4 analytical non-table values.

**Misconceptions/constraints.** Larger f-number means less light; doubling f-number is `−2` stops.

**Feedback.** Compare squared aperture ratios and name opening/closing direction.

**Examples.**

1. `f/4 → f/5.6` → `−1 nominal stop`. L1.
2. `f/4 → f/8` → `−2 stops`. L2.
3. Analytical `f/3 → f/6` → `−2 stops`; the f-number doubled. L3.

**Validation/coverage.** Square-law and nominal-index checks; balance wider/narrower changes.

### Family `iso_brightness_stop_change`

**Task.** Calculate the simplified ISO-dependent brightness-index change and state its physical-light consequence.

**Response/template.** Two named fields: brightness stops and physical-exposure stops.

**Derivation.** `ΔB_ISO=log₂(ISO₂/ISO₁)`; with aperture/shutter unchanged, `ΔH=0`.

**Difficulty.** L1 doubling; L2 several stops; L3 fractional ISO; L4 contrast equal-brightness captures.

**Misconceptions/constraints.** The physical-light field is required often enough to expose “ISO creates light.”

**Feedback.** Separate photon capture from gain/brightness.

**Examples.**

1. ISO 100 → 200, same aperture/shutter → brightness `+1`, physical light `0` stops. L1.
2. ISO 800 → 100 → brightness `−3`, physical light `0` stops. L2.
3. ISO 100 → 160 → brightness `+0.678 stops`, under the ideal model. L3.

**Validation/coverage.** ISO ratio oracle; at least half of prompts request both quantities.

### Family `two_control_equivalent_exposure`

**Task.** Change aperture or shutter and compensate with the other to preserve physical exposure.

**Response/template.** Missing setting: `{oldTuple}. If {changedControl} becomes {newValue}, choose {missingControl} for equal physical exposure.`

**Derivation.** Set `ΔH=0` or offset nominal stop indices.

**Difficulty.** L1 one stop; L2 several; L3 fractional steps; L4 choose all valid table pairs.

**Misconceptions/constraints.** ISO is fixed and irrelevant to the equality. Settings remain in displayed limits.

**Feedback.** State the lost/gained aperture stops, then offset them with shutter.

**Examples.**

1. `f/4, 1/250 s → f/5.6, ?` → `1/125 s`. L1.
2. `f/8, 1/30 s → f/4, ?` → `1/125 s`. L2.
3. Closing by `2/3 stop` requires lengthening shutter by `2/3 stop`. L3.

**Validation/coverage.** Recompute `t/N²`; cover both compensation directions and boundaries.

### Family `three_control_equivalent_brightness`

**Task.** Preserve the simplified brightness index while changing aperture, shutter, and/or ISO.

**Response/template.** Missing setting or valid tuple selection.

**Derivation.** Require `ΔB=ΔH+log₂(ISO₂/ISO₁)=0`.

**Difficulty.** L1 ISO versus one exposure control; L2 all three; L3 multiple valid tuples; L4 compare captured-light differences.

**Misconceptions/constraints.** Call the result equal modeled brightness, not equal exposure. Advanced responses include `ΔH`.

**Feedback.** Use a stop ledger with separate `H` and ISO columns.

**Examples.**

1. `f/4, 1/125 s, ISO 100 → same f/4 and shutter 1/250 s` → `ISO 200`. L1.
2. Close aperture one stop and lengthen shutter two stops → lower ISO one stop for equal brightness. L2.
3. Two equal-brightness tuples differ by `2 stops` of physical exposure; the higher-`H` tuple captured four times the modeled photons. L4.

**Validation/coverage.** Independent `ΔH` and `ΔB` ledgers; include equal-brightness/non-equal-light cases regularly.

### Family `exposure_compensation`

**Task.** Apply a signed exposure-compensation request under a declared automatic-control mode.

**Response/template.** New setting or compensation value: `The meter proposes {baseTuple}. In {mode}, apply {EC}. What setting changes?`

**Derivation.** Target `ΔB=EC`; alter only the mode-declared automatic control by the required nominal steps.

**Difficulty.** L1 ±1 shutter; L2 aperture/ISO auto; L3 limits force secondary control; L4 infer EC from result.

**Misconceptions/constraints.** Mode behavior and limits are shown. Do not assume EC behavior in fully manual exposure.

**Feedback.** Translate EC sign to target brightness, then move the permitted control.

**Examples.**

1. Aperture priority proposes `1/250 s`; `+1 EC` → `1/125 s`. L1.
2. Shutter priority proposes `f/8`; `−2 EC` → `f/16`. L2.
3. Auto ISO 100 has a displayed minimum of ISO 100; requesting `−1 EC` must change another declared auto control or be infeasible. L3.

**Validation/coverage.** Simulate declared mode state machine and control limits.

### Family `ev100_compute`

**Task.** Compute `EV100` from aperture and shutter time.

**Response/template.** Numeric EV: `What is EV100 for {aperture} at {time}?`

**Derivation.** `EV100=log₂(N²/t)`.

**Difficulty.** L1 exact powers; L2 nominal familiar pairs; L3 decimal; L4 compare two settings.

**Misconceptions/constraints.** ISO is fixed at 100 and not substituted into the formula.

**Feedback.** Square `N`, divide by seconds, then take `log₂`.

**Examples.**

1. `f/1 at 1 s` → `EV100 0`. L1.
2. `f/4 at 1/16 s` → `EV100 8`. L2.
3. `f/8 at 1/125 s` → `EV100≈12.97`, conventionally about 13. L3.

**Validation/coverage.** Forward formula plus exposure-ratio difference check.

### Family `ev100_missing_setting`

**Task.** Solve aperture or shutter time from `EV100` and the other setting.

**Response/template.** Numeric/dial setting: `At EV100 {ev}, with {knownSetting}, find {unknown}.`

**Derivation.** `t=N²/2^EV` or `N=√(t×2^EV)`.

**Difficulty.** L1 exact; L2 nearest nominal dial setting; L3 non-table analytical; L4 feasible-range check.

**Misconceptions/constraints.** Prompt says exact or nearest declared dial value; reject ambiguous equal-nearest cases.

**Feedback.** Rearrange before substitution and show any nominal rounding.

**Examples.**

1. `EV100 8, f/4` → `t=1/16 s`. L1.
2. `EV100 13, f/8` → exact `1/128 s`, nearest full-stop label `1/125 s`. L2.
3. `EV100 10, t=1/64 s` → `f/4`. L2.

**Validation/coverage.** Substitute result back into EV formula; test limit rejection.

### Family `filter_transmission_stops`

**Task.** Convert filter transmittance, factor, or optical density to stop loss.

**Response/template.** Numeric stops/transmittance: `A filter transmits {q}. How many stops of light does it remove?`

**Derivation.** Use `-log₂(q)`; for density use `OD/log₁₀2`.

**Difficulty.** L1 power-of-two transmission; L2 percent/factor; L3 OD; L4 combine filters.

**Misconceptions/constraints.** Multiplicative transmissions combine before conversion; stop losses add.

**Feedback.** Show transmitted fraction and factor-of-two count.

**Examples.**

1. 50% transmission → `1 stop`. L1.
2. 12.5% transmission → `3 stops`. L2.
3. `OD 0.9` → `2.99≈3 stops`. L3.

**Validation/coverage.** Round-trip transmittance and verify stacked-filter multiplication.

### Family `exposure_bracket_sequence`

**Task.** Construct or interpret an ordered exposure bracket around a base setting.

**Response/template.** Ordered settings: `Using only {control}, make bracket offsets {offsets} around {baseTuple}.`

**Derivation.** Move the declared control by each signed nominal offset; retain order specified.

**Difficulty.** L1 symmetric ±1; L2 wider/unequal; L3 fractional; L4 detect clipped control range.

**Misconceptions/constraints.** Positive offset means more modeled exposure/brightness under the named bracket type. ISO bracketing is labeled brightness bracketing, not physical-exposure bracketing.

**Feedback.** Display offset, dial movement, and resulting tuple in a table.

**Examples.**

1. Base `1/125 s`, shutter offsets `−1,0,+1` → `1/250, 1/125, 1/60 s`. L1.
2. Base `f/8`, aperture offsets `−2,0,+2` → `f/16, f/8, f/4`. L2.
3. A `+3` shutter bracket from `1/2 s` is infeasible if the declared maximum is `1 s`; report limit failure. L3.

**Validation/coverage.** Check table indices, ordering, limits, and exact requested offsets.

### Cross-family progression

Ratio-to-stop and stop-to-ratio practice comes first. Shutter, aperture, and ISO are then taught separately so their different physical meanings remain visible. Equal-physical-exposure questions precede equal-brightness three-control questions. Compensation, EV, filters, and brackets integrate the ledger only after control signs are reliable.

## 3. Category: Metering, Histograms, and Tonal Evidence

### Category purpose

Train careful interpretation of measured scene brightness and captured code distributions without treating a meter or histogram as an aesthetic authority.

### Learn

A reflected-light meter responds to light arriving from the metered scene region; a bright or dark subject can therefore shift its recommendation. Exposure compensation tells the declared automatic model where to place a metered tone. A raw-linear histogram counts code values, not where they occur in the image. Clipping, channel clipping, and headroom are objective under the supplied pipeline, while “too bright” or “too dark” is not.

### Prerequisites

Stops, ratios, exposure compensation, weighted means, and powers of two.

### Category boundaries

Use only synthetic linear meters and raw histograms. Proprietary evaluative metering, JPEG tone curves, color grading, and subjective tonal intent are excluded.

### Subcategories

1. Luminance and metering
2. Tone placement
3. Histogram transformation and clipping
4. Dynamic range and evidential claims

### Common misconceptions

- Treating a reflected meter as direct knowledge of subject reflectance or artistic intent.
- Assuming every meter target is universally 18% reflectance.
- Believing a centered histogram is always desirable.
- Reading spatial location from a histogram.
- Checking only a combined/luminance histogram when one color channel clips.
- Confusing highlight headroom with total scene dynamic range.
- Assuming “no clipping” proves correct exposure.

### Normative synthetic meter

Meter questions store region luminances `L_i`, normalized non-negative weights `w_i`, and a displayed calibration target `G`.

```text
L_meter = Σ(w_i L_i)
recommended exposure scale k = G/L_meter
recommended stop change = log₂(k)
```

This is a pedagogical weighted-linear meter, not a claim about a real camera's proprietary metering algorithm.

### Family `luminance_ratio_stops`

**Task.** Express the relative brightness of two synthetic scene regions in stops.

**Response/template.** Signed stop difference: `Region A has luminance {LA}; region B has {LB}. How many stops is B relative to A?`

**Derivation.** `Δ=log₂(LB/LA)`.

**Difficulty.** L1 powers of two; L2 darker region; L3 non-power ratio; L4 chained region ordering.

**Misconceptions/constraints.** Luminances are positive and use the same scale; this is a ratio, not an exposure recommendation.

**Feedback.** Show luminance ratio and base-2 conversion.

**Examples.**

1. A=10, B=20 → B is `+1 stop`. L1.
2. A=80, B=10 → B is `−3 stops`. L2.
3. A=40, B=60 → B is `+0.585 stops` approximately. L3.

**Validation/coverage.** Ratio round-trip and balanced sign/order cases.

### Family `weighted_meter_reading`

**Task.** Compute a declared weighted meter reading or its recommended exposure adjustment.

**Response/template.** Numeric luminance/stops: `The meter weights {regions}. Find {requestedQuantity}.`

**Derivation.** Compute `Σw_iL_i`, then optionally `log₂(G/L_meter)`.

**Difficulty.** L1 equal weights; L2 unequal; L3 compare patterns; L4 solve missing region/weight.

**Misconceptions/constraints.** Weights sum to 1 and are displayed. Reject arithmetic-heavy instances with more than four regions.

**Feedback.** Show a contribution table for each region.

**Examples.**

1. Equal weights on luminances 2 and 6 → reading `4`. L1.
2. Weights 75%/25% on 4/12 → reading `6`. L2.
3. Reading 6 with target 3 → recommendation `−1 stop`; `log₂(3/6)`. L3.

**Validation/coverage.** Independent weighted sum, normalized weights, and exposure-scale check.

### Family `spot_meter_tone_placement`

**Task.** Place a spot-metered region at a declared tone offset from the meter target.

**Response/template.** Compensation/stops: `Spot meter places {region} at 0. You want it at {targetOffset}. What compensation is required?`

**Derivation.** Under the declared ideal model, set compensation equal to the desired offset from meter placement.

**Difficulty.** L1 ±1; L2 several stops; L3 combine with headroom limit; L4 infer intended placement.

**Misconceptions/constraints.** The target is displayed and not called universal middle gray. Reject targets that force clipping unless clipping is the lesson.

**Feedback.** Draw meter target at 0 and move the region by the signed offset.

**Examples.**

1. Place a metered bright card at `+2 stops` → use `+2 EC`. L1.
2. Place a metered dark card at `−2 stops` → use `−2 EC`. L1.
3. Desired `+3` placement with only `2` stops of highlight headroom → infeasible without clipping. L3.

**Validation/coverage.** Tone-offset arithmetic and clipping feasibility.

### Family `incident_reflected_compare`

**Task.** Compare what ideal incident and reflected meters respond to in a supplied illumination/reflectance scene.

**Response/template.** Reading ratio, stop difference, or method choice.

**Derivation.** Incident reading follows supplied illumination; reflected reading follows `illumination×reflectance` under the declared proportional model.

**Difficulty.** L1 same illumination/different reflectance; L2 different illumination; L3 choose meter for a stated invariant; L4 diagnose disagreement.

**Misconceptions/constraints.** All proportional constants cancel or are supplied. Do not present one method as universally superior.

**Feedback.** Separate incoming illumination from returned scene luminance.

**Examples.**

1. White and dark cards under identical illumination → incident readings equal; reflected readings differ. L1.
2. Reflectances 0.72 and 0.18 → white card reflects `4×`, or `2 stops`, more. L2.
3. Two locations have different illumination but identical card reflectance → both meter types may differ because the incoming light differs. L3.

**Validation/coverage.** Forward illumination-reflectance model and method-claim truth table.

### Family `raw_histogram_shift`

**Task.** Predict how an ideal raw-linear histogram moves after a declared exposure/brightness change.

**Response/template.** Transformed bins/table or matching histogram.

**Derivation.** Multiply each unclipped code by `2^stops`; quantize only by the displayed rule and clamp at the clipping code.

**Difficulty.** L1 +1 without clipping; L2 negative; L3 partial clipping; L4 compare physical and ISO-only shift.

**Misconceptions/constraints.** Counts are conserved except bins merge at clipping/quantization. No gamma unless shown.

**Feedback.** Transform representative bin codes and aggregate counts.

**Examples.**

1. Codes 16 and 32 at `+1 stop` → 32 and 64. L1.
2. Code 80 at `−2 stops` → 20. L2.
3. Codes 100 and 180 at `+1 stop`, clip 255 → 200 and 255; the latter clips. L3.

**Validation/coverage.** Transform semantic samples independently and compare exact bin counts.

### Family `histogram_clipping`

**Task.** Determine clipped sample count/fraction or the first exposure change that causes clipping.

**Response/template.** Count, percentage, yes/no, or stop threshold.

**Derivation.** Apply declared linear transform and count samples at/above clipping threshold.

**Difficulty.** L1 direct count; L2 after stop shift; L3 weighted/multiple bins; L4 solve maximum safe increment.

**Misconceptions/constraints.** A sample exactly at maximum is labeled clipped/saturated according to displayed rule. Spatial position remains unknown.

**Feedback.** Show threshold comparison per relevant bin.

**Examples.**

1. Values `[40,120,255,255]`, clip code 255 → `2 of 4` clipped. L1.
2. Values `[80,140]`, `+1 stop`, clip 255 → 140 becomes 280 and clips; `1 of 2`. L2.
3. Brightest value 100 with clip 400 → `2 stops` of exact headroom. L3.

**Validation/coverage.** Exact sample/bin enumeration and boundary fixtures.

### Family `rgb_channel_clipping`

**Task.** Identify channel-specific clipping and the strongest supported color claim.

**Response/template.** Channel set or controlled claim choice.

**Derivation.** Compare each channel's semantic maximum to its clipping code after declared gains/exposure.

**Difficulty.** L1 one channel; L2 several pixels; L3 white-balance gains; L4 combined histogram hides channel clipping.

**Misconceptions/constraints.** Do not infer recoverability or final color without a supplied pipeline.

**Feedback.** Display separate R/G/B maxima and thresholds.

**Examples.**

1. Maxima R=255, G=220, B=210 at clip 255 → red clips. L1.
2. Combined luminance is below maximum but blue reaches clip → blue-channel clipping still exists. L2.
3. Blue raw maximum 180 with a declared 1.5× display gain → displayed blue reaches 270 and clips at 255, though raw blue did not. L3.

**Validation/coverage.** Channel-wise transform oracle; cover raw versus rendered clipping.

### Family `highlight_headroom`

**Task.** Calculate remaining ideal raw-linear highlight headroom in stops.

**Response/template.** Numeric stops: `Brightest unclipped code is {C}; clipping is {Cmax}. Find headroom.`

**Derivation.** `headroom=log₂(Cmax/C)` for positive `C`.

**Difficulty.** L1 powers of two; L2 decimal; L3 limiting RGB channel; L4 new headroom after setting change.

**Misconceptions/constraints.** Code zero is excluded. Headroom is pipeline/model-specific.

**Feedback.** Show the factor until clipping, then convert to stops.

**Examples.**

1. Brightest 128, clip 256 → `1 stop`. L1.
2. Brightest 100, clip 400 → `2 stops`. L2.
3. Channel headrooms R=0.5, G=1.5, B=2 stops → overall no-channel-clipping headroom is `0.5 stop`. L3.

**Validation/coverage.** Multiply by `2^headroom` and verify limiting channel.

### Family `scene_dynamic_range_fit`

**Task.** Compute scene dynamic range and decide whether a supplied sensor range can contain it in one ideal exposure.

**Response/template.** Stops plus fit/overflow amount.

**Derivation.** `sceneDR=log₂(Lmax/Lmin)`; compare with declared usable sensor range.

**Difficulty.** L1 exact range; L2 overflow; L3 placement interval; L4 account for reserved headroom.

**Misconceptions/constraints.** Both extrema are positive; no HDR or tone-curve claim unless specified.

**Feedback.** Mark scene interval and sensor interval on the same stop axis.

**Examples.**

1. Luminance ratio 64:1 → `6 stops`. L1.
2. Scene 10 stops, usable range 8 → exceeds by `2 stops`. L2.
3. Sensor range 12 stops with 1 stop reserved at highlights leaves 11 for scene; a 10-stop scene fits with 1 stop placement freedom. L3.

**Validation/coverage.** Interval containment and edge equality tests.

### Family `meter_histogram_claim_audit`

**Task.** Judge a claim about exposure, meter position, or histogram evidence.

**Response/template.** Supported/false/undetermined plus reason selection.

**Derivation.** Evaluate the controlled claim against semantic meter, histogram, channel, and intent fields.

**Difficulty.** L1 direct clipping; L2 spatial overclaim; L3 aesthetic overclaim; L4 raw/rendered distinction.

**Misconceptions/constraints.** Distractors say “centered is correct,” infer location from counts, or confuse no clipping with sufficient shadow signal.

**Feedback.** State exactly what the evidence shows and what it omits.

**Examples.**

1. “No channel reaches the clipping code” with maxima below threshold → supported. L1.
2. “The clipped pixels are in the sky” from a histogram alone → undetermined; histograms have no spatial location. L2.
3. “The image is artistically underexposed because its histogram is left-heavy” → unsupported without intent/rendering context. L3.

**Validation/coverage.** Claim truth table with supported, false, and undetermined controls.

### Cross-family progression

Luminance ratios precede meter weighting and tone placement. Incident/reflected contrasts prevent rote compensation. Ideal histogram shifts then establish clipping, channels, and headroom. Dynamic-range and claim-audit families integrate these facts without letting the histogram become a subjective scoring device.

## 4. Category: Aperture, Focus, Depth of Field, and Diffraction

### Category purpose

Connect aperture and focus settings to entrance-pupil geometry, acceptable-focus intervals, defocus blur, diffraction, and multi-focus coverage.

### Learn

The f-number is focal length divided by entrance-pupil diameter. A larger f-number usually deepens depth of field under otherwise fixed conditions, but the adopted circle of confusion, focal length, focus distance, framing, and output criterion matter. Depth of field is an interval rather than an exact physical boundary. Stopping down also enlarges the ideal diffraction pattern, so “more depth of field” and “more fine-detail resolution” are not identical goals.

### Prerequisites

F-number, algebra, consistent units, intervals, and the normative thin-lens/DOF formulas.

### Category boundaries

Use paraxial thin-lens and circular-aperture models. Autofocus algorithms, focus breathing, field curvature, tilt movements, lens-specific sharpness charts, and aesthetic bokeh grading are excluded.

### Subcategories

1. Aperture geometry
2. Depth-of-field direction and limits
3. Focus placement and defocus
4. Diffraction and sampling
5. Focus coverage and model audits

### Common misconceptions

- Treating the f-number as the iris diameter.
- Assuming depth of field is always one-third in front and two-thirds behind.
- Believing everything beyond the far limit is physically “out of focus” by an abrupt amount.
- Omitting the `+f` term or mixing metres and millimetres in hyperfocal calculations.
- Using the focused subject distance as image distance.
- Assuming the smallest aperture always maximizes resolved detail.
- Treating a circle-of-confusion choice as universal.

### Family `f_number_pupil_diameter`

**Task.** Solve f-number, focal length, or entrance-pupil diameter.

**Response/template.** Numeric quantity: `A {focalLength} lens is set to {aperture}. What is its entrance-pupil diameter?`

**Derivation.** Use `N=f/D`.

**Difficulty.** L1 solve diameter; L2 solve another variable; L3 compare lenses; L4 nominal versus measured T-stop contrast.

**Misconceptions/constraints.** Call `D` entrance pupil, not necessarily the physical iris. Use compatible units.

**Feedback.** Substitute into the ratio and label all lengths.

**Examples.**

1. 50 mm at f/2 → `D=25 mm`. L1.
2. 85 mm with 21.25 mm pupil → `f/4`. L2.
3. 24 mm f/2 and 100 mm f/2 have the same f-number but pupils 12 mm and 50 mm. L3.

**Validation/coverage.** Round-trip `f/N`; cover equal-f-number/different-pupil comparisons.

### Family `aperture_dof_direction`

**Task.** Compare modeled depth of field after an aperture change with all other relevant variables fixed.

**Response/template.** Deeper/shallower/same or ordered choices.

**Derivation.** Evaluate DOF limits or use monotonicity in `N` under the pinned model.

**Difficulty.** L1 aperture only; L2 compare near/far movement; L3 same exposure but different aperture; L4 identify insufficiently controlled comparison.

**Misconceptions/constraints.** Sensor, focal length, focus distance, framing, and `c` must be fixed or explicitly varied.

**Feedback.** Name the fixed variables before comparing the DOF interval.

**Examples.**

1. Same 50 mm lens/focus/`c`: f/8 gives deeper DOF than f/4. L1.
2. Opening f/11 to f/2.8 narrows modeled DOF even if ISO/shutter preserve brightness. L2.
3. “f/8 always has more DOF than f/4” without matching framing/distance/model → overbroad. L3.

**Validation/coverage.** Formula comparison and controlled/underdetermined cases.

### Family `hyperfocal_distance`

**Task.** Calculate or compare hyperfocal distance under a supplied `f,N,c`.

**Response/template.** Distance: `For f={f}, N={N}, c={c}, find H.`

**Derivation.** `H=f²/(Nc)+f`, with consistent units.

**Difficulty.** L1 direct friendly; L2 unit conversion; L3 solve aperture/criterion; L4 compare configurations.

**Misconceptions/constraints.** Reject cases where rounding changes a downstream limit materially.

**Feedback.** Convert units, compute the squared-focal term, then add `f`.

**Examples.**

1. `f=24 mm, N=8, c=0.03 mm` → `H=2424 mm≈2.42 m`. L2.
2. Halving `c` approximately doubles the dominant hyperfocal term. L2.
3. At fixed `f,c`, f/16 has roughly half the dominant hyperfocal distance of f/8. L3.

**Validation/coverage.** Dimensional and inverse-substitution checks; cover solve/compare modes.

### Family `dof_near_far_limits`

**Task.** Compute near and far acceptable-focus limits and total interval.

**Response/template.** Named near/far fields, with infinity allowed.

**Derivation.** Use the normative `Dn,Df`; return infinity when `s≥H`.

**Difficulty.** L1 finite friendly; L2 infinity; L3 unit/rounding; L4 compare two settings.

**Misconceptions/constraints.** Do not force finite subtraction from infinity. Focus distance exceeds focal length.

**Feedback.** Compute `H`, then each denominator separately and plot the interval.

**Examples.**

1. `f=50 mm, N=8, c=0.03 mm, s=5 m` → near `≈3.39 m`, far `≈9.53 m`. L2.
2. If `s≥H`, the far limit is `∞` under the model. L1.
3. Near 2 m, far 6 m → total modeled DOF `4 m`, not “2 m on each side of focus” unless focus is 4 m. L2.

**Validation/coverage.** Independent rational formula, interval ordering, finite/infinite boundary tests.

### Family `dof_zone_membership`

**Task.** Decide which subject distances lie within a computed or supplied DOF interval.

**Response/template.** Multiple selection or yes/no per subject.

**Derivation.** Test `Dn≤distance≤Df`, with declared endpoint inclusion and infinity handling.

**Difficulty.** L1 supplied limits; L2 calculate then test; L3 subjects near boundaries; L4 compare configurations.

**Misconceptions/constraints.** Boundary distances are generated away from tolerance unless boundary inclusion is the task.

**Feedback.** Place subjects and limits on a distance line.

**Examples.**

1. DOF `[2 m,5 m]`; subjects at 1.5, 3, 6 m → only 3 m is inside. L1.
2. Far limit infinity → every distance at or beyond the near limit is in the modeled interval. L2.
3. A subject just outside `Df` fails the adopted criterion but is not claimed to become abruptly unusable. L3.

**Validation/coverage.** Exact interval membership and near/far/outside balance.

### Family `focus_distance_select`

**Task.** Choose a focus distance whose computed DOF covers required near/far subjects.

**Response/template.** Candidate focus setting(s).

**Derivation.** Compute the DOF interval for every candidate and retain those covering the required bounds.

**Difficulty.** L1 supplied candidate intervals; L2 compute candidates; L3 optimize margin; L4 no feasible/tied choices.

**Misconceptions/constraints.** Candidate count at most five; accept all ties unless a secondary objective is stated.

**Feedback.** Table candidate focus, near limit, far limit, and coverage status.

**Examples.**

1. Required subjects 2–4 m; candidate zones `[1.8,4.2]` and `[2.5,∞]` → first only. L1.
2. Two candidates both cover the range → both correct absent another criterion. L2.
3. No candidate covers both near and far subjects → “no feasible setting,” not nearest guess. L3.

**Validation/coverage.** Enumerate candidates with an independent DOF solver.

### Family `defocus_blur_circle`

**Task.** Calculate or compare ideal sensor-plane defocus blur for an object away from the focus distance.

**Response/template.** Blur diameter or ordering.

**Derivation.** Compute `D=f/N`, `v_s`, `v_u`, then `b=D|v_s-v_u|/v_u`.

**Difficulty.** L1 image distances supplied; L2 full formula; L3 compare apertures/objects; L4 solve maximum acceptable displacement.

**Misconceptions/constraints.** Paraxial thin-lens model stated; `u,s>f`; no aesthetic bokeh claim.

**Feedback.** Draw the converging cone and sensor offset.

**Examples.**

1. `D=20 mm, v_u=52 mm, v_s=52 mm` → blur `0`; object is at focus. L1.
2. `D=25 mm, v_u=50.847 mm, v_s=51.282 mm` → `b≈0.214 mm`. L2.
3. At unchanged geometry, closing from f/2 to f/4 halves the ideal defocus-circle diameter. L3.

**Validation/coverage.** Ray-cone geometry against algebra; include zero and nonzero controls.

### Family `diffraction_airy_diameter`

**Task.** Compute the ideal Airy-disk diameter for a declared wavelength and aperture.

**Response/template.** Length in µm/mm: `At λ={lambda} and {aperture}, find 2.44λN.`

**Derivation.** Convert units and multiply `2.44λN`.

**Difficulty.** L1 direct µm; L2 nm conversion; L3 solve maximum f-number; L4 compare wavelengths.

**Misconceptions/constraints.** This is diameter to first dark ring, not radius or a universal sharpness score.

**Feedback.** Label wavelength, f-number, and diameter definition.

**Examples.**

1. `λ=0.55 µm, f/8` → `10.7 µm`. L1.
2. `λ=550 nm, f/16` → `21.5 µm`. L2.
3. At the same aperture, 650 nm produces a larger Airy diameter than 450 nm. L2.

**Validation/coverage.** Unit-normalized formula and wavelength/aperture monotonicity.

### Family `diffraction_pixel_criterion`

**Task.** Compare Airy diameter with pixel pitch under an explicitly declared sampling criterion.

**Response/template.** Ratio, pass/fail, or limiting f-number.

**Derivation.** Compute `d_Airy/pixelPitch` and apply the displayed threshold.

**Difficulty.** L1 ratio; L2 choose aperture; L3 compare sensors; L4 identify that criterion is conventional.

**Misconceptions/constraints.** Never infer actual system resolution from pixel pitch alone.

**Feedback.** Show both physical lengths and the declared pass rule.

**Examples.**

1. Airy diameter 12 µm, pitch 4 µm → spans `3 pixels`. L1.
2. Criterion `diameter≤2 pixels`; 10 µm on 4 µm pixels → fails (`2.5`). L2.
3. Same Airy diameter on 4 µm and 6 µm pixels gives different ratios, not automatically different final-image quality. L3.

**Validation/coverage.** Ratio/threshold oracle with pass, fail, and equality cases.

### Family `focus_stack_coverage`

**Task.** Select the smallest supplied set of focus intervals covering required subject distances.

**Response/template.** Ordered frame/focus selection.

**Derivation.** Treat each candidate frame as a verified interval and solve the small interval-cover problem; preserve every minimal tie.

**Difficulty.** L1 adjacent intervals; L2 overlap; L3 minimize frame count; L4 gap/no coverage.

**Misconceptions/constraints.** At most seven candidates; stacking artifacts and real capture reliability are out of scope.

**Feedback.** Overlay intervals and reveal covered/gap regions.

**Examples.**

1. Required 1–3 m; frames cover `[1,2]` and `[2,3]` → both frames. L1.
2. `[1,2.5]`, `[2,4]`, and `[1,4]` → single `[1,4]` frame is minimum. L2.
3. Required 1–5 m with a gap from 3–3.5 m → infeasible. L3.

**Validation/coverage.** Exhaustively enumerate subsets for minimal exact coverage.

### Family `circle_of_confusion_claim_audit`

**Task.** Audit a claim that depends on a chosen circle of confusion or DOF boundary.

**Response/template.** Supported/overstated/false with reason.

**Derivation.** Compare claim quantifiers with the declared `c`, viewing/output criterion, and computed blur.

**Difficulty.** L1 correct criterion; L2 compare two `c` values; L3 universal claim; L4 output-size change.

**Misconceptions/constraints.** Distractors turn a model threshold into a universal physical fact.

**Feedback.** Restate the adopted criterion and scope the conclusion.

**Examples.**

1. “Under `c=0.03 mm`, 3 m lies inside the computed DOF interval” → supported if membership holds. L1.
2. Smaller `c` generally narrows the acceptable interval under otherwise fixed settings. L2.
3. “Everything inside the DOF limits is perfectly sharp at every output size” → overstated. L3.

**Validation/coverage.** Claim AST against multiple criterion/output models.

### Cross-family progression

Entrance-pupil geometry precedes qualitative DOF comparison. Hyperfocal and limit calculations then support interval membership and focus choice. Defocus circles expose the continuous geometry behind the threshold. Diffraction and pixel criteria introduce the stopping-down tradeoff. Focus-stack and claim-audit work caps the category without pretending the simplified model guarantees a real result.

## 5. Category: Shutter Time, Motion, and Temporal Capture

### Category purpose

Relate exposure duration to image motion from subjects, camera rotation, panning, stabilization, and sensor readout.

### Learn

Shutter time integrates motion. A moving subject can travel across the projected image while the shutter is open, and angular camera motion moves every projected detail. Shorter times reduce both in the ideal model. Stabilization addresses camera motion but cannot stop an independently moving subject. Panning reduces relative angular motion for the tracked subject. A rolling shutter records different rows at different times, so scan time can create geometric skew even when each row's exposure is short.

### Prerequisites

Time, speed, magnification, focal length, pixel pitch, and stop changes.

### Category boundaries

This category uses constant-motion abstractions. It excludes safety-critical “minimum shutter” advice, sports/wildlife tactics, real stabilization guarantees, video shutter angle, flash-duration modeling beyond Category 8, and proprietary readout behavior.

### Subcategories

1. Subject and camera blur
2. Pixel-level thresholds
3. Heuristics and stabilization
4. Panning and rolling shutter

### Common misconceptions

- Treating shutter speed as a speed rather than an exposure time.
- Forgetting image magnification or unit conversion.
- Applying a reciprocal-focal-length heuristic as a law.
- Assuming stabilization freezes subject motion.
- Adding camera and subject motion magnitudes without direction.
- Treating a short per-row exposure as proof that rolling-shutter skew is absent.

### Family `subject_linear_blur`

**Task.** Calculate sensor-plane blur from constant transverse subject motion.

**Response/template.** Length: `Given |m|={magnification}, v={speed}, t={time}, find b=|m|vt.`

**Derivation.** Convert object travel `vt` to consistent length units, then multiply by magnification.

**Difficulty.** L1 values supplied; L2 derive travel; L3 solve shutter limit; L4 compare two subjects.

**Misconceptions/constraints.** Motion is transverse and magnification constant; reject perspective-changing motion.

**Feedback.** Compute object displacement first, then its sensor projection.

**Examples.**

1. `|m|=0.01`, `v=1 m/s`, `t=1/100 s` → `0.10 mm` blur. L1.
2. Doubling time doubles blur under unchanged motion. L1.
3. Subject A has twice the speed but half the magnification of B → equal modeled blur at the same time. L3.

**Validation/coverage.** Unit-aware forward calculation and proportionality checks.

### Family `angular_camera_blur`

**Task.** Calculate ideal sensor-plane blur caused by small constant angular camera motion.

**Response/template.** Length: `For f={f}, ω={omega}, t={time}, find b≈fωt.`

**Derivation.** Convert `ω` to radians/s and `f` to requested length; multiply.

**Difficulty.** L1 radians supplied; L2 degrees conversion; L3 solve maximum time; L4 compare focal lengths.

**Misconceptions/constraints.** Small-angle model shown; translational/parallax motion excluded.

**Feedback.** Calculate angular displacement `ωt`, then project with focal length.

**Examples.**

1. `f=50 mm`, `ω=0.01 rad/s`, `t=1/50 s` → `0.010 mm=10 µm`. L1.
2. Same angular motion at 100 mm gives twice the sensor blur of 50 mm. L2.
3. `0.5°/s` must be converted to `0.00873 rad/s` before use. L2.

**Validation/coverage.** Angle-unit conversion and independent small-angle projection.

### Family `motion_blur_pixels`

**Task.** Express a sensor-plane blur length in pixels or determine a pixel-threshold result.

**Response/template.** Pixel count/pass-fail: `Blur is {b}; pixel pitch is {p}. How many pixels?`

**Derivation.** `pixels=b/p`, with the displayed threshold rule.

**Difficulty.** L1 direct; L2 derive `b`; L3 compare crops/sensors; L4 solve setting threshold.

**Misconceptions/constraints.** Pixel pitch and blur use same sensor-plane units. Pixel blur is not a universal perceptual score.

**Feedback.** Convert both to µm and divide.

**Examples.**

1. 12 µm blur on 4 µm pixels → `3 pixels`. L1.
2. 0.020 mm blur on 5 µm pixels → `4 pixels`. L2.
3. Criterion `≤2 pixels`; 9 µm blur on 4 µm pixels → fails at `2.25 pixels`. L2.

**Validation/coverage.** Unit round-trip and threshold equality cases.

### Family `maximum_shutter_for_motion`

**Task.** Solve the longest exposure time meeting a declared motion-blur limit.

**Response/template.** Time plus nearest allowed dial setting.

**Derivation.** Subject model `t_max=b_max/(|m|v)` or angular model `t_max=b_max/(fω)`; choose a shutter no longer than the limit.

**Difficulty.** L1 analytical; L2 nearest nominal setting; L3 combine pixel limit; L4 no feasible camera setting.

**Misconceptions/constraints.** “Maximum time” means a shorter time also passes. Nominal rounding must choose the conservative allowed side.

**Feedback.** Rearrange the blur inequality and compare neighboring dial times.

**Examples.**

1. `b_max=0.02 mm`, `|m|=0.01`, `v=500 mm/s` → `t_max=0.004 s=1/250 s`. L1.
2. Analytical limit `1/180 s`; available `1/125,1/250` → choose `1/250 s` or faster. L2.
3. Required time `≤1/16000 s` but camera minimum is `1/8000 s` → no feasible setting. L3.

**Validation/coverage.** Substitute chosen time into inequality and check adjacent dial failure.

### Family `camera_shake_heuristic`

**Task.** Apply a supplied reciprocal-style baseline heuristic without treating it as universal.

**Response/template.** Baseline/allowed nominal shutter: `Using the displayed rule t≤1/(k f), find the slowest listed shutter.`

**Derivation.** Evaluate the supplied rule, then choose the longest dial time not exceeding it.

**Difficulty.** L1 `k=1`; L2 supplied multiplier; L3 compare formats/outputs; L4 audit overclaim.

**Misconceptions/constraints.** The rule is a scenario parameter, not camera truth; focal length units and `k` are explicit.

**Feedback.** Show the heuristic limit and conservative dial selection.

**Examples.**

1. Rule `t≤1/f`, `f=50 mm` → limit `1/50 s`; slowest listed core setting is `1/60 s`. L1.
2. Rule `t≤1/(2f)`, `f=100 mm` → limit `1/200 s`; choose `1/250 s`. L2.
3. “Every person can handhold 50 mm safely at 1/50 s” → unsupported; the supplied rule is not a guarantee. L3.

**Validation/coverage.** Inequality and dial-neighbor checks; include explicit heuristic-limitation items.

### Family `stabilization_stop_allowance`

**Task.** Apply a supplied stabilization allowance to a supplied unstabilized baseline.

**Response/template.** Time/setting: `Baseline {t0}; model grants {S} stops. What modeled maximum time?`

**Derivation.** `t=t0×2^S`, or move `S` nominal shutter steps longer.

**Difficulty.** L1 integer stops; L2 fractional; L3 control limit; L4 compare systems.

**Misconceptions/constraints.** State “modeled allowance,” never guaranteed rating. Subject motion is absent here.

**Feedback.** Multiply time by two once per stop.

**Examples.**

1. Baseline `1/250 s`, 3 stops → `1/30 s` nominal. L1.
2. Baseline `1/60 s`, 2 stops → `1/15 s`. L1.
3. Baseline `1/125 s`, 4-stop allowance but maximum camera time `1/15 s` → capped at `1/15 s`. L3.

**Validation/coverage.** Factor/index check with limits and fractional cases.

### Family `stabilization_subject_motion`

**Task.** Decide which blur sources a supplied stabilization model changes.

**Response/template.** Multiple selection or before/after blur table.

**Derivation.** Reduce declared camera-angular component only; retain subject-relative component and combine vectors by the supplied rule.

**Difficulty.** L1 identify source; L2 numeric components; L3 opposite directions; L4 panning/stabilization interaction.

**Misconceptions/constraints.** Distractors reduce all blur or increase captured photons.

**Feedback.** Separate camera-motion and subject-motion rows.

**Examples.**

1. Static subject, camera shake only → stabilization may reduce modeled blur. L1.
2. Tripod-perfect camera, moving subject → stabilization changes no modeled subject blur. L1.
3. Camera component 3 px reduced to 1 px while subject component remains 4 px → do not call total 1 px; combine by declared direction rule. L3.

**Validation/coverage.** Component provenance and vector/scalar combination checks.

### Family `panning_relative_motion`

**Task.** Calculate or compare blur using subject angular speed relative to camera pan speed.

**Response/template.** Relative angular speed/blur/order.

**Derivation.** `ω_rel=ω_subject-ω_pan`; use signed direction, then `b≈f|ω_rel|t`.

**Difficulty.** L1 perfect tracking; L2 same direction; L3 opposite direction; L4 choose pan rate among candidates.

**Misconceptions/constraints.** Do not subtract unsigned magnitudes when directions differ.

**Feedback.** Put subject and camera angular velocities on one signed axis.

**Examples.**

1. Subject and pan both `5°/s` same direction → relative speed 0, ideal tracked-subject blur 0. L1.
2. Subject `8°/s`, pan `5°/s` same direction → relative `3°/s`. L2.
3. Subject `+4°/s`, camera `−2°/s` → relative `+6°/s`, not 2. L3.

**Validation/coverage.** Signed relative-motion and projected-blur oracles.

### Family `rolling_shutter_skew`

**Task.** Compute or interpret displacement across a declared rolling-shutter scan.

**Response/template.** Pixel displacement, skew direction, or sensor comparison.

**Derivation.** For constant image speed `q`, `Δx=qT_scan`; sign follows motion and scan direction.

**Difficulty.** L1 magnitude; L2 direction; L3 compare scan times; L4 separate per-row exposure from total scan.

**Misconceptions/constraints.** Synthetic row scan is linear. Do not infer a real camera's sensor behavior.

**Feedback.** Mark first/last row times and object positions.

**Examples.**

1. Image speed 1000 px/s, scan 0.020 s → `20 px` displacement. L1.
2. Halving scan time halves modeled skew at the same image speed. L2.
3. Per-row exposure 1/2000 s with total scan 1/50 s can freeze each row yet retain inter-row skew. L3.

**Validation/coverage.** Time-position simulation for both scan/motion directions.

### Cross-family progression

Direct subject and angular blur establish separate sources, then pixel conversion and threshold inversion make the model operational. Heuristics are introduced only after the physical variables are visible. Stabilization and panning distinguish source-relative effects. Rolling shutter caps the category by separating exposure duration from full-frame readout time.

## 6. Category: Focal Length, Sensor Size, Framing, and Perspective

### Category purpose

Build geometric fluency connecting focal length and sensor dimensions to angle of view, projected size, cropping, framing, panoramas, and viewpoint-dependent perspective.

### Learn

For a rectilinear lens, angle of view depends on both focal length and the chosen sensor dimension. Crop factor compares formats for field of view; it does not physically multiply focal length. Cropping from the same viewpoint preserves perspective and discards outer image area. Changing focal length and moving to restore framing changes viewpoint, and that viewpoint change alters near/far size relationships.

### Prerequisites

Similar triangles, `tan`/`atan`, sensor dimensions, pixel dimensions, and focal length.

### Category boundaries

This category assumes rectilinear projection and ideal geometry. Distortion is in Category 7. Fisheye, nodal-point panorama rig setup, tilt/shift, lens breathing, and subjective “compression” aesthetics are excluded.

### Subcategories

1. Angle of view and framing
2. Crop factor and format comparison
3. Viewpoint and perspective
4. Aspect crops and panoramas

### Common misconceptions

- Giving an angle of view without saying horizontal, vertical, or diagonal.
- Saying crop factor changes the physical focal length.
- Saying focal length alone changes perspective from a fixed viewpoint.
- Comparing depth of field across formats without matching framing/output assumptions.
- Using sensor diagonal for a horizontal-angle question.
- Treating panorama overlap as additional unique coverage.

### Family `angle_of_view`

**Task.** Compute rectilinear angle of view along a named sensor dimension.

**Response/template.** Angle: `Sensor {dimension}={d}, focal length {f}. Find {axis} angle of view.`

**Derivation.** `θ=2atan(d/(2f))`.

**Difficulty.** L1 direct; L2 choose sensor dimension; L3 compare lenses; L4 solve after crop.

**Misconceptions/constraints.** Angle axis and rectilinear model shown; answer in degrees.

**Feedback.** Draw the half-angle triangle and double it.

**Examples.**

1. Width 36 mm, focal length 50 mm → horizontal AOV `≈39.6°`. L1.
2. Height 24 mm at 50 mm → vertical AOV `≈27.0°`. L2.
3. At fixed sensor size, 25 mm gives a wider AOV than 50 mm. L1.

**Validation/coverage.** Forward trig plus monotonicity and axis selection.

### Family `focal_length_from_aov`

**Task.** Solve focal length required for a named angle of view and sensor dimension.

**Response/template.** Focal length: `For sensor dimension {d} and AOV {theta}, find f.`

**Derivation.** `f=d/[2tan(θ/2)]`.

**Difficulty.** L1 friendly angle; L2 arbitrary; L3 nearest available lens; L4 feasibility range.

**Misconceptions/constraints.** Degrees converted internally; choose nearest only when instructed and reject equal ties.

**Feedback.** Halve the angle, take tangent, then divide.

**Examples.**

1. `d=24 mm`, AOV `60°` → `f≈20.8 mm`. L2.
2. `d=36 mm`, AOV `90°` → `f=18 mm`. L1.
3. Required 30 mm but candidates are 24, 35, 50 mm → choose 35 mm only under the displayed nearest-focal rule. L3.

**Validation/coverage.** Substitute into AOV formula and check candidate ordering.

### Family `projected_subject_size`

**Task.** Compute ideal subject image size on the sensor.

**Response/template.** Sensor length/fraction: `Object size {h_o}, d_o={do}, f={f}. Find |h_i|.`

**Derivation.** Solve `d_i`, then `|m|=d_i/d_o` and `|h_i|=|m|h_o`.

**Difficulty.** L1 magnification supplied; L2 full thin lens; L3 fit comparison; L4 solve object distance.

**Misconceptions/constraints.** All lengths consistent; object plane parallel to sensor.

**Feedback.** Calculate magnification before projected size.

**Examples.**

1. `|m|=0.01`, object 2 m tall → image `20 mm` tall. L1.
2. `f=50 mm`, `d_o=5000 mm`, object 1800 mm → image `≈18.2 mm`. L2.
3. Image 12 mm on sensor height 24 mm occupies `50%` of the height. L1.

**Validation/coverage.** Thin-lens/magnification and sensor-fit checks.

### Family `focal_length_for_framing`

**Task.** Choose focal length to frame a scene extent at a fixed viewpoint under rectilinear geometry.

**Response/template.** Focal length/candidate: `At distance {s}, scene width {W} must fill sensor width {d}. Find f.`

**Derivation.** Compute required half-angle `atan((W/2)/s)`, then `f=d/[2tan(θ/2)]`; equivalently `f=ds/W` in this centered planar model.

**Difficulty.** L1 direct; L2 margin; L3 candidate lens; L4 fixed-position infeasibility.

**Misconceptions/constraints.** Scene plane, sensor dimension, and viewpoint are explicit.

**Feedback.** Draw scene and sensor half-width triangles.

**Examples.**

1. Sensor width 36 mm, scene width 3 m at 5 m → `f=60 mm`. L1.
2. Adding 10% width margin increases required scene width and therefore uses a shorter focal length. L2.
3. Required 70 mm but available zoom ends at 50 mm → no exact fill from the fixed viewpoint. L3.

**Validation/coverage.** Framing projection and candidate/limit checks.

### Family `crop_factor`

**Task.** Compute crop factor from reference and target sensor dimensions.

**Response/template.** Unitless factor: `Reference diagonal {d_ref}; sensor diagonal {d}. Find crop factor.`

**Derivation.** `crop=d_ref/d`.

**Difficulty.** L1 dimensions supplied; L2 derive diagonals; L3 inverse sensor size; L4 compare axis-specific crops.

**Misconceptions/constraints.** Crop factor uses like dimensions and named reference; diagonal convention not silently applied to an axis crop.

**Feedback.** State reference dimension divided by target dimension.

**Examples.**

1. Reference diagonal 43.3 mm, sensor diagonal 21.65 mm → crop `2×`. L1.
2. 36×24 mm sensor diagonal → `≈43.3 mm`. L2.
3. A 1.5× crop factor does not turn a 50 mm lens physically into 75 mm. L2.

**Validation/coverage.** Ratio/inverse and sensor-diagonal calculation.

### Family `equivalent_field_of_view`

**Task.** Find the reference-format focal length giving the same ideal angle of view.

**Response/template.** Focal length: `Lens {f} on crop {c}. What reference-format focal length matches its field of view?`

**Derivation.** `f_equiv=c f` for sensors with matched aspect/diagonal convention.

**Difficulty.** L1 integer crop; L2 decimal; L3 inverse; L4 aspect-ratio caveat.

**Misconceptions/constraints.** Wording says field-of-view equivalent, never changed physical focal length.

**Feedback.** Compare sensor dimension/focal-length ratios.

**Examples.**

1. 25 mm on 2× crop → 50 mm reference-format FOV equivalent. L1.
2. 35 mm on 1.5× crop → 52.5 mm equivalent. L2.
3. Desired 75 mm equivalent on 1.5× crop → use 50 mm. L2.

**Validation/coverage.** AOV equality check rather than ratio alone.

### Family `same_viewpoint_crop`

**Task.** Predict what changes when an image is cropped while viewpoint and lens remain fixed.

**Response/template.** Multiple selection/claim classification.

**Derivation.** Apply crop rectangle to projected image: field of view and pixel count change; perspective ratios and optical projection inside retained region do not.

**Difficulty.** L1 FOV; L2 resolution; L3 compare to smaller sensor; L4 distinguish display enlargement.

**Misconceptions/constraints.** Output rescaling is specified separately from crop.

**Feedback.** Overlay original/crop bounds on the same projection.

**Examples.**

1. Center crop narrows field of view and removes edge content. L1.
2. Same viewpoint crop does not change near/far perspective geometry within retained pixels. L2.
3. Cropping 6000×4000 to 3000×2000 leaves one quarter of the pixels, not half. L2.

**Validation/coverage.** Crop geometry, pixel count, and invariant perspective checks.

### Family `viewpoint_perspective`

**Task.** Compare relative projected sizes or perspective after a viewpoint change.

**Response/template.** Ratio/order/controlled explanation.

**Derivation.** Under small-object planar projection, apparent scale is proportional to `1/distance`; compare near/far scale ratios from each viewpoint.

**Difficulty.** L1 same viewpoint; L2 move and reframe; L3 equal subject framing; L4 audit focal-length explanation.

**Misconceptions/constraints.** Focal length can restore framing but viewpoint causes the changed distance ratios.

**Feedback.** Calculate near and far distances from each viewpoint before mentioning lens choice.

**Examples.**

1. Equal objects at 2 m and 4 m project in a `2:1` size ratio from the same viewpoint. L1.
2. Move so the near object is at 4 m and the far one at 6 m → ratio becomes `1.5:1`; background is larger relative to subject. L2.
3. “The longer focal length compressed perspective” is incomplete when the photographer also moved back; the viewpoint change caused the perspective change. L3.

**Validation/coverage.** Projection ratios and same-viewpoint controls.

### Family `aspect_ratio_crop`

**Task.** Compute maximal crop dimensions or retained fraction for a target aspect ratio.

**Response/template.** Pixel dimensions/percentage: `Crop {W}×{H} to {a}:{b} without upscaling. Find maximum centered crop.`

**Derivation.** Fit largest rectangle of target ratio within source; compute retained pixels.

**Difficulty.** L1 square; L2 landscape/portrait; L3 compare options; L4 physical print constraint.

**Misconceptions/constraints.** Integer pixel dimensions and displayed rounding/crop alignment.

**Feedback.** Compare source and target ratios, then limit by width or height.

**Examples.**

1. 6000×4000 to 1:1 → `4000×4000`, 16 MP. L1.
2. 6000×4000 to 16:9 → `6000×3375`. L2.
3. A crop retaining 75% of each linear dimension retains `56.25%` of pixels. L3.

**Validation/coverage.** Aspect equality, containment, and pixel-fraction checks.

### Family `panorama_frame_count`

**Task.** Determine ideal frame count for angular coverage and declared overlap.

**Response/template.** Integer count: `Each frame covers {FOV}; overlap is {o}; cover {total}. Find minimum frames.`

**Derivation.** Effective angular step `FOV(1-o)`; if total exceeds one frame, `n=1+ceil((total-FOV)/step)`.

**Difficulty.** L1 no overlap; L2 percent overlap; L3 vertical/horizontal choice; L4 candidate orientations/ties.

**Misconceptions/constraints.** Use supplied planar angular-coverage model; exclude spherical stitching and parallax.

**Feedback.** First frame covers full FOV; each additional frame adds only the non-overlap step.

**Examples.**

1. FOV 60°, no overlap, cover 150° → `3 frames`. L1.
2. FOV 60°, 25% overlap, cover 150° → step 45°, `3 frames`. L2.
3. Dividing total coverage by the overlap-reduced step without treating the first frame separately can overcount. L3.

**Validation/coverage.** Simulate interval union and verify `n−1` fails target coverage.

### Cross-family progression

Angle-of-view calculation precedes inverse focal choice and projection size. Framing then makes the geometry practical. Crop factor and equivalent FOV are taught with same-viewpoint controls so physical focal length and perspective remain distinct. Viewpoint questions explicitly isolate perspective. Aspect crop and panorama coverage extend framing without subjective composition grading.

## 7. Category: Image Formation and Photographic Optics

### Category purpose

Apply bounded optical models to photographic focus, magnification, lens power, transmission, macro exposure, distortion, aberration evidence, and illumination falloff.

### Learn

A camera lens forms a real inverted image at the sensor. The thin-lens equation connects focal length, object distance, and image distance; magnification connects object and image size. F-number describes entrance-pupil geometry, while T-stop also accounts for transmission. Close focus requires extra image distance and changes the effective f-number in the declared symmetric-lens macro model. Real lenses can add aberration, distortion, and vignetting, but those effects must be inferred from supplied measurements rather than blamed automatically.

### Prerequisites

Algebra, consistent units, f-number, stops, ratios, and simple ray diagrams.

### Category boundaries

The category uses thin lenses, paraxial rays, lenses in contact, and explicitly supplied simplified defect models. Multi-element design, principal-plane measurement, MTF, field curvature, diffraction integrals, lens repair, and brand-specific corrections are excluded.

### Subcategories

1. Thin-lens focus and magnification
2. Extension and optical power
3. Transmission and macro exposure
4. Aberration, distortion, and vignetting evidence

### Common misconceptions

- Using focal length as the ordinary sensor distance for every focus distance.
- Reversing object and image distance or ignoring image inversion.
- Adding focal lengths rather than optical powers for thin lenses in contact.
- Treating f-stop and T-stop as identical regardless of transmission.
- Forgetting the macro effective-aperture factor.
- Calling any soft corner “diffraction.”
- Confusing geometric distortion with perspective or vignetting.

### Family `thin_lens_image_distance`

**Task.** Solve a photographic thin-lens image distance or missing object/focal distance.

**Response/template.** Length: `For f={f} and d_o={do}, find d_i using 1/f=1/d_o+1/d_i.`

**Derivation.** Rearrange `d_i=f d_o/(d_o-f)` or the corresponding missing-variable form.

**Difficulty.** L1 direct; L2 unit conversion; L3 inverse; L4 near-focal sensitivity/feasibility.

**Misconceptions/constraints.** Core real-image cases use `d_o>f`; reject values whose rounded denominator is unstable.

**Feedback.** Show reciprocals and verify `d_i>f`.

**Examples.**

1. `f=50 mm`, `d_o=2000 mm` → `d_i≈51.28 mm`. L1.
2. Object at a very large declared distance → `d_i` approaches 50 mm for a 50 mm lens. L1.
3. `f=100 mm`, `d_i=125 mm` → `d_o=500 mm`. L2.

**Validation/coverage.** Substitute all three values into the reciprocal identity.

### Family `thin_lens_magnification`

**Task.** Compute signed/absolute magnification or image size.

**Response/template.** Magnification and/or image height: `Given d_i,d_o,h_o, find m and h_i.`

**Derivation.** `m=-d_i/d_o`; `h_i=m h_o`.

**Difficulty.** L1 magnitude; L2 signed orientation; L3 missing object size; L4 sensor-fit comparison.

**Misconceptions/constraints.** Prompt states whether sign/orientation is requested; UI render may rotate image upright only when labeled.

**Feedback.** Separate scale magnitude from inversion sign.

**Examples.**

1. `d_i=50 mm`, `d_o=1000 mm` → `m=−0.05`. L1.
2. A 400 mm object at `m=−0.05` → image `−20 mm`, inverted. L2.
3. Image magnitude 18 mm on a 24 mm-high sensor occupies `75%` of sensor height. L2.

**Validation/coverage.** Similar-triangle and sensor-bound checks.

### Family `focus_extension`

**Task.** Calculate sensor extension beyond the infinity-focus image distance.

**Response/template.** Length: `For focal length {f} focused at {do}, find extension e=d_i-f.`

**Derivation.** Solve thin-lens `d_i`, then subtract `f`.

**Difficulty.** L1 direct; L2 compare focus distances; L3 solve distance from extension; L4 extension limit.

**Misconceptions/constraints.** Ideal thin-lens extension, not a real lens's internal-focus mechanics.

**Feedback.** Show infinity position `f`, focused position `d_i`, and their difference.

**Examples.**

1. `f=100 mm`, object 1000 mm → `d_i≈111.11 mm`, extension `≈11.11 mm`. L2.
2. As object distance approaches infinity, extension approaches 0. L1.
3. An internally focusing real lens need not physically extend by the ideal result; the exercise model is explicit. L3.

**Validation/coverage.** Thin-lens round-trip and monotonicity with object distance.

### Family `diopter_power`

**Task.** Convert focal length in metres to optical power or vice versa.

**Response/template.** Dioptres/focal length: `What is the optical power of f={f}?`

**Derivation.** `P=1/f_m`; sign follows converging/diverging convention.

**Difficulty.** L1 positive; L2 unit conversion; L3 negative; L4 compare powers.

**Misconceptions/constraints.** Metres are required inside formula; dioptre symbol `D` is not aperture diameter in this context.

**Feedback.** Convert to metres and take reciprocal.

**Examples.**

1. `f=0.50 m` → `+2 D`. L1.
2. `f=50 mm` → `+20 D`. L2.
3. `P=−4 D` → `f=−0.25 m`. L2.

**Validation/coverage.** Reciprocal round-trip and sign checks.

### Family `lenses_in_contact`

**Task.** Combine ideal thin-lens powers or solve a missing component.

**Response/template.** Total power/effective focal length: `P₁={P1}, P₂={P2}. Find P_total and f.`

**Derivation.** `P_total=ΣP_i`; `f=1/P_total` when nonzero.

**Difficulty.** L1 positive pair; L2 positive/negative; L3 solve missing power; L4 zero/near-zero combination.

**Misconceptions/constraints.** Lenses are thin and in contact; separated lens groups are excluded.

**Feedback.** Add powers first, then invert.

**Examples.**

1. `+2 D` and `+3 D` → `+5 D`, `f=0.20 m`. L1.
2. `+2 D` and `−0.5 D` → `+1.5 D`, `f≈0.667 m`. L2.
3. `+4 D` and `−4 D` → total 0 D, infinite effective focal length in this model. L3.

**Validation/coverage.** Power sum and reciprocal with zero special case.

### Family `t_stop_transmission`

**Task.** Relate f-number, optical transmittance, and T-stop.

**Response/template.** T-number/transmittance: `Lens is {fNumber} with τ={tau}. Find T=N/√τ.`

**Derivation.** `T=N/√τ`, or rearrange `τ=(N/T)²`.

**Difficulty.** L1 friendly square; L2 compare lenses; L3 solve transmittance; L4 exposure difference.

**Misconceptions/constraints.** Transmittance is within `(0,1]`; T-number cannot be smaller than f-number under this model.

**Feedback.** Show how transmission multiplies the `1/N²` geometric factor.

**Examples.**

1. f/2 with `τ=0.81` → `T≈2.22`. L1.
2. Two lenses at f/2 with T2 and T2.8 do not deliver equal physical exposure at the same shutter. L2.
3. f/4 marked T4.4 → `τ=(4/4.4)²≈0.826`, or 82.6%. L3.

**Validation/coverage.** Transmittance round-trip and exposure ratio from T-numbers.

### Family `macro_effective_f_number`

**Task.** Calculate effective f-number or exposure loss at a declared magnification.

**Response/template.** Effective f-number/stops: `Using N_eff=N(1+m), find {target}.`

**Derivation.** `N_eff=N(1+m)`; exposure loss relative to infinity is `2log₂(1+m)` stops.

**Difficulty.** L1 1:1; L2 arbitrary magnification; L3 compensate shutter; L4 identify model limit.

**Misconceptions/constraints.** Symmetric-lens/no pupil-magnification model is displayed; magnification is non-negative magnitude.

**Feedback.** Compute extension factor `1+m`, then f-number and square-law stop loss.

**Examples.**

1. Marked f/4 at 1:1 (`m=1`) → effective `f/8`, loss `2 stops`. L1.
2. Marked f/5.6 at `m=0.5` → effective `f/8.4`, loss `≈1.17 stops`. L2.
3. A real asymmetric macro lens may need a pupil-magnification correction; do not apply this simplified result universally. L3.

**Validation/coverage.** Effective-number and stop-loss identity.

### Family `aberration_evidence_match`

**Task.** Match generated ray/intercept evidence to a bounded aberration or to “insufficient evidence.”

**Response/template.** Single-choice with evidence reason.

**Derivation.** Compare semantic ray groups: wavelength-dependent lateral position, wavelength-dependent axial focus, marginal/paraxial focus, or off-axis asymmetric point spread.

**Difficulty.** L1 distinctive ray set; L2 compare two defects; L3 combined/noise; L4 insufficient evidence.

**Misconceptions/constraints.** Choices use lateral/longitudinal chromatic aberration, spherical aberration, coma, or none/unknown. Static name recall alone is insufficient.

**Feedback.** Highlight which rays separate and where.

**Examples.**

1. Red/blue rays focus at different axial distances on-axis → longitudinal chromatic aberration. L1.
2. Off-axis point produces an asymmetric comet-like spread while on-axis point remains compact → coma evidence. L2.
3. A uniformly soft synthetic image without ray/focus controls → insufficient to identify a specific aberration. L3.

**Validation/coverage.** Generate forward from aberration parameters and retain non-aberrated/ambiguous controls.

### Family `radial_distortion_mapping`

**Task.** Apply or classify a supplied simple radial-distortion mapping.

**Response/template.** Radius/classification: `For normalized r and r'=r(1+kr²), find r' and classify k.`

**Derivation.** Substitute; `k<0` decreases outward magnification (barrel), `k>0` increases it (pincushion), `k=0` none.

**Difficulty.** L1 sign classification; L2 numeric mapping; L3 inverse candidate; L4 distinguish perspective.

**Misconceptions/constraints.** Normalized radius is supplied; keep mapping monotone over generated domain.

**Feedback.** Compare mapped radius with ideal radius at center and edge.

**Examples.**

1. `k<0` → barrel distortion in this model. L1.
2. `r=0.8`, `k=−0.1` → `r'=0.7488`. L2.
3. Converging verticals caused by an upward-tilted viewpoint are perspective, not proof of radial distortion. L3.

**Validation/coverage.** Numeric forward map, derivative monotonicity, and semantic defect contrast.

### Family `vignetting_stop_difference`

**Task.** Convert center-to-corner illumination ratio into stop falloff or apply a correction.

**Response/template.** Signed corner change/loss: `Corner exposure is {fraction} of center. Find falloff in stops.`

**Derivation.** Corner relative change `log₂(H_corner/H_center)`; positive loss magnitude is its negation.

**Difficulty.** L1 powers of two; L2 non-power; L3 radial samples; L4 correction/clipping audit.

**Misconceptions/constraints.** Prompt distinguishes signed change from positive loss. Do not infer cause from falloff alone.

**Feedback.** State corner/center ratio and sign convention.

**Examples.**

1. Corner is half the center → `−1 stop` relative, or `1 stop falloff`. L1.
2. Corner is 25% of center → `2 stops falloff`. L2.
3. Brightening a 2-stop-dark corner by 2 stops multiplies its code by 4 and may expose noise/clipping limits supplied separately. L3.

**Validation/coverage.** Ratio-stop round-trip and signed/loss response modes.

### Cross-family progression

Thin-lens distance precedes magnification and extension. Optical power then provides an alternate lens representation. T-stop and macro effective f-number connect optical geometry back to exposure without conflating transmission and pupil size. Aberration, distortion, and vignetting families use generated evidence and non-defect controls so they train diagnosis rather than vocabulary recall.

## 8. Category: Flash, Illumination, and Optical Filters

### Category purpose

Train stop-based reasoning for idealized point-source lighting, direct flash, ambient/flash separation, synchronization, neutral-density loss, and polarization.

### Learn

Ideal point-source illumination falls with the square of distance: doubling distance gives one quarter as much illumination, a two-stop loss. Direct-flash guide number relates f-number and distance under a declared ISO and unit. Below the synchronization limit, shutter time changes modeled ambient exposure but not an instantaneous flash contribution. Aperture affects both captured components. Filters reduce transmitted light by a declared factor; ideal crossed polarizers follow `cos²θ`.

### Prerequisites

Stops, inverse squares, f-number, ISO-brightness distinction, and setting limits.

### Category boundaries

All lighting is synthetic and low-risk. No real placement, electrical, heat, eye-safety, event, portrait, or outdoor flash instructions are given. Real bounce surfaces, TTL algorithms, modifiers, recycle times, color shifts, and HSS output curves appear only as supplied abstract losses.

### Subcategories

1. Inverse-square illumination
2. Guide number and flash power
3. Ambient/flash control and synchronization
4. Neutral-density and polarizing filters

### Common misconceptions

- Expecting double distance to lose one stop rather than two.
- Adding distance ratios instead of squaring them.
- Mixing feet and metres in guide number.
- Believing ISO changes flash output.
- Assuming shutter time always changes an instantaneous flash contribution.
- Assuming stabilization or flash power changes ambient exposure.
- Adding filter transmittances rather than multiplying them.
- Treating a polarizer as a guaranteed reflection remover.

### Family `inverse_square_illumination`

**Task.** Compute illumination ratio after a point-source power or distance change.

**Response/template.** Ratio/value: `Source power changes {P1}->{P2}; distance {d1}->{d2}. Find E2/E1.`

**Derivation.** `E₂/E₁=(P₂/P₁)(d₁/d₂)²`.

**Difficulty.** L1 distance only; L2 power only; L3 both; L4 solve missing distance.

**Misconceptions/constraints.** Ideal point source and unobstructed geometry are stated.

**Feedback.** Separate power factor and squared-distance factor.

**Examples.**

1. Distance doubles, same power → illumination `1/4×`. L1.
2. Power doubles, same distance → `2×`. L1.
3. Power doubles and distance doubles → `1/2×`. L2.

**Validation/coverage.** Forward/inverse calculation and scale-invariance tests.

### Family `flash_distance_stops`

**Task.** Express a direct-flash distance change in illumination stops or construct a target distance.

**Response/template.** Signed stops/distance.

**Derivation.** `Δ=-2log₂(d₂/d₁)` at fixed flash power.

**Difficulty.** L1 double/half; L2 arbitrary ratio; L3 solve distance; L4 combine power.

**Misconceptions/constraints.** Distance is flash-to-subject, not camera-to-subject unless declared identical.

**Feedback.** Square the distance ratio, then convert to stops.

**Examples.**

1. 2 m → 4 m → `−2 stops`. L1.
2. 4 m → 2 m → `+2 stops`. L1.
3. To lose 1 stop, multiply distance by `√2≈1.414`. L3.

**Validation/coverage.** Inverse-square/stop identity and both directions.

### Family `guide_number_aperture`

**Task.** Calculate aperture from direct-flash guide number and distance.

**Response/template.** f-number: `GN={GN} {unit} at ISO {iso}; distance={d}. Find N.`

**Derivation.** Adjust GN for declared ISO when necessary, then `N=GN/d`.

**Difficulty.** L1 ISO 100; L2 nearest aperture; L3 ISO adjustment; L4 feasibility limits.

**Misconceptions/constraints.** Units match and direct bare-flash model shown.

**Feedback.** Confirm guide-number unit, divide by distance, then apply dial rule.

**Examples.**

1. GN 40 m, distance 5 m at ISO 100 → `f/8`. L1.
2. GN 32 m, distance 8 m → `f/4`. L1.
3. Computed f/2 but lens maximum is f/2.8 → no feasible aperture under fixed conditions. L3.

**Validation/coverage.** Guide-number product and capability checks.

### Family `guide_number_distance`

**Task.** Calculate maximum modeled direct-flash distance for an aperture.

**Response/template.** Distance: `GN={GN}, aperture={N}. Find distance.`

**Derivation.** `d=GN/N`.

**Difficulty.** L1 direct; L2 ISO-adjusted; L3 unit conversion; L4 compare apertures.

**Misconceptions/constraints.** “Maximum” is only within the declared target/calibration model.

**Feedback.** Divide guide number by f-number and retain GN units.

**Examples.**

1. GN 36 m at f/4 → `9 m`. L1.
2. GN 24 ft at f/8 → `3 ft`. L1.
3. Opening f/8 to f/4 doubles modeled distance, because GN is fixed. L2.

**Validation/coverage.** Product round-trip and unit integrity.

### Family `guide_number_iso_scale`

**Task.** Scale guide number under the declared ISO rating model.

**Response/template.** Guide number/ratio: `GN100={GN}; find GN at ISO {iso}.`

**Derivation.** `GN_ISO=GN100√(ISO/100)`.

**Difficulty.** L1 fourfold ISO; L2 doubling; L3 inverse ISO; L4 explain physical-light distinction.

**Misconceptions/constraints.** State that ISO changes the rating/brightness target, not emitted flash energy.

**Feedback.** Take the square root of the ISO ratio.

**Examples.**

1. GN100 40, ISO 400 → GN `80`. L1.
2. GN100 40, ISO 200 → `≈56.6`. L2.
3. Doubling ISO does not double GN; it multiplies GN by `√2`. L2.

**Validation/coverage.** Square-root scaling and inverse check.

### Family `flash_power_stops`

**Task.** Convert ideal manual-flash power fractions to illumination stops and guide-number ratios.

**Response/template.** Stops and/or GN factor.

**Derivation.** Illumination stops `log₂(P₂/P₁)`; GN factor `√(P₂/P₁)`.

**Difficulty.** L1 half power; L2 multiple steps; L3 missing fraction; L4 combine distance.

**Misconceptions/constraints.** Power labels follow displayed convention; flash duration behavior is not inferred.

**Feedback.** Separate illumination factor from distance/guide-number factor.

**Examples.**

1. Full → 1/2 power → `−1 stop`, GN factor `1/√2`. L1.
2. Full → 1/8 power → `−3 stops`, GN factor `1/√8`. L2.
3. Quarter power and half distance: `−2+2=0 stops` at subject under ideal model. L3.

**Validation/coverage.** Power/stop/GN identity and combined inverse-square control.

### Family `ambient_flash_control`

**Task.** Predict which modeled ambient and flash components change when a setting changes below sync speed.

**Response/template.** Two-column stop ledger or controlled choice.

**Derivation.** Apply the normative model: shutter to ambient only; aperture/ISO brightness to both; flash power/distance to flash only.

**Difficulty.** L1 one control; L2 compensate one component; L3 several controls; L4 maintain total while changing ratio.

**Misconceptions/constraints.** Instantaneous flash, fixed scene, below-sync operation, and no auto-TTL are explicit.

**Feedback.** Show ambient and flash ledgers separately.

**Examples.**

1. Shutter `1/125→1/60 s` → ambient `+1 stop`, flash `0`. L1.
2. Close aperture one stop → ambient `−1`, flash `−1`. L1.
3. Close aperture one stop and double flash power → ambient `−1`, flash net `0`. L2.

**Validation/coverage.** Component-wise exposure simulation and control provenance.

### Family `flash_sync_validity`

**Task.** Decide whether a shutter/mode combination is valid under a supplied synchronization table.

**Response/template.** Valid/invalid or required mode.

**Derivation.** Compare shutter time with declared maximum-sync threshold and mode capabilities/losses.

**Difficulty.** L1 threshold; L2 HSS option; L3 HSS loss; L4 choose feasible tuple.

**Misconceptions/constraints.** No universal sync speed. Mechanical/electronic curtain details are abstracted.

**Feedback.** Place setting on the declared mode/threshold table.

**Examples.**

1. Maximum ordinary sync `1/200 s`; `1/125 s` → valid ordinary sync. L1.
2. Same limit; `1/250 s` without HSS → invalid. L1.
3. HSS permits `1/1000 s` but supplied output loss is 2 stops → validity does not mean unchanged flash reach. L3.

**Validation/coverage.** Threshold boundaries, mode flag, and loss propagation.

### Family `nd_filter_compensation`

**Task.** Compensate a neutral-density filter with shutter/aperture/ISO under a named invariant.

**Response/template.** New setting or stop ledger.

**Derivation.** Subtract filter loss from `ΔH`; offset with declared controls.

**Difficulty.** L1 shutter only; L2 aperture; L3 combine filters; L4 camera-limit infeasibility.

**Misconceptions/constraints.** Filter convention/loss is shown. Physical-exposure and equal-brightness variants remain distinct.

**Feedback.** Add filter as a negative row in the stop ledger.

**Examples.**

1. Add 3-stop ND at `1/125 s`; shutter-only compensation → about `1/15 s` nominal. L1.
2. Add 6-stop ND at `1/125 s` → about `1/2 s` nominal. L2.
3. Stack 2- and 3-stop filters → 5-stop loss, because losses add and transmissions multiply. L2.

**Validation/coverage.** Filter-transmission and setting-ledger agreement.

### Family `polarizer_malus_law`

**Task.** Calculate ideal transmitted intensity through a polarizer pair or compare orientations.

**Response/template.** Fraction/stops/order: `Relative angle {theta}; find I/I0=cos²θ.`

**Derivation.** Use `cos²θ`; convert positive transmission to stops if requested.

**Difficulty.** L1 0°/45°; L2 arbitrary; L3 solve angle among candidates; L4 distinguish ideal law from real photographic effect.

**Misconceptions/constraints.** Stops are not requested at zero transmission. Real reflection/glare reduction is not guaranteed.

**Feedback.** Square cosine after degree conversion and state idealization.

**Examples.**

1. Relative angle 0° → transmission `1`. L1.
2. Relative angle 45° → transmission `0.5`, a 1-stop loss. L1.
3. Relative angle 90° → ideal transmission `0`; finite stop loss is undefined/infinite in the ideal model. L3.

**Validation/coverage.** Trigonometric identity, symmetry, and zero special case.

### Cross-family progression

Inverse-square ratios precede stop form. Guide-number aperture/distance then provide direct photographic application, followed by ISO-rating and power distinctions. Ambient/flash ledgers and synchronization prevent one-control folklore. Neutral-density and polarizer families close with transmission reasoning while explicitly limiting claims about real modifiers and reflections.

## 9. Category: Color Temperature, White Balance, and Channels

### Category purpose

Train bounded numerical reasoning about correlated color temperature, reciprocal-temperature shifts, linear channel balance, additive RGB, channel-dependent filters, and the limits of global white balance.

### Learn

Correlated color temperature (CCT) is a one-dimensional descriptor in kelvin for light near the black-body locus; it does not fully describe a spectrum. Reciprocal megakelvin, often called mired, is `10⁶/K` and makes many correction shifts easier to compare. In the app's linear RGB model, white balance multiplies channels by declared gains. A neutral target has equal balanced channel values, but one global gain set cannot generally neutralize regions lit by different chromatic illuminants.

### Prerequisites

Ratios, reciprocal values, channel histograms, clipping, and filter transmittance.

### Category boundaries

This is a synthetic linear-RGB practice model. It excludes color-management profiles, chromatic adaptation transforms, spectral reconstruction, color-rendering indexes, gamut mapping, perceptual color-difference formulas, demosaicing, skin-tone prescriptions, and aesthetic color grading.

### Subcategories

1. Kelvin and reciprocal-temperature scales
2. Linear white-balance gains
3. Additive channels and color filters
4. Clipping, mixed illumination, and claim limits

### Common misconceptions

- Treating kelvin as a linear “warmth” control for correction differences.
- Assuming CCT uniquely determines a light's spectrum or color rendering.
- Adding white-balance gains instead of multiplying channel values.
- Believing white balance changes photons already recorded in a raw capture.
- Ignoring clipping introduced by channel gains.
- Assuming one global balance can neutralize two different illuminants.
- Confusing additive RGB mixing with paint/pigment mixing.

### Normative color model

- Synthetic channel values are non-negative linear `R,G,B` quantities in a displayed abstract RGB space.
- White balance applies component-wise gains:

  ```text
  (R',G',B') = (g_R R, g_G G, g_B B)
  ```

- A supplied neutral target is balanced when its output channels are equal within the declared tolerance.
- Gains may be normalized to green gain 1, maximum gain 1, or another displayed target. Equivalent gain vectors differing only by common scale are accepted only when overall brightness is irrelevant.
- Channel filtering applies transmittance vector `(q_R,q_G,q_B)` before subsequent gain/clipping steps.
- Additive RGB values sum component-wise and clip only at the declared pipeline stage.
- `mired=10⁶/K`. A shift from source `K₁` to target `K₂` is defined as `10⁶/K₂−10⁶/K₁`; the sign convention is shown.
- Raw values remain unchanged by metadata-only white-balance selection. A rendered pipeline may apply gains to those raw-derived channel values.

### Family `cct_mired_convert`

**Task.** Convert a positive correlated color temperature between kelvin and mired.

**Response/template.** Kelvin/mired numeric field: `Convert {K} K to mired using 10⁶/K.`

**Derivation.** `M=10⁶/K`; inverse `K=10⁶/M`.

**Difficulty.** L1 friendly; L2 decimal; L3 inverse; L4 compare equal kelvin versus equal mired intervals.

**Misconceptions/constraints.** Positive temperatures only; CCT remains a descriptor, not a complete spectrum.

**Feedback.** Show reciprocal operation and units.

**Examples.**

1. 5000 K → `200 mired`. L1.
2. 2500 K → `400 mired`. L1.
3. 153.85 mired → approximately `6500 K`. L2.

**Validation/coverage.** Reciprocal round-trip and tolerance at rounded displays.

### Family `cct_mired_shift`

**Task.** Calculate the signed reciprocal-temperature correction between two declared CCTs.

**Response/template.** Signed mired shift: `Using target minus source, find the shift from {K1} K to {K2} K.`

**Derivation.** `ΔM=10⁶/K₂−10⁶/K₁`.

**Difficulty.** L1 friendly; L2 sign; L3 compare filters; L4 solve target temperature.

**Misconceptions/constraints.** Direction convention is repeated in prompt; do not subtract kelvin values as a substitute.

**Feedback.** Convert both endpoints to reciprocal scale, then subtract.

**Examples.**

1. 5000 K → 2500 K → `400−200=+200 mired`. L1.
2. 3200 K → 5600 K → `178.57−312.5≈−133.93 mired`. L2.
3. Equal 1000 K differences at low and high CCT do not produce equal mired shifts. L3.

**Validation/coverage.** Endpoint conversion and reverse-shift identity.

### Family `cct_order_and_scope`

**Task.** Order declared CCTs and select only claims supported by CCT.

**Response/template.** Ordered sequence or controlled claim.

**Derivation.** Compare kelvin values; under the displayed simplified convention, lower CCT is described as warmer/redder and higher as cooler/bluer.

**Difficulty.** L1 order; L2 match mired inverse order; L3 claim scope; L4 non-black-body/unknown case.

**Misconceptions/constraints.** Never infer spectrum, color-rendering quality, exposure, or artistic suitability from CCT alone.

**Feedback.** Separate ordering convention from unsupported spectral claims.

**Examples.**

1. 3000 K is lower and conventionally warmer than 6500 K. L1.
2. 3000 K has a larger mired value than 6500 K because the scale is reciprocal. L2.
3. Two lights labeled 5000 K need not have identical spectra or render colors identically. L3.

**Validation/coverage.** Numeric order plus supported/undetermined claim truth table.

### Family `white_balance_gains`

**Task.** Solve component gains that map a measured neutral patch to a declared common target.

**Response/template.** Three named gain fields: `Patch {R,G,B}; target each channel {T}. Find gains.`

**Derivation.** `g_i=T/C_i` for positive patch channels.

**Difficulty.** L1 friendly ratios; L2 normalize one gain; L3 equivalent common-scale gains; L4 bounded gain feasibility.

**Misconceptions/constraints.** Patch channels must be positive; target/normalization and clipping limits are explicit.

**Feedback.** Divide target by each measured channel separately.

**Examples.**

1. Patch `(0.5,1,2)`, target 1 → gains `(2,1,0.5)`. L1.
2. Patch `(100,80,50)`, target 80 → gains `(0.8,1,1.6)`. L2.
3. If maximum allowed gain is 2 but blue requires 2.5, the declared gain set is infeasible. L3.

**Validation/coverage.** Apply gains and verify channel equality/limits.

### Family `neutral_patch_after_balance`

**Task.** Apply supplied channel gains and determine whether a target becomes neutral.

**Response/template.** Balanced channel tuple plus neutral/not neutral.

**Derivation.** Multiply component-wise and compare channels within declared tolerance.

**Difficulty.** L1 exact; L2 approximate tolerance; L3 include exposure scale; L4 identify residual channel.

**Misconceptions/constraints.** Gains are multiplicative. Common scaling preserves neutrality but changes brightness.

**Feedback.** Show each input×gain product.

**Examples.**

1. `(100,80,50)` with gains `(0.8,1,1.6)` → `(80,80,80)`, neutral. L1.
2. `(50,50,50)` with gains `(2,1,1)` → `(100,50,50)`, not neutral; red is high. L1.
3. `(99,100,101)` with tolerance ±2 around the mean → neutral under the declared criterion. L2.

**Validation/coverage.** Component product and tolerance-boundary checks.

### Family `additive_rgb_mix`

**Task.** Combine synthetic linear RGB light contributions before clipping.

**Response/template.** RGB tuple or named additive result.

**Derivation.** Sum channels component-wise, then apply declared normalization/clipping.

**Difficulty.** L1 primary pairs; L2 numeric contributions; L3 clipping; L4 solve missing contribution.

**Misconceptions/constraints.** This is additive light, not subtractive pigment mixing.

**Feedback.** Add R, G, and B columns independently.

**Examples.**

1. `(1,0,0)+(0,1,0)` → `(1,1,0)`, labeled yellow in the displayed RGB convention. L1.
2. `(0.2,0.3,0.4)+(0.1,0.2,0.1)` → `(0.3,0.5,0.5)`. L2.
3. At clip 1, `(0.7,0.6,0.2)+(0.6,0.1,0.3)` → unclipped `(1.3,0.7,0.5)`, rendered `(1,0.7,0.5)` with red clipped. L3.

**Validation/coverage.** Exact vector addition and clipping-stage checks.

### Family `color_filter_channels`

**Task.** Apply a channel-dependent transmittance filter and compare color/brightness consequences.

**Response/template.** RGB tuple, channel ratio, or stop loss per channel.

**Derivation.** Multiply `(R,G,B)` by `(q_R,q_G,q_B)`; optionally use `-log₂q_i`.

**Difficulty.** L1 one attenuated channel; L2 all channels; L3 stacked filters; L4 compensate gains.

**Misconceptions/constraints.** Transmittances lie in `[0,1]`; stacked transmittances multiply per channel.

**Feedback.** Show a channel-by-channel transmittance table.

**Examples.**

1. Input `(1,1,1)`, filter `(1,0.5,0.5)` → `(1,0.5,0.5)`. L1.
2. Blue transmittance 0.25 → blue loses `2 stops`. L2.
3. Filters `(1,0.5,1)` and `(0.5,1,1)` stack to `(0.5,0.5,1)`. L2.

**Validation/coverage.** Vector multiplication, stop round-trip, and stacked-filter identity.

### Family `white_balance_channel_clipping`

**Task.** Determine clipping introduced by white-balance gains in a declared render pipeline.

**Response/template.** Output tuple and clipped channel set.

**Derivation.** Apply gains to raw-derived linear values, compare each to clip threshold, then clamp for displayed output.

**Difficulty.** L1 one channel; L2 several pixels; L3 combine exposure; L4 choose non-clipping common scale.

**Misconceptions/constraints.** Distinguish raw sample saturation from gain-stage rendered clipping.

**Feedback.** Show raw, gain, pre-clamp, and output columns.

**Examples.**

1. Raw `(100,120,160)`, gains `(2,1,1)`, clip 255 → output `(200,120,160)`, no clipping. L1.
2. Raw `(180,150,100)`, gains `(1.5,1,2)`, clip 255 → red pre-clamp 270 clips; blue 200 does not. L2.
3. Lowering every gain by the same factor can avoid render clipping while preserving balance ratios, at lower output brightness. L3.

**Validation/coverage.** Stage-specific clipping and common-scale invariance.

### Family `mixed_illuminant_global_balance`

**Task.** Decide whether one global channel-gain vector can neutralize multiple neutral targets under different synthetic illumination.

**Response/template.** Yes/no plus gain vector or conflicting channel ratio.

**Derivation.** Normalize each target's RGB vector by a reference channel; one global diagonal gain works only when their channel ratios are proportional within tolerance.

**Difficulty.** L1 identical ratios; L2 conflicting ratios; L3 tolerance; L4 choose region-specific alternative from supplied options.

**Misconceptions/constraints.** No local masks or spectral transforms unless offered as separate modeled alternatives.

**Feedback.** Compare normalized channel ratios before solving gains.

**Examples.**

1. Patches `(1,1,2)` and `(2,2,4)` have the same ratios → one global gain can neutralize both. L1.
2. Patches `(1,1,2)` and `(2,1,1)` have conflicting ratios → no single global diagonal gain neutralizes both. L2.
3. Making one patch neutral may leave a residual cast in the other; this is not an arithmetic failure. L3.

**Validation/coverage.** Proportional-vector test with exact and tolerance cases.

### Family `raw_white_balance_claim_audit`

**Task.** Audit a claim about white balance, raw photons, rendered channels, or CCT.

**Response/template.** Supported/false/undetermined plus corrected statement.

**Derivation.** Evaluate claim against stored raw values, metadata, gain stage, illuminant ratios, and clipping.

**Difficulty.** L1 metadata/raw distinction; L2 gain/clipping; L3 mixed light; L4 CCT overclaim.

**Misconceptions/constraints.** Distractors say WB changes captured photons, repairs raw clipping, or completely describes a light spectrum.

**Feedback.** Identify capture-stage facts separately from rendering-stage transformations.

**Examples.**

1. Changing metadata-only WB after capture does not alter already recorded raw photon counts. L1.
2. Render gains can clip a channel that was not saturated in raw-derived values. L2.
3. “Both lights are 5000 K, so their spectra and color rendering are identical” → unsupported. L3.

**Validation/coverage.** Pipeline-stage claim truth table with correct controls.

### Cross-family progression

Kelvin/mired conversion and shift establish the reciprocal scale before qualitative ordering. Gain solving precedes neutral-patch verification and additive/channel filtering. Clipping makes balance a pipeline operation rather than a magic correction. Mixed-illuminant and claim-audit families cap the category by preserving cases that no single global balance can solve.

## 10. Category: Digital Sampling, Noise, and Output

### Category purpose

Connect sensor dimensions and pixel counts to pitch, cropping, print sampling, data representation, photon statistics, read noise, and idealized dynamic range.

### Learn

Pixel dimensions determine sample count; physical sensor size determines pixel pitch. Cropping removes samples, while resizing creates new interpolated samples and does not restore captured detail. Bit depth counts code values but does not by itself establish dynamic range. Photon arrivals have shot noise proportional to the square root of the signal, and independent read noise combines in quadrature. Raising ISO at fixed aperture/shutter does not increase captured photons.

### Prerequisites

Area, unit conversion, powers of two, square roots, logarithms, and the physical-exposure/ISO distinction.

### Category boundaries

Use ideal monochrome/photoelectron models or explicitly declared per-channel data. Demosaicing, color-filter-array layout, compression quality, sharpening, denoising, stacking statistics beyond simple independent averages, and proprietary sensor modes are excluded.

### Subcategories

1. Pixel geometry and output sampling
2. Bit depth and data size
3. Photon/read noise
4. Dynamic range and ISO claims

### Common misconceptions

- Adding width and height to get pixel count.
- Calling a 50% linear crop “half the pixels.”
- Confusing PPI with physical sensor pixel pitch or printer dot placement.
- Assuming more bit depth guarantees more dynamic range.
- Treating shot noise as a fixed amount independent of signal.
- Adding independent noise standard deviations directly.
- Saying ISO raises the number of photons collected at fixed aperture/shutter.
- Treating a single ideal DR number as a complete image-quality ranking.

### Family `pixel_dimensions_megapixels`

**Task.** Convert pixel dimensions to total samples/megapixels or solve a missing dimension.

**Response/template.** Integer/decimal count: `An image is {W}×{H} pixels. How many megapixels?`

**Derivation.** `pixels=W×H`; decimal megapixels divide by 1,000,000.

**Difficulty.** L1 direct; L2 missing dimension; L3 compare aspect ratios; L4 rounded marketing label bounds.

**Misconceptions/constraints.** Decimal MP convention is stated; binary mebibytes are unrelated.

**Feedback.** Multiply dimensions and show division by one million.

**Examples.**

1. 6000×4000 → 24,000,000 pixels = `24 MP`. L1.
2. 12 MP at 4000-pixel width and 3000-pixel height → dimensions agree. L1.
3. A label “about 20 MP” cannot determine exact dimensions without an aspect ratio or one dimension. L3.

**Validation/coverage.** Integer product/inverse and rounding-interval checks.

### Family `pixel_pitch`

**Task.** Compute pixel pitch from sensor length and sample count, or invert the relationship.

**Response/template.** Length/count: `Sensor width {d} spans {W} pixels. Find pitch.`

**Derivation.** `pitch=d/W`; convert mm to µm as requested.

**Difficulty.** L1 direct; L2 unit conversion; L3 compare axes/sensors; L4 solve pixel dimension.

**Misconceptions/constraints.** Use the matching physical and pixel dimension; no assumption of square pixels unless stated.

**Feedback.** Align width with width or height with height before division.

**Examples.**

1. 36 mm across 6000 pixels → `6 µm`. L1.
2. 24 mm across 4000 pixels → also `6 µm`. L1.
3. Width pitch 4 µm and height pitch 5 µm means pixels are not square under the supplied geometry. L3.

**Validation/coverage.** Unit-aware ratio and axis consistency.

### Family `print_resolution_ppi`

**Task.** Calculate print PPI or maximum print dimensions at a declared PPI.

**Response/template.** PPI or width/height in inches/cm.

**Derivation.** `PPI=pixels/inches`; preserve aspect ratio unless a crop is declared.

**Difficulty.** L1 one dimension; L2 both; L3 cm conversion; L4 choose among crop/size options.

**Misconceptions/constraints.** Use PPI for image sampling; do not conflate with printer hardware DPI.

**Feedback.** Divide matching pixel and physical dimensions.

**Examples.**

1. 6000 pixels printed 20 inches wide → `300 PPI`. L1.
2. 6000×4000 at 300 PPI → `20×13.33 inches`. L2.
3. 30 cm is about 11.81 inches; 3543 pixels across gives about 300 PPI. L3.

**Validation/coverage.** Dimension round-trip, aspect ratio, and unit conversion.

### Family `crop_remaining_resolution`

**Task.** Compute remaining pixel dimensions/fraction after an exact crop.

**Response/template.** Dimensions, MP, or percentage.

**Derivation.** Apply crop bounds or linear fractions; total retained fraction is width fraction times height fraction.

**Difficulty.** L1 explicit dimensions; L2 equal linear crop; L3 offset crop; L4 minimum-output constraint.

**Misconceptions/constraints.** No resizing unless explicitly separate.

**Feedback.** Calculate retained width and height before area/sample fraction.

**Examples.**

1. 6000×4000 cropped to 3000×2000 → 6 MP, `25%` of original pixels. L1.
2. Retain 80% width and 80% height → `64%` of pixels. L2.
3. A crop can preserve pixel pitch while reducing field of view and total samples. L2.

**Validation/coverage.** Rectangle containment and exact pixel-count ratio.

### Family `bit_depth_code_levels`

**Task.** Compute code-value count for a bit depth or compare per-channel combinations.

**Response/template.** Integer levels/combinations: `{bits}-bit {channelModel}: how many values?`

**Derivation.** Per channel `2^b`; for independent `c` channels, combinations `2^(bc)` when requested.

**Difficulty.** L1 per-channel; L2 RGB combinations; L3 missing bits; L4 distinguish levels from DR.

**Misconceptions/constraints.** Code levels include zero; do not claim all combinations are distinguishable or used.

**Feedback.** Expand powers of two and label per-channel versus combined.

**Examples.**

1. 12-bit channel → `4096` code values. L1.
2. Three independent 8-bit channels → `256³=16,777,216` possible code triples. L2.
3. 14-bit encoding does not by itself prove 14 stops of usable dynamic range. L3.

**Validation/coverage.** Integer power/inverse-log checks and claim controls.

### Family `uncompressed_image_size`

**Task.** Compute ideal packed uncompressed image data size from samples, channels, and bits.

**Response/template.** Bits/bytes/MB: `Image {W}×{H}, {channels}, {bits} bits each, tightly packed. Find size.`

**Derivation.** `bits=W×H×channels×bitsPerSample`; divide by 8 and displayed decimal/binary unit.

**Difficulty.** L1 byte-aligned; L2 packed 12/14 bit; L3 RGB; L4 solve capacity/frame count.

**Misconceptions/constraints.** No headers, padding, metadata, or compression unless supplied.

**Feedback.** Multiply samples, channels, and bits, then convert units.

**Examples.**

1. 6000×4000, one 12-bit packed sample/pixel → 288,000,000 bits = `36 MB` decimal. L2.
2. 6000×4000 RGB, 8 bits/channel → `72 MB` decimal. L1.
3. A real file may differ because packing, metadata, compression, and previews are excluded. L3.

**Validation/coverage.** Exact integer bit count and unit-mode round-trip.

### Family `photon_shot_noise`

**Task.** Compute shot-noise standard deviation or shot-noise-limited SNR.

**Response/template.** Electrons/SNR: `Expected signal P={P} electrons. Find √P and P/√P.`

**Derivation.** `σ_shot=√P`; `SNR=√P` for `P>0`.

**Difficulty.** L1 perfect squares; L2 decimal; L3 compare exposure changes; L4 solve photons for target SNR.

**Misconceptions/constraints.** Poisson ideal stated; SNR is linear, not dB unless conversion supplied.

**Feedback.** Distinguish absolute noise growth from relative SNR improvement.

**Examples.**

1. `P=10,000 e⁻` → noise `100 e⁻`, SNR `100`. L1.
2. Four times the photons doubles shot-noise-limited SNR. L2.
3. Target shot-noise SNR 50 requires `P=2500 e⁻`. L2.

**Validation/coverage.** Square/root inverse and exposure-scaling identities.

### Family `read_noise_snr`

**Task.** Compute simplified total noise and SNR with independent read noise.

**Response/template.** Noise/SNR: `P={P}, R={R} e⁻ RMS. Find SNR=P/√(P+R²).`

**Derivation.** Add shot-noise variance `P` and read-noise variance `R²`, take root, divide signal.

**Difficulty.** L1 direct; L2 compare read-noise values; L3 solve dominant regime; L4 multiple captures under supplied independence.

**Misconceptions/constraints.** Do not add standard deviations directly. Dark current/quantization absent unless stated.

**Feedback.** Show the variance ledger before the square root.

**Examples.**

1. `P=100`, `R=5` → total noise `√125≈11.18`, SNR `≈8.94`. L1.
2. At very high `P`, shot noise dominates a fixed small `R`. L2.
3. At `P=4`, `R=10`, read noise dominates; SNR is far below the shot-only value 2. L2.

**Validation/coverage.** Independent variance calculation and limiting-case tests.

### Family `ideal_sensor_dynamic_range`

**Task.** Calculate or compare idealized dynamic range from full well and noise floor.

**Response/template.** Stops: `Full well {F}; noise floor {n}. Find log₂(F/n).`

**Derivation.** Divide positive values in the same electron units and take `log₂`.

**Difficulty.** L1 power-of-two ratio; L2 decimal; L3 solve required full well/noise; L4 compare sensors at different criteria.

**Misconceptions/constraints.** Noise-floor definition is supplied and consistent. Do not infer color/image quality.

**Feedback.** Show usable ratio, then stops.

**Examples.**

1. Full well 32,768 e⁻, floor 2 e⁻ → `14 stops`. L1.
2. 60,000 e⁻ / 3 e⁻ → `log₂20,000≈14.29 stops`. L2.
3. Halving noise floor adds 1 ideal stop if full well is unchanged. L2.

**Validation/coverage.** Ratio/log round-trip and criteria-label comparison.

### Family `iso_photon_claim_audit`

**Task.** Audit a claim about ISO, captured photons, code values, noise, or headroom.

**Response/template.** Supported/false/depends-on-model plus reason.

**Derivation.** Hold scene/aperture/shutter fixed, preserve `H` and `P`, then apply only supplied ISO gain/read-noise/clipping behavior.

**Difficulty.** L1 photon invariant; L2 code shift; L3 read-noise model; L4 equal-brightness settings with different `H`.

**Misconceptions/constraints.** Distractors say ISO creates light, always adds noise, or never affects raw data. Real ISO behavior is not inferred without parameters.

**Feedback.** Use separate photon, analog/read-noise, code, and clipping rows.

**Examples.**

1. Same scene, f/4, 1/125 s; ISO 100→800 → modeled captured photons unchanged. L1.
2. Under a supplied linear gain model, raw code values rise 3 stops and highlight code headroom falls, absent clipping. L2.
3. “Higher ISO always increases total noise by exactly one stop” → unsupported without the sensor/read-noise pipeline. L3.

**Validation/coverage.** Claim truth table across fixed-exposure and equal-brightness constructions.

### Cross-family progression

Pixel count and pitch precede crop and output PPI so physical sampling dimensions stay distinct. Bit depth and packed size then train representation without making quality claims. Shot noise precedes read-noise quadrature and dynamic range. ISO audits integrate the exposure distinction and require the learner to say which part of the capture pipeline changes.

## 11. Category: Integrated Capture Planning and Audits

### Category purpose

Coordinate exposure, focus, motion, framing, illumination, and sensor constraints and diagnose otherwise plausible photographic explanations.

### Learn

There is rarely one universally best setting. A well-formed problem supplies a goal, hard limits, and an optimization rule. Filter infeasible settings first, then compare the surviving tuples using the named objective. When auditing, recompute each consequence from the semantic scene and identify the first incorrect assumption rather than blaming every downstream value.

### Prerequisites

All earlier categories as required by the selected scenario.

### Category boundaries

Plans are for fictional benign scenes and exact model constraints. The app does not grade aesthetics, recommend real-world risky behavior, or claim that a passing tuple guarantees a successful photograph.

### Subcategories

1. Constraint-based setting selection
2. Tradeoff comparison
3. Multi-domain audits
4. Multi-frame planning

### Common misconceptions

- Optimizing before checking feasibility.
- Treating equal brightness as equal physical exposure or noise.
- Changing aperture for DOF without accounting for exposure.
- Applying stabilization to moving-subject blur.
- Attributing viewpoint perspective to focal length alone.
- Treating every soft image as a focus error.
- Repairing a downstream number without correcting the root assumption.
- Choosing one solution when several tie under the stated objective.

### Family `settings_constraint_select`

**Task.** Select every camera-setting tuple satisfying explicit exposure, brightness, motion, DOF, and capability constraints.

**Response/template.** Multiple-choice setting tuples or structured tuple builder.

**Derivation.** Enumerate bounded candidates; compute all metrics; filter by hard predicates; apply no preference unless specified.

**Difficulty.** L1 two controls/one constraint; L2 several; L3 coupled constraints; L4 multiple/none.

**Misconceptions/constraints.** At most 12 candidates; each rejected tuple has a named first failing predicate.

**Feedback.** Feasibility table with one row per constraint.

**Examples.**

1. Need `t≤1/250 s` and f/4; candidates ISO 100/200/400 with target brightness requiring ISO 400 → ISO 400 tuple only. L1.
2. Two tuples satisfy every hard constraint → both accepted if no optimizer is stated. L2.
3. Required f/8 and `1/1000 s` exceed available ISO/flash brightness limit → no feasible tuple. L3.

**Validation/coverage.** Exhaustive candidate oracle and witness/failure reason.

### Family `capture_tradeoff_compare`

**Task.** Compare feasible captures on named metrics without inventing a universal ranking.

**Response/template.** Metric table/order/Pareto set.

**Derivation.** Compute physical exposure, modeled brightness, DOF, motion blur, diffraction ratio, and noise metrics requested; apply lexicographic/weighted/Pareto rule.

**Difficulty.** L1 one metric; L2 two; L3 Pareto; L4 weighted score with supplied units.

**Misconceptions/constraints.** Every objective is displayed. Avoid subjective labels such as “better image.”

**Feedback.** Show metric differences before applying the decision rule.

**Examples.**

1. Equal brightness: tuple A has 2 stops more physical exposure than B → A has four times modeled photons. L1.
2. A has less motion blur but shallower DOF; neither dominates when both goals matter and no weights are given. L2.
3. “Minimize blur, then maximize physical exposure” uses lexicographic order, not an average of unlike units. L3.

**Validation/coverage.** Independent metric solvers and objective evaluator.

### Family `depth_motion_joint_plan`

**Task.** Adjust aperture and shutter jointly to meet DOF and motion constraints while preserving a declared brightness target.

**Response/template.** Setting tuple(s).

**Derivation.** Determine aperture candidates meeting DOF, shutter candidates meeting blur, then solve ISO/illumination compensation and limits.

**Difficulty.** L1 one-stop aperture compensation; L2 thresholds; L3 ISO/noise comparison; L4 infeasible/tied plans.

**Misconceptions/constraints.** DOF and motion use independent models; do not use ISO to fix physical motion exposure.

**Feedback.** Solve depth and motion constraints before brightness ledger.

**Examples.**

1. Closing aperture one stop for DOF while keeping shutter fixed requires ISO +1 stop for equal modeled brightness. L1.
2. Lengthening shutter to compensate aperture fails a supplied moving-subject blur limit; use another allowed control or report infeasible. L2.
3. Two plans meet depth/motion/brightness but differ in photons/noise; preserve both unless a noise objective is stated. L3.

**Validation/coverage.** Cross-product candidate enumeration and all-predicate verification.

### Family `exposure_equivalence_audit`

**Task.** Audit a claim that two setting tuples are “equivalent.”

**Response/template.** Equivalent in physical exposure, modeled brightness, both, or neither; include stop differences.

**Derivation.** Independently compute `ΔH` and `ΔB`.

**Difficulty.** L1 aperture/shutter; L2 ISO; L3 filters/transmission; L4 flash/ambient component equivalence.

**Misconceptions/constraints.** The response cannot use bare “equivalent” without naming quantity.

**Feedback.** Two-ledger comparison with physical light and brightness.

**Examples.**

1. f/4 at 1/250 and f/5.6 at 1/125, same ISO → equal physical exposure and modeled brightness. L1.
2. f/4, 1/250, ISO 200 versus f/4, 1/125, ISO 100 → equal modeled brightness, but second has +1 stop physical exposure. L2.
3. Equal ambient brightness does not imply equal flash contribution when flash power/distance changed. L3.

**Validation/coverage.** Exact ledger identities and component-aware variants.

### Family `focal_perspective_audit`

**Task.** Diagnose a framing/perspective explanation involving focal length, crop, and viewpoint.

**Response/template.** Correct/incorrect root claim plus repaired statement.

**Derivation.** Reconstruct viewpoints, object distances, AOV/crop, and relative projected sizes.

**Difficulty.** L1 same viewpoint crop; L2 move/reframe; L3 mixed sensor size; L4 insufficient metadata.

**Misconceptions/constraints.** Distractors assign perspective change to focal length alone or say crop changes physical focal length.

**Feedback.** Separate field of view, framing, and distance-ratio perspective.

**Examples.**

1. Same lens/viewpoint, center crop → narrower FOV, same perspective in retained region. L1.
2. Move back and use longer focal length to restore subject size → changed viewpoint alters background/subject ratio. L2.
3. Two images with unknown camera positions cannot support a focal-length-only perspective claim. L3.

**Validation/coverage.** Projection geometry and metadata sufficiency truth table.

### Family `blur_source_diagnosis`

**Task.** Identify which declared source or combination explains a generated blur pattern/measurement.

**Response/template.** Source set and evidence.

**Derivation.** Compare semantic blur vectors: uniform angular camera motion, subject-local motion, defocus circle, diffraction disk, and rolling-scan displacement.

**Difficulty.** L1 isolated source; L2 spatial pattern; L3 combined sources; L4 insufficient evidence.

**Misconceptions/constraints.** Defects are generated with separable signatures; ambiguous cases accept “undetermined.”

**Feedback.** Overlay predicted blur location/direction for each candidate source.

**Examples.**

1. Only moving subject is streaked; static background is sharp → subject motion evidence. L1.
2. Every detail shares the same directional streak → camera angular motion is consistent. L2.
3. Uniform softness without direction, focus sweep, or aperture comparison cannot uniquely distinguish defocus from diffraction/other blur. L3.

**Validation/coverage.** Forward-rendered signatures with clean, combined, and ambiguous controls.

### Family `optics_calculation_audit`

**Task.** Find the first invalid equation, unit conversion, sign, or assumption in a worked photographic-optics solution.

**Response/template.** Step ID, defect type, corrected step.

**Derivation.** Replay typed calculation AST with units and model preconditions.

**Difficulty.** L1 arithmetic/sign; L2 unit/f-number; L3 wrong model; L4 downstream cascade.

**Misconceptions/constraints.** Plant one primary defect; downstream consequences are not separate root errors.

**Feedback.** Confirm valid prefix, explain root defect, recompute affected result.

**Examples.**

1. `D=N/f` for entrance pupil → inverted formula; correct `D=f/N`. L1.
2. Hyperfocal uses `f=50 mm` with `s` in metres without conversion → unit defect. L2.
3. Uses reciprocal-focal heuristic as proof of zero blur → assumption/overclaim defect. L3.

**Validation/coverage.** Mutation provenance and repaired-solution recomputation.

### Family `multi_frame_capture_plan`

**Task.** Construct a minimal bracket, focus-stack, or panorama frame set from supplied exact coverage rules.

**Response/template.** Ordered frame tuples.

**Derivation.** Generate candidate frames, compute stop/DOF/angular intervals, and solve exact set/interval coverage with any ordering constraints.

**Difficulty.** L1 one dimension; L2 overlap; L3 combine exposure and focus; L4 tied/infeasible plan.

**Misconceptions/constraints.** At most eight frames. Merging quality, movement artifacts, and real execution are excluded.

**Feedback.** Show each frame's covered interval and the union/gaps.

**Examples.**

1. Required exposure offsets −2 through +2 in 2-stop steps → frames `−2,0,+2`. L1.
2. Focus intervals `[1,2.5]` and `[2,4]` cover required 1–4 m with overlap → both. L2.
3. A panorama plan covers angle but violates declared per-frame focus range → not feasible until both constraint sets pass. L3.

**Validation/coverage.** Exhaustive subset/order solver and minimality witness.

### Cross-family progression

Constraint selection comes before optimization. Tradeoff and joint depth/motion planning then coordinate metrics while preserving multiple valid answers. Equivalence and perspective audits target two foundational language errors. Blur diagnosis and calculation audit separate image evidence from formula provenance. Multi-frame planning integrates interval coverage only after single-frame models are mastered.

## 12. Topic-level progression

### Level 1: Direct photographic relationships

- Count full stops in shutter, aperture, ISO-brightness, and simple filter sequences.
- Read direct meter/histogram facts.
- Compute pupil diameter, basic motion blur, AOV, crop factor, guide number, pixels, and PPI.
- Convert basic CCT/mired values and apply simple channel gains.
- Distinguish physical exposure from modeled brightness when ISO alone changes.

### Level 2: Inversion and controlled comparison

- Construct equivalent settings and apply compensation/EV.
- Compute DOF limits, diffraction, thin-lens magnification, perspective ratios, flash distance, and simple SNR.
- Transform histograms and detect channel clipping.
- Solve neutral-target gains and distinguish raw from rendered white balance.
- Apply supplied stabilization and output criteria without universalizing them.

### Level 3: Coupled constraints and evidence

- Coordinate two or three controls with different physical effects.
- Choose focus/framing/motion settings under declared limits.
- Compare equal-brightness captures by physical exposure and noise model.
- Diagnose perspective, blur, metering, aberration, and unit/model errors.
- Preserve ties, ambiguity, and infeasibility.

### Level 4: Bounded photography lab

- Inspect a complete semantic scene/camera/lens/pipeline.
- Establish the target invariant and hard constraints.
- Construct or compare candidate settings or frame sets.
- Recompute exposure, focus, motion, framing, flash, and sensor consequences.
- Identify one planted root defect or certify the declared invariants.
- State the result with criterion, tolerance, and model limits.

Difficulty rises through coordination and model choice, not through tiny labels, arbitrary camera trivia, or subjective taste.

## 13. Adaptive practice guidance

Track mastery by family, setting representation, nominal/analytical mode, physical quantity, model, and misconception:

- `stop_ratio_reversed`
- `aperture_direction_reversed`
- `f_number_not_squared`
- `iso_creates_photons`
- `equal_brightness_equal_exposure`
- `nominal_exact_mixed`
- `ec_sign_reversed`
- `meter_target_universalized`
- `histogram_spatial_inference`
- `histogram_centered_is_correct`
- `channel_clip_ignored`
- `dof_fixed_fraction`
- `coc_universalized`
- `hyperfocal_unit_mix`
- `smallest_aperture_best`
- `stabilization_freezes_subject`
- `shake_heuristic_guarantee`
- `relative_motion_unsigned`
- `rolling_exposure_equals_scan`
- `crop_changes_focal_length`
- `focal_length_changes_perspective`
- `sensor_axis_mismatch`
- `f_stop_equals_t_stop`
- `focal_lengths_added`
- `distortion_equals_perspective`
- `distance_not_squared`
- `guide_number_unit_mix`
- `shutter_changes_instant_flash`
- `kelvin_used_as_linear_shift`
- `white_balance_changes_raw_photons`
- `channel_gain_clipping_ignored`
- `global_wb_fixes_mixed_light`
- `linear_crop_equals_pixel_fraction`
- `bit_depth_equals_dynamic_range`
- `noise_sd_added`
- `iso_always_adds_noise`

After an error:

- ISO/photon confusion → paired fixed-aperture/shutter question requesting both `ΔH` and `ΔB`.
- Aperture sign error → nominal pupil-area comparison before another equivalent-setting item.
- Nominal/exact mix → show table-index result beside exact ratio.
- Histogram overclaim → same histogram with two different synthetic spatial arrangements.
- DOF-rule memorization → change `c` or focus distance while holding aperture fixed.
- Stabilization error → separate static background and moving subject components.
- Perspective error → same-viewpoint crop control followed by move-and-reframe pair.
- Inverse-square error → request distance ratio, squared factor, then stops in separate fields.
- Noise error → variance ledger before combined SNR.
- Multi-concept failure → issue a one-family diagnostic rather than merely smaller numbers.

Slow but correct stop counting should retain conceptual mastery and schedule shorter fluency repetitions. Input/calculator latency is not mistaken for photographic misunderstanding.

Suggested mixed session:

- 50% current-level families;
- 20% stop/exposure/focus/motion foundations;
- 20% spaced weak-family review;
- 10% inverse/audit/construction.

## 14. Answer checking and worked feedback

### Setting and stop answers

- Nominal aperture/shutter/ISO questions compare versioned table indices.
- Analytical questions retain unrounded numeric values and use displayed tolerance.
- Stop signs are interpreted only under the displayed quantity convention.
- Setting tuples are structured objects, not normalized strings.
- Equal-exposure and equal-brightness predicates are stored separately.

### Units and formulas

- Canonical length is metres internally, with millimetres/µm used exactly for lens/sensor display.
- Canonical time is seconds; fractional shutter strings parse as rationals.
- Angles are converted to radians only inside trig functions.
- Photons/electrons, code values, pixels, stops, EV, f-number, T-number, optical density, dioptres, PPI, and megapixels remain semantically distinct.
- Infinity is a semantic value, not an arbitrarily large number.

### Visual and set-valued answers

- Histogram answers compare semantic bins/counts/channels.
- Clicks on rays, focus zones, sensor rectangles, or setting grids snap to semantic objects.
- Multiple valid setting tuples/frame plans are set-checked.
- “No feasible setting” and “insufficient evidence” are first-class answers only when constructed truthfully.

### Feedback sequence

1. Name the target invariant or model.
2. List givens with units and declared limits.
3. Show a stop ledger, geometry, interval, or noise-variance table.
4. Solve without premature rounding.
5. Check a physical invariant, setting limit, or evidence boundary.
6. State the result and its model limitation.

Examples:

> ISO 100→800 adds 3 stops to the modeled brightness index, but aperture and shutter did not change, so physical sensor exposure changes by 0 stops.

> Closing f/4→f/8 loses 2 stops. Lengthening 1/250→1/60 adds 2 nominal stops, so physical exposure is preserved.

> The histogram proves that 12 samples clipped in the red channel. It cannot show where those pixels occur.

## 15. Rendering, interaction, and accessibility

- Use SVG for camera/lens/ray/framing/DOF diagrams and exact semantic overlays.
- Canvas may render synthetic images/histograms if an equivalent semantic table and text description are present.
- Every image alternative states scene regions, relevant positions, motion directions, focus distances, code ranges, clipping, and requested comparison.
- Color-channel questions use labels/patterns in addition to color.
- Blur direction is shown with arrows and described in text.
- Aperture diagrams expose f-number and pupil diameter numerically.
- Histograms expose bin ranges and counts as a keyboard-navigable table.
- Setting controls support keyboard step movement and announce stop difference from baseline.
- Fractions, `f/`, `µm`, superscripts, and infinity have readable spoken alternatives.
- Zooming the UI must not change semantic sensor, blur, or histogram values.
- Timed fluency is optional and never blocks Learn, calculator, replay, or accessibility modes.
- Synthetic before/after images must not rely on subtle differences below WCAG-visible contrast or the declared render threshold.

No exercise requires camera, file-upload, geolocation, microphone, or network permission.

## 16. Implementation architecture

The initial app is a standalone HTML/CSS/JavaScript page with all generators, models, images, and answer checking local. It does not embed a live camera simulator, external photo library, cloud model, or backend.

Recommended semantic modules:

- seeded PRNG and replay token;
- rational stop/dial-table engine;
- exposure/ISO/filter/EV ledger;
- synthetic scene luminance and meter model;
- raw-linear capture, channel, clipping, and histogram pipeline;
- thin-lens, DOF, defocus, diffraction, and pupil geometry;
- motion/rolling-scan simulator;
- sensor/FOV/crop/perspective projection;
- illumination/flash/filter solver;
- reciprocal-temperature and linear-channel color pipeline;
- pixel/noise/dynamic-range model;
- bounded candidate/interval/set optimizer;
- controlled claim AST and mutation provenance;
- SVG/Canvas renderer plus accessible semantic tables;
- localization-aware quantity and setting parser.

Each instance stores:

```js
{
  seed,
  familyId,
  level,
  modelId,
  scene,
  camera,
  lens,
  sensor,
  settings,
  illumination,
  filters,
  focusModel,
  motionModel,
  capturePipeline,
  assumptions,
  requestedQuantity,
  canonicalAnswer,
  acceptedAnswerSet,
  tolerance,
  misconceptionTags,
  workedSteps,
  visualDescription,
  structuralSignature,
  mutation
}
```

Generators create the semantic scene and settings first. Independent solvers calculate the answer. Rendering consumes the validated semantic instance and is never reverse-read as answer truth.

Developer mode exposes the seed, model constants, stop ledgers, exact/nominal setting indices, ray geometry, DOF intervals, blur components, AOV/crop projection, flash components, histogram samples/bins, color gains/stages, photon/noise ledger, candidate table, mutation lineage, and rejection reason.

## 17. Automated validation requirements

Reject an instance unless:

- all displayed settings exist in the declared table/range;
- nominal dial indices and analytical ratios use the prompt's declared mode;
- physical-exposure and brightness ledgers independently balance;
- ISO-only changes preserve `H` and modeled photon count;
- EV and missing-setting calculations round-trip;
- filter transmissions, optical densities, and stop losses agree;
- meter weights normalize and meter/histogram visuals match semantic samples;
- channel clipping/headroom/dynamic-range claims use the declared pipeline;
- thin-lens values satisfy the reciprocal identity;
- DOF limits are ordered, contain focus distance under the model, and handle infinity correctly;
- defocus and diffraction geometry match rendered scale;
- motion components, pixel conversion, stabilization source, and rolling scan agree;
- AOV, crop, framing, and perspective projections match sensor geometry;
- guide-number units/ISO scaling and flash/ambient ledgers agree;
- mired shifts, channel gains, filter vectors, balance tests, and clipping stages agree;
- bit/sample/data-size calculations are integral where required;
- noise variances and SNR use supplied model parameters;
- candidate settings/frame plans include all valid ties and exclude all failing tuples;
- intentional audit defects have exactly one primary root cause;
- multiple-choice distractors are distinct and correspond to named misconceptions;
- all placeholders, units, accessible descriptions, and worked steps are present.

Independent property tests include:

- `stops→factor→stops` round trips;
- reciprocal aperture/shutter compensation;
- f-number square-law and T-stop transmission equivalence;
- `EV100` forward/inverse identities;
- histogram count conservation before clipping;
- DOF candidate formula versus direct blur-at-boundary criterion within tolerance;
- thin-lens/similar-triangle magnification agreement;
- AOV forward/inverse and crop-equivalent AOV;
- same-viewpoint perspective invariance under crop;
- inverse-square ratio versus flash-distance stops;
- guide-number aperture/distance product;
- CCT/mired and white-balance gain round trips;
- mixed-illuminant proportionality versus global-balance feasibility;
- pixel pitch/resolution/print-size round trips;
- shot-noise and read-noise limiting cases;
- exhaustive bounded setting/frame enumeration versus optimized result;
- semantic visual checksum versus accessible table.

Test suites require:

- golden fixtures for every family and level;
- every full-stop boundary plus representative half/third stops;
- aperture/shutter/ISO increases and decreases;
- exact versus nominal rounded setting cases;
- finite/infinite DOF, focus-boundary, diffraction-threshold, and zero-defocus cases;
- camera/subject/opposed motion and rolling-scan directions;
- horizontal/vertical/diagonal AOV and multiple aspect ratios;
- converging/diverging/zero combined power;
- raw/rendered and single/multiple-channel clipping;
- flash sync boundary, HSS-supplied mode, filter stacks, and zero polarizer transmission;
- CCT/mired endpoints, balanced/unbalanced targets, mixed illuminants, and gain-stage clipping;
- shot-dominated/read-dominated/equal-noise regimes;
- unique/tied/infeasible/insufficient-evidence candidate cases;
- every deliberate mutation with a non-flawed control;
- deterministic replay, locale parsing, and accessibility snapshots.

## 18. Coverage requirements

This specification defines 100 question families:

- 12 exposure/setting families;
- 10 metering/histogram families;
- 11 aperture/focus/diffraction families;
- 9 shutter/motion families;
- 10 focal/sensor/framing families;
- 10 image-formation/optics families;
- 10 flash/filter families;
- 10 color/white-balance families;
- 10 digital-capture families;
- 8 integrated planning/audit families.

The implementation registry must compute and test this inventory.

Across a representative seeded corpus, cover:

- positive, negative, integer, half-, third-, and non-table stop changes;
- nominal dial and analytical numeric modes;
- equal physical exposure, equal modeled brightness, both, and neither;
- aperture, shutter, ISO, filter, transmission, flash power, and distance effects;
- centered/off-center meter weightings and incident/reflected contrasts;
- unclipped, luminance-clipped, and individual-channel-clipped histograms;
- finite/infinite DOF, near/far subjects, defocus, diffraction, and output criteria;
- subject, camera, combined, panned, stabilized, and rolling-scan motion;
- horizontal, vertical, and diagonal sensor dimensions and several aspect ratios;
- same-viewpoint crop and moved-viewpoint reframe controls;
- thin-lens, diopter, T-stop, macro, aberration, distortion, and vignetting evidence;
- inverse-square, guide-number, ambient/flash, sync, ND, and polarization models;
- CCT/mired, balance gains, neutral targets, additive RGB, channel filters, mixed light, and rendered clipping;
- pixel, print, bit-depth, file-size, shot/read-noise, and dynamic-range reasoning;
- forward, inverse, comparison, construction, diagnosis, and repair tasks;
- correct, false, overbroad, and insufficient-evidence claims.

At least 25% of eligible questions should be inverse, construction, or audit tasks. At least 20% of advanced integrated questions should contain multiple valid settings, no feasible setting, or insufficient evidence when genuinely constructed. Correct/non-flawed controls must appear at least as often as planted defects in mixed audit practice.

Ordinary per-instance limits:

- 4 exposure controls/components;
- 5 meter regions;
- 8 histogram bins per visible table or 3 channel summaries;
- 5 subjects/focus distances;
- 5 setting tuples in ordinary comparison and 12 in advanced filtered selection;
- 4 lens/sensor candidates;
- 4 illumination/flash components;
- 4 color targets/illuminants or channel-transform stages;
- 8 candidate frames in a multi-frame plan.

## 19. Views and v1 priorities

Recommended views:

- **Learn:** stop wheel, exposure/ISO ledger, histogram guide, DOF visualizer, framing/perspective pairs, flash/filter guide, white-balance/channel guide, sensor/noise guide.
- **Practice:** category, family, level, nominal/analytical, and representation filters.
- **Exposure lab:** change settings and inspect `ΔH`, `ΔB`, clipping, and motion/focus consequences.
- **Lens lab:** manipulate focal length, sensor, distance, focus, pupil, and ray geometry.
- **Lighting lab:** compare ambient/flash/filter components under the declared model.
- **Audit lab:** locate one root misconception and repair the conclusion.
- **Reference:** stop tables, formulas, sign conventions, units, and model limitations.

Minimum satisfying v1:

1. stop ratios, aperture/shutter/ISO changes, and equivalent settings;
2. EV100, compensation, filters, and basic brackets;
3. synthetic meter, raw histogram shift, clipping, and headroom;
4. pupil diameter, qualitative DOF, hyperfocal/limits, and diffraction;
5. subject/camera blur, pixel thresholds, and stabilization distinction;
6. angle of view, crop factor, framing, and viewpoint perspective;
7. thin-lens distance/magnification, T-stop, and basic distortion evidence;
8. inverse square, guide number, ambient/flash ledger, and ND;
9. CCT/mired, white-balance gains, neutral targets, and channel clipping;
10. megapixels, pitch, PPI, crop resolution, and ISO/photon audits;
11. bounded setting selection and equivalence/calculation audits.

V1.1 adds full defocus-circle calculation, rolling shutter, macro effective aperture, aberration rays, polarizers, and noise/SNR. V1.2 adds richer multi-frame plans, more synthetic image diagnoses, and advanced Pareto setting comparisons.

## 20. Topic-level quality checklist

- [ ] Every question names the target quantity or invariant.
- [ ] Physical sensor exposure is distinct from ISO-dependent brightness.
- [ ] Nominal setting tables are distinct from exact numeric ratios.
- [ ] Aperture direction and square-law signs are correct.
- [ ] Equal-brightness answers do not imply equal photons/noise/headroom.
- [ ] Meter calibration, region weighting, and pipeline are explicit.
- [ ] Histograms are not used to infer spatial position or artistic correctness.
- [ ] Channel clipping is checked independently when relevant.
- [ ] F-number uses entrance-pupil diameter.
- [ ] DOF and circle-of-confusion conclusions are criterion-scoped.
- [ ] Hyperfocal, thin-lens, blur, and sensor units are consistent.
- [ ] Diffraction criteria do not become universal sharpness claims.
- [ ] Stabilization affects only declared camera-motion components.
- [ ] Reciprocal-shutter heuristics are labeled estimates, not guarantees.
- [ ] Crop factor does not change physical focal length.
- [ ] Perspective consequences are attributed to viewpoint.
- [ ] T-stop, f-stop, and transmission remain distinct.
- [ ] Macro effective aperture names its simplified lens model.
- [ ] Aberration/distortion diagnoses derive from supplied evidence.
- [ ] Inverse-square distance is squared and guide-number units match.
- [ ] Flash shutter-independence is used only within the declared sync model.
- [ ] Filter naming conventions are displayed rather than assumed.
- [ ] CCT is not treated as a complete spectral or color-rendering description.
- [ ] White-balance gains are multiplicative and pipeline-stage specific.
- [ ] Global balance does not silently “solve” conflicting mixed illuminants.
- [ ] Pixel count, pitch, PPI, bit depth, and dynamic range remain distinct.
- [ ] Independent noise sources combine by variance.
- [ ] ISO-only changes never create modeled photons.
- [ ] Candidate plans are filtered for feasibility before optimization.
- [ ] Ties, infeasibility, and insufficient evidence are preserved.
- [ ] Canonical answers derive from semantic data, not rendered pixels.
- [ ] Every visual has a complete accessible semantic alternative.
- [ ] Every family has three instantiated examples and automated fixtures.
- [ ] Difficulty grows through photographic reasoning, not trivia or subjective taste.
- [ ] All scenes/equipment are fictional, benign, local, and offline.
