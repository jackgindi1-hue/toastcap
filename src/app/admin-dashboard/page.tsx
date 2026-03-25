'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Mail, LogOut, Lock, Copy, Check, Globe, Wrench, GitBranch, ExternalLink, Users, Megaphone, BarChart3, FileCheck, Upload } from 'lucide-react';
import LeadsTab from '@/components/admin/LeadsTab';
import BulkMessagingTab from '@/components/admin/BulkMessagingTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import DocumentChecklist from '@/components/admin/DocumentChecklist';
import LeadImportTab from '@/components/admin/LeadImportTab';

// Referral Banner Image URL - IMPORTANT: Upload the banner image to public folder or use hosted URL
// For production emails, use an absolute URL that email clients can load

// ============================================================================
// EMAIL 1: Quote Confirmation (Step 1) - Triggered after /quote
// ============================================================================
function getQuoteConfirmationEmail(firstName: string, businessName: string) {
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

// ============================================================================
// EMAIL 2: Application Submitted (Step 2) - Triggered after /upload
// ============================================================================
function getBankStatementsEmail(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - Application Submitted</title>
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
                Application Submitted!
              </h1>
              <p style="margin: 0 0 32px; color: #6b7280; font-size: 16px; text-align: center; line-height: 1.5;">
                Great progress, ${firstName}! You're almost there.
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
                          <div style="width: 40px; height: 3px; background-color: #FF6B35;"></div>
                        </td>
                        <td style="text-align: center; padding: 0 8px;">
                          <div style="width: 40px; height: 40px; background-color: #FF6B35; border-radius: 50%; margin: 0 auto 8px; line-height: 40px; color: #ffffff; font-weight: bold; font-size: 16px;">✓</div>
                          <p style="margin: 0; font-size: 11px; color: #FF6B35; font-weight: 600;">COMPLETE</p>
                          <p style="margin: 4px 0 0; font-size: 12px; color: #374151;">Application</p>
                        </td>
                        <td style="padding: 0 4px; vertical-align: top; padding-top: 18px;">
                          <div style="width: 40px; height: 3px; background-color: #e5e7eb;"></div>
                        </td>
                        <td style="text-align: center; padding: 0 8px;">
                          <div style="width: 40px; height: 40px; background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 50%; margin: 0 auto 8px; line-height: 36px; color: #D97706; font-weight: bold; font-size: 16px;">3</div>
                          <p style="margin: 0; font-size: 11px; color: #D97706; font-weight: 600;">FINAL STEP</p>
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
                    <p style="margin: 0; color: #15803D; font-size: 14px;">Your verification has been completed successfully</p>
                  </td>
                </tr>
              </table>

              <!-- Next Step Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 4px; color: #92400E; font-size: 14px; font-weight: 600;">→ Final Step Required:</p>
                    <p style="margin: 0; color: #B45309; font-size: 14px;">Upload your bank statements (3 months), Driver's License, and Void Check</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/dlvc" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      Upload Documents →
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

// ============================================================================
// EMAIL 3: Application Complete (Step 3) - Triggered after /dlvc
// ============================================================================
function getDLVCCompleteEmail(firstName: string, businessName: string) {
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
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFF7ED; border: 1px solid #FDBA74; border-radius: 8px; margin-bottom: 24px;">
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
                    <p style="margin: 0; color: #1E3A8A; font-size: 14px;"><strong>3.</strong> Sign your contract and receive your funds</p>
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

// ============================================================================
// DRIP EMAIL 1: Fast, Easy, Flexible (5 minutes after signup)
// ============================================================================
function getDripEmail1(firstName: string, businessName: string) {
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

          <!-- Feature Image -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <img src="https://ext.same-assets.com/2820641348/331200746.avif" alt="Restaurant owner" width="520" style="display: block; width: 100%; max-width: 520px; height: auto; border-radius: 12px;">
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
function getDripEmail2(firstName: string, businessName: string) {
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

          <!-- Feature Image -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <img src="https://ext.same-assets.com/2820641348/1278487560.avif" alt="Fast funding" width="520" style="display: block; width: 100%; max-width: 520px; height: auto; border-radius: 12px;">
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
function getDripEmail3(firstName: string, businessName: string) {
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

          <!-- Feature Image -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <img src="https://ext.same-assets.com/2820641348/331200746.avif" alt="Industry expertise" width="520" style="display: block; width: 100%; max-width: 520px; height: auto; border-radius: 12px;">
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

// ============================================================================
// COLD OUTREACH EMAIL 1: You've Been Approved
// ============================================================================
function getColdEmail1(firstName: string, businessName: string) {
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

          <!-- Logo Header -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
              <img src="https://toastcapital.com/toast-capital-logo.png" alt="Toast Capital" width="200" style="display: block; margin: 0 auto; max-width: 200px; height: auto;">
            </td>
          </tr>

          <!-- Congratulations Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF6B35 0%, #FF8F5E 100%); padding: 24px 40px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px;">CONGRATULATIONS!</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 26px; font-weight: 700; line-height: 1.3;">
                ${firstName}, You've Been Approved for a Toast Lending Offer!
              </h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                I'm reaching out from Toast Capital. Based on your recent revenue processed through your Toast POS, <strong style="color: #1f2937;">${businessName}</strong> has been approved for funding!
              </p>

              <!-- Approval Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F0FDF4; border: 2px solid #22C55E; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #166534; font-size: 14px; font-weight: 600;">YOUR PRE-APPROVED AMOUNT</p>
                    <p style="margin: 0 0 8px; color: #15803D; font-size: 36px; font-weight: 700;">Up to $250,000</p>
                    <p style="margin: 0; color: #166534; font-size: 14px;">Based on your Toast POS revenue</p>
                  </td>
                </tr>
              </table>

              <!-- Key Benefits -->
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

              <!-- CTA Button -->
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
// COLD OUTREACH EMAIL 2: You've Unlocked Special Access
// ============================================================================
function getColdEmail2(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - You've Unlocked Special Access</title>
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

          <!-- Unlock Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); padding: 24px 40px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px;">EXCLUSIVE ACCESS UNLOCKED</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 26px; font-weight: 700; line-height: 1.3;">
                ${firstName}, You've Unlocked a Special Funding Offer!
              </h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Great news! As a valued Toast customer, <strong style="color: #1f2937;">${businessName}</strong> has unlocked exclusive access to Toast Capital funding based on your POS performance.
              </p>

              <!-- Unlocked Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #EFF6FF; border: 2px solid #3B82F6; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="text-align: center; padding-bottom: 16px;">
                          <p style="margin: 0; color: #1E40AF; font-size: 18px; font-weight: 700;">What You've Unlocked:</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
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
                  </td>
                </tr>
              </table>

              <!-- Why Check Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFF7ED; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 12px; color: #9A3412; font-size: 15px; font-weight: 600;">Why check your offer?</p>
                    <p style="margin: 0; color: #C2410C; font-size: 14px; line-height: 1.6;">
                      Most owners like to see what they're approved for—even if they don't need capital today. It's like checking your credit score: <strong>useful information with zero risk.</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Zero Risk List -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #22C55E; font-size: 16px; margin-right: 8px;">●</span>
                    <span style="color: #374151; font-size: 15px;">No cost to apply</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #22C55E; font-size: 16px; margin-right: 8px;">●</span>
                    <span style="color: #374151; font-size: 15px;">No obligation to accept funding</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #22C55E; font-size: 16px; margin-right: 8px;">●</span>
                    <span style="color: #374151; font-size: 15px;">No impact on your personal credit score</span>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      Check My Offer →
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

// ============================================================================
// COLD OUTREACH EMAIL 3: You've Been Invited
// ============================================================================
function getColdEmail3(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - You've Been Invited</title>
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
              <p style="margin: 0 0 16px; color: #6b7280; font-size: 15px;">
                Hi ${firstName},
              </p>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 15px; line-height: 1.6;">
                I'm reaching out from <strong style="color: #1f2937;">Toast Capital</strong>.
              </p>

              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 26px; font-weight: 700; line-height: 1.3;">
                You've been invited to apply for a Toast Capital Loan
              </h1>

              <p style="margin: 0 0 24px; color: #6b7280; font-size: 15px; line-height: 1.6;">
                Based on your recent revenue processed through your Toast POS, <strong style="color: #1f2937;">${businessName}</strong> has been pre-selected for our exclusive lending program.
              </p>

              <!-- Invitation Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 32px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px; font-weight: 600; letter-spacing: 1px;">YOU'RE INVITED TO ACCESS</p>
                    <p style="margin: 0 0 4px; color: #ffffff; font-size: 32px; font-weight: 700;">Up to $2,000,000</p>
                    <p style="margin: 0; color: #9ca3af; font-size: 14px;">in business funding</p>
                  </td>
                </tr>
              </table>

              <!-- Personal Message -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px; background-color: #f9fafb; border-left: 4px solid #FF6B35; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0 0 12px; color: #374151; font-size: 15px; line-height: 1.6;">
                      <strong>Why check your offer?</strong> Most restaurant owners like to see what they're approved for, even if they don't need capital today.
                    </p>
                    <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">
                      Think of it as a financial health check—<strong>with zero downside:</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Benefits Grid -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="width: 33.33%; padding: 12px; text-align: center; vertical-align: top;">
                    <div style="width: 48px; height: 48px; background-color: #F0FDF4; border-radius: 50%; margin: 0 auto 8px; line-height: 48px;">
                      <span style="color: #22C55E; font-size: 24px;">$0</span>
                    </div>
                    <p style="margin: 0; color: #374151; font-size: 13px; font-weight: 600;">No Cost</p>
                    <p style="margin: 4px 0 0; color: #6b7280; font-size: 12px;">Free to apply</p>
                  </td>
                  <td style="width: 33.33%; padding: 12px; text-align: center; vertical-align: top;">
                    <div style="width: 48px; height: 48px; background-color: #EFF6FF; border-radius: 50%; margin: 0 auto 8px; line-height: 48px;">
                      <span style="color: #1E3A8A; font-size: 20px;">0%</span>
                    </div>
                    <p style="margin: 0; color: #374151; font-size: 13px; font-weight: 600;">No Obligation</p>
                    <p style="margin: 4px 0 0; color: #6b7280; font-size: 12px;">Decline anytime</p>
                  </td>
                  <td style="width: 33.33%; padding: 12px; text-align: center; vertical-align: top;">
                    <div style="width: 48px; height: 48px; background-color: #FFF7ED; border-radius: 50%; margin: 0 auto 8px; line-height: 48px;">
                      <span style="color: #FF6B35; font-size: 20px;">0</span>
                    </div>
                    <p style="margin: 0; color: #374151; font-size: 13px; font-weight: 600;">No Credit Impact</p>
                    <p style="margin: 4px 0 0; color: #6b7280; font-size: 12px;">Soft pull only</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #FF6B35; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      Accept Invitation →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px; color: #9ca3af; font-size: 13px; text-align: center;">
                Takes less than 2 minutes to see your offer
              </p>

              <!-- Signature -->
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

// ============================================================================
// COLD OUTREACH EMAIL 4: Limited Time Offer
// ============================================================================
function getColdEmail4(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - Limited Time Offer</title>
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
            <td style="background-color: #DC2626; padding: 16px 40px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px;">LIMITED TIME: SPECIAL RATES AVAILABLE</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 26px; font-weight: 700; line-height: 1.3;">
                ${firstName}, Don't Miss Out on This Opportunity
              </h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Toast Capital is offering <strong style="color: #DC2626;">special rates</strong> for qualified Toast merchants this month. Based on your POS activity, <strong style="color: #1f2937;">${businessName}</strong> may qualify.
              </p>

              <!-- Countdown Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FEF2F2; border: 2px solid #DC2626; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #991B1B; font-size: 14px; font-weight: 600;">THIS MONTH ONLY</p>
                    <p style="margin: 0 0 8px; color: #DC2626; font-size: 28px; font-weight: 700;">Reduced Fees + Faster Approval</p>
                    <p style="margin: 0; color: #991B1B; font-size: 14px;">Check your pre-qualified amount before rates change</p>
                  </td>
                </tr>
              </table>

              <!-- Benefits -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #f9fafb; border-radius: 8px;">
                    <p style="margin: 0 0 12px; color: #1f2937; font-size: 15px; font-weight: 600;">Why act now?</p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 4px 0; color: #374151; font-size: 14px;">
                          <span style="color: #DC2626; margin-right: 8px;">→</span> Lower fixed fees for applications this month
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #374151; font-size: 14px;">
                          <span style="color: #DC2626; margin-right: 8px;">→</span> Priority processing (24-hour decisions)
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #374151; font-size: 14px;">
                          <span style="color: #DC2626; margin-right: 8px;">→</span> Funding as fast as same day
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Zero Risk -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #F0FDF4; border-radius: 8px; border: 1px solid #BBF7D0;">
                    <p style="margin: 0; color: #166534; font-size: 14px; text-align: center;">
                      <strong>Zero risk to check:</strong> No cost, no obligation, no credit impact
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #DC2626; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      Check My Special Rate →
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

// ============================================================================
// COLD OUTREACH EMAIL 5: Quick Question (Short & Personal)
// ============================================================================
function getColdEmail5(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - Quick Question</title>
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

          <!-- Main Content - Personal Letter Style -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #6b7280; font-size: 16px;">
                Hi ${firstName},
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.7;">
                Quick question for you:
              </p>

              <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 700; line-height: 1.4;">
                If you could access up to $250,000 for ${businessName} with no credit impact and no obligation... would you at least want to see the offer?
              </h1>

              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.7;">
                Most restaurant owners say yes. Even if you don't need capital right now, knowing what you qualify for is valuable information.
              </p>

              <!-- Simple Box -->
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

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      Yes, Show Me My Offer →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px; color: #9ca3af; font-size: 14px; text-align: center;">
                (No spam, no pressure, just your numbers)
              </p>

              <!-- Signature -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; color: #374151; font-size: 14px;">Talk soon,</p>
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

// ============================================================================
// COLD OUTREACH EMAIL 6: Growth & Expansion Focus
// ============================================================================
function getColdEmail6(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - Fuel Your Growth</title>
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

          <!-- Hero Image Section -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%); padding: 40px; text-align: center;">
              <p style="margin: 0 0 8px; color: #93C5FD; font-size: 14px; font-weight: 600; letter-spacing: 1px;">FUEL YOUR NEXT CHAPTER</p>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; line-height: 1.3;">
                What Could ${businessName} Accomplish With Extra Capital?
              </h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.7;">
                Hi ${firstName}, whether you're dreaming of a second location, upgrading your kitchen, hiring more staff, or just want a cash cushion for peace of mind — Toast Capital can help make it happen.
              </p>

              <!-- Use Cases Grid -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="width: 50%; padding: 12px; vertical-align: top;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFF7ED; border-radius: 8px; height: 100%;">
                      <tr>
                        <td style="padding: 16px; text-align: center;">
                          <p style="margin: 0 0 4px; font-size: 24px;">🏪</p>
                          <p style="margin: 0; color: #9A3412; font-size: 14px; font-weight: 600;">Open a New Location</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="width: 50%; padding: 12px; vertical-align: top;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F0FDF4; border-radius: 8px; height: 100%;">
                      <tr>
                        <td style="padding: 16px; text-align: center;">
                          <p style="margin: 0 0 4px; font-size: 24px;">🍳</p>
                          <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 600;">Upgrade Equipment</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="width: 50%; padding: 12px; vertical-align: top;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #EFF6FF; border-radius: 8px; height: 100%;">
                      <tr>
                        <td style="padding: 16px; text-align: center;">
                          <p style="margin: 0 0 4px; font-size: 24px;">👥</p>
                          <p style="margin: 0; color: #1E40AF; font-size: 14px; font-weight: 600;">Hire & Train Staff</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="width: 50%; padding: 12px; vertical-align: top;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FEF3C7; border-radius: 8px; height: 100%;">
                      <tr>
                        <td style="padding: 16px; text-align: center;">
                          <p style="margin: 0 0 4px; font-size: 24px;">📈</p>
                          <p style="margin: 0; color: #92400E; font-size: 14px; font-weight: 600;">Marketing & Growth</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Funding Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1f2937; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 4px; color: #9ca3af; font-size: 13px;">BASED ON YOUR TOAST REVENUE</p>
                    <p style="margin: 0 0 8px; color: #ffffff; font-size: 28px; font-weight: 700;">You May Qualify for Up to $500,000</p>
                    <p style="margin: 0; color: #9ca3af; font-size: 14px;">Funding available as fast as next business day</p>
                  </td>
                </tr>
              </table>

              <!-- No Risk -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 4px; color: #22C55E; font-size: 14px; font-weight: 600;">✓ No Cost</p>
                  </td>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 4px; color: #22C55E; font-size: 14px; font-weight: 600;">✓ No Obligation</p>
                  </td>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 4px; color: #22C55E; font-size: 14px; font-weight: 600;">✓ No Credit Impact</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #FF6B35; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      See What I Qualify For →
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

// ============================================================================
// COLD OUTREACH EMAIL 7: Your Restaurant's Growth Potential
// ============================================================================
function getColdEmail7(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - Your Growth Potential</title>
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
              <p style="margin: 0 0 16px; color: #6b7280; font-size: 15px;">
                Hi ${firstName},
              </p>

              <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 26px; font-weight: 700; line-height: 1.3;">
                What's holding ${businessName} back from its next level?
              </h1>

              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.7;">
                Every restaurant has that one thing they'd do if capital wasn't a barrier. What's yours?
              </p>

              <!-- Growth Opportunity Cards -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%); border-radius: 12px; border-left: 4px solid #FF6B35;">
                    <p style="margin: 0 0 4px; color: #9A3412; font-size: 16px; font-weight: 700;">Expand Your Space</p>
                    <p style="margin: 0; color: #C2410C; font-size: 14px;">Patio seating, private dining room, or a second location</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border-radius: 12px; border-left: 4px solid #22C55E;">
                    <p style="margin: 0 0 4px; color: #166534; font-size: 16px; font-weight: 700;">Upgrade Your Kitchen</p>
                    <p style="margin: 0; color: #15803D; font-size: 14px;">New equipment that speeds up service and reduces waste</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border-radius: 12px; border-left: 4px solid #1E3A8A;">
                    <p style="margin: 0 0 4px; color: #1E40AF; font-size: 16px; font-weight: 700;">Build Your Team</p>
                    <p style="margin: 0; color: #1E3A8A; font-size: 14px;">Hire key staff and invest in training that pays dividends</p>
                  </td>
                </tr>
              </table>

              <!-- Funding Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1f2937; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 4px; color: #9ca3af; font-size: 13px;">BASED ON YOUR TOAST REVENUE, YOU MAY QUALIFY FOR</p>
                    <p style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">$25,000 - $500,000</p>
                  </td>
                </tr>
              </table>

              <!-- Zero Risk -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #f9fafb; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; color: #374151; font-size: 14px;">
                      <span style="color: #22C55E; font-weight: bold;">Zero risk to check:</span> No cost, no obligation, no credit impact
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #FF6B35; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      See What I Qualify For →
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

// ============================================================================
// COLD OUTREACH EMAIL 8: 60 Seconds to See Your Offer (Super Short)
// ============================================================================
function getColdEmail8(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - 60 Second Offer</title>
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

          <!-- Main Content - Super Short -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #6b7280; font-size: 16px;">
                ${firstName},
              </p>

              <h1 style="margin: 0 0 24px; color: #1f2937; font-size: 32px; font-weight: 700; line-height: 1.2; text-align: center;">
                60 seconds.
              </h1>

              <p style="margin: 0 0 32px; color: #374151; font-size: 18px; line-height: 1.6; text-align: center;">
                That's all it takes to see if ${businessName} qualifies for up to <strong style="color: #FF6B35;">$500,000</strong> in funding.
              </p>

              <!-- Simple Benefits -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="text-align: center; padding: 8px;">
                    <span style="color: #22C55E; font-size: 18px;">✓</span>
                    <span style="color: #374151; font-size: 15px; margin-left: 8px;">No cost</span>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding: 8px;">
                    <span style="color: #22C55E; font-size: 18px;">✓</span>
                    <span style="color: #374151; font-size: 15px; margin-left: 8px;">No obligation</span>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding: 8px;">
                    <span style="color: #22C55E; font-size: 18px;">✓</span>
                    <span style="color: #374151; font-size: 15px; margin-left: 8px;">No credit impact</span>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 18px; padding: 18px 48px; border-radius: 8px; text-decoration: none;">
                      Check My Offer →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #9ca3af; font-size: 14px; text-align: center;">
                Seriously, that's it. 60 seconds.
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
// POST-DLVC DRIP EMAIL 1: Your Approval is Ready! (3 hours after DLVC)
// ============================================================================
function getPostDlvcDrip1(firstName: string, businessName: string) {
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
                \${firstName}, Great News! Your Funding is Approved!
              </h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                We've reviewed your documents for <strong style="color: #1f2937;">\${businessName}</strong> and you've been approved! Your funding agreement is ready for signature.
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
                      <tr><td style="padding: 4px 0; color: #1E3A8A; font-size: 14px;"><span style="margin-right: 8px;">1.</span> Check your phone - our funding specialist is calling you</td></tr>
                      <tr><td style="padding: 4px 0; color: #1E3A8A; font-size: 14px;"><span style="margin-right: 8px;">2.</span> Review and sign your funding agreement</td></tr>
                      <tr><td style="padding: 4px 0; color: #1E3A8A; font-size: 14px;"><span style="margin-right: 8px;">3.</span> Receive your funds as soon as the next business day!</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!-- Urgency Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px; text-align: center;">
                    <p style="margin: 0; color: #92400E; font-size: 15px; font-weight: 600;">Please answer your phone! We're calling from (617) 533-3190 to finalize your approval.</p>
                  </td>
                </tr>
              </table>
              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="tel:6175333190" style="display: inline-block; background-color: #22C55E; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">Call Us Now: (617) 533-3190</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">Missed our call? Call us back at <a href="tel:6175333190" style="color: #FF6B35; text-decoration: none; font-weight: 600;">(617) 533-3190</a></p>
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
</html>`.replace(/\$\{firstName\}/g, firstName).replace(/\$\{businessName\}/g, businessName);
}

// ============================================================================
// POST-DLVC DRIP EMAIL 2: Your Funding Agreement is Waiting (12 hours after DLVC)
// ============================================================================
function getPostDlvcDrip2(firstName: string, businessName: string) {
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
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 28px; font-weight: 700; line-height: 1.3;">\${firstName}, Your Funding Agreement is Still Waiting</h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">We tried reaching you earlier about your approved funding for <strong style="color: #1f2937;">\${businessName}</strong>. Your agreement is ready - let's get this completed so you can get your funds!</p>
              <!-- Status Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFF7ED; border: 2px solid #FF6B35; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr><td style="text-align: center;"><p style="margin: 0 0 12px; color: #9A3412; font-size: 14px; font-weight: 600;">YOUR APPLICATION STATUS</p></td></tr>
                      <tr><td style="padding: 8px 0;"><span style="display: inline-block; width: 24px; height: 24px; background-color: #22C55E; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 14px; margin-right: 12px;">✓</span><span style="color: #166534; font-size: 15px; font-weight: 600;">Documents Received</span></td></tr>
                      <tr><td style="padding: 8px 0;"><span style="display: inline-block; width: 24px; height: 24px; background-color: #22C55E; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 14px; margin-right: 12px;">✓</span><span style="color: #166534; font-size: 15px; font-weight: 600;">Application Approved</span></td></tr>
                      <tr><td style="padding: 8px 0;"><span style="display: inline-block; width: 24px; height: 24px; background-color: #FF6B35; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 14px; margin-right: 12px;">!</span><span style="color: #C2410C; font-size: 15px; font-weight: 600;">Awaiting Your Signature</span></td></tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!-- Quick Note -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #1E3A8A;">
                    <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;"><strong>Quick reminder:</strong> Once you sign, funds can be in your account as soon as the next business day. Don't let this opportunity slip away!</p>
                  </td>
                </tr>
              </table>
              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr><td align="center"><a href="tel:6175333190" style="display: inline-block; background-color: #1E3A8A; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">Call to Complete: (617) 533-3190</a></td></tr>
              </table>
              <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">We're standing by to help you finish!</p>
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
</html>`.replace(/\$\{firstName\}/g, firstName).replace(/\$\{businessName\}/g, businessName);
}

// ============================================================================
// POST-DLVC DRIP EMAIL 3: Don't Miss Out! (24 hours after DLVC)
// ============================================================================
function getPostDlvcDrip3(firstName: string, businessName: string) {
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
              <h1 style="margin: 0 0 16px; color: #1f2937; font-size: 28px; font-weight: 700; line-height: 1.3;">\${firstName}, Don't Let Your Funding Slip Away</h1>
              <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">Your funding approval for <strong style="color: #1f2937;">\${businessName}</strong> is still waiting for your signature. We don't want you to miss this opportunity!</p>
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
                      <tr><td style="padding: 6px 0; color: #374151; font-size: 15px;"><span style="color: #22C55E; margin-right: 8px;">✓</span> Funds as soon as tomorrow</td></tr>
                      <tr><td style="padding: 6px 0; color: #374151; font-size: 15px;"><span style="color: #22C55E; margin-right: 8px;">✓</span> Flexible daily or weekly repayments</td></tr>
                      <tr><td style="padding: 6px 0; color: #374151; font-size: 15px;"><span style="color: #22C55E; margin-right: 8px;">✓</span> No personal guarantee required</td></tr>
                      <tr><td style="padding: 6px 0; color: #374151; font-size: 15px;"><span style="color: #22C55E; margin-right: 8px;">✓</span> One simple fixed fee - no surprises</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!-- Personal Touch -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background-color: #FFF7ED; border-radius: 8px; border-left: 4px solid #FF6B35;">
                    <p style="margin: 0; color: #9A3412; font-size: 15px; line-height: 1.6;"><strong>Having second thoughts?</strong> That's completely normal. Give us a call and we'll walk you through everything - no pressure. We're here to help \${businessName} grow on your terms.</p>
                  </td>
                </tr>
              </table>
              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                <tr><td align="center"><a href="tel:6175333190" style="display: inline-block; background-color: #DC2626; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">Complete Your Funding: (617) 533-3190</a></td></tr>
              </table>
              <p style="margin: 0; color: #9ca3af; font-size: 13px; text-align: center;">This is your final reminder. After this, you may need to re-apply.</p>
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
</html>`.replace(/\$\{firstName\}/g, firstName).replace(/\$\{businessName\}/g, businessName);
}

// ============================================================================
// COLD OUTREACH EMAIL 9: Seasonal Opportunity
// ============================================================================
function getColdEmail9(firstName: string, businessName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Capital - Seasonal Opportunity</title>
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

          <!-- Seasonal Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #10B981 100%); padding: 20px 40px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px;">PREPARE FOR YOUR BUSIEST SEASON</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px; color: #6b7280; font-size: 15px;">
                Hi ${firstName},
              </p>

              <h1 style="margin: 0 0 20px; color: #1f2937; font-size: 26px; font-weight: 700; line-height: 1.3;">
                Peak season is coming. Is ${businessName} ready?
              </h1>

              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.7;">
                Smart restaurant owners prepare <em>before</em> the rush hits. Whether it's summer patios, holiday catering, or weekend brunch crowds—now is the time to gear up.
              </p>

              <!-- Seasonal Prep List -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F0FDF4; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 16px; color: #166534; font-size: 16px; font-weight: 700;">Get ahead of the season:</p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 6px 0; color: #15803D; font-size: 14px;">
                          <span style="margin-right: 8px;">→</span> Stock up on inventory before prices spike
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #15803D; font-size: 14px;">
                          <span style="margin-right: 8px;">→</span> Hire and train staff ahead of time
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #15803D; font-size: 14px;">
                          <span style="margin-right: 8px;">→</span> Upgrade equipment before the crunch
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #15803D; font-size: 14px;">
                          <span style="margin-right: 8px;">→</span> Launch marketing campaigns early
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Funding Highlight -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1f2937; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #9ca3af; font-size: 14px;">BASED ON YOUR TOAST POS REVENUE</p>
                    <p style="margin: 0 0 8px; color: #ffffff; font-size: 28px; font-weight: 700;">You May Qualify for Funding</p>
                    <p style="margin: 0; color: #10B981; font-size: 16px; font-weight: 600;">With funds as soon as next business day</p>
                  </td>
                </tr>
              </table>

              <!-- Zero Risk -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="text-align: center;">
                    <span style="display: inline-block; padding: 4px 12px; background-color: #F0FDF4; border-radius: 20px; color: #166534; font-size: 13px; font-weight: 600; margin: 0 4px;">No cost</span>
                    <span style="display: inline-block; padding: 4px 12px; background-color: #F0FDF4; border-radius: 20px; color: #166534; font-size: 13px; font-weight: 600; margin: 0 4px;">No obligation</span>
                    <span style="display: inline-block; padding: 4px 12px; background-color: #F0FDF4; border-radius: 20px; color: #166534; font-size: 13px; font-weight: 600; margin: 0 4px;">No credit impact</span>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://toastcapital.com/quote" style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: 600; font-size: 16px; padding: 16px 40px; border-radius: 8px; text-decoration: none;">
                      Prepare for Peak Season →
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

// ============================================================================
// PAGES DATA
// ============================================================================
const PAGES_DATA = [
  {
    path: '/',
    name: 'Homepage',
    description: 'Main landing page with Get Started CTA',
    status: 'live',
  },
  {
    path: '/quote',
    name: 'Quote Form',
    description: 'Step 1: Collect basic info and funding amount',
    status: 'live',
  },
  {
    path: '/upload',
    name: 'JotForm Application',
    description: 'Step 2: Embedded JotForm for full application',
    status: 'live',
  },
  {
    path: '/dlvc',
    name: 'Document Upload',
    description: 'Step 3: Upload bank statements, DL, void check',
    status: 'live',
  },
  {
    path: '/misc',
    name: 'Misc Documents',
    description: 'Upload additional docs (tax returns, EIN, etc.)',
    status: 'live',
  },
  {
    path: '/thank-you-dlvc',
    name: 'Thank You (DLVC)',
    description: 'Confirmation after document submission',
    status: 'live',
  },
  {
    path: '/privacy',
    name: 'Privacy Policy',
    description: 'Privacy policy page',
    status: 'live',
  },
  {
    path: '/email-preview',
    name: 'Email Preview (Admin)',
    description: 'Preview all email templates',
    status: 'live',
  },
];

// ============================================================================
// TOOLS DATA
// ============================================================================
const TOOLS_DATA = [
  {
    name: 'Resend',
    category: 'Email',
    description: 'Transactional email service for all notifications',
    url: 'https://resend.com/emails',
    envVar: 'RESEND_API_KEY',
    usage: 'Sends quote confirmations, application updates, DLVC complete emails',
  },
  {
    name: 'Twilio',
    category: 'SMS',
    description: 'SMS notifications to team and applicants',
    url: 'https://console.twilio.com',
    envVar: 'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER',
    usage: 'Sends SMS alerts for new leads and status updates',
  },
  {
    name: 'JotForm',
    category: 'Forms',
    description: 'Embedded application form on /upload page',
    url: 'https://www.jotform.com/myforms',
    envVar: 'N/A (Form ID hardcoded)',
    usage: 'Collects detailed business information and bank statements',
  },
  {
    name: 'Netlify',
    category: 'Hosting',
    description: 'Deployment and hosting platform',
    url: 'https://app.netlify.com',
    envVar: 'Environment variables configured in Netlify dashboard',
    usage: 'Hosts toastcapital.com, handles SSL, edge functions',
  },
  {
    name: 'GitHub',
    category: 'Version Control',
    description: 'Source code repository',
    url: 'https://github.com',
    envVar: 'N/A',
    usage: 'Stores codebase, triggers Netlify deploys on push',
  },
  {
    name: 'Same.new',
    category: 'Development',
    description: 'AI-powered development environment',
    url: 'https://same.new',
    envVar: 'N/A',
    usage: 'Development, testing, and deployment',
  },
];

// ============================================================================
// FLOW DATA
// ============================================================================
const FLOW_STEPS = [
  {
    step: 0,
    page: 'CSV Import',
    action: 'Admin imports leads via CSV',
    triggers: [
      'Lead created at "quote" stage',
      'Source: "CSV Import"',
      'Ready for 9-email drip campaign',
    ],
  },
  {
    step: '0→9',
    page: '9-Email Drip',
    action: 'Cold outreach drip campaign (16 days)',
    triggers: [
      '1/9: "You\'ve Been Approved" (Day 0, 9AM)',
      '2/9: "You\'ve Unlocked Access" (Day 1, 1PM)',
      '3/9: "You\'ve Been Invited" (Day 2, 9AM)',
      '4/9: "Limited Time Offer" (Day 5, 1PM)',
      '5/9: "Quick Question" (Day 6, 9AM)',
      '6/9: "Fuel Your Growth" (Day 7, 1PM)',
      '7/9: "Growth Potential" (Day 13, 9AM)',
      '8/9: "60-Second Offer" (Day 14, 1PM)',
      '9/9: "Seasonal Opportunity" (Day 15, 9AM)',
      '⏸️ Pause/Resume/Stop via Admin UI',
      '🛑 AUTO-STOP: On bounce or DLVC completion',
    ],
  },
  {
    step: 1,
    page: '/quote',
    action: 'User fills quote form',
    triggers: [
      'Email: Quote Confirmation to user',
      'Email: Lead notification to support@',
      'SMS: Lead alert to team',
      'Drip: Fast & Easy email (5 min)',
      'Drip: Fast Loans email (2 hrs)',
      'Drip: Industry Expertise email (24 hrs)',
      '🛑 STOP: Cold outreach drip (if active)',
    ],
  },
  {
    step: 2,
    page: '/upload',
    action: 'User completes JotForm application',
    triggers: [
      'Email: Application Submitted to user',
      'Email: Application notification to support@',
      'SMS: Application alert to team',
      'Redirect: Auto-redirect to /dlvc',
    ],
  },
  {
    step: 3,
    page: '/dlvc',
    action: 'User uploads documents (individually)',
    triggers: [
      'Email: Each doc sent individually to support@ (safety net)',
    ],
  },
  {
    step: 4,
    page: '/dlvc',
    action: 'User clicks "Complete Application"',
    triggers: [
      'Email: All 5 docs to support@ (original + watermarked)',
      'Email: DLVC Complete confirmation to user',
      'SMS: DLVC complete to team',
      'SMS: Confirmation to user',
      'Redirect: to /thank-you-dlvc',
      '🛑 STOP: Cold outreach drip (if active)',
      'CANCEL: Pre-DLVC drip sequence',
      'START: Post-DLVC drip sequence',
    ],
  },
  {
    step: 5,
    page: 'Post-DLVC Drips',
    action: 'Automated emails to encourage signing',
    triggers: [
      'Post-DLVC Drip 1: "Approval Ready!" (+3 hours)',
      'Post-DLVC Drip 2: "Agreement Waiting" (+12 hours)',
      'Post-DLVC Drip 3: "Final Reminder" (+24 hours)',
    ],
  },
  {
    step: 6,
    page: 'Hourly Cron',
    action: 'Netlify scheduled function (every hour)',
    triggers: [
      'Checks leads due for next drip email',
      'Sends pending drip emails',
      'Advances drip step (e.g., 3/9 → 4/9)',
      'Marks bounced emails automatically',
      'Logs: processed, sent, failed, bounced',
    ],
  },
];

// Email templates list with ACTUAL subject lines used in production
const emailTemplates = [
  {
    id: 'quote',
    name: 'Quote Confirmation',
    category: 'triggered',
    trigger: 'After /quote submission',
    delay: 'Immediate',
    subject: 'Welcome {firstName}! Your Toast Capital Demo Request',
  },
  {
    id: 'upload',
    name: 'Application Submitted',
    category: 'triggered',
    trigger: 'After /upload (Jotform)',
    delay: 'Immediate',
    subject: 'Application Received - Next Step: Upload Documents',
  },
  {
    id: 'dlvc',
    name: 'Application Complete',
    category: 'triggered',
    trigger: 'After /dlvc submission',
    delay: 'Immediate',
    subject: 'Documents Received - {firstName}, Your Approval is in Progress!',
  },
  {
    id: 'drip1',
    name: 'Fast, Easy & Flexible',
    category: 'drip',
    trigger: 'After signup',
    delay: '5 minutes',
    subject: "{firstName}, here's why restaurant owners trust Toast Capital",
  },
  {
    id: 'drip2',
    name: 'Fast & Flexible Loans',
    category: 'drip',
    trigger: 'After signup',
    delay: '2 hours',
    subject: '{firstName}, you could have funding as soon as tomorrow',
  },
  {
    id: 'drip3',
    name: 'Industry Expertise',
    category: 'drip',
    trigger: 'After signup',
    delay: '24 hours',
    subject: "{firstName}, don't let your verification expire",
  },
  {
    id: 'postDlvc1',
    name: "Approval Ready - Sign Now!",
    category: 'postDlvc',
    trigger: 'After DLVC submission',
    delay: '3 hours',
    subject: '{firstName}, great news! Your funding is approved!',
  },
  {
    id: 'postDlvc2',
    name: "Agreement Still Waiting",
    category: 'postDlvc',
    trigger: 'After DLVC submission',
    delay: '12 hours',
    subject: '{firstName}, your funding agreement is still waiting',
  },
  {
    id: 'postDlvc3',
    name: "Final Reminder - Sign Today",
    category: 'postDlvc',
    trigger: 'After DLVC submission',
    delay: '24 hours',
    subject: "{firstName}, don't let your funding approval expire",
  },
  {
    id: 'cold1',
    name: "You've Been Approved",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: "{firstName}, You've Been Approved for a Toast Lending Offer!",
  },
  {
    id: 'cold2',
    name: "You've Unlocked Access",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: "{firstName}, You've Unlocked a Special Funding Offer!",
  },
  {
    id: 'cold3',
    name: "You've Been Invited",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: "{firstName}, You've been invited to apply for a Toast Capital Loan",
  },
  {
    id: 'cold4',
    name: "Limited Time Offer",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: "{firstName}, Don't Miss Out on This Opportunity",
  },
  {
    id: 'cold5',
    name: "Quick Question",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: 'Quick question for you, {firstName}',
  },
  {
    id: 'cold6',
    name: "Fuel Your Growth",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: 'What Could {businessName} Accomplish With Extra Capital?',
  },
  {
    id: 'cold7',
    name: "Growth Potential",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: "What's holding {businessName} back from its next level?",
  },
  {
    id: 'cold8',
    name: "60-Second Offer",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: '60 seconds to see your funding offer',
  },
  {
    id: 'cold9',
    name: "Seasonal Opportunity",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: 'Peak season is coming. Is {businessName} ready?',
  },
];

export default function AdminDashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'import' | 'campaigns' | 'analytics' | 'documents' | 'emails' | 'pages' | 'tools' | 'flow'>('leads');
  const [selectedId, setSelectedId] = useState('quote');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [firstName, setFirstName] = useState('John');
  const [businessName, setBusinessName] = useState('Smith Family Restaurant');
  const [copied, setCopied] = useState(false);

  // Check for saved login state on mount
  useEffect(() => {
    const savedLogin = sessionStorage.getItem('emailPreviewLoggedIn');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Username: toastcapital, Password: toast2026
    if (username.toLowerCase() === 'toastcapital' && password === 'toast2026') {
      setIsLoggedIn(true);
      sessionStorage.setItem('emailPreviewLoggedIn', 'true');
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    sessionStorage.removeItem('emailPreviewLoggedIn');
  };

  const selectedTemplate = emailTemplates.find(t => t.id === selectedId) || emailTemplates[0];

  // Get subject line with dynamic values replaced
  const getSubjectLine = (template: typeof emailTemplates[0]) => {
    if (!template.subject) return '';
    return template.subject
      .replace('{firstName}', firstName)
      .replace('{businessName}', businessName);
  };

  const getHtml = () => {
    switch (selectedId) {
      case 'quote':
        return getQuoteConfirmationEmail(firstName, businessName);
      case 'upload':
        return getBankStatementsEmail(firstName, businessName);
      case 'dlvc':
        return getDLVCCompleteEmail(firstName, businessName);
      case 'drip1':
        return getDripEmail1(firstName, businessName);
      case 'drip2':
        return getDripEmail2(firstName, businessName);
      case 'drip3':
        return getDripEmail3(firstName, businessName);
      case 'postDlvc1':
        return getPostDlvcDrip1(firstName, businessName);
      case 'postDlvc2':
        return getPostDlvcDrip2(firstName, businessName);
      case 'postDlvc3':
        return getPostDlvcDrip3(firstName, businessName);
      case 'cold1':
        return getColdEmail1(firstName, businessName);
      case 'cold2':
        return getColdEmail2(firstName, businessName);
      case 'cold3':
        return getColdEmail3(firstName, businessName);
      case 'cold4':
        return getColdEmail4(firstName, businessName);
      case 'cold5':
        return getColdEmail5(firstName, businessName);
      case 'cold6':
        return getColdEmail6(firstName, businessName);
      case 'cold7':
        return getColdEmail7(firstName, businessName);
      case 'cold8':
        return getColdEmail8(firstName, businessName);
      case 'cold9':
        return getColdEmail9(firstName, businessName);
      default:
        return getQuoteConfirmationEmail(firstName, businessName);
    }
  };

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(getHtml());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border p-8 w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Lock className="w-8 h-8 text-[#FF6B35]" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600 text-center mb-6">Enter password to access admin tools</p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                autoComplete="username"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-semibold hover:bg-[#1e3a8a]/90 transition"
            >
              Login
            </button>
          </form>
          <Link href="/" className="block text-center mt-4 text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Render Pages Tab
  const renderPagesTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#FF6B35]" />
          Live Pages
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {PAGES_DATA.map((page) => (
            <a
              key={page.path}
              href={`https://toastcapital.com${page.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-orange-50 hover:border-[#FF6B35] border border-transparent transition group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-[#FF6B35]">{page.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{page.description}</p>
                  <code className="text-xs bg-gray-200 px-2 py-0.5 rounded mt-2 inline-block">{page.path}</code>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#FF6B35]" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Tools Tab
  const renderToolsTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-[#FF6B35]" />
          Integrations & Tools
        </h2>
        <div className="space-y-4">
          {TOOLS_DATA.map((tool) => (
            <div key={tool.name} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{tool.name}</p>
                    <span className="text-xs bg-[#FF6B35] text-white px-2 py-0.5 rounded">{tool.category}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                  <p className="text-sm text-gray-500 mt-2"><strong>Usage:</strong> {tool.usage}</p>
                  <p className="text-xs text-gray-400 mt-1"><strong>Env:</strong> {tool.envVar}</p>
                </div>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-[#1E3A8A] hover:underline"
                >
                  Open <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Flow Tab
  const renderFlowTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-[#FF6B35]" />
          Application Flow
        </h2>
        <div className="relative">
          {FLOW_STEPS.map((flowStep, index) => (
            <div key={flowStep.step} className="relative pl-8 pb-8 last:pb-0">
              {/* Connector Line */}
              {index < FLOW_STEPS.length - 1 && (
                <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200"></div>
              )}
              {/* Step Circle */}
              <div className="absolute left-0 top-0 w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-sm font-bold">
                {flowStep.step}
              </div>
              {/* Content */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-xs bg-[#1E3A8A] text-white px-2 py-0.5 rounded">{flowStep.page}</code>
                  <span className="font-semibold text-gray-900">{flowStep.action}</span>
                </div>
                <div className="space-y-1 mt-3">
                  <p className="text-xs font-medium text-gray-500 uppercase">Triggers:</p>
                  {flowStep.triggers.map((trigger, i) => (
                    <p key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      {trigger}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 border-t">
          <div className="flex gap-1">
            {[
              { id: 'leads', label: 'Leads', icon: Users },
              { id: 'import', label: 'Import', icon: Upload },
              { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'documents', label: 'Documents', icon: FileCheck },
              { id: 'emails', label: 'Emails', icon: Mail },
              { id: 'pages', label: 'Pages', icon: Globe },
              { id: 'tools', label: 'Tools', icon: Wrench },
              { id: 'flow', label: 'Flow', icon: GitBranch },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-[#FF6B35] text-[#FF6B35]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Render different content based on active tab */}
        {activeTab === 'leads' && <LeadsTab />}
        {activeTab === 'import' && <LeadImportTab />}
        {activeTab === 'campaigns' && <BulkMessagingTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'documents' && <DocumentChecklist onSelectLead={() => setActiveTab('leads')} />}
        {activeTab === 'pages' && renderPagesTab()}
        {activeTab === 'tools' && renderToolsTab()}
        {activeTab === 'flow' && renderFlowTab()}
        {activeTab === 'emails' && (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Triggered Emails */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h2 className="font-bold text-gray-900 mb-2">Triggered Emails</h2>
              <p className="text-xs text-gray-500 mb-4">Sent after form submissions</p>
              <div className="space-y-2">
                {emailTemplates.filter(t => t.category === 'triggered').map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedId(template.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedId === template.id
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <p className="font-semibold text-sm">{template.name}</p>
                    <p className={`text-xs mt-1 ${selectedId === template.id ? 'text-white/80' : 'text-gray-500'}`}>
                      {template.trigger}
                    </p>
                    <div className={`text-xs mt-2 p-1.5 rounded ${selectedId === template.id ? 'bg-white/20' : 'bg-blue-50 border border-blue-100'}`}>
                      <span className={`font-medium ${selectedId === template.id ? 'text-white/90' : 'text-blue-600'}`}>Subject: </span>
                      <span className={`${selectedId === template.id ? 'text-white/80' : 'text-gray-600'}`}>{getSubjectLine(template)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pre-DLVC Drip Emails */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h2 className="font-bold text-gray-900 mb-2">Pre-DLVC Drips</h2>
              <p className="text-xs text-gray-500 mb-4">After signup (finish verification)</p>
              <div className="space-y-2">
                {emailTemplates.filter(t => t.category === 'drip').map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedId(template.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedId === template.id
                        ? 'bg-[#1E3A8A] text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <p className="font-semibold text-sm">{template.name}</p>
                    <p className={`text-xs mt-1 ${selectedId === template.id ? 'text-white/80' : 'text-gray-500'}`}>
                      +{template.delay}
                    </p>
                    <div className={`text-xs mt-2 p-1.5 rounded ${selectedId === template.id ? 'bg-white/20' : 'bg-blue-50 border border-blue-100'}`}>
                      <span className={`font-medium ${selectedId === template.id ? 'text-white/90' : 'text-blue-600'}`}>Subject: </span>
                      <span className={`${selectedId === template.id ? 'text-white/80' : 'text-gray-600'}`}>{getSubjectLine(template)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Post-DLVC Drip Emails */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h2 className="font-bold text-gray-900 mb-2">Post-DLVC Drips</h2>
              <p className="text-xs text-gray-500 mb-4">After docs submitted (sign agreement)</p>
              <div className="space-y-2">
                {emailTemplates.filter(t => t.category === 'postDlvc').map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedId(template.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedId === template.id
                        ? 'bg-[#22C55E] text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <p className="font-semibold text-sm">{template.name}</p>
                    <p className={`text-xs mt-1 ${selectedId === template.id ? 'text-white/80' : 'text-gray-500'}`}>
                      +{template.delay}
                    </p>
                    <div className={`text-xs mt-2 p-1.5 rounded ${selectedId === template.id ? 'bg-white/20' : 'bg-green-50 border border-green-100'}`}>
                      <span className={`font-medium ${selectedId === template.id ? 'text-white/90' : 'text-green-600'}`}>Subject: </span>
                      <span className={`${selectedId === template.id ? 'text-white/80' : 'text-gray-600'}`}>{getSubjectLine(template)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cold Outreach Emails */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <h2 className="font-bold text-gray-900 mb-2">Cold Outreach</h2>
              <p className="text-xs text-gray-500 mb-4">Manual send to leads ({emailTemplates.filter(t => t.category === 'cold').length} templates)</p>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {emailTemplates.filter(t => t.category === 'cold').map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedId(template.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedId === template.id
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <p className="font-semibold text-sm">{template.name}</p>
                    <div className={`text-xs mt-2 p-1.5 rounded ${selectedId === template.id ? 'bg-white/20' : 'bg-orange-50 border border-orange-100'}`}>
                      <span className={`font-medium ${selectedId === template.id ? 'text-white/90' : 'text-orange-600'}`}>Subject: </span>
                      <span className={`${selectedId === template.id ? 'text-white/80' : 'text-gray-600'}`}>{getSubjectLine(template)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">View Mode</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                    viewMode === 'desktop' ? 'bg-[#1E3A8A] text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                    viewMode === 'mobile' ? 'bg-[#1E3A8A] text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Sample Data */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Sample Data</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-bold text-gray-900">{selectedTemplate.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedTemplate.category === 'drip'
                      ? `Drip: ${selectedTemplate.delay} after signup`
                      : selectedTemplate.category === 'postDlvc'
                      ? `Post-DLVC Drip: ${selectedTemplate.delay} after document upload`
                      : selectedTemplate.trigger}
                  </p>
                </div>
                <button
                onClick={copyHtml}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-[#FF6B35] text-white hover:bg-[#e55a2b]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy HTML
                  </>
                )}
              </button>
              </div>
              {/* Subject Line Display - Prominent */}
              <div className="mt-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      Email Subject Line:
                    </p>
                    <p className="text-lg font-bold text-gray-900">{getSubjectLine(selectedTemplate)}</p>
                  </div>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(getSubjectLine(selectedTemplate));
                      alert('Subject line copied!');
                    }}
                    className="ml-4 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className={`bg-white rounded-xl shadow-lg border overflow-hidden mx-auto ${
              viewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-full'
            }`}>
              <div className="bg-gray-800 text-white px-4 py-2 text-sm flex items-center justify-between">
                <span>Email Preview - {viewMode === 'mobile' ? '375px' : 'Full Width'}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  selectedTemplate.category === 'drip'
                    ? 'bg-blue-600'
                    : selectedTemplate.category === 'postDlvc'
                    ? 'bg-green-600'
                    : selectedTemplate.category === 'cold'
                    ? 'bg-orange-700'
                    : 'bg-orange-600'
                }`}>
                  {selectedTemplate.category === 'drip'
                    ? 'PRE-DLVC DRIP'
                    : selectedTemplate.category === 'postDlvc'
                    ? 'POST-DLVC DRIP'
                    : selectedTemplate.category === 'cold'
                    ? 'COLD'
                    : 'TRIGGERED'}
                </span>
              </div>
              <div className="bg-gray-100 p-4">
                <iframe
                  key={`${selectedId}-${firstName}-${businessName}`}
                  srcDoc={getHtml()}
                  className="w-full bg-white"
                  style={{ minHeight: viewMode === 'mobile' ? '1000px' : '1200px', border: 'none' }}
                  title="Email Preview"
                />
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
