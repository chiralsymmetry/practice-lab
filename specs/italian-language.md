# Italian Language — Dynamic Practice Specification

Status: implementation specification

Audience: exercise generator, linguistic-content editor, Italian morphology and
syntax engine, semantic answer checker, text/audio renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual normative meanings.

## 1. Topic overview

### Topic name

Italian Language

### Topic goal

Develop beginner-to-lower-intermediate communicative Italian by repeatedly
connecting pronunciation, spelling, vocabulary, morphology, syntax, reading,
listening, controlled writing, and guided speaking. The learner should become
able to:

- decode and type contemporary Italian orthography accurately;
- distinguish consonant quantity, stress, elision, apostrophes, and meaning-
  distinguishing accents in reviewed words and phrases;
- select gender/number forms and make articles, adjectives, possessives,
  demonstratives, and participles agree where required;
- choose definite, indefinite, partitive, zero-article, simple-preposition, and
  articulated-preposition constructions from a controlled context;
- conjugate frequent regular and irregular verbs across practical person, tense,
  mood, and nonfinite forms;
- distinguish present, passato prossimo, imperfetto, future, conditional,
  imperative, progressive, and selected subjunctive/hypothetical meanings;
- choose `essere` or `avere` and apply the exact participle-agreement policy for
  the construction;
- omit or express subject pronouns for a reason rather than by English transfer;
- interpret and place tonic pronouns, direct/indirect clitics, `ci`, `ne`, and
  reviewed clitic clusters;
- use questions, negation, existential/impersonal/reflexive constructions,
  relative clauses, comparison, and information structure;
- handle practical numbers, prices, dates, time, directions, requests, messages,
  and routine interactions;
- understand short reviewed texts and recordings and rehearse fixed utterances;
- distinguish canonical targets, accepted contemporary variants, register/
  meaning differences, and incompatible forms.

The app should train usable Italian. Grammar labels support form–meaning control;
they are not the endpoint.

### Audience and level boundary

The curriculum begins before pronunciation/spelling mastery and extends through
practical A1, A2, and selected early-B1 tasks. These labels guide task complexity;
the app does not certify CEFR, CILS, CELI, PLIDA, school, immigration, or
professional proficiency.

- Foundation: decoding, spelling, fixed phrases, core vocabulary, articles, and
  present-tense recognition.
- A1-oriented: familiar noun phrases, routine present actions, simple questions,
  numbers/time/prices, directions, and basic interactions.
- A2-oriented: past narration, clitic objects, comparisons, instructions,
  connected messages, and common subordinate relationships.
- early-B1-oriented: aspect contrasts, combined clitics, conditional/subjunctive
  frames, hypotheses, discourse-sensitive order, and short inference.

The [CEFR Companion
Volume](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions)
informs the balance among reception, production, interaction, mediation, and
phonological competence. Its levels are not converted into a certification
claim. The University for Foreigners of Siena likewise describes
[CILS](https://cils.unistrasi.it/1/79/82/I_livelli_CILS.htm) as six progressive
communicative levels; this app is not a CILS preparation product.

### Reference and language-data boundary

Authoritative descriptive/reference anchors include:

- Treccani's overview of [Italian
  orthography](https://www.treccani.it/enciclopedia/ortografia_%28Enciclopedia-dell%27Italiano%29/),
  which notes that relatively transparent spelling still leaves pronunciation
  and regional variation underdetermined in places;
- Treccani's descriptions of [articles](https://www.treccani.it/enciclopedia/articolo_%28Enciclopedia-dell%27Italiano%29/),
  [prepositions](https://www.treccani.it/enciclopedia/preposizioni_%28Enciclopedia-dell%27Italiano%29/),
  [clitics](https://www.treccani.it/enciclopedia/clitici_%28Enciclopedia-dell%27Italiano%29/),
  and [personal pronouns](https://www.treccani.it/enciclopedia/pronomi-personali_%28Enciclopedia-dell%27Italiano%29/);
- Treccani's descriptions of [passato
  prossimo](https://www.treccani.it/enciclopedia/passato-prossimo_%28Enciclopedia-dell%27Italiano%29/)
  and [imperfetto](https://www.treccani.it/enciclopedia/imperfetto_%28Enciclopedia-dell%27Italiano%29/);
- [Morph-it!](https://docs.sslmit.unibo.it/doku.php?id=resources%3Amorph-it),
  a University of Bologna free morphological lexicon of inflected forms, lemmas,
  and features, used only as one input to a reviewed learner subset.

Treccani pages are references, not a text corpus to copy. Any bundled external
data must have compatible licensing and attribution. Morph-it! itself notes gaps
and unlikely forms; no raw resource entry becomes a learner target without
lexical, semantic, usage, and paradigm review.

### Language variety and usage policy

- Core production targets use contemporary standard Italian.
- Regional accents and common regional lexical/syntactic variation are not
  labeled defective merely for differing from a recording.
- Pronunciation of open/closed `e/o`, voiced/unvoiced `s/z`, and other variable
  contrasts is taught only in reviewed lexical items; it is not used as a
  universal accent gate.
- Register, relationship, medium, geography, and discourse context are stored
  when they affect usage.
- `tu`, `Lei`, and plural forms are introduced through explicit relationship/
  context frames rather than cultural absolutes.
- Common spoken variants may be accepted for comprehension while a formal
  production prompt requests the declared standard form.

Every realization is classified as:

1. **canonical target** — selected teaching form for the displayed context;
2. **accepted variant** — natural and meaning/register-compatible here;
3. **contextually different** — grammatical but changes reference, focus,
   aspect, politeness, implication, or regional/register profile;
4. **non-target/nonstandard** — outside the requested production profile;
5. **incorrect** — incompatible spelling, morphology, syntax, or semantics.

### Orthography and pronunciation policy

The ordinary native alphabet uses 21 letters:

```text
A B C D E F G H I L M N O P Q R S T U V Z
```

`J K W X Y` occur in names, loanwords, symbols, and quoted material and remain
valid characters when the lexical entry requires them.

- `c/g`, `ch/gh`, `sc/sch`, `gn`, `gli`, `qu`, and `cqu` are taught as reviewed
  grapheme/environment correspondences, not English letter names.
- Double consonants are spelling- and pronunciation-significant.
- Written accent is mandatory in forms that require it, especially final-stressed
  words and selected homograph distinctions.
- Grave/acute choice on written `e/o` follows the active official/editorial
  profile; input normalization must not erase it when targeted.
- Apostrophe/elision and truncation are distinct editorial phenomena. The app
  uses reviewed forms rather than “remove the last vowel” logic.
- Internal text is Unicode NFC. Straight/curly apostrophes may normalize when
  typography is not the target.
- Capitalization and punctuation normalize only when not assessed.
- Primary stress and syllabification are lexeme-level data. Unmarked stress is
  not guessed for arbitrary words.

### Linguistic data model

```text
Lexeme {
  id
  lemma
  spellings[]
  pronunciations[]
  partOfSpeech
  inflectionClass
  paradigmForms[]
  principalParts?
  gender?
  numberBehavior?
  auxiliaryFrames[]
  argumentFrames[]
  cliticFrames[]
  semanticTags[]
  selectionalTags[]
  register
  regionStatus?
  frequencyBand
  collocations[]
  acceptedVariants[]
  exampleTemplateIds[]
  provenance
}

MorphologicalForm {
  lexemeId
  surface
  person?
  number?
  gender?
  tense?
  mood?
  nonfiniteForm?
  degree?
  usageStatus
  pronunciationId?
}

SentenceTemplate {
  semanticFrame
  discourseContext
  slots[]
  agreementLinks[]
  auxiliarySelection
  cliticSequence?
  wordOrderSet[]
  tenseAspectConstraints[]
  register
  canonicalRealizations[]
  acceptedVariants[]
  rejectionRules[]
}
```

Generation order is semantic/discourse frame → compatible lexemes → morphology/
clitics/order → validation → rendering. Random surface-word substitution is not
permitted.

### Noun-phrase policy

- Nouns have lexical gender and singular/plural behavior; invariant, defective,
  plural-only, and meaning-changing gender/number entries are explicit.
- Articles and adjectives agree with the noun's gender/number.
- Article selection also depends on phonological/orthographic onset (`il/lo/l'`,
  `i/gli`, `un/uno/un'`) and discourse definiteness.
- The indefinite article has no ordinary plural. Partitive forms, `alcuni/e`,
  bare plurals, and other indefinite strategies are context-sensitive and are
  not treated as freely interchangeable.
- Adjective position may be neutral, contrastive, lexicalized, or meaning-
  affecting; only authored pairs are assessed.
- Possessive article presence/absence is determined by a reviewed noun-phrase
  template, including bounded family-term patterns.
- Preposition selection is semantic/lexical. Fusion with articles is generated
  from a versioned contraction table, not free concatenation.

### Verb, aspect, and auxiliary policy

- Regular `-are`, `-ere`, and `-ire` patterns and `-isc-` subclasses are encoded,
  but irregular verbs always use reviewed forms.
- Subject–verb agreement compares person/number even when the subject pronoun is
  omitted.
- Compound tenses store the selected auxiliary by verb sense/construction.
- With `essere`, past participle agreement is generated from the licensed
  subject/construction. With `avere`, the default invariant participle and
  reviewed clitic-related agreement cases are distinct profiles.
- `passato prossimo` and `imperfetto` are chosen from aspect, temporal framing,
  discourse role, and lexical aspect in authored contexts; no English-tense
  replacement rule is allowed.
- Regional/register variation in use of `passato remoto` is acknowledged; v1
  teaches recognition in selected narratives but does not force it as the
  default conversational past.
- Future, conditional, imperative, progressive, subjunctive, and hypothetical
  constructions use typed semantics and exact paradigms.

### Pronoun and clitic policy

Tonic pronouns and clitics are separate lexical/syntactic forms.

```text
Clitic {
  function: direct | indirect | reflexive | locative_ci |
            partitive_ne | other_reviewed
  person?
  number?
  gender?
  antecedentId
  hostType
  clusterSlot
}
```

- Finite affirmative verbs normally host proclitics; infinitives, positive
  imperatives, gerunds, and selected constructions license enclisis according to
  authored templates.
- Clitic clusters use a fixed reviewed ordering and surface-fusion table.
- `ci` and `ne` have several lexical/constructional uses; they are not translated
  by one English word.
- Clitic climbing with modal/causative/perception constructions is limited to
  reviewed frames and accepts licensed alternatives.
- Direct-object clitic/participle agreement uses an explicit profile.
- Doubling/dislocation patterns are comprehension-first and context-labeled.

### Italian input and answer checking

Response modes include:

- single/multiple choice;
- short Italian text;
- lemma/form/feature fields;
- article/adjective/noun agreement slots;
- conjugation and auxiliary+participle slots;
- clitic selection/ordering/attachment;
- token/chunk ordering;
- sentence-frame construction;
- dictation;
- local record-and-compare for self-review.

Checking layers:

1. NFC and permitted typography/whitespace normalization;
2. tokenization against the controlled lexicon/templates;
3. morphological analysis returning every compatible lemma/feature bundle;
4. semantic, discourse, agreement, auxiliary, clitic, and word-order checks;
5. accepted-variant comparison;
6. targeted diagnosis of the smallest meaningful mismatch.

Accents, apostrophes, doubled consonants, and clitic attachment are not silently
corrected when targeted. Free text remains bounded; arbitrary translation is not
graded.

### Numbers, dates, time, and currency policy

- Cardinals `0–1,000,000`, common ordinals, digit strings, dates, clock time,
  duration, age, temperatures, and fictional euro prices are supported.
- Semantic numbers/dates/times are generated first, then realized through
  reviewed grammar and spelling.
- Telephone/account/transport identifiers use declared digit grouping.
- `uno`/article-like forms and number–noun agreement use separate typed frames.
- Dates store ISO values; ambiguous numeric-only date prompts are prohibited.
- No current prices, exchange rates, or financial advice.

### Audio and speaking architecture

- Bundle licensed, human-recorded word, phrase, sentence, and dialogue audio.
- Use multiple speakers and representative contemporary standard/regional
  variation without tying one variety to correctness.
- Record normal and learner-slow versions separately where practical.
- Browser speech synthesis is optional unscored exposure, not the oracle.
- No cloud TTS/STT or automatic accent/pronunciation scoring.
- Audio begins only after user action; replay/transcript scaffolds are explicit.
- Recording is optional, local, and discarded unless downloaded by the learner.
- Waveform/duration comparisons are descriptive and self-assessed.

### Scope

Included:

- core alphabet plus loanword letters; sound–spelling correspondences, doubled
  consonants, stress, accents, apostrophes, elision, syllabification, and input;
- contextual vocabulary, collocations, word families, gender/number, articles,
  adjective/possessive/demonstrative agreement, prepositions, and practical
  numbers/time/prices;
- present, passato prossimo, imperfetto, future, conditional, imperative,
  progressive, selected subjunctive/hypothetical, reflexive, and modal forms;
- subject omission, tonic and clitic pronouns, `ci`, `ne`, clitic clusters/
  placement, `piacere`, `si`, negation, questions, relatives, and word order;
- comparison, conjunctions, temporal/cause/purpose/condition relations,
  politeness/register, existential and controlled sentence construction;
- short texts, notices, schedules, dialogues, reference, listening, dictation,
  guided speaking, and bounded information mediation.

### Exclusions

Excluded:

- Latin, Old Italian, historical orthography, philology, and dialect production;
- unrestricted regional-dialect comparison or one-accent correctness;
- exhaustive advanced tense/mood system, literary passato remoto production,
  complex sequence-of-tenses doctrine, and specialist stylistics;
- open translation, essay grading, chat, or acceptance of every natural phrasing;
- unlicensed dictionary/corpus scraping or raw morphological-resource output;
- automatic word invention, unreviewed examples, and machine-translated content;
- handwriting/OCR and automatic free-speech pronunciation scoring;
- citizenship/CILS/CELI/PLIDA exam preparation or certification claims;
- legal, medical, emergency, immigration, or professional interpretation;
- static vocabulary lists as the dominant experience.

### Global answer conventions

- Ignore surrounding whitespace; normalize ordinary repeated spaces when spacing
  is not targeted.
- NFC-equivalent strings and permitted straight/curly apostrophes normalize.
- Case and punctuation normalize only when not assessed.
- Written accents, apostrophes, and consonant doubling remain significant.
- Feature answers compare semantic sets; token/clitic order remains ordered.
- Multiple natural article/preposition/tense/order choices require narrowing or
  an accepted answer set.
- English glosses describe the intended meaning, not a word-for-word template.
- Structured `contextually different` feedback is distinct from `incorrect`.

### Difficulty philosophy

Difficulty increases through:

- recognition→production and less English/metalinguistic scaffolding;
- less transparent but frequent noun/verb paradigms;
- coordinating article, onset, gender, number, adjective, and preposition;
- moving from one clitic to clusters and different host types;
- distinguishing tense/aspect/mood from richer discourse;
- carrying reference/register through several turns or sentences;
- moving among written, audio, analysis, and production modes;
- accepting/contrasting licensed variants.

Difficulty must not increase through obscure words, long conjugation tables,
prescriptive traps about contested usage, missing context, tiny text, noisy
audio, excessive typing, speed pressure, or speech-recognition failure.

### Shared generation and rejection rules

Every instance must:

- declare lexicon/morphology/orthography/audio/profile versions;
- generate from a semantic and discourse frame;
- use reviewed lexemes, paradigms, constructions, collocations, and variants;
- retain provenance for every answer and usage judgment;
- provide enough context for article, preposition, tense, clitic, word order,
  meaning, and register;
- accept all licensed equivalent realizations;
- generate distractors by one named learner-error transformation;
- use an independent morphology/frame oracle.

Reject an instance when:

- a form/usage is unreviewed or outside the active profile;
- homography/syncretism makes the intended analysis ambiguous without context;
- several articles, prepositions, auxiliaries, tenses, clitic positions, or word
  orders are natural but only one is accepted;
- lexical substitution violates collocation/selectional constraints;
- a pronunciation answer depends on regional preference;
- spelling and audio/transcript disagree;
- a distractor is a valid variant or changes the intended context plausibly;
- the task is effectively unrestricted translation;
- audio metadata leaks the answer;
- a recent structural signature repeats with cosmetic vocabulary only.

## 2. Category: Sound, spelling, stress, and input

### Category purpose

Build accurate Italian decoding, spelling, and listening discrimination without
turning one regional pronunciation into a universal standard.

### Learn

Italian spelling is relatively transparent, but context changes `c/g/sc`, `h`
can distinguish forms, consonant length matters, and stress is not always written.
Learn spellings and pronunciations inside reviewed words.

### Common misconceptions

- Read `c/g` with one invariant sound.
- Pronounce written `h`.
- Ignore doubled consonants.
- Put stress from English or assume every stress is written.
- Omit required final accents or apostrophes.
- Treat `e/è`, `si/sì`, `da/dà`, or `ne/né` as interchangeable.

### Family `alphabet_native_loan_letters`

**Task/purpose.** Recognize/name/type ordinary Italian and loanword letters.
**Response/template.** Letter/name/keyboard choice. **Derivation.** Pinned
alphabet and lexeme-origin registry. **Difficulty.** L1 native 21; L2 `j k w x y`;
L3 alphabet ordering/abbreviation. **Distractors/constraints.** Declare loanword
letters illegal, use English names as spelling. **Feedback.** Letter, name, and
example. **Examples.** identify `z` (L1); `k` in reviewed loanword (L2); order
`i l m` (L3). **Validation.** Alphabet table.

### Family `c_g_ch_gh`

**Task/purpose.** Select/produce `c/g/ch/gh` spelling or pronunciation in a
reviewed environment. **Response/template.** Letter sequence/audio choice.
**Derivation.** Environment rule plus lexeme spelling.
**Difficulty.** L1 before `a/o/u`; L2 before `e/i`; L3 preserve hard sound with
`h` or exceptional entry. **Distractors/constraints.** Pronounce `h`, English
soft/hard mapping. **Feedback.** Highlight following vowel and grapheme.
**Examples.** `casa` pattern (L1); `cena` pattern (L2); `che/ghi` hard pattern
(L3). **Validation.** Rule/lexeme oracle.

### Family `sc_sch_gn_gli`

**Task/purpose.** Decode or spell reviewed `sc/sch`, `gn`, and `gli` sequences.
**Response/template.** Audio/grapheme/word choice.
**Derivation.** Environment and lexical pronunciation registry.
**Difficulty.** L1 `sc` contrast; L2 `gn/gli`; L3 similar-looking clusters/
loanword exception. **Distractors/constraints.** English cluster values,
character-by-character audio. **Feedback.** Grapheme grouping.
**Examples.** `scena/schermo` contrast (L1); `gn` word (L2); `gli` word (L2).
**Validation.** Curated correspondence set.

### Family `s_z_voicing`

**Task/purpose.** Distinguish reviewed spellings and voiced/unvoiced realizations
without overgeneralizing regional variation. **Response/template.** Audio/word/
phonological-category choice. **Derivation.** Lexeme pronunciation variants.
**Difficulty.** L2 unambiguous curated contrast; L3 multiple accepted recordings;
L4 spelling from meaning rather than variable sound. **Distractors/constraints.**
Mark a licensed regional realization wrong. **Feedback.** Show accepted variant
set. **Examples.** reviewed `z` contrast (L2); accepted `s` variants (L3);
contextual spelling despite sound variation (L4). **Validation.** Audio profile.

### Family `consonant_length`

**Task/purpose.** Distinguish, count, or type single versus doubled consonants in
reviewed words/recordings. **Response/template.** Word/audio/timing choice.
**Derivation.** Orthographic quantity and human audio annotation.
**Difficulty.** L1 visual; L2 minimal-pair listening; L3 phrase dictation.
**Distractors/constraints.** Ignore doubling or lengthen arbitrary cluster.
**Feedback.** Spelling and timing visualization. **Examples.** `pala/palla`
(L1); recorded pair (L2); doubled consonant in phrase (L3). **Validation.**
Licensed pair and transcript.

### Family `stress_accent_mark`

**Task/purpose.** Identify lexical stress or supply a required written accent.
**Response/template.** Syllable selection/whole spelling.
**Derivation.** Lexeme stress and orthography entry.
**Difficulty.** L1 common penultimate stress; L2 final stress with written
accent; L3 nondefault unmarked stress/homograph. **Distractors/constraints.**
Write accents on every stressed vowel, omit mandatory accent.
**Feedback.** Mark spoken stress separately from official spelling.
**Examples.** penultimate-stress word (L1); `città` (L2); reviewed nondefault
stress (L3). **Validation.** Stress/spelling registry.

### Family `accented_homograph`

**Task/purpose.** Choose between reviewed accent-distinguished function/content
words in context. **Response/template.** Cloze/spelling choice.
**Derivation.** Semantic/syntactic frame selects lexeme and spelling.
**Difficulty.** L1 `e/è`; L2 `si/sì`, `da/dà`; L3 `ne/né` and combined context.
**Distractors/constraints.** Remove accents because pronunciation understood.
**Feedback.** Part of speech, meaning, and spelling.
**Examples.** conjunction/copula `e/è` (L1); pronoun/yes `si/sì` (L2);
preposition/verb `da/dà` (L2). **Validation.** Contextual lexeme IDs.

### Family `elision_apostrophe`

**Task/purpose.** Apply/interpret reviewed elision and apostrophe forms.
**Response/template.** Phrase editing/choice. **Derivation.** Article/word and
following onset plus lexical orthography rule.
**Difficulty.** L1 `l'`; L2 `un/un'` gender contrast; L3 fixed or optional
reviewed elision. **Distractors/constraints.** Apostrophe every truncation,
`un'` before masculine vowel noun. **Feedback.** Underlying form, elision, and
gender. **Examples.** `l'amico` (L1); `un'amica` versus `un amico` (L2);
curated optional form (L3). **Validation.** Elision table.

### Family `syllable_decoding`

**Task/purpose.** Segment a reviewed word and connect written units to syllables/
sound sequence. **Response/template.** Ordered segmentation/audio match.
**Derivation.** Lexeme syllabification and pronunciation tokens.
**Difficulty.** L1 CV patterns; L2 clusters/digraphs; L3 doubled consonant/
semivowel. **Distractors/constraints.** Split grapheme cluster or count letters
as syllables. **Feedback.** Orthographic and syllable layers.
**Examples.** simple word (L1); `gn/sc` word (L2); doubled consonant boundary
(L3). **Validation.** Curated syllabification.

### Family `word_spelling_from_audio`

**Task/purpose.** Type/select a reviewed word from human audio using meaning/
sentence context where sound alone is insufficient. **Response/template.**
Italian text/choice. **Derivation.** Audio target plus contextual lexeme.
**Difficulty.** L1 transparent; L2 double consonant/accent; L3 homophone or
variable `e/o/s/z`. **Distractors/constraints.** Audio-only unique claim where
orthography is underdetermined. **Feedback.** Replay and reveal context/spelling.
**Examples.** transparent common word (L1); double consonant (L2); contextual
homophone (L3). **Validation.** Audio/context/transcript.

### Family `sound_spelling_audit`

**Task/purpose.** Diagnose one grapheme, consonant length, stress, accent,
apostrophe, Unicode, or audio/transcript error. **Response/template.** Root/
correction/effect. **Derivation.** Compare lexeme orthography, pronunciation,
and asset metadata. **Difficulty.** L2 spelling; L3 context/variation; L4
cross-modal mismatch. **Distractors/constraints.** One root; licensed accent
variation is not a fault. **Feedback.** Correct alignment.
**Examples.** missing double consonant (L2); `un'` used with masculine noun
(L3); audio/transcript mismatch (L4). **Validation.** Fault manifest.

### Cross-family progression

Letter/environment decoding precedes listening contrasts and dictation.
Consonant quantity and stress are introduced visually before audio. Contextual
orthography prevents the false promise that sound always determines spelling.

## 3. Category: Vocabulary, noun phrases, prepositions, and quantities

### Category purpose

Build meaningful vocabulary and complete noun phrases with correct gender,
number, definiteness, onset-sensitive articles, agreement, and prepositions.

### Learn

Learn a noun with its gender and plural, a word with its collocations, and a
preposition with its construction. Articles agree with the noun and also respond
to the following sound/spelling. Adjectives agree but may change nuance by
position.

### Common misconceptions

- Guess noun gender from English meaning.
- Form every plural by changing `-o→-i` or `-a→-e`.
- Use `il/i` before every masculine noun.
- Write `un'` with masculine nouns beginning in a vowel.
- Treat partitive and bare plural as always interchangeable.
- Leave adjectives/possessives invariant.
- Translate `di/a/da/in/per` one-to-one from English.
- Concatenate preposition+article without the contraction table.

### Family `contextual_vocabulary`

**Task/purpose.** Choose/produce the reviewed word fitting a semantic frame.
**Response/template.** Word choice/short text. **Derivation.** Match semantic,
selectional, register, and inflection features.
**Difficulty.** L1 concrete noun/verb; L2 adjective/adverb; L3 near-synonym/
false friend. **Distractors/constraints.** Topic-related but wrong role or
collocation. **Feedback.** Meaning, lemma, and contextual form.
**Examples.** food/action word (L1); adjective in context (L2); `attualmente`
false-friend contrast (L3). **Validation.** Typed frame.

### Family `collocation_phrase`

**Task/purpose.** Select a conventional verb–noun, adjective–noun, or fixed
preposition phrase. **Response/template.** Cloze/matching.
**Derivation.** Authored collocation and argument-frame registry.
**Difficulty.** L1 frequent phrase; L2 competing verbs; L3 register/
preposition. **Distractors/constraints.** Literal translation and possible but
unnatural combination. **Feedback.** Whole phrase and meaning.
**Examples.** `fare` collocation (L1); `prendere` contrast (L2); fixed
preposition expression (L3). **Validation.** Collocation ID.

### Family `noun_gender`

**Task/purpose.** Identify a reviewed noun's gender using lemma/article/
agreement context. **Response/template.** Masculine/feminine plus evidence.
**Derivation.** Lexeme gender registry. **Difficulty.** L1 transparent frequent;
L2 `-e`/loan/invariant; L3 same form or meaning-dependent gender.
**Distractors/constraints.** Natural sex, final-letter-only rule; context supplied
for ambiguous entries. **Feedback.** Article/adjective example.
**Examples.** `libro` masculine (L1); `notte` feminine (L2); reviewed exception
(L3). **Validation.** Lexeme metadata.

### Family `noun_plural`

**Task/purpose.** Produce/select singular/plural noun forms while preserving
meaning and gender. **Response/template.** Whole form/phrase.
**Derivation.** Exact paradigm lookup with orthographic alternations.
**Difficulty.** L1 regular `-o/-a/-e`; L2 `-ca/-ga/-cia/-gia` reviewed patterns;
L3 invariant/irregular/meaning-changing plural. **Distractors/constraints.**
English `-s`, mechanical ending without spelling rule. **Feedback.** Paradigm
pair and relevant spelling. **Examples.** `libro→libri` (L1);
`amica→amiche` (L2); invariant noun (L3). **Validation.** Local morphology
snapshot.

### Family `definite_article_selection`

**Task/purpose.** Select/produce `il/lo/l'/la/i/gli/le` from gender, number,
onset, and definiteness. **Response/template.** Article+phrase.
**Derivation.** Noun features plus next-word onset class and discourse status.
**Difficulty.** L1 `il/la/i/le`; L2 vowel/`s`+consonant/`z/gn/ps`; L3 intervening
adjective changes onset. **Distractors/constraints.** Gender only, inspect noun
instead of immediately following word. **Feedback.** Feature/onset table.
**Examples.** `il libro` (L1); `lo studente` (L2); `il nuovo studente` onset at
adjective (L3). **Validation.** Article selection oracle.

### Family `indefinite_partitive_article`

**Task/purpose.** Choose a licensed indefinite singular, partitive, indefinite
plural, or bare form in a supplied discourse frame. **Response/template.**
Article/phrase choice. **Derivation.** Definiteness/quantity/predicate/register
template plus onset/gender.
**Difficulty.** L1 `un/uno/una/un'`; L2 plural/partitive; L3 bare-versus-
partitive accepted variants. **Distractors/constraints.** Invent plural `uni` as
general article, treat all strategies equivalent. **Feedback.** Reference/
quantity interpretation. **Examples.** `uno studente` (L1); `un'amica` (L1);
reviewed `dei`/bare plural context (L3). **Validation.** NP template.

### Family `article_presence_omission`

**Task/purpose.** Choose article presence/absence in reviewed generic, possessive,
proper-name, institutional, or fixed-expression frames.
**Response/template.** Cloze/meaning contrast. **Derivation.** Authored
construction and register profile. **Difficulty.** L2 generic/first mention;
L3 possessive family term; L4 proper/fixed phrase variation.
**Distractors/constraints.** English article transfer, universal omission before
possessive. **Feedback.** Explain discourse/construction.
**Examples.** first mention→indefinite (L2); definite anaphoric mention (L2);
singular family possessive pattern (L3). **Validation.** Template registry.

### Family `adjective_agreement`

**Task/purpose.** Produce/select adjective gender/number agreement in a noun
phrase or predicate. **Response/template.** Whole adjective/phrase.
**Derivation.** Agreement link to exact adjective form.
**Difficulty.** L1 four-form adjective; L2 two-form/invariant; L3 coordinated
or irregular. **Distractors/constraints.** Citation masculine singular,
agreement with nearest irrelevant noun. **Feedback.** Feature matrix.
**Examples.** `ragazza italiana` (L1); plural phrase (L2); coordinated subject
from reviewed rule (L3). **Validation.** Agreement oracle.

### Family `adjective_position_meaning`

**Task/purpose.** Choose/interpret adjective position where an authored
prenominal/postnominal contrast affects focus or lexical meaning.
**Response/template.** Phrase-to-context match. **Derivation.** Entry-specific
position/meaning registry. **Difficulty.** L2 neutral descriptive position; L3
meaning pair; L4 stylistic accepted alternatives. **Distractors/constraints.**
One universal adjective order, assign a difference where none is licensed.
**Feedback.** Explain contextual nuance. **Examples.** neutral color after noun
(L2); reviewed `vecchio amico/amico vecchio` contrast (L3); stylistic pair (L4).
**Validation.** Authored phrase pairs.

### Family `possessive_noun_phrase`

**Task/purpose.** Inflect/place possessive and choose article according to the
reviewed noun-phrase frame. **Response/template.** Whole phrase.
**Derivation.** Possessor selects possessive lexeme; possessed noun supplies
gender/number; template selects article/order.
**Difficulty.** L2 ordinary noun; L3 singular family term; L4 contrastive/
postposed or plural family. **Distractors/constraints.** Agree with possessor,
always include/omit article. **Feedback.** Possessor versus agreement arrows.
**Examples.** `la mia casa` (L2); `mia madre` pattern (L3); plural family phrase
(L4). **Validation.** Agreement/template.

### Family `demonstrative_indefinite_agreement`

**Task/purpose.** Select/inflect reviewed demonstratives, quantifiers, and
indefinite determiners/pronouns. **Response/template.** Whole form/phrase.
**Derivation.** Discourse/quantity semantics plus paradigm/onset.
**Difficulty.** L2 `questo/quello`; L3 `tutto/qualche/alcuni`; L4 pronoun versus
determiner. **Distractors/constraints.** Invariant English form, omit required
article with `tutto`. **Feedback.** Meaning and agreement.
**Examples.** `questa casa` (L2); onset-sensitive `quello` form (L3);
`tutti i...` frame (L4). **Validation.** Determiner registry.

### Family `preposition_selection`

**Task/purpose.** Choose a simple preposition from a reviewed spatial, temporal,
recipient, source, means, purpose, or lexical frame.
**Response/template.** Preposition/phrase cloze. **Derivation.** Semantic role
or governing lexeme selects construction.
**Difficulty.** L1 clear place/source; L2 time/means; L3 verb/adjective lexical
government. **Distractors/constraints.** One English preposition mapping,
country/city overgeneralization. **Feedback.** Name relation and full phrase.
**Examples.** `a Roma` (L1); `in Italia` (L1); reviewed verb+preposition (L3).
**Validation.** Government/frame registry.

### Family `articulated_preposition`

**Task/purpose.** Fuse/separate a simple preposition and definite article where
the active profile requires. **Response/template.** Whole phrase/table cell.
**Derivation.** Preposition ID + selected article → contraction table.
**Difficulty.** L1 `di/a/in/su`; L2 all article forms; L3 `con/per/tra/fra`
profile and no-article contexts. **Distractors/constraints.** Raw concatenation,
contract before indefinite article. **Feedback.** Two-stage preposition→article→
surface form. **Examples.** `a+il→al` (L1); `di+gli→degli` (L2); no contraction
in reviewed frame (L3). **Validation.** Versioned fusion table.

### Family `number_date_time_price`

**Task/purpose.** Interpret/produce practical cardinal/ordinal, date, clock,
duration, age, identifier, or euro-price expressions.
**Response/template.** Structured semantic fields/Italian phrase.
**Derivation.** Deterministic semantic object→reviewed realization.
**Difficulty.** L1 0–100/time; L2 dates/prices/hundreds; L3 compound spelling/
article agreement/identifier grouping. **Distractors/constraints.** Quantity
versus digit string, ambiguous numeric date. **Feedback.** Decomposition and
semantic type. **Examples.** `27` cardinal (L1); ISO date phrase (L2); `€1/€2`
price contrast (L3). **Validation.** Round-trip number/date grammar.

### Family `noun_phrase_audit`

**Task/purpose.** Diagnose one gender, plural, article, onset, agreement,
position, possessive, preposition, contraction, or quantity error.
**Response/template.** Root/correction/meaning effect. **Derivation.** Validate
discourse→NP features→onset/agreement/government→surface.
**Difficulty.** L2 one form; L3 preposition/article; L4 context-dependent
article/position. **Distractors/constraints.** One root; accepted zero/
partitive variants not faults. **Feedback.** Correct dependency chain.
**Examples.** `il studente` onset error (L2); possessive agrees with possessor
(L3); wrong preposition changes relation (L4). **Validation.** Fault manifest.

### Cross-family progression

Vocabulary and noun gender/plural precede article and agreement. Definite article
onset precedes articulated prepositions. Article presence, adjective position,
possessives, and indefinite/partitive choices remain context-rich later skills.

## 4. Category: Verb morphology, tense, aspect, mood, and voice

### Category purpose

Build exact verb forms and choose constructions from time, aspect, modality,
subject, auxiliary, and discourse context.

### Learn

Italian finite verbs encode person and number, so subject pronouns may be absent.
Compound tenses require a reviewed auxiliary and participle behavior. Past tense
choice expresses how an event is viewed, not simply which English tense appears.

### Common misconceptions

- Use the infinitive or third-person singular for every subject.
- Put `-isc-` in every `-ire` verb/form.
- Choose `avere` for all active verbs or `essere` for all motion verbs.
- Leave the participle invariant with `essere`.
- Treat passato prossimo and imperfetto as completed versus incomplete in every
  lexical/contextual case.
- Use future after every English `will`.
- Use conditional to express the `if` clause mechanically.
- Replace the subjunctive with a memorized trigger list without meaning/context.

### Family `conjugation_class_principal_forms`

**Task/purpose.** Classify a reviewed verb and match its learning/principal forms.
**Response/template.** Class/matching table. **Derivation.** Lexeme inflection
class and paradigm metadata. **Difficulty.** L1 regular `-are/-ere/-ire`; L2
`-isc-`; L3 irregular/lookalike. **Distractors/constraints.** Infinitive ending
fully predicts all forms. **Feedback.** Show stem/form pattern and exception.
**Examples.** `parlare` class (L1); reviewed `finire` `-isc-` pattern (L2);
irregular `venire`-type (L3). **Validation.** Lexeme registry.

### Family `present_indicative`

**Task/purpose.** Produce/select present indicative form for person/number and
meaning. **Response/template.** Whole form/clause slot.
**Derivation.** Exact paradigm lookup and subject agreement.
**Difficulty.** L1 regular singular; L2 plural/`-isc-`; L3 irregular.
**Distractors/constraints.** English bare form, infinitive, wrong person.
**Feedback.** Subject features→paradigm cell.
**Examples.** `io parlo` (L1); `noi finiamo` (L2); irregular present (L3).
**Validation.** Paradigm/agreement.

### Family `essere_avere_lexical`

**Task/purpose.** Conjugate/choose lexical `essere` or `avere` in identity,
location, possession, age, physical-state, and fixed-expression frames.
**Response/template.** Verb/form choice. **Derivation.** Semantic construction
selects lexeme; subject selects form. **Difficulty.** L1 identity/possession;
L2 age/hunger/state; L3 idiomatic contrast. **Distractors/constraints.** English
`be/have` mapping. **Feedback.** Whole construction and meaning.
**Examples.** `sono stanco` (L1); `ho vent'anni` (L2); `avere fame` (L2).
**Validation.** Construction registry.

### Family `modal_infinitive`

**Task/purpose.** Choose/inflect `potere`, `dovere`, `volere`, `sapere` or another
reviewed modal/phase construction plus infinitive.
**Response/template.** Finite+infinitive slots. **Derivation.** Context selects
modal sense; finite modal agrees; lexical verb remains infinitive.
**Difficulty.** L1 ability/desire; L2 obligation/permission/know-how; L3 tense/
polarity/ambiguity. **Distractors/constraints.** Both verbs finite, English modal
one-to-one mapping. **Feedback.** Modal force and verb chain.
**Examples.** `posso entrare` (L1); `so nuotare` versus `conosco...` (L2);
negative obligation contrast (L3). **Validation.** Verb-chain frame.

### Family `reflexive_pronominal_verb`

**Task/purpose.** Conjugate/interpret reviewed reflexive, reciprocal, or lexical
pronominal verbs with the correct clitic. **Response/template.** Clitic+verb/
meaning match. **Derivation.** Lexeme/construction selects pronominal semantics;
subject controls clitic and verb agreement.
**Difficulty.** L1 daily routine; L2 reciprocal/plural; L3 lexicalized meaning.
**Distractors/constraints.** Drop clitic, translate every `si` as “self.”
**Feedback.** Subject, clitic, and entry-specific meaning.
**Examples.** `mi alzo` (L1); `ci vediamo` reciprocal/context (L2); lexical
pronominal verb (L3). **Validation.** Pronominal lexeme registry.

### Family `passato_prossimo_auxiliary`

**Task/purpose.** Select and inflect `avere/essere` for a reviewed passato
prossimo construction. **Response/template.** Auxiliary+participle slots.
**Derivation.** Verb sense/argument/pronominal construction selects auxiliary;
subject selects auxiliary form. **Difficulty.** L1 frequent transitive/
intransitive; L2 reflexive/change-of-state; L3 same verb with sense/construction
variation. **Distractors/constraints.** Motion=essere universal, active=avere
universal. **Feedback.** Store auxiliary with construction.
**Examples.** `ho mangiato` (L1); `sono arrivata/o` (L1); reviewed auxiliary
alternation (L3). **Validation.** Auxiliary-frame registry.

### Family `past_participle_agreement`

**Task/purpose.** Produce/select past participle agreement under the displayed
auxiliary/clitic/passive profile. **Response/template.** Participle/feature fields.
**Derivation.** Construction identifies agreement controller; exact participle
paradigm. **Difficulty.** L1 `essere` subject agreement; L2 plural/reflexive;
L3 preceding direct clitic or passive. **Distractors/constraints.** Always
invariant or agree with nearest noun. **Feedback.** Draw agreement link.
**Examples.** `Maria è partita` (L1); `sono arrivati` (L2); reviewed direct-clitic
agreement (L3). **Validation.** Construction/agreement oracle.

### Family `imperfetto_form`

**Task/purpose.** Produce/select imperfetto forms for person/number.
**Response/template.** Whole form/clause slot. **Derivation.** Exact paradigm
lookup. **Difficulty.** L1 regular; L2 plural; L3 irregular high-frequency forms.
**Distractors/constraints.** Past participle, passato prossimo auxiliary.
**Feedback.** Stem and person ending. **Examples.** `parlavo` (L1);
`facevamo` (L2); `ero` (L3). **Validation.** Paradigm.

### Family `past_aspect_choice`

**Task/purpose.** Choose passato prossimo, imperfetto, or a licensed combination
from an authored narrative context. **Response/template.** Tense/form choice or
two-clause slots. **Derivation.** Event boundedness, background, habituality,
ongoing frame, sequence, and discourse relation select construction.
**Difficulty.** L2 event versus background; L3 interruption/habit; L4 lexical
aspect or meaning-changing contrast. **Distractors/constraints.** “Was”=
imperfetto, all completed events=passato prossimo. **Feedback.** Timeline and
viewpoint. **Examples.** background weather+event (L2); habitual past (L3);
meaning contrast (L4). **Validation.** Authored temporal frame.

### Family `future_form_use`

**Task/purpose.** Form/interpret future simple in scheduled/predicted or selected
epistemic uses. **Response/template.** Verb form/context match.
**Derivation.** Context licenses future meaning; exact paradigm lookup.
**Difficulty.** L1 regular future; L2 irregular stem; L3 present-for-future/
epistemic contrast. **Distractors/constraints.** English `will` rule, infinitive+
ending without stem change. **Feedback.** Time/stance and form.
**Examples.** `partirò domani` (L1); irregular future (L2); schedule with present
as accepted contextual alternative (L3). **Validation.** Paradigm/context.

### Family `conditional_form_request`

**Task/purpose.** Form/interpret present conditional for hypothetical result,
preference, advice, or polite request. **Response/template.** Form/dialogue-act
choice. **Derivation.** Context selects conditional; exact paradigm realizes.
**Difficulty.** L2 regular/polite request; L3 irregular/advice; L4 tense/mood
contrast in hypothesis. **Distractors/constraints.** Use conditional in both
`if` and result clauses mechanically. **Feedback.** Conditional meaning and
clause role. **Examples.** `vorrei...` request (L2); advice (L3); hypothetical
result (L4). **Validation.** Mood template.

### Family `imperative_request`

**Task/purpose.** Produce/interpret positive/negative imperatives and reviewed
request forms with appropriate person/register. **Response/template.** Verb/
clitic/dialogue slots. **Derivation.** Context selects addressee/register/
polarity; paradigm and clitic-placement template realize.
**Difficulty.** L1 `tu` common verb; L2 `Lei/noi/voi` or negative; L3 irregular+
clitic attachment. **Distractors/constraints.** Infinitive for every command,
mix `tu/Lei`, separate enclitic. **Feedback.** Addressee and form.
**Examples.** `parla!` (L1); `non parlare!` (L2); `mi dica`-type formal request
(L3). **Validation.** Paradigm/register/clitic.

### Family `gerund_progressive`

**Task/purpose.** Form gerund and use/contrast `stare + gerundio` in a licensed
ongoing-action context. **Response/template.** Auxiliary+gerund/meaning match.
**Derivation.** Exact gerund form; finite `stare`; aspect frame.
**Difficulty.** L2 regular; L3 irregular; L4 simple present versus progressive.
**Distractors/constraints.** English progressive required for every ongoing
event, use infinitive. **Feedback.** Current viewpoint and form.
**Examples.** `sto leggendo` (L2); irregular gerund (L3); habitual present not
progressive (L4). **Validation.** Aspect template.

### Family `present_past_subjunctive`

**Task/purpose.** Recognize/produce selected present or past subjunctive after
authored uncertainty, evaluation, desire, necessity, or reported-attitude frames.
**Response/template.** Mood/form choice. **Derivation.** Predicate/discourse
semantics license mood; anteriority selects compound; paradigm realizes.
**Difficulty.** L3 common present forms; L4 past subjunctive; L5 contexts with
licensed indicative/meaning difference. **Distractors/constraints.** Trigger-
word list without semantics, mark common accepted variation universally wrong.
**Feedback.** Attitude/reality stance and clause time.
**Examples.** `penso che sia...` target profile (L3); `sono contento che abbia...`
(L4); certainty contrast (L5). **Validation.** Authored mood frame.

### Family `hypothetical_period`

**Task/purpose.** Build/interpret selected real and unreal `se` constructions.
**Response/template.** If/result clause forms/timeline match.
**Derivation.** Hypothesis type/time selects declared tense/mood pairing.
**Difficulty.** L2 real present/future; L3 present unreal; L4 past unreal.
**Distractors/constraints.** Conditional inside `se` clause by English transfer,
mix time frames. **Feedback.** Condition/result timeline.
**Examples.** real condition (L2); `se avessi..., farei...` type (L3); past
counterfactual (L4). **Validation.** Conditional-template oracle.

### Family `verb_tense_mood_audit`

**Task/purpose.** Diagnose one conjugation, auxiliary, participle agreement,
aspect, modal, imperative, future, conditional, subjunctive, or hypothesis error.
**Response/template.** Root/correction/meaning effect. **Derivation.** Validate
semantic time/stance→construction→morphology/agreement.
**Difficulty.** L2 form; L3 auxiliary/aspect; L4 mood/hypothesis.
**Distractors/constraints.** One root; accepted regional/register tense choices
are not faults. **Feedback.** Correct timeline and form chain.
**Examples.** `avere` used for reviewed `essere` construction (L2); imperfetto
used for bounded foreground event without context (L3); conditional in `se`
clause (L4). **Validation.** Fault manifest.

### Cross-family progression

Conjugation classes and present agreement precede compound tenses. Auxiliary and
participle agreement are separate before integration. Imperfetto form precedes
aspect choice. Conditional and subjunctive precede complete hypotheses.

## 5. Category: Pronouns, clitics, `ci/ne`, and sentence structure

### Category purpose

Train reference, pronoun form, clitic function/order/attachment, and flexible but
context-sensitive Italian sentence structure.

### Learn

Italian often omits an unstressed subject pronoun because the verb and discourse
identify it. Tonic pronouns can stand independently; clitics occupy fixed
positions near a verb. `ci`, `ne`, and `si` each belong to several reviewed
constructions rather than one translation.

### Common misconceptions

- Express every subject pronoun as English does.
- Omit a contrastive/ambiguous subject when context needs it.
- Use tonic and clitic pronouns interchangeably.
- Put clitics where full noun phrases occur.
- Order a clitic cluster by English object order.
- Translate every `ci` as “us” and every `ne` as “of it.”
- Treat `piacere` as English “like” with the same subject/object roles.
- Treat every `si` as reflexive.

### Family `subject_pronoun_expression`

**Task/purpose.** Choose whether to omit/express a subject pronoun in a supplied
discourse context. **Response/template.** Pronoun/zero choice and clause.
**Derivation.** Person recoverability, contrast, switch-reference, emphasis, and
ambiguity conditions select canonical/accepted set.
**Difficulty.** L1 recoverable omission; L2 contrast; L3 third-person ambiguity/
register. **Distractors/constraints.** Always copy or always drop pronoun.
**Feedback.** Identify discourse reason. **Examples.** `(Io) parlo...` neutral
omission (L1); `io..., ma lui...` contrast (L2); referent switch (L3).
**Validation.** Discourse template.

### Family `tonic_pronoun_form`

**Task/purpose.** Select a tonic subject/object/prepositional pronoun with the
correct referent and emphasis. **Response/template.** Pronoun/phrase choice.
**Derivation.** Semantic role/preposition/focus selects tonic paradigm.
**Difficulty.** L1 subject forms; L2 after preposition/emphasis; L3
`lui/lei/sé` reference. **Distractors/constraints.** Use clitic standalone or
subject form after preposition. **Feedback.** Tonic status and role.
**Examples.** `con me` (L2); emphatic `lui` (L2); reflexive tonic `sé` frame
(L3). **Validation.** Pronoun/frame registry.

### Family `direct_object_clitic`

**Task/purpose.** Replace/interpret a direct object with `mi/ti/lo/la/ci/vi/li/le`
as licensed. **Response/template.** Clitic+verb/reference link.
**Derivation.** Antecedent role/person/gender/number selects clitic.
**Difficulty.** L1 third-person singular; L2 plural/person; L3 animate/inanimate
and participle-agreement handoff. **Distractors/constraints.** Subject pronoun,
indirect `gli/le`, agree with possessor. **Feedback.** Object→clitic features.
**Examples.** `Vedo il libro→Lo vedo` (L1); feminine plural replacement (L2);
past compound link (L3). **Validation.** Argument/reference graph.

### Family `indirect_object_clitic`

**Task/purpose.** Replace/interpret a recipient/beneficiary or reviewed `a`-
complement with an indirect clitic. **Response/template.** Clitic+verb/reference.
**Derivation.** Verb frame plus person/number/register selects clitic form.
**Difficulty.** L1 `mi/ti`; L2 `gli/le/ci/vi`; L3 plural/formal usage profile.
**Distractors/constraints.** Direct-object form, infer from animacy alone.
**Feedback.** Verb argument frame. **Examples.** `Do il libro a Luca→Gli...`
(L1); feminine recipient (L2); plural recipients per active profile (L3).
**Validation.** Case/function registry.

### Family `clitic_position_attachment`

**Task/purpose.** Place/attach one clitic to finite verb, infinitive, gerund, or
imperative in an authored construction. **Response/template.** Token/order/
spelling. **Derivation.** Host type, polarity, mood, and construction select
proclisis/enclisis and orthographic fusion.
**Difficulty.** L1 finite proclitic; L2 infinitive/positive imperative; L3
negative imperative/modal alternatives. **Distractors/constraints.** One fixed
position, separate enclitic spelling. **Feedback.** Identify host and attachment.
**Examples.** `lo vedo` (L1); `vederlo` (L2); `dimmi`-type form (L3).
**Validation.** Host template.

### Family `clitic_cluster`

**Task/purpose.** Select/order/fuse a reviewed two-clitic sequence.
**Response/template.** Ordered clitic cluster+verb.
**Derivation.** Functions/person/features map to fixed cluster slots and surface
allomorphy. **Difficulty.** L2 indirect+direct; L3 reflexive/`ne`; L4 attachment
to imperative/infinitive. **Distractors/constraints.** English order, concatenate
base forms, duplicate arguments. **Feedback.** Slot table and referents.
**Examples.** `me lo...` (L2); `glielo...` (L3); enclitic cluster (L4).
**Validation.** Cluster automaton.

### Family `ci_locative_construction`

**Task/purpose.** Interpret/use locative `ci` and selected lexical `ci`
constructions. **Response/template.** Clitic/reference/meaning match.
**Derivation.** Antecedent place or reviewed lexical construction selects `ci`.
**Difficulty.** L1 replace `a/in+place`; L2 `ci sono`; L3 lexicalized verb.
**Distractors/constraints.** `ci` always “us,” replace every place phrase.
**Feedback.** Function and antecedent. **Examples.** `A Roma? Ci vado...` (L1);
existential (L2); reviewed lexical `ci` phrase (L3). **Validation.** `ci` frame.

### Family `ne_partitive_source`

**Task/purpose.** Interpret/use partitive, quantitative, source, or reviewed
lexical `ne`. **Response/template.** Clitic/reference/quantity slots.
**Derivation.** Antecedent construction and remaining quantity select `ne`.
**Difficulty.** L2 quantity partitive; L3 `di` complement/source; L4 lexicalized
use/participle interaction. **Distractors/constraints.** `ne` always “of it,”
omit retained quantity. **Feedback.** Antecedent relation and clause.
**Examples.** `Quanti? Ne voglio due` (L2); `parlarne` (L3); reviewed source
frame (L4). **Validation.** `ne` frame registry.

### Family `piacere_experiencer`

**Task/purpose.** Build/interpret `piacere`-type constructions with experiencer,
stimulus, clitic, and verb agreement. **Response/template.** Role/form/clause
slots. **Derivation.** Stimulus controls verb number; experiencer is `a` phrase/
indirect clitic. **Difficulty.** L1 singular stimulus; L2 plural; L3 compound/
clitic/discourse order. **Distractors/constraints.** English liker as subject,
verb agrees with experiencer. **Feedback.** Role reversal diagram.
**Examples.** `Mi piace il libro` (L1); `Mi piacciono i libri` (L2); named
experiencer (L3). **Validation.** Construction/agreement.

### Family `si_construction`

**Task/purpose.** Distinguish/complete reflexive, reciprocal, impersonal, passive-
`si`, and reviewed lexical uses. **Response/template.** Construction/meaning/
agreement choice. **Derivation.** Argument structure, subject/reference, and
agreement select type. **Difficulty.** L2 reflexive versus impersonal; L3
passive-`si` agreement; L4 ambiguity with context. **Distractors/constraints.**
Every `si` means “self,” ignore agreement.
**Feedback.** Construction-specific role graph. **Examples.** `si lava` reflexive
(L2); `si mangia bene` impersonal (L2); `si vendono libri` passive-like plural
(L3). **Validation.** `si` template registry.

### Family `negation_polarity`

**Task/purpose.** Place `non` and select reviewed negative/polarity expressions
such as `mai`, `più`, `nessuno`, `niente`, `neanche`.
**Response/template.** Clause ordering/meaning match.
**Derivation.** Polarity scope and position template.
**Difficulty.** L1 `non`; L2 one negative item; L3 preverbal/postverbal negative
element and meaning contrast. **Distractors/constraints.** English double-
negative logic, omit `non` in profile requiring it. **Feedback.** Scope and
licensed concord. **Examples.** `non capisco` (L1); `non...mai` (L2);
`nessuno...` order contrast (L3). **Validation.** Polarity grammar.

### Family `question_formation`

**Task/purpose.** Form/interpret yes/no and wh-questions using intonation,
punctuation, interrogative role, and reviewed order.
**Response/template.** Ordered clause/question-response match.
**Derivation.** Question frame selects wh phrase/preposition and accepted order.
**Difficulty.** L1 yes/no same syntax; L2 who/what/where/when; L3 prepositional
wh and subject ambiguity. **Distractors/constraints.** English auxiliary
insertion/inversion, omit required preposition. **Feedback.** Unknown role and
question structure. **Examples.** `Parli italiano?` (L1); `Dove abiti?` (L2);
`Con chi...?` (L3). **Validation.** Question frame.

### Family `relative_che_cui`

**Task/purpose.** Choose/interpret `che`, preposition+`cui`, and selected
`il quale` forms in reviewed relative clauses.
**Response/template.** Relative form/clause combination.
**Derivation.** Gap's syntactic/prepositional role selects relative strategy.
**Difficulty.** L2 subject/direct object `che`; L3 oblique `cui`; L4 ambiguity/
formal alternative. **Distractors/constraints.** English who/which mapping,
use `cui` without required preposition. **Feedback.** Antecedent→gap role.
**Examples.** subject relative `che` (L2); object `che` (L2); `con cui` (L3).
**Validation.** Relative dependency.

### Family `marked_word_order_focus`

**Task/purpose.** Match neutral, topicalized, dislocated, or focused orders to an
authored discourse context. **Response/template.** Context→sentence choice/
accepted set. **Derivation.** Information-status and clitic-resumption template.
**Difficulty.** L2 neutral SVO; L3 subject postponement/fronting; L4 dislocation
with clitic. **Distractors/constraints.** Italian word order completely free,
reject grammatical but contextually different form. **Feedback.** Topic/focus
and reference links. **Examples.** neutral clause (L2); focused subject (L3);
left dislocation with reviewed clitic (L4). **Validation.** Discourse-order set.

### Family `pronoun_syntax_audit`

**Task/purpose.** Diagnose one pronoun expression, clitic function/order/host,
`ci/ne/si`, `piacere`, negation, question, relative, or discourse-order error.
**Response/template.** Root/correction/meaning effect. **Derivation.** Validate
semantic roles→reference→clitic/construction→linearization.
**Difficulty.** L2 one clitic; L3 cluster/construction; L4 discourse/context.
**Distractors/constraints.** One root; licensed clitic-position/order variants
accepted. **Feedback.** Correct dependency graph.
**Examples.** direct clitic used for recipient (L2); `ne` omits quantity (L3);
dislocated noun lacks required clitic in target construction (L4).
**Validation.** Fault manifest.

### Cross-family progression

Subject/tonic pronouns precede direct/indirect clitics. One clitic and host type
precede clusters. `ci/ne/si/piacere` are separate constructions before mixed
sentences. Neutral questions/negation precede discourse-marked order.

## 6. Category: Connected Italian, discourse, and register

### Category purpose

Turn correct words and clauses into Italian that fits a relationship, purpose,
and discourse context. These exercises make cohesion and register explicit
rather than treating grammar as a sequence of isolated blanks.

### Learn-card content

- Comparison uses both morphology and syntax: `più/meno ... di`, `più/meno ...
  che`, `così/tanto ... come/quanto`, and lexical comparisons such as
  `meglio/migliore`.
- Connectors encode a relation, not merely a translation: addition, contrast,
  cause, result, condition, concession, purpose, and sequence.
- Temporal clauses constrain event order and often interact with tense/aspect.
- Italian distinguishes informal singular `tu`, formal singular `Lei`, and
  plural `voi`; agreement follows grammatical form even when `Lei` denotes the
  addressee.
- Capitalizing formal pronouns (`Lei`, `La`, `Le`) is a style choice, not a
  universal correctness requirement. Each item states or accepts the relevant
  house style.
- `c'è/ci sono`, weather constructions, and impersonal expressions must be
  learned as constructions, not translated word by word.
- A natural sentence may admit several orders or connectors. A generated item
  must either constrain the intended relation or accept the reviewed variants.

### Common misconceptions

- `di` is always used after a comparative.
- `meglio` and `migliore` are interchangeable in every syntactic position.
- One English connector maps to one Italian connector.
- Italian requires the same tense sequence as English.
- Formal `Lei` takes second-person verb forms.
- Capitalized formal pronouns are the only correct spelling.
- `c'è` and `ci sono` can be interchanged without number agreement.
- A grammatically correct sentence necessarily has the requested register or
  discourse effect.

### Family `comparison_degree`

**Task/purpose.** Build or interpret comparative, equality, and superlative
constructions, including a small reviewed set of irregular lexical forms.
**Response/template.** Connector/form choice, ordered phrase, or meaning match.
**Derivation.** Comparison type, compared constituents, and syntactic roles
select `di/che/come/quanto` and degree morphology.
**Difficulty.** L1 `più/meno + adjective`; L2 `di` versus `che` and equality;
L3 relative/absolute superlatives and `meglio/migliore`; L4 discourse-sensitive
alternatives. **Distractors/constraints.** Mechanically use `di`, confuse
adverb/adjective, omit agreement. **Feedback.** Comparison slots and the reason
for the connector/form. **Examples.** `Luca è più alto di Marco` (L1);
`leggere è più facile che scrivere` (L2); `la soluzione migliore` versus
`funziona meglio` (L3). **Validation.** Reviewed comparison templates and
agreement.

### Family `conjunction_discourse_relation`

**Task/purpose.** Select a connector that expresses an authored relation such
as addition, contrast, concession, cause, result, or reformulation.
**Response/template.** Connector choice, relation label, or clause join.
**Derivation.** The semantic relation and register license an accepted connector
set. **Difficulty.** L1 `e/ma/perché`; L2 `quindi/però/invece`; L3
concession and reformulation; L4 near-synonyms with register constraints.
**Distractors/constraints.** Plausible connector with the wrong relation or
register. **Feedback.** Relation graph and paraphrase. **Examples.** cause with
`perché` (L1); result with `quindi` (L2); concession with `anche se` (L3).
**Validation.** Every option is checked against the annotated relation.

### Family `temporal_sequence`

**Task/purpose.** Express and recover event order with `prima`, `dopo`,
`mentre`, `quando`, `appena`, and reviewed tense combinations.
**Response/template.** Timeline ordering, connector/tense selection, or sentence
assembly. **Derivation.** Event intervals and reference time determine relation
and licensed forms. **Difficulty.** L1 before/after; L2 overlap versus sequence;
L3 completed/background combinations; L4 future or past sequencing with
controlled subordination. **Distractors/constraints.** Reverse chronology,
confuse overlap with succession, choose tense from surface order alone.
**Feedback.** Render both the timeline and clause mapping. **Examples.**
`prima...poi...` (L1); `mentre studiavo, ha telefonato` (L2);
`appena` with two ordered events (L3). **Validation.** Timeline model must
entail the keyed sentence.

### Family `cause_purpose_condition`

**Task/purpose.** Distinguish and construct cause, purpose, and real or
hypothetical condition relations.
**Response/template.** Relation/connector selection or bounded clause build.
**Derivation.** Shared/different subject, factuality, and conditional type
select a reviewed construction such as `perché`, `per + infinitive`, or `se`.
**Difficulty.** L1 cause; L2 same-subject purpose and real condition; L3
different-subject purpose or hypothetical condition; L4 mixed contextual
choice. **Distractors/constraints.** Treat causal `perché` and purposive
`perché` as freely interchangeable, ignore mood requirements, invert condition
and result. **Feedback.** Purpose/cause/condition graph plus subject relation.
**Examples.** `Resto perché piove` (L1); `studio per imparare` (L2);
`se avessi tempo, viaggerei` (L3). **Validation.** Clause semantics, subject
identity, and mood agree.

### Family `tu_lei_register`

**Task/purpose.** Choose forms of address and their agreement for a specified
relationship and setting. **Response/template.** Pronoun, verb, possessive,
clitic, or greeting choice. **Derivation.** Social scenario maps to a declared
register profile; formal singular uses third-person grammar.
**Difficulty.** L1 `tu` versus `Lei`; L2 verb and direct/indirect object forms;
L3 possessives and ambiguous social situations; L4 regional/institutional
profiles only when explicitly authored. **Distractors/constraints.** Second-
person verb with formal `Lei`, universalize a social convention.
**Feedback.** Addressee, register, and agreement chain. **Examples.**
`Come stai?` to a friend (L1); `Come sta?` in a formal exchange (L1);
`Le posso chiedere...?` (L2). **Validation.** Scenario and style guide stored
with every item.

### Family `formal_informal_rewrite`

**Task/purpose.** Rewrite a bounded message between informal and polite/formal
register while preserving its propositional content.
**Response/template.** Token transformation, sentence assembly, or choice among
reviewed rewrites. **Derivation.** A message frame separates content from
address, politeness, greeting, request, and closing features.
**Difficulty.** L2 pronoun/verb changes; L3 requests and openings/closings; L4
multi-sentence micro-message. **Distractors/constraints.** Change facts,
produce mixed agreement, equate formality with literal wordiness.
**Feedback.** Side-by-side content and register features. **Examples.**
`Puoi...?`→`Può...?` (L2); informal versus formal appointment request (L3);
short email transformation (L4). **Validation.** Accepted outputs are authored
or generated from reviewed templates, never scored by vague style similarity.

### Family `existential_weather_impersonal`

**Task/purpose.** Use and interpret existential, weather, and high-frequency
impersonal constructions. **Response/template.** Form/agreement choice,
sentence completion, or meaning match. **Derivation.** Construction type,
tense, and postverbal noun number determine realization.
**Difficulty.** L1 `c'è/ci sono` and basic weather; L2 past forms and `bisogna`;
L3 impersonal evaluations with infinitive/subordinate clause; L4 contrast with
referential `ci` or personal clauses. **Distractors/constraints.** Use `è` as
English “there is,” ignore plural, invent a dummy subject.
**Feedback.** Construction label, expletive/existential role, and agreement.
**Examples.** `C'è un problema` (L1); `Ci sono due treni` (L1);
`Bisogna partire presto` (L2). **Validation.** Construction-specific templates.

### Family `controlled_sentence_construction`

**Task/purpose.** Assemble a natural sentence from a semantic frame, required
lexemes, and explicit register/tense constraints.
**Response/template.** Ordered tokens or constrained text grammar.
**Derivation.** Semantic roles feed noun phrase, verb, clitic, connector, and
linearization modules; all licensed variants are enumerated.
**Difficulty.** L1 one clause; L2 modifiers/preposition; L3 clitic or
subordinate clause; L4 two-clause discourse with register.
**Distractors/constraints.** Never ask for unrestricted English-to-Italian
translation; distractors isolate one dependency. **Feedback.** Reveal the
semantic frame, then each realization decision. **Examples.** location clause
(L1); polite request with time phrase (L2); reason plus object clitic (L3).
**Validation.** Parse every accepted result back to the same feature frame.

### Family `grammar_pragmatics_audit`

**Task/purpose.** Diagnose one comparison, connector, temporal, conditional,
register, existential, or cohesion error in a short exchange.
**Response/template.** Root cause, correction, and meaning/register effect.
**Derivation.** Inject one logged fault after producing a valid discourse
instance. **Difficulty.** L2 local agreement/connector; L3 cross-clause
timeline/register; L4 plausible but pragmatically wrong alternative.
**Distractors/constraints.** Exactly one intended root fault; accept all
reviewed repairs. **Feedback.** Valid discourse graph and corrected form.
**Examples.** wrong comparative connector (L2); formal pronoun with informal
verb (L2); temporal connector reverses the intended events (L3).
**Validation.** Fault removal must restore every invariant.

### Cross-family progression

Comparisons and basic connectors precede timelines and semantic clause
relations. `tu/Lei` agreement precedes whole-message rewrites. Existential and
impersonal constructions are introduced before mixed controlled construction.
Audits combine only previously demonstrated features.

## 7. Category: Reading, listening, and interaction

### Category purpose

Integrate the preceding systems in short, purposeful acts of comprehension and
communication. Texts and recordings remain small enough to annotate completely:
the app knows which facts, references, inferences, pronunciations, and language
forms support each answer.

### Learn-card content

- Reading is not word-by-word substitution. Use morphology, clause structure,
  connectors, reference, genre, and context together.
- Notices, menus, timetables, messages, and instructions often omit information
  that the situation supplies.
- Pronouns, clitics, demonstratives, and omitted subjects must be linked to the
  appropriate discourse referent.
- Listening should progress from a known distinction to words, phrases, short
  turns, and connected micro-dialogues.
- Dictation checks both recognition and Italian spelling, but feedback must
  separate sound, word choice, accent, apostrophe, and punctuation errors.
- Speaking activities provide a model, recording, replay, comparison, and
  self-assessment. A standalone browser app must not pretend that waveform
  similarity proves pronunciation quality.
- “Mediation” here means transferring specified information between controlled
  representations, not grading open-ended translation.

### Common misconceptions

- Every unfamiliar word is required to answer a reading question.
- Italian normally states every subject pronoun.
- A pronoun's nearest noun is always its referent.
- Faster audio is intrinsically more authentic or more advanced.
- Accepting one spelling normalization means accents and apostrophes never
  matter.
- A speech recording can be reliably graded without a reviewed recognizer.
- Any paraphrase is safe for machine scoring.
- A plausible inference is necessarily entailed by the source.

### Family `sentence_segmentation_parse`

**Task/purpose.** Segment a sentence into meaningful groups and recover core
clause roles and dependencies. **Response/template.** Token grouping,
subject/verb/object labels, or dependency matching. **Derivation.** The
generated sentence retains its semantic frame, syntactic tree, elided subject,
and clitic links. **Difficulty.** L1 noun and verb groups; L2 prepositional
phrases and omitted subject; L3 clitics/subordination; L4 controlled ambiguity.
**Distractors/constraints.** Split article contractions, attach a modifier to a
plausible wrong head, invent an overt subject. **Feedback.** Layered bracketing
and dependency arrows. **Examples.** simple transitive clause (L1); omitted
subject plus time phrase (L2); clitic and subordinate clause (L3).
**Validation.** Generated surface form must reparse to the stored tree.

### Family `short_reading_comprehension`

**Task/purpose.** Retrieve explicit facts, sequence events, and make one licensed
inference from a short reviewed or generated microtext.
**Response/template.** Multiple choice, fact slot, ordering, or
entailed/not-entailed. **Derivation.** A fact graph realizes the text and
generates questions whose support spans are recorded.
**Difficulty.** L1 one sentence/explicit fact; L2 short paragraph and reference;
L3 inference across two clauses; L4 distractors contradicted only by aspect,
connector, or quantity. **Distractors/constraints.** No outside knowledge;
exactly one best answer unless multiple selection is stated.
**Feedback.** Highlight supporting spans and reconstruct the inference.
**Examples.** identify destination (L1); order errands (L2); infer why a plan
changed from `però/quindi` (L3). **Validation.** Each key is entailed and every
distractor is contradicted or unsupported for a logged reason.

### Family `notice_message`

**Task/purpose.** Interpret practical notices, labels, menus, advertisements,
and personal or service messages. **Response/template.** Intended action,
audience, fact extraction, or matching. **Derivation.** A genre template
controls layout, register, ellipsis, prices, dates, and communicative purpose.
**Difficulty.** L1 sign/label; L2 text message or opening-hours notice; L3 short
email/menu/ad; L4 reconcile two related documents.
**Distractors/constraints.** Authentic-looking but fictional data; no current
legal, transport, health, or emergency claim. **Feedback.** Expand ellipsis and
identify decisive fields. **Examples.** `Chiuso il lunedì` (L1); changed meeting
time (L2); compare an invitation with a reply (L3). **Validation.** Layout and
fact table agree.

### Family `instruction_timetable`

**Task/purpose.** Follow a short instruction sequence or extract and combine
information from a timetable, itinerary, recipe step list, or schedule.
**Response/template.** Order actions, choose route/time, or enter one derived
fact. **Derivation.** Structured events generate both document and answer.
**Difficulty.** L1 imperative and one step; L2 ordered steps/time arithmetic;
L3 constraints and one transfer; L4 reconcile exception or conditional note.
**Distractors/constraints.** Keep arithmetic secondary; use fictional schedules;
state 12/24-hour format. **Feedback.** Trace relevant rows/steps and temporal
logic. **Examples.** choose the next instruction (L1); find departure time
(L2); select a connection satisfying a constraint (L3). **Validation.** A
separate event solver recomputes the answer.

### Family `dialogue_completion`

**Task/purpose.** Choose or construct a turn that is grammatical, coherent,
socially appropriate, and consistent with known facts.
**Response/template.** Turn selection, ordered phrase, or constrained utterance.
**Derivation.** Dialogue state records speakers, goals, register, commitments,
and open question. **Difficulty.** L1 greeting/question-answer pair; L2 request,
offer, and clarification; L3 repair or polite refusal; L4 multi-turn reference
and implicature limited to authored templates. **Distractors/constraints.**
Grammatical but non-responsive, wrong register, contradicts prior fact.
**Feedback.** State the speech act and which earlier turn it answers.
**Examples.** respond to `Come stai?` (L1); accept/decline an invitation (L2);
ask for clarification after a mismatch (L3). **Validation.** Exactly one option
satisfies every dialogue-state constraint unless variants are declared.

### Family `reference_ellipsis_resolution`

**Task/purpose.** Resolve omitted subjects, pronouns, clitics, demonstratives,
and predictable omitted material in connected text.
**Response/template.** Referent selection, link drawing, or expanded paraphrase.
**Derivation.** A discourse graph tracks entity features, salience, roles, and
licensed ellipsis. **Difficulty.** L2 unambiguous omitted subject; L3 multiple
candidate nouns or clitic reference; L4 reference across turns with discourse
focus. **Distractors/constraints.** Nearest compatible noun, English overt-
subject expectation, wrong gender/number. **Feedback.** Show agreement and
discourse cues, not only the name. **Examples.** recover `io` from verb form
(L2); resolve `lo` (L2); resolve omitted subject after a topic shift (L3).
**Validation.** The intended referent is uniquely recoverable under the stated
context.

### Family `listening_sound_form`

**Task/purpose.** Identify a taught sound, length, stress, or word-form contrast
in a clean recording. **Response/template.** Audio-to-word, minimal-set choice,
stress position, or same/different. **Derivation.** Reviewed recordings are
indexed by phonological features and speaker. **Difficulty.** L1 isolated
syllable/word; L2 stress or consonant length in a phrase; L3 reduced contextual
cues across speakers; L4 meaning contrast in a short turn.
**Distractors/constraints.** Never manufacture a “regional error”; loudness and
speed are balanced; visual text can be hidden/revealed.
**Feedback.** Replay normal and learner-slow recordings and mark the contrast.
**Examples.** `c`/`ch` choice (L1); single versus double consonant (L2); lexical
stress contrast from reviewed words (L3). **Validation.** Manual audio review,
feature tags, and loudness checks.

### Family `listening_dictation`

**Task/purpose.** Transcribe a word, phrase, sentence, or tiny dialogue while
applying Italian orthography. **Response/template.** Text input with optional
token scaffold. **Derivation.** Each recording has a canonical transcript,
accepted punctuation/capitalization variants, and word-level alignment.
**Difficulty.** L1 familiar word; L2 short phrase with apostrophe/accent; L3
sentence with clitic or doubled consonant; L4 two turns at natural learner-
appropriate speed. **Distractors/constraints.** Do not collapse `e/è`,
apostrophe, or lexical spelling distinctions under permissive normalization.
**Feedback.** Classify omissions, lexical substitutions, accents, apostrophes,
doubles, and punctuation separately. **Examples.** accented final vowel (L1);
`l'amica` phrase (L2); clitic-bearing sentence (L3).
**Validation.** Transcript alignment and normalization regression suite.

### Family `listening_comprehension`

**Task/purpose.** Understand the gist, explicit facts, speaker intention, or one
licensed inference in a short recording.
**Response/template.** Gist/fact choice, ordering, or structured answer.
**Derivation.** A reviewed transcript and dialogue/fact graph generate prompts
with time-aligned evidence. **Difficulty.** L1 one turn; L2 two-turn factual
exchange; L3 short dialogue with reference; L4 attitude/intention only when
explicitly cued and reviewed. **Distractors/constraints.** Avoid trivia and
speaker stereotypes; transcript is available after submission.
**Feedback.** Replay the supporting segment, then reveal transcript and cues.
**Examples.** identify requested item (L1); recover appointment time (L2);
explain a changed plan (L3). **Validation.** Manual content/audio review and
evidence-span check.

### Family `guided_speaking_shadowing`

**Task/purpose.** Rehearse intelligible production through listen-and-repeat,
chunk shadowing, substitution frames, and prompted self-recording.
**Response/template.** Local recording plus self-check checklist; optionally
choose the model matching the intended utterance. **Derivation.** Prompt frames
provide model audio, chunk boundaries, target features, and substitutions.
**Difficulty.** L1 word/chunk; L2 sentence; L3 transformed sentence; L4
two-turn role response. **Distractors/constraints.** No automated pronunciation
score or upload; recording permission is optional; a non-recording rehearsal
path remains available. **Feedback.** Model replay, waveform only as timing aid,
and feature-specific self-check. **Examples.** repeat double consonant (L1);
substitute subject/verb form (L2); record a polite request (L3).
**Validation.** Models manually reviewed; recorder data remains local and is
discardable.

### Family `bounded_mediation`

**Task/purpose.** Transfer selected information between a table, notice,
message, schedule, or constrained Italian utterance.
**Response/template.** Fill specified semantic slots, choose a faithful
paraphrase, or assemble from a supplied phrase bank.
**Derivation.** Source and output share a fact graph; the requested audience and
register control presentation. **Difficulty.** L2 one fact; L3 several facts
and register; L4 select relevant facts while preserving quantities/negation.
**Distractors/constraints.** Not free translation; penalize added, missing, or
changed facts rather than stylistic difference. **Feedback.** Source→fact→output
alignment. **Examples.** convey a changed time (L2); summarize two menu
constraints (L3); pass a short formal message from a schedule (L4).
**Validation.** Slot equivalence and contradiction checks.

### Family `connected_language_audit`

**Task/purpose.** Diagnose one comprehension, reference, transcription,
dialogue-state, register, or fact-transfer failure in a short multimodal item.
**Response/template.** Root cause, corrected interpretation/form, and evidence.
**Derivation.** Inject one logged fault into a valid annotated text, transcript,
turn, or transfer. **Difficulty.** L2 local cue; L3 evidence across sentences
or modalities; L4 plausible inference that is unsupported.
**Distractors/constraints.** One root fault; no cultural trivia; source contains
all needed evidence. **Feedback.** Highlight the decisive text/audio span and
dependency/fact link. **Examples.** wrong omitted-subject referent (L2);
dictation changes `è` to `e` (L2); summary reverses a cancellation (L3).
**Validation.** Removing the logged mutation restores annotation consistency.

### Cross-family progression

Sentence parsing precedes longer reading and reference resolution. Practical
texts precede multi-document reasoning. Listening moves from contrasts through
dictation to meaning; guided speaking reuses forms already understood. Bounded
mediation and connected audits appear only after their component modalities.

## 8. Cross-category progression and release slices

The levels describe exercise complexity, not a claim of CEFR certification:

- **Foundation / L1:** native spelling inventory, high-frequency sound–spelling
  patterns, lexical gender stored with the noun, singular/plural, core articles,
  adjective agreement, present tense, `essere/avere`, basic subject expression,
  `c'è/ci sono`, familiar words, and one-turn reading/listening.
- **Elementary / L2:** articulated prepositions, possessives, reflexives,
  `passato prossimo`, `imperfetto` forms, one direct or indirect clitic,
  questions/negation, comparison, basic connectors, practical messages, and
  two-turn interaction.
- **Independent-building / L3:** past aspect choice, auxiliary selection and
  participle agreement, clitic attachment/clusters, `ci/ne/si`, relative
  clauses, future/conditional/imperative, temporal and conditional relations,
  register rewrite, connected reading/listening, and bounded mediation.
- **Early-intermediate extension / L4:** reviewed subjunctive triggers,
  hypothetical periods, discourse-sensitive order, multiple clitic and
  cross-clause dependencies, controlled usage variation, and multimodal audits.
- **L5 challenge mode:** dense mixing and lower scaffolding within the same
  reviewed grammar. It must not silently expand into literary Italian,
  unrestricted translation, dialect proficiency, or C1/C2 assessment.

Recommended delivery:

1. **Release A — sound, noun phrase, present:** Category 2; core Category 3;
   present/`essere`/`avere`/modals; one-clause parsing and audio contrasts.
2. **Release B — past and practical Italian:** remaining Category 3; reflexives,
   `passato prossimo`, `imperfetto`, past choice; one clitic; notices, messages,
   timetables, and dictation.
3. **Release C — connected interaction:** clusters, `ci/ne/si`, relatives,
   comparison/connectors/register, dialogue, reference, and listening
   comprehension.
4. **Release D — early-B1 extension:** future/conditional/subjunctive,
   hypothetical relations, discourse order, formal rewrite, mediation, and
   cumulative audits.

Unlocking is family-specific. A learner strong in reading but weak in article
allomorphy should receive targeted article work, not have every category reset.
Audio-dependent families remain optional where audio or microphone use is
unavailable.

## 9. Adaptive practice guidance

Maintain a multidimensional learner model instead of one global “Italian
level.” At minimum, record:

- family and can-do objective;
- lemma, frequency band, semantic domain, and known/introduced status;
- noun gender, number, plural class, article onset class, and agreement span;
- verb conjugation class, irregular class, person, number, tense, aspect, mood,
  auxiliary, participle agreement, and construction;
- pronoun semantic role, tonic/clitic form, clitic sequence, host, position, and
  referent distance;
- preposition relation, articulated form, connector relation, clause type,
  register, and discourse function;
- modality, speaker, audio speed, support level, response mode, latency, and
  misconception code.

Routing examples:

- Correct noun gender but wrong article allomorph → keep the noun familiar and
  vary onset class before adding new vocabulary.
- Correct form but wrong `passato prossimo`/`imperfetto` choice → route to
  timelines and event-shape contrasts, not more conjugation tables.
- Correct clitic form in the wrong position → contrast finite, infinitive,
  imperative, and gerund hosts with the same semantic frame.
- Repeated `ci/ne` errors → return to semantic roles and quantities before
  introducing clusters containing them.
- Correct grammar but wrong `tu/Lei` → keep the message content constant and
  contrast audience/register.
- Reading failure caused by reference → use short reference-resolution items
  rather than unrelated vocabulary review.
- Dictation accent/apostrophe errors → preserve the audio and lexeme while
  changing only the orthographic contrast.

Use spaced retrieval for lexical and irregular forms, but interleave grammar by
dependency. Separate “recognized with options,” “produced with scaffold,” and
“produced from a semantic cue”; recognition alone must not count as production
mastery. After two recent successes, vary one controlled dimension. After a
confident misconception, present a minimal contrast and then delayed transfer.
Do not punish a learner for an unannounced valid regional or stylistic variant.

## 10. Feedback and explanation requirements

Feedback should normally reveal this chain:

1. **Communicative intention:** who means what to whom, when, and in what
   register?
2. **Lexical and semantic frame:** which lemmas and roles are present?
3. **Feature bundle:** person, number, gender, tense, aspect, mood, definiteness,
   preposition relation, and discourse status.
4. **Realization:** inflection, auxiliary, agreement, article/preposition
   fusion, clitic form/order/host, and word order.
5. **Comparison with the answer:** first decisive mismatch, not merely “wrong.”
6. **Accepted alternatives:** why another form is equivalent, or which meaning/
   register change makes it inappropriate here.

Family-specific visual explanations should include:

- onset highlighting for `il/lo/l'` and `i/gli`;
- agreement arcs across a noun phrase;
- compact paradigms with the requested cell highlighted;
- event timelines for past aspect and temporal clauses;
- semantic-role and referent arrows for clitics, `ci`, `ne`, and omitted
  subjects;
- ordered clitic slots and attachment boundary;
- clause-relation diagrams for connectors and conditions;
- discourse-state cards for dialogue and register;
- synchronized transcript spans for listening.

Never rely on English glosses as the grammatical explanation. English may help
establish meaning at early levels, but the app should increasingly use pictures,
Italian paraphrases, semantic roles, timelines, and context. When the prompt is
ambiguous or the app failed to list a valid answer, mark the item invalid rather
than blaming the learner.

## 11. Audio and content requirements

- Ship all required audio in the app bundle. No network TTS, speech service, or
  runtime pronunciation dictionary is allowed.
- Prefer licensed human recordings from multiple reviewed speakers. Carefully
  reviewed local synthetic audio may supplement low-stakes prototypes but must
  be labeled and must not be the only pronunciation model.
- Provide normal and pedagogically slower takes as separate recordings; do not
  create distorted “slow speech” by crude playback-rate reduction alone.
- Normalize playback loudness and trim silence without erasing meaningful
  consonant length or phrase boundaries.
- Record minimal contrasts in matched conditions where possible. Never label a
  regional realization as an error merely because it differs from another
  speaker.
- Store transcript, speaker/voice ID, target variety, speaking rate, feature
  tags, chunk timing, license, and manual-review status with each asset.
- Include replay, keyboard-operable controls, visible playback state, optional
  transcript after submission, and a no-audio alternative for non-auditory
  objectives.
- Microphone exercises are opt-in, local-only, and usable without uploading or
  retaining recordings. A recording is for rehearsal and comparison, not an
  automated pronunciation grade.
- Purpose-written microtexts and dialogues are preferred. Any external text or
  recording must have a documented compatible license and attribution.
- Cultural contexts should be specific enough to feel real but not turn a
  language item into trivia or represent one region, family pattern, or social
  convention as all of Italy.

## 12. Rendering, interaction, and accessibility

- Use UTF-8 throughout and render at least `à è é ì ò ù`, uppercase equivalents,
  apostrophes, and ordinary punctuation reliably.
- Accept straight and curly apostrophes as input variants while rendering a
  consistent editorial style. Do not silently remove apostrophes or required
  accents.
- On mobile, provide an optional Italian character strip and apostrophe key
  near text answers. It supplements, not replaces, normal keyboard input.
- Keep article, preposition, clitic, and word boundaries semantically accessible
  even when displayed as fused or attached forms.
- Paradigms are real HTML tables with headers. Agreement arcs, timelines,
  token trees, and clitic diagrams need equivalent text descriptions.
- Drag-and-drop ordering must have keyboard and button alternatives. Touch
  targets meet the shared app size standard.
- Audio controls expose labels, current state, replay count if limited, and a
  visible transcript toggle. Do not autoplay on page load.
- Waveforms, pitch traces, and color coding are optional supports; no question
  depends on color, hearing, fine pointer movement, or waveform interpretation
  alone unless that modality is explicitly the skill and an appropriate
  alternate path is offered.
- Long sentences reflow without horizontal scrolling. Ruby/furigana-style
  layout is unnecessary; use readable Italian type with generous line spacing.
- Screen-reader feedback announces the corrected form before a long
  explanation, and does not pronounce raw internal feature codes.
- Respect reduced-motion settings and never use timed disappearance as a
  language challenge.

## 13. Generator and offline implementation guidance

Use immutable reviewed linguistic data and pure seeded generation. A practical
module boundary is:

```text
seededRng
reviewedLexiconRegistry
licensedMorphologySnapshot
orthographyPronunciationRegistry
semanticFrameGenerator
featureBundleEngine
paradigmRealizer
nounPhraseEngine
prepositionArticleFusion
auxiliaryAspectEngine
cliticSequenceAutomaton
referenceDiscourseGraph
clauseLinearizer
numberDateTimeGrammar
dialogueStateEngine
textEntailmentAnnotations
audioAssetRegistry
faultInjector
unicodeItalianNormalizer
semanticAnswerChecker
accessibleRenderer
```

Each generated instance should archive:

- stable family/version and seed;
- difficulty and scaffold settings;
- semantic frame, entities, facts, event intervals, and discourse state;
- selected lexemes and source/version;
- complete morphosyntactic feature bundles;
- canonical surface form plus all licensed answer forms;
- tokenization, parse/dependency, referent, and evidence annotations;
- normalization and punctuation policy;
- audio asset/version where applicable;
- fault mutation and root cause for audits;
- distractor derivations and rejection reasons.

The browser must not download dictionaries, conjugators, corpora, TTS voices,
or answer services at runtime. A large external resource such as Morph-it! may
inform development, but the shipped app should contain a small, reviewed,
versioned learner subset with corrected metadata and explicit licenses. Corpus
frequency is not grammatical truth, and an unattested generated form is not
automatically invalid.

Generate from meaning to form:

1. choose a can-do and difficulty;
2. create a semantic/event/discourse frame;
3. select reviewed lexemes compatible with that frame;
4. assign features and construction;
5. realize noun phrases, verb complex, clitics, clauses, and orthography;
6. parse the result back and verify semantic/feature identity;
7. derive the answer and explanations independently;
8. create distractors from logged misconception transformations;
9. reject collisions, ambiguity, unsupported variants, and awkward combinations.

The answer checker should parse only the grammar promised by the prompt. For
selection and ordering, compare stable IDs. For text, tokenize and normalize
Unicode/apostrophe/case/punctuation according to the item policy, then compare
feature structures or enumerated realizations. Never use a loose edit-distance
threshold to declare a sentence correct. A pedagogical “almost” state may point
to one local mismatch without recording success.

## 14. Automated and linguistic validation

### Data-build checks

- Every lemma has a unique stable ID, part of speech, inflection class,
  frequency band, learner level, semantic tags, and source/review status.
- Nouns specify gender, plural behavior, countability where relevant, and
  article-onset compatibility.
- Verbs specify full shipped paradigms or verified rules plus overrides,
  auxiliary by sense/construction, argument frames, reflexive/pronominal status,
  and participle behavior.
- Adjectives and determiners specify agreement classes and placement/meaning
  restrictions.
- Prepositions, connectors, clitics, `ci/ne/si`, and idiomatic constructions use
  reviewed typed entries, not unstructured glosses.
- Every accepted variant has scope metadata: variety, register, style, family,
  and explanation.
- Every audio asset has a matching transcript, feature labels, license, and
  completed human review.

### Instance invariants

- Surface form reparses to the generated semantic and feature structure.
- Article allomorph agrees with gender, number, and actual phonological onset.
- Every modifier agrees with its licensed head unless the construction marks an
  exception.
- Verb form agrees with its subject or construction; compound tense auxiliary
  and participle behavior match the sense and dependency context.
- Clitic semantic roles, sequence, host, attachment, apostrophe, and referents
  are licensed.
- `ci`, `ne`, and `si` have one intended construction in the supplied context,
  or every valid interpretation is accepted.
- Temporal/aspect forms are compatible with the stored event timeline.
- Mood and conditional forms match an explicit trigger/factuality profile.
- Register features are internally consistent.
- Reading/listening keys are entailed by annotated source evidence; distractors
  are false or unsupported for recorded reasons.
- The normalized accepted-answer set contains no distractor.
- Audit items differ from a valid instance by exactly the logged root mutation.

### Test volume and independent oracles

- Exercise every family at every supported difficulty for at least 10,000
  deterministic seeds before release.
- Use at least 25,000 seeds per level for high-interaction families: article
  onset, past aspect/auxiliary, participle agreement, clitic clusters,
  `ci/ne/si`, mood/conditionals, reference, and discourse audits.
- Exhaustively enumerate every shipped finite paradigm cell, pronoun/clitic
  form, articulated preposition, and article-onset class.
- Exhaustively test approved Unicode normalization, straight/curly apostrophe,
  capitalization, accent, whitespace, and punctuation policies.
- Recompute numeric/date/time answers with a separate pure oracle.
- Validate semantic-frame realization and back-parsing with independently
  written checks, not the same function that generated the answer.
- Snapshot representative layouts, long strings, diagrams, and all audio states
  at phone and desktop widths.
- Manually review every audio prompt and a stratified sample from every
  template/lexeme/variant/fault combination. Automated tests cannot certify
  idiomaticity or sociolinguistic appropriateness.

On any invariant failure, discard the item, log seed/family/version, and show
another. Never silently fall back to an unreviewed answer.

## 15. Coverage and balance requirements

A release report should show, by family and level:

- generation count, rejection rate, and distinct semantic frames;
- lemma and semantic-domain distribution;
- native versus loan-letter patterns, sound–spelling rules, stress, accents,
  apostrophes, and consonant-length contrasts;
- noun gender/plural classes, onset classes, articles, prepositions, and
  agreement combinations;
- verb class, person/number, tense/aspect/mood, irregularity, auxiliary,
  participle behavior, and construction;
- clitic role, form, cluster length/order, host type, `ci/ne/si`, and referent
  distance;
- connector/relation, clause type, question/negation/relative construction,
  register, and discourse order;
- text genre, speech act, comprehension operation, evidence distance, speaker,
  audio speed, and modality;
- response format, scaffold level, misconception transformation, and recent
  repetition.

Enforce caps so that `-are` verbs, masculine `-o` nouns, present tense, `il`,
first-person singular, direct object `lo`, and literal one-clause translation do
not dominate simply because they are easy to generate. Coverage need not mirror
a raw corpus; it should balance frequency, communicative value, contrast, and
the learner's demonstrated needs.

## 16. Content and implementation checklist

- [ ] The app states its target (adult general Italian, roughly A1–early B1)
      without claiming certification.
- [ ] Standard contemporary Italian is the production baseline; reviewed
      regional/register variants are labeled and accepted where relevant.
- [ ] Every generated word and inflection comes from reviewed, versioned data.
- [ ] Noun gender, plural, and article onset are stored, not guessed from final
      letters alone.
- [ ] Auxiliary choice and participle agreement are construction-aware.
- [ ] Clitics use typed roles, a sequence grammar, and host-specific placement.
- [ ] `ci`, `ne`, `si`, and `piacere` have dedicated construction models.
- [ ] Past aspect uses event timelines, not English keyword matching.
- [ ] Subjunctive and conditional items state enough context to determine the
      intended interpretation and accept licensed variation.
- [ ] Free translation, free conversation, essays, and vague paraphrase grading
      are outside the checker.
- [ ] All valid generated order, punctuation, capitalization, and register
      variants are accepted and explained.
- [ ] Audio is bundled, licensed, multi-speaker, human-reviewed, and usable
      without a microphone.
- [ ] Speaking recordings remain local and receive no bogus pronunciation score.
- [ ] Reading/listening questions retain evidence spans and entailment checks.
- [ ] Cultural examples are fictional or licensed, inclusive, and not trivia.
- [ ] Every distractor corresponds to one plausible documented misconception.
- [ ] Audit questions contain one logged root fault.
- [ ] Deterministic seeds reproduce prompt, answer, variants, audio, and
      explanation.
- [ ] Accessibility alternatives cover diagrams, ordering, audio controls, and
      character input.
- [ ] The complete app works from a standalone HTML/JS/CSS bundle with no
      backend or runtime network dependency.

## 17. Stable IDs and recommended navigation

Stable identifiers must be language-neutral and independent of visible labels.
Use:

```text
italian-language/<category-id>/<family-id>/<schema-version>
```

Persist the seed, generator/data versions, selected lexeme IDs, semantic frame,
feature bundle, answer policy, audio asset ID, and fault ID. A content change
that could alter the keyed answer increments the schema or data version so a
saved result remains reproducible.

Recommended learner-facing navigation:

1. **Sounds & Spelling**
2. **Words & Noun Phrases**
3. **Verbs & Time**
4. **Pronouns & Sentence Structure**
5. **Connected Italian**
6. **Reading, Listening & Interaction**

Filters may expose level, family, modality, input mode, register, vocabulary
domain, and “review my errors.” Internal names such as “clitic sequence
automaton” belong in developer diagnostics, not the learner UI.
