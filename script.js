const I18N = {
    en: {
        cat: { data: "DATA MAGIC", security: "SECURITY", frontend: "FRONTEND", utils: "UTILITIES" },
        tools: {
            'json-fmt': { name: 'JSON Formatter', desc: 'Beautify JSON.' },
            'sql-fmt': { name: 'SQL Formatter', desc: 'Format SQL queries.' },
            'jwt-dec': { name: 'JWT Decoder', desc: 'Decode JWT tokens.' },
            'hash-sha': { name: 'SHA-256', desc: 'Generate Hash.' },
            'qr-gen': { name: 'QR Code', desc: 'Generate QR.' },
            'unix-tm': { name: 'Unix Stamp', desc: 'Time conversion.' }
        }
    },
    ja: {
        cat: { data: "データ整形", security: "セキュリティ", frontend: "フロントエンド", utils: "ツール" },
        tools: {
            'json-fmt': { name: 'JSON整形', desc: 'JSONを綺麗にします' },
            'sql-fmt': { name: 'SQL整形', desc: 'SQLを読みやすくします' },
            'jwt-dec': { name: 'JWT解析', desc: 'JWTトークンの解析' },
            'hash-sha': { name: 'SHA-256', desc: 'ハッシュ作成' },
            'qr-gen': { name: 'QR作成', desc: 'QRコード作成' },
            'unix-tm': { name: 'Unix変換', desc: '時刻の変換' }
        }
    }
};

let appState = { lang: 'ja', cat: 'data', toolId: 'json-fmt' };
const toolList = [
    { id: 'json-fmt', cat: 'data' }, { id: 'sql-fmt', cat: 'data' },
    { id: 'jwt-dec', cat: 'security' }, { id: 'hash-sha', cat: 'security' },
    { id: 'qr-gen', cat: 'frontend' }, { id: 'unix-tm', cat: 'utils' }
];

document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    bindUI();
    render();
}

function bindUI() {
    // カテゴリボタン
    document.querySelectorAll('.rail-btn').forEach(btn => {
        btn.onclick = () => {
            appState.cat = btn.dataset.cat;
            appState.toolId = toolList.find(t => t.cat === appState.cat).id;
            render();
        };
    });

    // 言語
    document.getElementById('langSwitcher').onclick = () => {
        appState.lang = appState.lang === 'ja' ? 'en' : 'ja';
        render();
    };

    // テーマ
    document.getElementById('themeSwitcher').onclick = () => {
        document.body.classList.toggle('light');
    };
}

function render() {
    const lang = I18N[appState.lang];
    document.getElementById('catLabel').textContent = lang.cat[appState.cat];
    document.getElementById('langSwitcher').textContent = appState.lang.toUpperCase();

    // アクティブなカテゴリボタンの強調
    document.querySelectorAll('.rail-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === appState.cat));

    // ツールリストの更新
    const list = document.getElementById('toolList');
    list.innerHTML = "";
    toolList.filter(t => t.cat === appState.cat).forEach(t => {
        const btn = document.createElement('button');
        btn.className = `tool-item ${t.id === appState.toolId ? 'active' : ''}`;
        btn.textContent = lang.tools[t.id].name;
        btn.onclick = () => { appState.toolId = t.id; render(); };
        list.appendChild(btn);
    });

    // ツール詳細の描画
    const active = lang.tools[appState.toolId];
    document.getElementById('activeToolName').textContent = active.name;
    document.getElementById('activeToolDesc').textContent = active.desc;

    renderActions();
}

function renderActions() {
    const bar = document.getElementById('toolActions');
    bar.innerHTML = "";
    const addBtn = (lbl, fn) => {
        const b = document.createElement('button'); b.className = "primary"; b.textContent = lbl; b.onclick = fn;
        bar.appendChild(b);
    };

    const out = (v) => { document.getElementById('mainOutput').textContent = v; };

    if (appState.toolId === 'json-fmt') addBtn('Format', () => out(JSON.stringify(JSON.parse(document.getElementById('mainInput').value), null, 4)));
    if (appState.toolId === 'hash-sha') addBtn('Hash', () => out(CryptoJS.SHA256(document.getElementById('mainInput').value)));
    if (appState.toolId === 'qr-gen') addBtn('Generate', () => {
        const qr = qrcode(0, 'M'); qr.addData(document.getElementById('mainInput').value); qr.make();
        document.getElementById('imageContainer').innerHTML = qr.createImgTag(4);
    });
}
