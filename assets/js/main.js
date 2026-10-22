/* 152222 Number Lab — UI behaviour */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var base = (function () { var s = $('script[src*="assets/js/main.js"]'); return s ? s.getAttribute("src").replace(/assets\/js\/main\.js.*$/, "") : "/"; })();
  var N = window.N;

  /* year */
  $$("[data-year]").forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* menu */
  var mb = $(".menu-btn"), nav = $("#nav");
  if (mb && nav) mb.addEventListener("click", function () { var o = nav.classList.toggle("open"); mb.setAttribute("aria-expanded", o); });

  /* cookie notice */
  var ck = $(".cookie");
  try { if (ck && !localStorage.getItem("ck152222")) ck.classList.add("show"); } catch (e) { if (ck) ck.classList.add("show"); }
  $$("[data-cookie]").forEach(function (b) { b.addEventListener("click", function () { try { localStorage.setItem("ck152222", b.dataset.cookie); } catch (e) {} ck.classList.remove("show"); }); });

  /* sticky CTA after scroll */
  var st = $(".sticky-cta");
  if (st) window.addEventListener("scroll", function () { st.classList.toggle("show", window.scrollY > 600); }, { passive: true });

  /* ---------- form relay ---------- */
  function relay() {
    var k = (window.SITE && window.SITE._k) || [];
    try { var a = atob(k[0]).split("").reverse().join(""), b = atob(k[1]).split("").reverse().join(""); return "https://formsubmit.co/ajax/" + a + "@" + b; } catch (e) { return ""; }
  }
  function sendForm(form) {
    var msg = $(".form-msg", form), btn = $('button[type="submit"]', form);
    if ($('[name="_hp"]', form) && $('[name="_hp"]', form).value) return;
    var data = {}; new FormData(form).forEach(function (v, k) { if (k === "_hp") return; data[k] = data[k] ? data[k] + ", " + v : v; });
    data._subject = "152222.com — " + (data.form || "Form") + (data.name ? " — " + data.name : "");
    data._template = "table"; data._captcha = "false"; data.page = location.href;
    if (btn) { btn.disabled = true; btn.dataset.t = btn.textContent; btn.textContent = "Sending…"; }
    if (msg) { msg.className = "form-msg"; msg.textContent = ""; }
    fetch(relay(), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function () {
        if (form.dataset.redirect) { location.href = base + form.dataset.redirect; return; }
        if (msg) { msg.className = "form-msg ok"; msg.textContent = form.dataset.ok || "Thanks — received. We reply within 1–2 business days."; }
        form.reset(); resetSteps(form);
      })
      .catch(function () { if (msg) { msg.className = "form-msg err"; msg.innerHTML = 'Could not send just now. Please try again, or use the <a href="https://web.works/contact" target="_blank" rel="noopener">contact page</a>.'; } })
      .finally(function () { if (btn) { btn.disabled = false; btn.textContent = btn.dataset.t; } });
  }
  $$("form[data-form]").forEach(function (f) { f.addEventListener("submit", function (e) { e.preventDefault(); if (!f.checkValidity()) { f.reportValidity(); return; } sendForm(f); }); });

  /* multi-step forms */
  function showStep(form, i) {
    var steps = $$(".step", form); steps.forEach(function (s, j) { s.hidden = j !== i; });
    $$(".steps-bar i", form).forEach(function (b, j) { b.classList.toggle("on", j <= i); });
    form.dataset.step = i;
  }
  function resetSteps(form) { if ($(".step", form)) showStep(form, 0); }
  $$("form.multi").forEach(function (form) {
    showStep(form, 0);
    $$("[data-next]", form).forEach(function (b) { b.addEventListener("click", function () {
      var cur = $$(".step", form)[+form.dataset.step], bad = $$("input,select,textarea", cur).filter(function (x) { return !x.checkValidity(); });
      if (bad.length) { bad[0].reportValidity(); return; }
      showStep(form, +form.dataset.step + 1); form.scrollIntoView({ behavior: "smooth", block: "start" });
    }); });
    $$("[data-prev]", form).forEach(function (b) { b.addEventListener("click", function () { showStep(form, +form.dataset.step - 1); }); });
  });

  /* prefill report form from query (?for=mobile&n=...) */
  var qs = new URLSearchParams(location.search);
  $$("form[data-prefill]").forEach(function (f) {
    qs.forEach(function (v, k) { var el = f.elements[k]; if (!el) return; if (el.length && el[0] && el[0].type === "radio") { $$('[name="' + k + '"]', f).forEach(function (r) { if (r.value === v) r.checked = true; }); } else el.value = v; });
  });

  /* lazy YouTube */
  $$(".vid[data-id]").forEach(function (v) {
    var id = v.dataset.id;
    if (!$("img", v)) { var im = new Image(); im.loading = "lazy"; im.alt = v.dataset.title || "Video"; im.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg"; v.appendChild(im); }
    v.setAttribute("role", "button"); v.setAttribute("tabindex", "0"); v.setAttribute("aria-label", "Play: " + (v.dataset.title || "video"));
    var play = function () { if (v.classList.contains("on")) return; v.classList.add("on"); v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + esc(v.dataset.title || "Video") + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'; };
    v.addEventListener("click", play); v.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); } });
  });

  /* helpful feedback */
  $$("[data-helpful]").forEach(function (box) {
    $$("button", box).forEach(function (b) { b.addEventListener("click", function () { box.innerHTML = '<span class="muted">Thanks for the feedback.</span>'; try { localStorage.setItem("hf:" + location.pathname, b.value); } catch (e) {} }); });
  });

  /* copy buttons */
  $$("[data-copy]").forEach(function (b) { b.addEventListener("click", function () {
    var t = b.dataset.copy === "url" ? location.href : ($(b.dataset.copy) ? $(b.dataset.copy).value || $(b.dataset.copy).textContent : "");
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { var o = b.textContent; b.textContent = "Copied"; setTimeout(function () { b.textContent = o; }, 1400); }).catch(function () {});
  }); });

  /* ---------- helpers for tool output ---------- */
  function kv(rows) { return '<div class="kv">' + rows.filter(Boolean).map(function (r) { return "<div><div class=\"k\">" + esc(r[0]) + "</div><div class=\"v\">" + r[1] + "</div></div>"; }).join("") + "</div>"; }
  function yes(b) { return b === null || b === undefined ? "—" : b ? "Yes" : "No"; }
  function digitsHTML(s, hl) { return '<div class="digits">' + N.clean(s).split("").map(function (c) { return '<b' + (hl && hl.indexOf(c) > -1 ? ' class="r"' : "") + ">" + c + "</b>"; }).join("") + "</div>"; }
  function meaningCard(n, title) {
    var m = N.meaning[n] || {};
    return '<div class="callout"><p><strong>' + esc(title || "Root number") + " " + n + " · " + esc(m.k || "") + "</strong><br>" + esc(m.d || "") + (m.planet && m.planet !== "—" ? " <span class=\"muted\">(Vedic ruler: " + m.planet + ")</span>" : "") + "</p></div>";
  }
  function stepsHTML(steps) { return '<p class="mono muted" style="font-size:.9rem">' + steps.map(esc).join("<br>") + "</p>"; }
  function ring(v) { return '<div class="ring" style="--p:' + v + '" data-v="' + v + '"></div>'; }
  function cta(type, val) {
    return '<div class="lead-box mt2"><h3 class="mt0">Want a human-reviewed version?</h3><p class="muted">Get a personal number report: best-fit mobile, vehicle, house or brand numbers matched to your date of birth and goals, with alternatives you can actually buy or register.</p><a class="btn btn-go" href="' + base + "report.html?for=" + encodeURIComponent(type) + "&number=" + encodeURIComponent(val || "") + '">Get my personal report →</a></div>';
  }
  function show(el, html) { el.innerHTML = html; el.hidden = false; el.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
  function shareHTML(url, text) {
    var u = encodeURIComponent(url), t = encodeURIComponent(text);
    return '<div class="share"><a class="btn btn-line btn-s" target="_blank" rel="noopener" href="https://wa.me/?text=' + t + "%20" + u + '">WhatsApp</a><a class="btn btn-line btn-s" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=' + t + "&url=" + u + '">X / Twitter</a><a class="btn btn-line btn-s" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + u + '">Facebook</a><a class="btn btn-line btn-s" target="_blank" rel="noopener" href="https://pinterest.com/pin/create/button/?url=' + u + "&description=" + t + '">Pinterest</a></div>';
  }

  /* ---------- home decoder + chips ---------- */
  $$("form[data-decode]").forEach(function (f) { f.addEventListener("submit", function (e) {
    e.preventDefault(); var v = N.clean(f.elements.n.value); if (!v) { f.elements.n.focus(); return; }
    location.href = base + "number.html?n=" + v;
  }); });

  /* daily number */
  $$("[data-daily]").forEach(function (el) { var n = N.daily(); el.innerHTML = '<a href="' + base + "number.html?n=" + n + '">' + n + "</a>"; });

  /* ---------- full number report ---------- */
  var rep = $("#report");
  if (rep) {
    var input = $("#rep-n"), n0 = N.clean(qs.get("n") || "152222");
    if (input) input.value = n0;
    renderReport(n0);
    var rf = $("#rep-form"); if (rf) rf.addEventListener("submit", function (e) { e.preventDefault(); var v = N.clean(input.value); if (!v) return; history.replaceState(null, "", "?n=" + v); renderReport(v); });
  }
  function renderReport(s) {
    if (!s) return;
    if (s.length > 40) s = s.substr(0, 40);
    document.title = s + " — meaning, maths & numerology | 152222 Number Lab";
    var m = N.math(s), root = N.root(s), ang = N.angel(s), pats = N.patterns(s), vip = N.vipScore(s), td = N.timeDate(s), pin = N.pin(s), zip = s.length === 5 ? N.zip(s) : null;
    var h = '<div class="card"><div class="panel-title"><h2 class="mt0 mb0">The number <span class="mono">' + esc(s) + '</span></h2><span class="tag">' + s.length + " digits</span></div>";
    h += digitsHTML(s);
    if (m.safe && m.n > 0) {
      h += '<p class="mt2">' + esc(m.words.charAt(0).toUpperCase() + m.words.slice(1)) + (m.n >= 100000 ? ' <span class="muted">· Indian system: ' + esc(m.wordsIn) + " · " + N.indianFormat(m.n) + "</span>" : "") + "</p>";
    }
    h += "</div>";
    if (m.safe && m.n > 0) {
      h += '<div class="card mt2"><div class="panel-title"><h3>Maths profile</h3><span class="muted mono">computed in your browser</span></div>' + kv([
        ["Prime?", m.prime ? "Yes — prime" : "No"], ["Prime factors", esc(m.factors)], ["Divisors", m.divCount], ["Sum of proper divisors", N.intlFormat(m.properSum)],
        ["Classification", m.kind], ["Even / odd", m.even ? "Even" : "Odd"], ["Digit sum", m.digitSum], ["Digit product", N.intlFormat(m.digitProduct)],
        ["Perfect square?", yes(m.square)], ["Perfect cube?", yes(m.cube)], ["Triangular?", yes(m.triangular)], ["Fibonacci?", yes(m.fib)],
        ["Palindrome?", yes(m.palindrome)], ["Reversed", esc(m.reverse)], ["Square root", m.sqrt.toFixed(4)], ["Roman numeral", m.roman],
        ["Binary", '<span style="font-size:.85rem">' + m.bin + "</span>"], ["Octal", m.oct], ["Hexadecimal", m.hex], ["Formatted", N.intlFormat(m.n)]
      ]);
      if (m.divisors) h += '<p class="muted" style="font-size:.9rem"><strong>All divisors:</strong> <span class="mono">' + m.divisors.join(", ") + "</span></p>";
      h += "</div>";
    } else if (!m.safe) {
      h += '<div class="card mt2"><p>That number is longer than 15 digits, so exact factoring is skipped. Pattern, numerology and code readings still apply.</p></div>';
    }
    h += '<div class="grid g2 mt2"><div class="card"><div class="panel-title"><h3>Numerology root</h3><span class="tag tag-hot">Root ' + root.root + "</span></div>" + stepsHTML(root.steps) + meaningCard(root.root) + "</div>";
    h += '<div class="card"><div class="panel-title"><h3>Angel-number reading</h3></div><p>' + esc(ang.text) + '</p><p><a href="' + base + 'angel-numbers.html">Browse the angel number library →</a></p></div></div>';
    if (vip) {
      h += '<div class="card mt2"><div class="panel-title"><h3>Pattern &amp; memorability score</h3><span class="tag">' + vip.tier + "</span></div><div class=\"score\">" + ring(vip.score) + '<ul class="ticks" style="flex:1;min-width:220px">' + vip.reasons.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul></div><p class=\"notice\">Higher scores mean a number is easier to remember and recall — the same signals VIP mobile number and numeric domain markets price on.</p></div>";
    }
    var codes = [];
    if (pin) codes.push(["As an Indian PIN code", "Zone: " + esc(pin.zone) + "<br>Postal circle: " + esc(pin.circle) + "<br>Sorting district: " + pin.sorting + " · Delivery office code: " + pin.office]);
    if (zip) codes.push(["As a US ZIP code", "Region: " + esc(zip.zone) + "<br>Sectional centre prefix: " + zip.scf]);
    if (s.length === 6 && N.clean(s).substr(0, 5)) { var z5 = N.zip(s.substr(0, 5)); if (z5) codes.push(["First five digits as a US ZIP", z5.zip + " — region: " + esc(z5.zone)]); }
    td.forEach(function (t) { codes.push([t.t, esc(t.v)]); });
    if (codes.length) h += '<div class="card mt2"><div class="panel-title"><h3>Codes, dates &amp; times</h3></div>' + kv(codes) + '<p class="notice">Code readings show what the digits would mean in each system. They do not confirm that a specific post office, ZIP or record exists — verify with India Post or USPS.</p></div>';
    var url = location.origin + location.pathname + "?n=" + s;
    h += '<div class="card mt2"><h3>Share this number</h3>' + shareHTML(url, "What does " + s + " mean? Maths, numerology & patterns:") +
      '<div class="row mt2"><a class="btn btn-ink btn-s" href="' + base + "number.html?n=" + (Number.isSafeInteger(m.n) && m.n > 0 ? m.n - 1 : s) + '">← ' + (m.n > 0 ? m.n - 1 : "") + '</a><a class="btn btn-ink btn-s" href="' + base + "number.html?n=" + (Number.isSafeInteger(m.n) ? m.n + 1 : s) + '">' + (Number.isSafeInteger(m.n) ? m.n + 1 : "") + " →</a></div></div>";
    h += cta("number", s);
    rep.innerHTML = h;
  }

  /* ---------- tools ---------- */
  var tools = {
    mobile: function (f, out) {
      var num = N.clean(f.elements.phone.value); if (num.length < 6) return alert("Enter at least 6 digits.");
      var last10 = num.length > 10 ? num.substr(-10) : num, r = N.root(last10), v = N.vipScore(last10), dob = f.elements.dob && f.elements.dob.value, lp = dob ? N.lifePath(dob) : null;
      var h = '<div class="card"><div class="panel-title"><h3>Mobile number ' + esc(last10) + '</h3><span class="tag tag-hot">' + (v ? v.label : "") + "</span></div>" + digitsHTML(last10);
      h += kv([["Total of digits", r.total], ["Root (single digit)", r.root], ["Vedic ruler", (N.meaning[r.root] || {}).planet || "—"], ["Pattern score", v ? v.score + "/100 · " + v.tier : "—"]]);
      h += stepsHTML(r.steps) + meaningCard(r.root, "Mobile number root");
      if (lp) {
        var c1 = N.compat(lp.mulank, r.root), c2 = N.compat(lp.bhagyank, r.root);
        h += '<h3 class="mt2">Match with your date of birth</h3>' + kv([["Your Mulank (root)", lp.mulank], ["Your Bhagyank (destiny)", lp.bhagyank], ["Mulank ↔ number", c1.level], ["Bhagyank ↔ number", c2.level]]);
        var avg = Math.round((c1.score + c2.score) / 2);
        h += '<div class="score">' + ring(avg) + '<p style="flex:1;min-width:220px">' + (avg >= 75 ? "<strong>Strong match.</strong> In the commonly used Vedic friendly-number table, this number's root sits well with your birth numbers." : avg >= 55 ? "<strong>Balanced.</strong> Neither strongly aligned nor in conflict under the traditional table." : "<strong>Review.</strong> If you follow numerology, practitioners would suggest a number whose total reduces to " + N.friendly[lp.mulank].join(", ") + ".") + "</p></div>";
      }
      h += '<p class="notice">Numerology is a cultural tradition, not a science. Use this for fun, curiosity or tie-breaking between numbers you already like.</p></div>' + cta("mobile", last10);
      show(out, h);
    },
    vip: function (f, out) {
      var num = N.clean(f.elements.num.value); if (num.length < 4) return alert("Enter at least 4 digits.");
      var v = N.vipScore(num), m = N.patterns(num);
      var h = '<div class="card"><div class="panel-title"><h3>' + esc(num) + '</h3><span class="tag tag-hot">' + v.tier + "</span></div>" + digitsHTML(num) + '<div class="score mt2">' + ring(v.score) + '<ul class="ticks" style="flex:1;min-width:220px">' + v.reasons.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul></div>";
      h += kv([["Tier", v.tier], ["Distinct digits", m.distinct], ["Digit total", v.root.total], ["Root", v.root.root]]);
      h += '<p class="notice">The score measures memorability signals (repeats, sequences, mirrors, few distinct digits). Market prices also depend on operator, circle, demand and the seller — this is not a valuation.</p></div>';
      h += '<div class="lead-box mt2"><h3 class="mt0">Want a number like this?</h3><p class="muted">Tell us the pattern and budget. We pass qualified requests to vetted number sellers and reply with what is available.</p><a class="btn btn-go" href="' + base + "report.html?for=vip&number=" + num + '">Request a VIP number →</a></div>';
      show(out, h);
    },
    lifepath: function (f, out) {
      var dob = f.elements.dob.value, lp = N.lifePath(dob); if (!lp) return alert("Pick your date of birth.");
      var ls = N.loShu(dob), grid = '<div class="tbl-wrap" style="max-width:260px"><table class="center">' + ls.layout.map(function (row) { return "<tr>" + row.map(function (c) { var k = ls.counts[c] || 0; return '<td class="num" style="text-align:center;height:58px;font-size:1.2rem;' + (k ? "" : "color:var(--line)") + '">' + (k ? String(c).repeat(k) : c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</table></div>";
      var h = '<div class="card"><div class="panel-title"><h3>Your core numbers</h3><span class="tag tag-hot">Life path ' + lp.lifePath + "</span></div>" + kv([["Life path", lp.lifePath], ["Mulank (birth day root)", lp.mulank], ["Bhagyank (destiny)", lp.bhagyank], ["Personal year " + new Date().getFullYear(), lp.personalYear], ["Friendly numbers", (N.friendly[lp.mulank] || []).join(", ")], ["Vedic ruler (Mulank)", (N.meaning[lp.mulank] || {}).planet]]);
      h += stepsHTML(lp.steps) + meaningCard(lp.lifePath, "Life path") + meaningCard(lp.mulank, "Mulank");
      h += '<h3 class="mt2">Lo Shu grid</h3><div class="split" style="gap:20px">' + grid + "<div><p><strong>Missing numbers:</strong> " + (ls.missing.length ? ls.missing.join(", ") : "none") + '</p><p class="muted">In Lo Shu practice, digits absent from your birth date are read as qualities to build. Practitioners often suggest adding them through a phone, vehicle or house number.</p></div></div>';
      h += '<p class="notice">For entertainment and self-reflection. Different schools calculate some of these numbers differently.</p></div>' + cta("birth", dob);
      show(out, h);
    },
    name: function (f, out) {
      var sys = (f.elements.system && f.elements.system.value) || "pythagorean";
      var names = $$('input[name^="name"]', f).map(function (i) { return i.value.trim(); }).filter(Boolean);
      if (!names.length) return alert("Enter a name.");
      var dob = f.elements.dob && f.elements.dob.value, lp = dob ? N.lifePath(dob) : null;
      var rows = names.map(function (nm) { var r = N.nameNumbers(nm, sys); var c = lp ? N.compat(lp.mulank, N.reduce(r.total).value) : null; return { nm: nm, r: r, c: c }; });
      var h = '<div class="card"><div class="panel-title"><h3>' + (sys === "chaldean" ? "Chaldean" : "Pythagorean") + ' results</h3></div><div class="tbl-wrap"><table><thead><tr><th>Name</th><th>Compound</th><th>Expression</th><th>Soul urge</th><th>Personality</th>' + (lp ? "<th>Fit with Mulank " + lp.mulank + "</th>" : "") + "</tr></thead><tbody>" +
        rows.map(function (x) { return "<tr><td><strong>" + esc(x.nm) + '</strong></td><td class="num">' + x.r.compound + '</td><td class="num">' + x.r.expression.value + '</td><td class="num">' + x.r.soul.value + '</td><td class="num">' + x.r.personality.value + "</td>" + (x.c ? "<td>" + x.c.level + "</td>" : "") + "</tr>"; }).join("") + "</tbody></table></div>";
      h += '<p class="mono muted mt2" style="font-size:.85rem">' + esc(rows[0].nm) + ": " + rows[0].r.letters.join(" · ") + "</p>" + meaningCard(rows[0].r.expression.value, "Expression of " + rows[0].nm);
      if (rows.length > 1) { var best = rows.slice().sort(function (a, b) { return (b.c ? b.c.score : 0) - (a.c ? a.c.score : 0); })[0]; if (lp) h += '<div class="callout"><p><strong>Best fit for you: ' + esc(best.nm) + "</strong> — " + best.c.level + " with your Mulank.</p></div>"; }
      h += '<p class="notice">Names and spellings are personal and legal decisions. Check trademark availability before adopting any business name.</p></div>' + cta("name", names[0]);
      show(out, h);
    },
    vehicle: function (f, out) {
      var plate = String(f.elements.plate.value || "").toUpperCase().replace(/\s+/g, " ").trim(); if (!plate) return alert("Enter a plate number.");
      var digitsOnly = N.clean(plate), m = /(\d+)\s*$/.exec(plate.replace(/[^A-Z0-9 ]/g, "")), tail = m ? m[1] : digitsOnly;
      var rTail = N.root(tail), rAll = N.root(digitsOnly), full = N.nameNumbers(plate.replace(/\d/g, ""), "chaldean").total + N.sum(digitsOnly), rFull = N.reduce(full).value;
      var dob = f.elements.dob && f.elements.dob.value, lp = dob ? N.lifePath(dob) : null;
      var h = '<div class="card"><div class="panel-title"><h3>' + esc(plate) + '</h3><span class="tag tag-hot">Root ' + rTail.root + "</span></div>" + kv([["Registration number (last block)", esc(tail)], ["Root of last block", rTail.root], ["Root of all digits", rAll.root], ["Root incl. letters (Chaldean)", rFull], lp ? ["Fit with your Mulank " + lp.mulank, N.compat(lp.mulank, rTail.root).level] : null]);
      h += stepsHTML(rTail.steps) + meaningCard(rTail.root, "Vehicle number");
      h += '<p class="notice">Most practitioners read the final numeric block; some include letters. Choosing a fancy registration is done through your transport authority (in India, the Parivahan fancy-number e-auction).</p></div>' + cta("vehicle", plate);
      show(out, h);
    },
    house: function (f, out) {
      var hn = String(f.elements.house.value || "").trim(); if (!hn) return alert("Enter a house or flat number.");
      var digits = N.clean(hn), letters = hn.replace(/[^A-Za-z]/g, ""), tot = N.sum(digits) + N.nameNumbers(letters, "pythagorean").total, r = N.reduce(tot);
      var homes = { 1:"Independent households, home offices, people starting out.",2:"Couples and calm, cooperative living.",3:"Social homes, creatives, frequent guests.",4:"Stable family homes; good for long-term roots.",5:"Busy, changing households; renters, travellers, traders.",6:"Family-centred, nurturing homes; children and pets.",7:"Quiet study, retreat and reflection.",8:"Ambition and business; often a home that doubles as a workplace.",9:"Generous, open-door homes; endings that make room for new starts." };
      var h = '<div class="card"><div class="panel-title"><h3>House ' + esc(hn) + '</h3><span class="tag tag-hot">Root ' + r.value + "</span></div>" + kv([["Digits", digits || "—"], ["Letter value", letters ? N.nameNumbers(letters).total : "—"], ["Total", tot], ["House number", r.value]]) + stepsHTML([(digits ? N.digits(digits).join(" + ") : "0") + (letters ? " + letters(" + N.nameNumbers(letters).total + ")" : "") + " = " + tot].concat(r.steps));
      h += '<div class="callout"><p><strong>Traditionally suits:</strong> ' + homes[r.value] + "</p></div>" + meaningCard(r.value, "House number") + '<p class="notice">For curiosity only — always judge a home on location, condition, price and safety.</p></div>' + cta("house", hn);
      show(out, h);
    },
    pin: function (f, out) {
      var c = N.clean(f.elements.code.value); if (c.length !== 5 && c.length !== 6) return alert("Enter a 6-digit Indian PIN or 5-digit US ZIP.");
      var h = '<div class="card">';
      if (c.length === 6) {
        var p = N.pin(c); if (!p) return alert("Indian PIN codes start with 1–9.");
        h += '<div class="panel-title"><h3>PIN ' + c + '</h3><span class="tag">India Post</span></div>' + digitsHTML(c) + '<div class="tbl-wrap mt2"><table><tbody><tr><th>Digit 1 · Zone</th><td><span class="mono">' + c[0] + "</span> — " + esc(p.zone) + '</td></tr><tr><th>Digits 1–2 · Postal circle</th><td><span class="mono">' + c.substr(0, 2) + "</span> — " + esc(p.circle) + '</td></tr><tr><th>Digits 1–3 · Sorting district</th><td><span class="mono">' + p.sorting + '</span> — the sorting/revenue district within the circle</td></tr><tr><th>Digits 4–6 · Delivery office</th><td><span class="mono">' + p.office + "</span> — the specific delivery post office</td></tr></tbody></table></div>";
        h += '<p class="notice mt2">Structure is decoded from India Post\'s published scheme. Confirm the exact post offices on <a href="https://www.indiapost.gov.in" target="_blank" rel="noopener">indiapost.gov.in</a>.</p>';
      } else {
        var z = N.zip(c);
        h += '<div class="panel-title"><h3>ZIP ' + c + '</h3><span class="tag">USPS</span></div>' + digitsHTML(c) + '<div class="tbl-wrap mt2"><table><tbody><tr><th>Digit 1 · National area</th><td><span class="mono">' + c[0] + "</span> — " + esc(z.zone) + '</td></tr><tr><th>Digits 1–3 · Sectional centre</th><td><span class="mono">' + z.scf + '</span> — the regional mail processing facility</td></tr><tr><th>Digits 4–5 · Delivery area</th><td><span class="mono">' + c.substr(3) + "</span> — the post office or delivery zone</td></tr></tbody></table></div>";
        h += '<p class="notice mt2">Confirm the exact city on <a href="https://tools.usps.com/zip-code-lookup.htm" target="_blank" rel="noopener">USPS ZIP lookup</a>.</p>';
      }
      h += "</div>"; show(out, h);
    },
    lucky: function (f, out) {
      var lo = parseInt(f.elements.lo.value, 10), hi = parseInt(f.elements.hi.value, 10), cnt = Math.min(100, parseInt(f.elements.count.value, 10) || 1), uniq = f.elements.unique.checked;
      if (isNaN(lo) || isNaN(hi) || hi < lo) return alert("Check the range.");
      if (uniq && cnt > hi - lo + 1) return alert("Range too small for that many unique numbers.");
      var dob = f.elements.dob && f.elements.dob.value, lp = dob ? N.lifePath(dob) : null, set = [], tries = 0;
      var rnd = function () { var a = new Uint32Array(1); (window.crypto || window.msCrypto).getRandomValues(a); return a[0] / 4294967296; };
      while (set.length < cnt && tries < 100000) { tries++; var x = lo + Math.floor(rnd() * (hi - lo + 1)); if (lp && f.elements.match.checked && N.friendly[lp.mulank].indexOf(N.reduce(N.sum(String(Math.abs(x)))).value) < 0) continue; if (uniq && set.indexOf(x) > -1) continue; set.push(x); }
      if (f.elements.sort.checked) set.sort(function (a, b) { return a - b; });
      var h = '<div class="card"><div class="panel-title"><h3>Your numbers</h3><span class="muted mono">' + set.length + " drawn</span></div>" + '<p class="big-num" id="lucky-out" style="font-size:clamp(1.6rem,5vw,2.6rem)">' + set.join(", ") + "</p>";
      if (lp) h += '<p class="muted">Matched to Mulank ' + lp.mulank + ": friendly roots " + N.friendly[lp.mulank].join(", ") + ".</p>";
      h += '<div class="row"><button class="btn btn-line btn-s" type="button" data-copy-out>Copy</button></div><p class="notice mt2">Generated with your browser\'s cryptographic random source. No number can improve lottery odds — every combination is equally likely.</p></div>';
      show(out, h);
      var cb = $("[data-copy-out]", out); if (cb) cb.addEventListener("click", function () { navigator.clipboard && navigator.clipboard.writeText(set.join(", ")); cb.textContent = "Copied"; });
    },
    benford: function (f, out) {
      var vals = String(f.elements.data.value).split(/[\s,;]+/).map(function (x) { return x.replace(/[^0-9.]/g, "").replace(/^[0.]+/, ""); }).filter(function (x) { return x && /[1-9]/.test(x[0]); });
      if (vals.length < 10) return alert("Paste at least 10 non-zero numbers.");
      var c = [0,0,0,0,0,0,0,0,0,0]; vals.forEach(function (v) { c[+v[0]]++; });
      var chi = 0, rows = "";
      for (var d = 1; d <= 9; d++) { var exp = Math.log10(1 + 1 / d), obs = c[d] / vals.length, e = exp * vals.length; chi += Math.pow(c[d] - e, 2) / e;
        rows += "<tr><td class=\"num\">" + d + "</td><td>" + c[d] + '</td><td><div class="bar" title="observed"><i style="width:' + Math.round(obs * 300) + '%;max-width:100%"></i></div></td><td class="num">' + (obs * 100).toFixed(1) + '%</td><td class="num">' + (exp * 100).toFixed(1) + "%</td></tr>"; }
      var verdict = chi < 15.51 ? "<strong>Consistent with Benford's law</strong> (χ² = " + chi.toFixed(2) + ", below the 15.51 critical value at 5%, 8 degrees of freedom)." : "<strong>Deviates from Benford's law</strong> (χ² = " + chi.toFixed(2) + ", above 15.51). Worth a closer look — but check whether the data should follow Benford at all.";
      show(out, '<div class="card"><div class="panel-title"><h3>' + vals.length + ' values tested</h3></div><div class="tbl-wrap"><table><thead><tr><th>Digit</th><th>Count</th><th>Observed</th><th>Obs %</th><th>Benford %</th></tr></thead><tbody>' + rows + '</tbody></table></div><div class="callout"><p>' + verdict + "</p></div></div>");
    },
    angel: function (f, out) {
      var d = N.clean(f.elements.n.value); if (!d) return alert("Enter the number you keep seeing.");
      var a = N.angel(d), r = N.root(d);
      var h = '<div class="card"><div class="panel-title"><h3>' + esc(d) + '</h3><span class="tag tag-hot">Root ' + a.root + "</span></div>" + digitsHTML(d, [a.dominant]) + '<p class="mt2">' + esc(a.text) + "</p>" + stepsHTML(r.steps) + meaningCard(a.root) + '<p><a href="' + base + "number.html?n=" + d + '">See the full maths &amp; pattern report for ' + esc(d) + " →</a></p></div>";
      show(out, h);
    }
  };
  $$("form[data-tool]").forEach(function (f) {
    var out = $(f.dataset.out || "#out");
    f.addEventListener("submit", function (e) { e.preventDefault(); if (!f.checkValidity()) { f.reportValidity(); return; } tools[f.dataset.tool](f, out); });
    var q = qs.get("n"); if (q && f.elements.n) { f.elements.n.value = q; tools[f.dataset.tool](f, out); }
  });
  $$("[data-quick]").forEach(function (b) { b.addEventListener("click", function () { var f = $(b.dataset.quick); f.elements[b.dataset.field || "n"].value = b.dataset.v; f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event("submit")); }); });

  /* support page: payment links */
  var pay = window.SITE && window.SITE.payments;
  $$("[data-pay]").forEach(function (a) { var u = pay && pay[a.dataset.pay]; if (u) { a.href = u; a.hidden = false; a.target = "_blank"; a.rel = "noopener"; } else a.hidden = true; });
  $$("[data-pay-fallback]").forEach(function (el) { var any = pay && Object.keys(pay).some(function (k) { return pay[k]; }); el.hidden = !!any; });
  $$("[data-amount]").forEach(function (b) { b.addEventListener("click", function () { var i = $("#pledge-amount"); if (i) { i.value = b.dataset.amount; i.focus(); } }); });

  /* contest countdown to end of month */
  $$("[data-countdown]").forEach(function (el) {
    var tick = function () { var now = new Date(), end = new Date(now.getFullYear(), now.getMonth() + 1, 1), ms = end - now, d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4); el.textContent = d + "d " + h + "h " + m + "m"; };
    tick(); setInterval(tick, 30000);
  });
  $$("[data-month]").forEach(function (el) { el.textContent = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }); });
})();
