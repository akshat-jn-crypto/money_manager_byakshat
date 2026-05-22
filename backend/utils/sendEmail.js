const nodemailer = require("nodemailer");

/**
 * Sends an email using Gmail SMTP.
 * Configure via environment variables:
 *   EMAIL_USER  - the Gmail address to send from
 *   EMAIL_PASS  - a Gmail "App Password" (requires 2FA on the account)
 *
 * To use a different provider, swap the transporter config below.
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "Email is not configured (set EMAIL_USER and EMAIL_PASS environment variables)."
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Expense Manager" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
