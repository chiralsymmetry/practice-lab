# Building Science — Dynamic Practice Specification

Status: implementation specification; fictional educational models only,
**not for design, diagnosis, compliance, equipment sizing, or construction**

Audience: building-physics model generator, psychrometric and heat/air/moisture
oracles, diagram/chart renderer, semantic answer checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual requirements meanings.

## 1. Topic overview

### Topic name

Building Science

### Topic goal

Develop fluent, physically coherent reasoning about how heat, air, moisture, and
solar energy move through small fictional buildings. The learner should become
able to:

- distinguish temperature, heat flow, heat flux, power, energy, thermal
  resistance, transmittance, conductance, and heat capacity;
- calculate layer and assembly thermal resistance and U-value under a stated
  steady-state model;
- combine series layers, parallel heat-flow paths, surfaces, openings, and
  explicitly supplied thermal bridges without double-counting;
- follow a temperature profile through an assembly and locate its coldest
  modeled surface/interface;
- reason with dry-bulb temperature, relative humidity, vapour pressure, humidity
  ratio, dew point, and moist-air enthalpy at a stated pressure;
- distinguish vapour diffusion, air-carried moisture, capillary/liquid transport,
  bulk rain, storage, and drying;
- interpret simplified surface/interstitial-condensation screens without
  treating them as real-building diagnoses;
- convert airflow between volumetric flow, air changes, and normalized leakage;
- apply a stated fan-pressure power law and a simple ventilation heat balance;
- calculate solar gains, shading fractions, operative temperature, thermal
  storage, phase shift, and attenuation in bounded models;
- assemble transmission, ventilation, solar, internal, and storage terms into a
  transparent zone heat balance;
- distinguish instantaneous load/power from energy accumulated over time;
- read small weather, pressure-flow, temperature, humidity, heat-flux, and
  thermal-image datasets;
- compare fictional alternatives, revisions, and sensitivities without
  recommending a real intervention;
- state when the supplied model is insufficient for a conclusion.

The app trains calculation, model selection, and diagnostic discipline. It is
not building-performance simulation software or professional advice.

### Audience and prerequisites

The audience ranges from technically curious adults to architecture,
engineering, construction, energy, or building-science students.

Prerequisites:

- algebra, percentages, ratios, exponents, and unit conversion;
- area and volume from drawings;
- basic energy, power, pressure, density, and temperature concepts;
- reading graphs and simple layered diagrams.

Calculus is not required for the core course. Advanced one-zone dynamic
questions use supplied difference equations rather than requiring differential
equation derivation.

### Standards and model boundary

Building-performance methods depend on the purpose, climate, material data,
boundary conditions, geometry, time step, and governing method. The app
therefore uses versioned teaching profiles and never an unlabeled “standard
calculation.”

Qualified review should use the current scopes of:

- [ISO 6946:2017](https://www.iso.org/standard/65708.html), calculation of
  thermal resistance and transmittance for building components/elements;
- [ISO 10077-1:2017](https://www.iso.org/standard/67090.html), thermal
  transmittance of windows and pedestrian doors;
- [ISO 10211:2017](https://www.iso.org/standard/65710.html), detailed thermal
  bridge heat-flow and surface-temperature calculations;
- [ISO 13786:2017](https://www.iso.org/standard/65711.html), dynamic thermal
  characteristics of building components;
- [ISO 13788:2012](https://www.iso.org/standard/51615.html), simplified surface
  humidity and interstitial-condensation calculation methods;
- [ISO 9972:2015](https://www.iso.org/standard/55718.html), building air
  permeability by fan pressurization;
- [ISO 52016-1:2017](https://www.iso.org/standard/65696.html), heating/cooling
  needs, internal temperatures, and sensible/latent loads;
- [ISO 15927-6:2007](https://www.iso.org/standard/35564.html), accumulated
  temperature differences/degree-days;
- the
  [2025 ASHRAE Handbook—Fundamentals psychrometrics chapter](https://handbook.ashrae.org/Handbooks/F25/SI/F25_Ch01/F25_Ch01_si.aspx)
  for moist-air relationships and chart semantics.

These are review anchors, not content reproduced by the app. The profiles are
**ISO/ASHRAE-informed fictional teaching subsets**, not certification or
compliance implementations:

```text
pl-bs-steady-opaque-v1
pl-bs-fenestration-simple-v1
pl-bs-thermal-bridge-given-v1
pl-bs-moist-air-si-v1
pl-bs-diffusion-screen-v1
pl-bs-airflow-powerlaw-v1
pl-bs-zone-balance-v1
pl-bs-one-zone-dynamic-v1
```

Every question stores the profile, version, constants, assumptions, boundary
conditions, material-data version, weather-data version, and oracle version.
Changing any normative teaching assumption creates a new profile ID.

### Professional, health, and safety boundary

Every exercise and export states:

```text
FICTIONAL BUILDING-SCIENCE EXERCISE — NOT FOR DESIGN, DIAGNOSIS, COMPLIANCE,
EQUIPMENT SIZING, REMEDIATION, OR CONSTRUCTION
```

The app must not:

- accept real plans, assemblies, blower-door tests, thermal images, weather
  files, sensor logs, or occupant information in v1;
- declare a real assembly compliant, dry, durable, mould-safe, healthy,
  comfortable, efficient, airtight, or suitable;
- diagnose leaks, dampness, mould, rot, corrosion, poor indoor air quality, or
  occupant symptoms;
- size insulation, HVAC equipment, ventilation, dehumidification, drainage,
  membranes, windows, shading, or air barriers for actual projects;
- recommend products, setpoints, indoor-air thresholds, retrofit measures, or
  construction details;
- use local code, climate, or product data as hidden inputs;
- confuse a simplified condensation screen with transient hygrothermal analysis;
- imply that a thermographic temperature pattern proves a cause;
- infer health or safety from CO₂, humidity, surface temperature, or other
  training values.

Actual work requires applicable standards/codes, calibrated tools, appropriate
climate and material data, validated software, site investigation, and qualified
professionals.

### Normative teaching model

```text
BuildingScienceModel {
  projectId
  revisionId
  geometryRevisionId
  zones[]
  envelopeElements[]
  constructions[]
  materialLayers[]
  surfaceFilms[]
  openings[]
  thermalBridges[]
  leakagePaths[]
  ventilationPaths[]
  internalGains[]
  solarApertures[]
  moistureSources[]
  sensors[]
  schedules[]
  weatherSeries[]
}
```

Each problem declares which mechanisms are active:

```text
PhysicsScope {
  steadyOrDynamic
  oneDimensionalOrNetwork
  conduction
  convectionAsFilm
  longwaveAsFilmOrExplicit
  solarGain
  airExchange
  vapourDiffusion
  moistureStorage
  liquidTransport
  internalSources
  equipmentResponse
}
```

An omitted mechanism is assumed absent only when the scope card says so. A
learner must never infer that “steady-state” or “one-dimensional” describes the
real world.

### Symbols, units, and sign conventions

Default SI teaching notation:

```text
T                 temperature                         °C or K difference
ΔT                temperature difference              K
Q                 heat/energy                         J, kWh
Q̇ or Phi          heat-flow rate/power                W
q                  heat flux                          W/m²
lambda             thermal conductivity               W/(m·K)
R                  area-specific thermal resistance   m²·K/W
U                  thermal transmittance               W/(m²·K)
H                  heat-transfer coefficient          W/K
psi                linear thermal transmittance        W/(m·K)
chi                point thermal transmittance         W/K
C                  heat capacity                      J/K
rho                density                            kg/m³
cp                 specific heat capacity             J/(kg·K)
p                  pressure or vapour pressure         Pa
phi                relative humidity                  0–1 or %
w                  humidity ratio                     kg_vapour/kg_dry_air
h                  moist-air specific enthalpy         kJ/kg_dry_air
Vdot               volumetric airflow                 m³/s or L/s
n                  air-change rate                    1/h
I                  irradiance                         W/m²
g                  total solar-energy transmittance    dimensionless
```

The prompt must disambiguate `R` resistance from relative humidity, `q` flux
from airflow, and `w` humidity ratio from power. Unicode and ASCII fallbacks are
localized.

Positive heat flow is defined per question, normally from the named warm/source
side toward the named cold/sink side. For energy-balance tables, gains are
positive and losses negative unless the prompt explicitly uses magnitudes.
Temperature differences in kelvins and degrees Celsius have the same numeric
magnitude; absolute-temperature equations use kelvins.

### Material, climate, and property data

All physical properties are supplied by the problem or selected from a bundled
fictional dataset. Values are not product claims. Each has:

```text
PropertyValue {
  name
  value
  unit
  temperatureCondition?
  moistureCondition?
  sourceProfileId
  uncertainty?
}
```

Early exercises use constant properties. Later questions may compare two
explicit values or propagate a supplied range, but must not require learners to
recall real material values. Weather is a small fictional series with named time
zone, interval, averaging convention, and units.

### Psychrometric model

The `pl-bs-moist-air-si-v1` profile declares:

- dry air plus water vapour as an ideal-gas mixture;
- total barometric pressure supplied, normally `101.325 kPa`;
- a bundled, versioned saturation-vapour-pressure function/table over the
  supported temperature range;
- humidity ratio `w = 0.621945 pv/(p − pv)`;
- relative humidity `phi = pv/p_sat(T)`;
- a declared moist-air enthalpy approximation in each relevant prompt;
- no fog/supersaturation states unless specifically taught.

The implementation must not mix saturation formulae silently. Dew-point answers
invert the same saturation function used to generate the instance.

### Thermal and moisture model hierarchy

The app keeps these layers distinct:

```text
material property
→ layer/component property
→ junction/path property
→ whole-envelope coefficient
→ instantaneous load
→ time-integrated energy
→ simplified indicator
```

Likewise:

```text
air temperature + vapour state
→ surface/interface state
→ modelled saturation comparison
→ limited screen result
```

A screen result such as “modelled interface vapour pressure exceeds modelled
saturation pressure under these assumptions” must not be shortened to “the wall
will have mould.”

### Scope

Included:

- steady one-dimensional heat conduction and surface films;
- homogeneous layered elements, bounded parallel paths, area-weighted elements;
- supplied window/frame/edge components and thermal bridges;
- envelope heat-transfer coefficients and design-condition heat losses;
- moist-air state variables, mixing, heating/cooling, and latent quantities;
- simplified surface and interstitial condensation screens;
- vapour resistance, diffusion, moisture-path classification, storage/drying
  arithmetic under supplied models;
- airtightness normalization, pressure-flow curves, mass balance, ventilation
  heat transfer, and ideal heat recovery;
- solar gains and geometric shading;
- operative temperature and bounded thermal-comfort indicators with supplied
  thresholds;
- component heat capacity, attenuation/phase shift as supplied dynamic
  properties, and simple lumped RC time stepping;
- degree-hours/days, hourly and aggregate load/energy balances;
- charts, sensors, uncertainty, alternatives, revisions, and root-cause audits.

### Exclusions

Excluded from v1:

- code compliance, certificates, ratings, labels, and regulatory calculation;
- full finite-element thermal bridge solvers;
- full WUFI-like transient heat/air/moisture simulation;
- mould-growth, decay, corrosion, freezing, salt, and biological models;
- CFD, multizone pressure networks, wind/stack coefficient prediction, duct
  design, fans, combustion, smoke, radon, and contaminant health assessment;
- HVAC equipment sizing, plant/system simulation, controls design, and economics;
- ground-coupled heat transfer except supplied U/H values;
- detailed window optical/spectral models and product databases;
- daylighting, electric lighting, acoustics, fire, structural and embodied-carbon
  analysis; these merit separate specifications;
- arbitrary real weather/BIM/sensor/thermal-image import.

### Global answer conventions

- Ignore surrounding whitespace.
- Accept locale-aware decimal input without ambiguous separators.
- A prompt-fixed unit allows a bare number; otherwise require/select a unit.
- Accept compatible units after exact normalization.
- Reject correct numerals with wrong physical dimensions.
- Accept equivalent algebraic forms only in constrained expression families.
- Percent and fraction forms are accepted when explicitly allowed.
- Temperatures and temperature differences remain distinct typed quantities.
- Multi-field psychrometric answers are checked independently and against state
  consistency.
- Graph selections resolve to semantic points/segments/areas, not pixels.
- Apply the displayed rounding rule only at the named stage.
- `Cannot determine` is correct only with the matching missing property,
  boundary condition, mechanism, or profile.

### Difficulty philosophy

Difficulty increases through:

- moving from one relationship to coupled series/parallel paths;
- switching between intensive and extensive quantities;
- selecting the correct area, length, volume, time base, or pressure reference;
- distinguishing material, assembly, junction, envelope, zone, and annual layers;
- coordinating temperature and moisture states;
- introducing time dependence, schedules, and storage;
- interpreting a graph/table rather than receiving every value directly;
- comparing competing mechanisms or diagnosing a root assumption;
- recognizing model insufficiency.

Difficulty must not increase through obscure property memorization, gratuitous
decimals, unreadable charts, hidden weather/code assumptions, huge arithmetic,
time pressure, or misleading claims about real buildings.

### Shared generation and rejection rules

Every instance must:

- declare model scope, coordinate/time orientation, units, constants, properties,
  boundary conditions, and rounding;
- derive from one semantic model and deterministic seed;
- retain a dimension-typed expression tree and source lineage;
- be solved by a primary and an independent oracle;
- construct values backward where useful to create readable answers and
  meaningful thresholds;
- make all professional/safety limitations clear without cluttering every
  arithmetic line;
- generate distractors from named misconceptions.

Reject an instance when:

- a required property, area, pressure, time interval, or boundary is unstated;
- two mechanisms are active but only one is modeled without saying so;
- a psychrometric state is impossible or outside the supported range;
- sign convention or Celsius/Kelvin use is ambiguous;
- surface/interface ordering is unclear;
- alternate formula profiles yield materially different answers but no profile
  is named;
- a threshold case lies within numeric uncertainty unless ambiguity is the task;
- choices become equivalent after unit conversion/rounding;
- arithmetic tedium overwhelms the physical reasoning;
- the conclusion could be read as real diagnosis, safety, compliance, or advice;
- a recent structural signature is repeated with only renamed materials/zones.

## 2. Category: Thermal quantities and steady-state assemblies

### Category purpose

Build a dimensional and physical foundation for translating layer properties
and boundary conditions into resistance, transmittance, flux, and temperature.

### Learn

For a homogeneous plane layer, `R=d/lambda`. Series resistances add, including
stated surface resistances, and `U=1/R_total`. Heat flux is
`q=U(T_warm−T_cold)` under the declared steady one-dimensional model. Temperature
drops across series resistances in proportion to each resistance.

### Prerequisites

Algebra, units, area, power, energy, temperature difference.

### Category boundaries

Parallel paths and whole-envelope aggregation are introduced gradually.
Junction bridges belong to Category 3; time-dependent storage belongs to
Category 7.

### Common misconceptions

- Treating thermal conductivity as resistance.
- Using thickness in millimetres without conversion.
- Adding U-values in series.
- Omitting explicitly supplied surface films.
- Treating lower U as greater heat flow at the same area and temperature.
- Using Celsius absolute temperature in equations requiring kelvins.
- Assuming the largest temperature drop occurs in the thickest rather than
  highest-resistance layer.

### Family `thermal_quantity_unit_identify`

**Task/purpose.** Classify temperature, heat, power, flux, conductivity,
resistance, transmittance, or heat capacity and choose a compatible unit.

**Response/template.** Matching: `Classify {description} and select its unit.`

**Derivation.** Map semantic property to its dimension vector and registered SI
units.

**Difficulty.** L1 power versus energy; L2 U versus R versus conductivity; L3
extensive `H/C` versus area-specific `U/R`.

**Distractors/constraints.** Same-context wrong units, not arbitrary symbols.

**Feedback.** State “per area,” “per temperature difference,” and time factors.

**Examples.** (1) hourly heat use→energy, `kWh` (L1). (2) layer conductivity
→`W/(m·K)` (L2). (3) whole-envelope coefficient→`W/K` (L3).

**Validation.** Dimensional parser confirms one class; equivalent units accepted.

### Family `layer_thermal_resistance`

**Task/purpose.** Calculate `R=d/lambda` or recover one missing variable.

**Response/template.** Number with unit: `Find {R|d|lambda} for Layer {id}.`

**Derivation.** Convert thickness to metres and rearrange exact relation.

**Difficulty.** L1 friendly thickness/conductivity; L2 unit conversion; L3
inverse variable and comparison.

**Distractors/constraints.** `d×lambda`, mm treated as m, reciprocal R.

**Feedback.** Show unit conversion and cancellation.

**Examples.** (1) `0.10/0.04=2.5 m²K/W` (L1). (2) `80 mm/0.20=0.4` (L2).
(3) `R=3`, `lambda=0.05`→`d=0.15 m` (L3).

**Validation.** Exact dimensional equation and forward/back round-trip.

### Family `series_assembly_r_u`

**Task/purpose.** Compute total series resistance and U-value of a layered plane
element with supplied films.

**Response/template.** Named fields: layer R values, `R_total`, `U`.

**Derivation.** Sum each `d/lambda` and selected `Rsi/Rse`; invert once.

**Difficulty.** L1 supplied layer R; L2 derive R from properties; L3 optional
film/layer scope and mixed units.

**Distractors/constraints.** sum U, omit films, invert each then sum, count a
layer twice.

**Feedback.** Render a resistance stack and reciprocal step.

**Examples.** (1) `R=0.13+2.5+0.04=2.67`, `U=0.375` (L1). (2) three derived
layers→`U=0.28` (L2). (3) compare assembly with/without stated air layer (L3).

**Validation.** Network and direct scalar oracles agree; positive finite values.

### Family `missing_layer_target_u`

**Task/purpose.** Recover a fictional missing layer resistance, thickness, or
conductivity to meet an explicitly supplied mathematical target.

**Response/template.** Number/unit: `What {property} makes U exactly {targetU} under this exercise model?`

**Derivation.** `R_required=1/U_target`; subtract known series R; solve
`d=lambda R` or `lambda=d/R`.

**Difficulty.** L1 missing R; L2 missing thickness; L3 check feasibility and
answer `no positive solution` when known R already exceeds target relation.

**Distractors/constraints.** add target U, omit films, negative thickness
accepted; never call result a design recommendation.

**Feedback.** Separate mathematical target from real design.

**Examples.** (1) target `U=.25`, known `R=1.5`→missing `R=2.5` (L1).
(2) `lambda=.04`, missing `R=2`→`80 mm` (L2). (3) impossible positive layer
under constructed data (L3).

**Validation.** Substitute solution; feasibility and positivity checks.

### Family `steady_heat_flux`

**Task/purpose.** Calculate magnitude/direction of steady heat flux through an
element.

**Response/template.** Signed or directional `W/m²`.

**Derivation.** Apply declared sign convention to `q=U(T1−T2)`.

**Difficulty.** L1 magnitude; L2 direction/sign; L3 recover temperature or U.

**Distractors/constraints.** divide by ΔT, use absolute temperatures, reverse
direction.

**Feedback.** Draw warm/cold sides and sign arrow.

**Examples.** (1) `U=.5`, `20−0 K`→`10 W/m²` outward (L1). (2) summer
`32→24°C`, inward `4 W/m²` (L2). (3) `q=12`, `U=.3`→`ΔT=40 K` (L3).

**Validation.** Energy-network oracle and sign invariant.

### Family `assembly_heat_flow_power_energy`

**Task/purpose.** Move from flux to element power and time-integrated energy.

**Response/template.** Named fields `q`, `Phi`, `Q`.

**Derivation.** `Phi=qA=UAΔT`; for constant interval `Q=Phi×t`, with exact unit
conversion.

**Difficulty.** L1 power; L2 kWh interval; L3 varying piecewise intervals.

**Distractors/constraints.** omit area, confuse kW/kWh, multiply hours without
converting when joules requested.

**Feedback.** Label area and time as separate extensivity steps.

**Examples.** (1) `10 W/m²×20 m²=200 W` (L1). (2) `0.2 kW×10 h=2 kWh`
(L2). (3) `100 W×4 h+250 W×2 h=.9 kWh` (L3).

**Validation.** Unit-typed integration and piecewise sum.

### Family `series_temperature_profile`

**Task/purpose.** Compute interface temperatures in a one-dimensional series
resistance stack.

**Response/template.** Ordered temperature fields or plot points.

**Derivation.** Find `q=ΔT/R_total`; cumulative drop is `q×R_cumulative` from
the named side.

**Difficulty.** L1 one interface; L2 several layers/films; L3 reverse ordering
or missing interface temperature.

**Distractors/constraints.** linear by thickness, largest drop in highest
conductivity, omit film drop.

**Feedback.** Align resistance bar and temperature plot.

**Examples.** (1) equal R halves split `20 K` into `10+10` (L1). (2) high-R
layer takes `16 K` of `20 K` (L2). (3) recover layer R from interface T (L3).

**Validation.** drops sum to boundary ΔT and each equals `qR`.

### Family `parallel_path_effective_u`

**Task/purpose.** Combine bounded parallel heat-flow paths by area fraction.

**Response/template.** Effective U and optional total heat flow.

**Derivation.** `U_eff=sum(f_i U_i)`, `sum(f_i)=1`; equivalently sum `U_i A_i`
then divide by total area.

**Difficulty.** L1 two supplied U paths; L2 derive each assembly; L3 recover
fraction or compare with false series model.

**Distractors/constraints.** average R then invert, unweighted mean, fractions
not normalized.

**Feedback.** Draw side-by-side paths and their heat-flow contributions.

**Examples.** (1) 80% at `.2`, 20% at `1.0`→`.36 W/m²K` (L1). (2) framing
and insulated paths derived separately (L2). (3) solve fraction from `U_eff`
(L3).

**Validation.** area-sum and fraction oracles agree; fractions form partition.

### Family `steady_assembly_audit`

**Task/purpose.** Diagnose one unit, layer, surface-film, series/parallel,
reciprocal, or sign error.

**Response/template.** Select root step and corrected result.

**Derivation.** Compare dimension-typed expression tree and network solution;
identify earliest mismatching node.

**Difficulty.** L1 arithmetic/unit; L2 R/U or film; L3 parallel path incorrectly
placed in series with plausible result.

**Distractors/constraints.** Exactly one root mutation; downstream values may be
consistent with it.

**Feedback.** Trace property→R network→U→flux.

**Examples.** (1) `100 mm` read as `100 m` (L1). (2) U-values added through
layers (L2). (3) stud and insulation treated as series (L3).

**Validation.** Fault manifest has one root and reproduced consequences.

### Cross-family progression

Quantity dimensions and single layers precede series assemblies. Missing-target
questions test inversion without implying design. Flux then expands to power
and energy. Temperature profiles expose resistance physically. Parallel paths
are introduced only after series mastery; audits interleave afterward.

## 3. Category: Envelope transmission, openings, and thermal bridges

### Category purpose

Aggregate component areas and junction lengths into a transparent whole-envelope
heat-transfer coefficient and condition-specific load.

### Learn

For plane elements, `H=UA`. Linear bridges contribute `psi L`; point bridges
contribute `chi`. Add compatible coefficients first, then multiply their total
by the temperature difference. Gross and net areas must follow the displayed
geometry profile so openings are neither omitted nor counted twice.

### Prerequisites

Category 2 and Architectural Geometry & Building Quantities basics.

### Category boundaries

Thermal bridge properties are supplied or selected from fictional datasets; v1
does not solve their 2D/3D fields. Air exchange is Category 6. Ground elements
use supplied effective coefficients only.

### Common misconceptions

- Multiplying U-values without area.
- Applying ΔT to each coefficient inconsistently.
- Counting window area both inside gross wall and separately.
- Treating `psi` as U-value or forgetting junction length.
- Counting a shared junction once per adjacent element.
- Adding W, W/K, and W/m²K directly.
- Calling a design-condition heat loss annual energy.

### Family `element_transmission_coefficient`

**Task/purpose.** Calculate `H=UA` or recover U/area for one plane element.

**Response/template.** `W/K`, `W/(m²K)`, or `m²` as requested.

**Derivation.** Multiply or rearrange the exact dimensional relation.

**Difficulty.** L1 direct; L2 mixed units/area source; L3 inverse and gross/net
area choice.

**Distractors/constraints.** U alone, `U/A`, gross area despite net profile.

**Feedback.** Show element boundary, area, U, and unit cancellation.

**Examples.** (1) `.25×40=10 W/K` (L1). (2) net wall `52 m²×.3=15.6` (L2).
(3) `H=12`, `A=30`→`U=.4` (L3).

**Validation.** Geometry area and dimensional oracle.

### Family `opening_area_weighted_u`

**Task/purpose.** Combine frame, glazing/panel, and supplied edge terms into a
simple fictional opening U-value.

**Response/template.** Component H values and overall U.

**Derivation.** `H=sum(U_i A_i)+sum(psi_j L_j)`; divide by total opening area.

**Difficulty.** L1 two area components no edge; L2 add edge term; L3 multiple
panels and recover a component value.

**Distractors/constraints.** simple unweighted average, edge term divided/multiplied
wrongly, frame area added beyond total.

**Feedback.** Color frame/glazing areas and edge perimeter.

**Examples.** (1) 20% frame U2 +80% glass U1→`1.2` (L1). (2) add
`psi L/A=.1`→`1.3` (L2). (3) recover frame U from overall (L3).

**Validation.** area partition and H-total round-trip; fictional subset only.

### Family `gross_net_opening_transmission`

**Task/purpose.** Compute wall-plus-opening H without double-counting area.

**Response/template.** Named wall/opening/total H fields.

**Derivation.** `A_wall_net=A_gross−sum(A_openings)`; then sum
`U_wall A_net + sum(U_opening A_opening)`.

**Difficulty.** L1 one opening; L2 several types; L3 threshold/profile area
distinction or inverse missing area.

**Distractors/constraints.** gross wall plus opening, subtract opening H from
wall H, use opening perimeter as area.

**Feedback.** Show the area ledger before the thermal ledger.

**Examples.** (1) `20 gross−2 window=18 wall` then H sum (L1). (2) doors and
windows by type (L2). (3) find unknown window area from total H (L3).

**Validation.** spatial partition and independent atomic-face sum.

### Family `linear_bridge_contribution`

**Task/purpose.** Calculate or invert a linear thermal-bridge contribution
`H_psi=psi L`.

**Response/template.** `W/K`, `W/(mK)`, or `m`.

**Derivation.** Multiply/rearrange supplied `psi` and canonical junction length.

**Difficulty.** L1 one junction; L2 several junction types; L3 deduplicate shared
segments or recover psi.

**Distractors/constraints.** treat psi as U, multiply by area, count edge twice.

**Feedback.** Trace each canonical junction once.

**Examples.** (1) `.05×20=1 W/K` (L1). (2) `1.2+0.8=2 W/K` by type (L2).
(3) `H=1.5`, `L=30`→`psi=.05` (L3).

**Validation.** half-edge ID uniqueness and dimensional equation.

### Family `point_bridge_contribution`

**Task/purpose.** Add supplied point transmittances to envelope H.

**Response/template.** Count/type subtotal in `W/K`.

**Derivation.** Sum `count_i×chi_i` over unique point bridge IDs.

**Difficulty.** L1 identical points; L2 types; L3 schedule/model reconciliation.

**Distractors/constraints.** multiply by length/area, count symbols in several
views, omit multiplicity.

**Feedback.** List stable IDs and chi contribution.

**Examples.** (1) 6×`.02=.12 W/K` (L1). (2) two point types total `.28` (L2).
(3) duplicate schedule symbol removed by stable ID (L3).

**Validation.** stable-ID set and exact group sum.

### Family `whole_envelope_h`

**Task/purpose.** Aggregate plane, linear, and point transmission coefficients.

**Response/template.** Table subtotals and total `H_trans`.

**Derivation.** `sum(UA)+sum(psi L)+sum(chi)` after geometry/profile filtering.

**Difficulty.** L1 plane elements; L2 add bridges; L3 several orientations,
zones, and one excluded boundary.

**Distractors/constraints.** mix coefficients with heat flow, omit bridge class,
include adiabatic/internal boundary.

**Feedback.** Sankey-like coefficient ledger by mechanism.

**Examples.** (1) walls `20`+roof `10`=`30 W/K` (L1). (2) plane `40`+linear
`3`+point `.2`=`43.2` (L2). (3) zone boundary filtered total (L3).

**Validation.** atomic boundary sum and grouped ledger agree.

### Family `transmission_design_condition_load`

**Task/purpose.** Convert whole-envelope H and supplied boundary temperatures
into instantaneous transmission heat load.

**Response/template.** Signed/magnitude `W` or `kW`.

**Derivation.** `Phi=H(T_inside−T_outside)` with declared sign.

**Difficulty.** L1 heating magnitude; L2 cooling direction; L3 multiple adjacent
zones with different boundary temperatures.

**Distractors/constraints.** use annual mean, treat H as W, sum temperature
values rather than differences.

**Feedback.** List each boundary ΔT and contribution.

**Examples.** (1) `H=100 W/K`, `ΔT=20 K`→`2 kW` (L1). (2) outside hotter,
inward sign (L2). (3) outdoor/ground/adjacent-zone contributions (L3).

**Validation.** node-network conservation and unit typing.

### Family `envelope_revision_delta`

**Task/purpose.** Explain a fictional H/load change after area, U, junction, or
boundary revisions.

**Response/template.** Signed delta plus categorized contributors.

**Derivation.** Match stable IDs; compute new-old atomic coefficients and, if
requested, loads under identical stated conditions.

**Difficulty.** L1 one U change; L2 area and opening changes; L3 offsetting plane
and bridge changes.

**Distractors/constraints.** compare different weather, reverse delta, hide
offsetting changes; no “better” recommendation.

**Feedback.** Waterfall old→component deltas→new.

**Examples.** (1) wall H decreases `2 W/K` (L1). (2) added window changes wall
and opening areas (L2). (3) plane `−4`, bridge `+1`, net `−3 W/K` (L3).

**Validation.** contributor sum equals total new-old and preserves identities.

### Family `envelope_transmission_audit`

**Task/purpose.** Diagnose one area, U, junction, dimension, sign, or aggregation
error.

**Response/template.** Root layer, evidence, corrected line.

**Derivation.** Compare geometry, properties, bridge registry, coefficient
ledger, and boundary network; find earliest mismatch.

**Difficulty.** L1 arithmetic; L2 gross/net or psi/length; L3 one opening
double-count propagates into H and load.

**Distractors/constraints.** Exactly one root mutation and deterministic
consequences.

**Feedback.** Trace geometry→component H→envelope H→load.

**Examples.** (1) wall area copied incorrectly (L1). (2) balcony edge counted
twice (L2). (3) window included in gross wall and separately (L3).

**Validation.** fault manifest, dimensional checks, independent atomic sum.

### Cross-family progression

One-element H precedes composite openings and gross/net wall accounting. Linear
and point bridges are introduced as separately typed terms before whole-envelope
aggregation. Condition-specific load follows coefficient mastery. Revisions and
audits come last.

## 4. Category: Moist air and psychrometric processes

### Category purpose

Build reliable state-variable reasoning for water vapour in air and for bounded
heating, cooling, humidification, dehumidification, and mixing processes.

### Learn

Relative humidity is a ratio to saturation at the current temperature; it is
not the amount of water per cubic metre. Dew point is the temperature at which
the current vapour pressure reaches saturation during ideal cooling at constant
humidity ratio and pressure. Sensible heating changes temperature without adding
water; ideal mixing conserves dry-air and water-vapour mass.

### Prerequisites

Algebra, ratios, pressure, energy, interpolation; Category 2 units.

### Category boundaries

The bundled psychrometric profile supplies pressure and functions. Human health
and comfort judgments are excluded. Assembly diffusion is Category 5; room
airflow is Category 6.

### Common misconceptions

- Treating 50% RH as half a fixed amount of water independent of temperature.
- Converting RH directly to dew point without saturation pressure.
- Assuming sensible heating preserves RH rather than humidity ratio.
- Averaging relative humidities when mixing air streams.
- Mixing values per kg dry air without dry-air mass-flow weighting.
- Confusing humidity ratio, absolute humidity, and vapour pressure.
- Applying sea-level chart values when a different pressure is supplied.

### Family `vapour_pressure_relative_humidity`

**Task/purpose.** Convert between relative humidity, saturation pressure, and
vapour partial pressure.

**Response/template.** Pressure or percent: `Find {pv|RH} at {T} using the supplied p_sat.`

**Derivation.** `pv=phi p_sat(T)` or `phi=pv/p_sat(T)`.

**Difficulty.** L1 supplied saturation pressure; L2 table interpolation; L3
inverse and compare two temperatures.

**Distractors/constraints.** multiply by total barometric pressure, percent not
fraction, use saturation value at wrong temperature.

**Feedback.** Draw current vapour pressure as a fraction of saturation.

**Examples.** (1) `p_sat=2.34 kPa`, 50%→`1.17 kPa` (L1). (2) interpolate
table then 65% (L2). (3) same pv at two T gives different RH (L3).

**Validation.** generated from one saturation oracle; `0≤phi≤1`.

### Family `humidity_ratio_state`

**Task/purpose.** Calculate humidity ratio from vapour and total pressure, or
invert it.

**Response/template.** `kg/kg`, `g/kg`, or `kPa`.

**Derivation.** Use profile equation
`w=0.621945 pv/(p−pv)` and its algebraic inverse.

**Difficulty.** L1 direct at standard pressure; L2 g/kg conversion; L3 altered
barometric pressure/inverse.

**Distractors/constraints.** `pv/p`, omit denominator correction, confuse kg/kg
with g/kg.

**Feedback.** Show dry-air and vapour partial pressures and unit basis.

**Examples.** (1) `pv=1 kPa`, `p=100 kPa`→`6.28 g/kg` (L1). (2)
`0.009 kg/kg=9 g/kg` (L2). (3) same pv at lower p gives higher w (L3).

**Validation.** forward/inverse round-trip and physical bounds `pv<p`.

### Family `dew_point_from_state`

**Task/purpose.** Find dew point from temperature/RH or vapour pressure using
the profile’s saturation function.

**Response/template.** Temperature with declared precision.

**Derivation.** Compute `pv`, then solve monotonic
`p_sat(T_dew)=pv` by deterministic inversion/interpolation.

**Difficulty.** L1 lookup table exact point; L2 interpolation; L3 compare
surface temperature with dew point.

**Distractors/constraints.** multiply dry-bulb by RH, use wet-bulb, inverse
wrong saturation branch.

**Feedback.** Move horizontally at constant humidity ratio to saturation curve.

**Examples.** (1) profile state chosen for dew point `10°C` (L1). (2)
interpolated `7.4°C` (L2). (3) surface `8°C`, dew point `9°C` under model
→surface below dew point (L3).

**Validation.** substitute answer into same saturation function within tolerance.

### Family `sensible_heat_cool_process`

**Task/purpose.** Predict the new RH/dew point after ideal sensible
heating/cooling at constant humidity ratio and pressure.

**Response/template.** Final state fields or process-line choice.

**Derivation.** Preserve `w`, recover `pv`, calculate
`phi_new=pv/p_sat(T_new)`; reject cooling below dew point unless condensation is
explicitly modeled.

**Difficulty.** L1 qualitative RH direction; L2 numeric final RH; L3 find final
temperature for target RH before saturation.

**Distractors/constraints.** RH constant, pv scales with T, dew point equals new
dry-bulb.

**Feedback.** Show horizontal psychrometric movement and unchanged water mass.

**Examples.** (1) heat air→RH falls (L1). (2) same `pv=1.2 kPa`, new
`p_sat=3.0`→40% (L2). (3) solve temperature where RH reaches 70% (L3).

**Validation.** humidity-ratio invariance and saturation bound.

### Family `moist_air_enthalpy`

**Task/purpose.** Calculate or compare moist-air enthalpy with the supplied
profile approximation.

**Response/template.** `kJ/kg_dry_air` or missing state variable.

**Derivation.** Apply the displayed equation, e.g.
`h=1.006T+w(2501+1.86T)` with T in °C for this teaching profile.

**Difficulty.** L1 direct friendly state; L2 compare sensible/latent portions;
L3 inverse T or w.

**Distractors/constraints.** w entered as g/kg, omit latent term, use kelvins
despite profile equation.

**Feedback.** Separate dry-air sensible, vapour latent, and vapour sensible terms.

**Examples.** (1) `T=20°C,w=.008`→about `40.4 kJ/kg_da` (L1). (2) compare
two equal-T humidity states (L2). (3) recover w from h and T (L3).

**Validation.** independent decimal evaluation and forward/inverse check.

### Family `two_stream_mixing`

**Task/purpose.** Mix two moist-air streams under ideal adiabatic conditions
using dry-air mass-flow weighting.

**Response/template.** Mixed `w`, `h`, and derived `T/RH` fields.

**Derivation.** `w_m=sum(m_da w)/sum(m_da)` and likewise for h; invert profile
enthalpy equation for T, then derive RH.

**Difficulty.** L1 equal flows/w only; L2 unequal flows and h; L3 volume flows
requiring supplied density conversion.

**Distractors/constraints.** average RH/T directly, weight by wrong stream
quantity, omit pressure.

**Feedback.** Show separate dry-air, vapour, and energy ledgers.

**Examples.** (1) equal `4` and `8 g/kg`→`6 g/kg` (L1). (2) 1:3 flows
weighted state (L2). (3) derive mixed RH after h/w balance (L3).

**Validation.** mass and energy residuals zero within profile precision.

### Family `cooling_dehumidification`

**Task/purpose.** Compute ideal condensate removal and final state when moist air
is cooled below its initial dew point to a stated saturated leaving state.

**Response/template.** Final humidity ratio and condensate mass flow.

**Derivation.** Find saturated `w_out` at leaving T/p; condensate
`m_da(w_in−w_out)`, nonnegative.

**Difficulty.** L1 humidity-ratio difference; L2 mass flow; L3 reheat after
cooling with unchanged final w.

**Distractors/constraints.** subtract RH, use total wet-air flow without
conversion, condensation negative.

**Feedback.** Trace cool-to-saturation, down saturation curve, optional
horizontal reheat.

**Examples.** (1) `.010−.007=.003 kg/kg` removed (L1). (2) `0.5 kg_da/s`
→`1.5 g/s` (L2). (3) cooling/dehumidification then reheat final RH (L3).

**Validation.** water-mass balance and saturation of leaving coil state.

### Family `psychrometric_chart_read`

**Task/purpose.** Read or locate a state/process on a generated semantic
psychrometric chart.

**Response/template.** Point/line selection or bounded numeric fields.

**Derivation.** Chart geometry is generated from the same saturation and
property functions; selections resolve to semantic curves/states.

**Difficulty.** L1 locate T/RH; L2 read w/dew point; L3 identify sensible,
mixing, cooling/dehumidification process.

**Distractors/constraints.** visual choices encode known curve confusions; no
pixel-based grading.

**Feedback.** Project state to each labelled axis/curve.

**Examples.** (1) identify 50% RH curve (L1). (2) read `w≈8 g/kg` (L2).
(3) choose process line that crosses saturation then descends (L3).

**Validation.** rendered coordinates round-trip to semantic state and remain
legible.

### Family `psychrometric_state_audit`

**Task/purpose.** Diagnose one pressure, unit, saturation, conservation, or
process-assumption error.

**Response/template.** Select root step and correct state.

**Derivation.** Recompute state graph and mass/energy invariants; locate first
invalid node.

**Difficulty.** L1 %/g/kg; L2 wrong pressure or dew point; L3 RH averaged during
mixing gives plausible but nonconserving state.

**Distractors/constraints.** Exactly one root mutation; no health judgment.

**Feedback.** Show violated state or conservation relation.

**Examples.** (1) `8 g/kg` used as `8 kg/kg` (L1). (2) dew point from wrong
saturation table (L2). (3) two stream RH values averaged (L3).

**Validation.** fault manifest and conservation residual.

### Cross-family progression

Vapour pressure precedes humidity ratio and dew point. Sensible movement and
enthalpy establish process coordinates before mixing. Cooling/dehumidification
adds phase change. Chart reading is interleaved with numeric families after each
concept; audits come last.

## 5. Category: Moisture transport and condensation screens

### Category purpose

Distinguish moisture mechanisms and apply bounded vapour-diffusion, surface, and
interface screening models without overclaiming real performance.

### Learn

Water can arrive as bulk liquid, capillary transport, vapour diffusion, or moist
air leakage; materials can also store and release moisture. These mechanisms
need different models. A simplified diffusion screen compares modeled vapour
pressure with modeled saturation pressure. It omits many real phenomena and is
not a durability or mould diagnosis.

### Prerequisites

Categories 2 and 4; layered assemblies and pressure profiles.

### Category boundaries

Only explicitly supplied one-dimensional steady/month-step screening models are
used. Full transient coupled transport, biological growth, rain penetration,
and remediation design are excluded.

### Common misconceptions

- Treating vapour diffusion and air leakage as the same transport mechanism.
- Assuming a highly vapour-resistant layer is an air barrier or waterproofing.
- Drawing vapour-pressure profile proportional to thermal resistance.
- Drawing temperature profile proportional to vapour resistance.
- Declaring condensation from RH alone without surface/interface temperature.
- Assuming no screen exceedance proves the real assembly safe.
- Treating one monthly result as annual storage/drying.

### Family `moisture_pathway_classify`

**Task/purpose.** Classify a described transport/storage pathway.

**Response/template.** Matching: bulk water, capillary, vapour diffusion,
air-carried vapour, adsorption/storage, or drying.

**Derivation.** Match controlled scenario features to semantic mechanism.

**Difficulty.** L1 explicit mechanism; L2 similar symptom/different pathway; L3
several simultaneous stated pathways.

**Distractors/constraints.** Use causal mechanism, not material stereotypes or
diagnosis.

**Feedback.** Name driving potential and transported phase.

**Examples.** (1) pressure-driven rain through gap→bulk (L1). (2) vapour through
uncracked layer→diffusion (L2). (3) moist air through crack plus adsorption
→two mechanisms (L3).

**Validation.** scenario grammar encodes unique intended set.

### Family `vapour_resistance_sd`

**Task/purpose.** Calculate equivalent air-layer thickness `sd=mu d`, total
series sd, or a missing variable under the profile.

**Response/template.** Metres or dimensionless `mu`.

**Derivation.** Convert d to metres, multiply by supplied resistance factor, and
sum series values when requested.

**Difficulty.** L1 one layer; L2 several layers; L3 inverse/compare layer order.

**Distractors/constraints.** divide instead of multiply, use mm, infer liquid or
air resistance from sd.

**Feedback.** Keep vapour resistance separate from thermal R.

**Examples.** (1) `mu=10,d=.1`→`sd=1 m` (L1). (2) `.2+2+.05=2.25 m`
(L2). (3) recover `mu` from sd/d (L3).

**Validation.** exact dimensional relation and positive properties.

### Family `vapour_pressure_profile`

**Task/purpose.** Compute interface vapour pressures through series diffusion
resistances with fixed boundary vapour pressures.

**Response/template.** Ordered interface pressure fields/plot points.

**Derivation.** Vapour-pressure drop is proportional to cumulative supplied
vapour resistance under the declared steady model.

**Difficulty.** L1 one interface; L2 several sd layers; L3 reverse layer order
or recover a resistance.

**Distractors/constraints.** distribute by thickness/thermal R, reverse indoor/
outdoor boundaries.

**Feedback.** Align vapour-resistance stack and pressure line.

**Examples.** (1) equal resistance splits 1 kPa drop equally (L1). (2) one layer
takes 80% drop (L2). (3) reversing layers relocates interface pressures but not
total flux under model (L3).

**Validation.** drops sum to boundary difference and constant diffusion flux.

### Family `surface_condensation_screen`

**Task/purpose.** Compare modeled surface temperature with dew point or
saturation pressure under stated indoor air conditions.

**Response/template.** Margin in K plus `below|equal|above screen threshold`.

**Derivation.** Compute dew point with profile; margin `T_surface−T_dew`, or
compare surface saturation pressure with indoor vapour pressure.

**Difficulty.** L1 supplied dew point; L2 derive dew point; L3 find required
modeled surface temperature factor for an exercise threshold.

**Distractors/constraints.** compare indoor dry bulb, RH percentage to
temperature, declare mould/safety.

**Feedback.** Say only what the model comparison establishes.

**Examples.** (1) surface `12`, dew `9`→`+3 K` (L1). (2) surface `7`, derived
dew `8`→`−1 K` (L2). (3) recover threshold surface temperature (L3).

**Validation.** same saturation oracle; uncertainty-bound ties rejected.

### Family `interstitial_condensation_screen`

**Task/purpose.** Compare modeled interface vapour-pressure and saturation
profiles and locate an exceedance under the simplified profile.

**Response/template.** Interface selection and pressure margin(s).

**Derivation.** Compute thermal interface T, saturation pressure at each, and
diffusion vapour pressure; evaluate `pv−p_sat`.

**Difficulty.** L1 one supplied interface; L2 calculate both profiles; L3 several
months/interfaces and distinguish first/largest exceedance.

**Distractors/constraints.** compare temperature to pressure, use same resistance
profile for both, conclude real damage.

**Feedback.** Overlay both pressure profiles and state omitted phenomena.

**Examples.** (1) `pv=1.0`, `psat=1.2 kPa`→no exceedance in screen (L1).
(2) interface margin `+0.15 kPa` (L2). (3) month/interface matrix (L3).

**Validation.** independent thermal and vapour networks; exact classification.

### Family `surface_temperature_factor`

**Task/purpose.** Calculate or interpret a dimensionless supplied-profile
surface-temperature factor.

**Response/template.** Ratio or missing temperature.

**Derivation.** Apply displayed definition, e.g.
`f=(Tsi−Te)/(Ti−Te)`, and algebraic inverse.

**Difficulty.** L1 direct; L2 inverse; L3 compare two junctions under same
boundary conditions without claiming adequacy.

**Distractors/constraints.** reverse numerator, Celsius absolute ratio, infer
universal threshold.

**Feedback.** Place surface temperature between exterior/interior endpoints.

**Examples.** (1) `Ti=20,Te=0,Tsi=16`→`.8` (L1). (2) find Tsi from f (L2).
(3) rank two fictional details by factor only (L3).

**Validation.** forward/inverse and expected boundedness for generated cases.

### Family `moisture_storage_drying_balance`

**Task/purpose.** Update a simple fictional moisture store from supplied wetting
and drying rates/capacity.

**Response/template.** Stored mass series and overflow/zero clipping events.

**Derivation.** `M_{t+1}=clip(M_t+in_t−out_t,0,capacity)` at declared intervals.

**Difficulty.** L1 one interval; L2 schedule; L3 capacity and conditional drying
rule.

**Distractors/constraints.** confuse rate/mass, allow negative storage, call
drying potential proof of durability.

**Feedback.** Water-mass ledger per time step.

**Examples.** (1) `2+0.5−0.2=2.3 kg` (L1). (2) four-month series (L2). (3)
capacity clips and reports overflow (L3).

**Validation.** mass conservation including clipped outflow/overflow.

### Family `moisture_screen_audit`

**Task/purpose.** Diagnose one mechanism, resistance, profile, interface,
threshold, or overclaim error.

**Response/template.** Root error and scientifically limited correction.

**Derivation.** Compare mechanism graph, thermal/vapour networks, saturation
oracle, storage ledger, and conclusion vocabulary.

**Difficulty.** L1 unit/profile; L2 wrong resistance/interface; L3 arithmetic
correct but conclusion exceeds the screen’s scope.

**Distractors/constraints.** One root mutation; overclaim is a valid semantic
fault even when numbers are right.

**Feedback.** Separate model output from unsupported real-world inference.

**Examples.** (1) sd uses mm as m (L1). (2) vapour profile distributed by
thermal R (L2). (3) “no modeled exceedance” rewritten wrongly as “safe wall”
(L3).

**Validation.** fault manifest and banned-claim semantic tests.

### Cross-family progression

Mechanism classification precedes diffusion arithmetic. Vapour resistance and
pressure profiles come before surface/interstitial screens. Temperature factor
supports surface reasoning; simple storage introduces time. Audits explicitly
test whether learners respect the screen’s limits.

## 6. Category: Airtightness, pressure-flow, and ventilation

### Category purpose

Relate volumetric flow, air changes, pressure differences, leakage curves, mass
balance, and ventilation heat transfer under explicit one-zone assumptions.

### Learn

Air changes are flow normalized by zone volume. Fan-test flow at a reference
pressure is not the same as natural infiltration. A power-law curve relates
flow to pressure only under its supplied model. At steady state, dry-air mass
entering and leaving a zone must balance; ideal heat recovery reduces the
temperature difference carried by the ventilation stream according to its
declared effectiveness.

### Prerequisites

Algebra, volume, rates, powers, Categories 2 and 4.

### Category boundaries

No real blower-door protocol, infiltration prediction, multizone airflow, duct
design, fan selection, contaminant health threshold, smoke, radon, or combustion
analysis.

### Common misconceptions

- Treating `1/h` air changes as `m³/h` without zone volume.
- Confusing `n50/q50` with ordinary operating ventilation.
- Scaling fan flow linearly with pressure despite exponent `n≠1`.
- Adding supply and exhaust as if both are net inflow.
- Using volume flow in a heat equation without air density/volumetric heat
  capacity.
- Subtracting heat-recovery effectiveness from temperature in degrees.
- Claiming a leakage location from aggregate fan-test data alone.

### Family `airflow_air_change_convert`

**Task/purpose.** Convert between zone volume, volumetric flow, and air-change
rate.

**Response/template.** `m³/h`, `L/s`, or `1/h`.

**Derivation.** `n=Vdot/V` with consistent time units; rearrange as needed.

**Difficulty.** L1 m³/h; L2 L/s conversion; L3 inverse volume/flow schedule.

**Distractors/constraints.** omit volume, 3600 factor error, use floor area.

**Feedback.** Show one zone-volume replacement per hour.

**Examples.** (1) `150 m³/h / 300 m³=.5 1/h` (L1). (2) `50 L/s=180 m³/h`
(L2). (3) target `.6 1/h` in `250 m³`→`150 m³/h` (L3).

**Validation.** dimensional round-trip and positive volume.

### Family `normalized_leakage_metric`

**Task/purpose.** Calculate fictional `n_ref=Vdot_ref/V` or
`q_ref=Vdot_ref/A_envelope` at a stated test pressure.

**Response/template.** `1/h` or `m³/(h·m²)` with pressure label.

**Derivation.** Normalize measured reference flow by the explicitly supplied
volume or envelope area.

**Difficulty.** L1 one metric; L2 distinguish n/q; L3 recover area/volume or
compare differently sized zones.

**Distractors/constraints.** wrong denominator, omit pressure subscript, compare
raw flows only.

**Feedback.** Label flow, normalization basis, and reference pressure.

**Examples.** (1) `600 m³/h / 300 m³=2 h⁻¹ at 50 Pa` (L1). (2) same flow
normalized by `200 m²`→`3 m³/(h·m²)` (L2). (3) compare two zones by same metric
(L3).

**Validation.** geometry denominator and unit typing.

### Family `pressure_flow_power_law`

**Task/purpose.** Use or invert `Vdot=C(Δp)^n` for a supplied fictional leakage
curve.

**Response/template.** Flow, pressure, C, or exponent choice.

**Derivation.** Evaluate/invert with positive pressure magnitude and declared
units; direction handled separately.

**Difficulty.** L1 friendly exponent/value; L2 interpolate between pressures;
L3 infer n from two exact points using logs.

**Distractors/constraints.** linear scaling, multiply exponent, use signed
negative base.

**Feedback.** Plot both points on linear and log-log axes.

**Examples.** (1) `C=10,n=.5,Δp=25`→`50 units` (L1). (2) scale flow from
50 to 10 Pa (L2). (3) recover n from two measurements (L3).

**Validation.** forward/inverse and log-slope oracle.

### Family `leakage_paths_parallel`

**Task/purpose.** Sum parallel leakage-path flows at a common pressure or find
one path’s share.

**Response/template.** Path flows and total.

**Derivation.** Evaluate every path at the same pressure and sum signed flows
according to orientation.

**Difficulty.** L1 identical exponents/common direction; L2 different C/n; L3
one inflow/outflow network balance.

**Distractors/constraints.** add C values when exponents differ then evaluate,
use different pressures silently, count path twice.

**Feedback.** Show shared pressure nodes and branch flows.

**Examples.** (1) `30+20=50 m³/h` (L1). (2) evaluate two power laws (L2).
(3) signed path contributions balance mechanical flow (L3).

**Validation.** branch sum and network residual.

### Family `zone_air_mass_balance`

**Task/purpose.** Solve one missing supply, exhaust, transfer, or leakage flow
from a steady one-zone balance.

**Response/template.** Signed volumetric/mass flow plus direction.

**Derivation.** Sum inflows minus outflows equals zero; convert volume to mass
with supplied density when required.

**Difficulty.** L1 two flows; L2 transfer/leakage branches; L3 unequal densities
requiring mass rather than volume conservation.

**Distractors/constraints.** add all magnitudes, balance volume despite density
difference, reverse missing direction.

**Feedback.** Node diagram and signed ledger.

**Examples.** (1) supply `100`, exhaust `80`→`20 m³/h` outward leakage (L1).
(2) supply/exhaust/transfer (L2). (3) mass-balance with two densities (L3).

**Validation.** exact node residual zero.

### Family `ventilation_sensible_heat`

**Task/purpose.** Compute sensible heat flow carried by a stated air stream.

**Response/template.** Signed/magnitude `W`.

**Derivation.** `Phi=rho cp Vdot ΔT` or supplied volumetric heat capacity form;
normalize flow to `m³/s`.

**Difficulty.** L1 supplied `rho cp`; L2 L/s or m³/h; L3 several streams with
different temperatures.

**Distractors/constraints.** omit density/cp, time-factor error, use humidity
latent load unless requested.

**Feedback.** Show mass/volume flow, temperature difference, and direction.

**Examples.** (1) `rho cp≈1200 J/(m³K)`, `.1 m³/s`, `20 K`→`2400 W` (L1).
(2) convert `180 m³/h` first (L2). (3) mixed supply streams (L3).

**Validation.** enthalpy-flow and sensible formula agree for dry-air limit.

### Family `heat_recovery_effectiveness`

**Task/purpose.** Calculate ideal supply temperature or recovered sensible heat
under a supplied effectiveness definition.

**Response/template.** Temperature/effectiveness/recovered W.

**Derivation.** For balanced ideal streams under displayed profile,
`T_supply_after=T_out+epsilon(T_extract−T_out)`; compare heat flows.

**Difficulty.** L1 temperature; L2 recovered/residual heat; L3 inverse
effectiveness or unequal-flow capacity rates with supplied formula.

**Distractors/constraints.** subtract epsilon degrees, exceed source
temperature, call efficiency/effectiveness universal.

**Feedback.** Place outlet between outdoor and extract states.

**Examples.** (1) `0°C`, extract `20°C`, epsilon `.75`→`15°C` (L1). (2)
recovered `1.8 kW`, residual `.6 kW` (L2). (3) recover epsilon (L3).

**Validation.** energy balance and bounded outlet for generated ideal cases.

### Family `steady_tracer_balance`

**Task/purpose.** Solve a fictional well-mixed steady tracer concentration from
source and clean-air flow, or invert one variable.

**Response/template.** Concentration above outdoor baseline, flow, or source.

**Derivation.** Under declared model `C_in−C_out=S/Vdot` with compatible units.

**Difficulty.** L1 direct arbitrary tracer; L2 unit conversion; L3 multiple
sources/partial recirculation with supplied clean-air fraction.

**Distractors/constraints.** no health interpretation; do not use CO₂ thresholds
unless a fictional exercise threshold is explicitly supplied.

**Feedback.** Pollutant mass-in/mass-out ledger and model limitations.

**Examples.** (1) source `100 units/h`, flow `200 m³/h`→`.5 units/m³` above
baseline (L1). (2) ppm conversion with supplied molar assumptions (L2). (3)
recirculated stream clean-air fraction (L3).

**Validation.** steady contaminant mass residual zero and nonnegative state.

### Family `airflow_ventilation_audit`

**Task/purpose.** Diagnose one normalization, pressure, path, mass-balance,
heat-flow, recovery, or inference error.

**Response/template.** Root step and correction.

**Derivation.** Compare airflow network, reference-pressure profile, mass/energy
balances, and conclusion scope.

**Difficulty.** L1 unit/denominator; L2 pressure exponent or heat equation; L3
aggregate leakage data used to claim a specific real leak location.

**Distractors/constraints.** Exactly one root mutation; no diagnostic advice.

**Feedback.** Show violated normalization/conservation/scope rule.

**Examples.** (1) L/s treated as m³/s (L1). (2) flow scaled linearly from 50 Pa
with `n=.65` (L2). (3) fan total claimed to prove window leakage (L3).

**Validation.** fault manifest, network residuals, banned inference detector.

### Cross-family progression

Air-change conversion precedes normalized test metrics. Power-law flow and
parallel paths precede zone balance. Ventilation heat and recovery reuse balanced
flows. The tracer family demonstrates a second conservation law while remaining
health-neutral. Audits integrate them.

## 7. Category: Solar gains, radiant conditions, and dynamic thermal response

### Category purpose

Connect solar geometry and aperture properties to heat gains, then distinguish
air, radiant, operative, stored, delayed, and attenuated thermal responses.

### Learn

Ideal transmitted solar power is incident irradiance times aperture area times
the supplied total solar-energy transmittance and shading factors. Air
temperature alone does not describe the radiant environment; a simple operative
temperature weights air and mean radiant temperatures under its stated
assumptions. Heat capacity stores energy, so temperature response takes time.

### Prerequisites

Categories 2–4; geometry, trigonometry, power/energy, weighted averages.

### Category boundaries

Solar/optical properties and comfort thresholds are supplied fictional data.
No real glazing/shading selection, glare/daylighting, skin exposure, HVAC
sizing, or comfort certification. Dynamic component properties may be supplied
rather than derived from full matrix methods.

### Common misconceptions

- Treating irradiance as energy without multiplying by area and time.
- Applying a shading fraction as the transmitted fraction when it is the blocked
  fraction.
- Using gross window opening instead of stated glazed area.
- Adding air and radiant temperatures rather than weighting them.
- Treating heat capacity as thermal resistance.
- Assuming thermal mass reduces total steady-state heat loss.
- Confusing phase shift with attenuation or clock time with elapsed time.

### Family `solar_aperture_gain`

**Task/purpose.** Calculate ideal transmitted solar power/energy through a
fictional aperture from supplied irradiance, area, and `g`.

**Response/template.** `W` or `kWh`: `Find transmitted solar {power|energy}.`

**Derivation.** `Phi=I A_glazed g` and integrate piecewise-constant intervals for
energy.

**Difficulty.** L1 power; L2 frame/glazed area distinction; L3 time series and
several apertures.

**Distractors/constraints.** omit area/g, use U-value, confuse W/kWh.

**Feedback.** Show incident→aperture→transmitted chain.

**Examples.** (1) `500×2×.6=600 W` (L1). (2) opening `3 m²`, frame 20%,
glazed `2.4 m²` (L2). (3) three hourly intervals→energy sum (L3).

**Validation.** unit-typed multiplication/integration and nonnegative gain.

### Family `geometric_shading_fraction`

**Task/purpose.** Determine sunlit/shaded aperture fraction from a bounded 2D
projection or apply the declared factor convention.

**Response/template.** Percent plus transmitted gain.

**Derivation.** Clip projected shadow polygon against glazing polygon;
`f_sun=1−A_shadow_union/A_glazing`, then apply profile factor.

**Difficulty.** L1 rectangular strip; L2 offset polygon; L3 overlapping shadows
requiring union.

**Distractors/constraints.** add overlapping shadows twice, swap sun/shade,
shade gross opening not glazing.

**Feedback.** Overlay clipped shadow union and label convention.

**Examples.** (1) half window shaded→50% sunlit (L1). (2) `0.8/2 m²` shade
→60% sunlit (L2). (3) two overlapping devices union `1.1 m²` (L3).

**Validation.** exact polygon Boolean and `0≤fraction≤1`.

### Family `orientation_irradiance_schedule`

**Task/purpose.** Select and aggregate the supplied irradiance series for each
aperture orientation/time.

**Response/template.** Matching/table and solar-power subtotal.

**Derivation.** Resolve aperture normal/orientation to named weather series,
then apply area/property/shading schedule.

**Difficulty.** L1 one orientation; L2 several windows/hours; L3 rotated plan
and changing shading state.

**Distractors/constraints.** cardinal mirror, use horizontal series for vertical
surface, apply noon value all day.

**Feedback.** Link plan normal→weather column→gain.

**Examples.** (1) east window uses east column (L1). (2) east+south hourly
subtotals (L2). (3) rotated drawing requires world orientation (L3).

**Validation.** semantic normals and schedule IDs, not screen direction.

### Family `operative_temperature_simple`

**Task/purpose.** Calculate a supplied weighted operative-temperature
approximation or recover one input.

**Response/template.** Temperature or weight.

**Derivation.** Apply displayed `Top=a Tair+(1−a) Tmrt`; special still-air
exercise may use equal weights.

**Difficulty.** L1 equal weights; L2 supplied unequal weight; L3 inverse mean
radiant temperature.

**Distractors/constraints.** sum temperatures, always assume 50/50, use Celsius
absolute ratio.

**Feedback.** Show air and radiant contributions separately.

**Examples.** (1) `22°C` air, `18°C` MRT→`20°C` at 0.5 (L1). (2) weight
`.6`→weighted result (L2). (3) recover MRT from Top (L3).

**Validation.** weighted average lies between inputs for generated weights.

### Family `radiant_surface_mean`

**Task/purpose.** Compute a simplified view-factor-weighted mean radiant
temperature from supplied surface temperatures and factors.

**Response/template.** Temperature under named linear or fourth-power profile.

**Derivation.** Use exactly the displayed teaching model: linear weighted mean
at early levels; advanced profile uses kelvin fourth powers and fourth root.

**Difficulty.** L1 equal linear factors; L2 unequal factors; L3 compare linear
approximation with explicit radiative model.

**Distractors/constraints.** factors not normalized, °C fourth powers, arithmetic
unweighted mean.

**Feedback.** Show surface contribution and model choice.

**Examples.** (1) equal `16/24°C`→`20°C` linear (L1). (2) 70/30 weighted
(L2). (3) fourth-power calculation in K (L3).

**Validation.** factors sum one; result bounds and independent high-precision
oracle.

### Family `lumped_heat_capacity`

**Task/purpose.** Calculate heat capacity `C=sum(m cp)=sum(rho V cp)` or energy
for a temperature change.

**Response/template.** `J/K`, `MJ/K`, or energy.

**Derivation.** Sum selected active masses under the displayed model; `Q=CΔT`.

**Difficulty.** L1 one mass; L2 density/volume; L3 several active fractions and
inverse temperature change.

**Distractors/constraints.** confuse C with R/U, omit density, include all
building mass despite selected active fraction.

**Feedback.** Show mass→capacity→stored-energy chain.

**Examples.** (1) `100 kg×1 kJ/kgK=100 kJ/K` (L1). (2) `rho V cp` (L2).
(3) two active layers store `12 MJ` over `3 K` (L3).

**Validation.** dimensional sum and Q/C round-trip.

### Family `first_order_zone_time_constant`

**Task/purpose.** Calculate or interpret `tau=C/H` for a stated lumped zone
model.

**Response/template.** Time with unit or missing C/H.

**Derivation.** Divide lumped heat capacity by total conductance and convert
seconds/hours.

**Difficulty.** L1 direct; L2 derive C/H; L3 compare initial slopes or recover a
parameter from tau.

**Distractors/constraints.** multiply C×H, use U instead of whole H, call tau
time to reach final state exactly.

**Feedback.** Explain tau as model response scale, not a guarantee.

**Examples.** (1) `C=3.6 MJ/K,H=100 W/K`→`10 h` (L1). (2) derive both terms
(L2). (3) compare two fictional zones (L3).

**Validation.** dimension time and analytic RC oracle.

### Family `periodic_attenuation_phase`

**Task/purpose.** Apply supplied decrement factor and phase shift to a periodic
temperature/heat-flux signal.

**Response/template.** Output amplitude and peak clock time.

**Derivation.** `A_out=f_d A_in`; shift phase/time modulo the stated period,
preserving mean unless profile says otherwise.

**Difficulty.** L1 attenuation; L2 phase crossing midnight; L3 compare two
components and reconstruct output sinusoid.

**Distractors/constraints.** reduce mean, confuse factor with percent blocked,
add phase degrees as hours.

**Feedback.** Overlay input/output waves with mean, amplitude, and peak.

**Examples.** (1) `10 K×.2=2 K` amplitude (L1). (2) 16:00 peak +10 h→02:00
(L2). (3) choose later/lower response (L3).

**Validation.** periodic modulo arithmetic and sampled signal fit.

### Family `solar_dynamic_audit`

**Task/purpose.** Diagnose one aperture, shading, orientation, temperature,
capacity, time-constant, or phase error.

**Response/template.** Root step and corrected result.

**Derivation.** Compare geometry/schedule, radiative weighting, and dynamic
model expression graph.

**Difficulty.** L1 factor/unit; L2 wrong orientation/shadow overlap; L3
steady-state resistance claim substituted for storage response.

**Distractors/constraints.** Exactly one root mutation; no comfort/design claim.

**Feedback.** Trace solar/radiant/storage layer separately.

**Examples.** (1) shaded fraction used as sunlit (L1). (2) east window uses west
series (L2). (3) thermal mass claimed to change final steady heat loss (L3).

**Validation.** fault manifest, geometry and time-series invariants.

### Cross-family progression

Solar aperture gain precedes shading and orientation schedules. Air/radiant
temperature families establish environmental states. Capacity then introduces
storage, followed by time constant and periodic response. Audits test that
steady and dynamic properties are not conflated.

## 8. Category: Weather, zone loads, and energy balances

### Category purpose

Translate stated climate and schedules into condition-specific coefficients,
loads, temperatures, and accumulated energy while keeping every balance term
visible.

### Learn

A heat-transfer coefficient in W/K becomes a load only after multiplying by a
temperature difference. A load in W becomes energy only after integrating over
time. Degree-hours/days compress a temperature-difference series and are useful
only under the stated base/threshold model. Zone balances must preserve signs
for transmission, air exchange, solar/internal gains, storage, and supplied
heating/cooling.

### Prerequisites

Categories 2–7; tables, piecewise sums, signed balances.

### Category boundaries

No regulatory energy rating, actual utility prediction, plant efficiency,
equipment sizing, cost, emissions, or weather-file recommendation. V1 models a
single idealized zone or uncoupled zones.

### Common misconceptions

- Treating degree-days as temperature or days alone.
- Multiplying W/K by clock hours without temperature difference.
- Adding heating and cooling magnitudes rather than applying `max(0,...)`.
- Counting internal/solar gains as losses in a signed balance.
- Assuming free-floating temperature and setpoint load are the same output.
- Rounding each hour before summing.
- Calling a design peak an annual energy result.

### Family `degree_hour_day_accumulate`

**Task/purpose.** Calculate accumulated temperature difference from a supplied
hourly/daily series and explicit base/threshold rule.

**Response/template.** `K·h` or `K·day`.

**Derivation.** Apply displayed positive-part rule per interval and sum;
convert 24 K·h per K·day only for compatible data.

**Difficulty.** L1 all below base; L2 values cross base; L3 separate
heating/cooling bases or threshold logic.

**Distractors/constraints.** average then clip when not equivalent, include
negative contributions, divide by wrong time.

**Feedback.** Show per-interval positive differences.

**Examples.** (1) base 18, daily mean 8→`10 K·day` (L1). (2) hourly series
crosses base (L2). (3) distinct heating/cooling accumulations (L3).

**Validation.** direct interval sum and expanded time-step oracle.

### Family `transmission_energy_from_weather`

**Task/purpose.** Calculate ideal transmission energy from H and a temperature-
difference series or accumulated degree-hours.

**Response/template.** `kWh`.

**Derivation.** `Q=sum(H ΔT_t Δt)`; equivalent `H×degree-hours/1000` when
assumptions match.

**Difficulty.** L1 constant interval; L2 degree-hours; L3 several boundary
classes with different temperatures.

**Distractors/constraints.** H treated as W, use degree-days without ×24,
include gains when only transmission requested.

**Feedback.** Reconcile hourly and compressed methods.

**Examples.** (1) `100 W/K×20 K×10 h=20 kWh` (L1). (2) `H×2400 K·h`
(L2). (3) outdoor/ground/adjacent zone sums (L3).

**Validation.** two-method equality for eligible fixtures.

### Family `ventilation_energy_schedule`

**Task/purpose.** Integrate sensible ventilation heat transfer over scheduled
flows, temperatures, and recovery states.

**Response/template.** `kWh` by interval/state and total.

**Derivation.** Compute `rho cp Vdot ΔT` at each interval, apply declared ideal
recovery relation, then integrate exactly.

**Difficulty.** L1 constant flow; L2 on/off schedule; L3 changing recovery and
flow with sign reversals.

**Distractors/constraints.** use n without volume, apply effectiveness twice,
sum W as kWh.

**Feedback.** Table flow→effective ΔT→W→kWh.

**Examples.** (1) `1 kW×8 h=8 kWh` (L1). (2) occupied/unoccupied flows (L2).
(3) three-state recovery schedule (L3).

**Validation.** interval energy and airflow/sensible oracle.

### Family `internal_gain_schedule`

**Task/purpose.** Aggregate fictional people/equipment/lighting sensible or
latent gains from schedules.

**Response/template.** Power and energy by source/type.

**Derivation.** Multiply explicit per-instance/source gains by count/fraction and
duration; keep sensible and latent dimensions/categories separate.

**Difficulty.** L1 one source; L2 schedules/diversity; L3 sensible/latent split
and overlapping intervals.

**Distractors/constraints.** count all instances continuously, add percentages,
mix latent mass source with sensible W.

**Feedback.** Timeline and source ledger.

**Examples.** (1) 5 fictional sources×100 W=`500 W` (L1). (2) 50% schedule
for 4 h (L2). (3) separate sensible `kWh` and moisture `kg` (L3).

**Validation.** schedule union and dimensional ledgers.

### Family `solar_internal_gain_balance`

**Task/purpose.** Combine selected solar and internal gains for a zone/time step.

**Response/template.** Gain subtotal and provenance IDs.

**Derivation.** Sum only active source powers from Categories 7/8 after schedule,
aperture, and shading evaluation.

**Difficulty.** L1 two gains; L2 several schedules; L3 distinguish zone-delivered
fraction from incident/source value.

**Distractors/constraints.** incident solar not transmitted, inactive source,
count source shared between zones twice.

**Feedback.** Trace every gain from source to zone.

**Examples.** (1) `600 W solar+400 W internal=1 kW` (L1). (2) hourly gain
profile (L2). (3) source allocation fractions by zone (L3).

**Validation.** source allocation sums to declared total and IDs unique.

### Family `balance_temperature_simple`

**Task/purpose.** Find outdoor balance temperature where steady losses equal
constant useful gains under an explicit simple model.

**Response/template.** Temperature.

**Derivation.** Solve `H(T_set−T_bal)=Phi_gains`:
`T_bal=T_set−Phi_gains/H`.

**Difficulty.** L1 direct; L2 derive H/gains; L3 inverse unknown gain/H.

**Distractors/constraints.** add gains/H, use U instead of H, claim universal
building balance point.

**Feedback.** Show loss line intersecting gain level.

**Examples.** (1) `Tset=20,H=100,gains=500 W`→`15°C` (L1). (2) include
ventilation H (L2). (3) recover gains from observed fictional balance (L3).

**Validation.** substitute into signed steady balance.

### Family `steady_zone_load_balance`

**Task/purpose.** Solve ideal heating/cooling load or free-floating steady
temperature from transparent zone gains and losses.

**Response/template.** Signed load and mode, or temperature.

**Derivation.** Enforce `sum(Phi)=0`; for setpoint solve equipment residual, for
free-floating solve node temperature. Apply no simultaneous heating/cooling.

**Difficulty.** L1 heating residual; L2 gains offset loss; L3 adjacent zones and
solve temperature.

**Distractors/constraints.** add gains to required heating, return negative
heating rather than cooling mode, confuse setpoint/free-float.

**Feedback.** Signed balance bar and zero residual.

**Examples.** (1) losses 2 kW, gains .5→heating 1.5 kW (L1). (2) gains exceed
loss→cooling residual (L2). (3) solve zone T from boundary network (L3).

**Validation.** node energy residual zero and mode exclusivity.

### Family `one_zone_rc_step`

**Task/purpose.** Advance a supplied first-order lumped zone model one or several
time steps.

**Response/template.** Ordered temperatures/loads.

**Derivation.** Apply displayed update exactly, e.g.
`T_next=T+Δt/C[H(Tout−T)+Phi_gains+Phi_system]`.

**Difficulty.** L1 one friendly step; L2 schedule over several steps; L3 choose
stable step/identify energy-residual error or setpoint clipping.

**Distractors/constraints.** omit Δt/C, wrong loss sign, use hours with joules
without conversion, update all steps from initial T.

**Feedback.** Show storage-energy change equals net input each step.

**Examples.** (1) net `100 W` for `1 h`, `C=.36 MJ/K`→`+1 K` (L1). (2)
four-step weather/gain series (L2). (3) ideal system clips at setpoint (L3).

**Validation.** difference-equation and energy-ledger oracles; declared stable
parameter range.

### Family `load_energy_weather_audit`

**Task/purpose.** Diagnose one weather, base, coefficient, schedule, sign,
time-step, rounding, or model-output error.

**Response/template.** Root node and corrected result/conclusion.

**Derivation.** Replay climate preprocessing, coefficients, signed balances,
integration, and dynamic state updates.

**Difficulty.** L1 W/kWh; L2 degree-day base or gain sign; L3 peak load presented
as annual energy or setpoint/free-floating outputs mixed.

**Distractors/constraints.** Exactly one root mutation; no performance rating.

**Feedback.** Trace weather→load→time integration/state.

**Examples.** (1) 2 kW for 3 h reported 2 kWh (L1). (2) negative degree-hour
terms retained (L2). (3) design peak labeled yearly use (L3).

**Validation.** fault manifest and independent expanded time-series oracle.

### Cross-family progression

Degree accumulation precedes transmission and ventilation energy. Internal and
solar gain schedules are learned separately before combination. Balance
temperature introduces inversion; steady zone balance introduces signs. RC
stepping adds storage only after steady mastery. Audits close the sequence.

## 9. Category: Measurement evidence, uncertainty, alternatives, and integrated audits

### Category purpose

Train evidence-aware interpretation of building-science measurements and model
results, including what the data do not establish.

### Learn

A sensor reading is conditional on location, time, instrument, emissivity,
pressure, and uncertainty. A pattern can support several hypotheses. Compare a
model with measurements only when their quantity, boundary, and time basis
match. Alternatives and revisions can be ranked by a supplied metric without
becoming recommendations.

### Prerequisites

Relevant direct categories and Data Literacy basics.

### Category boundaries

All datasets and images are synthetic. No real diagnosis, commissioning,
certification, thermography interpretation service, or retrofit advice.

### Common misconceptions

- Inferring heat flow direction from one temperature without boundaries.
- Treating thermal-image apparent temperature as exact surface temperature.
- Concluding a material/cause from a visible pattern alone.
- Comparing modeled steady state with a transient reading.
- Ignoring uncertainty when differences are smaller than resolution.
- Ranking one metric as whole-building “best.”
- Treating correlation or model fit as proof of cause.

### Family `sensor_series_quantity_read`

**Task/purpose.** Read extrema, mean, interval, slope, lag, or threshold duration
from a synthetic temperature/RH/flow/heat-flux series.

**Response/template.** Number, interval selection, or ordered events.

**Derivation.** Query semantic time-series values with declared sample/averaging
convention.

**Difficulty.** L1 point/extreme; L2 duration/mean; L3 lag between two series
with missing samples explicitly handled.

**Distractors/constraints.** axis/unit/time-zone errors, interpolate when
forbidden, confuse sample/interval mean.

**Feedback.** Highlight exact points/intervals and calculation.

**Examples.** (1) maximum `24.2°C` at 15:00 (L1). (2) 3 h above fictional
threshold (L2). (3) outdoor peak leads indoor by 6 h (L3).

**Validation.** semantic series oracle and accessible table equivalence.

### Family `thermal_image_relative_interpret`

**Task/purpose.** Compare synthetic apparent-temperature regions under supplied
emissivity/reflection assumptions and choose only supported statements.

**Response/template.** Region selection plus evidence-limited statement.

**Derivation.** Use generated surface/apparent temperature field and explicit
camera profile; compare calibrated region statistics.

**Difficulty.** L1 warmer/cooler region; L2 apparent versus true with supplied
correction; L3 several hypotheses remain possible.

**Distractors/constraints.** no cause/material/moisture claim from image alone;
color palette legend visible and accessible.

**Feedback.** Separate observed pattern, assumed correction, and unsupported
cause.

**Examples.** (1) Region A appears 2 K cooler (L1). (2) correct supplied
emissivity bias (L2). (3) “pattern warrants more evidence,” not “proves leak”
(L3).

**Validation.** semantic field, palette independence, hypothesis set.

### Family `pressure_flow_dataset_fit`

**Task/purpose.** Estimate/select C and n for a synthetic fan-pressure dataset
or identify a nonconforming point.

**Response/template.** Parameters, line selection, or outlier ID.

**Derivation.** Fit `ln Vdot=ln C+n ln Δp` with displayed method or construct
exact two-point cases; compute residuals.

**Difficulty.** L1 exact two points; L2 several noisy points and supplied fit;
L3 compare pressurization/depressurization fictional curves.

**Distractors/constraints.** linear-axis slope, include zero in log, declare leak
location.

**Feedback.** Show log-log plot and residuals.

**Examples.** (1) exact `n=.5` dataset (L1). (2) choose closest parameter pair
(L2). (3) identify sensor outlier under supplied tolerance (L3).

**Validation.** regression oracle, seeded noise, unique classification.

### Family `model_measurement_basis_match`

**Task/purpose.** Decide whether a model output and synthetic measurement are
comparable and identify a necessary conversion/condition.

**Response/template.** `comparable|convert|not comparable` plus reason.

**Derivation.** Compare quantity dimension, spatial boundary, time basis,
pressure, state, sign, and profile metadata.

**Difficulty.** L1 unit conversion; L2 average versus instantaneous; L3
steady-state assembly versus transient whole-building measurement.

**Distractors/constraints.** numerical closeness is not comparability.

**Feedback.** Compatibility matrix for metadata.

**Examples.** (1) W and kW convertible (L1). (2) hourly mean versus point sample
needs aggregation (L2). (3) component U cannot directly equal whole envelope H
(L3).

**Validation.** type/profile comparator gives unique reason set.

### Family `uncertainty_sensitivity`

**Task/purpose.** Propagate a supplied range through a monotonic simple model or
rank which input most affects an output locally.

**Response/template.** output interval, sensitivity, or ranking.

**Derivation.** Evaluate declared endpoints for monotonic models or finite
difference `Δoutput/Δinput`; no probabilistic claim unless distribution supplied.

**Difficulty.** L1 one uncertain input; L2 two independent worst-case bounds; L3
local sensitivity versus absolute uncertainty contribution.

**Distractors/constraints.** add percentage points blindly, assume independence/
normal distribution, rank derivative without input uncertainty.

**Feedback.** Separate sensitivity from uncertainty magnitude.

**Examples.** (1) `U=.25±.02`, fixed AΔT→load range (L1). (2) U and area
bounds (L2). (3) smaller derivative but larger input range dominates (L3).

**Validation.** endpoint enumeration and derivative/finite-difference agreement.

### Family `fictional_alternative_compare`

**Task/purpose.** Compare fictional alternatives by one or more explicitly
weighted exercise metrics without recommending a real option.

**Response/template.** ranking/Pareto set plus metric contributions.

**Derivation.** Recompute all candidates under identical boundaries; normalize
and weight only as displayed, or determine nondominance.

**Difficulty.** L1 one metric; L2 two conflicting metrics/Pareto; L3 sensitivity
to supplied weights or weather.

**Distractors/constraints.** change boundary conditions, call one universally
best, hide tradeoff.

**Feedback.** Metric table and conditional wording.

**Examples.** (1) rank by H only (L1). (2) lower H but higher modeled peak
temperature→both nondominated (L2). (3) ranking changes with fictional weights
(L3).

**Validation.** common-input check, ranking/Pareto oracle, banned recommendation
language.

### Family `building_science_revision_delta`

**Task/purpose.** Attribute changes between two synthetic model revisions to
geometry, property, boundary, schedule, or method/profile changes.

**Response/template.** signed deltas, contributor categories, comparability flag.

**Derivation.** Match stable IDs and metadata; hold common conditions where
requested; refuse direct delta if profile bases are incompatible.

**Difficulty.** L1 one property; L2 several offsetting changes; L3 method and
weather change require normalization before attribution.

**Distractors/constraints.** compare unnormalized runs, reverse delta, hide
profile change.

**Feedback.** Waterfall plus a “held constant” ledger.

**Examples.** (1) U revision lowers H `2 W/K` (L1). (2) window area and psi
offset (L2). (3) weather-normalize before energy comparison (L3).

**Validation.** contributor sum, identity matching, comparability rules.

### Family `integrated_building_science_audit`

**Task/purpose.** Find one root defect or missing fact in a small coupled
heat–air–moisture–solar–energy case.

**Response/template.** root layer, evidence, corrected model result, supported
conclusion, affected outputs.

**Derivation.** Validate model scope, dimensions, properties, geometry,
conservation, state functions, time bases, provenance, and conclusion claims;
return earliest causal mismatch.

**Difficulty.** L3 two mastered domains; L4 three domains and revision; L5
recognize insufficient evidence or multiple hypotheses.

**Distractors/constraints.** Exactly one seeded root defect unless
insufficiency/multiple-hypothesis case is explicit; never require real advice.

**Feedback.** Causal graph from assumption/source through outputs and limit of
inference.

**Examples.** (1) ventilation flow unit error changes heat balance and surface
screen (L3). (2) shading schedule stale after aperture revision changes solar
gain/zone temperature (L4). (3) one thermal image plus aggregate airflow cannot
identify a leak location→insufficient evidence (L5).

**Validation.** fault/hypothesis manifest, unique earliest cause or exact
insufficiency set, all downstream effects reproduced.

### Cross-family progression

Direct series reading precedes image and pressure-flow interpretation. Metadata
matching comes before uncertainty. Alternative comparison and revision
attribution require common bases. Integrated audits combine no more than three
mastered mechanisms and explicitly reward limited conclusions.

## 10. Topic-level progression

### Level 1 — One quantity and one mechanism

- identify physical quantities and units;
- calculate one layer R, element H, vapour state, airflow conversion, or gain;
- read one graph point or simple layered diagram;
- use explicitly supplied properties and friendly numbers;
- distinguish power from energy and RH from humidity ratio.

### Level 2 — One assembly or process

- combine series layers or area-weighted paths;
- handle openings and one supplied bridge;
- follow thermal or vapour profiles;
- calculate dew point, sensible process, air-change metric, ventilation heat,
  shading, operative temperature, or degree-hours;
- keep one gross/net, pressure, or schedule convention in view.

### Level 3 — Coupled contributors and schedules

- aggregate plane/linear/point envelope terms;
- mix or cool/dehumidify moist air;
- apply simplified interstitial/surface screens;
- solve airflow mass balances and heat recovery;
- combine solar/internal gains with transmission/ventilation;
- advance a one-zone RC model;
- reconcile measurement/model metadata and find one root fault.

### Level 4 — Inverse, revision, and sensitivity reasoning

- solve backward for a property or boundary;
- compare series/parallel or steady/dynamic models;
- attribute revision deltas while holding conditions constant;
- propagate supplied uncertainty and distinguish local sensitivity;
- diagnose one root error across up to three mechanisms.

### Level 5 — Model sufficiency and disciplined inference

- distinguish observation, calculation, screen, hypothesis, and professional
  conclusion;
- identify missing property/mechanism/time basis;
- preserve multiple hypotheses when the evidence does not distinguish them;
- compare alternatives conditionally, never universally;
- refuse compliance, safety, health, durability, sizing, or retrofit claims.

## 11. Adaptive practice guidance

Track mastery by:

```text
family
quantity dimension
unit representation
model profile
steady/dynamic
series/parallel/network
material/component/envelope/zone/time layer
boundary direction
psychrometric variable
moisture mechanism
pressure/time reference
graph/table/diagram representation
rounding/tolerance
misconception
difficulty dimensions
```

Routing:

- R/U/lambda confusion → quantity-unit and one-layer contrasts.
- Millimetres used in conductivity equation → isolated thickness conversion.
- Series/parallel error → resistance-network classification before arithmetic.
- Gross/net opening error → geometry ledger before thermal ledger.
- `psi` treated as U → dimension and length-contribution contrast.
- Power/energy error → one constant interval, then piecewise integration.
- RH treated as moisture amount → same vapour pressure at two temperatures.
- Dew-point error → vapour pressure then saturation inversion.
- RH averaged in mixing → dry-air/water mass ledger.
- Thermal/vapour profile conflation → aligned but independently scaled stacks.
- Screen overclaim → choose supported conclusion without recalculation.
- n50/q50/natural-flow conflation → pressure and normalization labels.
- Pressure curve scaled linearly → log-log two-point drills.
- Ventilation heat unit error → flow→mass/heat-capacity unit chain.
- Shaded/sunlit reversal → polygon overlay before gain calculation.
- Thermal mass/steady loss conflation → same U, different C response pair.
- Degree-day/base error → interval positive-part table.
- Sign error in balance → gains/losses bar forced to zero.
- Sensor/image overinterpretation → observation-versus-hypothesis matching.
- Integrated failure → route to earliest unmastered dependency, not simply
  smaller numbers.

Speed is optional telemetry, not mastery. Slow correct conceptual work should
receive less arithmetic scaffolding, not artificial time pressure.

## 12. Answer checking and worked feedback

### Dimension-aware numeric checking

- Parse every numeric answer as a typed physical quantity.
- Normalize compatible SI units exactly before comparison.
- Keep absolute temperature and temperature difference as distinct types.
- Use rationals/decimal arithmetic for linear relationships.
- Use deterministic high precision for saturation inversion, logarithms,
  exponentiation, fourth roots, and RC stepping.
- Apply tolerance only after the declared final rounding.
- Never use broad relative tolerance that admits a wrong formula or sign.
- Multi-field state answers must be mutually consistent, not merely
  individually near expected numbers.

### Semantic checking

- Layer/interface answers compare stable ordered IDs.
- Network answers compare nodes, branches, direction, and conservation.
- Chart/image selections resolve to semantic states/regions.
- Process choices compare preserved quantities and path type.
- Model conclusions compare an allowed-claim taxonomy:

```text
observation
calculated quantity
simplified screen result
hypothesis consistent with evidence
insufficient evidence
prohibited real-world conclusion
```

- Alternative constructions are accepted if they satisfy the same declared
  physical model and exact target.
- `Cannot determine` requires the correct missing-data/mechanism set.

### Tolerance policy

Prompts display required digits. Exact friendly results use exact checking.
Table/chart reading accepts a profile-specific band no wider than half the
smallest readable division. Derived transcendental results accept the correctly
rounded value plus a tiny computational guard well below one last displayed
digit. Classification near a threshold is rejected during generation unless
the uncertainty/ambiguity itself is the task.

### Worked feedback

Feedback order:

1. Name the requested quantity and model profile.
2. State active mechanisms, boundaries, pressure/time basis, and sign.
3. Highlight source geometry/properties/data.
4. Show the dimension-typed relation or conservation equation.
5. Calculate without premature rounding.
6. Check by an independent method, limiting case, or conservation residual.
7. Diagnose a known misconception when matched.
8. State exactly what the model supports and what it does not.

Example:

> Under this one-dimensional steady profile, the interface temperature is
> 8.0°C. The indoor-air dew point from the bundled saturation function is
> 9.1°C, so the modeled surface is 1.1 K below that dew point. That is a
> condensation-screen result for the supplied boundary conditions; it does not
> diagnose moisture damage, mould, or real assembly performance.

## 13. Rendering, interaction, accessibility, and localization

### Rendering

- Use semantic SVG for layer stacks, resistance networks, envelope diagrams,
  psychrometric charts, airflow graphs, shadows, time series, and balance bars.
- Align layer geometry with temperature and vapour-pressure profiles.
- Distinguish property, coefficient, power, and energy layers visually.
- Keep warm/cold, inside/outside, source/sink, pressure, and time directions
  explicit.
- Plot psychrometric curves from the same oracle used for answers.
- Plot measurements with units, sampling interval, uncertainty, and legend.
- Render synthetic thermograms with numeric region alternatives; color palette
  must not determine correctness.
- Avoid label/curve collisions and unreadable dense charts.

### Interaction

- Semantic points, layers, branches, regions, and time intervals have generous
  hit targets.
- Keyboard/list/table alternatives replace all pointing/dragging.
- Pan/zoom never changes answer semantics.
- The learner can toggle property, resistance, temperature, vapour, airflow,
  gain/loss, and provenance overlays after answering.
- Process construction snaps to valid chart states/curves, not raw pixels.
- Step-through animation has static previous/next alternatives.

### Accessibility

- Every diagram has a structured equivalent: ordered layers, node/branch table,
  state table, time series, polygon coordinates, or region statistics.
- Color is never the only hot/cold, gain/loss, wet/dry, or revision cue.
- Line patterns, arrows, labels, and text reinforce direction/class.
- Screen readers receive expanded unit names and distinguish degree Celsius,
  kelvin difference, square/cubic units, and per-unit terms.
- Psychrometric and thermal-image exercises have nonvisual state/region versions
  that train the same semantic reasoning where possible.
- Reduced-motion mode uses static steps.
- Visual and structured mastery evidence may be separated when tasks differ.

### Localization

UI locale, unit profile, climate profile, and physics profile are independent.
Localization covers decimal/group separators, unit spacing, superscripts,
subscripts, direction, clock/date/time-zone conventions, and abbreviations.
Translation must not replace a fictional threshold/profile with local law or
professional convention. Imperial support requires a separately validated unit
profile and is deferred.

## 14. Generator and implementation architecture

Recommended standalone modules:

```text
seededRng
dimensionedUnits
decimalMath
buildingScienceModel
propertyRegistry
profileRegistry
resistanceNetwork
thermalEnvelopeOracle
psychrometricOracle
vapourDiffusionOracle
moistureStoreOracle
airflowNetworkOracle
solarGeometryOracle
zoneBalanceOracle
timeSeriesIntegrator
rcStepper
uncertaintyOracle
revisionDiffer
provenanceGraph
faultInjector
semanticSvgRenderer
accessibleFactBuilder
semanticAnswerChecker
```

### Generation pipeline

1. Select family, misconception, difficulty dimensions, and profile.
2. Construct a valid model backward from a friendly result or useful boundary.
3. Generate geometry, properties, boundary/weather schedules, and source IDs.
4. Solve with the primary mechanism-specific oracle.
5. Recompute through an independent equation, network, table, or conservation
   path.
6. For coupled families, verify every intermediate state before composition.
7. Generate misconception-based distractors or one controlled root mutation.
8. Render visual and structured representations from the same semantic data.
9. Check claim vocabulary against the professional/safety boundary.
10. Reject ambiguity, impossible states, weak distractors, clutter, or recent
    structural repetition.

### Exactness and numerical methods

- Units and linear balances use exact integer/rational/decimal arithmetic.
- Saturation pressure uses one versioned monotonic function/table per profile;
  inversion uses deterministic bracketed solving.
- Psychrometric mixing checks dry-air, water, and energy conservation.
- Network solvers check node conservation and positive/passive parameters.
- Polygon shadow clipping uses robust exact predicates.
- Time integration declares left/right/midpoint/trapezoid or exact
  piecewise-constant interpretation.
- RC stepping declares scheme and stability range; v1 normally uses explicit
  Euler only with generated stable steps, plus analytic fixtures for validation.
- Regression/noise is seeded and the fitting method is displayed.
- No browser-dependent locale or binary-float tie changes an archived answer.

### Standalone architecture

HTML/JS/CSS only; no backend, standards service, weather API, product library,
simulation engine, or uploaded-document analysis at runtime. All profiles,
fictional datasets, charts, oracles, translations, and validation fixtures are
bundled and versioned.

## 15. Automated validation requirements

### Dimension and property tests

- Every property and result has a unique dimension vector.
- Unit round-trips are exact; squared/cubic/time-reference conversions pass.
- Temperature absolute/difference operations reject invalid combinations.
- Conductivity, resistance, transmittance, capacity, density, pressure, and flow
  properties are positive where physically required.
- Fractions/view factors/area partitions sum correctly.
- All property/profile/source IDs resolve and versions are archived.

### Thermal-network tests

- Series R/U reciprocal and forward/inverse fixtures pass.
- Parallel path area sums equal atomic path heat flow.
- Interface temperature drops sum to boundary difference.
- Gross/net opening areas partition the source geometry.
- `sum(UA)+sum(psi L)+sum(chi)` equals atomic envelope H.
- Every thermal bridge/point ID is counted exactly once.
- Heat-flow networks conserve energy at internal nodes.
- Power/time integration equals energy under the declared scheme.

### Psychrometric and moisture tests

- Saturation function is monotonic over supported range.
- Dew-point forward/inverse round-trips.
- Generated states satisfy `0≤RH≤100%`, `pv<p`, and supported chart bounds.
- Sensible processes preserve humidity ratio until a modeled phase change.
- Mixing conserves dry air, water, and enthalpy.
- Cooling/dehumidification has nonnegative condensate and saturated leaving
  state where declared.
- Vapour-pressure drops sum to boundary difference.
- Thermal and vapour profiles use separate resistance networks.
- Moisture stores conserve mass including overflow/clipping.
- Screen wording never becomes durability, mould, health, or safety diagnosis.

### Airflow, solar, and dynamic tests

- Air-change/flow/volume round-trips and 3600 conversions pass.
- Normalized metrics retain their reference pressure and denominator.
- Pressure-flow curves reproduce C/n and log slope.
- Airflow and tracer nodes conserve mass.
- Ventilation/recovery cases conserve sensible energy under their ideal model.
- Shadow union lies within aperture and fractions stay in `[0,1]`.
- Solar gains equal aperture/time-series atomic sums.
- Operative/MRT weighted results satisfy generated bounds.
- `tau=C/H` has time dimensions and RC analytic/step fixtures agree within the
  declared discretization tolerance.
- Periodic amplitude/phase reconstruction passes modulo-period tests.

### Weather, balance, and revision tests

- Degree-hour/day direct and compressed calculations agree where eligible.
- Gains/loss signs yield zero steady-zone residual.
- RC storage-energy change equals net interval energy.
- Heating/cooling mode outputs are mutually exclusive under the teaching model.
- Exact hourly totals precede reporting-round decisions.
- Revision contributor sums equal new minus old under common conditions.
- Incompatible profile/weather comparisons are rejected or normalized as
  explicitly defined.
- Alternative/Pareto rankings use identical inputs and displayed weights.

### Distractor and mutation tests

Fixtures must catch:

- conductivity/resistance/transmittance confusion;
- mm/m and W/kW/kWh errors;
- series U addition and parallel R averaging;
- missing surface films;
- gross/net opening double-count;
- psi/chi/U dimensional confusion;
- wrong heat-flow sign;
- RH treated as moisture amount;
- percent/fraction and g/kg/kg/kg errors;
- wrong saturation pressure/pressure profile;
- RH averaged in mixing;
- diffusion/air/liquid mechanism conflation;
- thermal R used for vapour profile;
- simplified screen overclaim;
- n/q normalization or reference-pressure loss;
- linear pressure-flow scaling;
- volume rather than mass balance when densities differ;
- shade/sun and orientation reversal;
- heat capacity treated as resistance;
- phase/attenuation/mean confusion;
- degree-day base and time-integration errors;
- peak load/energy and setpoint/free-floating confusion;
- thermal-image or aggregate-data causal overclaim;
- uncertainty ignored or sensitivity misranked;
- downstream symptom selected instead of root fault.

Each audit fixture has one machine-readable root defect unless its explicit
learning target is underdetermination or multiple hypotheses.

### Rendering and accessibility tests

- All answer-relevant values appear in both visual and structured versions.
- Graph axes, units, pressure/time basis, uncertainty, and legends remain visible.
- Semantic selections are independent of pixels, palette, pan, and zoom.
- Charts and layer labels avoid collisions at supported sizes and 200%/400%.
- Monochrome/high-contrast representations preserve every class.
- Keyboard order follows prompt→profile/assumptions→evidence→answer→feedback.
- Structured alternatives do not leak hidden facts absent from visual evidence.

### Seed requirements

For at least `10,000` deterministic seeds per family/level, and `25,000` for
psychrometric, polygon-shadow, network, time-series, RC, uncertainty, and
integrated-audit families:

- all placeholders/source IDs resolve;
- states, networks, geometry, and time series satisfy invariants;
- primary and independent oracles agree;
- accepted answers are nonempty and choices unique after normalization;
- tolerance and threshold cases are unambiguous;
- difficulty/rejection rules hold;
- claim language passes the professional/safety boundary;
- structural repetition is controlled by model signature, not renamed zones or
  materials.

## 16. Coverage requirements

Across a long course:

- every declared physical quantity and unit appears in direct and inverse form;
- series, parallel, area-weighted, junction, network, and time aggregation recur;
- material, assembly, envelope, zone, instantaneous, and accumulated layers are
  contrasted;
- both heat-flow directions and heating/cooling seasons appear under fictional
  conditions;
- opaque/opening/bridge and gross/net geometry vary;
- psychrometric states vary across T, RH, w, pressure, enthalpy, and dew point;
- sensible, mixing, cooling/dehumidification, and reheat paths appear;
- vapour, air, capillary, bulk-liquid, storage, and drying mechanisms contrast;
- surface and interface screens include below/above threshold and rejected tie
  cases without real diagnoses;
- flow/ACH/normalized leakage, pressure curves, mass balance, heat recovery, and
  tracer conservation recur;
- aperture orientation, shading, gains, radiant temperature, capacity, tau,
  attenuation, and phase all appear;
- weather, degree-time, schedules, steady load, energy, and RC response recur;
- visual, numeric, inverse, graph, construction, comparison, revision, and audit
  modes are balanced;
- every named misconception is intentionally sampled;
- `Cannot determine` and multiple-hypothesis cases appear often enough to prevent
  overconfident inference.

## 17. Recommended views and v1 priorities

### Views

1. **Learn** — quantities, units, mechanisms, profiles, and limitations.
2. **Assemblies** — R/U, heat flow, temperature profiles, and parallel paths.
3. **Envelope** — openings, bridges, H, conditions, and revisions.
4. **Moist Air** — state calculator, process chart, and mixing.
5. **Moisture** — pathways, diffusion profiles, screens, and storage.
6. **Airflow** — ACH, fan curves, balance, ventilation heat, and recovery.
7. **Solar & Dynamic** — apertures, shading, radiant conditions, C/tau/phase.
8. **Zone Energy** — weather, schedules, load/energy balances, and RC steps.
9. **Evidence & Audit** — synthetic measurements, uncertainty, and root causes.

### Recommended v1

Prioritize:

- SI units and immutable fictional property datasets;
- one-dimensional steady opaque assemblies with films;
- two parallel paths and simple area-weighted components;
- net wall/opening H and supplied linear bridges;
- RH, vapour pressure, humidity ratio, dew point, sensible processes, and chart;
- moisture-path classification and simple surface screen;
- ACH/flow, normalized leakage, simple pressure law, ventilation heat/recovery;
- solar `I A g`, rectangular shading, operative temperature, heat capacity/tau;
- degree-hours, transmission energy, gains, and steady zone balance;
- semantic SVG plus structured accessible alternatives from the start.

Add after v1:

- ideal moist-air mixing and cooling/dehumidification;
- supplied edge terms/point bridges;
- interstitial diffusion screens and simple moisture storage;
- multi-path airflow, tracer balance, and pressure dataset fitting;
- polygon shadow unions, MRT fourth-power model, attenuation/phase;
- stable explicit-Euler RC stepping;
- uncertainty, revision, and integrated audits.

Defer:

- real standards-compliance profiles and local code thresholds;
- real materials/products/weather/buildings/sensor/image imports;
- full thermal bridge, hygrothermal, CFD, multizone, daylight, acoustics, or HVAC
  simulation;
- diagnosis, remediation, retrofit recommendations, equipment sizing, economics,
  ratings, and certification.

## 18. Topic-level quality checklist

- [ ] Every screen/export states the fictional educational and professional
      boundary.
- [ ] Every question names physics profile, active mechanisms, properties,
      boundaries, units, pressure/time basis, and rounding needed for one answer.
- [ ] ISO/ASHRAE references are review anchors, not copied procedures or
      compliance claims.
- [ ] No real code, safety, health, comfort, durability, sizing, or remediation
      conclusion appears.
- [ ] Property, layer, component, junction, envelope, load, and energy layers
      remain distinct.
- [ ] Temperature, heat, power, flux, R, U, H, psi, chi, and C do not mix
      dimensionally.
- [ ] Absolute temperature and temperature difference are typed separately.
- [ ] Series/parallel paths, gross/net areas, and bridge IDs cannot double-count.
- [ ] Psychrometric states use one versioned saturation function and pressure.
- [ ] Moist-air processes conserve dry air, water, and energy as applicable.
- [ ] Moisture mechanisms are not conflated.
- [ ] Simplified condensation screens state omitted mechanisms and limited
      conclusions.
- [ ] Test-pressure leakage is not called natural infiltration.
- [ ] Airflow, tracer, and heat networks conserve their declared quantities.
- [ ] Solar, shading, orientation, radiant, and dynamic assumptions are visible.
- [ ] Power/load and accumulated energy remain distinct.
- [ ] Setpoint load and free-floating temperature are not mixed.
- [ ] Synthetic measurements expose location/time/instrument/uncertainty metadata.
- [ ] Image/pattern/correlation evidence never proves an unsupported cause.
- [ ] Alternatives are conditional metric comparisons, not recommendations.
- [ ] Multiple valid answers/hypotheses and `Cannot determine` are accepted when
      specified.
- [ ] Every family has task, response/template, derivation, difficulty,
      misconception-based distractors/constraints, feedback, three examples,
      and validation.
- [ ] Primary and independent oracles, mutation tests, accessibility, localization,
      and seed sweeps pass.
- [ ] The standalone app requires no backend or runtime external service.

## 19. Stable identifiers and navigation

Recommended navigation:

```text
Thermal Assemblies
Envelope & Bridges
Moist Air
Moisture
Airflow & Ventilation
Solar & Dynamic Response
Loads & Energy
Evidence & Audit
```

Stable family identifiers are the backticked IDs above. Archived questions store
seed, family ID, model/revision ID, physics/property/weather/unit profile IDs,
assumptions, exact intermediate states, accepted answer, display policy, oracle
version, and fault/hypothesis manifest where relevant. Any semantic model change
requires a new version so prior attempts remain reproducible.
