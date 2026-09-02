// Vercel Serverless Function — runs on Vercel's servers, never in the
// visitor's browser. This is what lets us call Sparrow SMS's API (which
// only supports plain http:// and has no browser CORS support) safely
// and securely from a site that's served over https://.
//
// The secret token below is read from an Environment Variable you set in
// the Vercel dashboard (Settings -> Environment Variables) — it is never
// present in the public site code, unlike the EmailJS/JSONBin keys.

const PHONE_REGEX = /^9[78]\d{8}$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }

  const { to, text } = req.body || {};

  if (!to || !PHONE_REGEX.test(String(to).trim())) {
    res.status(400).json({ success: false, message: "Invalid phone number" });
    return;
  }
  if (!text || typeof text !== "string" || text.length > 300) {
    res.status(400).json({ success: false, message: "Invalid message text" });
    return;
  }

  const token = process.env.SPARROW_SMS_TOKEN;
  const from = process.env.SPARROW_SMS_FROM;

  if (!token || !from) {
    res.status(500).json({
      success: false,
      message: "SMS service is not configured yet. Add SPARROW_SMS_TOKEN and SPARROW_SMS_FROM in Vercel's Environment Variables, then redeploy.",
    });
    return;
  }

  try {
    const params = new URLSearchParams({
      token,
      from,
      to: String(to).trim(),
      text,
    });

    const response = await fetch(`http://api.sparrowsms.com/v2/sms/?${params.toString()}`, {
      method: "GET",
    });

    const data = await response.json().catch(() => null);

    if (data && data.response_code === 200) {
      res.status(200).json({ success: true });
    } else {
      res.status(502).json({
        success: false,
        message: data?.response || "Sparrow SMS did not confirm delivery.",
        raw: data,
      });
    }
  } catch (err) {
    res.status(502).json({ success: false, message: "Could not reach the SMS service.", error: String(err) });
  }
}
