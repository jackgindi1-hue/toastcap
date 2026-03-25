// Email template for DLVC completion (Final Step)
// Professional design with logo, progress tracker
// Workflow: /quote → /upload (application) → /dlvc (documents) → Done → (separately: approval + contract)

interface EmailData {
  firstName: string;
  lastName: string;
  fundingAmount: string;
  businessName?: string;
}

export function generateDLVCConfirmationEmail(data: EmailData): string {
  const firstName = data.firstName || 'there';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - Application Complete</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Logo Header -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
              <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="200" style="display: block; margin: 0 auto; max-width: 200px; height: auto;">
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 8px; color: #1f2937; font-size: 26px; text-align: center; font-weight: 700;">
                Application Complete!
              </h1>
              <p style="margin: 0 0 32px; color: #6b7280; font-size: 16px; text-align: center; line-height: 1.5;">
                Congratulations ${firstName}! We have everything we need.
              </p>

              <!-- Progress Tracker - All Complete -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="text-align: center; padding: 0 8px;">
                          <div style="width: 40px; height: 40px; background-color: #FF6B35; border-radius: 50%; margin: 0 auto 8px; line-height: 40px; color: #ffffff; font-weight: bold; font-size: 16px;">✓</div>
                          <p style="margin: 0; font-size: 11px; color: #FF6B35; font-weight: 600;">COMPLETE</p>
                          <p style="margin: 4px 0 0; font-size: 12px; color: #374151;">Quote</p>
                        </td>
                        <td style="padding: 0 4px; vertical-align: top; padding-top: 18px;">
                          <div style="width: 40px; height: 3px; background-color: #FF6B35;"></div>
                        </td>
                        <td style="text-align: center; padding: 0 8px;">
                          <div style="width: 40px; height: 40px; background-color: #FF6B35; border-radius: 50%; margin: 0 auto 8px; line-height: 40px; color: #ffffff; font-weight: bold; font-size: 16px;">✓</div>
                          <p style="margin: 0; font-size: 11px; color: #FF6B35; font-weight: 600;">COMPLETE</p>
                          <p style="margin: 4px 0 0; font-size: 12px; color: #374151;">Application</p>
                        </td>
                        <td style="padding: 0 4px; vertical-align: top; padding-top: 18px;">
                          <div style="width: 40px; height: 3px; background-color: #FF6B35;"></div>
                        </td>
                        <td style="text-align: center; padding: 0 8px;">
                          <div style="width: 40px; height: 40px; background-color: #FF6B35; border-radius: 50%; margin: 0 auto 8px; line-height: 40px; color: #ffffff; font-weight: bold; font-size: 16px;">✓</div>
                          <p style="margin: 0; font-size: 11px; color: #FF6B35; font-weight: 600;">COMPLETE</p>
                          <p style="margin: 4px 0 0; font-size: 12px; color: #374151;">Documents</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Confirmation Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 4px; color: #166534; font-size: 14px; font-weight: 600;">✓ What we received:</p>
                    <p style="margin: 0; color: #15803D; font-size: 14px;">Bank statements, Driver's License, and Void Check - your application is complete</p>
                  </td>
                </tr>
              </table>

              <!-- What's Next Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px; color: #1E40AF; font-size: 15px; font-weight: 600;">What happens next:</p>
                    <p style="margin: 0 0 8px; color: #1E3A8A; font-size: 14px;"><strong>1.</strong> Our team reviews your application (usually within 24 hours)</p>
                    <p style="margin: 0 0 8px; color: #1E3A8A; font-size: 14px;"><strong>2.</strong> A funding specialist will call you to discuss your options</p>
                    <p style="margin: 0; color: #1E3A8A; font-size: 14px;"><strong>3.</strong> Once approved, we'll email you the funding contract to sign</p>
                  </td>
                </tr>
              </table>

              <!-- Contact -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0 0 12px; color: #374151; font-size: 15px; font-weight: 600;">Have questions? We're here to help!</p>
                    <a href="tel:6175333190" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 15px; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
                      Call (617) 533-3190
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>


          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">Toast Capital | 333 Summer Street, Boston, MA 02210</p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2026 Toast Capital. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
