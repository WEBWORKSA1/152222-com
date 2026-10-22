/* 152222 Number Lab — number engine. Pure functions, no network. */
(function (g) {
  "use strict";
  var N = {};

  N.clean = function (s) { return String(s == null ? "" : s).replace(/[^0-9]/g, ""); };
  N.digits = function (s) { return N.clean(s).split("").map(Number); };
  N.sum = function (s) { return N.digits(s).reduce(function (a, b) { return a + b; }, 0); };

  /* Reduce with steps; keeps master numbers 11/22/33 when keepMaster. */
  N.reduce = function (n, keepMaster) {
    var steps = [], x = n;
    while (x > 9 && !(keepMaster && (x === 11 || x === 22 || x === 33))) {
      var d = String(x).split("").map(Number), s = d.reduce(function (a, b) { return a + b; }, 0);
      steps.push(d.join(" + ") + " = " + s); x = s;
    }
    return { value: x, steps: steps };
  };
  N.root = function (s) { var t = N.sum(s); return { total: t, root: N.reduce(t).value, steps: [N.digits(s).join(" + ") + " = " + t].concat(N.reduce(t).steps) }; };

  /* ---------- maths ---------- */
  N.factor = function (n) {
    var f = [], m = n, d;
    if (n < 2) return f;
    while (m % 2 === 0) { f.push(2); m /= 2; }
    for (d = 3; d * d <= m && d < 2e7; d += 2) { while (m % d === 0) { f.push(d); m /= d; } }
    if (m > 1) f.push(m);
    return f;
  };
  N.isPrime = function (n) { if (n < 2 || !Number.isSafeInteger(n)) return false; var f = N.factor(n); return f.length === 1; };
  N.factorString = function (n) {
    var f = N.factor(n), c = {}, out = [];
    f.forEach(function (p) { c[p] = (c[p] || 0) + 1; });
    Object.keys(c).sort(function (a, b) { return a - b; }).forEach(function (p) { out.push(c[p] > 1 ? p + "^" + c[p] : p); });
    return out.join(" × ") || String(n);
  };
  N.divisors = function (n) {
    if (n < 1) return { count: 0, sum: 0, list: [] };
    var f = N.factor(n), c = {}, list = [1];
    f.forEach(function (p) { c[p] = (c[p] || 0) + 1; });
    Object.keys(c).forEach(function (p) {
      p = Number(p); var add = [], pw = 1;
      for (var e = 1; e <= c[p]; e++) { pw *= p; list.forEach(function (x) { add.push(x * pw); }); }
      list = list.concat(add);
    });
    list.sort(function (a, b) { return a - b; });
    return { count: list.length, sum: list.reduce(function (a, b) { return a + b; }, 0), list: list };
  };
  N.isSquare = function (n) { var r = Math.round(Math.sqrt(n)); return r * r === n; };
  N.isCube = function (n) { var r = Math.round(Math.cbrt(n)); return r * r * r === n; };
  N.isTriangular = function (n) { return N.isSquare(8 * n + 1); };
  N.isFib = function (n) { return N.isSquare(5 * n * n + 4) || N.isSquare(5 * n * n - 4); };
  N.isPal = function (s) { s = N.clean(s); return s.length > 1 && s === s.split("").reverse().join(""); };
  N.roman = function (n) {
    if (n < 1 || n > 3999) return "—";
    var m = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]], o = "";
    m.forEach(function (p) { while (n >= p[0]) { o += p[1]; n -= p[0]; } }); return o;
  };
  var ones = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
  var tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  function under1000(n) {
    var o = [];
    if (n >= 100) { o.push(ones[Math.floor(n / 100)] + " hundred"); n %= 100; }
    if (n >= 20) { o.push(tens[Math.floor(n / 10)] + (n % 10 ? "-" + ones[n % 10] : "")); }
    else if (n > 0 || !o.length) o.push(ones[n]);
    return o.join(" ");
  }
  N.words = function (n) {
    if (!Number.isSafeInteger(n)) return "—"; if (n === 0) return "zero";
    var units = [[1e15,"quadrillion"],[1e12,"trillion"],[1e9,"billion"],[1e6,"million"],[1e3,"thousand"]], o = [];
    units.forEach(function (u) { if (n >= u[0]) { o.push(under1000(Math.floor(n / u[0])) + " " + u[1]); n %= u[0]; } });
    if (n > 0) o.push(under1000(n)); return o.join(" ");
  };
  N.wordsIndian = function (n) {
    if (!Number.isSafeInteger(n)) return "—"; if (n === 0) return "zero";
    var units = [[1e7,"crore"],[1e5,"lakh"],[1e3,"thousand"]], o = [];
    if (n >= 1e7) { o.push(N.wordsIndian(Math.floor(n / 1e7)) + " crore"); n %= 1e7; }
    units.slice(1).forEach(function (u) { if (n >= u[0]) { o.push(under1000(Math.floor(n / u[0])) + " " + u[1]); n %= u[0]; } });
    if (n > 0) o.push(under1000(n)); return o.join(" ");
  };
  N.indianFormat = function (n) { return Number(n).toLocaleString("en-IN"); };
  N.intlFormat = function (n) { return Number(n).toLocaleString("en-US"); };

  N.math = function (s) {
    var str = N.clean(s), n = Number(str), safe = Number.isSafeInteger(n) && str.length <= 15;
    var r = { str: str, n: n, safe: safe, length: str.length, digitSum: N.sum(str) };
    if (!safe || n === 0) return r;
    var dv = N.divisors(n), proper = dv.sum - n;
    r.prime = N.isPrime(n); r.factors = N.factorString(n); r.divCount = dv.count; r.divisors = dv.list.length <= 48 ? dv.list : null;
    r.properSum = proper; r.kind = proper === n ? "perfect" : proper > n ? "abundant" : "deficient";
    r.even = n % 2 === 0; r.square = N.isSquare(n); r.cube = N.isCube(n); r.triangular = N.isTriangular(n);
    r.fib = n < 4e7 ? N.isFib(n) : null;
    r.square = n < 9e15 && r.square; r.triangular = n < 1e15 && r.triangular; r.palindrome = N.isPal(str);
    r.bin = n.toString(2); r.oct = n.toString(8); r.hex = n.toString(16).toUpperCase(); r.roman = N.roman(n);
    r.sqrt = Math.sqrt(n); r.words = N.words(n); r.wordsIn = N.wordsIndian(n); r.reverse = str.split("").reverse().join("");
    r.digitProduct = N.digits(str).reduce(function (a, b) { return a * b; }, 1);
    return r;
  };

  /* ---------- patterns ---------- */
  N.patterns = function (s) {
    var d = N.clean(s), out = [], i;
    if (!d) return out;
    var counts = {}; d.split("").forEach(function (c) { counts[c] = (counts[c] || 0) + 1; });
    var distinct = Object.keys(counts).length;
    var run = 1, best = 1, bestDigit = d[0];
    for (i = 1; i < d.length; i++) { if (d[i] === d[i - 1]) { run++; if (run > best) { best = run; bestDigit = d[i]; } } else run = 1; }
    if (best >= 3) out.push({ t: "Repeating run", v: bestDigit.repeat(best), w: best >= 5 ? 30 : best === 4 ? 22 : 12 });
    if (/^(\d)\1+$/.test(d)) out.push({ t: "Repdigit (all same)", v: d, w: 40 });
    var asc = "0123456789012", desc = "9876543210987", seqLen = 0;
    for (var L = Math.min(d.length, 10); L >= 4; L--) {
      for (i = 0; i + L <= d.length; i++) { var sub = d.substr(i, L); if (asc.indexOf(sub) > -1 || desc.indexOf(sub) > -1) { seqLen = L; out.push({ t: "Straight sequence", v: sub, w: L >= 6 ? 26 : L === 5 ? 18 : 10 }); break; } }
      if (seqLen) break;
    }
    if (d.length >= 4 && N.isPal(d)) out.push({ t: "Mirror / palindrome", v: d, w: 20 });
    var m = d.match(/(\d{2,4})\1+/); if (m && m[0].length >= 4) out.push({ t: "Repeating block", v: m[0], w: m[0].length >= 6 ? 20 : 12 });
    if (/(\d)\1{2,}$/.test(d)) out.push({ t: "Strong ending", v: d.match(/(\d)\1{2,}$/)[0], w: 14 });
    if (/0{2,}$/.test(d)) out.push({ t: "Round ending", v: d.match(/0{2,}$/)[0], w: 10 });
    if (/786/.test(d)) out.push({ t: "Contains 786 (popular in South Asia)", v: "786", w: 6 });
    if (/(?:^|[^8])8{2,}/.test(d) || /888/.test(d)) out.push({ t: "Prosperity 8s", v: "8s", w: 6 });
    out.distinct = distinct; out.counts = counts;
    return out;
  };

  /* VIP / memorability score 0-100 for phone-style numbers */
  N.vipScore = function (s) {
    var d = N.clean(s); if (d.length < 4) return null;
    var p = N.patterns(d), score = 20, reasons = [];
    p.forEach(function (x) { score += x.w; reasons.push(x.t + ": " + x.v); });
    var distinct = p.distinct;
    var dScore = Math.max(0, (10 - distinct) * 4); score += dScore;
    reasons.push(distinct + " distinct digits (fewer = easier to remember)");
    score = Math.max(5, Math.min(100, Math.round(score)));
    var tier = score >= 85 ? "Platinum" : score >= 70 ? "Gold" : score >= 50 ? "Silver" : "Standard";
    var label = score >= 70 ? "Strong" : score >= 50 ? "Balanced" : "Review";
    return { score: score, tier: tier, label: label, reasons: reasons, root: N.root(d) };
  };

  /* ---------- numerology ---------- */
  var PY = { a:1,j:1,s:1,b:2,k:2,t:2,c:3,l:3,u:3,d:4,m:4,v:4,e:5,n:5,w:5,f:6,o:6,x:6,g:7,p:7,y:7,h:8,q:8,z:8,i:9,r:9 };
  var CH = { a:1,i:1,j:1,q:1,y:1,b:2,k:2,r:2,c:3,g:3,l:3,s:3,d:4,m:4,t:4,e:5,h:5,n:5,x:5,u:6,v:6,w:6,o:7,z:7,f:8,p:8 };
  N.nameNumbers = function (name, system) {
    var map = system === "chaldean" ? CH : PY, letters = String(name || "").toLowerCase().replace(/[^a-z]/g, "").split("");
    var vow = "aeiou", tot = 0, v = 0, c = 0, rows = [];
    letters.forEach(function (ch) { var x = map[ch] || 0; tot += x; if (vow.indexOf(ch) > -1) v += x; else c += x; rows.push(ch.toUpperCase() + "=" + x); });
    return { letters: rows, total: tot, expression: N.reduce(tot, true), soul: N.reduce(v, true), personality: N.reduce(c, true), compound: tot };
  };
  N.lifePath = function (iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ""); if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    var ry = N.reduce(N.sum(m[1]), true).value, rm = N.reduce(mo, true).value, rd = N.reduce(d, true).value;
    var lp = N.reduce(ry + rm + rd, true);
    var mulank = N.reduce(d).value;
    var bhagyank = N.reduce(N.sum(m[1] + m[2] + m[3])).value;
    var now = new Date(), py = N.reduce(rd + rm + N.reduce(N.sum(String(now.getFullYear()))).value).value;
    return { lifePath: lp.value, steps: ["Year " + y + " → " + ry, "Month " + mo + " → " + rm, "Day " + d + " → " + rd, ry + " + " + rm + " + " + rd + " = " + (ry + rm + rd)].concat(lp.steps), mulank: mulank, bhagyank: bhagyank, personalYear: py, day: d, month: mo, year: y };
  };
  /* Lo Shu grid from DOB digits */
  N.loShu = function (iso) {
    var d = N.clean(iso), counts = {}; d.split("").forEach(function (c) { if (c !== "0") counts[c] = (counts[c] || 0) + 1; });
    var layout = [[4,9,2],[3,5,7],[8,1,6]], missing = [];
    for (var i = 1; i <= 9; i++) if (!counts[i]) missing.push(i);
    return { layout: layout, counts: counts, missing: missing };
  };

  N.meaning = {
    0: { k: "Potential", d: "Wholeness and a blank slate — the number of beginnings that have not yet taken a direction.", planet: "—" },
    1: { k: "Leadership", d: "Independence, initiative and drive. Traditionally linked with new starts and self-made success.", planet: "Sun" },
    2: { k: "Partnership", d: "Balance, diplomacy and cooperation. The number most associated with relationships and teamwork.", planet: "Moon" },
    3: { k: "Expression", d: "Creativity, communication and optimism. Popular for creative brands and social roles.", planet: "Jupiter" },
    4: { k: "Structure", d: "Discipline, systems and hard work. Stable, practical, sometimes rigid.", planet: "Rahu" },
    5: { k: "Freedom", d: "Change, travel, trade and adaptability. Often favoured for sales and commerce.", planet: "Mercury" },
    6: { k: "Care", d: "Home, responsibility, beauty and service. Associated with family and hospitality.", planet: "Venus" },
    7: { k: "Insight", d: "Analysis, research and introspection. The seeker's number.", planet: "Ketu" },
    8: { k: "Power", d: "Ambition, money and authority. Prized in Chinese culture for prosperity; treated with caution in some Vedic traditions.", planet: "Saturn" },
    9: { k: "Completion", d: "Compassion, endings and big-picture thinking. The humanitarian number.", planet: "Mars" },
    11: { k: "Master 11 · Intuition", d: "A master number in Western numerology: inspiration, sensitivity and vision.", planet: "—" },
    22: { k: "Master 22 · Builder", d: "The 'master builder': turning large visions into lasting structures.", planet: "—" },
    33: { k: "Master 33 · Teacher", d: "The master teacher: service, healing and guidance at scale.", planet: "—" }
  };
  /* Commonly cited Vedic friendly-number table (tradition, not science) */
  N.friendly = { 1:[1,2,3,5,9], 2:[1,2,3,5], 3:[1,2,3,5,7,9], 4:[1,5,6,7], 5:[1,2,3,5,6], 6:[4,5,6,8,9], 7:[1,3,4,5,6], 8:[4,5,6,8], 9:[1,3,5,6,9] };
  N.compat = function (a, b) {
    if (!a || !b) return null;
    if (a === b) return { level: "Same vibration", score: 80 };
    if ((N.friendly[a] || []).indexOf(b) > -1 && (N.friendly[b] || []).indexOf(a) > -1) return { level: "Friendly", score: 90 };
    if ((N.friendly[a] || []).indexOf(b) > -1 || (N.friendly[b] || []).indexOf(a) > -1) return { level: "Neutral-positive", score: 65 };
    return { level: "Neutral", score: 45 };
  };

  /* Angel / repeating-number reading */
  N.angel = function (s) {
    var d = N.clean(s); if (!d) return null;
    var counts = {}; d.split("").forEach(function (c) { counts[c] = (counts[c] || 0) + 1; });
    var dom = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
    var r = N.reduce(N.sum(d), true).value;
    var themes = { 0:"wholeness and fresh potential",1:"new beginnings and taking the lead",2:"balance, patience and partnership",3:"creativity and self-expression",4:"stability and steady effort",5:"change and movement",6:"home, care and responsibility",7:"reflection and learning",8:"abundance, money and authority",9:"completion and letting go" };
    return { dominant: dom, dominantTheme: themes[dom], root: r, rootTheme: (N.meaning[r] || {}).k, text: "In angel-number traditions, " + d + " is read through its strongest digit (" + dom + " — " + themes[dom] + ") and its root (" + r + " — " + ((N.meaning[r] || {}).k || "").toLowerCase() + "). Readers treat it as a prompt for reflection rather than a prediction." };
  };

  /* ---------- codes ---------- */
  N.pinRegion = {
    "11":"Delhi","12":"Haryana","13":"Haryana","14":"Punjab","15":"Punjab","16":"Punjab / Chandigarh","17":"Himachal Pradesh","18":"Jammu & Kashmir / Ladakh","19":"Jammu & Kashmir / Ladakh",
    "20":"Uttar Pradesh","21":"Uttar Pradesh","22":"Uttar Pradesh","23":"Uttar Pradesh","24":"Uttar Pradesh / Uttarakhand","25":"Uttar Pradesh","26":"Uttar Pradesh / Uttarakhand","27":"Uttar Pradesh","28":"Uttar Pradesh",
    "30":"Rajasthan","31":"Rajasthan","32":"Rajasthan","33":"Rajasthan","34":"Rajasthan","36":"Gujarat","37":"Gujarat","38":"Gujarat","39":"Gujarat / Dadra & Nagar Haveli and Daman & Diu",
    "40":"Maharashtra / Goa","41":"Maharashtra","42":"Maharashtra","43":"Maharashtra","44":"Maharashtra","45":"Madhya Pradesh","46":"Madhya Pradesh","47":"Madhya Pradesh","48":"Madhya Pradesh","49":"Chhattisgarh",
    "50":"Telangana","51":"Andhra Pradesh","52":"Andhra Pradesh","53":"Andhra Pradesh","56":"Karnataka","57":"Karnataka","58":"Karnataka","59":"Karnataka",
    "60":"Tamil Nadu / Puducherry","61":"Tamil Nadu","62":"Tamil Nadu","63":"Tamil Nadu","64":"Tamil Nadu","67":"Kerala","68":"Kerala","69":"Kerala / Lakshadweep",
    "70":"West Bengal","71":"West Bengal","72":"West Bengal","73":"West Bengal / Sikkim","74":"West Bengal / Andaman & Nicobar","75":"Odisha","76":"Odisha","77":"Odisha","78":"Assam","79":"North-East states",
    "80":"Bihar","81":"Bihar / Jharkhand","82":"Bihar / Jharkhand","83":"Jharkhand","84":"Bihar","85":"Bihar"
  };
  N.pinZone = { 1:"North (Delhi, Haryana, Punjab, Himachal, J&K, Chandigarh)",2:"North (Uttar Pradesh, Uttarakhand)",3:"West (Rajasthan, Gujarat)",4:"West (Maharashtra, Goa, Madhya Pradesh, Chhattisgarh)",5:"South (Telangana, Andhra Pradesh, Karnataka)",6:"South (Tamil Nadu, Kerala, Puducherry)",7:"East (West Bengal, Odisha, North-East)",8:"East (Bihar, Jharkhand)",9:"Army Postal Service / Field Post Office" };
  N.pin = function (s) {
    var d = N.clean(s); if (d.length !== 6 || d[0] === "0") return null;
    return { zone: N.pinZone[d[0]], circle: N.pinRegion[d.substr(0, 2)] || (d[0] === "9" ? "Army Postal Service" : "Unassigned / special range"), sorting: d.substr(0, 3), office: d.substr(3) };
  };
  N.zipZone = { 0:"Connecticut, Massachusetts, Maine, New Hampshire, New Jersey, Rhode Island, Vermont, Puerto Rico, US Virgin Islands, military (AE)",1:"Delaware, New York, Pennsylvania",2:"DC, Maryland, North Carolina, South Carolina, Virginia, West Virginia",3:"Alabama, Florida, Georgia, Mississippi, Tennessee, military (AA)",4:"Indiana, Kentucky, Michigan, Ohio",5:"Iowa, Minnesota, Montana, North Dakota, South Dakota, Wisconsin",6:"Illinois, Kansas, Missouri, Nebraska",7:"Arkansas, Louisiana, Oklahoma, Texas",8:"Arizona, Colorado, Idaho, New Mexico, Nevada, Utah, Wyoming",9:"Alaska, California, Hawaii, Oregon, Washington, Pacific territories, military (AP)" };
  N.zip = function (s) { var d = N.clean(s); if (d.length < 5) return null; d = d.substr(0, 5); return { zone: N.zipZone[d[0]], scf: d.substr(0, 3), zip: d }; };

  /* Time and date readings of a 6-digit string */
  N.timeDate = function (s) {
    var d = N.clean(s), out = [];
    if (d.length === 6) {
      var hh = +d.substr(0, 2), mm = +d.substr(2, 2), ss = +d.substr(4, 2);
      if (hh < 24 && mm < 60 && ss < 60) out.push({ t: "As a time (HH:MM:SS)", v: d.substr(0, 2) + ":" + d.substr(2, 2) + ":" + d.substr(4, 2) });
      var dd = +d.substr(0, 2), mo = +d.substr(2, 2), yy = +d.substr(4, 2);
      var dt = new Date(2000 + yy, mo - 1, dd);
      if (mo >= 1 && mo <= 12 && dt.getDate() === dd) out.push({ t: "As a date (DD/MM/YY)", v: d.substr(0, 2) + "/" + d.substr(2, 2) + "/20" + d.substr(4, 2) + " · " + dt.toLocaleDateString("en-GB", { weekday: "long" }) });
      var d1 = +d.substr(0, 1), m1 = +d.substr(1, 1), y4 = +d.substr(2, 4);
      var dt2 = new Date(y4, m1 - 1, d1);
      if (m1 >= 1 && dt2.getDate() === d1) out.push({ t: "As a date (D/M/YYYY)", v: d1 + "/" + m1 + "/" + y4 });
    }
    if (d.length === 4) { var h = +d.substr(0, 2), mi = +d.substr(2, 2); if (h < 24 && mi < 60) out.push({ t: "As a clock time", v: d.substr(0, 2) + ":" + d.substr(2, 2) }); if (+d >= 1000 && +d <= 2999) out.push({ t: "As a year", v: d + (+d < 2026 ? " (past)" : +d === 2026 ? " (this year)" : " (future)") }); }
    return out;
  };

  /* Seeded daily number */
  N.daily = function (date) {
    var t = date || new Date(), seed = t.getFullYear() * 10000 + (t.getMonth() + 1) * 100 + t.getDate();
    var x = Math.sin(seed) * 10000; x = x - Math.floor(x);
    return 100 + Math.floor(x * 99900);
  };

  g.N = N;
})(window);
