"use strict";
// Deliberately fail closed: no provider, credentials, durable consent,
// account-level sender verification, or secure delivery audit exists yet.
// This handler must not be relaxed without a reviewed authentication,
// idempotency, audit, and provider integration.
module.exports=(req,res)=>{
 res.setHeader("Cache-Control","no-store, private");
 res.setHeader("X-Content-Type-Options","nosniff");
 res.setHeader("Allow","POST");
 if(req.method!=="POST")return res.status(405).json({error:"method_not_allowed"});
 return res.status(503).json({error:"delivery_disabled",sent:false,reason:"provider_and_sender_authorization_incomplete"});
};
