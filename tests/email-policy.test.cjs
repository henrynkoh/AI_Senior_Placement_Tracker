const {test}=require("node:test");
const assert=require("node:assert/strict");
const {parseList,evaluateSend}=require("../lib/email-policy.cjs");
const cfg={senders:"sender@example.com",recipients:"recipient@example.com",verifiedSenders:["sender@example.com"],enabled:true};
const ok={from:"sender@example.com",to:"recipient@example.com",subject:"Case follow-up",body:"Please confirm receipt.",fictional:false,consent:true,humanApproved:true};
test("allowlist normalization",()=>{assert.deepEqual(parseList(" A@EXAMPLE.COM,a@example.com, invalid, b@example.com "),["a@example.com","b@example.com"]);});
test("approved and verified real-case metadata can pass a pure policy check",()=>{assert.equal(evaluateSend(ok,cfg).ok,true);});
test("fictional test messages never pass",()=>{assert.ok(evaluateSend({...ok,fictional:true},cfg).issues.includes("fictional_draft_never_send"));});
test("missing case consent rejects",()=>{assert.ok(evaluateSend({...ok,consent:false},cfg).issues.includes("consent_required"));});
test("missing individual human approval rejects",()=>{assert.ok(evaluateSend({...ok,humanApproved:false},cfg).issues.includes("human_approval_required"));});
test("unverified sender rejects",()=>{assert.ok(evaluateSend(ok,{...cfg,verifiedSenders:[]}).issues.includes("sender_not_verified"));});
test("unlisted sender/recipient rejects",()=>{assert.ok(evaluateSend({...ok,from:"other@example.com"},cfg).issues.includes("sender_not_allowed"));assert.ok(evaluateSend({...ok,to:"other@example.com"},cfg).issues.includes("recipient_not_allowed"));});
test("disabled delivery rejects",()=>{assert.ok(evaluateSend(ok,{...cfg,enabled:false}).issues.includes("delivery_disabled"));});
test("eligibility and SSN assertions reject",()=>{assert.ok(evaluateSend({...ok,body:"Approved for Medicaid"},cfg).issues.includes("unsupported_claim"));assert.ok(evaluateSend({...ok,body:"123-45-6789"},cfg).issues.includes("sensitive_data_detected"));});

const sendHandler=require("../api/email/send.js");
const statusHandler=require("../api/email/status.js");
function response(){return {statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v;return this;},status(n){this.statusCode=n;return this;},json(value){this.body=value;return this;}};}
test("server refuses every POST even with flags enabled",()=>{const res=response();sendHandler({method:"POST",body:{humanApproved:true,consent:true}},res);assert.equal(res.statusCode,503);assert.equal(res.body.sent,false);});
test("server rejects a GET that might be used to accidentally send",()=>{const res=response();sendHandler({method:"GET"},res);assert.equal(res.statusCode,405);});
test("status never exposes the configured email identities",()=>{const previousFrom=process.env.ALLOWED_OUTBOUND_EMAIL_SENDERS,previousTo=process.env.ALLOWED_OUTBOUND_EMAIL_RECIPIENTS;try{process.env.ALLOWED_OUTBOUND_EMAIL_SENDERS="sender@example.com";process.env.ALLOWED_OUTBOUND_EMAIL_RECIPIENTS="recipient@example.com";const res=response();statusHandler({method:"GET"},res);assert.equal(res.body.deliveryEnabled,false);assert.equal(res.body.senderIdentitySlots,1);assert.equal(res.body.recipientIdentitySlots,1);assert.ok(!JSON.stringify(res.body).includes("sender@example.com"));}finally{if(previousFrom===undefined)delete process.env.ALLOWED_OUTBOUND_EMAIL_SENDERS;else process.env.ALLOWED_OUTBOUND_EMAIL_SENDERS=previousFrom;if(previousTo===undefined)delete process.env.ALLOWED_OUTBOUND_EMAIL_RECIPIENTS;else process.env.ALLOWED_OUTBOUND_EMAIL_RECIPIENTS=previousTo;}});
