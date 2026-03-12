export const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;900&family=Sarabun:wght@300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --ku-green: #1a6b3a;
    --ku-green-light: #2d9957;
    --ku-gold: #c9a227;
    --ku-gold-light: #f0c952;
    --bg-dark: #0a0f0d;
    --bg-card: #111a14;
    --bg-elevated: #172012;
    --text-primary: #e8f5e9;
    --text-secondary: #90a890;
    --text-muted: #4a6b4a;
    --border: #1e3a22;
    --accent-teal: #00c9a7;
    --accent-orange: #ff7043;
    --glow-green: 0 0 30px rgba(45,153,87,0.3);
    --glow-gold: 0 0 20px rgba(201,162,39,0.3);
  }

  body { background: var(--bg-dark); color: var(--text-primary); font-family: 'Sarabun', sans-serif; min-height: 100vh; overflow-x: hidden; }
  .app { max-width: 1100px; margin: 0 auto; padding: 0 24px 80px; }

  /* HEADER */
  .header { padding: 32px 0 28px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid var(--border); margin-bottom: 40px; position: relative; }
  .header::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 200px; height: 1px; background: linear-gradient(90deg, var(--ku-green-light), transparent); }
  .logo-badge { background: linear-gradient(135deg, var(--ku-green), var(--ku-green-light)); width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-family: 'Kanit', sans-serif; font-weight: 900; font-size: 18px; color: white; box-shadow: var(--glow-green); flex-shrink: 0; }
  .header-text h1 { font-family: 'Kanit', sans-serif; font-weight: 700; font-size: 22px; letter-spacing: -0.3px; }
  .header-text p { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }
  .ku-tag { margin-left: auto; background: rgba(201,162,39,0.12); border: 1px solid rgba(201,162,39,0.3); color: var(--ku-gold-light); font-size: 11px; font-family: 'Kanit', sans-serif; padding: 4px 12px; border-radius: 20px; letter-spacing: 0.5px; }

  /* TABS */
  .tabs { display: flex; gap: 4px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 5px; margin-bottom: 32px; }
  .tab-btn { flex: 1; padding: 10px 8px; border: none; border-radius: 12px; font-family: 'Kanit', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; background: transparent; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 6px; }
  .tab-btn.active { background: linear-gradient(135deg, var(--ku-green), var(--ku-green-light)); color: white; box-shadow: var(--glow-green); }
  .tab-btn:hover:not(.active) { color: var(--text-secondary); background: var(--bg-elevated); }

  /* UPLOAD */
  .upload-zone { border: 2px dashed var(--border); border-radius: 20px; padding: 48px 32px; text-align: center; cursor: pointer; transition: all 0.25s; background: var(--bg-card); position: relative; overflow: hidden; }
  .upload-zone::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(45,153,87,0.04), transparent 70%); pointer-events: none; }
  .upload-zone:hover, .upload-zone.dragging { border-color: var(--ku-green-light); background: var(--bg-elevated); box-shadow: var(--glow-green); }
  .upload-icon { font-size: 48px; margin-bottom: 16px; }
  .upload-zone h3 { font-family: 'Kanit', sans-serif; font-size: 18px; margin-bottom: 8px; }
  .upload-zone p { color: var(--text-secondary); font-size: 14px; }
  .file-types { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 16px; }
  .file-type-tag { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 8px; padding: 4px 10px; font-size: 12px; color: var(--text-secondary); font-family: 'Kanit', sans-serif; }
  input[type=file] { display: none; }
  .file-preview { display: flex; align-items: center; gap: 12px; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; margin-top: 16px; }
  .file-icon { font-size: 28px; }
  .file-info { flex: 1; }
  .file-name { font-weight: 500; font-size: 14px; }
  .file-size { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
  .remove-btn { background: rgba(255,112,67,0.1); border: 1px solid rgba(255,112,67,0.3); color: var(--accent-orange); border-radius: 8px; padding: 6px 12px; font-size: 12px; cursor: pointer; transition: all 0.2s; }
  .remove-btn:hover { background: rgba(255,112,67,0.2); }

  /* URL / TEXT */
  .url-section { margin-top: 20px; }
  .url-section label { font-size: 13px; color: var(--text-secondary); display: block; margin-bottom: 8px; }
  .url-input { width: 100%; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; color: var(--text-primary); font-family: 'Sarabun', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
  .url-input:focus { border-color: var(--ku-green-light); }
  .url-input::placeholder { color: var(--text-muted); }
  .text-input-area { width: 100%; min-height: 140px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 16px; color: var(--text-primary); font-family: 'Sarabun', sans-serif; font-size: 14px; line-height: 1.7; resize: vertical; outline: none; transition: border-color 0.2s; margin-top: 10px; }
  .text-input-area:focus { border-color: var(--ku-green-light); }
  .text-input-area::placeholder { color: var(--text-muted); }
  .section-label { font-size: 13px; color: var(--text-secondary); margin-bottom: 4px; font-family: 'Kanit', sans-serif; }

  /* OPTIONS */
  .options-panel { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 24px; margin-top: 24px; }
  .options-panel h4 { font-family: 'Kanit', sans-serif; color: var(--text-secondary); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; font-size: 12px; }
  .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .option-card { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px; }
  .option-card.selected { border-color: var(--ku-green-light); background: rgba(45,153,87,0.1); box-shadow: 0 0 15px rgba(45,153,87,0.15); }
  .option-icon { font-size: 20px; }
  .option-label { font-family: 'Kanit', sans-serif; font-size: 14px; font-weight: 500; }
  .option-desc { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

  /* QUIZ OPTIONS */
  .quiz-options { margin-top: 20px; }
  .difficulty-row { display: flex; gap: 8px; margin-top: 8px; }
  .diff-btn { flex: 1; padding: 10px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-elevated); color: var(--text-secondary); cursor: pointer; font-family: 'Kanit', sans-serif; font-size: 13px; transition: all 0.2s; }
  .diff-btn.easy.sel { border-color: var(--accent-teal); background: rgba(0,201,167,0.1); color: var(--accent-teal); }
  .diff-btn.medium.sel { border-color: var(--ku-gold); background: rgba(201,162,39,0.1); color: var(--ku-gold-light); }
  .diff-btn.hard.sel { border-color: var(--accent-orange); background: rgba(255,112,67,0.1); color: var(--accent-orange); }
  .count-row { display: flex; align-items: center; gap: 12px; margin-top: 16px; }
  .count-row label { font-size: 13px; color: var(--text-secondary); }
  .count-input { width: 70px; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; color: var(--text-primary); text-align: center; font-size: 14px; outline: none; }

  /* BUTTON */
  .action-btn { width: 100%; margin-top: 24px; background: linear-gradient(135deg, var(--ku-green) 0%, var(--ku-green-light) 100%); border: none; border-radius: 16px; padding: 16px; color: white; font-family: 'Kanit', sans-serif; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.25s; box-shadow: var(--glow-green); display: flex; align-items: center; justify-content: center; gap: 8px; }
  .action-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 40px rgba(45,153,87,0.5); }
  .action-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* LOADING */
  .loading-state { text-align: center; padding: 60px 32px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; margin-top: 24px; }
  .spinner { width: 48px; height: 48px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--ku-green-light); animation: spin 0.8s linear infinite; margin: 0 auto 20px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-state p { color: var(--text-secondary); font-size: 15px; }

  /* ERROR */
  .error-box { background: rgba(255,112,67,0.1); border: 1px solid rgba(255,112,67,0.35); color: var(--accent-orange); border-radius: 14px; padding: 14px 18px; margin-top: 20px; font-size: 14px; line-height: 1.6; }

  /* RESULT */
  .result-container { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; animation: fadeIn 0.4s ease; margin-top: 24px; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .result-header { padding: 20px 24px; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-card)); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .result-title { font-family: 'Kanit', sans-serif; font-size: 16px; font-weight: 600; }
  .result-badge { background: rgba(45,153,87,0.2); border: 1px solid rgba(45,153,87,0.4); color: var(--ku-green-light); font-size: 11px; font-family: 'Kanit', sans-serif; padding: 3px 10px; border-radius: 20px; }
  .result-body { padding: 28px 24px; }
  .result-body h2 { font-family: 'Kanit', sans-serif; font-size: 19px; margin-bottom: 14px; color: var(--ku-gold-light); }
  .result-body h3 { font-family: 'Kanit', sans-serif; font-size: 15px; margin: 18px 0 9px; color: var(--ku-green-light); }
  .result-body p { line-height: 1.8; color: var(--text-secondary); margin-bottom: 10px; font-size: 15px; }
  .result-body ul { padding-left: 0; list-style: none; }
  .result-body li { padding: 10px 14px 10px 36px; background: var(--bg-elevated); border-radius: 10px; margin-bottom: 7px; color: var(--text-primary); line-height: 1.6; font-size: 14px; position: relative; }
  .result-body li::before { content: '▸'; position: absolute; left: 13px; color: var(--ku-green-light); }

  /* QUIZ */
  .quiz-question { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 16px; padding: 20px; margin-bottom: 14px; }
  .q-num { font-size: 11px; color: var(--ku-green-light); font-family: 'Kanit', sans-serif; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 7px; }
  .q-text { font-size: 15px; font-weight: 500; margin-bottom: 13px; line-height: 1.6; }
  .q-choices { display: flex; flex-direction: column; gap: 8px; }
  .q-choice { padding: 10px 16px; border-radius: 10px; background: var(--bg-card); border: 1px solid var(--border); font-size: 14px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 10px; }
  .q-choice:hover:not(.answered) { border-color: var(--ku-green-light); }
  .q-choice.correct { background: rgba(0,201,167,0.1); border-color: var(--accent-teal); color: var(--accent-teal); }
  .q-choice.wrong { background: rgba(255,112,67,0.1); border-color: var(--accent-orange); color: var(--accent-orange); }
  .q-choice.show-correct { background: rgba(0,201,167,0.05); border-color: rgba(0,201,167,0.3); }
  .explain-box { margin-top: 11px; padding: 11px 14px; background: rgba(26,107,58,0.2); border-left: 3px solid var(--ku-green-light); border-radius: 0 10px 10px 0; font-size: 13px; color: var(--text-secondary); line-height: 1.7; }
  .explain-box strong { color: var(--ku-green-light); display: block; margin-bottom: 3px; }
  .score-bar { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 16px; padding: 20px; margin-bottom: 22px; display: flex; align-items: center; gap: 20px; }
  .score-circle { width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, var(--ku-green), var(--ku-green-light)); display: flex; align-items: center; justify-content: center; font-family: 'Kanit', sans-serif; font-size: 20px; font-weight: 700; box-shadow: var(--glow-green); flex-shrink: 0; }
  .score-text h3 { font-family: 'Kanit', sans-serif; font-size: 17px; }
  .score-text p { color: var(--text-secondary); font-size: 13px; margin-top: 3px; }
  .reset-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 12px; padding: 10px 20px; color: var(--text-secondary); cursor: pointer; font-family: 'Kanit', sans-serif; font-size: 14px; transition: all 0.2s; margin-top: 22px; }
  .reset-btn:hover { border-color: var(--ku-green-light); color: var(--ku-green-light); }

  @media (max-width: 600px) {
    .options-grid { grid-template-columns: 1fr; }
    .tabs { gap: 2px; }
    .tab-btn { font-size: 11px; padding: 8px 4px; }
  }
`;
