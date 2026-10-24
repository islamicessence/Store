(function () {
  var S = window.STORE || { products: {}, currency: "$" };

  // Buy buttons and prices from config.js
  document.querySelectorAll("[data-buy]").forEach(function (a) {
    var p = S.products[a.getAttribute("data-buy")] || {};
    a.href = p.url || S.fallback || "#";
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-price]").forEach(function (el) {
    var p = S.products[el.getAttribute("data-price")];
    if (p && p.price) el.textContent = S.currency + p.price;
  });

  // Mobile menu
  var btn = document.querySelector(".menu-btn"), nav = document.querySelector(".nav");
  if (btn && nav) btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Audio players: one plays at a time
  var PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>';
  var PAUSE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 2h3v12h-3zM9.5 2h3v12h-3z"/></svg>';
  var current = null;
  function fmt(s) { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  document.querySelectorAll(".player").forEach(function (pl) {
    var audio = new Audio(pl.getAttribute("data-src"));
    audio.preload = "metadata";
    var b = pl.querySelector(".play"), bar = pl.querySelector(".bar i"), t = pl.querySelector(".time");
    b.innerHTML = PLAY;
    audio.addEventListener("loadedmetadata", function () { t.textContent = fmt(audio.duration); });
    audio.addEventListener("timeupdate", function () {
      if (audio.duration) bar.style.width = (100 * audio.currentTime / audio.duration) + "%";
      t.textContent = fmt(audio.duration - audio.currentTime);
    });
    audio.addEventListener("ended", function () { b.innerHTML = PLAY; b.setAttribute("aria-label", "Play recitation"); bar.style.width = "0"; t.textContent = fmt(audio.duration); });
    b.addEventListener("click", function () {
      if (audio.paused) {
        if (current && current.audio !== audio) { current.audio.pause(); current.btn.innerHTML = PLAY; }
        audio.play().catch(function () {});
        b.innerHTML = PAUSE; b.setAttribute("aria-label", "Pause recitation");
        current = { audio: audio, btn: b };
      } else {
        audio.pause(); b.innerHTML = PLAY; b.setAttribute("aria-label", "Play recitation");
      }
    });
  });

  // "Find a dua for…" chips open the matching group
  document.querySelectorAll("[data-goto]").forEach(function (c) {
    c.addEventListener("click", function () {
      var d = document.getElementById(c.getAttribute("data-goto"));
      if (!d) return;
      d.open = true;
      d.scrollIntoView({ behavior: "smooth", block: "center" });
      d.classList.add("flash");
      setTimeout(function () { d.classList.remove("flash"); }, 1600);
    });
  });

  // Copy email
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var txt = b.getAttribute("data-copy"), old = b.textContent;
      function done() { b.textContent = "Copied"; setTimeout(function () { b.textContent = old; }, 1500); }
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () {});
    });
  });

  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
})();
