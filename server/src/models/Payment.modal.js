import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["Free", "Pro", "Premium"], required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true, unique: true }, 
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    subscriptionStart: { type: Date, default: Date.now },
    subscriptionEnd: { type: Date },
    gatewayResponse: { type: Object }, 
  },
  { timestamps: true }
);

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
