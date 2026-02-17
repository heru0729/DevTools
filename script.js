const I18N = {
    en: {
        cat: { data: "DATA", security: "AUTH", frontend: "UI/UX", utils: "TOOLS" },
        tools: {
            'json-fmt': { name: 'JSON Format', desc: 'Prettify and validate JSON.' },
            'sql-fmt': { name: 'SQL Format', desc: 'Beautify SQL queries.' },
            'yaml-json': { name: 'YAML ↔ JSON', desc: 'Convert YAML and JSON.' },
            'jwt-dec': { name: 'JWT Decode', desc: 'Decode JWT payloads.' },
            'hash-sha': { name: 'SHA-256', desc: 'Generate secure hashes.' },
            'b64-tool': { name: 'Base64', desc: 'Encode/Decode Base64.' },
            'qr-gen': { name: 'QR Code', desc: 'Create QR images.' },
            'uuid-v4': { name: 'UUID Gen', desc: 'Generate unique IDs.' },
            'unix-tm': { name: 'Unix Time', desc: 'Epoch conversion.' },
            'lorem-ip': { name: 'Lorem Ipsum', desc: 'Placeholder text.' }
        }
    },
    ja: {
        cat: { data: "データ", security: "認証", frontend: "デザイン", utils: "ツール" },
        tools: {
            'json-fmt': { name: 'JSON整形', desc: 'JSONを綺麗にします' },
            'sql-fmt': { name: 'SQL整形', desc: 'SQLを整形します' },
            'yaml-json': { name: 'YAML ↔ JSON', desc: 'YAML/JSON変換' },
            'jwt-dec': { name: 'JWT解析', desc: 'JWTのデコード' },
            'hash-sha': { name: 'SHA-256', desc: 'ハッシュ作成' },
            'b64-tool': { name: 'Base64', desc: 'Base64変換' },
            'qr-gen': { name: 'QR作成', desc: 'QRコード作成' },
            'uuid-v4': { name: 'UUID生成', desc: 'UUID v4作成' },
            'unix-tm': { name: 'Unix変換', desc: '時刻の変換' },
            'lorem-ip': { name: 'ダミー文', desc: 'テキスト生成' }
        }
    }
};

let appState = {
    lang: 'en', cat: 'data', toolId: 'json-fmt',
    favs: JSON.parse(localStorage.getItem('dev_favs') || '[]'),
    query: ''
};

const toolMap = [
    { id: 'json-fmt', cat: 'data' }, { id: 'sql-fmt', cat: 'data' }, { id: 'yaml-json', cat: 'data' },
    { id: 'jwt-dec', cat: 'security' }, { id: 'hash-sha', cat: 'security' }, { id: 'b64-tool', cat: 'security' },
    { id: 'qr-gen', cat: 'frontend' }, { id: 'uuid-v4', cat: 'utils' }, { id: 'unix-tm', cat: 'utils' }, { id: 'lorem-ip', cat: 'utils' }
];

document.addEventListener('DOMContentLoaded', () => {
    bindUI();
    render();
});

function bindUI() {
    // Category Switch
    document.querySelectorAll('.rail-btn').forEach(btn => {
        btn.onclick = () => { appState.cat = btn.dataset.cat; render(); };
    });

    // Search
    document.getElementById('toolSearch').oninput = (e) => {
        appState.query = e.target.value.toLowerCase();
        renderToolList();
    };

    // Layout & Theme
    document.getElementById('layoutToggle').onclick = () => document.getElementById('editorGrid').classList.toggle('vertical-mode');
    document.getElementById('themeSwitcher').onclick = (e) => {
        const isLight = document.body.classList.toggle('light');
        e.target.textContent = isLight ? '☀️' : '🌙';
    };

    // Mobile Tabs
    document.querySelectorAll('.mobile-tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.mobile-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.dataset.target;
            document.getElementById('inputSection').classList.toggle('hidden-mobile', target === 'output');
            document.getElementById('outputSection').classList.toggle('hidden-mobile', target === 'input');
        };
    });

    // Auto Save
    document.getElementById('mainInput').oninput = (e) => {
        localStorage.setItem(`last_${appState.toolId}`, e.target.value);
    };

    // Shortcut
    window.onkeydown = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); document.getElementById('toolSearch').focus(); }};
}

function render() {
    const lang = I18N[appState.lang];
    document.getElementById('langSwitcher').textContent = appState.lang.toUpperCase();
    document.querySelectorAll('.rail-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === appState.cat));
    
    renderToolList();
    
    const activeTool = lang.tools[appState.toolId];
    document.getElementById('activeToolName').textContent = activeTool.name;
    document.getElementById('activeToolDesc').textContent = activeTool.desc;
    document.getElementById('mainInput').value = localStorage.getItem(`last_${appState.toolId}`) || "";
    
    renderActions();
}

function renderToolList() {
    const list = document.getElementById('toolList');
    list.innerHTML = "";
    const lang = I18N[appState.lang];

    toolMap.filter(t => t.cat === appState.cat && lang.tools[t.id].name.toLowerCase().includes(appState.query)).forEach(t => {
        const isFav = appState.favs.includes(t.id);
        const div = document.createElement('div');
        div.className = `tool-item-wrapper ${t.id === appState.toolId ? 'active' : ''}`;
        div.innerHTML = `<button class="tool-btn">${lang.tools[t.id].name}</button><span class="fav-star ${isFav?'active':''}">★</span>`;
        
        div.querySelector('.tool-btn').onclick = () => { appState.toolId = t.id; render(); };
        div.querySelector('.fav-star').onclick = (e) => {
            e.stopPropagation();
            if (isFav) appState.favs = appState.favs.filter(f => f !== t.id);
            else appState.favs.push(t.id);
            localStorage.setItem('dev_favs', JSON.stringify(appState.favs));
            renderToolList();
        };
        list.appendChild(div);
    });
}

function renderActions() {
    const bar = document.getElementById('toolActions');
    bar.innerHTML = "";
    const addBtn = (lbl, fn) => { const b = document.createElement('button'); b.className="primary"; b.textContent=lbl; b.onclick=fn; bar.appendChild(b); };
    const input = () => document.getElementById('mainInput').value;
    const out = (v) => { document.getElementById('imageContainer').innerHTML = ""; document.getElementById('mainOutput').textContent = v; if(v) hljs.highlightElement(document.getElementById('mainOutput')); };

    try {
        switch(appState.toolId) {
            case 'json-fmt': addBtn('Format', () => out(JSON.stringify(JSON.parse(input()), null, 4))); break;
            case 'sql-fmt': addBtn('Format', () => out(sqlFormatter.format(input()))); break;
            case 'hash-sha': addBtn('Hash', () => out(CryptoJS.SHA256(input()).toString())); break;
            case 'qr-gen': addBtn('Generate', () => {
                const qr = qrcode(0, 'M'); qr.addData(input()); qr.make();
                document.getElementById('imageContainer').innerHTML = qr.createImgTag(5);
                out("");
            }); break;
            case 'uuid-v4': addBtn('Generate', () => out(crypto.randomUUID())); break;
        }
    } catch(e) { out("Error: Invalid Input"); }
}
