# Game Programming Fundamentals — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, deterministic simulation oracle, geometry/collision engine, timeline/graph renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Game Programming Fundamentals

### Topic goal

Develop fluent reasoning about the small systems that make an interactive game behave correctly. The learner should become able to:

- reason in frames, ticks, seconds, and fixed simulation steps without tying motion to frame rate;
- move reliably among local, world, camera, viewport, screen, grid, and texture spaces;
- use vectors, dot products, projections, rotations, transforms, and quaternions for common gameplay decisions;
- integrate velocity and acceleration under an explicitly stated update rule;
- implement and diagnose simple steering, jumping, damping, and turn-toward behavior;
- detect and respond to common 2D collisions, raycasts, triggers, layers, and swept contacts;
- derive camera, visibility, draw-order, transparency, atlas, pixel-snapping, and batching results;
- distinguish pressed, held, and released input and reason about buffering, dead zones, coyote time, animation state, and events;
- organize entities, components, systems, lifecycle changes, events, pools, data, and save-state snapshots;
- trace grid navigation and lightweight game-AI decisions;
- use seeded randomness and constrained procedural rules reproducibly;
- read frame budgets and profiler evidence;
- understand the timing mechanics of snapshot interpolation and client prediction at a conceptual, locally simulated level.

The app trains exact, transferable mental models. It is not a tutorial for a particular engine, rendering API, or game genre.

### Position within Practice Lab

- **Linear Algebra** owns general vector spaces, matrices, bases, and proofs. This app applies a small subset to transforms, cameras, motion, and collision.
- **Geometry and Trigonometry** owns general geometric theorems and trig fluency. This app uses geometry operationally.
- **Physics** owns physical laws and modeling. This app uses deliberately simplified kinematic/gameplay models and always names its integration/response assumptions.
- **Calculus** owns continuous change. This app concentrates on discrete simulation.
- **Computer Science** owns general graph algorithms, data structures, and asymptotics. This app applies them to paths, spatial queries, lifecycle, and frame budgets.
- **C++ Mental Execution** owns language semantics. Code-like game questions use a tiny pseudocode IR, not C++ corner cases.
- **Networking and Protocols** owns packets and protocols. This app includes only client-facing simulation timelines.

### Audience and prerequisites

The initial audience is an aspiring or practicing game programmer from beginner through early intermediate level.

Expected prerequisites:

- arithmetic with negative numbers, fractions, and percentages;
- Cartesian coordinates and the Pythagorean theorem;
- basic programming variables, arrays, conditions, loops, functions, and state;
- a first exposure to vectors is helpful but not required.

The Learn cards introduce dot products, transforms, fixed timesteps, graph search, and finite-state machines before they are graded without scaffolding.

### Teaching runtime profile

The default model ID is:

```text
PL-GameSim-2D-v1
```

It is a small semantic engine, not an API:

- world positions and displacements use game units;
- time uses seconds;
- 2D world axes are `+x` right and `+y` up;
- screen axes are `+x` right and `+y` down, with origin at the viewport's top-left;
- positive 2D rotation is counterclockwise;
- angles are radians internally; prompts may display degrees;
- vectors are column vectors;
- transform composition `A * B * p` applies `B` first, then `A`;
- child world transform is `parentWorld * childLocal`;
- default simulation uses a fixed timestep;
- collision is 2D and kinematic unless a family declares the simple impulse model;
- entities have stable semantic IDs independent of array index or draw order;
- randomness uses the pinned integer generator described below.

Selected 3D families use a separate declared profile:

```text
PL-GameSim-3D-v1
```

It is right-handed, with `+x` right, `+y` up, and camera forward along local `-z`. Every 3D diagram labels its axes. No answer may depend on an unstated engine convention.

### Numeric and unit contract

- Semantic geometry uses exact integers/rationals where generation permits.
- General 2D numeric checking uses absolute/relative tolerance `1e-6`.
- Display rounding never feeds back into later simulation unless explicitly stated.
- Vectors render as `(x, y)` or `(x, y, z)`.
- Units are written, such as `units/s`, `units/s²`, `s`, `px`, or `rad`.
- A normalized direction must have length 1 within tolerance.
- Normalizing the zero vector is undefined; ordinary questions reject it, while audits may ask the learner to catch it.
- Angles normalize to `[0, 2π)` unless the family asks for shortest signed difference, which uses `[-π, π)` so exactly `π` maps to `-π`.
- Floating-point edge behavior, NaN, infinities, and denormals belong in Floating-Point Practice unless deliberately used in a bug-audit family.

### Vector and transform contract

For vectors `a=(ax,ay)` and `b=(bx,by)`:

```text
dot(a,b) = ax*bx + ay*by
cross2(a,b) = ax*by - ay*bx
lengthSquared(a) = dot(a,a)
normalize(a) = a / length(a), for nonzero a
project(a onto n) = dot(a,n)*n, when n is unit length
reflect(v,n) = v - 2*dot(v,n)*n, when n is unit length
lerp(a,b,t) = (1-t)*a + t*b
```

A 2D transform contains translation, rotation, and nonzero scale. Point transforms include translation; direction transforms do not. Normal transformation under nonuniform scale is supplied or excluded rather than guessed.

Quaternion questions use unit quaternions stored as `(w,x,y,z)`. `q` and `-q` represent the same orientation. Composition order follows the transform contract. Spherical interpolation flips one endpoint when necessary to take the shortest arc, then normalizes. Learners are not asked to derive arbitrary quaternion logarithms or hand-expand large quaternion products.

### Game-loop and time contract

The fixed-step loop is:

```text
frameDelta = min(realFrameDelta, maxFrameDelta)
accumulator += frameDelta
steps = 0

while accumulator >= step && steps < maxSteps:
    previousState = currentState
    simulate(currentState, step, sampledInput)
    accumulator -= step
    steps += 1

alpha = accumulator / step
renderState = lerp(previousState, currentState, alpha)
```

The prompt states `step`, `maxFrameDelta`, `maxSteps`, and what happens to time left after the step cap. Default cap policy is **retain the remainder** while reporting that the simulation is behind. An alternative discard policy must be labeled.

Default update phases:

1. collect device events;
2. derive action states (`pressed`, `held`, `released`);
3. run zero or more fixed simulation ticks using the frame's sampled actions;
4. commit deferred spawn/despawn and queued structural changes at the declared barrier;
5. update presentation-only animation/camera state where specified;
6. interpolate and render;
7. clear one-frame input edges.

Families may use a different phase order only by displaying it.

### Motion and integration contract

Constant-velocity motion:

```text
positionNext = position + velocity * dt
```

Default acceleration integration is semi-implicit Euler:

```text
velocityNext = velocity + acceleration * dt
positionNext = position + velocityNext * dt
```

Explicit Euler appears only in comparison families:

```text
positionNext = position + velocity * dt
velocityNext = velocity + acceleration * dt
```

Linear damping uses a frame-rate-independent exponential factor:

```text
valueNext = value * retentionPerSecond ^ dt
```

No family silently substitutes `value *= 1-k*dt`. Speed clamping preserves direction and caps magnitude. Forces, mass, impulses, friction, and restitution appear only in families with a fully supplied simplified model.

### Collision contract

Shapes are:

- point;
- circle `{center,radius}`;
- axis-aligned box `{min,max}`;
- line segment;
- ray `origin + t*direction`, `t>=0`;
- controlled convex polygon in selected separating-axis questions.

Boundaries are closed. “Overlap” includes touching; “penetration” requires positive depth. AABBs use ordered minima/maxima. Collision normals point from object B toward object A unless the prompt explicitly labels another convention.

For AABB status, per-axis intersection length is:

```text
intersection = min(maxA,maxB)-max(minA,minB)
```

For a minimum translation vector, do not use that intersection length under containment. Compute the signed movements that would place `A.max` on `B.min` or `A.min` on `B.max`, choose the smaller absolute movement for each axis, then choose the smallest axis movement with the declared tie rule.

For a moving object striking a static surface with unit normal `n`, and only when `dot(v,n)<0`:

```text
vNormal = dot(v,n)*n
vTangent = v-vNormal
vAfter = vTangent - restitution*vNormal
```

Default restitution is zero and default friction is absent. General rigid-body rotation, contact manifolds, stacking, iterative solvers, and stable friction cones are excluded.

Broad phase may return false positives but must not return false negatives under its stated bounds. Narrow phase decides the actual geometric contact.

### Input, state, and animation contract

For a digital action:

```text
pressed  = currentDown && !previousDown
held     = currentDown
released = !currentDown && previousDown
```

Analog dead zones state radial or axial mode. Radial remapping uses:

```text
if magnitude <= deadZone: output = 0
else outputMagnitude = (magnitude-deadZone)/(1-deadZone)
```

and preserves direction.

State-machine transitions are evaluated in displayed priority order; the first true enabled transition fires, and at most one transition fires per update unless the question declares chaining. Animation intervals are half-open. A looping clip of duration `D` samples time `t mod D`. Events belong to an interval-crossing rule supplied by the family so wrapping and large `dt` are decidable.

### Entity, event, and lifecycle contract

An entity is a stable ID. Components are data records. Systems query required component sets and run in a declared order.

Structural mutations use commands:

```text
Spawn(spec)
Add(entity,component)
Remove(entity,componentType)
Despawn(entity)
```

Default behavior queues commands during iteration and applies them at the end-of-tick barrier in FIFO order. A despawned entity is invalid after commit. Events are immutable values delivered through a declared immediate or queued channel. Default gameplay events are queued and consumed next phase; listeners cannot mutate the collection currently being iterated.

Object-pool occupancy is an implementation detail; an inactive pooled object is not a live entity. Reset contracts list every field that must be restored.

### Navigation and AI contract

Grid navigation uses explicit 4- or 8-neighbor movement and displayed costs. Diagonal corner-cutting policy is stated. A* uses:

```text
f(n) = g(n) + h(n)
```

Tie-breaking is deterministic and displayed, normally lowest `f`, then lowest `h`, then row-major cell ID. Manhattan distance is used for 4-neighbor unit grids; octile/Chebyshev choices are supplied for diagonal grids.

Behavior-tree statuses are `Success`, `Failure`, and `Running`. Sequence and selector child-memory policy is displayed. Utility AI chooses the greatest score, with deterministic tie-breaking. These tasks practice decision mechanics, not believable character design.

### Randomness and determinism contract

The teaching RNG is `xorshift32-v1` over unsigned 32-bit integers:

```text
x ^= x << 13
x ^= x >>> 17
x ^= x << 5
```

Mask to 32 bits after each operation; seed zero is rejected. An RNG draw is consumed only where the semantic program says so. Integer range mapping and weighted choice use supplied rejection/ticket algorithms; modulo bias is not silently accepted.

“Deterministic replay” means the same initial snapshot, fixed-step schedule, ordered inputs, content version, and RNG state produce the same semantic state under this runtime. It does not promise arbitrary engines, CPU architectures, physics solvers, or unordered iteration will be bit-identical.

### Rendering and camera contract

The renderer is semantic rather than API-specific:

- opaque depth-tested 3D objects may be drawn in any order when depth state is identical;
- ordinary alpha blending uses source-over and requires declared back-to-front order for transparent layers;
- 2D sprites use explicit layer and order keys;
- a camera maps world coordinates through view/projection/viewport transforms;
- viewport culling is conservative;
- texture coordinates use normalized `(u,v)` unless pixels are explicitly requested;
- atlas rectangles use half-open pixel bounds;
- pixel snapping states whether it rounds camera, object, or final screen position.

No rasterizer, shader language, GPU architecture, color-management, or lighting model is assumed.

### Profiling and network-timeline contract

Frame budget at target rate `F` is `1000/F` milliseconds. For pipelined CPU/GPU work, steady-state frame time is modeled as the larger of CPU and GPU frame times unless the prompt supplies synchronization or overlap details. Never add them by default.

Networking families use already received timestamped snapshots. They model interpolation delay, client prediction, authoritative correction, and replay of buffered inputs. They do not implement sockets, packet formats, security, lag compensation, rollback netcode, or trust policy.

### Scope

The topic includes:

- frame duration, delta time, fixed-step accumulation, interpolation, timers, pausing, update order, and frame pacing;
- vectors, distances, normalization, dot/projection/reflection, angle wrapping, 2D rotation, local/world transforms, hierarchy, and introductory quaternion orientation;
- discrete motion, acceleration, damping, speed caps, gravity/jumping, steering, pursuit, arrival, and turn limits;
- 2D overlap, ray/segment queries, collision layers, broad/narrow phase, spatial hashing, swept contact, triggers, and simple normal response;
- camera/world/screen conversion, follow behavior, parallax, culling, draw order, transparency, atlases, pixel snapping, and batching;
- input actions, edges, dead zones, buffering, coyote time, state machines, clip time, animation events, blending, and root motion;
- entities/components/systems, deferred lifecycle, pooling, events, cooldown/resources, snapshots, and data-driven configuration;
- grid neighbors, line of sight, BFS/A*, heuristics, path smoothing, waypoint movement, finite-state AI, behavior trees, and utility scoring;
- seeded random streams, unbiased range selection, weighted choice, shuffle bags, constrained spawning, local procedural tile rules, and replay determinism;
- frame budgets, profiler bottlenecks, allocation/pooling, batching, snapshot interpolation, and prediction/reconciliation.

### Exclusions

The initial app does not include:

- engine/editor-specific APIs, scene files, package systems, inspector workflows, or build/export pipelines;
- full C++, C#, Rust, Lua, GDScript, shader, or scripting-language semantics;
- unrestricted source-code entry or compiler execution;
- rendering APIs, shader programming, lighting equations, materials, PBR, shadow maps, GPU synchronization, or graphics-driver behavior;
- full rigid-body engines, constraint solvers, ragdolls, fluids, cloth, vehicle dynamics, or physically exact simulation;
- 3D mesh collision, arbitrary convex decomposition, robust computational-geometry degeneracies, or production navmesh construction;
- skeletal skinning matrices, inverse kinematics, motion matching, or animation compression;
- game design, narrative design, level/art/audio production, monetization, retention manipulation, gambling mechanics, or economy balancing;
- platform certification, storefront SDKs, achievements, advertising, telemetry, analytics, or personal-data collection;
- cheat creation, anti-cheat bypass, exploitation, reverse engineering, or modifying third-party games;
- live network programming, server authority/security, distributed consensus, or competitive lag compensation;
- performance folklore without profiler evidence;
- claims that one architecture pattern or engine style is universally best.

### Global answer conventions

- Numeric answers accept exact values or values within the family tolerance.
- A vector answer is a structured coordinate tuple with explicit space and unit.
- Angles accept equivalent turns after normalization; degree/radian unit is required when typed.
- Sets of entities/cells/colliders are order-insensitive; paths, update phases, RNG draws, and event sequences are ordered.
- Collision answers distinguish touching, penetrating, and separated when the family requests status.
- State-machine answers use stable semantic state/transition IDs.
- Pseudocode questions use a tiny structured IR; cosmetic variable names are ignored.
- “Cannot determine,” “may collide,” “not visible,” and “nondeterministic under this schedule” are first-class answers when the model warrants them.
- Diagrams are generated from semantic geometry. Pixel measurement is never the oracle unless the prompt explicitly supplies a pixel grid and requests it.

### Difficulty philosophy

Difficulty should increase through:

- weaker scaffolding between coordinate spaces;
- more interacting time steps and update phases;
- choosing the correct vector operation rather than merely computing it;
- hierarchy and noncommuting transform order;
- path-dependent input/state/event timing;
- collision motion rather than static overlap;
- several candidate contacts or navigation routes;
- source-like intent hidden behind an equivalent implementation;
- deterministic ordering, mutation barriers, and random-stream consumption;
- tradeoffs supported by profiler/timeline evidence;
- synthesis across at most three mastered mechanisms.

It must not increase through engine trivia, huge coordinate values, excessive arithmetic, tiny diagrams, surprise conventions, frame-perfect reaction demands, obscure genre knowledge, or asking for subjective “game feel” as an exact answer.

### Shared generation and rejection rules

Generate semantic state and expected transitions first, then render diagrams, timelines, code-like snippets, and choices. Reject an instance when:

- a space, axis, unit, timestep, integration rule, collision convention, or update order is missing;
- normalizing a zero vector is required unintentionally;
- rounding affects later truth without being specified;
- more than one collision/contact/path/state answer is valid but the family expects one;
- a pathfinding tie lacks declared resolution;
- a loop/timeline exceeds a small proven bound;
- an event occurs exactly on an undefined boundary;
- an entity is referenced after committed despawn;
- a random result depends on a hidden draw or unspecified iteration order;
- a distractor is behaviorally equivalent under the active model;
- a performance conclusion is not supported by the supplied measurements;
- a code-like snippet has unspecified evaluation/order behavior;
- a diagram visually implies a fact absent from semantic geometry;
- the scenario drifts into excluded or unsafe content;
- the structural signature duplicates another active question.

## 2. Category: Game loop, time, and update scheduling

### Category purpose

Build a frame-rate-independent mental model of simulation time, input sampling, timers, and phase order.

### Learn

Rendering frames and simulation ticks are not the same thing. Motion uses seconds, not “units per frame.” A fixed-step accumulator may run zero, one, or several ticks in a rendered frame; interpolation uses the remainder to draw between the two most recent simulation states.

### Prerequisites

Arithmetic, units, and simple loops.

### Category boundaries

This category schedules simulation. Motion equations are expanded in Category 4; event/lifecycle semantics appear in Categories 7 and 8.

### Subcategories

1. Frame time and delta time
2. Fixed-step simulation and interpolation
3. Timers, pause, and time scale
4. Phase order, catch-up, and pacing

### Common misconceptions

- `60 FPS` means `60 ms` per frame.
- Adding velocity once per frame is frame-rate independent.
- A fixed-step loop always runs exactly once per render.
- Interpolation advances simulation state.
- Pausing scaled time should stop UI/unscaled timers automatically.
- CPU and GPU frame times should always be added.

### Family `time_frame_rate_duration`

**Task.** Convert between frame rate, frame duration, and a frame count over time. **Response/template.** Numeric field with unit.

**Derivation.** `durationMs=1000/F`; `frames=F*time` only for the stated steady rate. **Difficulty.** L1 50/60/100 FPS; L2 other rates; L3 compare targets/budgets.

**Misconceptions/constraints.** Distinguish target from measured average. **Feedback.** Show reciprocal with units.

**Examples.** 1. 50 FPS → 20 ms/frame. L1. 2. 120 FPS → 8.333 ms/frame. L2. 3. 90 frames at 30 FPS → 3 s. L2.

**Validation/coverage.** Exact rational reciprocal and tolerance.

### Family `time_delta_motion`

**Task.** Apply constant velocity over a frame delta. **Response/template.** Position vector.

**Derivation.** `pNext=p+v*dt`. **Difficulty.** L1 scalar/axis; L2 2D; L3 compare different frame partitions.

**Misconceptions/constraints.** Velocity is per second, not per frame. **Feedback.** Multiply by seconds before adding.

**Examples.** 1. `x=2`, `v=3 units/s`, `dt=.5` → `3.5`. L1. 2. `(1,2)+(4,-2)*.25=(2,1.5)`. L2. 3. two `.1` steps equal one `.2` step at constant velocity. L2.

**Validation/coverage.** Vector arithmetic and partition invariant.

### Family `time_fixed_step_accumulator`

**Task.** Determine tick count and remaining accumulator for one or more render frames. **Response/template.** Ordered per-frame fields.

**Derivation.** Execute the normative accumulator loop and cap policy. **Difficulty.** L1 one frame; L2 carry remainder; L3 cap/catch-up.

**Misconceptions/constraints.** Use `>=`, not `>`; clamp before accumulation. **Feedback.** Show accumulator before/after each tick.

**Examples.** 1. step `.02`, delta `.05` → 2 ticks, `.01` remainder. L1. 2. next delta `.015` → 1 tick, `.005` remainder. L2. 3. 8 available ticks with max 4 → run 4 and retain stated remainder. L3.

**Validation/coverage.** Exact rational simulation; boundary cases at equal step.

### Family `time_render_interpolation`

**Task.** Compute interpolation alpha and rendered position. **Response/template.** Alpha plus vector.

**Derivation.** `alpha=accumulator/step`; `lerp(previous,current,alpha)`. **Difficulty.** L1 scalar; L2 vector; L3 recognize interpolation does not mutate state.

**Misconceptions/constraints.** Do not extrapolate beyond current state; `0<=alpha<1`. **Feedback.** Mark previous/current/render points.

**Examples.** 1. acc `.005`, step `.02` → alpha `.25`. L1. 2. previous 10, current 14 → render 11. L1. 3. next simulation starts from current 14, not rendered 11. L2.

**Validation/coverage.** Alpha range and pure-render invariant.

### Family `time_timer_cooldown`

**Task.** Trace countdown, elapsed, periodic, or cooldown timers across ticks. **Response/template.** Remaining time and event sequence.

**Derivation.** Apply displayed timer update and boundary rule; periodic timers may fire repeatedly for a large delta if declared. **Difficulty.** L1 countdown; L2 overshoot; L3 periodic multi-fire.

**Misconceptions/constraints.** Boundary `<=0` versus `<0` is pinned. **Feedback.** Show crossings rather than only final value.

**Examples.** 1. `.5 s` timer minus `.2` → `.3`. L1. 2. remaining `.1`, dt `.15` → fires once with `.05` overshoot policy. L2. 3. period `.1`, dt `.26` → two events and `.06` phase under carry policy. L3.

**Validation/coverage.** Timeline event oracle, no floating drift in generated rationals.

### Family `time_scale_pause`

**Task.** Determine scaled and unscaled time effects under pause or slow motion. **Response/template.** Per-system elapsed fields.

**Derivation.** `scaledDelta=unscaledDelta*timeScale`; each timer/system declares its clock. **Difficulty.** L1 pause; L2 slow motion; L3 mixed UI/gameplay.

**Misconceptions/constraints.** Paused simulation and rendering/input collection remain distinct. **Feedback.** Route delta through each clock.

**Examples.** 1. scale 0 → gameplay timer unchanged. L1. 2. scale .5, real `.2` → scaled `.1`. L1. 3. UI unscaled timer advances `.2` while gameplay paused. L2.

**Validation/coverage.** Clock-domain metadata.

### Family `time_update_order`

**Task.** Trace a small state through declared update phases/systems. **Response/template.** Ordered state table.

**Derivation.** Execute systems in given order using immediate data writes and deferred structural commands. **Difficulty.** L1 two phases; L2 dependency; L3 deferred commit.

**Misconceptions/constraints.** No hidden engine callbacks. **Feedback.** Show reads/writes at each phase.

**Examples.** 1. input sets intent before movement reads it → movement occurs. L1. 2. movement before camera follow means camera reads new position under given order. L2. 3. spawned entity becomes query-visible only after barrier. L3.

**Validation/coverage.** Phase interpreter and access log.

### Family `time_input_sampling`

**Task.** Determine which simulation ticks observe a sampled input edge. **Response/template.** Tick-to-action-state mapping.

**Derivation.** Use frame event collection, sample policy, zero/multiple ticks, and edge-clear phase. **Difficulty.** L2 one tick; L3 multiple ticks; L4 buffered edge.

**Misconceptions/constraints.** Policy states whether pressed is consumed once or visible to every tick. Default pressed is a queued one-shot consumed by first eligible tick. **Feedback.** Draw render/tick timeline.

**Examples.** 1. press before one tick → that tick sees pressed. L2. 2. three ticks in frame → held all three, pressed first only. L3. 3. zero-tick frame retains queued press for next tick. L3.

**Validation/coverage.** Event queue and tick schedule oracle.

### Family `time_catchup_limit`

**Task.** Analyze a long frame, clamp, step cap, and behind-time remainder. **Response/template.** Clamped delta, steps, remainder, behind flag.

**Derivation.** Execute the exact loop and cap policy. **Difficulty.** L2 clamp only; L3 cap; L4 compare retain/discard policies.

**Misconceptions/constraints.** Clamp and step cap are separate. **Feedback.** Show where time is limited.

**Examples.** 1. real `.5`, max delta `.25` → accumulate `.25`. L2. 2. step `.02`, max 5 → at most `.1` simulated this frame. L3. 3. remainder retained means later catch-up, not time loss. L3.

**Validation/coverage.** Reference loop with exact rationals.

### Family `time_frame_pacing`

**Task.** Read a frame-time sequence and distinguish average FPS, spikes, and pacing. **Response/template.** Numeric/choice plus timeline selection.

**Derivation.** Convert individual durations; compute arithmetic mean duration and `1000/meanDuration` for measured sequence. **Difficulty.** L1 constant; L2 alternating; L3 equal average/different variance.

**Misconceptions/constraints.** Average of per-frame FPS is not substituted for reciprocal mean duration. **Feedback.** Plot durations against target budget.

**Examples.** 1. all 16 ms → steady 62.5 FPS. L1. 2. alternating 8/24 ms has 16 ms mean but uneven pacing. L2. 3. two sequences share mean yet one has a 40 ms hitch. L3.

**Validation/coverage.** Exact statistics and spike thresholds supplied.

### Family `time_loop_audit`

**Task.** Diagnose a frame dependence, accumulator, timer, pause, or phase-order bug. **Response/template.** Fault selection and repair.

**Derivation.** Compare snippet/timeline with normative loop. **Difficulty.** L1 missing dt; L2 `>` boundary/interpolation mutation; L3 input edge/catch-up.

**Misconceptions/constraints.** One primary bug; no language-specific undefined behavior. **Feedback.** Give two frame schedules that expose it.

**Examples.** 1. `position += velocity` each frame → frame-rate dependent. L1. 2. `while(acc>step)` misses exact-boundary tick. L2. 3. clearing press before a zero-tick frame loses input. L3.

**Validation/coverage.** Counter-schedule generated for every rejected implementation.

### Cross-family progression

Frame duration and delta motion precede accumulation. Interpolation comes only after tick/remainder fluency. Timers and input sampling build toward catch-up, pacing, and loop audits.

## 3. Category: Coordinate spaces, vectors, and transforms

### Category purpose

Build automatic geometric reasoning across the spaces and transformations used by gameplay, cameras, and rendering.

### Learn

A point, direction, and normal transform differently. Always name the space before doing arithmetic. Dot products answer “how aligned?”, projections split motion, and transform order matters because translation, rotation, and scale generally do not commute.

### Prerequisites

Cartesian coordinates, Pythagorean distance, and basic trigonometry introduced as needed.

### Category boundaries

This category supplies geometric tools. Collision applies them in Category 5; camera projection uses them in Category 6.

### Subcategories

1. Displacements and directions
2. Dot, projection, reflection, and angles
3. Local/world transformations and hierarchy
4. Quaternion orientation and audits

### Common misconceptions

- Position and direction are interchangeable.
- Comparing distance always requires a square root.
- Dot product returns an angle.
- Projection onto a nonunit vector can use the unit-vector formula unchanged.
- Transform order is cosmetic.
- `q` and `-q` are different orientations.

### Family `vector_displacement`

**Task.** Compute displacement, target position, or relative position. **Response/template.** Vector.

**Derivation.** `displacement=target-origin`; invert as requested. **Difficulty.** L1 axis; L2 2D; L3 distinguish point/vector spaces.

**Misconceptions/constraints.** Subtraction order is targeted. **Feedback.** Draw tail at origin and head at target.

**Examples.** 1. from `(2,1)` to `(7,4)` → `(5,3)`. L1. 2. origin plus `(-2,5)` → target `(-1,8)` when origin `(1,3)`. L2. 3. camera-relative displacement remains a vector, not a world point. L3.

**Validation/coverage.** Vector inverse identities.

### Family `vector_distance_squared`

**Task.** Compute/compare squared distances without square roots. **Response/template.** Number or nearest entity.

**Derivation.** `dx²+dy²`; compare against squared radius. **Difficulty.** L1 integer offsets; L2 several targets; L3 range test.

**Misconceptions/constraints.** Squared distance is not ordinary distance but preserves nonnegative ordering. **Feedback.** Show squared terms.

**Examples.** 1. `(3,4)` displacement → squared distance 25. L1. 2. compare targets with squared distances 10 and 13 → first nearer. L1. 3. within radius 5 iff squared distance `<=25`. L2.

**Validation/coverage.** Cross-check with exact Euclidean distance ordering.

### Family `vector_normalize_direction`

**Task.** Normalize a nonzero displacement or recover magnitude/direction. **Response/template.** Unit vector and/or length.

**Derivation.** Divide each component by Euclidean length. **Difficulty.** L1 3-4-5; L2 rational radicals; L3 scale-invariance.

**Misconceptions/constraints.** Reject zero vector; normalization removes magnitude. **Feedback.** Verify length 1.

**Examples.** 1. `(3,4)` → `(0.6,0.8)`. L1. 2. `(-5,0)` → `(-1,0)`. L1. 3. `(6,8)` has same direction as `(3,4)`. L2.

**Validation/coverage.** Unit-length and positive-collinearity checks.

### Family `vector_dot_facing`

**Task.** Use a dot product to classify front/behind, alignment, or field-of-view inclusion. **Response/template.** Number plus relation.

**Derivation.** Dot normalized directions; compare with zero or supplied cosine threshold. **Difficulty.** L1 sign; L2 threshold; L3 nonunit inputs requiring normalization.

**Misconceptions/constraints.** Dot is scalar; threshold corresponds to half-angle. **Feedback.** Show alignment geometry.

**Examples.** 1. right `(1,0)` dot up `(0,1)` → 0, perpendicular. L1. 2. forward dot target direction <0 → behind. L1. 3. dot `.8` and threshold `.707` → inside 90° full FOV. L2.

**Validation/coverage.** Dot/angle cross-check including boundaries.

### Family `vector_projection`

**Task.** Split a vector into components parallel/perpendicular to a unit axis. **Response/template.** Two vectors.

**Derivation.** `parallel=dot(v,n)n`; `perpendicular=v-parallel`. **Difficulty.** L1 axis-aligned; L2 diagonal unit; L3 velocity along slope.

**Misconceptions/constraints.** Axis is unit or full denominator formula is displayed. **Feedback.** Verify sum and orthogonality.

**Examples.** 1. `(3,4)` onto x-axis → `(3,0)` and `(0,4)`. L1. 2. onto unit `(√.5,√.5)` → computed diagonal component. L2. 3. remove normal component to slide along wall. L3.

**Validation/coverage.** Reconstruction and zero dot residual.

### Family `vector_reflection`

**Task.** Reflect a direction/velocity about a supplied unit normal. **Response/template.** Vector.

**Derivation.** `v-2 dot(v,n)n`. **Difficulty.** L1 axis wall; L2 diagonal; L3 distinguish geometric reflection from restitution response.

**Misconceptions/constraints.** Normal orientation does not change perfect reflection result. **Feedback.** Show normal component sign reversal.

**Examples.** 1. `(3,-2)` against up normal `(0,1)` → `(3,2)`. L1. 2. head-on `(0,-5)` → `(0,5)`. L1. 3. diagonal normal uses projection twice. L2.

**Validation/coverage.** Length preserved and normal component negated.

### Family `angle_shortest_difference`

**Task.** Normalize an angle or find shortest signed turn from current to target. **Response/template.** Angle with unit/direction.

**Derivation.** Normalize target-current to `[-π,π)`. **Difficulty.** L1 no wrap; L2 across zero; L3 exact half-turn convention.

**Misconceptions/constraints.** Degrees/radians never mixed silently. **Feedback.** Draw unit circle and chosen arc.

**Examples.** 1. 20°→50° → +30°. L1. 2. 350°→10° → +20°. L2. 3. 0°→180° → -180° under profile. L3.

**Validation/coverage.** Periodicity and range properties.

### Family `transform_rotate_2d`

**Task.** Rotate a point/direction about origin or pivot. **Response/template.** Vector/point.

**Derivation.** Use rotation matrix; for pivot translate, rotate, translate back. **Difficulty.** L1 quarter turns; L2 supplied sin/cos; L3 pivot.

**Misconceptions/constraints.** Positive is CCW in world space. **Feedback.** Show three pivot steps.

**Examples.** 1. `(1,0)` +90° → `(0,1)`. L1. 2. `(2,1)` 180° → `(-2,-1)`. L1. 3. rotate `(3,1)` 90° about `(1,1)` → `(1,3)`. L2.

**Validation/coverage.** Matrix and complex-number cross-check.

### Family `transform_local_world`

**Task.** Convert a point or direction between local and world space. **Response/template.** Coordinate plus named space.

**Derivation.** Apply transform or inverse; translation affects points only. **Difficulty.** L1 translation; L2 rotation; L3 scale+inverse/direction.

**Misconceptions/constraints.** Inverse exists; zero scale rejected. **Feedback.** State each applied component.

**Examples.** 1. local point `(2,0)`, object at `(5,1)` no rotation → world `(7,1)`. L1. 2. local forward rotated 90° → world up. L2. 3. world direction inverse-transform omits translation. L3.

**Validation/coverage.** Forward/inverse round-trip.

### Family `transform_parent_child`

**Task.** Compute child world transform or local transform from hierarchy. **Response/template.** Position/rotation/scale fields.

**Derivation.** `childWorld=parentWorld*childLocal`; inverse for local recovery. **Difficulty.** L1 translations; L2 rotation+offset; L3 two ancestors/nonuniform scale without normal transforms.

**Misconceptions/constraints.** Child local position is not added unrotated after parent rotation. **Feedback.** Traverse hierarchy root to leaf.

**Examples.** 1. parent `(10,0)`, child local `(2,0)` → `(12,0)`. L1. 2. parent 90°, child local `(2,0)` → world offset `(0,2)`. L2. 3. grandchild composes both ancestors. L3.

**Validation/coverage.** Matrix composition and randomized round-trip.

### Family `transform_order`

**Task.** Compare or choose the result of translation/rotation/scale orders. **Response/template.** Ordered operations or resulting point.

**Derivation.** Apply rightmost operation first under column-vector convention. **Difficulty.** L1 translate/rotate; L2 scale/rotate; L3 hierarchical composition.

**Misconceptions/constraints.** Do not accept commutation except proven special cases. **Feedback.** Show intermediate point after each operation.

**Examples.** 1. rotate `(1,0)` 90°, then translate `(2,0)` → `(2,1)`. L1. 2. translate then rotate → `(0,3)`. L2. 3. uniform scale commutes with rotation about origin but not translation. L3.

**Validation/coverage.** Direct sequential and matrix evaluation.

### Family `transform_quaternion_orientation`

**Task.** Recognize equivalent quaternion orientations, compose a simple axis rotation, or select shortest interpolation behavior. **Response/template.** Choice/quaternion with normalization.

**Derivation.** Use unit-quaternion metadata; `q` and `-q` equivalent; composition order pinned. **Difficulty.** L2 sign equivalence; L3 axis quarter-turn; L4 shortest-arc slerp concept.

**Misconceptions/constraints.** No Euler-component interpolation; values chosen from exact simple rotations. **Feedback.** Show orientation effect on basis vector.

**Examples.** 1. `(1,0,0,0)` and `(-1,0,0,0)` → same orientation. L2. 2. unit quaternion norm must be 1. L2. 3. negative dot endpoints → flip one before shortest slerp. L4.

**Validation/coverage.** Rotation-matrix equivalence and unit norm.

### Family `transform_space_audit`

**Task.** Diagnose a vector/space/transform-order bug. **Response/template.** Fault selection and corrected expression.

**Derivation.** Compare typed-space expression and transform oracle. **Difficulty.** L1 subtraction/normalization; L2 point versus direction; L3 hierarchy/quaternion.

**Misconceptions/constraints.** One primary error; spaces are semantic types. **Feedback.** Annotate every operand with space.

**Examples.** 1. direction computed `origin-target` when aiming at target → reversed. L1. 2. translation applied to normal/direction → wrong. L2. 3. local*parent order under profile → wrong hierarchy composition. L3.

**Validation/coverage.** Typed transform AST and counterexample geometry.

### Cross-family progression

Displacement, squared distance, and normalization precede dot/projection/reflection. Angle and rotation come before local/world hierarchy. Quaternion work is a small advanced bridge, not the default representation.

## 4. Category: Motion, integration, and steering

### Category purpose

Train predictable discrete motion and common gameplay steering behaviors under explicit numerical rules.

### Learn

Velocity changes position; acceleration changes velocity. With semi-implicit Euler, update velocity first and position with the new velocity. Steering selects a desired change but must respect speed, acceleration, and turn limits.

### Prerequisites

Delta time, vectors, normalization, projection, and shortest angle.

### Category boundaries

These are kinematic/control models, not full physical simulation. Contact response begins in Category 5.

### Subcategories

1. Velocity and acceleration
2. Limits, damping, and gravity
3. Steering and interception
4. Turning and audits

### Common misconceptions

- Acceleration is added directly to position.
- Explicit and semi-implicit Euler give the same position each step.
- Clamping each component clamps vector speed.
- Per-frame damping is frame-rate independent.
- Seek and arrive are identical.
- Pursuit should always aim at the target's current position.

### Family `motion_velocity_integrate`

**Task.** Trace constant-velocity motion over one or several fixed ticks. **Response/template.** Position sequence.

**Derivation.** Repeated `p+=v*dt`. **Difficulty.** L1 one axis; L2 vector/multiple ticks; L3 recover velocity or dt.

**Misconceptions/constraints.** Units explicit; no collision. **Feedback.** Show displacement per tick.

**Examples.** 1. p0=0, v=4, dt=.25 → p1=1. L1. 2. `(1,2)+(-2,4)*.5=(0,4)`. L2. 3. move 6 units in 3 ticks of .5 → speed 4. L2.

**Validation/coverage.** Closed form `p_n=p0+n v dt`.

### Family `motion_acceleration_integrate`

**Task.** Trace velocity and position under default semi-implicit Euler. **Response/template.** Per-tick state table.

**Derivation.** `vNext=v+a dt`, then `pNext=p+vNext dt`. **Difficulty.** L1 one tick; L2 several; L3 contrast explicit Euler.

**Misconceptions/constraints.** Update order shown in feedback. **Feedback.** Separate velocity and position rows.

**Examples.** 1. p=0,v=0,a=2,dt=.5 → v=1,p=.5. L1. 2. second tick → v=2,p=1.5. L2. 3. explicit Euler first position would remain 0, showing difference. L2.

**Validation/coverage.** Reference recurrence and closed-form small-n check.

### Family `motion_speed_clamp`

**Task.** Cap a velocity magnitude while preserving direction. **Response/template.** Vector.

**Derivation.** If `|v|>max`, return `normalize(v)*max`; otherwise unchanged. **Difficulty.** L1 axis; L2 3-4-5; L3 compare component clamp.

**Misconceptions/constraints.** Max nonnegative; zero safe. **Feedback.** Compute magnitude before scaling.

**Examples.** 1. `(6,8)`, max5 → `(3,4)`. L1. 2. `(2,1)`, max3 → unchanged. L1. 3. component-clamp `(6,8)` to `(5,5)` has wrong magnitude/direction. L2.

**Validation/coverage.** Output magnitude/direction properties.

### Family `motion_damping_decay`

**Task.** Apply or solve frame-rate-independent exponential damping. **Response/template.** Value/vector or retention.

**Derivation.** `vNext=v*r^dt`; compose exponents across partitions. **Difficulty.** L1 one second; L2 fractional friendly powers; L3 partition comparison.

**Misconceptions/constraints.** `r` is per-second retention, not amount removed per frame. **Feedback.** Show exponent/partition identity.

**Examples.** 1. v=10,r=.5,dt=1 →5. L1. 2. two half-seconds multiply by `sqrt(.5)` twice →5. L2. 3. pause with scaled dt0 → unchanged. L2.

**Validation/coverage.** Semigroup property within tolerance.

### Family `motion_gravity_jump`

**Task.** Trace a simplified jump or find an initial vertical velocity under the declared integrator. **Response/template.** State sequence/numeric.

**Derivation.** Apply constant downward acceleration and ground rule. **Difficulty.** L1 one/two ticks; L2 apex crossing; L3 discrete initial-velocity inverse.

**Misconceptions/constraints.** Do not mix continuous formula with discrete inverse unless asked. **Feedback.** Show tick velocities and positions.

**Examples.** 1. vy=5,g=-10,dt=.1 → vy=4 then y+=.4. L1. 2. apex occurs when velocity changes sign between ticks. L2. 3. grounded downward velocity reset to 0 under stated rule. L2.

**Validation/coverage.** Bounded simulator and ground nonpenetration.

### Family `steering_seek`

**Task.** Compute desired velocity/acceleration toward a target. **Response/template.** Vector fields.

**Derivation.** `desired=normalize(target-position)*maxSpeed`; steering is `desired-currentVelocity`, optionally capped. **Difficulty.** L1 desired velocity; L2 steering; L3 acceleration cap.

**Misconceptions/constraints.** Target at position uses zero desired direction by declared arrival rule. **Feedback.** Draw displacement, desired, correction.

**Examples.** 1. target right, max3 → desired `(3,0)`. L1. 2. current `(1,0)` → steering `(2,0)`. L2. 3. diagonal steering capped by magnitude. L3.

**Validation/coverage.** Vector oracle and caps.

### Family `steering_arrive`

**Task.** Compute a desired speed that slows inside an arrival radius. **Response/template.** Desired velocity.

**Derivation.** `speed=maxSpeed*clamp(distance/slowRadius,0,1)` then multiply by direction. **Difficulty.** L2 inside/outside radius; L3 stop radius or cap.

**Misconceptions/constraints.** Seek maintains max speed; arrive scales it. **Feedback.** Plot speed-versus-distance.

**Examples.** 1. d10, radius5,max4 → speed4. L1. 2. d2.5 → speed2. L2. 3. d0 → desired zero. L1.

**Validation/coverage.** Monotonic speed and boundary continuity.

### Family `steering_pursuit_intercept`

**Task.** Find a simple interception time/aim point or determine no positive intercept. **Response/template.** Time and point.

**Derivation.** Solve `|targetPos+targetVel*t-agentPos|=agentSpeed*t` for smallest nonnegative root in controlled 1D/2D cases. **Difficulty.** L2 1D; L3 perpendicular/simple quadratic; L4 impossible.

**Misconceptions/constraints.** Constant velocities and no obstacles; reject unstable roots. **Feedback.** Compare travel distances at t.

**Examples.** 1. target 10 ahead moving away2, pursuer speed4 → t5, point20. L2. 2. stationary target reduces to distance/speed. L1. 3. target recedes at equal/faster speed in same direction → no intercept. L3.

**Validation/coverage.** Substitute root and check minimal/nonnegative.

### Family `steering_turn_toward`

**Task.** Rotate toward a desired direction with a maximum angular speed. **Response/template.** Next angle.

**Derivation.** shortest difference; clamp to `maxAngularSpeed*dt`; add and normalize. **Difficulty.** L1 no wrap; L2 wrap; L3 exact overshoot prevention.

**Misconceptions/constraints.** Do not rotate past target. **Feedback.** Show shortest arc and cap.

**Examples.** 1. 0°→90°, max60°/s, dt1 →60°. L1. 2. 350°→10°, cap15° →5°. L2. 3. remaining 5°, cap15° → target10°, not20°. L2.

**Validation/coverage.** Angular distance never increases/overshoots.

### Family `motion_steering_audit`

**Task.** Diagnose integration, damping, clamping, seek/arrive, or turn logic. **Response/template.** Fault selection and corrected update.

**Derivation.** Compare snippet with normative equations. **Difficulty.** L1 missing dt/order; L2 component clamp/per-frame damping; L3 steering overshoot/intercept.

**Misconceptions/constraints.** One primary bug. **Feedback.** Give two dt values or a boundary state exposing it.

**Examples.** 1. `position += acceleration*dt` → confuses acceleration and velocity. L1. 2. clamp x/y separately → diagonal exceeds max speed. L2. 3. add fixed 10% drag each tick → tick-rate dependent. L2.

**Validation/coverage.** Counterexample simulations.

### Cross-family progression

Velocity comes before acceleration and integration-order contrast. Limits/damping precede jump and steering. Seek precedes arrive, then pursuit and constrained turning.

## 5. Category: Collision detection and response

### Category purpose

Train exact spatial queries and simple kinematic contact handling without importing the complexity of a production physics engine.

### Learn

Broad phase finds possible pairs; narrow phase proves contact. Touching and penetrating are different states. Collision detection answers whether/when shapes meet; response uses a normal, penetration or time of impact, and an explicitly stated velocity rule.

### Prerequisites

Vectors, squared distance, projection, relative motion, and intervals.

### Category boundaries

This category covers controlled 2D shapes and static-surface response. General dynamics, angular impulse, stacking, and solver stability are excluded.

### Subcategories

1. Static overlap
2. Rays, segments, layers, and spatial indexing
3. Swept collision and response
4. Triggers and audits

### Common misconceptions

- Touching boxes are always penetrating.
- Circle overlap compares distance to `r1²+r2²`.
- A ray is an infinite line in both directions.
- Broad-phase candidates are confirmed collisions.
- Moving one axis at a time is general continuous collision detection.
- Trigger volumes should apply solid response.

### Family `collision_point_shape`

**Task.** Test a point against a circle or AABB and classify boundary status. **Response/template.** Inside/on boundary/outside.

**Derivation.** Circle uses squared distance versus `r²`; AABB uses inclusive component intervals and boundary equality. **Difficulty.** L1 centered shapes; L2 offset; L3 boundary.

**Misconceptions/constraints.** Screen/world spaces must match. **Feedback.** Show decisive distance/interval.

**Examples.** 1. point `(1,1)` in box `[0,2]²` → inside. L1. 2. `(3,0)` on circle radius3 → boundary. L1. 3. `(-1,2)` outside box x-min0. L2.

**Validation/coverage.** Exact predicates including corners/boundaries.

### Family `collision_circle_overlap`

**Task.** Determine whether two circles are separated, touching, or penetrating and compute depth/normal when defined. **Response/template.** Status, depth, unit normal.

**Derivation.** Compare center distance with `rA+rB`; depth=sum-distance; normal from B to A. **Difficulty.** L1 axis; L2 diagonal; L3 coincident centers.

**Misconceptions/constraints.** Coincident-center normal is undefined and supplied/family accepts unknown. **Feedback.** Draw combined radius.

**Examples.** 1. radii2/1, centers 4 apart → separated. L1. 2. centers3 apart → touching. L1. 3. centers2 apart → penetration1. L2.

**Validation/coverage.** Symmetry with normal sign convention and degeneracy handling.

### Family `collision_aabb_overlap`

**Task.** Classify two AABBs and identify overlapping axes. **Response/template.** Status plus x/y overlap depths.

**Derivation.** Per axis `min(maxA,maxB)-max(minA,minB)`; negative separated, zero touching, both positive penetrating. **Difficulty.** L1 one-axis separation; L2 corner/touch; L3 containment.

**Misconceptions/constraints.** Overlap on one axis alone is insufficient. **Feedback.** Show projected intervals.

**Examples.** 1. x intervals disjoint → separated. L1. 2. x depth0, y positive → touching. L1. 3. contained box has positive depths on both axes. L2.

**Validation/coverage.** Interval oracle and A/B symmetry.

### Family `collision_aabb_mtv`

**Task.** Compute a minimum translation vector for penetrating AABBs under a tie rule. **Response/template.** Vector.

**Derivation.** For each axis compute the two signed movements that put one boundary of A on the opposite boundary of B; choose the smaller absolute movement, then choose the smallest axis candidate. Tie chooses x unless stated. **Difficulty.** L2 one clear axis; L3 containment/tie.

**Misconceptions/constraints.** MTV separates, not merely reaches equal centers. **Feedback.** Compare candidate axis translations.

**Examples.** 1. partial x overlap1 versus y separation candidates3, A left of B → MTV `(-1,0)`. L2. 2. smallest y movement `.5`, A above B → `(0,.5)`. L2. 3. A fully contained in B uses nearest enclosing boundary, not A's intersection width. L3.

**Validation/coverage.** Translated boxes touch and no smaller axis translation separates.

### Family `collision_ray_segment`

**Task.** Find first ray/segment hit parameter and point against a controlled line/AABB. **Response/template.** Hit/no hit, `t`, point.

**Derivation.** Use parametric intersection or slab method; ray requires `t>=0`, segment `0<=t<=1`. **Difficulty.** L2 axis-aligned; L3 two slabs; L4 parallel/inside start.

**Misconceptions/constraints.** Direction normalization stated; zero direction rejected. **Feedback.** Show parameter intervals.

**Examples.** 1. ray `(0,0)+t(1,0)` hits vertical x=3 at t3. L1. 2. same segment ending x2 → no hit. L2. 3. AABB slab entry max versus exit min. L3.

**Validation/coverage.** Substitute hit and interval constraints.

### Family `collision_layer_mask`

**Task.** Determine whether two colliders are eligible to interact under layer/mask rules. **Response/template.** Yes/no plus bit test.

**Derivation.** Default bilateral rule: `(maskA & layerBitB)!=0 && (maskB & layerBitA)!=0`. **Difficulty.** L1 named matrix; L2 masks; L3 eligible but geometrically separate distinction.

**Misconceptions/constraints.** Eligibility is not overlap. **Feedback.** Evaluate both directions.

**Examples.** 1. both masks include the other's layer → eligible. L1. 2. one direction excludes → not eligible. L2. 3. eligible distant circles → no collision pair after narrow phase. L2.

**Validation/coverage.** Exhaustive bit/matrix equivalence.

### Family `collision_broad_narrow`

**Task.** Separate broad-phase candidates from narrow-phase confirmed contacts. **Response/template.** Two entity-pair sets.

**Derivation.** Apply supplied conservative bounds/index, then exact shape tests. **Difficulty.** L1 bounding boxes; L2 several pairs; L3 rotated polygon bound false positive.

**Misconceptions/constraints.** Broad phase must not discard true contacts. **Feedback.** Show why each false positive remains candidate only.

**Examples.** 1. overlapping bounds and shapes → candidate+contact. L1. 2. bounds overlap but circles do not → candidate only. L2. 3. disjoint bounds → neither. L1.

**Validation/coverage.** Confirmed set subset of candidate set.

### Family `collision_spatial_hash`

**Task.** Map an AABB/point to grid cells and generate deduplicated candidate pairs. **Response/template.** Cell IDs and pair set.

**Derivation.** Floor coordinates by cell size. Because collision boundaries are closed, default AABBs occupy every cell index from `floor(min/cellSize)` through `floor(max/cellSize)` inclusive; this may add conservative boundary candidates. **Difficulty.** L2 point; L3 multi-cell AABB; L4 duplicate pair removal.

**Misconceptions/constraints.** Negative coordinates use mathematical floor. **Feedback.** Overlay cell grid.

**Examples.** 1. point `(5,2)`, cell4 → cell `(1,0)`. L1. 2. point `(-1,0)` → `(-1,0)`, not `(0,0)`. L2. 3. two objects share two cells but produce one candidate pair. L3.

**Validation/coverage.** Geometric cell intersection and pair-set uniqueness.

### Family `collision_swept_contact`

**Task.** Find time of impact for a moving point/circle/AABB against a static simple shape. **Response/template.** Hit/no hit, normalized time, contact point/normal.

**Derivation.** Expand static shape by moving radius/half-extents and raycast relative displacement over `t∈[0,1]`. **Difficulty.** L3 axis; L4 diagonal/slabs/initial overlap.

**Misconceptions/constraints.** Initial overlap uses separate status, not negative time. **Feedback.** Draw Minkowski-expanded target and sweep.

**Examples.** 1. point moves x0→10 toward wall x6 → toi `.6`. L3. 2. circle radius1 against wall x6 behaves as point against x5 → `.5`. L3. 3. entry after t1 → no collision this step. L3.

**Validation/coverage.** Contact at t and separation immediately before within tolerance.

### Family `collision_normal_response`

**Task.** Apply simple static-surface velocity response with restitution. **Response/template.** Normal/tangent components and final velocity.

**Derivation.** Use normative decomposition when approaching; leave velocity when separating. **Difficulty.** L2 axis normal; L3 diagonal; L4 restitution.

**Misconceptions/constraints.** Normal unit length; no friction. **Feedback.** Show tangent preserved and normal reversed/scaled.

**Examples.** 1. `(3,-4)` on floor n`(0,1)`, e0 → `(3,0)`. L2. 2. e1 → `(3,4)`. L2. 3. `dot(v,n)>0` → already separating, unchanged. L3.

**Validation/coverage.** Post-response normal speed nonnegative and restitution relation.

### Family `collision_trigger_solid`

**Task.** Trace enter/stay/exit events and distinguish trigger from solid response. **Response/template.** Ordered events plus position/velocity effect.

**Derivation.** Compare overlap set across ticks; trigger emits events without correction, solid follows declared response. **Difficulty.** L2 one pair; L3 multiple ticks; L4 layer disable/despawn.

**Misconceptions/constraints.** Event timing/barrier explicit. **Feedback.** Show previous/current overlap sets.

**Examples.** 1. absent→overlap → enter. L1. 2. overlap→overlap → stay. L1. 3. trigger enter does not stop velocity. L2.

**Validation/coverage.** Set-difference event oracle.

### Family `collision_analysis_audit`

**Task.** Diagnose an overlap, ray, broad-phase, sweep, normal, or trigger bug. **Response/template.** Fault selection and repair.

**Derivation.** Compare with exact geometry/event oracle. **Difficulty.** L1 radius/axis error; L2 ray domain/touch; L3 tunneling/normal/event.

**Misconceptions/constraints.** One primary fault. **Feedback.** Provide counter-geometry/timeline.

**Examples.** 1. circles compare to `r1²+r2²` → wrong combined radius. L1. 2. ray accepts negative t → line/ray confusion. L2. 3. fast object tests only final overlap and tunnels → use sweep. L3.

**Validation/coverage.** Boundary and adversarial geometric fixtures.

### Cross-family progression

Point/circle/AABB overlap precede MTV and raycasts. Layers and broad/narrow phase come before spatial hashing. Sweeps precede response; triggers and audits integrate geometry with time.

## 6. Category: Cameras, visibility, and rendering decisions

### Category purpose

Train the coordinate, ordering, and batching decisions a gameplay programmer routinely makes around presentation.

### Learn

The camera transforms world positions to view/screen positions. Visibility tests should be conservative. Opaque depth-tested rendering and alpha-blended ordering obey different rules; atlases and batching change submission, not world behavior.

### Prerequisites

Coordinate spaces, transforms, interpolation, rectangles, and ordering.

### Category boundaries

This category reasons about semantic rendering inputs. Shader code, lighting, rasterization details, and GPU APIs are excluded.

### Subcategories

1. Camera conversion and follow
2. Visibility and parallax
3. Draw order, transparency, and atlases
4. Pixel alignment, batching, and audits

### Common misconceptions

- World coordinates can be used directly as screen pixels.
- Camera movement shifts screen objects in the same direction.
- Culling and collision bounds have identical purposes.
- Transparent sprites can be sorted arbitrarily with depth testing.
- Atlas pixel maxima are inclusive.
- Fewer draw calls always guarantees a faster frame.

### Family `camera_world_screen`

**Task.** Convert between world and screen coordinates in the default orthographic 2D camera. **Response/template.** Coordinate with named space.

**Derivation.** Subtract camera world origin/center as declared, apply zoom, flip y, add viewport origin/center; inverse reverses steps. **Difficulty.** L1 translation; L2 y flip/zoom; L3 inverse.

**Misconceptions/constraints.** Camera anchor convention displayed. **Feedback.** Show world→view→screen stages.

**Examples.** 1. camera at `(10,5)`, object `(12,6)` → view `(2,1)`. L1. 2. zoom2 and screen y-down maps view y1 to -2 screen offset. L2. 3. inverse click ray/point recovers world coordinate. L3.

**Validation/coverage.** Forward/inverse round-trip.

### Family `camera_follow`

**Task.** Compute a camera target or damped/clamped follow update. **Response/template.** Camera position.

**Derivation.** Apply supplied dead zone, lerp/exponential smoothing, and world bounds in declared order. **Difficulty.** L1 direct follow; L2 dead zone; L3 smoothing+clamp.

**Misconceptions/constraints.** `lerp(current,target,k*dt)` is used only if model explicitly declares it; default exponential smoothing gives retention. **Feedback.** Show target, unconstrained update, clamp.

**Examples.** 1. direct centered follow → camera=player. L1. 2. player inside dead zone → no move. L2. 3. smoothed result beyond map bound → clamp after smoothing. L3.

**Validation/coverage.** Ordered camera pipeline.

### Family `camera_parallax`

**Task.** Compute a layer's screen displacement under a parallax factor. **Response/template.** Offset/position.

**Derivation.** Apply declared `screenOffset=-cameraDisplacement*factor`; factor0 fixed to screen, factor1 world-locked. **Difficulty.** L1 scalar; L2 vector; L3 compare layers.

**Misconceptions/constraints.** Sign convention shown. **Feedback.** Contrast factors 0/1.

**Examples.** 1. camera +10x, factor1 → layer screen -10x. L1. 2. factor.25 → -2.5. L1. 3. foreground factor1.5 moves -15. L2.

**Validation/coverage.** Endpoint and linearity properties.

### Family `render_viewport_cull`

**Task.** Determine which object bounds are definitely outside, possibly visible, or intersect viewport/frustum. **Response/template.** Entity set/status.

**Derivation.** Transform conservative bounds and apply rectangle/frustum interval tests. **Difficulty.** L1 point/box; L2 partial overlap; L3 conservative rotated bound.

**Misconceptions/constraints.** Partial overlap is visible; conservative false positives allowed. **Feedback.** Overlay viewport and bounds.

**Examples.** 1. box entirely outside right edge → culled. L1. 2. box crosses edge → visible candidate. L1. 3. conservative rotated bound intersects though sprite may not → keep. L3.

**Validation/coverage.** Culling never rejects semantic visible geometry.

### Family `render_depth_layer_order`

**Task.** Determine final ordering from layer, order key, depth, and stable tie-break. **Response/template.** Ordered entity sequence.

**Derivation.** Apply displayed lexicographic sort and depth policy. **Difficulty.** L1 2D layer; L2 ties; L3 opaque depth-tested contrast.

**Misconceptions/constraints.** Submission order and visible depth outcome distinguished. **Feedback.** Sort one key at a time.

**Examples.** 1. background layer before actors before UI. L1. 2. equal layer sorts order ascending then entity ID. L2. 3. opaque identical-state objects need not be back-to-front for correctness. L3.

**Validation/coverage.** Comparator total order.

### Family `render_alpha_order`

**Task.** Choose correct order or compute source-over result for transparent layers. **Response/template.** Ordered layers and/or color/alpha.

**Derivation.** Sort declared transparent surfaces back-to-front; apply source-over formula with premultiplication convention stated. **Difficulty.** L2 order; L3 two-color blend; L4 opaque/transparent partition.

**Misconceptions/constraints.** Blending is generally noncommutative. **Feedback.** Show far layer then near layer.

**Examples.** 1. far glass drawn before near smoke. L1. 2. swapping red/blue half-alpha changes result. L3. 3. opaque pass before transparent pass under declared pipeline. L2.

**Validation/coverage.** Exact rational color fixtures and order permutation contrast.

### Family `render_sprite_atlas_uv`

**Task.** Convert an atlas pixel rectangle/frame index to normalized UV bounds. **Response/template.** Rectangle/UV coordinates.

**Derivation.** Compute half-open pixel min/max divided by texture width/height; apply row/column ordering. **Difficulty.** L1 given rect; L2 index grid; L3 padding/inset.

**Misconceptions/constraints.** No half-texel folklore unless sampling rule supplied. **Feedback.** Mark pixel and normalized axes.

**Examples.** 1. rect x0..32 in width128 → u `[0,.25)`. L1. 2. frame5 in 4-column grid → row1,col1. L2. 3. 1px padding changes inner bounds explicitly. L3.

**Validation/coverage.** Pixel/UV round-trip and half-open bounds.

### Family `render_pixel_snap`

**Task.** Apply the declared pixel-snapping stage and predict screen position/jitter. **Response/template.** Snapped coordinate or policy choice.

**Derivation.** Transform to screen then round using declared rule; or snap camera/object at named stage. **Difficulty.** L2 one point; L3 moving camera; L4 compare policies.

**Misconceptions/constraints.** Snapping world coordinates is not equivalent under zoom/rotation. **Feedback.** Show unsnapped and snapped screen coordinates.

**Examples.** 1. final screen x12.4 rounds12. L1. 2. x12.5 uses declared half-away rule →13. L2. 3. snapping camera and object independently can alter relative motion. L3.

**Validation/coverage.** Exact rounding and stage order.

### Family `render_batch_sort`

**Task.** Group draw items into batches under material/texture/state constraints while respecting order barriers. **Response/template.** Ordered batch groups/count.

**Derivation.** Sort only within reorderable regions; consecutive compatible state keys share a batch. **Difficulty.** L2 opaque sprites; L3 transparent barriers; L4 state tradeoff.

**Misconceptions/constraints.** Minimum batch count cannot violate visual order. **Feedback.** Show state changes and barriers.

**Examples.** 1. three consecutive same-texture sprites → one batch. L1. 2. A,B,A opaque reorderable → two or one if allowed sort groups A together. L2. 3. transparent depth order prevents grouping separated A draws. L3.

**Validation/coverage.** Partition preserves required partial order and compatibility.

### Family `render_camera_audit`

**Task.** Diagnose a camera, culling, order, alpha, UV, snapping, or batching bug. **Response/template.** Fault selection and repair.

**Derivation.** Compare pipeline with transform/order oracle. **Difficulty.** L1 sign/space; L2 bounds/order; L3 incompatible optimization.

**Misconceptions/constraints.** One primary fault. **Feedback.** Show the first stage where outputs diverge.

**Examples.** 1. camera +x makes objects move +x on screen → sign error. L1. 2. partial viewport overlap culled → false negative. L2. 3. transparent items reordered solely to batch → visual-order bug. L3.

**Validation/coverage.** Counter-scene for every mutation.

### Cross-family progression

World/screen conversion precedes camera follow and parallax. Culling comes before drawing order. Transparency, atlases, pixel snapping, and batching remain separate until integrated audits.

## 7. Category: Input, animation, and state transitions

### Category purpose

Train timing-correct interpretation of player actions and deterministic transitions between gameplay/animation states.

### Learn

Pressed and released are edges; held is a level. Input buffers and coyote windows deliberately extend timing opportunities. State and animation are related but not identical: gameplay can choose an animation, and animation events can notify gameplay, but each needs a declared authority.

### Prerequisites

Frame/tick timing, timers, vectors, and ordered state updates.

### Category boundaries

This category handles local action/state mechanics. General event architecture belongs in Category 8; network input replay appears in Category 11.

### Subcategories

1. Digital and analog actions
2. Timing affordances
3. State machines and animation clocks
4. Blending, root motion, and audits

### Common misconceptions

- `pressed` remains true while a button is held.
- Dead-zone processing should zero each axis in a radial scheme.
- A buffered action and coyote time are the same window.
- Every true transition should fire in one update.
- Animation frames are advanced once per render regardless of elapsed time.
- Root motion can be applied in addition to gameplay displacement without a policy.

### Family `input_edge_state`

**Task.** Derive pressed/held/released from previous/current button state across frames. **Response/template.** Three booleans per frame.

**Derivation.** Apply normative formulas. **Difficulty.** L1 one transition; L2 sequence; L3 zero-tick/render sampling.

**Misconceptions/constraints.** Device repeat events ignored; action state semantic. **Feedback.** Two-column truth table.

**Examples.** 1. up→down → pressed+held. L1. 2. down→down → held only. L1. 3. down→up → released only. L1.

**Validation/coverage.** Exhaust four state pairs.

### Family `input_action_mapping`

**Task.** Combine several device controls into a semantic action/value under a declared binding rule. **Response/template.** Action states/vector.

**Derivation.** Apply OR/max/sum-then-clamp and conflict policy shown. **Difficulty.** L1 two buttons; L2 2D axis; L3 keyboard+controller priority.

**Misconceptions/constraints.** Binding is data, not hard-coded key identity. **Feedback.** Show each binding contribution.

**Examples.** 1. Space or gamepad A → Jump pressed if either edge occurs. L1. 2. left/right both down → axis0 under cancel policy. L2. 3. analog+digital sums then clamps to [-1,1]. L3.

**Validation/coverage.** Binding evaluator and conflict truth table.

### Family `input_analog_deadzone`

**Task.** Apply axial or radial dead zone and optional remapping. **Response/template.** Output scalar/vector.

**Derivation.** Use declared policy and normative radial formula. **Difficulty.** L1 scalar; L2 radial magnitude; L3 compare axial distortion.

**Misconceptions/constraints.** Direction preserved under radial remap. **Feedback.** Plot raw/output magnitude.

**Examples.** 1. magnitude .1, dead zone .2 → zero. L1. 2. magnitude .6,d=.2 → output magnitude .5. L2. 3. diagonal small axes may survive axial but not radial scheme. L3.

**Validation/coverage.** Boundary, direction, monotonicity.

### Family `input_buffer_window`

**Task.** Determine whether a queued action is consumed within a buffer window. **Response/template.** Timeline and consumed/expired status.

**Derivation.** Store press timestamp; eligible action consumes oldest valid press once. **Difficulty.** L2 one event; L3 overlapping windows/priority.

**Misconceptions/constraints.** Half-open/closed expiration boundary stated. **Feedback.** Mark press, eligibility, expiry.

**Examples.** 1. jump pressed .08s before landing, buffer .1 → consumed on landing. L2. 2. .12s before → expired. L2. 3. one queued press cannot trigger twice. L3.

**Validation/coverage.** Ordered event/timer oracle.

### Family `input_coyote_time`

**Task.** Decide whether a jump remains eligible shortly after leaving ground. **Response/template.** Eligible/no plus timer.

**Derivation.** Track last-grounded time and compare with coyote duration; also require unconsumed jump. **Difficulty.** L2 one edge; L3 combine buffer; L4 landing/reset.

**Misconceptions/constraints.** Coyote extends ground eligibility; buffer stores early input. **Feedback.** Draw both windows separately.

**Examples.** 1. left ground .05s ago, window .1 → eligible. L2. 2. .11s → not. L2. 3. press before landing uses buffer, not coyote. L3.

**Validation/coverage.** Boundary and one-consumption rules.

### Family `state_machine_transition`

**Task.** Determine which transition fires and next state. **Response/template.** Transition/state choice.

**Derivation.** Evaluate enabled outgoing transitions in displayed priority order; first true fires. **Difficulty.** L1 one condition; L2 competing; L3 entry/exit actions.

**Misconceptions/constraints.** At most one transition per update by default. **Feedback.** Evaluate predicates in order.

**Examples.** 1. Idle + speed>0 → Run. L1. 2. Hurt and Jump both true; Hurt higher priority → Hurt. L2. 3. transition executes exit then transition action then entry. L3.

**Validation/coverage.** FSM interpreter and deterministic priority.

### Family `animation_frame_time`

**Task.** Find animation local time/frame after elapsed time, speed, and looping/clamping. **Response/template.** Clip time/frame index.

**Derivation.** Advance `dt*speed`; modulo duration for loop; locate half-open frame interval. **Difficulty.** L1 equal frames; L2 wrap; L3 variable durations/reverse excluded initially.

**Misconceptions/constraints.** Render frames and animation frames differ. **Feedback.** Draw clip timeline.

**Examples.** 1. 4 frames at .1s, t=.25 → frame2. L1. 2. t=.45 loop duration.4 → local .05, frame0. L2. 3. nonlooping clamps to final pose. L2.

**Validation/coverage.** Exact interval/modulo boundaries.

### Family `animation_event_crossing`

**Task.** Determine which animation events fire while time advances, including wrap. **Response/template.** Ordered event list.

**Derivation.** Use declared `(oldTime,newTime]` crossing rule. A wrap splits this into `(oldTime,D)` followed by `[0,newTime]`, so an event at zero fires on wrap; fire each crossed marker once per completed traversal. **Difficulty.** L2 one event; L3 wrap/multiple; L4 large dt several loops.

**Misconceptions/constraints.** Sampling only final frame misses events. **Feedback.** Highlight traversed intervals.

**Examples.** 1. .1→.3 crosses event .2 → fire. L2. 2. .35→.05 wraps and crosses .4/0 marker per rule. L3. 3. large dt may fire ordered repeated events. L4.

**Validation/coverage.** Timeline enumeration.

### Family `animation_blend_parameter`

**Task.** Compute blend weights/pose parameter from speed or direction. **Response/template.** Weights summing to one.

**Derivation.** Apply displayed 1D piecewise-linear blend or simple directional sectors. **Difficulty.** L2 two clips; L3 three samples; L4 wrap direction.

**Misconceptions/constraints.** Weights clamp; no skeletal pose arithmetic required. **Feedback.** Plot parameter among sample points.

**Examples.** 1. speed halfway walk/run → `.5/.5`. L2. 2. below idle sample clamps idle1. L1. 3. directional angle near 360 wraps toward 0 sample. L3.

**Validation/coverage.** Nonnegative weights and sum one.

### Family `animation_root_motion`

**Task.** Reconcile animation root displacement with gameplay/controller movement under a declared policy. **Response/template.** Final displacement and consumed source.

**Derivation.** Policy is animation-authoritative, gameplay-authoritative, or projected/scaled root motion; never add both implicitly. **Difficulty.** L2 one source; L3 projection/collision truncation.

**Misconceptions/constraints.** Root motion is a displacement, not velocity unless divided by dt. **Feedback.** Show source and applied correction.

**Examples.** 1. animation-authoritative root +.8x → controller requests .8x. L2. 2. gameplay-authoritative ignores clip translation. L1. 3. project root displacement onto ground tangent before collision. L3.

**Validation/coverage.** One authoritative displacement and controller trace.

### Family `input_animation_audit`

**Task.** Diagnose input-edge, window, transition, clip-time, event, blend, or root-motion bug. **Response/template.** Fault selection and repair.

**Derivation.** Compare with input/FSM/timeline oracles. **Difficulty.** L1 held/pressed; L2 priority/wrap; L3 double movement/missed event.

**Misconceptions/constraints.** One primary fault. **Feedback.** Give exact frame/tick counterexample.

**Examples.** 1. jump on held every tick → should use press/consumption. L1. 2. event checked only at final frame misses crossing. L2. 3. add gameplay and full root motion → doubles displacement. L3.

**Validation/coverage.** Exhaustive small timelines and mutation suite.

### Cross-family progression

Edges and mappings precede analog processing. Buffer and coyote windows are taught separately before combination. FSM priority comes before clip time/events, then blending and root motion.

## 8. Category: Gameplay architecture, data, and lifecycle

### Category purpose

Train reasoning about data ownership, system order, entity lifetime, events, pooling, and reproducible snapshots.

### Learn

Entities identify things; components store data; systems apply behavior to matching sets. Structural changes are safest at declared barriers. Events communicate facts but do not erase ownership or ordering. Pooling reuses storage only after complete reset.

### Prerequisites

Update phases, state machines, collections, and stable IDs.

### Category boundaries

This category teaches small deterministic architectures, not one prescribed engine design. Language-specific memory management and concurrency are excluded.

### Subcategories

1. Entity/component/system queries
2. Scheduling and structural mutation
3. Pooling and events
4. Resources, snapshots, configuration, and audits

### Common misconceptions

- An entity ID is an array index or object address.
- Every system can run in any order.
- Removing from a collection during iteration is automatically safe.
- A pooled instance retains valid gameplay identity.
- Events eliminate the need for ownership/lifetime rules.
- Saving only visible state is enough for deterministic continuation.

### Family `architecture_component_query`

**Task.** Determine which entities match a system's required/excluded component set. **Response/template.** Entity set.

**Derivation.** Include entities containing every required component and no excluded component at query snapshot. **Difficulty.** L1 one/two requirements; L2 exclusion; L3 after barrier.

**Misconceptions/constraints.** Component values do not affect membership unless predicate shown. **Feedback.** Matrix entities versus component types.

**Examples.** 1. Movement requires Position+Velocity → entities with both. L1. 2. exclude Disabled removes matching entity. L2. 3. queued Add not visible before commit. L3.

**Validation/coverage.** Set predicate oracle.

### Family `architecture_system_order`

**Task.** Choose/trace system order from read/write dependencies and required behavior. **Response/template.** Ordered systems or final state.

**Derivation.** Build dependency edges from declared same-tick requirements; topologically order with stable tie-break. **Difficulty.** L2 simple chain; L3 independent systems; L4 cycle requiring phase split.

**Misconceptions/constraints.** Data conflict alone does not define desired direction without requirement. **Feedback.** Show read/write dependency graph.

**Examples.** 1. Input writes Intent before Movement reads it. L1. 2. Movement before CameraFollow for same-tick follow. L2. 3. cyclic requirements need buffer/previous-state or separate phases. L4.

**Validation/coverage.** Topological/order interpreter.

### Family `architecture_spawn_despawn`

**Task.** Trace queued spawn/add/remove/despawn commands through a commit barrier. **Response/template.** Entity/component sets before/after.

**Derivation.** Apply FIFO commands at barrier with declared conflicts; default despawn makes later same-batch commands no-ops/error status. **Difficulty.** L1 spawn/despawn; L2 mutation during query; L3 conflicting commands.

**Misconceptions/constraints.** No use after committed despawn. **Feedback.** Separate iteration snapshot and committed world.

**Examples.** 1. Spawn during tick appears next post-barrier query. L1. 2. Despawn queued entity still exists until barrier. L2. 3. Add after prior FIFO Despawn is rejected under default. L3.

**Validation/coverage.** Lifecycle command interpreter.

### Family `architecture_object_pool`

**Task.** Trace pool acquire/release and identify fields requiring reset. **Response/template.** Active/free IDs and reset checklist.

**Derivation.** Acquire deterministic lowest free slot; release invalidates entity identity and resets declared fields before reuse. **Difficulty.** L2 occupancy; L3 stale state/event; L4 capacity policy.

**Misconceptions/constraints.** Pool slot ID and live entity ID differ. **Feedback.** Show storage lifecycle.

**Examples.** 1. acquire one of three → active1/free2. L1. 2. released projectile must reset velocity/owner/timer. L2. 3. stale collision event referencing old generation is ignored. L3.

**Validation/coverage.** Generation IDs and reset completeness.

### Family `architecture_event_queue`

**Task.** Trace immediate versus queued event delivery and consumer order. **Response/template.** Ordered deliveries/effects.

**Derivation.** Apply channel policy, FIFO ordering, and phase/barrier. **Difficulty.** L1 one event; L2 event produced during handling; L3 multiple producers.

**Misconceptions/constraints.** Default queued events produced while consuming are appended for the next declared pass, not recursively delivered. **Feedback.** Timeline queue contents.

**Examples.** 1. Hit emitted phase2, consumed phase3. L1. 2. consumer emits Score event queued after current event. L2. 3. stable producer order fixes same-tick sequence. L3.

**Validation/coverage.** Event-loop interpreter.

### Family `architecture_observer_lifetime`

**Task.** Determine valid subscriptions and deliveries as listeners spawn, disable, unsubscribe, or despawn. **Response/template.** Listener set/event sequence.

**Derivation.** Apply registration intervals and deferred removal policy. **Difficulty.** L2 subscribe/unsubscribe; L3 despawn during dispatch; L4 generation IDs.

**Misconceptions/constraints.** Event bus does not keep dead gameplay entity semantically alive. **Feedback.** Show subscription lifetime.

**Examples.** 1. unsubscribed before queued delivery → not called. L2. 2. listener despawns during snapshot dispatch; current/next behavior follows declared policy. L3. 3. reused pool slot with new generation does not receive stale event. L3.

**Validation/coverage.** Stable listener snapshot and identity generations.

### Family `architecture_resource_cooldown`

**Task.** Trace a gameplay resource, regeneration, cost, and cooldown gate. **Response/template.** Value/timer/action eligibility.

**Derivation.** Execute declared order with clamp and time clock. **Difficulty.** L1 spend/clamp; L2 regen+cooldown; L3 phase-order boundary.

**Misconceptions/constraints.** Neutral resources only; no monetization. **Feedback.** State preconditions then updates.

**Examples.** 1. energy7, cost3 →4. L1. 2. action denied while cooldown>0 despite enough energy. L2. 3. regen-before-action versus after changes exact-boundary eligibility. L3.

**Validation/coverage.** Resource invariant `[min,max]` and timeline.

### Family `architecture_save_snapshot`

**Task.** Identify/construct state required to save, restore, or replay deterministic simulation. **Response/template.** Field set plus restored next state.

**Derivation.** Include all future-affecting semantic state: entities/components, clocks, queued commands/events, RNG, content version, input cursor. **Difficulty.** L2 obvious state; L3 hidden timers/RNG; L4 mid-tick save excluded.

**Misconceptions/constraints.** Presentation caches need not be saved if derivable. **Feedback.** Explain how omitted field changes future.

**Examples.** 1. position/velocity needed for continuation. L1. 2. RNG state needed for same future spawns. L2. 3. pending event/cooldown omission diverges next tick. L3.

**Validation/coverage.** Restore-and-continue equality.

### Family `architecture_data_config`

**Task.** Resolve inherited/overridden gameplay configuration and validate references/ranges. **Response/template.** Effective record or error.

**Derivation.** Apply explicit default→archetype→instance precedence; validate schema and semantic IDs. **Difficulty.** L1 defaults; L2 overrides; L3 invalid/cyclic references.

**Misconceptions/constraints.** Data-driven does not mean unvalidated strings. **Feedback.** Show provenance of each field.

**Examples.** 1. default speed5, archetype speed7 →7. L1. 2. instance color override preserves other fields. L2. 3. missing animation semantic ID → validation error. L2.

**Validation/coverage.** Schema and reference graph.

### Family `architecture_lifecycle_audit`

**Task.** Diagnose query, order, mutation, pooling, event, snapshot, or configuration bug. **Response/template.** Fault selection and repair.

**Derivation.** Compare with schedule/lifecycle/state oracle. **Difficulty.** L1 missing component/order; L2 mutation/stale listener; L3 save/RNG/generation.

**Misconceptions/constraints.** One primary fault. **Feedback.** Show first divergent phase/tick.

**Examples.** 1. camera runs before movement but expects current position → ordering bug. L1. 2. remove from iterated set immediately → skipped entity under shown container. L2. 3. pool reset omits owner ID → stale attribution. L3.

**Validation/coverage.** Counter-timeline mutation suite.

### Cross-family progression

Queries precede scheduling and lifecycle commands. Pooling follows identity generations. Events and observer lifetimes precede resource, snapshot, configuration, and integrated audits.

## 9. Category: Navigation and lightweight game AI

### Category purpose

Train exact path, visibility, and decision mechanics used in small game agents.

### Learn

Navigation turns a world into nodes and edges. BFS finds shortest paths when costs are equal; A* orders work by known cost plus heuristic. AI state machines, behavior trees, and utility scores select actions under explicit rules—not human-like understanding.

### Prerequisites

Grids, sets/queues, vectors, state machines, and deterministic tie-breaking.

### Category boundaries

This category applies graph search and decision models. General algorithm analysis belongs in Computer Science; production navmeshes, learned AI, and strategic game design are excluded.

### Subcategories

1. Grid topology and line of sight
2. BFS and A*
3. Path following and smoothing
4. FSM, behavior tree, utility decisions, and audits

### Common misconceptions

- Diagonal movement is always allowed.
- Line of sight and path reachability are the same.
- A* may stop when a goal is first discovered.
- Any heuristic is safe if it “seems close.”
- Removing waypoints is safe without visibility checks.
- Behavior-tree `Running` means failure.

### Family `navigation_grid_neighbors`

**Task.** Enumerate valid neighboring cells and movement costs. **Response/template.** Cell/cost set.

**Derivation.** Apply bounds, blocked cells, 4/8-neighbor rule, diagonal corner policy. **Difficulty.** L1 interior4; L2 edges/obstacles; L3 diagonals.

**Misconceptions/constraints.** Coordinates/order labeled. **Feedback.** Overlay candidate offsets then filter.

**Examples.** 1. interior 4-grid → N/E/S/W. L1. 2. wall removes one. L1. 3. diagonal blocked by corner-cut policy. L3.

**Validation/coverage.** Grid adjacency oracle.

### Family `navigation_line_of_sight`

**Task.** Decide grid/geometric line of sight through obstacles. **Response/template.** Visible/blocked plus first blocker.

**Derivation.** Use supplied supercover/Bresenham or segment-shape rule; cells/edges on boundary policy stated. **Difficulty.** L2 axis; L3 diagonal/corner; L4 multiple blockers.

**Misconceptions/constraints.** Path around obstacle does not restore direct line of sight. **Feedback.** Highlight traversed cells.

**Examples.** 1. clear row → visible. L1. 2. wall cell intersected → blocked. L2. 3. corner touch follows declared supercover policy. L3.

**Validation/coverage.** Independent segment/grid traversal.

### Family `navigation_bfs_layers`

**Task.** Trace BFS frontier, distances, predecessors, or shortest path on unit-cost grid. **Response/template.** Ordered layers/table/path.

**Derivation.** FIFO queue and declared neighbor order; first discovery fixes predecessor. **Difficulty.** L1 small open grid; L2 obstacles; L3 equal routes.

**Misconceptions/constraints.** Neighbor order affects chosen path but not distance. **Feedback.** Animate layers.

**Examples.** 1. adjacent goal distance1. L1. 2. obstacle detour distance computed by layers. L2. 3. equal routes choose row-major neighbor order. L3.

**Validation/coverage.** Reference BFS and path validity/minimality.

### Family `navigation_astar_step`

**Task.** Perform one or more A* expansions and update open/closed records. **Response/template.** Node/table state.

**Derivation.** Pop deterministic minimum key; relax neighbors; update `g,parent,f`. Stop when goal popped. **Difficulty.** L2 one expansion; L3 decrease/update; L4 several ties.

**Misconceptions/constraints.** Goal discovery is not default stop. **Feedback.** Show `g+h`.

**Examples.** 1. start expands valid neighbors. L2. 2. cheaper route updates an open node. L3. 3. goal discovered but another lower-f node remains → continue. L3.

**Validation/coverage.** Reference priority-queue trace.

### Family `navigation_heuristic_choice`

**Task.** Choose or evaluate an admissible/consistent heuristic for the displayed movement model. **Response/template.** Choice plus property.

**Derivation.** Compare heuristic to exact remaining costs and edge inequalities on finite grid. **Difficulty.** L2 Manhattan4; L3 diagonal costs; L4 overestimate counterexample.

**Misconceptions/constraints.** Zero heuristic is valid but less informed. **Feedback.** Give proof inequality/countercell.

**Examples.** 1. Manhattan for 4-neighbor unit → admissible. L2. 2. Manhattan with unit diagonals can overestimate → invalid. L3. 3. zero heuristic reduces to Dijkstra. L2.

**Validation/coverage.** Exhaustive finite-grid admissibility/consistency.

### Family `navigation_path_smoothing`

**Task.** Remove unnecessary waypoints using supplied line-of-sight tests. **Response/template.** Ordered simplified path.

**Derivation.** Greedy farthest-visible waypoint policy with deterministic scan. **Difficulty.** L2 one removal; L3 obstacles; L4 compare unsafe shortcut.

**Misconceptions/constraints.** Simplified path must remain collision-free for agent radius model. **Feedback.** Draw each visibility chord.

**Examples.** 1. three collinear clear points → remove middle. L1. 2. corner obstacle preserves turning waypoint. L2. 3. point-agent line clear but radius-expanded obstacle blocks shortcut. L3.

**Validation/coverage.** Segment/swept-radius checks and endpoint preservation.

### Family `navigation_waypoint_follow`

**Task.** Advance an agent along a waypoint path with speed and arrival threshold. **Response/template.** Position, waypoint index, leftover distance.

**Derivation.** Consume movement budget across segments; snap/advance when within threshold under declared rule. **Difficulty.** L2 one waypoint; L3 cross several; L4 path end.

**Misconceptions/constraints.** Leftover motion is not discarded unless policy says. **Feedback.** Walk budget along polyline.

**Examples.** 1. budget2 toward point5 away → move2. L1. 2. budget5, waypoint2 away then next → 3 remains. L2. 3. final endpoint clamps and reports leftover. L3.

**Validation/coverage.** Arc-length consumption.

### Family `ai_fsm_trace`

**Task.** Trace a simple agent FSM from observations/timers. **Response/template.** State/action sequence.

**Derivation.** Apply prioritized transitions and per-state action once per tick. **Difficulty.** L1 two states; L2 timers; L3 competing/global transition.

**Misconceptions/constraints.** Neutral states such as Idle/Patrol/Investigate/Return; no tactical harm instruction. **Feedback.** Evaluate transitions in order.

**Examples.** 1. Patrol sees target marker → Investigate. L1. 2. timer expires → Return. L2. 3. Disabled global transition outranks local. L3.

**Validation/coverage.** FSM interpreter.

### Family `ai_behavior_tree`

**Task.** Trace sequence/selector execution and `Running` memory. **Response/template.** Visited nodes, statuses, next resume node.

**Derivation.** Apply displayed composite policy and leaf status table. **Difficulty.** L2 one composite; L3 nested; L4 memory versus reactive.

**Misconceptions/constraints.** Running neither succeeds nor fails. **Feedback.** Annotate propagation.

**Examples.** 1. sequence child fails → sequence fails. L1. 2. selector first fails, second succeeds → success. L2. 3. memory sequence resumes running child next tick. L3.

**Validation/coverage.** Tree interpreter and status truth tables.

### Family `ai_utility_audit`

**Task.** Score/select utility actions or diagnose a path/AI decision error. **Response/template.** Score table/action or faulty step.

**Derivation.** Evaluate supplied normalized curves/weights, eligibility, deterministic tie; audit may compare navigation/FSM/BT invariant. **Difficulty.** L2 linear scores; L3 gates/ties; L4 mixed audit.

**Misconceptions/constraints.** Highest raw consideration is not necessarily highest combined action score. **Feedback.** Show every score and gate.

**Examples.** 1. Rest .7 versus Explore .5 → Rest. L2. 2. top action ineligible → next eligible. L2. 3. equal scores use stable action ID; random tie only if declared. L3.

**Validation/coverage.** Exact score evaluator and targeted audit mutations.

### Cross-family progression

Neighbors and visibility precede BFS. BFS establishes optimal-path intuition before A*. Heuristics precede smoothing/following. FSM, behavior tree, and utility models are taught as distinct decision mechanisms.

## 10. Category: Randomness, procedural rules, and determinism

### Category purpose

Train reproducible use of random streams and controlled procedural selection without hidden bias or order dependence.

### Learn

Random does not mean untestable. A seed and exact draw order produce a reproducible stream. Range mapping and weighted choices need defined algorithms; fairness constraints often require state, rejection, or a shuffle bag.

### Prerequisites

Unsigned integers, arrays, percentages, state snapshots, and update order.

### Category boundaries

This category covers mechanics, not cryptography, gambling, monetization, or large procedural-content algorithms.

### Subcategories

1. Seeded streams and mapping
2. Weighted and low-repeat selection
3. Constrained placement and local generation
4. Determinism audits

### Common misconceptions

- Same seed suffices even when draw order changes.
- `random % n` is always unbiased.
- Weighted choices compare percentages independently.
- A shuffle bag is independent random choice.
- Rejection sampling consumes one draw per output.
- Unordered entity iteration is harmless when it consumes random numbers.

### Family `random_seed_stream`

**Task.** Trace RNG state/draws or compare reproducible runs. **Response/template.** Unsigned hex states/sequence.

**Derivation.** Apply `xorshift32-v1` exactly with masks. **Difficulty.** L2 one step scaffolded; L3 several; L4 forked streams.

**Misconceptions/constraints.** Seed nonzero; bit shifts use unsigned semantics. **Feedback.** Show three xor stages.

**Examples.** 1. same nonzero seed and calls → same sequence. L1 conceptual. 2. one extra cosmetic draw shifts gameplay sequence. L2. 3. separate named streams isolate draw-order changes. L3.

**Validation/coverage.** Known-answer vectors and period sanity fixtures.

### Family `random_uniform_range`

**Task.** Map 32-bit draws to an unbiased integer range under supplied rejection algorithm. **Response/template.** Accepted/rejected draws and result.

**Derivation.** Use threshold/limit divisible by range size, reject out-of-limit draws, then modulo. **Difficulty.** L2 small toy bit width; L3 real metadata; L4 variable draws.

**Misconceptions/constraints.** Teaching examples use 8-bit toy RNG for hand arithmetic; runtime uses 32-bit. **Feedback.** Show equal bucket sizes.

**Examples.** 1. toy 0..15 to range0..5 rejects 12..15 then `%6`. L2. 2. draw11 →5 accepted. L2. 3. rejected draw consumes state and next draw decides. L3.

**Validation/coverage.** Enumerate toy domain and bucket counts.

### Family `random_weighted_choice`

**Task.** Map an integer ticket to an item or recover probability from integer weights. **Response/template.** Item/probability interval.

**Derivation.** Sum positive integer weights; ticket in `[0,total)` selects first cumulative bound greater than ticket. **Difficulty.** L1 two weights; L2 several; L3 zero weight/dynamic eligibility.

**Misconceptions/constraints.** Zero-weight never chosen; disabled items removed before draw. **Feedback.** Draw cumulative ticket ranges.

**Examples.** 1. weights1/3, tickets0→A,1..3→B. L1. 2. weights2/5/3 gives 20/50/30%. L2. 3. disabled B rebuilds total/ranges before draw. L3.

**Validation/coverage.** Exhaust ticket set.

### Family `random_shuffle_bag`

**Task.** Trace bag refill, shuffle/order fixture, draws, and repeat guarantees. **Response/template.** Bag/output sequence.

**Derivation.** Draw each bag entry once in supplied shuffled order; refill at empty; boundary anti-repeat rule if declared. **Difficulty.** L2 one cycle; L3 refill; L4 weighted duplicates.

**Misconceptions/constraints.** Within-cycle draws are dependent. **Feedback.** Show remaining bag.

**Examples.** 1. bag A/B/C emits each once before refill. L1. 2. after two draws one known item remains. L2. 3. duplicate entries A/A/B implement weight while limiting drought. L3.

**Validation/coverage.** Multiset preservation per cycle.

### Family `random_spawn_constraints`

**Task.** Select/validate a random spawn under distance, occupancy, visibility, or retry rules. **Response/template.** Candidate sequence and accepted point/failure.

**Derivation.** Test candidates in RNG order up to max attempts; first satisfying all predicates wins. **Difficulty.** L2 one constraint; L3 several; L4 no valid within attempts.

**Misconceptions/constraints.** Rejected attempts consume draws; no guarantee if capped. **Feedback.** Table each predicate.

**Examples.** 1. first occupied rejected, second free accepted. L1. 2. free but too near player rejected. L2. 3. all 4 attempts fail → explicit no-spawn result. L3.

**Validation/coverage.** Geometry predicates and draw-consumption log.

### Family `procedural_tile_rules`

**Task.** Apply a small local rule/constraint to generate or repair a tile grid. **Response/template.** Tile choice/grid cells.

**Derivation.** Use fixed scan order and neighbor compatibility; if backtracking is included, full algorithm shown and grid tiny. **Difficulty.** L2 deterministic rule; L3 weighted compatible choice; L4 contradiction detection.

**Misconceptions/constraints.** No claim that local validity guarantees globally good level design. **Feedback.** Show allowed set before draw.

**Examples.** 1. water may border water/sand only → filter tile set. L2. 2. choose weighted tile among compatible entries. L3. 3. empty allowed set → contradiction/restart status. L3.

**Validation/coverage.** Every adjacency and deterministic scan/draw.

### Family `determinism_replay_audit`

**Task.** Decide whether two runs replay identically or locate the first determinism break. **Response/template.** Yes/no, divergent tick, cause.

**Derivation.** Compare snapshots, timestep/input/RNG/content streams, iteration order, and state hashes. **Difficulty.** L2 changed seed/input; L3 unordered draws; L4 omitted snapshot field.

**Misconceptions/constraints.** Same visible initial frame may hide different future state. **Feedback.** Diff first semantic state field.

**Examples.** 1. same snapshot+inputs+draw order → same run. L1. 2. entity iteration order changes which entity consumes a draw → divergence. L3. 3. save omits RNG state → divergence at next random choice. L2.

**Validation/coverage.** Dual-run state-hash oracle.

### Cross-family progression

Seed streams precede unbiased range mapping. Weighted choice and shuffle bags teach different distributions. Constrained spawning/local rules expose variable draw counts before replay audits.

## 11. Category: Performance, debugging, and networked timelines

### Category purpose

Train measurement-based performance decisions and the basic time reconciliation used by networked game presentation.

### Learn

Optimize the measured bottleneck, not the most visible code. A target FPS gives a frame-time budget. Snapshot interpolation renders the past between known states; client prediction renders immediately, then corrects and replays when authority arrives.

### Prerequisites

Frame timing, update phases, interpolation, snapshots, inputs, and deterministic replay.

### Category boundaries

This category uses supplied measurements/timelines. It does not teach platform profilers, sockets, server security, rollback implementation, or low-level GPU optimization.

### Subcategories

1. Budgets and profiler evidence
2. Allocation and batching tradeoffs
3. Snapshot interpolation
4. Prediction and reconciliation

### Common misconceptions

- FPS differences are linear in FPS rather than frame time.
- CPU and GPU times are always summed.
- The longest function is automatically the best optimization target.
- Pooling always helps.
- Snapshot interpolation predicts the future.
- Reconciliation should apply authoritative state without replaying later local inputs.

### Family `performance_frame_budget`

**Task.** Compare measured frame/stage time with a target budget and compute headroom/overrun. **Response/template.** Milliseconds and pass/fail.

**Derivation.** Budget=`1000/F`; headroom=budget-frameTime. **Difficulty.** L1 common target; L2 percentage headroom; L3 new target.

**Misconceptions/constraints.** Use frame time for comparison. **Feedback.** Place measurement on budget bar.

**Examples.** 1. 60 FPS budget16.667ms; frame15ms →1.667ms headroom. L1. 2. 30 FPS budget33.333ms. L1. 3. frame20ms cannot sustain 60 FPS. L2.

**Validation/coverage.** Exact reciprocal/tolerance.

### Family `performance_profiler_bottleneck`

**Task.** Identify CPU-bound, GPU-bound, synchronized, or inconclusive cases and best evidenced target. **Response/template.** Classification/ranked measurement.

**Derivation.** Use max(CPU,GPU) steady model plus supplied waits/call tree; compare before/after samples. **Difficulty.** L2 clear max; L3 wait/sync; L4 noisy intervals.

**Misconceptions/constraints.** No causal claim from one unrepresentative sample. **Feedback.** Critical-path timeline.

**Examples.** 1. CPU12ms,GPU7ms → CPU-bound under model. L1. 2. CPU5,GPU14 → GPU-bound. L1. 3. CPU reports 10ms waiting on GPU → inspect synchronization; not pure CPU work. L3.

**Validation/coverage.** Timeline critical path and confidence metadata.

### Family `performance_allocation_pooling`

**Task.** Compare allocation rate/pauses with a pool and decide when reuse is warranted under supplied costs. **Response/template.** Counts/time/tradeoff choice.

**Derivation.** Count creates/releases/reuses and sum declared costs; include reset/memory costs. **Difficulty.** L2 counts; L3 peak capacity; L4 pool slower/unused memory case.

**Misconceptions/constraints.** Pooling is not universally better. **Feedback.** Cost and occupancy table.

**Examples.** 1. 100 spawn/despawn per second causes 100 allocations without pool. L1. 2. pool peak20 creates20 then reuses. L2. 3. expensive reset and rare spawn may make pool unsupported by measurements. L3.

**Validation/coverage.** Lifecycle count and cost model.

### Family `performance_batch_tradeoff`

**Task.** Evaluate batching/instancing/culling change from supplied draw, state-change, vertex, and CPU/GPU measurements. **Response/template.** New counts and supported conclusion.

**Derivation.** Apply grouping/order constraints and measured per-cost model; preserve culling granularity caveat. **Difficulty.** L2 draw reduction; L3 transparency/culling; L4 CPU/GPU trade.

**Misconceptions/constraints.** Fewer draws does not prove lower total frame time. **Feedback.** Compare all supplied metrics.

**Examples.** 1. 100 compatible sprites → one batch under model. L1. 2. merged giant batch reduces draws but renders many offscreen items. L3. 3. draw CPU falls while GPU rises; classify by resulting max time. L4.

**Validation/coverage.** Batch constraints and profiler arithmetic.

### Family `network_snapshot_interpolation`

**Task.** Choose bracketing snapshots and compute render state at delayed render time. **Response/template.** Snapshot IDs, alpha, state.

**Derivation.** `renderTime=localTime-delay`; find snapshots t0<=renderTime<=t1; alpha ratio; interpolate supported fields. **Difficulty.** L2 scalar position; L3 irregular snapshot spacing; L4 missing future snapshot.

**Misconceptions/constraints.** This renders behind latest time and does not extrapolate by default. **Feedback.** Timeline with delayed cursor.

**Examples.** 1. snapshots t1 pos10,t2 pos20; render1.5 →15. L2. 2. irregular times use ratio, not frame index. L3. 3. no newer bracket → hold/stall status under default, not predict. L3.

**Validation/coverage.** Timeline interval and interpolation oracle.

### Family `network_prediction_reconcile`

**Task.** Trace local prediction, authoritative correction, acknowledgment, and replay of unacknowledged inputs. **Response/template.** Ordered state table.

**Derivation.** Reset to authoritative state at acked tick; discard acknowledged inputs; replay later inputs using fixed simulator. **Difficulty.** L3 scalar movement; L4 several inputs/correction smoothing distinction.

**Misconceptions/constraints.** Server trust/security and packet transport excluded. Visual smoothing is separate from corrected semantic state. **Feedback.** Show predicted history and replay.

**Examples.** 1. authority agrees → no correction. L2. 2. authority at tick5 differs; replay inputs6–7. L3. 3. applying authority without replay loses recent local actions. L3.

**Validation/coverage.** Replayed state equals clean simulation from authoritative snapshot.

### Cross-family progression

Frame budgets precede bottleneck classification. Allocation and batching questions require measured costs. Snapshot interpolation is taught before prediction/reconciliation so past presentation and future speculation are not conflated.

## 12. Topic-level progression

### Level 1: Units, spaces, and discrete state

- convert FPS/frame duration and apply velocity with delta time;
- read 2D vectors, distances, input edges, clip frames, grid neighbors, and simple overlaps;
- trace one update phase or one state transition;
- use clear, axis-aligned diagrams and friendly values.

### Level 2: Fixed systems

- fixed-step accumulation and interpolation;
- dot products, rotation, local/world transforms, speed clamps, seek/arrive;
- AABB/circle contacts, raycasts, camera conversion, culling, dead zones, events, BFS;
- simple ECS queries, pools, weighted choices, and frame budgets.

### Level 3: Timing and path dependence

- multiple ticks, timers, input windows, animation events, lifecycle barriers;
- transform hierarchy, sweeps, response, spatial hash, transparency order;
- A*, path following, behavior trees, constrained randomness;
- profiler and network snapshot timelines.

### Level 4: Interacting systems

- catch-up policy, motion/collision, root motion/controller reconciliation;
- frame-pointer-like hierarchy complexity stays bounded to three transforms;
- path-sensitive state/events, reusable object generations, deterministic audits;
- prediction/reconciliation and performance tradeoffs supported by evidence.

### Level 5: Game-systems fluency

- diagnose a compact frame/tick simulation across no more than three subsystem boundaries;
- choose the correct abstraction and state what cannot be determined;
- construct a small, deterministic update/decision pipeline;
- preserve units, spaces, ordering, lifecycle, and reproducibility;
- distinguish correctness, feel, and performance evidence.

Mastery is tracked separately for time, geometry/transforms, motion, collision, rendering/camera, input/animation, architecture, navigation/AI, randomness, and performance/network timing.

## 13. Adaptive guidance

| Error | Route to |
|---|---|
| FPS treated as milliseconds | reciprocal unit pair |
| motion omits delta time | same distance under two frame partitions |
| accumulator loses remainder | tick/remainder timeline |
| render interpolation mutates simulation | previous/current/render separation |
| coordinate sign/space wrong | typed world/view/screen stages |
| transform order reversed | same point under two orders |
| component clamp used for speed | magnitude/direction diagram |
| explicit/semi-implicit mixed | paired first tick |
| circle radii squared separately | combined-radius picture |
| broad candidate called collision | two-phase pair classification |
| ray accepts negative t | line/ray/segment contrast |
| camera motion sign wrong | camera/object relative displacement |
| held mistaken for pressed | four-case edge truth table |
| buffer confused with coyote | two-window timeline |
| all FSM transitions fire | priority/one-transition trace |
| entity visible before barrier | query snapshot/commit pair |
| pooled identity reused | slot versus generation diagram |
| A* stops at discovery | goal-discovered versus goal-popped trace |
| RNG seed considered sufficient | extra-draw divergence |
| CPU+GPU always added | overlap critical-path view |
| interpolation confused with prediction | past-bracket versus replay timeline |

Recommended long-session mix: 35% weakest mechanism, 25% spaced mastery, 20% contrast pairs, 15% integrated simulations, 5% audits.

## 14. Answer checking and feedback

### Structured response modes

Prefer:

- numeric/unit fields;
- typed vector/angle/space fields;
- ordered tick/frame/event tables;
- entity/cell/pair sets;
- state/transition/path sequences;
- shape/interval selection on semantic diagrams;
- small expression/update ASTs;
- profiler/timeline classifications with evidence.

Do not grade arbitrary engine code or free-form design prose.

### Numeric and geometric checking

- Compute semantic answers before display rounding.
- Normalize angles/spaces/units before tolerance comparison.
- Validate vector properties in addition to components where useful.
- Collision sets, contacts, normals, depths, and times come from independent geometry routines.
- Diagram coordinates render from the same semantic model but are never reverse-measured for truth.
- Where several paths/MTVs/ties are possible, apply the declared tie-break or accept the full normalized set.

### Simulation and equivalence checking

- The reference simulator executes explicit phases and fixed-step rules.
- State comparisons include RNG state, queues, entity generations, timers, and semantic components.
- Pseudocode/update alternatives are accepted only if they preserve read/write order, clocks, barriers, collision policy, and observable outcomes.
- Exhaustive small-state testing supplements, but does not replace, structural proof from the controlled AST.

### Feedback order

Feedback should:

1. state the correct result with space/unit/tick;
2. show the governing model or update order;
3. expose intermediate vectors, intervals, accumulator, queue, path cost, or timeline;
4. identify the likely misconception;
5. contrast a nearby rule where helpful;
6. avoid claiming that a valid alternative architecture is universally wrong.

## 15. Rendering and accessibility requirements

- Coordinate axes, origin, units, direction, and space are always labeled.
- Geometry uses semantic SVG/canvas plus a textual coordinate/shape table.
- Motion, input, animation, event, and network timelines have keyboard-accessible table alternatives.
- Collision status is not encoded by color alone; use labels/patterns.
- Vectors expose endpoints/components and have a non-drag structured entry.
- Transform hierarchies and state machines have tree/table alternatives.
- CFG/path grids support keyboard cell navigation and announce blocked/cost/open/closed/path state.
- Camera/viewport overlays distinguish world and screen axes.
- Animation may play visually but all graded information is available through time/frame/event text.
- Performance charts list exact values and target lines.
- Reduce-motion preferences disable nonessential animation.
- Scenarios use neutral abstract actors/objects and do not require twitch reactions, color vision, genre lore, or fine motor control.

## 16. Generator and implementation architecture

### Semantic-first instance

```text
GamePracticeInstance {
  seed
  contentVersion
  runtimeProfile
  unitsAndSpaces
  timeConfig
  phaseSchedule
  initialState
  inputTimeline
  rngState
  entitiesAndComponents
  shapesAndLayers
  navigationWorld
  stateMachines
  animationClips
  rendererConfig
  profilerOrNetworkTimeline?
  expectedTrace
  canonicalAnswer
  acceptedAnswers[]
  misconceptionTags[]
}
```

The generator creates semantic state and a bounded action/timeline first. Rendering and question wording derive from it.

### Core local modules

- exact-rational/floating numeric helpers;
- vector, matrix, transform, and simple quaternion library;
- fixed-step scheduler and state tracer;
- kinematic motion/steering library;
- collision/raycast/sweep/spatial-hash oracle;
- camera/viewport/ordering/atlas model;
- input/FSM/animation/event interpreter;
- entity/component/lifecycle/pool simulator;
- BFS/A*/line-of-sight/BT/utility oracle;
- pinned RNG and procedural-rule interpreter;
- profiler and snapshot/prediction timeline evaluator.

The standalone HTML/JS/CSS app works offline. It requires no game engine, compiler, physics package, GPU API, server, asset store, device input, or network connection.

### Code-like questions

Use a tiny pseudocode AST with:

```text
Assign, If, ForEach, WhileBounded, Emit, QueueCommand
VectorExpr, ScalarExpr, ActionQuery, ComponentReadWrite
```

Every loop has a generated bound. Evaluation order, mutation barrier, numeric width where relevant, and collection order are explicit.

### Localization

UI, scenario wording, component/action/state role names, hints, and feedback are localizable. Stable IDs, operators, vector/transform notation, units, and pseudocode semantics remain invariant. Localization must preserve before/after, local/world, pressed/held/released, may/must, and inclusive/exclusive boundary distinctions.

## 17. Automated validation

For every generated instance:

- spaces, axes, units, dt, integration, update order, and boundary rules resolve;
- every state read is initialized;
- fixed-step trace, accumulator, interpolation, and input sampling recompute;
- transform forward/inverse and hierarchy round-trips pass;
- vectors requiring normalization are nonzero;
- motion/state traces agree with equations and declared clock;
- shape geometry is valid and collision pairs/contacts/sweeps recompute independently;
- broad phase contains every true contact;
- camera/viewport/UV/order/batch results preserve declared pipeline;
- action edges, windows, FSM transitions, clip frames/events, blends, and root motion recompute;
- entity queries and queued mutations never use invalid generations;
- event and pool reset semantics pass;
- saved snapshots reproduce continuation;
- BFS/A* paths are valid and optimal under the declared model;
- heuristic/tie-break and AI decisions are deterministic;
- RNG known-answer stream, draw count, mappings, and procedural constraints pass;
- profiler conclusions follow supplied measurements;
- network timeline replay matches a clean authoritative simulation;
- every distractor maps to a named misconception and is not accidentally valid;
- every explanation regenerates from the same semantic trace.

Property/regression tests:

- accumulator boundaries at zero, exact step, clamp, cap, and retained remainder;
- constant-motion partition invariance and exponential-damping partition invariance;
- transform/inverse randomized points and directions;
- angle wrap at `0`, `±π`, and multiple turns;
- collision symmetry, touching/penetration, degeneracy, and sweep immediately-before/contact checks;
- spatial hash negative coordinates and duplicate pair removal;
- input four-state truth table, zero/multiple ticks, buffer/coyote boundaries;
- clip wrap/multiloop event crossings;
- lifecycle command conflicts, event recursion, pool generations, snapshot omissions;
- BFS/A* cross-check against all-pairs shortest paths on small grids;
- RNG known vectors and exhaustive toy range buckets;
- at least `10,000` deterministic seeds per combinatorial family/level;
- mutation tests for every audit family.

## 18. Coverage requirements

The initial specification defines exactly 100 stable families:

| Category | Families |
|---|---:|
| Game loop, time, and update scheduling | 11 |
| Coordinate spaces, vectors, and transforms | 13 |
| Motion, integration, and steering | 10 |
| Collision detection and response | 12 |
| Cameras, visibility, and rendering decisions | 10 |
| Input, animation, and state transitions | 11 |
| Gameplay architecture, data, and lifecycle | 10 |
| Navigation and lightweight game AI | 10 |
| Randomness, procedural rules, and determinism | 7 |
| Performance, debugging, and networked timelines | 6 |
| **Total** | **100** |

Across a long mixed session:

- at least 40% of questions contain an explicit time/tick/phase dimension;
- coordinate space and units are never omitted when relevant;
- fixed and variable render rates appear in deliberate contrast;
- 2D dominates v1, while selected 3D/quaternion questions remain below 10%;
- static overlap, raycast, broad/narrow phase, sweep, response, layer, and trigger reasoning all recur;
- recognition and construction/trace tasks are balanced after Level 2;
- input, animation, lifecycle, and randomness include exact boundary cases;
- graph search includes ties and obstacles without requiring large hand searches;
- `cannot determine`, conservative candidate, and tradeoff answers recur;
- performance questions always include measurements;
- no architecture/engine pattern exceeds 40% of architecture questions;
- every declared misconception is intentionally exercised.

## 19. Recommended views and v1 priorities

Recommended navigation:

1. Time & Game Loop
2. Vectors & Spaces
3. Motion & Steering
4. Collision
5. Camera & Rendering
6. Input & Animation
7. Gameplay Systems
8. Navigation & AI
9. Randomness & Determinism
10. Performance & Network Timing

Recommended v1:

- frame duration, delta motion, fixed-step accumulator, interpolation, timers;
- 2D vectors, angles, local/world transforms, hierarchy;
- semi-implicit motion, speed clamp, seek, arrive, turn-toward;
- point/circle/AABB, layers, raycast, broad/narrow, trigger events;
- orthographic camera conversion, culling, 2D order, atlas frames;
- digital input, mapping, buffer/coyote, FSMs, clip frames/events;
- component queries, deferred spawn/despawn, pooling, queued events;
- grid neighbors, BFS, introductory A*, waypoint following;
- seeded streams, weighted choices, spawn constraints, replay audit;
- frame budget and basic snapshot interpolation.

Defer quaternions, swept collision, spatial hashes, transparency blending arithmetic, root motion, observer generations, behavior trees, procedural contradiction handling, complex profiler tradeoffs, and prediction/reconciliation until their prerequisite families and visualizations are proven.

## 20. Topic-level quality checklist

- [ ] Every question states the runtime/space/time convention it needs.
- [ ] Simulation ticks and render frames remain distinct.
- [ ] Motion uses units per second and an explicit integrator.
- [ ] Interpolation never mutates authoritative simulation state.
- [ ] Points, directions, normals, and spaces remain typed.
- [ ] Transform and quaternion order is pinned.
- [ ] Collision distinguishes candidate, touching, penetration, sweep, response, and trigger.
- [ ] Broad phase has no false negatives under its stated model.
- [ ] Camera/render questions do not depend on an unstated API.
- [ ] Transparent ordering and batching constraints are preserved.
- [ ] Pressed, held, released, buffering, and coyote timing remain distinct.
- [ ] State/animation authority and event boundaries are explicit.
- [ ] Entity structural changes obey declared barriers and generation lifetimes.
- [ ] Pool reuse resets every declared semantic field.
- [ ] Pathfinding neighbors, costs, heuristic, stop rule, and ties are explicit.
- [ ] RNG algorithm, seed, stream, mapping, and draw count are reproducible.
- [ ] Performance advice follows measurements rather than folklore.
- [ ] Networked timelines are local simulations, not protocol/security instruction.
- [ ] Engine-specific APIs and subjective game feel are excluded from exact grading.
- [ ] Every distractor represents a plausible misconception.
- [ ] Every family has difficulty progression, three examples, feedback, and validation.
- [ ] The standalone app works offline without an engine, compiler, GPU API, or backend.
