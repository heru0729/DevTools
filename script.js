const TOOLS = [
    { id: 'json-fmt', cat: 'data', name: 'JSON Prettify', desc: 'JSONを見やすくフォーマットします' },
    { id: 'json-min', cat: 'data', name: 'JSON Minify', desc: 'JSONを1行に圧縮します' },
    { id: 'yaml-json', cat: 'data', name: 'YAML ↔ JSON', desc: 'YAMLとJSONを相互変換します' },
    { id: 'sql-fmt', cat: 'data', name: 'SQL Format', desc: 'SQLをプロ仕様に整形します' },
    { id: 'b64-e', cat: 'security', name: 'Base64 Encode', desc: 'テキストをBase64に変換' },
    { id: 'b64-d', cat: 'security', name: 'Base64 Decode', desc: 'Base64をデコード' },
    { id: 'sha256', cat: 'security', name: 'SHA-256', desc: 'ハッシュ値を計算' },
    { id: 'jwt-dec', cat: 'security', name: 'JWT Decode', desc: 'JWTの中身を解析' },
    { id: 'qr-gen', cat: 'frontend', name: 'QR Code', desc: '文字列からQRコードを生成' },
    { id: 'html-esc', cat: 'frontend', name: 'HTML Escape', desc: 'HTML特殊文字をエスケープ' },
    { id: 'uuid-gen', cat: 'utils', name: 'UUID v4', desc: '一意のUUIDを生成します' },
    { id: 'epoch', cat: 'utils', name: 'Unix Epoch', desc: 'Unix時間と日時を変換' }
];

let state = { cat: 'data', tool: 'json-fmt' };

window.onload = () => {
    document.querySelectorAll('.rail-btn').forEach(btn => {
        btn.onclick = () => {
            state.cat = btn.dataset.cat;
            state.tool = TOOLS.find(t => t.cat === state.cat).id;
            render();
        };
    });
    document.getElementById('themeToggle').onclick = () => document.body.classList.toggle('light');
    render();
};

function render() {
    document.querySelectorAll('.rail-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === state.cat));
    const list = document.getElementById('toolList');
    list.innerHTML = "";
    TOOLS.filter(t => t.cat === state.cat).forEach(t => {
        const btn = document.createElement('button');
        btn.className = `tool-item ${state.tool === t.id ? 'active' : ''}`;
        btn.innerText = t.name;
        btn.onclick = () => { state.tool = t.id; render(); };
        list.appendChild(btn);
    });
    const active = TOOLS.find(t => t.id === state.tool);
    document.getElementById('toolName').innerText = active.name;
    document.getElementById('toolDesc').innerText = active.desc;
    document.getElementById('input').value = localStorage.getItem('last_' + state.tool) || "";
}

function execute() {
    const input = document.getElementById('input').value;
    const outText = document.getElementById('outputText');
    const outImg = document.getElementById('imageResult');
    
    outText.innerText = "";
    outImg.style.display = "none";
    localStorage.setItem('last_' + state.tool, input);

    try {
        let res = "";
        if (state.tool === 'json-fmt') res = JSON.stringify(JSON.parse(input), null, 4);
        if (state.tool === 'json-min') res = JSON.stringify(JSON.parse(input));
        if (state.tool === 'yaml-json') res = JSON.stringify(jsyaml.load(input), null, 4);
        if (state.tool === 'sql-fmt') res = sqlFormatter.format(input);
        if (state.tool === 'b64-e') res = btoa(unescape(encodeURIComponent(input)));
        if (state.tool === 'b64-d') res = decodeURIComponent(escape(atob(input)));
        if (state.tool === 'sha256') res = CryptoJS.SHA256(input).toString();
        if (state.tool === 'jwt-dec') res = JSON.stringify(JSON.parse(atob(input.split('.')[1])), null, 4);
        if (state.tool === 'uuid-gen') res = crypto.randomUUID();
        if (state.tool === 'qr-gen') {
            const qr = qrcode(0, 'M'); qr.addData(input); qr.make();
            outImg.innerHTML = qr.createImgTag(8);
            outImg.style.display = "block";
        }

        outText.innerText = res;
        if(res) hljs.highlightElement(outText);
    } catch (e) { outText.innerText = "Error: " + e.message; }
}

function copyResult() {
    navigator.clipboard.writeText(document.getElementById('outputText').innerText);
}
window.onkeydown = (e) => { if (e.ctrlKey && e.key === 'Enter') execute(); };
