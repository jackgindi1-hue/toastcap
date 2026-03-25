// Shared Email Templates for Drip Campaigns
// Used by: /api/drip/process and /api/campaigns/preview

export const DRIP_TOTAL_STEPS = 9;

// Template IDs in order for drip campaign
export const DRIP_TEMPLATE_ORDER = [
  'cold_approved',   // Step 1/9
  'cold_unlocked',   // Step 2/9
  'cold_invited',    // Step 3/9
  'cold_limited',    // Step 4/9
  'cold_question',   // Step 5/9
  'cold_growth',     // Step 6/9
  'cold_potential',  // Step 7/9
  'cold_60sec',      // Step 8/9
  'cold_seasonal',   // Step 9/9
];

// Template metadata
export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  step: number;
  subject: (firstName: string, businessName: string) => string;
  html: (firstName: string, businessName: string) => string;
}

// Get subject line for a template
export function getTemplateSubject(templateId: string, firstName: string, businessName: string): string {
  const subjects: Record<string, string> = {
    'cold_approved': `${firstName}, You've Been Approved for a Toast Lending Offer!`,
    'cold_unlocked': `${firstName}, You've Unlocked a Special Funding Offer!`,
    'cold_invited': `${firstName}, You've been invited to apply for a Toast Capital Loan`,
    'cold_limited': `${firstName}, Don't Miss Out on This Opportunity`,
    'cold_question': `Quick question for you, ${firstName}`,
    'cold_growth': `What Could ${businessName} Accomplish With Extra Capital?`,
    'cold_potential': `What's holding ${businessName} back from its next level?`,
    'cold_60sec': '60 seconds to see your funding offer',
    'cold_seasonal': `Peak season is coming. Is ${businessName} ready?`,
  };
  return subjects[templateId] || '';
}

// Get full HTML for a template
export function getTemplateHtml(templateId: string, firstName: string, businessName: string): string {
  const templates: Record<string, () => string> = {
    'cold_approved': () => getColdApprovedHtml(firstName, businessName),
    'cold_unlocked': () => getColdUnlockedHtml(firstName, businessName),
    'cold_invited': () => getColdInvitedHtml(firstName, businessName),
    'cold_limited': () => getColdLimitedHtml(firstName, businessName),
    'cold_question': () => getColdQuestionHtml(firstName, businessName),
    'cold_growth': () => getColdGrowthHtml(firstName, businessName),
    'cold_potential': () => getColdPotentialHtml(firstName, businessName),
    'cold_60sec': () => getCold60SecHtml(firstName, businessName),
    'cold_seasonal': () => getColdSeasonalHtml(firstName, businessName),
  };

  const getHtml = templates[templateId];
  return getHtml ? getHtml() : '';
}

// ============================================
// TEMPLATE 1/9: Cold Approved
// ============================================
function getColdApprovedHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - You've Been Approved!</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 32px 40px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
              <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="200" style="display: block; margin: 0 auto; max-width: 200px; height: auto;">
            </td>
          </tr>
          <tr>
            <td style="background: linear-gradient(135deg, #FF6B35 0%, #FF8F5E 100%); padding: 24px 40px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px;">CONGRATULATIONS!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 26px; font-weight: 700; line-height: 1.3;">
                ${firstName}, You've Been Approved for a Toast Lending Offer!
              </h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                I'm reaching out from Toast Capital. Based on your recent revenue processed through your Toast POS, <strong style="color: #1f2937;">${businessName}</strong> has been approved for funding!
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F0FDF4; border: 2px solid #22C55E; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #166534; font-size: 14px; font-weight: 600;">YOUR PRE-APPROVED AMOUNT</p>
                    <p style="margin: 0 0 8px; color: #15803D; font-size: 36px; font-weight: 700;">Up to $250,000</p>
                    <p style="margin: 0; color: #166534; font-size: 14px;">Based on your Toast POS revenue</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width: 24px; vertical-align: top;">
                          <div style="width: 20px; height: 20px; background-color: #22C55E; border-radius: 50%; text-align: center; line-height: 20px; color: white; font-size: 12px;">✓</div>
                        </td>
                        <td style="padding-left: 12px; color: #374151; font-size: 15px;">
                          <strong>No cost to apply</strong> - completely free to see your offer
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width: 24px; vertical-align: top;">
                          <div style="width: 20px; height: 20px; background-color: #22C55E; border-radius: 50%; text-align: center; line-height: 20px; color: white; font-size: 12px;">✓</div>
                        </td>
                        <td style="padding-left: 12px; color: #374151; font-size: 15px;">
                          <strong>No obligation to accept</strong> - just see what you qualify for
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width: 24px; vertical-align: top;">
                          <div style="width: 20px; height: 20px; background-color: #22C55E; border-radius: 50%; text-align: center; line-height: 20px; color: white; font-size: 12px;">✓</div>
                        </td>
                        <td style="padding-left: 12px; color: #374151; font-size: 15px;">
                          <strong>No impact on your credit score</strong> - soft pull only
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      See My Approved Amount →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 14px; text-align: center; font-style: italic;">
                Most owners just like to see what they're approved for, even if they don't need capital today.
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                Questions? Call us at <a href="tel:6175333190" style="color: #FF6B35; text-decoration: none; font-weight: 600;">(617) 533-3190</a>
              </p>
            </td>
          </tr>
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

// ============================================
// TEMPLATE 2/9: Cold Unlocked
// ============================================
function getColdUnlockedHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 32px 40px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
              <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="200" style="display: block; margin: 0 auto;">
            </td>
          </tr>
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); padding: 24px 40px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px;">EXCLUSIVE ACCESS UNLOCKED</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 26px; font-weight: 700;">${firstName}, You've Unlocked a Special Funding Offer!</h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">Great news! As a valued Toast customer, <strong style="color: #1f2937;">${businessName}</strong> has unlocked exclusive access to Toast Capital funding based on your POS performance.</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #EFF6FF; border: 2px solid #3B82F6; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 16px; color: #1E40AF; font-size: 18px; font-weight: 700; text-align: center;">What You've Unlocked:</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width: 50%; padding: 8px; text-align: center; border-right: 1px solid #BFDBFE;">
                          <p style="margin: 0 0 4px; color: #1E3A8A; font-size: 24px; font-weight: 700;">$2K - $2M</p>
                          <p style="margin: 0; color: #6b7280; font-size: 12px;">Funding Range</p>
                        </td>
                        <td style="width: 50%; padding: 8px; text-align: center;">
                          <p style="margin: 0 0 4px; color: #1E3A8A; font-size: 24px; font-weight: 700;">Next Day</p>
                          <p style="margin: 0; color: #6b7280; font-size: 12px;">Funding Speed</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFF7ED; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px; color: #9A3412; font-size: 15px; font-weight: 600;">Why check your offer?</p>
                    <p style="margin: 0; color: #C2410C; font-size: 14px; line-height: 1.6;">Most owners like to see what they're approved for—even if they don't need capital today. It's like checking your credit score: <strong>useful information with zero risk.</strong></p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr><td style="padding: 8px 0;"><span style="color: #22C55E; font-size: 16px; margin-right: 8px;">●</span><span style="color: #374151; font-size: 15px;">No cost to apply</span></td></tr>
                <tr><td style="padding: 8px 0;"><span style="color: #22C55E; font-size: 16px; margin-right: 8px;">●</span><span style="color: #374151; font-size: 15px;">No obligation to accept funding</span></td></tr>
                <tr><td style="padding: 8px 0;"><span style="color: #22C55E; font-size: 16px; margin-right: 8px;">●</span><span style="color: #374151; font-size: 15px;">No impact on your personal credit score</span></td></tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">Check My Offer →</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">Questions? Call us at <a href="tel:6175333190" style="color: #FF6B35; text-decoration: none; font-weight: 600;">(617) 533-3190</a></p>
            </td>
          </tr>
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

// ============================================
// TEMPLATE 3/9: Cold Invited
// ============================================
function getColdInvitedHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 32px 40px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
              <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="200" style="display: block; margin: 0 auto;">
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px; color: #6b7280; font-size: 15px;">Hi ${firstName},</p>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 15px; line-height: 1.6;">I'm reaching out from <strong style="color: #1f2937;">Toast Capital</strong>.</p>
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 26px; font-weight: 700;">You've been invited to apply for a Toast Capital Loan</h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 15px; line-height: 1.6;">Based on your recent revenue processed through your Toast POS, <strong style="color: #1f2937;">${businessName}</strong> has been pre-selected for our exclusive lending program.</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 32px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px; font-weight: 600; letter-spacing: 1px;">YOU'RE INVITED TO ACCESS</p>
                    <p style="margin: 0 0 4px; color: #ffffff; font-size: 32px; font-weight: 700;">Up to $2,000,000</p>
                    <p style="margin: 0; color: #9ca3af; font-size: 14px;">in business funding</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px; background-color: #f9fafb; border-left: 4px solid #FF6B35; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0 0 12px; color: #374151; font-size: 15px; line-height: 1.6;"><strong>Why check your offer?</strong> Most restaurant owners like to see what they're approved for, even if they don't need capital today.</p>
                    <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">Think of it as a financial health check—<strong>with zero downside:</strong></p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="width: 33.33%; padding: 12px; text-align: center; vertical-align: top;">
                    <div style="width: 48px; height: 48px; background-color: #F0FDF4; border-radius: 50%; margin: 0 auto 8px; line-height: 48px;"><span style="color: #22C55E; font-size: 24px;">$0</span></div>
                    <p style="margin: 0; color: #374151; font-size: 13px; font-weight: 600;">No Cost</p>
                    <p style="margin: 4px 0 0; color: #6b7280; font-size: 12px;">Free to apply</p>
                  </td>
                  <td style="width: 33.33%; padding: 12px; text-align: center; vertical-align: top;">
                    <div style="width: 48px; height: 48px; background-color: #EFF6FF; border-radius: 50%; margin: 0 auto 8px; line-height: 48px;"><span style="color: #1E3A8A; font-size: 20px;">0%</span></div>
                    <p style="margin: 0; color: #374151; font-size: 13px; font-weight: 600;">No Obligation</p>
                    <p style="margin: 4px 0 0; color: #6b7280; font-size: 12px;">Decline anytime</p>
                  </td>
                  <td style="width: 33.33%; padding: 12px; text-align: center; vertical-align: top;">
                    <div style="width: 48px; height: 48px; background-color: #FFF7ED; border-radius: 50%; margin: 0 auto 8px; line-height: 48px;"><span style="color: #FF6B35; font-size: 20px;">0</span></div>
                    <p style="margin: 0; color: #374151; font-size: 13px; font-weight: 600;">No Credit Impact</p>
                    <p style="margin: 4px 0 0; color: #6b7280; font-size: 12px;">Soft pull only</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #FF6B35; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">Accept Invitation →</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 24px; color: #9ca3af; font-size: 13px; text-align: center;">Takes less than 2 minutes to see your offer</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; color: #374151; font-size: 14px;">Best regards,</p>
                    <p style="margin: 0 0 4px; color: #374151; font-size: 14px; font-weight: 600;">The Toast Capital Team</p>
                    <p style="margin: 0; color: #6b7280; font-size: 13px;"><a href="tel:6175333190" style="color: #FF6B35; text-decoration: none;">(617) 533-3190</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
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

// ============================================
// TEMPLATE 4/9: Cold Limited
// ============================================
function getColdLimitedHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 32px 40px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
              <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="200" style="display: block; margin: 0 auto;">
            </td>
          </tr>
          <tr>
            <td style="background-color: #DC2626; padding: 16px 40px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px;">LIMITED TIME: SPECIAL RATES AVAILABLE</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 26px; font-weight: 700;">${firstName}, Don't Miss Out on This Opportunity</h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">Toast Capital is offering <strong style="color: #DC2626;">special rates</strong> for qualified Toast merchants this month. Based on your POS activity, <strong style="color: #1f2937;">${businessName}</strong> may qualify.</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FEF2F2; border: 2px solid #DC2626; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #991B1B; font-size: 14px; font-weight: 600;">THIS MONTH ONLY</p>
                    <p style="margin: 0 0 8px; color: #DC2626; font-size: 28px; font-weight: 700;">Reduced Fees + Faster Approval</p>
                    <p style="margin: 0; color: #991B1B; font-size: 14px;">Check your pre-qualified amount before rates change</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #f9fafb; border-radius: 8px;">
                    <p style="margin: 0 0 12px; color: #1f2937; font-size: 15px; font-weight: 600;">Why act now?</p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr><td style="padding: 4px 0; color: #374151; font-size: 14px;"><span style="color: #DC2626; margin-right: 8px;">→</span> Lower fixed fees for applications this month</td></tr>
                      <tr><td style="padding: 4px 0; color: #374151; font-size: 14px;"><span style="color: #DC2626; margin-right: 8px;">→</span> Priority processing (24-hour decisions)</td></tr>
                      <tr><td style="padding: 4px 0; color: #374151; font-size: 14px;"><span style="color: #DC2626; margin-right: 8px;">→</span> Funding as fast as same day</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #F0FDF4; border-radius: 8px; border: 1px solid #BBF7D0;">
                    <p style="margin: 0; color: #166534; font-size: 14px; text-align: center;"><strong>Zero risk to check:</strong> No cost, no obligation, no credit impact</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #DC2626; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">Check My Special Rate →</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">Questions? Call us at <a href="tel:6175333190" style="color: #FF6B35; text-decoration: none; font-weight: 600;">(617) 533-3190</a></p>
            </td>
          </tr>
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

// ============================================
// TEMPLATE 5/9: Cold Question
// ============================================
function getColdQuestionHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 32px 40px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
              <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="200" style="display: block; margin: 0 auto;">
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #6b7280; font-size: 16px;">Hi ${firstName},</p>
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.7;">Quick question for you:</p>
              <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 700; line-height: 1.4;">If you could access up to $250,000 for ${businessName} with no credit impact and no obligation... would you at least want to see the offer?</h1>
              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.7;">Most restaurant owners say yes. Even if you don't need capital right now, knowing what you qualify for is valuable information.</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px; color: #1f2937; font-size: 15px; font-weight: 600;">Here's the deal:</p>
                    <p style="margin: 0 0 8px; color: #374151; font-size: 15px;">• Takes 2 minutes to check</p>
                    <p style="margin: 0 0 8px; color: #374151; font-size: 15px;">• No cost whatsoever</p>
                    <p style="margin: 0 0 8px; color: #374151; font-size: 15px;">• No obligation to accept</p>
                    <p style="margin: 0; color: #374151; font-size: 15px;">• Zero impact on your credit score</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">Yes, Show Me My Offer →</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0 0 24px; color: #9ca3af; font-size: 14px; text-align: center;">(No spam, no pressure, just your numbers)</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; color: #374151; font-size: 14px;">Talk soon,</p>
                    <p style="margin: 0 0 4px; color: #374151; font-size: 14px; font-weight: 600;">The Toast Capital Team</p>
                    <p style="margin: 0; color: #6b7280; font-size: 13px;"><a href="tel:6175333190" style="color: #FF6B35; text-decoration: none;">(617) 533-3190</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
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

// ============================================
// TEMPLATE 6/9: Cold Growth
// ============================================
function getColdGrowthHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); padding: 40px; text-align: center;">
              <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="150" style="margin-bottom: 20px; filter: brightness(0) invert(1);">
              <p style="margin: 0 0 8px; color: #93C5FD; font-size: 14px; letter-spacing: 1px;">FUEL YOUR NEXT CHAPTER</p>
              <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700; line-height: 1.3;">What Could ${businessName} Accomplish With Extra Capital?</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.7;">Hi ${firstName}, whether you're dreaming of a second location, upgrading your kitchen, hiring more staff, or just want a cash cushion for peace of mind — Toast Capital can help make it happen.</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="width: 50%; padding: 8px; vertical-align: top;">
                    <table width="100%" style="background-color: #FFF7ED; border-radius: 8px;"><tr><td style="padding: 16px; text-align: center;"><p style="margin: 0 0 4px; font-size: 24px;">🏪</p><p style="margin: 0; color: #9A3412; font-size: 14px; font-weight: 600;">Open a New Location</p></td></tr></table>
                  </td>
                  <td style="width: 50%; padding: 8px; vertical-align: top;">
                    <table width="100%" style="background-color: #F0FDF4; border-radius: 8px;"><tr><td style="padding: 16px; text-align: center;"><p style="margin: 0 0 4px; font-size: 24px;">🍳</p><p style="margin: 0; color: #166534; font-size: 14px; font-weight: 600;">Upgrade Equipment</p></td></tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="width: 50%; padding: 8px; vertical-align: top;">
                    <table width="100%" style="background-color: #EFF6FF; border-radius: 8px;"><tr><td style="padding: 16px; text-align: center;"><p style="margin: 0 0 4px; font-size: 24px;">👥</p><p style="margin: 0; color: #1E40AF; font-size: 14px; font-weight: 600;">Hire & Train Staff</p></td></tr></table>
                  </td>
                  <td style="width: 50%; padding: 8px; vertical-align: top;">
                    <table width="100%" style="background-color: #FEF3C7; border-radius: 8px;"><tr><td style="padding: 16px; text-align: center;"><p style="margin: 0 0 4px; font-size: 24px;">📈</p><p style="margin: 0; color: #92400E; font-size: 14px; font-weight: 600;">Marketing & Growth</p></td></tr></table>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1f2937; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 4px; color: #9ca3af; font-size: 13px;">BASED ON YOUR TOAST REVENUE</p>
                    <p style="margin: 0 0 8px; color: white; font-size: 28px; font-weight: 700;">You May Qualify for Up to $500,000</p>
                    <p style="margin: 0; color: #9ca3af; font-size: 14px;">Funding available as fast as next business day</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="text-align: center;">
                    <span style="display: inline-block; padding: 4px 12px; background-color: #F0FDF4; border-radius: 20px; color: #166534; font-size: 13px; font-weight: 600; margin: 0 4px;">No cost</span>
                    <span style="display: inline-block; padding: 4px 12px; background-color: #F0FDF4; border-radius: 20px; color: #166534; font-size: 13px; font-weight: 600; margin: 0 4px;">No obligation</span>
                    <span style="display: inline-block; padding: 4px 12px; background-color: #F0FDF4; border-radius: 20px; color: #166534; font-size: 13px; font-weight: 600; margin: 0 4px;">No credit impact</span>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #FF6B35; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">See What I Qualify For →</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">Questions? Call us at <a href="tel:6175333190" style="color: #FF6B35; text-decoration: none; font-weight: 600;">(617) 533-3190</a></p>
            </td>
          </tr>
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

// ============================================
// TEMPLATE 7/9: Cold Potential
// ============================================
function getColdPotentialHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 32px 40px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
              <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="200" style="display: block; margin: 0 auto;">
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px; color: #6b7280; font-size: 15px;">Hi ${firstName},</p>
              <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 26px; font-weight: 700; line-height: 1.3;">What's holding ${businessName} back from its next level?</h1>
              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.7;">Every restaurant has that one thing they'd do if capital wasn't a barrier. What's yours?</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                <tr><td style="padding: 16px; background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%); border-radius: 12px; border-left: 4px solid #FF6B35;"><p style="margin: 0 0 4px; color: #9A3412; font-size: 16px; font-weight: 700;">Expand Your Space</p><p style="margin: 0; color: #C2410C; font-size: 14px;">Patio seating, private dining room, or a second location</p></td></tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                <tr><td style="padding: 16px; background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border-radius: 12px; border-left: 4px solid #22C55E;"><p style="margin: 0 0 4px; color: #166534; font-size: 16px; font-weight: 700;">Upgrade Your Kitchen</p><p style="margin: 0; color: #15803D; font-size: 14px;">New equipment that speeds up service and reduces waste</p></td></tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr><td style="padding: 16px; background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border-radius: 12px; border-left: 4px solid #1E3A8A;"><p style="margin: 0 0 4px; color: #1E40AF; font-size: 16px; font-weight: 700;">Build Your Team</p><p style="margin: 0; color: #1E3A8A; font-size: 14px;">Hire key staff and invest in training that pays dividends</p></td></tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1f2937; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 4px; color: #9ca3af; font-size: 13px;">BASED ON YOUR TOAST REVENUE, YOU MAY QUALIFY FOR</p>
                    <p style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">$25,000 - $500,000</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #f9fafb; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; color: #374151; font-size: 14px;"><span style="color: #22C55E; font-weight: bold;">Zero risk to check:</span> No cost, no obligation, no credit impact</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #FF6B35; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">See What I Qualify For →</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">Questions? Call us at <a href="tel:6175333190" style="color: #FF6B35; text-decoration: none; font-weight: 600;">(617) 533-3190</a></p>
            </td>
          </tr>
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

// ============================================
// TEMPLATE 8/9: Cold 60 Seconds
// ============================================
function getCold60SecHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 32px 40px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
              <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="200" style="display: block; margin: 0 auto;">
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #6b7280; font-size: 16px;">${firstName},</p>
              <h1 style="margin: 0 0 24px; color: #1f2937; font-size: 48px; font-weight: 700; text-align: center;">60 seconds.</h1>
              <p style="margin: 0 0 32px; color: #374151; font-size: 18px; line-height: 1.6; text-align: center;">That's all it takes to see if ${businessName} qualifies for up to <strong style="color: #FF6B35;">$500,000</strong> in funding.</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                <tr><td style="text-align: center; padding: 8px;"><span style="color: #22C55E; font-size: 18px;">✓</span><span style="color: #374151; font-size: 15px; margin-left: 8px;">No cost</span></td></tr>
                <tr><td style="text-align: center; padding: 8px;"><span style="color: #22C55E; font-size: 18px;">✓</span><span style="color: #374151; font-size: 15px; margin-left: 8px;">No obligation</span></td></tr>
                <tr><td style="text-align: center; padding: 8px;"><span style="color: #22C55E; font-size: 18px;">✓</span><span style="color: #374151; font-size: 15px; margin-left: 8px;">No credit impact</span></td></tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 18px; padding: 18px 48px; border-radius: 8px; text-decoration: none;">Check My Offer →</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; color: #9ca3af; font-size: 14px; text-align: center;">Seriously, that's it. 60 seconds.</p>
            </td>
          </tr>
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

// ============================================
// TEMPLATE 9/9: Cold Seasonal
// ============================================
function getColdSeasonalHtml(firstName: string, businessName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 32px 40px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
              <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="200" style="display: block; margin: 0 auto;">
            </td>
          </tr>
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #10B981 100%); padding: 20px 40px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px;">PREPARE FOR YOUR BUSIEST SEASON</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px; color: #6b7280; font-size: 15px;">Hi ${firstName},</p>
              <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 26px; font-weight: 700; line-height: 1.3;">Peak season is coming. Is ${businessName} ready?</h1>
              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.7;">Smart restaurant owners prepare <em>before</em> the rush hits. Whether it's summer patios, holiday catering, or weekend brunch crowds—now is the time to gear up.</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F0FDF4; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 16px; color: #166534; font-size: 16px; font-weight: 700;">Get ahead of the season:</p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr><td style="padding: 6px 0; color: #15803D; font-size: 14px;"><span style="margin-right: 8px;">→</span> Stock up on inventory before prices spike</td></tr>
                      <tr><td style="padding: 6px 0; color: #15803D; font-size: 14px;"><span style="margin-right: 8px;">→</span> Hire and train staff ahead of time</td></tr>
                      <tr><td style="padding: 6px 0; color: #15803D; font-size: 14px;"><span style="margin-right: 8px;">→</span> Upgrade equipment before the crunch</td></tr>
                      <tr><td style="padding: 6px 0; color: #15803D; font-size: 14px;"><span style="margin-right: 8px;">→</span> Launch marketing campaigns early</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1f2937; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #9ca3af; font-size: 14px;">BASED ON YOUR TOAST POS REVENUE</p>
                    <p style="margin: 0 0 8px; color: #ffffff; font-size: 28px; font-weight: 700;">You May Qualify for Funding</p>
                    <p style="margin: 0; color: #10B981; font-size: 16px; font-weight: 600;">With funds as soon as next business day</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="text-align: center;">
                    <span style="display: inline-block; padding: 4px 12px; background-color: #F0FDF4; border-radius: 20px; color: #166534; font-size: 13px; font-weight: 600; margin: 0 4px;">No cost</span>
                    <span style="display: inline-block; padding: 4px 12px; background-color: #F0FDF4; border-radius: 20px; color: #166534; font-size: 13px; font-weight: 600; margin: 0 4px;">No obligation</span>
                    <span style="display: inline-block; padding: 4px 12px; background-color: #F0FDF4; border-radius: 20px; color: #166534; font-size: 13px; font-weight: 600; margin: 0 4px;">No credit impact</span>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">Prepare for Peak Season →</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">Questions? Call us at <a href="tel:6175333190" style="color: #FF6B35; text-decoration: none; font-weight: 600;">(617) 533-3190</a></p>
            </td>
          </tr>
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
