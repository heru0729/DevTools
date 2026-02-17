const TOOLS = [
    { id: 'json', cat: 'data', en: 'JSON Format', ja: 'JSON整形', ed: 'Prettify JSON', jd: 'JSONを整形します' },
    { id: 'sql', cat: 'data', en: 'SQL Format', ja: 'SQL整形', ed: 'Beautify SQL', jd: 'SQLを整形します' },
    { id: 'b64e', cat: 'security', en: 'Base64 Enc', ja: 'B64エンコード', ed: 'Encode to B64', jd: 'Base64に変換' },
    { id: 'sha', cat: 'security', en: 'SHA-256', ja: 'SHA-256', ed: 'Generate Hash', jd: 'ハッシュ計算' },
    { id: 'qr', cat: 'utils', en: 'QR Code', ja: 'QR作成', ed: 'Generate QR', jd: 'QRコード生成' },
    { id: 'uuid', cat: 'utils', en: 'UUID Gen', ja: 'UUID生成', ed: 'Create UUID', jd: 'UUIDを生成' }
];

let lang = localStorage.getItem('lang') || 'en';
let currentCat = 'data';
let currentTool = 'json';

function render() {
    // UI Label Update
    const isEn = lang === 'en';
    document.getElementById('lbl-run').innerText = isEn ? 'RUN' : '実行';
    document.getElementById('lbl-copy').innerText = isEn ? 'COPY' : 'コピー';
    document.getElementById('lbl-input').innerText = isEn ? 'INPUT' : '入力';
    document.getElementById('lbl-output').innerText = isEn ? 'OUTPUT' : '出力';
    document.getElementById('lbl-tools').innerText = isEn ? 'TOOLS' : 'ツール';
    document.getElementById('langBtn').innerText = lang.toUpperCase();

    // Sidebar Render
    const list = document.getElementById('toolList');
    list.innerHTML = '';
    TOOLS.filter(t => t.cat === currentCat).forEach(t => {
        const btn = document.createElement('button');
        btn.className = `tool-item ${currentTool === t.id ? 'active' : ''}`;
        btn.innerText = isEn ? t.en : t.ja;
        btn.onclick = () => { currentTool = t.id; render(); };
        list.appendChild(btn);
    });

    const active = TOOLS.find(t => t.id === currentTool);
    document.getElementById('toolName').innerText = isEn ? active.en : active.ja;
    document.getElementById('toolDesc').innerText = isEn ? active.ed : active.jd;
}

function setCat(cat) {
    currentCat = cat;
    currentTool = TOOLS.find(t => t.cat === cat).id;
    document.querySelectorAll('.rail-btn').forEach((b, i) => {
        const cats = ['data', 'security', 'utils'];
        b.classList.toggle('active', cats[i] === cat);
    });
    render();
}

function toggleLang() {
    lang = lang === 'en' ? 'ja' : 'en';
    localStorage.setItem('lang', lang);
    render();
}

function execute() {
    const val = document.getElementById('input').value;
    const txt = document.getElementById('outputText');
    const img = document.getElementById('imageResult');
    const pre = document.getElementById('outputPre');
    
    txt.innerText = ''; img.style.display = 'none'; pre.style.display = 'block';

    try {
        let res = "";
        if (currentTool === 'json') res = JSON.stringify(JSON.parse(val), null, 4);
        if (currentTool === 'sql') res = sqlFormatter.format(val);
        if (currentTool === 'b64e') res = btoa(val);
        if (currentTool === 'sha') res = CryptoJS.SHA256(val).toString();
        if (currentTool === 'uuid') res = crypto.randomUUID();
        if (currentTool === 'qr') {
            const q = qrcode(0, 'M'); q.addData(val); q.make();
            img.innerHTML = q.createImgTag(6);
            img.style.display = 'block'; pre.style.display = 'none';
        }
        txt.innerText = res;
        if(res) hljs.highlightElement(txt);
    } catch (e) { txt.innerText = "Error: " + e.message; }
}

function copyResult() {
    navigator.clipboard.writeText(document.getElementById('outputText').innerText);
}

render();
