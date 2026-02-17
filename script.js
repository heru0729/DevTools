// --- タブ切り替え ---
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");
    });
});

// --- テーマ切り替え ---
document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light");
});

// --- JSON ---
const jsonIn = document.getElementById("jsonInput");
const jsonOut = document.getElementById("jsonOutput");

document.getElementById("formatBtn").addEventListener("click", () => {
    try {
        jsonOut.textContent = JSON.stringify(JSON.parse(jsonIn.value), null, 4);
        jsonOut.classList.remove("error");
    } catch (e) {
        jsonOut.textContent = "Invalid JSON";
        jsonOut.classList.add("error");
    }
});

document.getElementById("minifyBtn").addEventListener("click", () => {
    try {
        jsonOut.textContent = JSON.stringify(JSON.parse(jsonIn.value));
        jsonOut.classList.remove("error");
    } catch {
        jsonOut.textContent = "Invalid JSON";
        jsonOut.classList.add("error");
    }
});

document.getElementById("copyJsonBtn").addEventListener("click", () => {
    navigator.clipboard.writeText(jsonOut.textContent);
});

// --- Diff ---
document.getElementById("diffBtn").addEventListener("click", () => {
    try {
        const a = JSON.stringify(JSON.parse(document.getElementById("jsonA").value), null, 2);
        const b = JSON.stringify(JSON.parse(document.getElementById("jsonB").value), null, 2);
        document.getElementById("diffOutput").textContent = (a === b) ? "No differences" : "Differences found";
    } catch {
        document.getElementById("diffOutput").textContent = "Error in JSON A or B";
    }
});

// --- Base64 ---
document.getElementById("encodeBtn").addEventListener("click", () => {
    const val = document.getElementById("base64Input").value;
    document.getElementById("base64Output").textContent = btoa(encodeURIComponent(val));
});

document.getElementById("decodeBtn").addEventListener("click", () => {
    try {
        const val = document.getElementById("base64Input").value;
        document.getElementById("base64Output").textContent = decodeURIComponent(atob(val));
    } catch {
        document.getElementById("base64Output").textContent = "Invalid Base64";
    }
});

// --- UUID ---
document.getElementById("uuidBtn").addEventListener("click", () => {
    document.getElementById("uuidOutput").textContent = crypto.randomUUID();
});

// --- API ---
document.getElementById("sendBtn").addEventListener("click", async () => {
    const url = document.getElementById("apiUrl").value;
    const method = document.getElementById("apiMethod").value;
    const out = document.getElementById("apiOutput");
    const loader = document.getElementById("loading");

    loader.style.display = "block";
    try {
        const res = await fetch(url, { method });
        const data = await res.json();
        out.textContent = JSON.stringify(data, null, 4);
    } catch (e) {
        out.textContent = "Fetch Error: " + e.message;
    }
    loader.style.display = "none";
});

// --- JWT ---
document.getElementById("decodeJwtBtn").addEventListener("click", () => {
    try {
        const token = document.getElementById("jwtInput").value;
        const parts = token.split('.');
        document.getElementById("jwtHeader").textContent = atob(parts[0]);
        document.getElementById("jwtPayload").textContent = atob(parts[1]);
        document.getElementById("jwtSignature").textContent = parts[2];
    } catch {
        document.getElementById("jwtStatus").textContent = "Invalid JWT";
    }
});
