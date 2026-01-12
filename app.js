const sampleHtml = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <title>VIBE Sample</title>
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 24px; background: #f5f6fb; }
    header { background: white; padding: 24px; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-top: 24px; }
    .card { background: white; padding: 18px; border-radius: 14px; box-shadow: 0 6px 16px rgba(0,0,0,0.08); }
    .cta { margin-top: 16px; display: inline-block; padding: 10px 16px; background: #5f8bff; color: white; border-radius: 999px; text-decoration: none; }
  </style>
</head>
<body>
  <header>
    <h1>Visual Instruction Browser Editor</h1>
    <p>要素を選択して自然言語で編集指示を出せます。</p>
    <a class="cta" href="#">体験を始める</a>
  </header>
  <section class="cards">
    <article class="card">
      <h2>カードA</h2>
      <p>クリックして選択してください。</p>
    </article>
    <article class="card">
      <h2>カードB</h2>
      <p>複数選択が可能です。</p>
    </article>
    <article class="card">
      <h2>カードC</h2>
      <p>順番入れ替えのデモに使えます。</p>
    </article>
  </section>
</body>
</html>`;

const state = {
  currentSource: "",
  isProcessing: false,
  history: [],
  selectionMode: "click",
  selection: null,
  lastInstruction: "",
};

const previewFrame = document.getElementById("preview");
const commandBar = document.getElementById("command-bar");
const selectionSummary = document.getElementById("selection-summary");
const instructionInput = document.getElementById("instruction-input");
const runButton = document.getElementById("run-button");
const undoButton = document.getElementById("undo-button");
const overlay = document.getElementById("processing-overlay");
const modal = document.getElementById("source-modal");
const sourceInput = document.getElementById("source-input");
const fileInput = document.getElementById("file-input");
const sampleButton = document.getElementById("sample-button");
const startButton = document.getElementById("start-button");
const warning = document.getElementById("source-warning");

sourceInput.value = sampleHtml;

sampleButton.addEventListener("click", () => {
  sourceInput.value = sampleHtml;
  validateSource();
});

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  sourceInput.value = text;
  validateSource();
});

startButton.addEventListener("click", () => {
  const html = sourceInput.value.trim();
  state.currentSource = html || sampleHtml;
  state.history = [];
  state.selection = null;
  updateUndo();
  modal.style.display = "none";
  renderPreview();
  updateCommandBar();
});

sourceInput.addEventListener("input", validateSource);

function validateSource() {
  const text = sourceInput.value.trim();
  const hasHtml = text.includes("<html") && text.includes("</html>");
  warning.hidden = hasHtml || text.length === 0;
}

function renderPreview() {
  previewFrame.srcdoc = injectInteraction(state.currentSource);
}

function injectInteraction(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const style = doc.createElement("style");
  style.textContent = `
    [data-vibeditor-id] {
      outline: 2px solid rgba(127, 91, 255, 0.9);
      outline-offset: 2px;
      position: relative;
    }
    .vibeditor-hover {
      outline: 2px dashed rgba(95, 139, 255, 0.8);
      outline-offset: 2px;
    }
    .vibeditor-badge {
      position: absolute;
      top: -12px;
      left: -12px;
      background: rgba(127, 91, 255, 0.95);
      color: white;
      font-size: 12px;
      font-family: sans-serif;
      padding: 4px 8px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      pointer-events: none;
      z-index: 9999;
    }
  `;

  const script = doc.createElement("script");
  script.textContent = `
    (() => {
      const supportsHover = window.matchMedia('(hover: hover)').matches;
      const selection = [];
      let labelIndex = 0;
      const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

      const notifyParent = () => {
        const targets = selection.map((item) => {
          const clone = item.element.cloneNode(true);
          clone.querySelectorAll('.vibeditor-badge').forEach((badge) => badge.remove());
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

      const createBadge = (label) => {
        const badge = document.createElement('span');
        badge.className = 'vibeditor-badge';
        badge.textContent = label;
        return badge;
      };

      const selectElement = (element) => {
        const label = labels[labelIndex] || String(labelIndex + 1);
        labelIndex += 1;
        element.setAttribute('data-vibeditor-id', label);
        const badge = createBadge(label);
        element.appendChild(badge);
        selection.push({ element, label, badge });
      };

      const deselectElement = (element) => {
        const index = selection.findIndex((item) => item.element === element);
        if (index === -1) return;
        const [{ badge }] = selection.splice(index, 1);
        badge?.remove();
        element.removeAttribute('data-vibeditor-id');
        if (selection.length === 0) {
          labelIndex = 0;
        }
      };

      const clearHover = () => {
        document.querySelectorAll('.vibeditor-hover').forEach((el) => {
          el.classList.remove('vibeditor-hover');
        });
      };

      const onPointerOver = (event) => {
        if (!supportsHover) return;
        const target = event.target.closest('body *');
        if (!target) return;
        clearHover();
        if (!target.hasAttribute('data-vibeditor-id')) {
          target.classList.add('vibeditor-hover');
        }
      };

      const onPointerOut = () => {
        if (!supportsHover) return;
        clearHover();
      };

      const onClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target.closest('body *');
        if (!target || target.classList.contains('vibeditor-badge')) return;
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
        event.preventDefault();
        event.stopPropagation();
      }, true);
    })();
  `;

  doc.head.appendChild(style);
  doc.body.appendChild(script);
  return "<!doctype html>\n" + doc.documentElement.outerHTML;
}

function updateCommandBar() {
  const selection = state.selection;
  const hasSelection = selection && selection.targets.length > 0;
  instructionInput.disabled = !hasSelection || state.isProcessing;
  runButton.disabled = !hasSelection || state.isProcessing;
  commandBar.classList.toggle("idle", !hasSelection);

  if (!hasSelection) {
    selectionSummary.textContent = "要素を選択してください";
    return;
  }

  const labels = selection.targets.map((target) => `${target.label}:${target.tagName}`).join(" / ");
  selectionSummary.textContent = `選択中: ${labels}`;
}

function updateUndo() {
  undoButton.disabled = state.history.length === 0 || state.isProcessing;
}

function setProcessing(value) {
  state.isProcessing = value;
  overlay.hidden = !value;
  updateCommandBar();
  updateUndo();
}

function sanitizeHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script").forEach((el) => el.remove());

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

async function runInstruction() {
  if (!state.selection || state.isProcessing) return;
  const instruction = instructionInput.value.trim();
  if (!instruction) return;
  state.lastInstruction = instruction;
  setProcessing(true);

  try {
    const payload = {
      source_full: injectSelectionMarkers(state.currentSource, state.selection.targets),
      target_outerHTMLs: state.selection.targets.map((target) => target.outerHTML),
      user_instruction: instruction,
      model: "mock-llm",
    };

    const response = await mockLLM(payload);
    if (!response?.full_html) {
      alert("LLMレスポンスが空です。再試行してください。");
      return;
    }

    const sanitized = sanitizeHtml(response.full_html);
    if (!sanitized.includes("<html")) {
      alert("生成HTMLが無効です。Undoできます。");
      return;
    }

    state.history.push(state.currentSource);
    state.currentSource = sanitized;
    state.selection = null;
    instructionInput.value = "";
    renderPreview();
  } catch (error) {
    console.error(error);
    alert("処理に失敗しました。もう一度お試しください。");
  } finally {
    setProcessing(false);
    updateUndo();
    updateCommandBar();
  }
}

function injectSelectionMarkers(html, targets) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  targets.forEach((target) => {
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

runButton.addEventListener("click", runInstruction);

instructionInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    runInstruction();
  }
});

undoButton.addEventListener("click", () => {
  if (state.history.length === 0) return;
  state.currentSource = state.history.pop();
  renderPreview();
  updateUndo();
});

window.addEventListener("message", (event) => {
  if (event.data?.type !== "selected") return;
  state.selection = {
    type: event.data.selectionType,
    targets: event.data.targets,
  };
  updateCommandBar();
});

validateSource();
updateCommandBar();
updateUndo();
