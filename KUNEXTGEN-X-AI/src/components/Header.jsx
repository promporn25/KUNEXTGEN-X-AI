import { useState, useRef, useEffect } from 'react';

const HISTORY_MOCK = [
  { mode: '📝 สรุปเนื้อหา', date: 'วันนี้ 14:32', file: 'บทที่ 3 - เศรษฐศาสตร์จุลภาค.pdf', preview: 'อุปสงค์และอุปทาน กฎของอุปสงค์ ความยืดหยุ่น...' },
  { mode: '🧠 แฟลชการ์ด',  date: 'เมื่อวาน 09:15', file: 'บทที่ 1 - บทนำสู่รัฐศาสตร์.docx', preview: 'แนวคิดพื้นฐาน อำนาจรัฐ ระบอบการปกครอง...' },
];

export default function Header({ theme, setTheme, lang, setLang }) {
  const [histOpen, setHistOpen] = useState(false);
  const histRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (histRef.current && !histRef.current.contains(e.target)) {
        setHistOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav className="topnav">
      <div className="topnav-left">
        <div className="topnav-badge">KU</div>
        <div className="topnav-title">
          <span className="topnav-ku">KUNextGen</span>
          <span className="topnav-x"> ✕ </span>
          <span className="topnav-ai">AI</span>
        </div>
        <div className="topnav-divider" />
        <span className="topnav-sub">ระบบสรุปเอกสารอัจฉริยะ</span>
      </div>

      <div className="topnav-right">
        <div className="history-wrap" ref={histRef}>
          <button className="history-toggle" onClick={() => setHistOpen(o => !o)}>
            <span>🕐 ประวัติ ({HISTORY_MOCK.length})</span>
            <span className="history-chevron">{histOpen ? '▴' : '▾'}</span>
          </button>

          {histOpen && (
            <div className="history-panel">
              <div className="history-head">
                <span className="history-head-title">ประวัติการใช้งาน</span>
                <button className="history-clear">ล้างทั้งหมด</button>
              </div>
              <div className="history-list">
                {HISTORY_MOCK.map((h, i) => (
                  <div key={i} className="history-item" onClick={() => setHistOpen(false)}>
                    <div className="history-item-top">
                      <span className="history-mode">{h.mode}</span>
                      <span className="history-date">{h.date}</span>
                    </div>
                    <div className="history-file">{h.file}</div>
                    <div className="history-preview">{h.preview}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button className="topnav-btn" onClick={() => setLang(l => l === 'th' ? 'en' : 'th')}>
          {lang === 'th' ? '🇹🇭 TH' : '🇬🇧 EN'}
        </button>

        <button className="topnav-btn topnav-icon-btn" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}
