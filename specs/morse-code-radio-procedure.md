# Morse Code and Radio Procedure — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, Morse encoder/decoder, deterministic audio renderer, keying analyzer, procedure-state simulator, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Morse Code and Radio Procedure

### Topic goal

Develop reliable Morse recognition and production together with the compact procedural reasoning used in a controlled radio-style exchange. The learner should become able to:

- recognize letters, digits, selected punctuation, and procedural signs by sound rather than by counting visual dots and dashes;
- send well-proportioned marks and spaces with a keyboard, pointer, or touch key;
- move between words per minute, element duration, character spacing, and Farnsworth effective speed;
- copy groups, words, callsigns, signal reports, and short structured messages under progressively less ideal audio;
- distinguish a prosign sent as one continuous pattern from an ordinary sequence of letters;
- identify caller, called station, sender, invitation to transmit, restricted invitation, separator, wait, and close signals;
- conduct small generated call-and-response exchanges using a declared teaching profile;
- read and construct `RS` and `RST` reports without treating their subjective scales as precision instruments;
- use a small, explicitly defined set of Q signals and phonetic spellings in realistic repair scenarios;
- detect timing, transcription, identification, and turn-taking errors;
- react appropriately to a training example of `SOS` without using distress traffic as ordinary drill filler.

The app should make Morse an audible, rhythmic language. A learner may use visual patterns as an introduction, but advanced progress must come from copying and sending audio.

### Position within Practice Lab

- **Programmer Low-Level Numeracy** owns binary representation and bit arithmetic. Morse marks are timed symbols, not binary digits.
- **Signals and Systems** owns general signal analysis, spectra, filtering, and modulation. This app uses an audible keyed tone and simple impairments only to train copying.
- **Networking and Protocols** owns layered digital protocols. This app models a human procedure state machine rather than a packet protocol.
- **Music Practice** may also generate timed audio. This app requires exact mark/gap schedules and keying analysis, not pitch or musical rhythm training.
- **Japanese/Chinese/Korean Language** own their writing systems. International Morse in this version uses the Latin-letter repertoire specified below.

### Audience and prerequisites

The audience ranges from a complete Morse beginner to an operator rehearsing accurate copy and clean procedure.

No radio licence, transmitter, receiver, electronics knowledge, or prior callsign knowledge is assumed. The learner should be comfortable with:

- Latin letters and Arabic digits;
- simple ratios and multiplication;
- typing short strings.

The Learn cards introduce every procedural abbreviation before it is graded without scaffolding.

### Standards and teaching profiles

The immutable character and basic timing profile is:

```text
itu-international-morse-m1677-1
```

It follows [ITU-R M.1677-1, International Morse code](https://www.itu.int/rec/R-REC-M.1677-1-200910-I/en) for the international alphabet, selected punctuation and procedural patterns, and the `1:3`, `1:3`, `1:7` timing relationships.

The initial operating profile is:

```text
amateur-cw-practice-v1
```

It is a deliberately small teaching convention informed by the ITU calling sequence, [ARRL operating aids](https://www.arrl.org/quick-reference-operating-aids-copy), and the [IARU guide to operating practice](https://www.iaru.org/on-the-air/code-of-conduct/). It is **not** a universal procedure for amateur, maritime, aviation, military, public-safety, or commercial radio. A prompt must name the profile when the answer depends on procedure rather than on Morse encoding.

Jurisdiction-specific licence conditions, band plans, identification intervals, frequency privileges, and emergency instructions are not encoded in this profile. They change by service, country, and date; actual call-sign formation and allocation belong to the [ITU Radio Regulations Article 19 and administration data](https://www.itu.int/en/ITU-R/terrestrial/fmd/Pages/identifications.aspx), not to this practice grammar. The app generates audible practice tones only; it neither transmits radio frequency energy nor controls a transmitter.

Profile and table IDs must be saved with a question. A later standards or pedagogy change must not silently change an old answer.

### International Morse character contract

Canonical text is upper-case Unicode ASCII for `A`–`Z` and `0`–`9`. A dot is `.`, a dash is `-`, elements within one character have no separator in stored patterns, characters are separated by one ASCII space in display form, and words by ` / `.

```text
A .-      B -...    C -.-.    D -..     E .
F ..-.    G --.     H ....    I ..      J .---
K -.-     L .-..    M --      N -.      O ---
P .--.    Q --.-    R .-.     S ...     T -
U ..-     V ...-    W .--     X -..-    Y -.--
Z --..

0 -----   1 .----   2 ..---   3 ...--   4 ....-
5 .....   6 -....   7 --...   8 ---..   9 ----.
```

Initial punctuation:

```text
.  .-.-.-     ,  --..--     :  ---...
?  ..--..     '  .----.     -  -....-
/  -..-.      (  -.--.      )  -.--.-
"  .-..-.     =  -...-      +  .-.-.
@  .--.-.
```

The generator must use one authoritative data table. Display, encoding, decoding, audio, distractors, and tests must all derive from it. Ambiguous localized punctuation names affect labels only, never patterns.

### Prosign and procedural-token contract

A prosign is a semantic token whose component letters, if any, are sent without the ordinary three-unit inter-character gap. UI notation encloses it in angle brackets, such as `<SK>`. Angle brackets are notation and are not transmitted.

The first profile supports:

| Token | Pattern | Meaning in this profile |
|---|---:|---|
| `<CT>` | `-.-.-` | starting signal |
| `<BT>` | `-...-` | separator or new section |
| `<AS>` | `.-...` | wait |
| `<AR>` | `.-.-.` | end of message/transmission |
| `<K>` | `-.-` | invitation to any station to transmit |
| `<KN>` | `-.--.` | invitation only to the named station |
| `<SK>` | `...-.-` | end of contact/work |
| `<HH>` | `........` | error; preceding item is to be corrected |

`R` is the ordinary letter `R` used procedurally as “received correctly”; it is not stored as a separate run-together prosign. `<BT>` and the equals-sign character have the same on-air pattern but different semantic/display roles. `<AR>` and `+` likewise share a pattern. A question asking only for decoded glyphs must either accept both labels or supply the semantic context that selects one.

`SOS` has the continuous distress pattern `...---...`. It may appear only in clearly labeled recognition and safety scenarios. It must not be mixed into routine speed drills, used as decoration, or presented as a complete account of real emergency procedure.

### Timing and speed contract

Let one dot unit be `u` seconds:

```text
dot mark              1u
dash mark             3u
within-character gap  1u
between-character gap 3u
between-word gap      7u
```

There is no extra gap in addition to a larger gap: a word boundary is one seven-unit silence, not a three-unit gap plus seven more.

At ordinary speed `W` words per minute, the standard word `PARIS` occupies 50 units including its following word gap:

```text
u = 60 / (50W) = 1.2 / W seconds
```

An exact generated message duration must be calculated from its actual semantic timeline. The 50-unit `PARIS` convention may estimate prose speed only when the question explicitly asks for a standard-word estimate.

Farnsworth practice declares:

```text
C = character speed in WPM
E = effective speed in WPM, with 0 < E <= C
u = 1.2 / C
```

In `PARIS`, marks plus within-character gaps consume 31 units and expandable character/word gaps consume 19 units. The profile's outer-gap multiplier is:

```text
s = (50*C/E - 31) / 19
character gap = 3su
word gap      = 7su
```

At `C = E`, `s = 1`. Farnsworth slows the overall text with extra **between-character and between-word** space; it must not stretch dots and dashes or the within-character gap.

Core generated character speeds are 5–35 WPM; advanced drills may reach 45 WPM. Effective speeds are 5–25 WPM and never exceed character speed. Speed is not the only difficulty axis.

### Semantic event and audio contract

Encoding produces semantic events before it produces sound:

```text
MorseEvent {
  kind: "mark" | "gap"
  units: positive integer or profile-derived real
  role: "dot" | "dash" |
        "intra-character" | "inter-character" | "inter-word"
  tokenIndex
  characterIndex?
}
```

Prosign elements share one character-like token and therefore have only one-unit internal gaps. The event timeline is the answer authority for duration, playback, waveform diagrams, and sending comparisons.

Audio is synthesized locally with Web Audio or a precomputed `AudioBuffer`; no server and no prerecorded library are required. Requirements:

- default carrier is a 600 Hz sine wave;
- ordinary tone variation is 400–900 Hz and is never itself answer-relevant unless stated;
- the scheduler uses absolute audio-clock times or a rendered buffer, never a chain of `setTimeout` callbacks;
- every mark has a click-reducing attack/release envelope, normally up to 5 ms, while semantic key-down duration remains the timing authority;
- the default level is conservative, user-controlled, and headroom-limited;
- playback starts only after a user gesture and always exposes stop, replay, volume, and reduced-speed controls where pedagogically permitted;
- tab hiding, interruption, or audio-context suspension cannot cause an old schedule to resume unexpectedly;
- overlapping replays are cancelled rather than summed.

Optional impairments are generated from a seed:

- band-limited background noise;
- one or more other keyed tones for simulated `QRM`;
- smoothly varying amplitude for simulated `QSB`;
- bounded element and gap jitter;
- slight frequency drift.

Impairments must be gain-capped, reproducible, described in feedback, and applied only after a clean-source answer has been established. They must never create a surprise loud event.

### Sending and keying contract

Sending uses a large on-screen key plus keyboard, pointer, or touch controls. `Space` is the default keyboard key. Key repeat is ignored; pointer capture prevents a release outside the button from producing a stuck mark.

The captured record is a monotonic event sequence:

```text
KeyEvent { type: "down" | "up", timeMs }
```

The analyzer derives alternating marks and gaps. It reports content and timing separately:

- decoded content or nearest intended character;
- dot/dash classification;
- mark ratio;
- within-character, character, and word spacing;
- speed and variation.

Thresholds derive from a declared target unit or from a robust learner-unit estimate such as the median of likely dots. A default classification boundary halfway between one and three units is acceptable only after calibration. One borderline duration must not silently flip an entire attempt: feedback should display it as ambiguous and allow replay/retry.

The app is not an iambic-keyer or paddle simulator in v1. Straight-key timing is the reference. It does not claim to assess fist quality, transmitter keying, RF spectral cleanliness, or operator certification.

### Procedure state contract

The teaching profile uses explicit roles:

```text
caller
calledStation?       // absent for a general CQ
currentSender
otherStation
exchangeFields
contactState
```

Core sequence examples:

```text
general call:
CQ CQ CQ DE {self} {self} <K>

directed call:
{other} {other} DE {self} {self} <K>

reply and restricted handover:
{caller} DE {self} <KN>

close:
{other} DE {self} <SK>
```

`DE` means “from” and separates the called/calling portion from the sender's identity. `<K>` invites any station; `<KN>` returns the turn only to the named station. `<AR>` ends a message or transmission; `<SK>` ends the contact. Some real operators and services use variants, omit repetitions, or apply these signals differently. Questions grade only the displayed profile.

The simulator is a small deterministic state machine, not a free-form conversation judge. It can require or score:

- a call;
- correct identity placement;
- a legal response;
- one exchange field such as signal report, name, location, or serial;
- request/repeat/correction;
- explicit handover;
- close.

It must not generate personal addresses, real names tied to real callsigns, operational frequencies, or claims of actual radio contact.

### Callsign and phonetic-alphabet contract

All callsigns are visibly marked `PRACTICE` in the interface and are generated solely as identifiers for parsing and copy:

```text
[A-Z]{1,2}[0-9][A-Z]{1,3}
```

Selected scenarios may append `/P` or `/M`, defined locally as portable or mobile practice designators. This grammar is not an allocation validator and does not assert that a generated identifier is issued, available, geographically meaningful, or legal in any jurisdiction. Coincidental resemblance to a real callsign carries no meaning. The app never looks up, stores, or impersonates a real station.

The spelling alphabet is the current ITU alphabet (`Alfa`, `Bravo`, `Charlie`, `Delta`, `Echo`, `Foxtrot`, `Golf`, `Hotel`, `India`, `Juliett`, `Kilo`, `Lima`, `Mike`, `November`, `Oscar`, `Papa`, `Quebec`, `Romeo`, `Sierra`, `Tango`, `Uniform`, `Victor`, `Whiskey`, `X-ray`, `Yankee`, `Zulu`). Canonical answer checking ignores case and permits `Xray` for `X-ray`, but displayed spelling preserves the standard forms.

### Signal-report and Q-signal contract

For CW, `RST` means:

```text
R: readability 1–5
S: strength    1–9
T: tone        1–9
```

For voice, only `RS` is used. The app does not infer a uniquely “true” RST from arbitrary audio. Construction questions supply a descriptor or an exact labeled scale row. Synthetic-audio questions may ask for a **profile classification** based on disclosed signal parameters, not a calibrated receiver S-meter reading.

The contest shorthand `N` for `9` is supported in context: `5NN` decodes to `599`. It is an abbreviation, not a different scale.

Initial Q signals:

| Signal | Teaching meaning |
|---|---|
| `QRS` | send more slowly |
| `QRQ` | send faster |
| `QRM` | interference from other stations |
| `QRN` | atmospheric/static interference |
| `QSB` | fading |
| `QRZ` | who is calling me? |
| `QTH` | location |
| `QSL` | acknowledgement/confirmation of receipt |
| `QSO` | radio contact |

Prompts ask for meaning or appropriate use inside a scenario; they do not imply that memorizing this subset replaces an operating manual.

### Safety, legality, and ethics boundaries

- The app emits ordinary device audio only. It has no transmitter control, push-to-talk integration, RF output, frequency selector, power setting, or antenna instructions.
- It must not tell the learner that completing a drill authorizes on-air operation.
- It must not generate deceptive identification, impersonation, deliberate interference, covert-communication, evasion, or jamming exercises.
- Emergency content is recognition-oriented and explicitly marked as simulation. The correct real-world action depends on the service and jurisdiction; the app directs the learner to local official guidance rather than inventing universal instructions.
- Audio never autoplays. Default volume is modest, and continuous-drill modes include a visible stop control and optional session limit.
- Callsign and exchange data are synthetic and remain local unless the learner explicitly exports their own results.

### Scope

Included:

- International Morse `A`–`Z`, `0`–`9`, the listed punctuation, and the bounded prosign set;
- visual introduction, sound recognition, typed copy, and straight-key sending;
- ordinary and Farnsworth timing;
- synthetic callsigns and ITU phonetic spelling;
- bounded amateur-CW call, exchange, repair, handover, and close scenarios;
- `RS`, `RST`, contest `N`, and the listed Q signals;
- clean audio and controlled noise, interference, fading, drift, and jitter;
- deterministic local generation, scoring, review, and accessibility alternatives.

### Exclusions

- RF transmission or reception, software-defined radio, microphone decoding, live callbook lookup, propagation prediction, frequency selection, band plans, licence examination rules, and jurisdiction-specific legal advice;
- a general Morse decoder for arbitrary recordings;
- automated transcription of another person's communications;
- American Morse, Wabun, Cyrillic Morse, non-Latin extensions, and service-specific codebooks in v1;
- high-speed telegraphy competition scoring, bugs, sideswipers, paddles, iambic modes, and keyer setup in v1;
- unrestricted radiograms, traffic-net procedure, contest rules, logging, awards, QSL services, and emergency-net operations;
- claims that RST values are objective physical measurements;
- long random-code ordeals whose only difficulty is fatigue.

### Global answer conventions

- Surrounding whitespace is ignored.
- Morse display answers accept `.` and `-`; optional spaces between elements are removed. Character spaces and `/` word separators remain semantically significant when a phrase is requested.
- Text copy is case-insensitive and normalized to upper case.
- A callsign slash is significant; hyphens and decorative punctuation are not inserted.
- Phonetic answers ignore case and accept spaces or hyphens where the token remains unambiguous.
- Prosign answers use tokens such as `<SK>`. The checker may accept `SK` only when the prompt has clearly asked for a prosign name, never in free message copy where `S K` is a different transmission.
- Numeric answers accept ordinary decimal notation and displayed units. Timing tolerance is the larger of `1 ms` and `0.5%` unless the family specifies conceptual rounding.
- Ordered copy must remain ordered. Multiple fields use named inputs rather than a fragile comma-separated string.
- If two semantic tokens share a pattern, the question either supplies disambiguating context or accepts every explicitly documented equivalent.
- Replay count is metadata, not correctness. A correct answer after replay is correct, while a separate fluency metric may record replays.

### Difficulty philosophy

Difficulty should grow through:

- larger active character sets;
- weaker visual scaffolding and more direct sound-to-symbol recall;
- longer but still memory-appropriate groups;
- higher character speed and lower effective spacing;
- confusable rhythms;
- less predictable context;
- mixed letters, digits, punctuation, prosigns, and callsigns;
- bounded noise, fading, QRM, pitch variation, or timing imperfection;
- multi-field copy, repair, and procedure-state decisions;
- sending content plus progressively tighter rhythm targets.

Difficulty must not grow merely through unsafe volume, inaudible tones, extreme speed jumps, gratuitously long sessions, tiny controls, deceptive unstated conventions, or real-world regulatory trivia.

## 2. Category: Symbols, patterns, and rhythm vocabulary

### Category purpose

Build exact symbol-pattern associations while preventing permanent dependence on a printed dot-dash lookup tree.

### Learn

A Morse character is one rhythmic pattern. A dash lasts three dot units, with one unit between elements of the same character. Learn the sound as a whole: `A` is `.−`, a short mark followed by a long mark. Spaces are part of the code. A prosign such as `<SK>` is one continuous pattern, not two normally spaced letters.

Visual patterns are a temporary scaffold. Say or type the character after hearing it; do not count marks one by one once the pattern is familiar.

### Prerequisites

None.

### Category boundaries

This category teaches the inventory and structural distinctions. Timed numeric calculation belongs in Category 3, live listening in Category 4, and physical keying in Category 5.

### Subcategories

1. letters;
2. digits;
3. punctuation;
4. prosigns and shared patterns;
5. pattern comparison and diagnosis.

### Common misconceptions

- Treating dots and dashes as binary values rather than durations.
- Adding a character gap between the conceptual letters in a prosign.
- Reversing a pattern such as `A` (`.-`) and `N` (`-.`).
- Assuming shared sound patterns always have one written meaning.
- Believing a longer pattern is necessarily more difficult or “slower.”

### Families

#### Family `symbol_letter_encode`

**Task.** Give the pattern for one displayed letter.  
**Response/template.** Morse text; “Send `{letter}` in International Morse.”  
**Derivation.** Look up `{letter}` in the canonical table.  
**Difficulty.** Active letter set, confusable pairs, removal of mnemonic cue.  
**Feedback.** Play the whole correct character, then show its marks and durations.  
**Examples.** (1) `E` → `.`. (2) `A` → `.-`. (3) `Q` → `--.-`.  
**Validation.** Every active letter appears near-uniformly; no answer is inferred from alphabetical position.

#### Family `symbol_letter_decode`

**Task.** Name the letter represented by a visual or slowly played pattern.  
**Response/template.** One letter; “Which letter is `{pattern}`?”  
**Derivation.** Reverse the canonical map.  
**Difficulty.** Visual then audio presentation; similarity within the active set.  
**Feedback.** Compare the chosen and target rhythms rather than merely saying “wrong.”  
**Examples.** (1) `-` → `T`. (2) `.-.` → `R`. (3) `-..-` → `X`.  
**Validation.** The pattern maps to exactly one ordinary character.

#### Family `symbol_digit_encode`

**Task.** Encode one digit.  
**Response/template.** Morse text; “What is the Morse pattern for `{digit}`?”  
**Derivation.** Use the digit row, where `1`–`5` add dots and `6`–`0` add leading dashes.  
**Difficulty.** Adjacent digits and random direction changes.  
**Feedback.** Highlight the transition point between dots and dashes.  
**Examples.** (1) `1` → `.----`. (2) `5` → `.....`. (3) `8` → `---..`.  
**Validation.** Generate all ten digits; do not exclude `0`.

#### Family `symbol_digit_decode`

**Task.** Decode a five-element digit pattern.  
**Response/template.** One digit; “Which digit is `{pattern}`?”  
**Derivation.** Reverse the digit map.  
**Difficulty.** Neighboring digits, audio-only mode, mixed direction.  
**Feedback.** State the digit and replay its five-element contour.  
**Examples.** (1) `-----` → `0`. (2) `...--` → `3`. (3) `-....` → `6`.  
**Validation.** Distractors favor adjacent patterns but never duplicate the answer.

#### Family `symbol_punctuation`

**Task.** Encode or decode one item from the declared punctuation subset.  
**Response/template.** Pattern or single choice; “Which punctuation mark is `{pattern}`?”  
**Derivation.** Use the versioned punctuation table.  
**Difficulty.** Pattern length, shared suffixes, reduced visual support.  
**Feedback.** Name and play the punctuation mark; mention if it is uncommon in ordinary practice.  
**Examples.** (1) `..--..` → question mark. (2) slash → `-..-.`. (3) `.-.-.-` → period.  
**Validation.** Localized punctuation names never change the encoded glyph.

#### Family `symbol_prosign`

**Task.** Map between a prosign token, its uninterrupted pattern, and its profile meaning.  
**Response/template.** Matching or single choice; “What does `<AS>` request?”  
**Derivation.** Use the prosign profile table.  
**Difficulty.** Pattern recall, meaning recall, direction of mapping.  
**Feedback.** Render the token as one bracketed unit and play it without letter spacing.  
**Examples.** (1) `<AS>` → wait. (2) end contact → `<SK>`. (3) `<HH>` → error/correction follows.  
**Validation.** Meaning distractors are valid profile meanings but contextually wrong.

#### Family `symbol_prosign_vs_letters`

**Task.** Distinguish one run-together prosign from the same named letters sent separately.  
**Response/template.** Single choice; “Did you hear `<AR>` or the two letters `A R`?”  
**Derivation.** `<AR>` contains only one-unit internal element gaps; `A R` has a three-unit letter gap.  
**Difficulty.** Speed, location of the decisive gap, audio only.  
**Feedback.** Replay with a timeline marking the decisive one-unit or three-unit silence.  
**Examples.** (1) `.-.-.` continuous → `<AR>`. (2) `.- / .-.` with a letter gap → `A R`. (3) `...-.-` continuous → `<SK>`, not `S K`.  
**Validation.** Paired audio differs only in the semantic gap.

#### Family `symbol_pattern_compare`

**Task.** Identify the element or ordering difference between two confusable characters.  
**Response/template.** Single choice or named field; “How do `{left}` and `{right}` differ?”  
**Derivation.** Align the canonical element arrays.  
**Difficulty.** Reversal, one-element extension, same element counts.  
**Feedback.** Show an aligned rhythm comparison.  
**Examples.** (1) `A`/`N` → reversed order. (2) `U`/`V` → `V` adds a final dot. (3) `G`/`Z` → final element dash versus dot.  
**Validation.** The stated relationship is computed, not hand-authored.

#### Family `symbol_element_count`

**Task.** Count dots, dashes, or total mark units in a character.  
**Response/template.** Integer fields; “For `{character}`, how many dots, dashes, and mark units?”  
**Derivation.** Count elements; mark units are `dots + 3*dashes`.  
**Difficulty.** Longer punctuation/prosigns, multiple requested fields.  
**Feedback.** Expand the calculation.  
**Examples.** (1) `A` → 1 dot, 1 dash, 4 mark units. (2) `5` → 5, 0, 5. (3) `O` → 0, 3, 9.  
**Validation.** Do not include gaps in “mark units.”

#### Family `symbol_prefix_completion`

**Task.** Complete a partially heard or displayed known pattern.  
**Response/template.** Dot/dash choice; “`{character}` begins `{prefix}`. What element completes it?”  
**Derivation.** Compare prefix with canonical pattern.  
**Difficulty.** Missing element position and active set size.  
**Feedback.** Play prefix, pause, then full character.  
**Examples.** (1) `A` begins `.` → dash. (2) `D` begins `-.` → dot. (3) `2` begins `..--` → dash.  
**Validation.** Exactly one element is omitted and the displayed prefix is true.

#### Family `symbol_visual_tree`

**Task.** Follow dot/dash branches in an introductory decode tree.  
**Response/template.** One character; “Start at the root and follow `{branches}`.”  
**Derivation.** Traverse the generated prefix tree.  
**Difficulty.** Depth and removal of node labels.  
**Feedback.** Animate the path, then play the result.  
**Examples.** (1) dot → `E`. (2) dash, dot → `N`. (3) dot, dash, dot → `R`.  
**Validation.** Use only nodes represented in the active inventory; retire this scaffold from mastery drills.

#### Family `symbol_code_audit`

**Task.** Find one incorrect character, spacing claim, or prosign representation in a small reference card.  
**Response/template.** Select erroneous row and correct it.  
**Derivation.** Compare every row with the canonical data and token rules.  
**Difficulty.** Error subtlety and table size.  
**Feedback.** Explain the exact mismatch and play both rhythms.  
**Examples.** (1) `N .-` is wrong; `N -.`. (2) `<SK>` with a letter gap is wrong. (3) `0 .....` is wrong; `0 -----`.  
**Validation.** Exactly one semantic defect; typography alone is never the defect.

## 3. Category: Timing, speed, and spacing

### Category purpose

Turn the `1:3`, `1:3`, `1:7` timing rules into usable intuition for listening, sending, and estimating message duration.

### Learn

Choose a dot unit `u`. A dash is `3u`; gaps inside a character are `u`; gaps between characters are `3u`; gaps between words are `7u`. At `W` WPM, `u = 1.2/W` seconds. Farnsworth spacing keeps characters at speed `C` but lengthens only the outer gaps until the effective speed is `E`.

### Prerequisites

The distinction between marks, characters, words, and prosigns from Category 2.

### Category boundaries

This category asks exact timing questions from semantic schedules. Listening robustness belongs in Category 4 and measured learner keying in Category 5.

### Subcategories

1. element and gap duration;
2. complete timelines;
3. WPM and standard-word reasoning;
4. Farnsworth spacing;
5. timing diagnosis.

### Common misconceptions

- Making a dash two units instead of three.
- Adding both a character gap and word gap at a word boundary.
- Counting an outer gap after the final message when none is declared.
- Slowing each mark in Farnsworth practice.
- Using `PARIS = 50 units` as the exact duration of every five-letter word.

### Families

#### Family `timing_element_duration`

**Task.** Calculate dot, dash, or within-character-gap duration from WPM.  
**Response/template.** Duration with unit; “At `{wpm}` WPM, how long is one `{element}`?”  
**Derivation.** `u=1.2/wpm`; multiply by 1 or 3.  
**Difficulty.** Unit conversion and non-round speeds.  
**Feedback.** Show `u` first, then the multiplier.  
**Examples.** (1) 20 WPM dot → 60 ms. (2) 20 WPM dash → 180 ms. (3) 12 WPM intra-gap → 100 ms.  
**Validation.** Expected values derive from exact rationals before display rounding.

#### Family `timing_character_duration`

**Task.** Compute the duration of one complete character excluding outer spacing.  
**Response/template.** Milliseconds; “How long does `{character}` itself last at `{wpm}` WPM?”  
**Derivation.** Sum mark units plus one unit between adjacent elements.  
**Difficulty.** Pattern length and mark mixture.  
**Feedback.** Annotate every mark and internal gap.  
**Examples.** (1) `E` at 20 → 60 ms. (2) `A` at 20 → `(1+1+3)*60=300 ms`. (3) `O` at 20 → `(3+1+3+1+3)*60=660 ms`.  
**Validation.** No inter-character gap is included.

#### Family `timing_gap_classify`

**Task.** Classify a labeled silence by semantic role or nominal unit length.  
**Response/template.** Single choice.  
**Derivation.** Map 1/3/7 units to intra-character/inter-character/inter-word.  
**Difficulty.** Audio-only mode, bounded jitter, contextual ambiguity.  
**Feedback.** Display adjacent tokens and the measured silence.  
**Examples.** (1) 1u between dot and dash → within character. (2) 3u between `A` and `R` → between characters. (3) 7u after `CQ` → word boundary.  
**Validation.** Jittered cases stay outside an ambiguity band unless ambiguity itself is the requested answer.

#### Family `timing_encode_timeline`

**Task.** Build or select the event timeline for a short text.  
**Response/template.** Ordered mark/gap sequence.  
**Derivation.** Encode tokens and insert exactly one appropriate boundary gap.  
**Difficulty.** Multi-element letters, words, and prosigns.  
**Feedback.** Align text, patterns, and units in three rows.  
**Examples.** (1) `ET` → `mark1 gap3 mark3`. (2) `A E` → `1,1,3,7,1`. (3) `<AR>` has only internal one-unit gaps.  
**Validation.** Round-trip the timeline through the decoder.

#### Family `timing_decode_timeline`

**Task.** Recover text and boundaries from an exact unit timeline.  
**Response/template.** Short text.  
**Derivation.** Split on 7-unit word gaps and 3-unit character gaps, then decode marks separated by 1-unit gaps.  
**Difficulty.** More characters, shared prosign patterns with supplied context.  
**Feedback.** Color each segmentation level.  
**Examples.** (1) `1mark,3gap,3mark` → `ET`. (2) `...` with one-unit internal gaps → `S`. (3) two character patterns separated by 7u → two words.  
**Validation.** Generated timelines are syntactically valid and uniquely decodable under the prompt's token domain.

#### Family `timing_paris_wpm`

**Task.** Convert among WPM, dot duration, and standard-word duration.  
**Response/template.** Numeric answer.  
**Derivation.** `50u` per `PARIS`; `u=1.2/W`; a standard word lasts `60/W` seconds.  
**Difficulty.** Invert the relationship and change units.  
**Feedback.** Show the 50-unit basis.  
**Examples.** (1) 20 WPM → 3 s per standard word. (2) 60 ms dot → 20 WPM. (3) 4 s per standard word → 15 WPM.  
**Validation.** Say “standard word,” not “any five-letter word.”

#### Family `timing_farnsworth_spacing`

**Task.** Calculate the Farnsworth outer-gap multiplier or resulting gaps.  
**Response/template.** Decimal or durations.  
**Derivation.** `s=(50C/E-31)/19`, then `3su` and `7su` with `u=1.2/C`.  
**Difficulty.** Asked variable, unit conversion, comparison with ordinary spacing.  
**Feedback.** Separate fixed 31 units from expandable 19 units.  
**Examples.** (1) `C=E=20` → `s=1`. (2) `C=20,E=10` → `s=69/19≈3.632`. (3) with that pair, character gap ≈653.7 ms.  
**Validation.** Enforce `E<=C`; use the pinned formula rather than ad-hoc spacing.

#### Family `timing_message_duration`

**Task.** Compute the exact duration of a generated message under declared final-gap policy.  
**Response/template.** Seconds or milliseconds.  
**Derivation.** Sum its semantic events after ordinary or Farnsworth gap expansion.  
**Difficulty.** Words, prosigns, repeated callsigns, final gap included/excluded.  
**Feedback.** Give subtotals for marks, internal gaps, character gaps, and word gaps.  
**Examples.** (1) `EE` at 20 without final gap → `1u+3u+1u=300 ms`. (2) `E E` → `1u+7u+1u=540 ms`. (3) compare ordinary and Farnsworth schedules for the same `CQ`.  
**Validation.** The prompt always states whether a following word gap is part of the measured interval.

#### Family `timing_speed_convert`

**Task.** Convert a timeline from one character speed to another without changing its symbols.  
**Response/template.** Scale factor or new duration.  
**Derivation.** Ordinary durations scale inversely with WPM.  
**Difficulty.** Farnsworth versus ordinary; mixed units.  
**Feedback.** State what scales and what is recomputed.  
**Examples.** (1) 10→20 WPM halves ordinary duration. (2) 24→18 multiplies by `4/3`. (3) changing `C` while holding `E` requires recomputing Farnsworth gaps.  
**Validation.** No simple inverse shortcut is accepted for mixed-speed Farnsworth unless it is actually valid.

#### Family `timing_weighting_ratio`

**Task.** Judge dot/dash weighting from supplied measurements.  
**Response/template.** Ratio and classification.  
**Derivation.** Divide median dash duration by median dot duration; compare with target 3.  
**Difficulty.** Small sample variation and robust summaries.  
**Feedback.** Show medians and whether dashes are short or long.  
**Examples.** (1) dot 60 ms, dash 180 ms → ratio 3.00, nominal. (2) dot 60 ms, dash 150 ms → 2.50, short dashes. (3) dot 55 ms, dash 180 ms → 3.27, long relative dashes.  
**Validation.** Classification thresholds are displayed and versioned.

#### Family `timing_jitter_measure`

**Task.** Measure deviation or choose the least variable rendition.  
**Response/template.** Percentage, duration, or choice.  
**Derivation.** Compare durations with the declared target; use mean absolute error or coefficient of variation as stated.  
**Difficulty.** More events and separate mark/gap channels.  
**Feedback.** Plot target and observed event lengths.  
**Examples.** (1) 62 ms versus 60 ms → +3.33%. (2) dots 58/60/62 have mean 60. (3) choose the sample with lower declared timing error.  
**Validation.** Never switch statistical metric without naming it.

#### Family `timing_audit`

**Task.** Find one error in a duration calculation or schedule.  
**Response/template.** Select and correct one step.  
**Derivation.** Rebuild from the canonical event model.  
**Difficulty.** Hidden double-counted gaps, final-gap policy, Farnsworth error.  
**Feedback.** Identify the violated timing rule.  
**Examples.** (1) word gap `3u+7u` → should be `7u`. (2) dash `2u` → `3u`. (3) stretched Farnsworth dots → only outer gaps stretch.  
**Validation.** Exactly one seeded conceptual error.

## 4. Category: Audio receiving

### Category purpose

Develop immediate sound-to-symbol recognition and increasingly robust copy without substituting a visual lookup exercise.

### Learn

Listen to the complete rhythm, answer, then replay the correct sound. Begin with a small active set, but mix old and new characters. Character speed and spacing are separate: Farnsworth can preserve a crisp character while giving extra thinking time. Noise and fading are introduced only after clean copy is stable.

### Prerequisites

The active character inventory from Category 2; basic gap meanings from Category 3.

### Category boundaries

This category supplies sound and asks for received content. Numeric waveform reasoning belongs in Category 3, sending belongs in Category 5, and procedure decisions belong in Category 7.

### Subcategories

1. isolated characters;
2. groups and words;
3. callsigns and prosigns;
4. speed, pitch, and controlled impairment.

### Common misconceptions

- Counting individual marks too slowly to recognize the whole rhythm.
- Assuming pitch identifies a character.
- Guessing a likely word instead of copying the received marks.
- Treating a fade as a word boundary.
- Losing position after one missed character rather than entering a placeholder and continuing.

### Families

#### Family `audio_single_character`

**Task.** Identify one cleanly played character.  
**Response/template.** One character; replay permitted.  
**Derivation.** Decode the known generated pattern.  
**Difficulty.** Active set, speed, confusable rhythm, replay limit as a fluency metric.  
**Feedback.** Replay target and chosen character back-to-back.  
**Examples.** (1) `.-` → `A`. (2) `-.` → `N`. (3) `..-.` → `F`.  
**Validation.** Audio is rendered from the same table as the expected answer.

#### Family `audio_letter_group`

**Task.** Copy a short random letter group.  
**Response/template.** Text; “Copy the `{length}`-letter group.”  
**Derivation.** Exact source string.  
**Difficulty.** 2–8 letters, active set, character/effective speed.  
**Feedback.** Align received answer with source and replay per character.  
**Examples.** (1) `AE`. (2) `KMR`. (3) `QFZLJ`.  
**Validation.** Random groups avoid language prediction; every character remains in the active set.

#### Family `audio_digit_group`

**Task.** Copy a group containing only digits.  
**Response/template.** Digit string, preserving leading zeroes.  
**Derivation.** Exact generated sequence.  
**Difficulty.** Length, adjacent patterns, repeats.  
**Feedback.** Preserve and explain leading zeroes as content.  
**Examples.** (1) `73`. (2) `005`. (3) `19048`.  
**Validation.** Store as a string, never a number.

#### Family `audio_mixed_group`

**Task.** Copy a mixed letter/digit group.  
**Response/template.** Upper-case string.  
**Derivation.** Exact generated sequence.  
**Difficulty.** switching classes, repeated characters, length.  
**Feedback.** Mark substitutions, insertions, deletions, and transpositions separately.  
**Examples.** (1) `A7`. (2) `R2D5`. (3) `0Q9MT`.  
**Validation.** No ambiguous visual glyph styling such as `O` versus `0`.

#### Family `audio_common_word`

**Task.** Copy a word from a controlled vocabulary.  
**Response/template.** Short text.  
**Derivation.** Exact selected word.  
**Difficulty.** vocabulary size, similar spellings, reduced spacing.  
**Feedback.** Reveal character alignment before the word meaning.  
**Examples.** (1) `RADIO`. (2) `SIGNAL`. (3) `COPY`.  
**Validation.** Distractor evaluation checks received code, not semantic plausibility.

#### Family `audio_prosign`

**Task.** Recognize a played prosign and give its token or meaning.  
**Response/template.** Prosign choice.  
**Derivation.** Match continuous pattern in profile.  
**Difficulty.** confusable ordinary characters, contextual meaning.  
**Feedback.** Show there was no three-unit internal letter gap.  
**Examples.** (1) `...-.-` → `<SK>`. (2) `.-...` → `<AS>`. (3) `........` → `<HH>`.  
**Validation.** Pattern-sharing punctuation is disambiguated by procedure context.

#### Family `audio_callsign`

**Task.** Copy a synthetic practice callsign.  
**Response/template.** Callsign text.  
**Derivation.** Exact generated identifier.  
**Difficulty.** prefix/suffix length, slash designator, repetitions, speed.  
**Feedback.** Segment prefix, numeral, suffix, and optional designator.  
**Examples.** (1) `K1AB`. (2) `SM7QX`. (3) `N4PL/P`.  
**Validation.** Always label as synthetic practice data; do not validate allocation.

#### Family `audio_speed_ramp`

**Task.** Copy repeated content as speed or spacing changes in declared steps.  
**Response/template.** Text per segment or threshold selection.  
**Derivation.** All segments share known content or controlled variations.  
**Difficulty.** ramp size, ordinary versus Farnsworth, segment count.  
**Feedback.** Report the first speed at which errors appeared without turning it into a permanent “maximum.”  
**Examples.** (1) same `A` at 12/16/20 WPM. (2) groups at 20-character/10→15 effective WPM. (3) identify which segment changed only spacing.  
**Validation.** Gain and pitch remain constant unless explicitly varied.

#### Family `audio_tone_variation`

**Task.** Recognize unchanged Morse content across different carrier pitches.  
**Response/template.** Character/group or same/different choice.  
**Derivation.** Timing pattern determines content; pitch is nuisance variation.  
**Difficulty.** pitch range and alternating tones.  
**Feedback.** Overlay identical envelopes while labeling pitch difference.  
**Examples.** (1) `R` at 500 Hz and 750 Hz → same. (2) choose which two clips encode `K`. (3) copy a three-character group with per-group pitch variation.  
**Validation.** Frequencies stay within profile bounds and loudness is normalized.

#### Family `audio_noise_copy`

**Task.** Copy known-domain content with seeded background noise.  
**Response/template.** Text plus optional confidence.  
**Derivation.** Clean source remains answer authority.  
**Difficulty.** signal-to-noise profile, group length, speed.  
**Feedback.** Replay clean and impaired versions at matched safe level.  
**Examples.** (1) one character with mild noise. (2) three digits with moderate noise. (3) callsign with an explicitly marked uncertain character.  
**Validation.** Impairment presets are bounded and snapshot-tested for audibility.

#### Family `audio_fading_copy`

**Task.** Continue copying through smooth seeded fading.  
**Response/template.** Text with `?` allowed for unheard positions before final grading.  
**Derivation.** Apply a known gain envelope to the clean source.  
**Difficulty.** fade depth, duration, placement, context.  
**Feedback.** Show gain envelope and replay the missed element cleanly.  
**Examples.** (1) shallow fade between characters. (2) fade over one dash. (3) repeated callsign lets learner repair one faded copy.  
**Validation.** The fade never creates extra marks and does not mute all evidence in a supposedly exact question.

#### Family `audio_interference_audit`

**Task.** Identify why a copy became difficult or find a generation defect.  
**Response/template.** Single choice with evidence.  
**Derivation.** Inspect declared impairment metadata and semantic timeline.  
**Difficulty.** QRM versus QRN versus QSB, scheduler overlap, clipped gain.  
**Feedback.** Name the audible cue and the safe production rule.  
**Examples.** (1) second keyed station → QRM. (2) random static-like noise → QRN. (3) smooth level variation → QSB.  
**Validation.** Only one diagnosis is supported; it never asks a learner to infer RF facts from arbitrary synthetic sound.

## 5. Category: Sending and keying

### Category purpose

Train accurate content, a stable `1:3` mark ratio, and intelligible spacing while keeping mechanical input limitations separate from Morse knowledge.

### Learn

Press and hold for a mark; release for a gap. A dot is one unit and a dash is three. The one-unit gap belongs inside a character, three units separates characters, and seven units separates words. Clean spacing matters as much as mark shape: poor spacing can turn correct elements into the wrong grouping.

The app scores what was sent and how it was timed as separate dimensions. Aim first for recognizable rhythm, then consistency.

### Prerequisites

Symbol recognition from Category 2 and timing concepts from Category 3.

### Category boundaries

This category analyzes local straight-key input. Paddle logic, iambic keyers, real transmitter keying, microphone input, and claims about a learner's on-air signal are excluded.

### Subcategories

1. marks and characters;
2. groups and spaces;
3. consistency and weighting;
4. correction.

### Common misconceptions

- Tapping both dots and dashes instead of holding dashes.
- Pausing three units between every element.
- Running adjacent characters together.
- Producing a word gap in addition to a character gap.
- Believing correct text compensates for unintelligible timing, or vice versa.

### Families

#### Family `send_element_tap`

**Task.** Produce a requested dot or dash near a declared target duration.  
**Response/template.** One key-down/up gesture.  
**Derivation.** Compare observed mark duration with `u` or `3u`.  
**Difficulty.** Faster target units and narrower, but never hidden, tolerance.  
**Feedback.** Show target, observed duration, signed error, and classification.  
**Examples.** (1) dot target 100 ms, observed 104 ms. (2) dash target 180 ms, observed 171 ms. (3) 125 ms against a 60/180 ms model → ambiguous/incorrect, not silently forced.  
**Validation.** Ignore operating-system repeat events and reject missing key-up safely.

#### Family `send_character`

**Task.** Key one displayed character.  
**Response/template.** Local keying gesture sequence.  
**Derivation.** Segment marks by gaps, classify marks, and compare decoded pattern.  
**Difficulty.** element count, reversals, speed, removal of visual pattern.  
**Feedback.** Separate content match from each mark/gap timing error.  
**Examples.** (1) key `A` as dot-dash. (2) key `D` as dash-dot-dot. (3) key `5` as five dots.  
**Validation.** The target and observed semantic timelines remain available for replay.

#### Family `send_group`

**Task.** Key a displayed short group.  
**Response/template.** Gesture timeline followed by explicit Finish control or timeout.  
**Derivation.** Segment on observed outer gaps and align decoded symbols with target.  
**Difficulty.** 2–6 characters, digit mixing, repeats, speed.  
**Feedback.** Use edit alignment and per-gap timing, not one opaque percentage.  
**Examples.** (1) `ET`. (2) `CQ`. (3) `R5A`.  
**Validation.** End-of-attempt silence is UI control state, not automatically an extra word gap.

#### Family `send_character_spacing`

**Task.** Key two known characters with a correct character boundary.  
**Response/template.** Gesture timeline.  
**Derivation.** Expected separating release is `3u`; internal releases remain `u`.  
**Difficulty.** characters ending/starting with similar marks, faster units.  
**Feedback.** Highlight the boundary and explain whether characters ran together or were over-spaced.  
**Examples.** (1) `E T` requires a 3u gap. (2) `A N` distinguishes internal and outer silences. (3) observed 1u between `E` and `T` runs into `A`.  
**Validation.** Boundary scoring uses the declared tolerance profile.

#### Family `send_word_spacing`

**Task.** Key two short words with an intelligible word boundary.  
**Response/template.** Gesture timeline.  
**Derivation.** Expected boundary is one `7u` release.  
**Difficulty.** adjacent short words and Farnsworth target spacing.  
**Feedback.** Compare the observed gap with both 3u and 7u targets.  
**Examples.** (1) `CQ DE`. (2) `R R`. (3) a 10u observed silence is over-spaced but still distinct from adding 3u+7u semantically.  
**Validation.** The analyzer never asks the learner to release for 3u and then 7u.

#### Family `send_speed_consistency`

**Task.** Key repeated symbols and identify or reduce timing variation.  
**Response/template.** Gesture sequence plus numeric/choice reflection.  
**Derivation.** Compute robust center and declared variation metric separately for dots, dashes, and gaps.  
**Difficulty.** sequence length and target speed.  
**Feedback.** Plot observations with medians; avoid ranking learners by a single outlier.  
**Examples.** (1) five dots around 80 ms. (2) repeated `A` with consistent internal gap. (3) compare two takes using mean absolute percentage error.  
**Validation.** Too-short accidental bounce events are flagged and excluded only by a documented debounce rule.

#### Family `send_weighting`

**Task.** Adjust mark proportions toward the target dash/dot ratio.  
**Response/template.** Key a prompted pattern.  
**Derivation.** Compare median dash/dot duration and total character shape with the profile.  
**Difficulty.** mixed patterns and modest timing jitter.  
**Feedback.** Say “dashes are short relative to dots,” not just “timing 72%.”  
**Examples.** (1) dash/dot 2.4 → lengthen dashes. (2) 3.0 → nominal weighting. (3) 3.7 → shorten dashes or lengthen dots.  
**Validation.** Feedback does not confuse weighting with overall WPM.

#### Family `send_error_correction`

**Task.** Send a short item, emit `<HH>` after a detected mistake, then resend the item correctly.  
**Response/template.** Gesture timeline under a displayed correction grammar.  
**Derivation.** Procedure parser recognizes incorrect item, `<HH>`, and replacement.  
**Difficulty.** error location, group length, audio-only self-monitoring.  
**Feedback.** Show which content was cancelled and which replacement remains.  
**Examples.** (1) wrong letter, `<HH>`, correct letter. (2) wrong callsign suffix, correction, full suffix repeated. (3) `<HH>` with ordinary letter spacing is not the correction prosign.  
**Validation.** The prompt states exactly how much must be resent; no free-form operating convention is guessed.

#### Family `send_keying_audit`

**Task.** Diagnose one content, spacing, input-event, or scoring fault in a displayed keying trace.  
**Response/template.** Select region and defect.  
**Derivation.** Compare trace with target semantic events and input invariants.  
**Difficulty.** borderline durations, stuck key, duplicate down event, boundary ambiguity.  
**Feedback.** Identify the first causal defect and its downstream decode effect.  
**Examples.** (1) repeated keydown created a false release/down pair. (2) 1u between letters merged them. (3) content correct but all dashes are 2u.  
**Validation.** Exactly one root fault is seeded; cascading decode differences are not counted as separate faults.

## 6. Category: Callsigns and identifiers

### Category purpose

Make compact mixed letter/digit identifiers easy to parse, copy, repeat, and place correctly without implying ownership or regulatory validity.

### Learn

A practice callsign in this app has one or two letters, one digit, and one to three letters, optionally followed by `/P` or `/M`. This is a training grammar, not a real allocation rule. Segment the identifier into prefix letters, numeral, suffix letters, and optional designator. Repetition and phonetic spelling help repair uncertain characters.

### Prerequisites

Letters, digits, slash punctuation, and audio group copy.

### Category boundaries

This category handles identifier structure and copying. Which party sends which callsign belongs in Category 7. Countries, allocation prefixes, licence classes, callbooks, and real-station lookup are excluded.

### Subcategories

1. structure;
2. sound copy and contrast;
3. portable/mobile suffixes;
4. phonetic repair;
5. placement diagnosis.

### Common misconceptions

- Dropping the numeral or a repeated suffix letter.
- Confusing `O` with `0` from typography rather than sound.
- Treating `/P` as part of the base identifier.
- Inferring nationality or validity from the practice prefix.
- Assuming every identifier-like string is a real assigned callsign.

### Families

#### Family `callsign_structure_parse`

**Task.** Split a synthetic callsign into named components.  
**Response/template.** Prefix, numeral, suffix, designator fields.  
**Derivation.** Parse the declared practice grammar.  
**Difficulty.** variable component lengths and optional designator.  
**Feedback.** Color-code each component.  
**Examples.** (1) `K1AB` → `K|1|AB`. (2) `SM7QX` → `SM|7|QX`. (3) `N4PL/P` → `N|4|PL|P`.  
**Validation.** Every generated identifier matches the grammar; malformed strings appear only in audits.

#### Family `callsign_morse_copy`

**Task.** Copy one practice callsign from audio.  
**Response/template.** Callsign text.  
**Derivation.** Exact generated identifier.  
**Difficulty.** length, speed, active set, designator.  
**Feedback.** Replay components individually and as one identifier.  
**Examples.** (1) `W3A`. (2) `LA8TM`. (3) `G6QR/M`.  
**Validation.** UI displays `PRACTICE`; generator makes no allocation claims.

#### Family `callsign_repetition_copy`

**Task.** Reconcile two or three transmissions of the same callsign when one copy is impaired.  
**Response/template.** Callsign plus optional confidence per character.  
**Derivation.** All clean source copies share an identifier; seeded impairments affect different positions.  
**Difficulty.** number/depth of fades and confusable characters.  
**Feedback.** Align repetitions and show the evidence for repaired positions.  
**Examples.** (1) clear `K1?B` plus `K1AB` → `K1AB`. (2) two matching copies and one substitution. (3) insufficient evidence → accept `?` rather than demand a guess.  
**Validation.** Exact-answer mode guarantees enough audible evidence; uncertainty mode explicitly permits unknowns.

#### Family `callsign_prefix_suffix`

**Task.** Identify which heard component is prefix, numeral, or suffix.  
**Response/template.** Matching or named field.  
**Derivation.** Use only the practice grammar.  
**Difficulty.** two-letter prefix, three-letter suffix, audio-only segmentation.  
**Feedback.** State that these are structural labels, not geographic conclusions.  
**Examples.** (1) in `AB2C`, `AB` is prefix. (2) in `M5QRS`, `QRS` is suffix. (3) the digit is always the numeral component in this profile.  
**Validation.** No prompt asks “which country?”.

#### Family `callsign_portable_designator`

**Task.** Interpret or preserve the optional practice designator.  
**Response/template.** Single choice or callsign text.  
**Derivation.** `/P` means portable and `/M` mobile only within the teaching profile.  
**Difficulty.** slash recognition and full-copy preservation.  
**Feedback.** Separate base identifier from designator and repeat the scope caveat.  
**Examples.** (1) `K2AB/P` → base `K2AB`, portable. (2) mobile → `/M`. (3) omitting `/P` changes the copied identifier.  
**Validation.** No maritime, aeronautical, temporary-prefix, or reciprocal-operation rules are inferred.

#### Family `callsign_phonetic_spell`

**Task.** Spell a practice callsign using the ITU phonetic alphabet and ordinary digit names.  
**Response/template.** Ordered tokens or matching.  
**Derivation.** Map letters through the phonetic table, preserve digit and slash designator.  
**Difficulty.** length, spelling confusions such as `Alfa`/`Juliett`.  
**Feedback.** Show canonical tokens and pronounce them only if pronunciation assets are explicitly supported.  
**Examples.** (1) `K1A` → `Kilo One Alfa`. (2) `SM7` → `Sierra Mike Seven`. (3) `X2Q/P` → `X-ray Two Quebec portable`.  
**Validation.** Accept normalized spelling variants only where listed; do not use browser speech output as an answer oracle.

#### Family `callsign_similar_contrast`

**Task.** Distinguish two practice callsigns that differ at one position.  
**Response/template.** Choice or differing position.  
**Derivation.** Generate a controlled minimal pair.  
**Difficulty.** Morse-confusable characters, position, audio impairment.  
**Feedback.** Replay only the differing character, then both full calls.  
**Examples.** (1) `K1A` versus `K1N`. (2) `SM7G` versus `SM7Z`. (3) `N5AB` versus `N0AB`.  
**Validation.** Exactly one semantic position differs.

#### Family `callsign_partial_copy`

**Task.** Fill one missing callsign character from a repeat or phonetic clarification.  
**Response/template.** One character.  
**Derivation.** Combine partial copy with supplied repair evidence.  
**Difficulty.** evidence type and confusable alternatives.  
**Feedback.** Tie the recovered character to its Morse or phonetic evidence.  
**Examples.** (1) `K1?B`, clarification “Alfa” → `A`. (2) `SM?Q`, repeated digit audio → `7`. (3) `N4PL/?`, “portable” → `P`.  
**Validation.** Evidence uniquely determines the missing character.

#### Family `callsign_call_order`

**Task.** Determine which displayed identifier belongs before or after `DE`.  
**Response/template.** Two ordered fields.  
**Derivation.** Under the profile, called/calling target precedes `DE`; current sender follows it.  
**Difficulty.** general versus directed call and reply direction.  
**Feedback.** Label “station addressed” and “station transmitting.”  
**Examples.** (1) `K1AB DE SM7QX` → sender `SM7QX`. (2) reply reverses roles. (3) after `CQ DE N4PL`, `N4PL` is caller/sender.  
**Validation.** Scenario state, not string position alone, establishes roles.

#### Family `callsign_audit`

**Task.** Find one malformed, misleading, or misplaced practice identifier.  
**Response/template.** Select and correct.  
**Derivation.** Apply grammar, synthetic-data policy, and procedure roles.  
**Difficulty.** missing numeral, invalid designator, real-allocation claim, role reversal.  
**Feedback.** State whether the defect is syntax, copying, or policy.  
**Examples.** (1) `ABCDEF` lacks required numeral. (2) app labels a generated call “assigned in Sweden” → unsupported. (3) sender placed before `DE` in a directed call.  
**Validation.** Exactly one defect; valid practice strings are not rejected because of real-world prefix knowledge.

## 7. Category: Radio procedure and turn-taking

### Category purpose

Train the compact sequencing and role reasoning needed to call, answer, exchange bounded information, repair a copy, hand over, and close under the named profile.

### Learn

In `amateur-cw-practice-v1`, `DE` introduces the sending station's identity. `<K>` invites a reply from any station; `<KN>` invites only the named station. `<AS>` asks the other party to wait, `<BT>` separates sections, `<AR>` marks the end of a message/transmission, and `<SK>` closes the contact. Procedures vary in real operation, so answer only under the profile shown.

### Prerequisites

Callsign parsing, active prosigns, word boundaries, and short audio copy.

### Category boundaries

This category owns role order and state transitions. Memorizing raw prosign patterns belongs in Category 2, audio copy in Category 4, and report/Q-signal meanings in Category 8.

### Subcategories

1. calls and replies;
2. invitations and endings;
3. exchange fields;
4. repair and waiting;
5. sequence audits.

### Common misconceptions

- Reading `DE` as a callsign component.
- Reversing sender and called station.
- Using `<K>` when only one named station should respond.
- Using `<SK>` merely to end one turn.
- Treating `<AR>` and `<SK>` as universally interchangeable.
- Continuing to send after handing over the turn.

### Families

#### Family `procedure_cq_call`

**Task.** Assemble or recognize a complete general call.  
**Response/template.** Ordered tokens; “Complete the general call from `{self}`.”  
**Derivation.** `CQ CQ CQ DE self self <K>`.  
**Difficulty.** missing/reordered tokens, audio copy, repetition count supplied by profile.  
**Feedback.** Label call, sender identity, and invitation.  
**Examples.** (1) `CQ CQ CQ DE K1AB K1AB <K>`. (2) identify missing `DE`. (3) reject a close `<SK>` where invitation `<K>` is required.  
**Validation.** Exact repetition count is part of this teaching template, not claimed as a universal minimum.

#### Family `procedure_directed_call`

**Task.** Build a call to one named station.  
**Response/template.** Ordered tokens.  
**Derivation.** `other other DE self self <K>`.  
**Difficulty.** role reversal and repeated identifiers.  
**Feedback.** Mark addressed station before `DE` and sender after.  
**Examples.** (1) `SM7QX SM7QX DE K1AB K1AB <K>`. (2) choose the caller. (3) repair swapped identities.  
**Validation.** The two synthetic callsigns are distinct.

#### Family `procedure_reply`

**Task.** Choose or construct the proper reply from the called station.  
**Response/template.** Ordered tokens.  
**Derivation.** Name caller, `DE`, give reply station identity, then `<KN>` in the restricted-handover template.  
**Difficulty.** state tracking after audio call, `K` versus `KN`.  
**Feedback.** Show how roles reversed when the responder became sender.  
**Examples.** (1) to `... DE K1AB <K>`, `SM7QX` replies `K1AB DE SM7QX <KN>`. (2) identify wrong self-call. (3) reconstruct from a partial copy.  
**Validation.** Only the station addressed in the prior state may make the directed reply.

#### Family `procedure_de_role`

**Task.** Identify sender and addressee around `DE`.  
**Response/template.** Named fields.  
**Derivation.** Within the displayed profile sequence, tokens after `DE` identify the current sender.  
**Difficulty.** CQ, directed call, reply, repeated calls.  
**Feedback.** Expand `DE` as “from.”  
**Examples.** (1) `CQ DE K1AB` → sender K1AB. (2) `K1AB DE SM7QX` → sender SM7QX. (3) changing turn changes which call follows `DE`.  
**Validation.** Do not generalize string parsing beyond supported templates.

#### Family `procedure_k_kn`

**Task.** Select `<K>` or `<KN>` for a stated invitation.  
**Response/template.** Single choice.  
**Derivation.** Any station → `<K>`; named station only → `<KN>`.  
**Difficulty.** implied addressee and exchange state.  
**Feedback.** State who is permitted to take the next turn under the profile.  
**Examples.** (1) CQ ending → `<K>`. (2) hand back to K1AB only → `<KN>`. (3) choose why `<K>` is too broad in a two-station repair.  
**Validation.** Prompt explicitly states whether invitation is open or restricted.

#### Family `procedure_ar_sk`

**Task.** Distinguish end-of-message from end-of-contact.  
**Response/template.** `<AR>`/`<SK>` choice.  
**Derivation.** Use semantic contact state, not pattern similarity.  
**Difficulty.** a final message that does or does not close the contact.  
**Feedback.** Explain the lifecycle transition.  
**Examples.** (1) message ends but contact continues → `<AR>`. (2) final goodbye/close → `<SK>`. (3) reject `<SK>` before expected reply.  
**Validation.** The profile's meaning is shown; other practices are not graded.

#### Family `procedure_bt_separator`

**Task.** Insert or interpret `<BT>` between sections of a short exchange.  
**Response/template.** Token selection or section ordering.  
**Derivation.** `<BT>` separates message parts without ending the turn by itself.  
**Difficulty.** multiple fields and collision with equals-sign glyph.  
**Feedback.** Show section boundaries and shared `-...-` pattern.  
**Examples.** (1) `RST 579 <BT> NAME ANA`. (2) `<BT>` does not invite a reply. (3) in procedure context, `-...-` is separator rather than typed `=`.  
**Validation.** Context establishes the semantic token.

#### Family `procedure_wait`

**Task.** Choose the response when the current sender needs the other station to wait.  
**Response/template.** Prosign or next-state choice.  
**Derivation.** Send `<AS>`; state remains with or pauses for the current exchange as defined by scenario.  
**Difficulty.** distinguish waiting from handing over or closing.  
**Feedback.** Compare `<AS>`, `<K>`, and `<SK>`.  
**Examples.** (1) need time to check a detail → `<AS>`. (2) ready for reply → not `<AS>`, use invitation. (3) wait is `.-...` continuous.  
**Validation.** The scenario does not require a real-world time estimate.

#### Family `procedure_received`

**Task.** Interpret or place procedural `R` after correct receipt.  
**Response/template.** letter/token choice.  
**Derivation.** `R` acknowledges correct receipt in this profile.  
**Difficulty.** distinguish from `QSL`, signal-report `R` digit, and letter content.  
**Feedback.** State that it is the ordinary Morse letter `R`.  
**Examples.** (1) copied instruction correctly → `R`. (2) `R` in `RST` labels readability, not acknowledgement. (3) `<R>` is not the canonical token notation here.  
**Validation.** Context identifies the procedural use.

#### Family `procedure_repeat_correction`

**Task.** Choose a bounded repair after a missed or mistaken field.  
**Response/template.** ordered action or token sequence.  
**Derivation.** Scenario declares allowed request/repeat grammar and correction scope.  
**Difficulty.** missed field, partial callsign, one versus multiple repeats.  
**Feedback.** Show original evidence, request, and corrected copy.  
**Examples.** (1) request slower sending with `QRS`. (2) resend callsign after partial copy. (3) sender uses `<HH>` then repeats the incorrect field.  
**Validation.** Avoid judging unrestricted natural-language repair phrasing.

#### Family `procedure_exchange_order`

**Task.** Put a small exchange's fields in the profile's displayed order.  
**Response/template.** ordered sequence.  
**Derivation.** Use a scenario-specific schema such as identity → RST → name → QTH → invitation.  
**Difficulty.** number of fields and inserted separators.  
**Feedback.** Label each field's purpose; note that order is a teaching template.  
**Examples.** (1) `K1AB DE SM7QX RST 579 <BT> NAME ANA <KN>`. (2) place sender identity before report body. (3) handover is last.  
**Validation.** The expected schema is visible in Learn/help and saved with the question.

#### Family `procedure_turn_taking`

**Task.** Determine who may send next after a short transcript.  
**Response/template.** station/any/none choice.  
**Derivation.** Apply latest invitation or close token to state.  
**Difficulty.** several turns, waits, restricted invitations.  
**Feedback.** Highlight the token that changed permission.  
**Examples.** (1) after CQ `<K>` → any answering station. (2) after `K1AB <KN>` → K1AB only. (3) after `<SK>` → contact closed.  
**Validation.** State transition is deterministic; transcript contains no contradictory terminal tokens.

#### Family `procedure_audit`

**Task.** Find one procedural error in a bounded transcript.  
**Response/template.** select token/turn and correction.  
**Derivation.** Simulate the profile state machine.  
**Difficulty.** role swap, identifier omission, wrong invitation, premature close.  
**Feedback.** Give state before error, violated rule, and corrected transition.  
**Examples.** (1) responder repeats own call before `DE`. (2) third station answers after `<KN>`. (3) exchange continues after `<SK>`.  
**Validation.** Exactly one earliest state-machine violation; later consequences are not separate seeded errors.

## 8. Category: Signal reports and Q signals

### Category purpose

Make common compact reports and operating abbreviations meaningful in scenarios without pretending subjective conventions are calibrated measurements.

### Learn

For CW, an `RST` report has readability `1–5`, strength `1–9`, and tone `1–9`. A report such as `579` means readability 5, strength 7, tone 9. In some contest-style exchanges, `N` abbreviates `9`, so `5NN` means `599`. For voice, use only `RS`.

Q signals compress recurring ideas. In this profile: `QRS` asks for slower sending, `QRQ` faster, `QRM` identifies other-station interference, `QRN` atmospheric/static noise, `QSB` fading, `QRZ` asks who is calling, `QTH` concerns location, `QSL` acknowledges receipt, and `QSO` means a radio contact.

### Prerequisites

Digits, short-group copy, and the concept of an exchange field.

### Category boundaries

This category teaches the declared report dimensions and Q-signal meanings. Signal physics, S-meter calibration, propagation, language-independent ITU question/answer forms, and the complete Q-code are excluded.

### Subcategories

1. RS/RST structure;
2. supplied-descriptor reports;
3. shorthand;
4. Q signals for speed, impairment, identity, and exchange;
5. report audits.

### Common misconceptions

- Reading `599` as one five-hundred-ninety-nine-valued quantity.
- Giving a tone digit for an `RS` voice report.
- Treating strength as transmitter power or distance.
- Believing synthetic noise uniquely determines an official RST value.
- Reading `5NN` literally as letters rather than contest shorthand.
- Treating every `Q`-initial three-letter group as a Q signal.

### Families

#### Family `report_rs_parse`

**Task.** Parse a two-digit voice `RS` report into readability and strength.  
**Response/template.** Two named integer fields.  
**Derivation.** First digit `R` in 1–5, second `S` in 1–9.  
**Difficulty.** reverse construction and validity checking.  
**Feedback.** Name each scale and valid range.  
**Examples.** (1) `59` → R5/S9. (2) R3/S6 → `36`. (3) `599` is not an RS-only report.  
**Validation.** Although this app centers on CW, RS appears only to teach the contrast.

#### Family `report_rst_parse`

**Task.** Parse a CW report into readability, strength, and tone.  
**Response/template.** Three named fields.  
**Derivation.** Read digits in R-S-T order.  
**Difficulty.** shorthand and scenario context.  
**Feedback.** Expand every dimension.  
**Examples.** (1) `579` → R5/S7/T9. (2) `345` → R3/S4/T5. (3) `599` → R5/S9/T9.  
**Validation.** Every digit lies in its dimension's range.

#### Family `report_rst_construct`

**Task.** Construct RST from three supplied scale descriptions or values.  
**Response/template.** Three-digit string.  
**Derivation.** Map each supplied descriptor through the displayed, versioned scale table.  
**Difficulty.** prose descriptors, adjacent levels, field order.  
**Feedback.** Show each descriptor-to-digit mapping.  
**Examples.** (1) R5/S7/T9 → `579`. (2) “readable with considerable difficulty” under a supplied R3 row plus S4/T8 → `348`. (3) reverse a transposed `795` to `579`.  
**Validation.** Descriptors are quoted/paraphrased from the app's own scale table and uniquely map within that table.

#### Family `report_5nn_shorthand`

**Task.** Expand or encode contest-style `N`-for-`9` shorthand.  
**Response/template.** report string.  
**Derivation.** In the declared context only, replace each report digit 9 with `N` or expand `N` to 9.  
**Difficulty.** mixed digits and position.  
**Feedback.** Expand the report before interpreting dimensions.  
**Examples.** (1) `5NN` → `599`. (2) `579` → `57N`. (3) outside shorthand context, `N` remains a Morse letter.  
**Validation.** The prompt explicitly labels contest shorthand; `N` is never globally rewritten.

#### Family `report_audio_descriptor`

**Task.** Apply the app's disclosed synthetic-signal classification or choose why no objective RST follows.  
**Response/template.** report field(s) or “insufficient information.”  
**Derivation.** Use supplied profile parameters/descriptors, not subjective listening alone.  
**Difficulty.** multiple impairments and separating R/S/T concepts.  
**Feedback.** Tie answer to disclosed descriptors and explain subjectivity.  
**Examples.** (1) explicit “R=4, S=6, T=9” → `469`. (2) clean tone plus unknown strength/readability → cannot derive full RST. (3) fading affects copy but is not itself an RST digit.  
**Validation.** No hidden DSP threshold claims to reproduce a real receiver report.

#### Family `qsignal_qrs_qrq`

**Task.** Choose whether to request slower or faster sending.  
**Response/template.** `QRS`/`QRQ`.  
**Derivation.** Match desired speed direction.  
**Difficulty.** negative wording and current-versus-target speed.  
**Feedback.** Expand the selected signal in plain language.  
**Examples.** (1) cannot copy at current speed → `QRS`. (2) ask to increase speed → `QRQ`. (3) `QRS` does not mean weak signal.  
**Validation.** Scenario states the intended change unambiguously.

#### Family `qsignal_qrm_qrn_qsb`

**Task.** Label a described or synthesized impairment.  
**Response/template.** one Q signal.  
**Derivation.** other stations → QRM; atmospheric/static noise → QRN; fading → QSB.  
**Difficulty.** mixed but one dominant declared cause.  
**Feedback.** Name the evidence distinguishing the three.  
**Examples.** (1) another keyed signal overlaps → QRM. (2) static crashes → QRN. (3) strength rises/falls smoothly → QSB.  
**Validation.** Audio metadata establishes cause; sound alone is not used to assert a real propagation diagnosis.

#### Family `qsignal_qth_qsl_qso`

**Task.** Select the Q signal for location, receipt acknowledgement, or contact.  
**Response/template.** Q-signal choice.  
**Derivation.** Use profile table.  
**Difficulty.** contextual noun/verb use and similar-looking codes.  
**Feedback.** Restate the bounded teaching meaning.  
**Examples.** (1) ask/give location → QTH. (2) confirm receipt → QSL. (3) completed radio contact → QSO.  
**Validation.** Prompts do not require broader formal Q-code variants not taught.

#### Family `qsignal_qrz_identity`

**Task.** Choose `QRZ` when asking which station is calling.  
**Response/template.** signal or scenario choice.  
**Derivation.** Match identity-repair scenario.  
**Difficulty.** distinguish from `CQ` and repeating own call.  
**Feedback.** Contrast “who is calling me?” with a general call.  
**Examples.** (1) heard an incomplete caller → `QRZ`. (2) seeking any contact → CQ, not QRZ. (3) use a repeat to recover the missing identity.  
**Validation.** The profile meaning is displayed; no claim about every conversational use.

#### Family `report_exchange_copy`

**Task.** Copy and parse a report-bearing exchange field from audio.  
**Response/template.** callsign/report named fields.  
**Derivation.** Decode exact generated tokens, then parse report grammar.  
**Difficulty.** speed, shorthand, separators, mild impairment.  
**Feedback.** Separate copy errors from report-interpretation errors.  
**Examples.** (1) `K1AB RST 579`. (2) `RST 5NN` → `599`. (3) report repeated after a fade.  
**Validation.** Generated reports are valid, and shorthand context is tagged.

#### Family `report_qsignal_audit`

**Task.** Find one invalid report or misused Q signal in a short scenario.  
**Response/template.** select and correct.  
**Derivation.** Check dimension ranges, service form, shorthand context, and signal meaning.  
**Difficulty.** one near-valid digit or plausible wrong Q signal.  
**Feedback.** Name the violated range or semantic distinction.  
**Examples.** (1) `R=7` invalid; range 1–5. (2) voice `RST 599` improperly includes tone. (3) smooth fading labeled QRM should be QSB.  
**Validation.** Exactly one defect and no dependency on subjective quality judgment.

## 9. Category: Message copy and transcription discipline

### Category purpose

Train sustained, position-preserving copy of bounded messages and recovery from individual misses without relying on word guessing.

### Learn

Write what was sent, not what seems likely. Keep the group structure. If one character is missed during a live attempt, enter `?` and continue so one miss does not shift everything after it. After submission, compare by position, replay the local region, and repair from a repeat when one is provided.

### Prerequisites

Audio groups, digits, punctuation, prosigns, and callsigns as used by the selected family.

### Category boundaries

This category measures transcription. Choosing a procedural response belongs in Categories 7 and 10. Long-form message handling and real traffic forms are excluded.

### Subcategories

1. random groups;
2. boundaries and punctuation;
3. structured fields;
4. error localization and checks.

### Common misconceptions

- Removing leading zeroes.
- Collapsing or inventing word boundaries.
- Letting one omission shift all following characters.
- Autocorrecting an unlikely group into a familiar word.
- Writing prosign notation as literal transmitted angle brackets.

### Families

#### Family `copy_letter_groups`

**Task.** Copy multiple fixed-length letter groups.  
**Response/template.** groups separated by spaces.  
**Derivation.** Exact generated group sequence.  
**Difficulty.** group count/length, speed, active alphabet.  
**Feedback.** Align by fixed group positions.  
**Examples.** (1) `AE NT`. (2) `KMR UDA`. (3) five groups of five letters.  
**Validation.** Generator retains group boundaries independently of word semantics.

#### Family `copy_number_groups`

**Task.** Copy grouped numeric data exactly.  
**Response/template.** digit groups as strings.  
**Derivation.** Exact source.  
**Difficulty.** leading zeroes, repeats, length, speed.  
**Feedback.** Flag omission/transposition and preserve formatting.  
**Examples.** (1) `05 19`. (2) `007 300`. (3) `48291 00476`.  
**Validation.** No numeric parsing strips zeroes.

#### Family `copy_mixed_groups`

**Task.** Copy multiple alphanumeric groups.  
**Response/template.** upper-case groups.  
**Derivation.** Exact source.  
**Difficulty.** class switches and confusable rhythms.  
**Feedback.** Per-character edit alignment.  
**Examples.** (1) `A7 K2`. (2) `R5TM 0QX`. (3) groups include slash only when taught.  
**Validation.** Font and labels distinguish `O`/`0`, but audio remains authoritative.

#### Family `copy_word_boundaries`

**Task.** Insert words based on seven-unit gaps.  
**Response/template.** short phrase with spaces.  
**Derivation.** Decode event boundary roles.  
**Difficulty.** short words, Farnsworth spacing, mild fading away from boundary.  
**Feedback.** Visualize 3u versus 7u gaps.  
**Examples.** (1) `CQ DE`. (2) `NAME ANA`. (3) distinguish `AN A` from `A NA` by gap placement.  
**Validation.** Exact mode keeps gap classes audibly separated.

#### Family `copy_punctuation`

**Task.** Copy a short message containing selected punctuation.  
**Response/template.** text.  
**Derivation.** Exact token stream.  
**Difficulty.** punctuation set and position.  
**Feedback.** Name, display, and replay punctuation separately.  
**Examples.** (1) `QTH?`. (2) `A/B`. (3) `TEST, TEST.`.  
**Validation.** Only taught punctuation enters audio; locale input can produce required glyphs.

#### Family `copy_embedded_prosigns`

**Task.** Transcribe message text and bracketed semantic prosigns.  
**Response/template.** token sequence.  
**Derivation.** Decode in a procedure-aware token domain.  
**Difficulty.** ordinary letters matching prosign names, shared punctuation patterns.  
**Feedback.** Explain each boundary and semantic token.  
**Examples.** (1) `CQ <K>`. (2) `RST 579 <BT> NAME ANA <KN>`. (3) `73 <SK>`.  
**Validation.** Context makes every shared pattern unambiguous.

#### Family `copy_structured_fields`

**Task.** Enter copied content into named fields.  
**Response/template.** callsign, report, name/location/serial fields.  
**Derivation.** Parse a generated schema-delimited token stream.  
**Difficulty.** field count, order, repeat/repair.  
**Feedback.** Grade audio copy and field assignment separately.  
**Examples.** (1) CALL `K1AB`, RST `579`. (2) NAME `ANA`, QTH `LUND`. (3) SERIAL `007`.  
**Validation.** Vocabulary is synthetic/controlled and not tied to a real person.

#### Family `copy_group_count_checksum`

**Task.** Verify group count or a simple supplied checksum after copying.  
**Response/template.** integer plus text where appropriate.  
**Derivation.** Count source groups or apply the displayed toy checksum.  
**Difficulty.** longer copy and detecting a missing group.  
**Feedback.** Show count boundaries and mismatch location.  
**Examples.** (1) `AB CD EF` → 3 groups. (2) declared 5 groups but 4 copied → one missing. (3) digit sum modulo 10 only when formula is shown.  
**Validation.** Never imply the toy checksum is real traffic procedure or cryptographic integrity.

#### Family `copy_error_location`

**Task.** Locate the first substitution, insertion, deletion, or transposition between sent and copied text.  
**Response/template.** position and error type.  
**Derivation.** Use deterministic edit alignment with declared tie-breaking.  
**Difficulty.** repeats and multiple later cascading positions.  
**Feedback.** Replay a small audio window around the first edit.  
**Examples.** (1) sent `K1AB`, copied `K1NB` → substitution at 3. (2) omitted zero shifts rest → deletion. (3) `AB` copied `BA` → transposition when enabled.  
**Validation.** Seed one target edit or accept every minimum alignment under documented ties.

#### Family `copy_audit`

**Task.** Find one flaw in a copying interface, source, or scoring explanation.  
**Response/template.** select flaw and remedy.  
**Derivation.** Apply copy, normalization, timeline, and accessibility contracts.  
**Difficulty.** leading-zero loss, autocorrect, hidden replay penalty, ambiguous shared token.  
**Feedback.** Explain why the flaw corrupts learning evidence.  
**Examples.** (1) numeric input turns `007` into `7`. (2) spellcheck changes `QSL` to a word. (3) decoder requires `<AR>` where `+` is equally valid without context.  
**Validation.** Exactly one material defect.

## 10. Category: Operating scenarios

### Category purpose

Combine listening, identifiers, reports, repair, and state transitions in small consequential decisions while staying inside a deterministic simulation.

### Learn

Track four things: who is sending, who is addressed, what information has been exchanged, and what the final procedural token permits next. Copy first; then decide. A good response repairs uncertainty rather than inventing missing content.

### Prerequisites

Categories 4, 6, 7, and the relevant parts of 8.

### Category boundaries

Scenarios are synthetic, audio-only simulations. They do not model frequency choice, propagation, pileups, contest scoring, traffic nets, emergency deployment, or jurisdictional duties.

### Subcategories

1. calls and directed contacts;
2. weak/noisy copy repair;
3. complete bounded exchanges;
4. distress recognition and safety.

### Common misconceptions

- Answering a directed invitation addressed to someone else.
- Fabricating a missed callsign or report.
- Asking for more speed after copy failure.
- Closing before an expected exchange field is acknowledged.
- Treating a simulated distress signal as an instruction to transmit.

### Families

#### Family `scenario_call_response`

**Task.** Hear a general call and choose/build a valid reply as one synthetic station.  
**Response/template.** ordered tokens, optionally keyed.  
**Derivation.** Decode caller, assume assigned responder role, apply reply template.  
**Difficulty.** audio speed, callsign length, mild impairment.  
**Feedback.** Separate copied caller identity from procedure construction.  
**Examples.** (1) hear `CQ ... DE K1AB <K>`, reply from SM7QX. (2) request repeat if caller identity is incomplete. (3) reject a reply using the wrong self identifier.  
**Validation.** Exact-answer instances guarantee caller can be copied; uncertainty instances offer repair.

#### Family `scenario_directed_contact`

**Task.** Decide whether the learner's assigned station may answer a directed call or `<KN>`.  
**Response/template.** answer/wait plus optional response.  
**Derivation.** Compare addressed identifier with assigned synthetic identifier.  
**Difficulty.** similar callsigns, several transcript turns.  
**Feedback.** Highlight named addressee.  
**Examples.** (1) call names learner → answer. (2) one differing suffix letter → wait. (3) `<KN>` returns only to prior named station.  
**Validation.** Assigned and non-assigned calls are distinct but may be controlled minimal pairs.

#### Family `scenario_weak_signal_adapt`

**Task.** Choose a useful bounded adaptation after declared copy difficulty.  
**Response/template.** `QRS`, repeat, or continue choice.  
**Derivation.** Match evidence: excessive speed → QRS; isolated missed field → repeat; correct copy → acknowledge/continue.  
**Difficulty.** mixed symptoms and partial copy.  
**Feedback.** Tie action to the specific failure.  
**Examples.** (1) every character too fast → QRS. (2) only callsign digit faded → request/replay identifier. (3) complete repeated copy → proceed.  
**Validation.** There is one clearly best action within the provided menu, not a claim about all real operating choices.

#### Family `scenario_repeat_repair`

**Task.** Recover a field across an initial copy, request, and repeat.  
**Response/template.** corrected named field.  
**Derivation.** Combine evidence while preserving unknown positions until resolved.  
**Difficulty.** multiple uncertain characters and different impairments per repeat.  
**Feedback.** Show evidence provenance for each repaired character.  
**Examples.** (1) call digit recovered on second copy. (2) RST final digit recovered from `5N?` plus clean repeat. (3) conflicting evidence remains unknown rather than guessed.  
**Validation.** Exact instances resolve uniquely; ambiguous instances grade uncertainty handling.

#### Family `scenario_exchange_complete`

**Task.** Advance a small contact through required fields and close correctly.  
**Response/template.** state choice, copy fields, and ordered response.  
**Derivation.** Execute versioned scenario schema and procedure state machine.  
**Difficulty.** number of turns, reports, separators, repairs.  
**Feedback.** Show a state timeline with completed and pending fields.  
**Examples.** (1) call → reply → RST → acknowledge → close. (2) insert name/QTH fields. (3) a repair delays but does not duplicate field completion.  
**Validation.** Generator enumerates all legal next actions in the bounded grammar and ensures the intended answer is unique or accepts the full legal set.

#### Family `scenario_distress_recognition`

**Task.** Recognize the continuous `SOS` pattern and choose the safe training-app response.  
**Response/template.** recognition plus stop/consult-official-guidance choice.  
**Derivation.** Match `...---...` continuous; follow simulation safety policy.  
**Difficulty.** clean versus mildly impaired recognition, contrast with separately spaced `S O S`.  
**Feedback.** Label it “SIMULATION”; explain that real obligations and procedures depend on service/jurisdiction and that the app cannot direct an RF response.  
**Examples.** (1) identify continuous `SOS`. (2) do not use it as a routine separator. (3) stop scenario and consult local official emergency guidance rather than transmitting from the app.  
**Validation.** Never gamify response speed, never create a fake real emergency, and never award points for sending distress traffic.

#### Family `scenario_audit`

**Task.** Find the first unsafe, unsupported, or procedurally invalid action in a scenario.  
**Response/template.** select action and reason.  
**Derivation.** Apply state machine and safety/legal boundaries.  
**Difficulty.** procedural versus policy defects.  
**Feedback.** Distinguish “wrong under teaching profile” from “outside app authority.”  
**Examples.** (1) app instructs unlicensed RF transmission → outside scope. (2) station answers another's `<KN>` → profile violation. (3) incomplete call is guessed and logged as real → evidence/privacy defect.  
**Validation.** Exactly one earliest material defect; no hidden jurisdiction trivia.

## 11. Category: Integrated fluency drills

### Category purpose

Combine sound recognition, accurate copy, clean keying, and procedure decisions while retaining diagnostic scoring for each component.

### Learn

Integrated practice is a sequence, not one mystery score: listen, preserve uncertain positions, interpret the exchange state, choose a response, and send or assemble it. The review shows which stage failed so a procedure mistake is not blamed on hearing and a copy error is not blamed on timing.

### Prerequisites

Mastery of the component family at the selected content and speed range.

### Category boundaries

Integrated drills use only already introduced symbols, vocabulary, procedures, and impairments. They do not introduce new rules inside a timed session.

### Subcategories

1. receive and reply;
2. multi-turn copy;
3. sending;
4. adaptive conditions;
5. audit.

### Families

#### Family `integrated_receive_reply`

**Task.** Copy an incoming call or handover, then select a valid next response.  
**Response/template.** copied fields plus ordered response tokens.  
**Derivation.** Audio decoder answer and procedure state are evaluated independently, then combined.  
**Difficulty.** callsign similarity, speed, report field, invitation type.  
**Feedback.** Stage-by-stage outcome.  
**Examples.** (1) CQ and reply. (2) directed `<KN>` and identity check. (3) partial copy requiring repeat instead of reply.  
**Validation.** Legal response set is derived from explicit state.

#### Family `integrated_copy_exchange`

**Task.** Copy a short multi-turn synthetic contact into structured fields.  
**Response/template.** transcript or named fields plus turn owners.  
**Derivation.** Deterministic event/audio sources and scenario schema.  
**Difficulty.** turns, fields, prosigns, mild impairments.  
**Feedback.** synchronized text/audio/state timeline.  
**Examples.** (1) callsigns and RST. (2) RST, name, QTH. (3) repeat repairs a field before close.  
**Validation.** No personal or real-station data; total duration remains bounded.

#### Family `integrated_send_exchange`

**Task.** Key the learner station's generated response inside a simulated contact.  
**Response/template.** keying timeline.  
**Derivation.** Compare semantic response validity, sent content, and timing separately.  
**Difficulty.** response length, speed, spacing target, one correction.  
**Feedback.** procedure/content/timing panels.  
**Examples.** (1) send callsign reply. (2) send `RST 579 <KN>`. (3) correct one mistyped field with `<HH>`.  
**Validation.** A procedure-valid but poorly timed response and a cleanly timed wrong response receive different diagnostics.

#### Family `integrated_adaptive_conditions`

**Task.** Maintain target accuracy as speed, spacing, or one impairment changes between short rounds.  
**Response/template.** copy/send depending on round, with condition labels after response.  
**Derivation.** Seeded staircase changes one primary dimension at a time.  
**Difficulty.** adaptive but capped speed/impairment and mixed content.  
**Feedback.** attribute changes to the manipulated dimension without overstating causation.  
**Examples.** (1) reduce Farnsworth spacing after stable copy. (2) vary pitch while holding timing. (3) add mild QSB only after clean success.  
**Validation.** Adaptation has floors, ceilings, reversal rules, and recovery rounds; no endless acceleration.

#### Family `integrated_session_audit`

**Task.** Diagnose a flawed generated session or learner-facing summary.  
**Response/template.** select defect and evidence.  
**Derivation.** Check inventory, timing, state, audio safety, callsign policy, and metric decomposition.  
**Difficulty.** cross-layer fault with plausible downstream symptoms.  
**Feedback.** identify source layer and affected outputs.  
**Examples.** (1) audio and answer use different code tables. (2) procedure score falls because of a copy error but is reported as rule ignorance. (3) replay schedules overlap and double volume.  
**Validation.** Exactly one root defect; audit fixtures are deterministic.

## 12. Topic-level progression

### Level 1 — Rhythm introduction

- visual and slow audio for a very small character set;
- `E`, `T`, then balanced contrasting letters;
- dots, dashes, and the three gap classes;
- one-character recognition and keying;
- no impairment and unlimited replay.

### Level 2 — Core alphabet and digits

- expanding mixed character groups;
- standard timing and elementary WPM conversion;
- two- to four-character copy;
- stable character spacing;
- introductory callsign structure;
- visual pattern hidden by default after first response.

### Level 3 — Working copy

- full letters, digits, selected punctuation;
- short words and synthetic callsigns;
- Farnsworth character/effective-speed distinction;
- prosigns versus normally spaced letters;
- calls, replies, `DE`, `<K>`, `<KN>`, and short RST fields;
- clean audio with modest pitch variation.

### Level 4 — Procedure and repair

- longer groups and structured fields;
- `<AS>`, `<AR>`, `<BT>`, `<SK>`, `<HH>`;
- QRS/QRQ, QRM/QRN/QSB, QTH/QSL/QSO/QRZ;
- repeats, correction, turn-taking, and close;
- mild seeded noise/fading and explicit uncertainty;
- sending scored for mark and gap rhythm.

### Level 5 — Integrated fluency

- short multi-turn contacts;
- smaller Farnsworth spacing and higher character speed;
- callsign minimal pairs, shorthand reports, and repair under impairment;
- copy plus choose plus send;
- deterministic audits and adaptive mixed sessions;
- distress recognition as a rare, unscored safety scenario.

Level changes should alter one or two meaningful dimensions at a time. A learner who is fast on letters but weak on digits or procedure receives targeted practice rather than an undifferentiated level increase.

## 13. Adaptive guidance

Track mastery separately for:

```text
character or token
encode / decode / audio / send direction
character speed
effective speed
clean / pitch / QRN / QRM / QSB / jitter condition
copy length
mark timing
gap timing
callsign structure
procedure transition
RST or Q-signal concept
```

Recommended scheduling:

- introduce a few new symbols among a majority of established symbols;
- resurface confusable pairs using contrast trials followed by independent trials;
- increase character speed only after recognition is stable;
- reduce Farnsworth spacing separately from increasing character speed;
- add one impairment at a time, then include clean recovery trials;
- after a copy error, replay the smallest useful unit and later retest it in new context;
- after a sending error, target the relevant mark or gap ratio rather than repeating an entire exchange;
- interleave procedure recall with audio copy so the learner cannot pass on static vocabulary alone;
- cap consecutive audio trials and offer a silent visual/timing block without treating it as listening mastery.

An adaptive score must not permanently penalize replays, disability accommodations, device latency, a single accidental stuck key, or use of `?` to preserve copy position. Fluency metrics may record these facts separately.

## 14. Answer checking and feedback

### Symbolic checking

All expected Morse patterns come from the canonical table. Normalize cosmetic dot/dash whitespace, but preserve character and word boundaries when they are part of the task.

For messages, compare semantic token arrays rather than rendered strings:

```text
CHAR("A")
WORD_GAP
PROSIGN("SK")
```

This prevents `<SK>` from being confused with ordinary `S`, `K`, and prevents punctuation/prosign pattern collisions from being “resolved” without context.

### Copy checking

Use a deterministic edit alignment that can label:

- correct;
- substitution;
- insertion;
- deletion;
- optional adjacent transposition;
- learner-marked unknown `?`.

If multiple minimum alignments exist, either accept/report all equivalent localizations or apply a documented stable tie rule. Do not mark every character after one omission wrong by simple positional comparison.

### Numeric checking

Timing answers derive from exact rational unit counts where possible. Accept displayed-unit conversions and appropriate rounding. The solution must show:

1. the unit duration;
2. the semantic event count;
3. Farnsworth expansion, if any;
4. final conversion and rounding.

### Keying checking

Report at least:

```text
contentAccuracy
dotDurationCenter
dashDurationCenter
dashDotRatio
intraGapCenter
characterGapCenter
wordGapCenter
variationMetric
ambiguousEventCount
```

Never collapse these into the only visible score. Device timestamps and browser scheduling can be noisy; tolerance profiles must be forgiving, visible, calibrated locally, and tested on touch as well as keyboard input.

### Procedure checking

Represent a transcript as semantic acts, not a regex over display text:

```text
Call(type, target?, sender)
Identify(sender)
Field(kind, value)
Request(kind)
Acknowledge
Invite(scope)
Wait
EndMessage
Close
```

The state-machine validator returns the full set of allowed next acts. If more than one is permitted, use multiple-answer grading or narrow the scenario; never arbitrarily select one.

### Feedback sequence

For a failed integrated attempt:

1. show what audio was generated;
2. align what the learner copied;
3. identify semantic/procedure interpretation;
4. compare the constructed or keyed response;
5. show timing only for actual learner keying;
6. offer a clean isolated replay and one near transfer item.

Feedback should say what evidence distinguishes alternatives. “Incorrect” alone is insufficient.

## 15. Audio, rendering, localization, and accessibility

### Audio controls

- No autoplay.
- A visible play/replay button has an accessible label including content type, not the answer.
- Stop immediately cancels future scheduled sound and ramps active sound down without a click.
- Volume, tone frequency, and practice speed are adjustable; changes that would reveal an answer are disabled until response where necessary.
- A visual playback indicator must not expose the exact dot/dash pattern in an audio-only mastery trial.
- Audio settings persist locally but resettable defaults remain available.
- A “test tone” contains no graded Morse and uses the same safe gain chain.

### Visual representations

Supported views may include:

- dot/dash text;
- proportional mark/gap timeline;
- waveform envelope;
- callsign segmentation;
- procedure-state timeline;
- RST/Q-signal reference table.

Every diagram is generated from semantic events/data. It must not be a separately maintained answer illustration.

### Accessibility

- All controls are keyboard reachable and usable without drag.
- The sending key is large, has visible pressed state, supports `Space`, and does not steal text-entry keystrokes while an answer field is focused.
- Color is never the sole distinction between dots/dashes, correct/errors, stations, or fields.
- Timelines use shape, labels, and patterns in addition to color.
- Screen readers receive text alternatives for visual patterns and state diagrams.
- Captions/transcripts are available as an accessibility route after response or in a designated visual practice mode.
- A learner who cannot hear can practice visual decoding, timing, procedure, callsigns, and key construction. The app labels these skills accurately and does not award audio-recognition mastery from a text alternative.
- A learner who cannot hold a key can use two explicit Dot/Dash buttons or select elements. This practices encoding and procedure, not straight-key timing.
- Reduced-motion mode disables scrolling traces and flashing key indicators.
- The app does not rely on pitch discrimination; pitch variation is nuisance robustness, not a music test.

### Localization

Question prose, Learn text, feedback, punctuation names, RST descriptors, Q-signal explanations, and accessibility labels are locale data. These remain invariant:

- Morse patterns;
- callsign characters;
- `CQ`, `DE`, Q signals, and bracketed prosign tokens;
- semantic timing;
- profile IDs.

Translators may explain `DE` and Q signals in the UI but must not translate the transmitted tokens. A localized word-copy vocabulary has a locale-specific ID and coverage tests; random groups and identifiers remain language-neutral.

## 16. Generator and implementation architecture

Recommended modules:

```text
codeTable
tokenizer
morseEncoder
morseDecoder
timingProfile
eventTimeline
audioRenderer
impairmentRenderer
keyCapture
keyingAnalyzer
callsignGenerator
phoneticTable
procedureProfile
procedureStateMachine
reportAndQTables
questionGenerators
answerCheckers
renderers
adaptiveScheduler
seededRng
localeCatalog
```

### Determinism and seed contract

A question record stores:

```text
questionFamilyId
seed
generatorVersion
codeProfileId
procedureProfileId?
localeVocabularyId?
contentTokens
timingParameters
audioParameters
impairmentParameters
scenarioState?
expectedSemanticAnswer
```

The same record must reproduce the same semantic event schedule and impairment control data. Exact PCM identity across browser engines is not required, but a rendered-buffer implementation should be stable within its supported engine. Tests compare event times and bounded signal properties rather than fragile cross-platform sample hashes.

### Browser implementation

The app remains a standalone HTML/JS/CSS page:

- no backend;
- no network requirement after load;
- no runtime compiler;
- no radio or microphone permission;
- Web Audio is created lazily after user gesture;
- progress and preferences are local;
- generated audio need not be embedded as base64 because short tones are cheaper and more flexible to synthesize;
- an `AudioWorklet` may be used only if it remains bundled and offline; ordinary pre-rendered buffers are sufficient for v1.

### Source-of-truth separation

The semantic answer must exist before render:

```text
content tokens
  -> canonical Morse patterns
  -> event timeline
  -> clean audio
  -> optional impairment mix
```

Question wording, visual pattern, audio, expected copy, and explanation all consume this chain. No renderer independently re-encodes the answer.

The procedure chain is:

```text
scenario state
  -> allowed semantic acts
  -> selected/generated act
  -> transmitted tokens
  -> Morse/audio
```

This prevents an apparently plausible audio transcript from violating the scenario oracle.

## 17. Automated validation

### Table tests

- All 26 letters and 10 digits match the pinned table.
- Listed punctuation and prosigns match expected patterns.
- Ordinary-character patterns are unique within that domain.
- Every shared punctuation/prosign pattern has declared disambiguation behavior.
- Encode/decode round-trips every supported token sequence under its context.

### Timing tests

- Dot/dash/intra/character/word proportions are exactly `1/3/1/3/7`.
- `PARIS` with following word gap is 50 units.
- `u=1.2/W` for representative exact and decimal WPM values.
- Farnsworth `C=E` reduces to ordinary spacing.
- Farnsworth-generated `PARIS` duration is `60/E`.
- No timeline double-counts boundary gaps.
- Prosigns contain no character gap internally.
- Final-gap policy is explicit and test-covered.

### Audio tests

- Mark and gap boundaries match semantic timeline within renderer tolerance.
- Attack/release envelopes do not extend semantic event duration or clip.
- stop/replay prevents overlapping schedules.
- maximum mixed impairment gain stays within the safe limiter policy.
- seeded control envelopes reproduce.
- clean clips are distinguishable at supported speeds in browser/device smoke tests.
- audio-context interruption and resume cannot replay stale material.

### Keying tests

- duplicate key-down and key-up events are ignored safely;
- key release outside a pointer target is captured;
- missing release terminates at a bounded timeout and is reported;
- segment/classification fixtures cover ideal, jittered, ambiguous, and malformed traces;
- content and timing scores remain independent;
- touch timestamp behavior is smoke-tested on supported mobile browsers.

### Procedure tests

- every generated transcript begins in a legal state;
- expected next actions equal the state machine's allowed set;
- call/reply role reversal is correct;
- `<K>`, `<KN>`, `<AS>`, `<AR>`, and `<SK>` transition fixtures cover permitted and forbidden next acts;
- audits contain one earliest violation;
- scenario completion cannot continue after close;
- every displayed procedural rule names the profile version.

### Policy and accessibility tests

- all callsigns carry synthetic/practice labeling in prompt or persistent view;
- no generator contains frequency, power, actual callbook, or transmitter actions;
- `SOS` appears only in the dedicated safety family and never in random pools;
- no audio autoplays;
- every audio task has an accessible practice alternative and an accurate skill label;
- keyboard-only and reduced-motion flows complete every non-straight-key family;
- localization cannot alter semantic tokens or timing.

### Property-based and exhaustive checks

- exhaustively encode/decode every supported single token;
- exhaustively test every pair of active characters with each boundary type;
- generate thousands of callsigns and assert the practice grammar;
- generate thousands of schedules and assert positive monotonic event times;
- sample the full WPM/Farnsworth ranges and verify duration equations;
- enumerate bounded procedure states and ensure no impossible generated target;
- fuzz typed Morse normalization without accepting changed boundaries;
- fuzz input event streams for stuck keys, negative durations, and crashes.

## 18. Coverage requirements

The generator must measure semantic coverage, not just question count.

Minimum release gates:

- every letter and digit appears in encode, decode, audio, and eligible sending families;
- every listed punctuation item appears in both directions before advanced punctuation is enabled;
- every prosign appears as pattern, meaning, and sound, and is contrasted with letter spacing where applicable;
- ordinary, character-gap, word-gap, and Farnsworth schedules all receive direct coverage;
- clean, pitch-varied, noise, QRM, QSB, and jitter presets each have tested examples, with clean audio remaining the majority in early progression;
- callsigns cover every allowed prefix/suffix length and both optional designators;
- general call, directed call, reply, open/restricted invitation, wait, message end, contact close, repair, and acknowledgement all appear;
- valid `RS`, valid `RST`, `N` shorthand, and every included Q signal appear;
- insertion, deletion, substitution, transposition, and unknown-position copy feedback are tested;
- every audit family seeds each supported root defect over time;
- integrated drills cover success, uncertainty, repair, and close.

Recent-history constraints should prevent:

- the same character dominating;
- repeated use of one memorable callsign;
- predictable answer positions;
- a report distribution dominated by `599`;
- all weak-signal examples using the same impairment;
- procedural tokens appearing only in static definition questions.

## 19. Recommended views and v1 priorities

### Views

1. **Learn** — active character set, playable examples, timing explanation, and profile-scoped procedure cards.
2. **Listen** — single characters through bounded copy with replay controls.
3. **Send** — large key, live but non-leading timing display, and post-attempt analysis.
4. **Procedure** — callsign, report, Q-signal, and turn-state scenarios.
5. **Mixed session** — adaptive short blocks across established skills.
6. **Review** — error alignment, audio replay, timing trace, and near-transfer retry.
7. **Settings** — speed, Farnsworth effective speed, tone, volume, input mode, accessibility, locale, and reset.

### Recommended v1

Ship first:

- letters and digits;
- ordinary and Farnsworth timing;
- deterministic clean synthesized audio;
- isolated characters, groups, common words, and synthetic callsigns;
- straight-key character/group sending with transparent analysis;
- the core calls/replies and `DE`, `<K>`, `<KN>`, `<BT>`, `<AS>`, `<AR>`, `<SK>`, `<HH>`;
- basic RST, `5NN`, and the nine listed Q signals;
- mild single-source QRN/QRM/QSB presets;
- structured copy, review, localization, and accessibility routes.

Defer:

- additional alphabets and procedural repertoires;
- live microphone/receiver decoding;
- paddle/iambic modes;
- real callbook, logbook, contest, traffic-net, and emergency-operation features;
- arbitrary recording import;
- complex DSP filters or realistic channel simulation;
- jurisdiction-specific operating rules.

## 20. Topic-level quality checklist

Before release, confirm:

- [ ] The code table and timing model are pinned to `itu-international-morse-m1677-1`.
- [ ] Every procedure-dependent prompt names or inherits `amateur-cw-practice-v1`.
- [ ] Prosigns are semantic tokens and are never accidentally sent with letter spacing.
- [ ] Shared patterns such as `<BT>`/`=` and `<AR>`/`+` are disambiguated or multiply accepted.
- [ ] `PARIS`, exact-message, final-gap, and Farnsworth calculations are distinct.
- [ ] Audio is locally synthesized, click-reduced, safely gain-limited, user-started, stoppable, and deterministic from metadata.
- [ ] Replays cannot overlap.
- [ ] Key capture handles repeat, pointer release, interruption, and ambiguous timings.
- [ ] Content, timing, copy, and procedure scores remain separately explainable.
- [ ] Callsigns are synthetic, visibly marked practice data, and never presented as allocated or geographic.
- [ ] The app does not transmit, control RF equipment, or imply legal authority to operate.
- [ ] RST tasks use supplied scales/descriptors and do not pretend synthetic audio yields an objective report.
- [ ] Q signals are taught in scenarios and limited to the declared profile.
- [ ] Distress content exists only in the dedicated, clearly simulated safety family.
- [ ] Audio mastery is not awarded through a visual transcript accommodation.
- [ ] Every family can generate many semantically distinct instances.
- [ ] Every family has deterministic derivation, actionable feedback, three examples, and validation rules.
- [ ] Automated tests cover tables, event timing, audio bounds, input traces, state transitions, policy, accessibility, and localization.
