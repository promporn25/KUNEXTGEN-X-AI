function renderLines(raw) {
  return raw.split("\n").filter(l => l.trim()).map((line, i) => {
    if (line.startsWith("##")) return <h2 key={i}>{line.replace(/^#+\s*/, "")}</h2>;
    if (line.startsWith("#")) return <h3 key={i}>{line.replace(/^#+\s*/, "")}</h3>;
    if (/^[-•*]/.test(line) || /^\d+\./.test(line)) {
      return <ul key={i}><li>{line.replace(/^[-•*]\s*/, "").replace(/^\d+\.\s*/, "")}</li></ul>;
    }
    return <p key={i}>{line}</p>;
  });
}

export default function SummaryResult({ result, mode }) {
  const title = mode === "summary" ? "📋 บทสรุป" : mode === "keypoints" ? "🎯 Key Points" : "🔑 คำสำคัญ";

  return (
    <div className="result-container">
      <div className="result-header">
        <span className="result-title">{title}</span>
        <span className="result-badge">AI สรุปแล้ว ✓</span>
      </div>
      <div className="result-body">
        {renderLines(result.raw)}
      </div>
    </div>
  );
}
