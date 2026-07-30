# Architectural Drawing & Spatial Reasoning — Dynamic Practice Specification

Status: implementation specification; educational drawings only, **not for construction**

Audience: parametric-building generator, exact geometry/projection oracle,
architectural-symbol renderer, drawing-set coordinator, answer checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual requirements meanings.

## 1. Topic overview

### Topic name

Architectural Drawing & Spatial Reasoning

### Topic goal

Develop fluency in reading, relating, checking, and constructing small
architectural drawings. The learner should become able to:

- distinguish plans, reflected ceiling plans, elevations, sections, details,
  axonometrics, and perspectives by what is projected and where it is cut;
- read line hierarchy, cut/projection conventions, grids, levels, dimensions,
  symbols, tags, keys, and view references under a displayed convention profile;
- convert reliably between drawing scale, paper distance, and model/real distance;
- use written dimensions as authoritative and recognize redundant, missing, or
  conflicting dimension chains;
- infer a simple three-dimensional arrangement from coordinated orthographic
  views;
- predict which walls, openings, stairs, roofs, and objects appear in a plan,
  section, or elevation;
- track room adjacency, doorway connectivity, routes, visibility, enclosure,
  orientation, and public/private spatial sequence;
- reason vertically about levels, floor-to-floor height, stairs, ramps, voids,
  double-height spaces, roofs, and section cuts;
- read and construct bounded isometric/axonometric and one-/two-point perspective
  relationships;
- coordinate information across a small drawing set and find contradictions,
  omissions, incorrect references, or stale revisions;
- satisfy a fictional space-planning brief with exact adjacency and dimensional
  constraints;
- distinguish a drawing fact from a graphical appearance or professional/code
  judgment not supplied by the exercise.

The app trains drawing literacy and spatial reasoning. It is not CAD/BIM
software, a professional-licensure course, a building-code checker, or a source
of construction documents.

### Audience and prerequisites

The initial audience ranges from an interested beginner to an architecture
student or practitioner refreshing drawing-reading fluency.

Prerequisites:

- arithmetic, ratios, unit conversion, and simple geometry;
- reading coordinates and diagrams;
- basic vocabulary such as wall, floor, door, window, roof, and room.

No CAD software or drafting equipment is required. Learn mode introduces every
symbol and convention before it is scored.

### Standards and convention boundary

Architectural conventions vary by jurisdiction, discipline, office, project
phase, and delivery standard. The app therefore uses versioned teaching profiles,
never an unlabeled claim that one graphic convention is universal.

The initial profile is:

```text
pl-architecture-metric-iso-informed-v1
```

It is **ISO-informed**, not a reproduction or certification of ISO standards.
Qualified reviewers with lawful access must map the teaching subset against the
applicable editions. Relevant current standard scopes include:

- [ISO 128-1:2020](https://www.iso.org/standard/65296.html), general requirements
  for technical drawings;
- [ISO 128-2:2022](https://www.iso.org/standard/83355.html), basic line
  conventions;
- [ISO 128-3:2022](https://www.iso.org/standard/83356.html), views, sections, and
  cuts;
- [ISO 129-1:2018](https://www.iso.org/standard/64007.html), presentation of
  dimensions and tolerances;
- [ISO 5455:1979](https://www.iso.org/standard/11500.html), drawing scales;
- [ISO 5456-3:1996](https://www.iso.org/standard/11503.html), axonometric
  representations;
- [ISO 7519:2025](https://www.iso.org/standard/89718.html), general presentation
  principles for construction general-arrangement and assembly drawings.

An optional U.S. profile must be separately reviewed. The
[United States National CAD Standard](https://www.nationalcadstandard.org/ncs5/about.php)
combines drawing-system, CAD-layer, and plotting guidance and is voluntary; it
must not be treated as interchangeable with the ISO-informed profile.

Each question stores:

```text
conventionProfileId
unitProfileId
projectionProfileId
symbolLibraryVersion
drawingSetVersion
geometryOracleVersion
```

Updating a standard/profile cannot silently change saved answers.

### Professional and safety boundary

Every exercise sheet and export states:

```text
FICTIONAL TRAINING DRAWING — NOT FOR DESIGN, PERMIT, FABRICATION, OR CONSTRUCTION
```

The app:

- uses fictional sites, projects, rooms, components, dimensions, and notes;
- makes no claim of code, zoning, accessibility, fire, egress, structural,
  environmental, energy, acoustic, waterproofing, or life-safety compliance;
- does not size real stairs, ramps, exits, structure, foundations, envelopes, or
  building services;
- does not accept a real project drawing for checking in v1;
- never says a generated layout is safe, buildable, approvable, accessible,
  economical, or professionally complete;
- treats every dimensional/design constraint as an exercise rule, not local law;
- requires qualified professional judgment for actual projects.

### Semantic building model

Every drawing derives from one exact model:

```text
BuildingModel {
  projectId
  coordinateSystem
  datums[]
  levels[]
  grids[]
  storeys[]
  spaces[]
  walls[]
  slabs[]
  roofs[]
  openings[]
  doors[]
  windows[]
  stairs[]
  ramps[]
  columns[]
  fixtures[]
  annotations[]
  viewDefinitions[]
}
```

Canonical world coordinates:

```text
x = east/right on canonical plan
y = north/up on canonical plan
z = elevation/up
units = millimetres internally
```

Display orientation may rotate a sheet, but north, world coordinates, dimensions,
and element IDs do not change.

Core v1 geometry uses axis-aligned or 45° walls, planar horizontal floors, simple
pitched/flat roofs, rectangular/polygonal rooms, and bounded straight/L/U stairs.
Curved/non-orthogonal geometry appears only where the oracle and renderer support
it exactly.

### Element model and topology

Walls are volumetric prisms with centerline/baseline, thickness, height, material
class, and openings. Spaces are bounded floor regions with level, clear height,
use label, and adjacency edges. Openings are hosted by exactly one wall and have
offset, width, sill, head, and orientation. Door leaves add swing/handing metadata.

Topology is explicit:

```text
space boundary
space adjacency
door-connected adjacency
open-connected adjacency
vertical connection
visibility portal
exterior boundary
```

Two rooms sharing a wall are adjacent but not necessarily connected. A door can
connect spaces without their centers being close. Visual proximity is not a
topological relation.

### View and projection model

```text
ViewDefinition {
  viewId
  type: plan | reflectedCeiling | elevation | section | detail |
        axonometric | perspective
  origin
  viewDirection
  upDirection
  cutPlane?
  depthRange?
  scale
  crop
  hiddenLinePolicy
  annotationProfile
}
```

- A floor plan is a horizontal cut with a stated cut elevation, conventionally
  viewed downward under the active profile.
- A reflected ceiling plan is a separate convention: it represents the ceiling
  as if viewed upward/reflected; its orientation rule is displayed.
- An elevation is an orthographic projection toward a named façade/direction.
- A section uses a stated cut plane and view direction; cut elements and elements
  beyond are distinct.
- A detail is an enlarged referenced region, not an independent geometry source.
- An axonometric is a parallel projection.
- A perspective is a central projection with a camera/eye point and picture
  plane.

The cut height/depth is never inferred from one universal value. It is stored in
the profile/question because office and project conventions vary.

### Graphic hierarchy model

The profile assigns semantic roles, not fixed device pixels:

```text
cutProfile
silhouette
primaryProjection
secondaryProjection
overheadOrBeyond
hidden
grid
dimension
leader
hatch
annotation
```

Line weight, type, opacity, and dash pattern derive from role. Color may
supplement but never replace the role. Cut elements generally receive stronger
graphic emphasis than projected elements under the teaching profile, but exact
weights/styles are profile data.

Hatches/material symbols in v1 identify fictional material categories only when
a legend states them. Texture is not an engineering specification.

### Scale and measurement model

A scale `1:n` means:

```text
1 unit on the plotted drawing = n of the same units in the model
paperLength = modelLength / n
modelLength = paperLength × n
```

The dimension text/model value is authoritative. Screen pixels are never a
measurement source because zoom, device scale, reflow, and screenshots change
them. Measurement-from-drawing questions use:

- a generated printable/vector sheet with an explicit plotted scale and
  calibration bar; or
- a supplied paper measurement as a number; or
- a deliberately calibrated on-screen ruler mode labeled as approximate.

Default metric display stores millimetres without a unit suffix only when the
profile/title block explicitly says all dimensions are millimetres. Otherwise
units are shown. Imperial feet/inches require a separate parsing and convention
profile.

### Dimension and tolerance boundary

Dimension objects store:

```text
Dimension {
  kind
  witnessA
  witnessB
  nominalValue
  displayValue
  unit
  chainId?
  referenceOnly?
  sourceModelEdge
}
```

V1 teaches nominal dimensions, chains, overall dimensions, opening offsets,
levels, slopes, and coordinates. It does not teach production tolerancing,
geometric product specification, construction tolerances, or legal precedence.

Rules:

- never derive a critical answer by measuring pixels when a dimension is given;
- reject dimension text that disagrees with the semantic model unless error
  detection is the task;
- avoid closed redundant chains in ordinary questions;
- distinguish a dimension from a note, level, coordinate, and slope;
- state rounding/precision for calculated dimensions.

### Architectural symbol profile

Core symbols are versioned SVG/semantic objects:

```text
north arrow
grid bubble
level datum
section line/arrows
elevation marker
detail callout
door leaf/swing
window opening
stair direction arrow
slope arrow
break line
revision cloud/delta
room tag
material hatch
```

Symbols are always paired with a legend in Learn mode and accessible labels.
Regional/office variants are not mixed within one question.

### Drawing-set references

References are structured:

```text
ViewReference {
  sourceViewId
  targetViewId
  targetSheetId
  markerType
  cutOrLookDirection?
  region?
}
```

A marker's number/letter does not create geometry; it identifies a target view.
The referenced view must exist, show the indicated region/direction, and use a
compatible model/revision.

### Space-planning model

Fictional briefs use explicit constraints:

```text
required spaces and minimum exercise areas
adjacency: required | preferred | forbidden
connection: door | open | visual | none
orientation preference
sequence/order
privacy/noise zone tags
fixed elements
maximum footprint
```

These are puzzle constraints, not regulations or universal design principles.
Subjective design quality, aesthetics, social value, and real client needs are
not reduced to one numeric score.

### Scope

Included:

- drawing types, sheet/view references, legends, line hierarchy, grids, levels,
  dimensions, symbols, door/window/stair conventions, and revision marks;
- metric scale ratios, measured/model distance, scale bars, resizing, paper
  choice, dimension chains, and area from scaled geometry;
- plans, reflected ceiling plans, elevations, sections, details, cut planes,
  projection depth, hidden/overhead elements, and view matching;
- plan topology, room boundaries, adjacency, connectivity, routes, thresholds,
  visibility, orientation, enclosure, and spatial sequence;
- levels, floor-to-floor height, slabs, ceilings, voids, stairs, ramps, roofs,
  slopes, and vertical coordination using supplied exercise rules;
- isometric/axonometric coordinates, exploded assemblies, one-/two-point
  perspective, horizon/vanishing points, and simple supplied sun-vector shadows;
- fictional briefs, adjacency matrices/bubble diagrams, layout constraint
  satisfaction, drawing-set coordination, revision comparison, and error audits.

### Exclusions

- actual design, permits, construction, fabrication, tender/contract documents,
  specifications, schedules, bills of quantities, or cost estimates;
- code/zoning/accessibility/fire/egress/structural/MEP compliance;
- structural analysis, member sizing, reinforcement, foundations, soil, wind,
  snow, seismic, drainage, moisture, thermal, acoustic, daylight certification,
  or energy modeling;
- surveying, property boundaries, legal title, geographic/site accuracy;
- unrestricted CAD/BIM authoring, IFC/Revit/DWG import/export, clash detection,
  parametric-family creation, or rendering workflows;
- photorealistic visualization or aesthetic scoring;
- freehand drawing quality, lettering penmanship, or motor-precision grading;
- arbitrary organic surfaces, complex stairs/roofs, freeform perspective, or
  hidden geometry the local oracle cannot prove;
- office-specific abbreviations or symbols without an active profile/legend.

### Global answer conventions

- Semantic element/view/sheet IDs are case-insensitive where displayed as codes.
- Length answers require compatible units unless the field fixes units.
- Metric input accepts `mm`, `cm`, and `m`; values normalize internally to mm.
- Scale accepts `1:100`, `1/100`, or named ratio fields; enlargement scales are
  explicit and never silently inverted.
- Angles default to degrees when the field displays `°`.
- Slopes distinguish ratio `1:n`, decimal gradient, percent, and angle; accepted
  forms depend on the prompt.
- Coordinates use the displayed origin and axis convention.
- Ordered routes/view sequences are order-sensitive; adjacency/visible-element
  sets are order-insensitive.
- Multiple geometrically valid layouts are all accepted when the family permits
  them.
- `not shown`, `not determined`, `not connected`, and `conflict` are first-class
  answers.
- Written dimensions override apparent screen length except in explicit
  dimension-error tasks.

### Difficulty philosophy

Difficulty should increase through:

- moving among plan, elevation, section, axonometric, and model representations;
- changing cut plane, view direction, crop, and projection depth;
- weaker but sufficient graphic cues and more coordinated references;
- multi-step scale/unit reasoning;
- dimension chains with relevant/irrelevant values;
- more rooms, thresholds, turns, levels, or vertical relationships;
- distinguishing adjacency from connectivity and visibility;
- coordinating a small set of views/revisions;
- inverse construction tasks and insufficiency/conflict recognition;
- satisfying several explicit spatial constraints.

Difficulty must not increase through:

- tiny labels, low contrast, dense hatching, arbitrary abbreviation overload, or
  illegible line weights;
- measuring screen pixels;
- hidden regional conventions;
- extremely large/awkward arithmetic;
- clutter unrelated to the target;
- unstated building-code knowledge;
- nearly coincident geometry or ambiguous projection;
- subjective taste presented as an exact answer;
- professional consequences attached to fictional mistakes.

### Shared generation and rejection rules

Reject an instance when:

- the semantic model is geometrically/topologically invalid;
- a space boundary self-intersects or a hosted opening leaves its wall;
- views disagree accidentally;
- view/cut direction is not explicit;
- cut and projection graphics cannot be distinguished;
- two symbols/line styles become indistinguishable at target size;
- a dimension chain conflicts unless conflict is intended;
- a route crosses walls except through modeled connections;
- several answers are valid but only one is accepted;
- the required answer depends on assumed code or office practice;
- projection causes coincident edges that hide the target distinction;
- a scale question depends on current browser zoom;
- distractors differ only by sloppy drawing artifacts;
- a structural signature recently appeared.

## 2. Category: Drawing types, conventions, symbols, and references

### Category purpose

Build a reliable visual grammar for recognizing what a drawing represents and
what its marks communicate before spatial calculation begins.

### Learn

A drawing is a coded projection, not a picture. Read its title, scale, view
direction, cut marker, legend, and line hierarchy. Thick/dark cut profiles,
lighter projected elements, dashed overhead/hidden elements, and annotation
lines have different roles under the active profile.

### Prerequisites

None.

### Category boundaries

This category reads notation. Scale calculation is Category 3; geometric
projection across views is Category 4.

### Common misconceptions

- Treating every thick line as a wall.
- Confusing a plan with a reflected ceiling plan.
- Reading a section arrow as north.
- Assuming dashed lines always mean one universal thing.
- Treating a door swing arc as physical floor geometry.
- Following a callout number without its sheet/view partner.

### Family `drawing_type_identify`

**Task.** Identify a plan, reflected ceiling plan, elevation, section, detail, axonometric, or perspective.

**Response/template.** Single choice: `What type of drawing is View {id}?`

**Derivation.** Query view type/camera/cut metadata.

**Difficulty.** L1 obvious plan/elevation; L2 section/detail; L3 plan versus RCP or axonometric versus perspective.

**Distractors/constraints.** No title-only leakage at advanced levels; defining cues remain.

**Feedback.** Highlight cut/projection/parallel-convergence evidence.

**Examples.** (1) horizontal cut through walls→plan. (2) vertical cut with poché→section. (3) ceiling fixtures viewed upward→RCP.

**Validation.** Renderer features agree with ViewDefinition.

### Family `line_role_identify`

**Task.** Name the semantic role of a selected line.

**Response/template.** Role choice.

**Derivation.** Read element/render-role mapping.

**Difficulty.** L1 cut versus projection; L2 overhead/hidden/grid; L3 leader versus object edge at crossing.

**Distractors/constraints.** Style interpreted only under displayed profile.

**Feedback.** Show source element and role hierarchy.

**Examples.** (1) cut wall profile→cutProfile. (2) dashed cabinet overhead→overhead. (3) thin line ending in arrow/text→leader.

**Validation.** Semantic role independent of pixels/color.

### Family `line_hierarchy_rank`

**Task.** Rank selected drawing elements by intended graphic emphasis.

**Response/template.** Ordered roles.

**Derivation.** Use profile's line-role priority.

**Difficulty.** L1 cut/projected; L2 four roles; L3 detect one role assigned wrong weight.

**Distractors/constraints.** No universal numeric pen weight inferred outside profile.

**Feedback.** Explain foreground/cut/annotation hierarchy.

**Examples.** (1) cut wall before furniture. (2) silhouette before secondary surface. (3) dimension should not overpower cut edge.

**Validation.** Profile partial order; all valid ties accepted.

### Family `symbol_match_meaning`

**Task.** Match core symbols to meanings.

**Response/template.** Matching.

**Derivation.** Versioned symbol-library lookup.

**Difficulty.** L1 north/grid/level; L2 section/elevation/detail markers; L3 similar profile variants.

**Distractors/constraints.** Only active-profile symbols.

**Feedback.** Expand symbol with semantic parts.

**Examples.** (1) north arrow→orientation. (2) grid bubble→grid line ID. (3) section marker→cut plane+look direction+reference.

**Validation.** Symbol ID and accessible label match.

### Family `door_window_symbol_read`

**Task.** Interpret opening type, position, and door swing/handing shown in plan.

**Response/template.** Structured fields or matching.

**Derivation.** Read hosted-opening geometry and symbol metadata.

**Difficulty.** L1 single hinged door; L2 double/sliding/opening; L3 mirrored handing.

**Distractors/constraints.** Swing arc is operation envelope, not wall.

**Feedback.** Show hinge, leaf, path, and connected spaces.

**Examples.** (1) hinge left, opens inward. (2) sliding leaf has no swing arc. (3) window interrupts wall but does not connect rooms.

**Validation.** Symbol generated from opening object.

### Family `grid_level_tag_read`

**Task.** Read a grid intersection, room tag, or level datum.

**Response/template.** Code/value fields.

**Derivation.** Resolve tag to model object/value.

**Difficulty.** L1 one tag; L2 crossing grids; L3 level relative to project datum.

**Distractors/constraints.** Grid ID is not coordinate magnitude unless defined.

**Feedback.** Trace bubble/tag leader to target.

**Examples.** (1) column at B/3. (2) room tag R-104 names space. (3) level `+3.200 m` relative to `±0.000`.

**Validation.** Reference endpoint and model ID exact.

### Family `section_marker_direction`

**Task.** Determine where a section is cut and which way it looks.

**Response/template.** Cut-line selection plus direction choice.

**Derivation.** Read marker line and arrow/view vector.

**Difficulty.** L1 straight cut; L2 offset section; L3 distinguish section ID/sheet.

**Distractors/constraints.** Arrow not confused with route/north/slope.

**Feedback.** Shade cut plane and view half-space.

**Examples.** (1) A-A looks east. (2) offset line crosses two aligned features. (3) detail bubble has region but no full cut plane.

**Validation.** Marker/reference/ViewDefinition consistent.

### Family `view_reference_follow`

**Task.** Navigate from a callout to its target view/sheet.

**Response/template.** View/sheet pair.

**Derivation.** Resolve ViewReference.

**Difficulty.** L1 same sheet; L2 another sheet; L3 nested detail reference.

**Distractors/constraints.** Number and sheet fields not swapped.

**Feedback.** Show source marker→target title chain.

**Examples.** (1) `3/A201`→view3 sheetA201. (2) elevation marker with four directions. (3) section references detail within target.

**Validation.** Target exists and region/direction compatible.

### Family `legend_symbol_apply`

**Task.** Use a supplied legend to interpret an unfamiliar hatch/symbol/abbreviation.

**Response/template.** Meaning choice.

**Derivation.** Exact legend mapping, not memorized convention.

**Difficulty.** L1 direct; L2 similar entries; L3 same mark differs between two profile legends.

**Distractors/constraints.** Legend always visible; no outside office knowledge.

**Feedback.** Cite legend entry.

**Examples.** (1) hatch H2→fictional material B. (2) `OH` defined overhead in this sheet. (3) same dashed style means demolition only in supplied phase legend.

**Validation.** Legend scope and key uniqueness.

### Family `convention_audit`

**Task.** Find an incorrect line role, symbol, reference, legend, or drawing-type label.

**Response/template.** Element choice and correction.

**Derivation.** Compare rendering/reference graph with active profile.

**Difficulty.** L1 wrong symbol; L2 wrong emphasis; L3 valid marker points to incompatible view.

**Distractors/constraints.** One root defect.

**Feedback.** Name violated profile rule.

**Examples.** (1) cut wall drawn as dimension line. (2) section arrow labeled north. (3) callout targets nonexisting view.

**Validation.** Mutate one semantic/render/reference mapping.

### Cross-family progression

Drawing type and line roles precede symbols. Doors/windows and grids/levels then
build plan literacy. Section direction and view-reference navigation follow.
Legend-based unfamiliar marks are interleaved so memorization does not replace
profile reading; audit comes last.

## 3. Category: Scale, dimensions, measurement, and sheet fit

### Category purpose

Build reliable dimensional reasoning between model space and plotted drawings,
and teach that dimensions/metadata—not screen appearance—control.

### Learn

At `1:100`, 1 mm on paper represents 100 mm in the model. Keep units the same
before applying the ratio. Written dimensions are authoritative; a screen view
may be zoomed. Dimension chains should determine what is needed without
contradiction or unnecessary duplication.

### Prerequisites

Ratios, unit conversion, addition/subtraction, rectangle area.

### Category boundaries

This category handles numeric drawing scale and dimensions. Similarity theory is
owned by Geometry & Trigonometry; professional tolerances are excluded.

### Common misconceptions

- Multiplying/dividing scale in the wrong direction.
- Treating `1:50` as smaller on paper than `1:100`.
- Mixing metres and millimetres before scaling.
- Measuring a zoomed screenshot.
- Adding wall thickness twice in a dimension chain.
- Assuming a rounded graphic length overrides written dimension.

### Family `scale_model_from_paper`

**Task.** Compute model/real length from supplied paper length and scale.

**Response/template.** Quantity: `At {scale}, {paperLength} on paper represents what model length?`

**Derivation.** Convert units, multiply by denominator.

**Difficulty.** L1 mm→mm; L2 report metres; L3 decimal paper length.

**Distractors/constraints.** Reciprocal, skipped unit conversion.

**Feedback.** Show same-unit factor chain.

**Examples.** (1) 35 mm at1:100→3500 mm=3.5 m. (2) 82 mm at1:50→4.1 m. (3) 12.5 mm at1:200→2.5 m.

**Validation.** Exact rational conversion.

### Family `scale_paper_from_model`

**Task.** Compute plotted paper length from model length and scale.

**Response/template.** Paper quantity.

**Derivation.** Convert to paper unit, divide by denominator.

**Difficulty.** L1 whole mm; L2 model metres; L3 choose rounding precision.

**Distractors/constraints.** Multiply instead of divide; unit mismatch.

**Feedback.** Show model÷scale.

**Examples.** (1) 6 m at1:100→60 mm. (2) 3.6 m at1:50→72 mm. (3) 17.5 m at1:200→87.5 mm.

**Validation.** Reverse scale check.

### Family `scale_identify`

**Task.** Infer scale ratio from one model length and its plotted length.

**Response/template.** `1:n`.

**Derivation.** Convert same units and compute `n=model/paper`.

**Difficulty.** L1 standard ratio; L2 mixed units; L3 detect inconsistent measurements.

**Distractors/constraints.** Scale denominator positive; nonuniform scaling returns conflict.

**Feedback.** Divide corresponding lengths.

**Examples.** (1) 5 m shown50 mm→1:100. (2) 12 m shown60 mm→1:200. (3) horizontal implies100, vertical implies90→not uniform/conflict.

**Validation.** Multiple-pair consistency.

### Family `scale_compare_detail`

**Task.** Compare which scale shows more detail/larger plotted geometry.

**Response/template.** Scale choice/ranking.

**Derivation.** Smaller reduction denominator gives larger plot at same model size.

**Difficulty.** L1 1:50 versus1:100; L2 several; L3 include enlargement 2:1 explicitly.

**Distractors/constraints.** Numeric-denominator intuition.

**Feedback.** Compute one common model length at each.

**Examples.** (1) 1:20 larger than1:100. (2) rank1:10,1:50,1:200. (3) 2:1 is enlargement.

**Validation.** Ratio magnitude.

### Family `scale_bar_use`

**Task.** Derive a distance using a supplied graphic scale bar, including resized drawing.

**Response/template.** Quantity or segment comparison.

**Derivation.** Use ratio to scale-bar semantic length, not nominal title scale.

**Difficulty.** L1 direct; L2 print resized uniformly; L3 title scale conflicts with bar.

**Distractors/constraints.** Graphic bar is generated semantically; screen pixels used only relative within same rendered image.

**Feedback.** Calibrate against bar.

**Examples.** (1) segment twice 5 m bar→10 m. (2) 80% resized sheet still bar-valid. (3) title says1:100 but resized; use bar for explicit exercise.

**Validation.** Common rendered transform cancels in ratio.

### Family `dimension_chain_missing`

**Task.** Find a missing chained/overall dimension.

**Response/template.** Length.

**Derivation.** Sum/subtract exact collinear intervals.

**Difficulty.** L1 two segments; L2 several openings/piers; L3 wall thickness/clear dimensions distinguished.

**Distractors/constraints.** Witness points explicit.

**Feedback.** Draw interval equation.

**Examples.** (1) 2400+900=3300. (2) overall8000 minus three known spans. (3) clear room excludes two wall thicknesses.

**Validation.** Coordinate differences and chain sum agree.

### Family `dimension_reference_points`

**Task.** Determine exactly which faces/centerlines/gridlines a dimension measures between.

**Response/template.** Endpoint pair choice.

**Derivation.** Read dimension witness IDs.

**Difficulty.** L1 face-to-face; L2 centerline-to-face; L3 nested dimension strings.

**Distractors/constraints.** Arrow proximity cannot substitute for witness extension.

**Feedback.** Highlight witness lines.

**Examples.** (1) clear opening jamb-to-jamb. (2) grid center to wall face. (3) overall exterior-face dimension.

**Validation.** Dimension object endpoints exact.

### Family `dimension_redundancy_conflict`

**Task.** Decide whether a dimension set is sufficient, underdetermined, redundant-consistent, or conflicting.

**Response/template.** Classification plus offending/missing dimension.

**Derivation.** Build linear constraint system and test rank/consistency.

**Difficulty.** L1 missing span; L2 closed chain; L3 one inconsistent value.

**Distractors/constraints.** Ordinary profile avoids professional precedence claims.

**Feedback.** Show independent equations.

**Examples.** (1) two of three collinear spans plus overall→determined. (2) all spans+matching overall→redundant. (3) sums8000 but overall7900→conflict.

**Validation.** Exact linear algebra.

### Family `scaled_area`

**Task.** Compute model area from scaled plan dimensions or a calibrated polygon.

**Response/template.** Area with units.

**Derivation.** Recover model lengths then exact polygon/rectangle area.

**Difficulty.** L1 rectangle dimensions given; L2 paper measures; L3 composite orthogonal polygon.

**Distractors/constraints.** Area scale factor squared; no pixel measurement without calibration.

**Feedback.** Convert lengths first, then area.

**Examples.** (1) 4 m×5 m→20 m². (2) 40×60 mm at1:100→24 m². (3) L-shape subtract rectangle.

**Validation.** Polygon shoelace/decomposition agreement.

### Family `sheet_fit_scale`

**Task.** Choose a scale that fits a model extent in a supplied drawing area/margins.

**Response/template.** Scale choice.

**Derivation.** Compute plotted bounding box at each candidate and include required annotation allowance.

**Difficulty.** L1 one dimension; L2 width/height; L3 rotated sheet and reserved title/text space.

**Distractors/constraints.** “Largest scale that fits” wording explicit.

**Feedback.** Compare plotted extents with usable area.

**Examples.** (1) 20 m on250 mm→1:100 fits,1:50 not. (2) landscape versus portrait. (3) include20 mm annotation margin.

**Validation.** Exact bounding-box containment.

### Family `scale_dimension_audit`

**Task.** Find a scale, unit, witness, chain, measurement, or sheet-fit error.

**Response/template.** Step/element choice and correction.

**Derivation.** Replay conversions and constraint graph.

**Difficulty.** L1 reciprocal; L2 screenshot measured; L3 redundant chain conflict.

**Distractors/constraints.** One root defect.

**Feedback.** State authoritative source and factor.

**Examples.** (1) 1:100 divides paper by100. (2) 2 m labeled200 mm. (3) detail at1:20 measured using parent1:100 scale.

**Validation.** Single mutation of valid dimension set.

### Cross-family progression

Forward/reverse scale calculations come first, then scale identification and
comparison. Scale bars are taught before any measurement task. Dimension witness
points and chains precede redundancy/conflict and sheet fit. Area follows reliable
linear scaling; audits close the category.

## 4. Category: Plans, elevations, sections, and coordinated projection

### Category purpose

Train conversion between a simple three-dimensional model and its coordinated
orthographic views, with explicit cut planes and directions.

### Learn

Ask three questions: where is the cut plane, which way are we looking, and what
lies within the projection depth? A cut wall is not the same as a wall seen
beyond. Views must agree because they derive from the same model.

### Prerequisites

Categories 2–3; elementary 3D orientation.

### Category boundaries

This category establishes projection. Route/space experience is Category 5;
vertical calculations are Category 6.

### Common misconceptions

- Treating a plan as a view from infinitely above without a cut.
- Showing an opening above/below the plan cut as if cut.
- Reversing elevation view direction.
- Confusing cut elements and projected elements in section.
- Assuming a section displays everything on both sides.
- Matching views by superficial outline while openings disagree.

### Family `plan_cut_visibility`

**Task.** Classify elements as cut, visible below/beyond, overhead, or absent in a plan.

**Response/template.** Matching.

**Derivation.** Intersect geometry with horizontal cut plane and apply depth/overhead policy.

**Difficulty.** L1 walls/door; L2 windows at varying sill/head; L3 void/overhead cabinet.

**Distractors/constraints.** Cut height displayed.

**Feedback.** Show vertical mini-section at each element.

**Examples.** (1) wall crosses cut→cut. (2) high window entirely above→overhead/profile-specific. (3) low fixture below cut→projected.

**Validation.** Exact z-interval intersection.

### Family `plan_from_model`

**Task.** Select the correct plan for a shown simple 3D/axonometric model and cut height.

**Response/template.** Single choice.

**Derivation.** Generate plan projection from model.

**Difficulty.** L1 one room/opening; L2 several walls; L3 high/low elements.

**Distractors/constraints.** Mirrored plan, wrong cut, missing opening, view-up reversal.

**Feedback.** Drop model edges to plan and mark cuts.

**Examples.** (1) rectangular room with east door. (2) partition and two windows. (3) mezzanine edge overhead.

**Validation.** Candidate semantic plans compared, not images.

### Family `elevation_from_plan`

**Task.** Select/construct the elevation seen from a marked direction.

**Response/template.** Choice or ordered openings.

**Derivation.** Orthographically project façade-facing surfaces and openings.

**Difficulty.** L1 one opening; L2 depths/occlusion; L3 roof/profile and side returns.

**Distractors/constraints.** Mirroring and opposite façade.

**Feedback.** Trace view rays and horizontal positions.

**Examples.** (1) east elevation shows east wall window. (2) near wing occludes rear opening. (3) sloped roof silhouette.

**Validation.** Depth-buffer/interval occlusion oracle.

### Family `section_from_plan_marker`

**Task.** Select the section produced by a plan cut marker.

**Response/template.** Single choice.

**Derivation.** Intersect vertical plane, project in arrow direction.

**Difficulty.** L1 straight wall/door; L2 stair/void; L3 offset section.

**Distractors/constraints.** Opposite look, wrong cut location, elevation without cut emphasis.

**Feedback.** Highlight plan intersections then projected background.

**Examples.** (1) cut crosses two walls. (2) cut passes stair lengthwise. (3) offset cut includes two noncollinear openings.

**Validation.** Section geometry exact.

### Family `view_opening_correspondence`

**Task.** Match doors/windows across plan, elevation, and section.

**Response/template.** Matching stable opening IDs.

**Derivation.** Project same hosted elements into views.

**Difficulty.** L1 unique size; L2 repeated sizes/positions; L3 one opening absent due crop/occlusion.

**Distractors/constraints.** Tags may be hidden at higher levels.

**Feedback.** Show host wall and projection coordinates.

**Examples.** (1) north window W1. (2) two same windows distinguished by grid. (3) high clerestory appears in elevation/section but overhead in plan.

**Validation.** Element ID lineage.

### Family `projection_height_transfer`

**Task.** Transfer a point/opening/level coordinate between coordinated views.

**Response/template.** Position selection or dimension.

**Derivation.** Preserve shared world coordinate across orthographic axes.

**Difficulty.** L1 plan x→elevation x; L2 section z; L3 several projection lines.

**Distractors/constraints.** Sheet placement itself not coordinate evidence without alignment setup.

**Feedback.** Draw construction/projection lines.

**Examples.** (1) window plan x locates elevation center. (2) sill z transfers section→elevation. (3) corner maps across three views.

**Validation.** World-coordinate equality.

### Family `elevation_orientation_match`

**Task.** Match north/east/south/west elevations to a plan.

**Response/template.** Four-way matching.

**Derivation.** Project each cardinal façade.

**Difficulty.** L1 unique openings; L2 similar façades; L3 rotated north orientation.

**Distractors/constraints.** World north independent of page top.

**Feedback.** Place view arrows around plan.

**Examples.** (1) north has two windows. (2) east has door. (3) plan rotated90° on sheet.

**Validation.** View vectors and façade IDs.

### Family `section_cut_projected`

**Task.** Distinguish elements physically cut from elements merely seen beyond in section.

**Response/template.** Element classification.

**Derivation.** Plane intersection versus half-space projection.

**Difficulty.** L1 cut slab/background door; L2 column near plane; L3 oblique/offset segment.

**Distractors/constraints.** Graphic weight cannot be sole clue in Learn diagnostic.

**Feedback.** Show distance to cut plane.

**Examples.** (1) wall intersected→cut. (2) window on far wall→projected. (3) beam above crop→absent.

**Validation.** Signed-distance intersection.

### Family `rcp_plan_correspondence`

**Task.** Relate ceiling fixtures/soffits to floor-plan walls under the displayed RCP convention.

**Response/template.** Position matching.

**Derivation.** Project ceiling elements with profile orientation/reflection rule.

**Difficulty.** L1 one fixture; L2 grid/soffit; L3 asymmetric room and rotated sheet.

**Distractors/constraints.** RCP orientation explicitly shown.

**Feedback.** Align room boundary and ceiling coordinates.

**Examples.** (1) light centered in room. (2) soffit along west wall. (3) ceiling opening above plan cut.

**Validation.** Same world x/y coordinates.

### Family `orthographic_view_complete`

**Task.** Add/select a missing edge/opening in a view so all views coordinate.

**Response/template.** Element/segment choice.

**Derivation.** Compare rendered view with model projection.

**Difficulty.** L2 missing window; L3 hidden/overhead style; L4 partial crop.

**Distractors/constraints.** Exactly one missing semantic element.

**Feedback.** Cite coordinating view/model evidence.

**Examples.** (1) elevation lacks plan window. (2) plan lacks overhead beam line. (3) section misses cut slab edge.

**Validation.** Set difference between oracle/rendered elements.

### Family `orthographic_coordination_audit`

**Task.** Find a cut, direction, projection, occlusion, or cross-view inconsistency.

**Response/template.** View/element choice and correction.

**Derivation.** Regenerate all views from model.

**Difficulty.** L1 mirrored elevation; L2 wrong cut classification; L3 same opening differs across revisions.

**Distractors/constraints.** One root defect.

**Feedback.** Trace source element through views.

**Examples.** (1) east elevation shows west door. (2) high window cut at low plane. (3) section arrow and actual projection oppose.

**Validation.** Single mutation of coordinated set.

### Cross-family progression

Plan cut visibility precedes model-to-plan and direction-to-elevation. Section
selection follows marker direction. Opening correspondence and coordinate
transfer build multi-view fluency; RCP is a separate profile. Completion and
audit come last.

## 5. Category: Plan topology, adjacency, circulation, and spatial sequence

### Category purpose

Train reading a plan as connected space rather than as an arrangement of lines.

### Learn

Sharing a wall means adjacency; a door/opening means connectivity; a line of
sight requires an unobstructed visibility path. These relationships overlap but
are not identical. Trace routes through portals, not across wall graphics.

### Prerequisites

Plan symbols from Category 2 and plan projection from Category 4.

### Category boundaries

This category evaluates exact fictional topology and brief constraints, not
real-world egress, accessibility, usability, or safety.

### Common misconceptions

- Calling adjacent rooms connected without a door.
- Counting a window as circulation.
- Tracing through a door swing leaf as if it were a wall.
- Ignoring exterior/interior threshold distinction.
- Assuming a straight-line route can cross partitions.
- Treating plan north as page up after rotation.

### Family `space_boundary_identify`

**Task.** Select the complete boundary of a room/space.

**Response/template.** Boundary segment set.

**Derivation.** Query space polygon and boundary elements.

**Difficulty.** L1 rectangle; L2 L-shape; L3 open boundary/virtual separator.

**Distractors/constraints.** Furniture edges never define room boundary unless explicitly fixed.

**Feedback.** Trace closed region and label openings.

**Examples.** (1) four walls. (2) alcove adds two turns. (3) open kitchen/living separated by virtual zone line.

**Validation.** Polygon/region topology.

### Family `space_adjacency`

**Task.** Identify spaces sharing a boundary.

**Response/template.** Pair/set choice.

**Derivation.** Boundary-intersection graph above minimum semantic length.

**Difficulty.** L1 obvious pair; L2 multiple; L3 corner-touch is not edge adjacency under profile.

**Distractors/constraints.** Near/door-connected through hall differs.

**Feedback.** Highlight shared boundary.

**Examples.** (1) kitchen shares wall with dining. (2) bedrooms separated by corridor→not adjacent. (3) corner touch→not adjacency.

**Validation.** Exact topology.

### Family `space_connectivity`

**Task.** Determine which spaces are directly connected by passable modeled openings.

**Response/template.** Connection set.

**Derivation.** Door/open portal edges.

**Difficulty.** L1 one door; L2 exterior connections; L3 locked/closed status supplied as puzzle state.

**Distractors/constraints.** Windows excluded; no accessibility judgment.

**Feedback.** Highlight portal and connected space IDs.

**Examples.** (1) A-B door→connected. (2) shared wall no opening→not. (3) open arch connects zones.

**Validation.** Portal graph.

### Family `route_shortest`

**Task.** Find a shortest valid route between spaces under supplied edge costs.

**Response/template.** Ordered spaces/portals or distance.

**Derivation.** BFS/Dijkstra on connectivity graph.

**Difficulty.** L1 unweighted; L2 multiple equal routes; L3 weighted corridors/stairs.

**Distractors/constraints.** All equal shortest routes accepted; no safety claim.

**Feedback.** Trace graph path and cost.

**Examples.** (1) Entry→Hall→Studio. (2) two routes equal. (3) stair edge cost2.

**Validation.** Independent graph solve.

### Family `route_instruction_follow`

**Task.** Follow relative turn/door instructions through a plan and identify destination.

**Response/template.** Space/door choice.

**Derivation.** Update position/heading across portal geometry.

**Difficulty.** L1 world directions; L2 left/right from heading; L3 rotated plan/multiple thresholds.

**Distractors/constraints.** Instruction never ambiguous at a node.

**Feedback.** Replay heading and portal at each step.

**Examples.** (1) enter, first door east→Office. (2) turn left after lobby. (3) plan north rotated.

**Validation.** Deterministic navigation state.

### Family `visibility_between_spaces`

**Task.** Decide whether two points/spaces have direct modeled line of sight.

**Response/template.** Yes/no plus blocking element.

**Derivation.** Segment/portal intersection at stated eye height.

**Difficulty.** L1 open doorway; L2 offset openings; L3 partial-height screen with eye height supplied.

**Distractors/constraints.** Visibility is not connectivity.

**Feedback.** Draw sight ray and first obstruction.

**Examples.** (1) aligned open doors→yes. (2) connected around corner→no direct view. (3) low partition below eye ray→yes under model.

**Validation.** Exact ray intersection.

### Family `spatial_sequence_order`

**Task.** Order spaces encountered along a marked route or threshold sequence.

**Response/template.** Ordered cards.

**Derivation.** Intersect route polyline with space regions/portals.

**Difficulty.** L1 three spaces; L2 return/re-entry; L3 indoor/outdoor transitions.

**Distractors/constraints.** Adjacency order not substituted for actual route.

**Feedback.** Animate/highlight route sequentially with reduced-motion static alternative.

**Examples.** (1) Street→Vestibule→Hall. (2) route re-enters courtyard. (3) two doors to same room counted once/each per prompt.

**Validation.** Ordered region crossing.

### Family `orientation_from_plan`

**Task.** Determine world direction or relative side of a room/opening from north and viewer heading.

**Response/template.** N/E/S/W or left/right/front/back.

**Derivation.** Transform plan/world coordinates.

**Difficulty.** L1 north-up; L2 rotated plan; L3 relative viewer heading.

**Distractors/constraints.** Page axes separated from world axes.

**Feedback.** Overlay compass/body axes.

**Examples.** (1) window on north wall. (2) sheet rotated90°. (3) facing west, south door is left.

**Validation.** Direction-vector transform.

### Family `zone_privacy_sequence`

**Task.** Check a layout against explicit fictional public/semiprivate/private sequence tags.

**Response/template.** Pass/fail constraints and offending edge/route.

**Derivation.** Evaluate supplied zone-order rules on connectivity paths.

**Difficulty.** L2 one path; L3 alternate bypass; L4 several explicit constraints.

**Distractors/constraints.** Tags are exercise inputs, not universal judgments.

**Feedback.** Show violating path/threshold.

**Examples.** (1) entry reaches private room only through semiprivate zone→passes rule. (2) direct public-private door violates. (3) alternate service path exempt when stated.

**Validation.** Graph path constraints.

### Family `plan_topology_audit`

**Task.** Find a boundary, adjacency, connectivity, route, visibility, or orientation error.

**Response/template.** Relation choice and correction.

**Derivation.** Recompute geometric/topological graphs.

**Difficulty.** L1 window counted door; L2 adjacency confused with connectivity; L3 route crosses wall.

**Distractors/constraints.** One root defect.

**Feedback.** Identify graph relation and physical evidence.

**Examples.** (1) corner-touch called adjacent. (2) connected rooms claimed visible around corner. (3) page-up called north despite arrow.

**Validation.** Single relation mutation.

### Cross-family progression

Boundaries precede adjacency and connectivity. Routes follow the connection
graph; visibility is introduced as a deliberate contrast. Orientation and
sequence then support explicit zone constraints. Audit comes last.

## 6. Category: Levels, sections, stairs, ramps, roofs, and vertical space

### Category purpose

Train exact vertical reasoning from levels and sections, including how horizontal
plans connect through slabs, voids, stairs, ramps, and roofs.

### Learn

Levels are elevations relative to a datum. Floor-to-floor height is the
difference between level elevations; clear height may also subtract structure or
ceiling zones. Stair/ramp rules in this app are supplied arithmetic constraints,
not regulations.

### Prerequisites

Scale/dimensions and section projection.

### Category boundaries

This category performs fictional geometry only. Structural and code-compliant
sizing are excluded.

### Common misconceptions

- Confusing absolute level with height difference.
- Subtracting slab thickness from the wrong interval.
- Counting stair treads and risers as always equal.
- Reversing rise/run or percent slope.
- Missing a double-height void on the upper plan.
- Inferring roof drainage/performance from a diagram.

### Family `level_difference`

**Task.** Compute an elevation or vertical difference from datums.

**Response/template.** Signed elevation/length.

**Derivation.** Subtract exact z coordinates.

**Difficulty.** L1 two levels; L2 negative datum; L3 chained offsets.

**Distractors/constraints.** Preserve sign and unit.

**Feedback.** Place values on vertical number line.

**Examples.** (1) +3.200−0.000→3.200 m. (2) −0.450 to+2.750→3.200 m. (3) roof from level plus parapet.

**Validation.** Exact coordinate difference.

### Family `floor_clear_height`

**Task.** Compute floor-to-floor, floor-to-soffit, or clear ceiling height from supplied layers.

**Response/template.** Length.

**Derivation.** Difference levels and subtract only explicitly intervening zones.

**Difficulty.** L1 floor-to-floor; L2 slab; L3 ceiling/service zone.

**Distractors/constraints.** Diagram labels define measurement endpoints.

**Feedback.** Stack vertical intervals.

**Examples.** (1) 3.3 m floor-to-floor. (2) subtract250 mm slab→3.05 m soffit. (3) subtract ceiling drop.

**Validation.** z interval chain.

### Family `stair_riser_count`

**Task.** Determine equal riser count/height from total rise and a supplied allowed-count/target rule.

**Response/template.** Count and rise.

**Derivation.** `riserHeight=totalRise/count`; test exercise constraints.

**Difficulty.** L1 count supplied; L2 choose integer count in fictional range; L3 two flights.

**Distractors/constraints.** Rules printed; no code claim.

**Feedback.** Sum risers back to total rise.

**Examples.** (1) 3000/15→200 mm. (2) choose16 for3200 under supplied exact target200. (3) 18 split9+9.

**Validation.** Integer/count and reverse total.

### Family `stair_tread_riser_relation`

**Task.** Compute treads/landings or locate upper/lower stair from stated stair model.

**Response/template.** Count/dimension/plan element.

**Derivation.** Apply explicitly declared rule such as one fewer tread than risers per uninterrupted flight when upper floor is final landing.

**Difficulty.** L2 single flight; L3 landing split; L4 plan/section coordination.

**Distractors/constraints.** Counting convention always stated.

**Feedback.** Number rises and horizontal goings.

**Examples.** (1) 10 risers→9 treads under stated rule. (2) two flights with intermediate landing. (3) identify up arrow from lower plan.

**Validation.** Stair graph and endpoint levels.

### Family `ramp_slope`

**Task.** Convert rise/run among ratio, percent, and angle or solve required run under supplied rule.

**Response/template.** Quantity/representation.

**Derivation.** gradient=`rise/run`; percent×100; angle=`atan(gradient)`.

**Difficulty.** L1 ratio; L2 percent; L3 solve run/landing segments.

**Distractors/constraints.** Ratio direction displayed; not compliance.

**Feedback.** Draw rise/run triangle.

**Examples.** (1) 1:20→5%. (2) 300 mm rise at1:15→4500 mm run. (3) 4% over8 m→0.32 m rise.

**Validation.** Exact/declared rounding and reverse check.

### Family `void_double_height`

**Task.** Determine which floors/ceilings are absent/present around a void or double-height space.

**Response/template.** View/region matching.

**Derivation.** Intersect space/slab volumes at each level.

**Difficulty.** L1 one void; L2 mezzanine edge; L3 opening shifts between levels.

**Distractors/constraints.** Space name alone not enough.

**Feedback.** Stack plans beside section.

**Examples.** (1) upper plan shows opening over lobby. (2) mezzanine covers half. (3) skylight void only at roof.

**Validation.** Horizontal slice topology.

### Family `roof_slope_elevation`

**Task.** Compute roof high/low elevation or match roof plan to section using supplied slope.

**Response/template.** Elevation/view choice.

**Derivation.** rise=horizontal run×gradient along declared fall vector.

**Difficulty.** L1 mono-pitch; L2 ridge; L3 unequal spans.

**Distractors/constraints.** No drainage/structure conclusion.

**Feedback.** Show fall arrow and vertical triangle.

**Examples.** (1) 1:10 over4 m→0.4 m. (2) symmetric ridge over8 m half-span. (3) section perpendicular versus parallel to fall.

**Validation.** roof-plane equation.

### Family `vertical_opening_section`

**Task.** Locate window/door sill, head, and slab relationships in section/elevation.

**Response/template.** Dimension/element matching.

**Derivation.** Use hosted opening z interval and level datum.

**Difficulty.** L1 sill/head; L2 opening crosses ceiling zone; L3 repeated levels.

**Distractors/constraints.** Width from plan not substituted for height.

**Feedback.** Mark z endpoints.

**Examples.** (1) sill900, head2100. (2) door head below soffit. (3) clerestory above plan cut.

**Validation.** Opening volume coordinates.

### Family `vertical_route_levels`

**Task.** Trace a route through stairs/ramps and report level sequence/total rise.

**Response/template.** Ordered levels plus quantity.

**Derivation.** Traverse vertical-connection graph and sum signed changes.

**Difficulty.** L2 one stair; L3 mixed stair/ramp; L4 split levels.

**Distractors/constraints.** Route rules fictional; all equal valid paths accepted.

**Feedback.** Show section path.

**Examples.** (1) L0→L1. (2) down half-level then up full. (3) ramp to mezzanine.

**Validation.** Graph and z sums.

### Family `vertical_coordination_audit`

**Task.** Find a datum, clearance, stair, ramp, void, opening, or roof inconsistency.

**Response/template.** Element/step choice and correction.

**Derivation.** Replay z geometry/constraints across views.

**Difficulty.** L1 level arithmetic; L2 risers do not sum; L3 upper plan covers modeled void.

**Distractors/constraints.** One root defect.

**Feedback.** Show vertical interval/state mismatch.

**Examples.** (1) 15×190≠3000. (2) section head differs from elevation. (3) roof high point placed downslope.

**Validation.** Single z-model mutation.

### Cross-family progression

Levels and clear heights precede stairs/ramps. Voids and openings connect plans
to sections. Roof planes follow slope fluency. Vertical route and audits combine
only mastered relationships.

## 7. Category: Axonometric, perspective, and projected spatial construction

### Category purpose

Train mental conversion between orthographic geometry and parallel/central
projections without grading artistic rendering.

### Learn

Parallel projection keeps parallel model directions parallel. Perspective
projects toward an eye point: horizontal lines parallel in the world may converge
to vanishing points on the horizon. A drawing can be spatially correct without
being measured from its picture.

### Prerequisites

Categories 3–4; coordinates and parallel lines.

### Category boundaries

This category checks projection geometry, not sketch beauty, rendering,
composition, or photorealism.

### Common misconceptions

- Adding perspective convergence to an axonometric.
- Measuring true length on a perspective image.
- Placing horizontal vanishing points off the horizon.
- Sending verticals to a vanishing point in ordinary two-point vertical setup.
- Mirroring an isometric orientation.
- Treating an exploded offset as actual assembled position.

### Family `axonometric_from_orthographic`

**Task.** Match plan/elevations to the correct axonometric.

**Response/template.** Single choice.

**Derivation.** Project model vertices with pinned parallel matrix.

**Difficulty.** L1 block mass; L2 openings; L3 void/overhang.

**Distractors/constraints.** Mirror, wrong height, swapped façade.

**Feedback.** Color-code shared axes/features.

**Examples.** (1) L-plan extrusion. (2) north window/east door. (3) double-height void.

**Validation.** Candidate model/projection equivalence.

### Family `axonometric_coordinate`

**Task.** Project/recover a bounded model grid coordinate in a supplied axonometric basis.

**Response/template.** Point selection or `(x,y,z)`.

**Derivation.** Apply/invert declared projection on constrained lattice with depth cues.

**Difficulty.** L1 one axis; L2 three axes; L3 overlapping projection disambiguated by edges.

**Distractors/constraints.** Inverse unique under model/grid constraints.

**Feedback.** Decompose along axes.

**Examples.** (1) move2 east,1 up. (2) locate `(2,3,1)`. (3) recover vertex from connected edges.

**Validation.** Exact matrix/lattice.

### Family `axonometric_missing_element`

**Task.** Add/select an opening/edge absent from an axonometric using orthographic views.

**Response/template.** Element/position choice.

**Derivation.** Project source element.

**Difficulty.** L2 visible face; L3 rear/occluded relation; L4 overhang.

**Distractors/constraints.** No hidden edge required unless profile displays it.

**Feedback.** Trace from plan/elevation coordinates.

**Examples.** (1) east door. (2) high north window. (3) roof opening.

**Validation.** Projection element set difference.

### Family `exploded_assembly_order`

**Task.** Match exploded components to assembled positions/order.

**Response/template.** Matching/ordered assembly.

**Derivation.** Remove display-only explosion vectors and restore transforms.

**Difficulty.** L1 stacked layers; L2 repeated components; L3 keyed orientation.

**Distractors/constraints.** No real construction sequence implied unless supplied.

**Feedback.** Show connector/reference axes.

**Examples.** (1) floor-wall-roof stack. (2) façade panels keyed by openings. (3) stair parts in fictional diagram.

**Validation.** Transform inversion.

### Family `perspective_vanishing_point`

**Task.** Identify vanishing point(s) for sets of parallel model lines.

**Response/template.** Point/line-set matching.

**Derivation.** Project direction at infinity through camera/picture plane.

**Difficulty.** L1 one-point; L2 two-point; L3 distinguish nonhorizontal/vertical.

**Distractors/constraints.** Only exact constructed perspectives.

**Feedback.** Extend projected lines to convergence.

**Examples.** (1) corridor depth lines→one VP. (2) two façade directions→two horizon VPs. (3) verticals remain parallel in standard setup.

**Validation.** Camera projection geometry.

### Family `perspective_horizon_eye`

**Task.** Infer horizon/eye level from perspective geometry or place features relative to it.

**Response/template.** Line/height selection.

**Derivation.** Horizon is image of horizontal direction plane through eye.

**Difficulty.** L1 marked VPs; L2 figures/objects; L3 cropped VPs.

**Distractors/constraints.** Horizon not necessarily page midpoint.

**Feedback.** Connect horizontal VPs.

**Examples.** (1) two VPs define horizon. (2) eye level crosses equal-height standing figures at same body level. (3) camera above room objects.

**Validation.** Camera parameters.

### Family `perspective_view_match`

**Task.** Match a plan camera/field of view to the corresponding perspective.

**Response/template.** Camera/view choice.

**Derivation.** Central-project model, test visible surfaces/order.

**Difficulty.** L1 corner viewpoint; L2 interior doorway sequence; L3 occlusion.

**Distractors/constraints.** Comparable crop/lighting; geometry only.

**Feedback.** Show view cone and first visible edges.

**Examples.** (1) camera in southwest looking NE. (2) corridor view through aligned doors. (3) column occludes window.

**Validation.** Visibility/projection oracle.

### Family `shadow_from_vector`

**Task.** Project a simple vertical element's shadow using a supplied parallel sun vector.

**Response/template.** Endpoint/polygon choice.

**Derivation.** Ray-plane intersection.

**Difficulty.** L2 vertical post/horizontal ground; L3 wall shadow; L4 multiple planes.

**Distractors/constraints.** Sun vector supplied; no date/location/daylight claims.

**Feedback.** Draw ray from top to receiving plane.

**Examples.** (1) 2 m post with vector giving equal run→2 m shadow. (2) direction opposite horizontal sun component. (3) canopy shadow on wall/ground.

**Validation.** Exact ray intersection.

### Family `projection_audit`

**Task.** Find an axonometric, exploded, perspective, visibility, or shadow inconsistency.

**Response/template.** Feature choice and correction.

**Derivation.** Reproject semantic model.

**Difficulty.** L1 parallel lines converge in axon; L2 VP off horizon; L3 perspective shows occluded opening.

**Distractors/constraints.** One root defect.

**Feedback.** Name violated projection invariant.

**Examples.** (1) mirrored façade. (2) two parallel edge sets share wrong VP. (3) exploded piece rotated accidentally.

**Validation.** Single projection mutation.

### Cross-family progression

Orthographic-to-axonometric matching precedes coordinates and missing elements.
Exploded views are taught as transformed diagrams. Perspective begins with
vanishing points/horizon, then camera matching. Shadows are optional advanced
projection; audit closes the category.

## 8. Category: Briefs, diagrams, drawing-set coordination, and audits

### Category purpose

Combine drawing literacy with explicit design constraints and document
coordination while keeping subjective architectural quality outside exact grading.

### Learn

A bubble diagram records relationships, not finished geometry. A plan can satisfy
area and adjacency constraints yet still require professional design judgment.
Across a drawing set, every callout, tag, dimension, and revision should refer to
the same model/version.

### Prerequisites

Categories 2–7 as relevant.

### Category boundaries

Constraint puzzles and document consistency are included. Real programming,
codes, aesthetics, and professional completeness are not.

### Common misconceptions

- Treating preferred adjacency as required.
- Treating bubble size as exact area without a legend.
- Assuming any constraint-satisfying layout is good architecture.
- Checking one drawing in isolation.
- Comparing revisions without scope/date markers.
- Calling annotation duplication a geometric conflict.

### Family `brief_constraint_extract`

**Task.** Extract required spaces and required/preferred/forbidden relationships from a fictional brief.

**Response/template.** Named fields/adjacency matrix.

**Derivation.** Parse controlled brief schema.

**Difficulty.** L1 direct list; L2 priorities; L3 conditional constraint.

**Distractors/constraints.** Natural-language templates map unambiguously.

**Feedback.** Link each matrix cell to brief clause.

**Examples.** (1) kitchen adjacent dining required. (2) studio prefers north. (3) service entry condition applies only after hours.

**Validation.** Round-trip controlled language/schema.

### Family `bubble_adjacency_read`

**Task.** Read required/preferred connections from a bubble diagram.

**Response/template.** Pair/set/matrix.

**Derivation.** Nodes/typed edges.

**Difficulty.** L1 direct edges; L2 edge types; L3 zones/cluster boundary.

**Distractors/constraints.** Bubble overlap/proximity has no meaning unless defined.

**Feedback.** Show typed graph.

**Examples.** (1) A-B solid required. (2) dashed preferred. (3) same cluster but no direct edge.

**Validation.** Graph lookup.

### Family `layout_constraint_check`

**Task.** Determine whether a generated plan satisfies explicit brief constraints.

**Response/template.** Pass/fail list with offending relation/dimension.

**Derivation.** Evaluate geometry/topology/orientation rules.

**Difficulty.** L2 one constraint; L3 interacting; L4 multiple valid layouts.

**Distractors/constraints.** No unlisted quality judgment.

**Feedback.** Check each constraint independently.

**Examples.** (1) required adjacency missing. (2) all minimum exercise areas pass. (3) forbidden public-private door exists.

**Validation.** Constraint solver.

### Family `layout_select_valid`

**Task.** Select all layouts satisfying a brief.

**Response/template.** Multiple choice.

**Derivation.** Run constraint checker on each plan.

**Difficulty.** L2 one valid; L3 several valid; L4 tradeoffs but exact required constraints.

**Distractors/constraints.** Multiple valid accepted; “best design” not asked.

**Feedback.** Constraint table by option.

**Examples.** (1) adjacency puzzle. (2) orientation+footprint. (3) two valid plans differ only preferred relation.

**Validation.** Exhaustive option checks.

### Family `plan_from_adjacency`

**Task.** Construct/select a small orthogonal zoning plan realizing a typed adjacency graph.

**Response/template.** Grid placement/choice.

**Derivation.** Region adjacency and constraint solve.

**Difficulty.** L2 3–4 rooms; L3 fixed entry; L4 forbidden adjacency/area cells.

**Distractors/constraints.** All valid placements accepted; bounded grid.

**Feedback.** Overlay achieved/missing graph edges.

**Examples.** (1) three-room chain. (2) central hall adjacent all. (3) keep noisy/quiet zones nonadjacent.

**Validation.** Region topology and constraints.

### Family `drawing_set_reference_check`

**Task.** Verify that callouts, target views, sheets, scales, and regions coordinate.

**Response/template.** Valid/invalid plus defect.

**Derivation.** Traverse reference graph.

**Difficulty.** L1 missing target; L2 wrong region/direction; L3 circular/stale reference.

**Distractors/constraints.** Cycles allowed only for benign backlinks under profile.

**Feedback.** Display reference path.

**Examples.** (1) 2/A301 exists. (2) detail targets wrong wall. (3) section marker references old sheet ID.

**Validation.** Referential integrity and geometry match.

### Family `schedule_tag_coordination`

**Task.** Match plan tags to a small fictional door/window/room schedule and find mismatches.

**Response/template.** Matching or conflict choice.

**Derivation.** ID/key lookup and property comparison.

**Difficulty.** L1 unique IDs; L2 repeated type; L3 one stale property.

**Distractors/constraints.** Schedules are exercise data, not specifications.

**Feedback.** Diff tag/type/dimension fields.

**Examples.** (1) D3→door type3. (2) W2 width differs plan. (3) room name updated only in schedule.

**Validation.** Table/model referential consistency.

### Family `revision_compare`

**Task.** Identify added, removed, moved, resized, or annotation-only changes between revisions.

**Response/template.** Change classification/element set.

**Derivation.** Compare stable element IDs and geometry/property hashes.

**Difficulty.** L1 one change; L2 several; L3 ID replacement versus move.

**Distractors/constraints.** Revision scope/date shown; line rendering differences ignored.

**Feedback.** Semantic before/after diff.

**Examples.** (1) door moved600 mm. (2) window removed. (3) room renamed, geometry unchanged.

**Validation.** Model diff.

### Family `coordination_root_cause`

**Task.** Find the source/root inconsistency behind several downstream drawing conflicts.

**Response/template.** Model/view/reference/revision layer plus correction.

**Derivation.** Trace data lineage from model to views/tags.

**Difficulty.** L3 wrong source property; L4 stale view; L5 two render symptoms.

**Distractors/constraints.** Exactly one seeded root.

**Feedback.** Show dependency tree.

**Examples.** (1) opening model width wrong affects plan/elevation/schedule. (2) section alone stale. (3) callout target wrong while geometry correct.

**Validation.** Mutation lineage.

### Family `integrated_drawing_audit`

**Task.** Audit a compact fictional drawing set for one scale, convention, projection, topology, vertical, brief, or revision error.

**Response/template.** Layer/element/reason/correction.

**Derivation.** Run full validation pipeline.

**Difficulty.** L3 visible mismatch; L4 arithmetic superficially works under wrong scale; L5 several consequences.

**Distractors/constraints.** One root defect and deterministic evidence.

**Feedback.** Identify authoritative model/profile rule and all affected views.

**Examples.** (1) detail uses parent scale. (2) door schedule conflicts with plan/elevation. (3) valid plan geometry violates explicit forbidden adjacency.

**Validation.** Seeded mutation caught by independent subsystem.

### Cross-family progression

Extract briefs and read bubble diagrams before layout checking/construction.
Reference and schedule coordination use already familiar tags. Revision comparison
precedes root-cause tracing. Integrated audits are the capstone and combine at
most three mastered domains.

## 9. Topic-level progression

### Level 1 — Read one explicit convention

- identify drawing type, line role, symbol, grid, level, and simple opening;
- convert one model/paper length at a stated scale;
- identify cut versus projected elements;
- read simple rectangular room boundaries and direct connections;
- compute one level difference;
- match a simple block to a plan/elevation.

### Level 2 — Transfer one relationship

- follow view references and section direction;
- solve dimension chains and scale bars;
- match openings across plan/elevation/section;
- distinguish adjacency, connectivity, and visibility;
- compute clear height, riser height, ramp run, or roof rise under supplied rules;
- read axonometric axes and perspective vanishing points;
- check one explicit brief constraint.

### Level 3 — Coordinate several views/constraints

- infer a view from model or another pair of views;
- test dimension sufficiency/redundancy;
- trace routes and spatial sequences;
- coordinate stairs/voids/openings across levels;
- recover axonometric coordinates or camera viewpoint;
- compare revisions and schedules;
- accept multiple valid layouts.

### Level 4 — Inverse construction and error diagnosis

- add a missing coordinated element;
- reconstruct a bounded plan/section or adjacency layout;
- resolve offset sections and occlusion;
- satisfy several explicit brief constraints;
- distinguish model error from stale view/reference/annotation;
- audit conflicting but visually plausible drawing sets.

### Level 5 — Integrated root-cause reasoning

- combine up to three mastered domains in a small drawing set;
- identify first/root defect and downstream consequences;
- explain why information is insufficient or convention-dependent;
- retain multiple valid geometric/layout answers;
- never substitute professional/code judgment for supplied exercise rules.

## 10. Adaptive practice guidance

Track mastery by:

```text
family
convention profile
representation/view type
unit/scale
geometry type
cut/view direction
topological relation
vertical relation
projection type
misconception
difficulty dimensions
```

Routing:

- Drawing types confused → view/cut demonstration, not harder symbols.
- Line weight errors → cut/projected contrast at larger rendering.
- Section direction reversed → marker-direction exercises.
- Scale reciprocal errors → forward/reverse paired factor chains.
- Screen measurement used → scale-bar/authoritative-dimension contrast.
- Dimension chain error → witness-point highlighting.
- Plan/elevation mirror errors → orientation and cardinal elevation matching.
- High/low element errors → plan-cut mini-section practice.
- Adjacency called connection → paired topology graphs.
- Route crosses wall → portal-level path tracing.
- Viewer/page/world direction confusion → orientation transforms.
- Level/clear-height confusion → vertical interval stacks.
- Stair count errors → explicit counting-model diagrams.
- Axonometric lines converge → parallel-versus-central projection contrast.
- Perspective VP off horizon → horizon construction.
- Brief errors → extract constraint before layout solving.
- Cross-sheet errors → reduce to reference/tag/model lineage.

Speed is not a mastery dimension. Correctness, explanation, and representation
transfer matter; timed drafting is excluded.

## 11. Answer checking and worked feedback

### Semantic checking

- Drawings compare model/view/element IDs and exact geometry.
- Span/line selection resolves to semantic primitives, not pixels.
- Length/area/slope use exact rational or bounded numeric calculation.
- View answers compare projection sets and visibility classes.
- Topology answers compare graph relations.
- Layouts are validated against constraints; all valid layouts are accepted.
- References/tags/schedules use referential integrity and model-property checks.
- Audit answers identify root layer plus evidence.

### Construction answers

Interactive construction uses snapping to semantic grids, wall faces/centerlines,
levels, and openings. Motor precision is not graded. A learner may also choose a
discrete option or enter coordinates/dimensions.

Equivalent constructions are accepted when they generate the same required
topology/geometry. Decorative drawing differences are ignored.

### Worked feedback

Feedback order:

1. Restate active convention/view/scale.
2. Identify authoritative model facts.
3. Show cut/projection/topology/dimension operation.
4. Diagnose a known misconception when matched.
5. Display corrected drawing/graph/equation.
6. Repeat the fictional/non-construction boundary only where professional
   interpretation could be inferred.

Examples:

> These rooms share a wall, so they are adjacent. There is no door or opening,
> so they are not directly connected.

> At 1:100, 42 mm on the plotted sheet represents 4200 mm. Browser zoom is not
> part of that relationship.

> The section arrow looks east. The window is behind the cut plane and should be
> projected lightly, not drawn as a cut opening.

## 12. Rendering, interaction, accessibility, and localization

### Rendering

- Generate semantic SVG; Canvas may supplement but not be the sole accessible
  representation.
- Keep cut/projected/overhead/dimension roles distinguishable at 100–400% zoom.
- Use non-scaling profile logic carefully: apparent line hierarchy must remain
  valid at intended view/print size.
- Avoid label collisions with geometry, dimensions, and one another.
- Hatch clipping stays inside cut regions.
- Poché/cut regions remain distinguishable in monochrome.
- View direction, north, scale, and units remain visible when relevant.
- A “not to scale on screen” notice appears beside measurement-disabled views.

### Interaction

- Selection targets have generous hit areas but resolve to exact elements.
- Reordering and placement work without dragging.
- Keyboard focus follows sheet→view→element→annotation order.
- Pan/zoom never changes answer semantics.
- Reset view, fit view, toggle layers, and reveal legend are available.
- Answer submission never depends on double-click or hover.

### Accessibility

- Every drawing has an accessible fact list/tree sufficient for the task.
- Spatial diagrams have structured alternatives: element tables, adjacency
  lists, level stacks, view-element lists, and coordinate descriptions.
- Color is never the only line/zone/revision cue.
- Dash patterns are supplemented by role labels where needed.
- Text meets contrast/reflow requirements; symbols have names.
- Reduced-motion mode replaces animated projection/route replay with steps.
- Construction tasks have discrete/coordinate alternatives.
- Results from visual versus structured-text profiles are tracked separately
  where the cognitive operation differs.

### Localization

UI locale, convention profile, and unit profile are independent. Translation
does not convert ISO-informed conventions into a local professional standard.
Abbreviations, decimal separators, sheet codes, scale notation, direction terms,
and door/stair descriptions receive profile review. Imperial input requires a
separate exact feet/inches parser and dimension-display contract.

## 13. Generator and implementation architecture

Recommended modules:

```text
seededRng
exactGeometry
buildingModelGenerator
topologyBuilder
constraintSolver
orthographicProjector
sectionCutter
visibilityOracle
axonometricProjector
perspectiveProjector
rayPlaneOracle
dimensionEngine
scaleEngine
symbolLibrary
drawingSetBuilder
referenceGraph
revisionDiffer
svgRenderer
accessibleDescriptionBuilder
semanticAnswerChecker
profileRegistry
```

### Generation pipeline

1. Select family, target relationship, and misconception.
2. Construct an exact model backward from a friendly answer.
3. Validate geometry, topology, levels, and constraints.
4. Generate views/references/dimensions from the model.
5. Independently recompute target answer.
6. Build distractors by controlled semantic mutations.
7. Render and reject collisions/indistinguishable styles/occlusion degeneracy.
8. Produce accessible fact representation from the same model.

The model is the single geometry source. Do not separately draw a plan and
elevation and hope they coordinate.

### Exactness

Use integer millimetres and rational slopes/scales where possible. Projection
matrices may use exact rationals/radicals for standard axonometrics or
deterministic high-precision arithmetic with tolerances far below display
resolution. Topological predicates use robust exact/orientation tests, not
floating epsilon guesses.

### Standalone architecture

HTML/JS/CSS only; no backend, CAD/BIM service, map, code database, or standard
lookup at runtime. All profiles, symbols, models, and validators are bundled and
versioned. Local progress stores exercise metadata, never real project data.

## 14. Automated validation requirements

### Geometry/model tests

- Space polygons simple and nonoverlapping under profile.
- Wall solids valid; openings remain inside host bounds.
- Space boundaries close; topology matches geometry.
- Slabs/voids/roofs/stairs connect declared levels.
- Routes cross boundaries only at permitted portals.
- Visibility rays stop at first opaque intersection.

### Projection tests

- Plan/section cut classifications equal exact intersections.
- Elevation occlusion and opening order agree with depth.
- Shared world coordinates transfer across views.
- Every cardinal/offset view matches ViewDefinition.
- Axonometric parallelism and perspective convergence invariants pass.
- Camera/frustum and shadow intersections are deterministic.

### Scale/dimension tests

- Forward/reverse scale round trips.
- Unit conversions exact.
- Scale bars retain ratio under uniform resize.
- Dimension text equals model interval unless mutation intended.
- Constraint rank detects missing/redundant/conflicting chains.
- Sheet-fit bounding boxes include margins/annotation allowance.
- Area oracle agrees by shoelace and decomposition.

### Document tests

- Symbols match active profile and accessible labels.
- Every callout target exists and matches region/direction.
- Tags/schedules resolve exactly once.
- Revisions preserve stable IDs or declare replacements.
- Drawing-set views share model and compatible revision.
- One-root audit fixtures have deterministic first cause.

### Rendering/accessibility tests

- No critical label/arrow/dimension collision at supported viewport/print sizes.
- Line roles remain distinguishable in monochrome/high contrast.
- Hatches are clipped; dash patterns do not disappear.
- Zoom/pan does not affect checking.
- Keyboard/structured alternatives reach every answer.
- Accessible fact lists contain all necessary but no answer-leaking extra facts
  beyond the visual view's semantics.

### Seeds and mutations

For at least `10,000` deterministic seeds per family/level:

- all placeholders and references resolve;
- accepted answers nonempty and distractors distinct;
- geometry/topology/projective invariants pass;
- semantic and independent oracles agree;
- difficulty/rejection rules hold;
- recent structural repetition is controlled.

Mutation tests catch:

- reciprocal scale;
- mm/m unit error;
- wrong dimension witness;
- cut/projected role swap;
- opposite view direction;
- mirrored elevation;
- opening moved in one view only;
- adjacency/connection/visibility conflation;
- route through wall;
- level/slab subtraction error;
- riser/tread counting mismatch;
- rise/run inversion;
- axonometric convergence;
- perspective VP off horizon;
- stale callout/schedule/revision;
- brief preference promoted to requirement;
- real-code/compliance wording introduced.

## 15. Coverage requirements

Across a long course:

- every drawing/view type and line role appears;
- symbols/profile variants are balanced without mixing profiles;
- scales include common reduction ratios and inverse questions;
- metric units and dimension witness types vary;
- cut planes/directions/heights and cardinal elevations balance;
- openings occur at low, cut, high, and occluded positions;
- plan topology covers adjacency, connection, route, visibility, and orientation;
- levels, stairs, ramps, voids, roofs, and vertical openings recur;
- axonometric/perspective camera orientations vary;
- brief constraints include required/preferred/forbidden relationships;
- references, schedules, revisions, and root-cause audits all occur;
- simple rectangular examples do not dominate after mastery;
- every declared misconception appears intentionally.

Structural signatures, not renamed rooms or recolored lines, define repetition.

## 16. Recommended views and v1 priorities

### Views

1. **Learn** — convention/diagram demonstrations.
2. **Drawing Reader** — plans, elevations, sections, and references.
3. **Scale & Dimensions** — numeric/dimension practice.
4. **Space Explorer** — topology, routes, visibility, and levels.
5. **Projection Studio** — orthographic, axonometric, and perspective.
6. **Brief & Coordination** — constraint and drawing-set puzzles.
7. **Review/Audit** — model/view overlays and root-cause feedback.

### Recommended v1

Prioritize:

- metric ISO-informed teaching profile;
- line roles, symbols, grids/levels, doors/windows, and references;
- 1:20/50/100/200 scale and dimension chains;
- orthogonal one-/two-storey fictional models;
- plans/elevations/straight sections and cut visibility;
- adjacency/connectivity/routes/orientation;
- levels, simple stairs/ramps/voids/mono-pitch roofs;
- isometric matching and basic one-/two-point perspective;
- brief extraction, adjacency layouts, reference/schedule/revision audits;
- SVG plus structured accessible alternatives from the start.

Defer:

- imperial/U.S. profile until independently reviewed;
- curved/organic geometry and complex roofs/stairs;
- detailed materials, assemblies, MEP, structural, site, landscape, interiors, or
  construction sequencing;
- real CAD/BIM import/export;
- code/compliance tasks;
- photorealistic or aesthetic evaluation;
- real project uploads.

## 17. Topic-level quality checklist

- [ ] Every screen/export says fictional training drawing, not for construction.
- [ ] Convention, unit, projection, and symbol profiles are visible/versioned.
- [ ] ISO/NCS names are review anchors, not copied content or certification claims.
- [ ] No building-code, safety, structural, accessibility, or permit conclusion appears.
- [ ] All geometry/views derive from one semantic model.
- [ ] Dimensions, not screen pixels, are authoritative.
- [ ] Screen measurement is disabled unless explicitly calibrated/approximate.
- [ ] Cut, projected, overhead/hidden, grid, and annotation roles stay distinct.
- [ ] Plan, RCP, elevation, section, detail, axonometric, and perspective are not conflated.
- [ ] Cut height, plane, view direction, depth, north, scale, and units are explicit.
- [ ] Adjacency, connectivity, visibility, and route relations remain separate.
- [ ] Stair/ramp/roof rules are supplied fictional constraints, not regulations.
- [ ] Axonometric uses parallel and perspective uses central projection.
- [ ] Multiple valid layouts are all accepted.
- [ ] Brief preferences do not become universal design judgments.
- [ ] References, schedules, and revisions have referential integrity.
- [ ] Every audit fixture has one root defect.
- [ ] SVG and accessible facts share the same semantic source.
- [ ] Color/pixels/motor precision never determine correctness.
- [ ] Every family has task, response template, derivation, difficulty,
  misconception-based distractors, feedback, three examples, and validation.
- [ ] Geometry, projection, scale, topology, document, rendering, and mutation tests pass.
- [ ] The standalone app needs no backend, CAD/BIM service, or runtime standard lookup.

## 18. Stable identifiers and navigation

Recommended navigation:

```text
Conventions & Symbols
Scale & Dimensions
Plans / Elevations / Sections
Space & Circulation
Levels & Vertical Space
Axonometric & Perspective
Briefs & Coordination
```

Stable family identifiers are the backticked IDs above. Changing a visible
symbol, standard mapping, scale/unit convention, projection policy, or geometry
oracle requires a new profile/version so old questions remain reproducible.
