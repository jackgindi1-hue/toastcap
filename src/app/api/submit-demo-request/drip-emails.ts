// Drip Email Templates for Toast Capital
// These are sent after a user completes the /quote form

// ============================================================================
// DRIP EMAIL 1: Fast, Easy, Flexible (5 minutes after signup)
// ============================================================================
export function getDripEmail1(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - Fast, Easy, and Flexible Funding</title>
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
          <!-- Hero Section -->
          <tr>
            <td style="padding: 40px 40px 20px;">
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 28px; font-weight: 700; line-height: 1.3;">
                Fast, easy, and flexible funding from a partner who gets it
              </h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Hi ${firstName}, thanks for starting your application with Toast Capital! We wanted to share why thousands of restaurant owners trust us with their funding needs.
              </p>
            </td>
          </tr>
          <!-- Key Benefits -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 16px; background-color: #FFF7ED; border-radius: 8px; margin-bottom: 12px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width: 32px; vertical-align: top;">
                          <div style="width: 24px; height: 24px; background-color: #FF6B35; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 14px;">✓</div>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; color: #1f2937; font-size: 15px;"><strong>Loans from $2,000 to $2,000,000</strong></p>
                          <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">Whether you need quick cash or major expansion funds</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 12px;">
                <tr>
                  <td style="padding: 16px; background-color: #F0FDF4; border-radius: 8px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width: 32px; vertical-align: top;">
                          <div style="width: 24px; height: 24px; background-color: #22C55E; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 14px;">✓</div>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; color: #1f2937; font-size: 15px;"><strong>No credit score requirements</strong></p>
                          <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">We evaluate your business holistically</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 12px;">
                <tr>
                  <td style="padding: 16px; background-color: #EFF6FF; border-radius: 8px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width: 32px; vertical-align: top;">
                          <div style="width: 24px; height: 24px; background-color: #1E3A8A; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 14px;">✓</div>
                        </td>
                        <td style="padding-left: 12px;">
                          <p style="margin: 0; color: #1f2937; font-size: 15px;"><strong>Flexible repayments</strong></p>
                          <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">Payments flex with your cash flow</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/upload" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      Continue Your Verification →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0; color: #6b7280; font-size: 14px; text-align: center;">
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

// ============================================================================
// DRIP EMAIL 2: Fast and Flexible Loans (2 hours after signup)
// ============================================================================
export function getDripEmail2(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - Fast and Flexible Loans</title>
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
          <!-- Hero Section -->
          <tr>
            <td style="padding: 40px 40px 20px;">
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 28px; font-weight: 700; line-height: 1.3;">
                Fast and flexible loans
              </h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                ${firstName}, did you know you could have funding as soon as tomorrow? Here's how quick and easy the process is:
              </p>
            </td>
          </tr>
          <!-- Speed Benefits -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFF7ED; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 24px;">
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="width: 48px; vertical-align: top;">
                          <div style="width: 40px; height: 40px; background-color: #FF6B35; border-radius: 50%; text-align: center; line-height: 40px; color: white; font-size: 18px; font-weight: bold;">1</div>
                        </td>
                        <td style="padding-left: 16px;">
                          <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">Apply in minutes</p>
                          <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">No credit score impact, no mountain of documents to dig up</p>
                        </td>
                      </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="width: 48px; vertical-align: top;">
                          <div style="width: 40px; height: 40px; background-color: #FF6B35; border-radius: 50%; text-align: center; line-height: 40px; color: white; font-size: 18px; font-weight: bold;">2</div>
                        </td>
                        <td style="padding-left: 16px;">
                          <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">Next-day funding</p>
                          <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">Receive funding as soon as the next business day after signing</p>
                        </td>
                      </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width: 48px; vertical-align: top;">
                          <div style="width: 40px; height: 40px; background-color: #FF6B35; border-radius: 50%; text-align: center; line-height: 40px; color: white; font-size: 18px; font-weight: bold;">3</div>
                        </td>
                        <td style="padding-left: 16px;">
                          <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">Use it your way</p>
                          <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">Cover payroll, inventory, renovations, or anything else</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Urgency Box -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px 20px; text-align: center;">
                    <p style="margin: 0; color: #92400E; font-size: 15px; font-weight: 600;">
                      Your verification is waiting! Complete it now and you could have funds tomorrow.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/upload" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      Complete Your Verification →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0; color: #6b7280; font-size: 14px; text-align: center;">
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

// ============================================================================
// DRIP EMAIL 3: Industry Expertise (24 hours after signup)
// ============================================================================
export function getDripEmail3(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - Industry Expertise</title>
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
          <!-- Hero Section -->
          <tr>
            <td style="padding: 40px 40px 20px;">
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 28px; font-weight: 700; line-height: 1.3;">
                A financial partner like no other
              </h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                ${firstName}, we've been building alongside restaurant owners for over a decade. Here's what sets us apart:
              </p>
            </td>
          </tr>
          <!-- Industry Expertise Points -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 20px; font-weight: 700;">Industry expertise</h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="padding: 16px; background-color: #F0FDF4; border-radius: 8px; border-left: 4px solid #22C55E;">
                    <p style="margin: 0 0 4px; color: #1f2937; font-size: 15px; font-weight: 600;">No credit score requirements</p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">We evaluate your business holistically and take industry-specific challenges like seasonality into account.</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                <tr>
                  <td style="padding: 16px; background-color: #FFF7ED; border-radius: 8px; border-left: 4px solid #FF6B35;">
                    <p style="margin: 0 0 4px; color: #1f2937; font-size: 15px; font-weight: 600;">Just one simple fixed fee</p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">No compounding interest, no personal guarantee, no giving up equity, no application fee or late fees.</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 16px; background-color: #EFF6FF; border-radius: 8px; border-left: 4px solid #1E3A8A;">
                    <p style="margin: 0 0 4px; color: #1f2937; font-size: 15px; font-weight: 600;">We expect the unexpected</p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Our industry can be unpredictable, which is why repayments flex with your cash flow.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Final Push -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1E3A8A; border-radius: 12px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #ffffff; font-size: 18px; font-weight: 700;">
                      Don't let your verification expire!
                    </p>
                    <p style="margin: 0; color: #93C5FD; font-size: 14px;">
                      Complete it today and see what funding options are available for ${businessName || 'your business'}.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/upload" style="display: inline-block; background-color: #FF6B35; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      Finish Your Verification →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0; color: #6b7280; font-size: 14px; text-align: center;">
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
