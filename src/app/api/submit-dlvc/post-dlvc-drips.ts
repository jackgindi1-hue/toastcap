// Post-DLVC Drip Email Templates for Toast Capital
// These are sent AFTER a user completes the DLVC (document upload) process
// Goal: Encourage them to sign their funding agreement

// ============================================================================
// POST-DLVC DRIP EMAIL 1: Your Approval is Ready! (3 hours after DLVC)
// ============================================================================
export function getPostDlvcDrip1(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - Your Approval is Ready!</title>
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

          <!-- Celebration Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); padding: 24px 40px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px;">YOUR APPROVAL IS READY!</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 28px; font-weight: 700; line-height: 1.3;">
                ${firstName}, Great News! Your Funding is Approved!
              </h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                We've reviewed your documents for <strong style="color: #1f2937;">${businessName}</strong> and you've been approved! Your funding agreement is ready for signature.
              </p>

              <!-- Approval Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F0FDF4; border: 2px solid #22C55E; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #166534; font-size: 14px; font-weight: 600;">YOUR FUNDING AGREEMENT</p>
                    <p style="margin: 0 0 8px; color: #15803D; font-size: 20px; font-weight: 700;">Is Waiting for Your Signature</p>
                    <p style="margin: 0; color: #166534; font-size: 14px;">Sign now to receive your funds as soon as tomorrow!</p>
                  </td>
                </tr>
              </table>

              <!-- What to Expect -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #EFF6FF; border-radius: 8px;">
                    <p style="margin: 0 0 12px; color: #1E40AF; font-size: 15px; font-weight: 600;">What happens next:</p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 4px 0; color: #1E3A8A; font-size: 14px;">
                          <span style="margin-right: 8px;">1.</span> Check your phone - our funding specialist is calling you
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #1E3A8A; font-size: 14px;">
                          <span style="margin-right: 8px;">2.</span> Review and sign your funding agreement
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #1E3A8A; font-size: 14px;">
                          <span style="margin-right: 8px;">3.</span> Receive your funds as soon as the next business day!
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Urgency Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px; text-align: center;">
                    <p style="margin: 0; color: #92400E; font-size: 15px; font-weight: 600;">
                      Please answer your phone! We're calling from (617) 533-3190 to finalize your approval.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="tel:6175333190" style="display: inline-block; background-color: #22C55E; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      Call Us Now: (617) 533-3190
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                Missed our call? Call us back at <a href="tel:6175333190" style="color: #FF6B35; text-decoration: none; font-weight: 600;">(617) 533-3190</a>
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
// POST-DLVC DRIP EMAIL 2: Your Funding Agreement is Waiting (12 hours after DLVC)
// ============================================================================
export function getPostDlvcDrip2(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - Your Funding Agreement is Waiting</title>
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

          <!-- Alert Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); padding: 24px 40px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px;">ACTION NEEDED</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 28px; font-weight: 700; line-height: 1.3;">
                ${firstName}, Your Funding Agreement is Still Waiting
              </h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                We tried reaching you earlier about your approved funding for <strong style="color: #1f2937;">${businessName}</strong>. Your agreement is ready - let's get this completed so you can get your funds!
              </p>

              <!-- Status Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFF7ED; border: 2px solid #FF6B35; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="text-align: center;">
                          <p style="margin: 0 0 12px; color: #9A3412; font-size: 14px; font-weight: 600;">YOUR APPLICATION STATUS</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding: 8px 0;">
                                <span style="display: inline-block; width: 24px; height: 24px; background-color: #22C55E; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 14px; margin-right: 12px;">✓</span>
                                <span style="color: #166534; font-size: 15px; font-weight: 600;">Documents Received</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0;">
                                <span style="display: inline-block; width: 24px; height: 24px; background-color: #22C55E; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 14px; margin-right: 12px;">✓</span>
                                <span style="color: #166534; font-size: 15px; font-weight: 600;">Application Approved</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0;">
                                <span style="display: inline-block; width: 24px; height: 24px; background-color: #FF6B35; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 14px; margin-right: 12px;">!</span>
                                <span style="color: #C2410C; font-size: 15px; font-weight: 600;">Awaiting Your Signature</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Quick Note -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #1E3A8A;">
                    <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">
                      <strong>Quick reminder:</strong> Once you sign, funds can be in your account as soon as the next business day. Don't let this opportunity slip away!
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="tel:6175333190" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      Call to Complete: (617) 533-3190
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                We're standing by to help you finish!
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
// POST-DLVC DRIP EMAIL 3: Don't Miss Out! (24 hours after DLVC)
// ============================================================================
export function getPostDlvcDrip3(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - Don't Miss Your Funding!</title>
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

          <!-- Urgency Banner -->
          <tr>
            <td style="background-color: #DC2626; padding: 20px 40px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px;">FINAL REMINDER - YOUR APPROVAL EXPIRES SOON</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 28px; font-weight: 700; line-height: 1.3;">
                ${firstName}, Don't Let Your Funding Slip Away
              </h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Your funding approval for <strong style="color: #1f2937;">${businessName}</strong> is still waiting for your signature. We don't want you to miss this opportunity!
              </p>

              <!-- Countdown Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FEF2F2; border: 2px solid #DC2626; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #991B1B; font-size: 14px; font-weight: 600;">YOUR APPROVED FUNDING</p>
                    <p style="margin: 0 0 8px; color: #DC2626; font-size: 24px; font-weight: 700;">Waiting for Signature</p>
                    <p style="margin: 0; color: #991B1B; font-size: 14px;">Complete today to avoid re-applying</p>
                  </td>
                </tr>
              </table>

              <!-- What You're Missing -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px; background-color: #f9fafb; border-radius: 8px;">
                    <p style="margin: 0 0 12px; color: #1f2937; font-size: 16px; font-weight: 700;">What you're missing:</p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 6px 0; color: #374151; font-size: 15px;">
                          <span style="color: #22C55E; margin-right: 8px;">✓</span> Funds as soon as tomorrow
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #374151; font-size: 15px;">
                          <span style="color: #22C55E; margin-right: 8px;">✓</span> Flexible daily or weekly repayments
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #374151; font-size: 15px;">
                          <span style="color: #22C55E; margin-right: 8px;">✓</span> No personal guarantee required
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #374151; font-size: 15px;">
                          <span style="color: #22C55E; margin-right: 8px;">✓</span> One simple fixed fee - no surprises
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Personal Touch -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #FFF7ED; border-radius: 8px; border-left: 4px solid #FF6B35;">
                    <p style="margin: 0; color: #9A3412; font-size: 15px; line-height: 1.6;">
                      <strong>Having second thoughts?</strong> That's completely normal. Give us a call and we'll walk you through everything - no pressure. We're here to help ${businessName} grow on your terms.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                <tr>
                  <td align="center">
                    <a href="tel:6175333190" style="display: inline-block; background-color: #DC2626; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      Complete Your Funding: (617) 533-3190
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #9ca3af; font-size: 13px; text-align: center;">
                This is your final reminder. After this, you may need to re-apply.
              </p>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; color: #374151; font-size: 14px;">Best regards,</p>
                    <p style="margin: 0 0 4px; color: #374151; font-size: 14px; font-weight: 600;">The Toast Capital Team</p>
                    <p style="margin: 0; color: #6b7280; font-size: 13px;">
                      <a href="tel:6175333190" style="color: #FF6B35; text-decoration: none;">(617) 533-3190</a>
                    </p>
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
