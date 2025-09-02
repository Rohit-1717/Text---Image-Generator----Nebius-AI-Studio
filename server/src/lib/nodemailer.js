import nodemailer from "nodemailer";

// Create a transporter instance
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("Email Host:", process.env.EMAIL_HOST);
console.log("Email Port:", process.env.EMAIL_PORT);
console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS);
// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error configuring Nodemailer:", error);
  } else {
    console.log("Nodemailer is configured and ready to send emails.", success);
  }
});

export default transporter;
