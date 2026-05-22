/**
 * Sends an email via Brevo's HTTP API.
 *
 * We use the HTTP API (https://api.brevo.com, port 443) instead of SMTP
 * because Render's free tier blocks outbound SMTP ports.
 *
 * Environment variables:
 *   BREVO_API_KEY - your Brevo API key (Brevo -> SMTP & API -> API Keys)
 *   EMAIL_FROM    - a sender email verified in Brevo (falls back to EMAIL_USER)
 */
const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  if (!apiKey || !fromEmail) {
    throw new Error(
      "Email is not configured (set BREVO_API_KEY and EMAIL_FROM/EMAIL_USER)."
    );
  }

  // Fail fast instead of hanging if the API is unreachable.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Expense Manager", email: fromEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Brevo API error ${response.status}: ${errText}`);
    }
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = sendEmail;
