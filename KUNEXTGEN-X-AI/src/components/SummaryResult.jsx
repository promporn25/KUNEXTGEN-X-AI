import { useEffect, useMemo, useState } from "react";
import ExportButton from "./ExportButton";
import { apiUrl } from "../lib/api-base";

const SUMMARIZE_API = apiUrl("/api/summarize");

function cleanMarkdown(text = "") {
  return String(text)
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*/g, "")
    .trim();
}

function isHeading(line = "") {
  const trimmed = line.trim();
  return (
    /^#{1,6}\s+/.test(trimmed) ||
    /^\d+(\.\d+)*\s+/.test(trimmed) ||
    /^\d+(\.\d+)*[:.)]\s*/.test(trimmed)
  );
}

function renderLines(raw = "") {
  return raw
    .split("\n")
    .map((line) => cleanMarkdown(line))
    .filter((line) => line.trim())
    .map((line, i) => {
      if (/^#{2,6}\s*/.test(line) || /^\d+(\.\d+)*\s+/.test(line)) {
        return (
          <h2 key={i} style={{ textAlign: "left" }}>
            {line.replace(/^#+\s*/, "")}
          </h2>
        );
      }

      if (/^#\s*/.test(line)) {
        return (
          <h3 key={i} style={{ textAlign: "left" }}>
            {line.replace(/^#+\s*/, "")}
          </h3>
        );
      }

      if (/^[-\u2022*]/.test(line) || /^\d+\./.test(line)) {
        return (
          <ul key={i}>
            <li style={{ textAlign: "left" }}>
              {line.replace(/^[-\u2022*]\s*/, "").replace(/^\d+\.\s*/, "")}
            </li>
          </ul>
        );
      }

      return (
        <p key={i} style={{ textAlign: "left" }}>
          {line}
        </p>
      );
    });
}

function tokenize(text = "") {
  return cleanMarkdown(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 3);
}

function parseSummarySections(raw = "") {
  const lines = String(raw).split("\n");
  const sections = [];
  let current = null;

  lines.forEach((line) => {
    const trimmed = cleanMarkdown(line);
    if (!trimmed) return;

    if (isHeading(line)) {
      if (current) sections.push(current);
      current = { title: trimmed.replace(/^#+\s*/, ""), lines: [] };
      return;
    }

    if (!current) {
      current = {
        title: trimmed.slice(0, 48) || `หัวข้อ ${sections.length + 1}`,
        lines: [],
      };
    }

    current.lines.push(trimmed);
  });

  if (current) sections.push(current);

  return sections
    .map((section, index) => ({
      id: `summary-section-${index + 1}`,
      title: section.title || `หัวข้อ ${index + 1}`,
      body: section.lines.join("\n"),
    }))
    .filter((section) => section.title || section.body);
}

function parseSourceSections(sourceText = "") {
  const blocks = String(sourceText)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (!blocks.length) return [];

  return blocks.slice(0, 12).map((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const firstLine = lines[0] || "";

    return {
      id: `source-section-${index + 1}`,
      label: `ย่อหน้า ${index + 1}`,
      title: firstLine.length <= 90 ? firstLine : `Section ${index + 1}`,
      content: block,
      excerpt: block.slice(0, 220),
    };
  });
}

function buildSectionTrace(summarySections, sourceSections) {
  if (!summarySections.length || !sourceSections.length) return [];

  return summarySections.map((section, index) => {
    const summaryTokens = new Set(tokenize(`${section.title} ${section.body}`));
    let best = sourceSections[index] || sourceSections[0];
    let bestScore = -1;

    sourceSections.forEach((source, sourceIndex) => {
      const sourceTokens = tokenize(`${source.title} ${source.content}`);
      const overlap = sourceTokens.filter((token) => summaryTokens.has(token)).length;
      const orderBonus = Math.max(0, 4 - Math.abs(sourceIndex - index));
      const score = overlap * 3 + orderBonus;

      if (score > bestScore) {
        bestScore = score;
        best = source;
      }
    });

    return {
      summaryId: section.id,
      summaryTitle: section.title,
      sourceLabel: best?.label || `Section ${index + 1}`,
      sourceTitle: best?.title || `Section ${index + 1}`,
      sourceExcerpt: best?.excerpt || "",
    };
  });
}

const TITLES = {
  summary: "บทสรุป",
  keypoints: "Key Points",
  keywords: "คำสำคัญ",
};

export default function SummaryResult({
  result,
  mode,
  fileName,
  sourceText,
  sourceSections = [],
  initialLang = "th",
}) {
  const baseLang = initialLang === "en" ? "en" : "th";
  const [viewLang, setViewLang] = useState(baseLang);
  const [translations, setTranslations] = useState({ th: "", en: "" });
  const [translating, setTranslating] = useState(false);
  const [activeTraceIndex, setActiveTraceIndex] = useState(0);
  const [traceOpen, setTraceOpen] = useState(false);

  const baseText = result?.raw || "";
  const displayText = viewLang === baseLang ? baseText : translations[viewLang] || baseText;

  useEffect(() => {
    setTranslations({ th: "", en: "" });
    setViewLang(baseLang);
  }, [baseLang, baseText]);

  useEffect(() => {
    setActiveTraceIndex(0);
  }, [displayText, sourceText]);

  const summarySections = useMemo(() => parseSummarySections(displayText), [displayText]);
  const resolvedSourceSections = useMemo(
    () => (sourceSections?.length ? sourceSections : parseSourceSections(sourceText)),
    [sourceSections, sourceText]
  );
  const sectionTrace = useMemo(
    () => buildSectionTrace(summarySections, resolvedSourceSections),
    [summarySections, resolvedSourceSections]
  );

  const translateTo = async (targetLang) => {
    if (targetLang === baseLang) {
      setViewLang(baseLang);
      return;
    }

    if (translations[targetLang]) {
      setViewLang(targetLang);
      return;
    }

    setTranslating(true);
    try {
      const response = await fetch(SUMMARIZE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText || baseText,
          mode,
          lang: targetLang,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "translate failed");
      }

      setTranslations((prev) => ({ ...prev, [targetLang]: data.result || "" }));
      setViewLang(targetLang);
    } catch (error) {
      console.error("translate result failed", error);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="result-container with-trace-drawer">
      <div className="result-header">
        <span className="result-title">{TITLES[mode] || "ผลลัพธ์"}</span>

        <div className="result-toolbar">
          <div className="summary-lang-toggle">
            <button
              type="button"
              className={`summary-lang-btn${viewLang === "th" ? " active" : ""}`}
              onClick={() => translateTo("th")}
            >
              TH
            </button>
            <button
              type="button"
              className={`summary-lang-btn${viewLang === "en" ? " active" : ""}`}
              onClick={() => translateTo("en")}
              disabled={translating}
            >
              {translating ? "..." : "EN"}
            </button>
          </div>

          <ExportButton`r`n            result={{ ...result, raw: displayText }}`r`n            mode={mode}`r`n            fileName={fileName}`r`n            lang={viewLang}`r`n          />

          <span className="result-badge">{viewLang === "en" ? "English View" : "สำเร็จ"}</span>
        </div>
      </div>

      {!!sectionTrace.length && (
        <>
          <button
            type="button"
            className={`trace-side-tab${traceOpen ? " open" : ""}`}
            aria-expanded={traceOpen}
            onClick={() => setTraceOpen((prev) => !prev)}
          >
            <span className="trace-side-tab-label">Section Trace</span>
            <span className="trace-side-tab-arrow">{traceOpen ? ">" : "<"}</span>
          </button>

          <aside className={`trace-drawer${traceOpen ? " open" : ""}`}>
            <div className="trace-drawer-head">
              <div className="section-trace-title">Section Trace</div>
              <button
                type="button"
                className="trace-drawer-close"
                onClick={() => setTraceOpen(false)}
                aria-label="Close section trace"
              >
                x
              </button>
            </div>

            <div className="trace-drawer-body">
              <div className="section-trace-grid">
                {sectionTrace.map((item, index) => (
                  <button
                    key={`${item.summaryId}-${index}`}
                    type="button"
                    className="section-trace-card"
                    aria-pressed={activeTraceIndex === index}
                    onClick={() => {
                      setActiveTraceIndex(index);
                      const target = document.getElementById(item.summaryId);
                      target?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    <div className="section-trace-step">{`หัวข้อ ${index + 1}`}</div>
                    <div className="section-trace-summary">{item.summaryTitle}</div>
                    <div className="section-trace-source">{`${item.sourceLabel} • ${item.sourceTitle}`}</div>
                    <div className="section-trace-preview">{item.sourceExcerpt}</div>
                  </button>
                ))}
              </div>

              {sectionTrace[activeTraceIndex] && (
                <div className="section-source-detail">
                  <div className="section-source-label">{sectionTrace[activeTraceIndex].sourceLabel}</div>
                  <div className="section-source-title">{sectionTrace[activeTraceIndex].sourceTitle}</div>
                  <div className="section-source-excerpt">{sectionTrace[activeTraceIndex].sourceExcerpt}</div>
                </div>
              )}
            </div>
          </aside>
        </>
      )}

      <div className="result-body" style={{ textAlign: "left" }}>
        {summarySections.length
          ? summarySections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 style={{ textAlign: "left" }}>{section.title}</h2>
                {renderLines(section.body)}
              </section>
            ))
          : renderLines(displayText)}
      </div>
    </div>
  );
}





