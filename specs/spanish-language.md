# Spanish Language — Dynamic Practice Specification

Status: implementation specification

Audience: exercise generator, linguistic-content editor, Spanish morphology and
syntax engine, semantic answer checker, text/audio renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual normative meanings.

## 1. Topic overview

### Topic name

Spanish Language

### Topic goal

Develop beginner-to-lower-intermediate communicative Spanish by repeatedly
connecting sound, spelling, vocabulary, morphology, syntax, reading, listening,
controlled writing, and guided speaking. The learner should become able to:

- decode and type contemporary Spanish orthography, including `ñ`, `ü`, written
  accents, and opening question/exclamation marks;
- apply reliable sound–spelling patterns while recognizing declared
  `seseo/distinción`, `yeísmo`, and other reviewed pronunciation profiles;
- predict and mark word stress, syllabify reviewed words, and distinguish
  diphthongs, triphthongs, and hiatus where this affects stress or spelling;
- select noun gender and number, then control article, adjective, determiner,
  possessive, and participial agreement;
- use common lexical combinations, preposition government, apocopated forms,
  quantities, dates, times, prices, and everyday measurements;
- conjugate frequent regular and irregular verbs across practical persons,
  tenses, moods, imperatives, and nonfinite forms;
- choose among `ser`, `estar`, `hay`, and reviewed possession/location/result
  constructions from meaning rather than English gloss;
- distinguish completed events, backgrounds/habits, current relevance, prior
  past, plans, predictions, hypotheses, commands, and selected subjunctive
  meanings;
- choose and place subject, tonic, direct-object, indirect-object, reflexive,
  reciprocal, and constructional `se` forms;
- control personal `a`, object doubling where licensed, `gustar`-type
  experiencer constructions, relative clauses, negation, questions, and word
  order;
- distinguish `por/para`, comparison, connectors, clause relationships,
  register, and address systems;
- understand short reviewed texts and recordings, exchange routine information,
  and rehearse useful utterances;
- recognize that Spanish has several educated norms and avoid treating a
  regional form as universally required or universally wrong.

The endpoint is usable Spanish and reliable form–meaning choices. Terminology is
a tool for explanation, not the primary learner task.

### Audience and level boundary

The app begins before pronunciation/spelling mastery and extends through
practical A1, A2, and selected early-B1 objectives. These labels describe
exercise scope; the app does not certify CEFR, DELE, SIELE, school, immigration,
or professional proficiency.

- **Foundation:** decoding, spelling, fixed expressions, core vocabulary,
  articles, agreement, and present-tense recognition.
- **A1-oriented:** familiar descriptions, routines, basic needs, simple
  questions, numbers/time/prices, directions, and one-turn interaction.
- **A2-oriented:** past narration, object pronouns, comparisons, instructions,
  practical messages, and common subordinate relations.
- **Early-B1-oriented:** aspect contrasts, clitic combinations, hypotheses,
  selected subjunctive environments, discourse-sensitive order, and short
  inference.

The [Plan Curricular del Instituto
Cervantes](https://cvc.cervantes.es/ensenanza/biblioteca_ELE/plan_curricular/default.htm)
informs the balance among grammar, pronunciation, orthography, functions,
pragmatics, text genres, culture, and learning. It is a curricular reference,
not an answer key or a certification claim.

### Reference and language-data boundary

Authoritative descriptive/reference anchors include:

- the RAE–ASALE [Diccionario panhispánico de
  dudas](https://www.rae.es/dpd/), which explicitly addresses phonographic,
  morphological, syntactic, and lexical variation across the Spanish-speaking
  world;
- the Instituto Cervantes discussion of [norm and varieties of
  Spanish](https://cvc.cervantes.es/Ensenanza/biblioteca_ele/plan_curricular/norma.htm),
  which recognizes multiple educated norms and warns that its own preferred
  curricular base is only one of them;
- RAE–ASALE references for particular variable systems, including
  [voseo](https://www.rae.es/dpd/vos) and
  [leísmo](https://www.rae.es/dpd/le%C3%ADsmo);
- the Council of Europe [CEFR Companion
  Volume](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions)
  for reception, production, interaction, mediation, and phonological
  competence.

Reference pages are not corpora to copy. Any bundled dictionary, corpus sample,
frequency list, recording, or conjugation dataset must have a compatible
license, provenance, version, and human review. A corpus form is evidence of
use, not sufficient evidence that it fits the item's region, register, meaning,
or learner level.

### Variety and usage policy

Spanish cannot be represented by one binary “Spain/Latin America” setting. Each
content set declares a **variety profile** whose independent dimensions include:

```text
VarietyProfile {
  id
  geographicScope
  productionBaseline
  seseoDistincion
  yeismoProfile
  secondPersonSingularSystem
  secondPersonPluralSystem
  objectPronounNorm
  perfectPastPreference
  lexicalPreferences
  phoneticTargets
  registerConventions
  acceptedAlternatives[]
}
```

- The shared core uses forms widespread across educated varieties.
- A production exercise involving variable features must display or have
  previously established its profile.
- `tú`, `usted`, and `vos`; `vosotros` and `ustedes`; and their verb/clitic/
  possessive consequences are modeled explicitly.
- `seseo`, `distinción`, and reviewed `yeísmo` profiles are valid systems, not
  proficiency rankings.
- Past-perfect/simple-past choice, leísmo patterns, subject-pronoun frequency,
  and vocabulary are not inferred from continent alone.
- A learner may choose a primary production profile and still practice
  comprehension of other reviewed profiles.
- Region, register, relationship, medium, and discourse context are stored when
  they affect form or interpretation.
- The app never asks “Which Spanish is correct?” when several norms license
  different answers.

Every realization is classified as:

1. **canonical target** — selected teaching form in the active profile/context;
2. **accepted variant** — grammatical and meaning/register-compatible here;
3. **profile-different** — natural elsewhere but outside this production prompt;
4. **contextually different** — grammatical but changes reference, aspect,
   politeness, focus, or implication;
5. **non-target/nonstandard** — outside the declared production norm;
6. **incorrect** — incompatible spelling, morphology, syntax, or semantics.

Feedback must say which classification applies. “Not the requested profile” is
not synonymous with “bad Spanish.”

### Scope

Included:

- contemporary general Spanish pronunciation/spelling correspondences;
- high-frequency vocabulary in adult everyday contexts;
- noun phrases, determiners, agreement, quantification, and common
  prepositions;
- regular verbs and a reviewed high-frequency irregular inventory;
- present, principal past forms, future/plans, conditional, imperatives,
  progressive/perfect constructions, and bounded subjunctive environments;
- subject expression, personal `a`, object clitics, `se`, relatives, questions,
  negation, comparison, and selected information structure;
- practical reading/listening, constrained writing, dialogue, mediation, and
  guided recording;
- numbers sufficient for dates, times, prices, addresses, telephone numbers,
  quantities, and ordinary large values;
- explicit exposure to major educated variation without requiring dialect
  imitation.

Expected prior knowledge:

- no Spanish required at Foundation;
- ability to read a Latin-script interface;
- grammar labels are introduced before being required;
- later families may require the dependencies named in their progression notes.

### Exclusions

- unrestricted translation, essays, free conversation, and semantic grading by
  generic similarity;
- automated accent classification or pronunciation scoring;
- pretending browser speech recognition is a reliable proficiency evaluator;
- comprehensive dialectology, dialect imitation, or prescriptive ranking of
  national varieties;
- historical Spanish, paleography, literary-only verb forms, and systematic
  future subjunctive;
- exhaustive idioms, slang, profanity, specialist jargon, or country trivia;
- complete derivational morphology, generative syntax, or linguistic theory;
- open-ended interpretation of literature, humor, irony, and culturally dense
  implicature;
- standalone vocabulary memorization without context, collocation, morphology,
  listening, or retrieval variation;
- real emergency, medical, legal, immigration, or financial instructions;
- current transport/business data unless embedded as clearly fictional content.

### Orthography, sound, and terminology conventions

- Internal text is Unicode NFC.
- `ñ` is a distinct letter. `ch` and `ll` are digraphs, not separate modern
  alphabet letters; exercises may still train their sound/spelling behavior.
- `á é í ó ú ü ñ ¿ ¡` and uppercase equivalents must render and input
  correctly.
- Written accents are semantically significant when required; normalization
  must not erase them.
- Opening `¿` and `¡` are required in assessed complete standard sentences.
  Fragment prompts state their punctuation policy.
- Case, terminal punctuation, and repeated whitespace may normalize only when
  they are not the target.
- Diphthong/hiatus and written-accent decisions follow an explicit orthographic
  syllable/stress engine, not naïve vowel counting.
- Pronunciation answers use audio or ordinary spelling whenever possible.
  Optional phonemic notation must define its inventory and selected profile;
  IPA knowledge is never assumed.
- Pedagogical labels may show both common names where terminology varies, for
  example “preterite / pretérito perfecto simple (indefinido)” and “imperfect /
  pretérito imperfecto.”

### Lexical and grammatical data model

```text
Lexeme {
  id
  lemma
  partOfSpeech
  senses[]
  inflectionClass
  paradigmForms[]
  stemAlternations[]
  gender?
  numberBehavior?
  countability?
  argumentFrames[]
  prepositionFrames[]
  pronominalFrames[]
  cliticFrames[]
  semanticTags[]
  selectionalTags[]
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
  syntacticTemplate
  requiredFeatures
  agreementLinks[]
  cliticSlots[]
  wordOrderOptions[]
  tenseAspectMoodProfile
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
  speechActs[]
  referentLinks[]
  commonGround[]
  varietyProfileId
}
```

Gender, plural, stress, pronunciation, stem alternation, preposition government,
argument structure, and regional scope are lexical data. Do not infer them from
the final letter or an English gloss when a reviewed entry is available.

### Verb, aspect, mood, and auxiliary policy

- Generate finite forms from reviewed paradigms/rules plus explicit irregular
  overrides; verify every shipped cell independently.
- Separate **form** drills from **meaning/selection** drills.
- Past-time items store event boundaries, repetition, background, result,
  reference interval, speaker viewpoint, and active variety profile.
- `pretérito perfecto compuesto` versus simple preterite is profile-sensitive.
  Avoid a universal “today = compound, yesterday = simple” shortcut.
- `ser`/`estar` is construction- and meaning-sensitive, not a permanent/
  temporary binary. Each adjective sense or complement pattern is reviewed.
- Subjunctive items are generated from semantic and discourse triggers such as
  desire, influence, evaluation, nonassertion, prospectivity, or hypothesis.
  Keyword lookup alone is prohibited.
- Imperatives store polarity, addressee system, clitic attachment, spelling/
  accent consequences, and irregular form.
- Periphrases (`ir a`, `estar + gerund`, `tener que`, `acabar de`, selected
  others) are typed constructions, not arbitrary adjacent verbs.

### Pronoun and `se` policy

Clitics are typed objects, not loose word strings:

```text
Clitic {
  role
  person
  number
  gender?
  reflexivity?
  referentId
  ethicalAffectedRole?
}

CliticHost {
  hostType       // finite, infinitive, gerund, affirmative imperative
  polarity
  varietyProfile
}
```

- Direct and indirect objects come from the verb's semantic frame.
- Dative `le/les` becomes `se` before third-person accusative clitics in the
  relevant cluster; the checker must preserve the underlying role and referent.
- Proclisis/enclisis options depend on host, construction, polarity, and
  addressee form.
- Reflexive, reciprocal, passive `se`, impersonal `se`, accidental/
  affected-participant constructions, lexical pronominal verbs, and dative-
  replacement `se` remain distinct.
- Personal `a` depends on animacy, specificity, definiteness, verb meaning, and
  construction; it does not by itself identify an indirect object.
- Object duplication is represented per construction and profile. The app does
  not delete a clitic merely because a full noun phrase is present.
- Accepted leísmo and profile-specific patterns are tagged. The default direct/
  indirect contrast remains clear, but a licensed regional form is never
  silently marked as universally wrong.

### Vocabulary and content policy

- Every exercise draws from a reviewed learner lexicon.
- New vocabulary is introduced with meaning, article/gender where relevant,
  pronunciation, one collocation, and one contextual example.
- Proper names and settings should span the Spanish-speaking world without
  implying that one name, cuisine, accent, or custom represents everyone.
- Inflectable distractors must be real forms or deliberate misconception
  transformations, not random pseudo-Spanish.
- False-friend and near-synonym work uses an authored context that determines
  meaning.
- Names, addresses, schedules, shops, notices, and prices are fictional.
- Cognates may reduce lexical load but must not dominate generation.

### Global answer conventions

- Trim surrounding whitespace and collapse repeated internal whitespace unless
  spacing is the target.
- Normalize Unicode to NFC and accept common composed/decomposed keyboard input.
- Preserve `ñ`, `ü`, and written accents. Never normalize them to unaccented
  letters for a correct production answer.
- Case and terminal punctuation are ignored only when the item says they are not
  assessed. Opening question/exclamation marks remain required in punctuation
  families and full-sentence writing where declared.
- Multiple choice, matching, ordering, and token assembly compare stable IDs,
  not labels.
- Short text accepts only the prompt's constrained grammar plus its enumerated
  or feature-equivalent realizations.
- A form from another reviewed variety may receive “valid elsewhere” feedback
  without counting as correct for a profile-targeted production item.
- Optional subject pronouns and licensed word orders are accepted when they
  preserve the requested discourse meaning; the prompt must constrain them when
  focus matters.
- English translations are not accepted as Spanish answers unless the family
  explicitly asks for meaning in the interface language.
- Accent-sensitive minimal pairs (`si/sí`, `el/él`, `tu/tú`, interrogatives,
  etc.) are never collapsed.
- For numbers, dates, and times, the item states whether digits, words, or both
  are accepted and which regional display convention applies.
- “Nearly correct” may identify one local mismatch but must not update mastery as
  correct.

### Response modes

- single or multiple choice;
- matching and categorization;
- ordered tokens with keyboard alternatives;
- short constrained text;
- inflection table cell(s);
- multiple named fields;
- timeline/event selection;
- sentence-to-picture or picture-to-sentence;
- audio discrimination and transcription;
- local recording with model comparison and self-assessment;
- fault diagnosis plus correction.

Free text is used only when the app can parse the promised grammar. Every prompt
states whether the skill is meaning recognition, form selection, spelling,
production, comprehension, or profile recognition.

### Difficulty philosophy

Difficulty increases through:

- less familiar vocabulary after the grammatical operation is secure;
- weaker cues and movement from recognition to production;
- more interacting agreement, reference, aspect, mood, or clitic dependencies;
- longer distance between dependent elements;
- a choice among genuinely competing meanings rather than arbitrary obscurity;
- connected discourse and cross-modal transfer;
- controlled exposure to another variety after the shared system is stable;
- reduced scaffolding and delayed retrieval.

Difficulty must not increase through tiny text, noisy audio, speed for its own
sake, trivia, rare exceptions, huge numbers, long typing, arbitrary ambiguity,
or unfamiliar vocabulary unrelated to the target. Each instance should usually
introduce one main challenge; cumulative audits may combine mastered features.

### General generation and rejection rules

Every instance must:

- be reproducible from seed plus content/generator version;
- start from a semantic, phonological, orthographic, or discourse model;
- use reviewed lexemes and constructions compatible with the active profile;
- have one determinate task or an explicit finite accepted set;
- derive the answer independently from visible wording;
- record why every distractor is wrong in this context;
- contain enough context to resolve tense, mood, reference, register, and
  variety-sensitive choices;
- reject accidental ambiguity, answer collisions, unnatural combinations,
  unintroduced vocabulary overload, and merely cosmetic variation;
- archive the complete feature structure and explanation data.

Fault-finding families generate a valid instance first and then inject exactly
one logged root error. They must not hand-author a broken sentence whose intended
repair is uncertain.

## 2. Category: Sound, spelling, stress, and punctuation

### Category purpose

Build a dependable path from sound to spelling and from spelling to a declared
pronunciation profile. The objective is automatic, meaningful decoding and
accurate production, not decontextualized terminology or accent policing.

### Learn-card content

- Spanish has five core vowel phonemes in the target introductory profiles, but
  adjacent vowels can form diphthongs, triphthongs, or hiatus.
- `c`, `z`, and `s` depend on the declared `seseo/distinción` profile; spelling
  cannot always be recovered from sound alone.
- `g/j`, `gu/gü`, `c/qu/k`, `r/rr`, silent `h`, `b/v`, and `y/ll` require
  environment-aware spelling.
- Word stress and written accent are related but not identical. First determine
  syllables and stress, then apply the spelling rule and exceptions.
- Interrogative/exclamative words can take a diacritic accent in direct and
  indirect questions/exclamations.
- Spanish uses opening and closing question/exclamation marks.
- A learner should hear multiple reviewed speakers; variation is labeled, not
  treated as noise.

### Common misconceptions

- Every letter always has one sound.
- `b` and `v` must be pronounced like a universal English contrast.
- `ll` and `y` are universally distinct.
- `c`, `s`, and `z` have one pronunciation throughout the Spanish-speaking
  world.
- Every adjacent vowel sequence forms separate syllables.
- Any stressed vowel needs a written accent.
- A written accent merely indicates emphasis.
- Silent `h` can be omitted in spelling.
- `r` and `rr` can be interchanged between vowels.
- Closing `?` or `!` is sufficient in a complete Spanish sentence.

### Family `alphabet_letter_name`

**Task/purpose.** Recognize and produce Spanish letter names and distinguish
letters from digraphs. **Response/template.** Audio/text matching, ordered
alphabet, or typed letter. **Derivation.** Look up the reviewed letter-name set
for the active profile; keep spelling identity separate from pronunciation.
**Difficulty.** L1 common letters; L2 `ñ`, vowel names, confusable names; L3
loanword letters and spelling aloud; L4 multi-letter code/address chunks.
**Distractors/constraints.** Do not count `ch/ll` as separate modern alphabet
letters; accept reviewed letter-name variants by profile. **Feedback.** Show
letter, name, and example word. **Examples.** identify `eñe` (L1); distinguish
`ge/jota` (L2); spell a fictional code aloud (L3). **Validation.** Inventory and
audio profile agree.

### Family `vowel_sequence_syllable_type`

**Task/purpose.** Classify and segment vowel sequences as diphthong, triphthong,
or hiatus for orthographic purposes. **Response/template.** Syllable division,
classification, or stress-bearing vowel. **Derivation.** Apply open/closed-vowel
and stress/accent rules to a reviewed word form. **Difficulty.** L1 clear
diphthong; L2 hiatus and accented closed vowel; L3 triphthong or `h` between
vowels; L4 inflected-form contrast. **Distractors/constraints.** Visual vowel
counting, treating `h` as always breaking/creating a syllable. **Feedback.**
Mark vowel types, stress, and syllable boundary. **Examples.** `tierra` (L1);
`país` (L2); `averigüéis` (L3). **Validation.** Orthographic syllabifier plus
lexical review.

### Family `c_qu_k_g_gu_dieresis`

**Task/purpose.** Select spelling for /k/ and `g`-series sounds across following
vowels, including silent/pronounced `u`. **Response/template.** Fill grapheme,
spell word, or sound-to-form choice. **Derivation.** Target phoneme, following
vowel, morpheme, and lexeme determine `c/qu/k`, `g/gu`, or `gü`.
**Difficulty.** L1 `ca/que/qui/co/cu`; L2 `ga/gue/gui/go/gu`; L3 `güe/güi`,
loan `k`, and inflectional spelling changes; L4 mixed dictation.
**Distractors/constraints.** Pronounce silent `u`, omit diaeresis, select by
sound without lexical identity where homophony exists. **Feedback.** Highlight
grapheme environment. **Examples.** `queso` (L1); `guitarra` (L2);
`pingüino` (L3). **Validation.** Lexeme spelling and pronunciation profile.

### Family `j_g_x_sound_spelling`

**Task/purpose.** Map reviewed `j/g` spellings and variable `x` values to and
from pronunciation. **Response/template.** Spelling choice, word recognition,
or profile-aware sound match. **Derivation.** Lexeme plus following vowel and
profile pronunciation select the mapping. **Difficulty.** L1 `ja/je/ji/jo/ju`;
L2 `ge/gi` versus `gue/gui`; L3 frequent `x` patterns and proper names; L4
sound-to-spelling under lexical context. **Distractors/constraints.** Never
claim sound alone determines homophonous `g/j`; restrict `x` to reviewed words.
**Feedback.** Separate predictable environment from lexical spelling.
**Examples.** `jardín` (L1); `gente` versus `guerra` (L2); reviewed `México`
profile (L3). **Validation.** Per-lexeme mapping.

### Family `r_rr_position`

**Task/purpose.** Choose and interpret `r/rr` from word position and intended
rhotic contrast. **Response/template.** Grapheme choice, spelling, or audio
match. **Derivation.** Syllable/word position and lexical form determine
single/double spelling. **Difficulty.** L1 initial versus intervocalic; L2 after
selected consonants; L3 morphologically related contrasts; L4 dictation in a
phrase. **Distractors/constraints.** Write initial `rr`, use one `r` for an
intervocalic trill, infer spelling from noncontrastive position alone.
**Feedback.** Show position and contrast. **Examples.** `pero/perro` (L1);
`rojo` (L1); `alrededor` (L2). **Validation.** Lexical spelling and positional
rule.

### Family `b_v_y_ll_profile`

**Task/purpose.** Recognize that sound may not uniquely determine `b/v` or
`y/ll`, then retrieve the correct spelling from lexical context.
**Response/template.** Meaning-supported spelling, same/different by profile, or
audio-to-word. **Derivation.** Lexeme identity determines spelling; active
pronunciation profile determines merger/contrast. **Difficulty.** L1 familiar
`b/v`; L2 familiar `y/ll`; L3 multi-speaker/profile recognition; L4 dictation
with meaning context. **Distractors/constraints.** Import English `b/v` rules,
label yeísmo incorrect, ask impossible bare-audio spelling without context.
**Feedback.** State lexical spelling and profile behavior. **Examples.**
`baca/vaca` with picture/context (L2); `haya/halla` with sentence (L2); classify
a reviewed yeísta recording (L3). **Validation.** Profile and sense disambiguate.

### Family `s_c_z_profile`

**Task/purpose.** Decode `s/c/z` and identify the consequence of
`seseo/distinción` without ranking either system. **Response/template.**
Profile-aware audio/text match or contextual spelling. **Derivation.** Grapheme,
following vowel, and profile yield pronunciation; meaning/lexeme yields spelling.
**Difficulty.** L1 predictable written pattern; L2 same/different sound by
profile; L3 contextual homophones; L4 multiple speakers.
**Distractors/constraints.** Treat `seseo` as a mistake, infer region from one
token, demand spelling from merged sound without context. **Feedback.** Display
both valid mappings. **Examples.** `cena` by two profiles (L1); `casa/caza`
where relevant (L2); contextual dictation (L3). **Validation.** Profile-tagged
audio and lexical answer.

### Family `silent_h_and_homophone`

**Task/purpose.** Retain lexical `h` and distinguish common `h`-based
homophones in context. **Response/template.** Spelling completion or
meaning-to-word choice. **Derivation.** Semantic frame selects the lexeme and
its fixed spelling. **Difficulty.** L1 common initial `h`; L2 inflected forms;
L3 homophones such as `a/ha` or `echo/hecho`; L4 dictation in connected text.
**Distractors/constraints.** Omit inaudible `h`, add `h` by analogy.
**Feedback.** Lemma, meaning, and related form/collocation. **Examples.**
`hotel` (L1); `ha comido` (L2); `hecho/echo` in context (L3).
**Validation.** Semantic frame uniquely selects spelling.

### Family `syllabification_stress`

**Task/purpose.** Divide reviewed words into syllables and identify lexical
stress. **Response/template.** Boundary placement, stressed-syllable selection,
or audio/text matching. **Derivation.** Apply reviewed onset, vowel-sequence,
and stress data. **Difficulty.** L1 simple consonant-vowel pattern; L2 clusters
and diphthongs; L3 hiatus and `h`; L4 inflected/derived contrast.
**Distractors/constraints.** Split digraphs incorrectly, confuse orthographic
accent with stress, rely on typography alone. **Feedback.** Syllable boxes and
stressed nucleus. **Examples.** `ca-sa` (L1); `ciu-dad` (L2);
`Ma-rí-a` (L3). **Validation.** Lexical syllabification plus rules.

### Family `written_accent_general`

**Task/purpose.** Decide whether and where a word takes a written accent from
stress, ending, and syllable structure. **Response/template.** Accent placement,
correct spelling, or rule category. **Derivation.** Determine orthographic
syllables and stress; apply aguda/llana/esdrújula rules and hiatus exceptions.
**Difficulty.** L1 clear aguda/llana; L2 esdrújula and plural/inflection; L3
hiatus/diphthong; L4 repair within a sentence. **Distractors/constraints.**
Accent every stressed vowel, count letters instead of syllables, ignore final
`n/s` rule. **Feedback.** Show stress and rule in that order. **Examples.**
`café` (L1); `árbol` (L1); `música` (L2). **Validation.** Independent accent
oracle and lexicon.

### Family `diacritic_interrogative_accent`

**Task/purpose.** Distinguish high-frequency diacritic pairs and accented
interrogative/exclamative forms from relatives/conjunctions.
**Response/template.** Contextual spelling, meaning match, or correction.
**Derivation.** Syntactic/semantic role selects `tú/tu`, `él/el`, `sí/si`,
`dé/de`, `sé/se`, `más/mas`, and `qué/quien/cómo/cuando/...`.
**Difficulty.** L1 common monosyllabic pair; L2 direct questions; L3 indirect
questions/exclamations; L4 embedded ambiguity. **Distractors/constraints.**
Accent by emphasis alone, remove accent in indirect question, teach deprecated
blanket accents on demonstratives. **Feedback.** Identify grammatical role and
tonicity. **Examples.** `tú/tu` (L1); `¿Cómo estás?` (L2);
`No sé cuándo llega` (L3). **Validation.** Parsed role determines form.

### Family `question_exclamation_punctuation`

**Task/purpose.** Place opening/closing question and exclamation marks and
punctuate mixed declarative/interrogative spans. **Response/template.** Mark
placement, sentence correction, or token assembly. **Derivation.** Speech-act
span annotations determine `¿...?` and `¡...!` boundaries.
**Difficulty.** L1 whole-sentence question; L2 introductory material outside the
span; L3 nested quotation or mixed exclamation/question; L4 short dialogue.
**Distractors/constraints.** Add only closing mark, capitalize mechanically
after an internal opening mark, mark the entire sentence when only a clause is
interrogative. **Feedback.** Highlight the exact speech-act span. **Examples.**
`¿Dónde vives?` (L1); `Y tú, ¿qué quieres?` (L2);
`¡Qué sorpresa!` (L1). **Validation.** Punctuation spans and parse agree.

### Family `spelling_from_audio`

**Task/purpose.** Transcribe a reviewed word or short phrase using sound,
meaning cue, stress, and lexical knowledge. **Response/template.** Constrained
text with replay. **Derivation.** Audio asset links to transcript, lexeme IDs,
profile, and targeted spelling features. **Difficulty.** L1 transparent word;
L2 accent or `h`; L3 merged sounds with picture/sentence context; L4 mixed short
phrase. **Distractors/constraints.** No impossible audio-only homophone choice;
balanced loudness/speed; no noisy recordings. **Feedback.** Replay and align
sound, syllable, stress, and spelling. **Examples.** `casa` (L1);
`también` (L2); contextual `vaya/valla` (L3). **Validation.** Human-reviewed
audio/transcript alignment.

### Family `sound_spelling_audit`

**Task/purpose.** Diagnose one sound–spelling, syllable, stress, accent, or
punctuation fault. **Response/template.** Root-cause label, correction, and
rule/profile explanation. **Derivation.** Generate a valid instance, then apply
one logged misconception mutation. **Difficulty.** L1 one grapheme; L2 stress/
accent; L3 profile-aware ambiguity; L4 sentence punctuation plus spelling.
**Distractors/constraints.** Exactly one root fault; do not mutate into another
valid lexical/profile form. **Feedback.** Correct form with decisive rule.
**Examples.** `rr` written word-initially (L1); missing hiatus accent (L2);
missing opening question mark after an introductory phrase (L3).
**Validation.** Fault removal restores every invariant.

### Cross-family progression

Letter names and five-vowel decoding precede vowel sequences, syllabification,
and stress. Predictable grapheme environments precede lexical homophones and
profile variation. General accent rules precede diacritics and sentence
punctuation. Audio spelling combines only contrasts already introduced; audit
items come last.

## 3. Category: Vocabulary, noun phrases, prepositions, and quantities

### Category purpose

Build fluent, context-sensitive noun phrases and practical lexical combinations.
Learners should retrieve a noun together with its gender/plural behavior and
assemble agreement and determination from features, not from a memorized English
phrase.

### Learn-card content

- Learn nouns with an article or explicit gender, especially endings that do not
  reliably predict gender.
- Plural formation depends on spelling, stress, and final sound; accent marks may
  change when number changes.
- Articles express definiteness, reference, quantity, and construction. Their
  presence cannot be copied mechanically from English.
- Adjectives agree in gender/number where their class distinguishes them.
- Adjective position may be neutral, contrastive, restrictive, evaluative, or
  lexicalized; not every adjective freely changes position.
- Possessive determiners usually precede a noun; tonic possessives and
  possessive pronouns have different placement/agreement.
- `algún/alguno`, `ningún/ninguno`, `buen/bueno`, `gran/grande`,
  `primer/primero`, and similar alternations need a syntactic host.
- Lexical prepositions and collocations are stored with the relevant sense.

### Common misconceptions

- Final `-o` always means masculine and `-a` always feminine.
- A natural person's sex always determines grammatical gender.
- Add `-s` to every plural without spelling/stress consequences.
- Spanish uses the definite article exactly where English uses “the.”
- An adjective agrees with the nearest noun regardless of its head.
- Possessives agree with the possessor rather than the possessed noun.
- Adjective position never changes nuance.
- Every English preposition has a stable Spanish equivalent.
- Large numbers, dates, decimals, and currency use one global display convention.

### Family `contextual_vocabulary`

**Task/purpose.** Retrieve a reviewed word from a picture, definition, semantic
features, or short context. **Response/template.** Choice, matching, or short
lemma/form. **Derivation.** Semantic frame plus selectional constraints yields a
finite compatible set and one target sense. **Difficulty.** L1 concrete
high-frequency noun/verb; L2 adjective and routine context; L3 near-synonym/
false-friend contrast; L4 register or variety-labeled choice.
**Distractors/constraints.** Same semantic field but wrong defining feature;
never rely on trivia or an untranslated obscure word. **Feedback.** Meaning,
article/gender or principal form, collocation, and profile label.
**Examples.** picture→`la llave` (L1); context→`quedar` sense (L2);
`actual` versus English-influenced false friend (L3). **Validation.** Authored
sense constraints uniquely select target.

### Family `collocation_phrase`

**Task/purpose.** Complete frequent lexical combinations and light-verb
expressions. **Response/template.** Word/preposition choice, matching, or token
assembly. **Derivation.** Retrieve a reviewed collocation by sense, register,
and profile. **Difficulty.** L1 fixed daily phrase; L2 verb+noun/preposition;
L3 competing collocations; L4 profile/register variation.
**Distractors/constraints.** Literal English calque, semantically related but
non-collocating word. **Feedback.** Show whole chunk and a contrasting context.
**Examples.** `tener hambre` (L1); `tomar una decisión` (L2);
`darse cuenta de` (L3). **Validation.** Collocation registry.

### Family `noun_gender`

**Task/purpose.** Retrieve grammatical gender for a noun sense and choose
compatible determiners. **Response/template.** Gender/article choice or noun
classification. **Derivation.** Use lexical gender, meaning, and profile—not
suffix guessing. **Difficulty.** L1 regular frequent endings; L2 common
exceptions and `-e`; L3 same form/different referent or meaning; L4 variable
gender only with explicit profile. **Distractors/constraints.** `-a` heuristic,
natural-sex substitution, false analogy. **Feedback.** Give article+noun,
plural, and useful pattern/exception. **Examples.** `la casa` (L1);
`el problema` (L2); `el/la artista` by referent (L3). **Validation.** Lexeme
sense/gender record.

### Family `noun_number`

**Task/purpose.** Form or interpret singular/plural nouns while preserving
spelling and stress. **Response/template.** Typed form, choice, or transformation.
**Derivation.** Inflection class plus final sound/spelling and accent rule yields
the plural. **Difficulty.** L1 vowel+`s`; L2 consonant+`es`; L3 `z→ces`,
accent shifts, invariant forms; L4 reviewed irregular/variable cases.
**Distractors/constraints.** Mechanical `-s`, retain/remove accent incorrectly,
invent a plural for invariant noun. **Feedback.** Stem, suffix, and accent
recalculation. **Examples.** `casa→casas` (L1); `papel→papeles` (L2);
`luz→luces` (L3). **Validation.** Paradigm lookup plus orthographic oracle.

### Family `definite_article_selection`

**Task/purpose.** Select `el/la/los/las` from noun features and reference,
including reviewed stressed-`a` feminine behavior. **Response/template.**
Article choice or completed noun phrase. **Derivation.** Gender, number,
phonological onset, modification, and definiteness select the form.
**Difficulty.** L1 ordinary agreement; L2 plural and modifiers; L3 stressed
initial `a/ha` feminine singular; L4 lexicalized/profile-sensitive article use.
**Distractors/constraints.** Treat `el agua` as masculine, extend special
singular article to plural or intervening adjective. **Feedback.** Separate noun
gender from article form. **Examples.** `la mesa` (L1); `los árboles` (L2);
`el agua fría / las aguas frías` (L3). **Validation.** Reference and onset
features.

### Family `indefinite_zero_article`

**Task/purpose.** Choose `un/una/unos/unas`, a zero article, or a quantified
construction in a controlled context. **Response/template.** Determiner choice
or meaning match. **Derivation.** Specificity, countability, number,
introduction/reference, predicate role, and construction select the pattern.
**Difficulty.** L1 introduce one count noun; L2 plural/mass zero; L3 profession,
quantity, and modifier contrasts; L4 discourse-dependent reference.
**Distractors/constraints.** Copy English article presence, use `un` with
unbounded plural/mass, omit article despite individuating modifier.
**Feedback.** Reference/quantity structure. **Examples.** `Necesito un lápiz`
(L1); `Bebo café` (L2); profession with versus without modifier (L3).
**Validation.** Determination template.

### Family `article_presence_generic`

**Task/purpose.** Decide article presence in generic, body-part, language,
weekday, institutional, and other reviewed constructions.
**Response/template.** Article/zero selection or sentence contrast.
**Derivation.** Construction, reference type, verb, and modifier determine the
licensed set. **Difficulty.** L2 one high-frequency construction; L3 generic
versus specific; L4 competing valid forms with meaning difference.
**Distractors/constraints.** English transfer, one rule for all languages or
weekdays. **Feedback.** Name construction and intended reference.
**Examples.** generic `Me gusta el café` (L2); language after selected verb
(L2); weekday schedule contrast (L3). **Validation.** Reviewed construction
registry.

### Family `adjective_agreement`

**Task/purpose.** Inflect an adjective to agree with its syntactic head(s).
**Response/template.** Typed ending/form, matching, or sentence assembly.
**Derivation.** Head gender/number and adjective class determine form; coordinated
heads use an explicit agreement rule. **Difficulty.** L1 `-o/-a`; L2 `-e` and
consonant classes; L3 coordinated/mixed heads; L4 invariant or meaning-specific
exceptions. **Distractors/constraints.** Agree with nearest noun, possessor, or
speaker; force gender on invariant adjective. **Feedback.** Agreement arc and
class. **Examples.** `libro rojo` (L1); `casas grandes` (L2);
coordinated plural adjective (L3). **Validation.** Dependency agreement.

### Family `adjective_position_meaning`

**Task/purpose.** Select or interpret adjective placement when order affects
focus, restriction, evaluation, or lexical meaning. **Response/template.**
Meaning-to-order choice or paired interpretation. **Derivation.** Reviewed
adjective sense plus discourse role licenses pre/postnominal positions.
**Difficulty.** L2 ordinary descriptive postposition; L3 reviewed contrast such
as `viejo amigo/amigo viejo`; L4 discourse/context choice.
**Distractors/constraints.** Claim all adjectives change meaning; accept an
order not licensed for that sense. **Feedback.** Paraphrase each order.
**Examples.** `una casa blanca` (L2); `un gran libro` (L3);
`un pobre hombre / un hombre pobre` (L3). **Validation.** Authored sense-order
mapping.

### Family `possessive_form`

**Task/purpose.** Choose short prenominal possessives, tonic postnominal forms,
or possessive pronouns with correct agreement/reference.
**Response/template.** Form choice, referent matching, or phrase construction.
**Derivation.** Possessor person/number and possessed noun gender/number plus
syntactic role select form. **Difficulty.** L1 `mi/tu/su`; L2 plural and
`nuestro`; L3 tonic/pronominal forms and ambiguous `su`; L4 disambiguating
phrases. **Distractors/constraints.** Agree with possessor, use `su` without
resolving intended referent where required. **Feedback.** Possessor arrow and
agreement head. **Examples.** `mis libros` (L1); `nuestra casa` (L2);
`un amigo mío` (L3). **Validation.** Reference and agreement.

### Family `demonstrative_reference`

**Task/purpose.** Select/interpret demonstratives from discourse/spatial
reference and agreement under a declared system. **Response/template.**
Form-to-referent matching or phrase completion. **Derivation.** Distance/
discourse zone, gender, number, and nominal/pronominal use select the form.
**Difficulty.** L1 `este/ese`; L2 all agreements and `aquel`; L3 discourse
reference and neutral `esto/eso/aquello`; L4 profile/context nuance.
**Distractors/constraints.** Add obsolete automatic written accents, make neuter
forms agree with nouns. **Feedback.** Reference zone and feature bundle.
**Examples.** nearby `este libro` (L1); distant `aquellas casas` (L2);
propositional `eso` (L3). **Validation.** Referent model.

### Family `quantifier_agreement_scope`

**Task/purpose.** Choose and interpret common quantifiers such as `mucho`,
`poco`, `todo`, `cada`, `alguno`, `ninguno`, `otro`, and numerals.
**Response/template.** Form/agreement choice, quantity match, or scope contrast.
**Derivation.** Countability, polarity, scope, gender, number, and syntactic
position select realization. **Difficulty.** L1 numeric/simple quantity; L2
agreement and count/mass; L3 negative/indefinite interaction; L4 scope in a
short clause. **Distractors/constraints.** Force plural after `cada`, treat
`ninguno` as positive, agree adverbial `muy`. **Feedback.** Quantity set and
agreement role. **Examples.** `muchas personas` (L1); `cada día` (L2);
`no tengo ningún libro` (L3). **Validation.** Quantifier template.

### Family `apocope_form`

**Task/purpose.** Choose full or apocopated forms in the licensed syntactic
environment. **Response/template.** Form selection or noun-phrase correction.
**Derivation.** Lexeme, gender/number, position before the noun, and construction
select `buen/bueno`, `gran/grande`, `primer/primero`, `algún/alguno`,
`ningún/ninguno`, `un/uno`, `cien/ciento`, and reviewed others.
**Difficulty.** L1 `un/uno`; L2 common masculine prenominal forms; L3
`gran/grande` meaning/position and `cien/ciento`; L4 coordinated/intervening
structure. **Distractors/constraints.** Apocopate postnominally or before the
wrong gender/class. **Feedback.** Host and boundary that trigger the form.
**Examples.** `un libro` (L1); `el primer día` (L2);
`una gran oportunidad` (L3). **Validation.** Apocope rule plus parse.

### Family `lexical_preposition`

**Task/purpose.** Supply or interpret a preposition licensed by a verb,
adjective, noun, or fixed expression. **Response/template.** Preposition choice,
matching, or collocation completion. **Derivation.** Lexeme sense and complement
type select a reviewed frame. **Difficulty.** L1 place/time core uses; L2
governed verb/adjective; L3 competing sense/frame; L4 clause complement.
**Distractors/constraints.** Literal English mapping, choose `por/para` without
that family's semantic analysis. **Feedback.** Show governing lexeme and whole
frame. **Examples.** `depender de` (L2); `pensar en` (L2);
`acordarse de` (L3). **Validation.** Lexical frame registry.

### Family `number_date_time_price`

**Task/purpose.** Read, hear, say, or write practical numbers, dates, times,
prices, addresses, and telephone-number groups. **Response/template.** Digits,
Spanish words, structured fields, audio matching, or calculation secondary to
language. **Derivation.** Numeric value plus task/profile formatting rules
produce canonical and accepted forms. **Difficulty.** L1 0–100/time; L2 dates,
prices, 100–999; L3 thousands/millions and phone groups; L4 mixed document.
**Distractors/constraints.** Avoid giant arithmetic; handle `uno/un/una`,
`ciento/cien`, agreement in hundreds, decimal/date conventions.
**Feedback.** Group value and grammatical form. **Examples.** `31 libros`→
`treinta y un libros` (L2); `200 casas`→`doscientas casas` (L2);
fictional price/date (L3). **Validation.** Independent numeric grammar.

### Family `noun_phrase_audit`

**Task/purpose.** Diagnose one lexical, gender, plural, article, agreement,
possessive, demonstrative, quantifier, apocope, or preposition fault.
**Response/template.** Root cause, correction, and agreement/reference effect.
**Derivation.** Mutate one feature or realization in a valid phrase/context.
**Difficulty.** L1 local agreement; L2 article/plural/apocope; L3 reference or
lexical frame; L4 cross-phrase discourse choice. **Distractors/constraints.**
One root fault; do not create another accepted profile variant.
**Feedback.** Correct feature graph and phrase. **Examples.** `la problema`
(L1); possessive agrees with possessor (L2); `alguno libro` (L3).
**Validation.** Fault manifest and restored invariants.

### Cross-family progression

Contextual vocabulary introduces nouns with gender and plural. Gender/number
precede articles and adjective agreement. Possessives/demonstratives/quantifiers
follow stable noun phrases; apocope follows their full forms. Lexical
prepositions and practical quantities are interleaved with familiar vocabulary.
Audits combine only introduced dependencies.

## 4. Category: Verb morphology, tense, aspect, mood, and periphrases

### Category purpose

Make verb forms and their meanings retrievable under communicative pressure.
Form generation, time/aspect choice, mood choice, and construction choice are
trained separately before they are combined.

### Learn-card content

- Spanish has `-ar`, `-er`, and `-ir` conjugations plus reviewed stem-changing,
  spelling-changing, and irregular paradigms.
- Person/number is usually recoverable from the finite verb, so an overt subject
  pronoun has discourse work rather than being mechanically required.
- `ser`, `estar`, and `hay` divide meanings by construction; “permanent versus
  temporary” is only a rough mnemonic and often predicts the wrong answer.
- The simple preterite presents a bounded whole; the imperfect presents an event
  internally, habitually, descriptively, or as background. Context and viewpoint
  matter.
- The compound perfect's distribution varies geographically and pragmatically;
  each selection item declares a profile.
- The subjunctive is not simply “uncertainty.” It appears in reviewed semantic
  and discourse environments.
- Affirmative and negative commands use different form/placement rules, and the
  addressee system matters.

### Common misconceptions

- Remove the infinitive ending and add any remembered suffix.
- Stem change occurs in every paradigm cell.
- A subject pronoun must precede every verb.
- `ser` means permanent and `estar` means temporary.
- Preterite means short and imperfect means long.
- `hoy` universally requires the compound perfect.
- Future morphology is the only way to talk about the future.
- Every clause after `que` takes subjunctive.
- Subjunctive is optional whenever the speaker feels uncertain.
- Negative commands are formed by adding `no` to the affirmative command.

### Family `conjugation_class_stem`

**Task/purpose.** Identify infinitive class, stem, ending, and reviewed
alternation/principal forms. **Response/template.** Segmentation, class choice,
or paradigm matching. **Derivation.** Lexeme's paradigm metadata yields stem and
ending for the requested cell. **Difficulty.** L1 regular class; L2 spelling/
stem-changing pattern; L3 irregular first-person or preterite stem; L4 compare
related cells. **Distractors/constraints.** Overextend one stem to all cells,
confuse spelling preservation with pronunciation change. **Feedback.** Color/
text-separated stem, alternation, and ending. **Examples.** `habl-ar` (L1);
`pensar→pienso` distribution (L2); `tener→tuv-` preterite stem (L3).
**Validation.** Reviewed paradigm.

### Family `present_indicative`

**Task/purpose.** Produce/recognize present-indicative forms for current,
habitual, general, and scheduled meanings. **Response/template.** Typed form,
table cell, subject-form match, or bounded sentence. **Derivation.** Lemma,
person/addressee profile, number, and irregular class determine form.
**Difficulty.** L1 regular singular; L2 all core persons; L3 stem/first-person
irregulars; L4 profile-specific `vos/vosotros/ustedes`.
**Distractors/constraints.** Infinitive left unchanged, wrong class, stem change
in `nosotros`, mixed `vos` ending. **Feedback.** Stem/ending and profile.
**Examples.** `yo hablo` (L1); `nosotros comemos` (L2);
profiled `vos tenés` (L3). **Validation.** Paradigm cell.

### Family `ser_estar_hay`

**Task/purpose.** Choose and interpret `ser`, `estar`, or existential `hay` from
a reviewed construction and intended meaning. **Response/template.** Form/
construction choice, picture match, or sentence completion. **Derivation.**
Predication type, information structure, location/existence, adjective sense,
result/state, event, and tense select the licensed set.
**Difficulty.** L1 identity/origin/location/existence; L2 descriptions/results;
L3 adjective meaning contrasts and event location; L4 discourse-dependent
availability/presentation. **Distractors/constraints.** Permanent/temporary
shortcut, `hay` with definite presented entity where construction rejects it,
`estar` for event location. **Feedback.** Name the construction and paraphrase
meaning. **Examples.** `Madrid está en España` (L1); `Hay un libro en la mesa`
(L1); `La reunión es en la oficina` (L3). **Validation.** Authored
predicate/construction frames.

### Family `tener_haber_obligation_possession`

**Task/purpose.** Distinguish lexical possession, impersonal existence,
auxiliary `haber`, and obligation expressions. **Response/template.** Verb/
construction selection or meaning match. **Derivation.** Semantic relation and
clause structure select `tener`, `haber`, `tener que`, `hay que`, or perfect
auxiliary. **Difficulty.** L1 possession; L2 personal/impersonal obligation; L3
perfect auxiliary versus lexical relation; L4 tense/register contrasts.
**Distractors/constraints.** English “have” mapped uniformly, pluralize
existential `hay` in the core target. **Feedback.** Role structure and finite
head. **Examples.** `Tengo dos hermanos` (L1); `Hay que salir` (L2);
`He comido` (L2). **Validation.** Construction registry.

### Family `reflexive_pronominal_verb`

**Task/purpose.** Conjugate and interpret reflexive, reciprocal, inherent
pronominal, and meaning-changing pronominal verbs in bounded contexts.
**Response/template.** Pronoun+verb form, meaning classification, or sentence
assembly. **Derivation.** Lexical/construction frame supplies pronoun role and
agreement. **Difficulty.** L1 daily reflexive; L2 placement with finite/
infinitive; L3 lexical meaning contrast; L4 reciprocal/affected readings.
**Distractors/constraints.** Add/remove `se` mechanically, treat every
pronominal as literal self-action. **Feedback.** Semantic roles plus stored
lemma form. **Examples.** `me levanto` (L1); `vamos a sentarnos/nos vamos a
sentar` (L2); `ir/irse` contrast (L3). **Validation.** Pronominal frame and host.

### Family `ir_a_future_plan`

**Task/purpose.** Build and interpret `ir a + infinitive` for plans, predictions,
and imminent events, contrasting present schedules where useful.
**Response/template.** Periphrasis assembly, tense choice, or timeline match.
**Derivation.** Subject controls finite `ir`; lexical verb remains infinitive;
context assigns planned/predictive meaning. **Difficulty.** L1 form; L2
plan versus present schedule; L3 negation/clitic placement; L4 profile-neutral
future contrast. **Distractors/constraints.** Conjugate both verbs, omit `a`,
force morphological future. **Feedback.** Bracket finite auxiliary-like element,
linker, infinitive, and timeline. **Examples.** `Voy a estudiar` (L1);
`Vamos a verlo/Lo vamos a ver` (L2); weather prediction (L3).
**Validation.** Periphrasis parse.

### Family `estar_gerund_progressive`

**Task/purpose.** Form and select the progressive when an event is viewed as in
progress, without overusing it for all present actions.
**Response/template.** Gerund form, construction choice, or scene match.
**Derivation.** Finite `estar`, subject agreement, gerund paradigm, event type,
and viewpoint yield realization. **Difficulty.** L1 regular gerund; L2 irregular
gerunds; L3 progressive versus simple present; L4 clitic placement/past
progressive. **Distractors/constraints.** English-progressive transfer,
`estar + infinitive`, wrong stem change. **Feedback.** Event interval and form.
**Examples.** `Está leyendo` (L1); `están durmiendo` (L2);
habitual present versus current progressive (L3). **Validation.** Paradigm and
event compatibility.

### Family `preterite_form`

**Task/purpose.** Produce/recognize simple-preterite forms for reviewed verbs and
addressee profiles. **Response/template.** Typed form, paradigm cell, matching,
or bounded completion. **Derivation.** Lexeme, person, number, and preterite
class determine stem, ending, spelling, and accent. **Difficulty.** L1 regular
singular; L2 full common paradigm; L3 strong/irregular stems and `-ir` changes;
L4 mixed profile/person retrieval. **Distractors/constraints.** Imperfect ending,
present stem change copied, misplaced accent, `-s` added to `tú` preterite.
**Feedback.** Stem/ending/spelling. **Examples.** `hablé` (L1);
`comieron` (L2); `tuve/dijeron` (L3). **Validation.** Paradigm table.

### Family `imperfect_form`

**Task/purpose.** Produce/recognize imperfect-indicative forms.
**Response/template.** Typed form, table cell, or subject match.
**Derivation.** Conjugation class/person selects regular ending; `ir`, `ser`,
and `ver` use reviewed irregular paradigms. **Difficulty.** L1 `-aba`; L2
`-ía` and accents; L3 three irregular verbs/mixed persons; L4 retrieval in
sentence. **Distractors/constraints.** Preterite ending, omit repeated accent,
invent stem changes. **Feedback.** Imperfect stem/ending and person.
**Examples.** `hablaba` (L1); `comíamos` (L2); `era/iba/veía` (L3).
**Validation.** Paradigm cell.

### Family `past_aspect_choice`

**Task/purpose.** Choose preterite or imperfect from event structure, viewpoint,
and narrative relation. **Response/template.** Tense/form choice, timeline
mapping, or paired interpretation. **Derivation.** Stored event boundaries,
habituality, overlap, background/foreground, interruption, and intended viewpoint
license tense. **Difficulty.** L1 completed versus habitual; L2 background plus
event; L3 same event under two viewpoints; L4 connected narrative.
**Distractors/constraints.** Short/long event heuristic, keyword-only decision.
**Feedback.** Draw event/reference intervals and narrative role.
**Examples.** `Ayer compré pan` (L1); `Cuando era niño, jugaba...` (L2);
`llovía cuando salí` (L2). **Validation.** Timeline/aspect frame.

### Family `compound_perfect_profile`

**Task/purpose.** Form the compound perfect and select it versus the simple
preterite only under an explicit variety/discourse profile.
**Response/template.** Form, profile-aware choice, or interpretation.
**Derivation.** Present `haber` + invariant participle; temporal relevance and
profile determine licensed distribution. **Difficulty.** L2 regular form; L3
irregular participle and current-relevance contrast; L4 compare reviewed
regional preferences. **Distractors/constraints.** Agree participle with
subject, use `tener`, universalize `hoy` rule. **Feedback.** Separate perfect
form from profile-specific use. **Examples.** `He terminado` (L2);
`ha escrito` (L2); `Hoy fui/he ido` classified by profile/context (L4).
**Validation.** Paradigm, invariant participle, and profile.

### Family `pluperfect_sequence`

**Task/purpose.** Form and interpret the pluperfect as anterior to a past
reference point. **Response/template.** Form completion, event ordering, or
timeline match. **Derivation.** Imperfect `haber` + participle locates event A
before past event/reference B. **Difficulty.** L2 two explicit events; L3
irregular participle and omitted repeated subject; L4 narrative inference.
**Distractors/constraints.** Reverse events, use compound present perfect,
agree participle. **Feedback.** Two-level timeline. **Examples.**
`Cuando llegué, ya había salido` (L2); order three events (L3);
infer prior completion (L4). **Validation.** Event graph.

### Family `future_form_meaning`

**Task/purpose.** Produce morphological future and distinguish prediction,
promise, schedule alternatives, and reviewed probability use.
**Response/template.** Form, construction choice, or meaning match.
**Derivation.** Infinitive/future stem plus ending and semantic frame yield form/
interpretation. **Difficulty.** L2 regular future; L3 irregular stems and
`ir a`/present contrast; L4 probability meaning. **Distractors/constraints.**
Present ending on infinitive, force future for every future event.
**Feedback.** Future stem and discourse function. **Examples.**
`hablaré` (L2); `tendrá` (L3); `Serán las ocho` as probability (L4).
**Validation.** Paradigm and meaning frame.

### Family `conditional_form_request`

**Task/purpose.** Produce/interpret conditional forms for hypotheses, future in
the past, and bounded politeness uses. **Response/template.** Form, timeline,
or request/register choice. **Derivation.** Conditional stem/ending plus
semantic frame determine use. **Difficulty.** L2 regular request; L3 irregular
stem/hypothetical result; L4 reported future or probability-in-past.
**Distractors/constraints.** English `would` mapped universally, use conditional
in a canonical `si` condition clause. **Feedback.** Stem and conditional role.
**Examples.** `Me gustaría...` (L2); `iría si pudiera` (L3);
`Dijo que vendría` (L4). **Validation.** Paradigm and clause relation.

### Family `imperative_addressee`

**Task/purpose.** Form affirmative and negative commands for the active
addressee system, including clitic attachment and accent changes.
**Response/template.** Command form, transformation, or ordered tokens.
**Derivation.** Lemma, polarity, `tú/usted/vos/vosotros/ustedes`, and clitics
select form and placement. **Difficulty.** L1 common affirmative `tú/usted`;
L2 negative and irregular forms; L3 attached clitics/accent; L4 compare declared
address profiles. **Distractors/constraints.** `no` + affirmative, mix `vos`
pronoun with `tú` command, proclitic after affirmative command.
**Feedback.** Addressee, polarity, base form, attachment, accent.
**Examples.** `Habla` (L1); `No hables` (L2); `Dímelo` (L3).
**Validation.** Profile-specific command paradigm and clitic automaton.

### Family `present_subjunctive_form`

**Task/purpose.** Produce/recognize present-subjunctive forms independently of
their selection. **Response/template.** Typed cell, matching, or stem/ending
assembly. **Derivation.** Reviewed present first-person stem, opposite-class
endings, spelling changes, and person yield form. **Difficulty.** L2 regular;
L3 stem/spelling change and common irregulars; L4 profiled addressee/plural
forms. **Distractors/constraints.** Indicative ending, infinitive stem despite
required `yo` irregular, omit accent. **Feedback.** Derivation from the reviewed
stem. **Examples.** `hable` (L2); `tengamos` (L3); `llegue` (L3).
**Validation.** Paradigm cell.

### Family `subjunctive_selection`

**Task/purpose.** Choose indicative, subjunctive, or infinitive from a bounded
semantic/discourse construction. **Response/template.** Mood/form choice,
meaning contrast, or sentence completion. **Derivation.** Assertion status,
subject identity, desire/influence/evaluation, existence/specificity,
prospectivity, and negation determine licensed construction.
**Difficulty.** L2 desire/influence with different subject; L3 evaluation,
nonexistence, and future temporal clause; L4 same surface trigger with changed
assertion/context. **Distractors/constraints.** Keyword after `que`, uncertainty
only, ignore same-subject infinitive. **Feedback.** Semantic trigger and subject/
assertion graph. **Examples.** `Quiero salir / Quiero que salgas` (L2);
`Busco un libro que tenga...` non-specific (L3); `Cuando llegue...` future
(L3). **Validation.** Construction semantics.

### Family `past_subjunctive_hypothesis`

**Task/purpose.** Form the imperfect subjunctive and use it in controlled past
subordination or contrary-to-fact hypotheses. **Response/template.** Form,
clause pairing, or timeline interpretation. **Derivation.** Third-person plural
preterite stem yields reviewed `-ra` (and accepted/profiled `-se`) form; clause
semantics select mood and conditional result. **Difficulty.** L3 regular/
irregular form; L4 past trigger, hypothetical `si`, and profile/register
alternative. **Distractors/constraints.** Conditional in the `si` clause,
future subjunctive, mix `-ra/-se` endings within one form.
**Feedback.** Form derivation and possible-world relation. **Examples.**
`quería que vinieras` (L3); `si tuviera tiempo, viajaría` (L3);
accepted `viniese` where profile permits (L4). **Validation.** Paradigm and
clause-world model.

### Family `verb_tense_mood_audit`

**Task/purpose.** Diagnose one conjugation, `ser/estar/hay`, aspect, periphrasis,
command, mood, or variety-profile error. **Response/template.** Root cause,
correction, and meaning effect. **Derivation.** Mutate one feature in a valid
verb/construction instance. **Difficulty.** L1 form agreement; L2 past/periphrasis;
L3 aspect/mood/command; L4 profile-sensitive interpretation.
**Distractors/constraints.** One root fault; valid alternate viewpoints require
different context and are not mislabeled. **Feedback.** Correct paradigm/
timeline/semantic trigger. **Examples.** stem change in wrong cell (L2);
preterite used for intended background (L3); compound perfect imposed across
profiles (L4). **Validation.** Fault manifest.

### Cross-family progression

Class/stem recognition precedes present production. `ser/estar/hay` and common
periphrases enter early but stay meaning-specific. Preterite and imperfect forms
are mastered before aspect choice; compound perfect is added only with a
profile. Future/conditional precede hypotheses. Subjunctive form and selection
remain separate until both are stable. Command and cumulative audits combine
only known person/profile and clitic systems.

## 5. Category: Pronouns, clitics, `se`, and sentence structure

### Category purpose

Train reference tracking and argument realization: who acts, who is affected,
what is replaced by a pronoun, where clitics attach, and how word order reflects
discourse. The generator starts from semantic roles so it does not confuse
personal `a`, object function, and surface position.

### Learn-card content

- Spanish often omits subject pronouns because the verb and context identify the
  subject; overt pronouns can contrast, clarify, or shift focus.
- Tonic pronouns follow prepositions, with reviewed special forms such as
  `mí`, `ti`, and `conmigo/contigo`.
- Direct-object clitics primarily encode accusative role, gender, and number;
  indirect-object clitics encode dative person/number.
- Before a third-person direct-object clitic, dative `le/les` is realized as
  `se`: `Se lo doy`.
- Clitics normally precede a finite verb and attach to infinitives, gerunds, and
  affirmative imperatives under construction-specific rules.
- Personal `a` marks selected direct objects; it does not turn them into indirect
  objects.
- Spanish frequently uses a clitic together with a full indirect object, and
  some profiles/constructions duplicate direct objects.
- `se` has several unrelated analyses. Meaning, agreement, and argument
  structure decide which is present.
- Word order is flexible but not free: reference, topic, focus, prosody, and
  clitic resumption constrain it.

### Common misconceptions

- A Spanish clause requires an overt subject pronoun.
- Any noun introduced by `a` is an indirect object.
- `le` means “him” and `lo` means “it” regardless of syntactic role/profile.
- Change `le lo` to `se lo` and forget who `se` refers to.
- Clitics can be placed anywhere near the verb.
- A full indirect-object phrase makes the clitic redundant and wrong.
- Every `se` means “himself/herself.”
- `gustar` has the experiencer as grammatical subject.
- The nearest compatible noun is automatically a pronoun's referent.
- Spanish word order can change without altering focus or naturalness.

### Family `subject_pronoun_expression`

**Task/purpose.** Decide whether to omit or express a subject pronoun and recover
its referent from verb/discourse context. **Response/template.** Omit/include
choice, referent matching, or sentence contrast. **Derivation.** Person/number,
ambiguity, contrast, topic shift, coordination, and profile license an accepted
set. **Difficulty.** L1 recover subject from unique verb form; L2 optional
neutral omission; L3 contrast/disambiguation; L4 discourse and profile tendency.
**Distractors/constraints.** English mandatory-subject transfer, reject a valid
omission without a focus constraint. **Feedback.** Verb features and discourse
reason. **Examples.** `(Yo) hablo español` neutral (L1); `Ella trabaja, pero él
estudia` contrast (L2); ambiguous third-person resolution (L3).
**Validation.** Discourse/accepted-order set.

### Family `address_pronoun_paradigm`

**Task/purpose.** Match `tú`, `vos`, `usted`, `vosotros/as`, and `ustedes` to
verb, possessive, tonic, and clitic forms in a declared profile.
**Response/template.** Paradigm matching, form choice, or profile classification.
**Derivation.** Addressee number, relationship, register, and profile yield a
consistent feature bundle. **Difficulty.** L1 `tú/usted`; L2 plural system; L3
voseo; L4 mixed comprehension across profiles. **Distractors/constraints.**
“Latin America” as one system, mix `vos` with `te` incorrectly only where the
profile actually rejects/accepts it, confuse semantic second person with
grammatical third person for `usted`. **Feedback.** Complete address bundle.
**Examples.** `tú tienes` (L1); `usted tiene` (L1);
profiled `vos tenés` (L3). **Validation.** Variety-profile table.

### Family `tonic_prepositional_pronoun`

**Task/purpose.** Select tonic subject/prepositional pronouns and
`conmigo/contigo` forms. **Response/template.** Pronoun choice or phrase
completion. **Derivation.** Preposition, referent features, coordination, and
special-form registry determine realization. **Difficulty.** L1 `para mí/ti`;
L2 third person and plural; L3 `entre tú y yo`, reflexive `sí`; L4 referent/
register contrasts. **Distractors/constraints.** `para yo`, `con mí`, extend
special forms after every preposition. **Feedback.** Preposition→case/form link.
**Examples.** `para mí` (L1); `contigo` (L2); `entre tú y yo` (L3).
**Validation.** Prepositional-pronoun grammar.

### Family `direct_object_clitic`

**Task/purpose.** Replace/resolve a direct object with `me/te/lo/la/nos/os/
los/las` under the active profile. **Response/template.** Clitic choice,
referent matching, or sentence rewrite. **Derivation.** Argument role, person,
gender/number, animacy, and allowed leísmo profile determine form.
**Difficulty.** L1 third-person thing; L2 person/plural; L3 competing referents;
L4 reviewed regional variants. **Distractors/constraints.** Choose by English
gloss, confuse personal `a` with dative, mark accepted leísmo universally wrong.
**Feedback.** Verb→direct-object role and referent features.
**Examples.** `Veo la casa→La veo` (L1); `Conozco a Ana→La conozco` (L2);
profiled masculine-person variant (L4). **Validation.** Argument frame and
profile.

### Family `indirect_object_clitic`

**Task/purpose.** Select and resolve `me/te/le/nos/os/les` for recipient,
beneficiary, experiencer, possessor, or other reviewed dative roles.
**Response/template.** Clitic choice, role label, or sentence transformation.
**Derivation.** Verb/construction frame and referent person/number select dative.
**Difficulty.** L1 recipient; L2 plural/experiencer; L3 affected possessor or
ambiguous third person; L4 discourse resolution. **Distractors/constraints.**
Gender-mark `le`, omit licensed duplication, choose direct clitic by animacy.
**Feedback.** Dative role and referent arrow. **Examples.** `Le doy el libro a
Ana` (L1); `Nos gusta` (L2); affected possessor construction (L3).
**Validation.** Dative role graph.

### Family `dative_se_cluster`

**Task/purpose.** Transform underlying `le/les + lo/la/los/las` into `se` plus
the direct-object clitic while preserving both referents.
**Response/template.** Cluster construction, matching, or referent annotation.
**Derivation.** Build typed dative+accusative cluster, apply the third-person
dative surface rule, and order slots. **Difficulty.** L2 singular objects; L3
plural/gender and competing referents; L4 attachment to a nonfinite/command
host. **Distractors/constraints.** `le lo`, interpret `se` reflexively, lose
dative number/referent. **Feedback.** Show underlying `le/les + lo... → se
lo...`. **Examples.** `Doy el libro a Ana→Se lo doy` (L2);
`las cartas→Se las envío` (L3); `Dáselo` (L4). **Validation.** Typed cluster
round-trip.

### Family `clitic_position_attachment`

**Task/purpose.** Place one or more clitics with finite verbs, infinitives,
gerunds, affirmative and negative commands. **Response/template.** Ordered
tokens, attached spelling, or accepted-position selection.
**Derivation.** Host type, polarity, periphrasis, and clitic sequence determine
proclisis/enclisis and accent recalculation. **Difficulty.** L1 finite
proclitic; L2 infinitive/gerund options; L3 commands and clusters; L4 multiple
licensed placements in a periphrasis. **Distractors/constraints.** Split an
enclitic spelling, attach to a finite indicative, use enclisis after negative
command. **Feedback.** Host bracket, clitic slots, and accent.
**Examples.** `Lo veo` (L1); `Voy a verlo/Lo voy a ver` (L2);
`No me lo digas` versus `Dímelo` (L3). **Validation.** Host automaton.

### Family `object_doubling`

**Task/purpose.** Recognize and produce licensed clitic doubling with full
indirect or selected direct objects. **Response/template.** Include/omit choice,
role matching, or sentence correction. **Derivation.** Construction, object
type/position, pronoun class, information structure, and profile determine
requirement/option. **Difficulty.** L2 indirect object; L3 tonic pronoun and
fronted object; L4 profile-specific direct doubling. **Distractors/constraints.**
Delete all “redundant” clitics, add doubling universally, conflate with
co-reference error. **Feedback.** Show that clitic and phrase share one role.
**Examples.** `A Ana le doy el libro` (L2); `A mí me gusta` (L2);
profiled direct-object doubling (L4). **Validation.** Construction/profile rule.

### Family `gustar_experiencer`

**Task/purpose.** Build and interpret `gustar`-type constructions with dative
experiencer and agreeing stimulus subject. **Response/template.** Verb/clitic
choice, role labeling, or sentence assembly. **Derivation.** Stimulus
number/person controls verb; experiencer controls dative clitic and optional
phrase. **Difficulty.** L1 singular/plural stimulus; L2 named experiencer; L3
infinitive/clause stimulus and similar verbs; L4 tense/negation/reference.
**Distractors/constraints.** Agree verb with experiencer, use direct clitic,
omit required dative. **Feedback.** Experiencer and grammatical-subject arrows.
**Examples.** `Me gusta el libro` (L1); `Me gustan los libros` (L1);
`A Ana le interesa viajar` (L3). **Validation.** Construction role graph.

### Family `personal_a`

**Task/purpose.** Choose presence/absence of personal `a` for a direct object in
a sufficiently constrained context. **Response/template.** `a`/zero choice,
role classification, or sentence contrast. **Derivation.** Animacy,
personification, specificity, definiteness, verb meaning, object type, and
construction determine licensed set. **Difficulty.** L1 specific known person;
L2 inanimate and nonspecific person; L3 search/need/existential contrasts; L4
meaning-changing alternation. **Distractors/constraints.** “Human always `a`,”
“`a` means indirect object,” copy English. **Feedback.** Direct-object status
plus animacy/specificity. **Examples.** `Veo a María` (L1);
`Busco un médico` nonspecific (L2); contrast with known `al médico` (L3).
**Validation.** Authored semantic frame.

### Family `se_construction`

**Task/purpose.** Distinguish reflexive, reciprocal, lexical/pronominal,
impersonal, passive, accidental/affected, and dative-replacement `se`.
**Response/template.** Construction label, role graph, agreement/form choice,
or controlled completion. **Derivation.** Argument structure, subject
availability, agreement, clitic cluster, and event framing select analysis.
**Difficulty.** L2 reflexive versus impersonal; L3 passive agreement and
lexical `se`; L4 accidental and ambiguous surface forms with disambiguating
context. **Distractors/constraints.** Every `se` = self, ignore plural agreement,
confuse dative replacement with impersonal. **Feedback.** Construction-specific
dependency graph. **Examples.** `Se lava` reflexive (L2);
`Se venden libros` passive (L3); `Se me cayó el vaso` affected event (L4).
**Validation.** Typed `se` registry.

### Family `negation_polarity`

**Task/purpose.** Place `no` and use reviewed negative/negative-polarity
expressions such as `nunca`, `nadie`, `nada`, `ninguno`, `tampoco`, and `ni`.
**Response/template.** Clause ordering, scope/meaning match, or completion.
**Derivation.** Polarity scope and pre/postverbal position license concord and
form. **Difficulty.** L1 `no`; L2 postverbal negative item; L3 preverbal
negative and `ni...ni`; L4 scope/reference contrast.
**Distractors/constraints.** English double-negative logic, add `no` after a
preverbal negative subject, confuse `también/tampoco`. **Feedback.** Scope and
concord structure. **Examples.** `No entiendo` (L1);
`No veo nada` (L2); `Nadie vino` (L3). **Validation.** Polarity grammar.

### Family `question_formation`

**Task/purpose.** Form and interpret yes/no, wh-, and alternative questions,
including required prepositions and punctuation. **Response/template.** Ordered
clause, interrogative choice, or answer-to-question match.
**Derivation.** Unknown semantic role, preposition frame, subject information,
and speech-act span determine interrogative and licensed order.
**Difficulty.** L1 yes/no and `qué/dónde`; L2 who/which/how much; L3
prepositional/interrogative subject-object contrast; L4 embedded question.
**Distractors/constraints.** English do-support, omit personal/lexical
preposition, confuse `qué/cuál`, omit accents/opening mark when assessed.
**Feedback.** Unknown role and question span. **Examples.** `¿Hablas español?`
(L1); `¿Con quién vienes?` (L2); `No sé qué quiere` (L3).
**Validation.** Question semantic frame.

### Family `relative_clause_form`

**Task/purpose.** Choose/interpret `que`, preposition+`quien/quienes`,
`el/la/los/las que`, selected `el cual` forms, and possessive `cuyo` only in
reviewed contexts. **Response/template.** Relative form, clause combination, or
antecedent-gap matching. **Derivation.** Antecedent features, syntactic gap,
governing preposition, animacy, and register license forms.
**Difficulty.** L2 subject/direct-object `que`; L3 prepositional relatives; L4
register alternatives and `cuyo` agreement. **Distractors/constraints.** English
who/which mapping, omit required preposition, make `cuyo` agree with possessor.
**Feedback.** Antecedent→gap and agreement link. **Examples.** `el libro que
leo` (L2); `la persona con quien hablo` (L3); `la autora cuyos libros...` (L4).
**Validation.** Relative dependency.

### Family `marked_word_order_focus`

**Task/purpose.** Match neutral, subject-postposed, topicalized, dislocated, and
focused orders to a reviewed discourse context. **Response/template.**
Context-to-sentence choice or accepted ordering. **Derivation.** Topic/focus,
new/given status, verb class, prosody annotation, and clitic resumption license
order. **Difficulty.** L2 neutral order; L3 postverbal subject/fronting; L4
dislocation with clitic and profile effects. **Distractors/constraints.**
“Spanish order is free,” reject grammatical order that serves a different
focus. **Feedback.** Information-structure map. **Examples.** neutral SVO (L2);
`Llegó Ana` presentational (L3); `El libro, lo compré ayer` (L4).
**Validation.** Discourse-order set.

### Family `pronoun_syntax_audit`

**Task/purpose.** Diagnose one subject/pronoun, object-role, personal-`a`,
clitic, `se`, negation, question, relative, or word-order error.
**Response/template.** Root cause, correction, and reference/meaning effect.
**Derivation.** Mutate one dependency or surface rule after valid realization.
**Difficulty.** L2 one role/clitic; L3 cluster/`se`/relative; L4 discourse or
profile-sensitive case. **Distractors/constraints.** One root fault; all
licensed placements/variants accepted. **Feedback.** Correct semantic/syntactic
graph. **Examples.** personal `a` misread as dative (L2); `le lo` cluster (L3);
fronted object lacks required resumption in target construction (L4).
**Validation.** Fault manifest.

### Cross-family progression

Subject expression and tonic pronouns precede object clitics. Direct/indirect
roles precede dative `se`; one clitic/host precedes clusters and doubling.
Personal `a` is contrasted with both object roles. `gustar` and each `se`
construction are taught independently before mixed sentences. Questions,
relatives, negation, and neutral order precede information-structure audits.

## 6. Category: Connected Spanish, discourse, register, and variation

### Category purpose

Connect clauses and choose forms that fit purpose, viewpoint, relationship, and
variety profile. These families train distinctions that become frustrating when
taught as one-word translations, especially `por/para`, mood in subordinate
clauses, and address systems.

### Learn-card content

- `por` and `para` each cover networks of relations. Classify the intended
  relation before choosing a preposition.
- Comparison distinguishes the compared entities/constituents and may require
  `que`, `de`, or equality structures.
- Connectors encode addition, contrast, cause, result, concession,
  reformulation, and sequence.
- Temporal, purpose, relative, conditional, and evaluative clauses interact with
  assertion, prospectivity, specificity, subject identity, tense, and mood.
- Address and politeness are feature bundles, not word swaps.
- A valid sentence can be inappropriate to the active relationship, medium, or
  geographic profile.
- The generator must constrain intended meaning enough to accept every natural
  realization it promises to score.

### Common misconceptions

- `por` means “by” and `para` means “for.”
- Comparatives always use `que`.
- One English connector has one Spanish equivalent.
- Every future reference requires morphological future.
- Every clause after `cuando` takes subjunctive.
- Any negated opinion automatically takes subjunctive in every discourse.
- `usted` is always more polite and `tú/vos` is always rude.
- All countries use the same singular and plural address system.
- Replacing pronouns alone converts an informal message into a formal one.

### Family `por_para_relation`

**Task/purpose.** Select/interpret `por` or `para` from an explicit semantic
relation. **Response/template.** Preposition choice, relation label, picture/
timeline match, or paired meaning. **Derivation.** Cause/motive, means, path,
exchange, duration/periodicity, agent, purpose, destination, recipient,
deadline, comparison/standard, and viewpoint map to reviewed constructions.
**Difficulty.** L1 destination versus route/cause; L2 purpose, recipient,
means/exchange; L3 deadline/duration and viewpoint; L4 same noun phrase with
meaning contrast. **Distractors/constraints.** English gloss lookup, keyword
after the preposition without relation. **Feedback.** Render relation as an
arrow/timeline/role. **Examples.** `Voy para Madrid / paso por Madrid` (L1);
`Lo hice por ti / para ti` with authored meanings (L2); deadline contrast (L3).
**Validation.** Semantic relation uniquely licenses target set.

### Family `comparison_degree`

**Task/purpose.** Build/interpret inequality, equality, superlative, and reviewed
irregular comparisons. **Response/template.** Connector/form choice or phrase
assembly. **Derivation.** Compared constituents, quantity, degree, numeral
threshold, and adjective/adverb role select `más/menos...que`, `tan...como`,
`tanto...como`, `más de`, and lexical forms.
**Difficulty.** L1 adjective inequality; L2 equality and agreement; L3 `que/de`
and superlatives; L4 `mejor/más bueno` meaning/register cases.
**Distractors/constraints.** `más de` everywhere before numbers, make `tan`
agree, double comparative. **Feedback.** Comparison slots and connector reason.
**Examples.** `más alto que` (L1); `tantas casas como` (L2);
`más de veinte` (L3). **Validation.** Comparison template.

### Family `connector_discourse_relation`

**Task/purpose.** Select a connector expressing an authored relation: addition,
contrast, concession, cause, consequence, reformulation, exemplification, or
sequence. **Response/template.** Connector choice, relation label, or clause
join. **Derivation.** Relation and register license a finite accepted set.
**Difficulty.** L1 `y/pero/porque`; L2 `por eso/sin embargo/además`; L3
concession/reformulation; L4 near-synonyms under register constraints.
**Distractors/constraints.** Semantically plausible but wrong relation; avoid
testing punctuation alone. **Feedback.** Discourse graph and paraphrase.
**Examples.** cause with `porque` (L1); result with `por eso` (L2);
concession with `aunque` in a declared mood context (L3).
**Validation.** Annotated relation.

### Family `temporal_clause_sequence`

**Task/purpose.** Express event ordering/overlap with `antes de`, `después de`,
`mientras`, `cuando`, `hasta que`, `en cuanto`, and reviewed mood/tense choices.
**Response/template.** Timeline order, connector/form selection, or assembly.
**Derivation.** Event intervals, subject identity, actuality/prospectivity, and
reference time select infinitive/indicative/subjunctive template.
**Difficulty.** L1 before/after; L2 overlap and past sequence; L3 future
temporal clauses; L4 same connector under actual versus prospective meaning.
**Distractors/constraints.** Surface word order = chronology, keyword-trigger
subjunctive, ignore same-subject infinitive. **Feedback.** Timeline plus mood
reason. **Examples.** `antes de salir` (L1); `mientras estudiaba...` (L2);
`cuando llegue, te llamo` (L3). **Validation.** Timeline/world model.

### Family `cause_purpose_condition`

**Task/purpose.** Distinguish and construct cause, purpose, real condition, and
hypothetical condition. **Response/template.** Relation/connector/mood choice or
bounded clause build. **Derivation.** Relation, subject identity, assertion, and
possible-world status select `porque`, `para`, `para que`, `si`, and reviewed
forms. **Difficulty.** L1 cause; L2 same/different-subject purpose and real
condition; L3 present hypothetical; L4 past/counterfactual extension.
**Distractors/constraints.** `porqué/porque/por que` confusion only when spelling
is also taught, conditional in canonical `si` clause, ignore mood.
**Feedback.** Role/world graph. **Examples.** `Estudio porque...` (L1);
`Estudio para aprender / para que aprendas` (L2);
`Si tuviera..., haría...` (L3). **Validation.** Semantic clause model.

### Family `assertion_subjunctive_contrast`

**Task/purpose.** Compare indicative/subjunctive meanings where assertion,
evaluation, specificity, concession, or speaker commitment changes.
**Response/template.** Context-to-clause match or explanation choice.
**Derivation.** Discourse commitment and referent/world model license mood;
forms come from verified paradigms. **Difficulty.** L3 clear assertive/
nonassertive pair; L4 negation, `aunque`, relative, or evaluative contrast.
**Distractors/constraints.** One trigger-word list, mood as truth/falsity, ignore
speaker's communicative stance. **Feedback.** Show what is asserted, presupposed,
desired, evaluated, or merely sought. **Examples.** `Sé que viene / No creo que
venga` (L3); specific/non-specific relative (L3); `aunque` contrast (L4).
**Validation.** Authored discourse-world pair.

### Family `address_register_profile`

**Task/purpose.** Choose a coherent address/register bundle for a defined
relationship and active variety profile. **Response/template.** Pronoun/verb/
clitic/possessive/greeting choice or consistency check.
**Derivation.** Speaker/addressee relationship, number, institution, desired
stance, and profile select forms. **Difficulty.** L1 `tú/usted`; L2 plural
systems; L3 voseo and requests; L4 compare comprehension profiles.
**Distractors/constraints.** National stereotypes, mixed paradigms, formality as
a universal fixed ranking. **Feedback.** Scenario and full bundle.
**Examples.** friend under `tú` profile (L1); formal singular `usted` (L1);
informal `vos` profile (L3). **Validation.** Profile coherence.

### Family `formal_informal_rewrite`

**Task/purpose.** Rewrite a bounded message for a new relationship/register
without changing facts or intent. **Response/template.** Token transformation,
constrained text, or choice among authored rewrites.
**Derivation.** Separate propositional content from address, greeting, request
strategy, mitigation, closing, and profile. **Difficulty.** L2 agreement/forms;
L3 request and opening/closing; L4 short multi-sentence message.
**Distractors/constraints.** Pronoun-only swap, mixed address system, add/remove
facts, equate polite with verbose. **Feedback.** Content-preservation and
register-feature comparison. **Examples.** `¿Puedes...?`→profiled
`¿Puede...?` (L2); appointment message (L3); brief email rewrite (L4).
**Validation.** Authored/generated accepted realization set.

### Family `existential_weather_impersonal`

**Task/purpose.** Use existential `haber`, weather, impersonal `hacer/ser`, and
high-frequency impersonal constructions. **Response/template.** Form/agreement
choice or meaning match. **Derivation.** Construction, tense, quantity, and
profile select realization; existential object is not treated as an agreeing
subject in the core standard target. **Difficulty.** L1 `hay` and weather; L2
past/future existential forms; L3 impersonal `se/hay que/hace`; L4 contrast with
personal or locative clause. **Distractors/constraints.** Pluralize standard
existential `haber`, use `estar` for weather universally, invent dummy “it.”
**Feedback.** Construction/role graph. **Examples.** `Hay dos mesas` (L1);
`Hace frío` (L1); `Había problemas` (L2). **Validation.** Construction registry.

### Family `controlled_sentence_construction`

**Task/purpose.** Realize a semantic frame using required lexemes and explicit
tense, profile, and register constraints. **Response/template.** Ordered tokens
or constrained text grammar. **Derivation.** Semantic roles feed noun phrase,
verb/mood, clitic, connector, and linearization modules; enumerate variants.
**Difficulty.** L1 one clause; L2 modifier/preposition; L3 clitic/subordinate
clause; L4 two-clause discourse/profile constraint.
**Distractors/constraints.** Never unrestricted translation; each distractor
breaks one logged dependency. **Feedback.** Frame→features→realization.
**Examples.** location/existence (L1); polite request (L2);
purpose clause plus object clitic (L3). **Validation.** Back-parse to the same
frame.

### Family `grammar_pragmatics_audit`

**Task/purpose.** Diagnose one `por/para`, comparison, connector, temporal,
conditional, mood, register, existential, or cohesion error.
**Response/template.** Root cause, correction, and meaning/profile effect.
**Derivation.** Inject one logged fault after producing valid discourse.
**Difficulty.** L2 local connector/preposition; L3 cross-clause mood/register;
L4 plausible but pragmatically/profile-incompatible alternative.
**Distractors/constraints.** Exactly one root; accept all reviewed repairs.
**Feedback.** Correct discourse/semantic graph. **Examples.** route/destination
reversed (L2); future temporal clause uses intended wrong mood (L3);
mixed `vos/usted` bundle (L4). **Validation.** Fault removal restores invariants.

### Cross-family progression

Concrete `por/para` relations and comparisons precede abstract connectors.
Event timelines precede temporal mood alternations. Form-level subjunctive
precedes assertion contrasts. One address system is stable before cross-profile
comprehension and message rewrite. Controlled construction and audits combine
only demonstrated relations.

## 7. Category: Reading, listening, and interaction

### Category purpose

Integrate the language systems in short, purposeful comprehension and
communication. Every text and recording remains fully annotated so answers can
be checked from evidence rather than guessed from open-ended interpretation.

### Learn-card content

- Use morphology, connectors, reference, genre, and context rather than
  translating every word.
- Spanish often omits recoverable subjects and repeats/cliticizes objects in ways
  that affect reference.
- Notices, menus, schedules, chats, and instructions may use fragments and
  conventional layouts.
- Listening progresses from a known contrast to words, chunks, turns, and short
  dialogues across reviewed speakers/profiles.
- Dictation feedback separates lexical, accent, `ñ/ü`, punctuation, and
  segmentation errors.
- Speaking practice supports model listening, recording, replay, and
  self-assessment; it does not claim automatic pronunciation diagnosis.
- Bounded mediation transfers specified facts between controlled
  representations and is not free translation.

### Common misconceptions

- Every unknown word is necessary to answer.
- The nearest noun is always a pronoun's referent.
- An omitted subject has no recoverable identity.
- Faster audio is automatically better or more authentic.
- One accent represents Spanish globally.
- Missing written accents never affect comprehension or correctness.
- Waveform similarity measures pronunciation quality.
- A plausible inference is necessarily supported by the source.

### Family `sentence_segmentation_parse`

**Task/purpose.** Segment a sentence into meaningful groups and recover core
roles, omitted subjects, clitic links, and clause boundaries.
**Response/template.** Grouping, labels, or dependency matching.
**Derivation.** Generated sentence retains semantic frame and parse.
**Difficulty.** L1 noun/verb groups; L2 prepositional phrase/omitted subject; L3
clitics/subordination; L4 controlled ambiguity. **Distractors/constraints.**
Attach modifier to plausible wrong head, treat personal `a` as dative, invent
overt subject. **Feedback.** Bracketing and role arrows. **Examples.** simple
transitive clause (L1); omitted subject plus time phrase (L2); clitic/subordinate
clause (L3). **Validation.** Surface reparses to stored tree.

### Family `short_reading_comprehension`

**Task/purpose.** Retrieve facts, order events, and make one licensed inference
from a short microtext. **Response/template.** Choice, fact slot, ordering, or
entailed/not-entailed. **Derivation.** Fact/event graph generates text, question,
and evidence spans. **Difficulty.** L1 explicit sentence fact; L2 paragraph/
reference; L3 two-clause inference; L4 aspect/connector/quantity distractors.
**Distractors/constraints.** No outside knowledge; one best answer unless
multiple selection stated. **Feedback.** Highlight evidence and inference.
**Examples.** identify destination (L1); order errands (L2); infer reason for
changed plan (L3). **Validation.** Entailment labels.

### Family `notice_message`

**Task/purpose.** Interpret practical notices, labels, menus, ads, chats, and
service/personal messages. **Response/template.** Action, audience, fact
extraction, or matching. **Derivation.** Genre template controls layout,
ellipsis, register, profile, dates, and prices. **Difficulty.** L1 sign; L2
message/opening hours; L3 email/menu/ad; L4 reconcile two documents.
**Distractors/constraints.** Fictional data; no current legal/emergency claim.
**Feedback.** Expand ellipsis and show decisive fields. **Examples.** `Cerrado
los lunes` (L1); changed meeting time (L2); invitation plus reply (L3).
**Validation.** Layout/fact table agreement.

### Family `instruction_timetable`

**Task/purpose.** Follow instructions or derive one fact from a timetable,
itinerary, recipe, or schedule. **Response/template.** Order actions, choose
time/route, or enter structured fact. **Derivation.** Structured events generate
document and answer. **Difficulty.** L1 one imperative; L2 sequence/time; L3
constraint/transfer; L4 exception/conditional note.
**Distractors/constraints.** Arithmetic secondary; fictional schedules; display
conventions declared. **Feedback.** Trace rows/steps and temporal logic.
**Examples.** next step (L1); departure time (L2); valid connection (L3).
**Validation.** Independent event solver.

### Family `dialogue_completion`

**Task/purpose.** Choose/construct a grammatical, coherent, socially appropriate
next turn. **Response/template.** Turn choice, token order, or constrained
utterance. **Derivation.** Dialogue state stores speakers, goal, profile,
register, facts, commitments, and open question. **Difficulty.** L1 greeting/
answer; L2 request/offer; L3 repair/refusal; L4 multi-turn reference.
**Distractors/constraints.** Grammatical but nonresponsive, wrong profile,
contradiction. **Feedback.** Speech act and answered turn. **Examples.** respond
to `¿Cómo estás?` (L1); accept invitation (L2); clarify mismatch (L3).
**Validation.** Dialogue-state constraints.

### Family `reference_ellipsis_resolution`

**Task/purpose.** Resolve omitted subjects, clitics, possessives, demonstratives,
and predictable ellipsis. **Response/template.** Referent selection, link
drawing, or expansion. **Derivation.** Discourse graph tracks features,
salience, roles, and licensed omission. **Difficulty.** L2 unique omitted
subject; L3 competing referents/clitics; L4 cross-turn topic shift.
**Distractors/constraints.** Nearest noun heuristic, English overt subject,
ignore gender/number/verb person. **Feedback.** Agreement and discourse cues.
**Examples.** recover `yo` from verb (L2); resolve `la` (L2); topic-shift
ellipsis (L3). **Validation.** Intended referent uniquely recoverable.

### Family `listening_sound_form`

**Task/purpose.** Identify a taught sound, stress, syllable, word form, or
profile contrast in clean audio. **Response/template.** Audio-to-word,
same/different, stress location, or profile feature. **Derivation.** Assets are
indexed by phonological feature, lexeme, speaker, and profile.
**Difficulty.** L1 vowel/syllable; L2 stress or rhotic; L3 merged/distinguished
contrast across speakers; L4 form contrast in a turn.
**Distractors/constraints.** No accent ranking or regional “errors”; balance
speed/loudness. **Feedback.** Replay normal/learner-slow audio and mark feature.
**Examples.** stressed syllable (L1); `pero/perro` (L2);
profiled `s/c/z` comparison (L3). **Validation.** Manual audio review.

### Family `listening_dictation`

**Task/purpose.** Transcribe a word, phrase, sentence, or tiny dialogue with
correct Spanish orthography. **Response/template.** Text with optional scaffold.
**Derivation.** Asset has canonical transcript, accepted punctuation variants,
profile, and word alignment. **Difficulty.** L1 familiar word; L2 accent/`ñ`;
L3 homophone with context or clitic; L4 two turns.
**Distractors/constraints.** Do not normalize accents, `ñ`, or targeted
punctuation away. **Feedback.** Classify lexical, accent, grapheme, segmentation,
and punctuation errors. **Examples.** accented word (L1); `año` phrase (L2);
contextual `ha/a` (L3). **Validation.** Transcript/normalization suite.

### Family `listening_comprehension`

**Task/purpose.** Understand gist, facts, intention, or one supported inference
in a short recording. **Response/template.** Choice, order, or structured fact.
**Derivation.** Transcript/dialogue/fact graph stores timed evidence.
**Difficulty.** L1 one turn; L2 two-turn facts; L3 reference/profile; L4
attitude/intention only when explicitly reviewed. **Distractors/constraints.**
No stereotypes/trivia; transcript after submission. **Feedback.** Replay
evidence segment and reveal transcript. **Examples.** requested item (L1);
appointment time (L2); changed plan (L3). **Validation.** Manual review and
evidence check.

### Family `guided_speaking_shadowing`

**Task/purpose.** Rehearse intelligible production through repetition,
shadowing, substitution, and prompted local recording.
**Response/template.** Recording plus self-check; optional model choice.
**Derivation.** Frame provides audio, chunks, target features, profile, and
substitutions. **Difficulty.** L1 word/chunk; L2 sentence; L3 transformed
sentence; L4 role response. **Distractors/constraints.** No automated score or
upload; recording optional; non-recording path available. **Feedback.** Model
replay and feature checklist. **Examples.** repeat trill contrast (L1);
substitute verb person (L2); polite request (L3). **Validation.** Reviewed
models and local-only recorder.

### Family `bounded_mediation`

**Task/purpose.** Transfer selected information between table, notice, message,
schedule, and constrained Spanish output. **Response/template.** Semantic slots,
faithful paraphrase, or phrase-bank assembly. **Derivation.** Source/output share
a fact graph; audience/register/profile constrain form. **Difficulty.** L2 one
fact; L3 several facts/register; L4 relevance selection with negation/quantity.
**Distractors/constraints.** Not free translation; judge facts, not vague style.
**Feedback.** Source→fact→output alignment. **Examples.** changed time (L2);
two menu constraints (L3); formal schedule message (L4).
**Validation.** Slot equivalence/contradiction.

### Family `profile_comprehension`

**Task/purpose.** Understand a familiar utterance realized in another reviewed
Spanish profile without requiring imitation. **Response/template.** Meaning
match, profile-feature label, or normalized paraphrase.
**Derivation.** One semantic frame is realized under two reviewed profiles with
matched lexical load. **Difficulty.** L2 `ustedes/vosotros`; L3 voseo or
pronunciation merger; L4 past/object-pronoun preference in context.
**Distractors/constraints.** Never infer nationality from voice; avoid
caricature; one feature at first. **Feedback.** Shared meaning and exact profile
difference. **Examples.** plural address pair (L2); `tú tienes/vos tenés` (L3);
past preference pair (L4). **Validation.** Same-frame realization.

### Family `connected_language_audit`

**Task/purpose.** Diagnose one comprehension, reference, transcript, dialogue,
profile, or fact-transfer failure in a short multimodal item.
**Response/template.** Root cause, correction, and source evidence.
**Derivation.** Inject one fault into a valid annotated instance.
**Difficulty.** L2 local cue; L3 evidence across sentences/modalities; L4
plausible unsupported/profile-mismatched inference.
**Distractors/constraints.** One root fault; source contains all evidence.
**Feedback.** Highlight decisive span and graph link. **Examples.** wrong omitted
subject (L2); dictation loses `ñ` (L2); summary reverses cancellation (L3).
**Validation.** Removing mutation restores consistency.

### Cross-family progression

Sentence parsing precedes longer reading/reference. Practical documents precede
multi-document reasoning. Listening moves from contrasts to dictation and
meaning; guided speaking reuses understood forms. Cross-profile comprehension
starts with familiar content. Mediation and audits follow component skills.

## 8. Cross-category progression and release slices

Levels indicate exercise complexity, not CEFR certification:

- **Foundation / L1:** letters, five-vowel decoding, common grapheme patterns,
  syllables/stress, lexical gender, singular/plural, core articles/agreement,
  present forms, foundational `ser/estar/hay`, familiar words, and one-turn
  reading/listening.
- **Elementary / L2:** written accents, possessives/demonstratives/quantifiers,
  common prepositions, reflexives, periphrases, preterite/imperfect forms, one
  direct/indirect clitic, personal `a`, questions/negation, `por/para`,
  comparison, practical messages, and two-turn interaction.
- **Independent-building / L3:** past-aspect choice, compound-perfect profiles,
  clitic clusters/placement/doubling, `gustar` and `se`, relatives, future/
  conditional/commands, present subjunctive selection, temporal/conditional
  clauses, register rewriting, connected reading/listening, and mediation.
- **Early-intermediate extension / L4:** discourse-sensitive mood and word
  order, imperfect subjunctive/hypotheses, multiple reference dependencies,
  explicit cross-profile comprehension, and multimodal audits.
- **L5 challenge:** denser mixing and weaker scaffolding inside the reviewed
  grammar. It does not silently become C1/C2 assessment, literary Spanish, or
  unrestricted translation.

Recommended delivery:

1. **Release A — sound, noun phrase, present:** Category 2 core; gender/number/
   article/agreement; present; `ser/estar/hay`; parsing and audio contrasts.
2. **Release B — practical past and objects:** remaining noun phrases,
   preterite/imperfect, reflexives/periphrases, one object clitic, personal `a`,
   notices, timetables, and dictation.
3. **Release C — connected interaction:** aspect choice, clitic clusters,
   `gustar/se`, relatives, `por/para`, connectors, register, dialogue, reference,
   and listening comprehension.
4. **Release D — early-B1 variation and mood:** perfect profiles, future/
   conditional/subjunctive/hypotheses, word order, cross-profile comprehension,
   mediation, and cumulative audits.

Unlock by family and feature, not one global level. A learner may practice
beginner listening while doing intermediate reading, or retain one production
profile while adding receptive familiarity with another. Audio/microphone
families remain optional when inaccessible.

## 9. Adaptive practice guidance

Track at least:

- family and can-do objective;
- lemma/sense, frequency band, domain, collocation, and known status;
- grapheme rule, syllable type, stress, written accent, speaker, and
  pronunciation profile;
- noun gender, number class, article use, agreement span, apocope, countability,
  and reference type;
- verb class, alternation, person/address system, number, tense, aspect, mood,
  periphrasis, event frame, and variety profile;
- argument role, personal `a`, clitic form/cluster/host, doubling, `se` type,
  and referent distance;
- preposition relation, connector, clause type, assertion status, register,
  speech act, and discourse function;
- modality, scaffold, response mode, latency, confidence, and misconception.

Routing examples:

- Correct noun gender but wrong modifier → keep noun/meaning constant and vary
  agreement distance before adding vocabulary.
- Wrong article with `agua`-type noun → contrast article allomorph and feminine
  adjective/plural; do not reteach gender as masculine.
- Correct preterite form but wrong imperfect choice → route to timelines and
  viewpoint contrasts, not more paradigm cells.
- Compound-perfect “error” from another valid profile → clarify active
  production profile and offer receptive contrast; do not record a universal
  grammar misconception.
- Correct direct clitic but wrong personal `a` → contrast semantic object role
  with animacy/specificity.
- `le lo` → return to typed dative+accusative cluster and referent tracking.
- Correct cluster in wrong position → hold referents constant and contrast host/
  polarity.
- Every `se` interpreted reflexively → route to minimal passive/impersonal/
  dative-replacement contrasts with explicit roles.
- Keyword-based subjunctive choice → vary assertion/subject identity while
  preserving the apparent trigger word.
- Mixed `tú/vos/usted` forms → practice one profile bundle before cross-profile
  comprehension.
- Dictation loses accents/`ñ` → replay the same lexeme/contrast and focus on
  orthography rather than unrelated listening.

Track “recognized,” “produced with scaffold,” and “produced from meaning”
separately. Use spaced retrieval for lexical/irregular forms, and dependency-
aware interleaving for grammar. After two recent successes, vary one controlled
dimension. After a confident misconception, present a minimal contrast, a
worked explanation, and delayed transfer. Slow correct performance can reduce
scaffolding without increasing unrelated lexical load.

## 10. Feedback and explanation requirements

Feedback should reveal:

1. **Intention and profile:** who means what, when, to whom, and under which
   declared variety/register?
2. **Semantic frame:** predicates, roles, referents, event intervals, assertion,
   and clause relation.
3. **Feature bundle:** person/address, number, gender, definiteness, tense,
   aspect, mood, polarity, and discourse status.
4. **Realization:** stem/ending, accent/spelling, agreement, preposition, clitic
   form/order/host, and word order.
5. **Mismatch:** the first decisive difference between the frame and response.
6. **Alternatives:** why another form is equivalent, profile-different, or
   meaning/register-different.

Useful explanations include:

- syllable boxes, stressed nucleus, and written-accent rule;
- grapheme environment and side-by-side valid pronunciation profiles;
- agreement arcs and referent arrows;
- highlighted verb stem, alternation, ending, and address profile;
- event/reference timelines for past forms;
- assertion/world cards for mood;
- direct/indirect role labels, personal-`a` annotation, and ordered clitic slots;
- construction diagrams for `ser/estar/hay`, `gustar`, and each `se`;
- spatial/causal/goal/timeline diagrams for `por/para`;
- dialogue-state and register/profile cards;
- synchronized transcript evidence.

Do not use an English translation as the sole explanation. Early levels may use
an interface-language gloss, but pictures, Spanish paraphrase, roles, timelines,
and contrasts should increasingly carry meaning. If the generator omitted a
valid answer or supplied insufficient context, invalidate the item rather than
penalize the learner.

## 11. Audio and content requirements

- Bundle required audio locally; no runtime network TTS, pronunciation API,
  speech recognition, or dictionary lookup.
- Prefer licensed human recordings from multiple reviewed speakers representing
  several profiles. Label speakers/profiles neutrally.
- Provide separate normal and pedagogically slower takes when useful. Do not
  simulate slow speech solely with distorting playback-rate reduction.
- Balance loudness and silence while preserving stress, rhythm, rhotics, and
  meaningful boundaries.
- Store transcript, word/chunk timing, speaker/voice, broad profile, target
  feature, rate, license, provenance, and manual-review status.
- Minimal sets should be recorded in matched conditions; profile comparisons
  should vary the intended feature without caricature.
- Provide replay, keyboard controls, visible state, transcript after submission,
  and a non-audio alternative where hearing is not the skill.
- Microphone use is optional and local-only. Audio is not uploaded or retained
  without an explicit user action. No accent identification or pronunciation
  score is shown.
- Purpose-written microtexts/dialogues are preferred. External content requires
  compatible licensing and attribution.
- Contexts span regions and adult life without turning language questions into
  tourism trivia or presenting one social custom as pan-Hispanic.

## 12. Rendering, interaction, and accessibility

- Use UTF-8 and reliably render/input `á é í ó ú ü ñ ¿ ¡` and uppercase forms.
- Provide an optional character strip for mobile text input.
- Never strip accents, diaeresis, `ñ`, or opening punctuation when assessed.
- Paradigms use semantic HTML tables with headers.
- Syllable/stress views, agreement arcs, timelines, clitic diagrams, and
  discourse graphs have equivalent text.
- Ordering/drag interactions have keyboard and button alternatives.
- Audio controls have accessible labels, playback state, replay, and transcript
  controls; no page-load autoplay.
- Color, waveform, speed, fine pointer movement, or hearing is never the only cue
  unless explicitly the target with an appropriate alternate route.
- Sentences and tables reflow at phone widths; long tokens do not force page-wide
  horizontal scrolling.
- Corrected Spanish is announced before detailed screen-reader feedback; raw
  feature codes stay in developer diagnostics.
- Respect reduced motion and do not use disappearing timed prompts as difficulty.
- Profile labels are readable text, not flags alone. A national flag is not an
  adequate representation of a linguistic feature.

## 13. Generator and offline implementation guidance

A practical educational module boundary is:

```text
seededRng
reviewedLexiconRegistry
varietyProfileRegistry
orthographySyllableStressEngine
pronunciationProfileRegistry
semanticFrameGenerator
featureBundleEngine
paradigmRealizer
nounPhraseEngine
agreementResolver
articleDeterminationEngine
prepositionRelationEngine
eventAspectWorldModel
serEstarHayConstructionEngine
subjunctiveSelectionEngine
personalAResolver
cliticSequenceAutomaton
seConstructionRegistry
referenceDiscourseGraph
clauseLinearizer
numberDateTimeGrammar
dialogueStateEngine
textEntailmentAnnotations
audioAssetRegistry
faultInjector
unicodeSpanishNormalizer
semanticAnswerChecker
accessibleRenderer
```

Archive per instance:

- stable family/schema and seed;
- data, generator, variety-profile, and audio versions;
- difficulty/scaffold and intended can-do;
- semantic frame, entities, facts, event intervals, possible worlds, discourse
  state, and speech act;
- lexeme/sense IDs and complete morphosyntactic bundles;
- active production profile plus accepted/profile-different realizations;
- canonical surface, tokenization, parse, dependencies, referents, evidence;
- normalization/punctuation policy;
- distractor misconception/rejection reason;
- audio asset ID and transcript where applicable;
- fault mutation/root cause for audit families.

Generate from representation to surface:

1. choose family, profile, and pedagogical dimension;
2. create semantic/phonological/orthographic/discourse source;
3. select compatible reviewed lexemes;
4. assign features, roles, event viewpoint, assertion, and construction;
5. realize noun phrases, verbs, clitics, clauses, spelling, and punctuation;
6. back-parse and verify identity with the source;
7. derive answer/explanation independently;
8. generate distractors from named misconception transformations;
9. reject collisions, ambiguity, awkwardness, unsupported variation, and
   vocabulary overload.

The standalone app must not download a conjugator, corpus, dictionary, TTS
voice, or answer service at runtime. Ship a small reviewed/versioned subset of
any licensed development resource. The checker parses only the promised grammar:
stable IDs for choices/order, exact feature structures or enumerated
realizations for text, and item-specific Unicode/case/spacing/punctuation
normalization. Edit distance never proves sentence correctness.

## 14. Automated and linguistic validation

### Data-build checks

- Every lexeme has stable ID, sense, part of speech, level/frequency, profile/
  register scope, provenance, and review status.
- Nouns specify gender, plural/countability, article behavior, stress, and
  pronunciation.
- Verbs specify all shipped paradigm cells, stem/spelling alternations, argument/
  preposition/pronominal frames, and profile scope.
- Adjectives/determiners specify agreement, position, apocope, and
  meaning restrictions.
- Clitic, `se`, personal-`a`, mood, `ser/estar/hay`, `por/para`, and address
  constructions use typed reviewed entries.
- Every accepted variant declares meaning, region/profile, register, and scope.
- Every audio asset has transcript, profile metadata, compatible license, and
  completed human review.

### Instance invariants

- Surface reparses to the source frame and feature bundle.
- Orthographic syllables, stress, accent, `ñ/ü`, and punctuation follow the
  declared target; sound mapping matches profile.
- Determiners/modifiers agree with the correct head; article/apocope behavior is
  construction-compatible.
- Finite verb agrees with subject/address system; stem/ending/spelling is verified.
- Tense/aspect matches event/reference model and declared perfect-past profile.
- Mood matches assertion/world/subject/construction model.
- `ser/estar/hay` and periphrases match intended construction.
- Object roles, personal `a`, clitic form/order/host/doubling, `se` analysis, and
  referents are licensed.
- Register/address features form one coherent profile.
- Reading/listening answer is entailed by stored evidence; distractors are
  contradicted or unsupported for logged reasons.
- No normalized accepted answer collides with a distractor.
- Audit instance differs from a valid instance by exactly one root mutation.

### Test volume and independent oracles

- Run at least 10,000 deterministic seeds per family per level.
- Run at least 25,000 seeds per level for accent/hiatus, article exceptions,
  past aspect/perfect profile, `ser/estar/hay`, subjunctive selection, personal
  `a`, clitic clusters/placement, `se`, `por/para`, reference, and audits.
- Exhaustively enumerate every shipped finite paradigm cell, article/
  determiner form, apocope pattern, address bundle, clitic cluster, and
  orthographic normalization case.
- Exhaustively test composed/decomposed accents, `ñ`, `ü`, inverted punctuation,
  case, spaces, and the declared punctuation variants.
- Recompute number/date/time output with an independent oracle.
- Back-parsing/entailment validation must not call only the same function that
  generated the key.
- Snapshot representative long text, tables, diagrams, profile labels, and
  audio states at phone/desktop widths.
- Manually review all audio and stratified samples across every template,
  lexeme, profile, distractor, and fault. Automation cannot certify idiomaticity
  or sociolinguistic appropriateness.

On failure, discard and log seed/family/version. Never fall back to an
unreviewed answer.

## 15. Coverage and balance requirements

Report by family/level:

- generation/rejection counts and distinct frames;
- lemma/sense/domain/frequency and new-versus-known vocabulary;
- grapheme, syllable, stress, accent, punctuation, speaker, and pronunciation
  profile;
- gender/plural/countability, article, agreement, adjective position,
  determiner, apocope, and preposition frame;
- verb class/irregularity, person/address, tense/aspect/mood, periphrasis, event
  frame, and profile;
- object role, personal `a`, clitic form/cluster/host/doubling, `se` type, and
  referent distance;
- `ser/estar/hay`, `por/para`, connector/clause relation, assertion, register,
  speech act, and discourse order;
- genre, comprehension operation, evidence distance, modality, audio rate, and
  profile familiarity;
- response mode, scaffold, misconception, confidence, and recent repetition.

Cap easy defaults: masculine `-o` nouns, `-ar` verbs, present tense, first-person
singular, `el`, `lo`, vocabulary from only one region, one narrator voice, and
literal one-clause English-to-Spanish patterns. Coverage should balance
frequency, communicative value, contrast, profiles, and demonstrated learner
needs rather than mirror a raw corpus.

## 16. Content and implementation checklist

- [ ] Target is adult general Spanish, approximately A1–early B1, with no
      certification claim.
- [ ] The shared core and every variety profile are explicit and versioned.
- [ ] Profiles model independent features rather than a Spain/Latin-America
      binary.
- [ ] `seseo/distinción`, `yeísmo`, address systems, past preferences, and
      object-pronoun norms are never ranked as accents of intelligence.
- [ ] All lexemes/forms/constructions come from reviewed licensed data.
- [ ] Gender, number, stress, pronunciation, argument structure, and
      preposition government are stored, not guessed.
- [ ] Past aspect is timeline/viewpoint-based; compound-perfect use is
      profile-sensitive.
- [ ] `ser/estar/hay` is construction/sense-based, not permanent/temporary.
- [ ] Subjunctive is selected from semantics/discourse, not trigger words alone.
- [ ] Personal `a` does not determine direct versus indirect role.
- [ ] Clitics use typed roles, cluster grammar, host placement, and referents.
- [ ] Each `se` construction has a separate model.
- [ ] Register/address rewrite preserves facts and one coherent paradigm.
- [ ] No free translation, essay, conversation, or vague similarity grading.
- [ ] All licensed order/profile/punctuation variants promised by a prompt are
      accepted and explained.
- [ ] Audio is local, licensed, multi-speaker/profile, and human-reviewed.
- [ ] Recording stays local and receives no bogus pronunciation/accent score.
- [ ] Reading/listening items retain evidence and entailment annotations.
- [ ] Contexts are fictional/licensed, inclusive, and not cultural trivia.
- [ ] Distractors have named misconceptions; audits have one root fault.
- [ ] Seeds reproduce prompt, profile, answer, variants, audio, and explanation.
- [ ] Accessibility covers characters, diagrams, ordering, audio, and profiles.
- [ ] The app works as standalone HTML/JS/CSS without backend/network access.

## 17. Stable IDs and recommended navigation

Use language-neutral stable IDs:

```text
spanish-language/<category-id>/<family-id>/<schema-version>
```

Persist seed, generator/data/profile versions, lexeme/sense IDs, semantic frame,
feature bundles, accepted-answer policy, audio ID, and fault ID. Increment schema
or data version whenever a content change could alter the keyed answer.

Recommended learner navigation:

1. **Sounds & Spelling**
2. **Words & Noun Phrases**
3. **Verbs & Time**
4. **Pronouns & Sentence Structure**
5. **Connected Spanish**
6. **Reading, Listening & Interaction**

Filters may expose level, family, modality, input mode, primary/receptive
profile, register, vocabulary domain, and “review my errors.” Developer terms
such as “possible-world model” and “clitic automaton” stay out of learner labels.
