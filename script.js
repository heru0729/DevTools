// --- 500選のコア機能データベース ---
const tools = [
    { id: 'json-fmt', cat: 'data', name: 'JSON Formatter', desc: 'JSONの整形・圧縮', tags: 'json, format, minify' },
    { id: 'sql-fmt', cat: 'data', name: 'SQL Formatter', desc: 'SQLクエリの整形', tags: 'sql, db, format' },
    { id: 'yaml-json', cat: 'data', name: 'YAML ↔ JSON', desc: 'YAMLとJSONの相互変換', tags: 'yaml, json, convert' },
    { id: 'jwt-dec', cat: 'security', name: 'JWT Decoder', desc: 'JWTトークンの解析', tags: 'jwt, auth, token' },
    { id: 'hash-gen', cat: 'security', name: 'Hash Generator', desc: 'SHA256, MD5ハッシュ生成', tags: 'sha256, md5, hash' },
    { id: 'b64-dec', cat: 'security', name: 'Base64 Tool', desc: 'Base64のエンコード・デコード', tags: 'base64, enc, dec' },
    { id: 'qr-gen', cat: 'frontend', name: 'QR Code', desc: 'テキストからQRコードを生成', tags: 'qr, code, image' },
    { id: 'px-rem', cat: 'frontend', name: 'PX ↔ REM', desc: 'フォントサイズ変換', tags: 'css, px, rem' },
    { id: 'unix-tm', cat: 'utils', name: 'Unix Timestamp', desc: '時間のスタンプ変換', tags: 'time, unix, stamp' },
    { id: 'uuid-gen', cat: 'utils', name: 'UUID Generator', desc: 'UUID v4, v7の生成', tags: 'uuid, id, gen' }
];

let currentTool = tools[0];

// --- 初期化 ---
window.onload = () => {
    switchCategory('data');
    renderTool();
    
    // Ctrl + K 検索呼び出し
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            document.getElementById('commandPalette').classList.add('active');
            document.getElementById('toolSearch').focus();
        }
        if (e.key === 'Escape') document.getElementById('commandPalette').classList.remove('active');
    });
};

// --- カテゴリ切り替え ---
function switchCategory(cat) {
    document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('active'));
    event?.target?.classList?.add('active');
    
    document.getElementById('currentCatTitle').textContent = cat.toUpperCase();
    const list = document.getElementById('toolList');
    list.innerHTML = "";
    
    tools.filter(t => t.cat === cat).forEach(t => {
        const btn = document.createElement('button');
        btn.className = `tool-item ${t.id === currentTool.id ? 'active' : ''}`;
        btn.textContent = t.name;
        btn.onclick = () => {
            currentTool = t;
            renderTool();
            switchCategory(cat); // 再描画
        };
        list.appendChild(btn);
    });
}

// --- ツール描画 & アクション生成 ---
function renderTool() {
    document.getElementById('activeToolName').textContent = currentTool.name;
    document.getElementById('activeToolDesc').textContent = currentTool.desc;
    const actionArea = document.getElementById('toolActions');
    actionArea.innerHTML = "";

    // ツールごとの専用ボタンを生成
    if (currentTool.id === 'json-fmt') {
        createAction('Prettify', () => processData(val => JSON.stringify(JSON.parse(val), null, 4)));
        createAction('Minify', () => processData(val => JSON.stringify(JSON.parse(val))));
    } else if (currentTool.id === 'hash-gen') {
        createAction('SHA256', () => processData(val => CryptoJS.SHA256(val).toString()));
        createAction('MD5', () => processData(val => CryptoJS.MD5(val).toString()));
    } else if (currentTool.id === 'qr-gen') {
        createAction('Generate', () => {
            const val = document.getElementById('mainInput').value;
            const qr = qrcode(0, 'M'); qr.addData(val); qr.make();
            document.getElementById('imageContainer').innerHTML = qr.createImgTag(5);
            document.getElementById('mainOutput').textContent = "QR Code Generated Above";
        });
    }
    // 他の機能も同様にelse ifで追加可能...
}

function createAction(label, fn) {
    const b = document.createElement('button');
    b.className = "primary";
    b.textContent = label;
    b.onclick = fn;
    document.getElementById('toolActions').appendChild(b);
}

// --- 共通データ処理 ---
function processData(callback) {
    const input = document.getElementById('mainInput').value;
    const output = document.getElementById('mainOutput');
    document.getElementById('imageContainer').innerHTML = ""; // 画像クリア
    try {
        output.textContent = callback(input);
        hljs.highlightElement(output);
    } catch (e) {
        output.textContent = "Error: " + e.message;
    }
}

// --- 検索エンジン ---
document.getElementById('toolSearch').oninput = (e) => {
    const val = e.target.value.toLowerCase();
    const res = document.getElementById('searchResult');
    res.innerHTML = "";
    tools.filter(t => t.name.toLowerCase().includes(val) || t.tags.includes(val)).forEach(t => {
        const d = document.createElement('div');
        d.className = "search-item";
        d.innerHTML = `<span>${t.name}</span><small>${t.cat}</small>`;
        d.onclick = () => { currentTool = t; renderTool(); document.getElementById('commandPalette').classList.remove('active'); };
        res.appendChild(d);
    });
};

function copyResult(e) {
    const txt = document.getElementById('mainOutput').textContent;
    navigator.clipboard.writeText(txt);
    const btn = e.target;
    btn.textContent = "Copied! ✅";
    setTimeout(() => btn.textContent = "Copy Result", 2000);
}

function toggleTheme() { document.body.classList.toggle('light'); }
