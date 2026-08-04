const rows = [
  ["kana_recognition","Recognize kana","Recall a hiragana or katakana symbol as a sound without using its visual neighbors."],
  ["kana_production","Produce kana","Write the requested mora in the requested Japanese script."],
  ["kana_script_conversion","Convert hiragana and katakana","Preserve every mora while changing only the script."],
  ["voicing_marks","Use voicing marks","Dakuten and handakuten change a base kana's consonant; compare the whole mora."],
  ["small_tsu","Read small っ","Small っ marks a following consonant closure and counts as one mora."],
  ["long_vowel","Read long vowels","Long vowels change mora count and sometimes meaning; ー is itself a mora."],
  ["contracted_kana","Read contracted kana","A full i-row kana plus small ゃ, ゅ, or ょ forms one contracted mora."],
  ["mora_segmentation","Segment morae","Segment by Japanese timing units: small っ, ん, and ー count separately."],
  ["contextual_vocabulary","Choose vocabulary in context","Use the sentence role and meaning, not an isolated gloss, to select the word."],
  ["collocation_choice","Choose natural collocations","Select the conventional verb–noun pairing used in contemporary standard Japanese."],
  ["kanji_word_reading","Read kanji words","Give the stored whole-word reading; do not concatenate arbitrary character readings."],
  ["reading_to_kanji_word","Choose kanji from a reading","Use context to disambiguate words that share a reading."],
  ["okurigana","Complete okurigana","Keep the kanji stem and supply the kana ending required by the form."],
  ["kanji_component","Recognize kanji components","Use component shape and position as a recognition aid, not as a guaranteed etymology."],
  ["kanji_stroke_order","Reason about stroke order","Apply the pinned educational stroke-order model to common characters."],
  ["homophone_context","Resolve homophones","The surrounding phrase decides which same-sounding word and kanji fit."],
  ["orthography_register_choice","Choose appropriate orthography","Choose kana, katakana, or kanji according to word type and grammatical role."],
  ["topic_subject","Choose は or が","Use は for an established or contrastive topic and が for focused subject information in this model."],
  ["direct_object_particle","Use を","Mark the direct object—and specified path uses—with を."],
  ["ni_de_e","Distinguish に, で, and へ","Use に for targets and existence, で for an action setting, and へ for direction."],
  ["no_nominalization","Use の","Distinguish possession, ellipsis, and controlled nominalization uses of の."],
  ["to_roles","Use と","Recognize companion, quotation, and exhaustive-list roles of と."],
  ["mo_kara_made_yori","Use も, から, まで, and より","Match each particle to addition, source, endpoint, or comparison baseline."],
  ["existence_location","Use ある and いる","Use いる for animate existence and ある for inanimate existence or possession patterns."],
  ["demonstratives","Use ko-so-a-do demonstratives","Choose a form by distance, discourse ownership, and whether it modifies a noun."],
  ["sentence_order","Assemble sentence chunks","Place topic, setting, object, modifier, and predicate into a grammatical Japanese sequence."],
  ["question_response","Complete question–answer pairs","Respond to the speech act and requested information, not merely a repeated word."],
  ["noun_copula","Inflect nouns with the copula","Coordinate politeness, tense, and polarity across だ／です and negative forms."],
  ["i_adjective_inflection","Inflect い-adjectives","Replace final い with the required く- or かった-pattern; いい uses よ-."],
  ["na_adjective_inflection","Inflect な-adjectives","Use な before a noun and copular forms in predicate position."],
  ["verb_group","Identify verb groups","Classify ichidan, godan, and irregular verbs, including common る exceptions."],
  ["polite_plain","Convert polite and plain verbs","Change the inflected verb form itself; do not append です to a plain verb."],
  ["verb_tense_polarity","Inflect verb tense and polarity","Apply the correct group rule and stated register for past/nonpast and affirmative/negative."],
  ["te_form","Build the て-form","Select the sound change by verb group and ending; 行く is a pinned exception."],
  ["te_iru_aspect","Interpret ている","Context distinguishes an ongoing action, continuing state, and resultant state."],
  ["potential_desire","Express ability and desire","Keep potential ability separate from ～たい desire and observe the stated perspective."],
  ["permission_prohibition_obligation","Interpret obligation patterns","Distinguish ～てもいい, ～てはいけない, and ～なければならない."],
  ["volitional_request","Form invitations and requests","Choose volitional, ～ましょう, or ～てください according to the speech act."],
  ["transitive_intransitive_pair","Distinguish transitive and intransitive pairs","Track whether an agent changes an object or the object is described as changing."],
  ["relative_clause","Build relative clauses","Place a plain-form clause directly before its head noun without a relative pronoun."],
  ["comparison_superlative","Make comparisons","Use より for the baseline, のほうが for the preferred side, and いちばん within a set."],
  ["reason_and_contrast","Connect reasons and contrasts","Choose から, ので, が, or けど from meaning and register."],
  ["conditional_choice","Choose a conditional","Use と for regular consequences, たら for completed conditions, and なら for a given premise."],
  ["giving_receiving","Track giving and receiving","Choose あげる, くれる, or もらう by viewpoint and direction of benefit."],
  ["sequence_experience","Express sequence and experience","Distinguish ～てから, ～たり～たり, and ～たことがある."],
  ["register_pragmatics","Choose an appropriate register","Match politeness, directness, and wording to the relationship and situation."],
  ["sentence_segmentation_parse","Parse sentence structure","Find predicate and modifier boundaries before interpreting individual words."],
  ["short_reading_comprehension","Read short connected text","Combine explicit facts, reference, contrast, and event order in a controlled passage."],
  ["notice_message","Interpret notices and messages","Identify the required action or location in compact practical Japanese."],
  ["dialogue_completion","Complete dialogues","Choose a socially and grammatically coherent next turn."],
  ["reference_ellipsis","Resolve reference and ellipsis","Recover omitted subjects or objects only from the controlled discourse context."],
  ["listening_word_contrast","Distinguish spoken words","Listen for mora length, voicing, and the exact recorded word."],
  ["listening_dictation","Write what you hear","Transcribe the human recording in the accepted script without relying on browser speech recognition."],
  ["listening_comprehension","Understand recorded Japanese","Select the meaning supported by the human-recorded utterance."],
  ["guided_speaking_shadowing","Shadow and self-review","Listen, repeat, record locally, and judge comfort yourself; the app never claims pronunciation scoring."]
];

const trapByCategory = {
  kana_sound:"Compare morae and script exactly; similar shapes and romanization are distractors.", vocabulary_kanji:"Use the displayed context; a character or gloss alone may be ambiguous.", particles_sentences:"Particle choice follows semantic role and information structure, not one-word translation.", inflection_core:"Keep verb or adjective class, tense, polarity, and register separate.", connected_grammar:"Interpret the whole event and viewpoint before choosing a construction.", reading_listening:"Base the answer only on the displayed or recorded evidence; revealing a transcript is a scaffold."
};
const categoryOf = id => rows.findIndex(r=>r[0]===id)<8?"kana_sound":rows.findIndex(r=>r[0]===id)<17?"vocabulary_kanji":rows.findIndex(r=>r[0]===id)<27?"particles_sentences":rows.findIndex(r=>r[0]===id)<38?"inflection_core":rows.findIndex(r=>r[0]===id)<46?"connected_grammar":"reading_listening";
const families = Object.fromEntries(rows.map(([id,title,rule])=>[id,{title,rule,trap:trapByCategory[categoryOf(id)],example:"Controlled Japanese prompt → one exact contextual answer."}]));
const prompts = Object.fromEntries(rows.map(([id,title])=>[id,`${title}: choose or enter the answer required by the displayed context.`]));
const answerIds = `second_mora_voiced first_mora_voiced no_voicing_difference geminate_second same_morae long_vowel_second contains_small_tsu contains_long_vowel contains_small_y second_has_long_a first_has_long_a same_length two_long_marks one_long_mark no_long_marks final_long_e final_geminate final_moraic_n first_contracted second_contracted both_contracted person_and_tree sun_and_moon water_and_every inner_stroke_orientation dakuten same_character horizontal_then_vertical vertical_then_horizontal either_order left_middle_right right_middle_left middle_left_right person_component_then_tree tree_then_person_component outside_then_inside have_older_brother older_brother_is_classroom speaker_is_older_brother yes_drink yes_coffee_is no_where yes_gladly it_is_a_book where_is_station ichidan godan irregular ongoing resultant_state completed_once continuing_state action_this_second future_intention someone_is_opening_now permission prohibition obligation desire invitation experience tanaka book shop the_bag speaker_a lightness sister speaker library station school eat_then_walk walk_then_eat only_walk train bus walk do_not_take_photos take_photos_here show_your_photo ask_at_reception leave_building cancel_meeting arrive_station leave_station walk_home air silver heart high_school_student teacher university comfortable retry`.split(/\s+/);
const humanize = id => id.replaceAll("_"," ").replace(/([a-z])([A-Z])/g,"$1 $2").replace(/^./,c=>c.toUpperCase());
const answers = Object.fromEntries(answerIds.map(id=>[id,humanize(id)]));
Object.assign(answers,{ichidan:"Ichidan verb",godan:"Godan verb",irregular:"Irregular verb",comfortable:"Comfortable enough to continue",retry:"Repeat and try again",tanaka:"Tanaka",book:"The book",speaker:"The speaker",library:"The library",station:"The station",school:"The school",train:"The train",bus:"The bus",walk:"Walk",air:"Air",silver:"Silver",heart:"Heart",teacher:"Teacher",university:"University",high_school_student:"High-school student"});
const contextKeys = `actionLocation addDakuten addHandakuten afterArrival also animateExists askWhat attachRelative automaticResult bookBoughtYesterday borrowBook boundedSet chosenTransport comitative compareGeminate compareLength compareVoicing comparisonBaseline contrast contrastTopics crossBridge destination dictionaryForm distinguishComponents doorOpened drinkWater ellipsisNo establishedTopic eventOrder examples exhaustiveList existenceLocation focusedSubject friendContext friendGivesSpeaker givenPlan identifyPredicate ikuException inanimateExists interestingBook invitation lifeExperience lightIsOn listenChoose listenMeaning listenType loanword messageAction modifiesNoun nearSpeaker nominalizedActivity noticeAction omittedObject omittedSubject particleSpelling pathRole personOpenedDoor personTeachesJapanese politeDecline possession preferCats questionLocation quotation reason relativeChunk riverContext ruException selfContext sequence serviceContext shadowSelfCheck smallY softReason soreReference source speakerGives speakerReceives teacherContext todayReading townWhereLive waterComponent weatherContext whereEnter whereGoes`.split(/\s+/);
const contexts = Object.fromEntries(contextKeys.map(id=>[id,humanize(id)]));

export default {code:"en",lang:"en",suffix:"",text:{
  localeCode:"en",appTitle:"Japanese Language",brandSubtitle:"Practice kana, vocabulary, kanji, particles, inflection, connected grammar, reading, listening, and guided speaking.",educationalNote:"Contemporary standard Japanese · controlled local models · human-recorded offline audio · numbers and dates remain in their sister app",
  summary:{aria:"Progress summary",mastery:"Avg mastery",accuracy:"Accuracy",attempts:"Attempts"},nav:{aria:"Main",practice:"Practice",matrix:"Matrix",stats:"Stats",settings:"Settings",learn:"Learn"},
  practice:{modeAria:"Practice mode",adaptive:"Adaptive",manual:"Manual",pause:"Pause",paused:"Paused",learnThis:"Learn this",category:"Category",family:"Question family",level:"Level",mastery:"0% mastery",masterySuffix:"mastery",check:"Check",next:"Next",skip:"Skip",choose:"Choose…",keypadAria:"Japanese input helpers",delete:"Del",clear:"Clear",pauseText:"The timer is stopped for this question.",resume:"Resume",controlsAria:"Practice controls",masteryMetric:"Mastery",accuracyMetric:"Accuracy",streak:"Streak",avgTime:"Avg time"},
  matrix:{title:"Japanese Language Skill Matrix",intro:"Every cell opens one stable language exercise family at one structural difficulty level."},stats:{title:"Stats",intro:"Progress is tracked independently for every family and level.",totalAttempts:"Total attempts",totalCorrect:"Total correct",totalTime:"Total time",practicedLevels:"Practiced levels",needsWork:"Needs Work",strongest:"Strongest",tries:"tries",noAttemptsYet:"No attempts yet"},settings:{title:"Settings",intro:"Stored locally in this browser.",adaptiveCategories:"Adaptive categories",data:"Data",dataIntro:"Export, import, or reset local progress.",progressJson:"Progress JSON",export:"Export",copy:"Copy",import:"Import",reset:"Reset"},learn:{title:"Learn",intro:"Rules, examples, and common traps for the app's controlled contemporary-Japanese model.",commonTrap:"Use the displayed context and requested register."},
  messages:{correct:"Correct",notQuite:"Not quite",expected:"Expected",time:"Time",invalidJson:"Invalid JSON",resetConfirm:"Reset all local progress?"},
  audio:{play:"Play human recording",playError:"Audio could not be played.",reveal:"Reveal text alternative (scaffold)",credit:"Recording",record:"Record yourself",stop:"Stop",delete:"Delete recording",recording:"Recording…",ready:"Recording ready for private replay.",private:"Your recording stays in memory and is never scored or uploaded.",deleted:"Recording deleted.",permissionError:"Microphone permission was not granted.",unsupported:"Recording is not supported in this browser.",creditsTitle:"Offline audio credits"},
  categories:{kanaSound:"Kana, Sound, and Input",vocabularyKanji:"Vocabulary, Kanji, and Orthography",particlesSentences:"Particles and Sentence Structure",inflectionCore:"Inflection and Core Constructions",connectedGrammar:"Connected and Intermediate Constructions",readingListening:"Reading, Listening, and Interaction"},families,prompts,answers,contexts,labels:{answer:"Answer"},surfaceReplacements:[]
}};
