// Email template for Demo Request confirmation

function wrapEmailContent(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Toast Capital</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f5; -webkit-font-smoothing: antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF6B35 0%, #FF8F5C 100%); padding: 32px 40px; text-align: center;">
              <img src="https://toastcapital.com/toast-capital-logo.svg" alt="Toast Capital" width="180" style="display: block; margin: 0 auto; max-width: 100%; height: auto; filter: brightness(0) invert(1);">
            </td>
          </tr>

          <!-- Email Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.6;">
                      Questions? Call us at <a href="tel:6175333190" style="color: #FF6B35; text-decoration: none; font-weight: 600;">(617) 533-3190</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.6;">
                      Toast Capital | 333 Summer Street, Boston, MA 02210<br>
                      &copy; 2026 Toast Capital. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

export function generateDemoConfirmationEmail(data: {
  firstName: string;
  lastName: string;
  businessName: string;
  businessType: string;
}) {
  const content = `
    <!-- Welcome Message -->
    <h1 style="color: #1f2937; font-size: 28px; font-weight: 700; text-align: center; margin: 0 0 8px 0; line-height: 1.3;">
      Welcome, ${data.firstName}!
    </h1>

    <p style="text-align: center; color: #6b7280; font-size: 16px; margin: 0 0 32px 0; line-height: 1.5;">
      Thank you for your interest in Toast Capital funding for <strong>${data.businessName}</strong>.
    </p>

    <!-- Confirmation Box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 12px; margin-bottom: 32px;">
      <tr>
        <td style="padding: 24px; text-align: center;">
          <p style="color: #166534; font-size: 18px; font-weight: 600; margin: 0;">
            &#10003; Demo Request Received
          </p>
          <p style="color: #15803d; font-size: 14px; margin: 8px 0 0 0;">
            A funding specialist will contact you within 24 hours
          </p>
        </td>
      </tr>
    </table>

    <!-- Your Request Details -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 12px; margin-bottom: 32px;">
      <tr>
        <td style="padding: 24px;">
          <h2 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
            Your Request Details
          </h2>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #6b7280; font-size: 14px;">Business Name</span>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                <span style="color: #1f2937; font-size: 14px; font-weight: 600;">${data.businessName}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: #6b7280; font-size: 14px;">Business Type</span>
              </td>
              <td style="padding: 8px 0; text-align: right;">
                <span style="color: #1f2937; font-size: 14px; font-weight: 600;">${data.businessType}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- What's Next Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
      <tr>
        <td>
          <h2 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
            What Happens Next?
          </h2>

          <!-- Step 1 -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
            <tr>
              <td width="50" valign="top">
                <div style="background: linear-gradient(135deg, #FF6B35 0%, #FF8F5C 100%); width: 40px; height: 40px; border-radius: 50%; text-align: center; line-height: 40px;">
                  <span style="color: #ffffff; font-size: 18px; font-weight: bold;">1</span>
                </div>
              </td>
              <td valign="top" style="padding-left: 12px;">
                <p style="color: #1f2937; font-weight: 600; font-size: 15px; margin: 0 0 4px 0;">Complete Your Application</p>
                <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.5;">Click the button below to upload your documents and verify your identity.</p>
              </td>
            </tr>
          </table>

          <!-- Step 2 -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
            <tr>
              <td width="50" valign="top">
                <div style="background: linear-gradient(135deg, #FF6B35 0%, #FF8F5C 100%); width: 40px; height: 40px; border-radius: 50%; text-align: center; line-height: 40px;">
                  <span style="color: #ffffff; font-size: 18px; font-weight: bold;">2</span>
                </div>
              </td>
              <td valign="top" style="padding-left: 12px;">
                <p style="color: #1f2937; font-weight: 600; font-size: 15px; margin: 0 0 4px 0;">Speak with a Specialist</p>
                <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.5;">A funding expert will contact you to discuss your personalized options.</p>
              </td>
            </tr>
          </table>

          <!-- Step 3 -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="50" valign="top">
                <div style="background: linear-gradient(135deg, #FF6B35 0%, #FF8F5C 100%); width: 40px; height: 40px; border-radius: 50%; text-align: center; line-height: 40px;">
                  <span style="color: #ffffff; font-size: 18px; font-weight: bold;">3</span>
                </div>
              </td>
              <td valign="top" style="padding-left: 12px;">
                <p style="color: #1f2937; font-weight: 600; font-size: 15px; margin: 0 0 4px 0;">Get Funded!</p>
                <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.5;">Once approved, receive your funds as soon as the next business day.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
      <tr>
        <td align="center">
          <a href="https://toastcapital.com/upload" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%); color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 50px; text-decoration: none; text-align: center;">
            Continue Your Application
          </a>
        </td>
      </tr>
    </table>

    <!-- Benefits Reminder -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef9c3; border: 2px solid #facc15; border-radius: 12px;">
      <tr>
        <td style="padding: 24px;">
          <h3 style="color: #854d0e; font-size: 16px; font-weight: 600; margin: 0 0 12px 0; text-align: center;">
            Why Business Owners Choose Toast Capital
          </h3>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding: 6px 0;">
                <span style="color: #166534; margin-right: 8px;">&#10003;</span>
                <span style="color: #854d0e; font-size: 14px;">No credit score requirements</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0;">
                <span style="color: #166534; margin-right: 8px;">&#10003;</span>
                <span style="color: #854d0e; font-size: 14px;">Loans from $1,000 to $300,000</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0;">
                <span style="color: #166534; margin-right: 8px;">&#10003;</span>
                <span style="color: #854d0e; font-size: 14px;">Flexible repayment based on your sales</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0;">
                <span style="color: #166534; margin-right: 8px;">&#10003;</span>
                <span style="color: #854d0e; font-size: 14px;">Next-day funding available</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return wrapEmailContent(content);
}
