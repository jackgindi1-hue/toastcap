// Email templates for Toast Capital
// All templates follow consistent styling, spam-prevention best practices, and professional flow

// Helper function to format funding amount - returns the MAXIMUM amount from the range
function formatFundingAmountForEmail(amount: string): string {
  if (!amount) return "$100,000";

  const amountMap: Record<string, string> = {
    "0-25000": "$25,000",
    "25000-50000": "$50,000",
    "50000-100000": "$100,000",
    "100000-250000": "$250,000",
    "250000-500000": "$500,000",
    "500000-1000000": "$1,000,000",
    "1000000+": "$1,000,000+"
  };

  return amountMap[amount] || "$100,000";
}

// Shared email wrapper for consistent styling
function wrapEmailContent(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Toast Capital</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f5; -webkit-font-smoothing: antialiased;">

  <!-- Preview Text (hidden) -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    Toast Capital - Your trusted partner for business funding solutions.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

          <!-- Header with Logo -->
          <tr>
            <td style="background-color: #ffffff; padding: 32px 40px 24px 40px; border-bottom: 2px solid #f4f4f5;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <img src="https://toastcapital.com/toast-capital-logo.svg" alt="Toast Capital - Business Funding Solutions" width="220" style="display: block; max-width: 100%; height: auto;">
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>

          <!-- Trust Badges Section -->
          <tr>
            <td style="padding: 0 40px 32px 40px; border-top: 2px solid #f4f4f5;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-top: 32px;">
                    <p style="color: #374151; font-size: 16px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
                      Trusted by Thousands of Business Owners
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="33%" align="center" style="padding: 8px;">
                          <img src="https://toastcapital.com/bbb-accredited.png" alt="BBB Accredited Business" width="100" style="display: block; max-width: 100%; height: auto; margin: 0 auto;">
                        </td>
                        <td width="33%" align="center" style="padding: 8px;">
                          <img src="https://toastcapital.com/trustpilot-new.png" alt="Trustpilot Rated" width="100" style="display: block; max-width: 100%; height: auto; margin: 0 auto;">
                        </td>
                        <td width="33%" align="center" style="padding: 8px;">
                          <img src="https://toastcapital.com/google-rating.png" alt="Google Reviews" width="100" style="display: block; max-width: 100%; height: auto; margin: 0 auto;">
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin-top: 24px;">
          <tr>
            <td style="padding: 0 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.6;">
                      Questions? Call us at <a href="tel:6175333190" style="color: #FF8C42; text-decoration: none; font-weight: 600;">(617) 533-3190</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.6;">
                      Toast Capital<br>
                      333 Summer Street<br>
                      Boston, MA 02210
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                      &copy; 2025 Toast Capital. All rights reserved.
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

// Step indicator component
function createStepIndicator(stepNumber: string, isActive: boolean = true): string {
  const bgColor = isActive ? 'background: linear-gradient(135deg, #FF8C42 0%, #FF7028 100%);' : 'background-color: #e5e7eb;';
  const textColor = isActive ? '#ffffff' : '#9ca3af';
  return `<div style="${bgColor} width: 48px; height: 48px; border-radius: 50%; display: inline-block; text-align: center; line-height: 48px;">
    <span style="color: ${textColor}; font-size: 22px; font-weight: bold;">${stepNumber}</span>
  </div>`;
}

// CTA Button component
function createCTAButton(text: string, url: string, isPrimary: boolean = true): string {
  const bgColor = isPrimary ? 'background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);' : 'background: linear-gradient(135deg, #FF8C42 0%, #FF7028 100%);';
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <a href="${url}" target="_blank" style="display: inline-block; ${bgColor} color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 36px; border-radius: 50px; text-decoration: none; text-align: center;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;
}

// ==============================================================================
// EMAIL 1: Initial Pre-Qualification Confirmation
// Sent after user completes the pre-qualification form on the homepage
// ==============================================================================
export function generateConfirmationEmail(data: {
  firstName: string;
  lastName: string;
  fundingAmount: string;
  businessName?: string;
}) {
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  const formattedAmount = formatFundingAmountForEmail(data.fundingAmount);
  const businessName = data.businessName || 'your business';

  const content = `
    <!-- Greeting -->
    <h1 style="color: #1f2937; font-size: 28px; font-weight: 700; text-align: center; margin: 0 0 8px 0; line-height: 1.3;">
      Thank You${fullName ? `, ${data.firstName}` : ''}!
    </h1>

    <p style="text-align: center; color: #6b7280; font-size: 16px; margin: 0 0 32px 0; line-height: 1.5;">
      Your pre-qualification request for ${businessName} has been received.
    </p>

    <!-- Pre-Approval Amount Box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
      <tr>
        <td align="center" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 12px; padding: 28px;">
          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">
            Pre-Approved Amount Up To
          </p>
          <p style="font-size: 42px; font-weight: 700; color: #ffffff; margin: 0; line-height: 1;">
            ${formattedAmount}
          </p>
          <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 8px 0 0 0;">
            Pending verification of bank statements and identity
          </p>
        </td>
      </tr>
    </table>

    <!-- Next Steps Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 12px; margin-bottom: 32px;">
      <tr>
        <td style="padding: 28px;">
          <h2 style="text-align: center; color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 24px 0;">
            Next Steps to Complete Your Application
          </h2>

          <!-- Step 1 -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
            <tr>
              <td width="60" valign="top">
                ${createStepIndicator('1')}
              </td>
              <td valign="top" style="padding-left: 16px;">
                <p style="color: #1f2937; font-weight: 600; font-size: 16px; margin: 0 0 4px 0;">Upload Bank Statements</p>
                <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">Provide your last 3 months of business bank statements for review.</p>
              </td>
            </tr>
          </table>

          <!-- Step 2 -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
            <tr>
              <td width="60" valign="top">
                ${createStepIndicator('2')}
              </td>
              <td valign="top" style="padding-left: 16px;">
                <p style="color: #1f2937; font-weight: 600; font-size: 16px; margin: 0 0 4px 0;">Verify Your Identity</p>
                <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">Upload your driver's license and a void check to confirm your identity.</p>
              </td>
            </tr>
          </table>

          <!-- Step 3 -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="60" valign="top">
                ${createStepIndicator('3')}
              </td>
              <td valign="top" style="padding-left: 16px;">
                <p style="color: #1f2937; font-weight: 600; font-size: 16px; margin: 0 0 4px 0;">Get Funded</p>
                <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;">Once approved, receive your funds quickly. Some lenders offer same-day funding.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef9c3; border: 2px solid #facc15; border-radius: 12px; margin-bottom: 32px;">
      <tr>
        <td style="padding: 28px; text-align: center;">
          <p style="color: #854d0e; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
            Ready to Continue?
          </p>
          <p style="color: #a16207; font-size: 14px; margin: 0 0 20px 0; line-height: 1.5;">
            Complete your application now to expedite your funding.
          </p>
          ${createCTAButton('Upload Documents Now', 'https://toastcapital.com/upload')}
        </td>
      </tr>
    </table>

    <!-- Contact Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; border-radius: 12px;">
      <tr>
        <td style="padding: 24px; text-align: center;">
          <p style="color: #374151; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
            Need Assistance?
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">
            A funding specialist will reach out within 24 hours, or you can call us directly.
          </p>
          <a href="tel:6175333190" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 50px; text-decoration: none;">
            Call (617) 533-3190
          </a>
        </td>
      </tr>
    </table>
  `;

  return wrapEmailContent(content);
}

// ==============================================================================
// EMAIL 2: Bank Statements Upload Confirmation
// Sent after user uploads their bank statements
// Next step: Complete identity verification at /dlvc
// ==============================================================================
export function generateUploadConfirmationEmail(data: {
  firstName: string;
  lastName: string;
  fundingAmount: string;
  businessName?: string;
}) {
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  const formattedAmount = formatFundingAmountForEmail(data.fundingAmount);
  const businessName = data.businessName || 'your business';
  const firstName = data.firstName || 'Valued Customer';

  const content = `
    <!-- Greeting -->
    <h1 style="color: #1f2937; font-size: 28px; font-weight: 700; text-align: center; margin: 0 0 8px 0; line-height: 1.3;">
      Bank Statements Received!
    </h1>

    <p style="text-align: center; color: #6b7280; font-size: 16px; margin: 0 0 32px 0; line-height: 1.5;">
      Thank you, ${firstName}. We've received your documents for ${businessName}.
    </p>

    <!-- Status Box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 12px; margin-bottom: 32px;">
      <tr>
        <td style="padding: 24px; text-align: center;">
          <p style="color: #166534; font-size: 18px; font-weight: 600; margin: 0; line-height: 1.6;">
            &#10003; Pre-Application Received<br>
            &#10003; Bank Statements Received
          </p>
        </td>
      </tr>
    </table>

    <!-- Pre-Approval Amount -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
      <tr>
        <td align="center" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 12px; padding: 24px;">
          <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0 0 6px 0;">
            Your Pre-Approved Amount
          </p>
          <p style="font-size: 36px; font-weight: 700; color: #ffffff; margin: 0; line-height: 1;">
            ${formattedAmount}
          </p>
        </td>
      </tr>
    </table>

    <!-- Final Step Alert -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef9c3; border: 2px solid #facc15; border-radius: 12px; margin-bottom: 32px;">
      <tr>
        <td style="padding: 28px; text-align: center;">
          <p style="color: #854d0e; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
            Final Step Required
          </p>
          <p style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 12px 0;">
            Complete Identity Verification
          </p>
          <p style="color: #a16207; font-size: 14px; margin: 0 0 24px 0; line-height: 1.5;">
            Upload your driver's license and void check to finalize your application.<br>
            This takes less than 2 minutes.
          </p>
          ${createCTAButton('Complete Verification', 'https://toastcapital.com/dlvc', false)}
        </td>
      </tr>
    </table>

    <!-- What Happens Next -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 12px; margin-bottom: 32px;">
      <tr>
        <td style="padding: 28px;">
          <h2 style="text-align: center; color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 24px 0;">
            What Happens After Verification?
          </h2>

          <!-- Step 1 -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
            <tr>
              <td width="60" valign="top">
                ${createStepIndicator('1')}
              </td>
              <td valign="top" style="padding-left: 16px;">
                <p style="color: #1f2937; font-weight: 600; font-size: 15px; margin: 0 0 4px 0;">Identity Confirmed</p>
                <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.5;">We verify your identity using your driver's license.</p>
              </td>
            </tr>
          </table>

          <!-- Step 2 -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
            <tr>
              <td width="60" valign="top">
                ${createStepIndicator('2')}
              </td>
              <td valign="top" style="padding-left: 16px;">
                <p style="color: #1f2937; font-weight: 600; font-size: 15px; margin: 0 0 4px 0;">Final Review</p>
                <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.5;">Our team completes the final underwriting review.</p>
              </td>
            </tr>
          </table>

          <!-- Step 3 -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="60" valign="top">
                ${createStepIndicator('3')}
              </td>
              <td valign="top" style="padding-left: 16px;">
                <p style="color: #1f2937; font-weight: 600; font-size: 15px; margin: 0 0 4px 0;">Receive Funding</p>
                <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.5;">Sign your contract and receive your funds.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Contact Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; border-radius: 12px;">
      <tr>
        <td style="padding: 24px; text-align: center;">
          <p style="color: #374151; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
            Questions? We're Here to Help
          </p>
          <a href="tel:6175333190" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 50px; text-decoration: none;">
            Call (617) 533-3190
          </a>
        </td>
      </tr>
    </table>
  `;

  return wrapEmailContent(content);
}
