(function () {
  "use strict";

  var TEXT = __LOCALE_TEXT__;
  var STORAGE_KEY = "practiceLab.gitVersionControl.v1";
  var MODEL_ID = "git-state-v1";
  var LEVELS = [1, 2, 3, 4, 5];
  var currentQuestion = null, currentStartedAt = 0, pauseStartedAt = 0, pausedMs = 0;
  var submitted = false, isPaused = false, progress = null, rng = null, selectorController = null;
  var recentSignatures = [], learnSpotlightId = null;

  function t(path, fallback) {
    var value = path.split(".").reduce(function (current, part) { return current && Object.prototype.hasOwnProperty.call(current, part) ? current[part] : undefined; }, TEXT);
    return value === undefined ? fallback : value;
  }
  var generatedTranslationPairs = null;
  function translateGenerated(value) {
    if (TEXT.localeCode === "en" || value === null || value === undefined) return String(value === null || value === undefined ? "" : value);
    if (generatedTranslationPairs === null) generatedTranslationPairs = t("generatedReplacements", []).slice().sort(function (a, b) { return b[0].length - a[0].length; });
    var output = String(value); generatedTranslationPairs.forEach(function (pair) { output = output.split(pair[0]).join(pair[1]); });
    var words = t("generatedWordReplacements", {}), keys = Object.keys(words); if (keys.length) { var pattern = new RegExp("\\b(" + keys.sort(function(a,b){return b.length-a.length;}).map(function(key){return key.replace(/[.*+?^${}()|[\]\\]/g,function(character){return "\\"+character;});}).join("|") + ")\\b", "g"); output = output.replace(pattern, function (word) { return words[word] || word; }); }
    t("generatedPostReplacements", []).forEach(function (pair) { output = output.split(pair[0]).join(pair[1]); });
    return output;
  }
  function Rng(seed) { this.state = (Number(seed) >>> 0) || 0x9E3779B9; }
  Rng.prototype.next = function () { var x = this.state; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; this.state = x >>> 0; return this.state; };
  Rng.prototype.int = function (min, max) { return min + (this.next() % (max - min + 1)); };
  Rng.prototype.pick = function (values) { return values[this.int(0, values.length - 1)]; };
  Rng.prototype.bool = function () { return Boolean(this.next() & 1); };

  var CATEGORIES = [
    { id: "objects-refs", title: "Snapshots, Commits & Refs" },
    { id: "working-index", title: "Working Tree, Index & Status" },
    { id: "branches-history", title: "Branches & History Selection" },
    { id: "merge-conflicts", title: "Merging & Conflicts" },
    { id: "rewrite-recovery", title: "Undo, Replay & Recovery" },
    { id: "remotes", title: "Remotes & Synchronization" },
    { id: "collaboration", title: "Commit Design & Collaboration" },
    { id: "diagnosis", title: "Diagnosis & Bisect" }
  ];

  var FAMILY_ROWS = [
    ["snapshot_tree_lookup","objects-refs","Snapshot tree lookup","A commit stores a complete tree, not merely the lines changed from its parent.","Look up the requested path in that commit's tree; do not borrow later working or branch state.","B tree: app.txt=v2, cfg=v1. app.txt at B is v2."],
    ["commit_parent_read","objects-refs","Commit parent reading","Parent edges define history; a merge commit has ordered first and second parents.","Read the stored parent list exactly. Timestamps and drawing position do not create ancestry.","M parents=(C,D), so M^1=C and M^2=D."],
    ["ref_head_resolve","objects-refs","Resolve refs and HEAD","Branches and tags name commits; attached HEAD names a branch, while detached HEAD names a commit.","Resolve symbolic HEAD through its branch. Moving another ref does not move HEAD's branch.","HEAD→main and main→C resolves HEAD to C."],
    ["ancestor_reachability","objects-refs","Ancestor reachability","X is an ancestor of Y exactly when parent edges from Y can reach X.","Use graph reachability, not dates or horizontal placement.","A←B←C makes A an ancestor of C."],
    ["merge_base_find","objects-refs","Find a merge base","A merge base is a best common ancestor of both tips.","Intersect ancestor sets and keep the common ancestor not dominated by a newer common ancestor.","C and D split from B, so their unique merge base is B."],
    ["detached_head_trace","objects-refs","Detached HEAD trace","A detached commit moves detached HEAD but no branch automatically moves.","The commit remains recoverable while named by HEAD or the reflog; attach a branch to preserve it explicitly.","At detached C, commit D: HEAD→D while main remains B."],
    ["tag_branch_behavior","objects-refs","Tag versus branch behavior","A branch normally moves with new commits made while attached; a tag remains at its recorded target.","Do not make a tag follow a same-tip branch.","main and v1 point to B; commit C on main moves main only."],
    ["commit_identity_reasoning","objects-refs","Commit identity reasoning","Commit identity includes its tree, parents, and metadata; equal trees do not imply equal commits.","Changing a parent or metadata produces a new synthetic ID even when the full tree matches.","C and D can store the same tree but have different parents and IDs."],

    ["status_path_classify","working-index","Classify path status","Staged state compares HEAD to index; unstaged state compares index to worktree.","Classify both comparisons independently for each tracked path.","HEAD v1, index v2, work v3 means staged M and unstaged M."],
    ["porcelain_xy_decode","working-index","Decode porcelain XY","In XY status, X describes HEAD→index and Y describes index→worktree.","Read the left and right columns in the declared direction.","MM means staged modification plus another unstaged modification."],
    ["diff_layer_predict","working-index","Predict diff layers","Default diff is index→worktree; staged diff is HEAD→index.","Name the source and destination layer before listing changes.","HEAD v1, index v2, work v3: default shows v2→v3; --staged shows v1→v2."],
    ["add_path_effect","working-index","Add one path","git add copies the selected worktree path into stage 0 of the index.","It does not create a commit and does not stage unrelated paths.","work a=v3, index a=v2; add a makes index a=v3."],
    ["add_scope_effect","working-index","Add scope effects","The bounded model distinguishes a named path, -u tracked changes, and -A tracked plus nonignored untracked paths.","Ignored untracked paths remain excluded; -u does not add new untracked paths.","add -A stages tracked a and new b, but not ignored tmp.log."],
    ["commit_index_snapshot","working-index","Commit the index snapshot","Commit records the index tree, not whatever is newest in the worktree.","After commit, later worktree values can remain unstaged.","index a=v2, work a=v3: commit stores v2; v3 remains unstaged."],
    ["restore_layer_effect","working-index","Restore layer effects","restore path copies index to work; restore --staged copies HEAD to index.","State the target layer and source layer explicitly.","HEAD v1,index v2,work v3; restore --staged a gives index v1 and leaves work v3."],
    ["rm_mv_state_effect","working-index","Remove and move state","A modeled move is delete plus add; staged rm removes the path from the next snapshot.","No heuristic rename identity is part of the oracle.","mv old new stages deletion old and addition new with the same content."],
    ["ignore_rule_match","working-index","Ignore-rule matching","The declared gitignore-v1 subset applies ordered rules to nontracked paths.","Later matching negation can re-include a path when its parent is not excluded.","*.log then !keep.log ignores trace.log but not keep.log."],
    ["tracked_ignore_behavior","working-index","Tracked paths and ignore rules","Ignore rules affect discovery of untracked paths; they do not untrack an existing indexed path.","A tracked ignored-name path still reports and stages modifications.","tracked debug.log remains tracked even when *.log matches."],

    ["branch_create_effect","branches-history","Create a branch","Creating a branch creates a movable ref at a commit; it creates neither a commit nor a checkout by itself.","Unless switch -c is used, HEAD and trees remain unchanged.","branch topic at C adds topic→C; HEAD→main stays attached."],
    ["switch_branch_effect","branches-history","Switch branch effects","A clean switch attaches HEAD to the target and checks out its tree into index and worktree.","Bounded dirty switches are preserved only when safe; otherwise the operation rejects unchanged.","Clean switch main C→topic D makes HEAD→topic and index/work equal tree D."],
    ["commit_branch_movement","branches-history","Branch movement on commit","A new commit points to current HEAD and moves only the attached current branch.","Other branches and tags retain their targets.","HEAD→topic at C; commit D moves topic to D, main stays B."],
    ["branch_delete_reachability","branches-history","Branch deletion and reachability","Deleting a ref does not delete commit objects; reachability from remaining refs determines whether history is still named.","Check every remaining branch/tag and reflog fact shown.","Delete topic→D while tag save→D remains: D is still reachable."],
    ["revision_parent_expression","branches-history","Revision parent expressions","^ selects a parent; ^n selects the nth merge parent; ~n follows first parents n times.","Do not treat ^2 as two generations.","M parents=(C,D): M^2 is D, while M~2 follows M→C→B."],
    ["revision_range_select","branches-history","Two-dot revision ranges","left..right selects commits reachable from right but not from left.","Set subtraction, not a continuous drawing segment, is the oracle.","main B, topic D→C→B: main..topic={C,D}."],
    ["history_order_reason","branches-history","History ordering","Ancestry constrains parents after children in newest-first logs; unrelated siblings need the supplied tie rule.","Never infer sibling order without an explicit rule.","With tie ID descending, siblings D and C appear D,C after child M."],

    ["merge_case_classify","merge-conflicts","Classify merge case","Classify up-to-date, fast-forward, or divergent three-way merge from ancestry before comparing trees.","If target is ancestor of current it is up to date; if current is ancestor of target it can fast-forward.","main B merging topic D→B is fast-forward."],
    ["fast_forward_effect","merge-conflicts","Fast-forward effect","A fast-forward moves the current branch to an existing descendant and creates no commit.","Index/work become the target tree in the clean fixture; target IDs are preserved.","main B merged with topic D→C→B moves main to D; no M exists."],
    ["no_ff_merge_effect","merge-conflicts","Forced merge-commit effect","--no-ff can create a two-parent merge commit even when a fast-forward was possible.","The first parent is the old current tip and the second is the merged tip.","main B, topic D: merge --no-ff creates M parents=(B,D)."],
    ["three_way_tree_merge","merge-conflicts","Three-way tree merge","For each path compare base, ours, and theirs; one-sided changes win and equal two-sided changes agree.","Different edits to separate paths merge cleanly.","base a1,b1; ours a2; theirs b2 → result a2,b2."],
    ["merge_conflict_identify","merge-conflicts","Identify merge conflicts","A conflict occurs when both sides make incompatible changes relative to the base under the bounded path/line rules.","Same-file changes are not automatically conflicts; use the shown regions.","base x=red, ours blue, theirs green at the same region conflicts."],
    ["conflict_index_stages","merge-conflicts","Conflict index stages","An unmerged path stores stage 1 base, stage 2 ours/current, and stage 3 theirs/merged.","Ours depends on the checked-out branch, not the name main.","On topic merging main: stage2 is topic's value; stage3 is main's."],
    ["resolve_conflict_complete","merge-conflicts","Complete conflict resolution","Write the chosen resolution to worktree, add it to stage 0, then complete the merge commit.","Completion is blocked while any stages 1–3 remain.","edit x, git add x, then commit creates M with saved parents."],
    ["merge_abort_effect","merge-conflicts","Abort a merge","Abort restores the saved pre-merge HEAD, index, and worktree in this bounded model.","It removes operation metadata and unmerged stages.","Abort a conflict begun at C returns branch/index/work to saved C state."],

    ["reset_mode_effect","rewrite-recovery","Reset mode effects","soft moves the branch; mixed also resets index; hard also resets tracked worktree.","Apply the destination tree separately to each declared layer.","From C to B: soft leaves index/work C; mixed index B/work C; hard both B."],
    ["revert_commit_effect","rewrite-recovery","Revert a commit","Revert applies the selected commit's inverse patch and creates a new child commit.","It preserves published history rather than moving the branch backward.","B→C adds x; revert C creates D→C whose tree removes x."],
    ["cherry_pick_effect","rewrite-recovery","Cherry-pick effect","Cherry-pick applies a source commit's parent-relative patch onto current HEAD and creates a new identity.","The source branch does not move.","Pick D's patch onto B creates D'→B; original D remains."],
    ["linear_rebase_graph","rewrite-recovery","Linear rebase graph","Rebase replays local-only commits oldest-first onto the new base, creating new identities.","The upstream commits and original source objects are not edited.","C→B,D→C rebased onto E gives C'→E,D'→C'."],
    ["rebase_patch_result","rewrite-recovery","Rebase patch result","Each replay applies the original parent-relative patch to the evolving new base.","A clean patch result can differ from either original full tree.","C changes a; upstream E changes b; C' on E contains both changes."],
    ["amend_effect","rewrite-recovery","Amend effect","Amend creates a replacement child of the old commit's parent from the current index.","The old commit is not mutated and other refs may still name it.","main C amended creates C' and moves main; tag old remains at C."],
    ["reflog_recover_ref","rewrite-recovery","Recover from reflog","The local reflog records recent ref/HEAD tips supplied by the fixture.","Create a rescue branch at the old tip before further risky movement.","reflog shows C before reset to A: branch recover C preserves it."],
    ["stash_push_effect","rewrite-recovery","Stash push effect","Stash stores bounded tracked index/work deltas and restores tracked index/work to HEAD.","-u additionally includes nonignored untracked files; ignored files remain.","stash push -u saves new b but not ignored tmp."],
    ["stash_apply_pop_effect","rewrite-recovery","Stash apply versus pop","Apply retains the stash entry; successful pop removes it; conflicting pop retains it.","--index restores the saved index layer only under the clean fixture.","Clean pop removes S; conflicting pop leaves S available."],
    ["undo_operation_select","rewrite-recovery","Select an undo operation","Choose by intended layer/history effect and publication constraint.","Use revert for shared history; reset/amend only when rewriting the stated local history is allowed.","Discard unstaged a while keeping index: restore a."],

    ["remote_tracking_staleness","remotes","Remote-tracking staleness","A local branch, cached origin/main, and actual remote main are three separate refs.","The tracking ref changes only when a fetch updates it.","local C, origin/main B, server D resolves to C, B, D before fetch."],
    ["fetch_effect","remotes","Fetch effect","Fetch copies objects and updates remote-tracking refs; it does not integrate into local branches.","Index, worktree, HEAD, and local branch tips remain unchanged.","fetch remote D moves origin/main B→D; main stays C."],
    ["ahead_behind_count","remotes","Ahead and behind counts","Ahead and behind are reachability-set differences between local and upstream tips.","Do not subtract graph depths or timestamps.","Sibling C and D from B gives ahead 1, behind 1."],
    ["upstream_ref_reasoning","remotes","Upstream ref reasoning","Argument-free operations use the displayed upstream mapping, even when names differ.","No upstream means the modeled operation requiring one rejects until made explicit.","release upstream central/stable compares against central/stable."],
    ["push_fast_forward_decision","remotes","Normal push decision","A normal ref update succeeds when the destination is new or its old tip is an ancestor of the source.","A divergent update rejects without moving the remote ref.","remote B, local C→B accepts and moves remote to C."],
    ["force_with_lease_decision","remotes","Force-with-lease decision","A lease is compare-and-swap: actual remote tip must equal the expected old tip.","A stale lease rejects even though the update is forced.","expect D, actual E rejects and preserves E."],
    ["pull_ff_only_effect","remotes","Pull with ff-only","Pull --ff-only is fetch followed by an ancestor-checked fast-forward.","Divergence rejects integration after the tracking ref has still fetched.","local C and fetched sibling D: main stays C, origin/main becomes D."],
    ["pull_merge_effect","remotes","Pull with merge","Pull --no-rebase is fetch followed by the merge case rules.","On clean divergence it creates a local merge; origin/main remains at the fetched remote tip.","local C plus remote D creates M parents=(C,D); origin/main stays D."],
    ["pull_rebase_effect","remotes","Pull with rebase","Pull --rebase fetches then replays local-only commits onto the fetched tip.","The tracking ref stays on the remote commit; local commits receive new IDs.","local C from B, remote D from B gives C'→D and origin/main D."],
    ["clone_initial_state","remotes","Clone initial state","Clone copies reachable objects, creates tracking refs, and checks out one local default branch.","It does not create a local branch for every remote branch.","default trunk D gives local trunk D, origin/trunk D, attached HEAD, clean tree D."],

    ["change_unit_partition","collaboration","Partition change units","Coherent commits satisfy supplied must-together, must-separate, and dependency constraints.","Group by reviewable behavior, not merely by filename or extension.","parser fix and regression test together; unrelated README format separately."],
    ["commit_dependency_order","collaboration","Order dependent commits","Every intermediate snapshot must satisfy the displayed build/test dependencies.","Topologically order the dependency DAG using the supplied tie rule.","API definition precedes caller update."],
    ["atomic_commit_assess","collaboration","Assess commit atomicity","A commit is atomic when it forms one coherent, independently reviewable/revertible transition under the given rule.","File count alone neither proves nor disproves atomicity.","Interface rename plus every required caller edit can be one atomic commit."],
    ["review_range_choose","collaboration","Choose a review range","Select the reachability difference that isolates topic-only commits relative to the review base.","Use left..right in the correct direction.","main..topic selects commits reachable only from topic."],
    ["integration_strategy_select","collaboration","Select integration strategy","Match fast-forward, merge, rebase, or cherry-pick effects to the exact history goal and publication facts.","There is no universal strategy independent of constraints.","Want one hotfix from an experiment: cherry-pick that commit."],
    ["shared_rewrite_impact","collaboration","Shared rewrite impact","Collaborators based on old-only commits retain divergent history after a published rewrite.","Same patches do not make old and new commit identities interchangeable.","Bob D→C diverges when published C is replaced by C'."],
    ["conflict_risk_compare","collaboration","Compare modeled conflict risk","Use exact overlapping paths, line regions, and dependencies as evidence of relative risk.","Higher modeled risk is not a guarantee of conflict.","Both edit x line 5 has greater direct risk than edits to separate files."],

    ["inspection_command_select","diagnosis","Select an inspection command","Choose the read-only view that directly answers the layer, history, ref, or recovery question.","Inspect evidence before mutating repository state.","Exact staged patch: git diff --staged."],
    ["operation_state_next_step","diagnosis","Operation-state next step","Continue only after every conflict is resolved and staged at stage 0.","An unstaged edit after staging does not update the recorded resolution until added again.","Unmerged x: resolve, add x, then continue."],
    ["push_rejection_diagnose","diagnosis","Diagnose push rejection","A non-fast-forward rejection means the remote tip is not an ancestor of the proposed local tip.","Fetch current evidence, inspect divergence, then integrate or coordinate an intentional rewrite.","Do not start with plain force based on stale tracking data."],
    ["bisect_midpoint_choose","diagnosis","Choose a bisect midpoint","Test a displayed midpoint that approximately halves the remaining good/bad ancestry interval.","Honor the supplied lower/upper tie and skipped-commit rule.","A good, E bad with B,C,D unknown: test C."],
    ["bisect_range_update","diagnosis","Update a bisect range","With a monotonic predicate, a good result removes the tested commit and ancestors; a bad result removes descendants beyond the tested bound.","A tested bad commit is not necessarily the first bad commit.","A good, E bad, C bad leaves first bad in {B,C}."],
    ["repository_invariant_check","diagnosis","Check repository invariants","Refs target existing commits, the commit graph is acyclic, attached HEAD names a branch, and status agrees with the three trees.","Distinguish impossible state from unusual but valid detached/tag state.","main→missing Z violates the model."],
    ["safe_sequence_order","diagnosis","Order a safe sequence","Inspection and preservation precede risky mutation; verification precedes publication.","Order steps by state prerequisites rather than memorized slogans.","reflog, create rescue branch, verify tree." ]
  ];

  var FAMILIES = FAMILY_ROWS.map(function (row) {
    return { id: row[0], categoryId: row[1], title: row[2], levels: LEVELS, learn: { concept: row[3], rules: row[4], example: row[5] } };
  });
  function localizeStaticData() {
    if (TEXT.localeCode === "en") return;
    CATEGORIES.forEach(function (category) { var title = t("categories." + category.id, null); if (title) category.title = title; });
    FAMILIES.forEach(function (family) { var localized = t("families." + family.id, null); if (localized) family.title = localized; var rule = t("familyRules." + family.id, null); if (rule) { family.learn.concept = "Öva " + family.title.toLocaleLowerCase("sv-SE") + " i det syntetiska git-state-v1-arkivet."; family.learn.rules = rule; family.learn.example = "De genererade frågorna visar alla värden, referenser och tillståndslager som behövs."; } else { family.learn.concept = translateGenerated(family.learn.concept); family.learn.rules = translateGenerated(family.learn.rules); family.learn.example = translateGenerated(family.learn.example); } });
  }
  localizeStaticData();
  function familyById(id) { return FAMILIES.find(function (family) { return family.id === id; }) || FAMILIES[0]; }
  function categoryById(id) { return CATEGORIES.find(function (category) { return category.id === id; }) || CATEGORIES[0]; }

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  function sorted(values) { return Array.from(new Set(values)).sort(); }
  function reachable(dag, tip) {
    var seen = new Set(), stack = tip && dag[tip] ? [tip] : [];
    while (stack.length) { var id = stack.pop(); if (seen.has(id)) continue; seen.add(id); (dag[id] || []).forEach(function (parent) { stack.push(parent); }); }
    return sorted(Array.from(seen));
  }
  function isAncestor(dag, ancestor, descendant) { return reachable(dag, descendant).includes(ancestor); }
  function mergeBase(dag, left, right) {
    var common = reachable(dag, left).filter(function (id) { return reachable(dag, right).includes(id); });
    var best = common.filter(function (candidate) { return !common.some(function (other) { return other !== candidate && isAncestor(dag, candidate, other); }); });
    return best.length === 1 ? best[0] : null;
  }
  function range(dag, left, right) { var excluded = new Set(reachable(dag, left)); return reachable(dag, right).filter(function (id) { return !excluded.has(id); }).sort(); }
  function aheadBehind(dag, local, upstream) { return { ahead: range(dag, upstream, local).length, behind: range(dag, local, upstream).length }; }
  function graphIsAcyclic(dag) {
    var visiting = new Set(), done = new Set();
    function visit(id) { if (visiting.has(id)) return false; if (done.has(id)) return true; if (!dag[id]) return false; visiting.add(id); for (var i = 0; i < dag[id].length; i += 1) if (!visit(dag[id][i])) return false; visiting.delete(id); done.add(id); return true; }
    return Object.keys(dag).every(visit);
  }
  function pathState(head, index, work, path) {
    var h = Object.prototype.hasOwnProperty.call(head, path) ? head[path] : null;
    var i = Object.prototype.hasOwnProperty.call(index, path) ? index[path] : null;
    var w = Object.prototype.hasOwnProperty.call(work, path) ? work[path] : null;
    return { staged: h === i ? " " : h === null ? "A" : i === null ? "D" : "M", unstaged: i === w ? " " : i === null ? "?" : w === null ? "D" : "M" };
  }
  function diffPaths(from, to) { return sorted(Object.keys(from).concat(Object.keys(to))).filter(function (path) { return from[path] !== to[path]; }); }
  function mergeTrees(base, ours, theirs) {
    var result = {}, conflicts = [];
    sorted(Object.keys(base).concat(Object.keys(ours), Object.keys(theirs))).forEach(function (path) {
      var b = Object.prototype.hasOwnProperty.call(base, path) ? base[path] : null;
      var o = Object.prototype.hasOwnProperty.call(ours, path) ? ours[path] : null;
      var th = Object.prototype.hasOwnProperty.call(theirs, path) ? theirs[path] : null;
      var value;
      if (o === th) value = o; else if (o === b) value = th; else if (th === b) value = o; else { conflicts.push(path); return; }
      if (value !== null) result[path] = value;
    });
    return { tree: result, conflicts: conflicts };
  }
  function resetState(state, targetTree, mode) {
    var next = clone(state); next.headTree = clone(targetTree);
    if (mode !== "soft") next.index = clone(targetTree);
    if (mode === "hard") next.work = clone(targetTree);
    return next;
  }
  function pushDecision(dag, oldTip, newTip) { return oldTip === null || isAncestor(dag, oldTip, newTip); }
  function leaseDecision(expected, actual) { return expected === actual; }
  function bisectMidpoint(path, goodIndex, badIndex, tie) {
    var candidates = [];
    for (var i = goodIndex + 1; i < badIndex; i += 1) candidates.push(i);
    if (!candidates.length) return path[badIndex];
    var position = tie === "upper" ? Math.floor(candidates.length / 2) : Math.floor((candidates.length - 1) / 2);
    return path[candidates[position]];
  }
  function ignoreMatch(path, rules) {
    var ignored = false, parts = path.split("/");
    rules.forEach(function (rule) {
      var negated = rule.charAt(0) === "!", pattern = negated ? rule.slice(1) : rule;
      var directoryOnly = pattern.charAt(pattern.length - 1) === "/";
      if (directoryOnly) pattern = pattern.slice(0, -1);
      var anchored = pattern.indexOf("/") >= 0;
      if (pattern.charAt(0) === "/") pattern = pattern.slice(1);
      var regex = new RegExp("^" + pattern.replace(/[.+^${}()|[\]\\]/g, function (character) { return "\\" + character; }).replace(/\*/g, "[^/]*").replace(/\?/g, "[^/]") + "$");
      var candidates = anchored ? parts.map(function (_, k) { return parts.slice(0, k + 1).join("/"); }) : parts.slice();
      if (directoryOnly) candidates = candidates.slice(0, -1);
      if (candidates.some(function (candidate) { return regex.test(candidate); })) ignored = !negated;
    });
    return ignored;
  }

  // ---- Generated scenarios -------------------------------------------------------------------
  // Each family builds its state from the seed and level. Levels 1-3 follow the specification's
  // per-family difficulty steps; levels 4-5 use the hardest step with larger state or a composed
  // second concept. Answers come from the oracles above. Text uses G(key, English, vars) templates;
  // Swedish templates live in the locale's `gen` table (complete coverage is self-tested).
  var USED_TEMPLATE_KEYS = new Set();
  function G(key, english, vars) {
    USED_TEMPLATE_KEYS.add(key);
    var text = t("gen." + key, english);
    return vars ? text.replace(/\{(\w+)\}/g, function (match, name) { return Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match; }) : text;
  }
  function exercise(title, rows, answer, alternatives, explanation, state, operation, trace) {
    return { title: title, rows: rows, note: G("note", "Track only the displayed synthetic state. Nothing is executed."), answer: answer, alternatives: alternatives, explanation: explanation, state: state || {}, operation: operation || null, trace: trace || [], localized: true };
  }
  function pickDistinct(r, values, count) { var pool = values.slice(), out = []; while (out.length < count && pool.length) out.push(pool.splice(r.int(0, pool.length - 1), 1)[0]); return out; }
  function letters(start, count) { var out = []; for (var i = 0; i < count; i += 1) out.push(String.fromCharCode(65 + start + i)); return out; }
  function treeText(tree) { var keys = Object.keys(tree).sort(); return keys.length ? keys.map(function (path) { return path + "=" + tree[path]; }).join(", ") : G("empty_tree", "(empty)"); }
  function setText(values) { return "{" + values.slice().sort().join(", ") + "}"; }
  function listText(values) { return values.join(", "); }
  function parentRows(dag) {
    return Object.keys(dag).sort().map(function (id) {
      return dag[id].length ? G("row_parents", "{c} parents: {p}", { c: id, p: dag[id].join(", ") }) : G("row_root", "{c}: root commit", { c: id });
    });
  }
  // Commit graphs. Letters are assigned in creation order, so parents always have earlier letters.
  function linearDag(count) { var dag = {}, ids = letters(0, count); ids.forEach(function (id, i) { dag[id] = i ? [ids[i - 1]] : []; }); return { dag: dag, ids: ids, tip: ids[count - 1] }; }
  function forkDag(baseCount, leftCount, rightCount) {
    var dag = {}, next = 0, base = [], left = [], right = [];
    function add(parents) { var id = String.fromCharCode(65 + next); next += 1; dag[id] = parents; return id; }
    var prev = null;
    for (var i = 0; i < baseCount; i += 1) { prev = add(prev ? [prev] : []); base.push(prev); }
    var fork = prev, l = fork, rr = fork;
    for (i = 0; i < leftCount; i += 1) { l = add([l]); left.push(l); }
    for (i = 0; i < rightCount; i += 1) { rr = add([rr]); right.push(rr); }
    return { dag: dag, fork: fork, left: left, right: right, leftTip: l, rightTip: rr, add: add };
  }
  function mergedDag(r, level) {
    var side = level >= 4 ? 3 : 2;
    var g = forkDag(r.int(1, level >= 5 ? 3 : 2), r.int(1, side), r.int(1, side));
    var merge = g.add([g.leftTip, g.rightTip]), tip = merge;
    if (level >= 4) { tip = g.add([merge]); if (level >= 5 && r.bool()) tip = g.add([tip]); }
    return { dag: g.dag, merge: merge, tip: tip, first: g.leftTip, second: g.rightTip, fork: g.fork, left: g.left, right: g.right };
  }
  function firstParentChain(dag, tip) { var out = [], id = tip; while (id) { out.push(id); id = dag[id].length ? dag[id][0] : null; } return out; }
  function resolveRevision(dag, start, steps) {
    var id = start;
    for (var i = 0; i < steps.length && id; i += 1) {
      var step = steps[i];
      if (step.op === "~") { for (var k = 0; k < step.n && id; k += 1) id = dag[id].length ? dag[id][0] : null; }
      else id = dag[id][step.n - 1] || null;
    }
    return id;
  }
  function topoOrder(dag, tip, largerFirst) {
    var nodes = reachable(dag, tip), placed = [], remaining = new Set(nodes);
    while (remaining.size) {
      var ready = Array.from(remaining).filter(function (id) { return !Array.from(remaining).some(function (other) { return (dag[other] || []).includes(id); }); }).sort();
      var choice = largerFirst ? ready[ready.length - 1] : ready[0];
      placed.push(choice); remaining.delete(choice);
    }
    return placed;
  }
  function stateWord(code) {
    return { "M": G("st_modified", "modified"), "A": G("st_added", "added"), "D": G("st_deleted", "deleted"), "?": G("st_untracked", "untracked"), " ": G("st_none", "unchanged") }[code];
  }
  function statusText(state) { return G("status_pair", "staged: {s}; unstaged: {u}", { s: stateWord(state.staged), u: stateWord(state.unstaged) }); }
  function uniqueOptions(answer, candidates, filler) {
    var seen = new Set([answer]), out = [];
    candidates.concat(filler || []).forEach(function (value) { if (value !== undefined && value !== null && !seen.has(value)) { seen.add(value); out.push(value); } });
    return out.slice(0, 4);
  }

  function scenario(id, level, r) {
    var branches = pickDistinct(r, ["main", "trunk", "release"], 1).concat(pickDistinct(r, ["topic", "feature", "fix"], 1));
    var cur = branches[0], top = branches[1];
    var paths = pickDistinct(r, ["app.txt", "config.ini", "src/x.c", "lib/util.py", "docs/guide.md"], 4), P = paths[0], Q = paths[1], R = paths[2];
    var answer, rows, dag, g, x, y, opts, i, merged, counts;
    switch (id) {

    case "snapshot_tree_lookup": {
      var commitCount = level <= 2 ? 2 : level + 0, usePaths = level <= 2 ? [P, Q] : [P, Q, R];
      var ids = letters(0, commitCount), trees = {}, patches = {}, tree = {};
      usePaths.forEach(function (path) { tree[path] = "v1"; });
      trees[ids[0]] = clone(tree);
      for (i = 1; i < commitCount; i += 1) {
        var changed = r.pick(usePaths), value = "v" + (i + 1);
        if (level >= 4 && r.int(0, 3) === 0 && Object.keys(tree).length > 2) { delete tree[changed]; patches[ids[i]] = G("patch_delete", "{c} deletes {p}", { c: ids[i], p: changed }); }
        else { patches[ids[i]] = G("patch_set", "{c} sets {p} to {v}", { c: ids[i], p: changed, v: value }); tree[changed] = value; }
        trees[ids[i]] = clone(tree);
      }
      var target = level === 1 ? r.pick(ids) : ids[commitCount - 1], askPath = r.pick(usePaths);
      answer = Object.prototype.hasOwnProperty.call(trees[target], askPath) ? trees[target][askPath] : G("absent", "path absent");
      rows = level === 1 ? ids.map(function (c) { return G("row_tree", "{c} tree: {t}", { c: c, t: treeText(trees[c]) }); })
        : [G("row_tree", "{c} tree: {t}", { c: ids[0], t: treeText(trees[ids[0]]) })].concat(ids.slice(1).map(function (c) { return patches[c]; }));
      rows.push(G("row_work_value", "worktree now: {p}={v}", { p: askPath, v: "v9" }));
      var seenValues = ids.map(function (c) { return trees[c][askPath]; }).filter(Boolean);
      return exercise(G("snap_title", "What value does snapshot {c} store for {p}?", { c: target, p: askPath }), rows, answer, uniqueOptions(answer, seenValues.concat(["v9", G("absent", "path absent")]), ["v1", "v2", "v3", "v4"]),
        G("snap_expl", "A commit records a complete tree. Apply each displayed change in order up to {c}; files a commit does not touch carry over unchanged, and the worktree is unrelated.", { c: target }),
        { dag: linearDag(commitCount).dag, trees: trees }, "tree lookup", [G("tr_apply_through", "apply changes through {c}", { c: target }), G("tr_read", "read {p}", { p: askPath })]);
    }

    case "commit_parent_read": {
      if (level === 1 || (level === 2 && r.bool())) {
        g = linearDag(r.int(4, 6)); x = g.ids[r.int(1, g.ids.length - 2)];
        answer = g.dag[x][0];
        var child = g.ids[g.ids.indexOf(x) + 1], grand = g.dag[answer][0] || g.ids[g.ids.length - 1];
        return exercise(G("parent_title", "What is {c}'s parent?", { c: x }), parentRows(g.dag), answer, uniqueOptions(answer, [child, grand, x]),
          G("parent_expl", "Each commit stores its parent IDs; {c} records {p}.", { c: x, p: answer }), { dag: g.dag }, "read parents", [G("tr_read_parents", "read parents of {c}", { c: x })]);
      }
      if (level === 2) {
        g = linearDag(4); answer = G("no_parent", "none — it is a root commit");
        return exercise(G("parent_title", "What is {c}'s parent?", { c: "A" }), parentRows(g.dag), answer, uniqueOptions(answer, ["B", "A", G("parent_self", "itself")]),
          G("root_expl", "A root commit has no parents; history starts there."), { dag: g.dag }, "read parents", [G("tr_read_parents", "read parents of {c}", { c: "A" })]);
      }
      g = mergedDag(r, level);
      var ordinal = r.bool() ? 1 : 2, composed = level === 5 && r.bool();
      if (composed) {
        answer = resolveRevision(g.dag, g.merge, [{ op: "^", n: 2 }, { op: "~", n: 1 }]);
        return exercise(G("parent_composed_title", "What is the parent of {m}'s second parent?", { m: g.merge }), parentRows(g.dag), answer, uniqueOptions(answer, [g.second, g.first, g.dag[g.first][0], g.merge]),
          G("parent_composed_expl", "{m}'s second parent is {s}; its parent is {a}.", { m: g.merge, s: g.second, a: answer }), { dag: g.dag }, "read parents", [G("tr_second_parent", "second parent of {m} = {s}", { m: g.merge, s: g.second }), G("tr_read_parents", "read parents of {c}", { c: g.second })]);
      }
      answer = ordinal === 1 ? g.first : g.second;
      return exercise(ordinal === 1 ? G("parent_first_title", "What is the first parent of merge {m}?", { m: g.merge }) : G("parent_second_title", "What is the second parent of merge {m}?", { m: g.merge }),
        parentRows(g.dag), answer, uniqueOptions(answer, [ordinal === 1 ? g.second : g.first, g.fork, g.merge]),
        G("parent_order_expl", "Merge parents are ordered: {m} lists {a} first and {b} second.", { m: g.merge, a: g.first, b: g.second }), { dag: g.dag }, "read parents", [G("tr_read_parents", "read parents of {c}", { c: g.merge })]);
    }

    case "ref_head_resolve": {
      var commits = pickDistinct(r, ["B", "C", "D", "E", "F"], 4), refs = {};
      refs[cur] = commits[0]; refs[top] = commits[1]; refs["v1"] = commits[2];
      if (level === 1) {
        answer = commits[1];
        return exercise(G("ref_branch_title", "Which commit does branch {b} point to?", { b: top }), [G("row_ref", "{r} → {c}", { r: cur, c: commits[0] }), G("row_ref", "{r} → {c}", { r: top, c: commits[1] }), G("row_tag", "tag {r} → {c}", { r: "v1", c: commits[2] })],
          answer, uniqueOptions(answer, [commits[0], commits[2], top]), G("ref_branch_expl", "A branch is a name that stores one commit ID; {b} stores {c}.", { b: top, c: answer }), { refs: refs }, "resolve ref", [G("tr_read_ref", "read {r}", { r: top })]);
      }
      if (level === 2) {
        var detached = r.bool();
        answer = detached ? commits[3] : commits[0];
        rows = [detached ? G("row_head_detached", "HEAD detached at {c}", { c: commits[3] }) : G("row_head_attached", "HEAD → {b}", { b: cur }), G("row_ref", "{r} → {c}", { r: cur, c: commits[0] }), G("row_ref", "{r} → {c}", { r: top, c: commits[1] })];
        return exercise(G("ref_head_title", "Which commit does HEAD resolve to?"), rows, answer, uniqueOptions(answer, [commits[0], commits[1], commits[3], cur]),
          detached ? G("ref_detached_expl", "Detached HEAD stores a commit ID directly: {c}.", { c: answer }) : G("ref_attached_expl", "Attached HEAD names branch {b}, which stores {c}.", { b: cur, c: answer }), { refs: refs, head: detached ? { detached: commits[3] } : { symbolic: cur } }, "resolve HEAD", [G("tr_follow_head", "follow HEAD")]);
      }
      var remoteName = "origin/" + top, tagName = top + "-v1", names = [top, remoteName, tagName];
      refs = {}; refs[top] = commits[0]; refs[remoteName] = commits[1]; refs[tagName] = commits[2];
      rows = [G("row_ref", "{r} → {c}", { r: top, c: commits[0] }), G("row_remote", "remote-tracking {r} → {c}", { r: remoteName, c: commits[1] }), G("row_tag", "tag {r} → {c}", { r: tagName, c: commits[2] })];
      var ask = r.pick(level >= 4 ? names.concat(["HEAD"]) : names);
      if (level >= 4) { rows.unshift(G("row_head_attached", "HEAD → {b}", { b: top })); }
      answer = ask === "HEAD" ? commits[0] : refs[ask];
      return exercise(G("ref_named_title", "Which commit does {r} resolve to?", { r: ask }), rows, answer, uniqueOptions(answer, commits.slice(0, 3).concat([commits[3]])),
        G("ref_named_expl", "Local branches, remote-tracking refs, and tags are separate namespaces; read exactly the named ref.") , { refs: refs }, "resolve ref", [G("tr_read_ref", "read {r}", { r: ask })]);
    }

    case "ancestor_reachability": {
      var built = level === 1 ? (function () { var len = r.int(5, 6), l = linearDag(len); return { dag: l.dag, tip: l.ids[len - 3] }; }())
        : level === 2 ? (function () { var f = forkDag(r.int(1, 3), r.int(1, 3), r.int(2, 3)); return { dag: f.dag, tip: f.leftTip }; }())
        : (function () { var m = mergedDag(r, level), next = String.fromCharCode(65 + Object.keys(m.dag).length), after = String.fromCharCode(66 + Object.keys(m.dag).length); m.dag[next] = [m.fork]; m.dag[after] = [m.tip]; return { dag: m.dag, tip: m.tip, second: m.second, first: m.first }; }());
      dag = built.dag; var ancestors = reachable(dag, built.tip).filter(function (c) { return c !== built.tip; });
      var others = Object.keys(dag).filter(function (c) { return !reachable(dag, built.tip).includes(c); });
      var correct = r.pick(ancestors);
      if (built.second) { var viaSecond = reachable(dag, built.second).filter(function (c) { return !reachable(dag, built.first).includes(c); }); if (viaSecond.length) correct = r.pick(viaSecond); }
            return exercise(G("anc_title", "Which commit is an ancestor of {c}?", { c: built.tip }), parentRows(dag), correct, uniqueOptions(correct, pickDistinct(r, others, 3)),
        G("anc_expl", "Follow parent edges from {c} — through every parent of a merge — and collect what you reach. {a} is reached; the other options are not.", { c: built.tip, a: correct }), { dag: dag }, "ancestor query", [G("tr_reach", "reachable({c})", { c: built.tip })]);
    }

    case "merge_base_find": {
      var leftTip, rightTip;
      if (level <= 2) { g = forkDag(r.int(1, 3), level === 1 ? 1 : r.int(2, 4), level === 1 ? 1 : r.int(1, 2)); dag = g.dag; leftTip = g.leftTip; rightTip = g.rightTip; if (r.bool()) { var swapTip = leftTip; leftTip = rightTip; rightTip = swapTip; } }
      else {
        // The topic merged the mainline once; the later base is that merged mainline commit.
        g = forkDag(r.int(1, 2), r.int(1, 2), r.int(1, 2)); dag = g.dag; var mainA = g.leftTip, topicA = g.rightTip;
        var mergeOnTopic = g.add([topicA, mainA]), topicTip = level >= 4 ? g.add([mergeOnTopic]) : mergeOnTopic;
        var mainTip = g.add([mainA]); if (level >= 5 || r.bool()) mainTip = g.add([mainTip]);
        leftTip = mainTip; rightTip = topicTip;
      }
      answer = mergeBase(dag, leftTip, rightTip);
      var older = reachable(dag, answer).filter(function (c) { return c !== answer; });
      return exercise(G("mb_title", "Find the merge base of {a} and {b}.", { a: leftTip, b: rightTip }), parentRows(dag), answer, uniqueOptions(answer, older.concat([leftTip, rightTip])),
        G("mb_expl", "The merge base is the newest commit reachable from both tips: {c}. Older shared commits are ancestors of it.", { c: answer }), { dag: dag }, "merge-base", [G("tr_common", "common ancestors of {a} and {b}", { a: leftTip, b: rightTip }), G("tr_newest", "newest: {c}", { c: answer })]);
    }

    case "detached_head_trace": {
      var start = "C", made = level >= 4 ? ["D", "E"] : ["D"], last = made[made.length - 1];
      var madeText = listText(made);
      if (level === 1) {
        answer = G("dh_only_head", "only detached HEAD moves, to {c}", { c: last });
        return exercise(G("dh_commit_title", "HEAD is detached at {s} and {cur} → B. After committing {m}, what moves?", { s: start, cur: cur, m: madeText }), [G("row_head_detached", "HEAD detached at {c}", { c: start }), G("row_ref", "{r} → {c}", { r: cur, c: "B" })],
          answer, [G("dh_branch_moves", "{b} moves to {c}", { b: cur, c: last }), G("dh_both_move", "HEAD and {b} both move to {c}", { b: cur, c: last }), G("dh_nothing", "nothing moves; the commit is discarded")],
          G("dh_commit_expl", "With no attached branch, a commit advances only detached HEAD."), { head: { detached: start } }, "commit", [G("tr_detached_advance", "detached HEAD → {c}", { c: last })]);
      }
      var variant = level === 2 ? "switch" : r.pick(["switchC", "branchAfter", "branchBefore"]);
      if (variant === "switch") {
        answer = G("dh_unreferenced", "no branch or tag reaches {c}; only the reflog records it", { c: last });
        return exercise(G("dh_switch_title", "While detached at {s} you commit {m}, then run git switch {cur}. Which ref still reaches {c}?", { s: start, m: madeText, cur: cur, c: last }), [G("row_ref", "{r} → {c}", { r: cur, c: "B" }), G("row_tag", "tag {r} → {c}", { r: "v1", c: "A" })],
          answer, [G("dh_branch_reaches", "{b} reaches {c}", { b: cur, c: last }), G("dh_tag_reaches", "tag v1 reaches {c}", { c: last }), G("dh_head_reaches", "HEAD still reaches {c}", { c: last })],
          G("dh_switch_expl", "Switching away moves HEAD to {b}; nothing else ever pointed at the detached commits.", { b: cur }), { head: { symbolic: cur } }, "switch", [G("tr_detached_advance", "detached HEAD → {c}", { c: last }), G("tr_head_to", "HEAD → {b}", { b: cur })]);
      }
      if (variant === "branchBefore") {
        answer = G("dh_keep_follows", "keep → {c}; HEAD stays attached to keep", { c: last });
        return exercise(G("dh_before_title", "Detached at {s}, you run git switch -c keep, then commit {m}. Where do the names point?", { s: start, m: madeText }), [G("row_head_detached", "HEAD detached at {c}", { c: start })],
          answer, [G("dh_keep_stays", "keep → {s}; HEAD detached at {c}", { s: start, c: last }), G("dh_keep_missing", "keep is never created"), G("dh_keep_both", "keep → {s} and {b} → {c}", { s: start, b: cur, c: last })],
          G("dh_before_expl", "git switch -c attaches HEAD to the new branch first, so each later commit advances keep."), { head: { symbolic: "keep" } }, "switch -c", [G("tr_attach", "attach HEAD to keep"), G("tr_branch_advance", "keep → {c}", { c: last })]);
      }
      if (variant === "branchAfter") {
        answer = G("dh_keep_at_tip", "keep → {c}; HEAD remains detached at {c}", { c: last });
        return exercise(G("dh_after_title", "Detached at {s}, you commit {m}, then run git branch keep. Where do the names point?", { s: start, m: madeText }), [G("row_head_detached", "HEAD detached at {c}", { c: start })],
          answer, [G("dh_keep_follows", "keep → {c}; HEAD stays attached to keep", { c: last }), G("dh_keep_stays", "keep → {s}; HEAD detached at {c}", { s: start, c: last }), G("dh_keep_missing", "keep is never created")],
          G("dh_after_expl", "git branch creates a ref at the current commit but does not attach HEAD."), { head: { detached: last } }, "branch", [G("tr_create_at", "create {t} at {o}", { t: "keep", o: last })]);
      }
      answer = G("dh_keep_at_branch", "keep → B; {c} stays unreferenced", { c: last });
      return exercise(G("dh_late_title", "Detached at {s}, you commit {m}, run git switch {cur}, then git branch keep. Where does keep point?", { s: start, m: madeText, cur: cur }), [G("row_ref", "{r} → {c}", { r: cur, c: "B" })],
        answer, [G("dh_keep_at_tip", "keep → {c}; HEAD remains detached at {c}", { c: last }), G("dh_keep_follows", "keep → {c}; HEAD stays attached to keep", { c: last }), G("dh_keep_missing", "keep is never created")],
        G("dh_late_expl", "git branch uses the commit HEAD names now — {b} at B — not the earlier detached commit.", { b: cur }), { head: { symbolic: cur } }, "branch", [G("tr_head_to", "HEAD → {b}", { b: cur }), G("tr_create_at", "create {t} at {o}", { t: "keep", o: "B" })]);
    }

    case "tag_branch_behavior": {
      var next = level >= 4 ? "E" : "D";
      if (level === 1) {
        answer = G("tb_branch_moves", "{b} → {n}; tag v1 stays at C", { b: cur, n: next });
        return exercise(G("tb_title", "HEAD → {b}. After one new commit {n}, where do the names point?", { b: cur, n: next }), [G("row_ref", "{r} → {c}", { r: cur, c: "C" }), G("row_tag", "tag {r} → {c}", { r: "v1", c: "C" })],
          answer, [G("tb_both_move", "{b} → {n} and tag v1 → {n}", { b: cur, n: next }), G("tb_tag_moves", "tag v1 → {n}; {b} stays at C", { b: cur, n: next }), G("tb_none_move", "both stay at C")],
          G("tb_expl", "The attached branch advances to the new commit; a tag never moves on commit."), { refs: { v1: "C" } }, "commit", [G("tr_branch_advance_b", "{b} → {n}", { b: cur, n: next })]);
      }
      if (level === 2) {
        answer = G("tb_attached_only", "{t} → {n}; {b} and tag v1 stay at C", { t: top, b: cur, n: next });
        return exercise(G("tb_title", "HEAD → {b}. After one new commit {n}, where do the names point?", { b: top, n: next }), [G("row_ref", "{r} → {c}", { r: cur, c: "C" }), G("row_ref", "{r} → {c}", { r: top, c: "C" }), G("row_tag", "tag {r} → {c}", { r: "v1", c: "C" })],
          answer, [G("tb_all_move", "{t}, {b}, and tag v1 all move to {n}", { t: top, b: cur, n: next }), G("tb_branches_move", "{t} and {b} → {n}; tag v1 stays", { t: top, b: cur, n: next }), G("tb_none_move", "both stay at C")],
          G("tb_attached_expl", "Only the branch HEAD is attached to advances; other branches and tags at the same commit stay put."), { refs: { v1: "C" } }, "commit", [G("tr_branch_advance_b", "{b} → {n}", { b: top, n: next })]);
      }
      answer = G("tb_detached", "HEAD detached at {n}; tag v1 and {b} unchanged", { n: next, b: cur });
      return exercise(G("tb_tag_title", "You run git switch --detach v1 and commit {n}. Where do the names point?", { n: next }), [G("row_tag", "tag {r} → {c}", { r: "v1", c: "C" }), G("row_ref", "{r} → {c}", { r: cur, c: "D" === next ? "B" : "D" })],
        answer, [G("tb_tag_follows", "tag v1 → {n}", { n: next }), G("tb_branch_follows", "{b} → {n}", { b: cur, n: next }), G("tb_refused", "the commit is refused while a tag is checked out")],
        G("tb_tag_expl", "Checking out a tag detaches HEAD; the new commit advances only detached HEAD and leaves the tag fixed."), { head: { detached: next } }, "commit", [G("tr_detached_advance", "detached HEAD → {c}", { c: next })]);
    }

    case "commit_identity_reasoning": {
      var kind = level === 1 ? "tree" : level === 2 ? "parent" : r.pick(["identical", "message", "parent", "timestamp"]);
      rows = kind === "tree" ? [G("ci_tree_rows", "X and Y have parent B; X tree {p}=v2, Y tree {p}=v3", { p: P })]
        : kind === "parent" ? [G("ci_parent_rows", "X and Y apply the same patch {p}: v1→v2, but X has parent B and Y has parent D", { p: P })]
        : kind === "identical" ? [G("ci_identical_rows", "X and Y: same tree, same parent B, same author, committer, timestamps, and message")]
        : kind === "message" ? [G("ci_message_rows", "Y is X amended with a new message only; tree and parent are unchanged")]
        : kind === "timestamp" ? [G("ci_time_rows", "Y replays X's patch onto the same parent B, with a newer committer timestamp")]
        : [G("ci_rebase_rows", "Y is X rebased: same patch and message, new parent D")];
      answer = kind === "identical" ? G("ci_same", "Yes — every hashed field is identical, so the ID is identical") : G("ci_differ", "No — a hashed field differs, so the commit IDs differ");
      return exercise(G("ci_title", "Must X and Y be the same commit?"), rows, answer, [kind === "identical" ? G("ci_differ", "No — a hashed field differs, so the commit IDs differ") : G("ci_same", "Yes — every hashed field is identical, so the ID is identical"), G("ci_tree_only", "Yes — a commit ID depends only on its tree"), G("ci_never", "No — two commits can never be identical")],
        G("ci_expl", "A commit ID hashes the tree, parents, author, committer, timestamps, and message; any difference produces a different commit."), {}, "identity", [G("tr_compare_fields", "compare tree, parents, metadata, message")]);
    }

    case "status_path_classify": {
      var head = {}, index = {}, work = {};
      if (level === 1) {
        head[P] = "v1"; index[P] = "v1"; work[P] = "v1";
        if (r.bool()) { index[P] = "v2"; work[P] = "v2"; } else work[P] = "v2";
        answer = statusText(pathState(head, index, work, P));
      } else if (level === 2) {
        [P, Q, R].forEach(function (path) { head[path] = "v1"; index[path] = "v1"; work[path] = "v1"; });
        index[P] = "v2"; work[P] = "v2"; work[Q] = "v2";
        var askStaged = r.bool();
        answer = askStaged ? P : Q;
        rows = [G("row_layers", "HEAD: {h}", { h: treeText(head) }), G("row_index", "index: {i}", { i: treeText(index) }), G("row_work", "worktree: {w}", { w: treeText(work) })];
        return exercise(askStaged ? G("st_which_staged", "Which path has only a staged change?") : G("st_which_unstaged", "Which path has only an unstaged change?"), rows, answer, uniqueOptions(answer, [P, Q, R, G("st_no_path", "no path")]),
          G("st_layers_expl", "Staged compares HEAD with the index; unstaged compares the index with the worktree."), { headTree: head, index: index, work: work }, "status", [G("tr_compare_hi", "HEAD vs index"), G("tr_compare_iw", "index vs worktree")]);
      } else {
        var cases = [["v1", "v2", "v3"], [null, "v1", "v2"], ["v1", null, null], ["v1", "v1", null], [null, "v1", "v1"], ["v1", "v2", null]];
        var pick = level === 3 ? cases[0] : r.pick(cases);
        if (pick[0] !== null) head[P] = pick[0]; if (pick[1] !== null) index[P] = pick[1]; if (pick[2] !== null) work[P] = pick[2];
        head[Q] = "v1"; index[Q] = "v1"; work[Q] = "v1";
        answer = statusText(pathState(head, index, work, P));
      }
      var alternativesStatus = [[" ", "M"], ["M", " "], ["M", "M"], ["A", " "], ["A", "M"], ["D", " "], [" ", "D"], ["M", "D"]].map(function (pair) { return statusText({ staged: pair[0], unstaged: pair[1] }); });
      rows = [G("row_layers", "HEAD: {h}", { h: treeText(head) }), G("row_index", "index: {i}", { i: treeText(index) }), G("row_work", "worktree: {w}", { w: treeText(work) })];
      return exercise(G("st_title", "Classify {p} against both state layers.", { p: P }), rows, answer, uniqueOptions(answer, pickDistinct(r, alternativesStatus, 5)),
        G("st_layers_expl", "Staged compares HEAD with the index; unstaged compares the index with the worktree."), { headTree: head, index: index, work: work }, "status", [G("tr_compare_hi", "HEAD vs index"), G("tr_compare_iw", "index vs worktree")]);
    }

    case "porcelain_xy_decode": {
      var meaning = { "M ": G("px_m_", "staged modification only"), " M": G("px__m", "unstaged modification only"), "MM": G("px_mm", "staged and further unstaged modification"), "A ": G("px_a_", "new file, staged"), " D": G("px__d", "deleted in the worktree, not staged"), "D ": G("px_d_", "deletion staged"), "??": G("px_qq", "untracked"), "AM": G("px_am", "new file staged, then modified again") };
      var pool = level === 1 ? ["M ", " M"] : level === 2 ? ["MM", "A ", " D"] : Object.keys(meaning);
      if (level <= 2) {
        var code = r.pick(pool); answer = meaning[code];
        return exercise(G("px_title", "What does porcelain status {code} mean for {p}?", { code: "'" + code + "'", p: P }), [P + "  " + code.replace(/ /g, "·")], answer, uniqueOptions(answer, pickDistinct(r, Object.keys(meaning).map(function (k) { return meaning[k]; }), 5)),
          G("px_expl", "X (left) compares HEAD with the index; Y (right) compares the index with the worktree; ?? marks untracked."), {}, "decode status", [G("tr_decode_xy", "decode X then Y")]);
      }
      var lineCodes = pickDistinct(r, Object.keys(meaning), level >= 5 ? 5 : 4), linePaths = pickDistinct(r, ["app.txt", "config.ini", "src/x.c", "lib/util.py", "docs/guide.md", "notes.txt"], lineCodes.length);
      var target2 = r.int(0, lineCodes.length - 1);
      answer = linePaths[target2];
      return exercise(G("px_which_title", "Which path's status means: {m}?", { m: meaning[lineCodes[target2]] }), lineCodes.map(function (c, k) { return linePaths[k] + "  " + c.replace(/ /g, "·"); }), answer, uniqueOptions(answer, linePaths),
        G("px_expl", "X (left) compares HEAD with the index; Y (right) compares the index with the worktree; ?? marks untracked."), {}, "decode status", [G("tr_decode_xy", "decode X then Y")]);
    }

    case "diff_layer_predict": {
      var h = "v1", ix = "v1", w = "v1";
      if (level === 1) { if (r.bool()) { w = "v2"; } else { ix = "v2"; w = "v2"; } }
      else if (level === 2) { ix = "v2"; w = "v2"; if (r.bool()) { ix = "v1"; w = "v3"; } }
      else { ix = "v2"; w = "v3"; }
      var command = r.pick(level === 1 ? ["git diff", "git diff --staged"] : ["git diff", "git diff --staged", "git diff HEAD"]);
      var from = command === "git diff" ? ix : h, to = command === "git diff --staged" ? ix : w;
      var diffText = function (a, b) { return a === b ? G("no_output", "no output") : G("diff_change", "{p}: {a} → {b}", { p: P, a: a, b: b }); };
      answer = diffText(from, to);
      return exercise(G("diff_title", "What does {cmd} show?", { cmd: command }), [G("row_layers", "HEAD: {h}", { h: P + "=" + h }), G("row_index", "index: {i}", { i: P + "=" + ix }), G("row_work", "worktree: {w}", { w: P + "=" + w })],
        answer, uniqueOptions(answer, [diffText(h, ix), diffText(ix, w), diffText(h, w), G("no_output", "no output"), diffText(w, h)]),
        G("diff_expl", "git diff compares index→worktree; --staged compares HEAD→index; git diff HEAD compares HEAD→worktree."), {}, command, [G("tr_select_layers", "select the two layers")]);
    }

    case "add_path_effect": {
      if (level === 1) {
        answer = G("add_index_becomes", "index {p} becomes {v}; no commit is created", { p: P, v: "v2" });
        return exercise(G("add_title", "What does git add {p} change?", { p: P }), [G("row_index", "index: {i}", { i: P + "=v1" }), G("row_work", "worktree: {w}", { w: P + "=v2" })], answer,
          [G("add_work_becomes", "worktree {p} becomes v1", { p: P }), G("add_commit", "a commit storing {p}=v2 is created", { p: P }), G("add_all", "every modified path is staged")],
          G("add_expl", "git add copies the named path's worktree content into the index."), {}, "git add", [G("tr_copy_work_index", "copy worktree → index")]);
      }
      if (level === 2) {
        var isNew = r.bool();
        answer = isNew ? G("add_new", "index gains {p}=v1 (staged addition)", { p: R }) : G("add_deleted", "index removes {p} (staged deletion)", { p: P });
        rows = isNew ? [G("row_untracked", "untracked new file {p}=v1", { p: R })] : [G("row_index", "index: {i}", { i: P + "=v1" }), G("row_work_missing", "worktree: {p} deleted", { p: P })];
        return exercise(G("add_title", "What does git add {p} change?", { p: isNew ? R : P }), rows, answer,
          uniqueOptions(answer, [G("add_new", "index gains {p}=v1 (staged addition)", { p: isNew ? R : P }), G("add_deleted", "index removes {p} (staged deletion)", { p: isNew ? R : P }), G("add_nothing", "nothing; git add ignores {kind}", { kind: isNew ? G("kind_new", "new files") : G("kind_deleted", "deletions") }), G("add_commit_generic", "a commit is created")]),
          G("add_expl_any", "git add makes the index match the worktree for the named path, including additions and deletions."), {}, "git add", [G("tr_copy_work_index", "copy worktree → index")]);
      }
      var readd = level >= 4 ? r.bool() : false;
      answer = readd ? "v3" : "v2";
      rows = [G("seq_add", "1. git add {p} while worktree {p}=v2", { p: P }), G("seq_edit", "2. edit {p} to v3", { p: P })].concat(readd ? [G("seq_readd", "3. git add {p} again", { p: P })] : []);
      return exercise(G("add_next_commit_title", "What will the next commit record for {p}?", { p: P }), rows, answer, uniqueOptions(answer, ["v1", "v2", "v3", G("add_both", "both v2 and v3")]),
        readd ? G("add_readd_expl", "The second add copies the newer worktree content v3 into the index.") : G("add_stale_expl", "The index kept the v2 copy from the first add; the later edit to v3 is unstaged."), {}, "commit", [G("tr_index_value", "read the index value")]);
    }

    case "add_scope_effect": {
      var cmd = r.pick(["git add -A", "git add -u"]), hasDeleted = level >= 2, hasIgnored = level >= 3;
      rows = [G("row_tracked_mod", "tracked, modified: {p}", { p: P }), G("row_untracked", "untracked new file {p}=v1", { p: "notes.txt" })];
      if (hasDeleted) rows.push(G("row_tracked_del", "tracked, deleted in worktree: {p}", { p: Q }));
      if (hasIgnored) rows.push(G("row_ignored", "untracked, ignored by *.log: {p}", { p: "trace.log" }));
      var staged = [P].concat(hasDeleted ? [Q + " " + G("as_deletion", "(deletion)")] : []).concat(cmd === "git add -A" ? ["notes.txt"] : []);
      answer = listText(staged);
      var everything = [P].concat(hasDeleted ? [Q + " " + G("as_deletion", "(deletion)")] : []).concat(["notes.txt"]).concat(hasIgnored ? ["trace.log"] : []);
      return exercise(G("scope_title", "Which paths does {cmd} stage?", { cmd: cmd }), rows, answer, uniqueOptions(answer, [listText(everything), listText([P]), listText([P, "notes.txt"]), listText([P].concat(hasDeleted ? [Q + " " + G("as_deletion", "(deletion)")] : [])), listText(["notes.txt"]), G("scope_none", "nothing")]),
        G("scope_expl", "-u stages tracked changes, including deletions; -A also stages untracked paths; ignored paths are never added."), {}, cmd, [G("tr_classify_paths", "classify each path")]);
    }

    case "commit_index_snapshot": {
      var askAfter = level >= 4 && r.bool();
      rows = [G("row_layers", "HEAD: {h}", { h: P + "=v1" + (level >= 2 ? ", " + Q + "=v1" : "") }), G("row_index", "index: {i}", { i: P + "=v2" + (level >= 2 ? ", " + Q + "=v1" : "") }), G("row_work", "worktree: {w}", { w: P + "=" + (level >= 3 ? "v3" : "v2") + (level >= 2 ? ", " + Q + "=v2" : "") })];
      if (askAfter) {
        answer = level >= 3 ? G("ci_after_both", "{p} has an unstaged change (v2 → v3) and {q} has an unstaged change (v1 → v2)", { p: P, q: Q }) : G("ci_after_q", "{q} still has an unstaged change", { q: Q });
        return exercise(G("cis_after_title", "After git commit, what does status report?"), rows, answer, uniqueOptions(answer, [G("ci_clean", "everything is clean"), G("ci_after_q", "{q} still has an unstaged change", { q: Q }), G("ci_after_p", "{p} still has a staged change", { p: P })]),
          G("cis_expl", "A commit snapshots exactly the index. Worktree differences that were not staged remain afterwards."), {}, "git commit", [G("tr_new_tree_index", "new tree = index")]);
      }
      answer = treeText(level >= 2 ? (function () { var tr = {}; tr[P] = "v2"; tr[Q] = "v1"; return tr; }()) : (function () { var tr = {}; tr[P] = "v2"; return tr; }()));
      var tw = {}; tw[P] = level >= 3 ? "v3" : "v2"; if (level >= 2) tw[Q] = "v2";
      var th = {}; th[P] = "v1"; if (level >= 2) th[Q] = "v1";
      return exercise(G("cis_title", "Which tree does the new commit record?"), rows, answer, uniqueOptions(answer, [treeText(tw), treeText(th), (function () { var m = {}; m[P] = "v2"; if (level >= 2) m[Q] = "v2"; return treeText(m); }()), G("cis_refused", "nothing — the commit is refused while the worktree differs"), treeText({})]),
        G("cis_expl", "A commit snapshots exactly the index. Worktree differences that were not staged remain afterwards."), {}, "git commit", [G("tr_new_tree_index", "new tree = index")]);
    }

    case "restore_layer_effect": {
      var hv = "v1", iv = level === 2 ? "v2" : level === 1 ? "v1" : "v2", wv = level === 1 ? "v2" : level === 2 ? "v2" : "v3";
      var restoreCmd = level === 1 ? "git restore " + P : level === 2 ? "git restore --staged " + P : r.pick(["git restore " + P, "git restore --staged " + P, "git restore -S -W " + P]);
      var ni = restoreCmd.indexOf("--staged") >= 0 || restoreCmd.indexOf("-S") >= 0 ? hv : iv, nw = restoreCmd.indexOf("-W") >= 0 ? hv : restoreCmd.indexOf("--staged") >= 0 || restoreCmd.indexOf("-S") >= 0 ? wv : iv;
      var layerText = function (a, b) { return G("layers_result", "index {p}={i}; worktree {p}={w}", { p: P, i: a, w: b }); };
      answer = layerText(ni, nw);
      return exercise(G("restore_title", "What does {cmd} leave?", { cmd: restoreCmd }), [G("row_layers", "HEAD: {h}", { h: P + "=" + hv }), G("row_index", "index: {i}", { i: P + "=" + iv }), G("row_work", "worktree: {w}", { w: P + "=" + wv })],
        answer, uniqueOptions(answer, [layerText(hv, hv), layerText(hv, wv), layerText(iv, iv), layerText(iv, wv), layerText(wv, wv)]),
        G("restore_expl", "Plain restore copies index → worktree; -S (--staged) copies HEAD → index; adding -W also copies HEAD → worktree."), {}, restoreCmd, [G("tr_copy_layers", "copy the selected layers")]);
    }

    case "rm_mv_state_effect": {
      var mvPair = r.pick([["draft.txt", "final.txt"], ["notes.md", "guide.md"], ["util.py", "helpers.py"]]), mvValue = r.pick(["blue", "green", "red"]);
      if (level === 1) {
        var cached = r.bool();
        answer = cached ? G("rm_cached", "{p} leaves the index but stays in the worktree as untracked", { p: P }) : G("rm_full", "{p} leaves both the index and the worktree (staged deletion)", { p: P });
        return exercise(G("rm_title", "What does {cmd} do to the clean, tracked {p}?", { cmd: cached ? "git rm --cached " + P : "git rm " + P, p: P }), [G("row_layers", "HEAD: {h}", { h: P + "=v1" })], answer,
          uniqueOptions(answer, [G("rm_cached", "{p} leaves the index but stays in the worktree as untracked", { p: P }), G("rm_full", "{p} leaves both the index and the worktree (staged deletion)", { p: P }), G("rm_history", "{p} is erased from all earlier commits", { p: P })]),
          G("rm_expl", "git rm stages a deletion and removes the file; --cached removes it only from the index. History is untouched."), {}, "git rm", [G("tr_index_delete", "delete from index")]);
      }
      if (level === 2) {
        answer = G("mv_answer", "staged deletion of {a} and staged addition of {b}={v}", { a: mvPair[0], b: mvPair[1], v: mvValue });
        return exercise(G("mv_title", "How does the model store git mv {a} {b}?", { a: mvPair[0], b: mvPair[1] }), [G("row_layers", "HEAD: {h}", { h: mvPair[0] + "=" + mvValue })], answer,
          [G("mv_object", "one rename object linking the names"), G("mv_work_only", "a worktree-only name change"), G("mv_commit", "a commit is created immediately")],
          G("mv_expl", "A move is a deletion plus an addition with the same content; no rename is stored."), {}, "git mv", [G("tr_delete_add", "delete old, add new")]);
      }
      answer = G("mv_tree", "a tree with {b}={v} and no {a}; any rename is inferred later by comparison", { a: mvPair[0], b: mvPair[1], v: mvValue });
      return exercise(G("mv_commit_title", "After git mv {a} {b} and git commit, what does the new commit store?", { a: mvPair[0], b: mvPair[1] }), [G("row_layers", "HEAD: {h}", { h: mvPair[0] + "=" + mvValue })], answer,
        [G("mv_rename_record", "a rename record from {a} to {b}", { a: mvPair[0], b: mvPair[1] }), G("mv_both", "both {a} and {b}", { a: mvPair[0], b: mvPair[1] }), G("mv_old", "{a} unchanged", { a: mvPair[0] })],
        G("mv_commit_expl", "Commits store snapshots only; tools detect renames afterwards by comparing trees."), {}, "commit", [G("tr_new_tree_index", "new tree = index")]);
    }

    case "ignore_rule_match": {
      var ruleSets = level === 1 ? [["*.log"]] : level === 2 ? [["/build"], ["tmp/"], ["/build", "tmp/"]] : [["*.log", "!keep.log"], ["*.tmp", "!src/*.tmp"], ["/out", "*.log", "!keep.log"]];
      var rules = r.pick(ruleSets);
      var candidates = level === 1 ? ["app.log", "logs/x.log", "app.txt", "log.txt"] : level === 2 ? ["build", "src/build", "tmp/a.txt", "src/tmp/b.txt", "tmp.txt"] : ["keep.log", "x.log", "src/a.tmp", "a.tmp", "out", "src/out"];
      var askIgnored = r.bool(), matching = candidates.filter(function (p) { return ignoreMatch(p, rules) === askIgnored; }), notMatching = candidates.filter(function (p) { return ignoreMatch(p, rules) !== askIgnored; });
      if (!matching.length || notMatching.length < 2) { askIgnored = !askIgnored; matching = candidates.filter(function (p) { return ignoreMatch(p, rules) === askIgnored; }); notMatching = candidates.filter(function (p) { return ignoreMatch(p, rules) !== askIgnored; }); }
      answer = r.pick(matching);
      return exercise(askIgnored ? G("ign_title_yes", "Which path is ignored by these ordered rules?") : G("ign_title_no", "Which path is NOT ignored by these ordered rules?"), rules.map(function (rule) { return G("row_rule", "rule: {r}", { r: rule }); }), answer, uniqueOptions(answer, pickDistinct(r, notMatching, 3)),
        G("ign_expl", "Rules apply in order and the last match wins; a leading / anchors to the root, a trailing / matches a directory, and a rule without a slash matches any path component."), { ignoreRules: rules }, "ignore match", [G("tr_last_match", "last matching rule wins")]);
    }

    case "tracked_ignore_behavior": {
      var logs = pickDistinct(r, ["debug.log", "trace.log", "build.log"], 2), L1n = logs[0], L2n = logs[1];
      if (level === 1) {
        answer = G("ti_still", "it stays tracked and its modification is reported");
        return exercise(G("ti_title", "The tracked {f} is modified after *.log is added to .gitignore. What happens?", { f: L1n }), [G("row_rule", "rule: {r}", { r: "*.log" })], answer,
          [G("ti_untracked", "it becomes untracked"), G("ti_deleted", "Git deletes it"), G("ti_hidden", "its modification is hidden")],
          G("ti_expl", "Ignore rules affect only untracked paths; an index entry stays tracked."), { ignoreRules: ["*.log"] }, "status", [G("tr_tracked_wins", "tracked membership wins")]);
      }
      if (level === 2) {
        answer = G("ti_status_two", "{f} is reported as modified; {g} is not listed", { f: L1n, g: L2n });
        return exercise(G("ti_two_title", "Tracked {f} is modified and untracked {g} exists; rule *.log. What does status show?", { f: L1n, g: L2n }), [G("row_rule", "rule: {r}", { r: "*.log" })], answer,
          [G("ti_both_hidden", "neither path is listed"), G("ti_both_listed", "both paths are listed"), G("ti_new_only", "only {g} is listed as untracked", { g: L2n })],
          G("ti_expl", "Ignore rules affect only untracked paths; an index entry stays tracked."), { ignoreRules: ["*.log"] }, "status", [G("tr_tracked_wins", "tracked membership wins")]);
      }
      answer = G("ti_rm_cached", "a staged deletion of {f}; the worktree file is now ignored and not listed as untracked", { f: L1n });
      return exercise(G("ti_rm_title", "With rule *.log, you run git rm --cached {f}. What does status show?", { f: L1n }), [G("row_rule", "rule: {r}", { r: "*.log" })], answer,
        [G("ti_rm_untracked", "{f} listed as untracked", { f: L1n }), G("ti_rm_gone", "{f} deleted from the worktree", { f: L1n }), G("ti_rm_nothing", "no change at all")],
        G("ti_rm_expl", "--cached removes only the index entry, so the next commit deletes it; the remaining worktree file is now untracked and therefore ignored."), { ignoreRules: ["*.log"] }, "git rm --cached", [G("tr_index_delete", "delete from index"), G("tr_reassess", "reassess ignore rules")]);
    }

    case "branch_create_effect": {
      var older = "B";
      if (level === 1) {
        answer = G("bc_add", "{t} → C is added; HEAD stays on {b}", { t: top, b: cur });
        return exercise(G("bc_title", "HEAD → {b} → C. What does git branch {t} do?", { b: cur, t: top }), [G("row_head_attached", "HEAD → {b}", { b: cur }), G("row_ref", "{r} → {c}", { r: cur, c: "C" })], answer,
          [G("bc_switch", "HEAD switches to {t}", { t: top }), G("bc_commit", "a new commit named {t} is created", { t: top }), G("bc_move", "{b} moves to {t}", { b: cur, t: top })],
          G("bc_expl", "Creating a branch adds a ref at the current commit; it does not commit or switch."), {}, "git branch", [G("tr_create_at", "create {t} at {o}", { t: top, o: "C" })]);
      }
      if (level === 2) {
        answer = G("bc_switch_c", "{t} → C is added and HEAD attaches to {t}", { t: top });
        return exercise(G("bc_switch_title", "HEAD → {b} → C. What does git switch -c {t} do?", { b: cur, t: top }), [G("row_head_attached", "HEAD → {b}", { b: cur }), G("row_ref", "{r} → {c}", { r: cur, c: "C" })], answer,
          [G("bc_add", "{t} → C is added; HEAD stays on {b}", { t: top, b: cur }), G("bc_commit", "a new commit named {t} is created", { t: top }), G("bc_move", "{b} moves to {t}", { b: cur, t: top })],
          G("bc_switch_expl", "switch -c creates the branch and attaches HEAD to it; the commit and files are unchanged."), {}, "git switch -c", [G("tr_create_at", "create {t} at {o}", { t: top, o: "C" }), G("tr_attach_b", "attach HEAD to {t}", { t: top })]);
      }
      var andSwitch = level >= 4 && r.bool();
      answer = andSwitch ? G("bc_old_switch", "{t} → {o}; HEAD attaches to {t}; index and worktree become tree {o}", { t: top, o: older }) : G("bc_old", "{t} → {o}; HEAD, {b}, index, and worktree are unchanged", { t: top, o: older, b: cur });
      return exercise(G("bc_old_title", "HEAD → {b} → C. What does {cmd} do?", { b: cur, cmd: andSwitch ? "git switch -c " + top + " " + older : "git branch " + top + " " + older }), parentRows(linearDag(3).dag).concat([G("row_ref", "{r} → {c}", { r: cur, c: "C" })]), answer,
        uniqueOptions(answer, [G("bc_old", "{t} → {o}; HEAD, {b}, index, and worktree are unchanged", { t: top, o: older, b: cur }), G("bc_old_switch", "{t} → {o}; HEAD attaches to {t}; index and worktree become tree {o}", { t: top, o: older }), G("bc_at_head", "{t} → C, ignoring the start point", { t: top }), G("bc_rewind", "{b} moves back to {o}", { b: cur, o: older })]),
        G("bc_old_expl", "An explicit start point sets where the branch is created; only switch also moves HEAD and checks out that tree."), {}, "branch", [G("tr_create_at", "create {t} at {o}", { t: top, o: older })]);
    }

    case "switch_branch_effect": {
      var variant2 = level === 1 ? "clean" : level === 2 ? "carry" : r.pick(["blocked", "untracked", "carry"]);
      rows = [G("row_head_attached", "HEAD → {b}", { b: cur }), G("row_ref", "{r} → {c}", { r: cur, c: "C" }), G("row_ref", "{r} → {c}", { r: top, c: "D" })];
      if (variant2 === "clean") { rows.push(G("sw_clean_row", "clean index and worktree; trees C and D differ at {p}", { p: P })); answer = G("sw_clean", "HEAD attaches to {t}; index and worktree become tree D", { t: top }); }
      else if (variant2 === "carry") { rows.push(G("sw_carry_row", "{p} has a local edit; {p} is identical in C and D", { p: P })); answer = G("sw_carry", "the switch succeeds and the local edit to {p} is kept", { p: P }); }
      else if (variant2 === "blocked") { rows.push(G("sw_blocked_row", "{p} has a local edit; C and D store different {p}", { p: P })); answer = G("sw_refused", "the switch is refused; nothing changes"); }
      else { rows.push(G("sw_untracked_row", "untracked {p} exists in the worktree; D tracks a different {p}", { p: R })); answer = G("sw_refused", "the switch is refused; nothing changes"); }
      return exercise(G("sw_title", "Predict git switch {t}.", { t: top }), rows, answer, uniqueOptions(answer, [G("sw_clean", "HEAD attaches to {t}; index and worktree become tree D", { t: top }), G("sw_carry", "the switch succeeds and the local edit to {p} is kept", { p: P }), G("sw_refused", "the switch is refused; nothing changes"), G("sw_overwrite", "the switch succeeds and overwrites the local file")]),
        G("sw_expl", "A switch rewrites only paths that differ between the commits; it refuses when that would overwrite local changes or untracked files, and carries changes to paths that do not differ."), {}, "git switch", [G("tr_compare_trees", "compare trees C and D"), G("tr_check_local", "check local changes")]);
    }

    case "commit_branch_movement": {
      if (level === 1) {
        answer = G("cbm_one", "{b} moves to D", { b: cur });
        return exercise(G("cbm_title", "HEAD → {b} → C. After committing D, which refs move?", { b: cur }), [G("row_ref", "{r} → {c}", { r: cur, c: "C" }), G("row_ref", "{r} → {c}", { r: top, c: "B" })], answer,
          [G("cbm_both", "{b} and {t} both move to D", { b: cur, t: top }), G("cbm_other", "{t} moves to D", { t: top }), G("cbm_detach", "HEAD detaches at D")],
          G("cbm_expl", "A commit advances only the branch HEAD is attached to."), {}, "commit", [G("tr_branch_advance_b", "{b} → {n}", { b: cur, n: "D" })]);
      }
      var perBranch = level >= 4 ? 2 : 1, topIds = letters(3, perBranch), curIds = letters(3 + perBranch, perBranch);
      var topTip = topIds[topIds.length - 1], curTip = curIds[curIds.length - 1];
      rows = [G("row_ref_both", "{b} and {t} → C", { b: cur, t: top }), G("cbm_seq1", "1. git switch {t}; commit {c}", { t: top, c: listText(topIds) }), G("cbm_seq2", "2. git switch {b}; commit {c}", { b: cur, c: listText(curIds) })];
      if (level === 2) {
        answer = G("cbm_positions", "{b} → {x}; {t} → {y}", { b: cur, x: curTip, t: top, y: topTip });
        return exercise(G("cbm_where_title", "Where do the branches point afterwards?"), rows, answer, uniqueOptions(answer, [G("cbm_positions", "{b} → {x}; {t} → {y}", { b: cur, x: topTip, t: top, y: curTip }), G("cbm_positions", "{b} → {x}; {t} → {y}", { b: cur, x: curTip, t: top, y: curTip }), G("cbm_positions", "{b} → {x}; {t} → {y}", { b: cur, x: "C", t: top, y: topTip })]),
          G("cbm_alt_expl", "Each commit advances whichever branch HEAD is attached to at that moment."), {}, "commit", [G("tr_branch_advance_b", "{b} → {n}", { b: top, n: topTip }), G("tr_branch_advance_b", "{b} → {n}", { b: cur, n: curTip })]);
      }
      answer = G("cbm_diverged", "{b} and {t} have diverged from C", { b: cur, t: top });
      return exercise(G("cbm_relation_title", "Which statement is true afterwards?"), rows, answer, [G("cbm_anc", "{t} is an ancestor of {b}", { t: top, b: cur }), G("cbm_anc", "{t} is an ancestor of {b}", { t: cur, b: top }), G("cbm_same", "both branches point to {c}", { c: curTip })],
        G("cbm_div_expl", "Each branch gained commits the other lacks, so neither tip is an ancestor of the other; C is their merge base."), {}, "commit", [G("tr_unique_each", "each side has unique commits")]);
    }

    case "branch_delete_reachability": {
      if (level === 1) {
        answer = G("bd_reachable", "yes — {c} is still reachable from {b}", { c: "D", b: cur });
        return exercise(G("bd_title", "{t} → D is fully merged into {b} → E. After git branch -d {t}, is D still reachable from a ref?", { t: top, b: cur }), parentRows({ A: [], B: ["A"], C: ["B"], D: ["C"], E: ["D"] }), answer,
          [G("bd_gone", "no — deleting the branch deletes D"), G("bd_refused", "the delete is refused"), G("bd_tag_only", "only through a tag")],
          G("bd_merged_expl", "Deleting a branch removes one name; D stays reachable from {b}.", { b: cur }), {}, "git branch -d", [G("tr_remove_ref", "remove the ref"), G("tr_scan_refs", "scan the remaining refs")]);
      }
      var force = level === 2 ? r.bool() : true, keeper = level >= 3;
      rows = parentRows({ A: [], B: ["A"], C: ["B"], D: ["B"] }).concat([G("row_ref", "{r} → {c}", { r: cur, c: "C" }), G("row_ref", "{r} → {c}", { r: top, c: "D" })]);
      var keeperName = level >= 4 && r.bool() ? "backup" : "safe";
      if (keeper) rows.push(keeperName === "backup" ? G("row_ref", "{r} → {c}", { r: "backup", c: "D" }) : G("row_tag", "tag {r} → {c}", { r: "safe", c: "D" }));
      answer = !force ? G("bd_refused_unmerged", "git branch -d refuses: D is not merged into {b}", { b: cur }) : keeper ? G("bd_kept_by", "the ref is deleted; D stays reachable from {k}", { k: keeperName }) : G("bd_unreferenced", "the ref is deleted; D is now reachable only through the reflog");
      return exercise(G("bd_cmd_title", "What does git branch {flag} {t} do?", { flag: force ? "-D" : "-d", t: top }), rows, answer,
        uniqueOptions(answer, [G("bd_refused_unmerged", "git branch -d refuses: D is not merged into {b}", { b: cur }), G("bd_unreferenced", "the ref is deleted; D is now reachable only through the reflog"), G("bd_commit_deleted", "commit D is deleted immediately"), G("bd_kept_by", "the ref is deleted; D stays reachable from {k}", { k: cur })]),
        G("bd_expl", "-d refuses to drop unmerged work; -D removes only the name. A commit stays reachable while any other ref reaches it."), {}, "git branch", [G("tr_remove_ref", "remove the ref"), G("tr_scan_refs", "scan the remaining refs")]);
    }

    case "revision_parent_expression": {
      var revSteps, revText;
      if (level === 1) { g = linearDag(r.int(4, 6)); dag = g.dag; var n1 = r.int(1, g.ids.length - 2); revSteps = [{ op: "~", n: n1 }]; x = g.tip; revText = x + "~" + n1; }
      else {
        var mg = mergedDag(r, level === 2 ? 3 : level === 3 ? 4 : 5); dag = mg.dag; x = mg.tip;
        var options2 = level === 2 ? [[{ op: "^", n: 2 }], [{ op: "^", n: 1 }]] : [[{ op: "^", n: 2 }], [{ op: "^", n: 2 }, { op: "~", n: 1 }], [{ op: "~", n: 1 }], [{ op: "^", n: 1 }, { op: "~", n: 1 }]];
        if (x !== mg.merge) { options2 = options2.map(function (s) { return [{ op: "~", n: 1 }].concat(s); }); }
        revSteps = r.pick(options2);
        revText = x + revSteps.map(function (s) { return s.op === "~" ? "~" + s.n : "^" + s.n; }).join("");
      }
      answer = resolveRevision(dag, x, revSteps);
      if (!answer) return scenario(id, level, r);
      return exercise(G("rev_title", "Resolve {rev}.", { rev: revText }), parentRows(dag), answer, uniqueOptions(answer, Object.keys(dag).filter(function (c) { return c !== answer; }).sort().reverse()),
        G("rev_expl", "~n follows first parents n times; ^n selects the nth parent of one commit. Apply them left to right."), { dag: dag }, "resolve " + revText, [G("tr_apply_steps", "apply each step left to right")]);
    }

    case "revision_range_select": {
      var lo, hi;
      if (level === 1) { g = linearDag(r.int(4, 6)); dag = g.dag; lo = g.ids[r.int(0, g.ids.length - 3)]; hi = g.tip; }
      else if (level === 2) { g = forkDag(r.int(1, 3), r.int(1, 3), r.int(1, 3)); dag = g.dag; lo = g.leftTip; hi = g.rightTip; if (r.bool()) { lo = g.rightTip; hi = g.leftTip; } }
      else { var m3 = mergedDag(r, level); dag = m3.dag; lo = r.pick([m3.first, m3.second]); hi = m3.tip; }
      var sel = range(dag, lo, hi);
      answer = setText(sel);
      return exercise(G("range_title", "Which commits does {a}..{b} select?", { a: lo, b: hi }), parentRows(dag), answer,
        uniqueOptions(answer, [setText(range(dag, hi, lo).length ? range(dag, hi, lo) : [lo]), setText(reachable(dag, hi)), setText(sel.concat([lo])), setText(sel.filter(function (c) { return c !== hi; }).length ? sel.filter(function (c) { return c !== hi; }) : [mergeBase(dag, lo, hi) || lo])]),
        G("range_expl", "{a}..{b} is everything reachable from {b} minus everything reachable from {a}.", { a: lo, b: hi }), { dag: dag }, lo + ".." + hi, [G("tr_reach", "reachable({c})", { c: hi }), G("tr_subtract", "subtract reachable({c})", { c: lo })]);
    }

    case "history_order_reason": {
      var largerFirst = r.bool(), tieText = largerFirst ? G("tie_larger", "tie rule: larger ID first") : G("tie_smaller", "tie rule: smaller ID first");
      if (level <= 2) {
        g = level === 1 ? (function () { var l = linearDag(r.int(3, 6)); return { dag: l.dag, tip: l.tip }; }()) : (function () { var f = forkDag(r.int(1, 2), r.int(1, 2), r.int(1, 2)); var m = f.add([f.leftTip, f.rightTip]); return { dag: f.dag, tip: m }; }());
        answer = listText(topoOrder(g.dag, g.tip, largerFirst));
        var wrongTie = listText(topoOrder(g.dag, g.tip, !largerFirst)), reversed = listText(topoOrder(g.dag, g.tip, largerFirst).slice().reverse());
        return exercise(G("hist_title", "Give the newest-first order of all commits reachable from {c}.", { c: g.tip }), parentRows(g.dag).concat(level === 2 ? [tieText] : []), answer,
          uniqueOptions(answer, [wrongTie, reversed, listText(reachable(g.dag, g.tip)), (function () { var o = topoOrder(g.dag, g.tip, largerFirst).slice(); var k = o.length - 2; var tmp = o[k]; o[k] = o[k + 1]; o[k + 1] = tmp; return listText(o); }()), (function () { var o = topoOrder(g.dag, g.tip, largerFirst).slice(); var tmp = o[0]; o[0] = o[1]; o[1] = tmp; return listText(o); }())]), G("hist_expl", "Children come before their parents; the stated tie rule orders commits that are otherwise unordered."), { dag: g.dag }, "history order", [G("tr_children_first", "children before parents")]);
      }
      var m4 = mergedDag(r, level); var firstParent = r.bool();
      answer = firstParent ? listText(firstParentChain(m4.dag, m4.tip)) : listText(topoOrder(m4.dag, m4.tip, largerFirst));
      return exercise(firstParent ? G("hist_fp_title", "Which commits does git log --first-parent {c} list, newest first?", { c: m4.tip }) : G("hist_title", "Give the newest-first order of all commits reachable from {c}.", { c: m4.tip }),
        parentRows(m4.dag).concat(firstParent ? [] : [tieText]), answer,
        uniqueOptions(answer, [listText(firstParentChain(m4.dag, m4.tip)), listText(topoOrder(m4.dag, m4.tip, largerFirst)), listText(topoOrder(m4.dag, m4.tip, !largerFirst)), listText(reachable(m4.dag, m4.tip))]),
        firstParent ? G("hist_fp_expl", "--first-parent follows only the first parent of each merge, so the merged side's commits are skipped.") : G("hist_expl", "Children come before their parents; the stated tie rule orders commits that are otherwise unordered."), { dag: m4.dag }, "history order", [G("tr_children_first", "children before parents")]);
    }

    case "merge_case_classify": {
      var shape = level === 1 ? r.pick(["ff", "uptodate"]) : level === 2 ? "diverged" : r.pick(["ffonly", "noff", "diverged", "ff"]);
      var option = shape === "ffonly" ? " --ff-only" : shape === "noff" ? " --no-ff" : "";
      rows = shape === "uptodate" ? [G("row_ref", "{r} → {c}", { r: cur, c: "D" }), G("row_ref", "{r} → {c}", { r: top, c: "B" }), G("mc_desc_row", "D descends from B")]
        : shape === "ff" || shape === "noff" ? [G("row_ref", "{r} → {c}", { r: cur, c: "B" }), G("row_ref", "{r} → {c}", { r: top, c: "D" }), G("mc_desc_row", "D descends from B")]
        : [G("row_ref", "{r} → {c}", { r: cur, c: "C" }), G("row_ref", "{r} → {c}", { r: top, c: "D" }), G("mc_sib_row", "C and D both descend from B")];
      answer = { ff: G("mc_ff", "fast-forward"), uptodate: G("mc_uptodate", "already up to date"), diverged: G("mc_three", "three-way merge creating a merge commit"), ffonly: G("mc_refused", "refused: a fast-forward is impossible"), noff: G("mc_forced", "merge commit created although a fast-forward was possible") }[shape];
      return exercise(G("mc_title", "Classify git merge{o} {t} with HEAD → {b}.", { o: option, t: top, b: cur }), rows, answer,
        uniqueOptions(answer, [G("mc_ff", "fast-forward"), G("mc_uptodate", "already up to date"), G("mc_three", "three-way merge creating a merge commit"), G("mc_refused", "refused: a fast-forward is impossible"), G("mc_forced", "merge commit created although a fast-forward was possible")]),
        G("mc_expl", "Compare ancestry first: target already contained → up to date; current is an ancestor of target → fast-forward; otherwise a three-way merge. --ff-only refuses anything but a fast-forward and --no-ff always records a merge."), {}, "git merge", [G("tr_ancestry", "check ancestry")]);
    }

    case "fast_forward_effect": {
      var ahead = level === 1 ? 1 : level === 2 ? 3 : 2, aheadIds = letters(2, ahead), ffTip = aheadIds[aheadIds.length - 1];
      if (level >= 3) {
        answer = G("ff_remote", "{b} moves to {c}; origin/{b} is unchanged; no commit is created", { b: cur, c: ffTip });
        return exercise(G("ff_remote_title", "HEAD → {b} → B; origin/{b} → {c} descends from B. What does git merge origin/{b} do?", { b: cur, c: ffTip }), [G("row_chain", "B ← {c}", { c: listText(aheadIds) })], answer,
          [G("ff_remote_both", "both {b} and origin/{b} move to a new merge commit", { b: cur }), G("ff_remote_tracking", "origin/{b} moves back to B", { b: cur }), G("ff_remote_server", "the server's {b} moves to {c}", { b: cur, c: ffTip })],
          G("ff_remote_expl", "Merging the remote-tracking ref fast-forwards the local branch only; remote-tracking refs change on fetch, and the server only on push."), {}, "git merge", [G("tr_move_ref", "move {b} to {c}", { b: cur, c: ffTip })]);
      }
      answer = G("ff_move", "{b} moves to existing {c}; no commit is created", { b: cur, c: ffTip });
      return exercise(G("ff_title", "HEAD → {b} → B; {t} → {c} descends from B. What does git merge {t} do?", { b: cur, t: top, c: ffTip }), [G("row_chain", "B ← {c}", { c: listText(aheadIds) })], answer,
        [G("ff_new_commit", "a merge commit with parents B and {c} is created", { c: ffTip }), G("ff_topic_moves", "{t} moves back to B", { t: top }), G("ff_copies", "copies of the topic commits are created on {b}", { b: cur })],
        G("ff_expl", "A fast-forward just moves the branch to an existing descendant."), {}, "git merge", [G("tr_move_ref", "move {b} to {c}", { b: cur, c: ffTip })]);
    }

    case "no_ff_merge_effect": {
      var topicCount = level === 1 ? 1 : level === 2 ? 3 : 2, topicIds = letters(2, topicCount), tipT = topicIds[topicIds.length - 1], mergeId = String.fromCharCode(65 + 2 + topicCount);
      rows = [G("row_ref", "{r} → {c}", { r: cur, c: "B" }), G("row_ref", "{r} → {c}", { r: top, c: tipT }), G("row_chain", "B ← {c}", { c: listText(topicIds) })];
      if (level >= 3) {
        answer = listText([mergeId, "B", "A"]);
        return exercise(G("noff_fp_title", "After git merge --no-ff {t} creates {m}, which commits does git log --first-parent list?", { t: top, m: mergeId }), rows, answer,
          uniqueOptions(answer, [listText([mergeId].concat(topicIds.slice().reverse(), ["B", "A"])), listText(topicIds.slice().reverse().concat(["B", "A"])), listText([mergeId, tipT, "A"])]),
          G("noff_fp_expl", "The merge's first parent is the old {b} tip B, so first-parent history skips the topic commits.", { b: cur }), {}, "git log --first-parent", [G("tr_first_parent", "follow first parents")]);
      }
      answer = G("noff_parents", "new {m} with parents ({p1}, {p2}); {b} → {m}", { m: mergeId, p1: "B", p2: tipT, b: cur });
      return exercise(G("noff_title", "What does git merge --no-ff {t} create?", { t: top }), rows, answer,
        [G("noff_parents", "new {m} with parents ({p1}, {p2}); {b} → {m}", { m: mergeId, p1: tipT, p2: "B", b: cur }), G("noff_ff", "no commit; {b} → {c}", { b: cur, c: tipT }), G("noff_single", "new {m} with parent {c} only", { m: mergeId, c: tipT })],
        G("noff_expl", "--no-ff always records a merge commit whose first parent is the current tip and second parent the merged tip."), {}, "git merge --no-ff", [G("tr_create_merge", "create merge (B, {c})", { c: tipT })]);
    }

    case "three_way_tree_merge": {
      var base = {}, ours = {}, theirs = {}, keys;
      if (level <= 2) {
        keys = level === 1 ? [P, Q] : [P, Q, R];
        keys.forEach(function (k) { base[k] = "1"; ours[k] = "1"; theirs[k] = "1"; });
        ours[P] = "2"; theirs[Q] = "2"; if (level === 2) { ours[R] = "3"; theirs[R] = "3"; }
      } else {
        var lineKey = function (n) { return G("line_n", "line {n}", { n: n }); };
        keys = [lineKey(1), lineKey(2), lineKey(3)].concat(level >= 4 ? [lineKey(4)] : []);
        keys.forEach(function (k, k2) { base[k] = String.fromCharCode(97 + k2); ours[k] = base[k]; theirs[k] = base[k]; });
        ours[lineKey(1)] = "A1"; theirs[lineKey(3)] = "C3"; if (level >= 5) { ours[lineKey(4)] = "D4"; theirs[lineKey(4)] = "D4"; }
      }
      merged = mergeTrees(base, ours, theirs);
      answer = treeText(merged.tree);
      var label = level >= 3 ? G("same_file", "one file {p}, by line", { p: P }) : "";
      return exercise(G("tw_title", "Compute the clean three-way merge result."), (label ? [label] : []).concat([G("row_base", "base: {t}", { t: treeText(base) }), G("row_ours", "ours: {t}", { t: treeText(ours) }), G("row_theirs", "theirs: {t}", { t: treeText(theirs) })]), answer,
        uniqueOptions(answer, [treeText(ours), treeText(theirs), treeText(base), G("tw_conflict", "conflict")]),
        G("tw_expl", "For each path or line: if only one side changed it relative to base, take that side; identical changes merge cleanly."), { base: base, ours: ours, theirs: theirs }, "three-way merge", [G("tr_per_path", "decide each path against base")]);
    }

    case "merge_conflict_identify": {
      var b2 = {}, o2 = {}, t2 = {}, set = level === 1 ? [P, Q] : level === 2 ? [P, Q] : [P, Q, R, "README.md"];
      set.forEach(function (k) { b2[k] = "1"; o2[k] = "1"; t2[k] = "1"; });
      o2[P] = "2"; if (level === 2) delete t2[P]; else t2[P] = "3";
      if (level >= 3) { o2[Q] = "2"; t2[R] = "2"; o2["README.md"] = "4"; t2["README.md"] = "4"; if (level >= 4) { delete o2[R]; t2[R] = "2"; } }
      var res = mergeTrees(b2, o2, t2);
      answer = res.conflicts.length ? setText(res.conflicts) : G("no_conflict", "no conflict");
      return exercise(G("mci_title", "Which paths conflict?"), [G("row_base", "base: {t}", { t: treeText(b2) }), G("row_ours", "ours: {t}", { t: treeText(o2) }), G("row_theirs", "theirs: {t}", { t: treeText(t2) })], answer,
        uniqueOptions(answer, [setText(set), setText([P]), setText(set.filter(function (k) { return k !== P; })), G("no_conflict", "no conflict"), setText([P, Q])]),
        G("mci_expl", "A path conflicts when both sides changed it differently relative to base — including one side modifying and the other deleting."), { conflicts: res.conflicts }, "three-way merge", [G("tr_per_path", "decide each path against base")]);
    }

    case "conflict_index_stages": {
      var deletion = level >= 3 && (level === 3 || r.bool()), stage = r.pick([1, 2, 3]);
      rows = level === 1 ? [G("cis_ours_row", "ours: {p}=blue", { p: P }), G("cis_theirs_row", "theirs: {p}=green", { p: P }), G("cis_base_row", "base: {p}=red", { p: P })]
        : [G("cis_current_row", "current branch {b} has {p}=blue", { b: top, p: P }), G("cis_merging_row", "merging branch {b} has {p}={v}", { b: cur, p: P, v: deletion ? G("deleted_word", "deleted") : "green" }), G("cis_base_row", "base: {p}=red", { p: P })];
      if (deletion) {
        answer = G("stages_12", "stages 1 (red) and 2 (blue); no stage 3");
        return exercise(G("stage_exist_title", "Which index stages exist for {p}?", { p: P }), rows, answer,
          [G("stages_123", "stages 1, 2, and 3"), G("stages_13", "stages 1 and 3 only"), G("stages_0", "only stage 0")],
          G("stage_del_expl", "Stage 1 is base, 2 ours, 3 theirs; a side that deleted the path has no entry in its stage."), {}, "conflict staging", [G("tr_stage_map", "1=base, 2=ours, 3=theirs")]);
      }
      answer = stage === 1 ? "red" : stage === 2 ? "blue" : "green";
      return exercise(G("stage_title", "What value does index stage {n} hold for {p}?", { n: stage, p: P }), rows, answer, uniqueOptions(answer, ["red", "blue", "green", G("no_stage", "no such stage")]),
        G("stage_expl", "Stage 1 is the merge base, stage 2 is ours (the current branch), and stage 3 is theirs (the branch being merged)."), {}, "conflict staging", [G("tr_stage_map", "1=base, 2=ours, 3=theirs")]);
    }

    case "resolve_conflict_complete": {
      if (level <= 2) {
        var conflicted = level === 1 ? [P] : [P, Q];
        answer = level === 1 ? G("rc_one", "edit {p}; git add {p}; git commit", { p: P }) : G("rc_two", "edit and git add both {p} and {q}; then git commit", { p: P, q: Q });
        return exercise(G("rc_title", "Which sequence completes the conflicted merge?"), [G("rc_row", "unmerged paths: {s}", { s: listText(conflicted) })], answer,
          uniqueOptions(answer, [G("rc_no_add", "edit the files; git commit"), G("rc_partial", "edit and git add {p} only; then git commit", { p: P }), G("rc_commit_first", "git commit; then git add the files"), G("rc_one", "edit {p}; git add {p}; git commit", { p: P })]),
          G("rc_expl", "Every unmerged path must be resolved and added (stage 0) before the merge commit can be created."), {}, "resolve merge", [G("tr_stage_each", "stage each resolution"), G("tr_commit", "commit")]);
      }
      answer = G("rc_staged_version", "purple — the staged resolution; the later edit is not included");
      return exercise(G("rc_after_title", "You resolve {p} to purple and git add it, then edit it to orange without adding. What does git commit record for {p}?", { p: P }), [G("rc_row", "unmerged paths: {s}", { s: P })], answer,
        [G("rc_later", "orange — the newest worktree content"), G("rc_refused", "the commit is refused because the worktree differs"), G("rc_both", "both values, with conflict markers")],
        G("rc_after_expl", "The commit records the index; re-add the file to include later edits."), {}, "commit", [G("tr_new_tree_index", "new tree = index")]);
    }

    case "merge_abort_effect": {
      if (level <= 2) {
        answer = level === 1 ? G("ma_restore", "HEAD, index, and worktree return to the pre-merge state") : G("ma_restore_lost", "everything returns to the pre-merge state; the staged resolutions are discarded");
        return exercise(G("ma_title", "What does git merge --abort do here?"), [G("ma_row", "merge of {t} into {b} stopped with a conflict in {p}", { t: top, b: cur, p: P })].concat(level === 2 ? [G("ma_row_staged", "{q} was already resolved and staged", { q: Q })] : []), answer,
          uniqueOptions(answer, [G("ma_restore", "HEAD, index, and worktree return to the pre-merge state"), G("ma_keep", "the staged resolutions are kept and the merge continues"), G("ma_inverse", "an inverse commit is created"), G("ma_restore_lost", "everything returns to the pre-merge state; the staged resolutions are discarded")]),
          G("ma_expl", "Abort restores the saved pre-merge state of HEAD, index, and worktree and ends the operation."), {}, "git merge --abort", [G("tr_load_saved", "load saved state")]);
      }
      var goal = r.pick(["record", "discard", "abort"]);
      answer = goal === "record" ? "git commit" : goal === "abort" ? "git merge --abort" : "git reset --hard";
      return exercise(goal === "record" ? G("ma_goal_record", "All conflicts are resolved and staged. Which command records the merge?") : goal === "abort" ? G("ma_goal_abort", "Which command cancels the merge and restores the pre-merge state?") : G("ma_goal_discard", "Which command discards the merge state and all local changes, leaving HEAD where it is?"),
        [G("ma_row", "merge of {t} into {b} stopped with a conflict in {p}", { t: top, b: cur, p: P })], answer, uniqueOptions(answer, ["git commit", "git merge --abort", "git reset --hard", "git revert HEAD"]),
        G("ma_cmp_expl", "commit records the resolved merge; merge --abort restores the saved pre-merge state; reset --hard discards the merge state and local changes."), {}, "choose", [G("tr_match_goal", "match the goal")]);
    }

    case "reset_mode_effect": {
      var mode = level === 1 ? "soft" : level === 2 ? "mixed" : r.pick(["soft", "mixed", "hard"]);
      var rv0 = r.int(1, 5), rvs = function (k) { return String(rv0 + k); };
      var state0 = { headTree: { a: rvs(1) }, index: { a: level >= 3 ? rvs(2) : rvs(1) }, work: { a: level >= 3 ? rvs(3) : rvs(2) } };
      var after = resetState(state0, { a: rvs(0) }, mode);
      var resetText = function (s) { return G("reset_result", "branch → B; index a={i}; worktree a={w}", { i: s.index.a, w: s.work.a }); };
      answer = resetText(after) + (level >= 4 ? G("reset_untracked_suffix", "; untracked notes.txt kept") : "");
      var alts = ["soft", "mixed", "hard"].filter(function (m) { return m !== mode; }).map(function (m) { return resetText(resetState(state0, { a: rvs(0) }, m)) + (level >= 4 ? G("reset_untracked_suffix", "; untracked notes.txt kept") : ""); });
      if (level >= 4) alts.push(resetText(after) + G("reset_untracked_removed", "; untracked notes.txt removed"));
      return exercise(G("reset_title", "Predict git reset --{m} B.", { m: mode }), [G("reset_row", "current C tree a={c}; target B tree a={t}", { c: rvs(1), t: rvs(0) }), G("reset_layers_row", "index a={i}; worktree a={w}", { i: state0.index.a, w: state0.work.a })].concat(level >= 4 ? [G("reset_untracked_row", "untracked notes.txt exists")] : []), answer,
        uniqueOptions(answer, alts.concat([G("reset_no_move", "branch stays at C; index and worktree become B")])),
        G("reset_expl", "All modes move the branch; --mixed also resets the index; --hard also resets tracked worktree files. Untracked files are never touched."), { result: after }, "git reset --" + mode, [G("tr_move_branch", "move the branch to B")]);
    }

    case "revert_commit_effect": {
      if (level === 1) {
        answer = G("rv_tip", "new D → C that removes {p}; C stays in history", { p: P });
        return exercise(G("rv_title", "C added {p}=blue and is the tip. What does git revert C do?", { p: P }), parentRows(linearDag(3).dag), answer,
          [G("rv_move", "move the branch back to B without a commit"), G("rv_delete", "delete commit C"), G("rv_rewrite", "rewrite C in place")],
          G("rv_expl", "Revert creates a new commit applying the inverse of the target's patch; history is preserved."), {}, "git revert", [G("tr_invert_patch", "invert the patch"), G("tr_new_commit", "commit the result")]);
      }
      if (level === 2) {
        answer = G("rv_later", "new F → E that removes {p} and keeps E's change to {q}", { p: P, q: Q });
        return exercise(G("rv_later_title", "C added {p}; later E changed {q}. What does git revert C do?", { p: P, q: Q }), parentRows({ A: [], B: ["A"], C: ["B"], E: ["C"] }), answer,
          [G("rv_reset_like", "the branch returns to B, dropping C and E"), G("rv_drop_e", "new F removes {p} and also undoes E", { p: P }), G("rv_conflict", "conflict")],
          G("rv_later_expl", "Only C's patch is inverted; unrelated later changes stay."), {}, "git revert", [G("tr_invert_patch", "invert the patch"), G("tr_new_commit", "commit the result")]);
      }
      answer = G("rv_conflict_stop", "a conflict in {p}: C's inverse no longer applies cleanly", { p: P });
      return exercise(G("rv_overlap_title", "C changed {p} from v1 to v2; later E changed {p} from v2 to v3. What happens on git revert C?", { p: P }), parentRows({ A: [], B: ["A"], C: ["B"], E: ["C"] }), answer,
        [G("rv_clean_v1", "a clean revert setting {p}=v1", { p: P }), G("rv_clean_v2", "a clean revert setting {p}=v2", { p: P }), G("rv_skip", "nothing happens because E is newer")],
        G("rv_overlap_expl", "The inverse patch expects v2 but finds v3, so the revert stops with a conflict."), {}, "git revert", [G("tr_invert_patch", "invert the patch"), G("tr_detect_conflict", "detect the overlap")]);
    }

    case "cherry_pick_effect": {
      if (level === 1) {
        answer = G("cp_new", "new D' → C containing C's tree plus {q}", { q: Q });
        return exercise(G("cp_title", "D adds {q}. What does git cherry-pick D create on {b} at C?", { q: Q, b: cur }), parentRows({ A: [], B: ["A"], C: ["B"], D: ["B"] }), answer,
          [G("cp_move", "{b} moves to D", { b: cur }), G("cp_merge", "a merge commit with parents C and D"), G("cp_reparent", "D's parent changes to C")],
          G("cp_expl", "Cherry-pick applies D's patch onto the current commit as a new one-parent commit."), {}, "git cherry-pick", [G("tr_apply_patch", "apply D's patch to C")]);
      }
      if (level === 2) {
        answer = G("cp_ids", "No — D' has the same patch but a different parent, so a new ID");
        return exercise(G("cp_same_title", "After git cherry-pick D onto C, is D' the same commit as D?"), parentRows({ A: [], B: ["A"], C: ["B"], D: ["B"] }), answer,
          [G("cp_same", "Yes — the patch is identical"), G("cp_moved", "Yes — D was moved onto C"), G("cp_gone", "D no longer exists")],
          G("cp_id_expl", "Commit identity includes the parent; D stays where it was."), {}, "identity", [G("tr_compare_fields", "compare tree, parents, metadata, message")]);
      }
      answer = G("cp_conflict", "a conflict in {p}; the cherry-pick stops for resolution", { p: P });
      return exercise(G("cp_conf_title", "D changes {p} from v1 to v2, but C already has {p}=v5. What happens on git cherry-pick D?", { p: P }), parentRows({ A: [], B: ["A"], C: ["B"], D: ["B"] }), answer,
        [G("cp_take", "a clean D' with {p}=v2", { p: P }), G("cp_keep", "a clean D' with {p}=v5", { p: P }), G("cp_skip", "D is skipped silently")],
        G("cp_conf_expl", "The patch expects v1 but finds v5, so it cannot apply cleanly."), {}, "git cherry-pick", [G("tr_apply_patch", "apply D's patch to C"), G("tr_detect_conflict", "detect the overlap")]);
    }

    case "linear_rebase_graph": {
      var localCount = level === 1 ? 1 : level === 2 ? 3 : 2, localIds = letters(3, localCount), primes = localIds.map(function (c) { return c + "'"; });
      rows = [G("lr_row_local", "local {b}: B ← {c}", { b: top, c: listText(localIds) }), G("lr_row_up", "upstream: B ← C")];
      if (level >= 3) {
        var keptByTag = r.bool();
        if (keptByTag) rows.push(G("row_tag", "tag {r} → {c}", { r: "safe", c: localIds[localIds.length - 1] }));
        answer = keptByTag ? G("lr_kept_tag", "yes — tag safe still reaches the old commits") : G("lr_reflog", "only through the reflog; no ref reaches them");
        return exercise(G("lr_old_title", "After git rebase C on {b}, are the original {c} still reachable?", { b: top, c: listText(localIds) }), rows, answer,
          [keptByTag ? G("lr_reflog", "only through the reflog; no ref reaches them") : G("lr_kept_tag", "yes — tag safe still reaches the old commits"), G("lr_deleted", "no — rebase deletes them"), G("lr_same", "they are the same commits as the replayed ones")],
          G("lr_old_expl", "Rebase writes new commits and moves the branch; the originals remain reachable from any other ref and from the reflog."), {}, "git rebase", [G("tr_replay", "replay oldest first")]);
      }
      answer = G("lr_graph", "C ← {p}; {b} → {last}", { p: listText(primes), b: top, last: primes[primes.length - 1] });
      return exercise(G("lr_title", "What does git rebase C produce on {b}?", { b: top }), rows, answer,
        [G("lr_graph", "C ← {p}; {b} → {last}", { p: listText(localIds), b: top, last: localIds[localIds.length - 1] }), G("lr_merge", "a merge commit joining {c} and C", { c: localIds[localIds.length - 1] }), G("lr_graph", "C ← {p}; {b} → {last}", { p: listText(primes.slice().reverse()), b: top, last: primes[0] })],
        G("lr_expl", "Rebase replays the local commits oldest first onto C, creating new IDs."), {}, "git rebase", [G("tr_replay", "replay oldest first")]);
    }

    case "rebase_patch_result": {
      var v0 = r.int(1, 4), vA = String(v0), vB = String(v0 + 1), vC = String(v0 + 2), vX = String(v0 + 5);
      var tr = function (pv, qv) { var t2 = {}; t2[P] = pv; t2[Q] = qv; return treeText(t2); };
      var baseRow = G("row_base", "base: {t}", { t: tr(vA, vA) });
      if (level === 1) {
        answer = tr(vB, vB);
        return exercise(G("rp_title", "Local C changes {p} {a}→{b}; upstream changed {q} {a}→{b}. What tree does the replayed C' have?", { p: P, q: Q, a: vA, b: vB }), [baseRow], answer,
          uniqueOptions(answer, [tr(vB, vA), tr(vA, vB), G("tw_conflict", "conflict"), tr(vA, vA)]),
          G("rp_expl", "Each replayed patch applies on top of the previous result; changes to different paths combine."), {}, "rebase", [G("tr_apply_patch_seq", "apply patches in order")]);
      }
      if (level === 2) {
        answer = tr(vC, vB);
        return exercise(G("rp_dep_title", "Local C changes {p} {a}→{b}, then local E changes {p} {b}→{c}; upstream changed {q} {a}→{b}. What tree does E' have?", { p: P, q: Q, a: vA, b: vB, c: vC }), [baseRow], answer,
          uniqueOptions(answer, [tr(vB, vB), tr(vC, vA), G("tw_conflict", "conflict"), tr(vB, vC)]),
          G("rp_expl", "Each replayed patch applies on top of the previous result; changes to different paths combine."), {}, "rebase", [G("tr_apply_patch_seq", "apply patches in order")]);
      }
      answer = G("rp_conflict", "replaying C stops with a conflict on {p}", { p: P });
      return exercise(G("rp_over_title", "Local C changes {p} {a}→{b}, but upstream changed {p} {a}→{x}. What happens when C is replayed?", { p: P, a: vA, b: vB, x: vX }), [baseRow], answer,
        [tr(vB, vA), tr(vX, vA), G("rp_skip", "C is dropped as already applied")],
        G("rp_over_expl", "The patch expects {p}={a} but the target has {p}={x}, so the replay stops for manual resolution.", { p: P, a: vA, x: vX }), {}, "rebase", [G("tr_detect_conflict", "detect the overlap")]);
    }

    case "amend_effect": {
      if (level <= 2) {
        answer = level === 1 ? G("am_msg", "new C' with the same tree and parent; {b} → C'; tag v0 still → C", { b: cur }) : G("am_tree", "new C' with the staged tree and the same parent; {b} → C'; tag v0 still → C", { b: cur });
        return exercise(level === 1 ? G("am_msg_title", "You amend only the message of C (HEAD → {b} → C, tag v0 → C). What results?", { b: cur }) : G("am_tree_title", "You stage a fix and amend C (HEAD → {b} → C, tag v0 → C). What results?", { b: cur }), [G("row_ref", "{r} → {c}", { r: cur, c: "C" }), G("row_tag", "tag {r} → {c}", { r: "v0", c: "C" })], answer,
          uniqueOptions(answer, [G("am_mutate", "C is changed in place; both names still point to it"), G("am_both", "{b} and tag v0 both move to C'", { b: cur }), G("am_msg", "new C' with the same tree and parent; {b} → C'; tag v0 still → C", { b: cur }), G("am_tree", "new C' with the staged tree and the same parent; {b} → C'; tag v0 still → C", { b: cur })]),
          G("am_expl", "Amend writes a replacement commit with C's parents and moves only the current branch; other refs keep the old commit."), {}, "git commit --amend", [G("tr_replace_commit", "write C' with C's parents"), G("tr_move_branch_only", "move only the current branch")]);
      }
      var published = level >= 4 && r.bool();
      answer = published ? G("am_published", "collaborators who have M now hold a history that diverges from M'") : G("am_merge", "M' keeps both parents (C, D)");
      return exercise(published ? G("am_pub_title", "Merge M was already pushed and fetched by others. You amend it to M' and force-push. What follows?") : G("am_merge_title", "You amend merge commit M (parents C, D). What parents does M' have?"), [G("row_parents", "{c} parents: {p}", { c: "M", p: "C, D" })], answer,
        published ? [G("am_auto", "their clones update to M' automatically"), G("am_ff", "their branches fast-forward to M'"), G("am_merge", "M' keeps both parents (C, D)")] : [G("am_one_parent", "M' has only C"), G("am_reorder", "M' has parents (D, C)"), G("am_published", "collaborators who have M now hold a history that diverges from M'")],
        published ? G("am_pub_expl", "Amending creates a different commit; others still have M, so their history diverges from yours.") : G("am_merge_expl", "Amend preserves the original parents in order, including both parents of a merge."), {}, "git commit --amend", [G("tr_replace_commit", "write C' with C's parents")]);
    }

    case "reflog_recover_ref": {
      if (level <= 2) {
        var lostDetached = level === 1;
        rows = lostDetached ? [G("rr_row_detached", "HEAD@{1}: commit D (made while detached)"), G("rr_row_switch", "HEAD@{0}: switch to {b}", { b: cur })] : [G("rr_row_reset", "{b}@{0}: reset to A", { b: cur }), G("rr_row_old", "{b}@{1}: commit C", { b: cur })];
        answer = lostDetached ? G("rr_branch_d", "git branch rescue D") : G("rr_branch_c", "git branch rescue C");
        return exercise(G("rr_title", "Which command preserves the lost commit without changing {b}?", { b: cur }), rows, answer,
          uniqueOptions(answer, [G("rr_reset", "git reset --hard {c}", { c: lostDetached ? "D" : "C" }), G("rr_revert", "git revert HEAD"), G("rr_delete", "git reflog expire --all"), lostDetached ? G("rr_branch_c", "git branch rescue C") : G("rr_branch_d", "git branch rescue D")]),
          G("rr_expl", "The reflog records earlier ref positions; creating a branch at the entry preserves the commit without moving anything else."), {}, "recovery", [G("tr_read_reflog", "read the reflog"), G("tr_create_rescue", "create a rescue branch")]);
      }
      var entries = ["D", "E", "F"], wanted = r.pick(entries), trees3 = { D: "v2", E: "v3", F: "v4" };
      answer = G("rr_branch_x", "git branch rescue {c}", { c: wanted });
      return exercise(G("rr_tree_title", "Which reflog entry holds the version where {p}={v}? Preserve it.", { p: P, v: trees3[wanted] }), entries.map(function (c, k) { return G("rr_row_entry", "{h}: commit {c} ({p}={v})", { h: "HEAD@{" + (k + 1) + "}", c: c, p: P, v: trees3[c] }); }), answer,
        entries.filter(function (c) { return c !== wanted; }).map(function (c) { return G("rr_branch_x", "git branch rescue {c}", { c: c }); }).concat([G("rr_reset", "git reset --hard {c}", { c: wanted })]),
        G("rr_tree_expl", "Pick the entry by its recorded tree, then preserve it with a new branch."), {}, "recovery", [G("tr_read_reflog", "read the reflog"), G("tr_create_rescue", "create a rescue branch")]);
    }

    case "stash_push_effect": {
      var flag = level <= 2 ? "" : r.pick(["", " -u", " -a"]);
      rows = [G("row_tracked_mod", "tracked, modified: {p}", { p: P })].concat(level >= 2 ? [G("sp_staged_row", "staged change to {q}", { q: Q })] : []).concat(level >= 3 ? [G("row_untracked", "untracked new file {p}=v1", { p: "notes.txt" }), G("row_ignored", "untracked, ignored by *.log: {p}", { p: "trace.log" })] : []);
      var saved = [P].concat(level >= 2 ? [Q] : []).concat(flag ? ["notes.txt"] : []).concat(flag === " -a" ? ["trace.log"] : []);
      var spText = function (list) { return G("sp_saved", "saves {s}; everything else stays as it is", { s: listText(list) }); };
      answer = spText(saved);
      var spSets = [[P], [P].concat(level >= 2 ? [Q] : []), [P].concat(level >= 2 ? [Q] : [], level >= 3 ? ["notes.txt"] : []), [P].concat(level >= 2 ? [Q] : [], level >= 3 ? ["notes.txt", "trace.log"] : [])].map(spText);
      return exercise(G("sp_title", "What does git stash push{f} save?", { f: flag }), rows, answer,
        uniqueOptions(answer, spSets.concat([G("sp_commit", "creates a commit on {b}", { b: cur }), G("sp_nothing", "saves nothing; a plain stash needs staged changes")])),
        G("sp_expl", "A plain stash saves tracked staged and unstaged changes; -u adds untracked files; -a also adds ignored files."), {}, "git stash push", [G("tr_capture", "capture the selected changes")]);
    }

    case "stash_apply_pop_effect": {
      var op = level === 1 ? "apply" : level === 2 ? "pop" : r.pick(["pop", "apply"]), conflict = level >= 3;
      answer = conflict ? G("sap_conflict", "a conflict in {p}; stash S remains in the list", { p: P }) : op === "apply" ? G("sap_apply", "changes are reapplied; S remains in the list") : G("sap_pop", "changes are reapplied; S is removed from the list");
      return exercise(G("sap_title", "What does git stash {o} S do?", { o: op }), conflict ? [G("sap_conf_row", "current {p}=blue; S changes {p} red→green", { p: P })] : [G("sap_clean_row", "worktree is clean; S modifies {p}", { p: P })], answer,
        uniqueOptions(answer, [G("sap_apply", "changes are reapplied; S remains in the list"), G("sap_pop", "changes are reapplied; S is removed from the list"), G("sap_lost", "S is dropped before applying and its changes are lost"), G("sap_branch", "S becomes a branch")]),
        G("sap_expl", "apply keeps the stash; pop drops it only after a clean apply, so a conflicting pop keeps it."), {}, "git stash " + op, [G("tr_apply_stash", "apply the stash")]);
    }

    case "undo_operation_select": {
      var goals = level === 1 ? [["discard", "git restore " + P], ["unstage", "git restore --staged " + P]]
        : level === 2 ? [["message", "git commit --amend"], ["uncommit", "git reset --soft HEAD~1"]]
        : [["published", "git revert C"], ["lost", "git branch rescue C"], ["message", "git commit --amend"]];
      var goalPick = r.pick(goals);
      var goalText = { discard: G("ug_discard", "throw away the unstaged edit to {p}", { p: P }), unstage: G("ug_unstage", "unstage {p} but keep the edit", { p: P }), message: G("ug_message", "fix the message of the unpublished last commit"), uncommit: G("ug_uncommit", "undo the unpublished last commit but keep its changes staged"), published: G("ug_published", "undo the already-shared commit C while keeping history"), lost: G("ug_lost", "recover commit C, which the reflog still shows after a reset") }[goalPick[0]];
      answer = goalPick[1];
      return exercise(G("ug_title", "Goal: {g}. Which operation fits?", { g: goalText }), [], answer,
        uniqueOptions(answer, ["git restore " + P, "git restore --staged " + P, "git commit --amend", "git reset --soft HEAD~1", "git revert C", "git reset --hard HEAD~1", "git branch rescue C"].filter(function (c) { return c !== answer; }).sort(function () { return r.bool() ? 1 : -1; })),
        G("ug_expl", "Match the layer and publication state: restore for files, amend/reset for unpublished commits, revert for shared history, a new branch to rescue reflog entries."), {}, "operation selection", [G("tr_match_goal", "match the goal")]);
    }

    case "remote_tracking_staleness": {
      var local = "C", tracking = level === 1 ? "C" : "B", server = level === 1 ? "C" : level === 2 ? "C" : "D";
      if (level === 2) local = "B";
      answer = G("rts_answer", "local {b}={l}; origin/{b}={t}; server {b}={s}", { b: cur, l: local, t: tracking, s: server });
      return exercise(G("rts_title", "Before any fetch, where do the three names resolve?"), [G("rts_row_local", "you last committed {c} on {b}", { c: local, b: cur }), G("rts_row_fetch", "your last fetch saw the server at {c}", { c: tracking }), G("rts_row_server", "the server's {b} now points to {c}", { b: cur, c: server })], answer,
        uniqueOptions(answer, [[server, server, server], [local, server, server], [tracking, tracking, tracking], ["B", "B", "C"], ["C", "B", "C"], ["C", "C", "D"], ["B", "C", "D"]].map(function (v) { return G("rts_answer", "local {b}={l}; origin/{b}={t}; server {b}={s}", { b: cur, l: v[0], t: v[1], s: v[2] }); })),
        G("rts_expl", "origin/{b} is a local cache updated only by fetch; it can lag behind the server.", { b: cur }), {}, "resolve refs", [G("tr_read_cache", "read the cached ref")]);
    }

    case "fetch_effect": {
      var fkind = level === 1 ? "advance" : level === 2 ? "new" : r.pick(["deletedPrune", "deletedNoPrune", "rewound"]);
      var fcmd = fkind === "deletedPrune" ? "git fetch --prune origin" : "git fetch origin";
      rows = fkind === "advance" ? [G("row_ref", "{r} → {c}", { r: cur, c: "C" }), G("row_ref", "{r} → {c}", { r: "origin/" + cur, c: "C" }), G("fe_server_row", "server {b} → {c}", { b: cur, c: "D" })]
        : fkind === "new" ? [G("row_ref", "{r} → {c}", { r: "origin/" + cur, c: "C" }), G("fe_server_row", "server {b} → {c}", { b: top, c: "E" })]
        : fkind === "rewound" ? [G("row_ref", "{r} → {c}", { r: "origin/" + top, c: "E" }), G("fe_server_row", "server {b} → {c}", { b: top, c: "C" }), G("fe_rewound_row", "the server's {b} was force-moved back", { b: top })]
        : [G("row_ref", "{r} → {c}", { r: "origin/" + top, c: "E" }), G("fe_deleted_row", "the server deleted branch {b}", { b: top })];
      answer = fkind === "advance" ? G("fe_advance", "origin/{b} → D; local {b}, index, and worktree unchanged", { b: cur })
        : fkind === "new" ? G("fe_new", "origin/{t} → E is created; no local {t} branch is created", { t: top })
        : fkind === "rewound" ? G("fe_rewound", "origin/{t} moves back to C", { t: top })
        : fkind === "deletedPrune" ? G("fe_pruned", "origin/{t} is removed", { t: top }) : G("fe_stale", "origin/{t} stays at E as a stale ref", { t: top });
      return exercise(G("fe_title", "Predict {cmd}.", { cmd: fcmd }), rows, answer,
        uniqueOptions(answer, [G("fe_advance", "origin/{b} → D; local {b}, index, and worktree unchanged", { b: cur }), G("fe_local_moves", "local {b} also moves", { b: fkind === "advance" ? cur : top }), G("fe_new", "origin/{t} → E is created; no local {t} branch is created", { t: top }), G("fe_pruned", "origin/{t} is removed", { t: top }), G("fe_stale", "origin/{t} stays at E as a stale ref", { t: top })]),
        G("fe_expl", "Fetch updates only remote-tracking refs: it creates and moves them, may move them backwards, and removes deleted ones only with --prune."), {}, fcmd, [G("tr_update_tracking", "update remote-tracking refs")]);
    }

    case "ahead_behind_count": {
      var dagAB, localTip, upTip;
      if (level === 1) { g = forkDag(2, 0, r.int(1, 3)); dagAB = g.dag; if (r.bool()) { localTip = g.rightTip; upTip = g.fork; } else { localTip = g.fork; upTip = g.rightTip; } }
      else if (level === 2) { g = forkDag(2, r.int(1, 2), r.int(1, 3)); dagAB = g.dag; localTip = g.leftTip; upTip = g.rightTip; }
      else { var mm = mergedDag(r, level); dagAB = mm.dag; localTip = mm.tip; upTip = mm.second; if (r.bool()) { var extra = String.fromCharCode(65 + Object.keys(dagAB).length); dagAB[extra] = [mm.second]; upTip = extra; } }
      counts = aheadBehind(dagAB, localTip, upTip);
      var abText = function (c) { return G("ab_text", "ahead {a}, behind {b}", { a: c.ahead, b: c.behind }); };
      answer = abText(counts);
      return exercise(G("ab_title", "How far is local {l} ahead of and behind upstream {u}?", { l: localTip, u: upTip }), parentRows(dagAB), answer,
        uniqueOptions(answer, [abText({ ahead: counts.behind, behind: counts.ahead }), abText({ ahead: counts.ahead + 1, behind: counts.behind }), abText({ ahead: counts.ahead, behind: counts.behind + 1 }), abText({ ahead: 0, behind: 0 })]),
        G("ab_expl", "Ahead counts commits reachable only from local; behind counts commits reachable only from upstream."), { dag: dagAB }, "ahead/behind", [G("tr_local_only", "local-only commits"), G("tr_up_only", "upstream-only commits")]);
    }

    case "upstream_ref_reasoning": {
      var ukind = level === 1 ? "match" : level === 2 ? "renamed" : r.pick(["none", "renamed"]);
      rows = ukind === "match" ? [G("up_row_map", "upstream of {b}: origin/{b}", { b: cur })] : ukind === "renamed" ? [G("up_row_map2", "upstream of {b}: central/stable", { b: cur }), G("up_row_exists", "origin/{b} also exists", { b: cur })] : [G("up_row_none", "{b} has no upstream configured", { b: top }), G("up_row_exists", "origin/{b} also exists", { b: top })];
      answer = ukind === "match" ? "origin/" + cur : ukind === "renamed" ? "central/stable" : G("up_error", "none — the command fails until a remote and branch are named");
      return exercise(G("up_title", "Which ref does an argument-free git pull on {b} integrate?", { b: ukind === "none" ? top : cur }), rows, answer,
        uniqueOptions(answer, ["origin/" + (ukind === "none" ? top : cur), "central/stable", "origin/main", G("up_error", "none — the command fails until a remote and branch are named"), G("up_newest", "the most recently updated remote ref")]),
        G("up_expl", "Pull uses the configured upstream exactly; without one there is no default target."), {}, "git pull", [G("tr_lookup_upstream", "look up the configured upstream")]);
    }

    case "push_fast_forward_decision": {
      var pkind = level === 1 ? "ff" : level === 2 ? "diverged" : r.pick(["new", "ff", "diverged"]);
      dag = pkind === "diverged" ? { A: [], B: ["A"], C: ["B"], D: ["B"] } : { A: [], B: ["A"], C: ["B"], D: ["C"] };
      var remoteTip = pkind === "new" ? null : pkind === "diverged" ? "D" : "B", localPush = pkind === "diverged" ? "C" : "D";
      var accepted = pushDecision(dag, remoteTip, localPush);
      answer = pkind === "new" ? G("push_create", "accepted; the server creates {b} at {c}", { b: top, c: localPush }) : accepted ? G("push_ok", "accepted; the server's {b} moves {o}→{n}", { b: cur, o: remoteTip, n: localPush }) : G("push_rejected", "rejected as non-fast-forward; the server keeps {o}", { o: remoteTip });
      return exercise(G("push_title", "Will a normal push of local {c} to {b} be accepted?", { c: localPush, b: pkind === "new" ? top : cur }), parentRows(dag).concat([pkind === "new" ? G("push_row_none", "the server has no branch {b}", { b: top }) : G("fe_server_row", "server {b} → {c}", { b: cur, c: remoteTip })]), answer,
        uniqueOptions(answer, [G("push_ok", "accepted; the server's {b} moves {o}→{n}", { b: cur, o: remoteTip || "B", n: localPush }), G("push_rejected", "rejected as non-fast-forward; the server keeps {o}", { o: remoteTip || "B" }), G("push_merge", "accepted; the server creates a merge commit"), G("push_create", "accepted; the server creates {b} at {c}", { b: top, c: localPush })]),
        G("push_expl", "A normal push succeeds only when the server's current tip is an ancestor of what you push, or the branch is new."), { dag: dag }, "git push", [G("tr_ancestry", "check ancestry")]);
    }

    case "force_with_lease_decision": {
      if (level <= 2) {
        var matchLease = level === 1, lc = pickDistinct(r, ["C", "D", "E", "F", "G"], 3), lExp = lc[0], lOther = lc[1], lNew = lc[2];
        answer = matchLease ? G("lease_ok", "accepted; the server moves to {c}", { c: lNew }) : G("lease_rejected", "rejected; the server stays at {c}", { c: lOther });
        return exercise(G("lease_title", "Will git push --force-with-lease update the server branch?"), [G("lease_row_expect", "lease expects {c}", { c: lExp }), G("lease_row_actual", "server branch is at {c}", { c: matchLease ? lExp : lOther }), G("lease_row_new", "you push rewritten {c}", { c: lNew })], answer,
          [matchLease ? G("lease_rejected", "rejected; the server stays at {c}", { c: lExp }) : G("lease_ok", "accepted; the server moves to {c}", { c: lNew }), G("lease_any", "accepted, because any lease permits force"), G("lease_to_d", "rejected, and the server moves to {c}", { c: lExp })],
          G("lease_expl", "The lease is a compare-and-swap: the update happens only if the server tip equals the expected one."), {}, "push --force-with-lease", [G("tr_compare_lease", "compare actual with expected")]);
      }
      var refsLease = [["main", "D", r.bool() ? "D" : "E"], ["fix", "F", r.bool() ? "F" : "G"], ["docs", "H", "H"]].slice(0, level >= 5 ? 3 : 2);
      var updated = refsLease.filter(function (x2) { return leaseDecision(x2[1], x2[2]); }).map(function (x2) { return x2[0]; });
      answer = updated.length ? G("lease_multi", "updated: {s}", { s: listText(updated) }) : G("lease_none", "none are updated");
      return exercise(G("lease_multi_title", "Each destination has its own lease. Which branches does the push update?"), refsLease.map(function (x2) { return G("lease_row_multi", "{b}: lease expects {e}; server at {a}", { b: x2[0], e: x2[1], a: x2[2] }); }), answer,
        uniqueOptions(answer, [G("lease_multi", "updated: {s}", { s: listText(refsLease.map(function (x2) { return x2[0]; })) }), G("lease_none", "none are updated"), G("lease_multi", "updated: {s}", { s: refsLease[0][0] }), G("lease_multi", "updated: {s}", { s: refsLease[1][0] })]),
        G("lease_multi_expl", "Each ref is checked against its own lease; matching ones update and mismatching ones are rejected."), {}, "push --force-with-lease", [G("tr_compare_lease", "compare actual with expected")]);
    }

    case "pull_ff_only_effect": {
      var pf = level === 1 ? "behind" : level === 2 ? r.pick(["ahead", "uptodate"]) : "diverged";
      rows = pf === "behind" ? [G("row_ref", "{r} → {c}", { r: cur, c: "B" }), G("fe_server_row", "server {b} → {c}", { b: cur, c: "D" }), G("mc_desc_row", "D descends from B")]
        : pf === "ahead" ? [G("row_ref", "{r} → {c}", { r: cur, c: "D" }), G("fe_server_row", "server {b} → {c}", { b: cur, c: "B" }), G("mc_desc_row", "D descends from B")]
        : pf === "uptodate" ? [G("row_ref", "{r} → {c}", { r: cur, c: "D" }), G("fe_server_row", "server {b} → {c}", { b: cur, c: "D" })]
        : [G("row_ref", "{r} → {c}", { r: cur, c: "C" }), G("fe_server_row", "server {b} → {c}", { b: cur, c: "D" }), G("mc_sib_row", "C and D both descend from B")];
      answer = pf === "behind" ? G("pf_ff", "{b} fast-forwards to D", { b: cur }) : pf === "diverged" ? G("pf_refuse", "origin/{b} moves to D, but integration is refused; {b} stays at C", { b: cur }) : G("pf_nothing", "nothing to integrate; {b} is unchanged", { b: cur });
      return exercise(G("pf_title", "Predict git pull --ff-only."), rows, answer,
        uniqueOptions(answer, [G("pf_ff", "{b} fast-forwards to D", { b: cur }), G("pf_refuse", "origin/{b} moves to D, but integration is refused; {b} stays at C", { b: cur }), G("pf_merge", "a merge commit is created"), G("pf_nothing", "nothing to integrate; {b} is unchanged", { b: cur }), G("pf_back", "{b} moves back to B", { b: cur })]),
        G("pf_expl", "Pull fetches first; --ff-only then integrates only when the local branch is an ancestor of the fetched tip."), {}, "git pull --ff-only", [G("tr_fetch_then", "fetch, then check ancestry")]);
    }

    case "pull_merge_effect": {
      var pm = level === 1 ? "ff" : level === 2 ? "clean" : "conflict";
      rows = pm === "ff" ? [G("row_ref", "{r} → {c}", { r: cur, c: "B" }), G("fe_server_row", "server {b} → {c}", { b: cur, c: "D" }), G("mc_desc_row", "D descends from B")]
        : [G("row_ref", "{r} → {c}", { r: cur, c: "C" }), G("fe_server_row", "server {b} → {c}", { b: cur, c: "D" }), G("mc_sib_row", "C and D both descend from B")].concat(pm === "conflict" ? [G("pm_conf_row", "C and D change {p} differently", { p: P })] : []);
      answer = pm === "ff" ? G("pm_ff", "{b} fast-forwards to D; no merge commit", { b: cur }) : pm === "clean" ? G("pm_merge", "new E with parents (C, D); {b} → E", { b: cur }) : G("pm_conflict", "a merge stops with a conflict in {p}; the merge is in progress", { p: P });
      return exercise(G("pm_title", "Predict git pull --no-rebase."), rows, answer,
        uniqueOptions(answer, [G("pm_ff", "{b} fast-forwards to D; no merge commit", { b: cur }), G("pm_merge", "new E with parents (C, D); {b} → E", { b: cur }), G("pm_merge_rev", "new E with parents (D, C); {b} → E", { b: cur }), G("pm_conflict", "a merge stops with a conflict in {p}; the merge is in progress", { p: P }), G("pm_rebase", "C is replayed as C' on D")]),
        G("pm_expl", "Pull fetches D, then merges it like git merge origin/{b}: fast-forward when possible, otherwise a merge whose first parent is the local tip.", { b: cur }), {}, "git pull --no-rebase", [G("tr_fetch_then", "fetch, then check ancestry")]);
    }

    case "pull_rebase_effect": {
      var prCount = level === 1 ? 1 : level === 2 ? 2 : 1, prIds = ["C", "E"].slice(0, prCount), prPrimes = prIds.map(function (c) { return c + "'"; });
      rows = [G("pr_row_local", "local {b}: B ← {c}", { b: cur, c: listText(prIds) }), G("fe_server_row", "server {b} → {c}", { b: cur, c: "D" }), G("mc_desc_row", "D descends from B")].concat(level >= 3 ? [G("pr_conf_row", "C and D change {p} differently", { p: P })] : []);
      answer = level >= 3 ? G("pr_conflict", "the rebase stops at C with a conflict in {p}", { p: P }) : G("pr_ok", "origin/{b} → D; {p} replayed on D; {b} → {last}", { b: cur, p: listText(prPrimes), last: prPrimes[prPrimes.length - 1] });
      return exercise(G("pr_title", "Predict git pull --rebase."), rows, answer,
        uniqueOptions(answer, [G("pr_ok", "origin/{b} → D; {p} replayed on D; {b} → {last}", { b: cur, p: listText(prPrimes), last: prPrimes[prPrimes.length - 1] }), G("pm_merge", "new E with parents (C, D); {b} → E", { b: cur }), G("pr_conflict", "the rebase stops at C with a conflict in {p}", { p: P }), G("pr_server", "the server moves to {c}", { c: prPrimes[prPrimes.length - 1] })]),
        G("pr_expl", "Pull fetches D, then replays the local-only commits onto it as new commits, stopping at the first conflict."), {}, "git pull --rebase", [G("tr_replay", "replay oldest first")]);
    }

    case "clone_initial_state": {
      var cloneTip = r.pick(["C", "D", "E", "F"]), defaultBranch = level >= 3 ? r.pick(["trunk", "develop", "stable"]) : "main", remoteBranches = level === 1 ? [defaultBranch] : [defaultBranch, top].concat(level >= 4 ? ["docs"] : []);
      answer = G("clone_answer", "local {d} → {c}; {tr}; HEAD → {d}", { c: cloneTip, d: defaultBranch, tr: remoteBranches.map(function (b) { return "origin/" + b; }).join(", ") });
      return exercise(G("clone_title", "What does the clone create locally?"), [G("clone_row_default", "remote default branch: {d} → {c}", { c: cloneTip, d: defaultBranch })].concat(remoteBranches.slice(1).map(function (b) { return G("clone_row_branch", "remote also has {b}", { b: b }); })), answer,
        uniqueOptions(answer, [G("clone_all_local", "a local branch for every remote branch; HEAD → {d}", { d: defaultBranch }), G("clone_main", "local main → {c}; HEAD → main", { c: cloneTip }), G("clone_detached", "HEAD detached at {c}; no local branch", { c: cloneTip }), G("clone_answer", "local {d} → {c}; {tr}; HEAD → {d}", { c: cloneTip, d: defaultBranch, tr: "origin/" + defaultBranch })]),
        G("clone_expl", "Clone creates remote-tracking refs for every remote branch but only one local branch: the remote's default."), {}, "clone", [G("tr_tracking_all", "tracking refs for every branch"), G("tr_local_default", "one local branch for the default")]);
    }

    case "change_unit_partition": {
      var u = { login: G("unit_login", "fix login bug"), readme: G("unit_readme", "update README"), parser: G("unit_parser", "fix parser"), ptest: G("unit_ptest", "parser regression test"), helper: G("unit_helper", "extract helper (refactor)"), exp: G("unit_export", "new export feature"), etest: G("unit_etest", "export tests") };
      var grp = function (items) { return "[" + items.join(" + ") + "]"; };
      if (level === 1) {
        answer = G("cup_sep", "two commits: {a} and {b}", { a: grp([u.login]), b: grp([u.readme]) });
        rows = [G("cup_row_units", "changes: {u}", { u: u.login + "; " + u.readme }), G("cup_row_rule", "each commit is one coherent change")];
        return exercise(G("cup_title", "Choose the coherent set of commits."), rows, answer, [G("cup_one", "one commit: {a}", { a: grp([u.login, u.readme]) }), G("cup_per_file", "one commit per changed file, whatever it contains"), G("cup_split", "split {a} across two commits, then {b}", { a: u.login, b: u.readme })],
          G("cup_expl", "Group what must change together (a fix with its test, a feature with its tests), keep unrelated work apart, and order prerequisites first."), {}, "partition", [G("tr_group", "group coupled changes")]);
      }
      if (level === 2) {
        answer = G("cup_sep", "two commits: {a} and {b}", { a: grp([u.parser, u.ptest]), b: grp([u.readme]) });
        rows = [G("cup_row_units", "changes: {u}", { u: [u.parser, u.ptest, u.readme].join("; ") }), G("cup_row_rule", "each commit is one coherent change")];
        return exercise(G("cup_title", "Choose the coherent set of commits."), rows, answer, [G("cup_one", "one commit: {a}", { a: grp([u.parser, u.ptest, u.readme]) }), G("cup_sep", "two commits: {a} and {b}", { a: grp([u.parser]), b: grp([u.ptest, u.readme]) }), G("cup_three", "three commits: {a}, {b}, and {c}", { a: grp([u.parser]), b: grp([u.ptest]), c: grp([u.readme]) })],
          G("cup_expl", "Group what must change together (a fix with its test, a feature with its tests), keep unrelated work apart, and order prerequisites first."), {}, "partition", [G("tr_group", "group coupled changes")]);
      }
      var withReadme = level >= 4;
      var ordered = function (parts) { return parts.map(function (p2, k) { return (k + 1) + ". " + grp(p2); }).join("  "); };
      answer = ordered([[u.helper], [u.exp, u.etest]].concat(withReadme ? [[u.readme]] : []));
      rows = [G("cup_row_units", "changes: {u}", { u: [u.helper, u.exp, u.etest].concat(withReadme ? [u.readme] : []).join("; ") }), G("cup_row_rule3", "each commit must build; refactors land before features that need them")];
      return exercise(G("cup_title_ordered", "Choose the coherent ordered commits."), rows, answer,
        [ordered([[u.exp, u.etest], [u.helper]].concat(withReadme ? [[u.readme]] : [])), ordered([[u.helper, u.exp], [u.etest]].concat(withReadme ? [[u.readme]] : [])), ordered([[u.helper, u.exp, u.etest].concat(withReadme ? [u.readme] : [])])],
        G("cup_expl", "Group what must change together (a fix with its test, a feature with its tests), keep unrelated work apart, and order prerequisites first."), {}, "partition", [G("tr_group", "group coupled changes")]);
    }

    case "commit_dependency_order": {
      var theme = r.pick([["API", "Caller", "Docs"], ["Schema", "Model", "View"], ["Parser", "Linter", "Report"]]);
      var deps = level === 1 ? { names: theme.slice(), edges: [[theme[0], theme[1]], [theme[1], theme[2]]] } : level === 2 ? { names: theme.slice(), edges: [[theme[0], theme[1]], [theme[0], theme[2]]] } : { names: theme.slice(), edges: [[theme[0], theme[1]]] };
      var tieSmaller = r.bool();
      var order = (function () { var remaining = deps.names.slice(), out = []; while (remaining.length) { var ready = remaining.filter(function (n) { return !deps.edges.some(function (e) { return e[1] === n && remaining.includes(e[0]); }); }).sort(); var c = tieSmaller ? ready[0] : ready[ready.length - 1]; out.push(c); remaining.splice(remaining.indexOf(c), 1); } return out; }());
      answer = listText(order);
      return exercise(G("cdo_title", "Order the commits under the displayed dependencies."), deps.edges.map(function (e) { return G("cdo_edge", "{a} must come before {b}", { a: e[0], b: e[1] }); }).concat([tieSmaller ? G("cdo_tie_small", "tie rule: alphabetically first") : G("cdo_tie_large", "tie rule: alphabetically last")]), answer,
        uniqueOptions(answer, [listText(order.slice().reverse()), listText(deps.names.slice().sort()), listText(deps.names.slice().sort().reverse()), listText([order[1], order[0], order[2]])]),
        G("cdo_expl", "Place a commit only after everything it depends on; use the tie rule when several are ready."), {}, "topological order", [G("tr_ready_first", "pick a ready commit by the tie rule")]);
    }

    case "atomic_commit_assess": {
      var ak = level === 1 ? "unrelated" : level === 2 ? r.pick(["missingTest", "missingMigration"]) : "coupled";
      rows = [{ unrelated: G("ac_unrelated", "proposal: fix the login bug and reformat an unrelated module"), missingTest: G("ac_missing_test", "proposal: change the parser, leaving its failing test for a later commit"), missingMigration: G("ac_missing_mig", "proposal: change the database schema, leaving its migration for a later commit"), coupled: G("ac_coupled", "proposal: rename a public function and update every caller in other files") }[ak], G("ac_rule", "rule: every commit builds and passes tests; no unrelated changes")];
      answer = ak === "coupled" ? G("ac_yes", "Yes — the changes form one coherent transition") : ak === "unrelated" ? G("ac_no_unrelated", "No — it mixes unrelated changes") : G("ac_no_broken", "No — the commit leaves the project broken until a later one");
      return exercise(G("ac_title", "Is the proposed commit atomic under the stated rule?"), rows, answer,
        uniqueOptions(answer, [G("ac_yes", "Yes — the changes form one coherent transition"), G("ac_no_unrelated", "No — it mixes unrelated changes"), G("ac_no_broken", "No — the commit leaves the project broken until a later one"), G("ac_files", "No — touching more than one file is never atomic")]),
        G("ac_expl", "Atomic means one coherent change that leaves every commit working; the number of files does not matter."), {}, "atomicity", [G("tr_check_rule", "check the rule")]);
    }

    case "review_range_choose": {
      var rk = level === 1 ? "simple" : level === 2 ? "advanced" : "partly";
      rows = rk === "simple" ? [G("row_ref", "{r} → {c}", { r: cur, c: "B" }), G("rv_row_topic", "{t}: B ← C, D", { t: top })]
        : rk === "advanced" ? [G("row_ref", "{r} → {c}", { r: cur, c: "E" }), G("rv_row_base_adv", "{b}: B ← E", { b: cur }), G("rv_row_topic", "{t}: B ← C, D", { t: top })]
        : [G("row_ref", "{r} → {c}", { r: cur, c: "F" }), G("rv_row_partly", "{b} already merged C via F", { b: cur }), G("rv_row_topic", "{t}: B ← C, D", { t: top })];
      answer = cur + ".." + top;
      var rvExpected = rk === "partly" ? "{D}" : "{C, D}";
      return exercise(G("rvr_title", "Which range shows exactly the commits on {t} not yet in {b} — here {s}?", { t: top, b: cur, s: rvExpected }), rows, answer,
        [top + ".." + cur, cur + "..." + top, "B.." + top],
        G("rvr_expl", "{b}..{t} subtracts everything reachable from {b}, so it adapts as {b} advances or merges part of the topic.", { b: cur, t: top }), {}, "review range", [G("tr_subtract", "subtract reachable({c})", { c: cur })]);
    }

    case "integration_strategy_select": {
      var hotfix = r.pick(["H", "K", "P"]), ik = level === 1 ? "ff" : level === 2 ? r.pick(["topology", "linear"]) : "one";
      var igoal = { ff: G("is_ff", "{b} is an ancestor of {t}; integrate without a new commit", { b: cur, t: top }), topology: G("is_topology", "integrate {t} and keep a visible record that it was a separate branch", { t: top }), linear: G("is_linear", "update your unpublished local commits on top of the new upstream, with linear history"), one: G("is_one", "bring only hotfix {h} from an experimental branch into {b}", { h: hotfix, b: cur }) }[ik];
      answer = { ff: G("is_a_ff", "fast-forward merge"), topology: G("is_a_noff", "merge with --no-ff"), linear: G("is_a_rebase", "rebase onto upstream"), one: G("is_a_pick", "cherry-pick {h}", { h: hotfix }) }[ik];
      return exercise(G("is_title", "Goal: {g}. Which operation fits?", { g: igoal }), [], answer,
        uniqueOptions(answer, [G("is_a_ff", "fast-forward merge"), G("is_a_noff", "merge with --no-ff"), G("is_a_rebase", "rebase onto upstream"), G("is_a_pick", "cherry-pick {h}", { h: hotfix }), G("is_a_merge_all", "merge the whole experimental branch")]),
        G("is_expl", "Fast-forward moves a ref, --no-ff records the branch, rebase linearizes unpublished work, and cherry-pick copies one selected patch."), {}, "strategy", [G("tr_match_goal", "match the goal")]);
    }

    case "shared_rewrite_impact": {
      var mate = r.pick(["Bob", "Ana", "Kim"]), sk = level === 1 ? "unpublished" : level === 2 ? "collaborator" : "mixed";
      rows = sk === "unpublished" ? [G("sr_unpub", "C was never pushed; you rewrite it to C'")] : sk === "collaborator" ? [G("sr_pub", "C was pushed; {n} has D → C", { n: mate }), G("sr_rewrite", "you force-push C' replacing C")] : [G("sr_pub", "C was pushed; {n} has D → C", { n: mate }), G("sr_tag", "tag v1 → C on the server"), G("sr_rewrite", "you force-push C' replacing C")];
      answer = sk === "unpublished" ? G("sr_a_none", "no one else is affected") : sk === "collaborator" ? G("sr_a_bob", "{n} keeps C and D; that history diverges from C'", { n: mate }) : G("sr_a_mixed", "{n}'s D still builds on C, and tag v1 still names C; both diverge from C'", { n: mate });
      return exercise(G("sr_title", "What is the impact of the rewrite?"), rows, answer,
        uniqueOptions(answer, [G("sr_a_none", "no one else is affected"), G("sr_a_bob", "{n} keeps C and D; that history diverges from C'", { n: mate }), G("sr_a_auto", "everyone's refs move to C' automatically"), G("sr_a_mixed", "{n}'s D still builds on C, and tag v1 still names C; both diverge from C'", { n: mate })]),
        G("sr_expl", "A rewrite creates new commits; anyone or any ref still holding the old ones now diverges."), {}, "published rewrite", [G("tr_old_new", "compare old and new commits")]);
    }

    case "conflict_risk_compare": {
      var pairsText = level === 1 ? [G("cr_p1_disjoint", "pair 1: edits {a} and {b}", { a: P, b: Q }), G("cr_p2_same", "pair 2: both edit {a} line 5", { a: R })]
        : level === 2 ? [G("cr_p1_lines", "pair 1: both edit {a}, lines 3 and 40", { a: P }), G("cr_p2_same", "pair 2: both edit {a} line 5", { a: Q })]
        : [G("cr_p1_lines", "pair 1: both edit {a}, lines 3 and 40", { a: P }), G("cr_p2_refactor", "pair 2: one reindents all of {a}; the other edits {a} line 7", { a: Q })];
      var swap = r.bool();
      answer = swap ? G("pair_1", "pair 1") : G("pair_2", "pair 2");
      if (swap) pairsText = [pairsText[1].replace(/^[^:]+:/, G("pair_1", "pair 1") + ":"), pairsText[0].replace(/^[^:]+:/, G("pair_2", "pair 2") + ":")];
      return exercise(G("cr_title", "Which pair has the greater risk of a direct merge conflict?"), pairsText, answer, [swap ? G("pair_2", "pair 2") : G("pair_1", "pair 1"), G("cr_equal", "equal risk"), G("cr_none", "neither can conflict")],
        G("cr_expl", "Conflicts come from overlapping edits to the same lines or the context around them; disjoint files or distant lines rarely conflict."), {}, "risk comparison", [G("tr_overlap", "compare overlap")]);
    }

    case "inspection_command_select": {
      var qk = level === 1 ? "status" : level === 2 ? r.pick(["staged", "unstaged"]) : "lost";
      var qtext = { status: G("ics_status", "see which files are staged, modified, or untracked"), staged: G("ics_staged", "see exactly what the next commit would record"), unstaged: G("ics_unstaged", "see edits that are not yet staged"), lost: G("ics_lost", "find where {b} pointed before a mistaken reset", { b: cur }) }[qk];
      answer = { status: "git status", staged: "git diff --staged", unstaged: "git diff", lost: "git reflog " + cur }[qk];
      return exercise(G("ics_title", "Goal: {g}. Which read-only command fits best?", { g: qtext }), [], answer, uniqueOptions(answer, ["git status", "git diff", "git diff --staged", "git reflog " + cur, "git log " + cur]),
        G("ics_expl", "status summarizes layers; diff shows index→worktree; diff --staged shows HEAD→index; the reflog records earlier ref positions."), {}, "inspection", [G("tr_match_goal", "match the goal")]);
    }

    case "operation_state_next_step": {
      var ok2 = level === 1 ? "unresolved" : level === 2 ? "resolved" : "edited";
      rows = { unresolved: [G("os_unresolved", "{p} still has stages 1, 2, and 3; its resolution is edited but not added", { p: P })], resolved: [G("os_resolved", "every conflict is resolved and added")], edited: [G("os_edited", "{p} was resolved and added, then edited again in the worktree", { p: P })] }[ok2];
      answer = { unresolved: G("os_a_add", "git add {p}, then continue", { p: P }), resolved: G("os_a_continue", "git commit (or git merge --continue)"), edited: G("os_a_readd", "git add {p} again if the new edit belongs in the merge, then continue", { p: P }) }[ok2];
      return exercise(G("os_title", "A merge is in progress. What is the next step?"), rows, answer,
        uniqueOptions(answer, [G("os_a_add", "git add {p}, then continue", { p: P }), G("os_a_continue", "git commit (or git merge --continue)"), G("os_a_readd", "git add {p} again if the new edit belongs in the merge, then continue", { p: P }), G("os_a_push", "git push first"), G("os_a_abort", "git merge --abort is required")]),
        G("os_expl", "The merge can continue once no path is unmerged; whatever is in the index is what gets recorded."), {}, "merge continuation", [G("tr_check_unmerged", "check for unmerged paths")]);
    }

    case "push_rejection_diagnose": {
      var dk = level === 1 ? "behind" : level === 2 ? "diverged" : "stale";
      rows = { behind: [G("pd_behind", "the server has new commits on top of what you pushed before; you have none of them")], diverged: [G("pd_diverged", "your C and the server's D both build on B")], stale: [G("pd_stale", "your --force-with-lease expected D, but the server is at E (someone pushed after your last fetch)")] }[dk];
      answer = dk === "stale" ? G("pd_a_stale", "fetch; inspect E; integrate or redo the rewrite; push with a fresh lease") : G("pd_a_fetch", "fetch; inspect; integrate by merge or rebase; push again");
      return exercise(G("pd_title", "Your push was rejected. What is the evidence-preserving next sequence?"), rows, answer,
        uniqueOptions(answer, [G("pd_a_force", "push --force immediately"), G("pd_a_retry", "retry the same push until it succeeds"), G("pd_a_reset", "reset --hard to origin before fetching"), G("pd_a_fetch", "fetch; inspect; integrate by merge or rebase; push again"), G("pd_a_stale", "fetch; inspect E; integrate or redo the rewrite; push with a fresh lease")]),
        G("pd_expl", "A rejection means the server has commits you have not integrated; fetch them, inspect, integrate deliberately, then push."), {}, "diagnose", [G("tr_fetch_inspect", "fetch and inspect")]);
    }

    case "bisect_midpoint_choose": {
      var len = level === 1 ? 5 : level === 2 ? r.pick([6, 8]) : r.int(7, 9), chain = letters(level === 1 ? r.int(0, 3) : 0, len), tieRule = level === 1 ? "upper" : r.pick(["upper", "lower"]);
      var skip = level >= 3 ? chain[r.int(1, len - 2)] : null;
      var candidatesB = chain.filter(function (c, k) { return k > 0 && k < len - 1 && c !== skip; });
      var pos = tieRule === "upper" ? Math.floor(candidatesB.length / 2) : Math.floor((candidatesB.length - 1) / 2);
      answer = candidatesB[pos];
      return exercise(G("bm_title", "Which commit should be tested next?"), [G("bm_row_chain", "linear history: {c}", { c: chain.join("-") }), G("bm_row_known", "{g} is good; {b} is bad", { g: chain[0], b: chain[len - 1] }), tieRule === "upper" ? G("bm_tie_upper", "tie rule: upper midpoint") : G("bm_tie_lower", "tie rule: lower midpoint")].concat(skip ? [G("bm_skip", "{c} cannot be tested and is skipped", { c: skip })] : []), answer,
        uniqueOptions(answer, candidatesB.concat(skip ? [skip] : []).concat([chain[len - 1]])),
        G("bm_expl", "List the untested candidates strictly between the known good and bad commits (minus skipped ones) and pick the middle by the tie rule."), {}, "bisect", [G("tr_candidates", "untested candidates"), G("tr_middle", "pick the middle")]);
    }

    case "bisect_range_update": {
      var blen = level === 1 ? 5 : 6, bchain = letters(0, blen), tested = bchain[r.int(1, blen - 2)], result = level === 1 ? "good" : level === 2 ? "bad" : r.pick(["good", "bad"]);
      var ti = bchain.indexOf(tested), goodIdx = result === "good" ? ti : 0, badIdx = result === "bad" ? ti : blen - 1;
      var remainingB = bchain.slice(goodIdx + 1, badIdx + 1);
      if (level >= 3 && remainingB.length === 1) answer = G("br_found", "the first bad commit is {c}", { c: remainingB[0] });
      else answer = G("br_set", "the first bad commit is in {s}", { s: setText(remainingB) });
      return exercise(G("br_title", "After testing {c} as {r}, what remains?", { c: tested, r: result === "good" ? G("good_word", "good") : G("bad_word", "bad") }), [G("bm_row_chain", "linear history: {c}", { c: bchain.join("-") }), G("bm_row_known", "{g} is good; {b} is bad", { g: bchain[0], b: bchain[blen - 1] })], answer,
        uniqueOptions(answer, [G("br_set", "the first bad commit is in {s}", { s: setText(bchain.slice(1, ti + 1)) }), G("br_set", "the first bad commit is in {s}", { s: setText(bchain.slice(ti + 1)) }), G("br_found", "the first bad commit is {c}", { c: tested }), G("br_set", "the first bad commit is in {s}", { s: setText(bchain.slice(1)) })]),
        G("br_expl", "A good result moves the good boundary up; a bad one moves the bad boundary down. The first bad commit lies after the last good and at or before the first bad."), {}, "bisect", [G("tr_update_bounds", "update the boundaries")]);
    }

    case "repository_invariant_check": {
      var ik2 = level === 1 ? "dangling" : level === 2 ? r.pick(["cycle", "head"]) : "status";
      rows = { dangling: [G("ri_commits", "commits: A (root), B → A"), G("ri_dangling", "branch {b} → Z", { b: cur }), G("row_head_attached", "HEAD → {b}", { b: cur })], cycle: [G("ri_cycle", "commits: A → B, B → A"), G("ri_ok_ref", "branch {b} → B", { b: cur })], head: [G("ri_commits", "commits: A (root), B → A"), G("ri_head_missing", "HEAD → {b}, but no branch {b} exists and the repository has other commits", { b: top })], status: [G("ri_status", "HEAD {p}=v1; index {p}=v1; worktree {p}=v1", { p: P }), G("ri_status_claim", "status claims {p} has a staged change", { p: P })] }[ik2];
      answer = { dangling: G("ri_a_dangling", "{b} points to a commit that does not exist", { b: cur }), cycle: G("ri_a_cycle", "the history contains a cycle"), head: G("ri_a_head", "HEAD names a branch that does not exist"), status: G("ri_a_status", "the status contradicts the three trees") }[ik2];
      return exercise(G("ri_title", "Which displayed fact violates the repository model?"), rows, answer,
        uniqueOptions(answer, [G("ri_a_dangling", "{b} points to a commit that does not exist", { b: cur }), G("ri_a_cycle", "the history contains a cycle"), G("ri_a_head", "HEAD names a branch that does not exist"), G("ri_a_status", "the status contradicts the three trees"), G("ri_a_none", "nothing; everything is consistent")]),
        G("ri_expl", "Refs must name existing commits, history must be acyclic, HEAD must name a real branch or commit, and status must follow from HEAD, index, and worktree."), {}, "invariant check", [G("tr_check_invariants", "check each invariant")]);
    }

    case "safe_sequence_order": {
      var sk2 = level === 1 ? "inspect" : level === 2 ? "dirty" : "recover";
      var steps = { inspect: [G("ss_inspect", "inspect status and log"), G("ss_act", "run the intended command"), G("ss_verify", "verify the result")], dirty: [G("ss_stash", "stash or commit the local work"), G("ss_pull", "pull the upstream changes"), G("ss_restore", "restore the local work and resolve")], recover: [G("ss_reflog", "inspect the reflog"), G("ss_rescue", "create a branch at the lost commit"), G("ss_verify_tree", "verify its tree"), G("ss_push", "push the rescue branch")].slice(0, level >= 4 ? 4 : 3) }[sk2];
      answer = listText(steps);
      var goalRow = { inspect: G("ss_goal_inspect", "goal: change something safely"), dirty: G("ss_goal_dirty", "goal: integrate upstream while you have uncommitted work"), recover: G("ss_goal_recover", "goal: recover a commit lost by a reset and share it") }[sk2];
      return exercise(G("ss_title", "Arrange the safe sequence."), [goalRow], answer,
        uniqueOptions(answer, [listText(steps.slice().reverse()), listText([steps[1], steps[0]].concat(steps.slice(2))), listText([steps[0]].concat(steps.slice(2), [steps[1]]))]),
        G("ss_expl", "Read evidence first, preserve work before changing anything, and verify before sharing."), {}, "safe sequence", [G("tr_evidence_first", "evidence first")]);
    }

    default:
      throw new Error("No scenario for family " + id);
    }
  }
  function shuffle(values, r) { var out = values.slice(); for (var i = out.length - 1; i > 0; i -= 1) { var j = r.int(0, i), swap = out[i]; out[i] = out[j]; out[j] = swap; } return out; }
  function questionFromScenario(familyId, level, r) {
    var family = familyById(familyId), data = scenario(familyId, level, r);
    if (TEXT.localeCode !== "en" && !data.localized) {
      data.title = translateGenerated(data.title); data.rows = data.rows.map(translateGenerated); data.note = translateGenerated(data.note);
      data.answer = translateGenerated(data.answer); data.alternatives = data.alternatives.map(translateGenerated); data.explanation = translateGenerated(data.explanation); data.trace = data.trace.map(translateGenerated);
    }
    var optionValues = Array.from(new Set([data.answer].concat(data.alternatives))).map(function (value, index) { return { value: "option-" + index, label: value }; });
    var correctValue = optionValues.find(function (option) { return option.label === data.answer; }).value;
    var shuffled = shuffle(optionValues, r), canonical = { answer: correctValue };
    return {
      modelId: MODEL_ID, modelVersion: 1, categoryId: family.categoryId, subcategoryId: family.categoryId, familyId: familyId, level: level,
      repositoryState: data.state, dag: data.state.dag || null, refs: data.state.refs || null, head: data.state.head || null,
      index: data.state.index || data.state.indexStages || null, worktree: data.state.work || null, operation: data.operation,
      publicationState: data.state.publication || data.state.publicationState || "not applicable",
      canonicalAnswer: canonical, acceptedAnswerClass: "single exact structured choice", derivationTrace: data.trace,
      difficultyDimensions: ["level-" + level, family.categoryId, level >= 4 ? "mixed-state" : level >= 2 ? "explicit-state" : "isolated-rule"],
      misconceptionsTargeted: [family.learn.rules], distractorProvenance: shuffled.filter(function (option) { return option.value !== correctValue; }).map(function (option) { return option.label; }),
      workedSolution: data.explanation, structuralSignature: familyId + ":" + level + ":" + data.rows.join("|") + ":" + r.state,
      prompt: { title: data.title, rows: data.rows, note: data.note },
      fields: [{ id: "answer", label: t("fieldLabels.answer","Answer"), kind: "choice", answer: correctValue, options: shuffled }],
      explanation: data.explanation, expectedText: data.answer
    };
  }

  var GENERATORS = {};
  FAMILIES.forEach(function (family) { GENERATORS[family.id] = function (level, localRng) { return questionFromScenario(family.id, level, localRng); }; });
  function generateQuestion(familyId, level, seed, ignoreHistory) {
    var generator = GENERATORS[familyId]; if (!generator) throw new Error("Unknown family " + familyId);
    var local = new Rng(seed), candidate;
    for (var attempt = 0; attempt < 80; attempt += 1) { candidate = generator(Math.max(1, Math.min(5, Number(level) || 1)), local); validateQuestion(candidate); if (ignoreHistory || !recentSignatures.includes(candidate.structuralSignature)) return candidate; }
    return candidate;
  }
  function validateQuestion(item) {
    var required = ["modelId","modelVersion","categoryId","familyId","level","repositoryState","operation","canonicalAnswer","acceptedAnswerClass","derivationTrace","difficultyDimensions","misconceptionsTargeted","distractorProvenance","workedSolution","structuralSignature"];
    if (!item || required.some(function (key) { return !Object.prototype.hasOwnProperty.call(item, key); })) throw new Error("Incomplete question metadata");
    if (item.modelId !== MODEL_ID || !GENERATORS[item.familyId] || !LEVELS.includes(item.level)) throw new Error("Invalid question identity");
    if (!item.prompt || !item.prompt.title || !Array.isArray(item.prompt.rows) || !item.fields.length || !item.derivationTrace.length) throw new Error("Incomplete prompt or derivation");
    var ids = new Set(); item.fields.forEach(function (field) { if (!field.id || ids.has(field.id)) throw new Error("Duplicate field"); ids.add(field.id); if (!Object.prototype.hasOwnProperty.call(item.canonicalAnswer, field.id)) throw new Error("Missing canonical answer"); if (!field.options || !field.options.some(function (option) { return option.value === field.answer; })) throw new Error("Choice answer absent"); if (new Set(field.options.map(function(option){return option.label;})).size !== field.options.length) throw new Error("Duplicate choice labels"); });
    if (item.dag && !graphIsAcyclic(item.dag)) throw new Error("Generated graph is cyclic or incomplete");
  }
  function checkQuestion(answers, item) {
    var correct = item.fields.every(function (field) { return String(answers[field.id] === undefined ? "" : answers[field.id]) === field.answer; });
    return { correct: correct, expectedText: item.expectedText };
  }

  function defaultStat() { return { attempts: 0, correct: 0, totalMs: 0, streak: 0, recent: [], mastery: 0 }; }
  function defaultProgress() { var enabled = {}; CATEGORIES.forEach(function (category) { enabled[category.id] = true; }); return { version: 1, view: "practice", settings: { adaptive: true, enabled: enabled }, manual: { familyId: FAMILIES[0].id, level: 1 }, stats: {} }; }
  function mergeProgress(stored) {
    var base = defaultProgress(); if (!stored || typeof stored !== "object") return base;
    if (["practice","matrix","stats","settings","learn"].includes(stored.view)) base.view = stored.view;
    if (stored.settings) { base.settings.adaptive = stored.settings.adaptive !== false; CATEGORIES.forEach(function (category) { if (stored.settings.enabled && stored.settings.enabled[category.id] === false) base.settings.enabled[category.id] = false; }); }
    if (stored.manual && FAMILIES.some(function (family) { return family.id === stored.manual.familyId; })) { base.manual.familyId = stored.manual.familyId; base.manual.level = Math.max(1, Math.min(5, Number(stored.manual.level) || 1)); }
    if (stored.stats && typeof stored.stats === "object") Object.keys(stored.stats).forEach(function (key) { var value = stored.stats[key]; if (!value || typeof value !== "object") return; base.stats[key] = { attempts: Math.max(0, Number(value.attempts) || 0), correct: Math.max(0, Number(value.correct) || 0), totalMs: Math.max(0, Number(value.totalMs) || 0), streak: Math.max(0, Number(value.streak) || 0), recent: Array.isArray(value.recent) ? value.recent.slice(-10).map(Boolean) : [], mastery: Math.max(0, Math.min(100, Number(value.mastery) || 0)) }; });
    return base;
  }
  function loadProgress() { try { return mergeProgress(JSON.parse(localStorage.getItem(STORAGE_KEY))); } catch (error) { return defaultProgress(); } }
  function saveProgress() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (error) {} }
  function getStat(familyId, level) { var key = familyId + ":" + level; if (!progress.stats[key]) progress.stats[key] = defaultStat(); return progress.stats[key]; }
  function updateMastery(stat) { var evidence = Math.min(1, stat.attempts / 5), accuracy = stat.recent.length ? stat.recent.filter(Boolean).length / stat.recent.length : stat.correct / Math.max(1, stat.attempts); stat.mastery = Math.round(100 * evidence * accuracy); }
  function aggregate() { var total = { attempts: 0, correct: 0, totalMs: 0, masteryTotal: 0, practiced: 0 }; Object.keys(progress.stats).forEach(function (key) { var stat = progress.stats[key]; total.attempts += stat.attempts; total.correct += stat.correct; total.totalMs += stat.totalMs; if (stat.attempts) { total.masteryTotal += stat.mastery; total.practiced += 1; } }); return total; }
  function enabledCells() { var cells = []; FAMILIES.forEach(function (family) { if (progress.settings.enabled[family.categoryId] === false) return; var levels = PracticeLabUI.unlockedLevels(LEVELS, function (level) { return getStat(family.id, level); }); var level = levels[levels.length - 1]; cells.push({ family: family, level: level, stat: getStat(family.id, level) }); }); return cells; }
  function chooseAdaptiveCell() { var cells = enabledCells(); if (!cells.length) { progress.settings.enabled[CATEGORIES[0].id] = true; cells = enabledCells(); } var untried = cells.filter(function (cell) { return cell.stat.attempts === 0; }); if (untried.length) return untried[rng.int(0, Math.min(untried.length - 1, 29))]; return cells.slice().sort(function (a, b) { return a.stat.mastery + Math.min(20, a.stat.attempts) - b.stat.mastery - Math.min(20, b.stat.attempts); })[rng.int(0, Math.min(8, cells.length - 1))]; }
  function elapsedMs() { return Math.max(0, Date.now() - currentStartedAt - pausedMs - (isPaused && pauseStartedAt ? Date.now() - pauseStartedAt : 0)); }
  function startQuestion() { if (isPaused) resumePractice(); var selection = progress.settings.adaptive ? chooseAdaptiveCell() : { family: familyById(progress.manual.familyId), level: progress.manual.level }; currentQuestion = generateQuestion(selection.family.id, selection.level, rng.next(), false); recentSignatures.push(currentQuestion.structuralSignature); recentSignatures = recentSignatures.slice(-100); currentStartedAt = Date.now(); pausedMs = 0; pauseStartedAt = 0; submitted = false; renderQuestion(); renderPracticeControls(); renderCurrentMetrics(); }

  function renderPrompt(data) {
    var container = document.getElementById("questionPrompt"); container.replaceChildren();
    var title = document.createElement("div"); title.textContent = data.title; container.appendChild(title);
    data.rows.forEach(function (row) { var line = document.createElement("div"); line.className = "prompt-row"; line.textContent = row; container.appendChild(line); });
    if (data.note) { var note = document.createElement("div"); note.className = "prompt-note"; note.textContent = data.note; container.appendChild(note); }
  }
  function renderAnswerControls() {
    var container = document.getElementById("answerControls"); container.replaceChildren();
    currentQuestion.fields.forEach(function (field) {
      var wrapper = document.createElement("div"), label = document.createElement("label"), control = document.createElement("select"), blank = document.createElement("option");
      wrapper.className = "answer-control"; label.textContent = field.label; label.htmlFor = "answer-" + field.id; blank.value = ""; blank.textContent = t("practice.choose","Choose…"); control.appendChild(blank);
      field.options.forEach(function (option) { var element = document.createElement("option"); element.value = option.value; element.textContent = option.label; control.appendChild(element); });
      control.id = "answer-" + field.id; control.dataset.answerField = field.id; wrapper.appendChild(label); wrapper.appendChild(control); container.appendChild(wrapper);
    });
  }
  function renderQuestion() {
    var family = familyById(currentQuestion.familyId); document.getElementById("questionCategory").textContent = categoryById(family.categoryId).title; document.getElementById("questionFamily").textContent = family.title; document.getElementById("questionLevel").textContent = t("practice.level","Level") + " " + currentQuestion.level;
    renderPrompt(currentQuestion.prompt); renderAnswerControls(); document.getElementById("feedback").className = "feedback hidden"; document.getElementById("submitBtn").disabled = false; document.getElementById("submitBtn").innerHTML = t("practice.check","Check") + ' <span class="key-symbol">↵</span>'; document.getElementById("nextBtn").classList.add("hidden"); document.getElementById("skipBtn").classList.remove("hidden"); renderPauseState();
  }
  function collectAnswers() { var answers = {}; document.querySelectorAll("[data-answer-field]").forEach(function (control) { answers[control.dataset.answerField] = control.value; }); return answers; }
  function submitAnswer(event) {
    event.preventDefault(); if (!currentQuestion || isPaused) return; if (submitted) { startQuestion(); return; }
    var result = checkQuestion(collectAnswers(), currentQuestion), duration = elapsedMs(), stat = getStat(currentQuestion.familyId, currentQuestion.level); stat.attempts += 1; stat.correct += result.correct ? 1 : 0; stat.totalMs += duration; stat.streak = result.correct ? stat.streak + 1 : 0; stat.recent = stat.recent.concat([result.correct]).slice(-10); updateMastery(stat); saveProgress(); submitted = true;
    document.querySelectorAll("[data-answer-field]").forEach(function (control) { control.disabled = true; }); document.getElementById("submitBtn").innerHTML = t("practice.next","Next") + ' <span class="key-symbol">↵</span>'; document.getElementById("nextBtn").classList.remove("hidden"); document.getElementById("skipBtn").classList.add("hidden");
    var feedback = document.getElementById("feedback"); feedback.className = "feedback " + (result.correct ? "correct" : "incorrect"); feedback.replaceChildren(); var strong = document.createElement("strong"); strong.textContent = result.correct ? t("messages.correct","Correct") : t("messages.notQuite","Not quite"); feedback.appendChild(strong);
    if (!result.correct) { var expected = document.createElement("div"); expected.className = "expected-code"; expected.textContent = t("messages.expected","Expected") + ": " + result.expectedText; feedback.appendChild(expected); }
    var detail = document.createElement("div"); detail.className = "feedback-detail"; detail.textContent = currentQuestion.explanation + "\n" + currentQuestion.derivationTrace.join(" → ") + ". " + t("messages.time","Time") + ": " + PracticeLabUI.formatSeconds(duration) + "."; feedback.appendChild(detail); renderCurrentMetrics(); renderSummary();
  }
  function pausePractice() { if (isPaused || submitted) return; isPaused = true; pauseStartedAt = Date.now(); renderPauseState(); }
  function resumePractice() { if (!isPaused) return; pausedMs += Date.now() - pauseStartedAt; pauseStartedAt = 0; isPaused = false; renderPauseState(); }
  function renderPauseState() { document.querySelector(".practice-main").classList.toggle("paused", isPaused); document.getElementById("pauseBtn").disabled = isPaused || submitted; }

  function renderSummary() { var total = aggregate(); document.getElementById("summaryMastery").textContent = (total.practiced ? Math.round(total.masteryTotal / total.practiced) : 0) + "%"; document.getElementById("summaryAccuracy").textContent = (total.attempts ? Math.round(100 * total.correct / total.attempts) : 0) + "%"; document.getElementById("summaryAttempts").textContent = total.attempts; }
  function renderCurrentMetrics() { if (!currentQuestion) return; var stat = getStat(currentQuestion.familyId, currentQuestion.level); document.getElementById("questionMastery").textContent = stat.mastery + "% " + t("practice.masterySuffix","mastery"); document.getElementById("metricMastery").textContent = stat.mastery + "%"; document.getElementById("metricAccuracy").textContent = (stat.attempts ? Math.round(100 * stat.correct / stat.attempts) : 0) + "%"; document.getElementById("metricStreak").textContent = stat.streak; document.getElementById("metricAvgTime").textContent = stat.attempts ? PracticeLabUI.formatSeconds(stat.totalMs / stat.attempts) : "0s"; }
  function renderPracticeControls() { var family = currentQuestion ? familyById(currentQuestion.familyId) : familyById(progress.manual.familyId); selectorController.render({ familyId: family.id, level: currentQuestion ? currentQuestion.level : progress.manual.level }); document.getElementById("adaptiveModeBtn").classList.toggle("secondary-active", progress.settings.adaptive); document.getElementById("manualModeBtn").classList.toggle("secondary-active", !progress.settings.adaptive); }
  function setManualSelection(familyId, level) { progress.manual.familyId = familyById(familyId).id; progress.manual.level = Math.max(1, Math.min(5, Number(level) || 1)); progress.settings.adaptive = false; saveProgress(); startQuestion(); }
  function renderMatrix() {
    var container = document.getElementById("matrix"); container.replaceChildren(); var table = document.createElement("table"), head = document.createElement("thead"), headRow = document.createElement("tr");
    [t("practice.family","Family")].concat(LEVELS.map(function (level) { return "L" + level; })).forEach(function (label) { var th = document.createElement("th"); th.textContent = label; headRow.appendChild(th); }); head.appendChild(headRow); table.appendChild(head); var body = document.createElement("tbody");
    CATEGORIES.forEach(function (category) { var categoryRow = document.createElement("tr"), categoryCell = document.createElement("th"); categoryCell.colSpan = 6; categoryCell.textContent = category.title; categoryRow.appendChild(categoryCell); body.appendChild(categoryRow); FAMILIES.filter(function (family) { return family.categoryId === category.id; }).forEach(function (family) { var row = document.createElement("tr"), name = document.createElement("td"); name.textContent = family.title; row.appendChild(name); LEVELS.forEach(function (level) { var stat = getStat(family.id, level), cell = document.createElement("td"), button = document.createElement("button"); button.type = "button"; button.className = "level-button " + (stat.mastery >= 80 ? "ready" : stat.attempts ? "weak" : ""); button.dataset.familyId = family.id; button.dataset.level = level; button.innerHTML = "L" + level + "<br><span>" + stat.mastery + "% · " + stat.attempts + "</span>"; cell.appendChild(button); row.appendChild(cell); }); body.appendChild(row); }); });
    table.appendChild(body); container.appendChild(table);
  }
  function renderStats() {
    var total = aggregate(); document.getElementById("statTotalAttempts").textContent = total.attempts; document.getElementById("statTotalCorrect").textContent = total.correct; document.getElementById("statTotalTime").textContent = PracticeLabUI.formatMinutes(total.totalMs); document.getElementById("statActiveCells").textContent = total.practiced;
    var cells = Object.keys(progress.stats).map(function (key) { var parts = key.split(":"), family = FAMILIES.find(function (item) { return item.id === parts[0]; }); return family ? { family: family, level: Number(parts[1]), stat: progress.stats[key] } : null; }).filter(function (cell) { return cell && cell.stat.attempts; }); cells.sort(function (a, b) { return a.stat.mastery - b.stat.mastery; });
    function fill(id, selected) { var container = document.getElementById(id); container.replaceChildren(); if (!selected.length) { var empty = document.createElement("p"); empty.textContent = t("stats.noAttemptsYet","No attempts yet"); container.appendChild(empty); return; } selected.forEach(function (cell) { var button = document.createElement("button"); button.type = "button"; button.dataset.familyId = cell.family.id; button.dataset.level = cell.level; button.textContent = cell.family.title + " · L" + cell.level + " · " + cell.stat.mastery + "% (" + cell.stat.attempts + " " + t("stats.tries","tries") + ")"; container.appendChild(button); }); }
    fill("weakList", cells.slice(0, 8)); fill("strongList", cells.slice().reverse().slice(0, 8));
  }
  function renderSettings() { var container = document.getElementById("enabledCategories"); container.replaceChildren(); CATEGORIES.forEach(function (category) { var row = document.createElement("div"), label = document.createElement("label"), input = document.createElement("input"), span = document.createElement("span"); row.className = "check-row"; input.type = "checkbox"; input.checked = progress.settings.enabled[category.id] !== false; input.dataset.categoryId = category.id; span.textContent = category.title; label.appendChild(input); label.appendChild(span); row.appendChild(label); container.appendChild(row); }); }
  function renderLearn() { var container = document.getElementById("learnGrid"); container.replaceChildren(); FAMILIES.forEach(function (family) { var card = document.createElement("article"), heading = document.createElement("h3"), concept = document.createElement("p"), rules = document.createElement("p"), example = document.createElement("code"); card.id = "learn-" + family.id; card.className = "learn-card" + (learnSpotlightId === family.id ? " spotlight" : ""); heading.textContent = family.title; concept.textContent = family.learn.concept; rules.textContent = family.learn.rules; example.textContent = family.learn.example; card.appendChild(heading); card.appendChild(concept); card.appendChild(rules); card.appendChild(example); container.appendChild(card); }); }
  function setView(view) { progress.view = view; saveProgress(); document.querySelectorAll(".view").forEach(function (element) { element.classList.toggle("active", element.id === "view-" + view); }); document.querySelectorAll("[data-view]").forEach(function (button) { button.classList.toggle("active", button.dataset.view === view); }); if (view === "matrix") renderMatrix(); if (view === "stats") renderStats(); if (view === "settings") renderSettings(); if (view === "learn") { renderLearn(); if (learnSpotlightId) { var card = document.getElementById("learn-" + learnSpotlightId); if (card) card.scrollIntoView({ block: "center" }); } } if (view === "practice" && !currentQuestion) startQuestion(); }
  function renderAll() { renderSummary(); renderPracticeControls(); renderMatrix(); renderStats(); renderSettings(); renderLearn(); setView(progress.view); }

  function wireEvents() {
    selectorController = PracticeLabUI.createPracticeSelectors({ categorySelect: document.getElementById("categorySelect"), familySelect: document.getElementById("familySelect"), levelSelect: document.getElementById("levelSelect"), categories: CATEGORIES, families: FAMILIES, levelLabel: function (level) { return "L" + level; }, onSelect: function (selection) { setManualSelection(selection.familyId, selection.level); } });
    document.querySelectorAll("[data-view]").forEach(function (button) { button.addEventListener("click", function () { setView(button.dataset.view); }); });
    document.getElementById("adaptiveModeBtn").addEventListener("click", function () { progress.settings.adaptive = true; saveProgress(); startQuestion(); }); document.getElementById("manualModeBtn").addEventListener("click", function () { progress.settings.adaptive = false; saveProgress(); startQuestion(); });
    document.getElementById("pauseBtn").addEventListener("click", pausePractice); document.getElementById("resumeBtn").addEventListener("click", resumePractice); document.getElementById("learnCurrentBtn").addEventListener("click", function () { if (!currentQuestion) return; learnSpotlightId = currentQuestion.familyId; setView("learn"); });
    document.getElementById("answerForm").addEventListener("submit", submitAnswer); document.getElementById("nextBtn").addEventListener("click", startQuestion); document.getElementById("skipBtn").addEventListener("click", startQuestion);
    document.getElementById("matrix").addEventListener("click", function (event) { var button = event.target.closest("[data-family-id][data-level]"); if (button) { setView("practice"); setManualSelection(button.dataset.familyId, button.dataset.level); } });
    ["weakList","strongList"].forEach(function (id) { document.getElementById(id).addEventListener("click", function (event) { var button = event.target.closest("[data-family-id][data-level]"); if (button) { setView("practice"); setManualSelection(button.dataset.familyId, button.dataset.level); } }); });
    document.getElementById("enabledCategories").addEventListener("change", function (event) { if (event.target.dataset.categoryId) { progress.settings.enabled[event.target.dataset.categoryId] = event.target.checked; saveProgress(); } });
    document.getElementById("exportBtn").addEventListener("click", function () { document.getElementById("dataBox").value = JSON.stringify(progress, null, 2); }); document.getElementById("copyBtn").addEventListener("click", function () { var box = document.getElementById("dataBox"); if (!box.value) box.value = JSON.stringify(progress, null, 2); PracticeLabUI.copyText(box.value); });
    document.getElementById("importBtn").addEventListener("click", function () { try { progress = mergeProgress(JSON.parse(document.getElementById("dataBox").value)); saveProgress(); currentQuestion = null; renderAll(); } catch (error) { document.getElementById("dataBox").value = t("messages.invalidJson","Invalid JSON") + ": " + error.message; } });
    document.getElementById("resetBtn").addEventListener("click", function () { if (window.confirm(t("messages.resetConfirm","Reset all local progress?"))) { progress = defaultProgress(); saveProgress(); currentQuestion = null; renderAll(); } });
    document.addEventListener("keydown", function (event) { if (event.key === "Enter" && submitted && progress.view === "practice") { event.preventDefault(); startQuestion(); } });
  }

  function runSelfTests() {
    var failures = []; function assert(name, condition) { if (!condition) failures.push(name); }
    assert("eight categories", CATEGORIES.length === 8); assert("67 families", FAMILIES.length === 67); assert("67 generators", Object.keys(GENERATORS).length === 67); assert("unique ids", new Set(FAMILIES.map(function (family) { return family.id; })).size === 67);
    if (TEXT.localeCode === "sv") { assert("Swedish category coverage", CATEGORIES.every(function (category) { return TEXT.categories && TEXT.categories[category.id]; })); assert("Swedish family-title coverage", FAMILIES.every(function (family) { return TEXT.families && TEXT.families[family.id]; })); }
    var dag = { A: [], B: ["A"], C: ["B"], D: ["B"], E: ["C","D"] };
    assert("acyclic graph", graphIsAcyclic(dag)); assert("reachability", reachable(dag,"E").join("") === "ABCDE"); assert("ancestor", isAncestor(dag,"B","E") && !isAncestor(dag,"C","D")); assert("merge base", mergeBase(dag,"C","D") === "B"); assert("range", range(dag,"D","E").join("") === "CE");
    var state = pathState({a:"1"},{a:"2"},{a:"3"},"a"); assert("status layers", state.staged === "M" && state.unstaged === "M"); assert("diff", diffPaths({a:"1",b:"1"},{a:"2",b:"1"}).join("") === "a");
    var merged = mergeTrees({a:"1",b:"1"},{a:"2",b:"1"},{a:"1",b:"2"}); assert("clean merge", same(merged.tree,{a:"2",b:"2"}) && !merged.conflicts.length); assert("conflict", mergeTrees({a:"1"},{a:"2"},{a:"3"}).conflicts[0] === "a");
    var mixed = resetState({headTree:{a:"2"},index:{a:"2"},work:{a:"3"}},{a:"1"},"mixed"); assert("mixed reset", same(mixed.index,{a:"1"}) && same(mixed.work,{a:"3"})); assert("push", pushDecision(dag,"B","C") && !pushDecision(dag,"D","C")); assert("lease", leaseDecision("D","D") && !leaseDecision("D","E")); assert("ignore", ignoreMatch("x.log",["*.log"]) && !ignoreMatch("keep.log",["*.log","!keep.log"])); assert("bisect", bisectMidpoint(["A","B","C","D","E"],0,4,"upper") === "C");
    var englishLeakPattern = /\b(?:the|this|which|what|where|use|find|compute|return|enter|choose|does|with|without|from|then|after|before|only|every|all|any|must|can|has|have|is|are|not|into|by|for|when|exact|result|gives|means|worktree|current|actual|expected|local|tracked|untracked|ignored|path|state|moves|creates|stays|remains|becomes|still|because|while|first|second|parent|answer|displayed|complete|conflict|change|changes|modified|missing|value|values|save|saved|goal|step|next|read|write|copy|select|resolve|apply|accepted|rejected|ahead|behind|good|bad|new|old|same|different|shared|published|history|tip)\b/i;
    FAMILIES.forEach(function (family, familyIndex) { LEVELS.forEach(function (level) { for (var sample = 0; sample < 40; sample += 1) { try { var seed = ((familyIndex + 1) * 100000 + level * 1000 + sample + 1) >>> 0, item = generateQuestion(family.id, level, seed, true); assert("canonical " + family.id + ":" + level + ":" + sample, checkQuestion(item.canonicalAnswer,item).correct); assert("metadata " + family.id, item.modelId === MODEL_ID && item.familyId === family.id && item.level === level); if (TEXT.localeCode === "sv") { var localizedText = [item.prompt.title].concat(item.prompt.rows,[item.prompt.note,item.explanation],item.derivationTrace,item.fields.map(function (field) { return field.label; }),item.fields.reduce(function(labels,field){return labels.concat(field.options.map(function(option){return option.label;}));},[])).join(" "); assert("Swedish generated text " + family.id + ":" + level + ":" + sample, !englishLeakPattern.test(localizedText.replace(/--[a-z][a-z-]*/g, "").replace(/\bgit [a-z-]+(?: [a-z-]+)?/g, ""))); } } catch (error) { failures.push("generator " + family.id + ":" + level + ":" + sample + " " + error.message); } } }); });
    if (TEXT.localeCode !== "en") { var missingTemplates = Array.from(USED_TEMPLATE_KEYS).filter(function (key) { return !TEXT.gen || !Object.prototype.hasOwnProperty.call(TEXT.gen, key); }); assert("localized generator templates (" + missingTemplates.slice(0, 8).join(", ") + ")", missingTemplates.length === 0); }
    if (failures.length) { console.error("Git practice self-tests failed", failures.slice(0,100), "total", failures.length); return { ok: false, failures: failures.slice(0,100) }; }
    console.info("Git practice self-tests passed: 67 families, git-state-v1 oracles, 13,400 generated instances" + (TEXT.localeCode === "sv" ? ", Swedish generated-text coverage" : "")); return { ok: true, failures: [] };
  }
  function init() { progress = loadProgress(); rng = new Rng((Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)) >>> 0); wireEvents(); startQuestion(); renderAll(); }
  window.runSelfTests = runSelfTests;
  window.GitVersionControlPractice = { modelId: MODEL_ID, categories: CATEGORIES, families: FAMILIES, generateQuestion: generateQuestion, checkQuestion: checkQuestion, runSelfTests: runSelfTests, oracles: { reachable: reachable, isAncestor: isAncestor, mergeBase: mergeBase, range: range, aheadBehind: aheadBehind, graphIsAcyclic: graphIsAcyclic, pathState: pathState, diffPaths: diffPaths, mergeTrees: mergeTrees, resetState: resetState, pushDecision: pushDecision, leaseDecision: leaseDecision, bisectMidpoint: bisectMidpoint, ignoreMatch: ignoreMatch } };
  document.addEventListener("DOMContentLoaded", init);
}());
