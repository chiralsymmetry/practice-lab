# Architectural Geometry & Building Quantities — Dynamic Practice Specification

Status: implementation specification; fictional educational quantities only,
**not for estimating, procurement, design, fabrication, or construction**

Audience: exact-building-model generator, measurement-rule engine, quantity
takeoff renderer, semantic answer checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual requirements meanings.

## 1. Topic overview

### Topic name

Architectural Geometry & Building Quantities

### Topic goal

Develop fast, reliable geometric-quantity reasoning from small fictional
building models and coordinated drawings. The learner should become able to:

- distinguish count, length, area, volume, mass, ratio, and unit-rate quantities;
- convert linear, square, and cubic units without reusing a linear conversion
  factor incorrectly;
- identify the boundary and measurement basis before calculating;
- derive lengths, perimeters, projected areas, true surface areas, and volumes
  from plans, elevations, sections, dimensions, and schedules;
- separate gross quantity, stated deductions, and net quantity;
- quantify spaces, floors, walls, openings, finishes, façades, slabs, stairs,
  ramps, roofs, repeated components, and simple site solids;
- apply only supplied rules for opening deductions, laps, coverage, waste,
  packaging, density, and rounding;
- aggregate a takeoff without double-counting, mixing units, or losing source
  lineage;
- compare revisions and explain a quantity delta;
- recognize when a quantity is indeterminate because its basis, geometry, or
  rule is missing.

The target is fluent, auditable reasoning—not professional estimating judgment.

### Audience and prerequisites

The audience ranges from interested adults to architecture, construction,
interior, or quantity-surveying students practising foundational geometry.

Prerequisites:

- arithmetic with fractions, decimals, percentages, and ratios;
- rectangle, triangle, trapezoid, polygon, prism, and cylinder formulae;
- Pythagoras and simple slope;
- basic plan/elevation/section literacy;
- metric unit conversion.

Learn mode must introduce every measurement profile and specialized term before
it is scored. The sibling Architectural Drawing & Spatial Reasoning app owns
drawing-convention literacy; Geometry & Trigonometry owns general theorem
practice. This app applies those skills to building quantities.

### Standards and method-of-measurement boundary

There is no context-free quantity called simply “the floor area” or “the wall
length.” Legitimate methods can use different boundaries, inclusions,
deductions, descriptions, and aggregation rules. Every scored exercise must
therefore display a versioned `MeasurementProfile`; no convention may remain
implicit.

Reference points for qualified review are:

- [RICS New Rules of Measurement](https://www.rics.org/profession-standards/rics-standards-and-guidance/sector-standards/construction-standards/nrm),
  whose NRM 2 publication addresses detailed measurement for building works;
- [buildingSMART IFC 4.3.2 quantity sets](https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/concepts/Object_Definition/Quantity_Sets/content.html),
  which type quantities as count, length, area, volume, weight, time, or
  combinations and record a method of measurement;
- [IfcElementQuantity](https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcElementQuantity.htm),
  which distinguishes internationally applicable base quantities from a
  particular national method of measurement;
- [ISO 9836:2017](https://www.iso.org/standard/73149.html), formerly concerned
  with area and volume indicators. It was withdrawn in 2024 and is a historical
  review anchor only, not an active compliance target.

The app does not reproduce, certify, or teach any proprietary or jurisdictional
method in v1. Its bundled profiles are fictional and self-contained:

```text
pl-geom-base-v1
pl-space-face-v1
pl-wall-centreline-v1
pl-finish-deduction-v1
pl-supply-rule-v1
pl-site-solids-v1
```

Profile names must appear in plain language as well as by ID. A future
standards-aligned profile requires licensed source access, domain review,
versioning, and its own test corpus. Changing a rule creates a new profile ID;
saved answers never change silently.

### Professional and safety boundary

Every exercise and export states:

```text
FICTIONAL TRAINING QUANTITIES — NOT FOR ESTIMATING, ORDERING, DESIGN, OR CONSTRUCTION
```

The app must not:

- accept real project drawings, BIM models, bills, or schedules in v1;
- provide prices, bids, budgets, tender quantities, labour, productivity,
  procurement advice, or recommended order quantities;
- assert code, zoning, accessibility, fire, structural, environmental, energy,
  waterproofing, or occupational-safety compliance;
- recommend construction systems, materials, thicknesses, waste factors,
  coverage rates, densities, or deduction thresholds;
- imply that a generated takeoff is complete or professionally suitable;
- use local regulations as hidden inputs;
- describe a wrong exercise answer as dangerous or a correct one as safe.

Packaging, waste, density, coverage, excavation, and form-contact exercises use
explicit fictional data solely to train arithmetic. Actual work requires
project documents, current contractual measurement rules, product data, site
information, and qualified professionals.

### Exact semantic building model

All drawings, schedules, and quantities derive from one model:

```text
QuantityBuildingModel {
  projectId
  revisionId
  coordinateSystem
  levels[]
  storeys[]
  spaces[]
  walls[]
  slabs[]
  coverings[]
  roofs[]
  openings[]
  doors[]
  windows[]
  stairs[]
  ramps[]
  columns[]
  components[]
  siteRegions[]
  earthworkSolids[]
  sourceDimensions[]
}
```

Canonical coordinates are integer millimetres:

```text
x = east/right on canonical plan
y = north/up on canonical plan
z = elevation/up
```

V1 uses simple, non-self-intersecting polygons; prismatic walls and slabs;
rectangular openings; planar mono-pitch, gable, or hip roof faces; straight or
L-shaped stairs; planar ramps; and bounded prismatoid/site exercises. Curves
appear only as circular arcs, sectors, cylinders, or other shapes with an exact
independent oracle.

### Geometry truth versus measured quantity

`GeometryTruth` stores what exists geometrically. `MeasurementProfile` says how
that geometry is turned into a reported quantity:

```text
MeasurementProfile {
  id
  version
  quantityPurposeLabel
  boundaryBasis
  centrelinePolicy
  grossNetPolicy
  inclusionRules[]
  deductionRules[]
  minimumDeductionThresholds[]
  projectionPolicy
  aggregationPolicy
  roundingPolicy
  displayUnitPolicy
}
```

For example, one profile may measure a room to finished wall faces; another may
measure a storey to an outer envelope face. A wall run may use centreline,
inside face, outside face, or explicitly selected segment endpoints. These are
different questions, not alternative arithmetic answers.

Every generated instance must expose enough of the active rule in a compact
“Measurement basis” card. Advanced questions may ask which basis applies, but
may never require the learner to guess it.

### Quantity and lineage model

```text
QuantityValue {
  dimension: count | length | area | volume | mass | ratio | unitRate
  exactValue
  canonicalUnit
  displayValue
  displayUnit
  roundingStage
}

TakeoffLine {
  itemId
  elementIds[]
  typeCode
  location
  description
  measurementProfileId
  sourceViewIds[]
  sourceDimensionIds[]
  expressionTree
  grossQuantity
  deductions[]
  netQuantity
  supplyAdjustment?
  reportedQuantity
  notes[]
}
```

The calculation layers remain distinct:

```text
model geometry
→ base geometric quantity
→ measurement-rule inclusions/deductions
→ net measured quantity
→ optional supplied allowance
→ optional package rounding
→ reported answer
```

Feedback must never collapse these layers. In particular, exact/net quantity,
allowance-adjusted quantity, and whole-pack quantity are not synonyms.

### Unit and numeric model

Canonical values use exact integers or rationals in:

- millimetres for length;
- square millimetres for area;
- cubic millimetres for volume;
- grams for mass where a fictional density is supplied;
- dimensionless rational values for ratios.

The UI normally displays `mm`, `m`, `mm²`, `m²`, `mm³`, `m³`, `g`, `kg`, `%`,
or whole counts. Area and volume conversions exponentiate the linear factor:

```text
1 m = 1000 mm
1 m² = 1,000,000 mm²
1 m³ = 1,000,000,000 mm³
```

Irrational lengths/areas use deterministic high-precision decimal arithmetic,
then the declared final rounding rule. Intermediate rounding is forbidden unless
the question explicitly teaches its consequence.

### Scope

Included:

- quantity dimensions, units, scale-independent written dimensions, and chains;
- centreline/face boundaries and gross/net measurement;
- plan areas and perimeters;
- walls, openings, façades, finishes, slabs, ceilings, stairs, and ramps;
- roof slopes, faces, edges, openings, and coverings;
- repeated elements, schedules, coverage, supplied allowances, packaging,
  sheet yield, and density-based mass;
- building massing and simple fictional site/excavation solids;
- takeoff tables, source traceability, aggregation, reconciliation, revision
  comparison, omissions, duplicates, and root-cause audits.

### Exclusions

Excluded:

- cost, currency, valuation, cash flow, bids, bills of quantities for real work,
  procurement, contracts, tendering, and claims;
- professional quantity-surveying rules not reproduced in the exercise;
- building-code and design adequacy;
- structural loads, reinforcement schedules, MEP sizing, thermal/acoustic
  performance, embodied carbon, and life-cycle analysis;
- complex freeform surfaces, point clouds, real terrain, geotechnical behaviour,
  bulking/shrinkage, and machine productivity;
- automatic takeoff from uploaded raster/PDF/CAD/BIM files;
- optimization claims for cutting stock or purchasing beyond small exact puzzles;
- visual estimation from pixels when written/model dimensions exist.

### Global answer conventions

- Ignore surrounding whitespace.
- Accept locale-aware decimal separators, but never accept both comma-as-decimal
  and comma-as-list-separator ambiguously in one profile.
- Numeric fields accept integers, finite decimals, and simple fractions where
  the family permits them.
- A unit may be entered in the same field or selected separately. If the prompt
  fixes the unit, a bare number means that unit.
- Equivalent compatible units are accepted when unit entry is enabled.
- Reject a correct numeral with an incompatible quantity dimension.
- Counts are non-negative integers unless the task is a signed revision delta.
- Percent and decimal ratio forms are accepted only when the prompt permits both.
- Ordered answers preserve order; set answers do not.
- Selection/construction answers compare semantic IDs or exact geometry, never
  pixel coordinates.
- Apply the declared final rounding mode: exact, nearest, down, up, or whole
  package. A tolerance may cover representation error, never conceptual error.
- If information is intentionally insufficient, accept only the structured
  `cannot determine` choice plus the correct missing fact/reason.

### Difficulty philosophy

Difficulty increases through:

- moving from one primitive to composite or three-dimensional geometry;
- changing plan projection into true surface quantity;
- requiring the learner to identify a boundary or rule before calculating;
- combining inclusions, exclusions, and threshold deductions;
- coordinating plan, elevation, section, schedule, and revision evidence;
- grouping repeated elements while preserving type/location distinctions;
- reversing a relationship or finding a missing dimension;
- diagnosing one root error in a plausible takeoff;
- deciding that the supplied information is insufficient.

Difficulty must not increase through tiny drawings, illegible clutter, excessive
arithmetic, arbitrary decimals, hidden conventions, obscure product knowledge,
time pressure, or deliberately misleading prose.

### Shared generation and rejection rules

Every instance must:

- derive from the semantic model and active profile;
- state purpose, basis, units, and rounding needed to determine one answer;
- retain stable element/source IDs and a serializable expression tree;
- have an independently recomputed oracle;
- use friendly geometry at early levels and meaningful complexity later;
- show all necessary dimensions without requiring screen measurement;
- distinguish projected, true, gross, net, adjusted, and packaged quantities;
- generate distractors from named misconceptions;
- provide three-layer feedback: geometry, rule, arithmetic.

Reject an instance when:

- geometry is invalid, self-intersecting, overlapping unintentionally, or
  topologically inconsistent;
- a dimension chain is contradictory unless contradiction is the task;
- a boundary or deduction convention is implicit;
- two displayed choices are equivalent after unit conversion/rounding;
- an intended deduction is exactly on an unstated threshold boundary;
- intermediate and final rounding accidentally produce the same choices in a
  rounding-focused question;
- labels obscure relevant geometry;
- the calculation is dominated by tedious multiplication rather than the target
  reasoning;
- a near-identical structural signature appeared recently;
- the answer would imply professional completeness or a real recommendation.

## 2. Category: Measurement basis, dimensions, units, and rounding

### Category purpose

Train the habit of identifying what kind of quantity is requested, where its
boundary lies, which rule transforms geometry, and when rounding occurs.

### Learn

Write the quantity dimension first. Convert units with the correct power. Then
identify the measurement line or face, calculate exact geometry, apply stated
deductions, and round only at the named stage. “Gross,” “net,” “centreline,” and
“finished face” are rules, not decorations.

### Prerequisites

Arithmetic, metric prefixes, rectangle/prism formulae.

### Category boundaries

This category isolates measurement mechanics. Later categories apply them to
specific building elements.

### Common misconceptions

- Converting `m²` or `m³` with the linear factor.
- Attaching an area unit to a perimeter.
- Treating outer-face, inner-face, and centreline dimensions as interchangeable.
- Deducting an opening regardless of the stated threshold.
- Rounding every line before an exact subtotal.
- Treating allowance and package rounding as part of geometric area.

### Family `quantity_dimension_identify`

**Task/purpose.** Identify the dimension and valid unit of a described quantity,
preventing formula use before the target is understood.

**Response/template.** Matching: `Classify “{quantityDescription}” and choose a valid unit.`

**Derivation.** Map the semantic property to count/length/area/volume/mass/ratio/
unit-rate, then to compatible units.

**Difficulty.** L1 obvious perimeter/area; L2 surface versus volume; L3 ratio or
coverage rate embedded in a takeoff line.

**Distractors/constraints.** Use same-context wrong dimensions (`m`, `m²`, `m³`);
never rely on wording alone when a diagram is required.

**Feedback.** State what is being counted or measured and its dimensionality.

**Examples.** (1) skirting run→length, `m` (L1). (2) concrete in a slab→volume,
`m³` (L2). (3) window area / wall area→ratio or `%` (L3).

**Validation.** Unit registry confirms exactly one dimension class; all shown
units have parsed dimensions.

### Family `linear_unit_convert`

**Task/purpose.** Convert a building length between stated metric units.

**Response/template.** Decimal number: `Convert {value} {fromUnit} to {toUnit}.`

**Derivation.** Convert through exact canonical millimetres.

**Difficulty.** L1 whole m↔mm; L2 decimal m↔mm/cm; L3 mixed dimension chain units.

**Distractors/constraints.** Reciprocal factor, decimal-place error, unchanged
number; exclude area/volume here.

**Feedback.** Show one exact factor chain.

**Examples.** (1) `3.2 m = 3200 mm` (L1). (2) `475 cm = 4.75 m` (L2). (3)
`2.35 m + 680 mm = 3030 mm` (L3).

**Validation.** Exact rational round-trip and declared display precision.

### Family `area_unit_convert`

**Task/purpose.** Convert square units using the squared linear factor.

**Response/template.** Decimal number: `Convert {value} {fromAreaUnit} to {toAreaUnit}.`

**Derivation.** Convert through exact square millimetres.

**Difficulty.** L1 `m²↔mm²`; L2 `cm²`; L3 conversion inside a deduction.

**Distractors/constraints.** Linear-factor result, cubic-factor result, moved
decimal once.

**Feedback.** Expand `(1000 mm)²`.

**Examples.** (1) `2 m² = 2,000,000 mm²` (L1). (2) `35,000 cm² = 3.5 m²`
(L2). (3) `18 m² − 240,000 mm² = 17.76 m²` (L3).

**Validation.** Dimensional unit engine; exact inverse conversion.

### Family `volume_unit_convert`

**Task/purpose.** Convert cubic units using the cubed linear factor.

**Response/template.** Decimal number: `Convert {value} {fromVolumeUnit} to {toVolumeUnit}.`

**Derivation.** Convert through exact cubic millimetres.

**Difficulty.** L1 whole `m³↔mm³`; L2 litres where explicitly taught; L3 mixed
units in a prism.

**Distractors/constraints.** Linear/square factor, confusion between `L` and
`m³`; litre support must define `1000 L = 1 m³`.

**Feedback.** Expand `(1000 mm)³`.

**Examples.** (1) `0.8 m³ = 800,000,000 mm³` (L1). (2) `1250 L = 1.25 m³`
(L2). (3) `4 m × 3000 mm × 0.2 m = 2.4 m³` (L3).

**Validation.** Exact canonical conversion and dimensional parse.

### Family `dimension_chain_missing`

**Task/purpose.** Recover a missing segment or overall dimension before takeoff.

**Response/template.** Number with unit: `What is dimension {label}?`

**Derivation.** Solve an exact additive interval equation from shared witness
points.

**Difficulty.** L1 one subtraction; L2 mixed units; L3 chained inside/outside
faces with a stated wall thickness.

**Distractors/constraints.** Add instead of subtract, omit/add thickness,
wrong witness points; chain must be sufficient and consistent.

**Feedback.** Highlight contributing intervals and write the equation.

**Examples.** (1) `8.0−3.2=4.8 m` (L1). (2) `7200−850−2350=4000 mm` (L2).
(3) overall outside `10.4 m`, two `0.2 m` walls→inside `10.0 m` (L3).

**Validation.** Coordinate-derived interval equals chain solution.

### Family `measurement_boundary_select`

**Task/purpose.** Select the exact line/face used by a displayed profile.

**Response/template.** Semantic line selection: `Which highlighted boundary is used for {quantityName}?`

**Derivation.** Resolve profile `boundaryBasis` to model face/centreline IDs.

**Difficulty.** L1 room finished face; L2 external envelope face; L3 wall
junction where centreline and faces turn differently.

**Distractors/constraints.** Other real model boundaries, not arbitrary lines;
profile card stays visible.

**Feedback.** Overlay the chosen measurement path and name the rule.

**Examples.** (1) net room area→inner finished faces (L1). (2) wall run→wall
centreline (L2). (3) gross storey area→outer envelope polygon (L3).

**Validation.** Selected semantic path is closed/continuous where required.

### Family `gross_deduction_net`

**Task/purpose.** Apply explicit inclusion/deduction rules to a gross quantity.

**Response/template.** Named fields: `gross`, `deductions`, `net`.

**Derivation.** Sum included base quantities; evaluate every threshold; compute
`net = gross − deductions + additions`.

**Difficulty.** L1 one deduction; L2 several openings and threshold; L3 one
addition plus grouped deductions.

**Distractors/constraints.** Deduct all, deduct none, reverse threshold, subtract
twice; avoid unstated professional conventions.

**Feedback.** Table each candidate item as include/deduct/ignore with reason.

**Examples.** (1) `24−2=22 m²` (L1). (2) `40−(2.1+1.8)=36.1 m²` (L2).
(3) `60+1.2−4.5=56.7 m²` (L3).

**Validation.** Independent rule evaluator and arithmetic identity.

### Family `rounding_stage_apply`

**Task/purpose.** Round at the stated line, subtotal, allowance, or package stage.

**Response/template.** Number and stage choice: `Report {quantity} using {roundingRule}.`

**Derivation.** Preserve exact values through the expression tree, then apply
the named IEEE-independent decimal rule at exactly one node.

**Difficulty.** L1 nearest final decimal; L2 compare line versus subtotal
rounding; L3 allowance then whole packages.

**Distractors/constraints.** Truncate, round intermediate lines, banker/half-up
confusion; tie policy must be named.

**Feedback.** Show the exact subtotal and the single rounding boundary.

**Examples.** (1) `12.346→12.35 m²` half-up (L1). (2) `1.234+1.234=2.468→2.47`,
not `2.46` (L2). (3) `41.2×1.08=44.496`, packs of 5→9 packs (L3).

**Validation.** Decimal-library oracle; fixture must distinguish target error.

### Cross-family progression

Quantity dimension and one-dimensional conversion precede squared/cubed units.
Dimension chains then establish geometry. Boundary selection precedes
gross/deduction/net. Rounding is introduced last and later interleaved with all
categories without obscuring the geometric skill.

## 3. Category: Plans, spaces, floor areas, and perimeters

### Category purpose

Derive horizontal quantities from dimensioned plans while preserving the stated
boundary, zones, voids, and opening rules.

### Learn

A plan area comes from its boundary polygon, not from a label or screen
measurement. Decompose friendly shapes or use coordinates. For net quantities,
calculate the gross region first, then classify holes and excluded zones.
Perimeter quantities follow a path and may stop at specified openings.

### Prerequisites

Category 2; rectangle, triangle, trapezoid, and polygon area.

### Category boundaries

Wall vertical faces belong to Category 4; slabs and vertical circulation belong
to Category 5; general geometric proofs remain in Geometry & Trigonometry.

### Common misconceptions

- Multiplying the bounding-box dimensions of an L-shaped space.
- Subtracting a recess twice after decomposition.
- Confusing room area with storey outer-face area.
- Treating a void as floor finish.
- Using area where skirting requires a perimeter.
- Deducting the width of every doorway despite a profile that bridges small gaps.

### Family `rectangular_space_area_perimeter`

**Task/purpose.** Compute area or perimeter of one rectangular plan region.

**Response/template.** Number with unit: `Find the {area|perimeter} of Space {id}.`

**Derivation.** From selected face coordinates compute `A=L×W` or `P=2(L+W)`.

**Difficulty.** L1 whole metres; L2 mixed displayed units; L3 recover one side
from a chain first.

**Distractors/constraints.** Area/perimeter swap, `L+W`, unit-power error.

**Feedback.** Highlight dimensions and formula with units.

**Examples.** (1) `4×3=12 m²` (L1). (2) `5.4×3.5=18.9 m²` (L2). (3) sides
`7.2` and `2.8 m`, perimeter `20 m` (L3).

**Validation.** Polygon shoelace/edge-sum agrees with formula.

### Family `composite_orthogonal_area`

**Task/purpose.** Compute an L/T/U-shaped area by exact decomposition or
subtraction.

**Response/template.** Decimal number with area unit.

**Derivation.** Union non-overlapping rectangles or bounding rectangle minus
holes/recesses.

**Difficulty.** L1 one rectangular recess; L2 three components; L3 choose a
decomposition after recovering dimensions.

**Distractors/constraints.** Bounding box only, recess added, overlap counted
twice; at least two valid solution paths should agree.

**Feedback.** Shade one decomposition and show an alternative check.

**Examples.** (1) `8×6−3×2=42 m²` (L1). (2) `20+12+9=41 m²` (L2). (3)
`12×9−(3×2+2×4)=94 m²` (L3).

**Validation.** Polygon clipping area equals two independent decompositions.

### Family `coordinate_polygon_area`

**Task/purpose.** Calculate a non-self-intersecting plan polygon from coordinates.

**Response/template.** Decimal number with area unit.

**Derivation.** Exact shoelace sum; an independent triangulation oracle checks it.

**Difficulty.** L1 orthogonal polygon; L2 one diagonal edge; L3 orientation and
translation varied.

**Distractors/constraints.** Signed area not absolutized, bounding box, omitted
closing edge; coordinates fit a readable grid.

**Feedback.** Show ordered vertices and cross-products or triangles.

**Examples.** (1) `(0,0),(4,0),(4,3),(0,3)`→`12 m²` (L1). (2) triangle
`(0,0),(6,0),(2,4)`→`12 m²` (L2). (3) five-vertex polygon→`27.5 m²` (L3).

**Validation.** Simple polygon, nonzero area, shoelace=triangulation.

### Family `net_space_area`

**Task/purpose.** Compute space area to the profile’s finished-face boundary,
excluding stated internal holes.

**Response/template.** Named fields: gross polygon area, holes, net area.

**Derivation.** Area of outer face loop minus contained excluded loops.

**Difficulty.** L1 rectangle; L2 column/shaft hole; L3 composite outer loop and
multiple thresholded holes.

**Distractors/constraints.** Centreline/outside boundary, include all holes,
subtract wall footprint again.

**Feedback.** Color outer loop and each counted hole.

**Examples.** (1) `5×4=20 m²` (L1). (2) `30−0.6=29.4 m²` (L2). (3)
`48−1.2−0.8=46 m²` (L3).

**Validation.** Containment, non-overlap, exact polygon-with-holes oracle.

### Family `gross_storey_area`

**Task/purpose.** Measure a storey to the stated outer boundary with listed
void/inclusion rules.

**Response/template.** Decimal number with area unit.

**Derivation.** Select outer storey footprint, union included projections, then
apply only profile deductions.

**Difficulty.** L1 single rectangle; L2 wing/recess; L3 atrium or canopy whose
inclusion is explicitly stated.

**Distractors/constraints.** Sum room nets, use centreline, silently deduct all
voids; basis card mandatory.

**Feedback.** Overlay the reported boundary and classify each special region.

**Examples.** (1) outer `10×8=80 m²` (L1). (2) wings `60+24=84 m²` (L2).
(3) `120−12` counted atrium void=`108 m²` (L3).

**Validation.** Boolean polygon union/difference and no double-count.

### Family `wall_footprint_plan_area`

**Task/purpose.** Compute plan area occupied by selected walls.

**Response/template.** Decimal number with area unit.

**Derivation.** Exact union of wall plan polygons; do not sum overlapping corner
rectangles twice.

**Difficulty.** L1 one wall `L×t`; L2 L-junction; L3 multiple T/cross junctions.

**Distractors/constraints.** Centreline length×thickness without corner
correction, room area, one face only.

**Feedback.** Show individual wall polygons and union overlap.

**Examples.** (1) `5×0.2=1 m²` (L1). (2) two 4 m walls at a corner→subtract
`0.2²` overlap (L2). (3) three-wall union `2.36 m²` (L3).

**Validation.** Polygon union area; independent raster test may be diagnostic
but not authoritative.

### Family `floor_finish_zone_quantity`

**Task/purpose.** Sum areas receiving a named fictional finish, excluding other
zones and holes.

**Response/template.** Number plus selected included space IDs.

**Derivation.** Filter spaces/subregions by finish code and revision, then sum
their profile-defined net areas.

**Difficulty.** L1 one room; L2 several rooms; L3 split room zones and a void.

**Distractors/constraints.** Include adjacent different finish, use gross room
area, omit small zone.

**Feedback.** Highlight included zones and subtotal by source ID.

**Examples.** (1) F1 room=`14 m²` (L1). (2) F2 rooms `12+18=30 m²` (L2).
(3) F3 zones `9.5+6.2−0.4=15.3 m²` (L3).

**Validation.** Spatial partition exactly covers each room; IDs unique.

### Family `perimeter_with_opening_rules`

**Task/purpose.** Compute skirting, trim, or edge length along a room boundary
using explicit bridge/deduct opening rules.

**Response/template.** Number with length unit.

**Derivation.** Traverse ordered boundary edges; subtract only qualifying
opening intervals or bridge them as profile states.

**Difficulty.** L1 no openings; L2 door gaps; L3 threshold and corner returns.

**Distractors/constraints.** Subtract all openings, subtract opening area, count
shared edge twice.

**Feedback.** Animate/number the measured path and gaps.

**Examples.** (1) `2(4+3)=14 m` (L1). (2) `18−0.9=17.1 m` (L2). (3)
`22−(1.0+1.2)+0.4 returns=20.2 m` (L3).

**Validation.** Interval union on boundary; openings hosted and non-overlapping.

### Family `plan_quantity_audit`

**Task/purpose.** Find one incorrect boundary, omitted region, duplicate region,
unit, or arithmetic step in a plan takeoff.

**Response/template.** Select takeoff line/region and correction.

**Derivation.** Compare learner-facing takeoff against independent exact plan
quantities; trace first mismatching expression node.

**Difficulty.** L1 arithmetic; L2 wrong boundary/deduction; L3 one root error
affects several subtotals.

**Distractors/constraints.** Mutate exactly one root fact; downstream consequences
are not additional root defects.

**Feedback.** Overlay source geometry and show correct dependency chain.

**Examples.** (1) `4×3` entered `14 m²` (L1). (2) shaft not deducted (L2).
(3) room counted in two finish zones, inflating floor/storey totals (L3).

**Validation.** Mutation provenance and deterministic root-cause oracle.

### Cross-family progression

Rectangle work precedes composite and coordinate polygons. Net space and gross
storey quantities are deliberately contrasted. Wall footprint, finish zones,
and perimeter rules add semantic filtering. Audits appear only after direct
families are reliable.

## 4. Category: Walls, openings, façades, and vertical finishes

### Category purpose

Translate wall and façade geometry into run, face area, solid volume, opening,
finish, and ratio quantities without mixing measurement bases.

### Learn

A wall has a path, thickness, height, faces, ends, and hosted openings. Those
produce different quantities. A centreline run is not automatically the length
of either face around a corner. Gross face area is measured before stated
opening deductions; net finish area may use a different rule from wall volume.

### Prerequisites

Categories 2–3; plan/elevation correspondence.

### Category boundaries

Plan wall footprint is Category 3. Slabs and roofs have their own categories.
No structural, thermal, moisture, material-performance, or constructability
judgment is made here.

### Common misconceptions

- Using outer-face length when the centreline is requested.
- Multiplying total wall run by height before separating different heights.
- Subtracting an opening from one face but treating it as a solid-volume void
  incorrectly.
- Deducting every small penetration despite a displayed threshold.
- Adding reveals/returns when the profile excludes them, or vice versa.
- Dividing window area by net rather than specified gross wall area.

### Family `wall_run_by_basis`

**Task/purpose.** Compute a wall run along centreline, inner face, outer face, or
explicit endpoints.

**Response/template.** Length: `Under {basis}, what is the run of Walls {ids}?`

**Derivation.** Build the continuous semantic path at the selected offset and
sum exact segments/arcs.

**Difficulty.** L1 straight wall; L2 one corner; L3 connected walls with unequal
thickness or excluded segment.

**Distractors/constraints.** Alternative valid bases, chord for arc, junction
overlap; selected path must be unambiguous.

**Feedback.** Overlay the actual path, junction treatment, and segment sum.

**Examples.** (1) straight centreline `6 m` (L1). (2) L-run `4+3=7 m` (L2).
(3) outside-face segments `5.2+4.2−0.2=9.2 m` (L3).

**Validation.** Offset/path oracle and endpoints agree; connected topology.

### Family `gross_wall_face_area`

**Task/purpose.** Compute gross area of selected vertical wall faces before
deductions.

**Response/template.** Area with unit.

**Derivation.** For each planar face, multiply/triangulate true face length by
its bounded height; sum selected sides only.

**Difficulty.** L1 rectangle; L2 stepped height; L3 gable/trapezoidal top.

**Distractors/constraints.** Deduct openings early, count both sides, use wall
volume, ignore triangular top.

**Feedback.** Unfold/highlight each face and decompose its outline.

**Examples.** (1) `5×2.8=14 m²` (L1). (2) `4×3+2×1=14 m²` (L2). (3)
gable `8×3+½×8×1.5=30 m²` (L3).

**Validation.** 3D face mesh area equals 2D projected elevation polygon area for
vertical faces.

### Family `wall_solid_volume`

**Task/purpose.** Calculate gross or explicitly net solid volume of wall prisms.

**Response/template.** Volume with unit; basis shown.

**Derivation.** Union wall solids for gross; subtract hosted opening solids only
when the profile says they are voids.

**Difficulty.** L1 one prism; L2 corner union; L3 multiple heights/opening void.

**Distractors/constraints.** Face area only, corner double-count, subtract
opening area without thickness.

**Feedback.** Show `length × thickness × height`, junction union, and void prism.

**Examples.** (1) `5×0.2×3=3 m³` (L1). (2) L-wall raw sum minus corner
overlap (L2). (3) `6.0−(1.2×2.1×0.2)=5.496 m³` (L3).

**Validation.** Solid Boolean volume and decomposition oracle agree.

### Family `opening_area_and_void`

**Task/purpose.** Compute opening elevation area or through-wall void volume.

**Response/template.** Choose requested dimension and enter number/unit.

**Derivation.** Rectangular/polygon opening face area; multiply by host depth for
orthogonal void volume.

**Difficulty.** L1 one rectangle; L2 transom/composite opening; L3 clipped by a
sloped top.

**Distractors/constraints.** Perimeter, host wall face, area/volume unit swap.

**Feedback.** Identify opening outline and extrusion depth.

**Examples.** (1) `1.2×1.5=1.8 m²` (L1). (2) door+fanlight
`0.9×2.1+0.9×0.3=2.16 m²` (L2). (3) `1.8 m²×0.25 m=0.45 m³` (L3).

**Validation.** Opening remains within host; polygon and solid oracles agree.

### Family `net_wall_finish_area`

**Task/purpose.** Derive finish area from gross faces with stated opening,
reveal, return, and threshold rules.

**Response/template.** Named fields: gross, each deduction/addition, net.

**Derivation.** Evaluate the finish profile per face and opening; sum only the
specified sides/reveals.

**Difficulty.** L1 subtract one door; L2 thresholded windows; L3 add selected
reveals and treat two face finishes differently.

**Distractors/constraints.** Deduct all openings, count both faces, omit returns,
apply wall-volume rule.

**Feedback.** Itemized face schedule with include/deduct/add reason.

**Examples.** (1) `18−1.89=16.11 m²` (L1). (2) one `0.8 m²` opening below
`1 m²` threshold is not deducted (L2). (3) `40−5.4+1.2 reveals=35.8 m²`
(L3).

**Validation.** Rule engine independently evaluates every hosted opening.

### Family `facade_net_area`

**Task/purpose.** Compute gross and net area of one or more exterior façade
regions from elevations.

**Response/template.** Area fields by façade and total.

**Derivation.** Union coplanar exterior-face polygons, subtract qualifying
exterior opening projections, preserve orientation/type grouping.

**Difficulty.** L1 rectangle; L2 gable and openings; L3 stepped façade with
several finish zones.

**Distractors/constraints.** Plan footprint, both inner/outer faces, all-building
envelope when one orientation requested.

**Feedback.** Show façade outline, opening polygons, and orientation subtotal.

**Examples.** (1) south face `10×3=30 m²` (L1). (2) gable gross `36`, openings
`5`→`31 m²` (L2). (3) zones F1 `42`, F2 `18`, deductions `9`→`51 m²` (L3).

**Validation.** Elevation projection preserves vertical face area; regions do not
overlap.

### Family `window_to_wall_ratio`

**Task/purpose.** Compute a stated opening-to-gross-wall-area ratio without
making performance claims.

**Response/template.** Decimal or percent: `What is {openingSet}/{wallBasis}?`

**Derivation.** Sum selected glazed/opening areas and divide by the explicitly
defined gross wall denominator.

**Difficulty.** L1 one wall/window; L2 façade total; L3 distinguish glazed area
from rough opening and gross from net denominator.

**Distractors/constraints.** Reverse ratio, net denominator, frame-inclusive
area; no energy/code judgment.

**Feedback.** List numerator and denominator separately before division.

**Examples.** (1) `6/30=20%` (L1). (2) `(4+5)/45=20%` (L2). (3)
glazing `12.6` / gross wall `72`=`17.5%` (L3).

**Validation.** Ratio dimensionless, denominator positive, components disjoint.

### Family `envelope_quantity_audit`

**Task/purpose.** Diagnose one wall/opening/façade takeoff error.

**Response/template.** Select line/geometry/rule and corrected value.

**Derivation.** Compare source-linked quantities against wall-solid, face, and
profile-rule oracles; return first root mismatch.

**Difficulty.** L1 wrong multiplication; L2 wrong face/opening rule; L3 one
boundary error propagates into finish and ratio subtotals.

**Distractors/constraints.** Exactly one root mutation; plausible downstream
numbers remain internally consistent with the error.

**Feedback.** Trace wall→face→opening→net line.

**Examples.** (1) wall height read `2.8` as `3.8` (L1). (2) small opening wrongly
deducted (L2). (3) inner face used for exterior façade, changing three totals
(L3).

**Validation.** Mutation graph has one root and expected consequences only.

### Cross-family progression

Wall path precedes face area and solid volume. Opening geometry is learned
before finish rules. Façade aggregation and ratios follow, with audits last.
Gross/net contrasts should be interleaved so one formula never becomes a reflex.

## 5. Category: Slabs, ceilings, storeys, stairs, ramps, and vertical quantities

### Category purpose

Coordinate horizontal footprints with levels, thicknesses, slopes, voids, and
repeated storeys to obtain exact vertical-building quantities.

### Learn

Slab footprint, top surface, soffit, edge, and solid volume are different
quantities. Stairs combine counts and several surfaces. Ramps have a plan run
and a longer true sloping length. Voids must be deducted only from the elements
they actually pass through.

### Prerequisites

Categories 2–4; levels, Pythagoras, prism volume.

### Category boundaries

This category quantifies supplied geometry; it does not size or judge stairs,
ramps, slabs, structure, accessibility, or formwork systems.

### Common misconceptions

- Using plan area for a sloping ramp surface.
- Multiplying slab area by level-to-level height instead of slab thickness.
- Deducting a shaft from ceilings/floors it does not penetrate.
- Confusing number of risers, treads, and landings.
- Counting top and soffit when only one surface is requested.
- Multiplying a typical-storey quantity by all floors despite exceptions.

### Family `slab_plan_area`

**Task/purpose.** Compute gross or net plan area of selected slab regions.

**Response/template.** Area with unit and basis.

**Derivation.** Union slab footprint polygons and subtract only penetrating voids
included by profile.

**Difficulty.** L1 rectangle; L2 composite footprint/void; L3 overlapping slab
regions and selective penetrations.

**Distractors/constraints.** Sum overlaps, use room net, subtract nonpenetrating
opening.

**Feedback.** Overlay slab union and each effective void.

**Examples.** (1) `10×8=80 m²` (L1). (2) `96−12=84 m²` (L2). (3) union
`140`, two effective voids `9`→`131 m²` (L3).

**Validation.** Polygon Boolean area and penetration topology.

### Family `slab_solid_volume`

**Task/purpose.** Compute slab volume from net footprint and thickness zones.

**Response/template.** Volume with unit.

**Derivation.** Extrude each non-overlapping thickness zone; sum after void
subtraction.

**Difficulty.** L1 uniform slab; L2 two thicknesses; L3 drop/pit zone and void.

**Distractors/constraints.** floor-to-floor height, average thickness when not
valid, area unit retained.

**Feedback.** Show area×thickness per zone.

**Examples.** (1) `80×0.2=16 m³` (L1). (2) `60×0.2+20×0.3=18 m³` (L2).
(3) zone subtotal minus shaft prism=`22.4 m³` (L3).

**Validation.** Solid union volume equals zoned extrusion sum.

### Family `ceiling_soffit_area`

**Task/purpose.** Measure selected ceiling or slab-soffit surfaces under a
displayed boundary profile.

**Response/template.** Area by finish/type and total.

**Derivation.** Select downward/horizontal face regions, clip openings and drops,
and group by code.

**Difficulty.** L1 room ceiling equals room plan; L2 bulkhead/void; L3 several
levels and finish zones.

**Distractors/constraints.** floor area copied despite ceiling variation,
vertical bulkhead included when excluded, both sides counted.

**Feedback.** Reflected-plan/section highlight and surface group table.

**Examples.** (1) flat ceiling `16 m²` (L1). (2) `30−4` opening=`26 m²`
(L2). (3) C1 `42`, C2 `8`, soffit only total requested=`50 m²` (L3).

**Validation.** Face normals/type filters and projected polygon areas agree.

### Family `vertical_finish_by_level`

**Task/purpose.** Compute vertical finish/lining area between stated levels,
including selected drops or upstands.

**Response/template.** Area with source level interval.

**Derivation.** Multiply/triangulate measured horizontal runs by exact vertical
level differences, then apply profile deductions.

**Difficulty.** L1 one run/height; L2 stepped level; L3 several storeys with one
exception.

**Distractors/constraints.** clear height versus floor-to-floor, wrong level
datum, count all storeys as typical.

**Feedback.** Draw the vertical interval beside each run.

**Examples.** (1) `8×2.7=21.6 m²` (L1). (2) `5×2.8+3×1.2=17.6 m²`
(L2). (3) three levels with heights `2.7,2.7,3.2` (L3).

**Validation.** Level IDs resolve; all intervals positive and face-consistent.

### Family `slab_edge_upstand_quantity`

**Task/purpose.** Measure selected slab-edge/upstand run or vertical surface area
without confusing it with slab footprint or volume.

**Response/template.** Length or area by edge role and level.

**Derivation.** Filter canonical slab boundary segments by the supplied scope;
sum their true length, or multiply/triangulate each selected vertical edge face
by its exact depth/height.

**Difficulty.** L1 one straight edge; L2 perimeter with excluded shared/internal
edges; L3 stepped depths, returns, and multiple levels.

**Distractors/constraints.** whole slab perimeter, shared edge counted twice,
footprint area, use one depth for stepped edges; no formwork or construction
method is inferred.

**Feedback.** Trace included boundary segments and unfold their vertical faces.

**Examples.** (1) one `8 m` exposed edge (L1). (2) outer boundary `30 m` minus
`6 m` excluded shared edge=`24 m` (L2). (3) `12×0.2+5×0.45=4.65 m²` edge
surface (L3).

**Validation.** Half-edge boundary classification and face-mesh area agree.

### Family `stair_riser_tread_count`

**Task/purpose.** Determine riser, tread/going, or landing counts from a modeled
flight and stated counting convention.

**Response/template.** Multiple named integer fields.

**Derivation.** Read ordered level transitions and step nodes; apply profile rule
for whether landing/top floor supplies the final walking surface.

**Difficulty.** L1 one flight; L2 two flights/landing; L3 compare flight versus
whole stair counts.

**Distractors/constraints.** risers=treads unconditionally, double-count landing,
omit final rise; convention displayed.

**Feedback.** Number each rise and each separate horizontal step surface.

**Examples.** (1) 12 risers, 11 treads under shown rule (L1). (2) flights
8+8 risers and one landing (L2). (3) total by flight plus shared landing (L3).

**Validation.** Stair graph connects levels exactly; integer counts reconcile.

### Family `stair_surface_quantity`

**Task/purpose.** Compute selected tread, riser, landing, string/side, or total
finish surface area.

**Response/template.** Area fields by surface class.

**Derivation.** Multiply exact count by width×going or width×riser; add landing
polygons and other explicitly selected faces.

**Difficulty.** L1 tread faces; L2 tread+riser; L3 two flights, landing, and
different finish codes.

**Distractors/constraints.** use sloping flight rectangle, riser/tread count swap,
count hidden underside.

**Feedback.** Unfold stair surfaces and subtotal by class.

**Examples.** (1) 10 treads `1×0.3=3 m²` (L1). (2) 12 risers
`1.1×0.175=2.31 m²` (L2). (3) treads+riser+landing=`9.42 m²` (L3).

**Validation.** Face-mesh area and count formula agree.

### Family `ramp_true_length_area`

**Task/purpose.** Convert ramp plan run and rise into true slope length or
surface area.

**Response/template.** Length or area with declared rounding.

**Derivation.** `s=√(run²+rise²)`; for rectangular ramp `A=s×width`, with
landings added only if requested.

**Difficulty.** L1 friendly triple; L2 decimal/radical; L3 several flights and
landings.

**Distractors/constraints.** plan run, run+rise, omit width/landing, use slope
ratio backwards.

**Feedback.** Show section right triangle then surface extrusion.

**Examples.** (1) run `4`, rise `3`→`5 m` (L1). (2) `6×1.5 m` sloped
surface from supplied true length→`9 m²` (L2). (3) two slopes plus landing
`18.6 m²` (L3).

**Validation.** 3D endpoint distance and mesh area agree.

### Family `multistorey_quantity_aggregate`

**Task/purpose.** Aggregate a selected quantity across typical and exceptional
storeys.

**Response/template.** Table subtotal and total.

**Derivation.** Group storeys by geometry/type/revision, multiply true repeated
groups, then add exceptions explicitly.

**Difficulty.** L1 identical repetitions; L2 one exception; L3 mixed floor,
wall, or ceiling type filters.

**Distractors/constraints.** multiply exception as typical, omit ground/roof
level, mix area and volume.

**Feedback.** Expand the group multiplication into source storeys.

**Examples.** (1) `4×80=320 m²` (L1). (2) `3×75+90=315 m²` (L2). (3)
type F1 on levels `1,2,4` only→sum their zones (L3).

**Validation.** Every included storey ID appears exactly once.

### Family `vertical_quantity_audit`

**Task/purpose.** Diagnose one slab/ceiling/stair/ramp/storey quantity error.

**Response/template.** Select source, rule, or takeoff line and correct it.

**Derivation.** Compare takeoff dependency graph with exact solids/faces/levels
and find the earliest mismatch.

**Difficulty.** L1 wrong thickness/count; L2 plan versus true surface; L3 typical
storey assumption masks one changed level.

**Distractors/constraints.** One root mutation; no compliance language.

**Feedback.** Synchronize plan, section, 3D surface, and takeoff line.

**Examples.** (1) `200 mm` slab treated as `2 m` (L1). (2) ramp plan area used
for finish (L2). (3) Level 3 shaft added in revision but repeated total unchanged
(L3).

**Validation.** Mutation provenance, dimensional checks, and revision IDs.

### Cross-family progression

Slab area precedes volume; ceiling and vertical finishes contrast face
selection. Stair counts precede surfaces. Ramp plan/true geometry then transfers
the same distinction. Multi-storey aggregation and audits integrate the group.

## 6. Category: Roof geometry, edges, openings, and coverings

### Category purpose

Translate plan runs, rises, roof planes, and edge topology into true roof
lengths, areas, linear quantities, and rule-adjusted covering quantities.

### Learn

A sloping roof face is larger than its horizontal projection. First solve the
section triangle or exact 3D plane. Then measure each roof face once, classify
ridge/hip/valley/eave edges by their adjacent faces, and apply supplied opening
or covering rules only after base geometry.

### Prerequisites

Categories 2–5; Pythagoras, triangle/trapezoid area, plan/section coordination.

### Category boundaries

No structural sizing, drainage adequacy, weatherproofing, code, product
selection, or real material ordering. “Tiles,” “sheets,” and laps use fictional
coverage data.

### Common misconceptions

- Reporting horizontal plan run as rafter/slope length.
- Multiplying total plan area by one factor when roof faces have different
  slopes.
- Counting a shared ridge edge once per face.
- Calling every internal roof edge a valley.
- Deducting rooflights under the wrong threshold.
- Applying waste before finding net measured area.

### Family `roof_slope_true_length`

**Task/purpose.** Compute a roof slope/rafter line from plan run and rise.

**Response/template.** Length with unit.

**Derivation.** Exact 3D distance; standard section case
`s=√(horizontalRun²+rise²)`.

**Difficulty.** L1 friendly triple; L2 pitch given as rise:run; L3 3D diagonal
with horizontal x/y displacement.

**Distractors/constraints.** run, run+rise, full span instead of half-run.

**Feedback.** Highlight the controlling section/3D displacement.

**Examples.** (1) run `4`, rise `3`→`5 m` (L1). (2) `1:4` rise over `6 m`
run→`√38.25≈6.185 m` (L2). (3) vector `(3,4,12)`→`13 m` (L3).

**Validation.** Endpoint distance equals section oracle.

### Family `single_roof_plane_area`

**Task/purpose.** Compute true surface area of one planar roof face.

**Response/template.** Area with unit.

**Derivation.** Use true slope length×orthogonal face length for rectangles, or
triangulate the exact 3D polygon.

**Difficulty.** L1 rectangle; L2 trapezoid/triangle; L3 oblique polygon.

**Distractors/constraints.** plan projection area, vertical elevation area,
double both slopes.

**Feedback.** Show plan projection and unfolded true face side by side.

**Examples.** (1) `5×8=40 m²` true rectangle (L1). (2) trapezoid
`½(4+7)×5=27.5 m²` (L2). (3) 3D quadrilateral=`34.2 m²` (L3).

**Validation.** 3D cross-product/triangulation and projection/cosine oracle agree.

### Family `multi_plane_roof_area`

**Task/purpose.** Sum gable, hip, or stepped roof-face areas without overlaps.

**Response/template.** Area per face/type and total.

**Derivation.** Enumerate roof face IDs, compute each 3D polygon once, group and
sum.

**Difficulty.** L1 symmetric gable; L2 hip faces; L3 unequal slopes/step.

**Distractors/constraints.** multiply one face by wrong symmetry factor, omit
small face, count overlap at intersection.

**Feedback.** Color/number faces and show subtotal.

**Examples.** (1) two `30 m²` faces=`60 m²` (L1). (2) two trapezoids plus two
triangles=`86 m²` (L2). (3) five unequal faces=`143.6 m²` (L3).

**Validation.** Faces form valid manifold shell patch and IDs unique.

### Family `roof_edge_classify_length`

**Task/purpose.** Classify and total ridge, hip, valley, verge, or eave edges.

**Response/template.** Matching plus length subtotal.

**Derivation.** Classify edge from adjacent face normals/topology and boundary
role; compute 3D polyline length.

**Difficulty.** L1 ridge/eave; L2 hip/valley; L3 stepped intersections and type
filter.

**Distractors/constraints.** plan length for sloping hip, count shared edge twice,
hip/valley reversal.

**Feedback.** Show adjacent faces and whether water-side angle is external or
internal without making drainage claims.

**Examples.** (1) one `8 m` ridge (L1). (2) four `5 m` hips=`20 m` (L2).
(3) selected valleys `4.2+6.1=10.3 m` (L3).

**Validation.** Half-edge topology gives one canonical edge and exact endpoints.

### Family `eaves_verges_fascia_gutter_length`

**Task/purpose.** Measure specified roof-boundary edge types under a fictional
scope.

**Response/template.** Length by edge type and total if dimensions match.

**Derivation.** Filter canonical boundary edges by supplied role; sum true
polylines, adding returns only if listed.

**Difficulty.** L1 rectangular eaves; L2 gable eave versus verge; L3 stepped
boundary and excluded segment.

**Distractors/constraints.** entire roof perimeter, ridge included, sloping verge
replaced by plan run.

**Feedback.** Trace every included edge exactly once.

**Examples.** (1) two `10 m` eaves=`20 m` (L1). (2) verges four×`5 m`=`20 m`
(L2). (3) gutter edges `8+8+3−1=18 m` (L3).

**Validation.** Boundary traversal continuous; role filter and length oracle.

### Family `roof_opening_deduction`

**Task/purpose.** Apply stated roof-opening deduction rules to true surface area.

**Response/template.** Gross, deductions, net area.

**Derivation.** Project/intersect each opening on its host roof plane, evaluate
threshold, subtract qualifying true in-plane area.

**Difficulty.** L1 one rooflight; L2 several around threshold; L3 opening spans
two faces.

**Distractors/constraints.** horizontal projected opening area, deduct all/none,
count spanning opening twice.

**Feedback.** Show host-face clipped polygons and rule table.

**Examples.** (1) `40−1.2=38.8 m²` (L1). (2) only `1.5 m²` opening exceeds
`1 m²` threshold (L2). (3) dormer opening split across face IDs, union `3.4 m²`
(L3).

**Validation.** In-plane Boolean clipping and threshold evaluation.

### Family `roof_covering_rule_quantity`

**Task/purpose.** Convert net roof area into a fictional covering quantity using
supplied effective coverage/lap/allowance rules.

**Response/template.** Named fields: net area, adjusted area or effective units,
whole units/packs.

**Derivation.** Follow the displayed supply-rule expression exactly; coverage
uses effective rather than nominal dimensions where stated.

**Difficulty.** L1 units per m²; L2 effective sheet dimensions/lap; L3 allowance
then package rounding.

**Distractors/constraints.** nominal area, wrong order, round down, add allowance
twice; never call result a recommendation.

**Feedback.** Separate geometric, coverage, allowance, and package layers.

**Examples.** (1) `40 m²×10 units/m²=400` (L1). (2) effective sheet
`0.8×1.5=1.2 m²`; `36/1.2=30` (L2). (3) `42×1.05=44.1`, packs cover `5 m²`
→9 packs (L3).

**Validation.** Dimension-typed expression tree and ceiling operation.

### Family `roof_quantity_audit`

**Task/purpose.** Find one geometric, edge, deduction, or supply-rule error in a
roof takeoff.

**Response/template.** Select root error and corrected line.

**Derivation.** Compare face mesh, half-edge topology, profile deductions, and
supply expression against the takeoff.

**Difficulty.** L1 plan/true confusion; L2 shared edge/opening; L3 incorrect
slope assigned to a repeated face group.

**Distractors/constraints.** Exactly one root mutation; roof remains geometrically
valid.

**Feedback.** Trace plan→section→face/edge→takeoff.

**Examples.** (1) `32 m²` plan used instead of `40 m²` face (L1). (2) ridge
counted from both faces (L2). (3) north face uses south pitch, corrupting area
and covering totals (L3).

**Validation.** Mutation provenance and independent face/edge/supply oracles.

### Cross-family progression

True slope length precedes one face and then whole-roof area. Edge
classification is taught separately from surface area. Opening deductions
precede fictional covering rules. The audit family integrates all four layers.

## 7. Category: Components, modules, coverage, allowances, and packaging

### Category purpose

Turn exact measured geometry into counts and other derived quantities using
fully supplied fictional component rules, while keeping measured, adjusted, and
packaged results distinct.

### Learn

Count model objects by stable ID and type; multiply only genuinely repeated
assemblies. Coverage is based on the supplied effective coverage, not
necessarily nominal dimensions. An allowance is a stated arithmetic factor, not
an estimate. Whole-pack rounding happens after the exact required quantity.

### Prerequisites

Categories 2–6; percentages, ceiling division, small tabular schedules.

### Category boundaries

This is arithmetic from fictional data, not product selection, purchasing,
cutting advice, labour estimating, or waste recommendation. Sheet-layout puzzles
are small exact combinatorial exercises, not industrial nesting optimization.

### Common misconceptions

- Counting a type row instead of its instances.
- Multiplying every storey by a “typical” count despite exceptions.
- Using nominal dimensions when overlaps reduce effective coverage.
- Adding a percentage by adding the percentage numeral.
- Rounding each room to packs before a profile that packages the combined total.
- Calling offcuts reusable when the puzzle has not allowed reuse.

### Family `component_instance_count`

**Task/purpose.** Count selected doors, windows, fixtures, panels, columns, or
other fictional components by type/location/property.

**Response/template.** Integer: `How many {filterDescription} instances are present?`

**Derivation.** Filter unique model element IDs under the displayed predicate.

**Difficulty.** L1 one visible type; L2 multiple views/storeys; L3 compound
predicate and duplicate schedule representation.

**Distractors/constraints.** count symbols across views, count type rows, include
near-matching type.

**Feedback.** List the included unique IDs and rejected near matches.

**Examples.** (1) four W1 windows→`4` (L1). (2) D2 on Levels 1–2→`7` (L2).
(3) exterior W3, operable, revision B→`5` (L3).

**Validation.** Stable-ID set count; view symbols never create instances.

### Family `type_schedule_reconcile`

**Task/purpose.** Build or check a type-by-location count schedule.

**Response/template.** Multiple named integer cells or one incorrect cell.

**Derivation.** Group unique elements by requested keys; compare every cell and
row/column total.

**Difficulty.** L1 one grouping; L2 type×storey matrix; L3 changed type in one
location and grand total.

**Distractors/constraints.** swapped type, omitted instance, row total copied;
all group keys displayed.

**Feedback.** Trace schedule cell to source element IDs.

**Examples.** (1) W1=`3`, W2=`2` (L1). (2) D1 by Levels 1/2=`4/5` (L2).
(3) one Level 3 W2 changed to W4; identify two affected cells (L3).

**Validation.** Pivot result from model IDs; totals reconcile both directions.

### Family `repeated_bay_quantity`

**Task/purpose.** Scale a verified bay/module quantity across actual repetitions
and exceptions.

**Response/template.** Quantity by group and total.

**Derivation.** Identify isomorphic bay groups, multiply exact per-bay quantity,
then add explicitly modeled exceptions.

**Difficulty.** L1 identical bays; L2 end-bay exception; L3 mirrored geometry
with same quantity versus visually similar nonidentical bay.

**Distractors/constraints.** multiply by grid-line rather than bay count, treat
end bay as typical, fail to recognize quantity-preserving mirror.

**Feedback.** Show bay extents and expansion.

**Examples.** (1) 6 bays×4 panels=`24` (L1). (2) 4×`12 m²`+end `9 m²`=`57 m²`
(L2). (3) three mirrored equal bays plus one narrower bay (L3).

**Validation.** Repetition signatures derived from geometry/type, not labels.

### Family `assembly_component_expand`

**Task/purpose.** Expand a fictional assembly recipe into component quantities.

**Response/template.** Table of named component counts/lengths/areas.

**Derivation.** Multiply assembly instances by the supplied bill-of-material
recipe, respecting optional variants and unit dimensions.

**Difficulty.** L1 one recipe/count; L2 nested subassembly; L3 variants by type
and one shared component counted per group.

**Distractors/constraints.** add instead of multiply, double shared component,
mix component units; recipe complete and fictional.

**Feedback.** Display an expansion tree with dimensional units.

**Examples.** (1) 5 frames×4 clips=`20 clips` (L1). (2) 3 modules each 2 rails
of `1.2 m`→`7.2 m` (L2). (3) variants A/B with one shared cap per bank (L3).

**Validation.** Acyclic recipe graph and independent tree fold.

### Family `effective_coverage_units`

**Task/purpose.** Find unit count from net area/length and a supplied effective
coverage.

**Response/template.** Exact requirement and whole-unit result.

**Derivation.** Divide measured quantity by compatible effective coverage; apply
the named ceiling rule only at the final unit-count stage.

**Difficulty.** L1 units/m²; L2 overlap-derived effective size; L3 partial zones
with different orientations/coverage.

**Distractors/constraints.** nominal size, multiply instead of divide, floor
instead of ceiling.

**Feedback.** Derive effective coverage, then division and rounding.

**Examples.** (1) `24 m²/(0.5 m²/unit)=48` (L1). (2) effective
`0.9×1.8=1.62 m²`, `32.4/1.62=20` (L2). (3) zones require `12.2+8.1=20.3`
units→`21` (L3).

**Validation.** Unit algebra reduces to count; ceiling result covers requirement.

### Family `allowance_then_packaging`

**Task/purpose.** Apply a supplied percentage/fixed allowance and package rule
in the declared order.

**Response/template.** Named fields: measured, adjusted, packages, supplied.

**Derivation.** Apply exact factor or fixed addition to the specified base; then
ceiling-divide by package size. Do not infer an allowance.

**Difficulty.** L1 percentage only; L2 packages only; L3 compare alternate
rounding/aggregation policies.

**Distractors/constraints.** `Q+p`, percent of wrong base, packages before
allowance, round down.

**Feedback.** Separate each stage and label it “exercise rule.”

**Examples.** (1) `40×1.10=44 m²` (L1). (2) 44 units, packs of 6→8 packs/48
supplied (L2). (3) combine rooms then 7% then packs under shown policy (L3).

**Validation.** Typed expression order; result is never labeled recommended.

### Family `sheet_cut_yield`

**Task/purpose.** Determine exact yield or minimum sheet count for small
axis-aligned rectangular cutting patterns under supplied rotation/reuse rules.

**Response/template.** Integer plus optional placement choice.

**Derivation.** Enumerate bounded guillotine/grid placements or validate a
constructive layout; compare lower bound with exhaustive optimum.

**Difficulty.** L1 one piece size tiles sheet; L2 two piece types; L3 rotation
or offcut reuse toggled.

**Distractors/constraints.** area-only bound that cannot pack, forbidden
rotation, reuse offcut twice; maximum 8 pieces and small discrete grid.

**Feedback.** Show a valid sheet layout and why fewer sheets fail.

**Examples.** (1) four `0.5×1 m` pieces from `1×2 m` sheet→1 (L1). (2) six
pieces fit 2 sheets, not area lower bound 1 (L2). (3) rotation allows 2 rather
than 3 sheets (L3).

**Validation.** Exhaustive solver and placement collision/bounds checker.

### Family `density_to_mass`

**Task/purpose.** Convert a calculated volume to mass using an explicitly
fictional density.

**Response/template.** Mass with unit.

**Derivation.** Convert volume/density to compatible canonical units and compute
`m=ρV`.

**Difficulty.** L1 compatible `kg/m³`; L2 unit conversion; L3 several material
zones and exclusions.

**Distractors/constraints.** divide by density, unit-power error, use gross
volume instead of stated net; no real product claims.

**Feedback.** Show unit cancellation and the volume source line.

**Examples.** (1) `2 m³×500 kg/m³=1000 kg` (L1). (2) `0.25 m³×240 kg/m³=60 kg`
(L2). (3) two fictional density zones total `825 kg` (L3).

**Validation.** Dimensional algebra and independent high-precision calculation.

### Family `component_supply_audit`

**Task/purpose.** Diagnose one count, grouping, coverage, allowance, package,
cut-yield, or density error.

**Response/template.** Select first wrong stage and corrected value.

**Derivation.** Compare every takeoff stage with stable-ID counts and typed
fictional supply-rule expression.

**Difficulty.** L1 count/arithmetic; L2 nominal/effective or rounding; L3
duplicate view symbols produce an apparently plausible package total.

**Distractors/constraints.** One root mutation; downstream values may follow it.

**Feedback.** Trace model count→measured quantity→rule→package.

**Examples.** (1) 7 instances scheduled as 8 (L1). (2) nominal sheet area used
instead of effective (L2). (3) same windows counted in plan and elevation (L3).

**Validation.** Mutation dependency graph and dimensional type checker.

### Cross-family progression

Direct stable-ID counts precede schedules and repeated bays. Assembly expansion
then introduces recipes. Coverage, allowance/packaging, bounded cutting, and
density each add one explicitly supplied transformation. The audit family keeps
those transformations from collapsing into one opaque “material quantity.”

## 8. Category: Building massing, simple site areas, and earthwork solids

### Category purpose

Apply architectural geometry to simple three-dimensional massing and fictional
site solids while making the supplied geometric approximation explicit.

### Learn

Choose the solid and the method before calculating. A footprint extruded to a
height is a prism. A trench follows a measured path and cross-section. Cut and
fill are signed differences but should normally be reported separately. Average
end area is a stated approximation rule, not interchangeable with every volume
model.

### Prerequisites

Categories 2–7; polygon area, prism/cylinder volume, sections and levels.

### Category boundaries

No surveying, drainage, geotechnical behaviour, bulking/compaction, slope
stability, haulage, plant productivity, or real terrain. All profiles and ground
surfaces are small fictional exact datasets.

### Common misconceptions

- Multiplying footprint area by the wrong vertical interval.
- Mixing façade/envelope area with floor area.
- Using centreline trench length without the stated bend/junction convention.
- Netting cut and fill before reporting either.
- Applying average-end-area when sections are not paired or spacing is wrong.
- Treating a coarse approximation as exact geometry.

### Family `extruded_building_volume`

**Task/purpose.** Compute volume of a simple building mass extruded from a
footprint, with stated setbacks/voids.

**Response/template.** Volume by mass and total.

**Derivation.** Extrude each non-overlapping footprint region through its exact
height interval; subtract modeled void solids.

**Difficulty.** L1 rectangular prism; L2 stepped heights; L3 courtyard/overlap.

**Distractors/constraints.** floor area only, wrong height, overlapping masses
summed twice.

**Feedback.** Explode mass into prisms and show union/difference.

**Examples.** (1) `10×8×3=240 m³` (L1). (2) `60×6+20×3=420 m³` (L2).
(3) stepped masses minus courtyard=`910 m³` (L3).

**Validation.** Solid Boolean volume and prism decomposition.

### Family `surface_to_volume_ratio`

**Task/purpose.** Compute a purely geometric external-surface-to-enclosed-volume
ratio for the stated surfaces.

**Response/template.** Ratio with unit `1/m` or `m²/m³`.

**Derivation.** Sum included external faces once and divide by enclosed solid
volume.

**Difficulty.** L1 cuboid; L2 exclude base/shared wall; L3 stepped joined masses.

**Distractors/constraints.** inverse ratio, include internal shared faces, omit
unit; make no energy-performance judgment.

**Feedback.** List surface numerator and volume denominator.

**Examples.** (1) cube side 2, all faces: `24/8=3 m⁻¹` (L1). (2) cuboid
excluding base (L2). (3) joined masses remove shared interface twice (L3).

**Validation.** Boundary-face extraction and positive solid volume.

### Family `site_surface_area`

**Task/purpose.** Compute selected planar site, paving, planting, or exclusion
region area from a fictional plan.

**Response/template.** Area by region code and total.

**Derivation.** Boolean union/difference of exact site polygons under the profile.

**Difficulty.** L1 rectangle; L2 building footprint deduction; L3 overlapping
zones and curved sector.

**Distractors/constraints.** bounding area, double-subtract overlap, perimeter;
no landscape or drainage advice.

**Feedback.** Color included/excluded polygon sets.

**Examples.** (1) `20×12=240 m²` (L1). (2) site `500−building 120=380 m²`
(L2). (3) union of paving zones minus planter=`146.5 m²` (L3).

**Validation.** Polygon Boolean and independent decomposition.

### Family `trench_and_strip_volume`

**Task/purpose.** Compute a fictional constant/piecewise cross-section volume
along an explicitly measured path.

**Response/template.** Volume by segment and total.

**Derivation.** `V=path length×cross-section area` per non-overlapping segment;
apply supplied junction treatment.

**Difficulty.** L1 one rectangular trench; L2 changing depth/width; L3 bends
with explicit centreline/end/junction correction.

**Distractors/constraints.** perimeter instead of path, double-count junction,
area not volume.

**Feedback.** Unfold path segments beside cross-sections.

**Examples.** (1) `10×0.5×0.8=4 m³` (L1). (2) two segments total `7.2 m³`
(L2). (3) centreline length with one stated junction deduction (L3).

**Validation.** Swept-solid or exact segment-prism union.

### Family `level_pad_cut_fill`

**Task/purpose.** Calculate cut and fill volumes for a small gridded/triangulated
pad against a supplied design plane.

**Response/template.** Separate non-negative `cut` and `fill` fields.

**Derivation.** Compute signed height differences at each bounded cell using the
declared exact cell/prism method; accumulate positive and negative parts
separately.

**Difficulty.** L1 all cut or fill constant cells; L2 mixed cells not crossing
zero; L3 triangulated cells with one zero crossing handled exactly.

**Distractors/constraints.** net only, sign reversal, average heights across a
zero crossing without subdivision.

**Feedback.** Color cut/fill and show signed cell contributions.

**Examples.** (1) `20 m²×0.5 m=10 m³ fill` (L1). (2) cut `8`, fill `3 m³`
(L2). (3) subdivided crossing cell gives cut `2.1`, fill `1.4 m³` (L3).

**Validation.** Independent clipped-prism integration; `cut,fill≥0`.

### Family `average_end_area_volume`

**Task/purpose.** Apply the explicitly supplied average-end-area method between
paired sections.

**Response/template.** Volume per interval and total.

**Derivation.** For each interval, `V=(A1+A2)d/2`; use section spacing associated
with that pair.

**Difficulty.** L1 one interval; L2 unequal spacings; L3 cut/fill areas kept
separate across several sections.

**Distractors/constraints.** `A1+A2×d`, use total route length for each pair,
combine cut/fill signs; method label visible.

**Feedback.** Pair adjacent section areas and interval distances.

**Examples.** (1) `(4+6)/2×10=50 m³` (L1). (2) intervals `8 m` and `12 m`
subtotal separately (L2). (3) separate cut/fill AEA table (L3).

**Validation.** Section ordering, pair count `n−1`, exact formula oracle.

### Family `stockpile_simple_solid`

**Task/purpose.** Compute volume of an explicitly idealized prism, pyramid,
frustum, or half-cylinder stockpile.

**Response/template.** Volume with shape/method named.

**Derivation.** Apply the exact supplied solid formula; composite shapes sum
non-overlapping parts.

**Difficulty.** L1 prism; L2 triangular prism/half-cylinder; L3 rectangular
frustum or composite.

**Distractors/constraints.** base area only, omit ½/⅓, use average linear
dimensions instead of frustum formula.

**Feedback.** Show cross-section/base and extrusion/height.

**Examples.** (1) triangular prism `½×4×2×10=40 m³` (L1). (2) half-cylinder
`½πr²L` (L2). (3) stated rectangular-frustum formula→`62 m³` (L3).

**Validation.** Analytic formula and mesh/section integration agree.

### Family `site_massing_audit`

**Task/purpose.** Diagnose one footprint, height, surface, path, method, sign, or
aggregation error.

**Response/template.** Select root error and correction.

**Derivation.** Compare exact solid/polygon/section model and method profile
against the takeoff dependency tree.

**Difficulty.** L1 unit/formula; L2 wrong solid/path; L3 cut/fill netting or
section spacing propagates through several rows.

**Distractors/constraints.** Exactly one root mutation; approximation method
stays explicitly named.

**Feedback.** Trace plan/section→solid→method→quantity.

**Examples.** (1) pad depth `300 mm` treated as `3 m` (L1). (2) trench bend
counted twice (L2). (3) cut `12` and fill `5` reported only as net `7 m³` (L3).

**Validation.** Mutation graph plus independent geometry/method oracle.

### Cross-family progression

Extruded massing and site polygons precede path-swept trenches. Pad cut/fill and
average-end-area are separate methods and must not be silently mixed. Idealized
stockpiles extend the solid vocabulary. Audits test method selection as well as
arithmetic.

## 9. Category: Takeoff tables, aggregation, reconciliation, and revisions

### Category purpose

Make quantity work transparent and checkable: every line must have a source,
basis, expression, unit, and place in a nonduplicating aggregation.

### Learn

A takeoff is an evidence chain, not a list of unexplained numbers. Keep stable
element IDs, location/type grouping, gross/deduction/net columns, and units.
Reconcile totals by an independent route. When a revision changes a result,
separate added, removed, and modified contributors.

### Prerequisites

All direct categories relevant to the selected integrated exercise.

### Category boundaries

This category audits educational quantities only. It does not produce contractual
bills, classifications, descriptions, prices, or professional deliverables.

### Common misconceptions

- Treating the displayed rounded value as the authoritative stored quantity.
- Losing an element when grouping or counting it in two groups.
- Adding lengths, areas, and volumes into one meaningless grand total.
- Reconciling two methods that share the same faulty intermediate value.
- Treating a type rename as added+removed geometry without checking identity.
- Reporting only net revision change and hiding offsetting additions/removals.

### Family `takeoff_line_construct`

**Task/purpose.** Complete one source-linked takeoff line from geometry and a
measurement profile.

**Response/template.** Named fields: description, source IDs, expression, gross,
deductions, net, unit.

**Derivation.** Build line directly from selected semantic elements and profile
rule, then serialize the exact expression.

**Difficulty.** L1 one element; L2 grouped type/location; L3 several deductions
with source-view choice.

**Distractors/constraints.** Wrong source, unit, basis, or expression; descriptions
must distinguish the quantity but need not imitate a professional standard.

**Feedback.** Highlight every source and walk the line left-to-right.

**Examples.** (1) wall W12 face `5×3=15 m²` (L1). (2) Room group F1=`32 m²`
(L2). (3) façade gross/deductions/net with three opening IDs (L3).

**Validation.** Referential integrity and expression reevaluation.

### Family `takeoff_group_subtotal`

**Task/purpose.** Group compatible lines by type, location, storey, phase, or
finish and compute subtotals.

**Response/template.** Drag/group or fill subtotal table.

**Derivation.** Partition, never duplicate, line IDs by displayed keys; sum exact
compatible quantities before final rounding.

**Difficulty.** L1 one key; L2 two-key pivot; L3 exclusion predicate and mixed
reporting units normalized first.

**Distractors/constraints.** duplicate cross-group line, omit ungrouped line,
sum displayed rounded values.

**Feedback.** Expand each subtotal to member line IDs and canonical units.

**Examples.** (1) F1 rooms `12+14=26 m²` (L1). (2) wall finish by level/type
(L2). (3) normalize `m²/mm²` then pivot (L3).

**Validation.** Partitions are disjoint/complete; canonical exact sum.

### Family `takeoff_gross_net_reconcile`

**Task/purpose.** Reconcile gross, additions, deductions, and net across line and
subtotal levels.

**Response/template.** Missing table cells or select inconsistent row.

**Derivation.** Enforce `net=gross+additions−deductions` per line and on exact
column totals.

**Difficulty.** L1 missing net; L2 missing deduction/subtotal; L3 rounding display
creates apparent but explainable mismatch.

**Distractors/constraints.** sign reversal, deduction omitted twice, rounded
columns treated as exact.

**Feedback.** Show row identities and exact hidden subtotal before display.

**Examples.** (1) `20−3=17` (L1). (2) gross `80`, net `71`, additions `1`
→deductions `10` (L2). (3) exact rows reconcile though displayed decimals differ
by `0.01` (L3).

**Validation.** Algebraic identities exact at every aggregation node.

### Family `quantity_source_trace`

**Task/purpose.** Trace a reported number back to the controlling model elements,
dimensions, view, profile rule, and expression node.

**Response/template.** Ordered sequence or matching lineage graph.

**Derivation.** Follow stored provenance edges from report cell to semantic
sources.

**Difficulty.** L1 direct line; L2 subtotal and deduction; L3 revision-derived
delta with shared source dimensions.

**Distractors/constraints.** visually nearby but unrelated dimension, downstream
cell as source, stale revision.

**Feedback.** Illuminate the provenance path while hiding unrelated data.

**Examples.** (1) `15 m²`→W12 face→5×3 (L1). (2) net façade→gross faces−openings
(L2). (3) delta→modified level→three dependent walls (L3).

**Validation.** Provenance DAG connected, acyclic, and revision-consistent.

### Family `duplicate_or_omission_find`

**Task/purpose.** Find an element or region counted zero or more than once.

**Response/template.** Select element/line and classify `omitted|duplicated`.

**Derivation.** Compare required source-ID set/multiset with takeoff coverage.

**Difficulty.** L1 one missing component; L2 same element shown in two views; L3
overlapping groups cover a region twice while totals look plausible.

**Distractors/constraints.** type rows are not instances; exactly one root
coverage defect.

**Feedback.** Show source-to-line incidence matrix.

**Examples.** (1) door D7 absent (L1). (2) W4 counted from plan and elevation
(L2). (3) corridor belongs to both “Level 1” and “shared” finish groups (L3).

**Validation.** Incidence count is exactly 1 for required IDs/atomic regions.

### Family `independent_method_reconcile`

**Task/purpose.** Check a quantity through a genuinely independent decomposition
or model view.

**Response/template.** Number plus method pair or identify disagreement cause.

**Derivation.** Compute with two nonshared routes, such as polygon shoelace
versus rectangle decomposition, solid mesh versus prism sum, or schedule IDs
versus plan instances.

**Difficulty.** L1 matching methods; L2 locate one discrepancy; L3 methods agree
in total but reveal compensating line errors.

**Distractors/constraints.** Two routes must not call the same cached
intermediate; total agreement alone does not prove line correctness.

**Feedback.** Place both derivations side-by-side and compare atomic terms.

**Examples.** (1) L-area `42 m²` both ways (L1). (2) model wall volume differs
from zoned prism sum by one void (L2). (3) two schedule errors cancel in grand
total (L3).

**Validation.** Oracles implemented independently and cache-isolated in tests.

### Family `revision_quantity_delta`

**Task/purpose.** Explain quantity change between two fictional revisions using
added, removed, modified, and unchanged stable elements.

**Response/template.** Signed delta plus categorized contributors.

**Derivation.** Match stable IDs, compare exact quantities under the same
profile, classify changes, and sum `new−old`.

**Difficulty.** L1 one addition; L2 add/remove/modify; L3 geometry unchanged but
type/scope changes, or profile version intentionally changes.

**Distractors/constraints.** subtract backwards, treat moved unchanged object as
new, hide offsetting changes.

**Feedback.** Waterfall table: old + additions − removals ± modifications = new.

**Examples.** (1) `+6 m²` added room (L1). (2) `+8−3+1=+6 m²` (L2). (3)
same wall IDs, opening enlarged→net finish `−1.2 m²` (L3).

**Validation.** Identity matching, change classification, and signed sum.

### Family `unit_basis_conflict`

**Task/purpose.** Detect incompatible units or measurement bases before
aggregation/comparison.

**Response/template.** Select conflicting lines and correction/`cannot combine`.

**Derivation.** Compare dimension types, unit normalization, profile IDs,
boundary bases, and revision IDs.

**Difficulty.** L1 area+volume; L2 convertible units; L3 same unit but different
gross/net or face/centreline basis.

**Distractors/constraints.** Numerically similar values, converted compatible
units, different descriptions with same legitimate basis.

**Feedback.** Show a compatibility matrix and safe normalization if possible.

**Examples.** (1) `m²` cannot add to `m³` (L1). (2) `250000 mm²=0.25 m²`, so
compatible (L2). (3) net finished-face area cannot silently compare with gross
outer-face area (L3).

**Validation.** Type/profile checker supplies the unique conflict reason.

### Family `takeoff_rounding_reconcile`

**Task/purpose.** Determine whether line, subtotal, final, or package rounding
explains a displayed discrepancy.

**Response/template.** Stage choice and corrected displayed/exact value.

**Derivation.** Replay exact expression DAG under each candidate rounding policy;
select the declared policy and first divergence.

**Difficulty.** L1 one final round; L2 line versus subtotal; L3 allowance and
packaging after aggregated groups.

**Distractors/constraints.** fixtures must make policies yield distinct results.

**Feedback.** Reveal exact values and vertical rounding markers.

**Examples.** (1) exact `3.456`→`3.46` final (L1). (2) three `1.234` lines:
exact subtotal `3.702→3.70`, line-rounded sum `3.69` (L2). (3) room-level versus
project-level packs differ under named policy (L3).

**Validation.** Decimal oracle enumerates policies and proves uniqueness.

### Family `integrated_quantity_audit`

**Task/purpose.** Diagnose one root defect in a small coordinated model,
drawing/schedule set, measurement profile, and takeoff.

**Response/template.** Root layer, evidence IDs, correction, affected outputs.

**Derivation.** Compare model invariants, sources, rule engine, expression DAG,
and reports; choose earliest causal mismatch, not a downstream symptom.

**Difficulty.** L3 two mastered domains; L4 three domains/revision; L5 determine
that basis/source data is insufficient rather than inventing a quantity.

**Distractors/constraints.** One seeded root defect; dependent symptoms may be
many; never require professional judgment.

**Feedback.** Causal graph from root to affected lines, then corrected replay.

**Examples.** (1) opening absent from schedule causes net wall mismatch (L3).
(2) level revision changes wall/slab/finish quantities while stale typical-floor
group persists (L4). (3) “net area” requested but no boundary profile supplied
→cannot determine (L5).

**Validation.** Fault-injection manifest, unique earliest cause, all stated
consequences reproduced.

### Cross-family progression

Constructing and grouping lines precede reconciliation. Source tracing and
duplicate/omission work build audit habits. Independent methods precede
revision deltas. Unit/basis and rounding conflicts are then interleaved.
Integrated audits combine no more than three already-mastered domains.

## 10. Topic-level progression

### Level 1 — One explicit primitive

- classify quantity dimension and convert one unit;
- compute a rectangle, prism, straight wall face, or simple count;
- use one clearly highlighted boundary;
- calculate one gross quantity with no deduction;
- read one takeoff line and one source.

### Level 2 — One rule or composite shape

- decompose an orthogonal plan or roof face;
- distinguish centreline, inner face, outer face, plan projection, and true face;
- apply one opening/void deduction;
- quantify stairs/ramps and repeated components;
- group a small schedule or use one fictional coverage rule.

### Level 3 — Several coordinated contributors

- coordinate plan/elevation/section and several element types;
- apply thresholded deductions or additions;
- aggregate typical and exceptional storeys/bays;
- compute roof edges and multi-plane surfaces;
- calculate simple site solids or separate cut/fill;
- find omissions, duplicates, unit conflicts, and rounding-stage errors.

### Level 4 — Revisions and root causes

- compare versions while preserving stable identity;
- reconcile independent geometry methods;
- distinguish a root geometry, source, rule, grouping, or rounding error from
  downstream symptoms;
- solve bounded reverse/missing-dimension takeoffs.

### Level 5 — Integrated sufficiency and audit

- audit up to three mastered domains in one small model;
- explain gross→deduction→net→adjusted→packaged lineage;
- accept multiple valid decompositions that produce the same exact result;
- conclude `cannot determine` when basis, geometry, or rule is missing;
- never replace a missing rule with professional or local convention.

## 11. Adaptive practice guidance

Track mastery by:

```text
family
quantity dimension
geometry primitive
element type
boundary basis
measurement profile
gross/net stage
unit representation
projection/true-surface distinction
grouping key
rounding stage
source representation
misconception
difficulty dimensions
```

Routing:

- Area/volume unit error → paired linear/square/cubic conversion contrasts.
- Perimeter/area confusion → dimension classification before calculation.
- Boundary errors → semantic face/centreline selection with no arithmetic.
- Bounding-box composite error → decomposition overlays.
- Gross/net error → candidate-deduction classification before subtraction.
- Plan/true-surface error → linked plan and section triangles.
- Wall face/solid error → dimension/unit contrast.
- Riser/tread error → explicitly numbered stair surfaces.
- Typical-storey overgeneralization → one-exception grouping drills.
- Nominal/effective coverage error → isolate supplied lap geometry.
- Allowance/package conflation → stage-order cards.
- Duplicate view-symbol count → stable-ID source tracing.
- Cut/fill netting → separate signed contribution tables.
- Rounding mismatch → exact hidden subtotal and one rounding marker.
- Revision error → stable-ID add/remove/modify classification.
- Repeated audit failure → decompose to earliest failed dependency family.

Do not make the next question merely use larger numbers. Correct but slow answers
retain conceptual difficulty and may receive less arithmetic. Speed is optional
practice metadata, never the definition of mastery.

## 12. Answer checking and worked feedback

### Semantic and numeric checking

- Geometry selections resolve to model IDs, faces, edges, paths, and polygons.
- Numeric answers parse into dimension-typed values.
- Compatible unit answers normalize to exact canonical values.
- Rational values compare exactly; deterministic tolerances apply only after
  declared irrational/decimal rounding.
- All valid decompositions/constructions are accepted when they produce the same
  required geometry and lineage.
- Counts compare stable-ID sets, not rendered marks.
- Takeoff tables compare exact cell semantics before formatted text.
- `cannot determine` requires the correct missing basis/source/rule.

### Tolerance policy

The prompt displays required precision. For a result rounded to `d` decimal
places, accept the correctly rounded value and optionally mathematically
equivalent compatible units that normalize within half a displayed unit in the
last place. Do not use a broad percentage tolerance that can accept the wrong
formula. Exact counts, classifications, and rational-friendly results use no
tolerance.

### Worked feedback

Feedback order:

1. Name the requested quantity dimension and active measurement basis.
2. Highlight authoritative elements, faces, edges, levels, and dimensions.
3. Show the exact geometric expression.
4. Classify every inclusion, addition, deduction, and ignored item.
5. Show exact net quantity.
6. Apply fictional allowance/coverage/packaging only if requested.
7. Apply the named rounding stage.
8. Diagnose a matching misconception and show one independent check.

Example:

> The roof plan projection is 32 m², but the requested quantity is the true
> sloping face. The section gives a 4–3–5 triangle, so the surface factor is
> 5/4. Gross face area is 40 m². The 0.8 m² rooflight is below this exercise’s
> 1.0 m² deduction threshold, so net measured area remains 40 m².

## 13. Rendering, interaction, accessibility, and localization

### Rendering

- Use semantic SVG for plans, elevations, sections, unfolded faces, and solids.
- Dimensions and model data, never screen pixels, control calculation.
- Highlight the exact measurement boundary/path/surface and source IDs.
- Offer synchronized plan/section/3D/takeoff views where useful.
- Distinguish gross regions, deductions, additions, exclusions, and selected
  zones by pattern plus label, not color alone.
- Show units on axes, dimensions, input fields, and table headers.
- Avoid label collisions and visually indistinguishable alternative boundaries.
- Package/cutting layouts use explicit sheet and piece outlines.

### Interaction

- Selection snaps to semantic regions/edges, with generous hit targets.
- Keyboard and structured-list alternatives exist for every visual selection.
- Tables support direct cell navigation and expose row/column headers.
- Dragging is never mandatory; matching, ordered lists, or IDs are alternatives.
- Pan/zoom does not alter quantity semantics.
- A learner can toggle source geometry, measurement overlay, expression, and
  independent-check views after answering.

### Accessibility

- Every visual has an equivalent structured description: vertices/dimensions,
  face/edge list, level stack, component table, or source-incidence matrix.
- Color is never the only inclusion/deduction/revision cue.
- Surface patterns, edge styles, and text labels remain distinguishable in
  monochrome and high contrast.
- Screen readers announce unit powers correctly (“square metres,” not “metres
  two” where platform support allows).
- Construction/selection tasks have discrete semantic alternatives.
- Reduced-motion mode replaces animated unfolding/highlighting with ordered
  static steps.
- Visual and structured-text response modes may have separate mastery evidence
  when they train materially different operations.

### Localization

UI locale, unit profile, and measurement profile are independent. Localization
must handle decimal/group separators, unit spacing, superscripts, pluralization,
direction terms, level/storey terminology, and table layout. Translation must
not silently replace a fictional profile with local professional practice.
Imperial/US customary support requires a separate exact feet/inches/fraction
parser and versioned unit profile; it is deferred from v1.

## 14. Generator and implementation architecture

Recommended standalone modules:

```text
seededRng
exactUnits
decimalRounding
robust2DGeometry
solidGeometry
buildingQuantityModel
profileRegistry
boundaryResolver
faceEdgeClassifier
quantityOracle
deductionRuleEngine
supplyRuleEngine
takeoffBuilder
groupingEngine
provenanceGraph
revisionDiffer
faultInjector
semanticSvgRenderer
accessibleFactBuilder
semanticAnswerChecker
```

### Generation pipeline

1. Select family, target misconception, representation, and profile.
2. Construct backward from a friendly exact answer or useful rule boundary.
3. Generate one valid semantic building/site model and source dimensions.
4. Resolve requested measurement boundary.
5. Calculate base geometry with the primary oracle.
6. Apply measurement rules, then optional fictional supply rules.
7. Recompute with an independent method.
8. Generate misconception-based distractors or one controlled root mutation.
9. Render semantic visual/table and accessible facts from the same model.
10. Reject collisions, ambiguity, degenerate arithmetic, and repeated structural
    signatures.

### Exactness and geometry algorithms

- Use integers/rationals for dimensions, scale, orthogonal polygons, thresholds,
  and rule arithmetic.
- Use robust orientation, segment intersection, point-in-polygon, polygon
  clipping, and Boolean operations.
- Polygon area must have shoelace and triangulation/decomposition oracles.
- Path lengths must be recomputable from canonical vertices.
- 3D planar face area must have triangulation/cross-product and a second
  projection/basis oracle.
- Simple solid volume must have Boolean/mesh and analytic/decomposition oracles.
- Cutting-yield puzzles require exhaustive bounded search, not a heuristic
  answer.
- Decimal rounding must not depend on binary floating-point ties.

### Standalone architecture

HTML/JS/CSS only; no backend, CAD/BIM service, standards lookup, optimizer, or
uploaded document parser at runtime. All profiles, models, solvers, translations,
and validators are bundled and versioned. IFC concepts may inform internal
semantics, but the app need not parse or emit IFC.

## 15. Automated validation requirements

### Model and geometry tests

- All element IDs are unique and all references resolve.
- Space/site polygons are simple; holes are contained and non-overlapping.
- Wall/slab/roof/opening solids are valid under the bounded geometry grammar.
- Openings lie within hosts and penetrate only declared elements.
- Roof faces have consistent adjacency and half-edge topology.
- Stair/ramp endpoints meet declared levels.
- Site sections/intervals are ordered and use the declared method.
- Boolean union/difference never yields an unintended disconnected ambiguity.

### Quantity and unit tests

- Every quantity has exactly one dimension type and canonical unit.
- Forward/reverse unit round trips are exact.
- Area/volume conversions use squared/cubed factors.
- Base geometry, additions, deductions, net, allowance, package, and display
  values satisfy their expression identities.
- Threshold comparisons define `<`, `≤`, `>`, or `≥` explicitly.
- Intermediate values remain exact unless a profile names a rounding stage.
- Whole-unit/package results are integers and meet the exact requirement.

### Independent oracle tests

- Polygon shoelace equals independent triangulation/decomposition.
- Wall footprint union equals solid horizontal-section area.
- Face area equals 3D mesh and local-plane polygon calculations.
- Solid volume equals analytic/decomposed and mesh/Boolean calculations.
- Roof slope distance equals coordinate and section-triangle calculations.
- Component schedule counts equal source-ID set counts.
- Takeoff group totals equal ungrouped atomic quantities.
- Revision delta equals both contributor sum and `newTotal−oldTotal`.
- Independent reconciliation routes cannot share cached target intermediates.

### Profile and lineage tests

- Every question records profile/version, revision, unit, oracle, and renderer
  versions.
- Every takeoff value reaches at least one model source through an acyclic
  provenance graph.
- Gross/net/supply fields cannot be mislabeled or reordered silently.
- Profile updates cannot alter archived question answers.
- Questions never depend on an omitted convention.
- Standards names appear only in reviewed reference/boundary material, not as a
  false compliance claim.

### Distractor and mutation tests

Distractor fixtures must cover:

- linear factor reused for square/cubic conversion;
- perimeter/area/volume confusion;
- centreline/inside/outside boundary swap;
- bounding box used for composite polygon;
- gross/net and threshold reversal;
- plan projection used for true sloped face;
- wall face used as wall volume;
- opening area subtracted without host depth;
- riser/tread/landing miscount;
- shared edge/region/element counted twice;
- typical group applied to exception;
- nominal instead of effective coverage;
- allowance/package order reversed;
- cut/fill sign or inappropriate netting;
- incompatible units or measurement bases combined;
- stale revision or wrong stable-ID match;
- line versus subtotal rounding;
- downstream symptom selected instead of root defect.

Each audit mutation has exactly one root cause and a machine-readable dependency
manifest. Distractors are distinct after normalization and exactly one is
correct unless multiple selection is explicitly requested.

### Rendering and accessibility tests

- All necessary dimensions are visible and present in accessible facts.
- No answer requires pixel measurement or color discrimination.
- Highlight overlays resolve to the same semantic geometry as the answer.
- Labels, leaders, dimensions, patterns, and table text do not collide at
  supported viewport sizes and 200%/400% zoom.
- Keyboard order follows prompt→basis→drawing/facts→input→feedback.
- Structured alternatives contain sufficient information without leaking
  hidden model facts unavailable visually.

### Seed requirements

For at least `10,000` deterministic seeds per family/level, and `25,000` for
polygon Boolean, roof, site-solid, rounding, and integrated-audit families:

- placeholders and source references resolve;
- instances pass all geometry/profile invariants;
- primary and independent oracles agree;
- accepted answer set is nonempty and bounded;
- choices are unique after unit/rounding normalization;
- target misconception remains distinguishable;
- difficulty and rejection rules hold;
- no real-project, code-compliance, cost, ordering, or professional-advice
  language is generated;
- structural repetition control operates on geometry/rule signatures, not names.

## 16. Coverage requirements

Across a long course:

- count, length, area, volume, mass, ratio, and unit-rate dimensions appear;
- linear, square, and cubic unit conversions recur;
- centreline, inner-face, outer-face, projected, and true-surface bases contrast;
- gross, additions, deductions, net, allowance, package, and display stages all
  appear without being conflated;
- rectangles do not dominate after composite/polygon mastery;
- spaces, walls, openings, finishes, slabs, ceilings, stairs, ramps, roofs,
  components, massing, and site solids recur;
- thresholds include included, excluded, and near-boundary non-tie examples;
- simple and exceptional storeys/bays are balanced;
- roof faces and every supported edge class appear;
- schedules include type, location, level, and revision groupings;
- every supported fictional supply transformation appears but never as advice;
- direct calculations, inverse/missing values, classifications, constructions,
  reconciliations, revisions, and audits are balanced;
- every named misconception is intentionally sampled;
- `cannot determine` appears often enough to discourage invented conventions.

## 17. Recommended views and v1 priorities

### Views

1. **Learn** — dimensions, units, boundaries, and quantity layers.
2. **Plan Takeoff** — spaces, floors, wall footprints, finishes, and perimeters.
3. **Envelope** — wall faces/solids, openings, façades, and ratios.
4. **Vertical & Roof** — slabs, ceilings, stairs, ramps, roof faces, and edges.
5. **Components** — counts, schedules, fictional coverage, and packaging.
6. **Massing & Site** — simple solids, paths, cut/fill, and section methods.
7. **Takeoff Desk** — tables, grouping, lineage, reconciliation, and revisions.
8. **Audit** — controlled root-cause cases across mastered domains.

### Recommended v1

Prioritize:

- metric units and exact integer-millimetre models;
- fictional face-, centreline-, finish-deduction-, and supply-rule profiles;
- rectangles, orthogonal polygons, simple coordinate polygons, and prisms;
- rooms, floors, walls, openings, finishes, slabs, simple stairs/ramps;
- mono-pitch/gable roofs with face and edge quantities;
- stable-ID component counts and small schedules;
- takeoff lines, gross/deduction/net, source tracing, duplicates, revision deltas;
- semantic SVG and structured accessible alternatives from the first release.

Add after v1:

- hip/stepped roofs;
- bounded cutting-yield puzzles;
- density mass;
- simple site, trench, pad cut/fill, average-end-area, and stockpile families;
- multi-domain integrated audits.

Defer:

- imperial/US customary units;
- any real standard/jurisdiction profile;
- real product databases, pricing, procurement, or recommended allowances;
- complex freeform geometry, terrain, CAD/BIM/PDF import, and automated takeoff;
- structural/MEP/reinforcement, carbon/LCA, productivity, and construction
  sequencing;
- professional document output.

## 18. Topic-level quality checklist

- [ ] Every exercise/export states fictional training quantities and the
      professional boundary.
- [ ] Every question names measurement profile, unit, quantity purpose, and
      rounding rule required for a unique answer.
- [ ] Withdrawn ISO 9836 is not presented as current or normative.
- [ ] RICS/IFC references are review anchors, not copied content or compliance
      claims.
- [ ] Geometry truth and measurement method remain separate versioned layers.
- [ ] Base, gross, addition/deduction, net, allowance, package, and display
      quantities remain separate.
- [ ] Count, length, area, volume, mass, ratio, and unit-rate types cannot mix
      accidentally.
- [ ] Written/model dimensions, never screen pixels, are authoritative.
- [ ] All drawings, schedules, and quantities derive from one semantic model.
- [ ] Every takeoff value has element/source/profile/expression lineage.
- [ ] Stable IDs prevent counting the same element from multiple views.
- [ ] Polygon, face, solid, count, aggregation, and revision quantities have
      independent validation paths.
- [ ] Curves, roofs, cut/fill, and cutting puzzles stay within exact bounded
      grammars.
- [ ] Every threshold and tie/rounding policy is explicit.
- [ ] Multiple valid decompositions are accepted.
- [ ] Missing rules produce `cannot determine`, never guessed convention.
- [ ] Supply, density, waste, and packaging figures are fictional supplied data,
      not recommendations.
- [ ] No cost, procurement, code, safety, design-adequacy, or professional
      conclusion appears.
- [ ] Every family specifies task, response/template, derivation, difficulty,
      misconception-based distractors/constraints, feedback, three examples,
      and automated validation.
- [ ] Visual and structured alternatives use the same semantic source.
- [ ] Seed, mutation, rendering, localization, and accessibility tests pass.
- [ ] The standalone app needs no backend or runtime external service.

## 19. Stable identifiers and navigation

Recommended navigation:

```text
Basis & Units
Plans & Spaces
Walls & Façades
Slabs & Vertical
Roofs
Components & Coverage
Massing & Site
Takeoff & Audit
```

Stable family identifiers are the backticked IDs above. Archived questions store
their full seed, family ID, model revision, measurement/supply/unit profile IDs,
oracle version, exact answer, display policy, and fault manifest where
applicable. Any semantic rule change requires a new version so prior attempts
remain reproducible.
