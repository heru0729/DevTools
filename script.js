const I18N = {
    en: {
        cat: { data: "DATA MAGIC", security: "SECURITY", frontend: "FRONTEND", utils: "UTILITIES" },
        labels: { input: "SOURCE INPUT", output: "COMPILED OUTPUT", copy: "Copy Result", copied: "Copied! ✅" },
        tools: {
            'json-fmt': { name: 'JSON Formatter', desc: 'Prettify and validate JSON code.' },
            'sql-fmt': { name: 'SQL Formatter', desc: 'Format SQL queries for readability.' },
            'yaml-json': { name: 'YAML ↔ JSON', desc: 'Convert between YAML and JSON.' },
            'xml-fmt': { name: 'XML Formatter', desc: 'Beautify XML/HTML structures.' },
            'jwt-dec': { name: 'JWT Decoder', desc: 'Analyze JWT tokens and payloads.' },
            'hash-sha': { name: 'SHA-256 Hash', desc: 'Generate secure SHA-256 hashes.' },
            'hash-md5': { name: 'MD5 Gen', desc: 'Generate MD5 message-digests.' },
            'b64-tool': { name: 'Base64 Tool', desc: 'Encode/Decode Base64 strings.' },
            'qr-gen': { name: 'QR Code Gen', desc: 'Create QR codes from any text.' },
            'px-rem': { name: 'PX ↔ REM', desc: 'CSS unit conversion (Base 16px).' },
            'color-conv': { name: 'Color Picker', desc: 'HEX, RGB, HSL conversion.' },
            'unix-tm': { name: 'Unix Stamp', desc: 'Epoch time to human-readable date.' },
            'uuid-v4': { name: 'UUID Gen', desc: 'Generate unique v4 identifiers.' },
            'lorem-ip': { name: 'Lorem Ipsum', desc: 'Generate placeholder text.' },
            'diff-chk': { name: 'Text Diff', desc: 'Compare two text blocks.' }
        }
    },
    ja: {
        cat: { data: "データ整形", security: "セキュリティ", frontend: "フロントエンド", utils: "ツール" },
        labels: { input: "入力データ", output: "出力結果", copy: "コピー", copied: "完了! ✅" },
        tools: {
            'json-fmt': { name: 'JSON整形', desc: 'JSONを美しく整形・検証します。' },
            'sql-fmt': { name: 'SQL整形', desc: 'SQLクエリを読みやすく整形します。' },
            'yaml-json': { name: 'YAML ↔ JSON', desc: 'YAMLとJSONを相互変換します。' },
            'xml-fmt': { name: 'XML整形', desc: 'XMLやHTMLを整形します。' },
            'jwt-dec': { name: 'JWT解析', desc: 'JWTトークンの中身を解析します。' },
            'hash-sha': { name: 'SHA-256生成', desc: 'セキュアなハッシュを作成します。' },
            'hash-md5': { name: 'MD5生成', desc: 'MD5ハッシュを作成します。' },
            'b64-tool': { name: 'Base64変換', desc: 'Base64のエンコード・デコード。' },
            'qr-gen': { name: 'QRコード作成', desc: 'URLやテキストからQRコードを作成。' },
            'px-rem': { name: 'PX ↔ REM変換', desc: 'ピクセルとREM単位を変換。' },
            'color-conv': { name: '色変換', desc: 'HEX/RGB/HSLを相互変換。' },
            'unix-tm': { name: 'Unix時刻変換', desc: 'Unixスタンプを日時に変換します。' },
            'uuid-v4': { name: 'UUID生成', desc: 'ランダムなUUID v4を生成します。' },
            'lorem-ip': { name: 'ダミーテキスト', desc: 'テスト用テキストを生成します。' },
            'diff-chk': { name: '差分チェック', desc: '2つのテキストの差分を比較。' }
        }
    }
};

let appState = {
    lang: 'ja',
    cat: 'data',
    toolId: 'json-fmt'
};

// 🛠 全ツールマッピング（ここに追加すると全デバイスに反映されます）
const toolMap = [
    { id: 'json-fmt', cat: 'data' },
    { id: 'sql-fmt', cat: 'data' },
    { id: 'yaml-json', cat: 'data' },
    { id: 'xml-fmt', cat: 'data' },
    { id: 'jwt-dec', cat: 'security' },
    { id: 'hash-sha', cat: 'security' },
    { id: 'hash-md5', cat: 'security' },
    { id: 'b64-tool', cat: 'security' },
    { id: 'qr-gen', cat: 'frontend' },
    { id: 'px-rem', cat: 'frontend' },
    { id: 'color-conv', cat: 'frontend' },
    { id: 'unix-tm', cat: 'utils' },
    { id: 'uuid-v4', cat: 'utils' },
    { id: 'lorem-ip', cat: 'utils' },
    { id: 'diff-chk', cat: 'utils' }
];

document.addEventListener('DOMContentLoaded', init);

function init() {
    bindEvents();
    render();
}

function bindEvents() {
    document.querySelectorAll('.rail-btn').forEach(btn => {
        btn.onclick = () => {
            appState.cat = btn.dataset.cat;
            appState.toolId = toolMap.find(t => t.cat === appState.cat).id;
            render();
        };
    });

    document.getElementById('langSwitcher').onclick = () => {
        appState.lang = appState.lang === 'ja' ? 'en' : 'ja';
        render();
    };

    document.getElementById('themeSwitcher').onclick = (e) => {
        document.body.classList.toggle('light');
        e.target.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
    };

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
    
    document.getElementById('catLabel').textContent = lang.cat[appState.cat];
    document.getElementById('langSwitcher').textContent = appState.lang.toUpperCase();
    document.getElementById('labelInput').textContent = lang.labels.input;
    document.getElementById('labelOutput').textContent = lang.labels.output;

    document.querySelectorAll('.rail-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.cat === appState.cat);
    });

    const list = document.getElementById('toolList');
    list.innerHTML = "";
    toolMap.filter(t => t.cat === appState.cat).forEach(t => {
        const btn = document.createElement('button');
        btn.className = `tool-item ${t.id === appState.toolId ? 'active' : ''}`;
        btn.textContent = lang.tools[t.id].name;
        btn.onclick = () => { 
            appState.toolId = t.id; 
            render(); 
        };
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

    const input = () => document.getElementById('mainInput').value;
    const output = (v) => { 
        document.getElementById('imageContainer').innerHTML = ""; 
        document.getElementById('mainOutput').textContent = v; 
        if (v && v !== "") hljs.highlightElement(document.getElementById('mainOutput'));
    };

    // 実行ロジック
    try {
        switch(appState.toolId) {
            case 'json-fmt': addBtn('Format', () => output(JSON.stringify(JSON.parse(input()), null, 4))); break;
            case 'sql-fmt': addBtn('Format SQL', () => output(sqlFormatter.format(input()))); break;
            case 'yaml-json': addBtn('To JSON', () => output(JSON.stringify(jsyaml.load(input()), null, 4))); break;
            case 'jwt-dec': addBtn('Decode', () => output(JSON.stringify(JSON.parse(atob(input().split('.')[1])), null, 4))); break;
            case 'hash-sha': addBtn('Hash', () => output(CryptoJS.SHA256(input()).toString())); break;
            case 'hash-md5': addBtn('MD5', () => output(CryptoJS.MD5(input()).toString())); break;
            case 'b64-tool': 
                addBtn('Encode', () => output(btoa(input()))); 
                addBtn('Decode', () => output(atob(input()))); 
                break;
            case 'qr-gen': addBtn('Create QR', () => {
                const qr = qrcode(0, 'M'); qr.addData(input()); qr.make();
                document.getElementById('imageContainer').innerHTML = qr.createImgTag(5);
                document.getElementById('mainOutput').textContent = "";
            }); break;
            case 'px-rem': addBtn('to REM', () => output((parseFloat(input()) / 16) + "rem")); break;
            case 'unix-tm': addBtn('Convert', () => output(new Date(parseInt(input()) * 1000).toLocaleString())); break;
            case 'uuid-v4': addBtn('Generate', () => output(crypto.randomUUID())); break;
            case 'lorem-ip': addBtn('Generate', () => output("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")); break;
        }
    } catch (e) {
        output("Error: Invalid Input Data");
    }
}
