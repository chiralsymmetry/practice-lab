# Japanese Numbers, Dates, Time, and Money — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, content-table, answer-parser, and UI implementers

## 1. Topic overview

### Goal

Develop fast, reliable comprehension and production of Japanese expressions for cardinal numbers, counted objects, telephone numbers, clock times, durations, calendar dates and periods, and yen amounts—especially where Japanese pronunciation changes or groups a quantity differently from English and other thousand-grouping languages.

The app trains controlled, checkable forms. It is not a general Japanese translation exercise.

### Scope

- cardinal numbers from `0` through `99,999,999`;
- Japanese four-digit grouping through `万`, including internal zeroes;
- the general counter `つ` and common counters `人, 個, 本, 枚, 冊, 匹, 台, 杯, 回`;
- choosing a counter for curated, unambiguous objects;
- counter readings and sound changes from 1 through 20;
- synthetic Japanese-style telephone numbers, read digit by digit;
- clock times in 12-hour and 24-hour notation;
- `時, 分, 秒`, `半`, `午前`, and `午後`;
- durations in seconds, minutes, hours, days, weeks, months, and years;
- Gregorian years, calendar months, days of the month, complete dates, and weekdays;
- common relative days, weeks, months, and years;
- yen prices and conversion among `円`, `千円`, and `万円`;
- exact calendar or time arithmetic when it reinforces the language distinction.

Learners are assumed to recognize hiragana and common numeric kanji. Romaji may scaffold early levels, but it must not remain the default production mode.

### Exclusions

- open-ended sentence translation or free conversation;
- pitch-accent grading, speech recognition, and listening audio until separately specified;
- obscure, literary, occupational, regional, or highly object-dependent counters;
- counting age, building floors, ordinal rank, dates in Japanese eras, and traditional month names;
- formal radiotelephony readings such as `ひと` for 1;
- mnemonic number wordplay;
- arithmetic with sales tax, exchange rates, interest, discounts, or budgeting;
- `億`, `兆`, and larger units in the initial implementation;
- decimal currency below one yen, `銭`, and non-yen currencies;
- ambiguous date notation without a declared year-month-day or month-day order;
- timezone, daylight-saving, and locale-dependent week-number rules.

### Normative reading policy

Japanese permits real variation. The app must distinguish:

1. **Canonical production form** — the form displayed in worked solutions and requested when a single model is pedagogically useful.
2. **Accepted common variant** — a correct form accepted without presenting it as an error.
3. **Contextually wrong form** — a reading from another numeric context, such as cardinal `よん` substituted into fixed `四月（しがつ）`.

Core cardinal digits use `いち, に, さん, よん, ご, ろく, なな, はち, きゅう`. Standalone zero is canonical `ゼロ`; `れい` is accepted only in declared contexts. Phone digits use `ゼロ, いち, に, さん, よん, ご, ろく, なな, はち, きゅう`.

The implementation must use reviewed tables for counters, dates, clock units, and duration units. It must not infer all readings by concatenating a cardinal reading with a suffix.

### Number composition model

Within a four-digit group:

- 10 is `じゅう`, not `いちじゅう`;
- 100 is `ひゃく`, not `いちひゃく`;
- 1,000 is `せん`, not `いちせん`;
- 300/600/800 are `さんびゃく/ろっぴゃく/はっぴゃく`;
- 3,000/8,000 are `さんぜん/はっせん`;
- zero-valued positions are omitted.

The next group is `万 = 10,000`, and its coefficient is spoken:

- 10,000 = `いちまん`;
- 18,400 = `いちまんはっせんよんひゃく`;
- 304,080 = `さんじゅうまんよんせんはちじゅう`.

This four-digit split is a learning target, not an implementation detail to hide.

### Global answer conventions

- Apply Unicode NFKC normalization and ignore surrounding whitespace.
- Kana answers accept hiragana and katakana equivalents after script normalization.
- Ignore ordinary spaces between reading components.
- Do not ignore or repair a missing mora, small `っ`, voicing mark, or long vowel.
- Romaji is case-insensitive; macrons and their conventional vowel expansions are equivalent.
- Romaji acceptance is enabled only for families/levels that declare it.
- Numeric answers accept ASCII or full-width digits.
- Numeric grouping commas and ordinary spaces are ignored when unambiguous.
- Telephone answers preserve all digits, including leading zeroes. They may use declared hyphen or space groupings.
- ISO dates use `YYYY-MM-DD`; month/day-only answers use explicit named fields or `M/D`.
- Clock answers use `HH:MM` or `HH:MM:SS`, with exact-width minutes/seconds.
- Money answers accept `¥`, `￥`, or a trailing `円` when the response mode permits units.
- Reading prompts require a phonetic reading; writing only numeric kanji is not an accepted substitute.
- When an answer has several components, use named fields rather than an order-dependent free-text blob where practical.

### Difficulty philosophy

Difficulty should rise through meaningful contrasts:

- cardinal reading versus digit-by-digit reading;
- regular versus irregular counter or calendar pronunciation;
- clock time versus elapsed duration;
- calendar month versus number of months;
- thousands-grouping intuition versus `万` grouping;
- production versus recognition;
- isolated components versus a complete date, time, or price;
- internal zeroes and group boundaries;
- one controlled arithmetic step after the linguistic form is understood.

Difficulty must not rise merely through longer strings, rare vocabulary, arbitrary time pressure, illegible kanji, or requiring the learner to type a full sentence when only a number phrase is being tested.

### Generator data model

Every item stores:

- stable category, subcategory, and family identifiers;
- semantic quantity independent of its display form;
- canonical reading token sequence;
- accepted variant token sequences;
- reading-rule tags such as `rendaku`, `sokuon`, `irregular_day`, `clock_not_duration`, or `man_boundary`;
- response mode and accepted script policy;
- misconception target;
- difficulty dimensions;
- structural signature for repetition control;
- derivation steps suitable for feedback.

Never use a localized display string as the answer oracle.

Every irregular reading and accepted variant in a content table must also carry a provenance note. Prefer contemporary learner references from the Japan Foundation; use a second reputable reference for broader counter tables. If references disagree, preserve one form as canonical, list the other only as an entry-specific accepted variant, and do not generate a question that asks the learner to declare one standard form “wrong.”

## 2. Category: Cardinal numbers and 万

### Category purpose

Train conversion between numerical magnitude and Japanese multiplicative number structure, with special emphasis on the four-digit `万` boundary.

### Learn

Japanese builds numbers with `十`, `百`, and `千`, then starts a new group at `万 = 10,000`. Read each nonzero four-digit group and attach its unit. Do not read internal zeroes.

Examples:

- `6,800` → `ろくせんはっぴゃく`
- `68,000` → `ろくまんはっせん`
- `680,000` → `ろくじゅうはちまん`

Those three values contain similar digits but place the `万` boundary differently.

### Prerequisites

Digits 0–9 in Japanese and ordinary decimal place value.

### Category boundaries

Digit strings such as telephone numbers belong to the telephone category. A price uses the same cardinal engine but belongs to money when `円`, `千円`, or `万円` is part of the task.

### Subcategories

1. Full cardinal reading
2. Four-digit grouping
3. Scaled-unit conversion

### Family `cardinal_to_reading`

**Skill and learner task.** Produce the canonical Japanese reading of an Arabic integer.

**Response mode.** Short text; kana required by default, romaji accepted at Levels 1–2.

**Question template.** `Write {number} in Japanese.`

**Placeholders.** `{number}` is an integer from 0 through 99,999,999, displayed with locale-neutral comma grouping.

**Answer derivation.** Split the value into `high=floor(n/10000)` and `low=n mod 10000`. Read each nonzero group with the reviewed below-10,000 table; append `まん` after `high`. For zero, return standalone `ゼロ`.

**Accepted answers.** Canonical kana; script-normalized equivalent katakana; declared romaji at early levels. Do not accept a digit-by-digit reading.

**Instance constraints and rejection rules.** Balance ordinary and irregular hundreds/thousands. Reject repeated-digit monsters whose difficulty is mostly typing. At upper levels, require at least one internal zero or nontrivial `万` boundary in most items.

**Difficulty.**

- L1: 0–99 with digit/ten reference visible.
- L2: 100–9,999, including sound changes.
- L3: exact multiples of `万`.
- L4: nonzero high and low groups.
- L5: internal zeroes and misleading thousand/`万` alignments.

**Misconceptions and feedback.** Diagnose inserted zero readings, `いちひゃく/いちせん`, missed sound changes, and treating comma groups as Japanese groups. Show the `万 | units` split.

**Examples.**

1. `600` → `ろっぴゃく`. L2; `600` triggers the `ろっぴゃく` sound change.
2. `18,400` → `いちまんはっせんよんひゃく`. L4; split `1 | 8400`.
3. `30,608,020` → `さんぜんろくじゅうまんはっせんにじゅう`. L5; split `3060 | 8020`, omitting zero positions.

**Implementation and validation.** Generate from the numeric value and independently parse the canonical tokens back to the same integer. Exhaustively test 0–99,999 and boundary-focused samples above it.

### Family `reading_to_cardinal`

**Skill and learner task.** Parse a controlled Japanese cardinal reading into an integer.

**Response mode.** Integer input.

**Question template.** `What number is {reading}?`

**Placeholders.** `{reading}` is a valid canonical kana or kanji-and-kana cardinal expression generated from the same number oracle.

**Answer derivation.** Accumulate digit multipliers within `十/百/千`; multiply the completed high group by 10,000 at `万`; add the final group.

**Accepted answers.** Decimal digits with optional grouping commas or spaces.

**Instance constraints and rejection rules.** Do not use alternate readings the parser has not declared. Reject forms whose tokenization is ambiguous under the active display style.

**Difficulty.** Recognition below 100; sound-change recognition; `万` multiples; mixed groups; internal-zero inference.

**Distractors.** For choice variants, use errors that shift the `万` boundary, treat `万` as 1,000, or concatenate coefficient digits.

**Feedback.** Mark group subtotals before combining them.

**Examples.**

1. `さんびゃくろく` → `306`. L2.
2. `にじゅうまんさんぜん` → `203,000`. L4; `20×10,000 + 3,000`.
3. `きゅうせんきゅうひゃくきゅうじゅうきゅうまんきゅうせんきゅうひゃくきゅうじゅうきゅう` → `99,999,999`. L5.

**Implementation and validation.** Use a deterministic token parser, not string replacement. Round-trip all generated readings.

### Family `man_group_partition`

**Skill and learner task.** Decompose an integer into its `万` coefficient and remainder below 10,000, or reconstruct the integer from those fields.

**Response mode.** Two named integer fields or one integer, depending on direction.

**Question templates.**

- `Split {number} into {man_unit} and remaining yen/units.`
- `{man_count}万{remainder} equals what integer?`

**Placeholders.** `{man_count}=floor(number/10000)`; `{remainder}=number mod 10000`, displayed as exactly its numeric value rather than padded digits.

**Answer derivation.** `number = man_count×10,000 + remainder`.

**Accepted answers.** Exact integers. Leading zeroes on the remainder are ignored in named fields but never change place value.

**Instance constraints and rejection rules.** Include remainders below 1,000 to expose misplaced-zero errors. Do not use `億`.

**Difficulty.** Exact multiples; nonzero thousands; small remainder; large coefficient; inverse reconstruction.

**Feedback.** Display a four-place box for the remainder: `{man_count} | {remainder padded to 4 digits}`.

**Examples.**

1. `23,000` → `2万 + 3,000`. L2.
2. `1,205,006` → `120万 + 5,006`. L4; group view `120 | 5006`.
3. `800万4500` → `8,004,500`. L5; group view `800 | 4500`.

**Implementation and validation.** Algebraically reconstruct the source and assert `0≤remainder<10,000`.

### Family `scaled_man_conversion`

**Skill and learner task.** Convert exactly between ordinary integers and decimal quantities expressed in `万`.

**Response mode.** Exact decimal-number or integer input.

**Question templates.**

- `{number} is how many 万?`
- `{man_decimal}万 equals what integer?`

**Placeholders.** Values are selected so the displayed decimal has at most four fractional digits and the corresponding base-unit value is an integer.

**Answer derivation.** Multiply or divide by exactly 10,000 using scaled integers, never binary floating point.

**Accepted answers.** Plain or grouped decimal; unit optional only when the prompt already fixes it.

**Instance constraints and rejection rules.** Include thousand-to-`万` transitions; reject repeating decimals and needless trailing zeroes.

**Difficulty.** Whole `万`; tenths; hundredths; conversions from `千`; inverse mixed set.

**Misconceptions and feedback.** Specifically diagnose multiplying by 1,000, moving three decimal places, or confusing `12.5万` with `12万5百`. Show four-place movement.

**Examples.**

1. `80,000` → `8万`. L1.
2. `3.2万` → `32,000`. L3.
3. `¥125,000` → `12.5万円`. L4.

**Implementation and validation.** Store the coefficient as an integer plus decimal scale; verify exact multiplication by 10,000.

## 3. Category: Counting objects

### Category purpose

Train selection and pronunciation of common Japanese counters rather than treating a bare cardinal number as a complete object count.

### Learn

Japanese normally combines a quantity with a counter chosen by the object’s kind or shape. The counter can change pronunciation:

- one long object: `一本（いっぽん）`
- three long objects: `三本（さんぼん）`
- six long objects: `六本（ろっぽん）`

The app uses a curated object-to-counter map and explicitly teaches accepted variants. It does not pretend every real-world object has only one possible counter in every context.

### Prerequisites

Cardinal numbers through 20.

### Category boundaries

`時, 分, 秒`, calendar units, and money units have dedicated categories. `回` appears here only for frequency, not building floors or ordinals.

### Counter inventory

| Counter | Core use in this app | Key readings |
|---|---|---|
| `つ` | general things, 1–10 | `ひとつ…とお` |
| `人` | people | `ひとり, ふたり, よにん` |
| `個` | small discrete objects | `いっこ, ろっこ, はっこ` |
| `本` | long/cylindrical objects | `いっぽん, さんぼん, ろっぽん, はっぽん` |
| `枚` | flat/thin objects | regular `まい` |
| `冊` | bound books/magazines | `いっさつ, はっさつ` |
| `匹` | small animals | `いっぴき, さんびき, ろっぴき, はっぴき` |
| `台` | machines/vehicles | regular `だい` |
| `杯` | cupfuls/glassfuls | `いっぱい, さんばい, ろっぱい, はっぱい` |
| `回` | occurrences | `いっかい, ろっかい, はっかい` |

All production forms must come from a reviewed 1–20 table. Productive rules may assist generation but may not be the sole oracle.

### Subcategories

1. Counter choice
2. Counter phrase production
3. Counter phrase comprehension
4. Sound-change contrasts

### Family `choose_object_counter`

**Skill and learner task.** Select the intended counter for a curated object.

**Response mode.** Single-choice.

**Question template.** `Which counter should this exercise use for {count} {object}?`

**Placeholders.** `{object}` comes from a localized noun table with one pedagogically intended counter and notes for any real-world alternatives.

**Answer derivation.** Look up the intended semantic class, independent of count.

**Instance constraints and rejection rules.** Use only strongly conventional examples: people→人, paper/tickets/shirts→枚, pens/umbrellas/bottles→本, books→冊, small animals→匹, cars/computers→台. Reject genuinely ambiguous objects.

**Difficulty.** Obvious semantic class; contrast 本 as word “book” versus counter; similar everyday objects; mixed review.

**Distractors.** Use neighboring plausible counter classes, especially `本` versus `冊` and `個` versus shape-specific counters.

**Feedback.** Name the object feature or lexical convention; do not say merely “memorize it.”

**Examples.**

1. `3 people` → `人`. L1.
2. `2 sheets of paper` → `枚`. L2.
3. `4 umbrellas` → `本`. L3.

**Validation.** Every object entry has exactly one intended answer and a human-reviewed ambiguity flag.

### Family `counter_phrase_reading`

**Skill and learner task.** Produce the reading of a number plus a specified counter.

**Response mode.** Short text; kana, with early-level romaji aliases.

**Question template.** `How do you read {written_count} for {object_class}?`

**Placeholders.** `{written_count}` is a numeric or kanji count plus counter; `{object_class}` disambiguates counter meaning.

**Answer derivation.** Retrieve the reviewed table entry for `(counter,count)`.

**Instance constraints and rejection rules.** Counts 1–10 initially and 11–20 later. Balance regular, sokuon, rendaku, and wholly irregular forms.

**Difficulty.** Regular counter; one sound change; irregular 人/つ; compound count carrying final-digit behavior; mixed counters.

**Misconceptions and feedback.** Compare the learner’s form with the naive concatenation when it matches that error.

**Examples.**

1. `一本` → `いっぽん`. L2; not `いちほん`.
2. `三匹` → `さんびき`. L3; the counter voices to `びき`.
3. `十冊` → `じゅっさつ` (accept reviewed `じっさつ` variant if enabled). L4.

**Implementation and validation.** Table lookup is canonical. Validate aliases per individual entry, never by global fuzzy matching.

### Family `counter_phrase_to_quantity`

**Skill and learner task.** Recover the count and counter class from a Japanese counter phrase.

**Response mode.** Two named fields: integer count and single-choice counter/meaning.

**Question template.** `Interpret {counter_phrase}.`

**Answer derivation.** Tokenize against the reviewed counter lexicon, including irregular complete forms.

**Instance constraints and rejection rules.** The active inventory must yield exactly one analysis. If a phonetic form is homophonous across enabled counters, supply an object/context cue.

**Difficulty.** Regular form; sound-changed form; irregular people/general count; number above 10; mixed recognition.

**Feedback.** Decompose into the number contribution and counter.

**Examples.**

1. `ふたり` → `2 people`. L2.
2. `ろっぽん` → `6 long objects`. L3.
3. `はっぱい` → `8 cupfuls`. L4.

**Implementation and validation.** Reverse-index all accepted readings and assert uniqueness under the displayed context.

### Family `counter_sound_change_contrast`

**Skill and learner task.** Choose the correct pronunciation among forms embodying common counter mistakes.

**Response mode.** Single-choice.

**Question template.** `Which is the standard reading of {written_count}?`

**Answer derivation.** Reviewed table lookup.

**Instance constraints and rejection rules.** Every distractor must represent a real error: naive concatenation, wrong voicing series, missing/extra small `っ`, or cardinal reading substituted for an irregular form.

**Difficulty.** One contrast; three-way `ほん/ぼん/ぽん`; cross-counter interference; compound counts.

**Examples.**

1. `六本`: `ろっぽん` / `ろくほん` / `ろくぼん` → `ろっぽん`. L2.
2. `三本`: `さんほん` / `さんぼん` / `さんぽん` → `さんぼん`. L3.
3. `八冊`: `はちさつ` / `はっさつ` / `はちっさつ` → `はっさつ`. L4.

**Feedback and validation.** Name sokuon or voicing in plain language and verify one unique choice after normalization.

## 4. Category: Telephone numbers

### Category purpose

Train rapid parsing and production of digit strings without accidentally applying cardinal place-value rules.

### Learn

Telephone numbers are read one digit at a time. In this app, the canonical digits are:

`0 ゼロ, 1 いち, 2 に, 3 さん, 4 よん, 5 ご, 6 ろく, 7 なな, 8 はち, 9 きゅう`.

A printed hyphen is read as `の` in the canonical exercise form. Real speech may use pauses or variants such as `れい` for zero; declared common zero variants are accepted during comprehension, while production practices one consistent form.

### Prerequisites

Digit readings. Cardinal composition is useful specifically as a contrast.

### Category boundaries

No validation of whether a generated number is assigned or callable. All long numbers are labeled synthetic practice numbers.

### Subcategories

1. Reading digits aloud
2. Parsing spoken digits
3. Preserving groups and leading zeroes

### Family `telephone_digits_to_reading`

**Skill and learner task.** Produce the canonical digit-by-digit reading of a formatted telephone number.

**Response mode.** Short text.

**Question template.** `Read this synthetic telephone number in Japanese: {telephone}.`

**Placeholders.** `{telephone}` is a 3-digit service-style string or a synthetic 2–4–4, 3–4–4, or 4–3–4 grouping.

**Answer derivation.** Map each digit independently and map hyphens to `の`.

**Accepted answers.** Canonical kana; spaces ignored; `の` may be replaced by a clear pause marker only at levels that permit it. Reviewed `れい` substitutions for zero may be accepted but are not canonical production feedback.

**Instance constraints and rejection rules.** Preserve leading zeroes. Avoid publishing a generated long string as a real contact number; label it synthetic. Balance repeated digits and zeroes without making every item a memory-span test.

**Difficulty.** Short groups; one leading zero; repeated digits; multiple zeroes; long mixed groups.

**Feedback.** Align every digit with its token and show group separators.

**Examples.**

1. synthetic number `725` → `ななにご`. L1.
2. `03-4567-8901` → `ゼロさんのよんごろくななのはちきゅうゼロいち`. L3.
3. `090-1234-5678` → `ゼロきゅうゼロのいちにさんよんのごろくななはち`. L4.

**Implementation and validation.** Reparse the token stream to the exact original digit string, including leading zeroes and group lengths.

### Family `telephone_reading_to_digits`

**Skill and learner task.** Transcribe a controlled Japanese telephone reading into grouped digits.

**Response mode.** Telephone-string input.

**Question template.** `Write this synthetic number in digits: {spoken_digits}.`

**Placeholders.** `{spoken_digits}` is a generated sequence with `の` or visible pauses between declared groups.

**Answer derivation.** Map each digit token back to one digit and retain group boundaries.

**Accepted answers.** Exact digits with canonical hyphens; spaces may replace hyphens. An ungrouped string is accepted when all digits are correct unless grouping itself is the tested skill.

**Instance constraints and rejection rules.** At early levels separate tokens visually. At upper levels remove inter-token spaces only after parser ambiguity tests pass.

**Difficulty.** Visible token boundaries; repeated digits; zero variants; compact kana; grouping required.

**Distractors.** Use cardinal interpretation of a group, dropped leading zero, or substituted `4/7/9` readings only when single-choice.

**Examples.**

1. `なな・に・ご` → `725`. L1.
2. `ゼロろくのいちにさんよんのごろくななはち` → `06-1234-5678`. L3.
3. `ゼロきゅうゼロのきゅうゼロゼロいちのゼロななよんに` → `090-9001-0742`. L5.

**Implementation and validation.** Use token-level parsing and exact round-trip tests; never coerce to Number.

### Family `telephone_group_reconstruction`

**Skill and learner task.** Fill a missing telephone group from a mixed reading/digit representation.

**Response mode.** Digit-string input.

**Question template.** `{visible_prefix} - ? - {visible_suffix}` with `{full_reading}` below it. `What digits replace ?`

**Answer derivation.** Align the spoken groups separated by `の` with printed groups.

**Instance constraints and rejection rules.** Exactly one group is missing; group lengths shown; answer includes at least one zero or repeated digit often enough to prevent cardinal guessing.

**Difficulty.** One short group; middle group; zero/repetition; one zero-reading variant.

**Feedback.** Highlight only the matching spoken group, then map its digits.

**Examples.**

1. `090-?-5678`, reading middle group `いちにさんよん` → `1234`. L2.
2. `?-4321`, first group `ゼロさん` → `03`. L3.
3. `0800-?-9012`, middle group `ゼロななご` → `075`. L4.

**Implementation and validation.** Construct backward from a complete number and assert the missing group is unique.

## 5. Category: Clock time and duration

### Category purpose

Train both telling the time and describing elapsed quantities while keeping `時` (clock hour) distinct from `時間` (number of hours).

### Learn

Clock time uses `時`, minutes use `分`, and seconds use `秒`:

- 4:00 → `四時（よじ）`
- 9:06 → `九時六分（くじろっぷん）`
- 4:30 → `四時半（よじはん）`

Elapsed hours use `時間`: four hours is `四時間（よじかん）`, not merely `四時`. Minute readings alternate between `ふん` and `ぷん`; they must come from a reviewed table. `午前` and `午後` appear before the clock time.

### Normative clock tables

- Hours: `0 れいじ`; `1 いちじ`; `2 にじ`; `3 さんじ`; `4 よじ`; `5 ごじ`; `6 ろくじ`; `7 しちじ`; `8 はちじ`; `9 くじ`; then compositional forms preserving the final irregular hour.
- Minutes ending 1/3/4/6/8/10 use the reviewed `ぷん` pattern; 2/5/7/9 use `ふん`.
- `じっぷん` and `じゅっぷん` are accepted where both are standard; the displayed canonical form must be consistent.
- Seconds use `びょう` with the context-appropriate cardinal reading.

### Subcategories

1. Clock reading
2. Unit pronunciation
3. Duration reading
4. Elapsed-time calculation

### Family `clock_time_to_reading`

**Skill and learner task.** Produce a Japanese reading for a displayed clock time.

**Response mode.** Short text.

**Question template.** `How do you say {clock_time} in Japanese?`

**Placeholders.** `{clock_time}` is either 12-hour time with explicit a.m./p.m. or 24-hour time, declared in the prompt.

**Answer derivation.** Read the hour from the clock table; omit zero minutes by default; use `半` for exactly 30 minutes when the prompt requests natural clock style; otherwise append the reviewed minute reading.

**Accepted answers.** Canonical form and declared common alternatives, including full `三十分` when `半` is canonical. Do not accept `時間` for clock time.

**Instance constraints and rejection rules.** Avoid ambiguous bare 12-hour times. Initially exclude 12 a.m./p.m.; introduce midnight/noon only through explicitly taught labels.

**Difficulty.** Exact hour; irregular hour; minute sound change; `半`; 24-hour/午前午後.

**Feedback.** Separate period, hour, and minute tokens.

**Examples.**

1. `4:00` → `よじ`. L1.
2. `9:06` → `くじろっぷん`. L3.
3. `14:38` → `じゅうよじさんじゅうはっぷん`. L4.

**Implementation and validation.** Build from reviewed hour/minute tables and parse back to the same minute of day.

### Family `clock_reading_to_time`

**Skill and learner task.** Convert a Japanese clock expression to digital time.

**Response mode.** Clock input.

**Question template.** `Write {time_reading} as a 24-hour digital time.`

**Answer derivation.** Parse period, clock hour, minute or `半`, and optional seconds; convert explicitly to 0–23 hours.

**Accepted answers.** `HH:MM` or `HH:MM:SS` as requested. A missing leading hour zero is accepted; minute/second fields must be present.

**Instance constraints and rejection rules.** Period and hour combination must be unambiguous. Midnight/noon forms use explicit taught conventions.

**Difficulty.** Hour only; minutes; 午前/午後 conversion; 半; seconds/24-hour expressions.

**Examples.**

1. `しちじはん` with morning context → `07:30`. L2.
2. `ごごくじはん` → `21:30`. L3.
3. `れいじごふんじゅうにびょう` → `00:05:12`. L5.

**Implementation and validation.** Parse semantic fields and independently format the resulting seconds from midnight.

### Family `time_unit_pronunciation`

**Skill and learner task.** Produce or recognize the correct reading of a minute or second quantity.

**Response mode.** Short text or single-choice.

**Question template.** `How do you read {quantity}{unit}?`

**Answer derivation.** Reviewed minute table or compositional second table.

**Instance constraints and rejection rules.** Ensure choices differ on the actual unit rule, not merely spelling. Cover minute endings across multiple tens.

**Difficulty.** 1–10 minutes; larger minute endings; seconds contrast; mixed unit identification.

**Distractors.** Wrong `ふん/ぷん`, missing small `っ`, cardinal-plus-suffix concatenation, or applying minute changes to seconds.

**Examples.**

1. `4分` → `よんぷん`. L2.
2. `18分` → `じゅうはっぷん`. L3.
3. `47秒` → `よんじゅうななびょう`. L3.

**Feedback and validation.** Show the final-digit rule and table entry; verify every choice is unique.

### Family `duration_to_reading`

**Skill and learner task.** Express an elapsed duration in Japanese.

**Response mode.** Short text.

**Question template.** `Express this duration in Japanese: {duration}.`

**Placeholders.** `{duration}` consists of one or two adjacent units among hours, minutes, and seconds.

**Answer derivation.** Use `時間` for elapsed hours, the reviewed `分` reading for minutes, and `秒` for seconds. Use `時間半` only for an exact additional 30 minutes when natural style is requested.

**Accepted answers.** Canonical compact form and a declared fully expanded equivalent. Do not accept bare `時` for hours elapsed.

**Instance constraints and rejection rules.** At least one nonzero component. Normalize 60 seconds/minutes unless the prompt explicitly practices raw unit quantities.

**Difficulty.** One regular unit; irregular unit; hours versus clock contrast; two units; half-hour equivalence.

**Examples.**

1. `4 hours` → `よじかん`. L2.
2. `6 minutes` → `ろっぷん`. L2.
3. `1 hour 30 minutes` → `いちじかんはん` (also accept `いちじかんさんじゅっぷん`). L4.

**Implementation and validation.** Store duration as integer seconds and verify all accepted forms map to the same quantity.

### Family `duration_reading_to_quantity`

**Skill and learner task.** Parse a Japanese duration into named numeric units or a requested total unit.

**Response mode.** Multiple named integer fields or integer total.

**Question template.** `How long is {duration_reading}? Answer in {target_unit}.`

**Answer derivation.** Parse duration units, distinguish `時間` from clock `時`, convert with exact factors 3600 and 60.

**Instance constraints and rejection rules.** Results must be integral in the requested unit. No calendar months in this family.

**Difficulty.** Direct unit; composite; half-hour; total minutes/seconds; contrast with a clock expression.

**Feedback.** Show parsed components before conversion.

**Examples.**

1. `にじかん` → `2 hours`. L1.
2. `いちじかんじゅうごふん` → `75 minutes`. L3.
3. `さんじかんはん` → `210 minutes`. L4.

**Implementation and validation.** Compare exact total seconds.

### Family `clock_plus_duration`

**Skill and learner task.** Compute an ending clock time from a Japanese clock expression and duration.

**Response mode.** Clock input.

**Question template.** `{start_time} から {duration} 後は何時ですか。Answer digitally.`

**Answer derivation.** Parse both expressions; add exact seconds; reduce modulo 24 hours; record whether the date changes.

**Instance constraints and rejection rules.** One arithmetic step. If crossing midnight, state that the answer is on the next day. Exclude month/date arithmetic here.

**Difficulty.** Whole hour; minute carry; mixed duration; midnight crossing; seconds.

**Feedback.** Show digital start plus duration, then the resulting Japanese reading.

**Examples.**

1. `九時 + 二時間` → `11:00`. L2.
2. `九時四十五分 + 一時間半` → `11:15`. L4.
3. `二十三時五十分 + 二十五分` → `00:15 next day`. L5.

**Implementation and validation.** Integer-second arithmetic only; independently format and parse the answer reading.

## 6. Category: Dates and calendar periods

### Category purpose

Train Japanese calendar readings and the important distinction between a named calendar unit and a quantity of elapsed units.

### Learn

Japanese dates proceed from larger to smaller units: `年 → 月 → 日 → 曜日`. Calendar months use `がつ`, while durations in months use `かげつ`.

- April: `四月（しがつ）`
- four months: `四か月（よんかげつ）`
- April 4: `四月四日（しがつよっか）`

Days of the month have many fixed readings, especially 1–10, 14, 20, and 24. These must be learned as complete forms.

### Calendar conventions

- Use the proleptic Gregorian calendar from 1900 through 2099.
- Validate actual month lengths and leap years.
- Numeric dates in prompts always declare their order.
- ISO weekday numbering is Monday `1` through Sunday `7`.
- Canonical Japanese date order is year-month-day.

### Subcategories

1. Months and days
2. Complete dates and weekdays
3. Duration periods
4. Relative calendar expressions
5. Controlled date arithmetic

### Family `calendar_month_reading`

**Skill and learner task.** Convert between a calendar month number/name and its Japanese `月` reading.

**Response mode.** Short text or integer input, depending on direction.

**Question templates.**

- `How do you read month {month} in Japanese?`
- `Which month is {month_reading}?`

**Answer derivation.** Reviewed month table; specifically `4 しがつ`, `7 しちがつ`, and `9 くがつ`.

**Instance constraints and rejection rules.** Calendar months only; never accept `かげつ` duration forms.

**Difficulty.** Regular months; irregular 4/7/9; mixed direction.

**Distractors.** `よんがつ`, `なながつ`, `きゅうがつ`, and corresponding duration forms.

**Examples.**

1. `2月` → `にがつ`. L1.
2. `4月` → `しがつ`. L2.
3. `くがつ` → month `9`. L3.

**Feedback and validation.** Contrast the fixed calendar reading with the ordinary cardinal where relevant; table round-trip all 12.

### Family `day_of_month_reading`

**Skill and learner task.** Produce or recognize the Japanese reading of a day of the month.

**Response mode.** Short text or integer.

**Question template.** `How do you read the {day} day of a month?`

**Answer derivation.** Reviewed complete table for 1–31.

**Instance constraints and rejection rules.** The prompt explicitly says day of month. Do not infer readings by cardinal concatenation.

**Difficulty.** Regular `にち`; 1–10; 14/24; 20; mixed recognition.

**Distractors.** Cardinal+`にち`, a neighboring irregular day, or the one-day duration `いちにち` for the first.

**Examples.**

1. `2日` → `ふつか`. L2.
2. `14日` → `じゅうよっか`. L3.
3. `20日` → `はつか`. L4.

**Feedback and validation.** State that the form is a lexical calendar reading and exhaustively test 1–31.

### Family `full_date_to_reading`

**Skill and learner task.** Produce the Japanese reading of a valid Gregorian date.

**Response mode.** Short text.

**Question template.** `Read this date in Japanese (year-month-day): {date}.`

**Placeholders.** `{date}` is a valid date from 1900-01-01 through 2099-12-31.

**Answer derivation.** Read year as cardinal+`ねん`, then reviewed month and day forms.

**Accepted answers.** Canonical continuous kana; spaces between components ignored. Kanji-only restatement is not a reading answer.

**Instance constraints and rejection rules.** Balance irregular months/days and ordinary dates. Reject invalid dates before rendering.

**Difficulty.** Month/day only; year plus regular date; irregular month/day; internal-zero year positions; leap date.

**Feedback.** Segment year, month, and day.

**Examples.**

1. `2026-05-12` → `にせんにじゅうろくねんごがつじゅうににち`. L2.
2. `1998-09-20` → `せんきゅうひゃくきゅうじゅうはちねんくがつはつか`. L4.
3. `2024-02-29` → `にせんにじゅうよねんにがつにじゅうくにち`. L5.

**Implementation and validation.** Use a real Gregorian validity function and round-trip the semantic components.

### Family `japanese_date_to_numeric`

**Skill and learner task.** Parse a Japanese date reading into an ISO date.

**Response mode.** Date input.

**Question template.** `Write {date_reading} as YYYY-MM-DD.`

**Answer derivation.** Tokenize year through `ねん`, month through `がつ`, and day from the fixed day table; validate the combination.

**Instance constraints and rejection rules.** Use only complete dates in this family. Do not silently repair impossible dates.

**Difficulty.** Segmented kanji/kana; compact kana; irregular day; irregular month and day; leap-date recognition.

**Feedback.** Display each parsed component and date-validity check.

**Examples.**

1. `にせんにじゅうろくねんしがつみっか` → `2026-04-03`. L3.
2. `せんきゅうひゃくきゅうじゅうねんしちがつじゅうよっか` → `1990-07-14`. L4.
3. `にせんねんにがつにじゅうくにち` → `2000-02-29`. L5.

**Implementation and validation.** Parser output must successfully construct the same Gregorian date used by the generator.

### Family `weekday_bidirectional`

**Skill and learner task.** Convert between weekday number/name and Japanese weekday.

**Response mode.** Short text or integer 1–7.

**Question template.** `Give the Japanese weekday for {weekday}.` / `Which weekday is {weekday_reading}?`

**Answer derivation.** Fixed table `月, 火, 水, 木, 金, 土, 日 + ようび`.

**Instance constraints and rejection rules.** Localized source-language weekday names are display only. Numeric answers use declared Monday=1.

**Difficulty.** Production with kanji cue; kana production; reverse recognition; date-to-weekday combination at upper level.

**Examples.**

1. `Tuesday` → `火曜日（かようび）`. L1.
2. `もくようび` → Thursday / `4`. L2.
3. weekday of `2024-02-29` → `木曜日（もくようび）`. L5.

**Implementation and validation.** Fixed-table round-trip; date variant independently verifies Gregorian weekday.

### Family `calendar_period_duration`

**Skill and learner task.** Express or parse a duration in days, weeks, months, or years.

**Response mode.** Short text or named integer/unit fields.

**Question template.** `Express {quantity} {period_unit} in Japanese.` / `Interpret {period_reading}.`

**Answer derivation.**

- days use a reviewed duration-day table, with one day `いちにち`;
- weeks use `週間（しゅうかん）` and reviewed sound changes;
- months use `か月（かげつ）` and reviewed sound changes;
- years use `年間（ねんかん）` when duration must be explicit.

**Instance constraints and rejection rules.** Prompt must say duration, not calendar label. Do not mix `四月（April）` with `四か月（four months）`.

**Difficulty.** Direct unit; irregular day; week sound change; month sound change; calendar-versus-duration contrast.

**Accepted variants.** Declare orthographic variants `か月/カ月/ヶ月/箇月` for recognition; production feedback uses `か月`. Reading aliases are entry-specific.

**Examples.**

1. `1 day` → `いちにち`, contrasting day-of-month `ついたち`. L2.
2. `1 week` → `いっしゅうかん`. L3.
3. `6 months` → `ろっかげつ`. L4.

**Implementation and validation.** Reviewed tables through 24 for days and 20 for weeks/months; productive larger forms require table-backed suffix behavior.

### Family `relative_calendar_expression`

**Skill and learner task.** Convert between a controlled relative period meaning and its Japanese expression.

**Response mode.** Short text or single-choice.

**Question template.** `How do you say {relative_meaning} in Japanese?`

**Answer derivation.** Fixed lexicon, including:

- `おととい, きのう, きょう, あした, あさって`;
- `せんしゅう, こんしゅう, らいしゅう`;
- `せんげつ, こんげつ, らいげつ, さらいげつ`;
- `きょねん, ことし, らいねん`.

**Instance constraints and rejection rules.** Meanings are supplied without sentence particles. Exclude context-dependent alternatives unless explicitly accepted.

**Difficulty.** Relative days; week/month/year sets; reverse recognition; near-neighbor contrast.

**Distractors.** Other members of the same temporal set, not unrelated vocabulary.

**Examples.**

1. `tomorrow` → `あした`. L1.
2. `last month` → `せんげつ`. L2.
3. `the month after next` → `さらいげつ`. L3.

**Feedback and validation.** Show the ordered local sequence around the target; fixed lexicon uniqueness.

### Family `date_shift`

**Skill and learner task.** Apply a day/week offset to a parsed Japanese date.

**Response mode.** ISO date input.

**Question template.** `{date_reading} の {offset_expression} は何月何日ですか。Answer YYYY-MM-DD.`

**Answer derivation.** Parse the source date, convert the controlled offset to an integer number of days, and apply Gregorian date arithmetic.

**Instance constraints and rejection rules.** Offsets are days or weeks only. Month/year shifts are excluded because end-of-month policies vary. Include leap and month boundaries intentionally.

**Difficulty.** Same month; month crossing; year crossing; leap day; Japanese offset parsing.

**Feedback.** Show source ISO date, signed day offset, and result, then its Japanese date reading.

**Examples.**

1. `2026年5月10日のあした` → `2026-05-11`. L2.
2. `2026年3月2日の一週間前` → `2026-02-23`. L4.
3. `2024年2月28日の二日後` → `2024-03-01`. L5.

**Implementation and validation.** Use calendar-day arithmetic, not milliseconds divided by 86,400,000 in a local timezone.

## 7. Category: Money and 万円

### Category purpose

Train recognition and production of yen amounts while making conversion between thousands and `万` automatic.

### Learn

Attach `円（えん）` to an ordinary Japanese number:

- `¥800` → `はっぴゃくえん`
- `¥8,000` → `はっせんえん`
- `¥80,000` → `はちまんえん`

Price labels and conversation also use `万円` and sometimes `千円`. Since `万` is 10,000, `3.5万円` is `¥35,000`, not `¥3,500`.

### Prerequisites

Cardinal reading and `万` grouping.

### Category boundaries

This category teaches amount language and exact scale conversion. Broader personal finance belongs to Everyday Economics.

### Subcategories

1. Price reading
2. Price comprehension
3. `円/千円/万円` decomposition and conversion
4. Small purchase totals

### Family `yen_amount_to_reading`

**Skill and learner task.** Produce the Japanese reading of an integer yen amount.

**Response mode.** Short text.

**Question template.** `Read this price in Japanese: {yen_amount}.`

**Placeholders.** `{yen_amount}` is an integer from ¥1 through ¥99,999,999.

**Answer derivation.** Use the cardinal engine, then append `えん`.

**Instance constraints and rejection rules.** Balance hundreds/thousands sound changes, exact `万`, mixed high/low groups, and internal zeroes. Avoid long values when no new structure is present.

**Difficulty.** Below ¥1,000; thousands; exact 万; mixed 万 and 千; large internal-zero price.

**Feedback.** Show the `万 | lower four digits` split before the reading.

**Examples.**

1. `¥680` → `ろっぴゃくはちじゅうえん`. L2.
2. `¥12,500` → `いちまんにせんごひゃくえん`. L3.
3. `¥3,040,800` → `さんびゃくよんまんはっぴゃくえん`. L5.

**Implementation and validation.** Cardinal round-trip, followed by explicit currency-unit validation.

### Family `yen_reading_to_amount`

**Skill and learner task.** Parse a Japanese yen expression into an integer amount.

**Response mode.** Integer money input.

**Question template.** `How much is {yen_reading}?`

**Answer derivation.** Remove the terminal currency unit only after validating it, then parse the cardinal or scaled-unit structure.

**Accepted answers.** Integer digits with optional grouping and currency marker.

**Instance constraints and rejection rules.** Include `万円` expressions only when the coefficient grammar is declared. Reject nonintegral yen results.

**Difficulty.** Ordinary price; `万` price; mixed `万/千`; compact decimal `万円`; large internal zero.

**Distractors.** Three-place rather than four-place shift, loss of a zero, or reading the lower group as part of the coefficient.

**Examples.**

1. `はっせんえん` → `¥8,000`. L2.
2. `じゅうにまんごせんえん` → `¥125,000`. L3.
3. `さんびゃくよんまんはっぴゃくえん` → `¥3,040,800`. L5.

**Implementation and validation.** Exact integer parse and reading round-trip.

### Family `yen_man_decomposition`

**Skill and learner task.** Convert an integer yen amount to a mixed `万...円` expression or reconstruct it.

**Response mode.** Two named fields (`万円`, remaining `円`) or integer money input.

**Question templates.**

- `Express {yen_amount} as whole 万円 plus remaining 円.`
- `{man_count}万円 + {remainder_yen}円 equals how many yen?`

**Answer derivation.** `man_count=floor(yen/10000)` and `remainder_yen=yen mod 10000`.

**Instance constraints and rejection rules.** Include small remainders and exact multiples. The remainder is always below ¥10,000.

**Difficulty.** Exact 万; thousand remainder; remainder below ¥1,000; large coefficient; inverse.

**Feedback.** Show `yen = man_count×10,000 + remainder`.

**Examples.**

1. `¥40,000` → `4万円 + ¥0`. L1.
2. `¥78,000` → `7万円 + ¥8,000`. L2.
3. `¥1,205,000` → `120万円 + ¥5,000`. L4.

**Implementation and validation.** Quotient/remainder invariant.

### Family `money_scaled_unit_conversion`

**Skill and learner task.** Convert exactly among yen, `千円`, and `万円`.

**Response mode.** Exact decimal-number or integer money input.

**Question template.** `Convert {source_amount} to {target_unit}.`

**Answer derivation.** Apply exact scale factors: `千円=1,000円`; `万円=10,000円`.

**Accepted answers.** Decimal coefficient with no unnecessary precision, or integer yen. Unit must match the requested target.

**Instance constraints and rejection rules.** Use coefficients yielding integral yen. Balance whole and decimal `万円` values. Reject floating artifacts and ambiguous comma-decimal locale notation.

**Difficulty.** Whole unit; one decimal place; `千円↔万円`; two decimals; mixed direction.

**Misconceptions and feedback.** Show both scale factors and decimal movement. Identify answers produced by treating `万` as a thousand.

**Examples.**

1. `6.8万円` → `¥68,000`. L2.
2. `¥125,000` → `12.5万円`. L3.
3. `350千円` → `35万円`. L4.

**Implementation and validation.** Decimal strings parse to integer coefficient/scale pairs; prohibit host floating-point equality.

### Family `simple_purchase_total`

**Skill and learner task.** Compute a small total or change amount while parsing Japanese quantity and price expressions.

**Response mode.** Integer money input.

**Question templates.**

- `{unit_price}の商品を{count_phrase}買います。合計はいくらですか。`
- `{price}に{payment}を出します。おつりはいくらですか。`

**Answer derivation.** Parse the count/amount, then perform one integer multiplication or subtraction.

**Instance constraints and rejection rules.** No tax or discounts. Results nonnegative and under ¥1,000,000. The linguistic parsing, not long arithmetic, remains central.

**Difficulty.** Direct total; sound-changed count; crossing ¥10,000; change; mixed `万円` input.

**Feedback.** Show parsed numeric operands, arithmetic, `万` grouping, and Japanese result reading.

**Examples.**

1. `320円の商品を三個` → `¥960`. L2.
2. `1本280円を六本` → `¥1,680`. L3.
3. `一万二千五百円の商品に二万円を出す` → `¥7,500` change. L4.

**Implementation and validation.** Integer arithmetic; ensure counter phrase parses uniquely and total/change reading round-trips.

## 8. Cross-family progression

Recommended introduction order:

1. digits and cardinals below 100;
2. irregular hundreds/thousands;
3. `万` partition and cardinal conversion;
4. one counter at a time, then counter contrasts;
5. telephone numbers as an explicit contrast with cardinal reading;
6. isolated hour/minute readings, then complete clock times;
7. durations contrasted with clock time;
8. months and days separately, then full dates;
9. weeks/months as durations contrasted with calendar labels;
10. yen readings, then `千円/万円` conversion;
11. one-step time, date, and purchase calculations.

Interleave forward and inverse forms only after the learner can perform the direct form with cues. Keep telephone/cardinal contrasts and clock/duration contrasts in the same review sessions because discrimination is part of the skill. Do not introduce full-date production before irregular days have had isolated practice.

## 9. Adaptive practice guidance

Track mastery by family and by rule tag, not only by category. At minimum track:

- number magnitude and `万` group shape;
- hundred/thousand sound-change type;
- counter and count ending;
- naive-concatenation versus sound-change error;
- digit-string versus cardinal context;
- phone digit identity and leading-zero retention;
- clock hour irregularity;
- minute `ふん/ぷん` pattern;
- clock versus duration unit;
- calendar month irregularity;
- day-of-month entry;
- calendar versus duration month;
- yen scale and conversion direction;
- script/representation and response direction.

Failure routing:

| Observed error | Next diagnostic or practice |
|---|---|
| reads `18,000` as a thousand-group equivalent | `1万8000` partition pair |
| shifts `万` by three places | paired `8千/8万` and exact scale conversion |
| says `いちひゃく` or `いちせん` | below-10,000 composition contrast |
| misses `ろっぴゃく/はっせん` | isolated sound-change family |
| uses a bare number for an object | counter-choice item before pronunciation |
| produces `いちほん` | exact counter contrast around 1/3/6/8 |
| reads a phone group as a cardinal | same digits shown as cardinal and telephone |
| drops a phone leading zero | short leading-zero transcription |
| writes `よんじ` or `きゅうじ` | irregular hour table contrast |
| confuses `ふん/ぷん` | matched final-digit minute set |
| uses `時` for elapsed hours | clock-versus-duration minimal pair |
| says `よんがつ/なながつ/きゅうがつ` | 4/7/9 month triad |
| calls the first day `いちにち` | `ついたち` versus one-day `いちにち` |
| confuses April with four months | `しがつ` versus `よんかげつ` |
| interprets `12.5万円` as `¥12,500` | four-place scale visualization |

Slow but correct kana production should retain the semantic difficulty while temporarily restoring component spacing. Errors involving a complete date or price should route to the smallest component that distinguishes the misconception.

Recommended adaptive mix: 40% weakest rule tags, 25% spaced mastery, 20% explicit contrasts, 10% inverse forms, and 5% combined stretch items.

## 10. Feedback and answer-parser requirements

Feedback should expose structure, not merely display the answer:

- align digits and spoken tokens for telephone numbers;
- show number groups as `万 | lower four digits`;
- identify the exact counter table row and sound change;
- segment `午前/午後 | 時 | 分 | 秒`;
- label clock time and duration explicitly;
- segment `年 | 月 | 日 | 曜日`;
- show unit scale before money conversion.

The parser must:

- normalize Unicode safely without erasing meaningful small kana or voicing;
- convert katakana/hiragana only for comparison, preserving original text for feedback;
- tokenize from reviewed lexicons;
- support entry-specific aliases rather than broad edit distance;
- preserve leading zeroes in identifiers;
- distinguish `し/よん`, `しち/なな`, and `く/きゅう` by context;
- reject a correct numeric magnitude expressed in the wrong requested mode;
- never use fuzzy matching that could accept a wrong counter sound change.

When an unlisted but potentially valid Japanese variant is entered, feedback should say that the app expected a controlled form rather than declaring the learner’s Japanese categorically impossible. Such responses should be logged for table review.

## 11. Automated validation

- Exhaustively test cardinal generation and parse round-trip from 0 through at least 999,999; boundary/property-test the full range.
- Verify every generated reading token has an approved source-table entry or cardinal composition rule.
- Exhaustively test each counter/count table entry and reverse-index uniqueness.
- Ensure every counter-choice object has one intended answer in its declared context.
- Round-trip at least 10,000 synthetic telephone seeds without numeric coercion.
- Test leading zeroes, repeated digits, all digit aliases, and every supported group shape.
- Exhaustively test all hour/minute/second table entries used by the generator.
- Verify clock and duration parsers reject each other’s incompatible units.
- Test time arithmetic across hour and midnight boundaries.
- Exhaustively test month 1–12 and day 1–31 readings.
- Generate every valid date from 1900 through 2099 and verify parse round-trip and weekday.
- Explicitly test invalid dates and leap-year boundaries.
- Exhaustively test reviewed day/week/month/year duration tables.
- Property-test all relative day/week date shifts.
- Test yen cardinal round-trip and quotient/remainder invariants.
- Test `円/千円/万円` conversions with scaled integers, never binary floating point.
- Ensure each single-choice item has exactly one normalized correct choice.
- Ensure all placeholders resolve and every response conforms to its declared mode.
- Test at least 10,000 seeds per family/level for duplicate structure, accidental ambiguity, and answer alias collisions.

## 12. Coverage requirements

- No one counter supplies more than 20% of counter practice after introduction.
- At least half of mature counter sessions include a sound-changing entry.
- Regular forms still recur so the learner does not infer that every counter changes.
- Every telephone digit and every supported grouping appears regularly.
- Leading zeroes and repeated phone digits appear deliberately but do not dominate.
- Hours 4, 7, and 9 and all minute pronunciation classes recur.
- Clock and duration questions remain balanced enough to preserve the distinction.
- All 12 months and all 31 day readings receive direct practice.
- Irregular calendar days appear more often during acquisition, then taper toward real frequency.
- Calendar months and month durations appear in explicit contrast sets.
- `万` boundary shapes include exact multiples, thousand remainders, sub-thousand remainders, and internal zeroes.
- Money practice balances `円→万円` and `万円→円`.
- Combined questions never introduce two unmastered irregularities at once.
- Recent structural signatures suppress immediate repeats with only changed surface numbers.

## 13. Topic-level quality checklist

- [ ] Every Japanese production answer has a canonical reviewed reading.
- [ ] Legitimate common variants are entry-specific and tested.
- [ ] Cardinal, digit-string, counter, clock, duration, calendar, and money contexts remain distinct.
- [ ] `万` is consistently 10,000 and visualized as a four-digit group.
- [ ] One is omitted before `十/百/千` but retained before `万`.
- [ ] Counter choice uses curated unambiguous objects.
- [ ] Counter pronunciation is table-backed.
- [ ] Telephone digits preserve leading zeroes and are never parsed as an integer.
- [ ] Clock `時` and elapsed `時間` are contrasted repeatedly.
- [ ] Minute readings use reviewed `ふん/ぷん` forms.
- [ ] Month 4/7/9 and irregular days are explicitly covered.
- [ ] Calendar months and durations in months cannot be confused by the prompt.
- [ ] Generated dates are valid Gregorian dates.
- [ ] Yen conversion uses exact scaled arithmetic.
- [ ] Difficulty increases through linguistic structure, not typing length.
- [ ] Every family has meaningful rejection rules, diagnostic feedback, examples, and automated validation.
- [ ] No question requires open-ended translation to receive credit.

## 14. Stable navigation

Recommended learner-facing categories:

- Numbers & 万
- Counting Objects
- Telephone Numbers
- Clock & Duration
- Dates & Calendar
- Money

Stable family identifiers are the backticked identifiers above. Existing progress for Number Reading, Number Value, Dates, Calendar Words, and Counters may be migrated into the closest new family only when direction, unit context, and difficulty metadata are known; otherwise retain it as legacy category mastery rather than inventing granular history.
