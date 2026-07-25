# Japanese Language — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, linguistic-content editor, Japanese-input checker, text/audio renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Japanese Language

### Topic goal

Develop beginner-to-lower-intermediate communicative Japanese by repeatedly connecting script, sound, vocabulary, grammar, reading, listening, controlled writing, and guided speaking. Learners should become faster at recognizing forms, choosing language that fits a concrete context, producing constrained sentences, and understanding short authentic-style messages and conversations.

The app should train usable language, not merely terminology about grammar. Knowledge drills support practical “can do” tasks such as understanding a notice, asking for help, describing a routine, comparing options, or following a short conversation.

### Relationship to Japanese Numbers, Dates, Time, and Money

The existing **Japanese Numbers, Dates, Time, and Money** app owns:

- cardinal and large-number reading;
- counters and their sound changes;
- telephone numbers;
- clock time and duration expressions;
- calendar dates/periods and relative dates;
- yen amounts and `万`-based money conversion.

This app may use a simple already-mastered number/date/time as incidental context, but must not generate drills whose target is numeric reading, counters, calendar pronunciation, or money arithmetic. Cross-links should route those weaknesses to the separate app. Progress is not shared unless a family is demonstrably identical.

### Audience and level boundary

The curriculum begins before kana mastery and extends roughly through practical A1, A2, and early B1 tasks in the Japan Foundation/CEFR-oriented sense. These labels organize task complexity; the app does not certify a JF, CEFR, or JLPT level.

- Foundation: kana, mora awareness, fixed phrases, and one-clause patterns.
- A1-oriented: familiar words, basic self/environment statements, simple questions and requests.
- A2-oriented: connected descriptions, everyday choices, short messages, routine interactions, and core inflection.
- early-B1-oriented: short reasons, conditions, relative clauses, viewpoint-sensitive expressions, and gist/detail in short passages/dialogues.

### Scope

The topic includes:

- hiragana/katakana recognition and production, script conversion, voiced/semi-voiced sounds, small `っ`, long vowels, contracted sounds, and mora segmentation;
- contextual vocabulary, collocations, kanji readings in words, kanji/kana choice, okurigana, components, and curated stroke-order practice;
- core particles, demonstratives, existence/location, question formation, and constrained sentence ordering;
- noun/copula, `い`-/`な`-adjective, and verb classification/conjugation in plain and polite styles;
- `て` form, `ている`, potential, desire, permission, prohibition, obligation, volition, request, and experience patterns;
- transitive/intransitive pairs, comparisons, relative clauses, reasons, contrast, selected conditionals, giving/receiving, and basic register/pragmatics;
- short sentence/passage/notice/dialogue comprehension, reference/ellipsis resolution, cloze, dictation, response selection, and guided shadowing;
- Japanese keyboard/IME-friendly input, furigana, bundled audio, and optional local recording for self-review.

### Exclusions

Do not include:

- open-ended translation, essay grading, unrestricted chat, or claims to judge every natural Japanese phrasing;
- numeric/counter/date/time/money practice owned by the sister app;
- exhaustive JLPT lists, decontextualized vocabulary as the dominant activity, or unlicensed dictionary/example scraping;
- classical Japanese, dialect production, historical kana, literary grammar, kanbun, or prewar orthography;
- productive advanced honorific/humble transformations, business email conventions, academic writing, or legal/medical interpretation;
- unrestricted pitch-accent grading, dialect comparison, or claims that one pitch pattern is universally “the Japanese pronunciation”;
- free handwriting recognition, arbitrary kanji OCR, calligraphy quality, or motor-skill grading beyond curated tracing/order;
- cloud speech recognition, automatic open-ended pronunciation scoring, or recording/uploading speech to a backend;
- machine-generated sentences/audio published without human linguistic review;
- cultural stereotypes, invented etiquette rules, or questions with a single “Japanese people always...” answer.

### Language variety and usage policy

- Core grammar and orthography use contemporary standard Japanese.
- Formality, gendered style, age, relationship, and situation are represented only when the content entry explicitly models them.
- Do not label a grammatical but uncommon expression simply “wrong.” Mark it as outside the requested pattern/register or avoid the prompt.
- Every item distinguishes:
  1. **canonical target**, taught/displayed for the requested pattern;
  2. **accepted variant**, natural in the same meaning/register;
  3. **contextually different**, grammatical but changes focus, implication, politeness, or meaning;
  4. **incorrect**, violates the controlled grammar/lexicon.
- Content tables carry editorial notes and provenance for usage judgments.

### Linguistic data model

Every lexical entry is authored/versioned:

```text
Lexeme := {
  id,
  lemma,
  reading,
  spellings[],
  partOfSpeech,
  inflectionClass,
  transitivity,
  pairId,
  semanticTags[],
  selectionalTags[],
  register,
  politeness,
  commonCollocations[],
  acceptedVariants[],
  audioIds[],
  exampleTemplateIds[],
  provenance
}
```

Grammar templates are typed structures, not string substitution:

```text
SentenceTemplate := {
  semanticRoles,
  slots,
  requiredParticles,
  inflectionFeatures,
  wordOrderVariants,
  register,
  contextConditions,
  acceptedRealizations,
  rejectionRules
}
```

Generate a semantic frame, select compatible lexemes, realize a sentence, validate it against accepted patterns, then render. Never select random nouns/verbs solely because their surface grammar fits.

### Script, reading, and romanization conventions

- Internal text is Unicode and normalized with NFKC where safe, followed by Japanese-specific normalization.
- Preserve distinctions that NFKC could obscure in a target task; compare from tokenized semantic forms rather than blindly normalized display strings.
- Hiragana and katakana use modern kana. `を`, `は`, and `へ` retain conventional particle spelling despite pronunciation.
- Small `ゃゅょ`, `っ`, `ぁぃぅぇぉ`, long-vowel mark `ー`, dakuten, and handakuten are semantically significant.
- Katakana `ー` is not silently interchangeable with arbitrary vowel kana in spelling tasks.
- Ordinary Japanese spacing is ignored in free text unless segmentation is the target.
- Japanese punctuation variants may normalize when punctuation is not assessed.
- Romaji is an optional early scaffold, never the default beyond kana foundation.
- Supported romaji input follows a pinned modified Hepburn table: `shi, chi, tsu, fu`, apostrophe for ambiguous moraic `n` where needed, doubled consonants for small `っ`, and macron or expanded-vowel variants from an entry-specific table.
- Do not auto-correct a missing small kana, voicing mark, mora, or long vowel into a correct answer.

### Japanese input and answer checking

Response modes include:

- single/multiple choice;
- kana/kanji short text;
- token ordering;
- particle/ending slot;
- inflection stem plus ending fields;
- sentence-frame slots;
- matching;
- dictation;
- local audio record-and-compare for self-review only.

Checking layers:

1. normalize allowed width/script/punctuation variants;
2. tokenize with the known lexicon/template rather than unrestricted morphological guessing;
3. compare lemma, reading, inflection features, particles, order constraints, and register;
4. accept enumerated alternative realizations;
5. reject or route any ambiguous open form to multiple choice/structured input.

Kana may be accepted for a kanji answer when the target is grammar/meaning, but not when kanji production is the skill. Katakana/hiragana interchange is accepted only when script choice is not assessed.

### Furigana policy

- Furigana derives from lexeme-level reading alignment, never naïve character-by-character splitting.
- Beginner levels may show all non-kana readings.
- Later levels hide furigana for mastered words/kanji but restore it on request without penalty in practice mode.
- Irregular and jukujikun readings are whole-word annotations.
- A furigana request is tracked as scaffolding, not an error.

### Normative inflection model

Verbs are table-driven:

- godan, including lexical `る`-ending godan verbs such as `帰る`;
- ichidan;
- irregular `する`, `来る`, and reviewed compounds.

Canonical forms include dictionary, nonpast polite, negative, past, negative past, `て`, polite request, progressive/resultant `ている`, potential, volitional, and selected derived constructions.

- Godan phonological rows and `て/た` changes are exact tables.
- `行く→行って/行った` is an explicit exception.
- `ある` negative is `ない`.
- Standard potential forms are canonical; common `ら`-dropping forms may be entry/level-specific accepted variants in comprehension but are not silently treated as the sole standard production target.
- `いい` inflects from `よい`: `よくない`, `よかった`.
- `な` adjectives and nouns use copular paradigms; `きれい` is a `な` adjective despite ending in `い`.
- Conjugation spelling is separate from pronunciation changes.

### Particle and information-structure policy

Particles are not generated from an English preposition lookup.

- `は` marks a topic/contrast; `が` marks a grammatical subject and often new/focused information under controlled contexts.
- `を` marks direct object and selected path expressions in authored templates.
- `に` covers destination, point in time, recipient, existence location, and result/state roles only in typed frames.
- `で` covers action location, means/instrument, and cause/material roles only in typed frames.
- `へ` marks direction and is not accepted in every destination/result pattern where `に` appears.
- `と` covers comitative, quotation, and exhaustive coordination through separate frames.
- `も`, `の`, `から`, `まで`, and `より` use separate semantic roles.

If more than one particle is natural, the prompt must either:

- provide discourse/context making the requested contrast clear;
- accept all meaning-preserving variants with feedback on nuance; or
- use a contrast/interpretation question instead of pretending there is one blank answer.

### Audio and listening architecture

Listening is a required core skill, but a standalone page cannot rely on a cloud TTS service.

- Ship a compact, licensed, human-recorded audio corpus covering the active lexicon, minimal pairs, and authored sentence/dialogue instances.
- Listening generators select and recombine semantic tasks around recorded utterances; they do not concatenate mora recordings into unnatural “speech.”
- Record multiple speakers where practical and balance label distribution by speaker.
- Provide normal and selected learner-slow recordings when authored. Playback-rate slowing may supplement but should not be the only slow model.
- Optional browser `speechSynthesis` may read generated text for extra exposure, but voice availability/quality/offline status varies and its output is never the pronunciation oracle.
- Audio starts only after user gesture and has replay/transcript controls appropriate to the task.
- Do not leak an answer through file name, duration, loudness, speaker, or fixed replay behavior.

### Speaking and recording policy

Guided speaking includes shadowing, reading aloud, and constrained response rehearsal.

- Recording is optional, local, and deleted when the learner discards/closes it unless they explicitly download it.
- The app may show waveform, duration, and play learner/reference audio alternately.
- It must not assign a correctness score to arbitrary pronunciation.
- For fixed mora/long-vowel/geminate contrasts, coarse duration/onset visualization may be descriptive, but the learner self-assesses or chooses from a replay comparison.
- No microphone permission is requested until the learner selects recording.

### Difficulty philosophy

Difficulty should rise through:

- less scaffolding/furigana/romaji;
- production after recognition;
- denser but still natural context;
- closely contrasting forms and discourse roles;
- longer dependencies, clauses, and audio memory;
- plain/polite/register transfer;
- kanji/kana and listening/reading transfer;
- combining two or at most three mastered grammar operations.

It must not rise through obscure vocabulary, tiny text, unnatural generated sentences, arbitrary synonym rejection, excessive typing, speech-recognition failures, or trick questions that depend on missing context.

### Global generation metadata

Each instance stores:

`categoryId`, `subcategoryId`, `familyId`, `level`, `canDoTag`, `semanticFrame`, `lexemeIds`, `grammarFeatures`, `canonicalJapanese`, `acceptedVariants`, `readingTokens`, `orthographyPolicy`, `register`, `context`, `audioId`, `responseMode`, `misconceptionsTargeted`, `difficultyDimensions`, `workedExplanation`, `dataVersion`, and `structuralSignature`.

Reject recent structural signatures within 20 questions and exact sentence/audio instances within 100. Lexical substitutions count as meaningful only when they exercise compatible semantics or a deliberate vocabulary contrast.

### Distractor construction

Construct distractors by applying one recorded learner-error transformation to an otherwise valid semantic form. Useful transformations include:

- substitute a visually or aurally confusable kana;
- remove or enlarge a small kana, voicing mark, geminate, or long vowel;
- choose a homophone that conflicts with the sentence context;
- substitute a particle serving a commonly confused semantic role;
- apply the wrong inflection class, tense, polarity, or register;
- reverse actor, giver/receiver, transitivity, comparison, or discourse viewpoint;
- choose a grammatically compatible response with the wrong dialogue act.

Do not use arbitrary words or random malformed strings. Validate that each distractor is distinct after normalization, has the intended wrong interpretation, and is not an accepted variant. Single-choice questions must have exactly one best answer under the displayed context; otherwise add context, accept multiple answers, or reject the instance.

## 2. Category: Kana, Sound, and Input

### Category purpose

Build automatic kana recognition/production and accurate mora structure before grammar complexity.

### Learn

Kana represent morae, not English-style letters. Voicing marks, small kana, small `っ`, and vowel length can change a word. Read/write the whole mora sequence rather than approximating from romaji.

### Common misconceptions

- Treating small and full-size kana as identical.
- Omitting dakuten/handakuten.
- Reading `ん` as a fixed English `n`.
- Counting syllables instead of morae.
- Ignoring long vowels or small `っ`.
- Writing particle pronunciation instead of conventional spelling.

### Family `kana_recognition`

**Task.** Identify a hiragana/katakana symbol or mora from sound/choice.

**Difficulty.** L1 basic rows; L2 visually similar kana; L3 mixed scripts/small kana.

**Examples.**

1. `あ` → `a`.
2. `シ` → `shi`.
3. distinguish `ソ/ン`.

**Validation.** Pinned kana table and balanced confusion sets.

### Family `kana_production`

**Task.** Type/select the requested kana from a reading or audio.

**Difficulty.** L1 basic hiragana; L2 katakana; L3 mixed voiced/small forms.

**Examples.**

1. `ka` → `か`.
2. `po` → `ぽ`.
3. `kyo` → `きょ`.

**Validation.** Semantic mora sequence; romaji accepted only at declared scaffold levels.

### Family `kana_script_conversion`

**Task.** Convert a controlled word between hiragana and katakana without changing morae.

**Difficulty.** L1 basic; L2 voiced/contracted; L3 long-vowel conventions in curated loanwords.

**Examples.**

1. `さくら` → `サクラ`.
2. `ぎゅうにゅう` → `ギュウニュウ` as mechanical script conversion.
3. katakana loanword `コンピューター` retains `ー`.

**Validation.** Mora-token mapping plus entry-specific orthography.

### Family `voicing_marks`

**Task.** Add/remove dakuten or handakuten and identify the changed mora/word.

**Difficulty.** L1 `k→g`; L2 `s/t/h` rows; L3 word minimal pairs.

**Examples.**

1. `か→が`.
2. `は→ば/ぱ`.
3. `かき` versus `かぎ` differ in second mora voicing.

**Validation.** Exact row transformation and audio/orthography mapping.

### Family `small_tsu`

**Task.** Distinguish/write/count geminate consonants using small `っ/ッ`.

**Difficulty.** L1 visual choice; L2 kana↔romaji; L3 minimal-pair listening/dictation.

**Examples.**

1. `きて` versus `きって`.
2. `kitte` → `きって`.
3. `ベッド` contains small `ッ`.

**Validation.** Mora sequence includes closure mora; audio instances are human-recorded pairs.

### Family `long_vowel`

**Task.** Recognize/produce vowel length in native and loanword spellings.

**Difficulty.** L1 `おう/う` patterns; L2 katakana `ー`; L3 minimal-pair listening with entry-specific spelling.

**Examples.**

1. `おばさん` versus `おばあさん`.
2. `せんせい` ends in a long `e` sound.
3. `コーヒー` uses `ー`.

**Validation.** Lexeme reading tokens include moraic length; no blind phonetic spelling inference.

### Family `contracted_kana`

**Task.** Distinguish/produce `きゃ/しゅ/ちょ`-type contracted morae.

**Difficulty.** L1 visual; L2 romaji/kana; L3 contrast full-size sequence.

**Examples.**

1. `kya` → `きゃ`.
2. `しゅ` is one contracted mora, not `しゆ`.
3. distinguish `びょういん` from full-size `びよういん`.

**Validation.** Small-y kana tokenization and curated word list.

### Family `mora_segmentation`

**Task.** Segment/count morae in a word and mark long/geminate/moraic-N units.

**Difficulty.** L1 ordinary kana; L2 `ん/っ/ー`; L3 combined loanword/native forms.

**Examples.**

1. `さくら` → `さ|く|ら`, 3.
2. `にっぽん` → `に|っ|ぽ|ん`, 4.
3. `スーパー` → `ス|ー|パ|ー`, 4.

**Validation.** Lexeme mora-token sequence, not Unicode code-point count.

## 3. Category: Vocabulary, Kanji, and Orthography

### Category purpose

Learn words as form–meaning–usage units and kanji as components of words in context.

### Learn

A kanji can have different readings in different words. Learn the word and its context, not a universal one-character pronunciation. Okurigana show inflection and word identity. Components can support recognition but do not guarantee meaning or sound.

### Family `contextual_vocabulary`

**Task.** Choose/produce the word fitting a pictured or sentence context.

**Difficulty.** L1 concrete noun/verb; L2 adjective/adverb; L3 near-synonym with register/selectional context.

**Examples.**

1. `水を___。` → `飲みます`.
2. `___本` with “interesting” → `おもしろい`.
3. choose `借りる` versus `貸す` from giver/receiver roles.

**Validation.** Typed semantic slots and authored distractor contrasts.

### Family `collocation_choice`

**Task.** Select the conventional predicate/noun combination in a controlled context.

**Difficulty.** L1 fixed everyday collocation; L2 similar verbs; L3 register.

**Examples.**

1. `写真を撮る`.
2. `風邪をひく`.
3. `約束を守る`.

**Validation.** Reviewed collocation table; grammatical-but-unmodeled alternatives avoided.

### Family `kanji_word_reading`

**Task.** Give/select the reading of a kanji word in a sentence.

**Difficulty.** L1 single common kanji; L2 compounds; L3 context-disambiguated homographs.

**Examples.**

1. `山` → `やま`.
2. `学校` → `がっこう`.
3. `今日` → `きょう` as a whole-word irregular reading.

**Validation.** Lexeme-level reading; whole-word furigana alignment for irregulars.

### Family `reading_to_kanji_word`

**Task.** Choose/type the correct kanji spelling for a known word/context.

**Difficulty.** L1 one character; L2 compound; L3 homophone choice.

**Examples.**

1. `かわ` → `川` in river context.
2. `でんしゃ` → `電車`.
3. `はし` in “cross the bridge” → `橋`, not `箸`.

**Validation.** Context-bound lexeme IDs and accepted orthographic variants.

### Family `okurigana`

**Task.** Complete/identify okurigana and inflected reading.

**Difficulty.** L1 adjective/verb ending; L2 inflection; L3 lookalike word boundary.

**Examples.**

1. `食べる` → kanji `食` plus `べる`.
2. `高かった` retains `高` plus `かった`.
3. `話す/話し` use lexeme-specific okurigana.

**Validation.** Lemma morphology and surface inflection alignment.

### Family `kanji_component`

**Task.** Identify a recurring component/radical or assemble a curated kanji from components.

**Difficulty.** L1 locate component; L2 distinguish similar kanji; L3 use component as mnemonic clue without claiming determinism.

**Examples.**

1. `休` contains person `亻` and tree `木`.
2. distinguish `日/目`.
3. identify water component `氵` in `海`.

**Validation.** Versioned component graph; no generated folk etymologies.

### Family `kanji_stroke_order`

**Task.** Choose the next stroke or trace a curated kanji in standard order.

**Response mode.** Ordered stroke choice/tracing with generous geometry.

**Difficulty.** L1 `2..4` strokes; L2 `5..8`; L3 common compounds' characters.

**Examples.**

1. `十`: horizontal then vertical.
2. order the three strokes of `川`.
3. trace `休` from bundled vector paths.

**Validation.** Licensed/versioned stroke-path data; grade order/direction/coarse path, not calligraphic beauty.

### Family `homophone_context`

**Task.** Choose meaning/spelling among same-reading words from context.

**Difficulty.** L1 concrete pairs; L2 verb/noun pairs; L3 short discourse.

**Examples.**

1. `あめ` with weather → `雨`; with candy → `飴`.
2. `はしで食べる` → `箸`.
3. `かえる` homeward → `帰る`, exchange → `替える` in curated context.

**Validation.** Same normalized reading, distinct semantic frames.

### Family `orthography_register_choice`

**Task.** Choose an appropriate kana/kanji/katakana spelling for the stated context.

**Difficulty.** L1 loanword script; L2 common kana preference; L3 formal notice versus casual message.

**Examples.**

1. `テレビ` uses katakana.
2. particle `は` is written `は`, not pronunciation `わ`.
3. choose an authored formal-sign spelling over a casual phonetic variant.

**Validation.** Entry-specific register/orthography table; variants explained, not universalized.

## 4. Category: Particles and Sentence Structure

### Category purpose

Map semantic roles and discourse context to particles and build natural constrained clauses.

### Learn

Japanese often places the predicate last and marks roles with particles. Particles do not have one English translation. Choose them from the event/discourse relationship: who/what, where, destination, means, topic, focus, possession, quotation, and so on.

### Family `topic_subject`

**Task.** Choose/interpret `は` versus `が` in an authored discourse context.

**Difficulty.** L1 established topic/new subject; L2 contrast; L3 subordinate/exhaustive-focus context.

**Examples.**

1. `私は学生です。` introduces a statement about me.
2. `だれが来ましたか。田中さんが来ました。`
3. `猫は好きですが、犬は...` uses contrastive topics.

**Validation.** Context template declares information status; ambiguous cases accept variants or are rejected.

### Family `direct_object_particle`

**Task.** Insert/interpret `を` in transitive/path templates.

**Difficulty.** L1 direct object; L2 omitted subject/topic; L3 authored path-use contrast.

**Examples.**

1. `パンを食べます。`
2. `音楽を聞きます。`
3. `公園を歩きます。` uses path `を`.

**Validation.** Verb valency frame and semantic role.

### Family `ni_de_e`

**Task.** Choose among `に`, `で`, and `へ` for destination, existence, time, action location, means, or direction.

**Difficulty.** L1 action versus existence location; L2 destination/means; L3 meaning-preserving direction variants.

**Examples.**

1. `学校で勉強します。`
2. `学校に行きます。` (`へ` accepted for directional nuance here).
3. `机の上に本があります。`

**Validation.** Typed frame; accepted variants explicitly attached.

### Family `no_nominalization`

**Task.** Use/interpret possessive/attributive `の` or controlled nominalizing `の/こと`.

**Difficulty.** L1 possession/category; L2 ellipsis `私の`; L3 authored nominalization contrast.

**Examples.**

1. `私の本`.
2. `日本語の先生`.
3. `泳ぐのが好きです。`

**Validation.** Relation/nominalization semantic frame; avoid universally interchangeable `の/こと` prompts.

### Family `to_roles`

**Task.** Choose/interpret comitative, quotation, or exhaustive coordination `と`.

**Difficulty.** L1 “with”; L2 quotation; L3 distinguish complete list from `や`.

**Examples.**

1. `友達と話します。`
2. `「行く」と言いました。`
3. `りんごとみかん` presents the listed items exhaustively in the controlled contrast.

**Validation.** Separate frame IDs for each role.

### Family `mo_kara_made_yori`

**Task.** Fill/interpret `も`, source `から`, limit `まで`, or comparison baseline `より`.

**Difficulty.** L1 “also”; L2 source/limit; L3 comparison.

**Examples.**

1. `私も行きます。`
2. `駅から学校まで歩きます。`
3. `電車はバスより速いです。`

**Validation.** Semantic role and comparison structure.

### Family `existence_location`

**Task.** Build/interpret `ある/いる` sentences and entity/location order.

**Difficulty.** L1 animate/inanimate; L2 location-first existence; L3 possession/event existence.

**Examples.**

1. `机の上に本があります。`
2. `教室に学生がいます。`
3. `兄がいます。` means “I have an older brother” in supplied self context.

**Validation.** Animacy and existence-frame table; exceptional uses authored.

### Family `demonstratives`

**Task.** Select `こ/そ/あ/ど` series by speaker/listener/discourse relation.

**Difficulty.** L1 `これ/それ/あれ`; L2 `この/ここ`; L3 discourse reference.

**Examples.**

1. object near speaker → `これ`.
2. `この本`, not standalone `この`.
3. unknown location question → `どこ`.

**Validation.** Spatial/discourse scene and syntactic form.

### Family `sentence_order`

**Task.** Arrange tokens into a grammatical sentence under a fixed intended meaning/register.

**Difficulty.** L1 one clause; L2 adverb/time/topic; L3 subordinate/relative chunk.

**Examples.**

1. `私は / 本を / 読みます`.
2. `昨日 / 図書館で / 勉強しました`.
3. keep `昨日買った` together before `本`.

**Validation.** Template accepts enumerated scrambling-safe variants; particle–phrase attachment preserved.

### Family `question_response`

**Task.** Form a question or select a pragmatically fitting short answer.

**Difficulty.** L1 `か/何/どこ`; L2 yes/no polarity; L3 negative question/ellipsis.

**Examples.**

1. `これは何ですか。`
2. `コーヒーを飲みますか。—はい、飲みます。`
3. `一緒に行きませんか。—はい、ぜひ。`

**Validation.** Dialogue-act compatibility and register.

## 5. Category: Inflection and Core Constructions

### Category purpose

Build reliable adjective/copula/verb forms and use them in meaningful short contexts.

### Learn

Identify the word class before changing its ending. Japanese inflection packages tense/polarity/politeness differently across verbs, `い` adjectives, `な` adjectives, and nouns. Derived forms such as `て`, potential, and volitional follow class-specific rules.

### Family `noun_copula`

**Task.** Produce/interpret noun predicates across tense, polarity, and polite/plain style.

**Examples.**

1. polite nonpast `学生です`.
2. plain negative `学生じゃない` (`ではない` accepted by context).
3. polite past negative `学生ではありませんでした`.

**Difficulty/validation.** One feature; two features; register transfer. Table-driven copula features and accepted contractions.

### Family `i_adjective_inflection`

**Task.** Inflect an `い` adjective for tense/polarity and connect nouns/adverbs.

**Examples.**

1. `高い→高くない`.
2. `おもしろい→おもしろかった`.
3. `いい→よくなかった`.

**Difficulty/validation.** Regular nonpast; past/negative; `いい`/adverbial `く`. Morphology table round trip.

### Family `na_adjective_inflection`

**Task.** Inflect/use `な` adjectives predicatively or before nouns.

**Examples.**

1. `静かな町`.
2. `町は静かです。`
3. `きれいではありませんでした`.

**Difficulty/validation.** Attributive/predicate; polarity/tense; `い`-ending lookalikes. Lexeme POS drives forms.

### Family `verb_group`

**Task.** Classify godan/ichidan/irregular verb from a reviewed lexeme and choose the relevant stem rule.

**Examples.**

1. `食べる` → ichidan.
2. `書く` → godan.
3. `帰る` → godan despite `-いる/える` surface heuristic.

**Difficulty/validation.** Obvious; `る`; lexical exceptions. Never classify from suffix heuristic alone in oracle.

### Family `polite_plain`

**Task.** Convert between dictionary/plain and `ます`-polite forms in a stated context.

**Examples.**

1. `食べる→食べます`.
2. `書きます→書く`.
3. `来ます→来る（くる）`.

**Difficulty/validation.** Regular; godan row; irregular/whole sentence. Feature-preserving morphology.

### Family `verb_tense_polarity`

**Task.** Produce plain/polite nonpast, past, negative, or negative-past forms.

**Examples.**

1. `食べる` plain negative → `食べない`.
2. `書く` plain past → `書いた`.
3. `行く` polite past negative → `行きませんでした`.

**Difficulty/validation.** Single feature; godan changes; combined polite/negative/past. Table oracle.

### Family `te_form`

**Task.** Form/recognize `て/で` form and its phonological class.

**Examples.**

1. `食べる→食べて`.
2. `読む→読んで`.
3. `行く→行って`.

**Difficulty/validation.** Ichidan; godan groups; exceptions/irregular. Exact conjugation table.

### Family `te_iru_aspect`

**Task.** Interpret/produce `ている` as ongoing, habitual, or resultant state under a typed verb/context.

**Examples.**

1. `今、本を読んでいます。` → ongoing.
2. `東京に住んでいます。` → continuing state.
3. `窓が開いています。` → resultant open state.

**Difficulty/validation.** Ongoing; state/habit; lexical-aspect contrast. Authored interpretations, not surface-only rule.

### Family `potential_desire`

**Task.** Produce/interpret potential or first-person desire forms.

**Examples.**

1. `食べる→食べられる`.
2. `書く→書ける`.
3. `日本へ行きたいです。`

**Difficulty/validation.** Ichidan/godan; irregular; distinguish ability/desire/particle frame. Perspective constraints explicit.

### Family `permission_prohibition_obligation`

**Task.** Complete/interpret `てもいい`, `てはいけない`, and `なければならない` patterns.

**Examples.**

1. `入ってもいいです。` → permission.
2. `ここで写真を撮ってはいけません。` → prohibition.
3. `勉強しなければなりません。` → obligation.

**Difficulty/validation.** Meaning recognition; construct from verb; polarity/register. Pattern AST.

### Family `volitional_request`

**Task.** Produce/choose invitations, volitional forms, and bounded requests.

**Examples.**

1. `行く→行こう`.
2. `一緒に食べましょう。`
3. polite request `少し待ってください。`

**Difficulty/validation.** Invitation; plain volitional; context-appropriate request. Verb-class and dialogue-act oracle.

## 6. Category: Connected and Intermediate Constructions

### Category purpose

Connect clauses and viewpoint while keeping context sufficient to distinguish natural alternatives.

### Family `transitive_intransitive_pair`

**Task.** Choose verb/particle from event causation or resultant-state context.

**Examples.**

1. `ドアが開きました。` (opened).
2. `田中さんがドアを開けました。`
3. `電気がついています/電気をつけました`.

**Difficulty/validation.** Clear pair; aspect; causation/context. Lexical pair IDs and role frames.

### Family `relative_clause`

**Task.** Build/interpret a noun-modifying clause with the missing role understood.

**Examples.**

1. `昨日買った本`.
2. `日本語を教える人`.
3. `私が住んでいる町`.

**Difficulty/validation.** Subject/object gap; tense/aspect; longer clause. Clause AST directly precedes noun; no relative pronoun.

### Family `comparison_superlative`

**Task.** Compare options with `より/ほうが/ほど` or choose a superlative in a stated set.

**Examples.**

1. `電車はバスより速いです。`
2. `犬より猫のほうが好きです。`
3. `この中で、これがいちばん安いです。`

**Difficulty/validation.** Direct; preference order; bounded set/scope. Semantic ordering oracle.

### Family `reason_and_contrast`

**Task.** Join/interpret clauses with `から`, `ので`, `けど/が` under displayed register/relationship.

**Examples.**

1. `雨ですから、行きません。`
2. `用事があるので、帰ります。`
3. `高いですが、便利です。`

**Difficulty/validation.** Meaning; clause ordering; register/softness contrast. Authored accepted forms.

### Family `conditional_choice`

**Task.** Choose/interpret a supported `と/たら/なら/ば` conditional from an explicit relation.

**Scope.** Automatic/general result `と`, completed hypothetical/when `たら`, topic-given condition `なら`, and neutral conditional `ば` only in reviewed templates.

**Examples.**

1. `春になると、暖かくなります。`
2. `着いたら、電話してください。`
3. `日本へ行くなら、京都もおすすめです。`

**Difficulty/validation.** Recognition; select from context; controlled production. Reject contexts with several equally natural choices.

### Family `giving_receiving`

**Task.** Choose/interpret `あげる/くれる/もらう` from giver, receiver, and speaker viewpoint.

**Examples.**

1. `私は友達に本をあげました。`
2. `友達が私に本をくれました。`
3. `私は友達に本をもらいました。`

**Difficulty/validation.** Participant roles; speaker in-group; `て`-benefactive later. Viewpoint graph.

### Family `sequence_experience`

**Task.** Use/interpret `てから`, `たり...たりする`, or `たことがある`.

**Examples.**

1. `ご飯を食べてから、出かけます。`
2. `休みの日は、本を読んだり、映画を見たりします。`
3. `日本へ行ったことがあります。`

**Difficulty/validation.** Sequence; nonexhaustive examples; life experience versus specific past. Event semantics.

### Family `register_pragmatics`

**Task.** Select a fitting request/apology/response for relationship and situation.

**Examples.**

1. service request: `お願いします。`
2. polite soft request: `もう一度言ってもらえますか。`
3. friend invitation versus teacher request uses different authored register.

**Difficulty/validation.** Fixed phrase; politeness contrast; dialogue choice. Human-reviewed scenario table; avoid universal etiquette claims.

## 7. Category: Reading, Listening, and Interaction

### Category purpose

Integrate language knowledge into short task-based comprehension and supported production.

### Learn

Read/listen for the task: gist, actor, action, location, reason, sequence, or requested response. Japanese often omits recoverable subjects/objects; use context rather than inserting a pronoun mechanically.

### Family `sentence_segmentation_parse`

**Task.** Segment a sentence into phrases and identify predicate/roles.

**Examples.**

1. `私は｜図書館で｜本を｜読みます`.
2. identify `読みました` as predicate.
3. attach `昨日買った` to `本`.

**Difficulty/validation.** Visible particles; omitted topic; relative clause. Template parse tree.

### Family `short_reading_comprehension`

**Task.** Read a generated/authored `1..5` sentence passage and answer gist/detail/inference within stated facts.

**Examples.**

1. identify where a person goes.
2. order two events linked by `てから`.
3. infer chosen option from comparison/reason.

**Difficulty/validation.** One fact; cross-sentence reference; bounded inference. Semantic passage model proves answer.

### Family `notice_message`

**Task.** Interpret a short notice, menu-like label, instruction, or personal message.

**Examples.**

1. `入口` versus `出口`.
2. `ここでは写真を撮らないでください。`
3. determine requested action from a short schedule-change message without testing date reading.

**Difficulty/validation.** Sign; instruction; multi-line message. Authored layouts and action semantics.

### Family `dialogue_completion`

**Task.** Choose/construct a short response fitting grammar, information, and politeness.

**Examples.**

1. `お元気ですか。—はい、元気です。`
2. `すみません、駅はどこですか。—あそこです。`
3. decline an invitation politely using an authored response.

**Difficulty/validation.** Adjacency pair; information request; indirect/pragmatic response. Dialogue-act table.

### Family `reference_ellipsis`

**Task.** Resolve an omitted subject/object or demonstrative from a short controlled discourse.

**Examples.**

1. identify who omitted subject refers to from prior sentence.
2. `それ` refers to listener-side/prior mentioned object in context.
3. choose omitted object shared across coordinated clauses.

**Difficulty/validation.** Local antecedent; competing entities; viewpoint. Discourse graph with unique target.

### Family `listening_word_contrast`

**Task.** Hear and identify a word/minimal contrast from the recorded corpus.

**Examples.**

1. `きて/きって`.
2. `おばさん/おばあさん`.
3. voiced contrast such as `かき/かぎ`.

**Difficulty/validation.** Replay+text choices; kana entry; context sentence. Human-recorded paired assets and speaker balance.

### Family `listening_dictation`

**Task.** Transcribe a recorded word or short controlled sentence in kana/known kanji.

**Examples.**

1. one kana word.
2. short particle-bearing sentence.
3. sentence with long vowel/small `っ` and known inflection.

**Difficulty/validation.** Mora length; clause; reduced scaffolding. Token comparison with target-specific orthography alternatives.

### Family `listening_comprehension`

**Task.** Hear a short recorded utterance/dialogue and answer gist/detail/next-action.

**Examples.**

1. choose the mentioned place.
2. identify why a speaker declines.
3. choose what should happen next from a two-turn dialogue.

**Difficulty/validation.** One utterance; two turns; several details. Audio/transcript semantic model and distractor proof.

### Family `guided_speaking_shadowing`

**Task.** Repeat/read a recorded phrase or choose and rehearse a constrained spoken response.

**Response mode.** Local record/replay plus self-check checklist; optional exact response text selection precedes speaking.

**Examples.**

1. shadow `ありがとうございます`.
2. record/read a short request after model audio.
3. select then speak a fitting response to an invitation.

**Difficulty/validation.** Short fixed phrase; clause; interaction response. Verify recording lifecycle/UI, not pronunciation correctness; learner may mark retry/comfortable.

## 8. Cross-family progression

Recommended order:

1. core hiragana, morae, concrete vocabulary, fixed greetings, `XはYです`;
2. katakana, basic kanji words, `を/に/で`, existence, adjective/copula forms;
3. verb groups, polite/plain nonpast/past/negative, `て` form, questions, short readings/listening;
4. key core constructions, transitivity, relative clauses, comparison, reasons, and connected messages;
5. selected conditionals, giving/receiving, register, longer dialogues, dictation, and guided speaking.

Interleave:

- every kana contrast with reading, writing, and recorded listening;
- new vocabulary with collocation and sentence context;
- kanji reading with whole-word use and optional tracing;
- particle choice with meaning interpretation;
- conjugation tables with sentence/dialogue use;
- reading and listening of the same grammar in varied lexical contexts;
- controlled production only after recognition and reconstruction.

Static vocabulary review may use spaced repetition, but at least half of vocabulary encounters should require contextual retrieval, collocation, inflection, or comprehension.

### Recommended release slices

1. **Foundation:** kana/sound/input, contextual vocabulary, basic particles, copula/adjectives, polite nonpast verbs, and recorded word/phrase listening.
2. **Core interaction:** verb inflection, `て` form, existence/location, questions/responses, short reading, dictation, and local shadowing.
3. **Connected language:** transitivity, relative clauses, comparison, reasons, sequence/experience, notices, and short dialogues.
4. **Early intermediate:** selected conditionals, giving/receiving viewpoint, register/pragmatics, reference/ellipsis, and multi-sentence comprehension.

Each slice must include reading, writing, listening, and supported speaking from its first release. A slice is content-complete only when its lexemes, templates, accepted variants, audio, explanations, and regression corpus have been reviewed together.

## 9. Adaptive practice guidance

Track:

`family`, `script`, `mora feature`, `lexeme`, `kanji`, `reading`, `partOfSpeech`, `inflection feature`, `particle role`, `register`, `semantic frame`, `production/recognition`, `reading/listening`, `scaffold use`, and `misconception`.

| Error pattern | Diagnosis | Next item |
|---|---|---|
| full `つ` for small `っ` | size/gemination | visual then minimal-pair listening |
| long vowel omitted | mora length | segmentation plus recorded contrast |
| particle written `わ/え` | sound/spelling conflict | `は/へ` particle contrast |
| correct reading, wrong kanji homophone | context mapping | same reading in two frames |
| `は/が` errors without stable pattern | missing discourse context | new-versus-established explicit dialogue |
| `に/で` swapped | existence/action location | paired same-location sentences |
| ichidan rule applied to `帰る` | suffix heuristic | reviewed `る`-verb contrast set |
| `行いて` | godan/exception | `書いて/行って` pair |
| `いいくない` | lexical exception | `よい` stem family |
| transitive verb with `が` patient | causation/valency | open/open-something pair |
| conditionals indiscriminately swapped | relation nuance | authored two-choice context |
| `あげる/くれる` reversed | speaker viewpoint | participant diagram |
| reading accurate only with furigana | orthographic retrieval | retain word, gradually fade reading |
| listening errors only for one speaker | speaker adaptation | mastered item with varied recorded voice |
| recording unavailable | device/permission | self-spoken no-record path; no mastery penalty |

Recommended selection: 35% weakest due, 25% spaced mastery, 20% cross-modal transfer, 10% prerequisite diagnosis, 10% task-based combinations.

Do not lower grammar level merely because kanji failed; restore furigana while routing kanji separately. Likewise, distinguish audio decoding from grammatical comprehension.

## 10. Feedback and explanations

Feedback must show:

1. intended meaning/context;
2. segmented Japanese with furigana as appropriate;
3. the specific particle/inflection/word-choice rule;
4. accepted alternatives and nuance when relevant;
5. a natural translation/gloss only as support, not as the answer oracle;
6. replay/audio where licensed.

Examples:

> `学校で勉強します`: `で` marks where an action happens. `学校に行きます` uses `に` for the destination.

> `帰る` is a godan verb, so its negative is `帰らない`, not `帰ない`.

> Sharing a reading does not make kanji words interchangeable: `橋` and `箸` are both read `はし` but name different things.

Do not explain Japanese solely through English word order. Show semantic roles and Japanese chunks.

## 11. Audio, recording, and content requirements

- Every required listening asset has transcript, speaker metadata, license, semantic annotation, and normal-speed timing.
- Audio is decoded locally and preloaded only as needed; a missing asset disables that instance rather than falling back silently to a different answer.
- Embedded base64/byte assets are size-budgeted; use compressed formats with a documented browser fallback.
- System TTS output is labeled “device voice.”
- Recording requires user gesture/permission, stays local, and exposes stop/delete controls.
- Do not store voiceprints or derived biometric profiles.
- Content updates are versioned. Saved seeds retain their content version or are retired safely.
- At least one proficient Japanese editor reviews each lexeme, template, accepted variant, and recording transcript; sensitive pragmatics/register content receives a second review.

## 12. Rendering and accessibility requirements

- Japanese fonts are bundled or use a robust local fallback stack; no required glyph depends on network fonts.
- Ruby/furigana uses semantic `<ruby>` markup where possible and remains readable at zoom.
- Kana size differences and dakuten remain visually clear.
- Vertical writing is not required initially; all core tasks work horizontally.
- Token-order controls are keyboard-operable and announce particles separately.
- Kanji tracing has a non-motor alternative: next-stroke selection/order.
- Audio tasks provide visible playback state, keyboard controls, and volume.
- Listening-only assessment may hide transcript until answer, but deaf/hard-of-hearing learners receive an equivalent non-audio practice path with separate mastery dimensions.

## 13. Generator and implementation requirements

### Semantic-first generation

- Generate meaning/frame first, then choose compatible words and inflect.
- Enforce animacy, countability, transitivity, semantic roles, register, and collocations.
- Use finite-state/table morphology with explicit exceptions.
- Use authored accepted variants; do not ask a language model at runtime whether an answer “sounds natural.”
- Keep discourse context with the question and oracle.
- Reject sentences that are grammatical but bizarre, culturally loaded, unsafe, or pragmatically unsupported.

### Offline constraint

The app remains one standalone HTML/JS/CSS page. Lexicon, grammar tables, fonts/assets, audio, generation, checking, and progress work offline. No translation API, cloud TTS, speech-recognition service, dictionary lookup, or backend is assumed.

## 14. Automated validation

For every instance:

- all lexeme/template references resolve to the pinned data version;
- readings, spellings, furigana, POS, and inflection agree;
- slot selections satisfy semantic/valency/register constraints;
- canonical and accepted variants parse to intended features;
- distractors map to a distinct misconception and are not accidentally accepted;
- audio transcript/semantic frame matches the question;
- response mode requests only what the checker can decide;
- worked explanation regenerates from the same structure;
- structural-history/rejection rules pass.

Property/regression tests:

- all kana, voiced pairs, contracted forms, small `っ`, long-vowel, and mora-count mappings;
- romaji ambiguity (`ん` plus vowel/y, doubled consonants, macrons/expansions);
- particle spelling `は/へ/を`;
- furigana alignment for compounds and irregular whole words;
- every verb class/form, `行く`, `ある`, `する`, `来る`, and `る`-verb exceptions;
- `いい` and `い`-ending `な` adjectives;
- transitive/intransitive pair roles;
- accepted versus context-changing particle variants;
- conditionals and giving/receiving viewpoint;
- token-order alternative acceptance;
- kanji stroke data completeness/order;
- audio-label balance by speaker/duration/loudness;
- recording permission denial/stop/delete lifecycle;
- at least `10,000` deterministic seeds per family/level where generation is combinatorial.

Corpus tests flag:

- repeated awkward noun–verb combinations;
- unintended duplicate meanings among choices;
- unsafe/personal/sensitive scenarios;
- grammatical forms outside the taught level without support;
- one English gloss mapping to several unacknowledged Japanese targets;
- label leakage from audio speaker/file length.

## 15. Coverage requirements

Across a long mixed session:

- numbers/dates/counters/money do not reappear as target skills;
- reading, writing, listening, and guided speaking/self-review all recur;
- recognition does not dominate production;
- kana/kanji/furigana/romaji scaffolds vary by mastery;
- particle roles and verb/adjective classes are balanced;
- plain/polite, positive/negative, nonpast/past forms appear across context;
- audio varies speaker and rate without making one voice a label;
- at least 30% of vocabulary practice uses sentence/discourse context;
- at least 25% of due questions are integrated can-do-style tasks rather than isolated form labels;
- every declared misconception is exercised intentionally.

Cross-family synthesis uses no more than three newly interacting demands. Good synthesis: read a short message with one relative clause and choose a response. Bad synthesis: decode unfamiliar kanji, several new grammar points, and cultural inference simultaneously.

## 16. Topic-level quality checklist

- [ ] Numeric/date/counter/money practice remains in the sister app.
- [ ] The curriculum balances language knowledge with communicative tasks.
- [ ] Generated sentences start from semantic frames and curated lexemes.
- [ ] Japanese variants are accepted explicitly rather than guessed.
- [ ] Ambiguous particle/word-order prompts are rejected or contextualized.
- [ ] Kana size, voicing, gemination, and vowel length remain significant.
- [ ] Kanji readings are word/context based.
- [ ] Conjugation is table-driven with lexical exceptions.
- [ ] Plain/polite and register are not conflated with “correct/incorrect.”
- [ ] Furigana adapts independently of grammar difficulty.
- [ ] Listening uses licensed human audio as the oracle.
- [ ] System TTS is optional and labeled.
- [ ] Speaking recordings remain local and are not auto-scored as pronunciation.
- [ ] Every audio task has an accessibility/practice alternative.
- [ ] Explanations show Japanese chunks and semantic roles.
- [ ] Every distractor represents a plausible learner error.
- [ ] Every family has difficulty progression, three examples, and validation.
- [ ] The standalone app needs no backend or runtime language service.

## 17. Stable identifiers and recommended navigation

Recommended navigation:

1. Kana & Sound
2. Vocabulary & Kanji
3. Particles & Sentences
4. Inflection & Core Grammar
5. Connected Grammar
6. Reading, Listening & Interaction

Stable family identifiers are the backticked identifiers above. Track grammar, orthography, listening, and production separately: understanding a sentence with furigana does not imply kanji production, and recognizing a conjugation does not imply using it in conversation.
