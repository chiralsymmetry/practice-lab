# German Language — Dynamic Practice Specification

Status: implementation specification

Audience: exercise generator, linguistic-content editor, German morphology and
syntax engine, semantic answer checker, text/audio renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual normative meanings.

## 1. Topic overview

### Topic name

German Language

### Topic goal

Develop beginner-to-lower-intermediate communicative German by repeatedly
connecting pronunciation, spelling, vocabulary, morphology, sentence structure,
reading, listening, controlled writing, and guided speaking. The learner should
become able to:

- decode and type contemporary standard German, including umlauts, `ß/ss`,
  capitalization, compounds, and punctuation;
- use sound–spelling cues for vowel length, stress, consonant behavior, `ch`,
  and common prefixes/suffixes without assuming spelling is fully phonemic;
- learn nouns with gender, plural, and relevant declension behavior;
- identify nominative, accusative, dative, and bounded genitive functions, then
  realize articles, pronouns, adjectives, and nouns accordingly;
- select fixed-case and two-way prepositions from semantic and lexical frames;
- retrieve high-frequency regular, strong, mixed, separable, inseparable,
  reflexive, modal, and auxiliary verb forms;
- build present, perfect, preterite, pluperfect, future/predictive, imperative,
  passive, and selected subjunctive meanings;
- choose `haben/sein` and the correct past participle from the verb's sense and
  construction;
- maintain verb-second, verb-first, verb-final, and sentence-bracket structures
  while moving larger constituents for topic or focus;
- order subjects, objects, pronouns, adverbials, negation, and verb components
  from explicit discourse constraints rather than one brittle mnemonic;
- form and interpret main/subordinate, relative, infinitive, comparative,
  conditional, causal, temporal, and purpose constructions;
- use `du/ihr/Sie` and their agreement/register bundles coherently;
- understand short reviewed texts and recordings, exchange routine information,
  and rehearse useful utterances;
- recognize standard variation across Germany, Austria, Switzerland, and other
  German-speaking regions without treating dialect imitation as the goal.

The endpoint is reliable form–meaning control in practical German. Grammar names
support explanation, but learners should mostly classify roles, build forms,
track clauses, and communicate.

### Audience and level boundary

The curriculum starts before spelling/pronunciation mastery and extends through
practical A1, A2, and selected early-B1 tasks. These labels guide complexity;
the app does not certify CEFR/GER, Goethe, telc, ÖSD, fide, school, immigration,
or professional proficiency.

- **Foundation:** decoding, spelling, fixed expressions, noun learning with
  article/plural, present forms, and simple main clauses.
- **A1-oriented:** descriptions, routines, needs, questions, core cases,
  numbers/time/prices, directions, and short exchanges.
- **A2-oriented:** perfect/past narration, adjective endings, pronouns,
  subordinate clauses, comparisons, instructions, and practical messages.
- **Early-B1-oriented:** interacting case/order dependencies, register-sensitive
  past choice, relative/infinitive clauses, passive, hypotheses, discourse order,
  short inference, and cross-variety comprehension.

The [Goethe-Institut's GER/CEFR
overview](https://www.goethe.de/ins/de/de/uun/dln/ger.html) supplies broad
can-do boundaries for A1–B1. It is not converted into an examination claim or
copied as a complete curriculum.

### Reference and language-data boundary

Reference anchors include:

- the Rat für deutsche Rechtschreibung's [current official rules and word
  list](https://www.rechtschreibrat.com/regeln-und-woerterverzeichnis/), whose
  orthographic scope applies across the countries and regions where German is
  official;
- the Leibniz-Institut für Deutsche Sprache (IDS) description of
  [verb position](https://grammis.ids-mannheim.de/vggf/2289?termini=term),
  including verb-second, verb-first, verb-final, and the topological field model;
- IDS work on [areal variation in Standard
  German](https://ids-pub.bsz-bw.de/frontdoor/index/index/docId/9961);
- the [Goethe-Zertifikat B1 vocabulary and practice
  resources](https://www.goethe.de/de/spr/prf/ueb/pb1.html) as one source for
  communicative domains and level calibration;
- the Council of Europe [CEFR Companion
  Volume](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions)
  for reception, production, interaction, mediation, and phonological
  competence.

References are not data to copy wholesale. Any bundled lexicon, corpus sample,
audio, or paradigm data requires compatible licensing, provenance, versioning,
and linguistic review. Frequency does not establish gender, valency, register,
or suitability by itself.

### Standard-variety and usage policy

German is pluricentric. The app uses a common standard core plus explicit
profiles rather than silently equating “German” with one country:

```text
VarietyProfile {
  id
  geographicScope
  productionBaseline
  spellingProfile       // e.g. ß/ss policy
  lexicalPreferences[]
  grammaticalVariants[]
  pronunciationTargets[]
  addressConventions[]
  registerConventions[]
  acceptedAlternatives[]
}
```

- Production prompts declare the profile when a difference matters.
- Swiss Standard German's regular `ss` where other profiles use `ß` is a valid
  orthographic system, not a learner error.
- Austrian, Swiss, German, and other standard lexical/grammatical variants are
  tagged by scope; they are not presented as dialect mistakes.
- Standard-pronunciation audio may represent several regions. Accent variation
  is not ranked by correctness, intelligence, or authenticity.
- A learner chooses a primary production profile and may add receptive practice
  for other reviewed standard profiles.
- Dialect comprehension can be a future app or authored extension; it is not
  generated from stereotypes here.
- Region, medium, relationship, register, and discourse context are stored when
  they affect form or interpretation.

Each realization is classified as:

1. **canonical target** — selected teaching form for the active profile/context;
2. **accepted variant** — standard and meaning/register-compatible here;
3. **profile-different** — standard elsewhere but outside this production task;
4. **contextually different** — grammatical but changes reference, information
   structure, tense viewpoint, politeness, or implication;
5. **non-target/nonstandard** — outside the declared production norm;
6. **incorrect** — incompatible spelling, morphology, syntax, or semantics.

Feedback must distinguish these outcomes. “Not requested in this profile” must
not be phrased as “not German.”

### Scope

Included:

- contemporary standard spelling, pronunciation, capitalization, and common
  punctuation;
- adult everyday vocabulary through selected early B1 domains;
- three genders, singular/plural, four cases, articles/determiners, pronouns,
  adjective declension, weak nouns, and bounded genitive use;
- prepositional and lexical case government;
- high-frequency verb classes, auxiliaries, modals, prefixes, reflexives,
  infinitives/participles, practical tenses, passive, and bounded subjunctives;
- main-clause and subordinate-clause word order using the topological field
  model;
- negation, questions, relatives, comparisons, connectors, register, and
  information structure;
- practical numbers, ordinals, dates, time, prices, addresses, telephone
  numbers, measures, and quantities;
- short reading/listening, constrained writing, dialogue, mediation, and guided
  local recording;
- explicit receptive exposure to reviewed standard varieties.

Expected prior knowledge:

- no German required at Foundation;
- ability to read a Latin-script interface;
- case and field-model terms are taught visually before being required;
- later families require only dependencies stated in their progression notes.

### Exclusions

- unrestricted translation, essays, free conversation, and fuzzy semantic
  similarity grading;
- automatic accent/dialect identification or pronunciation scoring;
- comprehensive dialectology, dialect generation, or imitation;
- historical German, Fraktur/Kurrent reading, Middle High German, and literary
  syntax as core content;
- exhaustive Konjunktiv I/II, Ersatzinfinitiv clusters, passive alternatives,
  nominal style, and advanced comma edge cases beyond the declared early-B1
  subset;
- exhaustive gender/plural prediction from form; lexical facts remain lexical;
- specialist legal/medical/academic German, current political facts, and
  high-stakes real-world instructions;
- open interpretation of literature, irony, humor, or culturally dense
  implicature;
- raw vocabulary flashcards without context, morphology, collocation, listening,
  or retrieval variation;
- real timetables, prices, laws, or emergency information unless clearly
  fictional and self-contained.

### Orthography, input, and terminology conventions

- Internal text is Unicode NFC.
- `ä ö ü Ä Ö Ü ß ẞ` must render and input reliably.
- The active spelling profile determines `ß/ss`; `ae/oe/ue` and `ss` are not
  generally accepted substitutes in a spelling-production item unless a
  declared fallback mode permits them.
- Noun capitalization is meaningfully assessed. Case may normalize only in
  families where capitalization is not the target and doing so cannot merge a
  noun with another word/function.
- Sentence-initial capitalization and punctuation normalize only when explicitly
  outside the target.
- Compound spelling, hyphens, and word boundaries come from a reviewed
  morphological entry/template; the generator does not concatenate arbitrary
  nouns.
- Common grammar terminology can be paired: `Nominativ`, `Akkusativ`, `Dativ`,
  `Genitiv`; “verb-second (V2)”; `Vorfeld`, left bracket, `Mittelfeld`, right
  bracket, `Nachfeld`.
- “Position 2” means the second topological constituent/field position, not the
  second orthographic word.
- Optional phonemic/phonetic notation defines its inventory and profile; IPA is
  never prerequisite.

### Lexical and grammatical data model

```text
Lexeme {
  id
  lemma
  partOfSpeech
  senses[]
  gender?
  pluralForms[]
  nounDeclensionClass?
  genitiveForms[]
  verbClass?
  principalParts[]
  paradigmForms[]
  separability?
  prefixClass?
  perfectAuxiliaryFrames[]
  argumentCaseFrames[]
  prepositionFrames[]
  reflexiveFrames[]
  semanticTags[]
  selectionalTags[]
  compounds[]
  collocations[]
  frequencyBand
  learnerLevel
  register
  varietyScope[]
  pronunciations[]
  acceptedVariants[]
  provenance
  reviewStatus
}

Construction {
  id
  semanticFrame
  clauseType
  fieldTemplate
  argumentSlots[]
  government[]
  agreementLinks[]
  verbClusterTemplate
  informationStructure
  registerProfile
  varietyScope[]
  acceptedRealizations[]
}

DiscourseInstance {
  entities[]
  facts[]
  events[]
  eventIntervals[]
  speakers[]
  relationships[]
  referentLinks[]
  informationStatus[]
  speechActs[]
  varietyProfileId
}
```

Gender, plural, noun class, strong-verb parts, prefix behavior, perfect
auxiliary, government, reflexivity, stress, pronunciation, and variety scope are
lexical/construction data. They must not be guessed from an English gloss.

### Case and nominal-feature policy

Generate nominal forms in this order:

1. create semantic roles and syntactic construction;
2. assign case from subject/predicate/object role, verb/adjective government, or
   preposition;
3. assign gender, number, definiteness/determiner class, and possessor/reference;
4. distribute visible features across determiner, adjective, pronoun, and noun;
5. realize weak-noun, dative-plural, and genitive morphology;
6. linearize under the sentence's discourse/order constraints.

This prevents circular rules such as “it is dative because the article is
`dem`.” Case questions must distinguish identifying a form from explaining why
that case is required.

Adjective endings are generated by feature sufficiency: strong, weak, and mixed
patterns reflect which case/gender/number information is already expressed by
the determiner. The learner may receive a simpler pedagogical table, but the
checker uses the complete feature structure.

### Verb and clause policy

- Finite forms come from reviewed paradigms/rules plus explicit irregular
  overrides.
- Perfect auxiliary is selected per verb sense/construction; “motion always
  takes `sein`” is prohibited as a universal rule.
- Participle formation uses prefix class, separability, suffix, and lexical
  override. `ge-` is not added mechanically to every verb.
- Tense choice stores time/reference, result/relevance, narration medium, and
  register. Conversational perfect versus preterite preference is not reduced to
  “spoken/written” without lexical/contextual nuance.
- `werden` is typed separately as lexical change-of-state, future/probability
  auxiliary, and process-passive auxiliary; `sein + Partizip II` state-passive/
  result constructions remain separate.
- Main clauses use V2 or V1 templates as appropriate. Subordinate clauses use a
  reviewed verb-final/cluster template. Advanced cluster exceptions are excluded
  unless the family explicitly introduces them.
- Separable prefixes and nonfinite/auxiliary components occupy the sentence
  bracket according to clause type.
- Konjunktiv II is taught for politeness, wishes, advice, and hypotheses.
  Konjunktiv I is limited to recognition and highly controlled reported speech.

### Vocabulary and content policy

- Use a reviewed learner lexicon organized by sense and communicative domain.
- Introduce nouns as article+noun+plural (`der Tisch, die Tische`) and verbs with
  principal parts/government where relevant.
- New words include pronunciation, one collocation, example, level, and profile
  metadata.
- False friends and near-synonyms require a context that selects one sense.
- Compounds must be semantically plausible and stored/authored; do not generate
  comically long compounds as artificial difficulty.
- Names, addresses, businesses, notices, schedules, and prices are fictional.
- Regional cultural contexts are specific but not required trivia.
- Cognates may reduce load but must not dominate.

### Global answer conventions

- Trim surrounding whitespace and collapse repeated spaces unless spacing is
  assessed.
- Normalize Unicode to NFC.
- Preserve umlauts, `ß/ss` under profile, noun capitalization, and meaningful
  word boundaries.
- A visible fallback keyboard may insert special characters. Transliteration is
  accepted only when the item explicitly enables a non-orthographic fallback;
  it does not count as spelling mastery.
- Multiple choice, matching, ordering, and token assembly compare stable IDs.
- Short text accepts enumerated strings or feature-equivalent parses within the
  promised constrained grammar.
- Licensed constituent orders are accepted when they preserve the requested
  information structure; prompts constrain topic/focus where order matters.
- Comma and terminal punctuation are ignored only outside punctuation/complete-
  writing objectives.
- Profile-different standard forms receive accurate explanatory feedback; a
  profile-targeted production item may keep them separate from mastery success.
- Numbers/dates/times state whether digits, words, or both are accepted and which
  profile's display convention applies.
- “Almost correct” can diagnose a local feature but does not update mastery as
  correct.

### Response modes

- single/multiple choice;
- matching and categorization;
- case/feature labels;
- ordered constituents or field placement with keyboard alternatives;
- short constrained text;
- paradigm/table cells;
- multiple named fields;
- timeline, spatial relation, or role selection;
- sentence-to-picture and picture-to-sentence;
- audio discrimination/transcription;
- local recording with model/self-assessment;
- fault diagnosis plus correction.

Every prompt states whether it tests recognition, form production, case
assignment, word order, meaning selection, spelling, comprehension, or profile
awareness.

### Difficulty philosophy

Increase difficulty through:

- moving from recognition to production and reducing scaffolds;
- less transparent gender/plural/verb class after the operation is secure;
- more interacting case, agreement, government, bracket, reference, and
  information-structure dependencies;
- greater distance between agreeing/related elements;
- inversion or a genuine choice among semantic relations;
- connected discourse and cross-modal transfer;
- receptive variation after one production profile is stable;
- delayed retrieval and controlled mixing of mastered features.

Do not use tiny text, noisy/fast audio, obscure compounds, rare exceptions,
trivia, large numbers, arbitrary time pressure, long typing, or ambiguous
contexts as difficulty.

### General generation and rejection rules

Every instance must:

- reproduce from seed plus generator/data/profile version;
- start from a semantic, orthographic, phonological, or discourse model;
- use reviewed lexemes and licensed constructions;
- derive case and clause structure before surface endings/order;
- have one determinate task or explicit finite accepted set;
- give enough context for government, reference, tense, register, and order;
- record the misconception behind every distractor;
- reject answer collisions, accidental ambiguity, awkward compounds, lexical
  overload, and cosmetic-only variation;
- archive source features, accepted variants, and explanation data.

Audit families generate a correct instance first and inject exactly one logged
root fault. A hand-written broken sentence with an uncertain repair is invalid.

## 2. Category: Sound, spelling, capitalization, and punctuation

### Category purpose

Build reliable decoding and production of the written/sounded forms used by the
rest of the app. The goal is not accent elimination but awareness of contrasts,
predictive spelling cues, lexical exceptions, and profile-specific standards.

### Learn-card content

- Umlauts are distinct written vowels; `ä/ö/ü` are not decorative accents.
- Vowel length is cued by patterns such as open syllables, doubled vowels,
  `ie`, following consonant spelling, and `h`, but lexical review remains
  necessary.
- `ch` has common `ich`- and `ach`-type realizations conditioned by environment,
  with lexical/profile qualifications.
- Final obstruent devoicing affects pronunciation but not the lexical spelling:
  `Tag` relates to `Tage`.
- Stress often falls on a lexical stem, while prefixes, foreign words, and
  compounds need reviewed data.
- All nouns and nominalized words are capitalized.
- `ß/ss` follows orthographic/profile rules; Swiss Standard German uses `ss`.
- Compounds and commas encode structure and cannot be inserted randomly.

### Common misconceptions

- Umlauts can always be omitted without changing the word.
- Every doubled consonant is pronounced long rather than cueing the preceding
  vowel.
- `ie` means two separate vowel sounds in ordinary core words.
- `ch` has one pronunciation everywhere.
- Final `b/d/g` should be spelled as heard.
- Capitalize only names and sentence beginnings.
- `ß` is just an ornamental `s` or is mandatory in Switzerland.
- Any adjacent nouns can be joined into a valid compound.
- German puts a comma wherever the speaker pauses.

### Family `alphabet_letter_name`

**Task/purpose.** Recognize/produce German letter names and spelling sequences.
**Response/template.** Audio/text matching, ordered alphabet, or code spelling.
**Derivation.** Reviewed letter-name inventory and profile audio.
**Difficulty.** L1 common letters; L2 umlauts/`ß`; L3 confusable names and
spelling fictional names/codes; L4 multi-speaker chunks.
**Distractors/constraints.** `ß` is not a separate alphabet letter for ordering;
do not use real personal data. **Feedback.** Letter, name, example.
**Examples.** identify `ü` (L1); distinguish `B/P` names (L2); spell fictional
postcode code (L3). **Validation.** Inventory/audio profile.

### Family `umlaut_form_meaning`

**Task/purpose.** Distinguish/retrieve `a/ä`, `o/ö`, `u/ü` in lexical and
morphological contrasts. **Response/template.** Grapheme choice, word matching,
or form transformation. **Derivation.** Lexeme/paradigm specifies umlaut; it is
never guessed solely from plural/comparative meaning. **Difficulty.** L1 lexical
contrast; L2 plural/comparative; L3 verb stem change; L4 contextual dictation.
**Distractors/constraints.** Add umlaut to every plural/comparative, accept bare
vowel in spelling mode. **Feedback.** Lemma and paradigm relation.
**Examples.** `schon/schön` in context (L1); `Buch→Bücher` (L2);
`fahren→fährt` (L3). **Validation.** Lexeme/paradigm.

### Family `vowel_length_spelling`

**Task/purpose.** Infer/hear reviewed long/short vowel contrasts and connect them
to spelling cues. **Response/template.** Audio-word match, length label, or
spelling selection. **Derivation.** Lexical pronunciation plus syllable/spelling
pattern determines answer. **Difficulty.** L1 clear open/closed syllable; L2
double consonant/`h`/double vowel; L3 minimal contrasts; L4 morphology/profile.
**Distractors/constraints.** Treat consonant letter as lengthened, claim every
cue exceptionless. **Feedback.** Mark vowel nucleus and cue.
**Examples.** `Ofen/offen` (L1); `fahren` length cue (L2); reviewed `Staat/Stadt`
contrast (L3). **Validation.** Lexical audio/spelling.

### Family `ie_i_ei_diphthong`

**Task/purpose.** Decode/spell high-value `ie`, `i`, `ei/ai`, `eu/äu`, and
reviewed diphthong patterns. **Response/template.** Audio/text match or contextual
spelling. **Derivation.** Lexeme spelling and pronunciation determine mapping.
**Difficulty.** L1 `ie/ei`; L2 `eu/äu`; L3 lexical `ai` and morphological
relation; L4 dictation with homophony context. **Distractors/constraints.**
English letter-name transfer, infer homophonous spelling without meaning cue.
**Feedback.** Sound sequence and lexical/morphological spelling.
**Examples.** `Liebe` (L1); `mein` (L1); `Haus→Häuser` (L2).
**Validation.** Lexicon mapping.

### Family `ich_ach_ch_other`

**Task/purpose.** Select/identify common `ch` realizations and distinguish
reviewed exceptional/loan patterns. **Response/template.** Audio-word match,
environment classification, or profile-aware listening.
**Derivation.** Preceding sound, morpheme boundary, lexeme, and profile select
target pronunciation. **Difficulty.** L1 after front versus back vowel; L2 after
consonant/diminutive; L3 loans/proper forms; L4 multi-speaker profile.
**Distractors/constraints.** One English-like `ch`, infer region from one token.
**Feedback.** Highlight conditioning environment and exception status.
**Examples.** `ich` (L1); `Buch` (L1); `Mädchen` (L2).
**Validation.** Pronunciation registry.

### Family `s_z_sch_sp_st`

**Task/purpose.** Decode/spell reviewed `s`, `z`, `sch`, and word-initial
`sp/st` patterns. **Response/template.** Grapheme/audio match or word completion.
**Derivation.** Position, following sound, morphological boundary, lexeme, and
profile determine realization. **Difficulty.** L1 `sch/z`; L2 initial `sp/st`;
L3 `s/ss/ß` interaction; L4 profile/compound boundary.
**Distractors/constraints.** English `z` sound mapping, apply initial pattern
inside every morpheme. **Feedback.** Position/boundary diagram.
**Examples.** `Zeit` (L1); `Schule` (L1); `Straße` under profile (L2).
**Validation.** Lexeme/profile.

### Family `final_devoicing_spelling`

**Task/purpose.** Preserve lexical `b/d/g` spellings despite devoiced final
pronunciation, using related forms where useful. **Response/template.**
Contextual spelling, related-form match, or audio classification.
**Derivation.** Lexeme identity and inflected form expose underlying consonant.
**Difficulty.** L1 related plural cue; L2 adjective/verb relation; L3 compound
boundary; L4 dictation. **Distractors/constraints.** Spell only by surface sound,
choose unrelated “extension.” **Feedback.** Show alternating forms.
**Examples.** `Tag–Tage` (L1); `lieb–liebe` (L2); final consonant in compound
(L3). **Validation.** Morphological family.

### Family `syllable_word_stress`

**Task/purpose.** Segment reviewed forms and locate lexical/inflectional stress.
**Response/template.** Boundary/stress selection or audio/text match.
**Derivation.** Lexical stress plus prefix/suffix/morphological rules.
**Difficulty.** L1 simple native word; L2 unstressed/separable prefix contrast;
L3 foreign suffix or inflection; L4 phrase stress excluded unless explicit.
**Distractors/constraints.** Stress first syllable universally, stress every
written compound part equally. **Feedback.** Syllable boxes and stress-bearing
morpheme. **Examples.** `ARbeiten` (L1); `verSTEHen` (L2); `AUFstehen` (L2).
**Validation.** Lexical/morphological stress.

### Family `noun_capitalization`

**Task/purpose.** Capitalize nouns and nominalized forms while leaving ordinary
verbs/adjectives lowercase. **Response/template.** Corrected text, token
classification, or case-sensitive completion. **Derivation.** Parse and lexical/
syntactic category determine capitalization. **Difficulty.** L1 concrete noun;
L2 sentence nouns; L3 nominalized adjective/infinitive and ambiguous token; L4
short connected text. **Distractors/constraints.** Capitalize all content words,
lowercase nominalization, rely on suffix alone. **Feedback.** Identify nominal
head/function. **Examples.** `das Buch` (L1); `beim Essen` (L2);
`etwas Neues` (L3). **Validation.** Parse/category.

### Family `ss_eszett_profile`

**Task/purpose.** Choose `ss/ß` from vowel length and spelling profile in
reviewed words. **Response/template.** Grapheme choice, profile conversion, or
dictation. **Derivation.** Active profile and preceding-vowel/diphthong data
select spelling. **Difficulty.** L1 clear short/long contrast; L2 inflectional
forms; L3 Swiss versus non-Swiss profile conversion; L4 mixed text.
**Distractors/constraints.** `ß` after every long sound without lexical review,
mark Swiss `ss` wrong. **Feedback.** Profile and vowel cue.
**Examples.** `müssen` (L1); `Straße` non-Swiss (L2); `Strasse` Swiss (L3).
**Validation.** Orthography/profile oracle.

### Family `compound_boundary_spelling`

**Task/purpose.** Analyze/build reviewed compounds and identify head, modifier,
linking element, capitalization, and permitted hyphenation.
**Response/template.** Boundary placement, ordered components, head meaning, or
whole-word spelling. **Derivation.** Authored compound entry/template specifies
components, linking element, head, and profile spelling.
**Difficulty.** L1 two transparent nouns; L2 linking element; L3 mixed category/
hyphen; L4 three components with clear communicative value.
**Distractors/constraints.** Arbitrary productive concatenation, comically long
words, spaces copied from English. **Feedback.** Bracket compound and identify
right-hand head. **Examples.** `Haus+tür→Haustür` (L1);
`Arbeit+s+tag` (L2); reviewed hyphenated form (L3).
**Validation.** Compound registry and semantic plausibility.

### Family `comma_clause_boundary`

**Task/purpose.** Place commas around reviewed subordinate, relative,
coordinated, and infinitive-clause structures. **Response/template.** Punctuation
insertion, boundary selection, or correction. **Derivation.** Clause parse and
active orthographic rule determine required/optional commas.
**Difficulty.** L1 subordinate boundary; L2 relative clause; L3 multiple clauses
or selected infinitive comma; L4 optionality with stated house style.
**Distractors/constraints.** Pause-based commas, comma between simple subject and
verb, advanced edge cases excluded. **Feedback.** Bracket clauses and state
requirement. **Examples.** `Ich weiß, dass...` (L1); relative clause commas
(L2); controlled infinitive group (L3). **Validation.** Parse/rule version.

### Family `spelling_from_audio`

**Task/purpose.** Transcribe a reviewed word/phrase with umlaut, length cues,
capitalization, and profile spelling. **Response/template.** Short text with
replay and optional context. **Derivation.** Audio asset links transcript,
lexeme, profile, and targeted features. **Difficulty.** L1 transparent word; L2
umlaut/capitalization; L3 final devoicing or `ss/ß`; L4 short phrase.
**Distractors/constraints.** Context disambiguates homophones; no noise/speed
difficulty. **Feedback.** Align syllable, sound, morpheme, and spelling.
**Examples.** `Mutter` (L1); `die Tür` (L2); profiled `Straße/Strasse` (L3).
**Validation.** Human-reviewed alignment.

### Family `sound_spelling_audit`

**Task/purpose.** Diagnose one pronunciation–spelling, capitalization, compound,
profile, or comma fault. **Response/template.** Root label, correction, and
rule. **Derivation.** Mutate one feature after valid realization.
**Difficulty.** L1 grapheme/capital; L2 length/devoicing; L3 compound/profile;
L4 clause punctuation. **Distractors/constraints.** One root fault; mutation
must not create another accepted word/profile form. **Feedback.** Correct form
and decisive cue. **Examples.** lowercase noun (L1); final `Tag` spelled `Tak`
(L2); `ß` imposed in Swiss profile (L3). **Validation.** Fault manifest.

### Cross-family progression

Letters/umlauts precede length/diphthongs and consonant patterns. Lexical
spelling precedes morphology-based recovery. Noun capitalization precedes
compound structure; clause recognition precedes commas. Audio and audit families
combine only introduced contrasts.

## 3. Category: Vocabulary, noun phrases, cases, and prepositions

### Category purpose

Build noun phrases from meaning and grammatical features. Learners should assign
role/government first, then realize case across determiner, adjective, pronoun,
and noun rather than memorizing disconnected article tables.

### Learn-card content

- Learn every noun with gender and plural; endings are useful tendencies, not a
  complete predictor.
- Case marks a noun phrase's role or government. Word order can help
  interpretation but does not create case.
- Nominative commonly marks the subject and predicate nominal; accusative and
  dative occur with verb/preposition frames; genitive is introduced in bounded
  possession and preposition patterns.
- Determiners carry much of the visible case/gender/number information.
- Adjective ending depends on the entire phrase: feature bundle plus what the
  preceding determiner already expresses.
- Some masculine nouns use `-(e)n` outside nominative singular.
- Dative plural normally adds `-n` to the noun when the plural does not already
  end in `-n/-s`.
- Two-way prepositions select accusative for a directed endpoint/path reading
  and dative for location/state within the reviewed spatial model—not simply
  whenever “movement” occurs.
- Verb/adjective/noun preposition and case frames are lexical.

### Common misconceptions

- Gender can be derived reliably from the final letter.
- Plural always adds `-e` or `-s`.
- Nominative is the first noun phrase and accusative the second.
- Any person is dative and any thing accusative.
- Case belongs only to the article.
- Adjective endings can be chosen from gender alone.
- Add `-n` to every dative noun.
- A two-way preposition takes accusative whenever anyone moves.
- One English preposition maps to one German preposition/case.
- Genitive is obsolete and therefore always replaceable in a target sentence.

### Family `contextual_vocabulary`

**Task/purpose.** Retrieve a reviewed lexeme/sense from picture, definition,
features, or short context. **Response/template.** Choice, matching, or
lemma/form. **Derivation.** Semantic frame and selectional constraints yield one
target sense. **Difficulty.** L1 concrete frequent word; L2 routine verb/
adjective; L3 near-synonym/false friend; L4 register/profile-labeled choice.
**Distractors/constraints.** Same field but wrong defining feature; no trivia or
obscure untranslated clue. **Feedback.** Noun article/plural or verb principal
parts/government plus collocation. **Examples.** picture→`der Schlüssel` (L1);
contextual `kennen/wissen` (L2); `bekommen` false-friend context (L3).
**Validation.** Authored sense constraints.

### Family `collocation_phrase`

**Task/purpose.** Complete frequent collocations, light-verb expressions, and
routine chunks. **Response/template.** Word/preposition choice, matching, or
token assembly. **Derivation.** Sense/register/profile select a reviewed
collocation. **Difficulty.** L1 fixed phrase; L2 verb+noun/preposition; L3
competing collocations; L4 profile/register alternative.
**Distractors/constraints.** Literal interface-language calque, semantically
related noncollocate. **Feedback.** Whole chunk and contrast.
**Examples.** `Hunger haben` (L1); `eine Entscheidung treffen` (L2);
`Angst vor + Dativ haben` (L3). **Validation.** Collocation registry.

### Family `noun_gender`

**Task/purpose.** Retrieve a noun's grammatical gender and compatible
determinative form. **Response/template.** `der/die/das`, gender class, or
phrase completion. **Derivation.** Lexeme/sense supplies gender; productive
suffix clues appear only when reviewed. **Difficulty.** L1 frequent transparent
class; L2 mixed endings; L3 homonymous meaning/gender contrasts; L4 profile
variation. **Distractors/constraints.** Natural sex or last-letter guessing,
translation gender transfer. **Feedback.** Article+noun+plural and useful
pattern/exception. **Examples.** `der Tisch` (L1); `das Mädchen` (L2);
meaning-dependent `der/das See` (L3). **Validation.** Lexeme sense.

### Family `noun_plural`

**Task/purpose.** Produce/recognize plural using suffix, umlaut, zero, or
reviewed loan pattern. **Response/template.** Typed form, matching, or
singular↔plural transformation. **Derivation.** Lexeme's plural class and
orthographic profile yield form. **Difficulty.** L1 common `-e/-en`; L2
umlaut/zero/`-er`; L3 loan `-s` and multiple patterns; L4 meaning/profile
variants. **Distractors/constraints.** One default suffix, umlaut every eligible
vowel, infer unreviewed plural. **Feedback.** Store/show singular with article
and plural. **Examples.** `die Frau→die Frauen` (L1);
`das Buch→die Bücher` (L2); `der Lehrer→die Lehrer` (L2).
**Validation.** Paradigm entry.

### Family `weak_masculine_noun`

**Task/purpose.** Inflect common weak masculine nouns across singular cases and
plural. **Response/template.** Noun form, case-form match, or phrase correction.
**Derivation.** Lexeme class plus case/number selects nominative singular base or
`-(e)n` form. **Difficulty.** L2 high-frequency `-e`; L3 other weak nouns and
determiner interaction; L4 mixed weak/mixed-class exceptions.
**Distractors/constraints.** Leave all singulars unchanged, add ending to
nominative singular, apply class to every masculine noun. **Feedback.** Paradigm
with requested cell. **Examples.** `der Junge/den Jungen` (L2);
`mit dem Studenten` (L3); `des Menschen` (L3). **Validation.** Noun class.

### Family `case_semantic_role`

**Task/purpose.** Assign case from semantic/syntactic role before surface
declension. **Response/template.** Case label, role-case matching, or field
annotation. **Derivation.** Predicate/verb construction assigns subject,
predicate nominal, accusative/dative object, or genitive relation.
**Difficulty.** L1 nominative subject/accusative object; L2 dative recipient;
L3 flexible order/experiencer; L4 interacting government.
**Distractors/constraints.** First noun=nominative, person=dative, visible
article-only reasoning. **Feedback.** Predicate→role→case arrow.
**Examples.** `Der Mann sieht den Hund` (L1); `Sie gibt dem Kind das Buch`
(L2); object-fronted clause (L3). **Validation.** Semantic frame.

### Family `definite_article_declension`

**Task/purpose.** Select definite article by case, gender, and number.
**Response/template.** Article cell, completed phrase, or feature match.
**Derivation.** Four-feature lookup in verified paradigm.
**Difficulty.** L1 nominative/accusative singular; L2 dative/plural; L3 genitive
and syncretic-form diagnosis; L4 article in flexible order.
**Distractors/constraints.** Gender alone, `die` always feminine, confuse
syncretic surface with one fixed case. **Feedback.** Highlight paradigm cell and
role/government. **Examples.** `der Mann` nominative (L1);
`mit dem Kind` dative (L2); `wegen des Wetters` profile/style target (L3).
**Validation.** Paradigm+assigned case.

### Family `ein_word_possessive_declension`

**Task/purpose.** Decline `ein`, `kein`, and possessive determiners using the
same ending pattern while preserving possessor features.
**Response/template.** Determiner form, phrase assembly, or paradigm match.
**Derivation.** Determiner stem/possessor plus case/gender/number yields form.
**Difficulty.** L1 `ein/eine`; L2 accusative/dative and `kein`; L3 possessives/
plural; L4 syncretism/reference. **Distractors/constraints.** Agree possessive
with possessor, use `ein` plural, add definite endings mechanically.
**Feedback.** Separate determiner stem from declensional ending.
**Examples.** `ein Buch` (L1); `keinen Kaffee` (L2);
`mit meiner Schwester` (L3). **Validation.** Paradigm/reference.

### Family `personal_pronoun_case`

**Task/purpose.** Choose/recover personal pronouns across nominative, accusative,
and dative, with selected genitive forms excluded from core production.
**Response/template.** Pronoun choice, referent matching, or replacement.
**Derivation.** Referent person/number/gender and assigned case select form.
**Difficulty.** L1 `ich/mich/du/dich`; L2 third person/dative; L3 competing
referents and polite `Sie`; L4 flexible order/profile context.
**Distractors/constraints.** English object form mapping, gender of natural
referent only, lowercase polite `Sie`. **Feedback.** Referent+role+case.
**Examples.** `Er sieht mich` (L1); `Ich helfe ihm` (L2);
`Kann ich Ihnen helfen?` (L3). **Validation.** Referent/case paradigm.

### Family `adjective_declension`

**Task/purpose.** Produce adjective endings after definite, `ein`-word, or zero
determiner. **Response/template.** Ending/form, phrase assembly, or table cell.
**Derivation.** Case, gender, number, determiner class, and feature expression
select strong/weak/mixed ending. **Difficulty.** L1 nominative common phrases;
L2 accusative/dative; L3 zero article/plural/genitive; L4 multiple adjectives/
syncretic diagnosis. **Distractors/constraints.** Gender-only ending, one ending
per case, copy article ending, ignore determiner class. **Feedback.** Show which
features determiner marks and which adjective must mark.
**Examples.** `der große Hund` (L1); `ein großer Hund` (L2);
`mit kaltem Wasser` (L3). **Validation.** Independent declension oracle.

### Family `dative_plural_n`

**Task/purpose.** Add or withhold noun `-n` in dative plural.
**Response/template.** Noun-phrase transformation or correction.
**Derivation.** Assigned dative+plural plus lexical plural ending determine
whether extra `-n` is required. **Difficulty.** L2 ordinary plural; L3 plural
already in `-n/-s`; L4 weak/loan/compound nouns.
**Distractors/constraints.** Add `-n` to every dative plural or none.
**Feedback.** Show plural base and conditional addition.
**Examples.** `mit den Kindern` (L2); `mit den Frauen` no extra form change
(L2); `mit den Autos` (L3). **Validation.** Plural form+rule.

### Family `genitive_noun_phrase`

**Task/purpose.** Build/interpret bounded genitive possession and common
genitive-governing frames. **Response/template.** Phrase form, relation match,
or transformation. **Derivation.** Possessor/possessed roles, noun class,
case/gender/number select determiner/adjective and noun `-(e)s` where required.
**Difficulty.** L2 proper-name possession; L3 masculine/neuter common noun; L4
plural/feminine and controlled preposition/register alternatives.
**Distractors/constraints.** Add `-s` to feminine/plural nouns, confuse English
apostrophe, claim genitive universally impossible. **Feedback.** Possession
roles and full case marking. **Examples.** `Annas Buch` (L2);
`die Tür des Hauses` (L3); `während der Reise` (L3).
**Validation.** Genitive morphology/construction.

### Family `fixed_case_preposition`

**Task/purpose.** Assign and realize case after high-frequency fixed-case
prepositions. **Response/template.** Case/article choice, spatial/temporal
phrase, or correction. **Derivation.** Preposition sense/frame directly assigns
accusative, dative, or bounded genitive. **Difficulty.** L1 common accusative/
dative; L2 pronouns/plural; L3 genitive and profile alternatives; L4 competing
homonymous/lexical frames. **Distractors/constraints.** Spatial meaning overrides
fixed government, article sound heuristic. **Feedback.** Preposition→case link.
**Examples.** `für den Kurs` (L1); `mit dem Bus` (L1);
`trotz des Regens` in target profile (L3). **Validation.** Government registry.

### Family `two_way_preposition`

**Task/purpose.** Select accusative/dative after `an, auf, hinter, in, neben,
über, unter, vor, zwischen` from spatial configuration.
**Response/template.** Case/form, diagram match, or paired interpretation.
**Derivation.** Endpoint/directional placement versus location/state within a
reference region selects case; verb alone does not.
**Difficulty.** L1 clear put versus be; L2 motion within location; L3 abstract/
temporal reviewed uses; L4 same verb with different spatial construal.
**Distractors/constraints.** “movement=accusative,” “static verb=dative,”
ambiguous diagram. **Feedback.** Draw path endpoint or location region.
**Examples.** `in die Küche gehen` (L1); `in der Küche laufen` (L2);
`das Bild an die Wand hängen / an der Wand hängen` (L3).
**Validation.** Spatial model.

### Family `governed_case_valency`

**Task/purpose.** Select case/preposition from a reviewed verb, adjective, or
noun valency frame. **Response/template.** Case/preposition choice, role
matching, or sentence completion. **Derivation.** Lexeme sense and argument role
select frame. **Difficulty.** L1 frequent accusative/dative verb; L2 reflexive/
prepositional frame; L3 competing senses; L4 clause complement.
**Distractors/constraints.** Translate interface-language preposition, person=
dative, substitute semantically close verb's frame. **Feedback.** Whole lexical
frame. **Examples.** `jemandem helfen` (L1); `auf etwas warten` (L2);
`sich für etwas interessieren` (L3). **Validation.** Valency registry.

### Family `preposition_article_contraction`

**Task/purpose.** Form/interpret common contractions such as `am, im, ins, ans,
beim, vom, zum, zur` and distinguish required/optional/noncontracted meanings.
**Response/template.** Expansion, contraction, or context choice.
**Derivation.** Preposition+definite article, case/gender, definiteness, emphasis,
and lexical construction select surface. **Difficulty.** L1 expand common form;
L2 direction/location pairs; L3 contraction versus demonstrative/emphatic full
form; L4 fixed expressions/profile. **Distractors/constraints.** Contract any
article, lose case, treat contraction as separate unanalyzable preposition.
**Feedback.** Expand components and features. **Examples.** `in dem→im` (L1);
`in das→ins` (L2); `zu der→zur` (L2). **Validation.** Contraction grammar.

### Family `quantifier_number_date_time`

**Task/purpose.** Read/write quantifiers, cardinals, ordinals, dates, times,
prices, telephone groups, measures, and ordinary large values.
**Response/template.** Digits, words, structured fields, audio match, or
secondary arithmetic. **Derivation.** Value+unit/date/time/profile grammar yields
forms and agreement/case. **Difficulty.** L1 0–100/time; L2 dates/prices/
ordinals; L3 thousands/decimals/phone grouping; L4 mixed practical document.
**Distractors/constraints.** No giant arithmetic; beware reversed `einundzwanzig`,
`eins/ein/eine`, ordinal endings, profile separators.
**Feedback.** Group value and inflection. **Examples.** `21→einundzwanzig`
(L1); `am dritten Mai` (L2); fictional decimal price (L3).
**Validation.** Independent numeric grammar.

### Family `noun_phrase_audit`

**Task/purpose.** Diagnose one vocabulary, gender, plural, case, determiner,
adjective, weak-noun, dative-plural, genitive, or preposition fault.
**Response/template.** Root cause, correction, and feature/meaning effect.
**Derivation.** Mutate one feature/realization after building a valid phrase.
**Difficulty.** L1 gender/plural; L2 case/article; L3 adjective/noun marking;
L4 government/spatial construal. **Distractors/constraints.** One root fault;
valid profile alternative not mutated into “error.” **Feedback.** Correct
role→case→phrase chain. **Examples.** `die Tisch` (L1); `mit den Kinder` (L2);
accusative selected merely because person moves within a room (L3).
**Validation.** Fault manifest.

### Cross-family progression

Vocabulary introduces noun gender/plural and verb government. Case roles precede
surface paradigms. Definite articles precede `ein`-words/pronouns; determiner
control precedes adjective declension. Fixed-case prepositions precede two-way
spatial choice. Weak nouns, dative plural, genitive, contractions, and audits are
added after the corresponding case is stable.

## 4. Category: Verb morphology, tense, modality, and voice

### Category purpose

Make verb forms and multi-part predicates retrievable while preserving their
semantic roles and clause behavior. Morphological production, auxiliary/
construction choice, and word-order placement are separated before integration.

### Learn-card content

- Learn high-frequency verbs with principal parts and government:
  `nehmen – nimmt – nahm – hat genommen`.
- Present endings are regular enough to practice systematically, but stem-vowel,
  consonant, and spelling behavior are lexeme/class-specific.
- Modal verbs create a finite modal plus bare infinitive sentence bracket.
- Separable prefixes split in finite main clauses but remain integrated in
  infinitives/participles and verb-final structures according to the construction.
- Perfect uses `haben` or `sein` by reviewed sense/construction plus a past
  participle; participles do not receive `ge-` mechanically.
- Present perfect and preterite distribution depends on lexeme, medium,
  register, region, and discourse.
- `werden` can mean become, mark future/probability, or form process passive.
- `sein + Partizip II` commonly describes a resultant state and is not
  interchangeable with process passive.
- Konjunktiv II supports politeness, advice, wishes, and hypotheses.
- Infinitive clauses and `zu` placement depend on verb/prefix and construction.

### Common misconceptions

- Every non-present verb is irregular in an unpredictable way.
- Stem change appears in every present-person cell.
- Modal verbs take `zu`.
- A separable prefix always sits at the end, including subordinate clauses.
- Every past participle begins with `ge-`.
- All motion verbs take `sein` and all others `haben`.
- Perfect always means spoken and preterite always written.
- `werden` always means future.
- Passive is simply `sein + participle`.
- `würde` plus infinitive is the only or always best Konjunktiv II form.

### Family `verb_class_principal_parts`

**Task/purpose.** Identify regular/strong/mixed/prefix class and retrieve
principal parts/government. **Response/template.** Classification, matching, or
stem/part completion. **Derivation.** Lexeme metadata provides present third
singular, preterite, participle, auxiliary, and frame.
**Difficulty.** L1 regular; L2 common strong; L3 mixed/prefix/reflexive; L4
compare meaning-dependent frames. **Distractors/constraints.** Guess class from
English cognate, transfer one vowel pattern universally. **Feedback.** Compact
principal-parts card. **Examples.** `machen–machte–gemacht` (L1);
`sehen–sah–gesehen` (L2); `bringen–brachte–gebracht` (L3).
**Validation.** Reviewed paradigm.

### Family `present_finite_form`

**Task/purpose.** Produce/recognize present finite forms with person/number
agreement. **Response/template.** Typed form, paradigm cell, or subject match.
**Derivation.** Lexeme stem/class plus person/number yields ending and phonological
adjustment. **Difficulty.** L1 regular common cells; L2 all persons and `-t/-d`
stems; L3 sibilant stems/irregulars; L4 retrieval in context.
**Distractors/constraints.** Infinitive retained, wrong ending, unnecessary
apostrophe, omit epenthetic `e`. **Feedback.** Stem+ending.
**Examples.** `ich mache` (L1); `ihr arbeitet` (L2);
`du heißt` (L3). **Validation.** Paradigm.

### Family `present_stem_change`

**Task/purpose.** Apply reviewed `e→i/ie`, `a→ä`, and other high-frequency stem
changes only in licensed present cells. **Response/template.** Form production,
paradigm pattern, or error diagnosis. **Derivation.** Lexeme alternation table
plus person/number. **Difficulty.** L1 third singular; L2 `du`/third versus
plural contrast; L3 separable/reflexive context; L4 mixed lexemes.
**Distractors/constraints.** Change `ich/wir/ihr`, umlaut any strong verb, carry
preterite vowel into present. **Feedback.** Highlight changing cells.
**Examples.** `er fährt` (L1); `du liest/wir lesen` (L2);
`sie nimmt` (L2). **Validation.** Paradigm cell.

### Family `haben_sein_werden_present`

**Task/purpose.** Retrieve and interpret present forms of `haben`, `sein`, and
lexical `werden`. **Response/template.** Form, subject match, or meaning choice.
**Derivation.** Lemma/person/number and construction select irregular form.
**Difficulty.** L1 `ich/du/er`; L2 full paradigm; L3 possession/copular/change-
of-state distinction; L4 interaction with auxiliary uses.
**Distractors/constraints.** Regularize forms, equate every `werden` with future.
**Feedback.** Paradigm and construction meaning.
**Examples.** `ich bin` (L1); `ihr habt` (L2);
`Das Wetter wird kalt` (L3). **Validation.** Paradigm/construction.

### Family `modal_verb_bracket`

**Task/purpose.** Conjugate modal verbs and build finite-modal + bare-infinitive
predicates. **Response/template.** Form, sentence bracket, or meaning match.
**Derivation.** Modal sense/person selects finite form; lexical predicate remains
bare infinitive in right bracket. **Difficulty.** L1 `können/müssen`; L2 all
modals/present; L3 negation/objects; L4 preterite or nuanced `sollen/dürfen`.
**Distractors/constraints.** `zu` before infinitive, conjugate both verbs, wrong
stem-vowel cell. **Feedback.** Bracket finite modal and infinitive.
**Examples.** `Ich kann schwimmen` (L1); `Heute muss er arbeiten` (L2);
`Du darfst hier nicht parken` (L3). **Validation.** Modal construction.

### Family `separable_prefix`

**Task/purpose.** Identify separability and place/form prefix with finite,
infinitive, participial, and verb-final hosts. **Response/template.** Token
ordering, whole form, or class choice. **Derivation.** Lexeme prefix class,
clause type, and nonfinite form determine integration/separation/stress.
**Difficulty.** L1 present main clause; L2 infinitive/participle; L3 subordinate
clause; L4 same-looking separable/inseparable prefix contrasts.
**Distractors/constraints.** Split every prefix, split in subordinate final
complex, infer solely from spelling where lexical contrast exists.
**Feedback.** Prefix class and bracket/word boundary.
**Examples.** `Ich stehe auf` (L1); `aufstehen` (L2);
`weil ich aufstehe` (L3). **Validation.** Prefix metadata+clause.

### Family `reflexive_verb_form`

**Task/purpose.** Produce/interpret reflexive pronouns with inherently
reflexive, ordinary reflexive, reciprocal, and affected-body constructions.
**Response/template.** Pronoun/case choice, sentence assembly, or meaning label.
**Derivation.** Lexeme/construction assigns reflexive role/case and subject
features. **Difficulty.** L1 accusative daily routine; L2 dative reflexive with
object; L3 lexical meaning/reciprocal; L4 field order.
**Distractors/constraints.** Use `sich` for all persons, assume every reflexive
is accusative or literal self-action. **Feedback.** Subject↔reflexive role/case.
**Examples.** `Ich wasche mich` (L1); `Ich wasche mir die Hände` (L2);
`Wir treffen uns` (L3). **Validation.** Reflexive frame.

### Family `imperative_address`

**Task/purpose.** Form commands for `du`, `ihr`, and polite `Sie`, including
separable/reflexive verbs. **Response/template.** Command form, address match, or
ordered sentence. **Derivation.** Addressee number/register and verb class select
finite form, pronoun presence, prefix, and punctuation.
**Difficulty.** L1 regular `du/Sie`; L2 `ihr` and irregulars; L3 separable/
reflexive; L4 polite mitigated instruction.
**Distractors/constraints.** Mix `Sie` with `du` form, retain `du` mechanically,
lose prefix. **Feedback.** Addressee bundle and derivation.
**Examples.** `Komm!` (L1); `Kommen Sie bitte!` (L1);
`Steht bitte auf!` (L2). **Validation.** Imperative paradigm/profile.

### Family `past_participle_form`

**Task/purpose.** Produce/recognize Partizip II for regular, strong, mixed,
separable, inseparable, and `-ieren` verbs. **Response/template.** Typed
participle, morphology segmentation, or class match.
**Derivation.** Prefix/separability, stem class, suffix, and lexical override
yield form. **Difficulty.** L1 regular `ge-...-t`; L2 strong `-en`; L3 prefix/
`-ieren`; L4 mixed/irregular. **Distractors/constraints.** Add `ge-` universally,
place `ge` before separable prefix, regularize strong stem.
**Feedback.** Bracket prefix+`ge`+stem+suffix.
**Examples.** `gemacht` (L1); `gesehen` (L2);
`angerufen/studiert` (L3). **Validation.** Principal-parts registry.

### Family `perfect_auxiliary_choice`

**Task/purpose.** Choose `haben` or `sein` for a verb sense/construction.
**Response/template.** Auxiliary choice, frame classification, or paired
interpretation. **Derivation.** Lexeme sense, transitivity/reflexivity,
change-of-location/state construction, and profile select auxiliary.
**Difficulty.** L1 high-frequency clear frames; L2 ambiguous motion/activity;
L3 sense-dependent/profile variants; L4 context contrast.
**Distractors/constraints.** “All motion=`sein`,” choose by animate subject,
ignore transitive/reflexive frame. **Feedback.** Whole construction/principal
part. **Examples.** `hat gearbeitet` (L1); `ist angekommen` (L1);
`hat das Auto gefahren / ist nach Berlin gefahren` (L3).
**Validation.** Sense/frame registry.

### Family `perfect_sentence`

**Task/purpose.** Build present perfect with finite auxiliary and participle in
the right bracket. **Response/template.** Form fields, ordered tokens, or
sentence transformation. **Derivation.** Subject controls auxiliary; lexical
frame controls auxiliary/participle; clause type controls placement.
**Difficulty.** L1 simple main clause; L2 objects/adverbials; L3 separable/
reflexive; L4 subordinate clause. **Distractors/constraints.** Participle after
subject before objects, agree participle, finite lexical past.
**Feedback.** Highlight left/right bracket and participle derivation.
**Examples.** `Ich habe gearbeitet` (L1); `Er ist gestern angekommen` (L2);
`weil sie das Buch gelesen hat` (L4). **Validation.** Morphology+field model.

### Family `preterite_form`

**Task/purpose.** Produce/recognize preterite forms, prioritizing `sein`,
`haben`, modals, and frequent narrative verbs. **Response/template.** Typed
cell, matching, or bounded completion. **Derivation.** Lexeme preterite stem/
suffix plus person/number. **Difficulty.** L1 `war/hatte`; L2 modal/regular; L3
strong/mixed; L4 connected narrative retrieval.
**Distractors/constraints.** Perfect participle, present ending on past stem,
English-like universal dental suffix. **Feedback.** Principal part+ending.
**Examples.** `ich war` (L1); `wir mussten` (L2);
`er ging` (L3). **Validation.** Paradigm.

### Family `past_tense_register_choice`

**Task/purpose.** Choose/interpret perfect versus preterite under explicit
lexeme, genre, register, discourse, and variety constraints.
**Response/template.** Tense/form choice, text-genre match, or rewrite.
**Derivation.** Event meaning plus profile/medium/register and lexical frequency
license accepted forms. **Difficulty.** L2 `war/hatte/modal` versus lexical
perfect; L3 conversation/narrative; L4 standard-profile alternatives.
**Distractors/constraints.** Spoken=perfect/written=preterite as exceptionless,
mark natural variant wrong. **Feedback.** State tense meaning and usage profile.
**Examples.** conversational `Ich habe gegessen` (L2); narrative `Er ging...`
(L3); profiled alternate classification (L4). **Validation.** Usage matrix.

### Family `pluperfect_sequence`

**Task/purpose.** Form/interpret pluperfect as anterior to a past reference.
**Response/template.** Form, event ordering, or timeline match.
**Derivation.** Preterite `haben/sein` + participle locates event A before past
event B. **Difficulty.** L2 explicit two-event sequence; L3 irregular participle/
auxiliary; L4 connected narrative. **Distractors/constraints.** Reverse events,
use present-perfect auxiliary, choose auxiliary from surface motion shortcut.
**Feedback.** Two-level timeline and form.
**Examples.** `Nachdem ich gegessen hatte...` (L2);
`Sie war schon gegangen` (L2); order three events (L4).
**Validation.** Event graph+paradigm.

### Family `future_probability_werden`

**Task/purpose.** Build `werden + infinitive` and distinguish future prediction/
promise from present+time expression and probability inference.
**Response/template.** Form, timeline/meaning choice, or construction match.
**Derivation.** Finite `werden`, bare infinitive, time/evidential frame, and
register determine realization. **Difficulty.** L2 form; L3 future versus
present; L4 probability about present/future.
**Distractors/constraints.** Use future for every future event, lexical
“become” interpretation always, conjugate infinitive.
**Feedback.** Construction and modal/temporal meaning.
**Examples.** `Ich werde kommen` (L2); `Morgen fahre ich...` alternative (L3);
`Er wird jetzt zu Hause sein` probability (L4). **Validation.** Frame/field.

### Family `process_state_passive`

**Task/purpose.** Form and distinguish process passive (`werden`) and
state/result passive (`sein`) in reviewed transitive constructions.
**Response/template.** Auxiliary/form choice, active-passive mapping, or scene
match. **Derivation.** Event versus resultant-state frame, patient promotion,
tense, and participle produce clause. **Difficulty.** L2 present process; L3
state contrast and past; L4 agent phrase/word order.
**Distractors/constraints.** Passive=`sein` universally, retain active object
case, use intransitive verb without licensed passive.
**Feedback.** Role mapping and event/state contrast.
**Examples.** `Die Tür wird geöffnet` process (L2);
`Die Tür ist geöffnet` state (L3); agent with `von` (L4).
**Validation.** Transitivity/frame.

### Family `werden_function`

**Task/purpose.** Classify and realize lexical change-of-state, future/
probability, and passive uses of `werden`. **Response/template.** Meaning label,
paraphrase match, or missing complement. **Derivation.** Complement type
(predicate adjective/noun, infinitive, participle) and semantic frame identify
construction. **Difficulty.** L2 clear complement; L3 same tense/similar words;
L4 embedded/negated context. **Distractors/constraints.** One gloss for all
uses, confuse Partizip II with infinitive. **Feedback.** Bracket complement and
name construction. **Examples.** `Es wird kalt` (L1);
`Er wird kommen` (L2); `Das wird repariert` (L3).
**Validation.** Construction parse.

### Family `konjunktiv_ii_politeness_hypothesis`

**Task/purpose.** Form/use common synthetic or `würde` Konjunktiv II for polite
requests, wishes, advice, and present hypotheses.
**Response/template.** Form, scenario-to-utterance match, or clause pairing.
**Derivation.** Speech act/possible-world frame and lexeme usage preference
select `hätte/wäre/könnte/...` or licensed `würde + infinitive`.
**Difficulty.** L2 fixed polite forms; L3 wishes/advice; L4 conditional
hypothesis and synthetic/`würde` choice. **Distractors/constraints.** Indicative
for counterfactual target, `würde` plus modal redundantly, assert one realization
universally superior. **Feedback.** Reality/politeness relation and form.
**Examples.** `Ich hätte gern...` (L2); `Könnten Sie...?` (L2);
`Wenn ich Zeit hätte, würde ich...` (L4). **Validation.** Mood/frame registry.

### Family `infinitive_zu_construction`

**Task/purpose.** Select bare versus `zu` infinitive and place `zu` with
separable verbs in reviewed constructions. **Response/template.** Infinitive
form, clause assembly, or subject-control match. **Derivation.** Governing
lexeme/construction, subject identity, and separability determine presence/
position. **Difficulty.** L2 `versuchen/planen` versus modal; L3 separable
`anzufangen`; L4 `um...zu/ohne...zu` and comma.
**Distractors/constraints.** Add `zu` after modal, write `zu anfangen`, ignore
subject control. **Feedback.** Governing frame and morpheme placement.
**Examples.** `Ich versuche zu schlafen` (L2); `Ich muss schlafen` (L2);
`um früh aufzustehen` (L3). **Validation.** Infinitive frame.

### Family `reported_speech_konjunktiv`

**Task/purpose.** Recognize and form a small high-frequency Konjunktiv I subset
in clearly marked reported speech, with indicative/Konjunktiv II alternatives
classified by profile/register. **Response/template.** Source-report match, form
choice, or controlled transformation. **Derivation.** Reported speaker/person,
back-reference, verb paradigm, and register select a reviewed realization.
**Difficulty.** L3 `sei/habe/werde`; L4 third-person common verbs and ambiguity
avoidance. **Distractors/constraints.** Not open news rewriting; no deep tense
sequence; do not mark conversational indicative universally wrong.
**Feedback.** Original claim versus reporter commitment/form.
**Examples.** `Er sagt, er sei krank` (L3); `sie habe keine Zeit` (L3);
controlled ambiguity contrast (L4). **Validation.** Reported-proposition graph.

### Family `verb_morphology_audit`

**Task/purpose.** Diagnose one finite form, stem, prefix, participle, auxiliary,
tense/register, passive, mood, or infinitive fault.
**Response/template.** Root cause, correction, and meaning/structure effect.
**Derivation.** Inject one feature mutation into a valid verb construction.
**Difficulty.** L1 agreement; L2 participle/auxiliary; L3 tense/passive/
infinitive; L4 mood/profile/cluster. **Distractors/constraints.** One root fault;
profile-valid alternate not mislabeled. **Feedback.** Correct morphology and
construction diagram. **Examples.** `ge-studiert` (L2); `ist gearbeitet` in
target frame (L2); `zu` after modal (L3). **Validation.** Fault manifest.

### Cross-family progression

Principal parts and present forms precede stem changes and multi-part predicates.
Modals/separable/reflexive verbs establish brackets before perfect. Participle
and auxiliary choice precede complete perfect; preterite form precedes
register-sensitive tense selection. `werden` senses are separated before passive
and probability. Fixed Konjunktiv II precedes hypotheses; controlled infinitive
and reported-speech work remain late.

## 5. Category: Clause structure, word order, reference, and negation

### Category purpose

Develop control of German sentence architecture. Learners place constituents and
verb parts in fields, then refine object/adverbial/negation order from
grammatical, semantic, and discourse constraints. The app must not teach a
single total-order mnemonic as if German allowed only one sentence.

### Learn-card content

- In a declarative main clause, one constituent occupies the `Vorfeld` and the
  finite verb occupies the left bracket: V2 means second constituent, not second
  word.
- Yes/no questions and many commands use verb-first.
- Separable prefixes, infinitives, and participles form the right bracket in
  main clauses.
- Introduced subordinate clauses typically place the finite verb/verb complex in
  the right bracket; advanced cluster exceptions are outside the early core.
- A whole subordinate clause can occupy the main-clause `Vorfeld`; the finite
  main verb still immediately follows that constituent.
- Case permits several object orders, but pronoun status, animacy, definiteness,
  weight, information structure, and idiom affect naturalness.
- Time–cause–manner–place (`TeKaMoLo`) is a useful neutral tendency for some
  adverbials, not an exceptionless sorting algorithm.
- `nicht` targets a constituent or broader predicate; its position reflects
  scope. `kein` negates an eligible noun phrase.
- Relative-pronoun gender/number comes from the antecedent; case comes from the
  pronoun's role inside the relative clause.

### Common misconceptions

- The finite verb is literally the second written word.
- The subject must occupy the `Vorfeld`.
- Fronting an adverbial permits subject+verb afterward as in English.
- Every question uses English-like auxiliary support.
- Every verb component stays adjacent to the finite verb.
- “Verb final” means every subordinate-clause verb has one simple universal
  order.
- Dative must precede accusative in every sentence.
- `TeKaMoLo` makes all other orders wrong.
- Put `nicht` at the end of every sentence.
- `kein` and `nicht` are freely interchangeable.
- A relative pronoun gets case from its antecedent.

### Family `field_model_segmentation`

**Task/purpose.** Segment a clause into `Vorfeld`, left bracket, `Mittelfeld`,
right bracket, and optional `Nachfeld`. **Response/template.** Field placement,
boundary marking, or matching. **Derivation.** Stored clause parse and verb
complex determine field spans. **Difficulty.** L1 simple V2; L2 sentence
bracket; L3 subordinate/relative; L4 embedded clause as field.
**Distractors/constraints.** Count words, split a constituent, place finite/non-
finite parts together by default. **Feedback.** Render labeled field table.
**Examples.** `Heute | kommt | er` (L1); perfect bracket (L2);
`weil...` clause (L3). **Validation.** Parse→field projection.

### Family `main_clause_v2`

**Task/purpose.** Build a declarative main clause with exactly one `Vorfeld`
constituent followed by the finite verb. **Response/template.** Ordered
constituents or constrained text. **Derivation.** Select topic constituent;
place finite verb in left bracket and remaining material in fields.
**Difficulty.** L1 subject first; L2 adverbial/object first; L3 multiword/
subordinate constituent first; L4 discourse-selected topic.
**Distractors/constraints.** Second word rule, subject+verb after fronted
adverbial, split the fronted phrase. **Feedback.** Box the first constituent and
finite verb. **Examples.** `Ich lerne heute` (L1);
`Heute lerne ich` (L2); `Nach der Arbeit gehe ich...` (L2).
**Validation.** V2 field invariant.

### Family `fronting_topic_focus`

**Task/purpose.** Choose a grammatical and contextually appropriate `Vorfeld`
constituent while preserving clause roles. **Response/template.** Context-order
match or allowed-set selection. **Derivation.** Given/new, contrast, temporal/
spatial frame, and syntactic constituency license fronting.
**Difficulty.** L2 familiar adverbial; L3 object/predicative; L4 full dependent
clause or contrastive context. **Distractors/constraints.** Treat all V2 orders
as identical, front nonconstituent, change case after movement.
**Feedback.** Topic/focus map and unchanged dependencies.
**Examples.** neutral subject-first (L2); `Den Film habe ich schon gesehen`
(L3); `Wenn es regnet, bleibe ich...` (L4). **Validation.** Discourse/order set.

### Family `yes_no_verb_first`

**Task/purpose.** Form/interpret yes/no questions with finite verb first and
right-bracket material preserved. **Response/template.** Ordered question,
statement↔question transformation, or answer match.
**Derivation.** Move finite verb to first/left bracket, leave arguments and
nonfinite parts under question information structure.
**Difficulty.** L1 simple present; L2 modal/perfect/separable; L3 negation/
pronouns; L4 embedded response context. **Distractors/constraints.** English
do-support, keep subject first, move entire verb complex to front.
**Feedback.** Highlight finite verb and bracket.
**Examples.** `Kommst du?` (L1); `Kannst du kommen?` (L2);
`Hast du das gesehen?` (L2). **Validation.** V1 question parse.

### Family `wh_question_role`

**Task/purpose.** Select an interrogative phrase from the unknown role/case and
form the V2 wh-question. **Response/template.** Interrogative choice, case form,
ordered question, or answer match. **Derivation.** Semantic gap and government
select `wer/wen/wem/wessen`, `was`, `welch-`, or prepositional interrogative;
finite verb follows the wh constituent.
**Difficulty.** L1 `wer/was/wo`; L2 `wen/wem/wann/warum`; L3 prepositional and
`welch-`; L4 `wo(r)-` versus preposition+person.
**Distractors/constraints.** Choose case from answer order, add English
auxiliary, use `wo` for every prepositional object. **Feedback.** Unknown
role→case→question form. **Examples.** `Wer kommt?` (L1);
`Wem hilfst du?` (L2); `Worauf wartest du?` (L3).
**Validation.** Question frame.

### Family `sentence_bracket_completion`

**Task/purpose.** Place separable prefix, participle, infinitive, or predicate
component in the right bracket of a main clause. **Response/template.** Field
placement or missing component. **Derivation.** Verb construction maps finite
head to left bracket and nonfinite/separable component to right bracket.
**Difficulty.** L1 separable present; L2 modal/perfect; L3 passive/future;
L4 multiple middle-field constituents. **Distractors/constraints.** Keep parts
adjacent, put prefix after arbitrary final extra-clausal material.
**Feedback.** Connect bracket halves visually.
**Examples.** `Er ruft ... an` (L1); `Sie hat ... gelesen` (L2);
`Das wird ... repariert` (L3). **Validation.** Construction/field template.

### Family `object_case_order`

**Task/purpose.** Preserve accusative/dative roles while selecting a licensed
neutral or context-marked object order. **Response/template.** Case labeling,
ordered constituents, or context-order match. **Derivation.** Verb frame assigns
case; pronoun/full-NP, animacy, definiteness, weight, and information status rank
licensed orders. **Difficulty.** L1 one object; L2 two full NPs; L3 one pronoun;
L4 marked given/new context. **Distractors/constraints.** Order creates case,
dative always first, accept grammatical but context-inappropriate order as
identical. **Feedback.** Role/case arrows plus ordering factors.
**Examples.** `Ich gebe dem Kind das Buch` (L2);
`Ich gebe es dem Kind` (L3); context-fronted object (L4).
**Validation.** Case invariant+order set.

### Family `middle_field_pronoun_order`

**Task/purpose.** Order subject/object pronouns and full noun phrases in common
middle-field configurations. **Response/template.** Token ordering or natural-
order selection. **Derivation.** Pronoun status, case, subject position,
reference, and information structure determine accepted orders.
**Difficulty.** L2 one pronoun; L3 two pronouns or pronoun+NP; L4 subject
pronoun after non-subject `Vorfeld` and discourse effects.
**Distractors/constraints.** One dative-before-accusative rule for both NP/
pronoun patterns, English fixed SVO. **Feedback.** Label pronoun/full-NP and
case. **Examples.** `Ich gebe es ihm` (L2);
`Heute gibt er es dem Kind` (L3); controlled alternate (L4).
**Validation.** Ordering grammar.

### Family `adverbial_order_scope`

**Task/purpose.** Arrange time, cause, manner, place, frequency, and viewpoint
adverbials in a neutral or specified information structure.
**Response/template.** Ordered constituents, context match, or scope
interpretation. **Derivation.** Semantic class, scope, given/new, weight, and
focus yield accepted set; TeKaMoLo supplies only a default ranking.
**Difficulty.** L1 one adverbial; L2 time+place; L3 three classes; L4 fronting/
focus alternative. **Distractors/constraints.** Declare all deviations
ungrammatical, sort individual words rather than phrases.
**Feedback.** Adverbial classes and why target is neutral/marked.
**Examples.** `Ich fahre morgen nach Berlin` (L1);
time–manner–place neutral set (L2); contrastive place first (L4).
**Validation.** Semantic/order constraints.

### Family `nicht_kein_negation`

**Task/purpose.** Choose `nicht` versus `kein` and place negation for intended
constituent or predicate scope. **Response/template.** Negator choice, position,
or paired meaning. **Derivation.** Target scope, noun phrase determination,
contrast, and sentence bracket determine realization.
**Difficulty.** L1 `kein` with indefinite noun/`nicht` predicate; L2 adjective/
adverb/verb complement; L3 contrastive scope; L4 multi-part predicate.
**Distractors/constraints.** `nicht ein` for neutral `kein`, sentence-final
`nicht` universally, negate wrong constituent. **Feedback.** Scope brackets and
noun-phrase eligibility. **Examples.** `Ich habe kein Auto` (L1);
`Ich komme heute nicht` (L2); `nicht heute, sondern morgen` (L3).
**Validation.** Negation-scope model.

### Family `coordinator_word_order`

**Task/purpose.** Join main clauses or constituents with coordinating
connectors while preserving clause order. **Response/template.** Connector/
ordering choice or clause combination. **Derivation.** Discourse relation
selects `und/aber/oder/denn/sondern`; each coordinated main clause retains its
field template. **Difficulty.** L1 noun/phrase coordination; L2 two V2 clauses;
L3 `sondern` after negation; L4 ellipsis/shared constituents.
**Distractors/constraints.** Force verb-final after coordinator, use `sondern`
without corrected contrast. **Feedback.** Relation and two clause brackets.
**Examples.** `Ich komme, aber er bleibt` (L2);
`nicht X, sondern Y` (L2); coordinated modal clauses (L3).
**Validation.** Relation+parses.

### Family `subordinator_verb_final`

**Task/purpose.** Build introduced subordinate clauses with the finite/verb
complex in the reviewed right-bracket order. **Response/template.** Ordered
clause, connector choice, or main↔subordinate transformation.
**Derivation.** Subordinator and verb construction determine clause field
template. **Difficulty.** L1 simple `weil/dass`; L2 modal/perfect; L3 separable/
reflexive; L4 selected multi-verb cluster excluding advanced exceptions.
**Distractors/constraints.** Main-clause V2 after subordinator, prefix separated
as main clause, arbitrary reversal of verb cluster. **Feedback.** Subordinator,
middle field, right bracket. **Examples.** `weil ich müde bin` (L1);
`dass er kommen kann` (L2); `weil sie angerufen hat` (L3).
**Validation.** Clause/cluster template.

### Family `dependent_clause_fronting`

**Task/purpose.** Place a complete subordinate clause in the main-clause
`Vorfeld` and maintain V2 in the matrix clause. **Response/template.** Clause
ordering or error correction. **Derivation.** Dependent clause forms one
constituent; matrix finite verb follows it immediately.
**Difficulty.** L2 short conditional/causal clause; L3 multiword dependent;
L4 punctuation and pronoun reference. **Distractors/constraints.** Add matrix
subject before finite verb, count words, omit comma.
**Feedback.** Box whole clause as one `Vorfeld`.
**Examples.** `Wenn es regnet, bleibe ich zu Hause` (L2);
`Weil ich krank bin, komme ich nicht` (L2); perfect subordinate (L3).
**Validation.** Matrix V2+comma.

### Family `relative_pronoun_case`

**Task/purpose.** Select a relative pronoun from antecedent gender/number and its
case role inside the relative clause. **Response/template.** Pronoun form,
antecedent-gap link, or clause completion. **Derivation.** Antecedent supplies
gender/number; relative predicate/preposition supplies case.
**Difficulty.** L2 nominative/accusative; L3 dative/prepositional; L4 genitive
relative or competing antecedents. **Distractors/constraints.** Copy antecedent's
matrix case, choose nearest article form, English who/which.
**Feedback.** Two arrows: antecedent features and internal role/case.
**Examples.** `der Mann, der kommt` (L2); `der Mann, den ich sehe` (L2);
`die Frau, mit der ich spreche` (L3). **Validation.** Relative dependency.

### Family `relative_clause_order`

**Task/purpose.** Assemble and punctuate a relative clause with verb-final order
and correct attachment. **Response/template.** Ordered clause, sentence merge,
or antecedent match. **Derivation.** Relative dependency, internal roles, and
verb complex yield form/order/commas. **Difficulty.** L2 simple finite; L3
modal/perfect/separable; L4 embedded relative and reference.
**Distractors/constraints.** V2 after pronoun, omit surrounding commas, attach to
wrong plausible noun. **Feedback.** Antecedent link and relative-clause fields.
**Examples.** simple subject relative (L2); object relative (L3);
perfect relative clause (L4). **Validation.** Parse/attachment.

### Family `es_construction`

**Task/purpose.** Distinguish referential, weather/time, impersonal, anticipatory,
and placeholder/correlative `es` in reviewed constructions.
**Response/template.** Referent/construction label, include/omit choice, or
sentence completion. **Derivation.** Semantic role, clause position, and
construction determine whether `es` is referential, required, optional, or
absent. **Difficulty.** L1 weather/time; L2 referential pronoun; L3 anticipatory
clause/passive; L4 positional omission contrasts.
**Distractors/constraints.** Translate English “it” universally, assign a
referent to every `es`, omit required weather form.
**Feedback.** Construction and reference status.
**Examples.** `Es regnet` (L1); `Ich sehe das Buch. Es ist neu` (L2);
`Es ist wichtig, dass...` (L3). **Validation.** Construction registry.

### Family `pronominal_adverb`

**Task/purpose.** Form/interpret `da(r)+preposition` and
`wo(r)+preposition` for non-person referents/questions, contrasted with
preposition+personal pronoun. **Response/template.** Form choice, referent match,
or question-answer pair. **Derivation.** Preposition, interrogative/anaphoric
function, referent animacy/personhood, and phonological `r` environment yield
form. **Difficulty.** L2 common `dafür/worauf`; L3 `r` insertion and governed
frames; L4 clause reference. **Distractors/constraints.** Use for people,
`wo+preposition` spaced calque, omit `r` before vowel-initial preposition.
**Feedback.** Expand preposition and referent type.
**Examples.** `Worauf wartest du? Darauf.` (L2);
`Mit wem?` for person (L2); `Ich freue mich darüber, dass...` (L4).
**Validation.** Valency/reference.

### Family `comparative_clause`

**Task/purpose.** Build/interpret adjective/adverb comparatives, superlatives,
equality/inequality, and `als/wie` clauses. **Response/template.** Form,
connector, agreement, or comparison meaning. **Derivation.** Lexeme degree
paradigm, comparison type, syntactic use, and case ellipsis determine form.
**Difficulty.** L1 `-er als`; L2 `so...wie` and irregulars; L3 attributive
declined comparative/superlative; L4 case-sensitive ellipsis.
**Distractors/constraints.** `wie` for standard inequality target, double
comparative, omit adjective ending. **Feedback.** Degree stem, connector, and
case relation. **Examples.** `größer als` (L1); `so schnell wie` (L2);
`der beste Weg` (L3). **Validation.** Degree/declension.

### Family `syntax_order_audit`

**Task/purpose.** Diagnose one V2/V1/V-final, bracket, object/adverbial,
negation, relative, `es`, or pronominal-adverb error.
**Response/template.** Root cause, correction, and scope/discourse effect.
**Derivation.** Mutate one field/dependency in a valid clause.
**Difficulty.** L1 V2/question; L2 bracket/subordinate; L3 object/negation/
relative; L4 discourse/profile-sensitive order.
**Distractors/constraints.** One root; grammatical alternative accepted only
when it matches requested information structure. **Feedback.** Correct field/
dependency graph. **Examples.** `Heute ich gehe...` (L1); V2 after `weil`
(L2); relative pronoun copies matrix case (L3). **Validation.** Fault manifest.

### Cross-family progression

Field segmentation and subject-first V2 precede non-subject fronting and V1
questions. Simple brackets precede modal/perfect/passive brackets. Case roles
precede object ordering; one adverbial precedes neutral/marked combinations.
`nicht/kein` begins before scope contrasts. Coordination precedes subordinate and
relative clauses. Relative-pronoun case is mastered before full relative order.

## 6. Category: Connected German, discourse, register, and variation

### Category purpose

Connect clauses and select language that fits relation, stance, relationship,
medium, and standard-variety profile. This layer turns isolated correct
sentences into coherent, socially appropriate German.

### Learn-card content

- Coordinators, subordinators, and connector adverbs can express similar
  relations but impose different clause structures.
- `weil`, `denn`, and `deshalb` all relate to reason/result in different
  directions and syntactic templates.
- Temporal clauses depend on event order, overlap, and completed-versus-ongoing
  viewpoint.
- Same-subject purpose often uses `um...zu`; different explicit subjects often
  require `damit`.
- Conditions and concessions combine possible-world meaning with clause order.
- `du`, plural `ihr`, and polite `Sie` require coherent pronoun, possessive,
  imperative, and verb agreement.
- Politeness is constructed through address, mood, modal verb, particles,
  wording, greeting, and medium—not capitalization alone.
- Modal particles are introduced mainly for comprehension in authored dialogue;
  open-ended production is too context-sensitive for early automatic checking.

### Common misconceptions

- Similar meaning means identical word order.
- `weil`, `denn`, and `deshalb` can occupy the same slot.
- After any initial connector, subject must come before verb.
- Event order always matches clause order.
- `um...zu` works with two unrelated subjects.
- `wenn` means only “when” and `als` only “than.”
- `Sie` takes second-person verb forms or lowercase spelling.
- Formal rewriting is just replacing `du` with `Sie`.
- Modal particles have one stable dictionary translation.

### Family `connector_relation_structure`

**Task/purpose.** Choose a coordinator, subordinator, or connector adverb that
expresses a relation and build its clause structure. **Response/template.**
Connector/category/order choice or clause join. **Derivation.** Addition,
contrast, cause, result, concession, alternative, and reformulation license a
finite connector+template set. **Difficulty.** L1 `und/aber`; L2 `weil/denn/
deshalb`; L3 `obwohl/trotzdem/außerdem`; L4 register alternatives.
**Distractors/constraints.** Right relation/wrong syntax or opposite direction;
no arbitrary synonym. **Feedback.** Relation arrow and clause template.
**Examples.** `..., weil ich krank bin` (L2);
`..., denn ich bin krank` (L2); `Ich bin krank. Deshalb bleibe ich...` (L3).
**Validation.** Relation+parse.

### Family `temporal_sequence`

**Task/purpose.** Express/recover ordering, overlap, repetition, and anteriority
with `als`, `wenn`, `während`, `bevor`, `nachdem`, `seit(dem)`, and reviewed
forms. **Response/template.** Timeline, connector/tense choice, or clause
assembly. **Derivation.** Event intervals, one-time/repeated status, and reference
time select connector/tense. **Difficulty.** L1 before/after; L2 present
repetition versus one-time past; L3 pluperfect sequence/overlap; L4 context-
dependent alternatives. **Distractors/constraints.** `als` only comparative,
`wenn` for every “when,” chronology from clause order alone.
**Feedback.** Timeline and event-frequency labels.
**Examples.** `Wenn ich Zeit habe...` repeated (L2);
`Als ich klein war...` one past period (L2);
`Nachdem ich gegessen hatte...` (L3). **Validation.** Event graph.

### Family `cause_reason_result`

**Task/purpose.** Distinguish cause/reason from consequence and realize it with
appropriate `weil/denn/da/deshalb/deswegen` structures.
**Response/template.** Relation direction, connector/order, or paired
interpretation. **Derivation.** Fact graph designates cause and result; register/
information structure select accepted construction.
**Difficulty.** L1 cause versus result; L2 subordinator/coordinator/adverb; L3
fronted causal clause; L4 `da`/register/context.
**Distractors/constraints.** Reverse arrow, preserve `weil` order after
`deshalb`, treat spoken V2 variants as default written target.
**Feedback.** Cause→result diagram and fields.
**Examples.** `Ich bleibe, weil...` (L1); `..., denn...` (L2);
`Deshalb bleibe ich...` (L2). **Validation.** Fact direction+template.

### Family `purpose_subject_control`

**Task/purpose.** Select/build `um...zu`, `damit`, or a reviewed lexical purpose
phrase from goal and subject identity. **Response/template.** Construction,
subject-link match, or ordered clause. **Derivation.** Goal relation and
controller identity determine infinitive versus finite subordinate clause.
**Difficulty.** L2 same subject; L3 different subject; L4 negated/separable
infinitive and fronting. **Distractors/constraints.** `um...zu` with unlicensed
subject, omit `zu`, V2 after `damit`. **Feedback.** Actor/control and goal arrow.
**Examples.** `Ich lerne, um die Prüfung zu bestehen` (L2);
`Ich spreche langsam, damit du mich verstehst` (L3);
`um früh aufzustehen` (L3). **Validation.** Control graph.

### Family `condition_concession`

**Task/purpose.** Build/interpret real or hypothetical conditions and factual/
counterexpectational concessions. **Response/template.** Connector/mood/order
choice or possible-world match. **Derivation.** Factuality, likelihood,
counterfactuality, and expected-result relation select `wenn/falls`, Konjunktiv
II, `obwohl/trotzdem`, and clause template.
**Difficulty.** L2 real condition; L3 concession/hypothesis; L4 counterfactual
and reordered clauses. **Distractors/constraints.** Future tense required in
condition, conditional verb in every clause, confuse concession with cause.
**Feedback.** Possible-world/expectation graph.
**Examples.** `Wenn es regnet, bleibe ich...` (L2);
`Obwohl es regnet, gehe ich...` (L3);
`Wenn ich Zeit hätte, würde ich...` (L4). **Validation.** World/relation model.

### Family `address_register_bundle`

**Task/purpose.** Select a coherent `du/ihr/Sie` address, agreement, possessive,
imperative, and greeting bundle for a declared relationship.
**Response/template.** Form matching, scenario choice, or consistency check.
**Derivation.** Addressee number, relationship, institution, medium, and profile
select bundle. **Difficulty.** L1 `du/Sie`; L2 singular/plural ambiguity in
`Sie`; L3 `ihr`, possessives, commands; L4 relationship/profile changes.
**Distractors/constraints.** Semantic second person→grammatical second always,
lowercase polite forms, cultural absolutes. **Feedback.** Complete bundle and
scenario. **Examples.** `Wie heißt du?` (L1);
`Wie heißen Sie?` (L1); `Kommt ihr?` (L2). **Validation.** Register profile.

### Family `polite_request_strategy`

**Task/purpose.** Match/build bounded requests using imperative, modal question,
Konjunktiv II, mitigation, and greeting appropriate to context.
**Response/template.** Strategy choice, ordered utterance, or register ranking
within an authored scenario. **Derivation.** Imposition, relationship, medium,
and desired directness license forms. **Difficulty.** L1 `bitte`; L2 modal
question; L3 Konjunktiv II; L4 short repair/refusal.
**Distractors/constraints.** Formal=longest, imperative always rude, grammar-
correct but relationship-incompatible form. **Feedback.** Speech act and
mitigation features. **Examples.** `Bitte warten Sie` (L1);
`Kannst du mir helfen?` (L2); `Könnten Sie...?` (L3).
**Validation.** Authored pragmatic set.

### Family `formal_informal_rewrite`

**Task/purpose.** Rewrite a bounded message for a new relationship/medium while
preserving facts and intent. **Response/template.** Token transformation,
constrained text, or authored choice. **Derivation.** Separate content from
address, agreement, greeting, request strategy, closing, and profile.
**Difficulty.** L2 pronoun/verb; L3 request/opening/closing; L4 short
multi-sentence message. **Distractors/constraints.** Pronoun-only swap, mixed
bundle, content change, gratuitous verbosity. **Feedback.** Content and register
feature alignment. **Examples.** `Kannst du...?→Können Sie...?` (L2);
appointment request (L3); brief email (L4). **Validation.** Accepted set.

### Family `modal_particle_comprehension`

**Task/purpose.** Interpret the broad conversational contribution of reviewed
`doch, mal, ja, denn, wohl` uses in strongly constrained dialogue.
**Response/template.** Context/paraphrase match or with/without-particle
contrast. **Derivation.** Authored common ground, speech act, prosody/audio, and
particle use license interpretation. **Difficulty.** L3 one high-frequency
particle; L4 two candidate contexts or cluster limited to reviewed chunk.
**Distractors/constraints.** One dictionary translation, open production,
decontextualized sentence, infer speaker personality. **Feedback.** Compare
speech act with/without particle; label nuance approximate.
**Examples.** softened `Komm doch mal...` (L3);
question `Wie heißt du denn?` in friendly context (L3);
epistemic `wohl` (L4). **Validation.** Human-authored dialogue/audio only.

### Family `controlled_sentence_construction`

**Task/purpose.** Realize a semantic frame under explicit case, clause, tense,
register, and profile constraints. **Response/template.** Ordered constituents
or constrained text. **Derivation.** Roles→case/valency→nominal forms→verb
construction→field order; enumerate licensed variants.
**Difficulty.** L1 one V2 clause; L2 case/preposition/bracket; L3 subordinate/
relative; L4 two clauses with discourse/register.
**Distractors/constraints.** Not unrestricted translation; each distractor
breaks one logged dependency. **Feedback.** Full derivation chain.
**Examples.** location clause (L1); dative+accusative transfer (L2);
polite purpose request (L4). **Validation.** Back-parse to source frame.

### Family `grammar_pragmatics_audit`

**Task/purpose.** Diagnose one connector, timeline, purpose/control, condition,
register, politeness, particle, or cohesion fault.
**Response/template.** Root cause, correction, and meaning/register effect.
**Derivation.** Inject one logged mutation into valid discourse.
**Difficulty.** L2 local connector/order; L3 cross-clause/register; L4 plausible
but pragmatically/profile-incompatible choice.
**Distractors/constraints.** One root fault; all licensed repairs accepted.
**Feedback.** Correct relation/discourse graph.
**Examples.** `deshalb` followed by subordinate order (L2);
`um...zu` subjects mismatch (L3); mixed `du/Sie` message (L3).
**Validation.** Fault removal restores invariants.

### Cross-family progression

Connector category/order precedes semantic near-equivalents. Basic timelines
precede tense sequencing; same-subject purpose precedes control contrast.
Real conditions precede hypotheses/concessions. One address bundle precedes
polite-strategy choice and full-message rewrite. Modal particles remain
receptive and authored; controlled construction/audits combine known systems.

## 7. Category: Reading, listening, and interaction

### Category purpose

Integrate German systems in short, purposeful comprehension and communication.
Every text/recording is fully annotated so the checker can point to evidence
instead of grading open-ended interpretations.

### Learn-card content

- Use morphology, case, fields, connectors, reference, genre, and context
  together; do not translate word by word.
- German compounds can often be unpacked from the right-hand head and known
  modifiers, but only context confirms the intended sense.
- Notices, schedules, menus, messages, and instructions use conventional layout,
  ellipsis, abbreviations, and register.
- Listening progresses from known sound/form contrasts to chunks, turns, and
  short dialogues across reviewed standard profiles.
- Dictation feedback separates lexical, umlaut, `ß/ss`, capitalization,
  compound-boundary, and punctuation errors.
- Speaking provides model audio, recording, replay, and self-assessment; a
  waveform is not a pronunciation grade.
- Bounded mediation transfers specified facts between controlled
  representations; it is not free translation.

### Common misconceptions

- Every unfamiliar compound must be known as one memorized word.
- First noun phrase is always the actor.
- Nearest noun is always a pronoun/relative antecedent.
- Every verb-final sequence marks the same relation.
- Fast audio is automatically more authentic or advanced.
- One German-speaking region supplies the only standard pronunciation.
- Capitalization is optional in dictation.
- A plausible inference is necessarily supported by the source.

### Family `sentence_segmentation_parse`

**Task/purpose.** Segment fields/phrases and recover roles, case, verb complex,
and clause boundaries. **Response/template.** Grouping, labels, or dependency
matching. **Derivation.** Generated sentence retains semantic frame, parse, and
field projection. **Difficulty.** L1 simple V2; L2 bracket/case; L3 subordinate/
relative; L4 embedded structure. **Distractors/constraints.** Split
constituents, identify case only by position, attach modifier wrongly.
**Feedback.** Layered fields and dependency arrows.
**Examples.** simple transitive (L1); perfect with dative phrase (L2);
relative/subordinate (L3). **Validation.** Surface back-parse.

### Family `compound_in_context`

**Task/purpose.** Infer a reviewed compound's head/category and contextual
meaning from its components and sentence. **Response/template.** Bracketing,
head selection, picture/paraphrase match, or component ordering.
**Derivation.** Compound registry supplies structure/sense; context selects sense.
**Difficulty.** L1 transparent two-noun; L2 linking element; L3 ambiguous
modifier resolved by context; L4 profile lexical variant.
**Distractors/constraints.** Translate components in reverse, invent meaning
composition cannot support, use unreviewed novelty. **Feedback.** Right-hand
head and contextual contribution. **Examples.** `Haustür` (L1);
`Bahnhofsuhr` (L2); authored ambiguous-looking compound (L3).
**Validation.** Registry/context entailment.

### Family `short_reading_comprehension`

**Task/purpose.** Retrieve facts, order events, and make one supported inference
from a microtext. **Response/template.** Choice, slot, ordering, or
entailed/not-entailed. **Derivation.** Fact/event graph yields text/question and
evidence spans. **Difficulty.** L1 explicit sentence; L2 paragraph/reference;
L3 inference across clauses; L4 case/negation/connector distractor.
**Distractors/constraints.** No outside knowledge; one best answer unless stated.
**Feedback.** Highlight evidence/inference.
**Examples.** destination (L1); order errands (L2); infer changed plan (L3).
**Validation.** Entailment labels.

### Family `notice_message`

**Task/purpose.** Interpret notices, labels, menus, ads, forms, chats, and
service/personal messages. **Response/template.** Intended action/audience, fact
extraction, or matching. **Derivation.** Genre template controls layout,
ellipsis, abbreviation, profile, dates, and prices.
**Difficulty.** L1 sign; L2 opening-hours/message; L3 email/menu/ad; L4 two
documents. **Distractors/constraints.** Fictional data; no live legal/emergency
claim. **Feedback.** Expand ellipsis and show fields.
**Examples.** `Montags geschlossen` (L1); changed appointment (L2);
invitation+reply (L3). **Validation.** Layout/fact table.

### Family `instruction_timetable`

**Task/purpose.** Follow instructions or derive a fact from a timetable,
itinerary, recipe, or schedule. **Response/template.** Order actions, choose
time/route, or structured fact. **Derivation.** Event model generates document
and answer. **Difficulty.** L1 imperative/one step; L2 sequence/time; L3
constraint/connection; L4 exception note.
**Distractors/constraints.** Arithmetic secondary; fictional data/profile format
declared. **Feedback.** Trace rows/steps.
**Examples.** next action (L1); departure time (L2); valid connection (L3).
**Validation.** Independent event solver.

### Family `dialogue_completion`

**Task/purpose.** Choose/build a grammatical, coherent, socially appropriate
next turn. **Response/template.** Turn choice, token order, or constrained
utterance. **Derivation.** Dialogue state stores speakers, goal, facts, address,
profile, commitments, and open question. **Difficulty.** L1 greeting/answer; L2
request/offer; L3 repair/refusal; L4 multi-turn reference/particle.
**Distractors/constraints.** Grammatical nonresponse, wrong register/profile,
contradiction. **Feedback.** Speech act and answered turn.
**Examples.** respond to `Wie geht's?` (L1); accept invitation (L2);
clarify mismatch (L3). **Validation.** Dialogue constraints.

### Family `reference_resolution`

**Task/purpose.** Resolve personal/demonstrative pronouns, possessives,
pronominal adverbs, relative forms, and controlled ellipsis.
**Response/template.** Referent selection, link drawing, or expansion.
**Derivation.** Discourse graph tracks gender/number/case compatibility,
salience, roles, and information status. **Difficulty.** L2 unique pronoun; L3
competing nouns/`da-` form; L4 cross-turn topic shift.
**Distractors/constraints.** Nearest noun heuristic, case=form of antecedent,
natural gender alone. **Feedback.** Morphological and discourse cues.
**Examples.** resolve `sie` from context (L2); `darauf` referent (L3);
relative antecedent (L3). **Validation.** Unique recoverability.

### Family `listening_sound_form`

**Task/purpose.** Identify a taught vowel length, umlaut, stress, consonant,
word form, or standard-profile contrast. **Response/template.** Audio-to-word,
same/different, stress position, or feature label.
**Derivation.** Assets indexed by phonological feature, lexeme, speaker/profile.
**Difficulty.** L1 syllable/vowel; L2 length/umlaut/`ch`; L3 morphology/
devoicing; L4 multi-speaker profile. **Distractors/constraints.** No accent
ranking/noisy audio; visual text hide/reveal.
**Feedback.** Replay normal/slow and mark feature.
**Examples.** long/short pair (L1); `ich/Buch` `ch` (L2);
profiled standard pronunciation (L3). **Validation.** Manual audio review.

### Family `listening_dictation`

**Task/purpose.** Transcribe a word, phrase, sentence, or tiny dialogue with
German orthography. **Response/template.** Text with optional token scaffold.
**Derivation.** Asset has transcript, profile, word alignment, and accepted
punctuation variants. **Difficulty.** L1 familiar word; L2 umlaut/capital noun;
L3 `ß/ss`, compound, devoicing; L4 two turns/clause comma.
**Distractors/constraints.** Do not normalize target distinctions away.
**Feedback.** Classify lexical, umlaut, profile, capital, boundary, punctuation
errors. **Examples.** noun capitalization (L1); `Tür` (L2);
profiled `Straße/Strasse` sentence (L3). **Validation.** Transcript suite.

### Family `listening_comprehension`

**Task/purpose.** Understand gist, facts, intention, or one supported inference
in short audio. **Response/template.** Choice, order, or structured fact.
**Derivation.** Transcript/dialogue/fact graph stores timed evidence.
**Difficulty.** L1 one turn; L2 two-turn facts; L3 reference/profile; L4
attitude only with reviewed cues. **Distractors/constraints.** No stereotypes or
outside trivia; transcript after answer. **Feedback.** Replay evidence and show
transcript. **Examples.** requested item (L1); appointment time (L2);
changed plan (L3). **Validation.** Manual/evidence review.

### Family `guided_speaking_shadowing`

**Task/purpose.** Rehearse intelligible production through repetition,
shadowing, substitution, and local recording. **Response/template.** Recording
plus self-check; optional model match. **Derivation.** Frame provides audio,
chunks, target feature/profile, and substitutions. **Difficulty.** L1 word/
chunk; L2 sentence; L3 transformed sentence; L4 role response.
**Distractors/constraints.** No upload/automatic accent score; recording
optional; non-recording path. **Feedback.** Model replay and feature checklist.
**Examples.** vowel-length chunk (L1); substitute case/verb person (L2);
polite request (L3). **Validation.** Reviewed models/local recorder.

### Family `bounded_mediation`

**Task/purpose.** Transfer selected information between table, notice, message,
schedule, and constrained German output. **Response/template.** Semantic slots,
faithful paraphrase, or phrase bank. **Derivation.** Source/output share fact
graph; audience/register/profile constrain realization.
**Difficulty.** L2 one fact; L3 several facts/register; L4 select relevant facts
with negation/quantity. **Distractors/constraints.** Not free translation; judge
facts not style similarity. **Feedback.** Source→fact→output.
**Examples.** changed time (L2); two menu constraints (L3);
formal schedule message (L4). **Validation.** Slot equivalence.

### Family `profile_comprehension`

**Task/purpose.** Understand familiar content in another reviewed standard
German profile without requiring production imitation.
**Response/template.** Meaning match, feature label, or shared-core paraphrase.
**Derivation.** One semantic frame is realized under matched profile variants.
**Difficulty.** L2 orthographic `ß/ss`; L3 vocabulary/pronunciation; L4 reviewed
grammatical variant in clear context. **Distractors/constraints.** Do not infer
nationality from voice, caricature, or label dialect nonstandard.
**Feedback.** Shared meaning and exact scoped difference.
**Examples.** `Straße/Strasse` (L2); reviewed regional standard lexeme pair
(L3); reviewed case/auxiliary preference (L4). **Validation.** Same-frame
profile realization.

### Family `connected_language_audit`

**Task/purpose.** Diagnose one comprehension, reference, transcript, dialogue,
profile, or fact-transfer failure in a multimodal item.
**Response/template.** Root cause, correction, and source evidence.
**Derivation.** Inject one logged fault into valid annotated content.
**Difficulty.** L2 local cue; L3 cross-sentence/modality; L4 plausible
unsupported/profile-mismatched inference.
**Distractors/constraints.** One root; all evidence supplied.
**Feedback.** Highlight decisive span and graph link.
**Examples.** wrong pronoun referent (L2); lowercase noun in dictation (L2);
summary reverses cancellation (L3). **Validation.** Mutation restoration.

### Cross-family progression

Sentence parsing/compounds precede longer reading and reference. Practical
documents precede multi-document reasoning. Listening moves from contrasts to
dictation and meaning; speaking reuses understood forms. Cross-profile work
begins with familiar content. Mediation/audits follow component skills.

## 8. Cross-category progression and release slices

Levels describe exercise complexity, not certification:

- **Foundation / L1:** letters/umlauts, core sound–spelling patterns, noun
  capitalization, gender/plural as lexical units, nominative/accusative, definite
  articles, present forms, subject-first V2, familiar words, and one-turn
  reading/listening.
- **Elementary / L2:** vowel length, dative, `ein`-words/pronouns, fixed-case
  prepositions, adjective endings with strong scaffolds, modals/separable verbs,
  participles/perfect, questions/negation, simple subordinate clauses, practical
  messages, and two-turn interaction.
- **Independent-building / L3:** two-way/lexical prepositions, weak nouns/
  dative plural/genitive, full adjective patterns, sense-specific auxiliary and
  past/register choice, relative/infinitive clauses, passive, flexible object/
  adverbial order, purpose/condition/register, connected reading/listening, and
  mediation.
- **Early-intermediate extension / L4:** interacting case/order/reference,
  discourse-sensitive negation/fronting, process/state passive, probability and
  hypotheses, bounded reported speech/modal particles, cross-profile
  comprehension, and multimodal audits.
- **L5 challenge:** denser mixing and reduced scaffolding inside the reviewed
  grammar; no silent expansion into C1/C2, literary syntax, or free composition.

Recommended delivery:

1. **Release A — forms and simple main clauses:** Category 2 core; gender/plural;
   nominative/accusative; definite/`ein` articles; present; basic V2/questions;
   parsing and audio contrasts.
2. **Release B — cases and sentence brackets:** dative/prepositions/adjectives;
   modals/separable/reflexive verbs; participles/perfect; negation; notices,
   timetables, and dictation.
3. **Release C — connected clauses:** two-way/lexical government, remaining
   nominal morphology, past choice, relatives/subordination/infinitives,
   connectors/register, dialogue/reference/listening.
4. **Release D — early-B1 integration:** passive, Konjunktiv II, hypotheses,
   discourse order, controlled reported speech/particles, cross-profile
   comprehension, mediation, and audits.

Unlock by family and dependency, not one global score. Reading/listening/
production and each standard-variety profile have separate evidence. Audio and
recording families remain optional where inaccessible.

## 9. Adaptive practice guidance

Track at least:

- family and can-do objective;
- lemma/sense, frequency/domain, collocation, and known status;
- grapheme/sound, vowel length, stress, capitalization, compound, speaker, and
  spelling/pronunciation profile;
- noun gender/plural/class, case source, determiner class, adjective pattern,
  noun ending, preposition/valency, and agreement span;
- verb class/principal parts, person/number, prefix, reflexive case, participle,
  auxiliary, tense/register, mood, voice, and construction;
- clause type, field occupancy, bracket type, object/pronoun/adverbial order,
  negation scope, connector, and information structure;
- referent distance, relationship/address, speech act, profile, genre, modality,
  scaffold, response mode, latency, confidence, and misconception.

Routing examples:

- Correct article paradigm but wrong case → return to semantic role/government
  with visible nouns, not another ending table.
- Correct case but wrong adjective ending → keep role/lexemes fixed and contrast
  determiner classes.
- `mit den Kinder` → target dative-plural noun marking without mixing new case.
- Accusative chosen because a person moves → contrast endpoint placement with
  motion inside a location using the same verb/preposition.
- Correct verb form in wrong field → retain the verb and simplify clause
  constituents before adding morphology.
- `Heute ich gehe` → contrast one multiword `Vorfeld` constituent with finite V2.
- `weil`+V2 → contrast coordinator/subordinator/adverb templates with same facts.
- Wrong perfect auxiliary only for one sense → practice sense/frame pair, not
  “motion verb” lists.
- `ge-` added to `-ieren`/inseparable verb → hold stem constant and contrast
  prefix class.
- Every past sentence forced into one tense → introduce genre/lexeme/profile
  contrasts.
- Every `nicht` sentence-final → use visible scope alternatives before longer
  clauses.
- Profile-valid `ss/ß` response → clarify active profile rather than record a
  universal spelling misconception.

Track recognized, scaffold-produced, and meaning-produced mastery separately.
Use spaced retrieval for lexical gender/plural/principal parts, and dependency-
aware interleaving for grammar/order. Vary one dimension after two recent
successes. A confident misconception triggers a minimal contrast, worked
explanation, then delayed transfer. Slow correct responses should not provoke
rare vocabulary or arbitrary speed pressure.

## 10. Feedback and explanation requirements

Feedback normally reveals:

1. **Intention/profile:** meaning, time, relationship, medium, and declared
   standard variety.
2. **Semantic/syntactic frame:** predicate, roles, referents, event intervals,
   clause relations, and information status.
3. **Case/feature assignment:** source of case, gender, number, determination,
   person, tense, mood, voice.
4. **Morphological realization:** article/adjective/noun ending, verb stem/
   ending, prefix, participle, auxiliary.
5. **Field realization:** `Vorfeld`, brackets, middle-field order, negation,
   subordinate/relative placement.
6. **Mismatch/alternatives:** first decisive error and why another form is
   equivalent, marked, or profile-different.

Useful visuals:

- vowel nucleus/length cue and profile spelling;
- singular article+noun+plural card;
- predicate→role→case arrows;
- feature-distribution view across determiner–adjective–noun;
- spatial endpoint/location diagram for two-way prepositions;
- principal-parts/paradigm cell highlighting;
- left/right sentence bracket and full field table;
- event/register timeline for past forms;
- process versus state diagram for passive;
- negation-scope brackets;
- antecedent-feature and relative-internal-case arrows;
- connector relation and clause template;
- dialogue/register/profile state card;
- synchronized transcript evidence.

Interface-language glosses may support early meaning but cannot be the complete
grammar explanation. If context fails to select case, order, profile, or
interpretation uniquely enough for the declared answer set, invalidate the item.

## 11. Audio and content requirements

- Bundle audio locally; no runtime TTS, dictionary, speech recognition, or
  pronunciation service.
- Prefer licensed human recordings from multiple reviewed standard speakers and
  regions; label profiles neutrally.
- Record normal and pedagogically slower versions separately when useful; do not
  rely on distortion from playback-rate reduction.
- Normalize loudness/silence while preserving vowel length, stress, final
  devoicing, and phrase boundaries.
- Store transcript, alignment, speaker/voice, broad profile, rate, feature tags,
  license/provenance, and review status.
- Minimal contrasts use matched recording conditions. Never create “dialect
  error” audio.
- Provide keyboard-operable replay, visible state, transcript after answer, and
  a non-audio route where hearing is not the skill.
- Microphone exercises are optional/local-only; no upload, retention by default,
  accent classification, or automated score.
- Purpose-written microtexts/dialogues are preferred; external content requires
  compatible licensing/attribution.
- Contexts span German-speaking regions without converting language practice
  into culture trivia or national stereotypes.

## 12. Rendering, interaction, and accessibility

- UTF-8 throughout; render/input `ä ö ü Ä Ö Ü ß ẞ` correctly.
- Offer optional character buttons and a declared transliteration fallback for
  accessibility, while recording that fallback separately from spelling
  mastery.
- Respect the active `ß/ss` profile and noun capitalization.
- Paradigms and field models use semantic tables with headers; case colors are
  supplemental only.
- Case arrows, spatial diagrams, brackets, timelines, compound trees, and
  discourse graphs have equivalent text.
- Drag/order activities have keyboard and button alternatives with generous
  targets.
- Audio controls expose labels/state/replay/transcript; no autoplay.
- Color, waveform, hearing, speed, or fine pointer movement is never the sole cue
  unless explicitly targeted with an appropriate alternate path.
- Long compounds and clauses wrap without page-wide scrolling; field tables can
  stack into labeled rows on mobile.
- Screen readers announce corrected German before verbose explanation and do not
  read internal feature IDs.
- Respect reduced motion; no disappearing timed prompts as difficulty.
- Standard-variety profiles use text labels, not flags alone.

## 13. Generator and offline implementation guidance

A useful educational module boundary:

```text
seededRng
reviewedLexiconRegistry
varietyProfileRegistry
orthographyPronunciationRegistry
compoundMorphologyRegistry
semanticFrameGenerator
argumentCaseAssigner
featureBundleEngine
nounPhraseDeclensor
adjectiveEndingResolver
prepositionValencyRegistry
spatialRelationModel
verbParadigmRealizer
participleAuxiliaryEngine
tenseRegisterModel
voiceMoodConstructionEngine
topologicalFieldLinearizer
middleFieldOrderingModel
negationScopeEngine
referenceDiscourseGraph
clauseRelationEngine
numberDateTimeGrammar
dialogueStateEngine
textEntailmentAnnotations
audioAssetRegistry
faultInjector
unicodeGermanNormalizer
semanticAnswerChecker
accessibleRenderer
```

Archive per instance:

- stable family/schema, seed, and data/generator/profile versions;
- can-do, difficulty, scaffold, and modality;
- semantic frame, roles, case sources, entities, facts, events, discourse state,
  information status, and speech act;
- lexeme/sense IDs and full nominal/verbal features;
- principal parts, construction, verb cluster, field structure, order options,
  and negation scope;
- active profile plus canonical/accepted/profile-different outputs;
- tokenization, parse, dependencies, referents, evidence, normalization policy;
- distractor misconception/rejection reason;
- audio asset/transcript and fault mutation where applicable.

Generation order:

1. choose family/profile/pedagogical dimension;
2. create semantic/orthographic/phonological/discourse source;
3. select reviewed compatible lexemes/construction;
4. assign argument roles, case, reference, time/mood/voice, and information
   structure;
5. realize noun phrases and verb complex;
6. linearize into topological fields, then spell/punctuate;
7. back-parse and verify source identity;
8. derive answer/explanation independently;
9. create misconception-based distractors;
10. reject collisions, ambiguity, awkward compounds/order, profile mismatch,
    and lexical overload.

The standalone app downloads no runtime lexicon, conjugator, corpus, TTS, or
answer service. Ship only a licensed reviewed/versioned learner subset. For
choices/order compare IDs; for text, parse the promised constrained grammar and
compare features/realizations after item-specific Unicode/space/punctuation
normalization. Edit distance cannot establish correctness.

## 14. Automated and linguistic validation

### Data-build checks

- Every lexeme has stable ID, sense, part of speech, frequency/level, register/
  profile scope, provenance, and review status.
- Every noun has gender, plural(s), declension class, genitive/dative-plural
  behavior, pronunciation/stress, and compound metadata.
- Every verb has all shipped paradigm cells, principal parts, prefix class,
  perfect auxiliary by sense/construction, valency, reflexive frame, and profile.
- Determiners/adjectives/pronouns have complete shipped paradigms.
- Prepositions/valency, tense/register, voice/mood, field/order, negation,
  connector, and register constructions are typed and reviewed.
- Every variant declares meaning, profile, register, scope, and explanation.
- Audio has transcript/profile/license and completed human review.

### Instance invariants

- Surface reparses to source semantics/features.
- Orthography, capitalization, compound boundaries, punctuation, and `ß/ss`
  match profile/rule version.
- Case follows stored role/government; all nominal components realize compatible
  gender/number/case/determiner features.
- Weak-noun, dative-plural, and genitive morphology is licensed.
- Finite verb agrees; prefix/participle/auxiliary/tense/mood/voice matches
  lexeme sense and construction.
- Field structure satisfies V2/V1/V-final template and reviewed verb-cluster
  order.
- Object/adverbial/negation order belongs to the accepted discourse set.
- Relative pronoun agrees with antecedent in gender/number and takes internal
  case.
- Address/register/profile is coherent.
- Reading/listening key is entailed by stored evidence; distractors are false or
  unsupported for logged reasons.
- Accepted normalized answer never collides with distractor.
- Audit differs from valid instance by exactly one root mutation.

### Test volume and independent oracles

- At least 10,000 deterministic seeds per family per supported level.
- At least 25,000 per level for vowel length/`ß`, noun/adjective declension,
  two-way prepositions, valency, participle/auxiliary, past register, passive/
  `werden`, V2/V-final/brackets, middle-field order, negation, relatives,
  reference, and audits.
- Exhaustively enumerate shipped determiner/adjective/pronoun/verb paradigm
  cells, noun exception forms, contractions, prefix classes, and profile
  spellings.
- Exhaustively test Unicode composed/decomposed umlauts, `ß/ẞ`, capitalization,
  spaces, hyphens, punctuation, and optional fallback policy.
- Recompute numeric/date/time answers independently.
- Use independent back-parser/validator logic rather than only generator code.
- Snapshot long compounds, clauses, tables, diagrams, profile labels, and all
  audio states at phone/desktop widths.
- Manually review all audio and stratified samples of every template, lexeme,
  construction, profile, distractor, and fault. Automation cannot certify
  idiomaticity or pragmatic naturalness.

Discard/log failures with seed/family/version; never fall back to unreviewed
content.

## 15. Coverage and balance requirements

Report by family/level:

- generation/rejection counts and distinct semantic frames;
- lemma/sense/domain/frequency/new status;
- grapheme, vowel length, stress, capitalization, compound, punctuation,
  speaker, and profile;
- gender/plural/noun class, case source, determiner/adjective pattern, noun
  marking, preposition/valency, and agreement distance;
- verb class/principal parts/person/prefix/participle/auxiliary/tense/register/
  mood/voice/construction;
- clause/field/bracket type, fronted constituent, object/pronoun/adverbial order,
  negation scope, relative dependency, connector/relation;
- referent distance, speech act, register/address, text genre, evidence distance,
  modality, and profile familiarity;
- response mode, scaffold, misconception, confidence, and repetition.

Cap easy defaults: masculine nouns, `-e` plurals, nominative, definite article,
regular verbs, present, subject-first V2, one adverbial, vocabulary from only one
region, one narrator, and literal one-clause translation. Balance frequency,
communicative value, contrasts, profiles, and learner needs rather than mirroring
a raw corpus.

## 16. Content and implementation checklist

- [ ] Adult general German target, approximately A1–early B1, no certification
      claim.
- [ ] Common standard core and every variety profile are explicit/versioned.
- [ ] Swiss `ss`, Austrian/Swiss/German standard vocabulary/grammar, and
      pronunciation variants are scoped rather than ranked.
- [ ] Current official orthography/profile rules are versioned.
- [ ] All lexemes/forms/constructions come from reviewed licensed data.
- [ ] Nouns store gender, plural, class, genitive/dative behavior, and stress.
- [ ] Case derives from role/government before surface endings.
- [ ] Adjective endings derive from full features and determiner class.
- [ ] Two-way prepositions use spatial construal, not movement shorthand.
- [ ] Verbs store principal parts, prefix, auxiliary by sense, and valency.
- [ ] Tense choice includes lexeme, genre, register, and profile.
- [ ] `werden`/passive/state constructions remain distinct.
- [ ] V2 means second constituent; clauses use a validated field model.
- [ ] Middle-field/negation order accepts every licensed contextual variant.
- [ ] Relative pronoun case is assigned inside its clause.
- [ ] Register/address bundle remains coherent.
- [ ] Modal particles are bounded/authored, primarily receptive.
- [ ] No free translation, essay, conversation, or vague similarity grading.
- [ ] Audio is local, licensed, multi-speaker/profile, human-reviewed.
- [ ] Recordings remain local and receive no bogus pronunciation/accent score.
- [ ] Reading/listening retain evidence/entailment annotations.
- [ ] Distractors have named misconceptions; audits one root fault.
- [ ] Seeds reproduce prompt/profile/answer/variants/audio/explanation.
- [ ] Accessibility covers characters, fields, diagrams, ordering, and audio.
- [ ] Standalone HTML/JS/CSS; no backend/runtime network dependency.

## 17. Stable IDs and recommended navigation

Use:

```text
german-language/<category-id>/<family-id>/<schema-version>
```

Persist seed, generator/data/profile versions, lexeme/sense IDs, semantic frame,
case sources, feature bundles, field structure, accepted-answer policy, audio
ID, and fault ID. Increment schema/data version when keyed output could change.

Recommended learner navigation:

1. **Sounds & Spelling**
2. **Words, Cases & Noun Phrases**
3. **Verbs & Time**
4. **Sentence Structure**
5. **Connected German**
6. **Reading, Listening & Interaction**

Filters may expose level, family, modality, input mode, primary/receptive
profile, register, vocabulary domain, and error review. Internal labels such as
“argument-case assigner” or “topological-field linearizer” remain developer-only.
