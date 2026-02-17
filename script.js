const I18N = {
    en: {
        cat: { data: "DATA MAGIC", security: "SECURITY", frontend: "FRONTEND", utils: "UTILITIES" },
        labels: { input: "SOURCE INPUT", output: "COMPILED OUTPUT", copy: "Copy Result", copied: "Copied! ✅" },
        tools: {
            'json-fmt': { name: 'JSON Formatter', desc: 'Prettify and validate JSON code structures.' },
            'sql-fmt': { name: 'SQL Formatter', desc: 'Format SQL queries for better readability.' },
            'yaml-json': { name: 'YAML to JSON', desc: 'Convert YAML strings into JSON objects.' },
            'jwt-dec': { name: 'JWT Decoder', desc: 'Analyze JWT tokens, headers, and payloads.' },
            'hash-sha': { name: 'SHA-256 Hash', desc: 'Generate secure SHA-256 text hashes.' },
            'hash-md5': { name: 'MD5 Generator', desc: 'Generate MD5 message-digest hashes.' },
            'b64-tool': { name: 'Base64 Tool', desc: 'Encode or decode Base64 strings safely.' },
            'qr-gen': { name: 'QR Code Gen', desc: 'Create QR codes for URLs and text.' },
            'px-rem': { name: 'PX to REM', desc: 'Convert pixels to REM based on 16px.' },
            'unix-tm': { name: 'Unix Stamp', desc: 'Convert Unix timestamps to readable dates.' },
            'uuid-v4': { name: 'UUID Generator', desc: 'Generate random UUID v4 strings.' },
            'lorem-ip': { name: 'Lorem Ipsum', desc: 'Generate placeholder dummy text.' }
        }
    },
    ja: {
        cat: { data: "データ整形", security: "セキュリティ", frontend: "フロントエンド", utils: "ユーティリティ" },
        labels: { input: "入力データ", output: "出力結果", copy: "結果をコピー", copied: "コピー完了! ✅" },
        tools: {
            'json-fmt': { name: 'JSON整形', desc: 'JSONコードを綺麗に整形・検証します。' },
            'sql-fmt': { name: 'SQL整形', desc: 'SQLクエリを読みやすく整形します。' },
            'yaml-json': { name: 'YAML ↔ JSON', desc: 'YAMLとJSONを相互変換します。' },
            'jwt-dec': { name: 'JWT解析', desc: 'JWTトークンのヘッダーと中身を解析します。' },
            'hash-sha': { name: 'SHA-256生成', desc: 'セキュアなSHA-256ハッシュを作成。' },
            'hash-md5': { name: 'MD5生成', desc: 'MD5ハッシュを一瞬で生成します。' },
            'b64-tool': { name: 'Base64変換', desc: 'Base64のエンコード・デコードを行います。' },
            'qr-gen': { name: 'QRコード作成', desc: 'URLやテキストからQRコードを作成。' },
            'px-rem': { name: 'PX ↔ REM変換', desc: 'ピクセルとREM単位を変換します。' },
            'unix-tm': { name: 'Unix時刻変換', desc: 'Unixスタンプを日時に変換します。' },
            'uuid-v4': { name: 'UUID生成', desc: 'ランダムなUUID v4を生成します。' },
            'lorem-ip': { name: 'ダミーテキスト', desc: 'テスト用のLorem Ipsum文を生成。' }
        }
    }
};

let appState = {
    lang: 'en',
    cat: 'data',
    toolId: 'json-fmt'
};

const toolMap = [
    { id: 'json-fmt', cat: 'data' }, { id: 'sql-fmt', cat: 'data' }, { id: 'yaml-json', cat: 'data' },
    { id: 'jwt-dec', cat: 'security' }, { id: 'hash-sha', cat: 'security' }, { id: 'hash-md5', cat: 'security' }, { id: 'b64-tool', cat: 'security' },
    { id: 'qr-gen', cat: 'frontend' }, { id: 'px-rem', cat: 'frontend' },
    { id: 'unix-tm', cat: 'utils' }, { id: 'uuid-v4', cat: 'utils' }, { id: 'lorem-ip', cat: 'utils' }
];

function init() {
    render();
    bindEvents();
}

function bindEvents() {
    // カテゴリボタン
    document.querySelectorAll('.rail-btn').forEach(btn => {
        btn.onclick = () => {
            appState.cat = btn.dataset.cat;
            appState.toolId = toolMap.find(t => t.cat === appState.cat).id;
            render();
        };
    });

    // 言語スイッチ
    document.getElementById('langSwitcher').onclick = () => {
        appState.lang = appState.lang === 'en' ? 'ja' : 'en';
        render();
    };

    // テーマスイッチ
    document.getElementById('themeSwitcher').onclick = (e) => {
        document.body.classList.toggle('light');
        e.target.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
    };

    // コピー
    document.getElementById('copyBtn').onclick = (e) => {
        const txt = document.getElementById('mainOutput').textContent;
        if (!txt) return;
        navigator.clipboard.writeText(txt);
        const original = e.target.textContent;
        e.target.textContent = I18N[appState.lang].labels.copied;
        setTimeout(() => e.target.textContent = original, 2000);
    };
}

function render() {
    const lang = I18N[appState.lang];
    
    // UIテキスト更新
    document.getElementById('catLabel').textContent = lang.cat[appState.cat];
    document.getElementById('labelInput').textContent = lang.labels.input;
    document.getElementById('labelOutput').textContent = lang.labels.output;
    document.getElementById('langSwitcher').textContent = appState.lang.toUpperCase();

    // ナビボタン状態
    document.querySelectorAll('.rail-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.cat === appState.cat);
    });

    // ツールリスト生成
    const list = document.getElementById('toolList');
    list.innerHTML = "";
    toolMap.filter(t => t.cat === appState.cat).forEach(t => {
        const btn = document.createElement('button');
        btn.className = `tool-item ${t.id === appState.toolId ? 'active' : ''}`;
        btn.textContent = lang.tools[t.id].name;
        btn.onclick = () => { appState.toolId = t.id; render(); };
        list.appendChild(btn);
    });

    // アクティブツールの詳細
    const active = lang.tools[appState.toolId];
    document.getElementById('activeToolName').textContent = active.name;
    document.getElementById('activeToolDesc').textContent = active.desc;

    renderActions();
}

function renderActions() {
    const bar = document.getElementById('toolActions');
    bar.innerHTML = "";
    const btn = (lbl, fn) => {
        const b = document.createElement('button'); b.className = "primary"; b.textContent = lbl; b.onclick = fn;
        bar.appendChild(b);
    };

    const input = () => document.getElementById('mainInput').value;
    const output = (v) => { 
        document.getElementById('imageContainer').innerHTML = ""; 
        document.getElementById('mainOutput').textContent = v; 
        hljs.highlightElement(document.getElementById('mainOutput'));
    };

    // ロジック分岐
    switch(appState.toolId) {
        case 'json-fmt': btn('Beautify', () => output(JSON.stringify(JSON.parse(input()), null, 4))); break;
        case 'sql-fmt': btn('Format SQL', () => output(sqlFormatter.format(input()))); break;
        case 'jwt-dec': btn('Decode JWT', () => output(JSON.stringify(JSON.parse(atob(input().split('.')[1])), null, 4))); break;
        case 'hash-sha': btn('Generate', () => output(CryptoJS.SHA256(input()).toString())); break;
        case 'b64-tool': 
            btn('Encode', () => output(btoa(input()))); 
            btn('Decode', () => output(atob(input()))); 
            break;
        case 'qr-gen': btn('Create QR', () => {
            const qr = qrcode(0, 'M'); qr.addData(input()); qr.make();
            document.getElementById('imageContainer').innerHTML = qr.createImgTag(6);
            document.getElementById('mainOutput').textContent = "";
        }); break;
        case 'uuid-v4': btn('Generate New', () => output(crypto.randomUUID())); break;
        case 'unix-tm': btn('Convert', () => output(new Date(parseInt(input()) * 1000).toLocaleString())); break;
        case 'px-rem': btn('to REM', () => output((parseFloat(input()) / 16) + "rem")); break;
        case 'lorem-ip': btn('Generate', () => output("Lorem ipsum dolor sit amet, consectetur adipiscing elit...")); break;
    }
}

init();
