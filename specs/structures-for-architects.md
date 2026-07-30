# Structures for Architects — Dynamic Practice Specification

Status: implementation specification; fictional educational structures only,
**not for structural design, assessment, approval, fabrication, or construction**

Audience: structural-building-model generator, statics/section/network oracle,
architectural diagram renderer, semantic answer checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual requirements meanings.

## 1. Topic overview

### Topic name

Structures for Architects

### Topic goal

Develop architectural structural literacy: the ability to see how a building
stands, translate plans/sections into idealized structural models, follow loads
to the ground, recognize the consequences of spatial decisions, and communicate
coherently with structural engineers. The learner should become able to:

- distinguish loads/actions, reactions, internal forces, stresses, stiffness,
  deformation, strength, stability, and robustness;
- trace gravity and lateral load paths through surfaces, members, connections,
  diaphragms, vertical systems, and foundations;
- draw/select free-body diagrams and apply force and moment equilibrium;
- convert area loads to tributary line, point, beam, column, and foundation
  actions without losing units;
- find reactions for bounded determinate beams/cantilevers and locate distributed
  load resultants;
- read and construct axial-force, shear-force, and bending-moment diagrams;
- reason about simple pin-jointed trusses, zero-force members, and force sense;
- calculate centroids, second moments of area, section moduli, idealized axial
  and bending stress, elastic deflection, and Euler buckling under supplied
  models;
- understand how span, depth, continuity, material stiffness, support condition,
  and load distribution change structural response;
- read structural grids, framing plans, sections, transfer conditions, openings,
  cantilevers, and column/wall continuity;
- distinguish one-way/two-way spanning, beam/slab, truss, arch, cable, shell,
  frame, wall, and braced systems by structural action;
- trace wind/seismic-like fictional lateral actions through cladding/frames,
  diaphragms, collectors, vertical resisting elements, and foundations;
- recognize overturning, storey shear, drift, torsion, soft/weak discontinuities,
  and triangulation in simplified models;
- compare fictional structural schemes against explicitly supplied architectural
  and performance criteria without recommending a real solution;
- identify missing information, conflicting models, stale revisions, broken load
  paths, and downstream consequences.

The app emphasizes diagrams and decisions at an architect’s interface with
structure. It is not a substitute for structural engineering education,
calculation software, codes, or professional services.

### Audience and prerequisites

The primary audience is architecture students and architects refreshing
structural intuition. It is also suitable for technically curious learners.

Prerequisites:

- algebra, fractions, ratios, trigonometry, vectors, and unit conversion;
- area, centroid, and simple coordinate geometry;
- basic force, moment, stress, and energy concepts from Physics;
- reading plans, elevations, sections, grids, and levels.

Calculus is not required. Slope/area relationships between load, shear, and
moment may be learned graphically or with piecewise constant/linear functions.

### Relationship to sibling topics

- **Physics** owns general mechanics foundations.
- **Architectural Drawing & Spatial Reasoning** owns drawing conventions and
  coordinated projection.
- **Architectural Geometry & Building Quantities** owns exact areas, volumes,
  lengths, and takeoffs.
- **Building Science** owns heat, air, moisture, solar, and energy performance.

This app recombines mechanics and architectural geometry around structural
building systems, load paths, idealization, and coordination.

### Standards and code boundary

Structural rules vary by jurisdiction, material, occupancy, consequence class,
site hazard, construction stage, and adopted code edition. Every exercise uses
a versioned fictional teaching profile; no action, factor, resistance, limit, or
detail is assumed from local practice.

Qualified review should use the current scopes of:

- [ISO 2394:2015](https://www.iso.org/standard/58036.html), general
  risk- and reliability-informed principles for structural decisions;
- [ISO 13822:2010](https://www.iso.org/standard/46556.html), principles for
  assessment of existing structures;
- [ISO 3010:2017](https://www.iso.org/standard/63217.html), seismic actions on
  structures as a source document rather than a legally binding code;
- [ISO 4354:2009](https://www.iso.org/standard/38882.html), wind actions, while
  noting that a replacement is under development;
- [ISO 4355:2013](https://www.iso.org/standard/56059.html), snow loads on roofs,
  likewise currently under revision;
- the European Commission JRC’s
  [Eurocodes overview](https://eurocodes.jrc.ec.europa.eu/en-eurocodes/about-en-eurocodes)
  and [second-generation transition](https://eurocodes.jrc.ec.europa.eu/second-generation-eurocodes).

These are review anchors, not copied procedures or compliance targets. The
second-generation Eurocodes are in a multi-year publication and national
transition process, which is another reason not to hard-code an unlabeled
“Eurocode answer.”

Initial teaching profiles:

```text
pl-structural-statics-si-v1
pl-structural-beam-sign-v1
pl-structural-truss-pin-v1
pl-structural-linear-elastic-v1
pl-structural-gravity-path-v1
pl-structural-lateral-concept-v1
pl-structural-foundation-simple-v1
pl-structural-scheme-criteria-v1
```

Profiles are **standards-informed fictional subsets**, not implementations of
ISO, EN, national annexes, ASCE, IBC, or any material design standard. Changing
a sign, action convention, factor, limit, resistance model, or idealization
creates a new profile ID.

### Professional and safety boundary

Every exercise and export states:

```text
FICTIONAL STRUCTURAL EXERCISE — NOT FOR DESIGN, ASSESSMENT, PERMIT,
FABRICATION, DEMOLITION, TEMPORARY WORKS, OR CONSTRUCTION
```

The app must not:

- accept real plans, models, photographs, damage reports, member schedules, soil
  reports, or monitoring data in v1;
- determine whether a real building/member/connection/foundation is safe,
  adequate, stable, compliant, repairable, or fit for change of use;
- calculate or recommend real member sizes, reinforcement, connections,
  foundations, bracing, load combinations, fire resistance, or temporary works;
- provide site-specific wind, snow, seismic, soil, occupancy, accidental, or
  construction loads;
- diagnose cracking, settlement, corrosion, rot, vibration, movement, or
  structural damage;
- recommend a structural system, material, grid, alteration, demolition
  sequence, or retrofit for an actual project;
- describe a correct exercise answer as safe or a wrong answer as dangerous;
- imply that simplified strength, buckling, drift, or deflection checks establish
  reliability.

Real structural decisions require the applicable codes, site/action/material
data, appropriate analysis, construction-stage consideration, and qualified
structural professionals.

### Normative structural-building model

```text
StructuralBuildingModel {
  projectId
  revisionId
  geometryRevisionId
  grids[]
  levels[]
  bays[]
  surfaces[]
  nodes[]
  members[]
  supports[]
  connections[]
  diaphragms[]
  collectors[]
  verticalSystems[]
  foundations[]
  materials[]
  sections[]
  loadCases[]
  suppliedCombinations[]
  architecturalConstraints[]
  resultSets[]
  sourceViews[]
}
```

All diagrams derive from this model. Stable IDs persist across plan, section,
axonometric, free-body, analysis diagram, schedule, and revision.

### Structural idealization model

Each exercise declares:

```text
AnalysisScope {
  dimensions: 2D | 3D
  modelType: particle | rigidBody | beam | truss | frame |
             diaphragm | shearBuilding | spring | section
  geometry: smallDisplacement | statedGeometry
  material: rigid | linearElastic | suppliedNonlinear
  connections: pinned | fixed | roller | spring | released
  loadPathAssumptions[]
  selfWeightIncluded
  secondOrderEffectsIncluded
  dynamicEffectsIncluded
  supportSettlementIncluded
}
```

V1 numeric solvers emphasize statically determinate 2D beams, cantilevers,
pin-jointed trusses, simple axial members, ideal sections, springs, and
single-storey/shear-building abstractions. Indeterminate frames and complex
systems may appear qualitatively or with a complete prevalidated result set;
the implementation must not improvise approximate distribution rules.

### Coordinates, signs, symbols, and units

Default axes:

```text
x = right/east on canonical plan
y = up/north on canonical plan
z = vertical/up
```

Each 2D analysis diagram displays its local axes. Global plan rotation never
changes structural meaning.

Default beam profile:

```text
upward external force positive
counterclockwise external moment positive
positive axial force = tension
positive shear and sagging/hogging moment follow the displayed face convention
```

Because shear/moment conventions vary, the sign glyph and positive-face sketch
must remain visible. A family may ask about magnitude/shape without sign only
when explicitly stated.

Default SI units include `N`, `kN`, `N/m`, `kN/m`, `Pa`, `MPa`, `mm`, `m`,
`mm²`, `m²`, `mm⁴`, `m⁴`, `N·mm`, `kN·m`, `N/mm`, `kN/m`, and dimensionless
ratios. The unit engine distinguishes force, force per length, force per area,
moment, stress, stiffness, and section properties.

### Actions, combinations, and limit concepts

Actions are generated as fictional:

```text
permanent
variable
environmental-lateral
environmental-vertical
accidental-placeholder
settlement/ imposed-deformation
```

No real action value or factor is memorized. Where a combination is needed, the
prompt supplies the exact expression, factors, exclusivity rules, and whether
the result is an ultimate-like or serviceability-like exercise check.

The course may distinguish:

- **strength/stability-type check**: supplied effect versus supplied resistance;
- **serviceability-type check**: supplied deformation/vibration/crack proxy
  versus supplied fictional limit;
- **robustness concept**: continuity, ties, alternate paths, and
  disproportionate-consequence reasoning at a conceptual level.

Passing a fictional check never means a real structure is adequate.

### Material and section data

Properties are supplied by the problem or a bundled fictional dataset:

```text
StructuralProperty {
  name
  value
  unit
  direction?
  condition?
  sourceProfileId
  uncertainty?
}
```

The app does not require memorizing real steel, concrete, timber, masonry, soil,
glass, or composite properties. Material behavior appears through explicit
models such as `E`, density, yield/allowable proxy, tension/compression
availability, or creep factor. Reinforced-concrete, timber, masonry, and
connection design equations are excluded from v1.

### Scope

Included:

- structural vocabulary, idealization, actions, supports, constraints, and free
  bodies;
- gravity/lateral load paths and force/moment equilibrium;
- tributary widths/areas, surface-to-line-to-point conversion, and load takedown;
- determinate reactions, axial/shear/moment actions and diagrams;
- simple pin-jointed trusses;
- centroid, second moment of area, section modulus, ideal axial/bending stress;
- axial/flexural stiffness, bounded elastic deflection, Euler buckling model;
- framing directions, grids, bays, continuity, transfers, openings, cantilevers,
  and structural-system recognition;
- diaphragms, collectors, braced/moment/wall systems, storey shear, overturning,
  drift, simplified torsion, stability, and robustness concepts;
- simplified uniform foundation bearing pressure/eccentricity and settlement
  diagrams using supplied soil springs/limits;
- fictional scheme comparison, architectural constraint extraction, revisions,
  coordination, uncertainty, and root-cause audits.

### Exclusions

Excluded:

- actual code-based action determination or load combinations;
- real member, slab, connection, reinforcement, foundation, or temporary-works
  design;
- nonlinear, plastic, fracture, fatigue, fire, impact, blast, progressive
  collapse, soil-structure interaction, staged construction, prestress, plate,
  shell, cable-net, membrane, or detailed vibration analysis;
- reinforced concrete, steel, timber, masonry, aluminium, glass, or composite
  design checks;
- finite-element modeling beyond internal independent validation fixtures;
- geotechnical bearing capacity, settlement prediction, retaining structures,
  slopes, piles, groundwater, or excavation support;
- seismic/wind/snow hazard generation and regulatory drift/deflection limits;
- arbitrary uploaded CAD/BIM/analysis files or real damage imagery.

### Global answer conventions

- Ignore surrounding whitespace.
- Accept locale-aware decimals without ambiguous separators.
- A prompt-fixed unit permits a bare number; otherwise require/select a unit.
- Normalize compatible units exactly before comparison.
- Reject a correct numeral with the wrong physical dimension.
- Vector answers use named components or magnitude/direction fields.
- Signed internal-force answers follow the displayed profile.
- Diagram answers compare semantic breakpoints, values, slopes, curvature class,
  and sign—not pixels.
- Multiple valid free-body/force-polygon representations are accepted when
  statically equivalent and complete.
- Apply rounding only at the stated final stage.
- `Cannot determine` requires the matching missing restraint, stiffness, action,
  connection, geometry, property, or criterion.

### Difficulty philosophy

Difficulty increases through:

- moving from visible arrows to inferred load paths;
- changing distributed surfaces into line/point actions;
- adding eccentricity, multiple supports, or several load types;
- constructing rather than reading internal-force diagrams;
- moving between plan, section, axonometric, free body, and analysis model;
- distinguishing strength, stiffness, stability, and serviceability;
- coordinating gravity and lateral systems with architectural constraints;
- tracing revisions and downstream effects;
- recognizing indeterminacy, instability, or insufficient information.

Difficulty must not increase through tiny diagrams, hidden sign conventions,
code-factor memorization, obscure material facts, huge arithmetic, arbitrary
precision, time pressure, or real-world safety implications.

### Shared generation and rejection rules

Every instance must:

- declare idealization, supports/releases, axes/signs, active actions,
  combinations, properties, units, and requested limit/criterion;
- derive all drawings/results from one semantic model;
- retain a dimension-typed expression tree and source/load-path lineage;
- have a primary and independent equilibrium/geometry/solver oracle;
- use friendly exact geometry early and meaningful structural complexity later;
- generate distractors from named misconceptions;
- state the fictional/non-design boundary where a choice resembles practice.

Reject an instance when:

- the model is unstable or indeterminate unless that is the explicit task;
- a support, connection, load extent, tributary boundary, or sign is ambiguous;
- two visually distinct diagrams are statically equivalent but only one is
  accepted;
- a zero-force/member-force case depends on an unstated joint condition;
- result choices coincide after unit conversion/rounding;
- a threshold lies within supplied uncertainty unless ambiguity is the task;
- an architectural option lacks a complete, explicit criterion set;
- arithmetic overwhelms load-path or structural reasoning;
- a conclusion could be read as real adequacy, safety, or recommendation;
- a recent structural signature is repeated with only renamed bays/materials.

## 2. Category: Structural language, idealization, load paths, and equilibrium

### Category purpose

Teach learners to turn building diagrams into explicit structural models and
verify that forces and moments can reach equilibrium.

### Learn

Loads require a continuous path through supported elements to reactions and the
ground. A free-body diagram isolates one body and shows every external action
and reaction. Equilibrium requires `sum Fx=0`, `sum Fy=0`, and `sum M=0` in 2D.
A couple is a moment, not a force that can be moved without consequence.

### Prerequisites

Vectors, basic trigonometry, force, moment, architectural plans/sections.

### Category boundaries

This category models actions and equilibrium. Tributary conversion/reactions are
Category 3; internal member diagrams are Category 4.

### Common misconceptions

- Treating an architectural line as structural without a support/load role.
- Stopping a load path at a beam/column instead of a reaction/foundation.
- Drawing internal forces on an uncut whole-body free body.
- Giving a pin a reaction moment or a roller two reactions.
- Resolving a vector from the wrong reference axis.
- Summing moments without lever arms or using distance along the force line.
- Believing force equilibrium alone guarantees moment equilibrium.

### Family `structural_element_role_identify`

**Task/purpose.** Identify surface, beam, column, wall, tie, strut, brace,
diaphragm, collector, connection, support, or foundation by structural role.

**Response/template.** Matching: `What structural role does highlighted Element {id} play in this model?`

**Derivation.** Query semantic element role and current load-case participation.

**Difficulty.** L1 beam/column; L2 wall/diaphragm/collector; L3 one element has
different roles in gravity/lateral cases.

**Distractors/constraints.** Visually similar building elements with different
declared action, not material stereotypes.

**Feedback.** Highlight forces entering/leaving the element.

**Examples.** (1) horizontal line supporting slab→beam (L1). (2) floor plane
distributing lateral action→diaphragm (L2). (3) wall gravity-bearing and lateral
resisting in different cases (L3).

**Validation.** role is load-case scoped and matches connectivity.

### Family `support_restraint_identify`

**Task/purpose.** Determine restrained/free translations/rotation and reaction
components for a pin, roller, fixed, link, or spring support.

**Response/template.** Multiple choice/fields for `Rx,Ry,M`.

**Derivation.** Map support constraint DOFs to reaction DOFs under the profile.

**Difficulty.** L1 pin/roller; L2 inclined roller/link; L3 releases at member
ends versus ground supports.

**Distractors/constraints.** fixed reaction on pin, roller along rather than
normal to surface, internal release treated as support.

**Feedback.** Show allowed motion and opposing reactions.

**Examples.** (1) 2D pin→Rx,Ry (L1). (2) roller on slope→normal reaction (L2).
(3) beam end moment release carries forces but no moment (L3).

**Validation.** constraint/reaction matrix rank and accessible DOF list.

### Family `gravity_load_path_order`

**Task/purpose.** Order the structural elements carrying a selected gravity load
from application surface to ground.

**Response/template.** Ordered stable IDs.

**Derivation.** Traverse directed load-transfer graph for the named load patch.

**Difficulty.** L1 slab→beam→column→footing; L2 secondary/primary framing; L3
transfer member and alternate valid paths.

**Distractors/constraints.** adjacency without transfer, skip connection/support,
reverse order; all valid parallel paths accepted.

**Feedback.** Animate/number arrows along the graph.

**Examples.** (1) roof deck→beam→column→footing (L1). (2) slab→joist→girder→
column→foundation (L2). (3) column terminates on transfer truss (L3).

**Validation.** path begins at load and ends at ground reaction; every edge valid.

### Family `free_body_diagram_select`

**Task/purpose.** Choose or construct a complete free-body diagram for a
highlighted building component.

**Response/template.** Diagram choice or semantic force placement.

**Derivation.** Cut all model connections crossing the body boundary and replace
them with their reaction/action resultants.

**Difficulty.** L1 one beam; L2 frame/joint cut; L3 choose useful subsystem.

**Distractors/constraints.** omitted action-reaction, internal forces retained
without cut, extra reaction at free DOF.

**Feedback.** Show body boundary and each crossed connection.

**Examples.** (1) simply supported beam with two reactions/load (L1). (2)
cantilever includes fixed moment (L2). (3) isolate half-truss with cut member
forces (L3).

**Validation.** force provenance completeness and constraint compatibility.

### Family `force_components_resultant`

**Task/purpose.** Resolve a structural force into axes or combine components into
a resultant.

**Response/template.** Named components or magnitude/angle.

**Derivation.** Apply displayed angle convention and exact trigonometry/vector
sum.

**Difficulty.** L1 friendly triangle; L2 angle from vertical/member axis; L3
several concurrent forces and signed resultant.

**Distractors/constraints.** sine/cosine swap, wrong quadrant, unsigned
components.

**Feedback.** Draw component triangle aligned to axes.

**Examples.** (1) 5 kN at 3-4-5→4/3 kN components (L1). (2) angle measured
from vertical (L2). (3) three forces resultant (L3).

**Validation.** reconstruct original vector and direction.

### Family `force_equilibrium_missing`

**Task/purpose.** Solve a missing concurrent force/reaction from `sum F=0`.

**Response/template.** Vector components or magnitude/direction.

**Derivation.** Sum known components, negate resultant for the balancing force.

**Difficulty.** L1 collinear; L2 2D components; L3 link reaction with constrained
direction and one unknown magnitude.

**Distractors/constraints.** same rather than opposite resultant, magnitudes only,
invalid reaction direction.

**Feedback.** Close the force polygon.

**Examples.** (1) 8 kN down→8 kN up (L1). (2) balance `(3,−4)` kN (L2).
(3) solve inclined link force plus roller reaction (L3).

**Validation.** vector residual exactly/within tolerance zero.

### Family `moment_about_point`

**Task/purpose.** Calculate signed moment of forces/couples about a named point.

**Response/template.** `kN·m` with sign/direction.

**Derivation.** Use 2D cross product `Mz=rx Fy−ry Fx` and add free couples.

**Difficulty.** L1 perpendicular force; L2 oblique force; L3 several forces and
couple.

**Distractors/constraints.** use distance to point not force line, omit force
component, treat couple as force×location.

**Feedback.** Show perpendicular lever arm and rotation sense.

**Examples.** (1) 5 kN×2 m=10 kN·m clockwise (L1). (2) oblique vector cross
product (L2). (3) sum three force moments and couple (L3).

**Validation.** cross-product and perpendicular-distance oracles agree.

### Family `resultant_location`

**Task/purpose.** Replace parallel forces with one resultant and locate its line
of action.

**Response/template.** magnitude, direction, and coordinate.

**Derivation.** `R=sum Fi`; locate `x_R=sum(Fi xi)/R` under declared sign,
including a supplied couple as moment contribution.

**Difficulty.** L1 same-direction forces; L2 mixed parallel signs; L3 add couple
or determine when pure couple/no finite resultant occurs.

**Distractors/constraints.** average locations unweighted, sum moments without
divide, accept location when resultant zero.

**Feedback.** Match total force and moment.

**Examples.** (1) equal loads at 2/6 m→4 m (L1). (2) unequal loads weighted
(L2). (3) zero resultant with nonzero couple→pure moment (L3).

**Validation.** resultant preserves force and moment invariants.

### Family `idealization_equilibrium_audit`

**Task/purpose.** Diagnose one role, support, path, free-body, vector, or moment
error.

**Response/template.** Root error, evidence, and correction.

**Derivation.** Compare semantic graph, constraint matrix, free-body provenance,
and equilibrium residual.

**Difficulty.** L1 missing force; L2 wrong reaction/lever arm; L3 load path
visually continuous but structurally disconnected.

**Distractors/constraints.** Exactly one root mutation; downstream imbalance may
be visible.

**Feedback.** Trace body/DOF/load-path to residual.

**Examples.** (1) roller given moment reaction (L1). (2) moment arm measured
along force (L2). (3) beam drawn over column but no modeled bearing/connection
(L3).

**Validation.** fault manifest and rank/equilibrium checks.

### Cross-family progression

Element roles and restraints precede load paths. Free bodies then define what
may enter equilibrium. Vector components, force balance, moments, and resultant
location build in that order. Audits interleave only after direct mastery.

## 3. Category: Tributary loading, reactions, and vertical load takedown

### Category purpose

Translate building areas and load patches into member actions and reactions,
then follow them through storeys without losing geometry, units, or identity.

### Learn

A surface action becomes a beam line action through tributary width; a beam
reaction becomes a point action on its support. Replace a distributed action by
an equal resultant at its centroid for whole-body equilibrium. Keep self-weight,
imposed, roof, façade, and other fictional actions in separate cases until the
supplied combination says otherwise.

### Prerequisites

Category 2; areas, centroids, architectural framing plans.

### Category boundaries

This category determines external member actions/reactions. Internal diagrams
are Category 4. No real code action values or combinations are generated.

### Common misconceptions

- Multiplying area action by span rather than tributary width.
- Confusing `kN/m²`, `kN/m`, and `kN`.
- Giving edge/interior beams identical tributary widths automatically.
- Placing a triangular load resultant at midspan.
- Assuming all beam reactions are half the total under asymmetric loads.
- Omitting self-weight despite `included=false`, or adding it twice.
- Resetting column accumulation at each storey.

### Family `load_dimension_convert`

**Task/purpose.** Convert supplied surface, line, and point actions through named
tributary geometry.

**Response/template.** Typed `kN/m²`, `kN/m`, or `kN`.

**Derivation.** Multiply area action by width to line action, then by loaded
length/shape integral to resultant.

**Difficulty.** L1 uniform strip; L2 partial patch; L3 reverse missing width/load.

**Distractors/constraints.** wrong geometric dimension, unit power retained,
multiply area twice.

**Feedback.** Show unit cancellation and highlighted source patch.

**Examples.** (1) `3 kN/m²×4 m=12 kN/m` (L1). (2) `12 kN/m×5 m=60 kN`
(L2). (3) recover tributary width from q/w (L3).

**Validation.** geometry measure and dimension engine.

### Family `tributary_width_beam`

**Task/purpose.** Determine the tributary strip assigned to an edge/interior
beam under an explicitly stated one-way rule.

**Response/template.** Width and selected plan region.

**Derivation.** Bound strip by midlines to adjacent parallel supports or supplied
free edge.

**Difficulty.** L1 equal bays; L2 unequal spacing/edge beam; L3 opening or
support termination partitions strip.

**Distractors/constraints.** full bay both sides, nearest grid spacing only,
two-way behavior unless profile says one-way.

**Feedback.** Shade half-bays and sum widths.

**Examples.** (1) 6 m bays both sides→6 m tributary width (L1). (2) edge beam
half of 5 m→2.5 m (L2). (3) unequal 4/8 m sides→6 m (L3).

**Validation.** tributary strips partition loaded one-way surface.

### Family `tributary_area_column`

**Task/purpose.** Determine a column/wall support’s plan tributary area from a
stated beam/grid distribution.

**Response/template.** Area and polygon selection.

**Derivation.** Construct midlines between adjacent supports in x/y or union
beam-reaction source regions.

**Difficulty.** L1 interior regular grid; L2 edge/corner/unequal bays; L3 void or
transfer changes source region.

**Distractors/constraints.** full surrounding bays, floor gross area, overlap
with neighbor.

**Feedback.** Show tributary polygon and partition.

**Examples.** (1) 6×8 m interior area=`48 m²` (L1). (2) corner quarter bays
(L2). (3) subtract void and add transferred patch (L3).

**Validation.** support regions are disjoint and cover loaded domain.

### Family `distributed_load_resultant`

**Task/purpose.** Replace uniform, triangular, trapezoidal, or piecewise load
with force and location.

**Response/template.** `kN` and coordinate.

**Derivation.** Area and centroid of load-intensity diagram, decomposed into
rectangles/triangles.

**Difficulty.** L1 uniform; L2 triangle; L3 trapezoid/piecewise signed load.

**Distractors/constraints.** peak×length for triangle, triangle at midpoint,
wrong heavy-end third.

**Feedback.** Treat load diagram as an area with centroid.

**Examples.** (1) `10 kN/m×4=40 kN` at 2 m (L1). (2) triangle `½×6×9=27`
at one-third from heavy end (L2). (3) trapezoid decomposition (L3).

**Validation.** analytic integration and decomposition agree.

### Family `simply_supported_reactions`

**Task/purpose.** Find pin/roller reactions for a statically determinate beam
with point/distributed actions.

**Response/template.** reaction components.

**Derivation.** Replace distributions by resultants; solve global force/moment
equilibrium.

**Difficulty.** L1 central load; L2 eccentric/multiple loads; L3 horizontal
component and applied couple.

**Distractors/constraints.** half total regardless of position, omit couple,
assign horizontal reaction to roller.

**Feedback.** Free body and two independent moment checks.

**Examples.** (1) central 20 kN→10/10 (L1). (2) 12 kN at L/3→8/4 (L2).
(3) UDL+point+couple (L3).

**Validation.** full equilibrium residual zero and unique rank.

### Family `cantilever_fixed_reactions`

**Task/purpose.** Find force and moment reactions at a fixed support.

**Response/template.** `Rx,Ry,M`.

**Derivation.** Negate total external forces and their moments about fixed end.

**Difficulty.** L1 end point load; L2 UDL; L3 oblique force plus applied couple.

**Distractors/constraints.** omit fixed moment, use full UDL at free end, wrong
moment sign.

**Feedback.** Show force and moment balance at the wall/column support.

**Examples.** (1) 5 kN at 3 m→5 kN and 15 kN·m (L1). (2) `wL` at L/2 (L2).
(3) vector load and couple (L3).

**Validation.** force/moment residual and equivalent resultant.

### Family `column_load_takedown`

**Task/purpose.** Accumulate beam/slab/wall reactions down selected columns/walls
through storeys.

**Response/template.** axial action by level and foundation reaction.

**Derivation.** Traverse directed gravity graph top-down, adding unique incoming
reactions and stated self-weight per level.

**Difficulty.** L1 identical floors; L2 varying bays/storeys; L3 transfer changes
which lower support receives action.

**Distractors/constraints.** report per-floor rather than cumulative, double
shared beam reaction, continue terminated column through transfer.

**Feedback.** Waterfall arrows and cumulative table.

**Examples.** (1) 4 floors×100 kN→400 kN at base (L1). (2) varying floors plus
self-weight (L2). (3) two upper columns transfer to one lower column (L3).

**Validation.** node conservation and each source load reaches ground once.

### Family `supplied_load_combination`

**Task/purpose.** Apply an explicit fictional combination to separate load-case
effects or actions.

**Response/template.** combined action/effect and controlling supplied
combination.

**Derivation.** Evaluate displayed linear expressions and exclusivity rules;
compare signed/magnitude criterion as stated.

**Difficulty.** L1 two positive terms; L2 favorable/unfavorable signs; L3 several
candidate combinations and leading variable.

**Distractors/constraints.** memorize factors, factor total instead of cases,
combine mutually exclusive cases.

**Feedback.** Color each factored case contribution.

**Examples.** (1) supplied `1.2G+1.5Q` (L1). (2) uplift with opposing permanent
action (L2). (3) select larger of two supplied expressions (L3).

**Validation.** expression AST and exclusivity checker.

### Family `loading_reaction_audit`

**Task/purpose.** Diagnose one tributary, unit, resultant, reaction, combination,
or load-takedown error.

**Response/template.** Root step and corrected result.

**Derivation.** Compare geometry partition, load integrals, equilibrium, graph
conservation, and expression AST.

**Difficulty.** L1 unit/centroid; L2 asymmetric reaction; L3 double-counted
reaction propagates through several storeys.

**Distractors/constraints.** Exactly one root mutation.

**Feedback.** Trace patch→line/resultant→reaction→support below.

**Examples.** (1) `kN/m²` reported as `kN/m` without width (L1). (2)
triangular resultant at midpoint (L2). (3) beam reaction assigned to two columns
(L3).

**Validation.** fault manifest and independent partition/equilibrium/takedown
oracles.

### Cross-family progression

Unit conversion and tributary geometry precede load resultants. Determinate beam
and cantilever reactions follow. Column takedown reuses reactions as new actions.
Supplied combinations remain separate until unfactored paths are mastered;
audits close the category.

## 4. Category: Internal actions, beam diagrams, and simple trusses

### Category purpose

Expose what happens inside members by cutting them, constructing axial/shear/
moment diagrams, and identifying tension/compression paths in simple trusses.

### Learn

Cut a member and replace the removed side by internal axial force, shear, and
moment according to the displayed sign convention. Across a point load, shear
jumps; under distributed load, shear changes with slope; moment changes with
shear. Moment extrema occur where shear crosses zero in smooth regions. An ideal
pin-jointed truss carries axial member forces only.

### Prerequisites

Categories 2–3; graphs, slope/area, equilibrium.

### Category boundaries

V1 beam calculations are determinate. Frame bending may be interpreted from
supplied results. Stress/deflection are Category 5.

### Common misconceptions

- Drawing internal actions on the wrong cut face with inconsistent signs.
- Making shear continuous across a point load.
- Making moment jump at a force rather than an applied couple.
- Confusing load, shear, and moment diagram shapes/units.
- Locating maximum moment at maximum load instead of zero shear.
- Treating an ideal truss member as bending-resisting.
- Calling every diagonal a tension member.

### Family `section_cut_internal_actions`

**Task/purpose.** Determine N, V, M at a selected cut from one side’s free body.

**Response/template.** Signed fields `N,V,M`.

**Derivation.** Cut member, retain one side, and solve its force/moment
equilibrium with displayed positive-face convention.

**Difficulty.** L1 axial/shear only; L2 beam N/V/M; L3 choose easier side and
include distributed-load resultant.

**Distractors/constraints.** use reactions from both sides, sign-face reversal,
omit moment.

**Feedback.** Isolate chosen segment and close equilibrium.

**Examples.** (1) tie under 10 kN→N=10 kN tension (L1). (2) cut simply
supported beam (L2). (3) cut within partial UDL (L3).

**Validation.** left/right cut answers are action-reaction equivalents.

### Family `shear_diagram_point_actions`

**Task/purpose.** Construct/read shear diagram for reactions and point actions.

**Response/template.** Ordered semantic breakpoints/plateau values.

**Derivation.** Start at zero; add each signed vertical point action while
traversing x.

**Difficulty.** L1 one load; L2 several loads; L3 applied point action at support
or coincident events with declared order.

**Distractors/constraints.** ramp between point loads, omit reaction, wrong jump
direction.

**Feedback.** Pair each arrow with its diagram jump.

**Examples.** (1) +10 reaction then −20 load then +10 reaction (L1). (2)
three plateaus (L2). (3) mixed signed actions (L3).

**Validation.** jump equals point action and final shear returns zero.

### Family `shear_diagram_distributed_actions`

**Task/purpose.** Construct/read shear under uniform/triangular/piecewise
distributed actions.

**Response/template.** line/curve segment types and endpoint values.

**Derivation.** `ΔV=−area under w(x)` under profile; uniform w gives linear V,
linear w gives quadratic V.

**Difficulty.** L1 full UDL; L2 partial/piecewise; L3 triangular load and point
jumps.

**Distractors/constraints.** constant shear under UDL, wrong slope, ignore load
extent.

**Feedback.** Shade load area matching shear change.

**Examples.** (1) downward 4 kN/m over 3 m→V drops 12 kN (L1). (2) partial
UDL creates flat then sloped region (L2). (3) triangular load→curved V (L3).

**Validation.** analytic integration and sampled derivative.

### Family `moment_diagram_from_shear`

**Task/purpose.** Construct/read moment diagram from shear and support/couple
conditions.

**Response/template.** breakpoints, values, segment shape, signs.

**Derivation.** `ΔM=area under V`; slope of M equals V under profile; applied
couple creates a moment jump.

**Difficulty.** L1 constant V→linear M; L2 linear V→parabolic M; L3 point
couple/partial loads.

**Distractors/constraints.** copy shear shape, moment jump at force, ignore
support boundary.

**Feedback.** Shade shear areas between moment points.

**Examples.** (1) shear +10 for 2 m→moment rises 20 kN·m (L1). (2) UDL
parabola (L2). (3) applied couple causes specified jump (L3).

**Validation.** derivative/integral relations and boundary moments.

### Family `moment_extrema_zero_crossing`

**Task/purpose.** Locate maximum/minimum moment, zero moment, or contraflexure
from coordinated V/M diagrams.

**Response/template.** coordinate/value or point selection.

**Derivation.** Interior smooth extrema where V=0; zeros solve M(x)=0; compare
boundaries/discontinuities too.

**Difficulty.** L1 obvious zero-shear point; L2 solve linear V; L3 several
candidates and moment jump.

**Distractors/constraints.** maximum load location, maximum |V|, ignore endpoint.

**Feedback.** Align V zero with M tangent.

**Examples.** (1) symmetric beam midspan maximum M (L1). (2) asymmetric UDL/
point zero V (L2). (3) compare local extremum with end couple (L3).

**Validation.** analytic candidates and sampled envelope agree.

### Family `axial_force_diagram`

**Task/purpose.** Construct axial-force diagram through columns, ties, struts, or
stepped axial members.

**Response/template.** signed segment values.

**Derivation.** Traverse member and accumulate axial point/distributed actions
under tension-positive profile.

**Difficulty.** L1 one force; L2 several storey loads/area changes; L3 load
reversal and tension/compression transitions.

**Distractors/constraints.** shear-style orientation, reset at joints, tension/
compression sign swap.

**Feedback.** Show cut equilibrium per segment.

**Examples.** (1) tie 20 kN tension constant (L1). (2) column compression
accumulates downward (L2). (3) signed force changes across anchors (L3).

**Validation.** jumps equal axial actions and joint balance.

### Family `truss_zero_force_members`

**Task/purpose.** Identify zero-force members using stated unloaded-joint rules
and support/load conditions.

**Response/template.** Member-ID set plus rule.

**Derivation.** Iteratively apply equilibrium at eligible non-support joints,
updating after each zero member.

**Difficulty.** L1 two noncollinear members; L2 three-member collinear rule; L3
cascading zeros after first elimination.

**Distractors/constraints.** loaded/support joint rule misapplied, symmetry alone,
diagonal assumed zero.

**Feedback.** Highlight joint equilibrium sequence.

**Examples.** (1) unloaded two-member joint→both zero (L1). (2) third
noncollinear member zero (L2). (3) cascade through two joints (L3).

**Validation.** full truss solver confirms zero within exact/tolerance.

### Family `truss_joint_member_force`

**Task/purpose.** Solve selected ideal truss member forces and tension/compression
sense by method of joints.

**Response/template.** signed force fields.

**Derivation.** Solve reactions, then joints with at most two unknown member
forces using component equilibrium.

**Difficulty.** L1 right-triangle joint; L2 sequence of joints; L3 identify
solvable order among distractor joints.

**Distractors/constraints.** force arrow sense not reinterpreted, bending force
added, unstable/indeterminate truss excluded.

**Feedback.** Assume tension arrows outward, then interpret sign.

**Examples.** (1) 3-4-5 diagonal force (L1). (2) two-joint roof truss sequence
(L2). (3) choose joint order and solve three members (L3).

**Validation.** global stiffness/equilibrium oracle and every joint residual.

### Family `beam_truss_arch_action_compare`

**Task/purpose.** Match simplified beam, truss, arch, cable, or frame diagrams to
dominant internal-action patterns under supplied supports/loads.

**Response/template.** Matching/choice with force-path evidence.

**Derivation.** Query prevalidated model results for axial/shear/moment dominance
and thrust/tie reactions.

**Difficulty.** L1 beam versus truss; L2 arch/cable under matching load; L3
support/tie change alters thrust path.

**Distractors/constraints.** shape alone cannot determine action; conditions
always shown.

**Feedback.** Overlay axial/bending/thrust arrows.

**Examples.** (1) pin truss→axial members (L1). (2) arch produces horizontal
thrust; tied arch closes it (L2). (3) funicular cable for supplied load (L3).

**Validation.** result-set metadata and support reactions.

### Family `internal_force_audit`

**Task/purpose.** Diagnose one cut, sign, jump, slope, boundary, extremum, or
truss-equilibrium error.

**Response/template.** root relation and corrected diagram/value.

**Derivation.** Compare cut equilibrium, distribution integrals, diagram
derivatives, and joint residuals.

**Difficulty.** L1 sign/jump; L2 V/M shape; L3 locally plausible diagram violates
global equilibrium.

**Distractors/constraints.** Exactly one root mutation.

**Feedback.** Mark the first x/joint where invariant fails.

**Examples.** (1) shear fails to jump at point load (L1). (2) M drawn linear
under linearly varying V (L2). (3) truss member signs leave joint unbalanced
(L3).

**Validation.** fault manifest and independent diagram/truss solver.

### Cross-family progression

Section cuts precede diagrams. Point-load shear comes before distributed-load
shear, then moment and extrema. Axial diagrams provide a simpler contrast.
Zero-force rules precede truss calculations. System-action comparison and audits
integrate representation transfer.

## 5. Category: Sections, stress, stiffness, deflection, and stability

### Category purpose

Connect member geometry and material properties to idealized stress,
deformation, stiffness, and buckling without performing real material design.

### Learn

Area controls average axial stress/stiffness; second moment of area controls
elastic bending stiffness; section modulus relates moment to extreme-fibre
stress. Geometry relative to the bending axis matters strongly. Strength,
stiffness, and stability are separate checks. Euler buckling is a narrow ideal
column model, not a real capacity.

### Prerequisites

Category 4; centroids, powers, algebra.

### Category boundaries

Linear elastic homogeneous sections and supplied formulas only. No material-code
resistance, local buckling, lateral-torsional buckling, reinforced concrete,
connection, fatigue, fire, or plastic design.

### Common misconceptions

- Confusing area with second moment of area.
- Using global datum instead of centroidal axis without parallel-axis theorem.
- Rotating a rectangle without changing I.
- Treating E as strength.
- Dividing moment by area instead of section modulus.
- Assuming doubled span doubles deflection.
- Treating Euler load as an allowable real load.

### Family `section_centroid`

**Task/purpose.** Find centroid of a rectangular/composite section or missing
component.

**Response/template.** centroid coordinates.

**Derivation.** Area-weighted coordinates with signed void areas where profile
permits.

**Difficulty.** L1 symmetric; L2 two rectangles; L3 void/asymmetric built-up
section.

**Distractors/constraints.** unweighted coordinate average, void positive,
bounding-box center.

**Feedback.** Area×distance table and balance.

**Examples.** (1) rectangle center (L1). (2) T-section y-bar (L2). (3)
rectangle with offset void (L3).

**Validation.** polygon centroid and component sum agree.

### Family `second_moment_area`

**Task/purpose.** Calculate/compare centroidal second moment of area for simple
or composite sections.

**Response/template.** `mm⁴`/`m⁴` or ranking.

**Derivation.** Use supplied primitive formulas and parallel-axis theorem
`I=sum(Ic+A d²)`, subtracting voids.

**Difficulty.** L1 rectangle axis; L2 rotated rectangle; L3 composite/void.

**Distractors/constraints.** `bh²/12`, area only, omit `Ad²`, wrong axis.

**Feedback.** Highlight axis and show distance-squared contribution.

**Examples.** (1) `bh³/12` (L1). (2) deep orientation much larger I (L2).
(3) I-section from three rectangles (L3).

**Validation.** polygon integration and component formula.

### Family `section_modulus_bending_stress`

**Task/purpose.** Calculate `S=I/c` and ideal extreme-fibre stress `sigma=M/S`.

**Response/template.** section modulus/stress with units and face sense.

**Derivation.** Find farthest fibre per side; apply linear elastic bending
profile and sign convention.

**Difficulty.** L1 symmetric section; L2 asymmetric top/bottom moduli; L3
combined supplied M axes kept separate.

**Distractors/constraints.** M/A, use total depth for c, same stress both faces
on asymmetric section.

**Feedback.** Draw neutral axis and linear stress block.

**Examples.** (1) rectangle S and stress (L1). (2) T-section top/bottom stress
(L2). (3) identify controlling extreme fibre in exercise (L3).

**Validation.** stress at y from `My/I` and S method agree.

### Family `axial_stress_strain_deformation`

**Task/purpose.** Relate ideal axial force, area, stress, strain, E, and length
change.

**Response/template.** requested typed value.

**Derivation.** `sigma=N/A`, `epsilon=sigma/E`, `delta=epsilon L=NL/(AE)`.

**Difficulty.** L1 stress; L2 deformation; L3 stepped members in series.

**Distractors/constraints.** E as strength, omit area/length, unit-power error.

**Feedback.** Separate force→stress→strain→movement.

**Examples.** (1) 100 kN/1000 mm²=100 MPa (L1). (2) calculate elongation
(L2). (3) sum two segment deformations (L3).

**Validation.** energy/stiffness and direct formulas agree.

### Family `member_stiffness_compare`

**Task/purpose.** Compare axial `EA/L` or flexural `EI` stiffness under supplied
ideal boundary/model.

**Response/template.** ratio/ranking or missing property.

**Derivation.** Evaluate stated stiffness measure; normalize ratios exactly.

**Difficulty.** L1 same E/L different A/I; L2 several variables; L3 distinguish
member EI from system deflection/support effects.

**Distractors/constraints.** E alone, strength proxy, invert L effect.

**Feedback.** Contribution-factor table.

**Examples.** (1) double A doubles axial stiffness (L1). (2) rotate rectangle
changes EI strongly (L2). (3) same EI, different support condition not same
deflection (L3).

**Validation.** dimension/ratio and limiting behavior.

### Family `beam_deflection_supplied_model`

**Task/purpose.** Calculate/scale ideal elastic beam deflection from a supplied
formula or prevalidated shape.

**Response/template.** displacement/ratio and deflected-shape choice.

**Derivation.** Evaluate displayed relation such as
`delta=P L³/(48EI)`; advanced piecewise result comes from solver.

**Difficulty.** L1 direct; L2 scaling span/depth/E; L3 compare support/load
conditions with supplied formulas.

**Distractors/constraints.** linear span scaling, I omitted, strength used for E.

**Feedback.** exponent sensitivity and qualitative curvature.

**Examples.** (1) double P doubles deflection (L1). (2) double L→8× for formula
(L2). (3) compare simply supported/cantilever supplied cases (L3).

**Validation.** analytic formula, unit typing, beam-solver fixture.

### Family `serviceability_ratio_check`

**Task/purpose.** Compare a calculated/supplied deformation to a fictional limit
or express span/deflection ratio.

**Response/template.** ratio, margin, and `within|exceeds exercise limit`.

**Derivation.** Evaluate exact displayed criterion with inclusivity/rounding
defined.

**Difficulty.** L1 compare mm; L2 `L/n`; L3 several supplied serviceability
criteria/effects.

**Distractors/constraints.** invert ratio, compare strength, call result safe/
compliant.

**Feedback.** Say “within this exercise limit,” nothing more.

**Examples.** (1) 8 mm vs fictional 10 mm (L1). (2) 6000/20=300→L/300 (L2).
(3) choose controlling stated criterion (L3).

**Validation.** threshold/tie rules and banned claim language.

### Family `euler_buckling_model`

**Task/purpose.** Calculate/scale ideal Euler critical load
`Pcr=pi²EI/(KL)²` or radius/slenderness inputs.

**Response/template.** load/ratio/missing K,L,E,I.

**Derivation.** Apply explicitly supplied ideal pin/end-condition profile.

**Difficulty.** L1 direct friendly; L2 effective length/scaling; L3 compare axes
or determine weaker Euler direction.

**Distractors/constraints.** length first power, area replacing I, call Pcr
capacity/allowable.

**Feedback.** Show buckled axis and squared effective-length effect.

**Examples.** (1) double L→quarter Pcr (L1). (2) supplied K values (L2).
(3) compare Ix/Iy axes (L3).

**Validation.** eigenvalue/simple analytic oracle and dimensional check.

### Family `section_response_audit`

**Task/purpose.** Diagnose one centroid, axis, I, S, stress, stiffness,
deflection, threshold, or buckling-model error.

**Response/template.** root step and correction.

**Derivation.** Compare geometry integrals, typed equations, supplied boundary
model, and limited conclusion.

**Difficulty.** L1 unit/axis; L2 parallel-axis/deflection exponent; L3 numeric
Euler result correct but mislabeled real capacity.

**Distractors/constraints.** Exactly one root mutation.

**Feedback.** Trace section/property→response→exercise check.

**Examples.** (1) rectangle uses wrong bending axis (L1). (2) composite I omits
Ad² (L2). (3) Pcr presented as safe working load (L3).

**Validation.** fault manifest and independent geometry/solver checks.

### Cross-family progression

Centroid precedes I, then section modulus/stress. Axial response and stiffness
clarify property roles. Deflection introduces system response; fictional
serviceability checks teach conditional comparison. Euler buckling remains a
separate ideal stability model. Audits test model limits.

## 6. Category: Structural grids, spanning systems, transfers, and openings

### Category purpose

Train building-scale framing literacy and the ability to predict how
architectural geometry changes structural hierarchy and load paths.

### Learn

Identify what spans to what before calculating. A one-way surface transfers
mainly to two opposite supports under its stated model; a two-way surface
distributes to several. Continuous vertical alignment creates direct paths;
offsets and column/wall terminations require explicit transfers. Openings remove
load-carrying area and interrupt members/diaphragms unless framed around.

### Prerequisites

Categories 2–5; architectural plans/sections.

### Category boundaries

This category recognizes and compares prevalidated fictional systems. It does
not choose real slab thickness, member sizes, grids, materials, or connections.

### Common misconceptions

- Assuming shortest span always without checking support/direction model.
- Confusing architectural module with structural bay.
- Treating grid intersection as a column automatically.
- Assuming a column drawn above continues through the floor below.
- Ignoring transfer depth and affected storeys/spaces.
- Allowing a slab opening to terminate framing without a new path.
- Treating a cantilever as simply supported span.

### Family `span_direction_identify`

**Task/purpose.** Identify one-way/two-way spanning direction and immediate
supports from a supplied structural plan/model.

**Response/template.** arrows plus support IDs.

**Derivation.** Query surface transfer rule and boundary supports.

**Difficulty.** L1 explicit deck direction; L2 unequal bay/two-way; L3 rotated
plan and partial support.

**Distractors/constraints.** shortest geometry alone, north/page confusion,
unsupported edge.

**Feedback.** Draw load strips/arrows to supports.

**Examples.** (1) deck arrows east-west to beams (L1). (2) two-way panel to four
sides (L2). (3) opening alters local strips (L3).

**Validation.** transfer edges exist and partition surface load.

### Family `framing_hierarchy_trace`

**Task/purpose.** Order deck/slab, joist, secondary beam, girder, column/wall,
and foundation in a framing plan/section.

**Response/template.** ordered IDs/roles.

**Derivation.** Traverse gravity graph and group by hierarchy.

**Difficulty.** L1 three levels; L2 mixed primary directions; L3 branch and
transfer.

**Distractors/constraints.** visual line weight/order, adjacent non-supporting
member, skip girder.

**Feedback.** coordinated plan-section load arrows.

**Examples.** (1) slab→beam→column (L1). (2) deck→joist→girder→wall (L2).
(3) upper column→transfer truss→cores (L3).

**Validation.** graph traversal and source load conservation.

### Family `grid_bay_coordinate`

**Task/purpose.** Read/construct structural bay dimensions, grid coordinates,
and member extents from plans/sections.

**Response/template.** grid pair, span, or placement selection.

**Derivation.** Resolve stable grid axes and exact coordinate differences.

**Difficulty.** L1 regular bay; L2 unequal/offset grids; L3 member spans several
grids with one support release.

**Distractors/constraints.** count grid lines as bays, page distance, centerline/
face confusion.

**Feedback.** Highlight axis endpoints and bay intervals.

**Examples.** (1) grids 2–3 spacing 6 m (L1). (2) column at C/4 (L2). (3)
beam A1 spans grids 1–4 with support at 3 (L3).

**Validation.** coordinate model and dimension chains.

### Family `vertical_support_continuity`

**Task/purpose.** Determine whether columns/walls/supports align across levels
and where direct load paths terminate/offset.

**Response/template.** aligned/offset/terminated plus affected IDs.

**Derivation.** Project support footprints between adjacent levels and inspect
connectivity.

**Difficulty.** L1 aligned column; L2 offset; L3 wall-to-columns/partial overlap.

**Distractors/constraints.** same grid label across stale revision, visual
overlap without connection.

**Feedback.** stack transparent plans and show transfer requirement as exercise
fact, not design.

**Examples.** (1) C5 aligned L1–L3 (L1). (2) upper column offset 2 m (L2).
(3) wall bears on modeled transfer line (L3).

**Validation.** 3D footprint intersections and connection graph.

### Family `transfer_path_identify`

**Task/purpose.** Trace reactions through a supplied transfer beam/truss/slab to
new supports.

**Response/template.** ordered/branching path and reactions from result set.

**Derivation.** Traverse transfer graph; numeric cases use prevalidated
determinate model/results.

**Difficulty.** L1 one upper column/two supports; L2 several columns; L3 transfer
changes lateral/gravity path at different levels.

**Distractors/constraints.** continue phantom column, bypass transfer, infer
unmodeled slab action.

**Feedback.** section/axonometric force arrows and affected zone.

**Examples.** (1) upper column→transfer beam→two columns (L1). (2) transfer
truss panel points (L2). (3) gravity transfer distinct from lateral system (L3).

**Validation.** graph endpoints and result equilibrium.

### Family `cantilever_backspan_reasoning`

**Task/purpose.** Identify cantilever, backspan, support, and stabilizing reaction
relationships in a bounded framing model.

**Response/template.** region labels, moment sense, or reaction comparison.

**Derivation.** Use model continuity/supports and equilibrium/result set.

**Difficulty.** L1 cantilever/free edge; L2 backspan load changes reaction; L3
uplift-like signed reaction under supplied fictional case.

**Distractors/constraints.** treat cantilever as simply supported, count
backspan as unrelated, infer real anchorage.

**Feedback.** show negative/positive reaction/moment path.

**Examples.** (1) balcony projects beyond last support (L1). (2) backspan
balances cantilever moment (L2). (3) signed support reaction flips (L3).

**Validation.** support topology and equilibrium.

### Family `opening_load_path_consequence`

**Task/purpose.** Predict which tributary regions/members/diaphragm paths change
when a fictional opening is added/moved.

**Response/template.** affected-ID set and revised arrows.

**Derivation.** Boolean opening geometry removes surface transfer edges; traverse
framing-around graph supplied by revision.

**Difficulty.** L1 opening between beams; L2 cuts joist/member; L3 near diaphragm
collector/vertical system.

**Distractors/constraints.** opening has no effect, all nearby members affected,
invent framing not modeled.

**Feedback.** before/after load-path overlay.

**Examples.** (1) small opening within supported panel redirects local strips
(L1). (2) opening interrupts joist and transfers to headers (L2). (3) opening
severs modeled diaphragm path until collector revision (L3).

**Validation.** graph diff and load conservation after revision.

### Family `system_action_match`

**Task/purpose.** Match beam/slab, truss, frame, arch, cable, shell/folded plate,
wall, or core models to supplied span/support/action diagrams.

**Response/template.** system choice plus dominant-action evidence.

**Derivation.** Match prevalidated topology and result signatures.

**Difficulty.** L1 familiar planar systems; L2 same form/different supports; L3
hybrid system and incomplete information.

**Distractors/constraints.** appearance/material alone; all relevant constraints
shown.

**Feedback.** show spanning surface, reactions, axial/bending action.

**Examples.** (1) pin triangulation→truss (L1). (2) curved form with tie versus
arch thrust (L2). (3) shell-like geometry but line supports make folded-plate
teaching model (L3).

**Validation.** semantic model type and action signature.

### Family `framing_system_audit`

**Task/purpose.** Diagnose one span, hierarchy, grid, continuity, transfer,
cantilever, opening, or system-model error.

**Response/template.** root geometry/model fault and affected path.

**Derivation.** Compare 3D topology, surface transfers, support continuity, and
result provenance.

**Difficulty.** L1 missing support; L2 phantom vertical continuity; L3 one stale
opening revision breaks several paths.

**Distractors/constraints.** Exactly one root mutation.

**Feedback.** show earliest broken graph edge and downstream loads.

**Examples.** (1) deck arrows toward unsupported edge (L1). (2) column assumed
continuous below termination (L2). (3) framing plan updated but section/analysis
still shows removed transfer (L3).

**Validation.** fault manifest and graph/geometry coordination.

### Cross-family progression

Span direction and hierarchy precede grids and vertical continuity. Transfer and
cantilever reasoning then expose non-direct paths. Opening consequences reuse
surface/framing graphs. System matching broadens conceptual vocabulary; audits
integrate plan, section, and model.

## 7. Category: Lateral systems, diaphragms, stability, and robustness

### Category purpose

Make horizontal-action paths and building stability visible in plan, elevation,
section, and axonometric diagrams.

### Learn

Lateral action travels from surfaces/components into floor/roof diaphragms,
through collectors/chords and connections, into vertical resisting systems, then
foundations/ground. Storey shear accumulates downward. Separated resistance
creates an overturning couple. Offset between action and resistance can produce
torsion. Drift is relative movement between levels, not total roof displacement.

### Prerequisites

Categories 2–6; moments, force couples, plans/sections.

### Category boundaries

Actions, stiffnesses, limits, and distributions are supplied fictional data.
No site hazard, seismic/wind design, code classification, ductility/detailing,
or real robustness assessment.

### Common misconceptions

- Stopping a lateral path at cladding or diaphragm.
- Treating a diaphragm as only a gravity slab.
- Sending collector force across an opening/discontinuity.
- Using total building lateral force as every storey shear.
- Resisting overturning with one vertical force instead of a couple.
- Assuming centre of geometry equals centre of resistance.
- Calling roof displacement storey drift.
- Treating triangulated appearance as stable without restraints/connections.

### Family `lateral_system_load_path`

**Task/purpose.** Identify braced-frame, moment-frame, wall/core, or hybrid
vertical system and trace a selected lateral action to ground.

**Response/template.** system type plus ordered/branching stable IDs.

**Derivation.** Traverse load-case-scoped graph from surface action through
diaphragm to vertical system/foundation.

**Difficulty.** L1 one wall/brace line; L2 hybrid directions; L3 system changes
by axis/storey.

**Distractors/constraints.** gravity-only column, path stops at floor, material/
appearance classification.

**Feedback.** animate plan→elevation→foundation arrows.

**Examples.** (1) roof→diaphragm→braced bay→footings (L1). (2) walls in x,
frames in y (L2). (3) transfer level switches system (L3).

**Validation.** path reaches restrained ground and matches action direction.

### Family `diaphragm_force_distribution`

**Task/purpose.** Distribute supplied diaphragm shear to vertical elements under
an explicit rigid/flexible teaching rule.

**Response/template.** force by line and total.

**Derivation.** Use displayed allocation: tributary width for flexible profile
or normalized supplied stiffness for concentric rigid profile.

**Difficulty.** L1 equal lines; L2 unequal widths/stiffness; L3 one inactive line
or two directions.

**Distractors/constraints.** unweighted equal split, include orthogonal system,
forget normalization.

**Feedback.** plan arrows and force ledger.

**Examples.** (1) 100 kN equally to two lines→50/50 (L1). (2) stiffness 1:3
→25/75 (L2). (3) filter inactive line (L3).

**Validation.** distributed forces sum to diaphragm action.

### Family `collector_chord_path`

**Task/purpose.** Identify/compute simple collector drag force or diaphragm chord
couple under a supplied strip model.

**Response/template.** member/path selection and force.

**Derivation.** Follow discontinuous shear path; chord couple uses supplied
`M/depth`, collector force from cumulative strip actions.

**Difficulty.** L1 select collector; L2 compute force; L3 opening interrupts path
and alternate modeled collector is required.

**Distractors/constraints.** cross opening, select gravity beam solely by
location, use length rather than lever arm.

**Feedback.** cut diaphragm and show force closure.

**Examples.** (1) highlighted drag strut to wall line (L1). (2) `M=600 kN·m`,
depth 12 m→50 kN chord force (L2). (3) route around opening (L3).

**Validation.** path continuity and force/moment equilibrium.

### Family `storey_shear_accumulate`

**Task/purpose.** Accumulate level-applied lateral forces into storey shear.

**Response/template.** storey-shear table/diagram.

**Derivation.** Shear below a level equals sum of all applied lateral forces
above under the profile.

**Difficulty.** L1 equal forces; L2 varying forces; L3 signed/reversing or
branched systems.

**Distractors/constraints.** use force at that level only, accumulate upward,
confuse storey shear with overturning moment.

**Feedback.** waterfall from roof downward.

**Examples.** (1) 10 kN each on 3 levels→10/20/30 kN (L1). (2) varying level
forces (L2). (3) distribute storey shear between lines after accumulation (L3).

**Validation.** cumulative sum and base shear.

### Family `overturning_couple`

**Task/purpose.** Calculate base overturning moment or ideal tension/compression
couple from supplied lateral actions and lever arm.

**Response/template.** `kN·m` and couple forces.

**Derivation.** `M=sum(F_i h_i)`; ideal couple magnitude `N=M/b`.

**Difficulty.** L1 one force; L2 storey forces; L3 combine vertical permanent
actions with signed edge reactions.

**Distractors/constraints.** use building width as force height, omit level,
divide by half/full lever arm wrongly.

**Feedback.** elevation moment arms and base couple.

**Examples.** (1) 100 kN at 10 m→1000 kN·m (L1). (2) three levels sum (L2).
(3) 1000/20=50 kN ideal couple (L3).

**Validation.** force-moment invariants.

### Family `plan_torsion_simple`

**Task/purpose.** Calculate supplied-plan eccentricity torsional moment and
distribute it under an explicit simplified stiffness-radius rule.

**Response/template.** eccentricity, torque, and line increments.

**Derivation.** `Mt=V e`; apply displayed normalized `k_i r_i/sum(k r²)` rule
with signed distance.

**Difficulty.** L1 torque only; L2 two resisting lines; L3 direct+torsional
components and sign.

**Distractors/constraints.** centre of geometry assumed, omit direct shear,
distance not signed.

**Feedback.** plan marks centre of action/resistance and rotation sense.

**Examples.** (1) 100 kN×2 m=200 kN·m (L1). (2) two-line increments (L2).
(3) one line direct+torsion, other direct−torsion (L3).

**Validation.** distributed forces restore total shear and moment.

### Family `storey_drift_profile`

**Task/purpose.** Convert level displacements to interstorey drifts/ratios and
compare with a supplied fictional criterion.

**Response/template.** drift by storey, ratio, and controlling exercise storey.

**Derivation.** `Delta_i=u_i−u_{i−1}`; ratio `Delta_i/h_i`.

**Difficulty.** L1 one storey; L2 multi-level; L3 nonuniform heights and signed
displacement.

**Distractors/constraints.** roof displacement as every drift, divide by total
height, call criterion code/safety.

**Feedback.** align displaced elevation and relative arrows.

**Examples.** (1) 12−5=7 mm drift (L1). (2) drift ratios by level (L2). (3)
largest displacement not largest ratio (L3).

**Validation.** differences telescope to roof displacement.

### Family `stability_robustness_path`

**Task/purpose.** Identify a mechanism/missing restraint or a supplied alternate
path/tie after one fictional element removal.

**Response/template.** unstable DOF/mechanism or surviving path IDs.

**Derivation.** Constraint/graph rank analysis before/after controlled removal;
no nonlinear capacity inference.

**Difficulty.** L1 untriangulated quadrilateral; L2 missing diaphragm/brace
connection; L3 alternate graph path exists but its adequacy is not assessed.

**Distractors/constraints.** member count alone, visual triangle with pin
mechanism elsewhere, declare robustness adequate.

**Feedback.** animate kinematic mechanism or surviving topology.

**Examples.** (1) pin rectangle racks without diagonal (L1). (2) brace not
connected at one end (L2). (3) removal leaves alternate path topologically, with
capacity unknown (L3).

**Validation.** stiffness/rigidity matrix rank and graph reachability.

### Family `lateral_stability_audit`

**Task/purpose.** Diagnose one path, distribution, collector, shear, overturning,
torsion, drift, or stability error.

**Response/template.** root layer, correction, affected outputs.

**Derivation.** Compare graph continuity, equilibrium, stiffness allocation,
level differences, and constraint rank.

**Difficulty.** L1 missing path; L2 shear/drift arithmetic; L3 opening removes
collector and invalidates downstream distribution.

**Distractors/constraints.** Exactly one root mutation; no real adequacy claim.

**Feedback.** causal graph from diaphragm/source to foundation/result.

**Examples.** (1) lateral path stops at floor (L1). (2) roof displacement called
second-storey drift (L2). (3) collector crosses new void (L3).

**Validation.** fault manifest and graph/equilibrium/rank oracles.

### Cross-family progression

System/path precedes diaphragm distribution and collector/chord reasoning.
Storey shear precedes overturning; torsion adds plan eccentricity. Drift adds
deformation. Stability/robustness focuses on topology rather than capacity.
Audits integrate the lateral chain.

## 8. Category: Material behavior, connections, and simplified foundations

### Category purpose

Relate supplied material/connection properties and foundation geometry to
structural action while preventing material stereotypes and geotechnical
overreach.

### Learn

Material name alone does not determine behavior: use the supplied E, strength
proxy, density, direction, and tension/compression availability. Connections
control which forces/moments transfer. Foundations spread reactions into a
modeled bearing-pressure field; eccentricity can make pressure nonuniform under
the simple rigid-base model. Soil response is supplied, not inferred.

### Prerequisites

Categories 2–7.

### Category boundaries

No material-code design, reinforcement, fasteners/welds, durability, fire,
bearing capacity, piles, retaining, or real soil/settlement prediction.

### Common misconceptions

- Ranking materials by name rather than supplied properties.
- Treating high strength as high stiffness.
- Assuming every contact transfers tension/moment.
- Claiming “fixed” from a drawn thick line without connection metadata.
- Dividing foundation force by perimeter instead of area.
- Assuming eccentric pressure remains uniform.
- Interpreting a spring-model displacement as real settlement.

### Family `material_property_behavior_compare`

**Task/purpose.** Compare fictional materials by supplied density, E, strength
proxy, directional behavior, or tension/compression availability.

**Response/template.** ranking/matching conditional on named metric.

**Derivation.** Filter/compare typed properties only.

**Difficulty.** L1 one metric; L2 conflicting metrics; L3 orthotropic direction
or missing property→cannot determine.

**Distractors/constraints.** stereotypes, universal “best,” confuse E/strength.

**Feedback.** property table and conditional conclusion.

**Examples.** (1) rank by E (L1). (2) lighter but less stiff tradeoff (L2).
(3) stiffness perpendicular direction not supplied→cannot determine (L3).

**Validation.** comparator and missing-data rules.

### Family `material_member_response`

**Task/purpose.** Predict/compute how changing supplied E, density, or section
property changes self-weight, axial deformation, or beam deflection.

**Response/template.** ratio/result.

**Derivation.** Apply the named response equation while holding displayed
variables constant.

**Difficulty.** L1 E scaling; L2 density self-weight plus response; L3 two
changes offset.

**Distractors/constraints.** strength substituted for E, variables not held
constant, universal material claim.

**Feedback.** held-constant ledger and factor chain.

**Examples.** (1) double E halves elastic deformation (L1). (2) density changes
self-weight (L2). (3) E×2 and I/2 leaves EI unchanged (L3).

**Validation.** ratio and full equation agree.

### Family `composite_action_simple`

**Task/purpose.** Distinguish connected composite action from unconnected
layered members using supplied transformed/effective properties.

**Response/template.** model choice, neutral axis/I_eff supplied calculation.

**Derivation.** Use explicitly supplied composite profile; compare with sum of
independent member stiffnesses.

**Difficulty.** L1 connected/unconnected concept; L2 supplied effective EI; L3
partial-action factor explicitly given.

**Distractors/constraints.** areas simply add into full composite without shear
transfer, invent connector capacity.

**Feedback.** show interface shear-transfer requirement.

**Examples.** (1) no connection→two independent members (L1). (2) full fictional
composite I (L2). (3) apply supplied 0.6 action factor (L3).

**Validation.** profile equation and limiting cases.

### Family `connection_force_transfer`

**Task/purpose.** Identify which axial/shear/moment forces a supplied pin, fixed,
bearing, tie, or released connection transfers.

**Response/template.** force-component set and local load path.

**Derivation.** Read connection DOF constraints/capabilities.

**Difficulty.** L1 pin/fixed; L2 bearing compression-only/tie tension-only; L3
directional release and hybrid connection.

**Distractors/constraints.** appearance alone, compression contact transfers
tension, release carries moment.

**Feedback.** local action-reaction arrows and allowed motion.

**Examples.** (1) ideal pin transfers forces not moment (L1). (2) bearing opens
in tension (L2). (3) one-axis moment release (L3).

**Validation.** connection matrix and load-path graph.

### Family `uniform_bearing_pressure`

**Task/purpose.** Calculate average pressure under a concentrically loaded
fictional footing/base.

**Response/template.** `kPa` or missing force/area.

**Derivation.** `q=N/A` with foundation contact area.

**Difficulty.** L1 rectangle; L2 unit conversion; L3 several column reactions/
combined base.

**Distractors/constraints.** perimeter, gross site area, kN/m rather than kPa.

**Feedback.** force spread over highlighted contact area.

**Examples.** (1) 600 kN/6 m²=100 kPa (L1). (2) mm/m conversion (L2). (3)
combined concentric reactions (L3).

**Validation.** force equals pressure integral.

### Family `eccentric_bearing_pressure`

**Task/purpose.** Calculate/interpret linear contact pressure under supplied
rigid-base full-contact model with `q=N/A ± M/S`.

**Response/template.** edge pressures and contact-status screen.

**Derivation.** Compute section modulus of contact area about named axis; evaluate
edges; if tension results, answer “full-contact model invalid” unless alternate
profile supplied.

**Difficulty.** L1 supplied S; L2 derive S/eccentricity; L3 identify loss-of-
contact screen.

**Distractors/constraints.** uniform pressure, M/A, accept soil tension.

**Feedback.** pressure trapezoid and resultant location.

**Examples.** (1) small e gives positive edge pressures (L1). (2) qmax/qmin
(L2). (3) qmin<0→full-contact assumption invalid (L3).

**Validation.** pressure integral preserves N/M.

### Family `foundation_spring_settlement`

**Task/purpose.** Solve displacement/rotation of supplied independent foundation
springs or compare differential movement.

**Response/template.** movement by support and difference.

**Derivation.** `delta=P/k` per stated linear spring; rigid cap distributions use
prevalidated small solver.

**Difficulty.** L1 one spring; L2 two supports/differential; L3 stiffness/action
changes and architectural level consequence.

**Distractors/constraints.** multiply Pk, strength instead of stiffness, call
result actual settlement.

**Feedback.** spring arrows and displaced level line.

**Examples.** (1) 1000 kN/200 MN/m=5 mm (L1). (2) 8−3=5 mm differential
(L2). (3) rigid cap on unequal springs result set (L3).

**Validation.** spring equilibrium/compatibility and unit typing.

### Family `material_foundation_audit`

**Task/purpose.** Diagnose one property, composite, connection, pressure,
contact, spring, or conclusion error.

**Response/template.** root assumption and correction.

**Derivation.** Compare typed properties, DOF transfers, pressure integrals,
spring solver, and claim boundary.

**Difficulty.** L1 unit/property; L2 connection/contact; L3 numeric spring model
reported as real settlement prediction.

**Distractors/constraints.** Exactly one root mutation.

**Feedback.** trace supplied property/model→response→limited conclusion.

**Examples.** (1) strength used as E (L1). (2) bearing assumed to carry tension
(L2). (3) fictional soil spring result called site prediction (L3).

**Validation.** fault manifest and independent equations.

### Cross-family progression

Property comparison precedes member response. Composite action and connections
teach interface idealization. Uniform pressure precedes eccentric contact, then
simple springs. Audits ensure the supplied models are not expanded into material
or geotechnical claims.

## 9. Category: Architectural constraints, scheme decisions, revisions, and audits

### Category purpose

Practice the architect’s coordination role: extract constraints, compare
prevalidated schemes, understand revision consequences, and communicate
structural uncertainty without designing a real structure.

### Learn

A structural scheme is judged against a brief, not by one universal hierarchy.
Keep requirements, preferences, and supplied performance metrics separate.
Before comparing options, hold actions, geometry, criteria, and analysis basis
constant. A revision can change gravity, lateral, stability, coordination, and
space consequences through one root edit.

### Prerequisites

All relevant direct categories.

### Category boundaries

All decisions concern fictional alternatives with complete supplied result
sets. No real system/material selection, value engineering, cost, carbon,
construction sequencing, or professional recommendation.

### Common misconceptions

- Promoting a preference to a requirement.
- Choosing shortest spans while ignoring transfer/space constraints.
- Comparing options under different actions/models.
- Calling minimum material quantity “best” without weights.
- Fixing a clash graphically while breaking a load path.
- Treating a moved column as a local change only.
- Inventing capacity or stiffness when the result set omits it.

### Family `structural_brief_constraint_extract`

**Task/purpose.** Classify fictional brief statements as required, preferred,
forbidden, supplied metric, or missing.

**Response/template.** matching/structured constraint fields.

**Derivation.** Parse controlled brief grammar into constraint objects.

**Difficulty.** L1 explicit; L2 conditional priorities; L3 detect structural
decision impossible without a missing criterion.

**Distractors/constraints.** preference promoted, metric mistaken for limit,
architectural requirement ignored.

**Feedback.** quote/highlight the exact controlled clause.

**Examples.** (1) “no columns in Hall”→forbidden region (L1). (2) “prefer 8 m
bays unless transfer depth...” (L2). (3) no drift metric supplied→cannot rank
that criterion (L3).

**Validation.** generated AST and unique classification.

### Family `fictional_scheme_compare`

**Task/purpose.** Rank/select/Pareto-filter prevalidated schemes against supplied
span, depth, column-free area, deflection, mass, coordination, and other metrics.

**Response/template.** valid set/ranking plus criterion evidence.

**Derivation.** Check hard constraints first, then apply displayed weights or
Pareto dominance.

**Difficulty.** L1 one constraint; L2 conflicting metrics; L3 sensitivity to
weights/priority.

**Distractors/constraints.** universal “best,” hidden material stereotypes,
compare incompatible model bases.

**Feedback.** constraint matrix and conditional conclusion.

**Examples.** (1) eliminate option exceeding fictional depth (L1). (2) two
nondominated schemes (L2). (3) ranking flips with supplied weights (L3).

**Validation.** constraint/Pareto/weighted-ranking oracle and common-basis check.

### Family `structure_architecture_coordination`

**Task/purpose.** Find/resolve a fictional clash among structure, openings,
stairs, façades, rooms, or services using supplied allowed moves.

**Response/template.** clash IDs and valid resolution set.

**Derivation.** Geometry intersection plus structural graph/brief validation of
each candidate move.

**Difficulty.** L1 physical clash; L2 moving element violates grid/path; L3
several valid tradeoffs or no valid supplied move.

**Distractors/constraints.** cosmetic shift that breaks support, unallowed member
removal, assume real feasibility.

**Feedback.** before/after geometry and load-path consequences.

**Examples.** (1) beam intersects stair opening (L1). (2) move column only to
allowed grid preserving beam support (L2). (3) two valid modeled alternatives
(L3).

**Validation.** collision, constraints, graph continuity, result-set existence.

### Family `structural_revision_impact`

**Task/purpose.** Trace consequences of moving/removing/adding an architectural
or structural element across load paths and coordinated views.

**Response/template.** root edit, affected-ID set, added/removed/modified paths.

**Derivation.** Stable-ID model graph diff and dependency traversal.

**Difficulty.** L1 opening/member; L2 column/grid move; L3 one change affects
gravity and lateral systems plus schedules.

**Distractors/constraints.** only visually adjacent items, all elements, stale
revision mix.

**Feedback.** causal before/after graph.

**Examples.** (1) new opening affects two joists/header (L1). (2) moved column
changes tributary/reactions below (L2). (3) core opening affects diaphragm
collector and vertical path (L3).

**Validation.** revision dependency graph and stable identities.

### Family `structural_uncertainty_sensitivity`

**Task/purpose.** Propagate supplied ranges through a monotonic structural model
or rank output sensitivity/uncertainty contribution.

**Response/template.** interval/ranking.

**Derivation.** endpoint enumeration or displayed finite difference; distinguish
sensitivity from input range.

**Difficulty.** L1 one input; L2 two bounds; L3 derivative versus uncertainty
magnitude.

**Distractors/constraints.** probabilistic claims without distributions, rank E
derivative without E uncertainty, call bound reliability.

**Feedback.** held-constant/range table.

**Examples.** (1) load range→reaction range (L1). (2) E/I bounds→deflection
interval (L2). (3) span uncertainty dominates due to exponent (L3).

**Validation.** endpoint/finite-difference and monotonicity checks.

### Family `structural_model_adequacy`

**Task/purpose.** Choose the simplest supplied model that supports a question or
identify missing information/invalid idealization.

**Response/template.** model choice or `cannot determine` plus reason.

**Derivation.** Compare requested output mechanisms with profile capabilities,
restraints, properties, and action data.

**Difficulty.** L1 beam versus truss; L2 first/second-order or static/dynamic
scope; L3 several plausible models and missing connection stiffness.

**Distractors/constraints.** most complex model automatically, infer missing
restraint/property, claim simple model reality.

**Feedback.** capability matrix: included/omitted mechanisms.

**Examples.** (1) pin truss model cannot produce member bending (L1). (2)
large-displacement question unsupported by small-displacement profile (L2).
(3) frame distribution indeterminate without stiffness (L3).

**Validation.** model-requirement ontology and exact missing set.

### Family `integrated_structural_audit`

**Task/purpose.** Diagnose one root defect or insufficiency in a coordinated
fictional structural building case.

**Response/template.** root layer, evidence IDs, corrected supported result,
affected outputs, limit of conclusion.

**Derivation.** Validate geometry, topology, restraints, loads, units,
equilibrium, internal diagrams, properties, criteria, revisions, and claim
scope; select earliest causal mismatch.

**Difficulty.** L3 two mastered domains; L4 three domains/revision; L5
underdetermined or multiple valid schemes.

**Distractors/constraints.** One seeded root unless insufficiency is explicit;
never require real design judgment.

**Feedback.** causal graph from source/model to consequences.

**Examples.** (1) tributary-width error propagates to beam/column/foundation
reactions (L3). (2) moved core leaves stale diaphragm path and torsion result
(L4). (3) architectural choice requested without connection/stiffness criteria
→cannot determine (L5).

**Validation.** fault/insufficiency manifest and all downstream effects.

### Cross-family progression

Brief extraction precedes scheme comparison. Coordination tasks then test
whether a spatial fix preserves modeled structure. Revisions add causality;
uncertainty and model adequacy prevent false precision. Integrated audits combine
no more than three mastered domains.

## 10. Topic-level progression

### Level 1 — See the model

- identify elements, actions, supports, and direct load paths;
- resolve one force and take one moment;
- convert one area/line/point action;
- read simple reactions/internal diagrams;
- identify span direction and straightforward structural systems.

### Level 2 — Calculate one determinate response

- solve beam/cantilever reactions;
- construct point/UDL shear and moment diagrams;
- solve selected truss joints;
- calculate section properties, ideal stress, deformation, or stiffness;
- trace multi-element gravity/lateral paths.

### Level 3 — Coordinate a building system

- accumulate column/storey actions;
- reason about transfers, openings, cantilevers, diaphragms, and collectors;
- compare strength/stiffness/stability/serviceability concepts;
- interpret torsion, drift, foundation pressure, and supplied spring movement;
- find one root error across plan/section/analysis.

### Level 4 — Compare revisions and alternatives

- solve inverse/missing-property problems;
- attribute structural consequences to an architectural change;
- compare prevalidated schemes on a common basis;
- propagate supplied uncertainty;
- reject an analysis model that omits a required mechanism.

### Level 5 — Exercise professional restraint

- preserve multiple valid schemes;
- distinguish topological path from capacity/adequacy;
- identify underdetermination and missing criteria;
- separate fictional exercise checks from real reliability;
- refuse design, compliance, safety, damage, and construction conclusions.

## 11. Adaptive practice guidance

Track mastery by:

```text
family
representation: plan | section | axonometric | freeBody | diagram | table
element/system type
load case/path
support/release
force/action dimension
axis/sign convention
series/parallel/hierarchy depth
geometry/span/grid
model profile
misconception
difficulty dimensions
```

Routing:

- Support-reaction error → allowed-motion sketches before equilibrium.
- Broken load path → directed graph exercises without arithmetic.
- Vector/moment error → component triangle or lever-arm isolation.
- Tributary/unit error → surface→strip→line→resultant chain.
- Half-reaction reflex → asymmetric single-load beams.
- Diagram jump/slope error → pair one load event with one invariant.
- Maximum-moment error → shear zero/moment slope contrast.
- Truss sign error → outward tension assumption and joint residual.
- Area/I/S confusion → same section with highlighted units/axis.
- Strength/E confusion → property-to-response matching.
- Span-deflection error → exponent ratio before full calculation.
- Grid/column continuity error → stacked transparent plans.
- Opening/transfer error → before/after load graph.
- Storey-shear/drift error → cumulative force versus relative displacement.
- Torsion error → centres/eccentricity on plan.
- Foundation-pressure error → contact-area/resultant diagram.
- Scheme overclaim → hard constraints then conditional metrics.
- Integrated failure → route to earliest failed dependency rather than smaller
  arithmetic.

Speed is optional telemetry, never mastery.

## 12. Answer checking and worked feedback

### Dimension-aware checking

- Parse forces, distributed actions, moments, stresses, movements, stiffnesses,
  and section properties as distinct dimensions.
- Normalize compatible SI units exactly.
- Use exact rational/decimal arithmetic where possible and deterministic high
  precision for trigonometry/eigenvalue fixtures.
- Apply tolerance only after stated rounding; no broad tolerance may accept a
  wrong sign, axis, exponent, or formula.

### Semantic checking

- Diagrams compare stable nodes/members, breakpoints, values, shapes, and signs.
- Free bodies compare body boundary and complete crossed-force provenance.
- Load paths compare graph edges; all valid parallel paths are accepted.
- Reactions/internal actions satisfy equilibrium.
- Scheme/layout choices pass all supplied constraints; multiple valid options
  remain valid.
- Audit answers identify earliest/root mismatch rather than any symptom.
- `Cannot determine` requires the correct missing model/property/criterion set.

### Worked feedback

Feedback order:

1. Name the model, axes/signs, supports/releases, and active load case.
2. Highlight source geometry and the continuous load path.
3. Isolate the body/member/system and show units.
4. Apply equilibrium, compatibility, or supplied response equation.
5. Check force/moment/energy/graph invariants independently.
6. Diagnose a known misconception.
7. State what the fictional result establishes and what it does not.

## 13. Rendering, interaction, accessibility, and localization

### Rendering

- Generate semantic SVG plans, sections, axonometrics, free bodies, displaced
  shapes, trusses, pressure blocks, and load/shear/moment diagrams.
- Keep load, reaction, internal action, deformation, and architectural geometry
  visually distinct by pattern/label as well as color.
- Display axes, sign glyph, units, supports/releases, load extents, grids, levels,
  and scale where relevant.
- Synchronize selection across building and analysis views.
- Diagram geometry comes from exact semantic results, not decorative drawing.
- Reject label/arrow collisions and indistinguishable choices.

### Interaction and accessibility

- Select semantic elements/regions with generous targets; motor precision is not
  graded.
- Provide keyboard/list/table/coordinate alternatives to all visual tasks.
- Every diagram has a structured element, node, force, support, breakpoint, or
  result table.
- Color is never the sole tension/compression, positive/negative, old/new, or
  stable/unstable cue.
- Pan/zoom does not alter answers.
- Screen readers receive expanded units and ordered load-path/free-body facts.
- Reduced-motion mode replaces animations with numbered static states.

### Localization

UI locale, structural profile, unit profile, and drawing convention are
independent. Translation handles decimal separators, force/moment notation,
clockwise/counterclockwise, grid/level terms, tension/compression, sagging/
hogging, storey/floor, and material/system vocabulary. Translation must not
silently introduce local code terminology or rules. Imperial support requires a
separate validated unit profile and is deferred.

## 14. Generator and implementation architecture

Recommended standalone modules:

```text
seededRng
dimensionedUnits
exactGeometry
structuralBuildingModel
constraintAndConnectivity
loadPathGraph
tributaryPartition
freeBodyBuilder
staticsOracle
beamDiagramOracle
trussOracle
sectionPropertyOracle
linearResponseOracle
rigidityRankOracle
foundationSimpleOracle
schemeConstraintSolver
revisionDiffer
provenanceGraph
faultInjector
semanticSvgRenderer
accessibleFactBuilder
semanticAnswerChecker
```

### Generation pipeline

1. Select family, misconception, representation, profile, and difficulty.
2. Construct valid geometry/model backward from friendly exact behavior.
3. Generate actions, supports, sections/properties, criteria, and stable IDs.
4. Solve with the primary graph/statics/response oracle.
5. Recompute through an independent equilibrium, integration, matrix, or geometry
   path.
6. Generate misconception distractors or one controlled root mutation.
7. Render building and analysis views from the same model.
8. Build structured accessible facts from the same source.
9. reject ambiguity, instability/indeterminacy outside target, clutter, weak
   choices, repeated signatures, or professional overclaim.

### Exactness

- Use integer millimetres, rational coordinates/actions, and exact centroids/
  polygon properties where possible.
- Use robust graph and constraint-rank analysis.
- Beam load/shear/moment functions are piecewise polynomials with exact
  breakpoints.
- Trusses have rational-friendly geometry early; matrix and method-of-joints
  solvers validate one another.
- Composite section integrals have polygon and component oracles.
- Linear response/eigenvalue solvers use deterministic high precision and
  regression fixtures.
- No cached target intermediate may be shared by “independent” validation.

### Standalone architecture

HTML/JS/CSS only; no backend, code/standards service, FEA package, CAD/BIM
importer, hazard database, or real-project analysis. All profiles, fictional
models, solvers, renderers, and translations are bundled and versioned.

## 15. Automated validation requirements

### Model, geometry, and topology

- Nodes/members/supports/loads have unique IDs and valid references.
- Member geometry is nonzero and connections coincide within exact model rules.
- Surface tributary regions partition loads without gaps/overlaps.
- Every non-excluded action reaches a ground reaction exactly once.
- Connection capabilities match releases/constraints.
- Stable/unstable/indeterminate classification is intentional and deterministic.

### Statics and diagrams

- Every free body is complete and contains only external/cut actions.
- Global/member/joint force and moment residuals are zero.
- Distributed resultants preserve force and moment.
- Reactions are unique for determinate fixtures.
- Shear jumps equal point actions; shear derivative matches distributed load.
- Moment jumps equal applied couples; moment derivative matches shear.
- Boundary values and extrema/zero crossings are correct.
- Truss member results satisfy every joint and global equilibrium.

### Sections and response

- Component and polygon centroids/I agree.
- Parallel-axis and rotation/unit conversions pass.
- `M/S` equals extreme `My/I`; `NL/AE` equals spring-energy method.
- Deflection formulas match beam-solver fixtures.
- Euler scaling and weak-axis classification pass.
- Fictional threshold language never becomes real adequacy.

### Building systems and lateral

- Plan/section/axonometric share one grid, level, member, and revision model.
- Span arrows terminate at valid supports.
- Transfers/openings/cantilevers preserve declared graph paths.
- Diaphragm distributions sum to applied shear and preserve moment when torsion
  is included.
- Storey shear accumulates correctly; base overturning moments reconcile.
- Drift differences telescope to roof displacement.
- Stability/alternate-path results match matrix rank/reachability.

### Materials, foundations, and decisions

- Property comparisons use only supplied fields.
- Connection force transfer matches DOFs.
- Foundation pressure integrates to supplied N/M.
- Spring systems satisfy equilibrium/compatibility.
- Scheme comparisons use common bases, hard constraints, and displayed
  weights/Pareto rules.
- Revision contributor sets and root dependencies are complete.
- Under-determined cases return the exact missing information.

### Mutation and seed tests

Mutation fixtures catch support, path, unit, tributary, resultant, reaction,
diagram, sign, truss, axis, I/S/E, deflection exponent, buckling conclusion,
phantom support, stale opening/transfer, diaphragm break, storey shear, torsion,
drift, material stereotype, connection, pressure, spring, scheme-basis, and
downstream-symptom errors.

For at least `10,000` deterministic seeds per family/level, and `25,000` for
tributary partitions, diagrams, trusses, section properties, stability, torsion,
revisions, and integrated audits:

- all placeholders/IDs resolve;
- model and solver invariants pass;
- primary/independent oracles agree;
- choices are unique after normalization;
- target difficulty/misconception remains visible;
- accessibility facts are sufficient but nonleaking;
- professional/safety wording passes;
- structural repetition control uses geometry/topology/load signature.

## 16. Coverage requirements

Across a long course:

- plans, sections, axonometrics, free bodies, diagrams, and tables all recur;
- surfaces, beams, columns, walls, trusses, frames, diaphragms, collectors,
  foundations, and connections appear;
- permanent/variable/environmental fictional cases remain separated and supplied
  combinations recur;
- pins, rollers, fixed, links, springs, and releases balance;
- force/line/area action, moment, stress, stiffness, displacement, I/S units vary;
- point, uniform, triangular, partial, and signed loads appear;
- direct/inverse/classification/construction/comparison/audit modes balance;
- gravity and both lateral directions recur;
- direct, transfer, cantilever, opening, torsion, and alternate paths appear;
- strength, stiffness, stability, serviceability, and robustness are contrasted;
- all declared misconceptions are sampled;
- `Cannot determine` and multiple-valid-scheme cases recur.

## 17. Recommended views and v1 priorities

### Views

1. **Learn** — structural vocabulary, idealizations, signs, and boundaries.
2. **Load Path** — building diagrams and free bodies.
3. **Loads & Reactions** — tributary geometry and takedown.
4. **Force Diagrams** — axial/shear/moment and trusses.
5. **Sections & Response** — I/S/stress/stiffness/deflection/stability.
6. **Framing Studio** — grids, transfers, cantilevers, and openings.
7. **Lateral Studio** — diaphragms, systems, shear, overturning, torsion, drift.
8. **Scheme & Coordination** — constraints, revisions, comparisons, audits.

### Recommended v1

Prioritize SI, 2D determinate statics, orthogonal building grids, one-way
tributary areas, simple reactions/takedown, point/UDL V/M diagrams, triangular
pin trusses, rectangular/composite section properties, supplied elastic
deflection/Euler formulas, span/load-path/framing continuity, simple diaphragm/
wall/braced-frame diagrams, uniform foundation pressure, and constraint/revision
audits. Use semantic SVG and structured alternatives from the first release.

Defer real codes/properties/actions, indeterminate nonlinear/FEA analysis,
material and connection design, complex foundations/geotechnics, dynamic
seismic/wind response, construction stages, temporary works, damage assessment,
and real CAD/BIM import.

## 18. Topic-level quality checklist

- [ ] Every screen/export states fictional exercise and non-design boundary.
- [ ] Model, axes/signs, supports/releases, loads, properties, criteria, and
      units are explicit.
- [ ] Standards are review anchors, never compliance claims.
- [ ] No real action, combination, member size, resistance, limit, or material
      property is inferred.
- [ ] All drawings/results derive from one semantic structural model.
- [ ] Load paths reach ground; actions are counted once.
- [ ] Free bodies, reactions, diagrams, trusses, and networks satisfy equilibrium.
- [ ] Strength, stiffness, stability, serviceability, and robustness stay distinct.
- [ ] Topological alternate path is not called adequate capacity.
- [ ] Fictional checks never become safety/compliance conclusions.
- [ ] Structural options are conditional, not recommendations.
- [ ] Multiple valid representations/schemes are accepted.
- [ ] Missing information yields `Cannot determine`.
- [ ] Every family has task, response/template, derivation, difficulty,
      misconception distractors/constraints, feedback, three examples, and
      validation.
- [ ] Independent oracles, mutations, accessibility, localization, and seed tests
      pass.
- [ ] The standalone app needs no backend or external service.

## 19. Stable identifiers and navigation

Recommended navigation:

```text
Load Paths & Equilibrium
Loads & Reactions
Internal Forces
Sections & Response
Framing Systems
Lateral Stability
Materials & Foundations
Schemes & Audit
```

Stable family IDs are the backticked identifiers above. Archived questions store
seed, family/model/revision IDs, profile/unit/sign/property/result-set versions,
assumptions, exact intermediate results, accepted answers, display policy, and
fault/insufficiency manifest. Semantic changes require new versions so prior
attempts remain reproducible.
