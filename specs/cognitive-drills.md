# Cognitive Drills — Dynamic Practice Specification

Status: implementation specification; performance practice, **not a diagnostic or cognitive-enhancement claim**

Audience: stimulus generator, timing/scoring engine, adaptive scheduler, SVG/Canvas/Web Audio renderer, accessibility layer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Cognitive Drills

### Topic goal

Develop faster and more accurate performance on a clearly identified set of
structured tasks:

- mentally rotate and compare two- and three-dimensional objects;
- preserve object identity while distinguishing rotation from reflection;
- update orientation, heading, and viewpoint through short transformations;
- encode and reproduce short visual, spatial, symbolic, and auditory sequences;
- preserve order and direction during forward, reverse, and probed recall;
- select the currently cued rule and switch rules without carrying over the old response;
- maintain and update the last `n` stimuli in single- and dual-stream n-back tasks;
- resist perceptual, one-back, `n±1`, repetition, and response-side lures;
- monitor accuracy separately from speed and recognize unreliable measurements;
- pause, simplify, or invalidate a block when timing, perception, or input is compromised.

The app trains performance on these tasks. It does not claim to raise general
intelligence, prevent cognitive decline, diagnose impairment, treat a condition,
or predict performance in school, work, driving, games, or daily life.

### Evidence and claims boundary

Improvement on a practiced task is the primary intended outcome. Transfer to
other tasks must not be promised. A meta-analysis of n-back training found that
much observed transfer was task-specific and that effects on other working-memory,
fluid-intelligence, and cognitive-control tasks were very small
([Soveri et al., 2017](https://pubmed.ncbi.nlm.nih.gov/28116702/)); a later
preregistered randomized study likewise found training gains without reliable
near or far transfer ([Zhong et al., 2025](https://pubmed.ncbi.nlm.nih.gov/40914122/)).
The product therefore reports:

> You improved on `{named task, profile, and level}`.

It must not report:

> Your working memory increased by `{x}`.

or:

> Your brain age/IQ/attention is `{value}`.

Method choices materially change a task. The Corsi literature, for example,
documents substantial variation in apparatus, administration, and scoring
([Berch et al., 1998](https://pubmed.ncbi.nlm.nih.gov/9841789/)). Scores are
therefore comparable only within an explicitly compatible task profile.

### Audience and prerequisites

The default audience is an adult who can:

- distinguish simple shapes, symbols, colors, positions, digits, and tones;
- use two or more response controls;
- understand “same,” “different,” “before,” “after,” and “`n` positions back”;
- complete an untimed calibration.

No psychology terminology is required. Every new rule receives an untimed
demonstration and a criterion practice block before timed scoring.

The app is unsuitable as a substitute for professional assessment. A learner
concerned about memory, attention, vision, hearing, motor function, or a sudden
change in performance should not be interpreted by the app.

### Scope

Included:

- exact 2D rotation, reflection, and composition over generated shapes and grids;
- bounded 3D cube, face, net, viewpoint, heading, and spatial-updating tasks;
- immediate serial recall and recognition for visual, symbolic, spatial, and
  optional auditory sequences;
- cued switching between two or three simple, fully taught classification rules;
- single-stream visual, spatial, and auditory `n`-back;
- dual-stream and selective-stream n-back after separate mastery;
- accuracy, hit/miss/false-alarm classification, response time, switch cost, and
  within-task calibration;
- untimed learn modes, self-paced practice, and timed challenge modes;
- deterministic offline generation and local progress.

### Exclusions

- diagnosis, screening, clinical norms, neuropsychological interpretation, or
  accommodation eligibility;
- claims about IQ, “brain age,” executive function, ADHD, dementia, concussion,
  neurological disease, or fitness for a safety-critical activity;
- therapeutic, rehabilitation, medical, sleep, supplement, or lifestyle advice;
- population percentiles unless a future independently governed normative
  programme supplies representative data and professional review;
- emotional-face, trauma, addiction, gambling, or health-related stimuli;
- subliminal stimuli, deceptive experimental manipulation, coercive streaks, or
  fatigue-maximizing design;
- infinite endurance sessions or difficulty increases after repeated distress;
- generic memory trivia, mnemonic-history facts, or vocabulary memorization;
- unrestricted 3D mesh reasoning requiring a physics/rendering engine;
- biometric inference, webcam gaze tracking, EEG, or cloud telemetry;
- comparing scores across incompatible devices, modalities, timing profiles, or
  accessibility presentations.

### Construct-separation contract

Progress is stored by:

```text
familyId
stimulusProfileId
modality
responseMappingId
timingProfileId
load
difficultyDimensions
accessibilityPresentationId
deviceClass
```

There is no aggregate “cognitive score.” At most, a dashboard may summarize
separate practiced-task trends with raw metrics and uncertainty. Visual,
auditory, keyboard, touch, self-paced, and timed results remain separate.

Spatial rotation, sequence recall, task switching, and n-back must not unlock one
another merely because they are all called cognitive drills.

### Episode and trial model

Timed families generate an `Episode`:

```text
Episode {
  seed
  familyId
  profileIds
  instructions
  trials[]
  scoringRule
  invalidationRule
}

Trial {
  semanticStimulus
  correctResponseSet
  targetClass?
  intendedOnset
  actualOnset?
  intendedOffset
  actualOffset?
  responseWindow
  responseEvents[]
  visibilityState
  focusState
  rendererHealth
}
```

The semantic episode is generated and validated before presentation. Rendering
never decides the answer.

### Timing contract

Use the monotonic `performance.now()` clock. Timed visual presentation:

1. prepares the semantic stimulus;
2. commits the render;
3. records actual onset on the next animation frame;
4. schedules offset relative to actual onset;
5. timestamps input at event receipt;
6. scores response time from actual onset, not requested timer time.

`setTimeout` may request work but is not treated as a precise clock. Audio uses
the Web Audio clock and records the scheduled audio onset plus measured/resolved
output-latency metadata when available.

A trial or block is invalid for timing when:

- the document becomes hidden;
- window focus is lost under a strict profile;
- actual onset drift exceeds the profile threshold;
- a long task or renderer stall crosses a threshold;
- audio context is suspended or unexpectedly resumed;
- input mapping changes;
- viewport reflow obscures a stimulus;
- the learner pauses.

Accuracy may be retained only when the complete stimulus and response window
remained valid; otherwise the trial is unscored and replayed with a new seed.

Default modes:

```text
learn:       untimed, visible rule/working, corrective feedback
practice:    generous response window, block feedback
challenge:   calibrated fixed timing, no mid-trial hints
self-paced:  no response-time metric
```

Speed is never used to raise difficulty until accuracy is stable.

### Stimulus presentation contract

Each temporal episode has:

```text
countIn
stimulusDuration
interStimulusInterval
responseWindow
feedbackTiming
blockLength
```

These are displayed before the block and versioned. A difficulty label does not
silently change timing mid-block. Variable timing, when a family explicitly
trains it, is sampled from a declared bounded distribution and is not mixed with
ordinary fixed-timing scores.

No stimulus is shown for less than the calibrated renderable/perceivable
duration. Difficulty must not come from making a cue nearly invisible, quiet, or
indistinguishable.

### Response and scoring contract

Response mappings are shown and practiced. Mapping must be counterbalanced
across blocks without changing inside a block.

For two-choice continuous detection:

```text
target + target response       = hit
target + no response/wrong     = miss
non-target + target response   = false alarm
non-target + no target response = correct rejection
```

When both target and non-target buttons are required, every trial receives one
response. When target-only input is used, premature and multiple responses are
classified explicitly.

Report at least:

- scored trials and invalid trials;
- accuracy or balanced accuracy as defined by the family;
- hits, misses, false alarms, and correct rejections for detection tasks;
- median correct response time when timing is valid;
- omission and premature-response counts;
- rule-switch and repeat trials separately in switching tasks.

Do not hide a high false-alarm rate behind raw accuracy when targets are rare.
Do not combine accuracy and speed into an opaque proprietary score.

### Adaptation contract

Difficulty changes between blocks, never unpredictably within a scored block,
except in families where the varying cue/rule is the defined task.

Promotion requires:

- a minimum number of valid trials;
- accuracy above the profile threshold in at least two recent blocks;
- no unresolved perception/input failures;
- acceptable false-alarm and omission rates where relevant.

Demotion follows repeated evidence, not one lapse. Adapt one principal dimension
at a time:

1. remove scaffolding;
2. increase structural load;
3. add a controlled lure or switch;
4. only then shorten timing modestly.

The scheduler records why it changed difficulty. The learner may lock a level,
choose self-paced mode, or stop without penalty.

### Breaks and session boundaries

- Default focused blocks last roughly 45–120 seconds.
- Offer a pause after every block and an optional longer break after 8–12 minutes.
- Never auto-start the next timed block.
- Sustained accuracy decline, repeated omissions, or learner-reported fatigue
  triggers a break suggestion, not harsher adaptation.
- Streaks, countdown pressure, shame language, and loss-framed notifications are
  excluded.
- Practice history may be deleted locally.

### Accessibility and presentation profiles

The app follows [WCAG 2.2](https://www.w3.org/TR/WCAG22/), including keyboard
operation, visible focus, sufficient non-text contrast, adjustable timing where
the task permits it, and flash limits. It honors reduced-motion preferences and
avoids nonessential animation, consistent with
[W3C guidance on animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions).

Requirements:

- no flashing stimulus design; ordinary onset/offset changes use moderate
  luminance and never saturated-red flashes;
- color is never the only cue unless color discrimination is the explicitly
  selected task, in which case a non-color parallel family is available;
- all controls work by keyboard and pointer without dragging;
- target sizes remain generous and fixed during a block;
- audio has volume preview, mute, visual alternatives, and no sudden peaks;
- a response can use left/right buttons, named keys, switch controls, or
  assistive-technology-compatible buttons;
- instructions remain visible until the learner starts;
- reduced-motion mode uses discrete before/after states rather than animated
  rotation;
- self-paced alternatives exist for every timing-dependent family;
- visual-only spatial rotation cannot be made semantically equivalent through a
  text answer alone, so accessible alternatives are labeled as separate tasks
  rather than falsely score-equated.

### Global answer conventions

- Button identity is semantic (`same`, `different`, `rule A`, `rule B`), not
  inferred from left/right screen position.
- A response inside the declared window is accepted once; duplicate events from
  key repeat, touch/click synthesis, or assistive activation are deduplicated.
- Ordered recall must match order exactly unless the prompt asks for recognition
  or unordered membership.
- Spatial answers use stable cell/face/direction IDs independent of screen
  orientation.
- Rotation answers use normalized clockwise angles in `{0,90,180,270}` unless a
  family declares another discrete group.
- Reflection is never accepted as rotation.
- N-back warm-up positions `0..n-1` are unscored and visibly marked as having no
  possible target.
- A late response is logged but not reassigned to the next trial.
- “No valid score” is a first-class outcome after timing or presentation failure.

### Difficulty philosophy

Difficulty should increase through:

- greater angular disparity or more axes while preserving clear stimuli;
- less symmetry and fewer orientation anchors;
- longer sequence length or reverse/update operations;
- similar but distinguishable items and principled interference;
- less redundant task cues, more bivalent stimuli, and less predictable switches;
- larger `n`, balanced lures, and dual streams after single-stream mastery;
- longer retention or more updating, not microscopic presentation;
- transfer among representations only after each representation is learned.

Difficulty must not increase through:

- arbitrary time pressure before accuracy;
- illegible symbols, low contrast, tiny targets, or harsh audio;
- motorically difficult controls;
- hidden rule changes;
- target imbalance that makes one button a winning guess;
- long sessions, sleep deprivation, embarrassment, or deceptive claims;
- mathematically larger labels that do not change the mental operation;
- combining several unmastered constructs into an uninterpretable failure.

### Shared generation and rejection rules

Reject an episode when:

- an answer is ambiguous under the declared transformation/rule;
- symmetry makes a nominal rotation indistinguishable unless symmetry is the
  explicit lesson;
- a distractor accidentally equals the target;
- sequence identity or response can be guessed from frequency, position, color,
  audio loudness, timing, or button side;
- n-back targets or lures do not match the precomputed truth vector;
- early n-back trials are scored;
- task-switch cue and target onset order is wrong;
- rule A and B give the same response on too many “switch” stimuli unless
  congruency is deliberately balanced;
- a sequence contains unplanned chunks such as simple counting, alphabet runs,
  or repeated motor paths;
- a timing profile is impossible on the calibrated device;
- a renderer, accessibility description, and oracle disagree;
- the structural signature recently appeared;
- difficulty comes mainly from perception or input latency.

## 2. Category: Two-dimensional mental rotation and reflection

### Category purpose

Train preservation of shape identity across discrete planar transformations
while keeping rotation, translation, and reflection conceptually separate.

### Learn

A rotation turns every part of a figure around the same center. A translation
slides it. A reflection reverses handedness. For a 90° clockwise grid rotation,
an arrow pointing up points right afterward. Trace one distinctive corner or
marker instead of comparing the whole silhouette vaguely.

### Prerequisites

Clockwise/counterclockwise, quarter/half turns, and simple grid coordinates.

### Category boundaries

This category uses exact 2D transforms. Cube/viewpoint updating begins in
Category 3. Continuous animated spinning is presentation, not a separate skill.

### Subcategories

1. Single rotations
2. Rotation composition
3. Rotation versus reflection
4. Grid/object construction
5. Transformation audits

### Common misconceptions

- Rotating only the marker but not the whole object.
- Treating clockwise as screen-left movement.
- Confusing a 270° clockwise turn with 270° counterclockwise.
- Accepting a mirror image because its outline looks familiar.
- Rotating around the object's corner rather than the declared center.
- Treating translation as a change in orientation.

### Family `rotation_2d_same_object`

**Task.** Decide whether the second asymmetric figure is a rotation of the first.

**Response/template.** Same-by-rotation/not-same buttons: `Can A be rotated, without reflecting it, to make B?`

**Derivation.** Apply each permitted discrete rotation to A's occupied cells and markers; accept iff one equals B.

**Difficulty.** L1 arrow/pattern at 90°; L2 asymmetric polyomino; L3 internal marker and tempting reflection.

**Distractors/constraints.** Reflection, one-cell mutation, or marker-only rotation; figures must not be rotationally ambiguous.

**Feedback.** Highlight one anchor cell and trace it through the correct turn.

**Examples.** (1) up arrow versus right arrow → yes, 90° clockwise. (2) L triomino versus its half-turn → yes. (3) chiral shape versus mirror → no.

**Validation.** Enumerate the transformation group; exactly one semantic classification.

### Family `rotation_2d_angle`

**Task.** Name the rotation taking A to B.

**Response/template.** Choice among `0°`, `90°`, `180°`, `270°` clockwise.

**Derivation.** Transform normalized cell/marker coordinates around the declared center and find matching angle.

**Difficulty.** L1 directed arrow; L2 shape; L3 shape with distractor symmetry broken by marker.

**Distractors/constraints.** Opposite direction and half-turn errors; only one angle may match.

**Feedback.** Show the anchor's path in quarter turns, without motion in reduced-motion mode.

**Examples.** (1) up→left →270° clockwise. (2) top-left marker→bottom-right →180°. (3) asymmetric five-cell figure→90°.

**Validation.** All four transforms computed; reject multiple matches.

### Family `rotation_2d_construct`

**Task.** Select the correctly rotated result from several candidates.

**Response/template.** Single choice: `Which figure is A after {angle} {direction}?`

**Derivation.** Transform all occupied cells and oriented markers.

**Difficulty.** L1 one marker; L2 concave shape; L3 several similar candidates.

**Distractors/constraints.** Opposite turn, reflection, marker not rotated, and correct turn about wrong center.

**Feedback.** Overlay source and destination anchor coordinates.

**Examples.** (1) rotate arrow 90° CW → right. (2) rotate F-like grid 180°. (3) rotate offset marked polyomino 270°.

**Validation.** Choices distinct and exactly one equals oracle output.

### Family `rotation_2d_missing_orientation`

**Task.** Fill the missing orientation in a short rotation sequence.

**Response/template.** Single choice: `{state0} → {state1} → ?` under repeated `{turn}`.

**Derivation.** Reapply the same group action to the previous state.

**Difficulty.** L1 arrows; L2 shapes; L3 alternating two declared turns.

**Distractors/constraints.** Copy previous, reverse latest turn, or apply total turn only to marker.

**Feedback.** Label accumulated orientation modulo 360°.

**Examples.** (1) up, right, ? → down. (2) 180° repeated gives A, A′, A. (3) +90°,−180° alternating.

**Validation.** Sequence generated from a seed state; missing state unique.

### Family `rotation_2d_compose`

**Task.** Compute the net effect of two or more planar rotations.

**Response/template.** Angle/direction choice: `{turns}` has what net rotation?

**Derivation.** Convert signed quarter turns, sum, and normalize modulo four.

**Difficulty.** L1 two same-direction turns; L2 mixed directions; L3 three/four turns with cancellation.

**Distractors/constraints.** Add magnitudes without signs, fail modulo reduction, keep last turn only.

**Feedback.** Show signed quarter-turn sum and normalized result.

**Examples.** (1) 90° CW+90° CW→180°. (2) 270° CW+90° CCW→180° CW. (3) CW, half-turn, CCW→180°.

**Validation.** Integer modular arithmetic independent of renderer.

### Family `rotation_reflection_distinguish`

**Task.** Classify the exact transformation from A to B.

**Response/template.** `rotation`, `reflection`, `translation only`, or `not obtainable by one listed transform`.

**Derivation.** Test canonical rotation, reflection, and translation equivalence sets.

**Difficulty.** L1 marked letter-like figure; L2 chiral polyomino; L3 reflection plus rotation.

**Distractors/constraints.** Symmetric shapes excluded unless a marker preserves handedness.

**Feedback.** Trace clockwise order of three labeled anchors; reflection reverses it.

**Examples.** (1) shifted unchanged triangle→translation. (2) chiral L-marker reversed→reflection. (3) one cell changed→none.

**Validation.** Transformation classes are mutually exclusive for the instance.

### Family `rotation_marker_track`

**Task.** Locate one labeled feature after rotating its containing object.

**Response/template.** Select cell/edge/corner: `Where is marker {m} after {turn}?`

**Derivation.** Apply the same transform matrix to marker and object coordinates.

**Difficulty.** L1 edge marker; L2 interior grid cell; L3 off-center declared pivot.

**Distractors/constraints.** Move marker alone, rotate about wrong pivot, keep absolute screen position.

**Feedback.** Show relative vector from pivot before and after.

**Examples.** (1) top edge after 90° CW→right edge. (2) NW cell after 180°→SE. (3) marker about off-center pivot.

**Validation.** Marker remains on/in transformed object and target ID is exact.

### Family `rotation_grid_coordinate`

**Task.** Transform a coordinate in an `N×N` grid.

**Response/template.** Cell selection or `(row,column)` fields.

**Derivation.** For zero-based `(r,c)`, 90° clockwise gives `(c,N−1−r)`; other turns compose it.

**Difficulty.** L1 3×3 visual; L2 5×5 coordinate; L3 multiple points.

**Distractors/constraints.** Swap without inversion, invert wrong axis, one-/zero-based confusion; convention shown.

**Feedback.** Show source row/column and formula.

**Examples.** (1) 3×3 `(0,0)`→`(0,2)`. (2) 5×5 `(1,3)`→`(3,3)`. (3) two points under 270°.

**Validation.** Round-trip after four quarter turns and bounds check.

### Family `rotation_shape_equivalence_set`

**Task.** Select every candidate equivalent to a source under rotation only.

**Response/template.** Multiple choice.

**Derivation.** Build source orbit under allowed rotations and compare normalized candidates.

**Difficulty.** L1 one valid; L2 multiple orientations valid; L3 duplicates prevented among chiral near-misses.

**Distractors/constraints.** Reflections and one-cell edits; at least one valid and one invalid choice.

**Feedback.** Group choices by transformation and show why reflections fail.

**Examples.** (1) select two rotated arrows. (2) select all L-tetromino rotations. (3) reject mirrored marked shape among four rotations.

**Validation.** Choice membership derived from orbit; no duplicate normalized candidates.

### Family `rotation_2d_audit`

**Task.** Find the first incorrect step in a worked planar transformation.

**Response/template.** Step selection plus corrected state.

**Derivation.** Replay semantic transforms and compare every state.

**Difficulty.** L1 wrong direction; L2 wrong pivot; L3 reflection mislabeled as rotation after correct numeric composition.

**Distractors/constraints.** Exactly one root error; downstream consequences are not separate roots.

**Feedback.** Identify violated invariant: distance to pivot, handedness, or orientation.

**Examples.** (1) CW shown as left turn. (2) marker stays fixed while object turns. (3) modular sum correct but image mirrored.

**Validation.** Mutate one stage of a valid trace and prove earliest divergence.

### Cross-family progression

Start with `rotation_2d_same_object` and `rotation_2d_angle`, then construction
and marker tracking. Introduce reflection only after rotations are reliable.
Composition and coordinate transforms may interleave once a quarter-turn anchor
is stable. The audit family follows mastery of at least three direct families.

## 3. Category: Three-dimensional orientation and spatial updating

### Category purpose

Train updating of faces, directions, and viewpoints through a short, fully
specified series of spatial transformations.

### Learn

A cube rotation moves all faces together. Opposite faces remain opposite and
adjacent faces remain adjacent. “Turn the object” and “move the viewer” use
inverse viewpoints, so the prompt always names which one changes. Keep a small
orientation frame—top, front, right—rather than trying to animate every surface.

### Prerequisites

Category 2 single rotations and composition.

### Category boundaries

Only discrete cube/cardinal transforms and reviewed cube nets are included.
Free-form mesh rotation, hidden-surface geometry, perspective drawing skill, and
mechanical folding are excluded.

### Subcategories

1. Cube face updates
2. Nets and adjacency
3. Viewer/object perspective
4. Heading and route updating
5. Spatial audits

### Common misconceptions

- Updating the named face but not the whole orientation frame.
- Treating object rotation and viewer motion as the same direction.
- Forgetting invariant opposite-face pairs.
- Mirroring a cube during a rotation sequence.
- Confusing left/right relative to the viewer with east/west in the world.
- Counting turns rather than composing their axes.

### Cube convention

Canonical visible frame:

```text
U = up, D = down
F = front, B = back
R = right, L = left
```

Each cube state is a permutation of six unique face IDs that preserves opposite
pairs and handedness. The engine enumerates the 24 proper cube rotations. A
reflection is never a legal cube rotation.

Canonical quarter-turn names are semantic permutations, not ambiguous prose:

```text
pitchForward:  U → F → D → B → U
pitchBackward: inverse(pitchForward)
yawRight:      F → L → B → R → F
yawLeft:       inverse(yawRight)
rollRight:     U → R → D → L → U
rollLeft:      inverse(rollRight)
```

Visible prompts pair these names with an axis/direction diagram. Localized words
such as “roll forward” are never the sole source of direction semantics.

### Family `cube_face_after_turn`

**Task.** Name the face at one position after a single cube turn.

**Response/template.** Face-ID choice: `After rolling/turning the cube {turn}, which face is {position}?`

**Derivation.** Apply the declared permutation to the six-face state.

**Difficulty.** L1 visible face; L2 hidden opposite; L3 unfamiliar axis wording with diagram.

**Distractors/constraints.** Face that moved in opposite direction, unchanged face, opposite face.

**Feedback.** Show the four-face cycle around the rotation axis.

**Examples.** (1) `pitchForward`: old top→front. (2) `yawRight`: old front→left under displayed convention. (3) ask new bottom.

**Validation.** Permutation preserves all face IDs/opposites.

### Family `cube_orientation_after_sequence`

**Task.** Determine the final top/front/right frame after several cube turns.

**Response/template.** Three named face fields.

**Derivation.** Compose cube permutations in temporal order.

**Difficulty.** L1 two same-axis turns; L2 mixed axes; L3 four turns with cancellation.

**Distractors/constraints.** Apply turns right-to-left, report only last turn, introduce reflection.

**Feedback.** Table the frame after each turn.

**Examples.** (1) two `pitchForward` turns. (2) `pitchForward` then `rollRight`. (3) yaw, pitch, inverse yaw.

**Validation.** Final state belongs to 24-rotation group; triple uniquely identifies it.

### Family `cube_missing_turn`

**Task.** Infer the one turn connecting two cube orientations.

**Response/template.** Single choice from declared quarter/half turns or `none`.

**Derivation.** Compute `target × inverse(source)` and match allowed generator turns.

**Difficulty.** L1 visible axis; L2 hidden-face evidence; L3 several candidate axes.

**Distractors/constraints.** Inverse turn and turn producing same top but wrong front.

**Feedback.** Compare complete orientation frames, not one face.

**Examples.** (1) top A/front B→top D/front A = `pitchForward`. (2) same top, front changes = yaw. (3) reflected target→none.

**Validation.** Exactly one allowed turn or explicit none.

### Family `cube_opposite_adjacent`

**Task.** Use a shown cube/net to identify opposite or adjacent faces.

**Response/template.** Face choice or yes/no.

**Derivation.** Fold validated net into face normals or read current cube topology.

**Difficulty.** L1 visible cube; L2 net; L3 choose all adjacent faces.

**Distractors/constraints.** Diagonal-in-net proximity is not cube adjacency.

**Feedback.** Show the six normal vectors or folded schematic.

**Examples.** (1) opposite of U→D. (2) face two squares away in net may become adjacent. (3) select four neighbors of F.

**Validation.** Every face has one opposite and four adjacent faces.

### Family `cube_net_fold_face`

**Task.** Determine which labeled face occupies a requested cube position after folding.

**Response/template.** Face-ID choice.

**Derivation.** Propagate 3D basis vectors across shared net edges from a pinned root face.

**Difficulty.** L1 cross net; L2 irregular valid net; L3 root orientation and target hidden.

**Distractors/constraints.** Use only the 11 cube-net topologies; reject overlap/inconsistent folds.

**Feedback.** Show discrete fold stages or a static face-normal table.

**Examples.** (1) cross net opposite center. (2) zigzag net top face. (3) identify right face after root orientation.

**Validation.** Fold assigns six unique axis normals and preserves edge adjacency.

### Family `cube_net_same_cube`

**Task.** Decide whether two labeled nets can fold into the same labeled cube by rotation.

**Response/template.** Yes/no.

**Derivation.** Fold each net, canonicalize its labeled cube over 24 rotations, and compare.

**Difficulty.** L1 obvious label relocation; L2 rotated net; L3 mirror arrangement.

**Distractors/constraints.** Same opposite pairs but reversed handedness is not enough.

**Feedback.** Compare one oriented corner triple whose cyclic order is invariant.

**Examples.** (1) translated/rotated same net→yes. (2) two labels swapped→no. (3) mirror net with same opposites→no.

**Validation.** Exact canonical cube signature.

### Family `viewer_object_perspective`

**Task.** Determine the visible side after either the viewer or object moves.

**Response/template.** Direction/face choice; prompt explicitly says `viewer moves` or `object rotates`.

**Derivation.** Update world-to-view transform; viewer motion applies inverse view change.

**Difficulty.** L1 one quarter-turn; L2 object/viewer contrast; L3 two movements.

**Distractors/constraints.** Direction language anchored by diagram and compass; no ambiguous “turn right.”

**Feedback.** Hold one frame fixed and update the other.

**Examples.** (1) viewer walks to object's east side. (2) object yaws east while viewer stays. (3) viewer and object both move.

**Validation.** Separate object/world/view matrices yield one face.

### Family `heading_update`

**Task.** Track final cardinal heading after relative turns.

**Response/template.** `N`, `E`, `S`, or `W`.

**Derivation.** Encode headings modulo four; add signed quarter/half turns.

**Difficulty.** L1 one turn; L2 several turns; L3 turns conditioned on shown markers.

**Distractors/constraints.** Left/right always relative to current heading.

**Feedback.** Show heading after each instruction.

**Examples.** (1) north, right→east. (2) west, left, about-face→north. (3) east, right, left, left→north.

**Validation.** Modular direction oracle and replay.

### Family `spatial_route_endpoint`

**Task.** Track endpoint and optionally heading through a short grid route.

**Response/template.** Grid-cell selection plus heading.

**Derivation.** Apply relative turns and forward steps to integer coordinates.

**Difficulty.** L1 world-relative steps; L2 heading-relative movement; L3 short route with one irrelevant landmark.

**Distractors/constraints.** Routes stay in bounds; avoid self-evident symmetric return unless targeted.

**Feedback.** Reveal route one segment at a time after answer.

**Examples.** (1) `(2,2)` east, forward2→`(2,4)`. (2) north, right, forward1. (3) mixed 5-command route.

**Validation.** Independent coordinate replay; endpoint/heading exact.

### Family `egocentric_allocentric_translate`

**Task.** Convert a relative direction into a world direction or vice versa.

**Response/template.** Direction choice: `{landmark}` is where relative to `{heading}`?

**Derivation.** Rotate relative frame by current world heading.

**Difficulty.** L1 facing north; L2 other headings; L3 inverse query.

**Distractors/constraints.** Swap left/right, answer current heading, keep north-up relative frame.

**Feedback.** Draw tiny world and body axes.

**Examples.** (1) facing east, left→north. (2) object south while facing west→left. (3) behind while facing north→south.

**Validation.** Bidirectional transform round-trip.

### Family `spatial_update_audit`

**Task.** Find the first erroneous orientation, fold, viewpoint, or route update.

**Response/template.** Step choice and corrected frame/state.

**Derivation.** Replay exact group/coordinate operations.

**Difficulty.** L1 direction reversal; L2 one face correct but frame reflected; L3 viewer/object frame swapped.

**Distractors/constraints.** One seeded root error; downstream states follow that wrong state consistently.

**Feedback.** Name invariant violated: opposites, handedness, inverse view, or coordinate step.

**Examples.** (1) `pitchForward` wrongly maps top to back. (2) cube has two faces assigned same normal. (3) viewer-right treated as object-right turn.

**Validation.** Mutation of valid trace; earliest divergence unique.

### Cross-family progression

Begin with a single cube turn, heading update, and relative/world translation.
Add turn sequences before cube nets. Nets and viewer/object inversion remain
separate until each is reliable. Route endpoints interleave with heading work;
the audit family comes last.

## 4. Category: Immediate sequence memory and ordered recall

### Category purpose

Train accurate encoding, maintenance, and ordered reproduction of a short,
fully presented sequence without confounding the task with outside knowledge.

### Learn

Order is part of the answer. Encode each item once, preserve its position, and
wait until the recall cue. In spatial sequences, remember locations rather than
the pointer's movement. Reverse recall means reproduce the final item first; it
is not the same task as forward recall.

### Prerequisites

Ability to identify every item/location in an untimed calibration.

### Category boundaries

This category presents a finite sequence and then asks for recall or recognition.
Continuous updating against `n` positions back belongs in Category 6. Long-term
memorization and mnemonic instruction are excluded.

### Subcategories

1. Forward serial recall
2. Spatial path recall
3. Recognition and position probes
4. Reverse and transformed recall
5. Interference and audits

### Common misconceptions

- Remembering membership but not order.
- Treating repeated items as one occurrence.
- Starting recall before the sequence ends.
- Reproducing spatial pointer travel rather than selected locations.
- Reversing item identity rather than sequence order.
- Guessing from familiar chunks or fixed screen positions.

### Sequence-generation contract

Default alphabets:

```text
digits:       0..9
symbols:      8–16 highly distinguishable glyphs
locations:    8 or 9 irregularly spaced stable cells
tones:        4–8 calibrated pitches/timbres, optional
```

Sampling may allow repeats only when the family says so. Ordinary sequences
reject accidental counting runs, alphabetic runs, keyboard paths, simple
alternation, repeated chunks, and an item-frequency imbalance that reveals the
answer. Spatial layouts are fixed for a block but may vary across blocks under a
separate profile. The original sequence remains immutable and is never rebuilt
from the learner's clicks.

### Family `sequence_symbol_forward`

**Task.** Reproduce a serially presented symbol/digit sequence in the same order.

**Response/template.** Ordered buttons or token string after `Recall now`.

**Derivation.** Correct answer is the immutable generated token array.

**Difficulty.** L1 length 3–4 distinct; L2 length 5–7 with repeats; L3 similar symbols under calibrated timing.

**Distractors/constraints.** Transpositions, omissions, duplicate collapse; all symbols pre-calibrated as distinguishable.

**Feedback.** Align expected and response by position and mark first divergence.

**Examples.** (1) `3,8,1`→`381`. (2) `A,F,A,C,D` preserves repeated A. (3) seven-symbol sequence with one adjacent swap.

**Validation.** Exact sequence equality; presentation log contains every intended token.

### Family `sequence_location_forward`

**Task.** Reproduce highlighted locations in order.

**Response/template.** Tap/click/select cells after presentation.

**Derivation.** Answer is ordered stable cell IDs, independent of pixel coordinates.

**Difficulty.** L1 3 cells no repeat; L2 5–7 cells; L3 repeats and nearby-cell interference.

**Distractors/constraints.** No trace line during stimulus; adjacent hits remain visually separable.

**Feedback.** Replay numbered locations only after response.

**Examples.** (1) cells `2,7,4`. (2) `5,1,5,8` with repeat. (3) seven cells crossing layout.

**Validation.** Cell-ID log, hitboxes, and accessibility labels agree.

### Family `sequence_tone_forward`

**Task.** Reproduce a short ordered sequence of calibrated tones.

**Response/template.** Ordered tone buttons with preview available before, not during, the block.

**Derivation.** Answer is ordered tone-ID array.

**Difficulty.** L1 three widely spaced tones; L2 four/five; L3 nearer but calibration-passed set.

**Distractors/constraints.** Equalized duration/loudness; no fixed stereo/timbre clue; hearing-dependent results separate.

**Feedback.** Replay expected then response with visual IDs after grading.

**Examples.** (1) low-high-mid. (2) tone IDs `2,4,1,2`. (3) five-tone sequence with adjacent pitches.

**Validation.** Web Audio schedule matches IDs/onsets and peaks remain bounded.

### Family `sequence_forward_length_adaptive`

**Task.** Complete a forward-recall block whose sequence length adapts between episodes.

**Response/template.** Ordered recall; visible current length.

**Derivation.** Score whole-sequence exactness plus item/position accuracy, but promote on declared criterion only.

**Difficulty.** Length changes by one after stable blocks; timing fixed while length adapts.

**Distractors/constraints.** No trial-by-trial surprise staircase or inflated “span” diagnosis.

**Feedback.** Report practiced length and position errors, not a clinical memory span.

**Examples.** (1) pass two length-4 blocks→offer 5. (2) mixed result→retain 5. (3) repeated length-6 failure→offer 5.

**Validation.** Adaptation is replayable from block metrics and never changes two dimensions at once.

### Family `sequence_recognition_exact`

**Task.** Decide whether a probe sequence exactly matches the presented sequence.

**Response/template.** Same/different.

**Derivation.** Compare arrays for token and order equality.

**Difficulty.** L1 replaced item; L2 adjacent transposition; L3 repeated-item displacement.

**Distractors/constraints.** Match rate balanced; probe duration cannot leak class.

**Feedback.** Show the earliest differing position.

**Examples.** (1) `2,5,7` vs `2,5,7`→same. (2) `A,C,F,D` vs `A,F,C,D`→different. (3) repeated tokens shifted.

**Validation.** Mutations guarantee at least one difference; same probes are byte/semantic exact.

### Family `sequence_position_probe`

**Task.** Recall the item or location at one serial position.

**Response/template.** Token/cell choice: `What appeared in position {k}?`

**Derivation.** Return zero/one-based array index under the displayed convention.

**Difficulty.** L1 first/last; L2 middle; L3 repeated items and delayed probe.

**Distractors/constraints.** Neighbor positions and recency response; position labels shown during practice.

**Feedback.** Reveal numbered sequence.

**Examples.** (1) `4,9,2`, position2→9. (2) six cells, position4. (3) repeated A at positions2/5.

**Validation.** Probe index in range and answer choice unique by position even if token repeats.

### Family `sequence_order_pair`

**Task.** Determine which of two items occurred earlier or whether a stated order is correct.

**Response/template.** First-item choice or yes/no.

**Derivation.** Compare selected occurrence indexes; repeated items require occurrence labels or are excluded.

**Difficulty.** L1 far-apart items; L2 adjacent; L3 spatial locations with delayed probe.

**Distractors/constraints.** Recency bias and screen-position bias; query generated after sequence.

**Feedback.** Show both ordinal positions.

**Examples.** (1) `B,D,A,F`: B before A→yes. (2) positions5 and6. (3) spatial cells 3 and8.

**Validation.** Query has one interpretation and distinct indexed occurrences.

### Family `sequence_reverse_recall`

**Task.** Reproduce the sequence in reverse temporal order.

**Response/template.** Ordered tokens/cells after an explicit `Reverse` cue shown before presentation.

**Derivation.** Reverse a copy of the source array.

**Difficulty.** L1 3 items; L2 4–6; L3 repeated items or spatial sequence.

**Distractors/constraints.** Forward replay, rotate/mirror spatial layout, reverse token glyphs.

**Feedback.** Number original positions then read them from last to first.

**Examples.** (1) `2,6,9`→`9,6,2`. (2) `A,C,A,D`→`D,A,C,A`. (3) reverse four locations without mirroring.

**Validation.** Reverse operation exact; cue cannot change after onset.

### Family `sequence_rule_transform`

**Task.** Recall a sequence after one simple, declared transformation.

**Response/template.** Ordered response; rules limited to reverse, rotate every arrow, or shift every grid location once.

**Derivation.** Apply transformation elementwise or to order exactly as declared.

**Difficulty.** L1 visible transform table; L2 no table; L3 spatial transform plus preserved order.

**Distractors/constraints.** Only one transformation; do not mix reverse and element transform in v1.

**Feedback.** Separate remembered source from transformation step.

**Examples.** (1) arrows each turn 90° CW. (2) each digit maps through printed pair table. (3) locations rotate around grid center.

**Validation.** Source and transformed answer stored; transformation bijective for selected alphabet.

### Family `sequence_distractor_delay`

**Task.** Recall a sequence after a short, explicitly labeled neutral delay event.

**Response/template.** Ordered recall after blank or simple non-response mask.

**Derivation.** Answer remains original sequence; delay affects presentation only.

**Difficulty.** L1 fixed blank; L2 visual mask; L3 one taught irrelevant symbol stream.

**Distractors/constraints.** Delay never contains answer-like tokens or a second scored task; compare only within delay profile.

**Feedback.** Show sequence and label delay duration, without causal claims.

**Examples.** (1) 1-second blank. (2) checker mask after spatial sequence. (3) two neutral mask symbols.

**Validation.** Mask IDs disjoint from sequence alphabet and timing valid.

### Family `sequence_memory_audit`

**Task.** Identify a scoring, order, timing, repeat, or presentation defect.

**Response/template.** Defect choice and corrected score/sequence.

**Derivation.** Replay immutable stimulus and event logs under profile rules.

**Difficulty.** L1 swapped order; L2 repeated token collapsed; L3 hidden-tab trial wrongly retained.

**Distractors/constraints.** One root defect; actual learner mistakes are distinguished from system invalidity.

**Feedback.** Align semantic sequence, actual presentation, response, and scoring.

**Examples.** (1) expected set instead of ordered list. (2) late click assigned next trial. (3) missed render still scored as omission.

**Validation.** Seed one log mutation and prove unique earliest violation.

### Cross-family progression

Calibrate item recognition, then introduce forward symbol and spatial recall at
short lengths. Recognition and position probes diagnose whether order or item
identity is failing. Reverse and transformed recall remain separate mastery
tracks. Auditory practice is opt-in and never required to progress in visual
practice.

## 5. Category: Cued task switching and response remapping

### Category purpose

Train selection of the currently cued rule, suppression of a no-longer-current
mapping, and accurate switching between simple classifications.

### Learn

The cue tells you which rule applies now. Read the cue first, classify the
stimulus under that rule, then use the current response mapping. A switch trial
uses a different rule than the preceding scored trial; a repeat trial keeps the
same rule. Fast responses under the wrong rule are errors, not successes.

### Prerequisites

Each component rule must be mastered alone at the same stimulus range and
response mapping before mixed blocks.

### Category boundaries

Rules are simple and content-neutral: parity, magnitude relative to a shown
cutoff, vowel/consonant, warm/cool shape label, orientation, or explicitly taught
symbol classes. Knowledge-heavy classification belongs in its domain app.

### Subcategories

1. Single-rule baselines
2. Predictable and random switching
3. Congruency and cue preparation
4. Response remapping
5. Switching audits

### Common misconceptions

- Responding to the stimulus before reading the cue.
- Repeating the previous response rather than applying the current rule.
- Treating cue color/position as the answer instead of the rule.
- Confusing a rule switch with a response switch.
- Inferring a predictable alternation in random-cue blocks.
- Trading accuracy for speed after a switch.

### Switching generator contract

Every rule is a pure function from semantic stimulus to response class. Mixed
blocks precompute:

```text
ruleTransition: repeat | switch
responseTransition: repeat | switch
congruency: congruent | incongruent | univalent
cueTargetInterval
correctResponse
```

These factors must be balanced sufficiently to prevent switch status, cue,
stimulus, or button from predicting the answer. First scored trials have no
switch/repeat label and are excluded from switch-cost summaries.

### Family `switch_single_rule_baseline`

**Task.** Classify stimuli using one fixed rule before mixed practice.

**Response/template.** Two-choice response with rule permanently visible.

**Derivation.** Apply the selected rule function.

**Difficulty.** L1 univalent stimuli; L2 full range; L3 same timing as planned mixed block.

**Distractors/constraints.** Only taught categories; balance responses and boundary cases.

**Feedback.** State rule and decisive feature.

**Examples.** (1) parity: 7→odd. (2) `<5` versus `>5`: 8→greater. (3) arrow tilt: left/right.

**Validation.** Rule truth table exhaustive over bounded alphabet.

### Family `switch_predictable_alternation`

**Task.** Alternate between two rules in a displayed `A,B,A,B…` schedule.

**Response/template.** Two-choice timed block with rule label.

**Derivation.** Select scheduled rule by trial index, then classify.

**Difficulty.** L1 slow explicit cues; L2 shorter cue lead; L3 bivalent stimuli.

**Distractors/constraints.** Schedule displayed before block; not mixed with random-switch metric.

**Feedback.** Mark rule and response transitions separately.

**Examples.** (1) parity/magnitude over digits. (2) color/shape labels. (3) orientation/fill over symbols.

**Validation.** Alternation exact and component response balance maintained.

### Family `switch_random_cued`

**Task.** Apply one of two rules selected by a pseudorandom cue each trial.

**Response/template.** Two-choice timed block.

**Derivation.** Cue ID selects rule; rule maps stimulus to response.

**Difficulty.** L1 long cue-target interval; L2 shorter interval; L3 balanced incongruent bivalent stimuli.

**Distractors/constraints.** Run length capped; switch proportion 40–60%; cue cannot predict response.

**Feedback.** After block, show accuracy/median RT for switch and repeat trials.

**Examples.** (1) `PARITY` cue with 6→even. (2) `SIZE` cue with 3 relative to5→low. (3) switch from size to parity on incongruent digit.

**Validation.** Transition/congruency contingency table meets profile.

### Family `switch_three_rules`

**Task.** Switch among three separately mastered rules.

**Response/template.** Two- or three-choice block, with explicit cue.

**Derivation.** Cue selects one of three pure classifiers.

**Difficulty.** L3 only; generous timing; varied transition pairs.

**Distractors/constraints.** Do not introduce with new stimulus vocabulary; balance all directed rule transitions.

**Feedback.** Break down errors by incoming/outgoing rule pair.

**Examples.** (1) parity/magnitude/color. (2) shape/fill/orientation. (3) three symbol partitions using printed key.

**Validation.** Each rule/transition/response represented and uniquely scorable.

### Family `switch_congruency_contrast`

**Task.** Apply the cue when two possible rules would agree or disagree.

**Response/template.** Mixed two-rule block.

**Derivation.** Compute both rule outputs; tag congruent iff equal, score current rule only.

**Difficulty.** L2 balanced congruent/incongruent; L3 more incongruent switch trials.

**Distractors/constraints.** Congruency never visible as a cue; class balance crossed with transitions.

**Feedback.** On error, show response under current and irrelevant rule.

**Examples.** (1) 8 is even and high→congruent. (2) 3 is odd and low may map opposite by shown buttons. (3) incongruent switch.

**Validation.** Factor table exact; no accidental empty cell.

### Family `switch_transition_identify`

**Task.** Classify a shown trial transition as rule-repeat/switch and response-repeat/switch.

**Response/template.** Two named fields, untimed.

**Derivation.** Compare successive rule IDs and correct response IDs.

**Difficulty.** L1 rule switch obvious; L2 rule switch/response repeat; L3 rule repeat/response switch.

**Distractors/constraints.** Prevent conflation of rule and motor transition.

**Feedback.** Display `previous rule→current rule` and `previous response→current response`.

**Examples.** (1) A-left→B-left = rule switch/response repeat. (2) A-left→A-right. (3) B-right→A-left.

**Validation.** Transition labels computed from semantic trials.

### Family `switch_cue_target_interval`

**Task.** Practice the same cued switching rule under a declared preparation interval.

**Response/template.** Block task; interval visible in profile, not a learner answer.

**Derivation.** Rule oracle unchanged; actual cue and target onsets determine valid interval.

**Difficulty.** Longer interval first, then calibrated shorter intervals.

**Distractors/constraints.** Never compare blocks whose realized intervals drift beyond tolerance.

**Feedback.** Report task performance by interval without claiming a pure mental construct.

**Examples.** (1) cue 800 ms before target. (2) 400 ms. (3) variable 400/800 ms in explicitly mixed profile.

**Validation.** Actual interval logged; invalid timing excludes trial.

### Family `switch_response_mapping`

**Task.** Apply a newly displayed response mapping to an already mastered rule.

**Response/template.** Two-choice block with mapping preview/practice.

**Derivation.** Classify semantically, then map class to current button.

**Difficulty.** L1 mapping fixed; L2 reversed between blocks; L3 mapping cue selects one of two mappings.

**Distractors/constraints.** Mapping never reverses without explicit cue and criterion practice.

**Feedback.** Separate classification correctness from button-mapping error.

**Examples.** (1) odd=left/even=right. (2) next block reversed. (3) border cue selects mapping table.

**Validation.** Semantic class and motor response stored separately.

### Family `switch_asymmetric_rules`

**Task.** Switch between two rules with deliberately different but calibrated baseline difficulty.

**Response/template.** Mixed block after separate baselines.

**Derivation.** Ordinary rule oracle; interpretation uses each rule's own baseline.

**Difficulty.** L3; used to avoid assuming all switch directions are equivalent.

**Distractors/constraints.** No global comparison without sufficient baseline trials.

**Feedback.** Report A→B and B→A separately with rule baselines.

**Examples.** (1) digit parity versus symbol lookup. (2) orientation versus fill. (3) two learned partitions of different complexity.

**Validation.** Directed transitions balanced and baseline compatibility checked.

### Family `switch_cost_interpret`

**Task.** Calculate or interpret a transparent within-block switch-cost summary.

**Response/template.** Numeric/select answer from supplied medians: `switch median − repeat median`.

**Derivation.** Use correct valid trials only, stratified by declared response/congruency policy.

**Difficulty.** L1 raw subtraction; L2 accuracy/speed tradeoff; L3 insufficient valid cells.

**Distractors/constraints.** Never interpret as diagnosis or stable trait; no mean over invalid/outlier events.

**Feedback.** Show included counts and formula.

**Examples.** (1) 620−540=80 ms. (2) faster switches but lower accuracy→do not call improvement. (3) two switch trials→insufficient profile count.

**Validation.** Summary recomputed from immutable event log and minimum-count rule.

### Family `task_switch_audit`

**Task.** Find a cue, rule, transition, scoring, or timing defect in a switching block.

**Response/template.** Defect choice and corrected trial/summary.

**Derivation.** Replay cue→rule→class→mapping pipeline and timing validity.

**Difficulty.** L1 wrong rule; L2 switch confused with response switch; L3 first trial included in switch cost.

**Distractors/constraints.** Exactly one seeded root defect.

**Feedback.** Show pipeline and first divergence.

**Examples.** (1) `SIZE` cue scored by parity. (2) same rule/new button labeled switch. (3) hidden-tab RT included.

**Validation.** Valid trace mutated at one layer; oracle locates unique root.

### Cross-family progression

Master both single-rule baselines before predictable alternation, then random
cueing. Introduce congruency and response-transition labels before interpreting
switch cost. Three-rule, mapping-switch, and asymmetric families are advanced
and remain separate profiles.

## 6. Category: Single-stream n-back updating

### Category purpose

Train continuous comparison of the current stimulus with the stimulus exactly
`n` positions earlier while resisting nearby-position and repetition lures.

### Learn

For `n=2`, compare the current item with the item two positions back—not the
previous item and not any earlier match. The first two items cannot be 2-back
targets. After every item, update the short queue. Respond according to the
displayed target-only or two-button rule.

### Prerequisites

Forward recognition of the selected stimulus alphabet and criterion practice at
1-back.

### Category boundaries

This is a continuous updating task, not finite delayed recall. Dual streams and
selective attention begin in Category 7. The app does not infer a working-memory
capacity from the highest `n`.

### Subcategories

1. Untimed comparison
2. Visual and spatial streams
3. Auditory streams
4. Lures and adaptive load
5. N-back audits

### Common misconceptions

- Comparing with one-back regardless of `n`.
- Responding when the item appeared anywhere recently.
- Scoring warm-up positions as non-targets.
- Missing a target after two identical consecutive items.
- Treating a lure at `n−1` or `n+1` as a target.
- Letting target-only nonresponses drift into the next trial.

### N-back generation contract

Generate the desired truth/lure pattern first, then construct stimuli subject to
it. Default scored blocks:

```text
n:                 1..3 in v1, 4 only after stable mastery
scored trials:     20..40
target proportion: 25%..35%
lure proportion:   10%..20% where alphabet permits
warm-up trials:    exactly n, unscored
```

No current stimulus may accidentally create a target or declared lure contrary
to the truth vector. Target spacing, item frequency, run length, and response
side are balanced. A repeated stimulus at one-back is neither a target nor a
non-target by assumption; its classification is computed at the requested `n`.

### Family `nback_untimed_compare`

**Task.** Decide whether a shown current item matches the item exactly `n` places back in a visible sequence.

**Response/template.** Yes/no with the comparison positions highlighted after response.

**Derivation.** If index `i≥n`, compare `sequence[i]===sequence[i−n]`; otherwise `not yet scorable`.

**Difficulty.** L1 1-back; L2 2-back; L3 3-back with repeats elsewhere.

**Distractors/constraints.** One-back, any-prior, and warm-up errors.

**Feedback.** Draw the exact index pair.

**Examples.** (1) `A,B,A`, current A at2 is 2-back target. (2) `C,C,D`, D not target. (3) index1 in 3-back→not yet.

**Validation.** Direct indexed equality.

### Family `nback_symbol_target_only`

**Task.** Press only when the current symbol is an `n`-back target.

**Response/template.** One target button; silence is non-target response.

**Derivation.** Precomputed truth vector and response-window event match.

**Difficulty.** L1 1-back; L2 2-back; L3 3-back plus lures.

**Distractors/constraints.** Target rate balanced; no symbol-frequency cue.

**Feedback.** Block-level hits/misses/false alarms plus optional replay.

**Examples.** (1) 1-back repeated K→target. (2) `A,C,A` in 2-back→target. (3) `B,D,E,B` at 3-back→target.

**Validation.** Truth vector independently recomputed from stream.

### Family `nback_symbol_two_choice`

**Task.** Mark every scored symbol as target or non-target.

**Response/template.** Two buttons each trial.

**Derivation.** Same indexed equality, with one valid response required.

**Difficulty.** L1 self-paced; L2 timed; L3 higher `n`/lures.

**Distractors/constraints.** Button mapping counterbalanced between blocks; omissions distinct from non-target.

**Feedback.** Confusion counts and median correct RT by class.

**Examples.** (1) 2-back target. (2) one-back repeat in 2-back may be non-target. (3) omission logged separately.

**Validation.** Exactly one accepted response event or omission per scored trial.

### Family `nback_spatial_target`

**Task.** Detect when a highlighted location matches the location `n` trials earlier.

**Response/template.** Target-only or two-choice profile.

**Derivation.** Compare stable location IDs.

**Difficulty.** L1 1-back on 3×3; L2 2-back; L3 irregular layout and spatial lures.

**Distractors/constraints.** No animation path; equal location frequencies; hitboxes fixed.

**Feedback.** Replay paired locations after block.

**Examples.** (1) center repeats one back. (2) NW,E,NW→2-back target. (3) adjacent-cell lure.

**Validation.** Semantic IDs, rendered cells, and truth vector agree.

### Family `nback_tone_target`

**Task.** Detect an `n`-back match in a calibrated tone-ID stream.

**Response/template.** Target-only or two-choice; audio profile separate.

**Derivation.** Compare tone IDs at indexes.

**Difficulty.** L1 1-back wide pitch; L2 2-back; L3 larger alphabet/lures.

**Distractors/constraints.** Loudness/duration/timbre equalized; preview and calibration required.

**Feedback.** Replay relevant pair after block, never during live updating.

**Examples.** (1) low,high,low at2→target. (2) tone2 repeated one-back in 2-back→computed normally. (3) n+1 lure.

**Validation.** Audio schedule and semantic stream hashes agree.

### Family `nback_lure_rejection`

**Task.** Reject non-targets that match at a nearby but incorrect lag.

**Response/template.** Same live response mode as parent n-back family.

**Derivation.** Tag `n−1`, `n+1`, recent-non-n, and repetition lures separately; target remains exact lag `n`.

**Difficulty.** L2 one lure type; L3 balanced mix.

**Distractors/constraints.** Lure cannot also be a true target unless the family explicitly studies overlap and accepts target.

**Feedback.** State `It matched {lag}-back, but this was {n}-back.`

**Examples.** (1) one-back repeat during 2-back. (2) 3-back match during 2-back. (3) old match outside window.

**Validation.** Exact lag-set computation for each item.

### Family `nback_update_probe`

**Task.** After a short n-back block, answer which items currently occupy the last `n` queue positions.

**Response/template.** Ordered sequence.

**Derivation.** Return final `n` semantic stimuli in oldest-to-newest displayed order.

**Difficulty.** L1 n=1; L2 n=2; L3 n=3 after targets/lures.

**Distractors/constraints.** Prompt declares order; not used in ordinary score aggregation.

**Feedback.** Show queue after final few trials.

**Examples.** (1) final stream A,C→queue `[C]`. (2) A,B,C→`[B,C]` for2. (3) five-item stream, last3.

**Validation.** Array slice independent of response log.

### Family `nback_target_count`

**Task.** Count exact n-back targets in a short visible or replayed sequence.

**Response/template.** Integer input, normally untimed.

**Derivation.** Sum truth values from index `n`.

**Difficulty.** L1 1-back; L2 2-back; L3 overlapping targets and lures.

**Distractors/constraints.** Do not count warm-up or every repeated pair.

**Feedback.** Mark every compared pair.

**Examples.** (1) A,A,B→1 at1-back. (2) A,B,A,B→2 at2-back. (3) A,A,A at2-back→1.

**Validation.** Truth-vector sum.

### Family `nback_adaptive_level`

**Task.** Complete blocks whose `n` changes only after stable evidence.

**Response/template.** Live block with visible fixed `n`.

**Derivation.** Promotion/demotion uses versioned block thresholds for hits, false alarms, omissions, and valid count.

**Difficulty.** Increase `n` only; timing/alphabet/lure profile held fixed.

**Distractors/constraints.** Highest reached `n` is not labeled capacity; one lucky block cannot promote.

**Feedback.** Explain why level stayed/changed using transparent metrics.

**Examples.** (1) two accurate 2-back blocks→offer3. (2) high raw accuracy/high false alarms→stay. (3) invalid timing→repeat, no change.

**Validation.** State transition replay and threshold-boundary tests.

### Family `nback_sequence_repair`

**Task.** Modify one generated item so a declared target/lure pattern becomes true.

**Response/template.** Choose replacement token/location.

**Derivation.** Solve equality/inequality constraints over affected lags.

**Difficulty.** L1 create one target; L2 remove accidental target; L3 preserve neighboring truth values.

**Distractors/constraints.** Exactly one accepted replacement or all valid replacements accepted.

**Feedback.** Show every affected comparison edge.

**Examples.** (1) A,B,? make index2 a 2-back target→A. (2) replace one item to remove 1-back repeat. (3) preserve target at i while avoiding one at i+1.

**Validation.** Recompute complete truth vector for each candidate.

### Family `nback_audit`

**Task.** Find a truth-vector, warm-up, lure, response-window, or scoring defect.

**Response/template.** Trial/defect selection and corrected class.

**Derivation.** Replay stream equality and event-time rules.

**Difficulty.** L1 wrong lag; L2 warm-up scored; L3 late response assigned forward or hidden-tab block retained.

**Distractors/constraints.** One root defect with deterministic evidence.

**Feedback.** Show indexes, items, lag, actual timing, and corrected score.

**Examples.** (1) one-back repeat called 2-back target. (2) second item scored in 3-back. (3) response after window credited next target.

**Validation.** Valid episode mutated at one layer; earliest violation unique.

### Cross-family progression

Use untimed visible comparison first, then 1-back and 2-back with a single
modality. Add principled lures only after the exact-lag rule is reliable.
Target-only and two-choice profiles are separate. Spatial, symbol, and auditory
streams do not share mastery. Adaptive `n` begins only after fixed-level blocks
produce valid metrics.
## 7. Category: Dual-stream, selective, and mixed-control drills

### Category purpose

Combine already mastered component tasks in ways that train explicit
coordination, while preserving enough factorization to explain errors.

### Learn

In a dual stream, each stream has its own history. A location can be a target
while a sound is not. In a selective block, update only the cued stream and
ignore the other by rule. Combined practice is harder to interpret, so component
baselines remain visible and no mixed result replaces them.

### Prerequisites

Stable performance on every included component at the same load, timing,
alphabet, and response mapping.

### Category boundaries

This is an optional advanced category. It does not add more simultaneous streams,
unbounded multitasking, background notification simulation, or claims about
real-world multitasking ability.

### Subcategories

1. Independent dual-stream n-back
2. Conjunction and selective rules
3. Controlled switching with maintained state
4. Component comparison and audits

### Common misconceptions

- Using one stream's previous items as the other's history.
- Responding “both” when only one stream matches.
- Updating an ignored stream in a selective-maintenance task.
- Treating a modality switch as an n-back target.
- Letting a component with easier perception dominate a combined score.
- Interpreting dual-task improvement as general multitasking improvement.

### Family `dual_nback_independent`

**Task.** Judge spatial and auditory/symbol streams independently at the same fixed `n`.

**Response/template.** Two target controls; either, both, or neither may be activated within the trial window.

**Derivation.** Compute separate truth vectors from separate semantic streams.

**Difficulty.** L3 1-back; L4 2-back; L5 controlled lures in one stream at a time.

**Distractors/constraints.** Marginal and joint target classes balanced; stream timing synchronized and perception calibrated.

**Feedback.** Separate hit/miss/false-alarm tables by stream and joint class.

**Examples.** (1) location target only. (2) symbol target only. (3) both target while prior trial was neither.

**Validation.** Two independent index comparisons; all four joint classes represented.

### Family `dual_nback_conjunction`

**Task.** Respond only when both streams are n-back targets on the same trial.

**Response/template.** One conjunction-target button.

**Derivation.** `target = spatialTarget AND otherTarget`.

**Difficulty.** L3 1-back; L4 2-back with single-stream near-misses; L5 lures.

**Distractors/constraints.** Spatial-only and other-only events occur often enough to train conjunction, not rarity guessing.

**Feedback.** Show each component truth before conjunction.

**Examples.** (1) both match→target. (2) sound only→non-target. (3) location n−1 lure plus true sound match→non-target.

**Validation.** Boolean oracle and balanced four-cell distribution.

### Family `selective_stream_nback`

**Task.** Track only the stream named at block start while a synchronized distractor stream is present.

**Response/template.** Target-only or two-choice for selected stream.

**Derivation.** Truth uses selected stream only; distractor truth is recorded for analysis but never changes answer.

**Difficulty.** L2 distinct modalities; L3 more similar visual streams; L4 distractor contains plausible targets.

**Distractors/constraints.** Selected stream fixed for block; distractor salience/loudness cannot dominate.

**Feedback.** Show selected-stream comparison and note irrelevant match when it caused a false alarm.

**Examples.** (1) track positions, ignore symbols. (2) track tones, ignore positions. (3) ignored stream matches at n while tracked stream does not.

**Validation.** Answer invariant under changes to ignored stream that preserve presentation limits.

### Family `alternating_stream_nback`

**Task.** Apply n-back to the stream identified by an explicit trial cue.

**Response/template.** Target/non-target with cue preceding paired stimulus.

**Derivation.** Maintain both histories; cue selects which truth vector is queried.

**Difficulty.** L4 predictable alternation; L5 random cue with generous preparation interval.

**Distractors/constraints.** Both streams remain presented/updated; cue distribution crossed with target status.

**Feedback.** Display selected stream and exact comparison indexes.

**Examples.** (1) position cue queries spatial target. (2) symbol cue queries non-target despite spatial match. (3) cue switches streams on consecutive targets.

**Validation.** Both queues update every trial; selected truth matches cue.

### Family `switch_with_memory_state`

**Task.** Switch between two simple classifications while retaining a short, separately displayed state value.

**Response/template.** Classification response followed by occasional state probe.

**Derivation.** Rule response and state update are separate semantic functions.

**Difficulty.** L4 two-item state; L5 probe after a rule switch.

**Distractors/constraints.** State operation is trivial and taught; never mix with n-back until both are mastered.

**Feedback.** Separate switch error from state-recall error.

**Examples.** (1) parity/magnitude while retaining last border icon. (2) probe current two-symbol queue. (3) rule switch followed by state probe.

**Validation.** Classification and state oracles independent; scores remain separate.

### Family `mixed_component_compare`

**Task.** Compare component and combined block results without inventing one overall ability score.

**Response/template.** Select supported statement from transparent metrics.

**Derivation.** Check statements against valid counts, accuracy, false alarms, and median RT within compatible profiles.

**Difficulty.** L2 obvious accuracy difference; L3 speed–accuracy tradeoff; L4 invalid cross-profile comparison.

**Distractors/constraints.** Statements never diagnose a cause or generalize beyond named tasks.

**Feedback.** Name exactly which metrics support the conclusion.

**Examples.** (1) dual accuracy below both component blocks. (2) faster but more false alarms→mixed result. (3) touch and keyboard RTs→not directly comparable.

**Validation.** Claim checker accepts only entailed descriptive statements.

### Family `profile_compatibility`

**Task.** Decide whether two practice results are directly comparable.

**Response/template.** Comparable/not comparable plus differing profile field.

**Derivation.** Compare construct, modality, load, alphabet, mapping, timing, accessibility, and device policy.

**Difficulty.** L1 same profile; L2 one timing difference; L3 several changes with one declared equivalence.

**Distractors/constraints.** Same family name alone is insufficient.

**Feedback.** Diff versioned profile fields.

**Examples.** (1) same 2-back profile/date differs→comparable. (2) target-only versus two-choice→not direct. (3) auditory versus visual→not direct.

**Validation.** Compatibility matrix is explicit and versioned.

### Family `mixed_control_audit`

**Task.** Find a stream-history, selection, conjunction, aggregation, or compatibility defect.

**Response/template.** Layer/defect choice and corrected result.

**Derivation.** Replay each component, selection/conjunction rule, response mapping, and profile comparison.

**Difficulty.** L3 wrong stream; L4 OR used instead of AND; L5 opaque combined score hides failed component.

**Distractors/constraints.** One root defect; downstream metrics follow the mutation consistently.

**Feedback.** Decompose combined result into component truths and metrics.

**Examples.** (1) sound compared with old location ID. (2) either-target scored in both-target task. (3) visual self-paced score averaged with auditory timed score.

**Validation.** Mutation testing over each coordination layer.

### Cross-family progression

Begin with selective fixed-stream practice, then independent dual n-back at a
lower load than component maxima. Conjunction and alternating-stream variants
remain distinct. Mixed component interpretation may be taught early, but
`switch_with_memory_state` is deferred until switching and finite-state recall
are independently stable.

## 8. Topic-level progression

### Level 1 — Understand one rule without time pressure

- single 90°/180° rotations with visible anchors;
- one cube turn and cardinal heading update;
- three- or four-item forward recall;
- separately practiced single classification rules;
- visible, untimed 1-back comparisons;
- full corrective feedback after each response.

### Level 2 — Maintain one state accurately

- choose/construct planar rotations and distinguish translation;
- short cube/route updates;
- four- to six-item serial/spatial recall and position probes;
- predictable two-rule alternation;
- fixed 1-back or introductory 2-back blocks;
- generous, calibrated fixed timing.

### Level 3 — Resist one principled competitor

- reflection near-misses and rotation composition;
- mixed-axis cube turns and simple nets;
- repeats, reverse recall, and adjacent transpositions;
- random cued switching with congruent/incongruent stimuli;
- 2-back with one-back/three-back lures;
- selective or simple independent dual-stream practice.

### Level 4 — Coordinate several mastered operations

- viewer/object inversion and irregular cube nets;
- transformed recall or declared neutral delay;
- response remapping, three rules, or directed switch analysis;
- stable 3-back or dual 2-back;
- profile compatibility and transparent metric interpretation;
- fewer scaffolds, but never ambiguous cues.

### Level 5 — Audit and advanced bounded coordination

- find a root error in a transformation or timing trace;
- distinguish component from combined-task failure;
- random stream selection with independently maintained histories;
- repair an n-back sequence while preserving neighboring truth values;
- reason about speed–accuracy tradeoffs and invalid measurements;
- all difficulties remain short, exact, and reproducible.

Level 5 is not a claim of superior cognition. It only names complexity within
this app's task profiles.

## 9. Adaptive practice guidance

### Mastery state

Track:

```text
family
modality
stimulus alphabet/layout
load/sequence length/n
transformation type or rule pair
lure/misconception
response mapping
timing profile
accessibility presentation
accuracy evidence
response-time evidence
invalid-trial rate
```

Do not infer mastery in one representation from another.

### Diagnostic routing

- Wrong rotation direction but correct shape identity → more
  `rotation_2d_angle`, not longer sequences.
- Reflection accepted as rotation → contrast chiral anchors before adding speed.
- Cube top correct/front wrong → return to full orientation-frame updates.
- Correct recall items in wrong order → order probes and shorter serial recall.
- Repeated-token collapse → repetition-balanced forward recall.
- Reverse-recall errors with good forward recall → hold length and practice only
  the reverse operation.
- High switch errors with strong single-rule baselines → longer cue-target
  interval and transition identification.
- Weak single-rule baseline → remove switching and retrain that rule.
- Rule accuracy good but button errors high → response-mapping practice.
- N-back false alarms concentrated at `n−1` → targeted lure contrast.
- N-back omissions and slow responses across all classes → longer timing or a
  break, not automatically lower `n`.
- Warm-up responses → visible index scaffolding.
- Dual-task errors isolated to one stream → return to that component.
- High invalid-trial rate → calibrate device/presentation before adapting skill.

### Speed and accuracy

Accuracy gates speed. A family should shorten response windows only when recent
valid blocks meet accuracy and false-alarm thresholds. If speed improves while
accuracy declines beyond the declared tolerance, the scheduler reports a
speed–accuracy tradeoff and does not promote.

Response-time adaptation uses robust summaries over correct valid trials and a
minimum sample. It does not punish accessibility input latency or compare
different input methods.

### Forgetting and review

Use spaced review for task rules and previously mastered loads, but do not
present a “memory decay” estimate. A lapsed level receives an untimed reminder
and one diagnostic block before adaptation. Mixed blocks never replace simple
component review.

## 10. Answer checking and worked feedback

### Semantic checking

- Transformations compare canonical semantic objects, not screenshots.
- Spatial selections resolve to stable cell/face IDs.
- Ordered recall compares token IDs position by position.
- Switching evaluates cue→rule→class→response mapping.
- N-back evaluates exact indexed equality against a precomputed truth vector.
- Mixed tasks score component truths before Boolean/selection composition.

### Timing checking

The scorer consumes only logged actual onsets and deduplicated response events.
It records early, valid, late, duplicate, and absent responses. A late event
cannot become the next trial's response. Timing-invalid trials are excluded from
RT and normally from accuracy.

### Feedback timing

Immediate trial feedback is appropriate in Learn mode. Continuous task modes
default to block feedback because a correctness flash or sound can become an
extra stimulus and disrupt the next trial. Optional brief neutral acknowledgement
must be identical across answer classes.

### Worked feedback sequence

1. Restate the rule/profile.
2. Show the relevant semantic states or indexes.
3. Identify the learner response and correct response.
4. Diagnose a misconception only when the response matches a known alternative.
5. Show the smallest useful correction.
6. Report whether the trial was timing-valid.
7. Keep task-specific claims bounded.

Examples:

> You chose the mirror image. A rotation preserves the clockwise order of the
> red, blue, and green markers; this candidate reverses it.

> This was a 2-back trial. The current `A` matches the item one position back,
> but the item two positions back was `C`.

> The rule changed from magnitude to parity, but the correct button happened to
> remain left. That is a rule switch and a response repeat.

### Confidence and partial credit

Optional confidence is collected only after the response and is not used to
change correctness. Ordered recall may display item-position accuracy for
diagnosis, while its primary whole-sequence score remains explicit. No partial
credit is silently combined with exact scores.

## 11. Rendering, interaction, localization, and accessibility

### Semantic-first rendering

The same semantic object drives:

- visual SVG/Canvas/DOM;
- optional audio;
- accessible label;
- correct answer;
- replay;
- worked feedback.

Do not infer a shape from rendered pixels in the answer oracle.

### Visual requirements

- Use SVG/DOM for crisp discrete shapes where practical.
- Canvas must support device-pixel ratio without changing logical hitboxes.
- Rotation centers, axes, viewer direction, sequence order, and selected rule
  are visually explicit where relevant.
- Similarity is controlled by geometry, not antialiasing artifacts.
- Correct/distractor images share scale, line weight, contrast, and bounding box.
- Do not animate mental-rotation answers by default; reveal discrete stages after
  grading.
- Response controls do not move between trials.

### Audio requirements

- Generate tones procedurally with Web Audio; no network asset is required.
- Provide master volume, preview, silence test, and instant mute.
- Use short attack/release envelopes and conservative peak level.
- Tone identity never leaks through loudness, duration, stereo position, or
  timbre unless that property is the declared alphabet.
- Audio-context suspension invalidates affected trials.
- Never autoplay before intentional start.

### Input requirements

- Ignore key auto-repeat unless a family explicitly accepts repeated entry.
- Deduplicate touch-generated click events.
- Do not accept input during count-in unless it is logged as premature.
- Show current semantic mapping near controls.
- Permit a neutral start control so the first response key does not also start
  the episode.
- Fullscreen is optional and never required.

### Localization

- Translate all cues, rules, feedback, metrics, and safety/claims language.
- Do not use language-dependent vowel/consonant or word-class rules unless the
  locale defines and reviews its own alphabet.
- Symbol and digit rules are preferred for cross-locale equivalence.
- Clockwise/counterclockwise wording must be validated against diagrams.
- Decimal separators and milliseconds labels follow locale without changing
  stored values.
- Locale versions are separate profiles when wording changes cue length or
  perceptual difficulty.

### Accessibility profiles

An accommodation may change the measured task. That is acceptable; exclusion is
not. Store a distinct profile and describe it honestly:

- self-paced visual rotation;
- high-contrast shape set;
- non-color cue set;
- text/symbol rather than audio sequence;
- switch-access scanning with non-RT scoring;
- longer fixed presentation;
- reduced-motion discrete states.

Do not rank these profiles against one another.

## 12. Generator and implementation architecture

Recommended modules:

```text
seededRng
episodeBuilder
transformationGroup2D
cubeRotationGroup
cubeNetFolder
routeOracle
sequenceGrammar
nbackConstraintGenerator
taskRuleRegistry
transitionBalancer
stimulusRenderer
audioScheduler
monotonicTimingLogger
inputDeduplicator
trialInvalidator
semanticScorer
metricAggregator
adaptiveScheduler
profileRegistry
localProgressStore
accessibilityPresenter
```

### Deterministic generation

Given seed and all profile versions, the semantic episode, expected answers,
target/lure vector, rule transitions, and choice set must reproduce exactly.
Actual onset/input times are session observations and do not affect semantic
regeneration.

### Construct backward

Prefer constrained/backward generation:

- choose transformation class, then generate asymmetric shape and distractors;
- choose a valid cube rotation/net relation, then render it;
- choose desired sequence properties, then fill tokens;
- choose the switch/repeat × response-repeat/switch × congruency table, then
  select compatible stimuli;
- choose n-back target/lure truth, then solve stimulus equality constraints.

Pure random generation followed by weak filtering is not sufficient for timed
blocks because it creates imbalanced answers and accidental cues.

### Standalone architecture

- One offline HTML/JS/CSS app; no backend or network is required.
- Web Audio is synthesized locally.
- No webcam, microphone, account, or telemetry is needed.
- Progress and settings stay local by default and are exportable/deletable.
- A service worker, if used, is optional and version-safe.
- The app remains usable when installed/opened without fullscreen or special
  permissions.

### Reproducible event log

Store locally, subject to user deletion:

```text
episode/profile/seed
semantic trial IDs and truth classes
intended and actual timing
deduplicated input events
focus/visibility/invalidation events
scored outcome and metric version
```

Do not store raw audio, health information, or inferred diagnoses.

## 13. Automated validation requirements

### Transformation tests

- Exhaust every 2D rotation/reflection over every supported grid size.
- Four quarter turns return the source.
- Proper rotations preserve distances and handedness; reflection reverses
  handedness.
- Enumerate exactly 24 proper cube orientations.
- Cube turns preserve opposites, adjacency, and unique face assignment.
- Fold every supported cube-net topology from every permitted root orientation.
- World/view and egocentric/allocentric transforms round-trip.
- Route replay stays in declared bounds.

### Sequence tests

- Presented token/cell/tone stream equals semantic source.
- Forward, reverse, probe, recognition, and transform answers derive from the
  immutable source.
- Generation rejects accidental chunks and response-frequency leakage.
- Repeats are present at required coverage and never silently collapsed.
- Audio identity, onset order, and visual labels agree.

### Switching tests

- Exhaust each bounded component rule's truth table.
- Cross rule transition, response transition, congruency, cue, and response
  cells according to coverage profile.
- First trial excluded from transition metrics.
- Cue-target intervals use actual onset and meet tolerance.
- Mapping reversals separate semantic class from motor response.
- Switch-cost summary uses compatible correct valid trials and minimum counts.

### N-back tests

- Independently recompute every truth vector by indexed equality.
- Warm-up length is exactly `n` and unscored.
- Target and lure proportions satisfy the profile after construction.
- Lures are tagged at every matching lag and cannot overwrite true targets.
- Item frequency, target spacing, run length, and response class pass balance
  constraints.
- Dual streams are independent and all joint target classes occur.
- Repair families recompute the whole affected truth vector.

### Timing and input tests

- Simulate late callbacks, dropped frames, hidden tabs, focus loss, audio suspend,
  resize/reflow, duplicate pointer/click events, key repeat, and pauses.
- Late responses never move to a later trial.
- Invalid trials never enter response-time aggregates.
- Self-paced profiles never emit speed claims.
- Median and count summaries reproduce from event logs.
- Mapping and controls stay stable within a block.

### Accessibility and leakage tests

- Keyboard-only operation reaches every control in logical order.
- 200% zoom/reflow preserves complete stimuli and fixed response mapping.
- Reduced-motion mode removes nonessential animated transforms.
- No generated presentation violates configured flash/luminance safeguards.
- Every semantic stimulus has an appropriate accessible representation or a
  clearly labeled separate-task alternative.
- Correct class cannot be predicted above chance from filename, DOM order,
  bounding-box size, loudness, duration, color frequency, timing, or choice
  position.

### Property and seed volume

For at least `25,000` deterministic seeds per family/profile tier:

- all placeholders resolve;
- answers are unique or accepted sets are explicit;
- distractors correspond to declared misconceptions;
- every episode satisfies balance and rejection rules;
- semantic and independent audit oracles agree;
- replay produces identical semantic content;
- no non-finite metric or division by zero occurs;
- all timing-dependent scores can become `NO_VALID_SCORE` safely.

Mutation tests must catch at least:

- clockwise/counterclockwise reversal;
- reflection accepted as rotation;
- cube handedness reversal;
- ordered recall scored as a set;
- repeated item removed;
- cue mapped to wrong rule;
- rule switch confused with response switch;
- `n−1` used in place of `n`;
- warm-up trial scored;
- dual streams cross-indexed;
- late response shifted forward;
- hidden-tab time retained;
- incompatible profiles aggregated.

## 14. Coverage requirements

Across a long practice history:

- clockwise/counterclockwise and all supported angles are balanced;
- rotations, reflections, translations, and true mismatches all occur;
- shape symmetry levels, markers, pivots, and grid regions are distributed;
- every cube axis/face and every valid net topology appears;
- route headings and left/right turns are balanced;
- sequence alphabets, serial positions, repeats, transpositions, and lengths are
  distributed without familiar chunks dominating;
- every switching rule appears both before and after a switch;
- rule switch/repeat is crossed with response switch/repeat and congruency;
- every n-back item/location appears similarly often;
- target/non-target, lure types, and target spacing are balanced;
- dual streams cover neither, each-only, and both-target classes;
- every declared misconception is intentionally exercised;
- self-paced and accessibility profiles remain available rather than being
  displaced by challenge mode.

Recent structural signatures are downweighted. Cosmetic recoloring, renaming, or
cue reordering does not count as new coverage.

## 15. Recommended views and v1 priorities

### Views

1. **Learn** — untimed rule demonstrations with visible working.
2. **Practice** — short blocks with generous timing and block feedback.
3. **Challenge** — calibrated fixed-profile blocks.
4. **Review** — replay semantic stimuli, correct answers, and invalid trials.
5. **Progress** — separate family/profile trends, never a global brain score.
6. **Settings & calibration** — input, audio, contrast, motion, timing, and data
   controls.

### Recommended v1

Prioritize:

- 2D rotation, angle, reflection distinction, marker tracking, and audits;
- single cube turns, heading, relative/world directions, and short routes;
- forward symbol/spatial recall, exact recognition, position probes, and reverse
  recall;
- two separately mastered rules, predictable/random switching, transition
  identification, and congruency;
- visible untimed n-back, fixed 1-/2-back symbol and spatial blocks, target-only
  and two-choice modes, lure rejection, and audits;
- deterministic event logging, invalidation, self-paced mode, and accessible
  controls from the beginning.

Defer:

- arbitrary cube nets beyond a reviewed topology set;
- auditory sequences/n-back until Web Audio calibration and accessibility review;
- 3-/4-back adaptation until target/lure construction is robust;
- three-rule switching, variable cue-target intervals, and response-mapping
  switches;
- dual n-back and mixed-control tasks until component dashboards and factorized
  feedback are proven;
- any normative comparison, experimental research mode, or cognitive-transfer
  claim.

## 16. Topic-level quality checklist

- [ ] Every result names the exact practiced task/profile.
- [ ] No IQ, brain-age, diagnosis, prevention, treatment, or far-transfer claim
  appears.
- [ ] There is no global cognitive score.
- [ ] Component and combined-task mastery remain separate.
- [ ] Timed exercises store actual onset rather than trusting requested timers.
- [ ] Hidden, stalled, suspended, resized, or paused trials fail safely.
- [ ] Late and duplicate inputs cannot contaminate later trials.
- [ ] Every timed task has self-paced practice and transparent timing.
- [ ] Accuracy gates speed adaptation.
- [ ] Breaks are offered and the next block never auto-starts.
- [ ] Mental rotation distinguishes proper rotation from reflection exactly.
- [ ] Symmetry cannot make a unique-answer instance ambiguous.
- [ ] Cube states come only from the 24 proper rotations.
- [ ] Sequence recall preserves repetitions and order.
- [ ] Sequence generators reject accidental chunks and motor paths.
- [ ] Switching rules are mastered separately before mixed blocks.
- [ ] Rule transition and response transition remain distinct.
- [ ] Switching factor tables are balanced and first trials excluded.
- [ ] N-back truth vectors are constructed/verified exactly.
- [ ] Warm-up trials are unscored.
- [ ] Target rates, lure types, item frequencies, and target spacing are balanced.
- [ ] Dual streams maintain independent histories and component scores.
- [ ] Feedback does not become an extra timed stimulus.
- [ ] Visual/audio properties do not leak the answer class.
- [ ] Reduced motion, keyboard access, clear focus, contrast, and timing controls
  are implemented.
- [ ] Accessibility profiles are labeled separately rather than falsely
  score-equated.
- [ ] Every family has a task, response template, derivation, difficulty,
  misconception-based distractors, feedback, three examples, and validation.
- [ ] At least 25,000 deterministic seeds per family/profile tier pass.
- [ ] Mutation tests detect transformation, ordering, cue, lag, stream, timing,
  and profile-aggregation failures.
- [ ] The standalone app works without a backend, account, or runtime download.

## 17. Stable identifiers and navigation

Recommended navigation:

```text
Rotation
3D & Orientation
Sequence Memory
Task Switching
N-Back
Mixed Drills
```

Stable family identifiers are the backticked identifiers in this document.
Renaming a visible category does not change saved mastery identity. A semantic,
timing, scoring, alphabet, modality, or accessibility change requires a new
profile version so older results remain interpretable.
