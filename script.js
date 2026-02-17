const TOOLS = [
    { id: 'json-fmt', cat: 'data', name: 'JSON Format', desc: 'JSONを綺麗に整形します' },
    { id: 'sql-fmt', cat: 'data', name: 'SQL Format', desc: 'SQLクエリを整形します' },
    { id: 'b64-tool', cat: 'security', name: 'Base64 Tool', desc: 'Base64のエンコード/デコード' },
    { id: 'sha256', cat: 'security', name: 'SHA-256', desc: 'ハッシュ値を生成します' },
    { id: 'qr-gen', cat: 'frontend', name: 'QR Code', desc: 'テキストからQRコードを作成' },
    { id: 'uuid', cat: 'utils', name: 'UUID v4', desc: '一意なUUIDを生成します' }
];

let state = { cat: 'data', tool: 'json-fmt' };

document.addEventListener('DOMContentLoaded', () => {
    // Rail Switch
    document.querySelectorAll('.rail-btn').forEach(btn => {
        btn.onclick = () => {
            state.cat = btn.dataset.cat;
            state.tool = TOOLS.find(t => t.cat === state.cat).id;
            render();
        };
    });

    // Theme Switch
    document.getElementById('themeSwitcher').onclick = () => document.body.classList.toggle('light');

    // Init
    render();
});

function render() {
    // Update Rail
    document.querySelectorAll('.rail-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === state.cat));

    // Update Sidebar
    const list = document.getElementById('toolList');
    list.innerHTML = "";
    TOOLS.filter(t => t.cat === state.cat).forEach(t => {
        const btn = document.createElement('button');
        btn.className = `tool-item ${state.tool === t.id ? 'active' : ''}`;
        btn.textContent = t.name;
        btn.onclick = () => { state.tool = t.id; render(); };
        list.appendChild(btn);
    });

    // Update Header
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
        if(state.tool === 'json-fmt') addBtn('FORMAT', () => out(JSON.stringify(JSON.parse(input()), null, 4)));
        if(state.tool === 'sql-fmt') addBtn('FORMAT SQL', () => out(sqlFormatter.format(input())));
        if(state.tool === 'sha256') addBtn('HASH', () => out(CryptoJS.SHA256(input()).toString()));
        if(state.tool === 'b64-tool') {
            addBtn('ENCODE', () => out(btoa(input())));
            addBtn('DECODE', () => out(atob(input())));
        }
        if(state.tool === 'qr-gen') addBtn('MAKE QR', () => {
            const qr = qrcode(0, 'M'); qr.addData(input()); qr.make();
            document.getElementById('imageOutput').innerHTML = qr.createImgTag(5);
            out("");
        });
        if(state.tool === 'uuid') addBtn('NEW UUID', () => out(crypto.randomUUID()));
    } catch(e) { out("Error: " + e.message); }
}

document.getElementById('copyBtn').onclick = () => {
    navigator.clipboard.writeText(document.getElementById('mainOutput').textContent);
};
