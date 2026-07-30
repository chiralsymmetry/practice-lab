# Modern Greek Language — Dynamic Practice Specification

Status: implementation specification

Audience: exercise generator, Greek linguistic-content editor, morphology and
syntax engine, semantic answer checker, text/audio renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual normative meanings.

## 1. Topic overview

### Topic name

Modern Greek Language

### Topic goal

Develop beginner-to-lower-intermediate communicative Modern Greek by repeatedly
connecting script, sound, stress, vocabulary, morphology, syntax, reading,
listening, controlled writing, and guided speaking. The learner should become
able to:

- read, type, and hand-copy the 24-letter Greek alphabet in monotonic
  orthography, including `σ/ς`, tonos, diaeresis, and Greek punctuation;
- connect frequent vowel spellings, consonant digraphs, and context-dependent
  pronunciations with reviewed words and recordings;
- retrieve nouns with grammatical gender and inflect noun phrases for number
  and nominative, genitive, accusative, and vocative case;
- make articles, adjectives, demonstratives, quantifiers, and pronouns agree
  with their controllers;
- use common prepositions and the contractions of `σε` with the definite
  article;
- conjugate high-frequency active and non-active verbs and retrieve their
  imperfective and perfective stems instead of guessing one from the other;
- choose past, future, `να`, imperative, perfect, and hypothetical
  constructions from time, aspect, polarity, and speech-act meaning;
- place weak object and possessive pronouns around the correct verbal or nominal
  host;
- form statements, questions, negation, relatives, comparisons, requests, and
  short connected discourse with information-sensitive word order;
- understand and produce numbers, dates, times, prices, directions, routine
  descriptions, practical messages, and short conversations;
- recognize reviewed regional or register variants without treating them as
  defective Greek or silently mixing them into one production target.

The endpoint is practical form–meaning control in contemporary Standard Modern
Greek. Grammar labels support explanation; paradigms and terminology are not
ends in themselves.

### Audience and level boundary

The app starts before script mastery and extends through practical A1, A2, and
selected early-B1 objectives. These labels guide complexity; the app does not
certify CEFR level or prepare learners for one particular examination.

- **Foundation:** alphabet, keyboard, sound–spelling anchors, fixed
  expressions, nouns with articles, and core present-tense utterances.
- **A1-oriented:** people and places, routines and needs, cases in simple noun
  phrases, numbers/time/prices, basic questions and negation, and short
  interaction.
- **A2-oriented:** past and future reference, aspect contrasts, pronouns,
  comparison, instructions, everyday messages, and connected descriptions.
- **Early-B1-oriented:** interacting aspect, clitic placement, subordinate and
  relative clauses, information structure, register, inference, mediation, and
  cross-variety comprehension.

The [Centre for the Greek Language's level
descriptions](https://www.greek-language.gr/certification/teaching/index.html?id=159)
and [A1–C2 certification framework](https://www.greek-language.gr/certification/node/125.html)
help set the communicative boundary. The Council of Europe [CEFR Companion
Volume](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions)
informs reception, production, interaction, mediation, and phonological
competence. This app is neither a certificate nor a mock examination.

### Reference and language-data boundary

Reference anchors include:

- the Centre for the Greek Language's [Modern Greek grammar
  bibliography](https://www.greek-language.gr/greekLang/modern_greek/bibliographies/grammar/intro.html),
  which also makes clear that descriptions and terminology differ;
- its teaching material on [imperfective and perfective verb
  stems](https://elearning.greek-language.gr/mod/resource/view.php?id=271);
- the [Dictionary of Standard Modern
  Greek](https://www.greek-language.gr/greekLang/modern_greek/tools/lexica/triantafyllides/index.html)
  for lexical forms and usage;
- the Centre's [diagnostic-practice
  areas](https://www.greek-language.gr/certification/tests/) across reading,
  vocabulary, grammar, and listening.

Reference pages are not corpora to copy. Every bundled lexicon, paradigm,
recording, frequency list, or authored text requires compatible licensing,
provenance, versioning, and Greek-language review. A dictionary form alone does
not establish learner level, sense, valency, aspect pair, register, region, or
idiomaticity.

### Standard-variety and usage policy

Use contemporary Standard Modern Greek as the default production baseline.
Cypriot Greek and other regional varieties, local standards, colloquial forms,
and pronunciation variants may appear receptively only after explicit review
and labeling.

```text
VarietyProfile {
  id
  geographicScope
  productionBaseline
  orthographyPolicy
  pronunciationTargets[]
  lexicalPreferences[]
  grammaticalVariants[]
  numberDateTimeConventions
  addressRegisterConventions[]
  acceptedAlternatives[]
}
```

- A production prompt declares a profile whenever the profile changes an
  answer.
- Regional forms are labeled by scope, not “corrected” into an Athens target.
- A learner may select one production profile and separate receptive profiles.
- Formal, neutral, informal, and familiar-spoken forms remain register tags, not
  a ladder from “good” to “bad.”
- Katharevousa-derived items that are ordinary in present-day standard usage are
  lexical entries; the app does not generate Katharevousa as a parallel
  grammar.
- Ancient, Koine, learned, regional, and contemporary forms that look alike
  must retain separate provenance and usage tags.
- Accent imitation and unreviewed dialect generation are outside scope.

Every realization is classified as:

1. **canonical target** — selected teaching form for this profile and context;
2. **accepted variant** — standard and meaning/register-compatible here;
3. **profile-different** — valid in another reviewed profile;
4. **contextually different** — grammatical but changes aspect, reference,
   focus, politeness, or implication;
5. **non-target/nonstandard** — outside the requested production norm;
6. **incorrect** — incompatible spelling, morphology, syntax, or meaning.

Feedback must preserve those distinctions.

### Scope

Included:

- contemporary monotonic orthography, ordinary capitalization, punctuation,
  syllabification, lexical stress, and common sound–spelling patterns;
- adult everyday vocabulary and collocations through selected early B1;
- masculine, feminine, and neuter gender; singular/plural; nominative,
  genitive, accusative, and vocative case;
- definite and indefinite articles, adjectives, demonstratives, possessives,
  quantifiers, personal pronouns, and a controlled relative-pronoun subset;
- frequent active and non-active verb paradigms, imperfective/perfective stem
  pairs, present, imperfect, aorist, future, `να`, imperative, perfect, and
  selected conditional/hypothetical constructions;
- weak pronoun roles, order, placement, possession, and reviewed clitic
  doubling;
- statements, questions, negation, relatives, comparison, coordination,
  subordination, reference, focus, and routine register choices;
- numbers, ordinals, dates, time, money, measures, addresses, and telephone
  numbers at a useful but less specialized depth than a dedicated numbers app;
- short reading/listening, constrained writing, dialogue, mediation, and guided
  local speaking rehearsal;
- receptive exposure to explicitly reviewed regional and colloquial variants.

Expected prior knowledge:

- none at Foundation;
- ability to read the interface language;
- linguistic terminology is taught through examples before it is required;
- later families assume only the dependencies stated in progression notes.

### Exclusions

- Ancient Greek, Koine Greek, productive Katharevousa, and polytonic spelling;
- unrestricted translation, essays, free conversation, and grading by vague
  semantic similarity;
- exhaustive dialectology, slang generation, accent classification, or accent
  “correction”;
- automatic pronunciation scoring, speaker identification, and claims that
  local recording measures comprehensibility;
- exhaustive historical spelling/etymology or derivational morphology;
- rare nominal paradigms, highly learned case uses, literary syntax, and
  advanced participial systems as productive targets;
- exhaustive tense/mood terminology disputes or deriving aspect stems with
  rules that pretend irregular lexical data is predictable;
- open cultural trivia, literary interpretation, humor, irony, and dense
  implicature;
- isolated vocabulary flashcards with no morphology, collocation, sound, or
  communicative context;
- live transport, legal, political, price, or emergency information;
- specialist or high-stakes medical, legal, immigration, and safety content.

### Orthography, pronunciation, and input conventions

- Internal strings are UTF-8 and normalized to Unicode NFC.
- The alphabet inventory is `Α α, Β β, Γ γ, Δ δ, Ε ε, Ζ ζ, Η η, Θ θ, Ι ι,
  Κ κ, Λ λ, Μ μ, Ν ν, Ξ ξ, Ο ο, Π π, Ρ ρ, Σ σ/ς, Τ τ, Υ υ, Φ φ, Χ χ, Ψ ψ,
  Ω ω`.
- `ς` is the ordinary word-final lowercase form of sigma; `σ` is used
  elsewhere. The checker must not blindly replace either before a spelling task
  is classified.
- Monotonic tonos and diaeresis are meaningful. The app must preserve `ά έ ή ί
  ό ύ ώ`, `ϊ ϋ`, and combined accented forms such as `ΐ/ΰ`.
- Ordinary stress generally falls within the final three syllables, but a
  lexical/paradigm registry—not a suffix guess—determines the target form.
- The Greek question mark is `;`; the raised point `·` and other punctuation
  are introduced only in reviewed contemporary use. A punctuation task does
  not accept the Latin semicolon for the Greek question mark by meaning alone.
- Uppercase accent behavior, apostrophe/elision, abbreviations, and spacing are
  governed by a versioned editorial policy, not ad hoc normalization.
- Common vowel spellings (`αι, ει, οι, υι, ου`) and consonant sequences
  (`μπ, ντ, γκ, γγ, τσ, τζ`) are taught as contextual mappings. Audio targets
  remain lexical/profile data.
- `αυ/ευ` pronunciation depends on the following sound. Other voicing,
  prenasalization, palatalization, and connected-speech details require reviewed
  audio rather than universal rules inferred from letters.
- Romanization may scaffold Foundation recognition and keyboard discovery. It
  is not accepted for Greek-script production unless the prompt explicitly
  requests transliteration.
- IPA is optional and never assumed.

### Lexical and grammatical data model

```text
Lexeme {
  id
  lemma
  partOfSpeech
  senses[]
  gender?
  countability?
  declensionClass?
  principalNominalForms[]
  adjectiveClass?
  comparativeForms[]
  verbConjugationClass?
  voiceBehavior?
  imperfectiveStem?
  perfectiveStem?
  activeAorist?
  nonActiveAorist?
  dependentPerfectiveForm?
  imperativeForms[]
  paradigmForms[]
  argumentFrames[]
  prepositionFrames[]
  cliticFrames[]
  pronunciations[]
  syllables[]
  stressIndexByForm[]
  semanticTags[]
  collocations[]
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
  caseAssignments[]
  agreementLinks[]
  cliticSlots[]
  cliticHost
  tenseAspectMoodProfile
  particleSequence[]
  wordOrderOptions[]
  informationStructure
  registerProfile
  varietyScope[]
  acceptedRealizations[]
}
```

Gender, plural, genitive, vocative, stress movement, adjective class, verb
stem pair, voice meaning, valency, preposition, clitic compatibility,
pronunciation, register, and region are stored data. Do not infer them from a
final letter or an interface-language gloss.

### Case, agreement, aspect, and clitic policy

- The generator creates a semantic frame first: participants, reference,
  possession/relation, direction/location, address, time, aspect, polarity,
  discourse status, and speech act.
- Semantic and constructional roles assign case. Word order does not by itself
  determine subject/object case.
- Articles and modifiers realize the same gender, number, and case bundle as
  their noun unless the construction explicitly licenses another relation.
- The ordinary productive noun-phrase inventory has no dative case. Do not
  create a fifth “missing case” exercise from Ancient Greek.
- Verbs are stored with reviewed imperfective and perfective stems. Examples
  such as `γράφω / γράψω / έγραψα` teach a relationship; they do not license a
  universal string transformation.
- Aspect is viewpoint: an event seen internally/repeatedly versus as a bounded
  whole. It must not be reduced to “long action versus short action.”
- `θα`, `να`, and `ας` combine with licensed finite forms. Ordinary Modern
  Greek does not require a productive infinitive for constructions such as
  `θέλω να φύγω`.
- Weak pronouns retain semantic role, person, number, gender where expressed,
  form, order slot, and host. Placement differs around ordinary finite clauses,
  positive imperatives, and gerunds; a surface list alone is not enough.
- Information-sensitive order may move full constituents without changing
  their case roles. A grammatical alternative is not accepted if it contradicts
  explicit focus, topic, register, or clitic context.

### Global answer conventions

- Ignore surrounding whitespace and normalize Unicode to NFC.
- Normalize ordinary equivalent spaces and typographic apostrophe variants only
  when typography is not being tested.
- Preserve Greek letters, tonos, diaeresis, final sigma, punctuation, and
  capitalization when those are part of the target skill.
- For a grammar-only structured response, an orthographic near miss may be
  reported separately but must not silently earn spelling mastery.
- Romanized answers are rejected unless explicitly requested or enabled as an
  accessibility scaffold; such success is tracked separately.
- Single-choice and ordering responses compare stable IDs, not visible labels.
- Text responses are checked by the promised controlled grammar and accepted
  realization set. Edit distance or embedding similarity cannot establish
  grammatical or semantic equivalence.
- Multiple required forms use labeled fields. Do not make learners guess a
  comma, slash, or ordering convention.
- Numbers may accept locale-appropriate digit grouping and decimal separators
  when numeric notation is not assessed. Spelled-number tasks use the declared
  orthographic convention.
- Punctuation/case may be ignored only when the family declares it incidental.
- A semantically possible answer that changes referent, aspect, focus,
  politeness, or register is “contextually different,” not equivalent.
- Audio-dependent prompts always offer replay and a non-audio route unless
  hearing discrimination is the skill itself.

### Difficulty philosophy

Difficulty should rise through independently controlled dimensions:

- less Romanization, fewer paradigmatic cues, and less segmented audio;
- lower-frequency but still useful reviewed vocabulary;
- longer words, less transparent spelling, and stress movement;
- more gender/number/case agreement links and greater controller distance;
- less regular noun/adjective/verb classes and more stem retrieval;
- contrasts between imperfective and perfective viewpoint in the same time
  frame;
- more particles, clitics, referents, and information-structure constraints;
- longer dependency distance, more clauses, and denser but entailed texts;
- productive rather than receptive response and reduced answer structure;
- cross-register or cross-variety comprehension after one baseline is secure.

Do not manufacture difficulty with obscure vocabulary, tiny text, poor audio,
unannounced spelling traditions, ambiguous translation, arbitrary timers,
unbounded typing, cultural trivia, or distractors differing only subtly without
enough context.

## 2. Category: Script, sound, stress, and spelling

### Category purpose

Build automatic bidirectional links among Greek characters, keystrokes,
graphemes, syllables, lexical forms, stress, punctuation, and reviewed audio.

### Learn-card content

- Modern Greek has 24 letters; lowercase sigma has medial `σ` and final `ς`.
- Several spellings share a present-day sound, so sound alone does not always
  determine spelling: `η, ι, υ, ει, οι, υι` are a central example.
- `αι` commonly represents /e/, `ου` /u/, and `αυ/ευ` change before different
  following sounds. Consonant digraphs also depend on position and profile.
- Tonos marks the stressed syllable in ordinary polysyllabic lowercase words;
  diaeresis shows that adjacent vowels belong to separate syllables.
- Greek `;` asks a question: `Πού μένεις;`
- Learn word spelling, stress, and pronunciation together. Transliteration is
  temporary scaffolding, not a replacement alphabet.

### Prerequisites

None. Audio families require usable audio output or a text/visual alternative.

### Category boundaries

This category teaches decoding, spelling, and phonological form. Inflectional
choices belong to Categories 3–5 even when they change stress or spelling;
those categories may call this category's realizer.

### Common misconceptions

- Treating Greek letters as decorative equivalents of visually similar Latin
  letters, for example reading `Ρ` as Latin `P`.
- Using `σ` in every position or treating `ς` as a separate sound.
- Assuming one sound has one spelling and choosing among `ι/η/υ/ει/οι` by ear
  alone.
- Pronouncing every letter sequence independently rather than as a reviewed
  digraph.
- Omitting tonos because stress can be guessed from context.
- Treating diaeresis as optional decoration.
- Reading the Greek question mark as a semicolon.
- Believing romanization can encode all spelling distinctions needed for
  Greek-script production.

### Family `alphabet_letter_identity`

**Task/purpose.** Recognize and produce uppercase/lowercase Greek letters and
their names. **Response/template.** Character selection, matching, keyboard
input, or reviewed audio-to-letter. **Derivation.** Fixed 24-letter inventory.
**Difficulty.** L1 distinctive forms; L2 Latin-lookalikes; L3 mixed case/audio;
L4 short spelling sequences. **Constraints.** Do not use fonts that erase
distinctions. **Feedback.** Letter pair, name, sound examples.
**Validation.** Exhaustive inventory/font snapshots.

### Family `uppercase_lowercase_pair`

**Task/purpose.** Convert characters and short reviewed words between ordinary
case forms. **Response/template.** Matching or short text.
**Derivation.** Unicode-aware case mapping plus editorial accent policy.
**Difficulty.** L1 single letters; L2 `Σ/σ/ς`; L3 accented words; L4 headings.
**Distractors.** Visual Latin substitution, wrong sigma.
**Validation.** Round-trip except declared context-sensitive mappings.

### Family `final_sigma_position`

**Task/purpose.** Select `σ` or `ς` from word position and punctuation context.
**Response/template.** Character insertion or error repair.
**Derivation.** Token/grapheme boundary and lowercase context.
**Difficulty.** L1 word-final; L2 inflection changes position; L3 apostrophe/
punctuation; L4 audit in connected text. **Distractors.** One sigma everywhere,
Latin `s`. **Validation.** Tokenizer and dictionary form.

### Family `vowel_grapheme_sound`

**Task/purpose.** Match common vowel graphemes to reviewed pronunciation without
claiming that sound uniquely recovers spelling. **Response/template.** Audio/
text match, classification, or contextual completion.
**Derivation.** Grapheme, lexeme, stress, and profile audio.
**Difficulty.** L1 `α ε ο`; L2 `αι/ου`; L3 i-spellings; L4 mixed words.
**Distractors.** Letter-name reading, one-to-one spelling.
**Validation.** Lexeme/grapheme/audio registry.

### Family `consonant_digraph_sound`

**Task/purpose.** Decode/spell reviewed `μπ, ντ, γκ, γγ, τσ, τζ` sequences.
**Response/template.** Audio-word match, sequence choice, or classification.
**Derivation.** Word position, lexical form, profile, and recording.
**Difficulty.** L1 stable common items; L2 initial/medial contrast; L3 speaker
variation; L4 dictation with lexical cue. **Constraints.** Do not present one
universal prenasalization rule. **Validation.** Human-reviewed audio.

### Family `av_ev_environment`

**Task/purpose.** Predict and recognize the common voiced/voiceless realization
of `αυ/ευ` from the following sound. **Response/template.** Sound choice,
grapheme highlighting, or audio match. **Derivation.** Following segment's
voicing class plus reviewed exceptions/profile.
**Difficulty.** L1 clear word-internal pairs; L2 across inflection; L3 phrase
boundary only if reviewed; L4 mixed audit. **Distractors.** Always pronounce
written upsilon as a separate vowel. **Validation.** Environment/audio oracle.

### Family `gamma_chi_front_vowel`

**Task/purpose.** Recognize reviewed palatal versus non-palatal realizations of
`γ/χ` and related sequences before vowels.
**Response/template.** Audio/text match or environment classification.
**Derivation.** Following vowel and lexical/profile pronunciation.
**Difficulty.** L2 isolated words; L3 minimal contrasts; L4 connected audio.
**Constraints.** No accent scoring or imitation claim.
**Validation.** Recorded pronunciation annotations.

### Family `syllable_segmentation`

**Task/purpose.** Divide reviewed words into syllables as preparation for stress
and spelling. **Response/template.** Boundary placement or ordered chunks.
**Derivation.** Authored syllabification from phonological/orthographic policy.
**Difficulty.** L1 simple CV; L2 digraphs; L3 consonant clusters/hiatus; L4
inflected words. **Distractors.** Split every two-letter grapheme, use visual
length alone. **Validation.** Reviewed syllable registry.

### Family `lexical_tonos_placement`

**Task/purpose.** Place or identify tonos on the stressed syllable of a known
form. **Response/template.** Character insertion, syllable choice, or spelling.
**Derivation.** Lexeme/form stress index and monotonic renderer.
**Difficulty.** L1 two syllables; L2 three; L3 spelling homographs/stress
contrasts; L4 longer inflected forms. **Distractors.** Always final/penultimate,
interface-language stress. **Validation.** Paradigm and Unicode round-trip.

### Family `stress_shift_inflection`

**Task/purpose.** Preserve or move stress correctly across reviewed noun or verb
forms. **Response/template.** Complete an inflected form or compare a paradigm.
**Derivation.** Stored stress index per cell, never suffix guessing alone.
**Difficulty.** L2 transparent pair; L3 genitive/plural or past shift; L4 mixed
class. **Distractors.** Keep accent on the same written vowel universally.
**Validation.** Exhaustive shipped paradigms.

### Family `diaeresis_hiatus`

**Task/purpose.** Use `ϊ/ϋ/ΐ/ΰ` where adjacent vowels must be read separately.
**Response/template.** Diacritic insertion, syllable count, or audio spelling.
**Derivation.** Lexical spelling and syllabification.
**Difficulty.** L2 clear familiar words; L3 tonos+diaeresis; L4 inflection.
**Distractors.** Treat any adjacent vowels as a digraph or any hiatus as
diaeresis. **Validation.** Lexicon/syllable registry.

### Family `apostrophe_elision`

**Task/purpose.** Recognize and produce a small reviewed set of contemporary
elisions. **Response/template.** Form selection or error repair.
**Derivation.** Construction, register, neighboring sound, and editorial policy.
**Difficulty.** L2 fixed high-frequency forms; L3 optional register variants;
L4 connected text. **Constraints.** No productive deletion from any vowel-final
word. **Validation.** Authored construction registry.

### Family `greek_punctuation`

**Task/purpose.** Interpret and insert contemporary Greek question and sentence
punctuation. **Response/template.** Punctuation choice or short-text repair.
**Derivation.** Speech act, clause boundary, and editorial policy.
**Difficulty.** L1 `.` versus `;`; L2 comma; L3 dialogue/`·`; L4 mixed audit.
**Distractors.** Latin semicolon meaning, English question mark as canonical.
**Validation.** Meaning-preserving punctuation oracle.

### Family `keyboard_transliteration`

**Task/purpose.** Locate Greek keyboard characters and, when explicitly asked,
convert a bounded transliteration to Greek. **Response/template.** Key matching
or short text. **Derivation.** Declared keyboard layout/transliteration scheme
and unique reviewed word set. **Difficulty.** L1 letters; L2 digraphs; L3
stress; L4 ambiguity resolved by lexical choices. **Constraints.** Never accept
unspecified ad hoc Greeklish as unique. **Validation.** Declared scheme only.

### Family `audio_spelling_dictation`

**Task/purpose.** Write a reviewed word or short phrase from audio and context.
**Response/template.** Short text or segmented fields.
**Derivation.** Licensed recording, transcript, lexical/semantic cue, and
accepted spelling set. **Difficulty.** L1 segmented familiar word; L2 phrase;
L3 homophonous spelling resolved by context; L4 normal-rate sentence.
**Constraints.** Reject inherently underdetermined audio-only spelling.
**Validation.** Transcript/audio/manual review.

### Family `script_sound_audit`

**Task/purpose.** Find one spelling, stress, sigma, syllabification, sound, or
punctuation mismatch. **Response/template.** Token selection plus correction.
**Derivation.** Inject exactly one classified fault into a valid item.
**Difficulty.** L2 one word; L3 phrase; L4 audio/text evidence.
**Distractors.** Valid variants and unrelated style preferences.
**Validation.** One root mutation; correction restores source.

### Cross-family progression

Teach letter identity and keyboard access before timed decoding. Introduce
vowel/consonant sequences and syllables before productive stress, then
dictation. Revisit spelling inside inflection rather than declaring script
“finished.” Audio mastery and text-only orthography mastery remain separate.

## 3. Category: Vocabulary, noun phrases, case, and agreement

### Category purpose

Train retrieval of useful words inside semantically determined noun phrases and
control gender, number, case, article, modifier agreement, possession,
prepositions, and practical quantities.

### Learn-card content

- Learn a noun with its article and plural, for example `ο φίλος`, `η φίλη`,
  `το βιβλίο`.
- Greek has three genders and four productive noun cases in the target:
  nominative, genitive, accusative, and vocative.
- Case follows a role or construction: `Η Μαρία βλέπει τον Νίκο` versus
  `Ο Νίκος βλέπει τη Μαρία`.
- Articles and adjectives agree: `η καλή φίλη`, `της καλής φίλης`.
- The indefinite article has no ordinary plural; other indefinite/quantity
  expressions supply plural meanings.
- `σε` contracts with the definite article: `στον, στη(ν), στο, στους, στις,
  στα`.
- Possession commonly uses a weak genitive after the noun phrase:
  `το βιβλίο μου`.

### Prerequisites

Category 2 letter and tonos recognition. Later families assume earlier
gender/article and case-role families.

### Category boundaries

This category owns nominal morphology and prepositional noun phrases. Personal
pronoun clitic order belongs to Category 5. Verb agreement and aspect belong to
Category 4. Number drills remain communicative rather than duplicating the
dedicated numbers-and-dates app.

### Common misconceptions

- Guessing gender reliably from meaning or an interface-language equivalent.
- Treating all nouns ending in one letter as the same declension.
- Assigning case by position alone.
- Using nominative after every preposition or using an Ancient Greek dative.
- Changing the noun but leaving article/adjective in their citation form.
- Giving the indefinite article a mechanically invented plural.
- Treating `στο` as an unanalyzable preposition in every context.
- Translating possession by copying interface-language word order.

### Family `contextual_lexeme_choice`

**Task/purpose.** Choose a reviewed noun/adjective/adverb for a pictured or
sentential meaning. **Response/template.** Single-choice, matching, or bounded
completion. **Derivation.** Semantic frame, sense, domain, register.
**Difficulty.** L1 concrete contrast; L2 related senses; L3 collocational
constraint; L4 register/profile. **Distractors.** Same broad topic but wrong
sense/selection. **Validation.** Sense annotations and entailment.

### Family `collocation_phrase_choice`

**Task/purpose.** Retrieve common multiword combinations rather than translate
word by word. **Response/template.** Completion, ordered chunks, or matching.
**Derivation.** Reviewed collocation frame with inflectable slots.
**Difficulty.** L1 fixed phrase; L2 variable argument; L3 case/preposition; L4
register. **Distractors.** Literal calques and syntactically compatible but
non-idiomatic combinations. **Validation.** Authored collocation registry.

### Family `noun_gender_article`

**Task/purpose.** Retrieve a noun's gender through the correct nominative
singular article. **Response/template.** `ο/η/το` choice or paired production.
**Derivation.** Lexical gender. **Difficulty.** L1 transparent frequent items;
L2 overlapping endings; L3 human/role contrasts; L4 less predictable lexemes.
**Distractors.** Meaning-based or suffix-only guesses.
**Validation.** Lexicon, balanced genders.

### Family `noun_number_form`

**Task/purpose.** Produce or recognize singular/plural noun forms with stress.
**Response/template.** Short text, transformation, or matching.
**Derivation.** Stored declension cell. **Difficulty.** L1 regular same-syllable
forms; L2 stress shift; L3 stem/ending change; L4 plural-only/mass constraint.
**Distractors.** Add one universal plural suffix.
**Validation.** Exhaustive noun paradigms.

### Family `noun_declension_pattern`

**Task/purpose.** Group known nouns by the forms needed to inflect them, not by
gender alone. **Response/template.** Paradigm matching or missing cell.
**Derivation.** Reviewed declension class and principal nominal forms.
**Difficulty.** L2 one contrast; L3 same ending/different paradigm; L4 mixed
gender/class. **Constraints.** Labels serve prediction but never override
lexical forms. **Validation.** Paradigm registry.

### Family `case_semantic_role`

**Task/purpose.** Select nominative or accusative from subject, predicate, and
object roles in a clear event frame. **Response/template.** Case label, article
form, or sentence completion. **Derivation.** Predicate argument roles and
voice. **Difficulty.** L1 canonical order; L2 reversed order; L3 pronoun/
animate pair; L4 topic/focus order. **Distractors.** First noun is nominative,
animate means subject. **Validation.** Role graph.

### Family `genitive_relation`

**Task/purpose.** Form and interpret genitives expressing possession and a
reviewed set of relations. **Response/template.** Phrase completion, matching,
or paraphrase choice. **Derivation.** Relation frame, possessor features,
paradigm. **Difficulty.** L1 proper name/pronoun; L2 common noun phrase; L3
plural/stress movement; L4 ambiguous relation resolved by context.
**Distractors.** Accusative possessor, interface-language apostrophe.
**Validation.** Relation and agreement tree.

### Family `vocative_address`

**Task/purpose.** Use a reviewed vocative form in direct address.
**Response/template.** Form production or sentence repair.
**Derivation.** Addressee lexeme, number, register, vocative paradigm.
**Difficulty.** L1 invariant/common names; L2 masculine alternation; L3
adjective/title phrase; L4 punctuation/register. **Distractors.** Nominative
article retained, accusative form. **Validation.** Vocative cells and speech act.

### Family `definite_article_case`

**Task/purpose.** Inflect the definite article for gender, number, and case.
**Response/template.** Article choice, paradigm cell, or phrase completion.
**Derivation.** Feature bundle. **Difficulty.** L1 singular nominative/
accusative; L2 plural/genitive; L3 phonological `ν` policy; L4 mixed sentence.
**Distractors.** Gender match without case, one plural article.
**Validation.** Exhaustive article paradigm/editorial policy.

### Family `indefinite_article_use`

**Task/purpose.** Choose and inflect `ένας/μία(μια)/ένα` when indefinite
singular meaning licenses it, and omit/replace it otherwise.
**Response/template.** Form selection or zero/article choice.
**Derivation.** Reference, number, gender, case, register.
**Difficulty.** L1 singular introduction; L2 case; L3 profession/mass/
predicative contexts; L4 variant `μία/μια`.
**Distractors.** Indefinite article everywhere English has `a`, invented plural.
**Validation.** Determination engine.

### Family `adjective_agreement`

**Task/purpose.** Inflect an adjective for its noun's gender, number, and case.
**Response/template.** Form input, matching, or agreement repair.
**Derivation.** Controller features and stored adjective class.
**Difficulty.** L1 regular nominative; L2 accusative/genitive; L3 stress/class
alternation; L4 multiple modifiers. **Distractors.** Citation form, nearest noun
controller. **Validation.** Agreement links and full paradigms.

### Family `adjective_position_interpretation`

**Task/purpose.** Interpret and build reviewed attributive and predicative
adjective patterns. **Response/template.** Meaning choice, ordering, or
completion. **Derivation.** Copular/attributive construction, determination,
information structure. **Difficulty.** L2 canonical patterns; L3 repeated
article or marked focus; L4 meaning-sensitive authored pair.
**Constraints.** Do not claim free adjective placement is interchangeable.
**Validation.** Construction registry.

### Family `demonstrative_noun_phrase`

**Task/purpose.** Select and inflect proximal/distal demonstratives in licensed
noun-phrase patterns. **Response/template.** Form choice or phrase construction.
**Derivation.** Deixis, noun features, case, article construction.
**Difficulty.** L1 `αυτός/αυτή/αυτό`; L2 case/plural; L3 contrast/word order;
L4 discourse distance. **Distractors.** Omit licensed article, no agreement.
**Validation.** Deictic state and paradigms.

### Family `possessive_noun_clitic`

**Task/purpose.** Attach weak genitive possessives such as `μου, σου, του` to
the correct noun phrase and resolve their referent.
**Response/template.** Completion, ordering, or referent choice.
**Derivation.** Possessor person/number/gender, host, phrase boundary.
**Difficulty.** L1 one host; L2 competing nouns; L3 emphatic possessor contrast;
L4 coordination. **Distractors.** Prenominal English order, attach to adjective
without licensed structure. **Validation.** Possession graph and host.

### Family `quantifier_agreement_countability`

**Task/purpose.** Choose and inflect common quantifiers/indefinites from amount,
countability, polarity, and noun features. **Response/template.** Choice,
completion, or phrase matching. **Derivation.** Quantity frame and lexical
compatibility. **Difficulty.** L1 `πολύς/λίγος`; L2 plural indefinites; L3
count/mass contrast; L4 negative/partitive meaning.
**Distractors.** Adverb `πολύ` used as every adjective form.
**Validation.** Quantifier frames.

### Family `preposition_case_frame`

**Task/purpose.** Select a common preposition and its licensed noun-phrase case
for location, source, accompaniment, instrument, time, or relation.
**Response/template.** Preposition/case choice or phrase completion.
**Derivation.** Semantic relation and reviewed valency frame.
**Difficulty.** L1 `σε/από/με`; L2 `για/χωρίς`; L3 lexical preposition frame;
L4 competing spatial/metaphorical relations. **Distractors.** Calque an
interface-language preposition, use nominative by default.
**Validation.** Relation-to-frame registry.

### Family `se_article_contraction`

**Task/purpose.** Form and expand `σε +` definite article contractions.
**Response/template.** Transformation, selection, or error repair.
**Derivation.** Article gender/number/case plus editorial `ν` policy.
**Difficulty.** L1 `στο/στη`; L2 full singular/plural set; L3 phrase analysis;
L4 contrast with uncontracted boundaries where licensed.
**Distractors.** Contract every preposition, lose noun features.
**Validation.** Exhaustive contraction table.

### Family `number_date_time_price`

**Task/purpose.** Interpret and produce practical quantities, calendar/time
expressions, and prices with required gender/case/ordinal forms.
**Response/template.** Numeric input, ordered fields, choice, or short phrase.
**Derivation.** Exact numeric/calendar object and reviewed grammar.
**Difficulty.** L1 0–20/time on hour; L2 larger numbers/dates/prices; L3
agreement and idiomatic time; L4 mixed itinerary/receipt.
**Constraints.** Valid dates only; no dedicated-app depth.
**Validation.** Independent arithmetic/calendar oracle.

### Family `noun_phrase_construction`

**Task/purpose.** Build a complete noun phrase from meaning and feature cards.
**Response/template.** Ordered chunks or multiple named fields.
**Derivation.** Reference, relation, gender, number, case, modifiers.
**Difficulty.** L1 article+noun; L2 adjective; L3 demonstrative/possessive/
preposition; L4 multiple agreement links. **Distractors.** Locally correct forms
with incompatible global bundle. **Validation.** Feature unification/back-parse.

### Family `nominal_agreement_audit`

**Task/purpose.** Locate one gender, number, case, article, contraction, stress,
or modifier-agreement error. **Response/template.** Fault selection and repair.
**Derivation.** Mutate one dependency in a valid phrase/sentence.
**Difficulty.** L2 local; L3 distant controller; L4 plausible wrong case from
word order. **Distractors.** Accepted article/stress variants.
**Validation.** Exactly one root fault; repaired parse equals source.

### Cross-family progression

Teach gender with article and useful meaning, then number. Introduce
nominative/accusative from role reversals, genitive from relations, and vocative
from speech acts. Add adjective and determiner agreement before dense noun
phrases. Prepositions and quantities reuse the same case engine. Never ask for
an unexplained paradigm table before learners have interpreted the features.

## 4. Category: Verbs, aspect, time, mood, and voice

### Category purpose

Train retrieval of verb paradigms and, more importantly, selection of the
imperfective/perfective stem, time frame, particle, voice, person, and polarity
that realize an intended event.

### Learn-card content

- Learn frequent verbs with principal forms, not only the `-ω` dictionary form:
  `γράφω – γράψω – έγραψα`.
- The imperfective stem presents an event internally, habitually, repeatedly,
  or in progress; the perfective stem presents a bounded whole in a licensed
  context.
- Past contrasts include `έγραφα` and `έγραψα`; future and `να` constructions
  can also contrast stems: `θα γράφω / θα γράψω`, `να γράφω / να γράψω`.
- `θα` and `να` do not create infinitives; the following form agrees with its
  subject: `Θέλω να φύγω`, `Θέλει να φύγει`.
- Active and non-active morphology does not mechanically equal active and
  passive meaning. Some verbs are lexical in one voice or use non-active forms
  for middle/reflexive meanings.
- Positive commands and negative prohibitions use different constructions.

### Prerequisites

Category 2 stress/spelling; Category 3 basic subject features and case roles.

### Category boundaries

This category owns verb forms and event meaning. Object-pronoun placement and
clause-wide word order are in Category 5. Discourse sequencing is in Category
6. Every generated verb must come from reviewed principal-form data.

### Common misconceptions

- Treating the present lemma as enough to predict a perfective/aorist stem.
- Equating imperfective with “long” and perfective with “short.”
- Choosing aorist for every completed past event without viewpoint/context.
- Treating `θα` as a self-contained future-tense ending.
- Treating `να + verb` as an invariant infinitive and forgetting subject
  agreement.
- Equating active morphology with agentive meaning and non-active morphology
  with passive meaning.
- Adding an augment to every past form or leaving stress unchanged universally.
- Forming a negative imperative by adding `δεν` to the positive command.

### Family `verb_principal_stem_set`

**Task/purpose.** Associate a verb sense with its reviewed imperfective,
perfective/dependent, and aorist principal forms.
**Response/template.** Matching, missing form, or set selection.
**Derivation.** Lexeme/sense principal-form registry.
**Difficulty.** L1 transparent high-frequency pair; L2 stem change; L3
suppletion/voice; L4 same lemma different sense/frame.
**Distractors.** Productive-looking but unattested transformation.
**Validation.** Lexical data, no runtime guessing.

### Family `present_active_form`

**Task/purpose.** Conjugate common active verbs for person/number in present
imperfective contexts. **Response/template.** Form input or sentence completion.
**Derivation.** Lexeme class, stem, person, number, stress.
**Difficulty.** L1 first conjugation; L2 second-conjugation patterns; L3
irregular; L4 coordinated subjects. **Distractors.** Pronoun copied as ending,
stress frozen. **Validation.** Exhaustive shipped cells.

### Family `present_nonactive_form`

**Task/purpose.** Produce and interpret common non-active present forms.
**Response/template.** Form input, matching, or sentence completion.
**Derivation.** Voice behavior, person/number, lexical meaning.
**Difficulty.** L2 regular forms; L3 deponent/middle meanings; L4 sense contrast.
**Distractors.** Label every form passive, active ending on non-active stem.
**Validation.** Voice/sense registry.

### Family `high_frequency_irregular_present`

**Task/purpose.** Retrieve frequent irregular present forms such as reviewed
forms of `είμαι, έχω, λέω, τρώω, πάω`.
**Response/template.** Completion, paradigm cell, or audio form.
**Derivation.** Stored paradigm. **Difficulty.** L1 singular; L2 plural; L3
clause context; L4 mixed audit. **Distractors.** Regularized form.
**Validation.** Exhaustive forms and accepted variants.

### Family `copula_existence_possession`

**Task/purpose.** Distinguish reviewed constructions with `είμαι`, `υπάρχει`,
and possessive/existential uses of `έχω`.
**Response/template.** Construction choice or sentence completion.
**Derivation.** Predication, existence, location, possession frame.
**Difficulty.** L1 identity/location; L2 possession/existence; L3 impersonal
number/reference; L4 discourse contrast. **Distractors.** Word-for-word
interface-language copula. **Validation.** Semantic frames.

### Family `imperfect_form`

**Task/purpose.** Form the imperfect and connect it to past internal,
habitual, or background viewpoint.
**Response/template.** Form input, timeline matching, or completion.
**Derivation.** Imperfective stem, person/number, augment/stress policy.
**Difficulty.** L2 regular singular; L3 plural/irregular; L4 discourse context.
**Distractors.** Aorist stem, present form plus past particle.
**Validation.** Paradigm and event model.

### Family `past_augment_stress`

**Task/purpose.** Apply reviewed augment and stress behavior in past forms.
**Response/template.** Form completion or compare principal parts.
**Derivation.** Lexeme-specific past formation and syllable/stress constraints.
**Difficulty.** L2 clear augment; L3 augment absent in longer form; L4 internal/
irregular patterns. **Distractors.** Prefix `ε-` universally.
**Validation.** Stored paradigm plus syllable oracle.

### Family `aorist_active_form`

**Task/purpose.** Form common active aorists for person/number.
**Response/template.** Short text or sentence completion.
**Derivation.** Active aorist stem and past endings.
**Difficulty.** L2 transparent `-σ-`; L3 consonant/stem change; L4 irregular/
suppletive. **Distractors.** Apply `-σα` to present lemma universally.
**Validation.** Exhaustive shipped cells.

### Family `aorist_nonactive_form`

**Task/purpose.** Produce and interpret a bounded past in reviewed non-active
verbs. **Response/template.** Form input or active/non-active event matching.
**Derivation.** Non-active aorist principal form, person, sense/voice frame.
**Difficulty.** L3 frequent regular classes; L4 stem/stress change and lexical
middle. **Constraints.** Review every included paradigm.
**Validation.** Stored forms and event-role graph.

### Family `past_aspect_choice`

**Task/purpose.** Choose imperfect or aorist from event viewpoint in a
context-rich past frame. **Response/template.** Form choice, timeline, or
sentence completion. **Derivation.** Boundedness, repetition, internal view,
background/foreground, temporal frame.
**Difficulty.** L2 habitual versus one bounded event; L3 interruption/
background; L4 discourse re-framing. **Distractors.** Duration alone,
“completed = always aorist.” **Validation.** Authored event model.

### Family `future_tha_aspect`

**Task/purpose.** Build and interpret `θα` constructions with imperfective or
perfective forms. **Response/template.** Aspect/form choice or ordered chunks.
**Derivation.** future/epistemic frame, repetition/boundedness, subject.
**Difficulty.** L2 one-off versus routine; L3 ongoing/future inference; L4
negation/adverb interaction. **Distractors.** Infinitive after `θα`, one future
stem for all meanings. **Validation.** Particle/aspect engine.

### Family `na_clause_person_aspect`

**Task/purpose.** Select person and aspect after `να` for desire, purpose,
evaluation, or complement frames.
**Response/template.** Form completion or meaning contrast.
**Derivation.** matrix frame, subject identity, aspect, polarity.
**Difficulty.** L2 same subject; L3 changed embedded subject; L4 aspect/
pragmatic contrast. **Distractors.** Invariant infinitive, copy matrix person.
**Validation.** Two-clause subject/event graph.

### Family `particle_construction_choice`

**Task/purpose.** Choose among finite assertion, `θα`, `να`, `ας`, and a
reviewed imperative from speech act and modality.
**Response/template.** Particle/construction selection.
**Derivation.** assertion, projection, desire, suggestion, command, register.
**Difficulty.** L2 clear speech acts; L3 overlapping polite functions; L4
negation/aspect. **Distractors.** Translate one interface word mechanically.
**Validation.** Modal/speech-act frame.

### Family `positive_imperative`

**Task/purpose.** Produce singular/plural positive commands with the intended
aspect. **Response/template.** Form input or instruction completion.
**Derivation.** imperative principal form, number, aspect, register.
**Difficulty.** L2 common perfective commands; L3 imperfective instruction;
L4 irregular/clitic host. **Distractors.** Present indicative used universally.
**Validation.** Stored imperative forms.

### Family `negative_prohibition`

**Task/purpose.** Form a prohibition with `μη(ν)` and the licensed finite form
rather than a negated positive imperative.
**Response/template.** Construction choice or repair.
**Derivation.** polarity, person, aspect, phonological/editorial context.
**Difficulty.** L2 one verb; L3 aspect contrast; L4 clitic/embedded frame.
**Distractors.** `δεν + imperative`, wrong particle.
**Validation.** Negation/particle grammar.

### Family `perfect_construction`

**Task/purpose.** Build and interpret reviewed perfect constructions such as
`έχω γράψει` and distinguish result/relevance from simple past.
**Response/template.** Form choice, ordered chunks, or timeline meaning.
**Derivation.** auxiliary person, invariant dependent form, temporal reference.
**Difficulty.** L3 present perfect; L4 pluperfect/future perfect and discourse
contrast. **Distractors.** Inflect both components, use aorist after `έχω`.
**Validation.** Construction table and event-state model.

### Family `conditional_hypothetical`

**Task/purpose.** Interpret and construct a controlled set of real and
hypothetical conditions using reviewed `αν` and `θα` sequences.
**Response/template.** Clause pairing, tense choice, or completion.
**Derivation.** world status, time reference, likelihood, clause relation.
**Difficulty.** L3 open real condition; L4 counterfactual pattern.
**Constraints.** Only authored schema combinations; do not reduce to English
labels. **Validation.** Possible-world/timeline oracle.

### Family `voice_event_mapping`

**Task/purpose.** Map active/non-active morphology to active, passive, middle,
reflexive, reciprocal, or lexical meaning in reviewed verbs.
**Response/template.** Meaning choice, role diagram, or form selection.
**Derivation.** Lexeme sense, construction, agent/patient expression.
**Difficulty.** L2 transparent passive; L3 lexical middle/deponent; L4 active/
non-active sense pair. **Distractors.** Form directly equals semantic passive.
**Validation.** Sense-specific voice registry.

### Family `passive_agent_expression`

**Task/purpose.** Interpret or produce a bounded set of passive clauses and
licensed agent phrases. **Response/template.** Role assignment, transformation,
or phrase completion. **Derivation.** event roles, voice, tense/aspect, agent
salience. **Difficulty.** L3 explicit agent; L4 agent omitted/information
structure. **Constraints.** Preserve meaning and tense; no blind active-passive
string rewrite. **Validation.** Event-role graph.

### Family `gerund_ontas`

**Task/purpose.** Interpret and form common same-subject adverbial
`-οντας/-ώντας` constructions. **Response/template.** Form input, subject
resolution, or clause matching. **Derivation.** reviewed stem, stress, subject
control, temporal/manner relation. **Difficulty.** L3 transparent form; L4
clitic/negation or ambiguity rejection. **Distractors.** Treat as unrestricted
infinitive/participle. **Validation.** Subject-control and form registry.

### Family `same_changed_subject_complement`

**Task/purpose.** Track subject agreement across a matrix verb and `να` clause.
**Response/template.** Verb-form choice, referent selection, or transformation.
**Derivation.** two event nodes and explicit/covert subjects.
**Difficulty.** L2 same subject; L3 different person; L4 ambiguous pronoun
resolved by context. **Distractors.** Embedded verb invariant.
**Validation.** Reference and agreement graph.

### Family `verb_sequence_construction`

**Task/purpose.** Assemble a complete verb phrase from time, aspect, modality,
voice, polarity, person, and adverb cards.
**Response/template.** Ordered chunks or named morphology fields.
**Derivation.** Typed feature bundle and construction grammar.
**Difficulty.** L2 one auxiliary/particle; L3 aspect+negation; L4 perfect/
hypothetical/voice interaction. **Distractors.** Individually valid incompatible
forms. **Validation.** Back-parse feature identity.

### Family `verb_aspect_audit`

**Task/purpose.** Locate one stem, ending, stress, particle, aspect, voice, or
event-viewpoint error. **Response/template.** Fault selection and repair.
**Derivation.** Mutate one valid verb construction.
**Difficulty.** L2 local morphology; L3 aspect context; L4 multi-clause.
**Distractors.** Accepted variant or alternative meaning clearly excluded by
context. **Validation.** One root mutation; corrected event/frame identity.

### Cross-family progression

Teach a small present lexicon with principal stems visible. Add imperfect and
aorist form separately, then contrast their meanings. Reuse the same aspect
pair under `θα`, `να`, and commands so the learner discovers a system rather
than isolated “tenses.” Add non-active forms by sense and only then passive
transformations. Perfects and hypotheses are later integration work.

## 5. Category: Pronouns, clitics, negation, questions, and sentence structure

### Category purpose

Train reference tracking and the realization of participants as strong or weak
pronouns, with correct form, case, order, host, negation, question structure,
relative linkage, and information-sensitive constituent order.

### Learn-card content

- Greek often omits a subject pronoun when the verb ending and context identify
  the subject. An explicit `εγώ` or `εσύ` can mark contrast or emphasis.
- Strong pronouns can follow prepositions or bear emphasis. Weak pronouns have
  special forms and positions: `μου το δίνει`.
- Weak pronouns normally precede a finite verb, but follow a positive
  imperative and a gerund: `δώσ' μου το`, within the reviewed editorial policy.
- A possessive weak genitive attaches to a noun phrase: `το σπίτι μας`.
- `δεν` negates ordinary finite assertions; `μη(ν)` occurs with `να`,
  prohibitions, and other licensed non-assertive frames.
- Greek permits several constituent orders. Case, clitics, and context reveal
  roles and information structure.

### Prerequisites

Category 3 case/agreement; Category 4 finite forms, particles, and imperatives.

### Category boundaries

Nominal possessives are introduced in Category 3 and integrated here. This
category owns pronominal reference, clitic sequence/host, clause polarity,
questions, relatives, and order. Discourse across multiple sentences belongs
to Category 6.

### Common misconceptions

- Requiring an overt subject pronoun in every clause.
- Treating explicit subject pronouns as always neutral and redundant.
- Choosing weak-pronoun form by person alone rather than grammatical role.
- Ordering multiple clitics like full noun phrases or the interface language.
- Placing every clitic before every verb form.
- Confusing possessive `μου` with object `μου` without checking its host.
- Using `δεν` and `μην` interchangeably.
- Inferring subject and object solely from left-to-right position.
- Treating invariant relative `που` as if it displayed the missing role.

### Family `subject_pronoun_expression`

**Task/purpose.** Decide whether an overt subject pronoun is omitted, neutral,
contrastive, or required by the authored context.
**Response/template.** Zero/pronoun choice, focus matching, or rewrite.
**Derivation.** verb agreement, discourse salience, contrast, coordination.
**Difficulty.** L1 recoverable subject; L2 contrast; L3 switch-reference; L4
ambiguity/register. **Distractors.** Pronoun always required/always optional.
**Validation.** Discourse/reference model.

### Family `strong_personal_pronoun_case`

**Task/purpose.** Select strong nominative, genitive, or accusative forms in
emphasis, comparison, and prepositional frames.
**Response/template.** Form choice or phrase completion.
**Derivation.** referent features, case role, preposition/construction.
**Difficulty.** L2 singular; L3 plural/gender; L4 contrastive coordination.
**Distractors.** Weak form in strong slot, nominative after preposition.
**Validation.** Pronoun paradigms and frames.

### Family `weak_accusative_object`

**Task/purpose.** Replace or resolve a direct object with the correct weak
accusative form. **Response/template.** Form choice, transformation, or
referent match. **Derivation.** patient/theme features and discourse status.
**Difficulty.** L1 singular; L2 gender/plural; L3 competing referents; L4
clitic doubling. **Distractors.** Genitive indirect form, subject form.
**Validation.** Event roles and pronoun paradigm.

### Family `weak_genitive_object`

**Task/purpose.** Replace or resolve a licensed indirect/recipient relation
with the correct weak genitive form.
**Response/template.** Form input, transformation, or referent choice.
**Derivation.** recipient/experiencer frame, features, verb valency.
**Difficulty.** L2 one recipient; L3 person/gender ambiguity; L4 lexical frame.
**Distractors.** Accusative copied from direct object, preposition calque.
**Validation.** Valency and role graph.

### Family `weak_pronoun_role_contrast`

**Task/purpose.** Distinguish formally overlapping weak pronouns by direct
object, indirect object, and possession roles.
**Response/template.** Role label, host selection, or paraphrase.
**Derivation.** syntax tree, host, verb/noun frame, referent.
**Difficulty.** L2 different forms; L3 same surface `μου/σου/του`; L4 nested
noun phrase. **Distractors.** Meaning assigned by form alone.
**Validation.** Typed dependency graph.

### Family `double_clitic_order`

**Task/purpose.** Order reviewed genitive and accusative weak-pronoun clusters.
**Response/template.** Ordered chunks or sentence repair.
**Derivation.** role slots, person/gender restrictions, host.
**Difficulty.** L3 singular pair; L4 gender/plural and referent competition.
**Distractors.** direct-before-indirect, duplicate incompatible roles.
**Validation.** Exhaustive licensed cluster automaton.

### Family `finite_clitic_placement`

**Task/purpose.** Place weak pronouns around an ordinary finite verb and its
particles/negation. **Response/template.** Ordering or slot selection.
**Derivation.** clause type, particle sequence, negation, finite host.
**Difficulty.** L2 plain finite; L3 `θα/να` and negation; L4 two clitics.
**Distractors.** attach before particle, after every finite verb.
**Validation.** Construction/slot grammar.

### Family `imperative_gerund_clitic_placement`

**Task/purpose.** Place weak pronouns after positive imperatives and gerunds in
reviewed standard constructions, contrasting finite/preverbal placement.
**Response/template.** Ordering, transformation, or error repair.
**Derivation.** host type, polarity, clitic sequence, editorial apostrophe/
accent policy. **Difficulty.** L3 one clitic; L4 cluster/phonological spelling.
**Distractors.** preserve preverbal placement, apply enclisis to prohibition.
**Validation.** Host-sensitive automaton.

### Family `clitic_doubling_dislocation`

**Task/purpose.** Interpret and produce a controlled set of clitic-doubled or
dislocated objects where discourse/context licenses them.
**Response/template.** Meaning/focus choice, clitic insertion, or ordering.
**Derivation.** referent specificity, discourse status, register, role.
**Difficulty.** L3 pronoun/topic; L4 full DP and information structure.
**Constraints.** Never present doubling as universally required/optional.
**Validation.** Authored constructions and profile.

### Family `demonstrative_indefinite_pronoun`

**Task/purpose.** Select inflected demonstrative and common indefinite pronouns
from reference and case. **Response/template.** Form choice or referent match.
**Derivation.** deixis/quantification, gender, number, case.
**Difficulty.** L2 nearby/distal; L3 `κάποιος/κανένας` with polarity; L4
discourse inference. **Distractors.** adjective form with missing host.
**Validation.** Reference/quantifier model.

### Family `den_min_negation`

**Task/purpose.** Choose `δεν` versus `μη(ν)` from clause type and meaning.
**Response/template.** Particle choice, sentence completion, or audit.
**Derivation.** assertion, `να` clause, prohibition, gerund, polarity, following
sound/editorial policy. **Difficulty.** L1 finite assertion; L2 prohibition;
L3 embedded `να`; L4 scope/cluster. **Distractors.** translate one word “not.”
**Validation.** Clause grammar.

### Family `negation_scope`

**Task/purpose.** Determine which predicate, quantity, or participant a
negation affects. **Response/template.** Meaning paraphrase, scope brackets, or
word-order choice. **Derivation.** logical form, prosody/context, constituent
placement. **Difficulty.** L2 predicate; L3 quantity/coordination; L4 contrastive
focus. **Distractors.** any negative word negates whole discourse identically.
**Validation.** Scope tree and entailments.

### Family `yes_no_question`

**Task/purpose.** Recognize and produce yes/no questions using context,
intonation/audio where present, order, and Greek punctuation.
**Response/template.** punctuation/form choice, audio speech-act match, or
rewrite. **Derivation.** proposition plus interrogative speech act.
**Difficulty.** L1 punctuation; L2 statement/question audio; L3 focus/order;
L4 negative question response context. **Validation.** Speech-act annotations.

### Family `wh_question_form`

**Task/purpose.** Choose and position a reviewed interrogative from the
information gap and case/preposition role.
**Response/template.** question word, ordering, or question construction.
**Derivation.** missing semantic role, animacy, location/time/manner/quantity,
case. **Difficulty.** L1 `ποιος/τι/πού`; L2 inflected `ποιος`; L3 preposition;
L4 information-sensitive order. **Distractors.** English word-for-word order,
wrong role. **Validation.** Question-to-answer relation.

### Family `relative_pou`

**Task/purpose.** Link an antecedent to a gap with invariant `που` and recover
the role from clause structure/clitics.
**Response/template.** clause completion, antecedent/gap match, or meaning.
**Derivation.** reference graph and relative construction.
**Difficulty.** L2 subject/object; L3 prepositional/possessive strategies in
reviewed subset; L4 competing antecedents. **Distractors.** inflect `που` for
antecedent gender. **Validation.** Antecedent-gap graph.

### Family `inflected_relative_o_opoios`

**Task/purpose.** Select forms of `ο οποίος` in a bounded formal/clarifying
relative construction. **Response/template.** Form choice or clause completion.
**Derivation.** gap case, antecedent gender/number, register.
**Difficulty.** L3 nominative/accusative; L4 genitive/preposition and ambiguity
repair. **Distractors.** agree case with antecedent's matrix role.
**Validation.** Two-clause case/agreement graph.

### Family `neutral_marked_word_order`

**Task/purpose.** Interpret or order full constituents from roles and a declared
topic/focus context. **Response/template.** Ordered chunks, emphasis matching,
or role assignment. **Derivation.** event graph, case, givenness, contrast.
**Difficulty.** L2 neutral order; L3 object topicalization; L4 clitic doubling/
focus. **Distractors.** first noun must be subject, all orders mean exactly the
same thing. **Validation.** Information-structure constraints.

### Family `sentence_pattern_construction`

**Task/purpose.** Assemble a complete statement/question/negative/relative
clause from semantic and feature cards. **Response/template.** Ordered chunks
or named fields. **Derivation.** construction grammar, morphology, reference,
information structure. **Difficulty.** L1 simple SVO; L2 question/negative; L3
clitic/relative; L4 marked order. **Validation.** Back-parse and entailment.

### Family `pronoun_syntax_audit`

**Task/purpose.** Locate one reference, pronoun form, clitic order/host,
negation, question, relative, or word-order fault.
**Response/template.** Fault selection and repair.
**Derivation.** One typed mutation in a valid clause.
**Difficulty.** L2 local; L3 competing referents; L4 grammatically plausible
but discourse-incompatible alternative. **Validation.** Exactly one root fault.

### Cross-family progression

Begin with omitted versus explicit subject pronouns and one direct object.
Contrast accusative and genitive object roles before clusters. Teach placement
around plain finite verbs, then particles/negation, then imperative/gerund
hosts. Questions and relatives begin with explicit semantic gaps. Marked order
comes only after case and reference reliably preserve roles.

## 6. Category: Connected Greek, discourse, register, and variation

### Category purpose

Train choices that only become meaningful across clauses or turns: comparison,
connectors, temporal/event sequencing, reference, topic/focus, politeness,
register, and explicit regional/profile interpretation.

### Learn-card content

- A sequence of individually grammatical sentences can still be incoherent if
  reference, tense/aspect, or connectors conflict.
- `και, αλλά, επειδή, γι' αυτό, αν, όταν, πριν, μετά` express different
  relations; choose from the intended logic, not a memorized translation.
- Comparison commonly uses `πιο` and `από`, while frequent synthetic forms are
  lexical data.
- `εσύ/εσείς`, titles, greetings, requests, particles, and intonation work
  together as an address/register bundle.
- Topic and contrast affect explicit pronouns, word order, and clitic doubling.
- A regional or colloquial form should be recognized with its profile label,
  not silently mixed into a neutral-standard production answer.

### Prerequisites

Core Categories 3–5. Profile-comparison tasks require mastery of the default
production baseline.

### Category boundaries

This category owns relationships across clauses/turns and pragmatic
appropriateness. It does not grade open stylistic quality or cultural
interpretation. Reading/listening evidence is integrated in Category 7.

### Common misconceptions

- Choosing connectors from one interface-language gloss without checking the
  logical relation.
- Switching aspect randomly between background, habit, and foreground events.
- Treating every explicit subject pronoun as neutral.
- Mixing singular-familiar and plural/polite address within one interaction.
- Making a request “polite” by changing one word while leaving the address
  bundle inconsistent.
- Calling a reviewed regional or spoken form incorrect because it differs from
  the selected production baseline.

### Family `comparison_degree`

**Task/purpose.** Construct and interpret equality, comparative, and superlative
relations with reviewed analytic and lexical forms.
**Response/template.** Form choice, ordering, or relation matching.
**Derivation.** ordered entities/property, degree, comparison standard.
**Difficulty.** L1 `πιο`; L2 `από/όσο`; L3 superlative/article; L4 synthetic
common forms and ambiguity. **Distractors.** Stack incompatible markers.
**Validation.** Numeric/order relation oracle.

### Family `connector_relation`

**Task/purpose.** Choose a connector that realizes addition, contrast, cause,
result, alternative, or concession.
**Response/template.** Single-choice or clause pairing.
**Derivation.** logical/discourse relation and register.
**Difficulty.** L1 addition/contrast; L2 cause/result; L3 concession; L4
multiple plausible but only one entailed relation.
**Distractors.** Same translation but reversed cause/result.
**Validation.** Relation graph.

### Family `temporal_sequence`

**Task/purpose.** Order events and choose temporal expressions/aspect consistent
with before, after, overlap, habit, and interruption.
**Response/template.** Timeline ordering, connector/form choice, or completion.
**Derivation.** event intervals and viewpoint.
**Difficulty.** L2 explicit adverbs; L3 background/foreground; L4 reference-time
shift. **Distractors.** surface sentence order equals event order.
**Validation.** Interval/event oracle.

### Family `cause_purpose_condition`

**Task/purpose.** Distinguish cause, purpose, and condition and select the
licensed connector/particle/aspect pattern.
**Response/template.** Relation choice, clause completion, or matching.
**Derivation.** causal/world/intention graph and subject relation.
**Difficulty.** L2 clear cause; L3 purpose with `να`; L4 condition/hypothesis.
**Distractors.** one “for” or “because” calque.
**Validation.** Logical relation and clause grammar.

### Family `discourse_aspect_tracking`

**Task/purpose.** Maintain or deliberately shift imperfective/perfective
viewpoint through a short narrative or routine.
**Response/template.** Multiple form choices, timeline, or anomaly selection.
**Derivation.** authored event graph, foreground/background, repetition.
**Difficulty.** L3 two events; L4 three-to-five event chain.
**Distractors.** one tense for entire paragraph, duration heuristic.
**Validation.** Event discourse model.

### Family `reference_chain`

**Task/purpose.** Resolve or construct chains of noun phrases, strong/weak
pronouns, and omitted subjects across sentences.
**Response/template.** Referent selection, linking, or controlled rewrite.
**Derivation.** discourse entities, salience, gender/number, roles.
**Difficulty.** L2 one stable referent; L3 switch; L4 same-feature competitors.
**Distractors.** nearest noun always antecedent.
**Validation.** Reference graph and uniqueness.

### Family `address_register_bundle`

**Task/purpose.** Maintain coherent familiar singular versus polite/plural
address across pronouns, verbs, titles, greetings, and requests.
**Response/template.** bundle selection, dialogue repair, or rewrite.
**Derivation.** interlocutor relation, number, setting, register profile.
**Difficulty.** L1 clear familiar/plural; L2 polite unknown adult; L3 mixed
social cues; L4 authored register shift. **Distractors.** change only pronoun.
**Validation.** Turn-level feature consistency.

### Family `polite_request_strategy`

**Task/purpose.** Match commands, `να`/question frames, modal wording, and
address to a declared social situation.
**Response/template.** appropriateness choice or constrained transformation.
**Derivation.** request burden, relation, urgency, register.
**Difficulty.** L2 routine service request; L3 softened request; L4 contrast
with urgent direct instruction. **Distractors.** grammatical but mismatched
register. **Validation.** Authored pragmatic scale.

### Family `formal_informal_rewrite`

**Task/purpose.** Rewrite a bounded message between declared neutral-formal and
familiar-spoken profiles while preserving facts.
**Response/template.** ordered chunks, multiple-choice rewrite, or named fields.
**Derivation.** message semantics plus paired reviewed realizations.
**Difficulty.** L2 address; L3 greeting/request/closing bundle; L4 lexical and
syntactic profile. **Constraints.** No open style scoring.
**Validation.** Meaning identity and register annotations.

### Family `spoken_written_profile`

**Task/purpose.** Recognize reviewed familiar-spoken reductions or discourse
forms and select an appropriate standard written realization when requested.
**Response/template.** matching, classification, or controlled rewrite.
**Derivation.** paired authored/audio profile variants.
**Difficulty.** L2 common colloquial item; L3 connected phrase; L4 regional
profile. **Distractors.** label speech corrupt or accept it in formal spelling
task without qualification. **Validation.** Profile registry/human review.

### Family `regional_variant_comprehension`

**Task/purpose.** Understand a reviewed lexical, pronunciation, or grammatical
variant while retaining the selected production baseline.
**Response/template.** meaning match, profile classification, or baseline
equivalent. **Derivation.** paired standard/profile entries.
**Difficulty.** L3 explicit label and transcript; L4 audio/context comparison.
**Constraints.** No flag-only labels, caricature, or unreviewed generation.
**Validation.** Specialist review and provenance.

### Family `controlled_message_construction`

**Task/purpose.** Compose a short message from required facts, relationship,
time, and register using constrained slots/chunks.
**Response/template.** structured fields or ordered clauses.
**Derivation.** communicative intent, fact graph, register, construction set.
**Difficulty.** L2 one request/fact; L3 reason/time; L4 reference/aspect across
three clauses. **Validation.** Required-fact entailment and forbidden-claim
checks.

### Family `grammar_pragmatics_audit`

**Task/purpose.** Find one connector, aspect, reference, address, register, or
profile inconsistency in connected language.
**Response/template.** span selection, fault type, and repair.
**Derivation.** Mutate one discourse dependency.
**Difficulty.** L3 two clauses; L4 multi-turn/profile-sensitive.
**Distractors.** Valid regional/register alternatives outside the mutation.
**Validation.** One root fault and preserved facts after repair.

### Cross-family progression

Start with explicit connector and comparison relations. Add event sequencing
and reference chains, then requests/address. Treat register and regional
variation as labeled comprehension after the standard core, never as random
distractor spellings. Connected production stays structured enough for exact
semantic checking.

## 7. Category: Reading, listening, and interaction

### Category purpose

Integrate the preceding systems in short, evidence-based communicative tasks
while keeping answers objectively checkable and all offline media accessible.

### Learn-card content

- First identify genre, speaker/writer, addressee, and purpose.
- Use case endings, verb endings, particles, clitics, stress, punctuation, and
  connectors as evidence rather than translating every word.
- Separate facts stated by the text from reasonable but unsupported guesses.
- In audio, replay for gist, then key details; normal connected speech is not a
  sequence of isolated dictionary words.
- Speaking rehearsal can support memory and rhythm, but local playback is not
  an automatic pronunciation grade.

### Prerequisites

Selected families from Categories 2–6 according to each item's feature manifest.

### Category boundaries

Texts and recordings must use only reviewed vocabulary/constructions plus a
declared small inferable set. This category checks comprehension, constrained
production, and interaction—not open literary analysis, essay quality, or
accent authenticity.

### Common misconceptions

- Translating each token before using context.
- Ignoring endings and relying only on familiar lemmas.
- Treating a plausible inference as explicitly stated.
- Inferring question/attitude from punctuation alone when audio supplies
  contrary evidence.
- Assuming normal-rate audio contains every citation-form segment clearly.
- Believing local recording and playback produce an objective score.

### Family `sentence_segmentation_parse`

**Task/purpose.** Segment a sentence into phrase/clause chunks and identify
predicate, participants, modifiers, and connector.
**Response/template.** Boundary placement, matching, or dependency selection.
**Derivation.** Generator source parse.
**Difficulty.** L1 article+noun/verb; L2 clitic; L3 subordinate/relative; L4
marked order. **Distractors.** chunk by spaces or word length.
**Validation.** Source tree.

### Family `inflected_word_recovery`

**Task/purpose.** Recover a known lemma/sense from an inflected form in context.
**Response/template.** lemma match, feature fields, or gloss choice.
**Derivation.** surface token, paradigm, sentence semantics.
**Difficulty.** L1 transparent noun; L2 stress/stem change; L3 verb principal
stem; L4 homograph resolved by syntax. **Distractors.** visual substring only.
**Validation.** Morphological analysis with unique contextual answer.

### Family `short_reading_comprehension`

**Task/purpose.** Retrieve stated facts and simple licensed inferences from a
purpose-written 1–5-sentence text.
**Response/template.** Choice, matching, ordering, or short exact answer.
**Derivation.** Text fact/event/reference graph.
**Difficulty.** L1 one fact; L2 two facts; L3 pronoun/time inference; L4
negative/contrastive evidence. **Distractors.** contradicted, unsupported, role
reversal. **Validation.** Entailment annotations.

### Family `notice_message`

**Task/purpose.** Interpret a sign, chat, email, announcement, invitation, or
service message. **Response/template.** purpose/detail/action choice.
**Derivation.** genre template, audience, time/location/action facts.
**Difficulty.** L1 one instruction; L2 date/time; L3 condition/change; L4
register/inference. **Constraints.** Fictional, non-live, non-high-stakes.
**Validation.** Required facts and genre review.

### Family `instruction_schedule`

**Task/purpose.** Follow ordered instructions, a timetable, simple route, or
recipe-like sequence. **Response/template.** ordered steps, selected outcome, or
structured time/location. **Derivation.** exact sequence/graph.
**Difficulty.** L1 two steps; L2 time/number; L3 condition/branch; L4
cross-reference. **Distractors.** swap steps, overlook negation.
**Validation.** Independent sequence/route oracle.

### Family `dialogue_completion`

**Task/purpose.** Choose or construct the next turn that satisfies intent,
reference, answer type, and register.
**Response/template.** single-choice, ordered chunks, or bounded completion.
**Derivation.** dialogue state, speech act, facts, address profile.
**Difficulty.** L1 greeting/Q&A; L2 request; L3 repair/refusal/reason; L4
implicature limited to authored contrast. **Validation.** State transition.

### Family `reference_resolution`

**Task/purpose.** Resolve omitted subjects, pronouns, clitics, and possessives
in a short text/dialogue. **Response/template.** entity linking or matching.
**Derivation.** explicit discourse graph.
**Difficulty.** L2 gender cue; L3 same-gender competitors; L4 event-role and
topic shift. **Distractors.** nearest compatible noun.
**Validation.** Unique antecedent under supplied context.

### Family `listening_sound_form`

**Task/purpose.** Match a recording to its word/phrase form or a controlled
sound–spelling contrast. **Response/template.** audio/text matching.
**Derivation.** licensed recordings and transcripts.
**Difficulty.** L1 one word; L2 stress/digraph contrast; L3 inflected form; L4
normal-rate phrase/profile. **Constraints.** Avoid fabricated minimal pairs and
recording artifacts as cues. **Validation.** Human audio review.

### Family `listening_dictation`

**Task/purpose.** Transcribe a reviewed phrase/sentence when meaning supplies
enough evidence for spelling and morphology.
**Response/template.** text or segmented named fields.
**Derivation.** recording, transcript, context, accepted orthographic variants.
**Difficulty.** L1 word; L2 slow phrase; L3 normal sentence; L4 clitics/
homophones resolved by context. **Validation.** Audio/transcript alignment.

### Family `listening_comprehension`

**Task/purpose.** Extract gist, stated detail, sequence, speaker relation, or
simple inference from a short recording.
**Response/template.** choice, matching, ordering, or exact field.
**Derivation.** audio script fact/dialogue graph.
**Difficulty.** L1 one speaker/fact; L2 two details; L3 reference/aspect; L4
normal-rate multi-turn/profile. **Distractors.** mentioned but wrong role/time,
unsupported. **Validation.** Script evidence spans and human review.

### Family `guided_speaking_shadowing`

**Task/purpose.** Rehearse and optionally record a reviewed utterance with
attention to stress, chunking, and communicative intent.
**Response/template.** listen–repeat–self-compare checklist; no automatic score.
**Derivation.** licensed model audio, transcript, stress/chunk annotations.
**Difficulty.** L1 word; L2 phrase; L3 sentence; L4 short role turn.
**Constraints.** Local-only recording, explicit deletion, visual/text route.
**Validation.** Asset/manual review, not learner audio judgment.

### Family `bounded_mediation`

**Task/purpose.** Relay selected facts from a simple table, schedule, or
interface-language note in controlled Greek without open translation.
**Response/template.** named fields, clause choices, or ordered chunks.
**Derivation.** fact graph and licensed Greek realization set.
**Difficulty.** L2 one fact; L3 time/reason; L4 two audiences/register.
**Distractors.** omit required fact, add unsupported claim.
**Validation.** Bidirectional fact entailment.

### Family `profile_comprehension`

**Task/purpose.** Understand paired standard/regional or careful/colloquial
recordings/texts and identify shared meaning plus declared profile difference.
**Response/template.** meaning match and feature classification.
**Derivation.** reviewed paired items with speaker/profile metadata.
**Difficulty.** L3 transcript supplied; L4 audio-first familiar feature.
**Constraints.** No accent guessing from an unknown speaker.
**Validation.** Specialist/profile review.

### Family `connected_language_audit`

**Task/purpose.** Find one contradiction, unsupported interpretation,
reference/time mismatch, malformed form, or register inconsistency using
text/audio evidence.
**Response/template.** evidence span plus correction/classification.
**Derivation.** One logged mutation to a valid source item.
**Difficulty.** L2 single sentence; L3 text/dialogue; L4 cross-modal evidence.
**Validation.** Exactly one root fault; evidence uniquely decisive.

### Cross-family progression

Begin with parsing and word recovery, then one-fact texts/audio. Add message
genres, sequences, dialogues, and reference. Dictation follows sound–spelling
mastery. Mediation and profile comparison are later. Keep receptive vocabulary
slightly ahead of productive vocabulary and record the distinction.

## 8. Cross-category progression and release slices

Levels describe exercise complexity, not certification:

- **Foundation / L1:** alphabet/case pairs, final sigma, basic vowel/consonant
  anchors, tonos recognition, core noun gender/article, simple present forms,
  omitted subject, statements/questions, and one-fact reading/listening.
- **Elementary / L2:** digraph environments, spelling/stress production,
  singular/plural and nominative/accusative/genitive, adjective agreement,
  prepositions/contractions, imperfect/aorist form, basic aspect contrast, one
  object clitic, `δεν/μην`, practical messages, and dictation.
- **Independent-building / L3:** less regular paradigms, vocatives/quantifiers,
  future/`να` aspect, non-active forms, imperatives, perfects, clitic clusters
  and host changes, relatives, word order, connectors, address/register,
  connected reading/listening, and mediation.
- **Early-intermediate / L4:** interacting aspect/voice/reference, conditions,
  discourse aspect, doubling/information structure, controlled formal
  relatives, spoken/written and cross-profile comprehension, and audits.
- **L5 challenge:** denser mixing and reduced scaffolding inside reviewed
  early-B1 grammar; no silent move to advanced literary Greek or free writing.

Recommended delivery:

1. **Release A — script, noun phrase, present:** Category 2 core; gender,
   articles, number, basic cases/agreement; active present; subject omission,
   simple questions/negation; parsing and short audio.
2. **Release B — events and practical pronouns:** stress/inflection, genitive/
   prepositions, imperfect/aorist and basic aspect, one weak object, notices,
   schedules, and dictation.
3. **Release C — connected Modern Greek:** future/`να`/imperative/non-active,
   clitic clusters/hosts, relatives, connectors, reference, register, dialogue,
   listening, and constrained messages.
4. **Release D — early-B1 integration:** perfect/hypothetical/passive, discourse
   aspect/order, variation, mediation, profile comprehension, and audits.

Unlock by family dependencies. Script recognition, orthographic production,
reading, listening, speaking rehearsal, and profile comprehension have separate
evidence. Audio and microphone functionality remains optional where
inaccessible.

## 9. Adaptive practice guidance

Track:

- family, can-do statement, level, scaffold, modality, response, latency,
  confidence, and misconception;
- lexeme/sense, frequency/domain, known status, collocation, register/profile;
- character/grapheme, keyboard support, syllable, stress, final sigma, vowel/
  consonant sequence, audio item, speaker, and profile;
- noun gender, declension cell, number, case source, article/determination,
  adjective/controller, preposition, contraction, quantifier, and possessor;
- verb sense/class, imperfective/perfective/non-active stems, person/number,
  tense, aspect, particle, voice/event mapping, polarity, and timeline;
- pronoun role/form/referent, cluster slot, host, doubling, negation scope,
  question/relative gap, constituent order, topic/focus;
- connector/relation, event sequence, address/register, genre, evidence span,
  and regional/profile difference.

Routing examples:

- Correct letter sound but Latin-lookalike keyboard error → contrast the two
  scripts visually before adding vocabulary.
- Correct syllable but missing tonos → keep the word and target stress
  production; do not mark its meaning unknown.
- Correct noun but wrong article → retrieve gender with the noun before adding
  case.
- Correct gender but wrong article case → hold lexeme constant and contrast
  semantic roles/order.
- Agreement copied from nearest noun → display the controller arc before adding
  another modifier.
- `σε` relation correct but contraction wrong → enumerate the article feature
  bundle, not new prepositions.
- Regularized perfective/aorist stem → retrieve principal forms with the same
  verb in several constructions.
- Past choice based on duration → contrast two viewpoints over the same
  duration/event.
- `να` verb copied in matrix person → show two subject nodes and vary only the
  embedded subject.
- Correct weak pronoun but wrong role → restore the full direct/indirect noun
  phrases before trying a cluster.
- Correct cluster in a finite clause but wrong after imperative → target host
  placement only.
- Overt subject added everywhere → contrast neutral continuation and
  contrastive correction.
- Profile-valid form outside active production profile → acknowledge validity,
  then restate the requested target.

Track recognized, scaffold-produced, and meaning-produced mastery separately.
Space lexical gender, stress, principal stems, and irregular cells. After two
successes, vary one controlled dimension. A confident misconception triggers a
minimal contrast, explanation, and delayed transfer. Slow correctness does not
justify unrelated vocabulary difficulty.

## 10. Feedback and explanation requirements

Reveal:

1. **Intention/profile:** meaning, time, relationship, speech act, register,
   medium, and active Modern Greek profile.
2. **Semantic frame:** predicate, participant roles, referents, events,
   relations, worlds, and discourse link.
3. **Features:** gender, number, case and its source; person, tense, aspect,
   voice, modality, and polarity.
4. **Realization:** article/contraction, noun/adjective form and stress; verb
   principal stem, augment, ending, particle; pronoun form/slot/host.
5. **Structure:** agreement controller, negation scope, question/relative gap,
   order, topic/focus, and reference chain.
6. **Mismatch/alternatives:** first decisive error and whether another form is
   equivalent, profile-different, contextually different, non-target, or wrong.

Useful visuals:

- Greek/Latin lookalike contrast and keyboard map;
- grapheme–sound and audio–transcript alignment;
- syllable boxes with stress and diaeresis;
- noun-phrase feature matrix and agreement/controller arcs;
- role→case graph and `σε + article` expansion;
- imperfective/perfective event timelines using the same real-world event;
- principal-stem family and particle/aspect matrix;
- active/non-active event-role diagram;
- weak-pronoun referents, ordered slots, and host;
- negation scope and relative antecedent→gap;
- topic/focus ordering and discourse-reference graph;
- timed transcript evidence and profile comparison.

An interface-language gloss is support, not a full explanation. Invalidate any
item lacking enough context for gender, case, determination, aspect, particle,
voice meaning, pronoun reference, order/focus, register, or profile.

## 11. Audio and content requirements

- Bundle all audio; no runtime TTS, speech-recognition, dictionary, corpus, or
  pronunciation service.
- Prefer licensed human recordings from multiple reviewed Standard Modern Greek
  speakers, with regional metadata used neutrally.
- Separate normal and pedagogically slower takes; do not create slow audio by
  distorting pitch, stress, voicing, or rhythm.
- Normalize loudness and silence while preserving stress, consonant sequences,
  vowel adjacency, clitic grouping, and natural phrase rhythm.
- Store transcript, token/time alignment where needed, speaker/voice, broad
  profile, rate, target features, license/provenance, and review status.
- Sound contrasts must be genuine and recorded under matched conditions; no
  distractor may be identifiable from noise, loudness, or speaker alone.
- Provide replay, visible state, keyboard controls, transcript when it does not
  defeat the task, and a non-audio route where hearing is not the skill.
- Microphone use is optional and local-only: no upload, retention by default,
  accent detection, or automatic pronunciation/comprehensibility score.
- Purpose-write texts/dialogues. External content requires compatible license
  and attribution.
- Use varied names, locations, households, occupations, and situations without
  stereotypes or requiring cultural trivia.

## 12. Rendering, interaction, and accessibility

- Use UTF-8 and fonts verified for Greek uppercase/lowercase, tonos, diaeresis,
  combined diacritics, final sigma, and Greek punctuation.
- Normalize to NFC internally while retaining the raw response for diagnostic
  feedback about combining characters.
- Offer an optional Greek character strip and keyboard-layout guide; track use
  separately from unaided spelling.
- Never replace Greek glyphs with visually similar Latin characters.
- Ensure tonos and diaeresis remain legible at all supported sizes and under
  high contrast.
- Paradigms use semantic HTML tables; case and person labels are localized.
- Agreement arcs, timelines, role graphs, clitic slots, and profile diagrams
  have equivalent text/table descriptions.
- Ordering tasks have keyboard/button alternatives and large touch targets.
- Audio controls expose label, state, replay count, rate variant, and transcript;
  do not autoplay.
- Color, audio, animation, timing, or fine pointer motion is never the sole cue.
- Speaking tasks work as listen/read rehearsal when microphone permission is
  absent.
- Long Greek words, clitic groups, and tables wrap without splitting a
  character/diacritic sequence.
- Screen readers announce correctness and the target form before detailed
  explanation; raw feature IDs remain hidden.
- Respect reduced motion and do not use disappearing timers.
- Variety labels use text, not flags alone.

## 13. Generator and offline implementation guidance

Useful module boundary:

```text
seededRng
reviewedGreekLexiconRegistry
varietyProfileRegistry
unicodeGreekNormalizer
alphabetKeyboardRegistry
orthographyEditorialPolicy
syllableStressEngine
pronunciationGraphemeRegistry
semanticFrameGenerator
determinationArticleEngine
caseAssignmentEngine
nominalParadigmRealizer
agreementResolver
prepositionContractionRegistry
numberDateTimeGrammar
verbPrincipalStemRegistry
verbParadigmRealizer
eventAspectWorldModel
particleAspectGrammar
voiceEventMapper
cliticSequenceAutomaton
cliticHostResolver
negationScopeEngine
questionRelativeGrammar
informationStructureLinearizer
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
- semantic frame, roles, referents, facts, events, intervals/worlds, speech act;
- lexeme/sense IDs and complete morphosyntactic feature bundles;
- case source, determination, agreement controllers, preposition/contraction;
- verb principal stems, paradigm cells, aspect/particle/voice/event mapping;
- pronoun roles/referents/slots/host, negation, question/relative/order template;
- active profile and canonical/accepted/profile-different realizations;
- orthography, syllable/stress, pronunciation/audio annotations;
- source parse, evidence, normalization, distractor misconception, fault ID.

Generation:

1. choose family, level, profile, and one or more declared difficulty dimensions;
2. create a semantic, orthographic, phonological, event, or discourse source;
3. select compatible reviewed lexemes and a licensed construction;
4. assign reference, roles/case, agreement, time/aspect/voice, clitics, register;
5. realize nominal and verbal morphology from stored paradigms/stems;
6. linearize constituents/clitics and apply orthography/stress/punctuation;
7. select compatible audio where required;
8. back-parse and verify identity against the source;
9. derive the answer/explanation by an independent path;
10. create misconception-based distractors or one typed audit mutation;
11. reject ambiguity, collisions, unnaturalness, profile mismatch, excess new
    vocabulary, or insufficient evidence.

No backend or runtime network is assumed. Ship reviewed and versioned data,
audio, and authored templates inside the standalone HTML/JS/CSS artifact or
adjacent bundled assets. Do not embed a general translator, morphological
analyzer, or speech recognizer. Choice/order tasks compare IDs. Free text parses
only the documented controlled grammar and compares typed features and accepted
realizations; edit distance is diagnostic only.

## 14. Automated and linguistic validation

### Data-build checks

- Every lexeme has stable ID, sense, part of speech, level/frequency, register/
  profile, provenance, and review status.
- Every noun has gender, shipped number/case forms, stress, and pronunciation.
- Every adjective, determiner, quantifier, and pronoun has every shipped
  agreement/case cell and accepted variant tagged.
- Every verb has every shipped person/number cell, principal imperfective/
  perfective/aorist/non-active forms needed by enabled families, stress,
  argument frames, voice meaning, and imperative/dependent forms.
- Every preposition, connector, particle, clitic, question, relative, order,
  and register construction is typed and reviewed.
- Every regional/spoken variant declares profile, register, scope, baseline
  equivalent where appropriate, and explanation.
- Every audio item has transcript, profile/speaker metadata, license,
  provenance, and human review.

### Instance invariants

- Surface Greek reparses to the source semantics and features.
- Unicode, sigma, tonos, diaeresis, apostrophe, capitalization, and punctuation
  match the declared editorial/profile policy.
- Pronunciation/audio matches lexical form, stress, grapheme environment,
  inflection, and profile.
- Case follows the semantic/constructional role; every article/modifier agrees
  with its controller.
- `σε` contraction and final-`ν` editorial behavior match the article/next
  context.
- Finite verb, principal stem, ending, augment/stress, time, aspect, particle,
  polarity, and voice meaning match the event frame.
- Weak-pronoun role, form, referent, cluster order, and host are licensed.
- Negation scope, question/relative gap, constituent order, information
  structure, address, register, and profile match context.
- Reading/listening answer is entailed; distractors are logged as contradicted,
  unsupported, wrong role/time/reference, or register/profile mismatch.
- Accepted answers do not collide after family-specific normalization.
- Every audit differs from its valid source by exactly one root mutation.

### Test volume and independent oracles

- At least 10,000 seeds per family/level.
- At least 25,000 for Unicode/sigma/stress, sound–spelling, case/agreement,
  article/contraction, principal stems, augment, aspect, particles, voice,
  pronoun clusters/hosts, negation, relatives, order/reference, and audits.
- Exhaustively enumerate the alphabet, shipped nominal/adjectival/pronominal/
  verbal paradigms, definite/indefinite articles, `σε` contractions, licensed
  clitic clusters/hosts, and orthographic profile variants.
- Exhaustively test composed/decomposed input, uppercase/lowercase, tonos/
  diaeresis combinations, final sigma, apostrophes, and punctuation.
- Independently recompute numbers, valid dates, times, prices, sequences, and
  comparison relations.
- The back-parser/validator must not share the generator's answer-key path.
- Snapshot long words, tables, diagrams, character strip, profile labels, and
  audio states on mobile and desktop.
- Manually review all audio and stratified samples across template, lexeme,
  paradigm, aspect, clitic, register, profile, distractor, and fault types.
  Automation cannot certify idiomaticity or pragmatic naturalness.

Discard and log failures; never substitute unreviewed content.

## 15. Coverage and balance requirements

Report by family and level:

- generation/rejection count and distinct semantic/construction frames;
- lemma/sense/domain/frequency/new-word status, collocation, register/profile;
- character/grapheme, syllable/stress, sigma, diacritic, sound sequence,
  speaker/audio/profile;
- noun gender/class/number/case and case source; article/reference,
  adjective/controller, preposition/contraction, quantifier/possessor;
- verb class/principal stem/person, time/aspect/particle, augment/stress, voice/
  event role, polarity, imperative/perfect/hypothetical construction;
- pronoun role/form/referent/cluster/host, doubling, negation scope, question/
  relative gap, order/topic/focus;
- connector/relation, event sequence, address/register, genre, evidence,
  modality, response/scaffold/misconception/confidence/repetition.

Cap easy defaults: nouns whose endings make gender obvious, nominative
singular, masculine examples, definite articles, canonical subject-first order,
first-conjugation present, first/third-person singular, transparent `-σ-`
perfectives, one-clitic clauses, one speaker/profile, and literal one-clause
translations. Balance frequency, gender, number, case, person, aspect, role,
modality, register, communicative value, and learner need. Do not balance rare
forms to the frequency of core forms merely for symmetry.

## 16. Content and implementation checklist

- [ ] Contemporary Standard Modern Greek, roughly Foundation–early B1; no
      certification claim.
- [ ] Ancient, Koine, productive Katharevousa, and polytonic Greek excluded.
- [ ] Common-standard production and regional/colloquial reception profiles
      explicit and versioned.
- [ ] Greek Unicode, final sigma, tonos, diaeresis, and punctuation reliable.
- [ ] Romanization is a tracked scaffold, not a Greek-script substitute.
- [ ] Lexemes, senses, paradigms, constructions, variants, and audio reviewed
      with provenance/license.
- [ ] Gender, case forms, stress, verb stems, voice meaning, valency, and
      profile stored rather than guessed.
- [ ] Case derives from semantic/construction role, not word position.
- [ ] Agreement has an explicit controller.
- [ ] Aspect uses viewpoint/event models, not duration or tense-name shortcuts.
- [ ] `θα/να/ας` take licensed finite forms; no invented infinitive engine.
- [ ] Active/non-active morphology remains separate from semantic voice.
- [ ] Weak pronouns retain role, referent, order slot, and host.
- [ ] Questions, negation, relatives, order, and register derive from context.
- [ ] No unrestricted translation, essay, conversation, or fuzzy grading.
- [ ] Audio is local, licensed, human-reviewed, and profile-tagged.
- [ ] Local recording produces no bogus pronunciation or accent score.
- [ ] Reading/listening answers retain exact evidence.
- [ ] Distractors encode misconceptions; audits mutate one root dependency.
- [ ] Seeds reproduce prompt, profile, answer, variants, audio, and explanation.
- [ ] Accessibility covers Greek input, diacritics, sound alternatives,
      ordering, diagrams, tables, audio, and local recording.
- [ ] Standalone HTML/JS/CSS operation; no backend or runtime network.

## 17. Stable IDs and recommended navigation

Use:

```text
greek-language/<category-id>/<family-id>/<schema-version>
```

Persist the seed, data/generator/profile versions, lexeme/sense IDs, semantic
frame, full feature bundle, case/agreement controllers, event/aspect/particle/
voice state, pronoun/reference/host structure, answer policy, audio ID, and
fault ID. Increment schema/data versions whenever a keyed prompt, answer,
accepted variant, or explanation can change.

Recommended learner navigation:

1. **Greek Script & Sound**
2. **Words, Cases & Agreement**
3. **Verbs, Aspect & Time**
4. **Pronouns & Sentence Structure**
5. **Connected Greek**
6. **Reading, Listening & Interaction**

Filters may expose level, family, modality, input mode, keyboard/romanization
scaffold, primary/receptive profile, register, vocabulary domain, and error
review. Internal linguistic engine terms remain developer-only.
