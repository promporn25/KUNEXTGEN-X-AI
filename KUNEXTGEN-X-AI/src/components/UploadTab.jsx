import { useRef, useCallback } from "react";

function getFileIcon(name) {
  if (!name) return "📄";
  const ext = name.split(".").pop().toLowerCase();
  if (ext === "pdf") return "📕";
  if (["doc", "docx"].includes(ext)) return "📘";
  if (["ppt", "pptx"].includes(ext)) return "📙";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "🖼️";
  return "📄";
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

export default function UploadTab({ file, dragging, setDragging, onFile, onRemove }) {
  const fileRef = useRef();

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }, []);

  return (
    <>
      <div
        className={`upload-zone${dragging ? " dragging" : ""}`}
        onClick={() => fileRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div className="upload-icon">📂</div>
        <h3>ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</h3>
        <p>รองรับหลายรูปแบบไฟล์</p>
        <div className="file-types">
          {["PDF", "Word (.docx)", "PowerPoint (.pptx)", "Text (.txt)"].map(t => (
            <span key={t} className="file-type-tag">{t}</span>
          ))}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
          onChange={e => e.target.files[0] && onFile(e.target.files[0])}
        />
      </div>

      {file && (
        <div className="file-preview">
          <div className="file-icon">{getFileIcon(file.name)}</div>
          <div className="file-info">
            <div className="file-name">{file.name}</div>
            <div className="file-size">{formatSize(file.size)}</div>
          </div>
          <button className="remove-btn" onClick={onRemove}>✕ ลบ</button>
        </div>
      )}
    </>
  );
}
