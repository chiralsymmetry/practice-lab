import vm from "node:vm";

const locale = (await import("./locales/en.mjs")).default;
const source = (await Bun.file(new URL("./main.js", import.meta.url)).text()).replace("__LOCALE_TEXT__", JSON.stringify(locale.text));
const context = { window: {}, document: { addEventListener() {} }, console };
vm.createContext(context);
vm.runInContext(source, context);
const app = context.window.GitVersionControlPractice;
if (!app || app.modelId !== "git-state-v1") throw new Error("Git app/model missing");
const o = app.oracles;

function fail(label, details) { throw new Error(`${label}: ${details}`); }
function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function reachableRef(dag, tip) {
  const seen = new Set(), stack = dag[tip] ? [tip] : [];
  while (stack.length) { const id = stack.pop(); if (seen.has(id)) continue; seen.add(id); for (const parent of dag[id] || []) stack.push(parent); }
  return [...seen].sort();
}
function statusRef(head, index, work, path) {
  const h = Object.hasOwn(head,path) ? head[path] : null, i = Object.hasOwn(index,path) ? index[path] : null, w = Object.hasOwn(work,path) ? work[path] : null;
  return { staged: h === i ? " " : h === null ? "A" : i === null ? "D" : "M", unstaged: i === w ? " " : i === null ? "?" : w === null ? "D" : "M" };
}
function mergeRef(base, ours, theirs) {
  const tree = {}, conflicts = [];
  for (const path of [...new Set([...Object.keys(base),...Object.keys(ours),...Object.keys(theirs)])].sort()) {
    const b = Object.hasOwn(base,path) ? base[path] : null, l = Object.hasOwn(ours,path) ? ours[path] : null, r = Object.hasOwn(theirs,path) ? theirs[path] : null;
    let value;
    if (l === r) value = l; else if (l === b) value = r; else if (r === b) value = l; else { conflicts.push(path); continue; }
    if (value !== null) tree[path] = value;
  }
  return { tree, conflicts };
}

for (let i = 0; i < 100_000; i += 1) {
  const n = i % 10 + 2, dag = { A: [] }; let prior = "A";
  for (let j = 1; j < n; j += 1) { const id = String.fromCharCode(65+j); dag[id] = [prior]; prior = id; }
  if (!o.graphIsAcyclic(dag)) fail("acyclic",i);
  if (!eq(o.reachable(dag,prior),reachableRef(dag,prior))) fail("reachability",i);
  const middle = String.fromCharCode(65+Math.floor(n/2));
  if (!o.isAncestor(dag,middle,prior) || o.isAncestor(dag,prior,middle) !== (prior === middle)) fail("ancestor",i);
}

const values = [null,"v1","v2","v3"];
for (let i = 0; i < 150_000; i += 1) {
  const h = values[i%4], x = values[Math.floor(i/4)%4], w = values[Math.floor(i/16)%4];
  const head = h === null ? {} : {a:h}, index = x === null ? {} : {a:x}, work = w === null ? {} : {a:w};
  if (!eq(o.pathState(head,index,work,"a"),statusRef(head,index,work,"a"))) fail("status",i);
}

for (let i = 0; i < 100_000; i += 1) {
  const source = {a:`v${i%7}`,b:"fixed"}, target = {a:`v${(i+1)%7}`,b:"fixed"}; if (i%5===0) target.c="new";
  const expected = source.a === target.a ? (target.c ? ["c"] : []) : (target.c ? ["a","c"] : ["a"]);
  if (!eq(o.diffPaths(source,target),expected)) fail("diff paths",i);
  const mode = ["soft","mixed","hard"][i%3], state = {headTree:{a:"old"},index:{a:"index"},work:{a:"work"}}, reset = o.resetState(state,{a:"target"},mode);
  if (reset.headTree.a!=="target" || (mode!=="soft"&&reset.index.a!=="target") || (mode==="hard"&&reset.work.a!=="target")) fail("reset",i);
}

for (let i = 0; i < 75_000; i += 1) {
  const dag = {A:[],B:["A"],C:["B"],D:["B"],E:["C","D"]};
  const left = i%2 ? "C" : "D", got = o.range(dag,left,"E"), ref = reachableRef(dag,"E").filter((id)=>!reachableRef(dag,left).includes(id)).sort();
  if (!eq(got,ref)) fail("revision range",i);
  if (o.mergeBase(dag,"C","D")!=="B") fail("merge base",i);
}

for (let i = 0; i < 100_000; i += 1) {
  const base={a:`${i%3}`,b:"1"}, ours={...base}, theirs={...base};
  if (i%2) ours.a="ours"; else ours.b="ours";
  if (i%4===0) theirs.a="theirs"; else theirs.b="theirs";
  const got=o.mergeTrees(base,ours,theirs), ref=mergeRef(base,ours,theirs); if(!eq(got,ref)) fail("three-way merge",i);
}

for (let i = 0; i < 50_000; i += 1) {
  const base={a:"base"}, ours={a:`ours${i}`}, theirs={a:`theirs${i}`}, got=o.mergeTrees(base,ours,theirs);
  if(got.conflicts.length!==1||got.conflicts[0]!=="a"||Object.hasOwn(got.tree,"a")) fail("conflict stages prerequisite",i);
}

for (let i = 0; i < 100_000; i += 1) {
  const state={headTree:{a:"2"},index:{a:i%2?"2":"3"},work:{a:"4"}}, target={a:"1"};
  for(const mode of ["soft","mixed","hard"]){const before=JSON.stringify(state),next=o.resetState(state,target,mode);if(JSON.stringify(state)!==before)fail("immutable reset",i);if(next.headTree.a!=="1")fail("reset head",i);if(mode==="soft"&&next.index.a!==state.index.a)fail("soft index",i);if(mode==="mixed"&&next.work.a!=="4")fail("mixed work",i);if(mode==="hard"&&next.work.a!=="1")fail("hard work",i);}
}

for (let i = 0; i < 100_000; i += 1) {
  const dag={A:[],B:["A"],C:["B"],D:["B"],E:["C","D"]}, old=["A","B","C","D"][i%4], proposed=["B","C","D","E"][Math.floor(i/4)%4];
  const expected=old===null||reachableRef(dag,proposed).includes(old); if(o.pushDecision(dag,old,proposed)!==expected)fail("push",i);
  const expectedLease=`C${i%17}`, actual=i%3?expectedLease:`D${i%17}`; if(o.leaseDecision(expectedLease,actual)!==(expectedLease===actual))fail("lease",i);
  const counts=o.aheadBehind(dag,"C","D");if(counts.ahead!==1||counts.behind!==1)fail("ahead behind",i);
}

for (let i = 0; i < 50_000; i += 1) {
  const rules=i%2?["*.log","!keep.log"]:["tmp*"], path=i%3===0?"keep.log":i%3===1?"trace.log":"tmp1";
  let ignored=false;for(const rule of rules){const neg=rule.startsWith("!"),p=neg?rule.slice(1):rule;const regex=new RegExp("^"+p.replace(/\./g,"\\.").replace(/\*/g,".*")+"$");if(regex.test(path))ignored=!neg;}
  if(o.ignoreMatch(path,rules)!==ignored)fail("constraint/ignore scenario",i);
}

for(let length=3;length<=14;length+=1){const path=Array.from({length},(_,i)=>String.fromCharCode(65+i));for(let good=0;good<length-1;good+=1)for(let bad=good+1;bad<length;bad+=1)for(const tie of ["lower","upper"]){const candidates=[];for(let i=good+1;i<bad;i+=1)candidates.push(i);const expected=!candidates.length?path[bad]:path[candidates[tie==="upper"?Math.floor(candidates.length/2):Math.floor((candidates.length-1)/2)]];if(o.bisectMidpoint(path,good,bad,tie)!==expected)fail("bisect",`${length}:${good}:${bad}:${tie}`);}}

let generated=0;
for(let familyIndex=0;familyIndex<app.families.length;familyIndex+=1){const family=app.families[familyIndex];for(let level=1;level<=5;level+=1){const signatures=new Set();for(let sample=0;sample<200;sample+=1){const seed=((familyIndex+1)*10_000_000+level*10_000+sample+1)>>>0,item=app.generateQuestion(family.id,level,seed,true);if(!app.checkQuestion(item.canonicalAnswer,item).correct)fail("canonical",`${family.id}:${level}:${seed}`);signatures.add(item.structuralSignature);generated+=1;}if(signatures.size<2)fail("variation",`${family.id}:${level}`);}}

console.log(`Git extended validation passed: 825,000 property cases, exhaustive bisect intervals, and ${generated.toLocaleString("en-US")} generated questions`);
