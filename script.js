const ALL_TOOLS = [
    { id: 'json', cat: 'data', en: 'JSON Format', ja: 'JSON整形', ed: 'Prettify JSON data', jd: 'JSONを整形・検証します' },
    { id: 'json-min', cat: 'data', en: 'JSON Minify', ja: 'JSON圧縮', ed: 'Minify JSON string', jd: 'JSONを1行に圧縮します' },
    { id: 'sql', cat: 'data', en: 'SQL Format', ja: 'SQL整形', ed: 'Format SQL query', jd: 'SQLクエリを整形します' },
    { id: 'yaml', cat: 'data', en: 'YAML ↔ JSON', ja: 'YAML変換', ed: 'Convert YAML/JSON', jd: 'YAMLとJSONを相互変換' },
    { id: 'b64e', cat: 'security', en: 'Base64 Enc', ja: 'B64エンコード', ed: 'Text to Base64', jd: 'Base64にエンコード' },
    { id: 'b64d', cat: 'security', en: 'Base64 Dec', ja: 'B64デコード', ed: 'Base64 to Text', jd: 'Base64をデコード' },
    { id: 'sha', cat: 'security', en: 'SHA-256', ja: 'SHA-256', ed: 'Generate SHA-256', jd: 'ハッシュ値を計算します' },
    { id: 'jwt', cat: 'security', en: 'JWT Decode', ja: 'JWTデコード', ed: 'Decode JWT payload', jd: 'JWTのペイロードを解析' },
    { id: 'qr', cat: 'utils', en: 'QR Code', ja: 'QR作成', ed: 'Generate QR image', jd: 'QRコードを生成します' },
    { id: 'uuid', cat: 'utils', en: 'UUID Gen', ja: 'UUID生成', ed: 'Create v4 UUID', jd: 'UUID v4を生成します' },
    { id: 'epoch', cat: 'utils', en: 'Unix Time', ja: 'エポック変換', ed: 'Unix ↔ Date', jd: 'Unix時間と日時を変換' }
];

let lang = localStorage.getItem('p_lang') || 'en';
let curCat = 'data';
let curTool = 'json';

function render() {
    const isEn = lang === 'en';
    document.getElementById('lbl-run').innerText = isEn ? 'RUN' : '実行';
    document.getElementById('lbl-copy').innerText = isEn ? 'COPY' : 'コピー';
    document.getElementById('lbl-input').innerText = isEn ? 'INPUT' : '入力';
    document.getElementById('lbl-output').innerText = isEn ? 'OUTPUT' : '出力';
    document.getElementById('lbl-tools').innerText = isEn ? 'TOOLS' : 'ツール';
    document.getElementById('langBtn').innerText = lang.toUpperCase();

    const list = document.getElementById('toolList');
    list.innerHTML = '';
    ALL_TOOLS.filter(t => t.cat === curCat).forEach(t => {
        const btn = document.createElement('button');
        btn.className = `tool-item ${curTool === t.id ? 'active' : ''}`;
        btn.innerText = isEn ? t.en : t.ja;
        btn.onclick = () => { curTool = t.id; render(); };
        list.appendChild(btn);
    });

    const active = ALL_TOOLS.find(t => t.id === curTool);
    document.getElementById('toolName').innerText = isEn ? active.en : active.ja;
    document.getElementById('toolDesc').innerText = isEn ? active.ed : active.jd;
    document.getElementById('input').value = localStorage.getItem('last_' + curTool) || "";
}

function setCat(cat) {
    curCat = cat;
    curTool = ALL_TOOLS.find(t => t.cat === cat).id;
    document.querySelectorAll('.rail-btn').forEach((b, i) => {
        b.classList.toggle('active', ['data','security','utils'][i] === cat);
    });
    render();
}

function toggleLang() {
    lang = (lang === 'en') ? 'ja' : 'en';
    localStorage.setItem('p_lang', lang);
    render();
}

function execute() {
    const val = document.getElementById('input').value;
    const txt = document.getElementById('outputText');
    const img = document.getElementById('imageResult');
    const pre = document.getElementById('outputPre');
    txt.innerText = ''; img.style.display = 'none'; pre.style.display = 'block';

    if(!val && curTool !== 'uuid') return;
    localStorage.setItem('last_' + curTool, val);

    try {
        let r = "";
        if (curTool === 'json') r = JSON.stringify(JSON.parse(val), null, 4);
        if (curTool === 'json-min') r = JSON.stringify(JSON.parse(val));
        if (curTool === 'sql') r = sqlFormatter.format(val);
        if (curTool === 'yaml') {
            try { r = JSON.stringify(jsyaml.load(val), null, 4); }
            catch { r = jsyaml.dump(JSON.parse(val)); }
        }
        if (curTool === 'b64e') r = btoa(unescape(encodeURIComponent(val)));
        if (curTool === 'b64d') r = decodeURIComponent(escape(atob(val)));
        if (curTool === 'sha') r = CryptoJS.SHA256(val).toString();
        if (curTool === 'jwt') r = JSON.stringify(JSON.parse(atob(val.split('.')[1])), null, 4);
        if (curTool === 'uuid') r = crypto.randomUUID();
        if (curTool === 'epoch') r = isNaN(val) ? Math.floor(new Date(val).getTime()/1000) : new Date(val*1000).toLocaleString();
        if (curTool === 'qr') {
            const q = qrcode(0, 'M'); q.addData(val); q.make();
            img.innerHTML = q.createImgTag(6);
            img.style.display = 'block'; pre.style.display = 'none';
        }
        txt.innerText = r;
        if(r) hljs.highlightElement(txt);
    } catch (e) { txt.innerText = "Error: " + e.message; }
}

function copyResult() {
    navigator.clipboard.writeText(document.getElementById('outputText').innerText);
}
render();
