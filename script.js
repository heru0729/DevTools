// ------------------------------
// 初期化・保存機能
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // 保存されたJSONがあれば読み込む
    const savedJson = localStorage.getItem("jsonInput");
    if (savedJson) document.getElementById("jsonInput").value = savedJson;
});

// ------------------------------
// タブ切り替え
// ------------------------------
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach(btn => {
    btn.addEventListener("click", () => {
        tabs.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});

// ------------------------------
// テーマ切り替え
// ------------------------------
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    themeToggle.textContent = document.body.classList.contains("light") ? "Dark" : "Light";
});

// ------------------------------
// JSON機能 (保存機能付き)
// ------------------------------
const jsonInput = document.getElementById("jsonInput");
const jsonOutput = document.getElementById("jsonOutput");

document.getElementById("formatBtn").addEventListener("click", () => {
    jsonOutput.classList.remove("error");
    try {
        const obj = JSON.parse(jsonInput.value);
        jsonOutput.textContent = JSON.stringify(obj, null, 4);
        localStorage.setItem("jsonInput", jsonInput.value); // 保存
    } catch (e) {
        jsonOutput.textContent = "Invalid JSON: " + e.message;
        jsonOutput.classList.add("error");
    }
});

document.getElementById("minifyBtn").addEventListener("click", () => {
    try {
        const obj = JSON.parse(jsonInput.value);
        jsonOutput.textContent = JSON.stringify(obj);
    } catch {
        jsonOutput.textContent = "Invalid JSON";
        jsonOutput.classList.add("error");
    }
});

document.getElementById("copyJsonBtn").addEventListener("click", () => {
    navigator.clipboard.writeText(jsonOutput.textContent);
});

// ------------------------------
// DIFF機能
// ------------------------------
document.getElementById("diffBtn").addEventListener("click", () => {
    const diffOut = document.getElementById("diffOutput");
    try {
        const a = JSON.stringify(JSON.parse(document.getElementById("jsonA").value), null, 2);
        const b = JSON.stringify(JSON.parse(document.getElementById("jsonB").value), null, 2);
        diffOut.textContent = (a === b) ? "No differences" : "Differences found\n\n--- A ---\n" + a + "\n\n--- B ---\n" + b;
    } catch {
        diffOut.textContent = "Invalid JSON";
    }
});

// ------------------------------
// BASE64機能 (日本語対応 UTF-8)
// ------------------------------
function encodeUTF8(str) { return btoa(unescape(encodeURIComponent(str))); }
function decodeUTF8(str) { return decodeURIComponent(escape(atob(str))); }

document.getElementById("encodeBtn").addEventListener("click", () => {
    const input = document.getElementById("base64Input").value;
    document.getElementById("base64Output").textContent = encodeUTF8(input);
});

document.getElementById("decodeBtn").addEventListener("click", () => {
    try {
        const input = document.getElementById("base64Input").value;
        document.getElementById("base64Output").textContent = decodeUTF8(input);
    } catch {
        document.getElementById("base64Output").textContent = "Error: Invalid Base64";
    }
});

// ------------------------------
// UUID / API / JWT (以下略、整理版と同様のロジックを統合)
// ------------------------------
document.getElementById("uuidBtn").addEventListener("click", () => {
    document.getElementById("uuidOutput").textContent = crypto.randomUUID();
});

document.getElementById("sendBtn").addEventListener("click", async () => {
    const out = document.getElementById("apiOutput");
    const loader = document.getElementById("loading");
    loader.style.display = "block";
    try {
        const res = await fetch(document.getElementById("apiUrl").value, {
            method: document.getElementById("apiMethod").value
        });
        const text = await res.text();
        out.textContent = text;
    } catch (e) {
        out.textContent = "Network Error";
    }
    loader.style.display = "none";
});

document.getElementById("decodeJwtBtn").addEventListener("click", () => {
    try {
        const parts = document.getElementById("jwtInput").value.split('.');
        document.getElementById("jwtHeader").textContent = JSON.stringify(JSON.parse(atob(parts[0])), null, 4);
        document.getElementById("jwtPayload").textContent = JSON.stringify(JSON.parse(atob(parts[1])), null, 4);
        document.getElementById("jwtSignature").textContent = parts[2];
    } catch {
        document.getElementById("jwtStatus").textContent = "Invalid JWT";
    }
});
