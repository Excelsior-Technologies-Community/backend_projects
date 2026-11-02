const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Setup Nodemailer Transporter
let transporter;

try {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      }
    });
    console.log(`[EmailService] Configured SMTP Transporter for host: ${host}:${port} (${user})`);
  } else {
    console.warn('[EmailService] SMTP credentials missing. Running in simulation mode.');
  }
} catch (err) {
  console.error('[EmailService] Transporter configuration error:', err.message);
}

const getSender = () => {
  return process.env.EMAIL_FROM || '"Realestate WorkDo" <support@realestate-workdo.com>';
};

const getAdminEmail = () => {
  return process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'admin@realestate-workdo.com';
};

// Base HTML Email Template Wrapper
const buildHtmlTemplate = ({ title, preheader, content }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; }
    .wrapper { width: 100%; max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #161829 0%, #1e293b 100%); padding: 32px 24px; text-align: center; }
    .logo { color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
    .logo-badge { color: #63c0ee; }
    .content-body { padding: 36px 32px; }
    .tag { display: inline-block; padding: 4px 12px; background-color: #e0f2fe; color: #0284c7; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 16px; }
    h1 { color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px; }
    p { margin: 0 0 16px; font-size: 15px; color: #475569; }
    .info-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #edf2f7; font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; color: #64748b; }
    .info-value { font-weight: 600; color: #0f172a; text-align: right; }
    .btn { display: inline-block; background-color: #63c0ee; color: #ffffff !important; padding: 13px 28px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px; text-align: center; margin: 20px 0; box-shadow: 0 4px 12px rgba(99,192,238,0.3); }
    .footer { background-color: #f8fafc; padding: 24px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    .footer a { color: #63c0ee; text-decoration: none; }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader || title}
  </div>
  <div class="wrapper">
    <div class="header">
      <div class="logo">
        <span>Realestate</span><span class="logo-badge">WorkDo</span>
      </div>
    </div>
    <div class="content-body">
      ${content}
    </div>
    <div class="footer">
      <p style="margin-bottom: 8px;">© ${new Date().getFullYear()} Realestate WorkDo Inc. All rights reserved.</p>
      <p style="margin: 0;">750 5th Avenue, Suite 1200, New York, NY 10019 • <a href="http://localhost:5173">Visit Website</a></p>
    </div>
  </div>
</body>
</html>
  `;
};

// Generic Send Wrapper with safety fallback
async function dispatchEmail({ to, subject, html, text }) {
  const from = getSender();
  console.log(`[EmailService] Preparing email -> To: ${to} | Subject: "${subject}"`);

  if (!transporter) {
    console.log('[EmailService Simulated] Transporter unavailable. Email content:');
    console.log(`Subject: ${subject}\nTo: ${to}\n${text || 'HTML Content'}`);
    return { success: true, simulated: true, messageId: 'simulated_' + Date.now() };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || subject,
      html
    });
    console.log(`[EmailService] Successfully delivered email to ${to}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[EmailService ERROR] Failed to send email to ${to}:`, err.message);
    // Return gracefully so user/client operations aren't blocked by external SMTP failures
    return { success: false, error: err.message };
  }
}

/**
 * 1. User Registration / Welcome Email
 */
async function sendUserWelcomeEmail(user) {
  const title = 'Welcome to Realestate WorkDo';
  const preheader = 'Your premier gateway to luxury properties worldwide.';
  const content = `
    <span class="tag">Welcome aboard</span>
    <h1>Welcome, ${user.firstName || 'Valued Client'}!</h1>
    <p>Thank you for creating an account with <strong>Realestate WorkDo</strong>. You now have full access to our curated collection of luxury estates, penthouse lofts, and architecturally distinguished residences.</p>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Account Email</span>
        <span class="info-value">${user.email}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Membership Status</span>
        <span class="info-value" style="color: #10b981;">Active Customer</span>
      </div>
    </div>

    <p>As a registered member, you can:</p>
    <ul style="color: #475569; padding-left: 20px; margin-bottom: 24px;">
      <li>Save your favorite villas and properties with one click</li>
      <li>Submit priority viewing inquiries directly to listing brokers</li>
      <li>Receive instant notifications on newly listed premier residences</li>
    </ul>

    <div style="text-align: center;">
      <a href="http://localhost:5173" class="btn">Explore Featured Properties</a>
    </div>
  `;

  return dispatchEmail({
    to: user.email,
    subject: 'Welcome to Realestate WorkDo - Your Account is Ready',
    html: buildHtmlTemplate({ title, preheader, content }),
    text: `Welcome to Realestate WorkDo, ${user.firstName}! Your account (${user.email}) is now active. Visit http://localhost:5173 to explore luxury properties.`
  });
}

/**
 * 2. User Inquiry Confirmation Email
 */
async function sendInquiryConfirmationToUser(inquiry, property = {}) {
  const propTitle = property.title || 'Selected Property';
  const propPrice = property.price ? `$${Number(property.price).toLocaleString()}` : 'Price on Request';
  const title = 'We Received Your Property Inquiry';
  const preheader = `Thank you for inquiring about ${propTitle}.`;

  const content = `
    <span class="tag">Inquiry Confirmation</span>
    <h1>We Received Your Inquiry</h1>
    <p>Hello <strong>${inquiry.name}</strong>,</p>
    <p>Thank you for reaching out regarding <strong>${propTitle}</strong>. One of our dedicated luxury real estate advisors has been assigned to your request and will contact you within 24 hours.</p>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Property</span>
        <span class="info-value">${propTitle}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Listed Price</span>
        <span class="info-value">${propPrice}</span>
      </div>
      ${property.address ? `
      <div class="info-row">
        <span class="info-label">Location</span>
        <span class="info-value">${property.address}</span>
      </div>` : ''}
      <div class="info-row">
        <span class="info-label">Your Phone</span>
        <span class="info-value">${inquiry.phone || 'Not provided'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Inquiry Status</span>
        <span class="info-value" style="color: #0284c7;">Received / New</span>
      </div>
    </div>

    ${inquiry.message ? `
    <p style="font-weight: 600; margin-bottom: 4px; color: #1e293b;">Your Message:</p>
    <div style="background-color: #f1f5f9; padding: 14px 16px; border-radius: 6px; font-style: italic; color: #334155; font-size: 14px; margin-bottom: 24px;">
      "${inquiry.message}"
    </div>` : ''}

    <p>If you require immediate assistance, feel free to call our concierge desk directly at <strong>+1 (800) 456-7890</strong>.</p>
  `;

  return dispatchEmail({
    to: inquiry.email,
    subject: `Inquiry Confirmation: ${propTitle} - Realestate WorkDo`,
    html: buildHtmlTemplate({ title, preheader, content }),
    text: `Hello ${inquiry.name},\nWe received your inquiry regarding "${propTitle}". A real estate advisor will be in touch with you shortly.`
  });
}

/**
 * 3. Admin Inquiry Lead Notification Email
 */
async function sendInquiryAlertToAdmin(inquiry, property = {}) {
  const adminRecipient = getAdminEmail();
  const propTitle = property.title || 'General Website Inquiry';
  const propPrice = property.price ? `$${Number(property.price).toLocaleString()}` : 'N/A';
  const title = 'New Property Lead Received';
  const preheader = `New inquiry submitted by ${inquiry.name} for ${propTitle}.`;

  const content = `
    <span class="tag" style="background-color: #fee2e2; color: #dc2626;">Hot Lead Notification</span>
    <h1>New Property Inquiry Received</h1>
    <p>A new potential buyer inquiry has just been submitted on the website. Immediate follow-up is recommended.</p>

    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Lead Name</span>
        <span class="info-value" style="color: #0284c7;">${inquiry.name}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Lead Email</span>
        <span class="info-value"><a href="mailto:${inquiry.email}" style="color: #0284c7;">${inquiry.email}</a></span>
      </div>
      <div class="info-row">
        <span class="info-label">Lead Phone</span>
        <span class="info-value">${inquiry.phone || 'N/A'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Property Target</span>
        <span class="info-value">${propTitle}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Listed Price</span>
        <span class="info-value">${propPrice}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Inquiry Timestamp</span>
        <span class="info-value">${new Date().toLocaleString()}</span>
      </div>
    </div>

    <p style="font-weight: 600; margin-bottom: 4px; color: #1e293b;">Client Inquiry Notes:</p>
    <div style="background-color: #f8fafc; border-left: 4px solid #63c0ee; padding: 14px 16px; border-radius: 4px; color: #334155; font-size: 14px; margin-bottom: 24px;">
      ${inquiry.message || 'No additional message provided.'}
    </div>

    <div style="text-align: center;">
      <a href="http://localhost:5174/admin/inquiries" class="btn">View Lead in Admin Dashboard</a>
    </div>
  `;

  return dispatchEmail({
    to: adminRecipient,
    subject: `[NEW LEAD] ${inquiry.name} inquired for "${propTitle}"`,
    html: buildHtmlTemplate({ title, preheader, content }),
    text: `New Lead: ${inquiry.name} (${inquiry.email}, ${inquiry.phone}) inquired about ${propTitle}.\nMessage: ${inquiry.message}`
  });
}

/**
 * 4. Password Reset Email
 */
async function sendPasswordResetEmail(user, resetToken) {
  const resetUrl = `http://localhost:5173/?resetToken=${resetToken}&email=${encodeURIComponent(user.email)}`;
  const title = 'Password Reset Request';
  const preheader = 'Instructions to reset your Realestate WorkDo password.';

  const content = `
    <span class="tag">Security Alert</span>
    <h1>Reset Your Password</h1>
    <p>Hello ${user.firstName || 'Client'},</p>
    <p>We received a request to reset the password associated with your Realestate WorkDo account (<strong>${user.email}</strong>). Click the button below to set a new password:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" class="btn">Reset My Password</a>
    </div>

    <p style="font-size: 13px; color: #64748b;">This link is valid for 1 hour. If you did not request a password reset, you can safely ignore this email; your account remains secure.</p>
  `;

  return dispatchEmail({
    to: user.email,
    subject: 'Password Reset Request - Realestate WorkDo',
    html: buildHtmlTemplate({ title, preheader, content }),
    text: `Reset your password by visiting: ${resetUrl}`
  });
}

/**
 * 5. Test Email (for Admin Settings Page)
 */
async function sendTestEmail(targetEmail) {
  const title = 'SMTP Email Verification';
  const preheader = 'Your Real Estate Email Service is working properly.';
  const content = `
    <span class="tag" style="background-color: #dcfce7; color: #15803d;">System Verification</span>
    <h1>Email Service is Operational!</h1>
    <p>This is a verification test email triggered from your <strong>Realestate WorkDo Admin Panel</strong>.</p>
    <div class="info-card">
      <div class="info-row">
        <span class="info-label">SMTP Host</span>
        <span class="info-value">${process.env.SMTP_HOST || 'smtp.gmail.com'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">SMTP Port</span>
        <span class="info-value">${process.env.SMTP_PORT || '587'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Sender Email</span>
        <span class="info-value">${getSender()}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Verification Time</span>
        <span class="info-value">${new Date().toLocaleString()}</span>
      </div>
    </div>
    <p>All automated notifications (Registration, User Inquiry Confirmation, and Admin Lead Alerts) are configured to run automatically.</p>
  `;

  return dispatchEmail({
    to: targetEmail,
    subject: ' Realestate WorkDo - Email Service Test Successful',
    html: buildHtmlTemplate({ title, preheader, content }),
    text: `Your Real Estate Email Service is working properly! Verified at ${new Date().toLocaleString()}`
  });
}

module.exports = {
  sendUserWelcomeEmail,
  sendInquiryConfirmationToUser,
  sendInquiryAlertToAdmin,
  sendPasswordResetEmail,
  sendTestEmail
};
