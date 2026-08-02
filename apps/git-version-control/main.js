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
    var ignored = false;
    rules.forEach(function (rule) {
      var negated = rule.charAt(0) === "!", pattern = negated ? rule.slice(1) : rule;
      var escaped = pattern.replace(/[.+^${}()|[\]\\]/g, function (character) { return "\\" + character; }).replace(/\*/g, ".*").replace(/\?/g, ".");
      if (new RegExp("^" + escaped + "$").test(path) || (pattern.indexOf("/") < 0 && new RegExp("^" + escaped + "$").test(path.split("/").pop()))) ignored = !negated;
    });
    return ignored;
  }

  function exercise(title, rows, answer, alternatives, explanation, state, operation, trace) {
    return { title: title, rows: rows, note: "Track only the displayed synthetic state. Nothing is executed.", answer: answer, alternatives: alternatives, explanation: explanation, state: state || {}, operation: operation || null, trace: trace || [] };
  }
  function scenario(id, level, r) {
    var current = r.pick(["main", "trunk", "release"]), topic = r.pick(["topic", "feature", "fix"]), path = r.pick(["app.txt", "config.ini", "src/x.c"]);
    if (topic === current) topic = "topic";
    var dag = { A: [], B: ["A"], C: ["B"], D: ["B"], E: ["C", "D"], F: ["E"] };
    var head = {}; head[path] = "v1"; head["README.md"] = "r1";
    var index = clone(head), work = clone(head), answer, merged, counts, reset;
    var extra = level >= 4 ? " | saved tag→A" : level >= 2 ? " | HEAD attached to " + current : "";
    switch (id) {
    case "snapshot_tree_lookup":
      return exercise("What value does snapshot C store for the requested path?",["B tree: "+path+"=v1, README.md=r1","C tree: "+path+"=v2, README.md=r1","worktree now: "+path+"=v3"],"v2",["v1","v3","path absent"],"A commit lookup reads C's complete tree, so the answer is v2; current worktree state is unrelated.",{dag:dag,trees:{B:head,C:(function(){var x=clone(head);x[path]="v2";return x;}())}},"tree lookup",["resolve C","read C.tree["+path+"]"]);
    case "commit_parent_read":
      return exercise("Which commit is E's second parent?",["A parents: —","B parents: A","C parents: B","D parents: B","E parents: C, D"],"D",["B","C","A"],"Parent order is stored explicitly: E^2 is D.",{dag:dag},"resolve E^2",["read ordered parents of E","select parent 2"]);
    case "ref_head_resolve":
      return exercise("Which commit does HEAD resolve to?",["HEAD → "+current,current+" → C",topic+" → D","tag v1 → B"],"C",["D","B",current],"Attached HEAD resolves through the current branch, and that branch points to C.",{dag:dag,refs:(function(){var x={};x[current]="C";x[topic]="D";x.v1="B";return x;}()),head:{symbolic:current}},"resolve HEAD",["HEAD names "+current,current+" names C"]);
    case "ancestor_reachability":
      answer = isAncestor(dag,"B","F") ? "Yes — B is reachable from F" : "No";
      return exercise("Is B an ancestor of F?",["A←B; B←C; B←D; C,D←E; E←F"],answer,["No — only first parents count","No — B is on another branch","Yes — because B is older"],"Following either parent from F reaches E, then C or D, then B.",{dag:dag},"ancestor query",["reachable(F)={A,B,C,D,E,F}","B is included"]);
    case "merge_base_find":
      answer = mergeBase(dag,"C","D");
      return exercise("Find the unique merge base of C and D.",["C parents: B","D parents: B","B parents: A"],answer,["A","C","D"],"B is the newest common ancestor of the sibling tips.",{dag:dag},"merge-base C D",["ancestors(C)={A,B,C}","ancestors(D)={A,B,D}","best common=B"]);
    case "detached_head_trace":
      return exercise("After committing D while HEAD is detached at C, what moves?",["HEAD detached → C",current+" → B","new commit D has parent C"],"Only detached HEAD moves to D",[current+" moves to D","Both HEAD and "+current+" move to D","No ref can point to D"],"A detached commit advances detached HEAD. No attached branch exists to move.",{dag:{A:[],B:["A"],C:["B"],D:["C"]},refs:(function(){var x={};x[current]="B";return x;}()),head:{detached:"C"}},"commit",["create D parent C","set detached HEAD=D","leave branches unchanged"]);
    case "tag_branch_behavior":
      return exercise("A new commit C is made while HEAD is attached to the branch. Where do the names point?",[current+" → B","tag v1 → B","HEAD → "+current],current+"→C; v1→B",[current+"→C; v1→C",current+"→B; v1→C","both remain B"],"The attached branch advances to C; the tag remains fixed at B.",{dag:{A:[],B:["A"],C:["B"]},refs:(function(){var x={v1:"B"};x[current]="B";return x;}())},"commit",["create C","move branch "+current,"do not move tag"]);
    case "commit_identity_reasoning":
      return exercise("Must X and Y be the same commit?",["X tree = {"+path+"=v2}","Y tree = {"+path+"=v2}","X parent=B; Y parent=D"],"No — equal trees can have different commit identities",["Yes — a commit ID is only its tree","Yes — equal file contents force equal parents","No — commits never share trees"],"Parent identity contributes to commit identity, so equal snapshots do not imply equal commits.",{trees:{X:(function(){var x={};x[path]="v2";return x;}()),Y:(function(){var x={};x[path]="v2";return x;}())},dag:{A:[],B:["A"],D:["A"],X:["B"],Y:["D"]}},"identity comparison",["trees equal","parents differ","IDs differ"]);

    case "status_path_classify":
      index[path]="v2"; work[path]="v3"; answer=pathState(head,index,work,path);
      return exercise("Classify the path against both state layers.",["HEAD: "+path+"=v1","index: "+path+"=v2","worktree: "+path+"=v3"],"staged M and unstaged M",["only staged M","only unstaged M","untracked"],"HEAD→index differs and index→worktree also differs, so both columns are M.",{headTree:head,index:index,work:work},"status",["HEAD→index: M","index→work: M","XY=MM"]);
    case "porcelain_xy_decode":
      return exercise("What does porcelain status code MM mean?",[path+"  MM"],"staged modification and unstaged modification",["two staged modifications","untracked file","merge conflict with two parents"],"X=M is HEAD→index; Y=M is index→worktree.",{status:(function(){var x={};x[path]="MM";return x;}())},"decode status",["decode X=M","decode Y=M"]);
    case "diff_layer_predict":
      index[path]="v2"; work[path]="v3";
      return exercise("Which comparison does git diff --staged show here?",["HEAD "+path+"=v1","index "+path+"=v2","worktree "+path+"=v3"],"HEAD v1 → index v2",["index v2 → worktree v3","HEAD v1 → worktree v3","no change"],"The staged diff compares HEAD to the index.",{headTree:head,index:index,work:work},"git diff --staged",["select HEAD source","select index destination"]);
    case "add_path_effect":
      index[path]="v2";work[path]="v3";
      return exercise("What changes after git add "+path+"?",["index "+path+"=v2","worktree "+path+"=v3","README.md is unchanged"],"index "+path+" becomes v3; no commit is created",["worktree becomes v2","a new commit stores v3","every path is staged"],"Adding a named path copies that worktree entry into index stage 0.",{index:index,work:work},"git add "+path,["copy work["+path+"]","write index stage 0","leave refs unchanged"]);
    case "add_scope_effect":
      return exercise("Which paths are staged by git add -A?",["tracked modified: "+path,"untracked: notes.txt","ignored by *.log: trace.log"],path+" and notes.txt",[path+" only",path+", notes.txt, and trace.log","notes.txt only"],"-A includes tracked changes and nonignored untracked paths, but excludes ignored trace.log.",{tracked:[path],untracked:["notes.txt","trace.log"],ignore:["*.log"]},"git add -A",["stage tracked change","stage nonignored untracked","exclude ignored"]);
    case "commit_index_snapshot":
      index[path]="v2";work[path]="v3";
      return exercise("What does the new commit store for "+path+"?",["HEAD=v1","index=v2","worktree=v3"],"v2; v3 remains an unstaged worktree change",["v3 and the tree becomes clean","v1 because HEAD is the source","both v2 and v3"],"Commit snapshots the index exactly. Worktree v3 is not silently included.",{headTree:head,index:index,work:work},"git commit",["new tree=index","move current branch","recompare index→work"]);
    case "restore_layer_effect":
      index[path]="v2";work[path]="v3";
      return exercise("Predict git restore --staged "+path+".",["HEAD=v1","index=v2","worktree=v3"],"index becomes v1; worktree stays v3",["index stays v2; worktree becomes v2","both become v1","only branch tip moves"],"--staged copies the HEAD entry into the index and leaves the worktree alone.",{headTree:head,index:index,work:work},"git restore --staged "+path,["copy HEAD→index","leave work unchanged"]);
    case "rm_mv_state_effect":
      return exercise("How is git mv old.txt new.txt represented in the bounded model?",["old.txt content=blue","new.txt absent"],"staged deletion of old.txt plus staged addition of new.txt=blue",["one persistent rename object","worktree-only name change","a commit is created immediately"],"The oracle stores a move as delete plus add and does not model heuristic rename identity.",{headTree:{"old.txt":"blue"},index:{"old.txt":"blue"},work:{"old.txt":"blue"}},"git mv old.txt new.txt",["delete old","add new with same content"]);
    case "ignore_rule_match":
      answer=ignoreMatch("keep.log",["*.log","!keep.log"])?"ignored":"not ignored";
      return exercise("Is keep.log ignored after these ordered rules?",["*.log","!keep.log"],answer,["ignored because the first match always wins","tracked automatically","deleted from worktree"],"The later negation re-includes keep.log in the declared subset.",{ignoreRules:["*.log","!keep.log"],path:"keep.log"},"ignore match",["*.log matches → ignored","!keep.log matches later → included"]);
    case "tracked_ignore_behavior":
      return exercise("A tracked debug.log is modified after adding *.log. What happens?",["index already tracks debug.log",".gitignore now contains *.log"],"It remains tracked and its modification is reported",["It becomes untracked","Git deletes it","Its modification can never be staged"],"Ignore rules do not remove an already tracked index entry.",{tracked:["debug.log"],ignoreRules:["*.log"]},"status",["tracked membership wins for status","report modification"]);

    case "branch_create_effect":
      return exercise("Predict git branch "+topic+" at current C.",["HEAD → "+current,current+" → C"],topic+"→C is added; HEAD stays on "+current,["a new commit named "+topic+" is created","HEAD switches to "+topic,current+" moves to "+topic],"Branch creation adds a ref only. It neither creates a commit nor checks it out.",{dag:dag,refs:(function(){var x={};x[current]="C";return x;}())},"git branch "+topic,["create ref "+topic+"=C","leave HEAD symbolic "+current]);
    case "switch_branch_effect":
      return exercise("Predict a clean git switch "+topic+".",["HEAD → "+current+" → C",topic+" → D","trees C and D differ at "+path],"HEAD attaches to "+topic+"; index and worktree become tree D",["HEAD remains on "+current,"a merge commit is created","only worktree changes; index stays C"],"A clean switch attaches HEAD to the target branch and checks out its tree to both index and worktree.",{dag:dag,refs:(function(){var x={};x[current]="C";x[topic]="D";return x;}())},"git switch "+topic,["resolve target D","attach HEAD","checkout tree D"]);
    case "commit_branch_movement":
      return exercise("Commit E while HEAD is attached to "+topic+" at C. Which refs move?",[current+" → B",topic+" → C","HEAD → "+topic],"Only "+topic+" moves to E",["only "+current+" moves to E","both branches move to E","HEAD detaches at E"],"A commit advances only the attached current branch.",{dag:{A:[],B:["A"],C:["B"],E:["C"]},refs:(function(){var x={};x[current]="B";x[topic]="C";return x;}())},"git commit",["create E parent C","move "+topic+"→E"]);
    case "branch_delete_reachability":
      return exercise("After deleting branch "+topic+", is D still reachable from a shown ref?",[topic+" → D","tag save → D",current+" → C"],"Yes — tag save still points to D",["No — deleting any branch deletes its commits","No — tags do not count as refs","Yes — because D is newer than C"],"Deleting one branch removes only that ref; the tag continues to name D.",{dag:dag,refs:(function(){var x={save:"D"};x[current]="C";x[topic]="D";return x;}())},"git branch -d "+topic,["remove branch ref","scan remaining refs","save reaches D"]);
    case "revision_parent_expression":
      return exercise("Resolve E^2.",["E parents (ordered): C, D","C parent: B","D parent: B"],"D",["B","C","A"],"^2 selects the second parent, not two first-parent generations.",{dag:dag},"resolve E^2",["read E.parents[1]=D"]);
    case "revision_range_select":
      answer=range(dag,"D","C").join(",");
      return exercise("Which commit set is selected by D..C?",["C→B→A","D→B→A"],"{C}",["{D}","{B,C}","{C,D}"],"D..C is reachable(C) minus reachable(D), leaving only C.",{dag:dag},"D..C",["reachable(C)={A,B,C}","subtract {A,B,D}","result {C}"]);
    case "history_order_reason":
      return exercise("Which newest-first order satisfies ancestry and the displayed sibling tie?",["E parents: C,D","C and D both parent B","tie for unrelated siblings: larger ID first"],"E, D, C, B, A",["B, C, D, E, A","E, C, D, B, A","D, E, C, A, B"],"Children precede parents; D precedes C only because the explicit tie says larger ID first.",{dag:{A:[],B:["A"],C:["B"],D:["B"],E:["C","D"]}},"topological history order",["place E first","tie D before C","then B,A"]);

    case "merge_case_classify":
      return exercise("Classify merging "+topic+" at D into current "+current+" at B.",[current+" → B",topic+" → D","D parent: B"],"fast-forward",["up to date","divergent three-way merge","conflict before ancestry is checked"],"Current B is an ancestor of target D, so the branch can fast-forward.",{dag:dag,refs:(function(){var x={};x[current]="B";x[topic]="D";return x;}())},"git merge "+topic,["ancestor(B,D)=true","classify fast-forward"]);
    case "fast_forward_effect":
      return exercise("What is the result of the clean fast-forward merge?",[current+" → B",topic+" → D","D→B"],current+" moves to existing D; no commit is created",["create E parents B,D",topic+" moves to B","both branches move to a new commit"],"Fast-forward is a ref movement to an existing descendant.",{dag:dag},"git merge "+topic,["classify fast-forward","move current ref B→D","checkout D tree"]);
    case "no_ff_merge_effect":
      return exercise("What does git merge --no-ff "+topic+" create here?",[current+" → B",topic+" → D","D parent: B"],"new E with parents (B,D)",["no commit; only "+current+"→D","new E with parents (D,B)","new E with parent D only"],"The forced merge commit records old current B first and merged tip D second.",{dag:dag},"git merge --no-ff "+topic,["save ours B","save theirs D","create E parents B,D"]);
    case "three_way_tree_merge":
      merged=mergeTrees({a:"1",b:"1"},{a:"2",b:"1"},{a:"1",b:"2"});
      return exercise("Compute the clean three-way result.",["base: a=1, b=1","ours ("+current+"): a=2, b=1","theirs ("+topic+"): a=1, b=2"],"a=2, b=2; no conflicts",["a=2, b=1","a=1, b=2","both paths conflict"],"Each side changed a different path relative to base, so both one-sided changes are retained.",{base:{a:"1",b:"1"},ours:{a:"2",b:"1"},theirs:{a:"1",b:"2"}},"three-way merge",["a takes ours","b takes theirs","conflicts={}"]);
    case "merge_conflict_identify":
      merged=mergeTrees((function(){var x={};x[path]="red";return x;}()),(function(){var x={};x[path]="blue";return x;}()),(function(){var x={};x[path]="green";return x;}()));
      return exercise("Which path conflicts?",["base "+path+"=red","ours "+path+"=blue","theirs "+path+"=green"],path,["no conflict","every tracked path","README.md"],"Both sides changed the same modeled value differently, so "+path+" is an unmerged path.",{conflicts:merged.conflicts},"three-way merge",["ours≠base","theirs≠base","ours≠theirs","conflict"]);
    case "conflict_index_stages":
      return exercise("What value belongs in index stage 2?",["current branch "+topic+" has "+path+"=blue","merging branch "+current+" has "+path+"=green","merge base has "+path+"=red"],"blue — current branch "+topic+" is ours",["green — main is always ours","red — stage 2 is base","no stage 2 exists"],"Stage 2 is ours/current branch. Stage 1 is base and stage 3 is theirs.",{indexStages:(function(){var x={};x[path]={1:"red",2:"blue",3:"green"};return x;}())},"conflict staging",["stage1=red","stage2=blue","stage3=green"]);
    case "resolve_conflict_complete":
      return exercise("Which sequence can complete the conflicted merge?",[path+" has stages 1,2,3","desired resolved worktree value=purple"],"edit "+path+"; git add "+path+"; git commit",["edit "+path+"; git commit","git commit; then git add "+path,"git reset --hard; git commit"],"Adding the resolution replaces unmerged stages with stage 0; only then can the merge commit be made.",{unmerged:[path],savedParents:["C","D"]},"resolve merge",["write resolution","stage resolution","verify no unmerged paths","create merge commit"]);
    case "merge_abort_effect":
      return exercise("What does git merge --abort restore in this fixture?",["merge began with HEAD "+current+"→C","saved index/work both equal tree C","current operation has conflict at "+path],"HEAD, index, and worktree return exactly to saved C state",["keep conflict but move branch to D","create an inverse commit","restore only HEAD and leave unmerged stages"],"The bounded abort transition restores all saved pre-operation layers and clears merge metadata.",{saved:{head:"C",index:"tree C",work:"tree C"},operation:{type:"merge",conflict:path}},"git merge --abort",["load saved state","clear operation"]);

    case "reset_mode_effect":
      reset=resetState({headTree:{a:"2"},index:{a:"2"},work:{a:"3"}},{a:"1"},"mixed");
      return exercise("Predict git reset --mixed B.",["current C tree a=2","target B tree a=1","index a=2; worktree a=3"],"branch/head tree B; index a=1; worktree a=3",["branch B; index a=2; worktree a=3","branch B; index a=1; worktree a=1","branch stays C; both layers become B"],"Mixed reset moves the branch and resets the index to B, while preserving the worktree.",{result:reset},"git reset --mixed B",["move ref C→B","copy B tree to index","leave work"]);
    case "revert_commit_effect":
      return exercise("What does reverting published C do?",["B tree: "+path+" absent","C→B tree: "+path+"=blue","HEAD/current branch at C"],"create D→C whose tree removes "+path,["move branch back to B without a commit","delete commit C","rewrite C in place"],"Revert applies C's inverse patch as a new child, preserving C in history.",{dag:{A:[],B:["A"],C:["B"],D:["C"]}},"git revert C",["derive patch B→C","invert patch","apply to C","commit D"]);
    case "cherry_pick_effect":
      return exercise("Cherry-pick D while current branch is at C. What identity is created?",["D→B adds "+path+"=blue","C→B changes README.md","source branch remains at D"],"D'→C with both C's README change and D's "+path+" patch",["move current branch directly to D","change D's parent in place to C","merge commit parents C,D"],"Cherry-pick copies D's parent-relative patch onto C and creates a new one-parent commit.",{dag:dag},"git cherry-pick D",["diff B→D","apply to tree C","create D' parent C"]);
    case "linear_rebase_graph":
      return exercise("Rebase local C→B then F→C onto upstream D→B. What graph results?",["local-only order: C, F","upstream tip: D"],"D←C'←F'; local branch moves to F'",["D←C←F with unchanged IDs","merge M parents F,D","B←D←F'←C'"],"Rebase replays oldest-first onto D, producing new identities C' then F'.",{dag:{A:[],B:["A"],C:["B"],F:["C"],D:["B"]}},"git rebase D",["local set {C,F}","replay C onto D→C'","replay F onto C'→F'"]);
    case "rebase_patch_result":
      return exercise("What tree does replayed C' contain?",["base B: a=1,b=1","original C→B changes a=2","upstream D→B changes b=2","C' replays C's patch onto D"],"a=2,b=2",["a=2,b=1","a=1,b=2","conflict because trees differ"],"The patch changes only a; it applies cleanly while preserving upstream's b=2.",{base:{a:"1",b:"1"},source:{a:"2",b:"1"},upstream:{a:"1",b:"2"}},"rebase patch",["derive patch a:1→2","apply to upstream","result a2,b2"]);
    case "amend_effect":
      return exercise("What happens after amending current C while tag old still names C?",[current+" → C","tag old → C","index contains corrected tree"],current+" moves to new C'; tag old remains at C",["C is mutated and both names still point to it","both refs move to C'","tag old is deleted"],"Amend creates a replacement commit and moves only the current branch; other refs preserve the old identity.",{refs:(function(){var x={old:"C"};x[current]="C";return x;}())},"git commit --amend",["create C' parent of C's parent","move current branch","leave tag"]);
    case "reflog_recover_ref":
      return exercise("Which safe action preserves the pre-reset commit?",[current+" now → A","reflog: "+current+"@{1} → C","goal: keep current A and preserve C"],"create branch recover at C, then verify",["reset --hard C immediately","revert A","delete the reflog entry"],"A new branch at the reflog tip preserves C without discarding the current A state.",{refs:(function(){var x={};x[current]="A";return x;}()),reflog:["C","A"]},"recovery",["inspect reflog","create recover→C","verify"]);
    case "stash_push_effect":
      return exercise("What does git stash push -u save and leave?",["tracked "+path+" modified","untracked notes.txt","ignored trace.log"],"save "+path+" and notes.txt; leave ignored trace.log; restore tracked state",["save only "+path,"save all three paths","create a commit on "+current],"-u includes nonignored untracked paths but not ignored paths; stash remains a local entry.",{tracked:[path],untracked:["notes.txt"],ignored:["trace.log"]},"git stash push -u",["capture tracked deltas","capture nonignored untracked","restore tracked index/work"]);
    case "stash_apply_pop_effect":
      return exercise("A pop conflicts while applying stash S. What happens to S?",["current "+path+"=blue","S changes red→green on the same modeled value"],"S remains in the stash list",["S is removed before applying","S becomes a branch","all current work is discarded"],"A conflicting pop retains the stash entry so it can be retried or recovered.",{stash:["S"],conflict:path},"git stash pop",["attempt apply","detect conflict","retain S"]);
    case "undo_operation_select":
      return exercise("Choose the operation that matches the exact goal.",["Bad commit C is already shared","C must remain in history","create a recorded inverse change"],"git revert C",["git reset --hard C^","git commit --amend","git restore --staged C"],"Revert is the history-preserving published undo operation.",{publication:"shared",target:"C"},"operation selection",["shared rewrite forbidden","inverse commit required","select revert"]);

    case "remote_tracking_staleness":
      return exercise("Before fetch, where do the three names resolve?",["local "+current+" → C","cached origin/"+current+" → B","actual server "+current+" → D"],"local=C; origin/"+current+"=B; server=D",["all=D","local=C; origin/"+current+"=D; server=D","local=B; origin/"+current+"=B; server=B"],"The tracking ref is cached local state and does not update continuously.",{localRefs:(function(){var x={};x[current]="C";x["origin/"+current]="B";return x;}()),remoteRefs:(function(){var x={};x[current]="D";return x;}())},"resolve refs",["read local branch","read cached tracking ref","read advertised remote"]);
    case "fetch_effect":
      return exercise("Predict git fetch origin.",["local "+current+" → C","origin/"+current+" → B","server "+current+" → D","clean index/work at C"],"origin/"+current+" moves to D; local "+current+", HEAD, index, and work stay C",["local "+current+" fast-forwards to D","both local refs move to D and work checks out D","a merge commit is created"],"Fetch updates objects and the remote-tracking ref only.",{dag:dag},"git fetch origin",["copy required objects","update origin/"+current+"→D","leave local state"]);
    case "ahead_behind_count":
      counts=aheadBehind(dag,"C","D");
      return exercise("How far is local C ahead/behind upstream D?",["C→B→A","D→B→A"],"ahead 1, behind 1",["ahead 0, behind 0","ahead 2, behind 2","ahead 1, behind 0"],"Reachable only from C is {C}; reachable only from D is {D}.",{dag:dag,local:"C",upstream:"D"},"ahead/behind",["local-only={C}","upstream-only={D}"]);
    case "upstream_ref_reasoning":
      return exercise("Which ref does argument-free pull use in this model?",["local branch release","upstream mapping: release → central/stable","origin/release also exists"],"central/stable",["origin/release","origin/main","the newest remote ref"],"The explicit upstream mapping overrides same-name guesses.",{upstreams:{release:"central/stable"}},"git pull",["lookup upstream(release)","resolve central/stable"]);
    case "push_fast_forward_decision":
      answer=pushDecision({A:[],B:["A"],C:["B"]},"B","C")?"accepted; remote moves B→C":"rejected";
      return exercise("Will the normal push be accepted?",["remote destination → B","local source → C","C parent: B"],answer,["rejected because IDs differ","accepted but remote creates a merge commit","rejected unless force is used"],"B is an ancestor of C, so the ref update is a fast-forward.",{dag:{A:[],B:["A"],C:["B"]},oldTip:"B",newTip:"C"},"git push",["ancestor(B,C)=true","accept ref update"]);
    case "force_with_lease_decision":
      answer=leaseDecision("D","E")?"accepted":"rejected; remote remains E";
      return exercise("Will the force-with-lease update be accepted?",["lease expects destination D","actual remote destination E","proposed rewritten tip C"],answer,["accepted because any lease permits force","accepted because C is local","rejected but remote moves to D"],"The actual tip E does not equal expected D, so compare-and-swap rejects without movement.",{expected:"D",actual:"E",proposed:"C"},"push --force-with-lease",["compare E with D","mismatch","reject"]);
    case "pull_ff_only_effect":
      return exercise("Predict pull --ff-only after the server advertises D.",["local "+current+" → C","cached origin/"+current+" → B","C and D are siblings from B"],"fetch moves origin/"+current+" to D; integration rejects; local "+current+" stays C",["local "+current+" moves backward to B","create merge E parents C,D","fetch is rolled back too"],"Fetch completes first. Because C is not an ancestor of D, ff-only rejects the local integration.",{dag:dag},"git pull --ff-only",["fetch origin/"+current+"→D","ancestor(C,D)=false","leave local ref C"]);
    case "pull_merge_effect":
      return exercise("Predict pull --no-rebase on clean divergent tips.",["local "+current+" → C","server "+current+" → D","C,D siblings from B"],"origin/"+current+"→D; create local E parents (C,D); "+current+"→E",["origin/"+current+" also moves to E","rewrite C as C' on D","reject because divergence can never merge"],"Pull fetches D, then a clean three-way merge creates local E with ordered parents C,D.",{dag:dag},"git pull --no-rebase",["fetch D","classify divergence","merge trees","create E parents C,D"]);
    case "pull_rebase_effect":
      return exercise("Predict pull --rebase on one local and one remote commit.",["base B","local "+current+" → C","server "+current+" → D"],"origin/"+current+"→D; create C'→D; local "+current+"→C'",["create merge E parents C,D","move server to C'","keep original C as child of D"],"Fetch records D, then the local-only patch C is replayed as the new identity C' on D.",{dag:dag},"git pull --rebase",["fetch D","local-only={C}","replay C→C' parent D"]);
    case "clone_initial_state":
      return exercise("Which local state is created by this clone?",["remote default branch trunk → D","remote also has topic → C"],"local trunk→D, origin/trunk→D, origin/topic→C, HEAD→trunk, clean tree D",["local trunk and local topic are both created","HEAD is detached at D","local main is invented at D"],"Clone checks out one local default branch and creates tracking refs for advertised branches.",{remoteRefs:{trunk:"D",topic:"C"},defaultRef:"trunk"},"clone",["copy objects","create tracking refs","create local default trunk","checkout D"]);

    case "change_unit_partition":
      return exercise("Choose the coherent ordered partition.",["units: parser fix; parser regression test; README reformat","constraint: fix+test together; README separate"],"[parser fix + regression test], [README reformat]",["[parser fix], [test + README]","[all three in one commit]","[README + parser fix], [test]"],"The behavior change and its regression test are one unit; unrelated formatting is isolated.",{mustTogether:[["parser fix","regression test"]],mustSeparate:[["parser fix","README reformat"]]},"partition changes",["union must-together","separate README","order behavior before cleanup"]);
    case "commit_dependency_order":
      return exercise("Order the commits under the displayed dependencies.",["API: define new interface","Caller: switch all callers","Docs: independent","edges: API→Caller; tie says Docs first"],"Docs, API, Caller",["Caller, API, Docs","API, Caller, Docs","Docs, Caller, API"],"Docs wins the explicit independent tie; API must precede Caller.",{dependencies:[["API","Caller"]],tie:"Docs first"},"topological order",["choose Docs by tie","then API","then Caller"]);
    case "atomic_commit_assess":
      return exercise("Is the proposed commit atomic under the stated rule?",["changes: rename public API; update every compile-required caller","rule: every intermediate commit must compile; no unrelated changes"],"Yes — the cross-file edits form one coherent transition",["No — touching more than one file is never atomic","No — callers must always be a later commit","Yes — every large commit is atomic"],"Splitting the required callers would break the intermediate snapshot; file count is not the criterion.",{changes:["rename API","update callers"],invariant:"compiles"},"atomicity check",["required changes are coupled","no unrelated unit","atomic"]);
    case "review_range_choose":
      return exercise("Which range isolates the commits unique to topic?",[current+" → B",topic+" → D→C→B"],current+".."+topic,[topic+".."+current,current+"..."+topic,"B^.."+current],"left..right subtracts commits reachable from the base side from those reachable on topic.",{dag:{A:[],B:["A"],C:["B"],D:["C"]}},"review range",["reachable(topic)-reachable(current)={C,D}"]);
    case "integration_strategy_select":
      return exercise("Which integration operation matches the goal?",["experimental branch has five commits including hotfix H","release needs only H","do not include the other experiments"],"cherry-pick H onto release",["merge the whole experimental branch","rebase release onto experiment","fast-forward release to experiment"],"Cherry-pick copies one selected patch without integrating the rest of the source history.",{publication:"source unchanged",goal:"one patch"},"strategy selection",["desired subset={H}","select cherry-pick"]);
    case "shared_rewrite_impact":
      return exercise("What happens to Bob's branch after the published rewrite?",["published C is replaced by C'","Bob has D→C","C and C' have similar patches but different IDs"],"Bob retains old C and D; his history diverges from C'",["Bob's clone changes automatically to D→C'","D fast-forwards to C'","same patch makes C and C' identical"],"Bob's objects and refs remain. Because old C is not C', his descendant D cannot simply fast-forward to the rewritten line.",{old:{C:["B"],D:["C"]},rewritten:{"C'":["B"]}},"published rewrite",["old-only={C,D}","new-only={C'}","divergence"]);
    case "conflict_risk_compare":
      return exercise("Which pair has greater modeled direct conflict risk?",["Pair 1: left edits a line 5; right edits b line 5","Pair 2: left edits x line 5; right edits x line 5"],"Pair 2",["Pair 1","equal risk because both have two commits","neither can ever conflict"],"Pair 2 overlaps the exact path and line region; Pair 1 uses disjoint paths.",{pairs:[{paths:["a","b"]},{paths:["x","x"],lines:[5,5]}]},"risk comparison",["score pair1 overlap=0","score pair2 overlap=1"]);

    case "inspection_command_select":
      return exercise("Which read-only command most directly shows the exact staged patch?",["Goal: inspect what the next commit would record","Do not change state"],"git diff --staged",["git diff","git reset --hard","git commit --amend"],"The staged diff is HEAD→index. Plain diff shows index→worktree.",{query:"staged patch"},"inspection selection",["map staged patch→HEAD/index diff"]);
    case "operation_state_next_step":
      return exercise("What must happen before the merge can continue?",[path+" still has index stages 1,2,3","resolved content has been edited in the worktree but not added"],"git add "+path+", then continue/commit",["continue immediately","git push first","delete the current branch"],"Editing is not staging. Add replaces the unmerged stages with the selected stage-0 resolution.",{unmerged:[path],workResolved:true,indexResolved:false},"merge continuation",["detect unmerged stage","add resolution","continue"]);
    case "push_rejection_diagnose":
      return exercise("Choose the evidence-preserving next sequence after rejection.",["local C and actual remote D are siblings from B","cached origin/"+current+" is still B","normal push C→remote was rejected"],"fetch; inspect C versus origin/"+current+"; integrate by stated policy; verify; push",["retry the same push repeatedly","push --force immediately","reset --hard origin/"+current+" before fetching"],"Fetch makes the collaborator tip visible locally; inspection and deliberate integration precede another push.",{dag:dag,tracking:"B",actual:"D",local:"C"},"diagnose rejection",["cause: D not ancestor of C","fetch evidence","inspect","integrate","verify","push"]);
    case "bisect_midpoint_choose":
      answer=bisectMidpoint(["A","B","C","D","E"],0,4,"upper");
      return exercise("Which commit should be tested next?",["linear history A-B-C-D-E","A is good; E is bad","tie rule: upper midpoint"],answer,["B","D","E"],"The unclassified candidates are B,C,D; C halves the interval.",{path:["A","B","C","D","E"],good:"A",bad:"E",tie:"upper"},"bisect midpoint",["candidates={B,C,D}","middle=C"]);
    case "bisect_range_update":
      return exercise("What remains after testing C as bad?",["linear A-B-C-D-E","A is known good; E known bad","test C result: bad"],"first bad is in {B,C}",["first bad is in {D,E}","C is certainly the first bad","B is certainly the first bad"],"A bad C narrows the bad bound to C, but B remains untested between known-good A and C.",{path:["A","B","C","D","E"],good:"A",bad:"C"},"bisect update",["set bad=C","remaining unknown B","possible {B,C}"]);
    case "repository_invariant_check":
      return exercise("Which displayed fact violates git-state-v1?",["commits: A root; B parent A","branch "+current+" → Z","HEAD → "+current,"Z is not a commit"],current+" points to a missing commit Z",["A is a root","HEAD is attached","B has one parent"],"Every ordinary branch target must identify an existing commit. The other facts are valid.",{dag:{A:[],B:["A"]},refs:(function(){var x={};x[current]="Z";return x;}())},"invariant check",["validate DAG","validate ref targets","find missing Z"]);
    case "safe_sequence_order":
      return exercise("Arrange the safe recovery steps.",["current branch was reset from C to A","reflog still shows C","goal: preserve C without discarding A"],"inspect reflog; create recover branch at C; verify recover tree",["reset --hard C; inspect reflog; push","delete A; create C; inspect status","push --force; then inspect reflog"],"Read-only evidence comes first, preservation second, and verification last; no hard reset is required.",{current:"A",reflog:["C"]},"safe sequence",["inspect","preserve with ref","verify"]);
    default:
      throw new Error("No scenario for family " + id);
    }
  }

  function shuffle(values, r) { var out = values.slice(); for (var i = out.length - 1; i > 0; i -= 1) { var j = r.int(0, i), swap = out[i]; out[i] = out[j]; out[j] = swap; } return out; }
  function questionFromScenario(familyId, level, r) {
    var family = familyById(familyId), data = scenario(familyId, level, r);
    if (TEXT.localeCode !== "en") {
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
      prompt: { title: data.title, rows: data.rows.concat(level >= 3 ? [translateGenerated("Difficulty context: L" + level + " includes the complete displayed state.")] : []), note: data.note },
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
  function enabledCells() { var cells = []; FAMILIES.forEach(function (family) { if (progress.settings.enabled[family.categoryId] === false) return; LEVELS.forEach(function (level) { cells.push({ family: family, level: level, stat: getStat(family.id, level) }); }); }); return cells; }
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
    FAMILIES.forEach(function (family, familyIndex) { LEVELS.forEach(function (level) { for (var sample = 0; sample < 40; sample += 1) { try { var seed = ((familyIndex + 1) * 100000 + level * 1000 + sample + 1) >>> 0, item = generateQuestion(family.id, level, seed, true); assert("canonical " + family.id + ":" + level + ":" + sample, checkQuestion(item.canonicalAnswer,item).correct); assert("metadata " + family.id, item.modelId === MODEL_ID && item.familyId === family.id && item.level === level); if (TEXT.localeCode === "sv") { var localizedText = [item.prompt.title].concat(item.prompt.rows,[item.prompt.note,item.explanation],item.derivationTrace,item.fields.map(function (field) { return field.label; }),item.fields.reduce(function(labels,field){return labels.concat(field.options.map(function(option){return option.label;}));},[])).join(" "); assert("Swedish generated text " + family.id + ":" + level + ":" + sample, !englishLeakPattern.test(localizedText)); } } catch (error) { failures.push("generator " + family.id + ":" + level + ":" + sample + " " + error.message); } } }); });
    if (failures.length) { console.error("Git practice self-tests failed", failures.slice(0,100), "total", failures.length); return { ok: false, failures: failures.slice(0,100) }; }
    console.info("Git practice self-tests passed: 67 families, git-state-v1 oracles, 13,400 generated instances" + (TEXT.localeCode === "sv" ? ", Swedish generated-text coverage" : "")); return { ok: true, failures: [] };
  }
  function init() { progress = loadProgress(); rng = new Rng((Date.now() ^ Math.floor(Math.random() * 0xFFFFFFFF)) >>> 0); wireEvents(); startQuestion(); renderAll(); }
  window.runSelfTests = runSelfTests;
  window.GitVersionControlPractice = { modelId: MODEL_ID, categories: CATEGORIES, families: FAMILIES, generateQuestion: generateQuestion, checkQuestion: checkQuestion, runSelfTests: runSelfTests, oracles: { reachable: reachable, isAncestor: isAncestor, mergeBase: mergeBase, range: range, aheadBehind: aheadBehind, graphIsAcyclic: graphIsAcyclic, pathState: pathState, diffPaths: diffPaths, mergeTrees: mergeTrees, resetState: resetState, pushDecision: pushDecision, leaseDecision: leaseDecision, bisectMidpoint: bisectMidpoint, ignoreMatch: ignoreMatch } };
  document.addEventListener("DOMContentLoaded", init);
}());
