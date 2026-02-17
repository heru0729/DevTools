const I18N = {
    en: {
        cat: { data: "DATA MAGIC", security: "SECURITY", frontend: "FRONTEND", utils: "UTILITIES" },
        labels: { input: "INPUT", output: "OUTPUT", copy: "Copy", copied: "Copied!" },
        tools: {
            'json-fmt': { name: 'JSON Formatter', desc: 'Prettify and validate JSON code.' },
            'jwt-dec': { name: 'JWT Decoder', desc: 'Inspect JWT tokens and payloads.' },
            'hash-gen': { name: 'Hash Generator', desc: 'Secure SHA256/MD5 hashing.' },
            'qr-gen': { name: 'QR Code', desc: 'Generate high-quality QR codes.' }
        }
    },
    ja: {
        cat: { data: "データ整形", security: "セキュリティ", frontend: "デザイン補助", utils: "ツール" },
        labels: { input: "入力データ", output: "出力結果", copy: "コピー", copied: "完了!" },
        tools: {
            'json-fmt': { name: 'JSON整形', desc: 'JSONを美しく整形・検証します。' },
            'jwt-dec': { name: 'JWTデコーダー', desc: 'JWTトークンの中身を解析します。' },
            'hash-gen': { name: 'ハッシュ生成', desc: 'SHA256/MD5ハッシュを作成。' },
            'qr-gen': { name: 'QRコード', desc: 'テキストからQRコードを作成。' }
        }
    }
};

let state = {
    lang: 'en',
    cat: 'data',
    toolId: 'json-fmt'
};

const tools = [
    { id: 'json-fmt', cat: 'data' },
    { id: 'jwt-dec', cat: 'security' },
    { id: 'hash-gen', cat: 'security' },
    { id: 'qr-gen', cat: 'frontend' }
];

function init() {
    render();
    
    // カテゴリボタンのイベント
    document.querySelectorAll('.rail-btn').forEach(btn => {
        btn.onclick = () => {
            state.cat = btn.dataset.cat;
            // 選択されたカテゴリの最初のツールを自動選択
            state.toolId = tools.find(t => t.cat === state.cat).id;
            render();
        };
    });

    document.getElementById('langSwitcher').onclick = () => {
        state.lang = state.lang === 'en' ? 'ja' : 'en';
        document.getElementById('langSwitcher').textContent = state.lang.toUpperCase();
        render();
    };

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') { e.preventDefault(); document.getElementById('commandPalette').classList.toggle('active'); document.getElementById('toolSearch').focus(); }
        if (e.key === 'Escape') document.getElementById('commandPalette').classList.remove('active');
    });
}

function render() {
    const lang = I18N[state.lang];
    
    // 更新: サイドバータイトル
    document.getElementById('catLabel').textContent = lang.cat[state.cat];
    document.getElementById('labelInput').textContent = lang.labels.input;
    document.getElementById('labelOutput').textContent = lang.labels.output;
    document.getElementById('copyBtn').textContent = lang.labels.copy;

    // 更新: ツールリスト
    const list = document.getElementById('toolList');
    list.innerHTML = "";
    tools.filter(t => t.cat === state.cat).forEach(t => {
        const btn = document.createElement('button');
        btn.className = `tool-item ${t.id === state.toolId ? 'active' : ''}`;
        btn.textContent = lang.tools[t.id].name;
        btn.onclick = () => { state.toolId = t.id; render(); };
        list.appendChild(btn);
    });

    // 更新: メイン表示
    const activeTool = lang.tools[state.toolId];
    document.getElementById('activeToolName').textContent = activeTool.name;
    document.getElementById('activeToolDesc').textContent = activeTool.desc;

    // 更新: ナビゲーションレールの「active」状態
    document.querySelectorAll('.rail-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.cat === state.cat);
    });

    renderActions();
}

function renderActions() {
    const container = document.getElementById('toolActions');
    container.innerHTML = "";
    
    const actions = {
        'json-fmt': [{ label: 'Format', fn: () => run(v => JSON.stringify(JSON.parse(v), null, 4)) }],
        'hash-gen': [{ label: 'SHA256', fn: () => run(v => CryptoJS.SHA256(v).toString()) }],
        'qr-gen': [{ label: 'Generate', fn: () => {
            const qr = qrcode(0, 'M'); qr.addData(document.getElementById('mainInput').value); qr.make();
            document.getElementById('imageContainer').innerHTML = qr.createImgTag(5);
        }}]
    };

    (actions[state.toolId] || []).forEach(a => {
        const b = document.createElement('button');
        b.className = "primary";
        b.textContent = a.label;
        b.onclick = a.fn;
        container.appendChild(b);
    });
}

function run(logicFn) {
    try {
        const val = document.getElementById('mainInput').value;
        const result = logicFn(val);
        document.getElementById('mainOutput').textContent = result;
        hljs.highlightElement(document.getElementById('mainOutput'));
    } catch (e) { document.getElementById('mainOutput').textContent = "Error: " + e.message; }
}

document.getElementById('copyBtn').onclick = (e) => {
    navigator.clipboard.writeText(document.getElementById('mainOutput').textContent);
    e.target.textContent = I18N[state.lang].labels.copied;
    setTimeout(() => e.target.textContent = I18N[state.lang].labels.copy, 2000);
};

init();
