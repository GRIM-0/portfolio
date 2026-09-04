const MAX_NAME_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed. Use POST." });
    return;
  }

  const { name, email, message } = req.body || {};
  const validationError = validate({ name, email, message });
  if (validationError) {
    res.status(400).json({ ok: false, error: validationError });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || "karanrkumbla@gmail.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    res.status(500).json({
      ok: false,
      error: "Contact API is not configured. Set RESEND_API_KEY and CONTACT_FROM_EMAIL."
    });
    return;
  }

  try {
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: "Portfolio contact from " + name,
        text: "Name: " + name + "\nEmail: " + email + "\n\n" + message
      })
    });

    if (!emailResponse.ok) {
      res.status(502).json({ ok: false, error: "Email provider rejected the request." });
      return;
    }
    res.status(200).json({ ok: true, message: "Message sent successfully." });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Unexpected server error." });
  }
};

function validate(fields) {
  var name = fields.name, email = fields.email, message = fields.message;
  if (!name || typeof name !== "string" || !name.trim()) return "Name is required.";
  if (name.length > MAX_NAME_LENGTH) return "Name is too long.";
  if (!email || typeof email !== "string" || !EMAIL_PATTERN.test(email)) return "A valid email is required.";
  if (!message || typeof message !== "string" || !message.trim()) return "Message is required.";
  if (message.length > MAX_MESSAGE_LENGTH) return "Message is too long.";
  return null;
}
