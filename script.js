// --- 共通ユーティリティ ---
const $ = id => document.getElementById(id);
const setOut = (id, val) => { $(id + 'Output').textContent = val; $(id + 'Output').classList.remove('error'); };

// タブ切り替え
document.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
        document.querySelectorAll('.tab, .tab-content').forEach(el => el.classList.remove('active'));
        t.classList.add('active');
        $(t.dataset.tab).classList.add('active');
    });
});

// テーマ切り替え
$('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('light');
    $('themeToggle').textContent = document.body.classList.contains('light') ? "Dark" : "Light";
});

// --- JSON/HTML機能 ---
function formatJSON() {
    try { setOut('json', JSON.stringify(JSON.parse($('jsonInput').value), null, 4)); }
    catch(e) { setOut('json', "Invalid JSON"); }
}
function minifyJSON() {
    try { setOut('json', JSON.stringify(JSON.parse($('jsonInput').value))); }
    catch(e) { setOut('json', "Invalid JSON"); }
}
function escapeHTML() {
    const p = document.createElement('p'); p.textContent = $('jsonInput').value;
    setOut('json', p.innerHTML);
}
function unescapeHTML() {
    const doc = new DOMParser().parseFromString($('jsonInput').value, "text/html");
    setOut('json', doc.documentElement.textContent);
}

// --- Crypto/Hash機能 ---
function calcHash(algo) {
    const input = $('cryptoInput').value;
    setOut('crypto', CryptoJS[algo](input).toString());
}
function base64Encode() { setOut('crypto', btoa(unescape(encodeURIComponent($('cryptoInput').value)))); }
function base64Decode() { 
    try { setOut('crypto', decodeURIComponent(escape(atob($('cryptoInput').value)))); }
    catch(e) { setOut('crypto', "Invalid Base64"); }
}

// --- Convert/URL機能 ---
function urlEncode() { setOut('convert', encodeURIComponent($('convertInput').value)); }
function urlDecode() { setOut('convert', decodeURIComponent($('convertInput').value)); }
function caseUpper() { setOut('convert', $('convertInput').value.toUpperCase()); }
function caseLower() { setOut('convert', $('convertInput').value.toLowerCase()); }
function parseQuery() {
    const url = $('convertInput').value.split('?')[1] || $('convertInput').value;
    const params = new URLSearchParams(url);
    let res = "";
    for(const [k, v] of params) res += `${k}: ${v}\n`;
    setOut('convert', res || "No params found");
}

// --- Time機能 ---
function unixToDate() { setOut('time', new Date(parseInt($('timeInput').value) * 1000).toLocaleString()); }
function dateToUnix() { setOut('time', Math.floor(new Date($('timeInput').value).getTime() / 1000)); }
function curUnix() { setOut('time', Math.floor(Date.now() / 1000)); }

// --- Generator機能 ---
function genUUID() { setOut('gen', crypto.randomUUID()); }
function genLorem() { setOut('gen', "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."); }
function genPassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for(let i=0; i<16; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    setOut('gen', pass);
}

// --- API/JWT機能 ---
$('sendBtn').addEventListener('click', async () => {
    const out = $('apiOutput');
    out.textContent = "Loading...";
    try {
        const res = await fetch($('apiUrl').value);
        const data = await res.text();
        out.textContent = data;
    } catch(e) { out.textContent = "Error: " + e.message; }
});
function decodeJWT() {
    try {
        const parts = $('apiUrl').value.split('.'); // API枠を兼用
        const payload = JSON.parse(atob(parts[1]));
        setOut('api', JSON.stringify(payload, null, 4));
    } catch(e) { setOut('api', "Invalid JWT in URL field"); }
}

// --- Diff機能 ---
function compareText() {
    const a = $('diffA').value;
    const b = $('diffB').value;
    setOut('diff', a === b ? "Match ✅" : "Different ❌");
}
