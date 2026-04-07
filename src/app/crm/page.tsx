'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lock,
  Globe,
  ExternalLink,
  Wrench,
  GitBranch,
  ChevronLeft,
  LogOut,
  Check,
  Copy,
  Mail,
  Users,
  Upload,
  Megaphone,
  BarChart3,
  BarChart,
  FileText,
  FileCheck,
  Settings,
  Database,
  Workflow,
  Layout,
  Hammer,
} from 'lucide-react';

// Admin Components
import LeadsTab from '@/components/admin/LeadsTab';
import LeadImportTab from '@/components/admin/LeadImportTab';
import BulkMessagingTab from '@/components/admin/BulkMessagingTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import DocumentChecklist from '@/components/admin/DocumentChecklist';
import DataManagementTab from '@/components/admin/DataManagementTab';
import SettingsTab from '@/components/admin/SettingsTab';

// Email Templates
import { getTemplateHtml, getTemplateSubject, LOGO_URL } from '@/lib/email-templates';
import { generateDemoConfirmationEmail } from '@/app/api/submit-demo-request/email-template';
import { generateConfirmationEmail, generateUploadConfirmationEmail } from '@/app/api/submit-application/email-template';
import { generateDLVCConfirmationEmail } from '@/app/api/submit-dlvc/email-template';
// Pre-DLVC Drip Emails
import { getDripEmail1, getDripEmail2, getDripEmail3 } from '@/app/api/submit-demo-request/drip-emails';
// Post-DLVC Drip Emails
import { getPostDlvcDrip1, getPostDlvcDrip2, getPostDlvcDrip3 } from '@/app/api/submit-dlvc/post-dlvc-drips';

// ============================================================================
// FLOW DATA - ACCURATE AS OF APRIL 2026
// ============================================================================
const FLOW_STEPS = [
  {
    step: 0,
    page: 'CSV Import',
    action: 'Admin imports leads via CSV in CRM',
    triggers: [
      'Lead created at "quote" stage',
      'Source: "CSV Import"',
      'Token auto-generated for tracking',
      'Cold outreach drip campaign starts',
    ],
  },
  {
    step: '1-11',
    page: '11-Email Cold Drip',
    action: 'Automated cold outreach campaign',
    triggers: [
      '1/11: "You\'ve Been Approved" (Day 0, 9AM)',
      '2/11: "Terms Unlocked" (Day 1, 1PM)',
      '3/11: "Better Terms" (Day 2, 9AM)',
      '4/11: "VIP Access" (Day 3, 1PM)',
      '5/11: "You\'re Invited" (Day 5, 9AM)',
      '6/11: "Limited Time" (Day 6, 1PM)',
      '7/11: "Quick Question" (Day 7, 9AM)',
      '8/11: "Fuel Growth" (Day 10, 1PM)',
      '9/11: "Growth Potential" (Day 13, 9AM)',
      '10/11: "60-Second Offer" (Day 14, 1PM)',
      '11/11: "Seasonal Opportunity" (Day 16, 9AM)',
      '⏸️ Pause/Resume/Stop via Admin CRM',
      '🛑 AUTO-STOP: On bounce, unsubscribe, or form submission',
    ],
  },
  {
    step: 1,
    page: '/quote',
    action: 'User fills quote form + OTP verification',
    triggers: [
      'OTP sent to verify phone number',
      'Email: Quote Confirmation to user',
      'Email: Lead notification to support@',
      'SMS: Lead alert to team',
      '🛑 STOP: Cold outreach drip (if active)',
      'START: Pre-DLVC drip sequence',
      'Drip 1: "Fast & Easy" (+5 min)',
      'Drip 2: "Fast Loans" (+2 hrs)',
      'Drip 3: "Industry Expertise" (+24 hrs)',
    ],
  },
  {
    step: 2,
    page: '/upload',
    action: 'User completes business verification form',
    triggers: [
      'Form data submitted to JotForm',
      'Email: Application Submitted to user',
      'Email: Application notification to support@',
      'SMS: Application alert to team',
      'Auto-redirect to /dlvc for document upload',
    ],
  },
  {
    step: 3,
    page: '/dlvc',
    action: 'User uploads documents (bank statements, ID, void check)',
    triggers: [
      'Each doc uploaded → immediately sent to support@ (safety net)',
      'Large images auto-compressed before upload',
      'Progress bar shows 0/5 → 5/5 completion',
    ],
  },
  {
    step: 4,
    page: '/dlvc → /thank-you-dlvc',
    action: 'User clicks "Complete Application"',
    triggers: [
      'Email: All 5 docs to support@ (original + watermarked)',
      'Email: DLVC Complete confirmation to user',
      'SMS: DLVC complete to team',
      'SMS: Confirmation to user',
      '🛑 STOP: Cold outreach drip (if still active)',
      '🛑 CANCEL: Pre-DLVC drip sequence',
      'Token marked as "completed"',
      'Redirect to /thank-you-dlvc',
    ],
  },
  {
    step: 5,
    page: 'Post-DLVC Drips',
    action: '⏸️ DISABLED - Post-DLVC drips are turned off',
    triggers: [
      '🛑 Post-DLVC drip emails are DISABLED',
      '(Was: Drip 1 @ +3 hours, Drip 2 @ +12 hours, Drip 3 @ +24 hours)',
      'Can be re-enabled in code if needed',
    ],
  },
  {
    step: 6,
    page: 'Hourly Cron Job',
    action: 'Netlify scheduled function runs every hour',
    triggers: [
      'Checks all leads with active drip campaigns',
      'Sends any emails that are due',
      'Advances drip step (e.g., 3/11 → 4/11)',
      'Marks bounced emails automatically',
      'Stops campaigns on unsubscribe',
      'Logs: processed, sent, failed, bounced counts',
    ],
  },
  {
    step: 7,
    page: 'Token System',
    action: 'All links are token-protected',
    triggers: [
      'Tokens auto-generated when sending emails',
      'Session-based navigation after first validation',
      'Invalid/expired token → 404 page',
      'Tracks: clicks, page visits, conversions',
      'Bulletproof: CRM on separate domain',
    ],
  },
];

// ============================================================================
// PAGES DATA - Live public pages
// ============================================================================
const PAGES_DATA = [
  { path: '/', name: 'Homepage', description: 'Main landing page with video and testimonials' },
  { path: '/quote', name: 'Quote Form', description: 'Initial quote request form (Step 1)' },
  { path: '/upload', name: 'Application Form', description: 'Full application with signature (Step 2)' },
  { path: '/dlvc', name: 'Document Upload', description: 'Bank statements & ID upload (Step 3)' },
  { path: '/privacy', name: 'Privacy Policy', description: 'Legal privacy policy page' },
];

// ============================================================================
// TOOLS DATA - External integrations
// ============================================================================
const TOOLS_DATA = [
  {
    name: 'Supabase',
    category: 'Database',
    description: 'PostgreSQL database for leads, tokens, and settings',
    usage: 'Stores all lead data, token validation, drip schedules',
    envVar: 'SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY',
    url: 'https://supabase.com/dashboard',
  },
  {
    name: 'Resend',
    category: 'Email',
    description: 'Transactional email service',
    usage: 'Sends confirmation emails, drip campaigns, notifications',
    envVar: 'RESEND_API_KEY',
    url: 'https://resend.com/emails',
  },
  {
    name: 'Twilio',
    category: 'SMS',
    description: 'SMS verification and notifications',
    usage: 'OTP codes, lead alerts to team',
    envVar: 'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN',
    url: 'https://console.twilio.com',
  },
  {
    name: 'Vercel Blob',
    category: 'Storage',
    description: 'File storage for documents',
    usage: 'Stores uploaded bank statements, IDs, void checks',
    envVar: 'BLOB_READ_WRITE_TOKEN',
    url: 'https://vercel.com/dashboard/stores',
  },
  {
    name: 'JotForm',
    category: 'Forms',
    description: 'Backup form submissions',
    usage: 'Webhook receives form data → creates lead',
    envVar: 'N/A (webhook)',
    url: 'https://www.jotform.com/myforms',
  },
];

// ============================================================================
// Email templates list with ACTUAL subject lines used in production
// ============================================================================
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
  // V2 Cold Outreach Templates (11)
  {
    id: 'cold1_v2',
    name: "You've Been Approved",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: "You've Been Approved for a Toast Lending Offer!",
  },
  {
    id: 'cold2_v2',
    name: "Terms Unlocked",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: '[UNLOCKED] Your Terms Have Been Upgraded!',
  },
  {
    id: 'cold3_v2',
    name: "Better Terms",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: '[UNLOCKED] Your Terms Have Been Upgraded!',
  },
  {
    id: 'cold4_v2',
    name: "VIP Access",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: "You've Unlocked a Special Funding Offer!",
  },
  {
    id: 'cold5_v2',
    name: "You're Invited",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: "You've been invited to apply for a Toast Capital Loan",
  },
  {
    id: 'cold6_v2',
    name: "Limited Time",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: "{firstName}, Don't Miss Out on This Opportunity",
  },
  {
    id: 'cold7_v2',
    name: "Quick Question",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: 'Quick question for you, {firstName}',
  },
  {
    id: 'cold8_v2',
    name: "Fuel Growth",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: 'What Could {businessName} Accomplish With Extra Capital?',
  },
  {
    id: 'cold9_v2',
    name: "Growth Potential",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: "What's holding {businessName} back from its next level?",
  },
  {
    id: 'cold10_v2',
    name: "60-Second Offer",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: '60 seconds to see your funding offer',
  },
  {
    id: 'cold11_v2',
    name: "Seasonal Opportunity",
    category: 'cold',
    trigger: 'Cold outreach',
    delay: 'Manual send',
    subject: 'Peak season is coming. Is {businessName} ready?',
  },
];

export default function AdminDashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'import' | 'campaigns' | 'analytics' | 'documents' | 'emails' | 'pages' | 'tools' | 'flow' | 'data' | 'settings'>('leads');
  const [selectedId, setSelectedId] = useState('quote');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [firstName, setFirstName] = useState('John');
  const [businessName, setBusinessName] = useState('Smith Family Restaurant');
  const [copied, setCopied] = useState(false);

  // Check for existing session on mount (secure server-side check)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        setIsLoggedIn(data.authenticated === true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsLoggedIn(true);
        setPassword(''); // Clear password from memory
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore errors on logout
    }
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
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
    // Use the actual email template functions
    switch (selectedId) {
      case 'quote':
        return generateDemoConfirmationEmail({ firstName, lastName: '', businessName, businessType: '' });
      case 'upload':
        return generateUploadConfirmationEmail({ firstName, lastName: '', fundingAmount: '$50,000', businessName });
      case 'dlvc':
        return generateDLVCConfirmationEmail({ firstName, lastName: '', fundingAmount: '$50,000', businessName });
      // Pre-DLVC Drip Emails
      case 'drip1':
        return getDripEmail1(firstName, businessName);
      case 'drip2':
        return getDripEmail2(firstName, businessName);
      case 'drip3':
        return getDripEmail3(firstName, businessName);
      // Post-DLVC Drip Emails
      case 'postDlvc1':
        return getPostDlvcDrip1(firstName, businessName);
      case 'postDlvc2':
        return getPostDlvcDrip2(firstName, businessName);
      case 'postDlvc3':
        return getPostDlvcDrip3(firstName, businessName);
      // Cold outreach emails (V2 - using template system, matches new FLOW)
      case 'cold1_v2':
        return getTemplateHtml('cold_approved_v2', firstName, businessName);
      case 'cold2_v2':
        return getTemplateHtml('cold_unlocked_v2', firstName, businessName);
      case 'cold3_v2':
        return getTemplateHtml('cold_better_terms_v2', firstName, businessName);
      case 'cold4_v2':
        return getTemplateHtml('cold_special_access_v2', firstName, businessName);
      case 'cold5_v2':
        return getTemplateHtml('cold_invited_v2', firstName, businessName);
      case 'cold6_v2':
        return getTemplateHtml('cold_limited_v2', firstName, businessName);
      case 'cold7_v2':
        return getTemplateHtml('cold_question_v2', firstName, businessName);
      case 'cold8_v2':
        return getTemplateHtml('cold_growth_v2', firstName, businessName);
      case 'cold9_v2':
        return getTemplateHtml('cold_potential_v2', firstName, businessName);
      case 'cold10_v2':
        return getTemplateHtml('cold_60sec_v2', firstName, businessName);
      case 'cold11_v2':
        return getTemplateHtml('cold_seasonal_v2', firstName, businessName);
      default:
        return generateDemoConfirmationEmail({ firstName, lastName: '', businessName, businessType: '' });
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

  // Loading Screen
  if (isLoading && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border p-8 w-full max-w-md text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#FF6B35] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Checking session...</p>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border p-8 w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Lock className="w-8 h-8 text-[#FF6B35]" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600 text-center mb-6">Enter credentials to access admin tools</p>
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg font-semibold hover:bg-[#1e3a8a]/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
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
              href={`https://toastcap.com${page.path}`}
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
            <div key={String(flowStep.step)} className="relative pl-8 pb-8 last:pb-0">
              {index < FLOW_STEPS.length - 1 && (
                <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200"></div>
              )}
              <div className="absolute left-0 top-0 w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-sm font-bold">
                {flowStep.step}
              </div>
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
        <div className="bg-purple-600 text-white text-center py-1.5 px-4 font-mono text-xs">
          BUILD: SAME-V248 | April 1, 2026 | All Features Deployed | toastcap.com
        </div>
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
        <div className="max-w-7xl mx-auto px-4 border-t overflow-x-auto">
          <div className="flex gap-1 min-w-max">
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
              { id: 'data', label: 'Data', icon: Database },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
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
        {activeTab === 'leads' && <LeadsTab />}
        {activeTab === 'import' && <LeadImportTab />}
        {activeTab === 'campaigns' && <BulkMessagingTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'documents' && <DocumentChecklist onSelectLead={() => setActiveTab('leads')} />}
        {activeTab === 'pages' && renderPagesTab()}
        {activeTab === 'tools' && renderToolsTab()}
        {activeTab === 'flow' && renderFlowTab()}
        {activeTab === 'data' && <DataManagementTab />}
        {activeTab === 'settings' && <SettingsTab />}
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
              {/* Subject Line Display */}
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
