import { useEffect, useMemo, useState } from "react";
import ExportButton from "./ExportButton";
import { apiUrl } from "../lib/api-base";

const TRANSLATE_API = apiUrl("/api/translate-result");
const TH_SECTION = "\u0e2b\u0e31\u0e27\u0e02\u0e49\u0e2d";
const TH_SOURCE_SECTION = "\u0e15\u0e49\u0e19\u0e09\u0e1a\u0e31\u0e1a\u0e2a\u0e48\u0e27\u0e19\u0e17\u0e35\u0e48";
const TH_SUMMARY = "\u0e1a\u0e17\u0e2a\u0e23\u0e38\u0e1b";
const TH_KEYWORDS = "\u0e04\u0e33\u0e2a\u0e33\u0e04\u0e31\u0e0d";
const TH_RESULT = "\u0e1c\u0e25\u0e25\u0e31\u0e1e\u0e18\u0e4c";
const TH_SUCCESS = "\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08";
const TH_LEAD = "\u0e2a\u0e23\u0e38\u0e1b\u0e40\u0e19\u0e37\u0e49\u0e2d\u0e2b\u0e32\u0e44\u0e1f\u0e25\u0e4c";
const TH_TONE = "\u0e43\u0e2b\u0e49\u0e2a\u0e31\u0e49\u0e19 \u0e01\u0e23\u0e30\u0e0a\u0e31\u0e1a";

function cleanText(text = "") {
  return String(text)
    .replace(/\uFFFD+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*/g, "")
    .replace(/^\s*#{1,6}\s*/gm, "")
    .trim();
}

function isHeading(line = "") {
  const trimmed = String(line).trim();
  return (
    /^#{1,6}\s+/.test(trimmed) ||
    /^\d+(\.\d+)*\s+/.test(trimmed) ||
    /^\d+(\.\d+)*[:.)]\s*/.test(trimmed)
  );
}

function renderLines(raw = "") {
  return String(raw)
    .split("\n")
    .map((line) => cleanText(line))
    .filter(Boolean)
    .map((line, index) => {
      const plain = line.replace(/^#+\s*/, "").trim();
      const isStrongLine =
        /^#{1,6}\s*/.test(line) || /^\d+(\.\d+)*[:.)]?\s+/.test(line);

      if (/^[-\u2022]/.test(line)) {
        return (
          <ul key={index}>
            <li style={{ textAlign: "left" }}>
              {line.replace(/^[-\u2022]\s*/, "")}
            </li>
          </ul>
        );
      }

      return (
        <p
          key={index}
          className={isStrongLine ? "summary-strong" : ""}
          style={{ textAlign: "left" }}
        >
          {plain}
        </p>
      );
    });
}

function tokenize(text = "") {
  return cleanText(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 3);
}

function parseSummarySections(raw = "", lang = "th") {
  const lines = String(raw).split("\n");
  const sections = [];
  let current = null;

  lines.forEach((line) => {
    const trimmed = cleanText(line);
    if (!trimmed) return;

    if (isHeading(line)) {
      if (current) sections.push(current);
      current = { title: trimmed.replace(/^#+\s*/, ""), lines: [] };
      return;
    }

    if (!current) {
      current = {
        title: lang === "en" ? `Section ${sections.length + 1}` : `${TH_SECTION} ${sections.length + 1}`,
        lines: [],
      };
    }

    current.lines.push(trimmed);
  });

  if (current) sections.push(current);

  return sections
    .map((section, index) => ({
      id: `summary-section-${index + 1}`,
      title:
        section.title ||
        (lang === "en" ? `Section ${index + 1}` : `${TH_SECTION} ${index + 1}`),
      body: section.lines.join("\n"),
    }))
    .filter((section) => section.title || section.body);
}

function parseSourceSections(sourceText = "", lang = "th") {
  const blocks = String(sourceText)
    .split(/\n{2,}/)
    .map((block) => cleanText(block))
    .filter(Boolean);

  return blocks.slice(0, 20).map((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const firstLine = cleanText(lines[0] || "");

    return {
      id: `source-section-${index + 1}`,
      label: lang === "en" ? `Section ${index + 1}` : `${TH_SECTION} ${index + 1}`,
      title:
        firstLine && firstLine.length <= 90
          ? firstLine
          : lang === "en"
            ? `Source section ${index + 1}`
            : `${TH_SOURCE_SECTION} ${index + 1}`,
      content: block,
      excerpt: block.slice(0, 220),
    };
  });
}

function buildSectionTrace(summarySections, sourceSections, lang = "th") {
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
      summaryTitle: cleanText(section.title),
      sourceLabel: lang === "en" ? `Section ${index + 1}` : `${TH_SECTION} ${index + 1}`,
      sourceTitle: cleanText(best?.title || ""),
      sourceExcerpt: cleanText(best?.excerpt || ""),
    };
  });
}

const TITLE_BY_MODE = {
  summary: { th: TH_SUMMARY, en: "Summary" },
  keypoints: { th: "Key Points", en: "Key Points" },
  keywords: { th: TH_KEYWORDS, en: "Keywords" },
};

export default function SummaryResult({
  result,
  mode,
  fileName,
  sourceText,
  sourceSections = [],
  initialLang = "th",
}) {
  const preferredLang = initialLang === "en" ? "en" : "th";
  const [viewLang, setViewLang] = useState("th");
  const [translations, setTranslations] = useState({ th: "", en: "" });
  const [translating, setTranslating] = useState(false);
  const [activeTraceIndex, setActiveTraceIndex] = useState(0);
  const [traceOpen, setTraceOpen] = useState(false);

  const baseText = result?.raw || "";
  const displayText = viewLang === "th" ? baseText : translations.en || baseText;

  useEffect(() => {
    setTranslations({ th: "", en: "" });
    setViewLang("th");
  }, [baseText]);

  useEffect(() => {
    if (preferredLang === "en") {
      translateTo("en");
    } else {
      setViewLang("th");
    }
  }, [preferredLang, baseText]);

  useEffect(() => {
    setActiveTraceIndex(0);
  }, [displayText, sourceText]);

  const summarySections = useMemo(
    () => parseSummarySections(displayText, viewLang),
    [displayText, viewLang]
  );

  const resolvedSourceSections = useMemo(() => {
    if (sourceSections?.length) {
      return sourceSections.map((section, index) => ({
        ...section,
        label: viewLang === "en" ? `Section ${index + 1}` : `${TH_SECTION} ${index + 1}`,
        title: cleanText(section.title || ""),
        excerpt: cleanText(section.excerpt || section.content || ""),
        content: cleanText(section.content || ""),
      }));
    }

    return parseSourceSections(sourceText, viewLang);
  }, [sourceSections, sourceText, viewLang]);

  const sectionTrace = useMemo(
    () => buildSectionTrace(summarySections, resolvedSourceSections, viewLang),
    [summarySections, resolvedSourceSections, viewLang]
  );

  const title =
    TITLE_BY_MODE[mode]?.[viewLang] || (viewLang === "en" ? "Result" : TH_RESULT);

  const leadText =
    viewLang === "en"
      ? `Summary for ${fileName || "this file"} in a concise, clear format`
      : `${TH_LEAD} ${fileName || ""} ${TH_TONE}`.trim();

  const translateTo = async (targetLang) => {
    if (targetLang === viewLang) return;

    if (targetLang === "th") {
      setViewLang("th");
      return;
    }

    if (translations[targetLang]) {
      setViewLang(targetLang);
      return;
    }

    setTranslating(true);
    try {
      const response = await fetch(TRANSLATE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: baseText,
          targetLang,
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
        <span className="result-title">{title}</span>

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

          <ExportButton
            result={{ ...result, raw: displayText, type: "text" }}
            mode={mode}
            fileName={fileName}
            lang={viewLang}
          />

          <span className="result-badge">
            {viewLang === "en" ? "English View" : TH_SUCCESS}
          </span>
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
                    <div className="section-trace-step">
                      {viewLang === "en" ? `Item ${index + 1}` : `${TH_SECTION} ${index + 1}`}
                    </div>
                    <div className="section-trace-summary">{item.summaryTitle}</div>
                    <div className="section-trace-source">
                      {item.sourceLabel} • {item.sourceTitle}
                    </div>
                    <div className="section-trace-preview">{item.sourceExcerpt}</div>
                  </button>
                ))}
              </div>

              {sectionTrace[activeTraceIndex] && (
                <div className="section-source-detail">
                  <div className="section-source-label">
                    {sectionTrace[activeTraceIndex].sourceLabel}
                  </div>
                  <div className="section-source-title">
                    {sectionTrace[activeTraceIndex].sourceTitle}
                  </div>
                  <div className="section-source-excerpt">
                    {sectionTrace[activeTraceIndex].sourceExcerpt}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </>
      )}

      <div className="result-body" style={{ textAlign: "left" }}>
        <div className="summary-lead">{leadText}</div>

        {summarySections.length
          ? summarySections.map((section) => (
              <section key={section.id} id={section.id} className="summary-section-block">
                <h2 style={{ textAlign: "left" }}>{section.title}</h2>
                {renderLines(section.body)}
              </section>
            ))
          : renderLines(displayText)}
      </div>
    </div>
  );
}
