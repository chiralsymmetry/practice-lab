# Chinese Language — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, Mandarin-content editor, simplified-Chinese input checker, text/audio renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Chinese Language: Standard Mandarin and Simplified Characters

### Topic goal

Develop practical beginner-to-lower-intermediate Mandarin by repeatedly connecting sound, tone, pinyin, simplified hanzi, vocabulary, grammar, numbers, reading, listening, controlled writing, and guided speaking.

Learners should become faster at:

- distinguishing and producing Mandarin syllables and tones;
- recognizing words in simplified characters and selecting the intended character while typing;
- understanding and constructing short, controlled sentences;
- handling ordinary numbers, quantities, dates, times, and prices;
- understanding short messages, notices, and conversations;
- choosing language that fits a clearly described everyday situation.

The app trains usable language rather than isolated terminology. Grammar labels may support feedback, but the learner-facing tasks should usually ask what a sentence means, which form fits, what was heard, or how to express a bounded intention.

### Language and orthography boundary

The target variety is contemporary Standard Mandarin as used in Mainland China, written with simplified, standardized hanzi and Hanyu Pinyin.

- Simplified characters are canonical for production.
- Traditional characters are not a parallel curriculum and are not accepted in hanzi-production tasks.
- A reviewed traditional form may appear in optional recognition notes or contrastive feedback, but must never be required.
- Regional Mandarin accents may appear in advanced listening only when clearly labeled and reviewed. Core pronunciation examples use broadly intelligible Standard Mandarin.
- Pinyin is a pronunciation and input scaffold, not a substitute for learning words in characters.

The curriculum begins before pinyin or hanzi mastery and extends through practical lower-intermediate communication. It may use internal foundation/A1-oriented/A2-oriented/early-B1-oriented bands, but it does not certify an HSK, CEFR, or other exam level.

### Scope

The topic includes:

- pinyin initials, finals, syllable structure, tone marks, four lexical tones, neutral tone, and high-value sound contrasts;
- connected-speech patterns including contextual third-tone realization and `一/不` tone changes;
- contextual vocabulary, collocations, word-level hanzi readings, simplified forms, components, stroke order, word segmentation, and pinyin-IME candidate selection;
- everyday cardinal numbers, internal zeroes, `二/两`, ordinals, common measure words, digit strings, dates, clock time, prices, decimals, fractions, and percentages;
- core word order, topic–comment structure, predicates, location/existence, negation, questions, modification, modal verbs, aspect, and comparison;
- result/directional/degree complements, selected coverb and serial-verb patterns, relative clauses, conjunctions, bounded `把/被` patterns, and sentence-final particles;
- short reading, notices/messages, dialogue completion, reference/ellipsis, dictation, listening comprehension, and guided speaking/shadowing;
- IME-friendly input, adaptive pinyin display, bundled human-recorded audio, and optional local recording for self-review.

### Exclusions

Do not include:

- open-ended translation, essay grading, unrestricted conversation, or claims to recognize every natural paraphrase;
- Cantonese or other Sinitic languages, dialect production, Classical Chinese, literary Chinese, or historical phonology;
- a full traditional-character track, exhaustive simplified/traditional conversion, or locale-independent CJK glyph claims;
- exhaustive HSK vocabulary memorization or an implication that vocabulary counts alone equal proficiency;
- advanced phonetics, unrestricted pitch-accent/prosody scoring, or claims that every speaker realizes a tone identically;
- uncommon literary measure words, financial mathematics, accounting, exchange rates, or the depth of the dedicated Japanese Numbers app;
- exhaustive `成语`, poetry memorization, calligraphy grading, free handwriting recognition, or arbitrary hanzi OCR;
- advanced `把/被` edge cases, formal written constructions, business/legal/medical interpretation, or unrestricted register transformation;
- cloud translation, cloud text-to-speech, cloud speech recognition, or uploading learner recordings;
- runtime language-model judgments about whether an answer “sounds Chinese”;
- machine-generated sentences or audio published without proficient-speaker review;
- cultural stereotypes, political quizzes, or universal claims about how “Chinese people” behave.

### Linguistic data model

Every word entry is authored and versioned:

```text
Lexeme := {
  id,
  simplified,
  pinyinSyllables[],
  lexicalTones[],
  surfacePronunciations[],
  partOfSpeech,
  senses[],
  semanticTags[],
  selectionalTags[],
  classifiers[],
  separable,
  aspectCompatibility[],
  complements[],
  register,
  commonCollocations[],
  acceptedVariants[],
  audioIds[],
  exampleTemplateIds[],
  provenance
}
```

Grammar templates are typed semantic structures:

```text
SentenceTemplate := {
  semanticRoles,
  discourseState,
  slots,
  wordOrderConstraints,
  requiredFunctionWords,
  aspectFeatures,
  complementFeatures,
  register,
  contextConditions,
  acceptedRealizations[],
  rejectionRules[]
}
```

Generate the intended meaning and discourse state first, choose compatible lexemes, realize a sentence, validate every accepted form, then render it. Randomly substituting words into a surface string is not an acceptable generator.

### Pinyin conventions

- Store pinyin as syllable objects with initial, final, lexical tone, and optional surface-tone realization.
- Canonical display uses lowercase Hanyu Pinyin with tone marks and word-based spacing: `你好`, `nǐ hǎo`.
- Numeric-tone input is accepted where pinyin is an allowed answer: `ni3 hao3`.
- Normalize NFC/NFD representations of tone-marked vowels before comparison.
- Accept `ü`, `u:`, or `v` in typed numeric pinyin where an ordinary keyboard requires it. Display canonical `ü`.
- `j/q/x/y` spellings follow standard pinyin conventions; do not demand an impossible written `ü` after those initials.
- Tone-mark placement is validated from the syllable structure, including `iu/ui` placement.
- Apostrophes separating ambiguous syllable boundaries are significant in production tasks, for example `Xi'an`; straight and typographic apostrophes normalize.
- Toneless pinyin may be accepted only when tone is explicitly not assessed or when an early scaffold says so.
- Pinyin capitalization is ignored except in a task specifically about names or sentence formatting.
- Do not accept arbitrary English-like phonetic spellings.

### Lexical tones and connected speech

The oracle distinguishes:

1. **lexical tone**, the dictionary/underlying tone attached to a syllable;
2. **citation realization**, how an isolated modeled syllable is recorded;
3. **connected-speech target**, the reviewed realization in a particular word or phrase;
4. **orthographic pinyin answer**, which follows the convention stated by the task.

Rules:

- Tone numbers `1..4` represent the four lexical tones; `0` or `5` may represent reviewed neutral tone in input, with `0` canonical internally.
- Tone contours are relative movements, not absolute musical pitches.
- Do not teach third tone as obligatorily falling then rising in every position. Audio and feedback distinguish citation form from common low contextual realizations.
- In a controlled third-tone sequence, the first of two adjacent lexical third tones is modeled with second-tone-like surface realization while retaining lexical tone 3 in the word data.
- `一` and `不` surface tone changes are generated from explicit rules and reviewed exceptions. The task must say whether it asks for lexical tone, written pinyin, or heard surface tone.
- Neutral tone is lexeme/construction specific. Never delete a tone merely because a syllable is unstressed.
- `儿化` is optional recognition/listening material at the upper boundary. It is never required in ordinary production or used to mark a standard answer wrong.

### Simplified hanzi and glyph policy

- Canonical production uses the pinned simplified spelling stored in the lexeme.
- Questions operate on words and contexts, not a fiction that each character has one meaning and one reading.
- Polyphonic characters are resolved through the lexeme and sentence, for example `银行 háng` versus `行走 xíng`.
- Character components may support recognition, but phonetic and semantic components are clues rather than deterministic rules.
- Stroke-order work uses licensed, versioned Mainland-standard vector data.
- Locale-appropriate Chinese fonts are bundled when feasible or selected through a robust `zh-CN` fallback stack.
- Unicode code-point identity is separate from font glyph shape. Do not grade harmless typeface variation as a different character.
- Compatibility characters, full-width punctuation, and decomposed pinyin normalize only when the target distinction is unaffected.

### Chinese input and answer checking

Supported response modes:

- single/multiple choice;
- pinyin short text;
- simplified-hanzi short text;
- numeric input;
- token ordering;
- word/particle/aspect/complement slots;
- multiple named fields;
- matching;
- dictation;
- local record-and-compare for self-review only.

Checking layers:

1. normalize allowed Unicode width, pinyin composition, punctuation, and whitespace;
2. tokenize against the question’s known lexicon/template;
3. compare simplified spelling, lexeme, pinyin syllables, lexical/surface tones, semantic roles, aspect, complement, order, and register as relevant;
4. accept only enumerated meaning-preserving variants;
5. route ambiguous free-form production to structured input or choice.

Chinese ordinarily has no spaces between words. Ignore optional spaces in hanzi answers unless segmentation is the target. In pinyin answers, normalize repeated whitespace and compare word/syllable boundaries according to the declared task.

Pinyin may be accepted instead of hanzi when pronunciation or grammar is being assessed, but not when simplified-character production or IME selection is the skill. Hanzi alone is not sufficient when the target is tone.

### Number conventions and limits

Numbers are a useful part of this general app, not a separate deep numeracy curriculum.

- Cardinal generation covers `0..99,999` at foundation/core levels and selected values through `99,999,999` later.
- Units are `十, 百, 千, 万, 亿`; `兆` and larger units are excluded.
- Internal zero placement is derived structurally, not by digit substitution.
- `二` versus `两` follows an authored context table. Meaning-preserving variants may be accepted where natural, with one canonical teaching form.
- Years are read digit by digit in the date family; ordinary cardinal quantities are not.
- Digit strings such as phone numbers are read digit by digit. Context-specific `幺` for `1` may be accepted only when that convention is taught.
- Dates use Gregorian examples and `年/月/日` or everyday `号`; time uses the 24-hour or stated everyday clock context.
- Money uses renminbi with `元/块`, `角/毛`, and `分` under a declared formal or conversational register.
- Decimal point is `点`; percentages use `百分之`; fractions use denominator-first `分之`.
- The oracle stores exact rational/decimal values. No floating-point string accident determines correctness.

### Audio and listening architecture

Listening is core. The standalone app must not depend on a network voice.

- Ship a compact, licensed, human-recorded corpus covering active syllables, tone contrasts, words, sentences, and dialogues.
- Store transcript, lexical tones, reviewed surface realization, speaker, speed, register, and semantic annotation with every recording.
- Use multiple speakers where practical and balance answers across speaker, duration, loudness, and recording session.
- Do not synthesize words by concatenating isolated syllables; it obscures coarticulation and tone realization.
- Optional browser `speechSynthesis` may provide extra exposure to generated text, but availability, locale, quality, and offline behavior vary. Label it “device voice” and never use it as the pronunciation oracle.
- Normal and learner-slow versions should be separately recorded for important contrasts. Playback-rate slowing is only supplemental.
- Audio begins after user gesture and has replay controls. File names and preload behavior must not leak the answer.

### Speaking and recording policy

Guided speaking includes shadowing, reading aloud, and rehearsing a constrained response.

- Microphone use is optional, permission-gated, local, and never required for mastery.
- The learner may alternate reference and self-recorded audio and view a waveform/duration trace.
- The app must not assign an automatic correctness score to open pronunciation.
- Coarse pitch traces may be shown as descriptive, speaker-normalized contours, but not as proof that a tone is correct or incorrect.
- Recording can be stopped and deleted, is not uploaded, and is discarded on close unless explicitly downloaded.
- A no-record self-speaking path is always available.

### Difficulty philosophy

Difficulty should rise through:

- moving from recognition to production;
- reducing pinyin, tone-color, translation, and component scaffolds;
- using closer sound, tone, character, and grammar contrasts;
- interpreting connected speech rather than isolated citation forms;
- tracking longer dependencies, omitted arguments, and discourse context;
- transferring between audio, pinyin, hanzi, meaning, and appropriate response;
- combining two or at most three mastered structures in natural contexts.

It must not rise through obscure characters, tiny glyphs, unnatural generated sentences, arbitrary synonym rejection, extreme speaking speed, excessive typing, speech-recognition failures, giant arithmetic, or missing pragmatic context.

### Global instance and distractor contract

Each instance stores:

`categoryId`, `familyId`, `level`, `canDoTag`, `semanticFrame`, `discourseState`, `lexemeIds`, `simplifiedText`, `pinyinTokens`, `lexicalTones`, `surfaceTones`, `grammarFeatures`, `register`, `context`, `audioId`, `responseMode`, `canonicalAnswer`, `acceptedVariants`, `misconceptionsTargeted`, `difficultyDimensions`, `workedExplanation`, `dataVersion`, and `structuralSignature`.

Construct distractors by applying exactly one traceable error where possible:

- confusable initial/final or tone;
- missing/incorrect internal zero or unit;
- `二/两` or measure-word substitution;
- same-pinyin wrong character;
- visually similar component/character;
- wrong word order, negator, aspect marker, complement, or function word;
- reversed actor, location, comparison, disposal, or viewpoint;
- grammatical reply with the wrong dialogue act.

Do not use arbitrary malformed strings. Validate that distractors remain distinct after normalization, are not accepted variants, and diagnose the recorded misconception. A single-choice prompt must have exactly one best answer in the displayed context.

Reject recent structural signatures within 20 questions and exact sentence/audio instances within 100.

## 2. Category: Pinyin, Pronunciation, and Tone

### Category purpose

Build accurate syllable categories, tone awareness, and transfer between heard Mandarin, pinyin, and known words.

### Learn

A Mandarin syllable combines an optional initial with a final and a tone. Pinyin spelling is systematic but not English phonetic spelling. Aspiration, retroflexion, vowel quality, nasal ending, and tone can distinguish words. Connected speech may change the heard contour without changing a word’s lexical tone.

### Common misconceptions

- Treating pinyin letters as their common English sounds.
- Hearing aspiration as voicing.
- Merging `j/q/x` with `zh/ch/sh` or `z/c/s`.
- Merging `-n` and `-ng`.
- Ignoring tone or treating it as emotional emphasis.
- Assuming every third tone must audibly fall and rise.
- Writing a surface sandhi tone as if it permanently changed the word.
- Treating every weak syllable as neutral tone.

### Family `initial_contrast`

**Task.** Identify or produce a pinyin initial from audio/articulation or distinguish a reviewed contrast.

**Difficulty.** L1 dissimilar initials; L2 aspiration pairs; L3 retroflex/alveolar/alveolo-palatal sets.

**Examples.**

1. hear `mā` → initial `m`.
2. distinguish `bā/pā` → unaspirated `b` versus aspirated `p`.
3. choose `zhī/jī/zī` from a reviewed recording.

**Validation.** Pinned syllable inventory, human audio, and balanced contrast sets.

### Family `final_contrast`

**Task.** Identify or construct a final and distinguish high-value vowel/nasal contrasts.

**Difficulty.** L1 simple finals; L2 compounds; L3 `-n/-ng`, `in/ing`, `en/eng`, or `ü/u`.

**Examples.**

1. `mā` → final `a`.
2. distinguish `ān/āng`.
3. `lǜ` contains final `ü`.

**Validation.** Legal initial–final table and reviewed minimal-pair audio.

### Family `syllable_composition`

**Task.** Combine an initial, final, and tone into legal pinyin or decompose a displayed syllable.

**Difficulty.** L1 transparent combinations; L2 spelling contractions `iou→iu`, `uei→ui`; L3 zero-initial and `j/q/x + ü` conventions.

**Examples.**

1. `m + a + tone 3` → `mǎ`.
2. `l + ü + tone 4` → `lǜ`.
3. `j + üe + tone 2` → written `jué`.

**Validation.** Round-trip through the pinned syllable spelling table; reject impossible syllables.

### Family `tone_marking`

**Task.** Add, move, or convert a pinyin tone mark/number without changing the syllable.

**Difficulty.** L1 single vowel; L2 compound-vowel placement; L3 multi-syllable word and numeric/diacritic conversion.

**Examples.**

1. `ma1` → `mā`.
2. `shui3` → `shuǐ`, not `shǔi`.
3. `liu2xue2` → `liúxué`.

**Validation.** Tone-bearing vowel derived by the official pinyin placement rule; Unicode normalized.

### Family `lexical_tone_identification`

**Task.** Identify the lexical tone of an isolated syllable or known word from reviewed audio.

**Difficulty.** L1 maximally distinct tones; L2 same segmental syllable across tones; L3 neutral tone in known words.

**Examples.**

1. hear isolated `mā` → tone 1.
2. distinguish `mǎ` from `mà`.
3. hear `妈妈 māma` → second syllable neutral in the modeled word.

**Validation.** Recording annotation is the oracle; loudness/duration/speaker cannot predict label.

### Family `tone_sequence`

**Task.** Identify or reproduce the tone sequence of a two- or three-syllable recorded word/phrase.

**Difficulty.** L1 unlike tone pair; L2 confusable pair; L3 connected realization with lexical answer requested explicitly.

**Examples.**

1. `中国 Zhōngguó` → `1-2`.
2. `再见 zàijiàn` → `4-4`.
3. hear `你好` and report lexical tones `3-3` despite contextual realization.

**Validation.** Separate lexical and surface-tone arrays; task label selects the oracle.

### Family `third_tone_context`

**Task.** Compare lexical third tone with its reviewed realization in a phrase.

**Difficulty.** L1 isolated versus pre-non-third; L2 two third tones; L3 three-syllable phrasing with an explicit boundary.

**Examples.**

1. `好 hǎo` alone has lexical tone 3.
2. in `你好`, `你` is lexical tone 3 but has second-tone-like contextual realization.
3. choose the modeled grouping/realization for `我很好` from reviewed audio.

**Validation.** Prosodic grouping and both tone layers are authored; do not apply a naïve global rewrite.

### Family `yi_bu_neutral_erhua`

**Task.** Interpret or select reviewed connected-speech behavior for `一`, `不`, neutral-tone words, and optional `儿化`.

**Difficulty.** L1 `不` before fourth tone; L2 `一` by following tone; L3 lexical neutral tone or optional `儿化` recognition.

**Examples.**

1. `不是` has `不` pronounced with second tone in the modeled phrase.
2. `一个` models the contextual pronunciation of `一` before fourth tone.
3. recognize that the second syllable of `朋友 péngyou` is neutral in the target recording.

**Validation.** Entry/construction-specific pronunciation table and recorded phrase; `儿化` never required outside a labeled task.

## 3. Category: Simplified Hanzi, Vocabulary, and Input

### Category purpose

Learn words as linked units of meaning, pronunciation, spelling, and usage while building practical simplified-character recognition and input.

### Learn

A character can have several readings, and a syllable can map to many characters. Learn whole words in context. Components can help identify or remember characters, but their sound and meaning clues are not guarantees.

### Common misconceptions

- Assigning one fixed pronunciation or English meaning to each character.
- Selecting an IME candidate solely because its pinyin matches.
- Treating visually similar characters as interchangeable.
- Assuming every component predicts modern pronunciation.
- Inserting spaces between characters rather than identifying words.
- Using a traditional form when simplified production is requested.

### Family `contextual_vocabulary`

**Task.** Choose or produce a reviewed word fitting a picture, sentence, or semantic role.

**Difficulty.** L1 concrete words; L2 verbs/adjectives; L3 near-neighbor meaning or register.

**Examples.**

1. `我___水。` → `喝`.
2. “borrow from someone” → `借`, not `还`.
3. choose `知道` versus `认识` from fact/person context.

**Validation.** Typed semantic slots and human-reviewed contrast sets.

### Family `collocation_choice`

**Task.** Select the conventional word combination for a controlled context.

**Difficulty.** L1 fixed daily phrase; L2 competing verbs; L3 separable or register-sensitive collocation.

**Examples.**

1. `吃饭`.
2. `下雨`.
3. `帮忙`, not a random literal translation of “give help.”

**Validation.** Reviewed collocation table with declared alternatives.

### Family `hanzi_word_reading`

**Task.** Give or select the pinyin/meaning of a simplified-character word in context.

**Difficulty.** L1 unambiguous word; L2 compound; L3 polyphonic character resolved by context.

**Examples.**

1. `水` → `shuǐ`.
2. `学校` → `xuéxiào`.
3. `银行` → `yínháng`, while `行走` uses `xíng`.

**Validation.** Lexeme-level reading; never derive an answer from one character in isolation when ambiguous.

### Family `pinyin_to_hanzi_context`

**Task.** Choose or type the intended simplified word from pinyin plus context.

**Difficulty.** L1 one common candidate; L2 compound; L3 homophone selection.

**Examples.**

1. `shuǐ` in “drink water” → `水`.
2. `xuéxiào` → `学校`.
3. `shì` in “the city is large” → `市`, not `是/事`.

**Validation.** Context-bound lexeme ID and simplified spelling.

### Family `hanzi_component`

**Task.** Identify a recurring component or assemble/distinguish curated characters by component.

**Difficulty.** L1 visible component; L2 similar characters; L3 semantic/phonetic clue with caveat.

**Examples.**

1. `休` contains `亻` and `木`.
2. distinguish `请/清/情` by the left component.
3. identify `氵` in `河` as a meaning clue related to water.

**Validation.** Versioned component graph; no invented etymology or deterministic pronunciation claim.

### Family `hanzi_stroke_order`

**Task.** Choose the next stroke or trace a curated simplified character in standard order.

**Response mode.** Ordered stroke choice or generous tracing.

**Difficulty.** L1 `2..4` strokes; L2 `5..8`; L3 common multi-component characters.

**Examples.**

1. `十`: horizontal then vertical.
2. order the three strokes of `川`.
3. trace `休` from bundled vector paths.

**Validation.** Licensed/versioned paths; grade order/direction/coarse path, not calligraphic beauty.

### Family `simplified_orthography`

**Task.** Recognize or produce the canonical simplified form of a known word.

**Difficulty.** L1 obvious target; L2 visually close non-target; L3 optional traditional-to-simplified recognition.

**Examples.**

1. “book” → `书`.
2. choose simplified `门`, not traditional `門`.
3. recognize `电脑` as the target spelling of `diànnǎo`.

**Validation.** Pinned lexeme spelling and explicit variant map; traditional production is not accepted.

### Family `word_segmentation`

**Task.** Divide an unspaced sentence into known words or reconstruct it from word tokens.

**Difficulty.** L1 clear disyllabic words; L2 overlapping character possibilities; L3 separable verb/context boundary.

**Examples.**

1. `我喜欢咖啡` → `我｜喜欢｜咖啡`.
2. `他在学校学习` → `他｜在｜学校｜学习`.
3. segment a reviewed `洗澡` construction without treating every character as an independent word.

**Validation.** Template token tree plus enumerated equivalent segmentations where linguistic analyses differ.

### Family `ime_candidate_selection`

**Task.** Select the intended hanzi word/sentence from a pinyin IME-style candidate list.

**Difficulty.** L1 unique multi-syllable candidate; L2 homophone; L3 sentence candidate differing in segmentation or grammar.

**Examples.**

1. `xuexiao` → `学校`.
2. `ta qu nali` → `他去哪里？`.
3. `ta shi laoshi` in the supplied sentence → `他是老师`, not candidates using `市/事/试`.

**Validation.** Candidates share the declared typed pinyin; intended word sequence and context prove one answer.

### Family `homophone_character_context`

**Task.** Distinguish same- or near-sounding simplified words using sentence meaning.

**Difficulty.** L1 distinct meanings; L2 same tone; L3 short discourse.

**Examples.**

1. `他___老师。` → `是`, not `市`.
2. `我有一件___。` in “a matter” context → `事`.
3. distinguish `再/在` from “again” versus location contexts.

**Validation.** Reading and meaning are separately represented; choices remain natural enough to diagnose the intended error.

## 4. Category: Numbers, Quantities, Dates, and Prices

### Category purpose

Build enough number fluency for ordinary Mandarin interactions without becoming a standalone numeracy course.

### Learn

Mandarin groups large quantities with `十/百/千/万/亿`, inserts `零` for skipped internal places, and uses context-sensitive `二/两`. Years and digit strings are read digit by digit. Most counted nouns require a measure word.

### Common misconceptions

- Reading each digit in an ordinary cardinal number.
- Grouping only by thousands and overlooking `万`.
- Omitting or duplicating internal `零`.
- Using `两` in `十二` or ordinals.
- Omitting a measure word after a numeral/demonstrative.
- Reading years as cardinal quantities.
- Reversing numerator and denominator around `分之`.

### Family `cardinal_number_reading`

**Task.** Convert between Arabic numerals and standard Mandarin cardinal forms.

**Difficulty.** L1 `0..99`; L2 hundreds/thousands; L3 `万/亿` grouping.

**Examples.**

1. `18` → `十八（shíbā）`.
2. `326` → `三百二十六`.
3. `12,345,678` → `一千二百三十四万五千六百七十八`.

**Validation.** Exact integer↔section-unit algorithm and reviewed pinyin rendering.

### Family `number_internal_zero`

**Task.** Insert, remove, or interpret `零` in a generated cardinal number.

**Difficulty.** L1 one skipped place; L2 section boundary; L3 several zero digits collapsing to one spoken `零`.

**Examples.**

1. `105` → `一百零五`.
2. `1,005` → `一千零五`.
3. `10,005` → `一万零五`.

**Validation.** Derive occupied place values; reject noncanonical duplicate-zero forms.

### Family `er_liang_context`

**Task.** Choose `二` or `两` in a stated number, ordinal, quantity, or time context.

**Difficulty.** L1 fixed tens/ordinal; L2 classifier/time; L3 hundreds/thousands with accepted variation.

**Examples.**

1. `20` → `二十`, not `两十`.
2. `two books` → `两本书`.
3. `200` → canonical conversational `两百`; reviewed `二百` may be accepted with feedback.

**Validation.** Context table rather than global replacement; accepted variants are entry specific.

### Family `ordinal_and_approximate_quantity`

**Task.** Interpret or build simple ordinals and bounded approximate/interrogative quantities.

**Difficulty.** L1 `第 + number`; L2 `几/多少`; L3 reviewed `多/左右` approximation.

**Examples.**

1. `third` → `第三`.
2. `几本书？` asks a small/expected number of books.
3. `二十多人` means more than twenty people, within the taught approximation pattern.

**Validation.** Semantic range attached to each construction; do not pretend approximations denote one exact number.

### Family `measure_word_quantity`

**Task.** Select or construct a numeral–measure-word–noun phrase from a curated noun.

**Difficulty.** L1 general `个`; L2 common shape/type classifiers; L3 demonstrative/question plus classifier.

**Examples.**

1. `三个人`.
2. `两本书`.
3. `那杯茶`.

**Validation.** Reviewed noun–classifier map with explicit alternatives; avoid nouns with disputed default in single-answer prompts.

### Family `digit_string_reading`

**Task.** Read or reconstruct a telephone/code-like digit string digit by digit.

**Difficulty.** L1 short groups; L2 repeated zero/one; L3 grouped telephone-style audio.

**Examples.**

1. `204` → `二零四`.
2. hear `四零八` → `408`.
3. a labeled phone context may accept reviewed `幺` for digit `1`.

**Validation.** Preserve every digit and grouping; do not run cardinal-number rules.

### Family `date_and_clock_time`

**Task.** Read or interpret a generated Gregorian date or ordinary clock time.

**Difficulty.** L1 month/day or whole hour; L2 year/date; L3 minutes, half/quarter, or schedule interpretation.

**Examples.**

1. `7月25日` → `七月二十五日`.
2. `2026年` → `二零二六年`.
3. `2:30` → `两点半` (`两点三十分` accepted).

**Validation.** Date/time structure is distinct from cardinal reading; validate calendar dates and declared time register.

### Family `money_price`

**Task.** Convert or interpret a renminbi price in a declared formal or conversational register.

**Difficulty.** L1 whole yuan; L2 jiao/fen; L3 `元/块` and omitted-unit conversational variants.

**Examples.**

1. `¥8` → `八元` or conversational `八块`.
2. `¥12.50` → formal `十二元五角`.
3. hear `三块五` in a price context → `¥3.50`.

**Validation.** Exact integer fen internally; accepted forms depend on displayed register.

### Family `decimal_fraction_percent`

**Task.** Read, write, or interpret a simple decimal, fraction, or percentage.

**Difficulty.** L1 decimal; L2 percentage; L3 fraction direction or mixed comparison.

**Examples.**

1. `3.14` → `三点一四`.
2. `25%` → `百分之二十五`.
3. `1/3` → `三分之一`, denominator before numerator.

**Validation.** Exact decimal/rational structure; no locale-ambiguous punctuation or floating-point equality.

## 5. Category: Core Sentence Structure and Grammar

### Category purpose

Build reliable short clauses by mapping meaning, discourse, and aspect to Mandarin word order and function words.

### Learn

Mandarin relies heavily on word order, context, particles, aspect markers, and complements rather than verb conjugation. Time normally precedes place and the main verb in the controlled neutral pattern. Questions usually keep the answer word in the same position as the missing information.

### Common misconceptions

- Copying English question inversion or moving a question word to the front.
- Adding `是` before every adjective or verb.
- Treating `了` as a universal past-tense suffix.
- Interchanging `不` and `没(有)`.
- Confusing `的/地/得`.
- Placing time, location, duration, or complements by English order alone.
- Assuming omitted subjects must always be explicitly restored.

### Family `basic_word_order`

**Task.** Arrange a controlled neutral sentence or identify the role of a phrase.

**Difficulty.** L1 subject–verb–object; L2 time/place; L3 adverb/modal plus object.

**Examples.**

1. `我｜喝｜茶` → `我喝茶。`
2. `我｜今天｜在家｜学习` → `我今天在家学习。`
3. arrange a sentence with time, modal, place, verb, and object under one taught template.

**Validation.** Syntax tree accepts authored alternative topicalizations only when context permits.

### Family `topic_comment`

**Task.** Interpret or build a topic–comment sentence from established discourse.

**Difficulty.** L1 noun topic; L2 contrast; L3 object/location topic with recoverable role.

**Examples.**

1. `这本书，我看过。`
2. `咖啡我喜欢，茶我也喜欢。`
3. identify what `北京` frames in a reviewed `北京，我去过两次` context without testing the number.

**Validation.** Discourse state identifies established topic and its semantic relation.

### Family `shi_and_predicate_type`

**Task.** Choose whether `是` belongs in a noun, adjective, or verb predicate.

**Difficulty.** L1 noun identification; L2 adjective predicate; L3 emphatic/cleft-like `是...的` kept separate.

**Examples.**

1. `她是老师。`
2. `天气很好。`, not `天气是很好` in the neutral target.
3. `我喜欢音乐。`, not `我是喜欢音乐`.

**Validation.** Predicate-type table and context; reject cases where emphatic `是` would change the analysis.

### Family `you_zai_location`

**Task.** Choose and order `有`, `在`, or a locative existence construction.

**Difficulty.** L1 entity location; L2 existence at location; L3 possession versus existence.

**Examples.**

1. `书在桌子上。`
2. `桌子上有一本书。`
3. `我有一个妹妹。`

**Validation.** Typed location/existence/possession frame and definiteness constraints.

### Family `negation_bu_mei`

**Task.** Choose or interpret `不` versus `没(有)` in a controlled time/aspect/modal context.

**Difficulty.** L1 habitual/nonfuture versus completed nonoccurrence; L2 possession; L3 aspect/modal interactions.

**Examples.**

1. `我不喝咖啡。` → habitual/general negative.
2. `我昨天没去。` → did not go.
3. `我没有车。` → do not have a car.

**Validation.** Event-time/aspect semantic frame; reject contexts allowing both with different intended meanings.

### Family `question_formation`

**Task.** Form or answer `吗`, A-not-A, alternative, or wh-in-situ questions.

**Difficulty.** L1 `吗`; L2 wh word in argument position; L3 A-not-A/choice and appropriate response.

**Examples.**

1. `你喜欢茶吗？`
2. `你去哪儿？` keeps `哪儿` in the destination slot.
3. `你喝不喝咖啡？`

**Validation.** Question-type AST; do not combine incompatible markers such as routine A-not-A plus `吗`.

### Family `de_nominal_modification`

**Task.** Build or interpret possession and noun-modifying phrases with `的`.

**Difficulty.** L1 possession; L2 adjective/modifier; L3 omitted head noun or longer modifier.

**Examples.**

1. `我的书`.
2. `很有意思的电影`.
3. `红的是我的。`

**Validation.** Modifier/head relation and licensed `的` omission table for close relationships/fixed words.

### Family `de_di_de`

**Task.** Select `的`, `地`, or `得` from the syntactic relationship.

**Difficulty.** L1 noun modifier; L2 adverbial `地`; L3 postverbal degree/result-like `得`.

**Examples.**

1. `漂亮的衣服`.
2. `慢慢地说`.
3. `他说得很快。`

**Validation.** Parse relation, not pronunciation; all three are displayed as `de` only when listening is not expected to distinguish spelling.

### Family `modal_verb`

**Task.** Choose or interpret a bounded modal such as ability, permission, intention, or obligation.

**Difficulty.** L1 `会/能/可以`; L2 `想/要/应该`; L3 context contrast.

**Examples.**

1. learned skill: `我会游泳。`
2. situational ability: `今天我不能去。`
3. permission: `这里可以拍照吗？`

**Validation.** Authored modal sense and scenario; do not reduce all English “can” uses to one word.

### Family `le_aspect_change`

**Task.** Interpret or place perfective verb-suffix `了` or sentence-final change-of-state `了` in controlled contexts.

**Difficulty.** L1 completed bounded event; L2 new state; L3 negative/question or two-`了` pattern only when reviewed.

**Examples.**

1. `我买了书。` → bounded buying event.
2. `下雨了。` → situation has changed.
3. `我吃了饭就走。` → completion before the next event in the supplied context.

**Validation.** Distinct aspect/discourse features; never explain `了` simply as past tense.

### Family `guo_zhe_aspect`

**Task.** Choose or interpret experiential `过` and durative/state `着`.

**Difficulty.** L1 life experience; L2 maintained state; L3 contrast with `了/在...呢`.

**Examples.**

1. `我去过上海。` → prior experience.
2. `门开着。` → maintained open state.
3. distinguish `他穿着一件蓝衣服` from a completed “put on” event.

**Validation.** Lexical-aspect compatibility and authored event semantics.

### Family `comparison`

**Task.** Build or interpret equality/inequality comparisons with `比`, `没有`, or `跟...一样`.

**Difficulty.** L1 adjective comparison; L2 degree/quantity complement; L3 negative or equality contrast.

**Examples.**

1. `今天比昨天冷。`
2. `他比我高一点儿。`
3. `这本书跟那本一样有意思。`

**Validation.** Semantic ordering/equality oracle; reject vague scales or unsupported degree phrases.

## 6. Category: Complements and Connected Constructions

### Category purpose

Connect events, results, directions, descriptions, and discourse while preserving who did what and why a construction is licensed.

### Learn

Mandarin often places information after a verb in a complement: result, direction, degree, possibility, or duration. Other constructions move or foreground an object only under specific semantic conditions. Learn each structure through its event relationship rather than through word-for-word translation.

### Family `result_complement`

**Task.** Choose or interpret a verb–result combination such as `完/到/懂/见/好`.

**Difficulty.** L1 transparent result; L2 same verb different results; L3 potential `得/不` result.

**Examples.**

1. `看完` → finish reading/watching.
2. `听懂` → hear and understand.
3. `找不到` → unable to find/reach the result.

**Validation.** Reviewed verb–result compatibility and event outcome.

### Family `directional_complement`

**Task.** Choose or interpret simple/compound direction relative to a stated deictic center.

**Difficulty.** L1 `来/去`; L2 `上/下/进/出/回`; L3 compound direction and figurative reviewed uses.

**Examples.**

1. movement toward speaker → `过来`.
2. `走进去` → go walking inside, away from the deictic center as modeled.
3. choose `拿出来` from object movement and viewpoint.

**Validation.** Path graph plus speaker/reference location; reject scenes without a clear deictic center.

### Family `degree_manner_duration_complement`

**Task.** Order or interpret postverbal degree, manner, frequency, or duration in a bounded pattern.

**Difficulty.** L1 `V得 + adjective`; L2 duration/frequency; L3 object-repetition/order pattern.

**Examples.**

1. `他说得很清楚。`
2. `我学了两年汉语。`
3. `我汉语学得不太好。` in the taught topic/object pattern.

**Validation.** Complement type and verb-object structure; avoid unreviewed competing orders.

### Family `coverb_serial_sequence`

**Task.** Arrange or interpret selected `给/跟/对/从/到/在` phrases and purpose/sequence verbs.

**Difficulty.** L1 recipient/accompaniment; L2 source-to-goal; L3 serial purpose.

**Examples.**

1. `我给他打电话。`
2. `我从家走到学校。`
3. `我去商店买东西。`

**Validation.** Typed roles and event sequence; never choose from an English preposition lookup.

### Family `ba_construction`

**Task.** Recognize or build a bounded high-frequency `把` sentence with an affected, identifiable object.

**Difficulty.** L1 completed placement/disposal; L2 result/direction; L3 negation/modal placement.

**Examples.**

1. `请把门关上。`
2. `我把书放在桌子上了。`
3. `别把手机忘在车里。`

**Validation.** Object identifiability, transitivity, affectedness, predicate complexity, and word order.

### Family `bei_construction`

**Task.** Interpret or construct a bounded passive with `被` when the affected participant is foregrounded.

**Difficulty.** L1 explicit agent; L2 omitted agent; L3 adverse versus neutral context without claiming all passives are negative.

**Examples.**

1. `杯子被他打破了。`
2. `我的自行车被偷了。`
3. choose active or passive from which participant the discourse foregrounds.

**Validation.** Event-role graph and discourse focus; agent omission is explicitly licensed.

### Family `relative_clause`

**Task.** Build or interpret a noun-modifying clause ending in `的`.

**Difficulty.** L1 subject/object gap; L2 aspect/modal inside clause; L3 competing noun attachment.

**Examples.**

1. `我买的书`.
2. `住在北京的人`.
3. `昨天给我打电话的老师`.

**Validation.** Clause tree precedes head noun; discourse makes the missing role and attachment unique.

### Family `conjunction_relation`

**Task.** Choose or interpret reviewed causal, contrastive, conditional, or sequence pairs.

**Difficulty.** L1 `因为...所以...`; L2 `虽然...但是...`; L3 `如果...就.../先...再...`.

**Examples.**

1. `因为下雨，所以我没去。`
2. `虽然很贵，但是很好用。`
3. `如果明天下雨，我们就不去。`

**Validation.** Clause relation and polarity; optional omission variants are enumerated per template.

### Family `sentence_final_particles_pragmatics`

**Task.** Interpret or choose `吗/呢/吧/啊` and a fitting request/response for a stated relationship.

**Difficulty.** L1 question marker; L2 suggestion/softening; L3 context-sensitive continuation or stance.

**Examples.**

1. `你呢？` returns the question/topic to the listener.
2. `我们走吧。` → suggestion.
3. choose an authored polite request rather than attaching `请` mechanically to every command.

**Validation.** Dialogue-act and register table; do not assign one English gloss or emotion to each particle.

## 7. Category: Reading, Listening, and Interaction

### Category purpose

Integrate sound, script, vocabulary, grammar, numbers, and pragmatics into short task-based comprehension and supported production.

### Learn

Read or listen for the task: gist, participant, action, location, time, reason, result, or appropriate next response. Mandarin often omits recoverable material. Use the supplied discourse rather than inventing a pronoun or interpreting one sentence in isolation.

### Family `sentence_segmentation_parse`

**Task.** Segment a sentence into words/phrases and identify predicate, roles, aspect, or complement.

**Difficulty.** L1 explicit SVO; L2 time/place/aspect; L3 relative clause or complement attachment.

**Examples.**

1. `我｜在学校｜学习｜汉语`.
2. identify `买了` as predicate plus perfective marker.
3. attach `昨天买的` to `书`.

**Validation.** Template parse tree and accepted segmentation analyses.

### Family `short_reading_comprehension`

**Task.** Read a generated/reviewed `1..5` sentence passage and answer a bounded gist, detail, sequence, or inference question.

**Difficulty.** L1 one explicit fact; L2 cross-sentence reference; L3 bounded inference from comparison/reason/result.

**Examples.**

1. identify where a person is going.
2. order two events linked by `先...再...`.
3. infer which option was chosen from an explicit comparison and reason.

**Validation.** Passage semantic model proves the answer and every distractor’s contradiction.

### Family `notice_and_message`

**Task.** Interpret a short sign, instruction, menu fragment, schedule, or personal message.

**Difficulty.** L1 sign/label; L2 one instruction; L3 short multi-line message with incidental numbers.

**Examples.**

1. `出口` → exit.
2. `请勿拍照` → do not take photographs.
3. determine the requested action in a short schedule-change message.

**Validation.** Authored genre/layout and action semantics; unfamiliar formal abbreviations are excluded.

### Family `dialogue_completion`

**Task.** Choose or construct a short response fitting information, grammar, and relationship.

**Difficulty.** L1 greeting/yes-no; L2 information request; L3 invitation, refusal, repair, or indirect response.

**Examples.**

1. `你好吗？—我很好。`
2. `洗手间在哪儿？—在那边。`
3. decline an invitation with an authored polite explanation.

**Validation.** Dialogue-act compatibility, participant knowledge, and register.

### Family `reference_and_ellipsis`

**Task.** Resolve an omitted participant/object or demonstrative from controlled discourse.

**Difficulty.** L1 one antecedent; L2 two participants; L3 topic chain or zero anaphora across sentences.

**Examples.**

1. identify the omitted subject of a second sentence from the continuing topic.
2. determine what `这个` refers to from two visible objects.
3. choose which object is omitted after two coordinated verbs.

**Validation.** Discourse graph has one intended referent; ambiguous examples are rejected.

### Family `listening_dictation`

**Task.** Transcribe a recorded syllable, word, number, or short sentence in pinyin or known simplified characters.

**Difficulty.** L1 syllable+tone; L2 known word/number; L3 short sentence with connected-speech contrast.

**Examples.**

1. hear `mǎ` → `mǎ` or declared `ma3`.
2. hear `学校` → `学校` in hanzi mode.
3. transcribe a short sentence containing `了` and one internal-zero number.

**Validation.** Token comparison uses the declared orthography/tone layer; reviewed audio only.

### Family `listening_comprehension`

**Task.** Hear a short recorded utterance/dialogue and answer gist, detail, attitude, or next-action within explicit evidence.

**Difficulty.** L1 one sentence; L2 two turns; L3 several details, omission, or pragmatic response.

**Examples.**

1. choose the mentioned place.
2. identify why the speaker cannot go.
3. choose what the listener should do after a short request.

**Validation.** Audio/transcript semantic model and distractor proof; no speaker/session label leakage.

### Family `audio_form_discrimination`

**Task.** Distinguish a tone, sound, aspect marker, negator, or number phrase inside a recorded sentence.

**Difficulty.** L1 isolated minimal pair; L2 word in carrier phrase; L3 connected speech with meaning contrast.

**Examples.**

1. hear `mǎ/mà`.
2. distinguish `买 mǎi` from `卖 mài` in a shopping sentence.
3. distinguish whether the speaker said `不去` or `没去` and choose the matching time meaning.

**Validation.** Human-recorded contrast sets matched for speaker, level, loudness, and surrounding context.

### Family `guided_speaking_shadowing`

**Task.** Shadow/read a recorded phrase or select and rehearse a constrained spoken response.

**Response mode.** Reference playback, optional local recording/replay, and learner self-check; exact text selection may precede speech.

**Difficulty.** L1 short phrase; L2 tone-pair sentence; L3 context-appropriate response or connected phrase.

**Examples.**

1. shadow `谢谢`.
2. record/read `请再说一遍。` after model audio.
3. select and speak a fitting response to an invitation.

**Validation.** Verify text choice and recording lifecycle, not pronunciation correctness; replay remains available without recording.

## 8. Cross-family progression

Recommended progression:

1. core pinyin syllables, tones, concrete words, simplified-character recognition, `0..100`, and fixed phrases;
2. common hanzi words, basic measure words, SVO/time/place order, noun/adjective predicates, questions, negation, and short recordings;
3. hundreds through `万`, dates/time/prices, aspect, comparison, modification, sentence reconstruction, short readings, and dictation;
4. `亿` grouping, fractions/percentages, complements, connected clauses, relative clauses, notices, and short dialogues;
5. bounded `把/被`, discourse particles, reference/ellipsis, contextual tone realization, and longer integrated tasks.

Interleave:

- every pinyin distinction with human audio and known words;
- tone identification with tone-mark production and lexical meaning;
- new words with characters, pinyin, collocation, and sentence context;
- hanzi recognition with IME candidate selection;
- number reading with a real communicative use;
- grammar-form choices with meaning interpretation;
- reading and listening using the same grammar across different lexical contexts;
- speaking/self-review after the learner has heard and understood the model.

Do not require hanzi production before the relevant words are recognizable. Reduce pinyin independently of grammar difficulty; a learner may understand a construction while still needing pronunciation support.

### Recommended release slices

1. **Foundation:** pinyin, tones, common vocabulary/hanzi, numbers through 1,000, measure words, core word order, `是/有/在`, basic questions, and phrase audio.
2. **Everyday core:** internal zeroes and `万`, dates/time/prices, negation, modification, modals, comparison, aspect, short reading/listening, and guided speaking.
3. **Connected language:** results/directions, relative clauses, conjunctions, messages, dialogue completion, and discourse reference.
4. **Lower intermediate:** `亿`, fractions/percentages, selected `把/被`, richer complements/pragmatics, contextual tone realization, and multi-sentence comprehension.

Each slice must ship with its reviewed lexicon, semantic templates, accepted variants, audio, explanations, and regression corpus. Listening and supported speaking are not deferred to the last slice.

## 9. Adaptive practice guidance

Track mastery by:

`family`, `initial`, `final`, `lexicalTone`, `surfaceTonePattern`, `syllable`, `lexeme`, `character`, `component`, `wordBoundary`, `numberUnit`, `measureWord`, `grammarFeature`, `aspect`, `complement`, `register`, `semanticRole`, `production/recognition`, `pinyin/hanzi/audio`, `scaffoldUse`, and `misconception`.

| Error pattern | Likely diagnosis | Next practice |
|---|---|---|
| `b/p`, `d/t`, or `g/k` confusion | aspiration not tracked | matched human-audio pair plus articulatory cue |
| `-n/-ng` confusion | final contrast | word pair in same carrier phrase |
| right syllable, wrong tone | lexical tone mapping | same segment across tones, then word context |
| every third tone pronounced full | citation-form overgeneralization | isolated versus phrase recording |
| sandhi answer overwrites lexical tone | layers conflated | lexical/surface two-field comparison |
| toneless pinyin | tone treated as optional | tone-mark placement plus audio retrieval |
| correct pinyin, wrong hanzi | homophone/IME selection | same input in two semantic contexts |
| component chosen as whole character | visual structure | assemble and contrast nearby characters |
| digit-by-digit cardinal reading | number model | place-value reconstruction |
| missing `零` | skipped place not represented | paired number with/without internal gap |
| `两十` or `第两` | overgeneralized `两` | `二/两` context contrast |
| wrong measure word | noun-class mapping | two nouns with contrasting classifiers |
| `是` before adjective/verb | copied copula model | predicate-type minimal set |
| `不/没` swapped | event time/aspect | same verb in habitual versus completed context |
| wh word moved to front | English question order | answer slot→question slot transform |
| `了` added to every past event | tense model | completed/change-of-state/unchanged contrast |
| `的/地/得` confusion | syntactic relation unclear | modifier/adverb/complement parse |
| `来/去` reversed | deictic center missing | speaker-location diagram |
| `把` with bare/unaffected predicate | construction constraint | affected-result pair |
| reading succeeds only with pinyin | character retrieval weakness | retain grammar level, fade pinyin by word |
| listening fails for one speaker only | speaker adaptation | mastered content with varied recording |
| recording unavailable | device/permission | no-record speaking path; no mastery penalty |

Recommended due-item mix: 30% weakest skills, 25% spaced mastery, 20% cross-modal transfer, 15% integrated communicative tasks, and 10% prerequisite diagnosis.

Do not lower grammar or comprehension level merely because hanzi failed; restore pinyin for the passage and route character practice separately. Likewise, distinguish audio decoding, word knowledge, number structure, and grammar inference.

## 10. Feedback and explanations

Feedback must show:

1. the intended meaning or situation;
2. segmented simplified Chinese;
3. canonical pinyin with tone marks;
4. lexical versus surface tone only when relevant;
5. the specific word-order, aspect, complement, number, or character rule;
6. accepted alternatives and their register/nuance;
7. replay where licensed.

Examples:

> `书在桌子上` says where a known book is. `桌子上有一本书` introduces the existence of a book at that location.

> `我昨天没去` uses `没` for an event that did not happen. `我不去` normally describes refusal, intention, or a non-event without the same completed-time reading.

> `12,345,678` groups around `万`: `一千二百三十四万｜五千六百七十八`.

> `银行` is `yínháng`; the reading belongs to this word. The same character is read differently in `行走 xíngzǒu`.

Do not explain every sentence through English word order. Show Mandarin chunks, semantic roles, and the event/discourse relationship.

## 11. Audio, recording, and content requirements

- Every required listening asset has transcript, word segmentation, canonical pinyin, lexical tones, reviewed surface realization, speaker metadata, license, and semantic annotation.
- Audio is decoded locally and preloaded only as needed.
- Missing audio disables the affected instance rather than silently substituting device TTS.
- Embedded audio/base64 or byte assets are compressed and size-budgeted with browser fallbacks.
- System TTS output is labeled “device voice.”
- Microphone recording stays local and exposes visible start/stop/delete controls.
- No voiceprint, biometric profile, or hidden pronunciation score is stored.
- Lexicon/templates/audio are versioned; saved seeds retain a content version or retire safely.
- At least one proficient Standard Mandarin editor reviews each lexeme, template, accepted variant, transcript, and tone annotation. Pragmatics and regional variation receive a second review.

## 12. Rendering and accessibility requirements

- Declare page/content language appropriately (`zh-CN` for target text).
- Use a robust simplified-Chinese font stack; validate all required glyphs offline.
- Pinyin tone marks remain legible at zoom and are not conveyed by color alone.
- Optional tone colors use a user-configurable palette and redundant tone numbers/labels.
- Hanzi, pinyin, gloss, and word boundaries can be toggled independently according to the task.
- Do not place spaces between hanzi by default merely to mimic English typography.
- Token-order and IME-choice controls are keyboard-operable and announce full words plus pinyin where scaffolding is enabled.
- Stroke practice has a non-motor alternative using next-stroke/order selection.
- Audio controls expose playback state, replay count, volume, and keyboard controls.
- Listening-only assessment may hide transcripts until answer, but deaf/hard-of-hearing learners get an equivalent non-audio practice path tracked separately.

## 13. Generator and implementation requirements

### Semantic-first generation

- Generate meaning/discourse first, then choose compatible words and structures.
- Enforce animacy, definiteness, valency, aspect compatibility, measure words, complement compatibility, register, and collocations.
- Use table/finite-state rules for pinyin, tones, numbers, and licensed grammar transformations.
- Use authored accepted variants; never ask a runtime model or web service to judge naturalness.
- Keep every relevant context sentence, participant, location, time, and viewpoint in the instance oracle.
- Reject grammatical but bizarre, unsafe, culturally loaded, or pragmatically unsupported combinations.

### Offline constraint

The app builds to one standalone HTML page. Lexicon, grammar/number rules, component/stroke data, text, audio, generation, checking, and progress work offline. No dictionary, translation API, cloud TTS, speech-recognition service, or backend is assumed.

### Deterministic number generation

Represent a cardinal as four-digit sections around `万/亿`. Within each section:

1. emit occupied `千/百/十/个` places;
2. emit one `零` when one or more skipped internal places precede a later nonzero digit;
3. suppress redundant zeroes;
4. apply the standalone leading-one rule for `10..19`;
5. choose canonical `二/两` only after the numeric structure is known.

Dates, digit strings, decimals, fractions, percentages, and money use separate renderers. They must not call the cardinal renderer blindly.

## 14. Automated validation

For every generated instance:

- all lexeme/template/audio/component references resolve to the pinned data version;
- simplified spelling, word segmentation, pinyin, lexical tones, and surface annotation agree;
- pinyin syllables are legal and tone marks occupy the correct vowel;
- semantic slot choices satisfy valency, classifier, aspect, complement, definiteness, register, and discourse constraints;
- number renderers round-trip to their exact numeric structure;
- canonical and accepted answers normalize without colliding with distractors;
- every distractor maps to a declared misconception;
- single-choice tasks have exactly one best answer under the displayed context;
- audio transcript and semantic frame match the question;
- worked feedback regenerates from the same oracle;
- no placeholder, answer-bearing filename, or debug annotation leaks.

Property/regression suites cover:

- the complete pinned pinyin syllable inventory;
- numeric versus diacritic tones, `ü/u:/v`, NFC/NFD, and tone-mark placement;
- initial aspiration and high-value final contrasts;
- lexical/citation/surface separation;
- third-tone sequences, `一/不`, neutral-tone entries, and optional `儿化`;
- simplified spellings, polyphonic word readings, homophones, components, and stroke data;
- unspaced segmentation and enumerated alternatives;
- integers at every `十/百/千/万/亿` boundary;
- internal/trailing zero cases and `二/两`;
- years, digit strings, times, money, decimals, fractions, and percentages;
- every grammar/aspect/complement template and accepted order;
- question types, `不/没`, `的/地/得`, two roles of `了`, `过/着`, comparisons, `把/被`, and deictic complements;
- audio-label balance by speaker, duration, loudness, and recording session;
- recording permission denial/start/stop/delete lifecycle;
- at least `10,000` deterministic seeds per combinatorial family/level.

Corpus tests flag:

- unnatural word combinations;
- accidental traditional characters in production targets;
- one pinyin string mapping to unacknowledged choices;
- unteachable character or grammar density;
- ambiguous aspect, particle, topic, `把/被`, or complement contexts;
- number answers with competing registers not declared;
- one English gloss standing in for several unacknowledged Mandarin meanings;
- sensitive or stereotyped scenarios;
- audio whose speaker/session predicts the label.

## 15. Coverage requirements

Across a long mixed session:

- pronunciation, pinyin, hanzi, vocabulary, grammar, numbers, reading, listening, and guided speaking all recur;
- at least one third of due practice uses audio or prepares/rehearses a spoken response;
- recognition does not dominate production;
- pinyin/translation/tone-color scaffolds vary independently by mastery;
- each core sound contrast appears in isolation and in words;
- lexical tones and connected realizations are both practiced without conflation;
- common simplified words recur across reading, listening, and IME input;
- number work covers ordinary cardinal, quantity, date/time, and price contexts without dominating the app;
- `万` grouping, internal zeroes, `二/两`, and common classifiers recur intentionally;
- core question, negation, predicate, aspect, comparison, and modification patterns are balanced;
- audio varies speaker and rate without making voice a label;
- at least half of vocabulary encounters require context, collocation, character choice, comprehension, or production;
- at least 25% of due questions are integrated task-style prompts rather than isolated form labels;
- every declared misconception is deliberately exercised.

Cross-family synthesis normally combines no more than three mastered demands. Good synthesis: hear a short shopping exchange, identify the price, and choose the reply. Bad synthesis: decode several untaught characters, a rare classifier, a large decimal, a new complement, and implicit cultural knowledge at once.

## 16. Topic-level quality checklist

- [ ] Target language is Standard Mandarin with simplified-character production.
- [ ] Pinyin follows a pinned Hanyu Pinyin model and supports practical keyboard aliases.
- [ ] Lexical tone, citation form, and connected-speech realization remain distinct.
- [ ] Third tone is not taught as a mandatory full dip in every context.
- [ ] Neutral tone and `儿化` are entry/context specific.
- [ ] Words—not isolated characters—own readings and meanings.
- [ ] Polyphonic and homophonous forms are always contextualized.
- [ ] Traditional characters are not accidentally accepted as simplified production.
- [ ] Han glyph variation is not confused with character identity.
- [ ] Cardinal, digit-string, date, time, money, decimal, and fraction renderers remain separate.
- [ ] `万/亿`, internal zeroes, `二/两`, and measure words are validated structurally.
- [ ] Grammar generation begins from semantic and discourse frames.
- [ ] `是`, `不/没`, `的/地/得`, and aspect markers are not mapped mechanically from English.
- [ ] `了` is not described as a universal past tense.
- [ ] Complement, `把`, and `被` constraints are explicit.
- [ ] Ambiguous natural alternatives are accepted, contextualized, or rejected.
- [ ] Listening uses licensed human recordings as the oracle.
- [ ] Device TTS is optional and labeled.
- [ ] Speaking recordings remain local and are not automatically graded.
- [ ] Audio and visual accessibility alternatives have separate mastery dimensions.
- [ ] Every distractor represents a plausible learner error.
- [ ] Every family has difficulty progression, three examples, and deterministic validation.
- [ ] Difficulty grows through linguistic transfer, not obscurity or unreliable technology.
- [ ] The standalone app requires no backend or runtime language service.

## 17. Stable identifiers and recommended navigation

Recommended navigation:

1. Pinyin & Tone
2. Hanzi & Words
3. Numbers & Quantities
4. Core Grammar
5. Complements & Connected Language
6. Reading, Listening & Interaction

Stable family identifiers are the backticked identifiers above. Track pinyin, tone, hanzi, vocabulary, grammar, number structure, reading, listening, and supported production separately. Correctly understanding a pinyin-supported sentence does not imply character mastery, and recognizing a tone does not imply producing it reliably.
