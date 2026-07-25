# Chemistry — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, chemical-notation/diagram renderer, numeric checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Chemistry

### Topic goal

Develop fluent algebra-based general-chemistry reasoning: interpret chemical notation, connect atomic electron structure to periodic behavior and bonding, conserve atoms and charge, move reliably among particles, amount, mass, concentration, and gas volume, and apply explicitly stated solution, energy, acid–base, and equilibrium models.

This is not a vocabulary deck or a collection of formula substitutions. Repeated practice should improve the learner's ability to choose a chemical model, identify the entities being counted, preserve units and stoichiometric ratios, and reject answers that violate conservation or physical bounds.

### Audience and prerequisites

The target learner is an adult or secondary-school/introductory-college student who knows:

- arithmetic, ratios, percentages, powers of ten, and elementary algebra;
- logarithms for later acid–base questions;
- basic graph/table reading and calculator use;
- the distinction between a number, a unit, and a physical quantity.

No calculus, organic-chemistry course, or laboratory experience is assumed.

### Scope

The topic includes:

- atomic number, mass number, isotopes, ions, and subatomic-particle bookkeeping;
- orbitals, quantum-number validity, subshell capacity, orbital diagrams, electron configurations, valence electrons, and selected periodic trends;
- formula parsing, ionic charge balance, introductory inorganic naming, Lewis structures, formal charge, VSEPR shape, molecular polarity, and introductory intermolecular attractions;
- amount of substance, molar mass, particle counting, percent composition, empirical formulas, and molecular formulas;
- conservation and balancing of small equations, oxidation numbers, reaction stoichiometry, limiting reactants, and percent yield;
- amount concentration (“molarity”), mass concentration, dilution, solution mixing, ideal dissociation, and simple precipitation calculations;
- gas relationships and the ideal-gas law;
- calorimetry, reaction enthalpy, and Hess-law arithmetic;
- idealized strong-acid/base pH, neutralization, equilibrium expressions, reaction quotients, and one-variable equilibrium calculations;
- units, significant figures, graph/table interpretation, and plausibility checks throughout.

The intended ceiling is a solid first course in general chemistry. The app should reach beyond “formula counting” while retaining question families that can be generated and checked exactly in a standalone browser.

### Exclusions

Do not include:

- quantum-mechanical derivations, Schrödinger-equation solving, radial wavefunctions, term symbols, spin–orbit coupling, spectroscopy selection rules, or molecular-orbital calculations;
- electron configurations beyond the supported table, speculative superheavy configurations, or claims that an orbital is a literal electron path;
- transition-metal coordination nomenclature, crystal/ligand-field theory, organometallic chemistry, solid-state band theory, or crystallographic calculation;
- full organic nomenclature, stereochemistry, mechanisms, conformations, synthesis planning, polymers, or biochemistry;
- three-dimensional Lewis structures with disputed expanded-octet interpretations unless the selected teaching model is explicit;
- kinetics rate-law inference, integrated rate laws, electrochemistry, solubility-product calculations, buffers, polyprotic equilibria, titration curves, entropy/free-energy calculations, or phase diagrams in the initial version;
- non-ideal gases, activity-coefficient calculations, fugacity, ionic-strength corrections, or real-solution volume contraction;
- radioactive decay or nuclear reaction calculations;
- open-ended laboratory procedure, qualitative identification by smell/taste, mixing instructions, disposal advice, or safety/compliance judgments;
- free-form mechanisms, explanations, or structure drawings that cannot be checked semantically.

### Educational and safety boundary

All scenarios are idealized paper calculations, not instructions for handling substances.

- Do not generate practical procedures involving concentrated acids/bases, toxic gases, energetic reactions, explosives, controlled substances, unknown chemicals, flames, pressure vessels, or human exposure.
- Solution-preparation questions ask for calculated quantities only; they must not instruct the learner to perform dilution or mixing.
- Hazard pictograms and safety facts are better taught from authoritative fixed material, not randomly generated claims, and are outside this initial dynamic scope.
- A balanced equation or calculated dose/amount does not establish that a reaction is safe, feasible, fast, or complete.

### Authoritative data and terminology

The app ships versioned, reviewed data tables rather than inventing chemistry facts at runtime.

- Element symbols, names, atomic numbers, group/period/block, and abridged standard atomic weights come from a pinned IUPAC periodic-table release.
- Isotopic masses and abundances used in exercises are supplied in the question or a pinned data panel.
- `N_A=6.02214076×10²³ mol⁻¹` is exact under the SI definition of the mole.
- Nomenclature follows the explicitly supported introductory subset of IUPAC inorganic recommendations. Common retained names such as water or ammonia may appear only when listed in the app's alias table.
- Chemical terminology and quantity names follow the pinned IUPAC Gold Book/Green Book vocabulary. UI text may say “molarity” parenthetically, but the normative quantity is **amount concentration**, `c=n/V`.
- Property data such as specific heat, enthalpy, acid constant, density, solubility, and gas constant are supplied or selected from a versioned table and never treated as timeless exact values.

Each generated instance records the data-table version. Updating reference data must trigger regression tests and must not silently change answers for saved question seeds.

### Normative particle and isotope model

- Atomic number `Z` is the number of protons.
- Mass number `A` is the integer number of protons plus neutrons for one nuclide; it is not a decimal standard atomic weight.
- Neutron count is `A-Z`.
- Ionic charge in elementary-charge units is `q=protons-electrons`; therefore electron count is `Z-q`, with `q=+2` for `2+` and `q=-1` for `−`.
- Nuclide notation is rendered as `⁽ᴬ⁾₍Z₎X^q` visually and represented semantically by named fields `{A,Z,symbol,charge}`. Plain-text alternatives such as `A/Z X q` must be unambiguous.
- Isotopic-abundance exercises use a weighted mean of supplied isotopic masses. Percent abundances must sum to `100%` within displayed precision.

### Normative orbital and electron-configuration model

Orbitals receive a substantial category; they are not treated as decorative periodic-table trivia.

- An atomic orbital is a one-electron wavefunction/spatial state, not a circular or planetary path.
- Quantum numbers obey `n=1,2,...`; `l=0..n−1`; `m_l=-l..+l`; `m_s=±1/2`.
- Subshell letters map `l=0,1,2,3` to `s,p,d,f`.
- A subshell has `2l+1` orbitals and capacity `2(2l+1)` electrons. One orbital holds at most two electrons with opposite spins.
- Ground-state orbital diagrams follow Pauli exclusion and Hund's rule within degenerate orbitals.
- The displayed pedagogical filling order may be used to construct ordinary configurations, but the canonical ground-state answer comes from a reviewed element configuration table.
- Initial neutral-atom configuration questions cover `Z=1..36`. Chromium and copper must either be excluded from rule-construction drills or explicitly included as table-backed exceptions (`[Ar]3d⁵4s¹`, `[Ar]3d¹⁰4s¹`); they must never be marked wrong for disagreeing with a naïve exception-free mnemonic.
- Main-group ion questions cover ions whose configurations are unambiguous in the supported model. Later transition-metal ion questions may include `Sc..Zn`, but electrons are removed from the highest principal shell (`4s`) before `3d`, and the question must teach that convention explicitly.
- “Valence electron” is context-sensitive. For main-group exercises it means electrons in the highest occupied principal shell. Transition-metal valence counting is excluded unless a definition is supplied.
- Orbital shapes may be recognized qualitatively (`s` spherical, `p` two-lobed orientation sets); exact probability-density images, `d/f` shape naming, and node calculations are excluded initially.

### Normative formula grammar and rendering

Generated formulas come from a parsed semantic tree, never from string concatenation alone.

Supported grammar:

```text
Formula   := Segment ("·" Segment)*
Segment   := [Multiplier] Group+
Group     := Element [Subscript]
           | "(" Group+ ")" [Subscript]
Element   := one supported element symbol
Multiplier, Subscript := integer 2..12
```

Additional rules:

- An omitted multiplier/subscript means `1`.
- Parentheses nest at most two levels; square coordination brackets are excluded.
- A hydrate dot multiplies the following segment, for example `CuSO4·5H2O`.
- Ionic charge is separate metadata/superscript and is never parsed as an atom subscript.
- State labels `(s)`, `(l)`, `(g)`, `(aq)` are equation metadata, not formula groups.
- Formula capitalization is significant: `Co` and `CO` are different.
- Visual HTML uses proper subscripts/superscripts, while accessible text and answer parsing support plain forms such as `Ca(NO3)2` and `SO4^2-`.
- Structural formulas, line-angle notation, variable polymers, fractional occupancy, and ambiguous adduct syntax are excluded.

### Normative bonding model

- Lewis-electron totals use supplied/group-table valence counts and add electrons for negative charge or subtract for positive charge.
- Formal charge is `FC=valence−nonbonding−½(bonding electrons)`.
- Octet-rule questions use a reviewed species library. Hydrogen has a duet. Electron-deficient, odd-electron, hypervalent, and resonance cases appear only in explicitly labeled later levels.
- Equivalent resonance contributors are accepted as a set; the app must not claim electrons physically oscillate between drawings.
- VSEPR uses electron domains around one central atom; a multiple bond counts as one domain. Geometry comes from a reviewed domain/lone-pair table.
- Molecular polarity is determined from declared bond-dipole directions and molecular geometry. The app must not infer polarity from bond polarity alone.
- Intermolecular-force questions use a declared introductory model: all atoms/molecules have London dispersion; polar neutral molecules additionally have dipole–dipole attraction; hydrogen bonding requires an H bonded to N, O, or F interacting with an available N/O/F lone pair; an ion with a polar molecule may have ion–dipole attraction. These labels describe attractions between particles, not bonds within one molecule.
- Electronegativity and simple bond-type thresholds are not universal laws. Any numeric threshold question must supply the classroom convention being tested.

### Normative reaction model

- An equation species is `{coefficient, formulaTree, charge, phase}`.
- Balancing conserves every element and net charge. Coefficients are positive integers reduced by their greatest common divisor.
- Generated balancing problems have a one-dimensional positive nullspace and exactly one primitive coefficient vector. Equations with multiple independent solutions are rejected.
- Coefficients change amounts of species; subscripts may never be changed to balance an equation.
- A reaction arrow does not by itself guarantee completion, rate, safety, or mechanism.
- Stoichiometric calculations use the supplied balanced equation as the reaction model. Yield and limiting-reactant questions explicitly assume the modeled reaction is the only relevant reaction.
- Aqueous dissociation, strong-electrolyte behavior, precipitation, strong acid/base behavior, and equilibrium are invoked only when the relevant model/data table is displayed.

### Quantity, unit, and answer conventions

Canonical storage uses SI-compatible units. Common accepted units include:

`g, kg, mg, mol, mmol, L, mL, dm³, m³, mol/L, mol·L⁻¹, M, g/L, Pa, kPa, atm, K, °C, J, kJ, J/(g·K), kJ/mol`.

- Surrounding whitespace is ignored; decimal separator follows locale.
- Scientific notation accepts `e` form and `×10^n`.
- Compatible scaled units are accepted unless conversion itself is tested.
- A bare number is accepted only when the answer field displays a fixed unit or the result is dimensionless.
- Chemical formulas are case-sensitive and whitespace-insensitive where whitespace has no chemical meaning.
- Equation coefficients may be entered as named fields or an ordered integer sequence tied visibly to fixed species order.
- Formula answers are compared semantically after parsing, not merely as display strings. Equivalent ionic formulas may be normalized only where the family explicitly permits reordered ions.
- Compound names use normalized case/hyphen/space handling and an explicit alias table; arbitrary synonyms are not inferred.
- Percent accepts `%` or a decimal only when the field labels which representation is expected.
- `pH`/`pOH` are dimensionless displayed quantities.

Compute from unrounded canonical values and round only the requested result. Unless a family overrides it, numeric tolerance is the larger of half a displayed last-place unit and `0.2%` relative. Exact atom counts, particle counts constructed as integers, charges, coefficients, formula trees, configurations, shapes, and choices require exact semantic agreement.

### Significant figures

Significant figures are a small explicit skill, not a hidden rejection mechanism.

- When a prompt asks for significant figures, multiplication/division uses the least number of significant figures and addition/subtraction uses the least precise decimal place.
- Defined counts, stoichiometric coefficients, exact unit conversions, and the exact Avogadro constant do not limit precision.
- Otherwise, accept reasonable extra digits and explain the recommended rounded display.
- Never combine an unstated significant-figure convention with a tight numeric tolerance.

### Difficulty philosophy

Difficulty should rise through:

- deeper formula nesting or inverse construction;
- moving among particle, symbolic, tabular, diagrammatic, and quantitative representations;
- distinguishing related entities or quantities;
- selecting a model and identifying its assumptions;
- conservation across more species;
- an inverse target, competing reagent, or two/three linked steps;
- interpreting charge, phase, electron placement, or equilibrium direction.

It must not rise through obscure compound names, long arithmetic, huge unstructured formulas, memorized constants, illegible subscripts, unsafe scenarios, or exceptions that were not taught. Most advanced items should require at most three essential reasoning stages.

### Global generation metadata

Each instance stores:

`categoryId`, `subcategoryId`, `familyId`, `level`, `modelId`, `assumptions`, `species`, `formulaTrees`, `reactionVector`, `dataTableVersion`, `givensCanonical`, `displayGivens`, `requestedQuantity`, `expectedDimension`, `exactAnswer`, `displayAnswer`, `acceptedForms`, `tolerance`, `difficultyDimensions`, `misconceptionsTargeted`, `workedSolution`, `visualDescription`, and `structuralSignature`.

Generate semantic species/reactions first, solve with an independent oracle, validate constraints, then render. Reject a repeated structural signature within 20 questions and an exact numeric instance within 100.

## 2. Category: Atomic Structure, Orbitals, and Periodicity

### Category purpose

Build an accurate particle-to-periodic-table model and fluent orbital reasoning without presenting orbitals as classical trajectories.

### Learn

`Z` counts protons; `A` counts protons plus neutrons; charge compares protons with electrons. Orbitals are one-electron states described by quantum numbers. Subshells contain orbitals, orbitals contain at most two opposite-spin electrons, and ground-state configurations connect to an element's block and main-group valence pattern.

### Subcategories

1. Nuclides and ions
2. Isotopic abundance
3. Quantum numbers and orbital capacity
4. Configurations and orbital diagrams
5. Periodic location and trends

### Common misconceptions

- Treating standard atomic weight as mass number.
- Changing proton count when an atom becomes an ion.
- Reading `2+` as two extra electrons.
- Treating a `p` subshell as one orbital or allowing more than two electrons per orbital.
- Pairing electrons before occupying degenerate orbitals singly.
- Treating the simple filling order as exception-free fact.
- Removing `3d` electrons before `4s` from first-row transition-metal cations.
- Treating periodic trends as absolute with no defined comparison set.

### Family `subatomic_bookkeeping`

**Task/template.** `For {nuclideOrIon}, find the numbers of protons, neutrons, and electrons.`

**Derivation.** `p=Z`, `n=A−Z`, `e=Z−q`.

**Generation.** L1 neutral; L2 monatomic main-group ion; L3 one field missing or mixed nuclide notation. Use `1≤Z≤36`, `A≥Z`, and positive electron count.

**Distractors/rejection.** Target `n=A`, sign-reversed ion charge, and changing protons. Reject chemically irrelevant extreme charges and ambiguous typography.

**Feedback/validation.** Show all three equations; reassemble `A=p+n` and `q=p−e`.

**Examples.**

1. L1: `²³₁₁Na` → `11 p, 12 n, 11 e`.
2. L2: `³⁵₁₇Cl⁻` → `17 p, 18 n, 18 e`.
3. L3: `A=56, 26 p, 24 e` → `30 n`, charge `2+`, element `Fe`.

### Family `isotope_notation`

**Task.** Construct or interpret nuclide notation from named particle counts.

**Response mode.** Multiple named fields or structured formula input.

**Derivation.** Identify element from `Z=p`; compute `A=p+n` and `q=p−e`.

**Difficulty.** L1 symbol with `A`; L2 full `A,Z`; L3 include ionic charge/inverse missing field.

**Constraints.** Parsed fields are compared semantically; do not make superscript placement a keyboard test.

**Examples.**

1. `6 p, 8 n, 6 e` → `¹⁴₆C`.
2. `8 p, 10 n, 10 e` → `¹⁸₈O²⁻`.
3. `²⁷₁₃Al³⁺` → `A=27, Z=13, q=+3`.

**Validation.** Round-trip notation through the semantic nuclide object.

### Family `isotopic_average`

**Task/template.** `Given the supplied isotope masses and fractional abundances, calculate the average atomic mass.`

**Derivation.** `m̄=Σf_i m_i`, with `Σf_i=1`.

**Generation.** L1 two isotopes/friendly percentages; L2 infer a missing abundance; L3 infer an unknown isotope mass or use three isotopes.

**Misconceptions/rejection.** Distractors use unweighted mean or mass numbers blindly. Reject averages outside `[min mass,max mass]` and rounded abundance sets that do not close visibly.

**Examples.**

1. `10.0 u at 20%, 11.0 u at 80%` → `10.8 u`.
2. abundances `75%` and unknown → second is `25%`.
3. average `35.5 u`, masses `35/37 u` → lighter abundance `75%`.

**Validation.** Weighted sum and bound checks; reconstruct any hidden value.

### Family `quantum_number_validity`

**Task/template.** `Is (n,l,m_l,m_s)={tuple} a permitted one-electron quantum-number set?`

**Response mode.** Yes/no plus reason choice.

**Derivation.** Apply the normative ranges exactly.

**Generation.** L1 identify subshell from `n,l`; L2 valid/invalid tuple; L3 choose all allowed `m_l` or repair one invalid field.

**Distractors.** Use `l=n`, `|m_l|>l`, `m_s=0/1`, or confuse `m_l` with electron count.

**Examples.**

1. `(2,1,0,+½)` → valid, a `2p` orbital state.
2. `(2,2,0,+½)` → invalid because `l≤n−1`.
3. for `3d`, allowed `m_l` → `−2,−1,0,+1,+2`.

**Validation.** Exhaustively enumerate allowed tuples over the supported range.

### Family `subshell_orbital_capacity`

**Task.** Determine orbital count, electron capacity, or subshell label.

**Derivation.** Orbitals `=2l+1`; capacity `=2(2l+1)`.

**Difficulty.** L1 `s/p`; L2 `d/f`; L3 invert capacity or combine with shell capacity `2n²`.

**Misconceptions.** Confuse orbitals with electrons, use `2l`, or give capacity `2` for a whole subshell.

**Examples.**

1. `p` subshell → `3 orbitals`, `6 electrons`.
2. `l=2` → `d`, `5 orbitals`, capacity `10`.
3. shell `n=3` → subshells `3s,3p,3d`, total capacity `18`.

**Validation.** Count enumerated `m_l,m_s` combinations.

### Family `electron_configuration`

**Task/template.** `Give the ground-state electron configuration of {atomOrIon} in {fullOrNobleGas} notation.`

**Derivation.** Look up the neutral configuration in the reviewed table; add/remove electrons by the declared ion rules; normalize subshell order for comparison.

**Generation.** L1 `Z≤10`; L2 main-group through Kr/noble-gas notation; L3 Cr/Cu exception recognition or supported transition-metal cation.

**Misconceptions/rejection.** Target capacity overflow, wrong total, naïve Cr/Cu, and removing `3d` before `4s`. Never ask beyond table coverage.

**Examples.**

1. O → `1s²2s²2p⁴`.
2. Ca → `[Ar]4s²`.
3. Fe²⁺ → `[Ar]3d⁶` after removing `4s` electrons first.

**Validation.** Expand shorthand; confirm electron total and exact table-backed state.

### Family `orbital_diagram`

**Task.** Select or complete the ground-state box-and-arrow diagram for a supplied subshell/configuration.

**Response mode.** Single-choice or structured boxes with `↑/↓`.

**Derivation.** Fill degenerate orbitals singly with parallel spin, then pair; enforce at most two opposite-spin electrons per box.

**Difficulty.** L1 `s/p` occupancy; L2 distinguish Pauli versus Hund violations; L3 derive unpaired-electron count/paramagnetic classification.

**Constraints.** Equivalent permutations of degenerate orbital boxes are accepted. Do not claim a unique left-to-right microstate.

**Examples.**

1. `2p²` → two singly occupied `p` boxes with parallel spin.
2. `2p⁴` → one pair and two parallel unpaired electrons.
3. `[Ne]3s²3p³` → `3` unpaired electrons, paramagnetic in this model.

**Validation.** Check occupancy, total, Pauli, and maximum multiplicity.

### Family `periodic_location_and_trend`

**Task.** Infer period/group/block from a supported configuration, or compare a declared periodic trend.

**Response mode.** Named fields, ordering, or single-choice.

**Derivation.** Period/group/block use table data and main-group configuration patterns. Trend questions use only reviewed comparison sets: same main-group period or group, no hidden exception.

**Difficulty.** L1 locate element; L2 configuration→location; L3 order atomic radius/first ionization energy/electronegativity for a bounded set.

**Misconceptions.** Confuse period with valence count, interpret group direction backward, or apply trend across arbitrary elements as exact.

**Examples.**

1. Na → period `3`, group `1`, `s` block.
2. `[Ne]3s²3p⁵` → period `3`, group `17`, `p` block.
3. same-period `Na, Mg, Cl` atomic radius → `Na > Mg > Cl`.

**Validation.** Table lookup; trend questions restricted to whitelisted monotonic tuples.

## 3. Category: Formulas, Bonding, and Molecular Shape

### Category purpose

Make chemical notation compositional and structural: parse what a formula counts, construct neutral compounds, and connect valence-electron arrangements to shape and polarity.

### Learn

Subscripts multiply the group immediately before them; outside subscripts multiply everything inside parentheses. Ionic formulas have net charge zero in their simplest whole-number ratio. Lewis structures account for valence electrons and formal charge. VSEPR shape follows electron domains, while polarity depends on both bond dipoles and three-dimensional symmetry.

### Subcategories

1. Formula parsing and ionic formulas
2. Introductory inorganic names
3. Lewis structures and formal charge
4. VSEPR, polarity, and intermolecular attraction

### Common misconceptions

- Applying a subscript to only the nearest atom inside parentheses.
- Treating a coefficient as a subscript.
- Copying ion charges as subscripts without reducing the ratio.
- Counting formal charge from bond count alone.
- Counting a double bond as two VSEPR domains.
- Assuming polar bonds always produce a polar molecule.
- Calling an intramolecular covalent bond a “hydrogen bond,” or claiming nonpolar particles have no attractions.

### Family `formula_atom_count`

**Task/template.** `For one formula unit/molecule of {formula}, give the count of each element.`

**Derivation.** Recursively multiply formula-tree counts, segment multipliers, and hydrate multipliers.

**Generation.** L1 simple subscripts; L2 parentheses; L3 nested group or hydrate. At most five elements and total count `≤60`.

**Rejection.** No ambiguous plain typography or meaningless randomly assembled formulas; use reviewed species/templates.

**Examples.**

1. `H2SO4` → `H:2, S:1, O:4`.
2. `Ca(NO3)2` → `Ca:1, N:2, O:6`.
3. `CuSO4·5H2O` → `Cu:1, S:1, O:9, H:10`.

**Validation.** Independent tree walk and format-parse round trip.

### Family `formula_particle_count`

**Task.** Count a named atom, ion group, or total atoms across a coefficient.

**Derivation.** Parse one formula, then multiply by the displayed particle coefficient; preserved polyatomic-ion counts are used only when the formula tree contains that exact group.

**Difficulty.** L1 named element; L2 coefficient plus parentheses; L3 hydrate/total atoms.

**Misconceptions.** Ignore coefficient, multiply only one element, or count distinct element types.

**Examples.**

1. `3 H2O` → `6 H atoms`, `3 O atoms`.
2. `2 Al2(SO4)3` → `6 sulfate groups`, `24 O atoms`.
3. one `MgSO4·7H2O` unit → `27 total atoms`.

**Validation.** Compare direct expanded multiset with recursive result.

### Family `ionic_formula`

**Task/template.** `Construct the simplest neutral formula from {cation} and {anion}.`

**Derivation.** Find least positive integers `a,b` with `a q_c+b q_a=0`; reduce by gcd; parenthesize a polyatomic ion when count exceeds one.

**Generation.** L1 `±1`; L2 unequal charges; L3 polyatomic ions or infer a metal's charge from a formula.

**Misconceptions.** Sum charge magnitudes as subscripts, fail to reduce, omit parentheses, or retain charge in neutral formula.

**Examples.**

1. `Na⁺` and `Cl⁻` → `NaCl`.
2. `Al³⁺` and `O²⁻` → `Al2O3`.
3. `Ca²⁺` and `NO3⁻` → `Ca(NO3)2`.

**Validation.** Parsed formula must have zero net charge and primitive ion ratio.

### Family `introductory_nomenclature`

**Task.** Convert between a formula and supported introductory inorganic name.

**Scope.** Binary ionic compounds, variable-charge metals with Stock numerals, common polyatomic ions from a displayed/mastered table, and binary molecular compounds with prefixes. Acids, hydrates, coordination compounds, and organic names are excluded initially.

**Derivation.** Use the typed species class and pinned name/ion tables; never guess from a general language model.

**Difficulty.** L1 fixed-charge ionic; L2 Stock numeral; L3 binary molecular or inverse formula construction.

**Examples.**

1. `MgCl2` → magnesium chloride.
2. `Fe2O3` → iron(III) oxide.
3. dinitrogen tetroxide → `N2O4`.

**Validation.** Bidirectional table/rule round trip; aliases explicitly enumerated.

### Family `lewis_electron_count`

**Task.** Find the total valence-electron count available for a Lewis structure.

**Derivation.** Sum main-group valence counts; add negative charge, subtract positive charge.

**Difficulty.** L1 neutral molecule; L2 polyatomic ion; L3 identify a count error in a proposed structure.

**Misconceptions.** Use atomic number, ignore charge, or multiply charge by atom count.

**Examples.**

1. `H2O` → `8` valence electrons.
2. `CO3²⁻` → `24` valence electrons.
3. `NH4⁺` → `8` valence electrons.

**Validation.** Element-table sum and parity check.

### Family `formal_charge`

**Task/template.** `In the displayed Lewis structure, what is the formal charge on {atom}, or which structure minimizes formal-charge separation?`

**Derivation.** `FC=V−N−B/2`, where `B` is bonding electrons.

**Generation.** Use semantic bond/lone-pair graphs. L1 one atom; L2 all atoms/net charge; L3 compare reviewed resonance contributors.

**Misconceptions.** Count bond lines instead of bonding electrons inconsistently, omit lone pairs, or confuse formal charge with oxidation state.

**Examples.**

1. O with two single bonds and two lone pairs → `0`.
2. N with four single bonds and no lone pair → `+1`.
3. singly bonded terminal O with three lone pairs → `−1`.

**Validation.** Sum formal charges equals species charge; electron count matches.

### Family `vsepr_geometry`

**Task.** Determine electron-domain geometry and molecular shape from a reviewed Lewis structure or `AX_mE_n`.

**Derivation.** Count bonds as domains regardless of order plus central lone pairs; map `2..6` domains through a pinned VSEPR table.

**Difficulty.** L1 no lone pairs (`AX2..AX4`); L2 lone pairs through tetrahedral domains; L3 five/six domains from whitelisted species.

**Misconceptions.** Double bond as two domains, electron geometry equal to molecular shape, or lone pair as visible atom.

**Examples.**

1. `CO2`, `AX2` → linear.
2. `H2O`, `AX2E2` → tetrahedral electron geometry, bent molecular shape.
3. `SF4`, `AX4E` under stated expanded-octet model → seesaw.

**Validation.** Semantic graph domain count and exact table lookup.

### Family `molecular_polarity`

**Task.** Decide whether supplied bond dipoles cancel in the declared molecular geometry.

**Response mode.** Polar/nonpolar plus optional net-dipole direction.

**Derivation.** Vector-sum symmetry-equivalent bond dipoles; lone-pair effects enter through geometry, not as invented dipole arrows.

**Difficulty.** L1 symmetric equal bonds; L2 bent/pyramidal; L3 asymmetric substituents with a supplied vector diagram.

**Misconceptions.** “Polar bonds means polar molecule,” or “symmetric drawing” without considering 3D geometry.

**Examples.**

1. `CO2` with equal C–O dipoles → nonpolar molecule.
2. `H2O` → polar.
3. `CH3Cl` in tetrahedral geometry → polar.

**Validation.** Whitelisted geometry/species or explicit numeric vector sum; no unsupported electronegativity inference.

### Family `intermolecular_forces`

**Task.** Identify the intermolecular attractions present, or the strongest listed attraction, for a supplied particle or pair under the declared introductory model.

**Response mode.** Multiple-choice or multiple-select.

**Derivation.** All neutral particles receive London dispersion; add dipole–dipole for polar molecules, hydrogen bonding only for the declared donor/acceptor pattern, and ion–dipole for an ion with a polar molecule.

**Difficulty.** L1 dispersion versus dipole–dipole; L2 hydrogen-bond donor/acceptor recognition; L3 distinguish attractions between unlike particles and separate intermolecular from intramolecular bonding.

**Misconceptions/rejection.** Distractors claim no force for nonpolar species, call any H-containing molecule hydrogen-bonding, or select the molecule's covalent/ionic bond. Use a reviewed species library and do not ask ambiguous physical-property rankings.

**Examples.**

1. L1: between `CH4` molecules → London dispersion only in this model.
2. L2: between `H2O` molecules → dispersion, dipole–dipole, and hydrogen bonding; strongest listed is hydrogen bonding.
3. L3: between `Na⁺` and `H2O` → ion–dipole attraction.

**Validation.** Semantic donor/acceptor, charge, and polarity flags generate the answer; multiple-select choices exactly match the modeled set.

## 4. Category: Amount, Molar Mass, and Composition

### Category purpose

Build the central bridge among counted entities, amount of substance, mass, and formula composition.

### Learn

One mole contains exactly `N_A` specified entities. Molar mass adds the atomic-weight contribution of every atom in a formula. Mass percent is a component's mass contribution divided by total molar mass. Empirical formulas give simplest whole-number ratios, while molecular formulas are whole-number multiples.

### Common misconceptions

- Saying “particles” without specifying atoms, molecules, ions, or formula units.
- Using subscripts as mole amounts without the equation coefficient.
- Omitting repeated atoms in molar mass.
- Dividing mass by `N_A` rather than using molar mass.
- Rounding empirical-formula ratios too early.

### Family `molar_mass`

**Task/template.** `Using the supplied atomic-weight table, calculate the molar mass of {formula}.`

**Derivation.** Parse element counts and compute `M=Σcount_i A_r,i` in `g/mol`.

**Difficulty.** L1 binary; L2 parentheses; L3 hydrate. Show contribution table in feedback.

**Examples.**

1. `H2O`, H=`1.008`, O=`16.00` → `18.016 g/mol`.
2. `Ca(OH)2` with supplied weights → `74.092 g/mol`.
3. `CuSO4·5H2O` → sum anhydrous salt plus five waters.

**Validation.** Independent formula-tree traversal; result positive and above each constituent contribution.

### Family `percent_composition`

**Task.** Calculate mass percent of a named element or compare contributions.

**Derivation.** `100×(count×atomic weight)/molar mass`.

**Difficulty.** L1 direct from supplied molar mass; L2 derive molar mass; L3 infer a plausible formula from percentages among choices.

**Misconceptions.** Atom percent instead of mass percent, omit count, or divide by element mass.

**Examples.**

1. H mass percent in `H2O` → about `11.19%`.
2. O percent in `CaCO3` with supplied weights → about `47.96%`.
3. choice whose computed percentages match the rounded analysis.

**Validation.** All element percentages sum to `100%` within rounding.

### Family `mole_mass_particles`

**Task.** Convert among mass, amount, and a specified entity count.

**Derivation.** `n=m/M`; `N=nN_A`. State the entity.

**Difficulty.** L1 grams↔moles; L2 moles↔entities; L3 grams↔atoms within a compound.

**Examples.**

1. `36.032 g H2O`, `M=18.016` → `2.000 mol H2O`.
2. `0.50 mol CO2` → `3.011×10²³ molecules`.
3. `1.00 mol H2O` → `1.204428152×10²⁴ H atoms`.

**Validation.** Unit-chain oracle and entity multiplier check.

### Family `empirical_formula`

**Task/template.** `Given elemental masses or mass percentages, determine the empirical formula.`

**Derivation.** Divide each mass by atomic weight, divide by smallest amount, then multiply all ratios by the smallest permitted integer making them near whole numbers.

**Generation.** Construct from a latent primitive formula and realistic totals. L1 integer ratios; L2 near `x.5`; L3 near thirds/quarters with displayed precision sufficient to distinguish.

**Misconceptions/rejection.** Target mass ratios used as subscripts and premature rounding. Reject ambiguous ratio fits; cap multiplier at `4`.

**Examples.**

1. `12.0 g C, 2.0 g H` with simplified weights → `CH2`.
2. mole ratio `1:1.5` → multiply by `2`, formula ratio `2:3`.
3. `40.0%C, 6.7%H, 53.3%O` → `CH2O` with supplied weights.

**Validation.** Recomputed percent composition matches inputs within their rounding intervals.

### Family `molecular_formula`

**Task.** Determine molecular formula from empirical formula and molar mass.

**Derivation.** `k=M_molecular/M_empirical`; require positive integer `k`; multiply all subscripts.

**Difficulty.** L1 `k=2`; L2 derive empirical mass; L3 combine empirical-analysis result with molar mass.

**Examples.**

1. empirical `CH2O`, molar mass `60.0 g/mol` with simplified empirical mass `30.0` → `C2H4O2`.
2. empirical `NO2`, molecular mass twice empirical → `N2O4`.
3. derive `CH` then `M=78 g/mol` → `C6H6`.

**Validation.** Ratio is integer within declared mass precision and reconstructed mass matches.

## 5. Category: Reactions and Stoichiometry

### Category purpose

Train conservation-aware symbolic balancing and quantitative use of a balanced equation.

### Learn

A balanced equation conserves atoms and charge. Its coefficients are ratios of reacting amounts, not masses. Convert givens to moles, apply the coefficient ratio, then convert to the requested quantity. The limiting reactant is exhausted first under the stated reaction model.

### Common misconceptions

- Changing subscripts to balance an equation.
- Balancing one element while breaking another.
- Using coefficients as mass ratios.
- Choosing the smaller mass as limiting reactant.
- Calculating yield against the wrong theoretical amount.
- Confusing oxidation number with ionic/formal charge.

### Family `balance_equation`

**Task/template.** `Balance {skeleton equation} using the smallest whole-number coefficients.`

**Response mode.** Ordered positive integer fields.

**Derivation.** Build element/charge matrix, find its one-dimensional nullspace, scale to primitive positive integers.

**Difficulty.** L1 two products/simple combustion; L2 four species; L3 include a polyatomic group or charge-conserving ionic equation.

**Examples.**

1. `H2 + O2 → H2O` → `2,1,2`.
2. `Al + O2 → Al2O3` → `4,3,2`.
3. `C2H6 + O2 → CO2 + H2O` → `2,7,4,6`.

**Validation.** Independent atom/charge tally, gcd `1`, unique positive solution.

### Family `equation_conservation_check`

**Task.** Identify whether/properly where a proposed equation violates atom or charge conservation.

**Response mode.** Yes/no plus mismatch selection.

**Derivation.** Count each element and net charge on both sides.

**Difficulty.** L1 one obvious element; L2 coefficients/parentheses; L3 net ionic charge.

**Distractors.** Claims based on molecule count, phase, or visual symmetry.

**Examples.**

1. `H2+O2→H2O` → not balanced; O differs.
2. `2H2+O2→2H2O` → balanced.
3. ionic equation with atoms equal but charge unequal → reject for charge.

**Validation.** Vector equality over elements plus charge.

### Family `oxidation_number_redox`

**Task.** Determine a named atom's oxidation number or identify oxidized/reduced species and agent.

**Scope/model.** Use explicit introductory rules: free element `0`; monatomic ion equals charge; sum equals species charge; F `−1`; O normally `−2`; H normally `+1`. Peroxides/hydrides appear only when labeled with their exception rule.

**Difficulty.** L1 simple compound; L2 polyatomic ion; L3 compare reactant/product and identify agents.

**Examples.**

1. S in `SO4²⁻` → `+6`.
2. Mn in `MnO2` → `+4`.
3. `Zn + Cu²⁺ → Zn²⁺ + Cu`: Zn oxidized/reducing agent; Cu²⁺ reduced/oxidizing agent.

**Validation.** Oxidation-number weighted sum equals species charge; electron changes balance.

### Family `reaction_stoichiometry`

**Task/template.** `Given the balanced equation {equation}, {given amount}. Find {target amount}.`

**Derivation.** Convert given to moles if needed, multiply by coefficient ratio, convert target units.

**Difficulty.** L1 mole ratio; L2 mass→mass; L3 particles/volume or inverse reagent target.

**Examples.**

1. `2H2+O2→2H2O`; `3 mol O2` → `6 mol H2O`.
2. `N2+3H2→2NH3`; `6 mol H2` → `4 mol NH3`.
3. mass-to-mass question using displayed molar masses and one coefficient ratio.

**Validation.** Dimensional factor chain and latent extent-of-reaction oracle.

### Family `limiting_reactant`

**Task.** Identify limiting reactant and theoretical product from two supplied reactant amounts.

**Derivation.** Compare available reaction extents `n_i/ν_i`; minimum is limiting. Product amount is `ν_product×extent`.

**Difficulty.** L1 mole inputs; L2 mass inputs; L3 remaining excess amount.

**Misconceptions/rejection.** Target smaller raw amount/mass and inverted coefficient ratios. Reject near-ties within displayed uncertainty unless exact stoichiometric mixture is the point.

**Examples.**

1. `2H2+O2`; `3 mol H2, 2 mol O2` → H₂ limiting, `3 mol H2O`.
2. `N2+3H2`; `2 mol N2, 3 mol H2` → H₂ limiting, `2 mol NH3`.
3. compute unused excess from initial amount minus consumed stoichiometric amount.

**Validation.** No consumed reactant exceeds available; limiting remainder zero.

### Family `yield_and_purity`

**Task.** Calculate theoretical yield, percent yield, actual yield, or usable reactant from a stated purity.

**Derivation.** `%yield=100×actual/theoretical`; pure mass `=fraction×sample mass`; apply stoichiometry only to pure amount.

**Difficulty.** L1 yield percent; L2 inverse actual/theoretical; L3 purity then stoichiometry/yield.

**Constraints.** Ordinary percent yield is `0..100%`; values above 100 may appear only as a conceptual “evidence of impurity/wet product/model problem” choice, not accepted success.

**Examples.**

1. theoretical `10.0 g`, actual `8.0 g` → `80%`.
2. `75%` yield from theoretical `20 g` → `15 g`.
3. `80%` pure `25 g` sample → `20 g` reactive substance before mole conversion.

**Validation.** Percent bounds and forward/inverse consistency.

## 6. Category: Solutions and Aqueous Species

### Category purpose

Train concentration as an amount-per-volume quantity, distinguish dilution from reaction, and track explicitly modeled dissolved ions.

### Learn

Amount concentration is `c=n/V`, commonly in `mol/L`. Dilution conserves solute amount in the ideal model: `c₁V₁=c₂V₂`. Mixing and reaction are different operations. Ion concentrations follow the formula-unit dissociation ratio only for species declared to dissociate completely.

### Normative solution model

- Volumes are additive only when the prompt says to assume they are.
- Dilution adds solvent and conserves solute amount.
- Strong electrolytes in dissociation questions separate completely according to the shown equation.
- Precipitation questions use a supplied solubility table and assume the listed ionic reaction goes to completion.
- “Concentration” must identify amount concentration or mass concentration; they are never silently interchangeable.

### Family `solution_concentration`

**Task.** Relate solute amount, solution volume, and amount concentration.

**Derivation.** `c=n/V`, with volume in compatible units.

**Difficulty.** L1 direct mol/L; L2 mL conversion; L3 mass→moles→concentration or inverse preparation amount.

**Examples.**

1. `0.50 mol in 2.0 L` → `0.25 mol/L`.
2. `0.020 mol in 250 mL` → `0.080 mol/L`.
3. grams in a stated solution volume using supplied molar mass.

**Validation.** Unit-aware forward/inverse identity.

### Family `mass_concentration`

**Task.** Relate solute mass, solution volume, and mass concentration, or convert it to amount concentration using molar mass.

**Derivation.** `γ=m/V`; `c=γ/M`.

**Difficulty.** L1 `g/L`; L2 volume/mass target; L3 `g/L↔mol/L`.

**Misconceptions.** Treat `g/L` as molarity or divide/multiply by molar mass backward.

**Examples.**

1. `5 g in 0.50 L` → `10 g/L`.
2. `12 g/L` in `250 mL` → `3.0 g`.
3. `58.44 g/L NaCl`, `M=58.44 g/mol` → `1.00 mol/L`.

**Validation.** Dimensional conversion check.

### Family `dilution`

**Task/template.** `A solution of concentration c₁={c1} and volume V₁={v1} is diluted to {given final}. Find {target}. Assume solute amount is conserved.`

**Derivation.** `c₁V₁=c₂V₂`.

**Difficulty.** L1 final concentration; L2 required aliquot/final volume; L3 ask solvent volume added (`V₂−V₁`).

**Misconceptions/rejection.** Target conserving concentration, using added-solvent volume as `V₂`, and unit mismatch. Require `V₂≥V₁`.

**Examples.**

1. `1.0 M, 100 mL` diluted to `500 mL` → `0.20 M`.
2. make `250 mL` of `0.10 M` from `1.0 M` → `25 mL` stock.
3. `50 mL` diluted to final `200 mL` → solvent added `150 mL`.

**Validation.** Initial/final solute amount equality.

### Family `solution_mixing`

**Task.** Find final concentration when solutions of the same nonreacting solute mix, or track a solute through multiple additions.

**Derivation.** `n_total=Σc_iV_i`; divide by stated additive total volume.

**Difficulty.** L1 one solution plus solvent; L2 two concentrations; L3 compare with dilution shortcut and reject misuse when both contain solute.

**Examples.**

1. `100 mL of 1.0 M` plus `100 mL` solvent → `0.50 M`.
2. `100 mL 1.0 M + 100 mL 0.50 M` → `0.75 M`.
3. unequal volumes → sum moles before dividing by total volume.

**Validation.** Final concentration lies between input concentrations for two positive same-solute solutions.

### Family `aqueous_ions_and_precipitation`

**Task.** Determine ideal ion concentration after dissociation or limiting precipitate amount after mixing two declared solutions.

**Derivation.** Dissociation coefficients multiply formula-unit amount. For precipitation, convert ionic amounts and use the supplied net ionic equation/solubility decision.

**Difficulty.** L1 ion ratio; L2 solution volumes/concentrations; L3 mix, identify limiting ion, and find precipitate.

**Misconceptions.** Preserve formula-unit concentration for every ion, ignore total volume after mixing, or precipitate a pair marked soluble.

**Examples.**

1. `0.20 M CaCl2` ideal dissociation → `[Ca²⁺]=0.20 M`, `[Cl⁻]=0.40 M`.
2. `0.10 mol Al2(SO4)3` → `0.20 mol Al³⁺`, `0.30 mol SO4²⁻`.
3. supplied `Ag⁺+Cl⁻→AgCl(s)` amounts → smaller ionic amount limits precipitate 1:1.

**Validation.** Atom/charge balance, nonnegative remainders, and stated volume model.

## 7. Category: Gases and Thermochemistry

### Category purpose

Train ideal-gas state reasoning and energy accounting without implying that all gases, reactions, or calorimeters are ideal.

### Learn

For a fixed amount of ideal gas, `PV/T` is constant; generally `PV=nRT`, with absolute temperature. At constant pressure and temperature, gas volume follows amount. Heat transfer can change temperature (`q=mcΔT`) or contribute to reaction energy. Enthalpy changes add when equations are scaled and combined.

### Family `gas_relationship`

**Task.** Relate two ideal-gas states when amount is fixed and one or two variables are constant.

**Derivation.** `P₁V₁/T₁=P₂V₂/T₂`; temperatures in kelvin.

**Difficulty.** L1 Boyle/Charles proportionality; L2 one-variable numeric; L3 combined state change.

**Examples.**

1. constant `T`, volume halves → pressure doubles.
2. constant `P`, `300 K→450 K`, `2.0 L` → `3.0 L`.
3. combined values with one requested state variable.

**Validation.** State invariant and qualitative trend checks.

### Family `ideal_gas_amount`

**Task/template.** `An ideal gas has {P,V,T}. Using R={RWithUnits}, find {n or another variable}.`

**Derivation.** Rearrange `PV=nRT`; unit system must match supplied `R`.

**Difficulty.** L1 solve `n`; L2 solve another variable; L3 density/molar-mass link `ρ=PM/(RT)`.

**Misconceptions.** Celsius use, incompatible `R` units, and inverted rearrangement.

**Examples.**

1. values constructed so `n=1.00 mol`.
2. solve volume at supplied `P,n,T`.
3. supplied gas molar mass and state → ideal density.

**Validation.** Back-substitute into `PV=nRT`; all absolute values positive.

### Family `gas_stoichiometry`

**Task.** Combine a balanced reaction with ideal-gas amount or same-condition gas-volume ratios.

**Derivation.** Convert gas state to moles, apply equation ratio, then convert target. At identical `T,P`, ideal-gas volume ratio equals mole ratio.

**Difficulty.** L1 same-condition volume ratio; L2 volume→moles→reaction; L3 limiting gas/reactant.

**Examples.**

1. `2H2+O2→2H2O(g)` at same conditions: `3 L O2` needs `6 L H2`.
2. find moles from `PV=nRT`, then product moles.
3. compare reaction extents of two gases from their supplied states.

**Validation.** Ideal-gas and reaction-extent oracles agree.

### Family `calorimetry`

**Task.** Calculate heat, temperature change, or reaction heat from an ideal calorimeter energy balance.

**Derivation.** `q=mcΔT`; for insulated two-part systems `Σq=0`. Calorimeter constant may replace `mc`.

**Difficulty.** L1 one body; L2 reaction heat opposite solution heat; L3 two bodies/final equilibrium temperature.

**Misconceptions.** Celsius absolute conversion when only `ΔT` is needed, losing heat sign, or omitting calorimeter.

**Examples.**

1. `100 g`, `c=4.18 J/(g·K)`, `ΔT=5 K` → `2.09 kJ`.
2. solution gains `+3.0 kJ` → modeled reaction loses `−3.0 kJ`.
3. two-body mixing → solve `m₁c₁(T_f−T₁)+m₂c₂(T_f−T₂)=0`.

**Validation.** Energy sum zero and final temperature lies between initial temperatures for passive mixing.

### Family `reaction_enthalpy_hess`

**Task.** Calculate reaction enthalpy from formation enthalpies or scale/add supplied thermochemical equations.

**Derivation.** `ΔH°rxn=ΣνΔH°f(products)−ΣνΔH°f(reactants)`. Reversing an equation reverses sign; scaling scales `ΔH`.

**Difficulty.** L1 scale/reverse; L2 formation table; L3 combine two/three equations.

**Misconceptions.** Ignore coefficients, add reactants/products without subtraction, or reverse equation without reversing sign.

**Examples.**

1. double an equation with `ΔH=−50 kJ` → `−100 kJ`.
2. reverse it → `+50 kJ`.
3. formation-enthalpy table → coefficient-weighted products minus reactants.

**Validation.** Represent equations as species vectors; vector combination must equal target and enthalpy combination.

## 8. Category: Acids, Bases, and Introductory Equilibrium

### Category purpose

Train logarithmic acidity calculations and equilibrium bookkeeping under visible, deliberately limited solution models.

### Learn

For these ideal dilute-solution exercises, `pH=−log₁₀([H₃O⁺]/c°)` and `pOH=−log₁₀([OH⁻]/c°)`, with `c°=1 mol/L`. At `25°C`, use the supplied `pK_w=14.00`. Strong acids/bases dissociate completely only when declared. Equilibrium constants describe a ratio of equilibrium activities; this app approximates solute activities by `c/c°` when stated.

### Normative equilibrium model

- `⇌` denotes modeled equilibrium; `→` denotes the exercise's completion assumption.
- Equilibrium expressions use dimensionless activities. Under the displayed ideal-dilute approximation, each solute activity is replaced by `c/c°`; pure liquids and solids are omitted.
- Every acid/base item states temperature and supplies `pK_w` when used.
- Strong monoprotic acid and monohydroxide base are the default simple models. Multi-proton stoichiometry appears only with an explicit complete-neutralization equation.
- Weak-acid/base questions use only one dominant 1:1 dissociation with supplied `K_a`/`K_b`; water autoionization is neglected only when a validated dominance check passes.
- Quadratic solutions use the physically valid root. The `x≪c₀` approximation may be used only if requested and then checked (default `x/c₀≤5%`).

### Common misconceptions

- Taking `−log` of a concentration with units without the standard-state ratio.
- Confusing pH with `[H₃O⁺]` or reversing powers of ten.
- Assuming neutral pH is always `7` without temperature.
- Applying initial rather than equilibrium concentrations to `K`.
- Including pure solids/liquids in `K`.
- Using coefficients as multipliers rather than exponents in an equilibrium expression.
- Applying Le Châtelier slogans instead of comparing `Q` with `K`.

### Family `ph_poh_conversion`

**Task.** Convert among `[H₃O⁺]`, `[OH⁻]`, pH, and pOH under supplied `pK_w`.

**Derivation.** Apply logarithm/inverse and `pH+pOH=pK_w`.

**Difficulty.** L1 powers of ten; L2 noninteger log; L3 two-step H/OH conversion.

**Examples.**

1. `[H₃O⁺]=1.0×10⁻³ M` → `pH=3.00`.
2. `pH=4.50` → `[H₃O⁺]=3.16×10⁻⁵ M`.
3. at `25°C`, `pOH=2.30` → `pH=11.70`.

**Validation.** Log/inverse round trip and pH/pOH sum.

### Family `strong_acid_base`

**Task.** Calculate pH/pOH for a declared completely dissociated strong acid/base, including a simple stoichiometric factor when supplied.

**Derivation.** Convert analytical concentration to modeled ion concentration, then apply pH/pOH.

**Difficulty.** L1 monoprotic/monohydroxide power of ten; L2 dilution first; L3 explicitly supplied multiple-ion stoichiometry.

**Misconceptions.** Treat weak acids as strong, ignore dissociation coefficient, or log initial moles instead of concentration.

**Examples.**

1. `0.010 M HCl`, complete → `pH=2.00`.
2. `0.0010 M NaOH`, `pK_w=14.00` → `pH=11.00`.
3. a declared complete `2 OH⁻` per formula unit at `0.0050 M` → `[OH⁻]=0.010 M`.

**Validation.** Dissociation stoichiometry and range/dominance checks.

### Family `acid_base_neutralization`

**Task.** Determine limiting acid/base, excess amount, equivalence volume, or post-reaction pH for strong species.

**Derivation.** Use equivalents from the displayed neutralization equation, consume limiting reagent, divide excess by total additive volume, then calculate pH/pOH.

**Difficulty.** L1 equivalence stoichiometry; L2 limiting/excess; L3 post-mix pH away from exact equivalence.

**Constraints.** Exact-equivalence items ask “neutral under this 25°C strong/strong model” or pH `7.00`; no logarithm of zero. Reject cases where water autoionization dominates the rounded excess.

**Examples.**

1. `25.0 mL 0.100 M HCl` needs `25.0 mL 0.100 M NaOH`.
2. acid moles exceed base moles → compute remaining H₃O⁺.
3. remaining `1.0 mmol OH⁻` in `100 mL` → `0.010 M`, pH `12.00`.

**Validation.** Nonnegative extent/remainder and acid/base mole balance.

### Family `equilibrium_expression`

**Task.** Construct or select the equilibrium-constant expression for a supplied balanced reaction.

**Response mode.** Structured expression or single-choice.

**Derivation.** Products over reactants; activities raised to stoichiometric coefficients; omit pure solids/liquids.

**Difficulty.** L1 all gases/solutes; L2 coefficients as exponents; L3 heterogeneous equilibrium.

**Distractors.** Invert ratio, use coefficients as factors, include solids, or omit an aqueous species.

**Examples.**

1. `A⇌B` → `K=a_B/a_A`.
2. `N2+3H2⇌2NH3` → `K=a_NH3²/(a_N2 a_H2³)`.
3. `CaCO3(s)⇌CaO(s)+CO2(g)` → `K=a_CO2`.

**Validation.** Generate expression from semantic reaction/phase tree.

### Family `reaction_quotient_direction`

**Task.** Calculate/compare `Q` with `K` and predict the direction needed to approach equilibrium.

**Derivation.** Evaluate the same expression as `K` using current activities: `Q<K` forward, `Q>K` reverse, `Q=K` equilibrium.

**Difficulty.** L1 supplied `Q`; L2 compute simple quotient; L3 heterogeneous expression or changed concentration comparison.

**Misconceptions.** Compare one concentration only, reverse direction, or say catalyst changes `K`.

**Examples.**

1. `Q=0.2, K=5` → proceeds forward.
2. `Q=20, K=5` → proceeds in reverse.
3. `Q=K` → already at equilibrium under the model.

**Validation.** Independent quotient evaluation and strict separation from rounding boundary.

### Family `simple_equilibrium_amount`

**Task.** Solve one-variable equilibrium composition for a reviewed 1:1 reaction or weak monoprotic acid.

**Derivation.** Build an ICE table, substitute equilibrium amounts into the supplied `K` expression, solve linear/quadratic equation, select the root satisfying all nonnegative bounds.

**Difficulty.** L1 infer equilibrium values from supplied `x`; L2 solve a perfect-square/friendly `K`; L3 weak acid using exact quadratic or explicitly checked small-`x` approximation.

**Misconceptions/rejection.** Use initial concentrations in `K`, apply the same sign to every ICE row, or select negative/overlarge root. Reject ill-conditioned rounding and cases where neglected water autoionization matters.

**Examples.**

1. `A⇌B`, initial `(1.0,0) M`, change `x=0.20` → equilibrium `(0.80,0.20) M`.
2. `K=[B]/[A]=1`, initial `(1.0,0)` → `x=0.50 M`.
3. weak acid `K_a`, `c₀` supplied → solve `K_a=x²/(c₀−x)` and report pH.

**Validation.** Substitute result into mass balance and `K`; require nonnegative species and unique physical root.

## 9. Cross-family progression

Recommended introduction order:

1. subatomic bookkeeping, isotope notation, simple formula parsing;
2. subshell capacity, quantum-number validity, molar mass, and mole/mass conversion;
3. configurations/orbital diagrams, ionic formulas, equation conservation, and balancing;
4. periodic location, Lewis counts/formal charge, composition, and direct stoichiometry;
5. VSEPR/polarity/intermolecular attraction, empirical formulas, limiting reactants/yield, and solution concentration;
6. dilution/mixing/aqueous ions, gases, calorimetry, and strong-acid/base pH;
7. redox, gas stoichiometry, Hess arithmetic, neutralization, and introductory equilibrium.

Interleave deliberately:

- formula parsing recurs before molar-mass and stoichiometry questions with new syntax;
- orbital capacity precedes configurations; configurations precede periodic-location inference;
- Lewis electron count precedes formal charge, which precedes VSEPR and polarity;
- polarity precedes intermolecular-force classification;
- balancing precedes every reaction-ratio question;
- moles are the bridge between mass, particles, gases, solutions, and reaction quantities;
- acid/base calculations reuse concentration and reaction-extent skills;
- equilibrium-expression selection precedes numeric `Q` or ICE-table work.

Advanced categories unlock by prerequisite family, not by a single chemistry score.

## 10. Adaptive practice guidance

Track:

`family`, `species class`, `formula grammar depth`, `element set`, `entity type`, `charge handling`, `orbital/subshell`, `configuration exception`, `reaction topology`, `target quantity`, `unit conversion`, `stoichiometric direction`, `limiting state`, `solution model`, `logarithm use`, `equilibrium representation`, and `misconception`.

| Error pattern | Likely diagnosis | Next item |
|---|---|---|
| electron count moves with wrong charge sign | ion bookkeeping | paired cation/anion with same `Z,A` |
| decimal atomic weight used as `A` | isotope versus average confusion | nuclide/periodic-table contrast |
| `p` capacity reported as `2` | orbital versus subshell confusion | `m_l` enumeration then capacity |
| early pairing in `p/d` boxes | Hund-rule error | occupancy choice with equal box permutations |
| Cr/Cu or cation error | mnemonic overgeneralization | table-backed exception/removal diagnostic |
| outside subscript applies to one atom | formula-tree parsing | highlight group then expand |
| ionic formula retains common factor | charge ratio not reduced | gcd-focused charge balance |
| Lewis total off by ion charge | charge-electron sign | neutral/anion/cation triplet |
| polar bonds ⇒ polar molecule | geometry cancellation missed | symmetric/asymmetric paired structures |
| H anywhere ⇒ hydrogen bonding | donor/acceptor rule overgeneralized | H bonded to C versus O/N/F contrast |
| atom count missing in molar mass | parser/composition | count table before arithmetic |
| coefficients used as mass ratios | mole bridge missing | equation mole-ratio-only item |
| smaller mass called limiting | reaction extent not compared | `n/ν` two-column diagnostic |
| `mL` used as `L` | volume conversion | same solution arithmetic with isolated unit field |
| stock amount not conserved | dilution model | explicit initial/final mole fields |
| Celsius used in gas ratio | absolute-temperature error | K conversion then same relationship |
| heat sign reversed | system boundary confusion | paired solution/reaction energy ledger |
| pH exponent sign reversed | log/inverse confusion | powers-of-ten pH pair |
| initial values substituted in `K` | equilibrium-state confusion | label ICE rows before expression |
| solid included in `K` | activity/phase rule | heterogeneous-expression contrast |

Recommended selection: 40% weakest due, 25% spaced mastery, 20% misconception/prerequisite diagnosis, 10% representation transfer, 5% bounded synthesis.

When a multi-step response is wrong, identify the first semantic failure—formula parse, entity choice, balance, unit, or ratio—rather than only lowering numbers.

## 11. Feedback and worked solutions

Every quantitative worked solution must show:

1. the named chemical model and assumptions;
2. the entities/species being counted;
3. parsed formula counts or balanced equation when relevant;
4. the symbolic relationship before numbers;
5. a unit-canceling factor chain;
6. final value, unit, and requested rounding;
7. a conservation, charge, bound, trend, or inverse check.

Symbolic feedback must reveal structure:

- formula questions expand the parse tree;
- orbital questions show quantum-number ranges or box occupancy, not a planetary analogy;
- configurations show electron totals and explicitly mark exceptions;
- equations show element/charge tallies;
- limiting-reactant work shows available reaction extents;
- Lewis work shows electron and formal-charge totals;
- equilibrium work labels initial/change/equilibrium values.

Incorrect feedback should diagnose known alternatives:

> Your `Cl⁻` answer has 16 electrons, which corresponds to `Cl⁺`. A `−1` ion has one more electron than its 17 protons, so it has 18.

Do not provide only “use this formula.” Explain why its chemical model applies.

## 12. Rendering and accessibility requirements

- Chemical formulas use semantic subscripts/superscripts; charge signs and magnitudes stay together.
- Plain-text accessible equivalents identify every coefficient, subscript, charge, phase, bond, lone pair, and orbital occupancy needed to answer.
- Equation coefficients are visually distinct from formula subscripts.
- Orbital diagrams label subshells and each box; arrows have text alternatives such as `up`, `down`, or `empty`.
- Lewis diagrams derive from a semantic atom/bond/lone-pair graph. Color is never the sole element/charge cue.
- VSEPR images label central/terminal atoms and provide `AX_mE_n` text.
- Tables put units in headers and retain significant trailing zeroes.
- Unicode minus `−`, hyphen, and ASCII `-` normalize safely in numeric/charge input.
- Keyboard users can fill structured formulas, configurations, coefficients, and diagrams without drag-only interaction.

## 13. Generator and implementation requirements

### Semantic-first generation

- Use reviewed species, reaction, VSEPR, solubility, strong-electrolyte, and configuration libraries.
- Do not generate arbitrary element combinations and assume they describe stable compounds.
- Formula strings, names, diagrams, equations, solvers, and feedback share semantic objects.
- Use integer/rational arithmetic for atom counts, charge, coefficients, and exact ratios.
- Use decimal/rational values from the pinned data table for molar masses; do not route through binary floating point before final tolerance calculation when avoidable.
- Balance equations by exact integer linear algebra, not trial-and-error string mutation.
- Generate empirical-formula and equilibrium problems backward from valid latent answers.

### Offline constraint

The app is a standalone HTML/JS/CSS page. All parsing, generation, rendering, and answer checking run locally. No runtime chemistry database, language model, symbolic algebra server, or backend is assumed. Reference tables are bundled and versioned. Heavy exhaustive/property tests run during development; shipped instances use bounded local validators.

### Data governance

- Store provenance/version with each periodic, atomic-weight, configuration, ion, naming, thermochemical, equilibrium, and solubility table.
- Never mix isotope mass, mass number, relative atomic mass, and molar mass fields.
- Preserve source precision and a separate classroom display precision.
- Generated numeric answers must use the values actually displayed/pinned to the learner.
- A data update requires snapshot review of affected worked examples.

## 14. Automated validation

For every instance:

- all placeholders are filled and notation parses back to the semantic object;
- formula atom counts, total charge, and entity type are unambiguous;
- requested dimensions and accepted units match;
- canonical/display values and tolerance are consistent;
- choices have one correct answer and distinct misconception-based distractors;
- all assumptions/data needed by the solver are visible;
- diagrams and accessible text agree;
- worked solution recomputes the oracle;
- rejection/history rules pass.

Property and independent tests include:

- exhaustive particle bookkeeping over supported `Z,A,q` ranges;
- isotope weighted-average bounds and abundance closure;
- quantum-number enumeration and subshell capacities;
- configuration electron totals, shorthand expansion, Cr/Cu regressions, and transition-ion removal order;
- formula parse/render/parse round trips including parentheses and hydrates;
- ionic-formula neutrality and primitive ratios;
- Lewis electron/formal-charge totals;
- VSEPR table and semantic geometry agreement;
- molar-mass computation by two independent formula traversals;
- percent-composition sum and empirical-formula reconstruction;
- exact reaction atom/charge conservation, nullspace uniqueness, coefficient gcd;
- reaction-extent conservation, limiting remainders, and yield bounds;
- dilution solute conservation and mixing bounds;
- aqueous charge/atom balance;
- gas-law back-substitution and kelvin checks;
- calorimetry energy closure and Hess species-vector closure;
- pH/log inverse identities, acid/base material balance, and `pH+pOH=pK_w`;
- equilibrium mass balance, expression reconstruction, `Q/K` direction, and unique physical root;
- at least `10,000` deterministic seeds per family and level.

Distribution tests limit repeated water/NaCl examples, all-integer molar masses, powers-of-ten pH, `1:1` reactions, neutral species, forward-only targets, and the same elements/configurations. Every supported grammar branch, orbital rule, reaction topology, phase, and misconception must appear deliberately.

### Required regression cases

Maintain hand-audited cases for:

- anion/cation electron-count signs;
- isotope average versus mass number;
- invalid `l=n` and `|m_l|>l`;
- `2p²`, `2p⁴`, Cr, Cu, Fe²⁺, and Fe³⁺;
- nested parentheses and hydrate counts;
- reduced ionic ratios and variable-charge names;
- resonance-equivalent Lewis contributors;
- bent versus linear and symmetric polar-bond cancellation;
- equation with atoms balanced but charge unbalanced;
- near-stoichiometric limiting reactants;
- stock-volume versus solvent-added dilution;
- Celsius versus kelvin gas calculation;
- reaction/solution calorimetry sign;
- exact neutralization versus tiny excess;
- solid omitted from `K`;
- equilibrium quadratic's rejected root.

## 15. Coverage requirements

Across a long mixed session:

- at least 20% of items are symbolic, structural, model-selection, or plausibility tasks rather than numeric substitution;
- atomic/orbital work includes valid and invalid quantum numbers, capacities, Hund/Pauli distinctions, ordinary configurations, explicit exceptions, ions, and periodic inference;
- formulas include simple, parenthesized, and hydrate grammar without letting hydrates dominate;
- particle questions specify atom, molecule, ion, electron, or formula unit;
- reaction questions balance elements and charge and vary target species/direction;
- solution questions distinguish amount concentration, mass concentration, dilution, mixing, dissociation, and reaction;
- gas questions always expose absolute-temperature and unit assumptions;
- acid/base work includes both log directions, acid/base cases, neutralization, expressions, `Q`, and equilibrium amount;
- exact, rounded, forward, inverse, and multiple-representation items are balanced;
- every declared misconception is intentionally generated and tracked.

Cross-category synthesis uses mastered prerequisites and normally at most three essential transformations. Good synthesis includes formula parse→molar mass, mass→moles→reaction ratio, or neutralization→excess concentration→pH. Avoid sprawling laboratory stories.

## 16. Topic-level quality checklist

- [ ] Orbitals are one-electron states, never planetary paths.
- [ ] Orbitals, subshells, shells, and electron capacities are distinguished.
- [ ] Electron configurations use a reviewed table and handle declared exceptions correctly.
- [ ] Transition-metal cations remove the supported highest-`n` electrons first.
- [ ] Atomic weight, isotope mass, mass number, and molar mass are not conflated.
- [ ] Formulas parse from a safe grammar and render accessibly.
- [ ] Generated compounds/reactions come from reviewed semantic templates.
- [ ] Ionic formulas are neutral primitive ratios.
- [ ] Lewis, formal-charge, VSEPR, and polarity oracles share one structure graph.
- [ ] Intermolecular attractions are not confused with bonds within a particle.
- [ ] Equations conserve every element and net charge with primitive coefficients.
- [ ] Stoichiometry uses coefficients as mole ratios.
- [ ] Every quantity names its entity and unit.
- [ ] Empirical-formula ratios are not rounded ambiguously.
- [ ] Dilution conserves solute and mixing states its volume model.
- [ ] Gas and equilibrium temperatures use kelvin.
- [ ] Acid/base and equilibrium assumptions are visible and bounded.
- [ ] Pure solids/liquids are omitted correctly from equilibrium expressions.
- [ ] Reference data are pinned, versioned, and displayed at the precision used.
- [ ] No exercise is actionable hazardous laboratory guidance.
- [ ] Every family has derivation, levels, misconceptions, examples, and validation.
- [ ] Difficulty grows through chemical reasoning rather than obscurity or arithmetic.
- [ ] The standalone app requires no backend or runtime network.

## 17. Stable identifiers and recommended navigation

Recommended navigation:

1. Atoms, Orbitals & Periodicity
2. Formulas, Bonding & Shape
3. Moles, Mass & Composition
4. Reactions & Stoichiometry
5. Solutions & Aqueous Species
6. Gases & Thermochemistry
7. Acids, Bases & Equilibrium

Stable family identifiers are the backticked identifiers above. If an older `chemistry-basics` app exists, migrate progress only to demonstrably equivalent family IDs; atom-count or molar-mass mastery must not imply orbital, bonding, stoichiometric, or equilibrium mastery.
