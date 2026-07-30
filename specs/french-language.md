# French Language — Dynamic Practice Specification

Status: implementation specification

Audience: exercise generator, linguistic-content editor, French morphology and
syntax engine, semantic answer checker, text/audio renderer, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their
usual normative meanings.

## 1. Topic overview

### Topic name

French Language

### Topic goal

Develop beginner-to-lower-intermediate communicative French by repeatedly
connecting sound, spelling, vocabulary, morphology, syntax, reading, listening,
controlled writing, and guided speaking. The learner should become able to:

- decode and type contemporary French orthography, including accents, cedilla,
  ligatures where present, apostrophes, hyphens, and punctuation;
- connect written forms to oral vowels, nasal vowels, consonants, silent
  letters, schwa, liaison, enchaînement, and rhythmic groups in reviewed profiles;
- retrieve nouns with gender and plural behavior and control determiner,
  adjective, possessive, demonstrative, and participial agreement;
- choose definite, indefinite, partitive, zero, quantity, negated, and
  contracted article/preposition constructions;
- conjugate frequent regular and irregular verbs through practical present,
  past, future, conditional, imperative, and selected subjunctive forms;
- distinguish `passé composé` and `imparfait` from event viewpoint rather than
  English tense labels;
- choose `avoir/être`, construct pronominal verbs, and apply the exact
  past-participle agreement rule for the item;
- select and order subject, tonic, direct, indirect, reflexive, `y`, and `en`
  pronouns;
- form negation, declarative and several interrogative styles, relative clauses,
  comparison, and common subordinate relationships;
- distinguish `c'est/ce sont`, `il/elle est`, existential `il y a`, and reviewed
  impersonal constructions;
- use coherent `tu/vous` address, politeness, register, and medium;
- understand short reviewed texts and recordings, exchange routine information,
  and rehearse useful utterances;
- recognize standard variation across France, Belgium, Switzerland, Canada, and
  the wider Francophonie without ranking accents or erasing local standards.

The endpoint is practical form–meaning control. Grammar labels support
explanation; they are not the primary learning objective.

### Audience and level boundary

The app starts before pronunciation/spelling mastery and extends through
practical A1, A2, and selected early-B1 objectives. These labels guide exercise
complexity; the app does not certify CEFR/CECR, DELF, TCF, TEF, school,
immigration, or professional proficiency.

- **Foundation:** decoding, spelling, fixed expressions, nouns with articles,
  core present forms, and simple statements/questions.
- **A1-oriented:** descriptions, routines, needs, numbers/time/prices,
  directions, basic pronouns, and short interaction.
- **A2-oriented:** past narration, object pronouns, adjective/article contrasts,
  comparisons, instructions, and connected messages.
- **Early-B1-oriented:** aspect, pronoun clusters, relative/subordinate clauses,
  future/conditional/subjunctive frames, discourse/register, short inference,
  and cross-profile comprehension.

The Council of Europe [CEFR Companion
Volume](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions)
informs reception, production, interaction, mediation, and phonological
competence. [France Éducation international's DELF B1
description](https://www.france-education-international.fr/diplome/delf-tout-public/niveau-b1)
helps bound practical communicative domains; this app is not DELF preparation.

### Reference and language-data boundary

Reference anchors include:

- the Académie française overview of traditional and [1990 rectified
  orthography](https://www.academie-francaise.fr/le-dictionnaire/la-9e-edition);
- the Office québécois de la langue française (OQLF) account of [orthographic
  variants](https://vitrinelinguistique.oqlf.gouv.qc.ca/24659/lorthographe/cas-particuliers-lies-a-lorthographe/les-variantes-orthographiques);
- the OQLF statement that its resources describe [contemporary standard French
  as used in Québec](https://vitrinelinguistique.oqlf.gouv.qc.ca/a-propos-de-la-vitrine-linguistique/foire-aux-questions);
- the Organisation internationale de la Francophonie's emphasis on the
  [diversity of French and its linguistic
  settings](https://parlonsfrancais.francophonie.org/diversites/).

Reference pages are not corpora to copy. Bundled lexicons, recordings, frequency
lists, or paradigms require compatible licenses, provenance, versioning, and
human review. Attestation alone does not establish learner level, sense,
register, region, valency, or idiomaticity.

### Standard-variety and usage policy

French is pluricentric. Use a common standard core and explicit profiles:

```text
VarietyProfile {
  id
  geographicScope
  productionBaseline
  orthographyPolicy
  pronunciationTargets[]
  lexicalPreferences[]
  grammaticalVariants[]
  numberDateTimeConventions
  addressRegisterConventions[]
  acceptedAlternatives[]
}
```

- Production prompts declare a profile whenever it changes the answer.
- Traditional and accepted 1990-rectified spellings are tracked as variants;
  prompts testing one profile say so.
- Standard usages from Québec/Canada, Belgium, Switzerland, France, and other
  reviewed regions are labeled by scope, not “corrected” toward Paris.
- Numbers such as 70/80/90, meals, dates, vocabulary, interrogative patterns,
  pronunciation, and register are independent profile dimensions—not a single
  country switch.
- A learner selects a primary production profile and may practice receptive
  understanding of others.
- Familiar spoken forms can be accepted for comprehension while a formal-writing
  prompt requests its declared standard.
- Dialect generation and accent imitation are outside core scope.

Every realization is classified as:

1. **canonical target** — selected teaching form for this profile/context;
2. **accepted variant** — standard and meaning/register-compatible here;
3. **profile-different** — standard in another reviewed profile;
4. **contextually different** — grammatical but changes reference, tense
   viewpoint, focus, politeness, or implication;
5. **non-target/nonstandard** — outside the requested production norm/register;
6. **incorrect** — incompatible spelling, morphology, syntax, or semantics.

Feedback must distinguish these. A profile difference is not “bad French.”

### Scope

Included:

- contemporary standard sound–spelling, elision, liaison, capitalization, and
  common punctuation;
- adult everyday vocabulary through selected early B1;
- two genders, singular/plural, articles/determiners, adjectives, possession,
  quantification, and common prepositions;
- high-frequency regular/irregular/pronominal verbs, auxiliaries, periphrases,
  practical tenses/moods, passive/causative recognition;
- subject, object, tonic, reflexive, `y/en`, relative, demonstrative, and
  indefinite pronouns in a controlled subset;
- statement/question/negation patterns and common subordinate clauses;
- practical numbers, ordinals, dates, times, prices, addresses, telephone
  groups, measures, and quantities;
- short reading/listening, constrained writing, dialogue, mediation, and guided
  local recording;
- receptive exposure to reviewed standard profiles.

Expected prior knowledge:

- no French at Foundation;
- ability to read a Latin-script interface;
- grammar terminology is introduced visually before use;
- later families require only the dependencies stated in progression notes.

### Exclusions

- unrestricted translation, essays, free conversation, and vague semantic
  similarity grading;
- automated accent/profile detection or pronunciation scoring;
- comprehensive dialectology, slang generation, or accent imitation;
- historical French, literary past tenses as productive core, and advanced
  stylistic inversion;
- exhaustive liaison theory, phonetic transcription, or phonological analysis;
- exhaustive participle-agreement controversies, rare subjunctive tenses,
  advanced clitic climbing, or legalistic grammar edge cases;
- open literary interpretation, humor, irony, and culturally dense implicature;
- raw vocabulary flashcards without context, collocation, morphology, or sound;
- specialist/high-stakes medical, legal, immigration, and emergency content;
- live transport, law, price, or political information.

### Orthography, pronunciation, and input conventions

- Internal text is Unicode NFC.
- Render/input `à â æ ç é è ê ë î ï ô œ ù û ü ÿ` and uppercase equivalents.
- Accents and cedilla are meaningful; do not strip them for spelling mastery.
- `œ` versus `oe` follows lexical/orthographic policy; a fallback keyboard may
  be offered but fallback does not automatically count as orthographic mastery.
- Apostrophe/elision, hyphenation in inversion/imperatives, and spaces before
  some punctuation depend on the declared typographic profile.
- Traditional and rectified spellings remain separately tagged accepted forms
  where applicable.
- `h muet` and `h aspiré` behavior is lexical data. The written `h` itself is
  silent in core profiles, but only `h muet` permits elision/liaison.
- Liaison is tagged as required, optional, forbidden, or outside the taught
  target per construction/profile.
- Pronunciation tasks use audio or ordinary spelling where possible; IPA is
  optional and never assumed.
- Grammatical terms may pair French and interface labels: `passé composé`,
  `imparfait`, `complément d'objet direct (COD)`, and so on.

### Lexical and grammatical data model

```text
Lexeme {
  id
  lemma
  partOfSpeech
  senses[]
  gender?
  pluralForms[]
  adjectiveClass?
  verbClass?
  principalParts[]
  paradigmForms[]
  auxiliaryFrames[]
  participleAgreementFrames[]
  pronominalFrames[]
  argumentFrames[]
  prepositionFrames[]
  elisionClass?
  hClass?
  liaisonBehavior[]
  pronunciations[]
  semanticTags[]
  collocations[]
  frequencyBand
  learnerLevel
  register
  varietyScope[]
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
  tenseAspectMoodProfile
  liaisonElisionProfile
  wordOrderOptions[]
  registerProfile
  varietyScope[]
  acceptedRealizations[]
}
```

Gender, plural, adjective placement/sense, verb stem, auxiliary, pronominal
status, valency, `h` class, liaison, stress/prosody, and regional scope are
lexical/construction data. Do not infer them from final letters or an English
gloss.

### Article, clitic, and agreement policy

- Determination is generated from reference, countability, quantity, polarity,
  possession, genericity, and construction before surface article contraction.
- `du/de la/des` can be partitive/indefinite quantity or `de + definite article`;
  the semantic parse keeps these distinct.
- Clitics are typed by role/person/gender/number and ordered by host/polarity:

```text
Clitic {
  role
  person
  number
  gender?
  reflexivity?
  referentId
}

CliticHost {
  hostType       // finite, infinitive, affirmative imperative
  polarity
  tenseMood
  construction
}
```

- `y` and `en` have typed locative/prepositional/partitive/quantity roles; they
  are not taught as one-word English translations.
- Past-participle agreement stores auxiliary, subject, direct-object position,
  pronominal construction, and exceptional construction. Generate only reviewed
  cases with a determinate policy.
- Inclusive-writing conventions are outside automatic morphology generation
  unless a specific, versioned profile is deliberately added; do not improvise
  midpoint forms.

### Verb, tense, and mood policy

- Generate finite forms from reviewed paradigms/rules plus irregular overrides.
- Separate form-production from tense/mood selection.
- Past items store event boundaries, state, repetition, background, foreground,
  result, interruption, and viewpoint.
- `passé composé` versus `imparfait` is not “short versus long” or “completed
  versus incomplete” without a modeled viewpoint.
- `être/avoir` selection is sense/construction-specific.
- Subjunctive selection uses desire, influence, evaluation, necessity, emotion,
  nonassertion, specificity, concession, or prospectivity—not trigger words
  alone.
- Near future, recent past, and progressive are typed periphrases.
- Passive and `faire + infinitif` are bounded construction families rather than
  a general transformation engine.

### Vocabulary and content policy

- Use a reviewed learner lexicon organized by sense/domain.
- Introduce nouns with article/gender and plural; verbs with principal forms,
  auxiliary, and government where useful.
- Each new item includes pronunciation, collocation, example, level, profile,
  and source status.
- False friends/near-synonyms require determining context.
- Names, businesses, addresses, notices, schedules, and prices are fictional.
- Francophone settings should be varied and specific without requiring trivia.
- Cognates may reduce load but cannot dominate.

### Global answer conventions

- Trim surrounding whitespace and collapse repeated spaces unless assessed.
- Normalize Unicode to NFC; preserve accents, cedilla, ligatures, apostrophes,
  and meaningful hyphens.
- Straight/curly apostrophes may normalize when typography is not the target.
- Case and terminal punctuation normalize only if not assessed.
- Typographic spacing before punctuation follows the displayed profile; input
  may normalize nonbreaking/ordinary spaces when spacing itself is not tested.
- Choices/order compare stable IDs.
- Text answers are parsed only within the promised constrained grammar and
  compared by features/enumerated realizations.
- Optional subject repetition, interrogative style, and constituent order are
  accepted only if they preserve requested register/information structure.
- Profile-different standard forms receive accurate feedback and are tracked
  separately from target-profile production mastery.
- Numbers/dates/times state accepted digit/word/profile formats.
- “Almost correct” diagnoses one local mismatch but is not mastery success.

### Response modes

- single/multiple choice;
- matching/categorization;
- ordered tokens with keyboard alternative;
- short constrained text;
- paradigm/table cells;
- multiple named fields;
- timeline/role/reference selection;
- sentence–picture matching;
- audio discrimination/transcription;
- local recording with model/self-assessment;
- fault diagnosis plus correction.

Every prompt says whether it tests recognition, production, spelling,
pronunciation, agreement, reference, tense/mood selection, word order,
comprehension, or profile awareness.

### Difficulty philosophy

Difficulty grows through:

- recognition→production and reduced scaffolding;
- less transparent lexemes after a grammatical operation is stable;
- interacting agreement, article, auxiliary, clitic, tense/mood, and reference
  dependencies;
- longer dependency distance;
- meaningful contrasts among plausible forms/registers;
- connected discourse and cross-modal transfer;
- receptive variation after a production profile is stable;
- delayed retrieval and controlled mixing.

Do not use tiny typography, noisy/fast audio, rare exceptions, trivia, huge
numbers, arbitrary time pressure, long typing, or ambiguous context.

### General generation and rejection rules

Every instance must:

- reproduce from seed plus data/generator/profile version;
- begin from semantic, orthographic, phonological, or discourse source;
- use reviewed lexemes/constructions;
- derive determination, roles, agreement, clitics, aspect/mood, and order before
  surface realization;
- have one determinate task or explicit finite accepted set;
- supply enough context for tense, referent, liaison/elision, register, and
  profile;
- record misconception behind each distractor;
- reject answer collisions, ambiguity, unnatural combinations, lexical overload,
  and cosmetic-only variation;
- archive source features and explanation data.

Audit families generate a valid item, inject exactly one logged root error, and
verify that removing it restores all invariants.

## 2. Category: Sound, spelling, elision, liaison, and punctuation

### Category purpose

Build a reliable two-way relationship between written and spoken French while
making lexical and profile limitations explicit. Listening practice should
develop intelligibility and recognition, not enforce one accent.

### Learn-card content

- Written vowel combinations and accents guide pronunciation but leave lexical
  exceptions.
- Nasal vowels depend on vowel+nasal-consonant environment and syllable/
  morphological structure.
- Many final consonant letters are silent, but some are pronounced and
  morphology can reveal alternations.
- Schwa (`e` caduc) behavior varies by context, rate, and profile.
- Enchaînement resyllabifies an always-pronounced consonant; liaison introduces
  a latent consonant in licensed contexts.
- `h muet` allows elision/liaison; `h aspiré` blocks them.
- French rhythm groups words and normally places prominence near group end;
  lexical English-style stress is a poor model.
- Apostrophes and hyphens encode grammatical structure.

### Common misconceptions

- Read every letter separately.
- Every `e` has one sound or must be pronounced.
- Any vowel followed by `n/m` is automatically nasal.
- Every final consonant is silent.
- Liaison is always elegant and therefore always correct.
- Liaison and enchaînement are the same operation.
- Written `h` determines behavior from spelling alone.
- Every vowel-to-vowel boundary elides.
- Accents can be omitted because speakers hear context.
- French stress distinguishes ordinary words like English stress.

### Family `alphabet_diacritic_name`

**Task/purpose.** Recognize/produce French letter names and diacritic/ligature
identities. **Response/template.** Audio/text matching, spelling code, or
character selection. **Derivation.** Reviewed inventory/profile audio.
**Difficulty.** L1 common letters; L2 accented characters/cedilla; L3
ligature/letter-name confusions; L4 multi-speaker spelling.
**Distractors/constraints.** Accents are not alphabet-order letters; fictional
codes only. **Feedback.** Character, name, example.
**Examples.** identify `é` (L1); select `ç` (L2); spell fictional surname (L3).
**Validation.** Inventory/audio.

### Family `oral_vowel_spelling`

**Task/purpose.** Match common oral vowel sounds to reviewed spellings and
lexemes. **Response/template.** Audio-word match, grapheme classification, or
contextual spelling. **Derivation.** Lexeme pronunciation and grapheme context.
**Difficulty.** L1 stable frequent spellings; L2 `é/er/ez` and `è/ê/ai`; L3
open/closed contrasts by profile; L4 morphological homophones in context.
**Distractors/constraints.** Sound alone cannot choose homophonous spelling;
never rank merged profile contrast. **Feedback.** Highlight grapheme/morpheme.
**Examples.** `été` (L1); `parler/parlez` with grammar cue (L2);
reviewed `brin/brun` profile contrast later, not here (L4).
**Validation.** Lexeme/profile mapping.

### Family `nasal_vowel_environment`

**Task/purpose.** Identify/spell reviewed nasal vowels and recognize when
following `n/m` is pronounced as a consonant instead.
**Response/template.** Audio-word, nasal/oral classification, or grapheme
completion. **Derivation.** Vowel sequence, following consonant/vowel,
morphological boundary, lexeme, and profile determine output.
**Difficulty.** L1 clear word-final patterns; L2 before consonant versus doubled/
vowel-followed nasal; L3 profile mergers; L4 inflection/derivation.
**Distractors/constraints.** Any vowel+n/m nasal, infer one universal vowel
inventory. **Feedback.** Mark vowel nucleus and following environment.
**Examples.** `sans` (L1); `bonne` oral+n consonant (L2);
`un/une` profile-aware contrast (L3). **Validation.** Pronunciation registry.

### Family `consonant_digraph_sound`

**Task/purpose.** Decode/spell frequent `ch, ph, gn, qu, gu, ill`, soft/hard
`c/g`, and reviewed consonant patterns. **Response/template.** Audio/text match,
grapheme choice, or word completion. **Derivation.** Grapheme environment,
lexeme, morphology, and profile yield pronunciation/spelling.
**Difficulty.** L1 `ch/ph/gn`; L2 `c/g/qu/gu`; L3 `ill` lexical behavior; L4
mixed dictation. **Distractors/constraints.** English digraph values, universal
`ill` sound, omit silent `u` by sound. **Feedback.** Environment and lexical
exception. **Examples.** `chat` (L1); `garçon` (L2); `fille/ville` contrast
(L3). **Validation.** Lexeme mapping.

### Family `final_consonant_morphology`

**Task/purpose.** Decide whether a final consonant is pronounced and preserve
lexical spelling using related forms. **Response/template.** Audio-form match,
pronounced/silent choice, or spelling transformation.
**Derivation.** Lexeme/form/profile specifies final segment; feminine/
derivational relation may expose consonant. **Difficulty.** L1 common silent
ending; L2 adjective gender alternation; L3 lexical exceptions/numbers; L4
phrase before liaison context. **Distractors/constraints.** All final consonants
silent, pronounce by remembered acronym as exceptionless.
**Feedback.** Compare paradigm/related forms.
**Examples.** `petit/petite` (L1); silent final in `grand` (L1);
reviewed pronounced-final exception (L3). **Validation.** Lexical form/audio.

### Family `schwa_presence`

**Task/purpose.** Recognize reviewed pronounced/optional/omitted schwa patterns
without treating one rate/profile as the only correct form.
**Response/template.** Audio-text alignment, syllable count by profile, or
variant classification. **Derivation.** Lexeme, consonant environment, rhythmic
group, rate, and profile license variants. **Difficulty.** L2 stable word/
phrase; L3 optional medial/final; L4 compare standard profiles/rates.
**Distractors/constraints.** Spell by schwa presence, label natural deletion
lazy/wrong, generate unreviewed consonant clusters. **Feedback.** Show accepted
pronunciation set and constant spelling. **Examples.** reviewed `petite` (L2);
`je` in careful/connected speech (L3); profile pair (L4).
**Validation.** Human-reviewed audio variants.

### Family `liaison_category`

**Task/purpose.** Classify/produce required, optional, or forbidden liaison in
reviewed constructions. **Response/template.** Audio choice, category, or
pronounced-boundary selection. **Derivation.** Left word/form, right lexical
class/`h`, syntax, register, and profile select status/consonant.
**Difficulty.** L1 required determiner/pronoun contexts; L2 forbidden after
singular noun/`h aspiré`; L3 optional formal contexts; L4 profile/register.
**Distractors/constraints.** Liaison everywhere before vowel, spelling consonant
value copied unchanged, optional treated mandatory. **Feedback.** Boundary,
status, and linked sound. **Examples.** `les amis` required (L1);
`les héros` forbidden (L2); reviewed optional context (L3).
**Validation.** Liaison registry/audio.

### Family `enchaînement_vs_liaison`

**Task/purpose.** Distinguish resyllabification of an always-pronounced consonant
from liaison of a latent consonant. **Response/template.** Process label,
boundary diagram, or audio comparison. **Derivation.** Lexical pronunciation
without following vowel determines whether consonant is underlyingly audible.
**Difficulty.** L2 clear enchaînement; L3 contrast with required liaison; L4
profile/rhythm. **Distractors/constraints.** Both called liaison, decide from
spelling boundary alone. **Feedback.** Compare isolated/connected forms.
**Examples.** `avec elle` enchaînement (L2); `les amis` liaison (L2);
matched pair (L3). **Validation.** Isolated/phrase audio.

### Family `h_elision_liaison_class`

**Task/purpose.** Retrieve `h muet/h aspiré` behavior for reviewed words and
apply article/elision/liaison rules. **Response/template.** Article form,
liaison choice, or lexical classification. **Derivation.** Lexeme's `hClass`
controls boundary behavior. **Difficulty.** L1 frequent `h muet`; L2 frequent
`h aspiré`; L3 plural/adjective boundary; L4 unfamiliar reviewed item with
dictionary cue. **Distractors/constraints.** Infer from etymology/spelling,
pronounce `h`, apply elision universally. **Feedback.** Lexical class and
boundary result. **Examples.** `l'homme` (L1); `le héros/les héros` (L2);
`un bel homme/un beau héros` (L3). **Validation.** Lexeme registry.

### Family `rhythmic_group_prominence`

**Task/purpose.** Segment a short utterance into rhythmic groups and locate
ordinary phrase-final prominence. **Response/template.** Boundary/prominence
selection, audio matching, or chunk ordering. **Derivation.** Syntactic/
information structure and authored prosody define groups.
**Difficulty.** L2 one phrase; L3 two groups/clitic sequence; L4 contrastive
focus explicitly cued. **Distractors/constraints.** One lexical stress per word,
use loudness alone, accept arbitrary pauses. **Feedback.** Group brackets and
prominent final syllable. **Examples.** short noun phrase (L2); subject+predicate
groups (L3); contrastive correction (L4). **Validation.** Human prosody review.

### Family `accent_cedilla_spelling`

**Task/purpose.** Choose required accent/cedilla from lexical form, pronunciation,
and morphology. **Response/template.** Character insertion, correct spelling, or
minimal-pair meaning. **Derivation.** Lexeme/inflected form and orthography
profile select diacritic. **Difficulty.** L1 `é/è/ç`; L2 `ê/ë/ï/ù`; L3
grammatical homophones; L4 traditional/rectified variant.
**Distractors/constraints.** Treat accent as optional emphasis, infer solely
from audio when homophonous. **Feedback.** Lexical/morphological reason.
**Examples.** `français` (L1); `où/ou` (L2); `dû/du` context (L3).
**Validation.** Orthographic entry/profile.

### Family `elision_apostrophe`

**Task/purpose.** Apply/withhold elision and apostrophe in reviewed article,
pronoun, conjunction, and negation contexts. **Response/template.** Contracted
form, boundary choice, or correction. **Derivation.** Left morpheme, following
phonological onset/`hClass`, construction, and profile determine elision.
**Difficulty.** L1 `le/la→l'`; L2 `je/me/te/se/ne/que`; L3 fixed exceptions/
`h aspiré`; L4 clitic sequences. **Distractors/constraints.** Elide any final
vowel, insert spaces around apostrophe, ignore `h aspiré`.
**Feedback.** Show underlying forms and boundary rule.
**Examples.** `l'école` (L1); `j'arrive` (L2); `je le vois` no applicable vowel
boundary (L3). **Validation.** Elision engine.

### Family `hyphen_inversion_imperative`

**Task/purpose.** Place hyphens and epenthetic `-t-` in reviewed inversion and
affirmative-imperative pronoun structures. **Response/template.** Correct
spelling/token assembly or transformation. **Derivation.** Host type, subject/
object pronoun, verb ending, and phonotactics select hyphenation/`-t-`.
**Difficulty.** L2 simple inversion; L3 `-t-` and affirmative imperative; L4
multiple imperative pronouns. **Distractors/constraints.** Add `t` as a pronoun,
apostrophe instead of hyphen, apply to `est-il`.
**Feedback.** Host–pronoun structure and epenthetic status.
**Examples.** `Parlez-vous...?` (L2); `A-t-il...?` (L3);
`Donne-le-moi` (L4). **Validation.** Host grammar.

### Family `orthographic_variant_profile`

**Task/purpose.** Recognize/convert reviewed traditional and rectified spellings
or regional typographic variants without changing meaning.
**Response/template.** Variant classification, profile conversion, or shared
meaning match. **Derivation.** Versioned orthographic entry lists accepted
forms/scope. **Difficulty.** L2 familiar pair; L3 compound/accent pair; L4 short
profiled text. **Distractors/constraints.** Invent rectification by analogy,
claim only one accepted system is literate. **Feedback.** Variant status and
rule scope. **Examples.** `août/aout` where accepted (L2);
`événement/évènement` profile data (L3); reviewed compound pair (L4).
**Validation.** Versioned orthography registry.

### Family `spelling_from_audio`

**Task/purpose.** Transcribe a reviewed word/phrase using grammar/context to
resolve silent-letter and homophone spelling. **Response/template.** Text with
replay and optional semantic cue. **Derivation.** Audio links transcript,
lexemes/forms, profile, and targeted distinctions.
**Difficulty.** L1 transparent word; L2 accent/final letter; L3 homophone with
grammar context; L4 short liaison-bearing phrase.
**Distractors/constraints.** No impossible bare-audio homophone; no noisy/speed
difficulty. **Feedback.** Align sound, morpheme, agreement, spelling.
**Examples.** `café` (L1); `petite` (L2); contextual `a/à` (L3).
**Validation.** Human-reviewed alignment.

### Family `sound_spelling_audit`

**Task/purpose.** Diagnose one sound–spelling, accent, elision, liaison,
hyphenation, or profile fault. **Response/template.** Root cause, correction,
and rule/profile. **Derivation.** Mutate one feature of a valid item.
**Difficulty.** L1 accent/grapheme; L2 elision/final consonant; L3 liaison/
hyphen; L4 profile/connected phrase. **Distractors/constraints.** One root;
mutation cannot create another accepted variant.
**Feedback.** Correct boundary/form with decisive condition.
**Examples.** missing accent (L1); `l'héros` (L2); liaison across forbidden
boundary (L3). **Validation.** Fault manifest.

### Cross-family progression

Letters/oral vowels precede nasal/digraph/final-consonant patterns. Lexical sound
forms precede schwa and connected-speech processes. `h` class precedes mixed
elision/liaison. Accents/apostrophes precede inversion/imperative hyphens.
Profile variants, dictation, and audits combine only introduced distinctions.

## 3. Category: Vocabulary, noun phrases, articles, and prepositions

### Category purpose

Build context-sensitive noun phrases from reference, quantity, gender, number,
and adjective meaning. Learners retrieve lexical gender/plural and reason about
article systems instead of translating English “a/the/some” word by word.

### Learn-card content

- Learn a noun with an article/gender and plural; endings are tendencies, not a
  complete prediction system.
- Determiners/adjectives agree in gender and number when their paradigm marks
  those features; spelling and pronunciation may expose different distinctions.
- Adjective placement is lexical and semantic. Some common adjectives tend to
  precede the noun; some change nuance by position.
- Definite articles can express specific, generic, possessed-body-part, weekday,
  and other reviewed constructions.
- Partitives express an unspecified quantity; `de` replaces many indefinite/
  partitive forms after quantity and in selected negative constructions.
- `à/de + le/les` contract; `à/de + la/l'` do not.
- Possessives agree with the possessed noun, not the possessor; before a
  vowel/`h muet`, feminine singular uses forms such as `mon amie`.
- Preposition government belongs to the lexeme/construction.

### Common misconceptions

- Final `-e` guarantees feminine.
- Natural sex always determines grammatical gender.
- Add `-s` to every plural without spelling exceptions.
- Adjective feminine/plural is always audibly different.
- All adjectives can go before or after without changing meaning.
- Definite/indefinite articles copy English.
- `du` always means “some.”
- Any negation changes every article to `de`.
- Possessive agrees with possessor.
- `au` can be expanded as `à la`.
- One English preposition has one French equivalent.

### Family `contextual_vocabulary`

**Task/purpose.** Retrieve a reviewed lexeme/sense from picture, definition,
features, or short context. **Response/template.** Choice, matching, or lemma/
form. **Derivation.** Semantic/selectional constraints select one target sense.
**Difficulty.** L1 concrete frequent word; L2 routine verb/adjective; L3
near-synonym/false friend; L4 profile/register choice.
**Distractors/constraints.** Same field but wrong defining feature; no trivia.
**Feedback.** Noun article/plural or verb forms/government plus collocation.
**Examples.** picture→`la clé` (L1); `savoir/connaître` (L2);
`actuellement` false-friend context (L3). **Validation.** Authored sense frame.

### Family `collocation_phrase`

**Task/purpose.** Complete frequent collocations, light-verb expressions, and
routine chunks. **Response/template.** Word/preposition choice, matching, or
assembly. **Derivation.** Sense/register/profile select reviewed collocation.
**Difficulty.** L1 fixed phrase; L2 verb+noun/preposition; L3 competing
collocations; L4 profile/register variant.
**Distractors/constraints.** Literal calque, related noncollocate.
**Feedback.** Whole chunk and contrast.
**Examples.** `avoir faim` (L1); `prendre une décision` (L2);
`se rendre compte de` (L3). **Validation.** Collocation registry.

### Family `noun_gender`

**Task/purpose.** Retrieve grammatical gender for a noun sense and compatible
determiner. **Response/template.** Gender/article choice or classification.
**Derivation.** Lexeme/sense supplies gender; reviewed suffix clues are
explanatory, not generative truth. **Difficulty.** L1 frequent transparent
patterns; L2 mixed endings; L3 homonym/meaning contrasts; L4 profile variation.
**Distractors/constraints.** Last-letter/natural-sex/interface-language gender.
**Feedback.** Article+noun+plural and pattern/exception.
**Examples.** `la maison` (L1); `le problème` (L2);
meaning-sensitive homonym from registry (L3). **Validation.** Lexeme sense.

### Family `noun_plural`

**Task/purpose.** Produce/recognize plural spelling and pronunciation for common
classes. **Response/template.** Typed form, transformation, or audio-form match.
**Derivation.** Lexeme plural class/profile yields `-s`, `-x`, spelling change,
or invariant form and pronunciation. **Difficulty.** L1 regular silent `-s`; L2
`-eau/-al` patterns; L3 exceptions/loans; L4 profile/meaning variants.
**Distractors/constraints.** Audible `s` universally, regularize every `-al`,
infer unreviewed plural. **Feedback.** Singular/plural written+audio.
**Examples.** `livre→livres` (L1); `cheval→chevaux` (L2);
reviewed exception (L3). **Validation.** Paradigm.

### Family `adjective_gender_form`

**Task/purpose.** Form/interpret adjective masculine/feminine with spelling and
sound alternations. **Response/template.** Form, matching, or phrase completion.
**Derivation.** Adjective class+gender yields suffix, consonant doubling,
accent/stem change, or invariant form. **Difficulty.** L1 `-e`; L2 consonant/
doubling; L3 irregular/invariant; L4 audio-written mismatch.
**Distractors/constraints.** Add `-e` mechanically, assume all feminine forms
sound distinct. **Feedback.** Stem/class and pronounced difference.
**Examples.** `petit/petite` (L1); `bon/bonne` (L2);
`beau/belle` (L3). **Validation.** Paradigm/audio.

### Family `adjective_number_form`

**Task/purpose.** Form adjective plurals and coordinate agreement with one or
more heads. **Response/template.** Form, agreement target, or sentence
completion. **Derivation.** Adjective class, head gender/number, and coordination
policy yield form. **Difficulty.** L1 regular `-s`; L2 `-x`/invariant sound; L3
coordinated mixed heads; L4 position/class interaction.
**Distractors/constraints.** Agree with nearest noun, omit silent marking,
pronounce final plural consonant universally. **Feedback.** Agreement arcs.
**Examples.** `des maisons blanches` (L1); `des prix élevés` (L2);
coordinated plural adjective (L3). **Validation.** Dependency agreement.

### Family `adjective_position_meaning`

**Task/purpose.** Select/interpret adjective position for reviewed senses.
**Response/template.** Meaning-order match, phrase choice, or paired paraphrase.
**Derivation.** Lexeme sense, evaluative/restrictive function, and discourse
license positions. **Difficulty.** L2 common pre/post tendencies; L3 meaning-
changing pairs; L4 multiple adjectives/context.
**Distractors/constraints.** BAGS as exceptionless, claim all positions change
meaning, accept unlicensed order. **Feedback.** Paraphrase each position.
**Examples.** `une maison blanche` (L1); `un grand homme/un homme grand` (L3);
`mon ancien professeur` (L3). **Validation.** Sense-position registry.

### Family `definite_article_use`

**Task/purpose.** Choose `le/la/l'/les` or zero in specific, generic, body-part,
language, weekday, title, and reviewed constructions.
**Response/template.** Article/zero choice or meaning contrast.
**Derivation.** Reference, construction, gender/number, and onset determine form.
**Difficulty.** L1 specific/generic; L2 elision/plural; L3 body part/language/
weekday; L4 discourse contrast. **Distractors/constraints.** English transfer,
omit generic article, elide before `h aspiré`.
**Feedback.** Reference/construction plus onset.
**Examples.** `J'aime le café` generic (L1); `l'école` (L1);
`le lundi` habitual (L3). **Validation.** Determination model.

### Family `indefinite_partitive_article`

**Task/purpose.** Select `un/une/des`, `du/de la/de l'`, or zero from
countability, boundedness, and construction. **Response/template.** Article
choice, quantity/picture match, or phrase completion.
**Derivation.** Count/mass, number, specificity, quantity, and predicate frame
select article. **Difficulty.** L1 singular count; L2 mass/plural; L3 profession/
predicate/modified noun contrasts; L4 discourse reference.
**Distractors/constraints.** English “some,” use partitive with count singular,
confuse `des` plural indefinite with `de+les`.
**Feedback.** Countability/reference graph.
**Examples.** `un livre` (L1); `du pain` (L2); `des pommes` (L2).
**Validation.** Determination frame.

### Family `de_quantity_negation`

**Task/purpose.** Choose bare `de/d'` versus retained article after quantity and
selected negation. **Response/template.** Form choice, transformation, or
meaning match. **Derivation.** Quantity expression, polarity, verb (`être`
exception patterns), contrastive scope, and onset determine form.
**Difficulty.** L2 quantity; L3 neutral negation; L4 contrastive/`être`/
lexicalized exceptions. **Distractors/constraints.** Any negation→`de`, retain
partitive after quantity, apply to definite article.
**Feedback.** Show quantity/polarity scope and underlying noun phrase.
**Examples.** `beaucoup de livres` (L2); `Je n'ai pas de pain` (L2);
`Ce n'est pas du pain` (L3). **Validation.** Construction/polarity.

### Family `a_de_article_contraction`

**Task/purpose.** Form/expand `au/aux/du/des` while distinguishing them from
partitive/indefinite homographs. **Response/template.** Contraction, expansion,
or semantic parse. **Derivation.** Preposition role+definite article gender/
number/onset select form; semantic source disambiguates surface.
**Difficulty.** L1 `à+le/de+le`; L2 plural and noncontractions; L3 `du/des`
semantic ambiguity; L4 profile/fixed expression.
**Distractors/constraints.** `à la→au`, treat every `du` as partitive, split
required contraction. **Feedback.** Underlying morphemes and relation.
**Examples.** `à le→au` (L1); `de les→des` (L2);
`Je parle du livre` versus `Je mange du pain` (L3). **Validation.** Semantic
parse+contraction.

### Family `possessive_determiner`

**Task/purpose.** Select possessive determiner from possessor person/number and
possessed noun gender/number/onset. **Response/template.** Form, reference
matching, or phrase completion. **Derivation.** Possessor supplies stem series;
possessed noun supplies agreement; vowel/`h muet` triggers masculine singular
form before feminine noun. **Difficulty.** L1 `mon/ma/mes`; L2 all persons;
L3 `mon amie` onset rule/ambiguous `son`; L4 discourse disambiguation.
**Distractors/constraints.** Agree with possessor, use `ma amie`, infer owner
gender from `son`. **Feedback.** Possessor arrow and possessed agreement.
**Examples.** `ma maison` (L1); `mes livres` (L1);
`mon amie` (L3). **Validation.** Reference/onset paradigm.

### Family `demonstrative_determiner`

**Task/purpose.** Select `ce/cet/cette/ces` and optional `-ci/-là` contrast from
features/reference. **Response/template.** Form, referent match, or phrase.
**Derivation.** Gender/number, phonological onset/`hClass`, and contrastive
reference yield form. **Difficulty.** L1 `ce/cette`; L2 `cet/ces`; L3 `-ci/-là`;
L4 discourse reference/profile. **Distractors/constraints.** `cet` before any
feminine vowel noun, elide to `c'` before noun.
**Feedback.** Feature/onset and referent.
**Examples.** `ce livre` (L1); `cet homme` (L2);
`ces maisons-ci` (L3). **Validation.** Paradigm/reference.

### Family `indefinite_quantifier_agreement`

**Task/purpose.** Use common quantifiers/indefinites such as `beaucoup de`,
`peu de`, `chaque`, `tout`, `quelques`, `plusieurs`, `aucun`.
**Response/template.** Form/agreement, quantity match, or scope choice.
**Derivation.** Countability, polarity, gender/number, syntactic role, and scope
select form. **Difficulty.** L1 numeric/simple amount; L2 agreement/`de`; L3
negative/indefinite; L4 scope. **Distractors/constraints.** Plural after
`chaque`, article after quantity, treat `tout` invariant.
**Feedback.** Quantity set and agreement.
**Examples.** `chaque jour` (L1); `quelques idées` (L2);
`aucune réponse` (L3). **Validation.** Quantifier grammar.

### Family `preposition_valency`

**Task/purpose.** Select a preposition licensed by a verb, adjective, noun, or
spatial/temporal construction. **Response/template.** Preposition choice,
matching, or phrase completion. **Derivation.** Lexeme sense/semantic relation
select reviewed frame. **Difficulty.** L1 core place/time; L2 governed verb/
adjective; L3 competing sense/frame; L4 clause complement.
**Distractors/constraints.** Literal English mapping, substitute close verb's
frame. **Feedback.** Whole governing frame.
**Examples.** `penser à` (L2); `parler de` (L2);
`s'intéresser à` (L3). **Validation.** Valency registry.

### Family `number_date_time_price`

**Task/purpose.** Read/write/hear cardinals, ordinals, dates, times, prices,
telephone groups, measures, and ordinary large values under a profile.
**Response/template.** Digits, words, fields, audio match, or secondary
calculation. **Derivation.** Numeric value+unit/profile grammar yields forms,
hyphens, agreement, and display. **Difficulty.** L1 0–100/time; L2 dates/prices/
ordinals; L3 thousands/millions/phones; L4 mixed document/profile comparison.
**Distractors/constraints.** No large arithmetic; model `un/une`, `cent/vingt`
plural, 70–99 profiles, decimal/date conventions.
**Feedback.** Group value and profile realization.
**Examples.** `21→vingt et un` in target profile (L1);
`deux cents/deux cent un` (L2); Belgian/Swiss 70/90 form (L3).
**Validation.** Independent numeric grammar.

### Family `noun_phrase_construction`

**Task/purpose.** Build a complete noun phrase from reference, quantity,
possessor, adjective sense/position, and preposition.
**Response/template.** Ordered tokens or constrained text.
**Derivation.** Determination→contraction→agreement→position→elision.
**Difficulty.** L1 article+noun; L2 adjective/possessive; L3 quantity/
preposition/two adjectives; L4 profile/reference contrast.
**Distractors/constraints.** Each option breaks one dependency; no arbitrary
translation. **Feedback.** Feature derivation chain.
**Examples.** `une petite maison` (L1); `beaucoup de bons livres` (L3);
`à mon ancienne école` (L3). **Validation.** Back-parse.

### Family `noun_phrase_audit`

**Task/purpose.** Diagnose one lexical, gender, plural, article, `de`,
contraction, agreement, position, possessive, demonstrative, or preposition
fault. **Response/template.** Root cause, correction, meaning effect.
**Derivation.** Mutate one feature after valid noun-phrase realization.
**Difficulty.** L1 gender/plural; L2 article/agreement; L3 contraction/
quantity/position; L4 discourse/profile. **Distractors/constraints.** One root;
accepted variant not mislabeled. **Feedback.** Correct feature tree.
**Examples.** `le maison` (L1); `beaucoup des livres` in intended quantity
reading (L2); `ma amie` (L3). **Validation.** Fault manifest.

### Cross-family progression

Vocabulary introduces gender/plural. Those precede articles and adjective
agreement; form precedes position/meaning. Definite/indefinite/partitive
contrasts precede negation/quantity `de` and contractions. Possessives/
demonstratives/quantifiers follow stable agreement. Complete phrases and audits
combine only introduced dependencies.

## 4. Category: Verb morphology, tense, aspect, mood, and voice

### Category purpose

Make verb forms and constructions retrievable while keeping form production
separate from time/aspect/mood choice. The learner should reason from event and
clause meaning, not translate tense names mechanically.

### Learn-card content

- French verb classes provide useful patterns, but frequency demands a reviewed
  irregular inventory and principal forms.
- Stem spelling may change to preserve sound or reflect lexical alternation.
- Compound tenses use finite `avoir/être` plus Participe passé.
- Pronominal verbs use `être` in compound tenses, but participle agreement still
  depends on the exact argument structure.
- `passé composé` foregrounds/bounds an event; `imparfait` presents state,
  habit, background, or event internally. Viewpoint matters.
- Near future, recent past, and progressive are constructions with specific
  meanings, not substitutes for every tense.
- Present subjunctive is selected by reviewed semantic/discourse environments,
  not by `que` alone.
- Conditional supports future-in-past, polite requests, and hypotheses.
- Passive and causative constructions rearrange semantic roles; they are not
  purely morphological substitutions.

### Common misconceptions

- Every `-er`-looking verb follows one spelling pattern.
- Conjugate by removing any final letters and attaching an ending.
- Every past participle starts with `é`.
- All verbs take `avoir` except reflexives.
- `être` always makes participle agree with the surface subject without
  construction analysis.
- `passé composé` means short and `imparfait` means long.
- `imparfait` means an action never finished.
- Future reference always needs morphological future.
- Any clause after `que` takes subjunctive.
- Conditional is simply English “would.”

### Family `verb_class_principal_forms`

**Task/purpose.** Identify conjugation/irregular class and retrieve principal
forms, auxiliary, and government. **Response/template.** Classification,
matching, or missing form. **Derivation.** Lexeme metadata.
**Difficulty.** L1 regular `-er`; L2 common `-ir/-re`; L3 irregular/pronominal;
L4 sense-dependent frame. **Distractors/constraints.** Class from spelling alone
where exception exists, one English gloss.
**Feedback.** Compact principal-form card.
**Examples.** `parler–parle–parlé` (L1); `finir–finit–fini` (L2);
`prendre–prend–pris` (L3). **Validation.** Paradigm registry.

### Family `present_regular_form`

**Task/purpose.** Produce/recognize present forms of reviewed regular classes.
**Response/template.** Typed form, table cell, or subject match.
**Derivation.** Stem/class+person/number yields written form and pronunciation.
**Difficulty.** L1 `-er` singular; L2 plural and `-ir`; L3 selected `-re`/
sound-identical written endings; L4 contextual retrieval.
**Distractors/constraints.** Infinitive retained, wrong class, spell by sound
without silent endings. **Feedback.** Stem+ending+audio.
**Examples.** `je parle` (L1); `nous finissons` (L2);
`ils vendent` (L3). **Validation.** Paradigm/audio.

### Family `present_stem_spelling_change`

**Task/purpose.** Apply reviewed stem alternations/spelling changes in the
licensed present cells. **Response/template.** Form production, pattern match,
or correction. **Derivation.** Lexeme alternation table+person.
**Difficulty.** L2 `-ger/-cer`; L3 `acheter/appeler/jeter`-type and `y→i`; L4
orthographic-profile variants. **Distractors/constraints.** Change every cell,
regularize by pronunciation only, invent analogy.
**Feedback.** Highlight affected cells and sound preservation.
**Examples.** `nous mangeons` (L2); `nous commençons` (L2);
`j'achète/nous achetons` (L3). **Validation.** Paradigm.

### Family `high_frequency_irregular_present`

**Task/purpose.** Retrieve present forms of high-frequency irregular verbs.
**Response/template.** Form, subject match, or bounded sentence.
**Derivation.** Verified lexeme paradigm.
**Difficulty.** L1 `être/avoir/aller/faire`; L2 `venir/prendre/pouvoir/vouloir`;
L3 `devoir/savoir/voir/mettre`; L4 mixed rapid retrieval.
**Distractors/constraints.** Regularize endings/stems or cross-combine two
paradigms. **Feedback.** Principal form and paradigm pattern.
**Examples.** `nous sommes` (L1); `ils vont` (L1);
`vous pouvez` (L2). **Validation.** Paradigm cell.

### Family `pronominal_verb_present`

**Task/purpose.** Conjugate/interpret reflexive, reciprocal, lexical pronominal,
and meaning-changing pronominal verbs. **Response/template.** Pronoun+verb,
construction label, or assembly. **Derivation.** Subject features and lexical/
semantic frame select reflexive clitic/form.
**Difficulty.** L1 daily reflexive; L2 elision/negation; L3 reciprocal/lexical
contrast; L4 object interaction. **Distractors/constraints.** `se` for all
persons, every pronominal literal reflexive.
**Feedback.** Subject↔pronoun role and stored lemma.
**Examples.** `je me lève` (L1); `nous nous parlons` reciprocal (L2);
`aller/s'en aller` contrast (L3). **Validation.** Pronominal frame.

### Family `imperative_form`

**Task/purpose.** Form affirmative/negative imperatives for `tu/nous/vous`,
including common irregulars. **Response/template.** Command form, polarity
transformation, or address match. **Derivation.** Lemma, person, polarity, and
profile determine verb/pronoun realization. **Difficulty.** L1 regular
affirmative; L2 negative/irregular; L3 clitics/hyphens; L4 pronominal clusters.
**Distractors/constraints.** Overt subject, wrong `-s` policy, same pronoun order
in positive/negative. **Feedback.** Addressee, base, polarity, pronoun order.
**Examples.** `Parle !` (L1); `Ne parlez pas !` (L2);
`Lève-toi !` (L3). **Validation.** Imperative+host grammar.

### Family `near_future`

**Task/purpose.** Build/interpret `aller + infinitif` for planned/imminent/
predicted future and contrast present/future forms.
**Response/template.** Construction, timeline match, or sentence assembly.
**Derivation.** Finite `aller` agrees; lexical predicate remains infinitive;
event frame licenses meaning. **Difficulty.** L1 form; L2 negation/object; L3
near future versus present/future; L4 reported/time context.
**Distractors/constraints.** Conjugate both verbs, add preposition, force near
future for all future reference. **Feedback.** Bracket finite `aller`+infinitive.
**Examples.** `Je vais partir` (L1); `Nous n'allons pas venir` (L2);
plan versus timetable (L3). **Validation.** Periphrasis frame.

### Family `recent_past`

**Task/purpose.** Build/interpret `venir de + infinitif` for recent completion.
**Response/template.** Form, timeline, or contrast with lexical `venir de`.
**Derivation.** Finite `venir`+`de`+infinitive and recent-reference frame.
**Difficulty.** L1 present recent past; L2 negation/pronoun; L3 imperfect
`venait de` relative past; L4 lexical-origin ambiguity with context.
**Distractors/constraints.** Compound tense translation, omit `de`, conjugate
lexical infinitive. **Feedback.** Relative timeline/construction.
**Examples.** `Je viens de manger` (L1); `Elle ne vient pas de partir` (L2);
`Il venait d'arriver quand...` (L3). **Validation.** Frame.

### Family `progressive_en_train_de`

**Task/purpose.** Use/interpret `être en train de + infinitif` for explicitly
ongoing action while contrasting simple present/imperfect.
**Response/template.** Construction choice, scene match, or assembly.
**Derivation.** Finite `être`, current/reference interval, and discourse
emphasis license periphrasis. **Difficulty.** L2 present; L3 past/negation; L4
overuse contrast. **Distractors/constraints.** English progressive mapped
universally, omit `de`. **Feedback.** Event interval and marked ongoing focus.
**Examples.** `Je suis en train de lire` (L2); simple habitual present contrast
(L3); past ongoing emphasis (L3). **Validation.** Event frame.

### Family `past_participle_form`

**Task/purpose.** Produce/recognize Participe passé for regular and frequent
irregular verbs. **Response/template.** Typed form, matching, or morphology.
**Derivation.** Lexeme class/principal-part entry.
**Difficulty.** L1 `-é`; L2 `-i/-u`; L3 irregular `pris/écrit/fait/ouvert`; L4
mixed retrieval. **Distractors/constraints.** `-é` universal, infinitive or
finite past, spelling by sound only.
**Feedback.** Principal parts.
**Examples.** `parlé` (L1); `fini/vendu` (L2); `écrit` (L3).
**Validation.** Paradigm.

### Family `compound_past_auxiliary`

**Task/purpose.** Choose `avoir/être` for a verb sense/construction in compound
tenses. **Response/template.** Auxiliary choice, frame classification, or
paired meaning. **Derivation.** Lexeme sense, transitivity, pronominal status,
and profile select auxiliary. **Difficulty.** L1 clear `avoir`/movement-change
verb; L2 pronominal; L3 transitive/intransitive sense pair; L4 profile/rare
variation only if reviewed. **Distractors/constraints.** “All movement=`être`,”
animate subject heuristic. **Feedback.** Whole principal form/frame.
**Examples.** `a travaillé` (L1); `est arrivé` (L1);
`a sorti le livre / est sorti` (L3). **Validation.** Sense registry.

### Family `passe_compose_sentence`

**Task/purpose.** Build `passé composé` with finite auxiliary, participle, and
correct negation/clitic placement. **Response/template.** Ordered tokens,
multiple fields, or transformation. **Derivation.** Subject+frame determine
auxiliary/participle; host rules place clitics/negation.
**Difficulty.** L1 simple `avoir`; L2 `être`/negation; L3 clitic/pronominal;
L4 subordinate/order context. **Distractors/constraints.** Inflect participle
as finite verb, negate participle, place clitic after auxiliary.
**Feedback.** Auxiliary host+participle diagram.
**Examples.** `J'ai travaillé` (L1); `Elle est arrivée` (L2);
`Je ne l'ai pas vu` (L3). **Validation.** Construction.

### Family `past_participle_agreement`

**Task/purpose.** Apply/interpret agreement in a bounded set: `être`, preceding
direct-object clitic/relative, and reviewed pronominal constructions.
**Response/template.** Participle form, dependency selection, or correction.
**Derivation.** Auxiliary, subject, direct-object identity/position, reflexive
role, and construction determine agreement.
**Difficulty.** L2 ordinary `être`; L3 preceding COD with `avoir`; L4 reviewed
pronominal contrast. **Distractors/constraints.** Agree all `avoir`, agree with
nearest noun, `être`=subject agreement without checking pronominal object.
**Feedback.** Explicit agreement controller and why.
**Examples.** `Elle est arrivée` (L2); `Les lettres que j'ai écrites` (L3);
reviewed `elles se sont parlé` no COD agreement (L4).
**Validation.** Dependency oracle.

### Family `imperfect_form`

**Task/purpose.** Produce/recognize `imparfait` forms.
**Response/template.** Typed cell, stem derivation, or subject match.
**Derivation.** Present `nous` stem minus `-ons` plus imperfect ending, with
reviewed `être` exception and orthographic behavior.
**Difficulty.** L1 regular; L2 all persons; L3 `être`, `-ger/-cer`, `-ier`; L4
contextual retrieval. **Distractors/constraints.** Infinitive stem universally,
preterite/conditional ending, wrong extra `i`.
**Feedback.** Stem source+ending.
**Examples.** `je parlais` (L1); `nous finissions` (L2);
`j'étais` (L2). **Validation.** Paradigm.

### Family `past_aspect_choice`

**Task/purpose.** Choose `passé composé` or `imparfait` from event structure,
viewpoint, narrative role, and intended contrast.
**Response/template.** Tense/form, timeline, or paired interpretation.
**Derivation.** Boundedness, state/habit, background/foreground, overlap,
interruption, and speaker viewpoint license tense.
**Difficulty.** L1 completed event versus habit/state; L2 background+event; L3
same event under changed viewpoint; L4 connected narrative.
**Distractors/constraints.** Short/long, finished/unfinished, keyword-only.
**Feedback.** Event/reference timeline and narrative function.
**Examples.** `Hier, j'ai acheté...` (L1); `Quand j'étais petit...` (L2);
`Il pleuvait quand je suis sorti` (L2). **Validation.** Aspect frame.

### Family `pluperfect_sequence`

**Task/purpose.** Form/interpret `plus-que-parfait` as anterior to a past
reference. **Response/template.** Form, event ordering, or timeline.
**Derivation.** Imperfect auxiliary+participle/agreement policy places event A
before past B. **Difficulty.** L2 explicit events; L3 auxiliary/irregular/
agreement; L4 narrative inference. **Distractors/constraints.** Reverse events,
present auxiliary, ignore agreement.
**Feedback.** Two-level timeline.
**Examples.** `Quand je suis arrivé, il avait fini` (L2);
`elle était partie` (L3); order three events (L4).
**Validation.** Event graph.

### Family `future_form_use`

**Task/purpose.** Produce/interpret simple future and contrast it with present/
near future in reviewed contexts. **Response/template.** Form, timeline, or
register/meaning choice. **Derivation.** Future stem+ending and event discourse
frame. **Difficulty.** L2 regular; L3 irregular stems; L4 prediction/promise/
schedule contrast. **Distractors/constraints.** Infinitive+present ending,
future required for every future time.
**Feedback.** Stem+ending and usage.
**Examples.** `je parlerai` (L2); `il viendra` (L3);
near/simple future contrast (L4). **Validation.** Paradigm/frame.

### Family `conditional_form_use`

**Task/purpose.** Produce/interpret present conditional for requests,
hypothetical results, and future-in-past. **Response/template.** Form, clause
pair, or speech-act match. **Derivation.** Future stem+imperfect ending plus
semantic frame. **Difficulty.** L2 polite fixed forms; L3 hypothesis; L4 future-
in-past/reported plan. **Distractors/constraints.** English `would` universally,
conditional in canonical `si` clause.
**Feedback.** Stem/ending and world/timeline role.
**Examples.** `Je voudrais...` (L2); `Je partirais si...` (L3);
`Il a dit qu'il viendrait` (L4). **Validation.** Paradigm/frame.

### Family `present_subjunctive_form`

**Task/purpose.** Produce/recognize present subjunctive forms independently of
selection. **Response/template.** Typed cell, stem/ending, or matching.
**Derivation.** Reviewed plural/singular stem pattern and irregular paradigm.
**Difficulty.** L2 regular; L3 two-stem verbs and common irregulars; L4 mixed
retrieval. **Distractors/constraints.** Indicative after `que`, infinitive stem
universally, omit stem alternation.
**Feedback.** Stem source+ending.
**Examples.** `que je parle` (L2); `que nous finissions` (L3);
`qu'il soit/ait` (L3). **Validation.** Paradigm.

### Family `subjunctive_selection`

**Task/purpose.** Choose indicative, subjunctive, or infinitive from bounded
semantics/discourse. **Response/template.** Mood/form, context match, or clause
completion. **Derivation.** Assertion, desire/influence, necessity, emotion,
evaluation, specificity, concession, and subject identity select construction.
**Difficulty.** L2 desire/necessity; L3 emotion/nonexistent referent/concession;
L4 same expression under changed assertion/profile usage.
**Distractors/constraints.** `que` trigger, uncertainty only, ignore same-subject
infinitive. **Feedback.** What is asserted/evaluated/desired and subject graph.
**Examples.** `Je veux partir / Je veux que tu partes` (L2);
`Il faut que vous veniez` (L2); specific/non-specific relative (L4).
**Validation.** Semantic construction.

### Family `si_hypothesis_sequence`

**Task/purpose.** Pair tenses/moods in real, hypothetical-present, and
counterfactual-past `si` constructions within bounded scope.
**Response/template.** Clause pairing, timeline/world match, or correction.
**Derivation.** Possible-world status and reference time select
present→present/future/imperative, imperfect→conditional, or
pluperfect→past conditional.
**Difficulty.** L2 real; L3 present hypothesis; L4 past counterfactual.
**Distractors/constraints.** Future/conditional directly after canonical `si`,
mix world levels. **Feedback.** Possible-world timeline.
**Examples.** `Si tu viens, je pars/partirai` (L2);
`Si j'avais le temps, je voyagerais` (L3);
past counterfactual (L4). **Validation.** World/tense model.

### Family `passive_causative`

**Task/purpose.** Distinguish/build simple passive `être + participe` and
reviewed `faire + infinitif` causative structures.
**Response/template.** Construction, role mapping, or sentence transform.
**Derivation.** Event roles and construction promote patient or introduce
causer/causee; tense/agreement/clitics realized from frame.
**Difficulty.** L2 present passive; L3 past/agent; L4 simple causative role/case
recognition. **Distractors/constraints.** State adjective mistaken for event
without context, retain active roles, unrestricted causative clitic complexity.
**Feedback.** Role map.
**Examples.** `Le livre est lu par...` (L2); past passive (L3);
`Je fais réparer la voiture` (L4). **Validation.** Transitivity/frame.

### Family `verb_tense_mood_audit`

**Task/purpose.** Diagnose one conjugation, periphrasis, participle, auxiliary,
agreement, aspect, future/conditional, subjunctive, `si`, or voice fault.
**Response/template.** Root cause, correction, meaning effect.
**Derivation.** Mutate one feature of valid construction.
**Difficulty.** L1 present form; L2 compound/imperfect; L3 agreement/aspect/
mood; L4 hypothesis/voice/profile.
**Distractors/constraints.** One root; valid alternate viewpoint needs different
context and is not mislabeled. **Feedback.** Correct paradigm/timeline/role
graph. **Examples.** wrong auxiliary (L2); imperfect chosen from duration alone
(L3); conditional after `si` in target pattern (L4).
**Validation.** Fault manifest.

### Cross-family progression

Class/principal forms precede present production. Pronominal/imperative forms
precede clitic-rich uses. Periphrases stay separate before tense contrasts.
Participle and auxiliary precede complete compound past; ordinary agreement
precedes preceding-object/pronominal cases. `imparfait` form precedes aspect
choice. Future/conditional forms precede hypotheses. Subjunctive form and
selection remain separate before integration.

## 5. Category: Pronouns, negation, questions, and sentence structure

### Category purpose

Train reference, argument roles, clitic sequencing, negation scope, and
interrogative/relative structure. The generator starts from semantic roles and
discourse so identical surface forms such as `lui`, `en`, `que`, and `ce` are not
treated as context-free translations.

### Learn-card content

- Subject pronouns are normally expressed with finite verbs, but `on`, dummy
  `il`, dislocation, and coordinated/tonic forms require construction-specific
  analysis.
- Tonic pronouns occur after prepositions, in isolation, coordination, and
  contrast/dislocation.
- Direct and indirect clitics encode roles and referents and precede most finite/
  infinitive hosts.
- `y` can replace reviewed `à`/locative phrases; `en` can replace reviewed
  `de`/partitive/quantity phrases. Person restrictions and lexical frames matter.
- Clitic order is slot-based and changes in affirmative imperatives.
- Standard written negation usually surrounds the finite host; conversational
  omission of `ne` is profile/register data.
- Yes/no and wh-questions have several styles: intonation, `est-ce que`,
  inversion, and reviewed formal/colloquial alternatives.
- Relative pronoun choice depends on its role and preposition inside the relative
  clause; antecedent type matters.
- `c'est` identifies/presents; `il/elle est` predicates in different structures.
  The contrast is not merely noun versus adjective.

### Common misconceptions

- French can omit subject pronouns like Spanish/Italian.
- `on` always means exactly English “one.”
- Any pronoun after a preposition uses an object clitic.
- `lui` means masculine “him”; indirect role has no gender contrast.
- `y` means “there” and `en` means “some” in every sentence.
- Put clitics in English object order.
- Affirmative/negative imperatives use the same clitic order/form.
- `pas` alone is always correct in every written register.
- Inversion is required for every question.
- `que` is the universal relative pronoun.
- `c'est` can replace every form of `il/elle est`.

### Family `subject_pronoun_reference`

**Task/purpose.** Select/recover subject pronouns from referent features,
discourse, and verb agreement. **Response/template.** Pronoun choice, referent
match, or sentence completion. **Derivation.** Person/number/gender, address,
coordination, and construction select form. **Difficulty.** L1 singular; L2
plural/`vous`; L3 competing referents/`ils-elles`; L4 dislocation/profile.
**Distractors/constraints.** Omit subject by Romance-language transfer, choose
natural gender without antecedent grammar. **Feedback.** Referent+agreement.
**Examples.** `Marie arrive. Elle...` (L1); polite `vous` (L2);
mixed-group `ils` in declared conventional target (L3).
**Validation.** Reference graph.

### Family `on_nous_meaning_agreement`

**Task/purpose.** Interpret/use `on` for indefinite/general/passive-like or
informal first-person-plural meanings with correct verb and reviewed adjective/
participle agreement. **Response/template.** Meaning match, form choice, or
register rewrite. **Derivation.** Discourse referents, register/profile, and
construction select interpretation and agreement policy.
**Difficulty.** L1 indefinite `on`; L2 conversational `nous` meaning; L3
predicate/adjective agreement; L4 formal rewrite/profile.
**Distractors/constraints.** Plural finite verb after `on`, one English gloss,
assume all profiles/registers use equally.
**Feedback.** Semantic group versus grammatical singular.
**Examples.** `On parle français ici` indefinite (L1);
`On va au cinéma ?` inclusive (L2); rewrite to `nous` (L3).
**Validation.** Discourse/register.

### Family `tonic_pronoun`

**Task/purpose.** Select `moi/toi/lui/elle/soi/nous/vous/eux/elles` after
prepositions, in isolation, coordination, comparison, or contrast.
**Response/template.** Form, referent match, or phrase.
**Derivation.** Referent features+syntactic environment select tonic form.
**Difficulty.** L1 after preposition; L2 coordination/contrast; L3 `soi` and
dislocated clause; L4 ambiguous third person.
**Distractors/constraints.** Use clitic after preposition, subject form after
`avec`, treat `lui` as indirect clitic in all positions.
**Feedback.** Environment and referent.
**Examples.** `avec moi` (L1); `toi et lui` (L2);
`Moi, je préfère...` (L2). **Validation.** Pronoun grammar.

### Family `direct_object_clitic`

**Task/purpose.** Replace/resolve a direct object with `me/te/le/la/nous/vous/
les`. **Response/template.** Clitic choice, referent match, or rewrite.
**Derivation.** Verb frame assigns COD; person/gender/number and elision yield
form. **Difficulty.** L1 third singular; L2 person/plural/elision; L3 competing
referents/compound tense; L4 profile/discourse.
**Distractors/constraints.** Choose by animacy, use tonic form, confuse indirect
person object. **Feedback.** Verb→COD→referent.
**Examples.** `Je vois Marie→Je la vois` (L1);
`J'aime ce livre→Je l'aime` (L2); plural referent (L2).
**Validation.** Argument frame.

### Family `indirect_object_clitic`

**Task/purpose.** Replace/resolve `à + person` indirect objects with
`me/te/lui/nous/vous/leur` where licensed.
**Response/template.** Clitic, role label, or rewrite.
**Derivation.** Lexeme sense/argument frame and referent person/number select
form; gender is not marked in third person.
**Difficulty.** L1 recipient singular; L2 plural/person; L3 verb-frame contrast
requiring tonic preposition instead; L4 reference.
**Distractors/constraints.** `lui`=male, cliticize every `à` phrase, use direct
gendered form. **Feedback.** Dative-like role and lexical licensing.
**Examples.** `Je parle à Marie→Je lui parle` (L1);
`Je leur donne...` (L2); contrast `penser à elle` (L3).
**Validation.** Valency/referent.

### Family `y_pronoun`

**Task/purpose.** Use/interpret `y` for reviewed location and `à`-complement
roles, with person restrictions. **Response/template.** Replacement, referent
match, or sentence completion. **Derivation.** Preposition frame, referent type,
and lexical construction license `y`.
**Difficulty.** L1 location; L2 thing/idea `à`; L3 competing locative/
prepositional meaning; L4 clitic cluster.
**Distractors/constraints.** `y`=there only, use for person where target requires
tonic/clitic form, retain preposition phrase redundantly.
**Feedback.** Underlying phrase and role.
**Examples.** `Je vais à Paris→J'y vais` (L1);
`Je pense à ce projet→J'y pense` (L2); person contrast (L3).
**Validation.** Valency/reference.

### Family `en_pronoun`

**Task/purpose.** Use/interpret `en` for reviewed `de` complements, partitives,
source, and quantities while retaining required quantity expressions.
**Response/template.** Replacement, referent/quantity match, or completion.
**Derivation.** Source frame and noun-phrase semantics map to `en`; quantity slot
remains when required. **Difficulty.** L1 partitive; L2 numeric quantity/source;
L3 lexical `de` complement; L4 cluster/reference.
**Distractors/constraints.** Delete quantity, `en`=some universally, use for
person without licensed profile/construction.
**Feedback.** Underlying phrase and retained quantity.
**Examples.** `Je veux du pain→J'en veux` (L1);
`J'ai trois livres→J'en ai trois` (L2);
`Je parle de ce problème→J'en parle` (L3). **Validation.** Semantic frame.

### Family `preverbal_clitic_sequence`

**Task/purpose.** Order two or more preverbal clitics in finite/infinitive
contexts. **Response/template.** Ordered tokens, cluster construction, or
referent-slot annotation. **Derivation.** Typed roles map to normal preverbal
slots, then elision/host rules apply.
**Difficulty.** L2 two common clitics; L3 `lui/leur+y/en`; L4 three-clitic
reviewed cluster with clear referents. **Distractors/constraints.** English
object order, repeat same incompatible slot, lose referent.
**Feedback.** Display ordered slots and role arrows.
**Examples.** `Je le lui donne` (L2); `Il m'en parle` (L3);
`Je vais vous l'expliquer` (L3). **Validation.** Clitic automaton.

### Family `clitic_host_negation`

**Task/purpose.** Place clitics with finite verbs, infinitives, compound tenses,
and negation. **Response/template.** Ordered sentence or host selection.
**Derivation.** Clitic belongs to semantic predicate/host; tense/periphrasis and
polarity determine position. **Difficulty.** L1 simple finite; L2 negative/
infinitive; L3 compound/modal-like periphrasis; L4 clusters.
**Distractors/constraints.** Place after finite as English object, attach to
wrong verb by proximity, put outside negation incorrectly.
**Feedback.** Host bracket and scope.
**Examples.** `Je le vois` (L1); `Je ne le vois pas` (L2);
`Je vais le voir` (L2). **Validation.** Host graph.

### Family `affirmative_imperative_clitic`

**Task/purpose.** Order/form clitics after affirmative imperatives and contrast
negative-imperative preverbal order. **Response/template.** Hyphenated sequence,
polarity transformation, or role match. **Derivation.** Imperative host/polarity
selects special slot order and `moi/toi` forms except before `en/y` where reviewed
forms/elision apply. **Difficulty.** L2 one pronoun; L3 two pronouns; L4 `y/en`
and negative contrast. **Distractors/constraints.** Normal preverbal order after
positive command, spaces/apostrophes instead of hyphens, retain tonic form in
negative. **Feedback.** Side-by-side imperative order tables.
**Examples.** `Regarde-le` (L2); `Donne-le-moi` (L3);
`Ne me le donne pas` (L3). **Validation.** Imperative automaton.

### Family `dislocation_resumption`

**Task/purpose.** Interpret/build reviewed left/right dislocation with tonic/
noun phrase and resumptive subject/object clitic.
**Response/template.** Context-order choice, referent linking, or sentence
assembly. **Derivation.** Topic/focus and role determine detached phrase,
punctuation/prosody, and required clitic.
**Difficulty.** L2 subject dislocation; L3 object dislocation; L4 register/
profile and competing referents.
**Distractors/constraints.** Duplicate as two arguments, omit resumption,
present as neutral formal default.
**Feedback.** Co-reference arrow and topic function.
**Examples.** `Moi, je...` (L1); `Ce livre, je l'aime` (L3);
right dislocation in reviewed dialogue (L4). **Validation.** Discourse graph.

### Family `negation_form_scope`

**Task/purpose.** Form/interpret `ne...pas/plus/jamais/rien/personne/que` and
reviewed spoken `ne` omission by profile/register.
**Response/template.** Negator/order, scope meaning, or register classification.
**Derivation.** Polarity item, finite host, infinitive/compound construction,
scope, and profile yield form.
**Difficulty.** L1 `ne...pas`; L2 alternative negative words; L3 compound/
infinitive and negative concord; L4 restriction `ne...que`/spoken profile.
**Distractors/constraints.** All negative words after verb, `ne...que` means
negative, mark oral omission universally wrong/right.
**Feedback.** Scope and host with register label.
**Examples.** `Je ne sais pas` (L1); `Je n'ai rien vu` (L2);
`Je ne bois que de l'eau` restriction (L3). **Validation.** Polarity grammar.

### Family `yes_no_question_style`

**Task/purpose.** Form/interpret yes/no questions using intonation,
`est-ce que`, or subject-pronoun inversion under a declared register/profile.
**Response/template.** Style choice, sentence transformation, or order.
**Derivation.** Register, subject type, medium, and profile license structures.
**Difficulty.** L1 intonation/`est-ce que`; L2 simple pronoun inversion; L3
compound/clitic and `-t-`; L4 noun subject or profile style.
**Distractors/constraints.** Inversion mandatory everywhere, mix `est-ce que`
with inversion, invert arbitrary noun phrase without licensed pattern.
**Feedback.** Same proposition across styles.
**Examples.** `Tu viens ?` (L1); `Est-ce que tu viens ?` (L1);
`Viens-tu ?` (L2). **Validation.** Question/register grammar.

### Family `wh_question_form`

**Task/purpose.** Select/form wh-questions across reviewed styles while
preserving unknown semantic role and preposition.
**Response/template.** Interrogative/style/order or answer match.
**Derivation.** Gap role, animacy, preposition, register, and subject type select
`qui/que/quoi/où/quand/comment/pourquoi/combien/quel` and structure.
**Difficulty.** L1 fixed fronted forms; L2 `est-ce que`; L3 inversion/
prepositional forms; L4 in-situ/profile.
**Distractors/constraints.** English do-support, omit preposition, mix
`qu'est-ce qui/que`, treat in-situ as formal universal.
**Feedback.** Unknown role and style template.
**Examples.** `Où habites-tu ?` (L1); `Qu'est-ce que tu fais ?` (L2);
`Avec qui est-ce qu'elle vient ?` (L3). **Validation.** Question frame.

### Family `qui_que_relative`

**Task/purpose.** Choose `qui/que` from subject versus direct-object role inside
the relative clause. **Response/template.** Pronoun, antecedent-gap link, or
clause merge. **Derivation.** Relative predicate assigns internal role; elision
applies to `que`.
**Difficulty.** L1 clear subject/object; L2 agreement/compound tense; L3
competing antecedents; L4 past-participle agreement triggered by preceding COD.
**Distractors/constraints.** Animate=`qui`, antecedent's matrix role, English
who/that. **Feedback.** Antecedent→gap role.
**Examples.** `la femme qui parle` (L1); `le livre que je lis` (L1);
`les lettres que j'ai écrites` (L4). **Validation.** Relative dependency.

### Family `dont_ou_relative`

**Task/purpose.** Choose/interpret `dont` for licensed `de` relation and `où`
for place/time relation. **Response/template.** Relative choice, underlying
phrase, or sentence merge. **Derivation.** Internal valency/possessive relation
or location/time gap selects form.
**Difficulty.** L2 place `où`; L3 governed `de`/possession `dont`; L4
ambiguous place/time and competing constructions.
**Distractors/constraints.** `dont`=whose only, use `où` for any inanimate
antecedent, duplicate `de`.
**Feedback.** Restore underlying gap phrase.
**Examples.** `la ville où j'habite` (L2); `le livre dont je parle` (L3);
`la personne dont le frère...` (L4). **Validation.** Valency/relative.

### Family `prepositional_lequel_relative`

**Task/purpose.** Form reviewed preposition+`lequel` relative forms and
contractions, contrasting person `qui` alternatives.
**Response/template.** Form, agreement, or underlying-preposition match.
**Derivation.** Antecedent gender/number+governing preposition determine
`lequel/laquelle/lesquels/lesquelles` and `auquel/duquel` forms.
**Difficulty.** L3 basic forms; L4 `à/de` contractions and person/register
alternative. **Distractors/constraints.** Agree from internal noun, omit
preposition, split `auquel`. **Feedback.** Antecedent features+government.
**Examples.** `la table sur laquelle...` (L3);
`le projet auquel...` (L4); `la raison pour laquelle...` (L4).
**Validation.** Paradigm/dependency.

### Family `demonstrative_pronoun`

**Task/purpose.** Use/interpret `ce/ceci/cela/ça` and
`celui/celle/ceux/celles(-ci/-là)` in bounded reference.
**Response/template.** Form, referent match, or contrast.
**Derivation.** Nominal/propositional reference, gender/number, register, and
modifier complement select form.
**Difficulty.** L2 `ce/ça`; L3 variable demonstrative+modifier; L4 discourse/
profile/register. **Distractors/constraints.** Use bare `celui` without licensed
modifier/context, make `ceci/cela` gendered, mark `ça` formal universal.
**Feedback.** Referent type and agreement.
**Examples.** `Ça va` (L1); `Ceux qui...` (L3);
`celui de Marie` (L3). **Validation.** Reference grammar.

### Family `cest_il_est`

**Task/purpose.** Choose/interpret `c'est/ce sont` versus `il/elle est` in
identification, presentation, description, profession/nationality, and modified
noun phrases. **Response/template.** Construction choice, picture/context match,
or sentence pair. **Derivation.** Referent discourse status, complement category/
determination, focus, number, register/profile select licensed set.
**Difficulty.** L1 identify versus describe; L2 profession/adjective; L3
modified noun/`ce sont`; L4 discourse/profile alternatives.
**Distractors/constraints.** noun=`c'est`, adjective=`il est` universally;
English “it is.” **Feedback.** Presentation/predication structure.
**Examples.** `C'est Marie` (L1); `Elle est médecin` (L2);
`C'est une excellente médecin` (L3). **Validation.** Construction.

### Family `impersonal_il_y_a`

**Task/purpose.** Use/interpret existential `il y a` and reviewed impersonal
weather/evaluation/necessity expressions. **Response/template.** Construction,
form, or meaning match. **Derivation.** Existential/event/weather/evaluation
frame selects dummy `il`, `y`, verb, and complement.
**Difficulty.** L1 `il y a`/weather; L2 past/future existential; L3
`il faut/il est + adjective + de/que`; L4 contrast with referential `il`.
**Distractors/constraints.** Omit dummy subject, pluralize `avoir` to entity,
assign referent to every `il`. **Feedback.** Expletive/construction graph.
**Examples.** `Il y a deux livres` (L1); `Il pleut` (L1);
`Il faut partir` (L2). **Validation.** Construction registry.

### Family `neutral_marked_word_order`

**Task/purpose.** Select neutral or reviewed marked order for topic/focus,
adverbial placement, pronouns, and dislocation.
**Response/template.** Context-order match or accepted sequence.
**Derivation.** Information status, constituent weight, cliticization,
register/profile, and construction license order.
**Difficulty.** L2 neutral SVO/adverb; L3 fronted adverb/dislocation; L4
contrastive focus/long constituents. **Distractors/constraints.** French order
completely fixed or completely free, accept grammatical context mismatch.
**Feedback.** Topic/focus and dependency map.
**Examples.** neutral SVO (L1); initial time adverb (L2);
object dislocation with clitic (L3). **Validation.** Discourse-order set.

### Family `pronoun_syntax_audit`

**Task/purpose.** Diagnose one subject/tonic/clitic, `y/en`, host/order,
imperative, negation, question, relative, demonstrative, `c'est`, or impersonal
fault. **Response/template.** Root cause, correction, meaning/reference effect.
**Derivation.** Mutate one dependency/surface rule after valid realization.
**Difficulty.** L2 one pronoun/negation; L3 cluster/question/relative; L4
discourse/profile. **Distractors/constraints.** One root; licensed style/variant
accepted. **Feedback.** Correct semantic/syntax graph.
**Examples.** `Je lui vois` for direct object (L2); wrong positive-imperative
clitic order (L3); relative form chosen from animacy not role (L3).
**Validation.** Fault manifest.

### Cross-family progression

Subject/tonic forms precede direct/indirect clitics. `y` and `en` are learned
separately before clusters; one clitic/host precedes imperative reorderings.
Basic negation precedes scope/register. Intonation/`est-ce que` precede inversion
and wh-style mixing. `qui/que` precede `dont/où/lequel`. Presentation/
impersonal constructions and marked order precede cumulative audits.

## 6. Category: Connected French, discourse, register, and variation

### Category purpose

Connect clauses and choose forms that fit relation, stance, relationship,
medium, and standard profile. This layer distinguishes grammatical possibility
from communicative appropriateness.

### Learn-card content

- Comparison uses `plus/moins/aussi...que`, quantity forms, superlatives, and a
  reviewed irregular set; adjective agreement still applies.
- Connectors express addition, contrast, cause, result, concession,
  reformulation, and sequence; similar meanings can require different structures.
- Temporal clauses encode overlap/order and can interact with tense/mood.
- Same-subject purpose commonly uses `pour/afin de + infinitif`; differing
  subjects use finite reviewed purpose clauses.
- `tu` and `vous` reflect number, relationship, institution, profile, and desired
  stance; no one social rule fits the Francophonie.
- Formality uses address, question style, negation, mood, greeting, request
  strategy, and medium.
- Spoken and written French differ in more than pronunciation. Items must label
  register rather than treating spontaneous speech as defective writing.

### Common misconceptions

- `plus` has one pronunciation and one meaning.
- `meilleur` and `mieux` are interchangeable.
- One English connector maps to one French connector.
- Clause order equals event order.
- `pour + infinitif` works with any subject combination.
- `tu` is rude and `vous` polite everywhere.
- Formal rewriting is pronoun replacement only.
- Omitting `ne` is either universally wrong or universally appropriate.
- Spoken French is written French read quickly.

### Family `comparison_degree`

**Task/purpose.** Build/interpret comparative, equality, superlative, and
reviewed irregular forms. **Response/template.** Form/connector, agreement, or
meaning match. **Derivation.** Compared constituents, degree/quantity,
adjective/adverb role, polarity, and profile pronunciation select realization.
**Difficulty.** L1 `plus/moins...que`; L2 `aussi/autant`; L3 superlative/
`meilleur-mieux`; L4 `plus` pronunciation/context and irregular nuance.
**Distractors/constraints.** `mieux` before noun, make adverb agree, ignore
negation-profile pronunciation. **Feedback.** Comparison slots/form.
**Examples.** `plus grand que` (L1); `autant de livres que` (L2);
`le meilleur / travaille mieux` (L3). **Validation.** Comparison registry.

### Family `connector_relation_structure`

**Task/purpose.** Select a connector for addition, contrast, cause, result,
concession, reformulation, or sequence. **Response/template.** Connector,
relation label, or clause join. **Derivation.** Discourse relation and register
license finite accepted set. **Difficulty.** L1 `et/mais/parce que`; L2
`donc/pourtant/en plus`; L3 concession/reformulation; L4 near-synonyms/register.
**Distractors/constraints.** Plausible wrong relation or clause type.
**Feedback.** Relation graph/paraphrase.
**Examples.** cause `parce que` (L1); result `donc` (L2);
concession `bien que` with declared mood (L3). **Validation.** Relation.

### Family `temporal_sequence`

**Task/purpose.** Express/recover order, overlap, repetition, and anteriority
with `avant de/que`, `après`, `pendant que`, `quand`, `lorsque`, `dès que`.
**Response/template.** Timeline, connector/tense/mood, or assembly.
**Derivation.** Event intervals, subject identity, actuality/prospectivity, and
reference time select construction. **Difficulty.** L1 before/after; L2 overlap/
past sequence; L3 subject-sensitive infinitive/finite; L4 prospective/mood
contrast. **Distractors/constraints.** Clause order=chronology, trigger word
alone, ignore subject control. **Feedback.** Timeline+subject links.
**Examples.** `avant de partir` (L1); `pendant que je travaillais` (L2);
future ordered events (L3). **Validation.** Event graph.

### Family `cause_purpose_condition`

**Task/purpose.** Distinguish/build cause, purpose, real condition, and
hypothesis. **Response/template.** Relation/connector/mood/tense or clause build.
**Derivation.** Relation direction, subject identity, assertion, and
possible-world status select `parce que/puisque`, `pour...`, `pour que`,
`si`, and reviewed alternatives. **Difficulty.** L1 cause; L2 same/different
subject purpose/real condition; L3 hypothesis; L4 counterfactual.
**Distractors/constraints.** `si`+conditional in canonical clause, `pour`
infinitive with mismatched subject, reverse cause/result.
**Feedback.** Role/world graph.
**Examples.** `Je reste parce qu'il pleut` (L1);
`Je parle lentement pour que tu comprennes` (L2);
`Si j'avais..., je ferais...` (L3). **Validation.** Semantic relation.

### Family `assertion_subjunctive_contrast`

**Task/purpose.** Interpret contrasting indicative/subjunctive choices under
assertion, evaluation, specificity, concession, and commitment.
**Response/template.** Context-clause match or explanation choice.
**Derivation.** Discourse world/commitment plus construction license mood.
**Difficulty.** L3 clear assertive/nonassertive pair; L4 negation, relative, or
concession with changed context/profile.
**Distractors/constraints.** Mood=true/false, one trigger list, ignore meaning.
**Feedback.** Mark asserted, desired, evaluated, or merely sought content.
**Examples.** `Je sais qu'il vient / Je doute qu'il vienne` (L3);
specific/non-specific relative (L4); concession pair (L4).
**Validation.** Authored world pair.

### Family `tu_vous_register_bundle`

**Task/purpose.** Select coherent address pronoun, verb, possessive, imperative,
greeting, and clitic forms for a declared relationship/profile.
**Response/template.** Bundle matching, form choice, or consistency check.
**Derivation.** Addressee number, relationship, institution, medium, and profile
select set. **Difficulty.** L1 singular `tu/vous`; L2 plural `vous`; L3
possessive/imperative/clitic; L4 relationship/profile variation.
**Distractors/constraints.** `vous`=formal singular only, cultural absolutes,
mixed agreement. **Feedback.** Scenario+complete bundle.
**Examples.** friend `Comment vas-tu ?` (L1); formal `Comment allez-vous ?`
(L1); plural informal `vous` (L2). **Validation.** Register profile.

### Family `polite_request_strategy`

**Task/purpose.** Match/build bounded requests using imperative, question,
modal/conditional, mitigation, and greeting appropriate to context.
**Response/template.** Strategy/context match or constrained utterance.
**Derivation.** Imposition, relationship, medium, and directness license forms.
**Difficulty.** L1 `s'il vous plaît`; L2 question/imperative; L3 conditional;
L4 repair/refusal. **Distractors/constraints.** Formal=longest, imperative always
rude, grammatically correct relationship mismatch.
**Feedback.** Speech act+mitigation.
**Examples.** `Attendez, s'il vous plaît` (L1);
`Est-ce que tu peux...?` (L2); `Pourriez-vous...?` (L3).
**Validation.** Authored pragmatic set.

### Family `formal_informal_rewrite`

**Task/purpose.** Rewrite a bounded message for new relationship/medium while
preserving facts/intent. **Response/template.** Token transform, constrained
text, or authored choice. **Derivation.** Separate content from address,
agreement, question/negation style, greeting, request, closing, and profile.
**Difficulty.** L2 forms; L3 request/opening/closing; L4 short multi-sentence
message. **Distractors/constraints.** Pronoun-only swap, mixed bundle, content
change, gratuitous verbosity. **Feedback.** Content/register alignment.
**Examples.** `Tu peux...?→Vous pourriez...?` context (L2);
appointment message (L3); brief email (L4). **Validation.** Accepted set.

### Family `spoken_written_register`

**Task/purpose.** Recognize/convert a bounded set of spoken versus neutral/formal
written structures: `ne` omission, question style, dislocation, `on/nous`,
selected contractions, and lexical choices.
**Response/template.** Register classification, equivalent rewrite, or
with/without-feature match. **Derivation.** Same semantic frame realized by
reviewed register/profile templates. **Difficulty.** L2 one feature; L3 two
features; L4 short message/dialogue.
**Distractors/constraints.** Spoken=incorrect, written=unnatural in all speech,
phonetic eye-dialect spelling. **Feedback.** Shared meaning+scoped differences.
**Examples.** `Je ne sais pas / Je sais pas` labeled (L2);
intonation versus inversion question (L3); `on/nous` rewrite (L3).
**Validation.** Same-frame registry.

### Family `controlled_sentence_construction`

**Task/purpose.** Realize a semantic frame under explicit article, pronoun,
tense/mood, register, and profile constraints. **Response/template.** Ordered
tokens or constrained text. **Derivation.** Roles→determination/agreement→verb/
clitic→clause/order→orthography; enumerate variants.
**Difficulty.** L1 one clause; L2 article/adjective/pronoun; L3 subordinate/
relative; L4 two clauses/register. **Distractors/constraints.** No unrestricted
translation; each distractor one dependency.
**Feedback.** Full derivation chain.
**Examples.** existence statement (L1); object-clitic past sentence (L3);
polite purpose request (L4). **Validation.** Back-parse.

### Family `grammar_pragmatics_audit`

**Task/purpose.** Diagnose one comparison, connector, timeline, purpose,
condition, mood, address, register, or cohesion fault.
**Response/template.** Root cause, correction, meaning/register effect.
**Derivation.** Inject one mutation after valid discourse.
**Difficulty.** L2 local relation/form; L3 cross-clause/register; L4 plausible
profile-incompatible alternative. **Distractors/constraints.** One root; all
licensed repairs accepted. **Feedback.** Correct discourse graph.
**Examples.** `meilleur/mieux` role swap (L2); subject mismatch in purpose
infinitive (L3); mixed `tu/vous` message (L3). **Validation.** Fault manifest.

### Cross-family progression

Comparison/basic connectors precede clause relations. Timelines precede
prospective/mood distinctions; same-subject purpose precedes finite purpose.
One address bundle precedes request strategies and message rewriting.
Spoken/written register is introduced through familiar semantic frames.
Construction/audits combine only demonstrated systems.

## 7. Category: Reading, listening, and interaction

### Category purpose

Integrate French systems in short acts of comprehension and communication. Texts
and recordings remain fully annotated so evidence, reference, sound, and
register can be explained exactly.

### Learn-card content

- Read using morphology, silent written information, connectors, reference,
  genre, and context—not word-by-word substitution.
- Written number/agreement endings may be inaudible; grammar still helps resolve
  meaning.
- Connected speech creates liaison, enchaînement, schwa variation, and
  resyllabification without deleting word identity.
- Notices, schedules, menus, forms, and chats use layout, abbreviations,
  fragments, and profile conventions.
- Listening progresses from known contrasts through chunks/turns to dialogues
  across reviewed profiles.
- Dictation feedback separates lexeme, accent, agreement, apostrophe,
  segmentation, and punctuation.
- Speaking practice supports model/replay/self-assessment, not automated accent
  judgment.
- Bounded mediation transfers specified facts, not free translation.

### Common misconceptions

- Every unknown word is required for comprehension.
- What is silent has no grammatical meaning.
- The closest noun is always the pronoun antecedent.
- Spoken word boundaries match written spaces.
- Faster audio is intrinsically better.
- One France-based accent is the only standard model.
- Plausible inference equals textual entailment.
- Waveform similarity measures pronunciation.

### Family `sentence_segmentation_parse`

**Task/purpose.** Segment phrases/clauses and recover subjects, objects,
clitics, agreement, and dependencies. **Response/template.** Grouping, labels,
or links. **Derivation.** Generated sentence retains semantic/syntactic parse.
**Difficulty.** L1 simple SVO; L2 clitic/negation; L3 compound/relative/
subordinate; L4 ambiguity resolved by discourse.
**Distractors/constraints.** Parse from word order alone, split clitic host,
attach modifier wrongly. **Feedback.** Brackets/role arrows.
**Examples.** transitive clause (L1); clitic compound past (L2);
relative clause (L3). **Validation.** Back-parse.

### Family `connected_speech_word_recovery`

**Task/purpose.** Recover known written words/morphemes from liaison,
enchaînement, schwa variation, and rhythmic grouping.
**Response/template.** Audio-token alignment, boundary placement, or transcript
choice. **Derivation.** Audio has word/morpheme alignment and connected-speech
annotations. **Difficulty.** L1 one enchaînement; L2 required liaison/schwa;
L3 multiple boundaries; L4 profile/rate.
**Distractors/constraints.** Invent/remove words from surface syllables, noisy
audio, unreviewed reduction. **Feedback.** Replay isolated and connected forms.
**Examples.** `les amis` alignment (L1); schwa-bearing phrase (L2);
two rhythmic groups (L3). **Validation.** Human alignment.

### Family `short_reading_comprehension`

**Task/purpose.** Retrieve facts, order events, and make one supported inference
from a microtext. **Response/template.** Choice, slot, ordering, or entailment.
**Derivation.** Fact/event graph generates text/question/evidence.
**Difficulty.** L1 explicit fact; L2 paragraph/reference; L3 cross-clause
inference; L4 tense/negation/quantity distractor.
**Distractors/constraints.** No outside knowledge; one best unless stated.
**Feedback.** Evidence/inference.
**Examples.** destination (L1); order errands (L2); changed plan (L3).
**Validation.** Entailment labels.

### Family `notice_message`

**Task/purpose.** Interpret notices, labels, menus, ads, forms, chats, and
service/personal messages. **Response/template.** Action/audience/fact or
matching. **Derivation.** Genre template controls layout, register, profile,
dates, and prices. **Difficulty.** L1 sign; L2 hours/message; L3 email/menu/ad;
L4 two documents. **Distractors/constraints.** Fictional data; no live legal/
emergency claims. **Feedback.** Expand ellipsis/show fields.
**Examples.** `Fermé le lundi` (L1); changed appointment (L2);
invitation+reply (L3). **Validation.** Fact/layout.

### Family `instruction_timetable`

**Task/purpose.** Follow instructions or derive a fact from timetable, itinerary,
recipe, or schedule. **Response/template.** Order actions, select route/time, or
structured fact. **Derivation.** Event model produces document/answer.
**Difficulty.** L1 command/step; L2 sequence/time; L3 connection/constraint; L4
exception note. **Distractors/constraints.** Arithmetic secondary; fictional
data; profile formats declared. **Feedback.** Trace rows/steps.
**Examples.** next action (L1); departure time (L2); valid connection (L3).
**Validation.** Independent solver.

### Family `dialogue_completion`

**Task/purpose.** Choose/build a grammatical, coherent, socially appropriate
next turn. **Response/template.** Turn choice/order/constrained utterance.
**Derivation.** Dialogue state stores speakers, goal, facts, address, profile,
commitments, and open question. **Difficulty.** L1 greeting/answer; L2 request/
offer; L3 repair/refusal; L4 multi-turn reference/register.
**Distractors/constraints.** Grammatical nonresponse, wrong address/profile,
contradiction. **Feedback.** Speech act/answered turn.
**Examples.** respond `Ça va ?` (L1); invitation (L2); clarify mismatch (L3).
**Validation.** Dialogue constraints.

### Family `reference_resolution`

**Task/purpose.** Resolve subject/object/tonic/demonstrative/relative pronouns,
`y/en`, possessives, and controlled ellipsis. **Response/template.** Referent
selection, links, or expansion. **Derivation.** Discourse graph tracks features,
roles, salience, and lexical frames. **Difficulty.** L2 one pronoun; L3
competing referents/`y-en`; L4 cross-turn topic shift.
**Distractors/constraints.** Nearest noun, natural gender only, ignore valency.
**Feedback.** Morphological/semantic/discourse cues.
**Examples.** resolve `elle` (L1); `en` source (L3);
relative antecedent (L3). **Validation.** Unique recoverability.

### Family `listening_sound_form`

**Task/purpose.** Identify taught vowel/nasal/final consonant, liaison, schwa,
morphological form, or profile contrast. **Response/template.** Audio-word,
same/different, boundary, or feature. **Derivation.** Assets indexed by feature,
lexeme, speaker/profile. **Difficulty.** L1 oral vowel; L2 nasal/final; L3
liaison/schwa/morphology; L4 multi-speaker profile.
**Distractors/constraints.** No accent ranking/noise; visual reveal optional.
**Feedback.** Replay normal/slow and mark feature.
**Examples.** oral vowel pair (L1); liaison boundary (L2);
profile nasal contrast (L4). **Validation.** Manual audio.

### Family `listening_dictation`

**Task/purpose.** Transcribe a word, phrase, sentence, or tiny dialogue with
French orthography/grammar. **Response/template.** Text with optional scaffold.
**Derivation.** Asset stores transcript, profile, alignment, accepted
punctuation. **Difficulty.** L1 familiar word; L2 accent/apostrophe; L3 silent
agreement/homophone; L4 two turns/relative.
**Distractors/constraints.** Do not normalize distinctions away; context resolves
homophones. **Feedback.** Lexical/accent/agreement/boundary/punctuation errors.
**Examples.** accent word (L1); `l'école` (L2);
contextual `ils parlent` spelling (L3). **Validation.** Transcript suite.

### Family `listening_comprehension`

**Task/purpose.** Understand gist, facts, intention, or one supported inference
in short audio. **Response/template.** Choice/order/structured fact.
**Derivation.** Transcript/dialogue/fact graph stores timed evidence.
**Difficulty.** L1 one turn; L2 two-turn facts; L3 reference/register/profile;
L4 attitude only with reviewed cues. **Distractors/constraints.** No stereotypes/
trivia; transcript after answer. **Feedback.** Replay evidence/transcript.
**Examples.** requested item (L1); appointment time (L2);
changed plan (L3). **Validation.** Manual/evidence.

### Family `guided_speaking_shadowing`

**Task/purpose.** Rehearse intelligible production through repetition,
shadowing, substitution, and local recording. **Response/template.** Recording
plus self-check; optional model match. **Derivation.** Frame supplies audio,
chunks, feature/profile, substitutions. **Difficulty.** L1 word/chunk; L2
sentence; L3 transformed sentence; L4 role response.
**Distractors/constraints.** No upload/automatic accent score; optional recording
and non-recording route. **Feedback.** Model replay/checklist.
**Examples.** nasal-vowel chunk (L1); substitute pronoun/verb (L2);
polite request (L3). **Validation.** Reviewed models/local recorder.

### Family `bounded_mediation`

**Task/purpose.** Transfer selected information among table, notice, message,
schedule, and constrained French output. **Response/template.** Semantic slots,
faithful paraphrase, or phrase bank. **Derivation.** Shared fact graph plus
audience/register/profile. **Difficulty.** L2 one fact; L3 several/register; L4
relevance selection with quantity/negation.
**Distractors/constraints.** Not free translation; judge facts, not style.
**Feedback.** Source→fact→output.
**Examples.** changed time (L2); two menu constraints (L3);
formal schedule message (L4). **Validation.** Slot equivalence.

### Family `profile_comprehension`

**Task/purpose.** Understand familiar content in another reviewed standard
French profile without requiring imitation. **Response/template.** Meaning,
feature label, or shared-core paraphrase. **Derivation.** Same semantic frame
realized under matched profile variants.
**Difficulty.** L2 number/orthographic variant; L3 vocabulary/pronunciation/
question style; L4 grammatical/register variant.
**Distractors/constraints.** Never infer nationality from voice, caricature, or
label local standard wrong. **Feedback.** Shared meaning+scoped difference.
**Examples.** 70/90 variant (L2); reviewed meal/lexical pair (L3);
question-style profile (L4). **Validation.** Same-frame realization.

### Family `connected_language_audit`

**Task/purpose.** Diagnose one comprehension, segmentation, reference,
transcript, dialogue, profile, or fact-transfer failure.
**Response/template.** Root cause, correction, evidence.
**Derivation.** Inject one fault into valid annotated content.
**Difficulty.** L2 local cue; L3 cross-sentence/modality; L4 plausible
unsupported/profile mismatch. **Distractors/constraints.** One root; evidence
provided. **Feedback.** Decisive span/graph link.
**Examples.** wrong `en` referent (L2); dictation loses agreement (L3);
summary reverses cancellation (L3). **Validation.** Mutation restoration.

### Cross-family progression

Sentence parsing/word recovery precede longer reading/reference. Practical
documents precede multi-document reasoning. Listening moves from contrasts to
dictation/meaning; speaking reuses understood forms. Cross-profile work begins
with familiar frames. Mediation/audits follow component skills.

## 8. Cross-category progression and release slices

Levels describe exercise complexity, not certification:

- **Foundation / L1:** letters/accents, core vowels/consonants, noun gender/
  plural, core articles/adjective agreement, present forms, subject pronouns,
  simple statements/questions, familiar reading/listening.
- **Elementary / L2:** nasal/final sound patterns, elision/liaison basics,
  partitives/contractions, possessives/demonstratives, periphrases, compound past
  form, one object clitic, negation/question styles, practical messages.
- **Independent-building / L3:** adjective position, quantity/negative `de`,
  past aspect, auxiliary/agreement, `y/en`, clitic clusters, relatives,
  future/conditional, present subjunctive selection, clause relations, register,
  connected reading/listening, and mediation.
- **Early-intermediate / L4:** interacting agreement/reference, hypotheses,
  discourse-sensitive mood/order, affirmative-imperative clusters, controlled
  voice/causative, spoken/written and cross-profile comprehension, audits.
- **L5 challenge:** denser mixing/reduced scaffolding within reviewed grammar;
  no silent move to C1/C2, literary syntax, or free composition.

Recommended delivery:

1. **Release A — sound, noun phrase, present:** Category 2 core; gender/plural/
   articles/agreement; present; simple questions/negation; parsing/audio.
2. **Release B — past and practical pronouns:** article system, periphrases,
   participles/compound past/imperfect form, one clitic, notices/timetables/
   dictation.
3. **Release C — connected French:** aspect/agreement, `y/en`/clusters,
   relatives, future/conditional/subjunctive, connectors/register, dialogue/
   reference/listening.
4. **Release D — early-B1 integration:** hypotheses, mood/order, passive/
   causative, spoken-written/cross-profile comprehension, mediation/audits.

Unlock by family/dependency. Production, reading, listening, speaking rehearsal,
and profile comprehension have separate evidence. Audio/microphone remains
optional where inaccessible.

## 9. Adaptive practice guidance

Track:

- family/can-do;
- lexeme/sense, frequency/domain, known status, collocation;
- grapheme/sound, nasal/oral, final consonant, schwa, liaison/elision, `hClass`,
  speaker/profile;
- noun gender/plural, determination source, article/contraction, adjective
  class/position, agreement span, quantity/polarity, preposition frame;
- verb class/stem/person, auxiliary, participle, agreement controller, tense/
  aspect/mood, periphrasis, voice, event/world frame;
- pronoun role/form/slot/host, `y/en` source, referent distance, negation scope,
  question/relative style, word order;
- register/address, connector/relation, genre, modality, scaffold, response,
  latency, confidence, misconception.

Routing examples:

- Correct noun gender but wrong article class → hold noun constant and contrast
  reference/countability before new vocabulary.
- `beaucoup des livres` in quantity reading → contrast quantity `de` with
  `de+les` from a lexical relation.
- `ma amie` → retain feminine noun and target phonological-onset possessive rule.
- Correct participle but wrong auxiliary → use sense/construction pairs.
- Agreement with nearest noun → show controller dependency before more forms.
- Past error based on action duration → route to viewpoint/timeline contrasts.
- `y/en` confused → restore underlying preposition/quantity phrase before
  clusters.
- Correct clitics in English order → hold referents fixed and contrast slot
  sequences.
- Wrong imperative cluster only → compare positive/negative hosts.
- Subjunctive selected after every `que` → vary assertion/subject identity with
  the same surface trigger.
- Spoken `ne` omission in formal writing → register contrast, not universal
  grammar remediation.
- Profile-valid number/spelling form → clarify active target profile.

Track recognized, scaffold-produced, and meaning-produced mastery separately.
Space lexical/irregular forms; interleave grammar by dependency. After two
successes, vary one controlled dimension. A confident misconception triggers a
minimal contrast, explanation, and delayed transfer. Slow correctness does not
justify unrelated lexical difficulty.

## 10. Feedback and explanation requirements

Reveal:

1. **Intention/profile:** meaning, time, relationship, medium, standard profile.
2. **Semantic frame:** predicate, roles, referents, events/worlds, clause relation.
3. **Features:** gender/number/reference, person, tense/aspect/mood, polarity.
4. **Realization:** article/contraction, adjective/participle agreement, verb
   stem/ending/auxiliary, clitic slots/host, elision/spelling.
5. **Structure:** negation scope, question/relative template, word order.
6. **Mismatch/alternatives:** first decisive error and equivalent/profile/
   context-different variants.

Useful visuals:

- grapheme/sound alignment and rhythmic groups;
- isolated/connected audio for liaison/enchaînement;
- article/reference/quantity tree;
- agreement/controller arcs;
- event timelines for past;
- possible-world/subject graph for mood;
- ordered clitic slots and host;
- underlying phrase for `y/en`;
- negation scope;
- relative antecedent→gap;
- question/register templates;
- dialogue/profile state;
- timed transcript evidence.

Interface-language gloss is support, not complete explanation. Invalidate any
item lacking enough context for article, agreement, aspect, mood, pronoun,
question style, or profile.

## 11. Audio and content requirements

- Bundle audio; no runtime TTS, recognition, pronunciation API, or dictionary.
- Prefer licensed human recordings from multiple reviewed Francophone standard
  profiles; label neutrally.
- Separate normal and pedagogically slower takes; avoid distorted slowdown.
- Normalize loudness/silence while preserving rhythm, liaison, consonants,
  vowel contrasts, and schwa.
- Store transcript/alignment, speaker/voice, broad profile, rate, feature tags,
  license/provenance, review.
- Minimal/profile comparisons use matched conditions and avoid caricature.
- Provide keyboard replay/state/transcript and non-audio path where hearing is
  not the skill.
- Microphone is optional/local-only; no upload, retention by default, accent
  detection, or automated score.
- Prefer purpose-written text/dialogue; external content needs license/
  attribution.
- Vary Francophone settings without requiring cultural trivia or stereotypes.

## 12. Rendering, interaction, and accessibility

- UTF-8; reliably render/input all French diacritics/ligatures.
- Offer optional character strip and explicit fallback input, tracked separately
  from spelling mastery.
- Preserve accents, cedilla, apostrophes, hyphens, and profile punctuation.
- Normalize regular/nonbreaking spaces only when typography is not assessed.
- Paradigms use semantic HTML tables.
- Sound alignments, agreement arcs, timelines, clitic slots, and discourse
  graphs have text alternatives.
- Ordering has keyboard/button alternatives and large targets.
- Audio controls have labels/state/replay/transcript; no autoplay.
- Color, waveform, hearing, speed, or fine pointer action is never the sole cue
  without appropriate alternate route.
- Long clauses/tables wrap on mobile.
- Screen readers announce correction before detail and hide raw feature IDs.
- Respect reduced motion/no disappearing timers.
- Profile labels use text, not flags alone.

## 13. Generator and offline implementation guidance

Useful module boundary:

```text
seededRng
reviewedLexiconRegistry
varietyProfileRegistry
orthographyVariantRegistry
pronunciationLiaisonRegistry
semanticFrameGenerator
determinationArticleEngine
agreementResolver
adjectivePlacementRegistry
prepositionValencyRegistry
verbParadigmRealizer
auxiliaryParticipleEngine
eventAspectWorldModel
subjunctiveSelectionEngine
cliticSequenceAutomaton
yEnReferenceResolver
negationScopeEngine
questionRelativeGrammar
referenceDiscourseGraph
clauseLinearizer
numberDateTimeGrammar
dialogueStateEngine
textEntailmentAnnotations
audioAssetRegistry
faultInjector
unicodeFrenchNormalizer
semanticAnswerChecker
accessibleRenderer
```

Archive:

- stable family/schema, seed, data/generator/profile versions;
- can-do/difficulty/scaffold/modality;
- semantic frame, roles, referents, facts, events, worlds, discourse/speech act;
- lexeme/sense IDs, full morphosyntactic features;
- determination, agreement controllers, auxiliary/participle, clitic roles/
  slots/host, tense/mood, question/relative/order template;
- active profile and canonical/accepted/profile-different outputs;
- pronunciation/elision/liaison/audio annotations;
- tokenization/parse/evidence/normalization;
- distractor misconception and audit mutation.

Generation:

1. choose family/profile/dimension;
2. create semantic/orthographic/phonological/discourse source;
3. select compatible reviewed lexemes/construction;
4. assign reference/determination, roles, agreement, event/mood, clitics, register;
5. realize morphology/order;
6. apply elision/orthography/punctuation and select audio;
7. back-parse/verify identity;
8. derive answer/explanation independently;
9. create misconception distractors;
10. reject ambiguity/collisions/unnaturalness/profile mismatch/lexical overload.

No runtime lexicon, conjugator, corpus, TTS, or answer service. Ship licensed
reviewed/versioned subsets. Choices/order compare IDs; text parses only the
promised grammar and compares features/realizations after item normalization.
Edit distance does not establish correctness.

## 14. Automated and linguistic validation

### Data-build checks

- Every lexeme: stable ID, sense, POS, level/frequency, register/profile,
  provenance/review.
- Nouns: gender/plural/pronunciation/`hClass`.
- Adjectives/determiners/pronouns: full shipped paradigms, position/meaning,
  onset/elision behavior.
- Verbs: all shipped cells, principal forms, auxiliary by sense, argument/
  preposition/pronominal frames, participle agreement policy.
- Liaison/elision, article, clitic, `y/en`, aspect/mood, question/relative,
  register constructions are typed/reviewed.
- Variants declare profile/register/scope/explanation.
- Audio has transcript/profile/license/manual review.

### Instance invariants

- Surface reparses to source semantics/features.
- Orthography/diacritics/apostrophe/hyphen/spacing match profile.
- Pronunciation, elision, liaison, and `hClass` are compatible.
- Determination/article/contraction matches reference/quantity/polarity.
- Agreement links use correct controller.
- Finite verb/auxiliary/participle/tense/aspect/mood/voice match frame.
- Clitic role/order/host, `y/en` source, and referents are licensed.
- Negation scope, question/relative template, and word order match context/
  register.
- Address/profile coherent.
- Reading/listening key entailed; distractors logged false/unsupported.
- Accepted answer never collides after normalization.
- Audit differs by exactly one root mutation.

### Test volume and independent oracles

- At least 10,000 seeds per family/level.
- At least 25,000 for nasal/final sound, liaison/elision/`h`, article/`de`,
  agreement, auxiliary/participle, past aspect, subjunctive, clitic clusters,
  `y/en`, negation, questions/relatives, reference, and audits.
- Exhaustively enumerate shipped paradigms, article/contraction forms, clitic
  sequences/hosts, liaison categories, and orthographic profiles.
- Exhaustively test Unicode, ligatures, apostrophes, hyphens, capitalization,
  punctuation spacing, and accepted variants.
- Independently recompute numbers/dates/times.
- Back-parser/validator independent from generator key path.
- Snapshot long text, tables, diagrams, profile labels, audio states on mobile/
  desktop.
- Manually review all audio and stratified template/lexeme/profile/distractor/
  fault samples. Automation cannot certify idiomatic/pragmatic naturalness.

Discard/log failures; never substitute unreviewed content.

## 15. Coverage and balance requirements

Report by family/level:

- generation/rejection and distinct frames;
- lemma/sense/domain/frequency/new status;
- sound/grapheme/nasal/final/schwa/liaison/elision/`h`/speaker/profile;
- gender/plural, article/reference/quantity/polarity, adjective class/position/
  agreement, preposition;
- verb class/person/auxiliary/participle/controller/tense/aspect/mood/
  periphrasis/voice;
- pronoun role/form/cluster/host, `y/en`, referent distance, negation scope,
  question/relative/order;
- connector/relation, address/register, genre/evidence/modality/profile;
- response/scaffold/misconception/confidence/repetition.

Cap easy defaults: masculine nouns, regular plural, definite article, `-er`
verbs, present, subject pronouns `je/il`, one-clitic clauses, vocabulary/audio
from only one region, and literal one-clause translation. Balance frequency,
communicative value, contrasts, profiles, and learner needs.

## 16. Content and implementation checklist

- [ ] Adult general French, roughly A1–early B1; no certification claim.
- [ ] Common standard core/profiles explicit/versioned.
- [ ] France/Belgium/Switzerland/Canada and other reviewed standards are scoped,
      not ranked.
- [ ] Traditional/rectified orthography accepted per declared policy.
- [ ] Lexemes/forms/constructions reviewed/licensed.
- [ ] Gender/plural/`hClass`/liaison/valency stored, not guessed.
- [ ] Article choice derives from reference/countability/quantity/polarity.
- [ ] Participle agreement has explicit controller/construction.
- [ ] Past aspect uses viewpoint/timelines.
- [ ] Subjunctive uses semantics/discourse, not trigger words.
- [ ] Clitics typed/ordered by host; `y/en` retain underlying roles.
- [ ] Question and register styles accept licensed variants.
- [ ] Spoken forms labeled, not treated as corrupt writing.
- [ ] No free translation/essay/conversation/fuzzy grading.
- [ ] Audio local/licensed/multi-profile/human-reviewed.
- [ ] Recordings local, no bogus pronunciation/accent score.
- [ ] Reading/listening retain evidence.
- [ ] Distractors have misconception; audits one root fault.
- [ ] Seeds reproduce prompt/profile/answer/variants/audio/explanation.
- [ ] Accessibility covers characters, sound views, ordering, diagrams, audio.
- [ ] Standalone HTML/JS/CSS; no backend/runtime network.

## 17. Stable IDs and recommended navigation

Use:

```text
french-language/<category-id>/<family-id>/<schema-version>
```

Persist seed, data/generator/profile versions, lexeme/sense IDs, semantic frame,
features, agreement controllers, clitic structure, answer policy, audio/fault
IDs. Increment schema/data version when keyed output may change.

Recommended navigation:

1. **Sounds & Spelling**
2. **Words & Noun Phrases**
3. **Verbs & Time**
4. **Pronouns & Sentence Structure**
5. **Connected French**
6. **Reading, Listening & Interaction**

Filters may expose level, family, modality, input mode, primary/receptive
profile, register, vocabulary domain, and error review. Internal engine terms
remain developer-only.
