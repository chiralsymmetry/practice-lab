# English Language — Dynamic Practice Specification

Status: implementation specification

Audience: exercise generator, English linguistic-content editor, morphology and
syntax engine, semantic answer checker, text/audio renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual normative meanings.

## 1. Topic overview

### Topic name

English Language

### Topic goal

Develop beginner-to-lower-intermediate communicative English by repeatedly
connecting sound, spelling, vocabulary, morphology, syntax, reading, listening,
controlled writing, and guided speaking. The learner should become able to:

- decode and spell high-frequency words despite English's many-to-many
  sound–spelling relationships;
- connect reviewed spellings to vowel/consonant contrasts, syllables, lexical
  stress, schwa, weak forms, contractions, and connected speech in a declared
  pronunciation profile;
- recognize rhotic/non-rhotic, vowel-merger, consonant, and rhythm differences
  across reviewed regional standards without treating one accent as “no
  accent”;
- retrieve nouns with countability, number, irregular plural, possessive, and
  article/determiner behavior;
- choose `a/an`, `the`, zero article, demonstratives, possessives, and
  quantifiers from discourse reference rather than interface-language articles;
- use personal, object, possessive, reflexive, demonstrative, indefinite,
  relative, and singular-`they` forms with clear reference;
- conjugate frequent regular/irregular verbs and build simple, progressive,
  perfect, perfect-progressive, future/modal, imperative, and passive
  constructions;
- distinguish tense and aspect from event time, duration, result, repetition,
  completion, relevance, and discourse—not from one-word translations;
- retrieve infinitive/gerund, object-complement, phrasal-verb, and lexical
  preposition frames as sense-specific constructions;
- use auxiliaries and `do` support to form statements, negation, yes/no and
  wh-questions, short answers, tags, and embedded questions;
- construct relative, conditional, reported, existential, dummy-subject, and
  common subordinate clauses;
- use coherent information structure, register, politeness, spelling,
  punctuation, dates, measures, and vocabulary for a declared English profile;
- understand short reviewed texts and recordings, exchange routine
  information, and rehearse useful utterances;
- comprehend reviewed global and regional varieties without caricature,
  automatic accent identification, or covert correction toward one country.

The endpoint is practical form–meaning control in contemporary English.
Grammar labels support explanation; native-speaker imitation and terminology
recall are not the primary objectives.

### Audience and level boundary

The app starts before English spelling/pronunciation mastery and extends through
practical A1, A2, and selected early-B1 objectives. These labels guide exercise
complexity; the app does not certify CEFR, Cambridge, IELTS, TOEFL, school,
immigration, or professional proficiency.

- **Foundation:** alphabet/keyboarding where needed, core sound–spelling,
  fixed expressions, count nouns/articles, `be`, basic present, and simple
  statements/questions.
- **A1-oriented:** descriptions, routines, needs, plural/determiner control,
  present/past/future basics, time/prices/directions, negation, and short
  interaction.
- **A2-oriented:** progressive/perfect, pronouns/quantifiers, modal and
  complement frames, phrasal verbs, passives, relatives, messages, and
  connected descriptions.
- **Early-B1-oriented:** interacting tense/aspect, conditionals, reported
  speech, complex reference, information structure, register, inference,
  mediation, and cross-profile comprehension.

The Council of Europe [CEFR Companion
Volume](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions)
informs reception, production, interaction, mediation, and phonological
competence. The research-based [English Profile
programme](https://www.cambridge.org/core/journals/english-profile-journal/article/english-profile-programme-the-first-three-years/B38E07193AFBADA096CA556CE35503D5)
helps relate English grammar and lexis to CEFR levels. These are progression
anchors, not a claim that every item has one universal level.

### Reference and language-data boundary

Reference anchors include:

- the English Profile/learner-corpus approach to evidence about what learners
  can use at different levels;
- reviewed contemporary learner dictionaries and grammars selected by the
  content team, with licensing and edition recorded;
- the [Australian Government Style
  Manual](https://www.stylemanual.gov.au/grammar-punctuation-and-conventions)
  for an explicit Australian public-writing profile;
- the [Canada.ca Content Style Guide](https://design.canada.ca/style-guide/)
  for Canadian conventions and plain-language principles;
- the [GOV.UK A–Z style guide](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style),
  Merriam-Webster's reviewed US dictionary/usage resources, and other
  national/institutional guides for declared British, American, New Zealand, or
  other editorial profiles;
- reviewed spoken corpora and pronunciation references whose licenses permit
  bundled examples or derived annotations.

No dictionary, corpus, exam, or style guide is universal English. Reference
pages are not content to copy wholesale. Every bundled lexicon, paradigm,
recording, frequency list, example, or text requires compatible licensing,
provenance, versioning, and linguistic review. Attestation alone does not
establish learner level, sense, countability, complement frame, register,
region, or idiomaticity.

### Pluricentric variety and usage policy

English is pluricentric and globally diverse. Use a common high-frequency core
plus explicit, independently configurable profiles:

```text
VarietyProfile {
  id
  geographicAndSocialScope
  productionBaseline
  orthographyPolicy
  punctuationPolicy
  pronunciationTargets[]
  phonologicalContrasts[]
  lexicalPreferences[]
  grammaticalVariants[]
  numberDateTimeConventions
  addressRegisterConventions[]
  acceptedAlternatives[]
}
```

- Every production item declares the profile dimensions that can affect its
  answer.
- Spelling, punctuation, vocabulary, grammar, pronunciation, and dates are
  independent dimensions—not one British/American toggle.
- A profile may combine, for example, Canadian spelling with a reviewed western
  Canadian pronunciation target; it must not infer one from the other.
- `-ize/-ise`, `colour/color`, `centre/center`, quotation punctuation,
  collective agreement, `got/gotten`, present-perfect preferences, rhoticity,
  cot/caught or other mergers, and lexical choices are stored separately.
- Learners choose one production profile and may practise receptive
  comprehension of several others.
- Established regional or community varieties are labeled by scope and
  context, not ranked as broken approximations to a prestige variety.
- International intelligibility is a communicative goal, not a fictional
  accentless pronunciation.
- Accent imitation, accent origin detection, and unreviewed dialect generation
  are outside core scope.

Every realization is classified as:

1. **canonical target** — selected teaching form for this profile/context;
2. **accepted variant** — established and meaning/register-compatible here;
3. **profile-different** — established in another reviewed profile;
4. **contextually different** — grammatical but changes reference, tense/
   aspect, focus, politeness, phrasal meaning, or implication;
5. **non-target/nonstandard** — outside the requested production norm;
6. **incorrect** — incompatible spelling, morphology, syntax, or semantics.

Feedback must preserve these distinctions. Profile difference is not an error
in English as a whole.

### Scope

Included:

- contemporary alphabet/keyboarding, capitalization, punctuation, apostrophes,
  hyphens, spacing, and common spelling/profile variants;
- adult everyday vocabulary, word families, collocations, and multiword units
  through selected early B1;
- reviewed sound–spelling, vowel/consonant contrasts, syllables, stress, schwa,
  weak/strong forms, inflectional endings, contractions, linking, and connected
  speech;
- count/noncount and singular/plural nouns, articles, demonstratives,
  possessives, quantifiers, adjectives, adverbs, comparison, and pronouns;
- frequent regular/irregular verbs, auxiliaries, simple/progressive/perfect,
  future/modal, imperative, passive, and causative recognition;
- gerund/infinitive and object-complement frames, common phrasal/prepositional
  verbs, and lexical prepositions;
- statement/negative/question/short-answer/tag structures, relatives,
  conditionals, common subordinate clauses, and controlled reported speech;
- existential `there`, referential/dummy `it`, introductory `there/it`, and
  selected cleft recognition;
- practical numbers, dates, times, prices, addresses, telephone numbers,
  measures, and quantities under a declared profile;
- short reading/listening, constrained writing, dialogue, mediation, and guided
  local speaking rehearsal;
- receptive exposure to reviewed regional/global-standard profiles.

Expected prior knowledge:

- none at Foundation;
- literacy support may begin with letter names and keyboard;
- grammatical terminology is introduced through examples before use;
- later families assume only stated dependencies.

### Exclusions

- unrestricted translation, essays, free conversation, and fuzzy semantic
  similarity grading;
- comprehensive dialectology, slang/profanity generation, accent imitation, or
  accent “correction”;
- automatic pronunciation, fluency, or accent scoring;
- exhaustive historical spelling, etymology, or Great Vowel Shift instruction;
- exhaustive phonetic transcription and articulatory coaching;
- advanced tense/aspect pragmatics, inversion, ellipsis, clefts, subjunctive
  variation, legal prose, and academic hedging beyond selected early-B1 uses;
- open literary interpretation, humor, irony, idiom guessing, and culturally
  dense implicature;
- raw vocabulary flashcards without context, collocation, morphology, or sound;
- prescriptive shibboleths where established standard profiles differ;
- specialist/high-stakes medical, legal, immigration, emergency, and safety
  content;
- live transport, prices, law, news, or political information.

### Orthography, pronunciation, and input conventions

- Internal strings are UTF-8 and Unicode NFC.
- English spelling preserves lexical distinctions even when the active
  pronunciation profile merges the sounds.
- Straight and curly apostrophes/quotation marks may normalize when typography
  is not assessed; apostrophe presence and position remain meaningful.
- Profile spelling variants are stored as lexical/morphological sets with
  scope. Do not transform every `-or/-our`, `-er/-re`, or `-ize/-ise` string
  mechanically.
- Capitalization and punctuation follow a declared editorial profile. Title
  case, serial commas, quotation marks, punctuation placement, abbreviations,
  and date order may vary.
- Stress, syllabification, weak forms, rhoticity, linking, flapping/glottaling,
  vowel mergers, and consonant realizations are lexical/construction/profile
  annotations, not reasons to respell ordinary words phonetically.
- Contractions are typed constructions (`I'm`, `isn't`, `I'd`) whose expansion
  depends on syntax/context; an apostrophe is not a generic deletion marker.
- Learner audio may use a reviewed pedagogical rate but must preserve natural
  stress, reduction, rhythm, and segment contrasts.
- IPA is optional and never assumed.

### Lexical and grammatical data model

```text
Lexeme {
  id
  lemma
  partOfSpeech
  senses[]
  countabilityBySense[]
  pluralForms[]
  possessiveForms[]
  adjectiveClass?
  comparisonForms[]
  verbClass?
  principalVerbForms[]
  stativeDynamicFrames[]
  auxiliaryFrames[]
  complementFrames[]
  particleFrames[]
  prepositionFrames[]
  passiveFrames[]
  pronunciations[]
  syllables[]
  stressPattern[]
  weakStrongForms[]
  semanticTags[]
  collocations[]
  wordFamily[]
  frequencyBand
  learnerLevel
  register
  varietyScope[]
  spellingVariants[]
  acceptedVariants[]
  provenance
  reviewStatus
}

Construction {
  id
  semanticFrame
  syntacticTemplate
  requiredFeatures
  referenceDeterminationProfile
  agreementLinks[]
  auxiliaryChain[]
  complementSlots[]
  particleStructure?
  tenseAspectMoodProfile
  clauseType
  inversionProfile
  negationScope?
  wordOrderOptions[]
  informationStructure
  registerProfile
  varietyScope[]
  acceptedRealizations[]
}
```

Countability, plural, stress, pronunciation, verb stativity, principal forms,
complement type, particle separability, lexical preposition, passive licensing,
spelling, register, and profile are sense/construction data. Do not infer them
from spelling or an interface-language gloss.

### Reference, tense/aspect, auxiliary, and complement policy

- Generate discourse entities, event structure, time/reference intervals,
  modality, polarity, speech act, information status, register, and profile
  before choosing surface forms.
- Article choice follows countability, number, identifiability, prior mention,
  uniqueness, genericity, institutional use, proper-name class, and
  construction.
- Countability is sense-specific: one lemma can have count and noncount uses.
- Tense locates reference/event time; progressive presents an internal/ongoing
  view; perfect relates a prior situation to a reference time. No form is
  selected solely because the interface language uses a similarly named tense.
- Profile-sensitive choices—such as simple past versus present perfect with
  recent-result adverbs—must be labeled rather than universalized.
- Auxiliary structure is explicit. `be`, `have`, modal auxiliaries, and
  auxiliary `do` determine negation, inversion, tags, and short answers.
- Lexical `have/do/be` remains distinct from auxiliary use.
- Gerund/infinitive and object-complement frames are sense-specific. Changing
  complement may be ungrammatical or change meaning.
- Phrasal verbs store whole sense, particle status/stress, transitivity,
  separability, pronoun placement, and profile/register.

### Global answer conventions

- Ignore surrounding whitespace and normalize Unicode to NFC.
- Normalize straight/curly apostrophes and quotation marks only when typography
  is incidental.
- Preserve internal word boundaries, hyphens, capitalization, punctuation, and
  profile spelling when assessed.
- Case-insensitive comparison is allowed only for families where capitalization
  is not part of the skill.
- Choice/ordering responses compare stable IDs, not visible labels.
- Text responses are checked by the promised controlled grammar and accepted
  realization set. Edit distance or embedding similarity cannot establish
  grammatical or semantic equivalence.
- Multiple forms use labeled fields rather than guessed separators/order.
- Numbers accept declared grouping, decimal, date, time, currency, and unit
  formats only when notation is not assessed.
- A profile-valid answer outside the active production profile receives a
  profile-different explanation, not a generic error.
- A grammatical answer that changes article reference, tense/aspect,
  complement, phrasal sense, scope, politeness, or focus is contextually
  different.
- Audio-dependent prompts offer replay and a non-audio route unless hearing
  discrimination is the target.

### Difficulty philosophy

Difficulty should increase through independently controlled dimensions:

- less phonological/orthographic cueing and less segmented audio;
- lower-frequency but useful reviewed vocabulary and less transparent spelling;
- denser vowel/consonant contrasts, stress/weak forms, linking, and receptive
  profile differences;
- less predictable countability, plural, article, and quantifier behavior;
- more discourse distance for article/pronoun reference;
- less regular verb principal forms and interacting progressive/perfect/modal/
  passive meanings;
- more lexical complement, particle, and preposition constraints;
- longer auxiliary chains, questions, negation, relative/subordinate clauses,
  referents, and scope/information-structure constraints;
- productive rather than receptive response and reduced answer structure;
- cross-profile comprehension after one production baseline is secure.

Do not manufacture difficulty with obscure idioms, tiny text, poor audio,
unannounced profile changes, ambiguous translation, arbitrary timers,
unbounded typing, cultural trivia, or distractors needing missing context.

## 2. Category: Sound, stress, spelling, and connected speech

### Category purpose

Build automatic bidirectional links among letters, graphemes, syllables,
lexical stress, weak/strong forms, inflectional endings, spelling, punctuation,
and reviewed profile audio.

### Learn-card content

- English spelling is not one sound per letter. Learn spelling, pronunciation,
  stress, meaning, and word family together.
- Vowel letters and groups can represent many sounds; one vowel sound can have
  several spellings. Context may be required for dictation.
- Stress affects vowel quality and schwa. Unstressed grammar words often have
  weak forms in connected speech.
- Plural/third-person `-s` and past `-ed` have several pronunciations determined
  by the preceding sound, while spelling remains stable.
- Contractions combine grammar and pronunciation: `he's` can expand to `he is`
  or `he has` depending on the following structure.
- Regional profiles may differ in rhoticity, mergers, `t`, vowels, and rhythm.
  Recognize differences without guessing speaker identity.

### Prerequisites

None. Audio families require usable audio or an equivalent visual/text route.

### Category boundaries

This category teaches decoding, spelling, and phonological form. Morphological/
syntactic selection of plural, tense, auxiliary, or contraction belongs to
later categories, which call this renderer.

### Common misconceptions

- Reading every letter separately or assuming one grapheme has one sound.
- Spelling solely from audio when homophones exist.
- Treating silent letters as optional.
- Pronouncing every unstressed vowel with its stressed citation quality.
- Pronouncing `-s` or `-ed` one way everywhere.
- Expanding every `'d` or `'s` identically without syntax.
- Calling a merged contrast a listening failure under a profile that merges it.
- Treating reduced connected speech as careless or incorrect.

### Family `alphabet_letter_spelling`

**Task/purpose.** Recognize/produce letter names and spell reviewed names/codes.
**Response/template.** Audio/text matching, character input, or spelling
sequence. **Derivation.** Fixed alphabet plus profile letter-name audio.
**Difficulty.** L1 distinct names; L2 `e/g/j` and vowel confusions; L3 mixed
codes; L4 multi-speaker.
**Validation.** Inventory/audio.

### Family `vowel_grapheme_sound`

**Task/purpose.** Match frequent vowel graphemes to reviewed word
pronunciations without promising unique decoding.
**Response/template.** Audio-word match or grapheme classification.
**Derivation.** lexeme, syllable, stress, profile.
**Difficulty.** L1 short frequent words; L2 silent-e/digraph; L3 unstressed/
loan; L4 cross-profile.
**Distractors.** alphabet-name values.
**Validation.** Lexical pronunciation registry.

### Family `consonant_digraph_sound`

**Task/purpose.** Decode/spell reviewed `th, sh, ch, ph, wh, ng, ck, qu` and
contextual consonant patterns.
**Response/template.** Audio/text match or completion.
**Derivation.** grapheme, lexeme, position, profile.
**Difficulty.** L1 `sh/ch`; L2 voiced/voiceless `th`; L3 `ng/wh`; L4 loans/
exceptions.
**Distractors.** one value per digraph.
**Validation.** Lexeme/profile audio.

### Family `silent_letter_pattern`

**Task/purpose.** Preserve and recognize silent letters in high-frequency
reviewed words/families.
**Response/template.** Spelling completion, audio match, or family comparison.
**Derivation.** lexical spelling and morphology.
**Difficulty.** L1 final silent `e`; L2 `kn/wr/mb`; L3 word-family alternation;
L4 loans.
**Distractors.** phonetic deletion or pronounce all letters.
**Validation.** Lexicon.

### Family `syllable_segmentation`

**Task/purpose.** Segment reviewed words and locate vowel nuclei as preparation
for stress/reduction.
**Response/template.** Boundary placement or ordered chunks.
**Derivation.** authored phonological syllabification.
**Difficulty.** L1 simple; L2 consonant clusters; L3 syllabic consonant; L4
derived word.
**Distractors.** one written vowel per syllable.
**Validation.** Pronunciation registry.

### Family `lexical_word_stress`

**Task/purpose.** Locate primary stress and distinguish reviewed stress-shift/
meaning contrasts.
**Response/template.** Syllable choice or audio/text match.
**Derivation.** lexeme/form/profile stress.
**Difficulty.** L1 two syllables; L2 longer word; L3 noun/verb or derived
contrast; L4 profile audio.
**Distractors.** fixed first/penultimate stress.
**Validation.** Lexical stress data.

### Family `word_family_stress`

**Task/purpose.** Track stress and vowel changes across a reviewed derivational
word family.
**Response/template.** Form/audio matching or missing family member.
**Derivation.** reviewed word-family links.
**Difficulty.** L2 stable stress; L3 shift/reduction; L4 spelling constant with
sound change.
**Distractors.** preserve citation pronunciation mechanically.
**Validation.** Family registry.

### Family `schwa_unstressed_vowel`

**Task/purpose.** Recognize schwa/reduced vowels in unstressed syllables while
retaining lexical spelling.
**Response/template.** Audio alignment, stress selection, or spelling with cue.
**Derivation.** stress, lexeme, profile/rate.
**Difficulty.** L1 common final syllable; L2 medial; L3 alternate reduction;
L4 connected phrase.
**Distractors.** spell schwa with one universal letter.
**Validation.** Audio/stress annotations.

### Family `grammar_word_weak_form`

**Task/purpose.** Recognize strong/weak forms of articles, pronouns,
prepositions, auxiliaries, and conjunctions from focus/context.
**Response/template.** Audio/text alignment or focus choice.
**Derivation.** grammar word, stress/focus, phrase position, profile.
**Difficulty.** L2 `a/the/to`; L3 auxiliaries/pronouns; L4 contrastive strong
form.
**Distractors.** weak forms always or citation forms everywhere.
**Validation.** Human-reviewed phrase audio.

### Family `plural_third_s_pronunciation`

**Task/purpose.** Select /s/, /z/, or /ɪz/-type realization of inflectional
`-s/-es` under the declared profile.
**Response/template.** Sound category, audio match, or ending choice.
**Derivation.** final stem sound and morphological function.
**Difficulty.** L1 voiceless/voiced; L2 sibilant; L3 irregular spelling; L4
phrase audio.
**Distractors.** spelling letter determines sound.
**Validation.** Independent phonological classifier/audio.

### Family `past_ed_pronunciation`

**Task/purpose.** Select /t/, /d/, or /ɪd/-type realization of regular past/
participle `-ed`.
**Response/template.** Sound category or audio/form match.
**Derivation.** final stem sound.
**Difficulty.** L1 clear pair; L2 alveolar stop; L3 spelling confusions; L4
connected audio.
**Distractors.** pronounce a full extra syllable everywhere.
**Validation.** Phonological oracle.

### Family `contraction_form_expansion`

**Task/purpose.** Match reviewed contractions to the syntactically licensed
full form.
**Response/template.** Expansion choice, completion, or audio match.
**Derivation.** subject/auxiliary/modal, following complement, polarity.
**Difficulty.** L1 `I'm/isn't`; L2 `'ll/'ve`; L3 ambiguous `'s/'d`; L4 negative
profile variants.
**Distractors.** one expansion per apostrophe sequence.
**Validation.** Source parse.

### Family `connected_speech_linking`

**Task/purpose.** Recover word boundaries and reviewed linking/resyllabification
in normal speech.
**Response/template.** Transcript alignment or boundary placement.
**Derivation.** phrase segments, rate, profile.
**Difficulty.** L2 consonant-vowel; L3 intrusive/linking phenomena by profile;
L4 reductions.
**Constraints.** No one universal linking rule.
**Validation.** Timed human audio.

### Family `rhoticity_profile`

**Task/purpose.** Recognize rhotic/non-rhotic and linking-`r` realizations in
declared profiles.
**Response/template.** Audio-word match or feature classification.
**Derivation.** orthographic `r`, position, following sound, profile.
**Difficulty.** L2 postvocalic contrast; L3 linking; L4 connected speech.
**Constraints.** No ranking or speaker-origin guessing.
**Validation.** Matched profile audio.

### Family `vowel_merger_profile`

**Task/purpose.** Determine whether a reviewed lexical vowel contrast is
maintained or merged in a declared pronunciation profile.
**Response/template.** Same/different audio judgment or profile match.
**Derivation.** lexical set and profile.
**Difficulty.** L3 one merger; L4 multiple profiles/context.
**Constraints.** Never score a merged pair as deficient discrimination.
**Validation.** Specialist-reviewed recordings.

### Family `contextual_homophone_spelling`

**Task/purpose.** Choose spelling among reviewed homophones from grammar and
meaning.
**Response/template.** Word completion or meaning match.
**Derivation.** sentence semantic/syntactic frame.
**Difficulty.** L1 `to/too/two`; L2 possessive/contraction; L3 lexical pair; L4
connected dictation.
**Distractors.** sound-only answer.
**Validation.** Context entails one form.

### Family `capitalization_punctuation_profile`

**Task/purpose.** Apply sentence/name/title capitalization and basic
punctuation under the declared editorial profile.
**Response/template.** Repair or punctuation choice.
**Derivation.** syntax, entity type, genre/profile.
**Difficulty.** L1 sentence/name; L2 list/apostrophe; L3 quotation; L4 profile
difference.
**Validation.** Editorial policy.

### Family `hyphen_word_boundary`

**Task/purpose.** Preserve reviewed open, hyphenated, and closed compounds and
modifier boundaries.
**Response/template.** Boundary insertion or error repair.
**Derivation.** lexical entry/construction and editorial profile.
**Difficulty.** L2 familiar compound; L3 attributive modifier; L4 profile/
meaning contrast.
**Distractors.** one spacing rule for all compounds.
**Validation.** Lexical/editorial registry.

### Family `audio_spelling_dictation`

**Task/purpose.** Write a reviewed word/phrase from audio plus enough context
to determine spelling.
**Response/template.** Text or named fields.
**Derivation.** recording, transcript, semantic/grammar cue, profile.
**Difficulty.** L1 regular word; L2 silent/digraph; L3 homophone/weak form; L4
normal-rate phrase.
**Constraints.** Reject underdetermined audio-only prompts.
**Validation.** Transcript/audio/manual review.

### Family `sound_spelling_audit`

**Task/purpose.** Find one grapheme, stress, weak form, ending, contraction,
boundary, spelling, or profile mismatch.
**Response/template.** Span selection plus correction.
**Derivation.** One typed mutation in a valid item.
**Difficulty.** L2 word; L3 phrase; L4 cross-modal/profile evidence.
**Validation.** One root fault; correction restores source.

### Cross-family progression

Begin with frequent lexical sound–spelling, syllables, and stress. Add schwa and
weak forms before normal-rate boundary recovery. Teach inflectional endings
through morphology plus audio. Contractions require syntax. Profile contrasts
come after one production profile is stable.

## 3. Category: Vocabulary, nouns, articles, quantifiers, and agreement

### Category purpose

Train useful lexical retrieval and construct noun phrases from countability,
number, reference, article/determiner choice, possession, quantification,
modification, comparison, pronoun form, preposition, and profile conventions.

### Learn-card content

- Learn a noun with its sense and countability: `a coffee` can mean one serving;
  `coffee` can mean the substance.
- Singular count nouns normally need a determiner: `a book`, `the book`, `my
  book`.
- `a/an` depends on the following sound, not simply the written first letter:
  `an hour`, `a university`.
- `the` signals an identifiable referent for the listener/reader; first mention
  versus later mention is useful but not the whole rule.
- Zero article occurs with many plural/noncount generic and institutional
  uses; it is not “no decision.”
- `many/few` typically select count plural; `much/little` select noncount.
- Adjectives do not agree for noun gender/number, but order and comparison
  matter.

### Prerequisites

Category 2 basic spelling and `a/the` weak-form recognition.

### Category boundaries

This category owns nominal reference, countability, quantification,
modification, and lexical prepositions. Clause-level pronoun reference belongs
to Category 5. Verb complement/preposition frames belong to Category 4.

### Common misconceptions

- Treating countability as a permanent property of a spelling rather than a
  sense/construction.
- Leaving a singular count noun bare.
- Choosing `a/an` by written vowel letter.
- Using `the` for every specific noun or after every prior mention regardless
  of reference.
- Copying an interface-language article onto proper, generic, institutional, or
  noncount nouns.
- Using `much` with count plurals or `many` with noncount nouns.
- Adding plural `-s` to every noun or apostrophe before plural `s`.
- Making adjectives agree with plural nouns.

### Family `contextual_lexeme_choice`

**Task/purpose.** Choose a reviewed word/sense for a scene or sentence.
**Response/template.** Choice, matching, or bounded completion.
**Derivation.** semantic frame, sense, domain, register/profile.
**Difficulty.** L1 concrete contrast; L2 polysemy; L3 collocation; L4 register.
**Distractors.** same topic but wrong sense.
**Validation.** Sense annotations.

### Family `collocation_phrase_choice`

**Task/purpose.** Retrieve common lexical combinations rather than translate
word by word.
**Response/template.** Completion, ordering, or matching.
**Derivation.** reviewed collocation with inflectable slots.
**Difficulty.** L1 fixed phrase; L2 adjective+noun/verb+noun; L3 preposition/
register; L4 profile.
**Distractors.** literal calques/non-collocations.
**Validation.** Collocation registry.

### Family `noun_countability_sense`

**Task/purpose.** Classify/use a noun sense as count, noncount, or flexible in a
specific context.
**Response/template.** Classification, article/number choice, or meaning match.
**Derivation.** sense, individuation/measure, discourse.
**Difficulty.** L1 clear count/noncount; L2 serving/type shifts; L3 abstract/
material; L4 profile usage.
**Distractors.** lemma-level permanent countability.
**Validation.** Sense-specific frames.

### Family `regular_plural_spelling`

**Task/purpose.** Form regular plurals with `-s/-es` and reviewed spelling
changes.
**Response/template.** Form input or transformation.
**Derivation.** noun stem ending and spelling rule.
**Difficulty.** L1 `-s`; L2 sibilant `-es`; L3 consonant+`y`/`f`; L4 lexical
exceptions.
**Distractors.** apostrophe plural.
**Validation.** Morphological oracle.

### Family `irregular_plural`

**Task/purpose.** Retrieve high-frequency irregular, zero, and learned/borrowed
plural forms in reviewed usage.
**Response/template.** Matching or missing form.
**Derivation.** lexical paradigm/profile.
**Difficulty.** L2 `children/men`; L3 zero/variant; L4 borrowed profile choice.
**Constraints.** Store alternatives and meanings.
**Validation.** Lexicon.

### Family `possessive_s_form`

**Task/purpose.** Form singular/plural possessives and attach the apostrophe/
`s` to the correct possessor phrase.
**Response/template.** Form repair or phrase transformation.
**Derivation.** possessor number/form and phrase boundary.
**Difficulty.** L1 singular; L2 regular plural; L3 irregular plural/multiword
possessor; L4 profile style.
**Distractors.** plural/possessive confusion.
**Validation.** Possessor tree/editorial policy.

### Family `possessive_of_choice`

**Task/purpose.** Choose a natural reviewed `’s` or `of` construction from
possessor type, relation, length, information structure, and register.
**Response/template.** Construction choice or controlled rewrite.
**Derivation.** relation and discourse frame.
**Difficulty.** L2 human versus part; L3 organization/time/measure; L4
overlapping licensed alternatives.
**Constraints.** No simplistic animate-only rule.
**Validation.** Authored construction profiles.

### Family `indefinite_article_a_an`

**Task/purpose.** Choose `a/an` from following pronunciation and indefinite
singular-count reference.
**Response/template.** Article choice or phrase.
**Derivation.** next pronounced segment, countability, reference.
**Difficulty.** L1 vowel/consonant sound; L2 silent `h`/`u`; L3 abbreviation/
number; L4 profile pronunciation.
**Distractors.** first written letter only.
**Validation.** Pronunciation and determination.

### Family `definite_article_reference`

**Task/purpose.** Choose `the` from shared identifiability, prior discourse,
uniqueness, situational context, or licensed construction.
**Response/template.** `the`/other/zero choice or referent match.
**Derivation.** discourse-reference model.
**Difficulty.** L1 known versus new; L2 unique/situational; L3 associative/
superlative; L4 competing referents.
**Distractors.** specificity or second mention alone.
**Validation.** Referential uniqueness.

### Family `zero_article_generic`

**Task/purpose.** Use zero article with reviewed plural/noncount generic,
institutional, meal, transport, language, and proper-name classes.
**Response/template.** Article/zero choice.
**Derivation.** genericity, countability, institutional role, name class.
**Difficulty.** L1 plural/noncount generic; L2 institution/meal; L3 geographic
name; L4 contrastive definite reading.
**Distractors.** zero means indefinite only.
**Validation.** Construction registry.

### Family `article_minimal_contrast`

**Task/purpose.** Explain how `a/an`, `the`, or zero changes reference in a
matched context.
**Response/template.** Meaning match or article completion.
**Derivation.** paired discourse models.
**Difficulty.** L2 introduce/identify; L3 generic/institutional; L4 abstract/
proper-name contrast.
**Validation.** Pairwise entailment.

### Family `demonstrative_reference`

**Task/purpose.** Select `this/that/these/those` from number, spatial/discourse
distance, and stance.
**Response/template.** Form choice or referent match.
**Derivation.** deixis and noun number.
**Difficulty.** L1 visible distance; L2 discourse reference; L3 stance; L4
profile usage.
**Distractors.** singular/plural mismatch.
**Validation.** Deictic state.

### Family `possessive_determiner_pronoun`

**Task/purpose.** Distinguish forms such as `my/mine`, `your/yours`,
`their/theirs` by syntactic slot and possessor.
**Response/template.** Form choice or transformation.
**Derivation.** possessor features and presence/absence of noun head.
**Difficulty.** L1 first/second; L2 third; L3 competing referents; L4
coordination.
**Distractors.** apostrophe in possessive pronouns.
**Validation.** Possession parse.

### Family `some_any_no`

**Task/purpose.** Choose `some/any/no` and compounds from polarity,
question/request expectation, free-choice meaning, and noun type.
**Response/template.** Determiner/pronoun choice.
**Derivation.** logical polarity and speech act.
**Difficulty.** L1 affirmative/negative; L2 questions/offers; L3 free choice;
L4 scope.
**Distractors.** any in every question/negative only.
**Validation.** Logical/pragmatic frame.

### Family `many_much_few_little`

**Task/purpose.** Select count/noncount quantifiers and distinguish neutral,
small, and insufficient quantities.
**Response/template.** Quantifier choice or meaning match.
**Derivation.** countability, quantity, polarity/evaluation.
**Difficulty.** L1 many/much; L2 few/little; L3 a few/a little; L4 register/
scope.
**Distractors.** countability swap or ignore article meaning.
**Validation.** Quantity model.

### Family `each_every_all_both`

**Task/purpose.** Choose distributive/collective quantifiers from set size,
individual/whole perspective, and noun form.
**Response/template.** Form choice or set-diagram match.
**Derivation.** quantified-set model.
**Difficulty.** L2 each/every; L3 all/both; L4 `all of/each of`.
**Distractors.** singular/plural mismatch.
**Validation.** Set semantics.

### Family `adjective_attributive_predicative`

**Task/purpose.** Place reviewed adjectives in attributive/predicative slots and
recognize adjectives restricted by construction.
**Response/template.** Ordering, completion, or classification.
**Derivation.** adjective lexical profile and predication.
**Difficulty.** L1 common both; L2 predicative-only; L3 participial/meaning
shift; L4 multiple modifiers.
**Distractors.** imported agreement endings.
**Validation.** Construction registry.

### Family `adjective_order`

**Task/purpose.** Order multiple reviewed adjectives from semantic class,
coordination, fixed collocation, and intended focus.
**Response/template.** Ordered chunks or punctuation choice.
**Derivation.** property classes and discourse.
**Difficulty.** L2 two clear classes; L3 coordinate versus cumulative; L4
lexicalized order.
**Constraints.** Avoid presenting one rigid mnemonic as exceptionless.
**Validation.** Human-reviewed phrase grammar.

### Family `comparative_superlative`

**Task/purpose.** Form/use regular, analytic, and irregular comparison.
**Response/template.** Form input, relation match, or completion.
**Derivation.** adjective class, degree, comparison set.
**Difficulty.** L1 `-er/-est`; L2 spelling; L3 more/most/irregular; L4 `less/
least`.
**Distractors.** double marking.
**Validation.** Paradigm and order relation.

### Family `comparison_complement`

**Task/purpose.** Construct equality/inequality comparisons with reviewed
`than`, `as ... as`, pronoun/case, and measurement patterns.
**Response/template.** Ordered chunks or meaning match.
**Derivation.** ordered quantities/entities and profile/register.
**Difficulty.** L2 than; L3 equality/amount; L4 pronoun/formal variant.
**Validation.** Numeric/semantic oracle.

### Family `subject_object_pronoun`

**Task/purpose.** Select personal-pronoun form from participant role, person,
number, gender/reference, and register.
**Response/template.** Form choice or referent matching.
**Derivation.** event-role graph.
**Difficulty.** L1 I/me; L2 third/plural; L3 coordination; L4 formal variants.
**Distractors.** position-only case.
**Validation.** Role/reference.

### Family `reflexive_pronoun`

**Task/purpose.** Use reflexive/emphatic forms when the construction binds or
emphasizes the subject, and reject unnecessary reflexives.
**Response/template.** Form/function choice.
**Derivation.** binding relation and discourse emphasis.
**Difficulty.** L2 self-object; L3 emphatic; L4 reciprocal/ordinary object
contrast.
**Distractors.** polite reflexive in place of `me`.
**Validation.** Binding graph.

### Family `singular_they_reference`

**Task/purpose.** Use/resolve singular `they/them/their` and reviewed
`themself/themselves` variants for unknown, nonbinary, generic, or explicitly
stated reference.
**Response/template.** Pronoun choice or referent linking.
**Derivation.** discourse entity number semantics and identity information.
**Difficulty.** L1 unknown person; L2 indefinite antecedent; L3 explicit
identity; L4 verb/reflexive consistency.
**Distractors.** force gender or plural referent.
**Validation.** Reference/agreement graph and profile policy.

### Family `preposition_space_time`

**Task/purpose.** Select common spatial/temporal prepositions from relation and
profile.
**Response/template.** Scene/timeline match or completion.
**Derivation.** spatial/temporal graph and lexical place/time class.
**Difficulty.** L1 in/on/at; L2 direction/from/by; L3 duration/deadline; L4
profile variation.
**Distractors.** one translated preposition.
**Validation.** Relation registry.

### Family `number_date_time_price_profile`

**Task/purpose.** Interpret/produce cardinals, ordinals, dates, times, prices,
measures, addresses, and telephone groups under a declared profile.
**Response/template.** Numeric input, fields, or phrase.
**Derivation.** exact object and profile conventions.
**Difficulty.** L1 number/price; L2 time/date; L3 decimals/fractions/units; L4
cross-profile ambiguity.
**Constraints.** Valid fictional values.
**Validation.** Independent calendar/arithmetic.

### Family `noun_phrase_construction`

**Task/purpose.** Build a complete noun phrase from reference, countability,
number, determination, quantity, possession, and modification.
**Response/template.** Ordered chunks or named fields.
**Derivation.** discourse and feature model.
**Difficulty.** L1 article+noun; L2 adjective/possessive; L3 quantifier/
compound; L4 multiple modifiers.
**Distractors.** locally valid incompatible forms.
**Validation.** Back-parse/unification.

### Family `nominal_reference_audit`

**Task/purpose.** Locate one countability, plural, article, determiner,
quantifier, pronoun, adjective, possessive, or preposition fault.
**Response/template.** Fault selection and repair.
**Derivation.** One typed mutation in a valid phrase/sentence.
**Difficulty.** L2 local; L3 discourse reference; L4 profile/meaning-sensitive.
**Validation.** Exactly one root fault.

### Cross-family progression

Teach singular count nouns with determiner, then plural/noncount and basic
`a/the/zero`. Generate article choices from miniature discourse, not isolated
sentences. Add quantifiers by countability and logic. Introduce pronouns only
with explicit referents. Reuse all features in full noun phrases.

## 4. Category: Verbs, tense, aspect, modality, complements, and voice

### Category purpose

Train verb principal forms and select tense/aspect, auxiliary, modal/future,
complement, particle/preposition, and voice constructions from an intended
event.

### Learn-card content

- Learn principal forms: `write – writes – wrote – written – writing`.
- Present simple often describes routines, states, and schedules; present
  progressive presents an event as ongoing/temporary in context.
- Perfect relates a prior event/state to a reference time: `has written`.
  Progressive and perfect can combine: `has been writing`.
- English future meaning uses present forms, `will`, `be going to`, present
  progressive, and other constructions depending on prediction, intention,
  arrangement, and schedule.
- Modals take a bare infinitive and have meanings shaped by context.
- Verbs select complements: `enjoy reading`, `want to read`, `make someone
  read`. Store the whole frame.
- Phrasal verbs store meaning and separability: `turn it off`, not *`turn off
  it`* for the ordinary separable sense.

### Prerequisites

Category 2 endings/contractions and Category 3 subject/noun-phrase features.

### Category boundaries

This category owns verb forms, events, auxiliaries, complements, particles,
prepositions, and voice. Negation/inversion/question mechanics belong to
Category 5. Discourse-wide tense tracking belongs to Category 6.

### Common misconceptions

- Omitting third-person singular `-s` or adding it to modal/other persons.
- Using progressive with every present event or banning all stative progressive
  uses without sense/context.
- Treating preterite and past participle as interchangeable.
- Choosing present perfect for any completed event.
- Using `will` for every future.
- Adding `to` after modals.
- Selecting gerund/infinitive from meaning-free rules.
- Translating phrasal verb parts separately or ignoring pronoun placement.
- Building passives from intransitive/unlicensed senses.

### Family `verb_principal_forms`

**Task/purpose.** Associate a verb sense with base, third singular, preterite,
past participle, and `-ing` forms.
**Response/template.** Matching or missing form set.
**Derivation.** sense-specific paradigm.
**Difficulty.** L1 regular; L2 spelling changes; L3 irregular; L4 same lemma/
sense variation.
**Validation.** Exhaustive lexicon.

### Family `be_paradigm`

**Task/purpose.** Select forms of `be` from subject, tense, and construction.
**Response/template.** Form input or clause completion.
**Derivation.** person/number, tense, finite/nonfinite/participle.
**Difficulty.** L1 present; L2 past; L3 perfect/progressive/passive chains; L4
subjunctive/conditional only in reviewed frames.
**Distractors.** regularized forms.
**Validation.** Exhaustive paradigm.

### Family `have_do_lexical_auxiliary`

**Task/purpose.** Distinguish lexical and auxiliary uses of `have/do` and select
the appropriate form.
**Response/template.** Function classification or completion.
**Derivation.** event/complement and auxiliary chain.
**Difficulty.** L1 possession/action; L2 perfect/do-support; L3 have got/profile;
L4 causative.
**Validation.** Source parse.

### Family `third_person_s`

**Task/purpose.** Form present-simple third-person singular, including spelling
and `have/do/be` exceptions.
**Response/template.** Form input or transformation.
**Derivation.** subject features and present-simple verb.
**Difficulty.** L1 regular; L2 spelling; L3 irregular; L4 coordinated/
indefinite subject.
**Distractors.** plural `s` logic or modal `s`.
**Validation.** Agreement/paradigm.

### Family `present_simple_use`

**Task/purpose.** Choose/form present simple for states, routines, general
facts, performatives, and schedules in reviewed contexts.
**Response/template.** Tense choice or completion.
**Derivation.** event/state/habit and time frame.
**Difficulty.** L1 routine/state; L2 schedule; L3 performative/commentary; L4
future-time clause.
**Validation.** Event model.

### Family `present_progressive_form`

**Task/purpose.** Build `be + -ing` with correct auxiliary agreement and
participle spelling.
**Response/template.** Named forms or sentence completion.
**Derivation.** subject and present progressive.
**Difficulty.** L1 singular; L2 plural/spelling; L3 negative/question chain
later; L4 particle.
**Validation.** Auxiliary chain.

### Family `simple_progressive_choice`

**Task/purpose.** Choose simple/progressive from state/event, current internal
view, temporary situation, development, repetition with stance, and schedule.
**Response/template.** Form/meaning choice or timeline.
**Derivation.** event viewpoint and lexical sense.
**Difficulty.** L2 routine versus now; L3 temporary/state-sense contrast; L4
stance/future arrangement.
**Distractors.** now always progressive; stative lemma never progressive.
**Validation.** Sense-specific event model.

### Family `regular_past_form`

**Task/purpose.** Form regular preterite/past participle spelling.
**Response/template.** Form input or transformation.
**Derivation.** stem spelling.
**Difficulty.** L1 `-ed`; L2 final `e/y`; L3 consonant doubling; L4 profile/
lexical variant.
**Validation.** Morphological oracle.

### Family `irregular_past_participle`

**Task/purpose.** Retrieve high-frequency irregular preterite and participle.
**Response/template.** Matching or missing form.
**Derivation.** lexical paradigm.
**Difficulty.** L1 same forms; L2 vowel change; L3 three distinct forms; L4
profile variants `got/gotten`.
**Distractors.** regularized or swapped forms.
**Validation.** Profile-tagged lexicon.

### Family `past_simple_use`

**Task/purpose.** Use simple past for events/states located in a finished past
time or narrative sequence.
**Response/template.** Form choice or timeline.
**Derivation.** event/reference interval.
**Difficulty.** L1 explicit yesterday; L2 sequence; L3 background state; L4
politeness/hypothetical later.
**Validation.** Temporal model.

### Family `past_progressive`

**Task/purpose.** Build/use past progressive for an event viewed internally
around a past reference time.
**Response/template.** Form, timeline, or clause pairing.
**Derivation.** interval overlap/background.
**Difficulty.** L2 single background; L3 interruption; L4 parallel events/
stative sense.
**Distractors.** duration alone.
**Validation.** Interval oracle.

### Family `present_perfect_form`

**Task/purpose.** Build `have/has + past participle`.
**Response/template.** Auxiliary/participle fields or completion.
**Derivation.** subject and perfect construction.
**Difficulty.** L2 regular; L3 irregular/contraction; L4 particle/passive.
**Distractors.** preterite after `have`.
**Validation.** Auxiliary chain.

### Family `past_present_perfect_choice`

**Task/purpose.** Choose simple past/present perfect from finished/open time,
current relevance, experience, result, and active profile.
**Response/template.** Form choice, timeline, or minimal contrast.
**Derivation.** event/reference model and profile.
**Difficulty.** L2 explicit finished versus ever/never; L3 recent result/open
period; L4 profile-sensitive `just/already/yet`.
**Validation.** Authored profile-aware contexts.

### Family `present_perfect_progressive`

**Task/purpose.** Build/interpret `have been -ing` and contrast duration/
ongoing evidence with simple perfect.
**Response/template.** Form/meaning choice.
**Derivation.** event duration, continuation/result, lexical sense.
**Difficulty.** L3 ongoing duration; L4 completed activity with evidence and
state contrast.
**Validation.** Event-state model.

### Family `past_perfect_sequence`

**Task/purpose.** Relate an event before a past reference event with past
perfect where discourse requires it.
**Response/template.** Timeline/order or form choice.
**Derivation.** event intervals and narrative perspective.
**Difficulty.** L3 explicit prior event; L4 when simple past also possible but
context selects viewpoint.
**Validation.** Temporal/discourse model.

### Family `future_construction_choice`

**Task/purpose.** Choose present, present progressive, `will`, or `be going to`
from schedule, arrangement, intention/evidence, decision, and prediction.
**Response/template.** Construction choice or completion.
**Derivation.** future event, evidence, agency, prior plan.
**Difficulty.** L2 clear schedule/intention; L3 decision/prediction; L4
overlapping profile/pragmatic context.
**Distractors.** will everywhere.
**Validation.** Authored future frame.

### Family `will_going_to_contrast`

**Task/purpose.** Interpret/produce decisive contrasts between `will` and
`be going to`.
**Response/template.** Meaning match or dialogue completion.
**Derivation.** prior intention, present evidence, spontaneous decision,
prediction stance.
**Difficulty.** L2 clear intention/decision; L3 evidence; L4 offers/promises.
**Constraints.** Reject decontextualized universal rules.
**Validation.** Dialogue/world state.

### Family `modal_form`

**Task/purpose.** Build modal + bare infinitive with correct negative/
contraction and no agreement/`to`.
**Response/template.** Ordered chunks or form repair.
**Derivation.** modal, subject, polarity.
**Difficulty.** L1 can; L2 should/must/may; L3 past/periphrastic alternative;
L4 perfect modal.
**Validation.** Modal chain.

### Family `modal_meaning`

**Task/purpose.** Choose a modal/periphrasis for ability, permission,
obligation, advice, probability, willingness, or deduction.
**Response/template.** Form choice or world-strength scale.
**Derivation.** modality type, source, time, politeness, register/profile.
**Difficulty.** L1 ability/permission; L2 advice/obligation; L3 probability;
L4 deduction/past.
**Distractors.** one translation per modal.
**Validation.** Possible-world model.

### Family `imperative_request`

**Task/purpose.** Form positive/negative imperatives and match directness to a
declared instruction/request context.
**Response/template.** Form input or appropriateness choice.
**Derivation.** speech act, polarity, urgency, register.
**Difficulty.** L1 instruction; L2 `don't`; L3 inclusive `let's`; L4 softened
alternative.
**Validation.** Speech-act grammar.

### Family `gerund_infinitive_frame`

**Task/purpose.** Select `-ing`, `to`-infinitive, or bare infinitive after a
reviewed verb/adjective/noun sense.
**Response/template.** Complement choice or sentence completion.
**Derivation.** sense-specific complement frame.
**Difficulty.** L2 enjoy/want/modal; L3 begin/remember/stop meaning contrasts;
L4 profile/optionality.
**Distractors.** one semantic slogan.
**Validation.** Valency registry.

### Family `object_complement_control`

**Task/purpose.** Build reviewed verb + object + bare/to-infinitive/adjective/
noun complement frames and identify the understood subject.
**Response/template.** Ordering, role diagram, or form choice.
**Derivation.** matrix sense and control/raising structure.
**Difficulty.** L3 want/tell/make/let; L4 perception/causative/passive.
**Distractors.** omit object or wrong infinitive marker.
**Validation.** Participant/control graph.

### Family `phrasal_verb_identity`

**Task/purpose.** Distinguish particle verbs from verb+preposition/adverbial
phrases using sense, stress, transitivity, and structure.
**Response/template.** Classification or audio/parse match.
**Derivation.** lexical frame and prosody.
**Difficulty.** L2 clear particle; L3 same words/different parse; L4 profile
audio.
**Validation.** Lexical parse/audio.

### Family `phrasal_verb_meaning`

**Task/purpose.** Retrieve the whole sense/arguments of a reviewed phrasal verb.
**Response/template.** Meaning/event match or completion.
**Derivation.** lexical sense.
**Difficulty.** L1 transparent direction; L2 frequent idiomatic; L3 polysemous;
L4 register/profile.
**Distractors.** word-by-word composition.
**Validation.** Sense registry.

### Family `particle_separability_position`

**Task/purpose.** Place noun/pronoun objects around separable/inseparable
particles correctly.
**Response/template.** Ordering or error repair.
**Derivation.** sense-specific separability, object form/weight.
**Difficulty.** L2 noun object; L3 pronoun; L4 verb chain/long object.
**Distractors.** *turn off it* or split inseparable frame.
**Validation.** Particle automaton.

### Family `verb_preposition_government`

**Task/purpose.** Select lexical preposition/complement for a reviewed
verb/adjective/noun sense.
**Response/template.** Preposition choice or completion.
**Derivation.** sense-specific frame.
**Difficulty.** L2 frequent; L3 same lemma/different preposition; L4 phrasal
versus prepositional.
**Distractors.** interface-language calque.
**Validation.** Valency registry.

### Family `passive_form`

**Task/purpose.** Build `be/get + past participle` passive forms in reviewed
tense/aspect/profile combinations.
**Response/template.** Auxiliary/participle fields or transformation.
**Derivation.** patient subject, event time/aspect, passive type.
**Difficulty.** L2 present/past be-passive; L3 modal/perfect; L4 get-passive
profile/register.
**Validation.** Role/auxiliary graph.

### Family `active_passive_choice`

**Task/purpose.** Choose active/passive from agent salience, genre, affectedness,
and lexical licensing while preserving event roles.
**Response/template.** Construction choice or controlled rewrite.
**Derivation.** event/information structure.
**Difficulty.** L3 omitted/expressed agent; L4 process/result/register.
**Distractors.** passive automatically more formal/better.
**Validation.** Human-reviewed frames.

### Family `causative_have_get`

**Task/purpose.** Interpret/construct a bounded set of `have/get + object +
participle/to-infinitive` causative/service frames.
**Response/template.** Role matching or ordering.
**Derivation.** causer, actor, affected object, profile/register.
**Difficulty.** L4 service arrangement versus adverse event.
**Constraints.** Reviewed frames only.
**Validation.** Participant graph.

### Family `verb_chain_construction`

**Task/purpose.** Assemble finite auxiliary/modal, perfect/progressive/passive
layers, lexical verb, particle, and complements.
**Response/template.** Ordered chunks or named slots.
**Derivation.** typed auxiliary-chain grammar.
**Difficulty.** L2 one auxiliary; L3 perfect/progressive/modal; L4 passive/
particle combinations.
**Validation.** Back-parse feature identity.

### Family `verb_tense_complement_audit`

**Task/purpose.** Locate one form, tense/aspect, auxiliary, modal, complement,
particle/preposition, object-position, or passive fault.
**Response/template.** Fault selection and repair.
**Derivation.** One mutation in a valid predicate.
**Difficulty.** L2 local; L3 event/frame; L4 auxiliary chain.
**Validation.** Exactly one root fault.

### Cross-family progression

Teach principal forms, `be`, present simple, and third `-s`. Add progressive as
viewpoint, then past and participle separately. Build perfect before contrasting
it with past. Add future/modal meanings through contexts. Complement and
phrasal frames remain lexical. Add passive after event roles and chains are
secure.

## 5. Category: Auxiliaries, negation, questions, relatives, and clause structure

### Category purpose

Train reference and English clause structure: subject/object order, auxiliary
selection, `do` support, negation, inversion, questions, short answers, tags,
relative/embedded clauses, existential/dummy subjects, and conditionals.

### Learn-card content

- A finite auxiliary carries tense/agreement and comes before `not`:
  `She is not working`; `She has not left`; `She cannot go`.
- If a simple present/past statement has no auxiliary, negation/questions use
  `do/does/did` and the lexical base form: `Does she work?`, not *`Does she
  works?`*
- Yes/no questions invert subject and auxiliary. Subject wh-questions do not
  use ordinary `do` support: `Who called?`; object questions do: `Who did you
  call?`
- Embedded questions use statement-like order: `Do you know where she is?`
- Relative words connect an antecedent to a gap; object relatives may omit the
  marker in licensed contexts.
- `there` can introduce existence; `it` can refer to something or fill weather,
  time, distance, extraposition, and cleft slots.

### Prerequisites

Category 3 pronoun/reference and Category 4 finite/auxiliary forms.

### Category boundaries

This category owns clause syntax, inversion, polarity, questions, relatives,
conditionals, and dummy subjects. Verb-chain construction is Category 4;
multi-clause discourse/register is Category 6.

### Common misconceptions

- Adding `not` directly to a lexical verb without an auxiliary.
- Leaving third-person/past marking on the lexical verb after `does/did`.
- Inverting the lexical verb rather than an auxiliary.
- Using `do` with `be` or a modal in ordinary questions.
- Applying object-question order to a subject wh-question.
- Keeping direct-question inversion inside embedded questions.
- Inflecting `who/which/that` to agree with the antecedent.
- Treating existential `there` as a place adverb or every `it` as referential.

### Family `basic_declarative_order`

**Task/purpose.** Arrange subject, verb chain, objects/complements, and
adverbials in a neutral declarative clause.
**Response/template.** Ordering or role labeling.
**Derivation.** event roles and clause schema.
**Difficulty.** L1 SVC/SVO; L2 ditransitive; L3 particle/complement; L4 adverb
placement.
**Validation.** Source parse.

### Family `clausal_pronoun_reference`

**Task/purpose.** Resolve/select pronouns across a clause from person, number,
gender/identity, role, and discourse salience.
**Response/template.** Entity linking or pronoun choice.
**Derivation.** reference graph.
**Difficulty.** L1 one referent; L2 two genders/numbers; L3 singular they/
indefinite; L4 same-feature competitors.
**Validation.** Unique reference.

### Family `auxiliary_negation`

**Task/purpose.** Place `not`/contraction after an existing `be/have/modal`
finite auxiliary.
**Response/template.** Ordering or negative transformation.
**Derivation.** auxiliary chain, polarity, profile.
**Difficulty.** L1 be; L2 progressive/perfect/modal; L3 contraction variant;
L4 scope.
**Validation.** Chain grammar.

### Family `do_support_negation`

**Task/purpose.** Negate simple present/past lexical predicates with
`do/does/did not + base`.
**Response/template.** Named forms or transformation.
**Derivation.** tense, subject, polarity, absence of other auxiliary.
**Difficulty.** L1 do not; L2 third singular; L3 past/irregular lexical verb;
L4 emphasis.
**Distractors.** double tense/agreement.
**Validation.** Feature redistribution.

### Family `yes_no_aux_inversion`

**Task/purpose.** Form yes/no questions by inverting an existing auxiliary and
subject.
**Response/template.** Ordering or transformation.
**Derivation.** clause/auxiliary chain.
**Difficulty.** L1 be; L2 progressive/perfect/modal; L3 negative; L4 multiword
subject.
**Validation.** Question parse.

### Family `do_support_question`

**Task/purpose.** Form present/past yes/no questions with `do/does/did` and base
lexical verb.
**Response/template.** Named forms or ordering.
**Derivation.** tense, subject, lexical predicate.
**Difficulty.** L1 do; L2 does; L3 did/irregular; L4 particle/complement.
**Distractors.** double marking.
**Validation.** Feature redistribution.

### Family `wh_subject_object_question`

**Task/purpose.** Select wh-word and subject-question versus non-subject
inversion/`do` structure.
**Response/template.** Question construction or role match.
**Derivation.** information gap and event role.
**Difficulty.** L1 what/where; L2 who subject/object; L3 preposition/quantity;
L4 long subject.
**Distractors.** `Who did call?` for neutral subject question.
**Validation.** Question-to-answer graph.

### Family `wh_form_case`

**Task/purpose.** Choose `who/whom/whose/which/what` and related forms under a
declared register/profile.
**Response/template.** Form choice or gap completion.
**Derivation.** participant role, possession, selection set, register.
**Difficulty.** L2 who/whose; L3 which/what; L4 whom/profile.
**Constraints.** Do not mark established informal `who` object use wrong.
**Validation.** Role/register policy.

### Family `embedded_question_order`

**Task/purpose.** Form embedded wh and whether/if questions without direct-
question inversion.
**Response/template.** Ordering, connector choice, or transformation.
**Derivation.** matrix predicate and embedded gap.
**Difficulty.** L2 where she is; L3 if/whether; L4 negative/infinitival.
**Distractors.** *where is she* inside clause.
**Validation.** Two-clause parse.

### Family `short_answer_auxiliary`

**Task/purpose.** Produce/interpret short answers using the question's
auxiliary, subject pronoun, polarity, and profile contraction.
**Response/template.** Short text or matching.
**Derivation.** question proposition/auxiliary.
**Difficulty.** L1 be/do; L2 modal/perfect; L3 negative; L4 correction/emphasis.
**Distractors.** repeat wrong auxiliary or bare yes+verb.
**Validation.** Question-answer state.

### Family `question_tag`

**Task/purpose.** Form/interpret common question tags from clause polarity,
auxiliary, subject pronoun, and expected stance.
**Response/template.** Tag fields or meaning match.
**Derivation.** anchor clause and pragmatic expectation.
**Difficulty.** L3 be/do/modal; L4 irregular imperatives/`I am` and profile
intonation in reviewed subset.
**Validation.** Auxiliary/polarity/prosody registry.

### Family `negative_indefinite_scope`

**Task/purpose.** Choose `not ... any`, `no`, `nothing/nobody/never`, and
profile-appropriate negative concord interpretation.
**Response/template.** Form/meaning choice.
**Derivation.** logical scope and target variety.
**Difficulty.** L2 any/no; L3 negative pronouns; L4 negative concord receptive
profile.
**Constraints.** Do not stigmatize established dialect grammar; neutral
production remains explicit.
**Validation.** Logical/profile grammar.

### Family `adverb_position`

**Task/purpose.** Place frequency, manner, time, focus, and sentence adverbs
relative to auxiliaries, lexical verbs, complements, and clause boundaries.
**Response/template.** Ordering or meaning match.
**Derivation.** adverb class, scope, information structure.
**Difficulty.** L2 frequency; L3 auxiliary chains/manner; L4 focus ambiguity.
**Distractors.** one universal position.
**Validation.** Scope/slot grammar.

### Family `relative_who_which_that`

**Task/purpose.** Select a reviewed relative marker from antecedent type,
restrictiveness, gap role, and profile/register.
**Response/template.** Marker choice or clause completion.
**Derivation.** antecedent-gap graph and construction.
**Difficulty.** L2 person/thing; L3 restrictive/nonrestrictive; L4 that/profile
constraints.
**Validation.** Relative grammar.

### Family `relative_object_omission`

**Task/purpose.** Determine whether an object relative marker may be omitted and
distinguish it from subject relatives.
**Response/template.** Marker/zero choice or parse.
**Derivation.** gap role, clause structure, register.
**Difficulty.** L2 clear object; L3 embedded subject; L4 preposition/profile.
**Distractors.** omit subject relative.
**Validation.** Gap graph.

### Family `relative_whose_preposition`

**Task/purpose.** Form possessive and prepositional relatives under reviewed
formal/informal profiles.
**Response/template.** Relative/preposition choice or ordering.
**Derivation.** gap relation and register.
**Difficulty.** L3 whose/final preposition; L4 pied-piping/whom profile.
**Validation.** Government/register.

### Family `coordination_subordination`

**Task/purpose.** Choose a coordinator/subordinator and construct licensed
clause structure for addition, contrast, cause, result, time, and concession.
**Response/template.** Connector/order pair.
**Derivation.** discourse relation and clause type.
**Difficulty.** L1 and/but; L2 because/so/when; L3 although/while; L4 scope.
**Validation.** Relation/parse.

### Family `conditional_real_hypothetical`

**Task/purpose.** Build/interpret reviewed real, predictive, and present/past
hypothetical conditionals from possible-world/time meaning.
**Response/template.** Verb-form fields, clause pairing, or world match.
**Derivation.** condition/consequence world graph.
**Difficulty.** L2 zero/first patterns; L3 second; L4 third/mixed only bounded.
**Constraints.** Do not teach numbered conditionals as the semantic source.
**Validation.** World/time model.

### Family `reported_statement_question`

**Task/purpose.** Report a statement/question with appropriate complementizer,
pronoun, time/place reference, and controlled backshift.
**Response/template.** Structured transformation or matching.
**Derivation.** two speech events and reference times.
**Difficulty.** L3 statement/pronoun; L4 question/backshift/reference.
**Constraints.** Accept licensed no-backshift contexts by profile/meaning.
**Validation.** Speech-event graph.

### Family `existential_there`

**Task/purpose.** Build/interpret existential `there + be` with new referent,
number agreement profile, time, and location.
**Response/template.** Form choice or clause construction.
**Derivation.** existence/presentation frame.
**Difficulty.** L1 there is/are; L2 past/negative; L3 quantifier/modal; L4
agreement profile.
**Distractors.** place-adverb referent.
**Validation.** Existential/discourse model.

### Family `referential_dummy_it`

**Task/purpose.** Classify/use referential `it`, weather/time/distance dummy,
extraposition, and reviewed anticipatory structures.
**Response/template.** Function choice or clause completion.
**Derivation.** reference/construction.
**Difficulty.** L1 referential/weather; L2 time/distance; L3 extraposition; L4
ambiguity.
**Validation.** Typed dependency graph.

### Family `there_it_contrast`

**Task/purpose.** Choose existential/presentational `there`, dummy/referential
`it`, or an ordinary place expression.
**Response/template.** Form/meaning choice.
**Derivation.** discourse-new entity, proposition/weather, location.
**Difficulty.** L2 clear; L3 extraposition; L4 discourse reference.
**Validation.** Semantic construction.

### Family `cleft_focus_recognition`

**Task/purpose.** Recognize a bounded set of `it`-cleft/wh-cleft structures and
identify focused information without open production.
**Response/template.** Focus selection or neutral paraphrase match.
**Derivation.** proposition and focus.
**Difficulty.** L4 reviewed common clefts.
**Validation.** Information-structure graph.

### Family `clause_construction`

**Task/purpose.** Build a complete declarative, negative, interrogative,
relative, conditional, or existential clause from typed cards.
**Response/template.** Ordered chunks or named slots.
**Derivation.** clause grammar, auxiliary chain, reference, scope.
**Difficulty.** L1 statement; L2 negative/question; L3 relative/conditional;
L4 multi-auxiliary.
**Validation.** Back-parse/entailment.

### Family `auxiliary_clause_audit`

**Task/purpose.** Locate one auxiliary, `do`, agreement, inversion, negation,
question, relative, conditional, existential, or `it` fault.
**Response/template.** Fault selection and repair.
**Derivation.** One typed mutation in a valid clause.
**Difficulty.** L2 local; L3 clause contrast; L4 scope/reference.
**Validation.** Exactly one root fault.

### Cross-family progression

Teach declaratives with visible auxiliaries, then auxiliary negation/inversion.
Introduce `do` as feature support and always return the lexical verb to base.
Contrast subject/object wh-questions before embedded order. Relatives reuse gap
roles. Add conditionals, existential/dummy subjects, and reports only after
basic auxiliary syntax is stable.

## 6. Category: Connected English, discourse, register, and profiles

### Category purpose

Train choices across clauses/turns: connectors, temporal/aspect tracking,
reference, information structure, politeness, register, spelling/punctuation,
spoken/written form, and global-profile comprehension.

### Learn-card content

- Individually grammatical clauses can be incoherent if articles, pronouns,
  tense/aspect, or connectors conflict across the discourse.
- `and, but, so, because, although, if, when, while, before, after` encode
  different logical/temporal relations.
- English requests combine modal, wording, intonation, greeting, and context;
  grammatical directness is not automatically rudeness or politeness.
- Contractions, phrasal verbs, passive voice, vocabulary, and punctuation
  interact with medium/register.
- Profile differences are specific: spelling, dates, vocabulary, pronunciation,
  or grammar may differ while the rest remains shared.
- Clear international communication does not require erasing a speaker's
  identity or copying one prestige accent.

### Prerequisites

Core Categories 3–5. Profile-comparison tasks require one production baseline.

### Category boundaries

This category owns relations across clauses/turns and pragmatic/profile
appropriateness. It does not grade open style or cultural interpretation.
Integrated evidence tasks belong to Category 7.

### Common misconceptions

- Selecting a connector from one translated gloss.
- Switching article/pronoun reference without introducing a new entity.
- Using one past form throughout a narrative.
- Treating contractions as always informal or passives as always formal.
- Equating politeness with adding `please` alone.
- Mixing profile spellings/punctuation unpredictably.
- Treating global English pronunciation as deficient imitation.

### Family `connector_relation`

**Task/purpose.** Choose a connector for addition, contrast, cause, result,
condition, concession, or alternative.
**Response/template.** Choice or clause pairing.
**Derivation.** logical/discourse relation and register.
**Difficulty.** L1 and/but/because; L2 so/if; L3 although/despite frame; L4
subtle authored contrast.
**Validation.** Relation graph.

### Family `temporal_sequence`

**Task/purpose.** Order events and choose time connector/tense/aspect consistent
with before, after, overlap, repetition, and prior past.
**Response/template.** Timeline or completion.
**Derivation.** interval/reference graph.
**Difficulty.** L2 explicit; L3 progressive/perfect; L4 reference shift.
**Validation.** Temporal oracle.

### Family `tense_aspect_tracking`

**Task/purpose.** Maintain/deliberately shift simple, progressive, perfect, and
past-reference viewpoint across a short discourse.
**Response/template.** Multiple forms or anomaly selection.
**Derivation.** event/discourse graph.
**Difficulty.** L3 two events; L4 three-to-five event chain/profile.
**Distractors.** one tense throughout.
**Validation.** Event model.

### Family `article_reference_chain`

**Task/purpose.** Introduce, maintain, generalize, and contrast discourse
referents through articles, demonstratives, possessives, and pronouns.
**Response/template.** Determiner/pronoun sequence or entity linking.
**Derivation.** discourse-reference graph.
**Difficulty.** L2 introduce/mention; L3 associative/competing; L4 generic/
specific shift.
**Validation.** Reference uniqueness.

### Family `pronoun_reference_chain`

**Task/purpose.** Resolve/construct coherent personal, singular-they,
demonstrative, reflexive, and `it/there` chains across sentences.
**Response/template.** Linking or controlled rewrite.
**Derivation.** entities/salience/roles.
**Difficulty.** L2 one referent; L3 switch; L4 same-feature competitors.
**Validation.** Reference graph.

### Family `information_structure_choice`

**Task/purpose.** Choose active/passive, existential, cleft, pronoun/full NP,
and adverb position from given/new/contrastive context.
**Response/template.** Context-sentence match or ordering.
**Derivation.** question under discussion and focus.
**Difficulty.** L3 new referent/passive; L4 contrast/cleft.
**Validation.** Human-reviewed information structure.

### Family `polite_request_strategy`

**Task/purpose.** Match imperative, modal question, conditional, softener,
greeting, thanks, and explanation to a declared request situation.
**Response/template.** Appropriateness choice or constrained rewrite.
**Derivation.** burden, relationship, urgency, medium/profile.
**Difficulty.** L1 please/request; L2 can/could; L3 indirect; L4 urgent/direct
contrast.
**Validation.** Pragmatic scale.

### Family `formal_informal_rewrite`

**Task/purpose.** Rewrite a bounded message between declared neutral-formal and
familiar-informal profiles while preserving facts.
**Response/template.** Ordering, choice, or fields.
**Derivation.** message semantics plus paired realizations.
**Difficulty.** L2 greeting/contraction; L3 phrasal/lexical choice; L4 syntax/
closing.
**Constraints.** No open style score.
**Validation.** Meaning identity/register tags.

### Family `contraction_register`

**Task/purpose.** Choose full/contracted forms from medium, focus, rhythm, and
register rather than “formal versus informal” alone.
**Response/template.** Form/profile choice or audio match.
**Derivation.** auxiliary structure, contrastive focus, genre.
**Difficulty.** L2 conversational; L3 neutral writing; L4 focused full form/
ambiguous contraction.
**Validation.** Syntax/register/prosody.

### Family `spoken_written_profile`

**Task/purpose.** Map reviewed reductions and conversational forms to a neutral
written realization and classify licensed informal spelling.
**Response/template.** Audio/text matching or rewrite.
**Derivation.** canonical transcript, spoken form, profile.
**Difficulty.** L2 weak/contraction; L3 reductions; L4 connected phrase.
**Constraints.** Do not present phonetic spelling as universal.
**Validation.** Human audio/profile.

### Family `spelling_punctuation_profile`

**Task/purpose.** Apply/recognize declared British, American, Canadian,
Australian, New Zealand, or other reviewed spelling/punctuation conventions.
**Response/template.** Variant choice, classification, or rewrite.
**Derivation.** lexical variant and editorial policy.
**Difficulty.** L2 one spelling; L3 punctuation/date; L4 mixed profile audit.
**Constraints.** No mechanical suffix conversion.
**Validation.** Profile dictionaries/style guides.

### Family `grammar_lexicon_profile`

**Task/purpose.** Interpret a reviewed profile-sensitive grammar or vocabulary
choice and provide the active-profile equivalent where one exists.
**Response/template.** Meaning match or paired form.
**Derivation.** profile-tagged construction/sense.
**Difficulty.** L3 everyday lexical pair; L4 perfect/collective/got-gotten
grammar.
**Validation.** Specialist/profile review.

### Family `pronunciation_profile_comprehension`

**Task/purpose.** Understand matched recordings across reviewed pronunciation
profiles and identify the specific feature without origin guessing.
**Response/template.** Meaning match and feature classification.
**Derivation.** matched script/speaker metadata.
**Difficulty.** L3 one feature; L4 normal-rate combination.
**Validation.** Human recordings/specialist review.

### Family `world_englishes_comprehension`

**Task/purpose.** Understand a reviewed lexical/grammatical/pronunciation feature
from an established global English context.
**Response/template.** Meaning match, profile label, or core paraphrase.
**Derivation.** curated profile data and context.
**Difficulty.** L3 explicit support; L4 familiar feature in connected speech.
**Constraints.** No caricature, prestige ranking, or claim one feature defines
a country/community.
**Validation.** Relevant specialist/speaker review.

### Family `controlled_message_construction`

**Task/purpose.** Compose a short message from required facts, relationship,
time, and profile using constrained slots/chunks.
**Response/template.** Structured fields or ordered clauses.
**Derivation.** intent/fact graph/register.
**Difficulty.** L2 one request/fact; L3 reason/time; L4 reference/aspect across
three clauses.
**Validation.** Required-fact entailment.

### Family `grammar_pragmatics_profile_audit`

**Task/purpose.** Find one connector, tense/aspect, reference, register,
politeness, spelling, grammar, or profile inconsistency.
**Response/template.** Span/fault/repair.
**Derivation.** One discourse/profile dependency mutation.
**Difficulty.** L3 two clauses; L4 multi-turn/cross-profile.
**Validation.** One root fault and preserved facts.

### Cross-family progression

Start with explicit connectors, event order, and article/pronoun chains. Add
politeness/register as complete utterance choices. Profile practice isolates one
dimension before mixing spelling, pronunciation, vocabulary, and grammar.
Global varieties are curated comprehension targets, never novelty distractors.

## 7. Category: Reading, listening, and interaction

### Category purpose

Integrate the preceding systems in short evidence-based communicative tasks
while keeping answers objectively checkable and offline media accessible.

### Learn-card content

- Identify genre, speaker/writer, addressee, profile, and purpose before
  translating.
- Use articles, pronouns, auxiliaries, verb forms, particles, stress, weak
  forms, connectors, and punctuation as evidence.
- Separate stated facts from plausible but unsupported inferences.
- In audio, listen first for stressed content words and clause rhythm, then weak
  grammar words and decisive details.
- Profile differences may alter sounds/words without changing the message.
- Recording yourself supports rehearsal; it is not an automatic accent or
  intelligibility grade.

### Prerequisites

Selected families from Categories 2–6 according to the item feature manifest.

### Category boundaries

Texts/audio use reviewed vocabulary/constructions plus a declared small
inferable set. This category checks comprehension, constrained production, and
interaction—not open literary analysis, essay quality, accent authenticity, or
cultural knowledge.

### Common misconceptions

- Translating token by token before using reference/syntax.
- Ignoring weak auxiliaries/articles/particles.
- Treating plausible inference as stated.
- Assuming a familiar spelling has one pronunciation across profiles.
- Assuming normal audio contains every citation-form segment.
- Believing local recording/playback produces an objective score.

### Family `sentence_segmentation_parse`

**Task/purpose.** Segment a sentence into phrases/clauses and identify subject,
auxiliary chain, predicate, objects, particles, adverbs, and connector.
**Response/template.** Boundaries, fields, or dependency matching.
**Derivation.** Source parse.
**Difficulty.** L1 simple; L2 auxiliary; L3 relative/subordinate; L4
particle/cleft.
**Validation.** Syntax tree.

### Family `inflected_word_recovery`

**Task/purpose.** Recover lemma/sense from plural, possessive, comparative,
irregular verb, participle, or derived form.
**Response/template.** Lemma/feature match.
**Derivation.** morphology and context.
**Difficulty.** L1 regular; L2 spelling change; L3 irregular; L4 homograph.
**Validation.** Unique contextual analysis.

### Family `multiword_unit_recovery`

**Task/purpose.** Identify a collocation, phrasal verb, idiomatic but
transparent frame, or compound from context without free idiom guessing.
**Response/template.** Bracketing or meaning match.
**Derivation.** lexical construction parse.
**Difficulty.** L2 collocation; L3 phrasal; L4 ambiguous surface resolved by
context.
**Validation.** Construction registry.

### Family `short_reading_comprehension`

**Task/purpose.** Retrieve stated facts/simple licensed inferences from a
purpose-written 1–5-sentence text.
**Response/template.** Choice, matching, ordering, or exact answer.
**Derivation.** Fact/event/reference graph.
**Difficulty.** L1 one fact; L2 two; L3 reference/aspect; L4 negative/
contrastive.
**Validation.** Evidence annotations.

### Family `notice_message`

**Task/purpose.** Interpret a sign, chat, email, announcement, invitation, or
service message.
**Response/template.** Purpose/detail/action choice.
**Derivation.** Genre/audience/facts.
**Difficulty.** L1 instruction; L2 date/time; L3 condition/change; L4
register/profile.
**Constraints.** Fictional/non-live/non-high-stakes.
**Validation.** Fact/genre review.

### Family `instruction_schedule_route`

**Task/purpose.** Follow instructions, timetable, recipe-like sequence, or
simple route.
**Response/template.** Ordered steps or structured fields.
**Derivation.** Exact sequence/calendar/spatial graph.
**Difficulty.** L1 two steps; L2 time; L3 branch/direction; L4 cross-reference.
**Validation.** Independent oracle.

### Family `dialogue_completion`

**Task/purpose.** Choose/construct the next turn satisfying intent, reference,
answer type, and register.
**Response/template.** Choice, chunks, or bounded completion.
**Derivation.** Dialogue state.
**Difficulty.** L1 greeting/Q&A; L2 request; L3 repair/refusal/reason; L4
limited implicature.
**Validation.** State transition.

### Family `reference_resolution`

**Task/purpose.** Resolve articles, pronouns, ellipsis, existential/dummy forms,
and repeated entities in a short text/dialogue.
**Response/template.** Entity linking.
**Derivation.** Discourse graph.
**Difficulty.** L2 simple; L3 same-feature competitors; L4 generic/specific/
topic shift.
**Validation.** Unique antecedent.

### Family `listening_sound_form`

**Task/purpose.** Match audio to word/phrase form using stress, weak forms,
endings, contractions, and profile.
**Response/template.** Audio/text matching.
**Derivation.** Licensed recordings/transcripts.
**Difficulty.** L1 word; L2 ending/contraction; L3 weak/phrasal; L4 normal-rate
profile.
**Validation.** Human audio.

### Family `listening_dictation`

**Task/purpose.** Transcribe a reviewed phrase/sentence when context determines
spelling, contractions, and boundaries.
**Response/template.** Text or named fields.
**Derivation.** Recording/transcript/profile.
**Difficulty.** L1 word; L2 slow phrase; L3 normal sentence; L4 homophones/
weak forms/phrasal.
**Validation.** Alignment.

### Family `listening_comprehension`

**Task/purpose.** Extract gist, detail, sequence, speaker relation, or simple
inference from short audio.
**Response/template.** Choice, matching, ordering, or exact field.
**Derivation.** Audio-script fact graph.
**Difficulty.** L1 one fact; L2 details; L3 reference/aspect; L4 multi-turn/
profile.
**Validation.** Evidence spans/human review.

### Family `guided_speaking_shadowing`

**Task/purpose.** Rehearse/optionally record a reviewed utterance with attention
to stress, weak forms, endings, rhythm, and communicative focus.
**Response/template.** Listen–repeat–self-compare; no automatic score.
**Derivation.** Model audio/transcript/prosody.
**Difficulty.** L1 word; L2 phrase; L3 sentence; L4 role turn.
**Constraints.** Local-only recording/deletion/text route.
**Validation.** Asset/manual review.

### Family `bounded_mediation`

**Task/purpose.** Relay selected facts from a table, route, schedule, or
interface-language note in controlled English without open translation.
**Response/template.** Fields, clause choices, or chunks.
**Derivation.** Fact graph/realization set.
**Difficulty.** L2 one fact; L3 time/reason; L4 audiences/profiles.
**Validation.** Bidirectional entailment.

### Family `profile_comprehension`

**Task/purpose.** Understand paired regional/standard or careful/conversational
recordings/texts and identify shared meaning plus declared difference.
**Response/template.** Meaning/feature match.
**Derivation.** Paired reviewed items.
**Difficulty.** L3 support; L4 audio-first.
**Constraints.** No speaker-origin guessing.
**Validation.** Specialist/profile review.

### Family `connected_language_audit`

**Task/purpose.** Find one contradiction, unsupported interpretation,
reference/time mismatch, malformed form, or profile/register inconsistency
using text/audio evidence.
**Response/template.** Evidence span and correction.
**Derivation.** One logged mutation.
**Difficulty.** L2 sentence; L3 text/dialogue; L4 cross-modal.
**Validation.** One root fault/decisive evidence.

### Cross-family progression

Begin with parsing/word recovery, then one-fact texts/audio. Add messages,
sequences, dialogues, multiword units, and reference. Dictation follows
sound–spelling mastery. Mediation/profile comparison are later. Receptive and
productive vocabulary remain separate.

## 8. Cross-category progression and release slices

Levels describe complexity, not certification:

- **Foundation / L1:** alphabet/spelling anchors, core vowels/consonants,
  syllables/stress, singular count nouns and `a/the`, `be`, present simple,
  basic declaratives/questions/negation, and one-fact comprehension.
- **Elementary / L2:** silent letters/weak forms/endings, plural/countability/
  articles/quantifiers, progressive/past/perfect form, modals, basic phrasal
  verbs, `do` support, wh-questions, relatives, practical messages/dictation.
- **Independent-building / L3:** discourse article/pronoun reference,
  tense/aspect contrasts, future/modal/complement frames, particle placement,
  passives, embedded questions/tags/conditionals, register, connected
  comprehension, and mediation.
- **Early-intermediate / L4:** interacting perfect-progressive/modal/passive,
  complex complements/reference/scope, report/cleft recognition,
  information structure, spelling/grammar/global-profile comprehension, and
  audits.
- **L5 challenge:** denser mixing/reduced scaffolding within early B1; no
  silent move to advanced academic/literary English.

Recommended delivery:

1. **Release A — sound, noun phrase, present:** Category 2 core; countability/
   plural/articles; be/present/third `-s`; statements, basic questions/negation;
   parsing/audio.
2. **Release B — event shape and auxiliary syntax:** weak forms/endings,
   quantifiers/pronouns, progressive/past/participles/perfect, modals/basic
   phrasals, do-support, wh/relative, notices/schedules/dictation.
3. **Release C — connected English:** tense/future/complements/particles/
   passive, embedded questions/tags/conditionals, reference/connectors/register,
   dialogue/listening/messages.
4. **Release D — early-B1 integration:** perfect-progressive/modal chains,
   reports/information structure, variation, mediation, global-profile
   comprehension, and audits.

Unlock by family dependencies. Pronunciation, spelling, article recognition/
production, verb forms, tense/aspect selection, auxiliary syntax, reading,
listening, speaking rehearsal, and profile comprehension have separate
evidence.

## 9. Adaptive practice guidance

Track:

- family/can-do, level, scaffold, modality, response, latency, confidence, and
  misconception;
- lexeme/sense, frequency/domain, known status, word family/collocation,
  register/profile;
- grapheme, syllable/stress/schwa, weak form, ending, contraction, boundary,
  speaker/audio/profile/merger;
- noun sense/countability/number/reference/article/determiner/quantifier/
  possessor/modifier/preposition;
- verb principal form, subject agreement, tense/aspect/reference time,
  auxiliary/modal/future, complement, particle/separability/preposition,
  passive/roles;
- pronoun/referent/binding, clause type, auxiliary/do/inversion/negation/scope,
  question/relative gap, conditional/report, there/it/focus;
- connector/relation, event sequence, politeness/register, editorial/
  pronunciation/global profile, genre/evidence.

Routing examples:

- Correct sound but wrong homophone spelling → preserve listening mastery and
  restore grammar/meaning context.
- Correct word with wrong stress → keep lexical meaning and target form/audio.
- Profile merger causes same judgment → accept profile behavior; do not drill a
  nonexistent contrast.
- Singular count noun without determiner → hold noun/event constant and model
  reference.
- Article chosen by first/second mention only → contrast two contexts where
  identifiability differs.
- `much books` → restore countability before adding quantifier nuance.
- Missing third `-s` → vary only subject with same present-simple event.
- `does works` → show tense/agreement moved to auxiliary and base lexical verb.
- Progressive selected for every “now” → contrast state/event senses.
- Present perfect with explicit finished time → compare reference-time graphs,
  noting profile-sensitive recent-past cases separately.
- Wrong gerund/infinitive → retrieve the exact sense/complement frame.
- `turn off it` → hold sense/object and target pronoun particle placement.
- Direct-question order in embedded question → display two clause schemas.
- Profile-valid spelling → label it and restate active production profile.

Track recognition, scaffolded production, and meaning-driven production
separately. Space spelling, irregular plurals/verbs, complement/phrasal frames,
and article reference. After two successes, vary one dimension. Confident
misconceptions trigger minimal contrast, explanation, and delayed transfer.

## 10. Feedback and explanation requirements

Reveal:

1. **Intention/profile:** meaning, reference, time, relationship, speech act,
   register, medium, and active English profiles.
2. **Semantic frame:** predicate, roles, referents, events/states, intervals/
   worlds, quantity, clause/discourse relation.
3. **Features:** countability/number/determination; person/agreement,
   tense/aspect/modal/voice, polarity.
4. **Realization:** article/quantifier/pronoun; verb principal form, auxiliary,
   complement, particle/preposition, passive; spelling/pronunciation.
5. **Structure:** binding/reference, auxiliary/`do`, inversion, negation/scope,
   question/relative gap, conditional/report, `there/it`, information focus.
6. **Mismatch/alternatives:** first decisive error and equivalent/profile/
   context-different/non-target/incorrect alternatives.

Useful visuals:

- grapheme/audio alignment, syllable/stress/schwa and weak-form tiers;
- inflectional-ending sound classifier;
- contraction syntax expansion;
- discourse entity→article decision graph;
- countability/quantifier and possessive trees;
- event/reference timelines for simple/progressive/perfect;
- auxiliary chain and feature movement to `do`;
- complement/control and phrasal particle/object diagrams;
- active/passive role mapping;
- question inversion and subject/object gap;
- relative antecedent→gap, conditional worlds, there/it dependency;
- discourse reference/focus and profile comparison.

Invalidate any item lacking context for countability, article, pronoun,
tense/aspect, modal, complement/phrasal sense, question/relative, scope,
register, or profile.

## 11. Audio and content requirements

- Bundle all audio; no runtime TTS, speech recognition, dictionary, corpus, or
  pronunciation service.
- Use licensed human recordings from several reviewed regional/global profiles;
  label neutrally.
- Separate normal/pedagogically slower takes without distorting stress, weak
  forms, vowels, consonants, linking, or rhythm.
- Store canonical/display transcript, alignment, speaker/profile, rate,
  feature tags, license/provenance, and review.
- Matched contrasts must not be cued by speaker/noise/loudness.
- Provide replay/state/keyboard/transcript when it does not defeat the task and
  a non-audio route where hearing is not the skill.
- Microphone use is local/optional with no upload, default retention, accent
  detection, or automatic score.
- Purpose-write texts/dialogues; external content needs license/attribution.
- Vary people/settings without stereotypes or culture-trivia requirements.

## 12. Rendering, interaction, and accessibility

- UTF-8; support straight/curly apostrophes/quotes and profile punctuation.
- Offer character/keyboard help where needed, tracked separately.
- Paradigms use semantic HTML tables.
- Stress/weak-form/audio alignments, timelines, reference trees, chains,
  question gaps, and profile diagrams have text/table alternatives.
- Ordering has keyboard/button alternatives and large targets.
- Audio controls expose label/state/replay/rate/transcript; no autoplay.
- Color, sound, duration, motion, time, or fine pointer action is never the sole
  cue without an alternate route.
- Speaking works as listen/read rehearsal without microphone.
- Long clauses/tables wrap on mobile.
- Screen readers announce correction before detail and hide raw IDs.
- Respect reduced motion/no disappearing timers.
- Profile labels use text, not flags alone.

## 13. Generator and offline implementation guidance

Useful module boundary:

```text
seededRng
reviewedEnglishLexiconRegistry
varietyProfileRegistry
unicodeEnglishNormalizer
orthographyEditorialProfile
pronunciationLexicalSetRegistry
stressWeakFormEngine
semanticFrameGenerator
referenceArticleEngine
nominalParadigmRealizer
quantifierLogicEngine
pronounReferenceResolver
prepositionRelationRegistry
numberDateTimeGrammar
verbParadigmRealizer
eventTenseAspectWorldModel
futureModalSelectionEngine
auxiliaryChainGrammar
complementControlRegistry
phrasalParticleAutomaton
passiveRoleMapper
doSupportInversionEngine
negationScopeEngine
questionRelativeGrammar
conditionalReportGrammar
thereItResolver
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
- can-do/level/scaffold/modality/response;
- semantic frame, roles, referents, facts, events/intervals/worlds/speech act;
- lexeme/sense IDs and morphosyntactic features;
- countability/reference/article/quantifier/possessor/pronoun links;
- verb principal form, tense/aspect/modal/future, auxiliary chain, complement/
  control, particle/separability/preposition/passive;
- clause type, auxiliary/do/inversion/negation, question/relative/conditional/
  report/there-it/focus structure;
- active profiles and canonical/accepted/profile-different outputs;
- spelling/stress/weak-form/pronunciation/audio metadata;
- parse/evidence/normalization, misconception/fault IDs.

Generation:

1. choose family/level/profiles/difficulty dimensions;
2. create semantic/reference/phonological/event/clause/discourse source;
3. select compatible reviewed lexemes/construction;
4. assign determination, roles, tense/aspect/modal/voice, complement/particle,
   clause type, scope, information structure, register;
5. realize noun/pronoun/verb/auxiliary morphology;
6. linearize and apply spelling/punctuation/profile;
7. select audio if required;
8. back-parse/verify source identity;
9. derive answer/explanation independently;
10. create misconception distractors or one typed mutation;
11. reject ambiguity, collisions, unnaturalness, profile mismatch, excessive
    vocabulary, or insufficient evidence.

No backend/runtime network. Ship reviewed/versioned data/audio/templates.
Do not embed a general translator, corpus, dictionary, TTS, or speech
recognizer. Choice/order compare IDs. Text parses only documented controlled
grammar; edit distance is diagnostic only.

## 14. Automated and linguistic validation

### Data-build checks

- Every lexeme has ID, sense, POS, level/frequency, register/profile,
  provenance/review.
- Nouns have sense-specific countability/plurals/possessives/pronunciations.
- Determiners/quantifiers/pronouns/adjectives have shipped forms/constructions.
- Verbs have all shipped forms, stative/dynamic senses, complement/particle/
  preposition/passive frames.
- Spelling/pronunciation variants declare profile/scope.
- Clause/negation/question/relative/conditional/report/there-it/register
  constructions are typed/reviewed.
- Audio has transcript/profile/license/manual review.

### Instance invariants

- Surface reparses to source semantics/features.
- Spelling/apostrophe/hyphen/capitalization/punctuation match profile.
- Audio matches lexeme/stress/weak forms/endings/contractions/profile.
- Countability/reference/article/quantifier/possessive/pronoun are coherent.
- Verb form/agreement/tense/aspect/modal/auxiliary/complement/particle/passive
  match event.
- `do`, inversion, negation/scope, question/relative gap, conditional/report,
  there/it/focus/order match context.
- Reading/listening key is entailed; distractors logged false/unsupported/wrong
  role/time/reference/profile.
- Accepted answers never collide after normalization.
- Audit differs by one root mutation.

### Test volume and independent oracles

- At least 10,000 seeds per family/level.
- At least 25,000 for spelling/sound, articles/countability, quantifiers,
  irregular paradigms, tense/aspect, complements/phrasals, auxiliary/do/
  inversion, negation, questions/relatives, reference/there-it, profiles/audits.
- Exhaustively enumerate shipped paradigms, contractions, auxiliary chains,
  complement/particle schemas, and profile variants.
- Exhaustively test Unicode/apostrophes/quotes/hyphens/case/punctuation.
- Independently recompute numbers/dates/times/routes/comparisons.
- Validator/back-parser independent from key path.
- Snapshot long text/tables/diagrams/audio states mobile/desktop.
- Manually review audio and stratified template/lexeme/profile/distractor/fault
  samples. Automation cannot certify idiomatic/pragmatic naturalness.

Discard/log failures; never substitute unreviewed content.

## 15. Coverage and balance requirements

Report by family/level:

- generation/rejection and distinct frames;
- lemma/sense/domain/frequency/collocation/register/profile;
- grapheme/stress/weak form/ending/contraction/linking/audio/profile;
- countability/number/article/reference/quantifier/possessor/pronoun/modifier;
- verb form/agreement/tense/aspect/modal/auxiliary/complement/particle/passive;
- auxiliary/do/inversion/negation/scope/question/relative/conditional/report/
  there-it/focus;
- connector/relation/event sequence/politeness/register/editorial/global
  profile/genre/evidence/modality/scaffold/misconception.

Cap easy defaults: regular spelling/plural/verbs, singular count nouns, `a`
before written consonant, present simple, first person, one auxiliary, no
particle/complement contrast, declarative order, one national profile, and
literal one-clause translation. Balance communicative value, profiles,
countability/reference, tense/aspect, clause type, register, and learner need.

## 16. Content and implementation checklist

- [ ] Contemporary English, Foundation–early B1; no certification claim.
- [ ] Pluricentric spelling/grammar/pronunciation profiles explicit/versioned.
- [ ] Regional/global varieties scoped neutrally, not ranked.
- [ ] Spelling, punctuation, pronunciation, grammar, vocabulary, dates are
      independent profile dimensions.
- [ ] Lexemes/forms/constructions/audio reviewed/licensed.
- [ ] Countability/articles derive from sense/reference.
- [ ] Tense/aspect uses event/reference models.
- [ ] Auxiliary/do/inversion/negation typed explicitly.
- [ ] Complement/phrasal/preposition frames sense-specific.
- [ ] Pronoun/reference/relative/there-it links explicit.
- [ ] Profile-valid alternatives classified, not generic errors.
- [ ] No free translation/essay/conversation/fuzzy grading.
- [ ] Audio local/licensed/multi-profile/human-reviewed.
- [ ] No bogus pronunciation/accent score.
- [ ] Reading/listening retain evidence.
- [ ] Distractors encode misconceptions; audits one root fault.
- [ ] Seeds reproduce profile/answer/variants/audio/explanation.
- [ ] Accessibility covers sound/order/diagrams/audio/input.
- [ ] Standalone HTML/JS/CSS; no backend/runtime network.

## 17. Stable IDs and recommended navigation

Use:

```text
english-language/<category-id>/<family-id>/<schema-version>
```

Persist seed, data/generator/profile versions, lexeme/sense IDs, semantic frame,
features, reference links, verb/auxiliary/complement/particle state,
clause/reference/scope structure, answer policy, audio/fault IDs. Increment
schema/data versions whenever keyed output changes.

Recommended navigation:

1. **Sound, Stress & Spelling**
2. **Nouns, Articles & Quantifiers**
3. **Verbs, Time & Phrasal Verbs**
4. **Questions & Clause Structure**
5. **Connected English & Profiles**
6. **Reading, Listening & Interaction**

Filters may expose level, family, modality, production/receptive profiles,
register, vocabulary domain, input mode, and error review. Internal engine
terms remain developer-only.
