import Payment from "../models/Payment.modal.js";
import User from "../models/User.model.js";
import phonepe from "../services/phonePeService.js";

// Initiate Payment
export const initiatePayment = async (req, res) => {
  try {
    const { plan } = req.body;
    const user = req.user;

    const priceMap = {
      Free: 0,
      Pro: 1499,
      Premium: 2499,
    };

    const amount = priceMap[plan];
    if (amount === undefined) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    const transactionId = `txn_${Date.now()}_${user._id}`;

    // Payment request
    const paymentRequest = {
      merchantTransactionId: transactionId,
      merchantUserId: user._id.toString(),
      amount: amount * 100, // in paise
      redirectUrl: `${process.env.CLIENT_URL}/payment-status`,
      redirectMode: "POST",
      callbackUrl: `${process.env.SERVER_URL}/api/payment/callback`,
      mobileNumber: "9999999999", // optional
      paymentInstrument: { type: "PAY_PAGE" },
    };

    // Initiate payment using SDK
    const response = await phonepe.pay(paymentRequest);

    // Save in DB
    await Payment.create({
      user: user._id,
      plan,
      amount,
      transactionId,
      status: "PENDING",
    });

    // Redirect URL from SDK response
    const redirectUrl = response?.data?.instrumentResponse?.redirectInfo?.url;
    res.json({ redirectUrl });
  } catch (err) {
    console.error("PhonePe Initiate Error:", err);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};

// Callback (PhonePe → our server)
export const paymentCallback = async (req, res) => {
  try {
    const { transactionId, code } = req.body;

    const payment = await Payment.findOne({ transactionId });
    if (!payment) return res.status(404).send("Payment not found");

    if (code === "PAYMENT_SUCCESS") {
      payment.status = "SUCCESS";
      await payment.save();

      // Upgrade user plan
      await User.findByIdAndUpdate(payment.user, { plan: payment.plan });
    } else {
      payment.status = "FAILED";
      await payment.save();
    }

    res.json({ message: "Callback processed" });
  } catch (err) {
    console.error("PhonePe Callback Error:", err);
    res.status(500).json({ error: "Failed to process callback" });
  }
};
