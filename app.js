const sampleHtml = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <title>VIBE Sample</title>
  <style>
    :root { --ink:#101828; --muted:#667085; --surface:#ffffff; --bg:#f5f6fb; --brand:#5f8bff; --shadow: 0 8px 20px rgba(0,0,0,0.08); }
    html { scroll-behavior: smooth; }
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 0; background: var(--bg); color: var(--ink); }
    .page { max-width: 980px; margin: 0 auto; padding: 24px; }
    header { background: var(--surface); padding: 24px; border-radius: 16px; box-shadow: var(--shadow); }
    nav { position: sticky; top: 0; z-index: 5; margin: 16px 0; padding: 12px 14px; background: rgba(255,255,255,0.88); border: 1px solid rgba(16,24,40,0.08); backdrop-filter: blur(10px); border-radius: 14px; box-shadow: 0 10px 24px rgba(0,0,0,0.06); display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
    nav a { color: var(--ink); text-decoration: none; padding: 8px 10px; border-radius: 10px; background: rgba(95,139,255,0.08); }
    nav a:hover { background: rgba(95,139,255,0.16); }
    .muted { color: var(--muted); }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-top: 16px; }
    .card { background: white; padding: 18px; border-radius: 14px; box-shadow: 0 6px 16px rgba(0,0,0,0.08); }
    .cta { margin-top: 16px; display: inline-block; padding: 10px 16px; background: var(--brand); color: white; border-radius: 999px; text-decoration: none; }
    .section { margin-top: 24px; background: var(--surface); border-radius: 16px; padding: 18px; box-shadow: var(--shadow); }
    .two-col { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 16px; align-items: start; }
    @media (max-width: 820px) { .two-col { grid-template-columns: 1fr; } }
    .figure { border-radius: 14px; overflow: hidden; border: 1px solid rgba(16,24,40,0.10); background: linear-gradient(135deg, rgba(95,139,255,0.25), rgba(127,91,255,0.20)); }
    .figure svg { display: block; width: 100%; height: auto; }
    .table { width: 100%; border-collapse: collapse; overflow: hidden; border-radius: 12px; border: 1px solid rgba(16,24,40,0.10); }
    .table th, .table td { padding: 10px 12px; border-bottom: 1px solid rgba(16,24,40,0.08); text-align: left; vertical-align: top; }
    .table th { background: rgba(95,139,255,0.10); }
    .pill { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; border-radius: 999px; background: rgba(16,24,40,0.06); }
    .form { display: grid; gap: 10px; }
    .form label { font-size: 13px; color: var(--muted); display: grid; gap: 6px; }
    .form input, .form select, .form textarea { padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(16,24,40,0.12); outline: none; font-family: inherit; }
    .form textarea { min-height: 120px; }
    footer { margin: 32px 0 60px; text-align: center; color: var(--muted); }
  </style>
</head>
<body>
  <div class="page" id="top">
    <header>
      <h1>Visual Instruction Browser Editor</h1>
      <p class="muted">要素を選択して自然言語で編集指示を出せます。スクロール挙動の確認用に、長めのサンプルを用意しています。</p>
      <a class="cta" href="#cards">カードへ移動</a>
    </header>

    <nav aria-label="ページ内ナビ">
      <span class="pill">スクロール確認</span>
      <a href="#cards">カード</a>
      <a href="#article">記事</a>
      <a href="#table">表</a>
      <a href="#form">フォーム</a>
      <a href="#bottom">最下部</a>
    </nav>

    <section class="section" id="cards">
      <h2>カード一覧</h2>
      <p class="muted">カードを選択してから、コマンドバーで指示を出してみてください。</p>
      <div class="cards">
        <article class="card">
          <h3>カードA</h3>
          <p>クリックして選択してください。</p>
        </article>
        <article class="card">
          <h3>カードB</h3>
          <p>複数選択が可能です。</p>
        </article>
        <article class="card">
          <h3>カードC</h3>
          <p>順番入れ替えのデモに使えます。</p>
        </article>
        <article class="card">
          <h3>カードD</h3>
          <p>色や余白などの変更指示に使えます。</p>
        </article>
        <article class="card">
          <h3>カードE</h3>
          <p>削除（remove）などの指示も試せます。</p>
        </article>
        <article class="card">
          <h3>カードF</h3>
          <p>この下にまだコンテンツが続きます。</p>
        </article>
      </div>
    </section>

    <section class="section two-col" id="article">
      <div>
        <h2>長めの記事セクション</h2>
        <p class="muted">スクロールしながら、要素選択・ハイライト・コマンドバーの追従などを確認できます。</p>
        <h3>1. まず選択</h3>
        <p>文章の途中や見出し、リンクなど、さまざまな要素をクリックして選択してみてください。</p>
        <p>このサンプルはデモ用なので、リンクはページ内移動だけにしています。</p>
        <h3>2. 次に指示</h3>
        <p>例: 「削除して」 / 「逆にして」 / 「背景を青にして」など。</p>
        <h3>3. 確認用の長文</h3>
        <p>段落A: ユーザーは見えているUIをそのまま操作し、自然言語で更新できます。</p>
        <p>段落B: 選択した要素がどこにあるか、スクロールした状態でも分かりやすいことが重要です。</p>
        <p>段落C: この文章はスクロール量を増やすために配置しています。必要に応じて編集してください。</p>
        <p>段落D: 見出しやボックス、テーブル、フォームなど、さまざまなパターンがあると検証しやすいです。</p>
        <p>段落E: さらに下にもセクションが続きます。</p>
      </div>
      <aside class="figure" aria-label="装飾画像">
        <svg viewBox="0 0 640 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="デモ用の図">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#5f8bff" stop-opacity="0.85"/>
              <stop offset="1" stop-color="#7f5bff" stop-opacity="0.65"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="640" height="420" fill="url(#g)"/>
          <circle cx="150" cy="160" r="84" fill="rgba(255,255,255,0.25)"/>
          <circle cx="470" cy="230" r="120" fill="rgba(255,255,255,0.18)"/>
          <rect x="70" y="290" width="500" height="70" rx="18" fill="rgba(255,255,255,0.22)"/>
          <text x="92" y="336" font-size="22" fill="rgba(255,255,255,0.9)" font-family="system-ui, -apple-system, Segoe UI, sans-serif">
            Scroll / Select / Edit
          </text>
        </svg>
      </aside>
    </section>

    <section class="section" id="table">
      <h2>テーブル</h2>
      <p class="muted">表の行やセルを選択して、並び替え・削除などを試せます。</p>
      <table class="table" aria-label="サンプル表">
        <thead>
          <tr>
            <th>項目</th>
            <th>説明</th>
            <th>状態</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>カード</td>
            <td>見出し・本文の選択確認</td>
            <td>準備OK</td>
          </tr>
          <tr>
            <td>記事</td>
            <td>長文でスクロール確認</td>
            <td>準備OK</td>
          </tr>
          <tr>
            <td>フォーム</td>
            <td>input/textarea/selectの選択</td>
            <td>準備OK</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="section" id="form">
      <h2>フォーム</h2>
      <p class="muted">入力欄やラベル、ボタンなどのスタイル変更指示に使えます（送信は無効化されます）。</p>
      <form class="form">
        <label>
          お名前
          <input type="text" value="山田 太郎" />
        </label>
        <label>
          優先度
          <select>
            <option>低</option>
            <option selected>中</option>
            <option>高</option>
          </select>
        </label>
        <label>
          メモ
          <textarea>ここにメモを書きます。スクロール中でも選択できるか確認してください。</textarea>
        </label>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <a class="cta" href="#top">上に戻る</a>
          <a class="cta" href="#bottom" style="background:#101828;">最下部へ</a>
        </div>
      </form>
    </section>

    <footer id="bottom">
      <p>サンプル終わり。ここまでスクロールできればOKです。</p>
      <p class="muted">このフッターも選択できます。</p>
    </footer>
  </div>
</body>
</html>`;

const state = {
  currentSource: "",
  isProcessing: false,
  history: [],
  future: [],
  selectionMode: "click",
  selection: null,
  lastInstruction: "",
};

const previewFrame = document.getElementById("preview");
const commandBar = document.getElementById("command-bar");
const selectionStrip = document.getElementById("selection-strip");
const instructionInput = document.getElementById("instruction-input");
const runButton = document.getElementById("run-button");
const backButton = document.getElementById("back-button");
const forwardButton = document.getElementById("forward-button");
const modeToggleButton = document.getElementById("mode-toggle");
const geminiApiKeyInput = document.getElementById("gemini-api-key");
const overlay = document.getElementById("processing-overlay");
const modal = document.getElementById("source-modal");
const sampleButton = document.getElementById("sample-button");
const startButton = document.getElementById("start-button");
const warning = document.getElementById("source-warning");

state.previewMode = localStorage.getItem("vibe.previewMode") || "select";

if (geminiApiKeyInput) geminiApiKeyInput.value = localStorage.getItem("vibe.geminiApiKey") || "";

sampleButton.addEventListener("click", () => {
  if (geminiApiKeyInput) geminiApiKeyInput.value = "";
  warning.hidden = true;
});

function withBaseHref(html, url) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const head = doc.head || doc.querySelector("head");
  if (head) {
    const base = doc.createElement("base");
    base.href = url;
    const existing = head.querySelector("base");
    if (existing) existing.remove();
    head.prepend(base);
  }
  return "<!doctype html>\n" + doc.documentElement.outerHTML;
}

startButton.addEventListener("click", async () => {
  warning.hidden = true;

  const apiKey = geminiApiKeyInput?.value?.trim() || "";
  if (!apiKey) {
    alert("Gemini APIキーを入力してください。");
    return;
  }
  localStorage.setItem("vibe.geminiApiKey", apiKey);

  try {
    const demoUrl = new URL("demo/jolt/index.html", window.location.href).toString();
    const baseHref = new URL("demo/jolt/", window.location.href).toString();
    const response = await fetch(demoUrl);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const html = await response.text();
    state.currentSource = withBaseHref(html, baseHref);
  } catch (error) {
    console.error(error);
    warning.hidden = false;
    alert("デモページの読み込みに失敗しました。");
    return;
  }

  state.history = [];
  state.future = [];
  state.selection = null;
  updateHistoryControls();
  modal.style.display = "none";
  renderPreview();
  updateCommandBar();
});

function renderPreview() {
  previewFrame.srcdoc = injectInteraction(state.currentSource);
}

function syncPreviewMode() {
  previewFrame?.contentWindow?.postMessage(
    { type: "vibeditor-mode", mode: state.previewMode },
    "*",
  );
}

previewFrame?.addEventListener("load", () => {
  syncPreviewMode();
});

function injectInteraction(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const style = doc.createElement("style");
  style.textContent = `
    :root {
      --vibe-neon: #49d6ff;
      --vibe-neon2: #7c5cff;
      --vibe-neon-ink: rgba(73, 214, 255, 0.95);
    }
    [data-vibeditor-id] {
      outline: none;
    }
    .vibeditor-hover-overlay {
      position: fixed;
      left: 0;
      top: 0;
      width: 0;
      height: 0;
      border: 1.5px solid rgba(73, 214, 255, 0.85);
      border-radius: 12px;
      box-shadow:
        0 0 0 2px rgba(73, 214, 255, 0.10),
        0 0 20px rgba(73, 214, 255, 0.26),
        0 0 44px rgba(124, 92, 255, 0.18);
      pointer-events: none;
      z-index: 2147483647;
      opacity: 0;
      transform: translateZ(0) scale(0.995);
      transition: opacity 160ms ease, transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
      will-change: opacity, transform, left, top, width, height;
    }
    .vibeditor-hover-overlay.is-visible {
      opacity: 1;
      transform: translateZ(0) scale(1);
    }
    .vibeditor-selection-layer {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 2147483646;
    }
    .vibeditor-selected-box {
      position: fixed;
      left: 0;
      top: 0;
      width: 0;
      height: 0;
      border: 2px solid rgba(73, 214, 255, 0.95);
      border-radius: 12px;
      box-shadow:
        0 0 0 2px rgba(73, 214, 255, 0.12),
        0 0 26px rgba(73, 214, 255, 0.30),
        0 0 56px rgba(124, 92, 255, 0.20);
      transform: translateZ(0);
      transition: opacity 140ms ease, transform 140ms ease;
      will-change: left, top, width, height;
      opacity: 1;
    }
    .vibeditor-selected-label {
      position: fixed;
      left: 0;
      top: 0;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 12px;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: rgba(255, 255, 255, 0.96);
      background: linear-gradient(135deg, rgba(73, 214, 255, 0.92), rgba(124, 92, 255, 0.92));
      box-shadow:
        0 10px 24px rgba(0, 0, 0, 0.22),
        0 0 18px rgba(73, 214, 255, 0.22);
      transform: translateZ(0);
      opacity: 1;
    }
    @media (prefers-reduced-motion: reduce) {
      .vibeditor-hover-overlay { transition: none; }
      .vibeditor-selected-box { transition: none; }
    }
  `;

  const script = doc.createElement("script");
  script.textContent = `
    (() => {
      const supportsHover = window.matchMedia('(hover: hover)').matches;
      let mode = 'select';
      const selection = [];
      let labelIndex = 0;
      const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const hoverOverlay = document.createElement('div');
      hoverOverlay.className = 'vibeditor-hover-overlay';
      document.body.appendChild(hoverOverlay);
      const selectionLayer = document.createElement('div');
      selectionLayer.className = 'vibeditor-selection-layer';
      document.body.appendChild(selectionLayer);

      const selectionOverlays = new Map(); // label -> { box, labelEl, element }
      let pendingHoverFrame = null;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let pendingLayoutFrame = null;

      const notifyParent = () => {
        const targets = selection.map((item) => {
          const clone = item.element.cloneNode(true);
          return {
            label: item.label,
            outerHTML: clone.outerHTML,
            tagName: item.element.tagName.toLowerCase(),
          };
        });
        window.parent.postMessage({
          type: 'selected',
          selectionType: targets.length > 1 ? 'multi' : 'single',
          targets,
        }, '*');
      };

      const scheduleLayout = () => {
        if (pendingLayoutFrame) return;
        pendingLayoutFrame = requestAnimationFrame(() => {
          pendingLayoutFrame = null;
          updateSelectionOverlays();
        });
      };

      const createSelectionOverlay = (label, element) => {
        const box = document.createElement('div');
        box.className = 'vibeditor-selected-box';
        const labelEl = document.createElement('div');
        labelEl.className = 'vibeditor-selected-label';
        labelEl.textContent = label;
        selectionLayer.appendChild(box);
        selectionLayer.appendChild(labelEl);
        selectionOverlays.set(label, { box, labelEl, element });
      };

      const removeSelectionOverlay = (label) => {
        const entry = selectionOverlays.get(label);
        if (!entry) return;
        entry.box.remove();
        entry.labelEl.remove();
        selectionOverlays.delete(label);
      };

      const clearSelectionOverlays = () => {
        selectionOverlays.forEach((_, label) => removeSelectionOverlay(label));
      };

      const updateSelectionOverlays = () => {
        if (mode !== 'select') return;
        selectionOverlays.forEach((entry, label) => {
          if (!entry.element || !entry.element.isConnected) {
            removeSelectionOverlay(label);
            return;
          }
          const rect = entry.element.getBoundingClientRect();
          const w = Math.max(0, rect.width);
          const h = Math.max(0, rect.height);
          if (w === 0 || h === 0) {
            entry.box.style.opacity = '0';
            entry.labelEl.style.opacity = '0';
            return;
          }
          entry.box.style.opacity = '1';
          entry.labelEl.style.opacity = '1';
          entry.box.style.left = rect.left + 'px';
          entry.box.style.top = rect.top + 'px';
          entry.box.style.width = w + 'px';
          entry.box.style.height = h + 'px';

          const labelLeft = Math.max(6, rect.left - 8);
          const labelTop = Math.max(6, rect.top - 14);
          entry.labelEl.style.left = labelLeft + 'px';
          entry.labelEl.style.top = labelTop + 'px';
        });
      };

      const selectElement = (element) => {
        const label = labels[labelIndex] || String(labelIndex + 1);
        labelIndex += 1;
        element.setAttribute('data-vibeditor-id', label);
        selection.push({ element, label });
        createSelectionOverlay(label, element);
        scheduleLayout();
      };

      const deselectElement = (element) => {
        const index = selection.findIndex((item) => item.element === element);
        if (index === -1) return;
        const [{ label }] = selection.splice(index, 1);
        removeSelectionOverlay(label);
        element.removeAttribute('data-vibeditor-id');
        if (selection.length === 0) {
          labelIndex = 0;
        }
        scheduleLayout();
      };

      function clearHover() {
        if (pendingHoverFrame) {
          cancelAnimationFrame(pendingHoverFrame);
          pendingHoverFrame = null;
        }
        hoverOverlay.classList.remove('is-visible');
      }

      window.addEventListener('message', (event) => {
        if (event.data?.type !== 'vibeditor-mode') return;
        mode = event.data.mode === 'interact' ? 'interact' : 'select';
        clearHover();
        if (mode !== 'select') {
          clearSelectionOverlays();
        } else {
          selection.forEach((item) => {
            if (!selectionOverlays.has(item.label)) {
              createSelectionOverlay(item.label, item.element);
            }
          });
          scheduleLayout();
        }
      });

      const onPointerOver = (event) => {
        if (!supportsHover) return;
        if (mode !== 'select') return;
        const target = event.target.closest('body *');
        if (!target) return;
        if (target === hoverOverlay) return;
        if (target.hasAttribute('data-vibeditor-id')) {
          clearHover();
          return;
        }
        const rect = target.getBoundingClientRect();
        if (pendingHoverFrame) cancelAnimationFrame(pendingHoverFrame);
        pendingHoverFrame = requestAnimationFrame(() => {
          pendingHoverFrame = null;
          hoverOverlay.style.left = rect.left + 'px';
          hoverOverlay.style.top = rect.top + 'px';
          hoverOverlay.style.width = rect.width + 'px';
          hoverOverlay.style.height = rect.height + 'px';
          hoverOverlay.classList.add('is-visible');
        });
      };

      const onPointerOut = () => {
        if (!supportsHover) return;
        if (mode !== 'select') return;
        clearHover();
      };

      const onClick = (event) => {
        if (mode !== 'select') return;
        event.preventDefault();
        event.stopPropagation();
        const target = event.target.closest('body *');
        if (!target) return;
        clearHover();
        if (target.hasAttribute('data-vibeditor-id')) {
          deselectElement(target);
        } else {
          selectElement(target);
        }
        notifyParent();
      };

      document.addEventListener('click', onClick, true);
      document.addEventListener('mouseover', onPointerOver);
      document.addEventListener('mouseout', onPointerOut);
      document.addEventListener('submit', (event) => {
        if (mode !== 'select') return;
        event.preventDefault();
        event.stopPropagation();
      }, true);

      window.addEventListener('scroll', scheduleLayout, true);
      window.addEventListener('resize', scheduleLayout);

      window.addEventListener('message', (event) => {
        if (event.data?.type !== 'vibeditor-scroll-to') return;
        const label = event.data.label;
        if (!label) return;
        const target = document.querySelector('[data-vibeditor-id="' + label + '"]');
        if (!target) return;
        target.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'center',
          inline: 'nearest',
        });
        scheduleLayout();
      });
    })();
  `;

  doc.head.appendChild(style);
  doc.body.appendChild(script);
  return "<!doctype html>\n" + doc.documentElement.outerHTML;
}

function updateCommandBar() {
  const selection = state.selection;
  const hasSelection = selection && selection.targets.length > 0;
  instructionInput.disabled = state.isProcessing;
  runButton.disabled = state.isProcessing;
  commandBar.classList.toggle("idle", !hasSelection);
  if (hasSelection) {
    commandBar.classList.remove("engaged");
  }
  renderSelectionStrip();
}

function updateModeToggleUI() {
  if (!modeToggleButton) return;
  const isSelect = state.previewMode !== "interact";
  modeToggleButton.setAttribute("aria-pressed", String(isSelect));
  modeToggleButton.title = isSelect ? "選択モード" : "操作モード";
  modeToggleButton.classList.toggle("toggle-active", !isSelect);
}

if (modeToggleButton) {
  updateModeToggleUI();
  modeToggleButton.addEventListener("click", () => {
    state.previewMode = state.previewMode === "interact" ? "select" : "interact";
    localStorage.setItem("vibe.previewMode", state.previewMode);
    updateModeToggleUI();
    syncPreviewMode();
  });
}

function renderSelectionStrip() {
  if (!selectionStrip) return;
  selectionStrip.replaceChildren();
  const targets = state.selection?.targets ?? [];
  if (targets.length === 0) return;

  targets.forEach((target) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "selection-pill";
    button.textContent = target.label;
    button.setAttribute("aria-label", `${target.label} にスクロール`);
    button.addEventListener("click", () => {
      previewFrame?.contentWindow?.postMessage({ type: "vibeditor-scroll-to", label: target.label }, "*");
    });
    selectionStrip.appendChild(button);
  });
}

function updateHistoryControls() {
  if (backButton) backButton.disabled = state.history.length === 0 || state.isProcessing;
  if (forwardButton) forwardButton.disabled = state.future.length === 0 || state.isProcessing;
}

function setProcessing(value) {
  state.isProcessing = value;
  overlay.hidden = !value;
  updateCommandBar();
  updateHistoryControls();
}

function sanitizeHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script").forEach((el) => {
    const src = (el.getAttribute("src") || "").trim();
    if (!src) {
      el.remove();
      return;
    }
    try {
      const url = new URL(src, "https://example.invalid");
      const isHttps = url.protocol === "https:";
      const isTailwindCdn = url.hostname === "cdn.tailwindcss.com";
      if (isHttps && isTailwindCdn) return;
    } catch {
      // ignore
    }
    el.remove();
  });

  doc.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((attr) => {
      if (attr.name.startsWith("on")) {
        el.removeAttribute(attr.name);
      }
      if (["href", "src"].includes(attr.name) && attr.value.startsWith("javascript:")) {
        el.removeAttribute(attr.name);
      }
      if (attr.name === "data-vibeditor-id") {
        el.removeAttribute(attr.name);
      }
    });
    if (el.classList.contains("vibeditor-badge")) {
      el.remove();
    }
    el.classList.remove("vibeditor-hover");
  });

  return "<!doctype html>\n" + doc.documentElement.outerHTML;
}

function getGeminiSettings() {
  const geminiApiKey = localStorage.getItem("vibe.geminiApiKey") || "";
  return { geminiApiKey };
}

async function mockLLM(payload) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const doc = new DOMParser().parseFromString(payload.source_full, "text/html");
  const labels = payload.target_outerHTMLs.map((html) => {
    const match = html.match(/data-vibeditor-id=\"(.*?)\"/);
    return match ? match[1] : null;
  }).filter(Boolean);

  const instruction = payload.user_instruction;
  if (instruction.includes("削除") || instruction.toLowerCase().includes("remove")) {
    labels.forEach((label) => {
      doc.querySelector(`[data-vibeditor-id="${label}"]`)?.remove();
    });
  }

  if (instruction.includes("逆") || instruction.toLowerCase().includes("swap") || instruction.toLowerCase().includes("reverse")) {
    const elements = labels.map((label) => doc.querySelector(`[data-vibeditor-id="${label}"]`)).filter(Boolean);
    if (elements.length > 1) {
      const parent = elements[0].parentElement;
      if (parent && elements.every((el) => el.parentElement === parent)) {
        const fragment = doc.createDocumentFragment();
        elements.slice().reverse().forEach((el) => fragment.appendChild(el));
        elements.forEach((el) => el.remove());
        parent.appendChild(fragment);
      }
    }
  }

  return { full_html: "<!doctype html>\n" + doc.documentElement.outerHTML };
}

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function extractTextFromOuterHTML(outerHTML, maxLength = 800) {
  const doc = new DOMParser().parseFromString(outerHTML, "text/html");
  const root = doc.body?.firstElementChild;
  if (!root) return "";
  const text = normalizeText(root.textContent || "");
  if (text.length <= maxLength) return text;
  return text.slice(0, Math.max(0, maxLength - 1)) + "…";
}

function buildLLMPayload({ sourceHtml, selectionTargets, instruction }) {
  const targets = selectionTargets.map((target) => ({
    label: target.label,
    tagName: target.tagName,
    outerHTML: target.outerHTML,
    text: extractTextFromOuterHTML(target.outerHTML),
  }));

  return {
    source_full: injectSelectionMarkers(sourceHtml, selectionTargets),
    targets,
    target_outerHTMLs: selectionTargets.map((target) => target.outerHTML),
    target_texts: selectionTargets.map((target) => extractTextFromOuterHTML(target.outerHTML)),
    user_instruction: instruction,
    model: "mock-llm",
  };
}

function buildGeminiPrompt(payload) {
  const selection = Array.isArray(payload?.targets) ? payload.targets : [];
  const selectionSummary = selection
    .map((t) => {
      const label = t?.label ?? "?";
      const tag = t?.tagName ?? "";
      const text = t?.text ? `\nTEXT: ${t.text}` : "";
      return `- ${label}${tag ? ` (${tag})` : ""}${text}\nHTML:\n${t?.outerHTML ?? ""}`;
    })
    .join("\n\n");

  return `あなたはHTML編集アシスタントです。
ユーザーの指示に従ってHTML全文を更新してください。

制約:
- 出力は必ずJSONのみ。
- JSONのキーは {"full_html": "..."} のみ。
- full_html は <!doctype html> を含む完全なHTML文字列。
- 説明文やコードフェンスは出さない。

ユーザー指示:
${payload?.user_instruction ?? ""}

選択要素:
${selectionSummary || "(未選択: 全体を対象として扱ってよい)"}

現在のHTML全文（data-vibeditor-id で選択マーカーが付く場合あり）:
${payload?.source_full ?? ""}`;
}

function extractJsonTextFromGeminiResponse(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  const text = Array.isArray(parts) ? parts.map((p) => p?.text || "").join("") : "";
  return String(text || "").trim();
}

function extractUsageFromGeminiResponse(data) {
  const usage = data?.usageMetadata;
  if (!usage) return null;
  const promptTokens = Number(usage.promptTokenCount);
  const candidatesTokens = Number(usage.candidatesTokenCount);
  const totalTokens = Number(usage.totalTokenCount);
  return {
    prompt_tokens: Number.isFinite(promptTokens) ? promptTokens : null,
    candidates_tokens: Number.isFinite(candidatesTokens) ? candidatesTokens : null,
    total_tokens: Number.isFinite(totalTokens) ? totalTokens : null,
  };
}

function parseJsonLenient(text) {
  const trimmed = String(text || "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Fallback: grab the outermost JSON object.
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) throw new Error("JSONが見つかりません。");
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

async function sendToGeminiInBrowser(payload) {
  const settings = getGeminiSettings();
  if (!settings.geminiApiKey) {
    throw new Error("Gemini APIキーが未設定です。");
  }
  const model = "gemini-2.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(settings.geminiApiKey)}`;
  const prompt = buildGeminiPrompt(payload);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Gemini request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  const usage = extractUsageFromGeminiResponse(data);
  const raw = extractJsonTextFromGeminiResponse(data);
  const parsed = parseJsonLenient(raw);
  return { ...parsed, usage };
}

async function sendToLLM(payload) {
  return sendToGeminiInBrowser(payload);
}

async function runInstruction() {
  if (state.isProcessing) return;
  const instruction = instructionInput.value.trim();
  if (!instruction) return;
  state.lastInstruction = instruction;
  setProcessing(true);

  try {
    const targets = getTargetsForPayload();
    const payload = buildLLMPayload({
      sourceHtml: state.currentSource,
      selectionTargets: targets,
      instruction,
    });

    const response = await sendToLLM(payload);
    if (!response?.full_html) {
      alert("LLMレスポンスが空です。再試行してください。");
      return;
    }

    if (response.usage) {
      console.log("[LLM usage]", response.usage);
    }

    const sanitized = sanitizeHtml(response.full_html);
    if (!sanitized.includes("<html")) {
      alert("生成HTMLが無効です。Undoできます。");
      return;
    }

    state.history.push(state.currentSource);
    state.future = [];
    state.currentSource = sanitized;
    state.selection = null;
    instructionInput.value = "";
    renderPreview();
  } catch (error) {
    console.error(error);
    alert("処理に失敗しました。もう一度お試しください。");
  } finally {
    setProcessing(false);
    updateHistoryControls();
    updateCommandBar();
  }
}

function injectSelectionMarkers(html, targets) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  targets.forEach((target) => {
    if (target.tagName === "body" && doc.body) {
      doc.body.setAttribute("data-vibeditor-id", target.label);
      return;
    }
    if (target.tagName === "html" && doc.documentElement) {
      doc.documentElement.setAttribute("data-vibeditor-id", target.label);
      return;
    }

    const parser = new DOMParser();
    const fragmentDoc = parser.parseFromString(target.outerHTML, "text/html");
    const selectionElement = fragmentDoc.body.firstElementChild;
    if (!selectionElement) return;
    const label = target.label;
    selectionElement.setAttribute("data-vibeditor-id", label);

    const matches = Array.from(doc.querySelectorAll(selectionElement.tagName.toLowerCase()));
    const match = matches.find((el) => el.outerHTML.includes(target.outerHTML.replace(/\sdata-vibeditor-id=\".*?\"/, "")));
    if (match) {
      match.setAttribute("data-vibeditor-id", label);
    }
  });
  return "<!doctype html>\n" + doc.documentElement.outerHTML;
}

function getTargetsForPayload() {
  if (state.selection?.targets?.length) return state.selection.targets;
  const doc = new DOMParser().parseFromString(state.currentSource || sampleHtml, "text/html");
  const root = doc.body || doc.documentElement;
  if (!root) return [];
  root.setAttribute("data-vibeditor-id", "A");
  return [
    {
      label: "A",
      outerHTML: root.outerHTML,
      tagName: root.tagName.toLowerCase(),
    },
  ];
}

runButton.addEventListener("click", runInstruction);

instructionInput.addEventListener("keydown", (event) => {
  if (event.isComposing) return;
  if (event.key !== "Enter") return;

  // Enter: 改行（IME入力を邪魔しない）
  // Cmd/Ctrl+Enter: 送信
  const shouldSend = event.metaKey || event.ctrlKey;
  if (!shouldSend) return;

  event.preventDefault();
  runInstruction();
});

if (backButton) {
  backButton.addEventListener("click", () => {
    if (state.isProcessing) return;
    if (state.history.length === 0) return;
    state.future.push(state.currentSource);
    state.currentSource = state.history.pop();
    state.selection = null;
    renderPreview();
    updateHistoryControls();
    updateCommandBar();
  });
}

if (forwardButton) {
  forwardButton.addEventListener("click", () => {
    if (state.isProcessing) return;
    if (state.future.length === 0) return;
    state.history.push(state.currentSource);
    state.currentSource = state.future.pop();
    state.selection = null;
    renderPreview();
    updateHistoryControls();
    updateCommandBar();
  });
}

// NOTE: Click should not change selection/activation state when nothing is selected.
// Focus only happens when the textarea itself is tapped/clicked.

// Draggable command bar (drag anywhere; drag wins over click).
(() => {
  if (!commandBar) return;

  const storageKey = "vibe.commandBarOffset.v1";
  // Always start from the initial position on reload.
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // ignore
  }

  const setOffset = (x, y) => {
    commandBar.style.setProperty("--cmd-x", `${x}px`);
    commandBar.style.setProperty("--cmd-y", `${y}px`);
  };

  const currentOffset = () => {
    const style = getComputedStyle(commandBar);
    const xRaw = style.getPropertyValue("--cmd-x").trim();
    const yRaw = style.getPropertyValue("--cmd-y").trim();
    const x = parseFloat(xRaw) || 0;
    const y = parseFloat(yRaw) || 0;
    return { x, y };
  };

  const clampOffset = (x, y) => {
    const rect = commandBar.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 8;
    const bottomPx = parseFloat(getComputedStyle(commandBar).bottom) || 0;
    const baseLeft = vw / 2 - rect.width / 2;
    const baseTop = vh - bottomPx - rect.height;

    const minX = margin - baseLeft;
    const maxX = vw - margin - rect.width - baseLeft;
    const minY = margin - baseTop;
    const maxY = vh - margin - rect.height - baseTop;

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

  // Start at default position.
  setOffset(0, 0);

  let drag = null;
  let suppressNextClick = false;

  const dragThresholdPx = 6;

  const endDrag = () => {
    if (!drag) return;
    const wasDragging = drag.isDragging;
    drag = null;
    commandBar.classList.remove("dragging");
    if (wasDragging) suppressNextClick = true;
  };

  window.addEventListener(
    "click",
    (event) => {
      if (!suppressNextClick) return;
      if (!commandBar.contains(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      suppressNextClick = false;
    },
    true,
  );

  commandBar.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    const { x: originX, y: originY } = currentOffset();
    drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX,
      originY,
      isDragging: false,
    };
  });

  commandBar.addEventListener("pointermove", (event) => {
    if (!drag) return;
    if (event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (!drag.isDragging) {
      if (Math.hypot(dx, dy) < dragThresholdPx) return;
      drag.isDragging = true;
      commandBar.classList.add("dragging");
      commandBar.setPointerCapture(event.pointerId);

      if (document.activeElement && commandBar.contains(document.activeElement)) {
        document.activeElement.blur?.();
      }
    }

    const nextX = drag.originX + dx;
    const nextY = drag.originY + dy;
    const clamped = clampOffset(nextX, nextY);
    setOffset(clamped.x, clamped.y);
    event.preventDefault();
  });

  commandBar.addEventListener("pointerup", (event) => {
    if (!drag) return;
    if (event.pointerId !== drag.pointerId) return;
    endDrag();
  });

  commandBar.addEventListener("pointercancel", (event) => {
    if (!drag) return;
    if (event.pointerId !== drag.pointerId) return;
    endDrag();
  });

  // Keep it in-bounds on resize.
  window.addEventListener("resize", () => {
    const { x, y } = currentOffset();
    const clamped = clampOffset(x, y);
    setOffset(clamped.x, clamped.y);
  });
})();

window.addEventListener("message", (event) => {
  if (event.data?.type !== "selected") return;
  state.selection = {
    type: event.data.selectionType,
    targets: event.data.targets,
  };
  updateCommandBar();
});

warning.hidden = true;
updateCommandBar();
updateHistoryControls();

// Liquid Glass - Mouse tracking reflection
const liquidReflection = commandBar.querySelector('.liquid-reflection');
if (liquidReflection) {
  commandBar.addEventListener('pointermove', (event) => {
    const rect = commandBar.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    commandBar.style.setProperty('--mouse-x', `${x}%`);
    commandBar.style.setProperty('--mouse-y', `${y}%`);
  });

  commandBar.addEventListener('pointerleave', () => {
    commandBar.style.setProperty('--mouse-x', '50%');
    commandBar.style.setProperty('--mouse-y', '30%');
  });
}
