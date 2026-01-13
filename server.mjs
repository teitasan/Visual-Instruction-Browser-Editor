import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = Number(process.env.PORT || 8787);
const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const json = (res, status, data) => {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
};

const text = (res, status, data, contentType = "text/plain; charset=utf-8") => {
  res.writeHead(status, { "Content-Type": contentType });
  res.end(data);
};

const safeJoin = (baseDir, urlPath) => {
  const decoded = decodeURIComponent(urlPath);
  const rel = decoded.replace(/^\/+/, "");
  const resolved = path.resolve(baseDir, rel);
  if (!resolved.startsWith(baseDir + path.sep) && resolved !== baseDir) return null;
  return resolved;
};

const contentTypeFor = (p) => {
  const ext = path.extname(p).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".js" || ext === ".mjs") return "text/javascript; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".svg") return "image/svg+xml; charset=utf-8";
  return "application/octet-stream";
};

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf-8");
  if (!raw) return null;
  return JSON.parse(raw);
}

function buildPrompt(payload) {
  const selection = Array.isArray(payload?.targets) ? payload.targets : [];
  const selectionSummary = selection
    .map((t) => {
      const label = t?.label ?? "?";
      const tag = t?.tagName ?? "";
      const textSnippet = t?.text ? `\nTEXT: ${t.text}` : "";
      return `- ${label}${tag ? ` (${tag})` : ""}${textSnippet}\nHTML:\n${t?.outerHTML ?? ""}`;
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

async function handleLLM(req, res) {
  if (!ai) {
    json(res, 500, { error: "GEMINI_API_KEY が未設定です。" });
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (e) {
    json(res, 400, { error: "JSONが不正です。" });
    return;
  }

  const prompt = buildPrompt(payload);
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const raw = response?.text ?? "";
    const usage = response?.usageMetadata
      ? {
          prompt_tokens: Number(response.usageMetadata.promptTokenCount ?? null),
          candidates_tokens: Number(response.usageMetadata.candidatesTokenCount ?? null),
          total_tokens: Number(response.usageMetadata.totalTokenCount ?? null),
        }
      : null;
    const trimmed = raw.trim();
    const parsed = JSON.parse(trimmed);
    if (!parsed?.full_html) {
      json(res, 502, { error: "LLMの返答に full_html がありません。", raw: trimmed, usage });
      return;
    }
    json(res, 200, { full_html: parsed.full_html, usage });
  } catch (e) {
    json(res, 502, { error: "LLM呼び出しに失敗しました。", message: String(e?.message || e) });
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const fullPath = safeJoin(__dirname, pathname);
  if (!fullPath) {
    text(res, 403, "Forbidden");
    return;
  }

  try {
    const st = await stat(fullPath);
    if (st.isDirectory()) {
      text(res, 404, "Not found");
      return;
    }
    const data = await readFile(fullPath);
    res.writeHead(200, { "Content-Type": contentTypeFor(fullPath) });
    res.end(data);
  } catch {
    text(res, 404, "Not found");
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "POST" && url.pathname === "/api/llm") {
    await handleLLM(req, res);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/fetch") {
    const target = url.searchParams.get("url");
    if (!target) {
      json(res, 400, { error: "url が必要です。" });
      return;
    }
    let parsed;
    try {
      parsed = new URL(target);
    } catch {
      json(res, 400, { error: "url が不正です。" });
      return;
    }
    if (!["http:", "https:"].includes(parsed.protocol)) {
      json(res, 400, { error: "http/https のみ対応です。" });
      return;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const upstream = await fetch(parsed.toString(), {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent": "VIBE/1.0 (+local)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      clearTimeout(timeout);
      if (!upstream.ok) {
        json(res, upstream.status, { error: `fetch failed: ${upstream.status}` });
        return;
      }
      const html = await upstream.text();
      text(res, 200, html, "text/html; charset=utf-8");
    } catch (e) {
      json(res, 502, { error: "fetch に失敗しました。", message: String(e?.message || e) });
    }
    return;
  }

  if (req.method === "GET" || req.method === "HEAD") {
    await serveStatic(req, res);
    return;
  }

  text(res, 405, "Method not allowed");
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`VIBE server listening on http://localhost:${port}`);
  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.log("GEMINI_API_KEY が未設定です。/api/llm は 500 を返します。");
  }
});
