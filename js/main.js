/* OTZI Tattoos & Piercings Guwahati — main.js */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Lenis smooth momentum scrolling (CDN, optional) ---------- */
  if (window.Lenis && !reduced) {
    var lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    var rafLenis = function (t) { lenis.raf(t); requestAnimationFrame(rafLenis); };
    requestAnimationFrame(rafLenis);
  }

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav + page context ---------- */
  var page = location.pathname.split("/").pop() || "index.html";
  var isHome = page === "index.html";
  document.querySelectorAll("[data-nav]").forEach(function (a) {
    if (a.getAttribute("data-nav") === page) a.classList.add("active");
  });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("mobile-menu");
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    if (open) {
      var first = menu.querySelector("a");
      if (first) first.focus({ preventScroll: true });
    } else {
      toggle.focus({ preventScroll: true });
    }
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) setMenu(false);
    });
  }

  /* ---------- Hero load animation ---------- */
  var hero = document.querySelector(".hero, .page-hero");
  if (hero) requestAnimationFrame(function () { hero.classList.add("loaded"); });

  /* ---------- Hero particles ---------- */
  var pWrap = document.querySelector(".particles");
  if (pWrap && !reduced) {
    var n = window.innerWidth < 640 ? 8 : 14;
    for (var i = 0; i < n; i++) {
      var p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.top = 35 + Math.random() * 65 + "%";
      p.style.setProperty("--dur", 11 + Math.random() * 12 + "s");
      p.style.setProperty("--del", -Math.random() * 16 + "s");
      p.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
      var s = 2 + Math.random() * 2.5;
      p.style.width = p.style.height = s + "px";
      pWrap.appendChild(p);
    }
  }

  /* ---------- Hero mouse parallax (HOME ONLY, desktop) ---------- */
  var heroBg = document.querySelector(".hero-bg");
  var heroInner = document.querySelector(".hero-inner");
  var panels = document.querySelectorAll(".hg-panel");
  if (isHome && hero && finePointer && !reduced && window.innerWidth > 900 && (heroBg || panels.length)) {
    var raf = null;
    hero.addEventListener("mousemove", function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        if (heroBg) heroBg.style.transform = "translate3d(" + x * -22 + "px," + y * -16 + "px,0)";
        panels.forEach(function (pn) {
          var d = parseFloat(pn.getAttribute("data-depth")) || 0.5;
          pn.style.transform =
            "translate3d(" + (x * -36 * d).toFixed(1) + "px," + (y * -26 * d).toFixed(1) + "px," + (-70 * d).toFixed(0) + "px)";
        });
        if (heroInner) heroInner.style.transform = "translate3d(" + x * 12 + "px," + y * 8 + "px,40px)";
        raf = null;
      });
    });
    hero.addEventListener("mouseleave", function () {
      if (heroBg) heroBg.style.transform = "";
      panels.forEach(function (pn) { pn.style.transform = ""; });
      if (heroInner) heroInner.style.transform = "";
    });
    if (heroBg) heroBg.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)";
    if (heroInner) heroInner.style.transition = "transform .6s cubic-bezier(.16,1,.3,1)";
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Card tilt (HOME ONLY, desktop) ---------- */
  if (isHome && finePointer && !reduced) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      var raf2 = null;
      card.addEventListener("mousemove", function (e) {
        if (raf2) return;
        raf2 = requestAnimationFrame(function () {
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            "perspective(900px) rotateX(" + (-y * 5).toFixed(2) + "deg) rotateY(" +
            (x * 6).toFixed(2) + "deg) translateY(-6px)";
          raf2 = null;
        });
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* ---------- Magnetic CTA (HOME ONLY, desktop) ---------- */
  if (isHome && finePointer && !reduced) {
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "translate(" + x * 8 + "px," + y * 6 + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- Lazy videos ---------- */
  var lazyVideos = document.querySelectorAll("video[data-src]");
  function loadVideo(v) {
    if (v.dataset.loaded) return;
    v.dataset.loaded = "1";
    v.src = v.getAttribute("data-src");
    v.load();
    v.addEventListener("error", function () {
      var wrap = v.closest(".video-card");
      if (wrap) wrap.classList.add("no-video");
    }, true);
    if (v.hasAttribute("data-autoplay")) {
      var pr = v.play();
      if (pr && pr.catch) pr.catch(function () {});
    }
  }
  if ("IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          loadVideo(en.target);
          vio.unobserve(en.target);
        }
      });
    }, { rootMargin: "240px" });
    lazyVideos.forEach(function (v) { vio.observe(v); });
  } else {
    lazyVideos.forEach(loadVideo);
  }

  /* ---------- Count-up numbers ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !reduced) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        var el = en.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        var t0 = null;
        function tick(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1500, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString("en-IN");
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Gallery filter ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var items = document.querySelectorAll(".m-item");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      var f = btn.getAttribute("data-filter");
      items.forEach(function (it) {
        var show = f === "all" || it.getAttribute("data-category") === f;
        it.classList.toggle("g-hide", !show);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById("lightbox");
  if (lb && items.length) {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector("figcaption");
    var lbCount = lb.querySelector(".lb-count");
    var idx = 0;

    function visibleItems() {
      return Array.prototype.filter.call(items, function (it) {
        return !it.classList.contains("g-hide");
      });
    }
    function show(i) {
      var vis = visibleItems();
      if (!vis.length) return;
      idx = (i + vis.length) % vis.length;
      var img = vis[idx].querySelector("img");
      lbImg.src = img.getAttribute("src");
      lbImg.alt = img.alt;
      lbCap.textContent = img.getAttribute("data-cap") || img.alt;
      lbCount.textContent = (idx + 1) + " / " + vis.length;
    }
    function open(i) {
      show(i);
      lb.classList.add("open");
      document.body.classList.add("lb-open");
      lb.querySelector(".lb-close").focus({ preventScroll: true });
    }
    function close() {
      lb.classList.remove("open");
      document.body.classList.remove("lb-open");
    }
    items.forEach(function (it) {
      it.setAttribute("tabindex", "0");
      it.setAttribute("role", "button");
      it.addEventListener("click", function () {
        open(visibleItems().indexOf(it));
      });
      it.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(visibleItems().indexOf(it));
        }
      });
    });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- Today highlight in hours tables ---------- */
  var todayRow = document.querySelector('.hours-table tr[data-day="' + new Date().getDay() + '"]');
  if (todayRow) todayRow.classList.add("today");
})();
