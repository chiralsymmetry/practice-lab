# Swedish Language — Dynamic Practice Specification

Status: implementation specification

Audience: exercise generator, Swedish linguistic-content editor, morphology and
syntax engine, semantic answer checker, text/audio renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual normative meanings.

## 1. Topic overview

### Topic name

Swedish Language

### Topic goal

Develop beginner-to-lower-intermediate communicative Swedish by repeatedly
connecting sound, spelling, vocabulary, morphology, syntax, reading, listening,
controlled writing, and guided speaking. The learner should become able to:

- read and type the 29-letter Swedish alphabet, including `å`, `ä`, and `ö`,
  and apply ordinary capitalization, punctuation, and compound-word spelling;
- connect reviewed spelling to vowel quality/quantity, consonant length,
  `sj`/`tj`/`j`/`ng` sounds, word stress, and regional pronunciation profiles;
- recognize lexical pitch-accent contrasts where a selected profile makes them
  relevant, without treating one regional realization as the only correct one;
- retrieve nouns with `en/ett`, plural class, indefinite/definite forms, and
  possessive/genitive behavior;
- choose reference and determination first, then construct simple and
  double-definite noun phrases;
- make adjectives, possessives, demonstratives, participles, and pronouns agree
  where Swedish requires it;
- conjugate frequent regular and irregular verbs through infinitive, imperative,
  present, preterite, supine/perfect, pluperfect, and practical future/modal
  constructions;
- distinguish preterite and perfect from temporal/discourse context rather than
  from one-to-one English tense labels;
- retrieve particle verbs, reflexive constructions, lexical prepositions, and
  verb complement frames as units;
- maintain verb-second order in main clauses, inversion after a non-subject
  first constituent, and the different placement of sentence adverbs such as
  `inte` in subordinate clauses;
- form statements, questions, negation, relatives, comparisons, passives,
  existential/presentational constructions, requests, and short connected
  discourse;
- understand and produce numbers, dates, times, prices, directions, routine
  descriptions, practical messages, and short conversations;
- recognize reviewed regional standards—including Finland Swedish—and
  familiar-spoken variants without ranking accents or silently mixing profiles.

The endpoint is practical form–meaning control in contemporary Swedish.
Grammar labels support explanation; terminology and paradigm recitation are not
the learning objective.

### Audience and level boundary

The app starts before Swedish spelling/pronunciation mastery and extends through
practical A1, A2, and selected early-B1 objectives. These labels guide exercise
complexity; the app does not certify CEFR, SFI, Swedex, TISUS, school, residency,
or professional proficiency.

- **Foundation:** alphabet/keyboard, high-value sound–spelling contrasts, fixed
  expressions, `en/ett` nouns, basic present forms, and simple clauses.
- **A1-oriented:** descriptions, routines, needs, noun definiteness, adjective
  agreement, time/prices/directions, basic V2, questions/negation, and short
  interaction.
- **A2-oriented:** preterite/perfect, object/reflexive pronouns, particles,
  subordinate order, comparison, instructions, messages, and connected
  descriptions.
- **Early-B1-oriented:** interacting tense/reference, passives, relative and
  subordinate clauses, information structure, register, inference, mediation,
  and cross-profile comprehension.

The Swedish National Agency for Education's [adult SFI curriculum](https://syllabuswebb.skolverket.se/syllabuscw/jsp/sfi.htm)
provides a communicative adult-learning boundary across reading, writing,
speaking, listening, interaction, purpose, audience, and situation. The Council
of Europe [CEFR Companion
Volume](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions)
informs reception, production, interaction, mediation, and phonological
competence. The app is not SFI coursework or an examination simulator.

### Reference and language-data boundary

Reference anchors include:

- Isof/Språkrådet's account of [standard written
  Swedish](https://www.isof.se/svenska-spraket/lar-dig-mer-om-svenska-spraket/standardsvenska)
  and its distinction from personal, informal, and spoken usage;
- Isof's description of [language planning and the roles of Språkrådet and
  SAOL](https://www.isof.se/svenska-spraket/lar-dig-mer-om-svenska-spraket/sprakvard);
- Svenska Akademien's current [SAOL and SO
  resources](https://svenska.se/om/om-ordbockerna/) for spelling, inflection,
  meaning, constructions, and pronunciation metadata;
- *Svenska Akademiens grammatik* as a broad [descriptive grammar
  reference](https://svenska.se/SAG.pdf), not as a learner syllabus;
- Isof's account of [regional standards and dialect
  continua](https://www.isof.se/dialekter/lar-dig-mer-om-svenska-dialekter/om-dialekter);
- Finland's Institute for the Languages of Finland on [Finland Swedish as a
  regional variety](https://sprakinstitutet.fi/om-oss/sprak-och-sprakpolitik/nationalspraken/svenska/).

Reference works are not corpora to copy. Every bundled lexicon, paradigm,
recording, frequency list, example, or authored text requires compatible
licensing, provenance, versioning, and Swedish-language review. Dictionary
attestation alone does not establish learner level, sense, gender, plural,
particle status, valency, register, region, or idiomaticity.

### Standard-variety and usage policy

Use contemporary neutral standard written Swedish as the default production
baseline. Spoken production/audio always uses an explicit reviewed regional
standard profile; no truly regionless spoken norm is assumed.

```text
VarietyProfile {
  id
  geographicScope
  productionBaseline
  orthographyPolicy
  pronunciationTargets[]
  quantityAndPitchProfile
  lexicalPreferences[]
  grammaticalVariants[]
  numberDateTimeConventions
  addressRegisterConventions[]
  acceptedAlternatives[]
}
```

- A production prompt declares a profile whenever it changes the answer.
- Regional standard profiles may include southern, western, central/eastern,
  northern, and Finland Swedish targets when reviewed; local dialects remain
  separate.
- Finland Swedish is a regional variety of Swedish, not learner error or
  Swedish pronounced through Finnish.
- Pitch accent, `r`, retroflexion, `sj`, vowel realization, lexical preferences,
  and some grammar differ independently; they are not one country switch.
- Written neutral Finland Swedish differs little from neutral written Swedish
  in Sweden, while speech and some vocabulary differ more. Track the dimensions
  separately.
- A learner selects one spoken production profile and may practice receptive
  understanding of others.
- Familiar-spoken forms may be accepted for comprehension while a neutral
  writing prompt requests its declared written target.
- Accent imitation, accent classification, and unreviewed dialect generation
  are outside core scope.

Every realization is classified as:

1. **canonical target** — selected teaching form for this profile/context;
2. **accepted variant** — standard and meaning/register-compatible here;
3. **profile-different** — established in another reviewed profile;
4. **contextually different** — grammatical but changes reference, tense,
   focus, politeness, particle meaning, or implication;
5. **non-target/nonstandard** — outside the requested production norm;
6. **incorrect** — incompatible spelling, morphology, syntax, or semantics.

Feedback must preserve these distinctions. A dialect or Finland-Swedish form is
not “bad Swedish.”

### Scope

Included:

- contemporary spelling, capitalization, punctuation, word division,
  compounding, and hyphenation for a practical subset;
- adult everyday vocabulary and collocations through selected early B1;
- reviewed standard pronunciation: vowel quality/quantity, consonant length,
  hard/soft contextual `g/k/sk`, `sj`/`tj`/`j`/`ng`, stress, retroflexion where
  profile-relevant, and lexical pitch accent for receptive contrasts;
- common and neuter gender (`en/ett`), singular/plural, indefinite/definite noun
  forms, genitive `-s`, and determiner/adjective noun phrases;
- personal, object, possessive, reflexive, demonstrative, relative, indefinite,
  and generic pronouns in a controlled subset;
- frequent regular/irregular/particle/reflexive verbs, infinitive, imperative,
  present, preterite, supine/perfect/pluperfect, practical future/modal,
  participial and passive constructions;
- main-clause V2, inversion, subordinate-clause order, statement/question/
  negation patterns, relative clauses, comparison, and common coordination/
  subordination;
- existential `det finns`, presentational/dummy `det`, weather/time, and
  selected cleft recognition;
- practical numbers, ordinals, dates, clock time, prices, addresses, telephone
  numbers, measurements, and quantities;
- short reading/listening, constrained writing, dialogue, mediation, and guided
  local speaking rehearsal;
- receptive exposure to explicitly reviewed regional-standard and
  familiar-spoken forms.

Expected prior knowledge:

- none at Foundation;
- ability to read a Latin-script interface;
- grammar terminology is introduced through examples before use;
- later families assume only the dependencies stated in progression notes.

### Exclusions

- Old Norse, Old Swedish, archaic inflection, and historical spelling as
  productive targets;
- unrestricted translation, essays, free conversation, and vague semantic
  similarity grading;
- comprehensive dialectology, slang generation, accent imitation, or accent
  “correction”;
- automatic pitch-accent or pronunciation scoring and claims that local
  recording measures intelligibility;
- exhaustive phonetic transcription, phonological theory, or a universal
  `sj`-sound target;
- exhaustive noun/verb exceptions, obsolete strong forms, and advanced
  stylistic variation;
- exhaustive participial agreement, formal nominal style, legalistic
  compounds, and advanced information-structure analysis;
- open literary interpretation, humor, irony, political trivia, and culturally
  dense implicature;
- raw vocabulary flashcards without context, morphology, collocation, or sound;
- specialist/high-stakes medical, legal, immigration, emergency, or safety
  content;
- live transport, law, price, news, or political information.

### Orthography, pronunciation, and input conventions

- Internal strings are UTF-8 and normalized to Unicode NFC.
- The alphabet order is `A–Z, Å, Ä, Ö`; `å/ä/ö` are independent letters, not
  accented fallback forms of `a/o`.
- Learner input must support `å ä ö` and uppercase equivalents. An optional
  character strip may be offered, but `a/a/o` substitutions do not earn
  spelling mastery.
- Ordinary Swedish does not mark stress, vowel length, or pitch accent in
  spelling. Those are stored annotations displayed through audio, highlighting,
  or learner notation only when needed.
- Vowel/consonant quantity is taught in stressed syllables through reviewed
  lexical forms. The common long-vowel+short-consonant versus
  short-vowel+long-consonant pattern is not treated as exceptionless.
- Pitch accent is lexical/prosodic and strongly profile-dependent. It is
  primarily receptive; no learner recording is given a machine pitch score.
- `sj`, `tj`, `j`, `ng`, retroflex sequences, and contextual `g/k/sk` are
  spelling–pronunciation mappings tied to lexeme and profile, not a single
  spelling rule or prestige sound.
- Neutral written forms such as `de/dem`, `mig/dig/sig`, and familiar-spoken/
  informal forms such as reviewed `dom`, `mej/dej/sej` remain separately tagged
  by medium and editorial profile.
- Spaces in compounds can change meaning and correctness; do not normalize
  internal whitespace before a compound-boundary task is classified.
- Capitalization of names versus ordinary nouns, weekdays, months, languages,
  and nationality adjectives follows reviewed contemporary policy.
- IPA is optional and never assumed.

### Lexical and grammatical data model

```text
Lexeme {
  id
  lemma
  partOfSpeech
  senses[]
  nounGender?
  countability?
  pluralClass?
  principalNominalForms[]
  adjectiveClass?
  comparisonForms[]
  verbClass?
  principalVerbForms[]
  auxiliaryFrames[]
  particleFrames[]
  reflexiveFrames[]
  passiveFrames[]
  argumentFrames[]
  prepositionFrames[]
  pronunciations[]
  syllables[]
  primaryStressIndex[]
  quantityProfile[]
  pitchAccentByProfile[]
  semanticTags[]
  collocations[]
  compounds[]
  frequencyBand
  learnerLevel
  register
  varietyScope[]
  acceptedVariants[]
  provenance
  reviewStatus
}

Construction {
  id
  semanticFrame
  syntacticTemplate
  requiredFeatures
  determinationProfile
  agreementLinks[]
  verbSlots[]
  clauseType
  clauseFieldSchema
  sentenceAdverbSlots[]
  particleStructure?
  tenseAspectMoodProfile
  wordOrderOptions[]
  informationStructure
  registerProfile
  varietyScope[]
  acceptedRealizations[]
}
```

Gender, plural/definite forms, stress, quantity, pitch accent, adjective class,
verb principal parts, particle status, valency, reflexive/passive sense,
preposition, compound relation, register, and region are stored lexical/
construction data. Do not infer them from a final letter or an
interface-language gloss.

### Determination, agreement, verb, and clause-order policy

- The generator creates reference, semantic roles, event time, clause type,
  information structure, polarity, register, and profile before surface forms.
- Noun determination distinguishes indefinite/definite, count/mass, generic,
  possessive, demonstrative, and adjective-modified reference before choosing
  article and suffixes.
- `en/ett` is lexical gender. Plural and definite forms are stored paradigms,
  not guessed from gender alone.
- Double definiteness is constructional: reviewed phrases such as `den röda
  bilen` require the determiner, adjective form, and definite noun. Possessives
  and genitives use different determination patterns.
- Adjective agreement follows predicative/attributive role, noun gender,
  number, definiteness, and adjective class.
- Verbs do not agree with person/number in contemporary standard Swedish.
  Finite form selection depends on tense/mood/voice, not subject identity.
- Particle verbs are sense-specific lexical constructions. Stress and particle
  placement may distinguish a particle from an ordinary prepositional phrase.
- Clause generation uses a field schema: clause type and initial constituent
  determine finite-verb placement; subject and sentence adverbs occupy licensed
  slots. “The verb is second” means second constituent, not second written word.
- Subordinate clauses use their own schema. The `BIFF` classroom mnemonic may
  support `inte` placement but never replaces a parsed clause grammar.

### Global answer conventions

- Ignore surrounding whitespace and normalize Unicode to NFC.
- Preserve `å/ä/ö`, internal compound boundaries, capitalization, punctuation,
  and hyphens when they are assessed.
- Accept ordinary equivalent spaces only when word division is incidental.
- Text comparison may be case-insensitive only for families where
  capitalization is not a target.
- Spoken/profile forms are not substituted for neutral written answers unless
  the prompt or answer policy explicitly permits them.
- Choice and ordering responses compare stable IDs, not visible labels.
- Text responses are checked by the promised controlled grammar and accepted
  realization set. Edit distance or embedding similarity cannot establish
  grammatical or semantic equivalence.
- Multiple forms use labeled fields rather than guessed comma/slash order.
- Numbers accept declared Swedish digit grouping and decimal comma/point only
  when notation is not assessed.
- A grammatical answer that changes definiteness, tense, particle sense,
  question focus, information structure, register, or profile is
  “contextually different,” not equivalent.
- Audio-dependent prompts offer replay and a non-audio route unless hearing
  discrimination is the target.

### Difficulty philosophy

Difficulty should increase through independent dimensions:

- less segmented audio and fewer orthographic/quantity cues;
- lower-frequency but useful reviewed vocabulary;
- denser vowel/consonant quantity contrasts, less transparent sound–spelling,
  pitch-accent contrasts, and broader receptive profiles;
- less predictable `en/ett`, plural, definite, and adjective forms;
- more interacting determination/agreement links and greater controller
  distance;
- less regular verb principal forms and finer preterite/perfect/future
  distinctions;
- particle/reflexive/passive meanings and lexical preposition government;
- more complex clause openings, inversion, subordinate clauses, sentence
  adverbs, referents, and information-structure constraints;
- longer texts and greater evidence distance;
- productive rather than receptive response and reduced answer structure;
- cross-register/profile comprehension after one baseline is secure.

Do not manufacture difficulty with obscure compounds, tiny diacritics, poor
audio, unannounced profile changes, ambiguous translation, arbitrary timers,
unbounded typing, cultural trivia, or distractors that require missing context.

## 2. Category: Sound, stress, spelling, and word structure

### Category purpose

Build automatic bidirectional links among Swedish characters, graphemes,
syllables, vowel/consonant quantity, word stress, reviewed pitch profiles,
lexical forms, compounds, punctuation, and audio.

### Learn-card content

- Swedish has three additional letters after `z`: `å, ä, ö`.
- A stressed syllable often has either a long vowel followed by a short
  consonant or a short vowel followed by a long consonant: compare reviewed
  pairs such as `glas` and `glass`. Learn the word, not only the pattern.
- Vowel letters have several qualities. Length and surrounding consonants
  matter; spelling alone does not always give one profile-independent sound.
- `sj`, `tj`, and `j` sounds have several spellings. `g/k/sk` can change before
  front vowels in many native words, but lexical exceptions and loans matter.
- Swedish word stress and pitch accent are not written. Pitch accent varies
  regionally and may be absent as a lexical contrast in some profiles.
- Swedish commonly forms one written compound where some languages use several
  words. A wrong space can change the structure.

### Prerequisites

None. Audio families require usable audio output or an equivalent text/visual
route.

### Category boundaries

This category teaches decoding, pronunciation, spelling, and word boundaries.
Inflectional choices belong to Categories 3–5 even when they change sound or
spelling; those categories call the same lexical renderer.

### Common misconceptions

- Treating `å/ä/ö` as optional decorations or equivalent to `a/a/o`.
- Assuming every vowel letter has one quality or every doubled consonant must
  be audibly held twice.
- Treating the quantity pattern as exceptionless or applying it outside stress.
- Pronouncing every `sk/g/k` with one value regardless of following vowel and
  lexeme.
- Assuming one `sj` sound or one `r` is the only correct standard target.
- Treating pitch accent as emphasis or as required in every regional profile.
- Splitting compounds wherever the interface language uses spaces.
- Capitalizing weekdays, months, languages, and nationality adjectives from
  English habit.

### Family `alphabet_diacritic_identity`

**Task/purpose.** Recognize and produce Swedish letter names, case pairs, and
`å/ä/ö` identities. **Response/template.** Character selection, keyboard input,
matching, or reviewed audio spelling. **Derivation.** Fixed alphabet inventory.
**Difficulty.** L1 base letters; L2 `å/ä/ö`; L3 mixed case/audio; L4 spelled
names/codes. **Distractors.** `a/o` fallback and visually similar symbols.
**Validation.** Exhaustive inventory/font/keyboard snapshots.

### Family `vowel_quality_match`

**Task/purpose.** Match reviewed stressed vowel qualities to spelling and
lexical forms under a declared profile.
**Response/template.** Audio/text matching or vowel classification.
**Derivation.** lexeme, stress, quantity, surrounding segments, profile.
**Difficulty.** L1 clear `a/i/u`; L2 `y/å/ä/ö`; L3 close front rounded
contrasts; L4 cross-profile recognition.
**Distractors.** letter-name or interface-language value.
**Validation.** Human-reviewed lexeme/profile audio.

### Family `vowel_consonant_quantity`

**Task/purpose.** Distinguish long-vowel/short-consonant and
short-vowel/long-consonant structures in reviewed stressed syllables.
**Response/template.** Audio-word match, quantity diagram, or spelling choice.
**Derivation.** lexical segment length and stress.
**Difficulty.** L1 clear minimal pair; L2 multi-syllable; L3 cluster/exception;
L4 profile comparison.
**Distractors.** orthographic letter count alone.
**Validation.** Quantity annotations/audio.

### Family `double_consonant_spelling`

**Task/purpose.** Use consonant doubling as part of a known word/morpheme and
relate it to preceding vowel quantity.
**Response/template.** Letter completion or error repair.
**Derivation.** lexical spelling, stress, morphology.
**Difficulty.** L1 intervocalic pair; L2 inflection; L3 multi-consonant
constraint; L4 compound boundary.
**Distractors.** double every consonant after a short vowel.
**Validation.** Lexicon/morphology and sound mapping.

### Family `sj_sound_spelling`

**Task/purpose.** Recognize reviewed spellings and profile realizations of the
`sj` sound in known words.
**Response/template.** Audio/text match, spelling choice with lexical cue, or
profile comparison.
**Derivation.** lexeme/grapheme/profile pronunciation.
**Difficulty.** L1 frequent `sj/skj/stj`; L2 `sk` before front vowel; L3 loans/
less common spellings; L4 regional audio.
**Constraints.** No universal articulatory target.
**Validation.** Lexical/audio registry.

### Family `tj_j_sound_spelling`

**Task/purpose.** Match common `tj` and `j` sounds to reviewed spellings and
lexemes.
**Response/template.** Audio-word match or contextual completion.
**Derivation.** lexeme, grapheme, profile.
**Difficulty.** L1 `j/tj`; L2 `k` before front vowel and `dj/g/hj/lj`; L3
loans; L4 mixed dictation.
**Distractors.** one sound–one spelling.
**Validation.** Lexical pronunciation registry.

### Family `g_k_sk_front_vowel`

**Task/purpose.** Predict/recognize hard versus softened native pronunciations
of `g/k/sk` before reviewed vowel environments.
**Response/template.** Sound choice, grapheme highlighting, or audio match.
**Derivation.** following vowel, morpheme boundary, lexeme, profile.
**Difficulty.** L1 common native items; L2 inflection; L3 compounds; L4
reviewed loans/exceptions.
**Distractors.** front vowel always changes every lexeme.
**Validation.** Lexical/environment oracle.

### Family `ng_sound_environment`

**Task/purpose.** Recognize/spell reviewed `ng`, `nk`, and `gn` sequences and
their sound structures.
**Response/template.** Audio/text match or environment classification.
**Derivation.** grapheme sequence, syllable/morpheme boundary, lexeme.
**Difficulty.** L1 `ng`; L2 `nk`; L3 `gn` boundary contrasts; L4 compounds.
**Distractors.** pronounce every written `g` independently.
**Validation.** Lexeme/morpheme/audio registry.

### Family `r_retroflex_profile`

**Task/purpose.** Recognize reviewed `r` and `r + dental` realizations across
regional standard profiles.
**Response/template.** Audio/text alignment, sequence classification, or
profile-aware matching.
**Derivation.** segment sequence, word boundary, profile.
**Difficulty.** L2 clear central/northern retroflex; L3 southern/Finland
contrast; L4 connected phrase.
**Constraints.** Receptive first; no ranking or automated production score.
**Validation.** Matched human audio/profile review.

### Family `word_stress`

**Task/purpose.** Locate primary stress in reviewed simple and borrowed words.
**Response/template.** Syllable selection, audio match, or learner stress mark.
**Derivation.** stored lexeme/form stress.
**Difficulty.** L1 native initial stress; L2 compounds/affixes; L3 loans/
minimal contrasts; L4 profile/audio.
**Distractors.** always first syllable.
**Validation.** Lexical stress registry.

### Family `compound_stress_structure`

**Task/purpose.** Segment a compound and recognize primary/secondary prominence
without treating it as two unrelated phrases.
**Response/template.** Constituent brackets, audio alignment, or compound
choice.
**Derivation.** lexical compound tree and profile prosody.
**Difficulty.** L2 two transparent constituents; L3 linking/meaning ambiguity;
L4 longer compound.
**Distractors.** one independent main stress per written part.
**Validation.** Compound tree/audio review.

### Family `pitch_accent_recognition`

**Task/purpose.** Recognize a bounded set of lexical accent-1/accent-2 contrasts
where the active receptive profile realizes them.
**Response/template.** Audio-word/meaning match or profile classification.
**Derivation.** lexeme/form accent class and profile contour.
**Difficulty.** L3 clear same-speaker pair; L4 inflection/other regional
profile.
**Constraints.** No text-only guessing, accent-production score, or claim of
universality.
**Validation.** Matched human recordings and specialist review.

### Family `inflection_sound_spelling`

**Task/purpose.** Preserve or update stress, quantity, consonant doubling, and
sound realization across reviewed inflected forms.
**Response/template.** Form completion or audio-paradigm matching.
**Derivation.** stored paradigm spelling/pronunciation.
**Difficulty.** L2 noun definite/plural; L3 adjective/verb alternation; L4
irregular.
**Distractors.** keep surface sound or spelling pattern mechanically.
**Validation.** Exhaustive shipped forms/audio subset.

### Family `compound_boundary_meaning`

**Task/purpose.** Decide whether reviewed constituents form one compound or a
syntactic phrase and interpret the resulting meaning.
**Response/template.** Boundary insertion, meaning choice, or error repair.
**Derivation.** semantic relation and lexical/syntactic construction.
**Difficulty.** L1 familiar compound; L2 adjective+noun phrase contrast; L3
meaning-changing minimal boundary; L4 coordination/hyphen.
**Distractors.** interface-language spacing or spellchecker intuition.
**Validation.** Compound/phrase parse.

### Family `capitalization_convention`

**Task/purpose.** Apply capitalization to sentence starts, names, institutions,
weekdays, months, languages, and nationality words in reviewed contexts.
**Response/template.** Case repair or form choice.
**Derivation.** entity type and editorial policy.
**Difficulty.** L1 sentence/name; L2 weekday/month/language; L3 institution/
title; L4 heading.
**Distractors.** English/German capitalization transfer.
**Validation.** Named-entity/editorial annotations.

### Family `punctuation_dialogue`

**Task/purpose.** Interpret/insert basic sentence, question, comma, colon, and
dialogue punctuation under a declared writing profile.
**Response/template.** Punctuation choice or short-text repair.
**Derivation.** clause/speech-act/quotation structure.
**Difficulty.** L1 period/question; L2 list; L3 direct speech; L4 subordinate
boundary where punctuation is licensed.
**Validation.** Source syntax and editorial policy.

### Family `audio_spelling_dictation`

**Task/purpose.** Write a reviewed word/phrase from audio and enough context to
determine spelling and compound boundaries.
**Response/template.** Short text or named fields.
**Derivation.** licensed recording, transcript, lexical/semantic cue.
**Difficulty.** L1 familiar word; L2 quantity contrast; L3 `sj/tj/j` spelling
resolved by context; L4 normal-rate phrase.
**Constraints.** Reject underdetermined audio-only spelling.
**Validation.** Transcript/audio/manual review.

### Family `sound_spelling_audit`

**Task/purpose.** Find one letter, quantity, sound, stress, compound boundary,
capitalization, or punctuation mismatch.
**Response/template.** Span selection plus correction.
**Derivation.** One typed mutation in a valid item.
**Difficulty.** L2 word; L3 phrase; L4 audio/text/profile evidence.
**Distractors.** Declared regional/orthographic variants.
**Validation.** One root fault; correction restores source.

### Cross-family progression

Teach `å/ä/ö`, vowel qualities, and stressed quantity before speed or free
dictation. Add `sj/tj/j/ng` as lexical families, not spelling chants. Introduce
pitch accent only through matched audio after stress/quantity. Teach compounds
through meaning and structure, then reuse them inside noun/verb morphology.

## 3. Category: Vocabulary, noun phrases, definiteness, and agreement

### Category purpose

Train useful lexical retrieval and construct noun phrases from gender, number,
reference, definiteness, adjective agreement, possession, quantification,
preposition choice, and practical quantities.

### Learn-card content

- Learn a noun with gender and principal forms: `en bil – bilen – bilar –
  bilarna`; `ett hus – huset – hus – husen`.
- Swedish has common gender (`en`) and neuter (`ett`). Gender helps select the
  indefinite article and adjective/pronoun agreement but does not uniquely
  predict plural.
- Definiteness is often a suffix: `bil-en`. An adjective-modified definite
  phrase normally has double marking: `den röd-a bil-en`.
- A possessive or genitive changes the pattern: `min röda bil`, `Annas röda
  bil`, not the ordinary double-definite form.
- Attributive adjectives commonly have common, neuter, and plural/definite
  forms: `en stor bil`, `ett stort hus`, `stora bilar`, `den stora bilen`.
- Choose `i/på/till/från/hos` and other prepositions from the intended relation
  and lexical frame, not one translated word.

### Prerequisites

Category 2 alphabet, word stress, and basic compound recognition.

### Category boundaries

This category owns noun/reference morphology, adjective/determiner agreement,
prepositions, and quantities. Personal/reflexive pronoun reference belongs to
Category 5. Verb-particle/preposition frames belong to Category 4.

### Common misconceptions

- Guessing `en/ett` reliably from meaning or spelling.
- Treating `ett` nouns as one plural class and `en` nouns as another.
- Adding only a preposed article for definiteness and omitting the noun suffix.
- Using double definiteness after possessives/genitives.
- Leaving adjectives in the common singular form for neuter or plural nouns.
- Treating every bare noun as indefinite singular.
- Translating `i/på/till` one word at a time.
- Splitting a lexical compound into a determiner plus noun phrase.

### Family `contextual_lexeme_choice`

**Task/purpose.** Choose a reviewed noun/adjective/adverb for a pictured or
sentential meaning. **Response/template.** Single-choice, matching, or bounded
completion. **Derivation.** Semantic frame, sense, domain, register.
**Difficulty.** L1 concrete contrast; L2 related senses; L3 collocation; L4
profile/register.
**Distractors.** Same topic but wrong sense/selection.
**Validation.** Sense annotations and entailment.

### Family `collocation_phrase_choice`

**Task/purpose.** Retrieve common combinations with their construction rather
than translate each word.
**Response/template.** Completion, ordered chunks, or matching.
**Derivation.** Reviewed collocation with inflectable slots.
**Difficulty.** L1 fixed phrase; L2 variable noun; L3 preposition/particle
contrast; L4 register.
**Distractors.** Literal calques and semantically related non-collocations.
**Validation.** Authored collocation registry.

### Family `noun_en_ett_gender`

**Task/purpose.** Retrieve a known noun's common/neuter gender through `en/ett`
and agreement cues.
**Response/template.** Article choice or paired production.
**Derivation.** Lexical gender.
**Difficulty.** L1 frequent concrete nouns; L2 similar endings; L3 compounds/
semantic classes; L4 less predictable/variable reviewed lexemes.
**Distractors.** suffix or interface-language gender alone.
**Validation.** Lexicon and balanced genders.

### Family `noun_indefinite_plural`

**Task/purpose.** Produce/recognize a noun's indefinite plural with stress and
spelling.
**Response/template.** Transformation, matching, or short text.
**Derivation.** stored paradigm cell.
**Difficulty.** L1 `-or/-ar`; L2 `-er/-n`; L3 zero plural/stem change; L4
irregular/variable form.
**Distractors.** choose plural solely from gender or final letter.
**Validation.** Exhaustive shipped paradigms.

### Family `noun_definite_singular`

**Task/purpose.** Produce/interpret the suffixed definite singular form.
**Response/template.** Transformation, completion, or reference match.
**Derivation.** lexical gender, stem, stored definite form, reference.
**Difficulty.** L1 transparent `-en/-et`; L2 vowel-final; L3 stem/spelling
change; L4 variable form.
**Distractors.** free article only or interface-language word order.
**Validation.** Paradigm and reference state.

### Family `noun_definite_plural`

**Task/purpose.** Produce/interpret definite plural forms.
**Response/template.** Form input or paradigm match.
**Derivation.** stored plural and definite-plural cell.
**Difficulty.** L2 regular `-na`; L3 zero/`-en` patterns; L4 irregular.
**Distractors.** add one suffix to citation form.
**Validation.** Exhaustive paradigm cells.

### Family `noun_principal_forms`

**Task/purpose.** Associate a noun with the principal forms needed to retrieve
its paradigm.
**Response/template.** Matching or missing-form set.
**Derivation.** lexeme registry.
**Difficulty.** L2 article+plural; L3 definite/plural interaction; L4 variable/
irregular.
**Constraints.** Class labels never override lexical forms.
**Validation.** Full paradigm registry.

### Family `reference_definiteness_choice`

**Task/purpose.** Choose indefinite, definite, bare, or possessive reference
from discourse status, countability, genericity, and construction.
**Response/template.** Determination choice or phrase completion.
**Derivation.** discourse referent model.
**Difficulty.** L1 introduce versus known; L2 mass/generic; L3 institutional/
body-part/possessive patterns; L4 contrastive reference.
**Distractors.** copy interface-language article mechanically.
**Validation.** Authored reference/entailment model.

### Family `indefinite_article_noun`

**Task/purpose.** Construct an indefinite singular noun phrase with the correct
`en/ett` article or licensed zero.
**Response/template.** Article/form choice.
**Derivation.** countability, reference, gender, construction.
**Difficulty.** L1 count noun; L2 profession/category; L3 mass/abstract; L4
fixed construction.
**Distractors.** article before every singular noun.
**Validation.** Determination and gender engine.

### Family `double_definiteness`

**Task/purpose.** Build adjective-modified definite noun phrases with
pre-determiner, definite/weak adjective, and suffixed noun.
**Response/template.** Ordered chunks or named forms.
**Derivation.** definite reference, noun features, adjective class.
**Difficulty.** L2 `den/det`; L3 plural `de`; L4 demonstrative/complex modifier
contrast.
**Distractors.** omit one definiteness marker or use indefinite adjective.
**Validation.** Construction feature unification.

### Family `possessive_determination`

**Task/purpose.** Build possessive noun phrases without inappropriate article/
definite suffix and with correct adjective form.
**Response/template.** Phrase construction or error repair.
**Derivation.** possessor, noun gender/number, modifier.
**Difficulty.** L1 `min/mitt`; L2 plural; L3 adjective; L4 reflexive possessor
integrated later.
**Distractors.** `min bilen`, ordinary double definiteness.
**Validation.** Possessive construction.

### Family `genitive_s_possession`

**Task/purpose.** Form/interpret reviewed `-s` genitives and attach the marker
to the correct possessor phrase boundary.
**Response/template.** Boundary/form choice or phrase transformation.
**Derivation.** possessor constituent and possessed phrase.
**Difficulty.** L2 simple name/noun; L3 multiword possessor; L4 names ending in
`s/x/z` under declared editorial policy.
**Distractors.** apostrophe from English or `-s` on each word.
**Validation.** Possessor phrase tree and spelling policy.

### Family `adjective_indefinite_agreement`

**Task/purpose.** Inflect an attributive adjective for indefinite common,
neuter, or plural noun phrases.
**Response/template.** Form input, matching, or agreement repair.
**Derivation.** noun gender/number and adjective class.
**Difficulty.** L1 regular common/neuter; L2 plural; L3 spelling/stem
alternation; L4 invariant/irregular.
**Distractors.** common form everywhere.
**Validation.** Agreement links and full paradigms.

### Family `adjective_definite_form`

**Task/purpose.** Select the definite/weak adjective form in definite,
demonstrative, possessive, and genitive noun phrases.
**Response/template.** Form choice or phrase completion.
**Derivation.** determination construction, number, adjective class.
**Difficulty.** L2 regular `-a`; L3 lexical `lilla/lille` and human masculine
only where profile/context licenses; L4 multiple modifiers.
**Distractors.** choose by noun gender alone.
**Validation.** Determination-to-adjective agreement.

### Family `adjective_predicative_agreement`

**Task/purpose.** Make predicative adjectives agree with subject gender/number.
**Response/template.** Form input or sentence completion.
**Derivation.** predication relation and controller.
**Difficulty.** L1 common/neuter; L2 plural; L3 coordinated subjects; L4
collective/semantic agreement only when reviewed.
**Distractors.** definite `-a` or invariant citation form.
**Validation.** Predicate-controller graph.

### Family `possessive_pronoun_agreement`

**Task/purpose.** Select `min/mitt/mina`, `din/ditt/dina`, and other reviewed
possessive forms from possessed noun features.
**Response/template.** Form choice or referent/phrase matching.
**Derivation.** possessor person and possessed gender/number.
**Difficulty.** L1 first/second person; L2 plural possessors/invariant forms; L3
competing referents; L4 `sin` contrast in Category 5.
**Distractors.** agree with possessor.
**Validation.** Possession/agreement graph.

### Family `demonstrative_noun_phrase`

**Task/purpose.** Select and construct reviewed `den här/det här/de här`,
`den där`, and `denna/detta/dessa` patterns with their distinct noun forms.
**Response/template.** Phrase choice or ordered chunks.
**Derivation.** deixis, noun features, profile/register, determination pattern.
**Difficulty.** L2 proximal; L3 distal/formal; L4 contrast across profiles.
**Distractors.** mix preposed and suffixed patterns.
**Validation.** Deictic state and construction registry.

### Family `quantifier_noun_form`

**Task/purpose.** Choose common quantity/indefinite words and the licensed noun
number/definiteness.
**Response/template.** Quantifier/form choice.
**Derivation.** exact/approximate quantity, countability, polarity, reference.
**Difficulty.** L1 `många/mycket`; L2 `några/lite/få`; L3 `varje/alla/hela`;
L4 scope.
**Distractors.** count/mass swap or definite noun copied universally.
**Validation.** Quantity/reference model.

### Family `personal_pronoun_subject_object`

**Task/purpose.** Select subject/object forms such as `jag/mig`, `hon/henne`,
`de/dem` from event role and medium.
**Response/template.** Form choice, transformation, or referent match.
**Derivation.** participant role/features and written/spoken profile.
**Difficulty.** L1 singular; L2 plural; L3 `de/dem` versus receptive `dom`; L4
coordination.
**Distractors.** word position or spoken spelling in neutral writing.
**Validation.** Role and profile registry.

### Family `preposition_relation_choice`

**Task/purpose.** Select a common preposition for location, destination, source,
time, accompaniment, means, possession, or institution.
**Response/template.** Preposition choice, scene matching, or completion.
**Derivation.** semantic relation, place/verb lexical frame.
**Difficulty.** L1 `i/på/till/från`; L2 time; L3 `hos/med/av/för`; L4
metaphorical/lexical frame.
**Distractors.** one interface-language gloss.
**Validation.** Relation-to-frame registry.

### Family `spatial_preposition_path`

**Task/purpose.** Coordinate location, destination, source, direction, and route
expressions in a small spatial scene.
**Response/template.** Route diagram, ordered phrases, or choice.
**Derivation.** spatial/path graph and place lexical profile.
**Difficulty.** L1 static/destination; L2 source; L3 `in/ut/hem` directional
adverbs; L4 several landmarks.
**Distractors.** static form for motion or inverse source.
**Validation.** Spatial graph.

### Family `compound_head_gender`

**Task/purpose.** Infer a transparent compound's gender/plural/reference from
its reviewed head while preserving lexical exceptions.
**Response/template.** Article/form choice or compound tree.
**Derivation.** compound structure and head lexeme.
**Difficulty.** L2 transparent right-headed; L3 linking element; L4 reviewed
lexical exception.
**Distractors.** gender of first constituent.
**Validation.** Compound lexicon/tree.

### Family `number_cardinal_noun`

**Task/purpose.** Interpret/produce cardinals and noun number in practical
counts, including `en/ett` forms where relevant.
**Response/template.** Numeric input, phrase, or named fields.
**Derivation.** exact integer, noun gender/countability.
**Difficulty.** L1 0–20; L2 tens/hundreds; L3 thousands/decimals; L4 mixed
measure.
**Validation.** Independent numeric grammar.

### Family `ordinal_date_time_price`

**Task/purpose.** Interpret/produce ordinals, dates, clock expressions, ages,
prices, and measurements.
**Response/template.** Numeric input, named fields, or short phrase.
**Derivation.** exact calendar/time/quantity object and profile conventions.
**Difficulty.** L1 price/hour; L2 `halv tre`, dates; L3 quarter/relative time;
L4 itinerary/receipt.
**Constraints.** Valid dates; fictional values.
**Validation.** Independent calendar/arithmetic oracle.

### Family `noun_phrase_construction`

**Task/purpose.** Build a complete noun phrase from reference and feature cards.
**Response/template.** Ordered chunks or multiple named fields.
**Derivation.** gender, number, definiteness, adjective, demonstrative/
possessive/genitive, quantity.
**Difficulty.** L1 article+noun; L2 adjective; L3 double definiteness/
possessive; L4 multiple modifiers.
**Distractors.** locally valid but globally incompatible forms.
**Validation.** Feature unification/back-parse.

### Family `nominal_agreement_audit`

**Task/purpose.** Locate one gender, plural, definiteness, adjective, possessive,
compound, preposition, or quantity error.
**Response/template.** Fault selection and repair.
**Derivation.** One mutation in a valid phrase/sentence.
**Difficulty.** L2 local; L3 double marking; L4 distant/reference-sensitive.
**Validation.** Exactly one root fault; repair restores source.

### Cross-family progression

Teach every noun with `en/ett`, plural, and definite singular. Introduce
reference before suffix manipulation. Add adjective indefinite agreement, then
definite form and double definiteness; contrast possessive/genitive patterns
immediately. Quantities and prepositions reuse the same noun-phrase engine.

## 4. Category: Verbs, time, particles, complements, and voice

### Category purpose

Train retrieval of verb principal forms and selection of tense, perfect,
future/modal, infinitive, particle/reflexive construction, complement frame,
and active/passive voice from an intended event.

### Learn-card content

- Swedish verbs do not change with subject person or number: `jag kommer`, `de
  kommer`.
- Learn principal forms: `skriva – skriver – skrev – skrivit`; they are more
  reliable than guessing a past form.
- Perfect uses `har + supine`: `har skrivit`. The supine is not the same job as
  an agreeing past participle.
- Future meanings use present tense, `ska`, `kommer att`, or other constructions
  depending on plan, prediction, schedule, and context.
- Modal verbs normally take a bare infinitive: `kan komma`; many other verbs
  take `att`: `planerar att komma`, with lexical/usage variation stored.
- Particle verbs such as `tycka om` and `hälsa på` are lexical units. Particle
  stress and position distinguish them from some prepositional phrases.
- Passive meanings can use `-s`, `bli + participle`, or other constructions;
  choose from event viewpoint and register.

### Prerequisites

Category 2 stress/word structure and Category 3 subject/noun-phrase features.

### Category boundaries

This category owns verb forms, event time, particle/complement frames, and
voice. Main/subordinate clause placement and negation belong to Category 5.
Discourse-wide sequencing belongs to Category 6.

### Common misconceptions

- Conjugating the verb differently for `jag` and `de`.
- Forming every preterite with `-de` or every supine with `-t`.
- Using the infinitive where the supine is required after `har`.
- Treating preterite and perfect as interchangeable completed-past forms.
- Using `att` after every modal or omitting it after every other verb.
- Translating a particle and verb separately.
- Treating `ska` as a neutral future marker in every context.
- Converting every active clause to passive by adding `-s`.

### Family `verb_principal_forms`

**Task/purpose.** Associate a verb sense with infinitive, present, preterite,
supine, and imperative principal forms.
**Response/template.** Matching, missing form, or set selection.
**Derivation.** Sense-specific lexeme registry.
**Difficulty.** L1 group 1; L2 groups 2/3; L3 strong/irregular; L4 particle/
reflexive sense.
**Distractors.** productive-looking unattested forms.
**Validation.** Exhaustive shipped paradigms.

### Family `present_regular_form`

**Task/purpose.** Produce/recognize present forms of common regular verbs.
**Response/template.** Form input or sentence completion.
**Derivation.** verb class, stem, spelling.
**Difficulty.** L1 `-ar`; L2 `-er/-r`; L3 spelling alternation; L4 mixed class.
**Distractors.** subject agreement ending.
**Validation.** Paradigm registry.

### Family `present_subject_invariance`

**Task/purpose.** Hold one finite form constant while changing subject person/
number and identify the true agreement relations elsewhere.
**Response/template.** Form choice, transformation, or audit.
**Derivation.** same event/tense with varied subject.
**Difficulty.** L1 pronoun swap; L2 coordinated NP; L3 inversion; L4
predicative adjective contrast.
**Distractors.** imported person/number conjugation.
**Validation.** Feature identity.

### Family `preterite_regular_form`

**Task/purpose.** Form common weak preterites with correct suffix and spelling.
**Response/template.** Form input or completion.
**Derivation.** verb group and stem phonology/spelling.
**Difficulty.** L1 `-ade`; L2 `-de/-te`; L3 group 3; L4 spelling alternation.
**Distractors.** one past suffix.
**Validation.** Exhaustive shipped forms.

### Family `strong_irregular_preterite`

**Task/purpose.** Retrieve high-frequency strong/irregular preterite forms.
**Response/template.** Matching, form input, or sentence completion.
**Derivation.** stored principal form.
**Difficulty.** L2 frequent pair; L3 vowel alternation; L4 confusable verb
family.
**Distractors.** regularized or wrong ablaut form.
**Validation.** Lexical registry.

### Family `supine_form`

**Task/purpose.** Produce/recognize the supine used after `har/hade`.
**Response/template.** Form input or paradigm match.
**Derivation.** stored principal form.
**Difficulty.** L2 regular; L3 strong/irregular; L4 particle/reflexive.
**Distractors.** infinitive, preterite, or agreeing participle.
**Validation.** Exhaustive forms.

### Family `perfect_auxiliary_supine`

**Task/purpose.** Construct present perfect/pluperfect with finite `har/hade`
and invariant supine.
**Response/template.** Ordered chunks or completion.
**Derivation.** reference time, subject, verb principal form.
**Difficulty.** L2 present perfect; L3 pluperfect; L4 particle/negation order
integrated later.
**Distractors.** participle agreement or `är +` supine.
**Validation.** Construction grammar.

### Family `preterite_perfect_choice`

**Task/purpose.** Choose preterite or perfect from definite past time,
current relevance, life experience, open/closed time frame, and discourse.
**Response/template.** Form choice, timeline, or sentence completion.
**Derivation.** event/reference-time model.
**Difficulty.** L2 explicit finished time versus result now; L3 experience/
open period; L4 discourse framing.
**Distractors.** “completed means perfect” or English form matching.
**Validation.** Human-reviewed event model.

### Family `pluperfect_sequence`

**Task/purpose.** Relate an event completed before a past reference event using
`hade + supine`.
**Response/template.** Timeline ordering or form completion.
**Derivation.** two-event temporal graph.
**Difficulty.** L3 explicit `innan`; L4 inferred prior event/negation.
**Distractors.** simple preterite for both despite required ordering.
**Validation.** Interval oracle.

### Family `future_construction_choice`

**Task/purpose.** Choose present, `ska`, `kommer att`, or a reviewed future
expression from schedule, intention/plan, prediction, and context.
**Response/template.** Construction choice or sentence completion.
**Derivation.** future event, evidence, agency/intention, timetable.
**Difficulty.** L2 clear plan/schedule; L3 prediction; L4 overlapping readings
with decisive context.
**Distractors.** `ska` for every future.
**Validation.** Authored modal/future frame.

### Family `modal_bare_infinitive`

**Task/purpose.** Combine common modal verbs with the correct bare infinitive
and interpret modality.
**Response/template.** `att`/zero choice, verb form, or meaning match.
**Derivation.** ability, permission, obligation, volition, likelihood.
**Difficulty.** L1 `kan/vill`; L2 `måste/får/bör`; L3 past modal; L4 scope.
**Distractors.** insert `att`, use finite complement.
**Validation.** Modal construction registry.

### Family `att_infinitive_complement`

**Task/purpose.** Use/omit infinitive marker `att` according to a reviewed
matrix verb or construction.
**Response/template.** Marker choice or ordered chunks.
**Derivation.** sense-specific complement frame.
**Difficulty.** L2 common `planera/lova`; L3 `börja/försöka`,
perception/causative contrasts, and reviewed optionality; L4 variation with
profile/register.
**Distractors.** universal marker rule.
**Validation.** Complement-frame registry.

### Family `imperative_form`

**Task/purpose.** Produce singular/general imperative forms and polite/
inclusive alternatives from a reviewed speech act.
**Response/template.** Form input or instruction completion.
**Derivation.** stored imperative and request context.
**Difficulty.** L1 group 1; L2 other groups; L3 irregular/particle; L4 softened
request.
**Distractors.** infinitive/present form mechanically.
**Validation.** Paradigm and speech act.

### Family `reflexive_verb_construction`

**Task/purpose.** Retrieve and interpret reviewed verbs with `sig`, reciprocal
pronouns, or lexical reflexive frames.
**Response/template.** Pronoun/form choice or participant diagram.
**Derivation.** lexeme sense, subject features, event roles.
**Difficulty.** L2 transparent self-action; L3 lexical reflexive/reciprocal; L4
competing referents.
**Distractors.** any transitive verb + `sig`, object form copied from English.
**Validation.** Sense-specific event graph.

### Family `particle_verb_identity`

**Task/purpose.** Distinguish a lexical particle verb from a verb plus ordinary
prepositional/adverbial phrase using meaning, stress, and structure.
**Response/template.** Classification, audio/meaning match, or parse choice.
**Derivation.** sense-specific particle frame and prosody.
**Difficulty.** L2 clear particle; L3 same words/different structure; L4
profile audio.
**Distractors.** any following short word is particle.
**Validation.** Lexical parse/audio registry.

### Family `particle_verb_meaning`

**Task/purpose.** Retrieve the whole meaning and required arguments of a
reviewed particle verb.
**Response/template.** Meaning choice, completion, or event matching.
**Derivation.** lexical particle-verb sense.
**Difficulty.** L1 transparent directional; L2 idiomatic frequent; L3
polysemous; L4 register.
**Distractors.** compositional word-for-word gloss.
**Validation.** Sense/valency registry.

### Family `particle_placement`

**Task/purpose.** Place particles relative to finite/nonfinite verbs, objects,
pronouns, and sentence adverbs in licensed clause schemas.
**Response/template.** Ordering or error repair.
**Derivation.** particle structure, clause type, verb chain, object weight/
pronoun.
**Difficulty.** L2 simple main clause; L3 perfect/modal; L4 subordinate/
passive.
**Distractors.** keep written dictionary adjacency universally.
**Validation.** Clause/particle grammar.

### Family `verb_preposition_government`

**Task/purpose.** Select a lexical preposition and complement for a reviewed
verb/adjective sense.
**Response/template.** Preposition choice or clause completion.
**Derivation.** sense-specific government.
**Difficulty.** L2 frequent frame; L3 same verb different preposition/meaning;
L4 particle-versus-preposition contrast.
**Distractors.** interface-language calque.
**Validation.** Valency registry.

### Family `phrasal_complement_choice`

**Task/purpose.** Choose among finite clause, `att`-infinitive, noun phrase,
  prepositional complement, and particle construction for a reviewed predicate.
**Response/template.** Frame selection or sentence assembly.
**Derivation.** matrix sense and semantic argument type.
**Difficulty.** L2 one contrast; L3 same lemma multiple frames; L4 reference/
control.
**Distractors.** semantically plausible unlicensed frame.
**Validation.** Typed complement grammar.

### Family `s_passive_form`

**Task/purpose.** Produce/recognize common `-s` passive finite/nonfinite forms
and recover event roles.
**Response/template.** Form input, role diagram, or active/passive match.
**Derivation.** active principal form, passive paradigm, event frame.
**Difficulty.** L2 present; L3 preterite/infinitive; L4 deponent/lexical `-s`
excluded or contrasted.
**Distractors.** append `s` to any visible form without spelling change.
**Validation.** Stored passive forms and role graph.

### Family `bli_participle_passive`

**Task/purpose.** Construct/interpret eventive `bli +` past participle passives
with required agreement where taught.
**Response/template.** Form choice or event-state matching.
**Derivation.** patient features, time, eventive/result state.
**Difficulty.** L3 common participles; L4 contrast with `-s`/state/result.
**Constraints.** Reviewed participle subset.
**Validation.** Event/agreement model.

### Family `passive_construction_choice`

**Task/purpose.** Choose active, `-s` passive, or `bli` passive from agent
salience, event viewpoint, genre, and lexical licensing.
**Response/template.** Construction/meaning choice.
**Derivation.** event roles, information structure, register.
**Difficulty.** L3 neutral event; L4 process/result/official register.
**Distractors.** all passives interchangeable.
**Validation.** Human-reviewed construction profiles.

### Family `present_past_participle`

**Task/purpose.** Recognize and use a bounded set of participles as modifiers
or predicates with appropriate meaning/agreement.
**Response/template.** Form/meaning choice or phrase completion.
**Derivation.** verb sense, voice/time relation, noun features.
**Difficulty.** L3 lexicalized/common forms; L4 productive reviewed pair.
**Constraints.** No unrestricted participle generator.
**Validation.** Participle lexicon/agreement.

### Family `verb_chain_order`

**Task/purpose.** Assemble finite auxiliary/modal plus infinitive/supine,
particle, reflexive pronoun, and complements.
**Response/template.** Ordered chunks or named slots.
**Derivation.** typed verb-chain grammar.
**Difficulty.** L2 one auxiliary; L3 modal+particle; L4 perfect/passive/
subordinate.
**Distractors.** individually valid forms in incompatible slots.
**Validation.** Back-parse feature identity.

### Family `event_tense_construction`

**Task/purpose.** Select and realize a complete predicate from time, temporal
relation, completion/relevance, modality, voice, and lexical frame.
**Response/template.** Multiple named fields or sentence completion.
**Derivation.** event/world model.
**Difficulty.** L2 present/past; L3 perfect/future; L4 passive/modal/particle.
**Validation.** Event-to-surface round-trip.

### Family `verb_tense_particle_audit`

**Task/purpose.** Locate one principal-form, tense, supine, auxiliary, `att`,
particle, preposition, reflexive, or passive error.
**Response/template.** Fault selection and repair.
**Derivation.** One typed mutation in a valid predicate.
**Difficulty.** L2 local; L3 tense/frame; L4 chain/voice.
**Validation.** Exactly one root fault; repair restores event.

### Cross-family progression

Teach present and principal forms without subject agreement. Add preterite,
supine, and perfect separately before contrasting preterite/perfect. Introduce
future constructions by communicative meaning. Treat particles and lexical
prepositions as sense-specific frames, then place them in increasingly complex
verb chains. Add passive only after active event roles are secure.

## 5. Category: Pronouns, V2, negation, questions, and sentence structure

### Category purpose

Train reference and the Swedish clause field: subjects/objects, V2 and
inversion, sentence-adverb placement, subordinate order, questions, negation,
relative clauses, and presentational/dummy `det`.

### Learn-card content

- In a main statement the finite verb occupies the second constituent:
  `Jag kommer i dag`; `I dag kommer jag`. A multiword first constituent still
  counts as one field.
- In a neutral main clause, `inte` follows the finite verb and usually the
  subject: `Jag kommer inte`; `I dag kommer jag inte`.
- In a subordinate clause, the subject normally comes before sentence adverbs
  and the finite verb: `... eftersom jag inte kommer`.
- Yes/no questions begin with the finite verb. Wh-questions use different order
  depending on whether the wh-word itself is subject.
- `sin/sitt/sina` normally refers to the clause subject and agrees with the
  possessed noun; `hans/hennes/deras` refer differently.
- `det` may refer to a neuter thing, fill a weather/extraposition subject slot,
  or introduce a new referent with `det finns/kommer`.

### Prerequisites

Category 3 noun/pronoun agreement and Category 4 finite/nonfinite verb forms.

### Category boundaries

This category owns reference, clause type, field order, negation, questions,
relatives, and presentational syntax. Particle identity/complements belong to
Category 4; relations across several clauses/turns belong to Category 6.

### Common misconceptions

- Counting the finite verb as the second written word rather than constituent.
- Keeping subject–verb order after any non-subject first constituent.
- Placing `inte` in the same slot in main and subordinate clauses.
- Using question inversion inside every embedded question.
- Treating the wh-word as a non-subject in every question.
- Choosing `de/dem` from word position instead of grammatical role.
- Using `sin` for any salient possessor or making it agree with the possessor.
- Treating every `det` as a pronoun referring to a previous neuter noun.

### Family `subject_object_pronoun_role`

**Task/purpose.** Select personal-pronoun case forms from event role under
neutral or inverted order.
**Response/template.** Form choice, referent matching, or transformation.
**Derivation.** event role, person/number/gender, medium profile.
**Difficulty.** L1 `jag/mig`; L2 third/plural; L3 inversion; L4 coordination.
**Distractors.** first position means subject.
**Validation.** Role/reference graph.

### Family `de_dem_dom_profile`

**Task/purpose.** Distinguish neutral written `de/dem` by role and receptive/
informal `dom` by medium profile.
**Response/template.** Form choice, profile classification, or rewrite.
**Derivation.** grammatical role and editorial/spoken profile.
**Difficulty.** L2 clear subject/object; L3 inversion/preposition; L4
coordination/accepted informal writing.
**Distractors.** sound alone selects `de/dem`.
**Validation.** Role and medium policy.

### Family `reflexive_object_sig`

**Task/purpose.** Resolve/use `sig` as a third-person subject-bound object in a
reviewed clause.
**Response/template.** Pronoun choice or antecedent match.
**Derivation.** clause subject, object role, person.
**Difficulty.** L2 one subject; L3 competing noun; L4 subordinate boundary.
**Distractors.** `sig` for first/second person or nearest noun.
**Validation.** Binding graph.

### Family `reflexive_possessive_sin`

**Task/purpose.** Choose and inflect `sin/sitt/sina` versus
`hans/hennes/deras` from possessor identity and possessed noun features.
**Response/template.** Form selection or referent matching.
**Derivation.** local subject, possessor, noun gender/number.
**Difficulty.** L2 same-subject; L3 other possessor; L4 embedded/ambiguous
context.
**Distractors.** agree with possessor or use reflexive across wrong clause.
**Validation.** Binding/agreement graph.

### Family `generic_man_reference`

**Task/purpose.** Interpret/produce generic `man` and track its object/
possessive forms in reviewed constructions.
**Response/template.** Meaning match, pronoun completion, or rewrite.
**Derivation.** generic-human quantification and reference chain.
**Difficulty.** L2 generic statement; L3 object/possessive continuation; L4
contrast with specific `mannen/de`.
**Distractors.** male individual reading or English `man`.
**Validation.** Quantifier/reference model.

### Family `main_clause_v2_subject_first`

**Task/purpose.** Place the finite verb in the second constituent of a neutral
subject-first main statement.
**Response/template.** Ordering or field labeling.
**Derivation.** main-clause schema and verb chain.
**Difficulty.** L1 simple verb; L2 auxiliary; L3 particle/object; L4 sentence
adverb.
**Distractors.** nonfinite verb in V2 slot.
**Validation.** Clause-field parse.

### Family `main_clause_inversion`

**Task/purpose.** Invert finite verb and subject after a non-subject first
constituent.
**Response/template.** Ordered chunks or sentence transformation.
**Derivation.** fronted time/place/object/adverbial and main-clause schema.
**Difficulty.** L1 time adverb; L2 multiword first field; L3 object/topic; L4
pronoun/particle chain.
**Distractors.** preserve SVO or count first phrase words.
**Validation.** Field schema.

### Family `first_constituent_identification`

**Task/purpose.** Identify which complete phrase occupies the prefield and
therefore where the finite verb belongs.
**Response/template.** Bracketing, field selection, or ordering.
**Derivation.** source constituency tree.
**Difficulty.** L2 PP/NP; L3 subordinate clause as first constituent; L4 nested
modifier.
**Distractors.** each orthographic word is a field.
**Validation.** Syntax tree.

### Family `main_clause_sentence_adverb`

**Task/purpose.** Place `inte` and reviewed sentence adverbs in a main clause
relative to finite verb, subject, nonfinite verb, and particle.
**Response/template.** Ordering or slot choice.
**Derivation.** main-clause field schema, subject type, verb chain.
**Difficulty.** L1 `jag kommer inte`; L2 inversion; L3 auxiliary; L4 several
adverb types.
**Distractors.** adverb immediately before lexical verb universally.
**Validation.** Slot grammar.

### Family `subordinate_clause_order`

**Task/purpose.** Order subordinator, subject, sentence adverb, finite verb,
nonfinite verb, particle, and complements in a subordinate clause.
**Response/template.** Ordering or field labeling.
**Derivation.** subordinate-clause schema.
**Difficulty.** L2 `att/eftersom`; L3 auxiliary/particle; L4 embedded subject/
multiple adverbs.
**Distractors.** main-clause V2 or English order.
**Validation.** Back-parse clause type.

### Family `main_subordinate_inte_contrast`

**Task/purpose.** Transform matched main/subordinate clauses while moving
`inte` to the licensed slot.
**Response/template.** Transformation or paired ordering.
**Derivation.** same proposition under two clause schemas.
**Difficulty.** L2 simple finite; L3 auxiliary; L4 particle/reflexive.
**Distractors.** move only subordinator and retain all order.
**Validation.** Semantic identity and schema.

### Family `coordinator_subordinator_choice`

**Task/purpose.** Distinguish coordination from subordination and apply the
correct following clause order.
**Response/template.** Connector/order pair or clause classification.
**Derivation.** discourse relation and connector class.
**Difficulty.** L2 `och/men` versus `att/eftersom`; L3 `så/för`; L4
context-dependent reviewed uses.
**Distractors.** all connector words trigger subordinate order.
**Validation.** Connector registry and parse.

### Family `yes_no_question_order`

**Task/purpose.** Form yes/no questions with finite verb first and the remaining
verb chain/adverbs in licensed order.
**Response/template.** Ordering or statement-to-question transformation.
**Derivation.** interrogative clause schema and focus.
**Difficulty.** L1 simple verb; L2 auxiliary/modal; L3 particle/negation; L4
pronoun object.
**Distractors.** add intonation only or front nonfinite verb.
**Validation.** Question parse.

### Family `wh_question_role_order`

**Task/purpose.** Select an interrogative and use subject-wh versus non-subject-
wh order correctly.
**Response/template.** Question word/form and ordered chunks.
**Derivation.** information gap and grammatical role.
**Difficulty.** L1 `vad/var/vem`; L2 time/manner; L3 subject versus object
`vem`; L4 preposition/particle.
**Distractors.** inversion after subject wh or no inversion after object wh.
**Validation.** Question-to-answer graph.

### Family `embedded_question_order`

**Task/purpose.** Form embedded wh/yes-no questions with subordinate order,
subject-gap `som`, and `om` where appropriate.
**Response/template.** Ordering, connector choice, or transformation.
**Derivation.** matrix predicate, gap type, embedded clause schema.
**Difficulty.** L3 wh embedded and `vem som kommer`; L4 `om` yes/no and
sentence adverb.
**Distractors.** retain direct-question inversion/punctuation.
**Validation.** Two-clause parse.

### Family `negation_choice_scope`

**Task/purpose.** Place `inte` or choose reviewed negative words so intended
predicate/constituent scope is clear.
**Response/template.** Scope brackets, word/order choice, or meaning match.
**Derivation.** logical form, clause type, contrastive focus.
**Difficulty.** L1 predicate; L2 infinitive/quantity; L3 constituent contrast;
L4 subordinate scope.
**Distractors.** any negative word yields same scope.
**Validation.** Scope tree.

### Family `ingen_inget_inga`

**Task/purpose.** Select and inflect `ingen/inget/inga` and contrast it with
`inte någon/något/några` in licensed contexts.
**Response/template.** Form/meaning choice or phrase completion.
**Derivation.** noun gender/number, polarity, scope, register.
**Difficulty.** L1 singular; L2 plural; L3 syntactic position; L4 contrastive
scope.
**Distractors.** invariant `ingen` or double negation copied from another
language.
**Validation.** Agreement and logical form.

### Family `relative_som_gap`

**Task/purpose.** Link an antecedent to a subject/object gap using invariant
`som` and recover the missing role.
**Response/template.** Clause completion, antecedent/gap match, or meaning.
**Derivation.** two-clause reference graph.
**Difficulty.** L2 subject; L3 object/optional omission only where licensed; L4
competing antecedents.
**Distractors.** inflect `som` by antecedent.
**Validation.** Antecedent-gap graph.

### Family `relative_preposition_vars`

**Task/purpose.** Form a bounded set of prepositional relatives and possessive
`vars` constructions in a declared register.
**Response/template.** Preposition/relative choice or clause completion.
**Derivation.** gap relation, antecedent, register.
**Difficulty.** L3 final preposition; L4 formal alternative/`vars`.
**Constraints.** Human-reviewed variants; no blanket ban on stranded
prepositions.
**Validation.** Gap/government/profile.

### Family `det_referential_dummy`

**Task/purpose.** Classify/use referential neuter `det`, weather/time dummy
`det`, extraposition dummy, and presentational `det`.
**Response/template.** Function choice, referent match, or clause completion.
**Derivation.** discourse referent and construction.
**Difficulty.** L1 referential/weather; L2 time; L3 extraposition; L4
presentational contrast.
**Distractors.** every `det` points to a neuter noun.
**Validation.** Typed dependency graph.

### Family `det_finns_existential`

**Task/purpose.** Build/interpret `det finns` existence/location clauses and
distinguish them from identification/possession.
**Response/template.** Construction choice or sentence completion.
**Derivation.** existence frame, new referent, location, time.
**Difficulty.** L1 present singular; L2 plural/negative; L3 past/future; L4
definiteness constraint with reviewed exceptions.
**Distractors.** literal “it” referent or `har` possession.
**Validation.** Existential/discourse model.

### Family `presentational_det_verb`

**Task/purpose.** Recognize/construct a bounded set of presentational
`det + verb + NP` clauses introducing a new referent.
**Response/template.** Meaning/order choice.
**Derivation.** event, postverbal new referent, information structure.
**Difficulty.** L3 common arrival/position verb; L4 subordinate/tense.
**Constraints.** Reviewed predicates only.
**Validation.** Presentational construction registry.

### Family `clause_construction`

**Task/purpose.** Build a complete main, subordinate, interrogative, negative,
relative, or existential clause from semantic/field cards.
**Response/template.** Ordered chunks or named slots.
**Derivation.** clause grammar, reference, tense, polarity, focus.
**Difficulty.** L1 main statement; L2 inversion/question; L3 subordinate/
relative; L4 particle/existential chain.
**Validation.** Back-parse and entailment.

### Family `word_order_reference_audit`

**Task/purpose.** Locate one pronoun, V2, inversion, sentence-adverb,
subordinate, question, relative, `det`, or scope fault.
**Response/template.** Fault selection and repair.
**Derivation.** One typed mutation in a valid clause.
**Difficulty.** L2 local; L3 clause-type contrast; L4 plausible but
context-incompatible order/reference.
**Validation.** Exactly one root fault.

### Cross-family progression

Teach V2 first with subject-first clauses, then one fronted time phrase.
Explicitly bracket the first constituent. Add `inte` in main clauses before
subordinate order and transform matched pairs. Questions reuse the finite-verb
slot. Add `sin`, relatives, and presentational `det` only after reference and
basic clause fields are stable.

## 6. Category: Connected Swedish, discourse, register, and variation

### Category purpose

Train choices that become meaningful across clauses or turns: comparison,
connectors, temporal sequencing, reference, information structure, address,
politeness, register, and explicit regional/spoken-profile interpretation.

### Learn-card content

- Correct individual clauses can still be incoherent if tense, reference,
  connector, or information order conflicts.
- `och, men, utan, för, därför, eftersom, om, när, innan, fastän` express
  different relations and trigger different clause structures.
- Comparison uses regular or lexical comparative/superlative forms and
  `än/som` patterns.
- Contemporary politeness usually comes from wording, modal forms, greeting,
  tone, and context—not a simple `du`→`ni` switch.
- Spoken Swedish commonly reduces frequent forms. Neutral writing, informal
  spelling, and pronunciation are separate dimensions.
- Regional standard differences are recognized neutrally and never used as
  hidden distractors.

### Prerequisites

Core Categories 3–5. Cross-profile tasks require mastery of one primary
production profile.

### Category boundaries

This category owns relations across clauses/turns and pragmatic
appropriateness. It does not grade open stylistic quality or cultural
interpretation. Reading/listening evidence is integrated in Category 7.

### Common misconceptions

- Selecting connectors from a single translated gloss.
- Switching preterite/perfect randomly across a narrative.
- Resolving every pronoun to the nearest noun.
- Treating `ni` as the universally polite singular equivalent of French
  `vous` or German `Sie`.
- Calling normal regional pronunciation incorrect.
- Treating `dom` pronunciation as proof that `de/dem` do not matter in neutral
  writing.

### Family `comparison_degree`

**Task/purpose.** Construct/interpret equality, comparative, and superlative
relations with reviewed regular/irregular forms.
**Response/template.** Form choice, ordering, or relation matching.
**Derivation.** ordered entities/property/degree and comparison standard.
**Difficulty.** L1 `-are/-ast`; L2 `mer/mest`; L3 `än/lika ... som`; L4
irregular forms/agreement.
**Distractors.** stack analytic and suffixal marking.
**Validation.** Numeric/order relation oracle.

### Family `connector_relation`

**Task/purpose.** Choose a connector realizing addition, contrast, correction,
cause, result, alternative, or concession.
**Response/template.** Single-choice or clause pairing.
**Derivation.** logical/discourse relation and connector class.
**Difficulty.** L1 `och/men`; L2 `utan/för/därför`; L3
cause/result/concession; L4 subtle authored contrast.
**Distractors.** same translation but wrong relation/order.
**Validation.** Relation graph.

### Family `temporal_sequence`

**Task/purpose.** Order events and choose tense/time expressions consistent with
before, after, overlap, habit, and prior past.
**Response/template.** Timeline, connector/form choice, or completion.
**Derivation.** interval and reference-time graph.
**Difficulty.** L2 explicit adverbs; L3 perfect/preterite; L4 pluperfect/
reference shift.
**Distractors.** surface sentence order equals event order.
**Validation.** Temporal oracle.

### Family `cause_purpose_condition`

**Task/purpose.** Distinguish cause, result, purpose, and real/hypothetical
condition and select licensed connector/verb pattern.
**Response/template.** Relation choice or clause completion.
**Derivation.** causal/intention/possible-world graph.
**Difficulty.** L2 cause/result; L3 purpose `för att`; L4 condition/modal.
**Distractors.** one translation for `för/att/om`.
**Validation.** Logical and clause grammar.

### Family `tense_reference_tracking`

**Task/purpose.** Maintain coherent present, preterite, perfect, and
pluperfect reference across a short narrative/message.
**Response/template.** Multiple form choices or anomaly selection.
**Derivation.** authored event/reference-time graph.
**Difficulty.** L3 two events; L4 three-to-five event chain.
**Distractors.** one past form throughout.
**Validation.** Event-discourse model.

### Family `reference_chain`

**Task/purpose.** Resolve/construct chains of noun phrases, personal/reflexive
pronouns, `det`, and zero repetition across sentences.
**Response/template.** Entity linking or controlled rewrite.
**Derivation.** discourse entities, salience, gender/number, roles.
**Difficulty.** L2 one referent; L3 switch; L4 same-feature competitors.
**Distractors.** nearest compatible noun.
**Validation.** Unique reference graph.

### Family `information_structure_context`

**Task/purpose.** Select first constituent, pronoun/full NP, and order from
given/new/contrastive context while maintaining grammatical V2.
**Response/template.** Context-sentence matching or ordering.
**Derivation.** question under discussion, givenness, focus.
**Difficulty.** L2 time first; L3 object/topic; L4 contrast and presentational
`det`.
**Distractors.** all V2 orders pragmatically equivalent.
**Validation.** Human-reviewed information structure.

### Family `du_ni_address_reference`

**Task/purpose.** Distinguish singular `du`, plural `ni`, direct address, and
reviewed exceptional politeness uses without teaching a universal T/V system.
**Response/template.** Referent/number choice or dialogue completion.
**Derivation.** interlocutor count, relationship, service/register/profile.
**Difficulty.** L1 number; L2 direct service interaction; L3 ambiguous `ni`;
L4 regional/generational context.
**Validation.** Authored pragmatic/profile data.

### Family `polite_request_strategy`

**Task/purpose.** Match imperative, modal question, conditional wording,
softener, greeting, and thanks to a declared request situation.
**Response/template.** Appropriateness choice or constrained rewrite.
**Derivation.** request burden, relation, urgency, medium.
**Difficulty.** L2 routine; L3 softened request; L4 urgent/direct contrast.
**Distractors.** grammatical but socially mismatched.
**Validation.** Authored pragmatic scale.

### Family `formal_informal_rewrite`

**Task/purpose.** Rewrite a bounded message between neutral-formal and
familiar-informal profiles while preserving facts.
**Response/template.** Ordered chunks, choice, or named fields.
**Derivation.** message semantics plus paired realizations.
**Difficulty.** L2 greeting/address; L3 pronoun/spelling/closing; L4 lexical/
syntactic bundle.
**Constraints.** No open style scoring.
**Validation.** Meaning identity and register annotations.

### Family `spoken_written_form`

**Task/purpose.** Map reviewed normal spoken forms/reductions to neutral written
forms and classify acceptable informal spellings.
**Response/template.** Audio/text matching, profile choice, or controlled
rewrite.
**Derivation.** paired canonical transcript, spoken realization, editorial
profile.
**Difficulty.** L1 `de/dem`→spoken `dom`; L2 `mig/dig/sig`; L3 auxiliary/
pronoun reductions; L4 connected phrase.
**Distractors.** phonetic spelling as neutral standard.
**Validation.** Human audio and profile registry.

### Family `finland_swedish_comprehension`

**Task/purpose.** Understand a reviewed Finland-Swedish pronunciation, lexical,
or usage feature and identify a neutral cross-profile equivalent where useful.
**Response/template.** Meaning match, feature classification, or paired form.
**Derivation.** reviewed Finland-Swedish profile data.
**Difficulty.** L3 explicit transcript/lexical item; L4 audio/grammar nuance.
**Constraints.** No Finnish caricature or assumption that all speakers share
one feature.
**Validation.** Finland-Swedish specialist review/provenance.

### Family `regional_standard_comprehension`

**Task/purpose.** Understand paired southern/western/central/northern/Finland
standard realizations while retaining the active production profile.
**Response/template.** Meaning match and feature/profile classification.
**Derivation.** matched human recordings and profile metadata.
**Difficulty.** L3 one declared sound feature; L4 connected speech.
**Constraints.** No accent guessing from unknown speakers.
**Validation.** Specialist/profile review.

### Family `controlled_message_construction`

**Task/purpose.** Compose a short message from required facts, relationship,
time, and register using constrained slots/chunks.
**Response/template.** Structured fields or ordered clauses.
**Derivation.** intent, fact graph, register, construction set.
**Difficulty.** L2 one request/fact; L3 reason/time; L4 reference/tense across
three clauses.
**Validation.** Required-fact entailment/forbidden-claim checks.

### Family `grammar_pragmatics_audit`

**Task/purpose.** Find one connector, tense, reference, information order,
address, register, or profile inconsistency.
**Response/template.** Span selection, fault type, and repair.
**Derivation.** One discourse dependency mutation.
**Difficulty.** L3 two clauses; L4 multi-turn/profile-sensitive.
**Distractors.** Valid alternatives outside the mutation.
**Validation.** One root fault and preserved facts after repair.

### Cross-family progression

Start with explicit comparisons/connectors, then event sequencing and reference.
Add information structure after V2 is automatic. Teach politeness through whole
utterances, not `ni`. Spoken/written and regional-profile comparison comes
after a neutral written and one spoken baseline are secure.

## 7. Category: Reading, listening, and interaction

### Category purpose

Integrate the preceding systems in short evidence-based communicative tasks
while keeping answers objectively checkable and offline media accessible.

### Learn-card content

- Identify genre, speaker/writer, addressee, and purpose first.
- Use noun suffixes, adjective agreement, finite-verb position, sentence
  adverbs, particles, tense, connectors, and information order as evidence.
- Separate facts stated by the text from plausible but unsupported guesses.
- In audio, listen first for stress/quantity and clause rhythm, then decisive
  words. Normal speech is not a sequence of dictionary forms.
- Recognize the active speaker profile without guessing identity or judging
  accent quality.
- Speaking rehearsal supports memory and rhythm; local playback is not an
  automatic pronunciation grade.

### Prerequisites

Selected families from Categories 2–6 according to each item's feature
manifest.

### Category boundaries

Texts and recordings use reviewed vocabulary/constructions plus a declared
small inferable set. This category checks comprehension, constrained
production, and interaction—not open literary analysis, essay quality, accent
authenticity, or civic-knowledge testing.

### Common misconceptions

- Translating token by token before using morphology and order.
- Ignoring definite suffixes or verb position.
- Treating a particle as an ordinary preposition from spelling alone.
- Treating a plausible inference as stated.
- Assuming normal audio contains every orthographic segment distinctly.
- Believing local recording/playback produces an objective score.

### Family `sentence_segmentation_parse`

**Task/purpose.** Segment a sentence into noun/verb phrases and clause fields
and identify finite verb, subject, objects, adverbs, and connector.
**Response/template.** Boundary/field placement or dependency matching.
**Derivation.** Generator source parse.
**Difficulty.** L1 main clause; L2 inversion; L3 subordinate/relative; L4
particle/presentational.
**Distractors.** second word equals V2 or any postverb word is object.
**Validation.** Source tree.

### Family `inflected_word_recovery`

**Task/purpose.** Recover a known lemma/sense from an inflected/definite/
particle-context form.
**Response/template.** Lemma match, feature fields, or gloss choice.
**Derivation.** paradigm/compound analysis and sentence semantics.
**Difficulty.** L1 noun suffix; L2 adjective/verb; L3 strong verb/compound; L4
homograph resolved by structure.
**Distractors.** visual substring only.
**Validation.** Unique contextual analysis.

### Family `compound_in_context`

**Task/purpose.** Parse an unfamiliar transparent reviewed compound from its
constituents/head and infer only the licensed meaning.
**Response/template.** Bracketing, head choice, or meaning match.
**Derivation.** compound tree and contextual semantics.
**Difficulty.** L2 two nouns; L3 linking element/polysemy; L4 nested compound.
**Distractors.** wrong bracketing or free imaginative meaning.
**Validation.** Compound tree and entailment.

### Family `short_reading_comprehension`

**Task/purpose.** Retrieve stated facts and simple licensed inferences from a
purpose-written 1–5-sentence text.
**Response/template.** Choice, matching, ordering, or exact short answer.
**Derivation.** Text fact/event/reference graph.
**Difficulty.** L1 one fact; L2 two facts; L3 reference/tense; L4
negative/contrastive evidence.
**Distractors.** contradicted, unsupported, role reversal.
**Validation.** Evidence/entailment annotations.

### Family `notice_message`

**Task/purpose.** Interpret a sign, chat, email, announcement, invitation, or
service message.
**Response/template.** Purpose/detail/action choice.
**Derivation.** genre, audience, time/location/action facts.
**Difficulty.** L1 one instruction; L2 date/time; L3 condition/change; L4
register/inference.
**Constraints.** Fictional, non-live, non-high-stakes.
**Validation.** Fact and genre review.

### Family `instruction_timetable_route`

**Task/purpose.** Follow ordered instructions, timetable, recipe-like sequence,
or simple route.
**Response/template.** Ordered steps, selected outcome, or structured fields.
**Derivation.** exact sequence/calendar/spatial graph.
**Difficulty.** L1 two steps; L2 time; L3 branch/direction; L4 cross-reference.
**Distractors.** swapped step, reversed direction, ignored negation.
**Validation.** Independent sequence/route oracle.

### Family `dialogue_completion`

**Task/purpose.** Choose/construct the next turn satisfying intent, reference,
answer type, and register.
**Response/template.** Choice, ordered chunks, or bounded completion.
**Derivation.** dialogue state, speech act, facts, profile.
**Difficulty.** L1 greeting/Q&A; L2 request; L3 repair/refusal/reason; L4
limited authored implicature.
**Validation.** State transition.

### Family `reference_resolution`

**Task/purpose.** Resolve personal/reflexive pronouns, possessives, `det`,
definite NPs, and omitted repeated material in a short text/dialogue.
**Response/template.** Entity linking or matching.
**Derivation.** explicit discourse graph.
**Difficulty.** L2 gender/number cue; L3 same-feature competitors; L4 topic
shift/presentational.
**Distractors.** nearest noun.
**Validation.** Unique antecedent under context.

### Family `listening_sound_form`

**Task/purpose.** Match audio to word/phrase form using vowel/consonant
quantity, stress, sound–spelling, and morphology.
**Response/template.** Audio/text matching.
**Derivation.** licensed recordings/transcripts.
**Difficulty.** L1 word; L2 quantity/sj-tj; L3 inflected/particle; L4
normal-rate regional profile.
**Constraints.** Recording artifacts cannot cue answers.
**Validation.** Human audio review.

### Family `listening_dictation`

**Task/purpose.** Transcribe a reviewed phrase/sentence when context supplies
enough evidence for spelling, inflection, and compound boundaries.
**Response/template.** Text or segmented fields.
**Derivation.** recording, canonical transcript, profile, accepted forms.
**Difficulty.** L1 word; L2 slow phrase; L3 normal sentence; L4 reductions/
particles/compounds resolved by grammar.
**Validation.** Audio/transcript alignment.

### Family `listening_comprehension`

**Task/purpose.** Extract gist, stated detail, sequence, speaker relation, or
simple inference from short audio.
**Response/template.** Choice, matching, ordering, or exact field.
**Derivation.** audio-script fact/dialogue graph.
**Difficulty.** L1 one fact; L2 two details; L3 tense/reference; L4 normal-rate
multi-turn/profile.
**Distractors.** mentioned but wrong role/time or unsupported.
**Validation.** Evidence spans/human review.

### Family `guided_speaking_shadowing`

**Task/purpose.** Rehearse/optionally record a reviewed utterance with attention
to stress, quantity, phrase rhythm, and communicative focus.
**Response/template.** Listen–repeat–self-compare checklist; no automatic score.
**Derivation.** model audio, transcript, prosodic annotations.
**Difficulty.** L1 word; L2 phrase; L3 sentence; L4 short role turn.
**Constraints.** Local-only recording, explicit deletion, text route.
**Validation.** Asset/manual review, not learner-audio judgment.

### Family `bounded_mediation`

**Task/purpose.** Relay selected facts from a table, route, schedule, or
interface-language note in controlled Swedish without open translation.
**Response/template.** Named fields, clause choices, or ordered chunks.
**Derivation.** fact graph and licensed Swedish realizations.
**Difficulty.** L2 one fact; L3 time/reason; L4 two audiences/register.
**Distractors.** missing required fact or unsupported addition.
**Validation.** Bidirectional fact entailment.

### Family `profile_comprehension`

**Task/purpose.** Understand paired regional-standard or careful/colloquial
recordings/texts and identify shared meaning plus declared profile difference.
**Response/template.** Meaning match and feature classification.
**Derivation.** reviewed paired items and speaker/profile metadata.
**Difficulty.** L3 transcript supplied; L4 audio-first familiar feature.
**Constraints.** No accent guessing from an unknown speaker.
**Validation.** Specialist/profile review.

### Family `connected_language_audit`

**Task/purpose.** Find one contradiction, unsupported interpretation,
reference/time/order mismatch, malformed form, or register inconsistency using
text/audio evidence.
**Response/template.** Evidence span plus correction/classification.
**Derivation.** One logged mutation to a valid item.
**Difficulty.** L2 sentence; L3 text/dialogue; L4 cross-modal evidence.
**Validation.** Exactly one root fault and uniquely decisive evidence.

### Cross-family progression

Begin with parsing and word recovery, then one-fact texts/audio. Add messages,
sequences, dialogues, compounds, and reference. Dictation follows
sound–spelling mastery. Mediation and profile comparison are later. Receptive
vocabulary may lead productive vocabulary but is tracked separately.

## 8. Cross-category progression and release slices

Levels describe exercise complexity, not certification:

- **Foundation / L1:** alphabet/`å ä ö`, core vowel/quantity contrasts,
  high-value sound spellings, `en/ett`, indefinite/definite singular, regular
  present, subject-first V2, simple questions/negation, and one-fact
  reading/listening.
- **Elementary / L2:** more quantity/sound patterns, plural/definite plural,
  adjective agreement/double definiteness, prepositions, preterite/supine/
  perfect, one particle/reflexive frame, inversion, main/subordinate `inte`,
  practical messages, and dictation.
- **Independent-building / L3:** less regular nouns/verbs, possessive/genitive
  determination, tense contrasts/future/modals, particle chains, passives,
  reflexive reference, embedded questions/relatives, sentence-adverb order,
  connectors/register, connected comprehension, and mediation.
- **Early-intermediate / L4:** interacting reference/tense/particle/voice,
  presentational constructions, dense clause fields, information structure,
  spoken/written and regional-profile comprehension, and audits.
- **L5 challenge:** denser mixing and reduced scaffolding inside reviewed
  early-B1 grammar; no silent move to advanced literary Swedish or free writing.

Recommended delivery:

1. **Release A — sound, noun phrase, present:** Category 2 core; `en/ett`,
   indefinite/definite noun, adjective basics; present; subject-first V2,
   questions/negation; parsing/audio.
2. **Release B — plural, past, and inversion:** compounds, plural/double
   definiteness/possessives, prepositions/numbers, preterite/supine/perfect,
   particle basics, inversion, main/subordinate `inte`, notices, schedules,
   dictation.
3. **Release C — connected Swedish:** tense/future/modal/particles/passive,
   `sin/sitt/sina`, embedded questions/relatives, clause fields, connectors,
   reference, register, dialogue/listening, constrained messages.
4. **Release D — early-B1 integration:** information structure,
   presentational/passive nuance, variation, mediation, regional-profile
   comprehension, and audits.

Unlock by family dependencies. Pronunciation recognition, spelling, noun-form
production, determination, verb form, word order, reading, listening, speaking
rehearsal, and profile comprehension have separate evidence. Audio/microphone
remains optional where inaccessible.

## 9. Adaptive practice guidance

Track:

- family/can-do, level, scaffold, modality, response, latency, confidence, and
  misconception;
- lexeme/sense, frequency/domain, known status, collocation, register/profile;
- grapheme, quantity, vowel/consonant/sound class, stress, pitch profile,
  compound boundary, capitalization, audio/speaker/profile;
- noun gender, principal forms, number, reference/definiteness, adjective/
  determiner controller, possessor/genitive, quantifier, preposition;
- verb class/principal form, tense/perfect/reference time, future/modal,
  infinitive marker, particle/reflexive/preposition frame, voice/participle;
- pronoun role/form/referent/binding, clause type, first constituent, finite
  slot, sentence-adverb slot, question/relative gap, `det` type, scope/focus;
- connector/relation, event sequence, address/register, genre/evidence, and
  profile difference.

Routing examples:

- Correct base letter but `a/o` for `å/ä/ö` → target keyboard/orthography
  without marking the word's meaning unknown.
- Correct word identity but wrong quantity → keep lexeme and contrast the
  matched stress/quantity pair in audio.
- Profile-valid `sj` realization judged against another profile → acknowledge
  it and restore active profile; do not score accent quality.
- Correct noun but wrong `en/ett` → retrieve gender with its principal forms
  before a new adjective.
- Correct reference but wrong definite form → hold discourse constant and
  target noun paradigm.
- `den röd bilen` → display the three linked double-definite forms before more
  vocabulary.
- `min röda bilen` → contrast possessive determination with double
  definiteness using the same noun/adjective.
- Subject-based verb ending → hold verb form constant across several subjects.
- Regularized preterite/supine → retrieve principal forms and space them.
- Perfect used with a closed definite past time → contrast timelines while
  keeping the event constant.
- Particle translated literally → restore whole lexical sense and participant
  frame before order practice.
- Correct words but no inversion after a time phrase → bracket the entire
  prefield and mark the finite slot.
- Correct main-clause `inte` placement copied into subordinate clause → perform
  a matched clause-schema transformation.
- `sin` points to a non-subject → draw possessor and local subject links before
  a more complex clause.
- Spoken `dom` in neutral writing → classify spoken competence separately and
  target `de/dem` by role.
- Finland-Swedish standard form → label its profile rather than remediate as an
  error.

Track recognized, scaffold-produced, and meaning-produced mastery separately.
Space gender, noun principal forms, irregular verb parts, particle frames, and
pronoun binding. After two successes, vary one controlled dimension. A
confident misconception triggers a minimal contrast, explanation, and delayed
transfer. Slow correctness does not justify unrelated lexical difficulty.

## 10. Feedback and explanation requirements

Reveal:

1. **Intention/profile:** meaning, reference, time, relationship, speech act,
   register, medium, and active spoken/written profile.
2. **Semantic frame:** predicate, roles, referents, states/events, intervals,
   possession/quantity, clause/discourse relation.
3. **Features:** noun gender/number/definiteness; adjective/controller;
   tense/perfect/modal/voice; polarity and clause type.
4. **Realization:** noun suffix/article, adjective/possessive form, compound
   boundary; verb principal form/auxiliary/particle/preposition/reflexive/
   passive.
5. **Structure:** clause fields, finite slot, first constituent, inversion,
   sentence-adverb position, question/relative gap, binding, `det` function,
   scope/topic/focus.
6. **Mismatch/alternatives:** first decisive error and whether another form is
   equivalent, profile-different, contextually different, non-target, or wrong.

Useful visuals:

- grapheme–sound/audio alignment and vowel chart by profile;
- stressed syllable with vowel/consonant quantity timeline;
- lexical stress/pitch contour shown only for the active audio profile;
- compound tree and boundary/meaning contrast;
- noun principal-form table and reference→definiteness decision graph;
- double-definiteness and possessive agreement arcs;
- event/reference-time timelines for preterite/perfect/pluperfect;
- verb-chain slots and particle/preposition structure;
- active/passive event-role graph;
- Swedish clause-field strip with finite verb, subject, sentence adverb,
  nonfinite verb, particle, and complements;
- paired main/subordinate `inte` fields;
- question/relative antecedent→gap, binding, `det`, and reference graphs;
- timed transcript evidence and regional-profile comparison.

An interface-language gloss is support, not a full explanation. Invalidate any
item lacking enough context for gender, reference/definiteness, adjective form,
preposition, tense/perfect, future/modal, particle meaning, pronoun binding,
clause type/order, register, or profile.

## 11. Audio and content requirements

- Bundle all audio; no runtime TTS, speech-recognition, dictionary, corpus, or
  pronunciation service.
- Prefer licensed human recordings from multiple reviewed regional standard
  profiles, including Finland Swedish when feasible; label neutrally.
- Separate normal and pedagogically slower takes; avoid slowdown that distorts
  quantity, vowel quality, consonants, pitch accent, or phrase rhythm.
- Store canonical/display transcript, token/time alignment where needed,
  speaker/voice, broad profile, rate, quantity/stress/pitch/feature tags,
  license/provenance, and review status.
- Minimal/profile contrasts use matched speaker/recording conditions; noise,
  loudness, or speaker alone cannot reveal the answer.
- Provide replay, state, keyboard controls, transcript when it does not defeat
  the task, and a non-audio route where hearing is not the skill.
- Microphone use is optional/local-only: no upload, retention by default,
  regional/accent detection, or automatic pronunciation/intelligibility score.
- Purpose-write text/dialogue. External content requires compatible license and
  attribution.
- Use varied names, places, households, occupations, and situations without
  stereotypes or civic/cultural trivia requirements.

## 12. Rendering, interaction, and accessibility

- Use UTF-8 and fonts verified for `å ä ö Å Ä Ö`, combining learner
  annotations, punctuation, italics, and bold.
- Offer an optional Swedish character strip and keyboard guide; track use
  separately from unaided spelling.
- Quantity/stress/pitch diagrams supplement audio but never replace accessible
  text descriptions.
- Paradigms use semantic HTML tables.
- Compound trees, agreement arcs, timelines, clause fields, reference/binding
  graphs, and profile diagrams have text/table alternatives.
- Ordering tasks have keyboard/button alternatives and large touch targets.
- Audio controls expose labels/state/replay/rate/transcript; no autoplay.
- Color, sound, pitch, duration, animation, time, or fine pointer action is
  never the sole cue without an equivalent path.
- Speaking tasks work as listen/read rehearsal without microphone permission.
- Long compounds, phrases, and tables wrap without hiding the assessed
  boundary.
- Screen readers announce target/correction before detail and hide raw feature
  IDs.
- Respect reduced motion and avoid disappearing timers.
- Profile labels use text, not flags alone.

## 13. Generator and offline implementation guidance

Useful module boundary:

```text
seededRng
reviewedSwedishLexiconRegistry
varietyProfileRegistry
unicodeSwedishNormalizer
orthographyCompoundPolicy
pronunciationQuantityRegistry
stressPitchProfileRegistry
semanticFrameGenerator
referenceDeterminationEngine
nominalParadigmRealizer
agreementResolver
compoundStructureRegistry
prepositionRelationRegistry
numberDateTimeGrammar
verbPrincipalFormRegistry
verbParadigmRealizer
eventReferenceTimeModel
futureModalSelectionEngine
particlePrepositionParser
verbComplementRegistry
passiveVoiceEngine
bindingReferenceResolver
clauseFieldLinearizer
sentenceAdverbSlotEngine
questionRelativeGrammar
detConstructionResolver
informationStructureModel
referenceDiscourseGraph
dialogueStateEngine
textEntailmentAnnotations
audioAssetRegistry
faultInjector
semanticAnswerChecker
accessibleRenderer
```

Archive:

- stable family/schema, seed, data/generator/profile versions;
- can-do, level, scaffold, modality, response mode;
- semantic frame, roles, referents, facts, states/events, intervals/worlds,
  speech act, discourse relation;
- lexeme/sense IDs and complete morphosyntactic features;
- reference/determination, noun principal form, agreement controllers,
  compound/preposition/quantity structure;
- verb principal forms, tense/reference, modal/future, auxiliary/supine,
  particle/reflexive/complement/passive structure;
- pronoun role/referent/binding, clause type/fields, first constituent, finite/
  adverb slots, question/relative/`det`/scope/order template;
- active profile and canonical/accepted/profile-different outputs;
- orthography, quantity/stress/pitch/pronunciation/audio annotations;
- parse/evidence/normalization, misconception distractor, and fault ID.

Generation:

1. choose family, level, profile, and declared difficulty dimensions;
2. create semantic, reference, phonological, event, clause, or discourse source;
3. select compatible reviewed lexemes and licensed construction;
4. assign determination/agreement, time/modal/voice, particle/complement,
   reference, clause type, information structure, register;
5. realize noun/adjective/pronoun/number and verb-chain morphology;
6. linearize clause fields and apply compound/spelling/capitalization/
   punctuation policy;
7. select compatible audio where required;
8. back-parse and verify identity against source;
9. derive answer/explanation by an independent path;
10. create misconception distractors or one typed audit mutation;
11. reject ambiguity, answer collisions, unnaturalness, profile mismatch,
    excessive new vocabulary, or insufficient evidence.

No backend or runtime network is assumed. Ship reviewed/versioned data, audio,
and templates inside the standalone HTML/JS/CSS artifact or adjacent bundled
assets. Do not embed a general translator, corpus, morphological analyzer,
dictionary, TTS, or speech recognizer. Choice/order tasks compare IDs. Free
text parses only the documented controlled grammar and compares typed features/
accepted realizations; edit distance is diagnostic only.

## 14. Automated and linguistic validation

### Data-build checks

- Every lexeme has stable ID, sense, part of speech, level/frequency, register/
  profile, provenance, and review.
- Every noun has gender, all shipped indefinite/definite singular/plural forms,
  stress/quantity/pronunciation, and countability/reference constraints.
- Every adjective/determiner/pronoun has all shipped agreement/determination
  cells and accepted variants.
- Every verb has all shipped principal forms, particle/reflexive/passive/
  complement/preposition frames, stress, pronunciation, and sense links.
- Every compound has structure/head/meaning/spacing; productive templates have
  typed semantic restrictions.
- Every clause/connector/negation/question/relative/`det`/order/register
  construction is typed and reviewed.
- Every regional/spoken variant declares profile, register, scope, baseline
  equivalent where appropriate, and explanation.
- Every audio item has transcript, speaker/profile, feature tags, license,
  provenance, and human review.

### Instance invariants

- Surface Swedish reparses to source semantics/features.
- `å/ä/ö`, compound boundaries, capitalization, punctuation, and orthography
  match profile/editorial policy.
- Pronunciation/audio matches lexical form, quantity, stress/pitch class,
  sound–spelling environment, inflection, and profile.
- Reference determines noun/article/definite suffix; agreement and possessive/
  genitive/demonstrative pattern match controllers.
- Verb principal form, auxiliary/supine, tense/reference, modal/future,
  particle/reflexive/complement/preposition, and passive role match event.
- Clause type, finite slot, first constituent, subject, sentence adverb,
  nonfinite/particle order, question/relative gap, binding, `det`, scope,
  information structure, address, register, and profile match context.
- Reading/listening key is entailed; distractors are logged as contradicted,
  unsupported, wrong role/time/reference, or register/profile mismatch.
- Accepted answers never collide after family-specific normalization.
- Every audit differs from valid source by exactly one root mutation.

### Test volume and independent oracles

- At least 10,000 seeds per family/level.
- At least 25,000 for sound/quantity, compounds, gender/definiteness/agreement,
  noun/verb paradigms, tense/perfect, particles/complements, passives, V2/
  inversion, sentence-adverb/subordinate order, questions/relatives, binding/
  reference/`det`, and audits.
- Exhaustively enumerate shipped noun/adjective/pronoun/verb paradigms,
  determination patterns, verb-chain slots, and clause-field templates.
- Exhaustively test Unicode, `å/ä/ö`, case mapping, whitespace/compound
  boundaries, hyphens, capitalization, punctuation, and profile variants.
- Independently recompute numbers, dates, times, prices, routes, sequences, and
  comparisons.
- The back-parser/validator must not share the generator's answer-key path.
- Snapshot long compounds, tables, diagrams, clause fields, profile labels, and
  audio states on mobile/desktop.
- Manually review all audio and stratified samples across template, lexeme,
  paradigm, compound, tense, particle, clause order, register, profile,
  distractor, and fault types. Automation cannot certify idiomaticity or
  pragmatic naturalness.

Discard and log failures; never substitute unreviewed content.

## 15. Coverage and balance requirements

Report by family/level:

- generation/rejection counts and distinct semantic/construction frames;
- lemma/sense/domain/frequency/new-word status, collocation, register/profile;
- vowel/consonant/quantity/sound spelling, stress/pitch, compound, audio/
  speaker/profile;
- noun gender/principal form/number/reference/definiteness, adjective/
  determiner controller, possessor/genitive, quantifier/preposition;
- verb class/principal form/tense/reference/auxiliary/supine/future/modal,
  particle/reflexive/complement/preposition/passive;
- pronoun role/form/binding/reference, clause type/first field/finite/adverb/
  nonfinite/particle slots, question/relative/`det`/scope/topic/focus;
- connector/relation, event sequence, address/register, genre/evidence,
  modality, response/scaffold/misconception/confidence/repetition.

Cap easy defaults: `en` nouns, `-ar` plurals, simple definite `-en`, common
singular adjectives, group-1 verbs, present, subject-first main clauses, one-word
prefields, no sentence adverb, transparent particle verbs, central/eastern
speaker audio, and literal one-clause translation. Balance communicative value,
gender, number, reference, tense, verb class, clause type, constituent opening,
profile, register, and learner needs. Do not elevate rare variants to core
frequency for symmetry.

## 16. Content and implementation checklist

- [ ] Contemporary Swedish, roughly Foundation–early B1; no certification
      claim.
- [ ] Neutral standard writing plus explicit spoken/regional profiles,
      versioned independently.
- [ ] Finland Swedish and regional standards labeled neutrally, not ranked.
- [ ] `å/ä/ö`, compounds, capitalization, and punctuation reliable.
- [ ] Quantity/stress/pitch and sound mappings are lexical/profile data.
- [ ] Pitch accent is receptive/profile-aware; no automatic production score.
- [ ] Lexemes, senses, paradigms, constructions, variants, and audio reviewed
      with provenance/license.
- [ ] Noun gender/principal forms, verb parts, particles, valency, and profile
      stored rather than guessed.
- [ ] Determination derives from reference before surface articles/suffixes.
- [ ] Double definiteness and possessive/genitive patterns remain distinct.
- [ ] Adjective/pronoun agreement has explicit controllers.
- [ ] Verbs do not receive person/number endings.
- [ ] Preterite/perfect/future choices use event/reference context.
- [ ] Particle verbs retain whole sense, stress, arguments, and placement.
- [ ] V2 means second constituent; subordinate order uses its own schema.
- [ ] `inte`, questions, relatives, `sin`, and `det` derive from parsed context.
- [ ] Politeness is not reduced to `du/ni`.
- [ ] No unrestricted translation, essay, conversation, or fuzzy grading.
- [ ] Audio is local, licensed, human-reviewed, and profile-tagged.
- [ ] Local recording produces no bogus pronunciation/accent score.
- [ ] Reading/listening answers retain exact evidence.
- [ ] Distractors encode misconceptions; audits mutate one root dependency.
- [ ] Seeds reproduce prompt, profile, answer, variants, audio, and explanation.
- [ ] Accessibility covers characters, sound alternatives, ordering, diagrams,
      clause fields, tables, audio, and local recording.
- [ ] Standalone HTML/JS/CSS; no backend or runtime network.

## 17. Stable IDs and recommended navigation

Use:

```text
swedish-language/<category-id>/<family-id>/<schema-version>
```

Persist seed, data/generator/profile versions, lexeme/sense IDs, semantic frame,
full feature bundle, determination/agreement controllers, verb/particle/
complement state, clause fields/reference/binding/order, answer policy, audio/
fault IDs. Increment schema/data versions whenever a keyed prompt, answer,
accepted variant, or explanation can change.

Recommended learner navigation:

1. **Sound, Spelling & Compounds**
2. **Words, Definiteness & Agreement**
3. **Verbs, Time & Particles**
4. **V2 & Sentence Structure**
5. **Connected Swedish**
6. **Reading, Listening & Interaction**

Filters may expose level, family, modality, input mode, spoken production/
receptive profile, register, vocabulary domain, and error review. Internal
engine terms remain developer-only.
