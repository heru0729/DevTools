const I18N = {
    en: {
        cat: { data: "DATA", security: "AUTH", frontend: "UI/UX", utils: "TOOLS" },
        labels: { input: "INPUT", output: "OUTPUT", copy: "Copy", copied: "Done!" },
        tools: {
            'json-fmt': { name: 'JSON Format', desc: 'Prettify JSON data.' },
            'sql-fmt': { name: 'SQL Format', desc: 'Prettify SQL queries.' },
            'yaml-json': { name: 'YAML ↔ JSON', desc: 'Convert YAML & JSON.' },
            'xml-fmt': { name: 'XML Format', desc: 'Beautify XML/HTML.' },
            'jwt-dec': { name: 'JWT Decode', desc: 'Analyze JWT tokens.' },
            'hash-sha': { name: 'SHA-256', desc: 'Secure hashing.' },
            'hash-md5': { name: 'MD5 Gen', desc: 'MD5 hashing.' },
            'b64-tool': { name: 'Base64', desc: 'Encode/Decode Base64.' },
            'qr-gen': { name: 'QR Code', desc: 'Create QR images.' },
            'px-rem': { name: 'PX ↔ REM', desc: 'CSS Unit converter.' },
            'color-conv': { name: 'Color Conv', desc: 'Hex/RGB conversion.' },
            'unix-tm': { name: 'Unix Time', desc: 'Epoch conversion.' },
            'uuid-v4': { name: 'UUID Gen', desc: 'Generate unique IDs.' },
            'lorem-ip': { name: 'Lorem Ipsum', desc: 'Placeholder text.' },
            'diff-chk': { name: 'Diff Check', desc: 'Compare two texts.' }
        }
    },
    ja: {
        cat: { data: "データ", security: "認証", frontend: "UI/UX", utils: "ツール" },
        labels: { input: "入力データ", output: "出力結果", copy: "コピー", copied: "完了!" },
        tools: {
            'json-fmt': { name: 'JSON整形', desc: 'JSONを綺麗にします' },
            'sql-fmt': { name: 'SQL整形', desc: 'SQLを整形します' },
            'yaml-json': { name: 'YAML ↔ JSON', desc: 'YAMLとJSONを変換' },
            'xml-fmt': { name: 'XML整形', desc: 'XMLを綺麗にします' },
            'jwt-dec': { name: 'JWT解析', desc: 'JWTのデコード' },
            'hash-sha': { name: 'SHA-256', desc: 'ハッシュ作成' },
            'hash-md5': { name: 'MD5生成', desc: 'MD5ハッシュ作成' },
            'b64-tool': { name: 'Base64', desc: 'Base64変換' },
            'qr-gen': { name: 'QR作成', desc: 'QRコード作成' },
            'px-rem': { name: 'PX ↔ REM', desc: 'ピクセル変換' },
            'color-conv': { name: '色変換', desc: '色コード変換' },
            'unix-tm': { name: 'Unix変換', desc: '時刻の変換' },
            'uuid-v4': { name: 'UUID生成', desc: 'UUID v4作成' },
            'lorem-ip': { name: 'ダミー文', desc: 'テストテキスト生成' },
            'diff-chk': { name: '差分比較', desc: 'テキスト比較' }
        }
    }
};

let appState = { lang: 'en', cat: 'data', toolId: 'json-fmt' };
const toolMap = [
    { id: 'json-fmt', cat: 'data' }, { id: 'sql-fmt', cat: 'data' }, { id: 'yaml-json', cat: 'data' }, { id: 'xml-fmt', cat: 'data' },
    { id: 'jwt-dec', cat: 'security' }, { id: 'hash-sha', cat: 'security' }, { id: 'hash-md5', cat: 'security' }, { id: 'b64-tool', cat: 'security' },
    { id: 'qr-gen', cat: 'frontend' }, { id: 'px-rem', cat: 'frontend' }, { id: 'color-conv', cat: 'frontend' },
    { id: 'unix-tm', cat: 'utils' }, { id: 'uuid-v4', cat: 'utils' }, { id: 'lorem-ip', cat: 'utils' }, { id: 'diff-chk', cat: 'utils' }
];

document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    render();
});

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
        const isLight = document.body.classList.toggle('light');
        e.target.textContent = isLight ? '☀️' : '🌙';
        const themeLink = document.getElementById('hljs-theme');
        themeLink.href = isLight 
            ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"
            : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/tokyo-night-dark.min.css";
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
    document.getElementById('langSwitcher').textContent = appState.lang.toUpperCase();
    document.getElementById('labelInput').textContent = lang.labels.input;
    document.getElementById('labelOutput').textContent = lang.labels.output;
    document.getElementById('copyBtn').textContent = lang.labels.copy;

    document.querySelectorAll('.rail-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === appState.cat));

    const list = document.getElementById('toolList');
    list.innerHTML = "";
    toolMap.filter(t => t.cat === appState.cat).forEach(t => {
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
    
    const input = () => document.getElementById('mainInput').value;
    const out = (v) => { 
        document.getElementById('imageContainer').innerHTML = ""; 
        document.getElementById('mainOutput').textContent = v; 
        if(v) hljs.highlightElement(document.getElementById('mainOutput'));
    };

    try {
        switch(appState.toolId) {
            case 'json-fmt': addBtn('Format', () => out(JSON.stringify(JSON.parse(input()), null, 4))); break;
            case 'sql-fmt': addBtn('Format SQL', () => out(sqlFormatter.format(input()))); break;
            case 'jwt-dec': addBtn('Decode', () => out(JSON.stringify(JSON.parse(atob(input().split('.')[1])), null, 4))); break;
            case 'hash-sha': addBtn('Hash', () => out(CryptoJS.SHA256(input()).toString())); break;
            case 'qr-gen': addBtn('Generate', () => {
                const qr = qrcode(0, 'M'); qr.addData(input()); qr.make();
                document.getElementById('imageContainer').innerHTML = qr.createImgTag(5);
                document.getElementById('mainOutput').textContent = "";
            }); break;
            case 'uuid-v4': addBtn('Generate', () => out(crypto.randomUUID())); break;
            case 'unix-tm': addBtn('Convert', () => out(new Date(parseInt(input()) * 1000).toLocaleString())); break;
            case 'lorem-ip': addBtn('Generate', () => out("Lorem ipsum dolor sit amet...")); break;
        }
    } catch(e) { out("Invalid Input"); }
}
