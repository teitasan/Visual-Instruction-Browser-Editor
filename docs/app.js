const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>VIBE サンプル</title>
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
      <ul>
        <li>箇条書き1</li>
        <li>箇条書き2</li>
      </ul>
      <a class="cta" href="https://example.com">購入する</a>
    </div>
  </body>
</html>`;

const elements = {
  iframe: document.getElementById('preview'),
  overlay: document.getElementById('loading-overlay'),
  modal: document.getElementById('source-modal'),
  sourceInput: document.getElementById('source-input'),
  sourceError: document.getElementById('source-error'),
  loadSource: document.getElementById('load-source'),
  loadFile: document.getElementById('load-file'),
  loadSample: document.getElementById('load-sample'),
  copySource: document.getElementById('copy-source'),
  openSource: document.getElementById('open-source'),
  fileInput: document.getElementById('file-input'),
  labels: document.getElementById('selection-labels'),
  targets: document.getElementById('selection-targets'),
  instructionInput: document.getElementById('instruction-input'),
  runInstruction: document.getElementById('run-instruction'),
  undo: document.getElementById('undo'),
};

const state = {
  currentSource: '',
  isProcessing: false,
  history: [],
  selection: null,
  lastInstruction: '',
};

const VIBE_MESSAGE_TYPE = 'selected';
const VIBE_INJECTED_ATTR = 'data-vibe-injected';
const VIBE_BADGE_ATTR = 'data-vibe-badge';

const htmlIncludesRoot = (value) => {
  return /<html[\s>]/i.test(value) && /<body[\s>]/i.test(value);
};

const setProcessing = (next) => {
  state.isProcessing = next;
  elements.overlay.classList.toggle('hidden', !next);
  elements.instructionInput.disabled = next || !state.selection;
  elements.runInstruction.disabled = next || !state.selection;
  elements.undo.disabled = next || state.history.length === 0;
};

const updateCommandBar = () => {
  if (!state.selection || state.selection.targets.length === 0) {
    elements.labels.textContent = '要素を選択してください';
    elements.targets.textContent = '';
    elements.instructionInput.disabled = true;
    elements.runInstruction.disabled = true;
  } else {
    const labels = state.selection.targets.map((target) => target.label).join(', ');
    const summaries = state.selection.targets
      .map((target) => `${target.label}: <${target.tagName ?? 'div'}>`)
      .join(' · ');
    elements.labels.textContent = `選択中: ${labels}`;
    elements.targets.textContent = summaries;
    elements.instructionInput.disabled = state.isProcessing;
    elements.runInstruction.disabled = state.isProcessing;
  }
  elements.undo.disabled = state.isProcessing || state.history.length === 0;
};

const updateIframe = (html) => {
  elements.iframe.srcdoc = buildIframeHtml(html);
};

const openModal = () => {
  elements.modal.classList.remove('hidden');
  elements.sourceInput.value = state.currentSource;
  elements.sourceError.textContent = '';
};

const closeModal = () => {
  elements.modal.classList.add('hidden');
  elements.sourceError.textContent = '';
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
      if (attr.name === VIBE_BADGE_ATTR) {
        node.removeAttribute(attr.name);
      }
    });
  });
  doc.querySelectorAll(`[${VIBE_BADGE_ATTR}]`).forEach((node) => node.remove());
};

const sanitizeHtml = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  sanitizeDocument(doc);
  return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
};

const extractSourceWithLabels = () => {
  const doc = elements.iframe.contentDocument;
  if (!doc) {
    return state.currentSource;
  }
  const clone = doc.documentElement.cloneNode(true);
  clone.querySelectorAll(`[${VIBE_INJECTED_ATTR}]`).forEach((node) => node.remove());
  clone.querySelectorAll(`[${VIBE_BADGE_ATTR}]`).forEach((node) => node.remove());
  return `<!DOCTYPE html>\n${clone.outerHTML}`;
};

const buildIframeHtml = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const styleTag = doc.createElement('style');
  styleTag.setAttribute(VIBE_INJECTED_ATTR, 'true');
  styleTag.textContent = `
    [data-vibeditor-id] { outline: 2px solid transparent; outline-offset: 3px; position: relative; }
    [data-vibeditor-id].vibe-hover { outline-color: rgba(59, 130, 246, 0.65); }
    [data-vibeditor-id].vibe-selected { outline-color: rgba(248, 113, 113, 0.9); }
    .vibe-badge {
      position: absolute;
      top: -10px;
      left: -10px;
      background: rgba(248, 113, 113, 0.95);
      color: #0f172a;
      font-weight: 700;
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 8px;
      box-shadow: 0 6px 14px rgba(15, 23, 42, 0.3);
      pointer-events: none;
    }
  `;
  doc.head.appendChild(styleTag);

  const scriptTag = doc.createElement('script');
  scriptTag.setAttribute(VIBE_INJECTED_ATTR, 'true');
  scriptTag.textContent = `
    const SELECTED_MESSAGE = ${JSON.stringify(VIBE_MESSAGE_TYPE)};
    const badgeAttr = ${JSON.stringify(VIBE_BADGE_ATTR)};
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const selectionOrder = [];
    const labelMap = new Map();
    let nextIndex = 0;

    const indexToLabel = (index) => {
      let value = index + 1;
      let label = '';
      while (value > 0) {
        const remainder = (value - 1) % 26;
        label = alphabet[remainder] + label;
        value = Math.floor((value - 1) / 26);
      }
      return label;
    };

    const sendSelection = () => {
      const targets = selectionOrder.map((node) => {
        const clone = node.cloneNode(true);
        const badge = clone.querySelector('[' + badgeAttr + ']');
        if (badge) badge.remove();
        return {
          label: labelMap.get(node),
          outerHTML: clone.outerHTML,
          tagName: node.tagName.toLowerCase(),
        };
      });
      window.parent.postMessage({
        type: SELECTED_MESSAGE,
        selectionType: targets.length > 1 ? 'multi' : 'single',
        targets,
      }, '*');
    };

    const addBadge = (node, label) => {
      const badge = document.createElement('span');
      badge.className = 'vibe-badge';
      badge.textContent = label;
      badge.setAttribute(badgeAttr, 'true');
      node.appendChild(badge);
    };

    const removeBadge = (node) => {
      const badge = node.querySelector('[' + badgeAttr + ']');
      if (badge) badge.remove();
    };

    const toggleSelection = (node) => {
      const existingIndex = selectionOrder.indexOf(node);
      if (existingIndex >= 0) {
        selectionOrder.splice(existingIndex, 1);
        node.classList.remove('vibe-selected');
        removeBadge(node);
        node.removeAttribute('data-vibeditor-id');
        labelMap.delete(node);
        if (selectionOrder.length === 0) {
          nextIndex = 0;
        }
        sendSelection();
        return;
      }

      const label = indexToLabel(nextIndex);
      nextIndex += 1;
      selectionOrder.push(node);
      labelMap.set(node, label);
      node.setAttribute('data-vibeditor-id', label);
      node.classList.add('vibe-selected');
      addBadge(node, label);
      sendSelection();
    };

    const preventDefaultEvents = (event) => {
      const target = event.target.closest('body *');
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener('click', (event) => {
      if (event.target.closest('[' + badgeAttr + ']')) return;
      const target = event.target.closest('body *');
      if (!target || target === document.body) return;
      event.preventDefault();
      event.stopPropagation();
      toggleSelection(target);
    });

    document.addEventListener('mouseover', (event) => {
      const target = event.target.closest('body *');
      if (!target || target === document.body) return;
      target.classList.add('vibe-hover');
    });

    document.addEventListener('mouseout', (event) => {
      const target = event.target.closest('body *');
      if (!target || target === document.body) return;
      target.classList.remove('vibe-hover');
    });

    document.addEventListener('submit', preventDefaultEvents);
    document.addEventListener('dragstart', preventDefaultEvents);
  `;
  doc.body.appendChild(scriptTag);

  return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
};

const applyMockLlmEdit = (html, instruction, selection) => {
  if (!selection || selection.targets.length === 0) {
    return html;
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  selection.targets.forEach((target) => {
    const node = doc.querySelector(`[data-vibeditor-id="${target.label}"]`);
    if (!node) {
      return;
    }
    const currentText = node.textContent ?? '';
    node.textContent = `${currentText} (${instruction})`;
  });
  return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
};

const handleSelectionMessage = (payload) => {
  if (!payload || payload.type !== VIBE_MESSAGE_TYPE) {
    return;
  }
  state.selection = payload.targets.length
    ? {
        type: payload.selectionType,
        targets: payload.targets,
      }
    : null;
  updateCommandBar();
};

const handleRunInstruction = async () => {
  if (!state.selection) {
    return;
  }
  const instruction = elements.instructionInput.value.trim();
  if (!instruction) {
    return;
  }
  setProcessing(true);

  const sourceWithLabels = extractSourceWithLabels();
  const payload = {
    source_full: sourceWithLabels,
    target_outerHTMLs: state.selection.targets.map((target) => target.outerHTML),
    user_instruction: instruction,
    model: 'demo-llm',
  };

  const mockOutputHtml = applyMockLlmEdit(sourceWithLabels, instruction, state.selection);
  const sanitized = sanitizeHtml(mockOutputHtml);

  await new Promise((resolve) => setTimeout(resolve, 800));

  state.history.push(state.currentSource);
  state.currentSource = sanitized;
  state.lastInstruction = instruction;
  elements.instructionInput.value = '';
  setProcessing(false);
  updateIframe(state.currentSource);

  console.info('LLM payload', payload);
};

const handleUndo = () => {
  if (state.history.length === 0) {
    return;
  }
  const previous = state.history.pop();
  state.currentSource = previous;
  updateIframe(state.currentSource);
  updateCommandBar();
};

const handleLoadSource = (value) => {
  const trimmed = value.trim();
  if (!htmlIncludesRoot(trimmed)) {
    elements.sourceError.textContent = 'HTML構造が不足しています。<html>と<body>を含めてください。';
    return;
  }
  elements.sourceError.textContent = '';
  state.currentSource = trimmed;
  state.history = [];
  state.selection = null;
  updateIframe(state.currentSource);
  updateCommandBar();
  closeModal();
};

window.addEventListener('message', (event) => {
  handleSelectionMessage(event.data);
});

elements.loadSource.addEventListener('click', () => {
  handleLoadSource(elements.sourceInput.value);
});

elements.loadSample.addEventListener('click', () => {
  elements.sourceInput.value = DEFAULT_HTML;
  handleLoadSource(DEFAULT_HTML);
});

elements.loadFile.addEventListener('click', () => {
  elements.fileInput.click();
});

elements.fileInput.addEventListener('change', async (event) => {
  const [file] = event.target.files ?? [];
  if (!file) {
    return;
  }
  const contents = await file.text();
  elements.sourceInput.value = contents;
  handleLoadSource(contents);
  event.target.value = '';
});

elements.copySource.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(elements.sourceInput.value);
  } catch (error) {
    console.warn('コピーに失敗しました', error);
  }
});

elements.openSource.addEventListener('click', () => {
  openModal();
});

elements.runInstruction.addEventListener('click', handleRunInstruction);

elements.undo.addEventListener('click', handleUndo);

elements.instructionInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleRunInstruction();
  }
});

state.currentSource = DEFAULT_HTML;
openModal();
updateIframe(state.currentSource);
updateCommandBar();
setProcessing(false);
