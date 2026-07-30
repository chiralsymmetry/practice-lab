# Geometry and Trigonometry — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, exact-geometry oracle, proof-step checker, SVG/graph renderer, trigonometric evaluator, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Geometry and Trigonometry

### Topic goal

Develop reliable spatial, deductive, and quantitative fluency in Euclidean geometry and trigonometry. The learner should become able to:

- interpret geometric notation and diagrams without assuming unmarked facts;
- reason with angle relationships, parallel lines, and transversals;
- classify triangles and apply triangle angle, side, congruence, and similarity facts;
- establish congruence/similarity from sufficient information and reject insufficient criteria;
- use proportional reasoning, scale factors, and indirect measurement;
- apply the Pythagorean theorem and special-right-triangle relationships;
- move among synthetic, coordinate, transformation, and measurement representations;
- reason about polygons, circles, perimeter, area, surface area, and volume;
- choose and apply right-triangle trigonometric ratios;
- use radians, the unit circle, reference angles, identities, graphs, and bounded trigonometric equations;
- solve non-right triangles with the sine/cosine laws while recognizing ambiguous or impossible data;
- justify short deductive chains using an explicit theorem library.

The app should train the question “what is actually given or proved?” as strongly as calculation.

### Position within Practice Lab

This app supplies geometry and trigonometry assumed by **Physics**, **Calculus**, **Linear Algebra**, **Electric Circuits**, and technical drawing/architecture topics. It may reuse exact algebra from **Algebra Fluency**, but algebraic bulk must not dominate geometry questions.

Coordinate-vector methods remain elementary here. General vector spaces, matrices, dot products in arbitrary dimensions, and linear transformations as algebraic objects belong in Linear Algebra. Rates and optimization belong in Calculus.

### Audience and prerequisites

The early path assumes:

- signed arithmetic, fractions, ratios, and simple equations;
- reading coordinates and number lines;
- square roots for right-triangle categories.

Later trigonometry assumes function notation, basic algebraic rearrangement, and calculator use when a non-special angle is declared.

### Scope

The topic includes:

- points, lines, segments, rays, planes, betweenness, collinearity, angle notation, and constructions represented semantically;
- angle measurement, angle pairs, perpendicularity, parallel lines, transversals, and parallel-line converses;
- triangle classification, angle sums, exterior angles, inequalities, medians, altitudes, perpendicular/angle bisectors, and selected centers;
- SSS, SAS, ASA, AAS, and right-triangle HL congruence; invalid AAA/SSA cases; correspondence and CPCTC;
- AA, SAS, and SSS similarity, side/area/volume scale factors, and proportional segments;
- Pythagorean theorem/converse, distance, special `45-45-90` and `30-60-90` triangles;
- coordinate geometry of lines, slopes, midpoint, distance, parallel/perpendicular relationships, transformations, and bounded coordinate proofs;
- quadrilaterals and polygons, angle sums, regular polygons, symmetry, and property classification;
- circles: radius/diameter/chord/tangent/secant, arcs, central/inscribed angles, sectors, chords, and bounded power-of-a-point relationships;
- perimeter, circumference, area, composite regions, surface area, volume, similarity scaling, and unit conversion;
- right-triangle sine/cosine/tangent, inverse ratios, angles of elevation/depression, and bearings with explicit conventions;
- degrees/radians, coterminal/reference angles, unit-circle values, signs by quadrant, identities, graph parameters, and bounded trigonometric equations;
- sine law, cosine law, triangle area `½ab sin C`, ambiguous SSA cases, and solvability checks;
- controlled theorem selection, missing reasons/statements, and short proof ordering.

### Exclusions

Do not include in the initial app:

- non-Euclidean, projective, affine, differential, algebraic, fractal, or spherical geometry;
- topology, rigorous axiom-system development, or unrestricted proof writing/grading;
- compass-and-straightedge interaction requiring motor precision, construction impossibility proofs, or locus proofs;
- advanced triangle-center theorems, Ceva/Menelaus, inversion, projective configurations, or olympiad trick lemmas;
- arbitrary coordinate bashing with large coefficients;
- general conic-section theory beyond circles and parabola references owned by Algebra Fluency;
- trigonometric identities requiring long ingenuity, product-to-sum/sum-to-product, complex exponentials, hyperbolic functions, or inverse-trigonometric branch analysis beyond declared ranges;
- spherical bearings or great-circle navigation;
- surveying, structural, architectural, or safety conclusions from idealized exercises;
- diagrams that must be measured by screen pixels;
- facts inferred only because a picture “looks” parallel, perpendicular, congruent, bisected, tangent, or to scale.

### Normative Euclidean model

- Geometry is in the ordinary Euclidean plane unless a solid is explicitly declared.
- Points are exact semantic coordinates or incidence objects.
- A line extends infinitely in both directions; a ray has one endpoint; a segment has two.
- `AB` may denote segment length only when typography/context clearly distinguishes it from `\overline{AB}`. Accessible text says “length AB” or “segment AB.”
- `∠ABC` has vertex `B`.
- Undirected angle measures are normally in `[0°,180°]`; triangle interior angles lie in `(0°,180°)`.
- Perpendicular lines meet at `90°`.
- Parallel lines are coplanar and never meet.
- Congruence means equal shape and size; similarity means equal shape with a positive scale factor.
- Figures may be reflected: orientation reversal does not prevent congruence or similarity.
- A polygon is simple unless self-intersection is explicitly the subject; core families use convex polygons unless stated otherwise.
- Circle arcs use minor arcs for two-letter notation unless the diagram labels a major arc explicitly.
- A tangent touches a circle at exactly one point and is perpendicular to the radius there.

### Diagram truth contract

The semantic scene, not its pixels, is authoritative.

- A diagram is **not assumed to scale** unless a coordinate grid or “drawn to scale” statement explicitly makes measurement relevant.
- Congruent segments use matching tick marks.
- Congruent angles use matching arc marks.
- Parallel lines use matching arrow marks.
- A small square marks a right angle.
- Midpoints, bisectors, tangency, collinearity, and polygon type are stated or marked.
- Similar-looking lengths/angles without matching marks carry no equality fact.
- Crossing segments do not imply bisection or perpendicularity.
- A point drawn near a line/circle is incident only when semantically attached.
- Hidden/occluded solid edges use line style plus accessible labels.
- Every diagram has an accessible fact list sufficient to solve the question.

Generated geometry must be realizable. Coordinates used for rendering must satisfy every stated incidence, equality, parallelism, perpendicularity, order, tangency, and non-degeneracy constraint within strict development-time tolerance.

### Naming and correspondence conventions

- Triangle names encode correspondence: `△ABC ≅ △DEF` means `A↔D`, `B↔E`, `C↔F`.
- Similarity statements likewise preserve order.
- Learner-entered congruence/similarity statements are graded by valid vertex correspondence, accepting cyclic/reversed whole-triangle orderings that preserve the mapping.
- A side is named by either endpoint order.
- Polygon vertices are listed around the boundary, clockwise or counterclockwise.
- Bearings declare their convention: three-digit clockwise from north (`000°..360°`) or quadrant bearing such as `N 30° E`. No prompt silently mixes them.

### Proof and theorem model

The app does not grade free-form prose proofs. Proof practice uses typed facts and a versioned theorem library.

Supported early facts/rules include:

- segment/angle addition;
- definitions of midpoint, bisector, perpendicular, parallel, and congruent/similar figures;
- vertical angles, linear pairs, complements/supplements;
- corresponding, alternate-interior/exterior, and same-side-interior parallel-line theorems and converses;
- triangle sum and exterior-angle theorem;
- isosceles triangle theorem and converse;
- SSS, SAS, ASA, AAS, HL congruence;
- CPCTC;
- AA, SAS, SSS similarity and corresponding-side proportionality;
- perpendicular-bisector and angle-bisector equidistance theorems and converses;
- selected quadrilateral/circle theorems explicitly introduced by category.

`SSA`, `AAA` for congruence, and “looks equal” are never valid congruence reasons. `AAA` is valid for similarity.

Each proof state stores statements, dependencies, cited theorem, substitutions/correspondence, and scope. A step is accepted when the theorem schema matches known facts; alternate valid short proofs are accepted.

### Angle and trigonometric conventions

- Geometry angle answers default to degrees.
- Trigonometric prompts explicitly display `°` or `rad`.
- Radian measure is dimensionless but input may include `rad`.
- `180°=π rad`.
- Right-triangle ratios for acute `θ` are `sinθ=opposite/hypotenuse`, `cosθ=adjacent/hypotenuse`, `tanθ=opposite/adjacent`.
- `arcsin`, `arccos`, and `arctan` return principal values; right-triangle inverse questions request an acute angle.
- Unit-circle definitions are `cosθ=x`, `sinθ=y`, and `tanθ=y/x` where `x≠0`.
- Standard position has vertex at origin and initial side on positive x-axis; positive rotation is counterclockwise.
- General solutions to trig equations are excluded unless a family explicitly requests them. Default equation domains are displayed intervals such as `[0,2π)` or `[0°,360°)`.
- For triangle labeling, side `a` lies opposite angle `A`.

### Exact values, units, and tolerances

Use exact rational and quadratic-radical values when possible. Supported exact forms include:

- rational lengths/areas/angles;
- `qπ`;
- `q sqrt(d)` with square-free positive integer `d`;
- simple sums within one quadratic field;
- exact special-angle trig values.

Accepted answers:

- surrounding whitespace is ignored;
- equivalent fractions and normalized radicals are accepted;
- `π/3`, `60°`, and decimal radians are accepted only when compatible with the requested unit/mode;
- lengths require compatible units if the field does not display a fixed unit;
- area units are squared and volume units cubed;
- angle answers require degree/radian indication unless the field fixes it;
- unordered point/solution sets may appear in any order;
- congruence/similarity statements must encode a valid correspondence;
- multiple valid proof reasons/steps are accepted where the semantic proof checker confirms them.

Default decimal tolerance is the larger of half a unit in the requested final decimal place and `1e−8` relative. Keep unrounded intermediate trig values. Exact special-angle questions must not accept a coarse decimal when exact form is requested.

### Difficulty philosophy

Difficulty should rise through:

- weaker visual cues but fully explicit markings;
- moving among prose, diagrams, equations, coordinates, and transformations;
- selecting relevant theorems from several plausible ones;
- inverse questions and missing givens;
- multi-step but short deductions;
- preserving correspondence and orientation;
- ambiguous-case/solvability decisions;
- exact versus approximate forms;
- combining at most two or three mastered relationships.

Difficulty must not rise through:

- cluttered or tiny diagrams;
- arbitrary point-letter overload;
- measuring pixels;
- huge numbers or awkward calculator work;
- long proof chains;
- nearly degenerate triangles that magnify rounding;
- reliance on memorized obscure theorem names;
- unstated conventions;
- misleading drawings that contradict marks.

### Topic-wide level model

| Level | Typical demand |
|---|---|
| 1 | Read a mark, classify a figure, use one angle/length relationship, or recall a special value |
| 2 | Solve one algebraic relationship, choose a criterion, or transfer one representation |
| 3 | Combine two theorems, preserve correspondence, use a scale/trig ratio, or interpret a graph |
| 4 | Complete a short proof, handle several cases, solve a non-right triangle, or synthesize a construction |
| 5 | Mixed synthetic/coordinate reasoning, ambiguity/insufficiency diagnosis, or bounded theorem selection |

### Generator and oracle model

Every instance stores:

`categoryId`, `subcategoryId`, `familyId`, `level`, `semanticScene`, `pointsExact`, `incidenceFacts`, `markingFacts`, `givens`, `targetFact`, `proofGraph`, `angleUnit`, `exactAnswer`, `displayAnswer`, `acceptedUnits`, `tolerance`, `difficultyDimensions`, `misconceptionsTargeted`, `distractorProvenance`, `workedSolution`, `visualDescription`, `structuralSignature`, `theoremLibraryVersion`, and `oracleVersion`.

Generation order:

1. choose a target theorem/skill and misconception;
2. construct exact lengths, angles, coordinates, transformations, or proof facts backward from a friendly answer;
3. solve with a symbolic geometry/trig oracle;
4. independently validate coordinates, identities, and proof-rule applicability;
5. construct distractors from misconception transforms;
6. lay out labels and marks from the semantic scene;
7. reject occlusion, ambiguity, degeneracy, or accidental extra facts;
8. render SVG plus accessible fact table.

All generation and checking runs locally in the standalone page. Development-time validation may use mature geometry/numeric libraries, but there is no runtime backend, CAS, dynamic geometry service, or network dependency.

## 2. Category: Foundations, notation, and angle relationships

### Category purpose

Build precise diagram reading, naming, measurement relationships, and the distinction between stated facts and visual appearance.

### Learn

Name an angle with its vertex in the middle. Vertical angles are congruent; a linear pair sums to `180°`; complementary angles sum to `90°`. Tick/arc/arrow marks state facts. Unmarked appearance does not.

### Prerequisites

Arithmetic and simple linear equations.

### Common misconceptions

- Putting the wrong point in the middle of an angle name.
- Treating rays/segments/lines as interchangeable.
- Assuming equal-looking segments or right-looking angles are marked facts.
- Confusing vertical with adjacent angles.
- Using `90°` for supplementary or `180°` for complementary.

### Family `identify_geometric_object`

**Task.** Name or classify a point, segment, ray, line, plane, collinear set, or intersection from a semantic diagram.

**Response and template.** Matching/short notation: `Which object is {description} in the diagram?`

**Derivation.** Query incidence and endpoint/direction properties of the scene graph.

**Difficulty.** L1 one object; L2 several overlapping objects; L3 equivalent valid names and collinearity.

**Examples.**

1. Object with endpoints A and B → segment `AB`. L1.
2. Starts at C and passes through D → ray `CD`, not ray `DC`. L2.
3. A, B, C share line ℓ → any pair names the same line, such as line `AC`. L3.

**Distractors and validation.** Reverse a ray, use a segment for a line, or choose near-but-nonincident point. Semantic incidence oracle.

### Family `name_angle`

**Task.** Name a marked angle or identify its vertex/sides.

**Response and template.** Structured notation: `Name the marked angle with three letters.`

**Derivation.** Use point on first ray, vertex, point on second ray; accept reversed ray order.

**Difficulty.** L1 isolated angle; L2 several angles share vertex; L3 identify larger/composite angle.

**Examples.**

1. Rays BA and BC → `∠ABC` or `∠CBA`. L1.
2. At O with rays OA, OB, OC, marked between OA/OC → `∠AOC`. L2.
3. `∠ABD` contains ray BC internally; naming still uses outer rays `BA,BD`. L3.

**Distractors and validation.** Vertex not middle or inner ray endpoint. Ray-pair equivalence.

### Family `segment_angle_addition`

**Task.** Find a missing part/whole using betweenness or an interior ray.

**Response and template.** Number: `Given {between_or_inside_fact} and {measures}, find {target}.`

**Derivation.** Segment: `AB+BC=AC` when B is between A,C. Angle: component measures sum to whole.

**Difficulty.** L1 numeric missing part; L2 algebraic labels; L3 several adjacent parts with one irrelevant measure.

**Examples.**

1. B between A,C; `AB=4,BC=7` → `AC=11`. L1.
2. D inside `∠ABC`; `∠ABD=35°,∠ABC=80°` → `∠DBC=45°`. L2.
3. `AB=2x+1,BC=x−2,AC=14` → `x=5`, lengths 11 and 3. L3.

**Distractors and validation.** Subtract in wrong direction or add a noncomponent angle. Exact incidence/order plus arithmetic.

### Family `angle_pair_classify`

**Task.** Classify vertical, linear-pair, complementary, supplementary, adjacent, or neither relationships.

**Response and template.** Choice: `What relationship do {angle1} and {angle2} have?`

**Derivation.** Use shared rays, opposite rays, and supplied measures; multiple labels accepted only when requested.

**Difficulty.** L1 vertical/linear; L2 complement/supplement from values; L3 relationship may satisfy more than one label.

**Examples.**

1. Opposite angles at intersecting lines → vertical. L1.
2. Adjacent angles whose outer rays are opposite → linear pair and supplementary. L2.
3. `30°` and `60°` nonadjacent → complementary, not adjacent. L3.

**Distractors and validation.** Appearance-based labels or vertical=adjacent. Exact ray topology/measure sum.

### Family `vertical_linear_angle_measure`

**Task.** Find angle measures using vertical equality and linear-pair supplements.

**Response and template.** Degree field: `Lines {lines} intersect. Given m∠{given}={value}, find m∠{target}.`

**Derivation.** Opposite angle equal; adjacent linear-pair angle `180°−value`.

**Difficulty.** L1 direct vertical; L2 adjacent; L3 algebraic expressions on opposite/adjacent angles.

**Examples.**

1. One angle `48°`; vertical angle → `48°`. L1.
2. Adjacent linear-pair angle → `132°`. L2.
3. Vertical angles `3x+5` and `5x−19` → `x=12`, each `41°`. L3.

**Distractors and validation.** Complement instead of supplement or set adjacent equal. Exact angle system.

### Family `complement_supplement_solve`

**Task.** Find an angle, its complement/supplement, or solve related algebraic expressions.

**Response and template.** Degree/number: `{relationship}. Given {expressions}, find {target}.`

**Derivation.** Set sum to `90°` or `180°`, solve, verify both measures in valid range.

**Difficulty.** L1 direct; L2 algebraic; L3 one angle is multiple/difference of the other.

**Examples.**

1. Complement of `37°` → `53°`. L1.
2. Supplement of `112°` → `68°`. L2.
3. Complementary angles `x+10` and `2x−4` → `x=28`, angles `38°,52°`. L3.

**Distractors and validation.** Swap 90/180 or answer x when angle requested. Exact sum/range.

### Family `diagram_fact_or_assumption`

**Task.** Select which statements are justified by explicit marks/givens.

**Response and template.** Multiple-choice: `Which statements must be true from the diagram and fact list?`

**Derivation.** Compute closure only under introduced elementary definitions; unmarked visual relations are absent.

**Difficulty.** L1 read one mark; L2 distinguish several marks; L3 a fact is derivable but not directly marked.

**Examples.**

1. Matching ticks on AB/CD → `AB≅CD`. L1.
2. Lines look parallel but have no arrows/given → parallelism not justified. L2.
3. M marked midpoint of AB → `AM=MB` and M lies on AB. L3.

**Distractors and validation.** Plausible pixel appearance. Compare claims against formal fact closure.

### Cross-family progression

Object and angle naming precede measurement. Segment/angle addition and angle-pair classification then support algebraic angle solving. “Fact or assumption” is interleaved throughout every later category.

## 3. Category: Parallel lines and transversals

### Category purpose

Build recognition and use of angle relationships created by parallel lines, including converses that establish parallelism.

### Learn

When a transversal crosses parallel lines, corresponding and alternate-interior/exterior angles are congruent; same-side interior angles are supplementary. Conversely, the appropriate congruence/supplement fact can prove the lines parallel.

### Prerequisites

Angle pairs, vertical angles, supplements.

### Common misconceptions

- Applying parallel-line theorems without parallel marks/givens.
- Confusing corresponding and alternate interior positions.
- Setting same-side interior angles equal.
- Using a converse with the wrong angle pair.
- Inferring multiple parallel pairs from one arrow style.

### Family `transversal_angle_pair`

**Task.** Classify a named pair relative to two lines and a transversal.

**Response and template.** Choice: `Classify ∠{a} and ∠{b} relative to {lines}.`

**Derivation.** Use intersection, interior/exterior half-planes, transversal side, and matching corner position.

**Difficulty.** L1 numbered standard layout; L2 rotated/oblique layout; L3 named angles and several transversals.

**Examples.**

1. Same corner at two intersections → corresponding. L1.
2. Interior and opposite sides of transversal → alternate interior. L2.
3. Exterior, same side → same-side exterior, not corresponding. L3.

**Distractors and validation.** Position label differing in one property. Topological classifier independent of rendering rotation.

### Family `parallel_transversal_measure`

**Task.** Find a missing angle using one parallel-line relation, optionally with vertical/linear pairs.

**Response and template.** Degree: `Given {line1}∥{line2} and m∠{given}={value}, find m∠{target}.`

**Derivation.** Traverse the equality/supplement graph of angle facts to target.

**Difficulty.** L1 corresponding/alternate; L2 same-side supplement; L3 two-relation chain.

**Examples.**

1. Corresponding to `64°` → `64°`. L1.
2. Same-side interior with `117°` → `63°`. L2.
3. Vertical then alternate-interior from `38°` → `38°`. L3.

**Distractors and validation.** Use complement or wrong pair. Exact angle-relation graph.

### Family `parallel_transversal_algebra`

**Task.** Solve x and requested angle from algebraic expressions on related angles.

**Response and template.** Named fields: `Given {parallel_fact}, {angle1}={expr1}, {angle2}={expr2}. Find x and {target}.`

**Derivation.** Set expressions equal or sum to 180 according to exact positional relation.

**Difficulty.** L1 equal pair; L2 supplementary pair; L3 solve x then transfer to a third angle.

**Examples.**

1. Corresponding `3x+4=5x−20` → `x=12`, angles `40°`. L1.
2. Same-side interior `2x+10` and `4x+20` → `x=25`, angles `60°,120°`. L2.
3. Alternate-exterior angles `7x+3` and `5x+17` are equal, so `x=7`; each is `52°`, and its vertical target is also `52°`. L3.

**Distractors and validation.** Wrong equality/sum or report x as angle. Symbolic relation plus range checks.

### Family `prove_lines_parallel`

**Task.** Choose the angle fact sufficient to prove two lines parallel or name the correct converse.

**Response and template.** Fact/theorem matching: `Which fact would prove {line1}∥{line2}?`

**Derivation.** Match candidate angle pair and relationship to a parallel-line converse.

**Difficulty.** L1 corresponding converse; L2 alternate/same-side; L3 distinguish a true but irrelevant fact.

**Examples.**

1. Corresponding angles congruent → lines parallel. L1.
2. Same-side interior angles supplementary → lines parallel. L2.
3. Vertical angles congruent at one intersection alone → insufficient. L3.

**Distractors and validation.** Direct theorem instead of converse or wrong line pair. Proof-rule schema.

### Family `parallel_perpendicular_transfer`

**Task.** Infer parallelism/perpendicularity through shared line relationships.

**Response and template.** Choice/angle: `Given {line_relations}, determine {target_relation_or_angle}.`

**Derivation.** In a plane: lines parallel to the same line are parallel; lines perpendicular to the same line are parallel; a line perpendicular to one of two parallels is perpendicular to the other.

**Difficulty.** L1 one transfer; L2 combine two; L3 select only warranted relation in a network.

**Examples.**

1. `a∥b` and `c⊥a` → `c⊥b`. L1.
2. `a⊥c` and `b⊥c` → `a∥b`. L2.
3. `a∥b,b∥d,c⊥a` → `c⊥d`. L3.

**Distractors and validation.** Conclude perpendicular from shared parallel or ignore coplanarity. Relation-closure oracle.

### Family `parallel_lines_proof_step`

**Task.** Fill or justify a short proof step combining transversal, vertical, and supplement facts.

**Response and template.** Statement/reason: `Complete the missing line in the proof that {target}.`

**Derivation.** Generate a 2–5 edge proof DAG with one hidden node/reason and accept any valid completing fact.

**Difficulty.** L1 one theorem; L2 two-link angle transfer; L3 converse conclusion after derived equality.

**Examples.**

1. `a∥b`; corresponding angles → congruent (reason: corresponding angles theorem). L1.
2. Given alternate angle congruence, conclude `a∥b` (converse). L2.
3. `∠1≅∠2` vertically and `∠2≅∠3` is given; if `∠1,∠3` are corresponding, transitivity plus the corresponding-angle converse proves `p∥q`. L3.

**Distractors and validation.** Theorem direction reversed or angle pair mismatch. Scope-aware proof checker.

### Cross-family progression

Position classification precedes numeric theorems. Algebraic variants follow direct measures. Converses are introduced only after direct theorems, then interleaved to prevent direction confusion. Relation transfer and short proofs consolidate the category.

## 4. Category: Triangles, congruence, and deductive structure

### Category purpose

Build triangle constraints and exact correspondence reasoning, including sufficient and insufficient congruence information.

### Learn

Triangle interior angles sum to `180°`; an exterior angle equals the sum of the two remote interior angles. Congruence criteria are SSS, SAS, ASA, AAS, and HL for right triangles. AAA proves only similarity; SSA is generally ambiguous.

### Prerequisites

Angle facts, segment notation, linear equations.

### Common misconceptions

- Assuming triangle shape from drawing.
- Using AAA or SSA for congruence.
- Treating any two sides and any angle as SAS.
- Losing vertex correspondence.
- Using CPCTC before congruence is established.
- Believing sides `a,b,c` form a triangle whenever positive.

### Family `triangle_angle_sum`

**Task.** Find a missing interior angle or solve angle expressions.

**Response and template.** Degree/number: `In △{name}, {angle_givens}. Find {target}.`

**Derivation.** Sum three interior measures to `180°`.

**Difficulty.** L1 two numeric angles; L2 algebraic expressions; L3 isosceles relation plus sum.

**Examples.**

1. `50°,60°` → third `70°`. L1.
2. Angles `x,2x,3x` → `x=30°`; angles `30°,60°,90°`. L2.
3. Base angles equal and vertex `44°` → each base `68°`. L3.

**Distractors and validation.** Sum to 360 or confuse x with requested angle. Exact positive angle sum.

### Family `triangle_exterior_angle`

**Task.** Use exterior-angle theorem or linear pair to find an angle.

**Response and template.** Degree: `Given exterior angle {E} and {remote_or_adjacent} measures, find {target}.`

**Derivation.** Exterior equals remote interior sum and supplements adjacent interior.

**Difficulty.** L1 numeric; L2 algebraic; L3 combine with isosceles/another exterior.

**Examples.**

1. Remote interiors `35°,62°` → exterior `97°`. L1.
2. Exterior `120°`, one remote `47°` → other `73°`. L2.
3. Exterior `4x+8`, remote angles `x+10,2x+7` → `x=9`, exterior `44°`. L3.

**Distractors and validation.** Include adjacent interior in remote sum. Exact angle model.

### Family `triangle_classify`

**Task.** Classify by side and angle type from measures/marks/coordinates.

**Response and template.** Two choices: `Classify △{name} by sides and by angles.`

**Derivation.** Side equality yields scalene/isosceles/equilateral; angle comparison yields acute/right/obtuse.

**Difficulty.** L1 explicit measures; L2 marks/angles; L3 coordinates or squared-side comparison.

**Examples.**

1. Sides `5,5,6` → isosceles; angle type computed acute. L1.
2. Angles `45°,45°,90°` → isosceles right. L2.
3. Sides `3,4,6`: `6²>3²+4²` → scalene obtuse. L3.

**Distractors and validation.** Equilateral merely because acute, or largest visual side. Exact side/angle oracle.

### Family `triangle_inequality`

**Task.** Decide feasibility or find the range/count of a missing side.

**Response and template.** Yes/no/interval: `Can lengths {a},{b},{c} form a nondegenerate triangle?` or `Find the range of x.`

**Derivation.** For positive sides, `|a−b|<c<a+b`.

**Difficulty.** L1 feasibility; L2 missing-side interval; L3 integer count or algebraic side.

**Examples.**

1. `3,4,5` → yes. L1.
2. With sides 7 and 10, third x → `3<x<17`. L2.
3. Integer x with sides 4,9 → x is `6..12`, seven values. L3.

**Distractors and validation.** Non-strict bounds or only upper bound. Exact inequality and positivity.

### Family `congruence_criterion`

**Task.** Determine whether marked/given triangles are provably congruent and name the criterion.

**Response and template.** Criterion/insufficient: `Can △{one} and △{two} be proved congruent from the marked facts?`

**Derivation.** Bind correspondence and match SSS, SAS, ASA, AAS, or HL schemas; otherwise insufficient.

**Difficulty.** L1 obvious SSS/SAS; L2 ASA/AAS/HL; L3 SSA/AAA decoy or shared side.

**Examples.**

1. Three corresponding side pairs → SSS. L1.
2. Two sides and included angle → SAS. L2.
3. Two sides and a nonincluded angle → SSA, insufficient in general. L3.

**Distractors and validation.** Criterion differing by included/nonincluded status. Schema matcher plus counterexample existence for invalid cases.

### Family `triangle_correspondence`

**Task.** Write a valid congruence statement or identify corresponding sides/angles.

**Response and template.** Ordered triangle names/matching: `Given {marks}, complete △ABC≅△{order}.`

**Derivation.** Build bijection from marked vertices/sides/angles; accept equivalent cyclic/reversed statements preserving bijection.

**Difficulty.** L1 distinctive marks; L2 reflected orientation; L3 infer one correspondence from criterion.

**Examples.**

1. A↔D, B↔E, C↔F → `△ABC≅△DEF`. L1.
2. Reflected drawing still uses mark mapping, not visual left/right. L2.
3. `AB↔QP, BC↔PR, AC↔QR` → `△ABC≅△QPR`. L3.

**Distractors and validation.** One swapped vertex. Edge/angle mapping consistency.

### Family `cpctc_target`

**Task.** Infer a corresponding part after congruence or identify the congruence needed for a target.

**Response and template.** Fact/matching: `Given △{statement}, which fact follows by CPCTC?`

**Derivation.** Read correspondence mapping and transfer equality of the requested side/angle.

**Difficulty.** L1 direct side; L2 angle in reversed naming; L3 work backward from target to needed correspondence.

**Examples.**

1. `△ABC≅△DEF` → `AB≅DE`. L1.
2. Same → `∠BCA≅∠EFD`. L2.
3. To prove `AC≅PR`, congruence statement must align A↔P and C↔R. L3.

**Distractors and validation.** Visually adjacent but noncorresponding part or CPCTC before congruence. Mapping oracle.

### Family `isosceles_triangle_theorems`

**Task.** Use equal sides↔equal opposite angles or solve a measure.

**Response and template.** Fact/degree: `In △ABC, {equal_side_or_angle_fact}. Find/prove {target}.`

**Derivation.** Apply isosceles theorem or converse with correct opposite mapping, then triangle sum if needed.

**Difficulty.** L1 direct equality; L2 numeric; L3 algebraic/converse.

**Examples.**

1. `AB=AC` → `∠B=∠C`. L1.
2. Vertex angle `40°` → base angles `70°`. L2.
3. `∠B=3x+2,∠C=5x−18` and equal sides → `x=10`, angles `32°`. L3.

**Distractors and validation.** Equal adjacent rather than opposite angles. Exact vertex-side opposition map.

### Family `triangle_special_segments_centers`

**Task.** Identify/use median, altitude, perpendicular bisector, angle bisector, or centroid/circumcenter/incenter property.

**Response and template.** Choice/ratio: `What is {segment_or_point}, and which property follows?`

**Derivation.** Match incidence/perpendicular/bisection marks; bounded center facts use semantic construction.

**Difficulty.** L1 segment definition; L2 equidistance theorem; L3 centroid `2:1` ratio or center comparison.

**Examples.**

1. Segment from vertex to midpoint opposite side → median. L1.
2. P on perpendicular bisector of AB → `PA=PB`. L2.
3. Centroid G on median AM with `AG=8` → `GM=4`. L3.

**Distractors and validation.** Confuse angle bisector/median/altitude. Exact incidence and ratio.

### Family `triangle_congruence_proof`

**Task.** Complete/order a 3–7-step congruence proof.

**Response and template.** Proof table/ordered statements: `Complete the proof that △{one}≅△{two}.`

**Derivation.** Generate proof DAG from givens, definitions, shared/reflexive parts, angle theorems, and one congruence schema.

**Difficulty.** L1 criterion after facts shown; L2 derive one fact; L3 derive two facts then CPCTC target.

**Examples.**

1. Three side pairs given → conclude congruent by SSS. L1.
2. M is midpoint of AB, `AC=BC`, and `CM` is shared: `AM=MB`, `AC=BC`, `CM=CM`, so `△AMC≅△BMC` by SSS. L2.
3. Parallel lines yield alternate angles; vertical angles plus one side → ASA, then CPCTC. L3.

**Distractors and validation.** Invalid criterion, mismatched correspondence, circular CPCTC. Scope-aware theorem checker validates full proof.

### Cross-family progression

Angle sum/exterior/inequality establish triangle constraints. Classification and isosceles facts precede congruence. Criterion recognition comes before correspondence and CPCTC. Short proofs start with all facts visible, then gradually require derived facts. Special segments remain separate until the relevant definitions are secure.

## 5. Category: Similarity, proportionality, and scale

### Category purpose

Build shape-preserving correspondence, proportional side reasoning, and scale effects beyond simple copied ratios.

### Learn

Similar figures have corresponding equal angles and proportional lengths. Triangle similarity criteria are AA, SAS proportionality with included angle, and SSS proportionality. A length scale factor `k` multiplies perimeter by `k`, area by `k²`, and volume by `k³`.

### Prerequisites

Ratios/proportions, triangle correspondence, parallel-line angles.

### Common misconceptions

- Treating similarity as same size.
- Mixing noncorresponding sides in proportions.
- Using additive differences instead of scale factor.
- Applying length scale directly to area/volume.
- Calling SSA proportionality a similarity criterion.
- Assuming figures are similar because they look alike.

### Family `similarity_criterion`

**Task.** Determine whether triangles are provably similar and name AA/SAS/SSS or insufficient.

**Response and template.** Criterion/insufficient: `Do the given facts prove △{one}~△{two}?`

**Derivation.** Bind correspondence and compare angle equality or exact side ratios under criterion schemas.

**Difficulty.** L1 AA; L2 SSS/SAS; L3 insufficient SSA or inconsistent ratios.

**Examples.**

1. Two corresponding angle pairs equal → AA. L1.
2. Sides `3,4,5` and `6,8,10` → SSS similarity, k=2. L2.
3. Two proportional sides and nonincluded angle → insufficient. L3.

**Distractors and validation.** Congruence criterion labels or unmatched ratios. Exact ratio/schema and counterexample validation.

### Family `similarity_correspondence_scale`

**Task.** Determine correspondence and scale factor from similar figures.

**Response and template.** Mapping/rational: `Given △ABC~△{order} and {lengths}, find the scale factor from {source} to {target}.`

**Derivation.** Use ordered vertex mapping; `k=target corresponding length/source`.

**Difficulty.** L1 explicit statement; L2 infer from marks; L3 reversed requested direction/reflection.

**Examples.**

1. `ABC~DEF`, `AB=3,DE=9` → source-to-target k=3. L1.
2. `BC=5,EF=2` → ABC-to-DEF k=`2/5`. L2.
3. In reflected triangles, marks give `AB↔DE`; with `AB=4,DE=7`, ABC-to-DEF scale is `7/4` regardless of orientation. L3.

**Distractors and validation.** Reciprocal or noncorresponding sides. Mapping and exact ratio.

### Family `similar_triangle_missing_side`

**Task.** Find one/more missing corresponding lengths.

**Response and template.** Length: `The figures are similar with {givens}. Find {target}.`

**Derivation.** Build correspondence proportion or multiply by exact scale factor.

**Difficulty.** L1 integer factor; L2 fractional factor; L3 algebraic side expressions.

**Examples.**

1. `3→6`, corresponding `5→x` → `x=10`. L1.
2. Scale `3/4`, source side 10 → target `15/2`. L2.
3. Corresponding sides `x+1↔12`, `5↔8` → k=`8/5`, `x=13/2`. L3.

**Distractors and validation.** Add common difference or cross-match. Exact proportionality and positivity.

### Family `parallel_side_triangle_proportion`

**Task.** Use a segment parallel to a triangle side to establish similarity/proportional division.

**Response and template.** Length/reason: `In △ABC, DE∥BC with D on AB,E on AC. Find {target}.`

**Derivation.** AA gives `△ADE~△ABC`; use `AD/AB=AE/AC=DE/BC` or side-splitter ratios.

**Difficulty.** L1 direct scale; L2 segment parts versus wholes; L3 solve algebraic split.

**Examples.**

1. `AD/AB=1/2`, `BC=10` → `DE=5`. L1.
2. `AD=3,DB=2,AE=6` → `AC=10`. L2.
3. `AD=x,DB=3,AE=8,EC=4` → `x/3=8/4`, `x=6`. L3.

**Distractors and validation.** Pair part with whole inconsistently. Exact coordinate/similarity oracle.

### Family `indirect_measurement_similarity`

**Task.** Build and solve a similar-triangle model from shadows, mirrors, or scaled diagrams.

**Response and template.** Length with unit: `{scenario}. Assuming {parallel_ray_or_angle_facts}, find {target}.`

**Derivation.** Map corresponding vertical/horizontal sides from explicit AA facts, then solve proportion.

**Difficulty.** L1 shadow ratio; L2 units conversion; L3 identify correspondence from diagram.

**Examples.**

1. 1.5 m stick casts 2 m shadow; tree shadow 12 m → tree 9 m. L1.
2. 6 ft person/shadow 4 ft; pole shadow 15 ft → 22.5 ft. L2.
3. Eye height 1.6 m, eye-to-mirror horizontal distance 2 m, mirror-to-wall distance 10 m; equal reflection angles/right angles give AA, so wall height is `1.6·10/2=8 m`. L3.

**Distractors and validation.** Invert only one ratio or use shadow difference. Semantic scenario and dimensional proportionality.

### Family `scale_perimeter_area_volume`

**Task.** Determine how perimeter/area/volume changes under similarity or recover scale.

**Response and template.** Number/ratio: `A similar figure has length scale factor k={k}. What is the {measure} scale factor/value?`

**Derivation.** Dimension `d` measure scales by `k^d`.

**Difficulty.** L1 perimeter; L2 area; L3 volume or inverse root.

**Examples.**

1. k=3 → perimeter factor 3. L1.
2. k=3 → area factor 9. L2.
3. Volume factor 64 → positive length factor 4. L3.

**Distractors and validation.** Use k for every measure or wrong exponent. Exact power/root.

### Family `similarity_proof_step`

**Task.** Complete a short similarity proof and use a resulting proportion.

**Response and template.** Proof table/length: `Complete the proof that {triangles} are similar, then find {target}.`

**Derivation.** Proof DAG establishes AA/SAS/SSS, fixes correspondence, then applies proportional sides.

**Difficulty.** L1 AA reason supplied; L2 derive parallel-line angle; L3 similarity then a secondary length/angle.

**Examples.**

1. Two angle pairs given → AA. L1.
2. Shared angle plus proportional adjacent sides → SAS similarity. L2.
3. Parallel segment yields two angle pairs → AA; scale `2/3`, corresponding side 12 → 8. L3.

**Distractors and validation.** Congruence claim or wrong proportion after correct similarity. Full proof and correspondence oracle.

### Cross-family progression

Criterion recognition and correspondence precede missing-side proportions. Parallel-side triangles connect earlier angle work. Indirect measurement follows direct diagrams. Length/area/volume scaling is interleaved to expose exponent errors. Proof steps consolidate rather than introduce criteria.

## 6. Category: Right triangles and the Pythagorean theorem

### Category purpose

Build exact length/classification reasoning before introducing trigonometric ratios.

### Learn

For a right triangle with legs `a,b` and hypotenuse `c`, `a²+b²=c²`. The converse classifies a triangle from side lengths. Special triangles have fixed ratios: `45-45-90` is `1:1:sqrt(2)` and `30-60-90` is `1:sqrt(3):2`.

### Common misconceptions

- Using the longest side as a leg in `a²+b²=c²`.
- Adding lengths before squaring.
- Applying Pythagoras to a non-right triangle without justification.
- Swapping short/long legs in `30-60-90`.
- Treating approximate decimals as exact special-triangle recognition.

### Family `pythagorean_missing_side`

**Task.** Find a missing leg/hypotenuse in a marked right triangle.

**Response and template.** Exact/decimal length: `A right triangle has {givens}. Find {target}.`

**Derivation.** Identify hypotenuse opposite right angle; solve `c²=a²+b²`, take positive root.

**Difficulty.** L1 integer triple; L2 radical; L3 algebraic side expressions.

**Examples.**

1. Legs 3,4 → hypotenuse 5. L1.
2. Hypotenuse 10, leg 6 → other leg 8. L2.
3. Legs `x,x`, hypotenuse 12 → `x=6sqrt(2)`. L3.

**Distractors and validation.** `a+b`, wrong subtraction, negative root. Exact squared-length identity and positivity.

### Family `pythagorean_converse_classify`

**Task.** Classify a side triple as acute/right/obtuse or invalid.

**Response and template.** Choice: `Classify the triangle with sides {a},{b},{c}.`

**Derivation.** First triangle inequality; with largest `c`, compare `c²` to `a²+b²`.

**Difficulty.** L1 right triple; L2 acute/obtuse; L3 invalid-versus-obtuse distinction.

**Examples.**

1. `5,12,13` → right. L1.
2. `4,5,6`: `36<41` → acute. L2.
3. `2,3,6` → not a triangle, not obtuse. L3.

**Distractors and validation.** Compare wrong largest side or skip feasibility. Exact comparisons.

### Family `special_right_triangle`

**Task.** Find all side lengths from one side/angle in a special right triangle.

**Response and template.** Named lengths: `In the shown {type} triangle, {given}. Find {targets}.`

**Derivation.** Apply exact ratio with correct opposite-angle mapping.

**Difficulty.** L1 45-45-90 leg given; L2 30-60-90 hypotenuse/short leg; L3 long leg given and rationalize.

**Examples.**

1. 45-45-90 leg 5 → other 5, hypotenuse `5sqrt(2)`. L1.
2. 30-60-90 hypotenuse 10 → short 5, long `5sqrt(3)`. L2.
3. Long leg 6 → short `2sqrt(3)`, hypotenuse `4sqrt(3)`. L3.

**Distractors and validation.** Reverse long/short or use additive pattern. Exact ratio.

### Family `rectangle_diagonal_distance`

**Task.** Use a right-triangle decomposition for rectangle/diagonal/bracing distance.

**Response and template.** Length: `{rectangle_or_grid} has sides {a},{b}. Find {diagonal_or_side}.`

**Derivation.** Opposite sides and right corner create legs; apply Pythagoras.

**Difficulty.** L1 diagonal; L2 recover side; L3 nested rectangle/face diagonal.

**Examples.**

1. Rectangle 6×8 → diagonal 10. L1.
2. Diagonal 13, side 5 → other 12. L2.
3. Square diagonal 10 → side `5sqrt(2)`. L3.

**Distractors and validation.** Use area/perimeter or diagonal as leg. Exact coordinate distance.

### Family `right_triangle_altitude_similarity`

**Task.** Use altitude-to-hypotenuse geometric-mean relationships in a marked right triangle.

**Response and template.** Length: `Altitude h splits hypotenuse into p={p},q={q}. Find {target}.`

**Derivation.** `h²=pq`, `leg1²=c p`, `leg2²=c q`, `c=p+q`.

**Difficulty.** L1 altitude; L2 leg; L3 inverse segment.

**Examples.**

1. p=4,q=9 → h=6. L1.
2. p=5,q=20,c=25 → adjacent leg `5sqrt(5)`. L2.
3. h=12,p=9 → q=16,c=25. L3.

**Distractors and validation.** Arithmetic mean or mismatch projection. Similar-triangle/identity oracle.

### Family `pythagorean_theorem_proof_step`

**Task.** Complete an area/similarity proof of Pythagoras.

**Response and template.** Ordered step/reason: `Complete the missing equality in the displayed proof.`

**Derivation.** Use a fixed reviewed rearrangement-area or altitude-similarity proof DAG.

**Difficulty.** L1 expand area expression; L2 equate two area decompositions; L3 similarity proportions sum to theorem.

**Examples.**

1. Large square side `a+b` has area `(a+b)²`. L1.
2. Four triangles plus central square: `(a+b)²=4(ab/2)+c²` → `a²+b²=c²`. L2.
3. `a²=cp,b²=cq,p+q=c` → sum gives `a²+b²=c²`. L3.

**Distractors and validation.** Missing factor 1/2 or unlicensed similarity. Symbolic equality and proof graph.

### Cross-family progression

Direct missing-side calculations precede converse classification. Special triangles are interleaved with Pythagoras but require angle marks. Rectangle applications transfer decomposition. Altitude similarity and proof steps are advanced extensions, not prerequisites for trigonometry.

## 7. Category: Coordinate geometry and transformations

### Category purpose

Connect synthetic relationships with exact coordinates, equations, and rigid/similarity transformations.

### Learn

Distance and midpoint come from coordinate differences. Slope describes direction. Translations, rotations, and reflections preserve lengths/angles; dilations preserve angles and multiply lengths by `|k|`.

### Common misconceptions

- Averaging differences instead of coordinates for midpoint.
- Swapping rise/run or signs.
- Calling equal slopes perpendicular.
- Applying a transformation to one coordinate only.
- Using clockwise rule for counterclockwise rotation.
- Treating dilation as congruence when `|k|≠1`.

### Family `coordinate_midpoint_distance`

**Task.** Find midpoint, distance, or an endpoint.

**Response and template.** Point/length: `Given A={A},B={B}, find {target}.`

**Derivation.** Midpoint averages coordinates; distance `sqrt((dx)²+(dy)²)`; inverse midpoint solves coordinate equations.

**Difficulty.** L1 midpoint; L2 exact distance; L3 missing endpoint.

**Examples.**

1. `(2,3),(6,7)` → midpoint `(4,5)`. L1.
2. `(−1,2),(5,10)` → distance 10. L2.
3. midpoint `(3,1)`, A `(−2,4)` → B `(8,−2)`. L3.

**Distractors and validation.** Average differences or omit square root. Exact coordinate oracle.

### Family `slope_parallel_perpendicular`

**Task.** Compute slope and classify line relationship.

**Response and template.** Rational/choice: `Find the slope of {line}; compare with {other}.`

**Derivation.** `m=dy/dx`; vertical undefined; parallel equal slopes/distinct lines; nonvertical perpendicular product `−1`, with vertical/horizontal special case.

**Difficulty.** L1 slope; L2 parallel/perpendicular; L3 vertical or parameter.

**Examples.**

1. `(1,2),(4,8)` → slope 2. L1.
2. slopes `2/3,−3/2` → perpendicular. L2.
3. line through `(2,1),(2,7)` is vertical and perpendicular to horizontal. L3.

**Distractors and validation.** dx/dy, negative rather than negative reciprocal. Exact direction vectors.

### Family `line_equation_geometry`

**Task.** Construct line equation from point/slope, two points, or parallel/perpendicular condition.

**Response and template.** Equation: `Find an equation of the line {conditions}.`

**Derivation.** Determine slope, use point-slope, normalize accepted equivalent linear equations.

**Difficulty.** L1 point/slope; L2 two points; L3 parallel/perpendicular through point.

**Examples.**

1. slope 3 through `(1,2)` → `y=3x−1`. L1.
2. through `(0,4),(2,0)` → `y=−2x+4`. L2.
3. perpendicular to `2x−3y=6` through `(3,1)` → slope `−3/2`, `y−1=−3/2(x−3)`. L3.

**Distractors and validation.** Use source slope for perpendicular or miss point. Exact point/direction checks.

### Family `apply_coordinate_transformation`

**Task.** Transform points/figures by translation, reflection, rotation, or dilation.

**Response and template.** Point set: `Apply {transformation} to {points}.`

**Derivation.** Use exact coordinate map; rotations limited initially to multiples of 90° about origin or displayed center.

**Difficulty.** L1 translation/reflection axis; L2 rotation/dilation; L3 composition about non-origin center.

**Examples.**

1. `(2,−1)` translated by `(3,4)` → `(5,3)`. L1.
2. `(2,−1)` rotated 90° CCW → `(1,2)`. L2.
3. Dilate `(4,2)` by 1/2 about `(2,0)` → `(3,1)`. L3.

**Distractors and validation.** Clockwise sign or dilate about origin accidentally. Exact affine map.

### Family `identify_transformation`

**Task.** Identify a transformation/mapping from source and image landmarks.

**Response and template.** Choice/parameters: `Which transformation maps {figure} to {image}?`

**Derivation.** Compare distances, orientation, fixed points, displacement, and scale.

**Difficulty.** L1 translation/reflection; L2 rotation center/angle; L3 dilation or two-step composition.

**Examples.**

1. Every point moves `(−2,5)` → translation. L1.
2. `(1,0)→(0,1)` and origin fixed → 90° CCW rotation. L2.
3. Distances from C triple, rays unchanged → dilation center C, factor 3. L3.

**Distractors and validation.** Transformation matching one point only. Apply candidate to all semantic landmarks.

### Family `transformation_congruence_similarity`

**Task.** Decide whether a transformation sequence guarantees congruence, similarity, or neither.

**Response and template.** Choice: `What relationship is guaranteed after {transformations}?`

**Derivation.** Isometries preserve congruence; isometry plus uniform nonunit dilation preserves similarity; nonuniform scaling/shear guarantees neither generally.

**Difficulty.** L1 one isometry; L2 dilation; L3 composition/nonuniform decoy.

**Examples.**

1. Reflection → congruent. L1.
2. Dilation factor 2 → similar, not congruent generally. L2.
3. Horizontal stretch only → neither guaranteed. L3.

**Distractors and validation.** Any transformation means congruent. Transformation invariant classifier.

### Family `coordinate_geometry_proof`

**Task.** Complete a bounded coordinate proof of shape/property.

**Response and template.** Calculation/reason table: `Use coordinates to prove {target_property}.`

**Derivation.** Generated coordinates support proof via slopes, distances, or midpoints; accept alternate valid invariant routes.

**Difficulty.** L1 one pair parallel/equal; L2 classify quadrilateral; L3 combine midpoint and perpendicular/equal-distance facts.

**Examples.**

1. Slopes AB and CD both 2 → segments parallel. L1.
2. Four equal side squared-distances and one right angle → square. L2.
3. Diagonals share midpoint and have equal lengths → rectangle under parallelogram theorem. L3.

**Distractors and validation.** Visual coordinate plot or insufficient subset. Exact invariant/theorem proof checker.

### Cross-family progression

Midpoint/distance and slope precede line construction. Direct transformations precede identification and invariant classification. Coordinate proofs come last and accept multiple exact routes rather than one prescribed calculation.

## 8. Category: Polygons and circles

### Category purpose

Build property classification and angle/length reasoning in common planar figures and circles.

### Learn

An n-gon’s interior-angle sum is `(n−2)180°`; one exterior angle of a regular n-gon is `360°/n`. Circle angle facts relate central/inscribed angles and intercepted arcs. Tangents are perpendicular to radii at contact.

### Common misconceptions

- Assuming every quadrilateral with equal-looking sides is a special type.
- Using `360°` as interior sum for every polygon.
- Confusing central and inscribed angle factors.
- Measuring tangent angle from the tangent rather than intercepted arc theorem.
- Treating diameter, chord, and radius as interchangeable.

### Family `quadrilateral_properties`

**Task.** Classify a quadrilateral or select guaranteed properties from marks/givens.

**Response and template.** Choice/multiple-choice: `Given {facts}, what is the most specific guaranteed classification/property?`

**Derivation.** Apply versioned hierarchy for parallelogram, rectangle, rhombus, square, trapezoid, kite.

**Difficulty.** L1 definitions; L2 converse property; L3 overlapping hierarchy/insufficient facts.

**Examples.**

1. Four right angles → rectangle. L1.
2. Parallelogram with perpendicular diagonals → rhombus. L2.
3. Equal diagonals alone → insufficient to guarantee rectangle. L3.

**Distractors and validation.** Converse not valid or overly specific subtype. Constructive counterexample for insufficiency.

### Family `polygon_angle_sum`

**Task.** Find polygon angle sum, missing angle, or number of sides.

**Response and template.** Degree/integer: `For a {n_or_description}-gon, find {target}.`

**Derivation.** Interior sum `(n−2)180`; exterior turning sum `360`; solve inverse exactly.

**Difficulty.** L1 sum; L2 missing angle; L3 infer n.

**Examples.**

1. Hexagon interior sum `720°`. L1.
2. Quadrilateral angles `80,90,100,x` → `x=90°`. L2.
3. Interior sum `1620°` → n=11. L3.

**Distractors and validation.** `n·180` or `(n−1)180`. Exact formula/integer check.

### Family `regular_polygon_angles`

**Task.** Find interior/exterior/central angle or number of sides of a regular polygon.

**Response and template.** Degree/integer: `A regular n-gon has {given}. Find {target}.`

**Derivation.** Exterior/central `360/n`; interior `180−360/n`.

**Difficulty.** L1 direct; L2 inverse; L3 compare diagonal symmetry/turning.

**Examples.**

1. Regular octagon exterior `45°`. L1.
2. Interior `150°` → exterior 30°, n=12. L2.
3. Central angle `24°` → n=15. L3.

**Distractors and validation.** Divide 180 by n or invert interior directly. Exact positive integer n.

### Family `circle_parts_relationships`

**Task.** Identify radius/diameter/chord/secant/tangent/arc or use basic radius/diameter facts.

**Response and template.** Matching/length: `Identify {marked_object} or find {target}.`

**Derivation.** Query circle incidence/intersection counts and center endpoints.

**Difficulty.** L1 identify; L2 radius/diameter; L3 tangent-radius perpendicular relation.

**Examples.**

1. Segment center-to-circle → radius. L1.
2. Radius 7 → diameter 14. L2.
3. OT radius to tangent at T → `∠OTL=90°`. L3.

**Distractors and validation.** Chord as diameter without center incidence. Exact circle-scene facts.

### Family `arc_central_inscribed_angle`

**Task.** Relate arc, central angle, and inscribed angle.

**Response and template.** Degree: `Given {arc_or_angle}, find {target}.`

**Derivation.** Central angle equals intercepted minor arc; inscribed angle is half intercepted arc.

**Difficulty.** L1 direct; L2 inverse; L3 several arcs/semicircle.

**Examples.**

1. Arc AB `100°` → central `∠AOB=100°`. L1.
2. Same arc → inscribed angle `50°`. L2.
3. Angle subtending diameter → `90°`. L3.

**Distractors and validation.** Double/half reversed or use adjacent arc. Exact endpoint/intercept map.

### Family `circle_chord_tangent_angles`

**Task.** Use tangent-chord, intersecting-chord, or external secant angle theorem.

**Response and template.** Degree: `Given arcs {values}, find angle {target}.`

**Derivation.** Tangent-chord/inside inscribed variant half arc; two chords inside half sum; outside tangent/secant half positive difference.

**Difficulty.** L1 tangent-chord; L2 intersect inside; L3 outside difference.

**Examples.**

1. Tangent-chord intercepts arc 120° → angle 60°. L1.
2. Chords intersect inside with arcs 80°,40° → angle 60°. L2.
3. External secants arcs 170°,70° → angle 50°. L3.

**Distractors and validation.** Sum instead of difference or omit half. Exact arc-angle theorem.

### Family `circle_power_length`

**Task.** Find segment lengths using chord-chord, secant-secant, or tangent-secant power.

**Response and template.** Length: `Given {segments}, find {unknown}.`

**Derivation.** Inside `a·b=c·d`; outside `external·whole` products; tangent²=`external·whole`.

**Difficulty.** L1 chord products; L2 secant whole distinction; L3 tangent/secant.

**Examples.**

1. Chords pieces 3,8 and 4,x → x=6. L1.
2. Secants external 2 whole 10; external 4 whole x → x=5. L2.
3. Tangent 6, secant external 3 → whole 12. L3.

**Distractors and validation.** external·internal instead of whole or additive relation. Exact power equality/positive geometry.

### Family `circle_sector_arc_length`

**Task.** Find circumference, arc length, sector area, or missing central angle.

**Response and template.** Exact/decimal measure: `Circle radius {r}, central angle {theta}. Find {target}.`

**Derivation.** `C=2πr`, arc fraction `θ/360`, sector area fraction of `πr²`.

**Difficulty.** L1 circumference; L2 arc/sector; L3 inverse angle/radius.

**Examples.**

1. r=5 → circumference `10π`. L1.
2. r=6, θ=60° → arc `2π`, sector `6π`. L2.
3. Sector area `12π` in r=6 circle → θ=120°. L3.

**Distractors and validation.** Use diameter as radius or mix length/area formula. Exact dimensional formula.

### Cross-family progression

Quadrilateral properties and polygon sums begin with explicit givens. Circle parts precede all circle theorems. Central/inscribed facts precede chord/tangent angles, then length power. Sector measures connect angle fractions to measurement.

## 9. Category: Perimeter, area, surface area, and volume

### Category purpose

Build decomposition, dimensional units, and formula selection for exact and applied measurement.

### Learn

Perimeter measures boundary length; area measures two-dimensional coverage; volume measures three-dimensional space. Composite figures are split into nonoverlapping known pieces or found by subtraction. Keep linear, square, and cubic units distinct.

### Common misconceptions

- Confusing perimeter and area.
- Omitting a boundary segment in a composite perimeter.
- Using diameter as radius.
- Forgetting `1/2` in triangle area.
- Adding overlapping component areas.
- Mixing lateral/total surface area or radius/diameter.
- Scaling area/volume linearly.

### Family `perimeter_composite_boundary`

**Task.** Find perimeter/circumference of polygonal or arc-bounded figures.

**Response and template.** Length with unit: `Find the perimeter of {semantic_shape}.`

**Derivation.** Traverse exterior boundary once, summing exact segment/arc lengths; exclude internal/shared edges.

**Difficulty.** L1 rectangle/polygon; L2 missing side; L3 composite with semicircle/notch.

**Examples.**

1. Rectangle 5×3 → perimeter 16. L1.
2. L-shape from 6×4 rectangle with corner notch 2×1 → perimeter 20. L2.
3. Rectangle width 6 topped by semicircle diameter 6, other sides 4,4,6 → `14+3π`. L3.

**Distractors and validation.** Area formula, include diameter twice, or internal edge. Boundary graph oracle.

### Family `area_triangle_quadrilateral`

**Task.** Find area of triangle, parallelogram, trapezoid, rhombus/kite, or regular simple figure.

**Response and template.** Area: `Find the area given {base_height_diagonals}.`

**Derivation.** Apply appropriate formula using perpendicular height, not slanted side.

**Difficulty.** L1 rectangle/triangle; L2 trapezoid/parallelogram; L3 diagonal formula or missing dimension.

**Examples.**

1. Triangle base 8, height 5 → 20. L1.
2. Trapezoid bases 6,10, height 4 → 32. L2.
3. Rhombus diagonals 12,16 → 96. L3.

**Distractors and validation.** Omit half/average or use slant height. Polygon coordinate-area cross-check.

### Family `composite_area`

**Task.** Add/subtract exact component areas.

**Response and template.** Area: `Find the shaded/composite area of {scene}.`

**Derivation.** Use semantic constructive-solid-geometry regions; sum disjoint pieces or outer minus holes.

**Difficulty.** L1 two rectangles; L2 rectangle/triangle/circle; L3 overlapping/nonshaded holes with π.

**Examples.**

1. 6×4 rectangle plus 2×3 rectangle, nonoverlapping → 30. L1.
2. 10×8 rectangle minus radius-2 circle → `80−4π`. L2.
3. Square side 10 minus four quarter-circles radius 5 → `100−25π`. L3.

**Distractors and validation.** Wrong included region or overlap counted twice. Exact region decomposition/raster test during development.

### Family `regular_polygon_area`

**Task.** Find regular-polygon area using apothem/perimeter or decompose into triangles.

**Response and template.** Area: `Regular n-gon has {side_or_perimeter} and apothem {a}. Find area.`

**Derivation.** `A=1/2·apothem·perimeter`.

**Difficulty.** L1 perimeter supplied; L2 side/n supplied; L3 inverse apothem/side.

**Examples.**

1. P=30,a=4 → A=60. L1.
2. Hexagon side 6, apothem `3sqrt(3)` → `54sqrt(3)`. L2.
3. A=120,P=40 → apothem 6. L3.

**Distractors and validation.** Omit half or use n as perimeter. Exact triangulation.

### Family `prism_cylinder_volume_surface`

**Task.** Find volume/lateral/total surface area of prism or cylinder.

**Response and template.** Measure with unit: `{solid} has {dimensions}. Find {target}.`

**Derivation.** `V=Bh`; prism lateral area `perimeter(base)h`; cylinder `V=πr²h`, lateral `2πrh`, total adds two bases.

**Difficulty.** L1 volume; L2 surface area; L3 missing dimension.

**Examples.**

1. Rectangular prism 2×3×5 → volume 30. L1.
2. Cylinder r=3,h=4 → total area `42π`. L2.
3. Cylinder volume `100π`, r=5 → h=4. L3.

**Distractors and validation.** Circumference as base area or omit bases. Exact solid formula/dimensions.

### Family `pyramid_cone_sphere`

**Task.** Find volume/surface area of pyramid, cone, or sphere with declared slant/perpendicular values.

**Response and template.** Measure: `{solid} has {givens}. Find {target}.`

**Derivation.** Pyramid/cone volume `Bh/3`; cone lateral `πrℓ`; sphere area `4πr²`, volume `4πr³/3`.

**Difficulty.** L1 volume; L2 surface area; L3 find slant height/right-triangle component first.

**Examples.**

1. Cone r=3,h=4 → volume `12π`. L1.
2. Sphere r=3 → area `36π`, volume `36π`. L2.
3. Cone r=5,h=12 → slant 13, total area `90π`. L3.

**Distractors and validation.** Missing third or confuse h/ℓ. Exact formula and Pythagorean check.

### Family `measurement_units_scaling`

**Task.** Convert linear/square/cubic units or determine scaling effect.

**Response and template.** Converted measure: `Convert {value} {source_unit} to {target_unit}.`

**Derivation.** Raise linear conversion factor to dimension; similarity uses `k^d`.

**Difficulty.** L1 length; L2 area; L3 volume/mixed scale.

**Examples.**

1. 2 m = 200 cm. L1.
2. 2 m² = 20,000 cm². L2.
3. 0.5 m³ = 500 L. L3.

**Distractors and validation.** Apply linear factor once to area/volume. Unit-dimension oracle and round-trip.

### Cross-family progression

Boundary and basic area precede composite regions. Regular-polygon area follows polygon structure. Prism/cylinder precede pyramid/cone/sphere. Units and scale are interleaved with every dimension rather than isolated at the end.

## 10. Category: Right-triangle trigonometry

### Category purpose

Build ratio selection, inverse-angle reasoning, and diagram modeling for right triangles.

### Learn

Relative to acute angle `θ`, label opposite, adjacent, and hypotenuse first. Then choose the ratio containing the known and requested sides. Use inverse trig to find an angle. Calculator mode must match degrees/radians.

### Common misconceptions

- Opposite/adjacent treated as permanent side names rather than relative to θ.
- Hypotenuse chosen by appearance instead of opposite the right angle.
- Swapping sine/cosine or using tangent with hypotenuse.
- Applying inverse trig to a side length rather than a ratio.
- Calculator radian/degree mismatch.
- Using elevation angle from vertical instead of horizontal.

### Family `right_triangle_side_labels`

**Task.** Identify opposite, adjacent, and hypotenuse relative to a marked acute angle.

**Response and template.** Matching: `Relative to θ, label the three sides.`

**Derivation.** Hypotenuse opposite right angle; opposite does not touch θ; remaining leg adjacent.

**Difficulty.** L1 standard orientation; L2 rotated/reflected; L3 switch reference angle in same triangle.

**Examples.**

1. For angle A, side across from A → opposite. L1.
2. Long side opposite 90° → hypotenuse regardless rotation. L2.
3. Switching from angle A to B swaps opposite/adjacent, not hypotenuse. L3.

**Distractors and validation.** Visual horizontal/vertical labels. Vertex-edge incidence oracle.

### Family `choose_trig_ratio`

**Task.** Select sine/cosine/tangent equation for known/requested sides.

**Response and template.** Formula choice: `Which equation should be used to find {target}?`

**Derivation.** Map side roles relative to θ and select ratio containing both.

**Difficulty.** L1 ratio name; L2 equation with variable; L3 choose efficient ratio amid extra side.

**Examples.**

1. Opposite/hypotenuse → sine. L1.
2. Adjacent 8, hypotenuse x → `cosθ=8/x`. L2.
3. Opposite 5 and adjacent 12 known, find θ → `tanθ=5/12`. L3.

**Distractors and validation.** SOH/CAH/TOA role swap. Semantic side-role equation.

### Family `right_triangle_find_side`

**Task.** Find a side using one acute angle and one side.

**Response and template.** Length: `In the right triangle, {givens}. Find {target}; round {rule}.`

**Derivation.** Choose ratio, solve algebraically, evaluate in declared degree mode.

**Difficulty.** L1 special angle/exact; L2 calculator decimal; L3 choose ratio and multiunit context.

**Examples.**

1. θ=30°, hypotenuse 10 → opposite 5. L1.
2. θ=40°, adjacent 8 → opposite `8tan40°≈6.71`. L2.
3. θ=52°, opposite 12 → hypotenuse `12/sin52°≈15.23`. L3.

**Distractors and validation.** Multiply instead of divide or wrong ratio/mode. Independent high-precision trig and Pythagorean plausibility.

### Family `right_triangle_find_angle`

**Task.** Find an acute angle from two sides.

**Response and template.** Degree: `Given {side_lengths}, find θ to {precision}.`

**Derivation.** Form correct positive ratio and apply principal inverse trig.

**Difficulty.** L1 special ratio; L2 decimal; L3 choose ratio and complementary check.

**Examples.**

1. opposite 1, hypotenuse 2 → θ=30°. L1.
2. opposite 7, adjacent 9 → `θ=atan(7/9)≈37.9°`. L2.
3. adjacent 5, hypotenuse 13 → `θ=acos(5/13)≈67.4°`. L3.

**Distractors and validation.** Ratio inverted or ordinary sin instead of arcsin. High-precision inverse and `(0,90°)`.

### Family `elevation_depression`

**Task.** Construct/solve a right triangle from elevation/depression with horizontal reference.

**Response and template.** Length/angle: `{observer scenario}. Find {target}; assume level horizontal.`

**Derivation.** Transfer depression/elevation by alternate interior angles where horizontals parallel; choose trig ratio.

**Difficulty.** L1 direct height; L2 observer height; L3 depression and horizontal distance.

**Examples.**

1. 30° elevation, horizontal distance 20 → height `20tan30°=20/sqrt(3)`. L1.
2. Eye height 1.6 m plus `25tan40°` → total about 22.58 m. L2.
3. Depression 15° to point 50 m horizontally away → drop `50tan15°≈13.40 m`. L3.

**Distractors and validation.** Angle from vertical or omit eye height. Semantic axes and trig oracle.

### Family `bearing_navigation_triangle`

**Task.** Resolve a right-triangle displacement or determine bearing under an explicit convention.

**Response and template.** Components/length/bearing: `Travel {description}. Find {target}.`

**Derivation.** Convert bearing to angle from named axis, resolve sine/cosine components, then Pythagoras/inverse tangent.

**Difficulty.** L1 quadrant bearing components; L2 resultant of perpendicular legs; L3 three-digit bearing conversion.

**Examples.**

1. 10 km `N 30° E` → east 5, north `5sqrt(3)`. L1.
2. 6 km east then 8 north → distance 10, bearing `N 36.87° E`. L2.
3. Bearing 120° (clockwise from north), distance 20 → east `10sqrt(3)`, north `−10`. L3.

**Distractors and validation.** Swap north/east components or measure bearing from east. Vector/component oracle.

### Family `right_trig_model_selection`

**Task.** Decide whether Pythagoras, a trig ratio, similarity, or insufficient data is the appropriate model.

**Response and template.** Choice/reason: `Which method can determine {target} from the marked givens?`

**Derivation.** Inspect right-angle fact, known sides/angles, and similarity marks; verify method preconditions.

**Difficulty.** L1 two sides; L2 side+acute angle; L3 non-right/underdetermined decoy.

**Examples.**

1. Two right-triangle sides → Pythagoras. L1.
2. One side and one acute angle → trig ratio. L2.
3. Two sides in an unmarked non-right triangle → neither right-trig nor Pythagoras; insufficient without included angle/other fact. L3.

**Distractors and validation.** Formula availability without hypothesis. Model-precondition checker.

### Cross-family progression

Side labeling precedes ratio mnemonics. Formula selection is interleaved before numeric side/angle solving. Contexts come only after direct diagrams. Bearings remain separate until axis-angle conventions are mastered. Model selection prevents automatic trig use.

## 11. Category: General trigonometry and non-right triangles

### Category purpose

Extend trigonometry from acute right triangles to rotation, periodic functions, identities, equations, and arbitrary triangles.

### Learn

On the unit circle, `(cosθ,sinθ)` gives coordinates. Reference angles provide exact values and quadrant gives sign. Radians measure arc-length/radius. The sine/cosine laws solve non-right triangles when enough compatible data are known; SSA may give zero, one, or two triangles.

### Common misconceptions

- Converting degrees/radians with reciprocal factor.
- Treating `π` as 180 rather than `π radians=180°`.
- Using reference-angle magnitude without quadrant sign.
- Claiming tangent is defined when cosine is zero.
- Confusing graph amplitude and period.
- Dividing a trig equation without preserving zero cases.
- Assuming SSA always has one solution.
- Pairing a side with the wrong opposite angle in sine law.

### Family `degree_radian_conversion`

**Task.** Convert exact degree/radian measures.

**Response and template.** Exact angle: `Convert {angle} to {unit}.`

**Derivation.** Multiply degrees by `π/180`; radians by `180/π`; reduce rational coefficient.

**Difficulty.** L1 standard; L2 negative/over-rotation; L3 solve relation/arc context.

**Examples.**

1. `60°=π/3 rad`. L1.
2. `−225°=−5π/4 rad`. L2.
3. `7π/6 rad=210°`. L3.

**Distractors and validation.** Reciprocal factor or omit π. Exact rational-π oracle.

### Family `coterminal_reference_quadrant`

**Task.** Normalize angle, find reference angle, and identify quadrant/axis.

**Response and template.** Named fields: `For θ={angle}, find a coterminal angle in {range}, quadrant, and reference angle.`

**Derivation.** Reduce modulo full turn, classify terminal ray, compute acute distance to nearest x-axis.

**Difficulty.** L1 first turn; L2 negative/multiple turns; L3 radians/axis cases.

**Examples.**

1. 150° → QII, reference 30°. L1.
2. −210° → coterminal 150°, QII, reference 30°. L2.
3. `13π/6` → `π/6`, QI, reference `π/6`. L3.

**Distractors and validation.** Distance to y-axis or quadrant before normalization. Exact modular angle.

### Family `unit_circle_exact_values`

**Task.** Give exact sine/cosine/tangent for standard-position special angles.

**Response and template.** Named exact fields: `Find sinθ, cosθ, tanθ for θ={angle}.`

**Derivation.** Reference-triangle magnitude plus quadrant sign; tangent ratio where defined.

**Difficulty.** L1 QI; L2 other quadrant; L3 axis/undefined tangent or negative coterminal.

**Examples.**

1. `π/6` → sin `1/2`, cos `sqrt(3)/2`, tan `sqrt(3)/3`. L1.
2. `3π/4` → sin `sqrt(2)/2`, cos `−sqrt(2)/2`, tan `−1`. L2.
3. `3π/2` → sin `−1`, cos `0`, tan undefined. L3.

**Distractors and validation.** Swap coordinates/sign or give tangent 0 at vertical. Exact lookup derived from coordinates.

### Family `unit_circle_point_angle`

**Task.** Recover trig values/angle from an exact unit-circle point.

**Response and template.** Angle/values: `Point P={point} lies on unit circle. Find {target} in {domain}.`

**Derivation.** `x=cosθ,y=sinθ`; use signs/reference values and requested interval.

**Difficulty.** L1 coordinate read; L2 angle in `[0,2π)`; L3 non-special coordinate gives inverse-form/approx.

**Examples.**

1. `(0,1)` → θ=`π/2`. L1.
2. `(−sqrt(3)/2,1/2)` → θ=`5π/6`. L2.
3. `(3/5,−4/5)` → cos `3/5`, sin `−4/5`, θ=`2π−atan(4/3)`. L3.

**Distractors and validation.** Swap sin/cos or choose reference angle only. Coordinate/norm and interval check.

### Family `basic_trig_identities`

**Task.** Complete/use reciprocal, quotient, parity, or Pythagorean identities in one/two steps.

**Response and template.** Expression/value: `Given {trig_value_and_quadrant}, find {target} exactly.`

**Derivation.** Use `sin²+cos²=1`, `tan=sin/cos`, reciprocal functions if enabled, and quadrant sign.

**Difficulty.** L1 identity completion; L2 missing value with sign; L3 simplify bounded expression.

**Examples.**

1. `sin²θ=9/25`, θ QII → `cosθ=−4/5`. L1.
2. sin `5/13`, cos `12/13` → tan `5/12`. L2.
3. `(1−sin²x)/cos x=cos x` where `cos x≠0`. L3.

**Distractors and validation.** Missing square root sign/quadrant or `sin²+cos²=2`. Exact identity/domain.

### Family `trig_graph_features`

**Task.** Determine/match amplitude, period, phase/vertical shift, midline, or key points.

**Response and template.** Named fields/graph choice: `For y={trig_rule}, find {features}.`

**Derivation.** For `A sin(B(x−C))+D`/cos: amplitude `|A|`, period `2π/|B|`, phase C, midline D; tangent period `π/|B|`.

**Difficulty.** L1 amplitude/midline; L2 period; L3 match transformations/key points.

**Examples.**

1. `y=3sin x−2` → amplitude 3, midline −2. L1.
2. `y=cos(2x)` → period π. L2.
3. `y=−2sin(3(x−π/6))+1` → amplitude 2, period `2π/3`, shift right `π/6`, midline 1. L3.

**Distractors and validation.** Signed amplitude or period `2πB`. Exact landmark sampler/render check.

### Family `solve_trig_equation_bounded`

**Task.** Solve a basic trig equation on a displayed finite interval.

**Response and template.** Finite angle set: `Solve {equation} for θ in {interval}.`

**Derivation.** Isolate trig function, find reference angle, enumerate quadrants within interval, include endpoints as declared.

**Difficulty.** L1 special sin/cos; L2 tan/multiple solutions; L3 factor simple trig polynomial without dividing away roots.

**Examples.**

1. `sinθ=1/2`, `[0,2π)` → `{π/6,5π/6}`. L1.
2. `tanθ=−1`, `[0,2π)` → `{3π/4,7π/4}`. L2.
3. `2sin²θ−sinθ=0` → sinθ=0 or 1/2; `{0,π/6,5π/6,π}` in `[0,2π)`. L3.

**Distractors and validation.** Reference angle only, wrong quadrants, or lost zero factor. Exact evaluation and interval enumeration.

### Family `law_of_sines`

**Task.** Solve a non-right triangle from AAS/ASA or a nonambiguous side-angle pair.

**Response and template.** Side/angle: `In △ABC, {givens}. Use the sine law to find {target}.`

**Derivation.** Pair `a/sinA=b/sinB=c/sinC`; find missing angle by sum first when needed.

**Difficulty.** L1 one side; L2 angle then side; L3 recognize unavailable/ambiguous SSA handoff.

**Examples.**

1. A=30°,B=60°,a=5 → `b=5sqrt(3)`. L1.
2. A=45°,C=75°,a=8 → B=60°, `b=8sin60/sin45=4sqrt(6)`. L2.
3. Given A=30°,a=5,b=8 → SSA may have two cases; use ambiguous-case family. L3.

**Distractors and validation.** Mismatched opposite pair or sine reciprocal. High-precision triangle reconstruction.

### Family `law_of_cosines`

**Task.** Find a side from SAS/SSS or an angle from three sides.

**Response and template.** Side/angle: `In △ABC, {givens}. Use the cosine law to find {target}.`

**Derivation.** `c²=a²+b²−2ab cosC`; inverse cosine for angle, largest-side consistency.

**Difficulty.** L1 special included angle; L2 decimal side; L3 SSS angle/classification.

**Examples.**

1. a=3,b=4,C=90° → c=5. L1.
2. a=7,b=10,C=60° → `c=sqrt(79)`. L2.
3. sides 5,7,8 → `cos C=(25+49−64)/(70)=1/7`, `C≈81.79°` opposite side 8. L3.

**Distractors and validation.** Plus cosine term or nonincluded angle. Exact/numeric reconstruction and triangle inequality.

### Family `ssa_ambiguous_case`

**Task.** Determine zero/one/two triangles for SSA and solve all valid cases.

**Response and template.** Count plus fields: `Given A={A},a={a},b={b}, determine all triangles.`

**Derivation.** Compute `s=b sinA/a`; if outside `[-1,1]` none; candidate `B1=asin(s)`, `B2=180°−B1`; retain cases with `A+B<180°`.

**Difficulty.** L1 no/one by height reasoning; L2 two triangles; L3 solve remaining parts for both.

**Examples.**

1. A=30°,a=3,b=8 → `b sinA=4>a`, no triangle. L1.
2. A=30°,a=5,b=8 → `sinB=0.8`, both `B≈53.13°` and `126.87°` valid. L2.
3. A=40°,a=10,b=12 → `(B,C,c)≈(50.47°,89.53°,15.56)` or `(129.53°,10.47°,2.83)`. L3.

**Distractors and validation.** Principal arcsin only or always supplement. Reconstruct every candidate and verify positive angle sum/sine law.

### Family `triangle_area_trig`

**Task.** Find area or a missing included angle using `K=1/2 ab sinC`.

**Response and template.** Area/angle: `Given two sides and included angle, find {target}.`

**Derivation.** Substitute included side pair/opposite included angle; inverse sine cases bounded by triangle context.

**Difficulty.** L1 special angle; L2 decimal; L3 inverse/compare possible angles.

**Examples.**

1. a=6,b=8,C=30° → area 12. L1.
2. a=9,b=11,C=70° → area `49.5sin70°≈46.52`. L2.
3. area 24, a=6,b=10 → `sinC=.8`, so C may be `53.13°` or `126.87°` absent more data. L3.

**Distractors and validation.** Omit half/use nonincluded angle. Coordinate cross-product area validation.

### Cross-family progression

Degree/radian conversion precedes unit-circle work. Reference angles precede exact values and equations. Identities remain short and structural. Graph features follow transformations from Functions. Sine law starts with AAS/ASA; cosine law handles SAS/SSS; SSA ambiguity is deliberately separate and advanced.

## 12. Topic-wide progression

Recommended order:

1. diagram marks, naming, segment/angle addition, complements/supplements;
2. vertical angles, parallel transversals, triangle sums, classification/inequality;
3. congruence criteria, correspondence, isosceles facts, and short proofs;
4. similarity, proportions, parallel-side triangles, and scale effects;
5. Pythagorean theorem, special triangles, coordinate distance/slope;
6. transformations, quadrilaterals, polygons, and basic measurement;
7. circle angle/length theorems and composite/solid measurement;
8. right-triangle side labels, ratio selection, side/angle solving, contexts;
9. radians, unit circle, exact values, identities, and trig graphs/equations;
10. sine/cosine laws, SSA ambiguity, and mixed synthetic-coordinate proof.

Prerequisite gates:

- explicit-mark reading gates every diagram category;
- angle pairs gate parallel lines;
- triangle angle/side facts gate congruence;
- correspondence gates CPCTC and similarity proportions;
- similarity/proportions gate indirect measurement and altitude theorems;
- Pythagoras gates coordinate distance and right trig;
- algebraic interval/function fluency gates trig equations/graphs;
- unit-circle exact values gate identities and bounded trig equations;
- triangle labeling/opposite pairs gate sine/cosine laws.

Interleave:

- theorem recognition with calculation;
- valid criteria with near-miss insufficient information;
- diagrams with accessible fact lists;
- forward facts with converse questions;
- congruence/similarity correspondence in both orientations;
- exact special-angle answers with calculator-appropriate non-special cases;
- formula use with model-selection/precondition questions;
- proof steps with direct theorem drills.

## 13. Adaptive practice guidance

Track:

`family`, `theorem`, `theoremDirection`, `diagramRepresentation`, `markType`, `correspondence`, `orientation`, `angleUnit`, `exactApproxMode`, `triangleDataPattern`, `solutionCaseCount`, `proofDepth`, `algebraLoad`, `modelChoice`, and `misconception`.

| Error pattern | Diagnosis | Follow-up |
|---|---|---|
| assumes unmarked parallel/equal/right | appearance treated as fact | fact-versus-assumption item |
| angle vertex not middle | notation structure | ray-pair naming |
| uses 90 for supplement | complement/supplement swap | paired sum classification |
| corresponding/alternate confused | transversal position | rotate same topology across layouts |
| uses theorem without parallel given | precondition missed | theorem versus converse/fact checklist |
| triangle angles sum 360 | polygon rule overgeneralized | triangle decomposition |
| accepts SSA/AAA congruence | sufficiency misconception | construct two possible triangles/similar-size contrast |
| wrong corresponding side | vertex mapping lost | correspondence-only matching before proportion |
| CPCTC used first | proof dependency reversed | congruence-gate proof table |
| area scales by k | dimension scaling | same figures: length/perimeter/area fields |
| Pythagoras on unmarked triangle | model precondition missed | right-angle evidence diagnostic |
| hypotenuse chosen by length on picture | visual rather than opposite 90° | rotated triangles |
| midpoint formula uses differences | coordinate operation swap | midpoint versus displacement pair |
| horizontal shift sign wrong | input transformation | landmark mapping |
| inscribed angle equals arc | missing half | central/inscribed contrast |
| secant product uses internal not whole | segment definition | label external/internal/whole |
| perimeter includes shared edge | boundary tracing | selectable boundary walk |
| area answer has linear units | dimension/units | unit-type matching |
| opposite/adjacent fixed globally | reference-angle dependence | same triangle, switch θ |
| degree/radian mismatch | mode conversion | special value in both units |
| reference-angle value has wrong sign | quadrant ignored | coordinate-sign table |
| one trig solution only | quadrant enumeration | reference angle plus interval |
| sine law pairs wrong side/angle | opposite mapping | triangle label matching |
| SSA returns principal case only | ambiguous case | height/candidate enumeration |

Selection after prerequisites: 35% weakest misconception/family, 25% spaced mastery, 15% representation transfer, 10% theorem preconditions, 10% proof/error diagnosis, 5% mixed synthesis.

When algebra is wrong after geometry setup is correct, preserve geometry mastery and schedule a simpler algebra-linked item. When a learner measures a drawing accurately but ignores facts, do not credit the accidental number; diagnose diagram semantics.

## 14. Feedback and worked solutions

Worked solutions should:

1. list givens/marks and explicitly reject tempting unmarked assumptions;
2. identify the target object and correspondence/reference angle;
3. name the theorem/model with its preconditions;
4. show the proportion/equation or proof dependency;
5. calculate exactly before optional decimal approximation;
6. attach correct units;
7. verify angle sum, length positivity, triangle inequality, substitution, coordinate invariant, or reconstructed diagram.

Diagnostic feedback examples:

> The angles occupy corresponding positions, but the theorem requires the two crossed lines to be parallel. No parallel marks or given are present.

> `SSA` does not generally determine one triangle. The same data can place the third vertex in two positions.

> The scale factor 3 applies to lengths. Area uses `3²=9`.

> Relative to θ, the side of length 8 is adjacent, not opposite. Use cosine with the hypotenuse.

> `sinθ=1/2` has two solutions on `[0,2π)`: the reference angle is `π/6`, in quadrants I and II.

Do not say an alternative proof is wrong because it differs from the generated proof. Show the shortest supported path after validating the learner’s path.

## 15. Rendering, interaction, and accessibility

- Generate SVG from semantic geometry; never infer answers from SVG coordinates.
- Use collision-aware labels, consistent mark styles, sufficient contrast, and scalable strokes.
- Marks remain distinguishable without color and at 200% zoom.
- Every diagram exposes a structured fact list and target description.
- Keyboard users can focus points, segments, angles, arcs, regions, and proof lines.
- Screen readers hear angle vertex order, segment versus length, parallel/perpendicular, degree/radian, squared/cubed units, and open/closed solution interval.
- Coordinate graphs show axes, scales, grid interval, and exact landmark table.
- 3D drawings identify hidden edges and provide face/dimension text; perspective is never quantitative.
- Proof tables expose dependency/citation fields.
- Calculator-required prompts say so and display angle mode.

## 16. Generator and implementation requirements

### Exact semantic geometry

Use exact rationals/quadratic radicals where feasible:

```text
Point2 := { x: AlgebraicExact, y: AlgebraicExact }
Line2  := normalized Ax+By+C=0
Circle := { center: Point2, radiusSquared: AlgebraicExact }
Fact   := typed predicate with object IDs
Proof  := DAG<Fact, theoremApplication>
```

Coordinate predicates use determinants/dot products/squared distances exactly. Trig numeric functions use a documented local high-precision implementation.

### Scene generation and layout

- Construct theorem facts before coordinates.
- Realize scenes from reviewed templates or constraint solving with strict postchecks.
- Apply benign rotations/reflections/scales to vary appearance without changing reasoning.
- Prevent accidental equalities, parallelisms, right angles, tangencies, and concurrencies that could create alternate answers unless intentionally accepted.
- Keep minimum visual angle/segment separation and label clearance.
- Diagrams declared not-to-scale may vary proportions, but must not visually contradict facts so severely that the UI becomes hostile.

### Proof engine

The local checker performs typed theorem-schema unification, correspondence binding, and dependency validation. It must:

- accept alternate valid facts/proof orders;
- reject circular reasoning;
- distinguish theorem and converse;
- enforce criterion preconditions such as included angle and right-triangle status;
- prevent CPCTC before congruence;
- produce a minimal reason for rejection.

### Numerical safeguards

- Generate backward from exact special values where mental exactness is intended.
- Avoid triangles with angle below `5°` or above `175°` in numeric work unless limiting behavior is the target.
- Avoid sine-law/cosine-law cases where rounding changes case count.
- Retain unrounded values through all trig steps.
- Validate inverse-trig arguments within `[-1,1]` with tolerance only for numerical noise.
- Distinguish undefined tangent from overflow.

### Offline constraint

All generation, proof checking, geometry rendering, and trig calculation runs in the standalone HTML/JS/CSS page. No backend, remote dynamic-geometry system, runtime CAS, map service, or network lookup is required.

## 17. Automated validation

For every instance:

- all named objects exist and every label/placeholder is substituted;
- all incidence, order, congruence, parallel, perpendicular, tangency, and bisection facts hold;
- no unintended theorem-sufficient facts create another answer;
- triangle/polygon/circle configurations are nondegenerate;
- all lengths/areas/volumes are positive where required;
- angle measures and polygon/triangle sums are consistent;
- congruence/similarity correspondence is bijective and all criterion preconditions hold;
- invalid-criterion items have a constructive counterexample or formal insufficiency certificate;
- proof steps match theorem schemas and dependencies;
- exact and numerical oracles agree within strict tolerance;
- every SVG mark corresponds to one semantic fact and accessible fact text;
- graph/diagram/table representations agree;
- multiple-choice items have exactly one correct/best answer;
- distractors are distinct and reproduce named misconceptions;
- units/dimensions and rounding rules are correct.

Property/fuzz minimums:

- 100,000 angle/parallel/triangle relation instances;
- 50,000 congruence/similarity/correspondence instances;
- 25,000 proof DAGs with alternate-path testing;
- 50,000 Pythagorean/coordinate/transformation instances;
- 50,000 polygon/circle/measurement instances;
- 100,000 right/general trig and non-right-triangle instances;
- every diagram template under rotations, reflections, label permutations, zoom, and supported locales.

## 18. Coverage requirements

Balance:

- numeric, algebraic, diagram, coordinate, verbal, and proof representations;
- marked versus derivable versus unjustified facts;
- direct theorem and converse;
- all congruence/similarity criteria plus invalid AAA/SSA congruence cases;
- congruent and reflected orientations;
- integer/rational/radical/decimal measures;
- acute/right/obtuse/invalid triangles;
- scale factors below/above 1 and inverse direction;
- vertical/horizontal/oblique coordinate lines;
- translations/reflections/rotations/dilations;
- common polygon/circle theorem types;
- boundary/area/volume and correct unit dimensions;
- special/non-special angles, all quadrants, degrees/radians;
- right-trig side/angle/model-selection directions;
- sine-law AAS/ASA, cosine-law SAS/SSS, and SSA zero/one/two cases.

Within a session, suppress exact repeats for 100 items and structural repeats for 20; avoid more than two consecutive diagram layouts of the same topology; include at least one precondition/insufficiency item per five theorem calculations and one proof/error item per eight geometry items.

## 19. Topic-level quality checklist

- [ ] Diagrams never require pixel measurement.
- [ ] Every quantitative/relational visual has an accessible fact representation.
- [ ] Unmarked appearance is never accepted as proof.
- [ ] Angle/vertex and triangle-correspondence naming are exact.
- [ ] Direct theorems and converses are distinguished.
- [ ] SSA and AAA are not accepted for congruence; AAA is accepted for similarity.
- [ ] Alternate valid congruence/similarity statements and proof paths are accepted.
- [ ] CPCTC requires established congruence.
- [ ] Scale dimensions use k, k², and k³ correctly.
- [ ] Pythagoras/right trig require a justified right angle.
- [ ] Circle arc/angle/segment conventions are explicit.
- [ ] Units and angle modes are explicit.
- [ ] Exact special values remain exact when requested.
- [ ] Trig equations state a finite solution interval.
- [ ] SSA case count is stable under rounding.
- [ ] Every family has at least three examples and validation.
- [ ] Difficulty grows through relationships and representation, not clutter.
- [ ] Generator prevents accidental extra geometric facts.
- [ ] Standalone implementation requires no backend.
- [ ] Practice improves theorem selection, spatial reasoning, and verification.

## 20. Stable navigation

1. `foundations` — Foundations & Angle Relationships
2. `parallel-lines` — Parallel Lines & Transversals
3. `triangles` — Triangles & Congruence
4. `similarity` — Similarity & Scale
5. `right-triangles` — Right Triangles & Pythagoras
6. `coordinates` — Coordinate Geometry & Transformations
7. `polygons-circles` — Polygons & Circles
8. `measurement` — Perimeter, Area & Volume
9. `right-trig` — Right-Triangle Trigonometry
10. `general-trig` — General Trigonometry & Non-Right Triangles

Family identifiers are stable persistence/analytics keys and must not be translated or silently repurposed.
