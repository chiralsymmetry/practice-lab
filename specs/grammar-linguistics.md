# Grammar and Linguistics — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, controlled-grammar, tree editor, finite-model, phonology, localization, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

Grammar and Linguistics

### Topic goal

Develop the ability to analyze how language is structured and how that structure contributes to meaning. The learner should become able to:

- identify word classes from distribution and context rather than from unreliable semantic slogans;
- distinguish a unit's form, such as noun phrase, from its function, such as subject;
- find constituents, heads, complements, modifiers, and clause boundaries;
- read, construct, and compare small constituency and dependency trees;
- recognize when one string supports more than one legitimate analysis;
- segment words into morphemes and infer compact morphological systems;
- track agreement, case, reference, valency, voice, and information encoded by auxiliaries;
- reason about truth conditions, entailment, scope, presupposition, and context;
- read elementary IPA and infer small phonological patterns;
- analyze unfamiliar miniature languages from aligned, glossed data without assuming that English structure is universal.

The app trains repeatable acts of analysis. It is not a prescriptive style checker, a terminology flashcard deck, or a general natural-language parser.

### Audience and prerequisites

The initial audience is an adult learner from beginner through introductory undergraduate linguistics.

Prerequisites are:

- fluent reading of short English sentences;
- comfort selecting spans and reading simple diagrams;
- elementary set/table reasoning for paradigms and semantic worlds.

No prior grammar terminology, formal logic, second language, or IPA knowledge is assumed. Each code and symbol must be introduced before it becomes an unscaffolded answer.

### Scope

The core includes:

- tokens, lexemes, word forms, morphemes, phrases, clauses, and sentences;
- contextual parts of speech;
- inflection, derivation, roots, affixes, allomorphy, and simple word structure;
- a pinned pedagogical constituency grammar for controlled contemporary English;
- constituent diagnostics as defeasible evidence;
- phrase categories, heads, complements, adjuncts, coordination, and embedding;
- grammatical functions, valency, clause type, finiteness, voice, questions, and negation;
- a restricted dependency inventory;
- agreement, pronoun case, antecedence, and tightly controlled binding;
- structural and lexical ambiguity;
- finite-world truth conditions, entailment, contradiction, quantifier and negation scope, presupposition, implicature, and deixis;
- elementary articulatory phonetics, broad IPA, phonemes/allophones, syllables, stress, and simple phonological rules;
- interlinear glossing and inference over reviewed constructed micro-languages;
- grammaticality and usage judgments only under an explicitly named variety, register, and controlled model.

The main object language is edited contemporary standard English, with explicitly labeled conversational examples where useful. The metalanguage and UI are localizable; grammatical codes remain stable.

### Exclusions

The initial app must not include:

- free-form essay grading, prose correction, or unrestricted sentence parsing;
- claims that one dialect, accent, register, or language is inherently more logical, correct, beautiful, or intelligent;
- accent reduction, diagnosis of speech disorders, speaker identity, or proficiency judgments from recordings;
- unreviewed claims about disputed constructions presented as universally settled;
- historical linguistics, language families, reconstruction, language acquisition, sociolinguistic surveys, corpus statistics, or computational NLP as primary topics;
- full X-bar theory, Minimalism, Head-driven Phrase Structure Grammar, Lexical Functional Grammar, Construction Grammar, or another research framework without a separately versioned profile;
- transformations with unrestricted traces, island constraints, control/raising theory, or advanced binding theory;
- unrestricted semantic parsing, possible-world modal semantics, tense/aspect logic, or formal pragmatics beyond finite controlled cases;
- acoustic signal analysis, narrow phonetic transcription, spectrogram grading, or automatic pronunciation scoring;
- memorizing the IPA chart without contextual classification or use;
- real-language typology generated from unreviewed word lists;
- “primitive language,” linguistic-purity, gender/race/class stereotypes, or inference from a structural pattern to a people's culture or cognition.

Writing mechanics may appear when punctuation encodes structure, but general spelling and composition belong elsewhere. Formal propositional and predicate logic belongs in the logic app. Japanese, Mandarin, and Korean instruction belongs in their language apps; examples from them require the same review as any other real language.

### Descriptive and variety policy

Every judgment item stores:

```text
variety: controlled_standard | labeled_conversational | named_reviewed_variety
register: neutral | formal | informal | context_specific
status:
  well_formed
  ill_formed_under_model
  accepted_variant
  marked_or_context_dependent
  ambiguous
  insufficient_evidence
```

“Nonstandard” is never a synonym for illogical or defective. A form outside the current controlled grammar may be a systematic feature of another variety. Feedback must say “under the stated variety/model,” not simply “wrong,” when variation is relevant.

Real-language, dialect, and accent examples require human review by someone competent in that variety. Constructed examples must not mimic a marginalized variety for comic effect.

### Normative layers: form, function, and relation

The app keeps independent annotations:

```text
TokenAnalysis {
  surface
  lemma
  partOfSpeech
  morphologicalFeatures
  phraseNode
  grammaticalFunction
  dependencyHead
  dependencyRelation
}
```

A category is not a function. `NP` is a phrase form; subject and object are functions. `ADJ` is a word class; modifier and subject complement are functions. No checker may infer one field solely from another when the grammar permits alternatives.

### Normative word-class inventory

Stable codes are:

| Code | User-facing class | Core criterion |
|---|---|---|
| `NOUN` | common noun | heads a nominal and inflects/distributes as a noun |
| `PROPN` | proper noun | conventional name used as a nominal head |
| `VERB` | lexical verb | heads the lexical predicate |
| `AUX` | auxiliary | realizes the controlled auxiliary system |
| `ADJ` | adjective | occurs in licensed attributive/predicative adjective positions |
| `ADV` | adverb | modifies a licensed verbal, adjectival, adverbial, or clause domain |
| `DET` | determiner | occupies the controlled determiner position |
| `PRON` | pronoun | pronominal nominal form |
| `ADP` | adposition | English preposition in the core profile |
| `CCONJ` | coordinating conjunction | coordinates like constituents |
| `SCONJ` | subordinating conjunction | marks a subordinate clause |
| `PART` | particle | licensed infinitival, negative, or verb-particle item |
| `NUM` | numeral | cardinal/ordinal numeral use |
| `INTJ` | interjection | standalone conventional response/exclamation |
| `PUNCT` | punctuation | written structural marker |
| `X` | other/unknown | only for explicitly unresolved data exercises |

These codes are compatible in spirit with Universal Dependencies, but the app's pinned profile is its oracle. User-facing localized names and stable codes are both accepted where text entry is used.

Classification is contextual. The same spelling may receive different codes: `book` in “the book” and “book a room”; `that` in “that book” and “I know that it works”; `to` in “to school” and “to leave.”

### Normative morphology

- `word form` is the inflected surface item; `lexeme` is the abstract vocabulary item.
- A `morpheme` is the smallest unit represented by the controlled analysis, not necessarily a syllable.
- `-` joins segmentable affixes; `=` joins clitics; `.` joins multiple features in one gloss.
- Feature bundles use stable codes such as `PL`, `PST`, `3`, `SG`, `NEG`, and `PASS`.
- Inflection realizes grammatical features without creating a new lexeme in the current profile; derivation creates a new lexeme or changes its category/central meaning.
- Allomorphs are stored as members of one morpheme with an explicit conditioned distribution.
- Word trees are rooted, ordered, binary where bracketing matters, and preserve the surface morpheme yield.

### Normative constituency model

Core phrase labels are:

```text
Clause  NP  VP  PP  AdjP  AdvP  CoordP  SubClause
```

Core lexical labels are the word-class codes above. The simplified head conventions are:

- `NP`: noun, proper noun, or pronoun;
- `VP`: lexical verb;
- `PP`: adposition;
- `AdjP`: adjective;
- `AdvP`: adverb;
- `Clause`: finite predicate relation; it is not assigned a lexical head in beginner tasks;
- `CoordP`: the shared category of its conjuncts, with a coordinator marker.

This is a pedagogical convention, not a claim that these are the only defensible analyses. In particular, the initial profile does not require DP, TP, or CP analyses.

Canonical bracket notation is:

```text
[Clause [NP The careful student] [VP solved [NP the puzzle]]]
```

Every tree must be rooted and ordered; every spoken terminal must occur once in left-to-right yield; ordinary constituents cover contiguous spans; branches do not cross; every expansion must be licensed by the active grammar profile. A controlled `<gap>` leaf may occur only in a family that explicitly licenses a relative or interrogative dependency and does not contribute to the spoken yield.

Constituency diagnostics—substitution, movement, coordination, and answer fragments—provide evidence, not universal proofs. The generator stores the intended analysis and may present `insufficient_evidence` when no conclusion follows.

### Normative functions and clause inventory

Core functions are:

```text
subject
direct_object
indirect_object
subject_complement
object_complement
complement
adjunct
determiner
modifier
predicator
coordinator
subordinator
```

Core valency frames are intransitive, transitive, ditransitive, copular, complex-transitive, and clausal-complement. Each lexical verb entry declares its licensed frames and semantic role restrictions.

Core clauses vary by declarative/interrogative/imperative, main/subordinate, finite/nonfinite, active/passive, affirmative/negative. Questions and negation follow the pinned English auxiliary profile, including support from `do`.

### Normative dependency profile

Dependency tasks use a restricted, versioned, UD-inspired inventory:

```text
root nsubj obj iobj ccomp xcomp obl
advmod aux cop mark nmod amod det case
conj cc compound
```

The dependency profile uses content-word heads: lexical verbs head auxiliary chains; predicative complements head copular clauses; nominal heads govern determiners, adjectives, and adpositions marked `case`; the first conjunct heads later `conj` dependents, whose coordinator is `cc`. Thus a constituency `PP` is headed by its adposition while the corresponding UD-inspired dependency subtree is headed by the nominal: the app must teach this representational difference explicitly.

Trees have exactly one root, one head per non-root token, no cycles, and a connected structure. Relation definitions and head choices come from the app profile; an analysis valid in another dependency framework is not silently marked wrong.

### Normative agreement, case, and reference

- Core agreement features are person `{1,2,3}` and number `{SG,PL}`.
- Present-tense lexical verbs, the complete `be` paradigm, and relevant auxiliaries are table-driven.
- Personal pronoun forms are selected from explicit nominative, objective, possessive, and reflexive tables.
- Collective nouns, singular `they`, existential agreement, `who/whom`, and notional agreement appear only with explicit variety/register rules.
- In beginner binding tasks, a reflexive requires a compatible local antecedent in the smallest displayed finite clause; a plain personal pronoun cannot use that same local subject as its intended antecedent. Generated exceptions and logophoric uses are excluded.

### Normative meaning model

Semantic tasks use a displayed finite world:

```text
World {
  entities
  unaryProperties
  binaryRelations
  discourseContext
}
```

Truth is derived only from that world. Controlled determiners are `every`, `some`, and `no`; connectives are `and`, `or`, and sentential `not`. Scope readings are stored as explicit trees or formulas. Presuppositions and implicatures are labeled separately from entailments.

### Normative phonetics and phonology

- Broad IPA symbols and articulatory features come from a versioned chart subset.
- Phonemes use slashes, `/p/`; phones use brackets, `[pʰ]`.
- Transcription exercises state the reference accent and exclude known mergers/variable forms unless variation is the lesson.
- Phonological rules use `A → B / X __ Y`.
- Syllabification is checked against the displayed onset/coda inventory, not unstated native-speaker intuition.
- Audio is optional, local, licensed, and transcript-linked. Browser or system speech synthesis may illustrate but is never the pronunciation oracle.

### Normative interlinear gloss model

Micro-language data uses three aligned layers:

```text
surface or morpheme-segmented form
morpheme-by-morpheme gloss
free translation
```

Hyphens align affixes, equals signs align clitics, periods combine feature values, and grammatical labels are uppercase. This follows a documented Leipzig-style subset. The app must display its abbreviation legend.

Constructed micro-languages are preferred for generative inference. Real-language examples require reviewed source, variety, orthography, segmentation, gloss, translation, and license metadata. The learner is never expected to know an unintroduced language.

### External standards profile

The implementation must snapshot and version the exact subsets it uses rather than fetch them at runtime:

- word-class and dependency codes are aligned where practical with [Universal Dependencies universal POS tags](https://universaldependencies.org/u/pos/index.html) and [dependency relations](https://universaldependencies.org/u/dep/index.html);
- interlinear display follows a documented subset of the [Leipzig Glossing Rules](https://www.eva.mpg.de/lingua/resources/glossing-rules.php);
- phonetic symbols and features are drawn from the [official IPA chart](https://www.internationalphoneticassociation.org/content/ipa-chart).

Alignment does not make this teaching grammar a complete UD annotation scheme, the Leipzig rules a morphological theory, or the IPA chart an accent oracle.

### Global answer conventions

- Surrounding whitespace and harmless capitalization differences are ignored in label entry.
- Stable codes and localized full labels map to the same semantic answer.
- Span answers are token-index ranges, not copied strings; punctuation inclusion is declared.
- Multiple spans, edges, or morphemes use structured controls rather than delimiter-sensitive text.
- Bracket answers are parsed into trees; redundant whitespace is ignored, but category labels and terminal order remain significant.
- Equivalent sibling ordering is not accepted in ordered constituency trees.
- For set-valued ambiguity answers, order is irrelevant and the complete intended set is required.
- IPA answers normalize Unicode and optional outer slashes/brackets only when the prompt makes the level unambiguous; phonemic and phonetic notation are not interchangeable.
- Gloss abbreviations are case-insensitive at entry but rendered canonically.
- Explanatory paraphrases are selected or assembled from controlled chunks. Unrestricted prose is never the sole graded response.

### Difficulty philosophy

Difficulty should increase through:

- weaker distributional cues and more category ambiguity;
- longer but still structurally relevant spans;
- deeper embedding and more competing attachments;
- moving from recognition to construction and error diagnosis;
- coordinating form, function, morphology, and dependency information;
- less transparent allomorphy and richer paradigms;
- more possible scope readings or finite-world entities;
- moving from one datum to a small paradigm in an unfamiliar micro-language;
- reduced tree/feature scaffolding;
- synthesis across at most three already-mastered representations.

Difficulty must not increase through obscure vocabulary, garden paths with no fair context, tiny tree labels, culturally specific knowledge, rapid audio, arbitrary sentence length, or treating a disputed judgment as uniquely obvious.

### Shared generation and rejection rules

Every instance stores the semantic structure first and derives sentence, tree, labels, answer, distractors, and explanation from it. Reject an instance when:

- a requested answer is not unique and the family does not explicitly accept a set;
- a distractor is valid under the stated profile;
- lexical selection produces implausible, unsafe, stereotyped, or pragmatically unsupported content;
- punctuation or capitalization accidentally reveals the answer;
- a diagnostic changes meaning or information structure in a way the prompt ignores;
- tree yield, feature unification, valency, agreement, dependency, or gloss alignment fails;
- the explanation cannot be regenerated from the same oracle;
- vocabulary difficulty overwhelms the structural skill;
- a real-variety judgment lacks review metadata;
- the instance duplicates another active item after semantic normalization.

## 2. Category: Word classes in context

### Category purpose

Train contextual classification from distribution, morphology, and syntactic behavior.

### Learn

A word class describes how a word behaves in a sentence, not merely what it “means.” Nouns are not simply “things,” and verbs are not simply “actions.” In “They **book** rooms,” `book` is a verb; in “the **book**,” it is a noun. Keep the word class separate from the phrase's function.

### Prerequisites

Tokens and the idea of context; none of the later tree notation is required.

### Category boundaries

This category classifies individual contextual tokens and short sequences. Phrase categories belong in Category 4; grammatical functions belong in Category 6.

### Subcategories

1. Core lexical classes
2. Function-word contrasts
3. Ambiguity and distributional evidence
4. Sequence annotation

### Common misconceptions

- Nouns must denote physical objects.
- Verbs must denote deliberate actions.
- Every word ending in `-ly` is an adverb.
- A spelling has one permanent part of speech.
- `subject`, `object`, and `predicate` are parts of speech.
- Any small function word is a preposition.

### Family `pos_noun_proper_noun`

**Task.** Classify a highlighted nominal token as `NOUN` or `PROPN`.

**Response/template.** Single choice: `In “{sentence},” what is the word class of “{token}”?`

**Derivation.** Read the contextual lexeme entry and its name/common-noun use.

**Difficulty.** L1 common objects/names; L2 abstract nouns; L3 converted or title uses.

**Misconceptions/constraints.** Capitalization alone is insufficient; sentence-initial tokens are avoided unless contrast is the lesson.

**Feedback.** Cite the determiner/name distribution and show the phrase headed by the token.

**Examples.**

1. “Patience matters,” `Patience` → `NOUN`. L1.
2. “Mina arrived,” `Mina` → `PROPN`. L1.
3. “The Thames flooded,” `Thames` → `PROPN`. L2.

**Validation/coverage.** Balance concrete/abstract and person/place names; contextual lexicon oracle.

### Family `pos_verb_context`

**Task.** Identify a lexical verb in context.

**Response/template.** Token selection: `Select the lexical verb in “{sentence}.”`

**Derivation.** Select the token licensed as the head of the sentence's lexical VP.

**Difficulty.** L1 inflected action verb; L2 state/change; L3 noun–verb homograph.

**Misconceptions/constraints.** Do not make “action word” sufficient; exclude auxiliaries from the answer.

**Feedback.** Show tense/inflection and the verb's complement frame.

**Examples.**

1. “Birds sing” → `sing`. L1.
2. “The box contains tools” → `contains`. L2.
3. “They tabled the proposal” → `tabled`. L3.

**Validation/coverage.** Include states and conversions; exactly one lexical-verb answer.

### Family `pos_adjective_context`

**Task.** Identify an adjective using its attributive or predicative distribution.

**Response/template.** Token selection: `Select the adjective in “{sentence}.”`

**Derivation.** Find the `ADJ` token in the generated analysis.

**Difficulty.** L1 before noun; L2 after copula; L3 participial-looking controlled adjective.

**Misconceptions/constraints.** Property meaning is supportive, not decisive; do not include disputed category cases.

**Feedback.** Name the licensed adjective position.

**Examples.**

1. “a narrow bridge” → `narrow`. L1.
2. “The bridge seems narrow” → `narrow`. L2.
3. “a very worried caller” → `worried`. L3.

**Validation/coverage.** Balance attributive/predicative; check intensifier compatibility where used.

### Family `pos_adverb_context`

**Task.** Identify an adverb and its modification domain.

**Response/template.** Two fields: `Select the adverb in “{sentence}” and choose what it modifies.`

**Derivation.** Return the `ADV` token and its annotated target node.

**Difficulty.** L1 manner adverb; L2 adjective/adverb modifier; L3 clause adverb without `-ly`.

**Misconceptions/constraints.** `-ly` is neither necessary nor sufficient; modifier target must be unambiguous.

**Feedback.** Bracket the modified phrase.

**Examples.**

1. “I waited patiently” → `patiently`, VP. L1.
2. “very cold water” → `very`, AdjP. L2.
3. “Maybe Jo left” → `Maybe`, Clause. L3.

**Validation/coverage.** Cover four modification domains and non-`-ly` adverbs.

### Family `pos_determiner_pronoun`

**Task.** Distinguish determiner and pronoun uses of a form.

**Response/template.** Single choice: `Is “{token}” a determiner or pronoun in “{sentence}”?`

**Derivation.** A determiner combines with the nominal head; a pronoun heads the nominal by itself in this profile.

**Difficulty.** L1 `this/these`; L2 quantifier-like inventory; L3 paired contrast.

**Misconceptions/constraints.** Do not classify by spelling alone; examples follow the pinned inventory.

**Feedback.** Display the containing NP and its head.

**Examples.**

1. “This lamp works,” `This` → `DET`. L1.
2. “This works,” `This` → `PRON`. L1.
3. “Those two vanished,” `Those` → `PRON` under the active profile. L3.

**Validation/coverage.** Every dual-use lexeme appears in both frames.

### Family `pos_auxiliary_lexical`

**Task.** Distinguish auxiliary and lexical-verb uses.

**Response/template.** Single choice: `What is “{token}” in “{sentence}”: AUX or VERB?`

**Derivation.** Use the controlled auxiliary construction and lexeme/frame annotation.

**Difficulty.** L1 modal/be; L2 perfect `have`; L3 lexical `have/do` contrast.

**Misconceptions/constraints.** Position near another verb is evidence, not the definition.

**Feedback.** Identify the auxiliary feature or the lexical verb's arguments.

**Examples.**

1. “Sam can swim,” `can` → `AUX`. L1.
2. “Sam has eaten,” `has` → `AUX`. L2.
3. “Sam has a bicycle,” `has` → `VERB`. L2.

**Validation/coverage.** Pair each ambiguous form across uses; exclude dialect-sensitive forms initially.

### Family `pos_adposition_particle`

**Task.** Distinguish a preposition (`ADP`) from a verb particle (`PART`).

**Response/template.** Single choice: `In “{sentence},” classify “{token}”.`

**Derivation.** An adposition heads a PP with an NP complement; a licensed particle forms a phrasal verb and passes the stored alternation diagnostics.

**Difficulty.** L1 obvious PP; L2 separable particle; L3 matched spelling pair.

**Misconceptions/constraints.** Semantic intuition alone is unreliable; only reviewed particle verbs appear.

**Feedback.** Show the PP complement or particle-placement contrast.

**Examples.**

1. “walked up the hill,” `up` → `ADP`. L1.
2. “looked up the number,” `up` → `PART`. L2.
3. “turned the radio off,” `off` → `PART`. L2.

**Validation/coverage.** Particle entries require attested alternation metadata.

### Family `pos_coordinator_subordinator`

**Task.** Distinguish coordinating and subordinating conjunctions.

**Response/template.** Single choice: `Classify “{token}” in “{sentence}”: CCONJ or SCONJ.`

**Derivation.** Inspect whether the token links like constituents or marks a dependent clause.

**Difficulty.** L1 `and/but`; L2 `because/although`; L3 controlled `for/since` contrasts.

**Misconceptions/constraints.** “Connects words” is too broad; require a visible structure.

**Feedback.** Display the two conjuncts or marked subordinate clause.

**Examples.**

1. “tea and coffee,” `and` → `CCONJ`. L1.
2. “left because it rained,” `because` → `SCONJ`. L1.
3. “I stayed, for it was late,” `for` → `CCONJ` in the stated formal profile. L3.

**Validation/coverage.** Register-specific examples are labeled; balance clause and phrase coordination.

### Family `pos_lexical_ambiguity`

**Task.** Assign the correct class to the same spelling in two contexts.

**Response/template.** Matching: `Match each highlighted “{form}” to its word class.`

**Derivation.** Resolve each token independently from its generated structure.

**Difficulty.** L1 noun/verb; L2 adjective/verb; L3 three-way function-word contrast.

**Misconceptions/constraints.** Both contexts must be natural and the active profile must make each analysis unique.

**Feedback.** Contrast the distributional frames side by side.

**Examples.**

1. “a clean room” / “clean the room” → `ADJ` / `VERB`. L1.
2. “before lunch” / “before we ate” → `ADP` / `SCONJ`. L2.
3. “that plan” / “I know that it works” → `DET` / `SCONJ`. L2.

**Validation/coverage.** Pair-level uniqueness and balanced class transitions.

### Family `pos_distributional_frame`

**Task.** Infer which word class can occupy a displayed syntactic frame.

**Response/template.** Single choice: `Which item can fill the blank in “{frame}”?`

**Derivation.** Insert each candidate and test the active grammar and selection constraints.

**Difficulty.** L1 determiner+noun; L2 degree+adjective/adverb; L3 competing semantically plausible distractors.

**Misconceptions/constraints.** The answer follows distribution, not real-world plausibility alone.

**Feedback.** Name the frame and why each distractor fails.

**Examples.**

1. “the ___ arrived”: `pilot` among `pilot/quietly/under`. L1.
2. “seems very ___”: `calm` among `calm/calmly/calmness`. L2.
3. “has ___ finished”: `already` among `already/arrival/blue`. L2.

**Validation/coverage.** Every distractor has a distinct category mismatch; sentence remains interpretable.

### Family `pos_sequence_tag`

**Task.** Tag every token in a short sentence with the pinned POS inventory.

**Response/template.** Per-token dropdowns: `Assign a word class to each token in “{sentence}”.`

**Derivation.** Compare the complete token-tag sequence with the oracle.

**Difficulty.** L1 three tokens; L2 function words; L3 homographs and auxiliaries; L4 embedded clause.

**Misconceptions/constraints.** No unresolved token ambiguity; punctuation is separately tagged when shown.

**Feedback.** Reveal the sequence and one distributional reason per error.

**Examples.**

1. “Birds fly.” → `NOUN VERB PUNCT`. L1.
2. “Those birds can fly.” → `DET NOUN AUX VERB PUNCT`. L2.
3. “I know that birds fly.” → `PRON VERB SCONJ NOUN VERB PUNCT`. L3.

**Validation/coverage.** Tag/parse agreement and class balance over long sessions.

### Cross-family progression

Start with one highlighted content word, introduce function-word contrasts, then paired ambiguity and complete sequences. Production tagging is withheld until each included class is mastered in recognition.

## 3. Category: Morphology and word structure

### Category purpose

Train segmentation and inference about how word forms encode grammatical features or create lexemes.

### Learn

Words can contain smaller meaningful pieces. In `walk-ed`, `walk` is the root and `-ed` realizes past tense; in `kind-ness`, `-ness` derives a noun. One morpheme may have different surface allomorphs, as English plural spelling/pronunciation demonstrates.

### Prerequisites

Word classes in context; the app introduces feature codes before requiring them.

### Category boundaries

This category analyzes structure inside words. Phrase structure starts in Category 4; sound-conditioned alternations connect to Category 9.

### Subcategories

1. Morphemes and segmentation
2. Inflection and derivation
3. Features and allomorphy
4. Word trees and miniature systems

### Common misconceptions

- Every syllable is a morpheme.
- Every orthographic substring has a meaning.
- A suffix always has one spelling or pronunciation.
- Inflection and derivation differ only by position.
- Word structure is always left-to-right without hierarchy.

### Family `morph_segment_word`

**Task.** Divide a controlled word into its morphemes.

**Response/template.** Boundary placement: `Place morpheme boundaries in “{word}”.`

**Derivation.** Return the terminal segmentation of the stored word tree.

**Difficulty.** L1 one transparent suffix; L2 prefix+suffix; L3 repeated/zero-excluded distractors.

**Misconceptions/constraints.** All items have one analysis under the supplied lexicon; no folk etymology.

**Feedback.** Give each segment's contribution.

**Examples.**

1. `walked` → `walk-ed`. L1.
2. `reusable` → `re-use-able`. L2.
3. `unhappiness` → `un-happi-ness` with orthographic alternation noted. L3.

**Validation/coverage.** Recombine via morphophonology to exact surface form.

### Family `morph_free_bound`

**Task.** Classify morphemes as free or bound.

**Response/template.** Per-morpheme choices: `Which morphemes in {segmentation} can stand alone?`

**Derivation.** Look up `bound` metadata for each morpheme in the active lexicon.

**Difficulty.** L1 root/affix; L2 bound root; L3 clitic profile.

**Misconceptions/constraints.** “Looks like a word” is insufficient; the language profile defines standalone status.

**Feedback.** Contrast lexical occurrence with independent-word use.

**Examples.**

1. `cat-s` → `cat` free, `-s` bound. L1.
2. `un-kind` → `un-` bound, `kind` free. L1.
3. `cran-berry` → `cran-` bound in the controlled synchronic analysis, `berry` free. L3.

**Validation/coverage.** Include bound roots only after explanation; do not use disputed segmentations.

### Family `morph_root_affix`

**Task.** Identify root, prefix, and suffix in a segmented form.

**Response/template.** Matching labels to morpheme chips.

**Derivation.** Read node roles from the word structure.

**Difficulty.** L1 one affix; L2 both sides; L3 multiple suffixes.

**Misconceptions/constraints.** Root is not necessarily the longest segment or a free word.

**Feedback.** Show the root path and affix attachment.

**Examples.**

1. `help-ful` → root `help`, suffix `-ful`. L1.
2. `un-lock` → prefix `un-`, root `lock`. L1.
3. `nation-al-ize` → root `nation`, suffixes `-al`, `-ize`. L3.

**Validation/coverage.** Role labels agree with the word tree and lexeme derivation chain.

### Family `morph_inflection_derivation`

**Task.** Decide whether a highlighted affix is inflectional or derivational.

**Response/template.** Single choice: `What process does {affix} express in {word}?`

**Derivation.** Check whether the operation realizes a feature of one lexeme or constructs a derived lexeme.

**Difficulty.** L1 plural/past versus category-changing suffix; L2 meaning-changing same-category derivation; L3 mixed chain.

**Misconceptions/constraints.** Category change is strong evidence but not the definition.

**Feedback.** Show input/output lexeme and feature/category.

**Examples.**

1. `cat-s` → inflection (`PL`). L1.
2. `teach-er` → derivation (`VERB` to `NOUN`). L1.
3. `un-happy` → derivation despite remaining an adjective. L2.

**Validation/coverage.** Balance category-changing and category-preserving derivation.

### Family `morph_feature_bundle`

**Task.** Read or construct the grammatical feature bundle realized by a word form.

**Response/template.** Multiple choice or feature toggles: `Which features does “{form}” realize here?`

**Derivation.** Unify lexeme paradigm cell with sentence context.

**Difficulty.** L1 number/tense; L2 person+number; L3 multi-feature micro-language form.

**Misconceptions/constraints.** Lexical meaning is not a grammatical feature; syncretic forms require context or accept a set.

**Feedback.** Show the paradigm coordinates.

**Examples.**

1. `cats` → `PL`. L1.
2. `walked` → `PST`. L1.
3. `runs` in “She runs” → `PRS.3.SG`. L2.

**Validation/coverage.** Paradigm lookup and context unification must agree.

### Family `morph_allomorph_select`

**Task.** Select the allomorph licensed by an explicit conditioning rule.

**Response/template.** Single choice: `Given {stem_features}, which form of {morpheme} occurs?`

**Derivation.** Apply ordered environment predicates, then surface rules.

**Difficulty.** L1 two phonological environments; L2 three-way choice; L3 morphological exception class.

**Misconceptions/constraints.** Orthography and pronunciation are not conflated.

**Feedback.** State the triggering environment.

**Examples.**

1. plural after `/k/` → `/s/`. L2.
2. plural after `/d/` → `/z/`. L2.
3. plural after `/s/` → `/ɪz/`. L2.

**Validation/coverage.** Exhaustively test every environment boundary and exception.

### Family `morph_word_tree`

**Task.** Choose or build the hierarchical structure of a polymorphemic word.

**Response/template.** Tree choice/editor: `Build the word tree for {word} with meaning {meaning}.`

**Derivation.** Compose affixes only with licensed input categories and semantic scopes.

**Difficulty.** L1 one affix; L2 two unambiguous attachments; L3 structurally ambiguous word with paraphrase.

**Misconceptions/constraints.** Linear order alone does not determine scope.

**Feedback.** Show each intermediate category and meaning.

**Examples.**

1. `teacher` → `[N [V teach] -er]`. L1.
2. `unhelpful` → `[Adj un- [Adj [N help] -ful]]`. L2.
3. `unlockable` meaning “able to be unlocked” → `[Adj [V un- lock] -able]`. L3.

**Validation/coverage.** Each internal attachment passes affix category constraints.

### Family `morph_productivity_construct`

**Task.** Construct a possible new form in a displayed miniature morphology.

**Response/template.** Morpheme ordering: `Use {inventory} to express {feature_bundle}.`

**Derivation.** Select one morpheme per requested feature and order by the shown template.

**Difficulty.** L1 one affix; L2 two slots; L3 allomorph plus ordering.

**Misconceptions/constraints.** Use constructed data so lexical acceptability is fully controlled.

**Feedback.** Fill the morphological template slot by slot.

**Examples.**

1. Rule `stem-na = PL`; `mip` plural → `mipna`. L1.
2. Template `NEG-root-PST`; `see`, negative past → `ka-see-tu`. L2.
3. `PL` is `-i` after consonant, `-yi` after vowel; `palo` plural → `paloyi`. L3.

**Validation/coverage.** Round-trip parse/generated form; balanced slot combinations.

### Family `morph_order_infer`

**Task.** Infer affix order from a small paradigm.

**Response/template.** Ordered sequence: `From the data, put {morphemes} in surface order.`

**Derivation.** Solve the unique slot ordering consistent with all displayed forms.

**Difficulty.** L1 two affixes; L2 three slots; L3 syncretism with enough disambiguating rows.

**Misconceptions/constraints.** At least two contrastive rows; reject multiple compatible orders.

**Feedback.** Align the decisive paradigm rows.

**Examples.**

1. `lum` “see,” `lum-ta` “saw,” `mi-lum` “not see” → `NEG-root-TENSE`. L1.
2. `dak-i-m` = dog-PL-1POSS → root-number-possessor. L2.
3. Four-row paradigm uniquely yields `root-CASE-NUM`. L3.

**Validation/coverage.** Enumerate compatible orders and require cardinality one.

### Family `morph_analysis_audit`

**Task.** Find the first error in a proposed segmentation, gloss, or word tree.

**Response/template.** Error selection plus corrected chip/tree.

**Derivation.** Compare proposal with the active lexicon, surface rules, and attachment constraints.

**Difficulty.** L1 boundary error; L2 feature/gloss error; L3 locally valid parts with invalid hierarchy.

**Misconceptions/constraints.** Exactly one primary error; corrections cannot require external etymology.

**Feedback.** Identify the violated invariant and repair it.

**Examples.**

1. `walked → wal-ked` → boundary error. L1.
2. `cats: cat-PL.PST` → gloss error; `-s` is `PL`. L1.
3. `[V [Adj kind] -ness]` → category/attachment error; result is `NOUN`. L2.

**Validation/coverage.** Mutation tests produce one independently detectable fault.

### Cross-family progression

Begin with transparent segmentation, then distinguish morph roles and processes. Add feature paradigms and allomorphy before asking learners to infer or construct miniature systems.

## 4. Category: Constituency and phrase structure

### Category purpose

Build the ability to group words into nested units and justify those groupings with structural evidence.

### Learn

A constituent is a word or group of words that acts as a unit in the active grammar. In `[Clause [NP The red kite] [VP landed [PP near [NP us]]]]`, `the red kite`, `near us`, and the whole VP are constituents. A successful substitution or movement can support an analysis, but no single classroom test is an infallible proof.

### Prerequisites

Core word classes. Bracket syntax is introduced visually before typed construction.

### Category boundaries

This category establishes one intended parse. Comparing alternative parses belongs in Category 5; subject/object functions belong in Category 6.

### Subcategories

1. Spans and phrase categories
2. Heads and dependents
3. Constituency evidence
4. Brackets, rules, and yields

### Common misconceptions

- Any adjacent words form a constituent.
- Every constituent can move naturally in every sentence.
- A phrase must contain several words.
- The first word is the head.
- Coordination or punctuation guarantees a constituent.
- One failed diagnostic proves non-constituency.

### Family `constituent_span_select`

**Task.** Select a requested constituent span. **Response/template.** Token-span selection: `Select the {phrase_label} in “{sentence}”.`

**Derivation.** Return the unique node yield with that label and prompt role. **Difficulty.** L1 subject NP; L2 nested PP/NP; L3 same-label competitors.

**Misconceptions/constraints.** Prompt distinguishes repeated labels; punctuation policy is explicit. **Feedback.** Highlight the node and parent.

**Examples.** 1. “The dog slept”: NP → `The dog`. L1. 2. “We waited near the gate”: PP → `near the gate`. L1. 3. “The key to the cabinet vanished”: modifier PP → `to the cabinet`. L2.

**Validation/coverage.** Selected indexes exactly equal one oracle node yield.

### Family `constituent_phrase_category`

**Task.** Name the category of a highlighted constituent. **Response/template.** Single choice: `What kind of phrase is [{span}]?`

**Derivation.** Read the node label. **Difficulty.** L1 NP/VP; L2 PP/AdjP/AdvP; L3 clauses and coordination.

**Misconceptions/constraints.** Choices are forms, not functions. **Feedback.** Identify the head and distribution.

**Examples.** 1. `the small boat` → NP. L1. 2. `extremely useful` → AdjP. L2. 3. `after the meeting ended` → SubClause. L3.

**Validation/coverage.** Balance all active phrase labels and one-word phrases.

### Family `constituent_head_identify`

**Task.** Identify a phrase's head. **Response/template.** Token selection: `Select the head of [{phrase}].`

**Derivation.** Apply the pinned head rules to the oracle node. **Difficulty.** L1 simple NP/PP; L2 modifiers; L3 auxiliary-rich VP.

**Misconceptions/constraints.** Do not choose the first or most contentful word automatically. **Feedback.** Show which distribution the head controls.

**Examples.** 1. `the old bridge` → `bridge`. L1. 2. `under the bridge` → `under`. L1. 3. `may have arrived` → `arrived` under this profile. L3.

**Validation/coverage.** Exactly one head per headed phrase; profile named in VP items.

### Family `constituent_substitution_test`

**Task.** Judge what a substitution diagnostic supports. **Response/template.** Choice: `Replacing {span} with {proform} yields {result}. What evidence does this provide?`

**Derivation.** Compare original and transformed stored parses and judgment. **Difficulty.** L1 NP pronoun; L2 VP `do so`; L3 inconclusive/meaning-changing case.

**Misconceptions/constraints.** Answer may be supports, weighs against, or insufficient. **Feedback.** Explain the preserved or broken structure.

**Examples.** 1. `the tall student → she` supports NP. L1. 2. `read the report → did so` supports VP. L2. 3. An independently ungrammatical replacement → insufficient evidence. L3.

**Validation/coverage.** Transformation and judgment are authored from the same parse.

### Family `constituent_movement_test`

**Task.** Interpret a controlled movement/fronting test. **Response/template.** Three-way judgment on `{original}` and `{fronted}`.

**Derivation.** Use reviewed movement license and whether the moved span is an oracle constituent. **Difficulty.** L1 PP fronting; L2 VP/cleft; L3 grammatical but information-structurally marked.

**Misconceptions/constraints.** Marked does not mean ill formed; no universal movement claims. **Feedback.** Label variety/register and evidential strength.

**Examples.** 1. “After lunch, we left” supports PP `after lunch`. L1. 2. “The book, I read” is marked topic fronting, not automatic failure. L3. 3. Moving `the` alone weighs against it as NP. L1.

**Validation/coverage.** Every judgment has human-reviewed profile metadata.

### Family `constituent_coordination_test`

**Task.** Determine whether a proposed coordination supplies constituency evidence. **Response/template.** Choice with bracketed conjuncts.

**Derivation.** Require compatible categories/functions under the core coordination rule. **Difficulty.** L1 NPs; L2 VPs/PPs; L3 deceptive nonconstituent strings.

**Misconceptions/constraints.** Coordination is evidence, with exceptional constructions excluded. **Feedback.** Show both conjunct roots.

**Examples.** 1. `[tea] and [coffee]` supports nominal constituents. L1. 2. `[under the bed] and [behind the door]` supports PPs. L2. 3. `*the and a book` does not support `the` as NP. L1.

**Validation/coverage.** Like-category invariant and semantic compatibility checks.

### Family `constituent_bracket_sentence`

**Task.** Construct a complete bracketed parse. **Response/template.** Tree editor or constrained bracket text.

**Derivation.** Compare normalized ordered labeled trees. **Difficulty.** L1 Clause=NP+VP; L2 complements/modifiers; L3 one embedded clause.

**Misconceptions/constraints.** Terminal yield and labels are exact; prompts have one intended parse. **Feedback.** Highlight the first divergent node.

**Examples.** 1. `Birds sing` → `[Clause [NP Birds] [VP sing]]`. L1. 2. `Mia read the note` → VP contains object NP. L2. 3. `I know that birds sing` → VP contains SubClause. L3.

**Validation/coverage.** Tree grammar, terminal-once, and yield invariants.

### Family `constituent_rule_expand`

**Task.** Choose a licensed expansion for a node. **Response/template.** Single choice: `Which rule can expand {node} here?`

**Derivation.** Filter active grammar productions by node and feature constraints. **Difficulty.** L1 `Clause→NP VP`; L2 optional modifiers; L3 coordination/embedding.

**Misconceptions/constraints.** Rules belong to the displayed profile, not universal grammar. **Feedback.** Instantiate the winning rule.

**Examples.** 1. Clause → NP VP. L1. 2. PP → ADP NP. L1. 3. SubClause → SCONJ Clause. L2.

**Validation/coverage.** Distractors cannot derive the displayed yield.

### Family `constituent_tree_yield`

**Task.** Recover the sentence yield from an ordered tree. **Response/template.** Ordered token chips.

**Derivation.** Traverse terminal leaves left to right, omitting licensed gap leaves. **Difficulty.** L1 shallow; L2 nested; L3 gap/coordination.

**Misconceptions/constraints.** Do not read by vertical position or head first. **Feedback.** Animate in-order leaf traversal.

**Examples.** 1. `[Clause [NP Bees] [VP hum]]` → `Bees hum`. L1. 2. Nested PP yields `under the old table`. L2. 3. Relative tree omits `<gap>` from speech. L3.

**Validation/coverage.** Yield exactly matches stored token sequence.

### Family `constituent_count_nodes`

**Task.** Count constituents satisfying a category/span condition. **Response/template.** Integer input.

**Derivation.** Count matching nodes, with lexical leaves included only when stated. **Difficulty.** L1 visible phrase nodes; L2 nested same labels; L3 condition combinations.

**Misconceptions/constraints.** Prompt defines whether whole sentence and one-word phrases count. **Feedback.** Highlight counted nodes.

**Examples.** 1. `[Clause [NP Birds] [VP sing]]` has one NP. L1. 2. `the key to the door` has two NPs under the shown tree. L2. 3. Count PPs inside the VP only. L3.

**Validation/coverage.** Count computed, never hand-authored.

### Family `constituent_complement_adjunct`

**Task.** Classify a phrase as selected complement or optional adjunct. **Response/template.** Single choice in a displayed lexical frame.

**Derivation.** Compare dependent role with the head's stored valency frame. **Difficulty.** L1 obligatory object versus time phrase; L2 PP selection; L3 context-sensitive frame pair.

**Misconceptions/constraints.** Omittability alone is not decisive; use only reviewed clear cases. **Feedback.** Show the head's frame and repeatability/selection cues.

**Examples.** 1. `devoured [the meal]` → complement. L1. 2. `slept [after lunch]` → adjunct. L1. 3. `relied [on Mia]` → selected complement. L2.

**Validation/coverage.** Lexicon role and tree edge agree.

### Family `constituency_evidence_audit`

**Task.** Diagnose an overclaim based on a constituency test. **Response/template.** Select faulty inference and repair it.

**Derivation.** Compare claimed conclusion with the test's licensed evidential status. **Difficulty.** L2 single test; L3 interacting tests; L4 genuine ambiguity.

**Misconceptions/constraints.** Never teach diagnostics as exceptionless proofs. **Feedback.** Separate observation from conclusion.

**Examples.** 1. “It moves, therefore it is always a constituent” → overclaim. L2. 2. Failed pronoun replacement with wrong agreement → test invalid. L2. 3. Two tests point differently → `insufficient evidence`, not forced answer. L3.

**Validation/coverage.** Each mutation has one explicit inferential flaw.

### Cross-family progression

Move from span recognition to categories and heads, then interpret individual diagnostics. Only then require full tree construction, counting, and evidence audits.

## 5. Category: Parse trees and structural ambiguity

### Category purpose

Train exact reading and comparison of hierarchical analyses, including cases where more than one structure is legitimate.

### Learn

One word string can encode different structures. “I saw the person with binoculars” may attach `with binoculars` to the seeing event or to `the person`. A good analysis preserves both readings rather than pretending punctuation or intuition makes one impossible.

### Prerequisites

Constituent spans, phrase labels, heads, and bracket notation.

### Category boundaries

The focus is alternative constituency structure. Lexical versus structural ambiguity as meaning types also appears in Category 8.

### Subcategories

1. Reading and building trees
2. Attachment and scope
3. Paraphrase-to-parse mapping
4. Well-formedness audits

### Common misconceptions

- A sentence can have only one parse.
- Linear closeness determines attachment.
- Different trees must have different word order.
- Any imaginable bracketing is grammatically licensed.
- A parser's preferred analysis is the only correct one.

### Family `parse_tree_relation_read`

**Task.** Read a parent, child, sibling, dominance, or span relation from a tree. **Response/template.** Single choice or node selection.

**Derivation.** Query the oracle tree relation. **Difficulty.** L1 parent/child; L2 ancestor/sibling; L3 lowest common ancestor.

**Misconceptions/constraints.** Clearly distinguish immediate from transitive dominance. **Feedback.** Highlight the relevant path.

**Examples.** 1. Parent of subject NP → Clause. L1. 2. Object NP is child of VP. L1. 3. Lowest node containing `the old bridge` → NP. L2.

**Validation/coverage.** Relation computed from node IDs, not screen geometry.

### Family `parse_tree_build`

**Task.** Assemble a tree from nodes and terminals. **Response/template.** Drag/drop tree editor.

**Derivation.** Normalize and compare with the intended tree. **Difficulty.** L1 shallow; L2 nested PP; L3 embedding/coordination.

**Misconceptions/constraints.** Exactly one intended parse; ambiguity tasks use other families. **Feedback.** Locate first wrong attachment.

**Examples.** 1. Build `The child laughed`. L1. 2. Build `The child opened the box`. L2. 3. Build `Rae said that the child laughed`. L3.

**Validation/coverage.** Grammar, arity, yield, and head constraints.

### Family `parse_tree_compare`

**Task.** Identify the structural difference between two trees with the same yield. **Response/template.** Select differing attachment/node description.

**Derivation.** Compute the smallest nonmatching constituent spans. **Difficulty.** L2 one attachment; L3 scope/coordination; L4 multiple internal differences.

**Misconceptions/constraints.** Cosmetic layout changes are normalized away. **Feedback.** Overlay the differing nodes.

**Examples.** 1. PP attaches to VP versus NP. L2. 2. Adverb modifies VP versus Clause. L2. 3. `old [men and women]` versus `[old men] and women`. L3.

**Validation/coverage.** Trees share identical terminals and differ in target structure.

### Family `parse_pp_attachment`

**Task.** Choose the parse matching a stated PP interpretation. **Response/template.** Tree choice from a sentence plus paraphrase.

**Derivation.** Map instrumental/event PP to VP or nominal-description PP to NP under stored frames. **Difficulty.** L1 explicit paraphrase; L2 world context; L3 two nested PPs.

**Misconceptions/constraints.** Do not claim either parse is impossible without context. **Feedback.** State the attachment and reading.

**Examples.** 1. “saw the person with binoculars,” observer used binoculars → VP attachment. L2. 2. Person carried binoculars → NP attachment. L2. 3. `put the cup on the tray by the door` with supplied location reading. L3.

**Validation/coverage.** Paraphrase truth conditions uniquely select one tree.

### Family `parse_coordination_scope`

**Task.** Choose the grouping of a coordinated string. **Response/template.** Bracket choice or paraphrase match.

**Derivation.** Construct licensed left/right/shared-modifier structures. **Difficulty.** L2 three conjunct nouns; L3 modifier scope; L4 ellipsis excluded.

**Misconceptions/constraints.** Prosody is not assumed unless audio is supplied. **Feedback.** Expand the grouped meaning.

**Examples.** 1. `tea or [coffee and juice]`. L2. 2. `[old men] and women` versus `old [men and women]`. L3. 3. `French teachers and students` with supplied paraphrase. L3.

**Validation/coverage.** Both distractor parses must be grammatical and semantically distinct.

### Family `parse_modifier_scope`

**Task.** Map a modifier's semantic scope to a tree. **Response/template.** Tree choice.

**Derivation.** Attach modifier to the node corresponding to its stored semantic operator. **Difficulty.** L2 adjective/adverb; L3 negation; L4 nested operators.

**Misconceptions/constraints.** Scope is not always nearest-word modification. **Feedback.** Give bracketed paraphrases.

**Examples.** 1. `former [music teacher]` versus `[former music] teacher`. L2. 2. `almost [won every race]`. L3. 3. `not [always available]` versus `[not always] available`. L3.

**Validation/coverage.** Each tree maps to distinct controlled semantics.

### Family `parse_category_driven`

**Task.** Select a parse after resolving a contextual word-class ambiguity. **Response/template.** Sentence/context plus tree choices.

**Derivation.** Filter trees by the selected lexeme category and grammar productions. **Difficulty.** L2 noun/verb; L3 particle/preposition; L4 multiple local ambiguities with one context resolution.

**Misconceptions/constraints.** Context must decisively choose the intended reading. **Feedback.** Show category decision before attachment.

**Examples.** 1. `They can fish` with activity context: `can` AUX, `fish` VERB. L2. 2. `They can fish` with packing context: `can` VERB, `fish` NOUN. L3. 3. `looked up the street` with direction versus search context. L3.

**Validation/coverage.** Intended tree is sole context-compatible candidate.

### Family `parse_ambiguity_paraphrase`

**Task.** Match each parse to an unambiguous paraphrase. **Response/template.** Matching.

**Derivation.** Each parse stores one canonical meaning representation and paraphrase. **Difficulty.** L2 two readings; L3 three readings; L4 scope plus attachment.

**Misconceptions/constraints.** Paraphrases must not add irrelevant facts. **Feedback.** Highlight the structural source.

**Examples.** 1. Binocular PP readings. L2. 2. `Visiting relatives can be tiring`: activity versus relatives who visit. L3. 3. `Everyone didn't leave`: none versus not all in labeled usage. L3.

**Validation/coverage.** Human review verifies naturalness and semantic separation.

### Family `parse_count_valid`

**Task.** Count all valid parses under a displayed miniature grammar. **Response/template.** Integer plus optional tree selection.

**Derivation.** Exhaustively parse the token sequence and deduplicate normalized trees. **Difficulty.** L2 1–2 parses; L3 Catalan-like small attachment; L4 feature constraints prune candidates.

**Misconceptions/constraints.** Grammar is fully displayed or already learned; cap at five parses. **Feedback.** Show all valid trees.

**Examples.** 1. Unambiguous `birds sing` → 1. L1. 2. One PP with two licensed attachments → 2. L2. 3. Two modifiers with feature constraint → computed 3. L3.

**Validation/coverage.** Parser enumeration and answer cardinality are identical.

### Family `parse_wellformed_audit`

**Task.** Find a structural invariant violated by a proposed tree. **Response/template.** Fault choice and node repair.

**Derivation.** Run root, yield, crossing, category-production, and gap-license validators. **Difficulty.** L1 duplicate/missing terminal; L2 bad production; L3 illicit gap/crossing.

**Misconceptions/constraints.** One injected primary fault. **Feedback.** Name the invariant and show corrected local tree.

**Examples.** 1. `dog` appears twice → yield violation. L1. 2. PP expands directly as `DET NOUN` → production violation. L2. 3. Unlicensed `<gap>` → dependency violation. L3.

**Validation/coverage.** Mutation suite covers every tree invariant.

### Cross-family progression

Read tree relationships before building. Introduce one attachment ambiguity with explicit paraphrases, then scope and parse enumeration. Audits come after construction competence.

## 6. Category: Grammatical functions and clause structure

### Category purpose

Train analysis of what phrases do in clauses and how predicates organize their arguments.

### Learn

Form and function answer different questions. In “The robot moved the crate,” both `the robot` and `the crate` are NPs, but the first is subject and the second direct object. Verb valency helps determine which complements a clause can contain.

### Prerequisites

Word classes, phrase categories, heads, complements, and adjuncts.

### Category boundaries

This category uses constituency and valency. Dependency edge labels are introduced in Category 7; truth-conditional roles are not inferred from real-world agency.

### Subcategories

1. Core functions
2. Valency and complementation
3. Clause features and voice
4. Question and negation structure

### Common misconceptions

- The subject is always the doer or first noun.
- The object is any noun after a verb.
- Linking verbs take direct objects.
- Passive clauses have no subject.
- Every omitted phrase is an adjunct.
- `not` can be inserted before any lexical verb without an auxiliary.

### Family `function_subject_identify`

**Task.** Identify the grammatical subject. **Response/template.** Span selection.

**Derivation.** Return the NP bearing `subject` in the oracle clause. **Difficulty.** L1 canonical declarative; L2 question/passive; L3 expletive subject.

**Misconceptions/constraints.** Doer and first-NP heuristics receive counterexamples. **Feedback.** Show agreement and clause position evidence.

**Examples.** 1. “The child laughed” → `The child`. L1. 2. “Was the door opened?” → `the door`. L2. 3. “There are two seats” → expletive `There` under the pinned profile. L3.

**Validation/coverage.** Exactly one syntactic subject per core finite clause.

### Family `function_objects_identify`

**Task.** Distinguish direct and indirect objects. **Response/template.** Label selected NP spans.

**Derivation.** Read roles from the licensed verb frame. **Difficulty.** L1 transitive object; L2 double-object ditransitive; L3 alternation comparison.

**Misconceptions/constraints.** Linear order is not the sole cue; PP recipient is not labeled indirect object in this profile. **Feedback.** Show the valency frame.

**Examples.** 1. “Ari opened the box” → direct object `the box`. L1. 2. “Ari gave Jo the key” → indirect `Jo`, direct `the key`. L2. 3. “Ari gave the key to Jo” → direct object only; `to Jo` is PP complement. L3.

**Validation/coverage.** Alternating frames remain explicitly distinct.

### Family `function_predicative_complement`

**Task.** Identify and classify subject or object predicative complements. **Response/template.** Span plus function choice.

**Derivation.** Use copular or complex-transitive frame and co-reference/property relation. **Difficulty.** L2 subject complement; L3 object complement; L4 NP versus AdjP complement.

**Misconceptions/constraints.** A postverbal NP after copula is not a direct object. **Feedback.** State which NP the complement predicates of.

**Examples.** 1. “Lee is a pilot” → `a pilot`, subject complement. L2. 2. “The soup became cold” → `cold`, subject complement. L2. 3. “They painted the door red” → `red`, object complement. L3.

**Validation/coverage.** Predicate target relation is stored and unique.

### Family `function_adjunct_identify`

**Task.** Identify an adjunct and its domain. **Response/template.** Span selection plus VP/Clause/NP choice.

**Derivation.** Select dependent annotated as optional modifier outside the head's valency frame. **Difficulty.** L1 time/place; L2 manner/reason; L3 NP modifier.

**Misconceptions/constraints.** Optionality is not a standalone test. **Feedback.** Contrast core frame with added information.

**Examples.** 1. “Mia slept after lunch” → `after lunch`, VP adjunct. L1. 2. “Fortunately, Mia arrived” → Clause adjunct. L2. 3. “the book on the desk” → NP modifier. L2.

**Validation/coverage.** Role/domain annotation agrees with tree attachment.

### Family `function_valency_frame`

**Task.** Classify or complete a verb's clause frame. **Response/template.** Frame choice or slot filling.

**Derivation.** Match realized complements to a licensed lexicon frame. **Difficulty.** L1 intransitive/transitive; L2 ditransitive/copular; L3 complex/clausal.

**Misconceptions/constraints.** Adjuncts do not add valency slots. **Feedback.** Render frame such as `NP V NP`.

**Examples.** 1. “The baby slept” → intransitive. L1. 2. “Mara gave Kim a map” → ditransitive. L2. 3. “We considered the plan risky” → complex-transitive. L3.

**Validation/coverage.** All complements satisfy the selected lexical frame.

### Family `clause_finite_nonfinite`

**Task.** Classify a highlighted clause as finite or nonfinite. **Response/template.** Single choice.

**Derivation.** Inspect finite tense/modal feature versus infinitival/participial form under the profile. **Difficulty.** L1 main finite; L2 `to` infinitive; L3 participial/auxiliary chain.

**Misconceptions/constraints.** A clause need not have an overt subject; past-looking participles are context-resolved. **Feedback.** Mark the verb sequence and feature.

**Examples.** 1. `Birds fly` → finite. L1. 2. `to leave early` → nonfinite. L1. 3. `having finished the work` → nonfinite. L3.

**Validation/coverage.** Morphological features and clause label agree.

### Family `clause_type_classify`

**Task.** Classify clause force and main/subordinate status. **Response/template.** Two named choices.

**Derivation.** Read clause features and structural embedding. **Difficulty.** L1 declarative/interrogative; L2 imperative; L3 subordinate question/declarative.

**Misconceptions/constraints.** Word order alone is insufficient; punctuation is not the oracle. **Feedback.** Cite auxiliary/subject/complementizer structure.

**Examples.** 1. “The train left.” → main declarative. L1. 2. “Did the train leave?” → main interrogative. L1. 3. “whether the train left” → subordinate interrogative. L3.

**Validation/coverage.** Sentence realization and clause feature bundle round-trip.

### Family `clause_active_passive_map`

**Task.** Map functions between active and passive clauses. **Response/template.** Matching or construct controlled transformation.

**Derivation.** Promote active object to passive subject, inflect `be`+participle, optionally realize agent `by`-PP. **Difficulty.** L2 transitive; L3 tense/auxiliary; L4 ditransitive profile.

**Misconceptions/constraints.** Meaning roles are preserved, functions change; reject nonpassivizable entries. **Feedback.** Align arguments across clauses.

**Examples.** 1. “Mia opened the door” → “The door was opened by Mia.” L2. 2. `the door` object → passive subject. L1. 3. Passive without `by` phrase still has a subject. L2.

**Validation/coverage.** Feature unification and semantic-role identity.

### Family `clause_question_auxiliary`

**Task.** Build or analyze English yes/no and wh-question auxiliary structure. **Response/template.** Ordered chips or identify moved/inserted auxiliary.

**Derivation.** Invert first finite auxiliary; otherwise insert inflected `do`, preserving lexical base form. **Difficulty.** L1 `be/modal`; L2 do-support; L3 multi-auxiliary/wh subject contrast.

**Misconceptions/constraints.** Do not double-mark tense on lexical verb. **Feedback.** Show declarative-to-question steps.

**Examples.** 1. “Mia is ready” → “Is Mia ready?” L1. 2. “Mia left” → “Did Mia leave?” L2. 3. “Who left?” requires no do-support in subject-wh profile. L3.

**Validation/coverage.** Generated question parses and feature bundles validate.

### Family `clause_negation_auxiliary`

**Task.** Place negation and supply any required auxiliary. **Response/template.** Ordered chips or missing-form entry.

**Derivation.** Attach `not` after the finite auxiliary; insert `do` if no auxiliary is present, except copular `be`. **Difficulty.** L1 be/modal; L2 lexical verb; L3 tense/agreement.

**Misconceptions/constraints.** Avoid prescriptive contracted-form disputes; canonical full forms are oracle. **Feedback.** Separate tense on auxiliary from lexical base.

**Examples.** 1. “Mia is ready” → “Mia is not ready.” L1. 2. “Mia walks” → “Mia does not walk.” L2. 3. “They left” → “They did not leave.” L2.

**Validation/coverage.** Negated clause has one finite tense carrier and one negator.

### Family `clause_function_audit`

**Task.** Diagnose one incorrect function or clause-feature label. **Response/template.** Select annotation and replace label.

**Derivation.** Compare proposed annotation with tree, frame, and feature oracle. **Difficulty.** L1 subject/object swap; L2 complement/adjunct; L3 passive/nonfinite interaction.

**Misconceptions/constraints.** One primary error; alternate frameworks excluded by profile statement. **Feedback.** Show structural evidence and correction.

**Examples.** 1. `the soup` labeled object in “The soup is hot” → subject. L1. 2. `hot` labeled direct object → subject complement. L2. 3. Passive patient labeled object → passive subject. L2.

**Validation/coverage.** Mutation target differs in exactly one semantic field.

### Cross-family progression

Begin with canonical subject and object cases, then complements and valency. Add clause features, passive mapping, questions, and negation before integrated audits.

## 7. Category: Dependencies, agreement, and reference

### Category purpose

Train head–dependent reasoning across sentences and feature relationships that span more than one word.

### Learn

A dependency tree links each non-root word to one head and names the relation. In “Those birds sing,” `sing` is the root, `birds` is its `nsubj`, and `Those` is a `det` dependent of `birds`. Agreement and reference are separate constraints layered over structure.

### Prerequisites

Word classes, heads, grammatical functions, clauses, and person/number features.

### Category boundaries

The app uses only its declared UD-inspired profile. It does not grade arbitrary dependency conventions or unrestricted coreference.

### Subcategories

1. Heads and dependency relations
2. Constituency/dependency correspondences
3. Agreement and case
4. Antecedence, reflexives, and gaps

### Common misconceptions

- The nearest word is always the head.
- Every word depends directly on the verb.
- Dependency and constituency trees should have identical nodes.
- Semantic compatibility can override agreement morphology.
- Every earlier matching noun is a valid antecedent.

### Family `dependency_head_select`

**Task.** Select a token's syntactic head. **Response/template.** Token selection: `What is the head of “{dependent}”?`

**Derivation.** Return the token at the stored head index. **Difficulty.** L1 determiner/noun; L2 subject/root; L3 embedding.

**Misconceptions/constraints.** Root has no head and is prompted separately. **Feedback.** Draw the edge and name its relation.

**Examples.** 1. `the → cat`. L1. 2. `cat → sleeps` in “The cat sleeps.” L1. 3. subordinate `left → said` via `ccomp` in the shown profile. L3.

**Validation/coverage.** Exactly one head per non-root token.

### Family `dependency_relation_label`

**Task.** Label a displayed dependency edge. **Response/template.** Single choice from the active relation subset.

**Derivation.** Read the edge relation from the oracle. **Difficulty.** L1 `nsubj/obj/det`; L2 `amod/advmod/obl`; L3 `ccomp/xcomp/conj`.

**Misconceptions/constraints.** Function names follow this profile; no relation is inferred from word class alone. **Feedback.** Define the relation in this sentence.

**Examples.** 1. `birds → sing` → `nsubj`. L1. 2. `book → read` → `obj`. L1. 3. `quietly → left` → `advmod`. L2.

**Validation/coverage.** All declared relations receive balanced practice.

### Family `dependency_constituency_map`

**Task.** Map information between a constituency tree and dependency tree. **Response/template.** Node/edge selection.

**Derivation.** Apply the pinned head rules and conversion mapping. **Difficulty.** L2 simple phrases; L3 PP/auxiliary; L4 coordination.

**Misconceptions/constraints.** The representations are related, not interchangeable. **Feedback.** Show how phrase head projects the dependency.

**Examples.** 1. NP head `birds` becomes determiner's dependency head. L2. 2. PP head `under` maps its NP to the profile's `case/obl` structure as explicitly shown. L3. 3. VP object NP maps to `obj` edge. L2.

**Validation/coverage.** Round-trip only where the restricted mapping is information-preserving.

### Family `agreement_form_select`

**Task.** Select a verb or auxiliary form agreeing with the subject. **Response/template.** Missing-form choice.

**Derivation.** Unify subject person/number with tense and paradigm. **Difficulty.** L1 `is/are`; L2 present lexical verb; L3 coordinated or intervening noun.

**Misconceptions/constraints.** Ignore distractor nouns inside modifiers; variable cases are excluded. **Feedback.** Show subject features and paradigm cell.

**Examples.** 1. “The bird __ ready” → `is`. L1. 2. “The birds __ daily” → `sing`. L1. 3. “The box of tools __ heavy” → `is`. L2.

**Validation/coverage.** Exhaustive paradigm and agreement tests.

### Family `agreement_feature_unify`

**Task.** Determine whether a set of feature annotations can coexist. **Response/template.** Compatible/incompatible plus conflicting feature.

**Derivation.** Unify person, number, tense, and form constraints. **Difficulty.** L2 one pair; L3 auxiliary chain; L4 micro-language agreement.

**Misconceptions/constraints.** Semantic plurality does not override declared morphosyntax. **Feedback.** Display the unification table.

**Examples.** 1. subject `3.SG` + `walks` → compatible. L1. 2. subject `PL` + `is` → incompatible: number. L1. 3. `has been running` with `3.SG.PRS` → compatible. L3.

**Validation/coverage.** Solver and surface generator must agree.

### Family `case_pronoun_select`

**Task.** Select the pronoun case form licensed by function. **Response/template.** Choice: `{left_context} ___ {right_context}`.

**Derivation.** Map grammatical function to the controlled pronoun paradigm. **Difficulty.** L1 subject/object; L2 coordinated NP; L3 possessive/reflexive contrast.

**Misconceptions/constraints.** Register-variable `who/whom` is separately labeled, not a trap. **Feedback.** Name function and paradigm row.

**Examples.** 1. “__ arrived” → `she`. L1. 2. “I called __” → `her`. L1. 3. “The choice is __” uses profile-labeled formal/conversational variants, not forced universal judgment. L3.

**Validation/coverage.** Every accepted variant is explicit.

### Family `reference_antecedent_select`

**Task.** Select a pronoun's intended antecedent from a controlled context. **Response/template.** Entity/span selection.

**Derivation.** Filter discourse entities by declared reference ID, features, and accessibility. **Difficulty.** L1 unique features; L2 two clauses; L3 discourse focus with explicit context.

**Misconceptions/constraints.** Reject unresolved ambiguity; gender is not guessed from names. **Feedback.** Show compatible features and discourse cue.

**Examples.** 1. “Mina put the cup down. It cracked.” → `the cup`. L1. 2. “The dogs chased a bird. They stopped.” → `the dogs`. L1. 3. Two singular objects require added context or rejection. L2.

**Validation/coverage.** Candidate filter returns exactly one referent.

### Family `reference_reflexive_binding`

**Task.** Choose reflexive or personal pronoun under the simplified local rule. **Response/template.** Missing-form choice.

**Derivation.** Compute local finite-clause domain, c-command proxy from the pinned tree, and feature compatibility. **Difficulty.** L2 local subject; L3 embedded clause; L4 tempting nonlocal antecedent.

**Misconceptions/constraints.** State that this is a controlled beginner model; exclude exceptional/logophoric uses. **Feedback.** Highlight the local domain.

**Examples.** 1. “Mia saw herself” → reflexive. L2. 2. “Mia said that Jo saw her” permits `her=Mia` under supplied context. L3. 3. `*Mia saw her` for local Mia-reference → violates core rule. L2.

**Validation/coverage.** Binding oracle tests all candidate antecedents.

### Family `reference_relative_gap`

**Task.** Link a relative element to its licensed gap and role. **Response/template.** Select gap position plus function.

**Derivation.** Use the stored relative dependency; ensure one licensed gap and matching valency slot. **Difficulty.** L2 object gap; L3 subject/PP gap; L4 one embedding.

**Misconceptions/constraints.** Gap is structural metadata, not a spoken word. **Feedback.** Reconstruct the nonrelative clause.

**Examples.** 1. “the book that I read __” → object gap after `read`. L2. 2. “the person who __ called” → subject gap. L2. 3. “the shelf that I put it on __” → PP complement gap in labeled conversational profile. L3.

**Validation/coverage.** Exactly one gap, licensed frame, matching relative index.

### Family `dependency_tree_audit`

**Task.** Find a violation in a proposed dependency/reference analysis. **Response/template.** Edge/label selection and repair.

**Derivation.** Run root, head-count, cycle, connectivity, relation, agreement, and reference validators. **Difficulty.** L1 two roots; L2 wrong label/head; L3 locally plausible cycle/reference.

**Misconceptions/constraints.** Inject one primary fault. **Feedback.** Visualize the violated invariant.

**Examples.** 1. Two `root` tokens → invalid. L1. 2. `the` attached to verb as `det` → wrong head. L2. 3. A↔B dependency cycle → invalid. L2.

**Validation/coverage.** Mutation coverage for every validator.

### Cross-family progression

Start with one edge, then labels and representation mapping. Introduce agreement before reference, and reserve gaps and full-tree audits for advanced mixed practice.

## 8. Category: Semantics and pragmatics

### Category purpose

Train disciplined reasoning about sentence meaning, context, and distinct kinds of inference.

### Learn

Truth depends on a stated world, not plausibility. Entailment must hold whenever the premise is true; presupposition is backgrounded; conversational implicature is usually cancelable. Structure can create different scope readings even when all words stay the same.

### Prerequisites

Clause structure and elementary “all/some/not” reasoning introduced in the Learn material.

### Category boundaries

This is controlled linguistic meaning, not a general logic course or real-world fact quiz. Formal proof and unrestricted formulas remain in the logic app.

### Subcategories

1. Truth and entailment
2. Ambiguity and scope
3. Presupposition and implicature
4. Context and deixis

### Common misconceptions

- A likely sentence is true in every displayed world.
- Related meaning is the same as entailment.
- Ambiguity means vagueness.
- “Some” semantically entails “not all.”
- Presupposition, entailment, and implicature are interchangeable.

### Family `semantics_truth_in_world`

**Task.** Evaluate a controlled sentence in a finite displayed world. **Response/template.** True/false/undetermined.

**Derivation.** Evaluate its semantic tree over explicit entities/properties/relations. **Difficulty.** L1 atomic; L2 conjunction/negation; L3 quantifier.

**Misconceptions/constraints.** Closed-world versus incomplete-world policy is displayed. **Feedback.** Show decisive entities/relations.

**Examples.** 1. World says `red(a)`; “A is red” → true. L1. 2. No fact about A under incomplete policy → undetermined. L2. 3. Every circle is blue → check all circles. L3.

**Validation/coverage.** Independent evaluator and enumerated-world tests.

### Family `semantics_entailment`

**Task.** Decide whether one controlled sentence entails another. **Response/template.** Yes/no plus counterworld selection when no.

**Derivation.** Enumerate all small models satisfying the premise; entailment holds iff all satisfy conclusion. **Difficulty.** L1 lexical subset supplied; L2 quantifier; L3 conjunction/negation.

**Misconceptions/constraints.** Plausibility and converse inference are distractors. **Feedback.** Give minimal countermodel or rule.

**Examples.** 1. “Every robin is a bird; Ava is a robin” entails “Ava is a bird.” L2. 2. “Some birds sing” does not entail “Every bird sings.” L1. 3. “No square is round” entails no object is both. L2.

**Validation/coverage.** Finite model oracle; no outside lexical knowledge.

### Family `semantics_compatibility`

**Task.** Classify two statements as contradictory, compatible, or equivalent under a model. **Response/template.** Single choice.

**Derivation.** Compare satisfying-model sets. **Difficulty.** L1 negated atomic; L2 quantifiers; L3 scope reading.

**Misconceptions/constraints.** Difference does not imply contradiction. **Feedback.** Show a shared model or prove none exists.

**Examples.** 1. `A is red` / `A is not red` → contradictory. L1. 2. `Some birds sing` / `Some birds do not sing` → compatible. L2. 3. `No A is B` / `No B is A` → equivalent. L3.

**Validation/coverage.** Model-set relation computed exactly.

### Family `semantics_ambiguity_type`

**Task.** Classify ambiguity as lexical, structural, referential, or absent. **Response/template.** Single choice with highlighted source.

**Derivation.** Compare the stored analyses: lexeme IDs, parse trees, reference assignments. **Difficulty.** L1 lexical; L2 attachment; L3 reference/mixed.

**Misconceptions/constraints.** Vagueness and missing context are distinct distractors. **Feedback.** Display the competing analyses.

**Examples.** 1. `bank` river/financial → lexical. L1. 2. binocular PP → structural. L2. 3. `Alex told Sam they won` with two candidates → referential. L2.

**Validation/coverage.** Each alternative differs in the claimed layer only unless marked mixed.

### Family `semantics_quantifier_scope`

**Task.** Match a sentence reading to an explicit quantifier-scope tree. **Response/template.** Formula/tree choice.

**Derivation.** Evaluate ordered quantifiers and compare with paraphrase/model. **Difficulty.** L2 every+some; L3 negation+quantifier; L4 three operators excluded initially.

**Misconceptions/constraints.** Do not claim every surface sentence freely permits every logical ordering. **Feedback.** Paraphrase each reading and give a distinguishing world.

**Examples.** 1. “Every student read a book”: possibly one shared book versus potentially different books. L3. 2. `some > every` selected by supplied scenario. L3. 3. Scope tree explicitly nests operators. L2.

**Validation/coverage.** Distinguishing model makes readings differ.

### Family `semantics_negation_scope`

**Task.** Determine what negation takes scope over. **Response/template.** Bracket choice/paraphrase match.

**Derivation.** Read negation node position in semantic tree. **Difficulty.** L1 predicate negation; L2 modal/adverb; L3 quantifier.

**Misconceptions/constraints.** Surface proximity is not enough. **Feedback.** Render positive core and negated domain.

**Examples.** 1. “Mia did not leave” → not `[Mia left]`. L1. 2. “Mia didn't deliberately spill it” distinguishes event denial from manner scope using context. L3. 3. “Not every lamp works” → fewer than all, not none. L2.

**Validation/coverage.** Paraphrase truth conditions uniquely identify scope.

### Family `pragmatics_presupposition`

**Task.** Identify a controlled presupposition trigger and backgrounded content. **Response/template.** Trigger/span plus proposition choice.

**Derivation.** Look up authored trigger projection in simple affirmative/negative pairs. **Difficulty.** L2 possessive/again; L3 factive/change-of-state; L4 projection interactions excluded.

**Misconceptions/constraints.** Presupposition is not asserted entailment; use conventional textbook-safe triggers. **Feedback.** Compare affirmative and negated forms.

**Examples.** 1. “Mia's bicycle is red” presupposes Mia has a bicycle. L2. 2. “Mia stopped running” presupposes she had been running. L2. 3. “Mia didn't return” still backgrounds that she had been there. L3.

**Validation/coverage.** Trigger and projection behavior are authored/reviewed.

### Family `pragmatics_implicature_cancel`

**Task.** Distinguish semantic content from a cancelable conversational inference. **Response/template.** Entailed/implicated/neither plus cancellation judgment.

**Derivation.** Use controlled scalar templates and explicit continuation compatibility. **Difficulty.** L2 `some`; L3 disjunction/orderly relevance cases.

**Misconceptions/constraints.** Never encode “some but not all” as truth-conditional by default. **Feedback.** Append a cancellation and test contradiction.

**Examples.** 1. “Some passed—indeed, all did” is consistent: not-all was implicature. L2. 2. “A or B, possibly both” confirms inclusive semantics. L2. 3. Literal content survives cancellation. L2.

**Validation/coverage.** Semantic evaluator and authored pragmatic layer remain separate.

### Family `pragmatics_deixis_context`

**Task.** Resolve `I/you/here/now/today` from a displayed utterance context. **Response/template.** Entity/place/time selection.

**Derivation.** Bind deictic feature to speaker, addressee, location, or time fields. **Difficulty.** L1 speaker; L2 reported message; L3 two contexts compared.

**Misconceptions/constraints.** No current-device location/time is used. **Feedback.** Show the context field that fixes reference.

**Examples.** 1. Speaker=Ari: `I` → Ari. L1. 2. Message sent Monday: `today` → Monday's date. L2. 3. Quoted `here` resolves to quoted speaker's location. L3.

**Validation/coverage.** All answers derive from explicit context object.

### Family `meaning_analysis_audit`

**Task.** Diagnose a false claim about inference, ambiguity, or context. **Response/template.** Claim selection and corrected relation.

**Derivation.** Compare claim with model sets, analysis layers, and discourse context. **Difficulty.** L2 single distinction; L3 scope; L4 pragmatic/semantic interaction.

**Misconceptions/constraints.** One primary conceptual error. **Feedback.** Supply countermodel, cancellation, or alternate analysis.

**Examples.** 1. “Some entails not all” → false. L2. 2. “Different parses are lexical ambiguity” → false; structural. L1. 3. “Likely means entailed” → false with counterworld. L2.

**Validation/coverage.** Every misconception has a machine-checkable witness.

### Cross-family progression

Start with concrete worlds and model relations, then name ambiguity types. Introduce one scope contrast at a time before pragmatics, deixis, and integrated audits.

## 9. Category: Phonetics and phonology

### Category purpose

Train reading of sound representations and inference about contrast and sound patterns.

### Learn

IPA symbols represent speech sounds, not ordinary spelling. A phoneme `/p/` is a contrastive category; a phone `[pʰ]` is a particular realization. If two sounds never contrast and occur in predictable environments, they may be allophones in the displayed dataset.

### Prerequisites

No language beyond English is assumed. Feature tables and IPA subsets are introduced incrementally.

### Category boundaries

This category grades symbolic analysis, not accent quality. Audio recognition is optional and has a non-audio path.

### Subcategories

1. IPA symbols and articulatory features
2. Contrast and allophony
3. Syllables and stress
4. Rule application and audits

### Common misconceptions

- IPA letters have their alphabetic values.
- Spelling determines pronunciation one-to-one.
- Any two different phones are different phonemes.
- Complementary distribution alone proves allophony without phonetic relatedness/data limits.
- Syllable boundaries always match morpheme boundaries.

### Family `phonetics_ipa_feature`

**Task.** Map a taught IPA symbol to its articulatory feature bundle or vice versa. **Response/template.** Matching/feature grid.

**Derivation.** Lookup in versioned IPA subset. **Difficulty.** L1 voiced/place; L2 manner; L3 full consonant or vowel bundle.

**Misconceptions/constraints.** No untaught diacritics; typography clearly distinguishes symbols. **Feedback.** Highlight chart cell.

**Examples.** 1. `/m/` → voiced bilabial nasal. L1. 2. voiceless alveolar fricative → `/s/`. L2. 3. `/i/` → close front unrounded vowel. L2.

**Validation/coverage.** Feature-to-symbol uniqueness within the active subset.

### Family `phonetics_consonant_class`

**Task.** Select all consonants sharing a feature or natural-class bundle. **Response/template.** Multiple selection.

**Derivation.** Filter feature matrix. **Difficulty.** L1 one feature; L2 intersection; L3 complement/exclusion.

**Misconceptions/constraints.** Require complete set; symbols all taught. **Feedback.** Display feature rows.

**Examples.** 1. Voiceless stops among `/p b t d k g/` → `/p t k/`. L1. 2. Alveolar nasals → `/n/` in subset. L1. 3. Voiced noncontinuants from set → computed set. L3.

**Validation/coverage.** Set computed from matrix; balanced features.

### Family `phonetics_vowel_chart`

**Task.** Place or identify a vowel by height, backness, and rounding. **Response/template.** Accessible chart cell or feature choices.

**Derivation.** Lookup in active monophthong inventory. **Difficulty.** L1 cardinal extremes; L2 neighboring vowels; L3 accent-specific subset.

**Misconceptions/constraints.** Diagram dimensions are explained and not anatomical coordinates. **Feedback.** Trace height/backness/rounding.

**Examples.** 1. `/i/` → close front unrounded. L1. 2. `/u/` → close back rounded. L1. 3. `/ə/` → mid central unrounded in simplified table. L2.

**Validation/coverage.** Accent profile and inventory version displayed.

### Family `phonology_minimal_pair`

**Task.** Decide whether a displayed pair is minimal and identify the contrasting segment. **Response/template.** Yes/no plus segment pair.

**Derivation.** Align phoneme sequences; require exactly one substitution and a meaning contrast. **Difficulty.** L1 word-initial; L2 medial/final; L3 near-minimal distractors.

**Misconceptions/constraints.** Spelling is hidden or secondary; both forms have reviewed meanings. **Feedback.** Show sequence alignment.

**Examples.** 1. `/pɪn/–/bɪn/` → minimal, `/p~b/`. L1. 2. `/kæt/–/kæp/` → minimal, `/t~p/`. L1. 3. Pair differing in two positions → not minimal. L2.

**Validation/coverage.** Edit-distance and lexical-contrast checks.

### Family `phonology_phoneme_allophone`

**Task.** Infer whether two phones are contrastive phonemes or conditioned allophones from data. **Response/template.** Classification plus evidence row.

**Derivation.** Search for minimal/overlapping contrast; otherwise test complementary environments and supplied similarity constraint. **Difficulty.** L2 obvious contrast; L3 complementary distribution; L4 limited-data `insufficient evidence`.

**Misconceptions/constraints.** Absence of contrast in tiny data is not proof. **Feedback.** Show distributions and evidential status.

**Examples.** 1. Minimal pair `[p]~[b]` → contrastive. L2. 2. `[pʰ]` syllable-initial stressed and `[p]` after `/s/` → conditioned allophones in dataset. L3. 3. Sparse single examples → insufficient evidence. L3.

**Validation/coverage.** Dataset generator records whether evidence is decisive.

### Family `phonology_distribution_infer`

**Task.** State the environment in which an allophone occurs. **Response/template.** Structured `before/after/elsewhere` fields.

**Derivation.** Compute the simplest rule from a bounded hypothesis set that fits all data uniquely. **Difficulty.** L2 adjacent segment; L3 word/syllable boundary+feature class.

**Misconceptions/constraints.** Do not accept memorized English rule if data differs. **Feedback.** Sort examples by environment.

**Examples.** 1. `[n]→[m] / __ bilabial` from constructed data. L2. 2. `[p]→[pʰ] / stressed syllable onset`. L3. 3. Vowel nasalizes before nasal consonant. L3.

**Validation/coverage.** Enumerate candidate rules and require a unique best rule under declared ordering.

### Family `phonology_syllabify`

**Task.** Divide a phoneme string into syllables under a displayed onset/coda inventory. **Response/template.** Boundary placement.

**Derivation.** Enumerate legal parses and apply the stated maximal-onset rule; accept all if tie is declared. **Difficulty.** L1 CV; L2 clusters; L3 morphology competing with phonotactics.

**Misconceptions/constraints.** Orthographic and morpheme boundaries do not decide. **Feedback.** Validate each onset, nucleus, coda.

**Examples.** 1. `/pata/` with CV inventory → `/pa.ta/`. L1. 2. `/atlas/` under displayed legal `/tl/` rule → computed boundary. L2. 3. Illegal onset forces consonant to coda. L2.

**Validation/coverage.** Phonotactic parser returns canonical/accepted boundary set.

### Family `phonology_stress_pattern`

**Task.** Mark primary stress or infer a simple stress rule. **Response/template.** Syllable selection or rule choice.

**Derivation.** Apply the displayed deterministic rule to syllable/weight structure. **Difficulty.** L1 fixed initial/final; L2 penultimate; L3 weight-sensitive.

**Misconceptions/constraints.** Use constructed data unless real-language patterns are reviewed. **Feedback.** Number syllables and apply rule.

**Examples.** 1. Initial-stress system `/pataka/` → `ˈpa.ta.ka`. L1. 2. Penultimate stress in four syllables → third. L1. 3. Stress final heavy syllable, else penult. L3.

**Validation/coverage.** Stress assignment unique under rule.

### Family `phonology_rule_apply`

**Task.** Apply an ordered phonological rule to an underlying form. **Response/template.** IPA sequence input or token transformations.

**Derivation.** Locate environments, apply simultaneously unless specified, then proceed through ordered rules. **Difficulty.** L2 one rule; L3 multiple sites; L4 two ordered rules.

**Misconceptions/constraints.** Rule notation and application mode displayed. **Feedback.** Show each intermediate representation.

**Examples.** 1. `n→m / __ p`; `/anpa/` → `[ampa]`. L2. 2. final devoicing maps `/bad/` → `[bat]` in constructed system. L2. 3. Epenthesis then assimilation with two shown stages. L4.

**Validation/coverage.** Independent rewrite engine; no ambiguous overlapping targets.

### Family `phonology_analysis_audit`

**Task.** Find an error in a transcription, feature claim, distribution, or rule application. **Response/template.** Select faulty step and correct it.

**Derivation.** Compare against feature table and rule trace. **Difficulty.** L1 slash/bracket; L2 feature; L3 ordered-rule trace.

**Misconceptions/constraints.** One injected error; font fallback verified. **Feedback.** Name representation level and violated rule.

**Examples.** 1. Allophone written `/pʰ/` in phonetic output → should use `[pʰ]`. L1. 2. `/m/` labeled voiceless → feature error. L1. 3. Assimilation applied outside its environment → rule error. L2.

**Validation/coverage.** Mutation tests cover notation, features, environment, and ordering.

### Cross-family progression

Teach a small symbol set through features, then contrast and distribution. Add syllables/stress before rule application; always retain a non-audio route.

## 10. Category: Cross-linguistic pattern inference

### Category purpose

Train analysis from data without assuming that English categories, word order, or morphology are universal.

### Learn

An interlinear gloss aligns forms, morphemes, and meanings. From several carefully chosen examples, compare what changes and infer only what the data supports. A language may mark subject/object roles by case, agreement, or order; none is the universal default.

### Prerequisites

Morpheme segmentation, feature bundles, grammatical functions, and small paradigms.

### Category boundaries

Generated tasks use constructed micro-languages. Reviewed real-language data may be included as fixed content, but the app does not teach or characterize an entire language from a few examples.

### Subcategories

1. Gloss reading
2. Morpheme and order inference
3. Case, agreement, and noun classes
4. Rule inference and controlled translation

### Common misconceptions

- English word order is the neutral universal order.
- One example establishes a rule.
- Every language has articles, grammatical gender, or tense suffixes.
- A gloss is an idiomatic translation.
- Structural differences reveal cultural or cognitive traits.

### Family `crossling_gloss_align`

**Task.** Align segmented surface morphemes with glosses. **Response/template.** Drag matching gloss chips under morphemes.

**Derivation.** Compare ordered one-to-one alignment, respecting `-`, `=`, and `.` conventions. **Difficulty.** L1 root+one affix; L2 clitic/feature bundle; L3 repeated zero-excluded contrasts.

**Misconceptions/constraints.** Every abbreviation appears in legend. **Feedback.** Show all three interlinear lines.

**Examples.** 1. `dak-i / dog-PL` aligns `dak↔dog`, `i↔PL`. L1. 2. `mi=na / 1SG=TOP`. L2. 3. `lom-ta / see-PST`. L1.

**Validation/coverage.** Segment and gloss counts/operators align exactly.

### Family `crossling_morpheme_infer`

**Task.** Infer a morpheme's meaning from contrastive examples. **Response/template.** Morpheme selection plus gloss choice.

**Derivation.** Find the form/meaning difference shared by a minimal paradigm contrast. **Difficulty.** L1 one contrast; L2 triangulation; L3 syncretism with sufficient rows.

**Misconceptions/constraints.** Reject datasets compatible with multiple glosses. **Feedback.** Align decisive pairs.

**Examples.** 1. `dak` dog, `daki` dogs → `-i=PL`. L1. 2. `lum` see, `lumta` saw → `-ta=PST`. L1. 3. Four forms isolate `ka-=NEG`. L2.

**Validation/coverage.** Hypothesis enumeration returns one mapping.

### Family `crossling_word_order_infer`

**Task.** Infer constituent order from glossed clauses. **Response/template.** Ordered roles such as SOV.

**Derivation.** Use semantic-role annotations across transitive examples and exclude accidental lexical ordering. **Difficulty.** L1 fixed S/O/V; L2 adjectives/adpositions; L3 order plus case allowing variation.

**Misconceptions/constraints.** At least three examples; do not infer “free order” from two permutations. **Feedback.** Relabel each word by role.

**Examples.** 1. `child apple eats` across rows → SOV. L1. 2. noun precedes adjective in all decisive NPs → N-Adj. L2. 3. case-marked variants support two accepted orders, not one forced rule. L3.

**Validation/coverage.** Dataset distinguishes the intended order hypothesis.

### Family `crossling_case_decode`

**Task.** Infer case markers and use them to identify grammatical roles. **Response/template.** Match suffix to role; label NPs.

**Derivation.** Correlate markers with annotated argument roles across reordered examples. **Difficulty.** L2 NOM/ACC; L3 ERG/ABS introduced explicitly; L4 syncretism.

**Misconceptions/constraints.** Avoid equating subject with agent; alignment terminology is taught before grading. **Feedback.** Show case-marked arguments across rows.

**Examples.** 1. `-ka` repeats on subjects → `NOM`. L2. 2. `-mu` marks transitive objects despite order changes → `ACC`. L2. 3. Displayed ergative pattern identifies transitive agent marker. L3.

**Validation/coverage.** Role-marker solution unique and all rows consistent.

### Family `crossling_agreement_paradigm`

**Task.** Fill or infer an agreement paradigm. **Response/template.** Table cell or form construction.

**Derivation.** Select exponent by controller features and declared slot order. **Difficulty.** L1 SG/PL; L2 person×number; L3 syncretic cells.

**Misconceptions/constraints.** Controller is explicit or inferable uniquely; no English analogy required. **Feedback.** Highlight matching rows/columns.

**Examples.** 1. `1SG -m`, `2SG -t`, `3SG -s`; fill 2SG. L1. 2. plural prefix selected from subject features. L2. 3. Same form for 2SG/2PL is syncretism, not missing data. L3.

**Validation/coverage.** Exhaustive paradigm generation and round-trip parsing.

### Family `crossling_noun_class`

**Task.** Infer noun-class membership or agreement marker from a displayed lexicon/paradigm. **Response/template.** Class choice or missing marker.

**Derivation.** Use arbitrary class IDs and agreement behavior, not semantic stereotypes. **Difficulty.** L2 two classes; L3 three classes/exceptions.

**Misconceptions/constraints.** Grammatical class is not natural sex/gender; constructed nouns avoid stereotypes. **Feedback.** Cite agreement pattern.

**Examples.** 1. nouns taking adjective prefix `ki-` → Class A. L2. 2. choose `ru-` agreement for a Class B noun. L2. 3. semantic distractor loses to observed paradigm. L3.

**Validation/coverage.** Class membership and agreement table are internally consistent.

### Family `crossling_clause_rule`

**Task.** Infer how a micro-language forms negation or questions. **Response/template.** Rule choice/ordered construction.

**Derivation.** Contrast affirmative/negative or declarative/interrogative pairs and solve from a bounded rule set. **Difficulty.** L1 added particle; L2 position/allomorph; L3 two simultaneous changes.

**Misconceptions/constraints.** Dataset must distinguish affix, particle, and order hypotheses. **Feedback.** Align paired clauses.

**Examples.** 1. sentence-final `ma` only in questions → question particle. L1. 2. prefix `ka-` marks negation. L1. 3. question requires initial particle plus verb-final order in displayed system. L3.

**Validation/coverage.** Alternative-rule enumeration leaves one solution.

### Family `crossling_translate_micro`

**Task.** Translate or construct a sentence using only the learned micro-grammar. **Response/template.** Ordered morpheme chips and/or controlled English choice.

**Derivation.** Generate from semantic frame through order, case, agreement, and morphology. **Difficulty.** L2 one rule; L3 two rules; L4 three mastered rules.

**Misconceptions/constraints.** Accept all generated equivalents; no free-form real-language translation. **Feedback.** Show semantic roles, morphology, then order.

**Examples.** 1. SOV system: “child sees dog” → `child dog see`. L1. 2. Add object case suffix. L2. 3. Add subject agreement and past marker. L3.

**Validation/coverage.** Parse constructed answer back to identical semantic frame.

### Family `crossling_claim_audit`

**Task.** Judge whether a typological claim follows from the supplied data. **Response/template.** Supported/contradicted/insufficient evidence.

**Derivation.** Test claim against all examples and remaining compatible grammars. **Difficulty.** L2 direct contradiction; L3 underdetermination; L4 universal overclaim.

**Misconceptions/constraints.** Never infer culture/cognition; use neutral structural claims. **Feedback.** Give counterexample row or competing grammar.

**Examples.** 1. Three SOV clauses support “these examples are SOV,” not “order can never vary.” L2. 2. No plural examples → plural rule insufficient. L1. 3. A reordered case-marked row contradicts rigid-order claim. L3.

**Validation/coverage.** Claim status computed over explicit hypothesis space.

### Cross-family progression

Teach gloss conventions first, then infer one morpheme or order rule. Add case/agreement/class paradigms before controlled production and evidence audits. Learners must never need prior knowledge of the data language.

## 11. Category: Usage, variation, and integrated analysis

### Category purpose

Apply structural reasoning to judgments, editing, punctuation, and multi-representation problems without turning variation into error shaming.

### Learn

Grammaticality is always relative to a language variety and context. Formal edited usage, neutral conversation, and named dialect patterns may differ systematically. Good analysis distinguishes a structural mismatch, an unclear intended meaning, a register choice, and a legitimate variant.

### Prerequisites

All earlier categories as relevant; each item declares the representations it combines.

### Category boundaries

This category is not a generic proofreading app. It includes only corrections whose explanation depends on taught linguistic structure.

### Subcategories

1. Controlled judgments and variants
2. Structure-sensitive punctuation and repair
3. Analysis quality
4. Integrated representation

### Common misconceptions

- Formal writing conventions define all grammatical speech.
- Frequent variation is random carelessness.
- Punctuation alone creates a grammatical structure.
- Any ambiguous sentence is defective.
- A technical-looking tree is necessarily a good analysis.

### Family `usage_grammaticality_pair`

**Task.** Compare a minimally differing pair under a stated grammar profile. **Response/template.** Status for each plus violated constraint.

**Derivation.** Parse both with the profile and compare agreement, valency, order, or binding. **Difficulty.** L1 agreement; L2 complementation; L3 embedding.

**Misconceptions/constraints.** Use `ill formed under this model`; avoid dialect-variable targets unless explicitly teaching them. **Feedback.** Highlight the minimal contrast.

**Examples.** 1. “She walks” / `*She walk` under controlled standard present agreement. L1. 2. “They rely on us” / `*They rely us` under lexicon frame. L2. 3. Reflexive local-domain pair. L3.

**Validation/coverage.** Pair differs only in the target manipulation.

### Family `usage_register_variant`

**Task.** Classify a construction's status under named variety/register profiles. **Response/template.** Matrix of accepted/marked/outside-profile.

**Derivation.** Lookup reviewed construction-profile statuses. **Difficulty.** L2 formal/conversational; L3 two named varieties; L4 context-sensitive.

**Misconceptions/constraints.** No profile is ranked as intellectually superior. **Feedback.** Explain where each form is conventional.

**Examples.** 1. Contraction accepted in neutral conversation, restricted in specified formal style. L1. 2. Singular `they` accepted in the active contemporary profile. L2. 3. A reviewed dialect construction labeled systematic but outside controlled-standard profile. L3.

**Validation/coverage.** Every status has review provenance and no pejorative wording.

### Family `usage_punctuation_structure`

**Task.** Choose punctuation that represents an already specified structure or reading. **Response/template.** Insert punctuation from a bounded set.

**Derivation.** Render commas/colon/semicolon only from controlled coordination, subordination, and attachment templates. **Difficulty.** L1 clause boundary; L2 restrictive/nonrestrictive supplied meaning; L3 attachment clarification.

**Misconceptions/constraints.** Punctuation does not independently prove syntax; spoken-language alternatives are noted. **Feedback.** Show parse before orthographic convention.

**Examples.** 1. Join two independent clauses with semicolon under requested style. L1. 2. Commas mark supplied nonrestrictive relative reading. L2. 3. Add comma to reflect a sentence-level introductory adjunct. L1.

**Validation/coverage.** Meaning/tree fixed before punctuation realization.

### Family `usage_repair_agreement`

**Task.** Repair one agreement or case mismatch while preserving meaning. **Response/template.** Token replacement.

**Derivation.** Unify features/functions and generate the required form. **Difficulty.** L1 adjacent subject; L2 intervening phrase; L3 auxiliary chain.

**Misconceptions/constraints.** Exactly one token changes; variable forms excluded. **Feedback.** Trace controller to target.

**Examples.** 1. `The dogs runs` → `run`. L1. 2. `The box of tools are heavy` → `is` in stated profile. L2. 3. `Her arrived` → `She arrived`. L1.

**Validation/coverage.** Repaired output parses to same semantic frame and passes features.

### Family `usage_repair_ambiguity`

**Task.** Revise a structurally ambiguous sentence to express a supplied reading. **Response/template.** Choose among controlled rewrites or reorder chunks.

**Derivation.** Select a generated paraphrase whose semantic tree equals the target and has one parse in the profile. **Difficulty.** L2 PP attachment; L3 coordination/scope; L4 minimal rewrite.

**Misconceptions/constraints.** Ambiguity is not inherently an error; prompt gives a reason clarity is needed. **Feedback.** Compare original parses and revised parse.

**Examples.** 1. Instrument reading → “Using binoculars, I saw the person.” L2. 2. Shared adjective scope → “old men and old women.” L2. 3. `not all` replaces ambiguous quantifier-negation reading. L3.

**Validation/coverage.** Revised form has unique target semantics under parser.

### Family `usage_analysis_audit`

**Task.** Evaluate a proposed linguistic analysis for category/function confusion, unsupported certainty, or variety bias. **Response/template.** Select flaw and corrected statement.

**Derivation.** Compare claim fields with oracle and evidence status. **Difficulty.** L2 form/function; L3 diagnostic overclaim; L4 variation/evidence.

**Misconceptions/constraints.** Critique analysis, never speaker worth. **Feedback.** Rewrite claim precisely.

**Examples.** 1. “`the dog` is a subject phrase type” → confuses function with NP form. L1. 2. “Movement proves constituency universally” → overclaim. L2. 3. “This dialect lacks grammar” → false and prejudicial; describe the actual profile difference. L3.

**Validation/coverage.** Audits cover every policy-critical misconception.

### Family `integrated_representation_lab`

**Task.** Complete linked POS, morphology, constituency, function, dependency, and meaning fields for one small item. **Response/template.** Staged multi-panel task.

**Derivation.** All panels derive from one immutable semantic/structural record. **Difficulty.** L2 two representations; L3 three; L4 diagnose a disagreement.

**Misconceptions/constraints.** Combine at most three newly interacting demands and save partial progress. **Feedback.** Reveal correspondences, not isolated answer dumps.

**Examples.** 1. Tag `birds`, then label subject NP. L2. 2. Build NP tree and dependency `det` edge. L2. 3. Choose PP attachment, then match semantic paraphrase and dependency edge. L4.

**Validation/coverage.** Cross-view invariants and no contradictory labels.

### Cross-family progression

Introduce controlled judgments only after the relevant model is known. Variation is taught before advanced auditing; integrated labs combine mastered components and never serve as first exposure.

## 12. Topic-level progression

### Level 1: Find and classify

- core content-word classes in clear contexts;
- simple roots and affixes;
- shallow NP/VP spans and heads;
- canonical subject/object clauses;
- atomic finite-world meaning;
- a small IPA feature subset.

### Level 2: Relate and contrast

- function words and contextual homographs;
- inflection versus derivation;
- complements versus adjuncts;
- simple constituency and dependency trees;
- agreement, case, passive, and one attachment ambiguity;
- minimal pairs, basic allophony, and one-rule micro-languages.

### Level 3: Build and infer

- complete sequence tagging and word trees;
- embedded clauses, questions, negation, gaps, and reference;
- tree construction and multiple legitimate parses;
- scope, presupposition, and implicature;
- syllabification, stress, and phonological rules;
- case/agreement paradigms in micro-languages.

### Level 4: Diagnose and synthesize

- evidence audits and underdetermination;
- interacting but controlled structural ambiguities;
- ordered sound rules and richer paradigms;
- variety/register comparisons;
- linked analysis across no more than three representations.

### Level 5: Introductory linguistics fluency

- construct and defend an analysis under the named framework;
- compare representations without conflating them;
- state exactly what data establishes and what remains uncertain;
- solve novel, reviewed micro-language datasets;
- detect framework dependence, variation bias, and semantic overclaims.

Progress is tracked separately for word class, morphology, constituency, function, dependency, meaning, sound, and data inference. High POS accuracy must not hide weak tree construction.

## 13. Adaptive guidance

- Repeated noun/verb/adjective confusion triggers distributional-frame practice, not definition flashcards.
- Form/function confusion triggers matched items where the same NP changes from subject to object.
- Boundary errors trigger span selection before full tree editing.
- Attachment errors trigger paraphrase-to-tree matching with smaller trees.
- Agreement errors split controller identification from form selection.
- Entailment errors trigger concrete finite worlds and countermodels.
- Phoneme/allophone errors trigger minimal pairs before complementary-distribution inference.
- Cross-linguistic overgeneralization triggers `insufficient evidence` datasets.
- Mastery requires both recognition and construction; multiple-choice streaks alone cannot retire a family.
- Hints reveal one layer at a time: vocabulary meaning, token classes, phrase boundaries, heads, then answer-specific evidence.

Do not adapt by silently switching dialect, accent, theoretical framework, or dependency convention.

## 14. Answer checking and feedback

### Structured checking

Prefer semantic controls:

- token/span IDs for selections;
- stable category/function/relation codes;
- normalized feature bundles and unordered sets;
- tree editor nodes and edges;
- ordered morpheme/token chips;
- finite choice for analyses and evidence status;
- accessible chart coordinates for vowel tasks.

### Tree checking

Normalize whitespace and UI node IDs, then compare:

1. root label;
2. ordered terminal yield;
3. labeled constituent spans;
4. licensed productions and head designation;
5. gap indices/licenses;
6. dependency root, heads, labels, acyclicity, and connectivity.

When several parses are intended, compare against the complete normalized accepted set. Numerical string sampling is never a substitute for tree identity.

### Text, IPA, and gloss checking

- Use Unicode normalization before comparison.
- Localized labels resolve to stable codes.
- Do not autocorrect learner input before grading.
- IPA normalization may equate typographic variants explicitly listed by the active profile, but not distinct phonetic symbols.
- Gloss labels are canonicalized after parsing separators.
- Bracket parser errors report the first unmatched bracket, unknown label, missing terminal, or invalid production.

### Feedback order

Feedback should:

1. state the correct analysis under the named profile;
2. point to decisive distributional, structural, feature, model, or dataset evidence;
3. identify the misconception represented by the learner's answer;
4. show a minimal contrast, tree overlay, paradigm row, countermodel, or rule trace;
5. note an accepted variant or unresolved ambiguity when relevant.

Never say that an answer “sounds wrong” as the entire explanation.

## 15. Rendering and accessibility requirements

- Trees are semantic SVG/HTML structures with a synchronized bracket-text view.
- Tree nodes, edges, and terminals are keyboard reachable; screen readers can traverse parent, children, span, head, and relation.
- Edge meaning is never encoded by color alone.
- Dense trees support zoom, pan, collapse, and focus without reducing text below readable size.
- Token selection uses buttons/chips and has a non-drag alternative.
- Constituency spans use brackets/underlines in addition to background color.
- IPA uses a bundled or reliable font with tested glyph coverage and textual feature labels.
- Vowel charts have table/list alternatives.
- Audio has replay, volume, transcript-after-answer, speaker/accent metadata, and an equivalent non-audio skill path.
- Interlinear gloss tiers remain aligned at zoom and expose row-wise screen-reader text.
- Examples use short, neutral, inclusive scenarios and avoid requiring color, gender-name inference, or cultural knowledge.
- Localization may reorder explanatory UI, but object-language token order and tree yield are immutable.

## 16. Generator and implementation architecture

### Semantic-first record

```text
LinguisticInstance {
  seed
  contentVersion
  languageProfile
  variety
  register
  semanticFrame
  discourseContext
  lexemes[]
  tokens[]
  morphology[]
  constituencyTree
  dependencyTree
  functions[]
  phonologicalForms[]
  acceptedAnalyses[]
  evidenceStatus
  misconceptionTags[]
}
```

Build meaning and structural record first. Realize surface text afterward. Answers, distractors, hints, and explanations must query this record rather than reanalyzing the string heuristically.

### Controlled resources

- versioned English lexicon with category, inflection, valency, semantic type, register, and ambiguity data;
- explicit phrase grammar and head rules;
- reviewed construction/variety status table;
- morphology and agreement transducers with exceptions;
- restricted dependency relation definitions;
- finite-model semantic evaluator;
- IPA feature matrix and reviewed phonological datasets;
- constructed micro-language schema and interlinear-gloss renderer.

No runtime language model, online parser, dictionary, translation service, speech recognizer, or backend is assumed. The app remains a standalone HTML/JS/CSS page and works offline.

### Distractors

Every distractor maps to a named misconception, such as:

- semantic POS definition;
- category/function confusion;
- nearest-head attachment;
- linear rather than hierarchical scope;
- omitted-phrase-equals-adjunct;
- nearest-noun agreement;
- “some means not all”;
- spelling-equals-sound;
- complementary-distribution-overclaim;
- English-is-universal;
- insufficient-data overgeneralization.

Random relabeling is not a valid distractor strategy.

## 17. Automated validation

For every generated instance:

- all tokens, lexemes, morphemes, features, and profile references resolve;
- morphology parses and regenerates the surface forms;
- constituency tree is rooted, ordered, licensed, gap-valid, and yield-identical;
- functions agree with valency frames;
- dependency tree has one root, one head per other token, no cycles, connectivity, and licensed labels;
- agreement and case features unify;
- semantic realization and every accepted parse map to the intended meaning/readings;
- ambiguous questions expose all intended answers; unique-answer questions have exactly one;
- distractors fail for their tagged reason and no other accepted profile licenses them accidentally;
- finite-world answers are recomputed;
- phonological outputs satisfy feature matrices, environments, rule ordering, and notation level;
- gloss tiers align and every abbreviation is defined;
- feedback regenerates from the same oracle;
- no question depends on unintroduced vocabulary or outside facts.

Property and regression tests must cover:

- every dual-category lexeme in each licensed frame;
- every POS, phrase, function, dependency, and feature label;
- all tree productions, unary/gap rules, and invalid-tree mutations;
- active/passive semantic-role preservation;
- question/negation tense placement and irregular `be/do/have`;
- every pronoun paradigm cell and binding-domain boundary;
- each ambiguity template with a distinguishing context/world;
- entailment, compatibility, scope, presupposition, and implicature counterexamples;
- every active IPA feature and allophonic environment boundary;
- rule ordering and simultaneous/sequential application;
- every micro-language paradigm cell and all compatible-hypothesis count;
- accepted variants across each reviewed profile;
- at least `10,000` deterministic seeds per combinatorial family/level.

Corpus/review tests flag bizarre selectional combinations, violent or sexual example drift, stereotypes, names that leak gender, unreviewed dialect mimicry, accidental real-language resemblance in constructed systems, offensive cross-linguistic glosses, and excessive repetition.

## 18. Coverage requirements

The initial specification defines exactly 100 stable families:

| Category | Families |
|---|---:|
| Word classes in context | 11 |
| Morphology and word structure | 10 |
| Constituency and phrase structure | 12 |
| Parse trees and structural ambiguity | 10 |
| Grammatical functions and clause structure | 11 |
| Dependencies, agreement, and reference | 10 |
| Semantics and pragmatics | 10 |
| Phonetics and phonology | 10 |
| Cross-linguistic pattern inference | 9 |
| Usage, variation, and integrated analysis | 7 |
| **Total** | **100** |

Across a long mixed session:

- no single category exceeds 20% unless explicitly focused;
- construction accounts for at least 30% after Level 2;
- at least 20% of advanced syntax items contain a legitimate alternative, an `insufficient evidence` answer, or an explicit reason uniqueness holds;
- form/function contrast recurs across POS, constituency, function, and dependency work;
- every active phrase label and dependency relation appears in both reading and production/repair;
- morphology includes inflection, derivation, allomorphy, and hierarchy;
- semantics includes model-based counterexamples rather than intuition-only judgments;
- phonology includes non-audio symbolic practice;
- cross-linguistic practice never requires unintroduced language knowledge;
- every declared misconception is intentionally exercised;
- variation items balance formal, neutral, conversational, and reviewed-variety examples without ranking speakers.

## 19. Recommended views and v1 priorities

Recommended navigation:

1. Words & Word Structure
2. Phrases & Parse Trees
3. Clauses & Dependencies
4. Meaning & Context
5. Sounds & Patterns
6. Languages & Analysis

Recommended v1:

- contextual POS;
- transparent morphology;
- NP/VP/PP constituency spans and heads;
- shallow tree reading/building;
- form versus function;
- subject/object/complement/adjunct;
- basic agreement;
- attachment ambiguity with paraphrases;
- finite-world truth and entailment;
- small IPA feature and minimal-pair subset;
- gloss alignment and one-rule constructed micro-languages.

Defer audio, complex binding, richer dependency conversion, ordered phonological rules, and reviewed real-language datasets until their data pipelines and accessibility alternatives are complete.

## 20. Topic-level quality checklist

- [ ] Form, function, dependency relation, and semantic role remain separate fields.
- [ ] Every judgment names a variety/register/model.
- [ ] No dialect or accent is described as deficient.
- [ ] Contextual distribution, not a semantic slogan, drives POS answers.
- [ ] Constituency diagnostics are presented as evidence, not universal proofs.
- [ ] Tree notation, productions, head rules, gaps, and validation are pinned.
- [ ] Genuine ambiguity preserves all accepted parses and readings.
- [ ] Unique-answer prompts have been proven unique under the active grammar.
- [ ] Valency, agreement, case, and reference are table/structure driven.
- [ ] Semantic answers come from finite models or authored pragmatic records.
- [ ] IPA and gloss notation use versioned, documented subsets.
- [ ] Audio is optional, local, licensed, and never automatically grades accent quality.
- [ ] Constructed micro-languages do not masquerade as claims about real languages.
- [ ] Real-language/variety examples have source and human-review metadata.
- [ ] Every distractor represents a plausible misconception.
- [ ] Every family has difficulty progression, three examples, and validation.
- [ ] Integrated items combine no more than three newly interacting demands.
- [ ] The app works completely offline without a backend or runtime language service.
