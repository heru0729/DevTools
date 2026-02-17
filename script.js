const I18N = {
    en: {
        run: "RUN", copy: "COPY", input: "INPUT", output: "OUTPUT", tools: "TOOLS",
        tools_data: [
            { id: 'json-fmt', name: 'JSON Prettify', desc: 'Prettify and validate JSON data' },
            { id: 'sql-fmt', name: 'SQL Format', desc: 'Format and beautify SQL queries' }
        ],
        tools_sec: [
            { id: 'b64-e', name: 'Base64 Encode', desc: 'Encode text to Base64' },
            { id: 'sha256', name: 'SHA-256 Hash', desc: 'Generate secure hash' }
        ],
        tools_util: [
            { id: 'qr-gen', name: 'QR Code Gen', desc: 'Generate QR image' },
            { id: 'uuid-gen', name: 'UUID v4', desc: 'Generate unique ID' }
        ]
    },
    ja: {
        run: "実行", copy: "コピー", input: "入力", output: "出力", tools: "ツール一覧",
        tools_data: [
            { id: 'json-fmt', name: 'JSON整形', desc: 'JSONを見やすく整形・検証します' },
            { id: 'sql-fmt', name: 'SQL整形', desc: 'SQLクエリを綺麗に整形します' }
        ],
        tools_sec: [
            { id: 'b64-e', name: 'Base64変換', desc: 'テキストをBase64にエンコードします' },
            { id: 'sha256', name: 'SHA-256', desc: 'ハッシュ値を計算します' }
        ],
        tools_util: [
            { id: 'qr-gen', name: 'QR作成', desc: 'テキストからQRコードを生成します' },
            { id: 'uuid-gen', name: 'UUID生成', desc: '一意のUUID v4を生成します' }
        ]
    }
};

let currentLang = localStorage.getItem('pro_lang') || 'en';
let state = { cat: 'data', tool: 'json-fmt' };

window.onload = () => {
    document.querySelectorAll('.rail-btn').forEach(btn => {
        btn.onclick = () => {
            state.cat = btn.dataset.cat;
            const tools = getToolsByCat(state.cat);
            state.tool = tools[0].id;
            render();
        };
    });
    
    document.getElementById('langToggle').onclick = () => {
        currentLang = currentLang === 'en' ? 'ja' : 'en';
        localStorage.setItem('pro_lang', currentLang);
        render();
    };

    document.getElementById('themeToggle').onclick = () => document.body.classList.toggle('light');
    
    render();
};

function getToolsByCat(cat) {
    const lang = I18N[currentLang];
    if (cat === 'data') return lang.tools_data;
    if (cat === 'security') return lang.tools_sec;
    return lang.tools_util;
}

function render() {
    const lang = I18N[currentLang];
    
    // UI Labels
    document.getElementById('i18n-run').innerText = lang.run;
    document.getElementById('i18n-copy').innerText = lang.copy;
    document.getElementById('i18n-input').innerText = lang.input;
    document.getElementById('i18n-output').innerText = lang.output;
    document.getElementById('i18n-tools').innerText = lang.tools;
    document.getElementById('langToggle').innerText = currentLang.toUpperCase();

    // Rail
    document.querySelectorAll('.rail-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === state.cat));

    // Sidebar
    const list = document.getElementById('toolList');
    list.innerHTML = "";
    const tools = getToolsByCat(state.cat);
    tools.forEach(t => {
        const btn = document.createElement('button');
        btn.className = `tool-item ${state.tool === t.id ? 'active' : ''}`;
        btn.innerText = t.name;
        btn.onclick = () => { state.tool = t.id; render(); };
        list.appendChild(btn);
    });

    const active = tools.find(t => t.id === state.tool) || tools[0];
    document.getElementById('toolName').innerText = active.name;
    document.getElementById('toolDesc').innerText = active.desc;
}

function execute() {
    const input = document.getElementById('input').value;
    const outText = document.getElementById('outputText');
    const outImg = document.getElementById('imageResult');
    
    outText.innerText = "";
    outImg.style.display = "none";

    try {
        let res = "";
        if (state.tool === 'json-fmt') res = JSON.stringify(JSON.parse(input), null, 4);
        if (state.tool === 'sql-fmt') res = sqlFormatter.format(input);
        if (state.tool === 'b64-e') res = btoa(unescape(encodeURIComponent(input)));
        if (state.tool === 'sha256') res = CryptoJS.SHA256(input).toString();
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
