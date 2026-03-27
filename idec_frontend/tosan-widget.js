(function () {
  if (window.TosanWidgetInitialized) return;
  window.TosanWidgetInitialized = true;

  const DEFAULTS = {
    chatbotUrl: "http://138.68.91.89:8002/",
    position: "bottom-right",
    buttonSize: 64,
    zIndex: 999999,
    title: "Tosan Support",
    icon: "💬",
    width: 380,
    height: 600,
    borderRadius: 18
  };

  function injectWidget(userOptions) {
    const options = Object.assign({}, DEFAULTS, window.TosanWidgetConfig || {}, userOptions || {});

    const isLeft = options.position === "bottom-left";

    const style = document.createElement("style");
    style.innerHTML = `
      .tosan-widget-button {
        position: fixed;
        ${isLeft ? "left: 24px;" : "right: 24px;"}
        bottom: 24px;
        width: ${options.buttonSize}px;
        height: ${options.buttonSize}px;
        border-radius: 999px;
        border: none;
        cursor: pointer;
        background: #8fa0ad;
        color: white;
        font-size: 28px;
        box-shadow: 0 10px 30px rgba(0,0,0,.18);
        z-index: ${options.zIndex};
      }

      .tosan-widget-panel {
        position: fixed;
        ${isLeft ? "left: 24px;" : "right: 24px;"}
        bottom: ${options.buttonSize + 40}px;
        width: min(${options.width}px, calc(100vw - 32px));
        height: min(${options.height}px, calc(100vh - 110px));
        background: white;
        border-radius: ${options.borderRadius}px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,.22);
        z-index: ${options.zIndex};
        display: none;
      }

      .tosan-widget-panel.open {
        display: block;
      }

      .tosan-widget-header {
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 14px;
        background: #a8b3bc;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 16px;
        font-weight: 600;
      }

      .tosan-widget-close {
        background: transparent;
        color: white;
        border: none;
        font-size: 22px;
        cursor: pointer;
      }

      .tosan-widget-frame {
        width: 100%;
        height: calc(100% - 56px);
        border: 0;
      }
    `;
    document.head.appendChild(style);

    const button = document.createElement("button");
    button.className = "tosan-widget-button";
    button.setAttribute("aria-label", "Open chat");
    button.innerHTML = options.icon;

    const panel = document.createElement("div");
    panel.className = "tosan-widget-panel";

    const header = document.createElement("div");
    header.className = "tosan-widget-header";
    header.innerHTML = `<span>${options.title}</span>`;

    const closeBtn = document.createElement("button");
    closeBtn.className = "tosan-widget-close";
    closeBtn.innerHTML = "&times;";

    const iframe = document.createElement("iframe");
    iframe.className = "tosan-widget-frame";
    iframe.src = options.chatbotUrl;
    iframe.setAttribute("title", options.title);
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("allow", "clipboard-write; microphone");

    header.appendChild(closeBtn);
    panel.appendChild(header);
    panel.appendChild(iframe);

    button.addEventListener("click", function () {
      panel.classList.toggle("open");
    });

    closeBtn.addEventListener("click", function () {
      panel.classList.remove("open");
    });

    document.body.appendChild(button);
    document.body.appendChild(panel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      injectWidget();
    });
  } else {
    injectWidget();
  }
})();
