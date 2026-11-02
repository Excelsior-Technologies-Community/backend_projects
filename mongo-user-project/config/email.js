const nodemailer = require("nodemailer");

// Create Nodemailer Transporter
const createTransporter = () => {
  // If SMTP credentials provided, use them
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Otherwise, return null (fallback will log OTP)
  return null;
};

/**
 * Send OTP Verification Email
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} userName - User's name
 * @returns {Promise<{ sent: boolean, method: string }>}
 */
const sendOtpEmail = async (toEmail, otp, userName = "User") => {
  const transporter = createTransporter();

  // If no SMTP configured, log visibly to console for testing
  if (!transporter) {
    console.log(`\n========================================`);
    console.log(`📧 [EMAIL SIMULATION] OTP for ${userName} (${toEmail})`);
    console.log(`🔑 Verification OTP: >>> ${otp} <<<`);
    console.log(`⏳ Valid for: 10 minutes`);
    console.log(`💡 (To send real emails, set SMTP_USER & SMTP_PASS in .env)`);
    console.log(`========================================\n`);
    return { sent: true, method: "console_fallback" };
  }

  // HTML Email Body
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700;">Account Verification</h2>
        <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Mongo User & Product Management System</p>
      </div>
      <div style="padding: 30px 24px; color: #334155;">
        <p style="font-size: 16px; margin-top: 0;">Hello <strong>${userName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
          Thank you for registering! Please use the following 6-digit One-Time Password (OTP) to verify your email address.
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; background: #f1f5f9; padding: 14px 28px; border-radius: 8px; border: 1px dashed #cbd5e1;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 13px; color: #94a3b8; text-align: center;">
          ⏱️ This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
        </p>
      </div>
      <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
        If you did not request this email, please ignore it.
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Mongo User System" <noreply@mongouser.com>',
      to: toEmail,
      subject: `Your Verification OTP Code: ${otp}`,
      html: htmlContent,
      text: `Hello ${userName},\n\nYour OTP verification code is: ${otp}\nThis code will expire in 10 minutes.\n\nThank you!`
    });

    console.log(`✅ Real email delivered to ${toEmail} (Message ID: ${info.messageId})`);
    return { sent: true, method: "smtp", messageId: info.messageId };
  } catch (error) {
    console.error(`❌ SMTP Delivery failed: ${error.message}`);
    console.log(`🔑 Fallback OTP for ${toEmail}: >>> ${otp} <<<`);
    return { sent: false, error: error.message, method: "fallback_console" };
  }
};

module.exports = {
  sendOtpEmail
};
