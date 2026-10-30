"use strict";
(function(){
const KEY="southsound-fictional-mail-demo-v1";
function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(x)?x.slice(-25):[]}catch{return []}}
function write(x){localStorage.setItem(KEY,JSON.stringify(x.slice(-25)))}
const slots=()=>Array.from({length:7},(_,i)=>'<option value="'+(i+1)+'">Identity '+(i+1)+'</option>').join("");
function renderEmailDemo({data,shell,esc}){
let records=read();
const eligible=data.filter(c=>c.consent==="Granted for fictional test"&&c.stage!=="Closed");
shell("Email workflow — fictional demo",`
<div class="warning" style="border-radius:10px;padding:12px;margin-bottom:16px"><strong>NO EMAIL CAN BE SENT.</strong> Sender/recipient identities are only numbered placeholders, not authenticated mail accounts. Demo approvals are browser-local and are not legal consent or a durable audit.</div>
<div class="cards">
 <div class="card"><h3>7 sender slots</h3><p>Saved in Vercel; verified send-as rights: <strong>not established</strong>.</p></div>
 <div class="card"><h3>7 recipient slots</h3><p>Saved in Vercel; no contact with any address.</p></div>
 <div class="card"><h3>Delivery</h3><p><strong class="danger">Disabled</strong>. No email provider is connected.</p></div>
</div>
<form id="mail-form" class="card">
 <h3>1. Prepare a fictional draft</h3>
 <div class="fields">
 <div><label for="mail-from">Sender identity</label><select id="mail-from" required>${slots()}</select></div>
 <div><label for="mail-to">Recipient identity</label><select id="mail-to" required>${slots()}</select></div>
 <div><label for="mail-case">Fictional case with demo consent</label><select id="mail-case" required>${eligible.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.id)+'</option>').join("")}</select></div>
 <div><label for="mail-subject">Subject</label><input id="mail-subject" maxlength="160" required value="FICTIONAL TEST — do not send — follow-up question"></div>
 </div>
 <label for="mail-body">Message body (fictional only)</label>
 <textarea id="mail-body" maxlength="1200" required>FICTIONAL TEST — DO NOT SEND. Please list the questions that an operator should verify with the appropriate official agency. No eligibility or placement decision has been made.</textarea>
 <div class="actions"><button type="submit" class="primary">Prepare fictional draft</button><button type="button" disabled title="No authenticated mail provider is connected">Send email (disabled)</button></div>
 <p role="status" id="mail-message"></p>
</form>
<div class="card"><h3>2. Review → 3. Approve → 4. Delivery audit</h3>
<p class="muted">Review and approval work only for mock drafts. Delivery events will remain 'Not sent'.</p>
<div id="mail-history"></div></div>`);
function display(){
 const root=document.getElementById("mail-history");
 if(!records.length){root.innerHTML='<p class="muted">No fictional draft prepared yet.</p>';return}
 root.innerHTML=records.slice().reverse().map(x=>`<div class="card" style="margin:10px 0">
 <p><strong>${esc(x.id)}</strong> · ${esc(x.caseId)} · From #${esc(x.fromSlot)} to #${esc(x.toSlot)}</p>
 <p><strong>${esc(x.subject)}</strong></p><p>${esc(x.body)}</p>
 <p>Status: <strong>${esc(x.stage)}</strong> · <span class="danger">Not sent</span></p>
 <p class="muted">Local audit: ${esc(x.events.join(" · "))}</p>
 ${x.stage==="prepared"?'<button type="button" data-mail-review="'+esc(x.id)+'">Review fictional draft</button>':""}
 ${x.stage==="reviewed"?'<button type="button" data-mail-approve="'+esc(x.id)+'">Approve fictional draft</button>':""}
 </div>`).join("");
 root.querySelectorAll("[data-mail-review]").forEach(b=>b.addEventListener("click",()=>transition(b.dataset.mailReview,"prepared","reviewed","Reviewed in browser")));
 root.querySelectorAll("[data-mail-approve]").forEach(b=>b.addEventListener("click",()=>transition(b.dataset.mailApprove,"reviewed","approved_not_sent","Approved demo only; NOT SENT")));
}
function transition(id,prev,next,event){const rec=records.find(r=>r.id===id);if(!rec||rec.stage!==prev)return;const c=data.find(x=>x.id===rec.caseId);if(!c||c.consent!=="Granted for fictional test"||c.stage==="Closed"){document.getElementById("mail-message").textContent="Blocked: fictional case consent changed or case closed.";return;}rec.stage=next;rec.events.push(event+" "+new Date().toISOString());write(records);display();}
document.getElementById("mail-form").addEventListener("submit",ev=>{
 ev.preventDefault();
 const caseId=document.getElementById("mail-case").value;
 const c=data.find(x=>x.id===caseId);
 const subject=document.getElementById("mail-subject").value.trim(),body=document.getElementById("mail-body").value.trim();
 const output=document.getElementById("mail-message");
 if(!c||c.consent!=="Granted for fictional test"||c.stage==="Closed"){output.textContent="Blocked: consent not granted for fictional test.";return;}
 if(!subject||!body||subject.length>160||body.length>1200){output.textContent="Blocked: invalid fictional draft.";return}
 if(!/FICTIONAL TEST/i.test(subject+" "+body)){output.textContent="Blocked: fictional test warning required.";return}
 if(/\b(?:approved for medicaid|medicaid approved|guaranteed bed|confirmed eligible|social security number|ssn|diagnosed with|date of birth|dob)\b|\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b/i.test(subject+" "+body)){output.textContent="Blocked: protected information or unsupported eligibility/bed claim.";return}
 const id="DEMO-"+Date.now()+"-"+Math.floor(Math.random()*9999);
 const record={id,caseId,fromSlot:document.getElementById("mail-from").value,toSlot:document.getElementById("mail-to").value,subject,body,stage:"prepared",events:["Prepared in browser "+new Date().toISOString()]};
 records.push(record);write(records);output.textContent="Fictional draft prepared. No email sent.";display();
});
display();
fetch("/api/email/status",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("No API");return r.json()}).then(v=>{const output=document.getElementById("mail-message");if(output)output.textContent="Server delivery: "+(v.deliveryEnabled?"UNEXPECTEDLY ENABLED — report issue":"disabled")+"; verified sender rights not established."}).catch(()=>{});
}
window.renderEmailDemo=renderEmailDemo;
})();