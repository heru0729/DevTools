// --- 初期設定 & タブ管理 ---
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn, .tab-panel').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// テーマ切替
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('light');
    this.textContent = document.body.classList.contains('light') ? "Theme: Light" : "Theme: Dark";
});

// 汎用コピー関数
function copyResult(id) {
    const text = document.getElementById(id).textContent;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
}

// --- JSON / XML / YAML / CSV ロジック ---
function processJSON(mode) {
    const input = document.getElementById('mainInput').value;
    const output = document.getElementById('mainOutput');
    try {
        const parsed = JSON.parse(input);
        output.textContent = mode === 'format' ? JSON.stringify(parsed, null, 4) : JSON.stringify(parsed);
        hljs.highlightElement(output);
    } catch (e) { output.textContent = "Error: Invalid JSON"; }
}

function jsonToYaml() {
    const input = document.getElementById('mainInput').value;
    const output = document.getElementById('mainOutput');
    try {
        const obj = JSON.parse(input);
        output.textContent = jsyaml.dump(obj);
    } catch (e) {
        try {
            const obj = jsyaml.load(input);
            output.textContent = JSON.stringify(obj, null, 4);
        } catch(e2) { output.textContent = "Conversion Error"; }
    }
}

function csvToJson() {
    const input = document.getElementById('mainInput').value;
    const lines = input.split('\n');
    const headers = lines[0].split(',');
    const result = lines.slice(1).map(line => {
        const data = line.split(',');
        return headers.reduce((obj, header, i) => {
            obj[header.trim()] = data[i]?.trim();
            return obj;
        }, {});
    });
    document.getElementById('mainOutput').textContent = JSON.stringify(result, null, 4);
}

// --- SQL & Text ---
function formatSQL() {
    const sql = document.getElementById('textInput').value;
    document.getElementById('textOutput').textContent = sqlFormatter.format(sql);
}

function textStats() {
    const val = document.getElementById('textInput').value;
    document.getElementById('textOutput').textContent = 
        `Characters: ${val.length}\nWords: ${val.trim().split(/\s+/).length}\nLines: ${val.split('\n').length}`;
}

// --- Crypto ---
function hashIt(algo) {
    const txt = document.getElementById('cryptoInput').value;
    document.getElementById('cryptoOutput').textContent = CryptoJS[algo](txt).toString();
}

function handleBase64(mode) {
    const txt = document.getElementById('cryptoInput').value;
    try {
        if(mode === 'enc') {
            document.getElementById('cryptoOutput').textContent = btoa(unescape(encodeURIComponent(txt)));
        } else {
            document.getElementById('cryptoOutput').textContent = decodeURIComponent(escape(atob(txt)));
        }
    } catch(e) { document.getElementById('cryptoOutput').textContent = "Base64 Error"; }
}

function imageToBase64() {
    const file = document.getElementById('imageFile').files[0];
    const reader = new FileReader();
    reader.onloadend = () => { document.getElementById('cryptoOutput').textContent = reader.result; };
    if(file) reader.readAsDataURL(file);
}

// --- Type Generation ---
function genTypeScript() {
    try {
        const obj = JSON.parse(document.getElementById('typeInput').value);
        let res = "interface RootObject {\n";
        for(let key in obj) {
            res += `  ${key}: ${typeof obj[key]};\n`;
        }
        res += "}";
        document.getElementById('typeOutput').textContent = res;
    } catch(e) { document.getElementById('typeOutput').textContent = "Invalid JSON"; }
}

// --- Security / JWT ---
function debugJWT() {
    const token = document.getElementById('jwtInput').value;
    try {
        const parts = token.split('.');
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        document.getElementById('jwtHeader').textContent = JSON.stringify(header, null, 2);
        document.getElementById('jwtPayload').textContent = JSON.stringify(payload, null, 2);
        
        // Expiration check
        if(payload.exp) {
            const date = new Date(payload.exp * 1000);
            document.getElementById('jwtPayload').textContent += `\n\n// Expires at: ${date.toLocaleString()}`;
        }
    } catch(e) { alert("Invalid JWT Token"); }
}

// --- Cron ---
function parseCron() {
    const cron = document.getElementById('cronInput').value.split(' ');
    if(cron.length < 5) { document.getElementById('cronOutput').textContent = "Invalid Cron (need 5 parts)"; return; }
    document.getElementById('cronOutput').textContent = `Minute: ${cron[0]}\nHour: ${cron[1]}\nDay: ${cron[2]}\nMonth: ${cron[3]}\nWeekday: ${cron[4]}`;
}

// --- Client Info ---
function getClientInfo() {
    const data = {
        "User Agent": navigator.userAgent,
        "Language": navigator.language,
        "Screen": `${window.screen.width}x${window.screen.height}`,
        "Online Status": navigator.onLine ? "Online" : "Offline",
        "Platform": navigator.platform,
        "Cookies Enabled": navigator.cookieEnabled
    };
    let html = "";
    for(let k in data) html += `<tr><th>${k}</th><td>${data[k]}</td></tr>`;
    document.getElementById('clientTable').innerHTML = html;
}

// --- Generator ---
function generate(type) {
    const out = document.getElementById('genOutput');
    if(type === 'uuid') out.textContent = crypto.randomUUID();
    if(type === 'lorem') out.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.";
    if(type === 'pass') {
        const set = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*";
        let p = "";
        for(let i=0; i<20; i++) p += set.charAt(Math.floor(Math.random() * set.length));
        out.textContent = p;
    }
}

// --- Diff ---
function runDiff() {
    const l = document.getElementById('diff1').value.split('\n');
    const r = document.getElementById('diff2').value.split('\n');
    let res = "";
    const max = Math.max(l.length, r.length);
    for(let i=0; i<max; i++) {
        if(l[i] !== r[i]) res += `Line ${i+1}: ❌\n  A: ${l[i] || ""}\n  B: ${r[i] || ""}\n`;
    }
    document.getElementById('diffOutput').textContent = res || "Everything matches!";
}
