import vm from "node:vm";

const assetFiles={arigatou:"arigatou.ogg",gin:"gin.ogg",kokoro:"kokoro.ogg",kuuki:"kuuki.ogg",aruku:"aruku.ogg",eki:"eki-ni-tsukimasu.ogg",koukousei:"koukousei.ogg"};
async function assets(){const out={};for(const [id,file] of Object.entries(assetFiles)){const bytes=await Bun.file(new URL(`./audio/${file}`,import.meta.url)).arrayBuffer();out[id]=`data:audio/ogg;base64,${Buffer.from(bytes).toString("base64")}`;}return out;}
async function load(name,embedded){const locale=(await import(`./locales/${name}.mjs`)).default;const source=(await Bun.file(new URL("./main.js",import.meta.url)).text()).replace("__LOCALE_TEXT__",JSON.stringify(locale.text)).replace("__EMBEDDED_ASSETS__",JSON.stringify(embedded));const context={window:{},document:{addEventListener(){}},console};vm.createContext(context);vm.runInContext(source,context);return{app:context.window.JapaneseLanguageApp,locale};}
function fail(label,details=[]){throw new Error(`${label}: ${details.join(", ")}`);}

const embedded=await assets(),{app,locale:en}=await load("en",embedded),{app:sv,locale:svLocale}=await load("sv",embedded);
if(!app||app.modelId!=="contemporary-standard-japanese-controlled-v1"||!app.oracles)fail("model or oracles missing");
if(app.families.length!==55||new Set(app.families.map(f=>f.id)).size!==55)fail("family registry mismatch");

const refKana=[["あ","ア","a"],["か","カ","ka"],["し","シ","shi"],["つ","ツ","tsu"],["ん","ン","n"],["が","ガ","ga"],["ぱ","パ","pa"],["きゃ","キャ","kya"],["しゅ","シュ","shu"],["ちょ","チョ","cho"]];
for(const [h,k,r] of refKana){if(app.oracles.hira(k)!==h||app.oracles.kata(h)!==k||app.oracles.romanize(h)!==r)fail("independent kana mapping",[h,k,r]);}
const moraFixtures={"さくら":"さ|く|ら","にっぽん":"に|っ|ぽ|ん","きょう":"きょ|う","スーパー":"ス|ー|パ|ー","びょういん":"びょ|う|い|ん"};
for(const [word,want] of Object.entries(moraFixtures))if(app.oracles.morae(word).join("|")!==want)fail("independent mora segmentation",[word]);
const romanization={"きって":"kitte","きょう":"kyou","しんよう":"shin'you","スーパー":"suupaa"};
for(const [word,want] of Object.entries(romanization))if(app.oracles.romanize(word)!==want)fail("romanization landmark",[word,app.oracles.romanize(word),want]);
const verbFixtures={taberu:{masu:"食べます",nai:"食べない",ta:"食べた",te:"食べて",potential:"食べられる",volitional:"食べよう"},kaku:{masu:"書きます",nai:"書かない",ta:"書いた",te:"書いて",potential:"書ける",volitional:"書こう"},yomu:{ta:"読んだ",te:"読んで"},iku:{ta:"行った",te:"行って"},kaeru:{nai:"帰らない",te:"帰って"},suru:{nai:"しない",te:"して",potential:"できる"},kuru:{nai:"来ない",te:"来て",potential:"来られる"},aru:{nai:"ない",ta:"あった"}};
for(const [verb,forms] of Object.entries(verbFixtures))for(const [form,want] of Object.entries(forms))if(app.oracles.verbForm(verb,form)!==want)fail("independent morphology",[verb,form]);
if(app.oracles.adjectives.ii.negative!=="よくない"||app.oracles.adjectives.ii.negativePast!=="よくなかった")fail("いい adjective exception");

for(const [id,url] of Object.entries(embedded)){const bytes=Buffer.from(url.split(",")[1],"base64");if(bytes.subarray(0,4).toString()!=="OggS")fail("Ogg header",[id]);if(bytes.length<4_000)fail("unexpectedly small recording",[id]);}
const audioMeta=app.oracles.audio;if(Object.keys(audioMeta).length!==7)fail("audio metadata count");for(const [id,meta] of Object.entries(audioMeta))if(!meta.transcript||!meta.speaker||!meta.license||!meta.source||meta.url!==embedded[id])fail("audio attribution/embedding",[id]);
if(new Set(Object.values(audioMeta).map(x=>x.speaker)).size<3)fail("speaker diversity");

let generated=0;
for(let fi=0;fi<app.families.length;fi++){
  const family=app.families[fi];
  for(let level=1;level<=5;level++){
    const signatures=new Set();
    for(let sample=0;sample<10_000;sample++){
      const seed=((fi+1)*10_000_000+level*100_000+sample+1)>>>0,q=app.generateQuestion(family.id,level,seed);
      if(!app.checkQuestion(q.canonicalAnswer,q).correct)fail("canonical answer",[family.id,level,seed]);
      if(app.checkQuestion({},q).correct)fail("empty answer accepted",[family.id,level,seed]);
      if(q.metadata.modelId!==app.modelId||q.metadata.dataVersion!==app.dataVersion||q.metadata.oracleVersion!==app.oracleVersion)fail("pinned metadata",[family.id,level,seed]);
      if(!q.prompt.title||!q.fields.length||!q.metadata.structuralSignature||!q.metadata.workedExplanation)fail("question shape",[family.id,level,seed]);
      if(q.prompt.audioId&&!audioMeta[q.prompt.audioId])fail("unknown generated audio",[family.id,q.prompt.audioId]);
      signatures.add(q.structuralSignature);generated++;
    }
    if(signatures.size<2)fail("structural variation",[family.id,level]);
  }
}

for(let fi=0;fi<app.families.length;fi++)for(let level=1;level<=5;level++)for(let sample=0;sample<60;sample++){
  const seed=((fi+1)*1_000_000+level*10_000+sample)>>>0,a=app.generateQuestion(app.families[fi].id,level,seed),b=sv.generateQuestion(sv.families[fi].id,level,seed);
  if(JSON.stringify(a.canonicalAnswer)!==JSON.stringify(b.canonicalAnswer)||a.structuralSignature!==b.structuralSignature||a.fields[0].kind!==b.fields[0].kind)fail("English/Swedish semantic parity",[app.families[fi].id,level,seed]);
}
for(const family of sv.families)if(!family.title||!family.learn.concept||!family.learn.rules||!family.learn.example)fail("Swedish family content",[family.id]);
if(en.text.appTitle===svLocale.text.appTitle||en.text.audio.private===svLocale.text.audio.private)fail("Swedish interface not translated");
for(const category of sv.categories)if(!category.title)fail("Swedish category",[category.id]);

console.log(`Japanese Language validation passed: ${generated.toLocaleString("en-US")} generated questions across 55 families; independent kana, mora, romanization, morphology, Ogg/attribution, speaker-diversity, and bilingual-parity checks`);
