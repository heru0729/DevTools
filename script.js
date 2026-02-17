const TOOLS = [
    { id: 'json-fmt', cat: 'data', name: 'JSON Format', desc: 'Prettify JSON data' },
    { id: 'sql-fmt', cat: 'data', name: 'SQL Format', desc: 'Prettify SQL queries' },
    { id: 'b64-dec', cat: 'security', name: 'Base64 Tool', desc: 'Encode/Decode Base64' },
    { id: 'sha256', cat: 'security', name: 'SHA-256', desc: 'Secure Hashing' },
    { id: 'qr-gen', cat: 'frontend', name: 'QR Code', desc: 'Generate QR Image' },
    { id: 'uuid', cat: 'utils', name: 'UUID v4', desc: 'Generate Unique ID' }
];

let state = { cat: 'data', tool: 'json-fmt' };

document.addEventListener('DOMContentLoaded', () => {
    // カテゴリ選択
    document.querySelectorAll('.rail-btn').forEach(btn => {
        btn.onclick = () => {
            state.cat = btn.dataset.cat;
            // カテゴリの最初のツールを自動選択
            state.tool = TOOLS.find(t => t.cat === state.cat).id;
            render();
        };
    });

    // テーマ切替
    document.getElementById('themeSwitcher').onclick = () => document.body.classList.toggle('light');

    render();
});

function render() {
    // レール状態更新
    document.querySelectorAll('.rail-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === state.cat));

    // サイドバー(ツールリスト)更新
    const list = document.getElementById('toolList');
    list.innerHTML = "";
    TOOLS.filter(t => t.cat === state.cat).forEach(t => {
        const btn = document.createElement('button');
        btn.className = `tool-item ${state.tool === t.id ? 'active' : ''}`;
        btn.textContent = t.name;
        btn.onclick = () => { state.tool = t.id; render(); };
        list.appendChild(btn);
    });

    // ワークスペース更新
    const active = TOOLS.find(t => t.id === state.tool);
    document.getElementById('activeToolName').textContent = active.name;
    document.getElementById('activeToolDesc').textContent = active.desc;
    
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
        const code = document.getElementById('mainOutput');
        code.textContent = v;
        if(v) hljs.highlightElement(code);
    };

    const input = () => document.getElementById('mainInput').value;

    try {
        if(state.tool === 'json-fmt') addBtn('Format', () => out(JSON.stringify(JSON.parse(input()), null, 4)));
        if(state.tool === 'sql-fmt') addBtn('Format SQL', () => out(sqlFormatter.format(input())));
        if(state.tool === 'sha256') addBtn('Generate Hash', () => out(CryptoJS.SHA256(input()).toString()));
        if(state.tool === 'b64-dec') {
            addBtn('Encode', () => out(btoa(input())));
            addBtn('Decode', () => out(atob(input())));
        }
        if(state.tool === 'qr-gen') addBtn('Make QR', () => {
            const qr = qrcode(0, 'M'); qr.addData(input()); qr.make();
            document.getElementById('imageOutput').innerHTML = qr.createImgTag(5);
            out("");
        });
        if(state.tool === 'uuid') addBtn('New UUID', () => out(crypto.randomUUID()));
    } catch(e) { out("Error: " + e.message); }
}

document.getElementById('copyBtn').onclick = () => {
    navigator.clipboard.writeText(document.getElementById('mainOutput').textContent);
};
