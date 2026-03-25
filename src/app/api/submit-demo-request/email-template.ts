// Email template for Quote/Demo Request confirmation
// Professional design with logo, progress tracker
// Workflow: /quote → /upload (application) → /dlvc (documents) → Done → (separately: approval + contract)

export function generateDemoConfirmationEmail(data: {
  firstName: string;
  lastName: string;
  businessName: string;
  businessType: string;
}) {
  const firstName = data.firstName || 'there';
  const businessName = data.businessName || 'your business';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - Application Started</title>
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
                Thanks, ${firstName}!
              </h1>
              <p style="margin: 0 0 32px; color: #6b7280; font-size: 16px; text-align: center; line-height: 1.5;">
                Your funding request for <strong style="color: #1f2937;">${businessName}</strong> has been received.
              </p>

              <!-- Progress Tracker -->
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
                          <div style="width: 40px; height: 3px; background-color: #e5e7eb;"></div>
                        </td>
                        <td style="text-align: center; padding: 0 8px;">
                          <div style="width: 40px; height: 40px; background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 50%; margin: 0 auto 8px; line-height: 36px; color: #D97706; font-weight: bold; font-size: 16px;">2</div>
                          <p style="margin: 0; font-size: 11px; color: #D97706; font-weight: 600;">NEXT</p>
                          <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280;">Application</p>
                        </td>
                        <td style="padding: 0 4px; vertical-align: top; padding-top: 18px;">
                          <div style="width: 40px; height: 3px; background-color: #e5e7eb;"></div>
                        </td>
                        <td style="text-align: center; padding: 0 8px;">
                          <div style="width: 40px; height: 40px; background-color: #e5e7eb; border-radius: 50%; margin: 0 auto 8px; line-height: 40px; color: #9ca3af; font-weight: bold; font-size: 16px;">3</div>
                          <p style="margin: 0; font-size: 11px; color: #9ca3af; font-weight: 600;">PENDING</p>
                          <p style="margin: 4px 0 0; font-size: 12px; color: #6b7280;">Documents</p>
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
                    <p style="margin: 0; color: #15803D; font-size: 14px;">Your contact info and business details for ${businessName}</p>
                  </td>
                </tr>
              </table>

              <!-- Next Step Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFF7ED; border: 1px solid #FDBA74; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 4px; color: #9A3412; font-size: 14px; font-weight: 600;">→ What to do next:</p>
                    <p style="margin: 0; color: #C2410C; font-size: 14px;">Complete your verification to continue</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/upload" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      Complete Verification →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                Questions? Call us at <a href="tel:6175333190" style="color: #FF6B35; text-decoration: none; font-weight: 600;">(617) 533-3190</a>
              </p>
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
