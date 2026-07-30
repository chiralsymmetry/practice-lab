# Design Reasoning — Dynamic Practice Specification

Status: implementation specification; fictional educational briefs and layouts
only, **not for architectural design, accessibility, code, permit, or construction**

Audience: program/constraint generator, graph and layout solver, bubble/plan
renderer, alternative evaluator, semantic answer checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual requirements meanings.

## 1. Topic overview

### Topic name

Design Reasoning

### Topic goal

Develop fluent, explicit reasoning from a fictional architectural brief to
spatial relationships, circulation structures, block/stack layouts, alternatives,
and revisions. The learner should become able to:

- distinguish requirements, preferences, prohibitions, assumptions, metrics,
  and missing information;
- convert a program into spaces, quantities, areas, users, activities, equipment
  zones, and typed relationships;
- read, construct, normalize, and audit adjacency matrices;
- translate between a relationship matrix, typed graph, bubble diagram, block
  diagram, and bounded schematic plan;
- distinguish adjacency, proximity, direct connection, access, visibility,
  acoustic/operational separation, and shared-resource relationships;
- identify incompatible or redundant constraints before drawing a solution;
- trace public, controlled, staff, service, delivery, and other explicitly
  defined circulation networks;
- find paths, compare route lengths/turns/decision points, and detect crossings,
  bottlenecks, dead ends, or broken links under supplied fictional criteria;
- reason about entrances, thresholds, sequences, privacy gradients, zones, and
  transitions;
- allocate program areas, shared areas, circulation, and support space across
  blocks and floors;
- coordinate horizontal adjacency with vertical stacking and core connections;
- respond to fictional site edges, access points, orientation, views, noise,
  daylight/solar, and topographic constraints without making real performance
  claims;
- construct more than one valid layout and recognize non-uniqueness;
- compare alternatives by hard constraints, weighted preferences, Pareto
  dominance, robustness scenarios, and clearly stated stakeholder priorities;
- make a minimal revision while tracing downstream consequences;
- explain why a design conclusion is underdetermined or value-dependent.

The app teaches structured design thinking, not taste. It never claims to
generate “good architecture” independently of a brief, users, context, and
professional judgment.

### Audience and prerequisites

The audience includes architecture/design students, architects practising
programming skills, and learners interested in spatial problem solving.

Prerequisites:

- reading simple plans, diagrams, tables, and graphs;
- areas, ratios, coordinates, and basic optimization language;
- sets, matrices, paths, and constraints at an intuitive level.

No drawing software is required. Learn mode introduces each diagram convention
and relationship type before scoring it.

### Relationship to sibling topics

- **Architectural Drawing & Spatial Reasoning** owns drawing types, symbols,
  projection, scale, and reading existing plans.
- **Architectural Geometry & Building Quantities** owns exact measured geometry.
- **Structures for Architects** and **Building Science** own their respective
  physical systems and metrics.
- **Navigation & Map Reasoning** owns geographic navigation.

This app owns program-to-layout synthesis, spatial graph reasoning, circulation
planning, alternative comparison, and iterative design logic.

### Standards, values, and design-quality boundary

There is no context-free optimum adjacency, circulation pattern, zoning scheme,
or plan. Requirements depend on users, activities, jurisdiction, culture,
operations, site, project phase, and stakeholder values. Every exercise uses a
complete versioned fictional brief.

Qualified review should use:

- [ISO 11863:2011](https://www.iso.org/standard/50917.html), which addresses
  identifying functional/user requirements, relative importance, capability
  thresholds, and comparison;
- [ISO 21542:2021](https://www.iso.org/standard/71860.html), whose scope includes
  access, circulation, normal exiting, and evacuation in the built environment,
  while noting that it is under systematic review in 2026;
- [ISO 16813:2024](https://www.iso.org/standard/83780.html), whose building-
  environment design principles emphasize collaborative evaluation against
  rational environmental criteria.

These are review and boundary anchors, not procedures copied into the app.
Initial profiles are fictional:

```text
pl-design-program-v1
pl-design-relations-v1
pl-design-bubble-v1
pl-design-circulation-v1
pl-design-zoning-v1
pl-design-block-stack-v1
pl-design-site-criteria-v1
pl-design-alternative-v1
```

No profile is an accessibility, fire/egress, planning, building-code, healthcare,
security, workplace, school, housing, or other professional standard. Any future
standards-aligned profile needs licensed source access, jurisdictional review,
user consultation, versioning, and its own validation corpus.

### Professional, inclusion, and safety boundary

Every exercise/export states:

```text
FICTIONAL DESIGN-REASONING EXERCISE — NOT FOR ACCESSIBILITY, EGRESS,
CODE, PERMIT, SECURITY, HEALTHCARE, OR CONSTRUCTION DECISIONS
```

The app must not:

- accept a real brief, site, plan, BIM model, user data, or operational workflow
  in v1;
- declare a real layout accessible, inclusive, safe, secure, compliant,
  functional, healthy, efficient, or suitable;
- size real corridors, doors, stairs, ramps, lifts, sanitary rooms, exits,
  queues, occupancy, travel distances, or emergency routes;
- recommend surveillance, defensible-space, crowd-control, healthcare
  clean/dirty, safeguarding, detention, or security layouts;
- infer users’ needs from disability, age, culture, gender, or other identity;
- replace engagement with users and stakeholders by a generated matrix;
- rank real designs or architects;
- present one cultural/organizational preference as universal design truth.

Accessibility appears only as explicit fictional graph/geometric constraints
and inclusive-process principles. Fire and emergency evacuation are excluded
from v1 circulation families.

### Semantic design model

```text
DesignReasoningModel {
  projectId
  briefRevisionId
  geometryRevisionId
  stakeholders[]
  userGroups[]
  activities[]
  programItems[]
  spaces[]
  relationshipRequirements[]
  zones[]
  entrances[]
  portals[]
  circulationNetworks[]
  levels[]
  blocks[]
  siteFeatures[]
  environmentalCriteria[]
  structuralServiceConstraints[]
  alternatives[]
  evaluations[]
  sourceViews[]
}
```

Stable IDs connect every brief clause, matrix cell, graph edge, bubble, room,
route, criterion, score, and revision consequence.

### Four distinct reasoning layers

```text
Brief layer
  spaces, users, activities, requirements, preferences, prohibitions

Relationship layer
  typed graph/matrix independent of exact geometry

Geometry layer
  areas, shapes, boundaries, levels, portals, routes, site placement

Evaluation layer
  hard constraints, metrics, weights, scenarios, Pareto/robustness results
```

A bubble graph does not prove that a geometric layout fits. A geometric contact
does not prove that the brief requested adjacency. A score does not override a
failed hard constraint. Feedback must identify which layer is being reasoned
about.

### Relationship ontology

Every relationship has direction, strength, status, and semantics:

```text
Relationship {
  fromId
  toId
  type: adjacent | near | separated | directAccess | reachable |
        visible | screened | sharedResource | sequenceBefore |
        sameZone | differentZone | verticalNear
  direction: symmetric | directed
  status: required | preferred | avoid | forbidden | neutral
  weight?
  maximumGraphDistance?
  maximumGeometricDistance?
  sourceClauseId
}
```

Core definitions:

- **adjacent**: boundaries share a positive-length segment under the geometry
  profile;
- **near**: graph/geometric distance meets a displayed threshold;
- **direct access**: a permitted portal connects spaces directly;
- **reachable**: a path exists through the named network;
- **visible**: a supplied line-of-sight model succeeds;
- **separated**: the explicit minimum graph/geometric/topological separation is
  met.

These relations are never treated as synonyms.

### Adjacency-matrix profile

The initial symmetric profile uses:

```text
+++ required direct adjacency
++  preferred direct adjacency
+   preferred near
0    neutral/no stated relationship
-   prefer separation
--  required separation
X    forbidden direct adjacency
```

Directed relationships, access, visibility, and sequence use separate layers or
arrowed matrices. The diagonal is `—`; symmetric matrices must mirror exactly.
Translation may change symbols only through a versioned legend.

### Bubble and layout model

Bubbles represent space/group nodes and typed relationship edges. Bubble size
is ordinal, area-proportional, or purely symbolic only as the legend states.
Overlap is not adjacency unless the profile defines a shared region. Edge
crossings are visual artifacts unless the task concerns graph planarity.

Bounded layout construction uses:

- orthogonal grid cells or simple polygons;
- one to three levels;
- program areas represented by integer cell counts;
- portals on shared boundaries;
- site edges and fixed/no-build cells;
- exact graph and polygon geometry;
- all equivalent rotations/reflections accepted unless orientation/site matters.

### Constraint and evaluation model

```text
Constraint {
  id
  kind: hard | preference | prohibition | metric | assumption | missing
  predicate
  scopeIds[]
  priority?
  weight?
  threshold?
  inclusivity?
  sourceClauseId
}

AlternativeEvaluation {
  alternativeId
  hardConstraintResults[]
  metricValues[]
  normalizedValues[]
  weightedScore?
  paretoStatus?
  scenarioResults[]
  unresolvedQuestions[]
}
```

Hard constraints are tested before preferences. Weights, normalizations, and
thresholds are displayed. No hidden aesthetic score or language-model judgment
is permitted.

### Scope

Included:

- program parsing, quantities, activities, user groups, areas, and priorities;
- typed adjacency/proximity/access/visibility/separation matrices and graphs;
- bubble diagrams and graph-to-bubble transformations;
- path, reachability, route length, turns, decision points, intersections,
  bottlenecks, loops, and network separation under fictional rules;
- entrances, thresholds, spatial sequences, public/private/service zoning;
- area budgets, efficiency arithmetic, block layouts, floor allocation, and
  vertical stacking;
- fictional site access, edge, orientation, view/noise/solar/daylight/wind and
  topographic criteria as supplied scores/constraints;
- layout construction, constraint satisfaction, alternative generation,
  weighted and Pareto comparison, scenario robustness;
- revisions, dependency tracing, omitted/conflicting requirements, stale
  diagrams, and integrated audits.

### Exclusions

Excluded:

- open-ended aesthetic criticism, style/history, composition quality, beauty,
  symbolism, phenomenology, or cultural interpretation;
- real accessibility, egress, fire, occupancy, security, healthcare, laboratory,
  school, workplace, residential, or planning/zoning compliance;
- actual environmental, structural, MEP, cost, carbon, code, or constructability
  calculations;
- crowd simulation, evacuation, agent-based behavior, queueing design, and
  transport capacity;
- real site/GIS/weather data and public engagement;
- photorealistic generation, CAD/BIM import/export, automatic floor-plan
  production, and claims of architectural optimization.

### Global answer conventions

- Ignore surrounding whitespace.
- Stable IDs, not translated names or screen positions, determine identity.
- Symmetric relationship sets are unordered; directed paths/sequences are
  ordered.
- Equivalent matrices/graphs/layouts are accepted after semantic normalization.
- Layouts compare exact cells/polygons, portals, zones, and relation satisfaction,
  not pixels.
- Rotations/reflections/renamings are accepted when site/orientation constraints
  do not distinguish them.
- Numeric area/distance/score answers accept compatible stated units and the
  declared rounding only.
- `Cannot determine` requires the correct missing requirement, metric, weight,
  geometry, network, or stakeholder decision.
- Free-text design explanations are not scored in v1; use structured reasons.

### Difficulty philosophy

Difficulty increases through:

- adding relationship types without conflating them;
- moving from reading to constructing matrices/graphs/layouts;
- weakening visual cues and coordinating several representations;
- introducing direction, multiple user networks, levels, and site orientation;
- adding interacting hard constraints and conflicting preferences;
- requiring nonunique alternatives or Pareto reasoning;
- tracing revisions and root contradictions;
- recognizing underdetermination/value dependence.

Difficulty must not increase through cramped diagrams, arbitrary room names,
hidden code knowledge, tiny cells, huge search spaces, aesthetic guessing, time
pressure, or treating minority user needs as “complications.”

### Shared generation and rejection rules

Every instance must:

- declare brief/profile/revision, relationship legend, units, orientation,
  network scope, hard constraints, preferences, and evaluation rule;
- derive brief, matrix, graph, bubbles, blocks, routes, and scores from one model;
- retain source-clause and dependency lineage;
- have a primary and independent graph/geometry/constraint oracle;
- support many structurally distinct seeds;
- generate distractors from named misconceptions;
- accept all valid alternatives/equivalences.

Reject an instance when:

- a requirement is ambiguous unless ambiguity is the task;
- a matrix/graph/layout representation disagrees unintentionally;
- a hard constraint set is unsatisfiable unless conflict diagnosis is the task;
- several layouts are valid but only one is accepted;
- diagram overlap/crossing accidentally changes semantic interpretation;
- route length depends on pixel measurement;
- weights/normalization decide an answer but are hidden;
- two choices are equivalent after graph/layout normalization;
- solving requires real code, safety, accessibility, or professional judgment;
- search complexity exceeds the bounded exact solver;
- a recent graph/constraint signature repeats with only renamed spaces.

## 2. Category: Briefs, programs, stakeholders, and constraints

### Category purpose

Turn controlled-language briefs into explicit program objects and testable
requirements before spatial synthesis begins.

### Learn

Separate what must happen from what is preferred, prohibited, assumed, or still
unknown. Record who needs what activity, space, quantity, area, equipment zone,
relationship, and schedule. A requirement should be traceable to its source and
testable; a preference may guide comparison but cannot invalidate an otherwise
valid scheme.

### Prerequisites

None beyond reading tables and simple plans.

### Category boundaries

This category extracts and reconciles requirements. Relationship diagrams begin
in Category 3; layouts are later.

### Common misconceptions

- Treating every sentence as a hard constraint.
- Promoting a stakeholder preference into universal need.
- Collapsing activity, user group, and room into one object.
- Treating “near” as “directly adjacent.”
- Ignoring quantities, schedules, or shared use.
- Filling an unstated value with convention.
- Hiding contradictory requirements inside one summary.

### Family `brief_clause_classify`

**Task/purpose.** Classify a controlled clause as hard requirement, preference,
prohibition, metric, assumption, or open question.

**Response/template.** Matching: `What kind of design statement is Clause {id}?`

**Derivation.** Query generated clause AST and modal/priority metadata.

**Difficulty.** L1 explicit must/prefer; L2 conditional clause; L3 distinguish
unstated assumption from requirement.

**Distractors/constraints.** preference→hard, metric→threshold, missing→neutral.

**Feedback.** Highlight the operative words and test implication.

**Examples.** (1) “must share a boundary”→hard (L1). (2) “prefer near unless
after-hours route...”→conditional preference (L2). (3) corridor width absent
→open question, not assumed value (L3).

**Validation.** clause AST maps uniquely to type.

### Family `program_object_extract`

**Task/purpose.** Extract spaces, activities, users, quantities, and attributes
from a controlled brief.

**Response/template.** structured table/matching.

**Derivation.** Resolve noun/entity templates and references to stable IDs.

**Difficulty.** L1 one space/activity; L2 shared space and several user groups;
L3 activity needs zones but not a separate room.

**Distractors/constraints.** duplicate synonyms, activity turned into room,
shared use counted twice.

**Feedback.** Link every object to source clause.

**Examples.** (1) two studios of 40 m² (L1). (2) shared meeting room for A/B
(L2). (3) delivery activity requires loading zone, not enclosed room (L3).

**Validation.** referential integrity and quantity totals.

### Family `program_quantity_area_budget`

**Task/purpose.** Calculate required counts/net program area or find a missing
area from a supplied budget.

**Response/template.** table and total `m²`.

**Derivation.** Multiply quantities by per-item areas; group shared/exclusive
spaces exactly once.

**Difficulty.** L1 direct sum; L2 shared/multiuse; L3 min/max range and missing
value.

**Distractors/constraints.** count shared room per group, include preference as
required, confuse net/gross.

**Feedback.** itemized area ledger.

**Examples.** (1) 3×20+40=100 m² (L1). (2) one shared 30 m² room, not two
(L2). (3) solve missing area within 250 m² net cap (L3).

**Validation.** exact program AST fold and unit typing.

### Family `activity_space_match`

**Task/purpose.** Match controlled activities/user groups to spaces or determine
that several mappings are valid.

**Response/template.** matching/multiple valid set.

**Derivation.** Evaluate required attributes/capacity/schedule predicates.

**Difficulty.** L1 unique attributes; L2 shared compatible activities; L3
conflicting schedules or underdetermined mapping.

**Distractors/constraints.** name similarity, capacity ignored, one-to-one
assumed.

**Feedback.** attribute compatibility matrix.

**Examples.** (1) wet activity→space with fictional wet-zone attribute (L1).
(2) two nonoverlapping activities share room (L2). (3) identical candidate
capabilities→both valid (L3).

**Validation.** bipartite matching/constraint solver.

### Family `requirement_traceability`

**Task/purpose.** Trace a space/relationship/metric back to its source clause and
stakeholder.

**Response/template.** ordered lineage or matching.

**Derivation.** Follow provenance DAG.

**Difficulty.** L1 direct clause; L2 derived quantity/relationship; L3 one
requirement has several sources with differing priority.

**Distractors/constraints.** nearby clause, downstream layout as source, stale
revision.

**Feedback.** illuminate provenance path.

**Examples.** (1) S3 area→Clause B4 (L1). (2) zone separation derived from two
activity clauses (L2). (3) revised stakeholder priority (L3).

**Validation.** acyclic connected provenance and revision consistency.

### Family `requirement_conflict_detect`

**Task/purpose.** Identify a minimal contradictory set of hard constraints.

**Response/template.** clause-ID set plus conflict type.

**Derivation.** Exact constraint solver and deletion-based minimal unsatisfiable
subset for bounded instances.

**Difficulty.** L1 direct adjacent+forbidden; L2 area/capacity; L3 graph/level/
site conflict across clauses.

**Distractors/constraints.** include preferences in contradiction, nonminimal
superset, declare conflict without evidence.

**Feedback.** show why each clause participates and relaxing one restores
feasibility.

**Examples.** (1) A–B required and forbidden adjacent (L1). (2) required areas
exceed hard floor capacity (L2). (3) same-level and separate-level constraints
(L3).

**Validation.** subset unsatisfiable and every one-clause removal satisfiable.

### Family `requirement_redundancy_implication`

**Task/purpose.** Identify a redundant requirement implied by stronger explicit
constraints.

**Response/template.** clause selection and implication chain.

**Derivation.** Compare solver solution sets with/without candidate constraint.

**Difficulty.** L1 direct duplicate; L2 required adjacency implies nearness;
L3 graph path/zone constraints imply separation.

**Distractors/constraints.** merely similar clause, preference, converse
implication.

**Feedback.** show solution-set unchanged and implication.

**Examples.** (1) duplicate area minimum (L1). (2) adjacency→graph distance 1
(L2). (3) required different zones plus zone barrier implies no direct access
(L3).

**Validation.** exact solution-set/equivalence check in bounded domain.

### Family `stakeholder_priority_reconcile`

**Task/purpose.** Apply a supplied priority/decision rule to stakeholder
preferences without converting them into facts.

**Response/template.** resolved ordering or unresolved decision.

**Derivation.** Evaluate displayed precedence/weight/consensus rule.

**Difficulty.** L1 explicit priority; L2 weighted preferences; L3 tie or missing
authority→unresolved.

**Distractors/constraints.** majority assumed, architect preference privileged,
hard requirement traded away.

**Feedback.** separate requirements from value decision.

**Examples.** (1) hard requirement overrides preference (L1). (2) supplied
weights select criterion (L2). (3) equal conflicting priorities→requires
decision, not computed answer (L3).

**Validation.** policy AST and tie handling.

### Family `brief_program_audit`

**Task/purpose.** Diagnose one classification, quantity, entity, provenance,
conflict, redundancy, or priority error.

**Response/template.** root clause/object and correction.

**Derivation.** Compare brief AST, program registry, constraints, and provenance.

**Difficulty.** L1 count/type; L2 shared area/provenance; L3 preference promoted
to hard constraint makes program falsely infeasible.

**Distractors/constraints.** Exactly one root mutation.

**Feedback.** trace clause→program/constraint→effect.

**Examples.** (1) two rooms parsed as one (L1). (2) shared room counted twice
(L2). (3) “prefer separate” encoded “must separate” (L3).

**Validation.** fault manifest and independent AST/solver.

### Cross-family progression

Clause classification precedes object extraction and area budgets. Activity
matching then links use to spaces. Traceability precedes conflict/redundancy
reasoning. Stakeholder priority remains a separate value layer. Audits close the
category.

## 3. Category: Adjacency matrices, relationship graphs, and bubble diagrams

### Category purpose

Build exact fluency between textual relationships, matrices, typed graphs, and
diagrammatic bubbles without treating them as geometric plans.

### Learn

An adjacency matrix is a compact relationship table. Symmetric relations mirror
across the diagonal; directed access/sequence does not. A bubble diagram shows
nodes and relationship edges, not walls, exact distances, or guaranteed fit.
Keep different edge types in separate layers or encode them with a visible
legend.

### Prerequisites

Category 2; simple matrices and graphs.

### Category boundaries

This category owns relationship representations. Exact layouts are Categories
6/8; circulation paths are Category 4.

### Common misconceptions

- Reading `0` as forbidden rather than unstated/neutral.
- Failing to mirror a symmetric relation.
- Mirroring a directed access/sequence relation.
- Treating adjacency, nearness, and connectivity as identical.
- Inferring geometric distance from bubble placement.
- Treating crossed edges as connected.
- Assuming bubble area is quantitative without a legend.

### Family `matrix_cell_interpret`

**Task/purpose.** Interpret one matrix cell under the displayed legend and
direction convention.

**Response/template.** structured relation fields.

**Derivation.** Lookup matrix layer `(row,column)` and legend mapping.

**Difficulty.** L1 symmetric adjacency; L2 directed access; L3 multilayer cell.

**Distractors/constraints.** reverse direction, zero=forbidden, preference=hard.

**Feedback.** read row→column and expand symbol.

**Examples.** (1) `+++` A/B→required adjacency (L1). (2) arrow A→B direct
access only (L2). (3) near preferred but visibility forbidden (L3).

**Validation.** cell and relationship registry round-trip.

### Family `relationship_to_matrix`

**Task/purpose.** Fill matrix cell(s) from controlled relationship clauses.

**Response/template.** cell selection/value entry.

**Derivation.** Encode type/status/direction using active legend.

**Difficulty.** L1 one symmetric relation; L2 directed pair; L3 several layers
or conditional relationship.

**Distractors/constraints.** wrong symbol strength, missing mirror, extra mirror.

**Feedback.** clause→typed edge→cell(s).

**Examples.** (1) A/B must adjacent→two `+++` cells (L1). (2) staff access A→B
only (L2). (3) adjacent preferred, visible avoided (L3).

**Validation.** decoded matrix equals source edge set.

### Family `matrix_complete_symmetric`

**Task/purpose.** Complete/audit missing mirrored cells and diagonal under a
symmetric relation layer.

**Response/template.** cell values or incorrect-cell set.

**Derivation.** Enforce `Mij=Mji` and diagonal `—`.

**Difficulty.** L1 one missing mirror; L2 several strengths; L3 mixed symmetric
and directed layers requiring only one to mirror.

**Distractors/constraints.** fill diagonal, mirror arrows, normalize `0` to X.

**Feedback.** fold matrix across diagonal.

**Examples.** (1) A/B `++` mirrors B/A (L1). (2) complete 5×5 table (L2).
(3) adjacency mirrors while sequence does not (L3).

**Validation.** symmetry and diagonal invariants.

### Family `matrix_to_typed_graph`

**Task/purpose.** Construct/select graph nodes and typed edges equivalent to a
matrix.

**Response/template.** semantic edge placement/matching.

**Derivation.** Decode every nonneutral cell, deduplicate symmetric pairs, retain
directed pairs.

**Difficulty.** L1 one edge type; L2 strengths; L3 multilayer/directed graph.

**Distractors/constraints.** duplicate symmetric edge, neutral edge, direction
lost.

**Feedback.** highlight corresponding cells for each edge.

**Examples.** (1) 4-node adjacency graph (L1). (2) solid preferred/double
required edges (L2). (3) overlay access arrows (L3).

**Validation.** graph→matrix round-trip exact.

### Family `graph_to_matrix`

**Task/purpose.** Reconstruct a matrix layer from a typed bubble/relationship
graph.

**Response/template.** full/partial matrix.

**Derivation.** Encode graph edges according to legend/direction.

**Difficulty.** L1 sparse symmetric graph; L2 strengths; L3 filter one layer
from cluttered graph.

**Distractors/constraints.** edge crossing creates cell, geometric proximity
creates edge, omit isolated nodes.

**Feedback.** enumerate node pairs systematically.

**Examples.** (1) path A–B–C matrix (L1). (2) required/preferred strengths
(L2). (3) access-only layer extracted (L3).

**Validation.** matrix→graph isomorphism preserving labels/types.

### Family `bubble_edge_meaning`

**Task/purpose.** Identify edge type/status/direction or explain what a bubble
placement does not establish.

**Response/template.** edge/statement choice.

**Derivation.** Read legend and semantic graph, not coordinates.

**Difficulty.** L1 solid/dashed edge; L2 arrow/strength; L3 bubbles overlap/near
without semantic edge.

**Distractors/constraints.** distance/overlap inference, crossing=connection.

**Feedback.** separate drawing placement from graph data.

**Examples.** (1) double line→required adjacency (L1). (2) arrow A→B access
(L2). (3) close bubbles with no edge→no stated relationship (L3).

**Validation.** accessible edge list matches render.

### Family `bubble_area_scale`

**Task/purpose.** Interpret or construct ordinal/area-proportional/symbolic
bubble sizes under a stated legend.

**Response/template.** ranking, area ratio, or bubble selection.

**Derivation.** For area-scaled profile, rendered circle area proportional to
program area, so radius proportional to square root; ordinal uses bins.

**Difficulty.** L1 ranking; L2 area/radius distinction; L3 mixed shared group
bubbles.

**Distractors/constraints.** radius proportional to area, infer size under
symbolic profile.

**Feedback.** state size semantics explicitly.

**Examples.** (1) large/medium/small ordinal (L1). (2) 4× area→2× radius (L2).
(3) symbolic bubble→cannot infer area (L3).

**Validation.** render radius/profile and accessible area facts.

### Family `relationship_graph_metrics`

**Task/purpose.** Calculate degree, graph distance, centrality proxy, components,
or cut node for a small typed graph.

**Response/template.** number/node set/path.

**Derivation.** Standard exact graph algorithms filtered by relation layer.

**Difficulty.** L1 degree/distance; L2 components/cut node; L3 weighted/directed
layer.

**Distractors/constraints.** count crossing edges, use geometric distance, mix
layers.

**Feedback.** show traversal/counted edges.

**Examples.** (1) B degree 3 (L1). (2) C is articulation node (L2). (3)
shortest weighted directed relation path (L3).

**Validation.** independent BFS/Dijkstra/connectivity algorithms.

### Family `relationship_graph_realizability`

**Task/purpose.** Decide whether a small required-adjacency graph is realizable
under a bounded cell/layout profile or identify the blocking constraint.

**Response/template.** yes with construction, or no with certificate.

**Derivation.** Exhaustive/constraint-programming layout search over bounded
grid/polygons.

**Difficulty.** L1 simple chain/star; L2 area cells/site boundary; L3 required
and forbidden contacts.

**Distractors/constraints.** graph drawing mistaken for floor-plan realization;
solver domain small enough for proof.

**Feedback.** show valid contact layout or exhausted conflict certificate.

**Examples.** (1) 4-space path realizable (L1). (2) oversized central bubble
cannot touch all within fixed grid (L2). (3) adjacency/separation conflict (L3).

**Validation.** constructive solution or independently checked unsat proof.

### Family `matrix_graph_bubble_audit`

**Task/purpose.** Find one wrong/missing cell, edge, direction, strength, node,
size legend, or representation claim.

**Response/template.** root representation and correction.

**Derivation.** Normalize each representation to typed relation set and compare.

**Difficulty.** L1 cell/edge; L2 direction/layer; L3 geometry-like bubble
placement falsely encoded as relation.

**Distractors/constraints.** Exactly one root mutation.

**Feedback.** trace clause→matrix→graph→bubble.

**Examples.** (1) symmetric mirror missing (L1). (2) access arrow reversed (L2).
(3) close bubbles given adjacency edge absent from brief (L3).

**Validation.** fault manifest and round-trip normalization.

### Cross-family progression

Cell interpretation precedes encoding and symmetry. Matrix↔graph transformations
then establish equivalence. Bubble semantics/scale prevent overreading.
Metrics and realizability add reasoning beyond transcription. Audits coordinate
all relationship representations.

## 4. Category: Circulation networks, paths, crossings, and wayfinding proxies

### Category purpose

Reason about movement as typed networks serving stated users and activities,
without substituting fictional graph metrics for real accessibility or egress.

### Learn

A route follows permitted portals and circulation segments. Different user
groups may have different networks. Shortest distance, fewest turns, fewest
decision points, separation, redundancy, and visibility are different criteria.
A plan can be connected yet provide a poor result under a supplied preference.

### Prerequisites

Category 3; path and portal basics.

### Category boundaries

No emergency evacuation, occupancy/capacity, real accessibility, security,
crowd, or queue design.

### Common misconceptions

- Walking through shared walls without portals.
- Treating adjacency as access.
- Mixing public/staff/service permissions.
- Assuming geometric straight line is a valid route.
- Equating shortest route with fewest turns/decisions.
- Calling every route intersection a conflict.
- Treating redundancy as two routes that share one critical edge.

### Family `network_reachability`

**Task/purpose.** Determine whether destination is reachable by a named user/
network and provide a path.

**Response/template.** yes/no plus ordered node/portal IDs.

**Derivation.** Filter graph by user/time permissions; BFS reachability.

**Difficulty.** L1 one network; L2 permissions; L3 scheduled portal state.

**Distractors/constraints.** adjacency-only edge, wrong user, locked interval.

**Feedback.** highlight allowed traversal frontier.

**Examples.** (1) Lobby→Gallery through P1 (L1). (2) service route excludes
public stair (L2). (3) after-hours portal closes path (L3).

**Validation.** path edges permitted and endpoints exact.

### Family `route_shortest_weighted`

**Task/purpose.** Find shortest route by displayed distance/time/cost weights.

**Response/template.** ordered path and total.

**Derivation.** Dijkstra on nonnegative filtered network; BFS for equal weights.

**Difficulty.** L1 fewest edges; L2 distances; L3 user-specific weights.

**Distractors/constraints.** visually shortest, fewest turns, forbidden shortcut.

**Feedback.** compare candidate cumulative weights.

**Examples.** (1) A–B–D two edges (L1). (2) longer-looking path has lower metric
(L2). (3) mobility-profile fictional weights change route (L3).

**Validation.** independent path enumeration for bounded graph.

### Family `route_turn_decision_count`

**Task/purpose.** Count turns or decision nodes and compare routes under that
criterion.

**Response/template.** count/ranking/path.

**Derivation.** Turns from oriented segment vectors; decisions from filtered
out-degree under displayed definition.

**Difficulty.** L1 turns; L2 decision points; L3 lexicographic distance then
decisions.

**Distractors/constraints.** count doors as turns, degree in unfiltered graph,
assume shortest distance.

**Feedback.** number direction changes/branch choices.

**Examples.** (1) two right-angle changes (L1). (2) one branch node (L2). (3)
equal-distance routes compared by decisions (L3).

**Validation.** geometric vectors and graph degree oracle.

### Family `circulation_crossing_conflict`

**Task/purpose.** Identify intersections between named flows that violate a
supplied separation rule.

**Response/template.** segment/node pairs and conflict type.

**Derivation.** Compare route edge/node occupancy and time schedules against
explicit incompatibility predicate.

**Difficulty.** L1 simultaneous shared node; L2 crossing without shared portal;
L3 schedules eliminate/create conflict.

**Distractors/constraints.** all intersections called conflict, geometric edge
crossing at different levels, compatible flows.

**Feedback.** overlay flow/time/level.

**Examples.** (1) delivery/public share forbidden node (L1). (2) routes cross on
different floors→no conflict (L2). (3) time-separated flows valid (L3).

**Validation.** space-time network intersection.

### Family `route_bottleneck_proxy`

**Task/purpose.** Identify cut edge/node or highest supplied flow-to-capacity
ratio in a fictional network.

**Response/template.** edge/node and metric.

**Derivation.** articulation/bridge algorithms or `flow/capacity` from supplied
values.

**Difficulty.** L1 only bridge; L2 ratios; L3 multiple scenarios.

**Distractors/constraints.** narrow drawing line, highest flow alone, real crowd
claim.

**Feedback.** remove edge/show disconnected sets or ratio table.

**Examples.** (1) P3 is only link (L1). (2) 80/100 controls over 60/120 (L2).
(3) scenario-dependent proxy (L3).

**Validation.** connectivity/ratio oracle; fictional wording.

### Family `route_redundancy_disjoint`

**Task/purpose.** Determine whether two edge/node-disjoint paths exist under a
displayed redundancy proxy.

**Response/template.** two paths or separating cut set.

**Derivation.** max-flow/Menger-style bounded graph check with unit capacities.

**Difficulty.** L1 obvious loop; L2 edge-disjoint; L3 node-disjoint and user
permissions.

**Distractors/constraints.** paths sharing critical edge/node, reverse-only
directed path.

**Feedback.** color independent paths or minimal cut.

**Examples.** (1) loop gives two edge paths (L1). (2) shared portal defeats
node-disjointness (L2). (3) filtered staff network (L3).

**Validation.** max-flow and explicit path intersection.

### Family `entrance_distribution_access`

**Task/purpose.** Assign destinations/user groups to entrances under supplied
proximity, permission, and separation constraints.

**Response/template.** matching and routes.

**Derivation.** bipartite/constraint matching plus network paths.

**Difficulty.** L1 nearest valid entrance; L2 several users; L3 capacity proxy
and conflicting preferences.

**Distractors/constraints.** geometric nearest but forbidden, all users one
entrance, infer security rule.

**Feedback.** entrance eligibility and path table.

**Examples.** (1) visitors use E1 (L1). (2) delivery/public separated (L2).
(3) two valid allocations under cap (L3).

**Validation.** matching and path permissions.

### Family `circulation_network_construct`

**Task/purpose.** Add minimum portals/segments to satisfy supplied reachability,
separation, and route constraints.

**Response/template.** semantic edge placement.

**Derivation.** bounded exhaustive/constraint search minimizing stated cost.

**Difficulty.** L1 connect two components; L2 preserve separate networks; L3
minimum edges with redundancy.

**Distractors/constraints.** wall crossing without portal, merge forbidden
flows, nonminimal answer when minimum asked.

**Feedback.** before/after components and satisfied constraints.

**Examples.** (1) add one portal (L1). (2) separate public/service links (L2).
(3) two disjoint routes with minimum additions (L3).

**Validation.** graph constraints and optimality certificate.

### Family `circulation_audit`

**Task/purpose.** Diagnose one permission, portal, route, turn, conflict,
bottleneck, redundancy, or entrance error.

**Response/template.** root network fact and correction.

**Derivation.** Compare topology, geometry, schedules, and metric definitions.

**Difficulty.** L1 route through wall; L2 wrong network/metric; L3 two routes
claimed redundant but share cut node.

**Distractors/constraints.** Exactly one root mutation.

**Feedback.** first invalid edge/criterion.

**Examples.** (1) path crosses no portal (L1). (2) fewest-turn answer labeled
shortest-distance (L2). (3) redundancy false at shared stair node (L3).

**Validation.** fault manifest and independent path algorithms.

### Cross-family progression

Reachability precedes shortest paths and route-form metrics. Crossing,
bottleneck, and redundancy add network comparisons. Entrance assignment and
construction synthesize paths. Audits close the category.

## 5. Category: Zoning, thresholds, privacy, and spatial sequence

### Category purpose

Organize spaces into explicitly defined domains and reason about transitions,
separation, visibility, and experiential/operational sequences.

### Learn

Zones are classifications with rules, not colors on a plan. A transition may
cross a threshold, pass through an intermediate space, or change access level.
Public/private, quiet/active, day/night, clean/support, or similar labels are
fictional brief attributes; none is universal.

### Prerequisites

Categories 2–4.

### Category boundaries

No real safeguarding, healthcare infection control, security, or cultural
privacy prescription.

### Common misconceptions

- Treating all spaces in one zone as mutually adjacent.
- Assuming “private” means inaccessible.
- Ignoring intermediate/threshold spaces.
- Conflating visibility, access, and proximity.
- Treating one zone ordering as universal.
- Allowing routes to oscillate through zones despite monotonic sequence rule.

### Family `zone_membership_assign`

**Task/purpose.** Assign spaces to supplied zone categories from attributes and
hard constraints.

**Response/template.** matching/multiple valid partitions.

**Derivation.** constraint filtering/partitioning.

**Difficulty.** L1 explicit tag; L2 attribute rules; L3 ambiguous multi-zone
space accepted.

**Distractors/constraints.** adjacency implies same zone, names/stereotypes.

**Feedback.** show rule per assignment.

**Examples.** (1) Lobby→public (L1). (2) staff-only activity→controlled under
brief (L2). (3) shared room valid in two zones (L3).

**Validation.** partition/overlap policy.

### Family `zone_boundary_transition`

**Task/purpose.** Identify portals/threshold spaces where a route changes zones.

**Response/template.** ordered transition IDs.

**Derivation.** Compare zone labels across consecutive path edges/nodes.

**Difficulty.** L1 one boundary; L2 threshold node; L3 overlapping zone
membership/directed transition.

**Distractors/constraints.** every door, color boundary without route crossing.

**Feedback.** mark before/threshold/after.

**Examples.** (1) public→controlled at P4 (L1). (2) vestibule mediates exterior/
interior (L2). (3) shared-zone node delays transition (L3).

**Validation.** path-zone sequence.

### Family `privacy_gradient_sequence`

**Task/purpose.** Test/order a route against a supplied monotonic or allowed
zone sequence.

**Response/template.** ordered spaces or violation point.

**Derivation.** Map path to ordinal states and test transition automaton.

**Difficulty.** L1 public→private; L2 allowed intermediate; L3 branching user-
specific automata.

**Distractors/constraints.** universal gradient, geometric order, omit return
transition.

**Feedback.** state-machine trace.

**Examples.** (1) public→controlled→private valid (L1). (2) private→public→
private violates monotonic brief (L2). (3) staff automaton differs (L3).

**Validation.** automaton acceptance.

### Family `separation_buffer_constraint`

**Task/purpose.** Determine whether required separation/buffer spaces or graph
distance are satisfied.

**Response/template.** yes/no, distance, or missing buffer.

**Derivation.** graph/geometric distance and intervening-space type predicates.

**Difficulty.** L1 nonadjacent; L2 graph distance≥2; L3 named buffer zone.

**Distractors/constraints.** far on drawing but adjacent via portal, neutral
space counted as required buffer.

**Feedback.** shortest relation/path and intervening nodes.

**Examples.** (1) A/B share wall→separation fails (L1). (2) distance 3 satisfies
≥2 (L2). (3) support zone required between active/quiet (L3).

**Validation.** geometry/graph distance and type checks.

### Family `visibility_screening_relation`

**Task/purpose.** Test a supplied line-of-sight/screening requirement between
spaces, entrances, or route points.

**Response/template.** visible/screened plus blocking element IDs.

**Derivation.** exact ray/visibility graph under simple opaque-boundary model.

**Difficulty.** L1 direct opening; L2 offset threshold; L3 visibility from route
segment rather than point.

**Distractors/constraints.** access implies visibility, adjacency, page line.

**Feedback.** draw ray and first blocker.

**Examples.** (1) reception sees entry (L1). (2) offset wall screens room (L2).
(3) visible only after decision point (L3).

**Validation.** exact ray intersection/visibility sampling profile.

### Family `shared_resource_catchment`

**Task/purpose.** Assign shared resource to spaces/groups under stated graph-
distance, capacity, and access rules.

**Response/template.** assignment/coverage set.

**Derivation.** capacitated facility-location/matching on bounded graph.

**Difficulty.** L1 one resource; L2 several groups/capacity; L3 minimum resources
or multiple valid placements.

**Distractors/constraints.** Euclidean rather than route distance, inaccessible
resource, capacity ignored.

**Feedback.** catchment paths and capacity ledger.

**Examples.** (1) resource covers nodes within distance 2 (L1). (2) split groups
across two resources (L2). (3) two optimal placements accepted (L3).

**Validation.** exact bounded solver.

### Family `zone_layout_construct`

**Task/purpose.** Group/rearrange bubbles or cells to satisfy zone, boundary,
transition, and separation constraints.

**Response/template.** semantic placement/partition.

**Derivation.** constraint solver over bounded graph/grid.

**Difficulty.** L1 two zones; L2 threshold space; L3 several valid partitions
and adjacency constraints.

**Distractors/constraints.** color-only zone with invalid paths, overlaps.

**Feedback.** constraint checklist and zone-transition graph.

**Examples.** (1) cluster public spaces (L1). (2) controlled threshold between
zones (L2). (3) valid alternative partitions (L3).

**Validation.** every hard predicate and all equivalences.

### Family `zoning_sequence_audit`

**Task/purpose.** Diagnose one membership, transition, gradient, separation,
visibility, resource, or partition error.

**Response/template.** root relation and correction.

**Derivation.** Compare zone predicates, route automata, distances, and
visibility.

**Difficulty.** L1 tag/transition; L2 buffer/visibility; L3 one shared node
causes several apparent sequence violations.

**Distractors/constraints.** Exactly one root mutation.

**Feedback.** trace first violated predicate.

**Examples.** (1) private room colored public (L1). (2) missing threshold (L2).
(3) shared lobby wrongly treated as exclusive zone (L3).

**Validation.** fault manifest and independent predicates.

### Cross-family progression

Membership precedes boundaries and ordered sequences. Separation and visibility
remain separate relationships. Shared resources introduce coverage. Construction
and audits integrate zones without asserting universal social meaning.

## 6. Category: Area allocation, blocking, levels, and stacking

### Category purpose

Translate program quantities into bounded blocks/floors and coordinate area,
shape, adjacency, circulation allowance, and vertical relationships.

### Learn

Net program area, shared/support area, circulation allowance, and gross area are
different layers. A floor capacity is not merely a total: shapes and fixed
zones must fit. Stacking adds vertical-nearness, same-level, separate-level, and
core-connectivity constraints.

### Prerequisites

Categories 2–5; area arithmetic and grids.

### Category boundaries

Building Quantities owns professional measurement bases. Here all area/grossing
rules are fictional and displayed.

### Common misconceptions

- Applying a grossing factor as an added number rather than percentage/factor.
- Counting shared support per department.
- Treating area-total feasibility as proof of geometric fit.
- Ignoring floor capacities/fixed cells.
- Confusing vertically aligned with vertically connected.
- Treating nearest floor number as shortest vertical route.

### Family `net_gross_area_layers`

**Task/purpose.** Compute/reconcile program net, shared/support, circulation, and
fictional gross area.

**Response/template.** named area fields.

**Derivation.** Apply displayed inclusion/factor expression in declared order.

**Difficulty.** L1 sum; L2 percentage; L3 several groups/shared layers.

**Distractors/constraints.** add percentage numeral, double shared area, hide
measurement basis.

**Feedback.** layered area ledger.

**Examples.** (1) net 100+support20=120 m² (L1). (2) 15% on stated base (L2).
(3) reconcile departmental/shared/circulation (L3).

**Validation.** expression AST and identities.

### Family `floor_capacity_allocate`

**Task/purpose.** Allocate program blocks to floors within capacities and fixed
assignment constraints.

**Response/template.** floor assignment/table.

**Derivation.** bounded bin-packing/constraint solver.

**Difficulty.** L1 exact fit; L2 fixed spaces; L3 min/max groups and multiple
solutions.

**Distractors/constraints.** exceed capacity, split indivisible space, ignore
fixed floor.

**Feedback.** capacity bar per floor.

**Examples.** (1) 60+40 on 100 floor (L1). (2) lobby fixed ground (L2). (3)
all feasible allocations accepted (L3).

**Validation.** capacity and assignment predicates.

### Family `block_cell_fit`

**Task/purpose.** Place area-cell blocks into a bounded footprint with
no-build/fixed cells.

**Response/template.** grid placement.

**Derivation.** exact polyomino/cell occupancy and constraint search.

**Difficulty.** L1 rectangles; L2 fixed obstacles; L3 several shapes and
adjacency.

**Distractors/constraints.** overlap, out-of-bounds, area fits but shape cannot.

**Feedback.** occupied-cell and unused-area map.

**Examples.** (1) two rectangles fit grid (L1). (2) place around core (L2).
(3) total area sufficient but no geometric tiling (L3).

**Validation.** cell occupancy and exhaustive feasibility.

### Family `block_adjacency_contact`

**Task/purpose.** Test/construct required and forbidden shared-boundary contacts.

**Response/template.** contact lengths/relations or placement.

**Derivation.** enumerate positive-length shared cell/polygon edges.

**Difficulty.** L1 one adjacency; L2 several; L3 minimum contact length and
forbidden contacts.

**Distractors/constraints.** corner touch, one-cell gap, portal mistaken for
boundary.

**Feedback.** highlight exact contact segments.

**Examples.** (1) shared edge satisfies adjacency (L1). (2) corner touch fails
(L2). (3) contact≥2 cells (L3).

**Validation.** exact boundary intersection.

### Family `stack_same_separate_level`

**Task/purpose.** Allocate spaces to levels under same-level, different-level,
and fixed-level constraints.

**Response/template.** level assignment.

**Derivation.** graph coloring/equality/inequality constraints plus capacity.

**Difficulty.** L1 fixed pair; L2 several groups; L3 conflicts/alternative
colorings.

**Distractors/constraints.** adjacent floor satisfies same-level, ignore capacity.

**Feedback.** constraint graph and level colors.

**Examples.** (1) A/B same level (L1). (2) service separate from public (L2).
(3) all valid stackings accepted (L3).

**Validation.** exact assignment solver.

### Family `vertical_nearness_core_distance`

**Task/purpose.** Evaluate vertical-nearness/direct-stack or route distance via
named cores.

**Response/template.** relation, route, or distance.

**Derivation.** compare plan overlap and multilevel circulation graph.

**Difficulty.** L1 vertically aligned; L2 nearest core route; L3 alignment and
route criteria conflict.

**Distractors/constraints.** same x/y implies access, floor difference only.

**Feedback.** section plus route graph.

**Examples.** (1) A directly above B (L1). (2) route through C1 is shorter (L2).
(3) aligned spaces use inaccessible core→route fails (L3).

**Validation.** 3D geometry and graph algorithms.

### Family `stacking_diagram_from_program`

**Task/purpose.** Construct/select a stacking diagram satisfying area, level,
zone, vertical relation, and entrance constraints.

**Response/template.** block placement by level.

**Derivation.** bounded 3D constraint solver.

**Difficulty.** L1 two levels; L2 zones/capacities; L3 vertical relation plus
site edge and multiple valid results.

**Distractors/constraints.** area-only stack, missing core/path, hidden overlap.

**Feedback.** per-level checklist and section links.

**Examples.** (1) public ground/private upper (brief-defined) (L1). (2) shared
space between groups (L2). (3) several valid stacks (L3).

**Validation.** all geometry/graph constraints.

### Family `efficiency_shape_compare`

**Task/purpose.** Compare fictional blocks by stated net:gross, perimeter,
compactness, circulation, or fit metrics.

**Response/template.** metric table/ranking/Pareto set.

**Derivation.** compute displayed geometric ratios only.

**Difficulty.** L1 one metric; L2 conflicting metrics; L3 Pareto comparison.

**Distractors/constraints.** universal efficiency, mix measurement bases, call
compactness quality.

**Feedback.** formulas and conditional conclusion.

**Examples.** (1) higher net:gross under profile (L1). (2) shorter circulation
but more perimeter (L2). (3) two nondominated blocks (L3).

**Validation.** exact geometry/metric and basis equality.

### Family `area_block_stack_audit`

**Task/purpose.** Diagnose one area, capacity, overlap, contact, level, core,
stack, or metric error.

**Response/template.** root layer and correction.

**Derivation.** compare expression AST, occupancy, contact graph, level solver,
and circulation graph.

**Difficulty.** L1 arithmetic/overlap; L2 vertical relation; L3 shared space
double-count makes all floors appear over capacity.

**Distractors/constraints.** Exactly one root mutation.

**Feedback.** trace program→block→floor→stack.

**Examples.** (1) circulation factor wrong base (L1). (2) same-level pair split
(L2). (3) shared support counted on two floors (L3).

**Validation.** fault manifest and independent solvers.

### Cross-family progression

Area layers precede floor allocation and geometric fit. Contact constraints
connect blocks to relationships. Same/separate levels precede core distance and
stack synthesis. Metric comparison and audits come last.

## 7. Category: Site response, orientation, edges, and environmental criteria

### Category purpose

Coordinate fictional site constraints with access, placement, orientation, and
supplied environmental proxies without performing real analysis.

### Learn

Site north, page up, street edges, entrances, no-build areas, views, noise,
irradiance, wind, slope, and service access are separate data layers. A design
response is valid only against the displayed criterion and dataset.

### Prerequisites

Categories 2–6.

### Category boundaries

No real planning, climate, daylight, energy, wind, acoustics, landscape, civil,
security, or environmental design.

### Common misconceptions

- Treating page up as north.
- Assuming every street edge permits access.
- Promoting a preferred view to hard orientation.
- Using distance rather than route/access constraints.
- Calling a supplied score actual performance.
- Ignoring conflicts between site criteria.

### Family `site_orientation_transform`

**Task/purpose.** Transfer cardinal orientation between rotated site and layout.

**Response/template.** direction/edge matching.

**Derivation.** exact rotation/reflection transform.

**Difficulty.** L1 north arrow; L2 rotated plan; L3 mirrored alternative.

**Distractors/constraints.** page up, clockwise reversal, local/global confusion.

**Feedback.** overlay world/local axes.

**Examples.** (1) top edge east after rotation (L1). (2) map façade to south
(L2). (3) mirrored scheme orientation (L3).

**Validation.** transform inverse round-trip.

### Family `site_access_edge_assign`

**Task/purpose.** Assign entrances/loading to permitted site edges and networks.

**Response/template.** edge/entrance matching.

**Derivation.** eligibility predicates plus route connectivity.

**Difficulty.** L1 one edge; L2 separate flows; L3 capacity/time constraints.

**Distractors/constraints.** nearest forbidden edge, geometric access without
portal.

**Feedback.** edge permissions and routes.

**Examples.** (1) visitor entry on allowed street edge (L1). (2) service edge
separate (L2). (3) multiple valid assignments (L3).

**Validation.** matching/path solver.

### Family `site_setback_nobuild_fit`

**Task/purpose.** Test/place blocks within fictional buildable/no-build regions.

**Response/template.** placement or violation region.

**Derivation.** polygon containment/difference.

**Difficulty.** L1 rectangle; L2 obstacles; L3 several blocks/access.

**Distractors/constraints.** total area only, boundary crossing, hidden setback.

**Feedback.** buildable mask overlay.

**Examples.** (1) block fits envelope (L1). (2) clips no-build cell (L2). (3)
rearrange two blocks (L3).

**Validation.** exact polygon Boolean.

### Family `view_edge_proximity`

**Task/purpose.** Evaluate supplied view/orientation/proximity relationships.

**Response/template.** satisfied set/score.

**Derivation.** façade-space orientation and distance/visibility predicates.

**Difficulty.** L1 named edge; L2 competing spaces; L3 view and separation
conflict.

**Distractors/constraints.** real view quality, page proximity, adjacency.

**Feedback.** site-space relation rays.

**Examples.** (1) lounge faces View Edge V (L1). (2) allocate two preferred
frontages (L2). (3) Pareto conflict (L3).

**Validation.** geometry/visibility profile.

### Family `noise_quiet_proxy`

**Task/purpose.** Apply supplied edge/source attenuation scores and quiet/active
preferences.

**Response/template.** score/ranking/placement.

**Derivation.** exact fictional distance/zone lookup formula.

**Difficulty.** L1 near/far; L2 barriers; L3 several sources/preferences.

**Distractors/constraints.** acoustic claim, intuitive material effect, wrong
source.

**Feedback.** show proxy formula only.

**Examples.** (1) lower supplied score farther from edge (L1). (2) fictional
screen factor (L2). (3) conflicting sources (L3).

**Validation.** score oracle and disclaimer.

### Family `solar_daylight_proxy_orientation`

**Task/purpose.** Apply supplied façade solar/daylight scores to space
preferences.

**Response/template.** assignment/score.

**Derivation.** orientation/time-profile lookup and displayed weighting.

**Difficulty.** L1 one preference; L2 schedule; L3 competing glare/solar proxy.

**Distractors/constraints.** universal south-is-best, actual lux/energy claim.

**Feedback.** conditional score table.

**Examples.** (1) morning-use space prefers east under brief (L1). (2) weighted
schedule (L2). (3) nondominated orientations (L3).

**Validation.** profile lookup/weights.

### Family `topography_level_access_proxy`

**Task/purpose.** Place entrances/levels using supplied contours/slopes and
maximum fictional level-change rules.

**Response/template.** level difference/placement/path.

**Derivation.** interpolate bounded planar/stepped terrain and compare explicit
threshold.

**Difficulty.** L1 contour value; L2 two entrances; L3 route plus floor level.

**Distractors/constraints.** civil/accessibility claim, contour interval error.

**Feedback.** section through site/building.

**Examples.** (1) entry/site difference .3 m (L1). (2) split-level entries (L2).
(3) choose valid route under fictional rule (L3).

**Validation.** terrain function/route.

### Family `site_response_audit`

**Task/purpose.** Diagnose one orientation, access, fit, view, proxy, terrain, or
criteria error.

**Response/template.** root layer/correction.

**Derivation.** compare transforms, polygons, routes, score profiles.

**Difficulty.** L1 north/edge; L2 proxy basis; L3 one rotation changes several
criteria.

**Distractors/constraints.** Exactly one root mutation.

**Feedback.** source→transform→criterion.

**Examples.** (1) page top called north (L1). (2) forbidden edge used (L2). (3)
rotated block keeps stale solar scores (L3).

**Validation.** fault manifest.

### Cross-family progression

Orientation precedes access and buildable fit. View/noise/solar proxies remain
separate criteria. Topography adds vertical relation. Audits coordinate layers.

## 8. Category: Layout synthesis, alternatives, and tradeoffs

### Category purpose

Construct and compare multiple layouts under explicit constraints and values.

### Learn

Test hard constraints first. Then compare preferences by their displayed
metrics, normalization, weights, or Pareto dominance. An optimum is relative to
the model; different layouts can be equivalent or nondominated.

### Prerequisites

Categories 2–7.

### Category boundaries

No aesthetic scoring, generative architecture claims, or real recommendations.

### Common misconceptions

- Optimizing preferences before feasibility.
- Treating one score as objective quality.
- Comparing different briefs/bases.
- Rejecting equivalent rotations.
- Summing unnormalized metrics.
- Assuming one optimum must exist.

### Family `layout_constraint_check`

**Task/purpose.** Test a layout against all displayed hard predicates.
**Response/template.** pass/fail table. **Derivation.** Evaluate exact graph,
geometry, area, level, site, and route constraints. **Difficulty.** L1 one
predicate; L2 several; L3 find minimal failures. **Distractors/constraints.**
Preferences cannot invalidate. **Feedback.** source-linked checklist.
**Examples.** adjacency pass (L1); area+route checks (L2); two root violations
(L3). **Validation.** independent predicate suite.

### Family `layout_select_feasible`

**Task/purpose.** Select every feasible alternative, not merely the prettiest.
**Response/template.** multi-choice set. **Derivation.** Full hard-constraint
evaluation. **Difficulty.** L1 one valid; L2 multiple valid; L3 none and conflict
reason. **Distractors/constraints.** visual symmetry, preference-only rejection.
**Feedback.** matrix by alternative. **Examples.** choose B (L1); A/C both valid
(L2); none due capacity (L3). **Validation.** exact set equality.

### Family `layout_construct_feasible`

**Task/purpose.** Construct any layout satisfying bounded brief/geometry.
**Response/template.** cell/polygon/portal placement. **Derivation.** Validate
candidate with solver; do not compare to one canonical layout. **Difficulty.**
L1 4 cells; L2 zones/routes; L3 multilevel/site. **Distractors/constraints.**
All valid symmetries accepted. **Feedback.** satisfied-constraint overlay.
**Examples.** chain layout (L1); opening/zone layout (L2); stack/site layout
(L3). **Validation.** solver and canonical equivalence.

### Family `weighted_score_compare`

**Task/purpose.** Normalize and weight supplied preference metrics.
**Response/template.** contributions/score/ranking. **Derivation.** Apply
displayed min/max normalization and weights after feasibility. **Difficulty.**
L1 weighted sum; L2 mixed directions; L3 sensitivity/tie. **Distractors/constraints.**
raw sum, weight hard constraints, reverse cost/benefit. **Feedback.** contribution
table. **Examples.** 60/40 score (L1); normalized metrics (L2); tie (L3).
**Validation.** expression AST.

### Family `pareto_layout_compare`

**Task/purpose.** Identify dominated/nondominated alternatives.
**Response/template.** Pareto set/dominance reasons. **Derivation.** Compare all
displayed metrics with declared directions. **Difficulty.** L1 two metrics; L2
several; L3 constraint filtering first. **Distractors/constraints.** weighted winner,
single-metric best. **Feedback.** plot/table. **Examples.** B dominates A (L1);
A/C nondominated (L2); infeasible D excluded (L3). **Validation.** dominance
oracle.

### Family `layout_equivalence_symmetry`

**Task/purpose.** Recognize graph/layout equivalence under permitted renaming,
rotation, reflection. **Response/template.** equivalence classes.
**Derivation.** Graph isomorphism and geometric transforms respecting fixed
orientation. **Difficulty.** L1 rotation; L2 reflection; L3 site breaks symmetry.
**Distractors/constraints.** visual difference, illegal orientation transform. **Feedback.**
node/transform mapping. **Examples.** 90° same (L1); mirror same (L2); south
criterion distinguishes (L3). **Validation.** canonical forms.

### Family `minimal_layout_edit`

**Task/purpose.** Find minimum stated-cost edits restoring feasibility.
**Response/template.** edit set/cost. **Derivation.** bounded edit search.
**Difficulty.** L1 add portal; L2 move/swap block; L3 several equal minima.
**Distractors/constraints.** nonminimal, fixes preference not failure, breaks another hard
constraint. **Feedback.** before/after predicate delta. **Examples.** add one
edge (L1); swap rooms (L2); two minimal fixes (L3). **Validation.** optimality
certificate.

### Family `scenario_robustness_compare`

**Task/purpose.** Compare layouts across supplied schedules/user scenarios.
**Response/template.** scenario matrix/robust set. **Derivation.** Re-evaluate
each alternative per scenario and displayed aggregation. **Difficulty.** L1 two
scenarios; L2 worst-case; L3 regret/Pareto. **Distractors/constraints.** average hides hard
failure, one scenario universal. **Feedback.** scenario table. **Examples.**
day/night (L1); worst-case route (L2); nondominated robust set (L3).
**Validation.** scenario solver.

### Family `alternative_reasoning_audit`

**Task/purpose.** Diagnose feasibility, normalization, weighting, dominance,
equivalence, edit, or scenario error. **Response/template.** root/correction.
**Derivation.** Replay evaluation pipeline. **Difficulty.** L1 failed hard
constraint; L2 score/Pareto; L3 equivalent layout counted as independent winner.
**Distractors/constraints.** One root mutation. **Feedback.** earliest stage.
**Examples.** infeasible option scored (L1); cost metric reversed (L2); stale
scenario (L3). **Validation.** fault manifest.

### Cross-family progression

Checking/selecting feasibility precedes construction. Weighted and Pareto methods
remain distinct. Equivalence prevents false diversity; minimal edits and
scenarios add iteration. Audits test evaluation order.

## 9. Category: Revisions, coordination, sufficiency, and integrated audits

### Category purpose

Trace design decisions across representations and distinguish root changes,
downstream symptoms, and unresolved value judgments.

### Learn

A revision starts at a clause, relationship, geometry, or criterion. Update every
dependent matrix, graph, route, block, score, and view. Comparing revisions
requires a common basis. When the brief lacks a value decision, the correct
result may be several alternatives or no determinate ranking.

### Prerequisites

All relevant categories.

### Category boundaries

No real design review, approval, or professional coordination service.

### Common misconceptions

- Editing matrix but not graph/layout.
- Treating moved room as new identity.
- Comparing alternatives under different brief revisions.
- Fixing downstream score rather than source constraint.
- Assuming missing weight is zero.
- Rejecting multiple valid answers.

### Family `brief_revision_delta`

**Task/purpose.** Classify added/removed/modified clauses/program objects.
**Response/template.** revision delta table. **Derivation.** Stable-ID diff.
**Difficulty.** L1 one clause; L2 object/relationship effects; L3 split/merge
identity. **Distractors/constraints.** text rename as new, hide removal. **Feedback.**
old→delta→new. **Examples.** area change (L1); new adjacency (L2); shared room
split (L3). **Validation.** diff round-trip.

### Family `relationship_revision_propagate`

**Task/purpose.** Update matrix/graph/bubbles after relationship revision.
**Response/template.** changed cells/edges. **Derivation.** provenance
dependency diff. **Difficulty.** L1 symmetric edge; L2 directed/layered; L3
cascading redundancy. **Distractors/constraints.** one mirror only, unrelated edges.
**Feedback.** clause→representations. **Examples.** add adjacency (L1); reverse
access (L2); remove implied redundant edge (L3). **Validation.** round-trip.

### Family `layout_revision_impact`

**Task/purpose.** Identify affected spaces/routes/zones/floors/site metrics after
one edit. **Response/template.** dependency set. **Derivation.** graph/geometry
diff and transitive provenance. **Difficulty.** L1 moved portal; L2 moved room;
L3 core/site rotation. **Distractors/constraints.** visual neighbors only, whole model.
**Feedback.** causal graph. **Examples.** portal changes two routes (L1);
room move changes adjacency (L2); rotation changes orientations/scores (L3).
**Validation.** exact dependency graph.

### Family `cross_representation_consistency`

**Task/purpose.** Find stale contradiction among brief, matrix, graph, bubble,
stack, plan, route, and score. **Response/template.** representation/root source.
**Derivation.** Normalize each to common semantics. **Difficulty.** L1 missing
edge; L2 stale level/route; L3 score computed from old geometry. **Distractors/constraints.**
One root stale artifact. **Feedback.** common semantic comparison. **Examples.**
matrix vs bubble (L1); stack vs plan (L2); old site score (L3). **Validation.**
revision IDs.

### Family `decision_lineage_trace`

**Task/purpose.** Trace a layout feature/score back through criterion and clause.
**Response/template.** ordered provenance. **Derivation.** DAG traversal.
**Difficulty.** L1 direct; L2 derived metric; L3 several stakeholder sources.
**Distractors/constraints.** downstream symptom, stale clause. **Feedback.** illuminate DAG.
**Examples.** portal→access clause (L1); score→normalized metric (L2); zone
decision→priority rule (L3). **Validation.** acyclic provenance.

### Family `comparison_basis_check`

**Task/purpose.** Decide whether alternatives/revisions are comparable and what
must be normalized. **Response/template.** comparable/normalize/not comparable
plus reason. **Derivation.** compare brief, geometry, metric, weight, scenario,
and profile metadata. **Difficulty.** L1 units; L2 brief revision; L3 different
stakeholder weights. **Distractors/constraints.** numerical closeness. **Feedback.**
compatibility matrix. **Examples.** same basis (L1); normalize area basis (L2);
rankings value-dependent (L3). **Validation.** metadata comparator.

### Family `design_reasoning_sufficiency`

**Task/purpose.** Identify missing fact/value or all valid conclusions.
**Response/template.** `cannot determine` reason/multiple-valid set.
**Derivation.** solution-set analysis across unspecified variables.
**Difficulty.** L1 missing area; L2 missing relation; L3 missing weights yields
several rankings. **Distractors/constraints.** assume convention, choose arbitrary optimum.
**Feedback.** show solution variation. **Examples.** capacity absent (L1);
access direction absent (L2); no stakeholder priority (L3). **Validation.**
witness solutions.

### Family `integrated_design_reasoning_audit`

**Task/purpose.** Find one root defect/insufficiency in brief→graph→layout→
evaluation. **Response/template.** root layer, evidence, correction, consequences.
**Derivation.** Validate AST, constraints, graph, geometry, routes, scores,
revisions, claim scope. **Difficulty.** L3 two domains; L4 three/revision; L5
underdetermined/value-dependent. **Distractors/constraints.** One root unless explicit
insufficiency. **Feedback.** causal graph. **Examples.** shared-area double count
(L3); portal revision leaves stale routes/scores (L4); no weights→no unique
winner (L5). **Validation.** fault/insufficiency manifest.

### Cross-family progression

Brief and relationship deltas precede layout impact. Consistency and lineage
train coordination. Basis and sufficiency precede integrated audits.

## 10. Topic-level progression

### Level 1 — Read one explicit relation

Classify clauses, extract spaces, read matrix cells/edges, trace one route,
assign a zone, total areas, and test one site/layout constraint.

### Level 2 — Transform representations

Move between clauses, matrices, graphs, bubbles, blocks, stacks, and routes;
apply several compatible hard constraints and one preference metric.

### Level 3 — Construct and compare

Build bounded layouts, coordinate multiple networks/levels/site layers, detect
conflicts, compare weighted/Pareto alternatives, and make minimal edits.

### Level 4 — Revise and diagnose

Propagate one source change, reconcile representations, test scenario robustness,
and identify root rather than downstream defects.

### Level 5 — Handle non-uniqueness and values

Accept multiple valid schemes, expose missing weights/stakeholder decisions,
preserve Pareto tradeoffs, and refuse universal architectural, accessibility,
safety, or quality conclusions.

## 11. Adaptive practice guidance

Track family, representation, relation type/direction/status, graph topology,
user network, zone/level/site layer, constraint type, metric/weight, equivalence
transform, misconception, and difficulty dimensions.

Routing:

- preference treated as hard → clause classification;
- adjacency/access/proximity confusion → paired relation examples;
- symmetry/direction error → matrix fold/arrow exercises;
- bubble overreading → same graph with several placements;
- route through wall/wrong network → portal-filtered reachability;
- shortest/fewest-turn confusion → identical graph with different metrics;
- zone stereotype → explicit attribute/brief trace;
- area-total-only reasoning → non-packable block fixtures;
- vertical alignment/access confusion → section plus core graph;
- page/north confusion → orientation transforms;
- score before feasibility → staged constraint/evaluation cards;
- one-answer bias → equivalence/multiple-solution families;
- integrated error → earliest failed dependency.

Speed is not mastery.

## 12. Answer checking and feedback

- Compare stable IDs and typed semantics, never labels/pixels.
- Normalize symmetric/directed graphs, matrices, rotations/reflections, and
  equivalent layouts under the active profile.
- Use exact graph, polygon/cell, path, matching, constraint, Pareto, and
  provenance checks.
- Accept every valid construction and every valid member of an answer set.
- Numeric metrics use exact rational/decimal arithmetic and displayed rounding.
- Audit answers identify earliest cause.
- `Cannot determine` requires exact missing data and witness alternatives.

Worked feedback order:

1. Restate brief clause/profile and reasoning layer.
2. Show source spaces/relations/constraints.
3. Normalize the graph/geometry.
4. Evaluate hard constraints.
5. Evaluate preferences/metrics only if feasible.
6. Show alternative/equivalence witnesses.
7. State the limited, conditional conclusion.

## 13. Rendering, interaction, accessibility, and localization

- Generate semantic SVG matrices, graphs, bubbles, blocks, stacks, routes, site
  layers, and comparison tables from one model.
- Distinguish relationship type, direction, strength, zone, user network,
  requirement/preference, and revision by labels/patterns as well as color.
- Selection resolves to cells/nodes/edges/regions/portals, not pixels.
- Pan/zoom never changes semantics; dragging always has keyboard/list/grid input.
- Every visual has a structured matrix, edge list, route list, constraint table,
  level allocation, polygon/cell list, or metric table.
- Color is never the sole zone/status cue; reduced motion uses static steps.
- Localization handles matrix legends, direction, priority language, decimal/
  area units, storey terminology, and reading order. It never introduces local
  code or cultural assumptions.

## 14. Generator and implementation architecture

Recommended standalone modules:

```text
seededRng
briefGrammar
programRegistry
constraintCompiler
typedRelationshipGraph
matrixCodec
graphAlgorithms
bubbleRenderer
exactGridPolygonGeometry
visibilityOracle
routeNetwork
layoutConstraintSolver
stackingSolver
siteTransform
metricEvaluator
paretoSolver
symmetryCanonicalizer
revisionDiffer
provenanceGraph
faultInjector
semanticSvgRenderer
accessibleFactBuilder
semanticAnswerChecker
```

Pipeline: choose family/misconception; construct a bounded satisfiable or
intentionally conflicting model; derive all representations; solve with primary
and independent algorithms; generate misconception distractors/root mutation;
render visual/structured views; reject ambiguity, unintended unsatisfiability,
clutter, inequivalent answer checking, overclaim, and recent signatures.

Standalone HTML/JS/CSS only: no backend, optimization service, CAD/BIM, GIS,
weather, code, or generative-design API.

## 15. Automated validation requirements

- Every clause/object/relation/constraint has unique stable lineage.
- Symmetric matrices mirror; directed layers do not; graph/matrix round-trips.
- Bubble rendering preserves graph semantics without coordinate leakage.
- Graph paths, distances, components, cuts, flows, matchings, and automata agree
  with independent bounded enumeration.
- Program/area ledgers and floor capacities reconcile exactly.
- Cell/polygon layouts are contained, nonoverlapping, and satisfy exact contacts.
- Level/core/site transforms and visibility are deterministic.
- Hard constraints are tested before scores; normalization/directions/weights
  are explicit; Pareto sets exact.
- Symmetry canonicalization accepts all allowed transforms and rejects
  orientation-distinguished ones.
- Revision deltas/provenance reproduce every downstream effect.
- Unsatisfiable cases have minimal conflict certificates; underdetermined cases
  have at least two witness solutions.
- Audit mutations have one root unless insufficiency is explicit.
- Accessibility/code/safety/aesthetic claims are absent.

For at least `10,000` seeds per family/level, and `25,000` for realizability,
layout, stacking, disjoint paths, Pareto, equivalence, revisions, and integrated
audits, all representations/oracles/choices/rejection/accessibility invariants
must pass.

## 16. Coverage requirements

Balance hard/preferred/avoid/forbidden/neutral relations; symmetric/directed and
multilayer matrices; sparse/dense but readable graphs; public/staff/service and
fictional user networks; reachability/distance/turn/conflict/bottleneck/
redundancy; zones/transitions/separation/visibility/shared resources; net/shared/
gross area; blocks/floors/stacks/cores; site edges/orientations/proxies; direct,
inverse, construction, comparison, revision, audit, multiple-valid, conflict,
and `Cannot determine` questions. Every misconception must recur intentionally.

## 17. Recommended views and v1 priorities

Views:

1. **Brief & Program**
2. **Matrix & Bubble**
3. **Circulation**
4. **Zones & Sequence**
5. **Blocks & Stacks**
6. **Site Response**
7. **Alternatives**
8. **Revision & Audit**

V1 prioritizes controlled briefs, 4–10 spaces, symmetric adjacency plus directed
access, matrix/graph/bubble transforms, small route networks, two/three zones,
orthogonal cell layouts, one/two floors, simple site edges, feasibility,
weighted/Pareto comparison, and semantic SVG/structured alternatives.

Defer real briefs/sites/users, code/accessibility/egress/security/healthcare
rules, environmental simulation, aesthetic assessment, crowd behavior, large
optimization, CAD/BIM/GIS import, and professional design output.

## 18. Topic-level quality checklist

- [ ] Every question is fictional and nonprofessional.
- [ ] Brief, relationship, geometry, and evaluation layers remain distinct.
- [ ] Requirements/preferences/prohibitions/assumptions/missing data do not blur.
- [ ] Adjacency, proximity, access, reachability, visibility, and separation do
      not blur.
- [ ] Matrices/graphs/bubbles/layouts derive from one semantic model.
- [ ] Bubble placement/size conveys only its declared semantics.
- [ ] Routes use permitted portals/networks and explicit metrics.
- [ ] Accessibility/egress/security/healthcare assumptions are never invented.
- [ ] Hard constraints precede preferences/scores.
- [ ] Multiple valid/equivalent/Pareto schemes are accepted.
- [ ] Missing values yield structured insufficiency, not guessed convention.
- [ ] Revisions and scores retain source lineage and common basis.
- [ ] No aesthetic or universal “best design” judgment is generated.
- [ ] Every family has task, response/template, derivation, difficulty,
      misconception distractors/constraints, feedback, three examples, and
      validation.
- [ ] Independent oracles, seed sweeps, localization, and accessibility pass.
- [ ] The app requires no backend/external service.

## 19. Stable identifiers and navigation

Stable family IDs are the backticked identifiers above. Archive seed, family,
brief/geometry revision, profile/legend/unit IDs, constraints, exact solutions,
equivalence policy, evaluation basis, accepted answer set, and fault/
insufficiency manifest. Semantic changes require new versions.
