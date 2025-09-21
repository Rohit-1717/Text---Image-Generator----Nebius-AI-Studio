import SupportReport from "../models/support.report.modal.js";
import transporter from "../lib/nodemailer.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const createSupportReport = asyncHandler(async (req, res, next) => {
  const { description } = req.body;

  if (!description?.trim()) {
    return next(new ApiError(400, "Description is required"));
  }

  if (!req.user) {
    return next(new ApiError(401, "You must be logged in to submit a report"));
  }

  const name = req.user.name;
  const email = req.user.email;

  // Save report
  const report = await SupportReport.create({
    userId: req.user._id,
    userName: name,
    userEmail: email,
    description: description.trim(),
  });

  // Send main report to support team
  try {
    await transporter.sendMail({
      from: `"Morphix Support" <no-reply@morphixai.com>`,
      to: "support@morphix.com",
      subject: `New Support Report from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background: #4F46E5; padding: 20px; text-align: center; color: #fff;">
            <img src="https://text-image-generator-nebius-v20.vercel.app/logo.webp" alt="Morphix Logo" width="100" style="margin-bottom: 10px;" />
            <h1>New Support Report</h1>
          </div>
          <div style="padding: 20px;">
            <p>Hi Morphix Support Team,</p>
            <p>A new support report has been submitted by <strong>${name}</strong> (${email}).</p>
            <p><strong>Description of the issue:</strong></p>
            <div style="padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; margin-top: 10px;">
              ${description}
            </div>
            <p style="margin-top: 20px;"><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin-top: 30px;">— The Morphix AI Team</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Error sending support email:", err);
  }

  // Send acknowledgment email to user
  try {
    await transporter.sendMail({
      from: `"Morphix AI Support" <support@morphix.com>`,
      to: email,
      subject: `We received your support report`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background: #4F46E5; padding: 20px; text-align: center; color: #fff;">
            <img src="https://text-image-generator-nebius-v20.vercel.app/logo.webp" alt="Morphix Logo" width="100" style="margin-bottom: 10px;" />
            <h1>Support Report Received</h1>
          </div>
          <div style="padding: 20px;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thank you for reporting an issue. Our support team has received your message and will review it shortly.</p>
            <p><strong>Your submitted description:</strong></p>
            <div style="padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; margin-top: 10px;">
              ${description}
            </div>
            <p style="margin-top: 20px;">We will get back to you as soon as possible.</p>
            <p style="margin-top: 30px;">— The Morphix AI Team</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Error sending acknowledgment email to user:", err);
  }

  res.status(201).json({
    success: true,
    message: "Support report submitted successfully",
    reportId: report._id,
  });
});
