// ------------------------------
// DOM要素取得
// ------------------------------
const formatBtn = document.getElementById("formatBtn");
const minifyBtn = document.getElementById("minifyBtn");
const copyJsonBtn = document.getElementById("copyJsonBtn");
const copyJsonInline = document.getElementById("copyJsonInline");
const jsonInput = document.getElementById("jsonInput");
const jsonOutput = document.getElementById("jsonOutput");

const diffBtn = document.getElementById("diffBtn");
const jsonA = document.getElementById("jsonA");
const jsonB = document.getElementById("jsonB");
const diffOutput = document.getElementById("diffOutput");
const copyDiffInline = document.getElementById("copyDiffInline");

const encodeBtn = document.getElementById("encodeBtn");
const decodeBtn = document.getElementById("decodeBtn");
const copyBase64Btn = document.getElementById("copyBase64Btn");
const copyBase64Inline = document.getElementById("copyBase64Inline");
const base64Input = document.getElementById("base64Input");
const base64Output = document.getElementById("base64Output");

const uuidBtn = document.getElementById("uuidBtn");
const copyUuidBtn = document.getElementById("copyUuidBtn");
const copyUuidInline = document.getElementById("copyUuidInline");
const uuidOutput = document.getElementById("uuidOutput");

const apiUrl = document.getElementById("apiUrl");
const apiMethod = document.getElementById("apiMethod");
const apiBody = document.getElementById("apiBody");
const sendBtn = document.getElementById("sendBtn");
const apiOutput = document.getElementById("apiOutput");
const loading = document.getElementById("loading");

const jwtInput = document.getElementById("jwtInput");
const decodeJwtBtn = document.getElementById("decodeJwtBtn");
const jwtHeader = document.getElementById("jwtHeader");
const jwtPayload = document.getElementById("jwtPayload");
const jwtSignature = document.getElementById("jwtSignature");
const jwtStatus = document.getElementById("jwtStatus");

const themeToggle = document.getElementById("themeToggle");

const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

// ------------------------------
// タブ切替
// ------------------------------
tabs.forEach(btn=>{
    btn.addEventListener("click", ()=>{
        tabs.forEach(b=>b.classList.remove("active"));
        tabContents.forEach(c=>c.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});

// ------------------------------
// JSON機能
// ------------------------------
formatBtn.addEventListener("click", ()=>{
    jsonOutput.classList.remove("error");
    try{
        const obj = JSON.parse(jsonInput.value);
        jsonOutput.textContent = JSON.stringify(obj, null, 4);
        localStorage.setItem("jsonInput", jsonInput.value);
    }catch{
        jsonOutput.textContent="Invalid JSON";
        jsonOutput.classList.add("error");
    }
});
minifyBtn.addEventListener("click", ()=>{
    jsonOutput.classList.remove("error");
    try{
        const obj = JSON.parse(jsonInput.value);
        jsonOutput.textContent = JSON.stringify(obj);
    }catch{
        jsonOutput.textContent="Invalid JSON";
        jsonOutput.classList.add("error");
    }
});
copyJsonBtn.addEventListener("click", ()=>navigator.clipboard.writeText(jsonOutput.textContent));
copyJsonInline.addEventListener("click", ()=>navigator.clipboard.writeText(jsonOutput.textContent));

// ------------------------------
// DIFF機能
// ------------------------------
diffBtn.addEventListener("click", ()=>{
    diffOutput.classList.remove("error");
    try{
        const a = JSON.stringify(JSON.parse(jsonA.value), null, 2);
        const b = JSON.stringify(JSON.parse(jsonB.value), null, 2);
        diffOutput.textContent = (a===b) ? "No differences" : "Differences found\n\nA:\n"+a+"\n\nB:\n"+b;
    }catch{
        diffOutput.textContent="Invalid JSON";
        diffOutput.classList.add("error");
    }
});
copyDiffInline.addEventListener("click", ()=>navigator.clipboard.writeText(diffOutput.textContent));

// ------------------------------
// BASE64機能
// ------------------------------
function encodeUTF8(str){return btoa(unescape(encodeURIComponent(str)));}
function decodeUTF8(str){return decodeURIComponent(escape(atob(str)));}

encodeBtn.addEventListener("click", ()=>{
    base64Output.classList.remove("error");
    base64Output.textContent = encodeUTF8(base64Input.value);
});
decodeBtn.addEventListener("click", ()=>{
    base64Output.classList.remove("error");
    try{
        base64Output.textContent = decodeUTF8(base64Input.value);
    }catch{
        base64Output.textContent="Error";
        base64Output.classList.add("error");
    }
});
copyBase64Btn.addEventListener("click", ()=>navigator.clipboard.writeText(base64Output.textContent));
copyBase64Inline.addEventListener("click", ()=>navigator.clipboard.writeText(base64Output.textContent));

// ------------------------------
// UUID
// ------------------------------
uuidBtn.addEventListener("click", ()=>{
    uuidOutput.textContent = crypto.randomUUID();
});
copyUuidBtn.addEventListener("click", ()=>navigator.clipboard.writeText(uuidOutput.textContent));
copyUuidInline.addEventListener("click", ()=>navigator.clipboard.writeText(uuidOutput.textContent));

// ------------------------------
// API
// ------------------------------
sendBtn.addEventListener("click", async ()=>{
    apiOutput.classList.remove("error");
    loading.style.display="block";
    try{
        const options={method:apiMethod.value};
        if(apiMethod.value==="POST"){
            options.headers={"Content-Type":"application/json"};
            options.body=apiBody.value;
        }
        const res=await fetch(apiUrl.value, options);
        const text = await res.text();
        try{
            const json = JSON.parse(text);
            apiOutput.textContent = JSON.stringify(json, null, 4);
        }catch{
            apiOutput.textContent = text;
        }
    }catch{
        apiOutput.textContent="Network Error";
        apiOutput.classList.add("error");
    }
    loading.style.display="none";
});
