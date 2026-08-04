import vm from "node:vm";

async function load(localeName) {
  const locale = (await import(`./locales/${localeName}.mjs`)).default;
  const source = (await Bun.file(new URL("./main.js", import.meta.url)).text()).replace("__LOCALE_TEXT__", JSON.stringify(locale.text));
  const context = {window:{},document:{addEventListener(){}},console};
  vm.createContext(context);
  vm.runInContext(source, context);
  return {app:context.window.PracticalCryptography,locale};
}

const {app,locale:enLocale} = await load("en");
const {app:sv,locale:svLocale} = await load("sv");
if (!app || app.modelId !== "practical-crypto-rules-v1" || !app.oracles) throw new Error("Practical cryptography model/oracles missing");
if (app.families.length !== 67 || new Set(app.families.map(f=>f.id)).size !== 67) throw new Error("Practical cryptography family registry mismatch");
const o = app.oracles;
function fail(label, details=[]) { throw new Error(`${label}: ${details.join(", ")}`); }
function mod(n,m){return((n%m)+m)%m;}
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a;}
function inverse(a,m){for(let x=1;x<m;x++)if(mod(a*x,m)===1)return x;return null;}
function letters(text,fn){let at=0;return String(text).toUpperCase().split("").map(ch=>ch>="A"&&ch<="Z"?String.fromCharCode(65+mod(fn(ch.charCodeAt(0)-65,at++),26)):ch).join("");}
function refCaesar(text,key){return letters(text,x=>x+key);}
function refAffine(text,a,b,decrypt=false){const inv=inverse(a,26);if(inv===null)throw new Error("bad affine multiplier");return letters(text,x=>decrypt?inv*(x-b):a*x+b);}
function refVigenere(text,key,decrypt=false){let at=0;return String(text).toUpperCase().split("").map(ch=>{if(ch<"A"||ch>"Z")return ch;const x=ch.charCodeAt(0)-65,k=key.charCodeAt(at++%key.length)-65;return String.fromCharCode(65+mod(x+(decrypt?-k:k),26));}).join("");}
function refXor(a,b){if(a.length!==b.length)throw new Error("length");return a.map((x,i)=>(x^b[i])&255);}
let state=0x94D049BB;function next(){state^=state<<13;state^=state>>>17;state^=state<<5;return state>>>0;}function rand(n){return next()%n;}

for(let i=0;i<100_000;i++){
  const text=["A","Z","HELLO","MEET AT 9!","A, B!"][rand(5)],key=rand(401)-200;
  const expected=refCaesar(text,key);
  if(o.caesar(text,key)!==expected||o.caesar(expected,-key)!==text)fail("independent Caesar",[i,text,key]);
  const multipliers=[1,3,5,7,9,11,15,17,19,21,23,25],a=multipliers[rand(multipliers.length)],b=rand(401)-200;
  const cipher=refAffine(text,a,b);
  if(o.affine(text,a,b,false)!==cipher||o.affine(cipher,a,b,true)!==text)fail("independent affine",[i,text,a,b]);
  if(o.modInverse(a,26)!==inverse(a,26)||o.gcd(a,26)!==gcd(a,26))fail("modular oracle",[a]);
}

for(let i=0;i<50_000;i++){
  const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  for(let p=chars.length-1;p>0;p--){const j=rand(p+1);[chars[p],chars[j]]=[chars[j],chars[p]];}
  const map=chars.join(""),inv=o.invertPermutation(map),plain=["NOON","ATTACK","MEET AT 9!"][rand(3)],cipher=o.substitute(plain,map,false);
  if(new Set(map).size!==26||o.substitute(cipher,map,true)!==plain)fail("substitution permutation",[i]);
  for(let p=0;p<26;p++)if(inv.charCodeAt(map.charCodeAt(p)-65)!==65+p)fail("inverse permutation",[i,p]);
}

for(let i=0;i<100_000;i++){
  const plain=["A","HELLO","MEET AT 9!","ATTACK, NOW!"][rand(4)],key=["B","KEY","LEMON","DOG"][rand(4)],cipher=refVigenere(plain,key);
  if(o.vigenere(plain,key,false)!==cipher||o.vigenere(cipher,key,true)!==plain)fail("independent Vigenere",[i,plain,key]);
  const stream=o.recoverVigenere(plain,cipher);let at=0,expected=plain.split("").filter(ch=>/[A-Z]/.test(ch)).map(()=>key[at++%key.length]).join("");
  if(stream!==expected)fail("Vigenere recovered stream",[i]);
}

for(let i=0;i<250_000;i++){
  const n=1+rand(12),a=Array.from({length:n},()=>rand(256)),b=Array.from({length:n},()=>rand(256)),expected=refXor(a,b);
  if(o.xorBytes(a,b).join()!==expected.join()||o.xorBitPath(a,b).join()!==expected.join()||o.xorBytes(expected,b).join()!==a.join())fail("independent XOR",[i]);
}
for(let i=0;i<50_000;i++){
  const n=1+rand(24),p1=Array.from({length:n},()=>rand(256)),p2=Array.from({length:n},()=>rand(256)),pad=Array.from({length:n},()=>rand(256)),c1=refXor(p1,pad),c2=refXor(p2,pad);
  if(o.xorBytes(c1,c2).join()!==refXor(p1,p2).join()||o.xorBytes(c1,pad).join()!==p1.join())fail("OTP reuse identity",[i]);
}

for(let i=0;i<100_000;i++){
  const records=Array.from({length:2+rand(8)},(_,index)=>({key:`K${rand(4)}`,nonce:rand(12),index}));
  const expected=[];for(let x=0;x<records.length;x++)for(let y=x+1;y<records.length;y++)if(records[x].key===records[y].key&&records[x].nonce===records[y].nonce){expected.push(x,y);}
  const unique=[...new Set(expected)].sort((a,b)=>a-b);
  if(o.duplicateNonces(records).join()!==unique.join())fail("nonce uniqueness per key",[i]);
}
for(const block of [8,16,32])for(let length=0;length<=block*8;length++){
  const got=o.padding(block,length),count=block-(length%block);
  if(got.count!==count||got.value!==count||got.paddedLength%block!==0||got.bytes.length!==count||got.bytes.some(x=>x!==count))fail("padding",[block,length]);
}

const modernSweeps = [
  ["AEAD",["aead_record_fields","aead_aad_reasoning","aead_verify_then_release","encryption_authentication_compare"]],
  ["hash/MAC/password",["hash_determinism_length","hash_property_identify","trusted_digest_scenario","mac_role_and_verification","mac_coverage_tamper","password_record_audit","salt_and_kdf_reasoning"]],
  ["public-key/protocol",["asymmetric_key_roles","signature_workflow","signature_context_scope","hybrid_encryption_trace","key_exchange_authentication","certificate_validation","replay_protection_trace","compromise_and_forward_secrecy"]],
];
for(const [label,ids] of modernSweeps)for(let i=0;i<50_000;i++){
  const id=ids[i%ids.length],q=app.generateQuestion(id,1+(i%5),(0xA5000000+i*97+ids.length)>>>0);
  if(!app.checkQuestion(q.canonicalAnswer,q).correct)fail(`${label} canonical rule`,[id,i]);
  if(q.metadata.typedFacts){
    const derived=o.evaluateRule(id,q.metadata.typedFacts);
    if(derived!==q.metadata.ruleAnswer||q.canonicalAnswer.answer!==derived)fail(`${label} versioned rule derivation`,[id,i]);
  } else if(!q.metadata.replayState) fail(`${label} typed state`,[id,i]);
}

let generated=0;
for(let fi=0;fi<app.families.length;fi++){
  const family=app.families[fi];
  for(let level=1;level<=5;level++){
    const signatures=new Set();
    for(let sample=0;sample<10_000;sample++){
      const seed=((fi+1)*10_000_000+level*100_000+sample+1)>>>0,q=app.generateQuestion(family.id,level,seed);
      if(!app.checkQuestion(q.canonicalAnswer,q).correct)fail("canonical answer",[family.id,level,seed]);
      if(!q.prompt.title||!q.prompt.blocks.length||!q.fields.length)fail("question shape",[family.id,level,seed]);
      if(q.metadata.modelId!==app.modelId||q.metadata.oracleVersion!==app.oracleVersion||q.metadata.fixtureVersion!==app.fixtureVersion)fail("pinned metadata",[family.id,level,seed]);
      if(["caesar","substitution","vigenere"].includes(family.categoryId)||family.id==="xor_repeating_key")if(q.metadata.securityLabel!=="educational-toy-insecure"||!q.prompt.note)fail("toy security label",[family.id,level,seed]);
      signatures.add(q.structuralSignature);generated++;
    }
    if(signatures.size<2)fail("structural variation",[family.id,level]);
  }
}

for(let fi=0;fi<app.families.length;fi++)for(let level=1;level<=5;level++)for(let sample=0;sample<50;sample++){
  const seed=((fi+1)*1_000_000+level*10_000+sample)>>>0,a=app.generateQuestion(app.families[fi].id,level,seed),b=sv.generateQuestion(sv.families[fi].id,level,seed);
  if(JSON.stringify(a.canonicalAnswer)!==JSON.stringify(b.canonicalAnswer)||a.structuralSignature!==b.structuralSignature)fail("English/Swedish semantic parity",[app.families[fi].id,level,seed]);
}
for(const family of sv.families)if(!family.title||!family.learn.concept||!family.learn.example||/[a-z]+_[a-z]+/.test(family.title))fail("Swedish family locale",[family.id]);
if(enLocale.text.messages.toyWarning===svLocale.text.messages.toyWarning)fail("toy warning not translated");

console.log(`practical cryptography validation passed: ${generated.toLocaleString("en-US")} generated questions across 67 families, 100,000 Caesar/affine, 50,000 substitution, 100,000 Vigenere, 250,000 XOR, 50,000 OTP, 100,000 nonce, 150,000 modern rule/state scenarios, exhaustive padding, and bilingual parity checks`);
