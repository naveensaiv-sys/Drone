/* NorthSky Drone Co. — main.js */
(function () {
  "use strict";

  var CONTACT_EMAIL = "naveensai.v@gmail.com";
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/" + CONTACT_EMAIL;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav: scrolled state + mobile menu ---------- */
  var nav = document.querySelector(".nav");
  var navLinks = document.querySelector(".nav-links");
  var navToggle = document.querySelector(".nav-toggle");
  var progress = document.querySelector(".scroll-progress");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle("scrolled", y > 24);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("mobile-open");
      nav.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("mobile-open");
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Count-up stats ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  }

  /* ---------- Card cursor glow ---------- */
  document.querySelectorAll(".way-card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    });
  });

  /* ---------- Helpers ---------- */
  function setStatus(el, kind, msg) {
    el.className = "form-status " + kind;
    el.textContent = msg;
  }

  function postForm(payload) {
    return fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });
  }

  /* ---------- Booking form ---------- */
  var form = document.getElementById("booking-form");
  if (form) {
    var statusEl = document.getElementById("form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector('[name="_honey"]').value) return; // spam bot
      var data = new FormData(form);
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Sending…";

      var payload = {
        _subject: "New booking request — NorthSky Drone Co.",
        _template: "table",
        Type: "Booking request",
        Name: data.get("name"),
        Email: data.get("email"),
        Phone: data.get("phone"),
        Service: data.get("service"),
        "Start date": data.get("date_start") || "—",
        "End date / details": data.get("date_end") || "—",
        Message: data.get("message") || "—",
      };

      postForm(payload)
        .then(function () {
          setStatus(statusEl, "ok", "Request sent! We'll confirm by email or text, usually within a couple of hours.");
          form.reset();
        })
        .catch(function () {
          var body =
            "Booking request%0D%0AName: " + encodeURIComponent(data.get("name") || "") +
            "%0D%0APhone: " + encodeURIComponent(data.get("phone") || "") +
            "%0D%0AService: " + encodeURIComponent(data.get("service") || "") +
            "%0D%0ADates: " + encodeURIComponent((data.get("date_start") || "") + " - " + (data.get("date_end") || "")) +
            "%0D%0A" + encodeURIComponent(data.get("message") || "");
          setStatus(statusEl, "err", "Couldn't send automatically. Please email us instead — a pre-filled email should open now, or call/text 416-826-4143.");
          window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=Booking%20request&body=" + body;
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = "Send booking request";
        });
    });
  }

  /* ---------- Chat widget ---------- */
  var chatFab = document.querySelector(".chat-fab");
  var chatBody = document.querySelector(".chat-body");
  var chatInput = document.querySelector(".chat-input input");
  var chatSend = document.querySelector(".chat-input button");
  var chatQuick = document.querySelector(".chat-quick");

  var chat = {
    step: "message", // message -> name -> contact -> done
    message: "",
    name: "",
    contact: "",
  };

  function addMsg(text, who) {
    var div = document.createElement("div");
    div.className = "msg " + who;
    div.textContent = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function botSay(text, delay) {
    setTimeout(function () { addMsg(text, "bot"); }, reduceMotion ? 0 : delay || 450);
  }

  function toggleChat(open) {
    var willOpen = typeof open === "boolean" ? open : !document.body.classList.contains("chat-open");
    document.body.classList.toggle("chat-open", willOpen);
    chatFab.setAttribute("aria-expanded", willOpen ? "true" : "false");
    if (willOpen && chatInput) setTimeout(function () { chatInput.focus(); }, 300);
  }

  if (chatFab) {
    chatFab.addEventListener("click", function () { toggleChat(); });

    if (chatQuick) {
      chatQuick.addEventListener("click", function (e) {
        var btn = e.target.closest("button");
        if (!btn) return;
        chatInput.value = btn.getAttribute("data-msg");
        handleChatSend();
      });
    }

    function handleChatSend() {
      var text = chatInput.value.trim();
      if (!text) return;
      addMsg(text, "user");
      chatInput.value = "";

      if (chat.step === "message") {
        chat.message = text;
        chat.step = "name";
        if (chatQuick) chatQuick.style.display = "none";
        botSay("Great! What's your name?");
      } else if (chat.step === "name") {
        chat.name = text;
        chat.step = "contact";
        botSay("Thanks, " + chat.name + "! What's the best email or phone number to reach you?");
      } else if (chat.step === "contact") {
        chat.contact = text;
        chat.step = "done";
        botSay("Sending your message…", 200);
        postForm({
          _subject: "New chat message — NorthSky Drone Co.",
          _template: "table",
          Type: "Chat widget message",
          Name: chat.name,
          Contact: chat.contact,
          Message: chat.message,
        })
          .then(function () {
            botSay("Done! Your message is on its way. We usually reply within a couple of hours (9am–9pm). ✅", 800);
          })
          .catch(function () {
            botSay("Hmm, sending failed. Please text or call us at 416-826-4143, or email " + CONTACT_EMAIL + ".", 800);
          });
      } else {
        // conversation finished — treat new text as a fresh message
        chat.step = "name";
        chat.message = text;
        botSay("Got it — what's your name? (So we know who to reply to.)");
      }
    }

    chatSend.addEventListener("click", handleChatSend);
    chatInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") handleChatSend();
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
