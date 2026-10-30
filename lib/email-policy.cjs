"use strict";
const EMAIL=/^[A-Z0-9.!#$%&'*+/=?^`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;
function parseList(value){return [...new Set(String(value||"").split(",").map(v=>v.trim().toLowerCase()).filter(v=>EMAIL.test(v)))];}
function safeAddress(value){const a=String(value||"").trim().toLowerCase();return EMAIL.test(a)&&a.length<=254?a:null;}
function evaluateSend(draft,config={}){
 const issues=[];
 if(!draft||typeof draft!=="object"||Array.isArray(draft))return {ok:false,issues:["invalid_draft"]};
 const from=safeAddress(draft.from),to=safeAddress(draft.to);
 const senders=parseList(config.senders),recipients=parseList(config.recipients);
 if(!from||!senders.includes(from))issues.push("sender_not_allowed");
 if(!to||!recipients.includes(to))issues.push("recipient_not_allowed");
 if(!config.verifiedSenders||!from||!config.verifiedSenders.includes(from))issues.push("sender_not_verified");
 if(config.enabled!==true)issues.push("delivery_disabled");
 if(draft.consent!==true)issues.push("consent_required");
 if(draft.humanApproved!==true)issues.push("human_approval_required");
 if(draft.fictional!==false)issues.push("fictional_draft_never_send");
 if(!draft.subject||typeof draft.subject!=="string"||draft.subject.length>160)issues.push("invalid_subject");
 if(!draft.body||typeof draft.body!=="string"||draft.body.length>10000)issues.push("invalid_body");
 const content=String(draft.subject||"")+" "+String(draft.body||"");
 if(/\b(?:approved for medicaid|medicaid approved|guaranteed bed|confirmed eligible)\b/i.test(content))issues.push("unsupported_claim");
 if(/\b\d{3}-\d{2}-\d{4}\b/.test(content))issues.push("sensitive_data_detected");
 return {ok:issues.length===0,issues};
}
module.exports={parseList,safeAddress,evaluateSend};
