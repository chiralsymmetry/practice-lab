# Icelandic Language — Dynamic Practice Specification

Status: implementation specification

Audience: exercise generator, linguistic-content editor, Icelandic morphology
and answer engine, text/audio renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual requirements meanings.

## 1. Topic overview

### Topic name

Icelandic Language

### Topic goal

Develop beginner-to-lower-intermediate communicative Icelandic by repeatedly
connecting spelling, sound, vocabulary, inflection, syntax, reading, listening,
controlled writing, and guided speaking. The learner should become able to:

- recognize and type the Icelandic alphabet, including `á é í ó ú ý ð þ æ ö`;
- distinguish spelling contrasts that modern pronunciation may not reveal;
- connect reviewed word forms to lemma, gender, case, number, definiteness,
  person, tense, mood, voice, and degree;
- choose noun, adjective, pronoun, numeral, and determiner forms that agree in a
  controlled phrase;
- use the four cases from semantic roles and lexically governed frames rather
  than an English preposition lookup;
- form common present, past, perfect, imperative, subjunctive, middle, and passive
  constructions from reviewed paradigms;
- apply verb-second order, inversion, negation placement, and selected subordinate
  clause patterns;
- understand and produce practical numbers, prices, dates, clock times, greetings,
  requests, directions, descriptions, and short messages;
- resolve reference and grammatical relationships in short connected texts;
- understand bundled recordings and rehearse fixed utterances without unreliable
  automatic pronunciation grading;
- distinguish a canonical learning target, accepted variant, contextually
  different form, and genuinely incompatible form.

The app should train useful Icelandic, not merely terminology about declensions.
Its central implementation challenge is not “adding endings,” but selecting a
reviewed lexeme and exact feature bundle within a meaningful semantic frame.

### Audience and level boundary

The curriculum begins before alphabet mastery and extends through practical A1,
A2, and selected early-B1 tasks. These labels describe task complexity; the app
does not certify CEFR level, school placement, citizenship-test readiness, or
University of Iceland course equivalence.

- Foundation: alphabet/input, core sound contrasts, fixed expressions, and
  recognition of basic forms.
- A1-oriented: familiar noun phrases, present-tense clauses, questions, numbers,
  time, and routine interactions.
- A2-oriented: past/perfect narration, agreement and case across phrases,
  directions, comparisons, connected messages, and common subordinate clauses.
- early-B1-oriented: controlled case frames, subjunctive/middle/passive
  recognition, relative clauses, short explanations, and multi-sentence
  comprehension.

### Reference and language-data boundary

Primary reference anchors include:

- the Árni Magnússon Institute's [Database of Icelandic Morphology
  (BÍN/DMII)](https://bin.arnastofnun.is/DMII), which supplies extensive
  contemporary inflectional paradigms;
- [BÍN's word-class and inflectional-category
  documentation](https://bin.arnastofnun.is/DMII/infl-system/), which describes
  noun, adjective, verb, pronoun, article, numeral, and other paradigms;
- [BÍN Core](https://bin.arnastofnun.is/DMII/dmii-core/), a reviewed prescriptive
  subset intended for schools, learners, and third-party publication;
- the Icelandic Language Council's [official orthography
  rules](https://arnastofnun.is/is/ritreglur-islenskrar-malnefndar) and the
  official spelling resources available through [Málið.is](https://www.malid.is/);
- the University of Iceland's Icelandic-as-a-second-language curriculum, whose
  grammar coverage explicitly includes inflection, case assignment, agreement,
  morphophonemics, and word order.

The implementation must use a licensed, versioned, locally bundled subset of
reviewed data. It must not scrape BÍN web pages, assume all descriptive variants
are beginner production targets, or depend on the BÍN API at runtime. Dataset
licences, attribution, source version, editorial decisions, and local changes
must be recorded.

### Language variety and usage policy

- Core production targets use contemporary standard Icelandic and official
  orthography.
- Natural regional, social, generational, and individual pronunciation variation
  is not labeled defective.
- A form attested in a descriptive resource is not automatically a canonical
  learner target; the reviewed core lexicon records usage status.
- Formality, relationship, discourse context, and written/spoken register are
  explicit when they affect an answer.
- Person names, patronymics/matronymics, and place names are curated rather than
  generated from stereotypes.
- Cultural content is fact-checked and never reduced to “Icelanders always...”
  prompts.

Every realization is classified as:

1. **canonical target** — the taught form for this feature/context;
2. **accepted variant** — licensed and meaning-compatible here;
3. **contextually different** — grammatical but changes meaning, role, focus,
   register, or discourse assumptions;
4. **non-target/nonstandard** — outside the requested standard/profile;
5. **incorrect** — incompatible morphology, syntax, spelling, or semantics.

### Orthography and alphabet policy

The core Icelandic alphabet contains:

```text
A Á B D Ð E É F G H I Í J K L M N O Ó P R S T U Ú V X Y Ý Þ Æ Ö
```

- Acute marks identify distinct vowel letters/sound values; they are not stress
  accents that may be omitted.
- `þ` and `ð` are distinct letters, not optional spellings of `th`.
- `æ` and `ö` are letters, not decorative variants.
- `c`, `q`, `w`, and `z` may occur in foreign names/quoted material but are not
  generated as native alphabet targets.
- Internal strings are Unicode NFC. Decomposed equivalent code-point sequences
  normalize for ordinary input, but missing/incorrect diacritics remain wrong
  when spelling is assessed.
- Case-folding is allowed only when capitalization is not the skill. Sentence
  initial capitalization and proper names remain significant in editing tasks.
- Hyphenation, compounds, abbreviations, and punctuation follow curated entries
  and the active orthography profile.

### Pronunciation boundary

Orthography and pronunciation are connected but not identical.

- Audio content uses reviewed broad-phonemic/learner annotations and human
  recordings.
- The app may teach contrasts involving vowel quality/diphthongs, `þ/ð`, `ll`,
  `rn/rl`, voiced/unvoiced sonorants, aspiration/preaspiration, and consonant
  quantity only through curated words and recordings.
- Spelling-to-sound rules carry lexical exceptions and environment conditions.
- Letter names, phoneme labels, and spellings are separate semantic layers.
- Primary stress is introduced with curated words/compounds; the app does not
  infer arbitrary compound prosody.
- Audio discrimination accepts all recordings licensed for the target category.
- No dialect or accent is presented as the only legitimate Icelandic voice.

### Linguistic data model

Every lexeme is authored and versioned:

```text
Lexeme {
  id
  lemma
  headwordFeatures
  spellings[]
  pronunciationIds[]
  partOfSpeech
  inflectionClass
  paradigmForms[]
  stemAlternations[]
  gender?
  principalParts?
  caseFrames[]
  semanticTags[]
  selectionalTags[]
  register
  frequencyBand
  collocations[]
  compoundBehavior?
  acceptedVariants[]
  exampleTemplateIds[]
  provenance
}
```

Morphological forms are not stored as untyped strings:

```text
MorphologicalForm {
  lexemeId
  surface
  features {
    case?
    number?
    gender?
    definiteness?
    adjectiveStrength?
    degree?
    person?
    tense?
    mood?
    voice?
    nonfiniteForm?
  }
  usageStatus
  pronunciationId?
}
```

Sentence templates are typed:

```text
SentenceTemplate {
  semanticFrame
  discourseContext
  slots[]
  agreementLinks[]
  governmentLinks[]
  finiteVerbPosition
  clauseType
  register
  canonicalRealizations[]
  acceptedVariants[]
  rejectionRules[]
}
```

Generation order is semantic frame → compatible lexemes → feature assignment →
morphological realization → syntax → validation → rendering. Never build
sentences by selecting random surface forms with matching endings.

### Normative morphology policy

The engine supports:

- nouns: three genders, four cases, singular/plural, indefinite/definite, and
  reviewed strong/weak/irregular paradigms;
- adjectives: gender, case, number, strong/weak inflection, positive/comparative/
  superlative degree, and reviewed irregular comparison;
- pronouns/determiners/numerals: exact reviewed feature paradigms;
- verbs: person, number, present/past, indicative/subjunctive/imperative,
  active/middle/passive constructions, infinitive, present participle, past
  participle, and supine where licensed by the profile.

Surface syncretism is normal: one spelling may represent several feature bundles.
A recognition prompt must supply enough syntax/context to identify the intended
analysis or accept all compatible analyses. Production checks compare the
requested feature bundle with the lexeme paradigm; they do not reverse-engineer
an ending rule.

### Case and agreement policy

Cases are:

```text
nominative (nefnifall)
accusative (þolfall)
dative (þágufall)
genitive (eignarfall)
```

Case comes from:

- syntactic/semantic role in a controlled construction;
- lexical government by a reviewed verb, adjective, or preposition;
- motion/location contrast in selected prepositional frames;
- quantity, possession, time, or idiomatic construction recorded in a template.

The app never maps one English preposition to one Icelandic case. Subject case
is not assumed nominative in every authored frame. Agreement links explicitly
connect nouns with articles, adjectives, demonstratives, participles, or
predicative complements as appropriate.

### Definite article policy

Icelandic has no ordinary indefinite article. Definiteness is commonly expressed
through a suffixed article on the noun, with morphophonemic interactions encoded
in the paradigm:

```text
hestur → hesturinn
kona → konan
barn → barnið
```

Adjective-plus-definite noun phrases and standalone/demonstrative article-like
constructions use authored templates. The engine must not create definite forms
by naïvely appending one invariant string.

### Verb and word-order policy

- Verb paradigms and principal parts are reviewed per lexeme; weak/strong labels
  guide learning but never replace stored forms.
- Verbs and prepositions carry case frames.
- Main declarative clauses use a controlled verb-second model.
- Fronting a non-subject constituent triggers subject–finite-verb order changes.
- Yes/no questions and wh-questions have authored finite-verb placement.
- Negation/adverb position is clause-type-sensitive.
- Subordinate clause templates declare complementizer, finite verb, subject,
  negation/adverb, and permitted variants explicitly.
- Middle `-st`, periphrastic passive, perfect, progressive, modal, and subjunctive
  constructions have separate semantics; they are not string suffix macros.

### Icelandic input and answer checking

Response modes include:

- single/multiple choice;
- short Icelandic text;
- one or more inflection-feature fields;
- lemma plus grammatical analysis;
- case/gender/number/agreement matching;
- ending or whole-form production;
- token ordering;
- sentence-frame slots;
- dictation;
- local record-and-compare for self-review.

Checking layers:

1. Unicode NFC and permitted whitespace/punctuation normalization;
2. tokenization against the controlled lexicon/template;
3. surface-form lookup returning every compatible morphological analysis;
4. comparison of requested semantic, syntactic, and feature bundles;
5. acceptance of enumerated variants;
6. targeted diagnostic of feature, government, word-order, or spelling mismatch.

Diacritics, `þ/ð`, and doubled consonants are never silently corrected when they
distinguish the target. An ASCII fallback may help the learner type characters
through an on-screen keyboard, but `th`, `d`, or unaccented vowels are not
accepted as correct Icelandic spelling.

### Numbers, dates, time, and currency policy

This broad app includes practical number language, but not unrestricted
arithmetic.

- Cardinal numbers `0–1,000,000`, ordinal numbers needed for dates/order, digit
  strings, clock time, durations, temperatures, and prices may appear.
- Numerals with gender/case agreement use reviewed paradigms and bounded noun
  frames.
- Telephone/identifier strings are read as declared digit groups, not quantities.
- Dates use unambiguous semantic ISO dates and localized Icelandic realization.
- Currency prompts use fictional amounts and the inflection of `króna` from the
  lexicon; they do not teach exchange rates or current prices.
- Exact numeric checking is separate from grammatical realization.

### Audio and speaking architecture

Listening is core, but the standalone app cannot rely on cloud speech services.

- Bundle licensed human recordings for all listening targets and representative
  speakers.
- Record words inside phrases as well as citation forms where connected speech
  matters.
- Normal and learner-slow recordings are distinct authored assets where
  available; playback-rate slowing is supplementary.
- Browser speech synthesis may provide optional extra exposure but is never the
  pronunciation oracle.
- Audio filenames, length, loudness, speaker, and replay limits must not leak the
  answer.
- Recording is opt-in, local, and discarded unless the learner explicitly
  downloads it.
- The app may show waveform/duration and alternate learner/reference playback,
  but it must not score open pronunciation automatically.
- No microphone permission is requested before a recording action.

### Scope

Included:

- alphabet, Unicode/input, common pronunciation-spelling correspondences,
  quantity/stress, and curated sound contrasts;
- contextual vocabulary, collocations, compounds, derivation, practical numbers,
  dates, time, prices, and interactional phrases;
- noun gender, case, number, definiteness, declension, possession, and governed
  noun phrases;
- adjective strength/degree/agreement; personal, demonstrative, possessive,
  reflexive, interrogative, and indefinite pronouns;
- verb classes/principal parts, person/number, present/past, perfect, modals,
  imperative, subjunctive, middle/passive, and case frames;
- main/subordinate clause order, inversion, negation, questions, relative
  clauses, comparisons, conjunctions, and existential/weather expressions;
- short reading, notices/messages, dialogue completion, listening, dictation,
  sentence construction, and guided speaking.

### Exclusions

Excluded:

- Old Norse, Old Icelandic, historical orthography, saga-language production,
  and manuscript reading;
- exhaustive morphology for the whole BÍN lexicon;
- unrestricted translation, chat, essay grading, or claims to accept every
  natural phrasing;
- advanced literary/academic/legal/medical language and interpreter training;
- exhaustive dialectology, sociophonetic grading, or one “correct accent”;
- unreviewed automatic sentence generation, dictionary scraping, or machine-
  translated examples;
- unrestricted compound invention or acceptance merely because a compound is
  structurally possible;
- cloud TTS/STT dependencies, automatic pronunciation scores, handwriting/OCR;
- citizenship, immigration, school, or professional-language test preparation;
- static word-list memorization as the dominant activity.

### Global answer conventions

- Surrounding whitespace is ignored; ordinary repeated internal whitespace may
  normalize when spacing is not assessed.
- Unicode canonically equivalent sequences normalize to NFC.
- Capitalization and punctuation normalize only when not targeted.
- Icelandic letters/diacritics remain semantically significant.
- Feature-analysis responses compare unordered feature sets; word-order and
  sentence-construction answers compare ordered typed tokens.
- A surface form with several analyses requires context or accepts all licensed
  analyses.
- Kana/romanization-style transliteration is not used. Optional IPA/learner
  pronunciation hints are display scaffolds, not spelling answers.
- English glosses are semantic prompts, not promises of one-to-one translation.
- Free-text answers are limited to lexicon/template-bounded forms.

### Difficulty philosophy

Difficulty increases through:

- moving from recognition to production;
- reducing gloss, paradigm, case, and agreement scaffolds;
- using less predictable but frequent paradigms;
- combining gender, case, number, definiteness, agreement, and government;
- moving from isolated forms to phrases, clauses, connected text, and audio;
- contrasting main/subordinate order and several semantic case frames;
- carrying reference/tense/register across sentences;
- accepting and comparing licensed variants.

Difficulty must not increase through obscure vocabulary, giant paradigms, tiny
text, arbitrary exception trivia, speed pressure, missing context, excessive
typing, unreviewed generated prose, or speech-recognition failure.

### Shared generation and rejection rules

Every instance must:

- declare lexicon/morphology/orthography/audio data versions;
- generate from semantic and feature structures;
- use only reviewed lexemes, paradigms, frames, collocations, and variants;
- retain provenance for forms and usage judgments;
- provide enough context for the intended case, agreement, word order, meaning,
  and register;
- accept all licensed equivalent responses;
- generate distractors by one named learner-error transformation;
- provide an independent paradigm/frame oracle.

Reject an instance when:

- a required paradigm form is missing, disputed, or outside the active learner
  profile;
- surface syncretism makes the requested analysis nonunique without context;
- more than one case/preposition/order is natural but only one is accepted;
- lexical substitution violates selectional or collocational constraints;
- a generated compound is possible but unattested/unreviewed for target use;
- orthography and audio disagree;
- a distractor is an accepted variant or creates another plausible context;
- the answer depends on dialect/accent preference;
- the prompt is effectively open translation;
- audio metadata leaks the label;
- a recent structural signature repeats with cosmetic vocabulary only.

## 2. Category: Alphabet, sound, spelling, and input

### Category purpose

Build accurate Icelandic decoding and typing while keeping letters, spellings,
phonological categories, and pronunciation variants distinct.

### Learn

Acute vowels, `þ`, `ð`, `æ`, and `ö` are full letters. Spelling does not encode
stress through acute marks, and modern sound does not uniquely determine every
spelling. Learn contrasts in reviewed words and environments.

### Common misconceptions

- Treating acute marks as optional stress symbols.
- Replacing both `þ` and `ð` with English `th`.
- Treating `æ` as `ae` or `ö` as `o` in Icelandic spelling.
- Assuming one letter always has one sound.
- Assuming identical modern sounds imply interchangeable spelling.
- Counting Unicode code points instead of linguistic units.

### Family `alphabet_letter_recognition`

**Task/purpose.** Identify/name/type an Icelandic letter in upper/lowercase.
**Response/template.** Letter/name/keyboard choice. **Derivation.** Pinned
alphabet registry. **Difficulty.** L1 shared Latin letters; L2 acute vowels and
`æ ö`; L3 `ð þ` and alphabet ordering. **Distractors/constraints.** Visual
neighbors/ASCII fallbacks; target is letter identity, not word pronunciation.
**Feedback.** Letter pair, name, input key. **Examples.** `Á→á` (L1);
identify `Æ` (L2); order `Ð E É` (L3). **Validation.** Exact 32-letter table.

### Family `thorn_eth_contrast`

**Task/purpose.** Distinguish/type `þ` and `ð` in reviewed words or audio.
**Response/template.** Letter slot/word choice. **Derivation.** Lexeme spelling
and licensed recording. **Difficulty.** L1 visual/keyboard; L2 word-internal
spelling; L3 audio with surrounding sounds. **Distractors/constraints.** Swap
letters or use `th/d`; do not teach a universal English-sound mapping.
**Feedback.** Highlight letter and word pronunciation. **Examples.** `þ` in
`þakka` (L1); `ð` in `maður` (L2); recorded-word contrast (L3).
**Validation.** Lexeme/audio alignment.

### Family `vowel_letter_contrast`

**Task/purpose.** Recognize/produce distinct Icelandic vowel letters and their
reviewed word spellings. **Response/template.** Letter/word/audio choice.
**Derivation.** Orthography and pronunciation-token registry.
**Difficulty.** L1 accented/unaccented visual; L2 `æ/ö`; L3 audio/word minimal
contrast. **Distractors/constraints.** Drop acute, treat acute as length only.
**Feedback.** Compare letter and broad sound values. **Examples.** `a/á` (L1);
`o/ó/ö` (L2); select spelling from recorded curated pair (L3).
**Validation.** Licensed contrast set.

### Family `spelling_sound_correspondence`

**Task/purpose.** Choose the reviewed broad pronunciation or spelling for a word
environment. **Response/template.** Audio/spelling/token choice.
**Derivation.** Apply environment rule plus lexeme exceptions.
**Difficulty.** L1 transparent word; L2 conditioned `g/k/l/r/n` pattern; L3
lexical exception. **Distractors/constraints.** Naïve one-letter-one-sound,
English phonics. **Feedback.** Mark grapheme environment and exception status.
**Examples.** curated initial consonant (L1); `ll` environment (L2); exceptional
loanword from reviewed list (L3). **Validation.** Rule/exception registry.

### Family `consonant_quantity_preaspiration`

**Task/purpose.** Distinguish consonant quantity/preaspiration in curated spelling
and audio items. **Response/template.** Word/audio choice or timing segmentation.
**Derivation.** Licensed pronunciation tokens and recordings.
**Difficulty.** L2 visual doubled consonant; L3 minimal listening; L4 combined
vowel/consonant cues. **Distractors/constraints.** English gemination model,
automatic phonetic transcription. **Feedback.** Annotated learner timeline.
**Examples.** single/double spelling pair (L2); preaspirated recording choice
(L3); dictation contrast (L4). **Validation.** Human-reviewed audio only.

### Family `word_stress_structure`

**Task/purpose.** Identify primary stress or segment a reviewed simple/compound
word into stress-bearing parts. **Response/template.** Syllable/compound-part
selection. **Derivation.** Lexeme pronunciation/stress annotation.
**Difficulty.** L1 simple native word; L2 loanword exception; L3 compound
primary/secondary pattern. **Distractors/constraints.** Acute=vowel stress,
English movable stress. **Feedback.** Display stress marks without changing
orthography. **Examples.** first-syllable simple word (L1); reviewed loan (L2);
two-part compound (L3). **Validation.** Curated stress data.

### Family `morphophonemic_spelling_change`

**Task/purpose.** Recognize a reviewed stem alternation across related inflected
forms. **Response/template.** Match/form choice. **Derivation.** Compare paradigm
forms and stored alternation tags. **Difficulty.** L2 one vowel/consonant
alternation; L3 alternation plus ending; L4 choose lemma from several forms.
**Distractors/constraints.** Copy invariant stem or overapply alternation.
**Feedback.** Align lemma stem and forms. **Examples.** one curated u-umlaut
pattern (L2); plural stem change (L3); principal-form comparison (L4).
**Validation.** Paradigm lookup, not productive guess.

### Family `orthographic_choice`

**Task/purpose.** Select the official spelling among homophonous/near-homophonous
or visually similar alternatives in context. **Response/template.** Word choice/
editing slot. **Derivation.** Contextual lexeme selection and spelling registry.
**Difficulty.** L1 diacritic; L2 `i/y` or doubled consonant; L3 context-dependent
lexeme. **Distractors/constraints.** Pronunciation-compatible misspelling,
unreviewed rare word. **Feedback.** Meaning plus canonical spelling.
**Examples.** restore missing acute (L1); choose reviewed `i/y` spelling (L2);
homophone resolved by sentence meaning (L3). **Validation.** Lexicon/context.

### Family `icelandic_keyboard_input`

**Task/purpose.** Enter Icelandic letters/words using on-screen or physical
keyboard support. **Response/template.** Typed text/key sequence.
**Derivation.** Compare NFC spelling; optionally display configured key map.
**Difficulty.** L1 one special letter; L2 mixed capitals/diacritics; L3 short
word dictation. **Distractors/constraints.** ASCII transliteration never scores
as spelling. **Feedback.** Show how to enter missed character.
**Examples.** type `þ` (L1); type `Ísland` (L2); type a recorded reviewed word
(L3). **Validation.** Browser/input normalization corpus.

### Family `sound_spelling_audit`

**Task/purpose.** Find one root letter, diacritic, Unicode, environment, stress,
or audio-label error. **Response/template.** Root/correction/effect.
**Derivation.** Compare orthography, lexeme, pronunciation, and audio metadata.
**Difficulty.** L2 spelling; L3 sound rule/exception; L4 normalization/audio
mismatch. **Distractors/constraints.** One root; dialect variants are never
faults. **Feedback.** Correct aligned representation. **Examples.** `á` reduced
to `a` (L2); regular rule applied to exception (L3); transcript/audio mismatch
(L4). **Validation.** Fault manifest.

### Cross-family progression

Letter identity and input precede word spelling. Curated sound correspondences
precede morphophonemics and listening contrasts. Audits preserve the separation
between written standard and acceptable pronunciation variation.

## 3. Category: Vocabulary, compounds, numbers, and practical language

### Category purpose

Build vocabulary as meaning, collocation, morphology, and communicative use—not
as isolated English–Icelandic pairs.

### Learn

Choose a word that fits the semantic frame and its grammatical behavior.
Compounds have reviewed structure and a head that normally determines word
class/gender. Number expressions may trigger agreement and case.

### Common misconceptions

- Select a cognate or English-looking word without checking meaning.
- Treat near-synonyms as interchangeable in every frame.
- Guess any mechanically possible compound as established usage.
- Assign compound gender from its first part.
- Leave `einn`–`fjórir` uninflected in agreement contexts.
- Translate greetings and requests word for word.

### Family `contextual_vocabulary`

**Task/purpose.** Choose/produce the reviewed word fitting a picture, semantic
frame, or short sentence. **Response/template.** Word choice/short text.
**Derivation.** Match semantic/selectional tags and inflect for supplied slot.
**Difficulty.** L1 concrete item/action; L2 adjective/adverb; L3 near-synonym.
**Distractors/constraints.** Same topic but wrong role/register/collocation.
**Feedback.** Meaning, lemma, and used form. **Examples.** select `borða` for
eating (L1); adjective in context (L2); motion verb contrast (L3).
**Validation.** Typed frame and lexicon.

### Family `collocation_choice`

**Task/purpose.** Select a conventional noun–verb, adjective–noun, or fixed
preposition combination. **Response/template.** Cloze/matching.
**Derivation.** Authored collocation registry with inflection realization.
**Difficulty.** L1 common phrase; L2 competing verbs; L3 register/meaning.
**Distractors/constraints.** Literal translation and semantically plausible but
unlicensed combination. **Feedback.** Show full phrase and gloss.
**Examples.** everyday verb+noun phrase (L1); adjective choice (L2); fixed
preposition phrase (L3). **Validation.** Reviewed collocation ID.

### Family `compound_decomposition`

**Task/purpose.** Split a reviewed compound into components and identify its head/
meaning relation. **Response/template.** Ordered parts/head selection.
**Derivation.** Stored compound parse. **Difficulty.** L1 two transparent parts;
L2 linking form; L3 lexicalized meaning. **Distractors/constraints.** Split by
arbitrary character sequence, assume fully compositional meaning.
**Feedback.** Component lemmas and head. **Examples.** two-noun compound (L1);
genitive/linking form (L2); lexicalized compound (L3). **Validation.** Compound
registry.

### Family `compound_form_gender`

**Task/purpose.** Choose the reviewed compound form and infer its grammatical
class/gender from the head. **Response/template.** Word plus gender/class.
**Derivation.** Apply stored compound form/head metadata.
**Difficulty.** L2 direct head; L3 linking alternation; L4 contrast unattested
mechanical candidate. **Distractors/constraints.** First-element gender,
unreviewed concatenation. **Feedback.** Head determines category; usage remains
lexical. **Examples.** head-gender choice (L2); linking form (L3); reject
unlicensed invention (L4). **Validation.** Reviewed entry only.

### Family `word_family_derivation`

**Task/purpose.** Match reviewed derivationally related nouns, adjectives, verbs,
or agent terms and identify meaning change. **Response/template.** Matching/
family tree. **Derivation.** Lexeme derivation links.
**Difficulty.** L2 transparent suffix; L3 stem alternation; L4 false morphological
lookalike. **Distractors/constraints.** Surface similarity alone.
**Feedback.** Lemma relationships and meanings. **Examples.** verb→noun (L2);
adjective→adverb (L3); unrelated lookalike (L4). **Validation.** Derivation graph.

### Family `cardinal_number_phrase`

**Task/purpose.** Read/write a bounded cardinal number and choose the licensed
numeral+noun form. **Response/template.** Number text/phrase fields.
**Derivation.** Deterministic number grammar plus reviewed agreement/case frame.
**Difficulty.** L1 0–20 invariant contexts; L2 tens/hundreds; L3 inflecting
`one–four` or compound final numeral. **Distractors/constraints.** Digit-by-digit
quantity reading, wrong gender/case. **Feedback.** Number decomposition and
agreement. **Examples.** `12` phrase (L1); `248` (L2); `21` with gendered noun
(L3). **Validation.** Bidirectional number grammar.

### Family `ordinal_date_expression`

**Task/purpose.** Interpret/produce ordinal numbers and calendar dates in a
controlled case/template. **Response/template.** Date selection/text.
**Derivation.** ISO date → reviewed month/ordinal realization.
**Difficulty.** L1 simple ordinal; L2 date; L3 preposition/case and year.
**Distractors/constraints.** Cardinal for ordinal, English month order, invalid
date. **Feedback.** Semantic date and phrase structure. **Examples.** first/
second (L1); one valid date (L2); date in sentence (L3). **Validation.** Calendar
and morphology oracle.

### Family `clock_duration_temperature`

**Task/purpose.** Interpret/produce clock time, duration, age, or temperature
from a declared frame. **Response/template.** Matching/structured phrase.
**Derivation.** Semantic quantity/time object → authored realization.
**Difficulty.** L1 full hour/simple duration; L2 minutes/half; L3 case/agreement
or negative temperature. **Distractors/constraints.** Clock versus duration,
quantity versus digit string. **Feedback.** Timeline/quantity and form.
**Examples.** 08:00 clock (L1); 2.5-hour duration (L2); below-zero temperature
(L3). **Validation.** Exact semantic parse.

### Family `price_digit_identifier`

**Task/purpose.** Distinguish and produce prices, quantities, telephone numbers,
addresses, and identifiers under declared grouping. **Response/template.**
Digits/phrase/matching. **Derivation.** Route semantic type to number or digit
grammar; prices use reviewed `króna` forms. **Difficulty.** L1 digit string;
L2 price; L3 mixed dialogue. **Distractors/constraints.** Read identifier as
cardinal quantity, wrong currency agreement. **Feedback.** Show grouping and
semantic type. **Examples.** phone digits (L1); 1/2/5 krónur phrase (L2);
address versus amount (L3). **Validation.** Type-specific grammar.

### Family `dialogue_act_phrase`

**Task/purpose.** Choose a natural reviewed greeting, thanks, apology, request,
clarification, or response for a supplied relationship/context.
**Response/template.** Dialogue completion/speech-act match.
**Derivation.** Match context and discourse-act tags.
**Difficulty.** L1 fixed greeting; L2 request/repair; L3 register/stance.
**Distractors/constraints.** Literal translation, correct grammar/wrong act,
cultural absolutes. **Feedback.** Explain function and context.
**Examples.** greeting by situation (L1); ask repetition (L2); soften request
(L3). **Validation.** Authored dialogue pair.

### Family `lexicon_practical_audit`

**Task/purpose.** Diagnose one semantic, collocational, compound, number-type,
agreement, date, or dialogue-act error. **Response/template.** Root/correction.
**Derivation.** Validate typed lexical and numeric frames.
**Difficulty.** L2 word/number; L3 compound/agreement; L4 pragmatic context.
**Distractors/constraints.** One root; valid variant is not a fault.
**Feedback.** Correct semantic frame and realization. **Examples.** false friend
(L2); compound head gender wrong (L3); response answers wrong dialogue act
(L4). **Validation.** Fault manifest.

### Cross-family progression

Contextual words and collocations precede productive phrase use. Compounds begin
with analysis, then limited reviewed production. Numbers progress from semantic
type to agreement-bearing phrases and practical interactions.

## 4. Category: Nouns, cases, definiteness, and prepositions

### Category purpose

Build reliable noun-phrase morphology and case selection from semantic and
lexical frames.

### Learn

Icelandic nouns have gender and inflect for four cases and two numbers. The
definite article is usually suffixed and inflects with the noun. Case can express
a role or be required by a verb/preposition, so learn words with their frames.

### Common misconceptions

- Guess gender from meaning or final letter alone.
- Treat nominative as a neutral form usable everywhere.
- Memorize one ending per case across all nouns.
- Attach an invariant definite suffix.
- Assume every subject is nominative and every object accusative.
- Map `in`, `on`, `to`, or `with` to one fixed Icelandic case.

### Family `noun_gender_identify`

**Task/purpose.** Identify a reviewed noun's grammatical gender from its entry,
forms, or agreement context. **Response/template.** Masculine/feminine/neuter.
**Derivation.** Lexeme gender plus contextual agreement evidence.
**Difficulty.** L1 canonical endings/cues; L2 less transparent; L3 plural/
syncretic form with context. **Distractors/constraints.** Natural sex or ending
heuristic; never demand inference from an ambiguous isolated form.
**Feedback.** Lemma, article/agreement example, paradigm cue.
**Examples.** `hestur`→masculine (L1); `kona`→feminine (L1); `barn`→neuter
(L1). **Validation.** Lexeme registry.

### Family `case_role_identify`

**Task/purpose.** Identify the case licensed by an explicit syntactic/semantic
role in a controlled clause. **Response/template.** Case choice plus role.
**Derivation.** Sentence frame assigns case feature.
**Difficulty.** L1 nominative subject/accusative object; L2 recipient/instrument/
possession; L3 non-nominative subject frame. **Distractors/constraints.** English
word order, nominative=doer. **Feedback.** Mark predicate and roles.
**Examples.** canonical subject→nominative (L1); recipient frame→dative (L2);
reviewed experiencer subject case (L3). **Validation.** Frame assignment.

### Family `noun_case_form`

**Task/purpose.** Produce/select a noun form for lemma, case, number, and
definiteness. **Response/template.** Whole-form text/choice.
**Derivation.** Exact paradigm lookup by feature bundle.
**Difficulty.** L1 frequent regular singular; L2 plural/definite; L3 stem
alternation/irregular. **Distractors/constraints.** Ending swap, invariant stem,
wrong definiteness. **Feedback.** Paradigm cell and phrase example.
**Examples.** `hestur`, acc.sg.indef→`hest` (L1); dative definite form (L2);
reviewed irregular plural (L3). **Validation.** BÍN-Core-derived local paradigm.

### Family `noun_number_form`

**Task/purpose.** Transform a noun phrase between singular and plural while
preserving case/definiteness and compatible meaning.
**Response/template.** Whole phrase. **Derivation.** Change number feature and
realize all linked forms. **Difficulty.** L1 noun only; L2 definite; L3 phrase
agreement/irregular plural. **Distractors/constraints.** Change case, add plural
suffix mechanically. **Feedback.** Before/after feature bundles.
**Examples.** singular→plural common noun (L1); definite plural (L2); adjective+
noun plural (L3). **Validation.** Agreement graph.

### Family `definite_suffix`

**Task/purpose.** Add/remove suffixed definiteness from a reviewed noun form
without changing case/number. **Response/template.** Whole form and feature
analysis. **Derivation.** Paradigm lookup, not string concatenation.
**Difficulty.** L1 common nominatives; L2 oblique/plural; L3 morphophonemic
interaction. **Distractors/constraints.** One invariant `-inn`, accidental case
change, invent indefinite article. **Feedback.** Align indefinite/definite cells.
**Examples.** `hestur→hesturinn` (L1); `kona→konan` (L1); `barn→barnið` (L1).
**Validation.** Paired paradigm cells.

### Family `noun_paradigm_complete`

**Task/purpose.** Complete selected missing cells in a compact noun paradigm.
**Response/template.** Multiple named form fields. **Derivation.** Retrieve exact
cells and hide a pedagogically coherent subset. **Difficulty.** L2 one case
contrast; L3 singular/plural; L4 indefinite/definite with alternation.
**Distractors/constraints.** Never ask all 16 cells as rote tedium; syncretic
forms accepted in each licensed cell. **Feedback.** Reveal pattern groups.
**Examples.** nom/acc singular pair (L2); four plural cases (L3); selected
definite cells (L4). **Validation.** Paradigm completeness.

### Family `preposition_case_government`

**Task/purpose.** Choose the case/form required by a reviewed preposition frame.
**Response/template.** Preposition+case or inflected complement.
**Derivation.** Lookup preposition sense/frame and realize noun phrase.
**Difficulty.** L1 fixed-case `frá/til/um` frames; L2 two-case preposition with
context; L3 idiomatic frame. **Distractors/constraints.** English preposition
mapping, globally assign one case to a polysemous preposition.
**Feedback.** Name frame, meaning, and governed case. **Examples.** `frá`+
dative (L1); `til`+genitive (L1); selected `með` sense (L3). **Validation.**
Government registry.

### Family `motion_location_case`

**Task/purpose.** Choose accusative/dative in an authored `í/á` motion-versus-
location contrast. **Response/template.** Case/form or paired sentence.
**Derivation.** Semantic path endpoint versus static-location frame assigns case.
**Difficulty.** L1 clear go/be pair; L2 less direct motion; L3 reject lexical
exception/idiom outside productive contrast. **Distractors/constraints.** Verb
alone decides, all motion=accusative in every preposition. **Feedback.** Scene
diagram and case. **Examples.** go into a place→accusative (L1); be in place→
dative (L1); curated contrast with same noun (L2). **Validation.** Paired frame.

### Family `possessive_genitive_phrase`

**Task/purpose.** Build/interpret a simple genitive possession/association phrase.
**Response/template.** Ordered noun phrase/meaning match.
**Derivation.** Head noun plus genitive dependent from exact paradigm.
**Difficulty.** L2 one proper/common possessor; L3 definite/plural; L4 ambiguity
resolved by context. **Distractors/constraints.** English apostrophe/order,
possessor nominative. **Feedback.** Head versus dependent graph.
**Examples.** reviewed `X of Y` phrase (L2); plural possessor (L3); possessive
pronoun contrast (L4). **Validation.** Dependency features.

### Family `quantity_noun_case`

**Task/purpose.** Choose a noun phrase after a reviewed numeral/quantity/
measurement expression. **Response/template.** Numeral+noun form.
**Derivation.** Quantity-frame feature rules plus noun paradigm.
**Difficulty.** L2 common cardinal; L3 inflecting numeral; L4 partitive/
measurement expression. **Distractors/constraints.** One invariant plural,
English numeral agreement. **Feedback.** Quantity structure and forms.
**Examples.** two with gendered noun (L2); twenty-one agreement (L3); reviewed
amount expression (L4). **Validation.** Number and noun grammar.

### Family `verb_object_case`

**Task/purpose.** Select/produce an object/complement in the case lexically
governed by a reviewed verb. **Response/template.** Case/form choice.
**Derivation.** Verb sense selects case frame and compatible argument.
**Difficulty.** L2 accusative versus dative; L3 genitive or multiple arguments;
L4 same lemma/different sense frame. **Distractors/constraints.** All direct
objects accusative, English semantics. **Feedback.** Store verb with its frame.
**Examples.** common accusative verb (L2); dative-governing verb (L3); sense
contrast (L4). **Validation.** Lexeme case frame.

### Family `noun_phrase_case_transform`

**Task/purpose.** Transform a whole determiner/adjective/noun phrase to a requested
case while preserving number, definiteness, and meaning.
**Response/template.** Whole phrase/linked fields.
**Derivation.** Change case feature across agreement graph and realize all forms.
**Difficulty.** L2 article+noun; L3 adjective phrase; L4 demonstrative/
irregular forms. **Distractors/constraints.** Change noun only, wrong adjective
strength. **Feedback.** Feature agreement matrix. **Examples.** nominative→
accusative phrase (L2); dative definite phrase (L3); plural transformation (L4).
**Validation.** Agreement and paradigm oracle.

### Family `noun_case_audit`

**Task/purpose.** Diagnose one gender, case, number, definiteness, government,
agreement, or syncretism error. **Response/template.** Root/correction/
explanation. **Derivation.** Validate frame then feature graph then forms.
**Difficulty.** L2 noun cell; L3 preposition/verb government; L4 whole phrase.
**Distractors/constraints.** One root; an accepted syncretic analysis is not
wrong. **Feedback.** Correct semantic-to-form chain. **Examples.** wrong definite
cell (L2); `til` complement not genitive (L3); noun changed case but adjective
did not (L4). **Validation.** Fault manifest.

### Cross-family progression

Gender and role recognition precede production. Whole forms precede compact
paradigms. Fixed government precedes two-case prepositions, then full phrase
transformations and audits.

## 5. Category: Adjectives, pronouns, determiners, and agreement

### Category purpose

Train agreement across gender, case, number, definiteness/strength, degree, and
reference.

### Learn

Adjective form depends on the noun phrase's features and whether the strong or
weak paradigm is licensed. Pronouns carry case and reference features.
Possessive/reflexive forms agree with the possessed noun where the paradigm
requires, not with the possessor.

### Common misconceptions

- Use masculine nominative adjective form as invariant dictionary form.
- Choose weak/strong inflection from meaning alone.
- Make only the noun agree.
- Treat comparative and superlative as one suffix for every adjective.
- Use subject pronoun forms as objects.
- Make possessives agree with the possessor.
- Use reflexive `sinn/sig` without checking antecedent and clause.

### Family `adjective_agreement_form`

**Task/purpose.** Produce/select an adjective matching a noun's gender, case,
number, and strength. **Response/template.** Whole adjective/phrase.
**Derivation.** Follow agreement link to exact adjective paradigm cell.
**Difficulty.** L1 masc/fem/neut nominative; L2 oblique/plural; L3 irregular/
stem alternation. **Distractors/constraints.** Dictionary form invariant, one
feature correct only. **Feedback.** Feature bundle and paradigm cell.
**Examples.** `góður` masculine nominative (L1); `gott` neuter nominative (L1);
oblique plural reviewed form (L3). **Validation.** Agreement oracle.

### Family `adjective_strong_weak`

**Task/purpose.** Choose and realize strong versus weak adjective inflection in
an authored definite/indefinite/determiner frame. **Response/template.** Paradigm
choice plus phrase. **Derivation.** Noun-phrase construction licenses strength;
then lookup features. **Difficulty.** L2 indefinite versus definite; L3
demonstrative/possessive frame; L4 exceptional/lexicalized phrase.
**Distractors/constraints.** Definite noun always same surface adjective, copy
English article logic. **Feedback.** NP structure and strength.
**Examples.** indefinite `góður maður` (L2); definite `góði maðurinn` (L2);
curated determiner phrase (L3). **Validation.** Template/strength registry.

### Family `predicative_adjective_agreement`

**Task/purpose.** Make a predicative adjective agree with its subject.
**Response/template.** Clause slot/whole form. **Derivation.** Link predicative
complement features to subject under authored copular frame.
**Difficulty.** L1 singular genders; L2 plural/mixed semantic groups as curated;
L3 noncanonical subject order. **Distractors/constraints.** Weak form after
copula, nearest noun agreement. **Feedback.** Subject→predicate agreement link.
**Examples.** neuter subject→neuter adjective (L1); plural subject (L2);
fronted predicate clause (L3). **Validation.** Syntax/agreement graph.

### Family `adjective_degree`

**Task/purpose.** Form/interpret positive, comparative, and superlative adjective
forms with appropriate agreement/strength. **Response/template.** Form/ordered
degree/matching. **Derivation.** Exact degree paradigm and comparison frame.
**Difficulty.** L1 regular recognition; L2 inflected superlative; L3 irregular
comparison. **Distractors/constraints.** Add one suffix mechanically, confuse
adverb/adjective form. **Feedback.** Degree ladder and phrase.
**Examples.** positive→comparative common adjective (L1); definite superlative
(L2); `góður→betri→bestur` (L3). **Validation.** Paradigm relation.

### Family `personal_pronoun_case`

**Task/purpose.** Select/produce a personal pronoun for person, number, and case
in a controlled frame. **Response/template.** Pronoun/feature analysis.
**Derivation.** Role/government assigns case; exact pronoun paradigm lookup.
**Difficulty.** L1 subject forms; L2 objects/after preposition; L3
non-nominative subject or syncretism. **Distractors/constraints.** English-style
subject/object only, use nominative everywhere. **Feedback.** Person/reference
and case frame. **Examples.** `ég` subject (L1); object form (L2); dative
experiencer pronoun (L3). **Validation.** Pronoun paradigm.

### Family `demonstrative_determiner_agreement`

**Task/purpose.** Choose/inflect a reviewed demonstrative/determiner with its
noun phrase. **Response/template.** Whole phrase/linked fields.
**Derivation.** Discourse selection plus agreement feature realization.
**Difficulty.** L2 proximal/distal and gender; L3 oblique/plural; L4 discourse
contrast. **Distractors/constraints.** English invariant `this/that`, partial
agreement. **Feedback.** Reference and feature matrix.
**Examples.** this masculine noun (L2); that neuter oblique (L3); contrast two
referents (L4). **Validation.** Determiner paradigm/frame.

### Family `possessive_agreement`

**Task/purpose.** Inflect a possessive adjective/pronoun with the possessed noun
and identify the possessor separately. **Response/template.** Whole phrase/
feature matching. **Derivation.** Possessor selects lexeme/person; possessed noun
supplies agreement features. **Difficulty.** L2 singular noun; L3 oblique/plural;
L4 possessive placement/definiteness template. **Distractors/constraints.**
Agreement with possessor, use genitive phrase without requested construction.
**Feedback.** Two arrows: possessor identity, possessed-noun agreement.
**Examples.** `bókin mín` type frame (L2); plural possessed noun (L3); contextual
word order (L4). **Validation.** Reference/agreement graph.

### Family `reflexive_pronoun_possessive`

**Task/purpose.** Choose between reflexive/nonreflexive object or possessive forms
from clause antecedence. **Response/template.** Pronoun choice/reference link.
**Derivation.** Apply authored local-clause binding/reference constraints and
agreement. **Difficulty.** L2 clear same/different referent; L3 oblique reflexive;
L4 embedded clause boundary. **Distractors/constraints.** Choose by English
translation or nearest noun. **Feedback.** Draw antecedent link and clause scope.
**Examples.** subject owns own item→reflexive possessive (L2); another person's
item→nonreflexive (L2); embedded contrast (L4). **Validation.** Template binding
oracle.

### Family `interrogative_indefinite_form`

**Task/purpose.** Select/inflect reviewed interrogative or indefinite pronouns/
determiners in a semantic case frame. **Response/template.** Form/meaning match.
**Derivation.** Question/quantification semantics plus paradigm lookup.
**Difficulty.** L2 who/what case forms; L3 some/any/no series; L4 agreement/
polarity context. **Distractors/constraints.** Nominative citation form, English
one-to-one mapping. **Feedback.** Meaning, scope, and case.
**Examples.** who as subject (L2); whom after governed preposition (L3); selected
indefinite under negation (L4). **Validation.** Lexeme/frame registry.

### Family `agreement_reference_audit`

**Task/purpose.** Diagnose one adjective strength/degree, pronoun case,
possessive agreement, reflexive reference, or determiner error.
**Response/template.** Root/correction/meaning effect. **Derivation.** Validate
NP/clause feature and reference graphs. **Difficulty.** L2 one agreement feature;
L3 strength/reference; L4 embedded/whole phrase. **Distractors/constraints.**
One root; contextually different forms explained, not simply rejected.
**Feedback.** Correct links and forms. **Examples.** adjective agrees only in
gender (L2); possessive agrees with possessor (L3); reflexive crosses wrong
clause boundary (L4). **Validation.** Fault manifest.

### Cross-family progression

Simple adjective agreement precedes strong/weak and degree. Personal and
demonstrative paradigms precede possessive/reflexive reference. Audits combine
form agreement with discourse reference only at later levels.

## 6. Category: Verbs, case frames, and clause structure

### Category purpose

Build accurate verb morphology and Icelandic clause order from person, tense,
mood, voice, case government, and information structure.

### Learn

Learn a verb with its principal parts and argument cases. In main clauses the
finite verb occupies the controlled second-position pattern; fronting something
other than the subject changes subject placement. Subordinate clauses use
authored order templates.

### Common misconceptions

- Infer every past form from the infinitive with one suffix.
- Ignore person/number because English has little agreement.
- Use an infinitive where a finite verb is required.
- Treat the supine/past participle as one invariant “past form.”
- Make all objects accusative and all subjects nominative.
- Keep subject–verb order after fronting another constituent.
- Put `ekki` in one fixed position in every clause.
- Treat middle `-st`, reflexive meaning, and passive as identical.

### Family `verb_class_principal_parts`

**Task/purpose.** Classify a reviewed verb's learning paradigm and match its
principal parts. **Response/template.** Class/matching table.
**Derivation.** Lexeme inflection-class/principal-part registry.
**Difficulty.** L1 frequent weak patterns; L2 strong pattern; L3 irregular or
lookalike. **Distractors/constraints.** Infinitive ending alone, English cognate.
**Feedback.** Show forms used to predict/remember the paradigm.
**Examples.** reviewed weak verb (L1); strong verb (L2); irregular `vera`-type
entry (L3). **Validation.** Lexeme metadata.

### Family `present_person_number`

**Task/purpose.** Produce/select a present indicative verb form agreeing with
person and number. **Response/template.** Whole form/clause slot.
**Derivation.** Exact paradigm lookup. **Difficulty.** L1 singular common verb;
L2 plural; L3 stem alternation/irregular. **Distractors/constraints.** Third
person for every subject, append pronoun/ending mechanically. **Feedback.**
Subject features→verb cell. **Examples.** first singular common verb (L1);
second plural (L2); irregular present (L3). **Validation.** Paradigm/agreement.

### Family `past_tense_form`

**Task/purpose.** Produce/select past indicative forms from reviewed paradigms.
**Response/template.** Whole form/tense transformation.
**Derivation.** Lookup tense/person/number bundle and principal parts.
**Difficulty.** L1 frequent weak past; L2 strong ablaut; L3 irregular/person
alternation. **Distractors/constraints.** Universal dental suffix, use supine.
**Feedback.** Principal-part relation and paradigm cell.
**Examples.** weak past form (L1); strong past singular/plural contrast (L2);
irregular (L3). **Validation.** Paradigm lookup.

### Family `perfect_supine`

**Task/purpose.** Build/interpret a selected perfect construction with finite
`hafa` and the verb's supine. **Response/template.** Auxiliary+nonfinite slots/
ordered phrase. **Derivation.** Inflect auxiliary for subject; retrieve exact
supine; apply template semantics. **Difficulty.** L2 present perfect; L3 past
perfect; L4 contrast finite past. **Distractors/constraints.** Past participle
agreement where supine is required, leave auxiliary infinitive.
**Feedback.** Separate tense-bearing auxiliary and lexical form.
**Examples.** `ég hef ...` frame (L2); plural auxiliary (L3); simple-past versus
perfect context (L4). **Validation.** Construction AST.

### Family `modal_infinitive`

**Task/purpose.** Choose/inflect a modal/phase verb and compatible infinitive in
a controlled meaning. **Response/template.** Two slots/dialogue completion.
**Derivation.** Context selects modal sense; finite modal agrees; complement
uses licensed infinitive/particle structure. **Difficulty.** L1 can/want; L2
must/need; L3 polarity/tense and case frame. **Distractors/constraints.** Both
verbs finite, English modal one-to-one mapping. **Feedback.** Modal meaning and
verb chain. **Examples.** ability+infinitive (L1); obligation contrast (L2);
negative past modal (L3). **Validation.** Verb-chain template.

### Family `imperative_request`

**Task/purpose.** Form/interpret reviewed imperatives and polite/request
constructions appropriate to context. **Response/template.** Form/dialogue-act
choice. **Derivation.** Exact imperative paradigm plus request template.
**Difficulty.** L1 common singular instruction; L2 plural/polite softening; L3
negative/irregular. **Distractors/constraints.** Infinitive as command, assume
one form fits every relationship. **Feedback.** Form and pragmatic force.
**Examples.** simple instruction (L1); softened request (L2); negative command
(L3). **Validation.** Paradigm/context registry.

### Family `subjunctive_form_use`

**Task/purpose.** Recognize/produce selected present/past subjunctive forms in
authored wish, reported, hypothetical, or subordinate contexts.
**Response/template.** Mood/form choice or clause slot.
**Derivation.** Context licenses mood; paradigm realizes features.
**Difficulty.** L2 recognition contrast; L3 present production; L4 past
hypothetical/reported sequence. **Distractors/constraints.** Indicative based
only on factual English gloss, use subjunctive everywhere after one conjunction.
**Feedback.** Mood trigger/meaning and form. **Examples.** reviewed wish frame
(L2); subordinate mood contrast (L3); hypothetical (L4). **Validation.** Authored
mood template.

### Family `middle_st_construction`

**Task/purpose.** Interpret/produce a reviewed lexical, reciprocal, change-of-
state, or middle `-st` verb construction. **Response/template.** Meaning/form
match. **Derivation.** Use a lexeme/construction entry with exact middle forms.
**Difficulty.** L2 lexicalized common verb; L3 active/middle meaning contrast;
L4 tense/person form. **Distractors/constraints.** Strip/add `-st` mechanically,
call every form passive/reflexive. **Feedback.** Entry-specific semantics.
**Examples.** common lexical `-st` verb (L2); reciprocal sense (L3); active/
middle contrast (L4). **Validation.** Middle-lexeme registry.

### Family `passive_construction`

**Task/purpose.** Build/interpret selected `vera/verða` passive constructions
and distinguish them from active/middle frames. **Response/template.** Clause
choice/ordered slots. **Derivation.** Select passive semantics, inflect auxiliary,
and realize participle/agreement per template. **Difficulty.** L2 present passive
recognition; L3 tense/agreement; L4 eventive/stative contrast if authored.
**Distractors/constraints.** Use `-st` automatically, leave participle citation
form. **Feedback.** Role mapping and auxiliary/participle structure.
**Examples.** active→passive role match (L2); plural agreement (L3); selected
auxiliary contrast (L4). **Validation.** Construction/agreement oracle.

### Family `verb_argument_case_frame`

**Task/purpose.** Complete a verb's subject/object/complement forms from its
reviewed case frame. **Response/template.** Multiple phrase slots/case labels.
**Derivation.** Verb sense assigns roles/cases; noun/pronoun paradigms realize.
**Difficulty.** L2 nominative+accusative; L3 dative/genitive or non-nominative
subject; L4 two same-lemma senses. **Distractors/constraints.** Position=case,
all subjects nominative. **Feedback.** Predicate-role-case diagram.
**Examples.** canonical transitive frame (L2); experiencer frame (L3); sense
switch changes case/meaning (L4). **Validation.** Case-frame registry.

### Family `main_clause_v2`

**Task/purpose.** Order a main declarative clause so the finite verb occupies the
licensed second constituent position. **Response/template.** Token/chunk
ordering. **Derivation.** Choose one fronted constituent, then place finite verb
and remaining typed constituents. **Difficulty.** L1 subject first; L2 time/place
fronting; L3 object/adverb fronting with pronouns. **Distractors/constraints.**
English SVO after fronting, count orthographic words rather than constituents.
**Feedback.** Number constituent fields and finite verb.
**Examples.** subject–verb clause (L1); `Í dag`+verb+subject (L2); object-fronted
controlled clause (L3). **Validation.** Syntax tree linearization.

### Family `negation_adverb_order`

**Task/purpose.** Place `ekki` or a selected sentence adverb correctly in main/
question/subordinate templates. **Response/template.** Chunk ordering or slot.
**Derivation.** Clause-type linearization rules.
**Difficulty.** L2 main clause; L3 inversion/question; L4 subordinate contrast.
**Distractors/constraints.** English pre-verbal negation or one fixed Icelandic
position. **Feedback.** Mark finite verb, subject, and adverb.
**Examples.** main subject-first clause (L2); fronted clause (L3); subordinate
order (L4). **Validation.** Template order set.

### Family `question_word_order`

**Task/purpose.** Build/interpret yes/no and wh-questions with licensed case and
finite-verb order. **Response/template.** Ordered chunks/question-response match.
**Derivation.** Select question frame, interrogative role/case, and linearization.
**Difficulty.** L1 yes/no; L2 subject/object wh; L3 prepositional/case question.
**Distractors/constraints.** Declarative order, nominative wh-form regardless of
role. **Feedback.** Unknown role and V placement.
**Examples.** finite verb first yes/no (L1); who/what role contrast (L2);
governed-preposition question (L3). **Validation.** Question-frame oracle.

### Family `information_structure_order`

**Task/purpose.** Choose among licensed main-clause orders to satisfy a supplied
topic/focus/context while preserving core meaning. **Response/template.**
Context→sentence match/multiple accepted orders. **Derivation.** Authored
discourse conditions select canonical and accepted V2 linearizations.
**Difficulty.** L2 neutral subject-first; L3 temporal/object fronting; L4 several
grammatical orders with nuance. **Distractors/constraints.** One “free word
order” claim or reject all non-SVO. **Feedback.** Separate grammaticality from
discourse fit. **Examples.** neutral answer (L2); time-topic fronting (L3);
contrastive object (L4). **Validation.** Accepted realization set.

### Family `verb_clause_audit`

**Task/purpose.** Diagnose one paradigm, agreement, nonfinite, mood, voice,
case-frame, V2, negation, or question-order error.
**Response/template.** Root/correction/meaning effect. **Derivation.** Validate
semantic frame→verb features→arguments→linearization.
**Difficulty.** L2 one verb form; L3 case/order; L4 voice/mood/embedded context.
**Distractors/constraints.** One root; accepted information-structure variants
are not faults. **Feedback.** Correct dependency path.
**Examples.** wrong person ending (L2); time fronted but subject kept before verb
(L3); middle form interpreted as generic passive (L4). **Validation.** Fault
manifest.

### Cross-family progression

Principal parts precede finite tense forms. Perfect/modal chains precede
subjunctive/voice constructions. Verb case frames connect morphology to syntax.
Subject-first V2 precedes fronting, negation, questions, and discourse variants.

## 7. Category: Connected grammar, reading, listening, and interaction

### Category purpose

Integrate morphology and clause structure into short connected meanings and
realistic receptive/productive tasks.

### Learn

Connected language requires more than correct endings: clauses express time,
cause, condition, comparison, reference, and discourse relations. Read/listen
for the semantic frame and links before resolving every form.

### Common misconceptions

- Use main-clause word order unchanged in every subordinate clause.
- Treat `sem` as an inflected relative pronoun.
- Resolve a pronoun to the nearest noun regardless of agreement/discourse.
- Translate conjunctions one-to-one without relation/context.
- Answer from one keyword rather than the whole message.
- Treat listening transcript memory as pronunciation skill.

### Family `relative_clause`

**Task/purpose.** Combine/interpret clauses with a reviewed `sem` relative
construction and resolve the missing role from context.
**Response/template.** Clause ordering/reference match.
**Derivation.** Build head noun plus relative template; retain role/case frame
inside clause without inflecting `sem`. **Difficulty.** L2 subject relative;
L3 object/prepositional role; L4 ambiguity/reference.
**Distractors/constraints.** Inflect `sem`, duplicate resumptive noun, English
relative-pronoun case. **Feedback.** Draw head→gap link.
**Examples.** person who arrives (L2); object relative (L3); governed role (L4).
**Validation.** Dependency template.

### Family `subordinate_clause_order`

**Task/purpose.** Order a finite subordinate clause after an authored
complementizer/relative/conjunction. **Response/template.** Chunk ordering.
**Derivation.** Apply clause-type order set including subject, finite verb,
negation/adverb, and complements. **Difficulty.** L2 simple `að`; L3 negation;
L4 contrast with main-clause fronting. **Distractors/constraints.** Copy V2
surface order blindly, English order. **Feedback.** Main/subordinate comparison.
**Examples.** complement clause (L2); subordinate with `ekki` (L3); embedded
relative (L4). **Validation.** Syntax linearizer.

### Family `conjunction_relation`

**Task/purpose.** Choose a reviewed connector expressing addition, sequence,
cause, contrast, purpose, or condition. **Response/template.** Cloze/relation
match. **Derivation.** Discourse relation and clause-type constraints select
connector. **Difficulty.** L1 addition/contrast; L2 cause/sequence; L3 condition/
subordination/register. **Distractors/constraints.** English gloss match with
wrong logical relation/order. **Feedback.** Name relation and show clause
structure. **Examples.** `og/en` contrast (L1); reason connector (L2);
conditional (L3). **Validation.** Discourse-template registry.

### Family `comparison_quantity`

**Task/purpose.** Build/interpret equality, comparative, superlative, and
quantity-comparison constructions. **Response/template.** Phrase/clause slots.
**Derivation.** Choose comparison frame; realize degree, standard, case, and
agreement. **Difficulty.** L2 adjective comparison; L3 more/less/as; L4
irregular degree/quantified comparison. **Distractors/constraints.** Wrong
degree or standard marker, English word order. **Feedback.** Compared dimension
and forms. **Examples.** X is bigger than Y (L2); equal comparison (L3);
superlative in group (L4). **Validation.** Comparison frame.

### Family `existential_weather_impersonal`

**Task/purpose.** Interpret/complete reviewed existential, weather, and
impersonal/experiencer expressions. **Response/template.** Clause slot/meaning
match. **Derivation.** Authored construction assigns expletive, agreement, and
case roles. **Difficulty.** L1 weather/existence; L2 quantity/agreement; L3
experiencer case. **Distractors/constraints.** Translate English `it/there`
literally, force nominative experiencer. **Feedback.** Construction role diagram.
**Examples.** simple weather expression (L1); `there are` quantity frame (L2);
reviewed experiencer clause (L3). **Validation.** Construction registry.

### Family `controlled_sentence_construction`

**Task/purpose.** Construct one natural sentence from a semantic scene using
bounded lexemes and feature/word-order slots. **Response/template.** Structured
sentence builder. **Derivation.** Realize semantic roles, government, agreement,
verb features, and accepted linearizations. **Difficulty.** L1 one present
clause; L2 adjective/preposition/past; L3 subordinate/voice/reference.
**Distractors/constraints.** No unrestricted translation; all accepted
realizations enumerated. **Feedback.** Semantic-to-syntax tree.
**Examples.** describe location (L1); narrate past action (L2); give reason
(L3). **Validation.** Generator/parser round-trip.

### Family `short_reading_comprehension`

**Task/purpose.** Answer gist/detail/inference questions about a reviewed
2–8-sentence microtext. **Response/template.** Choice/matching/ordered events.
**Derivation.** Text content graph and entailed question predicates.
**Difficulty.** L1 explicit detail; L2 reference/sequence; L3 simple inference
requiring two facts. **Distractors/constraints.** Keyword overlap, outside-world
knowledge, unsupported cultural inference. **Feedback.** Highlight evidence.
**Examples.** locate stated time (L1); resolve pronoun (L2); combine reason and
result (L3). **Validation.** Entailment annotations and human review.

### Family `notice_message`

**Task/purpose.** Interpret a short sign, timetable, invitation, text message,
email excerpt, or instruction. **Response/template.** Action/detail choice.
**Derivation.** Authored communicative intent and fact fields.
**Difficulty.** L1 sign/fixed instruction; L2 schedule/change; L3 polite
implication or several constraints. **Distractors/constraints.** Real private
data, legal/medical emergency advice. **Feedback.** Genre, intent, decisive
phrase. **Examples.** opening information (L1); changed appointment (L2);
invitation response requirement (L3). **Validation.** Authored document schema.

### Family `dialogue_completion`

**Task/purpose.** Select/produce the next bounded turn matching meaning, grammar,
register, and dialogue act. **Response/template.** Turn choice/frame slots.
**Derivation.** Dialogue-state transition and response-act registry.
**Difficulty.** L1 greeting/basic answer; L2 request/clarification; L3 indirect
accept/refuse/repair. **Distractors/constraints.** Grammatically valid but wrong
act/referent/tense. **Feedback.** Show expected conversational function.
**Examples.** answer a yes/no question (L1); ask for repetition (L2); respond to
suggestion (L3). **Validation.** Dialogue graph.

### Family `reference_ellipsis_resolution`

**Task/purpose.** Resolve pronouns, possessives, omitted understood material, or
discourse referents in a short text/dialogue. **Response/template.** Reference
link/missing phrase choice. **Derivation.** Agreement, binding, semantics, and
discourse annotations. **Difficulty.** L2 one pronoun; L3 two candidates;
L4 reflexive/ellipsis across turns. **Distractors/constraints.** Nearest noun,
gender agreement alone. **Feedback.** Evidence arrows.
**Examples.** personal pronoun referent (L2); possessive antecedent (L3);
elliptical reply (L4). **Validation.** Reference graph.

### Family `listening_form_discrimination`

**Task/purpose.** Distinguish reviewed word/inflection/phrase forms in human
recordings. **Response/template.** Audio→form/meaning choice.
**Derivation.** Audio asset links to exact morphological and semantic target.
**Difficulty.** L1 distinct words; L2 close vowel/consonant or ending; L3 same
stem/different feature in phrase context. **Distractors/constraints.** Speaker/
duration leakage, dialect as error. **Feedback.** Replay with transcript and
feature highlight. **Examples.** vowel contrast (L1); singular/plural ending
(L2); case form in phrase (L3). **Validation.** Multi-speaker balance and asset
audit.

### Family `listening_dictation`

**Task/purpose.** Type a reviewed word, phrase, or short sentence from audio.
**Response/template.** Icelandic text. **Derivation.** Compare canonical/
accepted transcript after target-sensitive normalization.
**Difficulty.** L1 word; L2 phrase with inflection; L3 sentence with punctuation
optional unless targeted. **Distractors/constraints.** Do not accept ASCII for
Icelandic letters, no synthetic concatenation. **Feedback.** Token-by-token
audio/transcript alignment. **Examples.** common word (L1); noun phrase (L2);
short message sentence (L3). **Validation.** Human transcript/audio pair.

### Family `listening_comprehension`

**Task/purpose.** Answer gist/detail/sequence/intent questions after a short
recorded utterance/dialogue. **Response/template.** Choice/matching/timeline.
**Derivation.** Audio script fact/discourse graph.
**Difficulty.** L1 one explicit fact; L2 two-turn reference; L3 implication
supported by wording. **Distractors/constraints.** Transcript not shown before
answer, no background-noise gimmick. **Feedback.** Replay decisive segment and
then reveal transcript. **Examples.** destination (L1); changed plan (L2);
speaker intent (L3). **Validation.** Entailment and audio coverage.

### Family `guided_speaking_shadowing`

**Task/purpose.** Rehearse a fixed phrase/sentence by shadowing, reading aloud,
or filling one spoken slot, with self-review. **Response/template.** Local
record/playback/self-assessment. **Derivation.** Select licensed reference asset
and displayed semantic/feature target. **Difficulty.** L1 fixed phrase; L2
inflected substitution; L3 short two-turn response. **Distractors/constraints.**
No automatic correctness/pronunciation score; recording optional/local.
**Feedback.** Reference transcript, slow model if authored, checklist.
**Examples.** greeting (L1); substitute noun/adjective form (L2); answer prompt
(L3). **Validation.** Permission/privacy and asset checks.

### Family `connected_language_audit`

**Task/purpose.** Diagnose one relation, subordinate order, reference, genre,
audio/transcript, or unsupported-comprehension error across connected material.
**Response/template.** Root/correction/evidence.
**Derivation.** Validate discourse graph, syntax, morphology, text/audio, and
question entailment in dependency order. **Difficulty.** L2 clause; L3 text/
dialogue; L4 cross-modal ambiguity. **Distractors/constraints.** One root; valid
interpretive alternatives accepted. **Feedback.** Evidence/provenance graph.
**Examples.** main order copied into subordinate clause (L2); pronoun key points
to incompatible referent (L3); audio says a different case form (L4).
**Validation.** Fault manifest.

### Cross-family progression

Relative/subordinate structures precede longer texts. Sentence construction
reuses only mastered morphology. Reading and dialogue precede audio versions of
similar tasks; dictation follows discrimination. Speaking remains guided and
self-assessed.

## 8. Cross-family progression

### Foundation

- Icelandic letters, keyboard support, and carefully chosen spelling/sound pairs;
- high-frequency contextual words and fixed dialogue acts;
- noun gender and nominative/accusative recognition;
- present singular verbs and simple subject-first clauses;
- numbers/time only in invariant or fully scaffolded frames.

### A1-oriented

- common noun paradigms, suffixed definiteness, basic preposition government;
- adjective agreement in frequent nominative/accusative phrases;
- personal pronouns, present/past forms, yes/no and wh-questions;
- V2 with time/place fronting;
- short signs, messages, dialogues, listening discrimination, and fixed speaking.

### A2-oriented

- all four cases across reviewed verb/preposition frames;
- strong/weak adjectives, possessives, reflexives, comparisons;
- perfect/modal/imperative and selected middle/passive constructions;
- subordinate order, relative clauses, connected reading/listening, dictation;
- date/time/price and compound/derivational vocabulary in context.

### Early-B1-oriented

- less predictable paradigms and feature transformations;
- non-nominative subjects and multi-argument case frames;
- subjunctive, information-structure alternatives, embedded reference;
- multi-sentence inference, pragmatic dialogue, and cross-representation audits.

Recommended release slices:

1. **Alphabet & First Phrases**
2. **People, Things & Present Actions**
3. **Cases, Places & Movement**
4. **Description, Possession & Past Events**
5. **Connected Clauses & Everyday Messages**
6. **Listening, Interaction & Intermediate Review**

Do not unlock a level solely because the learner has seen every family. Require
accuracy across production/recognition, visual/audio, feature bundles, and named
misconceptions.

## 9. Adaptive practice guidance

Track mastery by:

- family and communicative `canDo` tag;
- lexeme and inflection class;
- gender, case, number, definiteness, adjective strength/degree;
- person, tense, mood, voice, and nonfinite form;
- case/government/agreement/reference frame;
- main/subordinate/question clause type and fronted constituent;
- reading, listening, spelling, analysis, production, and guided speaking mode;
- scaffold state: gloss, case label, feature grid, paradigm cue, audio replay;
- misconception and difficulty dimension.

Failure-driven routing:

- omitted acute/`þ/ð/æ/ö` → keyboard-letter contrast, then word spelling;
- pronunciation used to guess `i/y` → contextual orthography;
- noun gender error → lemma+article/agreement cues;
- one-ending-per-case behavior → contrast two declension classes;
- definite suffix concatenation → paired paradigm cells;
- preposition case error → semantic frame before form production;
- noun correct/adjective wrong → phrase agreement transformation;
- possessive agrees with possessor → two-arrow reference/agreement diagram;
- all subjects nominative → reviewed experiencer frame recognition;
- all objects accusative → verb-with-case-frame practice;
- verb person error → subject feature→paradigm cell;
- strong verb given weak past → principal-parts contrast;
- subject before verb after fronting → constituent-counted V2;
- `ekki` misplaced → main/subordinate paired order;
- grammatical but wrong answer in dialogue → speech-act selection;
- listening-only ending error → visual/audio inflection pair;
- integrated error → route to earliest failed morphology/syntax dependency.

Correct but slow answers retain the feature combination while increasing
scaffolding. Accent or recording self-assessment never updates correctness
mastery automatically.

## 10. Feedback and explanation requirements

Feedback order:

1. Restate the intended meaning, discourse context, and requested response.
2. Identify lemma(s) and grammatical role/frame.
3. Show the required feature bundle and agreement/government links.
4. Reveal the exact paradigm cell(s) and word order.
5. Compare the learner answer by the smallest meaningful mismatch.
6. Play/display the reviewed realization.
7. Explain accepted variants or changed meaning/register when relevant.

Misconception fingerprints include:

- missing/substituted Icelandic letter or diacritic;
- spelling from sound alone;
- wrong gender or declension;
- wrong case but right number/definiteness;
- article concatenation;
- wrong adjective gender/case/number/strength/degree;
- pronoun citation form used in governed case;
- possessive/reflexive antecedent error;
- weak/strong/irregular verb-pattern substitution;
- finite/nonfinite or auxiliary mismatch;
- wrong verb argument case;
- main/subordinate V2/negation/order transfer;
- correct words but wrong dialogue act/reference;
- transcript-like distractor matching one missed audio contrast.

Feedback must not say merely “wrong ending.” It must name the feature or frame
that selected the form. It must also avoid claiming that a contextually different
or regional pronunciation is ungrammatical.

## 11. Audio, recording, and content requirements

- Every scored listening asset is human-recorded, licensed, transcribed, reviewed,
  and mapped to semantic and morphological metadata.
- Record multiple speakers across the corpus; do not correlate one speaker with
  one answer, level, gender, or grammatical form.
- Minimum-pair recordings use comparable recording conditions and loudness.
- Whole-utterance recordings are preferred over concatenated word clips.
- Normal and learner-slow versions retain natural rhythm and are separately
  recorded where practical.
- Transcripts become available after response or through an explicit scaffold
  that changes mastery evidence.
- Replays are allowed in practice; replay count is metadata, not an error.
- No recording leaves the device. Microphone absence cannot block the curriculum.
- Purpose-written texts/dialogues require native or expert second-language
  editorial review.
- Reused public/licensed content retains attribution and adaptation status.
- Do not publish machine-generated Icelandic examples without human review.

## 12. Rendering, interaction, accessibility, and localization

- Use fonts with high-quality Icelandic glyphs and visually distinct `ð/þ`,
  accented vowels, `æ`, and `ö`.
- Provide an on-screen Icelandic character row without replacing physical
  keyboard input.
- Inflection grids have semantic row/column headers and list alternatives for
  screen readers/small screens.
- Agreement/case links use labels/arrows plus structured text, never color alone.
- Token-order tasks provide keyboard controls and a text/list alternative.
- Audio controls expose play/replay/speed/transcript status and work without
  hover.
- Do not autoplay audio. Respect reduced motion.
- Waveforms are supplementary and have textual timing/segment descriptions.
- Learner-interface localization never translates the Icelandic target or changes
  its semantic IDs.
- English grammatical terms may initially accompany Icelandic terms:
  `nominative (nefnifall)`, etc.; support fading the English scaffold.
- Unicode normalization and bidirectional/paste handling must not lose Icelandic
  letters.

## 13. Generator and implementation requirements

### Semantic- and morphology-first generation

Recommended standalone modules:

```text
seededRng
reviewedLexiconRegistry
licensedMorphologySnapshot
orthographyProfile
pronunciationTokenRegistry
semanticFrameGenerator
featureBundleEngine
paradigmRealizer
caseGovernmentRegistry
agreementGraph
referenceBindingGraph
clauseLinearizer
numberDateTimeGrammar
compoundDerivationRegistry
dialogueStateEngine
textEntailmentAnnotations
audioAssetRegistry
faultInjector
unicodeIcelandicNormalizer
semanticAnswerChecker
accessibleTableAudioRenderer
```

Generation pipeline:

1. Select family, target feature/misconception, and scaffold state.
2. Build a semantic/discourse frame.
3. Select compatible reviewed lexemes and constructions.
4. Assign exact morphology, agreement, government, and order features.
5. Realize through licensed local paradigms and authored templates.
6. Validate with an independent feature/frame oracle.
7. Construct distractors by one known error transform.
8. Bind reviewed text/audio/renderings.
9. Reject ambiguity, unnatural semantics, unlicensed variants, audio leaks, or
   recent structural repetition.
10. Localize UI after the Icelandic instance is frozen.

### Offline constraint

Runtime is standalone HTML/JS/CSS:

- bundle the reviewed morphology subset, lexicon, templates, and audio;
- no BÍN/Málið.is/network lookup at runtime;
- no cloud TTS, speech recognition, translation, grammar checking, or language
  model;
- browser `speechSynthesis` is optional unscored exposure only;
- preserve source/licence manifests in the repository and distributable.

## 14. Automated validation

### Linguistic-data invariants

- Every form maps to at least one reviewed lexeme/feature bundle.
- Every production answer matches the requested feature bundle exactly.
- Syncretic analyses are enumerated; context or accepted set resolves them.
- Paradigm forms, variants, usage status, and provenance match the pinned local
  dataset/editorial layer.
- Agreement graphs unify all linked gender/case/number/definiteness/strength/
  person features.
- Case frames and preposition senses are explicit.
- Clause linearizations are in the accepted template set.
- Number/date/time generation round-trips to its semantic object.
- Compound/derivation exercises use reviewed entries.

### Instance invariants

- All placeholders and target text are present and NFC-normalized.
- The question has one correct answer set after allowed normalization.
- Distractors are distinct, invalid for the displayed frame, and not licensed
  variants.
- No prompt relies on an isolated ambiguous form for unique analysis.
- Text questions are entailed by annotated microtext/dialogue facts.
- Audio ID, transcript, target form, speaker metadata, and label agree.
- Filename/duration/speaker/loudness do not predict answer.
- Hints do not reveal the answer accidentally.
- Audit instances contain exactly one root fault.
- No generated output contains unreviewed Icelandic.

For at least `10,000` accepted seeds per family/level, and `25,000` for case
frames, full phrase agreement, verb chains, V2/subordinate order, number phrases,
reference, sentence construction, reading/listening, and audits, validate
invariants, answer uniqueness, parser normalization, localization, accessibility,
and coverage.

Additionally:

- exhaustively test every bundled paradigm cell used in production;
- test Unicode composed/decomposed input and Icelandic case-folding;
- test every accepted variant against every distractor transform;
- test every audio asset and transcript manually before release.

## 15. Coverage requirements

Balance:

- all 32 core letters and special-character input;
- accented/unaccented vowels, `þ/ð`, quantity, stress, and curated sound patterns;
- high-frequency nouns across three genders and varied inflection classes;
- all four cases, two numbers, and indefinite/definite forms;
- adjective gender/case/number/strength/degree combinations at appropriate levels;
- personal/demonstrative/possessive/reflexive/interrogative reference;
- frequent weak/strong/irregular verbs across person/number/tense;
- active/middle/passive, indicative/subjunctive/imperative, finite/nonfinite;
- nominative and reviewed non-nominative subjects; accusative/dative/genitive
  governed complements;
- subject-first/fronted main clauses, questions, negation, subordinate clauses;
- numbers, prices, dates, clock/duration, identifiers, and compounds;
- reading/listening/speaking, recognition/production/analysis/construction;
- canonical/variant/contextually-different/incorrect cases.

Track structural signatures by family, lexeme class, feature bundle, case frame,
clause type, fronted constituent, semantic frame, response direction, audio
speaker, misconception, and scaffold state. Swapping vocabulary alone does not
constitute adequate variation.

## 16. Topic-level quality checklist

- [ ] Contemporary standard Icelandic and official orthography are the production
      baseline.
- [ ] Every lexeme, form, frame, example, and variant is reviewed/versioned.
- [ ] Dataset licence and attribution permit bundling/distribution.
- [ ] Acute vowels, `ð`, `þ`, `æ`, and `ö` remain distinct.
- [ ] Pronunciation variation is not mislabeled as error.
- [ ] Surface syncretism never creates a hidden unique analysis.
- [ ] Gender/case/number/definiteness/agreement are explicit features.
- [ ] Definite forms come from paradigms, not suffix concatenation.
- [ ] Case comes from semantic/lexical frames, not English lookup.
- [ ] Verbs use exact paradigms/principal parts and reviewed case frames.
- [ ] Main/subordinate/question order remains distinct.
- [ ] Every open response is bounded by reviewed lexicon/templates.
- [ ] All licensed natural answers are accepted or the prompt is narrowed.
- [ ] Listening uses licensed human audio; speaking is optional/self-assessed.
- [ ] No runtime network, cloud speech, or language model is required.
- [ ] Every family has task, response/template, derivation, difficulty,
      misconception distractors/constraints, feedback, three examples, and
      validation.
- [ ] Seed sweeps, Unicode, accessibility, localization, and audio audits pass.
- [ ] Solving the generated items improves communicative form–meaning fluency,
      not just grammatical-label recall.

## 17. Stable identifiers and recommended navigation

The backticked family identifiers above are stable public IDs. Archive:

```text
seed
familyId
level
canDoTag
lexiconMorphologyOrthographyVersions
semanticFrameId
lexemeIds
featureBundles
caseGovernmentAndAgreementLinks
clauseAndDiscourseType
canonicalRealization
acceptedVariants
responseMode
audioAssetIds
scaffoldState
misconceptionIds
workedExplanation
faultManifest?
structuralSignature
```

Changing a paradigm, usage status, accepted variant, case frame, agreement rule,
word-order set, semantic distinction, orthography policy, transcript, or audio
requires a content/profile version change. UI translation alone does not.

Recommended navigation:

1. **Letters & Sounds**
2. **Words & Everyday Language**
3. **Nouns & Cases**
4. **Agreement & Pronouns**
5. **Verbs & Word Order**
6. **Reading, Listening & Interaction**
