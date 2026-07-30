# Chess Calculation — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, orthodox-chess move/attack oracle, bounded tactical solver, board renderer, notation parser, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Chess Calculation

### Topic goal

Develop accurate, disciplined calculation over legal chess positions. The learner should become able to:

- visualize files, ranks, diagonals, colors, rays, and knight geometry without moving pieces physically;
- generate attacks, pseudo-legal moves, and fully legal moves without conflating them;
- detect checks, pins, discovered lines, double check, legal evasions, mate, and stalemate;
- handle castling, en passant, and promotion correctly;
- read and produce coordinate notation, SAN, and the useful parts of FEN;
- identify short tactical motifs from their actual geometry rather than from visual pattern labels alone;
- calculate forcing lines against every legal defense;
- compare exchanges and bounded tactical outcomes without stopping after the first attractive reply;
- retain and update a small position mentally through several plies;
- recognize elementary endgame geometry that makes short calculation exact;
- use candidate moves, reply sets, transpositions, repetition, and mate distance methodically;
- distinguish a proven tactic from an engine preference or positional guess.

The app trains board vision and exact calculation. It is not primarily an opening repertoire, game database, rating predictor, or general “find the grandmaster move” collection.

### Audience and prerequisites

The initial audience ranges from a learner who knows how the pieces move to an intermediate club player seeking more reliable calculation.

Expected prerequisites:

- the goal of checkmate;
- the names and ordinary movement of the six piece types;
- alternating turns and capture;
- algebraic square coordinates, introduced again at Level 1.

The app teaches special rules, SAN, pins, search trees, and endgame ideas before using them without scaffolding.

### Authority and rules version

The rules profile is:

```text
orthodox-fide-2023-v1
```

It follows Articles 2, 3, 5, 9, and Appendix C of the [FIDE Laws of Chess effective 1 January 2023](https://handbook.fide.com/chapter/e012023), limited to the rules of play needed to analyze a digital position.

Included:

- orthodox 8×8 chess;
- legal movement, attack, check, checkmate, and stalemate;
- castling, en passant, and promotion;
- draw state needed for bounded calculation;
- standard algebraic notation.

Excluded:

- touch-move, clocks, illegal-move penalties, arbiter procedure, scoresheets, draw offers, player conduct, and tournament administration;
- Chess960 and other variants.

The rules data must be versioned. A future rules update cannot silently alter saved questions.

### Board and coordinate contract

Files are `a` through `h` from White's left to right. Ranks are `1` through `8` from White's side toward Black's side.

Canonical internal coordinates:

```text
fileIndex: a=0 ... h=7
rankIndex: 1=0 ... 8=7
squareIndex = 8*rankIndex + fileIndex
```

Light/dark color is fixed by:

```text
a1 is dark
(fileIndex + rankIndex) even => dark
```

Canonical board view has White at the bottom. A flipped Black-bottom view changes only rendering; square IDs, move legality, SAN, and answer meaning remain unchanged.

White pawns move toward increasing rank numbers; Black pawns move toward decreasing rank numbers.

### Piece and occupancy contract

Stable piece codes:

```text
white: K Q R B N P
black: k q r b n p
```

Each legal generated position has exactly one king of each color. Kings are never captured. A legal move must leave the moving side's king unattacked.

Sliding rays stop at the first occupied square. An opposing piece on that square is attacked/capturable; a friendly piece is defended/occupied and blocks squares beyond.

Knights jump. Kings attack adjacent squares even when they could not legally move there. Pawns attack diagonally forward and do not attack their forward-move square.

### Attack, pseudo-legal move, and legal move contract

These are separate:

```text
attacks(piece,square)
pseudoLegalMoves(position)
legalMoves(position)
```

An attacked square follows FIDE Article 3.1.3: a piece is considered to attack a square even if that piece cannot legally move there because doing so would expose or leave its own king in check. Therefore:

- a pinned knight still attacks its normal destination squares;
- a pinned pawn still attacks its diagonals;
- kings may not move adjacent because each king attacks the adjacent square;
- attacked-square queries must not be implemented by “generate the opponent's legal moves.”

A pseudo-legal move obeys piece movement, occupancy, promotion, and special-move preconditions but may leave its own king in check. A legal move is a pseudo-legal move whose resulting position leaves the mover's king unattacked.

The canonical legality algorithm is make move, update all state, test the mover's king, then unmake. Optimized pin/check masks may be used only if exhaustively equivalent.

### Check and game-state contract

The side to move is in check when its king square is attacked by one or more opposing pieces.

Legal check evasions are:

- move the king to a safe square;
- capture every checking piece with one move;
- interpose on the ray of a single sliding checker.

In double check, only a king move can evade both attacks.

Status:

```text
if legalMoves is empty and king attacked: checkmate
if legalMoves is empty and king not attacked: stalemate
otherwise: ongoing
```

A move that gives check is not necessarily forcing if the opponent has several legal evasions.

### Castling contract

Orthodox castling starts:

```text
White: Ke1 with Ra1/Rh1
Black: Ke8 with Ra8/Rh8
```

and ends:

```text
O-O:   king g-file, rook f-file
O-O-O: king c-file, rook d-file
```

Castling is legal only if:

- the corresponding castling right is present;
- the king and relevant rook occupy their required starting squares;
- all squares between them are empty;
- the king is not currently in check;
- the king's transit square and destination are not attacked.

The rook may be attacked. On queenside, `b1/b8` must be empty because it lies between rook and king, but it may be attacked because the king does not cross it.

Castling rights are historical state. Returning a moved king or rook to its original square does not restore a lost right. Capturing a rook on its original square removes that side's corresponding right.

### En passant contract

After a pawn advances two squares from its starting rank, the position may store the passed-over en-passant target square for the immediately following opposing move. An en-passant capture:

- moves the capturing pawn diagonally to the target;
- removes the just-moved pawn from the adjacent square;
- expires if not used immediately;
- is legal only if the resulting position leaves the capturing side's king safe.

Removing both pawns from their original files can reveal a rook/bishop/queen line; every en-passant move therefore receives the ordinary make-and-test legality check.

### Promotion contract

A pawn reaching the farthest rank must promote to `Q`, `R`, `B`, or `N` of its color as part of the move. Promotion choice affects move identity. Underpromotion is fully legal and must be included by the move generator.

### Position-state and FEN contract

The position record is:

```text
Position {
  board[64]
  sideToMove
  castlingRights
  enPassantTarget?
  halfmoveClock
  fullmoveNumber
}
```

FEN parsing/formatting supports all six fields. FEN's en-passant field is preserved as position metadata even when no legal capture exists; move generation still tests actual eligibility and king safety.

A repetition key includes:

- piece placement;
- side to move;
- castling possibilities;
- en-passant state only insofar as it changes legal move possibilities.

Halfmove/fullmove counters do not change repetition identity.

### Notation contract

Canonical coordinate move IDs use long algebraic/UCI-like form:

```text
e2e4
e7e8q
```

This is a semantic move identifier, not a claim about the UCI protocol.

SAN uses:

- `K Q R B N`; no letter for pawn;
- destination square;
- `x` for captures;
- required file/rank/both disambiguation;
- `O-O` and `O-O-O`;
- `=Q`, `=R`, `=B`, or `=N` for promotion;
- `+` for check and `#` for checkmate.

SAN is generated by enumerating legal moves in the pre-move position and analyzing the post-move position. The app accepts `0-0`/`0-0-0` as input aliases but renders letter `O`. Optional `e.p.`, annotations such as `!`, `?`, `!?`, check double-symbol `++`, and descriptive notation are excluded from graded answers.

### Draw-state contract

The app distinguishes:

- stalemate;
- dead position supplied by a trusted generator/oracle;
- claimable threefold repetition;
- automatic fivefold repetition;
- claimable fifty-move rule;
- automatic seventy-five-move rule.

Questions state whether they ask “may claim” or “game automatically ends.” A final checkmate takes precedence where the FIDE rule does. General dead-position detection is not inferred merely from a short “insufficient material” list; ordinary generated dead-position questions use reviewed exact classes or build-time proof.

### Tactical objective and material contract

Default material units:

```text
P=1, N=3, B=3, R=5, Q=9
```

Kings have no finite material value. Material is only a declared evaluation model; it does not decide mate, legality, or a general best move.

Tactical objectives are explicit:

```text
mate_within(k)
avoid_mate_within(k)
win_net_material_at_least(v, withinPlies)
promote_or_force_promotion(withinPlies)
force_draw(withinPlies)
best_under_supplied_leaf_evaluation(depth)
```

“Win material” counts the net change after the complete proof horizon and every best defense. Hanging-piece questions may use a one-ply safety model; longer exchanges state whether they stop at quiet leaves or use a bounded capture closure.

### Bounded calculation and proof contract

The local solver is a correctness engine, not a strength engine:

- generate every legal move;
- search every legal reply inside the objective horizon;
- use exact terminal status;
- use negamax/minimax over a declared lexicographic objective;
- retain all equally optimal moves;
- prefer faster mate and slower forced loss;
- use deterministic move ordering only for presentation, never to change the answer.

For `mate in N`, the solver proves that after the key move every legal defense permits mate within the remaining moves. If a defender can escape, the line is not forced. A displayed principal variation is illustrative and never substitutes for the reply-set proof.

For nonmate tactics, the position generator must provide:

- the objective and horizon;
- the accepted optimal move set;
- every opponent reply considered;
- a quiet/stable or explicitly scored leaf;
- a proof that a tempting distractor fails.

No open-ended “best move” question is allowed without a fully declared evaluation oracle.

### Runtime engine versus build-time validation

The standalone page may include:

- complete orthodox legal move generation;
- make/unmake and position hashing;
- attack maps;
- SAN/FEN parsing;
- bounded search normally no deeper than 7 plies and with a strict node cap;
- precomputed proof trees for larger but still short tactics.

It does not need to contain Stockfish or another strong chess engine. Development/build validation should cross-check:

- legal move counts against trusted perft fixtures;
- generated positions with an independent move generator;
- bounded mate/objective proofs with a pinned strong engine where its evaluation can express the same objective.

Engine agreement is not enough when the question's human-language objective is vague. The semantic proof contract remains decisive.

### Generated-position contract

Prefer positions built backward or constrained from an objective:

1. select a legal tactical/endgame skeleton;
2. place both kings legally;
3. add only pieces relevant to the lesson;
4. set side/history state;
5. verify position reachability policy;
6. enumerate legal moves and solve objective;
7. reject nonunique keys unless multiple answers are intended;
8. reject unintended earlier mates, stronger alternatives, or defensive resources;
9. generate motif labels and feedback from the proof tree.

Ordinary questions use positions that are legal and reachable from the initial position in principle. Artificial study positions may waive demonstrated game-history reconstruction but must still be legal under FIDE position constraints and labeled “constructed.”

### Scope

The topic includes:

- coordinates, square colors, rays, relative geometry, board orientation, piece placement, and FEN visualization;
- attacks and moves for every piece, blockers, x-rays, defenders, and attack maps;
- full legal move filtering, check, pins, double check, evasions, castling, en passant, promotion, mate, and stalemate;
- coordinate notation, SAN, disambiguation, check/mate suffixes, and FEN;
- forks, pins, skewers, discovered attacks/checks, double attacks, deflection, decoy, overloaded defenders, removing defenders, interference, and clearance;
- mate in one/two, bounded forcing lines, exchange calculation, zwischenzug, back-rank patterns, promotion races, quiet threats, perpetual checks, defense, and move order;
- board-memory updates and coordinate visualization over short sequences;
- material, activity, king safety, passed pawns, opposition, key squares, pawn races, simplification, and bounded evaluation;
- candidate moves, minimax/reply sets, mate distance, transpositions, repetition, objective proof, uniqueness, and engine/generator audits.

### Exclusions

The initial app does not include:

- opening-theory memorization, database popularity, named opening quizzes, or novelty claims;
- unrestricted middlegame “best move” positions whose answer is a centipawn preference;
- deep combinations, composed studies requiring long tablebase-like proof, or more than roughly seven runtime plies;
- strategic plans graded from free-form prose;
- rating estimates, player imitation, historical trivia, famous-game recall, or psychological advice;
- time-management advice based on tournament clock conditions;
- full endgame tablebases, engine tuning, neural-network evaluation, or search-programming internals;
- variants including Chess960, crazyhouse, atomic, antichess, or fairy pieces;
- live board capture, automatic analysis of an ongoing competitive game, account integration, or assistance intended to violate fair-play rules;
- claims that engine top choice is the only pedagogically valid move when several moves meet the stated objective.

### Global answer conventions

- Squares and moves are case-insensitive on input and rendered lowercase for coordinates.
- Piece letters in SAN render uppercase; harmless surrounding whitespace is ignored.
- Coordinate moves normalize promotion suffix case.
- Move sets are order-insensitive; move sequences and variations are ordered.
- A board-placement answer uses semantic piece/square pairs, not image pixels.
- SAN and coordinate move IDs are parsed to a legal move object before comparison.
- Check/mate suffix is required in SAN production families and optional only where the prompt explicitly says “move identity, not full SAN.”
- Multiple optimal moves are all accepted and shown.
- “Illegal,” “not attacked,” “not forced,” and “insufficient information under this evaluation” are first-class answers.
- Diagrams never hide whose turn, board orientation, castling rights, or en-passant state when relevant.

### Difficulty philosophy

Difficulty should increase through:

- moving from named coordinates to mental board transformations;
- more blockers, defenders, and x-ray relationships;
- pseudo-legal versus king-safe distinctions;
- special-rule state;
- fewer highlighted candidate squares;
- more legal replies and defensive resources;
- deeper but still short alternating calculation;
- quiet moves and move-order distinctions after forcing-move fluency;
- keeping a position updated across several plies;
- evaluating leaf positions instead of stopping at the first capture;
- proving uniqueness or retaining several valid answers.

It must not increase through dense irrelevant pieces, tiny boards, obscure opening positions, engine-only differences, hidden history state, arbitrary time pressure, long SAN transcription, or trick questions based on an unstated convention.

### Shared generation and rejection rules

Reject an instance when:

- either king is absent, kings are adjacent, or the side not to move is in check (which cannot arise after a legal preceding move);
- piece counts/pawn ranks violate the generator's reachability policy;
- castling or en-passant state contradicts required board/history facts;
- a target move is pseudo-legal but illegal;
- an attacked-square oracle accidentally uses legal moves;
- a SAN answer is ambiguous or incorrectly suffixed;
- a unique-answer family has several moves meeting the objective;
- a defense omitted from the explanation refutes the line;
- a material tactic ends at an unstable horizon that changes the answer under bounded capture extension;
- a motif label is present cosmetically but is not causal to the tactic;
- the rendered orientation leaks or changes coordinates;
- the learner must remember an unshown prior position to know rights/state;
- an engine score is used without an exact pedagogical objective;
- the position duplicates another active structural/proof signature.

## 2. Category: Board coordinates and visualization

### Category purpose

Build a stable internal board so later calculation is not consumed by coordinate lookup.

### Learn

Files are letters and ranks are numbers. `a1` is dark. Moving one file/rank changes square color; moving diagonally preserves it. Board orientation changes where a square appears on screen, never its name.

### Prerequisites

None.

### Category boundaries

This category locates and updates geometry. Piece attack rules begin in Category 3; notation syntax is consolidated in Category 5.

### Subcategories

1. Square identity and color
2. Rays and relative geometry
3. Orientation and placement
4. FEN-backed visualization and audits

### Common misconceptions

- File/rank order is reversed.
- Flipping the board renames squares.
- Diagonal movement changes square color.
- Knight geometry can be inferred as a ray.
- FEN placement digits count files rather than empty squares.

### Family `board_square_locate`

**Task.** Locate a named square or name a highlighted square. **Response/template.** Square selection/text.

**Derivation.** Convert file/rank indexes under logical coordinates; render orientation separately. **Difficulty.** L1 White-bottom edge; L2 center; L3 Black-bottom.

**Misconceptions/constraints.** Orientation is visibly labeled. **Feedback.** Trace file then rank.

**Examples.** 1. file e, rank4 → `e4`. L1. 2. highlighted center-left square → semantic coordinate. L2. 3. `a1` remains `a1` with Black at bottom. L2.

**Validation/coverage.** All 64 squares and both orientations.

### Family `board_square_color`

**Task.** Determine whether a square is light or dark. **Response/template.** Two-choice.

**Derivation.** `a1` dark and parity formula. **Difficulty.** L1 anchors; L2 arbitrary; L3 compare several without board.

**Misconceptions/constraints.** Visual theme colors do not define semantic light/dark. **Feedback.** Show parity/diagonal relationship.

**Examples.** 1. `a1` → dark. L1. 2. `h1` → light. L2. 3. `c3` → dark because same-color diagonal from a1. L2.

**Validation/coverage.** Exhaustive parity.

### Family `board_relative_square`

**Task.** Apply file/rank displacement or recover origin/displacement. **Response/template.** Square/vector.

**Derivation.** Add index offsets and reject off-board results. **Difficulty.** L1 one axis; L2 diagonal; L3 inverse/off-board.

**Misconceptions/constraints.** “White forward” and “Black forward” expand to signed rank offset. **Feedback.** Show coordinate arithmetic.

**Examples.** 1. two files right from c4 → e4. L1. 2. one White-forward and left from e5 → d6. L2. 3. two right from h4 → off board. L2.

**Validation/coverage.** Index bounds and inverse relationships.

### Family `board_ray_squares`

**Task.** List squares on a rank/file/diagonal ray to edge or blocker. **Response/template.** Ordered square sequence.

**Derivation.** Repeatedly add one legal ray direction until edge/declared blocker. **Difficulty.** L1 orthogonal; L2 diagonal; L3 stop/include blocker policy.

**Misconceptions/constraints.** Order begins nearest square; occupied terminal included only when prompt says attack ray. **Feedback.** Animate one step.

**Examples.** 1. north from d4 → d5,d6,d7,d8. L1. 2. southwest from f6 → e5,d4,c3,b2,a1. L2. 3. blocker on d6 truncates north ray. L2.

**Validation/coverage.** Direction/index oracle.

### Family `board_knight_geometry`

**Task.** Visualize knight destinations or determine whether two squares are a knight move apart. **Response/template.** Square set/yes-no.

**Derivation.** Apply offsets `(±1,±2)` and `(±2,±1)`, filter board. **Difficulty.** L1 center; L2 edge; L3 reverse relation.

**Misconceptions/constraints.** Occupancy is ignored in geometry-only form and shown when move legality matters. **Feedback.** Show bounding 2×3 rectangles.

**Examples.** 1. e4→f6 is knight geometry. L1. 2. a1 has b3,c2. L2. 3. e4→g5 yes; e4→g6 no. L2.

**Validation/coverage.** All square pairs.

### Family `board_piece_relation`

**Task.** Classify two squares as same rank/file/diagonal/knight/none and measure separation. **Response/template.** Relation plus distance.

**Derivation.** Compare file/rank deltas. **Difficulty.** L1 clear line; L2 anti-diagonal; L3 multiple descriptors/nearest steps.

**Misconceptions/constraints.** Same-color squares need not share one diagonal. **Feedback.** Show deltas.

**Examples.** 1. a1–a8 → same file,7 steps. L1. 2. c2–f5 → diagonal,3 steps. L1. 3. a1–h3 → none. L2.

**Validation/coverage.** Exhaust all square-pair relations.

### Family `board_orientation_map`

**Task.** Map screen row/column to square under White- or Black-bottom orientation. **Response/template.** Square.

**Derivation.** Apply view transform only; logical coordinates unchanged. **Difficulty.** L1 corners; L2 arbitrary; L3 switch orientations.

**Misconceptions/constraints.** Coordinates on labels remain visible at early levels. **Feedback.** Rotate display 180° while pinning IDs.

**Examples.** 1. White-bottom lower-left → a1. L1. 2. Black-bottom lower-left → h8. L2. 3. e4's logical ID unchanged after flip. L2.

**Validation/coverage.** Bijection over 64 cells/orientations.

### Family `board_place_pieces`

**Task.** Construct a board from a piece-square list or recover the list from a board. **Response/template.** Piece placement grid/list.

**Derivation.** Map stable piece IDs to distinct squares. **Difficulty.** L1 kings+one piece; L2 several; L3 flipped board.

**Misconceptions/constraints.** Both kings included; no duplicate square. **Feedback.** Place one semantic pair at a time.

**Examples.** 1. `White: Ke1,Qd1; Black: Ke8` → board. L1. 2. read `n` on f6 → black knight f6. L1. 3. reconstruct six-piece flipped diagram. L3.

**Validation/coverage.** Placement round-trip.

### Family `board_fen_placement`

**Task.** Decode or encode the board-placement field of FEN. **Response/template.** Board/placement string.

**Derivation.** Read ranks 8→1; digits advance that many empty squares; `/` ends rank. **Difficulty.** L2 sparse ranks; L3 mixed runs; L4 encode.

**Misconceptions/constraints.** Only first FEN field here; full state in Category 5. **Feedback.** Expand each rank to eight cells.

**Examples.** 1. `8/8/8/8/8/8/8/K6k` → kings a1,h1. L2. 2. `3q4` on a rank → queen at file d. L2. 3. encode an eight-rank placement. L3.

**Validation/coverage.** Each rank expands exactly eight and round-trips.

### Family `board_visualization_audit`

**Task.** Diagnose a coordinate, color, ray, orientation, or FEN-placement error. **Response/template.** Fault selection and correction.

**Derivation.** Compare with coordinate/placement oracle. **Difficulty.** L1 swapped file/rank; L2 ray/orientation; L3 FEN drift.

**Misconceptions/constraints.** One primary error. **Feedback.** Identify first incorrect square.

**Examples.** 1. `e4` interpreted file4/rank e → swapped. L1. 2. board flip renames a1 to h8 → false. L2. 3. FEN digit treated as one empty square → rank shift. L2.

**Validation/coverage.** Mutation suite across visualization rules.

### Cross-family progression

Locate and color squares first. Relative movement precedes rays/knights. Orientation changes only after semantic coordinates are stable; FEN placement and audits end the category.

## 3. Category: Piece movement and attack maps

### Category purpose

Build exact attack geometry with blockers, occupancy, defense, and x-rays.

### Learn

Attacks are not the same as legal moves. Pawns attack diagonally but move forward. Sliding pieces stop at the first occupied square. A pinned piece still attacks according to its movement geometry even when moving would be illegal.

### Prerequisites

Board coordinates, rays, knight offsets, and piece names.

### Category boundaries

This category computes attacks/pseudo-movement without filtering self-check. Full legality is Category 4.

### Subcategories

1. Pawn, knight, and king geometry
2. Sliding pieces and blockers
3. Attack/defense maps and x-rays
4. Attack audits

### Common misconceptions

- Pawns attack forward.
- Knights are blocked by intervening pieces.
- Friendly occupied squares are not defended.
- Sliding attacks continue beyond the first occupied square.
- A pinned piece attacks nothing.
- Attack maps can be built from legal moves.

### Family `attack_pawn_moves`

**Task.** List pseudo-legal noncapture pawn advances. **Response/template.** Square set.

**Derivation.** One forward if empty; two from starting rank if both empty; promotion variants handled later. **Difficulty.** L1 one step; L2 double/blocker; L3 color/orientation.

**Misconceptions/constraints.** Forward direction follows color, not display. **Feedback.** Mark move and attack directions separately.

**Examples.** 1. white pawn e2 clear → e3,e4. L1. 2. blocker e3 → none. L2. 3. black pawn c7 clear → c6,c5. L2.

**Validation/coverage.** All pawn ranks/colors/block states.

### Family `attack_pawn_attacks`

**Task.** List squares attacked by a pawn regardless of occupancy. **Response/template.** Square set.

**Derivation.** White `(±1,+1)`; Black `(±1,-1)`; filter board. **Difficulty.** L1 center; L2 edge; L3 pinned pawn contrast.

**Misconceptions/constraints.** Empty diagonals are attacked; forward square is not. **Feedback.** Overlay attack arrows.

**Examples.** 1. white e4 → d5,f5. L1. 2. black a7 → b6. L2. 3. pinned white e5 still attacks d6,f6. L3.

**Validation/coverage.** Exhaustive square/color.

### Family `attack_knight`

**Task.** List knight attacks with friendly/enemy occupancy classification. **Response/template.** attacked squares and pseudo-destinations.

**Derivation.** Offset geometry; all on-board targets attacked, friendly target not movable, enemy target capturable. **Difficulty.** L1 empty; L2 occupied; L3 pinned contrast.

**Misconceptions/constraints.** Intervening pieces irrelevant. **Feedback.** Label attacked/available/capture.

**Examples.** 1. knight d4 empty board → eight attacks. L1. 2. friendly piece f5 remains defended but not a move. L2. 3. pinned knight still attacks squares though legal moves may be none. L3.

**Validation/coverage.** Geometry and occupancy partition.

### Family `attack_bishop`

**Task.** Trace bishop attacks and pseudo-moves through blockers. **Response/template.** Ordered rays/square set.

**Derivation.** Four diagonal rays; include first occupied square as attacked, then stop; friendly not movable. **Difficulty.** L1 empty; L2 mixed blockers; L3 x-ray precursor.

**Misconceptions/constraints.** Bishop stays on square color. **Feedback.** Trace each ray independently.

**Examples.** 1. bishop c1 empty diagonals → ray squares. L1. 2. friendly e3 stops ray and is defended. L2. 3. enemy b2 attacked/capturable, a3 beyond not attacked. L2.

**Validation/coverage.** Ray oracle.

### Family `attack_rook`

**Task.** Trace rook attacks and pseudo-moves on ranks/files. **Response/template.** Ray/square set.

**Derivation.** Four orthogonal rays with first-occupant rule. **Difficulty.** L1 empty; L2 blockers; L3 several occupancy roles.

**Misconceptions/constraints.** Castling is not a rook move family. **Feedback.** Project file/rank.

**Examples.** 1. rook d4 empty → 14 attacks. L1. 2. friendly d6 defended and blocks d7/d8. L2. 3. enemy a4 capturable and blocks beyond edge. L2.

**Validation/coverage.** Ray oracle and count bounds.

### Family `attack_queen`

**Task.** Compute queen attacks/pseudo-moves as rook plus bishop geometry. **Response/template.** Square set/ray classification.

**Derivation.** Union eight sliding rays with first-occupant rule. **Difficulty.** L1 sparse; L2 blockers; L3 identify relevant ray only.

**Misconceptions/constraints.** Do not jump blockers. **Feedback.** Decompose orthogonal/diagonal.

**Examples.** 1. queen d4 empty → 27 attacked squares. L1. 2. mixed friendly/enemy blockers truncate rays. L2. 3. target g7 lies on northeast diagonal. L2.

**Validation/coverage.** Union equals rook+bishop attack sets.

### Family `attack_king`

**Task.** List king attacks and distinguish them from legal king moves. **Response/template.** Attack/pseudo-destination sets.

**Derivation.** Eight adjacent offsets, board/occupancy filter for moves; attack includes friendly occupied adjacent. **Difficulty.** L1 center; L2 edge/occupancy; L3 enemy-king adjacency contrast.

**Misconceptions/constraints.** Opponent attacks are ignored until legal-move family. **Feedback.** Separate geometry from safety.

**Examples.** 1. king d4 empty → eight attacks. L1. 2. king a1 → three. L2. 3. friendly d5 is defended but not a destination. L2.

**Validation/coverage.** Exhaustive square/occupancy.

### Family `attack_square_map`

**Task.** Identify all attackers of a square or all squares attacked by a side. **Response/template.** Piece/square set.

**Derivation.** Union piece attack functions, independent of side's king safety. **Difficulty.** L2 one target; L3 full map/multiple attackers; L4 pinned pieces.

**Misconceptions/constraints.** Pawn/king attack semantics exact. **Feedback.** Draw arrows from every attacker.

**Examples.** 1. find attackers of e5. L2. 2. square attacked twice records both pieces. L2. 3. pinned bishop contributes its geometric attacks. L3.

**Validation/coverage.** Forward union/reverse attacker cross-check.

### Family `attack_xray`

**Task.** Identify a latent sliding attack revealed by removing/moving one blocker. **Response/template.** attacker, blocker, target.

**Derivation.** Trace ray beyond first blocker to next relevant piece. **Difficulty.** L2 one blocker; L3 two blockers; L4 distinguish same/opposite color.

**Misconceptions/constraints.** X-ray is a relationship, not yet a legal tactic. **Feedback.** Show current and revealed rays.

**Examples.** 1. rook–piece–king on file → rook x-rays king through piece. L2. 2. bishop behind own piece points at enemy queen. L2. 3. second blocker prevents immediate revealed attack. L3.

**Validation/coverage.** Remove-one-piece attack recomputation.

### Family `attack_defenders`

**Task.** Count/list attackers and defenders of an occupied square/piece. **Response/template.** Two piece sets.

**Derivation.** Use attack map from each color; occupancy does not suppress friendly defense of terminal square. **Difficulty.** L1 one each; L2 several; L3 pinned defender distinction.

**Misconceptions/constraints.** “Defended” does not guarantee capture is bad or defender can legally recapture. **Feedback.** Mark geometric defense and legal recapture separately when relevant.

**Examples.** 1. knight protects friendly pawn → one defender. L1. 2. rook attacks pawn and bishop defends it. L2. 3. pinned defender geometrically defends but legal recapture may fail. L3.

**Validation/coverage.** Attack sets exact.

### Family `attack_line_blocker`

**Task.** Determine which piece blocks a sliding line or where an interposition could block it geometrically. **Response/template.** Piece/square set.

**Derivation.** Ordered ray between endpoints, excluding endpoints. **Difficulty.** L1 one blocker; L2 several candidate interpose squares; L3 noncollinear.

**Misconceptions/constraints.** Knight/pawn checks cannot be blocked. **Feedback.** Highlight between-squares.

**Examples.** 1. rook a1 to king a8 has between a2..a7. L1. 2. first occupied a4 is blocker. L1. 3. bishop c3 and king g7 have d4,e5,f6 interpose squares. L2.

**Validation/coverage.** Ray-between oracle.

### Family `attack_map_audit`

**Task.** Diagnose a pawn, blocker, king, pinned-piece, or attack/legality error. **Response/template.** Fault selection and correction.

**Derivation.** Compare with independent attack oracle. **Difficulty.** L1 movement confusion; L2 blocker/friendly square; L3 pin/king.

**Misconceptions/constraints.** One primary error. **Feedback.** State attack rule without invoking legal move generation.

**Examples.** 1. pawn said to attack forward → wrong. L1. 2. rook attack passes through friendly piece → wrong. L2. 3. pinned knight removed from attack map → wrong. L3.

**Validation/coverage.** Mutation suite for each piece and occupancy state.

### Cross-family progression

Pawns are split into move and attack rules first. Leapers precede sliders, then queen union. Full attack maps, x-rays, defense, blockers, and audits combine the geometry.

## 4. Category: Legal moves, check, and special rules

### Category purpose

Train complete legality filtering and terminal-state recognition, including history-dependent special moves.

### Learn

Legal moves are generated from pseudo-legal moves by making each move and checking the mover's king. A move can obey its piece rule and still be illegal because it exposes check. En passant and castling require position state beyond piece placement.

### Prerequisites

Piece attacks, blockers, board state, and side to move.

### Category boundaries

This category decides legal move identity and game status. SAN spelling belongs in Category 5; tactics begin in Category 6.

### Subcategories

1. Self-check, pins, and king safety
2. Checks and evasions
3. Castling, en passant, and promotion
4. Mate, stalemate, move counts, and audits

### Common misconceptions

- A pseudo-legal piece move is automatically legal.
- Capturing the checking piece always resolves check.
- A pinned piece attacks no squares.
- Double check can be blocked or answered by capturing one checker with another piece.
- Castling is legal through check if the destination is safe.
- En passant cannot expose the king because the capturing pawn leaves the file.

### Family `legal_pseudo_vs_legal`

**Task.** Classify a candidate as illegal by movement, pseudo-legal but self-checking, or fully legal. **Response/template.** Three-way choice.

**Derivation.** Validate move form/occupancy, make move, test mover's king. **Difficulty.** L1 blocked/wrong pattern; L2 exposed line; L3 special state.

**Misconceptions/constraints.** Reason field required in feedback. **Feedback.** Show board after move.

**Examples.** 1. bishop moves orthogonally → movement-illegal. L1. 2. pinned rook moves off king file → pseudo-legal but illegal. L2. 3. safe knight move → legal. L1.

**Validation/coverage.** Move generator classification partition.

### Family `legal_check_attackers`

**Task.** Determine whether side to move is in check and list all checking pieces. **Response/template.** Check yes/no plus piece set.

**Derivation.** Query opponent attack map at king square. **Difficulty.** L1 direct slider; L2 knight/pawn; L3 double/discovered.

**Misconceptions/constraints.** Never “capture king.” **Feedback.** Draw each checking ray/jump.

**Examples.** 1. rook on same open file → check. L1. 2. pawn diagonal attacks king → check. L2. 3. two simultaneous attackers → double check. L3.

**Validation/coverage.** Reverse attackers of king square.

### Family `legal_check_evasions`

**Task.** Enumerate or classify all legal responses to a single check. **Response/template.** Move set grouped king/capture/block.

**Derivation.** Generate all legal moves and retain those; categorize by effect on checker/ray/king. **Difficulty.** L2 few options; L3 pinned capturer/interpositions; L4 exact complete set.

**Misconceptions/constraints.** A block square must be reachable legally. **Feedback.** Test each evasion class.

**Examples.** 1. knight check → king move or capture checker, never interpose. L2. 2. rook ray may allow block. L2. 3. apparent defender pinned to king cannot capture checker. L3.

**Validation/coverage.** Complete legal move set while in check.

### Family `legal_absolute_pin`

**Task.** Identify an absolute pin and the pinned piece's legal moves. **Response/template.** attacker/pinned/king plus move set.

**Derivation.** Remove/move candidate and test revealed king attack; legal along-line moves/captures may remain. **Difficulty.** L2 simple; L3 pinned slider can move on ray; L4 multiple attackers.

**Misconceptions/constraints.** Pinned does not always mean immobile. **Feedback.** Show ray and safe remaining squares.

**Examples.** 1. bishop pins knight to king → knight has no legal moves. L2. 2. rook pinned on file may slide while continuing to shield. L3. 3. pinned piece may capture pinning piece if resulting king safe. L3.

**Validation/coverage.** Per-candidate make/test.

### Family `legal_king_destination`

**Task.** Determine which adjacent king moves are legal. **Response/template.** Square set.

**Derivation.** Filter board/friendly occupancy; make king move/capture; recompute opponent attacks in resulting position. **Difficulty.** L1 sparse; L2 defended capture; L3 discovered/x-ray after king capture.

**Misconceptions/constraints.** Opponent king attacks adjacent squares; captured piece removal may reveal slider. **Feedback.** Show post-move attack map.

**Examples.** 1. empty unattacked square → legal. L1. 2. enemy piece defended → capture illegal. L2. 3. king capture removes blocker and reveals rook → illegal. L3.

**Validation/coverage.** Legal generator and post-move attack.

### Family `legal_double_check`

**Task.** Recognize double check and enumerate legal response type/moves. **Response/template.** Checker set and king-move set.

**Derivation.** Count attackers; when at least two, filter legal king moves only. **Difficulty.** L2 obvious; L3 discovered double check; L4 tempting capture/block.

**Misconceptions/constraints.** A king move may capture one checker only if destination safe from the other. **Feedback.** Keep both attack overlays visible.

**Examples.** 1. rook+bishop both check → double. L2. 2. blocking rook line leaves bishop check → illegal. L2. 3. king captures adjacent checker but lands on other ray → illegal. L3.

**Validation/coverage.** Checker cardinality and legal response assertion.

### Family `legal_en_passant`

**Task.** Determine whether an en-passant capture exists and is legal. **Response/template.** Move/illegal reason.

**Derivation.** Verify target/history adjacency, make capture including removal, test own king. **Difficulty.** L2 ordinary; L3 expired/wrong target; L4 exposed line.

**Misconceptions/constraints.** FEN target alone does not bypass eligibility. **Feedback.** Show all three changed squares.

**Examples.** 1. white pawn e5, black just d7-d5 → `exd6 e.p.` geometrically available. L2. 2. one intervening move → expired. L2. 3. removing e5/d5 opens rook line to white king → illegal. L4.

**Validation/coverage.** Make/unmake and history fixtures.

### Family `legal_castling`

**Task.** Determine whether each castling move is legal and why. **Response/template.** Side/status/reason.

**Derivation.** Apply rights, required pieces, empty-between, and king-square attack tests. **Difficulty.** L2 clear; L3 through check/history; L4 queenside b-square distinction.

**Misconceptions/constraints.** Rook attack irrelevant; destination and transit relevant. **Feedback.** Checklist every condition.

**Examples.** 1. right present, path clear/safe → O-O legal. L2. 2. f1 attacked → White O-O illegal. L3. 3. b1 attacked but c1/d1/e1 safe and b1 empty → O-O-O may be legal. L4.

**Validation/coverage.** Exhaust rights/occupancy/attack combinations.

### Family `legal_promotion`

**Task.** Enumerate legal promotion moves or choose a promotion satisfying a short objective. **Response/template.** Move set/piece.

**Derivation.** Generate Q/R/B/N for legal forward/capture arrival; analyze resulting check/stalemate where asked. **Difficulty.** L2 quiet/capture; L3 underpromotion; L4 avoid stalemate/mate.

**Misconceptions/constraints.** Promotion mandatory; four types. **Feedback.** Show resulting piece/position for each.

**Examples.** 1. a7-a8 yields a8Q/R/B/N moves. L2. 2. b7xc8 promotes while capturing. L2. 3. knight promotion gives required fork/check where queen does not meet objective. L4.

**Validation/coverage.** Four move identities and post-state.

### Family `legal_checkmate`

**Task.** Decide whether a position/move is checkmate. **Response/template.** Yes/no plus checking/evasion summary.

**Derivation.** Side to move attacked and legal move count zero. **Difficulty.** L1 boxed king; L2 capture/block resources; L3 apparent mate refuted.

**Misconceptions/constraints.** “Looks trapped” insufficient. **Feedback.** Enumerate king, capture, block candidates.

**Examples.** 1. checked king with no legal moves → mate. L1. 2. one legal interposition → not mate. L2. 3. checking piece capturable by unpinned defender → not mate. L3.

**Validation/coverage.** Terminal status oracle.

### Family `legal_stalemate`

**Task.** Distinguish stalemate, checkmate, and ongoing. **Response/template.** Status.

**Derivation.** Test check then legal move count. **Difficulty.** L1 classic bare king; L2 hidden pawn move/capture; L3 constructed boundary.

**Misconceptions/constraints.** Stalemated side is not in check. **Feedback.** Show attack map and all candidate moves.

**Examples.** 1. no legal moves and not checked → stalemate. L1. 2. no legal moves and checked → checkmate. L1. 3. one legal pawn move → ongoing. L2.

**Validation/coverage.** Status partition.

### Family `legal_move_count`

**Task.** Count or enumerate every legal move in a small position. **Response/template.** Integer/move set.

**Derivation.** Full legal generator including promotions/special moves. **Difficulty.** L1 lone/sparse king; L2 pins/check; L3 special moves.

**Misconceptions/constraints.** Positions kept small; counting is about completeness, not tedium. **Feedback.** Group by piece and rejection reason.

**Examples.** 1. corner king with declared attacks → count safe moves. L1. 2. pinned piece pseudo-moves excluded. L2. 3. promotion contributes four move identities. L3.

**Validation/coverage.** Independent generator/perft-depth1.

### Family `legal_move_audit`

**Task.** Diagnose a legal-move list/status error. **Response/template.** Missing/extraneous move and reason.

**Derivation.** Diff proposal against legal generator and special-state rules. **Difficulty.** L1 blocker; L2 pin/check; L3 castling/en-passant/promotion.

**Misconceptions/constraints.** One injected primary error. **Feedback.** Make the disputed move and test king/state.

**Examples.** 1. illegal king move into pawn attack included. L2. 2. castle through attacked transit included. L3. 3. en passant exposing rook check included. L4.

**Validation/coverage.** Mutation suite for every legality rule.

### Cross-family progression

Pseudo-versus-legal and check detection precede evasions. Pins/king safety lead to double check. En passant, castling, and promotion come before mate/stalemate and complete move-set audits.

## 5. Category: Chess notation and position representation

### Category purpose

Make move/position notation a transparent representation of legal chess facts rather than a separate memorization burden.

### Learn

Coordinate notation identifies origin and destination directly. SAN describes the moving piece, necessary disambiguation, capture, destination, promotion, and resulting check/mate. FEN stores a complete position state, not only the visible pieces.

### Prerequisites

Coordinates, legal move generation, check/mate, castling, en passant, and promotion.

### Category boundaries

This category encodes/decodes already understood moves and positions. It does not teach PGN tags, comments, variations, results, or database formats.

### Subcategories

1. Coordinate moves
2. SAN generation and interpretation
3. Full FEN state
4. Notation audits

### Common misconceptions

- Coordinate origin/destination order follows the moving color's view.
- SAN always includes an origin square.
- Any two same-type pieces require disambiguation, even when only one can move legally.
- `+` means capture.
- FEN castling rights can be derived safely from current piece placement.

### Family `notation_coordinate_move`

**Task.** Encode/decode a legal move as origin+destination+promotion suffix. **Response/template.** Move text or board arrow.

**Derivation.** Map legal move object to lowercase squares and optional `q/r/b/n`. **Difficulty.** L1 ordinary; L2 capture; L3 promotion.

**Misconceptions/constraints.** Coordinate form does not mark capture/check. **Feedback.** Highlight origin/destination.

**Examples.** 1. pawn e2 to e4 → `e2e4`. L1. 2. knight f3 captures e5 → `f3e5`. L1. 3. e7-e8 knight promotion → `e7e8n`. L2.

**Validation/coverage.** Parse to unique legal move and round-trip.

### Family `notation_san_generate`

**Task.** Produce SAN for a supplied legal move. **Response/template.** Constrained short text.

**Derivation.** Enumerate legal competitors, add piece/disambiguation/capture/destination/promotion, then post-move check suffix. **Difficulty.** L1 pawn/piece; L2 capture/check; L3 disambiguation/promotion.

**Misconceptions/constraints.** Full SAN exact except accepted castling zero alias. **Feedback.** Build SAN field by field.

**Examples.** 1. knight g1-f3 → `Nf3`. L1. 2. pawn e4 captures d5 with check → `exd5+`. L2. 3. promotion capturing on g8 with mate → `fxg8=Q#`. L3.

**Validation/coverage.** Legal-move SAN round-trip.

### Family `notation_san_decode`

**Task.** Identify the legal move denoted by SAN. **Response/template.** Board move/origin-destination.

**Derivation.** Parse tokens and filter pre-position legal moves to exactly one matching object/post-state. **Difficulty.** L1 ordinary; L2 capture/check; L3 disambiguation.

**Misconceptions/constraints.** Reject SAN that does not match actual check/mate status. **Feedback.** Apply each SAN constraint.

**Examples.** 1. `Bb5+` → legal bishop move to b5 giving check. L1. 2. `Raxd1` selects a-file rook. L3. 3. `O-O` maps king/rook move. L2.

**Validation/coverage.** Parser returns exactly one move.

### Family `notation_check_suffix`

**Task.** Determine whether SAN needs no suffix, `+`, or `#`. **Response/template.** Three-way choice.

**Derivation.** Make move; test opponent king attacked and legal move count. **Difficulty.** L1 direct check; L2 discovered; L3 apparent mate with defense.

**Misconceptions/constraints.** Double check still uses `+` unless mate. **Feedback.** Show checking pieces and defenses.

**Examples.** 1. move gives no check → no suffix. L1. 2. rook move opens bishop check → `+`. L2. 3. checked opponent has no legal moves → `#`. L2.

**Validation/coverage.** Post-state status.

### Family `notation_disambiguation`

**Task.** Choose required SAN origin file/rank/both for same-type movers. **Response/template.** SAN prefix/full move.

**Derivation.** Among legal moves by same-color same-type pieces to destination, use file if it distinguishes, else rank, else both. **Difficulty.** L2 file; L3 rank/both; L4 pseudo-legal competitor excluded by pin.

**Misconceptions/constraints.** Only legal competing movers count. **Feedback.** List competitor origins.

**Examples.** 1. knights b1/f1 can reach d2 → `Nbd2`/`Nfd2`. L2. 2. same-file rooks require rank. L3. 3. geometrically competing pinned knight is illegal, so no disambiguation. L4.

**Validation/coverage.** Exhaust legal competitor set.

### Family `notation_special_san`

**Task.** Encode castling, promotion, and en-passant captures in SAN. **Response/template.** SAN text.

**Derivation.** Apply SAN special tokens and post-state suffix. **Difficulty.** L2 castling; L3 promotion capture/check; L4 en passant SAN.

**Misconceptions/constraints.** Render `O`, accept `0`; `e.p.` not required/graded. **Feedback.** Show semantic move then SAN.

**Examples.** 1. kingside castling → `O-O`. L1. 2. queenside castling with check → `O-O-O+`. L2. 3. `exd6` may denote en passant without suffix. L3.

**Validation/coverage.** SAN parser/generator round-trip.

### Family `notation_full_fen`

**Task.** Decode or construct all six FEN fields for a small position. **Response/template.** Structured fields/full string.

**Derivation.** Encode placement, side, castling letters/`-`, ep target/`-`, halfmove, fullmove. **Difficulty.** L2 placement+side; L3 rights/ep; L4 counters.

**Misconceptions/constraints.** FEN ep metadata versus legal ep capture distinguished. **Feedback.** Label each field.

**Examples.** 1. `w - - 0 1` means White, no rights/ep. L2. 2. `Kq` means White kingside and Black queenside rights. L3. 3. ep target `d6` may exist even if no pawn can legally capture. L3.

**Validation/coverage.** Parse/format round-trip and legal-state validation.

### Family `notation_audit`

**Task.** Find the first SAN, coordinate, or FEN error. **Response/template.** Token/field selection and correction.

**Derivation.** Compare parsed representation with legal move/position. **Difficulty.** L1 square order; L2 capture/check; L3 disambiguation/state.

**Misconceptions/constraints.** One primary error. **Feedback.** State violated representation rule.

**Examples.** 1. pawn SAN `Pe4` → `e4`. L1. 2. checking move lacks `+` → incomplete SAN. L2. 3. FEN claims K right after king has moved in supplied history → inconsistent. L3.

**Validation/coverage.** Notation mutation suite.

### Cross-family progression

Coordinate moves precede SAN. Basic SAN generation/decoding comes before suffix and disambiguation. Special SAN and complete FEN conclude with audits.

## 6. Category: Tactical relationships and motifs

### Category purpose

Train recognition of concrete tactical mechanisms and the pieces/squares that make them work.

### Learn

A motif is useful only when its geometry and legal consequences are real. A pin restricts movement because of a more valuable piece behind; a skewer attacks the valuable piece first; deflection removes a defender from its duty. Always verify the follow-up.

### Prerequisites

Attacks, legal moves, checks, defenders, x-rays, and material values.

### Category boundaries

This category identifies one tactical mechanism in a position or one move. Multi-ply proof and best defense are Category 7.

### Subcategories

1. Loose pieces and multiple attacks
2. Line motifs
3. Defender manipulation
4. Clearance/interference and audits

### Common misconceptions

- Any attacked piece is hanging.
- Any aligned king/piece is pinned.
- Forks must be delivered by knights.
- Pins always win the pinned piece.
- A decoy and deflection are identical descriptions.
- A motif name proves the combination works.

### Family `tactic_hanging_piece`

**Task.** Identify a piece that can be captured without adequate tactical recapture under the stated one-ply model. **Response/template.** Piece/move set.

**Derivation.** Enumerate legal captures; compare immediate material and legal recaptures under declared safety model. **Difficulty.** L1 undefended; L2 pinned defender; L3 poisoned apparent target.

**Misconceptions/constraints.** “Attacked more than defended” is not sufficient. **Feedback.** Show capture/recapture legality.

**Examples.** 1. undefended queen legally capturable → hanging. L1. 2. geometric defender pinned and cannot recapture → hanging. L2. 3. defended pawn whose capture loses queen → not hanging under model. L3.

**Validation/coverage.** Bounded capture oracle.

### Family `tactic_fork`

**Task.** Identify or create a legal move attacking at least two valuable targets. **Response/template.** Move, forking piece, targets.

**Derivation.** Make move; compute attack set and target values/check status. **Difficulty.** L1 knight; L2 pawn/queen; L3 one target is king/defender can respond.

**Misconceptions/constraints.** Follow-up must meet declared gain objective when asked. **Feedback.** Draw attack arrows.

**Examples.** 1. knight move checks king and attacks queen → fork. L1. 2. pawn advances attacking two pieces → pawn fork. L2. 3. queen attacks rook/bishop but is capturable → geometric fork, not winning tactic. L3.

**Validation/coverage.** Post-move attacks and bounded outcome.

### Family `tactic_pin`

**Task.** Identify absolute/relative pin components and legal restriction. **Response/template.** attacker, pinned piece, rear target, type.

**Derivation.** Collinear ray with middle piece; removal reveals attack; absolute if rear target king. **Difficulty.** L1 absolute; L2 relative; L3 pinned slider retains line moves.

**Misconceptions/constraints.** Pinned piece still attacks. **Feedback.** Remove middle piece visually.

**Examples.** 1. bishop–knight–king → absolute pin. L1. 2. rook–bishop–queen → relative pin. L2. 3. pinned rook moves along pin line legally. L3.

**Validation/coverage.** Ray/removal/legal move oracle.

### Family `tactic_skewer`

**Task.** Identify a skewer and expected follow-up. **Response/template.** attacker, front target, rear target.

**Derivation.** Sliding attack forces/induces front valuable piece to move, revealing rear target. **Difficulty.** L2 king-front; L3 relative; L4 verify escape.

**Misconceptions/constraints.** If front target can solve attack while protecting rear, gain may not be forced. **Feedback.** Show pre/post ray.

**Examples.** 1. bishop checks king with rook behind → absolute skewer. L2. 2. rook attacks queen with bishop behind → relative skewer. L2. 3. front piece can capture attacker → motif fails tactically. L3.

**Validation/coverage.** Legal reply/follow-up check.

### Family `tactic_discovered_attack`

**Task.** Identify/create an attack revealed by moving an intervening piece. **Response/template.** move, revealed attacker, target.

**Derivation.** Compare attack maps before/after mover vacates ray. **Difficulty.** L2 simple; L3 mover creates second threat; L4 legality.

**Misconceptions/constraints.** Revealed slider must have open line after move. **Feedback.** Overlay changed ray.

**Examples.** 1. knight moves off bishop-queen diagonal → discovered attack. L2. 2. mover also attacks rook → double threat. L3. 3. vacating piece exposes own king → move illegal. L3.

**Validation/coverage.** Attack-set delta and legality.

### Family `tactic_discovered_check`

**Task.** Identify/create discovered or double check. **Response/template.** move and checker set.

**Derivation.** Make move; compare king attackers; discovered slider newly checks, mover may also check. **Difficulty.** L2 discovered; L3 double; L4 special capture.

**Misconceptions/constraints.** Double check response limited to king. **Feedback.** Show both checker paths.

**Examples.** 1. bishop moves off rook file revealing check. L2. 2. moved bishop also checks → double check. L3. 3. en passant can reveal a rook check in a legal constructed case. L4.

**Validation/coverage.** Post-move checker set.

### Family `tactic_double_attack`

**Task.** Identify a move that creates two independent threats, including non-fork forms. **Response/template.** Move and threat pair.

**Derivation.** Analyze post-move legal checks/captures/mate threats under one-ply objective. **Difficulty.** L2 direct attacks; L3 discovered+direct; L4 threat verification.

**Misconceptions/constraints.** Two arrows to low-value pieces need not be tactically meaningful. **Feedback.** State both opponent obligations.

**Examples.** 1. check plus attack on queen → double attack. L2. 2. discovered rook attack while mover threatens mate. L3. 3. one “threat” is illegal next move → not valid. L3.

**Validation/coverage.** Threat objects and best-response proof.

### Family `tactic_deflection`

**Task.** Identify a move forcing/luring a defender away from a current duty. **Response/template.** move, defender, duty, follow-up.

**Derivation.** Compare defender's ability to protect target before/after compelled response. **Difficulty.** L2 capture deflection; L3 checking deflection; L4 defender has alternative.

**Misconceptions/constraints.** “Forced” requires all relevant defenses. **Feedback.** Show duty square/line.

**Examples.** 1. force rook to recapture away from back-rank defense. L2. 2. checking sacrifice draws king/defender from square. L3. 3. defender can decline while meeting threat → not forced. L3.

**Validation/coverage.** Reply-set proof.

### Family `tactic_decoy`

**Task.** Identify a move that attracts a target onto a disadvantageous square/line. **Response/template.** move, target, decoy square, follow-up.

**Derivation.** Legal reply moves target to intended square and enables objective. **Difficulty.** L2 king/piece; L3 multiple replies; L4 distinguish deflection.

**Misconceptions/constraints.** Decoy emphasizes destination; deflection emphasizes leaving duty. **Feedback.** Compare before/after geometry.

**Examples.** 1. sacrifice draws king onto mating square. L2. 2. queen lured onto fork square. L3. 3. target need not accept → objective not forced. L3.

**Validation/coverage.** Move/reply/follow-up proof.

### Family `tactic_remove_defender`

**Task.** Identify a legal capture/exchange that eliminates a key defender. **Response/template.** defender, removal move, newly vulnerable target.

**Derivation.** Remove/exchange defender; recompute legal protection and tactical objective. **Difficulty.** L2 direct capture; L3 exchange/sacrifice; L4 replacement defender.

**Misconceptions/constraints.** Geometric defender may be irrelevant or another may remain. **Feedback.** Defender set diff.

**Examples.** 1. capture sole knight defending mate square. L2. 2. exchange bishop for defender then win queen. L3. 3. second defender means tactic fails. L3.

**Validation/coverage.** Pre/post defender sets and line proof.

### Family `tactic_overload`

**Task.** Identify a defender unable to meet two duties and choose the forcing exploitation. **Response/template.** defender, duties, move.

**Derivation.** Enumerate responses to threat A and show each abandons B, or vice versa. **Difficulty.** L2 two pieces; L3 mate+material; L4 legal alternatives.

**Misconceptions/constraints.** Merely defending two things is not overload if one move can preserve both. **Feedback.** Response-duty table.

**Examples.** 1. queen defends rook and mate square; attack one with tempo. L3. 2. pinned defender cannot fulfill either duty. L2. 3. defender has intermezzo covering both → not overloaded. L4.

**Validation/coverage.** Complete response set.

### Family `tactic_interference`

**Task.** Identify a move blocking a defender's line to a critical square/piece. **Response/template.** move, line piece, blocked ray, target.

**Derivation.** Insert piece on between-square; recompute defense and follow-up. **Difficulty.** L2 one line; L3 sacrifice; L4 two lines/Grimshaw-like constructed case.

**Misconceptions/constraints.** Interposing piece must be legal and objective verified. **Feedback.** Highlight cut ray.

**Examples.** 1. block rook's rank defense. L2. 2. sacrificial interposition cuts queen from mate square. L3. 3. occupied/non-between square fails. L2.

**Validation/coverage.** Ray-before/after and objective proof.

### Family `tactic_clearance`

**Task.** Identify a move vacating a square/line for another piece. **Response/template.** clearing move, cleared resource, follow-up.

**Derivation.** Compare destination/ray availability before/after. **Difficulty.** L2 line clearance; L3 square clearance with tempo; L4 sacrifice.

**Misconceptions/constraints.** Mover's new threat may be part of forcing nature. **Feedback.** Mark resource that becomes usable.

**Examples.** 1. bishop leaves file so rook can check. L2. 2. knight vacates promotion square with tempo. L3. 3. moving blocker also exposes own king → illegal. L3.

**Validation/coverage.** Legal attack/move-set delta.

### Family `tactic_motif_audit`

**Task.** Diagnose an incorrectly labeled or nonfunctional tactical motif. **Response/template.** Claim selection and corrected motif/failure.

**Derivation.** Test defining geometry and bounded consequence. **Difficulty.** L1 pin/skewer; L2 fork/hanging; L3 defender manipulation.

**Misconceptions/constraints.** One primary flaw; multiple motif labels may be accepted when both causal. **Feedback.** State missing defining relation.

**Examples.** 1. rear target attacked first called pin → skewer. L1. 2. “fork” mover is immediately legally captured and wins nothing under objective → nonfunctional. L2. 3. defender leaves but still protects target along new line → deflection fails. L3.

**Validation/coverage.** Motif predicates plus tactical proof.

### Cross-family progression

Loose pieces/forks begin with immediate attack relations. Pins/skewers/discoveries build line vision. Defender removal, deflection, decoy, overload, interference, and clearance require increasingly explicit reply verification.

## 7. Category: Short tactical calculation

### Category purpose

Train alternating move calculation, complete defense search, stable leaf evaluation, and move-order discipline.

### Learn

Calculate moves for both sides. Checks, captures, and direct threats are useful candidates, not automatic answers. A combination is forced only when every legal defense meets the claimed result. Stop at a declared stable leaf, then evaluate.

### Prerequisites

Full legality, SAN/coordinate moves, tactical motifs, material, checkmate, and short board updates.

### Category boundaries

Search is normally 1–7 plies. Open-ended positional best moves and deep engine evaluation are excluded.

### Subcategories

1. Mate and forcing candidates
2. Captures, intermezzos, and defender tactics
3. Promotion, quiet threats, and perpetuals
4. Move order, best defense, and tree audits

### Common misconceptions

- Finding one winning-looking line proves the move.
- The opponent will recapture automatically.
- Checks are always best.
- Material can be counted before the exchange is complete.
- Mate in two means any line where the opponent cooperates.
- A quiet move cannot be forcing.

### Family `calculate_mate_one`

**Task.** Find all legal moves that immediately checkmate. **Response/template.** Move set.

**Derivation.** For every legal move, test opponent in check and zero legal replies. **Difficulty.** L1 one key; L2 several checks; L3 noncheck distractors/underpromotion.

**Misconceptions/constraints.** Accept every mating move. **Feedback.** Exhaust capture/block/king defenses.

**Examples.** 1. one rook move mates. L1. 2. tempting check allows interposition. L2. 3. knight underpromotion is sole mate. L3.

**Validation/coverage.** Depth-1 exhaustive mate test.

### Family `calculate_mate_two`

**Task.** Find move(s) forcing mate within two moves by the attacker. **Response/template.** Key move plus reply-to-mate mapping.

**Derivation.** For each key, every legal defense must admit mate in one; prefer forced shorter mate. **Difficulty.** L2 forcing check; L3 quiet key; L4 several defenses.

**Misconceptions/constraints.** Principal variation alone insufficient. **Feedback.** Display complete defense tree.

**Examples.** 1. check key with two defenses, each mated. L2. 2. quiet zugzwang-like mate threat in constructed sparse position. L3. 3. one hidden flight refutes tempting key. L4.

**Validation/coverage.** Exhaustive mate-distance search.

### Family `calculate_forcing_sequence`

**Task.** Choose a checks/captures/threat sequence meeting a bounded objective. **Response/template.** Move tree or ordered line with defense set.

**Derivation.** Minimax stated objective through quiet/stable leaves. **Difficulty.** L2 one forced reply; L3 branching; L4 mixed forcing types.

**Misconceptions/constraints.** Candidate order is heuristic only. **Feedback.** Mark why each reply is forced/relevant.

**Examples.** 1. check forces king square then wins queen. L2. 2. capture with tempo narrows replies. L3. 3. checking line fails but direct threat succeeds. L4.

**Validation/coverage.** Complete bounded objective proof.

### Family `calculate_best_defense`

**Task.** Find the defender's move(s) that minimize loss or maximize mate distance under the objective. **Response/template.** Move set/outcome.

**Derivation.** Evaluate every legal defense at node using minimax. **Difficulty.** L2 avoid immediate loss; L3 choose lesser material loss; L4 delay mate.

**Misconceptions/constraints.** Most natural recapture is not assumed. **Feedback.** Compare all defense outcomes.

**Examples.** 1. king move avoids mate while block loses. L2. 2. decline poisoned queen capture. L3. 3. all moves lose, but one delays mate one move. L4.

**Validation/coverage.** Minimax defense set.

### Family `calculate_capture_exchange`

**Task.** Calculate a bounded capture/recapture sequence and net material. **Response/template.** Ordered captures and net value.

**Derivation.** Make legal captures in chosen/best order through declared stable leaf; count pieces lost by both sides. **Difficulty.** L1 one recapture; L2 several attackers; L3 pinned/intermediate option.

**Misconceptions/constraints.** Static attacker/defender count is not substitute for legality/order. **Feedback.** Material ledger after each ply.

**Examples.** 1. win pawn then equal-value recapture → net specified. L1. 2. queen cannot recapture because pinned → sequence changes. L3. 3. cheapest-attacker order compared with better tactical order. L3.

**Validation/coverage.** Legal capture tree and leaf ledger.

### Family `calculate_zwischenzug`

**Task.** Find an intermediate forcing move before the expected recapture. **Response/template.** Move/order and resulting objective.

**Derivation.** Compare immediate recapture with alternative check/threat, search all replies, then complete exchange. **Difficulty.** L2 check intermezzo; L3 attack/mate threat; L4 opponent counter-intermezzo.

**Misconceptions/constraints.** Must improve result against best defense. **Feedback.** Side-by-side move orders.

**Examples.** 1. check first, then recapture queen. L2. 2. direct recapture draws, intermezzo wins exchange. L3. 3. intermezzo allows stronger countercheck → fails. L4.

**Validation/coverage.** Move-order minimax comparison.

### Family `calculate_back_rank`

**Task.** Calculate a back-rank mate/material tactic and all flight/interposition defenses. **Response/template.** Key and defense tree.

**Derivation.** Verify king confinement, checking line, captures, blocks, luft moves if defender turn. **Difficulty.** L2 mate in one; L3 deflection/removal; L4 hidden interposition.

**Misconceptions/constraints.** Pattern appearance not enough. **Feedback.** Enumerate king flights and blocks.

**Examples.** 1. rook invades last rank with no flight/block → mate. L2. 2. deflect rook defender then mate. L3. 3. bishop can interpose → not mate. L3.

**Validation/coverage.** Mate/objective solver.

### Family `calculate_promotion_race`

**Task.** Calculate a pawn race or tactical promotion with checks and captures. **Response/template.** Move sequence/outcome.

**Derivation.** Alternate legal moves to promotion/capture/mate objective, considering promotion choice and check tempo. **Difficulty.** L2 simple race; L3 side-to-move/check; L4 underpromotion.

**Misconceptions/constraints.** Counting geometric moves alone misses checks/captures. **Feedback.** Timeline ranks and tempos.

**Examples.** 1. each pawn three moves, side to move queens first. L2. 2. first promotion gives check and controls reply. L3. 3. knight promotion forks king/queen and wins. L4.

**Validation/coverage.** Bounded legal search.

### Family `calculate_quiet_threat`

**Task.** Find a noncheck/noncapture move creating a forced short threat. **Response/template.** Key, threat, defense set.

**Derivation.** Search quiet candidates; verify declared threat next move and all defenses. **Difficulty.** L3 mate threat; L4 dual threat/prophylactic key.

**Misconceptions/constraints.** “Quiet” says move type, not lack of force. **Feedback.** Show threat and why forcing checks fail.

**Examples.** 1. queen move creates unavoidable mate in one. L3. 2. clearance move threatens fork and mate. L4. 3. opponent has one defensive resource; key still meets objective. L4.

**Validation/coverage.** Threat/defense proof.

### Family `calculate_perpetual_check`

**Task.** Determine whether a bounded checking cycle forces repetition/draw. **Response/template.** Cycle moves and repetition state.

**Derivation.** Search checks against all king defenses; verify position key repetition or forced recurrence. **Difficulty.** L3 two-position cycle; L4 alternative escape/capture.

**Misconceptions/constraints.** Repeated checking line is not perpetual if defender can deviate favorably. **Feedback.** Compare repeated keys and legal exits.

**Examples.** 1. queen checks repeat same two positions with no escape → forced repetition. L3. 2. king can run after second check → not perpetual. L4. 3. castling/ep rights difference means keys not same. L4.

**Validation/coverage.** Position-key and minimax draw proof.

### Family `calculate_move_order`

**Task.** Compare two move orders reaching similar goals and identify the one that works. **Response/template.** Ordered sequence/outcome comparison.

**Derivation.** Search both lines with best defense; detect tempo, defender relocation, or transposition. **Difficulty.** L2 check-first; L3 capture/deflection order; L4 true transposition.

**Misconceptions/constraints.** Same move set does not imply same intermediate legality. **Feedback.** First divergence and defensive resource.

**Examples.** 1. capture first permits escape; check first wins. L2. 2. remove defender before fork. L3. 3. orders transpose to identical state and are equivalent. L4.

**Validation/coverage.** Position-key/outcome comparison.

### Family `calculate_candidate_set`

**Task.** Generate a complete bounded candidate set—checks, profitable captures, direct threats—or filter candidates by objective. **Response/template.** Move set with class.

**Derivation.** Enumerate legal moves and semantic post-move properties. **Difficulty.** L2 checks; L3 checks+captures; L4 quiet threats.

**Misconceptions/constraints.** Candidate heuristic does not establish best move. **Feedback.** Group every legal candidate and omissions.

**Examples.** 1. list all legal checks. L2. 2. list captures winning at least exchange under one-ply model. L3. 3. include quiet mate threats meeting definition. L4.

**Validation/coverage.** Legal move enumeration/property predicate.

### Family `calculate_line_completion`

**Task.** Fill a missing move/outcome in a supplied proof tree. **Response/template.** Move or leaf evaluation.

**Derivation.** Solve node under objective using existing branches/context. **Difficulty.** L2 forced reply; L3 best defense; L4 missing quiet key.

**Misconceptions/constraints.** Context state reconstructed exactly. **Feedback.** Restore board and enumerate node moves.

**Examples.** 1. only legal check evasion fills reply. L1. 2. choose defense minimizing material loss. L3. 3. leaf is mate, not +queen. L3.

**Validation/coverage.** Node solver and sequence replay.

### Family `calculate_tree_audit`

**Task.** Find an illegal move, omitted defense, unstable leaf, wrong evaluation, or false force claim in a calculation tree. **Response/template.** Node/edge selection and repair.

**Derivation.** Replay every edge and compare complete minimax proof. **Difficulty.** L2 illegal/omitted; L3 horizon/material; L4 transposition/repetition.

**Misconceptions/constraints.** One primary injected fault. **Feedback.** Show refuting move/continuation.

**Examples.** 1. line assumes automatic recapture but opponent checks. L2. 2. “mate” leaf has legal block. L2. 3. material leaf stops while attacked queen is forced lost next ply. L3.

**Validation/coverage.** Proof-tree mutation suite.

### Cross-family progression

Mate in one establishes exhaustive terminal testing. Mate in two and forcing lines introduce universal defense. Exchanges and intermezzos precede motif combinations, races, quiet threats, perpetuals, move-order comparisons, and full tree audits.

## 8. Category: Coordinate visualization and board memory

### Category purpose

Train accurate internal board updates so calculation remains reliable when diagrams are reduced or temporarily hidden.

### Learn

Visualize one change at a time: remove the mover from its origin, remove any captured piece, place the mover/promoted piece, update special state, then recompute lines. Do not keep “ghost” pieces or attacks from the old position.

### Prerequisites

Coordinates, piece attacks, full legal moves, and notation.

### Category boundaries

This category trains position retention and transformation, not generic memory span. Every answer is derivable from a shown starting position and short legal sequence.

### Subcategories

1. Move-by-move occupancy
2. Attack and line updates
3. Routes, subsets, and reverse reconstruction
4. Hidden-board calculation and audits

### Common misconceptions

- Captured pieces remain as blockers mentally.
- A sliding line is unchanged after its blocker moves.
- Castling moves only the king.
- En passant removes a pawn from the destination square.
- Promotion leaves a pawn on the last rank.
- Undoing moves can ignore captured pieces and rights.

### Family `visualize_move_sequence`

**Task.** Play a short legal sequence mentally and report selected final piece locations. **Response/template.** Piece-square fields/board.

**Derivation.** Apply moves with complete state updates. **Difficulty.** L1 two plies visible; L2 four plies; L3 intermittent board hiding.

**Misconceptions/constraints.** Sequence prevalidated; requested subset keeps load bounded. **Feedback.** Replay one move per frame.

**Examples.** 1. e2e4,e7e5 → white pawn e4, black pawn e5. L1. 2. knight moves/captures over four plies. L2. 3. six-piece board hidden after start, report three pieces. L3.

**Validation/coverage.** Move replay and placement query.

### Family `visualize_occupancy_delta`

**Task.** State exactly which squares become empty/occupied after a move. **Response/template.** Removed/added piece-square sets.

**Derivation.** Diff pre/post board. **Difficulty.** L1 quiet/capture; L2 castling/promotion; L3 en passant.

**Misconceptions/constraints.** State fields separate from board diff. **Feedback.** Animate removals before additions.

**Examples.** 1. Nf3: g1 empty,f3 white knight. L1. 2. O-O changes e1,h1,g1,f1. L2. 3. exd6 e.p. empties e5,d5 and fills d6. L3.

**Validation/coverage.** Exact board diff.

### Family `visualize_attack_after_move`

**Task.** Recompute specified attacks/checks after one or more moves. **Response/template.** Square/attacker set.

**Derivation.** Replay sequence then run attack oracle; compare pre/post when asked. **Difficulty.** L2 direct relocation; L3 opened/closed line; L4 special capture.

**Misconceptions/constraints.** No stale attack maps. **Feedback.** Show changed rays only.

**Examples.** 1. knight move changes eight-offset center. L2. 2. pawn moves off diagonal blocker, opening bishop. L3. 3. en passant removal opens rook line. L4.

**Validation/coverage.** Post-state attack oracle.

### Family `visualize_line_after_move`

**Task.** Determine whether two pieces are aligned/blocked after a sequence and list between-squares/blockers. **Response/template.** Relation and ordered squares.

**Derivation.** Replay then use ray-between oracle. **Difficulty.** L2 one blocker moves; L3 capture/replacement; L4 several candidate lines.

**Misconceptions/constraints.** Destination piece can become new blocker. **Feedback.** Compare ray before/after.

**Examples.** 1. bishop vacates file, rook line opens. L2. 2. capture removes target but capturing piece now blocks line. L3. 3. promotion to rook creates new file line. L3.

**Validation/coverage.** Board replay plus ray query.

### Family `visualize_knight_route`

**Task.** Follow or construct a short knight route between coordinates, avoiding occupied friendly destinations where move legality is required. **Response/template.** Ordered squares.

**Derivation.** Apply knight graph edges and optional occupancy/legal filters. **Difficulty.** L1 two jumps; L2 edge; L3 exact-length/no-repeat.

**Misconceptions/constraints.** Intervening occupancy irrelevant. **Feedback.** Show successive 2×3 rectangles.

**Examples.** 1. a1-b3-c5 is valid two-jump route. L1. 2. route from corner in exactly three moves. L2. 3. friendly occupied destination invalid but jumped squares irrelevant. L3.

**Validation/coverage.** Path edge/length constraints.

### Family `visualize_board_subset`

**Task.** Reconstruct one file, rank, diagonal, quadrant, or tactical zone after a sequence. **Response/template.** Ordered piece/empty cells.

**Derivation.** Replay full state then project requested subset. **Difficulty.** L2 line; L3 intersecting zone; L4 hidden board.

**Misconceptions/constraints.** Empty squares are explicit. **Feedback.** Reveal requested slice before full board.

**Examples.** 1. report all pieces on e-file. L2. 2. reconstruct a1-h8 diagonal. L2. 3. report 4×4 kingside zone after four plies. L3.

**Validation/coverage.** Semantic board projection.

### Family `visualize_piece_tracking`

**Task.** Track stable piece identities through moves/captures/promotion. **Response/template.** Identity status/location/type.

**Derivation.** Move semantic piece ID; capture retires it; promotion changes type of pawn ID under profile. **Difficulty.** L1 moves; L2 captures; L3 same-type ambiguity/promotion.

**Misconceptions/constraints.** SAN piece type alone is not identity. **Feedback.** Trace ID path.

**Examples.** 1. g1 knight follows g1-f3-e5. L1. 2. captured bishop status removed. L2. 3. a-pawn promotes and remains same tracked entity with queen type. L3.

**Validation/coverage.** Identity event log.

### Family `visualize_reverse_sequence`

**Task.** Recover the preceding position or missing move from current position plus a short reversible record. **Response/template.** Move/placement.

**Derivation.** Unmake move using stored capture/promotion/castling/ep state. **Difficulty.** L2 quiet/capture; L3 castle/promotion; L4 en passant/rights.

**Misconceptions/constraints.** Full undo record supplied where current board is insufficient. **Feedback.** Reverse additions/removals.

**Examples.** 1. undo Nf3 returns knight g1. L1. 2. undo capture restores captured piece. L2. 3. undo O-O restores king/rook and prior rights from record. L3.

**Validation/coverage.** Make/unmake round-trip.

### Family `visualize_legal_destinations`

**Task.** Retain a position briefly, hide/reduce board, and select legal destinations for one piece. **Response/template.** Square set.

**Derivation.** Use stored position's full legal move set filtered by origin. **Difficulty.** L2 sparse; L3 blockers/pin; L4 after sequence.

**Misconceptions/constraints.** Accessible persistent textual position option always available; memory mode is optional practice, not a barrier. **Feedback.** Restore board and categorize rejections.

**Examples.** 1. knight destinations after two moves. L2. 2. bishop rays with remembered blockers. L3. 3. pinned rook retains only ray-preserving legal destinations. L4.

**Validation/coverage.** Legal generator filtered by origin.

### Family `visualize_memory_audit`

**Task.** Find the first impossible occupancy/attack/state change in a replayed mental line. **Response/template.** Ply/square selection and correction.

**Derivation.** Compare proposed snapshots with legal make-move trace. **Difficulty.** L1 ghost piece; L2 line update; L3 special state.

**Misconceptions/constraints.** One primary injected fault. **Feedback.** Show board diff at first divergence.

**Examples.** 1. captured pawn remains on board → ghost. L1. 2. rook still attacks through new blocker → stale line. L2. 3. en-passant pawn removed from d6 rather than d5 → wrong delta. L3.

**Validation/coverage.** Snapshot mutation suite.

### Cross-family progression

Visible sequence replay precedes occupancy deltas and attack updates. Lines/routes/subsets reduce visual support gradually. Reverse moves and hidden legal destinations are optional advanced modes with accessible persistent-board alternatives.

## 9. Category: Evaluation anchors and elementary endgames

### Category purpose

Provide stable leaf-evaluation skills so short calculation ends with a justified conclusion rather than “I won a piece, probably.”

### Learn

Mate outranks material. Material is an anchor, not a complete evaluation. In sparse endings, king distance, opposition, key squares, passed-pawn tempo, and legal promotion races often make exact calculation possible.

### Prerequisites

Legal moves, bounded lines, material values, coordinates, checks, and promotion.

### Category boundaries

Only exact or explicitly modeled evaluation appears. Broad strategic judgment and tablebase-scale endings are excluded.

### Subcategories

1. Material and tactical leaf evaluation
2. Activity and king-safety features
3. Pawn endings and races
4. Simplification and audits

### Common misconceptions

- Material count decides positions with mate.
- Every exchange of equal nominal value is neutral.
- A passed pawn is automatically winning.
- Kings move like distant spectators in endings.
- Opposition is simply “kings face each other.”
- First promotion always wins regardless of check/stalemate.

### Family `evaluate_material_balance`

**Task.** Compute material balance/change under the declared values. **Response/template.** Side advantage and units.

**Derivation.** Sum nonking pieces by color and subtract; or ledger sequence. **Difficulty.** L1 one imbalance; L2 several; L3 before/after tactic.

**Misconceptions/constraints.** Mate status checked first in integrated questions. **Feedback.** Piece-value table and totals.

**Examples.** 1. White extra pawn → +1. L1. 2. rook versus bishop+two pawns → 5 versus5. L2. 3. queen lost for two rooks → -1 under model. L2.

**Validation/coverage.** Exact inventory sum.

### Family `evaluate_exchange_leaf`

**Task.** Compare stable tactical leaves by mate/material and choose outcome under lexicographic rule. **Response/template.** Leaf ranking.

**Derivation.** Terminal result first, then net material, then supplied tiebreak features. **Difficulty.** L2 material; L3 mate versus gain; L4 several equal-material leaves.

**Misconceptions/constraints.** No hidden positional engine score. **Feedback.** Apply criteria in order.

**Examples.** 1. +rook leaf beats +pawn if no mate. L1. 2. mating leaf beats +queen. L2. 3. equal material uses supplied king-safety score only when declared. L3.

**Validation/coverage.** Comparator total preorder.

### Family `evaluate_piece_activity`

**Task.** Compute a supplied activity feature such as legal mobility, safe checking squares, open-file occupation, or centralization. **Response/template.** Count/score.

**Derivation.** Apply explicit feature formula from legal moves/board zones. **Difficulty.** L2 one piece; L3 several; L4 compare after trade.

**Misconceptions/constraints.** Feature is not a universal evaluation. **Feedback.** Mark counted squares.

**Examples.** 1. knight centralization score from distance-to-center table. L2. 2. rook on declared open file gets feature point. L2. 3. nominal mobility excludes illegal pinned moves when formula says legal mobility. L3.

**Validation/coverage.** Feature oracle.

### Family `evaluate_king_safety`

**Task.** Evaluate an explicit king-safety model—legal flights, checking lines, shield squares, or mate threats. **Response/template.** Feature vector/safer choice.

**Derivation.** Count supplied structural properties, with checkmate terminal. **Difficulty.** L2 flights; L3 open lines/shield; L4 compare candidate move.

**Misconceptions/constraints.** No general engine safety claim. **Feedback.** Overlay features.

**Examples.** 1. zero safe flights but not in check is not by itself mate. L2. 2. pawn move opens checking file under model. L3. 3. trade queens removes declared immediate checking candidates. L3.

**Validation/coverage.** Exact feature counts.

### Family `endgame_passed_pawn`

**Task.** Identify passed pawns and promotion distance under side-to-move assumptions. **Response/template.** Pawn set/move count.

**Derivation.** No opposing pawn on same/adjacent files ahead; count legal advances with double-step only when actually available. **Difficulty.** L2 identify; L3 blockers/captures; L4 protected/outside labels supplied.

**Misconceptions/constraints.** Passed does not mean unobstructed or winning. **Feedback.** Shade relevant files ahead.

**Examples.** 1. white d5 with no black c/d/e pawns ahead → passed. L2. 2. piece blocker does not change passed status but blocks advance. L2. 3. adjacent-file enemy pawn ahead means not passed. L2.

**Validation/coverage.** Pawn-file/rank predicate.

### Family `endgame_opposition`

**Task.** Identify direct/distant opposition and which king must yield under a kings-and-pawns model. **Response/template.** Relation and side.

**Derivation.** Kings aligned with odd number of squares between for opposition; side not to move “has” it in declared simple setting; verify legal king moves. **Difficulty.** L2 direct; L3 distant; L4 board edge/pawn tempo.

**Misconceptions/constraints.** Opposition is a tool, not universal win proof. **Feedback.** Count between-squares and tempos.

**Examples.** 1. kings e4/e6 with e5 between, Black to move → White has direct opposition. L2. 2. distant aligned kings with odd gap. L3. 3. spare pawn move can transfer opposition. L4.

**Validation/coverage.** Geometry plus legal tempo search in generated class.

### Family `endgame_key_squares`

**Task.** Determine whether an attacking king can reach a pawn's taught key square in a simplified king-and-pawn ending. **Response/template.** Square/path/outcome.

**Derivation.** Use versioned key-square table for nonrook pawns plus legal king-distance/opposition search. **Difficulty.** L2 fixed rank; L3 side to move; L4 rook-pawn exception excluded/labeled.

**Misconceptions/constraints.** Rules introduced in Learn; no rote unexplained table. **Feedback.** Highlight key squares and legal path.

**Examples.** 1. white pawn on fourth rank has taught key-square set ahead. L2. 2. king already controls key square supports promotion. L2. 3. enemy king/opposition prevents reaching it in time. L3.

**Validation/coverage.** Small exact endgame solver/table.

### Family `endgame_pawn_race`

**Task.** Calculate a sparse king/pawn promotion race including checks/captures. **Response/template.** Outcome/line.

**Derivation.** Full legal search to promotion, capture, mate, or declared draw horizon. **Difficulty.** L2 straight race; L3 king square rule; L4 checking promotion.

**Misconceptions/constraints.** Geometry heuristic is checked against legal search. **Feedback.** Tempo timeline.

**Examples.** 1. king inside pawn's square catches it. L2. 2. side-to-move changes exact race. L3. 3. promotion with check wins tempo. L4.

**Validation/coverage.** Exact bounded endgame search.

### Family `evaluate_simplification_audit`

**Task.** Decide whether a proposed trade simplifies into a favorable/drawn/lost exact leaf or diagnose an evaluation overclaim. **Response/template.** Outcome plus line/reason.

**Derivation.** Search capture sequence then evaluate with exact generated endgame/material model. **Difficulty.** L2 material simplification; L3 pawn ending; L4 stalemate/promotion resource.

**Misconceptions/constraints.** “Ahead, so trade everything” is not automatic. **Feedback.** Compare pre/post objective and hidden terminal resources.

**Examples.** 1. queen trade enters trivially winning king-versus-king+rook under supplied rule. L2. 2. pawn trade removes last pawn into draw. L3. 3. capture of final piece causes stalemate → proposed win fails. L4.

**Validation/coverage.** Legal line plus terminal/exact-class oracle.

### Cross-family progression

Material and stable leaves precede explicit activity/safety features. Passed pawns lead into opposition/key squares/races. Simplification audits combine tactical calculation with exact terminal evaluation.

## 10. Category: Calculation method, search, and proof quality

### Category purpose

Train systematic search concepts that make human calculation complete without turning the learner into an engine programmer.

### Learn

Generate candidates, alternate sides, and compare outcomes under the objective. A transposition is the same complete position state reached by another order. A proof tree must include every relevant defense; move ordering can save effort but cannot change truth.

### Prerequisites

Legal move generation, tactical calculation, position keys, repetition, and leaf evaluation.

### Category boundaries

These are small human-readable trees. Alpha-beta implementation, neural evaluation, and deep engine optimization are excluded.

### Subcategories

1. Move-tree size and candidate ordering
2. Minimax, mate distance, and transpositions
3. Repetition/objective proofs
4. Uniqueness, calibration, and oracle audits

### Common misconceptions

- The first attractive move can stop search.
- Opponent replies may be sampled rather than exhausted in a forced proof.
- A principal variation is the full proof.
- Same board placement always means same position.
- Any move with the same engine score is equally good for the exercise objective.
- More pieces or plies alone determine difficulty.

### Family `search_perft_small`

**Task.** Count legal leaf nodes at depth 1–3 in a sparse position or complete a divide table. **Response/template.** Integer/per-root counts.

**Derivation.** Recursively generate every legal move, make/unmake, count depth-zero nodes. **Difficulty.** L2 depth1/2; L3 special move; L4 depth3 sparse.

**Misconceptions/constraints.** Small enough for reasoning; used to expose completeness, not speed. **Feedback.** Group counts by root move.

**Examples.** 1. depth1 equals legal move count. L1. 2. sum reply counts across root moves. L2. 3. promotion root has four branches. L3.

**Validation/coverage.** Independent generator and known fixture counts.

### Family `search_candidate_order`

**Task.** Order candidates for investigation under a displayed heuristic without claiming evaluation. **Response/template.** Ordered move groups.

**Derivation.** Apply declared checks→forcing captures→direct threats→quiet order, with deterministic SAN tie. **Difficulty.** L1 classify; L2 several types; L3 exceptions where quiet still included.

**Misconceptions/constraints.** Search order is not move ranking. **Feedback.** Label candidate property.

**Examples.** 1. all legal checks listed first. L1. 2. winning capture before speculative quiet move under heuristic. L2. 3. quiet mate threat remains candidate though searched later. L3.

**Validation/coverage.** Semantic move classification/comparator.

### Family `search_minimax_node`

**Task.** Back up values through a small alternating move tree. **Response/template.** Node values and best-move set.

**Derivation.** Side to optimize chooses best; opponent chooses worst for root under declared value ordering. **Difficulty.** L2 numeric leaves; L3 mate/material lexicographic; L4 ties.

**Misconceptions/constraints.** Do not average opponent replies. **Feedback.** Back up one level at a time.

**Examples.** 1. move leaves {+3,-1}; guaranteed value -1. L2. 2. compare forced mate versus +9 leaf → mate wins. L3. 3. two roots share optimal worst case → both accepted. L3.

**Validation/coverage.** Tree evaluator.

### Family `search_mate_distance`

**Task.** Compare forced mates/losses by distance and select fastest win or longest defense. **Response/template.** Move and mate plies/moves.

**Derivation.** Terminal mate distance zero; winning side minimizes, losing side maximizes distance. **Difficulty.** L2 two wins; L3 defender choice; L4 notation “mate in N.”

**Misconceptions/constraints.** Mate in N counts winner's moves under stated convention; internal search uses plies. **Feedback.** Convert tree depth carefully.

**Examples.** 1. mate in1 preferred over mate in2. L1. 2. doomed defender chooses line mated in3 over in2. L2. 3. odd/even ply conversion explained by side to move. L3.

**Validation/coverage.** Exact mate-distance search.

### Family `search_transposition`

**Task.** Determine whether two move sequences reach the same complete position and may share a subtree. **Response/template.** Same/different plus differing state.

**Derivation.** Replay and compare repetition keys plus counters/objective fields as relevant. **Difficulty.** L2 commuting moves; L3 rights/ep; L4 halfmove distinction for fifty-move analysis.

**Misconceptions/constraints.** Same placement may differ in side/rights/ep. **Feedback.** Field-by-field diff.

**Examples.** 1. independent knight moves in swapped order reach same state if side sequence matches. L2. 2. same placement but lost castling right → different. L3. 3. same repetition key but different halfmove clock for fifty-move status. L4.

**Validation/coverage.** Position-state comparison.

### Family `search_repetition_status`

**Task.** Track occurrence counts and determine claimable/automatic repetition. **Response/template.** Key counts/status.

**Derivation.** Compute keys after each completed position; distinguish threefold claim and fivefold automatic. **Difficulty.** L2 simple cycle; L3 rights/ep; L4 intended next-move claim case if included.

**Misconceptions/constraints.** Similar-looking placement is insufficient. **Feedback.** Table keys and counts.

**Examples.** 1. identical key third occurrence → claimable threefold. L2. 2. fifth occurrence → automatic draw. L2. 3. castling-right change prevents identity. L3.

**Validation/coverage.** Stateful key/count oracle.

### Family `search_fifty_move_status`

**Task.** Update halfmove clock and distinguish fifty-move claim from seventy-five-move automatic draw. **Response/template.** Clock/status.

**Derivation.** Reset after pawn move/capture, otherwise increment per halfmove; apply 100/150 thresholds and mate precedence. **Difficulty.** L2 update; L3 threshold; L4 terminal move.

**Misconceptions/constraints.** Fullmove number is unrelated. **Feedback.** Show reset/increment timeline.

**Examples.** 1. quiet knight move 99→100 → claim available. L2. 2. pawn move resets to0. L1. 3. mating move at automatic threshold ends in mate under rule priority. L4.

**Validation/coverage.** Clock transition and terminal precedence.

### Family `search_objective_proof`

**Task.** Verify whether a move tree proves its stated mate/material/promotion/draw objective. **Response/template.** Proven/not proven plus missing condition.

**Derivation.** Quantify root choice existentially and all opponent defenses universally to horizon; evaluate leaves. **Difficulty.** L2 one defense; L3 branching; L4 mixed terminal leaves.

**Misconceptions/constraints.** One favorable line cannot prove force. **Feedback.** Highlight first unproven defense.

**Examples.** 1. every reply loses rook → material objective proven. L2. 2. one reply escapes mate → mate claim false. L2. 3. all lines promote but one promotion loses to mate, so “winning” stronger claim unproven. L4.

**Validation/coverage.** Quantified proof evaluator.

### Family `search_unique_solution`

**Task.** Determine whether a tactical key is unique or list all moves meeting objective. **Response/template.** Unique yes/no and move set.

**Derivation.** Solve objective for every legal root move and compare exact outcomes/mate distances. **Difficulty.** L2 unique; L3 dual solution; L4 same material different forced mate.

**Misconceptions/constraints.** Engine ordering does not break pedagogical ties. **Feedback.** Show outcome of every successful root.

**Examples.** 1. sole mate-in2 key → unique. L2. 2. two moves mate in1 → both accepted. L2. 3. two win queen but only one avoids counter-mate under objective → unique. L4.

**Validation/coverage.** Exhaustive root outcome set.

### Family `search_oracle_audit`

**Task.** Diagnose an engine/generator/proof claim error: illegal node, missing branch, wrong state key, unstable leaf, or vague objective. **Response/template.** Fault selection and correction/rejection.

**Derivation.** Recompute legal tree and objective; compare build-time metadata. **Difficulty.** L2 legality; L3 proof/state; L4 evaluation ambiguity.

**Misconceptions/constraints.** One primary error. **Feedback.** Supply exact counterline or missing oracle field.

**Examples.** 1. principal variation offered as mate proof without all defenses → invalid. L2. 2. transposition merges positions with different castling rights → invalid. L3. 3. “best move” based only on engine +0.3 versus +0.2 with no declared objective → reject question. L4.

**Validation/coverage.** Oracle metadata mutation suite.

### Cross-family progression

Small perft builds trust in complete legal generation. Candidate ordering precedes minimax but never replaces it. Mate distance/transpositions lead to repetition and draw state, then objective proof, uniqueness, and oracle audits.

## 11. Topic-level progression

### Level 1: Board and direct movement

- identify coordinates, square colors, rays, and basic piece attacks;
- distinguish pawn movement from attack;
- make/read ordinary coordinate moves and simple SAN;
- find direct checks, captures, and mate in one in sparse positions.

### Level 2: Legal geometry

- blockers, defenders, x-rays, pins, legal king moves, and check evasions;
- castling, promotion, basic en passant;
- forks, pins, skewers, discovered attacks;
- two- to three-ply material and mate calculations;
- visible-board sequence updates.

### Level 3: Complete defense

- double check, exposed en-passant lines, SAN disambiguation;
- defender manipulation, intermezzos, back-rank tactics;
- mate in two with several defenses;
- board hiding for short intervals;
- stable leaf material, passed pawns, opposition, BFS-like move trees.

### Level 4: Quiet resources and state

- quiet tactical keys, perpetuals, move-order distinctions;
- promotion races and exact sparse endgames;
- transpositions including castling/ep/repetition state;
- multiple optimal moves and proof audits;
- constructed positions with 5–7-ply bounded solutions.

### Level 5: Calculation discipline

- generate candidates without confusing order with value;
- prove an objective against every defense;
- retain/update a compact position;
- stop at stable, explicitly evaluated leaves;
- find hidden defensive resources and reject vague engine claims.

Mastery is tracked separately for coordinates, attacks, legality, notation, motifs, calculation, visualization, evaluation/endgames, and search proof.

## 12. Adaptive guidance

| Error | Route to |
|---|---|
| file/rank swapped | square locate with labeled axes |
| flipped board changes square IDs | orientation invariant pair |
| pawn forward called attacked | move/attack split |
| slider jumps blocker | ordered ray trace |
| pinned piece removed from attacks | attack-versus-legal contrast |
| king moves onto defended capture | post-capture attack map |
| only one check evasion class considered | king/capture/block checklist |
| double check answered by block | checker-count contrast |
| castle through check | start/transit/destination checklist |
| en passant exposes king | three-square board delta and ray |
| SAN disambiguates pseudo-legal piece | legal competitor list |
| motif name substitutes for proof | one refuting defense |
| assumes automatic recapture | zwischenzug candidate pair |
| stops material count too early | capture closure/unstable leaf |
| mate line shows one defense only | complete reply tree |
| ghost captured piece retained | occupancy-delta replay |
| same placement called repetition | rights/ep/turn key diff |
| engine preference called unique | objective/accepted root set |

Recommended mix after onboarding: 30% weakest geometry/legality, 25% spaced tactics, 20% coordinate visualization, 15% bounded calculation trees, 10% audits/endgames.

Hints reveal:

1. side to move and state rights;
2. checking pieces/current threats;
3. candidate class;
4. one relevant ray/defender;
5. opponent reply count;
6. first move only.

Hints never reveal a full line before the learner requests the worked proof.

## 13. Answer checking and feedback

### Move and position checking

- Parse typed move text to a semantic legal move.
- Compare move objects, not cosmetic SAN strings, except notation-production families.
- Coordinate arrows and board interactions produce origin/destination/promotion fields.
- Board placements compare semantic piece-square maps.
- Move sets normalize order and include all promotion identities.
- Sequences are replayed from the exact initial state; no illegal prefix is accepted.

### Calculation checking

- Mate and objective answers use complete bounded search.
- If several moves achieve the same exact objective/distance, accept all.
- A line-only response is sufficient only when the position has a unique legal reply at every omitted branch; otherwise use a branch-map/tree response.
- Leaf material uses the declared ledger; mate/draw terminal status takes precedence.
- Motif labels are secondary fields and never rescue an incorrect move.

### Feedback order

Feedback should:

1. state legal move/status/objective outcome;
2. show the decisive attack, pin, ray, or occupancy change;
3. enumerate all opponent defenses relevant to force;
4. show the worked move tree and stable leaf;
5. identify the learner's likely misconception;
6. list co-optimal moves or uncertainty explicitly.

“The engine says so” is never sufficient feedback.

## 14. Rendering and accessibility requirements

- The board is semantic HTML/SVG with keyboard-accessible squares and piece labels.
- Coordinates remain available on all orientations and zoom levels.
- Piece identity is conveyed by accessible name and text code, never shape/color alone.
- Legal destinations, attacks, checks, pins, and candidate moves use distinct labels/patterns as well as colors.
- Arrows have textual origin/destination/role alternatives.
- A move list and piece-square table provide a complete nonvisual representation.
- Board-hidden visualization mode is optional; accessibility/practice mode keeps the semantic board available without reducing mastery in legality/calculation.
- Variations render as expandable trees and as indented move/reply lists.
- Focus mode can hide irrelevant pieces only when the hidden set is explicitly shown as “irrelevant to this scaffold”; it never alters the oracle position.
- Animation is optional and respects reduced motion.
- SAN glyphs use ordinary text; piece-font glyphs are decorative only.

## 15. Generator and implementation architecture

### Position-first instance

```text
ChessPracticeInstance {
  seed
  contentVersion
  rulesProfile
  initialPosition
  boardOrientation
  familyId
  level
  legalMoves
  attackMaps
  objective?
  proofTree?
  acceptedMoves[]
  stableLeaves[]
  motifFacts[]
  notationFacts
  misconceptionTags[]
}
```

The position and proof exist before wording or board layout.

### Core local modules

- 64-square board/bitboard or mailbox representation;
- attack generation independent of legal generation;
- pseudo/legal move generation with exact special state;
- reversible make/unmake;
- position-key and repetition history;
- SAN and FEN parser/formatter;
- terminal-status and draw-state evaluator;
- bounded minimax/mate-distance/objective solver;
- material and controlled feature evaluator;
- semantic board, arrow, ray, and variation renderer.

Implementation may use bitboards internally, but exercises never require bitboard programming unless a future separate category introduces it.

### Offline constraint

The standalone HTML/JS/CSS page includes the legality core and bounded solver or bundled precomputed proofs. It requires no backend, cloud analysis, online database, account, or network access.

Build-time tooling may use pinned independent engines and perft suites. Engine binaries, licenses, versions, options, and validation logs must be documented. Do not silently bundle a strong engine or incompatible license into the standalone artifact.

### Content provenance and fair play

Generated positions are preferred. Curated studies/puzzles require source and license metadata. The app does not copy proprietary puzzle databases.

The UI is designed for practice positions, not live-game assistance: no screen scraping, board recognition, browser-extension integration, opponent/account connection, or automatic import from an ongoing game.

### Localization

Instructions, motif names, hints, and feedback are localizable. Square coordinates, FEN, coordinate move IDs, and SAN piece letters remain standard. Localized piece names map to stable codes. Localization must preserve “attacked” versus “legal,” forced versus possible, claimable versus automatic, and mate-in-moves versus plies.

## 16. Automated validation

For every position:

- exactly one king per side and kings not adjacent;
- board/state/history constraints pass;
- attack maps recompute independently of legal moves;
- pseudo/legal move sets and make/unmake round-trip;
- no legal move leaves own king attacked;
- castling, ep, promotion, checks, mate, and stalemate state recompute;
- SAN is unique, correctly disambiguated/suffixed, and round-trips;
- FEN round-trips all six fields;
- repetition keys and halfmove clocks update correctly;
- tactical motif facts match post-move geometry;
- proof trees contain every legal reply inside objective horizon;
- accepted roots are the complete optimal set;
- material leaves are stable under declared capture extension;
- explanations reference exact oracle facts;
- board orientation does not change semantic answers.

Required test suites:

- exhaustive attack generation over every empty-board piece/square;
- randomized blocker/occupancy attack cross-check;
- pinned pieces still attack while legal moves filter;
- king adjacency and post-capture x-rays;
- single/double check and all evasion types;
- every castling right/path/attack/history combination;
- en-passant availability, expiry, and discovered self-check;
- all quiet/capture promotions and four underpromotions;
- SAN file/rank/both disambiguation and suffixes;
- FEN field boundaries;
- known trusted perft positions at multiple depths;
- independent legal-generator comparison on large randomized legal-position corpus;
- make/unmake hash/state equality;
- repetition rights/ep edge cases and 50/75-move thresholds;
- mate-distance and objective proof cross-check with pinned build-time engine where applicable;
- mutation tests for every audit family;
- at least `10,000` deterministic seeds per combinatorial family/level.

## 17. Coverage requirements

The initial specification defines exactly 100 stable families:

| Category | Families |
|---|---:|
| Board coordinates and visualization | 10 |
| Piece movement and attack maps | 12 |
| Legal moves, check, and special rules | 13 |
| Chess notation and position representation | 8 |
| Tactical relationships and motifs | 14 |
| Short tactical calculation | 14 |
| Coordinate visualization and board memory | 10 |
| Evaluation anchors and elementary endgames | 9 |
| Calculation method, search, and proof quality | 10 |
| **Total** | **100** |

Across a long mixed session:

- both board orientations appear, but semantic coordinates never change;
- every piece type appears in attack, move, and tactical roles;
- pawn attack/movement, attacked/legal, and geometric/legal defense recur as contrast pairs;
- castling, en passant, and all promotion types receive deliberate coverage;
- at least 25% of post-Level-2 legality questions contain a pin/check/special-state complication;
- at least 30% of tactical questions require naming or finding a defensive resource;
- mate problems validate every legal defense;
- nonmate tactics end at stable or explicitly scored leaves;
- board visualization progresses gradually and retains an accessible persistent-board route;
- multiple-solution positions are accepted intentionally;
- exact endgame classes remain sparse and proof-backed;
- at least 15% of advanced questions have “not forced,” “multiple moves,” or “question under-specified” as the correct conclusion;
- engine score alone never defines a family answer.

## 18. Recommended views and v1 priorities

Recommended navigation:

1. Board Vision
2. Attacks & Moves
3. Legal Chess
4. Notation
5. Tactical Motifs
6. Short Calculation
7. Visualization
8. Endgame Anchors
9. Search Discipline

Recommended v1:

- coordinates, square colors, rays, knights, piece placement;
- every piece attack with blockers and defenders;
- pseudo/legal contrast, check, pins, king safety, evasions, mate/stalemate;
- castling, en passant, promotion;
- coordinate notation, basic SAN, FEN placement;
- hanging pieces, forks, pins, skewers, discoveries, defender removal;
- mate in one, selected mate in two, 1–4-ply material tactics;
- visible/partially hidden move-sequence updates;
- material leaves, passed pawns, simple pawn races;
- candidate/check generation and small minimax trees.

Defer full SAN disambiguation production, 7-ply runtime search, quiet mate-in-two constructions, complex underpromotions, distant opposition, repetition claims, full FEN production, and advanced proof audits until the move generator and UI pass extensive validation.

## 19. Topic-level quality checklist

- [ ] Rules profile and full position state are explicit.
- [ ] Attacked squares are not derived from legal moves.
- [ ] Pseudo-legal and legal moves remain separate.
- [ ] Kings are never captured and may not become adjacent.
- [ ] Every king move tests the resulting attack map.
- [ ] Double check permits only king moves.
- [ ] Castling tests rights, pieces, emptiness, and the king's three relevant squares.
- [ ] En passant removes the adjacent pawn before self-check testing.
- [ ] Promotion generates Q/R/B/N as separate moves.
- [ ] SAN uses legal competitors for disambiguation and post-state check suffixes.
- [ ] FEN and repetition retain nonvisible state.
- [ ] Mate/stalemate use check plus legal-move count.
- [ ] Motif labels are verified by geometry and consequence.
- [ ] Every forced tactic includes all legal defenses.
- [ ] Nonmate leaves are stable or explicitly evaluated.
- [ ] Multiple objective-equivalent moves are accepted.
- [ ] Board-memory modes have fully accessible persistent-board alternatives.
- [ ] Runtime search is bounded and no backend/strong engine is required.
- [ ] Build-time engine checks never replace the semantic objective.
- [ ] Positions are generated or licensed, not copied from proprietary databases.
- [ ] The app does not facilitate live competitive assistance.
- [ ] Every distractor represents a plausible misconception.
- [ ] Every family has difficulty progression, three examples, feedback, and validation.
