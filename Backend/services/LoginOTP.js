const { transporter, getSmtpConfig } = require("./Nodemailer");
const otpModel = require("../models/OTPModel");

function generateLoginOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const sendOTPtoEmail = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  if (!getSmtpConfig() || !transporter) {
    throw new Error(
      "Email service is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.",
    );
  }

  const OTP = generateLoginOTP();

  await otpModel.create({
    otpCode: OTP,
    email,
  });

  await transporter.sendMail({
    from: `"OTP for iNotebook" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "OTP From iNotebook For Login",
    html: `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your verification code</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f7fb; font-family: Arial, Helvetica, sans-serif; color: #1f2937;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f7fb; padding: 32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);">
                <tr>
                  <td style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center;">
                    <div style="display: inline-block; padding: 10px 14px; background-color: rgba(255, 255, 255, 0.18); border-radius: 10px; color: #ffffff; font-size: 22px; font-weight: bold; letter-spacing: 1px;">iNotebook</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 38px 32px 28px;">
                    <h1 style="margin: 0 0 14px; font-size: 25px; line-height: 1.3; color: #111827; text-align: center;">Verify your email</h1>
                    <p style="margin: 0; font-size: 16px; line-height: 1.65; color: #4b5563; text-align: center;">Use the following one-time password to complete your sign-in.</p>

                    <div style="margin: 30px 0; padding: 22px; background-color: #eef2ff; border: 1px dashed #a5b4fc; border-radius: 12px; text-align: center;">
                      <span style="font-size: 34px; font-weight: bold; letter-spacing: 9px; color: #4338ca;">${OTP}</span>
                    </div>

                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280; text-align: center;">This code expires in <strong style="color: #374151;">15 minutes</strong>. Do not share it with anyone.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 22px 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">If you did not request this code, you can safely ignore this email.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`,
  });

  console.log(`OTP sent successfully to ${email}`);
};

module.exports = sendOTPtoEmail;
