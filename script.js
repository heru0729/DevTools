let currentLang = 'en';

// --- Language Toggle Logic ---
const langToggle = document.getElementById('langToggle');
if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = (currentLang === 'en') ? 'ja' : 'en';
        
        document.querySelectorAll('.lang').forEach(el => {
            const text = el.getAttribute(`data-${currentLang}`);
            if (text) el.textContent = text;
        });

        document.querySelectorAll('textarea').forEach(el => {
            el.placeholder = currentLang === 'en' ? "Paste data here..." : "ここにデータを入力...";
        });

        langToggle.textContent = currentLang === 'en' ? "🇯🇵 日本語へ" : "🇺🇸 To English";
        updateThemeButtonText();
    });
}

// --- Theme Toggle Logic ---
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light');
        updateThemeButtonText();
    });
}

function updateThemeButtonText() {
    const isLight = document.body.classList.contains('light');
    if (currentLang === 'en') {
        themeToggle.textContent = isLight ? "☀️ Light Mode" : "🌙 Dark Mode";
    } else {
        themeToggle.textContent = isLight ? "☀️ ライトモード" : "🌙 ダークモード";
    }
}

// --- Copy Function with Visual Feedback ---
function copyText(id, event) {
    const text = document.getElementById(id).textContent;
    const btn = event.target;
    const originalText = btn.textContent;

    navigator.clipboard.writeText(text).then(() => {
        btn.textContent = currentLang === 'en' ? "Copied! ✅" : "完了 ✅";
        btn.style.backgroundColor = "#22c55e";
        btn.style.color = "#fff";
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = "";
            btn.style.color = "";
        }, 1500);
    });
}

// --- Tab Switching ---
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item, .panel').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// --- Feature Functions ---
function highlight(el) { if (typeof hljs !== 'undefined') hljs.highlightElement(el); }

function runJSON(mode) {
    const input = document.getElementById('input1').value;
    const output = document.getElementById('output1');
    try {
        const obj = JSON.parse(input);
        output.textContent = (mode === 'format') ? JSON.stringify(obj, null, 4) : JSON.stringify(obj);
        highlight(output);
    } catch (e) { output.textContent = "Error: Invalid JSON"; }
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
    } catch { document.getElementById('output1').textContent = "Error"; }
}

function runCsv() {
    const input = document.getElementById('input1').value.trim().split('\n');
    if(input.length < 2) return;
    const headers = input[0].split(',');
    const json = input.slice(1).map(row => {
        const cols = row.split(',');
        return headers.reduce((acc, h, i) => ({ ...acc, [h.trim()]: cols[i]?.trim() }), {});
    });
    document.getElementById('output1').textContent = JSON.stringify(json, null, 4);
}

function runHash(algo) {
    const input = document.getElementById('input2').value;
    document.getElementById('output2').textContent = CryptoJS[algo](input).toString();
}

function runBase64(mode) {
    const input = document.getElementById('input2').value;
    try {
        document.getElementById('output2').textContent = mode === 'enc' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)));
    } catch { document.getElementById('output2').textContent = "Error"; }
}

function runJWT() {
    try {
        const parts = document.getElementById('input2').value.split('.');
        const payload = JSON.parse(atob(parts[1]));
        document.getElementById('output2').textContent = JSON.stringify(payload, null, 4);
    } catch { document.getElementById('output2').textContent = "Error"; }
}

function runTypeGen() {
    try {
        const obj = JSON.parse(document.getElementById('input3').value);
        let ts = "interface Root {\n";
        for (let key in obj) ts += `  ${key}: ${typeof obj[key]};\n`;
        document.getElementById('output3').textContent = ts + "}";
    } catch { document.getElementById('output3').textContent = "Error"; }
}

function runUrl(mode) {
    const val = document.getElementById('input3').value;
    document.getElementById('output3').textContent = mode === 'enc' ? encodeURIComponent(val) : decodeURIComponent(val);
}

function runCase(mode) {
    document.getElementById('output3').textContent = document.getElementById('input3').value.toUpperCase();
}

function runGen(type) {
    const out = document.getElementById('output4');
    if (type === 'uuid') out.textContent = crypto.randomUUID();
    else out.textContent = Math.random().toString(36).slice(-12);
}

function runClient() {
    document.getElementById('output4').textContent = `UserAgent: ${navigator.userAgent}\nScreen: ${window.screen.width}x${window.screen.height}\nLanguage: ${navigator.language}`;
}
