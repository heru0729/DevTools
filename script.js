const I18N = {
    en: {
        search: "Search Tools...",
        data: "DATA MAGIC",
        security: "SECURITY",
        frontend: "FRONTEND",
        utils: "UTILITIES",
        copy: "Copy Result",
        copied: "Copied! ✅",
        input: "INPUT",
        output: "OUTPUT",
        tools: {
            'json-fmt': { name: 'JSON Formatter', desc: 'Prettify and validate JSON data.' },
            'jwt-dec': { name: 'JWT Decoder', desc: 'Parse and inspect JWT tokens.' },
            'hash-gen': { name: 'Hash Generator', desc: 'Create SHA256 or MD5 hashes.' },
            'qr-gen': { name: 'QR Code', desc: 'Generate QR codes from text.' }
        }
    },
    ja: {
        search: "ツールを検索...",
        data: "データ整形",
        security: "セキュリティ",
        frontend: "フロントエンド",
        utils: "ユーティリティ",
        copy: "結果をコピー",
        copied: "コピー完了! ✅",
        input: "入力",
        output: "出力",
        tools: {
            'json-fmt': { name: 'JSON整形', desc: 'JSONデータを綺麗に整形・検証します。' },
            'jwt-dec': { name: 'JWTデコーダー', desc: 'JWTトークンを解析して中身を表示します。' },
            'hash-gen': { name: 'ハッシュ生成', desc: 'SHA256やMD5ハッシュを作成します。' },
            'qr-gen': { name: 'QRコード生成', desc: 'テキストからQRコードを作成します。' }
        }
    }
};

let currentLang = 'en';
let currentCat = 'data';
let currentToolId = 'json-fmt';

const tools = [
    { id: 'json-fmt', cat: 'data', tags: 'json,format' },
    { id: 'jwt-dec', cat: 'security', tags: 'jwt,auth' },
    { id: 'hash-gen', cat: 'security', tags: 'hash,sha256' },
    { id: 'qr-gen', cat: 'frontend', tags: 'qr,code' }
];

// --- Initialization ---
function init() {
    renderUI();
    
    // Event Listeners
    document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.onclick = () => {
            currentCat = btn.dataset.cat;
            document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderUI();
        };
    });

    document.getElementById('langSwitcher').onclick = () => {
        currentLang = currentLang === 'en' ? 'ja' : 'en';
        document.getElementById('langSwitcher').textContent = currentLang.toUpperCase();
        renderUI();
    };

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') { e.preventDefault(); document.getElementById('commandPalette').classList.toggle('active'); document.getElementById('toolSearch').focus(); }
        if (e.key === 'Escape') document.getElementById('commandPalette').classList.remove('active');
    });
}

function renderUI() {
    const lang = I18N[currentLang];
    document.getElementById('catLabel').textContent = lang[currentCat];
    document.getElementById('toolSearch').placeholder = lang.search;
    document.getElementById('copyBtn').textContent = lang.copy;
    document.querySelectorAll('.pane-header')[0].textContent = lang.input;
    document.querySelectorAll('.pane-header')[1].textContent = lang.output;

    const list = document.getElementById('toolList');
    list.innerHTML = "";
    tools.filter(t => t.cat === currentCat).forEach(t => {
        const btn = document.createElement('button');
        btn.className = `tool-item ${t.id === currentToolId ? 'active' : ''}`;
        btn.textContent = lang.tools[t.id].name;
        btn.onclick = () => { currentToolId = t.id; renderUI(); };
        list.appendChild(btn);
    });

    const activeTool = lang.tools[currentToolId];
    document.getElementById('activeToolName').textContent = activeTool.name;
    document.getElementById('activeToolDesc').textContent = activeTool.desc;
    
    renderActions();
}

function renderActions() {
    const actions = document.getElementById('toolActions');
    actions.innerHTML = "";
    if (currentToolId === 'json-fmt') {
        createAction('Format', () => runLogic(v => JSON.stringify(JSON.parse(v), null, 4)));
    } else if (currentToolId === 'hash-gen') {
        createAction('SHA256', () => runLogic(v => CryptoJS.SHA256(v).toString()));
    } else if (currentToolId === 'qr-gen') {
        createAction('Generate', () => {
            const qr = qrcode(0, 'M'); qr.addData(document.getElementById('mainInput').value); qr.make();
            document.getElementById('imageContainer').innerHTML = qr.createImgTag(5);
        });
    }
}

function createAction(label, fn) {
    const b = document.createElement('button'); b.className = "primary"; b.textContent = label; b.onclick = fn;
    document.getElementById('toolActions').appendChild(b);
}

function runLogic(fn) {
    try {
        const out = fn(document.getElementById('mainInput').value);
        document.getElementById('mainOutput').textContent = out;
        hljs.highlightElement(document.getElementById('mainOutput'));
    } catch (e) { document.getElementById('mainOutput').textContent = "Error: " + e.message; }
}

document.getElementById('copyBtn').onclick = (e) => {
    navigator.clipboard.writeText(document.getElementById('mainOutput').textContent);
    e.target.textContent = I18N[currentLang].copied;
    setTimeout(() => e.target.textContent = I18N[currentLang].copy, 2000);
};

init();
