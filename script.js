// --- 共通処理 ---
function highlight(el) { if (typeof hljs !== 'undefined') hljs.highlightElement(el); }
function copyText(id) {
    const txt = document.getElementById(id).textContent;
    navigator.clipboard.writeText(txt).then(() => alert("コピーしました！"));
}

// タブ切り替え
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item, .panel').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// テーマ切り替え
document.getElementById('themeToggle').addEventListener('click', function() {
    const isLight = document.body.classList.toggle('light');
    this.textContent = isLight ? "☀️ ライトモード" : "🌙 ダークモード";
});

// --- 📦 データ整形機能 ---
function runJSON(mode) {
    const input = document.getElementById('input1').value;
    const output = document.getElementById('output1');
    try {
        const obj = JSON.parse(input);
        output.textContent = (mode === 'format') ? JSON.stringify(obj, null, 4) : JSON.stringify(obj);
        highlight(output);
    } catch (e) { output.textContent = "Invalid JSON"; }
}

function runSQL() {
    const input = document.getElementById('input1').value;
    document.getElementById('output1').textContent = sqlFormatter.format(input);
}

function runYaml() {
    const input = document.getElementById('input1').value;
    try {
        const obj = JSON.parse(input);
        document.getElementById('output1').textContent = jsyaml.dump(obj);
    } catch { document.getElementById('output1').textContent = "Invalid JSON"; }
}

function runCsv() {
    const input = document.getElementById('input1').value.trim().split('\n');
    const headers = input[0].split(',');
    const json = input.slice(1).map(row => {
        const cols = row.split(',');
        return headers.reduce((acc, h, i) => ({ ...acc, [h.trim()]: cols[i]?.trim() }), {});
    });
    document.getElementById('output1').textContent = JSON.stringify(json, null, 4);
}

// --- 🔐 セキュリティ機能 ---
function runHash(algo) {
    const input = document.getElementById('input2').value;
    document.getElementById('output2').textContent = CryptoJS[algo](input).toString();
}

function runBase64(mode) {
    const input = document.getElementById('input2').value;
    try {
        document.getElementById('output2').textContent = mode === 'enc' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)));
    } catch { document.getElementById('output2').textContent = "Base64 Error"; }
}

function runJWT() {
    try {
        const parts = document.getElementById('input2').value.split('.');
        const payload = JSON.parse(atob(parts[1]));
        document.getElementById('output2').textContent = JSON.stringify(payload, null, 4);
    } catch { document.getElementById('output2').textContent = "Invalid JWT"; }
}

// --- 🔄 変換機能 ---
function runTypeGen() {
    try {
        const obj = JSON.parse(document.getElementById('input3').value);
        let ts = "interface Root {\n";
        for (let key in obj) ts += `  ${key}: ${typeof obj[key]};\n`;
        document.getElementById('output3').textContent = ts + "}";
    } catch { document.getElementById('output3').textContent = "Invalid JSON"; }
}

function runUrl(mode) {
    const val = document.getElementById('input3').value;
    document.getElementById('output3').textContent = mode === 'enc' ? encodeURIComponent(val) : decodeURIComponent(val);
}

function runCase(mode) {
    document.getElementById('output3').textContent = document.getElementById('input3').value.toUpperCase();
}

// --- 🎲 その他 ---
function runGen(type) {
    const out = document.getElementById('output4');
    if (type === 'uuid') out.textContent = crypto.randomUUID();
    else out.textContent = Math.random().toString(36).slice(-12);
}

function runClient() {
    document.getElementById('output4').textContent = `UA: ${navigator.userAgent}\nScreen: ${window.screen.width}x${window.screen.height}\nLang: ${navigator.language}`;
}
