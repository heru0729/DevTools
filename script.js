// ---------- TAB ----------
document.querySelectorAll(".tab").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c=>c.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    };
});

// ---------- JSON ----------
formatBtn.onclick = () => {
    jsonOutput.classList.remove("error");
    try {
        const obj = JSON.parse(jsonInput.value);
        const result = JSON.stringify(obj,null,4);
        jsonOutput.textContent = result;
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

// ---------- DIFF ----------
diffBtn.onclick = () => {
    diffOutput.classList.remove("error");
    try {
        const a = JSON.stringify(JSON.parse(jsonA.value),null,2);
        const b = JSON.stringify(JSON.parse(jsonB.value),null,2);
        diffOutput.textContent = (a===b) ? "No differences" : "Differences found\n\nA:\n"+a+"\n\nB:\n"+b;
    } catch {
        diffOutput.textContent = "Invalid JSON";
        diffOutput.classList.add("error");
    }
};
copyDiffInline.onclick = () => navigator.clipboard.writeText(diffOutput.textContent);

// ---------- BASE64 ----------
function encodeUTF8(str){return btoa(unescape(encodeURIComponent(str))); }
function decodeUTF8(str){return decodeURIComponent(escape(atob(str))); }

encodeBtn.onclick = () => {
    base64Output.classList.remove("error");
    base64Output.textContent = encodeUTF8(base64Input.value);
};
decodeBtn.onclick = () => {
    base64Output.classList.remove("error");
    try{
        base64Output.textContent = decodeUTF8(base64Input.value);
    } catch {
        base64Output.textContent = "Error";
        base64Output.classList.add("error");
    }
};
copyBase64Btn.onclick = () => navigator.clipboard.writeText(base64Output.textContent);
copyBase64Inline.onclick = () => navigator.clipboard.writeText(base64Output.textContent);

// ---------- UUID ----------
uuidBtn.onclick = () => {
    uuidOutput.classList.remove("error");
    uuidOutput.textContent = crypto.randomUUID();
};
copyUuidBtn.onclick = () => navigator.clipboard.writeText(uuidOutput.textContent);
copyUuidInline.onclick = () => navigator.clipboard.writeText(uuidOutput.textContent);

// ---------- API ----------
sendBtn.onclick = async () => {
    apiOutput.classList.remove("error");
    const url = apiUrl.value;
    const method = apiMethod.value;
    const body = apiBody.value;

    try {
        const options = { method };
        if(method==="POST"){
            options.headers = {"Content-Type":"application/json"};
            options.body = body;
        }

        const res = await fetch(url, options);
        const text = await res.text();

        try{
            const json = JSON.parse(text);
            apiOutput.textContent = JSON.stringify(json,null,4);
        }catch{
            apiOutput.textContent = text;
        }

        localStorage.setItem("lastApiUrl", url);
    } catch {
        apiOutput.textContent = "Network Error";
        apiOutput.classList.add("error");
    }
};
copyApiInline.onclick = () => navigator.clipboard.writeText(apiOutput.textContent);

// ---------- JWT ----------
decodeJwtBtn.onclick = () => {
    jwtHeader.textContent="";
    jwtPayload.textContent="";
    jwtSignature.textContent="";
    jwtStatus.textContent="";
    try {
        const parts = jwtInput.value.split(".");
        if(parts.length!==3){ throw "Invalid"; }
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        jwtHeader.textContent = JSON.stringify(header,null,4);
        jwtPayload.textContent = JSON.stringify(payload,null,4);
        jwtSignature.textContent = parts[2];

        if(payload.exp){
            const expDate = new Date(payload.exp*1000);
            const now = new Date();
            if(now>expDate){
                jwtStatus.textContent="Expired: "+expDate.toISOString();
                jwtStatus.style.color="red";
            } else {
                jwtStatus.textContent="Valid until: "+expDate.toISOString();
                jwtStatus.style.color="green";
            }
        }
    } catch {
        jwtStatus.textContent="Invalid JWT";
        jwtStatus.style.color="red";
    }
    localStorage.setItem("jwtInput",jwtInput.value);
};

// ---------- THEME ----------
let savedTheme = localStorage.getItem("theme") || "dark";
if(savedTheme==="light"){document.body.classList.add("light");}
themeToggle.onclick = () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light":"dark");
};

// ---------- LOAD ----------
window.onload = () => {
    jsonInput.value = localStorage.getItem("jsonInput") || "";
    apiUrl.value = localStorage.getItem("lastApiUrl") || "";
};
