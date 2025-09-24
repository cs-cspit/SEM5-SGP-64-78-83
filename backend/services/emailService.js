const nodemailer = require("nodemailer");

// Email transporter configuration
const createTransporter = () => {
  // You can configure this for different email providers
  // Gmail configuration (requires app-specific password)
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "jayalarameelectricals@gmail.com",
      pass: process.env.EMAIL_PASSWORD || "your-app-specific-password",
    },
  });

  // Alternative configuration for other SMTP providers
  // return nodemailer.createTransport({
  //   host: process.env.SMTP_HOST || 'smtp.gmail.com',
  //   port: process.env.SMTP_PORT || 587,
  //   secure: false,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASSWORD
  //   }
  // });
};

// Send reply email to client
const sendReplyEmail = async (replyData) => {
  try {
    const transporter = createTransporter();

    // Email template
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 1px;
          }
          .header .subtitle {
            font-size: 16px;
            font-style: italic;
            margin-top: 5px;
            opacity: 0.9;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e2e8f0;
            border-radius: 0 0 8px 8px;
          }
          .greeting {
            font-size: 16px;
            margin-bottom: 20px;
            color: #2d3748;
          }
          .message {
            background: #f7fafc;
            padding: 20px;
            border-left: 4px solid #2d3748;
            margin: 20px 0;
            white-space: pre-wrap;
            border-radius: 4px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 14px;
            color: #718096;
          }
          .contact-info {
            background: #edf2f7;
            padding: 15px;
            border-radius: 6px;
            margin-top: 15px;
          }
          .priority-${replyData.priority} {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .priority-low { background: #c6f6d5; color: #22543d; }
          .priority-normal { background: #bee3f8; color: #2c5282; }
          .priority-high { background: #fbb6ce; color: #702459; }
          .priority-urgent { background: #fed7d7; color: #c53030; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>JAY JALARAM</h1>
          <div class="subtitle">Electricals</div>
        </div>
        
        <div class="content">
          <div class="greeting">
            Dear ${replyData.clientName},
          </div>
          
          <div class="priority-${replyData.priority}">
            ${replyData.priority.toUpperCase()} PRIORITY
          </div>
          
          <div class="message">${replyData.message}</div>
          
          <div class="footer">
            <strong>Best regards,</strong><br>
            ${replyData.adminName}<br>
            Jay Jalaram Electricals Team
            
            <div class="contact-info">
              <strong>Contact Information:</strong><br>
              📧 Email: jayalarameelectricals@gmail.com<br>
              📞 Phone: 7016388853<br>
              📍 Address: Juna Jeen Hanuman Tekri, Opp. Ramji Mandir, Rander, Surat - 5
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: {
        name: "Jay Jalaram Electricals",
        address: process.env.EMAIL_USER || "jayalarameelectricals@gmail.com",
      },
      to: replyData.clientEmail,
      subject: replyData.subject,
      html: emailTemplate,
      text: `Dear ${replyData.clientName},\n\n${replyData.message}\n\nBest regards,\n${replyData.adminName}\nJay Jalaram Electricals Team`,
      priority:
        replyData.priority === "urgent"
          ? "high"
          : replyData.priority === "high"
          ? "high"
          : "normal",
    };

    const result = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: result.messageId,
      response: result.response,
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (resetData) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/reset-password/${resetData.token}`;

    // Password reset email template
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .reset-button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .reset-button:hover {
            background: #5a6fd8;
          }
          .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
          <p>Jay Jalaram Electricals</p>
        </div>
        
        <div class="content">
          <h2>Hello ${resetData.name},</h2>
          
          <p>We received a request to reset your password for your Jay Jalaram Electricals account.</p>
          
          <p>Click the button below to reset your password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="reset-button">Reset Password</a>
          </div>
          
          <div class="warning">
            <strong>Important:</strong>
            <ul>
              <li>This link will expire in <strong>10 minutes</strong> for security reasons</li>
              <li>If you didn't request this password reset, please ignore this email</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">
            ${resetUrl}
          </p>
          
          <div class="footer">
            <p>This is an automated message from Jay Jalaram Electricals Business Management System.</p>
            <p>If you have any questions, please contact our support team.</p>
            
            <hr style="margin: 20px 0;">
            
            <p><strong>Jay Jalaram Electricals</strong><br>
            📧 Email: jayalarameelectricals@gmail.com<br>
            🌐 Website: <a href="http://localhost:5173">Jay Jalaram Electricals</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: {
        name: "Jay Jalaram Electricals",
        address: process.env.EMAIL_USER || "jayalarameelectricals@gmail.com",
      },
      to: resetData.email,
      subject: "🔐 Password Reset Request - Jay Jalaram Electricals",
      html: emailTemplate,
      text: `Hello ${resetData.name},\n\nWe received a request to reset your password.\n\nClick this link to reset your password: ${resetUrl}\n\nThis link will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nJay Jalaram Electricals Team`,
      priority: "high",
    };

    const result = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: result.messageId,
      response: result.response,
    };
  } catch (error) {
    console.error("Password reset email sending error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    const result = await transporter.verify();
    return { success: true, message: "Email configuration is valid" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendReplyEmail,
  sendPasswordResetEmail,
  testEmailConfig,
};
