import PhonePe from "phonepe-pg-sdk-node";

const phonepe = new PhonePe({
  merchantId: process.env.PHONEPE_MERCHANT_ID,
  saltKey: process.env.PHONEPE_SALT_KEY,
  saltIndex: process.env.PHONEPE_SALT_INDEX || 1,
  env: process.env.NODE_ENV === "production" ? "PROD" : "UAT", // UAT = sandbox
});

export default phonepe;
