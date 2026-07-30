# System Design — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, architecture-diagram renderer, exact-arithmetic
oracle, discrete-event simulator, semantic answer checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual requirements meanings.

## 1. Topic overview

### Topic name

System Design

### Topic goal

Develop fluent, evidence-based reasoning about software systems made from
multiple services, data stores, caches, queues, replicas, and operational
controls. A practiced learner should be able to:

- turn stated product behavior into measurable functional and non-functional
  requirements;
- estimate rates, storage, bandwidth, concurrency, headroom, and bottlenecks;
- trace requests and state changes through a bounded architecture;
- distinguish stateless scaling from state placement and session affinity;
- reason about API compatibility, idempotency, concurrency control, and
  ownership boundaries;
- calculate cache effects and trace cache-aside, expiry, invalidation, and
  stampede behavior;
- assign keys to partitions, identify skew, and predict controlled rebalancing;
- trace replication, acknowledged durability, replica lag, consistency
  guarantees, failover, and bounded distributed transactions;
- reason about queue backlog, consumer capacity, retries, deduplication,
  ordering, poison messages, and backpressure;
- calculate availability, error budgets, recovery objectives, and retry
  amplification under explicitly stated models;
- choose useful telemetry and interpret metrics, logs, traces, canaries, and
  rollout evidence;
- identify trust boundaries, authorization placement, tenant-isolation
  failures, rate-limit outcomes, single points of failure, and requirement
  violations;
- compare a small set of fully described designs without pretending there is
  one context-free “best architecture.”

The app trains the mechanics and judgment primitives used in system design. It
does not score free-form architecture essays or reward memorized interview
templates.

### Position within Practice Lab

- **Computer Science: Algorithms and Discrete Reasoning** owns general
  algorithms, data structures, graph traversal, and asymptotic analysis.
- **Networking and Protocols** owns packets, routing, TCP, DNS, TLS, NAT, and
  wire behavior. This topic treats a network call as a declared service edge.
- **HTTP and Web Practice** owns HTTP semantics, caching headers, cookies,
  origins, and browser-facing protocol behavior. This topic owns application
  service contracts and end-to-end request composition.
- **SQL and Relational Databases** owns query semantics, relational modeling,
  constraints, and transactions inside its teaching database. This topic owns
  store placement, partitioning, replication, and cross-service boundaries.
- **Unix Shell and Administration Practice** owns commands and host-level
  operational mechanics. This topic owns architecture-level operational
  reasoning.
- **Probability and Statistics** owns general distributions and inference.
  This topic uses supplied proportions and bounded probability models.
- **Practical Cryptography** owns cryptographic primitive mechanics. This topic
  uses semantic controls such as authenticated, authorized, encrypted in
  transit, and encrypted at rest without implementing cryptography.
- **Business Economics and Managerial Decisions** owns general financial
  decisions. This topic uses fictional cost constraints only to compare
  technically valid architectures.

Overlap is permitted only when the system context changes the operation being
trained. A cache-hit calculation belongs here when it determines backend
capacity; an isolated percentage drill does not.

### Audience and prerequisites

The target learner is a software developer, operations engineer, technical
student, or architect moving from single-process programs toward distributed
systems.

Expected prerequisites:

- arithmetic with percentages, rates, and powers of ten;
- basic programming and API concepts;
- tables, directed graphs, and timelines;
- the idea of a process, request, database, cache, and queue;
- elementary probability for later availability questions.

Learn cards introduce every architecture-specific model before removing
scaffolding. No cloud-provider experience is assumed.

### Scope

The initial topic includes:

- requirements, SLIs, SLO-shaped constraints, workloads, growth, and capacity;
- average versus peak traffic, read/write mix, payload size, concurrency, and
  latency budgets;
- request paths, fan-out/fan-in, service boundaries, synchronous and
  asynchronous edges;
- stateless replicas, simple load-balancing policies, affinity, and overload;
- backward-compatible API changes, pagination, idempotency keys, and optimistic
  concurrency;
- cache-aside, TTL, invalidation, negative caching, layered caches, hit ratios,
  and bounded stampede mitigation;
- modulo/range partitioning, a displayed consistent-hash ring, skew, hot keys,
  and controlled rebalancing;
- leaders/followers, replication factors, declared quorum protocols, lag,
  failover, consistency histories, durable acknowledgements, local
  transactions, and small sagas;
- work queues, pub/sub fan-out, delivery attempts, retries with displayed
  backoff/jitter, dead-letter handling, ordering partitions, deduplication, and
  backpressure;
- independent-failure availability arithmetic, failure domains, timeouts,
  retries, circuit breakers, bulkheads, graceful degradation, RTO, and RPO;
- SLIs, SLOs, error budgets, burn rates, metrics, logs, traces, alerts, canary
  comparison, and bounded rollout decisions;
- trust boundaries, authentication versus authorization, least privilege,
  tenant isolation, synthetic data classification, and token-bucket rate
  limiting;
- fictional resource-cost arithmetic, single-point-of-failure audits,
  requirement-to-design matching, and staged evolution.

Questions use generated component graphs, state tables, request traces,
timelines, workload cards, and constrained design alternatives. Every answer
must follow from the displayed model.

### Exclusions

Do not include:

- open-ended “design a global social network” answers graded from prose;
- vendor product-name trivia, certification questions, price lists, quotas, or
  current cloud-service behavior;
- the claim that microservices, event sourcing, serverless, NoSQL, relational
  storage, containers, Kubernetes, or any other style is universally best;
- arbitrary production sizing from an average request rate alone;
- unstated independence assumptions in availability calculations;
- a claim that a quorum inequality alone proves linearizability;
- end-to-end “exactly once” claims without a fully modeled atomic boundary;
- consensus protocol internals, Byzantine faults, clock synchronization,
  distributed snapshots, CRDT proofs, or formal verification in v1;
- unrestricted query planning, schema design, packet routing, cryptographic
  calculations, operating-system tuning, or deployment commands;
- current security advice for a real organization, threat hunting, exploit
  construction, or secrets entered by the learner;
- real customer data, real incidents, real infrastructure inventories, or
  runtime network requests;
- subjective cost optimization without a supplied fictional rate card;
- precise tail-latency prediction from independent averages;
- free-form postmortems, organizational design, hiring, or process assessment;
- acronym expansion and named-pattern recall without an operational scenario.

### Teaching model and notation

The default model ID is `PL-SystemDesign-v1`. Each question records any
variation from it.

#### Components and edges

An architecture is a typed directed multigraph:

```text
SystemCase {
  caseId
  requirements[]
  workload
  components[]
  edges[]
  placement[]
  failureDomains[]
  policies[]
  events[]
  observations[]
  candidateDesigns[]
}
```

Core component types are client, gateway, load balancer, service replica,
cache, relational store, key-value store, object store, queue, topic, worker,
identity service, and telemetry collector. A component label describes its
modeled role, not a vendor implementation.

An edge declares:

```text
{source, destination, mode, operation, timeout, retryPolicy, payload,
 consistencyNeed, authenticationContext}
```

`mode` is synchronous request/response, asynchronous message, replication, or
telemetry. A diagram must derive from the same graph used by the oracle.

#### Time and event ordering

- Simulation time is integer milliseconds unless another unit is displayed.
- Events at different timestamps run in timestamp order.
- Events at the same timestamp run in displayed sequence-number order.
- A send and its resulting delivery are separate events.
- A timed-out caller may stop waiting even though the callee later commits a
  side effect.
- TTL validity uses the half-open interval
  `storedAt <= now < storedAt + TTL`.
- A queue attempt becomes visible again at the exact declared visibility
  deadline if not acknowledged.
- No real wall clock, scheduler, or network nondeterminism is inferred.

#### Quantities and units

- Decimal capacity units use `k=1000`, `M=10^6`, and `G=10^9`.
- Binary storage units use `KiB=1024 B`, `MiB=1024 KiB`, and
  `GiB=1024 MiB`.
- A question never writes ambiguous bare `KB` or `MB`.
- Request rate is requests per second (`req/s`); message and byte rates use
  explicit units.
- `averageRate = events / intervalSeconds`.
- `bandwidth = rate * bytesPerEvent`, before declared protocol/replication
  multipliers.
- Deterministic concurrency uses `concurrency = arrivalRate * serviceTime` only
  for the displayed steady workload and compatible units. It is a sizing
  relation, not a general latency theorem.
- Capacity comparisons use exact rational arithmetic; display rounding never
  changes pass/fail.
- Headroom `h` means planned load must be no more than `(1-h)*rawCapacity`.

#### Latency and throughput

- Serial deterministic path latency is the sum of edge/component times.
- Parallel fan-out completes at the maximum required branch time plus declared
  fan-out/fan-in overhead.
- Optional branches do not contribute when the response does not wait for
  them.
- Throughput of a strict serial pipeline is the minimum stage capacity after
  unit conversion.
- Percentiles are empirical order statistics from the displayed finite sample
  under a stated nearest-rank rule. Percentiles of component latencies are
  never added to infer an end-to-end percentile.

#### Cache model

A cache entry is `{key,value,storedAt,ttl,version}`. Policies are displayed:

- cache-aside reads check cache, then store, then populate;
- writes may invalidate, update, or ignore the cache only as stated;
- negative entries cache a declared “not found” result;
- layered-cache lookups proceed in displayed order;
- coalescing allows one fill per key while followers wait;
- stale-while-revalidate is excluded unless a family supplies its exact window.

Eviction due to capacity uses a displayed tiny LRU or FIFO policy. Otherwise
capacity eviction is absent.

#### Partition model

- Modulo partitioning uses `partition = hash(key) mod N`, with hash values
  supplied.
- Range partitioning uses displayed half-open ranges.
- A consistent-hash ring uses integer positions `0..R-1`; a key belongs to the
  first node/token clockwise, wrapping at `R`.
- Virtual tokens are simply multiple displayed positions owned by one node.
- Replicas, movement, and failure routing use only the displayed ring policy.
- Consistent hashing does not itself provide replication, balance, durability,
  or consensus.

#### Replication and consistency model

Replication questions name a profile:

- `single-leader`: one accepted write leader and zero or more followers;
- `declared-quorum-register`: `N` replicas and displayed `R/W` rules;
- `multi-writer-toy`: concurrent versions plus an explicit resolver.

For the declared quorum register, successful writes reach `W` replicas and
reads consult `R`. `R+W>N` guarantees read/write set intersection in this toy
model; `2W>N` guarantees two successful write sets intersect. A question may
call the result “overlap” but must not infer linearizability without the
profile's version comparison, failure, and completion rules.

Consistency labels have bounded meanings:

- **linearizable history:** each completed operation can be placed at one point
  between invocation and response while respecting real-time order;
- **read-your-writes:** a client session does not later observe a version older
  than its completed write;
- **monotonic reads:** a client session does not move backward among versions;
- **eventual convergence:** after writes stop and declared deliveries complete,
  replicas converge under the shown resolver.

Histories are small and fully displayed. The app does not ask learners to prove
arbitrary histories.

#### Queue and delivery model

A queue message has stable `messageId`, optional `orderingKey`,
`availableAt`, `attempt`, and payload operation ID.

- Publishing successfully places one message unless an explicit duplicate
  event is shown.
- At-least-once delivery may redeliver after worker failure or acknowledgement
  loss.
- At-most-once delivery may lose a message but never redelivers it in the
  displayed model.
- “Effectively once” means duplicate deliveries are possible but a modeled
  idempotent sink commits one effect per operation ID.
- FIFO ordering is promised only within the declared ordering scope.
- The dead-letter threshold is either “after `maxAttempts` failed attempts” or
  another displayed convention; wording and simulator must agree.

#### Availability and recovery

- Component availability is the fraction of the displayed observation window
  during which its modeled function succeeds.
- A strict serial dependency path succeeds only when all required components
  succeed.
- For explicitly independent component failures, serial availability is the
  product of component availabilities.
- For `n` explicitly independent identical active replicas where any one is
  sufficient, availability is `1-(1-a)^n`.
- Shared dependencies and failure domains invalidate naïve independence; their
  states are modeled explicitly.
- `RTO` is the target maximum restoration time after a disruption.
- `RPO` is the target maximum age/amount of lost committed data, expressed in
  time under the displayed backup/replication schedule.

#### SLO model

An SLI is a precisely defined measurement. An SLO is a target over a window.
For request success SLO `S` and `T` eligible events:

```text
allowedBad = floor(T * (1-S))
remainingBudget = allowedBad - observedBad
errorBudgetFractionConsumed = observedBad / allowedBad
burnRate = observedBadRate / (1-S)
```

The prompt states inclusion/exclusion rules and rounding. Availability is not
automatically the only SLI; latency, freshness, correctness, and completeness
may be used.

### Global answer conventions

- Surrounding whitespace is ignored.
- Numeric answers accept locale-aware decimal separators and the displayed
  unit. Unit conversion is accepted when exact and unambiguous.
- Percent answers accept a number with optional `%`; the field label states
  whether `99.9` means percent rather than fraction.
- Rates require the requested time base unless the field fixes it.
- Durations accept compatible displayed units.
- Ordered traces use draggable steps or named fields, not punctuation-sensitive
  prose.
- Architecture selections use stable component/design IDs.
- `cannot determine`, `requirement not stated`, `model does not guarantee it`,
  and `no feasible design` are distinct structured answers.
- Multiple valid real-world architectures do not imply multiple accepted
  answers: every selection question supplies requirements that make one
  candidate dominate, or explicitly accepts a set.
- Free-form architecture prose is never the sole scored answer.

### Difficulty philosophy

Difficulty increases through:

- moving from one quantity to interacting rate, storage, latency, and headroom
  constraints;
- weakening scaffolds while retaining the same semantic model;
- tracing state across failures, retries, expiry, lag, or asynchronous edges;
- distinguishing average, peak, percentile, and worst-case claims;
- finding hidden shared dependencies and failure domains;
- separating accepted, durable, replicated, visible, and processed states;
- combining independently mastered components in one bounded architecture;
- identifying underdetermination rather than guessing an industry convention;
- comparing trade-offs against explicit priorities.

Difficulty must not increase through enormous diagrams, arbitrary provider
names, memorized limits, gratuitous arithmetic, invisible assumptions, jargon
density, unrealistic scale, or essay length. A five-component trace with one
subtle retry may be harder than a twenty-box static diagram and is preferred.

### Shared generation, feedback, and distractor policy

Generate semantic cases before rendering. Each case stores:

```text
categoryId, familyId, level, profileId, requirements, topology, state,
events, observations, canonicalAnswer, acceptedAnswerSet, workedTrace,
misconceptionsTargeted, structuralSignature, sourceProfileVersion
```

Every choice distractor must arise from a named error: using average instead of
peak, summing parallel latency, assuming a timeout cancels work, treating an
acknowledgement as durable, adding component percentiles, confusing
authentication with authorization, assuming exactly-once delivery, ignoring a
failure domain, or choosing a fashionable component unsupported by a
requirement.

Feedback should name the first incorrect inference and expose the relevant
state transition or equation. It must not merely reveal the preferred diagram.

## 2. Category: Requirements, workload, and capacity

### Category purpose

Train translation from a product/workload card into measurable constraints and
enough arithmetic to reject infeasible designs before adding architectural
complexity.

### Learn

Separate what the system must do from how well it must do it. Functional
requirements describe behavior; non-functional requirements constrain
latency, availability, durability, freshness, scale, security, or cost.
Average traffic sizes ordinary work, while peaks and growth determine safe
capacity. State every unit and add headroom explicitly.

### Prerequisites and boundaries

Prerequisites are percentages, unit conversion, and table reading. General
arithmetic belongs in Mental Arithmetic; statistical estimation belongs in
Probability and Statistics. This category uses fully supplied workloads and
does not forecast real demand.

### Family `requirement_metric_match`

**Task/purpose.** Match each stated user/system need to a measurable requirement
or mark it unmeasurable as written.

**Response/template.** Matching. `Match each requirement in {needs} to the best
measure in {metrics}.`

**Generation and derivation.** Construct functional needs and latency,
availability, durability, freshness, throughput, privacy, and cost constraints.
Match by measured outcome and scope, not shared vocabulary.

**Constraints/rejection.** Every metric has one best need; include units/window.
Reject vague pairs where several metrics are equally suitable.

**Difficulty.** L1 functional versus quality; L2 choose SLI and window; L3 catch
a proxy metric that does not measure the user outcome; L4 mark missing threshold
or population.

**Distractors/feedback.** Use CPU utilization for user latency, average for tail,
and uptime for data correctness. Feedback names population, event, threshold,
and window.

**Examples.** (1) “99% of searches under 300 ms” → latency percentile, L1.
(2) “new posts visible within 60 s” → freshness, L2. (3) “system should be
fast” → unmeasurable until threshold/population/window are supplied, L3.

**Implementation/validation/coverage.** Use typed requirement/metric records;
validate one-to-one matching. Balance all quality dimensions and missing-field
cases.

### Family `average_peak_rate`

**Task/purpose.** Convert event totals and peak multipliers/windows into average
and peak rates.

**Response/template.** Named numeric fields. `{events} events occur over
{window}; peak traffic is {peakRule}. Give average and peak req/s.`

**Derivation.** Divide events by exact seconds; apply the declared multiplier or
peak-window count.

**Constraints/rejection.** Time units are explicit; results remain manageable;
do not imply arrival smoothness within a window.

**Difficulty.** L1 seconds; L2 day/hour conversion; L3 separate read/write mix;
L4 peak window derived from a percentage of daily traffic.

**Distractors/feedback.** Wrong seconds-per-unit, applying peak to daily total,
or confusing operations with requests. Show unit cancellation.

**Examples.** (1) 600 requests/60 s → 10 req/s, L1. (2) 8.64M/day, 5× peak →
100 average, 500 peak req/s, L2. (3) 20% of 3.6M requests in one peak hour →
200 peak req/s, L4.

**Implementation/validation/coverage.** Exact rationals; independently integrate
rates back to totals. Balance time units, mixes, and both peak definitions.

### Family `read_write_payload_rates`

**Task/purpose.** Split traffic by operation mix and derive event/byte rates.

**Response/template.** Named fields. `At {rate} req/s with mix {mix} and payloads
{sizes}, find each operation rate and ingress/egress byte rate.`

**Derivation.** Multiply total rate by exact mix fractions, then by payload size
and declared direction.

**Constraints/rejection.** Mix sums to 100%; batching/overhead absent unless
shown; units explicit.

**Difficulty.** L1 two-way mix; L2 different request/response sizes; L3 fan-out
multiplier; L4 compression or replication multiplier supplied.

**Distractors/feedback.** Apply all payloads to total rate, swap ingress/egress,
or use bits as bytes. Feedback shows a dimensional table.

**Examples.** (1) 100 req/s, 80% reads → 80 reads/s, L1. (2) 50 writes/s ×
2 KiB → 100 KiB/s ingress, L2. (3) 200 reads/s returning 5 KiB and 20 writes/s
of 1 KiB → 1000 KiB/s egress and 20 KiB/s ingress, L3.

**Implementation/validation/coverage.** Conservation of rate shares and byte
dimensions; cover read-heavy, write-heavy, and balanced workloads.

### Family `storage_growth_projection`

**Task/purpose.** Calculate retained logical and physical storage over a stated
horizon.

**Response/template.** Numeric fields. `{objectsPerDay} objects/day at
{bytesPerObject}, retained {days} days, with {replication/overhead}. Find logical
and physical storage.`

**Derivation.** Multiply rate, retention, and object size; then apply explicit
index, metadata, compression, and replication factors in declared order.

**Constraints/rejection.** No hidden filesystem overhead; decimal/binary units
not mixed; deletion and growth schedules shown.

**Difficulty.** L1 logical bytes; L2 unit conversion; L3 replication; L4
changing daily rate or tiered retention.

**Distractors/feedback.** Multiply replication twice, divide by retention, or
confuse GiB/GB. Show a factor chain.

**Examples.** (1) 1000/day × 1 KiB × 10 days → 10,000 KiB, L1. (2) 2 GiB
logical with RF3 → 6 GiB, L2. (3) 10 GB data plus 20% index, RF2 → 24 GB, L3.

**Implementation/validation/coverage.** Exact integer/rational byte counts;
round only display. Cover retention, compression, metadata, and replication.

### Family `concurrency_from_rate_time`

**Task/purpose.** Estimate in-flight work from a declared steady arrival rate
and mean service time.

**Response/template.** Numeric. `Under the stated steady model, {rate} req/s
spend {time} in the system. Estimate mean in-flight requests.`

**Derivation.** Convert time to seconds and compute `rate*time`.

**Constraints/rejection.** The steady deterministic/mean model is stated;
questions do not infer queue percentiles or instance count without capacity.

**Difficulty.** L1 integral seconds; L2 milliseconds; L3 separate classes; L4
compare before/after latency change at fixed arrival rate.

**Distractors/feedback.** Divide rate by time or forget milliseconds. Feedback
states this is an average sizing relation, not a burst guarantee.

**Examples.** (1) 20 req/s × 0.5 s → 10, L1. (2) 800 req/s × 25 ms → 20, L2.
(3) 600 req/s with 90 ms before and 30 ms after → 54 versus 18, L3.

**Implementation/validation/coverage.** Dimensional oracle; keep exact fractional
means when requested. Balance units and service classes.

### Family `capacity_with_headroom`

**Task/purpose.** Determine the minimum resource count satisfying peak load and
headroom.

**Response/template.** Integer. `Each instance safely handles {rawCapacity};
peak load is {peak}; reserve {headroom}% headroom. Minimum instances?`

**Derivation.** Safe capacity per instance is
`rawCapacity*(1-headroom)`; answer is the ceiling of peak/safe capacity.

**Constraints/rejection.** Headroom in `[0,60)%`; one interpretation only;
capacity applies to the same operation mix as load.

**Difficulty.** L1 no headroom; L2 friendly percentage; L3 mixed read/write
resource constraints; L4 choose maximum count required by CPU, memory, and I/O.

**Distractors/feedback.** Add headroom to demand using the wrong base, floor the
count, or average instead of peak. Show safe per-instance capacity.

**Examples.** (1) 250 req/s, 100 each →3, L1. (2) 800 req/s, 250 raw, 20%
headroom →4, L2. (3) CPU needs 6 and memory needs 8 →8, L4.

**Implementation/validation/coverage.** Exact ceiling arithmetic; verify
`n` succeeds and `n-1` fails. Vary limiting resource and boundary proximity.

### Family `latency_budget_path`

**Task/purpose.** Compute remaining latency budget or test a deterministic
request path.

**Response/template.** Numeric/status. `The end-to-end budget is {budget}.
Declared path costs are {costs}. What remains, and does it fit?`

**Derivation.** Add serial costs; use maximum for required parallel branches;
add fan-out/fan-in overhead; subtract from budget.

**Constraints/rejection.** Path topology and wait semantics explicit. Never add
component percentiles.

**Difficulty.** L1 serial; L2 parallel; L3 optional async edge; L4 nested
serial/parallel DAG.

**Distractors/feedback.** Max instead of sum for serial, sum instead of max for
parallel, or include fire-and-forget work. Feedback highlights the critical
path.

**Examples.** (1) 100 ms budget, 20+30+10 →40 ms left, L1. (2) parallel
20/55 ms plus 5 ms merge →60 ms, L2. (3) 30 ms sync plus 200 ms queued audit →
response path remains 30 ms, L3.

**Implementation/validation/coverage.** Longest-path calculation on an acyclic
wait graph; validate no cycle and one declared response sink.

### Family `bottleneck_throughput`

**Task/purpose.** Identify limiting stages and resulting throughput.

**Response/template.** Component plus rate. `Pipeline capacities are {stages};
what is maximum sustained throughput and first bottleneck?`

**Derivation.** Normalize capacities to the same input-unit rate, accounting for
fan-out or per-request work; choose the minimum.

**Constraints/rejection.** Unique first bottleneck unless ties are the lesson;
no queueing claim beyond sustained capacity.

**Difficulty.** L1 equal work ratios; L2 batching; L3 fan-out; L4 two resources
and a tie or workload-mix change.

**Distractors/feedback.** Choose fastest stage, add capacities in series, or
ignore calls per request. Show required work per input request.

**Examples.** (1) stages 100/80/120 req/s →80 at stage B, L1. (2) store handles
300 writes/s, each request writes 3 rows →100 req/s, L2. (3) two equal
90 req/s limits →90 and both bottlenecks, L4.

**Implementation/validation/coverage.** Rational normalization and independent
flow conservation. Balance compute, store, network, and queue bottlenecks.

### Cross-family progression

Requirement matching precedes arithmetic. Average/peak and mix precede storage,
bandwidth, concurrency, and headroom. Latency and throughput remain separate
until both are mastered; a fast response does not imply sufficient throughput.

## 3. Category: Request paths, contracts, and horizontal scaling

### Category purpose

Train exact tracing of a request through service boundaries and the design
properties that make replication safe and interfaces evolvable.

### Learn

A request path is a graph of waits and side effects. Stateless replicas can
share requests when required state lives in an appropriate shared or
request-carried location. A timeout stops waiting; it does not erase a possible
side effect. API evolution must preserve the declared client contract.
Idempotency and concurrency control solve different problems.

### Prerequisites and boundaries

Requires Category 2. HTTP method semantics belong in HTTP and Web Practice;
language-level concurrency belongs elsewhere. This category uses a tiny
provider-neutral API and load-balancer model.

### Family `request_path_trace`

**Task/purpose.** Order calls, responses, and side effects through a displayed
service graph.

**Response/template.** Ordered sequence/state table. `Trace request {request}
through {topology} under {edgePolicies}.`

**Derivation.** Follow synchronous calls depth-first by waits and asynchronous
sends as separate events; apply timestamp/sequence ordering.

**Constraints/rejection.** Acyclic ordinary path; every edge mode labeled;
unique observable order.

**Difficulty.** L1 chain; L2 one branch; L3 mixed sync/async; L4 timeout with a
later callee completion.

**Distractors/feedback.** Treat async work as blocking, assume timeout cancels
callee, or return before a required branch. Feedback marks wait edges.

**Examples.** (1) A→B→DB then unwind → DB response, B response, A response, L1.
(2) A waits for B/C in parallel → response after slower branch, L2. (3) A times
out at 50 ms; B commits at 70 ms → client sees timeout but commit occurs, L4.

**Implementation/validation/coverage.** Discrete-event graph simulator; ensure
rendered arrows and event log share IDs. Cover chains, fan-out, queues, timeout.

### Family `sync_async_boundary_choice`

**Task/purpose.** Choose which declared edge may be asynchronous without
violating stated response semantics.

**Response/template.** Component/edge choice. `Which edge may be queued while
still satisfying {requirements}?`

**Derivation.** An edge may be asynchronous only if the response need not
include its result and the required side-effect timeliness/durability is met.

**Constraints/rejection.** Exactly one candidate satisfies all displayed
requirements; no universal “async is scalable” rationale.

**Difficulty.** L1 audit/log side effect; L2 freshness deadline; L3 ordering or
failure feedback; L4 compare two viable edges under different requirements.

**Distractors/feedback.** Queue a required authorization or price calculation,
or keep an optional notification synchronous. Feedback quotes the decisive
requirement.

**Examples.** (1) receipt email may finish within 5 min → queue it, L1. (2)
authorization result required before acceptance → keep synchronous, L2. (3)
inventory reservation must be confirmed in response while analytics may lag →
queue analytics, L3.

**Implementation/validation/coverage.** Candidate edges carry `requiredForReply`
and deadline metadata; property-test unique feasible choice.

### Family `stateless_replica_capacity`

**Task/purpose.** Determine whether horizontal scaling is valid and sufficient.

**Response/template.** Yes/no plus count/reason. `Can {service} use interchangeable
replicas under {statePlacement}, and how many satisfy {load}?`

**Derivation.** Check that request correctness does not depend on replica-local
mutable state; if valid, apply capacity/headroom arithmetic.

**Constraints/rejection.** Health and shared dependencies explicit; local
immutable code/config does not count as session state.

**Difficulty.** L1 stateless; L2 local session state; L3 externalized state with
shared-store bottleneck; L4 failure-domain placement.

**Distractors/feedback.** Assume “no database” means stateless, or scale frontends
while ignoring shared-store capacity. Show state ownership and limiting tier.

**Examples.** (1) auth token carries session, shared DB → interchangeable, L1.
(2) cart only in replica memory → not interchangeable, L2. (3) 10 replicas fit
frontend but shared store supports half the load → design still infeasible, L3.

**Implementation/validation/coverage.** Typed state-location graph plus capacity
oracle. Balance valid/invalid and dependency-limited cases.

### Family `load_balancer_policy_trace`

**Task/purpose.** Assign a short request sequence under a declared balancing
policy and health state.

**Response/template.** Ordered replica IDs. `Route {requests} using {policy},
starting with {state}.`

**Derivation.** Implement round-robin, least-outstanding with displayed tie
order, or deterministic key hash. Remove unhealthy replicas at the shown event.

**Constraints/rejection.** No latency prediction; tie order and health timing
explicit.

**Difficulty.** L1 round-robin; L2 health change; L3 outstanding completions;
L4 weighted slots or key-based routing.

**Distractors/feedback.** Continue counter over removed slot incorrectly, choose
fastest by name, or confuse connection with request counts. Show policy state
after each request.

**Examples.** (1) RR A,B,C for four requests →A,B,C,A, L1. (2) B unhealthy
before request 3 →A,B,A,C under displayed cursor rule, L2. (3) outstanding
A=2,B=1,C=1, tie B before C →B, L3.

**Implementation/validation/coverage.** Policy state machine; cover every start
cursor, health transition, tie, and policy.

### Family `session_affinity_failure`

**Task/purpose.** Trace session behavior when affinity or a replica changes.

**Response/template.** Outcome/reason. `Given {sessionPlacement},
{affinityPolicy}, and {failure}, can the next request continue?`

**Derivation.** Route by affinity, then test whether required state is available
at the selected healthy replica or shared store.

**Constraints/rejection.** Cookie/session semantics displayed; do not claim
affinity is redundancy.

**Difficulty.** L1 healthy sticky replica; L2 failure with local state; L3
shared state; L4 affinity rebalance plus stale replicated session version.

**Distractors/feedback.** Treat routing stickiness as data replication or assume
all cookies contain full state. Feedback separates routing from storage.

**Examples.** (1) local session on A and A healthy →continue, L1. (2) A fails,
session only on A →lost/unavailable, L2. (3) session in shared store, request
moves to B →continue, L3.

**Implementation/validation/coverage.** State reachability query; balance local,
client-carried, shared, and replicated state.

### Family `api_change_compatibility`

**Task/purpose.** Judge a schema/interface change against displayed old and new
client behavior.

**Response/template.** Compatible/breaking/underdetermined plus affected client
set. `Apply change {change} to contract {contract}; which clients still work?`

**Derivation.** Evaluate required/optional fields, unknown-field policy, enum
handling, type/range, and endpoint lifetime exactly as declared.

**Constraints/rejection.** No ecosystem folklore; serializer/client rules shown;
one changed dimension per introductory item.

**Difficulty.** L1 add optional field; L2 remove/rename; L3 enum expansion under
strict/permissive clients; L4 phased producer/consumer rollout.

**Distractors/feedback.** “Adding is always safe,” server-only reasoning, or
assuming unknown enums are ignored. Feedback simulates each client.

**Examples.** (1) add ignored optional response field →compatible, L1. (2)
rename required `userId` →old client breaks, L2. (3) add enum value while old
client rejects unknowns →breaking for that client, L3.

**Implementation/validation/coverage.** Tiny schema compatibility evaluator;
round-trip fixtures for client versions and balanced change types.

### Family `idempotency_key_trace`

**Task/purpose.** Determine committed effects and responses across duplicate
requests, timeouts, and idempotency records.

**Response/template.** Effect count plus response timeline. `Trace requests
{attempts} using idempotency policy {policy}.`

**Derivation.** Atomically reserve/lookup the `(scope,key)` record as declared;
replay stored result for matching payload; reject key reuse with conflicting
payload.

**Constraints/rejection.** Atomic boundary and retention window explicit; no
claim that every operation is naturally idempotent.

**Difficulty.** L1 sequential duplicate; L2 timeout then retry; L3 concurrent
duplicates; L4 expired key or payload conflict.

**Distractors/feedback.** Count each delivery as an effect, assume timeout means
no effect, or dedupe across wrong tenant. Show key-record state.

**Examples.** (1) same key twice →one effect, replay response, L1. (2) first
commits then response lost; retry →one effect, L2. (3) same key/different amount
→declared conflict, no second effect, L4.

**Implementation/validation/coverage.** Atomic state-machine oracle; interleave
events exhaustively for two requests. Cover scope, expiry, and conflicts.

### Family `optimistic_concurrency_write`

**Task/purpose.** Resolve competing updates using a displayed version
precondition.

**Response/template.** Success/conflict plus final record. `Apply writes
{writes} to record {record} using compare-version-and-set.`

**Derivation.** A write succeeds only when expected version equals current;
successful write changes value and increments version atomically.

**Constraints/rejection.** Total event order explicit; retry merge rule absent
unless supplied.

**Difficulty.** L1 one write; L2 two stale writers; L3 retry after reread; L4
field merge versus replacement under a supplied function.

**Distractors/feedback.** Last-write-wins despite precondition, compare against
original forever, or increment on conflict. Show version timeline.

**Examples.** (1) v3 expected3 →success v4, L1. (2) A and B read v3; A succeeds,
B expected3 conflicts →A value at v4, L2. (3) B rereads v4 and reapplies delta
→success v5, L3.

**Implementation/validation/coverage.** Sequential atomic reducer and invariant
that versions increase exactly once per success. Balance conflicts/retries.

### Cross-family progression

Trace request paths before choosing sync/async boundaries. Stateless scaling
precedes balancing and affinity. Compatibility, idempotency, and optimistic
concurrency remain distinct until mastered: they address evolution, duplicate
execution, and competing writes respectively.

## 4. Category: Caching and data distribution

### Category purpose

Train reasoning about where reusable data lives, when it remains valid, how it
changes backend load, and how keys are distributed without treating caching or
sharding as automatic performance buttons.

### Learn

A cache trades freshness and invalidation complexity for avoided work. A hit
ratio matters only together with request rate and miss cost. Partitioning
assigns responsibility; replication copies responsibility. Skew and hot keys
can defeat an even key-count distribution.

### Prerequisites and boundaries

Requires Categories 2–3. HTTP cache semantics belong in HTTP and Web Practice.
Database query indexes belong in SQL Practice. This category uses explicit
application-cache and key-placement policies.

### Family `cache_hit_backend_load`

**Task/purpose.** Derive hit/miss counts and backend load from request rate and
hit ratio.

**Response/template.** Named rates. `At {requestRate} with hit ratio {hitRatio},
find cache hits and backend misses per second.`

**Derivation.** Hits=`rate*h`; misses=`rate*(1-h)`; apply declared miss fan-out
or write-through work.

**Constraints/rejection.** Ratio applies to stated population/window; no claim
about latency from hit ratio alone.

**Difficulty.** L1 direct; L2 mixed cacheable/non-cacheable traffic; L3 miss
fan-out; L4 capacity feasibility after hit-ratio change.

**Distractors/feedback.** Send hit traffic to backend, apply ratio to only misses
twice, or confuse byte and request hit ratio. Show traffic split.

**Examples.** (1) 1000/s, 90% →900 hits,100 misses, L1. (2) 20% uncacheable and
80% cacheable at 75% hit →40% total backend, L3. (3) 200 misses/s ×3 backend
calls →600 calls/s, L3.

**Implementation/validation/coverage.** Exact fractions and conservation
`hits+misses=eligible`; cover request/byte ratio distinction.

### Family `cache_aside_read_trace`

**Task/purpose.** Trace cache-aside reads and population.

**Response/template.** Ordered actions plus final cache. `Process reads {reads}
from initial cache {cache} and store {store}.`

**Derivation.** On valid hit return cache; on miss read store, populate with
version/time, return; handle not-found only under negative-cache policy.

**Constraints/rejection.** No concurrent fill unless stampede family; TTL and
capacity policy explicit.

**Difficulty.** L1 hit/miss; L2 repeated key; L3 expiry; L4 tiny LRU eviction.

**Distractors/feedback.** Populate before store read, refresh TTL on every hit
without policy, or skip population. Show entry state after each read.

**Examples.** (1) empty cache, read A →store then populate, L1. (2) read A again
before expiry →hit, L1. (3) capacity2 LRU, access A,B,A,C →B evicted, L4.

**Implementation/validation/coverage.** Cache reducer with store as oracle;
cover hit, miss, expiry, absent, and eviction.

### Family `ttl_freshness_trace`

**Task/purpose.** Decide whether an entry is valid/stale at exact times and what
version may be served.

**Response/template.** State/version. `Entry {entry}; events {events}. At
{queryTimes}, classify hit, miss, or stale.`

**Derivation.** Apply half-open TTL interval and stated write policy; a store
update does not mutate cache unless policy says so.

**Constraints/rejection.** Boundary times included deliberately; clock is
authoritative and integer.

**Difficulty.** L1 before/after expiry; L2 exact boundary; L3 store update
without invalidation; L4 stale-while-revalidate supplied window.

**Distractors/feedback.** Treat expiry endpoint as valid, reset TTL on store
write, or equate TTL with freshness guarantee after origin change.

**Examples.** (1) stored t0 TTL10, read t9 →valid, L1. (2) read t10 →expired,
L2. (3) origin v2 at t5, cached v1 valid to t10 →v1 may be served at t8, L3.

**Implementation/validation/coverage.** Boundary property tests at expiry−1,
expiry, expiry+1; balance invalidation policies.

### Family `cache_write_policy_trace`

**Task/purpose.** Compare invalidate, update, and no-action policies after a
write.

**Response/template.** Final cache plus next-read source/value. `Apply write
{write} under policy {policy}, then process {read}.`

**Derivation.** Commit origin as declared, then invalidate or update cache in
the stated order; model failure point if supplied.

**Constraints/rejection.** Not a general transaction guarantee; order and
failure outcome explicit.

**Difficulty.** L1 successful invalidate/update; L2 no-action staleness; L3
failure between store/cache operations; L4 delayed invalidation event.

**Distractors/feedback.** Assume every write-through is atomic or cache sees
origin mutation magically. Show two state locations.

**Examples.** (1) write v2 then invalidate →next read misses and gets v2, L1.
(2) write v2/no cache action →cached v1 until expiry, L2. (3) cache updated v2
but origin write fails under cache-first policy →inconsistent v2 cache, L3.

**Implementation/validation/coverage.** Two-resource event simulator; enumerate
failure cut points and verify declared ordering.

### Family `layered_cache_trace`

**Task/purpose.** Trace lookup/population through client, edge, and service
caches.

**Response/template.** Hit layer, origin load, and final states. `Resolve {key}
through layers {layers} under {fillPolicy}.`

**Derivation.** Search in order; first valid hit supplies value; populate
specified upstream layers.

**Constraints/rejection.** Version and TTL per layer; no HTTP semantics inferred.

**Difficulty.** L1 two layers; L2 fill propagation; L3 conflicting versions;
L4 invalidation reaches only selected layers.

**Distractors/feedback.** Sum hits across layers, continue to origin after hit,
or update every layer despite scope. Show lookup ladder.

**Examples.** (1) L1 miss/L2 v3 hit →no origin read, L1. (2) all miss →origin
v4 and fill both, L2. (3) invalidate service cache only →edge may still serve
v3, L4.

**Implementation/validation/coverage.** Ordered layer reducer; validate one
source chosen and declared fill/invalidation scope.

### Family `cache_stampede_timeline`

**Task/purpose.** Count origin fills during simultaneous misses with or without
request coalescing.

**Response/template.** Integer plus timeline. `{requests} arrive for expired key
under {policy}; how many origin reads start?`

**Derivation.** Without coalescing each miss starts work; with per-key
coalescing one leader fills while followers wait; lock timeout behavior shown.

**Constraints/rejection.** Arrival/completion order exact; no performance claims
beyond model.

**Difficulty.** L1 simultaneous; L2 arrivals during fill; L3 leader failure;
L4 lock TTL expires before slow fill.

**Distractors/feedback.** Assume cache inherently coalesces or one fill globally
for all keys. Show per-key in-flight map.

**Examples.** (1) 5 misses/no coalescing →5 reads, L1. (2) 5 same-key misses
with coalescing →1, L2. (3) requests for A,A,B →2 leaders, L3.

**Implementation/validation/coverage.** Discrete-event simulation; cover keys,
leader success/failure, lock expiry, and follower counts.

### Family `modulo_range_partition`

**Task/purpose.** Assign supplied keys under modulo or range partitioning and
identify movement after a change.

**Response/template.** Partition table. `Assign keys {keys} using {partitionMap}.`

**Derivation.** Apply supplied hashes modulo N or half-open range lookup; recompute
under changed map if requested.

**Constraints/rejection.** Hash values supplied; boundaries non-overlapping and
cover stated domain.

**Difficulty.** L1 modulo; L2 range endpoints; L3 add modulo shard; L4 compare
movement/skew.

**Distractors/feedback.** Modulo raw key rather than supplied hash, include both
range endpoints, or assume only one shard moves under N change.

**Examples.** (1) hashes 5,8 with N3 →2,2, L1. (2) ranges `[0,100)`,
`[100,200)`, key100 →second, L2. (3) hash8 moves from shard0 at N4 to shard3 at
N5, L3.

**Implementation/validation/coverage.** Exhaust boundaries and modulo residues;
track movement fraction without claiming universal distribution.

### Family `consistent_hash_ring`

**Task/purpose.** Assign keys and replicas on a displayed hash ring.

**Response/template.** Node/token sequence. `Ring {tokens}; key hashes {keys};
give primary and next {replicaCount} distinct owners.`

**Derivation.** Walk clockwise from key, wrap, and skip repeated virtual-token
owners when distinct owners are required.

**Constraints/rejection.** Ring small; tokens unique; replication policy shown;
never infer balance.

**Difficulty.** L1 primary; L2 wrap; L3 virtual tokens; L4 node removal and
affected keys.

**Distractors/feedback.** Choose nearest absolute token, counterclockwise,
duplicate same owner as replica, or remap all keys after one removal.

**Examples.** (1) tokens A20,B60, key30 →B, L1. (2) key90 →wrap A, L2. (3)
A20/A80/B50/C90, key70 with two distinct owners →A then C, L3.

**Implementation/validation/coverage.** Circular sorted-map oracle; exhaustive
interval and wrap tests. Balance owner/token multiplicity.

### Family `hot_partition_analysis`

**Task/purpose.** Derive per-partition load and identify a hot key/partition.

**Response/template.** Load table and limiting partition. `Traffic by key is
{keyRates}; assignment is {map}; capacities are {capacities}.`

**Derivation.** Sum rates per assigned partition and compare with capacity.

**Constraints/rejection.** Key rate distribution supplied; key count alone is
never accepted as load evidence.

**Difficulty.** L1 direct sum; L2 one hot key; L3 replicated reads but leader
writes; L4 candidate split/salting with supplied routing.

**Distractors/feedback.** Count keys instead of traffic, average load across
partitions, or assume adding empty shards splits one indivisible key.

**Examples.** (1) A/B rates90/10 on same shard capacity120 →100 fits, L1. (2)
one 500/s key on capacity200 →hot regardless of other shards, L2. (3) four-way
salt distributes 400/s evenly →100 each under ideal supplied rule, L4.

**Implementation/validation/coverage.** Flow conservation; generate balanced,
skewed, and indivisible-hot-key cases with unique diagnosis.

### Family `repartition_movement_plan`

**Task/purpose.** Determine which key ranges move and whether a migration plan
preserves declared read/write availability.

**Response/template.** Range set plus valid/invalid sequence. `Change map
{before} to {after}; identify movement and order {migrationSteps}.`

**Derivation.** Diff ownership by elementary intervals; validate copy,
dual-read/write, cutover, and cleanup against displayed policy.

**Constraints/rejection.** Small range maps; migration semantics explicit; no
general zero-downtime claim.

**Difficulty.** L2 one split; L3 concurrent writes with forwarding; L4 failure
at a cut point and recovery.

**Distractors/feedback.** Delete source before copy, route reads to empty target,
or move unaffected ranges. Show ownership/data readiness separately.

**Examples.** (1) split `[0,100)` at50 →only `[50,100)` changes owner, L2. (2)
copy then route then cleanup →valid for read-only migration, L2. (3) writes
during copy without dual-write/log catch-up →target may miss updates, L4.

**Implementation/validation/coverage.** Interval diff plus migration state
machine; inject failure at each step and verify stated invariant.

### Cross-family progression

Load arithmetic precedes state traces. Single-layer cache-aside precedes TTL,
writes, layering, and stampedes. Modulo/range assignment precedes consistent
hashing; hot-partition reasoning follows both. Repartitioning is last because it
combines placement with live state.

## 5. Category: Replication, consistency, and distributed state

### Category purpose

Train separation of copies, acknowledgement, durability, visibility,
consistency, and transaction boundaries.

### Learn

Replication creates copies but the acknowledgement rule determines what a
completed write means. Followers may lag. Quorum overlap is a set property, not
a complete consistency proof. A local transaction does not automatically span
services; multi-step workflows require explicit intermediate states and
compensation semantics.

### Prerequisites and boundaries

Requires data placement from Category 4. SQL Practice owns isolation inside one
database. Consensus internals and arbitrary distributed proofs are excluded.

### Family `replication_storage_capacity`

**Task/purpose.** Calculate replica placement count and physical storage/network
work.

**Response/template.** Named quantities. `Logical data {size}, replication
factor {rf}, placement {domains}; find copies and physical storage.`

**Derivation.** Multiply logical size by actual copy count and supplied overhead;
count distinct failure domains separately.

**Constraints/rejection.** Erasure coding excluded; RF means total copies,
including primary.

**Difficulty.** L1 RF storage; L2 indexes/overhead; L3 domain placement; L4
temporary migration replica.

**Distractors/feedback.** Interpret RF3 as primary+3, confuse partitions and
replicas, or ignore temporary copy. Show copy table.

**Examples.** (1) 10 GiB RF3 →30 GiB, L1. (2) 12 shards RF3 →36 shard copies,
L2. (3) RF3 copies all in one rack →three copies but one rack domain, L3.

**Implementation/validation/coverage.** Placement graph and exact bytes; cover
copy/domain distinction and transient over-replication.

### Family `quorum_overlap`

**Task/purpose.** Determine read/write and write/write intersection under the
declared quorum-register model.

**Response/template.** Two yes/no fields. `For N={N}, R={R}, W={W}, must every
read overlap a successful write? Must two writes overlap?`

**Derivation.** Read/write overlap iff `R+W>N`; write/write iff `2W>N`.

**Constraints/rejection.** Bounds `1..N`; feedback explicitly limits conclusion
to overlap.

**Difficulty.** L1 evaluate; L2 choose minimum R/W; L3 asymmetric candidate
comparison; L4 available-replica constraints.

**Distractors/feedback.** Use `>=N`, assume majority read and write required, or
claim linearizability. Show set-size pigeonhole argument.

**Examples.** (1) N3,R2,W2 →both overlap, L1. (2) N5,R1,W5 →read/write yes,
write/write yes, L2. (3) N5,R2,W3 →R+W=5, so no guaranteed read/write overlap,
L2.

**Implementation/validation/coverage.** Enumerate all subsets for small N to
cross-check inequalities. Cover equality boundaries.

### Family `replica_lag_read`

**Task/purpose.** Determine which version each replica can return over a
replication timeline.

**Response/template.** Version/status table. `Apply writes and replication
deliveries {events}; reads occur at {reads}.`

**Derivation.** Leader applies accepted versions in order; each follower changes
only on delivery; route reads as displayed.

**Constraints/rejection.** Version order and route explicit; no unstated lag
distribution.

**Difficulty.** L1 one delayed follower; L2 session moves replicas; L3
out-of-order delivery with sequence rejection; L4 failover to lagging follower.

**Distractors/feedback.** Assume acknowledgement updates every follower or
wall-clock latest is visible everywhere. Show per-replica timelines.

**Examples.** (1) leader v2, follower still v1 →follower read v1, L1. (2)
delivery v2 at t8, read t7→v1/t8→v2, L2. (3) promote follower at v4 while old
leader had v5 →new leader initially v4 under model, L4.

**Implementation/validation/coverage.** Per-replica monotonic reducer; reject
undeclared version rollback. Balance routes and lag boundaries.

### Family `consistency_history_classify`

**Task/purpose.** Classify a small displayed history against bounded
linearizable, read-your-writes, monotonic-read, and eventual properties.

**Response/template.** Multiple yes/no fields with violating event IDs.
`Which guarantees does history {history} satisfy?`

**Derivation.** Test session version order, completed-write real-time order, and
post-quiescence convergence under definitions.

**Constraints/rejection.** Histories at most eight operations; linearizability
oracle enumerates legal serializations; unknown concurrent order accepted.

**Difficulty.** L2 session guarantees; L3 concurrent operations; L4 combined
properties and incomplete writes.

**Distractors/feedback.** Treat latest invocation as completed, confuse
monotonic reads with read-your-writes, or call any stale read non-eventual.

**Examples.** (1) client writes v2 then reads v1 →violates RYW, L2. (2) reads
v2 then v1 →violates monotonic reads, L2. (3) concurrent write/read returning
old value may still be linearizable if read overlaps write, L3.

**Implementation/validation/coverage.** Exhaust topological serializations for
small histories; curated witnesses for each distinct violation.

### Family `leader_failover_timeline`

**Task/purpose.** Trace write acceptance, fencing, promotion, and visible
versions during declared leader failover.

**Response/template.** Ordered states and accepted/rejected writes. `Process
failure/promotion events {events} under epoch policy {policy}.`

**Derivation.** Only current fenced epoch may accept; promotion starts from
candidate state; replay/catch-up events explicit.

**Constraints/rejection.** No consensus election inference; winner and fencing
oracle supplied.

**Difficulty.** L2 clean failover; L3 old leader returns; L4 in-flight write and
data-loss window.

**Distractors/feedback.** Allow two epochs to write, assume promotion includes
missing versions, or confuse health with authority.

**Examples.** (1) epoch4 leader fails, follower promoted epoch5 →epoch5 accepts,
L2. (2) old epoch4 returns →fenced/rejected, L3. (3) acknowledged only on old
leader and not copied before loss →write absent under declared ack rule, L4.

**Implementation/validation/coverage.** Epoch state machine; invariant at most
one authorized epoch. Inject old-leader return at every phase.

### Family `durable_ack_boundary`

**Task/purpose.** Determine what survives each failure after an acknowledged
write.

**Response/template.** Surviving version set/guarantee. `Write is acknowledged
after {ackRule}; failure {failure} occurs. What is guaranteed to survive?`

**Derivation.** Mark durable copies reached before acknowledgement; remove
failed volatile/process/disk/domain state; inspect remaining copies.

**Constraints/rejection.** Storage layers and failure scope displayed; no real
hardware claims.

**Difficulty.** L1 memory versus durable log; L2 one replica; L3 rack loss; L4
batched flush with exact cut point.

**Distractors/feedback.** Equate accepted with durable, count volatile buffer as
disk, or ignore correlated domain loss.

**Examples.** (1) ack before durable flush, process crashes →not guaranteed,
L1. (2) ack after two durable replicas, one host fails →one survives, L2. (3)
both replicas in failed rack →none despite RF2, L3.

**Implementation/validation/coverage.** Provenance graph from version to
durability/domain; enumerate failure sets.

### Family `transaction_boundary_audit`

**Task/purpose.** Identify which invariants are atomic under displayed local
transaction boundaries.

**Response/template.** Invariant selection and failure state. `Operations
{steps} use transactions {boundaries}; failure occurs after {step}.`

**Derivation.** Commit/rollback each local transaction; external calls/messages
remain separate unless outbox or atomic primitive is explicitly modeled.

**Constraints/rejection.** At most three resources; no mythical cross-resource
atomicity.

**Difficulty.** L1 one store; L2 store plus message; L3 transactional outbox;
L4 retry/recovery worker.

**Distractors/feedback.** Assume function scope is transaction, assume message
publish rolls back with DB, or overlook committed outbox row.

**Examples.** (1) two DB rows in one transaction →both or neither, L1. (2) DB
commit then publish fails →DB changed/no message, L2. (3) DB update+outbox row
one transaction; relay retries →intent persists, L3.

**Implementation/validation/coverage.** Transaction/event reducer; enumerate
failure after each step and verify invariants.

### Family `saga_compensation_trace`

**Task/purpose.** Trace a bounded multi-service workflow and its compensations.

**Response/template.** Ordered states/actions. `Run saga {steps}; step {failure}
fails under compensation policy {policy}.`

**Derivation.** Commit each successful local step; on failure run declared
compensations in reverse or orchestrator order; compensations are new actions,
not time reversal.

**Constraints/rejection.** Compensations and their failure/idempotency behavior
explicit; no claim of isolation.

**Difficulty.** L2 two steps; L3 three with reverse compensation; L4 duplicate
compensation or compensation failure.

**Distractors/feedback.** Roll back remote state automatically, compensate
uncommitted step, or assume compensation restores every external observation.

**Examples.** (1) reserve then charge fails →release reservation, L2. (2)
reserve+charge succeed, shipment fails →refund then release, L3. (3) duplicate
refund command with idempotency ID →one refund effect, L4.

**Implementation/validation/coverage.** Workflow state machine; failure
injection at every boundary and idempotency invariant.

### Family `conflict_resolution_trace`

**Task/purpose.** Resolve concurrent versions using a supplied deterministic
policy and identify information loss.

**Response/template.** Winning/merged value plus discarded fields. `Resolve
versions {versions} using {resolver}.`

**Derivation.** Apply displayed last-sequence, fieldwise-max, set-union, or
application merge; never invent timestamp trust.

**Constraints/rejection.** Resolver total and deterministic; wall-clock
last-write-wins only with supplied comparable timestamps/tie rule.

**Difficulty.** L2 one field; L3 multi-field loss; L4 merge is non-commutative
and order shown.

**Distractors/feedback.** Merge values under last-writer policy, pick arrival
order instead of version metadata, or call convergence correctness.

**Examples.** (1) sequence7 beats6 →v7, L2. (2) set union `{A}` and `{B}` →
`{A,B}`, L2. (3) whole-object LWW keeps newer name but discards concurrent
phone update, L3.

**Implementation/validation/coverage.** Pure resolver functions; test
determinism and declared commutativity/idempotence properties only.

### Cross-family progression

Copies and storage cost precede quorum sets. Lag traces precede consistency
classification and failover. Acknowledgement boundaries precede transaction and
saga questions. Conflict resolution is introduced only after the learner
accepts that convergence and preservation of intent are different properties.

## 6. Category: Queues, streams, retries, and flow control

### Category purpose

Train exact reasoning about asynchronous work accumulation, delivery attempts,
ordering scope, duplicate effects, and overload controls.

### Learn

A queue separates production from consumption but does not remove work.
Backlog grows when arrivals exceed completions. Delivery and processing are
different events; acknowledgement loss can create duplicates. Ordering is
limited to its declared key/partition. Retries consume capacity and must be
bounded.

### Prerequisites and boundaries

Requires request/event tracing and idempotency. Networking owns transport
retransmission. This category models application messages and workers.

### Family `queue_backlog_evolution`

**Task/purpose.** Compute backlog over piecewise-constant arrival and service
intervals.

**Response/template.** Backlog table. `Starting backlog {b0}, process intervals
{arrivalRate,serviceRate,duration}.`

**Derivation.** For each interval,
`bNext=max(0,b+(arrival-service)*duration)`; unused capacity cannot make backlog
negative.

**Constraints/rejection.** Deterministic fluid/integer model stated; counts
integral at boundaries.

**Difficulty.** L1 one interval; L2 drain to zero mid-interval; L3 changing
rates; L4 priority queues with independent supplied service shares.

**Distractors/feedback.** Subtract service before adding arrivals incorrectly,
allow negative backlog, or average rates across a boundary. Show interval table.

**Examples.** (1) 10/s in,8/s out for10 s →20, L1. (2) backlog30, service10/s,
arrival4/s →drains in5 s, L2. (3) +20 then −12 messages over intervals →8, L3.

**Implementation/validation/coverage.** Exact event/fluid cross-check for small
integers; cover growth, steady, partial drain, and empty.

### Family `consumer_capacity_plan`

**Task/purpose.** Find worker count or drain time under declared per-worker
throughput and headroom.

**Response/template.** Integer/duration. `{workers} workers process
{perWorker}; arrivals {rate}; backlog {backlog}. Find stability/drain time or
minimum workers.`

**Derivation.** Total service=`workers*perWorker`; net drain=service-arrival;
apply headroom for planning.

**Constraints/rejection.** Homogeneous workers unless table supplied; service
capacity not treated as guaranteed latency.

**Difficulty.** L1 no arrivals while drain; L2 live arrivals; L3 headroom; L4
mixed worker classes or partition cap.

**Distractors/feedback.** Divide backlog by raw service while arrivals continue,
floor worker count, or ignore ordering-partition limit.

**Examples.** (1) 100 backlog,20/s service,no arrivals →5 s, L1. (2) service30,
arrival10 →net20/s, L2. (3) need120/s with worker40 and25% headroom →4 workers,
L3.

**Implementation/validation/coverage.** Ceiling/rate invariants; generate stable,
unstable, and partition-limited cases.

### Family `delivery_attempt_trace`

**Task/purpose.** Trace delivery, visibility timeout, acknowledgement, and
redelivery.

**Response/template.** Attempt timeline/final queue state. `Process message
{message} with visibility {timeout} and worker events {events}.`

**Derivation.** Hide on delivery; delete on accepted ack; make visible at
deadline otherwise; late ack handling follows displayed policy.

**Constraints/rejection.** Exact event order; one queue profile shown.

**Difficulty.** L1 success; L2 worker failure; L3 ack lost after effect; L4
concurrent late worker and redelivery.

**Distractors/feedback.** Ack at delivery time, assume worker failure erases
message, or assume redelivery means first effect did not occur.

**Examples.** (1) deliver t0, ack t3 before deadline10 →deleted, L1. (2) no ack
→visible t10 and attempt2, L2. (3) effect commits t5, ack lost, redelivery t10
→possible duplicate effect, L3.

**Implementation/validation/coverage.** Discrete-event queue simulator;
exhaustively permute ack/failure/deadline ties using sequence order.

### Family `delivery_semantics_match`

**Task/purpose.** Match a displayed queue/sink protocol to the guarantees it
actually provides.

**Response/template.** Multiple-choice guarantee set. `Under protocol {steps},
which loss/duplicate outcomes remain possible?`

**Derivation.** Enumerate failure cut points and collect effect counts/delivery
counts.

**Constraints/rejection.** Use bounded labels; never offer unqualified
end-to-end exactly-once as correct.

**Difficulty.** L2 at-most/at-least once; L3 idempotent sink; L4 producer
transaction plus consumer dedupe boundary.

**Distractors/feedback.** Conflate delivery with effect, or name at-least-once
as “no loss and no duplicates.” Feedback gives a concrete failure witness.

**Examples.** (1) delete-before-process →loss possible, no redelivery, L2. (2)
process-before-ack →duplicate possible, L2. (3) duplicate deliveries plus atomic
operation-ID table/effect →one committed effect, L3.

**Implementation/validation/coverage.** Failure-state exploration; each claimed
possibility requires a generated witness.

### Family `retry_schedule_amplification`

**Task/purpose.** Calculate retry times and total downstream attempts under a
displayed bounded policy.

**Response/template.** Ordered times plus attempt count. `Initial call at
{t0}; retry policy {base,multiplier,cap,maxAttempts,jitterValues}.`

**Derivation.** Apply delays after each failed attempt, cap before adding
supplied jitter under declared convention; count nested layer retries by
explicit call tree.

**Constraints/rejection.** Jitter values supplied, not random learner guesses;
maximum attempts includes/excludes initial as explicitly labeled.

**Difficulty.** L1 fixed delay; L2 exponential/cap; L3 supplied jitter; L4
two-layer retry amplification.

**Distractors/feedback.** Retry immediately, apply cap after jitter incorrectly,
or add retry counts rather than multiply nested attempts. Show attempt tree.

**Examples.** (1) delays1,2,4 s from t0 →attempts at0,1,3,7, L2. (2) cap4 gives
delays1,2,4,4, L2. (3) 3 gateway attempts each allowing2 store attempts →up to6
store calls, L4.

**Implementation/validation/coverage.** Pure schedule generator plus call-tree
count; boundaries at cap and max attempts.

### Family `poison_message_dead_letter`

**Task/purpose.** Determine when a repeatedly failing message moves to a
dead-letter queue and what remains queued.

**Response/template.** Attempt/status table. `Message fails according to
{outcomes}; policy is {maxAttempts,thresholdConvention}.`

**Derivation.** Increment attempt on delivery; ack success; after configured
failed attempt move atomically to DLQ; otherwise reschedule.

**Constraints/rejection.** Convention wording exact; DLQ is not described as
automatic repair.

**Difficulty.** L1 consecutive failure; L2 eventual success; L3 mixed messages;
L4 replay from DLQ with new operation ID policy.

**Distractors/feedback.** Off-by-one threshold, block whole queue forever, or
assume DLQ means discarded. Show attempt counter.

**Examples.** (1) max3, failures1–3 →DLQ after third, L1. (2) fail twice then
succeed →acked, not DLQ, L2. (3) poison A and healthy B with independent
delivery →B can complete, L3.

**Implementation/validation/coverage.** State-machine boundary tests for
max−1/max/max+1 and interleaved messages.

### Family `ordering_partition_trace`

**Task/purpose.** Reconstruct guaranteed and unconstrained message order by
ordering key/partition.

**Response/template.** Per-key sequences plus valid global-order choice.
`Published messages {messages} map to {partitions}; deliveries are {events}.`

**Derivation.** Preserve order only inside guaranteed scope; enumerate valid
interleavings across scopes.

**Constraints/rejection.** Producer order and partition assignment explicit;
no claim that timestamps impose broker order.

**Difficulty.** L1 one partition; L2 two keys; L3 retry blocks/reorders under
displayed policy; L4 repartition boundary with epoch.

**Distractors/feedback.** Impose global order, order by payload timestamp, or
allow same-key inversion when forbidden.

**Examples.** (1) A1,A2 same key →A1 before A2, L1. (2) A1/B1 on distinct
partitions →either global interleaving, L2. (3) displayed delivery B1,A1,B2,A2
preserves both per-key orders, valid, L3.

**Implementation/validation/coverage.** Partial-order DAG and topological-order
oracle; generate valid/invalid candidates.

### Family `deduplication_window`

**Task/purpose.** Count committed effects when duplicate operation IDs arrive
inside or outside a retention window.

**Response/template.** Effect count/final dedupe table. `Process deliveries
{events} with dedupe retention {window}.`

**Derivation.** Atomically check-and-record ID with expiry; duplicate valid
record skips effect; expired record permits a new effect under the profile.

**Constraints/rejection.** Scope and expiry half-open; effect+record atomicity
stated.

**Difficulty.** L2 sequential duplicate; L3 exact expiry boundary; L4 tenant
scope or non-atomic counterexample.

**Distractors/feedback.** Dedupe forever, refresh retention on duplicate without
policy, or dedupe same ID across wrong scope.

**Examples.** (1) ID7 at t0/t5, window10 →one effect, L2. (2) second at t10 →
record expired, second effect, L3. (3) tenant A/B both ID7 with tenant scope →
two effects, L4.

**Implementation/validation/coverage.** Atomic map reducer and expiry boundary
tests; balance duplicate timing and scopes.

### Family `backpressure_policy_trace`

**Task/purpose.** Apply bounded admission, queue, shedding, or producer-throttle
rules under overload.

**Response/template.** Accepted/queued/rejected counts and state. `At events
{arrivals}, apply policy {limits}.`

**Derivation.** Follow token/slot/queue limits and displayed priority; never
accept more than capacity.

**Constraints/rejection.** User-facing consequences described neutrally; no
universal policy recommendation.

**Difficulty.** L1 fixed queue limit; L2 priority classes; L3 producer feedback
delay; L4 compare overload policies against explicit loss/latency requirement.

**Distractors/feedback.** Let queue grow despite bound, drop high priority first,
or call buffering additional capacity. Show occupancy and decision per event.

**Examples.** (1) capacity2 full, one arrival →reject/queue per displayed rule,
L1. (2) queue3 with low-priority eviction admits high-priority request by
evicting one low, L2. (3) requirement caps waiting at100 ms →unbounded queue
candidate violates it, L4.

**Implementation/validation/coverage.** Admission state machine; invariants on
occupancy and priority. Cover shed, queue, block, and throttle.

### Cross-family progression

Backlog arithmetic precedes worker planning. Delivery attempts precede semantic
guarantee classification. Retry schedules precede poison-message and
deduplication interactions. Ordering and backpressure remain separate until
advanced integrated queue cases.

## 7. Category: Reliability, failure domains, and recovery

### Category purpose

Train explicit failure modeling and selection of bounded resilience mechanisms
without treating redundancy or retries as free reliability.

### Learn

Name the failure first. Redundancy helps only when copies do not share the
failed dependency and the system can route to a healthy copy. Timeouts bound
waiting, retries add load, circuit breakers stop repeated calls, and bulkheads
limit blast radius. Recovery objectives concern time and data loss, not merely
backup existence.

### Prerequisites and boundaries

Requires capacity and state categories. Probability supplies general
probability theory. This category uses only supplied independent or explicit
failure-domain models.

### Family `serial_dependency_availability`

**Task/purpose.** Compute availability of a required serial dependency path.

**Response/template.** Probability/percent. `Required components have independent
availabilities {values}. Find path availability.`

**Derivation.** Multiply exact availability fractions.

**Constraints/rejection.** Independence explicitly stated; optional dependencies
excluded from path.

**Difficulty.** L1 two; L2 three; L3 conditional optional path; L4 compare
architectures with shared dependency represented explicitly.

**Distractors/feedback.** Add unavailabilities without overlap correction,
average availability, or include async optional component.

**Examples.** (1) .99×.99=.9801, L1. (2) .999×.99=.98901, L2. (3) email service
not required for checkout response →exclude it, L3.

**Implementation/validation/coverage.** Exact rational multiplication; compare
to enumerated independent-state space for small cases.

### Family `redundant_component_availability`

**Task/purpose.** Compute availability when any explicitly independent replica
is sufficient.

**Response/template.** Probability/percent. `{n} independent replicas each
availability {a}; any one suffices.`

**Derivation.** `1-(1-a)^n`; compose with required load balancer only when shown.

**Constraints/rejection.** Capacity under failures verified separately; no
shared domains hidden.

**Difficulty.** L1 two replicas; L2 include required balancer; L3 k-of-n state
enumeration; L4 compare independent versus shared-domain model.

**Distractors/feedback.** Multiply availabilities as serial, add above100%, or
ignore front-door dependency. Show complement event.

**Examples.** (1) two at.9 →.99, L1. (2) replica tier.99 behind LB.99 →
path.9801, L2. (3) both replicas same failed rack →explicit domain can make both
unavailable, L4.

**Implementation/validation/coverage.** Binomial/state enumeration for small n;
cover any-one and displayed k-of-n thresholds.

### Family `failure_domain_survival`

**Task/purpose.** Determine which functions/data survive a host, rack, zone, or
region failure from placement.

**Response/template.** Surviving component/function set. `Placement is {map};
failure removes {domain}.`

**Derivation.** Remove every component in failed domain, then test service
capacity, required paths, and replica count.

**Constraints/rejection.** Hierarchy explicit; no geographical claims.

**Difficulty.** L1 host; L2 rack; L3 correlated zone plus capacity; L4 control
plane/shared identity dependency.

**Distractors/feedback.** Count copies without placement, assume different hosts
mean different racks, or ignore quorum/capacity after failure.

**Examples.** (1) three copies on three hosts same rack; rack fails →none, L2.
(2) copies in zones A/B/C, zoneB fails →two remain, L2. (3) compute survives but
single identity service in failed zone →request path unavailable, L4.

**Implementation/validation/coverage.** Placement tree deletion and service
predicate; cover hidden shared dependencies.

### Family `timeout_budget_propagation`

**Task/purpose.** Allocate/check nested timeout deadlines and identify impossible
retry plans.

**Response/template.** Remaining duration/validity. `Caller deadline {D};
overheads/callee attempts {plan}. Does plan fit?`

**Derivation.** Subtract elapsed and required response/cleanup margin; nested
timeout must not exceed remaining caller budget under profile.

**Constraints/rejection.** Deterministic costs; not a percentile prediction.

**Difficulty.** L1 one callee; L2 two serial calls; L3 retry/backoff; L4 shared
absolute deadline across fan-out.

**Distractors/feedback.** Give every layer full outer timeout, omit backoff, or
reset absolute deadline on retry.

**Examples.** (1) caller100 ms, 10 ms spent →≤90 ms remains, L1. (2) two
40 ms calls plus15 ms overhead fit100 ms →5 ms margin, L2. (3) attempts40+40
with30 ms backoff →110 ms, cannot fit100, L3.

**Implementation/validation/coverage.** Deadline arithmetic and interval
simulation; test exact-boundary policy.

### Family `retry_load_amplification`

**Task/purpose.** Compute added downstream load during a failure and determine
capacity feasibility.

**Response/template.** Attempt rate and overload status. `Base rate {r},
failure fraction {f}, retries {policy}; downstream capacity {c}.`

**Derivation.** Construct attempt tree using each layer's max attempts and
failure routing; compare rate with capacity.

**Constraints/rejection.** Correlation and success-on-retry rule supplied; no
steady-state assumption hidden.

**Difficulty.** L1 one retry; L2 fractional failures; L3 nested retries; L4
retry budget/token limit.

**Distractors/feedback.** Add retry counts across layers, retry successes, or
compare user-request rate with attempt capacity.

**Examples.** (1) 100/s all fail and one retry →200 attempts/s, L1. (2) 20% of
1000/s retry once →1200/s, L2. (3) 3 outer×2 inner max →6 downstream attempts
per user request, L3.

**Implementation/validation/coverage.** Call-tree simulator and conservation;
cover partial, total, nested, and capped amplification.

### Family `retry_safety_decision`

**Task/purpose.** Decide whether retry is safe under the displayed operation and
deduplication/transaction boundary.

**Response/template.** Safe/unsafe/conditional plus reason ID. `Caller times out
during operation {operation}; may it retry under {controls}?`

**Derivation.** Check whether repeated execution has same effect naturally or
is deduplicated atomically; unknown completion alone is not safety.

**Constraints/rejection.** Exactly one modeled effect; HTTP method names not
used as sole proof.

**Difficulty.** L1 read; L2 non-idempotent append; L3 idempotency key; L4
partial multi-step effect.

**Distractors/feedback.** “Timeout means nothing happened,” “all reads are
safe” despite read side effect, or key stored non-atomically.

**Examples.** (1) pure lookup →safe, L1. (2) increment balance without key →
unsafe duplicate, L2. (3) create with atomic idempotency record →safe to retry
under scope/window, L3.

**Implementation/validation/coverage.** Effect model and duplicate execution
property; include naturally idempotent and controlled cases.

### Family `circuit_breaker_trace`

**Task/purpose.** Trace closed/open/half-open breaker states and admitted calls.

**Response/template.** State/call outcome timeline. `Apply outcomes {events}
under breaker {threshold,openDuration,probeRule}.`

**Derivation.** Update failure counter/window, open at threshold, reject while
open, allow declared probes after timer, close/reset or reopen by result.

**Constraints/rejection.** Exact threshold/window semantics supplied; breaker
does not count as callee recovery.

**Difficulty.** L2 consecutive threshold; L3 rolling window; L4 half-open
concurrency/tie ordering.

**Distractors/feedback.** Send calls while open, close merely because timer
ends, or confuse rejected call with downstream failure.

**Examples.** (1) threshold3, three failures →open, L2. (2) call during open
→rejected locally, L2. (3) successful half-open probe →closed/reset, L3.

**Implementation/validation/coverage.** State machine with boundary tests and
event-order permutations.

### Family `bulkhead_capacity`

**Task/purpose.** Determine which workload classes remain serviceable with
separate or shared capacity pools.

**Response/template.** Served/queued/rejected counts by class. `Capacity pools
{pools}; arrivals {classes}; allocation policy {policy}.`

**Derivation.** Allocate only from allowed pool/reserve; compare with shared-pool
alternative.

**Constraints/rejection.** Static bounded interval; no scheduling inference.

**Difficulty.** L2 two pools; L3 borrowable reserve; L4 candidate allocation
against priority requirements.

**Distractors/feedback.** Let one class consume isolated slots, count idle
reserved capacity as failure, or claim isolation adds total capacity.

**Examples.** (1) A pool3 receives5, B pool2 receives1 →A serves3 while B serves1,
L2. (2) shared pool5 and A arrives5 first →B may get0 under FIFO, L3. (3)
require at least2 B slots →dedicated reserve satisfies it, L4.

**Implementation/validation/coverage.** Allocation reducer; invariants per pool
and requirement. Balance utilization/isolation trade-offs.

### Family `rto_rpo_schedule`

**Task/purpose.** Calculate actual recovery time and maximum data-loss window
from a supplied failure/backup/replication schedule.

**Response/template.** Durations plus target pass/fail. `Failure at {time};
restore completes {restore}; latest recoverable point {checkpoint}.`

**Derivation.** Actual recovery=`restore-ready-failure`; data-loss age=`failure
- latest recoverable commit/checkpoint`; compare with RTO/RPO.

**Constraints/rejection.** Clock times and commit semantics explicit; backup
existence alone does not imply restore success unless verified in case.

**Difficulty.** L1 direct; L2 periodic snapshots; L3 snapshot+log replay; L4
choose plan satisfying both objectives.

**Distractors/feedback.** Swap RTO/RPO, measure RPO as restore duration, or use
next scheduled backup after failure.

**Examples.** (1) fail10:00, restore10:20 →20 min RTO actual, L1. (2) latest
checkpoint09:45 →15 min data-loss window, L1. (3) targets RTO30/RPO5 with
20/15 actual →RTO pass, RPO fail, L2.

**Implementation/validation/coverage.** Timeline arithmetic and exact boundaries;
vary failure relative to snapshot/replay.

### Family `graceful_degradation_choice`

**Task/purpose.** Select a degraded response plan that preserves stated core
requirements during dependency failure.

**Response/template.** Candidate plan plus lost feature set. `Dependency
{failure} is unavailable; which plan satisfies {coreRequirements}?`

**Derivation.** Remove failed capabilities and test each candidate's required
data, safety, staleness, and response behavior.

**Constraints/rejection.** One feasible plan or accepted set; no unsafe
fail-open default.

**Difficulty.** L1 optional recommendation unavailable; L2 stale bounded cache;
L3 authorization/payment-like fail-closed requirement; L4 multiple failures and
priority tiers.

**Distractors/feedback.** Return fabricated data, fail open on required
authorization, or take whole service down despite valid core path. Quote core
requirement.

**Examples.** (1) recommendations fail; product lookup works →omit
recommendations, L1. (2) profile store fails; cache age5 min allowed10 →serve
cache, L2. (3) authorization unavailable and policy requires confirmed allow →
deny/defer, not fail open, L3.

**Implementation/validation/coverage.** Capability dependency graph and
requirement predicates; balance partial/full and stale-data cases.

### Cross-family progression

Serial and redundant arithmetic precede explicit failure domains. Timeout and
retry load precede retry safety and circuit breakers. Bulkheads and graceful
degradation follow capacity isolation. RTO/RPO remains separate from ordinary
request availability until integrated cases.

## 8. Category: SLOs, observability, and change safety

### Category purpose

Train selection and interpretation of evidence that connects user-visible
reliability to system behavior and safe changes.

### Learn

An SLI measures an outcome; an SLO sets a target over a window; the error budget
quantifies allowed bad outcomes. Metrics summarize, logs record events, and
traces connect work across a request. Monitoring should distinguish symptoms
from causes. A canary is useful only with comparable populations, sufficient
data, and a decision rule.

### Prerequisites and boundaries

Requires rate, percentile, and reliability concepts. This is not a vendor
monitoring/configuration lab and does not teach open-ended incident management.

### Family `sli_definition_select`

**Task/purpose.** Select the SLI definition that most directly measures a stated
user outcome.

**Response/template.** Single choice plus scope fields. `For user need {need},
choose the best SLI from {candidates}.`

**Derivation.** Compare event population, success criterion, observation point,
threshold, and window with the need.

**Constraints/rejection.** Unique best candidate; proxy metrics may be useful
causes but not the selected user SLI.

**Difficulty.** L1 success ratio; L2 latency/freshness; L3 client versus server
observation; L4 multi-stage pipeline completeness.

**Distractors/feedback.** CPU usage, internal queue depth, average latency for a
tail need, or denominator excluding failures.

**Examples.** (1) “successful checkouts” →successful eligible checkouts/eligible
attempts, L1. (2) “99% visible in60s” →freshness threshold SLI, L2. (3) server
200 rate excludes client timeouts →not sufficient for user success, L3.

**Implementation/validation/coverage.** Typed SLI predicates; balance success,
latency, freshness, correctness, completeness.

### Family `error_budget_calculation`

**Task/purpose.** Compute allowed bad events, remaining budget, and compliance.

**Response/template.** Named integer/percent fields. `SLO {S} over {T} eligible
events; observed bad {B}.`

**Derivation.** Use topic SLO formulas and displayed floor/rounding.

**Constraints/rejection.** Denominator and exclusions explicit; avoid floating
ambiguity at boundary.

**Difficulty.** L1 integer percent; L2 99.x%; L3 excluded events; L4 combine
separate SLO populations without averaging percentages.

**Distractors/feedback.** Treat target as allowed-bad rate, subtract bad from
total instead of budget, or use all traffic despite exclusions.

**Examples.** (1) 99%,1000 →10 allowed; 7 bad →3 remain, L1. (2) 99.9%,10,000
→10 allowed, L2. (3) 12 bad with allowance10 →budget exceeded by2, L2.

**Implementation/validation/coverage.** Integer/rational oracle and threshold
fixtures; vary exclusion filters and exact boundaries.

### Family `burn_rate_window`

**Task/purpose.** Calculate error-budget burn rate from observed bad-event rate.

**Response/template.** Decimal multiple plus status. `SLO allows {allowedRate};
window observed {bad}/{total}. Find burn rate.`

**Derivation.** Observed bad fraction divided by allowed bad fraction.

**Constraints/rejection.** Positive nonzero budget; low-traffic interpretation
questions supply a policy rather than infer alerting.

**Difficulty.** L2 direct; L3 multiple windows; L4 choose which displayed alert
condition fires.

**Distractors/feedback.** Use success rate numerator, subtract rates, or call
1× healthy regardless of duration. Show fraction ratio.

**Examples.** (1) allowed1%, observed2% →2×, L2. (2) allowed0.1%, observed1% →
10×, L2. (3) short5×/long0.5× does not meet displayed both-window 2×/1× rule,
L4.

**Implementation/validation/coverage.** Exact rational ratios; cover below,
equal, and above1 plus multiwindow decisions.

### Family `telemetry_signal_choice`

**Task/purpose.** Choose metric, log, trace, or combined evidence for a concrete
question.

**Response/template.** Signal set/matching. `Which signal best answers
{diagnosticQuestion} under {availableFields}?`

**Derivation.** Metrics aggregate rates/distributions, logs expose individual
events, traces connect causal request spans; choose minimal sufficient set.

**Constraints/rejection.** Available instrumentation declared; no claim that
one signal is universally superior.

**Difficulty.** L1 identify role; L2 choose evidence; L3 correlation IDs and
cardinality; L4 missing instrumentation.

**Distractors/feedback.** Use aggregate metric to recover one request, scan logs
for fleet percentile, or infer cross-service path without context propagation.

**Examples.** (1) fleet error rate over hour →metric, L1. (2) exact exception
payload for request ID →log, L1. (3) where one request spent time across
services →trace, L2.

**Implementation/validation/coverage.** Evidence capability matrix; accept
combined set only when required and balance all signals.

### Family `distributed_trace_critical_path`

**Task/purpose.** Reconstruct parent/child spans and compute deterministic
critical path/wait time.

**Response/template.** Span path plus duration. `Trace spans {spans}; identify
critical response path and concurrency.`

**Derivation.** Validate trace/parent IDs and intervals; required parallel
children contribute their union/maximum to parent wait, not sum.

**Constraints/rejection.** Complete bounded trace; clock domain already
normalized; async detached spans labeled.

**Difficulty.** L1 chain; L2 siblings; L3 async span; L4 missing parent/context
break detection.

**Distractors/feedback.** Sum overlapping spans, include detached work, or order
only by row display. Show interval diagram.

**Examples.** (1) root0–100, child10–60 →root100 ms, child50, L1. (2) required
children10–50 and20–80 →parallel branch ends80, L2. (3) async audit80–200 after
response100 →not response critical path, L3.

**Implementation/validation/coverage.** Interval DAG oracle; verify containment
or declared links and cover overlap shapes.

### Family `metric_aggregation_interpretation`

**Task/purpose.** Compute a displayed aggregate correctly and reject invalid
aggregation.

**Response/template.** Numeric or `cannot determine`. `Instances report
{counts/sums/averages/percentiles}; find fleet value requested.`

**Derivation.** Aggregate counters by sums, averages by weighted numerator/count
when available, and percentiles only from raw/histogram data sufficient under
profile.

**Constraints/rejection.** Data sufficiency explicit; never average percentiles
as a canonical fleet percentile.

**Difficulty.** L1 counters; L2 weighted average; L3 histogram percentile; L4
insufficient per-instance percentiles.

**Distractors/feedback.** Unweighted average with unequal counts, sum gauges, or
average p99s. Show reconstructable numerator/denominator.

**Examples.** (1) errors3+5 →8, L1. (2) latencies avg10 for100 calls and20 for
300 →17.5 weighted, L2. (3) only two p99 values →fleet p99 cannot be determined,
L4.

**Implementation/validation/coverage.** Typed metric algebra and raw-sample
cross-check. Regularly include underdetermined cases.

### Family `alert_evidence_action`

**Task/purpose.** Select the alert/next observation that is actionable and tied
to a stated symptom.

**Response/template.** Choice. `Given SLO symptom {symptom} and evidence
{signals}, which alert or next check best distinguishes {hypotheses}?`

**Derivation.** Prefer user-impact/SLO evidence for paging and a measurement
that differs across hypotheses for diagnosis.

**Constraints/rejection.** No universal threshold; response action and owner
supplied; one choice uniquely discriminates.

**Difficulty.** L2 symptom versus cause; L3 two hypotheses; L4 missing coverage
or alert noise history.

**Distractors/feedback.** Page on idle CPU, alert with no action, or inspect a
signal equal under both hypotheses.

**Examples.** (1) queue depth high but SLO unaffected →diagnostic/ticket per
displayed policy, not automatic page, L2. (2) latency SLO burns and DB time rose
in traces →DB evidence is useful cause check, L3. (3) distinguish network versus
CPU with per-edge trace time versus CPU saturation, L3.

**Implementation/validation/coverage.** Hypothesis/evidence truth matrix;
validate one information-gaining observation.

### Family `canary_comparison`

**Task/purpose.** Compare baseline and canary counts/rates against a declared
promotion rule.

**Response/template.** Promote/hold/rollback/insufficient-data plus calculations.
`Baseline {data}; canary {data}; rule {rule}.`

**Derivation.** Apply exact rate/latency threshold and minimum sample/time
conditions; normalize for workload class if supplied.

**Constraints/rejection.** No statistical significance inferred unless a
specific test belongs to Probability and Statistics and is supplied.

**Difficulty.** L1 simple threshold; L2 minimum sample; L3 workload mismatch;
L4 several guardrail metrics.

**Distractors/feedback.** Compare raw error counts with unequal traffic, promote
on too few samples, or ignore one hard guardrail.

**Examples.** (1) baseline1% errors, canary1.1%, limit+0.5 points →pass, L1. (2)
canary has20 requests, minimum1000 →insufficient, L2. (3) errors pass but latency
guardrail fails →rollback/hold per rule, L3.

**Implementation/validation/coverage.** Exact decision predicate; generate each
terminal decision and boundary equality.

### Family `rollout_state_trace`

**Task/purpose.** Trace version populations and safe rollback/forward movement
under a staged rollout.

**Response/template.** Version counts/status. `Apply rollout events {events} to
{instances} under {maxUnavailable,maxSurge,compatibility}.`

**Derivation.** Start/stop/ready instances in order, enforce capacity limits and
API/data compatibility at mixed-version periods.

**Constraints/rejection.** Simplified provider-neutral controller; no container
platform commands.

**Difficulty.** L2 rolling replacement; L3 surge/unavailable bounds; L4 schema
compatibility blocks rollback.

**Distractors/feedback.** Count starting as ready, exceed unavailable cap, or
assume rollback after irreversible schema change.

**Examples.** (1) 4 instances, maxUnavailable1 →at least3 ready, L2. (2)
maxSurge1 permits5 total during replacement, L3. (3) new writer emits format
old reader rejects →mixed rollout invalid until compatibility step, L4.

**Implementation/validation/coverage.** Rollout state machine and invariants;
inject readiness failure at each stage.

### Family `incident_evidence_timeline`

**Task/purpose.** Identify the earliest supported failure or next discriminating
observation from a bounded incident timeline.

**Response/template.** Event/component/evidence choice. `Timeline {changes,
symptoms,telemetry}; which conclusion is supported?`

**Derivation.** Respect timestamps and correlation versus causation; trace first
failed state transition; return unknown when evidence cannot distinguish.

**Constraints/rejection.** Synthetic incidents only; no blame/personnel
judgment; unique supported conclusion or explicit underdetermination.

**Difficulty.** L2 one change; L3 coincident irrelevant change; L4 missing
telemetry and competing hypotheses.

**Distractors/feedback.** Blame latest deployment solely by proximity, select
downstream symptom as root transition, or assert cause from correlation.

**Examples.** (1) DB errors start before API latency →DB failure is earlier
observed transition, L2. (2) deploy and traffic spike coincide; no comparative
evidence →cause undetermined, L4. (3) rollback restores only canary while
baseline remained healthy →supports canary regression under case model, L3.

**Implementation/validation/coverage.** Causal case DAG with evidence visibility;
validate every accepted conclusion is entailed and distractor is not.

### Cross-family progression

Define SLIs before calculating budgets and burn. Learn signal capabilities
before traces and aggregation. Canary decisions precede rollout state. Incident
evidence is last because it combines symptoms, causes, changes, and missing
information.

## 9. Category: Security, cost, and integrated architecture decisions

### Category purpose

Train bounded cross-cutting audits: who may do what, where isolation can fail,
what a design costs under a supplied model, and whether a complete candidate
actually satisfies its requirements.

### Learn

Authentication establishes an identity; authorization decides an action.
Trust boundaries mark where assumptions and validation change. Tenant identity
must propagate to every shared resource. Cost, reliability, latency,
consistency, and complexity are trade-offs constrained by requirements, not
universal rankings. If requirements do not distinguish two designs, the correct
answer may be “cannot determine.”

### Prerequisites and boundaries

Requires all preceding categories. Security questions are defensive semantic
audits using synthetic data and policies. Cost questions use fictional fixed
rates and never current provider pricing.

### Family `trust_boundary_data_flow`

**Task/purpose.** Mark trust-boundary crossings and required validation/context
on a displayed data flow.

**Response/template.** Edge set plus control matching. `For flow {graph}, mark
edges crossing {trustZones} and match required controls {controls}.`

**Derivation.** Compare source/destination zone; apply supplied policy for
authentication, schema validation, encryption, or redaction.

**Constraints/rejection.** Policies explicit; crossing does not automatically
mean unsafe.

**Difficulty.** L1 external→internal; L2 service zones; L3 queue/object-store
handoff; L4 telemetry/export boundary.

**Distractors/feedback.** Trust all internal traffic, validate only at UI, or
encrypt without authenticating when policy requires identity. Show zone edge.

**Examples.** (1) public client→gateway crosses boundary, L1. (2) trusted
service→restricted data zone crosses a stricter boundary, L2. (3) redacted logs
may cross export boundary while raw secrets may not, L3.

**Implementation/validation/coverage.** Zone graph cut computation and policy
predicate; cover ingress, egress, async, telemetry.

### Family `authentication_authorization_trace`

**Task/purpose.** Trace identity verification and resource/action authorization.

**Response/template.** Authenticated identity, decision, and deciding policy.
`Request {request} carries {credential}; policies {policies}.`

**Derivation.** Validate credential under supplied issuer/audience/expiry rules,
then evaluate action/resource/tenant policy; distinguish failures.

**Constraints/rejection.** No real tokens/secrets; signature arithmetic absent;
default deny when policy says so.

**Difficulty.** L1 valid identity; L2 role/action; L3 delegated service identity;
L4 authenticated but wrong tenant/resource scope.

**Distractors/feedback.** Treat authenticated as authorized, use caller-supplied
role without validation, or authorize by UI visibility.

**Examples.** (1) invalid credential →authentication failure, L1. (2) valid
viewer tries delete →authenticated but unauthorized, L2. (3) service token valid
for tenantA used on tenantB →scope denial, L4.

**Implementation/validation/coverage.** Credential predicate then policy engine;
balance authn/authz and scope reasons.

### Family `least_privilege_policy`

**Task/purpose.** Select the smallest permission set satisfying declared service
operations.

**Response/template.** Permission set. `Workload performs {operations};
candidate policies {policies}. Choose least sufficient.`

**Derivation.** Map operations to required actions/resources and choose set
covering all with minimum extras under declared ordering.

**Constraints/rejection.** Unique minimum or accepted ties; no provider IAM
syntax.

**Difficulty.** L1 action only; L2 resource scope; L3 read/write separation; L4
temporary workflow stage.

**Distractors/feedback.** Administrator wildcard, missing one required action,
or correct action on all tenants. Show required-versus-granted matrix.

**Examples.** (1) read object X →`read:X`, L1. (2) consume queue Q and ack →
`receive:Q,ack:Q`, not publish, L2. (3) worker writes only tenantA prefix →
scoped write beats global write, L3.

**Implementation/validation/coverage.** Set-cover over tiny policy sets;
explicit tie handling and excess-permission diagnostics.

### Family `tenant_isolation_audit`

**Task/purpose.** Detect a cross-tenant data path caused by missing scoping.

**Response/template.** Faulty component/field and leaked result set. `Trace
tenant requests through {queries,cacheKeys,queueMessages,objectPaths}.`

**Derivation.** Propagate trusted tenant ID; apply each key/filter/path; flag any
resource lookup lacking or replacing required scope.

**Constraints/rejection.** Synthetic identifiers; no exploit instructions;
exact one primary fault in normal cases.

**Difficulty.** L2 missing DB filter; L3 cache key collision; L4 async message or
shared object prefix.

**Distractors/feedback.** Trust request body tenant, scope database but not
cache, or assume separate UI routes isolate data.

**Examples.** (1) query `WHERE id=?` without tenant predicate returns another
tenant row, L2. (2) cache key `profile:{userId}` collides across tenants →
isolation fault, L3. (3) message carries server-derived tenant and worker
filters it correctly →safe under model, L3.

**Implementation/validation/coverage.** Taint/scope propagation oracle; cover
store, cache, queue, object, telemetry.

### Family `token_bucket_rate_limit`

**Task/purpose.** Trace accepted/rejected requests through a deterministic token
bucket.

**Response/template.** Per-request decisions plus final tokens. `Bucket capacity
{B}, refill {r}/s, initial {tokens}; requests {times,costs}.`

**Derivation.** Refill to event time capped at B, then accept iff enough tokens
and subtract cost.

**Constraints/rejection.** Continuous or discrete refill convention stated;
ties use event order.

**Difficulty.** L1 one-cost integer times; L2 bursts; L3 weighted requests; L4
per-tenant plus global bucket.

**Distractors/feedback.** Let tokens exceed capacity, refill after request, or
share tenant buckets incorrectly.

**Examples.** (1) B3 full, four t0 requests →first3 accepted, fourth rejected,
L1. (2) refill1/s, request at t2 restores up to2 tokens, L2. (3) tenant bucket
passes but global empty →request rejected, L4.

**Implementation/validation/coverage.** Exact rational token reducer; boundary
events and nested buckets.

### Family `sensitive_data_path`

**Task/purpose.** Determine which stores/logs/edges may receive fields under a
supplied classification and retention policy.

**Response/template.** Allowed/blocked/redact decisions. `Fields {classes} flow
to {destinations}; apply policy {policy}.`

**Derivation.** Match classification, purpose, region/zone, encryption, and
retention constraints exactly.

**Constraints/rejection.** Fictional data and policy only; no legal compliance
claims.

**Difficulty.** L1 secret excluded from logs; L2 redaction; L3 retention/backup;
L4 derived field with supplied classification.

**Distractors/feedback.** Treat encryption as permission to store anywhere,
redact display but keep raw log, or forget backups inherit retention.

**Examples.** (1) password field policy “never log” →blocked, L1. (2) email may
enter audit only hashed under profile →redact/transform, L2. (3) raw field
deleted but retained backup beyond stated limit →policy violation, L4.

**Implementation/validation/coverage.** Data-flow policy engine; balance
allow/redact/block and lifecycle destinations.

### Family `fictional_resource_cost`

**Task/purpose.** Compute architecture cost from a supplied fictional rate card
and usage.

**Response/template.** Money by component and total. `Usage {usage}; rates
{rateCard}; free tiers/rounding {rules}.`

**Derivation.** Apply units, billing increments, replication/egress/request
counts, then exact rounding in stated order.

**Constraints/rejection.** Currency fictional/currentness disclaimer; no hidden
provider behavior.

**Difficulty.** L1 instance-hours; L2 storage/requests; L3 tiered rate; L4
compare candidates under same workload and SLO.

**Distractors/feedback.** Ignore replicas, confuse GB/GiB, round before tiering,
or omit cross-zone transfer explicitly billed.

**Examples.** (1) 3 units×10 h×€0.20 →€6, L1. (2) 100 GB RF3 billed physical at
€0.02/GB →€6, L2. (3) first1000 requests free, next2000 at€0.001 →€2, L3.

**Implementation/validation/coverage.** Exact decimal/rational billing engine;
reconstruct line-item sum and test tier boundaries.

### Family `single_point_of_failure`

**Task/purpose.** Identify a component/failure domain whose loss breaks a
required function despite apparent replication.

**Response/template.** Component/domain set plus broken requirement. `Audit
architecture {graph} for requirement {function}.`

**Derivation.** Remove each candidate component/domain and evaluate required
path, capacity, and data predicates.

**Constraints/rejection.** “Single point” relative to stated failure set and
function; multiple answers accepted as set when present.

**Difficulty.** L1 obvious singleton; L2 shared balancer/store; L3 control-plane
or identity dependency; L4 capacity falls below peak though path remains.

**Distractors/feedback.** Select any singleton box even if optional, or miss a
shared dependency behind replicated frontends.

**Examples.** (1) two app replicas, one required DB →DB SPOF, L1. (2) replicated
DB behind one required proxy →proxy SPOF, L2. (3) one replica loss leaves
capacity below required peak →capacity SPOF under requirement, L4.

**Implementation/validation/coverage.** Graph cut/failure simulation; distinguish
connectivity, state, authority, and capacity failures.

### Family `requirement_design_match`

**Task/purpose.** Select the candidate architecture that satisfies all explicit
requirements with least declared complexity/cost tie-break.

**Response/template.** Design ID plus requirement matrix. `Requirements
{requirements}; candidate designs {designs}; choose according to {priority}.`

**Derivation.** Evaluate each design with typed predicates; reject any hard
violation; apply displayed ranking only among feasible candidates.

**Constraints/rejection.** Exactly one winner or accepted tie/underdetermined;
no unstated preference for distributed components.

**Difficulty.** L2 one decisive requirement; L3 several hard constraints; L4
trade-off and tie-break; L5 insufficient requirement.

**Distractors/feedback.** Most boxes, highest raw scale despite consistency
failure, cheapest despite SLO violation, or fashionable pattern. Show matrix.

**Examples.** (1) strict single-record consistency selects candidate with
declared linearizable write path, L2. (2) both meet SLO; lower supplied cost wins
only because cost is tie-break, L3. (3) requirements omit freshness and cost,
two candidates differ only there →cannot determine, L5.

**Implementation/validation/coverage.** Predicate matrix and deterministic
ranking; property-test winner uniqueness and regular underdetermination.

### Family `architecture_constraint_audit`

**Task/purpose.** Find the first component/edge that violates one declared
latency, capacity, durability, ordering, isolation, or recovery constraint.

**Response/template.** Violation ID plus witness. `Audit architecture {case}
against constraints {constraints}.`

**Derivation.** Evaluate checks in displayed dependency/order and return all or
first as requested with numeric/state witness.

**Constraints/rejection.** One primary fault in diagnostic mode; multiple faults
only in advanced set response.

**Difficulty.** L2 one layer; L3 propagated overload; L4 interaction such as
retry-induced capacity failure; L5 hidden failure-domain violation.

**Distractors/feedback.** Point at downstream symptom, calculate average not
peak, or apply guarantee to wrong path. Show earliest failed predicate.

**Examples.** (1) required500/s, store max400 →store capacity violation, L2.
(2) cache reduces normal load but cold-start misses exceed backend →cold-path
violation, L3. (3) RF3 all in one zone violates zone-loss durability, L4.

**Implementation/validation/coverage.** Composed case oracle with provenance
from derived values to requirements; inject each fault class.

### Family `system_evolution_step`

**Task/purpose.** Choose the smallest staged change that resolves an observed
bottleneck/requirement while preserving current invariants.

**Response/template.** Change ID and before/after effect. `Current system
{system}; evidence {evidence}; candidate next steps {changes}.`

**Derivation.** Apply each change's modeled effects and migration preconditions;
select feasible change satisfying target and stated simplicity/cost ordering.

**Constraints/rejection.** Evidence identifies a bounded problem; candidates
have explicit effects; no universal growth roadmap.

**Difficulty.** L2 add capacity at actual bottleneck; L3 cache/queue/state
change; L4 migration compatibility; L5 evidence insufficient.

**Distractors/feedback.** Scale non-bottleneck tier, shard before need, add queue
to work that response must await, or perform breaking migration first.

**Examples.** (1) CPU-bound stateless tier at capacity, store spare →add app
replica, L2. (2) repeated immutable reads overload store and freshness allows
60 s →cache candidate fits, L3. (3) latency high but no component breakdown →
measure first, not choose rewrite, L5.

**Implementation/validation/coverage.** Candidate effect simulator and
precondition graph; include “measure first” only when truly underdetermined.

### Family `tradeoff_claim_evaluation`

**Task/purpose.** Judge architecture claims as supported, contradicted, or not
determined by supplied evidence.

**Response/template.** Three-way classification with evidence IDs. `Evaluate
claims {claims} from case {case}.`

**Derivation.** Translate claim to predicates and check entailment, negation, or
missing information.

**Constraints/rejection.** Avoid vague adjectives; claims name workload,
failure, consistency, or cost scope.

**Difficulty.** L2 direct calculation; L3 conditional claim; L4 correlated
failure/unknown; L5 distinguish mechanism from outcome.

**Distractors/feedback.** Treat possible as guaranteed, infer latency from
throughput, or infer durability from availability. Cite exact evidence gap.

**Examples.** (1) capacity600 vs peak500 →“fits peak under model” supported,
L2. (2) RF3 with no placement →“survives zone loss” not determined, L3. (3)
queue added →“work is faster” not determined; it changes coupling, L4.

**Implementation/validation/coverage.** Logical predicate/provenance engine;
every claim has a proof, counterexample, or named missing field.

### Cross-family progression

Security traces begin with boundaries and identity before tenant/data audits.
Rate limiting and cost remain exact standalone mechanisms before integration.
SPOF detection precedes candidate matching and whole-system audits. Evolution
and claim evaluation are final because they require disciplined use of evidence
and acceptance of underdetermination.

## 10. Cross-category progression and adaptive practice

Recommended category order:

1. Requirements, Workload & Capacity
2. Request Paths, Contracts & Scaling
3. Caching & Data Distribution
4. Replication & Consistency
5. Queues & Flow Control
6. Reliability & Recovery
7. SLOs, Observability & Change
8. Security, Cost & Design Audits

The app should interleave earlier arithmetic with later state traces. A learner
who can trace a cache but cannot calculate miss load has not mastered caching;
a learner who can multiply availability but ignores shared failure domains has
not mastered reliability.

Track mastery by:

- family and category;
- direct versus inverse/diagnostic direction;
- representation: table, graph, timeline, formula, or candidate matrix;
- workload dimension: rate, bytes, latency, state, failure, or cost;
- misconception;
- number of interacting components;
- evidence completeness and underdetermination recognition.

Adaptive responses:

- average/peak confusion triggers paired workload cards with the same totals;
- serial/parallel latency errors trigger wait-graph highlighting;
- timeout-as-cancellation errors trigger timeout/late-commit timelines;
- stateless/affinity confusion triggers state-location diagrams;
- cache errors split into lookup order, freshness, invalidation, and load;
- partition errors distinguish placement arithmetic from traffic skew;
- “quorum means strong consistency” errors return to overlap-only questions;
- acknowledgement/durability errors trigger failure-after-each-step traces;
- exactly-once claims trigger delivery-versus-effect counterexamples;
- retry errors separate schedule, amplification, and safety;
- availability errors introduce explicit shared-domain state before more
  decimals;
- SLO errors separate population, threshold, and window;
- telemetry errors ask what question each signal can answer;
- security errors separate identity, action, resource, and tenant;
- repeated fashionable-pattern choices receive candidate matrices where the
  simplest design satisfies every requirement;
- slow but correct multi-component reasoning reduces diagram density before
  reducing semantic difficulty.

Mastery requires transfer: at least one direct calculation, one state trace,
one diagnostic, and one integrated use of a family must be correct at its
target level.

## 11. Feedback and visualization requirements

The renderer needs:

- architecture graphs with typed components and visibly distinct sync, async,
  replication, and telemetry edges;
- workload/capacity tables with units in every column;
- Gantt-like request, retry, replication, queue, and rollout timelines;
- cache and replica state cards showing key, version, time, and authority;
- partition ranges and circular hash-ring diagrams;
- failure-domain nesting without implying geographic scale;
- queue occupancy and worker-state charts;
- trace span lanes;
- requirement-versus-design matrices;
- trust-zone shading and tenant/data-scope labels.

Accessibility:

- every diagram has a semantic table/text equivalent;
- color is never the only carrier of health, authority, trust, or failure;
- animation can be paused and stepped;
- focus order follows causal/event order;
- screen-reader labels distinguish request, message, replication, and telemetry
  edges;
- dense integrated cases support component isolation and zoom without hiding
  required evidence.

Worked feedback follows:

1. restate the decisive requirement/model;
2. show unit normalization or initial state;
3. show each transition or equation;
4. identify the first divergence from the learner answer;
5. state what the result does **not** guarantee.

## 12. Implementation architecture and local/offline boundary

The shipped app is a standalone HTML/JavaScript/CSS page:

- no backend;
- no runtime network requests;
- no cloud account, shell, database, broker, or telemetry service;
- no arbitrary uploaded production diagrams/logs/traces;
- no runtime AI grader;
- no vendor SDK or package dependency.

Implement small deterministic semantic engines:

```text
workload/capacity arithmetic
wait-graph latency and throughput
load-balancer state
API compatibility
idempotency and optimistic writes
cache and partition state
replica/version histories
transaction/saga workflows
queue/delivery/retry state
availability/failure domains
SLO and telemetry algebra
rollout state
policy/trust/tenant flow
fictional cost arithmetic
requirement predicate/provenance graph
```

Use exact integers, reduced rationals, and exact decimal money. Floating point
may render charts but must not determine a boundary answer. All random cases
are constructed from semantic parameters and prevalidated before display.

Localization must protect component IDs, units, code-like keys, and formulas
while translating complete prompt/feedback templates. Do not concatenate
English fragments around placeholders.

## 13. Automated validation

### Per-instance validation

Every generated instance must verify:

- every placeholder is substituted and escaped;
- topology references resolve to typed components/edges;
- diagrams, tables, event logs, and canonical state share semantic IDs;
- units are dimensionally compatible;
- each numeric answer is independently recomputed;
- events are totally ordered under the displayed tie rule;
- every state transition is legal under the named profile;
- every choice question has exactly one answer or declared accepted set;
- every distractor is distinct and maps to an applicable misconception;
- every `cannot determine` answer has at least two witness worlds/designs with
  different outcomes and identical supplied evidence;
- every causal claim has a provenance path from displayed evidence;
- rejection rules and display-size budgets are enforced.

### Differential and property tests

Maintain independent checks for:

- totals ↔ rates and logical ↔ physical storage round trips;
- headroom ceiling minimality;
- wait-DAG critical paths and serial pipeline bottlenecks;
- load-balancer assignment under permutations and health transitions;
- schema compatibility against versioned client fixtures;
- idempotency/optimistic-write interleavings;
- cache TTL boundaries, fill/invalidation, and layered lookup invariants;
- modulo/range/ring partition assignment and interval movement;
- replica version monotonicity and quorum subset enumeration;
- bounded linearizability-history enumeration;
- failover fencing and durable-copy provenance;
- transaction/saga failure injection at every step;
- queue backlog conservation, delivery deadlines, and DLQ thresholds;
- partial-order message delivery and dedupe expiry;
- retry schedule/call-tree counts and breaker/bulkhead transitions;
- availability formulas against enumerated state spaces;
- RTO/RPO timelines;
- SLO budget/burn arithmetic;
- trace interval critical paths and typed metric aggregation;
- rollout ready/unavailable/surge invariants;
- token-bucket conservation and tenant-scope taint propagation;
- fictional billing-line reconstruction;
- graph-cut/SPOF and requirement-matrix decisions.

### Fuzz and coverage targets

Before release, run at least:

- 100,000 workload, unit, storage, capacity, and SLO calculations;
- 50,000 request/wait/load-balancer traces;
- 50,000 cache and partition cases;
- 50,000 replica/quorum/history cases;
- 50,000 queue/retry/deduplication traces;
- 25,000 availability/failure-domain/recovery cases;
- 25,000 telemetry/canary/rollout cases;
- 25,000 security/policy/cost cases;
- 10,000 integrated architecture audits.

Content statistics must show:

- every family and declared difficulty band appears;
- positive, negative, boundary, and underdetermined outcomes recur;
- no category is dominated by arithmetic-only prompts;
- diagrams remain below declared component/event limits;
- every misconception produces a recurring diagnostic case;
- provider names, real addresses, secrets, customer data, and runtime URLs never
  enter generated content;
- “microservices,” “NoSQL,” “serverless,” and similar labels never determine a
  correct answer by themselves.

## 14. Coverage requirements and stable navigation

Default long-run mixed-practice targets after prerequisites:

| Area | Target share |
|---|---:|
| Requirements, workload, and capacity | 15% |
| Request paths, contracts, and scaling | 14% |
| Caching and data distribution | 14% |
| Replication and distributed state | 15% |
| Queues and flow control | 12% |
| Reliability and recovery | 13% |
| SLOs, observability, and change | 10% |
| Security, cost, and design audits | 7% |

At least:

- one quarter of advanced questions must have `cannot determine` or a
  requirement-limited answer available when warranted;
- one third of advanced questions must combine two previously mastered
  categories;
- half of replication questions must ask about state/guarantees rather than
  storage multiplication;
- half of queue questions must distinguish delivery from effect;
- half of reliability questions must use explicit failure domains or
  dependencies rather than independent percentages;
- every integrated design session must include one simpler feasible candidate;
  complexity must never be a proxy for correctness.

Stable learner-facing navigation:

1. Requirements & Capacity
2. Services, APIs & Scaling
3. Caches & Partitioning
4. Replication & Consistency
5. Queues & Flow Control
6. Reliability & Recovery
7. SLOs & Observability
8. Security, Cost & Design Audits

### Recommended v1 slice

A satisfying first implementation should include:

- every family in Category 2;
- request paths, stateless capacity, load balancing, compatibility,
  idempotency, and optimistic concurrency;
- cache hit/load, cache-aside, TTL, modulo/range partitioning, and hot
  partitions;
- replication storage, quorum overlap, lag, durable acknowledgements, and local
  transaction boundaries;
- queue backlog, consumer capacity, delivery attempts, retries, and
  deduplication;
- serial/redundant availability, failure domains, timeout budgets, retry load,
  RTO/RPO, and graceful degradation;
- SLI selection, error budgets, telemetry choice, trace critical paths, and
  canary comparison;
- trust boundaries, authentication/authorization, rate limiting, SPOF, and
  requirement/design matching.

Later increments may add consistent-hash migration, full consistency-history
classification, saga compensation failures, layered-cache invalidation,
priority bulkheads, multiwindow burn alerts, rollout compatibility audits, and
larger integrated cases.

### Low-value or unsuitable dynamic content

Do not build families for:

- memorizing architecture-pattern names or cloud-product catalogues;
- open-ended interview answers with hidden rubrics;
- drawing arbitrary diagrams without semantic checking;
- “how many users can this architecture support?” without workload and
  capacity data;
- availability “nines” trivia detached from a window or consequence;
- CAP-theorem slogan selection without a precise execution/failure model;
- blanket SQL-versus-NoSQL, monolith-versus-microservices, or
  sync-versus-async questions;
- postmortem blame, organizational maturity scores, or current vendor advice.

## 15. Reference profile

The semantic engines are defined by this specification; references anchor
terminology and caution rather than silently supplying missing rules.

- Google SRE, [Service Level
  Objectives](https://sre.google/sre-book/service-level-objectives/), for
  user-oriented SLIs, explicit SLOs, and error-budget framing.
- Google SRE Workbook, [Monitoring](https://sre.google/workbook/monitoring/),
  for synthetic monitoring tests, counters/rates, and moving from user symptoms
  to diagnostic signals.
- Google SRE Workbook, [Data Processing
  Pipelines](https://sre.google/workbook/data-processing/), for timeliness,
  completeness, correctness, and pipeline SLO examples.
- Amazon Builders' Library, [Timeouts, retries, and backoff with
  jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/),
  for the warning that a timeout does not prove absence of a side effect and
  that retries can amplify load.
- OpenTelemetry, [Signals](https://opentelemetry.io/docs/concepts/signals/) and
  [Traces](https://opentelemetry.io/docs/concepts/signals/traces/), for the
  metric/log/trace distinction and trace/span context.
- Karger et al., [Consistent Hashing and Random
  Trees](https://doi.org/10.1145/258533.258660), for the origin and bounded
  placement rationale of consistent hashing.
- DeCandia et al., [Dynamo: Amazon's Highly Available Key-value
  Store](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf),
  as a primary case study in explicit availability, partitioning, replication,
  and application-resolved consistency trade-offs.

Each implementation profile must record a version and the source sections used.
A source update triggers review and fixtures; it does not mutate saved
questions silently.

## 16. Topic-level quality checklist

- [ ] Every question follows from displayed requirements and a versioned model.
- [ ] No provider or architecture-style label determines correctness.
- [ ] Units distinguish decimal rate from binary storage.
- [ ] Average, peak, percentile, and worst-case claims remain distinct.
- [ ] Serial latency sums and required parallel latency uses the critical path.
- [ ] Timeouts do not erase possible side effects.
- [ ] Statelessness refers to required mutable request/session state.
- [ ] API compatibility evaluates both producer and consumer behavior.
- [ ] Idempotency and optimistic concurrency are not conflated.
- [ ] Cache hit ratio is tied to eligible traffic and backend work.
- [ ] TTL boundaries and invalidation scopes are exact.
- [ ] Partitioning and replication remain distinct.
- [ ] Consistent hashing does not imply balance, durability, or consensus.
- [ ] Quorum overlap is not presented as a complete consistency proof.
- [ ] Accepted, durable, replicated, visible, and processed states remain
  separate.
- [ ] Local transactions do not silently span stores or queues.
- [ ] Queue delivery is distinct from committed effect.
- [ ] Exactly-once is never claimed outside a modeled atomic boundary.
- [ ] Retry schedules are bounded and their load is counted.
- [ ] Redundancy calculations state independence or model shared domains.
- [ ] RTO and RPO remain distinct.
- [ ] SLI populations, thresholds, and windows are explicit.
- [ ] Component percentiles are never added into end-to-end percentiles.
- [ ] Telemetry answers match what the available evidence can establish.
- [ ] Canary and rollout decisions follow displayed rules, not intuition.
- [ ] Authentication, authorization, tenant scope, and data policy are distinct.
- [ ] Cost uses a fictional supplied rate card.
- [ ] `Cannot determine` has concrete witness alternatives.
- [ ] Integrated designs are judged against requirements, not box count.
- [ ] Every diagram has a semantic text/table alternative.
- [ ] The standalone app performs no runtime network request.
- [ ] Repeated practice improves architecture reasoning rather than jargon
  recall.
