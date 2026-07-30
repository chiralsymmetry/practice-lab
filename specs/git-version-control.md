# Git and Version-Control Reasoning — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, synthetic-repository simulator, graph/tree renderer, answer-checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Git and Version-Control Reasoning

### Topic goal

Develop a reliable mental model of Git state and history so the learner can predict, explain, and safely choose version-control operations. The learner should become able to:

- distinguish working-tree, index, `HEAD`, commit, ref, and remote-tracking state;
- predict `status` and both staged and unstaged diffs;
- construct commits deliberately from the index;
- trace branch, tag, and detached-`HEAD` movement;
- read commit DAGs, ancestry, revision expressions, and merge bases;
- classify fast-forward, three-way, up-to-date, and conflicting merges;
- resolve controlled conflicts and know what remains before completion;
- distinguish restore, reset, revert, amend, cherry-pick, rebase, and reflog recovery;
- predict fetch, push, pull-strategy, tracking, ahead/behind, and force-with-lease outcomes;
- split changes into reviewable commits and order dependent changes;
- use inspection and recovery reasoning before selecting a state-changing command;
- recognize which actions rewrite shared history or discard uncommitted work.

The app trains state prediction and decision quality, not memorization of isolated command recipes.

### Position within Practice Lab

- **Admin Practice** owns shell parsing, quoting, paths, permissions, and command-line safety. This app receives already parsed Git commands and uses simple synthetic paths.
- **Computer Science** owns general graph algorithms. This app applies reachability, ancestry, and merge-base reasoning to commit DAGs.
- **Practical Cryptography** owns cryptographic guarantees. This app treats commit IDs as opaque content-derived identifiers and does not teach hash security.
- Hosted forge features such as pull-request UI, permissions, and CI are adjacent workflow topics; this app models only the Git graph/state beneath them.

### Audience and prerequisites

The learner should know:

- files and directories;
- the idea of a command with options and path arguments;
- directed graphs at the level of “this commit has this parent”;
- that collaborators may each have a local repository.

No terminal access, Git installation, hosted account, or programming knowledge is required. Early Learn cards introduce every state area visually.

### Scope

The initial topic includes:

- snapshots/trees, commits, parent links, refs, symbolic `HEAD`, detached `HEAD`, tags, and reachability;
- working tree, index/staging area, tracked/untracked/ignored files, status, and diff layers;
- `add`, `commit`, `restore`, `rm`, `mv`, branch creation/switching, and safe dirty-tree checks;
- branch movement, ancestry, merge bases, revision selectors, and bounded log/history interpretation;
- fast-forward and three-way merge, merge commits, controlled textual conflicts, index conflict stages, resolution, continuation, and abort;
- `reset` modes, `revert`, `amend`, `cherry-pick`, linear rebase, reflog recovery, and stash mechanics;
- remotes, remote-tracking refs, upstreams, fetch, clone, ahead/behind, push acceptance, explicit pull modes, and `--force-with-lease`;
- bisect on a generated linear first-parent range;
- commit partitioning, dependency ordering, review range, integration strategy, and shared-history safety;
- exact state-transition questions and command-choice questions under fully displayed assumptions.

### Exclusions

Do not include in the initial app:

- execution against a real repository, filesystem, remote, credential store, or hosted forge;
- shell quoting, wildcard/pathspec expansion, environment variables, aliases, hooks, config precedence, pager/editor behavior, or OS-specific filesystem behavior;
- Git internals below the educational object/ref model: packfiles, delta compression, wire protocol, object-file layout, ref locking, garbage-collection timing, or hash-transition implementation;
- submodules, subtree workflows, Git LFS, sparse checkout/index, partial clone, multiple worktrees, replace/graft refs, shallow-history edge cases, notes, mail patches, or rerere;
- octopus merges, rebase of merge commits, criss-cross/ambiguous merge bases, recursive merge-strategy internals, rename/copy detection, binary merge drivers, custom attributes, or custom merge drivers;
- exact diff hunk heuristics, similarity percentages, or line-ending/filter conversions;
- server policies, protected branches, pull-request approval rules, CI systems, issue trackers, GitHub/GitLab-specific commands, or authentication setup;
- destructive cleanup of plausible user paths or commands run outside a simulator;
- grading open-ended commit messages by prose style;
- treating a commit ID as proof of authorship or a signed commit/tag as automatically trusted.

### Safety boundary

Every command is simulated. Commands that may discard or rewrite state—such as `reset --hard`, forced push, branch deletion, or restore over working changes—must carry a visible `simulated destructive effect` label and an explicit before/after state.

The app never encourages a destructive operation when an inspection or recoverable operation satisfies the stated goal. When several commands could technically work, the prompt must declare whether it asks for:

- exact state effect;
- safest suitable choice;
- collaboration-safe choice;
- command matching a specified intent.

### Normative repository model

The initial model ID is `git-state-v1`.

#### Paths and file values

- Paths are repository-relative, case-sensitive ASCII strings such as `src/app.c`.
- No path contains whitespace, backslash, colon, glob metacharacters, `..`, a leading `/`, or a `.git` component.
- Directories are implicit; trees map file paths to `(contentId,mode)`.
- Contents use short labels or LF-terminated text lines. Content labels such as `v1`, `red`, and `calc=1` are semantic values, not filenames.
- Supported modes are ordinary file and executable file. Symbolic links and submodules are excluded.
- Executable-bit changes count as file changes.

#### Commits and trees

- A commit stores one complete tree, an ordered parent list, author metadata, committer metadata, and message.
- Synthetic commit IDs are uppercase labels such as `A`, `B`, and `C'`. They are opaque IDs assigned by the generator.
- IDs differing by a prime mark denote different commits even when their patch/message is described as corresponding.
- A normal commit has one parent; a root has none; a modeled merge commit has exactly two ordered parents.
- Creating/amending/replaying a commit creates a new ID because at least its parent or metadata differs.
- The first parent of a merge commit is the branch checked out when the merge began; the second parent is the merged tip.
- Commits are immutable in the model. Commands move refs or create new commits; they never edit an existing commit.

#### Refs and `HEAD`

- A local branch is a movable ref under `refs/heads/*`.
- A remote-tracking ref such as `origin/main` is a local record updated by fetch; it is not a live view and is not the remote branch itself.
- An annotated/lightweight distinction is excluded; modeled tags are immutable human-named refs unless the prompt explicitly demonstrates forced retagging as unsafe.
- Attached `HEAD` symbolically names the current local branch. Committing moves that branch.
- Detached `HEAD` directly names a commit. Committing creates a new commit and moves detached `HEAD`, but no branch moves.
- Deleting a ref does not immediately delete commits; reachability/reflog retention is modeled separately.

#### Index and working tree

- `HEAD tree` means the tree of the commit resolved by `HEAD`.
- The index contains one stage-0 entry per tracked/staged path during ordinary operation.
- The working tree contains current file values plus untracked files.
- `git add <path>` copies that path’s working-tree value/mode into the index; a missing tracked path stages deletion.
- `git add -u` updates index entries for tracked paths, including deletions, but does not add untracked paths.
- `git add -A` updates tracked paths and adds all nonignored untracked paths within the modeled repository scope.
- `git commit` creates a tree exactly from stage-0 index entries, not directly from the working tree.
- An ignored untracked path is omitted from ordinary status/add-all behavior; a path already tracked remains tracked even if a later ignore rule matches it.

#### Status and diff

For each path:

- staged state compares `HEAD tree` with index;
- unstaged state compares index with working tree;
- untracked means present in working tree but absent from index and `HEAD`;
- ignored means untracked and matched by the declared ignore rules.

The UI may render porcelain-like `XY` codes only after teaching them:

- `X` describes `HEAD → index`;
- `Y` describes `index → working tree`;
- `M`, `A`, and `D` mean modified, added, and deleted;
- `??` means untracked;
- conflict codes are taught separately.

`git diff` shows `index → working tree`; `git diff --staged` shows `HEAD → index`.

#### Branch switching

A generated switch either:

- is clean and replaces index/working tree with the target tree;
- preserves nonconflicting local changes exactly under a prevalidated fixture; or
- is rejected because it would overwrite a displayed local change/untracked path.

The simulator does not attempt every real checkout/switch edge case. Every question states the modeled outcome rule and rejects ambiguous fixtures.

#### Merge model

For current tip `O` and other tip `T`:

- if `T` is an ancestor of `O`, the merge is already up to date;
- if `O` is an ancestor of `T`, the default modeled merge fast-forwards the current branch to `T` unless `--no-ff`;
- otherwise find the unique displayed merge base `B` and perform a three-way tree merge.

Per path:

- if ours equals base, take theirs;
- if theirs equals base, take ours;
- if ours equals theirs, take that value;
- independent prevalidated line edits may combine;
- incompatible edits generate a conflict.

A clean divergent merge creates a two-parent merge commit unless `--squash` is explicitly taught in a later version. `--ff-only` rejects a divergent history. The working tree and index must be clean before generated merge operations.

During a content conflict:

- index stage 1 is base, stage 2 is ours, stage 3 is theirs;
- working file shows deterministic conflict markers for teaching;
- resolving means write desired working content, then `git add` it to create stage 0 and remove stages 1–3;
- commit completes the merge using the saved two parents;
- abort restores the exact pre-merge branch/index/working state in the synthetic fixture.

#### Rewrite and undo model

- `reset --soft C`: move current branch/detached `HEAD` to C; leave index and working tree unchanged.
- default/mixed reset to C: move ref/`HEAD`, replace index with C’s tree, leave working tree unchanged.
- `reset --hard C`: move ref/`HEAD`, replace index and tracked working files with C’s tree. Generated fixtures exclude untracked-path obstruction and explicitly list any untracked files that remain.
- `restore <path>` copies index to working tree for the path.
- `restore --staged <path>` copies `HEAD` to index and leaves working tree unchanged.
- `revert C` applies the inverse of C’s selected-parent patch to the current tree and creates a new commit.
- `cherry-pick C` applies C’s selected-parent patch to the current tree and creates a new commit.
- `commit --amend` creates a replacement commit with the same parent list by default and the current index tree/new message.
- linear rebase replays the current branch’s unique first-parent commits after the unique merge base onto the target, creating new commits in original order.
- rebase/cherry-pick/revert fixtures either apply cleanly or enter an explicitly modeled conflict state.
- reflog entries record local ref/`HEAD` movement in displayed order. Expiration is not modeled within a question.
- a modeled stash entry stores the base commit plus separate index and working-tree deltas. `stash push` saves tracked changes and restores index/work to `HEAD`; `-u` additionally saves nonignored untracked files.
- default `stash apply` restores the combined tracked result to the working tree while retaining the current index where the fixture permits; `--index` additionally attempts to restore the saved index layer.
- `stash apply` retains the entry. `stash pop` drops it only after a clean apply; a conflicting pop retains the entry.

#### Remote model

Each local repository stores:

- local refs;
- remote-tracking refs;
- configured fetch mapping;
- optional upstream for each local branch;
- a synthetic remote’s advertised refs at the moment of an operation.

`fetch origin` updates `origin/*` according to the displayed remote state and fetch mapping; it does not move local branches or working files.

A normal push of local L to remote R is accepted only if:

- the expected destination is unambiguous;
- remote authentication/policy are declared successful;
- the old remote tip is an ancestor of L, or the destination does not yet exist.

`--force-with-lease` is accepted only if the actual remote old tip equals the displayed expected lease, then it updates the remote ref even when non-fast-forward. Plain `--force` may appear only as an inferior distractor.

Generated multi-ref pushes appear only with an explicit modeled `--atomic` option: all ref updates are applied only if every update/lease check succeeds; otherwise none are applied.

`pull` is never left configuration-dependent. Prompts use one of:

- `pull --ff-only` = fetch then fast-forward only;
- `pull --no-rebase` = fetch then merge;
- `pull --rebase` = fetch then linear rebase under this model.

### Ignore-pattern subset

The `gitignore-v1` subset supports:

- blank lines/comments;
- `*`, `?`, and `**`;
- leading `/` anchored at repository root;
- trailing `/` matching directories and descendants;
- `!` negation with last matching rule winning;
- slashless patterns matching a basename at any depth.

To avoid a subtle real-Git traversal exception, generated negations never re-include a path inside a directory that remains excluded. The complete ordered rule list and repository tree are always displayed.

### Global answer conventions

- Commit/ref/path names are case-sensitive.
- Graph-answer sets ignore order; first-parent sequences and command sequences preserve order.
- A graph edge is written `child → parent`.
- Commit labels with primes are distinct: `C`, `C'`, and `C''`.
- Tree answers are path/value maps; path order is ignored.
- Status answers use named states until porcelain codes are unlocked; both are accepted when unambiguous.
- “No change,” “rejected,” “conflict,” and “operation has no effect” are distinct.
- Command-choice answers use structured tokens rather than free-form shell text.
- Optional `git` prefix and conventional option ordering may be accepted only by a constrained parser; feedback renders one canonical command.
- Reasons are selected from controlled facts, not graded as open prose.
- Surrounding whitespace is ignored in commit/ref/path input; internal whitespace is not relevant because generated identifiers contain none.

### Difficulty philosophy

Difficulty should rise through:

- adding a second state layer (index versus working tree);
- reversing a transition or recovering a missing prior state;
- moving from linear history to divergent DAGs;
- separating ref movement from commit creation;
- tracking local and remote refs independently;
- distinguishing patch identity from commit identity;
- handling conflicts or operation-in-progress state;
- selecting safe undo/recovery based on publication and data-loss constraints;
- composing at most three mastered concepts in one scenario.

Difficulty must not rise through:

- giant graphs, huge file trees, long hashes, or long diffs;
- obscure options and configuration trivia;
- ambiguous ASCII graph layout;
- platform-specific line endings or filesystem behavior;
- unpredictable rename/merge heuristics;
- asking learners to memorize porcelain output without the state model;
- destructive commands against real data;
- command syntax differences unrelated to the state being trained.

### Topic-wide level model

| Level | Typical demand |
|---|---|
| 1 | One file/state comparison or linear ref movement |
| 2 | Index plus working tree, short branch graph, direct fetch/merge |
| 3 | Divergence, missing state, reset/revert distinction, remote ahead/behind |
| 4 | Conflict state, rebase/cherry-pick, reflog/replay window |
| 5 | Mixed collaboration/recovery choice with publication and data-loss constraints |

### Generator and oracle model

Every instance stores:

`modelVersion`, `categoryId`, `familyId`, `level`, `commitDag`, `trees`, `patches`, `localRefs`, `remoteRefs`, `remoteTrackingRefs`, `headState`, `indexStages`, `workingTree`, `ignoreRules`, `operationState`, `reflog`, `upstreams`, `attackerOrCollaboratorFacts`, `canonicalAnswer`, `acceptedAnswerClass`, `difficultyDimensions`, `misconceptionsTargeted`, `distractorProvenance`, `workedSolution`, `structuralSignature`, and `oracleVersion`.

Generate backward from the target distinction: status code, graph class, conflict path, lost ref, ahead/behind pair, push result, or safest operation. Apply every simulated operation to a cloned state and independently verify invariants.

## 2. Category: Snapshots, commits, refs, and graph reading

### Category purpose

Build the object-and-pointer mental model needed for every later state transition.

### Learn

A commit names a complete snapshot and parent link(s). A branch is a movable name for a commit. Attached `HEAD` names the current branch; detached `HEAD` names a commit directly. Creating a commit makes a new immutable node and moves only the current branch or detached `HEAD`.

### Prerequisites

Files, maps, and arrows.

### Category boundaries

This category reads stored history and names. Index/working-tree differences begin in the next category.

### Common misconceptions

- A commit stores only “the changed files.”
- A branch is a separate copy of every file.
- `HEAD` is always the latest commit in the repository.
- A tag moves when new commits are made.
- Deleting a branch immediately destroys its commits.

### Family `snapshot_tree_lookup`

**Task.** Read the complete file tree stored by a commit.

**Response and template.** Path/value map: `What snapshot does commit {commit} store?`

**Derivation.** Resolve commit directly and return its tree; parent patches are explanatory only.

**Difficulty.** L1 tree shown; L2 derive from parent plus patch; L3 unchanged file carried across several commits.

**Examples.**

1. A stores `{a:v1}` → snapshot `{a:v1}`. L1.
2. A `{a:v1,b:x}`; B changes `a:v1→v2` → B tree `{a:v2,b:x}`. L2.
3. B stores `{a:v2,b:x,c:z}`; C changes only `b:x→y` → C still contains `{a:v2,b:y,c:z}`. L3.

**Distractors and validation.** Return only touched paths or omit inherited files. Reconstruct patch chain and compare stored tree.

### Family `commit_parent_read`

**Task.** Identify parent(s), roots, and first-parent relationships.

**Response and template.** Commit set/ordered pair: `In {dag}, what are the parents of {commit}?`

**Derivation.** Read outgoing child→parent edges; preserve parent order for merges.

**Difficulty.** L1 linear parent; L2 root; L3 merge parent ordering.

**Examples.**

1. `B→A` → parent of B is A. L1.
2. A has no outgoing parent edge → A is root. L2.
3. Merge M created while on main C merging topic T → ordered parents `(C,T)`. L3.

**Distractors and validation.** Reverse edge or call children parents. DAG adjacency oracle.

### Family `ref_head_resolve`

**Task.** Resolve `HEAD`, branch, tag, or remote-tracking names to a commit.

**Response and template.** Commit ID: `Given {refs_and_head}, which commit does {name} resolve to?`

**Derivation.** Follow symbolic `HEAD` to branch, then ref to commit; direct refs resolve once.

**Difficulty.** L1 branch; L2 attached HEAD; L3 distinguish similarly named local/remote/tag refs.

**Examples.**

1. `main→C` → main resolves to C. L1.
2. `HEAD→main`, `main→D` → HEAD resolves to D. L2.
3. `main→E`, `origin/main→C`, `tag:v1→B` → `origin/main` resolves to C, not E. L3.

**Distractors and validation.** Choose newest-looking node or remote live tip. Typed-ref resolver.

### Family `ancestor_reachability`

**Task.** Decide whether one commit is an ancestor/reachable from another.

**Response and template.** Yes/no/path: `Is {older} an ancestor of {newer} in {dag}?`

**Derivation.** Traverse zero or more parent edges from newer; a commit is an ancestor of itself under the model.

**Difficulty.** L1 linear; L2 branch sibling; L3 merge/reachability through second parent.

**Examples.**

1. `A←B←C`: A is ancestor of C. L1.
2. `A←B` with children C and D from B: C is not ancestor of D. L2.
3. M has parents C and D; both C and D are ancestors of M. L3.

**Distractors and validation.** Graph left/right position or common ancestor=ancestor of sibling. DFS/BFS oracle.

### Family `merge_base_find`

**Task.** Find the unique best common ancestor of two tips in a generated DAG.

**Response and template.** Commit ID: `What is the merge base of {left} and {right}?`

**Derivation.** Intersect ancestor sets; select the common ancestor not ancestor of another common candidate.

**Difficulty.** L1 immediate split; L2 one side advanced; L3 prior merge while retaining unique base.

**Examples.**

1. `A←B`, then B has children C and D → merge base(C,D)=B. L1.
2. main `A-B-C-D`, topic from B `B-E-F` → merge base(D,F)=B. L2.
3. `C→B,E→B`, M has parents `(C,E)`, `N→M`, and `F→E` → merge base(N,F)=E. L3.

**Distractors and validation.** Root or visually closest arbitrary node. Independent ancestor-set algorithm; reject multiple best bases.

### Family `detached_head_trace`

**Task.** Predict ref/`HEAD` movement after committing while detached.

**Response and template.** Graph/ref state: `HEAD is detached at {commit}; create commit {new}. What moves?`

**Derivation.** New commit parent is detached target; detached HEAD moves to new commit; branch refs do not.

**Difficulty.** L1 one commit; L2 switch away/reachability; L3 create branch before/after.

**Examples.**

1. detached HEAD at B; commit D → `D→B`, HEAD=D, main remains C. L1.
2. switch detached HEAD from D to main C without creating a ref → D no longer branch-reachable but remains in reflog. L2.
3. detached D then create/switch branch rescue at D → `rescue→D`, HEAD→rescue; next commit moves rescue. L3.

**Distractors and validation.** Move main automatically or commit has no parent. Ref-transition oracle.

### Family `tag_branch_behavior`

**Task.** Contrast tag and branch movement as new commits are created.

**Response and template.** Ref map: `With refs {refs}, commit on {branch}; where do refs point afterward?`

**Derivation.** Move checked-out branch only; leave modeled tag immutable.

**Difficulty.** L1 tag/branch same tip; L2 several branches; L3 commit after checking out tag detached.

**Examples.**

1. main and tag v1 both point B; commit C on main → main C, v1 B. L1.
2. main B, topic T, tag v1 A; commit C on main → only main moves to C. L2.
3. checkout tag v1 at A detached; commit D → HEAD D, tag v1 A, branches unchanged. L3.

**Distractors and validation.** Tag follows branch or all refs at old tip move. Ref-delta check.

### Family `commit_identity_reasoning`

**Task.** Decide whether two described commits can have the same identity under the model.

**Response and template.** Same/different plus changed field: `Compare commit descriptions {left} and {right}.`

**Derivation.** Any different tree, ordered parents, message, author/committer metadata yields a different generated ID; identical object fields yield same identity.

**Difficulty.** L1 different tree; L2 same patch/different parent; L3 amend/rebase metadata.

**Examples.**

1. Same parent/message but different tree → different commits. L1.
2. The same patch `a:v1→v2` applied once with parent B and once with parent X → different commit IDs because the parent differs. L2.
3. Amend only the message of C → replacement C' is distinct although its tree and parent match C. L3.

**Distractors and validation.** Same patch means same commit or label similarity means identity. Compare complete commit records.

### Cross-family progression

Snapshot and parent reading precede refs. Ref resolution precedes attached/detached movement. Ancestry precedes merge bases. Commit identity should be interleaved with detached and tag behavior so the learner separates immutable nodes from movable names.

## 3. Category: Working tree, index, status, and committing

### Category purpose

Train exact comparison among `HEAD`, index, and working tree and deliberate construction of the next snapshot.

### Learn

The index is the proposed next commit. `git add` copies working content into it. The working tree may then change again, so one file can have both staged and unstaged changes. `git commit` snapshots the index.

### Prerequisites

Commit trees and attached `HEAD`.

### Category boundaries

This category uses clean linear history and no merge conflicts. Conflict index stages appear later.

### Common misconceptions

- `git add` permanently stores a change in history.
- Commit reads whatever is currently in the working file.
- `git diff` shows staged changes.
- An ignored rule untracks an already tracked file.
- Restore/reset layers are interchangeable.

### Family `status_path_classify`

**Task.** Classify each path by staged, unstaged, untracked, ignored, or clean state.

**Response and template.** Matching/table: `Compare {head_tree}, {index}, and {working_tree}; classify each path.`

**Derivation.** Compare HEAD→index and index→working independently; then classify paths absent from index.

**Difficulty.** L1 one comparison; L2 several paths; L3 same path staged and unstaged.

**Examples.**

1. HEAD/index `a:v1`, work `a:v2` → a modified unstaged. L1.
2. HEAD `a:v1`, index/work `a:v2` → a modified staged. L2.
3. HEAD `a:v1`, index `a:v2`, work `a:v3` → a has staged v1→v2 and unstaged v2→v3 changes. L3.

**Distractors and validation.** Compare only HEAD/work or collapse both layers. Pathwise state oracle.

### Family `porcelain_xy_decode`

**Task.** Translate a modeled porcelain `XY` code to state comparisons or derive the code.

**Response and template.** Code/state: `For {path_state}, what is the XY status code?`

**Derivation.** X from HEAD→index; Y from index→work; space denotes no change.

**Difficulty.** L1 `M ` or ` M`; L2 `MM`,`A `,` D`; L3 several paths plus `??`.

**Examples.**

1. staged modification only → `M `. L1.
2. unstaged deletion of tracked file → ` D`. L2.
3. staged v1→v2 then working v3 → `MM`; separate new untracked b → `??`. L3.

**Distractors and validation.** Reverse X/Y or use A for every new working file. State-to-code table round trip.

### Family `diff_layer_predict`

**Task.** Identify changes shown by `git diff` versus `git diff --staged`.

**Response and template.** Change set: `Given {three_states}, what does {diff_command} compare/show?`

**Derivation.** Default diff is index→work; staged diff is HEAD→index.

**Difficulty.** L1 one layer; L2 both; L3 same file differing in both layers.

**Examples.**

1. HEAD/index a=v1, work a=v2: default diff shows v1→v2; staged diff empty. L1.
2. HEAD a=v1, index/work a=v2: staged diff v1→v2; default empty. L2.
3. HEAD v1, index v2, work v3: staged shows v1→v2; default shows v2→v3. L3.

**Distractors and validation.** Both commands compare HEAD→work. Exact map differencer.

### Family `add_path_effect`

**Task.** Predict index/status after adding specified paths.

**Response and template.** Index/status map: `Apply git add {paths} to {state}.`

**Derivation.** Copy each named working value/mode into index; stage deletion when named tracked path is absent.

**Difficulty.** L1 modified file; L2 new/deleted; L3 add after an earlier stage captures newer work.

**Examples.**

1. index a=v1, work a=v2; add a → index a=v2, path staged. L1.
2. tracked b exists in index but is absent in work; add b → deletion staged. L2.
3. index a=v2, work a=v3 after earlier add; add a again → index becomes v3 and unstaged part disappears. L3.

**Distractors and validation.** Move rather than copy content or retain old staged version. Apply transition then recompute status.

### Family `add_scope_effect`

**Task.** Contrast `add -u`, `add -A`, and named-path staging in a displayed repository.

**Response and template.** Path set: `Which working changes enter the index after {add_form}?`

**Derivation.** Apply declared scope rules for tracked modifications/deletions and untracked nonignored paths.

**Difficulty.** L1 tracked/untracked; L2 deletion; L3 ignored plus multiple path classes.

**Examples.**

1. tracked a modified, untracked b; `add -u` stages a only. L1.
2. tracked a deleted, untracked b; `add -A` stages deletion of a and addition of b. L2.
3. tracked a modified, untracked b, ignored tmp.log; `add -A` stages a and b, not tmp.log. L3.

**Distractors and validation.** `-u` means untracked or ignored files enter `-A`. Exact scope filter.

### Family `commit_index_snapshot`

**Task.** Predict the new commit tree and remaining working changes.

**Response and template.** Tree/status: `Run git commit creating {new_commit} from {state}.`

**Derivation.** New tree equals index; parent is old HEAD; current branch moves; work is unchanged; recompute work against new index/HEAD.

**Difficulty.** L1 staged only; L2 unrelated unstaged file; L3 one path both staged/unstaged.

**Examples.**

1. HEAD a=v1, index/work a=v2 → commit B tree a=v2; clean. L1.
2. index a=v2, work a=v2 and b=untracked → commit stores a only; b remains untracked. L2.
3. HEAD v1, index v2, work v3 → commit stores v2; afterward v2→v3 remains unstaged. L3.

**Distractors and validation.** Commit working v3 or include untracked automatically. Tree/ref transition plus status oracle.

### Family `restore_layer_effect`

**Task.** Predict state after `restore <path>` or `restore --staged <path>`.

**Response and template.** Index/work/status: `Apply {restore_form} to {path} in {state}.`

**Derivation.** Default copies index→work; `--staged` copies HEAD→index and leaves work.

**Difficulty.** L1 discard unstaged; L2 unstage; L3 both staged/unstaged and resulting comparison.

**Examples.**

1. index a=v1, work a=v2; `restore a` → work v1, clean. L1.
2. HEAD a=v1, index/work a=v2; `restore --staged a` → index v1, work v2, now unstaged. L2.
3. HEAD v1,index v2,work v3; `restore --staged a` → index v1, work v3: no staged change, unstaged v1→v3. L3.

**Distractors and validation.** Delete path, move branch, or change both layers. Source/destination copy oracle.

### Family `rm_mv_state_effect`

**Task.** Predict modeled index/working changes after `git rm` or `git mv`.

**Response and template.** Path maps/status: `Apply {operation} to {state}.`

**Derivation.** `rm` removes tracked path from index/work; `mv old new` is modeled as remove old plus add new with identical content/mode.

**Difficulty.** L1 rm clean path; L2 mv; L3 distinguish stored snapshot from rename interpretation.

**Examples.**

1. tracked a=v1; `git rm a` → absent in index/work, deletion staged. L1.
2. tracked a=v1; `git mv a b` → a deletion and b addition staged, work contains b=v1. L2.
3. Commit after the move stores only b=v1; this model does not store a special rename object. L3.

**Distractors and validation.** Remove only work or store rename metadata in commit. Map transition.

### Family `ignore_rule_match`

**Task.** Determine ignored/unignored paths under the displayed ordered `gitignore-v1` rules.

**Response and template.** Path set: `Which paths are ignored by {rules}?`

**Derivation.** Match rules in order; last match determines state; obey anchors/directory forms and safe negation constraints.

**Difficulty.** L1 basename `*.log`; L2 root anchor/directory; L3 permitted negation.

**Examples.**

1. rule `*.log`; paths `a.log,src/a.log,a.txt` → first two ignored. L1.
2. rules `/build/`; paths `build/x,src/build/x` → only `build/x` ignored. L2.
3. rules `*.log,!keep.log`; paths `a.log,keep.log,src/keep.log` → only a.log ignored because slashless negation matches both keep basenames. L3.

**Distractors and validation.** First match wins or rooted pattern matches any depth. Independent bounded matcher.

### Family `tracked_ignore_behavior`

**Task.** Decide how ignore rules affect already tracked versus untracked paths.

**Response and template.** Status/inclusion: `Rule {rule} is added; what happens to {paths}?`

**Derivation.** Apply ignore only to untracked discovery; existing index entries remain tracked.

**Difficulty.** L1 tracked file; L2 tracked plus untracked match; L3 remove from index then reassess.

**Examples.**

1. tracked `debug.log`, then add `*.log` rule → debug.log remains tracked. L1.
2. tracked debug.log and new trace.log → debug changes appear; trace.log is ignored. L2.
3. after a modeled index removal/commit stops tracking debug.log, the still-present working file matches `*.log` and becomes ignored. L3.

**Distractors and validation.** Ignore rule deletes/untracks files automatically. Track-set then ignore matcher.

### Cross-family progression

Named state classification precedes porcelain codes and diff commands. Single-path add precedes scope options. Commit questions follow index construction. Restore is taught as a layer copy, then rm/mv and ignore behavior extend path lifecycle without introducing history rewrite.

## 4. Category: Branching, navigation, and history selection

### Category purpose

Train branch/ref movement and precise selection of commits from a small DAG.

### Learn

Creating a branch creates a ref; switching chooses which branch `HEAD` names. Commits move only the checked-out branch. Revision expressions navigate parents: `X^` selects a parent and `X~n` follows first parents n times.

### Prerequisites

Refs, `HEAD`, clean index/working tree, and ancestry.

### Category boundaries

No content merging occurs here. Switching fixtures are clean or have an explicitly prevalidated accept/reject outcome.

### Common misconceptions

- Creating a branch creates a commit.
- Switching moves the other branch to the current commit.
- All branches advance when committing.
- `^2` means two commits back.
- Log display order defines ancestry.

### Family `branch_create_effect`

**Task.** Predict refs after creating a branch with or without switching.

**Response and template.** Ref/HEAD map: `At {start}, apply {branch_creation}.`

**Derivation.** New branch points to selected start commit; only switch form changes symbolic HEAD.

**Difficulty.** L1 create at HEAD; L2 create/switch; L3 create at explicit older commit.

**Examples.**

1. HEAD→main→C; `branch topic` → topic C, HEAD still main. L1.
2. `switch -c topic` at C → topic C and HEAD→topic. L2.
3. create `hotfix` at B while HEAD→main→D → hotfix B, main D, HEAD main. L3.

**Distractors and validation.** New commit appears or main moves. Ref-only transition.

### Family `switch_branch_effect`

**Task.** Predict HEAD/index/work after switching to another branch or explain rejection.

**Response and template.** State/outcome: `Switch from {current} to {target} in {state}.`

**Derivation.** Apply the declared branch-switch rule; replace clean state with target tree or reject an overwrite.

**Difficulty.** L1 clean switch; L2 same file unchanged; L3 local change/untracked obstruction.

**Examples.**

1. main tree a=v2, topic tree a=v1, clean; switch topic → HEAD topic, index/work a=v1. L1.
2. both tips store b=x while a differs; clean switch changes only a. L2.
3. work has unstaged a=local from main a=v2; topic has a=v1 → reject because switching would overwrite a. L3.

**Distractors and validation.** Discard dirty work silently or move target branch. Prevalidated transition and no-state-change-on-reject.

### Family `commit_branch_movement`

**Task.** Predict which refs move after a sequence of switches and commits.

**Response and template.** Graph/ref map: `Apply {sequence} to {initial_refs}.`

**Derivation.** Each commit parents current HEAD commit and moves only attached branch.

**Difficulty.** L1 one branch; L2 alternate branches; L3 divergence.

**Examples.**

1. main B, commit C on main → main C. L1.
2. main C, topic B; switch topic, commit D → topic D→B; main remains C. L2.
3. from B create topic/commit D, switch main/commit C → siblings C and D both parent B. L3.

**Distractors and validation.** Linearize sibling commits or move both refs. Sequence simulator.

### Family `branch_delete_reachability`

**Task.** Decide whether a branch can be safely deleted under displayed policy and what becomes unreachable.

**Response and template.** Yes/no/commit set: `Delete branch {branch} after checking reachability from {protected_refs}.`

**Derivation.** A safe delete requires its tip reachable from the declared comparison branch; then remove ref and recompute reachability from all refs/reflog.

**Difficulty.** L1 fully merged; L2 unique commit; L3 tag/other branch retains reachability.

**Examples.**

1. topic B and main C with C→B → topic tip reachable from main; safe-delete criterion passes. L1.
2. topic D and main C are siblings from B → D not reachable from main; safe delete rejected. L2.
3. topic D not in main but tag keep→D → deleting topic removes one name but D remains tag-reachable. L3.

**Distractors and validation.** Same tree means merged or deletion erases commit immediately. Reachability oracle.

### Family `revision_parent_expression`

**Task.** Resolve bounded `^`, `^n`, and `~n` expressions.

**Response and template.** Commit ID: `In {dag}, resolve {revision}.`

**Derivation.** `X^`=`X^1`; `X^n` chooses nth parent once; `X~n` follows first parent n times.

**Difficulty.** L1 linear `~`; L2 merge `^2`; L3 composition.

**Examples.**

1. `A←B←C`; `C~2` →A. L1.
2. M parents `(C,T)`; `M^2` →T. L2.
3. M first parent C with C→B; `M^1~1` →B. L3.

**Distractors and validation.** `^2` follows two generations or `~` explores all parents. AST resolver.

### Family `revision_range_select`

**Task.** Determine commits selected by a two-dot review range under the declared model.

**Response and template.** Commit set: `Which commits are in {left}..{right}?`

**Derivation.** Return commits reachable from right but not reachable from left.

**Difficulty.** L1 linear; L2 sibling branches; L3 merged ancestry.

**Examples.**

1. `A←B←C`; `A..C` → `{B,C}`. L1.
2. B splits to main C and topic D→E; `main..topic` → `{D,E}`. L2.
3. main M already merges topic E; `main..topic` → empty because E is reachable from main. L3.

**Distractors and validation.** Commits between dates or symmetric difference. Reachability-set subtraction.

### Family `history_order_reason`

**Task.** Distinguish valid topological/first-parent history orders and ancestry facts.

**Response and template.** Ordered sequence/choice: `Which displayed order is valid under {log_rule}?`

**Derivation.** Topological order places children before parents; first-parent follows parent 1 only. Tie order for unrelated nodes is supplied.

**Difficulty.** L1 linear; L2 divergent topo tie; L3 merge first-parent versus all-history.

**Examples.**

1. `A←B←C`, newest-first topological → `C,B,A`. L1.
2. siblings C,D from B with tie C before D → `C,D,B,A` is valid. L2.
3. M parents C,T; first-parent history from M is `M,C,...` and omits T’s unique line unless already on first-parent chain. L3.

**Distractors and validation.** Display position implies parent or first-parent includes second parent. DAG/order validator.

### Cross-family progression

Create and switch precede multi-branch commit traces. Reachability supports safe deletion and revision ranges. Parent expressions are taught on explicit DAGs before history-order questions. Merge itself remains locked until these graph skills are stable.

## 5. Category: Merge classification, trees, and conflicts

### Category purpose

Train graph-based merge classification and exact three-way content reasoning, including the conflict lifecycle.

### Learn

A merge first asks how the tips relate. Ancestor cases are up-to-date or fast-forward. Divergent tips use their merge base and compare base/ours/theirs. A conflict is unresolved index state, not merely “two branches differ.”

### Prerequisites

Ancestry, merge base, branch movement, and clean index/work state.

### Category boundaries

Only two-parent merges and prevalidated text/tree fixtures are supported. Rename detection, binary drivers, strategy selection, and criss-cross bases are excluded.

### Common misconceptions

- Every merge creates a merge commit.
- Fast-forward copies commits or changes their IDs.
- Any edits to the same file conflict.
- “Ours” means the branch named main.
- Editing conflict markers alone completes resolution.
- A merge commit has the merge base as a parent.

### Family `merge_case_classify`

**Task.** Classify a merge as up-to-date, fast-forward, divergent three-way, or rejected by `--ff-only`.

**Response and template.** Single choice: `While on {current}, merge {other} under {option}. What graph case applies?`

**Derivation.** Test ancestor relations between current and other tips, then apply option constraint.

**Difficulty.** L1 ancestor; L2 divergence; L3 option changes outcome.

**Examples.**

1. main C, topic B with `C→B`; merge topic into main → already up to date. L1.
2. main B, topic D with `D→C→B`; merge topic → fast-forward possible. L2.
3. main C and topic D are siblings from B; `merge --ff-only topic` → rejected because neither tip is ancestor of the other. L3.

**Distractors and validation.** Always merge commit or branch-name priority. Ancestor oracle plus option rule.

### Family `fast_forward_effect`

**Task.** Predict refs, `HEAD`, and graph after a fast-forward.

**Response and template.** Ref map: `Fast-forward {current_branch} from {old} to {other_tip}.`

**Derivation.** Move current branch ref to existing descendant; create no commit; target branch/ref does not move.

**Difficulty.** L1 one descendant; L2 several commits; L3 remote-tracking/local distinction.

**Examples.**

1. main B, topic C→B; merge topic → main C, topic C, no new commit. L1.
2. main A, topic D→C→B→A → main moves directly to D; B/C/D IDs unchanged. L2.
3. main B, origin/main D descendant; fast-forward main to origin/main → main D and origin/main remains D. L3.

**Distractors and validation.** Create copied C' or move only HEAD detached. Ref delta and commit-count invariant.

### Family `no_ff_merge_effect`

**Task.** Predict graph produced by forcing a merge commit in a fast-forwardable case.

**Response and template.** Graph/parents: `While on {current_tip}, merge --no-ff {other_tip}.`

**Derivation.** Create new commit with parents `(current_tip,other_tip)` and merged tree; move current branch.

**Difficulty.** L1 one topic commit; L2 several; L3 distinguish first-parent history.

**Examples.**

1. main B, topic C→B; `--no-ff` creates M parents `(B,C)` and moves main to M. L1.
2. topic D→C→B; M parents `(B,D)`, not `(B,C)`. L2.
3. first-parent of M is old main B; `M^2` is topic tip D. L3.

**Distractors and validation.** Parent is merge base twice or topic branch moves. Parent/ref oracle.

### Family `three_way_tree_merge`

**Task.** Compute a clean merged tree from base/ours/theirs snapshots.

**Response and template.** Tree map: `Merge trees B={base}, O={ours}, T={theirs}.`

**Derivation.** Apply path rules and prevalidated independent line combination.

**Difficulty.** L1 different paths; L2 one side unchanged per path; L3 independent lines in same file.

**Examples.**

1. base `{a:1,b:1}`, ours `{a:2,b:1}`, theirs `{a:1,b:3}` → `{a:2,b:3}`. L1.
2. base/ours `x:red`, theirs `x:blue` → take theirs blue. L2.
3. base file lines `[red,blue]`, ours `[green,blue]`, theirs `[red,black]` → merged `[green,black]`. L3.

**Distractors and validation.** Choose whole ours/theirs tree or call every same-file edit conflict. Independent rule engine plus curated merge fixtures.

### Family `merge_conflict_identify`

**Task.** Identify exactly which paths conflict under the bounded three-way model.

**Response and template.** Path set: `Which paths conflict for B/O/T?`

**Derivation.** Apply equality rules; conflicting incompatible changes lack a unique automatic result.

**Difficulty.** L1 same line changed differently; L2 modify/delete; L3 mix clean/conflicting paths.

**Examples.**

1. base x=red, ours x=green, theirs x=blue → x conflicts. L1.
2. base x=red, ours deletes x, theirs changes x=blue → x modify/delete conflict. L2.
3. a changed only ours, b changed only theirs, c changed differently both → only c conflicts. L3.

**Distractors and validation.** Every changed path conflicts or one named branch always wins. Exhaust per-path classification.

### Family `conflict_index_stages`

**Task.** Read/construct stage 1/2/3 entries and ours/theirs labels during a merge.

**Response and template.** Stage map: `While on {current} merging {other}, fill index stages for {path}.`

**Derivation.** Stage1=base, stage2=current/ours, stage3=other/theirs.

**Difficulty.** L1 values shown; L2 branch names that tempt reversal; L3 deletion represented as absent stage.

**Examples.**

1. base red, main(ours) green, topic(theirs) blue → stages `{1:red,2:green,3:blue}`. L1.
2. while on topic T merging main C, ours is topic T and theirs is main C. L2.
3. base red, ours deletes, theirs blue → stage1 red, stage2 absent, stage3 blue. L3.

**Distractors and validation.** Ours=main always or stage1=current. Saved merge-state oracle.

### Family `resolve_conflict_complete`

**Task.** Trace writing a resolution, staging it, and completing the merge.

**Response and template.** Ordered states: `Resolve {conflict_state} using {chosen_content}; what steps/state follow?`

**Derivation.** Write working content; add path to stage0/removing conflict stages; require all conflicts resolved; commit with saved parents.

**Difficulty.** L1 one conflict; L2 several; L3 staged resolution changed again in work.

**Examples.**

1. x stages red/green/blue; write purple then add x → stage0 purple, x resolved. L1.
2. x and y conflict; add resolved x only → merge remains uncommittable because y unresolved. L2.
3. add x=purple, then edit work x=orange before merge commit → merge commit stores staged purple; orange remains unstaged afterward. L3.

**Distractors and validation.** Delete markers means staged, or commit reads orange. Index-stage/commit oracle.

### Family `merge_abort_effect`

**Task.** Predict state after aborting a generated in-progress merge.

**Response and template.** Repository state: `Abort {merge_state}; restore which refs/index/work?`

**Derivation.** Restore exact saved pre-merge state; remove merge metadata; other refs unchanged.

**Difficulty.** L1 conflict immediately; L2 some resolutions staged; L3 distinguish abort from commit/reset.

**Examples.**

1. pre-merge main C clean; conflict merging topic D; abort → main/HEAD C, index/work C tree. L1.
2. after resolving/staging x, abort still restores pre-merge x, not the resolution. L2.
3. topic ref D never moved during attempted merge and remains D after abort. L3.

**Distractors and validation.** Move main to base or retain staged resolution. Snapshot restoration equality.

### Cross-family progression

Classify graph case before predicting effects. Fast-forward and forced merge commit precede general three-way trees. Conflict identification precedes stage labels, then resolution/abort. Ours/theirs questions rotate branch names deliberately.

## 6. Category: Undo, replay, rewriting, stash, and recovery

### Category purpose

Train selection and prediction of operations that undo state, reuse patches, rewrite local history, or recover lost names.

### Learn

Restore copies file state; reset moves a ref and may also replace index/work; revert creates a new inverse commit. Cherry-pick and rebase copy changes into new commits. Reflog records where local refs/`HEAD` recently pointed. Publication and uncommitted work determine which option is safe.

### Prerequisites

Three state layers, ref movement, patches, ancestry, and conflicts.

### Category boundaries

All rewrite/recovery operations are synthetic. Linear rebase excludes merges. Reflog expiry and object pruning are not modeled.

### Common misconceptions

- Reset edits an existing commit.
- Soft/mixed/hard differ only in danger level, not destinations.
- Revert moves the branch backward.
- Cherry-pick moves the source branch.
- Rebase preserves commit IDs.
- Stash is a branch/remote backup.
- Reflog is shared with collaborators.

### Family `reset_mode_effect`

**Task.** Predict branch, index, and working tree after soft/mixed/hard reset.

**Response and template.** Three-layer state: `On {branch}, reset {mode} to {target}.`

**Derivation.** Apply the normative destination table; recompute staged/unstaged changes.

**Difficulty.** L1 soft; L2 mixed; L3 compare all modes/untracked.

**Examples.**

1. main C tree v3, reset --soft B tree v2 → main B; index/work remain v3, so v2→v3 staged. L1.
2. same initial, mixed reset B → main/index v2; work v3, so v2→v3 unstaged. L2.
3. hard reset B → main/index/tracked work v2; displayed untracked note.tmp remains. L3.

**Distractors and validation.** Soft changes work or hard deletes every untracked file. Layer transition oracle.

### Family `revert_commit_effect`

**Task.** Predict tree/graph after reverting a nonmerge commit.

**Response and template.** Tree/graph: `At {tip}, revert {commit}.`

**Derivation.** Compute commit’s parent→commit patch, invert it against current tree, and create a new child commit when clean.

**Difficulty.** L1 revert tip; L2 later unrelated changes; L3 overlapping patch conflict.

**Examples.**

1. A a=1; B changes a=2; at B revert B → new C tree a=1, parent B. L1.
2. C after B adds b=x; revert B at C → D tree `{a:1,b:x}`. L2.
3. later C changes a=3 after B’s a=2; reverting B cannot cleanly replace 2→1 and enters a conflict in the declared patch model. L3.

**Distractors and validation.** Move branch to A or delete B. Inverse patch plus graph oracle.

### Family `cherry_pick_effect`

**Task.** Apply a selected commit’s patch onto another tip.

**Response and template.** Tree/graph: `While on {target_branch}, cherry-pick {source_commit}.`

**Derivation.** Diff selected commit against its parent; apply to target tree; create new commit with target tip parent; source refs unchanged.

**Difficulty.** L1 independent add; L2 same patch/new ID; L3 conflict.

**Examples.**

1. topic T adds b=x to base A; main B changes a only; cherry-pick T → new C parent B with b=x. L1.
2. C carries T’s patch but C≠T because parent/metadata differ; topic still points T. L2.
3. T changes a:1→2 but main already changes a:1→3 → generated cherry-pick conflicts on a. L3.

**Distractors and validation.** Move topic or reuse T ID. Patch application/identity oracle.

### Family `linear_rebase_graph`

**Task.** Draw/predict commit IDs and refs after clean linear rebase.

**Response and template.** DAG/ref map: `Rebase {branch} onto {target} in {dag}.`

**Derivation.** Find base; collect branch-unique first-parent commits oldest-first; replay each onto target as new IDs; move rebased branch.

**Difficulty.** L1 one commit; L2 several; L3 old commits remain reachable elsewhere/reflog.

**Examples.**

1. base A; main B; topic T from A → rebase topic onto B creates T'→B and topic→T'. L1.
2. topic T1→A, T2→T1; rebase onto B creates T1'→B, T2'→T1'; topic T2'. L2.
3. tag old→T2 means old T1/T2 remain tag-reachable after topic moves to T2'. L3.

**Distractors and validation.** Move main, preserve T IDs, or merge B into topic. Replay simulator/reachability.

### Family `rebase_patch_result`

**Task.** Predict final tree or conflict while replaying commits onto a changed base.

**Response and template.** Tree/outcome: `Replay patches {patches} from {old_base} onto {new_base}.`

**Derivation.** Apply patches sequentially in original order to evolving new tree; stop at first incompatible patch.

**Difficulty.** L1 independent paths; L2 patch depends on earlier replay; L3 target overlaps.

**Examples.**

1. T adds b=x; new base changes a → T' contains both target a change and b=x. L1.
2. T1 adds b=1; T2 changes b:1→2 → replay order yields b=2. L2.
3. T changes a:red→green while new base changes a:red→blue → conflict at T'. L3.

**Distractors and validation.** Use old full snapshot and discard target changes. Sequential patch oracle.

### Family `amend_effect`

**Task.** Predict replacement commit, tree, and ref after amend.

**Response and template.** Commit/ref state: `At {tip}, amend with {index_tree/message_change}.`

**Derivation.** Create new commit with old tip’s parent list and current index tree/new metadata; move current branch; old commit remains in reflog.

**Difficulty.** L1 message only; L2 staged tree change; L3 merge commit parent preservation/publication consequence.

**Examples.**

1. main C parent B; amend message only → main C', parent B, same tree, C≠C'. L1.
2. C tree a=1, index a=2; amend → C' tree a=2 with C’s parent. L2.
3. amend merge M parents `(C,T)` → M' retains `(C,T)` but new ID; publishing M then replacing it rewrites shared history. L3.

**Distractors and validation.** Add child commit or mutate C. Complete commit-record comparison.

### Family `reflog_recover_ref`

**Task.** Recover a displayed lost commit by creating/moving a ref from reflog evidence.

**Response and template.** Commit/ref choice: `Given current refs and reflog {entries}, which commit/name recovers {lost_work}?`

**Derivation.** Select entry whose tree/history contains target; create a new branch/ref there without first discarding current state.

**Difficulty.** L1 detached commit; L2 reset old tip; L3 choose among similar entries by tree.

**Examples.**

1. detached D lost after switching main; reflog shows `HEAD@{1}=D` → create rescue at D. L1.
2. main reset C→A; reflog old entry C → branch recover C preserves current main A and names old history. L2.
3. entries C(tree a=2) and D(tree a=3); requested lost a=3 → recover D, not merely most recent label shown in prompt. L3.

**Distractors and validation.** Use current HEAD or assume remote reflog. Tree/reachability check.

### Family `stash_push_effect`

**Task.** Predict stash entry and cleaned state after modeled `stash push` with/without `-u`.

**Response and template.** Stash/index/work state: `Stash {state} using {options}.`

**Derivation.** Store base plus tracked index/work deltas; include nonignored untracked only with `-u`; restore tracked index/work to HEAD.

**Difficulty.** L1 unstaged tracked; L2 staged+unstaged; L3 untracked/ignored.

**Examples.**

1. HEAD/index a=1, work a=2; stash push → stash records work delta, index/work return a=1. L1.
2. HEAD a=1,index a=2,work a=3 → stash stores distinct staged 1→2 and working 2→3 layers. L2.
3. untracked b and ignored tmp; `stash push -u` stores b but not tmp; tmp remains in work. L3.

**Distractors and validation.** Stash creates commit on branch or default includes untracked. Save/restore round trip.

### Family `stash_apply_pop_effect`

**Task.** Predict working/index and stash list after apply/pop success or conflict.

**Response and template.** State/list: `Apply or pop {stash_entry} onto {current_state}.`

**Derivation.** Three-way apply stored deltas under the fixture. Default form restores working changes without promising saved staging; `--index` restores the saved index layer when clean. Apply retains the entry; successful pop removes it; conflicting pop retains it.

**Difficulty.** L1 clean apply; L2 clean pop; L3 conflict retention.

**Examples.**

1. default apply S containing a tracked `a:1→2` change onto a compatible clean base → work a=2, entry S remains, and the change is unstaged. L1.
2. `pop --index` S that saved staged a=2 and working a=3 → index a=2, work a=3, and S is removed after the clean apply. L2.
3. current a=blue conflicts with S change red→green; pop conflicts and S remains available. L3.

**Distractors and validation.** Apply drops entry or conflicting pop loses it. Stash list/state invariant.

### Family `undo_operation_select`

**Task.** Choose restore/reset/revert/amend/reflog operation for an exact intent and collaboration constraint.

**Response and template.** Single choice: `Goal: {goal}; state: {state}; publication: {publication}. Which operation best matches?`

**Derivation.** Map target layer/history effect and whether shared commits may be rewritten.

**Difficulty.** L1 discard unstaged/unstage; L2 local commit rewrite; L3 published commit/recovery.

**Examples.**

1. Discard unstaged a while keeping staged state → `restore a`. L1.
2. Last commit is local, keep its changes staged but move branch to parent → `reset --soft HEAD^`. L2.
3. Bad commit C is already shared and must remain in history → `revert C`, not reset/rebase. L3.

**Distractors and validation.** Commands with wrong layer or unsafe rewrite. Effect signatures plus publication policy.

### Cross-family progression

Reset’s layer table precedes operation choice. Revert and cherry-pick teach inverse/forward patch application before rebase. Amend and rebase are paired with identity/publication questions. Reflog and stash are recovery tools, not excuses to skip state inspection.

## 7. Category: Remotes, synchronization, and push safety

### Category purpose

Train separation of local branches, cached remote-tracking refs, and actual remote refs while predicting synchronization operations.

### Learn

Fetch updates the local record of remote history. It does not merge into the current branch. Push asks the remote to move a ref and normally requires a fast-forward. Pull is fetch plus an explicit integration policy in this app.

### Prerequisites

Ancestry, refs, fast-forward, merge, rebase, and publication safety.

### Category boundaries

Authentication and server policy are supplied facts. Network failures, protocol details, provider UI, and configuration-dependent pull behavior are excluded.

### Common misconceptions

- `origin/main` is the live remote branch.
- Fetch changes local main or working files.
- Push uploads only the latest commit rather than all required reachable objects/ref update.
- Pull is a primitive with one universal graph effect.
- Same commit count means branches are synchronized.
- `--force-with-lease` always succeeds safely.

### Family `remote_tracking_staleness`

**Task.** Distinguish local branch, local remote-tracking ref, and actual advertised remote ref before fetch.

**Response and template.** Commit mapping: `At time {time}, resolve {local_branch}, {tracking_ref}, and {remote_ref}.`

**Derivation.** Read each separate state store; do not update cached tracking ref until fetch.

**Difficulty.** L1 all equal; L2 remote advanced; L3 local and remote both advanced.

**Examples.**

1. main B, origin/main B, remote main B → all B. L1.
2. collaborator advances remote main to D; before fetch origin/main remains B. L2.
3. local main C, cached origin/main B, actual remote main D → the three names resolve to C, B, and D respectively. L3.

**Distractors and validation.** Tracking ref updates continuously or local main equals remote. Typed store lookup.

### Family `fetch_effect`

**Task.** Predict refs/index/work after fetching a displayed remote state.

**Response and template.** State delta: `Fetch {remote} with advertised refs {remote_refs}.`

**Derivation.** Update matching remote-tracking refs; add required commit objects; leave local branches, HEAD, index, and work unchanged.

**Difficulty.** L1 one branch advances; L2 new remote branch; L3 remote branch rewound/deleted with declared mapping/prune option.

**Examples.**

1. main C, origin/main B, remote main D → fetch makes origin/main D; main stays C. L1.
2. remote adds topic T; fetch mapping creates origin/topic T without creating local topic. L2.
3. remote deletes old; `fetch --prune` removes origin/old, while local branch old remains unchanged. L3.

**Distractors and validation.** Fast-forward main automatically or delete local branch on prune. Ref namespace transition.

### Family `ahead_behind_count`

**Task.** Count commits reachable only from local tip and only from upstream tip.

**Response and template.** Two integers: `How many commits is {local} ahead/behind {upstream}?`

**Derivation.** Ahead=`reachable(local)−reachable(upstream)`; behind is reverse difference.

**Difficulty.** L1 one side ahead; L2 divergence; L3 merge reachability.

**Examples.**

1. origin/main B, main D→C→B → ahead2, behind0. L1.
2. B splits to main C and origin/main D → ahead1, behind1. L2.
3. main M merges local C and upstream D, with M parents `(C,D)` → relative to D, main ahead commits `{C,M}`=2 and behind0. L3.

**Distractors and validation.** Difference in graph depth or count shared commits. Reachability-set oracle.

### Family `upstream_ref_reasoning`

**Task.** Determine which remote/ref an argument-free status/pull/push comparison uses under displayed configuration.

**Response and template.** Ref/destination: `Branch {branch} has upstream {upstream}; what does {operation} compare/use?`

**Derivation.** Resolve explicit upstream mapping; do not infer by matching branch names when mapping is shown.

**Difficulty.** L1 matching names; L2 differently named upstream; L3 no upstream yields modeled error/need explicit target.

**Examples.**

1. main upstream origin/main → status ahead/behind compares those tips. L1.
2. local release upstream central/stable → argument-free modeled pull integrates central/stable, not origin/release. L2.
3. local scratch has no upstream → an operation requiring it is rejected in this model until target/config is explicit. L3.

**Distractors and validation.** Always origin/same-name branch. Config lookup.

### Family `push_fast_forward_decision`

**Task.** Decide whether a normal push ref update is accepted and identify remote result.

**Response and template.** Accept/reject plus ref: `Push local {source_tip} to remote {destination} currently {old_tip}.`

**Derivation.** Accept new destination or when old tip is ancestor of source; otherwise reject without remote change.

**Difficulty.** L1 fast-forward; L2 non-fast-forward divergence; L3 new branch/deletion excluded.

**Examples.**

1. remote main B, local main C→B → accepted; remote main becomes C. L1.
2. remote main D and local main C are siblings from B → normal push rejected; remote remains D. L2.
3. remote lacks refs/heads/topic; push local T creates remote topic at T under declared permission. L3.

**Distractors and validation.** Most recent timestamp wins or push merges remotely. Ancestor/ref-update oracle.

### Family `force_with_lease_decision`

**Task.** Evaluate a non-fast-forward update protected by an explicit expected old tip.

**Response and template.** Accept/reject: `Push {new_tip} with lease expecting {expected}; remote is actually {actual}.`

**Derivation.** First require actual=expected; if equal, apply forced ref update; otherwise reject.

**Difficulty.** L1 matching lease; L2 stale lease; L3 multiple destinations each with lease.

**Examples.**

1. expect D, actual D, rewrite destination to C → lease passes; remote moves to C. L1.
2. expect D, collaborator advanced actual to E → reject and preserve E. L2.
3. An explicit atomic two-ref push has a matching main lease but stale topic lease → reject both ref updates. L3.

**Distractors and validation.** Lease checks new tip or always permits own rewrite. Compare-and-swap oracle.

### Family `pull_ff_only_effect`

**Task.** Predict fetch plus `--ff-only` integration.

**Response and template.** Graph/state: `On {branch}, pull --ff-only from {upstream_state}.`

**Derivation.** Fetch tracking ref, then fast-forward local branch only if its old tip is ancestor of fetched tip; otherwise reject integration.

**Difficulty.** L1 behind; L2 already ahead/up to date; L3 divergence.

**Examples.**

1. local main B, remote D→C→B → tracking ref and main become D; no new commit. L1.
2. local main D already contains remote B → fetch then integration is up to date; main D. L2.
3. local C and fetched D are siblings from B → ff-only rejects; main/work stay C while origin/main updates D. L3.

**Distractors and validation.** Roll local back when ahead or merge divergence. Fetch-then-ancestor simulation.

### Family `pull_merge_effect`

**Task.** Predict `pull --no-rebase` as fetch followed by merge.

**Response and template.** Graph/ref state: `On {branch}, pull --no-rebase from {remote_tip}.`

**Derivation.** Fetch; apply merge case rules; create merge commit only for clean divergence.

**Difficulty.** L1 fast-forward; L2 divergence clean; L3 conflict/in-progress.

**Examples.**

1. local B, remote C→B → fast-forward local to C. L1.
2. local C and remote D siblings from B, clean trees → create M parents `(C,D)` and move local main M; origin/main remains D. L2.
3. both change x differently from B → fetch succeeds to origin/main D, merge conflicts, local main remains C until resolution commit. L3.

**Distractors and validation.** origin/main moves to M or remote gets local merge immediately. Composed fetch/merge oracle.

### Family `pull_rebase_effect`

**Task.** Predict `pull --rebase` as fetch followed by linear rebase of local-only commits.

**Response and template.** Graph/ref state: `On {branch}, pull --rebase from {remote_tip}.`

**Derivation.** Fetch; replay local-only first-parent commits oldest-first onto fetched upstream; move local branch; tracking ref stays at remote tip.

**Difficulty.** L1 one local commit; L2 several; L3 conflict.

**Examples.**

1. base B; local C; remote D from B → after fetch/rebase, C'→D, main C', origin/main D. L1.
2. local C1→B,C2→C1 and remote D→B → D-C1'-C2', main C2'. L2.
3. C and D change x differently → fetch updates origin/main D; rebase stops with detached HEAD at D plus C’s conflict, while local main remains at pre-rebase C until completion in this model. L3.

**Distractors and validation.** Merge commit or rewrite remote D. Composed fetch/rebase simulator.

### Family `clone_initial_state`

**Task.** Construct the initial local refs/HEAD/index/work after cloning a displayed remote.

**Response and template.** Repository state: `Clone {remote} whose default branch is {default_ref}.`

**Derivation.** Copy reachable commits; create remote-tracking refs; create/check out local default branch at remote default tip; index/work equal that tree.

**Difficulty.** L1 one branch; L2 several remote branches; L3 default branch not named main.

**Examples.**

1. remote main C default → local main C, origin/main C, HEAD→main, clean tree C. L1.
2. remote also topic T → origin/topic T exists; no local topic is created by default. L2.
3. default remote ref trunk D → local trunk D and HEAD→trunk; do not invent main. L3.

**Distractors and validation.** Local branch for every remote branch or detached HEAD. Initial-state invariant check.

### Cross-family progression

Staleness and fetch precede ahead/behind. Upstream mapping precedes argument-free operations. Normal push precedes force-with-lease. Pull modes remain separate until fetch plus each integration operation is mastered, then are interleaved for contrast.

## 8. Category: Commit design and collaboration reasoning

### Category purpose

Train transformation of a mixed working change into reviewable, dependency-correct history and selection of collaboration-safe integration behavior.

### Learn

A useful commit is a coherent state transition: tests and implementation that belong together, without unrelated cleanup. History design must respect dependencies and whether others already rely on existing commit IDs.

### Prerequisites

Index construction, patch application, ranges, merge/rebase, and remote publication.

### Category boundaries

Commit-message prose is not graded. Provider review UI and organization-specific policy are excluded; each scenario supplies its desired properties.

### Common misconceptions

- One file must equal one commit.
- Every working change belongs in the next commit.
- Splitting implementation from required tests always improves review.
- Local history rewriting is always unsafe or shared rewriting is harmless.
- Merge versus rebase is a universal moral choice independent of goals.

### Family `change_unit_partition`

**Task.** Partition generated change units into coherent commits under explicit dependency/topic constraints.

**Response and template.** Ordered grouping: `Group {change_units} into commits satisfying {constraints}.`

**Derivation.** Build must-together and must-separate constraints; find the unique minimal ordered partition generated backward.

**Difficulty.** L1 unrelated topics; L2 test+implementation; L3 refactor prerequisite plus feature.

**Examples.**

1. `{fix parser bug, update parser regression test, reformat README}` → commit1 bug+test, commit2 README. L1.
2. `{rename API, update all callers, add unrelated logging}` → rename+callers together, logging separate. L2.
3. `{behavior-preserving extract helper, feature using helper, feature test, typo}` → ordered commits `[extract]`, `[feature+test]`, `[typo]`. L3.

**Distractors and validation.** Group by file extension or one giant commit. Constraint satisfaction and unique partition.

### Family `commit_dependency_order`

**Task.** Order proposed commits so every intermediate snapshot satisfies displayed build/test dependencies.

**Response and template.** Ordered commit list: `Order {commits} under dependencies {edges}.`

**Derivation.** Topologically sort dependency DAG using supplied tie rule.

**Difficulty.** L1 chain; L2 fork; L3 independent cleanup tie.

**Examples.**

1. API definition before caller update → `[API,caller]`. L1.
2. schema commit before importer and UI, with tie importer before UI → `[schema,importer,UI]`. L2.
3. refactor R before feature F; docs D independent and tie D first → `[D,R,F]`. L3.

**Distractors and validation.** Chronological authoring order or alphabetical without dependencies. DAG/topological-order oracle.

### Family `atomic_commit_assess`

**Task.** Decide whether a proposed commit is coherent under supplied review/revert criteria.

**Response and template.** Yes/no plus issue: `Does commit {change_set} satisfy {atomicity_rule}?`

**Derivation.** Check required companion units, unrelated units, and whether resulting tree passes declared invariant.

**Difficulty.** L1 unrelated change; L2 missing test/migration; L3 coupled cross-file change.

**Examples.**

1. Parser fix plus unrelated color-theme change → not atomic under one-purpose rule. L1.
2. Database schema change without required migration → invalid intermediate commit. L2.
3. Interface rename plus all compile-required caller edits is one coherent cross-file commit despite touching six files. L3.

**Distractors and validation.** Number of files determines atomicity. Constraint/invariant checker.

### Family `review_range_choose`

**Task.** Choose refs/range that isolates the commits intended for review.

**Response and template.** Range/commit set: `Review changes unique to {topic} relative to {base}; which range yields {target_set}?`

**Derivation.** Use reachability-set subtraction and explicit merge-base when required by prompt.

**Difficulty.** L1 `base..topic`; L2 base advanced; L3 topic already partly merged.

**Examples.**

1. main B, topic D→C→B → `main..topic` selects `{C,D}`. L1.
2. main E from B and topic D→C→B → main..topic still selects C,D, excluding main-only E. L2.
3. main M has merged C but topic advanced D→C → `main..topic` selects only D. L3.

**Distractors and validation.** Reverse range or include common history. Reachability oracle.

### Family `integration_strategy_select`

**Task.** Choose fast-forward, merge commit, rebase, or cherry-pick for explicit graph/history goals.

**Response and template.** Single choice: `Given {dag}, {publication}, and {desired_history}, choose the matching integration.`

**Derivation.** Compare operation effect signatures with constraints; exactly one option fits.

**Difficulty.** L1 fast-forward; L2 preserve branch topology versus linearize local work; L3 select one patch only.

**Examples.**

1. main is ancestor of topic and goal is no extra commit → fast-forward. L1.
2. topic commits are local and goal is a linear series atop updated main → rebase topic onto main. L2.
3. Only hotfix H from a five-commit experimental branch is wanted on release → cherry-pick H. L3.

**Distractors and validation.** Strategy chosen by slogan rather than exact goal. Operation signature matcher.

### Family `shared_rewrite_impact`

**Task.** Identify which collaborator refs become divergent after an amend/rebase/reset and what coordination is needed.

**Response and template.** Ref/impact set: `Rewrite published {old_range} to {new_range}; collaborators have {refs}.`

**Derivation.** Compare old/new reachability; any collaborator based on old-only commits retains divergent history.

**Difficulty.** L1 unpublished; L2 one collaborator; L3 mixed branches/tags.

**Examples.**

1. C is not pushed and only local main points to it; amend C→C' affects no collaborator. L1.
2. Bob’s work D→C; Alice rebases published C to C' → Bob still has old C/D and cannot simply fast-forward to C'. L2.
3. tag release→C preserves old C even after branch rewrite; deleting/moving main does not change that tag. L3.

**Distractors and validation.** Server magically rewrites clones or same patch prevents divergence. Per-repository reachability model.

### Family `conflict_risk_compare`

**Task.** Rank generated integration pairs by structural conflict risk using exact touched-path/line evidence, not claim certainty.

**Response and template.** Ranked choice: `Given changes {left_patch} and {right_patch}, which pair has greater modeled overlap risk?`

**Derivation.** Compute overlapping paths/line regions and dependency edges; wording says “higher modeled risk,” not guaranteed conflict.

**Difficulty.** L1 disjoint paths; L2 same file/disjoint lines; L3 refactor changes context used by another patch.

**Examples.**

1. one branch changes a, another changes b → lower direct content-conflict risk than both changing a line1. L1.
2. both edit x but fixed disjoint lines1 and10 → no conflict in current fixture, though same-file risk alone is insufficient. L2.
3. left patch replaces `old()` with `new()` at definition line5 and call line20; right patch edits the `old()` call at line20 → direct overlap at line20 gives higher modeled patch-application risk. L3.

**Distractors and validation.** Number of commits/branch age predicts conflicts. Exact overlap score and fixture merge result.

### Cross-family progression

Change partition and dependency ordering begin with explicit constraints. Atomicity assessment then reverses the task. Review ranges and integration selection reuse graph skills. Shared-rewrite and conflict-risk families make collaboration consequences explicit without declaring one universal workflow.

## 9. Category: Diagnosis, bisect, and safe operational sequences

### Category purpose

Train evidence-first diagnosis of repository state and efficient isolation of a first bad commit.

### Learn

Before changing state, inspect the layer or graph that could explain the symptom. `status`, staged/unstaged diffs, history, and reflog answer different questions. Bisect narrows a known good/bad ancestry interval by testing generated commits.

### Prerequisites

All local/remote state layers, operation-in-progress states, and ancestry.

### Category boundaries

Diagnostics use synthetic repositories and deterministic test outcomes. Hooks, flaky tests, build systems, and real command execution are excluded.

### Common misconceptions

- Start recovery with a destructive reset.
- `status` shows historical commit contents.
- A rejected push means local commits disappeared.
- Continue a merge/rebase while unresolved entries remain.
- Bisect tests commits in chronological order.
- Marking a commit good/bad describes code quality rather than the supplied predicate.

### Family `inspection_command_select`

**Task.** Choose the read-only inspection that directly answers a stated question.

**Response and template.** Single choice: `You need to know {question}; which inspection is most direct?`

**Derivation.** Map question to working/index diff, staged diff, commit tree/history, refs, or reflog.

**Difficulty.** L1 status; L2 two diff layers; L3 lost prior tip.

**Examples.**

1. “Which files are staged versus unstaged?” → status. L1.
2. “What exact patch is staged for next commit?” → staged diff. L2.
3. “Where did main point before my reset?” → reflog for main/HEAD. L3.

**Distractors and validation.** State-changing command or wrong comparison layer. Query-capability matrix.

### Family `operation_state_next_step`

**Task.** Determine whether merge/rebase/cherry-pick can continue, needs staging, or can abort.

**Response and template.** Next action/outcome: `Repository operation state is {state}; what is permitted/required next?`

**Derivation.** Inspect unmerged entries and saved operation todo; require every conflict resolved/staged before continue/commit.

**Difficulty.** L1 one unresolved; L2 all resolved; L3 edit after staging.

**Examples.**

1. merge has unmerged x stages1/2/3 → resolve and add x before commit. L1.
2. rebase conflict resolved and all paths stage0 → continue rebase replays remaining commits. L2.
3. x was staged resolved then edited again in work; operation may continue using staged resolution, but unstaged edit remains and the prompt’s “include latest edit” goal requires add again. L3.

**Distractors and validation.** Continue with unresolved paths or editing implies staging. Operation-state machine.

### Family `push_rejection_diagnose`

**Task.** Diagnose non-fast-forward push rejection and select an evidence-preserving next sequence.

**Response and template.** Reason/ordered actions: `Push {local}→{remote} was rejected with refs {state}; what happened and inspect/integrate next?`

**Derivation.** Confirm remote tip not ancestor of local; fetch current remote; inspect divergence; integrate or consciously coordinate rewrite.

**Difficulty.** L1 simply behind; L2 divergence; L3 stale tracking ref/lease.

**Examples.**

1. remote D→C→B, local B → rejection because local lacks C,D; fetch then fast-forward/integrate. L1.
2. local E and remote D are siblings from C → fetch reveals divergence; merge or rebase according to stated policy before normal push. L2.
3. cached origin/main D but actual remote E → first fetch updates evidence; do not force based on stale D. L3.

**Distractors and validation.** Local commits deleted, retry repeatedly, or plain force. Graph cause plus safe ordered plan.

### Family `bisect_midpoint_choose`

**Task.** Choose the next generated commit that approximately halves a known good/bad linear interval.

**Response and template.** Commit ID: `Good={good}, bad={bad}; which untested commit should be tested next under {tie_rule}?`

**Derivation.** List candidate commits on good-exclusive/bad-inclusive ancestry path; choose declared lower/upper midpoint excluding endpoints already classified when possible.

**Difficulty.** L1 3 candidates; L2 even tie; L3 skipped untestable commit rule supplied.

**Examples.**

1. `A(good)-B-C-D(bad)`, upper-midpoint tie rule → test C. L1.
2. `A(good)-B-C-D-E(bad)` has three unclassified candidates B,C,D → test C. L2.
3. In the same A..E range, C is untestable; valid candidates are B,D and the displayed upper-midpoint rule chooses D next. L3.

**Distractors and validation.** Test next chronological after good or always parent of bad. Ordered-path midpoint oracle.

### Family `bisect_range_update`

**Task.** Update possible first-bad commit set after a deterministic test result.

**Response and template.** Commit interval/set: `Current good/bad bounds {bounds}; test {commit} is {result}. What remains?`

**Derivation.** Predicate is monotonic on generated line: ancestors through last good are good; tested bad and descendants remain on bad side.

**Difficulty.** L1 tested good; L2 tested bad; L3 identify first bad when adjacent.

**Examples.**

1. A good, D bad; test C good → remaining first bad is D. L1.
2. A good, E bad; test C bad → first bad is B or C. L2.
3. B good and C bad adjacent → C is first bad. L3.

**Distractors and validation.** Reverse good/bad half or call tested bad necessarily first bad. Monotonic interval oracle.

### Family `repository_invariant_check`

**Task.** Find an impossible or inconsistent claim in a displayed synthetic state.

**Response and template.** Selected inconsistency: `Which state fact violates git-state-v1 invariants?`

**Derivation.** Check ref targets exist, DAG acyclicity, attached HEAD names existing branch, ordinary index stages, and tree/status consistency.

**Difficulty.** L1 dangling displayed branch; L2 cycle/HEAD; L3 status inconsistent with three trees.

**Examples.**

1. branch main points to missing commit Z → invalid fixture. L1.
2. edges B→C and C→B form a commit-parent cycle → impossible. L2.
3. HEAD/index/work all store a=v1 but status claims staged M → inconsistent. L3.

**Distractors and validation.** Unusual but valid detached/tag state. Full invariant suite with exactly one injected fault.

### Family `safe_sequence_order`

**Task.** Order inspection, preservation, mutation, verification, and publication steps for a bounded goal.

**Response and template.** Ordered sequence: `Arrange {actions} to accomplish {goal} under {constraints}.`

**Derivation.** Enforce prerequisite/state edges; read-only evidence and preservation precede destructive/rewrite steps; verification precedes push.

**Difficulty.** L1 inspect then act; L2 save dirty work/integrate; L3 recover and publish.

**Examples.**

1. Goal inspect then discard unstaged a → `[diff a,restore a,status]`. L1.
2. Dirty work, need update with ff-only: `[stash push,pull --ff-only,stash apply,verify]` under the supplied clean-fetch/clean-apply fixture. L2.
3. Recover pre-reset C and keep current A: `[inspect reflog,create recover branch at C,verify tree]`; no hard reset is needed. L3.

**Distractors and validation.** Destructive action first, push before verification, or discard current ref. Dependency DAG and final-state simulation.

### Cross-family progression

Inspection choice precedes diagnosis. Operation-state questions reuse conflict/index knowledge. Push rejection joins remote evidence with integration policy. Bisect is introduced only after ancestry paths. Invariant and safe-sequence families serve as capstones that reward cautious, evidence-backed state changes.

## 10. Topic-wide progression

Recommended order:

1. commits as snapshots, parent edges, branches, and attached `HEAD`;
2. `HEAD`/index/working-tree comparisons and named status states;
3. add, diff, commit, restore, and tracked/untracked/ignored paths;
4. branch creation/switching, divergence, ancestry, and revision selection;
5. merge case classification and fast-forward movement;
6. three-way trees, conflicts, index stages, resolution, and abort;
7. reset layer effects, revert, cherry-pick, and amend;
8. linear rebase, reflog, stash, and publication-aware undo choice;
9. remote-tracking refs, fetch, ahead/behind, normal push, and lease protection;
10. explicit pull modes and clone/upstream state;
11. commit partitioning, review ranges, integration strategy, and shared rewrite impact;
12. diagnosis, bisect, invariant checking, and safe operational sequences.

Prerequisite gates:

- snapshot/tree understanding gates index and commit construction;
- ref/`HEAD` resolution gates branching and reset;
- three-layer status gates restore, stash, conflicts, and diagnostics;
- ancestry gates merge classification, ranges, push acceptance, and bisect;
- merge-base reasoning gates three-way merge and rebase;
- index conflict stages gate continue/abort questions;
- patch semantics gate revert, cherry-pick, and rebase;
- commit identity gates rewrite/publication consequences;
- fetch/remote-tracking distinction gates every pull/push diagnosis;
- local rewrite mastery gates collaboration strategy.

Interleave:

- snapshot versus patch descriptions;
- attached and detached `HEAD`;
- staged and unstaged changes on the same path;
- create/switch/commit branch sequences;
- up-to-date, fast-forward, and divergence cases;
- clean and conflicting applications of the same operation;
- reset/revert/restore goals;
- same patch with different commit identity;
- local branch, tracking ref, and actual remote ref;
- normal push acceptance/rejection;
- merge/rebase choices under different stated goals;
- evidence-first recovery and tempting destructive distractors.

No generated question should require tracking more than:

- 10 commits at Levels 1–3 or 14 at Levels 4–5;
- 6 refs across all namespaces;
- 6 paths, with at most 3 changed paths;
- 3 simultaneous state layers;
- 3 collaborators/repositories;
- one in-progress Git operation.

## 11. Adaptive practice guidance

Track:

`family`, `stateLayer`, `pathState`, `refType`, `headMode`, `graphShape`, `ancestryRelation`, `operation`, `operationPhase`, `publicationState`, `remoteState`, `conflictType`, `representation`, `safetyConstraint`, `misconception`, and `difficultyDimension`.

| Error pattern | Likely misconception | Follow-up |
|---|---|---|
| returns only changed files for a commit | commit=patch | parent patch versus full tree |
| says all branches move on commit | branch=workspace timeline | alternate-branch trace |
| tag follows main | tag treated as release branch | tag/branch same-tip contrast |
| loses detached commit immediately | no ref versus no object | reflog/recovery trace |
| compares only HEAD/work | index omitted | one path with three values |
| reverses status X/Y | diff directions reversed | named state before code |
| says default diff shows staged patch | diff layer confusion | paired diff commands |
| commit stores latest work | commit bypasses index | staged v2/work v3 diagnostic |
| ignore rule untracks file | ignore=delete/untrack | tracked plus new ignored path |
| branch creation makes commit | ref/object conflation | ref-only transition |
| `^2` means two generations | parent number/generation conflation | merge parent selector |
| every merge creates M | ancestor classification skipped | up-to-date/ff contrasts |
| same-file edits always conflict | file-level rather than three-way/line | independent-line merge |
| ours always means main | branch-name role fixation | merge while on topic |
| edits markers then commits | work/index conflict state omitted | add resolution step |
| soft/mixed/hard all alter files | reset destination table missing | three modes same fixture |
| revert moves branch backward | inverse commit/reset conflation | published undo contrast |
| cherry-pick moves source branch | patch/ref conflation | source/target refs shown |
| rebase preserves IDs | patch identity=commit identity | old/new graph pairing |
| stash assumed remote backup | local temporary state confused | stash versus branch/commit |
| origin/main follows server live | tracking ref cache omitted | before/after fetch |
| fetch changes main/work | fetch=integration | fetch-only ref delta |
| ahead/behind uses graph depth | reachability counts omitted | sibling/merge set subtraction |
| push merges on server | push=integration | normal ref-update rule |
| lease compared to local base | CAS expectation misunderstood | expected/actual remote pair |
| pull has one result | strategy omitted | same divergence under 3 modes |
| rewrite published history casually | collaborator refs omitted | shared reachability impact |
| force is first answer to rejection | evidence/preservation skipped | fetch-inspect-integrate order |
| bisect tests sequentially | binary narrowing omitted | explicit interval midpoint |

Selection after sufficient history:

- 30% weakest family/misconception;
- 20% spaced mastery;
- 15% inverse or missing-state reconstruction;
- 15% same operation under a different graph/state shape;
- 10% safety/publication diagnostics;
- 10% mixed local/remote or recovery sequences.

Slow but correct state-layer answers should retain conceptual mastery and add visual alignment scaffolds. Fast command-choice answers with weak state prediction should not count as mastery: the learner must also predict the chosen command’s effect.

When a mixed question fails, decompose it into:

1. resolve refs;
2. classify graph relation;
3. identify affected state layers;
4. apply one operation;
5. recompute status/reachability.

## 12. Feedback and worked solutions

Worked solutions should:

1. show the initial DAG and resolve every relevant ref;
2. state whether `HEAD` is attached or detached;
3. display HEAD/index/work values for affected paths;
4. classify ancestry/merge relationship before applying an integration;
5. list exactly which refs, trees, or state layers change;
6. show created commits with ordered parents and new IDs;
7. recompute status/reachability/ahead-behind after the operation;
8. state any discarded/rewrite effect and recovery route;
9. distinguish local tracking state from actual remote state.

Diagnostic examples:

> Your answer committed `v3`, but the index still contains `v2`. A commit snapshots the index; `v3` remains an unstaged working-tree change.

> Fetch moved `origin/main` to D. It did not move local `main`, which still points to C.

> No merge commit is needed: current B is an ancestor of topic D, so the current branch can move directly to the existing D.

> “Ours” is the branch checked out when this merge began. Here you were on `topic`, so stage 2 is topic’s value.

> `reset --soft B` moves the branch only. The old C tree remains in the index, so C’s change becomes staged relative to B.

> Rebase copied the patches onto a different parent. The new commits are C' and D'; the old C and D were not edited.

> The normal push was rejected because remote D is not an ancestor of local C. Fetch first so the local graph includes the collaborator’s tip before selecting merge or rebase.

> The commit still exists in the displayed reflog even though no current branch names it. Create a rescue branch at D before making another risky ref change.

Correct feedback should confirm the key state transition in one or two sentences. Incorrect feedback should identify the mistaken mental model and show the decisive layer/edge/ref, not merely reveal a command.

## 13. Rendering, interaction, and accessibility

- Commit DAGs use SVG or semantic HTML with a parallel text edge list.
- Graph layout never encodes ancestry solely by left/right position; arrows and parent lists are explicit.
- Every ref label attaches to a precise commit and exposes text such as `branch main points to C`.
- Attached and detached `HEAD` use distinct shapes plus text, not color alone.
- Commit trees render as path/value tables; diffs show explicit source and destination layers.
- HEAD/index/work comparisons align in columns and remain readable without monospace layout.
- Status codes include accessible expansions such as `X=M: staged modification`.
- Conflict stages label `base`, `ours/current branch`, and `theirs/merged branch` with actual branch names.
- Working conflict markers are supplementary; a structured three-pane base/ours/theirs view is primary.
- Remote, remote-tracking, and local refs use both namespace labels and visual grouping.
- Created/replayed commits animate only optionally; reduced-motion users receive the final graph plus transition list.
- Destructive simulated effects use explicit text and affected-path lists, never warning color alone.
- Ordered command/operation exercises support keyboard reordering and a text-list alternative.

## 14. Generator and implementation requirements

### State engine

Implement immutable state transitions over:

- DAG commits and full trees;
- typed refs and symbolic/detached `HEAD`;
- index stages 0–3;
- working/untracked/ignored paths;
- operation-in-progress metadata;
- local reflogs/stashes;
- remote advertised refs, remote-tracking refs, upstreams, and leases.

Every operation returns:

`nextState`, `createdObjects`, `movedRefs`, `changedIndexPaths`, `changedWorkingPaths`, `operationStatus`, `warnings`, and `derivationTrace`.

A rejected operation returns byte-for-byte/structure-equal state except where the normative composed operation explicitly completed an earlier phase—for example, a pull whose fetch succeeds before integration rejects.

### Graph and patch engine

- Generate acyclic DAGs by choosing parents only from existing older nodes.
- Store complete commit trees even when displaying patches.
- Derive patches by tree comparison; never make displayed patch disagree with stored trees.
- Assign synthetic IDs only after content/parent metadata is finalized.
- Use reachability sets for ancestor, range, ahead/behind, and deletion questions.
- Generate unique merge bases or reject.
- Three-way merge paths from exact base/ours/theirs values.
- Same-file line auto-merges use curated nonoverlapping edits; conflicts use curated overlapping contexts.
- Rebase/cherry-pick/revert apply explicit patches sequentially and stop at first declared conflict.
- Do not model rename detection. A move is stored/displayed as delete+add, with optional human interpretation clearly separated.

### Constrained command grammar

If typed commands are accepted, support only:

```text
git status
git diff [--staged] [-- path]
git add <path> | git add -u | git add -A
git commit [--amend]
git restore [--staged] <path>
git branch <name> [<start>]
git switch <name> | git switch -c <name>
git merge [--ff-only|--no-ff] <ref>
git merge --continue | git merge --abort
git reset [--soft|--mixed|--hard] <ref>
git revert <ref>
git cherry-pick <ref>
git rebase <ref> | git rebase --continue | git rebase --abort
git stash push [-u] | git stash apply [--index] | git stash pop [--index]
git fetch <remote> [--prune]
git pull --ff-only|--no-rebase|--rebase
git push [--atomic] [--force-with-lease=<ref>:<expected>] <remote> <source>:<destination>
```

The grammar receives token fields directly and does not parse shell quoting. Prefer buttons/structured fields for early levels. Do not accept arbitrary flags and guess their effects.

### Ignore and revision parsers

- Parse the declared `gitignore-v1` subset only.
- Parse commit IDs, ref names, `^`, `^n`, `~n`, and two-dot ranges only.
- Reject three-dot range syntax until a dedicated symmetric-difference/merge-base family is specified.
- Reject abbreviated-ID ambiguity; generated synthetic IDs are already exact.

### Reference validation boundary

Runtime is entirely local and synthetic. It never invokes Git.

Build/test tooling may optionally replay curated clean fixtures in a temporary repository using a pinned documented Git version. Such comparison is a validation aid, not the runtime oracle. Any difference between real Git and `git-state-v1` must either:

- narrow/reject the fixture;
- correct the model;
- or be called out as an intentional educational simplification.

The app must not create/delete files outside its in-memory model and must not accept repository paths or credentials.

### Rejection rules

Reject instances with:

- cycles, missing parent/ref targets, or inconsistent tree/patch records;
- ambiguous graph layout or multiple unlabelled merge bases;
- a command outcome dependent on omitted config/platform/pathspec behavior;
- dirty branch switches not covered by the explicit fixture rule;
- accidental empty commits unless emptiness is the target;
- same final tree offered as proof two histories/commits are identical;
- merge/rebase patch ambiguity or heuristic rename dependence;
- more than one plausible “safest” command under stated constraints;
- force/destructive choice without explicit publication/data-retention facts;
- bisect predicate that is nonmonotonic on the generated range;
- multiple-choice options that differ only cosmetically.

## 15. Automated validation

For every generated instance:

- DAG is acyclic and all commit parents exist;
- every commit tree is complete and matches its displayed parent patch;
- all refs resolve to existing commits unless a broken-state diagnostic intentionally injects exactly one fault;
- attached HEAD names an existing local branch;
- status and diff outputs equal independent three-map comparisons;
- add/restore/commit/reset transitions touch exactly the declared layers;
- commit trees equal index at commit time;
- ref movement creates no hidden commit and commit creation moves only the declared current ref;
- revision expressions and ranges resolve to exact reachability results;
- branch-switch accept/reject fixtures satisfy their overwrite conditions;
- merge classification follows ancestor relationships;
- every clean merge tree satisfies per-path three-way rules;
- every conflict path has stages matching base/ours/theirs;
- resolved merge commits have saved ordered parents and stage-0 tree;
- abort restores the saved pre-operation state exactly;
- reset/revert/cherry-pick/rebase/amend results match independent transition implementations;
- replayed commits receive distinct IDs and correct parents;
- reflog recovery target contains the requested tree/history;
- stash apply/pop preserves or drops the entry according to success and option;
- ignore results match ordered `gitignore-v1` rules;
- fetch changes only remote-tracking/object state;
- ahead/behind counts use reachability set difference;
- normal push and lease decisions preserve remote state on rejection;
- pull equals fetch followed by the named integration mode;
- collaboration partitions satisfy all must-together/separate/dependency constraints;
- bisect midpoint and interval updates obey the displayed tie/skip rule;
- rejected operations preserve state except declared completed fetch phase;
- every choice family has exactly one correct/best answer;
- each distractor reproduces its named misconception.

Property/fuzz minimums:

- 100,000 DAG/ref/HEAD/reachability/range cases;
- 150,000 HEAD/index/work/status/diff transitions;
- 100,000 add/commit/restore/reset/rm/mv/ignore cases;
- 75,000 branch create/switch/delete/revision cases;
- 100,000 merge classifications and clean tree merges;
- 50,000 conflict stage/resolve/abort cases;
- 100,000 revert/cherry-pick/rebase/amend/reflog/stash cases;
- 100,000 fetch/ahead-behind/push/lease/pull cases;
- 50,000 commit-partition/integration/publication scenarios;
- exhaustive bisect intervals up to the supported length and all tie rules;
- all curated reference fixtures compared with the optional pinned Git validator when available.

Seeded generation must reproduce complete state, diagrams, answer, distractor provenance, and worked solution. Model changes increment `modelVersion`; saved questions never silently acquire new semantics.

## 16. Coverage requirements

Balance:

- full snapshots and displayed patches;
- roots, linear commits, siblings, and two-parent merges;
- attached/detached HEAD, branches, tags, and remote-tracking refs;
- clean, staged, unstaged, both-staged-and-unstaged, untracked, ignored, added, and deleted paths;
- default/staged diffs and forward/inverse state questions;
- named add, `-u`, and `-A`;
- clean/rejected branch switching;
- up-to-date, fast-forward, forced merge commit, clean divergence, and conflicts;
- independent-file, independent-line, same-line, and modify/delete merge cases;
- ours/theirs with non-main current branch;
- restore, all reset modes, revert, amend, cherry-pick, and rebase;
- local-only and published rewrite scenarios;
- lost detached commits and reset tips recoverable through reflog;
- stash default/`-u`, apply/pop, clean/conflict, and `--index`;
- fresh/stale remote tracking, upstreams with matching/different names;
- ahead-only, behind-only, diverged, and merged ahead/behind graphs;
- accepted/rejected normal pushes and matching/stale leases;
- all explicit pull modes on ancestor/divergent/conflicting histories;
- coherent/incoherent commit partitions and dependent/independent order;
- read-only diagnosis, operation continuation, push recovery, and bisect.

Within a session:

- suppress exact state repeats for at least 100 items;
- suppress graph-isomorphic structural repeats for at least 20 items;
- avoid more than two consecutive command-choice questions;
- include a state-prediction question after every two syntax/choice questions;
- rotate branch names so `main` is not always current/ours;
- rotate file paths/content labels while preserving clear semantics;
- include rejected/no-op cases regularly but not more than 30% overall;
- after rewrite unlock, include publication status in at least half of rewrite questions;
- after remote unlock, show cached and actual remote refs separately at least once per five remote questions.

## 17. Topic-level quality checklist

- [ ] Commits are full immutable snapshots with explicit parents.
- [ ] Branches/tags/remote-tracking refs are typed movable/immutable names as declared.
- [ ] Attached and detached HEAD behavior is exact.
- [ ] HEAD, index, and working-tree comparisons remain distinct.
- [ ] Commit snapshots the index, including staged-versus-later-working cases.
- [ ] Ignore rules never silently untrack an existing path.
- [ ] Revision expressions and ranges have declared semantics.
- [ ] Merge case is classified from ancestry before content merging.
- [ ] Fast-forward creates no commit and preserves commit IDs.
- [ ] Three-way merge uses exact base/ours/theirs values.
- [ ] Ours/theirs derive from current/merged branch, not branch names.
- [ ] Conflict resolution requires staging before completion.
- [ ] Abort restores the exact saved synthetic state.
- [ ] Reset modes show affected layers and destructive effects.
- [ ] Revert creates an inverse commit rather than moving history.
- [ ] Cherry-pick/rebase copy patches into new commit identities.
- [ ] Amend replaces rather than mutates a commit.
- [ ] Reflog/stash are local recovery aids with explicit limits.
- [ ] Fetch does not move local branches or working files.
- [ ] Remote-tracking refs are cached local refs, not live server views.
- [ ] Push acceptance and force-with-lease use exact ancestry/expected-tip rules.
- [ ] Pull always declares its integration strategy.
- [ ] Shared-history questions include collaborator/publication facts.
- [ ] Destructive actions are simulated, labeled, and never operate on real files.
- [ ] Every family has three fully instantiated examples.
- [ ] Every family defines task, response, derivation, difficulty, distractors, and validation.
- [ ] Difficulty grows through interacting state/graph reasoning, not graph size.
- [ ] Runtime checking is deterministic, local, and independent of a Git executable.
- [ ] Repeated practice improves prediction, recovery, and collaboration safety.

## 18. Stable navigation

1. `objects-refs` — Snapshots, Commits & Refs
2. `working-index` — Working Tree, Index & Status
3. `branches-history` — Branches & History Selection
4. `merge-conflicts` — Merging & Conflicts
5. `rewrite-recovery` — Undo, Replay & Recovery
6. `remotes` — Remotes & Synchronization
7. `collaboration` — Commit Design & Collaboration
8. `diagnosis` — Diagnosis & Bisect

Family identifiers are stable persistence/analytics keys and must not be translated or silently repurposed.
