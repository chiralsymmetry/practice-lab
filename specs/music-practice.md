# Music Practice — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, notation/instrument renderer, Web Audio engine, performance-input checker, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Music Practice

### Topic goal

Develop practical musicianship by repeatedly connecting notation, sound, physical layout, theory, and performance. The learner should become faster and more accurate at reading and producing pitches/rhythms, hearing musical relationships, navigating an instrument, spelling scales/chords, and using harmony in generated musical contexts.

Actual music-making is central. The app must not reduce music to silent multiple-choice theory. Every major pitch, rhythm, interval, scale, and chord category should eventually alternate among:

- see it and name it;
- hear it and identify it;
- read it and play it;
- hear it and reproduce/notate it;
- construct it from a named target.

### Audience and prerequisites

The app supports beginners through intermediate learners.

- Beginner categories assume no staff-reading or theory knowledge.
- Later categories assume note letters `A..G`, counting to eight, basic fractions, and earlier app categories.
- No acoustic instrument, MIDI controller, microphone, or prior notation software is required.
- A clickable/touchable on-screen keyboard and tap surface provide a complete baseline path.

### Musical tradition and scope boundary

The initial app explicitly teaches a bounded subset of Western tonal music:

- twelve-tone equal temperament (12-TET);
- scientific pitch notation;
- five-line staff notation;
- treble, bass, alto, and tenor clefs;
- major/minor keys, diatonic modes, intervals, tertian triads/seventh chords, common-practice Roman numerals, and Nashville numbers;
- metered rhythm using whole through sixteenth values, rests, dots, ties, syncopation, simple/compound meter, and basic tuplets;
- keyboard plus configurable fretted instruments;
- monophonic and small-chord ear/performance exercises.

This scope is a useful practice system, not a claim that these conventions define music universally. Other tuning systems, non-Western notation/theory, groove traditions, improvisation languages, and repertoire-specific performance practices deserve separately designed models rather than being forced into this one.

### Scope

The topic includes:

- staff note reading/writing, clefs, ledger lines, accidentals, enharmonic spelling, keyboard location, and pitch/frequency relationships;
- generic/specific intervals, interval construction/inversion, key signatures, major/minor scales, diatonic modes, relative/parallel keys, and transposition;
- note/rest duration, measure completion, meter, beat subdivision, dotted notes, ties, tuplets, syncopation, tempo following, tapping, and rhythm dictation;
- triads, seventh chords, inversions, diatonic harmonization, Roman numerals, Nashville numbers, progression transposition, and elementary voice leading;
- keyboard/fretboard navigation, concert/written pitch for supported transposing instruments, sight-reading, scale/chord playing, and melodic performance;
- aural pitch comparison/matching, intervals, chords, scales/modes, melodies, rhythms, progressions, and tuning/beating;
- procedural or sampled local playback, replay/count-in controls, optional MIDI input, and optional microphone pitch input.

### Exclusions

Do not include in the initial version:

- automatic grading of expressive quality, tone beauty, embouchure, bowing, breath support, singing diction, pedaling, fingering technique, or stylistic authenticity;
- polyphonic microphone transcription, source separation, chord recognition from arbitrary live audio, beat tracking from recordings, or uploaded commercial music;
- unrestricted score engraving, MusicXML import/export, DAW editing, recording/mixing, effects production, or a general synthesizer;
- orchestration, counterpoint species, figured bass realization, Schenkerian/set-theory analysis, jazz chord-scale theory, microtonal harmony, or atonal analysis;
- double/triple accidentals in core drills, key signatures beyond seven accidentals, mixed/irregular meter, nested tuplets, polymeter, swing-ratio grading, or tempo rubato assessment;
- perfect-pitch claims; pitch identification should allow a reference tone unless the learner explicitly selects absolute-pitch mode;
- copyrighted melody reproduction beyond user-supplied content or short original/generated fragments;
- health claims, hearing diagnosis, or advice that replaces a music teacher/audiologist.

### Hearing, privacy, and physical-safety boundary

- Audio never starts before an explicit user gesture.
- Start at a conservative volume with a persistent master control and mute button.
- Use a limiter/soft clipper and short attack/release ramps to prevent clicks and sudden peaks.
- Do not normalize every example to maximum loudness.
- Warn against excessive headphone volume without claiming a numeric setting is universally safe.
- Microphone and MIDI access are requested only after the learner chooses that input method.
- Microphone audio is analyzed locally, never uploaded, recorded, or retained by default.
- Stop microphone tracks promptly when the exercise/input mode closes.
- No exercise requires singing outside a user-declared comfortable range or holding breath/notes for unsafe durations.
- Repetitive tapping/playing sessions include optional breaks and do not reward force/velocity.

### Normative pitch model

Store written spelling separately from sounding pitch:

```text
Pitch := {
  step: C|D|E|F|G|A|B,
  alter: -2|-1|0|1|2,
  octave: integer,
  midi: integer,
  centsOffset: number
}
```

Core generation normally uses `alter=-1,0,+1`; double accidentals appear only in explicit advanced spelling families.

- Middle C is `C4` and MIDI note `60`.
- `A4` is MIDI `69` and defaults to `440 Hz`.
- In 12-TET, `frequency(m)=A4Hz*2^((m−69)/12)`, plus any explicit cents offset `2^(cents/1200)`.
- Two pitches can sound the same in 12-TET while being spelled differently. `F#4` and `Gb4` share sounding pitch but not diatonic meaning.
- Octave number changes at C: `B3` is immediately below `C4`.
- Pitch-class arithmetic modulo `12` never replaces diatonic-letter counting when interval/scale/chord spelling is assessed.
- Solfège is excluded initially because fixed-Do/movable-Do/local conventions require a separate setting and curriculum.

### Normative notation model

Semantic note events are primary; SVG is a rendering:

```text
NoteEvent := {
  writtenPitch,
  soundingPitch,
  onsetWholeNotes,
  durationWholeNotes,
  notatedDuration,
  tieStart,
  tieStop,
  articulation,
  velocity,
  voice
}
```

- Staff position is determined by written diatonic pitch and clef, not MIDI number alone.
- Clef reference points are table-driven: treble `G4` on line 2, bass `F3` on line 4, alto `C4` on line 3, tenor `C4` on line 4.
- Staff lines are numbered bottom to top.
- Ledger lines are generated symmetrically above/below and remain readable; core items use at most three.
- Key signatures follow the conventional order of sharps `F C G D A E B` and flats `B E A D G C F`.
- An accidental applies to matching step and octave for the remainder of the measure in the same staff/voice under the simplified model, unless canceled; a barline resets it to the key signature.
- Courtesy accidentals are visually marked as courtesy and do not change the semantic pitch.
- Ties connect identical written/sounding pitches and combine duration; slurs do not.
- Notation symbols should use bundled SVG paths or a bundled SMuFL-compatible font. Missing font/network access must not replace notes with text tofu.

The internal score model should be compatible in spirit with MusicXML concepts, but the app does not need to embed/import a general MusicXML engine.

### Normative interval, scale, and key model

- Generic interval number counts letter names inclusively.
- Simple interval semitone targets:

| Number | Perfect/major semitones |
|---|---:|
| 1 | P1 = 0 |
| 2 | M2 = 2 |
| 3 | M3 = 4 |
| 4 | P4 = 5 |
| 5 | P5 = 7 |
| 6 | M6 = 9 |
| 7 | M7 = 11 |
| 8 | P8 = 12 |

- Perfect-class intervals are `1,4,5,8`; others are major/minor. Augmented/diminished are derived by semitone alteration while preserving generic number.
- Compound intervals through a fifteenth may appear at advanced levels; inversion questions use simple intervals summing to `9` and qualities `M↔m`, `P↔P`, `A↔d`.
- Major scale steps are `W W H W W W H`; natural minor `W H W W H W W`.
- Harmonic minor raises scale degree 7; melodic minor questions state ascending or descending convention explicitly. Default descending melodic minor equals natural minor.
- Modes rotate the diatonic pattern and are named Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian.
- A correctly spelled diatonic scale uses each letter name exactly once before repeating the tonic.
- Relative major/minor share a key signature; parallel major/minor share a tonic.

### Normative harmony model

- Triad qualities by root-relative semitones: major `0,4,7`; minor `0,3,7`; diminished `0,3,6`; augmented `0,4,8`.
- Seventh-chord core qualities: major seventh `0,4,7,11`; dominant seventh `0,4,7,10`; minor seventh `0,3,7,10`; half-diminished seventh `0,3,6,10`; diminished seventh `0,3,6,9`.
- Chord spelling uses stacked thirds in context; enharmonic pitch sets are not automatically equivalent when spelling is tested.
- Inversion is determined by the lowest sounding pitch class: root, third, fifth, then seventh.
- Roman numeral case conveys triad quality; `°`, `ø`, `+`, and figured-bass/inversion symbols use a pinned subset. Questions display a legend until mastered.
- Roman numeral analysis is restricted to generated diatonic major/natural/harmonic-minor contexts plus explicitly labeled dominant-function alterations. Ambiguous real-world analysis is excluded.
- Nashville numbers use scale-degree numbers with a displayed quality/accidental convention. Do not assume one universal notation convention silently.
- Voice-leading questions use four abstract voices with declared ranges, no crossing unless the task diagnoses it, and a small reviewed rule set. They do not claim to grade stylistic composition.

### Normative rhythm model

Durations use exact rational whole-note units:

| Symbol | Whole-note duration |
|---|---:|
| whole | `1` |
| half | `1/2` |
| quarter | `1/4` |
| eighth | `1/8` |
| sixteenth | `1/16` |

- One dot multiplies duration by `3/2`; two dots by `7/4`.
- Tied durations add.
- In simple meter, the lower number identifies the notated beat unit.
- In compound `6/8, 9/8, 12/8`, the felt beat is a dotted quarter unless the prompt states a different conducting level.
- A triplet fits three equal notes into the time normally occupied by two of the same notated value.
- Measures are represented on an exact rational timeline. The sum of sounding/notated durations in each voice must match the time signature, excluding an explicitly labeled pickup.
- Tempo declares the beat unit: `quarter=120` differs from `dotted-quarter=120`.
- Swing, grace-note timing, fermatas, rubato, and humanized microtiming are playback expression only and are never silently part of an exact rhythm oracle.

### Audio architecture

Sound is a required baseline capability and works offline.

#### Procedural instrument

The guaranteed fallback uses Web Audio:

- oscillators/additive partials or periodic waves;
- per-note ADSR envelope;
- modest velocity response;
- optional filtered noise for attacks;
- master gain and limiter;
- polyphony sufficient for four-note chords plus release tails;
- voice stealing that never cuts the currently tested bass note preferentially.

Procedural timbre need not impersonate a real piano perfectly. It must have stable pitch, clean attacks, and enough overtone content for interval/chord recognition.

#### Embedded sampled instrument

The page may embed a small compressed sample bank as base64/data URIs or bundled byte arrays:

- sample several anchor notes across the playable range rather than pitch-shifting one note across multiple octaves;
- choose the nearest anchor and set `playbackRate=2^(semitoneOffset/12)`; limit transposition, recommended within `±3` semitones;
- include attack/release looping metadata when needed;
- decode locally to `AudioBuffer` after a user gesture or idle opportunity;
- procedural synthesis remains available if a codec/sample decode fails.

Base64 is an implementation option, not a requirement. Its size overhead must be measured against standalone-file goals. A compact multi-sampled piano/neutral pluck is preferable to many decorative timbres.

#### Scheduling

- Schedule note starts/stops against `AudioContext.currentTime`, with a look-ahead queue; do not time musical audio solely with `setTimeout`.
- UI animation may use animation frames/timers but follows scheduled audio time.
- Use a count-in for performance tasks and display beat unit/BPM.
- Resume/create the audio context only in response to a user action.
- Replay limits may prevent answer-by-brute-force only in optional challenge mode, never accessibility/practice mode.
- Audio tests use `OfflineAudioContext` or equivalent deterministic event inspection where available.

### Performance input modes

Every play task supports at least:

1. on-screen keyboard/pads/fretboard;
2. computer-key mappings with visible labels.

Optional enhancements:

- **Web MIDI:** request on explicit click, without System Exclusive access; handle note-on/off, velocity, device disconnect, sustain pedal when relevant, and duplicate channels. MIDI availability/permission never gates a category.
- **Microphone:** request on explicit click; analyze monophonic pitch/onsets locally. Show detected pitch/confidence and allow calibration. Do not grade polyphonic microphone chords.

Input mode is recorded separately from skill mastery so hardware latency/recognition failures do not masquerade as theory weakness.

### Performance timing and pitch scoring

Performance instances store target event sequences and scoring windows.

- MIDI/on-screen pitch events are exact MIDI values; whether octave matters is stated.
- Microphone pitch uses a reviewed monophonic detector such as YIN/autocorrelation with confidence and amplitude gates.
- Default sustained-pitch acceptance is within `±35 cents` for at least `150 ms`; levels may tighten to `±20 cents`. Unstable/low-confidence input returns “could not hear reliably,” not “wrong note.”
- Do not forgive octave errors unless the task explicitly grades pitch class only.
- Estimate input/output latency through an optional calibration routine. Store the offset per device/session, not as musical skill.
- Rhythm grading aligns target/performed onsets after removing calibrated fixed latency. Beginner tolerance is `max(80 ms, 15% of the smallest target subdivision)`; later levels may use `max(45 ms, 10%)`.
- Chord notes may arrive within a configurable roll window, default `120 ms`; arpeggiated versus simultaneous tasks state different windows.
- Report wrong pitch, missed event, extra event, early/late onset, and duration separately.
- A global tempo drift may be scored separately from internal rhythmic proportions. Do not fail an otherwise correct relative rhythm solely because the learner chose a nearby tempo when tempo was not the target.

### Answer equivalence

- Note-name questions accept case-insensitive letters and normalized accidental aliases (`#`, `♯`, `b`, `♭`, `x` where enabled).
- Enharmonic equivalents are accepted only when the task asks for sounding pitch/pitch class; spelling tasks require the contextually correct letter/accidental.
- Intervals are compared by generic number plus quality, not semitone count alone.
- Chord pitch sets are unordered unless voicing/inversion/bass is assessed.
- Scale answers require ordered spelled degrees.
- Rhythm answers compare exact rational timelines; visually different ties may be sound-equivalent but remain distinct in notation-specific tasks.
- Roman/Nashville answers normalize supported glyph/text aliases through a declared grammar.
- Played melodies compare ordered onset/pitch/duration events under the stated tolerance.

### Difficulty philosophy

Difficulty should rise through:

- broader staff/instrument range and weaker landmark cues;
- transferring between sight, sound, name, and physical action;
- spelling-sensitive versus pitch-class answers;
- less-common but still taught keys/interval qualities/chords;
- longer rhythmic/melodic memory and more subdivisions;
- inversion, bass, voicing, or harmonic context;
- tighter—but humane and calibrated—performance tolerances;
- combining two or at most three mastered operations.

It must not rise through illegible engraving, surprise clefs, extreme registers, excessive ledger lines, harsh/loud audio, arbitrary enharmonic traps, unsupported microphone conditions, or long repetitive drills.

### Global generation metadata

Each instance stores:

`categoryId`, `subcategoryId`, `familyId`, `level`, `tuningSystem`, `referenceA4`, `writtenEvents`, `soundingEvents`, `meter`, `tempo`, `keyContext`, `clef`, `instrumentLayout`, `inputMode`, `expectedAnswer`, `equivalenceMode`, `pitchToleranceCents`, `timingToleranceMs`, `difficultyDimensions`, `misconceptionsTargeted`, `workedSolution`, `audioPlan`, `visualDescription`, and `structuralSignature`.

Generate semantic music first, validate spelling/timing/range, then render notation/instrument/audio. Reject recent structural signatures within 20 questions and exact fragments within 100.

## 2. Category: Pitch and Staff Notation

### Category purpose

Connect staff position, clef, spelling, sounding pitch, keyboard location, and frequency.

### Learn

Clefs map staff positions to letter/octave names. Notes ascend by letter from one line/space to the next. Accidentals change pitch but usually not staff position. Middle C is `C4`; each semitone changes frequency by the twelfth root of two in 12-TET.

### Common misconceptions

- Reading every clef as treble.
- Changing octave at A rather than C.
- Treating a sharp/flat as moving the note to a different staff position.
- Ignoring accidental scope within a measure.
- Assuming enharmonic spelling is always interchangeable.
- Mapping black keys to only sharps or only flats.

### Family `staff_note_read`

**Task.** Name a rendered note with octave from clef/staff position and active accidental/key signature.

**Difficulty.** L1 treble/bass landmarks; L2 full staff; L3 ledger lines or alto/tenor.

**Derivation.** Convert clef reference plus signed diatonic staff steps, then apply key/measure accidental.

**Examples.**

1. treble line 2 → `G4`.
2. bass line 4 → `F3`.
3. alto line 3 → `C4`.

**Validation.** Independent clef-step mapping and render-coordinate round trip.

### Family `staff_note_write`

**Task.** Place a named pitch on the correct staff position and select its accidental.

**Response mode.** Click staff position plus accidental control.

**Difficulty.** L1 natural on staff; L2 accidental/key context; L3 ledger/clef choice.

**Examples.**

1. place `C4` on treble staff → ledger line below.
2. place `Bb3` in bass clef → correct B position plus flat.
3. place `C4` in tenor clef → line 4.

**Validation.** Semantic written pitch reconstructed from chosen position/accidental.

### Family `accidental_scope`

**Task.** Determine the sounding/written pitch after key signature, accidentals, barline, and cancellation.

**Derivation.** Apply key default, then latest matching measure accidental; reset at barline.

**Difficulty.** L1 one accidental; L2 repeated pitch/barline; L3 octave-specific same-letter contrast.

**Examples.**

1. F-sharp then another F in same measure → F-sharp.
2. following bar without F sharp in key → F natural.
3. an accidental on `F4` does not alter `F5` under this simplified model.

**Validation.** Timeline accidental-state machine per staff/voice/octave.

### Family `enharmonic_spelling`

**Task.** Choose an enharmonic spelling or decide whether two spellings sound alike versus function alike.

**Derivation.** Compare MIDI pitch for sounding equality and diatonic/context rules for spelling.

**Difficulty.** L1 black-key pair; L2 key-context scale degree; L3 interval/chord spelling.

**Examples.**

1. `F#4` and `Gb4` sound alike in 12-TET.
2. leading tone in G major is `F#`, not `Gb`.
3. major third above `Db` is `F`, not `E#`.

**Validation.** Separate pitch-class and diatonic-spelling oracles.

### Family `clef_equivalence`

**Task.** Match the same sounding pitch across clefs or identify an octave displacement.

**Derivation.** Decode each staff position to scientific pitch and compare MIDI values.

**Difficulty.** L1 middle C; L2 treble↔bass; L3 alto/tenor with ledger lines.

**Examples.**

1. treble ledger C below and bass ledger C above both represent `C4`.
2. bass-space `C3` is an octave below `C4`.
3. match `A3` across treble and alto clefs.

**Validation.** Sounding-pitch equality and distinct staff coordinates.

### Family `keyboard_pitch_location`

**Task.** Find/name a pitch on a generated keyboard, including octave.

**Derivation.** Use the repeating black-key groups and stored MIDI mapping.

**Difficulty.** L1 C landmarks; L2 naturals/black keys; L3 exact octave/enharmonic spelling.

**Examples.**

1. white key left of a two-black group → C.
2. black key between C and D → `C#/Db`.
3. middle C on the labeled keyboard → `C4/MIDI 60`.

**Validation.** Key index, MIDI, and displayed range agree.

### Family `pitch_frequency`

**Task.** Compute/compare octave, semitone, cents, MIDI, and frequency under supplied A4 tuning.

**Derivation.** Use the normative 12-TET formula.

**Difficulty.** L1 octaves; L2 MIDI/semitones; L3 cents/frequency approximation.

**Examples.**

1. `A4=440 Hz`; `A5=880 Hz`.
2. MIDI `60` is `C4`.
3. `A4` at `+100 cents` sounds as `A#4/Bb4` in 12-TET.

**Validation.** Forward/inverse formula and octave-ratio checks.

## 3. Category: Intervals, Keys, Scales, and Modes

### Category purpose

Build spelling-sensitive relationships that support sight singing/playing, transposition, and harmony.

### Learn

Count interval number by letters and quality by semitone distance. Keys organize seven differently lettered scale degrees. Transposition preserves interval relationships and must preserve sensible spelling, not only MIDI offsets.

### Family `interval_identify`

**Task.** Name directed/undirected interval number and quality between two spelled pitches.

**Difficulty.** L1 generic/perfect-major; L2 minor/augmented/diminished; L3 descending/compound.

**Derivation.** Count letters inclusively, compute chromatic semitones, compare with expected class.

**Examples.**

1. C4→G4 → perfect fifth.
2. E4→G4 → minor third.
3. C4→F#4 → augmented fourth.

**Validation.** Diatonic and chromatic distances both checked.

### Family `interval_construct`

**Task.** Build a named interval above/below a starting pitch on staff/keyboard.

**Derivation.** Choose target letter by generic size, then accidental to achieve quality.

**Difficulty.** L1 natural intervals; L2 accidentals; L3 below/compound/context spelling.

**Examples.**

1. M3 above C4 → E4.
2. m3 above F#4 → A4.
3. P5 below Eb4 → Ab3.

**Validation.** Exact generic number, direction, semitones, and spelling.

### Family `interval_inversion`

**Task.** Invert a simple interval or construct its complementary interval.

**Derivation.** Numbers sum to `9`; `M↔m`, `P↔P`, `A↔d`.

**Difficulty.** L1 perfect; L2 major/minor; L3 augmented/diminished plus pitch construction.

**Examples.**

1. P5 ↔ P4.
2. M3 ↔ m6.
3. A4 ↔ d5.

**Validation.** Number/quality mapping and octave complement equals 12 semitones.

### Family `key_signature`

**Task.** Identify/build a major/minor key signature or name altered scale degrees.

**Derivation.** Use circle/order tables and relative-key mapping.

**Difficulty.** L1 `0..2` accidentals; L2 up to `4`; L3 all conventional signatures/relative ambiguity resolved by prompt.

**Examples.**

1. G major → one sharp, F#.
2. Bb major → Bb and Eb.
3. three sharps → A major or F# minor depending requested mode/tonic.

**Validation.** Pinned key-signature table and scale-spelling round trip.

### Family `scale_spell`

**Task.** Write/play ordered notes of a named major or minor scale.

**Derivation.** Apply interval pattern while using every letter once.

**Difficulty.** L1 C major/natural minor; L2 keyed major; L3 harmonic/melodic minor and difficult spellings.

**Examples.**

1. D major → `D E F# G A B C# D`.
2. A natural minor → `A B C D E F G A`.
3. A harmonic minor → `A B C D E F G# A`.

**Validation.** Ordered degree letters, pitch classes, tonic octave, and variant.

### Family `relative_parallel_keys`

**Task.** Identify relative/parallel major/minor and contrast what is shared.

**Derivation.** Relative minor is major degree 6; parallel retains tonic and changes signature.

**Difficulty.** L1 no/few accidentals; L2 arbitrary supported keys; L3 transpose a fragment between relationships.

**Examples.**

1. C major relative minor → A minor.
2. C major parallel minor → C minor.
3. E minor relative major → G major.

**Validation.** Tonic/mode/key-signature table.

### Family `mode_spell_identify`

**Task.** Spell/identify a diatonic mode from tonic and pattern or heard/seen degrees.

**Derivation.** Compare ordered semitone pattern/altered degrees relative to major.

**Difficulty.** L1 Ionian/Aeolian; L2 Dorian/Mixolydian; L3 all seven modes and spelling.

**Examples.**

1. D to D on white keys → D Dorian.
2. G to G on white keys → G Mixolydian.
3. major pattern with raised fourth → Lydian.

**Validation.** Ordered step pattern and diatonic spelling.

### Family `melody_transposition`

**Task.** Transpose a short spelled melody by interval or from one key/instrument context to another.

**Derivation.** Preserve each note's generic/chromatic interval from source tonic or apply a named interval note-by-note.

**Difficulty.** L1 diatonic key shift; L2 chromatic interval; L3 accidentals/range choice.

**Examples.**

1. `C D E` up M2 → `D E F#`.
2. `G A B D` from G major to Bb major by tonic relation → `Bb C D F`.
3. transpose a two-measure fragment while preserving rhythm/ties.

**Validation.** Per-note directed interval, spelling, octave, and unchanged rhythm.

## 4. Category: Rhythm, Meter, and Timing

### Category purpose

Connect written duration, beat hierarchy, exact measure structure, heard rhythm, and performed timing.

### Learn

Rhythm is an ordered timeline, not merely a bag of note values. Meter groups pulses and defines a notated beat; tempo gives that beat a rate. Dots lengthen, ties join, and tuplets change subdivision ratios.

### Common misconceptions

- Treating the time-signature denominator as beats per measure.
- Counting `6/8` only as six unrelated eighth-note beats.
- Adding half the original value repeatedly for a double dot incorrectly.
- Confusing ties and slurs.
- Ignoring rests in measure totals.
- Judging rhythm from note count instead of onset/duration.

### Family `duration_value`

**Task.** Name/compute note or rest duration, including dots and ties.

**Derivation.** Use exact duration table, dot multiplier, and tie addition.

**Difficulty.** L1 basic value; L2 single dot/tie; L3 double dot/mixed tied values.

**Examples.**

1. half note = two quarter-note beats in `4/4`.
2. dotted quarter = `3/8` whole note = three eighths.
3. quarter tied to eighth = three eighths.

**Validation.** Rational duration oracle.

### Family `measure_completion`

**Task.** Select/enter notation that exactly completes a measure or identify over/underfull measure.

**Derivation.** Sum rational durations against time-signature capacity.

**Difficulty.** L1 one missing value; L2 rests/dots; L3 ties/compound meter or pickup.

**Examples.**

1. `4/4` with half+quarter → one quarter missing.
2. `3/4` with dotted half → complete.
3. `6/8` with dotted quarter+two eighths → one eighth missing.

**Validation.** Per-voice exact timeline and pickup metadata.

### Family `beat_subdivision`

**Task.** Place/count onsets using beat/subdivision syllables or grid positions.

**Derivation.** Quantize exact onsets to declared grid such as `1 & 2 &` or `1 e & a`.

**Difficulty.** L1 quarters/eighths; L2 sixteenths/rests; L3 ties across beat/group.

**Examples.**

1. eighth notes in `4/4` → `1 & 2 & 3 & 4 &`.
2. onset at third sixteenth of beat → `&`.
3. tie across beat has no new onset on the tied destination.

**Validation.** Timeline-to-label table.

### Family `compound_meter`

**Task.** Identify beat grouping/beat unit or complete/count compound meter.

**Derivation.** Group eighths in threes; dotted-quarter beats for standard `6/8,9/8,12/8`.

**Difficulty.** L1 simple versus compound; L2 beat count; L3 regroup notation without changing sound.

**Examples.**

1. `6/8` → two dotted-quarter beats.
2. `9/8` → three dotted-quarter beats.
3. six eighths grouped `3+3` expresses compound duple.

**Validation.** Meter metadata and rational group boundaries.

### Family `rhythm_equivalence`

**Task.** Decide whether two notations have the same sounding onset/duration timeline.

**Derivation.** Expand dots/ties/tuplets to rational events, ignoring visual grouping only when task asks sound equivalence.

**Difficulty.** L1 tied versus single duration; L2 rest/onset placement; L3 tuplet or barline tie.

**Examples.**

1. two tied quarters sound as one half-duration note.
2. quarter+quarter rearticulated is not onset-equivalent to a tied pair.
3. three eighth-note triplets occupy one quarter-note span.

**Validation.** Canonical sounding timeline and notation-sensitive alternative oracle.

### Family `syncopation`

**Task.** Identify/construct emphasis or sustained onset off the beat.

**Derivation.** Compare onsets/ties with metric-strength grid; use exact reviewed patterns.

**Difficulty.** L1 offbeat onset; L2 tie across strong beat; L3 compare syncopation density without stylistic value judgment.

**Examples.**

1. accent on `&` of beat 2 → offbeat accent.
2. note starts on weak eighth and ties across beat 3 → syncopation.
3. a rest on a strong beat followed by offbeat onset creates a supported syncopated pattern.

**Validation.** Metric hierarchy plus event/accent positions.

### Family `tempo_follow`

**Task.** Tap steady beats/subdivisions or identify tempo/beat unit from generated clicks.

**Derivation.** Compare calibrated inter-onset intervals with `60/BPM` seconds for the declared beat.

**Difficulty.** L1 steady quarter pulse; L2 subdivisions; L3 tempo change/ramp recognition without exact expressive grading.

**Examples.**

1. quarter=`120` → `500 ms` per quarter.
2. tap eighth subdivisions at quarter=`60` → `500 ms` apart.
3. dotted-quarter=`80` → `750 ms` per compound beat.

**Validation.** Scheduled audio timestamps and offset-corrected performed IOIs.

### Family `rhythm_tap`

**Task.** Perform a displayed/heard one- or two-measure rhythm after count-in.

**Derivation.** Align performed onsets to target timeline after fixed latency; score onset classes separately.

**Difficulty.** L1 quarters/eighths; L2 rests/ties/sixteenths; L3 compound/syncopated/triplet patterns.

**Examples.**

1. tap four quarters in `4/4`.
2. tap `quarter, two eighths, half`.
3. reproduce a `6/8` pattern with onsets across both dotted-quarter groups.

**Validation.** Synthetic input traces at tolerance boundaries, missing/extra-event tests, tempo-drift separation.

### Family `rhythm_dictation`

**Task.** Hear a short rhythm and select/enter its notation or onset grid.

**Derivation.** Compare answer timeline with source; pitches remain constant/percussive.

**Difficulty.** L1 two-beat binary choices; L2 one measure; L3 rests/ties/compound or two measures.

**Examples.**

1. hear two quarters versus four eighths.
2. hear `quarter, two eighths, quarter`.
3. transcribe a generated `6/8` rhythm after count-in.

**Validation.** Playback plan derives from the same exact source timeline; distractors encode onset/duration misconceptions.

## 5. Category: Chords and Harmony

### Category purpose

Connect spelled pitch collections, heard sonorities, bass/inversion, key context, and functional labels.

### Learn

Chords are spelled relationships, not only piano-key sets. Triads stack thirds; seventh chords add another third. Inversion depends on bass. Roman numerals describe scale-degree roots and quality in a key; Nashville numbers provide a transposable numeric label under the displayed convention.

### Family `triad_identify`

**Task.** Identify triad root/quality from notation, note names, keyboard, or audio-supported replay.

**Derivation.** Reorder to a stacked-third spelling, then compare semitones from root.

**Difficulty.** L1 root position; L2 inversion; L3 enharmonic/context spelling.

**Examples.**

1. `C E G` → C major.
2. `A C E` → A minor.
3. `B D F` → B diminished.

**Validation.** Spelled-third graph plus pitch-class set.

### Family `chord_spell`

**Task.** Construct/play a named triad with correct spelling.

**Derivation.** Select root, third letter, fifth letter, then accidentals for quality.

**Difficulty.** L1 major/minor naturals; L2 accidentals/diminished; L3 requested voicing/inversion.

**Examples.**

1. D major → `D F# A`.
2. F minor → `F Ab C`.
3. C# diminished → `C# E G`.

**Validation.** Letter thirds, semitone pattern, and requested bass.

### Family `triad_inversion`

**Task.** Identify or realize root/first/second inversion.

**Derivation.** Determine chord root independently, then compare lowest sounding pitch with root/third/fifth.

**Difficulty.** L1 named chord; L2 derive root from notes; L3 open voicing with duplicated tones.

**Examples.**

1. `C E G` with C bass → root position.
2. `E G C` with E bass → first inversion C major.
3. `G C E G` with G bass → second inversion despite duplication.

**Validation.** Pitch-class chord identity and absolute lowest event.

### Family `seventh_chord`

**Task.** Identify/spell core seventh-chord qualities and inversion.

**Derivation.** Compare root-relative semitone tuple and bass member.

**Difficulty.** L1 major/minor seventh; L2 dominant/half-diminished; L3 inversion or diminished seventh.

**Examples.**

1. `G B D F` → G dominant seventh.
2. `B D F A` → B half-diminished seventh.
3. `C E G B` → C major seventh.

**Validation.** Spelled-thirds, interval tuple, and bass.

### Family `roman_numeral`

**Task.** Analyze or realize a generated diatonic chord in a declared key.

**Derivation.** Map root to scale degree, determine quality/inversion, emit pinned Roman grammar.

**Difficulty.** L1 major-key root-position triads; L2 minor/inversions; L3 diatonic sevenths or labeled dominant alteration.

**Examples.**

1. C major: `F A C` → `IV`.
2. C major: `B D F` → `vii°`.
3. A minor harmonic context: `E G# B` → `V`.

**Validation.** Key-scale spelling, chord identity, and grammar parse round trip.

### Family `diatonic_harmonization`

**Task.** Build/identify the triad/seventh chord on a scale degree and list diatonic qualities.

**Derivation.** Stack alternate scale degrees within declared major/minor scale.

**Difficulty.** L1 one major degree; L2 all major triads; L3 natural/harmonic minor contrast.

**Examples.**

1. ii in C major → `D F A`, minor.
2. major triad qualities → `I ii iii IV V vi vii°`.
3. V in A harmonic minor uses `G#` in `E G# B`.

**Validation.** Ordered scale-degree indices and spelling.

### Family `progression_transposition_nashville`

**Task.** Convert a progression among chord names, Roman numerals, Nashville numbers, or another key.

**Derivation.** Preserve scale-degree/quality/inversion under the displayed convention.

**Difficulty.** L1 three diatonic chords; L2 new key with accidentals; L3 minor/quality alterations.

**Examples.**

1. C: `C F G` → `I IV V` → `1 4 5`.
2. transpose `I vi IV V` to G → `G Em C D`.
3. `1 5 6m 4` in D → `D A Bm G`.

**Validation.** Degree/quality mapping and chord-spelling oracle.

### Family `voice_leading`

**Task.** Choose/construct the smoother of reviewed chord-to-chord voicings under stated constraints.

**Derivation.** Validate chord tones/ranges, then score total semitone motion and rule flags explicitly named in the prompt.

**Difficulty.** L1 common tone; L2 four voices/ranges; L3 avoid crossing/parallels only when the rule is displayed.

**Examples.**

1. retain common C between F and C chords when possible.
2. compare two valid voicings by total voice motion.
3. reject a choice with soprano/alto crossing when “no crossing” is stated.

**Validation.** Per-voice melodic intervals, chord membership, range/order, and deterministic score/tie rejection.

## 6. Category: Instruments and Active Performance

### Category purpose

Turn notation/theory into physical, timed actions on keyboard, fretboard, MIDI controller, or monophonic instrument/voice.

### Learn

An instrument layout provides multiple physical ways to produce the same pitch. Good practice alternates recognition with retrieval and gradually removes guides. Accuracy reports pitch, rhythm, and continuity separately so one weakness does not hide another.

### Family `fretboard_note`

**Task.** Name/find a pitch at string/fret or all positions in a bounded fretboard region.

**Generation.** Configurable tuning; presets guitar `E2 A2 D3 G3 B3 E4`, bass, ukulele. Fret `0..12` initially.

**Derivation.** Sounding MIDI = open-string MIDI + fret; spelling follows declared key/default chromatic convention.

**Examples.**

1. guitar low E open → `E2`.
2. guitar A string fret 3 → `C3`.
3. find all `E` pitch classes through fret 5.

**Validation.** Per-string semitone mapping, range, duplicate-position set.

### Family `fretboard_interval_shape`

**Task.** Find a target interval from a root on a fretted instrument or identify a shape's interval content.

**Derivation.** Compare sounding pitches while respecting tuning discontinuities such as guitar G→B strings.

**Difficulty.** L1 same string; L2 adjacent strings; L3 multiple positions/shape transposition.

**Examples.**

1. two frets higher on same string → M2.
2. from guitar low-E fret 3 (`G2`), A-string fret 5 (`D3`) → P5.
3. transpose a reviewed movable shape without crossing unsupported tuning boundary.

**Validation.** MIDI interval plus physical-coordinate constraints.

### Family `transposing_instrument`

**Task.** Convert written and concert pitch for a supported instrument.

**Normative convention.** “Instrument in X” means written C sounds concert X; direction is repeated in every prompt.

**Difficulty.** L1 Bb/Eb single note; L2 short melody/key; L3 choose written key signature/range.

**Examples.**

1. Bb clarinet written C4 sounds Bb3.
2. Bb instrument concert C4 requires written D4.
3. Eb alto sax written C4 sounds Eb3 under declared octave convention.

**Validation.** Versioned instrument transposition/range table and inverse round trip.

### Family `sight_read_pitch`

**Task.** Play a sequence of displayed notes without rhythm pressure, then with a steady pulse.

**Input.** On-screen/MIDI exact; microphone monophonic with confidence.

**Difficulty.** L1 five-note treble range; L2 accidentals/clef; L3 ledger/key context.

**Examples.**

1. play `C4 D4 E4` in order.
2. play four bass-clef notes with replayable reference C.
3. play a key-signature fragment with one measure accidental.

**Validation.** Ordered pitch events; wrong/missed/extra notes separate; octave policy explicit.

### Family `sight_read_rhythm`

**Task.** Perform a one-pitch notated rhythm with count-in/metronome.

**Derivation.** Use calibrated onset/duration scoring without melodic pitch changes.

**Difficulty.** L1 quarters/halves; L2 eighths/rests/ties; L3 compound/syncopation.

**Examples.**

1. four quarters at quarter=`80`.
2. dotted quarter, eighth, half in `4/4`.
3. one measure `6/8` with rest and offbeat onset.

**Validation.** Performance-timeline tolerance tests and source notation equality.

### Family `play_scale`

**Task.** Play a named scale ascending/descending over declared range.

**Derivation.** Target sequence comes from scale-spelling oracle and tonic octave.

**Difficulty.** L1 one octave major; L2 natural/harmonic minor; L3 mode/two directions at tempo.

**Examples.**

1. play C major C4→C5.
2. play E natural minor ascending/descending.
3. play D Dorian over one octave at eighth=`100`.

**Validation.** Pitch sequence, spelling feedback, range, optional timing; fingering is not graded.

### Family `play_chord`

**Task.** Play a named/seen/heard chord simultaneously or as a stated arpeggio.

**Derivation.** Compare pitch-class/multiset, bass, voicing, and chord-window policy.

**Difficulty.** L1 root-position triad; L2 inversion; L3 seventh chord/voicing.

**Examples.**

1. play C major triad in root position.
2. play A minor first inversion with C in bass.
3. arpeggiate G7 upward within displayed range.

**Validation.** Chord membership, required bass/octaves, onset spread or ordered arpeggio.

### Family `play_melody`

**Task.** Perform a short generated melody with pitch and rhythm, optionally after hearing it.

**Generation.** Tonal/mode-constrained step/leap grammar, range within an octave initially, `2..4` measures, no copyrighted phrases.

**Difficulty.** L1 stepwise quarter notes; L2 mixed rhythm/leaps; L3 accidentals/ties/articulation target.

**Examples.**

1. four-note stepwise phrase.
2. one-measure melody with quarter/eighth pattern.
3. two-measure call-and-response phrase with one accidental.

**Validation.** Sequence alignment reports pitch/rhythm/duration separately; source grammar checks range and cadence constraints.

### Family `articulation_performance`

**Task.** Hear/identify or play a simple articulation/dynamic pattern using supported input evidence.

**Scope.** Staccato/tenuto/accent and relative piano/forte contrast; no aesthetic tone grading.

**Difficulty.** L1 audio identification; L2 MIDI/on-screen duration/velocity; L3 follow mixed markings.

**Examples.**

1. choose staccato playback versus legato.
2. play four MIDI notes alternating unaccented/accented.
3. follow a short `p→f` relative dynamic change on MIDI/on-screen input.

**Validation.** Scheduled gate/velocity targets. Microphone dynamics are feedback-only because device gain control makes reliable grading unsafe.

## 7. Category: Ear Training

### Category purpose

Build reliable auditory categories and short-term musical memory through controlled, replayable sound linked to notation and performance.

### Learn

Ear training is relational. A reference pitch, tonic, bass, or pulse supplies context. The app varies register, direction, timbre, and voicing so learners hear the relationship rather than memorize one recording.

### Common misconceptions

- Identifying an interval only by raw semitone sound without direction/context.
- Mistaking register/voicing for chord quality.
- Guessing a mode from tonic note alone.
- Treating louder as higher in pitch.
- Confusing melodic and harmonic intervals.
- Letting one distinctive timbre become the answer cue.

### Family `aural_pitch_compare`

**Task.** Decide whether second tone is higher/lower/same and optionally estimate semitone direction.

**Difficulty.** L1 large interval/same timbre; L2 semitone/register variety; L3 timbre/level normalized without loudness cue.

**Examples.**

1. C4 then G4 → higher.
2. A4 then Ab4 → lower.
3. C4 and C4 with controlled timbre variation → same pitch.

**Validation.** Source MIDI relation; loudness/range balance tests.

### Family `aural_pitch_match`

**Task.** Reproduce a heard target on on-screen/MIDI or optional microphone.

**Derivation.** Compare exact MIDI or detected cents after a reference/replay.

**Difficulty.** L1 within five-note range; L2 chromatic octave; L3 no visual keyboard labels or tighter tuning.

**Examples.**

1. hear/play E4 from C4–G4 keys.
2. match a black-key pitch in one octave.
3. sustain sung/played target within `±20 cents` when microphone confidence is adequate.

**Validation.** Known audio target and calibrated detector traces including octave/confidence failures.

### Family `aural_interval`

**Task.** Identify/build/reproduce melodic or harmonic interval.

**Difficulty.** L1 P4/P5/octave; L2 major/minor 2/3/6/7; L3 augmented/diminished, direction, register/timbre variation.

**Examples.**

1. C4→G4 → ascending P5.
2. E4→C4 → descending M3.
3. simultaneous C4–F#4 → A4.

**Validation.** Spelled target and sounding semitones; balanced confusion pairs.

### Family `aural_chord`

**Task.** Identify chord quality/inversion from controlled playback.

**Difficulty.** L1 major/minor root position; L2 diminished/augmented/inversions; L3 seventh qualities and voicing variation.

**Examples.**

1. hear C-E-G → major triad.
2. hear C-Eb-G → minor triad.
3. hear G-B-D-F in varied voicing with G bass → dominant seventh root position.

**Validation.** Audio notes derive from semantic chord; register/voicing/timbre balanced across choices.

### Family `aural_scale_mode`

**Task.** Identify a scale/mode or reproduce its characteristic degree.

**Difficulty.** L1 major/natural minor; L2 harmonic minor/Dorian/Mixolydian; L3 all modes with tonic drone/cadence.

**Examples.**

1. major versus natural minor from same tonic.
2. minor with raised seventh → harmonic minor.
3. major-like scale with lowered seventh → Mixolydian.

**Validation.** Ordered pitch pattern, stable tonic context, randomized register.

### Family `melodic_dictation`

**Task.** Hear a generated fragment and enter pitches on staff/keyboard, with rhythm supplied or later included.

**Generation.** Short tonal grammar, reference tonic, bounded leaps, replay/count-in controls.

**Difficulty.** L1 `3` scale-degree pitches; L2 `5..8` pitches; L3 accidentals/rhythm combined.

**Examples.**

1. tonic–step–tonic contour.
2. five-note phrase within pentachord.
3. one-measure melody with a leap and repeated tone.

**Validation.** Ordered pitch/rhythm semantic comparison; partial-credit diagnostic by contour/scale degree.

### Family `aural_progression`

**Task.** Identify bass degrees/chord functions or order a short generated progression.

**Difficulty.** L1 tonic/dominant contrast; L2 `I-IV-V-I`; L3 `I-vi-ii-V-I`/minor equivalents with controlled voicing.

**Examples.**

1. hear `V→I` authentic resolution.
2. identify `I IV V I`.
3. enter Nashville numbers for a four-chord playback after tonic/key is supplied.

**Validation.** Harmonic semantic sequence; voicing/timbre variations cannot correlate with labels.

### Family `tuning_and_beats`

**Task.** Hear/measure in-tune versus sharp/flat or adjust a generated tone toward a reference.

**Derivation.** Cents difference is `1200log2(f2/f1)`; close simultaneous sine-rich tones produce a beat-rate cue approximately `|f2−f1|`.

**Difficulty.** L1 coarse sharp/flat; L2 cents slider; L3 close beat-rate comparison.

**Examples.**

1. second A at `445 Hz` versus `440 Hz` → sharp.
2. `+100 cents` → one equal-tempered semitone high.
3. `440` and `442 Hz` produce about `2` beats/s in the simple model.

**Validation.** Exact frequency generation, cents inverse, and no clipping/amplitude cue.

## 8. Cross-family progression

Recommended order:

1. keyboard landmarks, pitch comparison, treble/bass landmarks, basic durations, and steady tapping;
2. staff reading/writing, accidentals, major intervals, simple meter, and triads;
3. key signatures, major/minor scales, inversions, compound meter, and pitch/rhythm sight playing;
4. full interval qualities, modes, seventh chords, dictation, and fretboard/transposing instruments;
5. Roman/Nashville harmony, progression hearing, melodic performance, voice leading, and tuning.

Required interleaving:

- every newly learned staff pitch is heard and located/played;
- interval naming alternates with construction and aural identification;
- scale spelling alternates with scale playing/hearing;
- rhythm notation alternates with tapping and dictation;
- chord spelling alternates with playing and chord ear training;
- key/harmony knowledge appears in generated melodies rather than remaining isolated.

Permission-dependent input never gates conceptual progression. A learner can master the same target through on-screen interaction.

## 9. Adaptive practice guidance

Track:

`family`, `clef`, `staff region`, `pitch class`, `octave`, `accidental source`, `key`, `interval number/quality/direction`, `meter`, `subdivision`, `rhythm feature`, `chord quality/inversion`, `representation`, `timbre`, `input mode`, `latency profile`, `pitch/timing error type`, and `misconception`.

| Error pattern | Diagnosis | Next item |
|---|---|---|
| correct letter, wrong octave | octave boundary | B3/C4 keyboard-staff contrast |
| treble answer used in bass | clef anchoring | landmark then neighbor |
| ignores key signature | accidental source | same staff position with/without key |
| enharmonic answer in spelling task | sound/spelling distinction | key-leading-tone contrast |
| interval semitones right, number wrong | diatonic count missed | count letters before quality |
| scale repeats/skips a letter | pitch-class-only construction | seven letter slots scaffold |
| meter denominator read as beat count | signature roles reversed | numerator/denominator fields |
| tie rearticulated | tie/onset confusion | sound-equivalent notation pair |
| compound meter tapped as simple six | beat grouping | accented `3+3` count-in |
| chord quality right, inversion wrong | bass not isolated | bass-first replay |
| Roman root right, case wrong | degree versus quality | harmonized-scale quality row |
| MIDI correct, microphone unreliable | input recognition issue | retain mastery; offer calibration/on-screen |
| all onsets equally late | latency offset | recalibrate, do not mark rhythm wrong |
| increasing drift | tempo stability | metronome-follow pulse before pattern |
| interval errors only in new timbre | recording cue dependence | same interval across balanced timbres |
| melody contour correct but transposed | reference-tonic encoding | replay tonic then first-note match |

Recommended selection: 35% weakest due, 25% spaced mastery, 20% cross-modal transfer, 10% performance isolation, 10% musical combination.

Do not turn a microphone-confidence failure, browser scheduling stall, or disconnected MIDI device into negative skill evidence.

## 10. Feedback and worked demonstrations

Theory feedback must show:

1. key/clef/meter/context;
2. the relevant landmark, letter count, interval pattern, duration grid, or chord stack;
3. correct answer in notation and plain text;
4. a play button and, when useful, keyboard/fretboard highlight;
5. the targeted misconception.

Performance feedback separates:

- pitch accuracy;
- note order;
- onset timing;
- duration/release;
- tempo stability;
- microphone confidence/device status.

Use piano-roll/timeline overlays for timing, cents traces for monophonic tuning, and colored-plus-shaped markers accessible without color. Do not collapse performance to one opaque percentage.

Correct feedback can be musical:

> Correct — you played the minor third C–Eb. Hear it again, then compare C–E.

Incorrect feedback should offer a direct contrast:

> You chose F#, which has the right piano key for Gb, but this is the fourth degree of Db major and must be spelled G-flat.

## 11. Audio, MIDI, and microphone implementation requirements

### Web Audio

- Maintain one reusable `AudioContext`.
- Schedule from semantic events using absolute context times.
- Apply per-voice envelopes and cancel/release safely on stop/navigation.
- Cap simultaneous voices and clean up ended nodes.
- Use deterministic seeds for timbre variation in tests.
- Provide mono compatibility and avoid phase cancellation that hides chord tones.
- Never use audio element `play()` timing as the sole sequencer clock.

### MIDI

- Feature-detect and request access only after explicit selection.
- Request `sysex:false`.
- Normalize note-on with velocity `0` as note-off.
- Handle sustain without leaving stuck notes.
- Show active device and a disconnect fallback.
- Do not enumerate/log device names before permission or store them unnecessarily.

### Microphone

- Feature-detect secure-context/media support and explain browser limitations.
- Request audio only, with constraints chosen for pitch analysis where supported; automatic gain/noise suppression state must be recorded because it can affect dynamics.
- Use rolling confidence, amplitude threshold, and pitch stability rather than one FFT-bin peak.
- Offer reference-tone/headphone guidance to reduce feedback without requiring headphones.
- Never send raw/derived audio off-device.
- A “stop listening” control is always visible.

### Sample assets

Embedded assets must be:

- licensed for redistribution;
- documented with source/license;
- trimmed and normalized conservatively;
- loop/click tested at every transposition;
- accompanied by a procedural fallback;
- included in artifact-size budgets and offline tests.

## 12. Rendering and accessibility requirements

- SVG notation, keyboard, fretboard, and timeline derive from shared semantic events.
- Screen-reader text states clef, key signature, time signature, note/rest sequence, staff position, accidentals, ties, and articulations.
- Notes remain distinguishable at 200% zoom and on small screens.
- Accidentals, ledger lines, dots, ties, rests, and open fret markers do not collide.
- Keyboard black/white color is supplemented by shape/position and accessible pitch labels.
- Fretboard string/fret focus order is logical; left-handed orientation is a display setting, not a different answer.
- A visible playback cursor is never the only timing cue; optional haptic/visual count-in may supplement audio.
- Captions/text descriptions exist for aural examples when the target is theory review, but not when revealing them would invalidate the ear-training task; an alternate non-audio path is offered.

## 13. Generator requirements

### Semantic-first generation

- Generate `Pitch`, `NoteEvent`, measure, key, chord, scale, and instrument-position objects before notation/audio.
- Use reviewed tonal/rhythmic grammars, not arbitrary random MIDI notes.
- Keep fragments singable/playable within declared range and avoid pathological leaps/repetitions unless targeted.
- Construct distractors from errors: clef shift, octave error, ignored accidental, semitone-only misspelling, inversion bass, dotted-value error, metric shift, or contour transposition.
- Audio render plans never encode answer labels through fixed timbre/register/loudness.

### Offline constraint

The app is one standalone HTML/JS/CSS page. Notation, procedural sound, embedded samples, checking, and storage work without a server/network. Web MIDI and microphone are local browser capabilities, not backend services. If browser security prevents permission APIs from a local-file origin, the app explains the limitation and retains on-screen/synthesized practice.

## 14. Automated validation

For every instance:

- written pitch, sounding pitch, MIDI, frequency, staff position, and instrument position agree;
- key/measure accidentals resolve deterministically;
- interval generic/chromatic calculations agree;
- scale/key/chord spelling passes letter and pitch-class rules;
- each rhythm voice exactly fills its declared measure unless pickup metadata says otherwise;
- playback timestamps equal semantic onsets/durations;
- answer equivalence mode is explicit;
- choices are unique and misconception-based;
- notation/audio/instrument/accessibility descriptions share the same source;
- performed-event scoring is replayable from logged timestamps without raw microphone audio;
- rejection/history rules pass.

Property/regression tests:

- every pitch `C0..C8` staff/keyboard/MIDI/frequency round trip;
- B→C octave boundary and all clef references;
- key-signature and accidental reset/octave scope;
- enharmonic sound equality versus spelling inequality;
- all supported simple interval qualities and inversions;
- all supported scale/mode patterns in every practical tonic spelling;
- chord quality/inversion under voicing/duplication;
- Roman/Nashville round trips in generated keys;
- rational rhythm totals, dots, ties, tuplets, pickups, and compound grouping;
- transposing-instrument written/concert round trips;
- fretboard open/string/fret boundaries and tuning discontinuities;
- scheduled audio order/polyphony/release and master limiting;
- MIDI velocity-zero note-off, sustain, disconnect, and stuck-note cleanup;
- microphone synthetic signals across range, cents, harmonics, noise, silence, and octave-error cases;
- performance scoring exactly at early/late/pitch/chord-roll thresholds;
- at least `10,000` deterministic seeds per family and level.

Audio distribution tests ensure labels cannot be predicted from:

- loudness;
- root/register;
- timbre;
- stereo position;
- sample anchor;
- replay length;
- choice order.

## 15. Coverage requirements

Across a long mixed session:

- at least one third of due practice involves active listening or playing;
- every core theory family transfers to sound or instrument action after basic mastery;
- clefs, staff regions, keys, directions, interval qualities, chord inversions, meters, and input modes are balanced;
- pitch questions distinguish spelling from sounding equivalence deliberately;
- rhythm questions include rests, ties, offbeats, and compound grouping rather than only duration arithmetic;
- ear questions vary tonic, register, voicing, and timbre without making the task unreasonably unstable;
- performance fragments remain short enough for focused correction;
- microphone/MIDI usage never dominates selection merely because hardware is present;
- every declared misconception appears intentionally.

Cross-category synthesis normally combines at most three mastered skills—for example read a key-signature melody and play it, or hear a chord and realize the matching inversion. Avoid “perform a full piece” as a generated assessment.

## 16. Topic-level quality checklist

- [ ] Playing and listening are core, not deferred additions.
- [ ] Every permission-dependent task has an on-screen alternative.
- [ ] Web Audio scheduling uses the audio clock.
- [ ] Procedural synthesis works without embedded samples.
- [ ] Embedded sample ranges, licenses, and fallbacks are documented.
- [ ] Microphone audio remains local and is not retained by default.
- [ ] Pitch confidence/latency failures are not graded as musicianship errors.
- [ ] Written spelling and sounding pitch remain separate.
- [ ] Clef, octave, accidental, key, and tuning conventions are explicit.
- [ ] Interval answers use both diatonic number and chromatic quality.
- [ ] Rhythm uses exact rational timelines.
- [ ] Chord inversion follows the actual bass.
- [ ] Roman/Nashville conventions are displayed and bounded.
- [ ] Theory, notation, instrument layout, and audio share semantic events.
- [ ] Aural-answer labels are not leaked through timbre/register/loudness.
- [ ] Notation and controls are keyboard/screen-reader accessible.
- [ ] Every family has derivation, difficulty progression, three examples, and validation.
- [ ] Difficulty grows through musical transfer, not obscurity or harsh tolerances.
- [ ] The standalone app needs no backend or runtime asset download.

## 17. Stable identifiers and recommended navigation

Recommended navigation:

1. Pitch & Staff
2. Intervals, Keys & Scales
3. Rhythm & Timing
4. Chords & Harmony
5. Instruments & Playing
6. Ear Training

Stable family identifiers are the backticked identifiers above. Progress is tracked separately by representation and input mode: correctly naming a staff note does not imply hearing or playing it, and microphone/MIDI performance does not replace spelling mastery.
