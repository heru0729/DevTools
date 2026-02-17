:root {
    --bg: #0c0c0e; --sidebar: #141418; --panel: #1c1c22;
    --accent: #818cf8; --accent-glow: rgba(129, 140, 248, 0.2);
    --border: #27272a; --text: #f4f4f5; --text-dim: #71717a;
    --font-main: 'Plus Jakarta Sans', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
}

body.light {
    --bg: #ffffff; --sidebar: #f8f8fa; --panel: #ffffff;
    --border: #e4e4e7; --text: #09090b; --text-dim: #71717a; --accent: #4f46e5;
}

* { box-sizing: border-box; transition: 0.15s ease; }
body { margin: 0; font-family: var(--font-main); background: var(--bg); color: var(--text); height: 100vh; overflow: hidden; }

.app-shell { display: flex; height: 100vh; }

/* 🚦 Nav Rail & Controls */
.nav-rail { width: 76px; background: var(--sidebar); border-right: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; padding: 24px 0; }
.brand { font-weight: 900; color: var(--accent); font-size: 12px; margin-bottom: 40px; border: 2px solid var(--accent); padding: 4px; border-radius: 8px; }
.nav-group { display: flex; flex-direction: column; gap: 20px; flex: 1; }

.rail-btn { width: 48px; height: 48px; border: 1px solid transparent; background: transparent; font-size: 20px; cursor: pointer; border-radius: 14px; color: var(--text-dim); }
.rail-btn:hover { background: rgba(255,255,255,0.05); color: var(--text); }
.rail-btn.active { background: var(--accent); color: white; box-shadow: 0 0 20px var(--accent-glow); border-color: rgba(255,255,255,0.2); }

.control-btn {
    width: 44px; height: 44px; background: var(--panel); border: 1px solid var(--border);
    color: var(--text); font-weight: 800; font-size: 11px; cursor: pointer;
    border-radius: 12px; margin-top: 12px; display: flex; align-items: center; justify-content: center;
}
.control-btn:hover { border-color: var(--accent); color: var(--accent); box-shadow: 0 0 10px var(--accent-glow); }

/* 📂 Sidebar Tools */
.tool-sidebar { width: 260px; background: var(--sidebar); border-right: 1px solid var(--border); display: flex; flex-direction: column; }
.sidebar-header { padding: 32px 24px 16px; font-size: 11px; font-weight: 800; color: var(--text-dim); letter-spacing: 0.15em; }
.tool-list { flex: 1; padding: 0 12px; overflow-y: auto; }
.tool-item {
    width: 100%; padding: 12px 16px; border: 1px solid transparent; background: transparent;
    color: var(--text-dim); text-align: left; cursor: pointer; border-radius: 10px;
    font-size: 13px; font-weight: 600; margin-bottom: 6px;
}
.tool-item:hover { color: var(--text); background: rgba(255,255,255,0.03); }
.tool-item.active { background: var(--panel); color: var(--accent); border-color: var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

/* 🖥️ Workspace & Editors */
.workspace { flex: 1; display: flex; flex-direction: column; }
.workspace-header { padding: 30px 48px; display: flex; justify-content: space-between; align-items: center; }
.title-area h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.03em; }
.title-area p { margin: 4px 0 0; color: var(--text-dim); font-size: 14px; }

.editor-grid { flex: 1; display: grid; grid-template-columns: 1fr 1fr; background: var(--border); gap: 1px; border-top: 1px solid var(--border); }
.editor-container { background: var(--bg); display: flex; flex-direction: column; position: relative; }
.editor-label { padding: 10px 24px; font-size: 10px; font-weight: 800; color: var(--text-dim); border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.05); }

textarea {
    flex: 1; background: transparent; border: none; color: var(--text); padding: 24px;
    font-family: var(--font-mono); font-size: 13px; line-height: 1.7; resize: none; outline: none;
}
.output-viewer { flex: 1; position: relative; background: #08080a; display: flex; flex-direction: column; }
pre { margin: 0; flex: 1; padding: 24px; overflow: auto; }

/* 🔘 Interactive Elements */
.action-bar { display: flex; gap: 10px; }
button.primary {
    background: var(--accent); color: white; border: none; padding: 10px 22px;
    border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer;
    box-shadow: 0 4px 15px var(--accent-glow);
}
button.primary:hover { transform: translateY(-1px); filter: brightness(1.1); }

.fab-copy {
    position: absolute; top: 16px; right: 20px; background: #222228; color: #fff;
    border: 1px solid var(--border); padding: 8px 14px; border-radius: 8px;
    font-size: 11px; font-weight: 700; cursor: pointer; z-index: 10;
}
.fab-copy:hover { border-color: var(--accent); color: var(--accent); }

/* 📢 Ad Boxes */
.ad-card { margin: 24px; padding: 16px; background: var(--panel); border: 1px solid var(--border); border-radius: 12px; }
.ad-tag { font-size: 9px; color: var(--accent); font-weight: 800; margin-bottom: 8px; }
.ad-box { height: 80px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.2); border-radius: 8px; font-size: 11px; color: var(--text-dim); text-align: center; line-height: 1.4; }

.footer-ad-bar { height: 50px; background: var(--sidebar); border-top: 1px solid var(--border); display: flex; align-items: center; padding: 0 40px; gap: 20px; }
.ad-banner { font-size: 11px; color: var(--text-dim); flex: 1; }

.custom-scroll::-webkit-scrollbar { width: 5px; }
.custom-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
