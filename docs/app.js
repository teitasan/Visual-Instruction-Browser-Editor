const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>サンプル</title>
    <style>
      body { font-family: sans-serif; padding: 16px; }
      .card { border: 1px solid #ddd; padding: 12px; border-radius: 8px; }
      .cta { background: #2563eb; color: white; padding: 8px 12px; border-radius: 6px; display: inline-block; }
    </style>
  </head>
  <body>
    <h1>VIBE サンプル</h1>
    <div class="card">
      <p>このテキストを選択して指示を出してください。</p>
      <a class="cta" href="https://example.com">購入する</a>
    </div>
  </body>
</html>`;

const elements = {
  htmlInput: document.getElementById('html-input'),
  loadButton: document.getElementById('load-html'),
  iframe: document.getElementById('preview'),
  instructionInput: document.getElementById('instruction-input'),
  generateButton: document.getElementById('generate'),
  undoButton: document.getElementById('undo'),
  selectedIds: document.getElementById('selected-ids'),
  historyCount: document.getElementById('history-count'),
  payloadLog: document.getElementById('payload-log'),
};

const state = {
  sourceFullHtml: DEFAULT_HTML,
  targetOuterHtmls: [],
  selectedIds: [],
  commandHistory: [],
};

const VIBE_POST_MESSAGE_TYPE = 'vibe-editor';

const INDEX_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const indexToLabel = (index) => {
  let value = index + 1;
  let label = '';
  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = INDEX_ALPHABET[remainder] + label;
    value = Math.floor((value - 1) / 26);
  }
  return label;
};

const removeDangerousUrl = (value) => {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) {
    return '';
  }
  return value;
};

const sanitizeDocument = (doc) => {
  doc.querySelectorAll('script').forEach((node) => node.remove());
  doc.querySelectorAll('*').forEach((node) => {
    [...node.attributes].forEach((attr) => {
      if (attr.name.startsWith('on')) {
        node.removeAttribute(attr.name);
        return;
      }
      if (attr.name === 'href' || attr.name === 'src') {
        const safeValue = removeDangerousUrl(attr.value);
        if (safeValue === '') {
          node.removeAttribute(attr.name);
        } else if (safeValue !== attr.value) {
          node.setAttribute(attr.name, safeValue);
        }
      }
      if (attr.name === 'data-vibeditor-id') {
        node.removeAttribute(attr.name);
      }
    });
  });
};

const sanitizeHtml = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  sanitizeDocument(doc);
  return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
};

const applyVibeIds = (doc) => {
  const allElements = [...doc.body.querySelectorAll('*')].filter((node) => {
    return !['SCRIPT', 'STYLE', 'LINK', 'META', 'TITLE'].includes(node.tagName);
  });
  allElements.forEach((node, index) => {
    node.setAttribute('data-vibeditor-id', indexToLabel(index));
  });
  return allElements;
};

const buildIframeHtml = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const labelled = applyVibeIds(doc);

  const styleTag = doc.createElement('style');
  styleTag.textContent = `
    [data-vibeditor-id].vibe-selected { outline: 2px solid #f97316; outline-offset: 2px; }
    [data-vibeditor-id] { cursor: pointer; }
  `;
  doc.head.appendChild(styleTag);

  const scriptTag = doc.createElement('script');
  scriptTag.textContent = `
    const messageType = ${JSON.stringify(VIBE_POST_MESSAGE_TYPE)};
    let lastSelected = null;
    document.addEventListener('click', (event) => {
      const target = event.target.closest('[data-vibeditor-id]');
      if (!target) return;
      if (lastSelected) {
        lastSelected.classList.remove('vibe-selected');
      }
      target.classList.add('vibe-selected');
      lastSelected = target;
      window.parent.postMessage({
        type: messageType,
        action: 'selection-changed',
        selectedIds: [target.dataset.vibeditorId],
      }, '*');
    });
  `;
  doc.body.appendChild(scriptTag);

  if (labelled.length === 0) {
    return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
  }

  return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
};

const render = () => {
  elements.iframe.srcdoc = buildIframeHtml(state.sourceFullHtml);
  elements.selectedIds.textContent = state.selectedIds.length
    ? state.selectedIds.join(', ')
    : 'なし';
  elements.historyCount.textContent = String(state.commandHistory.length);
};

const updatePayloadLog = (payload, result) => {
  elements.payloadLog.textContent = JSON.stringify(
    {
      input: payload,
      output: result,
    },
    null,
    2,
  );
};

const collectTargetOuterHtmls = () => {
  if (state.selectedIds.length === 0) {
    return [];
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(state.sourceFullHtml, 'text/html');
  const elementsMap = new Map(
    [...doc.querySelectorAll('[data-vibeditor-id]')].map((node) => [
      node.getAttribute('data-vibeditor-id'),
      node,
    ]),
  );
  return state.selectedIds
    .map((id) => elementsMap.get(id))
    .filter(Boolean)
    .map((node) => node.outerHTML);
};

const applyMockLlmEdit = (html, instruction, selectedIds) => {
  if (selectedIds.length === 0) {
    return html;
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  selectedIds.forEach((id) => {
    const target = doc.querySelector(`[data-vibeditor-id="${id}"]`);
    if (!target) {
      return;
    }
    const currentText = target.textContent ?? '';
    target.textContent = `${currentText} (${instruction})`;
  });
  return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
};

const handleGenerate = () => {
  const instruction = elements.instructionInput.value.trim();
  const payload = {
    source_full: state.sourceFullHtml,
    target_outerHTMLs: collectTargetOuterHtmls(),
    user_instruction: instruction,
  };

  const mockOutputHtml = applyMockLlmEdit(
    state.sourceFullHtml,
    instruction || '編集済み',
    state.selectedIds,
  );
  const sanitized = sanitizeHtml(mockOutputHtml);

  state.commandHistory.push({
    beforeHtml: state.sourceFullHtml,
    afterHtml: sanitized,
    userInstruction: instruction,
    timestamp: Date.now(),
  });

  state.sourceFullHtml = sanitized;
  updatePayloadLog(payload, { full_html: sanitized });
  render();
};

const handleUndo = () => {
  const last = state.commandHistory.pop();
  if (!last) {
    return;
  }
  state.sourceFullHtml = last.beforeHtml;
  state.selectedIds = [];
  updatePayloadLog(null, null);
  render();
};

const handleLoadHtml = () => {
  const input = elements.htmlInput.value.trim();
  state.sourceFullHtml = input.length ? input : DEFAULT_HTML;
  state.selectedIds = [];
  state.commandHistory = [];
  updatePayloadLog(null, null);
  render();
};

window.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== VIBE_POST_MESSAGE_TYPE) {
    return;
  }
  if (data.action === 'selection-changed') {
    state.selectedIds = data.selectedIds ?? [];
    render();
  }
});

elements.htmlInput.value = DEFAULT_HTML;

handleLoadHtml();

elements.loadButton.addEventListener('click', handleLoadHtml);

elements.generateButton.addEventListener('click', handleGenerate);

elements.undoButton.addEventListener('click', handleUndo);
