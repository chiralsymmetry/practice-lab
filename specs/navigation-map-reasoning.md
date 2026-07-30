# Navigation and Map Reasoning — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, semantic map/terrain renderer, route solver, geometry oracle, answer checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Navigation and Map Reasoning

### Topic goal

Develop reliable spatial reasoning with maps: orient a display, interpret bearings and coordinates, convert map scale to ground distance, read terrain and symbols, compare routes, and state what location evidence does and does not establish.

The learner should become able to:

- distinguish map north, true/grid/magnetic north, and current facing direction;
- read, convert, combine, and reverse bearings under explicit conventions;
- calculate map and ground distances from representative fraction, verbal, and graphic scales;
- use Cartesian grids, synthetic grid references, and latitude/longitude notation correctly;
- infer elevation, slope, drainage, ridges, valleys, and line of sight from contour evidence;
- follow and compare multi-leg routes using distance, direction, time, ascent, and declared restrictions;
- reason from landmarks, bearings, ranges, and uncertainty regions to possible positions;
- use legends, boundaries, road/trail classes, map dates, and source notes;
- detect scale, orientation, coordinate-order, outdated-map, and false-precision errors;
- choose the strongest route/location claim supported by the supplied map.

The app should train a disciplined sequence:

> Establish orientation and coordinate convention, inspect scale and legend, identify constraints, calculate, then check the result against the map.

### Relationship to neighboring Practice Lab topics

- **Geometry and Trigonometry** owns general angle, coordinate, triangle, sine/cosine law, and bearing mathematics.
- **Data Literacy and Chart Reading** owns general visual scale/legend reading and choropleth/symbol maps.
- **Physics** owns speed, time, vectors, and motion models.
- **Networking and Protocols** owns packet-routing tables, not geographic routes.

Navigation and Map Reasoning owns the integration of direction, map scale, coordinates, terrain, route networks, position evidence, and map-specific uncertainty.

### Audience and prerequisites

Early categories assume:

- whole-number/decimal arithmetic;
- cardinal directions;
- measuring a line against a displayed ruler;
- unit conversion;
- simple coordinates.

Later categories locally introduce:

- degrees modulo 360;
- Pythagorean distance;
- sine/cosine/tangent in optional advanced families;
- rates and elapsed time;
- interval/uncertainty intersection.

No real compass, GPS receiver, printed map, or outdoor-navigation experience is required.

### Scope

The initial model ID is `navigation-map-reasoning-v1`. It includes:

- map anatomy, north arrows, compass roses, rotation, cardinal/intercardinal directions, and map-relative versus body-relative direction;
- three-digit azimuth bearings, quadrant bearings, reciprocal bearings, signed turns, and bearing differences;
- true/grid/magnetic north under explicit synthetic declination/convergence offsets;
- course, heading, track, drift, and bounded vector corrections in synthetic diagrams;
- representative-fraction scales such as `1:25,000`, verbal scales, scale bars, resized maps, straight/polyline path distance, and area scaling;
- Cartesian eastings/northings, cell/grid-square references, synthetic four-/six-figure references, coordinate differences, distance, midpoint, and local bearings;
- latitude/longitude reading, hemisphere/sign, decimal-degree and DMS conversion, and coordinate-order validation;
- contour intervals, point elevation bounds, slope, gradient, relief, hills/depressions, ridges, valleys, saddles, drainage direction, profiles, visibility, and route ascent;
- map symbols, road/trail/bridge/ferry/boundary classes, legend matching, source date, surveyed/estimated status, and feature availability;
- route sequences, network graph paths, distance/time/ETA, speed changes, elevation gain/loss, waypoints, detours, closures, one-way direction, and multi-criteria route selection;
- local dead reckoning, range circles, bearing rays, two/three-observation intersection, triangulation/resection in bounded planar cases, and uncertainty regions;
- map/ground consistency audits and synthetic navigation scenarios.

The intended ceiling is strong everyday, recreational, and introductory field/map reasoning—without claiming operational competence.

### Exclusions

Do not include:

- real-time or real-world route guidance, emergency response, wilderness survival, avalanche/flood/fire/tide/weather decisions, or “safe route” assurances;
- legal access, land ownership, border crossing, maritime/aviation rules, road laws, licensing, or restricted-area advice;
- actual GPS coordinates of sensitive/private places or live location tracking;
- current roads, trails, closures, transit schedules, or map data fetched from a service;
- nautical chart work, tides/currents, celestial navigation, aviation flight planning, radio navigation, or instrument procedures;
- geodesics, great-circle/rhumb-line calculations, ellipsoid/datums, UTM/MGRS implementation, map-projection mathematics, or coordinate-system transformation;
- compass hardware calibration, local magnetic anomaly advice, pace-count field instruction, or claims a phone/compass reading is reliable;
- freehand measurement whose exact answer depends on screen pixels;
- route optimization over large networks, vehicle fuel planning, or logistics scheduling;
- interpreting an unlabeled real topographic map where local symbology could differ;
- open-ended prose judgments about terrain safety or accessibility.

### Normative navigation model

#### Map frame and north

Every map has a semantic local Cartesian frame:

```text
x/easting increases to map east
y/northing increases to map north
```

The rendered page may be rotated. A visible north arrow defines map north; screen up is not assumed north.

Directions:

```text
N  = 000°
NE = 045°
E  = 090°
SE = 135°
S  = 180°
SW = 225°
W  = 270°
NW = 315°
```

Three-digit bearings are measured clockwise from the declared north reference. Canonical values are `[000°,359°]`; input `360°` normalizes to `000°` only when the field accepts equivalent full turns.

Bearing from point `A(x1, y1)` to `B(x2, y2)`:

```text
ΔE = x2-x1
ΔN = y2-y1
bearing = normalizeDegrees(atan2(ΔE, ΔN))
```

This `atan2` argument order is deliberately east, north so north is zero and clockwise is positive.

Reciprocal bearing:

```text
normalizeDegrees(bearing + 180°)
```

Smallest signed turn from `a` to `b` is normalized to `(-180°,180°]`; positive means clockwise/right, negative counterclockwise/left. Exactly 180° is reported as “either direction 180°” unless a tie convention is declared.

#### Quadrant bearings

Quadrant form begins at north or south and turns at most 90° toward east or west:

```text
N θ E, S θ E, S θ W, N θ W
0° ≤ θ ≤ 90°
```

Canonical azimuth conversions:

```text
N θ E -> θ
S θ E -> 180°-θ
S θ W -> 180°+θ
N θ W -> 360°-θ
```

At cardinal endpoints, canonical display uses the cardinal/three-digit form rather than multiple quadrant spellings.

#### True, grid, and magnetic references

Offsets are synthetic and always displayed.

Define:

```text
D = magnetic declination = azimuth of magnetic north measured
    clockwise from true north (east positive, west negative)

G = grid convergence = azimuth of grid north measured
    clockwise from true north
```

For the same physical direction:

```text
true bearing     = magnetic bearing + D
true bearing     = grid bearing + G
magnetic bearing = true bearing - D
grid bearing     = true bearing - G
```

Normalize after arithmetic. Questions never use memorized “add east/subtract west” mnemonics without the signed definition.

#### Course, heading, track, and bearing

- **bearing**: direction from observer/reference point to another point;
- **course**: intended direction of travel;
- **heading**: direction the synthetic vehicle/person faces;
- **track**: actual path direction over ground;
- **relative bearing**: clockwise angle from heading to target direction.

Drift/current/wind vector questions use supplied planar vectors and are educational abstractions, not operational travel advice.

### Normative scale and distance model

Representative fraction `1:n` means one map unit equals `n` of the same ground unit.

```text
ground distance = map distance × n
map distance    = ground distance / n
```

Units are converted after/before ratio arithmetic explicitly. Common generated conversions:

```text
10 mm = 1 cm
100 cm = 1 m
1,000 m = 1 km
12 in = 1 ft
5,280 ft = 1 mi
```

Metric and US-customary questions do not mix unless conversion constants are supplied.

Scale ordering:

- `1:10,000` is a **larger-scale** map than `1:100,000`;
- larger scale shows a smaller area with potentially more detail at the same sheet size;
- smaller denominator means larger scale.

A numeric/verbal scale becomes invalid if an image is resized independently. A graphic scale bar remains valid only when it resizes with the map. Digital-map questions use a declared scale at the current zoom; scale is not inferred from screen pixels.

Ground area scales with the square:

```text
ground area = map area × n²
```

Map paths are semantic polylines/arcs with exact lengths. Rendering measurement is for interaction only and snaps to semantic segments.

### Normative coordinate model

Local grid coordinates are `(E, N)`—easting first, northing second. Distance and midpoint:

```text
d = sqrt((ΔE)²+(ΔN)²)
midpoint = ((E1+E2)/2,(N1+N2)/2)
```

Synthetic grid references use a displayed numbered square grid:

- “read right, then up”;
- four-figure reference names the lower-left easting/northing grid lines of a square;
- six-figure reference adds one estimated tenth within the easting interval, then one within northing;
- this is a pedagogical grid, not a claim of exact national/MGRS syntax.

Latitude/longitude:

- latitude first, longitude second in geographic-coordinate fields;
- north/east positive, south/west negative in signed decimal form;
- latitude range `[-90°,90°]`;
- longitude normalized/validated in `[-180°,180°]`;
- `1°=60′`, `1′=60″`;
- DMS and decimal conversions are exact before requested rounding.

Local Euclidean distance/bearing is never calculated directly from latitude/longitude unless a local conversion factor/projection is explicitly supplied.

### Normative contour and terrain model

- Contours connect equal elevation.
- Contour interval is the constant elevation difference between adjacent ordinary contours.
- Contours do not cross/branch in ordinary generated terrain; overhang/cliff exceptions are excluded.
- Closely spaced contours indicate steeper slope; widely spaced indicate gentler slope for the same interval/map scale.
- Closed contours increasing inward form a hill; hachured closed contours decreasing inward form a depression.
- Where contours cross a stream/valley, the V points upstream/uphill under the generated terrain model.
- Ridge/spur contours point generally downhill.
- A saddle is a low pass between higher areas.
- Streams flow from higher to lower elevation and do not cross a contour without descending.

Point elevation on a slope between contours is bounded, not known exactly, unless a spot height or interpolated linear model is supplied.

Gradient:

```text
gradient = vertical change / horizontal ground distance
percent grade = gradient × 100%
```

Route ascent sums positive elevation changes; descent sums absolute negative changes. Net elevation change is endpoint minus start and is not total ascent.

Line-of-sight questions use a supplied cross-section or exact piecewise-linear terrain profile; Earth curvature, vegetation, buildings, refraction, and observer height are excluded unless explicitly modeled.

### Units, precision, and answer conventions

- Surrounding whitespace is ignored.
- Bearings accept degrees with/without `°`; canonical three-digit display includes leading zeros.
- `000°` and allowed `360°` normalize consistently.
- Quadrant-bearing spaces are optional; letters are case-insensitive.
- Direction ties/sector boundaries use declared inclusivity.
- Distances require compatible units; exact equivalent units are accepted.
- Representative fractions accept `1:n` and an equivalent verbal form only when response mode allows.
- Coordinates use named fields, not an ambiguous comma string when order is the skill.
- Grid references preserve leading digits.
- DMS accepts symbols or named degree/minute/second fields.
- Numeric tolerance is the larger of half the final requested unit and `1e-9` relative.
- Trigonometric calculations retain unrounded intermediates.
- Visual measurement answers are accepted only at declared map/ruler resolution.
- Route alternatives and possible-position regions are checked semantically, not by pixel overlap alone.

### Difficulty philosophy

Difficulty should increase through:

- rotating the map relative to screen;
- changing north reference or bearing representation;
- wrapping across 000°/360° and reversing direction;
- coordinating scale with unit conversion and a multi-segment path;
- moving between map, grid, coordinate, contour, and route-graph representations;
- weakening cues while preserving explicit conventions;
- distinguishing exact point, grid square, band, and uncertainty region;
- combining distance, ascent, speed, restrictions, and waypoints;
- detecting a result inconsistent with terrain/legend/scale.

It must not increase through tiny maps, fuzzy symbols, enormous coordinates, excessive ruler precision, long arithmetic, obscure regional map conventions, real-world hazard judgment, hidden north/scale, or trick wording.

### Shared family contract

Every family below includes:

- **Task** and trainable map/navigation operation;
- **Response/template** with semantic placeholders;
- **Derivation** as the normative geometric/graph algorithm;
- **Difficulty** through meaningful dimensions;
- **Misconceptions/constraints** and rejection rules;
- **Feedback** exposing orientation/scale/route reasoning;
- **Examples** with at least three instantiated cases;
- **Validation/coverage** naming independent checks and distributions.

All maps, coordinates, contours, symbols, routes, observations, answers, and feedback derive from one immutable semantic model. Reject ambiguous north references, unreadable scale subdivisions, degenerate bearings, nonunique route winners without tie acceptance, invalid contour topology, hidden access assumptions, or measurement dominated by rendering artifacts.

## 2. Category: Orientation, directions, and bearings

### Category purpose

Establish a stable angular reference and reason about directions despite map rotation, alternate notation, and reference-north offsets.

### Learn

Find the north arrow before using screen direction. Three-digit bearings start at north and increase clockwise. A reciprocal reverses direction by 180°. Quadrant bearings start at N/S and turn toward E/W. True, grid, and magnetic bearings are different labels for the same direction relative to different north lines.

### Prerequisites

Cardinal directions, degree angles, and modulo arithmetic reviewed locally.

### Category boundaries

This category handles direction. Scale, coordinates, route distance, and terrain follow later.

### Subcategories

1. Rotated maps/cardinal direction
2. Azimuth bearings
3. Reciprocal and turn angles
4. Quadrant bearings
5. True/grid/magnetic conversion
6. Course/heading/track

### Common misconceptions

- Assuming screen up is north.
- Measuring bearings counterclockwise or from east.
- Writing `90°` instead of canonical `090°`.
- Adding 180 without normalizing.
- Swapping `N30E` with the invalid form `E30N`.
- Applying declination by a memorized sign slogan.
- Treating heading as actual track.

### Family `rotated_map_cardinal`

**Task.** Identify screen/map direction of a feature using a rotated north arrow.

**Response/template.** cardinal/intercardinal or selectable direction.

**Derivation.** Rotate screen vector into north-referenced map frame; quantize only when feature lies exactly in generated sector.

**Difficulty.** L1 north-up; L2 90° rotation; L3 45°; L4 infer north arrow from labeled pair.

**Misconceptions/constraints.** Exact cardinal/ordinal geometry; no borderline sectors.

**Feedback.** Overlay compass rose aligned to arrow.

**Examples.**

1. north arrow points screen up; target right → east. L1.
2. north arrow points screen right; target screen up → west. L2.
3. north arrow points upper-left; target upper-right is approximately east in generated 45° frame. L3.

**Validation/coverage.** Rotation matrix and sector identity.

### Family `azimuth_read_draw`

**Task.** Read or place a three-digit clockwise-from-north bearing.

**Response/template.** bearing/rotatable ray.

**Derivation.** Measure clockwise from declared north and normalize.

**Difficulty.** L1 cardinal; L2 multiples 15°; L3 arbitrary whole degree; L4 rotated page.

**Misconceptions/constraints.** Semantic angle controls; no pixel protractor precision.

**Feedback.** Show clockwise arc from north.

**Examples.**

1. east → 090°. L1.
2. southwest → 225°. L1.
3. 20° west of north → 340°. L2.

**Validation/coverage.** Bearing/ray round trip.

### Family `bearing_direction_sector`

**Task.** Convert a bearing to nearest named direction/sector under displayed boundaries.

**Response/template.** cardinal/intercardinal/16-wind label.

**Derivation.** Normalize and locate sector with declared half-open/tie rule.

**Difficulty.** L1 exact 8-wind; L2 within sector; L3 boundary; L4 16-wind.

**Misconceptions/constraints.** Boundary policy shown; avoid memorization-only dominance.

**Feedback.** Place bearing on labeled rose.

**Examples.**

1. 045° → NE. L1.
2. 100° lies in E sector under 8-wind nearest-direction rule. L2.
3. exact boundary uses displayed clockwise-tie policy. L3.

**Validation/coverage.** Modular sector classifier.

### Family `reciprocal_bearing`

**Task.** Find forward/back bearing.

**Response/template.** three-digit bearing.

**Derivation.** Add 180° and normalize.

**Difficulty.** L1 no wrap; L2 wrap; L3 missing direction in route; L4 true/grid label retained.

**Misconceptions/constraints.** Reverse is not `360−bearing`.

**Feedback.** Draw same line with opposite arrow.

**Examples.**

1. 040° → 220°. L1.
2. 250° → 070°. L2.
3. reciprocal of 000° → 180°. L1.

**Validation/coverage.** Reciprocal twice returns original.

### Family `signed_turn_between_bearings`

**Task.** Find smallest left/right turn from one bearing to another.

**Response/template.** direction and angle.

**Derivation.** Modular difference normalized to `(-180,180]`.

**Difficulty.** L1 no wrap; L2 cross north; L3 choose smaller; L4 180 tie.

**Misconceptions/constraints.** Positive/right clockwise. Exact 180 accepts either unless tie policy.

**Feedback.** Show both clockwise/counterclockwise arcs.

**Examples.**

1. 030 → 100 → right 70°. L1.
2. 350 → 020 → right 30°. L2.
3. 010 → 280 → left 90°. L2.

**Validation/coverage.** Turn plus start normalizes to destination.

### Family `quadrant_azimuth_convert`

**Task.** Convert between quadrant and azimuth bearings.

**Response/template.** structured quadrant/three-digit.

**Derivation.** Apply pinned quadrant formulas.

**Difficulty.** L1 NE; L2 other quadrants; L3 inverse; L4 cardinal endpoints.

**Misconceptions/constraints.** Angle at most 90; quadrant letters semantically checked.

**Feedback.** Mark starting N/S ray and turn direction.

**Examples.**

1. N30E → 030°. L1.
2. S20E → 160°. L2.
3. 300° → N60W. L2.

**Validation/coverage.** Conversion round trip excluding canonical endpoints.

### Family `relative_bearing_target`

**Task.** Combine heading and relative bearing to obtain target bearing, or reverse.

**Response/template.** bearing/relative angle.

**Derivation.** target=`heading+relative clockwise angle` normalized.

**Difficulty.** L1 small; L2 wrap; L3 solve missing heading; L4 left-relative wording converted.

**Misconceptions/constraints.** Relative convention displayed each time.

**Feedback.** Draw heading zero ray then relative arc.

**Examples.**

1. heading 090°, target 30° right → 120°. L1.
2. heading 350°, relative 25° clockwise → 015°. L2.
3. target 270°, heading 300° → relative 330° clockwise, equivalently 30° left when requested. L3.

**Validation/coverage.** Modular addition/inverse.

### Family `bearing_from_local_coordinates`

**Task.** Calculate bearing between points with friendly coordinate differences.

**Response/template.** bearing, optionally exact cardinal/special angle.

**Derivation.** Compute ΔE, ΔN and pinned `atan2`.

**Difficulty.** L1 axes; L2 diagonals; L3 special right triangles; L4 decimal bearing.

**Misconceptions/constraints.** Points distinct. Coordinates are `(E, N)`.

**Feedback.** Draw north/east components and angle.

**Examples.**

1. A(2,3) → B(2,8): `ΔE=0`, `ΔN=5` → 000°. L1.
2. A(0,0) → B(5,5) → 045°. L2.
3. A(4,1) → B(1,1) → 270°. L1.

**Validation/coverage.** Vector angle and reverse reciprocal.

### Family `north_reference_convert`

**Task.** Convert true/grid/magnetic bearing using supplied signed D/G.

**Response/template.** labeled bearing.

**Derivation.** Convert through true bearing using normative equations, normalize.

**Difficulty.** L1 one positive offset; L2 negative; L3 grid↔magnetic; L4 wrap.

**Misconceptions/constraints.** Diagram and signed definition printed; no mnemonic-only prompt.

**Feedback.** Place all north rays with signed offsets.

**Examples.**

1. D=+8°, magnetic 100° → true 108°. L1.
2. D=−5°, true 020° → magnetic 025°. L2.
3. G=+2°, D=−4°, grid 010° → true 012° → magnetic 016°. L3.

**Validation/coverage.** Convert round trip through reference offsets.

### Family `course_heading_track_distinguish`

**Task.** Label intended direction, facing direction, observed path, and target bearing.

**Response/template.** matching/named bearings.

**Derivation.** Read semantic arrows and definitions.

**Difficulty.** L1 course=heading; L2 drift; L3 target relative bearing; L4 infer one from diagram.

**Misconceptions/constraints.** Synthetic motion only; no real correction advice.

**Feedback.** Separate arrows by role and equation.

**Examples.**

1. intended 090°, actual ground path 100° → course 090°, track 100°. L1.
2. vehicle faces 085° while track 090° → heading 085°, track 090°. L2.
3. bearing to landmark is independent of intended course unless related by relative angle. L3.

**Validation/coverage.** Typed-direction schema.

### Family `vector_drift_track`

**Task.** Add a travel/velocity vector and supplied drift vector to obtain ground track/speed in a planar toy model.

**Response/template.** component vector, magnitude, bearing.

**Derivation.** Convert bearing/magnitude to `(E, N)`, add, convert back.

**Difficulty.** L1 perpendicular friendly components; L2 general supplied components; L3 solve needed heading among candidates; L4 feasibility bound.

**Misconceptions/constraints.** Units/time compatible. No maritime/aviation operational framing.

**Feedback.** Vector parallelogram with components.

**Examples.**

1. travel north 4 plus drift east 3 → ground speed 5, bearing about 036.87°. L2.
2. equal west/east components cancel. L1.
3. if opposing drift magnitude exceeds available speed, a requested due-north ground track may be infeasible under model. L4.

**Validation/coverage.** Component and polar round trip.

### Cross-family progression

Rotated cardinal reading precedes numerical bearings. Sector labels, reciprocals, and turns build modular fluency before quadrant notation. Relative bearings and coordinate-derived bearings connect diagrams to numbers. North-reference conversion remains explicit and separate from course/heading/track. Vector drift is optional capstone after components are mastered.

## 3. Category: Map scale, distance, and measurement

### Category purpose

Convert reliably between map representation and ground quantities while recognizing scale validity and precision.

### Learn

At `1:25,000`, one map centimeter represents 25,000 ground centimeters=`250 m`. Keep units like-for-like before converting. A smaller denominator means a larger-scale, more detailed map. If a map image is resized, its printed numeric scale may no longer apply; a scale bar works when it resizes with the image.

### Prerequisites

Ratios, multiplication/division, unit conversions, and simple area.

### Category boundaries

This category measures map geometry. Route constraints and time belong later.

### Subcategories

1. Representative fractions
2. Verbal and graphic scales
3. Straight and path distance
4. Resizing/precision
5. Area and scale comparison

### Common misconceptions

- Multiplying/dividing scale in wrong direction.
- Treating `1:50,000` as more detailed than `1:25,000`.
- Mixing cm and km inside the ratio.
- Measuring only endpoint distance for a winding route.
- Using an old numeric scale after resizing.
- Applying linear scale factor to area instead of squaring.

### Family `representative_fraction_interpret`

**Task.** Interpret `1:n` in requested units.

**Response/template.** verbal scale/ground distance per map unit.

**Derivation.** One map unit maps to n same ground units, then convert.

**Difficulty.** L1 metric friendly; L2 alternate map unit; L3 US units supplied; L4 compare equivalent statements.

**Misconceptions/constraints.** Ratio dimensionless; exact conversions.

**Feedback.** Write same-unit relationship first.

**Examples.**

1. `1:10,000` → 1 cm = 100 m. L1.
2. `1:25,000` → 4 cm = 1 km. L2.
3. `1:63,360` → 1 inch = 1 mile with supplied conversion. L3.

**Validation/coverage.** Ratio/unit round trip.

### Family `map_to_ground_distance`

**Task.** Convert measured map distance to ground distance.

**Response/template.** distance with unit.

**Derivation.** Multiply by scale denominator in same units, then convert.

**Difficulty.** L1 integer cm; L2 decimal/mm; L3 multi-unit; L4 measurement tolerance.

**Misconceptions/constraints.** Semantic measured length at declared precision.

**Feedback.** map length × denominator → same-unit ground → target unit.

**Examples.**

1. 3 cm at 1:20,000 → 600 m. L1.
2. 7.5 cm at 1:40,000 → 3 km. L2.
3. 42 mm at 1:25,000 → 1.05 km. L3.

**Validation/coverage.** Exact dimensional calculation.

### Family `ground_to_map_distance`

**Task.** Determine required map length for a ground distance.

**Response/template.** mm/cm/in.

**Derivation.** Convert ground to chosen map unit then divide by n.

**Difficulty.** L1 friendly; L2 decimals; L3 choose whether feature fits sheet; L4 solve scale denominator.

**Misconceptions/constraints.** Positive distances and meaningful display precision.

**Feedback.** Reverse scale equation.

**Examples.**

1. 1 km at 1:50,000 → 2 cm. L1.
2. 750 m at 1:25,000 → 3 cm. L2.
3. 12 km must fit within 20 cm → denominator at least 60,000. L3.

**Validation/coverage.** Forward substitution.

### Family `verbal_scale_convert`

**Task.** Use/convert a verbal scale and representative fraction.

**Response/template.** ratio/verbal/distance.

**Derivation.** Convert both sides to same units; simplify map side to 1.

**Difficulty.** L1 direct verbal; L2 derive RF; L3 imperial supplied; L4 detect non-equivalence.

**Misconceptions/constraints.** No rounding that changes declared scale materially.

**Feedback.** Unit conversion then ratio normalization.

**Examples.**

1. 1 cm represents 500 m → 1:50,000. L1.
2. 2 cm represents 1 km → also 1:50,000. L2.
3. 1 cm=1 km is 1:100,000, not 1:10,000. L2.

**Validation/coverage.** Verbal/RF equivalence.

### Family `graphic_scale_bar`

**Task.** Read/interpolate a distance using a segmented graphic scale.

**Response/template.** distance/ruler placement.

**Derivation.** Compare semantic path length to bar segment length; interpolate declared subdivisions.

**Difficulty.** L1 exact segment; L2 fractions; L3 offset zero/subdivided left; L4 resized map.

**Misconceptions/constraints.** SVG bar and map share transform. No raw pixel oracle.

**Feedback.** Align length to bar.

**Examples.**

1. path equals two 1-km segments → 2 km. L1.
2. halfway through 500-m segment → 250 m. L2.
3. map and bar resized together → bar remains valid. L3.

**Validation/coverage.** Semantic length/bar ratio.

### Family `resized_map_scale`

**Task.** Compute new RF after resizing or decide which scale remains valid.

**Response/template.** new denominator/scale-choice.

**Derivation.** If linear image factor k, new denominator=`n/k` for enlarged image; graphic bar co-scales.

**Difficulty.** L1 2× enlargement; L2 reduction; L3 percent resize; L4 anisotropic resize invalidates uniform scale.

**Misconceptions/constraints.** Physical print/display dimensions explicit.

**Feedback.** Track one known map length before/after.

**Examples.**

1. enlarge 1:50,000 map to 200% → 1:25,000. L1.
2. reduce to 50% → 1:100,000. L2.
3. stretch width only → no single uniform RF. L3.

**Validation/coverage.** Resize transform and scale-bar invariance.

### Family `polyline_route_measure`

**Task.** Sum a multi-segment map path and convert to ground distance.

**Response/template.** map/ground totals.

**Derivation.** Sum exact segment lengths or arc approximation supplied, then scale.

**Difficulty.** L1 two straight; L2 several; L3 curve segmented; L4 compare straight-line.

**Misconceptions/constraints.** At most 8 segments; resolution error declared.

**Feedback.** Number segments and cumulative length.

**Examples.**

1. map segments 2+3 cm at 1:20,000 → 1 km. L1.
2. path 6 cm versus endpoint 4 cm: route longer. L2.
3. curve measured with declared 0.5-cm subdivisions yields an interval if not exact. L3.

**Validation/coverage.** Polyline length and triangle-inequality check.

### Family `scale_area_convert`

**Task.** Convert map area to ground area or infer area scale.

**Response/template.** area with squared unit.

**Derivation.** Multiply by n² in same squared units, then convert.

**Difficulty.** L1 square region; L2 unit conversion; L3 inverse; L4 resize area.

**Misconceptions/constraints.** Units visibly squared.

**Feedback.** Apply scale independently to length and width.

**Examples.**

1. 1 cm² at 1:10,000 → 10,000 m². L2.
2. 4 cm² at 1:25,000 → 0.25 km². L3.
3. doubling linear print size quadruples map area for same ground region. L2.

**Validation/coverage.** Dimensional area calculation.

### Family `map_scale_compare_detail`

**Task.** Rank scales and choose suitable declared coverage/detail tradeoff.

**Response/template.** ordered scales/map choice.

**Derivation.** Compare denominators; combine with supplied sheet dimensions/feature threshold.

**Difficulty.** L1 two denominators; L2 coverage; L3 feature visibility supplied; L4 scale versus resolution distinction.

**Misconceptions/constraints.** Never claim actual detail without supplied cartographic profile.

**Feedback.** Use identical sheet-length example.

**Examples.**

1. 1:10,000 is larger scale than 1:50,000. L1.
2. same 20-cm sheet covers more ground at 1:100,000. L2.
3. larger scale permits more detail but does not guarantee a feature was surveyed/shown. L3.

**Validation/coverage.** Denominator order and coverage geometry.

### Family `scale_measurement_precision`

**Task.** Propagate map measurement resolution to ground-distance precision.

**Response/template.** interval/rounding precision.

**Derivation.** Multiply map-length uncertainty by n and convert.

**Difficulty.** L1 ±1 mm; L2 half subdivision; L3 compare scales; L4 choose honest reported digits.

**Misconceptions/constraints.** Exact semantic length is hidden; answer reflects instrument/map resolution.

**Feedback.** Show uncertainty scaling.

**Examples.**

1. ±1 mm at 1:25,000 → ±25 m. L1.
2. report 3.247381 km from ±25 m measurement → false precision. L2.
3. same 1-mm ruler gives smaller ground uncertainty on larger-scale map. L3.

**Validation/coverage.** Interval arithmetic and display precision.

### Cross-family progression

RF interpretation precedes forward/inverse distance and verbal equivalence. Scale bars make proportional measurement visual. Resizing follows only after scale meaning is stable. Polyline distance adds path geometry. Area and scale comparison extend dimensions; precision practice limits overconfident read-offs.

## 4. Category: Grids and geographic coordinates

### Category purpose

Locate, compare, and describe positions using explicit coordinate order and precision.

### Learn

Local map grids use `(E, N)`: read right, then up. A grid-square reference identifies an area; extra digits refine position within it. Latitude is north/south of the equator; longitude east/west of the prime meridian. Coordinate precision limits location precision.

### Prerequisites

Number lines, ordered pairs, scale, and degree notation.

### Category boundaries

This category handles coordinate representation/local plane geometry. Position from observations and route travel follow later.

### Subcategories

1. Easting/northing coordinates
2. Local distance/midpoint/bearing
3. Four-/six-figure grid references
4. Latitude/longitude notation
5. Precision and validation

### Common misconceptions

- Reading northing before easting.
- Treating a grid reference as an exact point.
- Omitting leading digits.
- Swapping latitude and longitude.
- Applying E/W sign to latitude.
- Treating degrees/minutes/seconds as decimal base100.
- Computing flat Euclidean distance directly from global degrees.

### Family `grid_point_locate`

**Task.** Read/place a point in `(E, N)` coordinates.

**Response/template.** named easting/northing fields or selectable point.

**Derivation.** Project point to grid axes, easting first.

**Difficulty.** L1 integer; L2 subdivisions; L3 negative local coordinates; L4 rotated screen with grid labels.

**Misconceptions/constraints.** Semantic snap points; no pixel precision.

**Feedback.** Trace right/easting then up/northing.

**Examples.**

1. 3 east,5 north → (3,5). L1.
2. point(8,2) is farther east than(2,8), not farther north. L1.
3. rotated page does not change labeled coordinate axes. L3.

**Validation/coverage.** Coordinate/render round trip.

### Family `coordinate_delta_direction`

**Task.** Compute displacement components and qualitative direction.

**Response/template.** ΔE, ΔN, direction.

**Derivation.** destination minus start coordinate-wise.

**Difficulty.** L1 positive; L2 mixed signs; L3 inverse endpoint; L4 compare displacements.

**Misconceptions/constraints.** Direction labels exact for constructed vector.

**Feedback.** Horizontal/vertical component arrows.

**Examples.**

1. (2,3) → (7,3): ΔE+5, ΔN0, east. L1.
2. (5,8) → (2,4): ΔE−3, ΔN−4, southwest. L2.
3. start(1,2)+displacement(4,−1) → end(5,1). L2.

**Validation/coverage.** Vector addition/inverse.

### Family `coordinate_distance`

**Task.** Calculate straight-line local grid distance.

**Response/template.** distance with grid/ground unit.

**Derivation.** Pythagorean formula; apply grid scale if needed.

**Difficulty.** L1 axis; L2 3-4-5; L3 radical/decimal; L4 compare route distance.

**Misconceptions/constraints.** Local planar grid and equal axis units.

**Feedback.** Right triangle with ΔE/ΔN.

**Examples.**

1. (0,0) → (3,4) → 5 grid units. L1.
2. grid unit 100 m → 500 m. L2.
3. straight-line is lower bound on constrained network route. L3.

**Validation/coverage.** Squared-distance identity.

### Family `coordinate_midpoint`

**Task.** Find midpoint or endpoint given midpoint.

**Response/template.** `(E, N)`.

**Derivation.** Average coordinates; inverse via `B=2M−A`.

**Difficulty.** L1 integers; L2 halves; L3 inverse; L4 waypoint interpretation.

**Misconceptions/constraints.** Midpoint is straight-segment midpoint, not halfway along winding path.

**Feedback.** Average each coordinate separately.

**Examples.**

1. (2,4),(6,8) → (4,6). L1.
2. midpoint(5,5), A(2,3) → B(8,7). L2.
3. route-time halfway may not be coordinate midpoint. L3.

**Validation/coverage.** Equal endpoint distances/vector symmetry.

### Family `four_figure_grid_reference`

**Task.** Read/place a grid square using lower-left easting/northing digits.

**Response/template.** four-figure reference/square selection.

**Derivation.** Take easting grid line to left, then northing below.

**Difficulty.** L1 labeled square; L2 boundary; L3 inverse; L4 leading zeros.

**Misconceptions/constraints.** Points on boundary use explicit half-open square rule.

**Feedback.** “right, then up” trace and shade entire square.

**Examples.**

1. point between eastings 12–13, northings 34–35 → 1234. L1.
2. reference 0715 retains leading 0. L2.
3. four figures identify a square, not its center. L2.

**Validation/coverage.** Grid-cell containment.

### Family `six_figure_grid_reference`

**Task.** Estimate/read tenths within a grid square.

**Response/template.** six digits or coordinate interval.

**Derivation.** base easting + easting tenth, then base northing + northing tenth.

**Difficulty.** L1 exact tenths; L2 visual interpolation; L3 inverse placement; L4 precision bounds.

**Misconceptions/constraints.** Synthetic grid labeling displayed; points avoid subdivision boundaries unless targeted.

**Feedback.** Subdivide square 10×10 and read easting triplet then northing.

**Examples.**

1. square 12/34, point 0.3 east,0.7 north → 123347. L1.
2. 123347 denotes a small cell/precision area, not infinitely exact point. L2.
3. swap 347123 is wrong order. L2.

**Validation/coverage.** Subcell containment and formatting.

### Family `grid_reference_precision`

**Task.** Compare spatial precision/possible area of coordinate/grid references.

**Response/template.** interval/area/ranking.

**Derivation.** Use grid interval size and number of subdivision digits.

**Difficulty.** L1 4 vs 6 figures; L2 ground units; L3 overlapping references; L4 false precision.

**Misconceptions/constraints.** Exact cell convention supplied.

**Feedback.** Overlay uncertainty squares.

**Examples.**

1. four-figure square 1 km wide; six-figure subcell 100 m wide. L1.
2. adding digits without better observation does not improve actual accuracy. L2.
3. two references can differ yet their uncertainty cells overlap only under separately supplied rounding model. L3.

**Validation/coverage.** Reference-to-region geometry.

### Family `latitude_longitude_read`

**Task.** Identify latitude/longitude, hemisphere, and relative N/S/E/W position.

**Response/template.** named coordinate fields/comparison.

**Derivation.** Latitude first and constrained ±90; longitude second ±180.

**Difficulty.** L1 hemispheres; L2 signed decimals; L3 compare negatives; L4 coordinate order audit.

**Misconceptions/constraints.** No distance inference.

**Feedback.** Place point on schematic globe/grid.

**Examples.**

1. 20° N, 30° E → latitude +20, longitude +30. L1.
2. 10° S → latitude −10. L1.
3. Longitude −70° is west of longitude −20°. L2.

**Validation/coverage.** Hemisphere/sign/range rules.

### Family `dms_decimal_convert`

**Task.** Convert DMS and decimal degrees.

**Response/template.** signed decimal or D/M/S/hemisphere.

**Derivation.** decimal=`degrees+minutes/60+seconds/3600`, then hemisphere sign.

**Difficulty.** L1 exact minutes; L2 seconds; L3 negative inverse; L4 rounding carry.

**Misconceptions/constraints.** Minutes/seconds `[0,60)`.

**Feedback.** Show sexagesimal fractions.

**Examples.**

1. 30°30′ N → 30.5°. L1.
2. 12°15′36″ S → −12.26°. L2.
3. −73.75° longitude → 73°45′ W. L2.

**Validation/coverage.** Conversion round trip within precision.

### Family `coordinate_validity_order`

**Task.** Validate/repair coordinate order, range, signs, or formatting.

**Response/template.** valid/invalid plus corrected form.

**Derivation.** Apply selected coordinate schema and bounds.

**Difficulty.** L1 out-of-range latitude; L2 swapped plausible values; L3 hemisphere/sign conflict; L4 grid versus geographic schema.

**Misconceptions/constraints.** Metadata makes intended schema explicit.

**Feedback.** Check each field against role/range.

**Examples.**

1. latitude 120° invalid. L1.
2. `45° N, 120° E` is valid latitude/longitude; swapping gives invalid latitude 120°. L2.
3. `−20° N` conflicts in sign and hemisphere; use `20° N` or `−20°`. L2.

**Validation/coverage.** Schema validator and unique repair cases.

### Cross-family progression

Local point reading precedes displacements, distance, and midpoint. Four-figure squares introduce area-valued location before six-figure refinement and precision. Latitude/longitude then uses a different named schema; DMS conversion follows. Validity/order audits prevent transferring flat-grid or decimal-base assumptions incorrectly.

## 5. Category: Map symbols, legends, layers, and evidence

### Category purpose

Extract feature meaning and availability from the map's own legend, source, date, and layer metadata rather than assumed regional conventions.

### Learn

Symbols are a map language defined by its legend. Similar-looking lines may mean road, trail, boundary, contour, or stream. A feature's presence on a map supports that it is represented in the map model—not that it currently exists, is open, legal, safe, or passable unless those facts are separately supplied.

### Prerequisites

Map orientation, grids, basic table/legend reading, and controlled claim language.

### Category boundaries

This category interprets synthetic map metadata. Terrain shape and route calculations use those meanings later.

### Subcategories

1. Point/line/area symbols
2. Feature classes and crossings
3. Boundaries/layers
4. Source/date/status
5. Evidence limits

### Common misconceptions

- Guessing a symbol from real-world familiarity instead of the displayed legend.
- Treating a boundary as a route.
- Assuming all line intersections are connected crossings.
- Assuming a mapped bridge/trail is currently usable.
- Treating missing feature as proof no feature exists.
- Ignoring map date or estimated status.

### Family `legend_symbol_match`

**Task.** Match point, line, or area marks to feature classes using the supplied legend.

**Response/template.** matching/selectable symbol.

**Derivation.** Resolve exact semantic style key to legend entry.

**Difficulty.** L1 distinct points; L2 similar lines; L3 combined color/pattern; L4 rotated symbol irrelevant.

**Misconceptions/constraints.** Shape/pattern/text supplement color. No outside convention required.

**Feedback.** Highlight style attributes shared with legend.

**Examples.**

1. blue wavy line keyed “stream” → stream. L1.
2. dashed black line versus dash-dot boundary → use exact pattern. L2.
3. green fill keyed woodland does not mean public access. L3.

**Validation/coverage.** One-to-one style/semantic map.

### Family `feature_class_attributes`

**Task.** Read declared class attributes such as surface, width, permanence, or access status.

**Response/template.** attribute fields.

**Derivation.** Resolve feature ID and legend/annotation attributes.

**Difficulty.** L1 one class; L2 hierarchical road/trail; L3 seasonal/estimated modifier; L4 missing attribute.

**Misconceptions/constraints.** “Unknown” when attribute absent; do not infer from thickness alone unless legend says so.

**Feedback.** Trace feature style to full legend row.

**Examples.**

1. double solid line keyed paved road → surface paved. L1.
2. dashed trail with `seasonal` modifier → availability conditional, not always open. L2.
3. no width class in legend → width cannot be determined. L3.

**Validation/coverage.** Feature attribute schema.

### Family `line_crossing_connectivity`

**Task.** Decide whether intersecting routes/streams are connected, bridged, tunneled, or merely cross.

**Response/template.** connectivity relation.

**Derivation.** Inspect topology nodes and bridge/gap symbols, not geometric crossing alone.

**Difficulty.** L1 junction dot; L2 overpass/gap; L3 stream bridge; L4 several crossings.

**Misconceptions/constraints.** Renderer uses unambiguous bridges/gaps and accessible topology.

**Feedback.** Show graph nodes versus visual intersections.

**Examples.**

1. two trails meet at junction dot → connected. L1.
2. road passes over another with bridge symbol/no node → not connected there. L2.
3. trail crosses stream without bridge/ford symbol → map does not establish a usable crossing. L3.

**Validation/coverage.** Geometric intersection versus graph-edge incidence.

### Family `boundary_area_membership`

**Task.** Determine whether a point/route lies inside, outside, crosses, or follows a mapped area/boundary.

**Response/template.** relation and crossing count.

**Derivation.** Point-in-polygon and segment-boundary intersection; boundary inclusion rule displayed.

**Difficulty.** L1 point; L2 route crossing; L3 holes/enclaves; L4 boundary-following segment.

**Misconceptions/constraints.** Boundary meaning comes from legend; geometry avoids near-touch ambiguity.

**Feedback.** Highlight interior and crossing points.

**Examples.**

1. waypoint inside shaded management area → inside mapped area. L1.
2. route enters then exits → two boundary crossings. L2.
3. being inside does not imply access prohibition unless rule supplied. L3.

**Validation/coverage.** Computational geometry with semantic access separation.

### Family `map_layer_visibility`

**Task.** Predict which features are visible/available when layers or filters are toggled.

**Response/template.** feature set.

**Derivation.** Apply layer membership and visibility filters; underlying feature model persists.

**Difficulty.** L1 one layer; L2 several; L3 scale-dependent visibility; L4 hidden versus absent.

**Misconceptions/constraints.** Hiding is presentation, not deletion/nonexistence.

**Feedback.** Layer-feature membership table.

**Examples.**

1. turn off Contours → contour lines hidden, elevations not thereby zero. L1.
2. Roads on, Trails off → only road edges displayed. L2.
3. a hidden landmark can still exist in semantic map but cannot support a visible-map lookup claim. L3.

**Validation/coverage.** Layer/filter projection.

### Family `map_date_status`

**Task.** Read source/survey/update date and decide temporal scope.

**Response/template.** date/status/claim choice.

**Derivation.** Compare feature observation/update metadata with scenario date.

**Difficulty.** L1 one map date; L2 layer-specific dates; L3 edition versus survey date; L4 planned/verified status.

**Misconceptions/constraints.** No real current data; later date does not guarantee every layer updated.

**Feedback.** Timeline of observation, publication, scenario.

**Examples.**

1. map surveyed 2022 cannot alone confirm a trail remains open in 2025. L2.
2. 2025 edition with contours from 2018 → terrain layer date 2018. L3.
3. feature labeled proposed is not represented as completed. L2.

**Validation/coverage.** Versioned feature metadata.

### Family `mapped_absent_unknown`

**Task.** Distinguish mapped present, mapped absent in surveyed layer, hidden, not surveyed, and unknown.

**Response/template.** status/strongest claim.

**Derivation.** Combine feature records, layer coverage, visibility, and source completeness.

**Difficulty.** L1 visible present; L2 not shown; L3 incomplete coverage; L4 time/status limitation.

**Misconceptions/constraints.** Absence of symbol is not universal proof of real-world absence.

**Feedback.** State map-model evidence and limitation.

**Examples.**

1. visible bridge symbol → bridge is represented in map. L1.
2. no bridge symbol on a layer that does not survey bridges → unknown. L2.
3. complete synthetic bridge inventory says none at crossing → absent in supplied model, not a real-world claim. L3.

**Validation/coverage.** Epistemic status rules.

### Family `feature_evidence_claim`

**Task.** Select the strongest claim supported by symbol, legend, date, and source.

**Response/template.** controlled claim choice.

**Derivation.** Compare claim AST (feature, type, status, time, access) to metadata.

**Difficulty.** L1 type; L2 mapped status; L3 access/current overclaim; L4 multiple evidence fields.

**Misconceptions/constraints.** No intent/safety language. Only one strongest warranted option.

**Feedback.** Cite supporting legend/source fields.

**Examples.**

1. “A trail is depicted between A and B” supported by trail line. L1.
2. “The trail is currently open and safe” unsupported without status/safety data. L2.
3. estimated route supports approximate location, not surveyed exactness. L3.

**Validation/coverage.** Metadata-claim predicate evaluator.

### Cross-family progression

Symbol matching precedes attributes and topology. Boundaries/layers separate map geometry from display state. Date/status and absent/unknown families establish evidence limits. Strongest-claim questions integrate legend, topology, coverage, and time before route use.

## 6. Category: Contours, terrain, and vertical reasoning

### Category purpose

Infer bounded terrain structure and vertical cost from contour evidence without treating a two-dimensional map as a photograph.

### Learn

Each contour has one elevation. Adjacent ordinary contours differ by the contour interval. Spacing shows gradient: close is steeper. Closed increasing contours form hills; hachures mark depressions. Contour Vs crossing streams point upstream. Total ascent sums every rise, not just final minus initial.

### Prerequisites

Scale/distance, signed differences, intervals, and simple percentages.

### Category boundaries

This category uses idealized synthetic topography. Geological hazards, avalanche/flood interpretation, and real route safety are excluded.

### Subcategories

1. Interval/elevation
2. Slope/gradient/relief
3. Landforms/drainage
4. Profiles/visibility
5. Route ascent/descent

### Common misconceptions

- Counting contour lines rather than intervals.
- Treating close contours as higher rather than steeper.
- Assigning exact elevation between contours.
- Reading valley V direction backward.
- Confusing net elevation with total ascent.
- Assuming line of sight from plan distance alone.

### Family `contour_interval`

**Task.** Determine contour interval or missing contour labels.

**Response/template.** elevation interval/labels.

**Derivation.** Labeled elevation difference divided by number of adjacent intervals.

**Difficulty.** L1 consecutive labels; L2 unlabeled lines between; L3 index contours; L4 detect inconsistent labels.

**Misconceptions/constraints.** Ordinary constant interval; count spaces.

**Feedback.** Number elevation steps.

**Examples.**

1. adjacent contours 100,120 → interval 20 m. L1.
2. 100 to 200 with 5 intervals → 20 m. L2.
3. line sequence 100,120,140,160. L1.

**Validation/coverage.** Terrain contour levels and adjacency.

### Family `point_elevation_contour`

**Task.** Read exact elevation on a contour/spot height or bound a point between contours.

**Response/template.** exact elevation or interval.

**Derivation.** On contour=label; between adjacent contours lies strictly between unless linear interpolation supplied.

**Difficulty.** L1 labeled line; L2 unlabeled infer; L3 between; L4 summit bound.

**Misconceptions/constraints.** No visual interpolation unless declared.

**Feedback.** Highlight bracketing contours.

**Examples.**

1. point on contour 240 m → 240 m. L1.
2. point between 240 and 260 → `240<elevation<260 m`. L2.
3. innermost closed contour 300, no spot height/next contour 320 → summit at least 300 but below 320 under no-hidden-contour model. L3.

**Validation/coverage.** Terrain scalar field/contour bounds.

### Family `contour_linear_interpolate`

**Task.** Estimate elevation between contours under an explicitly linear local slope model.

**Response/template.** approximate elevation.

**Derivation.** Fractional perpendicular distance between contour lines × interval.

**Difficulty.** L1 halfway; L2 quarters; L3 descending; L4 unequal screen spacing but semantic distances.

**Misconceptions/constraints.** Model explicitly says elevation changes linearly; otherwise family not used.

**Feedback.** Show lower/upper contour and fraction.

**Examples.**

1. halfway 100–120 → 110 m. L1.
2. one quarter uphill from 200 to 240 → 210 m. L2.
3. without linear assumption only a bound is justified. L3.

**Validation/coverage.** Piecewise-linear terrain evaluation.

### Family `contour_spacing_slope`

**Task.** Rank terrain steepness from contour spacing at common interval/scale.

**Response/template.** region ranking/claim.

**Derivation.** Smaller horizontal ground distance for same vertical interval means larger gradient.

**Difficulty.** L1 same map; L2 compare measured spacing; L3 different contour intervals/scales; L4 anisotropic invalid map.

**Misconceptions/constraints.** Normalize interval and scale before comparison.

**Feedback.** Compute rise/run for representative adjacent contours.

**Examples.**

1. closer contours → steeper at same interval. L1.
2. spacing 50 m for rise 20 gives steeper than spacing 100 m. L2.
3. visual spacing across different map scales cannot be compared without conversion. L3.

**Validation/coverage.** Gradient order.

### Family `terrain_gradient_grade`

**Task.** Calculate gradient, percent grade, or horizontal distance.

**Response/template.** ratio/percentage/distance.

**Derivation.** vertical change divided by horizontal ground distance.

**Difficulty.** L1 friendly; L2 scale conversion; L3 inverse; L4 distinguish angle.

**Misconceptions/constraints.** Percent grade is not degrees.

**Feedback.** Label rise/run and units.

**Examples.**

1. rise 50 m over 500 m → gradient `0.1 = 10%`. L1.
2. 20% grade is not 20°; angle ≈ 11.31° if requested. L3.
3. rise 30 m at 15% → horizontal 200 m. L2.

**Validation/coverage.** Ratio/angle optional cross-check.

### Family `relief_high_low`

**Task.** Find local/route/map relief and highest/lowest known points.

**Response/template.** elevations and relief.

**Derivation.** relief=max elevation−min elevation over declared set/region.

**Difficulty.** L1 spot heights; L2 contour bounds; L3 region subset; L4 uncertain summit range.

**Misconceptions/constraints.** Relief is vertical range, not route distance.

**Feedback.** Highlight max/min evidence.

**Examples.**

1. high 450, low 170 → relief 280 m. L1.
2. route highest contour 300, lowest 100 → known relief 200 m. L2.
3. unlabeled summit may make exact regional relief undetermined. L3.

**Validation/coverage.** Elevation set/bound arithmetic.

### Family `hill_depression_identify`

**Task.** Classify nested closed contours and infer inward elevation direction.

**Response/template.** hill/depression/insufficient plus labels.

**Derivation.** Use labels and hachure semantics.

**Difficulty.** L1 labeled hill; L2 hachured depression; L3 unlabeled with nearby known; L4 multiple features.

**Misconceptions/constraints.** No crater interpretation without hachures/labels.

**Feedback.** Trace elevation moving inward.

**Examples.**

1. closed 100,120,140 inward → hill. L1.
2. hachured closed contours decreasing inward → depression. L2.
3. unlabeled closed loops without context/hachures may be insufficient. L3.

**Validation/coverage.** Terrain critical-point classification.

### Family `ridge_valley_drainage`

**Task.** Identify ridge/spur versus valley and upstream/downstream direction.

**Response/template.** landform/direction.

**Derivation.** Contour Vs crossing drainage point uphill/upstream; water flows opposite toward lower labels. Ridge noses point downhill.

**Difficulty.** L1 stream labeled; L2 infer from contours; L3 ridge/valley contrast; L4 branching drainage.

**Misconceptions/constraints.** Synthetic terrain satisfies rule; no flat ambiguous contours.

**Feedback.** Add elevation arrows on V arms.

**Examples.**

1. contour V points north along stream → upstream north, flow south. L2.
2. V/U pointing downhill on high ground indicates spur/ridge nose. L3.
3. water crosses contours from higher to lower values. L1.

**Validation/coverage.** Terrain field gradient and stream network.

### Family `saddle_pass_identify`

**Task.** Identify a saddle/pass and estimate its bounded elevation.

**Response/template.** location/elevation interval.

**Derivation.** Find low point between two highs and high divide between two lows; use contour bounds.

**Difficulty.** L1 obvious two hills; L2 labels; L3 compare passes; L4 route use.

**Misconceptions/constraints.** Exact pass elevation only with spot/contour crossing.

**Feedback.** Show two uphill and two downhill directions.

**Examples.**

1. low neck between two summits → saddle. L1.
2. pass lies between 300 and 320 contours → bounded interval. L2.
3. lower pass may reduce ascent but not automatically shortest route. L3.

**Validation/coverage.** Synthetic terrain critical-point topology.

### Family `terrain_profile_match`

**Task.** Match/construct an elevation profile along a transect.

**Response/template.** graph choice/ordered elevations.

**Derivation.** Intersect route with contour/terrain model in order; map distances to horizontal profile and elevations vertically.

**Difficulty.** L1 one hill; L2 valley; L3 several crossings; L4 different horizontal/vertical scales.

**Misconceptions/constraints.** Vertical exaggeration labeled. Profile order follows route direction.

**Feedback.** Link each contour crossing to profile point.

**Examples.**

1. crossings 100,120,140,120,100 → single hill profile. L1.
2. reversed transect reverses horizontal order, not elevations. L2.
3. vertical exaggeration changes appearance, not elevation values. L3.

**Validation/coverage.** Terrain sampling/profile round trip.

### Family `terrain_line_of_sight`

**Task.** Decide line of sight between two points on exact cross-section.

**Response/template.** visible/blocked and blocking point.

**Derivation.** Compare terrain elevation to straight sight-line elevation at every breakpoint, including declared observer heights.

**Difficulty.** L1 one ridge; L2 unequal endpoint heights; L3 observer height; L4 closest clearance.

**Misconceptions/constraints.** Plan contours alone converted to exact supplied profile; vegetation/curvature absent.

**Feedback.** Draw sight line and terrain clearance.

**Examples.**

1. ridge rises above sight segment → blocked. L1.
2. terrain stays below sight line → visible in model. L2.
3. endpoint elevation alone cannot establish visibility without intervening profile. L3.

**Validation/coverage.** Piecewise-linear segment clearance.

### Family `route_ascent_descent`

**Task.** Sum total ascent, total descent, and net elevation change along waypoints.

**Response/template.** three elevation fields.

**Derivation.** Sum positive and absolute negative consecutive differences; net=end−start.

**Difficulty.** L1 monotone; L2 up/down; L3 inferred contour crossings; L4 compare routes.

**Misconceptions/constraints.** Waypoint elevations exact/bounded as required.

**Feedback.** Elevation-difference table.

**Examples.**

1. 100 → 150 → 120 → 180 → ascent 110, descent 30, net+80. L2.
2. start/end both 100 can still have total ascent 200. L2.
3. monotone 100 → 160 → ascent 60, descent 0, net+60. L1.

**Validation/coverage.** Ascent−descent=net identity.

### Cross-family progression

Contour interval and point bounds precede optional interpolation. Spacing precedes numeric gradient/relief. Landform families connect shapes to elevation direction and drainage. Profiles make route order explicit before line-of-sight. Ascent/descent then reuses elevations for route comparison.

## 7. Category: Routes, distance, time, and constraints

### Category purpose

Follow and compare routes as ordered paths through a network with explicit costs and restrictions.

### Learn

A route is an ordered sequence of connected legs. Straight-line distance is not network distance. Total time is the sum of each leg's `distance/speed` plus declared stops. “Best” needs an objective: shortest, fastest, least ascent, fewest transfers, or a stated priority rule. A route is feasible only if every edge satisfies direction/access/closure constraints in the model.

### Prerequisites

Bearings, scale distance, map topology, rates/time, and elevation change.

### Category boundaries

This category solves synthetic route graphs. It does not recommend real travel or assess safety/legal access.

### Subcategories

1. Ordered legs/instructions
2. Distance/time/ETA
3. Route graphs
4. Restrictions/closures/waypoints
5. Elevation and multi-criteria choice

### Common misconceptions

- Connecting landmarks in unordered list order.
- Using endpoint distance as route distance.
- Averaging speeds without distance/time weighting.
- Ignoring stops or speed changes.
- Choosing shortest when fastest was requested.
- Treating a geometric crossing as network junction.
- Ignoring one-way/closure/required waypoint.

### Family `route_instruction_follow`

**Task.** Follow cardinal/bearing/distance instructions and identify endpoint/waypoints.

**Response/template.** point/route sequence.

**Derivation.** Convert each leg to vector or graph edge and apply in order.

**Difficulty.** L1 cardinal grid; L2 diagonal bearing; L3 several legs; L4 rotated map.

**Misconceptions/constraints.** Legs land on semantic points; at most 6.

**Feedback.** Animate/number each leg.

**Examples.**

1. start(0,0), east 3, north 2 → (3,2). L1.
2. north 2 then south 2 returns start. L1.
3. changing leg order can change route path even if vector endpoint same; ordered route still matters. L3.

**Validation/coverage.** Sequential vector/edge simulation.

### Family `route_leg_bearing_distance`

**Task.** Compute distance/bearing for each route leg from waypoint coordinates.

**Response/template.** ordered leg table.

**Derivation.** Coordinate differences, Euclidean distance, `atan2` bearing.

**Difficulty.** L1 axes; L2 diagonals; L3 scale/unit; L4 reverse route.

**Misconceptions/constraints.** Route uses straight leg between declared waypoints.

**Feedback.** Component triangle per leg.

**Examples.**

1. A(0,0) → B(0,4): distance 4, bearing 000°. L1.
2. B(0,4) → C(3,4): distance 3, bearing 090°. L1.
3. reverse legs use reciprocal bearings and reverse order. L3.

**Validation/coverage.** Leg vectors sum endpoint displacement.

### Family `route_total_distance`

**Task.** Sum map/network leg lengths and compare with straight-line displacement.

**Response/template.** route/straight/excess distances.

**Derivation.** Sum edges; compute endpoint Euclidean distance; excess difference/ratio.

**Difficulty.** L1 two; L2 scaled map; L3 choose route; L4 loop/repeated edge.

**Misconceptions/constraints.** Edge traversal multiplicity counts.

**Feedback.** Cumulative distance and direct chord.

**Examples.**

1. legs 3+4 → route 7. L1.
2. endpoint displacement 5 → route excess 2. L2.
3. detour traversing same 1-km segment twice adds 2 km. L3.

**Validation/coverage.** Path sum ≥ Euclidean endpoint distance in planar straight-edge graph.

### Family `travel_time_eta`

**Task.** Calculate leg/route travel time and arrival clock time.

**Response/template.** duration/clock time.

**Derivation.** `t=d/v`, sum stops, add to departure with 24-hour/date rollover.

**Difficulty.** L1 one speed; L2 several legs; L3 stop/rollover; L4 inverse departure.

**Misconceptions/constraints.** Constant speed per leg explicitly modeled; no real predictions.

**Feedback.** Leg time table and clock addition.

**Examples.**

1. 6 km at 3 km/h → 2 h. L1.
2. depart 09:20, travel 1 h 40 → 11:00. L2.
3. travel 50 min+10-min stop+30 min → 1 h 30 total. L2.

**Validation/coverage.** Duration and clock arithmetic.

### Family `multi_speed_average`

**Task.** Calculate total time/average speed across unequal-distance legs.

**Response/template.** total time/average speed.

**Derivation.** Sum `d_i/v_i`; average speed=total distance/total moving time (include stops only if “overall” profile says so).

**Difficulty.** L1 friendly; L2 unequal distances; L3 stop distinction; L4 solve missing speed.

**Misconceptions/constraints.** Do not arithmetic-average speeds generally.

**Feedback.** Distance/time totals.

**Examples.**

1. 4 km at 4 km/h +4 km at 2 km/h → 8 km/3 h=`2.667 km/h`, not 3. L2.
2. equal time at 2 and 4 km/h does average 3; condition explained. L2.
3. including stop lowers overall speed but not moving speed. L3.

**Validation/coverage.** Weighted rate identity.

### Family `network_route_validity`

**Task.** Decide whether a waypoint sequence is a connected valid path.

**Response/template.** valid/invalid and first broken leg.

**Derivation.** Check every consecutive pair for traversable graph edge/direction/status.

**Difficulty.** L1 connected; L2 crossing/no node; L3 one-way; L4 mode/access class.

**Misconceptions/constraints.** Graph topology accessible.

**Feedback.** Highlight first absent/forbidden edge.

**Examples.**

1. A–B and B–C edges → A, B, C valid. L1.
2. lines cross visually without node → cannot transfer there. L2.
3. C → B forbidden on B → C one-way edge. L2.

**Validation/coverage.** Graph path predicate.

### Family `shortest_path_small_graph`

**Task.** Find shortest-distance route in a small weighted network.

**Response/template.** waypoint sequence and total.

**Derivation.** Enumerate simple paths or Dijkstra with nonnegative edge distance.

**Difficulty.** L1 two choices; L2 several; L3 required waypoint; L4 tie set.

**Misconceptions/constraints.** At most 8 nodes/12 edges; ties accepted explicitly.

**Feedback.** Compare candidate path totals or show settled labels.

**Examples.**

1. A-C direct 8 versus A-B-C 3+4=7 → via B. L1.
2. fewer edges can be longer. L2.
3. equal shortest routes both accepted when tie stated. L3.

**Validation/coverage.** Dijkstra/enumeration agreement.

### Family `fastest_route_network`

**Task.** Find fastest route when edge speeds/stops differ.

**Response/template.** route/time.

**Derivation.** Convert each edge to time cost plus edge/node delays; shortest path on time.

**Difficulty.** L1 two alternatives; L2 speed classes; L3 fixed crossing delay; L4 time-dependent availability supplied.

**Misconceptions/constraints.** Static bounded schedule; no live traffic.

**Feedback.** Distance is not time; show edge time.

**Examples.**

1. 10 km fast road at 10 km/h=1 h beats 6 km trail at 3 km/h=2 h. L1.
2. ferry route adds 30-min wait supplied. L2.
3. shortest-distance route may not be fastest. L1.

**Validation/coverage.** Time-weight path oracle.

### Family `route_closure_oneway_mode`

**Task.** Recompute route after closure, direction, mode, or access constraint.

**Response/template.** feasible edges/new path.

**Derivation.** Filter graph edges by scenario constraints, then validate/optimize.

**Difficulty.** L1 one closure; L2 one-way; L3 mode classes; L4 interacting constraints.

**Misconceptions/constraints.** Restrictions synthetic and explicit; no real legal claim.

**Feedback.** Remove forbidden edges before route search.

**Examples.**

1. bridge edge closed → routes using it infeasible. L1.
2. one-way A → B cannot serve B → A. L2.
3. cycling mode excludes foot-only edge in model. L2.

**Validation/coverage.** Edge-filter then graph oracle.

### Family `required_waypoint_route`

**Task.** Find/verify a route through required waypoint(s) in declared order.

**Response/template.** route and total.

**Derivation.** Split problem at ordered waypoints or augment state with visited requirements.

**Difficulty.** L1 one; L2 ordered two; L3 avoid point/edge; L4 shortest feasible.

**Misconceptions/constraints.** Required versus optional labels explicit.

**Feedback.** Checklist requirements against path sequence.

**Examples.**

1. A → D via B = shortest A → B plus B → D under nonnegative static graph. L1.
2. visit B then C differs from C then B. L2.
3. route touching a crossing without graph node does not visit waypoint there. L3.

**Validation/coverage.** State-augmented path search.

### Family `route_elevation_compare`

**Task.** Compare routes by total ascent/descent/maximum elevation under a stated objective.

**Response/template.** metrics and selected route.

**Derivation.** Evaluate waypoint/edge elevation profiles and objective.

**Difficulty.** L1 ascent; L2 distance+ascent table; L3 max elevation; L4 constrained lexicographic choice.

**Misconceptions/constraints.** Never call lower-ascent route safer; only metric claim.

**Feedback.** Profile and metric table.

**Examples.**

1. Route A ascent 100, B 180 → A has less ascent. L1.
2. shorter route can have more ascent. L2.
3. objective “minimize ascent, then distance” uses lexicographic order. L3.

**Validation/coverage.** Path elevation metrics and objective evaluator.

### Family `multi_criteria_route_choice`

**Task.** Choose Pareto/weighted/lexicographic route under fully specified preference rule.

**Response/template.** route plus criteria table.

**Derivation.** Compute all metrics, apply declared feasibility then decision rule.

**Difficulty.** L1 hard constraint+one objective; L2 lexicographic; L3 weighted score; L4 Pareto nondominated set.

**Misconceptions/constraints.** Weights/units normalized explicitly; no subjective “best.”

**Feedback.** Apply criteria in order and show eliminations.

**Examples.**

1. require ≤ 2 h, then minimize distance → filter, then choose. L1.
2. minimize time then ascent chooses fastest regardless small ascent difference. L2.
3. one route shorter but slower and another faster but longer → both may be Pareto-nondominated. L3.

**Validation/coverage.** Enumeration and decision-rule oracle.

### Cross-family progression

Following instructions and computing leg metrics precede totals/time. Multi-speed practice prevents naive averages. Route validity comes before shortest/fastest algorithms. Closures/modes and waypoints add feasibility. Elevation and explicit multi-criteria decisions cap the category without smuggling in real safety judgments.

## 8. Category: Position fixing, observations, and dead reckoning

### Category purpose

Combine movement and bounded observations to infer a point or possible-position region and recognize when evidence is insufficient or inconsistent.

### Learn

Dead reckoning advances a prior position by distance and direction, so uncertainty grows with each leg. A range observation gives a circle/annulus. A bearing from a known observer gives a ray. An observed bearing from an unknown position to a known landmark places the observer on the reciprocal ray from that landmark. Independent observations intersect to narrow the possible region.

### Prerequisites

Bearings, local coordinates, scale distance, route vectors, and interval intersections.

### Category boundaries

This category uses exact synthetic planar observations. It does not teach real GPS/compass operation or certify a location.

### Subcategories

1. Dead reckoning
2. Range/bearing loci
3. Two-/three-observation fixes
4. Landmark identification
5. Accuracy/uncertainty regions

### Common misconceptions

- Applying distance along screen-up rather than bearing.
- Drawing a full line when observation implies a ray.
- Using landmark-to-observer bearing without taking reciprocal.
- Treating one bearing as a point fix.
- Choosing either of two circle intersections without another clue.
- Averaging inconsistent positions blindly.
- Treating accuracy radius as guaranteed exact containment.

### Family `dead_reckoning_endpoint`

**Task.** Advance a local position by one or more bearing/distance legs.

**Response/template.** endpoint/ordered positions.

**Derivation.** Convert each leg to `ΔE=d sin b`, `ΔN=d cos b`, add sequentially.

**Difficulty.** L1 cardinal; L2 special angles; L3 several; L4 reverse missing leg.

**Misconceptions/constraints.** Exact-friendly bearings or requested tolerance.

**Feedback.** Component table and cumulative positions.

**Examples.**

1. (0,0),2 km at 090° → (2,0). L1.
2. then 2 km at 180° → (2,−2). L2.
3. endpoint−start equals vector sum, not sum of distance magnitudes. L3.

**Validation/coverage.** Component/polar and route simulation agreement.

### Family `range_circle_locus`

**Task.** Identify/draw possible positions at a known range from a landmark.

**Response/template.** circle equation/selectable locus/intersection.

**Derivation.** `(E−E0)²+(N−N0)²=r²`; interval range makes annulus.

**Difficulty.** L1 exact circle; L2 annulus; L3 point membership; L4 map-scale radius.

**Misconceptions/constraints.** Local planar distance; range nonnegative.

**Feedback.** Mark all equal-distance directions.

**Examples.**

1. exactly 5 km from L → circle radius 5. L1.
2. range 4–6 km → annulus, not one circle. L2.
3. point 3-4-5 from landmark lies on 5-km circle. L2.

**Validation/coverage.** Distance locus and membership.

### Family `bearing_ray_locus`

**Task.** Identify possible positions/directions from a bearing observation.

**Response/template.** ray origin/bearing or point membership.

**Derivation.** Observer-to-target bearing gives forward ray from observer; target-to-observer relation uses reciprocal.

**Difficulty.** L1 observer known; L2 reciprocal from landmark; L3 bearing interval sector; L4 true/grid conversion.

**Misconceptions/constraints.** Ray direction explicit; line behind origin excluded.

**Feedback.** Draw origin arrow and reciprocal when needed.

**Examples.**

1. target bearing 090° from A → eastward ray from A. L1.
2. unknown observer sees landmark L on bearing 030° → observer lies on 210° ray from L. L2.
3. bearing 030±2° → angular sector, not exact ray. L3.

**Validation/coverage.** Ray/sector geometry.

### Family `two_bearing_intersection`

**Task.** Find a target from bearings at two known observation points, or find an observer from bearings to two known landmarks.

**Response/template.** coordinate/point selection.

**Derivation.** Express both observations as rays pointing toward the unknown point, then intersect them. For an observer-to-landmark bearing, start the reciprocal ray at the landmark. Reject parallel or backward intersections.

**Difficulty.** L1 forward cardinal rays; L2 reciprocal resection; L3 diagonal/approximate bearings; L4 no unique intersection.

**Misconceptions/constraints.** Construct well-conditioned angles for exact fix; uncertainty variant returns region.

**Feedback.** Extend both rays and mark intersection.

**Examples.**

1. From A(0,0) bearing 090° and B(4,−4) bearing 000° → target at (4,0). L1.
2. An observer sees landmark P(0,4) at 000° and landmark Q(4,0) at 090° → reciprocal rays intersect at observer position (0,0). L2.
3. Parallel rays → no unique fix. L3.

**Validation/coverage.** Analytic line/ray intersection and conditioning.

### Family `two_range_intersection`

**Task.** Find possible positions from two exact ranges and use a side clue if supplied.

**Response/template.** point set/selected point.

**Derivation.** Intersect circles; cases 0,1,2 intersections.

**Difficulty.** L1 tangent; L2 two intersections; L3 side/bearing clue; L4 inconsistent ranges.

**Misconceptions/constraints.** Friendly coordinates; accept both when no discriminator.

**Feedback.** Show circle intersections and clue.

**Examples.**

1. two circles intersect at P/Q → both possible absent clue. L2.
2. “north of baseline” selects northern intersection. L2.
3. ranges whose circles are disjoint → inconsistent/no exact fix. L3.

**Validation/coverage.** Circle-intersection oracle and triangle inequality.

### Family `three_observation_fix`

**Task.** Combine three bearings/ranges to select/check a fix.

**Response/template.** coordinate/status/residuals.

**Derivation.** Intersect first two, verify third; bounded-noise case selects supplied candidate satisfying all intervals.

**Difficulty.** L1 exact verification; L2 eliminate ambiguity; L3 small uncertainty; L4 identify inconsistent observation.

**Misconceptions/constraints.** No least-squares estimation unless formula/candidates supplied.

**Feedback.** Add observations one at a time.

**Examples.**

1. third range selects one of two circle intersections. L1.
2. exact third bearing missing both candidates → observations inconsistent. L2.
3. three bands overlap in a region rather than exact point. L3.

**Validation/coverage.** Constraint intersection and witness.

### Family `landmark_identification`

**Task.** Identify which mapped landmark matches observed bearing/range/relative direction.

**Response/template.** landmark ID.

**Derivation.** Compute predicted observations from known position to candidates and match tolerances.

**Difficulty.** L1 bearing only unique; L2 bearing+range; L3 north-reference conversion; L4 multiple/none.

**Misconceptions/constraints.** Candidate geometry ensures declared uniqueness or set answer.

**Feedback.** Table predicted versus observed values.

**Examples.**

1. only tower on bearing 090° → tower. L1.
2. two landmarks same bearing; range selects nearer. L2.
3. no candidate within observation tolerance → none. L3.

**Validation/coverage.** Forward-observation model.

### Family `uncertainty_region_intersection`

**Task.** Combine position, range, and bearing uncertainty regions.

**Response/template.** possible-region selection/area comparison.

**Derivation.** Intersect disks/annuli/sectors/grid cells/polygons.

**Difficulty.** L1 two intervals; L2 annulus+sector; L3 grid cell+observation; L4 empty intersection.

**Misconceptions/constraints.** Geometry robustly separated; no pixel-only answer.

**Feedback.** Shade each constraint then overlap.

**Examples.**

1. grid square intersected with bearing sector narrows possible portion. L1.
2. annulus∩sector gives curved wedge. L2.
3. empty overlap indicates inconsistent constraints, not a point midway. L3.

**Validation/coverage.** Computational region intersection.

### Family `reported_accuracy_precision`

**Task.** Interpret a stated accuracy radius/grid precision and choose defensible coordinate reporting.

**Response/template.** region/precision/claim.

**Derivation.** Map reported point plus stated error model to disk/interval; compare digit resolution.

**Difficulty.** L1 radius; L2 two systems; L3 confidence qualifier; L4 false digits.

**Misconceptions/constraints.** Accuracy statement semantics explicitly declared; no claim of real device performance.

**Feedback.** Draw error region and coordinate digit cells.

**Examples.**

1. position ±20 m → possible disk/range under declared bound model. L1.
2. reporting to 1 cm from ±20 m observation is false precision. L2.
3. “95% within 20 m” is not a guaranteed hard bound. L3.

**Validation/coverage.** Uncertainty semantics and resolution comparison.

### Family `fix_consistency_audit`

**Task.** Audit a proposed position against every movement/observation constraint and identify first failure.

**Response/template.** valid/invalid, failed constraint, residual.

**Derivation.** Forward-calculate expected bearing/range/region membership from candidate.

**Difficulty.** L1 one range; L2 bearing+range; L3 north correction; L4 uncertainty intervals.

**Misconceptions/constraints.** One primary planted defect; tolerances explicit.

**Feedback.** Requirements table with predicted/observed/residual.

**Examples.**

1. candidate 6 km from landmark with required 5±0.2 → fails range. L1.
2. candidate matches two bearings but lies outside forward ray of one → invalid. L2.
3. all intervals satisfied → consistent, not necessarily uniquely proven. L3.

**Validation/coverage.** Constraint predicate oracle.

### Cross-family progression

Dead reckoning provides forward position before loci. Range circles and bearing rays are taught separately. Two-observation intersections expose ambiguity/degeneracy; a third observation verifies or narrows. Landmark identification reverses the model. Uncertainty and fix audits prevent exact-point overconfidence.

## 9. Category: Map and navigation audits

### Category purpose

Detect inconsistent orientation, scale, coordinates, terrain, route, time, and precision while preserving any limited claim that remains valid.

### Learn

Audit from foundations outward:

1. map/source/date;
2. north and bearing reference;
3. scale and units;
4. coordinate order/precision;
5. symbol/topology/terrain;
6. route constraints/costs;
7. claimed conclusion.

Describe the inconsistency and its consequence; do not guess that a mapmaker or traveler intended to deceive.

### Prerequisites

All prior categories.

### Category boundaries

Audits use synthetic evidence and do not evaluate real navigation choices or personal safety.

### Subcategories

1. Orientation/reference errors
2. Scale/coordinate errors
3. Source/symbol/terrain errors
4. Route/time consistency
5. Precision and supported claims

### Common misconceptions

- Correcting a scale error by rotating the map.
- Treating true and magnetic bearings as interchangeable.
- Accepting a route through a non-junction.
- Choosing a midpoint between conflicting observations.
- Calling a stale map false rather than limited.
- Reporting a uniquely exact position from a grid square/band.

### Family `audit_north_bearing_reference`

**Task.** Diagnose a route/bearing plotted from wrong north reference or screen orientation.

**Response/template.** defect and corrected bearing/ray.

**Derivation.** Recompute with declared north arrow and reference conversion.

**Difficulty.** L1 north-up error; L2 rotated map; L3 true/magnetic; L4 combined offset/wrap.

**Misconceptions/constraints.** Exactly one orientation defect.

**Feedback.** Overlay intended and erroneous north frames.

**Examples.**

1. ray 090° drawn screen-right although north arrow screen-right → wrong; screen-down is east in that frame. L2.
2. magnetic 100° used as true with D+8° → 8° reference error. L2.
3. correct scale cannot compensate for wrong direction. L3.

**Validation/coverage.** Error transform provenance.

### Family `audit_scale_unit`

**Task.** Diagnose wrong multiplication/division, unit conversion, denominator, or resized-map scale.

**Response/template.** wrong step/correct distance.

**Derivation.** Recompute same-unit scale pipeline and compare.

**Difficulty.** L1 direction; L2 cm/km; L3 resize; L4 area-square error.

**Misconceptions/constraints.** One primary defect; plausible wrong result generated by mutation.

**Feedback.** Dimensional units on every step.

**Examples.**

1. 2 cm at 1:50,000 reported 1 m → unit conversion error; correct 1 km. L1.
2. 200% enlarged map still using old RF → scale error. L2.
3. area converted with n instead of n² → dimensional error. L3.

**Validation/coverage.** Mutation-specific dimensional oracle.

### Family `audit_coordinate_order_precision`

**Task.** Detect easting/northing or lat/long swap, hemisphere sign, or unjustified precision.

**Response/template.** defect/corrected coordinate/region.

**Derivation.** Validate schema, bounds, and source precision.

**Difficulty.** L1 obvious range; L2 plausible swap; L3 DMS/sign; L4 precision.

**Misconceptions/constraints.** Context makes intended schema unique.

**Feedback.** Label fields and uncertainty cells.

**Examples.**

1. `(N, E)` entered into `(E, N)` moves point to reflected location. L1.
2. latitude 120 reveals likely swapped order if longitude field 45. L2.
3. four-figure grid reference cannot justify six-figure precision. L3.

**Validation/coverage.** Schema and resolution checks.

### Family `audit_source_legend_status`

**Task.** Detect claim relying on wrong legend, hidden layer, outdated feature, or unsupported status.

**Response/template.** evidence defect/repaired scoped claim.

**Derivation.** Compare claim to feature/layer/version metadata.

**Difficulty.** L1 symbol mismatch; L2 hidden/absent; L3 date; L4 multiple layer dates.

**Misconceptions/constraints.** Do not assert current real-world state.

**Feedback.** Cite exact legend/source conflict.

**Examples.**

1. dashed line is boundary per legend, not trail. L1.
2. 2020 map cannot alone verify 2025 bridge status. L2.
3. hidden trail layer means not visible, not necessarily absent in model. L3.

**Validation/coverage.** Claim-metadata rules.

### Family `audit_contour_consistency`

**Task.** Identify impossible/inconsistent contour labels, crossings, drainage, or stated landform.

**Response/template.** defect and corrected interpretation.

**Derivation.** Test constant intervals, noncrossing topology, terrain scalar ordering, and stream descent.

**Difficulty.** L1 label interval; L2 crossing; L3 stream V; L4 route profile mismatch.

**Misconceptions/constraints.** Excluded terrain exceptions cannot excuse defect.

**Feedback.** Show violated contour invariant.

**Examples.**

1. constant 20-m interval sequence 100,120,150 → 150 label inconsistent. L1.
2. ordinary contours crossing each other → invalid model. L2.
3. stream arrow uphill against contour labels → inconsistent. L3.

**Validation/coverage.** Terrain topology validator.

### Family `audit_route_connectivity_constraint`

**Task.** Locate first invalid route leg due to topology, direction, closure, mode, or required waypoint.

**Response/template.** leg/constraint/repair.

**Derivation.** Validate sequence against filtered directed graph.

**Difficulty.** L1 absent edge; L2 crossing; L3 one-way/mode; L4 waypoint order.

**Misconceptions/constraints.** One primary injected route defect.

**Feedback.** Step route until first invalid transition.

**Examples.**

1. route turns at non-junction crossing → invalid there. L2.
2. traverses B → A on A → B-only edge → direction failure. L2.
3. shortest geometry irrelevant after edge closure. L3.

**Validation/coverage.** Graph-path mutation lineage.

### Family `audit_distance_time`

**Task.** Diagnose route total, speed average, stop, or ETA inconsistency.

**Response/template.** wrong step/correct metric.

**Derivation.** Recompute leg distances/times and clock arithmetic independently.

**Difficulty.** L1 sum; L2 weighted speed; L3 stops; L4 date rollover.

**Misconceptions/constraints.** Synthetic constant leg speeds.

**Feedback.** Leg cost table.

**Examples.**

1. distances 3+4 reported 5 confuses displacement with route total. L1.
2. arithmetic-average speeds gives wrong overall speed for unequal times/distances. L2.
3. ETA omitted 20-min stop → 20 min early. L2.

**Validation/coverage.** Route metric oracle.

### Family `audit_position_fix`

**Task.** Diagnose reciprocal-bearing error, wrong ray, circle ambiguity, or inconsistent observation.

**Response/template.** defect/possible region.

**Derivation.** Reconstruct loci and intersections from raw observations.

**Difficulty.** L1 wrong reciprocal; L2 choose two intersections; L3 north offset; L4 uncertainty.

**Misconceptions/constraints.** No averaging inconsistent exact observations.

**Feedback.** Overlay correct/incorrect loci.

**Examples.**

1. observer-to-landmark bearing 030 plotted from landmark as 030 instead of reciprocal 210. L2.
2. two range circles yield two points; picking one without clue overclaims. L2.
3. nonoverlapping uncertainty regions indicate inconsistency. L3.

**Validation/coverage.** Locus provenance.

### Family `audit_measurement_false_precision`

**Task.** Choose honest rounding/region from map scale, ruler, contour interval, bearing, or coordinate precision.

**Response/template.** rounded value/interval and reason.

**Derivation.** Propagate declared input resolution through calculation.

**Difficulty.** L1 scale ruler; L2 contour bound; L3 bearing sector; L4 combined uncertainty.

**Misconceptions/constraints.** Do not demand formal statistics.

**Feedback.** Show resolution at each transformation.

**Examples.**

1. ±25 m ground uncertainty does not support nearest centimeter. L1.
2. point between 100/120 contours is not exactly 110 without model. L2.
3. bearing ±3° and range interval yield a region, not one coordinate. L3.

**Validation/coverage.** Interval/region propagation.

### Family `map_supported_claim`

**Task.** Select strongest claim supported by full synthetic map and calculations.

**Response/template.** controlled claim choice.

**Derivation.** Evaluate claim AST over source/date/north/scale/topology/terrain/route/uncertainty model.

**Difficulty.** L1 direct feature; L2 route metric; L3 uncertainty/scope; L4 several plausible partial claims.

**Misconceptions/constraints.** Avoid real safety/current access assertions.

**Feedback.** Evidence checklist and limiting fields.

**Examples.**

1. “Route A is 2 km shorter in the supplied graph” supported by totals. L1.
2. “Route A is safer” unsupported without a safety model. L2.
3. “Position lies within shaded intersection under stated observation bounds” supported, not exact center. L3.

**Validation/coverage.** Claim predicate engine and uniqueness.

### Cross-family progression

Orientation, scale, coordinates, source, terrain, route, and position audits mirror the dependency order of solving a map problem. Distance/time and false-precision checks follow structural validity. Strongest-claim items integrate the whole audit while retaining limited truths.

## 10. Category: Map construction and route communication

### Category purpose

Choose and construct a bounded map/route representation that preserves orientation, scale, topology, and uncertainty.

### Learn

A usable synthetic map needs a north reference, scale, legend, coordinates or locatable features, source/date, and distinctions among routes, boundaries, terrain, and uncertainty. Route instructions need an ordered start/waypoints/end, direction or connected edges, distances/times, and declared constraints.

### Prerequisites

All map-reading, route, and audit skills.

### Category boundaries

Construction uses structured controls and generated data. It does not create a real map, navigation plan, or professional cartographic product.

### Subcategories

1. Scale/extent choice
2. Orientation/coordinate setup
3. Feature/topology plotting
4. Route instructions
5. Legend/annotations
6. Accessible summary and repair

### Common misconceptions

- Selecting detail without checking required extent.
- Omitting north/scale because route seems visually obvious.
- Drawing crossing lines as connected unintentionally.
- Giving unordered waypoint lists.
- Reporting uncertainty as a single point.
- Changing source geometry while “repairing” presentation.

### Family `choose_scale_extent`

**Task.** Choose RF/sheet extent satisfying supplied coverage and minimum feature-size requirements.

**Response/template.** scale/map choice and calculations.

**Derivation.** Convert ground extent to map dimensions; test sheet bounds and feature rendered size.

**Difficulty.** L1 coverage only; L2 detail only; L3 both; L4 no feasible candidate.

**Misconceptions/constraints.** Visibility threshold supplied, not assumed.

**Feedback.** Requirement table per candidate.

**Examples.**

1. A 10-km width on a 20-cm sheet requires denominator ≥ 50,000. L1.
2. A 100-m feature that must render at ≥ 2 mm requires denominator ≤ 50,000. L2.
3. both constraints may uniquely select 1:50,000. L3.

**Validation/coverage.** Scale inequality solver.

### Family `construct_oriented_grid`

**Task.** Place north arrow/grid axes/coordinate labels for a rotated map.

**Response/template.** structured orientation controls.

**Derivation.** Apply declared page rotation while preserving semantic east/north axes and label order.

**Difficulty.** L1 north-up; L2 90°; L3 arbitrary friendly rotation; L4 true/grid arrows both.

**Misconceptions/constraints.** No freehand angle precision.

**Feedback.** Preview compass/grid transformation.

**Examples.**

1. north-up → east right. L1.
2. north screen-right → east screen-down. L2.
3. grid north 2° east of true shown as distinct labeled arrows. L3.

**Validation/coverage.** Rotation/offset geometry.

### Family `plot_features_topology`

**Task.** Construct/repair a small feature network from coordinates/connectivity.

**Response/template.** place nodes/edges and junction/bridge status.

**Derivation.** Map coordinates through scale; connect only declared graph incidences.

**Difficulty.** L1 points; L2 paths; L3 crossing/nonjunction; L4 boundary/stream layer.

**Misconceptions/constraints.** Semantic snapping; source coordinates immutable.

**Feedback.** Graph versus rendered geometry overlay.

**Examples.**

1. A–B edge connects waypoint nodes. L1.
2. two edges geometrically cross without shared node → draw overpass/gap. L2.
3. bridge symbol added only where crossing relation says bridge. L3.

**Validation/coverage.** Coordinate and topology round trip.

### Family `construct_route_from_constraints`

**Task.** Select/plot a route satisfying waypoints, closures, mode, and objective.

**Response/template.** ordered edge/waypoint sequence.

**Derivation.** Filter graph, solve declared objective, render chosen path.

**Difficulty.** L1 one path; L2 waypoint; L3 closure/mode; L4 tie/multi-criteria.

**Misconceptions/constraints.** Synthetic metric only; no “safe” label.

**Feedback.** Feasibility then objective proof.

**Examples.**

1. A → C via required B. L1.
2. closed bridge removed before shortest-path search. L2.
3. tied shortest routes both acceptable unless secondary rule. L3.

**Validation/coverage.** Graph solver and rendered edge set.

### Family `write_route_instructions`

**Task.** Build/repair concise route instructions from an ordered route.

**Response/template.** structured sequence `{from, to, bearing, distance, action}`.

**Derivation.** Traverse edges in order; compute/attach declared metrics and unambiguous landmarks.

**Difficulty.** L1 cardinal grid; L2 bearings/distances; L3 junction actions; L4 uncertainty/status note.

**Misconceptions/constraints.** No natural-language free grading; semantic clauses localize.

**Feedback.** Match each instruction to route leg.

**Examples.**

1. From A travel east 1 km to B. L1.
2. Then follow bearing 135° for 500 m to C. L2.
3. “Turn at crossing” is ambiguous when several crossings; name waypoint/feature. L3.

**Validation/coverage.** Instructions replay to exact path.

### Family `design_legend_annotations`

**Task.** Assign distinct symbols and add required scale/north/source/status labels.

**Response/template.** symbol-role mapping and annotation checklist.

**Derivation.** One-to-one legend mapping, non-color distinctions, required metadata.

**Difficulty.** L1 three features; L2 similar line types; L3 surveyed/estimated; L4 layer-specific date.

**Misconceptions/constraints.** Aesthetics not graded; semantic distinguishability is.

**Feedback.** Trace each feature to legend and metadata.

**Examples.**

1. trail/boundary use different dash patterns. L1.
2. estimated position shown as region/dashed outline, not exact point. L2.
3. source date attached to relevant layer. L3.

**Validation/coverage.** Legend injectivity and metadata completeness.

### Family `map_repair_accessible_summary`

**Task.** Repair a flawed synthetic map and produce/select a concise accessible summary.

**Response/template.** repair operations plus controlled summary.

**Derivation.** Preserve semantic source; correct north/scale/legend/topology/precision; summarize extent, orientation, features, route, and limitations.

**Difficulty.** L1 missing scale/north; L2 topology/legend; L3 uncertainty/source; L4 multiple linked defects.

**Misconceptions/constraints.** Exactly specified defects; repair cannot invent access/safety/current status.

**Feedback.** Before/after invariant checklist.

**Examples.**

1. add north arrow and 1-km graphic scale. L1.
2. mark road crossing as nonjunction according to topology. L2.
3. summary: “Synthetic route A–B is 4.2 km under 1:25,000 scale; bridge status is from 2022 layer and current availability is unknown.” L3.

**Validation/coverage.** Repaired rendering/source checksum and claim truth.

### Cross-family progression

Scale/extent choice precedes orientation and feature plotting. Route construction uses already valid topology. Structured instructions must replay the route. Legend/annotation work ensures independent interpretation. Final repair/summary tasks integrate map semantics without modifying source truth or inventing real-world guarantees.

## 11. Topic-level progression

### Level 1: Orientation and direct reading

- Use north-up compass rose and cardinal bearings.
- Interpret friendly RF/verbal scales.
- Read integer `(E, N)` points and four-figure grid squares.
- Match legend symbols and labeled contours.
- Follow two/three simple connected legs.

### Level 2: Conversion and comparison

- Handle reciprocal/quadrant bearings and wraparound turns.
- Convert map/ground distance and measure polylines.
- Use six-figure references, DMS, coordinate distance/midpoint.
- Read slopes, hills/valleys, route ascent, time, and simple graph alternatives.
- Combine one bearing/range locus.

### Level 3: Integrated map reasoning

- Rotate maps and convert true/grid/magnetic references.
- Account for resizing, area scale, measurement precision, and partial coordinate precision.
- Build terrain profiles, drainage/pass reasoning, and line-of-sight checks.
- Solve constrained/fastest/waypoint routes.
- Intersect observations and preserve ambiguity/uncertainty.

### Level 4: Audit and multi-criteria work

- Diagnose plausible north/scale/coordinate/contour/route errors.
- Compare scale, time, ascent, and restrictions under explicit objectives.
- Reconcile map date/status/layers with claims.
- Audit proposed position fixes and propagate uncertainty regions.
- Construct/repair maps while retaining topology and source truth.

### Level 5: Bounded navigation-map lab

- Inspect a synthetic map with rotated frame, legend, contours, scale, and route graph.
- Convert a declared bearing reference.
- Locate or estimate a start from observations.
- Find and compare feasible routes.
- Compute distance, time, and ascent with honest precision.
- Identify one planted inconsistency or certify declared invariants.
- Produce an accessible route/map summary with limitations.

Difficulty rises through convention coordination, representation transfer, constraints, and uncertainty—not through illegibility or real hazard stakes.

## 12. Adaptive practice guidance

Track mastery by family, representation, north reference, bearing quadrant/wrap, scale/unit, coordinate schema, terrain feature, graph constraint, and misconception:

- `screen_up_is_north`
- `bearing_from_east`
- `bearing_counterclockwise`
- `reciprocal_360_minus`
- `quadrant_letters_swapped`
- `declination_sign_mnemonic`
- `heading_equals_track`
- `scale_multiply_divide`
- `scale_denominator_detail`
- `unit_ratio_mixed`
- `path_as_endpoint_distance`
- `area_uses_linear_scale`
- `northing_before_easting`
- `grid_square_as_point`
- `dms_base100`
- `lat_lon_swap`
- `contour_lines_vs_intervals`
- `close_contours_mean_high`
- `valley_v_reversed`
- `net_as_total_ascent`
- `route_crossing_as_junction`
- `average_speed_arithmetic`
- `shortest_equals_fastest`
- `bearing_ray_wrong_origin`
- `single_observation_exact_fix`
- `uncertainty_center_as_truth`
- `mapped_means_current_safe`

After an error:

- Screen-up assumption → same geometry with rotated north arrow and cardinal-only response.
- Bearing wrap error → paired 350 → 020 turns/reciprocals.
- Declination sign error → draw true/magnetic north rays and use signed definition.
- Scale unit error → force same units before one-step conversion.
- Grid-order error → “right then up” trace before six figures.
- Contour interval error → count spaces between two labels.
- Route topology error → show graph nodes over geometric crossings.
- Average-speed error → request leg times before overall rate.
- Exact-fix overclaim → replace one ray with visible sector/annulus and ask for region.

Suggested session mix:

- 55% current-level mixed map reasoning;
- 20% orientation/scale/coordinate repair;
- 15% spaced review;
- 10% inverse/audit/construction.

Correct setup with arithmetic slip should retain orientation/route mastery and trigger a shorter numeric follow-up rather than resetting the whole skill.

## 13. Answer checking and worked feedback

### Directions and coordinates

- Normalize azimuths modulo 360 and compare at requested angular tolerance.
- Preserve reference labels (true/grid/magnetic); equal numeric values with wrong reference are not automatically correct.
- Quadrant bearings parse structurally and convert to azimuth.
- Coordinate fields retain schema/order and precision region.
- Route sequences compare graph edge/node IDs in order.

### Numeric and geometric answers

- Use exact rational/unit arithmetic for scale, time, gradients, and friendly coordinates.
- Use double precision only for audited trig/intersection calculations; retain unrounded values.
- Click/draw answers snap to semantic rays, regions, nodes, and edges.
- Multiple possible fixes/routes are set-checked when evidence/objective permits ties.
- Interval/region answers must contain the complete semantic possible set; a center point is not equivalent.

### Claims

Controlled claim model:

```text
Claim {
  mapVersion,
  featureOrRoute,
  northReference,
  coordinateSchema,
  metric,
  comparator,
  timeScope,
  status,
  precision,
  safetyOrAccessStrength
}
```

Classify as supported, false, undetermined, stale/out-of-scope, too precise, or forbidden safety/access overclaim.

### Feedback sequence

1. Name north/coordinate/scale convention.
2. Extract map facts/constraints.
3. Show geometry or graph operation.
4. Calculate with units and normalization.
5. Check reciprocal/scale/route/terrain invariant.
6. State result and precision/claim limit.

Examples:

> `250°+180°=430°`; normalize to `070°`. `360°−250°=110°` is not the reciprocal rule.

> The segment is 5 cm at `1:20,000`: `5×20,000=100,000 cm=1 km`.

> The two circles meet at two points. Without the “north of the road” clue, both remain possible.

## 14. Rendering, interaction, and accessibility

- Use SVG from semantic geometry; Canvas may supplement terrain shading only with semantic hit regions.
- Every map has a text feature/route table, north/reference summary, scale statement, and coordinate bounds.
- Keyboard users can traverse landmarks, edges, contour labels, crossings, waypoints, and observation constraints.
- Screen readers hear feature ID/type, coordinate/elevation, connections, status/date, and selected route membership.
- Color is supplemented by symbol, dash, pattern, label, or layer name.
- North arrows and bearing arcs include textual degrees/reference.
- Graphic scale bars expose segment ground values.
- Contours expose ordered labels and a profile/table alternative.
- Crossing connectivity is announced explicitly.
- Possible-position regions expose constraint inequalities and bounding boxes.
- Zoom/pan must not change semantic scale; display zoom and map scale are separately labeled.
- Route drawing/rotation/ruler tasks have structured numeric/select alternatives.
- Motion is optional and reduced-motion safe.

Intentionally flawed audit maps must remain readable and accessible; accessibility defects are not used as puzzle difficulty.

## 15. Implementation architecture

The standalone HTML/CSS/JavaScript app uses synthetic map geometry and no backend, GPS, geolocation permission, map tile service, or live route API.

Recommended modules:

- seeded PRNG/replay token;
- exact rational/unit/date arithmetic;
- vector, angle, segment, polygon, circle, ray, and region geometry;
- coordinate/reference formatters;
- scale/unit conversion engine;
- semantic feature/layer/legend/source model;
- contour/terrain scalar field and profile generator;
- directed weighted multi-mode route graph;
- shortest-path/state-augmented objective solver;
- observation/locus/uncertainty constraint engine;
- claim AST evaluator;
- deliberate mutation/repair provenance;
- SVG map/profile renderer and accessible table/summary;
- adaptive scheduler and localization dictionaries.

Each instance stores:

```js
{
  seed,
  familyId,
  level,
  mapFrame,
  northReferences,
  scale,
  coordinateSchema,
  layers,
  features,
  terrain,
  routeGraph,
  observations,
  uncertaintyModel,
  requestedQuantity,
  canonicalAnswer,
  acceptedRegionsOrTies,
  mutation,
  misconceptionTags,
  workedSteps,
  structuralSignature
}
```

Generators construct the semantic world; independent geometry/graph oracles solve it. Rendering is never reverse-read as answer truth.

## 16. Automated validation requirements

Reject an instance unless:

- north arrows/reference offsets and rendered directions agree;
- every bearing/ray round-trips through coordinate geometry;
- reciprocal/turn/quadrant conversions satisfy modular identities;
- scale conversions are dimensionally valid and graphic/numeric scales agree;
- semantic geometry is resolvable at declared measurement precision;
- grid references contain target regions and retain leading digits;
- geographic coordinates satisfy ranges/hemisphere signs;
- contour levels/topology/terrain samples agree and ordinary contours do not cross;
- stream direction descends and valley/ridge classifications match terrain;
- route graph incidence matches rendered crossings/bridges;
- all route costs/constraints/objectives produce declared unique/tied results;
- total ascent−descent equals net elevation change;
- observation loci/intersections match forward-predicted bearings/ranges;
- uncertainty answer contains exactly the feasible region/set under declared model;
- source/date/status claims have audited truth scope;
- planted defect has one primary cause and repair preserves source truth;
- choices are distinct and generated from named misconceptions.

Independent checks should include:

- rotation matrix versus compass-sector result;
- vector bearing versus inverse/reciprocal;
- RF conversion forward/inverse and dimensional units;
- polyline path versus segment sum;
- grid-reference encoder/decoder containment;
- DMS/decimal round trip;
- terrain scalar sampling versus contour labels/profile;
- gradient versus elevation/distance;
- route enumeration versus Dijkstra/state-augmented solver;
- path metrics versus independent leg fold;
- analytic ray/circle intersection versus forward observations;
- constraint-region membership sampling;
- map source model versus accessible feature/route tables;
- repaired map semantic checksum versus original.

Test suites require:

- golden fixtures for every family/level;
- bearing boundary/wrap/cardinal/quadrant/offset cases;
- all rotations and reciprocal twice identity;
- metric/US scale conversions, resized maps, area square factors;
- grid leading-zero/boundary/precision cases;
- DMS carries/hemisphere/range invalidity;
- contour interval, hills/depressions, valleys/ridges, saddles, profiles, visibility;
- graph crossings, one-way, closures, modes, waypoints, tied routes;
- time/ETA rollover and weighted speed;
- ray/circle zero/one/two intersection and uncertainty overlaps;
- stale/hidden/unknown source status;
- every mutation with a non-flawed control;
- accessibility/locale snapshots and deterministic replay.

Developer mode exposes seed, semantic map JSON, transforms, exact geometry, route candidates/costs, contour/terrain data, observation residuals, claim truth table, mutation lineage, and rejection reason.

## 17. Coverage requirements

This specification defines 90 question families:

- 11 orientation/bearing;
- 10 scale/distance;
- 10 grid/geographic-coordinate;
- 8 symbol/legend/evidence;
- 12 contour/terrain;
- 12 route/time/constraint;
- 10 position/observation;
- 10 audit;
- 7 construction/communication.

The implementation registry must compute and test this inventory.

Across a representative seeded corpus, cover:

- north-up and rotated maps;
- cardinal/intercardinal, arbitrary azimuth, quadrant, reciprocal, relative, true/grid/magnetic bearings;
- bearing wrap in both directions and signed offsets east/west;
- RF, verbal, graphic, resized, linear/area scales and honest precision;
- Cartesian/grids/four-/six-figure/DMS/decimal geographic coordinates;
- point, line, area, route, boundary, crossing, bridge, and layer/source metadata;
- contour interval/elevation bounds/gradient/hill/depression/ridge/valley/saddle/profile/visibility;
- connected/disconnected/directed/closed/mode-filtered/waypoint route graphs;
- shortest, fastest, least-ascent, weighted, lexicographic, and Pareto objectives;
- exact, ambiguous, inconsistent, and uncertain position evidence;
- supported, false, unknown, stale, too-precise, and safety/access-overclaim statements;
- forward read, inverse construction, comparison, diagnosis, and repair.

At least 25% of eligible questions should be inverse/audit/construction. At least 20% of advanced position/route questions should have multiple valid possibilities, no feasible result, or insufficient evidence when genuinely constructed. Non-flawed maps must appear at least as often as intentionally flawed maps in mixed practice.

Ordinary limits:

- 12 landmarks/features relevant to one task;
- 8 contour levels/12 route-contour crossings;
- 8 graph nodes/12 edges;
- 6 route legs;
- 3 independent observations;
- 4 map layers;
- 3 candidate routes/panels.

## 18. Navigation and v1 priorities

Recommended views:

- **Learn:** compass/bearing simulator, scale/unit guide, grid-reference tutorial, contour gallery, route/position evidence guide.
- **Practice:** category, family, level, representation, terrain/route filters.
- **Map lab:** toggle layers, inspect legend/source, measure semantic distances.
- **Route lab:** construct/compare paths and replay instructions.
- **Position lab:** overlay range/bearing constraints and uncertainty.
- **Audit lab:** find one root inconsistency and repair/scope the claim.
- **Reference:** bearing/offset equations, scale conversions, coordinate formats, contour rules.

Minimum satisfying v1:

1. rotated cardinal directions and azimuth/reciprocal bearings;
2. RF/verbal/graphic scale and straight/polyline distance;
3. easting/northing, coordinate distance, four-/six-figure grids;
4. legend symbols/crossing connectivity/date limits;
5. contour interval, elevation bounds, slope, hills/valleys, ascent;
6. route instructions, distance/time, validity, shortest/fastest;
7. range/bearing loci and bounded two-observation fixes;
8. north/scale/coordinate/route/precision audits.

V1.1 adds quadrant/true-grid-magnetic conversions, DMS, terrain profiles/visibility, constraints/waypoints, and uncertainty regions. V1.2 adds drift vectors, richer multi-criteria routes, three-observation fixes, and construction/repair.

## 19. Topic-level quality checklist

- [ ] Every map displays or explicitly states north, scale, coordinate convention, legend, and source/date when relevant.
- [ ] Screen up is never silently assumed north.
- [ ] Bearings are clockwise from a named north reference and normalized consistently.
- [ ] Reciprocal, turn, quadrant, and true/grid/magnetic conversions pass round trips.
- [ ] Declination/convergence signs follow displayed definitions, not mnemonics.
- [ ] Course, heading, track, bearing, and relative bearing remain distinct.
- [ ] Scale ratio uses like units before conversion; area uses the squared factor.
- [ ] Numeric scale invalidation under resizing is modeled correctly.
- [ ] Grid coordinates/references use easting before northing and preserve precision regions.
- [ ] Latitude precedes longitude; DMS is sexagesimal and never used for planar distance without a supplied model.
- [ ] Symbols/topology come from the displayed legend and semantic graph.
- [ ] Mapped presence/absence is not overclaimed as current real-world status.
- [ ] Contours obey interval/topology/terrain/drainage rules.
- [ ] Elevations between contours are bounded unless interpolation is explicitly modeled.
- [ ] Total ascent/descent is not confused with net elevation change.
- [ ] Route validity is checked before optimization.
- [ ] “Shortest,” “fastest,” and other objectives are explicit and independently verified.
- [ ] No synthetic result is described as a real safe/legal/passable route.
- [ ] Bearing/range observations produce rays/regions and preserve ambiguity.
- [ ] Accuracy/confidence statements do not become guaranteed exact points.
- [ ] Canonical answers derive from semantic geometry, never reverse pixel measurement.
- [ ] Audit feedback identifies consequence without accusing intent.
- [ ] Repairs preserve source geometry/topology/evidence.
- [ ] Every map has an accessible feature/route/contour alternative.
- [ ] Every family has three instantiated examples and automated fixtures.
- [ ] Difficulty rises through spatial integration/uncertainty, not illegibility or real danger.
- [ ] All maps, locations, routes, and status data are fictional and offline.
