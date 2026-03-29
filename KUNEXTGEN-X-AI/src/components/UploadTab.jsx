import { useRef } from "react";

function icon(name) {
  if (!name) return "📄";
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "📕";
  if (["doc", "docx"].includes(ext)) return "📘";
  if (["ppt", "pptx"].includes(ext)) return "📙";
  if (ext === "txt") return "📄";
  return "📄";
}

function size(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

const COPY = {
  th: {
    heading: "ลากไฟล์มาวางที่นี่",
    subtitle: "หรือคลิกเพื่อเลือกไฟล์",
    replace: "เปลี่ยนไฟล์",
    remove: "ลบ",
  },
  en: {
    heading: "Drop your file here",
    subtitle: "or click to choose a file",
    replace: "Replace file",
    remove: "Remove",
  },
};

export default function UploadTab({
  file,
  dragging,
  setDragging,
  onFile,
  onRemove,
  lang = "th",
}) {
  const inputRef = useRef(null);
  const copy = COPY[lang] || COPY.th;

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handlePick = (e) => {
    const picked = e.target.files?.[0];
    if (picked) onFile(picked);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onFile(dropped);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove?.();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="upload-card-shell">
      <div
        className={`upload-zone${dragging ? " dragging" : ""}`}
        onClick={openPicker}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
      >
        <input
          ref={inputRef}
          className="upload-hidden-input"
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
          onChange={handlePick}
        />

        {!file ? (
          <>
            <div className="upload-icon">📂</div>
            <h3>{copy.heading}</h3>
            <p className="upload-subtitle">{copy.subtitle}</p>

            <div className="upload-types">
              {["PDF", "DOCX", "PPTX", "TXT"].map((t) => (
                <span key={t} className="file-type-badge">
                  {t}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div className="upload-file-state">
            <div className="upload-file-icon">{icon(file.name)}</div>

            <div className="upload-file-meta">
              <div className="upload-file-name">{file.name}</div>
              <div className="upload-file-size">{size(file.size)}</div>
            </div>

            <div className="upload-file-actions">
              <button
                type="button"
                className="upload-mini-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openPicker();
                }}
              >
                {copy.replace}
              </button>

              <button type="button" className="upload-mini-btn danger" onClick={handleRemove}>
                × {copy.remove}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
