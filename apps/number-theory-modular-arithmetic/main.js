(function () {
  "use strict";

  var TEXT = __LOCALE_TEXT__;
  var STORAGE_KEY = "practiceLab.numberTheoryModularArithmetic.v1";
  var ORACLE_VERSION = "number-theory-exact-v1";
  var LEVELS = [1, 2, 3, 4, 5];
  var currentQuestion = null, currentStartedAt = 0, pauseStartedAt = 0, pausedMs = 0;
  var submitted = false, isPaused = false, progress = null, rng = null, selectorController = null;
  var keypadButtons = null, activeAnswerInput = null, recentSignatures = [], learnSpotlightId = null;
  var generatedTranslationPairs = null;

  function t(path, fallback) {
    var value = path.split(".").reduce(function (current, part) { return current && Object.prototype.hasOwnProperty.call(current, part) ? current[part] : undefined; }, TEXT);
    return value === undefined ? fallback : value;
  }
  function translateGenerated(value) {
    if(TEXT.localeCode==="en"||value===null||value===undefined)return String(value||"");
    if(generatedTranslationPairs===null)generatedTranslationPairs=t("generatedReplacements",[]).slice().sort(function(a,b){return b[0].length-a[0].length;});
    var output=String(value);generatedTranslationPairs.forEach(function(pair){output=output.split(pair[0]).join(pair[1]);});return output;
  }

  function Rng(seed) { this.state = (Number(seed) >>> 0) || 0x9E3779B9; }
  Rng.prototype.next = function () { var x = this.state; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; this.state = x >>> 0; return this.state; };
  Rng.prototype.int = function (min, max) { return min + (this.next() % (max - min + 1)); };
  Rng.prototype.pick = function (values) { return values[this.int(0, values.length - 1)]; };
  Rng.prototype.bool = function () { return Boolean(this.next() & 1); };

  function abs(a) { return a < 0n ? -a : a; }
  function mod(a, m) { if (m <= 0n) throw new RangeError("modulus must be positive"); var r = a % m; return r < 0n ? r + m : r; }
  function divmod(a, m) { var r = mod(a, m); return { q: (a - r) / m, r: r }; }
  function gcd(a, b) { a = abs(a); b = abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function lcm(a, b) { return a === 0n || b === 0n ? 0n : abs((a / gcd(a, b)) * b); }
  function egcd(a, b) {
    var sa = a < 0n ? -1n : 1n, sb = b < 0n ? -1n : 1n, oldR = abs(a), r = abs(b), oldS = 1n, s = 0n, oldT = 0n, tt = 1n;
    while (r) { var q = oldR / r, nr = oldR - q * r, ns = oldS - q * s, nt = oldT - q * tt; oldR = r; r = nr; oldS = s; s = ns; oldT = tt; tt = nt; }
    return { g: oldR, x: oldS * sa, y: oldT * sb };
  }
  function inverse(a, m) { var e = egcd(a, m); return e.g === 1n ? mod(e.x, m) : null; }
  function powmod(base, exponent, modulus) { var a = mod(base, modulus), e = BigInt(exponent), out = 1n; if (e < 0n) throw new RangeError("negative exponent"); while (e) { if (e & 1n) out = mod(out * a, modulus); a = mod(a * a, modulus); e >>= 1n; } return out; }
  function isPrime(n) { if (n < 2n) return false; if (n % 2n === 0n) return n === 2n; for (var d = 3n; d * d <= n; d += 2n) if (n % d === 0n) return false; return true; }
  function primesThrough(n) { var out = []; for (var p = 2n; p <= n; p += 1n) if (isPrime(p)) out.push(p); return out; }
  function factorize(n) { var value = abs(n), out = []; for (var p = 2n; p * p <= value; p += p === 2n ? 1n : 2n) { if (value % p) continue; var e = 0n; while (value % p === 0n) { value /= p; e += 1n; } out.push([p, e]); } if (value > 1n) out.push([value, 1n]); return out; }
  function factorText(factors) { return factors.map(function (pair) { return String(pair[0]) + (pair[1] === 1n ? "" : "^" + pair[1]); }).join(" * "); }
  function divisors(n) { var ds = [1n]; factorize(n).forEach(function (pair) { var prior = ds.slice(), power = 1n; for (var e = 1n; e <= pair[1]; e += 1n) { power *= pair[0]; prior.forEach(function (d) { ds.push(d * power); }); } }); return ds.sort(compareBig); }
  function compareBig(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
  function tau(n) { return factorize(n).reduce(function (out, pair) { return out * (pair[1] + 1n); }, 1n); }
  function sigma(n) { return factorize(n).reduce(function (out, pair) { var sum = 1n, p = 1n; for (var e = 0n; e < pair[1]; e += 1n) { p *= pair[0]; sum += p; } return out * sum; }, 1n); }
  function valuation(n, p) { var value = abs(n), e = 0n; if (!value) throw new RangeError("v_p(0) undefined"); while (value % p === 0n) { value /= p; e += 1n; } return e; }
  function phi(n) { var out = n; factorize(n).forEach(function (pair) { out = (out / pair[0]) * (pair[0] - 1n); }); return out; }
  function order(a, m) { if (gcd(a, m) !== 1n) return null; var value = 1n; for (var k = 1n; k <= phi(m); k += 1n) { value = mod(value * a, m); if (value === 1n) return k; } return null; }
  function solveLinear(a, b, n) { var d = gcd(a, n); if (b % d !== 0n) return []; var reduced = n / d, first = mod((b / d) * inverse(a / d, reduced), reduced), out = []; for (var k = 0n; k < d; k += 1n) out.push(first + k * reduced); return out.sort(compareBig); }
  function crtMerge(a, m, b, n) { var d = gcd(m, n), delta = b - a; if (delta % d) return null; var m1 = m / d, n1 = n / d, k = mod((delta / d) * inverse(m1, n1), n1), M = lcm(m, n); return { r: mod(a + m * k, M), m: M }; }
  function euclidTrace(a, b) { var x = abs(a), y = abs(b), out = []; if (x < y) { var swap = x; x = y; y = swap; } while (y) { var q = x / y, r = x % y; out.push({ a: x, q: q, b: y, r: r }); x = y; y = r; } return out; }
  function enumeratePairs(a, b, c, nonnegative) { var out = [], bound = Number(abs(c) + abs(a) + abs(b) + 10n); for (var x = nonnegative ? 0 : -bound; x <= bound; x += 1) for (var y = nonnegative ? 0 : -bound; y <= bound; y += 1) if (a * BigInt(x) + b * BigInt(y) === c) out.push([BigInt(x), BigInt(y)]); return out; }

  var CATEGORIES = [
    { id: "divisibility", title: "Divisibility & Remainders" }, { id: "primes", title: "Primes & Factorization" },
    { id: "gcd-euclid", title: "GCD, LCM & Euclid" }, { id: "congruences", title: "Congruences & Modular Arithmetic" },
    { id: "powers", title: "Modular Powers & Theorems" }, { id: "inverses", title: "Inverses & Linear Congruences" },
    { id: "crt", title: "Chinese Remainder Systems" }, { id: "diophantine", title: "Diophantine Equations" },
    { id: "applications", title: "Residue Patterns & Toy Applications" }
  ];

  var FAMILY_ROWS = [
    ["divisibility_decision","divisibility","Divisibility decision","a divides b exactly when b=ak for an integer k.","6 divides 42 because 42=6·7."],
    ["factor_multiple_list","divisibility","Factors and multiples","Positive divisors occur in factor pairs; multiples are integer products.","Divisors of 12: {1,2,3,4,6,12}."],
    ["euclidean_quotient_remainder","divisibility","Euclidean quotient and remainder","For m>0, a=qm+r with 0≤r<m, including negative a.","−17=(−4)·5+3."],
    ["missing_division_component","divisibility","Missing division component","Rearrange a=qm+r, then verify the remainder range.","53=5m+3 gives m=10."],
    ["divisibility_rule_apply","divisibility","Apply a divisibility rule","Digit rules are shortcuts justified by powers of ten modulo the divisor.","7317 has digit sum 18, so 9 divides it."],
    ["missing_digit_divisibility","divisibility","Missing digit for divisibility","Enumerate legal digits and test every completed numeral exactly.","37x divisible by 5 gives x∈{0,5}."],
    ["divisibility_property","divisibility","Divisibility properties","Common divisors divide integer linear combinations; invalid converses need a counterexample.","d|a and d|b imply d|(a+b)."],
    ["prime_composite_classify","primes","Prime or composite","A prime is positive, greater than 1, and has exactly two positive divisors.","1 is neither prime nor composite."],
    ["trial_division_bound","primes","Trial-division bound","To test n, check only primes p≤√n.","For 97 check 2,3,5,7."],
    ["sieve_trace","primes","Sieve of Eratosthenes","Cross composite multiples; starting at p² avoids repeated work.","Primes through 10 are {2,3,5,7}."],
    ["prime_factorization","primes","Prime factorization","Repeated exact division yields a unique increasing prime-power product.","60=2^2·3·5."],
    ["valuation_exponent","primes","Prime valuation","v_p(n) counts how many times p divides |n|.","v_2(40)=3."],
    ["divisor_count_sum","primes","Divisor count and sum","For n=∏p^e, τ multiplies e+1 and σ multiplies finite geometric sums.","12=2²·3 has τ=6."],
    ["perfect_power_squarefree","primes","Perfect powers and squarefree numbers","A kth power has every prime exponent divisible by k; squarefree exponents are at most 1.","30=2·3·5 is squarefree."],
    ["gcd_factor_method","gcd-euclid","GCD from factors","GCD takes minimum prime exponents and is nonnegative.","gcd(18,24)=6."],
    ["lcm_factor_method","gcd-euclid","LCM from factors","LCM takes maximum exponents; for nonzero inputs gcd·lcm=|ab|.","lcm(6,8)=24."],
    ["coprime_decision","gcd-euclid","Coprimality","Two integers are coprime exactly when their GCD is 1.","8 and 15 are coprime."],
    ["euclidean_algorithm_trace","gcd-euclid","Euclidean algorithm trace","Repeat canonical division; the last nonzero remainder is the GCD.","48,18 gives remainders 12,6,0."],
    ["euclidean_missing_step","gcd-euclid","Missing Euclidean step","Every trace row must reconstruct its dividend with a canonical remainder.","43=5·8+3."],
    ["extended_euclid_bezout","gcd-euclid","Extended Euclid and Bézout","Extended Euclid constructs x,y with ax+by=gcd(a,b).", "35(−1)+12(3)=1."],
    ["bezout_possible_values","gcd-euclid","Possible Bézout values","ax+by represents exactly the multiples of gcd(a,b).","6x+9y cannot equal 4."],
    ["canonical_residue","congruences","Canonical residue","Normalize modulo m to the unique representative 0 through m−1.","−23 mod 7=5."],
    ["congruence_decision","congruences","Congruence decision","a≡b mod m exactly when m divides a−b.","−3≡4 (mod 7)."],
    ["equivalent_representatives","congruences","Equivalent representatives","A residue class consists of r+km for every integer k.","2 mod 5 includes −3 and 7."],
    ["modular_add_subtract_multiply","congruences","Modular arithmetic","Reduce before or after addition, subtraction, and multiplication.","(8+9) mod 7=3."],
    ["modular_polynomial_substitution","congruences","Polynomial substitution modulo m","Substitute a representative and Horner-evaluate with reduction.","x≡3 mod7 gives x+5≡1."],
    ["modular_cancellation","congruences","Safe modular cancellation","Cancelling c preserves modulus only when gcd(c,m)=1; generally reduce modulus by that GCD.","6a≡6b mod15 implies a≡b mod5."],
    ["modular_expression_equivalence","congruences","Modular expression equivalence","A universal claim needs an identity or a check of every displayed residue.","x²≡x mod5 fails at x=2."],
    ["small_modular_power","powers","Small modular powers","Multiply with reduction after every step.","3^4 mod5=1."],
    ["repeated_squaring_trace","powers","Repeated squaring","Square residues for powers 1,2,4,… and multiply the set-bit entries.","13=8+4+1."],
    ["power_cycle","powers","Power cycles","Iterate residues until a state repeats; nonunits may have a preperiod.","2 mod5 cycles 2,4,3,1."],
    ["euler_totient","powers","Euler's totient","φ(n) counts unit residues and equals n∏(1−1/p).","φ(12)=4."],
    ["fermat_little_theorem","powers","Fermat's little theorem","For prime p and p∤a, reduce exponents modulo p−1.","2^100 mod7=2."],
    ["euler_theorem","powers","Euler's theorem","If gcd(a,m)=1 then a^φ(m)≡1 modm.","3^100 mod10=1."],
    ["multiplicative_order","powers","Multiplicative order","For a unit, the order is the least positive k with a^k≡1.","ord_7(2)=3."],
    ["theorem_selection_hypotheses","powers","Choose a justified theorem","Check primality and coprimality before selecting a reduction theorem.","6^100 mod15 needs a direct cycle."],
    ["unit_inverse_existence","inverses","Inverse existence","a is invertible modulo m exactly when gcd(a,m)=1.","6 has no inverse mod15."],
    ["modular_inverse_search","inverses","Search for a modular inverse","Find x with ax≡1, after checking that an inverse exists.","3^−1 mod7=5."],
    ["inverse_extended_euclid","inverses","Inverse by extended Euclid","In ax+my=1, normalize x modulo m.","17(−5)+43(2)=1 gives inverse 38."],
    ["modular_division","inverses","Modular division","a/b means a·b^−1 and is defined only for a unit denominator.","4/3 mod7=6."],
    ["linear_congruence_coprime","inverses","Coprime linear congruence","Multiply ax≡b by a^−1 when gcd(a,n)=1.","3x≡1 mod7 gives x≡5."],
    ["linear_congruence_general","inverses","General linear congruence","With d=gcd(a,n), solutions exist iff d|b and then there are d classes.","2x≡4 mod6 gives {2,5}."],
    ["linear_congruence_solution_count","inverses","Linear-congruence solution count","The count is gcd(a,n) when it divides b, otherwise zero.","6x≡12 mod18 has 6 solutions."],
    ["inverse_linear_congruence","inverses","Construct a linear congruence","Build the missing term from a target residue, then verify the complete solution set.","3·4≡5 mod7."],
    ["crt_coprime_two","crt","CRT with two coprime moduli","Merge by substitution; the combined modulus is the product.","x≡1 mod3, x≡2 mod5 gives x≡7 mod15."],
    ["crt_coprime_three","crt","CRT with three coprime moduli","Merge two classes, then merge the result with the third.","0 mod2,1 mod3,4 mod5 gives 4 mod30."],
    ["crt_general_consistency","crt","General CRT consistency","Residues must agree modulo the GCD of their moduli.","1 mod4 and 2 mod6 are inconsistent."],
    ["crt_general_solve","crt","General CRT solution","A compatible system repeats modulo the LCM, not always the product.","1 mod4 and 3 mod6 gives 9 mod12."],
    ["crt_missing_residue","crt","Missing CRT residue","Reduce the combined representative modulo the component modulus.","23 mod105 is 3 mod5."],
    ["crt_application_schedule","crt","Repeating schedules","Translate offsets to congruences, merge, then honor any lower bound.","1 mod3 and 2 mod5 first align at 7."],
    ["diophantine_solvability","diophantine","Diophantine solvability","ax+by=c has integer solutions exactly when gcd(a,b)|c.","6x+9y=10 has no integer solution."],
    ["find_one_diophantine_solution","diophantine","One Diophantine solution","Scale a Bézout pair by c/gcd(a,b).","4x+6y=10 has (1,1)."],
    ["parameterize_diophantine","diophantine","Parameterize all solutions","From (x0,y0), add t(b/d,−a/d) for every integer t.","2x+3y=7: x=2+3t,y=1−2t."],
    ["bounded_diophantine_solutions","diophantine","Bounded Diophantine solutions","Intersect the parameter range with every stated integer bound.","3x+5y=30 has three nonnegative pairs."],
    ["coin_linear_combination","diophantine","Coin and pack combinations","Count pairs of item counts, not orderings of individual items.","2x+5y=9 has one nonnegative pair."],
    ["diophantine_missing_parameter","diophantine","Missing parameter","Solve one coordinate formula for t, then verify the other coordinate.","x=2+3t and x=11 gives t=3."],
    ["diophantine_congruence_link","diophantine","Congruence–equation link","ax≡b modn iff ax−ny=b for some integer y.","3x≡1 mod7 iff 3x−7y=1."],
    ["clock_arithmetic","applications","Clock arithmetic","Map labels to residues, move, normalize, and map back.","9+5 hours on a 12-hour clock is 2."],
    ["last_digit_digits","applications","Last decimal digits","The last k digits are the residue modulo 10^k, padded when necessary.","The last two digits of 3^10 are 49."],
    ["check_digit_compute","applications","Check-digit computation","Apply the displayed weights and solve the resulting small congruence.","1+2+3+c≡0 mod10 gives c=4."],
    ["checksum_error_detection","applications","Checksum error detection","A guarantee requires the checksum difference to be nonzero for every allowed error.","A digit sum does not detect transpositions."],
    ["affine_cipher_toy","applications","Toy affine cipher","Encode ax+b; decode with a^−1(y−b). The multiplier must be a unit.","With a=5,b=8, A maps to I."],
    ["rsa_toy_key_math","applications","Toy RSA key arithmetic","For supplied tiny primes, n=pq, φ=(p−1)(q−1), and d=e^−1 modφ.","p=5,q=11 gives n=55,φ=40."],
    ["rsa_toy_transform","applications","Toy RSA transform","Use repeated squaring for m^e modn. Tiny examples are educational and insecure.","2^3 mod55=8."],
    ["quadratic_residue_intro","applications","Introductory quadratic residues","For bounded m, enumerate every x and deduplicate x² modm.","x²≡1 mod8 has roots 1,3,5,7."]
  ];

  var FAMILIES = FAMILY_ROWS.map(function (row) { return { id: row[0], categoryId: row[1], title: row[2], levels: LEVELS.slice(), learn: { concept: row[2] + ".", rules: row[3], example: row[4] } }; });
  function localizeStaticData(){CATEGORIES.forEach(function(category){var localized=t("categories."+category.id,null);if(localized)category.title=localized;});FAMILIES.forEach(function(family){var localized=t("families."+family.id,null);if(!localized)return;family.title=localized.title||family.title;family.learn.concept=localized.concept||family.title+".";family.learn.rules=localized.rules||translateGenerated(family.learn.rules);family.learn.example=localized.example||translateGenerated(family.learn.example);});}
  localizeStaticData();
  function categoryById(id) { return CATEGORIES.find(function (item) { return item.id === id; }) || CATEGORIES[0]; }
  function familyById(id) { return FAMILIES.find(function (item) { return item.id === id; }) || FAMILIES[0]; }
  function bi(value) { return BigInt(value); }
  function choosePrime(r, level) { return bi(r.pick(level < 3 ? [2,3,5,7,11,13] : [3,5,7,11,13,17,19,23,29,31])); }
  function smallModulus(r, level) { return bi(r.int(3, 8 + level * 5)); }
  function integerField(id, label, answer, kind) { return { id: id, label: label, kind: kind || "integer", answer: String(answer) }; }
  function choiceField(id, label, answer, values) { return { id: id, label: label, kind: "choice", answer: String(answer), options: values.map(function (value) { return { value: String(value[0]), label: String(value[1]) }; }) }; }
  function yesNo(id, answer) { return choiceField(id, t("fieldLabels.decision","Decision"), answer ? "yes" : "no", [["yes",t("choices.yes","Yes")],["no",t("choices.no","No")]]); }
  function setField(id, answer, kind) { return integerField(id, t("fieldLabels.values","Values"), answer.length ? answer.map(String).join(", ") : "{}", kind || "set"); }
  function formatSet(values) { return "{" + values.map(String).join(", ") + "}"; }
  function prompt(title, rows, note) { return { title: title, rows: rows || [], note: note || "" }; }

  function question(familyId, level, promptData, fields, explanation, signature, meta) {
    var family = familyById(familyId), canonical = {};
    fields.forEach(function (field) { canonical[field.id] = field.answer; });
    meta = meta || {};
    var item={
      oracleVersion: ORACLE_VERSION, categoryId: family.categoryId, subcategoryId: family.categoryId, familyId: familyId, level: level,
      integersExact: (meta.integers || []).map(String), modulus: meta.modulus === undefined ? null : String(meta.modulus), factorizations: meta.factorizations || [],
      euclideanTrace: meta.euclideanTrace || [], bezoutCertificate: meta.bezoutCertificate || null, congruenceSystem: meta.congruenceSystem || null,
      solutionSet: meta.solutionSet || null, theoremHypotheses: meta.theoremHypotheses || {}, canonicalAnswer: canonical,
      acceptedAnswerClass: meta.acceptedAnswerClass || fields.map(function (field) { return field.kind; }).join("+"),
      difficultyDimensions: ["level-" + level, meta.dimension || family.categoryId], misconceptionsTargeted: meta.misconceptions || [],
      distractorProvenance: meta.distractors || [], workedSolution: explanation, structuralSignature: familyId + ":" + level + ":" + signature,
      prompt: promptData, fields: fields, explanation: explanation, validator: meta.validator || null, expectedText: meta.expectedText || null
    };
    if(TEXT.localeCode!=="en"){item.prompt={title:translateGenerated(item.prompt.title),rows:item.prompt.rows.map(translateGenerated),note:translateGenerated(item.prompt.note)};item.explanation=translateGenerated(item.explanation);item.workedSolution=item.explanation;item.fields.forEach(function(field){field.label=translateGenerated(field.label);if(field.options)field.options.forEach(function(option){option.label=translateGenerated(option.label);});});}
    return item;
  }

  var GENERATORS = {};

  function generateFamily(id, level, r) {
    var a, b, c, d, m, n, q, rem, value, values, result, e, factors, trace, options, expected, merged, x0, y0;
    var scale = 8 + level * 7;
    switch (id) {
    case "divisibility_decision":
      a = level >= 4 && r.int(0,7) === 0 ? 0n : bi(r.int(2,scale)) * (r.bool() && level > 1 ? -1n : 1n);
      q = bi(level===1?r.int(1,scale):r.int(-scale,scale)); b = a * q; if (r.bool() && a !== 0n) b += bi(level===1?1:r.pick([1,-1]));
      if (a === 0n) b = r.bool() ? 0n : bi(r.int(1,scale));
      result = a === 0n ? b === 0n : b % a === 0n;
      return question(id,level,prompt("Decide the divisibility statement.",[a+" divides "+b],"Use the existential definition, including the zero case."),[yesNo("decision",result)],result ? b+"="+a+"·"+(a===0n?0n:b/a)+"." : "No integer k makes "+b+"="+a+"k.",[a,b,result],{integers:[a,b],acceptedAnswerClass:"yes/no",misconceptions:["reversed divisibility","zero divisor"]});
    case "factor_multiple_list":
      a = choosePrime(r,level); b = choosePrime(r,level); e = bi(r.int(1,Math.min(3,level+1))); n = a ** e * b;
      values = divisors(n);
      return question(id,level,prompt("List every positive divisor.",["n = "+n, "prime structure: "+factorText(factorize(n))],"Enter an unordered comma-separated set."),[setField("values",values)],"Pair and combine the prime-power choices: "+formatSet(values)+".",[n,a,b],{integers:[n],factorizations:[factorText(factorize(n))],solutionSet:values.map(String),acceptedAnswerClass:"unordered integer set"});
    case "euclidean_quotient_remainder":
      m = bi(r.int(2,scale)); q = bi(r.int(1,scale)) * (level >= 3 && r.bool() ? -1n : 1n); rem = bi(r.int(0,Number(m-1n))); a = q*m+rem;
      return question(id,level,prompt("Write the Euclidean division identity.",[a+" = q·"+m+" + r"],"Require 0 ≤ r < "+m+"."),[integerField("q",t("fieldLabels.quotient","Quotient q"),q),integerField("r",t("fieldLabels.remainder","Remainder r"),rem)],a+"="+q+"·"+m+"+"+rem+", and the remainder is canonical.",[a,m,q,rem],{integers:[a,m],modulus:m,euclideanTrace:[{a:String(a),q:String(q),b:String(m),r:String(rem)}],acceptedAnswerClass:"named integer pair"});
    case "missing_division_component":
      m = bi(r.int(3,scale)); q = bi(r.int(2,scale)); rem = bi(r.int(0,Number(m-1n))); a=q*m+rem; c=r.int(0,2);
      if(c===0){value=a;options=["? = "+q+"·"+m+" + "+rem];}else if(c===1){value=q;options=[a+" = ?·"+m+" + "+rem];}else{value=m;options=[a+" = "+q+"·? + "+rem];}
      return question(id,level,prompt("Recover the missing division component.",options,"The divisor is positive and the shown remainder is canonical."),[integerField("answer",t("fieldLabels.answer","Answer"),value)],"Substitution gives "+a+"="+q+"·"+m+"+"+rem+".",[c,a,m,q,rem],{integers:[a,m,q,rem],acceptedAnswerClass:"exact integer"});
    case "divisibility_rule_apply":
      d=bi(r.pick(level===1?[2,5,10]:level===2?[3,4,8,9]:[2,3,4,5,8,9,10,11])); n=bi(r.int(100,9999+level*9000)); if(r.bool()) n-=mod(n,d); result=n%d===0n;
      return question(id,level,prompt("Apply a base-10 divisibility rule.",["Is "+n+" divisible by "+d+"?"],"Decide without relying on rounded division."),[yesNo("decision",result)],"Direct verification: "+n+" mod "+d+" = "+mod(n,d)+".",[n,d,result],{integers:[n,d],modulus:d,theoremHypotheses:{base:"10",divisor:String(d)},acceptedAnswerClass:"yes/no"});
    case "missing_digit_divisibility":
      d=bi(r.pick(level<3?[3,5,9]:[4,8,9,11])); a=bi(r.int(1,9)); b=bi(r.int(0,9)); values=[];
      for(c=0n;c<=9n;c+=1n){n=100n*a+10n*c+b;if(n%d===0n)values.push(c);}
      return question(id,level,prompt("Find every digit x that works.",[a+"x"+b+" is divisible by "+d],"x is one decimal digit; enter all solutions as a set."),[setField("values",values)],"Testing digits 0 through 9 gives "+formatSet(values)+".",[a,b,d],{integers:[a,b,d],modulus:d,solutionSet:values.map(String),acceptedAnswerClass:"unordered digit set"});
    case "divisibility_property":
      options=[["sum","d divides a+b"],["reverse","a divides d"],["factor","d divides a and b separately"]];
      return question(id,level,prompt("Choose the conclusion that must follow.",["Given d divides a and d divides b"],level>=4?"The other claims require counterexamples, not pattern matching.":"Use an integer linear combination."),[choiceField("decision",t("fieldLabels.decision","Decision"),"sum",options)],"Write a=dk and b=dℓ. Then a+b=d(k+ℓ).",[r.int(0,999)],{acceptedAnswerClass:"controlled theorem choice",theoremHypotheses:{facts:["d|a","d|b"]},distractors:["reversed divisibility","product-factor fallacy"]});

    case "prime_composite_classify":
      c=r.int(0,level>=3?4:2); if(c===0)n=choosePrime(r,level);else if(c===1){a=choosePrime(r,level);b=choosePrime(r,level);n=a*b;}else n=bi(r.pick([0,1,-1,-2,-7]));
      result=isPrime(n)?"prime":n>1n?"composite":"neither";
      return question(id,level,prompt("Classify the integer.",[String(n)],"Prime means positive and greater than 1."),[choiceField("decision",t("fieldLabels.decision","Decision"),result,[["prime",t("choices.prime","Prime")],["composite",t("choices.composite","Composite")],["neither",t("choices.neither","Neither")]])],result==="composite"?n+" has factorization "+factorText(factorize(n))+".":n+" is "+result+" by the stated definition.",[n,c],{integers:[n],factorizations:n>1n?[factorText(factorize(n))]:[],acceptedAnswerClass:"classification"});
    case "trial_division_bound":
      n=bi(r.int(20,80+level*70)); values=[]; for(a=2n;a*a<=n;a+=1n)if(isPrime(a))values.push(a);
      return question(id,level,prompt("Which prime divisors must be checked in a complete trial-division test?",["n = "+n],"Include every prime p with p² ≤ n."),[setField("values",values)],"floor(√"+n+") bounds the checks: "+formatSet(values)+".",[n],{integers:[n],solutionSet:values.map(String),acceptedAnswerClass:"unordered prime set"});
    case "sieve_trace":
      n=bi(r.int(15,30+level*8)); values=primesThrough(n);
      return question(id,level,prompt("Complete the sieve.",["List every prime in 2.."+n],"Composite multiples are crossed; primes remain."),[setField("values",values)],"The surviving values are "+formatSet(values)+".",[n],{integers:[n],solutionSet:values.map(String),acceptedAnswerClass:"unordered prime set"});
    case "prime_factorization":
      factors=[]; values=[2n,3n,5n,7n,11n]; c=r.int(2,Math.min(4,level+2)); n=1n;
      for(q=0n;q<bi(c);q+=1n){a=values[Number(q)];e=bi(r.int(1,Math.min(3,level+1)));factors.push([a,e]);n*=a**e;}
      return question(id,level,prompt("Write n as a product of prime powers.",["n = "+n],"Accepted syntax: 2^2 * 3 * 5. Order does not matter."),[integerField("factorization",t("fieldLabels.factorization","Prime factorization"),factorText(factors),"factorization")],"Repeated prime division gives "+factorText(factors)+".",[n,factorText(factors)],{integers:[n],factorizations:[factorText(factors)],acceptedAnswerClass:"equivalent prime factorization"});
    case "valuation_exponent":
      a=choosePrime(r,level);e=bi(r.int(1,2+level));b=choosePrime(r,level);while(b===a)b=choosePrime(r,level);n=a**e*b**bi(r.int(1,2));
      return question(id,level,prompt("Find the prime valuation.",["v_"+a+"("+n+")"],"Return the exponent, not the prime power."),[integerField("answer",t("fieldLabels.answer","Answer"),valuation(n,a))],a+" divides "+n+" exactly "+e+" times before the quotient is no longer divisible by "+a+".",[a,n,e],{integers:[a,n],factorizations:[factorText(factorize(n))],acceptedAnswerClass:"nonnegative integer"});
    case "divisor_count_sum":
      a=choosePrime(r,level);b=choosePrime(r,level);while(b===a)b=choosePrime(r,level);n=a**bi(r.int(1,3))*b**bi(r.int(1,2));c=r.bool()?0:1;result=c===0?tau(n):sigma(n);
      return question(id,level,prompt(c===0?"Compute the number of positive divisors τ(n).":"Compute the sum of positive divisors σ(n).",["n = "+n+" = "+factorText(factorize(n))],"Use independent exponent choices."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],(c===0?"τ":"σ")+"("+n+") = "+result+".",[n,c],{integers:[n],factorizations:[factorText(factorize(n))],acceptedAnswerClass:"exact integer"});
    case "perfect_power_squarefree":
      c=r.int(0,3);if(c===0){n=2n**bi(2*r.int(1,2))*3n**2n;result="square";}else if(c===1){n=2n**bi(3*r.int(1,2))*5n**3n;result="cube";}else if(c===2){n=2n*3n*bi(r.pick([5,7,11]));result="squarefree";}else{n=2n**2n*3n;result="other";}
      return question(id,level,prompt("Classify from the prime exponents.",[n+" = "+factorText(factorize(n))],"Choose the most specific displayed property generated for this item."),[choiceField("decision",t("fieldLabels.decision","Decision"),result,[["square",t("choices.square","Perfect square")],["cube",t("choices.cube","Perfect cube")],["squarefree",t("choices.squarefree","Squarefree")],["other",t("choices.other","None")]])],"Inspecting the exponent vector gives: "+result+".",[n,c],{integers:[n],factorizations:[factorText(factorize(n))],acceptedAnswerClass:"classification"});

    case "gcd_factor_method":
      a=bi(level>=3?r.int(0,scale*4):r.int(1,scale*4));b=bi(r.int(1,scale*4));if(level>=3&&r.bool())a=-a;result=gcd(a,b);
      return question(id,level,prompt("Find the greatest common divisor.",["gcd("+a+", "+b+")"],"The answer is nonnegative."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],"Euclid/factor minima give gcd="+result+".",[a,b],{integers:[a,b],factorizations:[factorText(factorize(a)),factorText(factorize(b))],acceptedAnswerClass:"nonnegative integer"});
    case "lcm_factor_method":
      a=bi(level>=3?r.int(0,scale*2):r.int(1,scale*2));b=bi(r.int(1,scale*2));result=lcm(a,b);
      return question(id,level,prompt("Find the least common multiple.",["lcm("+a+", "+b+")"],"This app defines lcm(a,0)=0."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],a===0n?"One input is zero, so the LCM is 0.":"|ab|/gcd(a,b) = "+result+".",[a,b],{integers:[a,b],acceptedAnswerClass:"nonnegative integer"});
    case "coprime_decision":
      a=bi(r.int(2,scale*3));b=bi(r.int(2,scale*3));result=gcd(a,b)===1n;
      return question(id,level,prompt("Are these integers coprime?",[a+" and "+b],"Composite numbers can still be coprime."),[yesNo("decision",result)],"gcd("+a+","+b+")="+gcd(a,b)+".",[a,b],{integers:[a,b],acceptedAnswerClass:"yes/no"});
    case "euclidean_algorithm_trace":
      a=bi(r.int(scale,scale*10));b=bi(r.int(2,scale-1));trace=euclidTrace(a,b);result=gcd(a,b);
      return question(id,level,prompt("Use the displayed Euclidean trace to report the GCD.",trace.map(function(row){return row.a+" = "+row.q+"·"+row.b+" + "+row.r;}),"The GCD is the last nonzero remainder, not zero."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],"The last nonzero remainder is "+result+".",[a,b,trace.length],{integers:[a,b],euclideanTrace:trace.map(function(row){return {a:String(row.a),q:String(row.q),b:String(row.b),r:String(row.r)};}),acceptedAnswerClass:"nonnegative integer"});
    case "euclidean_missing_step":
      b=bi(r.int(3,scale));q=bi(r.int(1,scale));rem=bi(r.int(0,Number(b-1n)));a=q*b+rem;c=r.int(0,1);
      return question(id,level,prompt("Fill the missing Euclidean value.",[c===0?a+" = "+q+"·"+b+" + ?":a+" = ?·"+b+" + "+rem],"The remainder must lie in the canonical range."),[integerField("answer",t("fieldLabels.answer","Answer"),c===0?rem:q)],"The complete row is "+a+"="+q+"·"+b+"+"+rem+".",[a,b,q,rem,c],{integers:[a,b,q,rem],euclideanTrace:[{a:String(a),q:String(q),b:String(b),r:String(rem)}],acceptedAnswerClass:"exact integer"});
    case "extended_euclid_bezout":
      a=bi(r.int(5,scale*3));b=bi(r.int(3,scale*2));if(level>=4&&r.bool())a=-a;result=egcd(a,b);
      return question(id,level,prompt("Find any valid Bézout coefficients.",[a+"x + "+b+"y = gcd("+a+","+b+") = "+result.g],"Alternate coefficient pairs are accepted by substitution."),[integerField("x",t("fieldLabels.x","x"),result.x),integerField("y",t("fieldLabels.y","y"),result.y)],a+"("+result.x+")+"+b+"("+result.y+")="+result.g+".",[a,b],{integers:[a,b],bezoutCertificate:{x:String(result.x),y:String(result.y),g:String(result.g)},acceptedAnswerClass:"any Bézout certificate",validator:{type:"linear-certificate",a:String(a),b:String(b),c:String(result.g)}});
    case "bezout_possible_values":
      a=bi(r.int(3,scale));b=bi(r.int(3,scale));d=gcd(a,b);c=bi(r.int(1,scale));if(r.bool())c*=d;result=c%d===0n;
      return question(id,level,prompt("Can the target be represented?",[a+"x + "+b+"y = "+c],"x and y may be any integers."),[yesNo("decision",result)],"Representable values are exactly the multiples of gcd("+a+","+b+")="+d+".",[a,b,c],{integers:[a,b,c],acceptedAnswerClass:"yes/no"});

    case "canonical_residue":
      m=smallModulus(r,level);a=bi(r.int(0,scale*20));if(level>=2&&r.bool())a=-a;result=mod(a,m);
      return question(id,level,prompt("Find the canonical residue.",[a+" mod "+m],"Return the unique value in 0.."+(m-1n)+"."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],a+"="+divmod(a,m).q+"·"+m+"+"+result+".",[a,m],{integers:[a,m],modulus:m,acceptedAnswerClass:"canonical residue"});
    case "congruence_decision":
      m=smallModulus(r,level);a=bi(level===1?r.int(0,scale*5):r.int(-scale*5,scale*5));q=bi(level===1?r.int(0,5):r.int(-5,5));b=a+q*m;if(r.bool())b+=1n;result=mod(a-b,m)===0n;
      return question(id,level,prompt("Decide the congruence.",[a+" ≡ "+b+" (mod "+m+")"],"Test whether the difference is divisible by the modulus."),[yesNo("decision",result)],a+"−("+b+")="+(a-b)+", whose residue modulo "+m+" is "+mod(a-b,m)+".",[a,b,m],{integers:[a,b,m],modulus:m,acceptedAnswerClass:"yes/no"});
    case "equivalent_representatives":
      m=smallModulus(r,level);a=bi(r.int(0,Number(m-1n)));b=-m*bi(r.int(1,3));c=m*bi(r.int(2,5));values=[];for(q=b;q<=c;q+=1n)if(mod(q,m)===a)values.push(q);
      return question(id,level,prompt("List every representative in the interval.",["x ≡ "+a+" (mod "+m+")",b+" ≤ x ≤ "+c],"Enter an unordered integer set."),[setField("values",values)],"Values differ from "+a+" by integer multiples of "+m+": "+formatSet(values)+".",[a,m,b,c],{integers:[a,m,b,c],modulus:m,solutionSet:values.map(String),acceptedAnswerClass:"unordered residue set"});
    case "modular_add_subtract_multiply":
      m=smallModulus(r,level);a=bi(level===1?r.int(0,scale*3):r.int(-scale*3,scale*3));b=bi(level===1?r.int(0,scale*3):r.int(-scale*3,scale*3));c=r.int(0,2);if(c===0){result=mod(a+b,m);options=["("+a+" + "+b+") mod "+m];}else if(c===1){result=mod(a-b,m);options=["("+a+" − "+b+") mod "+m];}else{result=mod(a*b,m);options=["("+a+" · "+b+") mod "+m];}
      return question(id,level,prompt("Compute the modular expression.",options,"Normalize the final residue."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],"Reducing operands and the final result gives "+result+".",[a,b,m,c],{integers:[a,b,m],modulus:m,acceptedAnswerClass:"canonical residue"});
    case "modular_polynomial_substitution":
      m=smallModulus(r,level);a=bi(r.int(-Number(m),Number(m)));b=bi(r.int(-5,5));c=bi(r.int(-5,5));d=bi(r.int(-5,5));result=mod(b*a*a+c*a+d,m);
      return question(id,level,prompt("Evaluate the polynomial modulo m.",["x ≡ "+a+" (mod "+m+")","P(x) = "+b+"x² + "+c+"x + "+d],"Substitute any representative of x."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],"P("+a+")="+(b*a*a+c*a+d)+" ≡ "+result+" (mod "+m+").",[a,b,c,d,m],{integers:[a,b,c,d,m],modulus:m,acceptedAnswerClass:"canonical residue"});
    case "modular_cancellation":
      m=smallModulus(r,level);c=bi(r.int(2,scale));d=gcd(c,m);result=m/d;
      return question(id,level,prompt("State the strongest modulus justified by cancellation.",[c+"a ≡ "+c+"b (mod "+m+")","Therefore a ≡ b (mod ?)"],"Divide the modulus by gcd(c,m), not automatically by c."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],"gcd("+c+","+m+")="+d+", so the justified modulus is "+m+"/"+d+"="+result+".",[c,m,d],{integers:[c,m],modulus:m,acceptedAnswerClass:"positive modulus"});
    case "modular_expression_equivalence":
      m=smallModulus(r,level);c=r.int(0,2);if(c===0){options=["(x+3)²","x²+6x+9"];result=true;}else if(c===1){options=["x(x+1)","x²+x"];result=true;}else{options=["x²","x"];result=Array.from({length:Number(m)},function(_,i){return mod(bi(i)*bi(i),m)===bi(i);}).every(Boolean);}
      return question(id,level,prompt("Do the expressions agree for every residue x?",[options[0]+"  and  "+options[1]+" (mod "+m+")"],"A false universal claim needs only one checked counterexample."),[yesNo("decision",result)],result?"Expansion or exhaustive residues verifies the identity.":"A residue check supplies a counterexample; for example x=2 gives different residues when applicable.",[m,c],{integers:[m],modulus:m,acceptedAnswerClass:"yes/no universal claim"});

    case "small_modular_power":
      m=smallModulus(r,level);a=bi(level<3?r.int(0,scale):r.int(-scale,scale));e=bi(r.int(2,4+level));result=powmod(a,e,m);
      return question(id,level,prompt("Compute the modular power.",[a+"^"+e+" mod "+m],"Reduce after each multiplication."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],"Exact modular exponentiation gives "+result+".",[a,e,m],{integers:[a,e,m],modulus:m,acceptedAnswerClass:"canonical residue"});
    case "repeated_squaring_trace":
      m=smallModulus(r,level);a=bi(r.int(2,scale));e=bi(r.int(5,20+level*8));values=[];for(q=1n;q<=e;q*=2n)values.push([q,powmod(a,q,m)]);c=r.int(0,values.length-1);result=values[c][1];
      return question(id,level,prompt("Fill the missing repeated-squaring entry.",values.map(function(pair,index){return a+"^"+pair[0]+" mod "+m+" = "+(index===c?"?":pair[1]);}),"Each row squares the preceding residue."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],"Squaring the preceding entry and reducing modulo "+m+" gives "+result+".",[a,e,m,c],{integers:[a,e,m],modulus:m,acceptedAnswerClass:"canonical residue"});
    case "power_cycle":
      m=smallModulus(r,level);a=bi(r.int(2,Number(m-1n)));e=bi(r.int(20,80+level*30));result=powmod(a,e,m);values=[];var seen={};value=mod(a,m);while(seen[String(value)]===undefined){seen[String(value)]=values.length;values.push(value);value=mod(value*a,m);}
      return question(id,level,prompt("Use the power sequence to evaluate the target.",["powers of "+a+" mod "+m+": "+values.join(", ")+"; next "+value,a+"^"+e+" mod "+m+" = ?"],"For a nonunit, respect any preperiod before reducing the exponent."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],"Following the finite-state cycle to exponent "+e+" gives "+result+".",[a,e,m,values.length],{integers:[a,e,m],modulus:m,solutionSet:values.map(String),acceptedAnswerClass:"canonical residue"});
    case "euler_totient":
      a=choosePrime(r,level);b=choosePrime(r,level);while(b===a)b=choosePrime(r,level);n=a**bi(r.int(1,3))*b**bi(r.int(0,2));result=phi(n);
      return question(id,level,prompt("Compute Euler's totient.",["φ("+n+")",n+" = "+factorText(factorize(n))],"Count residues coprime to n."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],"The prime-product formula gives φ("+n+")="+result+".",[n],{integers:[n],factorizations:[factorText(factorize(n))],acceptedAnswerClass:"positive integer"});
    case "fermat_little_theorem":
      m=choosePrime(r,level);a=bi(r.int(2,scale));e=bi(r.int(40,200+level*100));result=powmod(a,e,m);
      return question(id,level,prompt("Compute using Fermat's theorem when its hypotheses apply.",[a+"^"+e+" mod "+m,"modulus "+m+" is prime"],a%m===0n?"The base is divisible by the prime, so handle it directly.":"The base is coprime to the prime modulus."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],a%m===0n?"The base residue is zero, so the result is zero.":"Reduce the exponent modulo "+(m-1n)+" and compute the remaining power: "+result+".",[a,e,m],{integers:[a,e,m],modulus:m,theoremHypotheses:{primeModulus:true,baseCoprime:a%m!==0n},acceptedAnswerClass:"canonical residue"});
    case "euler_theorem":
      m=smallModulus(r,level);a=bi(r.int(2,scale));if(level<4){while(gcd(a,m)!==1n)a+=1n;}e=bi(r.int(40,220+level*100));result=powmod(a,e,m);
      return question(id,level,prompt("Compute the modular power.",[a+"^"+e+" mod "+m,"gcd("+a+","+m+") = "+gcd(a,m)],"Use Euler only when the displayed GCD is 1."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],gcd(a,m)===1n?"φ("+m+")="+phi(m)+" reduces the exponent; the result is "+result+".":"Euler's unit hypothesis fails, so direct powmod/cycle gives "+result+".",[a,e,m],{integers:[a,e,m],modulus:m,theoremHypotheses:{coprime:gcd(a,m)===1n},acceptedAnswerClass:"canonical residue"});
    case "multiplicative_order":
      m=smallModulus(r,level);a=bi(r.int(2,Number(m-1n)));if(level<3)while(gcd(a,m)!==1n)a=mod(a+1n,m-1n)+1n;result=order(a,m);if(result===null){return question(id,level,prompt("Is the multiplicative order defined?",["ord_"+m+"("+a+")","gcd("+a+","+m+") = "+gcd(a,m)],"Order is defined only for a unit."),[choiceField("decision",t("fieldLabels.decision","Decision"),"undefined",[["defined",t("choices.defined","Defined")],["undefined",t("choices.undefined","Undefined")]])],"The GCD is not 1, so multiplicative order is undefined.",[a,m],{integers:[a,m],modulus:m,acceptedAnswerClass:"defined/undefined"});}
      return question(id,level,prompt("Find the multiplicative order.",["ord_"+m+"("+a+")"],"Find the least positive exponent producing residue 1."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],a+"^"+result+"≡1, and no smaller positive exponent works.",[a,m],{integers:[a,m],modulus:m,acceptedAnswerClass:"least positive integer"});
    case "theorem_selection_hypotheses":
      c=r.int(0,2);if(c===0){m=choosePrime(r,level);a=bi(r.int(2,scale));while(a%m===0n)a+=1n;result="fermat";}else if(c===1){m=bi(r.pick([8,9,10,12,15]));a=bi(r.int(2,scale));while(gcd(a,m)!==1n)a+=1n;result="euler";}else{m=bi(r.pick([8,12,15,18]));a=bi(r.int(2,scale));while(gcd(a,m)===1n)a+=1n;result="cycle";}e=bi(r.int(50,300));
      return question(id,level,prompt("Choose the justified reduction method.",[a+"^"+e+" mod "+m,"gcd(base, modulus) = "+gcd(a,m)+"; modulus prime: "+isPrime(m)],"A theorem is unavailable when a required hypothesis fails."),[choiceField("decision",t("fieldLabels.decision","Decision"),result,[["fermat",t("choices.fermat","Fermat")],["euler",t("choices.euler","Euler")],["cycle",t("choices.cycle","Direct cycle")]])],"The displayed primality and GCD facts justify "+result+".",[a,e,m,c],{integers:[a,e,m],modulus:m,theoremHypotheses:{prime:isPrime(m),coprime:gcd(a,m)===1n},acceptedAnswerClass:"controlled theorem choice"});

    case "unit_inverse_existence":
      m=level===1?choosePrime(r,level):smallModulus(r,level);a=bi(level===1?r.int(1,Number(m-1n)):r.int(0,Number(m*2n)));result=gcd(a,m)===1n;
      return question(id,level,prompt("Is this residue invertible?",[a+" modulo "+m],"Nonzero is not enough for a composite modulus."),[yesNo("decision",result)],"gcd("+a+","+m+")="+gcd(a,m)+", so the answer is "+(result?"yes":"no")+".",[a,m],{integers:[a,m],modulus:m,acceptedAnswerClass:"yes/no"});
    case "modular_inverse_search":
      m=smallModulus(r,level);a=bi(r.int(level<2?1:-Number(m),Number(m)));if(level<3)while(gcd(a,m)!==1n)a+=1n;value=inverse(a,m);if(value===null)return question(id,level,prompt("Does this modular inverse exist?",[a+"^−1 mod "+m],"Check the GCD before searching."),[choiceField("decision",t("fieldLabels.decision","Decision"),"undefined",[["defined",t("choices.defined","Defined")],["undefined",t("choices.undefined","Undefined")]])],"gcd("+a+","+m+")="+gcd(a,m)+", so no inverse exists.",[a,m],{integers:[a,m],modulus:m,acceptedAnswerClass:"defined/undefined"});
      return question(id,level,prompt("Find the modular inverse.",[a+"^−1 mod "+m],"Return the canonical residue."),[integerField("answer",t("fieldLabels.answer","Answer"),value)],a+"·"+value+" ≡ 1 (mod "+m+").",[a,m],{integers:[a,m],modulus:m,acceptedAnswerClass:"canonical residue"});
    case "inverse_extended_euclid":
      m=bi(r.pick([11,13,17,19,23,29,31,43]));a=bi(r.int(2,Number(m-1n)));while(gcd(a,m)!==1n)a+=1n;value=inverse(a,m);result=egcd(a,m);
      return question(id,level,prompt("Use the Bézout identity to find the inverse.",[a+"("+result.x+") + "+m+"("+result.y+") = 1",a+"^−1 mod "+m+" = ?"],"Normalize the coefficient of the base."),[integerField("answer",t("fieldLabels.answer","Answer"),value)],result.x+" mod "+m+" = "+value+", and "+a+"·"+value+"≡1.",[a,m],{integers:[a,m],modulus:m,bezoutCertificate:{x:String(result.x),y:String(result.y),g:"1"},acceptedAnswerClass:"canonical residue"});
    case "modular_division":
      m=smallModulus(r,level);a=bi(level<2?r.int(0,scale):r.int(-scale,scale));b=bi(r.int(2,scale));if(level<3)while(gcd(b,m)!==1n)b+=1n;value=inverse(b,m);if(value===null)return question(id,level,prompt("Is this modular division defined?",[a+" / "+b+" (mod "+m+")"],"The denominator must be a unit."),[choiceField("decision",t("fieldLabels.decision","Decision"),"undefined",[["defined",t("choices.defined","Defined")],["undefined",t("choices.undefined","Undefined")]])],"gcd("+b+","+m+")="+gcd(b,m)+", so division is undefined.",[a,b,m],{integers:[a,b,m],modulus:m,acceptedAnswerClass:"defined/undefined"});
      result=mod(a*value,m);return question(id,level,prompt("Compute the modular quotient.",[a+" / "+b+" (mod "+m+")"],"Multiply by the denominator's inverse."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],b+"^−1≡"+value+", so the quotient is "+result+".",[a,b,m],{integers:[a,b,m],modulus:m,acceptedAnswerClass:"canonical residue"});
    case "linear_congruence_coprime":
      n=smallModulus(r,level);a=bi(r.int(1,Number(n-1n)));while(gcd(a,n)!==1n)a+=1n;b=bi(r.int(-scale,scale));result=solveLinear(a,b,n)[0];
      return question(id,level,prompt("Solve the coprime linear congruence.",[a+"x ≡ "+b+" (mod "+n+")"],"Return the canonical residue for x."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],"Multiply by "+inverse(a,n)+", the inverse of "+a+": x≡"+result+".",[a,b,n],{integers:[a,b,n],modulus:n,solutionSet:[String(result)],acceptedAnswerClass:"congruence class"});
    case "linear_congruence_general":
      n=smallModulus(r,level)*bi(r.pick([2,3,4]));a=bi(r.int(2,Number(n-1n)));b=bi(r.int(0,Number(n-1n)));values=solveLinear(a,b,n);
      return question(id,level,prompt("Solve completely in the canonical residue range.",[a+"x ≡ "+b+" (mod "+n+")","0 ≤ x < "+n],"An empty set means no solution."),[setField("values",values)],values.length?"d=gcd(a,n)="+gcd(a,n)+" divides b; lifting gives "+formatSet(values)+".":"gcd(a,n)="+gcd(a,n)+" does not divide b, so there is no solution.",[a,b,n],{integers:[a,b,n],modulus:n,solutionSet:values.map(String),acceptedAnswerClass:"unordered complete residue set"});
    case "linear_congruence_solution_count":
      n=smallModulus(r,level)*bi(r.pick([2,3,4]));a=bi(r.int(1,Number(n-1n)));b=bi(r.int(0,Number(n-1n)));values=solveLinear(a,b,n);
      return question(id,level,prompt("How many incongruent solutions are there?",[a+"x ≡ "+b+" (mod "+n+")"],"Use d=gcd(a,n) and the divisibility criterion."),[integerField("count",t("fieldLabels.count","Count"),values.length)],values.length?"d="+gcd(a,n)+" divides b, so there are "+values.length+" solutions.":"d="+gcd(a,n)+" does not divide b, so the count is 0.",[a,b,n],{integers:[a,b,n],modulus:n,solutionSet:values.map(String),acceptedAnswerClass:"nonnegative integer"});
    case "inverse_linear_congruence":
      n=smallModulus(r,level);a=bi(r.int(1,Number(n-1n)));x0=bi(r.int(0,Number(n-1n)));b=mod(a*x0,n);
      return question(id,level,prompt("Recover the missing right-hand residue.",[a+"x ≡ b (mod "+n+")","x = "+x0+" must be a solution"],"Choose the canonical b."),[integerField("answer",t("fieldLabels.answer","Answer"),b)],a+"·"+x0+" mod "+n+" = "+b+".",[a,x0,n],{integers:[a,x0,n],modulus:n,acceptedAnswerClass:"canonical residue"});

    case "crt_coprime_two":
      m=bi(r.pick([3,4,5,7,8,9]));n=bi(r.pick([5,7,8,11,13]));while(gcd(m,n)!==1n)n+=1n;a=bi(r.int(-scale,scale));b=bi(r.int(-scale,scale));merged=crtMerge(a,m,b,n);
      return crtQuestion(id,level,[{r:a,m:m},{r:b,m:n}],merged,"Solve the two-congruence CRT system.");
    case "crt_coprime_three":
      m=bi(r.pick([2,3,4,5]));n=bi(r.pick([5,7,9,11]));while(gcd(m,n)!==1n)n+=1n;d=bi(r.pick([7,11,13]));while(gcd(m*n,d)!==1n)d+=2n;a=bi(r.int(0,Number(m-1n)));b=bi(r.int(0,Number(n-1n)));c=bi(r.int(0,Number(d-1n)));merged=crtMerge(a,m,b,n);merged=crtMerge(merged.r,merged.m,c,d);
      return crtQuestion(id,level,[{r:a,m:m},{r:b,m:n},{r:c,m:d}],merged,"Merge the three pairwise-coprime congruences.");
    case "crt_general_consistency":
      m=bi(r.pick([4,6,8,10,12]));n=bi(r.pick([6,8,9,12,15]));while(gcd(m,n)===1n)n+=1n;a=bi(r.int(0,Number(m-1n)));b=bi(r.int(0,Number(n-1n)));if(r.bool())b=mod(a,n);merged=crtMerge(a,m,b,n);result=merged!==null;
      return question(id,level,prompt("Is the CRT system consistent?",["x ≡ "+a+" (mod "+m+")","x ≡ "+b+" (mod "+n+")"],"Compare the residues modulo gcd("+m+","+n+")."),[yesNo("decision",result)],"gcd="+gcd(m,n)+"; the residue difference "+(a-b)+(result?" is":" is not")+" divisible by it.",[a,b,m,n],{integers:[a,b,m,n],congruenceSystem:[{r:String(a),m:String(m)},{r:String(b),m:String(n)}],solutionSet:merged?{r:String(merged.r),m:String(merged.m)}:null,acceptedAnswerClass:"yes/no"});
    case "crt_general_solve":
      m=bi(r.pick([4,6,8,10]));n=bi(r.pick([6,9,12,15]));while(gcd(m,n)===1n)n+=1n;x0=bi(r.int(0,Number(lcm(m,n)-1n)));a=mod(x0,m);b=mod(x0,n);merged=crtMerge(a,m,b,n);
      return crtQuestion(id,level,[{r:a,m:m},{r:b,m:n}],merged,"Solve the compatible non-coprime CRT system.");
    case "crt_missing_residue":
      m=bi(r.pick([3,4,5,7]));n=bi(r.pick([5,7,8,9,11]));while(gcd(m,n)!==1n)n+=1n;value=bi(r.int(0,Number(m*n-1n)));a=mod(value,m);b=mod(value,n);
      return question(id,level,prompt("Recover the missing component residue.",["x ≡ "+value+" (mod "+(m*n)+")","x ≡ "+a+" (mod "+m+")","x ≡ ? (mod "+n+")"],"Reduce the combined representative."),[integerField("answer",t("fieldLabels.answer","Answer"),b)],value+" mod "+n+" = "+b+".",[value,m,n],{integers:[value,m,n],modulus:n,acceptedAnswerClass:"canonical residue"});
    case "crt_application_schedule":
      m=bi(r.pick([3,4,5,7]));n=bi(r.pick([5,7,8,9,11]));while(gcd(m,n)!==1n)n+=1n;a=bi(r.int(0,Number(m-1n)));b=bi(r.int(0,Number(n-1n)));merged=crtMerge(a,m,b,n);c=bi(r.int(0,Number(merged.m*2n)));result=merged.r;while(result<c)result+=merged.m;
      return question(id,level,prompt("Find the first schedule alignment at or after the bound.",["t ≡ "+a+" (mod "+m+")","t ≡ "+b+" (mod "+n+")","t ≥ "+c],"Return the smallest qualifying nonnegative t."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],"CRT gives t≡"+merged.r+" mod "+merged.m+"; advancing to the bound gives "+result+".",[a,b,m,n,c],{integers:[a,b,m,n,c],congruenceSystem:[{r:String(a),m:String(m)},{r:String(b),m:String(n)}],solutionSet:{r:String(merged.r),m:String(merged.m),lowerBound:String(c)},acceptedAnswerClass:"least qualifying integer"});

    case "diophantine_solvability":
      a=bi(r.int(2,scale));b=bi(r.int(2,scale));if(level>=3&&r.int(0,7)===0)a=0n;c=bi(r.int(-scale*2,scale*2));if(r.bool())c*=gcd(a,b);result=c%gcd(a,b)===0n;
      return question(id,level,prompt("Does the equation have integer solutions?",[a+"x + "+b+"y = "+c],"Use the GCD criterion; rational solutions are not enough."),[yesNo("decision",result)],"gcd("+a+","+b+")="+gcd(a,b)+(result?" divides ":" does not divide ")+c+".",[a,b,c],{integers:[a,b,c],acceptedAnswerClass:"yes/no"});
    case "find_one_diophantine_solution":
      a=bi(r.int(2,scale));b=bi(r.int(2,scale));x0=bi(r.int(-5,5));y0=bi(r.int(-5,5));c=a*x0+b*y0;
      return question(id,level,prompt("Find any one integer solution.",[a+"x + "+b+"y = "+c],"Your pair is checked by exact substitution."),[integerField("x",t("fieldLabels.x","x"),x0),integerField("y",t("fieldLabels.y","y"),y0)],a+"("+x0+")+"+b+"("+y0+")="+c+".",[a,b,c,x0,y0],{integers:[a,b,c],bezoutCertificate:{x:String(x0),y:String(y0),c:String(c)},acceptedAnswerClass:"any integer solution",validator:{type:"linear-certificate",a:String(a),b:String(b),c:String(c)}});
    case "parameterize_diophantine":
      a=bi(r.int(2,scale));b=bi(r.int(2,scale));d=gcd(a,b);x0=bi(r.int(-5,5));y0=bi(r.int(-5,5));c=a*x0+b*y0;var dx=b/d,dy=-a/d;
      return question(id,level,prompt("Parameterize every integer solution.",[a+"x + "+b+"y = "+c,"Enter x=x₀+Δx·t and y=y₀+Δy·t"],"Equivalent shifted or sign-reversed primitive parameterizations are accepted."),[integerField("x0",t("fieldLabels.x0","x base"),x0),integerField("dx",t("fieldLabels.dx","x step"),dx),integerField("y0",t("fieldLabels.y0","y base"),y0),integerField("dy",t("fieldLabels.dy","y step"),dy)],"One form is x="+x0+"+("+dx+")t, y="+y0+"+("+dy+")t.",[a,b,c,x0,y0],{integers:[a,b,c],solutionSet:{x0:String(x0),dx:String(dx),y0:String(y0),dy:String(dy)},acceptedAnswerClass:"equivalent primitive parameterization",validator:{type:"parameterization",a:String(a),b:String(b),c:String(c),dx:String(dx),dy:String(dy)}});
    case "bounded_diophantine_solutions":
      a=bi(r.int(2,7));b=bi(r.int(3,9));c=bi(r.int(10,35+level*8));values=enumeratePairs(a,b,c,true);
      return question(id,level,prompt("List all nonnegative integer solutions.",[a+"x + "+b+"y = "+c,"x ≥ 0, y ≥ 0"],"Enter pairs like (0, 6); (5, 3). Order does not matter."),[integerField("values",t("fieldLabels.values","Values"),values.length?values.map(function(pair){return "("+pair[0]+","+pair[1]+")";}).join("; "):"{}","pairset")],values.length?"The bounded parameter interval gives "+values.map(function(pair){return "("+pair.join(",")+")";}).join(", ")+".":"The bounded solution set is empty.",[a,b,c],{integers:[a,b,c],solutionSet:values.map(function(pair){return pair.map(String);}),acceptedAnswerClass:"unordered pair set"});
    case "coin_linear_combination":
      a=bi(r.int(2,8));b=bi(r.int(3,10));c=bi(r.int(8,40+level*8));values=enumeratePairs(a,b,c,true);
      return question(id,level,prompt("Count the nonnegative item-count pairs.",[a+"x + "+b+"y = "+c,"x ≥ 0, y ≥ 0"],"Do not count orderings of individual items."),[integerField("count",t("fieldLabels.count","Count"),values.length)],"The valid count pairs are "+(values.length?values.map(function(pair){return "("+pair.join(",")+")";}).join(", "):"none")+", so the count is "+values.length+".",[a,b,c],{integers:[a,b,c],solutionSet:values.map(function(pair){return pair.map(String);}),acceptedAnswerClass:"nonnegative integer"});
    case "diophantine_missing_parameter":
      x0=bi(r.int(-8,8));a=bi(r.int(2,8));b=bi(r.int(-5,5));value=x0+a*b;
      return question(id,level,prompt("Recover the integer parameter.",["x = "+x0+" + "+a+"t","x = "+value],"Then the paired coordinate would be fixed by the same t."),[integerField("parameter",t("fieldLabels.parameter","Parameter t"),b)],"("+value+"−"+x0+")/"+a+" = "+b+".",[x0,a,value],{integers:[x0,a,value],acceptedAnswerClass:"exact integer"});
    case "diophantine_congruence_link":
      a=bi(r.int(2,scale));b=bi(r.int(0,scale));n=smallModulus(r,level);options=[["minus",a+"x − "+n+"y = "+b],["swap",n+"x − "+a+"y = "+b],["equal",a+"x = "+b]];
      return question(id,level,prompt("Choose an equivalent integer equation.",[a+"x ≡ "+b+" (mod "+n+")"],"The auxiliary integer records the multiple of the modulus."),[choiceField("decision",t("fieldLabels.decision","Decision"),"minus",options)],"The congruence means "+n+" divides "+a+"x−"+b+", so "+a+"x−"+n+"y="+b+" for an integer y.",[a,b,n],{integers:[a,b,n],modulus:n,acceptedAnswerClass:"controlled equivalence choice"});

    case "clock_arithmetic":
      m=bi(r.pick([7,12,24]));a=m===12n?bi(r.int(1,12)):bi(r.int(0,Number(m-1n)));b=bi(level===1?r.int(1,scale):r.int(-scale,scale));result=mod((m===12n&&a===12n?0n:a)+b,m);if(m===12n&&result===0n)result=12n;
      return question(id,level,prompt("Move around the labeled cycle.",["cycle size: "+m,"start: "+a,"offset: "+b],m===12n?"The 12-hour label 12 represents residue 0.":"Return the canonical cycle label."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],"Map, add, normalize modulo "+m+", then map back: "+result+".",[a,b,m],{integers:[a,b,m],modulus:m,acceptedAnswerClass:"cycle label"});
    case "last_digit_digits":
      c=r.int(1,Math.min(3,1+Math.floor(level/2)));m=10n**bi(c);a=bi(r.int(2,12));e=bi(r.int(3,12+level*4));result=powmod(a,e,m);expected=String(result).padStart(c,"0");
      return question(id,level,prompt("Find the final decimal digits.",["last "+c+" digit"+(c===1?"":"s")+" of "+a+"^"+e],"Include leading zeroes so the answer has exactly "+c+" digit"+(c===1?"":"s")+"."),[integerField("digits",t("fieldLabels.digits","Digits"),expected,"digits")],a+"^"+e+" mod "+m+" = "+result+", formatted as "+expected+".",[a,e,c],{integers:[a,e],modulus:m,acceptedAnswerClass:"fixed-width decimal string"});
    case "check_digit_compute":
      m=10n;values=[bi(r.int(0,9)),bi(r.int(0,9)),bi(r.int(0,9))];a=bi(r.pick([1,3,7]));b=bi(r.pick([1,3,7]));c=bi(r.pick([1,3,7]));d=level>=3?bi(r.pick([1,2,4,5,6])):1n;var checkDigits=[];for(q=0n;q<=9n;q+=1n)if(mod(a*values[0]+b*values[1]+c*values[2]+d*q,m)===0n)checkDigits.push(q);
      return question(id,level,prompt("Compute every valid check digit.",[a+"·"+values[0]+" + "+b+"·"+values[1]+" + "+c+"·"+values[2]+" + "+d+"·check ≡ 0 (mod 10)"],"The check digit lies in 0..9; the set may contain zero, one, or several digits."),[setField("values",checkDigits)],"Exhausting the ten allowed digits gives "+formatSet(checkDigits)+".",values.concat([a,b,c,d]),{integers:values.concat([a,b,c,d]),modulus:m,solutionSet:checkDigits.map(String),acceptedAnswerClass:"unordered digit set"});
    case "checksum_error_detection":
      c=r.int(0,1);result=c===0;options=c===0?["A single decimal digit changes by a nonzero amount","sum of digits mod 10"]:["Two digits are transposed","sum of digits mod 10"];
      return question(id,level,prompt("Is this error class always detected?",options,"A guarantee is universal, not evidence from one example."),[yesNo("decision",result)],result?"A nonzero digit change ±1..±9 cannot be 0 modulo 10.":"A transposition preserves the ordinary digit sum, so it is never detected by this rule.",[c],{modulus:10n,acceptedAnswerClass:"yes/no guarantee",distractors:["generalizing from examples"]});
    case "affine_cipher_toy":
      m=26n;if(level>=3&&r.int(0,4)===0){a=bi(r.pick([2,4,6,13]));b=bi(r.int(0,25));return question(id,level,prompt("Educational toy affine cipher — insecure.",["E(x)="+a+"x+"+b+" mod 26","Is this a valid permutation key?"],"The multiplier must be invertible modulo 26."),[choiceField("decision",t("fieldLabels.decision","Decision"),"invalid",[["valid",t("choices.valid","Valid")],["invalid",t("choices.invalid","Invalid")]])],"gcd("+a+",26)="+gcd(a,m)+", so decoding is not uniquely invertible.",[a,b],{integers:[a,b],modulus:m,theoremHypotheses:{unitMultiplier:false},acceptedAnswerClass:"valid/invalid"});}a=bi(r.pick([3,5,7,11,15,17,19,21,23,25]));b=bi(r.int(0,25));x0=bi(r.int(0,25));c=r.int(0,1);if(c===0){result=mod(a*x0+b,m);options=["encode x="+x0,"E(x)="+a+"x+"+b+" mod 26"];}else{value=mod(a*x0+b,m);result=x0;options=["decode y="+value,"E(x)="+a+"x+"+b+" mod 26"];}
      return question(id,level,prompt("Educational toy affine cipher — insecure.",options,"Alphabet encoding is A=0,…,Z=25."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],c===0?"Direct encoding gives residue "+result+".":"Multiply y−b by a^−1="+inverse(a,m)+" to recover "+result+".",[a,b,x0,c],{integers:[a,b,x0],modulus:m,theoremHypotheses:{unitMultiplier:true},acceptedAnswerClass:"alphabet residue"});
    case "rsa_toy_key_math":
      a=bi(r.pick([3,5,7,11]));b=bi(r.pick([11,13,17,19]));while(a===b)b+=2n;n=a*b;m=(a-1n)*(b-1n);if(level>=3&&r.int(0,4)===0){e=bi(r.pick([2,4,6,10]));return question(id,level,prompt("Educational toy RSA — tiny and insecure.",["p="+a+", q="+b+", φ(n)="+m,"candidate e="+e,"Is e valid?"],"A public exponent must be coprime to φ(n)."),[choiceField("decision",t("fieldLabels.decision","Decision"),"invalid",[["valid",t("choices.valid","Valid")],["invalid",t("choices.invalid","Invalid")]])],"gcd("+e+","+m+")="+gcd(e,m)+", so no private inverse exists.",[a,b,e],{integers:[a,b,e],modulus:m,theoremHypotheses:{distinctPrimes:true,unitExponent:false},acceptedAnswerClass:"valid/invalid"});}values=[];for(c=3n;c<m;c+=2n)if(gcd(c,m)===1n)values.push(c);e=r.pick(values);d=inverse(e,m);c=r.int(0,2);result=c===0?n:c===1?m:d;
      return question(id,level,prompt("Educational toy RSA — tiny and insecure.",["p="+a+", q="+b+", e="+e,c===0?"find n":c===1?"find φ(n)":"find private exponent d"],"These supplied values demonstrate arithmetic only."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],c===0?"n=pq="+result+".":c===1?"φ=(p−1)(q−1)="+result+".":e+"·"+d+"≡1 (mod "+m+").",[a,b,e,c],{integers:[a,b,e],modulus:m,theoremHypotheses:{distinctPrimes:true,unitExponent:true},acceptedAnswerClass:"exact integer"});
    case "rsa_toy_transform":
      n=55n;e=r.bool()?3n:27n;a=bi(r.int(0,54));result=powmod(a,e,n);
      return question(id,level,prompt("Educational toy RSA transform — insecure.",[a+"^"+e+" mod "+n],"Use exact repeated squaring; this is not a deployable key."),[integerField("answer",t("fieldLabels.answer","Answer"),result)],"Binary modular exponentiation gives "+result+".",[a,e,n],{integers:[a,e,n],modulus:n,acceptedAnswerClass:"canonical residue"});
    case "quadratic_residue_intro":
      m=smallModulus(r,level);a=bi(r.int(0,Number(m-1n)));values=[];for(x0=0n;x0<m;x0+=1n)if(mod(x0*x0,m)===a)values.push(x0);
      return question(id,level,prompt("Solve the quadratic congruence by bounded enumeration.",["x² ≡ "+a+" (mod "+m+")","0 ≤ x < "+m],"Enter every root as an unordered set."),[setField("values",values)],values.length?"Squaring all residues gives roots "+formatSet(values)+".":"No residue square equals "+a+" modulo "+m+".",[a,m],{integers:[a,m],modulus:m,solutionSet:values.map(String),acceptedAnswerClass:"unordered complete residue set"});
    }
    throw new Error("No generator for " + id);
  }

  function crtQuestion(id, level, system, merged, title) {
    var fields = [integerField("residue",t("fieldLabels.residue","Residue r"),merged.r),integerField("modulus",t("fieldLabels.modulus","Combined modulus M"),merged.m)];
    return question(id,level,prompt(title,system.map(function(item){return "x ≡ "+item.r+" (mod "+item.m+")";}),"A congruent representative is accepted; the combined modulus must be exact."),fields,"The system merges to x≡"+merged.r+" (mod "+merged.m+").",system.map(function(item){return item.r+":"+item.m;}).join("|"),{integers:system.reduce(function(all,item){return all.concat([item.r,item.m]);},[]),congruenceSystem:system.map(function(item){return {r:String(item.r),m:String(item.m)};}),solutionSet:{r:String(merged.r),m:String(merged.m)},acceptedAnswerClass:"equivalent CRT representative with exact modulus",validator:{type:"crt",r:String(merged.r),m:String(merged.m)}});
  }

  FAMILY_ROWS.forEach(function (row) { GENERATORS[row[0]] = function (level, localRng) { return generateFamily(row[0],level,localRng); }; });

  function generateQuestion(familyId, level, seed, ignoreHistory) {
    var generator=GENERATORS[familyId]; if(!generator)throw new Error("Unknown family "+familyId);
    var local=new Rng(seed),candidate;
    for(var attempt=0;attempt<80;attempt+=1){candidate=generator(Math.max(1,Math.min(5,Number(level)||1)),local);validateQuestion(candidate);if(ignoreHistory||!recentSignatures.includes(candidate.structuralSignature))return candidate;}
    return candidate;
  }

  function validateQuestion(item) {
    var required=["categoryId","subcategoryId","familyId","level","integersExact","modulus","factorizations","euclideanTrace","bezoutCertificate","congruenceSystem","solutionSet","theoremHypotheses","canonicalAnswer","acceptedAnswerClass","difficultyDimensions","misconceptionsTargeted","distractorProvenance","workedSolution","structuralSignature","oracleVersion"];
    if(!item||required.some(function(key){return !Object.prototype.hasOwnProperty.call(item,key);}))throw new Error("Incomplete question metadata");
    if(item.oracleVersion!==ORACLE_VERSION||!GENERATORS[item.familyId]||!LEVELS.includes(item.level))throw new Error("Invalid question identity");
    if(!item.prompt||!item.prompt.title||!Array.isArray(item.prompt.rows)||!item.fields.length)throw new Error("Incomplete prompt/fields");
    var ids=new Set();item.fields.forEach(function(field){if(!field.id||ids.has(field.id))throw new Error("Duplicate field");ids.add(field.id);if(!Object.prototype.hasOwnProperty.call(item.canonicalAnswer,field.id))throw new Error("Missing canonical answer");if(field.options&&!field.options.some(function(option){return option.value===field.answer;}))throw new Error("Choice answer absent");});
    var serialized=JSON.stringify(item,function(key,value){return typeof value==="function"?"[validator]":value;});if(/\bNaN\b/.test(serialized))throw new Error("Unresolved generated value");
  }

  function parseInteger(value) { var clean=String(value===undefined?"":value).trim();return /^[+-]?\d+$/.test(clean)?BigInt(clean):null; }
  function parseSet(value) {
    var raw=String(value===undefined?"":value).trim();if(!raw)return null;if(raw==="{}"||raw==="∅")return [];var clean=raw.replace(/^\{/,'').replace(/\}$/,'').trim();if(!clean)return null;
    var parts=clean.split(/[\s,;]+/).filter(Boolean),out=[];for(var i=0;i<parts.length;i+=1){var parsed=parseInteger(parts[i]);if(parsed===null)return null;out.push(parsed);}return Array.from(new Set(out.map(String))).map(BigInt).sort(compareBig);
  }
  function parseFactorization(value) {
    var clean=String(value===undefined?"":value).trim().replace(/[·×]/g,"*").replace(/\s+/g,"");if(!clean)return null;
    var parts=clean.split("*"),map={};for(var i=0;i<parts.length;i+=1){var match=parts[i].match(/^(\d+)(?:\^(\d+))?$/);if(!match)return null;var p=BigInt(match[1]),e=BigInt(match[2]||"1");if(!isPrime(p)||e<1n)return null;map[String(p)]=(map[String(p)]||0n)+e;}return Object.keys(map).sort(function(x,y){return compareBig(BigInt(x),BigInt(y));}).map(function(p){return [BigInt(p),map[p]];});
  }
  function parsePairSet(value) {
    var clean=String(value===undefined?"":value).trim();if(!clean)return null;if(clean==="{}"||clean==="∅")return [];
    var regex=/\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*\)/g,out=[],match,last=0;
    while((match=regex.exec(clean))){if(clean.slice(last,match.index).replace(/[\s,;{}]+/g,""))return null;out.push([BigInt(match[1]),BigInt(match[2])]);last=regex.lastIndex;}
    if(!out.length||clean.slice(last).replace(/[\s,;{}]+/g,""))return null;
    return Array.from(new Map(out.map(function(pair){return [pair[0]+","+pair[1],pair];})).values()).sort(function(p,q){return compareBig(p[0],q[0])||compareBig(p[1],q[1]);});
  }
  function sameBigList(a,b){return a!==null&&b!==null&&a.length===b.length&&a.every(function(value,index){return value===b[index];});}
  function samePairList(a,b){return a!==null&&b!==null&&a.length===b.length&&a.every(function(pair,index){return pair[0]===b[index][0]&&pair[1]===b[index][1];});}
  function normalizeField(field,value){
    if(field.kind==="choice")return String(value===undefined?"":value).trim();
    if(field.kind==="integer")return parseInteger(value);
    if(field.kind==="set")return parseSet(value);
    if(field.kind==="factorization")return parseFactorization(value);
    if(field.kind==="pairset")return parsePairSet(value);
    if(field.kind==="digits"){var clean=String(value===undefined?"":value).trim();return /^\d+$/.test(clean)?clean:null;}
    return String(value===undefined?"":value).trim();
  }
  function checkQuestion(answers,item){
    var parsed={},correct=true,parts={};
    item.fields.forEach(function(field){var actual=normalizeField(field,answers[field.id]),expectedValue=normalizeField(field,field.answer),ok;
      if(field.kind==="integer")ok=actual!==null&&actual===expectedValue;else if(field.kind==="set")ok=sameBigList(actual,expectedValue);else if(field.kind==="factorization")ok=actual!==null&&factorText(actual)===factorText(expectedValue);else if(field.kind==="pairset")ok=samePairList(actual,expectedValue);else ok=actual!==null&&actual===expectedValue;
      parsed[field.id]=actual;parts[field.id]={correct:ok,actual:actual,expected:expectedValue,label:field.label};correct=correct&&ok;
    });
    var validator=item.validator;
    if(validator&&validator.type==="linear-certificate"){
      var vx=parsed.x,vy=parsed.y;correct=vx!==null&&vy!==null&&BigInt(validator.a)*vx+BigInt(validator.b)*vy===BigInt(validator.c);
    } else if(validator&&validator.type==="crt"){
      correct=parsed.residue!==null&&parsed.modulus!==null&&parsed.modulus===BigInt(validator.m)&&mod(parsed.residue-BigInt(validator.r),parsed.modulus)===0n;
    } else if(validator&&validator.type==="parameterization"){
      var px=parsed.x0,pdx=parsed.dx,py=parsed.y0,pdy=parsed.dy,A=BigInt(validator.a),B=BigInt(validator.b),C=BigInt(validator.c),DX=BigInt(validator.dx),DY=BigInt(validator.dy);
      correct=[px,pdx,py,pdy].every(function(v){return v!==null;})&&A*px+B*py===C&&A*pdx+B*pdy===0n&&((pdx===DX&&pdy===DY)||(pdx===-DX&&pdy===-DY));
    }
    var expectedText=item.expectedText||item.fields.map(function(field){var option=field.options&&field.options.find(function(candidate){return candidate.value===field.answer;});return field.label+"="+(option?option.label:field.answer);}).join(", ");
    return {correct:correct,parts:parts,expectedText:expectedText};
  }

  function defaultStat(){return {attempts:0,correct:0,totalMs:0,streak:0,recent:[],mastery:0};}
  function defaultProgress(){var enabled={};CATEGORIES.forEach(function(category){enabled[category.id]=true;});return {version:1,view:"practice",settings:{adaptive:true,enabled:enabled},manual:{familyId:FAMILIES[0].id,level:1},stats:{}};}
  function mergeProgress(stored){var base=defaultProgress();if(!stored||typeof stored!=="object")return base;if(["practice","matrix","stats","settings","learn"].includes(stored.view))base.view=stored.view;if(stored.settings){base.settings.adaptive=stored.settings.adaptive!==false;CATEGORIES.forEach(function(category){if(stored.settings.enabled&&stored.settings.enabled[category.id]===false)base.settings.enabled[category.id]=false;});}if(stored.manual&&FAMILIES.some(function(family){return family.id===stored.manual.familyId;})){base.manual.familyId=stored.manual.familyId;base.manual.level=Math.max(1,Math.min(5,Number(stored.manual.level)||1));}if(stored.stats&&typeof stored.stats==="object")Object.keys(stored.stats).forEach(function(key){var value=stored.stats[key];if(!value||typeof value!=="object")return;base.stats[key]={attempts:Math.max(0,Number(value.attempts)||0),correct:Math.max(0,Number(value.correct)||0),totalMs:Math.max(0,Number(value.totalMs)||0),streak:Math.max(0,Number(value.streak)||0),recent:Array.isArray(value.recent)?value.recent.slice(-10).map(Boolean):[],mastery:Math.max(0,Math.min(100,Number(value.mastery)||0))};});return base;}
  function loadProgress(){try{return mergeProgress(JSON.parse(localStorage.getItem(STORAGE_KEY)));}catch(error){return defaultProgress();}}
  function saveProgress(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));}catch(error){}}
  function getStat(familyId,level){var key=familyId+":"+level;if(!progress.stats[key])progress.stats[key]=defaultStat();return progress.stats[key];}
  function updateMastery(stat){var evidence=Math.min(1,stat.attempts/5),accuracy=stat.recent.length?stat.recent.filter(Boolean).length/stat.recent.length:stat.correct/Math.max(1,stat.attempts);stat.mastery=Math.round(100*evidence*accuracy);}
  function aggregate(){var total={attempts:0,correct:0,totalMs:0,masteryTotal:0,practiced:0};Object.keys(progress.stats).forEach(function(key){var stat=progress.stats[key];total.attempts+=stat.attempts;total.correct+=stat.correct;total.totalMs+=stat.totalMs;if(stat.attempts){total.masteryTotal+=stat.mastery;total.practiced+=1;}});return total;}
  function enabledCells(){var cells=[];FAMILIES.forEach(function(family){if(progress.settings.enabled[family.categoryId]===false)return;LEVELS.forEach(function(level){cells.push({family:family,level:level,stat:getStat(family.id,level)});});});return cells;}
  function chooseAdaptiveCell(){var cells=enabledCells();if(!cells.length){progress.settings.enabled[CATEGORIES[0].id]=true;cells=enabledCells();}var untried=cells.filter(function(cell){return cell.stat.attempts===0;});if(untried.length)return untried[rng.int(0,Math.min(untried.length-1,29))];return cells.slice().sort(function(x,y){return x.stat.mastery+Math.min(20,x.stat.attempts)-y.stat.mastery-Math.min(20,y.stat.attempts);})[rng.int(0,Math.min(8,cells.length-1))];}
  function elapsedMs(){return Math.max(0,Date.now()-currentStartedAt-pausedMs-(isPaused&&pauseStartedAt?Date.now()-pauseStartedAt:0));}
  function startQuestion(){if(isPaused)resumePractice();var selection=progress.settings.adaptive?chooseAdaptiveCell():{family:familyById(progress.manual.familyId),level:progress.manual.level};currentQuestion=generateQuestion(selection.family.id,selection.level,rng.next(),false);recentSignatures.push(currentQuestion.structuralSignature);recentSignatures=recentSignatures.slice(-100);currentStartedAt=Date.now();pausedMs=0;pauseStartedAt=0;submitted=false;renderQuestion();renderPracticeControls();renderCurrentMetrics();}

  function renderPrompt(data){var container=document.getElementById("questionPrompt");container.replaceChildren();var title=document.createElement("div");title.textContent=data.title;container.appendChild(title);data.rows.forEach(function(row){var line=document.createElement("div");line.className="prompt-row";line.textContent=row;container.appendChild(line);});if(data.note){var note=document.createElement("div");note.className="prompt-note";note.textContent=data.note;container.appendChild(note);}}
  function answerTextInputs(){return Array.from(document.querySelectorAll("#answerControls input[data-answer-field]"));}
  function shouldAutoFocusAnswer(){return window.matchMedia?window.matchMedia("(pointer: fine)").matches:true;}
  function setActiveInput(input,focusOnDesktop){activeAnswerInput=input||null;answerTextInputs().forEach(function(candidate){candidate.classList.toggle("active-keypad-target",candidate===activeAnswerInput);});updateKeypadState();if(focusOnDesktop&&activeAnswerInput&&shouldAutoFocusAnswer())activeAnswerInput.focus();}
  function selectNextInput(){var inputs=answerTextInputs().filter(function(input){return !input.disabled;});if(inputs.length<2)return;var index=inputs.indexOf(activeAnswerInput);setActiveInput(inputs[(index+1+inputs.length)%inputs.length],true);}
  function renderAnswerControls(){var container=document.getElementById("answerControls");container.replaceChildren();activeAnswerInput=null;currentQuestion.fields.forEach(function(field){var wrapper=document.createElement("div");wrapper.className="answer-control";var label=document.createElement("label");label.textContent=field.label;label.htmlFor="answer-"+field.id;wrapper.appendChild(label);var control;if(field.options){control=document.createElement("select");var blank=document.createElement("option");blank.value="";blank.textContent=t("practice.choose","Choose…");control.appendChild(blank);field.options.forEach(function(option){var element=document.createElement("option");element.value=option.value;element.textContent=option.label;control.appendChild(element);});}else{control=document.createElement("input");control.type="text";control.autocomplete="off";control.spellcheck=false;control.inputMode="none";control.dataset.inputKind=field.kind;control.addEventListener("focus",function(){setActiveInput(control,false);});if(!activeAnswerInput)activeAnswerInput=control;}control.id="answer-"+field.id;control.dataset.answerField=field.id;wrapper.appendChild(control);container.appendChild(wrapper);});setActiveInput(activeAnswerInput,false);}
  var KEYPAD_IDS=["digit0","digit1","digit2","digit3","digit4","digit5","digit6","digit7","digit8","digit9","plus","minus","comma","open","close","caret","star","semicolon","emptySet"];
  function allowedKeypadIds(kind){var digits=["digit0","digit1","digit2","digit3","digit4","digit5","digit6","digit7","digit8","digit9"];if(kind==="integer")return digits.concat(["plus","minus"]);if(kind==="set")return digits.concat(["plus","minus","comma","emptySet"]);if(kind==="factorization")return digits.concat(["caret","star"]);if(kind==="pairset")return digits.concat(["plus","minus","comma","open","close","semicolon","emptySet"]);if(kind==="digits")return digits;return [];}
  function updateKeypadState(){if(!keypadButtons)return;var editable=Boolean(activeAnswerInput&&!activeAnswerInput.disabled&&!isPaused&&!submitted),allowed=editable?allowedKeypadIds(activeAnswerInput.dataset.inputKind):[];KEYPAD_IDS.forEach(function(id){var button=keypadButtons.get(id);if(button)button.disabled=!allowed.includes(id);});["delete","clear"].forEach(function(id){keypadButtons.get(id).disabled=!editable;});keypadButtons.get("nextField").disabled=!editable||answerTextInputs().length<2;keypadButtons.get("submit").disabled=isPaused;}
  function renderQuestion(){var family=familyById(currentQuestion.familyId);document.getElementById("questionCategory").textContent=categoryById(family.categoryId).title;document.getElementById("questionFamily").textContent=family.title;document.getElementById("questionLevel").textContent=t("practice.level","Level")+" "+currentQuestion.level;renderPrompt(currentQuestion.prompt);renderAnswerControls();document.getElementById("feedback").className="feedback hidden";document.getElementById("submitBtn").disabled=false;document.getElementById("submitBtn").innerHTML=t("practice.check","Check")+' <span class="key-symbol">↵</span>';document.getElementById("nextBtn").classList.add("hidden");document.getElementById("skipBtn").classList.remove("hidden");keypadButtons.get("submit").textContent=t("practice.check","Check");renderPauseState();window.setTimeout(function(){if(activeAnswerInput&&shouldAutoFocusAnswer())activeAnswerInput.focus();},0);}
  function collectAnswers(){var answers={};document.querySelectorAll("[data-answer-field]").forEach(function(control){answers[control.dataset.answerField]=control.value;});return answers;}
  function submitAnswer(event){event.preventDefault();if(!currentQuestion||isPaused)return;if(submitted){startQuestion();return;}var result=checkQuestion(collectAnswers(),currentQuestion),duration=elapsedMs(),stat=getStat(currentQuestion.familyId,currentQuestion.level);stat.attempts+=1;stat.correct+=result.correct?1:0;stat.totalMs+=duration;stat.streak=result.correct?stat.streak+1:0;stat.recent=stat.recent.concat([result.correct]).slice(-10);updateMastery(stat);saveProgress();submitted=true;document.querySelectorAll("[data-answer-field]").forEach(function(control){control.disabled=true;});updateKeypadState();document.getElementById("submitBtn").innerHTML=t("practice.next","Next")+' <span class="key-symbol">↵</span>';document.getElementById("nextBtn").classList.remove("hidden");document.getElementById("skipBtn").classList.add("hidden");keypadButtons.get("submit").textContent=t("practice.next","Next");var feedback=document.getElementById("feedback");feedback.className="feedback "+(result.correct?"correct":"incorrect");feedback.replaceChildren();var strong=document.createElement("strong");strong.textContent=result.correct?t("messages.correct","Correct"):t("messages.notQuite","Not quite");feedback.appendChild(strong);if(!result.correct){var expected=document.createElement("div");expected.className="expected-code";expected.textContent=t("messages.expected","Expected")+": "+result.expectedText;feedback.appendChild(expected);}var detail=document.createElement("div");detail.className="feedback-detail";detail.textContent=currentQuestion.explanation+" "+t("messages.time","Time")+": "+PracticeLabUI.formatSeconds(duration)+".";feedback.appendChild(detail);renderCurrentMetrics();renderSummary();}
  function pausePractice(){if(isPaused||submitted)return;isPaused=true;pauseStartedAt=Date.now();renderPauseState();}
  function resumePractice(){if(!isPaused)return;pausedMs+=Date.now()-pauseStartedAt;pauseStartedAt=0;isPaused=false;renderPauseState();}
  function renderPauseState(){document.querySelector(".practice-main").classList.toggle("paused",isPaused);document.getElementById("pauseBtn").disabled=isPaused||submitted;updateKeypadState();}

  function renderSummary(){var total=aggregate();document.getElementById("summaryMastery").textContent=(total.practiced?Math.round(total.masteryTotal/total.practiced):0)+"%";document.getElementById("summaryAccuracy").textContent=(total.attempts?Math.round(100*total.correct/total.attempts):0)+"%";document.getElementById("summaryAttempts").textContent=total.attempts;}
  function renderCurrentMetrics(){if(!currentQuestion)return;var stat=getStat(currentQuestion.familyId,currentQuestion.level);document.getElementById("questionMastery").textContent=stat.mastery+"% "+t("practice.masterySuffix","mastery");document.getElementById("metricMastery").textContent=stat.mastery+"%";document.getElementById("metricAccuracy").textContent=(stat.attempts?Math.round(100*stat.correct/stat.attempts):0)+"%";document.getElementById("metricStreak").textContent=stat.streak;document.getElementById("metricAvgTime").textContent=stat.attempts?PracticeLabUI.formatSeconds(stat.totalMs/stat.attempts):"0s";}
  function renderPracticeControls(){var family=currentQuestion?familyById(currentQuestion.familyId):familyById(progress.manual.familyId);selectorController.render({familyId:family.id,level:currentQuestion?currentQuestion.level:progress.manual.level});document.getElementById("adaptiveModeBtn").classList.toggle("secondary-active",progress.settings.adaptive);document.getElementById("manualModeBtn").classList.toggle("secondary-active",!progress.settings.adaptive);}
  function setManualSelection(familyId,level){progress.manual.familyId=familyById(familyId).id;progress.manual.level=Math.max(1,Math.min(5,Number(level)||1));progress.settings.adaptive=false;saveProgress();startQuestion();}
  function renderMatrix(){var container=document.getElementById("matrix");container.replaceChildren();var table=document.createElement("table"),head=document.createElement("thead"),headRow=document.createElement("tr");[t("practice.family","Family")].concat(LEVELS.map(function(level){return "L"+level;})).forEach(function(label){var th=document.createElement("th");th.textContent=label;headRow.appendChild(th);});head.appendChild(headRow);table.appendChild(head);var body=document.createElement("tbody");CATEGORIES.forEach(function(category){var categoryRow=document.createElement("tr"),categoryCell=document.createElement("th");categoryCell.colSpan=6;categoryCell.textContent=category.title;categoryRow.appendChild(categoryCell);body.appendChild(categoryRow);FAMILIES.filter(function(family){return family.categoryId===category.id;}).forEach(function(family){var row=document.createElement("tr"),name=document.createElement("td");name.textContent=family.title;row.appendChild(name);LEVELS.forEach(function(level){var stat=getStat(family.id,level),cell=document.createElement("td"),button=document.createElement("button");button.type="button";button.className="level-button "+(stat.mastery>=80?"ready":stat.attempts?"weak":"");button.dataset.familyId=family.id;button.dataset.level=level;button.innerHTML="L"+level+"<br><span>"+stat.mastery+"% · "+stat.attempts+"</span>";cell.appendChild(button);row.appendChild(cell);});body.appendChild(row);});});table.appendChild(body);container.appendChild(table);}
  function renderStats(){var total=aggregate();document.getElementById("statTotalAttempts").textContent=total.attempts;document.getElementById("statTotalCorrect").textContent=total.correct;document.getElementById("statTotalTime").textContent=PracticeLabUI.formatMinutes(total.totalMs);document.getElementById("statActiveCells").textContent=total.practiced;var cells=Object.keys(progress.stats).map(function(key){var parts=key.split(":"),family=FAMILIES.find(function(item){return item.id===parts[0];});return family?{family:family,level:Number(parts[1]),stat:progress.stats[key]}:null;}).filter(function(cell){return cell&&cell.stat.attempts;});cells.sort(function(a,b){return a.stat.mastery-b.stat.mastery;});function fill(id,selected){var container=document.getElementById(id);container.replaceChildren();if(!selected.length){var empty=document.createElement("p");empty.textContent=t("stats.noAttemptsYet","No attempts yet");container.appendChild(empty);return;}selected.forEach(function(cell){var button=document.createElement("button");button.type="button";button.dataset.familyId=cell.family.id;button.dataset.level=cell.level;button.textContent=cell.family.title+" · L"+cell.level+" · "+cell.stat.mastery+"% ("+cell.stat.attempts+" "+t("stats.tries","tries")+")";container.appendChild(button);});}fill("weakList",cells.slice(0,8));fill("strongList",cells.slice().reverse().slice(0,8));}
  function renderSettings(){var container=document.getElementById("enabledCategories");container.replaceChildren();CATEGORIES.forEach(function(category){var row=document.createElement("div");row.className="check-row";var label=document.createElement("label"),input=document.createElement("input"),span=document.createElement("span");input.type="checkbox";input.checked=progress.settings.enabled[category.id]!==false;input.dataset.categoryId=category.id;span.textContent=category.title;label.appendChild(input);label.appendChild(span);row.appendChild(label);container.appendChild(row);});}
  function renderLearn(){var container=document.getElementById("learnGrid");container.replaceChildren();FAMILIES.forEach(function(family){var card=document.createElement("article");card.id="learn-"+family.id;card.className="learn-card"+(learnSpotlightId===family.id?" spotlight":"");var heading=document.createElement("h3");heading.textContent=family.title;var concept=document.createElement("p");concept.textContent=family.learn.concept;var rules=document.createElement("p");rules.textContent=family.learn.rules;var example=document.createElement("code");example.textContent=family.learn.example;card.appendChild(heading);card.appendChild(concept);card.appendChild(rules);card.appendChild(example);container.appendChild(card);});}
  function setView(view){progress.view=view;saveProgress();document.querySelectorAll(".view").forEach(function(element){element.classList.toggle("active",element.id==="view-"+view);});document.querySelectorAll("[data-view]").forEach(function(button){button.classList.toggle("active",button.dataset.view===view);});if(view==="matrix")renderMatrix();if(view==="stats")renderStats();if(view==="settings")renderSettings();if(view==="learn"){renderLearn();if(learnSpotlightId){var card=document.getElementById("learn-"+learnSpotlightId);if(card)card.scrollIntoView({block:"center"});}}if(view==="practice"&&!currentQuestion)startQuestion();}
  function renderAll(){renderSummary();renderPracticeControls();renderMatrix();renderStats();renderSettings();renderLearn();setView(progress.view);}

  function wireEvents(){
    selectorController=PracticeLabUI.createPracticeSelectors({categorySelect:document.getElementById("categorySelect"),familySelect:document.getElementById("familySelect"),levelSelect:document.getElementById("levelSelect"),categories:CATEGORIES,families:FAMILIES,levelLabel:function(level){return t("practice.level","Level")+" "+level;},onSelect:function(selection){setManualSelection(selection.familyId,selection.level);}});
    var editor=PracticeLabUI.createTextEditor(function(){return isPaused?null:activeAnswerInput;});
    keypadButtons=PracticeLabUI.renderInputGrid(document.getElementById("answerKeypad"),[
      [["7",editor.insert("7"),{id:"digit7"}],["8",editor.insert("8"),{id:"digit8"}],["9",editor.insert("9"),{id:"digit9"}],["+",editor.insert("+"),{id:"plus",variant:"function"}],[t("practice.delete","Del"),editor.backspace,{id:"delete",variant:"function"}]],
      [["4",editor.insert("4"),{id:"digit4"}],["5",editor.insert("5"),{id:"digit5"}],["6",editor.insert("6"),{id:"digit6"}],["−",editor.insert("-"),{id:"minus",variant:"function"}],[t("practice.clear","Clear"),editor.clear,{id:"clear",variant:"function"}]],
      [["1",editor.insert("1"),{id:"digit1"}],["2",editor.insert("2"),{id:"digit2"}],["3",editor.insert("3"),{id:"digit3"}],[",",editor.insert(","),{id:"comma",variant:"function"}],[t("practice.nextFieldShort","Field →"),selectNextInput,{id:"nextField",variant:"function",ariaLabel:t("practice.nextField","Next field")}]],
      [["0",editor.insert("0"),{id:"digit0"}],["(",editor.insert("("),{id:"open",variant:"function"}],[")",editor.insert(")"),{id:"close",variant:"function"}],[";",editor.insert(";"),{id:"semicolon",variant:"function"}],["^",editor.insert("^"),{id:"caret",variant:"function"}]],
      [["*",editor.insert("*"),{id:"star",variant:"function"}],["∅",editor.insert("{}"),{id:"emptySet",variant:"function",ariaLabel:"Empty set"}],["",function(){},{disabled:true,ariaLabel:"spacer"}],["",function(){},{disabled:true,ariaLabel:"spacer"}],[t("practice.check","Check"),function(){document.getElementById("answerForm").requestSubmit();},{id:"submit",variant:"primary"}]]
    ]);
    document.querySelectorAll("[data-view]").forEach(function(button){button.addEventListener("click",function(){setView(button.dataset.view);});});
    document.getElementById("adaptiveModeBtn").addEventListener("click",function(){progress.settings.adaptive=true;saveProgress();startQuestion();});
    document.getElementById("manualModeBtn").addEventListener("click",function(){progress.settings.adaptive=false;saveProgress();startQuestion();});
    document.getElementById("pauseBtn").addEventListener("click",pausePractice);document.getElementById("resumeBtn").addEventListener("click",resumePractice);
    document.getElementById("learnCurrentBtn").addEventListener("click",function(){if(!currentQuestion)return;learnSpotlightId=currentQuestion.familyId;setView("learn");});
    document.getElementById("answerForm").addEventListener("submit",submitAnswer);document.getElementById("nextBtn").addEventListener("click",startQuestion);document.getElementById("skipBtn").addEventListener("click",startQuestion);
    document.getElementById("matrix").addEventListener("click",function(event){var button=event.target.closest("[data-family-id][data-level]");if(button){setView("practice");setManualSelection(button.dataset.familyId,button.dataset.level);}});
    ["weakList","strongList"].forEach(function(id){document.getElementById(id).addEventListener("click",function(event){var button=event.target.closest("[data-family-id][data-level]");if(button){setView("practice");setManualSelection(button.dataset.familyId,button.dataset.level);}});});
    document.getElementById("enabledCategories").addEventListener("change",function(event){if(event.target.dataset.categoryId){progress.settings.enabled[event.target.dataset.categoryId]=event.target.checked;saveProgress();}});
    document.getElementById("exportBtn").addEventListener("click",function(){document.getElementById("dataBox").value=JSON.stringify(progress,null,2);});
    document.getElementById("copyBtn").addEventListener("click",function(){var box=document.getElementById("dataBox");if(!box.value)box.value=JSON.stringify(progress,null,2);PracticeLabUI.copyText(box.value);});
    document.getElementById("importBtn").addEventListener("click",function(){try{progress=mergeProgress(JSON.parse(document.getElementById("dataBox").value));saveProgress();currentQuestion=null;renderAll();}catch(error){document.getElementById("dataBox").value=t("messages.invalidJson","Invalid JSON")+": "+error.message;}});
    document.getElementById("resetBtn").addEventListener("click",function(){if(window.confirm(t("messages.resetConfirm","Reset all local progress?"))){progress=defaultProgress();saveProgress();currentQuestion=null;renderAll();}});
    document.addEventListener("keydown",function(event){if(event.key==="Enter"&&submitted&&progress.view==="practice"){event.preventDefault();startQuestion();}});
  }

  function runSelfTests(){var failures=[];function assert(name,condition){if(!condition)failures.push(name);}
    assert("nine categories",CATEGORIES.length===9);assert("65 families",FAMILIES.length===65);assert("65 generators",Object.keys(GENERATORS).length===65);assert("unique family ids",new Set(FAMILIES.map(function(family){return family.id;})).size===65);
    if(TEXT.localeCode==="sv"){assert("Swedish category coverage",CATEGORIES.every(function(category){return TEXT.categories&&TEXT.categories[category.id];}));assert("Swedish family coverage",FAMILIES.every(function(family){return TEXT.families&&TEXT.families[family.id]&&TEXT.families[family.id].title&&TEXT.families[family.id].rules&&TEXT.families[family.id].example;}));}
    assert("negative Euclidean remainder",divmod(-17n,5n).q===-4n&&divmod(-17n,5n).r===3n);assert("zero conventions",gcd(0n,0n)===0n&&lcm(0n,0n)===0n);assert("prime boundary",!isPrime(-7n)&&!isPrime(0n)&&!isPrime(1n)&&isPrime(2n));
    assert("factor functions",factorText(factorize(756n))==="2^2 * 3^3 * 7"&&tau(12n)===6n&&sigma(18n)===39n&&phi(12n)===4n);
    assert("extended gcd",(function(){var e=egcd(99n,78n);return 99n*e.x+78n*e.y===e.g&&e.g===3n;})());
    assert("modular landmarks",mod(-23n,7n)===5n&&powmod(2n,100n,7n)===2n&&inverse(17n,43n)===38n&&order(2n,7n)===3n);
    assert("linear solutions",solveLinear(6n,9n,15n).map(String).join(",")==="4,9,14");var crt=crtMerge(1n,4n,3n,6n);assert("general CRT",crt&&crt.r===9n&&crt.m===12n&&!crtMerge(1n,4n,2n,6n));
    for(var i=0;i<1000;i+=1){var ar=BigInt((i*7919)%2001-1000),mm=BigInt(i%97+2),dm=divmod(ar,mm);assert("divmod property "+i,ar===dm.q*mm+dm.r&&dm.r>=0n&&dm.r<mm);}
    var englishLeakPattern=/\b(?:the|this|which|what|use|find|compute|return|enter|choose|does|with|without|from|then|after|before|only|every|all|any|must|can|has|have|is|are|not|into|by|for|when|exact|solution|result|gives|means|divides|integer|residue|modulus|base|power|powers|cycle|check|digit|values|roots|valid|invalid|defined|undefined|answer|step|remaining|displayed|shown|least|greatest|common|multiple|positive|negative|nonzero|pair|count|target|difference|factorization|times|works|none|direct|encode|decode|public|private|key|insecure|prime|require|and|therefore|next|sum|stated|lifting)\b/i;
    FAMILIES.forEach(function(family,familyIndex){LEVELS.forEach(function(level){for(var sample=0;sample<40;sample+=1){try{var seed=((familyIndex+1)*100000+level*1000+sample+1)>>>0,item=generateQuestion(family.id,level,seed,true),checked=checkQuestion(item.canonicalAnswer,item);assert("canonical "+family.id+":"+level+":"+sample,checked.correct);assert("metadata "+family.id,item.oracleVersion===ORACLE_VERSION&&item.familyId===family.id&&item.level===level);if(TEXT.localeCode==="sv"){var localizedText=[item.prompt.title].concat(item.prompt.rows,[item.prompt.note,item.explanation],item.fields.map(function(field){return field.label;}),item.fields.reduce(function(labels,field){return labels.concat((field.options||[]).map(function(option){return option.label;}));},[])).join(" ");assert("Swedish generated text "+family.id+":"+level+":"+sample,!englishLeakPattern.test(localizedText));}}catch(error){failures.push("generator "+family.id+":"+level+":"+sample+" "+error.message);}}});});
    if(failures.length){console.error("Number theory self-tests failed",failures.slice(0,100),"total",failures.length);return {ok:false,failures:failures.slice(0,100)};}console.info("Number theory self-tests passed: 65 families, exact BigInt oracles, semantic certificates, 13,000 generated instances");return {ok:true,failures:[]};
  }

  function init(){progress=loadProgress();rng=new Rng((Date.now()^Math.floor(Math.random()*0xFFFFFFFF))>>>0);wireEvents();startQuestion();renderAll();}
  window.runSelfTests=runSelfTests;
  window.NumberTheoryPractice={oracleVersion:ORACLE_VERSION,categories:CATEGORIES,families:FAMILIES,generateQuestion:generateQuestion,checkQuestion:checkQuestion,runSelfTests:runSelfTests,oracles:{mod:mod,divmod:divmod,gcd:gcd,lcm:lcm,egcd:egcd,inverse:inverse,powmod:powmod,isPrime:isPrime,factorize:factorize,divisors:divisors,tau:tau,sigma:sigma,phi:phi,order:order,solveLinear:solveLinear,crtMerge:crtMerge}};
  document.addEventListener("DOMContentLoaded",init);
}());
