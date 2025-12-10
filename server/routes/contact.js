const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Env variables (configure in server/.env)
const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_TO,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM, // e.g. 'whatsapp:+14155238886' (Twilio Sandbox or WhatsApp-enabled number)
  TWILIO_SMS_FROM,      // e.g. '+1234567890' (Twilio SMS-enabled number)
  DESTINATION_PHONE     // e.g. '+963986583086'
} = process.env;

// Create mail transporter (optional)
let mailer;
if (EMAIL_HOST && EMAIL_USER && EMAIL_PASS) {
  mailer = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT || 587),
    secure: false,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS }
  });
}

// Create Twilio client (optional)
let twilioClient;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, preferredContact } = req.body;
    const text = `New Contact Message\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nPreferred Contact: ${preferredContact}\n\nMessage:\n${message}`;

    const results = {};

    // Email
    if (mailer && EMAIL_TO) {
      try {
        const info = await mailer.sendMail({
          from: EMAIL_USER,
          to: EMAIL_TO,
          subject: `Contact: ${subject || 'No subject'}`,
          text
        });
        results.email = { ok: true, messageId: info.messageId };
      } catch (err) {
        results.email = { ok: false, error: err.message };
      }
    } else {
      results.email = { ok: false, error: 'Email not configured' };
    }

    // SMS via Twilio
    if (twilioClient && TWILIO_SMS_FROM && DESTINATION_PHONE) {
      try {
        const sms = await twilioClient.messages.create({
          from: TWILIO_SMS_FROM,
          to: DESTINATION_PHONE,
          body: text
        });
        results.sms = { ok: true, sid: sms.sid };
      } catch (err) {
        results.sms = { ok: false, error: err.message };
      }
    } else {
      results.sms = { ok: false, error: 'SMS not configured' };
    }

    // WhatsApp via Twilio
    if (twilioClient && TWILIO_WHATSAPP_FROM && DESTINATION_PHONE) {
      try {
        const wa = await twilioClient.messages.create({
          from: TWILIO_WHATSAPP_FROM,
          to: `whatsapp:${DESTINATION_PHONE}`,
          body: text
        });
        results.whatsapp = { ok: true, sid: wa.sid };
      } catch (err) {
        results.whatsapp = { ok: false, error: err.message };
      }
    } else {
      results.whatsapp = { ok: false, error: 'WhatsApp not configured' };
    }

    res.status(200).json({ ok: true, results });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

module.exports = router;