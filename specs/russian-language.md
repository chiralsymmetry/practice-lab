# Russian Language — Dynamic Practice Specification

Status: implementation specification

Audience: exercise generator, Russian linguistic-content editor, morphology and
syntax engine, semantic answer checker, text/audio renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual normative meanings.

## 1. Topic overview

### Topic name

Russian Language

### Topic goal

Develop beginner-to-lower-intermediate communicative Russian by repeatedly
connecting Cyrillic script, sound, stress, vocabulary, morphology, syntax,
reading, listening, controlled writing, and guided speaking. The learner should
become able to:

- read and type the 33-letter contemporary Russian Cyrillic alphabet, including
  `ё`, `й`, `ь`, and `ъ`, without confusing visually similar Latin letters;
- recognize common printed and handwritten/cursive letterforms without being
  required to produce machine-graded handwriting;
- connect spelling to lexical stress, consonant hardness/softness, voicing,
  vowel reduction, and reviewed standard pronunciation;
- retrieve nouns with gender, animacy, plural and oblique forms, and use the six
  core cases from semantic roles, government, and prepositions;
- make adjectives, determiners, pronouns, ordinals, and past-tense verbs agree
  with their controllers where Russian requires it;
- select common preposition–case frames for location, destination, source,
  time, accompaniment, instrument, topic, possession, and experiencer meaning;
- conjugate frequent imperfective and perfective verbs, build past and future
  forms, and choose aspect from viewpoint and discourse rather than English
  tense labels;
- use reflexive `-ся/-сь` verbs according to their lexical and constructional
  meanings instead of treating every such form as a simple passive;
- distinguish unidirectional/determinate and multidirectional/indeterminate
  motion verbs, travel on foot versus by transport, and a controlled set of
  prefixed path meanings;
- construct present nominal clauses, possession/existence, impersonal
  experiencer/modal expressions, questions, negation, relatives, comparison,
  requests, and short connected discourse;
- use neutral and contextually marked word order while preserving case roles
  and intended topic/focus;
- understand short reviewed texts and recordings, exchange routine
  information, and rehearse useful utterances;
- recognize explicitly reviewed regional, colloquial, and register variants
  without silently mixing them into one production target.

The endpoint is practical form–meaning control in contemporary Standard
Russian. Grammar labels support explanation; reciting case names, aspect
prefixes, or paradigms is not the primary objective.

### Audience and level boundary

The app starts before Cyrillic mastery and extends through practical A1, A2,
and selected early-B1 objectives. These labels guide complexity; the app does
not certify CEFR or TORFL/ТРКИ proficiency and is not a mock examination.

- **Foundation:** alphabet, keyboard, stress and sound anchors, fixed
  expressions, noun gender, core nominative phrases, and present-tense
  utterances.
- **A1-oriented:** people and places, routines and needs, high-frequency cases,
  present/past/future reference, numbers/time/prices, questions and negation,
  and short interaction.
- **A2-oriented:** the productive six-case core, adjective/pronoun agreement,
  aspect contrasts, basic motion verbs, commands, conditions, practical
  messages, and connected descriptions.
- **Early-B1-oriented:** interacting aspect and motion prefixes, government,
  reflexive/impersonal constructions, relatives, information structure,
  register, inference, mediation, and cross-profile comprehension.

The Pushkin State Russian Language Institute's [Russian-as-a-foreign-language
level mapping](https://pushkininstitute.ru/learn) relates elementary, basic, and
first certification levels to A1, A2, and B1. The Council of Europe [CEFR
Companion Volume](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions)
informs reception, production, interaction, mediation, and phonological
competence. These frameworks bound the app; they do not turn it into a
certificate-preparation product.

### Reference and language-data boundary

Reference anchors include:

- the Russian National Corpus description of its [modern Standard Russian
  written-text collection](https://ruscorpora.ru/en/corpus/main);
- its separate [accentological and spoken-corpus
  resources](https://ruscorpora.ru/en/page/corpora-structure/) for researching
  stress and actual usage;
- Gramota's current guidance on [stress notation in learner
  materials](https://gramota.ru/biblioteka/spravochniki/pravila-russkoy-orfografii-i-punktuatsii/znak-udareniya);
- its guidance that `ё` is used consistently in [texts for foreign-language
  learners](https://gramota.ru/biblioteka/spravochniki/pravila-russkoy-orfografii-i-punktuatsii/upotreblenie-bukvy-e-v-tekstakh-raznogo-naznacheniya);
- its academic [Russian Orthographic
  Dictionary](https://gramota.ru/biblioteka/slovari/russkij-orfograficheskij-slovar/udarenie-proiznoshenie)
  for spelling, stress, and pronunciation metadata.

Reference sites and corpora are not content to copy wholesale. Bundled lexicons,
paradigms, recordings, frequency lists, or examples require compatible
licensing, provenance, versioning, and Russian-language review. Corpus
attestation alone does not establish a form's learner level, sense, government,
aspect pair, stress, register, region, or idiomaticity.

### Standard-variety and usage policy

Use contemporary Standard Russian as the default production baseline. Reviewed
regional standards, Russian outside the Russian Federation, familiar-spoken
forms, and pronunciation variants may appear receptively with neutral labels.

```text
VarietyProfile {
  id
  geographicScope
  productionBaseline
  orthographyPolicy
  yoPolicy
  stressDisplayPolicy
  pronunciationTargets[]
  lexicalPreferences[]
  grammaticalVariants[]
  numberDateTimeConventions
  addressRegisterConventions[]
  acceptedAlternatives[]
}
```

- Production prompts declare a profile whenever it changes the target.
- Geographic origin, citizenship, ethnicity, and linguistic profile are not
  interchangeable metadata.
- Regional or diaspora usage is labeled by scope, not “corrected” toward a
  Moscow stereotype.
- Neutral, formal, informal, colloquial, and learner-directed orthography are
  independent profile dimensions.
- A learner may select a primary production profile and separate receptive
  profiles.
- Familiar-spoken reductions may be accepted for comprehension while a formal
  writing prompt requests its declared standard.
- Accent imitation, accent classification, and unreviewed dialect generation
  are outside scope.

Every realization is classified as:

1. **canonical target** — selected form for this profile and context;
2. **accepted variant** — standard and meaning/register-compatible here;
3. **profile-different** — standard or established in another reviewed profile;
4. **contextually different** — grammatical but changes aspect, direction,
   reference, focus, politeness, or implication;
5. **non-target/nonstandard** — outside the requested production norm;
6. **incorrect** — incompatible spelling, morphology, government, syntax, or
   meaning.

Feedback must preserve those distinctions. A regional form is not “bad
Russian,” and a contextually different aspect is not necessarily malformed.

### Scope

Included:

- the contemporary 33-letter Cyrillic alphabet, learner stress marks, `ё`
  policy, capitalization, punctuation, word boundaries, and common print/
  handwriting recognition;
- common Standard Russian sound–spelling patterns: hard/soft consonants,
  iotated vowels, signs, final/dependent voicing, vowel reduction, clusters,
  and lexical/mobile stress;
- adult everyday vocabulary and collocations through selected early B1;
- masculine, feminine, and neuter gender; singular/plural; nominative,
  genitive, dative, accusative, instrumental, and prepositional case;
- animacy-sensitive accusative forms, common indeclinables, and reviewed
  irregular noun/adjective/pronoun paradigms;
- adjectives, demonstratives, possessives, personal/reflexive pronouns,
  quantifiers, cardinals, ordinals, and a controlled numeral-government subset;
- frequent imperfective/perfective, reflexive, and irregular verbs; infinitive,
  present, past, compound/simple future, imperative, conditional, and selected
  passive/participial recognition;
- unprefixed and common prefixed motion verbs within a bounded event grammar;
- present nominal predication, existence/possession, modal/experiencer
  impersonals, questions, negation, relatives, comparison, coordination,
  subordination, reference, and information-sensitive order;
- numbers, dates, time, money, measures, addresses, and telephone numbers;
- short reading/listening, constrained writing, dialogue, mediation, and guided
  local speaking rehearsal;
- receptive exposure to reviewed regional and colloquial forms.

Expected prior knowledge:

- none at Foundation;
- ability to read the interface language;
- grammar terminology is introduced through examples before being required;
- later families assume only the dependencies declared in progression notes.

### Exclusions

- Old East Slavic, Church Slavonic as a productive system, pre-reform
  orthography, and historical Cyrillic letters;
- unrestricted translation, essays, free conversation, and fuzzy semantic
  similarity grading;
- exhaustive dialectology, slang generation, profanity drills, accent
  classification, or accent “correction”;
- automatic pronunciation scoring, speaker identification, and claims that a
  local recording measures comprehensibility;
- exhaustive participle/gerund production, rare short adjectives, advanced
  verbal adverbs, and bookish case government;
- productive use of remnant second genitive/partitive, second prepositional/
  locative, or new vocative beyond explicitly reviewed fixed forms;
- deriving an aspect pair by mechanically adding or removing a prefix;
- exhaustive motion-verb prefix/polysemy coverage or figurative motion without
  lexical review;
- historical/literary syntax, dense classical literature, and archaic forms as
  unmarked modern production targets;
- open literary interpretation, political/cultural trivia, humor, irony, and
  culturally dense implicature;
- isolated vocabulary flashcards without morphology, collocation, sound, or
  communicative context;
- specialist or high-stakes medical, legal, immigration, military, and
  emergency content;
- live prices, transport, law, news, or political information.

### Orthography, pronunciation, and input conventions

- Internal strings are UTF-8 and Unicode NFC. Combining acute U+0301 may mark
  stress in pedagogical displays and answers.
- The alphabet is `А а, Б б, В в, Г г, Д д, Е е, Ё ё, Ж ж, З з, И и, Й й,
  К к, Л л, М м, Н н, О о, П п, Р р, С с, Т т, У у, Ф ф, Х х, Ц ц, Ч ч,
  Ш ш, Щ щ, Ъ ъ, Ы ы, Ь ь, Э э, Ю ю, Я я`.
- `ё` is a distinct letter. Learner-directed canonical text uses it
  consistently. At later receptive levels, an explicit ordinary-print profile
  may show `е` in place of `ё`; the lexical form and pronunciation still retain
  the distinction.
- Pedagogical stress marks are metadata overlays, not ordinary word spelling.
  They are shown consistently at early levels and may be reduced by known-word
  status. `ё` itself identifies a stressed syllable in ordinary core forms.
- Stress is lexical and may move across a paradigm. The generator stores stress
  per form; it does not infer it from a suffix or rely on unstressed ordinary
  print to recover it.
- `ь` and `ъ` have no independent vowel sound. Their functions are taught
  through the adjacent consonant/vowel structure and lexical form.
- Hardness/softness, vowel reduction, voicing/devoicing, cluster
  simplification, and `-ого/-его` pronunciation are pronunciation properties,
  not reasons to respell a word phonetically.
- Print and common handwritten/cursive variants are separate visual assets.
  Handwriting recognition is bounded to human-reviewed glyph/word images; free
  handwriting is not machine scored.
- Romanization may scaffold early keyboard discovery. It is accepted only when
  the prompt names a transliteration scheme or explicitly enables an
  accessibility scaffold; ad hoc “translit” is not a unique orthography.
- IPA is optional and never assumed.

### Lexical and grammatical data model

```text
Lexeme {
  id
  lemma
  partOfSpeech
  senses[]
  gender?
  animacy?
  countability?
  declensionClass?
  principalNominalForms[]
  adjectiveClass?
  shortForms[]
  comparisonForms[]
  verbConjugationClass?
  aspect?
  aspectPartnerBySense[]
  principalVerbForms[]
  reflexiveBehavior?
  motionClass?
  motionPair?
  motionPrefixFrames[]
  paradigmForms[]
  stressIndexByForm[]
  pronunciations[]
  argumentFrames[]
  governmentFrames[]
  prepositionFrames[]
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
  governmentLinks[]
  agreementLinks[]
  tenseAspectMoodProfile
  motionEventProfile?
  wordOrderOptions[]
  informationStructure
  negationScope?
  registerProfile
  varietyScope[]
  acceptedRealizations[]
}
```

Gender, animacy, plural/genitive stem, stress movement, adjective short-form
availability, aspect partner, prefix meaning, reflexive sense, motion class,
government, pronunciation, register, and profile are stored lexical/
construction data. Do not infer them from a final letter or an
interface-language gloss.

### Case, agreement, aspect, motion, and order policy

- The generator creates a semantic frame first: participants, reference,
  possession/existence, location/path, time, quantity, viewpoint, polarity,
  discourse status, and speech act.
- Semantic roles, lexical government, numeral rules, and prepositions assign
  case. Word position does not assign case.
- Accusative syncretism depends on gender, number, animacy, and paradigm. The
  app must not teach “accusative equals genitive” without those conditions.
- Articles are absent from the grammar; the semantic distinction between
  definite and indefinite reference remains present in context and word order.
  Do not invent a hidden one-to-one article translation.
- Adjectives and adjective-like words realize their controller's gender,
  number, case, and animacy where relevant.
- Aspect pairs are sense-specific lexical relationships. A prefix may create a
  new lexical meaning, a perfective partner, both, or neither in a given use.
- Imperfective/perfective selection uses event viewpoint, repetition,
  process/result, sequencing, negation, phase, and discourse. It is not “long
  versus short” or “unfinished versus finished” in isolation.
- A perfective nonpast form ordinarily has future reference in the core
  constructions; present ongoing meaning uses an imperfective form.
- Motion generation distinguishes path/direction, one occasion versus habitual/
  multidirectional movement, means of transport, source/destination, and
  boundary crossing before selecting a verb/prefix/preposition.
- Neutral order and licensed marked orders are generated from roles and
  information structure. A surface order that is grammatical but changes topic,
  focus, contrast, or naturalness is contextually different.

### Global answer conventions

- Ignore surrounding whitespace and normalize Unicode to NFC.
- Preserve Cyrillic/Latin script identity; visually similar characters are not
  interchangeable.
- Learner-canonical spelling preserves `ё`. A family may accept `е` for `ё`
  only under its declared ordinary-print or lenient input policy, and such
  acceptance does not earn `ё` spelling mastery.
- Pedagogical acute stress marks are ignored when stress is not assessed. When
  stress is assessed, compare the normalized vowel index, not raw combining-mark
  byte order.
- Case and punctuation may be ignored only when declared incidental.
- Romanized answers are rejected unless explicitly requested or enabled as a
  tracked scaffold.
- Choice and ordering responses compare stable IDs, not visible labels.
- Text responses are checked by the promised controlled grammar and accepted
  realization set. Edit distance and embedding similarity cannot establish
  grammatical or semantic equivalence.
- Multiple forms use labeled fields; learners do not guess separators or form
  order.
- Numbers may accept declared locale-appropriate grouping and decimal
  separators when notation is not being tested.
- A grammatical answer that changes aspect, motion direction, animacy
  interpretation, reference, focus, politeness, or register is “contextually
  different,” not equivalent.
- Audio-dependent prompts offer replay and a non-audio route unless hearing
  discrimination is the target.

### Difficulty philosophy

Difficulty should increase through independently controlled dimensions:

- less transliteration, fewer stress marks, less segmented audio, and more
  handwritten/cursive recognition;
- lower-frequency but useful reviewed vocabulary;
- mobile stress, greater reduction, consonant clusters, and less transparent
  sound–spelling;
- more genders, animacy contrasts, cases, government links, and greater
  agreement distance;
- less regular paradigms, stem alternations, and zero/fleeting vowels;
- aspect contrasts over the same event and interactions with negation,
  repetition, result, phase, and sequence;
- more motion dimensions: direction, trip structure, transport, boundary,
  source, route, and destination;
- more referents, clauses, information-structure constraints, and register
  cues;
- productive rather than receptive response and reduced answer structure;
- cross-register/profile comprehension after one standard baseline is secure.

Do not manufacture difficulty with obscure literary vocabulary, tiny Cyrillic,
poor audio, unannounced `ё`/stress policy changes, ambiguous translation,
arbitrary timers, unbounded typing, political trivia, or distractors that need
missing context.

## 2. Category: Cyrillic, sound, stress, and spelling

### Category purpose

Build automatic bidirectional links among Cyrillic characters, keyboard
positions, print/cursive glyphs, graphemes, syllables, lexical stress, spelling,
punctuation, and reviewed audio.

### Learn-card content

- Russian uses 33 Cyrillic letters. Some look like Latin letters but have
  different values: `В, Н, Р, С, У, Х` are important traps.
- `ё` is a letter and is stressed; ordinary texts often print `е`, while this
  app shows `ё` consistently during learning.
- `ь` and `ъ` do not have their own vowel sound. They affect how adjacent
  consonants and iotated vowels are interpreted.
- Consonants commonly contrast as hard/soft pairs. `е, ё, и, ю, я` and `ь`
  often signal softness, subject to lexical and spelling rules.
- Unstressed vowels are reduced in speech. Spell the lexical/morphological form,
  not a phonetic transcription.
- Stress may move: learn it with every form. Early prompts show an acute mark;
  ordinary Russian usually does not.

### Prerequisites

None. Audio families require usable audio output or a text/visual alternative.

### Category boundaries

This category teaches recognition, pronunciation, and spelling. Choices that
arise from noun/verb inflection belong to Categories 3–5 even when they change
stress or spelling; those categories call this category's renderer.

### Common misconceptions

- Reading Cyrillic lookalikes as Latin letters.
- Treating `ё` as a decorative `е` or pronouncing both identically in every
  lexical form.
- Giving `ь/ъ` an independent vowel sound.
- Assuming every consonant letter has one fixed hard/soft value.
- Spelling reduced unstressed vowels as heard.
- Keeping stress on the same syllable in every inflected form.
- Treating cursive variants as different letters.
- Believing one informal romanization uniquely specifies Russian spelling.

### Family `alphabet_letter_identity`

**Task/purpose.** Recognize and produce Russian uppercase/lowercase letters and
their names. **Response/template.** Character selection, matching, keyboard
input, or reviewed audio-to-letter. **Derivation.** Fixed 33-letter inventory.
**Difficulty.** L1 distinctive letters; L2 `ё/й/ь/ъ`; L3 mixed case/audio; L4
short spelling sequences. **Distractors.** Latin glyph substitutions.
**Validation.** Exhaustive inventory/font snapshots.

### Family `latin_cyrillic_lookalike`

**Task/purpose.** Distinguish Cyrillic letters from visually similar Latin
characters and retrieve their actual Russian values.
**Response/template.** Script classification, sound/name choice, or error
repair. **Derivation.** curated lookalike set and font variants.
**Difficulty.** L1 one glyph; L2 short pseudoword; L3 mixed-script fault; L4
domain strings. **Distractors.** visual shape mapped to Latin value.
**Validation.** Code-point identity and multi-font review.

### Family `uppercase_lowercase_pair`

**Task/purpose.** Convert characters and reviewed words between ordinary
uppercase/lowercase forms. **Response/template.** Matching or short text.
**Derivation.** Unicode-aware case mapping plus `ё`.
**Difficulty.** L1 single letters; L2 `Й/Ё`; L3 names; L4 all-caps text.
**Distractors.** Latin case mapping, omit diacritic.
**Validation.** Exhaustive round-trip.

### Family `print_cursive_recognition`

**Task/purpose.** Match human-reviewed printed, italic, and common handwritten/
cursive glyph or word images to Cyrillic text.
**Response/template.** Image/text matching or character sequence.
**Derivation.** licensed glyph/word assets with transcript.
**Difficulty.** L1 isolated distinctive glyphs; L2 `т/м/д/г` style contrasts;
L3 connected word; L4 short note.
**Constraints.** No synthetic illegibility or handwriting production score.
**Validation.** Human paleographic/typographic review.

### Family `keyboard_layout_transliteration`

**Task/purpose.** Locate Cyrillic keys and perform bounded conversion under an
explicit transliteration scheme. **Response/template.** Key matching or short
text. **Derivation.** declared keyboard layout/scheme and unique reviewed set.
**Difficulty.** L1 letters; L2 `ж/х/ц/щ`; L3 `ё/ь/ъ`; L4 ambiguity resolved by
lexical choices. **Constraints.** No unspecified ad hoc translit.
**Validation.** Declared mapping only.

### Family `yo_e_policy`

**Task/purpose.** Restore, preserve, or interpret `ё` under learner-canonical
and ordinary-print profiles. **Response/template.** Character insertion,
profile classification, or meaning/pronunciation choice.
**Derivation.** lexical `ё` position and display policy.
**Difficulty.** L1 familiar words; L2 inflected forms; L3 `все/всё`-type
ambiguity; L4 ordinary text recovery from context.
**Distractors.** Every `е` may be `ё`, omission changes nothing.
**Validation.** Lexicon and profile registry.

### Family `soft_hard_sign_function`

**Task/purpose.** Interpret and spell reviewed uses of `ь/ъ` at consonant/vowel
boundaries. **Response/template.** sign choice, sound structure, or word
completion. **Derivation.** lexical/morphemic form and adjacent segments.
**Difficulty.** L1 soft-sign final forms; L2 separator `ь`; L3 prefix+`ъ`; L4
morphological contrast. **Distractors.** pronounce sign as vowel, signs
interchangeable. **Validation.** Lexicon/morpheme/audio registry.

### Family `iotated_vowel_structure`

**Task/purpose.** Interpret `е, ё, ю, я` as vowel plus preceding softness or
as a /j/+vowel sequence in licensed environments.
**Response/template.** sound-structure choice, boundary highlighting, or audio
match. **Derivation.** word-initial/vowel/sign/consonant environment.
**Difficulty.** L1 initial; L2 after consonant; L3 after sign/vowel; L4 mixed
inflection. **Distractors.** one fixed two-sound value everywhere.
**Validation.** Environment and lexical pronunciation.

### Family `consonant_hard_soft`

**Task/purpose.** Distinguish reviewed hard/soft consonants and identify the
orthographic cue or lexical exception.
**Response/template.** Audio/text match, pair classification, or spelling
choice. **Derivation.** consonant, following grapheme, lexeme, stress/profile.
**Difficulty.** L1 clear pairs; L2 word-final `ь`; L3 inherently unpaired/
spelling-rule contexts; L4 clusters.
**Distractors.** vowel letter alone always predicts surface.
**Validation.** Pronunciation registry and human audio.

### Family `consonant_voicing_environment`

**Task/purpose.** Recognize final devoicing and common regressive voicing/
devoicing without respelling the word phonetically.
**Response/template.** audio/spelling match, underlying-letter choice, or
environment classification. **Derivation.** lexical consonants, following
segment, word boundary/profile.
**Difficulty.** L2 word-final; L3 cluster; L4 reviewed phrase boundary.
**Distractors.** write only what is heard, voice every adjacent pair.
**Validation.** phonological/audio oracle.

### Family `unstressed_vowel_reduction`

**Task/purpose.** Match stressed/unstressed vowel spellings to reviewed
pronunciation and retain lexical spelling.
**Response/template.** Audio-word match, stress choice, or contextual spelling.
**Derivation.** vowel letter, stress distance, consonant context, profile.
**Difficulty.** L1 stressed versus first pretonic `о/а`; L2 other positions;
L3 `е/я` reduction; L4 connected speech.
**Distractors.** phonetic spelling, all unstressed vowels identical.
**Validation.** Stress/pronunciation registry.

### Family `lexical_stress`

**Task/purpose.** Place or identify stress in a known lexical form.
**Response/template.** Vowel/syllable selection, acute insertion, or audio
match. **Derivation.** stored stress index.
**Difficulty.** L1 two syllables; L2 longer word; L3 contrastive homographs;
L4 less familiar reviewed item with semantic cue.
**Distractors.** fixed penultimate stress, interface-language cognate stress.
**Validation.** Accentological lexicon.

### Family `mobile_stress_inflection`

**Task/purpose.** preserve or move stress across reviewed noun, adjective, or
verb paradigm forms. **Response/template.** Form completion or paradigm match.
**Derivation.** stress index per shipped cell.
**Difficulty.** L2 one movement pair; L3 plural/case/past; L4 mixed paradigm.
**Distractors.** keep stress on stem/ending universally.
**Validation.** Exhaustive shipped paradigms.

### Family `syllable_segmentation`

**Task/purpose.** Segment reviewed words into syllables and locate the stressed
one. **Response/template.** Boundary placement or ordered chunks.
**Derivation.** authored phonological syllabification and stress.
**Difficulty.** L1 CV patterns; L2 signs/iotation; L3 clusters; L4 inflected
forms. **Distractors.** one syllable per written vowel without sign/context
checks. **Validation.** syllable registry.

### Family `spelling_rule_environment`

**Task/purpose.** Apply a bounded set of high-value spelling constraints after
`г, к, х, ж, ч, ш, щ, ц` in known morphemes/forms.
**Response/template.** Letter/ending choice or error repair.
**Derivation.** consonant class, morpheme, stress, inflectional cell.
**Difficulty.** L2 one rule group; L3 ending choice; L4 rule+lexical exception.
**Constraints.** Teach form-producing constraints, not decontextualized slogans.
**Validation.** Morphological spelling oracle.

### Family `word_boundary_preposition`

**Task/purpose.** Segment short strings and preserve separate prepositions,
particles, and `не` where the taught construction requires them.
**Response/template.** Boundary insertion or error repair.
**Derivation.** source parse and orthographic policy.
**Difficulty.** L1 preposition+noun; L2 `не`+verb; L3 particle/compound
contrast; L4 connected text. **Distractors.** phonological grouping equals one
written word. **Validation.** Tokenization from source tree.

### Family `audio_spelling_dictation`

**Task/purpose.** Write a reviewed word or short phrase from audio plus enough
context to determine lexical spelling.
**Response/template.** Short text or named fields.
**Derivation.** licensed recording, transcript, stress, lexical/semantic cue.
**Difficulty.** L1 stressed familiar word; L2 reduced vowel/final consonant; L3
inflection; L4 normal-rate phrase.
**Constraints.** Reject underdetermined audio-only spellings.
**Validation.** Transcript/audio/manual review.

### Family `script_sound_audit`

**Task/purpose.** Find one script, `ё`, sign, stress, hardness, voicing,
reduction, boundary, or spelling mismatch.
**Response/template.** Span selection plus correction.
**Derivation.** Inject exactly one typed fault into a valid item.
**Difficulty.** L2 one word; L3 phrase; L4 audio/text evidence.
**Distractors.** Ordinary-print and pronunciation variants declared valid.
**Validation.** One root mutation; correction restores source.

### Cross-family progression

Teach true Cyrillic identity before speed. Add print/cursive variants only after
the base letter is known. Teach hardness, iotation, signs, stress, and reduction
as a connected system; then add dictation. Preserve `ё` and stress support long
enough for morphology, and fade each aid independently by known form.

## 3. Category: Vocabulary, noun phrases, cases, and agreement

### Category purpose

Train useful lexical retrieval inside noun phrases and control gender, number,
animacy, six-case forms, government, adjective/pronoun agreement, possession,
spatial relations, numerals, dates, times, and quantities.

### Learn-card content

- Learn nouns with gender, plural, stress, and a useful oblique form:
  `стол — столы́`, `кни́га — кни́ги`, `мо́ре — моря́`.
- The six core cases are nominative, genitive, dative, accusative,
  instrumental, and prepositional. A case form answers a role or government
  requirement, not merely a memorized question word.
- Animacy changes the accusative pattern for masculine singular and all plural
  noun phrases: compare reviewed contrasts such as objects versus people.
- Adjectives and adjective-like words agree in gender, number, case, and
  relevant animacy.
- Prepositions may require different cases and meanings: `в шко́ле` is
  location; `в шко́лу` is destination.
- Numerals govern noun forms: `оди́н стол`, `два стола́`, `пять столо́в`.
- Russian has no articles. Context and information structure still distinguish
  known/specific and new/non-specific reference.

### Prerequisites

Category 2 Cyrillic and stress recognition. Later case families assume gender,
number, and basic role recognition.

### Category boundaries

This category owns nominal morphology, prepositional phrases, and quantities.
Verb aspect and motion selection belong to Category 4. Reflexive/personal
pronoun discourse and clause order are integrated in Category 5.

### Common misconceptions

- Guessing gender reliably from meaning or an interface-language equivalent.
- Treating any final `-а` as feminine without lexical exceptions.
- Assigning case by word order alone.
- Memorizing one translation for each case or preposition.
- Forgetting animacy when noun and adjective accusatives are syncretic.
- Changing the noun ending but leaving adjective/pronoun in citation form.
- Treating `в/на +` one case as both location and destination.
- Adding an article-like word whenever the interface language has an article.
- Using nominative after every numeral or one plural form after all numbers.

### Family `contextual_lexeme_choice`

**Task/purpose.** Choose a reviewed word for a pictured or sentential meaning.
**Response/template.** Single-choice, matching, or bounded completion.
**Derivation.** Semantic frame, sense, domain, register.
**Difficulty.** L1 concrete contrast; L2 related senses; L3 collocational
constraint; L4 register/profile. **Distractors.** Same broad topic but wrong
sense or selection. **Validation.** Sense annotations and entailment.

### Family `collocation_phrase_choice`

**Task/purpose.** Retrieve common word combinations with their case/
preposition pattern rather than translate word by word.
**Response/template.** Completion, ordered chunks, or matching.
**Derivation.** Reviewed collocation frame with inflectable slots.
**Difficulty.** L1 fixed expression; L2 variable noun; L3 government; L4
register. **Distractors.** Literal calques and wrong-but-common case.
**Validation.** Authored collocation registry.

### Family `noun_gender`

**Task/purpose.** Retrieve masculine, feminine, or neuter gender for a known
noun and use it in agreement.
**Response/template.** Gender choice, pronoun/adjective match, or paired form.
**Derivation.** Lexical gender.
**Difficulty.** L1 transparent endings; L2 soft-sign nouns; L3 indeclinables/
exceptions; L4 semantic/grammatical conflict.
**Distractors.** meaning or suffix alone.
**Validation.** Lexicon, balanced genders.

### Family `noun_number_form`

**Task/purpose.** Produce/recognize singular and plural noun forms with stress.
**Response/template.** Transformation, matching, or short text.
**Derivation.** Stored paradigm cell.
**Difficulty.** L1 regular endings; L2 spelling rule/stress movement; L3 stem
change/fleeting vowel; L4 singularia/pluralia tantum.
**Distractors.** one universal plural ending.
**Validation.** Exhaustive shipped noun cells.

### Family `noun_declension_pattern`

**Task/purpose.** Associate a noun with principal forms sufficient to retrieve
its case paradigm. **Response/template.** Pattern matching or missing cell.
**Derivation.** Reviewed declension class and principal nominal forms.
**Difficulty.** L2 one class; L3 same ending/different gender; L4 irregular/
indeclinable contrast. **Constraints.** Class labels never override lexical
data. **Validation.** Paradigm registry.

### Family `nominative_predicative_role`

**Task/purpose.** Use nominative for a clear subject, naming, or present nominal
predicate construction.
**Response/template.** Case/form choice or clause completion.
**Derivation.** predication and event-role frame.
**Difficulty.** L1 naming; L2 subject/predicate noun; L3 reversed order; L4
contrast with instrumental in licensed non-present predicates.
**Distractors.** first noun only, interface-language copula case.
**Validation.** Role/predication graph.

### Family `accusative_direct_object`

**Task/purpose.** Select accusative for a direct object under a reviewed verb.
**Response/template.** Form input, case label, or sentence completion.
**Derivation.** verb valency, patient/theme, animacy features.
**Difficulty.** L1 feminine `-у/-ю`; L2 masculine inanimate; L3 animate/plural;
L4 reversed order. **Distractors.** subject-first heuristic, nominative
syncretism generalized. **Validation.** Role and paradigm.

### Family `accusative_animacy`

**Task/purpose.** Apply animacy-conditioned accusative syncretism to nouns and
modifiers. **Response/template.** Form choice, matching, or contrast repair.
**Derivation.** gender, number, animacy, case, full paradigm.
**Difficulty.** L2 masculine singular; L3 all plurals; L4 coordination/
borderline items only if reviewed.
**Distractors.** accusative always nominative or always genitive.
**Validation.** Feature-unification oracle; Gramota-style paradigm rule.

### Family `genitive_possession_source`

**Task/purpose.** Form and interpret genitives for possession/relation, source,
and selected prepositions.
**Response/template.** Phrase completion, role matching, or transformation.
**Derivation.** relation/source frame and paradigm.
**Difficulty.** L1 singular possession; L2 `из/от/у`; L3 plural/stress; L4
ambiguous relation resolved by context.
**Distractors.** English apostrophe order, accusative source.
**Validation.** Relation graph.

### Family `genitive_quantity_absence`

**Task/purpose.** Use genitive in controlled quantity, number, and absence
constructions. **Response/template.** Form choice or structured phrase.
**Derivation.** quantity/existence polarity, numeral class, noun features.
**Difficulty.** L1 `нет`; L2 `много/мало`; L3 numeral pattern; L4 plural
genitive difficulty. **Constraints.** Genitive under verbal negation is a
separate family. **Validation.** Quantity/existence model.

### Family `dative_recipient_experiencer`

**Task/purpose.** Use dative for recipients and reviewed experiencer/age/modal
constructions. **Response/template.** Form input, role match, or completion.
**Derivation.** transfer/experience frame and person/entity features.
**Difficulty.** L1 recipient pronoun; L2 noun; L3 age/state; L4 competing
participants/order. **Distractors.** accusative recipient, nominative
experiencer. **Validation.** Event/experience graph.

### Family `instrumental_means_companion`

**Task/purpose.** Use instrumental for means, accompaniment after `с`, and
reviewed roles.
**Response/template.** Case/form choice or phrase completion.
**Derivation.** instrument/comitative frame and preposition.
**Difficulty.** L2 singular; L3 plural/stress; L4 `с` comitative versus
genitive source/position meanings. **Distractors.** one case for every `с`.
**Validation.** Relation and preposition frame.

### Family `instrumental_predicative`

**Task/purpose.** Interpret and form a bounded set of instrumental complements
after `быть/стать/работать` and similar reviewed predicates.
**Response/template.** Case choice or sentence completion.
**Derivation.** time, predicate sense, role/status frame.
**Difficulty.** L3 past/future profession; L4 nominative/instrumental nuance in
authored contrasts. **Constraints.** Do not claim one universal copular rule.
**Validation.** Predicate-specific government.

### Family `prepositional_location_topic`

**Task/purpose.** Use prepositional case after reviewed `в/на/о` frames for
static location and topic.
**Response/template.** Form/preposition choice or phrase completion.
**Derivation.** location/topic relation and lexical place profile.
**Difficulty.** L1 `в` location; L2 `на`; L3 `о/об`; L4 stress/exception.
**Distractors.** destination accusative, choose `в/на` from translation alone.
**Validation.** Relation/preposition registry.

### Family `spatial_case_contrast`

**Task/purpose.** Contrast location, destination, and source through
`в/на + prepositional/accusative` and `из/с + genitive`.
**Response/template.** Route diagram, phrase choice, or completion.
**Derivation.** path topology, place lexical profile, boundary/source.
**Difficulty.** L1 location/destination; L2 source pair; L3 several stops; L4
figurative only if reviewed.
**Distractors.** one preposition for a place in all directions.
**Validation.** Spatial graph and inverse-pair registry.

### Family `preposition_case_government`

**Task/purpose.** Select case for a common preposition and interpret
prepositions with multiple case-dependent meanings.
**Response/template.** Case/form choice, matching, or repair.
**Derivation.** semantic relation and reviewed government frame.
**Difficulty.** L1 one-case prepositions; L2 common spatial contrasts; L3
`с/за/под` meaning contrast; L4 multiword phrase.
**Distractors.** memorize one gloss without case.
**Validation.** Typed preposition registry.

### Family `adjective_full_agreement`

**Task/purpose.** Inflect a full adjective for its noun's gender, number, case,
and relevant animacy.
**Response/template.** Form input, matching, or agreement repair.
**Derivation.** controller bundle and adjective class.
**Difficulty.** L1 nominative; L2 oblique singular; L3 plural/animate
accusative; L4 multiple modifiers/stress.
**Distractors.** citation form or nearest noun.
**Validation.** Agreement links and exhaustive paradigms.

### Family `adjective_short_form`

**Task/purpose.** Recognize and produce a reviewed subset of short predicative
adjectives and distinguish their licensed meaning/register from full forms.
**Response/template.** Form choice or predicate completion.
**Derivation.** adjective availability, subject gender/number, construction.
**Difficulty.** L3 common state/evaluation; L4 full/short semantic contrast.
**Constraints.** Every lexeme/construction reviewed; no full productivity claim.
**Validation.** Short-form registry.

### Family `possessive_demonstrative_agreement`

**Task/purpose.** Select and inflect common possessive/demonstrative words with
the possessed/referred noun.
**Response/template.** Form choice or noun-phrase construction.
**Derivation.** possessor/reference, controller gender/number/case/animacy.
**Difficulty.** L1 `мой/этот`; L2 oblique; L3 plural/animate; L4 contrasting
referents. **Distractors.** agree with possessor instead of noun.
**Validation.** Reference and agreement graph.

### Family `personal_pronoun_case`

**Task/purpose.** Select strong personal-pronoun forms from person, number,
gender where relevant, case, and prepositional environment.
**Response/template.** Form input or referent-role matching.
**Derivation.** participant features and role/government.
**Difficulty.** L1 nominative/accusative; L2 dative/genitive; L3 instrumental/
prepositional with `н-`; L4 competing referents.
**Distractors.** regular noun ending, omit prepositional `н`.
**Validation.** Exhaustive pronoun paradigms.

### Family `indeclinable_noun_agreement`

**Task/purpose.** Keep reviewed indeclinable nouns invariant while inflecting
their agreeing modifiers correctly.
**Response/template.** Form choice or error repair.
**Derivation.** lexical indeclinability, gender/number interpretation, case
role. **Difficulty.** L2 familiar loanword; L3 gender uncertainty resolved by
lexicon; L4 proper name/abbreviation.
**Distractors.** invent noun ending or leave adjective uninflected.
**Validation.** Lexical agreement profile.

### Family `plural_genitive_form`

**Task/purpose.** Retrieve high-value plural genitive forms used after numbers,
quantities, absence, and relations.
**Response/template.** Missing form, matching, or phrase completion.
**Derivation.** stored paradigm and stress.
**Difficulty.** L2 regular ending; L3 zero/fleeting vowel/stem; L4 irregular.
**Distractors.** one `-ов` ending for all genders/classes.
**Validation.** Exhaustive shipped forms.

### Family `numeral_noun_government`

**Task/purpose.** Choose noun/adjective forms after `один`, `два/три/четыре`,
`пять+`, and compound cardinals in nominative/accusative core contexts.
**Response/template.** Multiple named fields or phrase choice.
**Derivation.** exact integer, governing final component with the `11–14`
exception, case, animacy, and gender.
**Difficulty.** L1 1–5; L2 11–20/compounds; L3 adjective+noun and animacy; L4
selected oblique forms.
**Constraints.** Bound oblique numeral inflection to reviewed high-value set.
**Validation.** Independent arithmetic/government oracle.

### Family `ordinal_date_time_price`

**Task/purpose.** Interpret and produce ordinals, dates, clock time, ages,
prices, and common measures with required case/agreement.
**Response/template.** Numeric input, named fields, or short phrase.
**Derivation.** exact numeric/calendar object and construction grammar.
**Difficulty.** L1 clock/price; L2 date/age; L3 ordinal case; L4 mixed itinerary/
receipt. **Constraints.** Valid dates and fictional prices only.
**Validation.** Independent calendar/arithmetic oracle.

### Family `noun_phrase_construction`

**Task/purpose.** Build a complete noun phrase from meaning and feature cards.
**Response/template.** Ordered chunks or multiple named fields.
**Derivation.** reference, gender, number, animacy, case source, modifiers,
quantity. **Difficulty.** L1 noun; L2 adjective/pronoun; L3 preposition/numeral;
L4 multiple links. **Distractors.** locally valid incompatible forms.
**Validation.** Feature unification and back-parse.

### Family `nominal_case_audit`

**Task/purpose.** Locate one gender, number, animacy, case, stress, government,
numeral, or agreement error.
**Response/template.** Fault selection and repair.
**Derivation.** Mutate one dependency in a valid phrase/sentence.
**Difficulty.** L2 local ending; L3 syncretism/distant controller; L4 plausible
wrong preposition/government. **Validation.** One root fault; repair restores
source.

### Cross-family progression

Teach gender and plural with lexical stress, then nominative and transparent
accusative roles. Add genitive possession/absence, prepositional location,
accusative destination, dative recipient, and instrumental means in
communicative frames. Introduce animacy before dense adjective phrases and
numbers. Cases remain role/government decisions, never six disconnected ending
tables.

## 4. Category: Verbs, aspect, time, reflexives, and motion

### Category purpose

Train retrieval of verb paradigms and selection of person, time, aspect,
reflexive/voice construction, government, and motion-event structure that
realize an intended event.

### Learn-card content

- Learn a verb with sense-specific principal forms and its aspect partner where
  one is taught: `чита́ть — прочита́ть`.
- Imperfective presents a process, habit, repetition, or internal view;
  perfective presents a bounded whole/result in a licensed context. A prefix
  may also change lexical meaning.
- Imperfective verbs form compound future with `быть + infinitive`; perfective
  nonpast forms usually have future reference.
- Past tense agrees in gender/number and does not mark person:
  `он чита́л`, `она́ чита́ла`, `они́ чита́ли`.
- Reflexive `-ся/-сь` has several meanings—reflexive, reciprocal, passive-like,
  middle, impersonal, or lexical—so learn it with the construction.
- `идти́/ходи́ть` and `е́хать/е́здить` distinguish trip structure/direction and
  travel mode; prefixes add path and boundary meanings.

### Prerequisites

Category 2 stress/spelling; Category 3 subject features, core cases, and spatial
prepositions.

### Category boundaries

This category owns verb morphology, aspect, reflexive sense, valency, and motion
events. Pronoun reference, negation scope, questions, and clause order belong to
Category 5. Discourse-wide aspect belongs to Category 6.

### Common misconceptions

- Forming aspect pairs by adding one “perfective prefix” mechanically.
- Treating imperfective as unfinished/long and perfective as finished/short.
- Using a perfective form for an ongoing present event.
- Forming every future with `буду +` any infinitive.
- Conjugating past forms for person instead of gender/number.
- Treating `-ся` as “self” or passive in every verb.
- Choosing a motion verb only from the English verb “go.”
- Treating `идти/ходить` as present/past rather than directional contrast.
- Adding a motion prefix without updating path prepositions and cases.

### Family `verb_principal_form_set`

**Task/purpose.** Associate a verb sense with infinitive, present/nonpast stem,
past form, stress, and taught aspect partner.
**Response/template.** Matching, missing form, or set selection.
**Derivation.** Sense-specific principal-form registry.
**Difficulty.** L1 regular imperfective; L2 stem alternation; L3 irregular/
aspect pair; L4 polysemy.
**Distractors.** productive-looking unattested forms.
**Validation.** Lexical registry.

### Family `present_imperfective_form`

**Task/purpose.** Conjugate common imperfective verbs for person/number in
present contexts.
**Response/template.** Form input or sentence completion.
**Derivation.** conjugation class, stem alternation, ending, stress.
**Difficulty.** L1 first conjugation; L2 second; L3 alternation/stress; L4
coordinated/implicit subject.
**Distractors.** infinitive stem plus one universal ending.
**Validation.** Exhaustive shipped cells.

### Family `conjugation_stem_alternation`

**Task/purpose.** Retrieve reviewed consonant/vowel alternations and stress
changes across present/nonpast forms.
**Response/template.** Paradigm cell, pattern matching, or error repair.
**Derivation.** stored stem allomorph per person.
**Difficulty.** L2 one alternation; L3 irregular stress; L4 mixed class.
**Constraints.** No blanket prediction from spelling.
**Validation.** Exhaustive paradigm registry.

### Family `high_frequency_irregular_verb`

**Task/purpose.** Retrieve common forms of reviewed verbs such as `быть, есть,
дать, хотеть, мочь`.
**Response/template.** Completion, paradigm cell, or audio form.
**Derivation.** stored paradigm and construction.
**Difficulty.** L1 frequent cells; L2 plural; L3 tense/aspect; L4 government.
**Distractors.** regularized forms.
**Validation.** Exhaustive forms/accepted variants.

### Family `past_gender_number`

**Task/purpose.** Form past-tense verbs agreeing with singular gender or plural
subject rather than person.
**Response/template.** Form choice or sentence completion.
**Derivation.** past stem, subject gender/number, reflexive ending, stress.
**Difficulty.** L1 regular singular; L2 plural; L3 irregular stem/stress; L4
coordinated/unknown-gender context.
**Distractors.** person ending, adjective agreement copied incorrectly.
**Validation.** Subject agreement and paradigm.

### Family `imperfective_compound_future`

**Task/purpose.** Build and interpret `быть + imperfective infinitive` for
future process/habit/repetition.
**Response/template.** Ordered chunks, auxiliary form, or timeline match.
**Derivation.** subject person/number and future viewpoint.
**Difficulty.** L1 `буду`; L2 all persons; L3 negation/adverb; L4 contrast with
perfective simple future.
**Distractors.** conjugate infinitive, use perfective infinitive after `буду`
as core neutral pattern.
**Validation.** Construction grammar.

### Family `perfective_simple_future`

**Task/purpose.** Use a perfective nonpast form for a bounded future event.
**Response/template.** Form input, meaning choice, or completion.
**Derivation.** perfective stem and person/number.
**Difficulty.** L2 regular pair; L3 irregular pair/stress; L4 context with
result/sequence.
**Distractors.** present ongoing interpretation, add `буду`.
**Validation.** Aspect/time event model.

### Family `aspect_pair_retrieval`

**Task/purpose.** Retrieve a sense-compatible imperfective/perfective pair and
reject merely related prefixed verbs.
**Response/template.** Matching or principal-form completion.
**Derivation.** sense-specific aspect-partner links.
**Difficulty.** L2 transparent pair; L3 suffixal/suppletive pair; L4 one lemma
with different partners by sense.
**Distractors.** same root but changed lexical meaning.
**Validation.** Lexical sense graph.

### Family `past_aspect_choice`

**Task/purpose.** Choose imperfective/perfective past from process, repetition,
attempt, fact-of-activity, bounded result, and sequence.
**Response/template.** Verb choice, timeline, or completion.
**Derivation.** event viewpoint and discourse frame.
**Difficulty.** L2 process/result; L3 repeated/bounded; L4 negation/attempt/
sequence. **Distractors.** duration or completion heuristic alone.
**Validation.** Authored event model.

### Family `aspect_context_contrast`

**Task/purpose.** Explain how changing aspect changes the interpretation of the
same lexical event and time frame.
**Response/template.** Meaning match, minimal-pair completion, or feature
selection. **Derivation.** paired event models.
**Difficulty.** L2 one-off/habit; L3 process/result; L4 pragmatic fact/
annulment/sequence contrasts.
**Constraints.** Only human-reviewed contexts with a decisive contrast.
**Validation.** Pairwise entailment review.

### Family `prefix_aspect_lexical_meaning`

**Task/purpose.** Distinguish aspectual pairing from lexical meaning contributed
by common prefixes.
**Response/template.** Pair classification, meaning choice, or word family.
**Derivation.** sense graph and prefix contribution.
**Difficulty.** L2 clear partner; L3 lexicalized prefix; L4 several related
verbs. **Distractors.** any prefix only means “completed.”
**Validation.** Sense-specific registry.

### Family `imperative_form_number`

**Task/purpose.** Produce singular/plural imperatives with the intended verb,
aspect, and politeness.
**Response/template.** Form input or instruction completion.
**Derivation.** imperative principal form, number/address, aspect.
**Difficulty.** L1 regular; L2 plural/polite; L3 irregular/reflexive; L4 aspect
contrast. **Distractors.** infinitive or present form universally.
**Validation.** Shipped imperative forms.

### Family `imperative_aspect`

**Task/purpose.** Choose imperative aspect from one bounded request, ongoing/
repeated activity, invitation, prohibition, and pragmatic context.
**Response/template.** Aspect/form choice or meaning contrast.
**Derivation.** speech act, repetition, urgency, politeness, polarity.
**Difficulty.** L2 clear one-off/routine; L3 negative/invitation; L4 contextual
pragmatic contrast.
**Constraints.** Human-reviewed scenarios; no one-rule shortcut.
**Validation.** Speech-act/aspect annotations.

### Family `conditional_by`

**Task/purpose.** Build and interpret `бы` with a past-form predicate for
hypothetical events, wishes, and softened requests.
**Response/template.** Ordered chunks, form choice, or world matching.
**Derivation.** subject gender/number, possible-world status, speech act.
**Difficulty.** L2 simple hypothetical; L3 condition; L4 polite/wish contrast.
**Distractors.** person-conjugate past, attach `бы` to one fixed slot only.
**Validation.** World and agreement model.

### Family `reflexive_form_allomorph`

**Task/purpose.** Attach `-ся/-сь` to the correct finite/infinitive/past/
imperative form under the editorial phonological rule.
**Response/template.** Form completion or repair.
**Derivation.** verb cell and ending environment.
**Difficulty.** L1 infinitive/present; L2 past; L3 imperative; L4 stress/
irregular form.
**Distractors.** separate pronoun, one suffix everywhere.
**Validation.** Exhaustive shipped reflexive cells.

### Family `reflexive_meaning`

**Task/purpose.** Map a reviewed reflexive verb/construction to reflexive,
reciprocal, middle, passive-like, impersonal, or lexical meaning.
**Response/template.** Meaning choice, role diagram, or verb selection.
**Derivation.** lexeme sense and participant graph.
**Difficulty.** L2 transparent self-action; L3 reciprocal/middle; L4 lexical/
passive-like contrast.
**Distractors.** every `-ся` means “oneself.”
**Validation.** Sense-specific construction registry.

### Family `verb_case_government`

**Task/purpose.** Select the noun/pronoun case or preposition required by a
reviewed verb sense.
**Response/template.** Case/form choice or clause completion.
**Derivation.** sense-specific argument frame.
**Difficulty.** L2 transparent transfer; L3 dative/instrumental/genitive; L4
same verb different sense/frame.
**Distractors.** interface-language preposition/case calque.
**Validation.** Valency registry.

### Family `motion_direction_foot`

**Task/purpose.** Choose `идти/ходить` from one currently directed trip versus
habitual, repeated, multidirectional, or there-and-back movement on foot.
**Response/template.** Verb/form choice, path animation, or timeline.
**Derivation.** motion event with directionality/trip structure.
**Difficulty.** L1 now versus habit; L2 past trip; L3 planned/ability; L4
several journeys.
**Distractors.** tense or speed distinction.
**Validation.** Motion-event oracle.

### Family `motion_direction_transport`

**Task/purpose.** Choose `ехать/ездить` for movement by transport from the same
directionality/trip structure distinctions.
**Response/template.** Verb/form choice or event matching.
**Derivation.** transport mode and motion event.
**Difficulty.** L1 now/habit; L2 past there-and-back; L3 mixed transport; L4
planned route.
**Distractors.** foot verb from generic “go.”
**Validation.** Motion/mode oracle.

### Family `motion_mode_pair`

**Task/purpose.** Select among common unprefixed motion pairs from moving
entity/mode: foot, vehicle, carrying, leading, flying, swimming, or running in a
bounded set.
**Response/template.** Verb-family choice or event classification.
**Derivation.** manner/mode and directionality.
**Difficulty.** L2 foot/vehicle; L3 carry/lead/run; L4 reviewed figurative sense.
**Constraints.** Expand only with reviewed pairs.
**Validation.** Motion lexicon.

### Family `motion_tense_stem`

**Task/purpose.** Produce present/nonpast and irregular past forms of common
motion verbs with stress and agreement.
**Response/template.** Form input or sentence completion.
**Derivation.** motion lexeme paradigm, subject, time.
**Difficulty.** L2 `иду/еду`; L3 `шёл/шла/ехал`; L4 plural/prefix interaction.
**Distractors.** regularized past or swapped pair.
**Validation.** Exhaustive motion paradigms.

### Family `prefixed_motion_path`

**Task/purpose.** Select a reviewed motion prefix from entry, exit, arrival,
departure, approach, movement away, crossing, or brief detour path topology.
**Response/template.** Prefix/verb choice, route diagram, or meaning match.
**Derivation.** boundary/path graph, directionality, mode.
**Difficulty.** L3 one boundary; L4 multiple route landmarks and lexicalized
constraints.
**Distractors.** translation-only prefix or reversed boundary.
**Validation.** Topological path oracle plus lexical registry.

### Family `motion_preposition_case_bundle`

**Task/purpose.** Coordinate prefixed/unprefixed motion with source, route,
destination preposition and case.
**Response/template.** Multiple named fields or ordered chunks.
**Derivation.** motion/path graph and place lexical profile.
**Difficulty.** L2 destination; L3 source+destination; L4 prefix+route.
**Distractors.** correct prefix with inverse preposition/case.
**Validation.** Full path realization/back-parse.

### Family `position_posture_verb`

**Task/purpose.** Select common static/placement verbs such as reviewed
`стоять/лежать/сидеть` and corresponding placement actions.
**Response/template.** Scene-to-verb match or completion.
**Derivation.** object orientation/posture, causation, aspect.
**Difficulty.** L2 person posture; L3 object orientation; L4
put/place/result pair.
**Distractors.** one universal “be/put.”
**Validation.** Scene-state transition.

### Family `phase_modal_infinitive`

**Task/purpose.** Combine reviewed phase/modal predicates with the licensed
aspect and infinitive.
**Response/template.** Verb/aspect choice or ordered chunks.
**Derivation.** ability, desire, necessity, beginning/continuation/ending,
attempt frame.
**Difficulty.** L2 modal+infinitive; L3 phase aspect restriction; L4
negation/attempt.
**Distractors.** freely substitute both aspects after every predicate.
**Validation.** Predicate-aspect government.

### Family `passive_participle_recognition`

**Task/purpose.** Recognize a small set of common passive/participial
constructions and recover event roles without requiring open production.
**Response/template.** Role matching, active paraphrase choice, or form
classification.
**Derivation.** reviewed lexical participle, agreement, agent expression.
**Difficulty.** L3 short common past passive; L4 full modifier versus predicate.
**Constraints.** Receptive, versioned subset only.
**Validation.** Event-role/agreement graph.

### Family `verbal_adverb_recognition`

**Task/purpose.** Interpret a bounded set of common verbal-adverb forms and
enforce same-subject control.
**Response/template.** Subject resolution, clause matching, or error choice.
**Derivation.** reviewed form, event relation, subject-control graph.
**Difficulty.** L3 transparent simultaneous action; L4 prior/action aspect.
**Constraints.** Mostly receptive; reject dangling constructions.
**Validation.** Subject identity and event ordering.

### Family `verb_phrase_construction`

**Task/purpose.** Assemble a complete predicate from time, aspect, person or
past agreement, reflexivity, motion, modality, polarity, and arguments.
**Response/template.** Ordered chunks or named fields.
**Derivation.** typed event and construction grammar.
**Difficulty.** L2 one feature; L3 aspect/government; L4 motion/reflexive/modal
interaction. **Distractors.** locally valid incompatible forms.
**Validation.** Back-parse feature identity.

### Family `verb_aspect_motion_audit`

**Task/purpose.** Locate one stem, stress, agreement, time, aspect, reflexive,
government, motion-direction, prefix, or path error.
**Response/template.** Fault selection and repair.
**Derivation.** One typed mutation in a valid event realization.
**Difficulty.** L2 local form; L3 aspect/motion; L4 full path/discourse context.
**Validation.** Exactly one root fault; repaired event equals source.

### Cross-family progression

Teach present imperfectives and past agreement first. Introduce one
sense-specific aspect pair at a time, then reuse it in past, future, imperative,
and modal frames. Teach `идти/ходить` and `ехать/ездить` with diagrams before
prefixes. Add one path prefix and its preposition/case bundle at a time.
Reflexive and participial forms remain sense/construction driven.

## 5. Category: Pronouns, predication, negation, questions, and sentence structure

### Category purpose

Train reference, present nominal predication, possession/existence, impersonal
experiencers, pronoun choice, negation, question/relative structure, and
information-sensitive word order.

### Learn-card content

- Russian normally expresses a recoverable personal subject in neutral finite
  clauses, though context, coordination, commands, and colloquial speech can
  license omission. Do not copy either English or pro-drop languages blindly.
- Present nominal predicates usually omit a form of `быть`: `Она́ студе́нтка`.
  Past and future use forms such as `была́/бу́дет`.
- Possession often uses `у + genitive + есть`; absence uses `нет + genitive`.
- `себя́` refers back to the subject; possessive `свой` usually points to the
  subject's possession and agrees with the possessed noun.
- `не` negates a constituent/predicate; `ни` participates in licensed negative
  pronouns and strengthening. Russian permits negative concord.
- Case endings preserve roles under varied order, while order and intonation
  signal what is given, new, or contrastive.

### Prerequisites

Category 3 case/agreement and Category 4 finite/past/future forms.

### Category boundaries

This category owns clause-level reference, predication, possession,
impersonals, negation, questions, relatives, and order. Lexical case government
is introduced in Categories 3–4; multi-sentence discourse belongs to Category
6.

### Common misconceptions

- Omitting every subject because verb endings exist, or repeating pronouns in
  every coordinated clause.
- Inserting `есть` as a present copula in every nominal sentence.
- Translating possession with only a nominative possessor plus “have.”
- Using `его/её` where subject-oriented `свой` is required, or vice versa.
- Treating `себя` as a nominative subject.
- Using `не` and `ни` interchangeably or avoiding negative concord.
- Assuming the first noun is always subject despite case marking.
- Making `который` agree in case with the antecedent's matrix-clause role.

### Family `subject_pronoun_expression`

**Task/purpose.** Decide whether a subject pronoun is neutral, contrastive,
recoverable/omissible, or required in an authored context.
**Response/template.** Pronoun/zero choice, focus matching, or rewrite.
**Derivation.** finite agreement, discourse continuity, contrast, coordination,
register.
**Difficulty.** L1 explicit subject; L2 coordination; L3 contrast/switch; L4
colloquial omission.
**Distractors.** universal pro-drop or universal pronoun.
**Validation.** Discourse/reference model.

### Family `reflexive_pronoun_sebya`

**Task/purpose.** Use and resolve case forms of `себя` as a subject-bound
non-nominative pronoun.
**Response/template.** Form choice, antecedent match, or sentence completion.
**Derivation.** subject antecedent, object/preposition role, case.
**Difficulty.** L2 direct object; L3 preposition/competing noun; L4 embedded
clause boundary.
**Distractors.** nominative `себя`, nearest noun antecedent.
**Validation.** Binding and case graph.

### Family `reflexive_possessive_svoy`

**Task/purpose.** Choose and inflect `свой` versus non-reflexive possessives
from possessor identity and possessed noun features.
**Response/template.** Form selection or referent matching.
**Derivation.** clause subject, possessor, noun agreement.
**Difficulty.** L2 same-subject possession; L3 contrastive other possessor; L4
embedded/ambiguous context.
**Distractors.** agree with possessor, use `свой` for any salient person.
**Validation.** Binding/reference/agreement graph.

### Family `present_zero_copula`

**Task/purpose.** Form and interpret present nominal/adjectival/location
predication with the appropriate zero copula or reviewed `есть` use.
**Response/template.** Zero/form choice, ordering, or completion.
**Derivation.** predication type, present time, information structure.
**Difficulty.** L1 identity/profession; L2 adjective/location; L3 contrastive
`есть`; L4 negation.
**Distractors.** insert `есть` as English “is.”
**Validation.** Predication-construction registry.

### Family `past_future_copula`

**Task/purpose.** Use forms of `быть` in past/future predication with subject
agreement and licensed predicate case.
**Response/template.** Form/case choice or sentence construction.
**Derivation.** time, subject gender/number/person, predicate frame.
**Difficulty.** L2 past; L3 future; L4 nominative/instrumental reviewed contrast.
**Distractors.** zero copula outside present, person ending in past.
**Validation.** Time/agreement/government.

### Family `possession_u_est`

**Task/purpose.** Build and interpret `у + genitive + есть` possession/
availability constructions.
**Response/template.** Named fields, transformation, or referent match.
**Derivation.** possessor, possessed entity, discourse presence/focus.
**Difficulty.** L1 personal pronoun; L2 noun possessor; L3 optional `есть`
according to focus; L4 temporal/modal.
**Distractors.** nominative possessor, `есть` mechanically always/never.
**Validation.** Possession/information-structure model.

### Family `absence_net_genitive`

**Task/purpose.** Express absence with `нет` and the required genitive phrase.
**Response/template.** Form choice or transformation.
**Derivation.** absent entity, possessor/location context, time.
**Difficulty.** L1 singular; L2 plural genitive; L3 past/future `не было/не
будет`; L4 quantified absence.
**Distractors.** nominative after `нет`.
**Validation.** Existence/polarity graph.

### Family `impersonal_dative_state`

**Task/purpose.** Use dative experiencers with predicative state words such as
reviewed temperature, emotion, age, and evaluation expressions.
**Response/template.** Case/form choice or scene completion.
**Derivation.** experiencer and state.
**Difficulty.** L1 pronoun; L2 noun; L3 past/future; L4 comparison/negation.
**Distractors.** nominative experiencer plus copied adjective.
**Validation.** Experience-state construction.

### Family `impersonal_modal_infinitive`

**Task/purpose.** Construct and interpret `можно, нельзя, надо, нужно` and
reviewed impersonal modal frames with an optional dative experiencer.
**Response/template.** Modal choice, case, or ordered chunks.
**Derivation.** permission, possibility, prohibition, necessity, actor.
**Difficulty.** L1 permission/prohibition; L2 necessity; L3 past/conditional;
L4 scope.
**Distractors.** personal conjugation or wrong polarity.
**Validation.** Modal logical frame.

### Family `object_pronoun_role_order`

**Task/purpose.** Select case forms and a contextually natural order for direct,
indirect, and prepositional pronouns.
**Response/template.** Named forms, ordering, or referent match.
**Derivation.** event roles, government, givenness/focus.
**Difficulty.** L2 one pronoun; L3 direct+indirect; L4 marked focus.
**Distractors.** interface-language pronoun order or nominative form.
**Validation.** Role/case/information structure.

### Family `ne_constituent_negation`

**Task/purpose.** Place `не` and determine its scope over predicate,
infinitive, adjective, noun, or contrasted constituent.
**Response/template.** Scope brackets, meaning match, or ordering.
**Derivation.** logical form and contrastive context.
**Difficulty.** L1 predicate negation; L2 infinitive/adjective; L3 constituent
contrast; L4 ambiguity resolved by context.
**Distractors.** `не` always negates whole sentence identically.
**Validation.** Scope tree.

### Family `negative_pronoun_concord`

**Task/purpose.** Select forms such as reviewed `никто/ничто/никогда/нигде`
with clause negation and case/preposition separation.
**Response/template.** Form choice, multiple fields, or sentence repair.
**Derivation.** negative quantifier role, case, preposition, clause polarity.
**Difficulty.** L2 nominative; L3 oblique/preposition; L4 multiple negatives.
**Distractors.** omit finite `не`, attach preposition incorrectly.
**Validation.** Negative-concord grammar.

### Family `genitive_accusative_negation`

**Task/purpose.** Interpret and choose only human-reviewed genitive-versus-
accusative object contrasts under negation.
**Response/template.** Case/meaning choice.
**Derivation.** definiteness/specificity, verb, register, quantity, construction.
**Difficulty.** L4 clear lexicalized or strongly cued contrasts only.
**Constraints.** Never teach genitive as automatic after any negated verb.
**Validation.** Authored usage profile and linguistic review.

### Family `yes_no_question_intonation`

**Task/purpose.** Recognize and produce yes/no questions using punctuation,
audio intonation, order, and context.
**Response/template.** Speech-act match, punctuation, or controlled rewrite.
**Derivation.** proposition plus interrogative/focus state.
**Difficulty.** L1 punctuation; L2 audio; L3 focus placement; L4 negative
question context.
**Validation.** Speech-act/prosody annotations.

### Family `li_embedded_question`

**Task/purpose.** Use and interpret `ли` in a bounded set of neutral
yes/no/embedded question structures.
**Response/template.** Placement, clause completion, or meaning match.
**Derivation.** questioned constituent and matrix predicate.
**Difficulty.** L3 direct formal/embedded; L4 focus/word order.
**Distractors.** fixed sentence-initial `ли`, English auxiliary order.
**Validation.** Question-scope grammar.

### Family `wh_question_form`

**Task/purpose.** Choose and inflect a question word from the missing semantic
role, preposition, and case.
**Response/template.** Question word/form, ordering, or question construction.
**Derivation.** information gap, animacy, place/time/manner/quantity, government.
**Difficulty.** L1 `кто/что/где`; L2 oblique forms; L3 preposition; L4 marked
focus.
**Distractors.** nominative question word for every role.
**Validation.** Question-to-answer graph.

### Family `relative_kotory`

**Task/purpose.** Inflect `который` by antecedent gender/number and its own role
inside the relative clause.
**Response/template.** Form choice, antecedent-gap link, or clause completion.
**Derivation.** two-clause reference graph and gap case/government.
**Difficulty.** L2 subject/object; L3 preposition/oblique; L4 competing
antecedents.
**Distractors.** copy antecedent's matrix case.
**Validation.** Antecedent agreement plus gap case.

### Family `relative_adverb_clause`

**Task/purpose.** Link place/time/reason frames with reviewed relative adverbs
such as `где/куда/откуда/когда`.
**Response/template.** Connector choice, route relation, or clause completion.
**Derivation.** antecedent semantic class and gap relation.
**Difficulty.** L2 place/time; L3 direction/source; L4 implicit antecedent.
**Distractors.** static `где` for every path relation.
**Validation.** Relative relation graph.

### Family `chto_chtoby_clause`

**Task/purpose.** Distinguish factual/content `что` clauses from purpose/
desired-result `чтобы` constructions and apply subject/aspect/time features.
**Response/template.** Connector choice, form completion, or relation match.
**Derivation.** assertion, desire/purpose, subject relation, world status.
**Difficulty.** L2 clear fact/purpose; L3 reported desire; L4 conditional
homonymy/negation.
**Distractors.** translate one interface “that.”
**Validation.** Clause semantic grammar.

### Family `neutral_marked_word_order`

**Task/purpose.** Interpret or arrange constituents from case roles and a
declared given/new or contrastive context.
**Response/template.** Ordered chunks, focus matching, or role assignment.
**Derivation.** event graph and information structure.
**Difficulty.** L2 neutral SVO; L3 object/topic or final focus; L4 pronouns/
negation/particles.
**Distractors.** first noun always subject, all orders equivalent.
**Validation.** Information-structure linearizer.

### Family `clause_construction`

**Task/purpose.** Build a complete nominal, possessive, impersonal, negative,
interrogative, or relative clause from semantic cards.
**Response/template.** Ordered chunks or named fields.
**Derivation.** construction grammar, cases, morphology, reference, focus.
**Difficulty.** L1 present nominal; L2 possession/question; L3 negative/
relative; L4 impersonal marked order.
**Validation.** Back-parse and entailment.

### Family `sentence_structure_audit`

**Task/purpose.** Locate one pronoun, predication, possession, impersonal,
negation, question, relative, case, or word-order fault.
**Response/template.** Fault selection and repair.
**Derivation.** One typed mutation in a valid clause.
**Difficulty.** L2 local; L3 competing referents; L4 grammatical but
context-incompatible order/scope.
**Validation.** Exactly one root fault.

### Cross-family progression

Contrast present zero copula with possession/existence early. Introduce
`себя/свой` only after subject and case roles are stable. Teach ordinary
predicate `не`, then negative pronouns/concord, and reserve genitive under
negation for tightly authored later contrasts. Marked order follows reliable
case recognition.

## 6. Category: Connected Russian, discourse, register, and variation

### Category purpose

Train choices that become meaningful across clauses or turns: comparison,
connectors, temporal/aspect sequencing, reference, topic/focus, address,
politeness, register, and explicit profile interpretation.

### Learn-card content

- A string of correct sentences can still be incoherent if aspect, time,
  reference, or connectors conflict.
- `и, а, но, потому что, поэтому, если, когда, чтобы, хотя` encode different
  relations. Choose from logic and discourse, not one translation.
- Comparison uses reviewed analytic and synthetic forms with the correct case/
  preposition pattern.
- `ты/вы`, name/patronymic where context licenses it, verb forms, greetings,
  requests, and particles form one address bundle.
- Word order and intonation organize old/new and contrastive information.
- Colloquial or regional usage is understood under a label; it is not silently
  substituted into a neutral-standard production prompt.

### Prerequisites

Core Categories 3–5. Profile-comparison tasks require mastery of the default
production baseline.

### Category boundaries

This category owns relations across clauses/turns and pragmatic
appropriateness. It does not grade open style, social ideology, or cultural
interpretation. Reading/listening evidence is integrated in Category 7.

### Common misconceptions

- Selecting connectors from a single interface-language gloss.
- Using one aspect throughout a narrative regardless of viewpoint and sequence.
- Resolving every omitted noun/pronoun to the nearest compatible referent.
- Mixing `ты` and singular-polite `вы` agreement in one interaction.
- Assuming a patronymic is required or natural in every formal encounter.
- Treating any colloquial or regional form as universally neutral.

### Family `comparison_degree`

**Task/purpose.** Construct and interpret equality, comparative, and
superlative relations with reviewed analytic/synthetic forms.
**Response/template.** Form/case choice, ordering, or relation matching.
**Derivation.** ordered entities/property, degree, comparison standard.
**Difficulty.** L1 common `больше/меньше`; L2 synthetic comparative + `чем`;
L3 genitive standard, analytic `более +` adjective, and superlative; L4
irregular common forms.
**Distractors.** stack incompatible markers or wrong case.
**Validation.** Numeric/order relation oracle.

### Family `connector_relation`

**Task/purpose.** Choose a connector for addition, contrast, correction, cause,
result, alternative, or concession.
**Response/template.** Single-choice or clause pairing.
**Derivation.** logical/discourse relation and register.
**Difficulty.** L1 `и/но`; L2 `а` contrast/correction; L3 cause/result; L4
concession.
**Distractors.** same translation but wrong discourse relation.
**Validation.** Relation graph.

### Family `temporal_sequence`

**Task/purpose.** Order events and choose temporal expressions/aspect consistent
with before, after, overlap, repetition, and result.
**Response/template.** Timeline ordering or clause completion.
**Derivation.** event intervals, sequence, and viewpoint.
**Difficulty.** L2 explicit adverbs; L3 aspectual foreground; L4 reference-time
shift.
**Distractors.** sentence order equals event order.
**Validation.** Interval/event oracle.

### Family `cause_purpose_condition`

**Task/purpose.** Distinguish cause, result, purpose, and real/hypothetical
condition and select a licensed clause pattern.
**Response/template.** Relation/connector choice or completion.
**Derivation.** causal, intention, and possible-world graph.
**Difficulty.** L2 cause/result; L3 purpose `чтобы`; L4 condition+`бы`.
**Distractors.** one calque for “so/that/if.”
**Validation.** Logical and clause grammar.

### Family `discourse_aspect_tracking`

**Task/purpose.** Maintain or deliberately shift aspect through a routine,
description, instruction, or short narrative.
**Response/template.** Multiple verb choices, timeline, or anomaly selection.
**Derivation.** authored event graph and foreground/background.
**Difficulty.** L3 two events; L4 three-to-five event chain.
**Distractors.** one aspect for all clauses or completion heuristic.
**Validation.** Event-discourse model.

### Family `reference_chain`

**Task/purpose.** Resolve or construct chains of full noun phrases, pronouns,
zero repetition, and possessives across sentences.
**Response/template.** Entity linking or controlled rewrite.
**Derivation.** discourse entities, salience, gender/number, roles.
**Difficulty.** L2 one referent; L3 switch; L4 same-feature competitors.
**Distractors.** nearest noun always antecedent.
**Validation.** Unique reference graph.

### Family `information_structure_order`

**Task/purpose.** Choose a natural order for declared topic, neutral new
information, contrastive correction, or answer focus.
**Response/template.** Ordering or context-sentence matching.
**Derivation.** question under discussion, givenness, focus, prosody where
audio exists.
**Difficulty.** L2 answer focus; L3 topic shift; L4 contrast/negation.
**Distractors.** fixed SVO or free permutation.
**Validation.** Human-reviewed information-structure templates.

### Family `ty_vy_address_bundle`

**Task/purpose.** Maintain coherent familiar `ты`, plural `вы`, or polite
singular `Вы/вы` according to declared editorial/context policy.
**Response/template.** Bundle selection, dialogue repair, or rewrite.
**Derivation.** interlocutor count/relation, verb/pronoun agreement, medium,
capitalization policy.
**Difficulty.** L1 singular/plural; L2 polite unknown adult; L3 written
capitalization; L4 negotiated shift.
**Distractors.** change pronoun but not verbs/possessives.
**Validation.** Turn-level bundle consistency.

### Family `name_patronymic_register`

**Task/purpose.** Select a reviewed form of address—first name, name+
patronymic, title/role, or neutral alternative—from an explicit setting.
**Response/template.** Appropriateness choice or dialogue completion.
**Derivation.** relationship, institution, age only when authored, profile.
**Difficulty.** L2 clear formal/familiar; L3 workplace/service; L4 regional/
generational variation.
**Constraints.** Avoid universal cultural claims and invented patronymics.
**Validation.** Human pragmatic/name review.

### Family `polite_request_strategy`

**Task/purpose.** Match imperative, question, conditional `бы`, softeners,
greeting, and address to a declared request situation.
**Response/template.** Appropriateness choice or constrained rewrite.
**Derivation.** request burden, relation, urgency, medium.
**Difficulty.** L2 routine service request; L3 softened request; L4 urgent
contrast.
**Distractors.** grammatical but socially mismatched.
**Validation.** Authored pragmatic scale.

### Family `formal_informal_rewrite`

**Task/purpose.** Rewrite a bounded message between declared neutral-formal and
familiar-spoken profiles while preserving facts.
**Response/template.** Ordered chunks, multiple choice, or named fields.
**Derivation.** message semantics plus paired reviewed realizations.
**Difficulty.** L2 address; L3 greeting/request/closing; L4 lexical/syntactic
bundle.
**Constraints.** No open style scoring.
**Validation.** Meaning identity and register tags.

### Family `spoken_written_profile`

**Task/purpose.** Recognize reviewed colloquial reductions, particles, and word
order and select a standard written realization when requested.
**Response/template.** Matching, classification, or controlled rewrite.
**Derivation.** paired authored/audio variants.
**Difficulty.** L2 common particle/form; L3 connected phrase; L4 discourse
effect.
**Distractors.** label natural speech corrupt or accept in formal target
without qualification.
**Validation.** Profile registry and audio review.

### Family `regional_variant_comprehension`

**Task/purpose.** Understand a reviewed lexical, pronunciation, or usage
variant while retaining the active production baseline.
**Response/template.** Meaning match, feature/profile classification, or
baseline equivalent.
**Derivation.** paired profile entries.
**Difficulty.** L3 explicit label/transcript; L4 audio/context.
**Constraints.** No accent guessing, geopolitical assumptions, or caricature.
**Validation.** Specialist review/provenance.

### Family `controlled_message_construction`

**Task/purpose.** Compose a short message from required facts, relationship,
time, aspect, and register using constrained slots/chunks.
**Response/template.** Structured fields or ordered clauses.
**Derivation.** communicative intent, fact graph, construction set.
**Difficulty.** L2 one request/fact; L3 reason/time; L4 reference/aspect across
three clauses.
**Validation.** Required-fact entailment and forbidden-claim checks.

### Family `grammar_pragmatics_audit`

**Task/purpose.** Find one connector, aspect, reference, order, address,
register, or profile inconsistency in connected language.
**Response/template.** Span selection, fault type, and repair.
**Derivation.** Mutate one discourse dependency.
**Difficulty.** L3 two clauses; L4 multi-turn/profile-sensitive.
**Distractors.** Valid alternatives outside the mutation.
**Validation.** One root fault and preserved facts after repair.

### Cross-family progression

Start with explicit comparison and connector relations. Add event sequencing,
reference, and question–answer order, then requests and address bundles.
Patronymics and regional variation are scenario/profile data, never
stereotyped universal rules. Connected production remains constrained enough
for exact semantic checking.

## 7. Category: Reading, listening, and interaction

### Category purpose

Integrate the preceding systems in short evidence-based communicative tasks
while keeping answers objectively checkable and all offline media accessible.

### Learn-card content

- Identify genre, writer/speaker, addressee, and purpose before translating.
- Use case endings, agreement, verb aspect, motion prefixes, stress,
  punctuation, connectors, and word order as evidence.
- Distinguish what is stated from what is plausible but unsupported.
- Ordinary text may omit stress marks and often writes `е` for `ё`; recover
  known words from morphology and context without assuming any `е` is `ё`.
- Normal audio includes reduction, voicing, and connected rhythm. Replay first
  for gist and then for decisive detail.
- Recording and comparing yourself supports rehearsal but is not an automatic
  pronunciation score.

### Prerequisites

Selected families from Categories 2–6 according to each item's feature
manifest.

### Category boundaries

Texts and recordings use reviewed vocabulary/constructions plus a declared
small inferable set. This category checks comprehension, constrained
production, and interaction—not open literary analysis, essay quality, or
accent authenticity.

### Common misconceptions

- Translating token by token before using case and context.
- Ignoring endings because the word stem looks familiar.
- Reading unmarked `е` as always /e/ or always potential `ё`.
- Treating a plausible inference as stated fact.
- Assuming normal-rate audio pronounces citation forms segment by segment.
- Believing local recording/playback produces an objective score.

### Family `sentence_segmentation_parse`

**Task/purpose.** Segment a sentence into phrase/clause chunks and identify
predicate, participants, modifiers, and connector.
**Response/template.** Boundary placement, matching, or dependency selection.
**Derivation.** Generator source parse.
**Difficulty.** L1 phrase/predicate; L2 oblique arguments; L3 subordinate/
relative; L4 marked order.
**Distractors.** chunk by spaces/position alone.
**Validation.** Source tree.

### Family `inflected_word_recovery`

**Task/purpose.** Recover a known lemma/sense from an inflected surface form.
**Response/template.** Lemma match, feature fields, or gloss choice.
**Derivation.** paradigm analysis and sentence semantics.
**Difficulty.** L1 transparent noun; L2 stress/stem change; L3 aspect/motion
form; L4 homograph resolved by syntax.
**Distractors.** visual substring only.
**Validation.** Unique contextual morphological analysis.

### Family `ordinary_print_support_recovery`

**Task/purpose.** Read a controlled ordinary-print passage with reduced stress
marking and profile-licensed `е` for `ё`.
**Response/template.** Word identification, stress/`ё` restoration, or meaning.
**Derivation.** canonical pedagogical source transformed by display policy.
**Difficulty.** L2 known words; L3 context-resolved ambiguity; L4 several
supports removed.
**Distractors.** restore `ё` arbitrarily.
**Validation.** Round-trip to canonical forms and contextual uniqueness.

### Family `short_reading_comprehension`

**Task/purpose.** Retrieve stated facts and simple licensed inferences from a
purpose-written 1–5-sentence text.
**Response/template.** Choice, matching, ordering, or exact short answer.
**Derivation.** Text fact/event/reference graph.
**Difficulty.** L1 one fact; L2 two cases/times; L3 aspect/reference; L4
negative/contrastive evidence.
**Distractors.** contradicted, unsupported, role reversal.
**Validation.** Entailment annotations.

### Family `notice_message`

**Task/purpose.** Interpret a sign, chat, email, announcement, invitation, or
service message.
**Response/template.** Purpose/detail/action choice.
**Derivation.** genre template, audience, time/location/action facts.
**Difficulty.** L1 one instruction; L2 date/time; L3 condition/change; L4
register/inference.
**Constraints.** Fictional, non-live, non-high-stakes.
**Validation.** Fact and genre review.

### Family `instruction_schedule_route`

**Task/purpose.** Follow ordered instructions, a timetable, or a simple route
with motion/path language.
**Response/template.** Ordered steps, selected outcome, or structured
time/location.
**Derivation.** exact sequence, calendar, and route graph.
**Difficulty.** L1 two steps; L2 time; L3 branch/path prefix; L4
cross-reference.
**Distractors.** swap steps, reverse source/destination, ignore negation.
**Validation.** Independent sequence/route oracle.

### Family `dialogue_completion`

**Task/purpose.** Choose or construct the next turn satisfying intent,
reference, answer type, and register.
**Response/template.** Single-choice, ordered chunks, or bounded completion.
**Derivation.** dialogue state, speech act, facts, address profile.
**Difficulty.** L1 greeting/Q&A; L2 request; L3 repair/refusal/reason; L4
limited authored implicature.
**Validation.** State transition.

### Family `reference_resolution`

**Task/purpose.** Resolve pronouns, omitted repeated material, possessives, and
zero subjects in a short text/dialogue.
**Response/template.** Entity linking or matching.
**Derivation.** explicit discourse graph.
**Difficulty.** L2 gender/case cue; L3 same-feature competitors; L4 topic shift.
**Distractors.** nearest noun.
**Validation.** Unique antecedent under context.

### Family `listening_sound_form`

**Task/purpose.** Match audio to word/phrase form using stress, hardness,
reduction, voicing, and morphology.
**Response/template.** Audio/text matching.
**Derivation.** licensed recordings and transcripts.
**Difficulty.** L1 stressed word; L2 reduction/hard-soft; L3 inflected form; L4
normal-rate profile.
**Constraints.** Recording artifacts may not cue answers.
**Validation.** Human audio review.

### Family `listening_dictation`

**Task/purpose.** Transcribe a reviewed phrase/sentence when context supplies
enough evidence for spelling, `ё`, stress knowledge, and morphology.
**Response/template.** Text or segmented named fields.
**Derivation.** recording, transcript, context, accepted profile forms.
**Difficulty.** L1 word; L2 slow phrase; L3 normal sentence; L4 reduced/
devoiced ambiguous sounds resolved by grammar.
**Validation.** Audio/transcript alignment.

### Family `listening_comprehension`

**Task/purpose.** Extract gist, stated detail, sequence, speaker relation, or
simple inference from short audio.
**Response/template.** Choice, matching, ordering, or exact field.
**Derivation.** audio-script fact/dialogue graph.
**Difficulty.** L1 one fact; L2 two details; L3 aspect/motion/reference; L4
normal-rate multi-turn/profile.
**Distractors.** mentioned but wrong role/time/path or unsupported.
**Validation.** Evidence spans and human review.

### Family `guided_speaking_shadowing`

**Task/purpose.** Rehearse and optionally record a reviewed utterance with
attention to stress, hardness, reduction, and phrase focus.
**Response/template.** Listen–repeat–self-compare checklist; no automatic score.
**Derivation.** model audio, transcript, stress/prosody annotations.
**Difficulty.** L1 word; L2 phrase; L3 sentence; L4 short role turn.
**Constraints.** Local-only recording, explicit deletion, text route.
**Validation.** Asset/manual review, not learner-audio judgment.

### Family `bounded_mediation`

**Task/purpose.** Relay selected facts from a table, route, schedule, or
interface-language note in controlled Russian without open translation.
**Response/template.** Named fields, clause choices, or ordered chunks.
**Derivation.** Fact graph and licensed realization set.
**Difficulty.** L2 one fact; L3 time/route/reason; L4 two audiences/register.
**Distractors.** omit required fact or add unsupported claim.
**Validation.** Bidirectional fact entailment.

### Family `profile_comprehension`

**Task/purpose.** Understand paired neutral/regional or careful/colloquial
recordings/texts and identify shared meaning plus declared profile difference.
**Response/template.** Meaning match and feature classification.
**Derivation.** reviewed paired items and speaker/profile metadata.
**Difficulty.** L3 transcript supplied; L4 audio-first familiar feature.
**Constraints.** No accent guessing from unknown speakers.
**Validation.** Specialist/profile review.

### Family `connected_language_audit`

**Task/purpose.** Find one contradiction, unsupported interpretation,
reference/time/path mismatch, malformed form, or register inconsistency using
text/audio evidence.
**Response/template.** Evidence span plus correction/classification.
**Derivation.** One logged mutation to a valid source item.
**Difficulty.** L2 sentence; L3 text/dialogue; L4 cross-modal evidence.
**Validation.** Exactly one root fault and uniquely decisive evidence.

### Cross-family progression

Begin with parsing and word recovery under full learner support, then fade
stress marks and selected `ё` display only for mastered forms. Add one-fact
texts/audio, messages, routes, dialogues, and reference. Dictation follows
sound–spelling mastery. Mediation and profile comparison are later; receptive
and productive vocabulary remain separate.

## 8. Cross-category progression and release slices

Levels describe exercise complexity, not certification:

- **Foundation / L1:** Cyrillic identity/keyboard, `ё`, stress recognition,
  core hard/soft contrasts, noun gender, nominative/simple accusative, present
  imperfective, present zero copula, simple questions/negation, and one-fact
  reading/listening.
- **Elementary / L2:** vowel reduction/voicing, stress production, plural and
  core genitive/dative/accusative/instrumental/prepositional uses, adjective
  agreement, past agreement, future forms, first aspect contrasts, one motion
  pair, possession/absence, practical messages, and dictation.
- **Independent-building / L3:** less regular paradigms, animacy, numeral
  government, aspect across contexts, reflexives, imperatives/conditional,
  several motion pairs and prefixes, impersonals, `себя/свой`, negative
  concord, relatives, order, connectors, register, connected comprehension, and
  mediation.
- **Early-intermediate / L4:** interacting aspect/motion/government/reference,
  path bundles, controlled participle/verbal-adverb recognition, negation
  nuance, discourse aspect/focus, spoken/written and cross-profile
  comprehension, and audits.
- **L5 challenge:** denser mixing and reduced scaffolding inside reviewed
  early-B1 grammar; no silent move to advanced literary Russian or open writing.

Recommended delivery:

1. **Release A — Cyrillic, noun phrase, present:** Category 2 core; gender,
   number, basic nominative/accusative/agreement; present imperfective; zero
   copula, simple questions/negation; parsing and short audio.
2. **Release B — cases and event time:** stress/reduction, genitive/dative/
   instrumental/prepositional, spatial contrasts, past/future, first aspect
   pairs, possession/absence, notices, schedules, and dictation.
3. **Release C — motion and connected Russian:** animacy/numerals, aspect
   contexts, reflexives, motion pairs/prefixes, impersonals/relatives/order,
   connectors, reference, register, dialogue/listening, and messages.
4. **Release D — early-B1 integration:** path bundles, aspect discourse,
   conditional/voice recognition, negation nuance, variation, mediation,
   profile comprehension, and audits.

Unlock by family dependencies. Cyrillic recognition, orthographic production,
case recognition, case production, aspect selection, motion interpretation,
reading, listening, speaking rehearsal, and profile comprehension have separate
evidence. Audio/microphone remains optional where inaccessible.

## 9. Adaptive practice guidance

Track:

- family/can-do, level, scaffold, modality, response, latency, confidence, and
  misconception;
- lexeme/sense, frequency/domain, known status, collocation, register/profile;
- Cyrillic code point, Latin-lookalike, print/cursive form, keyboard support,
  `ё` policy, syllable/stress, hard/soft segment, reduction/voicing, audio/
  speaker/profile;
- noun gender/animacy/class, number/case and case source, agreement controller,
  preposition/government, indeclinability, numeral/quantity;
- verb class/stem/person or past agreement, time, aspect pair/sense, reflexive
  meaning, government, mood/modal, polarity;
- motion pair/mode, directionality, trip structure, prefix/path boundary,
  source/route/destination and case bundle;
- pronoun role/referent/binding, predication/possession/impersonal type,
  negation scope/concord, question/relative gap, order/topic/focus;
- connector/relation, event sequence, address/register, genre/evidence, and
  profile difference.

Routing examples:

- Correct sound but Latin code point → contrast actual Cyrillic/Latin glyphs
  before adding vocabulary.
- Correct word with `е` for canonical learner `ё` → acknowledge meaning, target
  `ё` separately, and do not mark the lexeme unknown.
- Correct lemma but wrong stress → retain meaning mastery and schedule the
  exact form/audio.
- Correct noun but wrong gender → retrieve noun+agreement anchor before a new
  case.
- Correct case role but wrong ending → hold semantics constant and practice its
  paradigm cell.
- Accusative copied from nominative for an animate noun → contrast identical
  syntax with only animacy changed.
- Correct preposition but wrong case → show the relation→government link; do
  not add a new preposition.
- Regularized plural genitive → retrieve the lexical principal form in several
  quantity frames.
- Perfective used for current ongoing action → contrast perfective future with
  imperfective present using one event.
- Aspect chosen by duration → reframe the same duration from internal and
  bounded viewpoints.
- `буду + perfective` → contrast the compound imperfective future and the
  perfective simple future.
- Wrong motion pair → hold destination/time constant and vary only
  one-way-current versus habitual/multidirectional.
- Correct prefix but wrong source/destination phrase → display the full path
  graph before another prefix.
- `есть` inserted as every present copula → contrast nominal predication with
  possession/existence.
- `свой` confused with `его/её` → show subject and possessor links before a
  more complex clause.
- Profile-valid colloquial form in formal production → explain classification
  and active target.

Track recognized, scaffold-produced, and meaning-produced mastery separately.
Space lexical gender, stress, case principal forms, aspect partners, irregular
verb cells, and motion pairs. After two successes, vary one dimension. A
confident misconception triggers a minimal contrast, explanation, and delayed
transfer. Slow correctness does not justify unrelated lexical difficulty.

## 10. Feedback and explanation requirements

Reveal:

1. **Intention/profile:** meaning, time, path, relationship, speech act,
   register, medium, and active Russian profile.
2. **Semantic frame:** predicate, roles, referents, states/events, intervals,
   path boundaries, worlds, and discourse relation.
3. **Features:** gender, animacy, number, case/source; person or past agreement,
   time, aspect, reflexive/voice meaning, modality, and polarity.
4. **Realization:** noun/adjective/pronoun form and stress; verb stem/ending,
   aspect partner, `-ся/-сь`; motion pair/prefix; preposition/government.
5. **Structure:** agreement/binding controller, predication type, negation
   scope/concord, question/relative gap, order/topic/focus, reference chain.
6. **Mismatch/alternatives:** first decisive error and whether another form is
   equivalent, profile-different, contextually different, non-target, or wrong.

Useful visuals:

- Cyrillic/Latin code-point and font comparison;
- print/cursive matched glyphs and keyboard map;
- grapheme–sound/aligned audio with hard/soft and reduction layers;
- syllable boxes with lexical/mobile stress and `ё`;
- role/government→case graph and noun-phrase agreement arcs;
- animacy-conditioned accusative table;
- numeral→noun-form decision tree;
- aspect timelines over the same real-world event;
- aspect-pair sense graph and prefix meaning;
- motion path diagram with direction, trip structure, transport, boundaries,
  prepositions, and cases;
- reflexive/active participant graph;
- possession, impersonal experiencer, binding, negation-scope, and relative-gap
  diagrams;
- topic/focus order and discourse-reference graph;
- timed transcript evidence and profile comparison.

An interface-language gloss is support, not a full explanation. Invalidate any
item lacking enough context for gender, animacy, case, government, numeral form,
aspect, motion direction/path, reflexive sense, possession, negation, reference,
order/focus, register, or profile.

## 11. Audio and content requirements

- Bundle all audio; no runtime TTS, speech-recognition, dictionary, corpus, or
  pronunciation service.
- Prefer licensed human recordings from multiple reviewed Standard Russian
  speakers, with geographic metadata used neutrally.
- Separate normal and pedagogically slower takes; do not distort stress,
  reduction, voicing, hardness/softness, or rhythm through naive slowdown.
- Store canonical transcript with `ё`, display transcript/profile, stress and
  token/time alignment where needed, speaker/voice, broad profile, rate, target
  features, license/provenance, and review status.
- Sound contrasts require matched conditions and must not be identifiable from
  noise, loudness, or speaker alone.
- Provide replay, visible state, keyboard controls, transcript when it does not
  defeat the task, and a non-audio route where hearing is not the skill.
- Microphone use is optional/local-only: no upload, retention by default,
  accent identification, or automatic pronunciation/comprehensibility score.
- Purpose-write text/dialogue. External content requires compatible licensing
  and attribution.
- Use varied names, locations, households, occupations, and situations without
  stereotypes, propaganda, or cultural-trivia prerequisites.

## 12. Rendering, interaction, and accessibility

- Use UTF-8 and fonts verified for all 33 Cyrillic letters, `ё/Ё`, combining
  stress, italics, bold, punctuation, and common learner cursive assets.
- Preserve Cyrillic versus Latin code points; visually identical glyphs may not
  normalize across scripts.
- Normalize NFC internally while retaining raw response for diagnostics about
  mixed scripts and combining characters.
- Offer an optional Cyrillic character strip, keyboard-layout guide, and
  explicit transliteration scaffold, each tracked separately.
- Stress marks and `ё` remain legible at every supported size and high-contrast
  setting.
- Print/cursive images have text alternatives naming the transcription, except
  when that is the target; then provide an equivalent nonvisual practice route.
- Paradigms use semantic HTML tables with localized case/person labels.
- Agreement arcs, case/motion/aspect diagrams, reference graphs, and timelines
  have text/table descriptions.
- Ordering tasks have keyboard/button alternatives and large touch targets.
- Audio controls expose labels, state, replay, rate variant, and transcript; no
  autoplay.
- Color, sound, motion, time, handwriting, or fine pointer action is never the
  sole cue without an appropriate alternative.
- Speaking tasks remain listen/read rehearsal without microphone permission.
- Long Cyrillic words and tables wrap without splitting base/combining marks.
- Screen readers announce target/correction before technical explanation and
  hide raw feature IDs.
- Respect reduced motion and avoid disappearing timers.
- Profile labels use text, not flags alone.

## 13. Generator and offline implementation guidance

Useful module boundary:

```text
seededRng
reviewedRussianLexiconRegistry
varietyProfileRegistry
unicodeCyrillicNormalizer
mixedScriptDetector
alphabetKeyboardRegistry
printCursiveAssetRegistry
yoStressDisplayPolicy
syllableStressEngine
pronunciationReductionRegistry
semanticFrameGenerator
nominalParadigmRealizer
caseGovernmentEngine
animacyAccusativeResolver
agreementResolver
prepositionSpatialRegistry
numeralGovernmentEngine
verbPrincipalFormRegistry
verbParadigmRealizer
aspectSensePairRegistry
eventAspectWorldModel
reflexiveVoiceMapper
motionEventGenerator
motionPathPrefixRegistry
motionPhraseRealizer
predicationPossessionGrammar
bindingReferenceResolver
negationScopeConcordEngine
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
- semantic frame, roles, referents, facts, states/events, intervals/worlds,
  path topology, and speech act;
- lexeme/sense IDs and full morphosyntactic bundles;
- gender/animacy, case source/government, agreement controllers, numeral state;
- verb principal forms, aspect/sense partner, paradigm cell, reflexive meaning;
- motion mode/pair/direction/trip/prefix/boundaries/source/route/destination;
- predication/possession/impersonal structure, binding, negation, question/
  relative/order template;
- active profile and canonical/accepted/profile-different realizations;
- script code points, `ё`/stress display, syllable/pronunciation/audio metadata;
- parse/evidence/normalization, distractor misconception, and fault ID.

Generation:

1. choose family, level, profile, and declared difficulty dimensions;
2. create semantic, orthographic, phonological, event, motion, or discourse
   source;
3. select compatible reviewed lexemes and a licensed construction;
4. assign roles/cases, agreement, time/aspect/reflexivity, path, reference,
   polarity, information structure, and register;
5. realize noun/adjective/pronoun/numeral and verb/motion forms from stored data;
6. linearize and apply spelling, `ё`, stress-display, capitalization and
   punctuation policy;
7. select compatible visual/audio assets where required;
8. back-parse and verify identity against source;
9. derive answer/explanation by an independent path;
10. create misconception distractors or one typed audit mutation;
11. reject ambiguity, answer collisions, unnaturalness, profile mismatch,
    excessive new vocabulary, or insufficient evidence.

No backend or runtime network is assumed. Ship reviewed/versioned data, audio,
glyphs, and authored templates inside the standalone HTML/JS/CSS artifact or
adjacent bundled assets. Do not embed a general translator, corpus,
morphological analyzer, or speech recognizer. Choice/order tasks compare IDs.
Free text parses only the documented controlled grammar and compares typed
features and accepted realizations; edit distance is diagnostic only.

## 14. Automated and linguistic validation

### Data-build checks

- Every lexeme has stable ID, sense, part of speech, level/frequency, register/
  profile, provenance, and review.
- Every noun has gender, animacy, all shipped number/case forms, stress, and
  pronunciation.
- Every adjective, determiner, numeral, and pronoun has all shipped agreement/
  case/animacy cells and accepted variants.
- Every verb has all shipped person/number/past/imperative cells, aspect/sense
  links, stress, government, reflexive/voice behavior, and principal forms.
- Every motion verb has pair/mode/directionality, paradigms, prefix/path frames,
  source/route/destination bundles, and reviewed figurative exclusions.
- Every preposition, numeral, predication, possession, impersonal, negation,
  question, relative, order, and register construction is typed/reviewed.
- Every regional/spoken variant declares scope, profile, register, baseline
  equivalent where appropriate, and explanation.
- Every audio/image asset has transcript/identity, profile/speaker/source,
  license/provenance, and human review.

### Instance invariants

- Surface Russian reparses to source semantics/features.
- Cyrillic code points, `ё`, stress display, signs, boundaries, capitalization,
  and punctuation match the declared profile.
- Pronunciation/audio matches lexical form, stress, hardness/softness,
  reduction/voicing, inflection, and profile.
- Case follows role/government/numeral/preposition; agreement includes animacy
  where required.
- Verb stem, ending, stress, time, aspect, reflexive meaning, mood/modal,
  polarity, and government match the event.
- Motion pair/mode/direction/trip/prefix/path boundary and preposition/case
  bundle match the motion graph.
- Present predication, possession/existence, impersonal experiencer, binding,
  negation scope/concord, question/relative gap, order/topic/focus, address,
  register, and profile match context.
- Reading/listening key is entailed; distractors are logged as contradicted,
  unsupported, wrong role/time/path/reference, or profile/register mismatch.
- Accepted answers never collide after family-specific normalization.
- Every audit differs from valid source by exactly one root mutation.

### Test volume and independent oracles

- At least 10,000 seeds per family/level.
- At least 25,000 for mixed script, `ё`/stress, sound–spelling, case/agreement,
  animacy, numeral government, verb paradigms/aspect, reflexives, motion/path,
  possession/impersonals, negation, relatives, order/reference, and audits.
- Exhaustively enumerate the alphabet, mixed-script lookalikes, shipped noun/
  adjective/pronoun/numeral/verb/motion paradigms, case/preposition frames, and
  orthographic profile variants.
- Exhaustively test NFC/decomposed stress input, Cyrillic/Latin mixtures,
  uppercase/lowercase, `ё/е` display policies, signs, and punctuation.
- Independently recompute integers, valid dates, time, prices, quantity
  government, routes, path topology, and comparison relations.
- The back-parser/validator must not share the generator's answer-key path.
- Snapshot long words, combining stress, paradigms, glyph images, motion/
  aspect diagrams, profile labels, and audio states on mobile/desktop.
- Manually review all audio/cursive assets and stratified samples across
  template, lexeme, paradigm, case, aspect, motion, register, profile,
  distractor, and fault types. Automation cannot certify idiomaticity or
  pragmatic naturalness.

Discard and log failures; never substitute unreviewed content.

## 15. Coverage and balance requirements

Report by family/level:

- generation/rejection counts and distinct semantic/construction frames;
- lemma/sense/domain/frequency/new-word status, collocation, register/profile;
- Cyrillic/lookalike/print/cursive, `ё`, syllable/stress, sound process, audio/
  speaker/profile;
- noun gender/animacy/class/number/case/source, agreement, preposition/
  government, indeclinability, numeral/quantity;
- verb class/principal form/person/past agreement/time/aspect/sense, reflexive
  meaning, government, modal/mood/polarity;
- motion family/mode/direction/trip/prefix/path/source/route/destination/cases;
- pronoun/binding/reference, predication/possession/impersonal, negation/scope/
  concord, question/relative/order/topic/focus;
- connector/relation, event sequence, address/register, genre/evidence,
  modality, response/scaffold/misconception/confidence/repetition.

Cap easy defaults: Cyrillic letters unlike Latin, fixed stem stress,
transparent-gender nouns, nominative singular, masculine/inanimate examples,
first-declension forms, nominative-looking accusatives, first-conjugation
present, third-person singular, simple prefixed aspect pairs, `идти` only,
neutral SVO, one speaker/profile, and literal one-clause translation. Balance
frequency, communicative value, gender, animacy, case, person, aspect, motion
mode/direction, role, modality, register, and learner need. Do not elevate rare
forms to core frequency for symmetry.

## 16. Content and implementation checklist

- [ ] Contemporary Standard Russian, roughly Foundation–early B1; no
      certification claim.
- [ ] Historical Cyrillic, Church Slavonic production, and pre-reform spelling
      excluded.
- [ ] Production baseline and regional/colloquial receptive profiles explicit
      and versioned.
- [ ] All 33 Cyrillic letters, mixed-script detection, `ё`, stress, and
      combining marks render reliably.
- [ ] `ё` is learner-canonical; ordinary-print `е` behavior is explicit.
- [ ] Romanization and stress marks are tracked scaffolds.
- [ ] Print/cursive recognition uses reviewed accessible assets; no handwriting
      score.
- [ ] Lexemes, senses, paradigms, constructions, variants, and media reviewed
      with provenance/license.
- [ ] Gender, animacy, case forms, stress, aspect partners, reflexive meanings,
      motion pairs, and government stored rather than guessed.
- [ ] Case derives from semantic/lexical/prepositional/numeral government.
- [ ] Agreement has an explicit controller and includes animacy where relevant.
- [ ] Aspect is sense-specific viewpoint, not prefix or duration heuristics.
- [ ] Perfective nonpast and imperfective compound future kept distinct.
- [ ] Motion uses explicit direction/trip/mode/path topology.
- [ ] Present zero copula differs from possession/existence `есть`.
- [ ] `себя/свой`, negation, relatives, and order derive from reference/context.
- [ ] No unrestricted translation, essay, conversation, or fuzzy grading.
- [ ] Audio is local, licensed, human-reviewed, and profile-tagged.
- [ ] Local recording produces no bogus pronunciation/accent score.
- [ ] Reading/listening answers retain exact evidence.
- [ ] Distractors encode misconceptions; audits mutate one root dependency.
- [ ] Seeds reproduce prompt, profile, answer, variants, media, and explanation.
- [ ] Accessibility covers Cyrillic input, stress, cursive, sound alternatives,
      ordering, diagrams, tables, audio, and local recording.
- [ ] Standalone HTML/JS/CSS; no backend or runtime network.

## 17. Stable IDs and recommended navigation

Use:

```text
russian-language/<category-id>/<family-id>/<schema-version>
```

Persist seed, data/generator/profile versions, lexeme/sense IDs, semantic frame,
full feature bundle, case/government/agreement controllers, aspect/reflexive/
motion state, reference/binding/order structure, answer policy, media IDs, and
fault ID. Increment schema/data versions whenever a keyed prompt, answer,
accepted variant, or explanation can change.

Recommended learner navigation:

1. **Cyrillic, Sound & Stress**
2. **Words, Cases & Agreement**
3. **Verbs, Aspect & Motion**
4. **Sentences & Reference**
5. **Connected Russian**
6. **Reading, Listening & Interaction**

Filters may expose level, family, modality, input mode, keyboard/transliteration
scaffold, stress/`ё` support, primary/receptive profile, register, vocabulary
domain, and error review. Internal linguistic engine terms remain
developer-only.
