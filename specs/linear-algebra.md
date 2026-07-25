# Linear Algebra — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, matrix/vector editor, exact algebra checker, diagram renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Linear Algebra

### Topic goal

Develop fluent finite-dimensional linear-algebra reasoning: move among equations, vectors, matrices, transformations, and subspaces; perform exact small-matrix calculations; recognize structural invariants; and verify answers whose representation may not be unique.

The app should train why an operation applies and what its result means—not merely execute row-reduction recipes. Learners should connect `Ax=b` to column combinations and transformations, rank to pivots and dimensions, eigenvectors to invariant directions, and least squares to orthogonal projection.

### Audience and prerequisites

The learner is expected to know:

- signed arithmetic, fractions, powers, square roots, and elementary algebra;
- systems of two linear equations;
- coordinate geometry in two and three dimensions;
- function notation and basic set notation;
- matrix row/column reading, or willingness to learn it in the first category.

Calculus is not required except for optional application context; no calculus operation is assessed.

### Scope

The topic includes:

- vectors in `R^n`, linear combinations, dot products, norms, angles, projections, and the three-dimensional cross product;
- matrix shapes, entries, arithmetic, products, transposes, inverses, LU factorization, and geometric linear transformations;
- systems of linear equations, augmented matrices, elementary row operations, echelon form, RREF, pivots, consistency, and parametric solution sets;
- determinants, orientation/volume scaling, and invertibility connections;
- subspaces, span, linear independence, bases, dimension, coordinates, column/row/null/left-null spaces, and rank–nullity;
- linear maps, kernels, images, matrix representations, composition, change of basis, and similarity;
- eigenvalues, eigenvectors, eigenspaces, characteristic polynomials, diagonalization, powers, and simple discrete dynamical/Markov models;
- orthogonal complements, Gram–Schmidt, QR factorization, orthogonal projection, least squares, symmetric matrices, quadratic forms, and tightly controlled singular-value decomposition.

The intended ceiling is a strong first undergraduate course with an applied finish. Abstract definitions are exercised through generated finite examples rather than proof-only prompts.

### Exclusions

Do not include:

- infinite-dimensional spaces, function spaces requiring analysis, Hilbert/Banach spaces, tensors, exterior algebra, modules, or general fields/rings;
- complex vector spaces, complex eigenvalues/eigenvectors, unitary matrices, Hermitian matrices, or complex inner products in the initial version;
- Jordan/rational canonical form, minimal polynomials, generalized eigenvectors, matrix exponentials, or differential-equation systems;
- multilinear forms, dual-space formalism beyond the concrete left nullspace, quotient spaces, category-theoretic language, or proof grading;
- arbitrary symbolic matrix dimensions, large sparse matrices, iterative solvers, floating-point LAPACK behavior, or performance benchmarking;
- general characteristic polynomials of degree above three or exact radical solutions of arbitrary cubics;
- arbitrary SVD, pseudoinverse, PCA, or condition-number computation from unstructured decimal data;
- determinants larger than `4×4` for hand computation;
- applied claims with unstated assumptions or sensitive real-world data.

### Normative scalar and space model

- Unless a question explicitly says otherwise, scalars and vector spaces are over `R`.
- Exact generated entries are integers or reduced rational numbers.
- Radicals appear only in exact-friendly norm, angle, eigen, orthogonalization, or SVD templates and use principal non-negative square roots.
- Vectors are column vectors by default. A displayed row vector is labeled as such.
- Coordinates and matrix indices are one-based in mathematical notation: `a_ij` is row `i`, column `j`.
- `R^n` uses the standard ordered basis `e1,...,en`.
- The zero vector's dimension is always determined by context and rendered explicitly where ambiguity is possible.
- An ordered basis matters for coordinate vectors and change-of-basis matrices. When the task asks only for “a basis,” order is irrelevant.
- The empty set is linearly independent. The zero subspace has dimension `0` and basis the empty list; the UI must represent this semantically rather than forcing `{0}` as a basis.

### Matrix conventions

- An `m×n` matrix has `m` rows and `n` columns and represents a map `R^n→R^m`.
- `Ax` is both the row-dot-product computation and the linear combination of columns of `A` using coefficients from `x`.
- Matrix multiplication `AB` means apply `B` first, then `A`; it is defined when columns of `A` equal rows of `B`.
- `I_n` is the `n×n` identity; `0_(m×n)` is an explicitly shaped zero matrix.
- `A^T` is the transpose.
- RREF follows the standard unique definition: each nonzero row leads with `1`, pivot columns have zeros elsewhere, pivots move right down the rows, and zero rows are last.
- `det(A)` is defined only for square matrices.
- An eigenvector is nonzero. `Av=λv` with `v=0` does not make every scalar an eigenvalue.
- Orthogonal means dot product zero; orthonormal also requires unit norm.
- For real symmetric `A`, eigenvalues are real and an orthonormal eigenbasis exists.
- Unless a family says “thin” or “compact,” an SVD of `A:m×n` means `A=UΣV^T` with square orthogonal `U:m×m`, `V:n×n`, rectangular `Σ:m×n`, and non-negative singular values ordered non-increasingly down its main diagonal.

### Exact arithmetic and algebraic values

Canonical arithmetic uses arbitrary-precision integers and reduced rational pairs:

```text
Rational := { numerator: BigInt, denominator: positive BigInt }
```

Never use JavaScript `Number` as the oracle for row reduction, rank, determinant, inverse, nullspace, or rational eigenproblems.

Supported exact algebraic values are limited to forms needed by generated templates:

- `q`;
- `q*sqrt(d)`;
- `a+b*sqrt(d)`;
- quotients reducible within the same quadratic field;

where coefficients are rational and `d` is a positive square-free integer from a small whitelist. Equivalent radical forms are normalized to a canonical square-free representation. Decimal approximations are accepted only when requested.

### Structured answer formats

Use semantic editors rather than fragile free text:

- scalar: rational/radical field;
- vector: fixed-length vertical grid;
- matrix: fixed `m×n` grid;
- ordered tuple/list: indexed fields;
- set of vectors: reorderable vector cards;
- basis: unordered vector set unless coordinates depend on order;
- span/solution: particular vector plus parameter-direction vectors;
- row operation: operation type and row/scalar selectors;
- polynomial: coefficient fields in descending or declared order;
- interval/choice: semantic controls.

Accept `3/4`, terminating decimals when exact at displayed precision, and normalized radical syntax such as `sqrt(2)/2`. Surrounding whitespace is ignored.

### Equivalence and non-uniqueness contract

String equality is insufficient for many correct answers.

- **Vectors/matrices/scalars:** compare exact normalized entries.
- **Polynomials:** compare normalized coefficient vectors.
- **Spans/subspaces:** row-reduce matrices whose rows or columns are the proposed generators, as appropriate, and compare canonical RREF spaces.
- **Bases:** verify independence, membership in the target subspace, and correct cardinality/dimension. Do not require the generator's chosen basis.
- **Nullspace/solution parameterizations:** verify every supplied direction lies in the homogeneous nullspace, the particular vector satisfies `Ax=b`, directions form a basis of the nullspace, and dimensions match.
- **Eigenvectors:** accept any nonzero scalar multiple in the correct eigenspace. For repeated eigenvalues, accept any basis of the full eigenspace.
- **Diagonalizations:** accept column permutations and nonzero column scalings when the same permutation is applied to `D`; verify `AP=PD`, `P` invertible, and `D` diagonal.
- **Orthonormal bases/QR:** accept sign flips and, where the target subspace permits, alternative orthonormal bases; verify orthonormality and reconstruction. If QR uniqueness is desired, require positive diagonal entries in `R`.
- **SVD:** accept paired sign flips and permutations of equal singular values; verify orthogonality, non-negative ordered singular values if requested, and reconstruction.
- **Row reduction:** many operation sequences are valid. Grade a proposed next operation by applying it and checking its stated local goal, or ask for the unique RREF; never require one canonical path.

### Numeric answer conventions

- Exact answers are preferred for generated exact data.
- If the prompt requests a decimal, default tolerance is the larger of half a displayed last-place unit and `10^-8` relative.
- Angles state radians or degrees explicitly; exact inverse-cosine form or the requested decimal is accepted.
- Tiny floating residuals are never used to decide exact rank/independence for rational instances.
- Multiple values use named/indexed fields.
- `no solution`, `unique solution`, and `infinitely many solutions` are semantic choices.
- For a scalar multiple answer, zero is rejected when a nonzero eigenvector/basis vector is required.

### Diagram semantics

- Vector diagrams derive from exact coordinates and show axes, scale, origin, arrow direction, and labels.
- Transformation diagrams show source and image of basis vectors; drawn size/angle is quantitative only when axes provide it.
- Plane/line visualizations include an accessible equation/parameterization.
- Grid transformations must not rely on perspective or color alone.
- Every graphic has a text/table equivalent sufficient to solve.

### Difficulty philosophy

Difficulty should rise through:

- representation transfer among equations, matrices, maps, geometry, and subspaces;
- more interacting pivots/free variables or structural conditions;
- inverse construction and parameterization;
- choosing an invariant or theorem rather than executing arithmetic;
- non-unique answer equivalence;
- combining two or at most three mastered operations;
- exact radicals or approximation only where they express a genuine concept.

It must not rise through large matrices, ugly fractions created accidentally, long determinant expansions, arbitrary decimal noise, misleading layout, or excessive transcription. Most hand-calculation questions use dimensions `2..4`.

### Global generation metadata

Each instance stores:

`categoryId`, `subcategoryId`, `familyId`, `level`, `field`, `ambientDimensions`, `semanticObjects`, `givensExact`, `requestedObjectType`, `canonicalAnswer`, `equivalenceMode`, `displayAnswer`, `tolerance`, `difficultyDimensions`, `misconceptionsTargeted`, `workedSolution`, `visualDescription`, `dataProvenance`, and `structuralSignature`.

Generate backward from a latent rank, factorization, basis, eigenstructure, or solution set. Validate independently, then render. Reject repeated structural signatures within 20 questions and exact instances within 100.

## 2. Category: Vectors and Geometry

### Category purpose

Build component fluency and geometric meaning for combinations, inner products, projection, and orientation.

### Learn

Vectors add componentwise and scale by multiplying every component. A linear combination `c1v1+...+ckvk` uses scalar weights. The dot product gives length and angle: `||v||=sqrt(v·v)` and `u·v=||u||||v||cosθ`. Projection onto a nonzero vector `v` is `(u·v)/(v·v)v`.

### Common misconceptions

- Mixing points and displacement vectors.
- Scaling only one component.
- Multiplying vectors componentwise when the dot product is requested.
- Dividing projection by `||v||` instead of `||v||²`.
- Normalizing the zero vector.
- Treating the cross product as available in every dimension.

### Family `vector_arithmetic`

**Task.** Add/subtract/scale vectors or recover a missing vector.

**Derivation.** Apply the scalar operation independently to corresponding components.

**Difficulty.** L1 `R²`; L2 `R³/R⁴` fractions; L3 inverse combination.

**Examples.**

1. `(1,2)+(3,−1)=(4,1)`.
2. `2(1,−3,4)=(2,−6,8)`.
3. `u+2v=(5,1)`, `v=(2,−1)` → `u=(1,3)`.

**Validation.** Exact component oracle and dimension agreement.

### Family `linear_combination_coefficients`

**Task.** Compute a linear combination or solve for its coefficients in a small independent set.

**Derivation.** Form the column matrix and solve `Vc=w`.

**Difficulty.** L1 forward combination; L2 coefficients in `R²`; L3 overcomplete set with a specified constraint or choice.

**Examples.**

1. `2(1,0)−3(0,1)=(2,−3)`.
2. `a(1,1)+b(1,−1)=(4,2)` → `a=3,b=1`.
3. determine whether `(1,2,3)` is the displayed combination of two vectors.

**Validation.** Exact reconstruction; unique coefficients required unless parameterization is requested.

### Family `dot_norm_angle`

**Task.** Calculate a dot product, norm, distance, cosine, or angle.

**Derivation.** `u·v=Σu_iv_i`; norm/distance follow; `cosθ=(u·v)/(||u||||v||)` for nonzero vectors.

**Difficulty.** L1 dot/norm; L2 distance/orthogonality; L3 exact cosine/angle.

**Examples.**

1. `(1,2)·(3,4)=11`.
2. `||(3,4)||=5`.
3. `(1,0)`, `(1,1)` → `cosθ=1/sqrt(2)`, `θ=45°`.

**Validation.** Exact radical normalization and Cauchy bound `|dot|≤norm product`.

### Family `vector_orthogonality`

**Task.** Decide orthogonality or solve a component making vectors orthogonal.

**Derivation.** Set dot product to zero and solve.

**Difficulty.** L1 yes/no; L2 missing scalar; L3 construct an orthogonal vector with one additional constraint.

**Examples.**

1. `(1,2)·(2,−1)=0` → orthogonal.
2. `(x,1)⊥(2,4)` → `x=−2`.
3. unit vector in `R²` perpendicular to `(3,4)` with positive first component → `(4/5,−3/5)`.

**Validation.** Dot zero, norm/extra constraint, and uniqueness when asserted.

### Family `vector_projection`

**Task.** Find projection, orthogonal component, or distance to a line through the origin.

**Derivation.** `p=proj_v u=(u·v)/(v·v)v`; residual `u−p` is orthogonal to `v`.

**Difficulty.** L1 projection on axis/unit vector; L2 arbitrary vector; L3 decompose or distance.

**Examples.**

1. project `(3,4)` onto `(1,0)` → `(3,0)`.
2. project `(2,2)` onto `(1,2)` → `(6/5,12/5)`.
3. orthogonal residual in the prior case → `(4/5,−2/5)`.

**Validation.** Reconstruction and residual-dot-direction equals zero.

### Family `cross_product_3d`

**Task.** Compute/interpret `u×v`, orientation, or parallelogram area in `R³`.

**Derivation.** Use the determinant component formula; norm gives area; right-hand orientation determines sign.

**Difficulty.** L1 basis vectors; L2 general integer vectors; L3 area/normal satisfying orientation.

**Examples.**

1. `e1×e2=e3`.
2. `(1,0,0)×(0,2,0)=(0,0,2)`.
3. parallelogram from `(1,0,0),(0,3,4)` has area `5`.

**Validation.** Result orthogonal to both inputs, correct norm, and orientation determinant.

## 3. Category: Linear Systems and Row Reduction

### Category purpose

Connect equations, augmented matrices, row operations, pivots, and complete solution sets.

### Learn

Elementary row operations preserve a system's solution set. Echelon form exposes pivots and free variables; RREF is unique. A row `[0 ... 0 | c]` with `c≠0` is inconsistent. Otherwise each nonpivot variable is free, and the solution is a particular vector plus the nullspace directions.

### Common misconceptions

- Treating columns as equations during matrix translation.
- Applying a row operation to the coefficient part but not the augmented column.
- Believing row swaps change the solution.
- Calling every zero row inconsistent.
- Omitting free parameters or assigning a pivot to every variable.
- Confusing echelon form with RREF.

### Family `system_matrix_translation`

**Task.** Convert between a linear system and coefficient/augmented matrix.

**Derivation.** Fix variable order; each equation becomes one row, inserting zero coefficients for missing variables.

**Difficulty.** L1 two variables; L2 three with missing/reordered terms; L3 recover equations from matrix.

**Examples.**

1. `2x+y=3` → row `[2,1|3]`.
2. `x−2z=4` in order `x,y,z` → `[1,0,−2|4]`.
3. `[0,3,1|−2]` → `3y+z=−2`.

**Validation.** Symbolic equation evaluation agrees row by row.

### Family `row_operation`

**Task.** Apply, identify, or validate one elementary row operation.

**Derivation.** Swap rows, multiply one row by nonzero scalar, or replace one row by itself plus a multiple of another—across every column.

**Difficulty.** L1 swap/scale; L2 replacement; L3 infer operation or choose a useful elimination step.

**Examples.**

1. `R1↔R2` swaps complete rows.
2. `R2←R2−2R1` on `[[1,1|2],[2,3|5]]` → second row `[0,1|1]`.
3. scaling a row by `0` is not an elementary row operation.

**Validation.** Exact application and invertibility of the elementary operation.

### Family `echelon_pivots`

**Task.** Identify whether a matrix is REF/RREF and locate pivot/free columns.

**Derivation.** Apply the normative echelon definitions; variable pivots exclude augmented column.

**Difficulty.** L1 pivot positions; L2 REF versus RREF; L3 augmented pivot/inconsistency distinction.

**Examples.**

1. `[[1,2],[0,3]]` has pivots in columns `1,2`.
2. `[[1,2],[0,1]]` is REF but not RREF.
3. `[0,0|1]` has an augmented pivot and signals inconsistency.

**Validation.** Deterministic pivot scan and echelon predicates.

### Family `compute_rref`

**Task.** Compute the unique RREF of a small matrix.

**Derivation.** Exact Gaussian/Jordan elimination with rational pivots.

**Difficulty.** L1 `2×2`; L2 rectangular/one free column; L3 augmented matrix with fractions or row swap.

**Examples.**

1. `[[1,2],[0,1]]` → `[[1,0],[0,1]]`.
2. `[[1,2],[2,4]]` → `[[1,2],[0,0]]`.
3. `[[0,2,4],[1,1,1]]` → exact unique RREF.

**Validation.** Independent RREF implementations; row equivalence and canonical predicates.

### Family `solve_unique_system`

**Task.** Solve a square/nonsquare system known to have a unique solution and verify it.

**Derivation.** Row-reduce `[A|b]`; read pivot variables.

**Difficulty.** L1 `2×2`; L2 `3×3`; L3 generate from latent solution with reordered equations/fractions.

**Examples.**

1. `x+y=3, x−y=1` → `(2,1)`.
2. triangular system → back-substitute exactly.
3. verify candidate by computing `Ax`.

**Validation.** Exact `Ax=b` and rank `A=n`.

### Family `solve_parametric_system`

**Task.** Express all solutions with free parameters.

**Derivation.** Read pivot equations from RREF; set each free variable to an independent parameter; separate particular and homogeneous directions.

**Difficulty.** L1 one free variable; L2 two free variables; L3 accept alternate valid parameterization.

**Examples.**

1. `x+2y=3` → `(x,y)=(3,0)+t(−2,1)`.
2. `x+y+z=0` → `s(−1,1,0)+t(−1,0,1)`.
3. a different particular point/direction scaling is accepted if it gives the same set.

**Validation.** Particular satisfies system; direction basis spans nullspace; dimension matches nullity.

### Family `classify_system`

**Task.** Determine no/one/infinitely-many solutions from matrix/rank information, optionally as a parameter changes.

**Derivation.** Compare `rank(A)` and `rank([A|b])`; unique additionally requires rank equal variable count.

**Difficulty.** L1 inspect RREF; L2 rank tuple; L3 solve a parameter value changing consistency/rank.

**Examples.**

1. row `[0,0|1]` → no solution.
2. `rank A=rank[A|b]=2` with `3` variables → infinitely many.
3. `rank A=rank[A|b]=3` with `3` variables → unique.

**Validation.** Exact ranks and explicit solution-set oracle.

## 4. Category: Matrices and Linear Transformations

### Category purpose

Build operational matrix fluency while tying every product and inverse to a map or composition.

### Learn

An `m×n` matrix maps `R^n` to `R^m`. `Ax` combines columns of `A`. In `AB`, `B` acts first. A square inverse reverses a map: `A^-1A=I`; not every square matrix is invertible.

### Common misconceptions

- Swapping row/column dimensions.
- Multiplying matrices entrywise.
- Assuming `AB=BA`.
- Reversing composition order.
- Using `1/a_ij` as a matrix inverse.
- Assuming rectangular matrices have two-sided inverses.

### Family `matrix_shape_entries`

**Task.** Identify shape/entry, construct a matrix from a rule, or determine compatible vector dimensions.

**Derivation.** Count rows/columns; evaluate `a_ij`; `m×n` consumes length `n` and outputs length `m`.

**Difficulty.** L1 shape/entry; L2 rule table; L3 compatibility chain.

**Examples.**

1. three rows, two columns → `3×2`.
2. `a_ij=i−j` for `2×3` → `[[0,−1,−2],[1,0,−1]]`.
3. `A` is `4×3`; `Ax` requires `x∈R³` and lies in `R⁴`.

**Validation.** Shape/type checker and rule recomputation.

### Family `matrix_arithmetic`

**Task.** Add/subtract/scale compatible matrices or solve a missing matrix.

**Derivation.** Operate entrywise; addition requires identical shape.

**Difficulty.** L1 `2×2`; L2 fractions/rectangular; L3 inverse equation such as `2X−A=B`.

**Examples.**

1. `[[1,2]]+[[3,−1]]=[[4,1]]`.
2. `−2[[1,0],[3,−1]]=[[-2,0],[-6,2]]`.
3. `2X−A=B` → `X=(A+B)/2`.

**Validation.** Exact entry oracle and shape agreement.

### Family `matrix_vector_product`

**Task.** Compute/interpret `Ax` as row dot products and column combination.

**Derivation.** `Ax=Σx_j a_j`.

**Difficulty.** L1 numeric; L2 identify column combination; L3 recover one coefficient/vector.

**Examples.**

1. `[[1,2],[3,4]](1,0)=(1,3)`.
2. same matrix times `(2,−1)` → `(0,2)`.
3. `Ae_j` equals column `j` of `A`.

**Validation.** Row-dot and column-combination implementations agree.

### Family `matrix_product`

**Task.** Decide compatibility, compute `AB`, or recover a product column.

**Derivation.** Entry `(AB)_ij` is row `i` of `A` dot column `j` of `B`; each product column is `A` times corresponding `B` column.

**Difficulty.** L1 dimensions; L2 `2×2`; L3 rectangular/composition or noncommutativity contrast.

**Examples.**

1. `(2×3)(3×4)` → `2×4`.
2. `[[1,2],[0,1]][[1,0],[3,1]]=[[7,2],[3,1]]`.
3. exhibit small `A,B` where `AB≠BA`.

**Validation.** Independent row-column and column-action products.

### Family `transpose_properties`

**Task.** Compute a transpose or apply transpose identities.

**Derivation.** Swap indices; `(AB)^T=B^TA^T`, `(A^T)^T=A`.

**Difficulty.** L1 transpose; L2 symmetric/skew classification; L3 product transpose/missing shape.

**Examples.**

1. `[[1,2,3]]^T=(1,2,3)`.
2. `[[1,2],[2,4]]` is symmetric.
3. `(AB)^T=B^TA^T`, not `A^TB^T`.

**Validation.** Entry-index identity and random exact product check.

### Family `matrix_inverse`

**Task.** Find/check a `2×2` inverse or solve using a supplied inverse.

**Derivation.** For `[[a,b],[c,d]]`, inverse is `(1/(ad−bc))[[d,−b],[−c,a]]` if determinant nonzero; general small cases may row-reduce `[A|I]`.

**Difficulty.** L1 verify inverse; L2 compute `2×2`; L3 solve `Ax=b` or parameter invertibility.

**Examples.**

1. `I^-1=I`.
2. `[[1,2],[3,4]]^-1=[[-2,1],[3/2,−1/2]]`.
3. if `A^-1` supplied, `x=A^-1b`.

**Validation.** Both `AA^-1=I` and `A^-1A=I`; determinant/rank check.

### Family `lu_factorization`

**Task.** Construct/verify an LU factorization or use it for a solve.

**Derivation.** Record Gaussian elimination multipliers below the diagonal in unit-lower-triangular `L`; the resulting echelon matrix is upper-triangular `U`, so `A=LU`. A later variant states row swaps explicitly as `PA=LU`.

**Difficulty.** L1 identify triangular factors; L2 `2×2/3×3` without pivoting; L3 permutation-aware factorization or forward/back substitution.

**Constraints.** Non-pivoted instances have nonzero leading pivots. The convention `diag(L)=1` is displayed so scaling ambiguity is removed.

**Examples.**

1. upper-triangular `A` → `L=I`, `U=A`.
2. `[[2,1],[6,4]]=[[1,0],[3,1]][[2,1],[0,1]]`.
3. solve `Ax=b` by first solving `Ly=b`, then `Ux=y`.

**Validation.** Exact triangular predicates, unit diagonal, `LU=A` or `LU=PA`, and solution reconstruction.

### Family `transformation_geometry`

**Task.** Identify/construct the matrix of a standard `R²` transformation or map a shape/basis vector.

**Generation.** Rotations by special angles, reflections in coordinate/diagonal lines, axis scalings, shears, and projections onto coordinate axes.

**Derivation.** Matrix columns are `T(e1),T(e2)`; apply to vertices.

**Difficulty.** L1 basis images; L2 identify transformation; L3 compose two transformations in correct order.

**Examples.**

1. reflection across x-axis → `[[1,0],[0,−1]]`.
2. `90°` counterclockwise rotation → `[[0,−1],[1,0]]`.
3. shear then reflection → multiply matrices in application order.

**Validation.** Basis-image reconstruction and exact vertex mapping.

## 5. Category: Determinants and Invertibility

### Category purpose

Use determinant as signed volume scaling and connect it to pivots, singularity, and inverse existence.

### Learn

`det(A)` is signed volume scaling for a square linear map. It is multiplicative. A row swap reverses sign, row scaling scales the determinant, and adding a multiple of another row leaves it unchanged. `det(A)≠0` is equivalent to invertibility.

### Common misconceptions

- Taking a determinant of a rectangular matrix.
- Computing `ad+bc` for `2×2`.
- Forgetting row-operation effects.
- Treating determinant as entrywise.
- Believing `det(A+B)=det A+det B`.
- Confusing zero determinant with zero matrix.

### Family `determinant_compute`

**Task.** Compute a determinant of an exact `2×2`/`3×3` matrix.

**Derivation.** `2×2` formula; `3×3` cofactor or elimination from a friendly template.

**Difficulty.** L1 triangular/`2×2`; L2 general `3×3`; L3 parameter determinant.

**Examples.**

1. `det[[a,b],[c,d]]=ad−bc`.
2. `det[[1,2],[3,4]]=−2`.
3. upper triangular matrix → product of diagonal entries.

**Validation.** Bareiss/exact permutation oracle plus independent elimination.

### Family `determinant_row_operations`

**Task.** Track determinant through row operations or compute via elimination.

**Derivation.** Swap `×−1`; scale row by `c` gives `×c`; row replacement unchanged.

**Difficulty.** L1 one operation; L2 sequence; L3 infer original determinant from transformed matrix.

**Examples.**

1. one row swap changes `5` to `−5`.
2. multiply one row by `3` changes determinant by factor `3`.
3. `R2←R2+4R1` leaves determinant unchanged.

**Validation.** Exact determinant before/after and accumulated multiplier.

### Family `cofactor_expansion`

**Task.** Compute a selected minor/cofactor or choose an efficient row/column expansion.

**Derivation.** `C_ij=(−1)^(i+j)M_ij`; determinant is sum of entries times cofactors along one row/column.

**Difficulty.** L1 minor/sign; L2 sparse `3×3`; L3 sparse `4×4`.

**Examples.**

1. sign pattern starts `+ − +`.
2. `C_12=−M_12`.
3. choose a row with two zeros for shortest expansion.

**Validation.** Exact submatrix determinant and full determinant agreement.

### Family `invertibility_equivalences`

**Task.** Infer equivalent structural facts for an `n×n` matrix.

**Response mode.** Multiple-select or single-choice implication.

**Derivation.** For square `A`, equivalent facts include `det≠0`, rank `n`, RREF `I`, no free variables, nullspace `{0}`, columns basis `R^n`, and unique `Ax=b` for every `b`.

**Difficulty.** L1 determinant/inverse; L2 pivots/nullspace; L3 distinguish rectangular near-analogues.

**Examples.**

1. `det A=0` → not invertible.
2. pivot in every column of square `A` → invertible.
3. nonzero null vector → singular.

**Validation.** Generate from latent rank and ensure all selected facts agree.

## 6. Category: Vector Spaces, Span, Basis, and Dimension

### Category purpose

Move from calculations with vectors to structural reasoning about sets of vectors and the four fundamental subspaces.

### Learn

A subspace contains zero and is closed under addition and scalar multiplication. Span is all linear combinations. A basis is both independent and spanning; its size is dimension. Pivot columns of the original matrix form a column-space basis, nonzero rows of an echelon form span the row space, and RREF solves the nullspace.

### Common misconceptions

- Testing only whether zero belongs to a set.
- Confusing union with span.
- Treating a spanning list with redundancy as a basis.
- Choosing RREF columns as original column-space basis vectors.
- Using pivot columns as nullspace directions.
- Believing rank plus nullity equals row count instead of column count.

### Family `subspace_test`

**Task.** Decide whether a described subset of `R^n` is a subspace and identify a failed axiom.

**Generation.** Homogeneous linear constraints, spans, affine shifts, inequalities, unions, and simple polynomial-coordinate sets.

**Difficulty.** L1 contains-zero counterexample; L2 closure; L3 distinguish affine plane/union.

**Examples.**

1. `{(x,y):x+y=0}` → subspace.
2. `{(x,y):x+y=1}` → not; zero absent.
3. union of x- and y-axes → not closed under addition.

**Validation.** Template proof/counterexample certificate, not random testing alone.

### Family `span_membership`

**Task.** Decide whether `w` lies in the span of supplied vectors and give coefficients when it does.

**Derivation.** Solve `Vc=w`.

**Difficulty.** L1 standard axes; L2 independent/nonorthogonal set; L3 dependent set or nonmembership certificate from RREF.

**Examples.**

1. `(3,4)∈span{(1,0),(0,1)}`.
2. `(1,2,3)∉span{(1,0,0),(0,1,0)}`.
3. coefficients for a generated span membership instance.

**Validation.** Exact system classification and reconstruction.

### Family `linear_independence`

**Task.** Determine independence or find a nontrivial dependence relation.

**Derivation.** Solve `Vc=0`; independent iff only `c=0`.

**Difficulty.** L1 visible multiples/standard vectors; L2 square determinant/rank; L3 rectangular set and dependence coefficients.

**Examples.**

1. `{(1,0),(0,1)}` independent.
2. `{(1,2),(2,4)}` dependent with `2v1−v2=0`.
3. four vectors in `R³` must be dependent.

**Validation.** Exact nullspace; nontrivial certificate reconstructs zero.

### Family `basis_dimension`

**Task.** Select/construct a basis for a span/subspace and state dimension.

**Derivation.** Reduce generator matrix, retain independent generators appropriate to the target space.

**Difficulty.** L1 remove duplicate/multiple; L2 column-space basis; L3 basis from homogeneous constraints.

**Examples.**

1. `span{(1,0),(0,1),(1,1)}` basis may be first two; dimension `2`.
2. plane `x+y+z=0` basis `{(−1,1,0),(−1,0,1)}`.
3. zero subspace → empty basis, dimension `0`.

**Validation.** Accepted basis vectors lie in target, are independent, and count equals exact dimension.

### Family `basis_coordinates`

**Task.** Convert between a vector and coordinates in an ordered basis.

**Derivation.** With basis matrix `B=[b1 ... bn]`, solve `B[v]_B=v`.

**Difficulty.** L1 scaled axes; L2 nonorthogonal basis; L3 reconstruct vector or compare two bases.

**Examples.**

1. `B=((1,0),(0,1))`, `v=(3,4)` → `[v]_B=(3,4)`.
2. `B=((1,1),(1,−1))`, `v=(4,2)` → `(3,1)`.
3. coordinates `(2,−1)` in that basis → vector `(1,3)`.

**Validation.** Exact basis-matrix reconstruction; ordered basis preserved.

### Family `fundamental_subspaces`

**Task.** Find/identify bases for column, row, null, or left-null space and their ambient dimensions.

**Derivation.** Original pivot columns for `Col(A)`; nonzero RREF rows for `Row(A)`; solve `Ax=0` and `A^Ty=0`.

**Difficulty.** L1 identify ambient space; L2 basis one subspace; L3 relate orthogonal complements/four dimensions.

**Examples.**

1. `A` is `m×n`: `Col(A)⊆R^m`, `Null(A)⊆R^n`.
2. pivot columns `1,3` → use original columns `1,3` for column-space basis.
3. left nullspace is `Null(A^T)` and has dimension `m−rank(A)`.

**Validation.** Exact subspace basis/equivalence checks.

### Family `rank_nullity`

**Task.** Infer rank, nullity, pivot/free counts, or missing dimension.

**Derivation.** For `A:m×n`, `rank(A)+nullity(A)=n`; row rank equals column rank.

**Difficulty.** L1 pivot count; L2 dimension equation; L3 combine with left-null/column dimensions.

**Examples.**

1. `3×5` rank `3` → nullity `2`.
2. two pivots → row/column-space dimension `2`.
3. `4×3` rank `2` → left-null dimension `2`.

**Validation.** Exact latent rank and all dimension identities.

## 7. Category: Linear Maps and Change of Basis

### Category purpose

Treat matrices as coordinate representations of maps and make coordinate-system changes explicit.

### Learn

A map is linear when it preserves sums and scalar multiples. Its kernel is sent to zero; its image is all outputs. A matrix's columns are images of domain basis vectors. Changing bases changes coordinates and matrices, not the underlying vector or map.

### Common misconceptions

- Checking only `T(0)=0` for linearity.
- Confusing kernel with solutions of `Ax=b`.
- Swapping domain/codomain basis order.
- Reversing composition matrices.
- Treating similar matrices as equal.
- Applying a change-of-basis matrix in the wrong direction.

### Family `linearity_check`

**Task.** Determine whether a concrete map is linear and identify a counterexample/rule.

**Generation.** Matrix maps, coordinate permutations, affine translations, squaring, absolute value, and fixed-coordinate projections.

**Difficulty.** L1 `T(0)` rejection; L2 addition/scaling; L3 parameter making a map linear.

**Examples.**

1. `T(x,y)=(x+1,y)` not linear because `T(0)≠0`.
2. `T(x,y)=(2x−y,x)` linear.
3. `T(x,y)=(x,ky)` linear for every real `k`.

**Validation.** Template algebraic certificate/counterexample.

### Family `kernel_image`

**Task.** Find kernel/image basis, dimension, injectivity, or surjectivity for a matrix map.

**Derivation.** Kernel is nullspace; image is column space. Injective iff nullity zero; onto `R^m` iff rank `m`.

**Difficulty.** L1 identify; L2 compute one basis; L3 infer map properties/dimensions.

**Examples.**

1. identity map has kernel `{0}` and full image.
2. projection `(x,y)→(x,0)` has kernel y-axis, image x-axis.
3. `A: R³→R²` rank `2` → onto, nullity `1`, not injective.

**Validation.** Exact fundamental-subspace oracles and map-property equivalences.

### Family `matrix_of_linear_map`

**Task.** Construct a map matrix from basis-vector images or evaluate a map from its matrix.

**Derivation.** Standard matrix columns are `T(e_j)`; nonstandard matrix columns are output coordinates of mapped input basis vectors.

**Difficulty.** L1 standard basis; L2 formula→matrix; L3 nonstandard domain/codomain bases.

**Examples.**

1. `T(e1)=(1,2),T(e2)=(3,4)` → `[[1,3],[2,4]]`.
2. `T(x,y)=(x+y,2y)` → `[[1,1],[0,2]]`.
3. coordinate columns in declared bases build `[T]_(C←B)`.

**Validation.** Apply matrix to each basis coordinate and compare semantic map.

### Family `map_composition`

**Task.** Compute/interpret a composition matrix and its dimensions.

**Derivation.** If `S:U→V`, `T:V→W`, then `[T∘S]=[T][S]` in compatible bases.

**Difficulty.** L1 order choice; L2 product; L3 three maps or recover one invertible factor.

**Examples.**

1. rotate then reflect → `R_reflect R_rotate`.
2. `S` is `3×2`, `T` is `4×3` → composition `4×2`.
3. if `T` invertible and `TS=C`, then `S=T^-1C`.

**Validation.** Basis-vector action and exact product agree.

### Family `change_of_basis_similarity`

**Task.** Convert coordinate vectors or a transformation matrix between ordered bases.

**Derivation.** Basis matrix `P_B` maps B-coordinates to standard: `v=P_B[v]_B`; `[v]_B=P_B^-1v`. For same-space map, `[T]_B=P_B^-1AP_B`.

**Difficulty.** L1 coordinates; L2 basis-to-basis matrix; L3 similarity transform.

**Examples.**

1. `P_B` columns are basis vectors.
2. standard vector `v` → `[v]_B=P_B^-1v`.
3. `D=P^-1AP` represents the same map in the `P` basis.

**Validation.** Round-trip coordinates and commutative-diagram action on basis vectors.

## 8. Category: Eigenvalues, Eigenvectors, and Dynamics

### Category purpose

Train invariant-direction reasoning and use eigenstructure for diagonalization, matrix powers, and simple evolution models.

### Learn

`v≠0` is an eigenvector of `A` with eigenvalue `λ` when `Av=λv`. Eigenvalues satisfy `det(A−λI)=0`; the eigenspace is `Null(A−λI)`. A matrix is diagonalizable when it has enough independent eigenvectors.

### Common misconceptions

- Accepting the zero vector as an eigenvector.
- Treating every scalar in `Av=λv` with `v=0` as an eigenvalue.
- Computing eigenvalues entrywise or from row reduction of `A`.
- Confusing algebraic and geometric multiplicity.
- Assuming every matrix is diagonalizable.
- Permuting `P` columns without matching `D`.

### Family `eigenpair_check`

**Task.** Verify an eigenpair or recover `λ`/a missing vector component.

**Derivation.** Compute `Av` and test whether it is a single scalar multiple of nonzero `v`.

**Difficulty.** L1 diagonal matrix; L2 general `2×2`; L3 solve parameter.

**Examples.**

1. `A=diag(2,3)`, `v=e1` → `λ=2`.
2. `[[2,1],[1,2]](1,1)=3(1,1)`.
3. `v=0` is not an eigenvector.

**Validation.** Exact residual `Av−λv=0` and nonzero check.

### Family `characteristic_polynomial`

**Task.** Compute/identify `det(A−λI)` under one pinned sign convention.

**Derivation.** Form symbolic polynomial matrix and determinant; normalize leading sign according to displayed convention.

**Difficulty.** L1 diagonal/triangular; L2 `2×2`; L3 friendly `3×3`.

**Examples.**

1. `diag(2,3)` → `(2−λ)(3−λ)` under `det(A−λI)`.
2. `[[a,b],[c,d]]` → `λ²−(a+d)λ+(ad−bc)`.
3. triangular matrix eigenvalues are diagonal entries.

**Validation.** Exact polynomial determinant and trace/determinant coefficient checks.

### Family `find_eigenvalues`

**Task.** Find eigenvalues with algebraic multiplicities for a generated matrix.

**Derivation.** Factor the exact characteristic polynomial, generated from known rational/integer roots or symmetric quadratic radicals.

**Difficulty.** L1 triangular; L2 distinct `2×2`; L3 repeated or exact-radical symmetric matrix.

**Examples.**

1. `diag(2,−1)` → `2,−1`.
2. `[[2,1],[1,2]]` → `3,1`.
3. repeated characteristic factor `(λ−4)²` → eigenvalue `4`, algebraic multiplicity `2`.

**Validation.** Polynomial roots/multiplicities, trace sum, determinant product.

### Family `eigenspace_basis`

**Task.** Find a basis/dimension for an eigenspace.

**Derivation.** Solve `(A−λI)v=0`.

**Difficulty.** L1 diagonal; L2 general `2×2`; L3 repeated eigenvalue with geometric multiplicity `1` or `2`.

**Examples.**

1. `diag(2,3)`, `λ=2` → span `{e1}`.
2. `[[2,1],[1,2]]`, `λ=3` → span `{(1,1)}`.
3. `A=4I_2`, `λ=4` → eigenspace `R²`, dimension `2`.

**Validation.** Basis equivalence, nonzero independent vectors, correct nullity.

### Family `diagonalization`

**Task.** Decide diagonalizability or construct/verify `A=PDP^-1`.

**Derivation.** Collect enough independent eigenvectors as `P` columns and matching eigenvalues on `D`.

**Difficulty.** L1 distinct eigenvalues; L2 construct `P,D`; L3 repeated eigenvalue/geometric multiplicity decision.

**Examples.**

1. two distinct eigenvalues for `2×2` → diagonalizable.
2. `[[2,1],[1,2]]` accepts `P=[(1,1),(1,−1)]`, `D=diag(3,1)`.
3. `[[1,1],[0,1]]` not diagonalizable: eigenspace dimension `1`.

**Validation.** `P` invertible, `D` diagonal, exact `AP=PD`, eigenvalue multiplicities.

### Family `eigen_matrix_powers_dynamics`

**Task.** Use eigenvectors/diagonalization for `A^k x`, a recurrence, or a simple stochastic transition.

**Derivation.** `A^k=PD^kP^-1`; eigenvector components scale by `λ^k`. Markov matrices state row/column convention explicitly.

**Difficulty.** L1 eigenvector power; L2 diagonalized initial vector; L3 two-state Markov/long-run choice.

**Examples.**

1. `Av=3v` → `A^4v=81v`.
2. if `x=c1v1+c2v2`, then `A^kx=c1λ1^kv1+c2λ2^kv2`.
3. a declared column-stochastic matrix preserves total probability because columns sum to `1`.

**Validation.** Exact repeated multiplication for small `k`, factorization oracle, and probability nonnegativity/sum.

## 9. Category: Orthogonality, Least Squares, and Spectral Structure

### Category purpose

Use orthogonality to construct stable decompositions, solve inconsistent systems approximately, and connect symmetric eigenstructure to SVD.

### Learn

An orthonormal basis makes coordinates direct dot products; for a merely orthogonal basis, divide by each basis vector's squared norm. `Col(A)⊥Null(A^T)`. Gram–Schmidt builds an orthogonal basis by subtracting projections. Least squares chooses `x̂` so the residual `b−Ax̂` is orthogonal to `Col(A)`. Symmetric matrices have orthonormal eigenvectors, and singular values measure non-negative axis scaling.

### Common misconceptions

- Confusing orthogonal with independent without considering zero.
- Normalizing before subtracting the correct projections.
- Projecting onto each vector of a nonorthogonal basis independently.
- Treating least squares as exact `Ax=b`.
- Writing normal equations with reversed dimensions.
- Assuming every matrix has an orthogonal eigenbasis.
- Treating singular values as signed eigenvalues.

### Family `orthogonal_complement`

**Task.** Find/identify an orthogonal complement or use `Col(A)⊥Null(A^T)` and `Row(A)⊥Null(A)`.

**Derivation.** Convert dot constraints into a homogeneous system.

**Difficulty.** L1 complement of one vector; L2 subspace basis; L3 fundamental-subspace relation/dimensions.

**Examples.**

1. span `{(1,0)}` in `R²` has complement span `{(0,1)}`.
2. vectors orthogonal to `(1,1,1)` satisfy `x+y+z=0`.
3. `dim W+dim W^⊥=n`.

**Validation.** Cross-dot zero, basis independence, and dimension sum.

### Family `gram_schmidt`

**Task.** Perform one/all Gram–Schmidt steps and optionally normalize.

**Derivation.** `u_k=v_k−Σproj_(u_j)v_k`; then `q_k=u_k/||u_k||`.

**Difficulty.** L1 one subtraction; L2 two-vector orthonormal basis; L3 three vectors/exact radicals.

**Examples.**

1. from `(1,0),(1,1)` → orthogonal `(1,0),(0,1)`.
2. normalize `(3,4)` → `(3/5,4/5)`.
3. reject dependent input producing zero residual when a full basis was promised.

**Validation.** Same span for every prefix, pairwise orthogonal/unit as requested.

### Family `qr_factorization`

**Task.** Construct/verify thin QR for a full-column-rank small matrix.

**Derivation.** Gram–Schmidt columns to `Q`; set `R=Q^TA`. Require positive diagonal `R` for a unique expected convention.

**Difficulty.** L1 identify dimensions; L2 orthogonal columns; L3 nonorthogonal `3×2`.

**Examples.**

1. `A:m×n` full column rank → thin `Q:m×n`, `R:n×n`.
2. already orthonormal columns → `Q=A,R=I`.
3. verify `Q^TQ=I` and `QR=A`.

**Validation.** Exact reconstruction, orthonormality, upper-triangular/positive diagonal.

### Family `least_squares`

**Task.** Find/check least-squares solution for a small inconsistent system or line fit.

**Derivation.** Solve `A^TA x̂=A^Tb` when columns are independent, or use QR: `Rx̂=Q^Tb`.

**Difficulty.** L1 one-column fit; L2 `3×2`; L3 intercept/slope fit to three friendly points.

**Examples.**

1. approximate `(1,2)` by span `(1,1)` → coefficient `3/2`.
2. residual at solution is orthogonal to every column of `A`.
3. fit a line `y=mx+c` to a small generated table with exact rational result.

**Validation.** Normal-equation residual, QR agreement, and objective comparison around solution.

### Family `projection_matrix`

**Task.** Construct/apply/check an orthogonal projection matrix.

**Derivation.** For full-column-rank `A`, `P=A(A^TA)^-1A^T`; for orthonormal `Q`, `P=QQ^T`.

**Difficulty.** L1 coordinate-axis projection; L2 one-vector formula; L3 subspace matrix/properties.

**Examples.**

1. onto x-axis → `[[1,0],[0,0]]`.
2. onto span `(1,1)` → `(1/2)[[1,1],[1,1]]`.
3. projection satisfies `P^2=P` and `P^T=P`.

**Validation.** Exact symmetry/idempotence, image/kernel, and projected residual orthogonality.

### Family `symmetric_spectral`

**Task.** Use the spectral theorem for a real symmetric matrix: orthogonal eigenvectors, decomposition, or definiteness.

**Derivation.** Generate `A=QΛQ^T` from exact-friendly orthogonal `Q`; eigenvalue signs determine definiteness.

**Difficulty.** L1 symmetry/orthogonality fact; L2 spectral reconstruction; L3 classify positive/negative/indefinite.

**Examples.**

1. distinct-eigenvalue eigenvectors of symmetric `A` are orthogonal.
2. `A=QΛQ^T` with orthogonal `Q`.
3. eigenvalues `2,5` → positive definite; `−1,3` → indefinite.

**Validation.** `A=A^T`, `Q^TQ=I`, reconstruction, eigenvalue/sign checks.

### Family `quadratic_form`

**Task.** Evaluate/classify `x^TAx` for symmetric `A` or interpret its principal-axis form.

**Derivation.** Direct multiplication or use `A=QΛQ^T`, `y=Q^Tx`, giving `Σλ_i y_i²`.

**Difficulty.** L1 evaluate; L2 recover symmetric matrix from polynomial; L3 classify via eigenvalues.

**Examples.**

1. `A=I`, `x^TAx=||x||²`.
2. `2x²+6xy+4y²` corresponds to `[[2,3],[3,4]]`.
3. mixed positive/negative eigenvalues → indefinite.

**Validation.** Symbolic polynomial coefficients and spectral/direct equality.

### Family `singular_value_decomposition`

**Task.** Identify singular values/vectors or construct/verify a tightly generated SVD `A=UΣV^T`.

**Generation.** `2×2` or `3×2` matrices built from diagonal non-negative singular values and signed permutations/exact rational orthogonal factors; rank-deficient cases included. Use the global full-SVD convention unless a thin factorization is explicitly labeled. Full arbitrary SVD is excluded.

**Derivation.** Singular values are square roots of eigenvalues of `A^TA`; right singular vectors are its orthonormal eigenvectors; nonzero left vectors are `u_i=Av_i/σ_i`.

**Difficulty.** L1 diagonal matrix singular values; L2 rank/norm interpretation; L3 verify/reconstruct controlled factorization.

**Examples.**

1. `diag(3,−2)` has singular values `3,2`.
2. rank-one `[[2,0],[0,0]]` has singular values `2,0`.
3. verify `U^TU=I`, `V^TV=I`, `Σ≥0`, and `UΣV^T=A`.

**Validation.** Exact `A^TA` eigenpairs, orthogonality, ordered non-negative values, reconstruction, and rank count.

## 10. Cross-family progression

Recommended order:

1. vector arithmetic, combinations, matrix shape, and `Ax`;
2. systems↔matrices, row operations, pivots, RREF, and unique solutions;
3. dot/norm/orthogonality, matrix products, transformations, LU, and determinants;
4. parametric systems, span, independence, basis, dimension, and inverse/invertibility;
5. fundamental subspaces, rank–nullity, kernels/images, coordinates, and change of basis;
6. eigenpairs, characteristic polynomial, eigenspaces, and diagonalization;
7. projections, Gram–Schmidt, least squares, and QR;
8. symmetric spectral structure, quadratic forms, dynamics, and controlled SVD.

Interleave:

- `Ax` computation with its column-combination meaning;
- row operations with solution-set invariance;
- RREF pivot questions with span/independence/rank questions;
- determinant calculations with invertibility facts;
- elimination multipliers with LU reconstruction;
- coordinate-vector questions in both directions;
- eigenvalue computation with eigenpair verification;
- projection vectors with residual orthogonality;
- factorization construction with reconstruction checks.

Do not unlock advanced families from a broad score. RREF gates nullspaces; basis coordinates gate change of basis; dot/projection gates Gram–Schmidt; eigenspaces gate diagonalization; symmetric eigendecomposition gates SVD.

## 11. Adaptive practice guidance

Track:

`family`, `matrix shape`, `rank`, `pivot pattern`, `free-variable count`, `entry type`, `representation`, `target subspace`, `basis order`, `equivalence mode`, `transformation type`, `eigenvalue multiplicity`, `orthogonality state`, `factorization convention`, and `misconception`.

| Error pattern | Diagnosis | Next item |
|---|---|---|
| says `3×2` consumes `R³` | row/column role reversed | shape→domain/codomain diagnostic |
| computes `Ax` entrywise | matrix action model | row-dot and column-combination paired item |
| multiplies `AB` in application order | composition order reversed | basis-vector action before product |
| changes only part of augmented row | equation equivalence lost | one full-row operation |
| zero row called inconsistent | augmented pivot confusion | contrast `[0,0|0]`/`[0,0|1]` |
| omits free parameter | solution-set incompleteness | RREF pivot/free labeling |
| uses RREF columns for `Col(A)` | row operations changed columns | original/RREF side-by-side pivot selection |
| spanning list accepted as basis | independence omitted | redundancy removal |
| rank+nullity uses row count | theorem ambient confusion | annotate `A:m×n` arrows |
| inverse is reciprocal entries | inverse concept | multiply candidate by `A` |
| determinant row-swap sign missed | orientation/update rule | one-operation determinant drill |
| zero vector accepted as eigenvector | definition missed | eigenpair check with nonzero control |
| repeated eigenvalue ⇒ diagonalizable | geometric multiplicity missed | eigenspace dimension item |
| eigenvector scaling rejected | non-unique representation | same eigenspace with scaled vectors |
| projection denominator `||v||` | normalization/projection confusion | coefficient then vector fields |
| least squares residual set to zero | approximation versus exact solve | residual orthogonal-to-columns item |
| Gram–Schmidt projects onto original nonorthogonal list | algorithm invariant missed | prefix-by-prefix scaffold |
| singular value retains negative sign | eigenvalue/singular-value confusion | diagonal signed matrix contrast |

Recommended selection: 40% weakest due, 25% spaced mastery, 20% misconception/prerequisite diagnostic, 10% representation transfer, 5% bounded synthesis.

Do not penalize an alternative correct basis, eigenvector scale, parameter name, or factor sign/order. Record that the equivalence checker—not the learner—failed if semantic verification cannot decide a supported answer.

## 12. Feedback and worked-solution requirements

Worked solutions must show:

1. object shapes and ambient spaces;
2. the structural goal (eliminate, span, project, diagonalize, etc.);
3. exact row/component/matrix steps;
4. the result in the requested representation;
5. an independent check such as reconstruction, residual, rank, determinant, orthogonality, or dimension.

Diagnostic feedback examples:

> The zero row is `0=0`, so it does not make the system inconsistent. Column 3 is free, giving infinitely many solutions.

> Your vector is a valid eigenvector: it is `−2` times the displayed answer. Eigenvectors are not unique under nonzero scaling.

> These vectors span the plane, but three vectors in a two-dimensional plane are dependent, so the list is not a basis.

Correct but differently represented answers should be acknowledged in the learner's form before showing a convenient canonical form.

## 13. Rendering and accessibility requirements

- Matrices use semantic tables with announced dimensions and row/column coordinates.
- Fractions and radicals have linear-text equivalents.
- Focus moves predictably across matrix cells; paste supports a documented row/column delimiter format.
- Row-operation animations announce the complete before/after row and never rely on color.
- Pivot cells use icon/border plus accessible labels.
- Vector/transformation diagrams expose exact coordinate tables.
- Basis/eigenspace answer cards can be reordered without implying order when none matters.
- Screen-reader text distinguishes transpose, inverse, negative exponent, coordinates relative to a basis, span braces, and augmented separators.

## 14. Generator and implementation requirements

### Semantic-first construction

- Generate from rank factorizations, unimodular row/column operations, chosen solution spaces, `A=PDP^-1`, `A=QΛQ^T`, or `A=UΣV^T`.
- Keep coefficients small after all operations; reject fraction explosion not central to the skill.
- Use exact rational polynomial arithmetic for characteristic polynomials.
- Store source and transformed matrices separately so column-space feedback never substitutes RREF columns.
- Keep ordered-basis direction explicit in identifiers such as `P_(standard←B)`.
- Never use JavaScript `eval` or external arbitrary algebra.

### Independent oracles

- RREF/rank: two exact algorithms or exact elimination plus rank certificates.
- Determinant: Bareiss/permutation for small sizes plus elimination update.
- Inverse: exact Gauss–Jordan plus two-sided multiplication.
- Subspaces: canonical RREF equivalence plus membership/dimension checks.
- Eigenstructure: `Av=λv`, characteristic polynomial, trace/determinant checks.
- Least squares: normal equations plus QR.
- Spectral/SVD: reconstruction, orthogonality, and `A^TA` eigenpairs.

### Offline constraint

The app remains one standalone HTML/JS/CSS page. All generation, exact arithmetic, rendering, and checking run locally. No backend, runtime CAS, numerical library download, or network lookup is assumed. Development tests may use independent tools, but shipped question logic must be self-contained and bounded.

## 15. Automated validation

For every instance:

- all vector/matrix shapes type-check;
- exact entries are normalized and render/parse round-trip;
- latent ranks, pivots, dimensions, and solution classifications agree;
- requested answer object and equivalence mode are explicit;
- all choices are distinct with exactly one semantic answer;
- non-unique answers are checked by properties, not strings;
- diagrams/text/tables share semantic coordinates;
- worked solution reconstructs and verifies the result;
- rejection/history constraints pass.

Property/regression tests:

- rational normalization, zero signs, and radical canonicalization;
- matrix shape compatibility for all operation pairs;
- row operations preserve solution sets and exact RREF uniqueness;
- parametric solution equivalence under different particular points/bases;
- determinant row-operation rules and multiplicativity;
- inverse two-sided identity;
- LU/PLU triangular structure, pivot convention, and reconstruction;
- basis acceptance under reorder/scaling/replacement;
- original pivot columns versus RREF columns;
- all four fundamental-subspace orthogonality/dimensions;
- change-of-basis round trips and similarity action;
- eigenvector scaling, repeated eigenvalues, and defective matrices;
- diagonalization permutation/scaling equivalence;
- Gram–Schmidt prefix spans and zero-residual rejection;
- QR sign convention and reconstruction;
- least-squares residual orthogonality;
- projection symmetry/idempotence;
- symmetric spectral reconstruction/definiteness;
- SVD sign/permutation ambiguity, zero singular values, and reconstruction;
- at least `10,000` deterministic seeds per family and level.

Adversarial equivalence tests must include:

- redundant “basis” vectors;
- a correct span with wrong ambient dimension;
- parameter directions that satisfy `Ax=0` but do not span the full nullspace;
- a particular solution with an incorrect direction basis;
- zero eigenvector;
- correct eigenvalues paired with wrong `P` columns;
- orthogonal but non-unit `Q`;
- `QR=A` with non-upper-triangular `R`;
- SVD factors reconstructed only after an unmatched sign/permutation;
- decimal matrices whose apparent rank changes under rounding—these must not enter exact-rank families.

## 16. Coverage requirements

Across a long mixed session:

- at least 25% of questions ask for structure, interpretation, compatibility, dimension, or validity rather than arithmetic;
- matrices vary across square, tall, and wide shapes;
- rank patterns include full, deficient, zero, and intermediate rank;
- systems balance no/one/infinitely-many solutions and vary pivot positions;
- subspace practice includes membership, independence, basis, coordinates, and all four fundamental subspaces;
- determinant questions balance direct computation with structural effects;
- transformation questions balance algebraic and geometric representations;
- eigenstructure includes distinct, repeated-diagonalizable, and defective examples;
- orthogonality includes exact projections, complements, QR, and least squares;
- non-unique valid representations appear regularly;
- integer answers do not dominate fractions/radicals, but arithmetic remains purposeful;
- every declared misconception is deliberately exercised.

Cross-category synthesis uses mastered prerequisites and normally at most three essential steps. Good synthesis includes RREF→nullspace basis→rank–nullity, or eigenbasis→diagonalization→matrix power. Avoid long unstructured elimination.

## 17. Topic-level quality checklist

- [ ] Scalars are real and exact arithmetic is the default.
- [ ] Every matrix operation validates dimensions first.
- [ ] Vectors are column vectors unless explicitly labeled otherwise.
- [ ] RREF is unique, but row-operation paths are not treated as unique.
- [ ] Parametric solutions describe the complete solution set.
- [ ] Column-space bases use columns of the original matrix.
- [ ] Basis answers are checked by independence, membership, and dimension.
- [ ] The empty list—not `{0}`—is a basis of the zero subspace.
- [ ] Rank–nullity uses the domain/column dimension.
- [ ] Eigenvectors are nonzero and accepted up to valid eigenspace equivalence.
- [ ] Diagonalization keeps eigenvector columns paired with diagonal entries.
- [ ] Projection residuals and least-squares residuals are checked for orthogonality.
- [ ] QR/SVD sign and ordering conventions are explicit.
- [ ] Arbitrary SVD/CAS behavior is not promised.
- [ ] Visuals and accessible descriptions share semantic objects.
- [ ] Every distractor maps to a plausible misconception.
- [ ] Every family has derivation, difficulty progression, three examples, and validation.
- [ ] Difficulty grows through structure and representation, not matrix size.
- [ ] The standalone app needs no backend or runtime algebra service.

## 18. Stable identifiers and recommended navigation

Recommended navigation:

1. Vectors & Geometry
2. Systems & Row Reduction
3. Matrices & Transformations
4. Determinants & Invertibility
5. Vector Spaces & Dimension
6. Linear Maps & Bases
7. Eigenvalues & Dynamics
8. Orthogonality & Least Squares

Stable family identifiers are the backticked identifiers above. If an earlier matrix-arithmetic prototype exists, migrate progress only to equivalent family IDs; arithmetic fluency must not imply mastery of systems, subspaces, eigenstructure, or least squares.
