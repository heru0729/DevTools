document.querySelectorAll(".tab").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    };
});

// JSON処理
formatBtn.onclick = () => {
    jsonOutput.classList.remove("error");
    try {
        const obj = JSON.parse(jsonInput.value);
        jsonOutput.textContent = JSON.stringify(obj, null, 4);
        localStorage.setItem("jsonInput", jsonInput.value);
    } catch {
        jsonOutput.textContent = "Invalid JSON";
        jsonOutput.classList.add("error");
    }
};

minifyBtn.onclick = () => {
    jsonOutput.classList.remove("error");
    try {
        const obj = JSON.parse(jsonInput.value);
        jsonOutput.textContent = JSON.stringify(obj);
    } catch {
        jsonOutput.textContent = "Invalid JSON";
        jsonOutput.classList.add("error");
    }
};

copyJsonBtn.onclick = () => navigator.clipboard.writeText(jsonOutput.textContent);
copyJsonInline.onclick = () => navigator.clipboard.writeText(jsonOutput.textContent);

// DIFF処理
diffBtn.onclick = () => {
    diffOutput.classList.remove("error");
    try {
        const a = JSON.stringify(JSON.parse(jsonA.value), null, 2);
        const b = JSON.stringify(JSON.parse(jsonB.value), null, 2);
        diffOutput.textContent = (a===b) ? "No differences" : "Differences found\n\nA:\n"+a+"\n\nB:\n"+b;
    } catch {
        diffOutput.textContent="Invalid JSON";
        diffOutput.classList.add("error");
    }
};
copyDiffInline.onclick = () => navigator.clipboard.writeText(diffOutput.textContent);

// BASE64
function encodeUTF8(str){ return btoa(unescape(encodeURIComponent(str))); }
function decodeUTF8(str){ return decodeURIComponent(escape(atob(str))); }

encodeBtn.onclick = () => { base64Output.classList.remove("error"); base64Output.textContent = encodeUTF8(base64Input.value); }
decodeBtn.onclick = () => {
    base64Output.classList.remove("error");
    try { base64Output.textContent = decodeUTF8(base64Input.value); }
    catch { base64Output.textContent = "Error"; base64Output.classList.add("error"); }
};
copyBase64Btn.onclick = () => navigator.clipboard.writeText(base64Output.textContent);
copyBase64Inline.onclick = () => navigator.clipboard.writeText(base64Output.textContent);

// UUID
uuidBtn.onclick = () => { uuidOutput.classList.remove("error"); uuidOutput.textContent = crypto.randomUUID(); }
copyUuidBtn.onclick = () => navigator.clipboard.writeText(uuidOutput.textContent);
copyUuidInline.onclick = () => navigator.clipboard.writeText(uuidOutput.textContent);

// API
sendBtn.onclick = async () => {
    apiOutput.classList.remove("error");
    loading.style.display = "block";
    try {
        const options = { method: apiMethod.value };
        if(apiMethod.value==="POST"){ options.headers={"Content-Type":"application/json"}; options.body=apiBody.value; }
        const res = await fetch(apiUrl.value, options);
        const text = await res.text();
        try { apiOutput.textContent = JSON.stringify(JSON.parse(text), null,4); }
        catch { apiOutput.textContent = text; }
        localStorage.setItem("lastApiUrl", apiUrl.value);
    } catch { apiOutput.textContent="Network Error"; apiOutput.classList.add("error"); }
    loading.style.display = "none";
};
copyApiInline.onclick = () => navigator.clipboard.writeText(apiOutput.textContent);

// THEME
let savedTheme = localStorage.getItem("theme") || "dark";
if(savedTheme==="light"){ document.body.classList.add("light"); }
themeToggle.onclick = () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light")?"light":"dark");
};

// LOAD
window.onload = () => {
    jsonInput.value = localStorage.getItem("jsonInput") || "";
    jsonA.value = localStorage.getItem("jsonA") || "";
    jsonB.value = localStorage.getItem("jsonB") || "";
    base64Input.value = localStorage.getItem("base64Input") || "";
    apiUrl.value = localStorage.getItem("lastApiUrl") || "";
};
