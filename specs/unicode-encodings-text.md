# Unicode, Encodings, and Text — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, versioned Unicode-data engine, byte/text codec oracle, segmentation renderer, answer-checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Unicode, Encodings, and Text

### Topic goal

Develop precise practical reasoning about how text is represented, transformed, counted, compared, displayed, and corrupted. The learner should become able to:

- distinguish bytes, code units, code points, Unicode scalar values, grapheme clusters, and glyphs;
- predict lengths under a declared unit rather than asking vaguely for “characters”;
- encode and decode bounded values in UTF-8, UTF-16, and UTF-32;
- recognize malformed UTF sequences, endianness errors, byte-order marks, and truncation boundaries;
- reason about ASCII and selected legacy single-byte encodings without assuming bytes identify an encoding;
- trace transcoding and diagnose common mojibake/lossy-replacement paths;
- distinguish canonical from compatibility equivalence;
- compute and recognize NFC, NFD, NFKC, and NFKD on a curated but substantial data set;
- count and segment combining sequences, emoji ZWJ sequences, modifiers, and regional-indicator flags;
- distinguish binary, code-point, normalized, case-folded, and locale-sensitive comparison;
- predict common JavaScript string/encoding API behavior under an explicit model;
- choose safe units and boundaries for indexing, truncation, storage, validation, and display;
- recognize confusable and invisible text risks without pretending rendering alone establishes identity.

The app trains a layered model of text. It must avoid using the unqualified word “character” when a specific unit is meant.

### Position within Practice Lab

- **Programmer Low-Level Numeracy** owns general binary/hex and memory-width skills; this app applies them to text encodings.
- **Practical Cryptography** owns byte-oriented cryptographic transformations; this app owns conversion between text and bytes.
- **Japanese, Chinese, and Korean Language** own language learning and orthographic use; this app owns representation mechanics shared across scripts.
- **Admin Practice** owns shell locale/command behavior; this app supplies the text/encoding model those tools may consume.
- **C++ Mental Execution** owns language-specific expressions; this app includes only a bounded JavaScript/browser string model because Practice Lab itself runs there.

### Audience and prerequisites

The learner should know:

- bytes and hexadecimal notation;
- powers of two through 16 bits;
- arrays/sequences and zero-based indices;
- that text is stored/transmitted as data.

No prior linguistics, typography, Unicode, or programming-language knowledge is required. UTF arithmetic families provide bit-field scaffolds.

### Pinned standard and data versions

The initial model ID is `unicode-17.0-text-v1`:

- Unicode Standard 17.0.0;
- Unicode Character Database 17.0.0;
- normalization per Unicode 17.0.0 and UAX #15 revision 57;
- default extended grapheme and word boundaries per the Unicode 17.0.0 version of UAX #29;
- security-property/confusable fixtures derived from a pinned Unicode 17.0.0-compatible UTS #39 data snapshot where explicitly used;
- ECMAScript string/API subset identified separately as `ecmascript-text-v1`.

Every generated instance stores its model/data version. A future Unicode release creates a new model version; it does not silently alter saved questions.

### Scope

The initial topic includes:

- Unicode codespace, code points, scalar values, assigned/unassigned status, surrogate code points, private-use characters, and noncharacters;
- standard `U+XXXX` notation, hexadecimal code units/bytes, and sequence display;
- code point, code unit, byte, and extended-grapheme-cluster counting;
- UTF-8 structure, encoding/decoding, length, validation, shortest form, boundary values, and safe byte boundaries;
- UTF-16 BMP units, surrogate pairs, validation, byte order, BOM, and JavaScript code-unit implications;
- UTF-32 scalar encoding, byte order, and storage comparison;
- ASCII, ISO-8859-1, Windows-1252, representability, transcoding, and selected mojibake paths;
- strict versus declared replacement decoding, with replacement policy always explicit;
- canonical decomposition/composition, combining classes/order, NFC/NFD/NFKC/NFKD, Hangul algorithmic examples, and normalization stability;
- default extended grapheme clusters, combining marks, variation selectors, emoji modifiers, ZWJ sequences, and regional-indicator pairing;
- default word-boundary examples only where the pinned UAX #29 oracle provides an exact result;
- default case conversion/folding, selected locale-sensitive casing, code-point ordering, and normalized/case-folded search;
- JavaScript `.length`, iteration, indexing/slicing, escapes, `TextEncoder`, and strict/declared `TextDecoder` behavior;
- safe byte/code-point/grapheme truncation and index conversion;
- invisible controls, bidi-control recognition, confusable warnings, protocol/storage encoding contracts, and layered debugging.

### Exclusions

Do not include in the initial app:

- teaching all assigned characters, names, blocks, scripts, properties, or emoji sequences by memorization;
- font design, shaping-engine internals, OpenType tables, kerning, ligatures as glyph behavior, or rasterization;
- claims that one code point always maps to one glyph or one grapheme always matches a user’s linguistic intuition;
- locale-independent “alphabetical order,” unrestricted collation, or hand-built locale sorting rules;
- complete line breaking, hyphenation, bidirectional reordering, script shaping, or cursor behavior for every platform;
- regex-engine-specific Unicode features unless a future family pins one engine/version;
- filesystem normalization behavior, database collation defaults, terminal locale behavior, IDNA/domain processing, email internationalization, or protocol-specific canonicalization unless fully modeled later;
- arbitrary charset detection presented as certain;
- recovery of bytes already replaced with `U+FFFD` or `?` when information has been lost;
- stripping diacritics, compatibility normalization, or case folding presented as universally safe for identity/security;
- unrestricted confusable/spoof detection or claims that visual similarity proves malicious intent;
- language-specific transliteration, pronunciation, or orthographic correction;
- accepting isolated surrogate code points as Unicode scalar values or well-formed UTF-8;
- runtime dependence on network Unicode data, system fonts, browser segmentation version, or OS locale.

### Core terminology and identity model

- **Byte:** 8 bits, displayed as two hexadecimal digits.
- **Code unit:** one storage unit of an encoding: 8 bits for UTF-8, 16 bits for UTF-16, 32 bits for UTF-32.
- **Code point:** an integer in `U+0000..U+10FFFF`.
- **Surrogate code point:** `U+D800..U+DFFF`; reserved for UTF-16 pairing and not a Unicode scalar value.
- **Unicode scalar value:** any code point except surrogate code points.
- **Encoded character:** a code point assigned an abstract character in the pinned Unicode version.
- **Combining character:** a character intended to combine with preceding context; combining behavior does not imply a particular glyph.
- **Extended grapheme cluster (EGC):** a default text-segmentation unit under pinned UAX #29; often, but not always, a user-perceived character.
- **Glyph:** a rendered shape selected by a font/shaping system, not a Unicode identity unit.
- **String:** an ordered sequence whose unit must be stated. In the abstract Unicode model it is a scalar-value sequence; in JavaScript it is a sequence of UTF-16 code units that may be ill-formed.

“Assigned,” “valid scalar,” “recommended for interchange,” “renderable,” and “printable” are distinct predicates:

- `U+D800` is a code point but not a scalar;
- `U+E000` is a private-use scalar whose meaning is application-defined;
- `U+FDD0` and `U+10FFFF` are noncharacter scalar values, not unassigned code points;
- an unassigned non-surrogate code point remains a scalar value;
- scalar validity does not guarantee a font glyph.

### Notation conventions

- Code points render `U+` plus 4–6 uppercase hex digits: `U+0061`, `U+20AC`, `U+1F600`.
- Byte sequences render uppercase two-digit bytes: `E2 82 AC`.
- UTF-16 code units render four digits: `D83D DE00`.
- UTF-32 code units render eight digits when width is tested: `0001F600`.
- Code-point sequences use spaces: `U+0065 U+0301`.
- Invisible/combining values show a dotted-circle visualization only as an aid: `◌́`; the stored answer remains `U+0301`.
- Named escape displays such as `\u00E9`, `\u{1F600}`, and `\uD83D\uDE00` are syntax, not encodings.
- Text examples show a visible boundary marker `|` only in segmentation diagrams; it is not part of the string.
- `␍`, `␊`, `␀`, and `�` label CR, LF, NUL, and replacement character in explanatory views.

### UTF-8 contract

For scalar value `s`:

| Range | Byte pattern |
|---|---|
| `0000..007F` | `0xxxxxxx` |
| `0080..07FF` | `110xxxxx 10xxxxxx` |
| `0800..FFFF`, excluding surrogates | `1110xxxx 10xxxxxx 10xxxxxx` |
| `10000..10FFFF` | `11110xxx 10xxxxxx 10xxxxxx 10xxxxxx` |

Strict UTF-8:

- rejects unexpected/missing continuation bytes;
- rejects overlong forms;
- rejects encoded surrogate values;
- rejects values above `U+10FFFF`;
- accepts scalar noncharacters even though interchange policy may reject them separately;
- has no byte-order ambiguity.

An initial UTF-8 signature/BOM is bytes `EF BB BF`, encoding `U+FEFF`. Prompts state whether a protocol consumes it as a signature or exposes it as text. It is neither required for UTF-8 nor a general-purpose zero-width-no-break character in new text.

### UTF-16 contract

- BMP scalar values outside surrogates use one equal-valued 16-bit code unit.
- For scalar `s≥U+10000`, let `v=s−0x10000`:

```text
high = 0xD800 + (v >> 10)
low  = 0xDC00 + (v & 0x3FF)
```

- A high surrogate is `D800..DBFF`; a low surrogate is `DC00..DFFF`.
- A well-formed pair is high then low. Lone/reversed/same-kind surrogates are ill-formed UTF-16.
- UTF-16BE serializes each code unit most-significant byte first; UTF-16LE reverses each code unit’s bytes.
- BOM bytes are `FE FF` for BE and `FF FE` for LE. Prompts distinguish a consumed signature from the text character `U+FEFF`.

### UTF-32 contract

- Each scalar uses one 32-bit code unit equal to its code-point value.
- UTF-32BE/LE differ only in byte order.
- Surrogates and values above `0x10FFFF` are invalid UTF-32 scalar encodings.
- BOM bytes are `00 00 FE FF` for BE and `FF FE 00 00` for LE.

### Legacy-encoding contract

The bundled single-byte tables are:

- ASCII: bytes `00..7F`;
- ISO-8859-1: byte `00..FF` maps to code point with the same value;
- Windows-1252: pinned byte table, including `80→U+20AC`; undefined byte slots are decoding errors under strict mode.

Prompts never say only “ANSI.” They name the exact encoding. Encoding from Unicode succeeds only when the target mapping contains the scalar.

### Decoding-error contract

Every decoder question declares one of:

- `strict`: stop/reject on the first ill-formed sequence;
- `replace-v1`: replace each maximal ill-formed subsequence identified by the bundled oracle with one `U+FFFD`, then continue;
- `protocol-specific`: a fully displayed bounded rule.

Do not infer one platform’s replacement count. Invalid examples used for direct input have a unique result under the displayed policy.

### Normalization contract

- **NFD:** canonical decomposition followed by canonical combining-order sorting.
- **NFC:** NFD-equivalent ordering followed by canonical composition where permitted.
- **NFKD:** compatibility decomposition followed by canonical ordering.
- **NFKC:** NFKD-equivalent ordering followed by canonical composition.
- Canonical equivalence is narrower than compatibility equivalence.
- Normalization does not case-fold, transliterate, remove accents generally, resolve confusables, or choose a locale collation.
- Each normalization form is idempotent.
- Individually normalized strings may produce a non-normalized concatenation; normalize after joining when the contract requires a normalized result.
- All normalization answers come from bundled Unicode 17.0.0 decomposition, combining-class, composition-exclusion, and Hangul data.

### Grapheme and segmentation contract

Default extended grapheme clusters use the pinned UAX #29 rules/data, not browser `Intl.Segmenter` output unless it passes the model self-test.

Important generated structures include:

- base plus combining marks;
- CR followed by LF;
- emoji plus variation selector;
- emoji modifier sequences;
- ZWJ emoji sequences present in pinned fixtures;
- regional-indicator pairing;
- Hangul jamo/syllables.

EGCs are a practical default editing unit, not an assertion about every writing system or application. Word-boundary families explicitly say “default UAX #29 word boundaries,” not linguistic words in all contexts.

### JavaScript string contract

`ecmascript-text-v1` models:

- a JavaScript string as 16-bit code units;
- `.length` and numeric indexing by code unit;
- `charCodeAt` returns a code unit;
- `codePointAt` combines a valid pair when called at its high-surrogate index;
- `for...of` and `Array.from` iterate code points/pairs, but lone surrogates remain individual values;
- `slice` uses code-unit offsets and can split a pair;
- `String.fromCodePoint` consumes scalar/code-point integers within its defined range; generated well-formed cases exclude surrogate arguments;
- `TextEncoder` emits UTF-8 and replaces lone surrogates with `U+FFFD` before encoding under the pinned API fixture;
- `TextDecoder("utf-8",{fatal:true})` rejects malformed input; nonfatal replacement examples follow the pinned test fixtures.

The abstract Unicode-string oracle and JavaScript-string oracle remain distinct.

### Global answer conventions

- Surrounding whitespace around scalar/byte/code-unit answer fields is ignored.
- Hex is case-insensitive on input; feedback renders uppercase fixed width.
- Code point input accepts `U+1F600`, `1F600`, or `0x1F600` when the field is explicitly a code point.
- Byte/code-unit sequences accept spaces, commas, hyphens, or one value per field; byte/unit count must match.
- Literal-text answers are normalization-sensitive unless the family explicitly normalizes them. Invisible content is never graded through an unlabeled plain text box.
- Sequence/set answers use structured chips; sequence order matters except for unordered classification sets.
- Count answers require a named unit stored with the question.
- `invalid`, `unrepresentable`, `reject`, `replacement occurred`, and `cannot determine encoding` are distinct answers.
- Canonically equivalent literal strings are accepted only when canonical equivalence is not the target distinction.
- Case-insensitive answers use the exact declared folding/locale model, never host-locale lowercasing.

### Difficulty philosophy

Difficulty should rise through:

- moving among bytes, code units, code points, and grapheme clusters;
- crossing one-, two-, three-, and four-byte/unit boundaries;
- reversing encode/decode steps;
- validating rather than merely transforming;
- mixing normalization with length/equality without conflating them;
- recognizing a pipeline’s decode/encode layer and where loss occurred;
- tracking indices across units;
- selecting an appropriate unit/policy for a practical task;
- combining at most two or three already-mastered layers.

Difficulty must not rise through:

- obscure code-point-name trivia;
- long byte dumps or hand arithmetic for its own sake;
- dependence on installed fonts/rendering;
- malformed sequences with implementation-dependent recovery;
- unlabelled encodings or locales;
- giant combining sequences/emoji;
- memorizing entire decomposition/case/confusable tables;
- vague “how many characters?” wording;
- trick questions about Unicode-version changes not supplied.

### Topic-wide level model

| Level | Typical demand |
|---|---|
| 1 | Identify one unit or encode ASCII/BMP landmark |
| 2 | Short sequence, two-byte UTF-8, staged normalization/segmentation |
| 3 | Supplementary scalar, surrogate pair, malformed sequence, mixed counts |
| 4 | Compatibility/combining order, emoji cluster, transcoding/debug pipeline |
| 5 | API/index/security decision combining several declared layers |

### Generator and oracle model

Every instance stores:

`unicodeVersion`, `annexVersions`, `apiModelVersion`, `categoryId`, `familyId`, `level`, `scalarSequence`, `codePointProperties`, `byteEncoding`, `byteSequence`, `codeUnits`, `normalizationForm`, `graphemeBreakProperties`, `expectedBoundaries`, `caseLocale`, `pipeline`, `errorPolicy`, `canonicalAnswer`, `acceptedAnswerClass`, `difficultyDimensions`, `misconceptionsTargeted`, `distractorProvenance`, `workedSolution`, `structuralSignature`, and `oracleVersion`.

Generate semantic scalar/byte sequences first, derive every representation from pinned tables/codecs, and reject questions whose visible font rendering is required to distinguish answers.

## 2. Category: Text units, identity, and counting

### Category purpose

Build a layered vocabulary so later encoding, normalization, and API questions ask and answer in the correct unit.

### Learn

Bytes store encodings; code units belong to an encoding/API; code points identify Unicode values; grapheme clusters are default segmentation units; glyphs are rendered shapes. One visible mark may use several code points, while one code point may require several bytes or UTF-16 units.

### Prerequisites

Bytes, integers, and simple sequences.

### Category boundaries

This category counts and classifies supplied representations. It does not yet derive multi-byte encodings or normalization.

### Common misconceptions

- Byte = character = code point.
- One UTF-16 unit always equals one code point.
- One code point always equals one displayed glyph.
- Surrogate code points are ordinary Unicode scalar values.
- Unassigned or private-use means numerically invalid.

### Family `text_unit_classify`

**Task.** Classify a displayed entity as byte, code unit, code point/scalar, grapheme cluster, or glyph.

**Response and template.** Property set: `Which text-unit roles apply to {entity_description}?`

**Derivation.** Match width/encoding/identity/segmentation/rendering role to the normative definitions.

**Difficulty.** L1 byte/code point; L2 code unit/grapheme; L3 glyph versus cluster.

**Examples.**

1. `E2` as one member of a UTF-8 sequence → byte and UTF-8 code unit. L1.
2. `D83D` in a UTF-16 string → one UTF-16 code unit, not a scalar by itself. L2.
3. the font-drawn shape for `fi` → glyph behavior, not proof of one code point or grapheme. L3.

**Distractors and validation.** All use “character.” Typed entity metadata yields exact role set.

### Family `scalar_validity_classify`

**Task.** Classify code points as scalar, surrogate, private-use, noncharacter, unassigned, or assigned under pinned data.

**Response and template.** Property set: `Under Unicode 17.0.0, classify {code_point}.`

**Derivation.** Range checks plus bundled assignment/private-use/noncharacter properties.

**Difficulty.** L1 ordinary scalar; L2 surrogate/private use; L3 noncharacter versus invalid.

**Examples.**

1. `U+0061` → assigned scalar (`LATIN SMALL LETTER A`). L1.
2. `U+D800` → surrogate code point, not scalar. L2.
3. `U+FDD0` → scalar and designated noncharacter; it is not a surrogate or out of range. L3.

**Distractors and validation.** Noncharacter=invalid scalar or private-use=unassigned error. Pinned property lookup.

### Family `codepoint_range_classify`

**Task.** Place a value in ASCII, BMP, supplementary plane, surrogate range, or outside codespace.

**Response and template.** Range/property set: `Which range labels apply to {value}?`

**Derivation.** Compare numeric boundaries: ASCII≤7F, BMP≤FFFF, supplementary 10000..10FFFF, with surrogate subrange separated.

**Difficulty.** L1 ASCII; L2 BMP/supplementary; L3 exact boundaries/out of range.

**Examples.**

1. `U+007F` → ASCII and BMP scalar. L1.
2. `U+1F600` → supplementary-plane scalar. L2.
3. `0x110000` → outside Unicode codespace; `U+10FFFF` is still in codespace/scalar though a noncharacter. L3.

**Distractors and validation.** BMP means two bytes or max is FFFF. Integer range oracle.

### Family `notation_to_value`

**Task.** Convert among `U+`, hex integer, and decimal code-point notation.

**Response and template.** Integer/code-point field: `Rewrite {source} as {target_notation}.`

**Derivation.** Parse hexadecimal or decimal integer and render fixed Unicode notation.

**Difficulty.** L1 ASCII; L2 four-digit BMP; L3 supplementary six-digit.

**Examples.**

1. `U+0041` → decimal65. L1.
2. decimal8364 → `U+20AC`. L2.
3. `0x1F600` → `U+1F600` and decimal128512. L3.

**Distractors and validation.** Read hexadecimal digits as decimal. Integer parse/format round trip.

### Family `sequence_unit_count`

**Task.** Count bytes, UTF-16 units, code points, or EGCs for a supplied annotated sequence.

**Response and template.** Integer with named unit: `How many {unit} are in {sequence}?`

**Derivation.** Use supplied scalar sequence, encoding, and pinned grapheme boundaries.

**Difficulty.** L1 ASCII; L2 composed/decomposed accent; L3 supplementary/emoji sequence.

**Examples.**

1. `A` →1 UTF-8 byte,1 UTF-16 unit,1 code point,1 EGC. L1.
2. `U+0065 U+0301` (`e`+combining acute) →2 code points but1 EGC and3 UTF-8 bytes. L2.
3. `U+1F469 U+200D U+1F4BB` (`👩‍💻`) →3 code points,5 UTF-16 units,1 EGC. L3.

**Distractors and validation.** Count visible shapes for every unit. Independent codec and segmentation counts.

### Family `same_render_different_sequence`

**Task.** Decide what equality can be concluded from two strings that render alike/differently.

**Response and template.** Structured claims: `Given sequences {left},{right} and displayed glyphs, which identities are established?`

**Derivation.** Compare bytes/code points/normalization separately; never derive identity from glyph screenshot alone.

**Difficulty.** L1 identical sequence; L2 canonical alternatives; L3 font ligature/confusable.

**Examples.**

1. two copies of `U+0061` under same encoding → same code-point sequence. L1.
2. `U+00E9` and `U+0065 U+0301` may render alike but are different code-point sequences. L2.
3. Latin `a` U+0061 and Cyrillic `а` U+0430 can look alike but are distinct assigned code points. L3.

**Distractors and validation.** Same pixels=Unicode identity. Exact sequence/property oracle.

### Family `length_unit_choose`

**Task.** Select the appropriate unit for a practical length/index requirement.

**Response and template.** Single choice: `For {task}, which unit should the contract count?`

**Derivation.** Match storage/transmission to bytes, encoding APIs to code units, Unicode processing to code points, and user editing quotas to EGCs subject to stated limitations.

**Difficulty.** L1 byte storage; L2 API index; L3 UI limit versus security/storage.

**Examples.**

1. Maximum UTF-8 network payload size → bytes. L1.
2. JavaScript `.length`/slice offset → UTF-16 code units. L2.
3. “Show at most 10 user-perceived editing units” under this app’s default → EGCs, then separately enforce byte/storage limits. L3.

**Distractors and validation.** One universal character count. Requirement-to-unit matrix.

### Family `representation_layer_trace`

**Task.** Order the layers from abstract scalar sequence through encoding bytes to rendered glyphs.

**Response and template.** Ordered sequence: `Arrange {layers} for {text_pipeline}.`

**Derivation.** Scalar/code-point sequence → encoding code units/bytes → decode to scalars → segmentation/shaping/font glyphs as applicable.

**Difficulty.** L1 encode/store; L2 transmit/decode; L3 include normalization/segmentation without swapping roles.

**Examples.**

1. `U+0041` → UTF-8 byte `41` → decoder returns U+0041. L1.
2. scalar U+1F600 → UTF-16 units D83D DE00 → JavaScript sees two code units. L2.
3. scalar sequence `0065 0301` → normalization (if requested) → EGC segmentation → font glyph rendering; segmentation does not create encoding bytes. L3.

**Distractors and validation.** Font before decode or normalization on raw unknown bytes. Typed pipeline DAG.

### Cross-family progression

Unit classification precedes counting. Scalar/range/notation work supplies stable identifiers. Equality and pipeline questions prevent visual and storage layers from collapsing. Unit choice is interleaved with every later category.

## 3. Category: UTF-8 encoding, decoding, and validation

### Category purpose

Train exact variable-length UTF-8 mechanics and recognition of valid boundaries and malformed sequences.

### Learn

UTF-8 uses one to four bytes. The leading byte gives sequence length; continuation bytes begin `10`. Valid UTF-8 uses the shortest form, excludes surrogates, and cannot exceed `U+10FFFF`.

### Prerequisites

Hex bytes, code-point ranges, and scalar validity.

### Category boundaries

Only strict validity and the declared `replace-v1` policy appear. Guessing an encoding from arbitrary bytes belongs to legacy/debugging categories.

### Common misconceptions

- UTF-8 means one byte per character.
- Continuation bytes may begin a sequence.
- Any structurally shaped byte sequence is valid.
- Surrogate code points can be UTF-8 encoded.
- UTF-8 has little/big endian variants.

### Family `utf8_length_from_scalar`

**Task.** Determine UTF-8 byte length from a scalar.

**Response and template.** Integer: `How many UTF-8 bytes encode {scalar}?`

**Derivation.** Select range row from the normative table.

**Difficulty.** L1 ASCII; L2 2/3 byte; L3 boundary/supplementary.

**Examples.**

1. `U+0041` →1 byte. L1.
2. `U+20AC` →3 bytes. L2.
3. `U+10000` →4 bytes; `U+FFFF` uses3 when scalar/non-surrogate. L3.

**Distractors and validation.** Hex digit count or UTF-16 units. Range oracle.

### Family `utf8_encode_scalar`

**Task.** Encode a scalar as UTF-8 bytes.

**Response and template.** Byte sequence: `Encode {scalar} in UTF-8.`

**Derivation.** Fill payload bits into the shortest applicable pattern.

**Difficulty.** L1 ASCII; L2 2/3 byte; L3 4 byte with scaffold removed.

**Examples.**

1. `U+0024` → `24`. L1.
2. `U+20AC` → `E2 82 AC`. L2.
3. `U+1F600` → `F0 9F 98 80`. L3.

**Distractors and validation.** UTF-16 bytes, missing continuation prefix, or overlong form. Independent arithmetic encoder/standard fixture.

### Family `utf8_decode_sequence`

**Task.** Decode one valid UTF-8 sequence to a scalar.

**Response and template.** Code point: `Decode UTF-8 bytes {bytes}.`

**Derivation.** Strip prefix bits, concatenate payload bits, verify shortest/range, render scalar.

**Difficulty.** L1 ASCII; L2 2/3 byte; L3 4 byte.

**Examples.**

1. `41` → `U+0041`. L1.
2. `C2 A2` → `U+00A2`. L2.
3. `F0 9F 98 80` → `U+1F600`. L3.

**Distractors and validation.** Treat bytes as code points or little-endian integer. Strict decoder plus re-encode equality.

### Family `utf8_payload_trace`

**Task.** Complete bit groups/prefixes in a UTF-8 encode/decode trace.

**Response and template.** Bit/byte fields: `{trace_with_gaps}; fill {missing_groups}.`

**Derivation.** Pad scalar payload to 11/16/21 slots, split 5/6/6 or 4/6/6/6 as applicable, add prefixes.

**Difficulty.** L1 identify continuation; L2 fill payload; L3 inverse missing lead byte.

**Examples.**

1. continuation payload `000010` → byte `10000010`=`82`. L1.
2. U+20AC payload fills `1110 0010 | 10 000010 | 10 101100` → `E2 82 AC`. L2.
3. bytes `F0 9F 98 80`: stripping prefixes yields scalar bits for `0x1F600`. L3.

**Distractors and validation.** Preserve prefix as payload or reverse group order. Bit reconstruction.

### Family `utf8_validity_classify`

**Task.** Decide whether a byte sequence is strict UTF-8 and name the first failure.

**Response and template.** Valid/invalid plus reason: `Validate {bytes} as strict UTF-8.`

**Derivation.** Parse lead/continuations; enforce shortest form, scalar range, and completion.

**Difficulty.** L1 unexpected continuation; L2 truncation/overlong; L3 surrogate/out-of-range.

**Examples.**

1. `80` → invalid unexpected continuation byte. L1.
2. `C0 AF` → invalid overlong form (and C0 invalid lead), not `/`. L2.
3. `ED A0 80` → invalid because it encodes surrogate U+D800. L3.

**Distractors and validation.** Decode shape only or accept replacement as validity. Strict DFA and scalar decoder.

### Family `utf8_boundary_reason`

**Task.** Encode/classify values at UTF-8 length and validity boundaries.

**Response and template.** Length/bytes/validity: `Evaluate boundary value {value}.`

**Derivation.** Apply exact thresholds and exclusions.

**Difficulty.** L1 7F/80; L2 7FF/800; L3 D7FF/D800/E000/10FFFF/110000.

**Examples.**

1. U+007F→`7F`; U+0080→`C2 80`. L1.
2. U+07FF→`DF BF`; U+0800→`E0 A0 80`. L2.
3. U+10FFFF→`F4 8F BF BF` structurally valid scalar/noncharacter; 0x110000 is invalid. L3.

**Distractors and validation.** Four bytes begin at FFFF or noncharacter=malformed. Boundary fixture table.

### Family `utf8_safe_boundary`

**Task.** Identify safe code-point cut positions in a valid UTF-8 byte string.

**Response and template.** Byte offsets/set: `For bytes {bytes}, which offsets are code-point boundaries?`

**Derivation.** Decode sequence starts/ends; offsets are between complete sequences, never before a continuation within one.

**Difficulty.** L1 ASCII; L2 mixed lengths; L3 choose largest prefix within byte budget.

**Examples.**

1. `41 42` → boundaries0,1,2. L1.
2. `41 C2 A2 42` → boundaries0,1,3,4; offset2 splits U+00A2. L2.
3. UTF-8 `41 F0 9F 98 80 42`, budget4 bytes → largest valid prefix is only `41` (1 byte), not a partial emoji. L3.

**Distractors and validation.** Every byte index or count lead byte plus budget. Decoder-produced offsets.

### Family `utf8_bom_policy`

**Task.** Interpret `EF BB BF` under an explicitly declared protocol/start-position policy.

**Response and template.** Outcome: `Decode {bytes} under {bom_policy}.`

**Derivation.** Recognize U+FEFF only at sequence position; consume/preserve according to policy.

**Difficulty.** L1 signature consumed; L2 preserve; L3 same bytes midstream.

**Examples.**

1. bytes `EF BB BF 41`, protocol consumes optional initial UTF-8 signature → text `A`. L1.
2. same bytes under preserve-all-scalars policy → `U+FEFF U+0041`. L2.
3. bytes `41 EF BB BF 42` → U+FEFF is midstream and not an initial signature; preserve as a code point under shown policy. L3.

**Distractors and validation.** UTF-8 endianness marker required or remove every U+FEFF. Policy state machine.

### Cross-family progression

Length/range comes before arithmetic encoding. Encode and decode are interleaved, then payload traces expose the bit structure. Validity and boundaries follow fluent valid sequences. BOM policy is kept separate from core decoding.

## 4. Category: UTF-16, UTF-32, endianness, and BOMs

### Category purpose

Train variable-width UTF-16 code-unit reasoning and explicit serialization byte order, contrasting it with fixed-width UTF-32.

### Learn

UTF-16 uses one unit for BMP scalars and a high+low surrogate pair for supplementary scalars. Endianness affects bytes, not code-point order. UTF-32 uses one 32-bit unit per scalar but still needs a declared byte order when serialized.

### Prerequisites

Scalar/BMP boundaries and hexadecimal arithmetic.

### Category boundaries

JavaScript indexing effects are deferred to the API category. Ill-formed surrogate handling always declares strict/replacement policy.

### Common misconceptions

- Any surrogate code unit is itself a Unicode scalar.
- Low-high order is valid in UTF-16LE.
- Little endian reverses code-unit sequence order.
- UTF-16 always uses two bytes per code point.
- A BOM belongs to abstract text rather than a serialized stream policy.

### Family `utf16_encode_scalar`

**Task.** Encode a scalar as one UTF-16 unit or surrogate pair.

**Response and template.** Code-unit sequence: `Encode {scalar} as UTF-16 code units.`

**Derivation.** BMP scalar copies directly; supplementary uses the normative subtract/split formula.

**Difficulty.** L1 BMP; L2 supplied pair scaffold; L3 calculate pair.

**Examples.**

1. `U+20AC` → `20AC`. L1.
2. `U+1F600` → `D83D DE00`. L2.
3. `U+10437` → `D801 DC37`. L3.

**Distractors and validation.** Direct low 16 bits or reversed pair. Independent formula/round trip.

### Family `utf16_decode_units`

**Task.** Decode one UTF-16 scalar sequence.

**Response and template.** Code point: `Decode UTF-16 units {units}.`

**Derivation.** Direct BMP or `0x10000+((high−D800)<<10)+(low−DC00)`.

**Difficulty.** L1 BMP; L2 known pair; L3 arbitrary pair.

**Examples.**

1. `0061` → U+0061. L1.
2. `D83D DE00` → U+1F600. L2.
3. `DBFF DFFF` → U+10FFFF. L3.

**Distractors and validation.** Concatenate hex or little-endian swap units. Formula plus re-encode.

### Family `utf16_validity_classify`

**Task.** Validate a UTF-16 code-unit sequence.

**Response and template.** Valid/invalid plus location: `Validate UTF-16 units {units}.`

**Derivation.** Non-surrogate BMP units stand alone; every high must be immediately followed by low; low cannot appear alone.

**Difficulty.** L1 valid BMP/pair; L2 lone/reversed; L3 adjacent multiple pairs/error index.

**Examples.**

1. `0061 D83D DE00` → valid. L1.
2. `DE00 D83D` → invalid: low surrogate first and high left unmatched. L2.
3. `D83D 0061` → invalid at first unit: high surrogate lacks following low. L3.

**Distractors and validation.** Any two surrogates form pair. Strict unit-state machine.

### Family `utf16_endian_serialize`

**Task.** Serialize/deserialize UTF-16 code units in LE or BE.

**Response and template.** Byte/unit sequence: `{operation} {values} as UTF-16{endian}.`

**Derivation.** Convert each 16-bit unit independently to byte order; preserve unit sequence.

**Difficulty.** L1 BMP; L2 surrogate pair; L3 infer endian from declared scalar and bytes.

**Examples.**

1. unit `20AC` → BE `20 AC`, LE `AC 20`. L1.
2. `D83D DE00` → UTF-16LE `3D D8 00 DE`. L2.
3. bytes `D8 3D DE 00` for U+1F600 → UTF-16BE, not LE. L3.

**Distractors and validation.** Reverse whole stream or unit order. Serialize then deserialize.

### Family `utf16_bom_detect`

**Task.** Determine byte order and decoded content from BOM-tagged UTF-16 bytes.

**Response and template.** Endian/text: `Interpret {bytes} under BOM-required UTF-16 policy.`

**Derivation.** Consume first BOM bytes, select endian, decode remaining units.

**Difficulty.** L1 BE/LE; L2 supplementary; L3 missing/wrong-position BOM.

**Examples.**

1. `FE FF 00 41` → BE signature then `A`. L1.
2. `FF FE 3D D8 00 DE` → LE signature then U+1F600. L2.
3. `00 41 FE FF` under BOM-required-at-start policy → reject: no initial BOM; later FE FF is data position. L3.

**Distractors and validation.** Decode BOM as visible text always or choose host endian. Policy decoder.

### Family `utf32_serialize_validate`

**Task.** Encode/decode/validate one UTF-32 scalar in declared endian.

**Response and template.** Bytes/code point/validity: `{operation} {value} as UTF-32{endian}.`

**Derivation.** Store 32-bit scalar value; reject surrogate/out-of-range.

**Difficulty.** L1 BE ASCII; L2 LE supplementary; L3 invalid scalar.

**Examples.**

1. U+0041 UTF-32BE → `00 00 00 41`. L1.
2. U+1F600 UTF-32LE → `00 F6 01 00`. L2.
3. UTF-32BE `00 00 D8 00` → invalid scalar encoding of surrogate U+D800. L3.

**Distractors and validation.** UTF-16 pair padded to32 bits. Integer/endian/scalar oracle.

### Family `utf_storage_compare`

**Task.** Compare UTF-8/16/32 code-unit or byte counts for an annotated scalar sequence.

**Response and template.** Count table: `Complete storage counts for {sequence}.`

**Derivation.** Encode every scalar under each UTF and sum declared bytes/units; BOM excluded unless shown.

**Difficulty.** L1 ASCII; L2 BMP non-ASCII; L3 mixed supplementary.

**Examples.**

1. `ABC` → UTF-8 3 bytes, UTF-16 3 units/6 bytes, UTF-32 3 units/12 bytes. L1.
2. U+20AC → UTF-8 3 bytes, UTF-16 1 unit/2 bytes, UTF-32 4 bytes. L2.
3. `A`+U+1F600 → UTF-8 5 bytes, UTF-16 3 units/6 bytes, UTF-32 8 bytes. L3.

**Distractors and validation.** One best encoding for every text or units=bytes. Independent codec lengths.

### Cross-family progression

One-unit BMP cases precede surrogate formulas. Code-unit validity precedes byte endianness. BOM policy follows endian fluency. UTF-32 and comparative storage consolidate that fixed-width code units do not imply equal byte efficiency.

## 5. Category: ASCII, legacy encodings, transcoding, and mojibake

### Category purpose

Train explicit source/target encoding reasoning and diagnosis of reversible versus lossy decoding mistakes.

### Learn

Bytes do not name their encoding. ASCII agrees with many encodings only for `00..7F`. ISO-8859-1 and Windows-1252 differ in `80..9F`. Transcoding means decode bytes to Unicode scalars, then encode those scalars in the target encoding.

### Prerequisites

Bytes, scalar sequences, UTF-8, and strict/replacement policies.

### Category boundaries

Only three pinned single-byte tables are used. Automatic charset detection remains uncertain; prompts never accept “looks right” as proof.

### Common misconceptions

- Latin-1 and Windows-1252 are the same.
- Every byte sequence has one inherent text meaning.
- Transcoding means copying/relabeling bytes.
- Mojibake is a font problem.
- Re-encoding can recover information after replacement.

### Family `ascii_encode_decode`

**Task.** Encode/decode short ASCII scalar/byte sequences.

**Response and template.** Byte/text sequence: `{operation} {value} as ASCII.`

**Derivation.** Map `U+0000..U+007F` directly to equal byte values; reject other scalars.

**Difficulty.** L1 letter; L2 controls/punctuation; L3 mixed string/unrepresentable scalar.

**Examples.**

1. `A` U+0041 → byte `41`. L1.
2. bytes `41 0A 42` → `A`, LF, `B`. L2.
3. `café` → unrepresentable in ASCII because U+00E9 is outside range. L3.

**Distractors and validation.** Alphabet position or silently drop accent. Range/table round trip.

### Family `single_byte_table_decode`

**Task.** Decode bytes under ISO-8859-1 or Windows-1252 and contrast results.

**Response and template.** Code-point sequence: `Decode {bytes} as {encoding}.`

**Derivation.** Look up every byte in the pinned table; strict-decode undefined Windows-1252 slots as errors.

**Difficulty.** L1 shared ASCII/Latin-1; L2 high byte; L3 80..9F contrast/error.

**Examples.**

1. ISO-8859-1 `E9` → U+00E9 `é`. L1.
2. Windows-1252 `80` → U+20AC `€`; ISO-8859-1 `80` → U+0080 control. L2.
3. Windows-1252 byte `81` → strict decoding error because that table slot is undefined. L3.

**Distractors and validation.** Byte value always equals code point or 80 always euro. Pinned lookup table.

### Family `legacy_representability`

**Task.** Decide whether a scalar/string can be encoded losslessly in a named single-byte encoding.

**Response and template.** Yes/no plus bytes/unrepresentable scalar: `Encode {text} as {encoding}.`

**Derivation.** Invert target table and require one mapping for every scalar.

**Difficulty.** L1 ASCII; L2 Latin-1/Windows extension; L3 mixed string/undefined distinction.

**Examples.**

1. `£` U+00A3 → representable as `A3` in ISO-8859-1 and Windows-1252. L1.
2. `€` U+20AC → Windows-1252 `80`, not representable in ISO-8859-1. L2.
3. `A😀` → not representable in either legacy table because U+1F600 lacks a mapping. L3.

**Distractors and validation.** Code point≤FF implies every table maps it. Reverse-table oracle.

### Family `transcode_bytes`

**Task.** Transcode a short byte sequence from a named source to target encoding.

**Response and template.** Byte sequence: `Transcode {bytes} from {source} to {target}.`

**Derivation.** Strict-decode source to scalars, then strict-encode target; report unrepresentable instead of substituting unless specified.

**Difficulty.** L1 ASCII unchanged; L2 Latin-1/Windows→UTF-8; L3 target failure.

**Examples.**

1. ASCII `41 42` → UTF-8 `41 42`. L1.
2. ISO-8859-1 `E9` → U+00E9 → UTF-8 `C3 A9`. L2.
3. Windows-1252 `80` (`€`) → UTF-8 `E2 82 AC`; transcoding it to ISO-8859-1 fails. L3.

**Distractors and validation.** Relabel/copy high bytes or decode target first. Independent decode+encode pipeline and round trip where representable.

### Family `mojibake_predict`

**Task.** Predict displayed scalar/text result when valid bytes are decoded with the wrong named encoding.

**Response and template.** Code-point/text sequence: `{original_text} encoded as {source}; bytes decoded as {wrong_encoding}. What results?`

**Derivation.** Encode correctly, then decode identical bytes under wrong table/codec.

**Difficulty.** L1 one scalar; L2 punctuation; L3 two-stage repeated corruption.

**Examples.**

1. `é` UTF-8 bytes `C3 A9` decoded as Windows-1252 → U+00C3 U+00A9, commonly displayed `Ã©`. L1.
2. `€` UTF-8 `E2 82 AC` decoded as Windows-1252 → U+00E2 U+201A U+00AC (`â‚¬`). L2.
3. Re-encode mojibake U+00C3 U+00A9 as UTF-8 → `C3 83 C2 A9`; a second wrong decode compounds rather than repairs it. L3.

**Distractors and validation.** Font substitution or byte reversal. Explicit pipeline oracle.

### Family `mojibake_repair_feasibility`

**Task.** Decide whether an exact wrong-decoding path can be inverted and, when possible, recover original scalars.

**Response and template.** Repair/outcome: `Given {observed_scalars} and known pipeline {pipeline}, can original text be recovered?`

**Derivation.** Invert each stage only if every mapping was injective and no replacement/drop occurred.

**Difficulty.** L1 known reversible table path; L2 ambiguity; L3 replacement loss.

**Examples.**

1. observed U+00C3 U+00A9 known to be UTF-8 bytes decoded as Windows-1252 → encode Windows-1252 `C3 A9`, decode UTF-8 → `é`. L1.
2. observed `A` with unknown source among ASCII/Latin-1/Windows-1252 does not identify the original encoding, though scalar A is unchanged. L2.
3. observed U+FFFD from an earlier replacement decode → original invalid byte(s) cannot generally be recovered. L3.

**Distractors and validation.** Reverse any visible mojibake or infer encoding from ASCII. Pipeline invertibility/loss flags.

### Family `encoding_detection_evidence`

**Task.** Determine which encodings are compatible with bytes and what, if anything, can be concluded.

**Response and template.** Encoding set/claim: `For bytes {bytes}, which candidate decoders accept them, and is encoding uniquely determined?`

**Derivation.** Strict-decode under each displayed candidate; compatibility set is not provenance proof.

**Difficulty.** L1 ASCII ambiguity; L2 one invalid candidate; L3 several plausible decoded texts.

**Examples.**

1. bytes `41 42` are valid and spell AB in ASCII, ISO-8859-1, Windows-1252, and UTF-8 → encoding not uniquely determined. L1.
2. `C3 A9` is valid UTF-8 for é and also valid Windows-1252 for U+00C3 U+00A9 → validity alone does not choose intent. L2.
3. `C3 9D` is valid UTF-8 for U+00DD; strict ASCII rejects C3 and displayed Windows-1252 candidate rejects undefined byte 9D, so only UTF-8 remains among those candidates. L3.

**Distractors and validation.** Any non-ASCII implies UTF-8 or readable output proves source. Candidate strict decoders.

### Cross-family progression

ASCII establishes direct mapping. Table decoding and representability precede transcoding. Mojibake prediction follows explicit pipelines; repair is allowed only after invertibility is understood. Detection questions end the category by separating compatibility from certainty.

## 6. Category: Unicode normalization and equivalence

### Category purpose

Train canonical/compatibility equivalence and exact normalization transformations without using normalization as a catch-all text cleanup.

### Learn

Canonical alternatives represent the same abstract text under Unicode’s canonical-equivalence relation. NFC prefers compositions where allowed; NFD decomposes canonically. NFKC/NFKD additionally apply compatibility mappings that may erase formatting/semantic distinctions.

### Prerequisites

Code-point sequences, combining marks, and pinned property tables.

### Category boundaries

The learner uses shown decomposition/combining-class cards at early levels. Exhaustive table memorization is not required. Normalization is not locale casing, accent stripping, transliteration, or spoof prevention.

### Common misconceptions

- NFC means “ASCII/plain text.”
- NFD simply splits every code point.
- NFKC is always safe for stored identifiers/display.
- Normalization changes case or removes all marks.
- If X and Y are normalized, concatenating them stays normalized.

### Family `canonical_equivalence_decide`

**Task.** Decide whether two scalar sequences are canonically equivalent.

**Response and template.** Yes/no plus common NFD: `Are {left} and {right} canonically equivalent?`

**Derivation.** Normalize both to NFD and compare exact scalar sequences.

**Difficulty.** L1 precomposed/decomposed accent; L2 reordered marks; L3 compatibility/confusable negative.

**Examples.**

1. U+00E9 and `U+0065 U+0301` → canonically equivalent; common NFD is latter. L1.
2. `a U+0301 U+0323` and `a U+0323 U+0301` → canonically equivalent after canonical ordering. L2.
3. ligature U+FB01 `ﬁ` and `f i` → not canonically equivalent; they are compatibility equivalent. L3.

**Distractors and validation.** Same glyph or same NFKC means canonical. Independent NFD oracle.

### Family `canonical_decompose`

**Task.** Apply canonical decomposition, including a bounded Hangul case.

**Response and template.** Code-point sequence: `Canonically decompose {sequence}.`

**Derivation.** Recursively apply canonical decomposition mappings or Hangul algorithm, then order marks.

**Difficulty.** L1 Latin precomposed; L2 recursive/marks; L3 Hangul syllable.

**Examples.**

1. U+00C5 `Å` → `U+0041 U+030A`. L1.
2. U+01FA `Ǻ` → `U+0041 U+030A U+0301`. L2.
3. U+AC01 `각` → `U+1100 U+1161 U+11A8`. L3.

**Distractors and validation.** Compatibility mapping or only one recursive step. Bundled mapping/Hangul oracle.

### Family `combining_order_sort`

**Task.** Put combining marks into canonical order while preserving starter boundaries/stable equal-class order.

**Response and template.** Code-point sequence: `Canonically order {sequence} using shown CCC values.`

**Derivation.** Stable sort nonstarters after each starter by canonical combining class; CCC0 starts a new segment.

**Difficulty.** L1 two unequal classes; L2 equal class stability; L3 multiple starters.

**Examples.**

1. `a U+0301(230) U+0323(220)` → `a U+0323 U+0301`. L1.
2. two marks both CCC230 retain their original relative order. L2.
3. `a acute(230) b dot-below(220)` does not move dot below across starter b. L3.

**Distractors and validation.** Sort code points numerically or globally across starters. Stable segmented sort.

### Family `normalize_to_form`

**Task.** Normalize a curated sequence to NFC, NFD, NFKC, or NFKD.

**Response and template.** Code-point sequence: `Normalize {sequence} to {form}.`

**Derivation.** Apply the pinned normative decomposition/order/composition algorithm for selected form.

**Difficulty.** L1 NFC/NFD accent; L2 compatibility; L3 ordering+composition.

**Examples.**

1. `U+0065 U+0301` to NFC → U+00E9. L1.
2. U+FF21 FULLWIDTH A to NFKC → U+0041 A; NFC leaves U+FF21. L2.
3. `U+0041 U+030A U+0301` to NFC → U+01FA `Ǻ`. L3.

**Distractors and validation.** Compose without ordering or apply compatibility in NFC. Pinned normalizer plus normalization test fixtures.

### Family `normalization_form_recognize`

**Task.** Decide which normalization forms a sequence already satisfies.

**Response and template.** Form set: `Which of NFC,NFD,NFKC,NFKD already contain {sequence} unchanged?`

**Derivation.** Normalize independently to each form and compare exact sequence.

**Difficulty.** L1 ASCII; L2 canonical composition; L3 compatibility character.

**Examples.**

1. ASCII `ABC` → unchanged by all four forms. L1.
2. U+00E9 → NFC and NFKC, but not NFD/NFKD. L2.
3. U+FB01 `ﬁ` → NFC and NFD leave it unchanged; NFKC/NFKD map to `f i`. L3.

**Distractors and validation.** Exactly one form per string. Four independent idempotence checks.

### Family `compatibility_effect`

**Task.** Predict information distinctions collapsed by NFKC/NFKD and judge suitability for a stated field.

**Response and template.** Output/safe-choice: `Apply {compat_form} to {value}; which distinction is lost?`

**Derivation.** Use compatibility mappings; compare original/output and stated application identity requirements.

**Difficulty.** L1 width; L2 ligature/circled number; L3 choose display versus comparison storage.

**Examples.**

1. U+FF11 FULLWIDTH DIGIT ONE → NFKC `1`. L1.
2. U+2460 CIRCLED DIGIT ONE → NFKC `1`, losing circled presentation distinction. L2.
3. Product codes where fullwidth and ASCII forms are contractually distinct must not silently replace stored original with NFKC output. L3.

**Distractors and validation.** Compatibility means canonical identity or always safe cleanup. Mapping plus field-policy rules.

### Family `normalized_concatenation`

**Task.** Decide whether concatenating normalized pieces remains normalized and compute corrected result.

**Response and template.** Yes/no/sequence: `{left} and {right} are each {form}; is concatenation, and if not normalize it.`

**Derivation.** Concatenate exact scalars, normalize whole result, compare.

**Difficulty.** L1 NFC composition at boundary; L2 NFD reorder; L3 safe boundary/no change.

**Examples.**

1. NFC `a` + NFC U+0302 COMBINING CIRCUMFLEX → concatenation `a◌̂` is not NFC; normalized result U+00E2 `â`. L1.
2. NFD `a U+0302(230)` + NFD `U+0323(220)` → concatenation not NFD; reorder to `a U+0323 U+0302`. L2.
3. NFC `ab` + NFC `c` → `abc`, still NFC. L3.

**Distractors and validation.** Normalized forms closed under concatenation. Concatenate/normalize equality.

### Family `normalization_scope_limit`

**Task.** Decide whether normalization performs a proposed text transformation.

**Response and template.** Yes/no plus actual mechanism: `Will {form} make {left} equal to {right}?`

**Derivation.** Normalize both; distinguish case fold, accent removal, transliteration, and confusable mapping.

**Difficulty.** L1 case; L2 accent; L3 cross-script confusable/emoji selector.

**Examples.**

1. `A` and `a` remain different under all normalization forms; case handling is separate. L1.
2. `é` does not normalize to plain `e`; its combining acute remains canonically. L2.
3. Latin a U+0061 and Cyrillic а U+0430 remain distinct under NFKC; normalization is not confusable detection. L3.

**Distractors and validation.** “Normalize” means generic cleanup. Exact four-form comparison.

### Cross-family progression

Canonical equivalence and decomposition precede combining order. Full form transformations follow, then recognition reverses them. Compatibility effects and concatenation hazards remain separate so learners do not overgeneralize normalization.

## 7. Category: Grapheme clusters and default segmentation

### Category purpose

Train cursor/display-unit reasoning beyond code points, using pinned default extended grapheme boundaries.

### Learn

An EGC may contain a base plus marks, an emoji plus modifier, a flag pair, or a ZWJ sequence. EGCs are useful default editing units, but they are not bytes and are not guaranteed to equal linguistic characters in every context.

### Prerequisites

Code-point sequences, combining marks, and pinned UAX #29 model.

### Category boundaries

Rendering is illustrative only. The bundled break-property oracle determines answers. Full line breaking, dictionary segmentation, and platform-specific cursor behavior are excluded.

### Common misconceptions

- Every code point creates a grapheme break.
- ZWJ is visible spacing.
- Every pair of regional indicators is one single flag regardless of sequence position.
- NFC is required before grapheme segmentation.
- Grapheme count is a safe storage-byte limit.

### Family `grapheme_count`

**Task.** Count EGCs in an annotated scalar sequence.

**Response and template.** Integer: `Under Unicode 17 default EGC rules, how many clusters are in {sequence}?`

**Derivation.** Apply pinned grapheme-break rules/properties.

**Difficulty.** L1 plain letters; L2 combining; L3 emoji sequence.

**Examples.**

1. `cat` →3 EGCs. L1.
2. `U+0065 U+0301` →1 EGC. L2.
3. `U+1F469 U+200D U+1F4BB` (`👩‍💻`) →1 EGC. L3.

**Distractors and validation.** Count code points or UTF-16 units. Bundled UAX #29 segmenter.

### Family `grapheme_boundaries_mark`

**Task.** Insert every EGC boundary into a short sequence.

**Response and template.** Boundary sequence: `Mark EGC boundaries in {code_points}.`

**Derivation.** Apply rules left-to-right including start/end.

**Difficulty.** L1 letters; L2 combining/CRLF; L3 mixed.

**Examples.**

1. `a b` → `|a|b|`. L1.
2. `a U+0301 b` → `|a U+0301|b|`. L2.
3. `A CR LF B` → `|A|CR LF|B|`; CR×LF forms one cluster. L3.

**Distractors and validation.** Break before every nonspacing/control code point. Break-test oracle.

### Family `emoji_cluster_structure`

**Task.** Count/identify components of modifier, variation-selector, or ZWJ emoji clusters.

**Response and template.** Counts/sequence: `For {emoji_sequence}, give code points, UTF-16 units, and EGC count.`

**Derivation.** Read pinned scalar fixture; encode/count units; segment EGC.

**Difficulty.** L1 variation selector; L2 modifier; L3 ZWJ.

**Examples.**

1. `U+2764 U+FE0F` (heart+VS16) →2 code points,2 UTF-16 units,1 EGC. L1.
2. `U+1F44D U+1F3FD` (`👍🏽`) →2 code points,4 UTF-16 units,1 EGC. L2.
3. `👩‍💻` sequence →3 code points,5 UTF-16 units,1 EGC. L3.

**Distractors and validation.** Emoji displayed as one means one code point. Fixture codec/segmenter.

### Family `regional_indicator_pairing`

**Task.** Segment a sequence of regional-indicator scalars into default EGC pairs.

**Response and template.** Boundary sequence/count: `Segment regional indicators {sequence}.`

**Derivation.** Apply UAX #29 RI parity rule left-to-right.

**Difficulty.** L1 two; L2 three; L3 four plus preceding text.

**Examples.**

1. U+1F1F8 U+1F1EA (`🇸🇪`) → one EGC. L1.
2. three RI scalars R1 R2 R3 → `|R1 R2|R3|`, two EGCs. L2.
3. `A R1 R2 R3 R4` → `|A|R1 R2|R3 R4|`, three total EGCs. L3.

**Distractors and validation.** All consecutive RIs form one cluster or overlapping pairs. Parity state oracle.

### Family `normalization_grapheme_compare`

**Task.** Compare EGC boundaries/counts across canonically equivalent NFC/NFD forms.

**Response and template.** Boundary/count comparison: `Segment {left} and {right}; compare.`

**Derivation.** Normalize/verify canonical equivalence, segment both with pinned rules.

**Difficulty.** L1 é; L2 multiple marks; L3 Hangul.

**Examples.**

1. U+00E9 and `e U+0301` each form one EGC. L1.
2. precomposed Å and `A U+030A` each form one EGC. L2.
3. Hangul U+AC01 and decomposed `U+1100 U+1161 U+11A8` each segment as one default EGC. L3.

**Distractors and validation.** More code points means more graphemes. Canonical and segmenter oracles.

### Family `safe_grapheme_slice`

**Task.** Choose a slice/truncation that preserves whole EGCs under a cluster limit or boundary list.

**Response and template.** Boundary/index/text: `Take first {n} EGCs from {sequence}; return code-point range.`

**Derivation.** Segment first, then slice at EGC boundaries; separately calculate bytes if budget also shown.

**Difficulty.** L1 plain; L2 combining; L3 emoji plus byte constraint.

**Examples.**

1. first2 EGCs of `cat` → `ca`. L1.
2. first1 EGC of `e U+0301 x` → both `e` and acute, not bare e. L2.
3. sequence `A👩‍💻B`, first2 EGCs → `A👩‍💻` (code points through laptop); UTF-8 budget must be checked separately. L3.

**Distractors and validation.** Slice by code-point/UTF-16 count. Segment then boundary slice.

### Family `default_word_boundaries`

**Task.** Mark selected default UAX #29 word boundaries or distinguish them from linguistic/tokenizer rules.

**Response and template.** Boundary/claim: `Under pinned default word-boundary rules, segment {sequence}.`

**Derivation.** Apply bundled Word_Break properties/rules; identify word-like spans per displayed extraction policy.

**Difficulty.** L1 spaces; L2 apostrophe/number punctuation; L3 script requiring tailored dictionary segmentation.

**Examples.**

1. `hello world` → word-like spans `hello`,`world`. L1.
2. ASCII `can't` remains one word-like span under the pinned default rules. L2.
3. Default boundaries alone are not promised to find natural-language words in Thai text; a scenario requiring dictionary words must use tailored segmentation. L3.

**Distractors and validation.** Split only spaces or default algorithm solves every language. Bundled word-break tests plus scope rule.

### Cross-family progression

Counting precedes boundary marking. Combining sequences precede emoji and RI state. Normalization comparison prevents code-point count from masquerading as grapheme count. Safe slicing and word-boundary scope transfer segmentation into application design.

## 8. Category: Equality, casing, search, and ordering

### Category purpose

Train explicit selection and prediction of text comparison transforms rather than relying on host-language equality or vague case-insensitivity.

### Learn

Byte equality, code-point equality, canonical equivalence, compatibility-normalized equality, case-folded equality, and locale collation answer different questions. A comparison contract must state which transforms and locale, if any, it uses.

### Prerequisites

Normalization, scalar sequences, and versioned property tables.

### Category boundaries

Only pinned default Unicode casing/folding and a few explicitly authored locale cases are computed. Full collation requires a supplied versioned collation profile; the app does not invent universal alphabetical order.

### Common misconceptions

- Visually alike text compares equal.
- NFC performs case-insensitive comparison.
- Lowercasing both sides is equivalent to full case folding.
- Case mapping is always one code point to one code point.
- Code-point order is human dictionary order.

### Family `equality_model_compare`

**Task.** Determine under which declared equality models two sequences compare equal.

**Response and template.** Model set: `Compare {left} and {right} under byte, code-point, NFC, and NFKC equality; separately state whether display similarity proves identity.`

**Derivation.** Apply each model independently; grapheme/render similarity is not an equality oracle.

**Difficulty.** L1 identical; L2 canonical alternatives; L3 compatibility/confusable.

**Examples.**

1. same UTF-8 bytes `41` and `41` → equal as bytes and code points. L1.
2. U+00E9 versus `U+0065 U+0301` → unequal code-point/UTF-8 bytes, equal after NFC/NFD. L2.
3. U+FF21 FULLWIDTH A versus ASCII A → unequal under NFC, equal under NFKC; Latin A versus Greek Α remains unequal. L3.

**Distractors and validation.** One equality definition for all. Independent transformation/equality table.

### Family `default_case_mapping`

**Task.** Apply pinned full uppercase/lowercase mapping to a short sequence.

**Response and template.** Code-point/text sequence: `Apply default full {upper_or_lower} mapping to {text}.`

**Derivation.** Use Unicode 17 full case mappings and context rules, with no locale override.

**Difficulty.** L1 ASCII; L2 expansion; L3 context-sensitive sigma.

**Examples.**

1. `Cat` uppercase → `CAT`. L1.
2. U+00DF `ß` uppercase under default full mapping → `SS` (two code points). L2.
3. Greek `ΟΣ` lowercase → `ος`, ending with final sigma U+03C2 under the pinned context rule. L3.

**Distractors and validation.** One-to-one only or Turkish locale applied by default. Pinned SpecialCasing/data oracle.

### Family `case_fold_compare`

**Task.** Compute default full case fold or decide folded equality.

**Response and template.** Folded sequence/yes-no: `Case-fold {value}` or `Do {left},{right} match after default full case folding?`

**Derivation.** Apply pinned full default CaseFolding mapping, then exact compare; normalization is a separate optional displayed step.

**Difficulty.** L1 ASCII; L2 multi-code-point fold; L3 fold plus normalization.

**Examples.**

1. `CAT` folds to `cat`. L1.
2. `Straße` and `STRASSE` both fold to `strasse`. L2.
3. U+212A KELVIN SIGN and `k` match after canonical normalization/default folding under the displayed pipeline. L3.

**Distractors and validation.** Simple lowercase only or locale-sensitive mapping. Pinned folding oracle.

### Family `locale_case_contrast`

**Task.** Contrast default and explicitly declared locale-sensitive casing.

**Response and template.** Sequence/table: `Map {text} under default and locale {locale} casing.`

**Derivation.** Use authored locale rules for supported `tr`/`az` fixtures; all other locale behavior excluded.

**Difficulty.** L1 ASCII unaffected; L2 I/i; L3 dotted/dotless sequence.

**Examples.**

1. default lowercase `I` → `i`. L1.
2. Turkish lowercase `I` → U+0131 `ı`; Turkish uppercase `i` → U+0130 `İ`. L2.
3. A username contract using locale-neutral identifiers must not silently use the device’s Turkish locale; choose the declared default/identifier folding pipeline. L3.

**Distractors and validation.** Device locale implicit or normalization handles I. Authored locale mapping table.

### Family `codepoint_order_sort`

**Task.** Sort short scalar strings by explicitly declared lexicographic code-point order.

**Response and template.** Ordered sequence: `Sort {items} by scalar-value lexicographic order.`

**Derivation.** Compare first differing scalar integer; shorter prefix sorts first.

**Difficulty.** L1 ASCII; L2 non-ASCII; L3 canonically equivalent unnormalized sequences.

**Examples.**

1. `{a,U+0041}` → `A` before `a` because 0041<0061. L1.
2. `{Z,é}` → Z before é because 005A<00E9; this is not French/Swedish collation. L2.
3. `{U+00E9, U+0065 U+0301}` → decomposed sequence starts 0065 and sorts first without normalization. L3.

**Distractors and validation.** Visual/alphabetic order or UTF-8 byte count. Scalar lexicographic oracle.

### Family `collation_contract_select`

**Task.** Choose code-point order, normalized binary order, or a supplied locale collation for a scenario.

**Response and template.** Comparison choice: `Which ordering contract matches {requirement}?`

**Derivation.** Map protocol determinism to explicit binary order; human-language display to supplied locale collation; equality separately normalized as required.

**Difficulty.** L1 protocol versus UI; L2 locale; L3 stable keys plus user-facing order.

**Examples.**

1. Canonical wire format requires platform-independent scalar order → declared code-point order. L1.
2. Swedish contact list with authored order `...Z,Å,Ä,Ö` → supplied Swedish collation profile, not code-point order. L2.
3. Database needs stable identifier key and localized display sort → store/compare declared normalized key, but sort display through selected locale collation; do not use one rule for both jobs. L3.

**Distractors and validation.** Unicode defines one natural alphabet order. Requirement matrix and authored collation fixtures.

### Family `normalized_search_pipeline`

**Task.** Apply a declared normalization/case-fold pipeline to query and corpus and identify matches.

**Response and template.** Match set: `Under pipeline {pipeline}, which entries match query {query}?`

**Derivation.** Transform both sides in specified order, then exact compare/substring over scalar sequences.

**Difficulty.** L1 NFC equality; L2 case fold; L3 NFKC risks/distinct display.

**Examples.**

1. corpus U+00E9, query `e U+0301`, NFC-both equality → match. L1.
2. corpus `Straße`, query `STRASSE`, NFC+default-fold equality → match. L2.
3. corpus has product IDs `A` and FULLWIDTH A as distinct; an NFKC search key collapses both, so prompt requiring unique exact IDs must use exact identity instead. L3.

**Distractors and validation.** Transform query only or assume safest broadest normalization. Pipeline executor plus policy check.

### Cross-family progression

Equality models precede casing. Full mappings demonstrate length change before folding. Locale contrast prevents device-locale accidents. Code-point sorting is taught as a technical order, then collation/search choose rules based on application intent.

## 9. Category: JavaScript strings and encoding APIs

### Category purpose

Train accurate prediction of browser/JavaScript string behavior and safe conversion between code-unit strings and bytes.

### Learn

JavaScript indexes UTF-16 code units. Iteration combines valid surrogate pairs into code points, but neither operation automatically segments grapheme clusters. `TextEncoder` produces UTF-8; `TextDecoder` behavior depends on its fatal/replacement mode.

### Prerequisites

UTF-8, UTF-16, scalar validity, and grapheme counting.

### Category boundaries

Only `ecmascript-text-v1` operations appear. Browser engine version quirks, regex, DOM rendering, and locale APIs are excluded.

### Common misconceptions

- `.length` counts code points or graphemes.
- Numeric indexing returns a full supplementary code point.
- `for...of` iterates grapheme clusters.
- `slice` cannot create lone surrogates.
- `\u` escape notation is UTF-8.
- TextDecoder always rejects malformed bytes.

### Family `js_string_length`

**Task.** Predict JavaScript `.length` for a declared literal scalar/code-unit sequence.

**Response and template.** Integer: `Under ecmascript-text-v1, what is {literal}.length?`

**Derivation.** Count UTF-16 code units in the JavaScript string.

**Difficulty.** L1 BMP; L2 supplementary; L3 combining/ZWJ.

**Examples.**

1. `"A".length` →1. L1.
2. `"😀".length` →2 because D83D DE00. L2.
3. `"👩‍💻".length` →5 code units, despite one EGC. L3.

**Distractors and validation.** Code-point/EGC/UTF-8 byte count. UTF-16 encoder count.

### Family `js_index_codepoint`

**Task.** Predict numeric indexing, `charCodeAt`, or `codePointAt` at a supplied code-unit offset.

**Response and template.** Hex integer/unit: `For JS string {string}, evaluate {operation} at {index}.`

**Derivation.** Use code-unit array; `codePointAt` combines only when starting at high surrogate followed by low.

**Difficulty.** L1 BMP; L2 high pair index; L3 low-surrogate index.

**Examples.**

1. `"A".charCodeAt(0)` → `0x0041`. L1.
2. `"😀".codePointAt(0)` → `0x1F600`. L2.
3. `"😀".charCodeAt(0)` → `0xD83D`; `.codePointAt(1)` → `0xDE00` because index1 starts at the low surrogate. L3.

**Distractors and validation.** All APIs return scalar or codePointAt scans backward. Code-unit API model.

### Family `js_iteration_count`

**Task.** Predict values/count from `for...of`/`Array.from` iteration.

**Response and template.** Sequence/count: `Iterate JS string {string} by for...of; what values result?`

**Derivation.** Combine well-formed surrogate pairs; yield BMP/lone-surrogate units individually; do not cluster marks/ZWJ.

**Difficulty.** L1 BMP; L2 supplementary; L3 decomposed/emoji ZWJ.

**Examples.**

1. `Array.from("AB")` → `["A","B"]`. L1.
2. `Array.from("😀").length` →1. L2.
3. `Array.from("👩‍💻").length` →3 code-point strings (woman, ZWJ, laptop), not1 EGC. L3.

**Distractors and validation.** `.length` count or EGC segmentation. Pinned iterator.

### Family `js_slice_boundary`

**Task.** Predict whether a code-unit slice is well-formed and what units it contains.

**Response and template.** Code units/well-formedness: `Evaluate {string}.slice({start},{end}).`

**Derivation.** Slice code-unit array exactly; validate surrogate sequence afterward.

**Difficulty.** L1 BMP; L2 split pair; L3 offset through mixed string.

**Examples.**

1. `"AB".slice(0,1)` →`A`, well-formed. L1.
2. `"😀".slice(0,1)` → lone high surrogate D83D, ill-formed Unicode scalar string. L2.
3. `"A😀B".slice(1,3)` → full D83D DE00 pair (`😀`); slice(2,3) would be lone low DE00. L3.

**Distractors and validation.** Slice adjusts to code points automatically. Code-unit slicing/validator.

### Family `js_escape_interpret`

**Task.** Interpret JavaScript escape sequences as code units/scalars and distinguish escapes from encoded bytes.

**Response and template.** Code-point/code-unit sequence: `What string does JS literal {escape_literal} contain?`

**Derivation.** Parse `\uXXXX` as one code unit and `\u{...}` as code point syntax; adjacent surrogate escapes may form a well-formed pair.

**Difficulty.** L1 BMP; L2 code-point escape; L3 surrogate escapes/equality.

**Examples.**

1. `"\u00E9"` contains U+00E9 and one UTF-16 unit. L1.
2. `"\u{1F600}"` contains U+1F600 stored as D83D DE00. L2.
3. `"\uD83D\uDE00"` and `"\u{1F600}"` create equal JavaScript code-unit strings; neither notation is a UTF-8 byte sequence. L3.

**Distractors and validation.** Literal backslash text or UTF-8 bytes F0... as units. Constrained literal parser.

### Family `textencoder_result`

**Task.** Predict `TextEncoder` UTF-8 bytes for a well-formed or declared ill-formed JS string.

**Response and template.** Byte sequence: `TextEncoder.encode({js_string}) produces what bytes?`

**Derivation.** Convert well-formed pairs/BMP to scalars; replace each modeled lone surrogate with U+FFFD; UTF-8 encode.

**Difficulty.** L1 ASCII; L2 BMP/supplementary; L3 lone surrogate.

**Examples.**

1. encode `"A"` → `41`. L1.
2. encode `"é"` → `C3 A9`; encode `"e\u0301"` → `65 CC 81`. L2.
3. encode a JS string containing lone high surrogate D800 → replacement U+FFFD bytes `EF BF BD`. L3.

**Distractors and validation.** UTF-16 byte serialization or preserve surrogate in UTF-8. API fixture plus independent codec.

### Family `textdecoder_result`

**Task.** Predict strict/fatal or replacement UTF-8 TextDecoder outcome.

**Response and template.** Scalar sequence/reject: `Decode bytes {bytes} with TextDecoder options {options}.`

**Derivation.** Use pinned API decoder fixtures; fatal rejects on error, nonfatal applies declared replacement behavior.

**Difficulty.** L1 valid; L2 single invalid byte; L3 malformed subsequence and continuation.

**Examples.**

1. fatal UTF-8 decoder on `C3 A9` → U+00E9. L1.
2. fatal decoder on `80` → reject/error. L2.
3. nonfatal decoder on single byte `80` → U+FFFD; the prompt does not generalize replacement count to arbitrary malformed sequences. L3.

**Distractors and validation.** Return byte U+0080 or silently omit. Pinned API fixtures.

### Family `js_index_unit_convert`

**Task.** Convert among code-unit, code-point, and EGC boundary indices for a supplied string.

**Response and template.** Boundary map: `For {string}, map {source_index} from {source_unit} to {target_unit}.`

**Derivation.** Build code-unit offsets per scalar, then pinned EGC boundaries; reject indices inside a larger unit when exact boundary is required.

**Difficulty.** L1 ASCII; L2 supplementary; L3 combining/ZWJ.

**Examples.**

1. `ABC`: code-unit offset2 equals code-point/EGC boundary2. L1.
2. `A😀B`: code-point boundaries map to code-unit offsets `{0,1,3,4}`; offset2 is inside emoji pair. L2.
3. `e U+0301 x`: code-point offset1 is inside first EGC and cannot be converted to an exact EGC boundary. L3.

**Distractors and validation.** Same numeric index in every unit. Codec+segment boundary tables.

### Cross-family progression

`.length` and indexing establish code-unit behavior. Iteration contrasts code points, then slicing exposes ill-formed strings. Escapes precede byte APIs. Index conversion is a capstone linking JavaScript offsets to user-facing segmentation.

## 10. Category: Practical text pipelines, limits, and security

### Category purpose

Train diagnosis and design decisions across decoding, normalization, storage, display, and security boundaries.

### Learn

Every byte/text boundary needs an encoding and error policy. Every comparison/index/limit needs a unit. Visual output may be affected by fonts, shaping, controls, or confusables without changing underlying code points.

### Prerequisites

All preceding categories.

### Category boundaries

Security families identify risks and safer contracts; they do not promise a universal identifier sanitizer or implement full bidi/confusable review.

### Common misconceptions

- A font can fix wrong decoding.
- UTF-8 validation proves content is safe/appropriate.
- Replacing invalid bytes is lossless.
- Byte truncation at any offset is safe.
- Removing every invisible/combining code point is harmless.
- Confusable skeleton equality proves two identifiers are the same or malicious.

### Family `text_pipeline_trace`

**Task.** Trace bytes/scalars through a fully declared decode-normalize-transform-encode pipeline.

**Response and template.** Ordered intermediate states: `Apply pipeline {steps} to {input}.`

**Derivation.** Execute each typed step in order; reject when strict stage fails; never normalize undecoded bytes.

**Difficulty.** L1 decode+encode; L2 normalize; L3 case fold/target representability.

**Examples.**

1. UTF-8 `C3 A9` → decode U+00E9 → encode UTF-16BE `00 E9`. L1.
2. UTF-8 `65 CC 81` → decode `e U+0301` → NFC U+00E9 → UTF-8 `C3 A9`. L2.
3. Windows-1252 `DF` → ß → default fold `ss` → ASCII `73 73`. L3.

**Distractors and validation.** Normalize bytes or encode before decode. Typed pipeline executor.

### Family `fault_layer_diagnose`

**Task.** Identify the most direct failed layer from supplied bytes, scalars, glyph evidence, and contract.

**Response and template.** Layer/cause: `Given {observations}, which displayed cause explains them?`

**Derivation.** Compare expected/actual at byte decode, normalization/equality, segmentation, and glyph coverage layers.

**Difficulty.** L1 invalid bytes; L2 mojibake versus missing glyph; L3 same display/different identity.

**Examples.**

1. strict UTF-8 input contains lone `80` → byte-decoding validity failure. L1.
2. scalars are correct U+4E2D but UI shows a tofu box → likely font glyph coverage, not UTF-8 decoding. L2.
3. login mismatch shows U+00E9 versus `e U+0301`, both render alike → comparison/normalization contract issue. L3.

**Distractors and validation.** Blame font for mojibake or re-encode correct scalars. Generated single-fault causal model.

### Family `encoding_contract_audit`

**Task.** Find missing/unsafe fields in a storage/protocol text contract.

**Response and template.** Issue set/corrected contract: `Audit {contract} for encoding, errors, normalization, length, and comparison.`

**Derivation.** Require named encoding at byte boundary, error policy, unit for limits/offsets, and independent comparison/display policy where relevant.

**Difficulty.** L1 missing encoding; L2 missing unit/error policy; L3 normalization/version/round-trip needs.

**Examples.**

1. field says “text bytes” with no charset → incomplete; specify UTF-8 (or another named encoding). L1.
2. limit “20 characters” → incomplete; choose bytes/code points/EGCs and also state decode errors. L2.
3. identifier record needs exact original display plus NFC+fold search key → store original scalars and a versioned derived key; do not overwrite original without contract. L3.

**Distractors and validation.** “Unicode” alone names byte encoding or one length covers storage/UI. Contract requirement bitset.

### Family `roundtrip_loss_analyze`

**Task.** Determine whether a conversion pipeline is lossless and identify the first irreversible stage.

**Response and template.** Yes/no plus stage: `Does {pipeline} round-trip every shown input?`

**Derivation.** Test injectivity/representability/replacement at each stage and compare recovered scalar sequence.

**Difficulty.** L1 UTF round trip; L2 legacy representability; L3 normalization/case fold collapse.

**Examples.**

1. scalar `é` → UTF-8 → strict UTF-8 decode → same scalar; lossless. L1.
2. `€` → ASCII with `?` substitution → `?`; original cannot be recovered. L2.
3. FULLWIDTH A → NFKC A → store → cannot distinguish original fullwidth from ASCII A; compatibility normalization is first lossy-for-identity stage. L3.

**Distractors and validation.** Every reversible codec implies every transform reversible. Pipeline equivalence/injectivity flags.

### Family `safe_text_truncate`

**Task.** Select the longest prefix satisfying byte and/or EGC limits without malformed encoding/partial cluster.

**Response and template.** Prefix/counts: `Truncate {text} to ≤{byte_limit} UTF-8 bytes and ≤{egc_limit} EGCs.`

**Derivation.** Segment into EGCs, encode cumulative whole clusters, stop before either limit.

**Difficulty.** L1 ASCII; L2 multibyte; L3 combining/emoji plus dual limits.

**Examples.**

1. `cat`, byte limit2 → `ca`. L1.
2. `A€B`, UTF-8 byte limit4 → `A€` exactly4 bytes. L2.
3. `A👩‍💻B`, EGC limit2 and UTF-8 byte limit12 → `A👩‍💻` uses2 EGCs and12 bytes; adding B exceeds EGC limit. L3.

**Distractors and validation.** Cut raw byte count or code points. Segment+encode cumulative oracle.

### Family `invisible_control_audit`

**Task.** Reveal and classify invisible/default-ignorable controls in a scalar sequence and decide handling under a stated field policy.

**Response and template.** Annotated sequence/action: `Audit {code_points} for {field_type}.`

**Derivation.** Look up pinned properties; distinguish meaningful ZWJ/variation use from prohibited control in a constrained identifier policy.

**Difficulty.** L1 zero-width space; L2 ZWJ emoji; L3 bidi override in code identifier.

**Examples.**

1. `ab U+200B cd` contains ZERO WIDTH SPACE between b/c; escaped display reveals it. L1.
2. U+200D in `👩‍💻` participates in a meaningful emoji ZWJ sequence; “delete all invisible code points” would change it. L2.
3. source identifier contains U+202E RIGHT-TO-LEFT OVERRIDE under a policy forbidding bidi controls → reject/flag while preserving escaped evidence. L3.

**Distractors and validation.** Invisible=whitespace/delete all. Pinned property+field policy table.

### Family `confusable_identifier_audit`

**Task.** Compare generated identifier scalars/scripts/confusable skeleton evidence under a stated policy.

**Response and template.** Distinct/flag/action: `Audit identifiers {left},{right} under {policy}.`

**Derivation.** Exact compare; script/profile checks; optional pinned confusable skeleton as warning evidence; never equate skeleton with identity.

**Difficulty.** L1 exact; L2 cross-script confusable; L3 legitimate mixed-script policy exception.

**Examples.**

1. Latin `pay` and identical scalar sequence `pay` → exact same identifier. L1.
2. Latin `pay` versus `pаy` whose middle letter is Cyrillic U+0430 → exact distinct, visually confusable; flag under the displayed Latin-only identifier policy. L2.
3. A reviewed policy allows Japanese identifiers mixing Han, Hiragana, and Katakana; do not reject merely for multiple Unicode scripts when profile explicitly permits them. L3.

**Distractors and validation.** Same glyph/skeleton=equal or all mixed script malicious. Exact/script/profile/confusable oracles.

### Cross-family progression

Pipeline tracing precedes diagnosis. Contract audits make every layer explicit. Round-trip loss and truncation apply those contracts. Invisible/confusable work comes last and always separates identity, display, warning evidence, and field-specific policy.

## 11. Topic-wide progression

Recommended order:

1. bytes, code units, code points, scalar validity, graphemes, and glyphs;
2. notation/ranges and counting the same text in several units;
3. UTF-8 length, encode/decode, bit payload, validity, and boundaries;
4. UTF-16 BMP units, surrogate pairs, validation, and endian bytes;
5. UTF-32/BOMs and comparative storage;
6. ASCII/legacy tables, representability, transcoding, mojibake, and detection limits;
7. canonical equivalence, decomposition, combining order, and NFC/NFD;
8. compatibility normalization, form recognition, and concatenation hazards;
9. grapheme boundaries, emoji/RI structures, safe slicing, and word-boundary scope;
10. equality models, full case mapping/folding, locale contrasts, ordering, and search;
11. JavaScript length/indexing/iteration/slicing, escapes, and encoder/decoder APIs;
12. pipeline diagnosis, contracts, round-trip loss, truncation, and identifier/display risks.

Prerequisite gates:

- named unit mastery gates every length/index question;
- scalar validity gates UTF encoding;
- UTF-8 valid encoding gates malformed-sequence diagnosis;
- surrogate formula/validation gates JavaScript code-unit behavior;
- explicit source encoding gates transcoding/mojibake;
- canonical decomposition and combining class gates normalization;
- normalization gates normalized comparison/search;
- EGC boundary mastery gates safe user-facing slicing;
- exact identity gates confusable/invisible audits;
- encoding/error/unit contracts gate practical pipeline diagnosis.

Interleave:

- the same scalar in UTF-8/16/32;
- encode and decode directions;
- valid boundary values and adjacent invalid values;
- composed/decomposed canonical pairs;
- code-point and grapheme counts for the same display;
- byte equality and normalized equality;
- default and locale-sensitive casing;
- JavaScript code-unit length and code-point iteration;
- reversible mojibake and irreversible replacement;
- exact identifier inequality and visual/confusable evidence.

Limit one prompt to:

- at most 8 scalars or 16 bytes at Levels 1–3;
- at most 16 scalars or 32 bytes at Levels 4–5;
- at most 4 combining marks;
- at most 2 complex EGCs;
- one declared encoding-error policy;
- at most three pipeline transformations.

## 12. Adaptive practice guidance

Track:

`family`, `unit`, `representation`, `scalarRange`, `encoding`, `byteLength`, `validityFailure`, `endian`, `bomPolicy`, `legacyTable`, `normalizationForm`, `equivalenceType`, `combiningClassPattern`, `graphemeStructure`, `caseModel`, `locale`, `apiOperation`, `pipelineLayer`, `lossType`, `securityProperty`, `misconception`, and `difficultyDimension`.

| Error pattern | Likely misconception | Follow-up |
|---|---|---|
| says emoji is one byte/unit/code point | visible unit collapsed with storage | multi-count table for same emoji |
| calls D800 a scalar | code point/scalar conflation | surrogate/private/noncharacter contrast |
| UTF-8 length follows UTF-16 | encoding units conflated | same scalar storage comparison |
| accepts continuation byte first | no UTF-8 state model | lead/continuation classification |
| accepts C0 AF | shape-only validation | shortest-form boundary pair |
| UTF-8 encodes D800 | surrogate exclusion forgotten | D7FF/D800/E000 contrast |
| reverses surrogate order in LE | endian reverses sequence | per-unit byte serialization |
| reads D83D as emoji alone | code unit=scaler | pair decode scaffold |
| treats FE FF anywhere as BOM | position/policy omitted | initial versus midstream U+FEFF |
| copies bytes when transcoding | decode/encode bridge omitted | explicit scalar intermediate |
| Latin-1 80=€ | Windows-1252 conflation | side-by-side table |
| mojibake blamed on font | wrong-decode layer omitted | bytes→wrong scalars trace |
| claims repaired after U+FFFD | replacement loss ignored | invertible/noninvertible pipelines |
| identifies encoding from ASCII | compatibility=provenance | candidate decoder set |
| calls ﬁ/f i canonically equal | compatibility/canonical conflation | NFD versus NFKD |
| NFC removes accents/case | normalization as cleanup | scope-limit contrasts |
| sorts combining marks by code point | CCC/order rule missing | shown CCC stable sort |
| assumes normalized concat normalized | closure mistake | boundary composition/reordering |
| counts combining mark as new grapheme | code point=EGC | boundary marking |
| for...of count equals graphemes | code-point iteration=segmentation | ZWJ sequence comparison |
| every RI pairs with neighbors | overlapping rather than parity pairs | 3/4 RI trace |
| lowercasing equals case folding | simple mapping/fold conflation | ß expansion |
| code-point sort called alphabetical | technical order=collation | protocol/UI rule selection |
| JS `.length` counts code points | UTF-16 model omitted | A/emoji/ZWJ length set |
| JS slice preserves scalars | code-unit boundary omitted | high/low split |
| `\u` called UTF-8 | syntax/encoding conflation | escape→units→TextEncoder |
| truncates raw byte limit | encoding boundary omitted | cumulative whole-scalar/EGC prefix |
| strips every invisible | property=context omitted | ZWJ emoji versus bidi control |
| confusable means identical | display/evidence=identity | exact code-point chips |

Selection after sufficient history:

- 30% weakest family/misconception;
- 20% spaced mastered material;
- 15% inverse encode/decode or missing representation;
- 15% unit transfer on a familiar string;
- 10% validity/error-policy diagnostics;
- 10% practical pipeline/design choice.

Slow but correct bit arithmetic should receive payload scaffolds without reducing conceptual level. A learner who knows UTF-8 but fails only code-unit indexing should receive JavaScript-unit contrasts, not more UTF-8 arithmetic.

When a mixed pipeline answer fails, diagnose in this order:

1. identify current data type: bytes, units, or scalars;
2. apply strict validity/declared decoding;
3. apply normalization/casing only to scalars;
4. segment/index in the named unit;
5. encode to target bytes;
6. assess information loss.

## 13. Feedback and worked solutions

Worked solutions should:

1. name every unit and encoding;
2. show scalar values before bytes/code units;
3. align UTF payload bits only when arithmetic is the skill;
4. point to the first invalid byte/unit and exact rule;
5. show decode→scalar→encode for transcoding;
6. list decomposition and CCC order before composition;
7. mark grapheme boundaries on code-point chips;
8. separate exact identity, normalized equality, and visual similarity;
9. state the error/replacement/locale/version policy;
10. identify the first irreversible pipeline stage.

Diagnostic examples:

> `😀` is one code point but two UTF-16 code units (`D83D DE00`). JavaScript `.length` therefore returns 2.

> `80` begins with `10`, so it can continue a UTF-8 sequence but cannot start one. Strict decoding rejects it.

> Little endian reverses the two bytes inside each UTF-16 unit. It does not put the low surrogate before the high surrogate.

> These bytes were decoded as Windows-1252 before the text became `Ã©`. Changing the font cannot turn the wrong scalar sequence back into `é`.

> NFC compares `U+00E9` and `U+0065 U+0301` through canonical equivalence. Their original code-point sequences and UTF-8 bytes are still different.

> The acute accent is a second code point, but UAX #29 keeps it in the same grapheme cluster as `e`.

> Your answer matches code-point iteration. `for...of` sees woman, ZWJ, and laptop as three code points; grapheme segmentation joins them into one EGC.

> `U+FFFD` tells us decoding replacement occurred. It does not record which invalid bytes were replaced, so exact recovery is unavailable.

Correct feedback should confirm the decisive representation/rule. Incorrect feedback should identify the alternative count/codec/normalization that produced the answer when recognizable.

## 14. Rendering, interaction, and accessibility

- Every literal string has an adjacent expandable code-point/byte/unit representation.
- Invisible controls and combining marks never appear as the only answer cue.
- Combining marks use dotted circles only in presentation; explanations say the dotted circle is not stored.
- EGC boundaries render as structured boxes and accessible boundary lists.
- Byte/code-unit groups align visually and expose individual accessible labels.
- Ill-formed UTF-16 values are created/stored as integer arrays, not pasted as fragile source literals.
- Bidi controls are shown as escaped chips inside isolated containers; generated controls must not reorder the surrounding UI.
- Confusable examples label script and code point even when glyphs look identical.
- Missing-glyph/tofu visuals are illustrative SVG boxes, not dependent on the learner’s installed font.
- Font styling is never the only distinction between sequences.
- Color is not the sole cue for lead/continuation bytes, surrogate halves, combining classes, breaks, invalid data, or lossy steps.
- Screen readers receive names such as `U plus 0301 combining acute accent`, while response fields retain the numeric value.
- Literal copy/paste exercises reveal normalization/invisible transformations and never silently change pasted text.
- A font fallback may render examples, but grading uses stored scalar sequences.

## 15. Generator and implementation requirements

### Internal data types

Use distinct types:

```text
ByteSequence        := uint8[]
CodeUnit16Sequence  := uint16[]
CodeUnit32Sequence  := uint32[]
ScalarSequence      := uint32[] where every value is scalar
CodePointSequence   := uint32[] where surrogate values may appear only in diagnostic contexts
BoundarySequence    := integer offsets into a declared unit
```

Do not use a JavaScript string as the sole oracle representation:

- it cannot distinguish intended abstract scalar model from ill-formed UTF-16 without checks;
- native normalization/segmentation Unicode versions are not reliably exposed;
- literal rendering can hide controls or normalization differences.

### Bundled Unicode data

Build a versioned local artifact from Unicode 17.0.0 data containing:

- assignment, general-category, script, private-use, noncharacter, and relevant default-ignorable properties;
- canonical/compatibility decomposition mappings;
- canonical combining classes;
- composition pairs/exclusions;
- Hangul algorithm constants;
- normalization quick-check/test fixtures;
- grapheme/word break properties and conformance fixtures;
- full default case mappings, SpecialCasing subset, and CaseFolding mappings;
- explicitly supported locale casing;
- curated emoji/ZWJ/variation fixtures;
- the bounded confusable/script-profile data required by generated security families.

Store source filenames, checksums, Unicode license/provenance, generation script version, and model ID. Runtime requires no network.

### Codec implementations

Implement independent:

- strict UTF-8 encode/decode and boundary scanner;
- `replace-v1` maximal-invalid-subsequence oracle;
- strict UTF-16 scalar/code-unit conversion;
- UTF-16/32 endian serializers and BOM-policy wrappers;
- strict UTF-32 validation;
- ASCII/ISO-8859-1/Windows-1252 tables and inverse tables;
- typed transcoding pipeline;
- scalar/code-unit/byte offset maps.

Native `TextEncoder`/`TextDecoder` may validate API-specific families after startup self-tests, but the abstract codec’s expected answer remains available independently.

### Normalization and segmentation

The answer oracle must use pinned data/algorithms or precomputed conformance-backed fixtures. `String.prototype.normalize()` and `Intl.Segmenter` may be acceleration paths only if:

- startup fixtures prove all enabled generated cases match;
- the implementation can fall back to the pinned oracle;
- model metadata still says Unicode 17.0.0, not “whatever the browser uses.”

Generate normalization exercises backward from known decomposition/composition/equivalence classes. Generate segmentation exercises from rule-tagged structures rather than arbitrary emoji strings.

### Text display safety

- Escape HTML markup and control characters.
- Wrap direction-sensitive examples in isolation and render logical code-point order separately.
- Never allow generated text to alter page direction, hide labels, create markup, or make answer choices visually empty without an explicit placeholder.
- Keep original scalar arrays even when a transformed/search key is derived.

### Controlled parsers

Support:

- code point tokens `U+XXXX`, `0xXXXX`, or bare hex in typed fields;
- fixed-width byte/unit sequences;
- structured boundary insertion;
- exact form/property choices;
- constrained JavaScript escape literals only.

Do not evaluate JavaScript source or rely on `eval`.

### Rejection rules

Reject instances with:

- answer dependent solely on a particular font glyph;
- unspecified encoding, endian, BOM, locale, unit, Unicode version, or error policy;
- malformed-sequence replacement whose count differs across allowed decoders;
- a distractor equal to the answer after the family’s accepted normalization/folding;
- combining/emoji sequence absent from pinned property/fixture data;
- normalization form with no pedagogically visible/structural distinction unless identity is the point;
- giant arithmetic unrelated to the encoding rule;
- confusable/security question with no explicit field profile;
- implied certainty from charset detection;
- irrecoverable data presented as exactly repairable;
- code-point names or literal source text inconsistent with stored integers.

## 16. Automated validation

For every instance:

- all code point integers are in declared range and scalar-only fields exclude surrogates;
- displayed names/properties match Unicode 17.0.0;
- fixed-width hex formatting and unit counts are exact;
- UTF-8/16/32 valid encodings round-trip;
- malformed fixtures fail for exactly the displayed reason/location;
- UTF-8 uses shortest form and safe offsets fall only between sequences;
- endian serialization reverses bytes per unit, not unit order;
- BOM handling matches start-position and policy;
- legacy decoders/encoders match pinned tables;
- transcoding equals strict decode then strict encode;
- mojibake/repair pipelines reproduce the displayed scalar sequence and loss flags;
- normalization output is normalized, equivalent under the correct relation, and idempotent;
- combining marks are canonically ordered within starter segments;
- NFC/NFKC composition respects exclusions;
- normalization-form recognition checks all four independently;
- EGC/word boundaries match pinned conformance data;
- JavaScript code-unit/API answers match `ecmascript-text-v1`;
- code-unit/code-point/EGC offset maps are mutually consistent at valid boundaries;
- case mappings/folds and supported locale cases match pinned data;
- pipeline outputs carry correct intermediate data types;
- truncation returns the longest whole permitted prefix and satisfies every limit;
- confusable/invisible answers separate exact identity from policy/warning evidence;
- every multiple-choice family has exactly one correct/best answer;
- distractors are distinct after the family’s comparison rules and tagged with a misconception.

Conformance/property minimums:

- exhaustive UTF-8/16/32 round trips for all scalar values at build/test time;
- exhaustive rejection classes for surrogates/out-of-range/overlong UTF encodings;
- every Unicode 17.0.0 `NormalizationTest.txt` case;
- all supported canonical-composition/Hangul boundary cases;
- every Unicode 17.0.0 `GraphemeBreakTest.txt` case;
- every enabled `WordBreakTest.txt` case;
- every pinned CaseFolding/SpecialCasing mapping used by generation;
- all 256 byte values through each legacy decoder and inverse round trip where defined;
- 100,000 mixed scalar-sequence codec/count/boundary cases;
- 100,000 normalization/equality/concatenation cases;
- 100,000 JavaScript unit/index/slice/encoder/decoder cases;
- 50,000 transcoding/mojibake/loss pipelines;
- 50,000 practical contract/truncation/security-policy scenarios.

Seeded generation must reproduce integer sequences, rendered aids, answer, distractor provenance, and solution. Updating Unicode data or API behavior requires a new model ID and migration audit.

## 17. Coverage requirements

Balance:

- bytes, UTF-8/16/32 code units, code points, scalars, EGCs, and glyph claims;
- ASCII, BMP non-ASCII, supplementary, surrogate, private-use, unassigned, and noncharacter values;
- UTF-8 1/2/3/4-byte lengths and every boundary transition;
- valid and malformed continuation, truncation, overlong, surrogate, and out-of-range UTF-8;
- BMP/surrogate pair/lone/reversed UTF-16 and both byte orders;
- UTF-8/16/32 BOM consume/preserve/missing/midstream cases;
- shared/differing bytes across ASCII, ISO-8859-1, and Windows-1252;
- successful/unrepresentable transcoding;
- one-stage/repeated mojibake, reversible and replacement-loss cases;
- canonical and compatibility decompositions;
- NFC/NFD/NFKC/NFKD unchanged/changed cases;
- combining classes equal/unequal, multiple starters, and concatenation boundaries;
- plain, combining, Hangul, variation, modifier, ZWJ, RI, and CRLF EGC structures;
- byte/code-point/normalized/folded/locale comparison;
- full mapping expansion and context-sensitive casing;
- JavaScript BMP/supplementary/combining/ZWJ/ill-formed strings;
- exact, lossy, malformed, and font/display pipeline faults;
- byte/EGC dual truncation limits;
- meaningful invisible code points and prohibited controls under explicit profiles;
- same-script/cross-script/allowed-mixed-script identifier scenarios.

Within a session:

- suppress exact sequence repeats for at least 100 items;
- suppress structurally equivalent patterns for at least 20 items;
- avoid more than two consecutive raw encoding arithmetic questions;
- include a unit-identification/count transfer after every four advanced questions;
- do not let Latin accented examples exceed 40% of normalization practice;
- include non-Latin and emoji structures regularly without turning the app into symbol trivia;
- include invalid/reject cases around 25% after validation unlock;
- pair compatibility normalization with a data-loss/scope question at least once per six normalization items;
- pair confusable warnings with exact-identity questions so warnings are not mistaken for equality.

## 18. Topic-level quality checklist

- [ ] Unicode, annex, API, and data versions are pinned.
- [ ] “Character” is qualified as byte/unit/code point/scalar/EGC/glyph where relevant.
- [ ] Surrogates are code points but not Unicode scalar values.
- [ ] Assigned, private-use, unassigned, and noncharacter properties remain distinct.
- [ ] UTF-8 enforces shortest form, scalar range, and complete continuations.
- [ ] UTF-16 surrogate order remains high then low in both endiannesses.
- [ ] Endianness reverses bytes within units, not text/code-unit order.
- [ ] BOM handling is explicit and position-sensitive.
- [ ] Legacy encodings are named; “ANSI” is not used as an oracle.
- [ ] Transcoding always decodes to scalars before encoding.
- [ ] Mojibake and replacement loss are diagnosed at the correct layer.
- [ ] Charset detection is never presented as certain without an external contract.
- [ ] Canonical and compatibility equivalence remain distinct.
- [ ] NFC/NFD/NFKC/NFKD follow pinned data and are idempotent.
- [ ] Normalization is not case fold, accent stripping, transliteration, or confusable detection.
- [ ] Concatenation of normalized pieces is not assumed normalized.
- [ ] Grapheme clusters use pinned UAX #29 boundaries.
- [ ] EGCs are described as default practical units, not universal linguistic truth.
- [ ] Case mapping may expand and locale rules are explicit.
- [ ] Code-point order is not called universal alphabetical order.
- [ ] JavaScript length/index/slice are UTF-16 code-unit based.
- [ ] Native browser Unicode behavior is not an unversioned answer oracle.
- [ ] Byte/EGC truncation preserves complete encoded scalars/clusters.
- [ ] Invisible/confusable policies preserve evidence and avoid overclaiming intent.
- [ ] Every family has three fully instantiated examples.
- [ ] Every family defines task, response, derivation, difficulty, distractors, and validation.
- [ ] Difficulty grows through layer interaction, not long dumps/trivia.
- [ ] Runtime works offline with bundled versioned data.
- [ ] Repeated practice improves real debugging and text-contract decisions.

## 19. Normative references for the model

- Unicode Standard 17.0.0: `https://www.unicode.org/versions/Unicode17.0.0/`
- UAX #15, Unicode Normalization Forms, revision 57: `https://www.unicode.org/reports/tr15/tr15-57.html`
- UAX #29, Unicode Text Segmentation, Unicode 17.0.0 edition: `https://www.unicode.org/reports/tr29/`
- Unicode Character Database 17.0.0: `https://www.unicode.org/Public/17.0.0/ucd/`
- UTS #39, Unicode Security Mechanisms: `https://www.unicode.org/reports/tr39/`

The build artifact records exact downloaded files/checksums. “Latest” URLs are documentation aids only and never determine saved question semantics.

## 20. Stable navigation

1. `units` — Text Units & Identity
2. `utf8` — UTF-8
3. `utf16-32` — UTF-16, UTF-32 & Endianness
4. `legacy` — Legacy Encodings & Mojibake
5. `normalization` — Normalization & Equivalence
6. `segmentation` — Grapheme Clusters & Segmentation
7. `comparison` — Equality, Casing & Search
8. `javascript` — JavaScript Text APIs
9. `practical` — Pipelines, Limits & Security

Family identifiers are stable persistence/analytics keys and must not be translated or silently repurposed.
