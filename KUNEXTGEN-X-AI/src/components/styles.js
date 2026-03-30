export const darkTheme = `
  :root {
    --bg: #06141B;
    --bg-card: #11212D;
    --bg-raised: #253745;
    --bg-input: #CCD0CF;

    --surface: #CCD0CF;
    --surface-2: #C4C9C8;
    --surface-3: #9BA8AB;
    --surface-dark: #11212D;

    --border: rgba(6,20,27,0.12);
    --border-hover: rgba(6,20,27,0.24);

    --text: #06141B;
    --text-2: #253745;
    --text-3: #4A5C6A;

    --accent: #CCD0CF;
    --accent-2: #9BA8AB;
    --accent-3: #4A5C6A;
    --accent-dim: rgba(204,208,207,0.42);
    --accent-glow: rgba(204,208,207,0.28);

    --moss: #06141B;
    --moss-dim: rgba(6,20,27,0.08);
    --beige: #CCD0CF;
    --beige-dim: rgba(204,208,207,0.12);
    --rosy: #4A5C6A;
    --rosy-dim: rgba(74,92,106,0.14);
    --deep: #253745;
    --deep-dim: rgba(37,55,69,0.16);
    --green: #06141B;
    --green-dim: rgba(6,20,27,0.08);
    --red: #253745;
    --red-dim: rgba(37,55,69,0.10);

    --hero-bg: #CCD0CF;
    --nav-bg: rgba(204,208,207,0.72);

    --radius: 20px;
    --radius-sm: 14px;
    --radius-lg: 28px;

    --grad-main: linear-gradient(180deg, #FFFFFF 0%, #CCD0CF 100%);
    --grad-soft: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(204,208,207,0.82));

    --glass: rgba(255,255,255,0.7);
    --glass-strong: rgba(255,255,255,0.88);

    --shadow-sm: 0 10px 24px rgba(6,20,27,0.08);
    --shadow-md: 0 18px 40px rgba(6,20,27,0.14);
    --shadow-lg: 0 26px 58px rgba(6,20,27,0.18);

    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'DM Sans', system-ui, sans-serif;
    --font-mono: 'DM Mono', monospace;
  }
`;

export const lightTheme = `
  :root {
    --bg: #11212D;
    --bg-card: #06141B;
    --bg-raised: #253745;
    --bg-input: #FFFFFF;

    --surface: #FFFFFF;
    --surface-2: #CCD0CF;
    --surface-3: #9BA8AB;
    --surface-dark: #06141B;

    --border: rgba(6,20,27,0.1);
    --border-hover: rgba(6,20,27,0.2);

    --text: #06141B;
    --text-2: #253745;
    --text-3: #4A5C6A;

    --accent: #FFFFFF;
    --accent-2: #CCD0CF;
    --accent-3: #9BA8AB;
    --accent-dim: rgba(255,255,255,0.56);
    --accent-glow: rgba(255,255,255,0.34);

    --moss: #06141B;
    --moss-dim: rgba(6,20,27,0.08);
    --beige: #FFFFFF;
    --beige-dim: rgba(255,255,255,0.18);
    --rosy: #4A5C6A;
    --rosy-dim: rgba(74,92,106,0.12);
    --deep: #253745;
    --deep-dim: rgba(37,55,69,0.16);
    --green: #06141B;
    --green-dim: rgba(6,20,27,0.08);
    --red: #253745;
    --red-dim: rgba(37,55,69,0.1);

    --hero-bg: #FFFFFF;
    --nav-bg: rgba(255,255,255,0.82);

    --radius: 20px;
    --radius-sm: 14px;
    --radius-lg: 28px;

    --grad-main: linear-gradient(180deg, #FFFFFF 0%, #CCD0CF 100%);
    --grad-soft: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(204,208,207,0.88));

    --glass: rgba(255,255,255,0.82);
    --glass-strong: rgba(255,255,255,0.96);

    --shadow-sm: 0 10px 24px rgba(6,20,27,0.08);
    --shadow-md: 0 18px 40px rgba(6,20,27,0.14);
    --shadow-lg: 0 26px 58px rgba(6,20,27,0.18);

    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'DM Sans', system-ui, sans-serif;
    --font-mono: 'DM Mono', monospace;
  }
`;

export const baseStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,700&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Sarabun:wght@400;500;600;700&display=swap');

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
  }

  body {
    background:
      radial-gradient(circle at top left, rgba(131,153,88,0.08), transparent 22%),
      radial-gradient(circle at top right, rgba(16,86,102,0.10), transparent 26%),
      linear-gradient(135deg, #061811 0%, #0a2219 42%, #103126 100%);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.6;
    overflow: hidden;
    transition: background 0.3s, color 0.3s;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(155,168,171,0.72), rgba(74,92,106,0.9));
    border-radius: 999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(204,208,207,0.9), rgba(74,92,106,1));
  }

  ::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
  }

  .topnav {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 clamp(16px,3vw,28px);
    background: rgba(7, 26, 18, 0.84);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 200;
    gap: 16px;
  }

  .topnav-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .topnav-badge {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 14px;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 3px 10px var(--accent-glow);
  }

  .topnav-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 18px;
    color: var(--text);
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .topnav-ku {
    color: var(--text);
  }

  .topnav-x {
    color: var(--text-3);
    font-size: 12px;
    font-weight: 300;
    font-family: var(--font-body);
    margin: 0 2px;
  }

  .topnav-ai {
    color: var(--moss);
  }

  .topnav-divider {
    width: 1px;
    height: 18px;
    background: var(--border);
    flex-shrink: 0;
  }

  .topnav-sub {
    font-size: 12px;
    color: var(--text-3);
    white-space: nowrap;
  }

  .topnav-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    min-width: 0;
  }

  .topnav-user {
    min-width: 0;
    max-width: 100%;
  }

  .topnav-user-meta {
    flex: 1;
    min-width: 0;
  }

  .topnav-user-name,
  .topnav-user-status {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .topnav-btn {
    height: 34px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.04);
    color: var(--text-2);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.22,1,0.36,1);
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: var(--shadow-sm);
  }

  .topnav-btn:hover {
    border-color: rgba(131,153,88,0.26);
    color: var(--moss);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

.layout {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    width: 100%;
    background:
      radial-gradient(circle at 20% 20%, rgba(131,153,88,0.05), transparent 18%),
      radial-gradient(circle at 88% 12%, rgba(16,86,102,0.12), transparent 22%),
      linear-gradient(135deg, #061811 0%, #0a2219 42%, #103126 100%);
  }

  .sidebar {
    min-width: 0;
    min-height: 0;
    height: 100%;
    overflow: hidden;
    border-right: 1px solid rgba(255,255,255,0.08);
    background:
      linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.00)),
      rgba(11, 36, 26, 0.92);
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
  }

  .sidebar-inner {
    flex: 1;
    overflow-y: auto;
    padding: 18px 16px 120px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-height: 0;
    scrollbar-width: thin;
  }

  .sidebar-footer {
    flex-shrink: 0;
    position: relative;
    z-index: 2;
    padding: 14px 16px 18px;
    background: linear-gradient(180deg, rgba(11,36,26,0), rgba(11,36,26,0.92) 22%);
    border-top: 1px solid rgba(255,255,255,0.06);
  }

.main-panel {
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 34px 30px 52px;
  scrollbar-gutter: stable;
}

.result-wrap {
  width: 100%;
  max-width: 1180px;
  margin: 0;
}
.loader-card {
  width: 100%;
  max-width: 640px;
  margin: 28px auto 0;
  padding: 34px 28px;
  border-radius: 24px;
  background: rgba(11, 36, 26, 0.86);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: var(--shadow-md);
}

.loader-card-inner {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loader-visual {
  width: 120px;
  height: 120px;
  border-radius: 18px;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,0.04);
  margin-bottom: 20px;
}

.loader-visual img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.loader-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 10px;
}

.loader-steps {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.loader-step {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-start;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: var(--text-2);
  font-size: 14px;
}

.loader-step-icon {
  color: var(--moss);
  font-weight: 800;
  flex-shrink: 0;
}

@media (max-width: 820px) {
  .main-panel {
    padding: 24px 16px 36px;
  }

  .loader-card {
    max-width: 100%;
    padding: 24px 18px;
  }

  .loader-card-inner {
    min-height: 240px;
  }
}

.empty-state {
  width: 100%;
  min-height: calc(100vh - 180px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-3);
}

.empty-main {
  width: 100%;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.loader-card {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  background: rgba(11, 36, 26, 0.86);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  padding: 32px 28px;
  text-align: left;
  box-shadow: var(--shadow-md);
}

.result-container {
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
}

  .tabs {
    display: flex;
    gap: 6px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 18px;
    padding: 6px;
    margin-bottom: 0;
  }

  .tab-btn {
    flex: 1;
    height: 40px;
    border: none;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.22,1,0.36,1);
    background: transparent;
    color: var(--text-3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
  }

  .tab-btn.active {
    background: rgba(255,255,255,0.05);
    color: var(--moss);
    border: 1px solid rgba(131,153,88,0.22);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03);
  }

  .tab-btn:not(.active):hover {
    color: var(--text-2);
  }

  .upload-card-shell {
    display: flex;
    flex-direction: column;
    margin-bottom: 4px;
  }

  .upload-hidden-input {
    display: none;
  }

  .upload-zone {
    border: 1.5px dashed rgba(255,255,255,0.10);
    border-radius: 24px;
    min-height: 250px;
    padding: 30px 22px;
    text-align: center;
    cursor: pointer;
    transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
    background:
      linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)),
      rgba(18, 56, 42, 0.72);
    backdrop-filter: blur(14px);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.04),
      0 8px 18px rgba(0,0,0,0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .upload-zone:hover,
  .upload-zone.dragging {
    border-color: rgba(131,153,88,0.32);
    background: rgba(20, 64, 48, 0.90);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md), 0 0 0 2px rgba(131,153,88,0.08);
  }

  .upload-icon {
    font-size: 42px;
    margin-bottom: 12px;
    line-height: 1;
  }

  .upload-zone h3 {
    font-family: var(--font-display);
    font-size: 19px;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--text);
  }

  .upload-subtitle {
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.7;
    margin-bottom: 14px;
  }

  .upload-types {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-top: 8px;
  }

  .file-type-badge {
    padding: 6px 11px;
    border-radius: 999px;
    background: rgba(255,255,255,0.05);
    color: var(--text-2);
    font-size: 10px;
    font-weight: 700;
    font-family: var(--font-mono);
    letter-spacing: 0.4px;
    border: 1px solid rgba(255,255,255,0.08);
  }

  .upload-file-state {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    justify-content: center;
  }

  .upload-file-icon {
    font-size: 34px;
    line-height: 1;
  }

  .upload-file-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    text-align: center;
  }

  .upload-file-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    max-width: 100%;
    word-break: break-word;
  }

  .upload-file-size {
    font-size: 12px;
    color: var(--text-3);
  }

  .upload-file-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .upload-mini-btn {
    height: 34px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.05);
    color: var(--text-2);
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .upload-mini-btn:hover {
    border-color: rgba(131,153,88,0.24);
    color: var(--moss);
  }

  .upload-mini-btn.danger:hover {
    border-color: rgba(217,106,106,0.28);
    color: #f19a9a;
  }

  .sidebar-inner {
  flex: 1;
  overflow-y: auto;
  padding: 18px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  scrollbar-width: thin;
}

.options-panel {
  padding: 16px;
  margin-top: 8px;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.option-card {
  min-height: 84px;
  padding: 14px 13px;
  border-radius: 16px;
}

.option-label {
  font-size: 14px;
  font-weight: 800;
}

.option-desc {
  font-size: 12px;
  margin-top: 4px;
}

  .panel-title {
    font-size: 13px;
    font-weight: 800;
    color: var(--text-2);
    text-transform: none;
    letter-spacing: 0;
    margin-bottom: 16px;
  }

  .options-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .sidebar .options-grid {
    grid-template-columns: 1fr 1fr;
  }

  .option-card {
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 15px 14px;
    cursor: pointer;
    transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-height: 78px;
    text-align: left;
    position: relative;
    overflow: hidden;
    opacity: 0.9;
  }

  .option-card:hover {
    border-color: rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.06);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
    opacity: 1;
  }

  .option-card.selected {
    border-color: rgba(131,153,88,0.40);
    background: rgba(131,153,88,0.08);
    transform: translateY(-2px);
    opacity: 1;
    box-shadow:
      0 0 0 3px rgba(131,153,88,0.08),
      0 12px 24px rgba(6,20,27,0.12);
  }

  .option-card.selected .option-icon {
    transform: scale(1.08);
  }

  .option-card.selected .option-label {
    font-weight: 900;
  }

  .option-icon {
    font-size: 19px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .option-label {
    font-size: 15px;
    font-weight: 800;
    color: var(--text);
  }

  .option-desc {
    font-size: 12px;
    color: var(--text-3);
    margin-top: 4px;
    line-height: 1.5;
  }

  .quiz-options {
    margin-top: 14px;
    padding: 14px;
    border-radius: 18px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .section-label,
  .count-label {
    display: block;
    font-size: 12px;
    font-weight: 800;
    color: var(--text-2);
    letter-spacing: 0.2px;
  }

  .section-label {
    margin-bottom: 8px;
  }

  .difficulty-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .diff-btn {
    appearance: none;
    min-height: 42px;
    padding: 0 10px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    color: var(--text-2);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    position: relative;
    z-index: 1;
    opacity: 0.88;
    transition: all 0.22s cubic-bezier(0.22,1,0.36,1);
  }

  .diff-btn:active {
    transform: translateY(1px) scale(0.985);
  }

  .diff-btn:hover {
    border-color: rgba(255,255,255,0.16);
    background: rgba(255,255,255,0.07);
    color: var(--text);
    opacity: 1;
  }

  .diff-btn.sel {
    border-color: rgba(255,255,255,0.92);
    background: linear-gradient(180deg, #ffffff 0%, var(--surface-2) 100%);
    color: #06141B;
    opacity: 1;
    transform: translateY(-1px) scale(1.03);
    box-shadow:
      0 10px 22px rgba(255,255,255,0.22),
      0 6px 16px rgba(6,20,27,0.14),
      0 0 0 3px rgba(255,255,255,0.18),
      inset 0 1px 0 rgba(255,255,255,0.98);
  }

  .count-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .count-input {
    width: 100%;
    min-height: 46px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.06);
    color: var(--text);
    padding: 0 14px;
    font-size: 14px;
    font-weight: 700;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .count-input:focus {
    border-color: rgba(131,153,88,0.35);
    box-shadow: 0 0 0 3px rgba(131,153,88,0.08);
    background: rgba(255,255,255,0.08);
  }

  .settings-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.settings-block {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.settings-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-2);
}

.settings-input {
  width: 100%;
  height: 46px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.07);
  color: var(--text);
  padding: 0 14px;
  font-size: 14px;
  font-weight: 700;
  outline: none;
}

.settings-input:focus {
  border-color: rgba(131,153,88,0.35);
  box-shadow: 0 0 0 3px rgba(131,153,88,0.08);
}

  .settings-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .settings-label {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-2);
  }

  .settings-input,
  .settings-control {
    width: 100%;
    min-height: 48px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.06);
    color: var(--text);
    padding: 0 14px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
    outline: none;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .settings-input:focus,
  .settings-control:focus {
    border-color: rgba(131,153,88,0.35);
    box-shadow: 0 0 0 3px rgba(131,153,88,0.08);
    background: rgba(255,255,255,0.08);
  }

  .action-btn {
    width: 100%;
    height: 54px;
    background: linear-gradient(135deg, #0A3323 0%, #1d5a40 55%, #839958 100%);
    border: none;
    border-radius: 16px;
    color: #f7fbf8;
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 10px 28px rgba(10,51,35,0.24);
    position: relative;
    overflow: hidden;
    letter-spacing: 0.2px;
  }

  .action-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transition: 0.6s ease;
  }

  .action-btn:hover::before {
    left: 100%;
  }

  .action-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 14px 34px rgba(10,51,35,0.30);
  }

  .action-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
  }

  .url-input,
  .text-input-area,
  .field-input {
    background: var(--bg-input);
    border: 1px solid rgba(255,255,255,0.10);
    color: var(--text);
  }

  .url-input {
    width: 100%;
    height: 48px;
    border-radius: 14px;
    padding: 0 16px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .url-input:focus,
  .text-input-area:focus,
  .field-input:focus {
    border-color: rgba(131,153,88,0.35);
    box-shadow: 0 0 0 3px rgba(131,153,88,0.08);
  }

  .text-input-area {
    width: 100%;
    min-height: 150px;
    border-radius: 16px;
    padding: 14px 16px;
    font-size: 14px;
    line-height: 1.7;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .empty-state {
    width: 100%;
    min-height: calc(100vh - 180px);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: var(--text-3);
  }

  .empty-main {
    max-width: 560px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .empty-side {
    display: none;
  }

  .empty-greeting {
    width: 84px;
    height: 84px;
    display: grid;
    place-items: center;
    margin-bottom: 20px;
    font-size: 52px;
    color: var(--text);
    background: transparent;
    letter-spacing: 0;
    animation: starFloat 4.8s ease-in-out infinite;
    transform-origin: center;
  }

  .empty-greeting::before {
    display: none;
  }

  body.dark .empty-greeting {
    color: #f3c969;
    text-shadow: 0 0 18px rgba(243, 201, 105, 0.18);
  }

  @keyframes starFloat {
    0%, 100% {
      transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
      opacity: 0.92;
    }
    25% {
      transform: translate3d(4px, -5px, 0) rotate(8deg) scale(1.04);
      opacity: 1;
    }
    50% {
      transform: translate3d(0, -10px, 0) rotate(0deg) scale(1.08);
      opacity: 0.96;
    }
    75% {
      transform: translate3d(-4px, -4px, 0) rotate(-8deg) scale(1.03);
      opacity: 1;
    }
  }

  .empty-title {
    font-family: var(--font-display);
    font-size: clamp(38px, 4.6vw, 56px);
    font-weight: 700;
    color: var(--text);
    line-height: 1.06;
    letter-spacing: -1.4px;
    margin-bottom: 14px;
    max-width: 12ch;
  }

  .empty-title em {
    color: var(--moss);
    font-style: normal;
  }

  .empty-body {
    font-size: 15px;
    color: var(--text-2);
    line-height: 1.9;
    margin-bottom: 26px;
    max-width: 460px;
  }

  .empty-steps {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 460px;
  }

  .empty-step {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    font-size: 14px;
    color: var(--text-2);
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(10px);
    transition: all 0.24s ease;
  }

  .empty-step:hover {
    border-color: rgba(131,153,88,0.26);
    transform: translateX(4px);
  }

  .empty-step-num {
    width: 24px;
    height: 24px;
    border-radius: 999px;
    flex-shrink: 0;
    background: transparent;
    border: 1px solid rgba(131,153,88,0.62);
    color: var(--moss);
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .result-container,
  .quiz-question,
  .stats-bar,
  .loader-card,
  .history-panel {
    background: rgba(11, 36, 26, 0.86);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.08);
  }

.result-container {
  width: 100%;
  max-width: 100%;
  box-shadow: var(--shadow-md);
  border-radius: 26px;
  overflow: hidden;
  animation: popIn 0.28s ease;
  transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
}

  .result-container:hover {
    box-shadow: var(--shadow-lg);
    border-color: rgba(131,153,88,0.20);
    transform: translateY(-2px);
  }

  @keyframes popIn {
    0% { opacity: 0; transform: scale(0.97); }
    100% { opacity: 1; transform: scale(1); }
  }

.result-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255,255,255,0.03);
}

  .result-title {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.2px;
  }

  .result-badge {
    padding: 6px 10px;
    border-radius: 999px;
    background: linear-gradient(180deg, #ffffff 0%, var(--surface-2) 100%);
    color: #06141B;
    font-size: 12px;
    font-weight: 800;
    border: 1px solid rgba(255,255,255,0.82);
    box-shadow:
      0 8px 16px rgba(255,255,255,0.16),
      0 6px 14px rgba(6,20,27,0.08);
  }

  .result-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .summary-lang-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px;
    border-radius: 999px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .summary-lang-btn {
    min-width: 42px;
    height: 32px;
    padding: 0 12px;
    border: none;
    border-radius: 999px;
    background: transparent;
    color: var(--text-2);
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .summary-lang-btn.active {
    background: linear-gradient(180deg, #FFFFFF 0%, #CCD0CF 100%);
    color: #06141B;
    box-shadow: 0 8px 16px rgba(6,20,27,0.12);
  }

  .summary-lang-btn:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .with-trace-drawer {
    position: relative;
  }

  .trace-side-tab {
    position: absolute;
    top: 92px;
    right: -18px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 14px;
    border: 1px solid rgba(74,92,106,0.18);
    border-right: none;
    border-radius: 16px 0 0 16px;
    background: rgba(255,255,255,0.92);
    color: var(--text);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    z-index: 4;
    transition: transform 0.22s ease, box-shadow 0.22s ease, right 0.22s ease;
  }

  .trace-side-tab:hover {
    transform: translateX(-4px);
    box-shadow: var(--shadow-md);
  }

  .trace-side-tab.open {
    right: 320px;
  }

  .trace-side-tab-label {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .trace-side-tab-arrow {
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
  }

  .trace-drawer {
    position: absolute;
    top: 74px;
    right: 18px;
    bottom: 18px;
    width: 320px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px;
    border-radius: 22px;
    border: 1px solid rgba(74,92,106,0.14);
    background: rgba(255,255,255,0.98);
    box-shadow: var(--shadow-lg);
    opacity: 0;
    pointer-events: none;
    transform: translateX(18px);
    transition: opacity 0.22s ease, transform 0.22s ease;
    z-index: 3;
  }

  .trace-drawer.open {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(0);
  }

  @media (min-width: 901px) {
    .with-trace-drawer.trace-open .result-header,
    .with-trace-drawer.trace-open .result-body {
      padding-right: 344px;
      transition: padding-right 0.22s ease;
    }
  }

  .trace-drawer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .trace-drawer-close {
    width: 32px;
    height: 32px;
    border: 1px solid rgba(74,92,106,0.14);
    border-radius: 999px;
    background: rgba(255,255,255,0.88);
    color: var(--text);
    font-size: 18px;
    cursor: pointer;
  }

  .trace-drawer-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-height: 0;
    overflow-y: auto;
    padding-right: 2px;
  }

  .section-trace-title {
    font-size: 13px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .section-trace-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .section-trace-card {
    padding: 14px 15px;
    border-radius: 16px;
    border: 1px solid rgba(74,92,106,0.16);
    background: rgba(255,255,255,0.82);
    text-align: left;
    cursor: pointer;
    transition: all 0.22s ease;
  }

  .section-trace-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
    border-color: rgba(131,153,88,0.20);
  }

  .section-trace-card[aria-pressed="true"] {
    border-color: rgba(131,153,88,0.34);
    box-shadow: 0 12px 30px rgba(12,24,35,0.10);
    background: rgba(255,255,255,0.96);
  }

  .section-trace-step {
    font-size: 11px;
    font-weight: 800;
    color: var(--moss);
    margin-bottom: 6px;
  }

  .section-trace-summary {
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .section-trace-source {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-2);
    margin-bottom: 6px;
  }

  .section-trace-preview {
    font-size: 12px;
    color: var(--text-3);
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .section-source-detail {
    margin-top: 2px;
    padding: 16px 18px;
    border-radius: 18px;
    background: rgba(255,255,255,0.82);
    border: 1px solid rgba(74,92,106,0.14);
  }

  .section-source-label {
    font-size: 11px;
    font-weight: 800;
    color: var(--moss);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .section-source-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
  }

  .section-source-excerpt {
    font-size: 13px;
    line-height: 1.7;
    color: var(--text-2);
    white-space: pre-wrap;
  }

  body.dark .trace-side-tab {
    background: rgba(37,55,69,0.96);
    border-color: rgba(154,168,171,0.18);
    color: #f4f7f8;
  }

  body.dark .trace-drawer {
    background: rgba(17,33,45,0.98);
    border-color: rgba(154,168,171,0.14);
  }

  body.dark .trace-drawer-close,
  body.dark .section-trace-card,
  body.dark .section-source-detail {
    background: rgba(37,55,69,0.92);
    border-color: rgba(154,168,171,0.12);
    color: #f4f7f8;
  }

  body.dark .section-trace-card[aria-pressed="true"] {
    background: rgba(49,71,88,0.98);
    border-color: rgba(243,201,105,0.30);
    box-shadow: 0 16px 34px rgba(0,0,0,0.28);
  }

  body.dark .section-trace-title,
  body.dark .section-trace-summary,
  body.dark .section-source-title {
    color: #f4f7f8;
  }

  body.dark .section-trace-step,
  body.dark .section-source-label {
    color: rgba(243,201,105,0.92);
  }

  body.dark .section-trace-source,
  body.dark .section-source-excerpt {
    color: rgba(244,247,248,0.82);
  }

  body.dark .section-trace-preview {
    color: rgba(228,235,238,0.74);
  }

  body.dark .trace-drawer-close:hover,
  body.dark .section-trace-card:hover {
    border-color: rgba(243,201,105,0.28);
    box-shadow: 0 14px 30px rgba(0,0,0,0.24);
  }

  @media (max-width: 1100px) {
    .trace-side-tab {
      top: 84px;
      right: -10px;
    }

    .trace-side-tab.open {
      right: 284px;
    }

    .trace-drawer {
      width: 284px;
    }
  }

  @media (max-width: 820px) {
    .trace-side-tab {
      top: 72px;
    }

    .trace-side-tab.open {
      right: 18px;
    }

    .trace-drawer {
      top: 88px;
      left: 14px;
      right: 14px;
      bottom: 14px;
      width: auto;
    }
  }

.result-body {
  padding: 28px 30px 32px;
  font-family: 'Sarabun', var(--font-body);
}

  .summary-lead {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.7;
    color: var(--text);
    margin: 0 0 24px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(74,92,106,0.16);
  }

  .summary-section-block {
    padding-top: 2px;
    margin-top: 14px;
  }

  .result-body h2 {
      font-family: 'Sarabun', var(--font-body);
      font-size: 17px;
      font-weight: 800;
      line-height: 1.55;
      margin: 28px 0 16px;
      padding-top: 26px;
    padding-left: 28px;
    position: relative;
    border-top: 1px solid rgba(74,92,106,0.16);
    color: var(--text);
  }

  .result-body h2:first-child {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }

  .result-body h2::before {
    content: "";
    position: absolute;
    left: 8px;
    top: 38px;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background: #6ea6ea;
    transform: rotate(45deg);
    box-shadow: 0 0 0 3px rgba(110,166,234,0.08);
  }

  .result-body h2:first-child::before {
    top: 12px;
  }

  .result-body h3 {
      font-family: 'Sarabun', var(--font-body);
      font-size: 17px;
      font-weight: 800;
      color: var(--text);
      margin: 20px 0 12px;
      letter-spacing: -0.1px;
    padding-top: 0;
    border-top: none;
  }

  .result-body p {
      line-height: 1.95;
      color: var(--text-2);
      margin-bottom: 10px;
      font-size: 17px;
      letter-spacing: -0.1px;
      font-weight: 500;
    }

    .result-body .summary-strong {
      font-size: 17px;
      font-weight: 800;
      color: var(--text);
    }

  .result-body ul {
    margin: 6px 0 14px 22px;
    padding: 0;
  }

  .result-body li {
      line-height: 1.9;
      color: var(--text-2);
      font-size: 17px;
      margin-bottom: 6px;
      padding-left: 4px;
    }

  .summary-highlight {
    background: var(--grad-soft);
    border: 1.5px solid rgba(131,153,88,0.18);
    border-radius: 14px;
    padding: 16px 18px;
    position: relative;
    overflow: hidden;
  }

  .summary-highlight::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--grad-main);
  }

  .flashcard-result .result-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 34px 36px 38px;
  }

  .flashcard-progress-wrap {
    height: 8px;
    border-radius: 999px;
    background: rgba(6,20,27,0.12);
    overflow: hidden;
  }

  .flashcard-wrap {
    width: 100%;
    border: 1px solid rgba(6,20,27,0.1);
    border-radius: 20px;
    background: rgba(255,255,255,0.86);
    min-height: 240px;
    padding: 30px 32px;
    text-align: left;
    box-shadow: var(--shadow-sm);
    transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s cubic-bezier(0.22,1,0.36,1), border-color 0.22s ease;
  }

  .flashcard-wrap:hover {
    transform: translateY(-3px) scale(1.01);
    box-shadow: var(--shadow-md);
  }

  .flashcard-wrap:active {
    transform: translateY(1px) scale(0.995);
  }

  .flashcard-inner {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .card-hint {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-3);
  }

  .card-content {
    font-size: clamp(32px, 3.2vw, 42px);
    line-height: 1.32;
    font-weight: 700;
    color: var(--text);
  }

  .card-tap,
  .flashcard-helper-text {
    font-size: 13px;
    color: var(--text-3);
  }

  .card-actions,
  .flashcard-finish-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .card-btn,
  .reset-btn {
    min-height: 42px;
    padding: 0 18px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.76);
    background: linear-gradient(180deg, #ffffff 0%, var(--surface-2) 100%);
    color: #06141B;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    box-shadow:
      0 10px 18px rgba(255,255,255,0.16),
      0 8px 16px rgba(6,20,27,0.08);
    transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
  }

  .card-btn:hover,
  .reset-btn:hover {
    transform: translateY(-2px) scale(1.03);
    filter: brightness(1.02);
    box-shadow:
      0 16px 28px rgba(255,255,255,0.22),
      0 12px 20px rgba(6,20,27,0.12),
      0 0 18px rgba(255,255,255,0.14);
  }

  .card-btn:active,
  .reset-btn:active {
    transform: translateY(1px) scale(0.98);
  }

  .flashcard-score-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px;
    border-radius: 18px;
    background: rgba(255,255,255,0.78);
    border: 1px solid rgba(6,20,27,0.08);
  }

  .score-circle {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: linear-gradient(180deg, #ffffff 0%, var(--surface-2) 100%);
    color: #06141B;
    font-size: 20px;
    font-weight: 800;
    border: 1px solid rgba(255,255,255,0.82);
  }

  .score-text h3 {
    font-size: 20px;
    color: var(--text);
    margin-bottom: 6px;
  }

  .score-text p {
    font-size: 14px;
    color: var(--text-2);
  }

  .quiz-question {
    box-shadow: var(--shadow-sm);
    border-radius: 18px;
    padding: 18px;
    margin-bottom: 12px;
    transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
  }

  .quiz-question:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .q-num,
  .stat-value,
  .history-mode {
    color: var(--moss);
  }

  .q-num {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .q-text {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 12px;
    line-height: 1.6;
  }

  .q-choices {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .q-choice {
    padding: 11px 16px;
    border-radius: 12px;
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.08);
    font-size: 14px;
    cursor: pointer;
    color: var(--text-2);
    transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
    display: flex;
    align-items: center;
    gap: 10px;
    line-height: 1.5;
  }

  .q-choice:hover:not(.answered) {
    border-color: rgba(131,153,88,0.28);
    color: var(--moss);
    transform: translateX(4px);
  }

  .q-choice.correct {
    background: rgba(79,167,116,0.10);
    border-color: rgba(79,167,116,0.32);
    color: #88d8aa;
  }

  .q-choice.wrong {
    background: rgba(217,106,106,0.10);
    border-color: rgba(217,106,106,0.30);
    color: #f19a9a;
  }

  .explain-box {
    margin-top: 10px;
    padding: 12px 14px;
    background: rgba(255,255,255,0.03);
    border-left: 2px solid var(--moss);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    font-size: 13px;
    color: var(--text-2);
    line-height: 1.7;
  }

  .explain-title {
    font-size: 12px;
    font-weight: 800;
    margin-bottom: 6px;
    color: var(--text);
  }

  .explain-text {
    color: var(--text-2);
  }

  .stats-bar {
    border-radius: 18px;
    padding: 16px;
    animation: fadeUp 0.3s ease;
  }

  .stats-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }

  .stats-heading-block {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    width: 100%;
  }

  .stats-title {
    font-size: 15px;
    font-weight: 800;
    color: var(--text);
  }

  .stats-file {
    font-size: 13px;
    color: var(--text-2);
    word-break: break-word;
    display: inline-flex;
    align-items: center;
    min-width: 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 10px;
  }

  .stat-card {
    background: rgba(255,255,255,0.04);
    border-radius: 12px;
    padding: 12px 10px;
    border: 1px solid rgba(255,255,255,0.08);
    transition: all 0.22s;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .stat-topline {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .stat-card:hover {
    border-color: rgba(131,153,88,0.18);
    transform: translateY(-1px);
  }

  .stat-value {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 700;
    line-height: 1.1;
    padding-left: 23px;
  }

  .stat-icon {
    font-size: 15px;
    margin-bottom: 6px;
    color: var(--text-2);
  }

  .stat-label {
    font-size: 11px;
    color: var(--text-3);
    line-height: 1.35;
  }

  .export-btn,
  .history-toggle,
  .google-btn {
    height: 34px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    color: var(--text-2);
    cursor: pointer;
    transition: all 0.22s;
    box-shadow: var(--shadow-sm);
  }

  .export-btn,
  .history-toggle {
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .google-btn {
    width: 100%;
    height: 46px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 500;
    justify-content: center;
    gap: 10px;
  }

  .export-btn:hover,
  .history-toggle:hover,
  .google-btn:hover {
    border-color: rgba(131,153,88,0.20);
    color: var(--moss);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  .export-btn.accent {
    background: linear-gradient(180deg, #FFFFFF 0%, #CCD0CF 100%);
    color: #06141B;
    border: 1px solid rgba(255,255,255,0.82);
  }

  .spinner {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.12);
    border-top-color: var(--moss);
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loader-text {
    font-size: 14px;
    color: var(--text-3);
    font-weight: 500;
  }

  .history-wrap {
    position: relative;
  }

  .history-panel {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 300px;
    z-index: 300;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    animation: fadeUp 0.18s ease;
  }

  .history-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .history-head-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
  }

  .history-clear {
    font-size: 11px;
    color: #f19a9a;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
    transition: all 0.15s;
  }

  .history-clear:hover {
    background: rgba(217,106,106,0.10);
  }

  .history-list {
    max-height: 280px;
    overflow-y: auto;
  }

  .history-item {
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    cursor: pointer;
    transition: background 0.12s;
  }

  .history-item:last-child {
    border-bottom: none;
  }

  .history-item:hover {
    background: rgba(255,255,255,0.04);
  }

  .history-date,
  .history-preview {
    font-size: 11px;
    color: var(--text-3);
  }

  .history-preview {
    font-size: 12px;
    line-height: 1.5;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .login-page {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      radial-gradient(circle at top left, rgba(131,153,88,0.08), transparent 20%),
      radial-gradient(circle at top right, rgba(16,86,102,0.10), transparent 24%),
      linear-gradient(135deg, #061811 0%, #0a2219 42%, #103126 100%);
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  .login-bg-orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(70px);
  }

  .login-bg-orb-1 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle,var(--accent-dim),transparent 70%);
    top: -100px;
    left: -80px;
    animation: orbDrift 10s ease-in-out infinite;
  }

  .login-bg-orb-2 {
    width: 320px;
    height: 320px;
    background: radial-gradient(circle,rgba(16,86,102,0.18),transparent 70%);
    bottom: -80px;
    right: -60px;
    animation: orbDrift 12s ease-in-out infinite reverse;
    animation-delay: 3s;
  }

  @keyframes orbDrift {
    0%,100% { transform: scale(1) translate(0,0); }
    50% { transform: scale(1.08) translate(12px,-16px); }
  }

  .login-card {
    width: min(920px,100%);
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 28px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.10);
    box-shadow: var(--shadow-lg);
    position: relative;
    z-index: 2;
    animation: cardReveal 0.5s cubic-bezier(0.22,1,0.36,1);
    background: rgba(8, 31, 23, 0.78);
    backdrop-filter: blur(14px);
  }

  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to { opacity: 1; transform: none; }
  }

  .login-left {
    background: linear-gradient(160deg, #0a2219, #0d2b20 52%, #12382a);
    padding: 44px 36px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .login-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 70% at 30% 70%,rgba(16,86,102,0.16),transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 15%,rgba(131,153,88,0.10),transparent 55%);
    pointer-events: none;
  }

  .login-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.06);
    animation: ringPulse 4s ease-in-out infinite;
  }

  .login-ring-1 {
    width: 300px;
    height: 300px;
    top: -50px;
    left: -70px;
  }

  .login-ring-2 {
    width: 200px;
    height: 200px;
    top: 30px;
    left: 10px;
    border-color: rgba(255,255,255,0.04);
    animation-delay: .9s;
  }

  .login-ring-3 {
    width: 140px;
    height: 140px;
    top: 70px;
    left: 50px;
    border-color: rgba(131,153,88,0.12);
    animation-delay: 1.8s;
  }

  @keyframes ringPulse {
    0%,100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.6; }
  }

  .login-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 2;
  }

  .login-brand-badge {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg,var(--accent),var(--accent-2));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 14px;
    color: #fff;
    box-shadow: 0 4px 14px var(--accent-glow), 0 0 0 1px rgba(255,255,255,0.1) inset;
  }

  .login-brand-name {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 18px;
    color: rgba(255,255,255,0.92);
    letter-spacing: -0.3px;
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .login-brand-x {
    color: rgba(255,255,255,0.3);
    font-size: 12px;
    font-weight: 300;
  }

  .login-brand-ai {
    color: var(--moss);
  }

  .login-hero {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 24px 0;
  }

  .login-illus {
    width: 130px;
    height: 130px;
    margin: 0 auto 24px;
    position: relative;
  }

  .login-illus-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.07);
    animation: illusRing 3s ease-in-out infinite;
  }

  .login-illus-ring-2 {
    inset: 14px;
    border-color: rgba(131,153,88,0.14);
    animation-delay: .8s;
  }

  .login-illus-ring-3 {
    inset: 28px;
    border-color: rgba(16,86,102,0.22);
    animation-delay: 1.6s;
  }

  @keyframes illusRing {
    0%,100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.07); opacity: 0.6; }
  }

  .login-illus-core {
    position: absolute;
    inset: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(131,153,88,0.30), rgba(10,51,35,0.95));
    border: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    box-shadow: 0 8px 28px rgba(0,0,0,0.3),0 0 40px var(--accent-glow);
    animation: coreGlow 3s ease-in-out infinite;
  }

  @keyframes coreGlow {
    0%,100% { box-shadow: 0 8px 28px rgba(0,0,0,0.3),0 0 40px var(--accent-glow); }
    50% { box-shadow: 0 8px 28px rgba(0,0,0,0.3),0 0 60px var(--accent-glow); }
  }

  .login-tagline {
    font-family: var(--font-display);
    font-size: 30px;
    font-weight: 700;
    color: rgba(255,255,255,0.92);
    line-height: 1.2;
    letter-spacing: -0.8px;
    text-align: center;
    margin-bottom: 10px;
  }

  .login-tagline em {
    color: var(--moss);
    font-style: italic;
  }

  .login-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.45);
    text-align: center;
    line-height: 1.7;
    margin-bottom: 22px;
  }

  .login-chips {
    display: flex;
    gap: 6px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .login-chip {
    padding: 3px 12px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.52);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .login-chip-accent {
    border-color: rgba(131,153,88,0.24);
    color: var(--moss);
    background: rgba(131,153,88,0.08);
  }

  .login-right {
    background: rgba(10, 31, 23, 0.76);
    padding: 40px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .login-right::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--grad-main);
  }

  .login-right::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(ellipse 70% 40% at 100% 0%, rgba(131,153,88,0.08), transparent 60%);
  }

  .login-right-inner {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .login-tab-switch {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 14px;
    padding: 4px;
    margin-bottom: 28px;
  }

  .login-switch-btn {
    height: 38px;
    border: none;
    border-radius: 11px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.22s;
    background: transparent;
    color: var(--text-3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .login-switch-btn.active {
    background: rgba(255,255,255,0.05);
    color: var(--moss);
    box-shadow: var(--shadow-sm);
    border: 1px solid rgba(131,153,88,0.18);
  }

  .login-switch-btn:not(.active):hover {
    color: var(--text-2);
  }

  .login-form-heading {
    font-family: var(--font-display);
    font-size: 26px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }

  .login-form-sub {
    font-size: 13px;
    color: var(--text-3);
    margin-bottom: 26px;
  }

  .field {
    margin-bottom: 16px;
  }

  .field-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-2);
    text-transform: uppercase;
    letter-spacing: 1.2px;
    display: block;
    margin-bottom: 6px;
  }

  .field-wrap {
    position: relative;
  }

  .field-input {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    padding: 0 44px 0 16px;
    font-size: 14px;
    outline: none;
    transition: all 0.22s;
  }

  .field-input::placeholder {
    color: var(--text-3);
  }

  .field-input:focus {
    background: rgba(255,255,255,0.05);
  }

  .field-icon {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-3);
    font-size: 16px;
    pointer-events: none;
    transition: all 0.22s;
  }

  .field-eye {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-3);
    font-size: 16px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    line-height: 1;
    transition: all 0.22s;
  }

  .field-eye:hover,
  .field-input:focus ~ .field-icon,
  .forgot-link:hover,
  .login-footer a,
  .login-footer a:hover {
    color: var(--moss);
  }

  .forgot-row {
    display: flex;
    justify-content: flex-end;
    margin-top: -8px;
    margin-bottom: 20px;
  }

  .forgot-link {
    font-size: 12px;
    color: var(--text-3);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .submit-btn {
    width: 100%;
    height: 50px;
    background: linear-gradient(135deg, #0A3323 0%, #1d5a40 55%, #839958 100%);
    border: none;
    border-radius: 14px;
    color: #f7fbf8;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 8px 24px rgba(10,51,35,0.24);
    position: relative;
    overflow: hidden;
  }

  .submit-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
    transition: 0.6s;
  }

  .submit-btn:hover::before {
    left: 100%;
  }

  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 34px rgba(10,51,35,0.30);
  }

  .submit-btn:active {
    transform: translateY(0);
  }

  .login-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 16px 0;
    color: var(--text-3);
    font-size: 12px;
    font-weight: 500;
  }

  .login-divider::before,
  .login-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.08);
  }

  .ku-note {
    margin-top: 16px;
    padding: 10px 14px;
    background: rgba(79,167,116,0.10);
    border: 1px solid rgba(79,167,116,0.18);
    border-radius: 10px;
    font-size: 12px;
    color: #9ce2b8;
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 1.5;
  }

  .login-footer {
    margin-top: auto;
    padding-top: 18px;
    font-size: 12px;
    color: var(--text-3);
    text-align: center;
    line-height: 1.7;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .mobile-bottom-nav {
    display: none;
  }

  .mobile-nav-btn-dot {
    display: none;
  }

  @media (max-width: 1180px) {
    .layout {
      grid-template-columns: 330px minmax(0, 1fr);
    }

    .main-panel {
      padding: 28px 28px 56px;
    }

    .empty-title {
      font-size: 44px;
    }
  }

  @media (max-width: 980px) {
    .login-card {
      grid-template-columns: 1fr;
    }

    .login-left {
      padding: 32px 24px;
    }

    .login-right {
      padding: 28px 24px;
    }

    .stats-grid {
      grid-template-columns: repeat(2,1fr);
    }
  }

  @media (max-width: 820px) {
    body {
      overflow: auto;
    }

    .topnav {
      position: sticky;
      height: 56px;
      min-height: 56px;
      flex-wrap: nowrap;
      align-items: center;
      padding-top: 0;
      padding-bottom: 0;
    }

    .topnav-left {
      flex: 1;
      min-width: 0;
    }

    .topnav-right {
      flex-wrap: nowrap;
      justify-content: flex-end;
      gap: 6px;
    }

    .topnav-user {
      margin-left: 0;
    }

    .layout {
      display: flex;
      flex-direction: column;
      position: static;
      height: auto;
      min-height: calc(100dvh - 56px);
      padding-bottom: calc(84px + env(safe-area-inset-bottom, 0px));
    }

    .sidebar {
      max-width: none;
      border-right: none;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      overflow: visible;
    }

    .main-panel {
      padding: 20px 16px 36px;
      justify-content: flex-start;
      align-items: flex-start;
      width: 100%;
    }

    .options-grid {
      grid-template-columns: 1fr 1fr;
    }

    .empty-state {
      min-height: auto;
      padding-top: 8px;
    }

    .settings-stack {
      grid-template-columns: 1fr;
    }

    .mobile-bottom-nav {
      position: fixed;
      left: 12px;
      right: 12px;
      bottom: calc(12px + env(safe-area-inset-bottom, 0px));
      z-index: 35;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      padding: 8px;
      border-radius: 22px;
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      background: rgba(255,255,255,0.92);
      border: 1px solid rgba(6,20,27,0.1);
      box-shadow: 0 18px 40px rgba(6,20,27,0.14);
    }

    body.dark .mobile-bottom-nav {
      background: rgba(6,20,27,0.9);
      border-color: rgba(255,255,255,0.08);
      box-shadow: 0 18px 40px rgba(0,0,0,0.34);
    }

    .mobile-nav-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 46px;
      width: 100%;
      padding: 0 14px;
      border-radius: 16px;
      border: 1px solid rgba(6,20,27,0.08);
      background: rgba(255,255,255,0.82);
      color: #06141B;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.01em;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.4);
    }

    body.dark .mobile-nav-btn {
      border-color: rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04);
      color: #F3F6F6;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
    }

    .mobile-nav-btn.active {
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      color: #06141B;
      border-color: transparent;
      box-shadow: 0 12px 24px rgba(93, 122, 72, 0.28);
    }

    .mobile-nav-btn-dot {
      position: absolute;
      top: 10px;
      right: 12px;
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: #ff7f6a;
      box-shadow: 0 0 0 4px rgba(255,127,106,0.16);
    }

    .layout .sidebar {
      display: flex;
    }

    .layout .main-panel {
      display: none;
    }

    .layout.mobile-show-result .sidebar {
      display: none;
    }

    .layout.mobile-show-result .main-panel {
      display: flex;
      min-height: auto;
    }
  }

  @media (max-width: 640px) {
    .topnav-sub,
    .topnav-divider {
      display: none;
    }

    .topnav {
      gap: 10px;
      padding-left: 12px;
      padding-right: 12px;
    }

    .topnav-title {
      font-size: 16px;
    }

    .topnav-right {
      gap: 6px;
      justify-content: stretch;
    }

    .topnav-btn {
      height: 36px;
      padding: 0 12px;
      font-size: 12px;
    }

    .topnav-user {
      width: 100%;
      justify-content: space-between;
      padding: 8px 10px !important;
      border-radius: 18px !important;
    }

    .topnav-user-avatar {
      width: 30px !important;
      height: 30px !important;
    }

    .topnav-user-name {
      font-size: 11px !important;
    }

    .topnav-user-status {
      display: none;
    }

    .topnav-logout {
      margin-left: auto;
      height: 32px !important;
    }

    .main-panel,
    .sidebar-inner,
    .sidebar-footer {
      padding-left: 14px;
      padding-right: 14px;
    }

    .options-grid {
      grid-template-columns: 1fr;
    }

    .sidebar .options-grid {
      grid-template-columns: 1fr;
    }

    .tabs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 6px;
      padding: 6px;
      flex-wrap: nowrap;
      border-radius: 18px;
    }

    .tab-btn {
      min-height: 44px;
      height: auto;
      font-size: 12px;
      min-width: 0;
      padding: 10px 8px;
      flex: 0 0 auto;
      justify-content: center;
    }

    .upload-zone {
      min-height: 190px;
      padding: 20px 16px;
    }

    .empty-title {
      font-size: 34px;
    }

    .empty-body {
      font-size: 14px;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .option-card {
      min-height: 82px;
      padding: 16px 14px;
    }

    .difficulty-row {
      grid-template-columns: 1fr;
    }

    .settings-input,
    .settings-control {
      min-height: 46px;
      font-size: 14px;
    }

    .layout {
      gap: 0;
    }

    .sidebar {
      width: 100%;
      border-bottom: none;
      box-shadow: none;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.00)),
        rgba(11, 36, 26, 1);
      overflow: hidden;
    }

    .sidebar-inner {
      gap: 14px;
      padding-top: 14px;
      padding-bottom: 88px;
    }

    .sidebar-footer {
      position: sticky;
      bottom: 0;
      z-index: 15;
      padding-top: 10px;
      padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
      background: linear-gradient(180deg, rgba(11,36,26,0), rgba(11,36,26,1) 30%);
      border-top: none;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .action-btn {
      min-height: 56px;
      height: 56px;
      border-radius: 20px;
      font-size: 16px;
      box-shadow: 0 14px 30px rgba(10,51,35,0.26);
    }

    .sidebar-footer {
      padding-bottom: calc(92px + env(safe-area-inset-bottom, 0px));
    }

    .main-panel {
      width: 100%;
      padding-top: 18px;
      padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
    }

    .main-panel > *,
    .result-wrap {
      width: 100%;
      max-width: none;
      margin: 0;
    }

    .stats-bar {
      padding: 14px 12px;
      border-radius: 20px;
      width: 100%;
      max-width: none;
    }

    .stats-header {
      gap: 8px;
      margin-bottom: 10px;
    }

    .stats-title {
      font-size: 14px;
    }

    .stats-file {
      width: 100%;
      font-size: 12px;
      line-height: 1.5;
      padding: 8px 10px;
      border-radius: 12px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
    }

    .stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .stat-card {
      padding: 11px 10px;
      border-radius: 14px;
      gap: 6px;
    }

    .stat-icon {
      font-size: 14px;
      margin-bottom: 0;
    }

    .stat-value {
      font-size: 17px;
      padding-left: 22px;
    }

    .stat-label {
      font-size: 10px;
      line-height: 1.35;
    }

    .result-container {
      border-radius: 22px;
      overflow: visible;
    }

    .result-header {
      padding: 14px 12px;
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
      border-radius: 22px 22px 0 0;
    }

    .result-title {
      font-size: 17px;
    }

    .result-toolbar {
      width: 100%;
      justify-content: flex-start;
      gap: 8px;
    }

    .summary-lang-toggle {
      flex-shrink: 0;
    }

    .result-badge {
      display: none;
    }

    .export-btn,
    .history-toggle {
      height: 36px;
      padding: 0 12px;
      font-size: 11px;
    }

    .result-body {
      padding: 20px 14px 24px;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .result-body h2,
    .result-body h3,
    .result-body .summary-strong,
    .result-body li,
    .result-body p {
      font-size: 15px;
    }

    .trace-side-tab {
      position: fixed;
      top: auto;
      right: 14px;
      bottom: 20px;
      padding: 12px 14px;
      border-radius: 999px;
      border: 1px solid rgba(74,92,106,0.18);
      transform: none;
      transform-origin: center;
      z-index: 20;
    }

    .trace-side-tab:hover {
      transform: translateY(-1px);
    }

    .trace-side-tab.open {
      right: 14px;
      bottom: calc(56vh + 26px);
    }

    .trace-side-tab-label {
      writing-mode: initial;
      text-orientation: initial;
      font-size: 10px;
      letter-spacing: 0.06em;
    }

    .trace-side-tab-arrow {
      font-size: 12px;
    }

    .trace-drawer {
      position: fixed;
      top: auto;
      right: 12px;
      left: 12px;
      bottom: 12px;
      width: auto;
      max-height: 56vh;
      padding: 14px;
      border-radius: 20px;
      transform: translateY(18px);
      z-index: 19;
    }

    .trace-drawer.open {
      transform: translateY(0);
    }

    .url-input {
      height: 52px;
      font-size: 16px;
    }

    .text-input-area {
      min-height: 180px;
      font-size: 16px;
      padding: 16px;
      line-height: 1.75;
    }

    .panel-title {
      font-size: 14px;
      margin-bottom: 12px;
    }

    .sidebar .options-grid {
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .option-label {
      font-size: 14px;
      line-height: 1.3;
    }

    .option-desc {
      font-size: 11px;
      line-height: 1.4;
    }
  }
.loader-card.progress-loader-card {
  width: 100%;
  max-width: 760px;
  margin: 28px auto 0;
  padding: 40px 36px;
  border-radius: 30px;
  background: rgba(11, 36, 26, 0.86);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: var(--shadow-md);
}

.progress-loader-inner {
  min-height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loading-box {
  width: 176px;
  height: 176px;
  display: grid;
  place-items: center;
  margin-bottom: 20px;
  border-radius: 24px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
}

.loading-box img {
  width: 150px;
  height: 150px;
  object-fit: contain;
  animation: loaderFloat 2s ease-in-out infinite;
}

@keyframes loaderFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.loader-title {
  font-size: clamp(26px, 3.3vw, 34px);
  font-weight: 800;
  color: var(--text);
  margin-bottom: 12px;
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.loader-sub {
  font-size: 15px;
  color: var(--text-2);
  margin-bottom: 18px;
  line-height: 1.75;
  max-width: 34ch;
}

.loader-progress-wrap {
  width: 100%;
  max-width: 360px;
  margin-bottom: 8px;
}

.loader-progress-number {
  font-size: 16px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 18px;
}

.progress-bar-wrap {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.06);
}

.progress-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent-2), var(--moss));
  transition: width 0.25s ease;
}

.step-list {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.step-row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 46px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  text-align: left;
  transition: all 0.22s ease;
}

.step-row.active {
  border-color: rgba(131,153,88,0.22);
  background: rgba(131,153,88,0.07);
}

.step-row.done {
  background: rgba(79,167,116,0.08);
  border-color: rgba(79,167,116,0.16);
}

.step-dot {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  font-size: 13px;
}

.step-dot.active {
  color: var(--moss);
  border-color: rgba(131,153,88,0.28);
}

.step-dot.done {
  color: #9ce2b8;
  border-color: rgba(79,167,116,0.24);
  background: rgba(79,167,116,0.10);
}

.step-text {
  flex: 1;
  min-width: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}

.step-text.pending {
  color: var(--text-3);
}

.step-text.active {
  color: var(--text);
}

.step-text.done {
  color: var(--text-2);
}

.dot-anim {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.dot-anim span {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--moss);
  opacity: 0.35;
  animation: loaderDots 1.2s infinite ease-in-out;
}

.dot-anim span:nth-child(2) {
  animation-delay: 0.15s;
}

.dot-anim span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes loaderDots {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.35;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 820px) {
  .loader-card.progress-loader-card {
    max-width: 100%;
    margin-top: 18px;
    padding: 28px 22px;
  }

  .progress-loader-inner {
    min-height: 460px;
  }

  .loader-title {
    font-size: 28px;
  }
}

@media (max-width: 640px) {
  .progress-loader-inner {
    min-height: 400px;
  }

  .loading-box {
    width: 132px;
    height: 132px;
  }

  .loading-box img {
    width: 108px;
    height: 108px;
  }

  .loader-title {
    font-size: 24px;
  }

  .loader-sub {
    font-size: 14px;
  }

  .step-row {
    min-height: 44px;
    padding: 10px;
    gap: 10px;
  }

  .step-dot {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .step-text {
    font-size: 13px;
  }
}

  body {
    color: var(--text);
  }

  body:not(.dark) {
    background:
      linear-gradient(180deg, #d4d8d7 0%, #f4f6f6 28%, #c7cccb 100%);
  }

  body.dark {
    background:
      linear-gradient(180deg, #06141B 0%, #11212D 42%, #253745 100%);
  }

  .topnav-badge,
  .login-brand-badge {
    background: linear-gradient(180deg, #ffffff 0%, var(--surface-2) 100%);
    color: #06141B;
    box-shadow:
      0 12px 28px rgba(255,255,255,0.32),
      0 10px 20px rgba(6,20,27,0.12),
      inset 0 1px 0 rgba(255,255,255,0.92);
  }

  .topnav-btn,
  .export-btn,
  .history-toggle,
  .google-btn,
  .submit-btn,
  .action-btn {
    background: linear-gradient(180deg, #ffffff 0%, var(--surface-2) 100%);
    color: #06141B;
    border: 1px solid rgba(255,255,255,0.76);
    box-shadow:
      0 14px 30px rgba(255,255,255,0.24),
      0 10px 24px rgba(6,20,27,0.14),
      inset 0 1px 0 rgba(255,255,255,0.94);
  }

  .topnav-btn:hover,
  .export-btn:hover,
  .history-toggle:hover,
  .google-btn:hover,
  .submit-btn:hover:not(:disabled),
  .action-btn:hover:not(:disabled) {
    color: #06141B;
    border-color: rgba(255,255,255,0.94);
    box-shadow:
      0 18px 38px rgba(255,255,255,0.34),
      0 14px 28px rgba(6,20,27,0.18),
      0 0 26px rgba(255,255,255,0.22),
      inset 0 1px 0 rgba(255,255,255,0.98);
  }

  .tabs,
  .history-panel,
  .result-container,
  .quiz-question,
  .stats-bar,
  .loader-card,
  .quiz-options,
  .login-tab-switch {
    border-color: rgba(6,20,27,0.08);
    box-shadow: var(--shadow-md);
    backdrop-filter: blur(16px);
  }

  .option-card,
  .empty-step,
  .step-row,
  .login-chip,
  .login-stat,
  .history-item,
  .field-input,
  .count-input,
  .url-input,
  .text-input-area,
  .upload-zone {
    border-color: rgba(6,20,27,0.12);
  }

  .panel-title,
  .option-label,
  .result-title,
  .loader-title,
  .stat-value,
  .login-form-heading,
  .login-brand-name,
  .login-stat-val,
  .empty-title,
  .q-text {
    color: var(--text);
  }

  .empty-body,
  .option-desc,
  .result-body p,
  .q-choice,
  .login-sub,
  .stat-label,
  .history-date,
  .history-preview,
  .loader-text,
  .login-form-sub,
  .login-footer,
  .field-label,
  .count-label,
  .section-label,
  .tab-btn {
    color: var(--text-3);
  }

  .sidebar .panel-title,
  .sidebar .option-label,
  .sidebar .option-desc,
  .sidebar .tab-btn,
  .sidebar .count-label,
  .sidebar .section-label,
  .sidebar .field-label,
  .sidebar .settings-label,
  .sidebar .upload-subtitle,
  .sidebar .file-type-badge,
  .sidebar .upload-file-name,
  .sidebar .upload-file-size,
  .sidebar .url-input,
  .sidebar .text-input-area,
  .sidebar .count-input,
  .sidebar .diff-btn {
    color: #CCD0CF;
  }

  .sidebar .option-desc,
  .sidebar .panel-title,
  .sidebar .upload-subtitle,
  .sidebar .upload-file-size,
  .sidebar .file-type-badge {
    color: #9BA8AB;
  }

  .tab-btn.active,
  .option-card.selected,
  .diff-btn.sel,
  .login-switch-btn.active,
  .step-row.active {
    background: linear-gradient(180deg, #ffffff 0%, var(--surface-2) 100%);
    color: #06141B;
    border-color: rgba(255,255,255,0.82);
    box-shadow:
      0 12px 24px rgba(255,255,255,0.22),
      inset 0 1px 0 rgba(255,255,255,0.96);
  }

  .tab-btn.active {
    color: #06141B;
  }

  body:not(.dark) .topnav {
    background: rgba(255,255,255,0.78);
    border-bottom: 1px solid rgba(6,20,27,0.08);
    box-shadow: 0 16px 36px rgba(6,20,27,0.08);
  }

  body:not(.dark) .topnav-title,
  body:not(.dark) .topnav-ku,
  body:not(.dark) .topnav-ai,
  body:not(.dark) .topnav-sub,
  body:not(.dark) .topnav-x {
    color: #06141B;
  }

  body:not(.dark) .topnav-btn,
  body:not(.dark) .export-btn,
  body:not(.dark) .history-toggle,
  body:not(.dark) .google-btn,
  body:not(.dark) .submit-btn {
    background: linear-gradient(180deg, #ffffff 0%, var(--surface-2) 100%);
    border-color: rgba(255,255,255,0.76);
    color: #06141B;
    box-shadow:
      0 14px 30px rgba(255,255,255,0.24),
      0 10px 24px rgba(6,20,27,0.14),
      inset 0 1px 0 rgba(255,255,255,0.94);
  }

  body:not(.dark) .layout {
    background: linear-gradient(90deg, #06141B 0 380px, #f4f6f6 380px 100%);
  }

  body:not(.dark) .sidebar {
    background:
      linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0)),
      #06141B;
    border-right: 1px solid rgba(255,255,255,0.08);
    color: #CCD0CF;
  }

  body:not(.dark) .sidebar-footer {
    background: linear-gradient(180deg, rgba(6,20,27,0), rgba(6,20,27,0.98) 22%);
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  body:not(.dark) .main-panel {
    background:
      radial-gradient(circle at top left, rgba(255,255,255,0.72), transparent 22%),
      linear-gradient(180deg, #f8f9f9 0%, #cfd4d3 100%);
  }

  body:not(.dark) .tabs,
  body:not(.dark) .history-panel,
  body:not(.dark) .result-container,
  body:not(.dark) .quiz-question,
  body:not(.dark) .stats-bar,
  body:not(.dark) .loader-card,
  body:not(.dark) .quiz-options {
    background: rgba(255,255,255,0.88);
  }

  body:not(.dark) .option-card,
  body:not(.dark) .empty-step,
  body:not(.dark) .step-row,
  body:not(.dark) .history-item,
  body:not(.dark) .field-input,
  body:not(.dark) .count-input,
  body:not(.dark) .url-input,
  body:not(.dark) .text-input-area,
  body:not(.dark) .upload-zone {
    background: rgba(255,255,255,0.9);
    color: #06141B;
  }

  body:not(.dark) .sidebar .option-card,
  body:not(.dark) .sidebar .upload-zone,
  body:not(.dark) .sidebar .url-input,
  body:not(.dark) .sidebar .text-input-area,
  body:not(.dark) .sidebar .count-input,
  body:not(.dark) .sidebar .diff-btn {
    background: rgba(255,255,255,0.78);
    border-color: rgba(255,255,255,0.22);
    color: #06141B;
    box-shadow:
      0 10px 20px rgba(74,57,35,0.05),
      inset 0 1px 0 rgba(255,255,255,0.9);
  }

  body:not(.dark) .sidebar .diff-btn {
    background: rgba(255,255,255,0.68);
    border-color: rgba(255,255,255,0.34);
    color: #31414d;
  }

  body:not(.dark) .sidebar .diff-btn.sel {
    background: linear-gradient(180deg, #ffffff 0%, #dfe4e4 100%);
    color: #06141B;
    border-color: rgba(255,255,255,0.94);
    box-shadow:
      0 14px 28px rgba(255,255,255,0.26),
      0 10px 20px rgba(6,20,27,0.12),
      0 0 0 3px rgba(255,255,255,0.24),
      inset 0 1px 0 rgba(255,255,255,0.98);
  }

  body:not(.dark) .sidebar .option-label,
  body:not(.dark) .sidebar .upload-zone h3,
  body:not(.dark) .sidebar .upload-file-name,
  body:not(.dark) .sidebar .tab-btn.active {
    color: #06141B;
  }

  body:not(.dark) .sidebar .option-desc,
  body:not(.dark) .sidebar .upload-subtitle,
  body:not(.dark) .sidebar .upload-file-size,
  body:not(.dark) .sidebar .file-type-badge,
  body:not(.dark) .sidebar .count-label,
  body:not(.dark) .sidebar .section-label,
  body:not(.dark) .sidebar .tab-btn:not(.active) {
    color: #4A5C6A;
  }

  body:not(.dark) .sidebar .option-card.selected {
    background: linear-gradient(180deg, #ffffff 0%, #eef2f2 100%);
    border-color: rgba(255,255,255,0.96);
    transform: translateY(-2px);
    box-shadow:
      0 18px 30px rgba(255,255,255,0.22),
      0 12px 20px rgba(6,20,27,0.12),
      0 0 0 2px rgba(255,255,255,0.32),
      inset 0 1px 0 rgba(255,255,255,0.98);
  }

  body:not(.dark) .sidebar .option-card.selected .option-label {
    color: #06141B;
    font-weight: 900;
  }

  body:not(.dark) .sidebar .option-card.selected .option-desc {
    color: #4A5C6A;
  }

  body:not(.dark) .sidebar .option-card:not(.selected) {
    opacity: 0.78;
  }

  body:not(.dark) .sidebar .option-card:hover,
  body:not(.dark) .sidebar .upload-zone:hover,
  body:not(.dark) .sidebar .upload-zone.dragging {
    background: rgba(255,255,255,0.96);
    border-color: rgba(255,255,255,0.68);
  }

  body:not(.dark) .sidebar .options-panel {
    background: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    margin-top: 8px;
  }

  body:not(.dark) .sidebar .options-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  body:not(.dark) .tabs {
    background: rgba(255,255,255,0.88);
    border-color: rgba(6,20,27,0.08);
  }

  body:not(.dark) .tab-btn.active {
    background: linear-gradient(180deg, #ffffff 0%, #d7dbda 100%);
    border-color: rgba(255,255,255,0.88);
  }

  body:not(.dark) .action-btn {
    background: linear-gradient(180deg, #ffffff 0%, var(--surface-2) 100%);
    color: #06141B;
    border: 1px solid rgba(255,255,255,0.76);
    box-shadow:
      0 14px 30px rgba(255,255,255,0.24),
      0 10px 24px rgba(6,20,27,0.14),
      inset 0 1px 0 rgba(255,255,255,0.94);
  }

  body:not(.dark) .action-btn:hover:not(:disabled) {
    box-shadow:
      0 18px 38px rgba(255,255,255,0.34),
      0 14px 28px rgba(6,20,27,0.18),
      0 0 26px rgba(255,255,255,0.22),
      inset 0 1px 0 rgba(255,255,255,0.98);
  }

  body:not(.dark) .stats-grid {
    grid-template-columns: repeat(4, minmax(150px, 1fr));
  }

  @media (max-width: 640px) {
    body:not(.dark) .stats-grid,
    body.dark .stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  body:not(.dark) .stat-card {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.08);
    border-radius: 14px;
  }

  body:not(.dark) .result-header {
    background: linear-gradient(180deg, #f7f8f8 0%, #eef1f1 100%);
    border-bottom: 1px solid rgba(6,20,27,0.08);
  }

  body:not(.dark) .result-container {
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(6,20,27,0.08);
    box-shadow:
      0 20px 40px rgba(6,20,27,0.08),
      inset 0 1px 0 rgba(255,255,255,0.94);
  }

  body:not(.dark) .result-title {
    color: #06141B;
  }

  body:not(.dark) .result-body {
    background: rgba(255,255,255,0.98);
  }

  body:not(.dark) .result-body h2,
  body:not(.dark) .result-body h3,
  body:not(.dark) .result-body .summary-strong,
  body:not(.dark) .summary-lead,
  body:not(.dark) .result-body p,
  body:not(.dark) .result-body li {
      color: #06141B;
  }

  body:not(.dark) .result-body {
    padding: 26px 26px 30px;
  }

  body.dark .topnav {
    background: rgba(6,20,27,0.9);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 18px 40px rgba(0,0,0,0.34);
  }

  body.dark .topnav-title,
  body.dark .topnav-ku,
  body.dark .topnav-ai,
  body.dark .topnav-sub {
    color: #CCD0CF;
  }

  body.dark .topnav-x {
    color: #9BA8AB;
  }

  body.dark .layout {
    background: linear-gradient(90deg, #06141B 0 360px, #11212D 360px 100%);
  }

  body.dark .sidebar {
    background:
      linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)),
      #06141B;
    border-right: 1px solid rgba(255,255,255,0.06);
    color: #CCD0CF;
  }

  body.dark .sidebar-footer {
    background: linear-gradient(180deg, rgba(6,20,27,0), rgba(6,20,27,1) 22%);
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  body.dark .main-panel {
    background:
      radial-gradient(circle at top left, rgba(155,168,171,0.16), transparent 24%),
      linear-gradient(180deg, #11212D 0%, #253745 100%);
  }

  body.dark .tabs,
  body.dark .history-panel,
  body.dark .result-container,
  body.dark .quiz-question,
  body.dark .stats-bar,
  body.dark .loader-card,
  body.dark .quiz-options {
    background: rgba(18,33,45,0.88);
    border-color: rgba(255,255,255,0.08);
  }

  body.dark .option-card,
  body.dark .empty-step,
  body.dark .step-row,
  body.dark .history-item,
  body.dark .field-input,
  body.dark .count-input,
  body.dark .url-input,
  body.dark .text-input-area,
  body.dark .upload-zone {
    background: rgba(37,55,69,0.72);
    border-color: rgba(255,255,255,0.08);
    color: #CCD0CF;
  }

  body.dark .sidebar .diff-btn {
    background: rgba(30,45,57,0.92);
    border-color: rgba(204,208,207,0.14);
    color: #C7D0D2;
  }

  body.dark .sidebar .diff-btn:hover {
    background: rgba(49,67,81,0.96);
    border-color: rgba(204,208,207,0.28);
    color: #F4F7F7;
  }

  body.dark .sidebar .diff-btn.sel {
    background: linear-gradient(180deg, #f9fbfb 0%, #dbe1e1 100%);
    color: #06141B;
    border-color: rgba(255,255,255,0.96);
    box-shadow:
      0 14px 26px rgba(255,255,255,0.12),
      0 10px 20px rgba(0,0,0,0.22),
      0 0 0 3px rgba(255,255,255,0.16),
      inset 0 1px 0 rgba(255,255,255,0.98);
  }

  body.dark .sidebar .option-card.selected {
    background: linear-gradient(180deg, #3a4d5d 0%, #2b3d4b 100%);
    border-color: rgba(204,208,207,0.42);
    transform: translateY(-2px);
    box-shadow:
      0 16px 28px rgba(0,0,0,0.24),
      0 10px 18px rgba(0,0,0,0.18),
      0 0 0 2px rgba(204,208,207,0.14),
      inset 0 1px 0 rgba(255,255,255,0.10);
  }

  body.dark .sidebar .option-card.selected .option-label,
  body.dark .sidebar .option-card.selected .option-desc {
    color: #F4F7F7;
  }

  body.dark .sidebar .option-card:not(.selected) {
    opacity: 0.72;
  }


  body.dark .sidebar .upload-zone h3 {
    color: #F3F6F6;
  }

  body.dark .sidebar .tab-btn.active {
    color: #06141B;
  }

  body.dark .panel-title,
  body.dark .option-label,
  body.dark .stats-title,
  body.dark .result-title,
  body.dark .loader-title,
  body.dark .stat-value,
  body.dark .empty-title,
  body.dark .q-text,
  body.dark .result-body h2,
  body.dark .result-body h3,
  body.dark .result-body .summary-strong,
  body.dark .summary-lead,
  body.dark .result-body strong,
  body.dark .result-body li {
      color: #F3F6F6;
  }

  body.dark .empty-body,
  body.dark .option-desc,
  body.dark .stats-file,
  body.dark .result-body p,
  body.dark .q-choice,
  body.dark .stat-label,
  body.dark .history-date,
  body.dark .history-preview,
  body.dark .loader-text,
  body.dark .loader-sub,
  body.dark .count-label,
  body.dark .section-label,
  body.dark .tab-btn {
    color: #CCD0CF;
  }

  body.dark .result-container {
    background: rgba(18,33,45,0.94);
    border: 1px solid rgba(255,255,255,0.08);
  }

  body.dark .stats-file {
    color: rgba(243,246,246,0.7);
  }

  body.dark .quiz-result-header {
    background: linear-gradient(180deg, rgba(37,55,69,0.94), rgba(29,44,56,0.96));
  }

  body.dark .quiz-difficulty-badge {
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.1);
    color: #DDE5E7;
    font-size: 12px;
    font-weight: 700;
  }

  body.dark .result-header {
    background: linear-gradient(180deg, rgba(37,55,69,0.92), rgba(30,46,59,0.94));
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  body.dark .result-body {
    background: rgba(18,33,45,0.96);
  }

  body.dark .result-body p,
  body.dark .result-body li {
    color: #DDE5E7;
  }

  body.dark .result-body ul {
    color: #DDE5E7;
  }

  body.dark .quiz-question {
    background: rgba(18,33,45,0.92);
    border: 1px solid rgba(255,255,255,0.08);
  }

  body.dark .q-num {
    color: #9BA8AB;
  }

  body.dark .q-text {
    color: #F7FAFA;
  }

  body.dark .q-choice {
    background: rgba(37,55,69,0.88);
    border-color: rgba(255,255,255,0.1);
    color: #E3EAEC;
  }

  body.dark .q-choice-letter {
    color: #F7FAFA;
    font-weight: 800;
  }

  body.dark .q-choice-text {
    color: #E3EAEC;
  }

  body.dark .q-choice:hover:not(.answered) {
    background: rgba(55,75,90,0.92);
    border-color: rgba(255,255,255,0.22);
    color: #FFFFFF;
  }

  body.dark .q-choice.correct {
    background: rgba(90,170,130,0.16);
    border-color: rgba(115,214,164,0.32);
    color: #DFF7E9;
  }

  body.dark .q-choice.wrong {
    background: rgba(190,98,98,0.16);
    border-color: rgba(255,140,140,0.28);
    color: #FFE2E2;
  }

  body.dark .explain-box {
    background: rgba(37,55,69,0.72);
    border-left-color: #CCD0CF;
    color: #DDE5E7;
  }

  body.dark .explain-title {
    color: #F7FAFA;
  }

  body.dark .explain-text {
    color: #DDE5E7;
  }

  body.dark .loader-progress-number {
    color: #F3F6F6;
  }

  body.dark .step-row {
    background: rgba(37,55,69,0.86);
    border-color: rgba(255,255,255,0.1);
  }

  body.dark .step-text.pending {
    color: #9BA8AB;
  }

  body.dark .step-text.active,
  body.dark .step-text.done {
    color: #F3F6F6;
  }

  body.dark .tab-btn:not(.active):hover,
  body.dark .option-card:hover,
  body.dark .diff-btn:hover,
  body.dark .history-item:hover,
  body.dark .empty-step:hover {
    background: rgba(74,92,106,0.76);
    color: #F3F6F6;
    border-color: rgba(255,255,255,0.16);
  }

  body.dark .empty-title {
    color: #F7FAFA;
    text-shadow: 0 10px 24px rgba(0,0,0,0.18);
  }

  body.dark .empty-body,
  body.dark .empty-step,
  body.dark .empty-step-num {
    color: #D9E0E2;
  }

  body.dark .field-input:focus,
  body.dark .count-input:focus,
  body.dark .url-input:focus,
  body.dark .text-input-area:focus {
    border-color: rgba(255,255,255,0.34);
    box-shadow:
      0 0 0 4px rgba(204,208,207,0.12),
      0 10px 22px rgba(0,0,0,0.18);
    background: rgba(74,92,106,0.92);
    color: #ffffff;
  }

  body.dark .flashcard-progress-wrap {
    background: rgba(255,255,255,0.12);
  }

  body.dark .flashcard-wrap,
  body.dark .flashcard-score-bar {
    background: rgba(37,55,69,0.78);
    border-color: rgba(255,255,255,0.08);
  }

  body.dark .card-content,
  body.dark .score-text h3 {
    color: #F3F6F6;
  }

  body.dark .card-hint,
  body.dark .card-tap,
  body.dark .flashcard-helper-text,
  body.dark .score-text p {
    color: #CCD0CF;
  }

  body.dark .login-left {
    background:
      radial-gradient(circle at 20% 15%, rgba(255,255,255,0.04), transparent 20%),
      linear-gradient(180deg, #06141B 0%, #11212D 60%, #06141B 100%);
    border-right: 1px solid rgba(255,255,255,0.07);
  }

  body.dark .login-right {
    background:
      radial-gradient(circle at 80% 10%, rgba(255,255,255,0.16), transparent 18%),
      linear-gradient(180deg, #9BA8AB 0%, #CCD0CF 100%);
  }

  body:not(.dark) .login-left {
    background:
      radial-gradient(circle at 20% 15%, rgba(255,255,255,0.05), transparent 20%),
      linear-gradient(180deg, #06141B 0%, #11212D 60%, #06141B 100%);
    border-right: 1px solid rgba(255,255,255,0.07);
  }

  body:not(.dark) .login-right {
    background:
      radial-gradient(circle at 80% 10%, rgba(255,255,255,0.45), transparent 20%),
      linear-gradient(180deg, #F6F8F8 0%, #CCD0CF 100%);
  }

  .login-form-heading,
  .forgot-link,
  .login-footer a,
  .back-btn,
  .field-input,
  .field-icon,
  .field-eye,
  .login-switch-btn {
    color: #06141B;
  }

  .error-box,
  .success-box,
  .ku-note {
    background: rgba(255,255,255,0.78);
    color: #253745;
    border: 1px solid rgba(6,20,27,0.12);
  }

  @media (max-width: 640px) and (orientation: portrait) {
    .main-panel,
    .main-panel > *,
    .result-wrap,
    .result-container,
    .stats-bar,
    .stats-header,
    .stats-heading-block,
    .stats-grid,
    .stat-card {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      box-sizing: border-box;
    }

    body:not(.dark) .stats-grid,
    body.dark .stats-grid {
      grid-template-columns: 1fr !important;
      gap: 10px !important;
    }

    body:not(.dark) .stats-file,
    body.dark .stats-file,
    body:not(.dark) .stat-label,
    body.dark .stat-label,
    body:not(.dark) .stat-value,
    body.dark .stat-value {
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    body:not(.dark) .stats-bar,
    body.dark .stats-bar,
    body:not(.dark) .result-container,
    body.dark .result-container {
      overflow: hidden !important;
    }
  }

  @media (max-width: 640px) {
    html,
    body,
    #root {
      width: 100%;
      overflow-x: hidden;
    }

    body {
      overflow-x: hidden;
    }

    /* ── Mobile header: single row, no wrap ── */
    .topnav {
      flex-wrap: nowrap;
      align-items: center;
      height: 52px;
      min-height: 52px;
      padding: 0 12px;
      gap: 6px;
    }

    .topnav-left {
      flex: 1;
      width: auto;
      gap: 8px;
      min-width: 0;
    }

    .topnav-badge {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      font-size: 11px;
      flex-shrink: 0;
    }

    .topnav-title {
      font-size: 14px;
      gap: 2px;
    }

    .topnav-right {
      width: auto;
      flex-wrap: nowrap;
      gap: 4px;
      flex-shrink: 0;
    }

    .topnav-btn {
      min-height: 34px;
      height: 34px;
      padding: 0 10px;
      font-size: 11px;
    }

    /* Compact user pill: avatar + logout only, hide name/status */
    .topnav-user {
      padding: 3px 8px 3px 3px !important;
      gap: 6px !important;
      min-height: 36px !important;
      width: auto !important;
    }

    .topnav-user-meta {
      display: none !important;
    }

    .topnav-user-avatar {
      width: 28px !important;
      height: 28px !important;
    }

    .topnav-logout {
      height: 28px !important;
      padding: 0 8px !important;
      font-size: 11px !important;
    }

    .layout {
      min-height: calc(100dvh - 52px);
    }

    .sidebar {
      width: 100%;
    }

    .sidebar-inner {
      gap: 10px;
      padding: 10px 12px 80px;
    }

    .tabs {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 6px;
      padding: 6px;
      border-radius: 18px;
    }

    .tab-btn {
      min-width: 0;
      min-height: 44px;
      height: auto;
      padding: 10px 6px;
      font-size: 12px;
      line-height: 1.2;
    }

    .upload-zone,
    .url-input,
    .text-input-area,
    .count-input,
    .settings-input,
    .settings-control {
      width: 100%;
      max-width: 100%;
    }

    .upload-zone {
      min-height: 128px;
      padding: 14px 12px;
      border-radius: 18px;
    }

    .upload-icon {
      font-size: 28px;
      margin-bottom: 6px;
    }

    .upload-zone h3 {
      font-size: 15px;
      margin-bottom: 3px;
    }

    .upload-subtitle {
      font-size: 11px;
      line-height: 1.5;
      margin-bottom: 8px;
    }

    .panel-title {
      font-size: 13px;
      margin-bottom: 10px;
    }

    .sidebar .options-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .option-card {
      min-height: 72px;
      padding: 12px;
      border-radius: 16px;
      gap: 10px;
    }

    .option-icon {
      font-size: 16px;
    }

    .option-label {
      font-size: 13px;
      line-height: 1.3;
    }

    .option-desc {
      font-size: 11px;
      line-height: 1.35;
      margin-top: 2px;
    }

    .quiz-options {
      margin-top: 10px;
      padding: 12px;
      border-radius: 16px;
      gap: 12px;
    }

    .difficulty-row {
      gap: 6px;
    }

    .diff-btn {
      min-height: 44px;
      font-size: 13px;
    }

    .count-input,
    .url-input {
      min-height: 48px;
      height: 48px;
      font-size: 16px;
      border-radius: 14px;
    }

    .text-input-area {
      min-height: 110px;
      padding: 12px;
      font-size: 16px;
      line-height: 1.6;
      border-radius: 16px;
    }

    .sidebar-footer {
      padding: 10px 12px calc(12px + env(safe-area-inset-bottom, 0px));
    }

    /* CTA: bigger, more prominent — primary action on mobile */
    .action-btn {
      min-height: 52px;
      height: 52px;
      border-radius: 20px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.3px;
      box-shadow: 0 8px 24px rgba(10,51,35,0.40), 0 0 0 1px rgba(131,153,88,0.18);
    }

    .action-btn:not(:disabled) {
      box-shadow: 0 12px 32px rgba(10,51,35,0.45), 0 0 0 1px rgba(131,153,88,0.22);
    }

    .main-panel {
      padding: 14px 12px 28px;
      align-items: stretch;
    }

    /* ── Hide empty state on mobile: sidebar is the focus ── */
    .empty-state {
      display: none;
    }

    .stats-bar,
    .result-container,
    .loader-card,
    .flashcard-wrap,
    .quiz-question,
    .history-panel {
      border-radius: 18px;
    }

    .loader-card.progress-loader-card,
    .loader-card {
      padding: 24px 18px;
      margin-top: 0;
    }

    .progress-loader-inner,
    .loader-card-inner {
      min-height: 320px;
    }
  }

  @media (max-width: 430px) {
    .topnav {
      padding-left: 10px;
      padding-right: 10px;
    }

    .topnav-title {
      font-size: 13px;
    }

    .topnav-btn {
      padding: 0 8px;
      font-size: 11px;
      min-height: 32px;
      height: 32px;
    }

    .topnav-user {
      border-radius: 14px !important;
      padding: 3px 6px 3px 3px !important;
    }

    .topnav-badge {
      width: 26px;
      height: 26px;
    }

    /* Compress history toggle to icon-only */
    .history-toggle {
      padding: 0 8px;
      font-size: 0;
      gap: 0;
      min-width: 34px;
    }

    .history-toggle::before {
      content: "🕐";
      font-size: 14px;
    }

    .history-chevron {
      display: none;
    }

    .history-wrap {
      display: none;
    }

    .sidebar-inner,
    .sidebar-footer,
    .main-panel {
      padding-left: 10px;
      padding-right: 10px;
    }

    .sidebar .options-grid {
      gap: 7px;
    }

    .option-card {
      min-height: 62px;
      padding: 10px 9px;
      gap: 8px;
    }

    .option-label {
      font-size: 12px;
    }

    .option-desc {
      font-size: 10px;
    }

    .upload-zone {
      min-height: 116px;
      padding: 12px 10px;
    }

    .upload-icon {
      font-size: 24px;
    }

    .action-btn {
      min-height: 50px;
      height: 50px;
      font-size: 15px;
    }
  }

  @media (max-width: 640px) {
    .mobile-drawer-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      min-width: 34px;
      padding: 0;
      flex-shrink: 0;
    }

    .mobile-drawer-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 12px 12px 0;
      flex-shrink: 0;
    }

    .mobile-drawer-title {
      font-size: 13px;
      font-weight: 800;
      color: #CCD0CF;
      letter-spacing: 0.01em;
    }

    .mobile-drawer-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      min-width: 34px;
      padding: 0;
    }

    .mobile-drawer-backdrop {
      position: fixed;
      inset: 50px 0 0;
      border: 0;
      background: rgba(0,0,0,0.0);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.22s ease, background 0.22s ease;
      z-index: 209;
    }

    .mobile-drawer-backdrop.active {
      opacity: 1;
      pointer-events: auto;
      background: rgba(4, 11, 16, 0.42);
    }

    .topnav {
      height: 50px;
      min-height: 50px;
      padding: 0 10px;
      gap: 6px;
    }

    .topnav-left {
      gap: 8px;
    }

    .topnav-title {
      font-size: 13px;
      letter-spacing: -0.2px;
    }

    .topnav-right {
      gap: 4px;
      margin-left: auto;
    }

    .topnav-btn {
      min-width: 34px;
      height: 34px;
      padding: 0 10px;
      font-size: 11px;
      box-shadow: 0 6px 14px rgba(6,20,27,0.1);
    }

    .history-wrap {
      display: none;
    }

    .topnav-user {
      padding: 3px 6px 3px 3px !important;
      gap: 6px !important;
      border-radius: 999px !important;
    }

    .layout {
      top: 50px !important;
      height: calc(100dvh - 50px) !important;
      background: #07161d;
    }

    .sidebar {
      position: fixed;
      top: 50px;
      left: 0;
      bottom: 0;
      width: min(86vw, 360px);
      z-index: 220;
      transform: translateX(-104%);
      transition: transform 0.24s ease, box-shadow 0.24s ease;
      box-shadow: 0 18px 40px rgba(0,0,0,0.28);
      background:
        radial-gradient(circle at top left, rgba(255,255,255,0.04), transparent 24%),
        linear-gradient(180deg, #071a22 0%, #07161d 100%);
      overflow-y: auto;
      overflow-x: hidden;
    }

    .layout .sidebar,
    .layout.mobile-show-result .sidebar {
      display: flex !important;
    }

    .layout .main-panel,
    .layout:not(.mobile-show-result) .main-panel,
    .layout.mobile-show-result .main-panel {
      display: flex !important;
    }

    .layout.mobile-sidebar-open .sidebar {
      transform: translateX(0);
    }

    .sidebar-inner {
      gap: 12px;
      padding: 12px 12px 24px;
      overflow: visible;
    }

    .tabs {
      position: sticky;
      top: 0;
      z-index: 4;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      padding: 5px;
      border-radius: 18px;
      background: rgba(255,255,255,0.08);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      box-shadow: 0 10px 24px rgba(0,0,0,0.18);
    }

    .tab-btn {
      min-height: 42px;
      padding: 8px 4px;
      font-size: 12px;
      font-weight: 700;
    }

    .upload-zone {
      min-height: 104px;
      padding: 14px 12px;
      border-radius: 20px;
    }

    .upload-file-state {
      gap: 10px;
    }

    .upload-file-icon {
      font-size: 28px;
    }

    .upload-file-name {
      font-size: 15px;
    }

    .upload-file-size {
      font-size: 11px;
    }

    .upload-file-actions {
      width: 100%;
      gap: 8px;
    }

    .upload-mini-btn {
      flex: 1;
      min-height: 42px;
      height: 42px;
      padding: 0 12px;
      font-size: 13px;
    }

    .options-panel {
      margin-top: 2px;
      padding: 0;
    }

    .panel-title {
      margin-bottom: 8px;
      font-size: 12px;
      color: rgba(204,208,207,0.78);
    }

    .sidebar .options-grid {
      grid-template-columns: 1fr !important;
      gap: 8px;
    }

    .option-card {
      min-height: 64px;
      padding: 12px 14px;
      gap: 12px;
      border-radius: 18px;
      align-items: center;
    }

    .option-icon {
      font-size: 18px;
      margin-top: 0;
    }

    .option-label {
      font-size: 14px;
    }

    .option-desc {
      font-size: 11px;
      margin-top: 1px;
    }

    .quiz-options {
      margin-top: 8px;
      padding: 12px;
      border-radius: 18px;
      gap: 10px;
    }

    .difficulty-row {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
    }

    .diff-btn,
    .count-input,
    .url-input,
    .settings-input,
    .settings-control {
      min-height: 46px;
      height: 46px;
      border-radius: 14px;
    }

    .text-input-area {
      min-height: 120px;
      padding: 14px;
      font-size: 16px;
      border-radius: 18px;
    }

    .sidebar-footer {
      position: sticky;
      left: auto;
      right: auto;
      bottom: 0;
      z-index: 3;
      padding: 12px;
      background: linear-gradient(180deg, rgba(7,22,29,0), rgba(7,22,29,0.96) 32%);
      border-top: none;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .action-btn {
      min-height: 52px;
      height: 52px;
      border-radius: 18px;
      font-size: 16px;
      font-weight: 800;
      box-shadow: 0 14px 30px rgba(0,0,0,0.22);
    }

    .mobile-bottom-nav {
      display: none !important;
    }

    .main-panel {
      display: flex !important;
      width: 100%;
      padding: 16px 12px 40px;
      overflow-y: auto;
      background:
        radial-gradient(circle at top left, rgba(255,255,255,0.72), transparent 22%),
        linear-gradient(180deg, #f8f9f9 0%, #cfd4d3 100%);
    }

    body.dark .main-panel {
      background:
        radial-gradient(circle at top left, rgba(155,168,171,0.16), transparent 24%),
        linear-gradient(180deg, #11212D 0%, #253745 100%);
    }

    .empty-state {
      display: flex !important;
      width: 100%;
      min-height: auto;
      padding-top: 8px;
      align-items: flex-start;
      justify-content: flex-start;
      color: var(--text-2);
    }

    .empty-main {
      width: 100%;
      max-width: none;
      padding: 18px 16px;
      border-radius: 22px;
      background: rgba(255,255,255,0.9);
      border: 1px solid rgba(6,20,27,0.08);
      box-shadow: 0 18px 40px rgba(6,20,27,0.08);
    }

    body.dark .empty-main {
      background: rgba(18,33,45,0.92);
      border-color: rgba(255,255,255,0.08);
      box-shadow: 0 18px 40px rgba(0,0,0,0.22);
    }

    .empty-title {
      font-size: 28px;
      line-height: 1.05;
      margin-bottom: 10px;
      max-width: none;
    }

    .empty-sub {
      font-size: 13px;
      line-height: 1.7;
      color: var(--text-3);
      margin-bottom: 14px;
    }

    body.dark .empty-sub {
      color: #CCD0CF;
    }

    .empty-steps {
      gap: 10px;
      max-width: none;
    }

    .empty-step {
      padding: 12px 14px;
      border-radius: 16px;
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(6,20,27,0.08);
      box-shadow: none;
      font-size: 13px;
    }

    body.dark .empty-step {
      background: rgba(37,55,69,0.72);
      border-color: rgba(255,255,255,0.08);
    }

    .stats-bar,
    .result-container,
    .loader-card,
    .flashcard-wrap,
    .quiz-question {
      border-radius: 18px;
    }
  }
`;


export const styles = (theme = "dark") =>
  `${theme === "dark" ? darkTheme : lightTheme}${baseStyles}`;




