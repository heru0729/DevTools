const TOOLS = [
    { id: 'json-fmt', cat: 'data', name: 'JSON Format', desc: 'Prettify JSON' },
    { id: 'sql-fmt', cat: 'data', name: 'SQL Format', desc: 'Prettify SQL' },
    { id: 'b64-dec', cat: 'security', name: 'Base64 Decode', desc: 'Decode Base64' },
    { id: 'sha256', cat: 'security', name: 'SHA-256', desc: 'Generate Hash' },
    { id: 'qr-gen', cat: 'frontend', name: 'QR Code', desc: 'Generate Image' },
    { id: 'uuid', cat: 'utils', name: 'UUID v4', desc: 'Unique ID' }
];

let state = { cat: 'data', tool: 'json-fmt', query: '' };

document.addEventListener('DOMContentLoaded', () => {
    // カテゴリ切り替え
    document.querySelectorAll('.rail-btn').forEach(btn => {
        btn.onclick = () => { state.cat = btn.dataset.cat; renderToolList(); };
    });

    // 検索機能
    document.getElementById('toolSearch').oninput = (e) => {
        state.query = e.target.value.toLowerCase();
        renderToolList();
    };

    // 自動保存
    document.getElementById('mainInput').oninput = (e) => {
        localStorage.setItem(`save_${state.tool}`, e.target.value);
    };

    // テーマ切替
    document.getElementById('themeSwitcher').onclick = () => document.body.classList.toggle('light');

    renderToolList();
    loadTool();
});

function renderToolList() {
    const list = document.getElementById('toolList');
    list.innerHTML = "";
    document.querySelectorAll('.rail-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === state.cat));

    TOOLS.filter(t => t.cat === state.cat && t.name.toLowerCase().includes(state.query)).forEach(t => {
        const btn = document.createElement('button');
        btn.className = `tool-item ${state.tool === t.id ? 'active' : ''}`;
        btn.textContent = t.name;
        btn.onclick = () => { state.tool = t.id; loadTool(); };
        list.appendChild(btn);
    });
}

function loadTool() {
    const t = TOOLS.find(x => x.id === state.tool);
    document.getElementById('activeToolName').textContent = t.name;
    document.getElementById('activeToolDesc').textContent = t.desc;
    document.getElementById('mainInput').value = localStorage.getItem(`save_${state.tool}`) || "";
    renderToolList();
    renderActions();
}

function renderActions() {
    const box = document.getElementById('toolActions');
    box.innerHTML = "";
    const addBtn = (lbl, fn) => {
        const b = document.createElement('button'); b.className = "primary-btn"; b.textContent = lbl; b.onclick = fn;
        box.appendChild(b);
    };

    const out = (v) => { 
        document.getElementById('imageOutput').innerHTML = "";
        document.getElementById('mainOutput').textContent = v; 
        if(v) hljs.highlightElement(document.getElementById('mainOutput'));
    };

    const input = () => document.getElementById('mainInput').value;

    try {
        if(state.tool === 'json-fmt') addBtn('Run', () => out(JSON.stringify(JSON.parse(input()), null, 4)));
        if(state.tool === 'sql-fmt') addBtn('Run', () => out(sqlFormatter.format(input())));
        if(state.tool === 'sha256') addBtn('Hash', () => out(CryptoJS.SHA256(input()).toString()));
        if(state.tool === 'qr-gen') addBtn('Generate', () => {
            const qr = qrcode(0, 'M'); qr.addData(input()); qr.make();
            document.getElementById('imageOutput').innerHTML = qr.createImgTag(5);
            out("");
        });
        if(state.tool === 'uuid') addBtn('New UUID', () => out(crypto.randomUUID()));
    } catch(e) { out("Error: " + e.message); }
}

document.getElementById('copyBtn').onclick = () => {
    navigator.clipboard.writeText(document.getElementById('mainOutput').textContent);
    alert("Copied!");
};
