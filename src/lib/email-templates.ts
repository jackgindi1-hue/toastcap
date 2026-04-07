// Shared Email Templates for Drip Campaigns
// Used by: /api/drip/process and /api/campaigns/preview

export const DRIP_TOTAL_STEPS = 11;

// CDN URL for email images - using bulletproof Netlify subdomain
// This domain can NEVER be suspended (it's Netlify's infrastructure)
export const EMAIL_CDN_URL = 'https://toastcap-crm.netlify.app';
export const LOGO_URL = `${EMAIL_CDN_URL}/toast-capital-logo.png`;

// Approval email types
export interface ApprovalDetails {
  firstName: string;
  businessName: string;
  approvedAmount: string;
  term: string;
  repaymentType: 'daily' | 'weekly';
  repaymentAmount: string;
  feeAmount?: string;
  feePercent?: string;
  totalPayback?: string;
  lendingPartner?: string;
  verificationLink?: string;
}

export function getApprovalEmailSubject(details: ApprovalDetails): string {
  return `Great News, ${details.firstName}! You've Been Approved for ${details.approvedAmount}!`;
}

export function getApprovalEmailHtml(details: ApprovalDetails): string {
  const { firstName, businessName, approvedAmount, term, repaymentType, repaymentAmount, feeAmount, feePercent, totalPayback, verificationLink } = details;
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr><td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          <tr><td style="padding: 32px 40px; text-align: center; border-bottom: 1px solid #e5e7eb;">
              <img src="${LOGO_URL}" alt="Toast Capital" width="200" style="display: block; margin: 0 auto;">
          </td></tr>
          <tr><td style="background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); padding: 24px 40px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px;">APPROVED!</p>
          </td></tr>
          <tr><td style="padding: 40px;">
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 26px; font-weight: 700;">Congratulations, ${firstName}!</h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Great news! <strong style="color: #1f2937;">${businessName}</strong> has been approved for funding.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F0FDF4; border: 2px solid #22C55E; border-radius: 12px; margin-bottom: 24px;">
                <tr><td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #166534; font-size: 14px; font-weight: 600;">APPROVED AMOUNT</p>
                    <p style="margin: 0 0 16px; color: #15803D; font-size: 36px; font-weight: 700;">${approvedAmount}</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 8px; text-align: center; border-right: 1px solid #BBF7D0;">
                          <p style="margin: 0; color: #166534; font-size: 12px;">Term</p>
                          <p style="margin: 4px 0 0; color: #15803D; font-size: 16px; font-weight: 700;">${term}</p>
                        </td>
                        <td style="padding: 8px; text-align: center;">
                          <p style="margin: 0; color: #166534; font-size: 12px;">${repaymentType === 'daily' ? 'Daily' : 'Weekly'} Payment</p>
                          <p style="margin: 4px 0 0; color: #15803D; font-size: 16px; font-weight: 700;">${repaymentAmount}</p>
                        </td>
                      </tr>
                    </table>
                    ${feeAmount || feePercent || totalPayback ? `
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 16px; border-top: 1px solid #BBF7D0; padding-top: 16px;">
                      <tr>
                        ${feeAmount ? `<td style="padding: 4px; text-align: center;"><p style="margin: 0; color: #166534; font-size: 11px;">Fee</p><p style="margin: 2px 0 0; color: #15803D; font-size: 14px; font-weight: 600;">${feeAmount}</p></td>` : ''}
                        ${feePercent ? `<td style="padding: 4px; text-align: center;"><p style="margin: 0; color: #166534; font-size: 11px;">Rate</p><p style="margin: 2px 0 0; color: #15803D; font-size: 14px; font-weight: 600;">${feePercent}</p></td>` : ''}
                        ${totalPayback ? `<td style="padding: 4px; text-align: center;"><p style="margin: 0; color: #166534; font-size: 11px;">Total Payback</p><p style="margin: 2px 0 0; color: #15803D; font-size: 14px; font-weight: 600;">${totalPayback}</p></td>` : ''}
                      </tr>
                    </table>` : ''}
                </td></tr>
              </table>
              ${verificationLink ? `
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr><td align="center">
                    <a href="${verificationLink}" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">Verify Bank & Proceed →</a>
                </td></tr>
              </table>` : ''}
              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                Questions? Call us at <a href="tel:6175333190" style="color: #FF6B35; font-weight: 600;">(617) 533-3190</a>
              </p>
          </td></tr>
          <tr><td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">Toast Capital | 333 Summer Street, Boston, MA 02210</p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2026 Toast Capital. All rights reserved.</p>
          </td></tr>
        </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// Template IDs in order for drip campaign
export const DRIP_TEMPLATE_ORDER = [
  'cold_approved',        // Step 1/11
  'cold_unlocked',        // Step 2/11
  'cold_better_terms',    // Step 3/11
  'cold_special_access',  // Step 4/11
  'cold_invited',         // Step 5/11
  'cold_limited',         // Step 6/11
  'cold_question',        // Step 7/11
  'cold_growth',          // Step 8/11
  'cold_potential',       // Step 9/11
  'cold_60sec',           // Step 10/11
  'cold_seasonal',        // Step 11/11
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
    'cold_approved': `You've Been Approved for a Toast Lending Offer!`,
    'cold_unlocked': `[UNLOCKED] We've Improved Your Funding Terms!`,
    'cold_better_terms': `[UNLOCKED] Your Terms Have Been Upgraded!`,
    'cold_special_access': `${firstName}, You've Unlocked a Special Funding Offer!`,
    'cold_invited': `You've been invited to apply for a Toast Capital Loan`,
    'cold_limited': `Don't Miss Out on This Opportunity`,
    'cold_question': `Quick question for you`,
    'cold_growth': `What Could ${businessName} Accomplish With Extra Capital?`,
    'cold_potential': `What's holding ${businessName} back from its next level?`,
    'cold_60sec': '60 seconds to see your funding offer',
    'cold_seasonal': `Peak season is coming. Is ${businessName} ready?`,
    // V2 Versions (same subjects, different styling)
    'cold_approved_v2': `You've Been Approved for a Toast Lending Offer!`,
    'cold_unlocked_v2': `[UNLOCKED] We've Improved Your Funding Terms!`,
    'cold_better_terms_v2': `[UNLOCKED] Your Terms Have Been Upgraded!`,
    'cold_special_access_v2': `${firstName}, You've Unlocked a Special Funding Offer!`,
    'cold_invited_v2': `You've been invited to apply for a Toast Capital Loan`,
    'cold_limited_v2': `Don't Miss Out on This Opportunity`,
    'cold_question_v2': `Quick question for you`,
    'cold_growth_v2': `What Could ${businessName} Accomplish With Extra Capital?`,
    'cold_potential_v2': `What's holding ${businessName} back from its next level?`,
    'cold_60sec_v2': '60 seconds to see your funding offer',
    'cold_seasonal_v2': `Peak season is coming. Is ${businessName} ready?`,
  };
  return subjects[templateId] || '';
}

// Get full HTML for a template
export function getTemplateHtml(templateId: string, firstName: string, businessName: string): string {
  const templates: Record<string, () => string> = {
    'cold_approved': () => getBaseEmailHtml(firstName, businessName, 'CONGRATULATIONS!', `You've Been Approved for a Toast Lending Offer!`, 'orange'),
    'cold_unlocked': () => getBaseEmailHtml(firstName, businessName, 'TERMS IMPROVED', `We've Improved Your Funding Terms!`, 'green'),
    'cold_better_terms': () => getBaseEmailHtml(firstName, businessName, 'UNLOCKED', `Your Terms Have Been Upgraded!`, 'green'),
    'cold_special_access': () => getBaseEmailHtml(firstName, businessName, 'EXCLUSIVE ACCESS', `You've Unlocked a Special Funding Offer!`, 'blue'),
    'cold_invited': () => getBaseEmailHtml(firstName, businessName, 'INVITATION', `You've been invited to apply for a Toast Capital Loan`, 'gray'),
    'cold_limited': () => getBaseEmailHtml(firstName, businessName, 'LIMITED TIME', `Don't Miss Out on This Opportunity`, 'red'),
    'cold_question': () => getBaseEmailHtml(firstName, businessName, '', `Quick question for you`, 'blue'),
    'cold_growth': () => getBaseEmailHtml(firstName, businessName, 'FUEL YOUR GROWTH', `What Could ${businessName} Accomplish With Extra Capital?`, 'blue'),
    'cold_potential': () => getBaseEmailHtml(firstName, businessName, '', `What's holding ${businessName} back from its next level?`, 'orange'),
    'cold_60sec': () => getBaseEmailHtml(firstName, businessName, '', `60 seconds to see your funding offer`, 'blue'),
    'cold_seasonal': () => getBaseEmailHtml(firstName, businessName, 'PEAK SEASON', `Peak season is coming. Is ${businessName} ready?`, 'green'),
    // V2 Versions - Each with unique content and visual style
    'cold_approved_v2': () => getV2ApprovedEmail(firstName, businessName),
    'cold_unlocked_v2': () => getV2UnlockedEmail(firstName, businessName),
    'cold_better_terms_v2': () => getV2BetterTermsEmail(firstName, businessName),
    'cold_special_access_v2': () => getV2SpecialAccessEmail(firstName, businessName),
    'cold_invited_v2': () => getV2InvitedEmail(firstName, businessName),
    'cold_limited_v2': () => getV2LimitedTimeEmail(firstName, businessName),
    'cold_question_v2': () => getV2QuestionEmail(firstName, businessName),
    'cold_growth_v2': () => getV2GrowthEmail(firstName, businessName),
    'cold_potential_v2': () => getV2PotentialEmail(firstName, businessName),
    'cold_60sec_v2': () => getV2_60SecEmail(firstName, businessName),
    'cold_seasonal_v2': () => getV2SeasonalEmail(firstName, businessName),
  };

  const getHtml = templates[templateId];
  return getHtml ? getHtml() : '';
}

// Base email template (Original style - gray background, card layout)
function getBaseEmailHtml(firstName: string, businessName: string, badge: string, headline: string, color: string): string {
  const colors: Record<string, string> = {
    orange: '#FF6B35',
    green: '#059669',
    blue: '#1E3A8A',
    red: '#DC2626',
    gray: '#1f2937',
  };
  const bgColor = colors[color] || colors.orange;

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
              <img src="${LOGO_URL}" alt="Toast Capital" width="200" style="display: block; margin: 0 auto;">
            </td>
          </tr>
          ${badge ? `<tr><td style="background: ${bgColor}; padding: 16px 40px; text-align: center;"><p style="margin: 0; color: #ffffff; font-size: 12px; font-weight: 600; letter-spacing: 1px;">${badge}</p></td></tr>` : ''}
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 24px; font-weight: 700;">${headline}</h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Hi ${firstName}, based on your Toast POS revenue, <strong style="color: #1f2937;">${businessName}</strong> may qualify for up to $250,000 in funding.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;"><span style="color: #22C55E; margin-right: 8px;">✓</span> No cost to apply</td></tr>
                <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;"><span style="color: #22C55E; margin-right: 8px;">✓</span> No obligation to accept</td></tr>
                <tr><td style="padding: 8px 0; color: #374151; font-size: 15px;"><span style="color: #22C55E; margin-right: 8px;">✓</span> No impact on your credit score</td></tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcap.com/quote" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">Check My Offer →</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                Questions? Call us at <a href="tel:6175333190" style="color: #FF6B35; font-weight: 600;">(617) 533-3190</a>
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

// V2 Base wrapper for consistent header/footer
function v2Wrapper(content: string, bannerText: string = 'Already using Toast? Then you\'re pre-qualified for funding in minutes!'): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FF6B35;">
    <tr><td style="padding: 12px 20px; text-align: center;"><p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 500;">${bannerText}</p></td></tr>
  </table>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
    <tr><td align="center" style="padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
          <tr><td style="padding: 32px 40px 24px; border-bottom: 1px solid #e5e7eb;"><img src="${LOGO_URL}" alt="Toast Capital" width="180" style="display: block;"></td></tr>
          <tr><td style="padding: 40px;">${content}</td></tr>
          <tr><td style="padding: 32px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td><p style="margin: 0 0 8px; color: #374151; font-size: 14px; font-weight: 600;">Questions? Call Us!</p><a href="tel:6175333190" style="color: #1f2937; font-size: 18px; font-weight: 700; text-decoration: none;">617-533-3190</a></td>
                  <td style="text-align: right;"><a href="https://toastcap.com/quote" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 6px; text-decoration: none;">GET STARTED</a></td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; color: #9ca3af; font-size: 12px;">Toast Capital | 333 Summer Street, Boston, MA 02210</p>
          </td></tr>
        </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// V2 Email 1: Approved - Green success theme with checkmark
function getV2ApprovedEmail(firstName: string, businessName: string): string {
  return v2Wrapper(`
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); border-radius: 50%; line-height: 80px; margin-bottom: 16px;">
        <span style="font-size: 40px; color: white;">✓</span>
      </div>
    </div>
    <p style="margin: 0 0 8px; color: #22C55E; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-align: center;">CONGRATULATIONS!</p>
    <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 28px; font-weight: 700; text-align: center;">You've Been Approved, ${firstName}!</h1>
    <p style="margin: 0 0 28px; color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">
      Great news! <strong style="color: #1f2937;">${businessName}</strong> has been pre-approved for funding based on your Toast POS performance.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px; background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border: 2px solid #22C55E; border-radius: 16px;">
      <tr><td style="padding: 32px; text-align: center;">
          <p style="margin: 0 0 8px; color: #166534; font-size: 14px; font-weight: 600;">PRE-APPROVED AMOUNT</p>
          <p style="margin: 0 0 16px; color: #15803D; font-size: 42px; font-weight: 700;">Up to $250K</p>
          <p style="margin: 0; color: #166534; font-size: 14px;">Funds available as soon as tomorrow</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center"><a href="https://toastcap.com/quote" style="display: inline-block; background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); color: #ffffff; font-weight: 600; font-size: 18px; padding: 18px 50px; border-radius: 10px; text-decoration: none;">View My Approval →</a></td></tr>
    </table>
  `, 'Congratulations! You\'ve been approved for Toast Capital funding!');
}

// V2 Email 2: Unlocked - Gold/premium unlock theme
function getV2UnlockedEmail(firstName: string, businessName: string): string {
  return v2Wrapper(`
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border: 2px solid #F59E0B; border-radius: 12px;">
        <span style="font-size: 32px;">🔓</span>
        <span style="font-size: 18px; color: #92400E; font-weight: 700; margin-left: 8px;">UNLOCKED</span>
      </div>
    </div>
    <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 28px; font-weight: 700; text-align: center;">Better Terms Now Available!</h1>
    <p style="margin: 0 0 28px; color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">
      ${firstName}, we've <strong style="color: #F59E0B;">unlocked improved terms</strong> for ${businessName}. Your consistent performance has earned you access to better rates.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
      <tr>
        <td style="width: 50%; padding: 20px; text-align: center; background-color: #FEF3C7; border-radius: 12px 0 0 12px; border: 1px solid #F59E0B;">
          <p style="margin: 0; color: #92400E; font-size: 12px; font-weight: 600;">BEFORE</p>
          <p style="margin: 8px 0 0; color: #B45309; font-size: 24px; font-weight: 700; text-decoration: line-through;">Standard Rate</p>
        </td>
        <td style="width: 50%; padding: 20px; text-align: center; background-color: #ECFDF5; border-radius: 0 12px 12px 0; border: 1px solid #22C55E;">
          <p style="margin: 0; color: #166534; font-size: 12px; font-weight: 600;">NOW</p>
          <p style="margin: 8px 0 0; color: #15803D; font-size: 24px; font-weight: 700;">Lower Rate!</p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center"><a href="https://toastcap.com/quote" style="display: inline-block; background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: #ffffff; font-weight: 600; font-size: 18px; padding: 18px 50px; border-radius: 10px; text-decoration: none;">See My New Terms →</a></td></tr>
    </table>
  `, '[UNLOCKED] Special terms now available for your business!');
}

// V2 Email 3: Better Terms - Comparison chart
function getV2BetterTermsEmail(firstName: string, businessName: string): string {
  return v2Wrapper(`
    <p style="margin: 0 0 8px; color: #059669; font-size: 12px; font-weight: 600; letter-spacing: 1px;">UPGRADED TERMS</p>
    <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 28px; font-weight: 700;">Why Toast Capital Beats the Competition</h1>
    <p style="margin: 0 0 28px; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi ${firstName}, see how ${businessName} can benefit from our upgraded terms versus traditional lenders:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
      <tr style="background-color: #1E3A8A;">
        <td style="padding: 12px 16px; color: #ffffff; font-weight: 600; font-size: 13px;">Feature</td>
        <td style="padding: 12px 16px; color: #ffffff; font-weight: 600; font-size: 13px; text-align: center;">Toast Capital</td>
        <td style="padding: 12px 16px; color: #ffffff; font-weight: 600; font-size: 13px; text-align: center;">Others</td>
      </tr>
      <tr style="background-color: #f9fafb;">
        <td style="padding: 12px 16px; color: #374151; font-size: 14px;">Funding Speed</td>
        <td style="padding: 12px 16px; text-align: center;"><span style="color: #22C55E; font-weight: 700;">24 Hours</span></td>
        <td style="padding: 12px 16px; text-align: center; color: #9ca3af;">1-2 Weeks</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #374151; font-size: 14px;">Credit Check</td>
        <td style="padding: 12px 16px; text-align: center;"><span style="color: #22C55E; font-weight: 700;">Soft Pull</span></td>
        <td style="padding: 12px 16px; text-align: center; color: #9ca3af;">Hard Pull</td>
      </tr>
      <tr style="background-color: #f9fafb;">
        <td style="padding: 12px 16px; color: #374151; font-size: 14px;">Collateral</td>
        <td style="padding: 12px 16px; text-align: center;"><span style="color: #22C55E; font-weight: 700;">None</span></td>
        <td style="padding: 12px 16px; text-align: center; color: #9ca3af;">Required</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #374151; font-size: 14px;">Early Payoff</td>
        <td style="padding: 12px 16px; text-align: center;"><span style="color: #22C55E; font-weight: 700;">No Penalty</span></td>
        <td style="padding: 12px 16px; text-align: center; color: #9ca3af;">Fees Apply</td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center"><a href="https://toastcap.com/quote" style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: 600; font-size: 18px; padding: 18px 50px; border-radius: 10px; text-decoration: none;">Get Better Terms →</a></td></tr>
    </table>
  `, 'Compare Toast Capital to traditional lenders - see the difference!');
}

// V2 Email 4: Special Access - VIP exclusive theme
function getV2SpecialAccessEmail(firstName: string, businessName: string): string {
  return v2Wrapper(`
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 8px 24px; background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); border-radius: 24px;">
        <span style="color: #ffffff; font-size: 14px; font-weight: 600;">⭐ VIP ACCESS ⭐</span>
      </div>
    </div>
    <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 28px; font-weight: 700; text-align: center;">You've Unlocked Special Access, ${firstName}!</h1>
    <p style="margin: 0 0 28px; color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">
      As a valued Toast customer, <strong style="color: #1E3A8A;">${businessName}</strong> has been granted exclusive access to our premium funding tier.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px; background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border: 2px solid #3B82F6; border-radius: 16px;">
      <tr><td style="padding: 24px; text-align: center;">
          <p style="margin: 0 0 16px; color: #1E3A8A; font-size: 14px; font-weight: 600;">YOUR EXCLUSIVE BENEFITS</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width: 33%; padding: 12px; text-align: center;">
                <p style="margin: 0 0 4px; font-size: 28px;">💰</p>
                <p style="margin: 0; color: #1E3A8A; font-size: 20px; font-weight: 700;">$2M Max</p>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">Funding Limit</p>
              </td>
              <td style="width: 33%; padding: 12px; text-align: center; border-left: 1px solid #BFDBFE; border-right: 1px solid #BFDBFE;">
                <p style="margin: 0 0 4px; font-size: 28px;">⚡</p>
                <p style="margin: 0; color: #1E3A8A; font-size: 20px; font-weight: 700;">Same Day</p>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">Funding Speed</p>
              </td>
              <td style="width: 33%; padding: 12px; text-align: center;">
                <p style="margin: 0 0 4px; font-size: 28px;">📞</p>
                <p style="margin: 0; color: #1E3A8A; font-size: 20px; font-weight: 700;">Dedicated</p>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">Rep</p>
              </td>
            </tr>
          </table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center"><a href="https://toastcap.com/quote" style="display: inline-block; background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); color: #ffffff; font-weight: 600; font-size: 18px; padding: 18px 50px; border-radius: 10px; text-decoration: none;">Access My VIP Offer →</a></td></tr>
    </table>
  `, 'You\'ve been selected for VIP access to Toast Capital!');
}

// V2 Email 5: Invited - Clean invitation style
function getV2InvitedEmail(firstName: string, businessName: string): string {
  return v2Wrapper(`
    <div style="text-align: center; margin-bottom: 32px;">
      <p style="margin: 0; color: #6b7280; font-size: 14px; font-style: italic;">You're Cordially Invited</p>
      <div style="width: 60px; height: 2px; background: linear-gradient(90deg, transparent, #1f2937, transparent); margin: 16px auto;"></div>
    </div>
    <h1 style="margin: 0 0 24px; color: #1f2937; font-size: 32px; font-weight: 700; text-align: center;">Apply for a Toast Capital Loan</h1>
    <p style="margin: 0 0 32px; color: #4b5563; font-size: 16px; line-height: 1.8; text-align: center;">
      Dear ${firstName},<br><br>
      Based on the performance of <strong>${businessName}</strong>, we would like to extend an invitation to apply for funding through Toast Capital's exclusive lending program.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px; background-color: #f9fafb; border-radius: 12px; padding: 24px;">
      <tr><td style="padding: 24px;">
          <p style="margin: 0 0 16px; color: #374151; font-size: 15px; line-height: 1.6;"><span style="color: #22C55E; font-weight: 700;">✓</span> No application fee</p>
          <p style="margin: 0 0 16px; color: #374151; font-size: 15px; line-height: 1.6;"><span style="color: #22C55E; font-weight: 700;">✓</span> No commitment required</p>
          <p style="margin: 0 0 16px; color: #374151; font-size: 15px; line-height: 1.6;"><span style="color: #22C55E; font-weight: 700;">✓</span> No impact on your credit</p>
          <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;"><span style="color: #22C55E; font-weight: 700;">✓</span> Funds as fast as next business day</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center"><a href="https://toastcap.com/quote" style="display: inline-block; background-color: #1f2937; color: #ffffff; font-weight: 600; font-size: 18px; padding: 18px 50px; border-radius: 10px; text-decoration: none;">Accept Invitation →</a></td></tr>
    </table>
  `, 'You\'ve been personally invited to apply for Toast Capital');
}

// V2 Email 6: Limited Time - Urgency theme with countdown
function getV2LimitedTimeEmail(firstName: string, businessName: string): string {
  return v2Wrapper(`
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 12px 24px; background-color: #FEE2E2; border: 2px solid #DC2626; border-radius: 8px;">
        <span style="color: #DC2626; font-size: 14px; font-weight: 700;">⏰ LIMITED TIME OFFER</span>
      </div>
    </div>
    <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 28px; font-weight: 700; text-align: center;">Don't Miss This Opportunity, ${firstName}!</h1>
    <p style="margin: 0 0 28px; color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">
      This exclusive offer for <strong style="color: #DC2626;">${businessName}</strong> won't last forever. Lock in your rate today.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px; background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%); border: 2px dashed #DC2626; border-radius: 12px;">
      <tr><td style="padding: 24px; text-align: center;">
          <p style="margin: 0 0 8px; color: #DC2626; font-size: 14px; font-weight: 600;">SPECIAL RATE AVAILABLE</p>
          <p style="margin: 0 0 8px; color: #991B1B; font-size: 36px; font-weight: 700;">Funding Ready</p>
          <p style="margin: 0; color: #B91C1C; font-size: 14px;">Apply now before this offer expires</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
      <tr><td align="center"><a href="https://toastcap.com/quote" style="display: inline-block; background-color: #DC2626; color: #ffffff; font-weight: 600; font-size: 18px; padding: 18px 50px; border-radius: 10px; text-decoration: none;">Claim My Offer Now →</a></td></tr>
    </table>
    <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">This offer is time-sensitive. Don't wait!</p>
  `, '⏰ Limited time offer - don\'t miss out on this opportunity!');
}

// V2 Email 7: Quick Question - Conversational style
function getV2QuestionEmail(firstName: string, businessName: string): string {
  return v2Wrapper(`
    <h1 style="margin: 0 0 24px; color: #1f2937; font-size: 28px; font-weight: 700;">Quick question for you, ${firstName}...</h1>
    <p style="margin: 0 0 20px; color: #4b5563; font-size: 18px; line-height: 1.7;">
      If ${businessName} had access to an extra <strong style="color: #1E3A8A;">$50,000 - $250,000</strong> right now, what would you do with it?
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
      <tr>
        <td style="padding: 16px; background-color: #f0f9ff; border-left: 4px solid #3B82F6; border-radius: 0 8px 8px 0; margin-bottom: 12px;">
          <p style="margin: 0; color: #374151; font-size: 15px;">💼 Expand to a new location?</p>
        </td>
      </tr>
      <tr><td style="height: 12px;"></td></tr>
      <tr>
        <td style="padding: 16px; background-color: #f0fdf4; border-left: 4px solid #22C55E; border-radius: 0 8px 8px 0; margin-bottom: 12px;">
          <p style="margin: 0; color: #374151; font-size: 15px;">🛠️ Upgrade equipment?</p>
        </td>
      </tr>
      <tr><td style="height: 12px;"></td></tr>
      <tr>
        <td style="padding: 16px; background-color: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 0 8px 8px 0; margin-bottom: 12px;">
          <p style="margin: 0; color: #374151; font-size: 15px;">👥 Hire more staff?</p>
        </td>
      </tr>
      <tr><td style="height: 12px;"></td></tr>
      <tr>
        <td style="padding: 16px; background-color: #fdf2f8; border-left: 4px solid #EC4899; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; color: #374151; font-size: 15px;">📈 Marketing & growth?</p>
        </td>
      </tr>
    </table>
    <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Whatever your goals, Toast Capital can help make them happen. Check your offer in 60 seconds.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center"><a href="https://toastcap.com/quote" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 18px; padding: 18px 50px; border-radius: 10px; text-decoration: none;">See What You Qualify For →</a></td></tr>
    </table>
  `, 'Quick question about growing your business...');
}

// V2 Email 8: Fuel Growth - Chart/growth visual theme
function getV2GrowthEmail(firstName: string, businessName: string): string {
  return v2Wrapper(`
    <p style="margin: 0 0 8px; color: #FF6B35; font-size: 12px; font-weight: 600; letter-spacing: 1px;">FUEL YOUR NEXT CHAPTER</p>
    <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 28px; font-weight: 700;">What Could ${businessName} Accomplish?</h1>
    <p style="margin: 0 0 28px; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi ${firstName}, Toast restaurants like yours have used funding to achieve incredible growth:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
      <tr>
        <td style="width: 33%; padding: 16px; text-align: center; background-color: #f9fafb; border-radius: 12px 0 0 12px;">
          <p style="margin: 0 0 8px; font-size: 36px; color: #FF6B35; font-weight: 700;">32%</p>
          <p style="margin: 0; color: #6b7280; font-size: 12px;">Avg Revenue<br>Increase</p>
        </td>
        <td style="width: 33%; padding: 16px; text-align: center; background-color: #f0f9ff;">
          <p style="margin: 0 0 8px; font-size: 36px; color: #3B82F6; font-weight: 700;">2.5x</p>
          <p style="margin: 0; color: #6b7280; font-size: 12px;">ROI on<br>Equipment</p>
        </td>
        <td style="width: 33%; padding: 16px; text-align: center; background-color: #f0fdf4; border-radius: 0 12px 12px 0;">
          <p style="margin: 0 0 8px; font-size: 36px; color: #22C55E; font-weight: 700;">85%</p>
          <p style="margin: 0; color: #6b7280; font-size: 12px;">Customer<br>Satisfaction</p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px; background-color: #FFF7ED; border-radius: 12px; border: 1px solid #FDBA74;">
      <tr><td style="padding: 20px; text-align: center;">
          <p style="margin: 0 0 8px; color: #9A3412; font-size: 14px; font-weight: 600;">YOUR POTENTIAL FUNDING</p>
          <p style="margin: 0; color: #EA580C; font-size: 32px; font-weight: 700;">$2,000 - $2,000,000</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center"><a href="https://toastcap.com/quote" style="display: inline-block; background-color: #FF6B35; color: #ffffff; font-weight: 600; font-size: 18px; padding: 18px 50px; border-radius: 10px; text-decoration: none;">Fuel My Growth →</a></td></tr>
    </table>
  `, 'See what other Toast restaurants have achieved with capital');
}

// V2 Email 9: Growth Potential - Breakthrough theme
function getV2PotentialEmail(firstName: string, businessName: string): string {
  return v2Wrapper(`
    <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 28px; font-weight: 700;">What's Holding ${businessName} Back?</h1>
    <p style="margin: 0 0 28px; color: #4b5563; font-size: 16px; line-height: 1.6;">
      ${firstName}, every restaurant hits a ceiling at some point. The question is: what's yours?
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px; background-color: #FEE2E2; border-radius: 12px 12px 0 0; border-left: 4px solid #DC2626;">
          <p style="margin: 0; color: #991B1B; font-size: 16px; font-weight: 600;">❌ Common Obstacles</p>
          <p style="margin: 8px 0 0; color: #7F1D1D; font-size: 14px;">Outdated equipment • Staffing constraints • Cash flow gaps • Limited marketing</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; background-color: #DCFCE7; border-radius: 0 0 12px 12px; border-left: 4px solid #22C55E;">
          <p style="margin: 0; color: #166534; font-size: 16px; font-weight: 600;">✓ Toast Capital Solution</p>
          <p style="margin: 8px 0 0; color: #15803D; font-size: 14px;">$2K-$2M funding • Next-day access • Flexible terms • No collateral</p>
        </td>
      </tr>
    </table>
    <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">
      <strong style="color: #FF6B35;">Break through your ceiling.</strong> See what you qualify for in seconds.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center"><a href="https://toastcap.com/quote" style="display: inline-block; background-color: #FF6B35; color: #ffffff; font-weight: 600; font-size: 18px; padding: 18px 50px; border-radius: 10px; text-decoration: none;">Unlock My Potential →</a></td></tr>
    </table>
  `, 'Break through your business ceiling with Toast Capital');
}

// V2 Email 10: 60 Seconds - Speed/timer theme
function getV2_60SecEmail(firstName: string, businessName: string): string {
  return v2Wrapper(`
    <div style="text-align: center; margin-bottom: 28px;">
      <div style="display: inline-block; width: 100px; height: 100px; background: linear-gradient(135deg, #3B82F6 0%, #1E3A8A 100%); border-radius: 50%; position: relative;">
        <p style="margin: 0; line-height: 100px; color: #ffffff; font-size: 32px; font-weight: 700;">60s</p>
      </div>
    </div>
    <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 28px; font-weight: 700; text-align: center;">See Your Funding Offer in 60 Seconds</h1>
    <p style="margin: 0 0 28px; color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">
      ${firstName}, it literally takes less than a minute to see what ${businessName} qualifies for. Here's how simple it is:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
      <tr>
        <td style="width: 33%; padding: 16px; text-align: center;">
          <div style="display: inline-block; width: 48px; height: 48px; background-color: #DBEAFE; border-radius: 50%; line-height: 48px; margin-bottom: 12px;">
            <span style="color: #1E3A8A; font-weight: 700;">1</span>
          </div>
          <p style="margin: 0; color: #374151; font-size: 14px; font-weight: 600;">Enter Info</p>
          <p style="margin: 4px 0 0; color: #9ca3af; font-size: 12px;">15 seconds</p>
        </td>
        <td style="width: 33%; padding: 16px; text-align: center;">
          <div style="display: inline-block; width: 48px; height: 48px; background-color: #DBEAFE; border-radius: 50%; line-height: 48px; margin-bottom: 12px;">
            <span style="color: #1E3A8A; font-weight: 700;">2</span>
          </div>
          <p style="margin: 0; color: #374151; font-size: 14px; font-weight: 600;">We Review</p>
          <p style="margin: 4px 0 0; color: #9ca3af; font-size: 12px;">30 seconds</p>
        </td>
        <td style="width: 33%; padding: 16px; text-align: center;">
          <div style="display: inline-block; width: 48px; height: 48px; background-color: #DCFCE7; border-radius: 50%; line-height: 48px; margin-bottom: 12px;">
            <span style="color: #22C55E; font-weight: 700;">3</span>
          </div>
          <p style="margin: 0; color: #374151; font-size: 14px; font-weight: 600;">See Offer</p>
          <p style="margin: 4px 0 0; color: #9ca3af; font-size: 12px;">15 seconds</p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center"><a href="https://toastcap.com/quote" style="display: inline-block; background: linear-gradient(135deg, #3B82F6 0%, #1E3A8A 100%); color: #ffffff; font-weight: 600; font-size: 18px; padding: 18px 50px; border-radius: 10px; text-decoration: none;">Start My 60 Seconds →</a></td></tr>
    </table>
  `, 'Just 60 seconds to see your funding offer!');
}

// V2 Email 11: Seasonal - Calendar/season theme
function getV2SeasonalEmail(firstName: string, businessName: string): string {
  return v2Wrapper(`
    <p style="margin: 0 0 8px; color: #059669; font-size: 12px; font-weight: 600; letter-spacing: 1px;">PREPARE FOR YOUR BUSIEST SEASON</p>
    <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 28px; font-weight: 700;">Peak Season is Coming. Is ${businessName} Ready?</h1>
    <p style="margin: 0 0 28px; color: #4b5563; font-size: 16px; line-height: 1.6;">
      ${firstName}, the busiest time of year is approaching. Smart restaurant owners prepare NOW by:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border-radius: 12px;">
      <tr><td style="padding: 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding: 8px 0;"><span style="color: #22C55E; font-size: 18px; margin-right: 12px;">📦</span><span style="color: #374151; font-size: 15px;">Stocking up on inventory</span></td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><span style="color: #22C55E; font-size: 18px; margin-right: 12px;">👥</span><span style="color: #374151; font-size: 15px;">Hiring seasonal staff</span></td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><span style="color: #22C55E; font-size: 18px; margin-right: 12px;">🔧</span><span style="color: #374151; font-size: 15px;">Upgrading equipment</span></td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><span style="color: #22C55E; font-size: 18px; margin-right: 12px;">📢</span><span style="color: #374151; font-size: 15px;">Boosting marketing efforts</span></td>
            </tr>
          </table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #f9fafb; border-radius: 12px;">
          <p style="margin: 0 0 4px; color: #6b7280; font-size: 13px;">GET FUNDING UP TO</p>
          <p style="margin: 0; color: #059669; font-size: 36px; font-weight: 700;">$2,000,000</p>
          <p style="margin: 8px 0 0; color: #9ca3af; font-size: 13px;">Funds available as fast as tomorrow</p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center"><a href="https://toastcap.com/quote" style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: 600; font-size: 18px; padding: 18px 50px; border-radius: 10px; text-decoration: none;">Prepare for Peak Season →</a></td></tr>
    </table>
  `, 'Get ready for your busiest season with Toast Capital funding!');
}
