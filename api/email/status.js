"use strict";
const {parseList}=require("../../lib/email-policy.cjs");
module.exports=(req,res)=>{
 res.setHeader("Cache-Control","no-store, private");
 res.setHeader("X-Content-Type-Options","nosniff");
 if(req.method!=="GET")return res.status(405).json({error:"method_not_allowed"});
 return res.status(200).json({
  mode:"fictional_demo_only",
  senderIdentitySlots:parseList(process.env.ALLOWED_OUTBOUND_EMAIL_SENDERS).length,
  recipientIdentitySlots:parseList(process.env.ALLOWED_OUTBOUND_EMAIL_RECIPIENTS).length,
  senderVerification:"not_verified_in_application",
  providerConnected:false,
  deliveryEnabled:false,
  humanApprovalRequired:true,
  note:"This endpoint never exposes configured addresses, tokens, or client records."
 });
};
