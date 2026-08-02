export default {
  code: "en", lang: "en", suffix: "",
  text: {
    localeCode: "en",
    appTitle: "SQL & Relational Database Reasoning",
    brandSubtitle: "Practice exact mental execution of queries, NULL logic, joins, groups, transactions, normalization, and indexes on small synthetic tables.",
    educationalNote: "Pinned model: PracticeSQL-1 · synthetic local data only · no database connection, backend, or execution against real systems.",
    summary: { aria: "Progress summary", mastery: "Avg mastery", accuracy: "Accuracy", attempts: "Attempts" },
    nav: { aria: "Main", practice: "Practice", matrix: "Matrix", stats: "Stats", settings: "Settings", learn: "Learn" },
    practice: { modeAria:"Practice mode", adaptive:"Adaptive", manual:"Manual", pause:"Pause", paused:"Paused", learnThis:"Learn this", category:"Category", family:"Question family", level:"Level", mastery:"0% mastery", masterySuffix:"mastery", check:"Check", next:"Next", skip:"Skip", choose:"Choose…", keypadAria:"Structured answer keypad", delete:"Del", clear:"Clear", nextField:"Move to the next answer field", nextFieldShort:"Field →", pauseText:"The timer is stopped for this question.", resume:"Resume", controlsAria:"Practice controls", masteryMetric:"Mastery", accuracyMetric:"Accuracy", streak:"Streak", avgTime:"Avg time" },
    matrix:{title:"Skill Matrix",intro:"Every cell opens one stable SQL or relational-reasoning family at one structural difficulty level."},
    stats:{title:"Stats",intro:"Progress is tracked independently for every family and level.",totalAttempts:"Total attempts",totalCorrect:"Total correct",totalTime:"Total time",practicedLevels:"Practiced levels",needsWork:"Needs Work",strongest:"Strongest",tries:"tries",noAttemptsYet:"No attempts yet"},
    settings:{title:"Settings",intro:"Stored locally in this browser.",adaptiveCategories:"Adaptive categories",data:"Data",dataIntro:"Export, import, or reset local progress.",progressJson:"Progress JSON",export:"Export",copy:"Copy",import:"Import",reset:"Reset"},
    learn:{title:"Learn",intro:"PracticeSQL-1 rules, representative examples, and the important trap for every family."},
    messages:{correct:"Correct",notQuite:"Not quite",expected:"Expected",time:"Time",invalidJson:"Invalid JSON",imported:"Progress imported.",copied:"Progress copied.",resetConfirm:"Reset all local SQL progress?"},
    fieldLabels:{answer:"Answer",count:"Count",result:"Result",rows:"Rows",value:"Value",cost:"Cost",closure:"Closure"},
    generated:{
      modelNote:"PracticeSQL-1; NULL is a distinct marker and unordered results are bags unless the query says otherwise.",
      prompts:{
        lookup:"Read the schema and choose the exact answer.", classify:"Classify the displayed relational object.", valid:"Is the displayed operation valid?", operation:"Which operation or phase is represented?", schema:"Choose the schema that satisfies the requirement.", result:"Choose the exact result.", rows:"Which row identifiers are returned?", truth:"Evaluate the expression using SQL three-valued logic.", match:"Which displayed values match?", scope:"Is this name use valid in PracticeSQL-1?", query:"Choose the query that exactly implements the requirement.", guarantee:"Which claim is guaranteed?", order:"Choose the exact ordered result.", count:"How many result rows are produced?", compare:"Compare the two displayed operations.", aggregate:"Compute the requested aggregate result.", context:"What does UNKNOWN do in this context?", state:"Choose the exact final state.", dependency:"Reason from the displayed functional dependencies.", index:"Choose the exact index or plan conclusion."
      },
      labels:{schema:"Schema",table:"Table",rows:"Rows",query:"Query",requirement:"Requirement",dependencies:"Functional dependencies",index:"Index",workload:"Workload",schedule:"Schedule",constraints:"Constraints",ordered:"ordered",unorderedBag:"unordered bag",rowIds:"row ids",existing:"existing",proposed:"proposed"},
      choices:{yes:"Yes",no:"No",true:"TRUE",false:"FALSE",unknown:"UNKNOWN",null:"NULL",valid:"Valid",invalid:"Error",allowed:"Allowed",rejected:"Rejected",selection:"selection / row filtering",projection:"projection / select list",join:"join / pair formation",grouping:"grouping / aggregation",dedup:"duplicate elimination",candidate:"candidate key",superkey:"nonminimal superkey",notkey:"not a superkey",manyone:"many-to-one; optional only if nullable",onetoone:"at most one-to-one",unordered:"Unordered bag; duplicates may matter",orderedOnly:"Ordered only with ORDER BY",scan:"full table scan",indexPlan:"index lookup",covered:"covered by the index",notCovered:"requires a table lookup",lossless:"lossless",lossy:"lossy",update:"update anomaly",insert:"insert anomaly",delete:"delete anomaly",oneNF:"1NF",twoNF:"2NF",threeNF:"3NF",bcnf:"BCNF",commit:"commits",abort:"aborts"},
      explanationLead:"Apply the displayed PracticeSQL-1 rule. The exact answer is",
      nullToken:"SQL null"
    }
  }
};
