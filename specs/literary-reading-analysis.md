# Literary Reading & Analysis — Dynamic Practice Specification

Status: implementation specification

Audience: curated-corpus pipeline, purpose-written microtext generator, annotation
editor, structural/prosodic oracle, evidence checker, text renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual requirements meanings.

## 1. Topic overview

### Topic name

Literary Reading & Analysis

### Topic goal

Develop disciplined close reading of short prose, drama, and poetry. The learner
should become able to:

- distinguish what a text states from what it implies or leaves unresolved;
- select precise textual evidence and explain what a quoted detail supports;
- track reference, chronology, causation, repetition, contrast, and structural
  position;
- analyze how diction, syntax, imagery, figurative language, and sound shape an
  effect;
- reconstruct event order when narration uses flashback, anticipation, summary,
  pause, or omission;
- distinguish author, narrator, focalizer, speaker, character, and addressee;
- infer bounded character goals, knowledge, conflicts, and changes from evidence;
- recognize discrepancies that can make a narrator limited, biased, mistaken, or
  unreliable without treating every first-person narrator as deceptive;
- scan regular English verse, identify feet and meter, and mark controlled
  substitutions without pretending that all poetic rhythm has one mechanical
  answer;
- analyze rhyme, stanza, lineation, caesura, enjambment, repetition, and sound
  pattern;
- compare two short texts or two revisions using a named criterion;
- construct, reorder, or revise microtexts to produce a specified structural
  effect;
- preserve interpretive uncertainty when more than one reading is well supported.

The app trains repeatable acts of reading. It is not an author-biography quiz,
literary-canon survey, quotation-recall deck, automated essay grader, or oracle
for the single “true meaning” of a work.

### Audience and prerequisites

The initial audience is an adult fluent enough in the active language to read
short literary passages. Beginner modes assume no prior literary terminology.

Prerequisites:

- literal reading of short sentences and paragraphs;
- ability to select words or spans;
- basic chronological and causal reasoning;
- for poetic meter, ability to hear or mark syllables and ordinary word stress.

The English prosody profile is language-specific. A translated interface does
not make English-meter tasks into Swedish- or Japanese-meter tasks; each literary
language needs its own reviewed curriculum.

### Content-source policy

The app uses three source classes:

1. **Purpose-written microtexts** created specifically for the app and released
   under a documented rights instrument, preferably
   [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
2. **Generated structural microtexts** assembled offline/runtime from reviewed
   semantic templates, lexical inventories, event graphs, and constraint rules.
3. **Approved public-domain excerpts** from an exact, reviewed edition whose
   reuse status is documented for every deployment jurisdiction.

Purpose-written texts are the complete baseline. The app must remain useful with
the public-domain corpus disabled.

“Found online,” “old,” or “available from Project Gutenberg” is not a rights
determination. Project Gutenberg explicitly describes its clearance as
U.S.-specific and tells users outside the United States to check local law
([copyright guidance](https://www.gutenberg.org/help/copyright),
[license](https://www.gutenberg.org/policy/license)). Copyright duration depends
on facts including creation/publication history
([U.S. Copyright Office overview](https://copyright.gov/what-is-copyright/)).
Translations, abridgments, annotations, and revised editions can have rights
separate from the underlying work
([Copyright Office derivative-works guidance](https://www.copyright.gov/circs/circ14.pdf)).

No runtime network fetch, automated archive scraping, or user-submitted passage
is enabled in the standalone v1.

### Rights and provenance manifest

Every text asset has:

```text
TextAsset {
  textId
  sourceClass: authored | generated | publicDomain
  language
  title
  displayedAuthor
  underlyingAuthor?
  translator?
  editor?
  editionTitle?
  firstPublication?
  sourcePublication?
  sourceUrl?
  sourceAccessDate?
  exactTextHash
  rightsBasis
  rightsEvidence[]
  permittedJurisdictions[]
  attributionNotice?
  modificationPolicy
  normalizationRecord
  contentReviewVersion
  annotationVersion
}
```

Requirements:

- a public-domain determination is recorded per exact edition and jurisdiction;
- the original work, translation, editorial additions, typography, and source
  site's terms are reviewed separately;
- excerpting, normalization, lineation, and supplied titles are documented;
- disabled/expired/unresolved assets fail closed;
- attribution is shown even when not legally required when it helps scholarship;
- CC0 is applied only by a rights holder with authority to do so; Creative
  Commons notes that laws and unwaivable rights vary by jurisdiction
  ([CC public-domain guidance](https://creativecommons.org/public-domain/));
- legal review and corpus governance are release requirements, not tasks for the
  question generator.

### Content and historical-context review

Public-domain status does not imply pedagogical suitability. Every excerpt is
reviewed for:

- racist, sexist, colonial, antisemitic, ableist, homophobic, or other
  dehumanizing language;
- violence, abuse, suicide, sexual content, substance use, and traumatic themes;
- obsolete vocabulary whose meaning is needed to answer;
- cultural/religious context;
- stereotypes reproduced by distractors or feedback;
- whether truncation distorts the passage;
- whether an author/title reveal would leak the answer.

The default course excludes slurs and graphic material. An optional historical
context collection would require advance content notes, age/audience policy,
scholarly framing, and a way to skip without penalty. The app never converts
degrading language into a playful random variable.

### Microtext generation contract

Generated literary material is not unrestricted language-model output. It comes
from reviewed structures:

```text
MicrotextPlan {
  discourseMode
  eventGraph
  chronology
  narratorProfile
  focalizationProfile
  characterKnowledge
  motiveEvidence
  settingFacts
  lexicalRegister
  imageryMap
  rhetoricalDevices
  lineProsody?
  rhymePlan?
  intendedClaims[]
  excludedClaims[]
}
```

Generation may:

- select compatible names, objects, settings, verbs, sensory details, and
  sentence realizations from reviewed inventories;
- vary event order, pronouns, connective strength, stanza/line breaks, stress
  templates, and evidence placement;
- construct backward from a desired answer and distractor set.

Generation must not:

- invent an interpretation after producing arbitrary prose;
- rely on world knowledge not supplied by the text;
- create incoherent reference, tense, viewpoint, or event state;
- mimic a living author or present generated prose as an authentic quotation;
- fabricate attribution to a historical author;
- make sensitive identity or suffering a cosmetic slot.

Every generated output is parsed back into the intended annotation graph and
rejected if the surface form no longer supports it unambiguously.

### Annotation and evidence model

Each text is immutable for a question version and receives layered annotations:

```text
LiteraryAnnotation {
  tokens
  sentences
  clauses
  lines
  stanzas
  speakers
  mentions
  entities
  events
  storyOrder
  discourseOrder
  temporalRelations
  causalRelations
  knowledgeStates
  goals
  focalizerBySpan
  dictionTags
  imageDomains
  deviceSpans
  repetitions
  contrasts
  motifs
  prosody
  rhyme
  supportedClaims[]
}

SupportedClaim {
  claimId
  proposition
  status
  sufficientEvidenceSets[]
  relevantButInsufficientSpans[]
  contradictionSpans[]
  allowedQualifications[]
}
```

Claim statuses:

```text
explicit
strongly_supported
plausible_but_not_established
contradicted
indeterminate
```

`strongly_supported` means the text supplies an intended, independently reviewed
inference under ordinary reading; it does not mean logically entailed. A question
must state whether it asks for explicit information, the best-supported
inference, or all plausible readings.

### Interpretation contract

Closed-response questions are allowed only when:

- one answer is textually established under the stated task; or
- the prompt explicitly accepts a reviewed set of readings; or
- `indeterminate`/`more than one is defensible` is an available answer.

The checker never grades an open interpretation by keyword overlap. Short
explanations use structured fields:

```text
claim choice
evidence span(s)
relationship: states | implies | contrasts | causes | foreshadows | qualifies
optional qualification
```

A quotation is not automatically evidence for a claim. The evidence relation
must be annotated. Distractors come from:

- a true detail that does not support the claim;
- an inference stronger than the evidence;
- reversed cause/effect;
- narrator/author or speaker/character confusion;
- nearby wording with the wrong referent;
- a plausible reading contradicted by another detail;
- a device label without the structural feature.

### Text normalization and display contract

For approved excerpts:

- preserve wording, punctuation, paragraphing, line breaks, stanza breaks,
  capitalization, italics, and meaningful indentation from the approved edition;
- normalize only documented encoding/typographic forms;
- mark ellipses added by the app as editorial;
- never silently modernize spelling or punctuation;
- display a glossary note when an obsolete sense is essential;
- keep line and sentence IDs stable across font/reflow changes;
- never use OCR output without human collation against the approved source.

Purpose-written text may have multiple reviewed display versions, but each has a
separate hash and annotation version.

### English prosody profile

The initial meter curriculum uses a reviewed teaching model of English stress
verse:

```text
x = unstressed
/ = stressed
| = foot boundary
```

Core feet:

```text
iamb:     x /
trochee:  / x
anapest:  x x /
dactyl:   / x x
spondee:  / /
pyrrhic:  x x   (advanced/context-dependent only)
```

Line length names: monometer through hexameter, with dimeter, trimeter,
tetrameter, and pentameter emphasized.

Prosodic annotation stores:

```text
ProsodyLine {
  tokens
  pronunciationProfile
  syllables
  lexicalStressOptions
  contextualStress
  realizedPattern
  footBoundaries
  baseMeter
  substitutions[]
  feminineEnding?
  initialInversion?
  catalexis?
  caesuraSpans[]
  enjambmentClass
  acceptedScansions[]
}
```

Meter is not derived from spelling alone. Pronunciation, contractions, elision,
and contextual emphasis are explicit. Generated meter questions use
purpose-written or independently reviewed lines with one pedagogically preferred
scansion, or display every accepted scansion. Text-to-speech is never the stress
oracle.

V1 does not force accentual, syllabic, quantitative, sprung, free verse, rap
flow, or non-English prosody into the foot model.

### Rhyme and sound profile

Rhyme compares pronunciation from the final stressed vowel through the end:

```text
perfect rhyme: matching rhyme domain, different onset preferred
slant rhyme:   only when a reviewed profile defines the relation
eye rhyme:     spelling resembles, pronunciation does not
```

Rhyme scheme assigns `A` to the first end-rhyme class, `B` to the next, and so
on. Identical repeated words are tagged separately from ordinary perfect rhyme
when pedagogically relevant.

Sound devices are span-based, not mere letter matching:

- alliteration: repeated salient initial consonant sounds;
- assonance: repeated vowel sounds;
- consonance: repeated consonant sounds beyond initial position;
- onomatopoeia: reviewed lexical/ contextual relation, never generated from
  spelling alone.

### Scope

Included:

- explicit detail, reference, paraphrase, sequence, evidence, and inference;
- diction, connotation, register, syntax, punctuation, imagery, comparison,
  symbol/motif under supplied context, irony, ambiguity, and tone;
- plot events, story/discourse order, scene/summary, pause/ellipsis, conflict,
  turning point, setup/payoff, foreshadowing, and narrative causality;
- narrator, speaker, focalization, knowledge, reliability, characterization,
  dialogue, subtext, and dramatic irony;
- syllables, stress, feet, meter, substitutions, caesura, end-stopping,
  enjambment, rhyme, stanza, repetition, and selected poetic forms;
- comparison, evidence ranking, annotation repair, controlled revision, and
  purpose-written construction.

### Exclusions

- full novels, plays, or long poems inside the single-file app;
- author dates, movement labels, publication trivia, literary-prize facts, or
  quotation attribution as primary drills;
- unrestricted free-form essays or automated holistic grading;
- claims about authorial intention unsupported by documented evidence;
- psychoanalyzing authors or diagnosing fictional characters;
- treating cultural symbolism as a universal lookup table;
- arbitrary “identify the theme” questions with one teacher-keyword answer;
- generated imitation of a living author or counterfeit historical excerpts;
- copyrighted contemporary passages justified only by assumed fair use;
- public-domain deployment without jurisdiction/edition/translation review;
- general grammar/parse-tree instruction, owned by Grammar and Linguistics;
- historical phonology or complete poetics across all languages/traditions.

### Global answer conventions

- Span selections resolve to stable token/character IDs, not screen pixels.
- Extra surrounding punctuation/whitespace may be normalized when the semantic
  span is unchanged.
- Ordered events and lines are order-sensitive; evidence sets are
  order-insensitive unless ranking is requested.
- Multiple sufficient evidence sets are all accepted.
- A broader quote is accepted only if it contains a sufficient span without
  adding material that reverses/undermines the claim.
- Device terms use stable IDs with localized display names.
- `speaker`, `narrator`, `focalizer`, `character`, and `author` are never aliases.
- Meter input accepts `x /`, `u /`, or `˘ ´` aliases under the displayed legend
  and normalizes internally.
- Rhyme schemes ignore case and harmless separators.
- Equivalent event diagrams/structural trees are compared semantically.
- `indeterminate` is accepted whenever the annotation says evidence does not
  decide.

### Difficulty philosophy

Difficulty should increase through:

- moving from explicit statements to bounded inference;
- requiring a precise evidence relation rather than a plausible quotation;
- longer reference chains and nonchronological discourse;
- competing but distinguishable motives or interpretations;
- subtler contrast between literal and figurative meaning;
- interaction among diction, syntax, image, and structure;
- weaker narrator knowledge and discrepancies across evidence;
- more complex but reviewed metrical substitutions;
- rhyme/sound relations based on pronunciation rather than spelling;
- comparing two texts under a named criterion;
- constructing or repairing structure rather than merely naming it.

Difficulty must not increase through:

- archaic vocabulary without gloss;
- longer passages without a new reasoning demand;
- obscure allusions or author biography;
- tiny typography or artificial time pressure;
- arbitrary subjective distinctions;
- culturally loaded symbols treated as fixed facts;
- increasingly graphic/sensitive material;
- answer keys created by a language model without human annotation;
- ambiguous poetic scansions presented as uniquely correct.

### Shared generation and rejection rules

Reject an instance when:

- the question cannot be answered from the displayed text/context;
- two choices are defensible but only one is accepted;
- a claim status changes under a reasonable unresolved pronoun/reference;
- the “evidence” merely repeats a keyword without supporting the relation;
- distractors require outside knowledge or are obviously absurd;
- removing the answer choice changes the intended interpretation;
- generated event, tense, character knowledge, or point of view is inconsistent;
- a public-domain asset lacks an active rights/provenance record;
- excerpt truncation removes a qualifying or contradictory sentence;
- line wrapping changes poetic lineation;
- pronunciation variants make a rhyme/meter answer ambiguous and are not
  accepted;
- a device appears only because the template label says it does;
- a recent text skeleton or exact excerpt recurs too soon;
- the task rewards guessing the most dramatic interpretation.

## 2. Category: Literal comprehension, reference, and textual evidence

### Category purpose

Build the evidence discipline needed by every later interpretive task: identify
what the text says, who/what expressions refer to, and which exact spans support
a bounded claim.

### Learn

Begin with the words on the page. An explicit detail is stated; an inference is
supported by combining details; a possibility is not yet established. Evidence
must connect to the claim. A nearby sentence containing the same noun may still
be irrelevant.

### Prerequisites

Short-passage reading in the active language.

### Category boundaries

This category establishes fact, reference, paraphrase, and evidence. Figurative
effect begins in Category 3; plot structure in Category 4.

### Common misconceptions

- Choosing a plausible fact not stated by the passage.
- Treating narrator speculation as established fact.
- Selecting the longest quotation as “best evidence.”
- Matching keywords while ignoring negation or referent.
- Confusing a character's belief with the story world's fact.
- Overstating `may`/`perhaps` as certainty.

### Family `text_explicit_detail`

**Task.** Identify a fact explicitly stated in a short passage.

**Response/template.** Single choice: `Which statement is explicitly stated?`

**Derivation.** Match propositions to `explicit` annotations.

**Difficulty.** L1 one sentence; L2 paraphrase; L3 statement embedded in dialogue/negation.

**Distractors/constraints.** Plausible inference, contradicted detail, wrong entity; no verbatim-only cue.

**Feedback.** Highlight the exact stating span and paraphrase relation.

**Examples.** (1) “Mara locked the blue gate”→gate was blue. (2) “Not on Tuesday” rejects Tuesday. (3) dialogue states a speaker's belief, not world fact.

**Validation.** Proposition-to-span link and polarity check.

### Family `text_reference_resolve`

**Task.** Resolve a pronoun, demonstrative, or repeated description.

**Response/template.** Entity/span choice: `What does {expression} refer to here?`

**Derivation.** Read reviewed mention-coreference graph.

**Difficulty.** L1 nearest compatible noun; L2 intervening entity; L3 discourse description.

**Distractors/constraints.** Gender/number-only guessing insufficient; reference must be unambiguous.

**Feedback.** Connect mention to antecedent and cite agreement/discourse evidence.

**Examples.** (1) “Lina lifted the cup and set it down”→cup. (2) two singular people but action selects one. (3) “the old promise” resumes earlier event.

**Validation.** Mention has one annotated referent for unique-answer mode.

### Family `text_speaker_identify`

**Task.** Determine who speaks a quoted line in a micro-dialogue.

**Response/template.** Character choice.

**Derivation.** Use dialogue-turn and speech-tag annotations.

**Difficulty.** L1 explicit tag; L2 alternating turns; L3 interrupted exchange with action beat.

**Distractors/constraints.** No typographic ambiguity; author/narrator are not choices unless speaking.

**Feedback.** Trace the turn sequence.

**Examples.** (1) “I agree,” Niko said→Niko. (2) untagged second turn in two-person exchange. (3) action beat belongs to one speaker.

**Validation.** Dialogue-state machine assigns every utterance.

### Family `text_literal_paraphrase`

**Task.** Choose the paraphrase that preserves a sentence's literal meaning and qualifications.

**Response/template.** Single choice.

**Derivation.** Compare proposition, polarity, modality, quantity, and referents.

**Difficulty.** L1 synonym; L2 negation/modality; L3 scope and contrast.

**Distractors/constraints.** Stronger certainty, reversed cause, lost exception, wrong referent.

**Feedback.** Align proposition components.

**Examples.** (1) “She may return”→return is possible, not certain. (2) “Only Ivo stayed.” (3) “Not every lamp failed.”

**Validation.** Controlled semantic forms prove equivalence/contrast.

### Family `text_claim_status`

**Task.** Classify a claim as explicit, strongly supported, plausible, contradicted, or indeterminate.

**Response/template.** Status choice.

**Derivation.** Retrieve reviewed `SupportedClaim.status`.

**Difficulty.** L1 explicit/contradicted; L2 inference/plausibility; L3 unresolved competing evidence.

**Distractors/constraints.** Prompt defines status ladder; claims avoid outside assumptions.

**Feedback.** Show supporting, limiting, or contradicting spans.

**Examples.** (1) stated departure→explicit. (2) wet coat plus rain sound→strongly supported arrival from rain. (3) closed door alone→reason indeterminate.

**Validation.** At least two reviewers agree or accepted statuses are plural.

### Family `text_best_evidence`

**Task.** Select the smallest sufficient span supporting a supplied claim.

**Response/template.** Span selection or choice.

**Derivation.** Accept any annotated sufficient evidence set meeting requested minimality.

**Difficulty.** L1 direct sentence; L2 two-span inference; L3 relevant-but-insufficient competitor.

**Distractors/constraints.** Keyword-only, background, or overbroad passage; minimality stated.

**Feedback.** Explain evidence→claim relation, not just quote again.

**Examples.** (1) locked gate supports inability to enter. (2) two details jointly establish who arrived first. (3) smile alone insufficient for joy when tears/irony qualify.

**Validation.** Evidence sets reviewed; removing any required span breaks sufficiency.

### Family `text_evidence_pair`

**Task.** Pair each bounded claim with its supporting span.

**Response/template.** Matching.

**Derivation.** Use claim/evidence relation graph.

**Difficulty.** L1 one-to-one explicit; L2 shared span; L3 claim has two required spans.

**Distractors/constraints.** Every span genuinely relevant somewhere; no length/position leakage.

**Feedback.** Reveal relation label for each edge.

**Examples.** (1) setting fact→opening phrase. (2) motive inference→action+dialogue. (3) uncertainty claim→modal phrase.

**Validation.** Matching solution unique or all graph-valid mappings accepted.

### Family `text_missing_information`

**Task.** Identify what cannot be determined from a passage.

**Response/template.** Claim choice or `insufficient information`.

**Derivation.** Query open slots in the text-world/claim model.

**Difficulty.** L1 absent attribute; L2 character speculation; L3 two possible event explanations.

**Distractors/constraints.** Unknown is not false; no common-sense completion.

**Feedback.** Separate known facts from unresolved alternatives.

**Examples.** (1) coat color never given. (2) narrator guesses why bell rang. (3) either of two people could have moved the key.

**Validation.** Model enumeration contains multiple values/worlds.

### Family `text_evidence_audit`

**Task.** Find the first unsupported leap, reference error, quotation error, or polarity error in a mini-analysis.

**Response/template.** Step choice and corrected status/evidence.

**Derivation.** Replay claim graph and evidence relations.

**Difficulty.** L1 wrong quote; L2 plausible→certain leap; L3 narrator belief treated as fact.

**Distractors/constraints.** One root defect; later statements may inherit it.

**Feedback.** Name the exact inferential overreach.

**Examples.** (1) “may” rewritten “will.” (2) evidence mentions wrong Alex. (3) true detail does not support motive.

**Validation.** Mutate one valid analysis edge and find unique earliest failure.

### Cross-family progression

Begin with explicit detail, reference, and literal paraphrase. Introduce claim
status before asking for best evidence. `text_missing_information` should be
interleaved early so the learner is rewarded for restraint. Audit questions come
after direct evidence work.

## 3. Category: Diction, syntax, imagery, and figurative effect

### Category purpose

Train analysis of how local language choices create contrast, emphasis,
perspective, sensory pattern, and figurative relation.

### Learn

Name the textual feature, then explain its local effect. “This is a metaphor” is
incomplete unless the compared domains and supported effect are identified.
Tone belongs to a passage/speaker in context, not to one supposedly universal
word label.

### Prerequisites

Category 2 evidence discipline; elementary sentence boundaries.

### Category boundaries

This category analyzes local wording. Narrative ordering belongs in Category 4;
verse rhythm and rhyme in Categories 6–7.

### Common misconceptions

- Treating connotation as a dictionary definition.
- Labeling every comparison a metaphor.
- Finding personification whenever a nonhuman noun is a grammatical subject.
- Naming a device without showing its effect.
- Assigning tone from one word while ignoring context.
- Treating symbols as universal one-to-one codes.

### Family `diction_connotation_contrast`

**Task.** Compare two near-synonyms and select the effect of the chosen word in context.

**Response/template.** Effect choice plus evidence word.

**Derivation.** Use reviewed denotation/connotation/register features and passage relation.

**Difficulty.** L1 positive/negative coloring; L2 register; L3 mixed contextual effect.

**Distractors/constraints.** No claim of universal connotation; context makes distinction operative.

**Feedback.** State shared denotation and differing implication.

**Examples.** (1) `slim`/`scrawny`. (2) `residence`/`home`. (3) `stared`/`watched` in tense scene.

**Validation.** Substitution pair and intended effect human-reviewed.

### Family `diction_register_identify`

**Task.** Identify which phrase establishes formal, colloquial, archaic, technical, or intimate register.

**Response/template.** Span selection and register choice.

**Derivation.** Read lexical/register annotations.

**Difficulty.** L1 one marked phrase; L2 mixed register; L3 deliberate register shift.

**Distractors/constraints.** Locale/dialect reviewed; nonstandard is not labeled inferior.

**Feedback.** Explain social/contextual fit without prescriptive judgment.

**Examples.** (1) “kindly remit”→formal. (2) “yeah, right”→colloquial. (3) formal narration interrupted by intimate address.

**Validation.** Register cue cannot depend on an unglossed dialect stereotype.

### Family `syntax_emphasis`

**Task.** Determine what a sentence arrangement foregrounds or delays.

**Response/template.** Choice or matching over clause spans.

**Derivation.** Compare canonical semantic plan with reviewed surface information structure.

**Difficulty.** L1 short-first emphasis; L2 delayed main clause; L3 inversion/parallelism.

**Distractors/constraints.** Effect bounded to attention/pacing, not author psychology.

**Feedback.** Reorder neutrally and compare when information arrives.

**Examples.** (1) “Gone was the lantern” foregrounds absence. (2) long conditional delays result. (3) repeated initial clauses build parallel emphasis.

**Validation.** Alternative realization preserves propositional content.

### Family `syntax_pacing_revision`

**Task.** Choose which of two punctuation/sentence versions produces a specified pacing effect.

**Response/template.** Version choice.

**Derivation.** Use authored relation between clause segmentation and intended reading pace.

**Difficulty.** L1 short sentences; L2 periodic sentence; L3 interruption/fragment in context.

**Distractors/constraints.** Do not claim punctuation controls actual reader speed universally.

**Feedback.** Mark pause/closure opportunities and information release.

**Examples.** (1) three clipped clauses for abruptness. (2) semicolon links balanced thoughts. (3) dash interrupts a confession.

**Validation.** Both versions grammatical under profile and differ only in target structure.

### Family `imagery_sense_map`

**Task.** Map image spans to sight, sound, touch, taste, smell, movement, or internal bodily sensation.

**Response/template.** Multiple matching; mixed senses allowed.

**Derivation.** Use reviewed sensory-domain tags.

**Difficulty.** L1 concrete image; L2 cross-sensory phrase; L3 image combines domains.

**Distractors/constraints.** Abstract emotion alone is not sensory imagery.

**Feedback.** Quote the sense-bearing word.

**Examples.** (1) “brass bell cracked”→sound. (2) “salt wind stung”→taste/touch. (3) “warm red hush”→mixed/cross-sensory.

**Validation.** Accepted tag sets explicit.

### Family `figurative_relation_identify`

**Task.** Identify the source and target domains in a metaphor or simile.

**Response/template.** Two named spans and device choice.

**Derivation.** Read comparison annotation; explicit `like/as` distinguishes simile in profile.

**Difficulty.** L1 explicit simile; L2 copular metaphor; L3 extended comparison.

**Distractors/constraints.** Literal comparisons and category statements included.

**Feedback.** State what is described through what comparison.

**Examples.** (1) “clouds like torn sails.” (2) “the corridor was a throat.” (3) extended seed/growth image for an idea.

**Validation.** Both domains and mapping independently annotated.

### Family `figurative_effect_select`

**Task.** Select the effect most directly supported by a figurative comparison.

**Response/template.** Claim/evidence choice.

**Derivation.** Match mapped features to reviewed local claim.

**Difficulty.** L1 one salient feature; L2 several source features but one contextually activated; L3 qualified effect.

**Distractors/constraints.** Avoid free association with every source-domain property.

**Feedback.** Show which comparison feature the surrounding text activates.

**Examples.** (1) corridor/throat plus “swallowed”→confinement. (2) clock as judge→pressure/judgment. (3) fragile glass image qualifies trust.

**Validation.** Context supplies activation cue; distractors are unactivated mappings.

### Family `personification_literal_contrast`

**Task.** Decide whether a nonhuman description is personification, literal agency, conventional phrasing, or indeterminate.

**Response/template.** Classification.

**Derivation.** Compare predicate's agentive feature with entity/context annotations.

**Difficulty.** L1 clear human action; L2 conventional phrase; L3 fantastical world where object is literally animate.

**Distractors/constraints.** Genre-world facts shown; grammatical subjecthood alone insufficient.

**Feedback.** Identify attributed human capacity and whether world treats it literally.

**Examples.** (1) “the jealous window watched”→personification. (2) “the camera watched” may be conventional literal surveillance. (3) speaking tree in story world→literal character.

**Validation.** World ontology and device status consistent.

### Family `tone_evidence`

**Task.** Choose a bounded tone description and its strongest evidence.

**Response/template.** Tone choice plus span.

**Derivation.** Use reviewed tone profile supported by diction/syntax/context.

**Difficulty.** L1 clear affectionate/hostile; L2 restrained/uneasy; L3 tone shift or mixed tone.

**Distractors/constraints.** Generic “sad/happy” distractors tied to one ignored cue.

**Feedback.** Link at least two features when tone is subtle.

**Examples.** (1) affectionate diminutives. (2) polite syntax plus threat→controlled menace. (3) playful opening shifts to regret.

**Validation.** Multiple reviewers and accepted labels/near-synonyms stored.

### Family `language_effect_audit`

**Task.** Find a misidentified device, unsupported connotation, or overclaimed effect.

**Response/template.** Step choice and correction.

**Derivation.** Replay device spans, mappings, and supported claims.

**Difficulty.** L1 simile called literal; L2 device right/effect wrong; L3 tone ignores shift.

**Distractors/constraints.** Exactly one root analytical error.

**Feedback.** Separate feature identification from effect inference.

**Examples.** (1) subject verb labeled personification without human trait. (2) metaphor source feature not activated. (3) “formal” treated as “sincere.”

**Validation.** Mutate one annotated relation.

### Cross-family progression

Begin with connotation, sensory imagery, and explicit comparisons. Then require
source/target mapping and local effect. Syntax/pacing and mixed tone come later.
Audit questions interleave only after learners can separate device identification
from interpretive consequence.

## 4. Category: Narrative sequence, causality, and structure

### Category purpose

Train reconstruction of what happens, when it happens, why it happens, and how
the order and duration of telling shape the reader's experience.

### Learn

Story order is the events' chronological order; discourse order is the order in
which the text presents them. A flashback changes discourse order, not what
happened first. Sequence is not automatically causation: the text must provide a
causal link or sufficient evidence.

### Prerequisites

Category 2 reference/evidence; chronological terms.

### Category boundaries

This category models event and discourse structure. Narrator knowledge,
characterization, and reliability are Category 5.

### Common misconceptions

- Treating presentation order as chronological order.
- Assuming “after” means “because of.”
- Calling any past-tense sentence a flashback.
- Treating summary as an unimportant event.
- Labeling the climax as simply the loudest event.
- Calling an early object foreshadowing when it has no later payoff.

### Narrative graph

```text
NarrativePlan {
  events[]
  storyOrder
  discourseUnits[]
  temporalEdges
  causalEdges
  goalEdges
  conflicts
  setupPayoffEdges
  durationModeByUnit
  turningPoints[]
  withheldFacts[]
}
```

Temporal edges are distinct from causal edges. Generated passages must preserve
character location, possession, knowledge, and object state across events.

### Family `narrative_story_order`

**Task.** Put events into chronological story order.

**Response/template.** Ordered event cards.

**Derivation.** Topologically sort reviewed temporal graph; accept all valid orders if partially ordered.

**Difficulty.** L1 narrated chronologically; L2 one flashback; L3 nested memory and simultaneous events.

**Distractors/constraints.** Cards paraphrase events without tense-word giveaways.

**Feedback.** Cite temporal markers and dependency edges.

**Examples.** (1) leave→return→discover. (2) present arrival narrates childhood memory. (3) two simultaneous preparations before meeting.

**Validation.** Accepted orders are exactly graph linear extensions.

### Family `narrative_discourse_order`

**Task.** Identify the order in which events are revealed.

**Response/template.** Ordered event cards.

**Derivation.** Read first discourse occurrence of each event.

**Difficulty.** L1 chronological; L2 flashback; L3 delayed identification/repeated mention.

**Distractors/constraints.** Distinguish occurrence from later reinterpretation.

**Feedback.** Number paragraphs/lines of first presentation.

**Examples.** (1) event C told before A. (2) opening result then cause. (3) event introduced obscurely then named.

**Validation.** Discourse-unit indexes exact.

### Family `narrative_temporal_relation`

**Task.** Classify two events as before, after, simultaneous, overlapping, or unresolved.

**Response/template.** Relation choice.

**Derivation.** Query temporal interval graph.

**Difficulty.** L1 explicit marker; L2 tense/aspect; L3 insufficient ordering.

**Distractors/constraints.** No inference from paragraph order alone.

**Feedback.** Show the relation-bearing phrase or missing edge.

**Examples.** (1) “while”→overlap. (2) “already” establishes prior event. (3) two memories with no order→unresolved.

**Validation.** Allen-style bounded relation set consistent.

### Family `narrative_cause_evidence`

**Task.** Decide whether one event caused, enabled, motivated, merely preceded, or is unrelated to another.

**Response/template.** Relation choice plus evidence.

**Derivation.** Query causal/goal graph and sufficient spans.

**Difficulty.** L1 explicit because; L2 enabling condition; L3 competing explanation/indeterminate.

**Distractors/constraints.** Temporal adjacency is a principal distractor.

**Feedback.** Distinguish causal, motivational, and temporal edges.

**Examples.** (1) storm breaks bridge→cause. (2) unlocked door enables entry. (3) bell rings after smile with no link→precedence only.

**Validation.** Relation and evidence annotated independently.

### Family `narrative_scene_summary`

**Task.** Classify a passage unit as scene, summary, pause/description, or ellipsis.

**Response/template.** Unit choice/classification.

**Derivation.** Compare represented story duration, discourse detail, and event advancement under reviewed annotation.

**Difficulty.** L1 dialogue scene versus years summarized; L2 descriptive pause; L3 mixed transition.

**Distractors/constraints.** Passage unit boundaries shown; labels taught as profile conventions.

**Feedback.** Compare story time with textual space.

**Examples.** (1) five years in one sentence→summary. (2) minute-by-minute exchange→scene. (3) “By winter…” skips months→ellipsis.

**Validation.** Duration-mode tags reviewed.

### Family `narrative_conflict_goal`

**Task.** Identify a character's immediate goal and the obstacle shown in the passage.

**Response/template.** Goal/obstacle pair.

**Derivation.** Read goal and conflict edges supported by action/dialogue.

**Difficulty.** L1 stated goal; L2 inferred goal; L3 two goals in tension.

**Distractors/constraints.** Long-term personality claim is not an immediate goal.

**Feedback.** Quote desire/action and blocking condition.

**Examples.** (1) wants train, locked gate blocks. (2) hides letter to prevent discovery. (3) loyalty conflicts with escape.

**Validation.** Pair compatibility and sufficient evidence.

### Family `narrative_turning_point`

**Task.** Select the event that changes the available goals, knowledge, or causal direction.

**Response/template.** Event choice and changed-state field.

**Derivation.** Compare narrative-state graph before/after annotated turning event.

**Difficulty.** L1 new information; L2 decision; L3 quiet reversal with later consequence.

**Distractors/constraints.** Loudness/emotion alone is not structural change.

**Feedback.** Show state delta.

**Examples.** (1) map revealed changes route. (2) refusal ends negotiation. (3) unnoticed key loss constrains later escape.

**Validation.** Removing event changes reachable narrative states.

### Family `narrative_setup_payoff`

**Task.** Match an earlier setup/detail with a later payoff or classify it as recurrence only.

**Response/template.** Matching plus relation.

**Derivation.** Query setup-payoff/motif graph.

**Difficulty.** L1 object introduced/used; L2 information reinterpretation; L3 false candidate repeated without causal payoff.

**Distractors/constraints.** Mere repetition not automatically foreshadowing.

**Feedback.** Explain how later event activates earlier detail.

**Examples.** (1) loose floorboard later hides letter. (2) warning phrase becomes literal. (3) repeated blue curtain has no payoff.

**Validation.** Payoff depends on setup under event graph.

### Family `narrative_structure_reorder`

**Task.** Reorder purpose-written units to create a specified chronology, suspense, or reveal pattern.

**Response/template.** Ordered paragraph cards.

**Derivation.** Enforce coherence constraints and target discourse plan.

**Difficulty.** L1 chronological coherence; L2 result-before-cause; L3 delayed reveal with reference constraints.

**Distractors/constraints.** Exactly one target order or all valid orders accepted.

**Feedback.** Show temporal/reference/setup constraints.

**Examples.** (1) arrange clear sequence. (2) open with consequence then flashback. (3) place clue before but explanation after discovery.

**Validation.** Discourse planner regenerates references and verifies target effect annotation.

### Family `narrative_structure_audit`

**Task.** Find a chronology, causality, state-continuity, or structural-label error.

**Response/template.** Step/span choice and correction.

**Derivation.** Replay event/state and discourse graphs.

**Difficulty.** L1 before/after reversal; L2 impossible possession; L3 payoff claimed without setup.

**Distractors/constraints.** One root inconsistency; downstream effects allowed.

**Feedback.** Show violated edge or state invariant.

**Examples.** (1) character uses key before obtaining it. (2) sequence mistaken for cause. (3) flashback called future anticipation.

**Validation.** Single graph mutation with unique earliest failure.

### Cross-family progression

Start with story order, discourse order, and pairwise temporal relations.
Causality follows only after learners stop treating adjacency as cause. Add
scene/summary, goal/conflict, turning points, and setup/payoff before construction
and audit.

## 5. Category: Narration, focalization, character, and dialogue

### Category purpose

Train separation of narrative voices and knowledge sources, then use actions,
speech, perception, and discrepancies to make bounded claims about characters
and narrators.

### Learn

The author created the text; the narrator tells it; a character acts within it;
the focalizer is the consciousness or viewpoint through which information is
filtered. These roles may overlap, but they are not synonyms. Reliability is a
relationship between a report and other evidence, not a personality label.

### Prerequisites

Categories 2 and 4.

### Category boundaries

This category analyzes information access and characterization. It does not
diagnose characters or infer author biography.

### Common misconceptions

- Equating first-person narrator with author.
- Assuming third person is omniscient.
- Treating focalizer and grammatical subject as identical.
- Calling any mistaken/deceptive character an unreliable narrator.
- Treating one action as proof of a permanent trait.
- Taking dialogue literally when context supplies subtext.

### Family `narration_role_distinguish`

**Task.** Classify an assertion/action as belonging to author, narrator, speaker, character, or focalizer.

**Response/template.** Role choice.

**Derivation.** Query discourse-role annotations.

**Difficulty.** L1 narrator/character; L2 quoted speaker; L3 narrator-focalizer split.

**Distractors/constraints.** Author appears only in paratext/documented question, never inferred from narrator.

**Feedback.** Define role in this passage.

**Examples.** (1) “I opened the door” spoken by narrator-character. (2) free indirect thought belongs to focalized character. (3) chapter title is paratext, not speech.

**Validation.** Role layer explicitly annotated.

### Family `narration_point_of_view`

**Task.** Identify the passage's person and bounded access profile.

**Response/template.** `first-person`, `second-person`, `third-person limited`, `third-person multiple`, or `omniscient` under profile.

**Derivation.** Combine narrator grammar and knowledge-access annotations.

**Difficulty.** L1 explicit I/he; L2 third limited; L3 shifting focalization.

**Distractors/constraints.** Third person alone cannot establish omniscience.

**Feedback.** Cite pronouns and whose internal states are available.

**Examples.** (1) I-narration. (2) third person only Lina's thoughts→limited. (3) separate units access two minds→multiple.

**Validation.** Access graph matches label.

### Family `focalizer_span`

**Task.** Determine whose perception/knowledge filters a selected span.

**Response/template.** Character/narrator choice or `external`.

**Derivation.** Read focalizer-by-span annotation.

**Difficulty.** L1 perception verb; L2 free indirect discourse; L3 focalization shift.

**Distractors/constraints.** Acting character may differ from perceiver.

**Feedback.** Highlight deictic/evaluative/perceptual cues.

**Examples.** (1) “To Mira, the room seemed tiny”→Mira. (2) battle shown through distant observer. (3) paragraph shifts after scene break.

**Validation.** Boundaries and accepted ambiguity reviewed.

### Family `character_knowledge_state`

**Task.** Determine what a character knows, believes, suspects, or does not know at a specific point.

**Response/template.** Status matching.

**Derivation.** Replay knowledge-state updates through discourse point.

**Difficulty.** L1 witnessed fact; L2 report may be false; L3 reader knows more than character.

**Distractors/constraints.** Learner knowledge is not character knowledge.

**Feedback.** Show information path and time.

**Examples.** (1) saw key moved→knows. (2) heard rumor→believes/suspects. (3) reader saw hidden letter, character did not.

**Validation.** Epistemic state machine.

### Family `character_trait_evidence`

**Task.** Choose the most bounded characterization supported by actions/speech.

**Response/template.** Claim plus evidence.

**Derivation.** Match reviewed trait/temporary-state claim to sufficient evidence.

**Difficulty.** L1 repeated behavior; L2 context-qualified trait; L3 conflicting evidence.

**Distractors/constraints.** Avoid diagnosis, essentialism, and single-action overgeneralization.

**Feedback.** Prefer “in this scene…” qualification where warranted.

**Examples.** (1) repeatedly checks others' safety→attentive here. (2) one refusal does not prove selfishness. (3) brave action despite stated fear supports courage as action, not lack of fear.

**Validation.** Claim scope and qualification annotated.

### Family `character_motive_compare`

**Task.** Rank or classify candidate motives by textual support.

**Response/template.** `best supported`, `plausible`, `contradicted`, `indeterminate`.

**Derivation.** Use goal/evidence graph.

**Difficulty.** L1 stated reason; L2 action inference; L3 mixed motives accepted.

**Distractors/constraints.** Outside stereotypes excluded; several motives may be plausible.

**Feedback.** Compare evidence for/against each.

**Examples.** (1) hides note after threat→protection best supported. (2) politeness versus fear unresolved. (3) explicit lie contradicts claimed motive.

**Validation.** Reviewed status per candidate.

### Family `dialogue_subtext`

**Task.** Identify what a line does in context beyond its literal proposition.

**Response/template.** Function choice such as evade, warn, invite, refuse, reassure, challenge.

**Derivation.** Match speech-act/subtext annotation supported by turn context.

**Difficulty.** L1 indirect request; L2 polite refusal; L3 ironic echo.

**Distractors/constraints.** Culture/locale reviewed; no mind-reading beyond response/context.

**Feedback.** Contrast literal words with conversational action.

**Examples.** (1) “It's late” at doorway→suggest departure. (2) “What an interesting plan” plus retreat→noncommitment. (3) repeated phrase becomes warning.

**Validation.** At least one contextual uptake cue.

### Family `dramatic_irony_knowledge_gap`

**Task.** Identify a reader/audience–character knowledge gap and its local effect.

**Response/template.** Two knowledge fields plus effect choice.

**Derivation.** Compare epistemic states at discourse point.

**Difficulty.** L1 reader knows hidden object; L2 one character knows; L3 gap changes meaning of dialogue.

**Distractors/constraints.** Mere surprise is not dramatic irony.

**Feedback.** State who knows what and how it changes expectation.

**Examples.** (1) audience sees trap, traveler does not→tension. (2) listener knows speaker's assumption false. (3) innocent promise has double meaning.

**Validation.** Knowledge graph proves asymmetry.

### Family `narrator_reliability_evidence`

**Task.** Evaluate a specific narrator claim against internal evidence.

**Response/template.** supported, contradicted, uncertain, or biased framing.

**Derivation.** Compare narrator proposition with event/evidence graph and framing tags.

**Difficulty.** L1 factual contradiction; L2 omission/euphemism; L3 limited knowledge without dishonesty.

**Distractors/constraints.** First person, dislike, or uncertainty alone does not equal unreliability.

**Feedback.** Name discrepancy and keep judgment local to claim.

**Examples.** (1) narrator says door never opened; recorded scene shows opening→contradicted. (2) “minor delay” for week-long stop→minimizing frame. (3) narrator cannot see room→claim uncertain, not lie.

**Validation.** Claim-specific relation reviewed.

### Family `narration_character_audit`

**Task.** Find a role, knowledge, motive, subtext, or reliability overreach.

**Response/template.** Analysis-step choice and correction.

**Derivation.** Replay role, event, epistemic, and claim graphs.

**Difficulty.** L1 author=narrator; L2 reader knowledge assigned to character; L3 local contradiction generalized to everything.

**Distractors/constraints.** One root analytical error.

**Feedback.** State which evidence boundary was crossed.

**Examples.** (1) third-person called omniscient without access. (2) narrator uncertainty called deliberate lie. (3) one action used as diagnosis.

**Validation.** Mutated valid analysis.

### Cross-family progression

Teach role separation and point of view first, then focalization and knowledge
states. Character traits/motives and dialogue subtext follow evidence work.
Dramatic irony precedes claim-specific reliability. Audit questions come last.

## 6. Category: Poetic rhythm, stress, feet, and meter

### Category purpose

Train attentive hearing/marking of syllables and stress, recognition of recurring
metrical patterns, and controlled explanation of rhythmic variation.

### Learn

Meter is a recurring abstract pattern; rhythm is the line's realized movement.
Start by saying the line naturally, mark syllables and stress, then group feet.
Do not force every word into a perfect pattern: a substitution matters because a
base pattern has already been established.

### Prerequisites

Ordinary English pronunciation and the prosody notation in Section 1.

### Category boundaries

This category uses the reviewed English stress-meter profile. Rhyme, stanzas,
and poetic form are Category 7. Music meter belongs in Music Practice.

### Common misconceptions

- Counting written vowels as syllables.
- Treating lexical stress as immutable under context.
- Naming a foot from one word rather than the realized sequence.
- Calling every ten-syllable line iambic pentameter.
- Forcing a regular scan despite clear substitution/elision.
- Confusing feminine ending with an extra complete foot.

### Family `prosody_syllable_count`

**Task.** Count realized syllables in a reviewed poetic line under the displayed pronunciation profile.

**Response/template.** Integer plus optional syllable segmentation.

**Derivation.** Count annotated syllable nuclei after declared contraction/elision.

**Difficulty.** L1 transparent words; L2 common contraction; L3 poetic elision/variant shown.

**Distractors/constraints.** Orthographic vowel count, silent-e error, ignored contraction.

**Feedback.** Display syllable boundaries and pronunciation note.

**Examples.** (1) “The red leaf falls”→4. (2) `heaven` profile declares 2. (3) `o'er` declares 1.

**Validation.** Line bound to pronunciation/segmentation record.

### Family `prosody_word_stress`

**Task.** Mark primary stress in a word as realized in its line.

**Response/template.** Syllable selection.

**Derivation.** Use lexical options plus contextual stress annotation.

**Difficulty.** L1 disyllabic word; L2 compound; L3 contrastive/contextual stress.

**Distractors/constraints.** Pronunciation variant displayed where material.

**Feedback.** Play optional reviewed recording or show stress marks; TTS not oracle.

**Examples.** (1) `re-LAX`. (2) noun `RE-cord` under profile. (3) contrastive “I said BLUE.”

**Validation.** Accepted stress positions stored.

### Family `prosody_line_stress_mark`

**Task.** Mark the stressed and unstressed syllables in a short regular line.

**Response/template.** Tap syllables to toggle `x`/`/`.

**Derivation.** Compare with accepted scansion patterns.

**Difficulty.** L1 four syllables; L2 regular tetrameter; L3 one controlled ambiguity accepted.

**Distractors/constraints.** Function words not automatically unstressed; natural reading required.

**Feedback.** Align syllables and marks.

**Examples.** (1) `x / | x /`. (2) four iambs. (3) accepted stress variant at one function word.

**Validation.** Semantic syllable IDs, not character positions.

### Family `prosody_foot_identify`

**Task.** Name a displayed two- or three-syllable foot.

**Response/template.** iamb/trochee/anapest/dactyl/spondee choice.

**Derivation.** Map stress sequence to profile table.

**Difficulty.** L1 iamb/trochee; L2 anapest/dactyl; L3 spondee in metrical context.

**Distractors/constraints.** Pyrrhic excluded from unique beginner choices.

**Feedback.** Read stress pattern aloud/textually.

**Examples.** (1) `x /`→iamb. (2) `/ x x`→dactyl. (3) `/ /`→spondee.

**Validation.** Exact stress-vector lookup.

### Family `prosody_foot_boundary`

**Task.** Insert foot boundaries into a scanned line.

**Response/template.** Boundary selection between syllables.

**Derivation.** Match accepted metrical parse.

**Difficulty.** L1 identical disyllabic feet; L2 trisyllabic; L3 initial inversion with base meter stated.

**Distractors/constraints.** Do not imply words equal feet.

**Feedback.** Show grouping and base recurrence.

**Examples.** (1) `x / | x / | x /`. (2) `/ x x | / x x`. (3) `/ x | x / | x /` initial inversion.

**Validation.** Boundaries cover every metrical syllable exactly once.

### Family `prosody_meter_name`

**Task.** Name a line's predominant foot and foot count.

**Response/template.** Two fields, e.g. `iambic tetrameter`.

**Derivation.** Read reviewed base meter and count metrical feet.

**Difficulty.** L1 perfectly regular; L2 one substitution; L3 feminine ending/catalexis declared.

**Distractors/constraints.** Syllable count alone cannot decide foot type.

**Feedback.** Show recurring pattern and variation separately.

**Examples.** (1) four iambs→iambic tetrameter. (2) three anapests→anapestic trimeter. (3) pentameter with initial trochee remains iambic base.

**Validation.** Base-meter annotation and accepted name aliases.

### Family `prosody_meter_match`

**Task.** Select which purpose-written line fits a supplied meter.

**Response/template.** Single choice.

**Derivation.** Compare each accepted scansion with requested base meter/variation policy.

**Difficulty.** L1 exact pattern; L2 same syllable count/different stress; L3 one allowed substitution.

**Distractors/constraints.** Choices share topic/register and comparable length.

**Feedback.** Scan all choices briefly.

**Examples.** (1) choose iambic dimeter. (2) trochaic versus iambic tetrameter. (3) pentameter with approved initial inversion.

**Validation.** Exactly one choice satisfies profile.

### Family `prosody_substitution_locate`

**Task.** Locate and name a foot that varies from the established base meter.

**Response/template.** Foot-span plus substitution choice.

**Derivation.** Compare realized foot vector with base vector.

**Difficulty.** L2 initial inversion; L3 spondaic emphasis or catalectic close.

**Distractors/constraints.** Base established by enough regular feet; variation reviewed.

**Feedback.** Show expected and realized pattern and local effect as bounded possibility.

**Examples.** (1) opening trochee in iambic line. (2) spondee interrupts iambs. (3) missing final unstressed syllable in trochaic line→catalexis.

**Validation.** Substitution span/type encoded.

### Family `prosody_feminine_ending`

**Task.** Decide whether a line has an extra unstressed syllable after its final complete foot.

**Response/template.** Yes/no plus final syllable.

**Derivation.** Compare realized ending with base foot count.

**Difficulty.** L2 clear ending; L3 distinguish from added foot or anapest.

**Distractors/constraints.** Base meter already known or independently evident.

**Feedback.** Bracket complete final foot and extra syllable.

**Examples.** (1) five iambs plus `x`→yes. (2) regular final iamb→no. (3) anapestic foot is not automatically feminine ending.

**Validation.** Ending annotation and syllable count consistent.

### Family `prosody_caesura_endstop_enjambment`

**Task.** Classify a line boundary/internal pause as caesura, end-stop, enjambment, or none under the teaching profile.

**Response/template.** Span/boundary choice.

**Derivation.** Use syntax/punctuation and reviewed lineation annotation.

**Difficulty.** L1 punctuation end-stop; L2 syntactic continuation; L3 strong internal caesura plus enjambed end.

**Distractors/constraints.** Visual line break alone is not an end-stop.

**Feedback.** Show syntactic unit across line boundary.

**Examples.** (1) sentence ends with line→end-stop. (2) determiner at line end continues noun→enjambment. (3) dash midline→caesura.

**Validation.** Boundary tags and syntax spans agree.

### Family `prosody_audit`

**Task.** Find a syllable, stress, foot, meter, or variation error in a proposed scansion.

**Response/template.** Syllable/foot choice and correction.

**Derivation.** Compare against all accepted scansions.

**Difficulty.** L1 wrong foot name; L2 boundary off by syllable; L3 valid variant wrongly rejected.

**Distractors/constraints.** If several scansions are accepted, audit cannot mark one wrong.

**Feedback.** Identify pronunciation/profile assumption.

**Examples.** (1) `x /` labeled trochee. (2) ten syllables declared pentameter without stress evidence. (3) feminine ending counted as sixth foot.

**Validation.** Single mutation of reviewed scansion.

### Cross-family progression

Syllable and word-stress work precedes line scanning. Introduce iamb/trochee,
then three-syllable feet, boundaries, and meter naming. Substitutions and endings
appear only after a base meter is recognizable. Boundary rhythm and audits come
later.

## 7. Category: Rhyme, sound, lineation, stanza, and poetic form

### Category purpose

Train recognition and construction of sound/line/stanza patterns and analysis of
how repetition and formal placement organize a poem.

### Learn

Rhyme is based on sound, not spelling. A rhyme scheme labels recurring end-rhyme
classes in order. Line breaks can reinforce syntax or cut across it. Form is a
pattern of constraints; naming it should follow from observed structure.

### Prerequisites

Category 6 basics and the active pronunciation profile.

### Category boundaries

This category uses short purpose-written poems and vetted excerpts. Historical
form trivia and full-poem interpretation are excluded.

### Common misconceptions

- Rhyming by final letter only.
- Giving each repeated rhyme a new scheme letter.
- Treating identical word repetition as always ordinary rhyme.
- Calling all repeated consonant letters alliteration.
- Ignoring stanza boundaries.
- Naming a form from line count alone.

### Family `poetry_rhyme_pair`

**Task.** Classify two line-ending words as perfect rhyme, slant rhyme under profile, eye rhyme, identical repetition, or no rhyme.

**Response/template.** Relation choice.

**Derivation.** Compare reviewed pronunciation rhyme domains and lexical identity.

**Difficulty.** L1 perfect/no; L2 eye rhyme; L3 reviewed slant/variant.

**Distractors/constraints.** Dialect profile explicit.

**Feedback.** Display pronunciations from final stressed vowel.

**Examples.** (1) `light/night`→perfect. (2) `love/move`→eye rhyme. (3) `stone/stone`→identical repetition.

**Validation.** Pronunciation and rhyme relation table.

### Family `poetry_rhyme_scheme`

**Task.** Write the rhyme scheme of a short stanza.

**Response/template.** Letter string.

**Derivation.** Canonically label first-seen end-rhyme equivalence classes.

**Difficulty.** L1 couplets; L2 alternating/envelope; L3 one unrhymed line or repeated word.

**Distractors/constraints.** 4–8 lines; pronunciation reviewed.

**Feedback.** Color/code end-rhyme classes accessibly.

**Examples.** (1) moon/light/night/noon→ABBA. (2) four alternating→ABAB. (3) one unique close→ABCBA.

**Validation.** Equivalence-class canonicalization.

### Family `poetry_missing_rhyme`

**Task.** Select a line ending that completes a specified rhyme scheme without breaking sense/grammar.

**Response/template.** Word/line choice.

**Derivation.** Require rhyme class plus semantic/syntactic slot constraints.

**Difficulty.** L1 end word; L2 whole line; L3 meter also constrained.

**Distractors/constraints.** Rhyming nonsense and eye-rhyme traps.

**Feedback.** Check sound, syntax, meaning, then optional meter.

**Examples.** (1) choose `night` to rhyme `light`. (2) B-rhyme line with correct referent. (3) rhyme and iambic foot count.

**Validation.** All constraint layers; unique or accepted set.

### Family `poetry_sound_device_span`

**Task.** Identify and select the span exhibiting alliteration, assonance, or consonance.

**Response/template.** Device choice plus span.

**Derivation.** Read phoneme-level recurrence annotations.

**Difficulty.** L1 initial consonants; L2 vowel recurrence; L3 overlapping devices.

**Distractors/constraints.** Repeated letters with different sounds and incidental single repeat.

**Feedback.** Show recurring phonemes, not just spelling.

**Examples.** (1) “soft sand sighed”→/s/ alliteration. (2) repeated /oʊ/→assonance. (3) final /k/ recurrence→consonance.

**Validation.** Pronunciation-derived spans reviewed for salience.

### Family `poetry_refrain_repetition`

**Task.** Identify repeated unit type and what changes around/between repetitions.

**Response/template.** line/phrase/word repetition plus contrast choice.

**Derivation.** Compare normalized repeated spans and local context annotations.

**Difficulty.** L1 exact refrain; L2 anaphora; L3 repetition with one-word variation.

**Distractors/constraints.** Mere common word frequency not salient repetition.

**Feedback.** Align repetitions and changed context.

**Examples.** (1) same closing line each stanza→refrain. (2) successive lines begin “I remember”→anaphora. (3) refrain changes `home` to `gone`.

**Validation.** Repeat graph and variation diff.

### Family `poetry_linebreak_effect`

**Task.** Compare two lineations of the same words under a named structural effect.

**Response/template.** Version choice plus boundary evidence.

**Derivation.** Use authored syntax/line-break relation.

**Difficulty.** L1 end-stop versus enjambment; L2 delayed key word; L3 temporary ambiguity resolved next line.

**Distractors/constraints.** Wording/punctuation held constant.

**Feedback.** Read syntax before/after boundary.

**Examples.** (1) break before verb delays action. (2) noun separated from modifier creates temporary completion. (3) end-stop emphasizes final word.

**Validation.** Target effect reviewed; no universal emotional claim.

### Family `poetry_stanza_structure`

**Task.** Identify stanza units and map a progression such as claim/response, image shift, or repeated frame.

**Response/template.** Boundary selection plus role matching.

**Derivation.** Use stanza and discourse-function annotations.

**Difficulty.** L1 couplet/quatrain boundaries; L2 contrasting stanzas; L3 return with variation.

**Distractors/constraints.** Typography preserved; role labels passage-specific.

**Feedback.** Summarize each stanza's structural job.

**Examples.** (1) stanza1 question/stanza2 answer. (2) dawn image shifts to night. (3) third stanza revises first refrain.

**Validation.** Stanza boundaries exact; functions reviewed.

### Family `poetry_form_constraints`

**Task.** Determine which named bounded form profile a purpose-written poem satisfies.

**Response/template.** Form choice or constraint checklist.

**Derivation.** Test displayed profile: line/stanza count, meter, rhyme, refrain, or turn.

**Difficulty.** L1 couplet/quatrain; L2 reviewed ballad-stanza/sonnet subset; L3 near-form with one failed constraint.

**Distractors/constraints.** Form definitions displayed; no label from line count alone.

**Feedback.** Pass/fail each constraint.

**Examples.** (1) two rhymed lines→rhymed couplet. (2) ABAB quatrain with stated meter profile. (3) 14 lines but wrong supplied sonnet scheme→not that profile.

**Validation.** Deterministic constraint checker.

### Family `poetry_form_audit`

**Task.** Find a rhyme, phoneme, line-break, repetition, stanza, or form-classification error.

**Response/template.** Element choice and correction.

**Derivation.** Replay pronunciation and structural constraints.

**Difficulty.** L1 scheme letter; L2 eye rhyme; L3 form named despite failed volta/meter profile.

**Distractors/constraints.** One root defect.

**Feedback.** Name exact sound/structure evidence.

**Examples.** (1) ABAB mislabeled AABB. (2) spelling pair assumed rhyme. (3) 14 lines alone called sonnet under stricter displayed definition.

**Validation.** Single mutation against reviewed poem model.

### Cross-family progression

Perfect/no-rhyme and simple schemes precede eye/slant rhyme. Sound-device work
uses phonemes after pronunciation calibration. Lineation and repetition lead into
stanza roles and bounded form constraints. Construction begins with missing
rhyme, not unrestricted poem writing.

## 8. Category: Comparative analysis, structural revision, and synthesis

### Category purpose

Train evidence-based comparison and controlled construction by changing one
literary variable at a time.

### Learn

A good comparison needs a shared criterion: not “these are different,” but “the
two passages reveal motive at different times.” Revision questions hold most
content constant so the effect of one structural choice can be examined.

### Prerequisites

At least one mastered family from Categories 2–5; poetry comparisons additionally
require Categories 6–7.

### Category boundaries

This category checks bounded choices and structured explanations, not free-form
creative-writing quality or essay style.

### Common misconceptions

- Comparing unrelated features.
- Summarizing two texts separately without a comparative claim.
- Treating difference as superiority.
- Selecting evidence from only one text.
- Changing several variables and attributing effect to one.
- Assuming a revision has one universally better form.

### Family `compare_claim_evidence`

**Task.** Select a comparative claim supported by evidence from both microtexts.

**Response/template.** Claim choice plus one span from each text.

**Derivation.** Match reviewed cross-text claim and sufficient paired evidence.

**Difficulty.** L1 direct contrast; L2 same device/different function; L3 qualified similarity.

**Distractors/constraints.** One-text claim, unsupported value judgment, false symmetry.

**Feedback.** Explain parallel evidence relations.

**Examples.** (1) both characters delay, for different stated goals. (2) same storm image threatens in A, cleanses in B. (3) both narrators limited, only one contradicted.

**Validation.** Cross-text evidence pair required.

### Family `compare_structure_map`

**Task.** Align corresponding structural roles across two short texts.

**Response/template.** Matching such as setup/turn/payoff or claim/response.

**Derivation.** Compare discourse-role graphs.

**Difficulty.** L1 same order; L2 roles in different order; L3 one text omits a role.

**Distractors/constraints.** Surface topic similarity not enough.

**Feedback.** Display abstract structures side by side.

**Examples.** (1) both setup→reversal. (2) poem refrain corresponds to prose return. (3) B has no explicit resolution.

**Validation.** Role mapping reviewed and partial matches explicit.

### Family `compare_perspective_effect`

**Task.** Compare how two viewpoint versions disclose or withhold information.

**Response/template.** Effect choice plus differing knowledge fields.

**Derivation.** Diff focalization/knowledge graphs over same event plan.

**Difficulty.** L1 first versus third limited; L2 different focalizers; L3 reliability discrepancy.

**Distractors/constraints.** Event wording otherwise controlled.

**Feedback.** List facts available in each version.

**Examples.** (1) culprit focalizer hides room detail from reader. (2) observer view shows gesture, not thought. (3) omniscient version removes dramatic irony.

**Validation.** Controlled version diff.

### Family `revision_diction_effect`

**Task.** Choose a lexical revision producing a specified register/connotation while preserving event facts.

**Response/template.** Word/phrase choice.

**Derivation.** Slot constraints plus reviewed lexical features.

**Difficulty.** L1 valence; L2 register; L3 mixed tone without fact change.

**Distractors/constraints.** Choices grammatically fit and preserve denotation where required.

**Feedback.** Separate unchanged fact from altered coloring.

**Examples.** (1) `thin`→`gaunt` for harsher implication. (2) formal verb replaces colloquial. (3) restrained euphemism creates minimizing tone.

**Validation.** Semantic frame identical; target feature unique/accepted set.

### Family `revision_order_effect`

**Task.** Choose/reorder units to create chronology, suspense, surprise, or dramatic irony under a defined target.

**Response/template.** Version choice or ordering.

**Derivation.** Test disclosure time against event/knowledge graph.

**Difficulty.** L1 reveal before/after action; L2 flashback; L3 reader-character knowledge gap.

**Distractors/constraints.** Coherence/reference must survive.

**Feedback.** Timeline who knows what when.

**Examples.** (1) reveal trap before arrival→tension. (2) reveal after→surprise. (3) delay cause while preserving pronoun reference.

**Validation.** Target effect condition structural and reviewed.

### Family `revision_lineation_meter`

**Task.** Select a purpose-written revision meeting a specified line-break, meter, or rhyme constraint while preserving core proposition.

**Response/template.** Version choice.

**Derivation.** Check semantic equivalence plus prosody/form constraints.

**Difficulty.** L2 one constraint; L3 two constraints; L4 controlled tradeoff.

**Distractors/constraints.** No claim one version is aesthetically superior.

**Feedback.** Check meaning and form separately.

**Examples.** (1) preserve meaning and fit iambic tetrameter. (2) create enjambment at verb. (3) complete ABAB without false rhyme.

**Validation.** Semantic frame and prosodic oracle both pass.

### Family `interpretation_counterevidence`

**Task.** Select the detail that most strongly qualifies or challenges a proposed interpretation.

**Response/template.** Span choice plus effect `qualifies`/`contradicts`.

**Derivation.** Query contradiction/qualification edges.

**Difficulty.** L2 explicit exception; L3 ambiguous motive; L4 narrator discrepancy.

**Distractors/constraints.** Counterevidence need not disprove the entire reading.

**Feedback.** Revise claim to a narrower defensible version.

**Examples.** (1) “always selfish” challenged by one sustained sacrifice. (2) joyful reading qualified by anxious syntax. (3) narrator's confidence contradicted by event.

**Validation.** Original and revised claim statuses stored.

### Family `literary_analysis_audit`

**Task.** Find the root flaw in a structured mini-analysis spanning claim, evidence, narrative role, device, or prosody.

**Response/template.** Layer/error choice and corrected bounded claim.

**Derivation.** Replay annotation/evidence pipeline.

**Difficulty.** L2 wrong span; L3 correct observation/overstated effect; L4 two readings collapsed to one.

**Distractors/constraints.** Exactly one root error; terminology variation accepted.

**Feedback.** Separate observation, evidence relation, and claim strength.

**Examples.** (1) quote is accurate but irrelevant. (2) narrator called author. (3) alternative scansion defensible but marked wrong.

**Validation.** Mutate one valid analysis relation and locate earliest failure.

### Cross-family progression

Begin with paired claim/evidence and structure maps. Controlled diction and order
revision follow. Perspective and poetry revision require their component
categories. Counterevidence and integrated audit are capstone exercises because
they reward qualification rather than maximal certainty.

## 9. Topic-level progression

### Level 1 — What the text explicitly does

- locate facts, speakers, referents, and direct evidence;
- recognize clear connotation, sensory imagery, simile, and literal comparison;
- order chronologically narrated events;
- distinguish narrator from author and character;
- count transparent syllables and recognize iamb/trochee;
- identify perfect rhyme, end-stop, and simple stanza boundaries.

### Level 2 — Relate evidence to a bounded inference

- distinguish explicit, supported, plausible, and unknown;
- explain a local word/image/syntax effect;
- separate story from discourse order and sequence from cause;
- track one character's knowledge and immediate goal;
- scan regular short lines and name base meter;
- derive rhyme schemes and repeated structures;
- compare two texts under one criterion.

### Level 3 — Manage competing cues

- select multi-span evidence and counterevidence;
- analyze tone shifts, extended comparison, and register shifts;
- reconstruct flashback, ellipsis, setup/payoff, and turning point;
- handle focalization, subtext, dramatic irony, and mixed motives;
- recognize reviewed substitutions, feminine endings, eye rhyme, and enjambment;
- revise one structural variable while preserving semantic facts.

### Level 4 — Preserve qualification across systems

- retain multiple defensible readings;
- audit overclaiming from true but insufficient detail;
- distinguish limited knowledge, bias, error, and contradiction;
- compare viewpoint/disclosure structures;
- satisfy combined semantic and prosodic constraints;
- repair integrated analyses and state why uncertainty remains.

Difficulty levels describe this app's reasoning demands, not the literary merit of
a text or a learner's general intelligence.

## 10. Adaptive practice guidance

Track mastery by:

```text
family
language/profile
sourceClass
genre/discourseMode
passageLengthBand
claimStatus
evidenceRelation
device/structure
pronunciation/prosodyProfile
misconception
responseMode
```

Do not infer that success on generated microtexts transfers automatically to
unfamiliar historical prose or long works.

Routing:

- Explicit-detail errors → shorter literal/reference tasks before inference.
- Plausible answers repeatedly called explicit → `text_claim_status` and
  `text_missing_information`.
- Correct claim/wrong quotation → evidence-pair and minimal-span practice.
- Keyword evidence selection → passages with true but irrelevant repeated words.
- Device correctly named/effect unsupported → `figurative_effect_select`.
- Tone chosen from one word → tone-shift items requiring two features.
- Discourse/story order confusion → paired timeline views.
- Sequence treated as cause → temporal/causal contrast families.
- Character/narrator/author confusion → role identification.
- Character knows what reader knows → knowledge-state and dramatic-irony drills.
- First-person automatically called unreliable → claim-specific reliability
  contrasts.
- Meter guessed from syllable count → stress marking before naming meter.
- Feet aligned to words → foot-boundary practice.
- Spelling used for rhyme → pronunciation/rhyme-pair contrast.
- Strong reading ignores counterevidence → interpretation qualification.

When an answer matches more than one misconception, route to a simpler
discriminating task. Slow reading is not itself an error, and default literary
practice is untimed.

## 11. Answer checking and feedback

### Closed and structured answers

The app checks stable IDs and semantic relations:

- propositions and claim statuses;
- token/span IDs;
- evidence sets and relation labels;
- event orders/partial orders;
- graph edges and state changes;
- role/focalizer/knowledge IDs;
- syllable/stress/foot arrays;
- rhyme equivalence classes;
- stanza/discourse roles;
- constraint-check results.

Choice order and surface wording never define correctness.

### Free text boundary

V1 does not grade unrestricted literary interpretation. Optional learner notes
are private, unscored, and may be compared with reviewed commentary manually.
A future constrained parser may accept short labels/synonyms, but numerical
semantic similarity or an LLM judgment is not a correctness oracle.

### Span acceptance

For each evidence task, store:

```text
requiredCoreSpans[]
allowedExpansionBoundaries
forbiddenContradictingSpans[]
minimumEvidenceSetSize
maximumIrrelevantExpansion
```

Highlight selection is normalized to tokens. Selecting a whole paragraph when
one phrase is requested receives feedback about precision even when it contains
the evidence. Accessibility alternatives allow choosing numbered sentences or
phrases.

### Feedback sequence

1. State the requested reading operation.
2. Quote only the small relevant span.
3. Identify literal observation/structure.
4. Explain the evidence relation.
5. Calibrate claim strength.
6. Mention a reviewed alternative when relevant.
7. For excerpts, display source attribution/provenance link in a separate panel.

Correct feedback should not imply that agreement with the key is proof of taste
or intelligence. Incorrect feedback diagnoses a known reading move when
possible:

> That line is true of the passage, but it does not support the proposed motive.
> The action after the warning is the relevant evidence.

> Your scan is a reasonable pronunciation variant and is included in the
> accepted set. The teaching scan emphasizes the base iambs.

### Explanations and confidence

Structured explanations may require `claim + evidence + relation +
qualification`. Confidence is optional and ungraded. The app never tells a
learner that an interpretation is “obviously” correct or that ambiguity is
failure.

## 12. Rendering, interaction, accessibility, and localization

### Text rendering

- Use selectable semantic HTML text, not images of paragraphs.
- Preserve approved paragraph, dialogue, poetic line, stanza, italics, and
  indentation structure.
- CSS reflow may wrap prose but must not create new poetic line IDs.
- Poetry uses explicit line containers; soft visual wraps are visibly distinct
  from authored line breaks.
- Line numbers are optional display metadata and not copied as text.
- Evidence highlights support overlapping colors plus underline/pattern/labels.
- A side-by-side comparison has a sequential single-column alternative.
- Reordering works with buttons and keyboard, not drag alone.

### Accessibility

- Every annotation task has keyboard and assistive-technology-operable controls.
- Span selection has numbered phrase/sentence alternatives.
- Color never solely identifies speakers, rhyme classes, evidence, or devices.
- Meter marks have spoken labels such as “unstressed, stressed.”
- Structural diagrams have nested lists/table alternatives.
- Text remains readable at 200% zoom and with user text-spacing overrides.
- No exercise requires rapid reading.
- Optional audio readings have transcripts and controls; they do not autoplay.
- Screen-reader reading order follows literary order, not visual columns.

### Localization

Interface localization and literary-language localization are separate:

```text
uiLocale
textLanguage
literaryProfile
pronunciationProfile
```

Translations of a source text are separate TextAssets with their own rights,
wording, lineation, annotation, rhyme, and meter. An answer key is never
machine-translated across literary languages without review. Names for literary
devices may have several accepted local equivalents mapped to one stable ID.

## 13. Generator and implementation architecture

Recommended modules:

```text
seededRng
rightsManifestVerifier
textAssetStore
microtextPlanner
surfaceRealizer
textWorldValidator
annotationStore
claimEvidenceGraph
eventTimelineOracle
knowledgeStateOracle
narrativeStructureOracle
pronunciationLexicon
prosodyOracle
rhymeOracle
constraintComposer
questionGenerators
distractorGenerators
semanticAnswerChecker
textRenderer
annotationRenderer
localeCatalog
localProgressStore
```

### Build-time versus runtime

At build/review time:

- import/collate exact excerpts;
- approve rights/provenance;
- annotate and review literary claims;
- validate pronunciation, scansion, rhyme, and sensitive content;
- generate golden questions and structural templates;
- run corpus-wide contradiction and leakage checks.

At runtime:

- select approved assets/templates;
- fill reviewed semantic slots;
- transform event/discourse order within constraints;
- instantiate already-defined claims and distractors;
- compute exact structural/prosodic answers;
- never generate a new literary interpretation.

### Standalone architecture

The app is offline HTML/JS/CSS with bundled text, metadata, and optional audio.
No backend, archive lookup, language-model call, user passage upload, or runtime
rights determination is required. Text assets are compact enough that v1 should
bundle purpose-written microtexts and only a selective excerpt corpus.

### Review workflow

Every enabled asset/family requires:

- literary/editorial review;
- language/prosody review where applicable;
- rights/provenance approval for non-authored assets;
- sensitivity/context review;
- accessibility/localization review;
- versioned review manifest matching text and annotation hashes.

Generated templates receive review at the semantic plan, every surface pattern,
and representative combined outputs. Reviewing three random examples is not
enough to approve an unconstrained combinatorial grammar.

## 14. Automated validation requirements

### Text and rights validation

- Every active text hash matches its review manifest.
- Required author/translator/editor/edition fields are present.
- Deployment jurisdiction is in the approved set.
- Attribution/notice renders where required.
- Disabled/unresolved assets cannot enter generation.
- Exact source text and app-added ellipses/notes remain distinguishable.
- Translations never inherit rights metadata from the underlying original.

### Microtext validation

- All mentions resolve under intended mode.
- Tense/aspect and discourse connective constraints pass.
- Character location, possession, knowledge, and goals remain consistent.
- Event graph has no forbidden cycles and discourse order covers intended units.
- Surface parsing reconstructs the semantic plan.
- Lexical slots satisfy register, valency, agreement, and sensitivity rules.
- No generated attribution or living-author imitation appears.

### Claims and distractors

- Every closed answer has one accepted answer/set or explicit ambiguity.
- Every supported claim has a sufficient reviewed evidence set.
- Every contradicted claim has contradiction evidence.
- `indeterminate` corresponds to multiple compatible text worlds/readings.
- Removing required evidence changes support status.
- Distractors instantiate named misconceptions and remain grammatically parallel.
- Choice length, position, vocabulary overlap, and specificity do not leak key.

### Narrative validation

- Story order and discourse order are independently reproducible.
- All accepted chronological orders are graph linear extensions.
- Temporal, causal, goal, and setup/payoff edges stay distinct.
- Reordering preserves reference and state coherence.
- Knowledge-state results depend only on information available by that point.
- Reliability judgments stay tied to a specific narrator claim.

### Prosody and form validation

- Token, pronunciation, syllable, stress, and line arrays align.
- Every accepted scansion covers each realized syllable once.
- Foot boundaries, base meter, substitutions, and endings are consistent.
- Multiple defensible scansions are all accepted.
- Rhyme classes derive from pinned pronunciation profiles.
- Scheme canonicalization is invariant under arbitrary class names.
- Line/stanza breaks survive rendering/reflow.
- Form families test every displayed constraint, not name/line count alone.

### Property and mutation tests

For at least `10,000` deterministic instances per fully generative family and all
curated items:

- placeholders resolve and no markup escapes incorrectly;
- answer sets are nonempty and choices distinct;
- recent-structure rejection works;
- evidence spans remain in bounds after rendering;
- semantic and independent audit oracles agree;
- every declared misconception appears;
- no sensitive/forbidden lexical combination is emitted;
- source/author identity cannot leak an interpretive answer unintentionally.

Mutation tests catch:

- negation/modality loss;
- wrong referent;
- narrator belief promoted to fact;
- relevant-but-insufficient evidence accepted;
- discourse/story order swapped;
- temporal edge promoted to cause;
- reader knowledge assigned to character;
- author/narrator conflation;
- reflection of claim strength from plausible to explicit;
- syllable insertion/removal;
- iamb/trochee reversal;
- alternative accepted scansion rejected;
- spelling used instead of pronunciation for rhyme;
- line/stanza break loss;
- unapproved translation/edition enabled.

## 15. Coverage requirements

Across a long course:

- authored/generated/public-domain source classes are tracked separately;
- purpose-written texts remain the majority and complete all core pathways;
- prose, dialogue, and poetry are balanced without implying equal mastery;
- names, occupations, settings, relationships, and voices are diverse and
  non-stereotyped;
- explicit/supported/plausible/contradicted/indeterminate claims all recur;
- evidence includes direct, distributed, qualifying, and counterevidence forms;
- discourse orders, causal structures, goals, knowledge gaps, and viewpoint
  profiles vary deliberately;
- every core foot/meter, rhyme relation, line boundary, and stanza role receives
  appropriate representation;
- ambiguity appears intentionally and is scored honestly;
- no famous excerpt dominates merely because it is easy to source;
- every misconception appears in direct and audit practice.

Coverage is based on semantic/structural signatures, not word substitutions.

## 16. Recommended views and v1 priorities

### Views

1. **Learn** — concise concepts with authored examples and visible annotations.
2. **Practice** — short generated/curated exercises.
3. **Close Reading** — passage plus claim/evidence workspace.
4. **Poetry Lab** — syllable, stress, feet, rhyme, and lineation tools.
5. **Compare & Revise** — controlled paired texts.
6. **Review** — worked evidence graphs and accepted alternatives.
7. **Sources** — attribution, edition, rights basis, and normalization notes.

### Recommended v1

Prioritize:

- purpose-written English microtexts under clear rights;
- explicit/inference/status/evidence/reference families;
- connotation, imagery, metaphor mapping, and bounded tone;
- story/discourse order, causality, goals, setup/payoff;
- role, focalization, character knowledge, dramatic irony;
- regular iamb/trochee, syllables, stress, feet, simple meter;
- perfect/eye rhyme, scheme, end-stop/enjambment, repetition;
- comparison and counterevidence;
- immutable text/annotation hashes and review tooling.

Defer:

- large public-domain corpus until jurisdictional rights workflow is proven;
- translations until separately reviewed;
- ambiguous historical pronunciation/scansion;
- slant-rhyme breadth and free-verse formal analysis;
- culturally specific symbol/allusion corpora;
- open essay feedback, user passage imports, or runtime AI analysis;
- optional sensitive historical collections.

## 17. Topic-level quality checklist

- [ ] Purpose-written microtexts provide a complete curriculum.
- [ ] Every public-domain excerpt has exact edition, translator/editor, source,
  jurisdiction, and rights evidence.
- [ ] Source-platform availability is never treated as rights clearance.
- [ ] Translations and editorial additions are reviewed separately.
- [ ] Text/annotation hashes match the release manifest.
- [ ] Generated text comes from reviewed semantic templates, not unrestricted AI.
- [ ] No generated text imitates or is attributed to a living/historical author.
- [ ] Sensitive/historical content has explicit governance and can be skipped.
- [ ] Every question states whether it asks for fact, inference, possibility, or
  multiple readings.
- [ ] `indeterminate` and multiple supported readings are first-class answers.
- [ ] Evidence spans have an annotated relationship to the claim.
- [ ] Keyword overlap alone never grades evidence.
- [ ] Author, narrator, speaker, focalizer, and character remain distinct.
- [ ] Story order, discourse order, temporal relation, and causality remain
  separate.
- [ ] Character/narrator analysis does not become diagnosis.
- [ ] Prosody uses a pinned language/pronunciation profile.
- [ ] Meter is based on stress, not syllable count alone.
- [ ] Every defensible reviewed scansion is accepted.
- [ ] Rhyme uses pronunciation rather than spelling.
- [ ] Poetic line/stanza structure survives responsive rendering.
- [ ] Form names follow displayed constraints.
- [ ] Open notes/interpretations are ungraded in v1.
- [ ] Feedback explains observation → evidence relation → calibrated claim.
- [ ] Accessibility alternatives preserve semantic spans and literary order.
- [ ] Every family has task, response template, derivation, difficulty,
  misconception-based distractors, feedback, three examples, and validation.
- [ ] Generator, mutation, corpus, rights, and rendering tests pass.
- [ ] The standalone app requires no backend, archive fetch, or model call.

## 18. Stable identifiers and navigation

Recommended navigation:

```text
Text & Evidence
Language & Imagery
Narrative Structure
Narrators & Characters
Meter & Rhythm
Rhyme & Form
Compare & Revise
```

Stable family identifiers are the backticked IDs above. Text IDs, annotation
versions, rights profiles, literary-language profiles, and pronunciation
profiles are independently versioned. A corrected scansion, changed excerpt, or
new rights determination never silently rewrites old saved questions.
