# Korean Language — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, Korean-content editor, Hangul/input checker, text/audio renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Korean Language: Contemporary South Korean Standard

### Topic goal

Develop practical beginner-to-lower-intermediate Korean by repeatedly connecting Hangul, sound, vocabulary, spacing, particles, inflection, speech level, numbers, reading, listening, controlled writing, and guided speaking.

Learners should become faster and more reliable at:

- reading and composing modern Hangul syllable blocks;
- relating dictionary spelling to actual standard pronunciation;
- selecting particles and endings from grammatical and discourse context;
- inflecting verbs and adjectives across common tense, aspect, politeness, and honorific patterns;
- handling ordinary numbers, counters, dates, time, and prices;
- understanding short messages, notices, and conversations;
- producing a constrained response appropriate to a clearly stated relationship and situation.

The app trains usable language rather than terminology recall. Labels such as “topic particle,” “connective ending,” or “해요체” should support feedback, but most prompts should ask what a form means, which form fits, what was heard, or how to express a bounded intention.

### Language and writing boundary

The target is contemporary standard Korean as used in South Korea.

- Modern Hangul is the canonical writing system.
- South Korean spelling, spacing, standard pronunciation, vocabulary, and Revised Romanization conventions are used.
- Hanja production is excluded. A reviewed Hanja origin may appear as an optional vocabulary note when it genuinely helps distinguish words.
- North Korean spelling, vocabulary, pronunciation, and cultural conventions are outside the production target. They may appear only in explicitly labeled comparative material beyond the initial scope.
- Revised Romanization is an early pronunciation/navigation scaffold, not a replacement for Hangul and not an exact phonetic transcription.
- The curriculum may use internal foundation/A1-oriented/A2-oriented/early-B1-oriented bands, but it does not certify a TOPIK, CEFR, or other exam level.

### Scope

The topic includes:

- modern consonant/vowel jamo, syllable-block construction, keyboard input, and Unicode-safe decomposition/composition;
- lax/aspirated/tense consonants, important vowel contrasts, 받침, liaison, neutralization, aspiration, nasal/lateral assimilation, and tensification in reviewed words/phrases;
- contextual vocabulary, collocations, spelling–pronunciation mapping, word boundaries, spacing, homophones, common loanwords, and dictionary forms;
- Sino-Korean and native-Korean numbers, system choice, common counters, dates, clock time, durations, digit strings, prices, decimals, fractions, and percentages;
- topic/subject/object and core adverbial particles, possession/association, neutral word order, predicates, existence/location, negation, questions, and descriptive verbs/adjectives;
- common polite, formal, and explicitly casual forms; tense, future/intention, requests, honorific `-(으)시-`, irregular inflection, aspect, experience, and negation;
- connective endings, relative clauses, nominalization, reported speech, comparison, reason, contrast, condition, sequence, and register/pragmatics;
- short reading, notices/messages, dialogue completion, reference/ellipsis, dictation, listening comprehension, and guided speaking/shadowing;
- adaptive romanization/gloss support, bundled human-recorded audio, and optional local recording for self-review.

### Exclusions

Do not include:

- open-ended translation, essay grading, unrestricted conversation, or claims to accept every natural Korean paraphrase;
- North Korean production norms, regional dialect production, historical Korean, Middle Korean, obsolete jamo, or premodern orthography;
- a Hanja curriculum, exhaustive Sino-Korean etymology, calligraphy grading, free handwriting recognition, or OCR;
- advanced phonetics, dialect/accent grading, or automatic claims that a learner’s pronunciation is correct;
- exhaustive honorific/humble vocabulary, ceremonial language, legal/business correspondence, academic writing, or broadcast-announcer training;
- obscure speech levels as productive beginner material or the claim that all Korean interactions fit one simple age hierarchy;
- deep numeracy, financial arithmetic, exchange rates, traditional units, or rare/classical counters;
- unrestricted idiom/proverb/onomatopoeia memorization or vocabulary lists without generated context;
- cloud translation, cloud speech recognition, cloud text-to-speech, or uploaded recordings;
- runtime language-model judgments about naturalness;
- machine-generated sentences/audio published without proficient-speaker review;
- cultural stereotypes or prompts requiring one supposedly universal “Korean custom.”

### Language variety, relationship, and usage policy

- Core content uses contemporary South Korean standard language.
- Every dialogue template may specify `speaker`, `listener`, age/status relationship when relevant, familiarity, setting, speech level, and whether subject honorification applies.
- Speech level and subject honorification are separate:
  - `해요체` is a common polite style;
  - `하십시오체` is a deferential/formal style;
  - `해체` is casual/intimate and requires an explicit licensed relationship;
  - `-(으)시-` honors the grammatical subject and may occur within more than one speech level.
- Do not equate “polite,” “formal,” “honorific,” and “respectful vocabulary.”
- Natural variation and real-world speech-level mixing must not be labeled ungrammatical. For generated production, either provide enough context for one target, accept reviewed alternatives with nuance, or use interpretation/choice.
- Avoid exercises that infer gender, personality, morality, or status from an ending alone.

Every item distinguishes:

1. **canonical target**, displayed for the requested pattern;
2. **accepted variant**, natural with the same intended meaning/relationship;
3. **contextually different**, grammatical but changes stance, focus, formality, or meaning;
4. **incorrect**, violates the controlled spelling, grammar, or context.

### Linguistic data model

Every lexical entry is authored and versioned:

```text
Lexeme := {
  id,
  lemma,
  partOfSpeech,
  stem,
  hangulSpellings[],
  jamoSyllables[],
  underlyingSegments[],
  surfacePronunciations[],
  romanizations[],
  senses[],
  semanticTags[],
  selectionalTags[],
  transitivity,
  irregularClass,
  honorificLexeme,
  counterCompatibility[],
  register,
  spacingPattern,
  commonCollocations[],
  acceptedVariants[],
  audioIds[],
  exampleTemplateIds[],
  provenance
}
```

Grammar templates are typed semantic/discourse structures:

```text
SentenceTemplate := {
  semanticRoles,
  discourseState,
  slots,
  particleConstraints,
  wordOrderConstraints,
  tenseAspectMood,
  speechLevel,
  subjectHonorification,
  relationship,
  contextConditions,
  acceptedRealizations[],
  rejectionRules[]
}
```

Generate meaning, participants, discourse state, and social relationship first. Then select compatible lexemes, attach particles/endings, apply phonological realization for audio, validate accepted forms, and render. Never build sentences by blindly substituting words into an English-shaped string.

### Hangul and Unicode conventions

- Internally represent each modern syllable as `choseong + jungseong + optional jongseong`.
- Support all 19 modern initial consonants, 21 modern vowels, and 27 nonempty modern final consonant values.
- Accept canonically equivalent precomposed Hangul syllables and conjoining-jamo sequences by normalizing to NFC for ordinary text comparison.
- Do not conflate compatibility jamo with conjoining jamo before determining whether the task assesses isolated letter identity or syllable composition.
- Treat one rendered syllable block as a grapheme unit; never place a cursor, line break, or highlight inside it unless the task intentionally exposes its jamo.
- The null initial in a vowel-initial written syllable is represented orthographically by `ㅇ`; it is not a spoken initial consonant.
- Only modern Hangul is generated. Reject archaic/nonstandard jamo sequences.
- Standard Korean spacing is significant in spacing tasks. In grammar or meaning tasks, only enumerated harmless whitespace variants may normalize.

### Spelling and surface-pronunciation policy

The oracle stores separately:

1. dictionary/orthographic syllables;
2. underlying segment and morpheme boundaries;
3. rule applications licensed across those boundaries;
4. reviewed surface pronunciation;
5. Revised Romanization when requested.

Core modeled processes include:

- final-consonant neutralization into the standard limited set of 받침 realizations;
- liaison/resyllabification before a vowel-initial following syllable;
- nasal assimilation;
- lateral assimilation;
- aspiration involving `ㅎ`;
- palatalization in reviewed environments;
- tensification in lexical/morphological contexts;
- reviewed contraction or weakening in common inflected forms.

Rules must be boundary aware. Do not run global character replacement over an arbitrary string. Lexical exceptions and more than one accepted standard realization are stored per entry.

Examples:

- `옷` retains spelling `옷` although its isolated final is not pronounced as initial `ㅅ`;
- `옷이` is modeled from the morpheme boundary and reviewed pronunciation, not respelled as `오시`;
- `국물` keeps its spelling while the recording/phonological annotation reflects nasal assimilation;
- `같이` retains `같이` while the standard modeled pronunciation reflects palatalization.

### Romanization policy

- Canonical romanization follows South Korea’s Revised Romanization and is based on standard pronunciation where the system specifies.
- Romanization is display/navigation support, not the primary answer form after the Hangul foundation stage.
- Case and harmless hyphen variation may normalize only when name formatting is not assessed.
- Do not accept McCune–Reischauer spellings or ad hoc English spellings as canonical answers.
- Romanization may obscure distinctions or expose surface processes differently from Hangul; the task must say whether it asks for spelling, pronunciation, or official romanization.
- Proper names and established public spellings may have conventions beyond the word drills. Exclude them from automatic derivation unless explicitly authored.

### Korean input and answer checking

Supported response modes:

- single/multiple choice;
- isolated-jamo selection;
- syllable-block construction;
- Hangul short text;
- numeric input;
- token/eojeol ordering;
- particle or ending slot;
- inflected-form fields;
- matching;
- dictation;
- local record-and-compare for self-review only.

Checking layers:

1. normalize allowed Unicode composition and punctuation;
2. segment against the known lexemes, morphemes, and eojeol structure;
3. compare spelling, stem, particle allomorph, inflection features, spacing, speech level, honorification, word order, and semantic roles as relevant;
4. accept enumerated equivalent contractions/forms;
5. reject or restructure any prompt whose free-form answer cannot be decided locally.

Spacing:

- preserve standard spacing in canonical answers;
- ignore leading/trailing and repeated spaces when spacing is not assessed;
- accept a spacing variant only when specifically reviewed;
- do not remove all spaces before comparison, because that can convert a different analysis into a false correct answer.

Romanization may be accepted at early levels when sound/meaning is targeted, but not when Hangul production, spelling, or spacing is the skill.

### Number conventions and limits

Numbers are included for everyday Korean fluency but remain shallower than a dedicated numbers app.

- Sino-Korean numbers cover `0..99,999,999` with `십/백/천/만`; selected `억` recognition may appear at the upper level.
- Native-Korean numbers cover productive everyday forms through `99`, with shortened attributive forms before relevant counters.
- The task chooses the number system from semantic context; do not allow either system indiscriminately.
- Common counters are drawn from a reviewed noun/activity table.
- Clock hours normally use native-Korean forms; minutes/seconds and most calendar values use Sino-Korean forms.
- Dates use the Gregorian calendar and South Korean order `년 월 일`.
- Digit strings use Sino-Korean digit readings; `0` variants such as `공/영` are context specific.
- Money uses South Korean won (`원`) and exact integer values; no exchange-rate arithmetic.
- Decimals use `점`, percentages may use `퍼센트`, and simple fractions use `분의`.
- Age contexts state the requested convention and avoid social/legal age calculations.

### Audio and listening architecture

Listening is core and must work offline.

- Ship a compact, licensed, human-recorded corpus covering jamo contrasts, syllables, 받침, sound changes, words, inflections, number expressions, sentences, and dialogues.
- Store transcript, underlying form, reviewed surface pronunciation, speaker, speed, speech level, relationship, and semantic annotation.
- Record multiple speakers where practical. Balance answer labels across speaker, duration, loudness, pitch range, and recording session.
- Do not synthesize natural Korean by concatenating jamo or isolated syllable recordings.
- Optional browser `speechSynthesis` may give extra exposure but varies by installed voice and offline support. Label it “device voice” and never use it as the pronunciation oracle.
- Provide separately recorded normal and selected learner-slow versions for important processes; playback-rate slowing is supplemental.
- Audio starts after user gesture. File names, preload order, duration, and speaker must not reveal the answer.

### Speaking and recording policy

Guided speaking includes shadowing, reading aloud, and rehearsing a constrained reply.

- Microphone use is optional, permission-gated, local, and never required for mastery.
- The learner may alternate reference and self-recorded audio and view waveform/duration.
- The app must not assign a correctness score to arbitrary pronunciation, speech level, or accent.
- Coarse timing/energy displays may be descriptive but are not pronunciation judgments.
- Recordings can be stopped/deleted, are never uploaded, and disappear on close unless explicitly downloaded.
- A no-record speaking path remains available.

### Difficulty philosophy

Difficulty should rise through:

- composing after recognizing jamo/syllables;
- reducing romanization, gloss, and morpheme-boundary scaffolds;
- moving from careful citation words to connected speech;
- contrasting closer consonants, vowels, particles, endings, and speech levels;
- increasing the dependency between stem, final consonant/vowel, ending, and irregular class;
- tracking omitted arguments and discourse topic;
- transferring between Hangul, audio, meaning, and context-appropriate production;
- combining two or at most three mastered operations.

It must not rise through tiny Hangul, rare spellings, arbitrary spacing traps, unnaturally long agglutinated forms, excessive typing, extreme audio speed, unreliable speech recognition, giant arithmetic, or missing relationship context.

### Global instance and distractor contract

Each instance stores:

`categoryId`, `familyId`, `level`, `canDoTag`, `semanticFrame`, `discourseState`, `relationship`, `lexemeIds`, `morphemeTree`, `hangulText`, `jamoSyllables`, `underlyingSegments`, `surfacePronunciation`, `romanization`, `grammarFeatures`, `speechLevel`, `subjectHonorification`, `context`, `audioId`, `responseMode`, `canonicalAnswer`, `acceptedVariants`, `misconceptionsTargeted`, `difficultyDimensions`, `workedExplanation`, `dataVersion`, and `structuralSignature`.

Construct distractors from one traceable error where possible:

- visually or auditorily confusable jamo;
- wrong syllable-block position or 받침;
- spelling copied from surface pronunciation;
- missed or overapplied sound change;
- wrong native/Sino number system or counter;
- wrong particle allomorph or semantic role;
- regular inflection applied to a lexical irregular, or vice versa;
- wrong tense/aspect, ending, speech level, or honorific feature;
- reversed participant, direction, comparison, or discourse topic;
- grammatical response with the wrong dialogue act.

Do not use random malformed strings. Validate that distractors remain distinct after normalization, are not accepted variants, and diagnose the named misconception. Single-choice questions must have exactly one best answer under the displayed linguistic/social context.

Reject recent structural signatures within 20 questions and exact sentence/audio instances within 100.

## 2. Category: Hangul, Pronunciation, and Input

### Category purpose

Build automatic modern Hangul decoding/composition and an accurate separation between written syllable structure and standard surface pronunciation.

### Learn

Hangul letters form syllable blocks: an initial consonant, a vowel, and sometimes a final consonant. The same letter can have different phonetic realization by position and context. Read the spelling accurately first, then apply reviewed pronunciation rules across morpheme and word boundaries.

### Common misconceptions

- Reading a syllable block as one indivisible picture.
- Treating initial `ㅇ` as a spoken consonant.
- Confusing tense and aspirated consonants with simple voiced/unvoiced pairs.
- Pronouncing every final consonant as though it began the next syllable.
- Respelling words to match connected speech.
- Applying liaison or assimilation across every visible boundary.
- Treating romanization as English phonetic spelling.

### Family `jamo_recognition`

**Task.** Identify a modern consonant/vowel jamo by shape, name, position, or reviewed sound.

**Difficulty.** L1 basic jamo; L2 doubled/aspirated/compound jamo; L3 initial versus final role.

**Examples.**

1. `ㄴ` → consonant `니은`.
2. `ㅓ` → vowel romanized `eo`.
3. distinguish `ㄱ/ㅋ/ㄲ`.

**Validation.** Pinned modern-jamo inventory and position-aware labels.

### Family `syllable_block_composition`

**Task.** Assemble chosen jamo into the correct modern Hangul syllable block.

**Difficulty.** L1 initial+vowel; L2 add final; L3 compound vowel/final.

**Examples.**

1. `ㄱ + ㅏ` → `가`.
2. `ㅎ + ㅏ + ㄴ` → `한`.
3. `ㄱ + ㅘ + ㄴ` → `관`.

**Validation.** Unicode Hangul composition algorithm and legal modern L/V/T inventory.

### Family `syllable_block_decomposition`

**Task.** Decompose a precomposed syllable into initial, vowel, and optional final jamo.

**Difficulty.** L1 open syllable; L2 simple final; L3 compound final.

**Examples.**

1. `나` → `ㄴ + ㅏ`.
2. `밥` → `ㅂ + ㅏ + ㅂ`.
3. `읽` → `ㅇ + ㅣ + ㄺ`.

**Validation.** Canonical decomposition round-trip; preserve positional jamo identity.

### Family `hangul_keyboard_input`

**Task.** Enter or select the key sequence for a word using a displayed standard 두벌식 layout.

**Difficulty.** L1 basic jamo; L2 shift/double consonant; L3 compound vowels/finals in a word.

**Examples.**

1. compose `가` from the displayed `ㄱ`, then `ㅏ` keys.
2. type `빵` using the doubled initial.
3. type `괜찮아요` with previewed syllable composition.

**Validation.** Deterministic 두벌식 key map and browser-IME-independent on-screen fallback.

### Family `consonant_contrast`

**Task.** Hear or select the spelling for lax, aspirated, and tense consonant contrasts.

**Difficulty.** L1 careful initial syllables; L2 word contrast; L3 intervocalic/contextual realization.

**Examples.**

1. distinguish `달/탈/딸`.
2. hear `불/풀`.
3. choose the recorded word among `가다/까다` in a reviewed context.

**Validation.** Human-recorded contrast sets balanced by speaker; no English voicing labels as sole oracle.

### Family `vowel_contrast`

**Task.** Hear, identify, or produce a high-value vowel/compound-vowel contrast.

**Difficulty.** L1 distant vowels; L2 `ㅓ/ㅗ`, `ㅡ/ㅜ`; L3 mergers/variable contrasts handled as recognition sets.

**Examples.**

1. distinguish `ㅏ/ㅓ`.
2. hear `눈/는` in controlled syllables.
3. `ㅐ/ㅔ` spelling is tested from known words, not assumed reliably distinct in every speaker’s audio.

**Validation.** Speaker-specific recordings and spelling lexicon; merged realizations cannot form a forced audio-only choice.

### Family `batchim_identity`

**Task.** Identify the written final jamo and its reviewed isolated syllable-final realization.

**Difficulty.** L1 simple finals; L2 several spellings sharing a surface category; L3 compound finals.

**Examples.**

1. `산` has final `ㄴ`.
2. `옷` has written final `ㅅ`, with the modeled unreleased final category in isolation.
3. `읽` has compound final `ㄺ`.

**Validation.** Separate orthographic jongseong and surface-final category.

### Family `liaison_and_palatalization`

**Task.** Predict or identify reviewed resyllabification/palatalization before a vowel-initial suffix/word.

**Difficulty.** L1 simple liaison; L2 spelling preserved across suffix; L3 palatalization.

**Examples.**

1. `옷이` keeps spelling `옷이` while the modeled pronunciation begins the second syllable with `ㅅ`.
2. `한국어` demonstrates liaison across the reviewed word structure.
3. `같이` has a reviewed palatalized surface pronunciation while retaining spelling.

**Validation.** Morpheme/word-boundary-aware phonological rules plus recorded oracle.

### Family `assimilation_aspiration_tensification`

**Task.** Choose or explain the reviewed surface result of a common consonant interaction.

**Difficulty.** L1 nasal assimilation; L2 aspiration/lateralization; L3 lexical/morphological tensification.

**Examples.**

1. `국물` models nasal assimilation but remains spelled `국물`.
2. `좋다` models aspiration associated with `ㅎ`.
3. `학교` retains spelling while the second consonant is tensified in the standard modeled pronunciation.

**Validation.** Rule table keyed by underlying segments and boundaries; stored exceptions override productive rules.

### Family `revised_romanization`

**Task.** Convert a reviewed Hangul word to/from Revised Romanization, with pronunciation-sensitive cases controlled.

**Difficulty.** L1 direct vowels/consonants; L2 positional consonants; L3 reviewed sound-change or name boundary.

**Examples.**

1. `한글` → `hangeul`.
2. `서울` → `Seoul` as the established authored place-name form.
3. distinguish Hangul spelling from the pronunciation basis used in a reviewed romanization example.

**Validation.** Pinned official table plus authored proper-name exceptions; never derive an arbitrary person’s preferred spelling.

## 3. Category: Vocabulary, Spelling, and Spacing

### Category purpose

Learn Korean words as meaning–usage–spelling–pronunciation units and build reliable written word boundaries.

### Learn

Dictionary spelling often preserves morphemes even when pronunciation changes. Korean spacing separates words/eojeol, while particles and endings usually attach to their host. Learn vocabulary in sentences and collocations rather than by substituting one English gloss.

### Common misconceptions

- Writing the pronunciation instead of the standard spelling.
- Separating a particle or ending as an independent word.
- Joining every semantic phrase without spaces.
- Treating all English equivalents as interchangeable Korean words.
- Assuming a dictionary form ending in `다` is the natural form for every sentence.
- Reconstructing common loanwords from English spelling rather than Korean convention.

### Family `contextual_vocabulary`

**Task.** Choose or produce a reviewed word fitting a picture, sentence, or semantic role.

**Difficulty.** L1 concrete noun/action; L2 descriptive verb/adverb; L3 near-neighbor meaning/register.

**Examples.**

1. `물을 ___.` → `마셔요`.
2. choose `빌리다` versus `빌려주다` from borrower/lender roles.
3. choose `알다` versus `만나다` from knowledge/encounter context.

**Validation.** Typed semantic slots and reviewed contrast sets.

### Family `collocation_choice`

**Task.** Select the conventional predicate–noun or fixed expression for a controlled context.

**Difficulty.** L1 common daily phrase; L2 competing predicate; L3 register or light-verb construction.

**Examples.**

1. `사진을 찍다`.
2. `감기에 걸리다`.
3. `약속을 지키다`.

**Validation.** Reviewed collocation table with declared alternatives.

### Family `word_spelling_reading`

**Task.** Map a known word between canonical Hangul spelling, meaning, and reviewed pronunciation.

**Difficulty.** L1 transparent word; L2 받침/sound change; L3 same syllables with different boundary analysis.

**Examples.**

1. “school” → `학교`.
2. recognize `국물` from its reviewed assimilated recording.
3. select `같이`, not a pronunciation-based misspelling.

**Validation.** Lexeme spelling and surface form remain separate.

### Family `spelling_from_pronunciation`

**Task.** Choose the canonical spelling of a recorded known word when pronunciation underdetermines the letters.

**Difficulty.** L1 transparent; L2 final neutralization; L3 assimilation/tensification.

**Examples.**

1. clear recording → `나무`.
2. isolated final sound plus context → `옷`, not a guessed phonetic spelling.
3. recorded `국물` → canonical `국물`.

**Validation.** Choices come from known lexemes fitting the context; audio alone never pretends to recover an unknowable spelling.

### Family `spacing_and_eojeol`

**Task.** Insert/remove spaces or select the standard spacing of a controlled sentence.

**Difficulty.** L1 noun+particle attachment; L2 auxiliary/dependent noun patterns; L3 reviewed ambiguous-looking boundary.

**Examples.**

1. `저는 학생이에요.`: `는` attaches to `저`.
2. `학교에 가요.`: particle attaches, words remain separated.
3. choose the reviewed spacing for a construction containing `수 있다`.

**Validation.** Versioned spacing pattern and morpheme/eojeol tree; accepted variants explicitly enumerated.

### Family `homophone_context`

**Task.** Distinguish same- or near-sounding words through sentence meaning and spelling.

**Difficulty.** L1 clearly different meanings; L2 same spelling with different sense; L3 sound-change-created similarity.

**Examples.**

1. `눈` in weather context → snow; in face context → eye.
2. choose `배` from pear/boat/stomach context.
3. select the intended spelling from two reviewed words whose surface forms overlap.

**Validation.** Sense IDs and semantic frames; no unsupported Hanja knowledge required.

### Family `loanword_spelling`

**Task.** Recognize or produce a curated common Korean loanword in standard Hangul spelling.

**Difficulty.** L1 familiar word; L2 consonant/vowel adaptation; L3 distinguish current standard from English-shaped guess.

**Examples.**

1. `coffee` → `커피`.
2. `computer` → `컴퓨터`.
3. `service` in a specifically taught Korean sense → `서비스`.

**Validation.** Reviewed South Korean loanword lexicon and sense; no productive guesser is the sole oracle.

### Family `dictionary_form_and_stem`

**Task.** Recover a lemma/stem from an inflected word or identify the dictionary form.

**Difficulty.** L1 remove transparent `다`; L2 vowel contraction; L3 irregular/lexical stem.

**Examples.**

1. `먹어요` → `먹다`, stem `먹-`.
2. `가요` → `가다`.
3. `들어요` in the supplied “listen” context → `듣다`.

**Validation.** Morphological analyzer restricted to the pinned lexicon and context.

## 4. Category: Numbers, Counters, Dates, and Prices

### Category purpose

Build practical fluency choosing and using Korean’s two number systems in everyday contexts.

### Learn

Sino-Korean and native-Korean numbers divide the work. Dates, minutes, prices, phone digits, and most arithmetic-style quantities normally use Sino-Korean forms. Hours, age in common conversational contexts, and many counters use native-Korean forms. Several native forms shorten before counters.

### Common misconceptions

- Using one number system everywhere.
- Keeping `하나/둘/셋/넷/스물` unchanged before counters.
- Mixing native tens with Sino ones.
- Using native numbers beyond their ordinary productive range.
- Reading a phone number as one cardinal value.
- Using native hours for minutes as well.
- Missing `유월/시월` in month pronunciation.

### Family `sino_korean_number`

**Task.** Convert between Arabic numerals and Sino-Korean cardinal forms.

**Difficulty.** L1 `0..99`; L2 hundreds/thousands; L3 `만` and selected `억`.

**Examples.**

1. `18` → `십팔`.
2. `326` → `삼백이십육`.
3. `12,345` → `만 이천삼백사십오`.

**Validation.** Exact place/section algorithm with canonical zero suppression.

### Family `native_korean_number`

**Task.** Convert a supported quantity between Arabic and native-Korean forms.

**Difficulty.** L1 `1..10`; L2 tens through `99`; L3 full versus counter-shortened form.

**Examples.**

1. `3` standalone → `셋`.
2. `20` standalone → `스물`.
3. before a counter, `20` → `스무`.

**Validation.** Reviewed `1..99` table and attributive-form feature.

### Family `number_system_choice`

**Task.** Choose Sino-Korean or native-Korean from a clearly labeled semantic context.

**Difficulty.** L1 price versus objects; L2 clock hour/minute; L3 age, floor, or mixed expression.

**Examples.**

1. `7,000원` uses Sino-Korean `칠천 원`.
2. `3시` → native `세 시`.
3. `3시 20분` mixes `세 시` with Sino-Korean `이십 분`.

**Validation.** Context-to-system table; ambiguous real-world variants are accepted or excluded.

### Family `counter_phrase`

**Task.** Select a common counter and construct/interpret its number phrase.

**Difficulty.** L1 `개/명`; L2 `권/병/잔/번`; L3 shortened native form and alternate honorific counter.

**Examples.**

1. `three items` → `세 개`.
2. `two books` → `두 권`.
3. polite count of four people → `네 분`.

**Validation.** Reviewed noun/activity–counter map and social-context constraints.

### Family `date_calendar`

**Task.** Read or interpret a valid Gregorian date, year, month, or weekday.

**Difficulty.** L1 month/day; L2 full date; L3 month pronunciation and schedule context.

**Examples.**

1. `7월 25일` → spoken `칠월 이십오일`; written-out spacing follows the pinned norm and its permitted variant.
2. `2026년` → `이천이십육 년`.
3. `6월/10월` use reviewed readings `유월/시월`.

**Validation.** Calendar validity, distinct year/month/day renderer, and an explicit table for principle spacing versus permitted attached unit forms.

### Family `clock_and_duration`

**Task.** Read or interpret clock time or a simple duration with the correct number system.

**Difficulty.** L1 whole hour; L2 hour+minute; L3 duration versus clock and shortened/native variants.

**Examples.**

1. `2:00` → `두 시`.
2. `4:30` → `네 시 삼십 분` (`네 시 반` accepted).
3. `2시간 15분` → `두 시간 십오 분`.

**Validation.** Time structure plus native-hour/Sino-minute rule; do not infer clock time from duration.

### Family `digit_string`

**Task.** Read or reconstruct a telephone or explicitly labeled code-like digit sequence.

**Difficulty.** L1 short sequence; L2 repeated zero; L3 grouped telephone recording.

**Examples.**

1. `204` as an access code → `이공사`.
2. hear `공일공` → `010`.
3. preserve group boundaries in a generated telephone-style sequence.

**Validation.** One reading per digit from context-specific `공/영` table; never apply cardinal rules.

### Family `money_price`

**Task.** Convert or interpret a South Korean won price.

**Difficulty.** L1 whole thousands; L2 `만` grouping; L3 spoken shopping context or change calculation limited to one subtraction.

**Examples.**

1. `₩5,000` → `오천 원`.
2. `₩12,000` → `만 이천 원`.
3. hear `삼만 오천 원` → `₩35,000`.

**Validation.** Exact integer won; optional change problem uses exact subtraction and does not become finance practice.

### Family `decimal_fraction_percent`

**Task.** Read, write, or interpret a simple decimal, fraction, or percentage.

**Difficulty.** L1 decimal; L2 percentage; L3 fraction direction.

**Examples.**

1. `3.14` → `삼점일사`.
2. `25%` → `이십오 퍼센트`.
3. `1/3` → `삼분의 일`.

**Validation.** Exact decimal/rational structure; no binary floating-point comparison.

## 5. Category: Particles and Core Sentence Structure

### Category purpose

Map semantic roles and discourse status to particles, predicates, negation, and neutral Korean clause order.

### Learn

Korean normally places the predicate last. Particles attach to noun phrases and mark topic, grammatical role, location, direction, association, and other relations. Many particles have consonant/vowel allomorphs. Subjects and objects are often omitted when context makes them recoverable.

### Common misconceptions

- Treating `은/는` and `이/가` as interchangeable decoration.
- Selecting particle forms by the spelling before the whole phrase is known.
- Confusing static destination/time `에` with action location `에서`.
- Adding an English-style pronoun where Korean naturally omits one.
- Treating descriptive verbs/adjectives as nouns needing a copula.
- Using dictionary `다` as a polite conversational ending.
- Equating longer word order with more politeness.

### Family `topic_subject_particles`

**Task.** Choose or interpret `은/는` versus `이/가` in an authored discourse.

**Difficulty.** L1 established topic/new subject; L2 contrast; L3 exhaustive/new-information context.

**Examples.**

1. `저는 학생이에요.` frames `저` as topic.
2. `누가 왔어요? 민지가 왔어요.`
3. `커피는 좋아하지만 차는...` uses contrastive topics.

**Validation.** Discourse state and allomorph selection; ambiguous cases accept variants or are rejected.

### Family `object_particle`

**Task.** Select or interpret `을/를` for a direct object in a controlled clause.

**Difficulty.** L1 visible object; L2 omitted subject/topic; L3 colloquial omission interpreted but not overgeneralized.

**Examples.**

1. `밥을 먹어요.`
2. `커피를 마셔요.`
3. in a casual reviewed utterance `커피 마셔요`, explain the omitted object particle without treating omission as universal.

**Validation.** Verb valency, host-final allomorph, and declared omission register.

### Family `e_eseo_location_time`

**Task.** Choose among `에` and `에서` for destination, time, static location, action location, or source.

**Difficulty.** L1 destination/action location; L2 existence/time; L3 `에서` source.

**Examples.**

1. `학교에 가요.`
2. `학교에서 공부해요.`
3. `서울에서 왔어요.` uses source `에서`.

**Validation.** Typed semantic role; do not map from one English preposition.

### Family `euro_direction_means`

**Task.** Choose/use `(으)로` for direction, route, means, material, or role in reviewed frames.

**Difficulty.** L1 means/direction; L2 consonant/vowel allomorph; L3 `ㄹ` exception or role.

**Examples.**

1. `버스로 가요.`
2. `오른쪽으로 가세요.`
3. `서울로` uses `로` after final `ㄹ`.

**Validation.** Semantic role plus allomorph rule: `로` after vowel or `ㄹ`, otherwise `으로`.

### Family `possession_association_particles`

**Task.** Select or interpret `의`, `와/과`, `(이)랑`, `하고`, `도`, `만`, `부터/까지` in bounded contexts.

**Difficulty.** L1 possession/also; L2 comitative/list; L3 source-limit or “only” contrast.

**Examples.**

1. `제 친구`.
2. `친구하고 영화 봐요.`
3. `아홉 시부터 다섯 시까지`.

**Validation.** Separate relation IDs and register; spoken `의` realizations do not change spelling.

### Family `neutral_word_order`

**Task.** Arrange a controlled neutral sentence with time, place, objects, adverbs, and predicate.

**Difficulty.** L1 subject–object–predicate; L2 time/place; L3 two complements or omitted topic.

**Examples.**

1. `저는｜책을｜읽어요`.
2. `오늘｜도서관에서｜공부해요`.
3. arrange time, recipient, object, and predicate under one reviewed template.

**Validation.** Syntax tree accepts authored scrambling only when focus/context permits.

### Family `copula_and_anida`

**Task.** Inflect/use `이다` and `아니다` with nouns across common speech levels.

**Difficulty.** L1 `이에요/예요`; L2 negative `아니에요`; L3 past/formal/casual context.

**Examples.**

1. consonant-final noun: `학생이에요.`
2. vowel-final noun: `의사예요.`
3. `학생이 아니에요.`

**Validation.** Host-final form, tense, polarity, and speech-level features.

### Family `existence_possession_location`

**Task.** Build or interpret `있다/없다` for existence, location, or possession.

**Difficulty.** L1 existence; L2 location order; L3 possession/availability in context.

**Examples.**

1. `책이 있어요.`
2. `책상 위에 책이 있어요.`
3. `시간이 없어요.`

**Validation.** Semantic frame distinguishes physical existence, possession, and availability.

### Family `negation_an_mot`

**Task.** Choose or interpret `안`, `못`, `-지 않다`, or `-지 못하다` from intention/ability and register.

**Difficulty.** L1 short negation; L2 inability; L3 long-form/register or lexicalized restriction.

**Examples.**

1. `커피를 안 마셔요.` → do not drink.
2. `오늘 못 가요.` → cannot go.
3. `가지 않았어요.` → did not go in the supplied formal/written contrast.

**Validation.** Volition/ability/event frame and predicate-specific placement; `하다` constructions are reviewed.

### Family `question_formation`

**Task.** Form or answer yes/no, wh, choice, or confirmation questions in a stated speech level.

**Difficulty.** L1 intonation/ending; L2 wh in ordinary argument position; L3 choice/confirmation and appropriate answer.

**Examples.**

1. `학생이에요?`
2. `어디에 가요?`
3. `커피를 마실까요, 차를 마실까요?`

**Validation.** Question type, predicate ending, and dialogue-act table.

### Family `descriptive_predicate`

**Task.** Use/interpret Korean descriptive verbs (“adjectives”) predicatively or attributively.

**Difficulty.** L1 polite predicate; L2 negative/past; L3 attributive form.

**Examples.**

1. `날씨가 좋아요.`
2. `방이 크지 않아요.`
3. `큰 방`, not `크는 방`.

**Validation.** Lexical POS and inflection paradigm; no inserted copula in the neutral predicate.

### Family `subject_honorific_si`

**Task.** Insert or interpret `-(으)시-` and common honorific lexemes from subject/reference context.

**Difficulty.** L1 regular `시/으시`; L2 tense/ending; L3 reviewed lexical honorific.

**Examples.**

1. `선생님이 오세요.`
2. `할아버지께서 주무세요.` uses subject honorification and honorific lexeme.
3. distinguish honoring the subject from speaking politely to the listener.

**Validation.** Subject status/relationship and speech level stored independently; avoid honorifying the speaker by default.

## 6. Category: Inflection and Connected Grammar

### Category purpose

Build reliable stem-to-ending transformations and connect clauses while keeping tense, aspect, speech level, and social meaning explicit.

### Learn

Korean predicates combine a lexical stem with prefinal and final endings. The correct form depends on stem shape, vowel/consonant environment, lexical irregularity, tense/aspect, clause relationship, and speech level. Surface contractions are licensed forms, not arbitrary deleted letters.

### Family `polite_present`

**Task.** Produce/recognize common `해요체` present/nonpast forms.

**Difficulty.** L1 `아요/어요`; L2 vowel contraction; L3 `하다` and irregular lexeme.

**Examples.**

1. `먹다` → `먹어요`.
2. `가다` → `가요`.
3. `공부하다` → `공부해요`.

**Validation.** Lexical stem, harmony/contraction table, and irregular-class oracle.

### Family `formal_and_casual_level`

**Task.** Convert a bounded sentence among `해요체`, `하십시오체`, and context-licensed `해체`.

**Difficulty.** L1 polite↔formal; L2 question/command; L3 casual only with explicit relationship.

**Examples.**

1. `가요` → deferential `갑니다`.
2. `먹어요?` → `먹습니까?`.
3. close-friend context permits `가?`, not as a universal “informal translation.”

**Validation.** Speech-level feature and dialogue relationship; meaning/tense preserved.

### Family `past_tense`

**Task.** Produce or interpret common past forms using `-았/었-` and contractions.

**Difficulty.** L1 transparent stem; L2 contraction; L3 irregular plus speech level.

**Examples.**

1. `먹다` → `먹었어요`.
2. `가다` → `갔어요`.
3. `하다` → `했어요`.

**Validation.** Stem/tense/ending round-trip; surface form maps to one pinned lemma in context.

### Family `future_intention`

**Task.** Choose or interpret bounded future, plan, intention, or supposition forms.

**Difficulty.** L1 `-(으)ㄹ 거예요`; L2 intention `-겠-`; L3 context contrast without treating either as a simple future tense.

**Examples.**

1. `내일 공부할 거예요.` → plan/prediction.
2. `제가 하겠습니다.` → speaker intention in the stated formal context.
3. choose the reviewed form for evidence-based prediction versus personal plan.

**Validation.** Modal/temporal semantics and relationship; alternatives accepted only when meaning remains.

### Family `request_suggestion_command`

**Task.** Select or build a request, suggestion, permission, prohibition, or command appropriate to context.

**Difficulty.** L1 `주세요`; L2 `-(으)세요/-(으)ㄹ까요`; L3 negative request and speech-level nuance.

**Examples.**

1. `천천히 말해 주세요.`
2. `같이 갈까요?`
3. `여기에서 사진을 찍지 마세요.`

**Validation.** Dialogue act, agent, relationship, and predicate constraints.

### Family `irregular_inflection`

**Task.** Inflect or identify reviewed `ㄷ/ㅂ/르/ㅅ/으` irregulars and regular lookalikes.

**Difficulty.** L1 one taught class; L2 contrast with regular same-ending verb; L3 mixed tense/ending.

**Examples.**

1. `듣다` → `들어요`.
2. `춥다` → `추워요`.
3. `모르다` → `몰라요`.

**Validation.** Lexeme carries irregular class; suffix spelling alone never determines the oracle.

### Family `progressive_resultant_experience`

**Task.** Choose or interpret `-고 있다`, `-아/어 있다`, or `-아/어 본 적이 있다`.

**Difficulty.** L1 ongoing action; L2 resultant state; L3 prior experience.

**Examples.**

1. `책을 읽고 있어요.` → ongoing.
2. `문이 열려 있어요.` → resultant open state.
3. `한국 음식을 먹어 본 적이 있어요.` → experience.

**Validation.** Lexical aspect/event state and construction AST.

### Family `connective_relation`

**Task.** Join/interpret clauses with reviewed sequence, addition, reason, contrast, or condition endings.

**Difficulty.** L1 `-고`; L2 `-아/어서/-지만`; L3 `-(으)니까/-(으)면` with mood constraints.

**Examples.**

1. `밥을 먹고 학교에 가요.`
2. `비가 와서 집에 있어요.`
3. `시간이 있으면 같이 가요.`

**Validation.** Clause-relation semantics, subject constraints where relevant, and accepted alternatives.

### Family `relative_clause`

**Task.** Build or interpret a noun-modifying clause with tense/aspect-sensitive adnominal endings.

**Difficulty.** L1 current action/descriptive; L2 past/future; L3 longer clause and attachment.

**Examples.**

1. `제가 읽는 책`.
2. `어제 만난 사람`.
3. `내일 갈 곳`.

**Validation.** Clause tree, predicate type, temporal relation, and unique head attachment.

### Family `nominalization_reported_speech`

**Task.** Use/interpret bounded nominalization or reported-speech patterns.

**Difficulty.** L1 `-기`; L2 `것`; L3 reviewed `-다고/냐고 하다`.

**Examples.**

1. `한국어 배우기가 재미있어요.`
2. `제가 좋아하는 것은 음악이에요.`
3. `민지가 내일 온다고 했어요.`

**Validation.** Embedded-clause type, tense, quotation force, and speaker/source roles.

### Family `comparison_degree`

**Task.** Compare options or express bounded degree with `보다`, `더`, `제일/가장`, or equality.

**Difficulty.** L1 two-item comparison; L2 superlative set; L3 equality/negative comparison.

**Examples.**

1. `기차가 버스보다 빨라요.`
2. `이것이 제일 싸요.`
3. `저는 동생만큼 키가 크지 않아요.`

**Validation.** Semantic ordering/equality and bounded comparison set.

### Family `speech_level_pragmatics`

**Task.** Choose a fitting greeting, apology, refusal, request, or response for an authored relationship/situation.

**Difficulty.** L1 fixed polite phrase; L2 polite versus deferential; L3 indirect refusal or honorific lexeme.

**Examples.**

1. ordinary polite thanks → `감사합니다` or context-licensed `고마워요`.
2. service interaction uses a reviewed polite request.
3. decline an invitation without switching unexpectedly to casual speech.

**Validation.** Human-reviewed scenario table; several natural answers are accepted or the response is multiple-choice.

## 7. Category: Reading, Listening, and Interaction

### Category purpose

Integrate Hangul, pronunciation, vocabulary, numbers, grammar, and relationship into short task-based comprehension and supported production.

### Learn

Read or listen for the task: gist, participant, action, place, time, reason, result, or appropriate response. Korean often omits recoverable subjects and objects. Use particles, predicate endings, speech level, and prior discourse rather than mechanically supplying an English pronoun.

### Family `sentence_segmentation_parse`

**Task.** Segment a sentence into eojeol/morphemes and identify predicate, roles, endings, or clause attachment.

**Difficulty.** L1 visible particles; L2 inflected predicate; L3 relative/connected clause.

**Examples.**

1. `저는｜도서관에서｜책을｜읽어요`.
2. segment `먹었습니다` into stem/tense/formal ending.
3. attach `어제 산` to `책`.

**Validation.** Template morpheme and syntax tree with enumerated analyses.

### Family `short_reading_comprehension`

**Task.** Read a generated/reviewed `1..5` sentence passage and answer bounded gist, detail, sequence, or inference.

**Difficulty.** L1 one explicit fact; L2 cross-sentence omission/reference; L3 inference from reason/comparison/ending.

**Examples.**

1. identify where a person goes.
2. order two events linked by `-고`.
3. infer which option was chosen from an explicit comparison and reason.

**Validation.** Passage semantic/discourse model proves one answer.

### Family `notice_and_message`

**Task.** Interpret a short sign, instruction, menu fragment, schedule, or personal message.

**Difficulty.** L1 sign/label; L2 one instruction; L3 multi-line message with incidental date/time.

**Examples.**

1. `출구` → exit.
2. `사진 촬영 금지` → photography prohibited.
3. determine the requested action from a schedule-change message.

**Validation.** Authored genre/layout and action semantics; unexplained abbreviations excluded.

### Family `dialogue_completion`

**Task.** Choose or construct a short response fitting information, grammar, relationship, and speech level.

**Difficulty.** L1 greeting/yes-no; L2 information request; L3 invitation, refusal, repair, or indirect response.

**Examples.**

1. `안녕하세요?—안녕하세요.`
2. `화장실이 어디에 있어요?—저쪽에 있어요.`
3. decline an invitation with an authored polite explanation.

**Validation.** Dialogue-act, participant knowledge, and relationship table.

### Family `reference_and_ellipsis`

**Task.** Resolve an omitted subject/object or demonstrative from a short controlled discourse.

**Difficulty.** L1 one antecedent; L2 two participants; L3 topic continuity across sentences.

**Examples.**

1. identify the omitted subject of a second sentence from the continuing topic.
2. determine what `그것` refers to in a supplied scene.
3. select the omitted object shared across coordinated predicates.

**Validation.** Discourse graph has a unique intended referent; ambiguous passages are rejected.

### Family `listening_dictation`

**Task.** Transcribe a recorded syllable, word, number, or short sentence in standard Hangul.

**Difficulty.** L1 transparent syllable; L2 known word/number; L3 connected pronunciation requiring lexical spelling.

**Examples.**

1. hear `가` → `가`.
2. hear a price → type its Hangul or declared digits.
3. hear assimilated `국물` → spell `국물`.

**Validation.** Reviewed audio and lexeme/morpheme-aware spelling oracle; no pure phonetic rewrite.

### Family `listening_comprehension`

**Task.** Hear a short utterance/dialogue and answer gist, detail, relationship, reason, or next action.

**Difficulty.** L1 one utterance; L2 two turns; L3 omission, speech-level cue, and several details.

**Examples.**

1. choose the mentioned place.
2. identify why the speaker cannot go.
3. choose what the listener should do after a polite request.

**Validation.** Audio/transcript semantic model and distractor proof; no speaker/session label leakage.

### Family `audio_form_discrimination`

**Task.** Distinguish a consonant/vowel, 받침 process, particle, ending, or number phrase within recorded speech.

**Difficulty.** L1 isolated contrast; L2 carrier phrase; L3 connected sound change plus meaning contrast.

**Examples.**

1. distinguish `달/탈/딸`.
2. distinguish whether a phrase contains `안 가요` or `못 가요`.
3. identify the spelling represented by a reviewed assimilated form in context.

**Validation.** Human-recorded matched sets balanced for speaker, speed, loudness, and context.

### Family `guided_speaking_shadowing`

**Task.** Shadow/read a model phrase or select and rehearse a constrained spoken response.

**Response mode.** Reference playback, optional local record/replay, and learner self-check; exact response selection may precede speech.

**Difficulty.** L1 short phrase; L2 sound-change/ending sequence; L3 relationship-appropriate response.

**Examples.**

1. shadow `감사합니다`.
2. record/read `천천히 말해 주세요.` after model audio.
3. select and speak a fitting polite response to an invitation.

**Validation.** Verify response text and recording lifecycle, not pronunciation correctness; replay works without a microphone.

## 8. Cross-family progression

Recommended progression:

1. core jamo, open syllables, basic consonant/vowel contrasts, concrete vocabulary, Sino `0..100`, and fixed polite phrases;
2. 받침, syllable composition/input, native `1..20`, common counters, particles, `이에요/예요`, `있어요/없어요`, and `해요체`;
3. liaison/neutralization, larger everyday numbers, dates/time/prices, negation, past/future, questions, and short reading/listening;
4. assimilation/tensification, irregular inflection, aspect, comparisons, connectives, relative clauses, notices, and dialogues;
5. honorification, formal/casual transfer, reported speech, nuanced pragmatics, reference/ellipsis, and longer integrated tasks.

Interleave:

- jamo/block work with actual known syllables and words;
- every sound process with canonical spelling and human audio;
- new vocabulary with collocation, inflection, spacing, and sentence context;
- a number system with the communicative contexts that license it;
- particles with allomorph selection and semantic role;
- inflection tables with a sentence/dialogue use;
- the same grammar in reading and listening with varied words;
- guided speaking only after model comprehension.

Do not delay useful sentences until every sound rule is mastered. A learner may receive morpheme boundaries or slow audio while continuing with known grammar. Track spelling, listening, and speech level independently.

### Recommended release slices

1. **Foundation:** Hangul composition, core sound contrasts, common words, Sino numbers, native `1..20`, basic counters/particles, copula/existence, and phrase audio.
2. **Everyday core:** 받침/liaison, larger numbers, dates/time/prices, neutral word order, negation/questions, `해요체`, past/future, short reading/listening, and guided speaking.
3. **Connected language:** assimilation/tensification, irregulars, aspect, comparisons, connectives, relative clauses, spacing, notices, and dialogue completion.
4. **Lower intermediate:** honorification, speech-level transfer, nominalization/reported speech, pragmatics, reference/ellipsis, and multi-sentence comprehension.

Each slice must ship with reviewed lexicon, morphology/phonology tables, semantic templates, accepted variants, audio, explanations, and regression corpus. Listening and supported speaking are present in every slice.

## 9. Adaptive practice guidance

Track mastery by:

`family`, `jamo`, `syllableShape`, `batchim`, `soundProcess`, `lexeme`, `spelling`, `spacingPattern`, `numberSystem`, `counter`, `particleRole`, `allomorph`, `predicateType`, `irregularClass`, `tenseAspectMood`, `speechLevel`, `subjectHonorification`, `semanticFrame`, `production/recognition`, `Hangul/audio`, `scaffoldUse`, and `misconception`.

| Error pattern | Likely diagnosis | Next practice |
|---|---|---|
| block recognized but cannot assemble | jamo-position weakness | decomposition then on-screen composition |
| initial `ㅇ` pronounced | orthography/sound confusion | vowel-initial block contrast |
| lax/aspirated/tense merged | consonant category | matched speaker contrast set |
| final pronounced as initial | 받침 category weakness | isolated final then liaison pair |
| surface form typed as spelling | phonology/orthography conflated | spelling–surface two-row feedback |
| every final moves before vowel | overgeneralized liaison | boundary and blocked-process contrast |
| correct word, wrong spacing | eojeol/morpheme boundary | particle/ending attachment set |
| one number system used everywhere | context mapping | same value across price/hour/counter |
| `하나 개` or `스물 명` | unshortened attributive form | full-versus-counter form pair |
| `에/에서` swapped | static/destination/action role | paired same-place scenes |
| wrong particle member | final-sound allomorph | consonant/vowel host contrast |
| copula added to descriptive predicate | English noun/adjective model | noun versus descriptive predicate |
| `안/못` swapped | volition/ability | same verb, two causes |
| regular rule on `듣다` | lexical irregular not retrieved | irregular/regular lookalike contrast |
| polite ending but wrong `-시-` | speech level/honorification conflated | listener versus subject diagram |
| casual ending selected broadly | relationship missing | same message in explicit relationships |
| reading succeeds only with romanization | Hangul retrieval weakness | retain grammar, fade word-level romanization |
| listening errors only for one speaker | speaker adaptation | mastered content in varied voice |
| recording unavailable | device/permission | no-record speaking path; no mastery penalty |

Recommended due-item mix: 30% weakest skills, 25% spaced mastery, 20% cross-modal transfer, 15% integrated task-based items, and 10% prerequisite diagnosis.

Do not lower grammar merely because spelling or listening failed. Restore syllable/morpheme support and route the specific weakness separately. Likewise, separate social-context mistakes from conjugation mistakes.

## 10. Feedback and explanations

Feedback must show:

1. intended meaning and relationship;
2. canonical Hangul with standard spacing;
3. morpheme/chunk segmentation;
4. dictionary form and inflection features where relevant;
5. reviewed surface pronunciation only when relevant;
6. the particle, number-system, sound-change, ending, or pragmatic rule;
7. accepted alternatives and nuance;
8. replay where licensed.

Examples:

> `학교에 가요` uses `에` for a destination. `학교에서 공부해요` uses `에서` for the place where an action happens.

> `듣다` is a lexical `ㄷ` irregular in this ending: `듣- + -어요 → 들어요`. Do not apply that change to every `ㄷ`-final verb.

> `국물` keeps its dictionary spelling. The pronunciation changes across the consonant boundary; spelling does not.

> `3시 20분` mixes the systems: `세 시` for the hour and `이십 분` for minutes.

Do not explain Korean solely by mapping each morpheme to an English word. Show chunks, roles, morphology, and relationship.

## 11. Audio, recording, and content requirements

- Every required audio asset has transcript, standard spacing, morpheme boundaries, underlying form, reviewed surface pronunciation, speaker, speed, speech level, relationship, license, and semantic annotation.
- Audio decodes locally and preloads only when needed.
- A missing asset disables the affected instance rather than silently using device TTS.
- Embedded audio/base64 or byte arrays are compressed and size-budgeted with browser fallbacks.
- System TTS is labeled “device voice.”
- Microphone recording stays local and exposes start/stop/delete controls.
- Do not store voiceprints, biometric profiles, or hidden pronunciation judgments.
- Content and audio are versioned; saved seeds retain their version or retire safely.
- At least one proficient South Korean standard-language editor reviews each lexeme, template, accepted variant, pronunciation annotation, and transcript. Speech-level/pragmatics items receive a second review.

## 12. Rendering and accessibility requirements

- Declare target text with `lang="ko"`.
- Use a robust Korean font stack and validate every required modern Hangul glyph offline.
- Never split a syllable block visually except in an explicit jamo-composition task.
- Jamo controls show their role/position accessibly, not color alone.
- Underlying spelling, pronunciation guide, romanization, gloss, and morpheme boundaries toggle independently.
- Romanization is hidden by default after foundation mastery and can be restored without lowering grammar level.
- Token-order and ending/particle controls are keyboard-operable.
- Audio controls expose playback state, replay, volume, and keyboard shortcuts.
- Listening-only assessment may hide transcript until answer, but deaf/hard-of-hearing learners get an equivalent non-audio practice route tracked separately.
- Speaking tasks remain completable without microphone permission.

## 13. Generator and implementation requirements

### Semantic- and morphology-first generation

- Generate event/discourse/relationship first, then compatible lexemes and morphology.
- Enforce animacy, valency, selectional restrictions, particle roles, number systems, counters, predicate type, irregular class, speech level, and subject honorification.
- Build a morpheme tree before applying contractions or surface phonology.
- Use table/finite-state transformations with explicit lexical exceptions.
- Use authored accepted variants; never ask a runtime language model whether an answer is natural.
- Reject bizarre, unsafe, culturally loaded, or pragmatically unsupported combinations.

### Offline constraint

The app builds to one standalone HTML page. Lexicon, morphology, phonology, number/counter tables, jamo tools, generation, checking, audio, and progress work offline. No dictionary, translation API, cloud TTS, speech recognition, or backend is assumed.

### Deterministic Hangul and number generation

- Hangul composition/decomposition follows the Unicode modern L/V/T algorithm.
- Store compatibility-jamo display labels separately from conjoining-jamo computation.
- Inflect from lexeme/stem features; never strip/append visible strings without morphological validation.
- Generate Sino numbers from decimal place values and `만` sections.
- Generate native numbers from the reviewed table, then select full/attributive form from syntax.
- Dates, clock times, durations, digit strings, prices, decimals, fractions, and percentages use separate renderers.

## 14. Automated validation

For every generated instance:

- all lexeme/template/audio/jamo references resolve to the pinned version;
- precomposed and decomposed Hangul normalize and round-trip;
- every syllable contains a legal modern L/V/(T) structure;
- spelling, morpheme tree, surface pronunciation, and romanization agree;
- sound changes apply only across licensed boundaries;
- semantic slots satisfy valency, particle, counter, predicate, tense/aspect, speech-level, honorific, and relationship constraints;
- number renderers round-trip exactly;
- canonical/accepted answers do not collide with distractors after normalization;
- every distractor maps to a named misconception;
- choice prompts have exactly one best answer in the displayed context;
- audio transcript and semantic frame agree;
- explanations regenerate from the same oracle;
- no placeholder, filename, or debug annotation leaks the answer.

Property/regression suites cover:

- all modern initial/vowel/final inventories and Unicode L/V/T composition;
- NFC/NFD and compatibility-jamo boundaries;
- doubled/aspirated/lax consonants and high-value vowel contrasts;
- every modeled 받침 category and compound final;
- liaison, nasal/lateral assimilation, aspiration, palatalization, tensification, and stored exceptions;
- Revised Romanization table and authored proper names;
- particle attachment, spacing, and accepted variants;
- Sino numbers at `십/백/천/만/억` boundaries;
- native `1..99`, attributive `한/두/세/네/스무`, and system selection;
- counters, dates, `유월/시월`, time, durations, digit strings, money, decimals, fractions, percentages;
- `이에요/예요`, `이다/아니다`, `있다/없다`, and particle allomorphs;
- regular and every enabled irregular inflection class;
- present/past/future, negation, requests, aspect, connectives, relative clauses, reported speech, honorification, and speech-level transfer;
- audio-label balance by speaker, duration, loudness, pitch range, and recording session;
- recording permission denial/start/stop/delete lifecycle;
- at least `10,000` deterministic seeds per combinatorial family/level.

Corpus tests flag:

- unnatural noun–predicate or counter combinations;
- accidental North Korean/archaic forms;
- pronunciation respellings used as canonical text;
- forced audio distinctions merged by the recorded speaker;
- overapplication of sound rules across invalid boundaries;
- ambiguous spacing/particle/ending/speech-level prompts;
- contextless casual or honorific forms;
- excessive unfamiliar vocabulary/morphology in one item;
- unsafe, sensitive, or stereotyped scenarios;
- audio whose speaker/session predicts the label.

## 15. Coverage requirements

Across a long mixed session:

- Hangul, pronunciation, vocabulary, spacing, numbers, particles, inflection, reading, listening, and guided speaking all recur;
- at least one third of due practice uses audio or prepares/rehearses spoken language;
- recognition does not dominate production;
- spelling and surface pronunciation are deliberately contrasted without conflation;
- core consonant/vowel/받침 contrasts appear both isolated and in words;
- native/Sino systems and full/attributive forms are balanced by context;
- particles balance semantic role and allomorph selection;
- predicate types, regular/irregular classes, tense/aspect, and endings recur across different words;
- polite/formal/casual style and subject honorification remain separate dimensions;
- common vocabulary appears across reading, listening, inflection, and contextual production;
- audio varies speaker/rate without making one voice a label;
- at least half of vocabulary encounters require context, collocation, inflection, spacing, or comprehension;
- at least 25% of due questions are integrated communicative tasks rather than isolated labels;
- every declared misconception is exercised intentionally.

Cross-family synthesis normally combines no more than three mastered demands. Good synthesis: listen to a short café exchange, identify the quantity/price, and choose a polite reply. Bad synthesis: decode new vocabulary, an unfamiliar compound 받침 rule, a rare counter, a new honorific, and implicit cultural hierarchy at once.

## 16. Topic-level quality checklist

- [ ] Target is contemporary South Korean standard language.
- [ ] Modern Hangul composition/decomposition is Unicode-correct.
- [ ] Compatibility jamo and conjoining jamo are not blindly conflated.
- [ ] Dictionary spelling and surface pronunciation remain separate.
- [ ] Sound changes are boundary-aware and use reviewed exceptions.
- [ ] Vowel mergers/variable realizations do not create impossible audio questions.
- [ ] Revised Romanization is a scaffold, not the pronunciation oracle.
- [ ] Vocabulary is learned through lexemes, collocations, and context.
- [ ] Standard spacing is assessed only where the oracle can decide it.
- [ ] Native/Sino number-system selection is context driven.
- [ ] Counter-shortened native forms are table validated.
- [ ] Dates, time, durations, digits, prices, and fractions use separate renderers.
- [ ] Particle role and consonant/vowel allomorph are both checked.
- [ ] Predicates are generated from lexical/morphological features.
- [ ] Irregular class is lexical, not guessed from spelling alone.
- [ ] Speech level and subject honorification remain separate.
- [ ] Casual speech always has an explicit licensed relationship.
- [ ] Ambiguous natural alternatives are accepted, contextualized, or rejected.
- [ ] Listening uses licensed human recordings as the oracle.
- [ ] Device TTS is optional and labeled.
- [ ] Speaking recordings remain local and are not automatically graded.
- [ ] Audio/accessibility alternatives have separate mastery dimensions.
- [ ] Every distractor represents a plausible learner error.
- [ ] Every family has difficulty progression, three examples, and deterministic validation.
- [ ] Difficulty grows through linguistic transfer rather than obscurity or unreliable technology.
- [ ] The standalone app requires no backend or runtime language service.

## 17. Stable identifiers and recommended navigation

Recommended navigation:

1. Hangul & Sound
2. Words, Spelling & Spacing
3. Numbers & Counters
4. Particles & Sentences
5. Inflection & Connected Grammar
6. Reading, Listening & Interaction

Stable family identifiers are the backticked identifiers above. Track Hangul decoding, spelling, surface listening, vocabulary, spacing, number-system choice, particles, inflection, speech level, honorification, reading, listening, and supported production separately. Reading a word does not prove that the learner can spell it from speech, and using a polite ending does not prove correct subject honorification.
