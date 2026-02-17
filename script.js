const I18N = {
    en: {
        cat: { data: "DATA", security: "AUTH", frontend: "UI/UX", utils: "TOOLS" },
        labels: { input: "INPUT", output: "OUTPUT", copy: "Copy", copied: "Done!" },
        tools: {
            'json-fmt': { name: 'JSON Format', desc: 'Prettify JSON data.' },
            'sql-fmt': { name: 'SQL Format', desc: 'Prettify SQL queries.' },
            'jwt-dec': { name: 'JWT Decode', desc: 'Decode JWT tokens.' },
            'hash-sha': { name: 'SHA-256', desc: 'Generate Hash.' },
            'qr-gen': { name: 'QR Code', desc: 'Create QR images.' },
            'unix-tm': { name: 'Unix Time', desc: 'Epoch conversion.' }
        }
    },
    ja: {
        cat: { data: "データ", security: "認証", frontend: "UIデザイン", utils: "ツール" },
        labels: { input: "入力", output: "出力", copy: "コピー", copied: "完了!" },
        tools: {
            'json-fmt': { name: 'JSON整形', desc: 'JSONを綺麗にします' },
            'sql-fmt': { name: 'SQL整形', desc: 'SQLを整形します' },
            'jwt-dec': { name: 'JWT解析', desc: 'JWTのデコード' },
            'hash-sha': { name: 'SHA-256', desc: 'ハッシュ作成' },
            'qr-gen': { name: 'QR作成', desc: 'QRコード作成' },
            'unix-tm': { name: 'Unix変換', desc: '時刻の変換' }
        }
    }
};

let appState = { lang: 'en', cat: 'data', toolId: 'json-fmt' };
const toolList = [
    { id: 'json-fmt', cat: 'data' }, { id: 'sql-fmt', cat: 'data' },
    { id: 'jwt-dec', cat: 'security' }, { id: 'hash-sha', cat: 'security' },
    { id: 'qr-gen', cat: 'frontend' }, { id: 'unix-tm', cat: 'utils' }
];

document.addEventListener('DOMContentLoaded', () => {
    bindUI();
    render();
});

function bindUI() {
    document.querySelectorAll('.rail-btn').forEach(btn => {
        btn.onclick = () => {
            appState.cat = btn.dataset.cat;
            appState.toolId = toolList.find(t => t.cat === appState.cat).id;
            render();
        };
    });

    document.getElementById('langSwitcher').onclick = () => {
        appState.lang = appState.lang === 'ja' ? 'en' : 'ja';
        render();
    };

    document.getElementById('themeSwitcher').onclick = (e) => {
        const isLight = document.body.classList.toggle('light');
        e.target.textContent = isLight ? '☀️' : '🌙';
        
        // Highlight.jsのテーマ切り替え（任意）
        const themeLink = document.getElementById('hljs-theme');
        themeLink.href = isLight 
            ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"
            : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/tokyo-night-dark.min.css";
    };
}

function render() {
    const lang = I18N[appState.lang];
    document.getElementById('langSwitcher').textContent = appState.lang.toUpperCase();
    document.getElementById('labelInput').textContent = lang.labels.input;
    document.getElementById('labelOutput').textContent = lang.labels.output;
    document.getElementById('copyBtn').textContent = lang.labels.copy;

    document.querySelectorAll('.rail-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === appState.cat));

    const list = document.getElementById('toolList');
    list.innerHTML = "";
    toolList.filter(t => t.cat === appState.cat).forEach(t => {
        const btn = document.createElement('button');
        btn.className = `tool-item ${t.id === appState.toolId ? 'active' : ''}`;
        btn.textContent = lang.tools[t.id].name;
        btn.onclick = () => { appState.toolId = t.id; render(); };
        list.appendChild(btn);
    });

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
    
    const out = (v) => { 
        document.getElementById('imageContainer').innerHTML = ""; 
        document.getElementById('mainOutput').textContent = v; 
        if(v) hljs.highlightElement(document.getElementById('mainOutput'));
    };

    if (appState.toolId === 'json-fmt') addBtn('Format', () => out(JSON.stringify(JSON.parse(document.getElementById('mainInput').value), null, 4)));
    if (appState.toolId === 'hash-sha') addBtn('Hash', () => out(CryptoJS.SHA256(document.getElementById('mainInput').value).toString()));
    if (appState.toolId === 'qr-gen') addBtn('Generate', () => {
        const qr = qrcode(0, 'M'); qr.addData(document.getElementById('mainInput').value); qr.make();
        document.getElementById('imageContainer').innerHTML = qr.createImgTag(5);
        document.getElementById('mainOutput').textContent = "";
    });
}
