/**
 * Tosan IDEC Support Widget
 * -------------------------
 * Drop this single script on any website to add a floating chat widget
 * that connects to the IDEC chatbot backend.
 *
 * USAGE — add this to the IDEC website (before </body>):
 *
 *   <script src="http://138.68.91.89:8002/static/tosan-widget.js"></script>
 *
 * Or with custom config:
 *
 *   <script>
 *     window.TosanWidgetConfig = { position: "bottom-left" };
 *   </script>
 *   <script src="http://138.68.91.89:8002/static/tosan-widget.js"></script>
 */
(function () {
  if (window.TosanWidgetInitialized) return;
  window.TosanWidgetInitialized = true;

  var DEFAULTS = {
    chatbotUrl: "http://138.68.91.89:8002/",
    position: "bottom-right",
    buttonSize: 60,
    zIndex: 999999,
    title: "Tosan - IDEC Support",
    subtitle: "We typically reply instantly",
    avatarUrl:
      "https://raw.githubusercontent.com/Eriayomide/vreg-chatbot/main/ada_avatar.png",
    avatarFallback: "T",
    width: 400,
    height: 620,
    borderRadius: 16,
    primaryColor: "#4a6a7a",
    primaryGradient: "linear-gradient(135deg, #5a7a8a 0%, #4a6a7a 100%)",
    welcomeMessage:
      "Hi there! \uD83D\uDC4B Need help with IDEC? Click to chat with Tosan.",
    showWelcomeBubble: true,
    welcomeBubbleDelay: 3000,
  };

  function injectWidget(userOpts) {
    var o = {};
    var srcs = [DEFAULTS, window.TosanWidgetConfig || {}, userOpts || {}];
    for (var s = 0; s < srcs.length; s++)
      for (var k in srcs[s])
        if (srcs[s].hasOwnProperty(k)) o[k] = srcs[s][k];

    var isLeft = o.position === "bottom-left";
    var side = isLeft ? "left:24px;" : "right:24px;";

    /* ── CSS ──────────────────────────────────────── */
    var css = document.createElement("style");
    css.textContent =
      /* Button */
      ".tw-btn{position:fixed;" +
      side +
      "bottom:24px;width:" +
      o.buttonSize +
      "px;height:" +
      o.buttonSize +
      "px;border-radius:50%;border:none;cursor:pointer;background:" +
      o.primaryGradient +
      ";color:#fff;box-shadow:0 4px 20px rgba(0,0,0,.25);z-index:" +
      o.zIndex +
      ";display:flex;align-items:center;justify-content:center;" +
      "transition:transform .3s cubic-bezier(.4,0,.2,1),box-shadow .3s;outline:none;padding:0}" +
      ".tw-btn:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(0,0,0,.3)}" +
      ".tw-btn:active{transform:scale(.95)}" +
      ".tw-btn.open .tw-ic{display:none}" +
      ".tw-btn.open .tw-ix{display:block}" +
      ".tw-btn:not(.open) .tw-ic{display:block}" +
      ".tw-btn:not(.open) .tw-ix{display:none}" +
      /* Badge */
      ".tw-badge{position:absolute;top:-2px;right:-2px;width:18px;height:18px;" +
      "background:#ef4444;border-radius:50%;border:2px solid #fff;display:none}" +
      ".tw-badge.show{display:block}" +
      /* Welcome bubble */
      ".tw-wb{position:fixed;" +
      side +
      "bottom:" +
      (o.buttonSize + 40) +
      "px;background:#fff;color:#333;padding:14px 40px 14px 18px;" +
      "border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,.15);" +
      "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;" +
      "font-size:14px;line-height:1.45;max-width:280px;z-index:" +
      (o.zIndex - 1) +
      ";opacity:0;transform:translateY(10px) scale(.95);" +
      "transition:opacity .4s,transform .4s;pointer-events:none}" +
      ".tw-wb.vis{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}" +
      ".tw-wb-x{position:absolute;top:6px;right:8px;background:none;border:none;" +
      "color:#999;font-size:16px;cursor:pointer;padding:2px 4px;line-height:1}" +
      ".tw-wb::after{content:'';position:absolute;bottom:-8px;" +
      (isLeft ? "left:24px;" : "right:24px;") +
      "border-left:8px solid transparent;border-right:8px solid transparent;" +
      "border-top:8px solid #fff}" +
      /* Panel */
      ".tw-panel{position:fixed;" +
      side +
      "bottom:" +
      (o.buttonSize + 36) +
      "px;width:min(" +
      o.width +
      "px,calc(100vw - 32px));height:min(" +
      o.height +
      "px,calc(100vh - " +
      (o.buttonSize + 60) +
      "px));background:#fff;border-radius:" +
      o.borderRadius +
      "px;overflow:hidden;box-shadow:0 12px 48px rgba(0,0,0,.2);" +
      "z-index:" +
      o.zIndex +
      ";opacity:0;transform:translateY(20px) scale(.95);" +
      "transition:opacity .3s cubic-bezier(.4,0,.2,1),transform .3s cubic-bezier(.4,0,.2,1);" +
      "pointer-events:none;display:flex;flex-direction:column}" +
      ".tw-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}" +
      /* Header */
      ".tw-hdr{display:flex;align-items:center;gap:12px;padding:14px 16px;" +
      "background:" +
      o.primaryGradient +
      ";color:#fff;" +
      "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;flex-shrink:0}" +
      ".tw-av{width:40px;height:40px;border-radius:50%;border:2px solid rgba(255,255,255,.4);" +
      "object-fit:cover;background:rgba(255,255,255,.2);flex-shrink:0}" +
      ".tw-av-fb{width:40px;height:40px;border-radius:50%;border:2px solid rgba(255,255,255,.4);" +
      "background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;" +
      "font-size:18px;font-weight:700;flex-shrink:0}" +
      ".tw-hi{flex:1;min-width:0}" +
      ".tw-ht{font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
      ".tw-hs{font-size:12px;opacity:.85;margin-top:2px;display:flex;align-items:center;gap:5px}" +
      ".tw-dot{width:7px;height:7px;background:#4ade80;border-radius:50%;display:inline-block;" +
      "animation:tw-p 2s infinite}" +
      "@keyframes tw-p{0%,100%{opacity:1}50%{opacity:.5}}" +
      ".tw-xb{background:rgba(255,255,255,.15);border:none;color:#fff;width:32px;height:32px;" +
      "border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;" +
      "transition:background .2s;flex-shrink:0}" +
      ".tw-xb:hover{background:rgba(255,255,255,.25)}" +
      /* Iframe */
      ".tw-if{flex:1;width:100%;border:0;background:#f5f5f5}" +
      /* Footer */
      ".tw-ft{text-align:center;padding:6px;font-size:11px;color:#aaa;background:#fff;" +
      "border-top:1px solid #f0f0f0;" +
      "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;flex-shrink:0}" +
      /* Mobile */
      "@media(max-width:480px){" +
      ".tw-panel{width:100vw;height:calc(100vh - 20px);bottom:0;left:0!important;" +
      "right:0!important;border-radius:" +
      o.borderRadius +
      "px " +
      o.borderRadius +
      "px 0 0}" +
      ".tw-btn.open{display:none}" +
      "}";
    document.head.appendChild(css);

    /* ── Button ───────────────────────────────────── */
    var btn = document.createElement("button");
    btn.className = "tw-btn";
    btn.setAttribute("aria-label", "Open chat");
    btn.innerHTML =
      '<svg class="tw-ic" width="28" height="28" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>' +
      '<svg class="tw-ix" width="24" height="24" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="display:none">' +
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    var badge = document.createElement("span");
    badge.className = "tw-badge";
    btn.appendChild(badge);

    /* ── Welcome Bubble ───────────────────────────── */
    var wb = document.createElement("div");
    wb.className = "tw-wb";
    wb.innerHTML = o.welcomeMessage;
    var wbx = document.createElement("button");
    wbx.className = "tw-wb-x";
    wbx.innerHTML = "&times;";
    wbx.setAttribute("aria-label", "Dismiss");
    wb.appendChild(wbx);

    /* ── Panel ─────────────────────────────────────── */
    var panel = document.createElement("div");
    panel.className = "tw-panel";

    // Header
    var hdr = document.createElement("div");
    hdr.className = "tw-hdr";

    var av = document.createElement("img");
    av.className = "tw-av";
    av.src = o.avatarUrl;
    av.alt = "Tosan";
    av.onerror = function () {
      var fb = document.createElement("div");
      fb.className = "tw-av-fb";
      fb.textContent = o.avatarFallback;
      this.replaceWith(fb);
    };

    var hi = document.createElement("div");
    hi.className = "tw-hi";
    hi.innerHTML =
      '<div class="tw-ht">' +
      o.title +
      "</div>" +
      '<div class="tw-hs"><span class="tw-dot"></span> ' +
      o.subtitle +
      "</div>";

    var xb = document.createElement("button");
    xb.className = "tw-xb";
    xb.setAttribute("aria-label", "Close chat");
    xb.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/>' +
      '<line x1="6" y1="6" x2="18" y2="18"/></svg>';

    hdr.appendChild(av);
    hdr.appendChild(hi);
    hdr.appendChild(xb);

    // Iframe (lazy)
    var ifr = document.createElement("iframe");
    ifr.className = "tw-if";
    ifr.setAttribute("title", o.title);
    ifr.setAttribute("allow", "clipboard-write");

    // Footer
    var ft = document.createElement("div");
    ft.className = "tw-ft";
    ft.textContent = "Powered by IDEC Support";

    panel.appendChild(hdr);
    panel.appendChild(ifr);
    panel.appendChild(ft);

    /* ── State + Actions ──────────────────────────── */
    var isOpen = false;
    var loaded = false;
    var wbDone = false;

    function open() {
      if (!loaded) {
        ifr.src = o.chatbotUrl;
        loaded = true;
      }
      isOpen = true;
      panel.classList.add("open");
      btn.classList.add("open");
      badge.classList.remove("show");
      dismiss();
    }
    function close() {
      isOpen = false;
      panel.classList.remove("open");
      btn.classList.remove("open");
    }
    function toggle() {
      isOpen ? close() : open();
    }
    function dismiss() {
      wbDone = true;
      wb.classList.remove("vis");
    }

    btn.addEventListener("click", toggle);
    xb.addEventListener("click", close);
    wbx.addEventListener("click", function (e) {
      e.stopPropagation();
      dismiss();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen) close();
    });

    /* ── Mount ─────────────────────────────────────── */
    document.body.appendChild(btn);
    document.body.appendChild(wb);
    document.body.appendChild(panel);

    /* ── Welcome timer ─────────────────────────────── */
    if (o.showWelcomeBubble) {
      setTimeout(function () {
        if (!isOpen && !wbDone) {
          wb.classList.add("vis");
          badge.classList.add("show");
        }
      }, o.welcomeBubbleDelay);
    }
  }

  /* ── Boot ────────────────────────────────────────── */
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function () {
      injectWidget();
    });
  else injectWidget();
})();
