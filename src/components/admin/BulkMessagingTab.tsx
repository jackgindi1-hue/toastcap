'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, Phone, Mail, MessageSquare, Send,
  Users, CheckSquare, Square, Loader2, AlertCircle,
  CheckCircle, ChevronDown, X, Sparkles, Eye, Monitor, Smartphone,
  Play, Pause, StopCircle, Calendar, Zap
} from 'lucide-react';

// Types
type LeadStage = 'quote' | 'application' | 'dlvc' | 'funded';
type LeadStatus = 'new' | 'contacted' | 'in_review' | 'approved' | 'funded' | 'lost';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  stage: LeadStage;
  status: LeadStatus;
  tags: string[];
  createdAt: string;
  // Drip campaign fields
  dripCampaign?: 'cold_outreach' | null;
  dripStep?: number;
  dripTotalSteps?: number;
  nextDripAt?: string;
  dripPaused?: boolean;
  emailBounced?: boolean;
}

// Stage labels
const stageLabels: Record<LeadStage, string> = {
  quote: 'Quote',
  application: 'Application',
  dlvc: 'DLVC',
  funded: 'Funded',
};

// Status labels
const statusLabels: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  in_review: 'In Review',
  approved: 'Approved',
  funded: 'Funded',
  lost: 'Lost',
};

// SMS Campaign Templates
const smsCampaignTemplates = [
  {
    id: 'cold_outreach',
    name: 'Cold Outreach',
    description: 'Initial outreach to potential leads',
    message: 'Hi {firstName}! Toast Capital here. Based on your Toast POS activity, {businessName} may qualify for up to $250,000 in funding. No cost to check! Call us: (617) 533-3190',
  },
  {
    id: 'follow_up_quote',
    name: 'Follow Up - Quote Stage',
    description: 'Follow up with leads who started quote',
    message: 'Hi {firstName}! You started a funding application for {businessName} but haven\'t completed it yet. Finish in 2 minutes: toastcapital.com/upload - Questions? (617) 533-3190',
  },
  {
    id: 'docs_reminder',
    name: 'Documents Reminder',
    description: 'Remind leads to upload documents',
    message: 'Hi {firstName}! We\'re waiting on your documents for {businessName}. Upload now to get funded fast: toastcapital.com/dlvc - Need help? (617) 533-3190',
  },
  {
    id: 'special_offer',
    name: 'Special Offer',
    description: 'Limited time promotional offer',
    message: '{firstName}, special offer for {businessName}! Apply this week for reduced fees + priority processing. Limited time: toastcapital.com/quote - Call: (617) 533-3190',
  },
  {
    id: 'seasonal',
    name: 'Seasonal Prep',
    description: 'Prepare for busy season',
    message: 'Hi {firstName}! Peak season is coming - is {businessName} ready? Get funded now to stock up & hire. Check your offer: toastcapital.com/quote',
  },
];

// Email Campaign Templates with step numbers
const emailCampaignTemplates = [
  {
    id: 'cold_approved',
    name: "You've Been Approved",
    description: 'Cold outreach - approval notification',
    subject: "{firstName}, You've Been Approved for a Toast Lending Offer!",
    step: 1,
  },
  {
    id: 'cold_unlocked',
    name: "You've Unlocked Access",
    description: 'Cold outreach - exclusive access',
    subject: "{firstName}, You've Unlocked a Special Funding Offer!",
    step: 2,
  },
  {
    id: 'cold_invited',
    name: "You've Been Invited",
    description: 'Cold outreach - invitation style',
    subject: "{firstName}, You've been invited to apply for a Toast Capital Loan",
    step: 3,
  },
  {
    id: 'cold_limited',
    name: 'Limited Time Offer',
    description: 'Urgency-based cold outreach',
    subject: "{firstName}, Don't Miss Out on This Opportunity",
    step: 4,
  },
  {
    id: 'cold_question',
    name: 'Quick Question',
    description: 'Short, personal cold outreach',
    subject: 'Quick question for you, {firstName}',
    step: 5,
  },
  {
    id: 'cold_growth',
    name: 'Fuel Your Growth',
    description: 'Growth-focused cold outreach',
    subject: 'What Could {businessName} Accomplish With Extra Capital?',
    step: 6,
  },
  {
    id: 'cold_potential',
    name: 'Growth Potential',
    description: 'Unlock potential messaging',
    subject: "What's holding {businessName} back from its next level?",
    step: 7,
  },
  {
    id: 'cold_60sec',
    name: '60-Second Offer',
    description: 'Super short, direct approach',
    subject: '60 seconds to see your funding offer',
    step: 8,
  },
  {
    id: 'cold_seasonal',
    name: 'Seasonal Opportunity',
    description: 'Seasonal preparation focus',
    subject: 'Peak season is coming. Is {businessName} ready?',
    step: 9,
  },
];

export default function BulkMessagingTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Messaging state
  const [messageType, setMessageType] = useState<'sms' | 'email'>('sms');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    success: number;
    failed: number;
    total: number;
  } | null>(null);

  // Drip campaign state
  const [sendMode, setSendMode] = useState<'single' | 'drip'>('single');
  const [startingDrip, setStartingDrip] = useState(false);
  const [dripResult, setDripResult] = useState<{
    started: number;
    skipped: number;
    skipBreakdown?: {
      notFound: number;
      noEmail: number;
      emailBounced: number;
      alreadyInDrip: number;
      startFunctionFailed: number;
    };
    verification?: {
      totalLeadsInDB: number;
      totalWithEmail: number;
      totalInDripNow: number;
    };
  } | null>(null);
  const [dripStartStep, setDripStartStep] = useState<number>(1); // Start at step 1-9

  // Email Preview state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewViewMode, setPreviewViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewFirstName, setPreviewFirstName] = useState('John');
  const [previewBusinessName, setPreviewBusinessName] = useState('Sample Restaurant');

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (stageFilter !== 'all') params.append('stage', stageFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/leads?${params.toString()}`);
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  }, [stageFilter, statusFilter, searchQuery]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Select/deselect all
  const toggleSelectAll = () => {
    if (selectedLeads.size === leads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(leads.map(l => l.id)));
    }
  };

  // Toggle single lead selection
  const toggleLead = (id: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLeads(newSelected);
  };

  // Get message preview with placeholders replaced
  const getMessagePreview = () => {
    let message = customMessage;
    if (selectedTemplate) {
      const template = messageType === 'sms'
        ? smsCampaignTemplates.find(t => t.id === selectedTemplate)
        : emailCampaignTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        message = messageType === 'sms' ? (template as any).message : (template as any).subject;
      }
    }
    return message
      .replace(/{firstName}/g, 'John')
      .replace(/{lastName}/g, 'Smith')
      .replace(/{businessName}/g, 'Sample Restaurant');
  };

  // Get email preview URL
  const getEmailPreviewUrl = () => {
    if (!selectedTemplate || messageType !== 'email') return '';
    const params = new URLSearchParams({
      template: selectedTemplate,
      firstName: previewFirstName,
      businessName: previewBusinessName,
    });
    return `/api/campaigns/preview?${params.toString()}`;
  };

  // Get inline thumbnail preview URL
  const getInlineThumbnailUrl = () => {
    if (!selectedTemplate || messageType !== 'email') return '';
    const params = new URLSearchParams({
      template: selectedTemplate,
      firstName: 'John',
      businessName: 'Sample Restaurant',
    });
    return `/api/campaigns/preview?${params.toString()}`;
  };

  // Start drip campaign for selected leads
  const startDripCampaign = async () => {
    if (selectedLeads.size === 0) {
      alert('Please select at least one lead');
      return;
    }

    const selectedLeadsList = leads.filter(l => selectedLeads.has(l.id));
    const validLeads = selectedLeadsList.filter(l => l.email && !l.emailBounced && !l.dripCampaign);

    if (validLeads.length === 0) {
      alert('No valid leads to start drip campaign. Leads must have email, not bounced, and not already in a drip.');
      return;
    }

    const emailCount = 10 - dripStartStep;
    const confirmMsg = `Start drip campaign at step ${dripStartStep}/9 for ${validLeads.length} lead${validLeads.length > 1 ? 's' : ''}?\n\nThis will send ${emailCount} email${emailCount !== 1 ? 's' : ''} (steps ${dripStartStep}-9).\n\nFirst email: "${['You\'ve Been Approved', 'You\'ve Unlocked Access', 'You\'ve Been Invited', 'Limited Time Offer', 'Quick Question', 'Fuel Your Growth', 'Growth Potential', '60-Second Offer', 'Seasonal Opportunity'][dripStartStep - 1]}"`;
    if (!confirm(confirmMsg)) return;

    setStartingDrip(true);
    setDripResult(null);

    try {
      const response = await fetch('/api/drip/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadIds: validLeads.map(l => l.id),
          startAtStep: dripStartStep,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setDripResult({
          started: result.started,
          skipped: result.skipped,
          skipBreakdown: result.skipBreakdown,
          verification: result.verification,
        });
        // Refresh leads to show updated drip status
        fetchLeads();
        setSelectedLeads(new Set());
      } else {
        alert('Failed to start drip campaign: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Start drip error:', error);
      alert('Failed to start drip campaign');
    } finally {
      setStartingDrip(false);
    }
  };

  // Manage drip (pause/resume/stop)
  const manageDrip = async (leadId: string, action: 'pause' | 'resume' | 'stop') => {
    try {
      const response = await fetch('/api/drip/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, action }),
      });

      if (response.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error('Manage drip error:', error);
    }
  };

  // Send bulk messages
  const sendBulkMessages = async () => {
    if (selectedLeads.size === 0) {
      alert('Please select at least one lead');
      return;
    }

    const selectedLeadsList = leads.filter(l => selectedLeads.has(l.id));

    // Validate contacts
    const validLeads = selectedLeadsList.filter(l =>
      messageType === 'sms' ? l.phone : l.email
    );

    if (validLeads.length === 0) {
      alert(`No leads have valid ${messageType === 'sms' ? 'phone numbers' : 'email addresses'}`);
      return;
    }

    const confirmMsg = `Send ${messageType.toUpperCase()} to ${validLeads.length} lead${validLeads.length > 1 ? 's' : ''}?`;
    if (!confirm(confirmMsg)) return;

    setSending(true);
    setSendResult(null);

    let successCount = 0;
    let failedCount = 0;

    try {
      for (const lead of validLeads) {
        try {
          const endpoint = messageType === 'sms'
            ? `/api/leads/${lead.id}/send-sms`
            : `/api/leads/${lead.id}/send-email`;

          const body = messageType === 'sms'
            ? {
                message: customMessage || undefined,
                template: selectedTemplate || undefined,
              }
            : {
                subject: customSubject || undefined,
                content: customMessage || undefined,
                template: selectedTemplate || undefined,
              };

          // If using template, replace placeholders in custom message
          if (!selectedTemplate && customMessage) {
            const personalizedMessage = customMessage
              .replace(/{firstName}/g, lead.firstName || 'there')
              .replace(/{lastName}/g, lead.lastName || '')
              .replace(/{businessName}/g, lead.businessName || 'your business');

            if (messageType === 'sms') {
              body.message = personalizedMessage;
            } else {
              body.content = personalizedMessage;
              if (customSubject) {
                body.subject = customSubject
                  .replace(/{firstName}/g, lead.firstName || 'there')
                  .replace(/{lastName}/g, lead.lastName || '')
                  .replace(/{businessName}/g, lead.businessName || 'your business');
              }
            }
          }

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });

          if (response.ok) {
            successCount++;
          } else {
            failedCount++;
          }
        } catch {
          failedCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setSendResult({
        success: successCount,
        failed: failedCount,
        total: validLeads.length,
      });

    } catch (error) {
      console.error('Bulk send error:', error);
      alert('An error occurred while sending messages');
    } finally {
      setSending(false);
    }
  };

  // Filtered leads based on having valid contact info
  const leadsWithValidContact = leads.filter(l =>
    messageType === 'sms' ? l.phone : l.email
  );

  // Get selected template info
  const selectedTemplateInfo = messageType === 'email'
    ? emailCampaignTemplates.find(t => t.id === selectedTemplate)
    : null;

  // Count leads in drip and with email
  const leadsInDrip = leads.filter(l => l.dripCampaign);
  const leadsWithEmail = leads.filter(l => l.email && l.email.trim());
  const leadsWithoutEmail = leads.filter(l => !l.email || !l.email.trim());
  const leadsEligibleForDrip = leads.filter(l =>
    l.email &&
    l.email.trim() &&
    !l.emailBounced &&
    !l.dripCampaign
  );

  return (
    <div className="space-y-6">
      {/* Email Preview Modal */}
      {showPreviewModal && messageType === 'email' && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Email Preview</h3>
                <p className="text-sm text-gray-500">
                  {selectedTemplateInfo?.name} - {selectedTemplateInfo?.description}
                </p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Controls */}
            <div className="p-4 border-b bg-gray-50 flex flex-wrap items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <button
                  onClick={() => setPreviewViewMode('desktop')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    previewViewMode === 'desktop' ? 'bg-[#1E3A8A] text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewViewMode('mobile')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    previewViewMode === 'mobile' ? 'bg-[#1E3A8A] text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  Mobile
                </button>
              </div>

              {/* Sample Data Inputs */}
              <div className="flex items-center gap-3">
                <div>
                  <label className="text-xs text-gray-500 block">First Name</label>
                  <input
                    type="text"
                    value={previewFirstName}
                    onChange={(e) => setPreviewFirstName(e.target.value)}
                    className="w-32 px-2 py-1 text-sm border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block">Business Name</label>
                  <input
                    type="text"
                    value={previewBusinessName}
                    onChange={(e) => setPreviewBusinessName(e.target.value)}
                    className="w-48 px-2 py-1 text-sm border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Subject Line */}
            <div className="p-4 bg-blue-50 border-b">
              <p className="text-xs font-bold text-blue-600 uppercase mb-1">Subject Line:</p>
              <p className="font-semibold text-gray-900">
                {selectedTemplateInfo?.subject
                  .replace(/{firstName}/g, previewFirstName)
                  .replace(/{businessName}/g, previewBusinessName)}
              </p>
            </div>

            {/* Email Preview */}
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              <div className={`mx-auto bg-white shadow-lg rounded-lg overflow-hidden ${
                previewViewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-[600px]'
              }`}>
                <iframe
                  key={`${selectedTemplate}-${previewFirstName}-${previewBusinessName}`}
                  src={getEmailPreviewUrl()}
                  className="w-full border-0"
                  style={{ height: previewViewMode === 'mobile' ? '800px' : '900px' }}
                  title="Email Preview"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                This is how your email will look to recipients
              </p>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-6 py-2 bg-[#FF6B35] text-white rounded-lg font-semibold hover:bg-[#e55a2b] transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#e55a2b] rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bulk Messaging Campaigns</h2>
            <p className="text-gray-500">Send SMS or Email campaigns to multiple leads at once</p>
          </div>
        </div>

        {/* Message Type Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setMessageType('sms');
              setSelectedTemplate('');
              setCustomMessage('');
              setSendMode('single');
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              messageType === 'sms'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            SMS Campaign
          </button>
          <button
            onClick={() => {
              setMessageType('email');
              setSelectedTemplate('');
              setCustomMessage('');
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              messageType === 'email'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Mail className="w-5 h-5" />
            Email Campaign
          </button>
        </div>

        {/* Send Mode Toggle (Email Only) */}
        {messageType === 'email' && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">Campaign Mode:</p>
            <div className="flex gap-3">
              <button
                onClick={() => setSendMode('single')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  sendMode === 'single'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 border hover:border-purple-300'
                }`}
              >
                <Send className="w-4 h-4" />
                Single Email
              </button>
              <button
                onClick={() => setSendMode('drip')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  sendMode === 'drip'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white text-gray-600 border hover:border-purple-300'
                }`}
              >
                <Calendar className="w-4 h-4" />
                9-Email Drip Campaign
              </button>
            </div>
            {sendMode === 'drip' && (
              <div className="mt-3 p-3 bg-white rounded-lg border text-sm">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-purple-700 mb-1">Drip Schedule (9 emails over 16 days):</p>
                    <p className="text-xs text-gray-500">Alternates between 9AM and 1PM EST</p>
                  </div>
                  <div className="flex-shrink-0">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Start at Step:</label>
                    <select
                      value={dripStartStep}
                      onChange={(e) => setDripStartStep(Number(e.target.value))}
                      className="px-3 py-1.5 border rounded-lg text-sm font-medium bg-purple-50 border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={1}>1/9 - "You've Been Approved"</option>
                      <option value={2}>2/9 - "You've Unlocked Access"</option>
                      <option value={3}>3/9 - "You've Been Invited"</option>
                      <option value={4}>4/9 - "Limited Time Offer"</option>
                      <option value={5}>5/9 - "Quick Question"</option>
                      <option value={6}>6/9 - "Fuel Your Growth"</option>
                      <option value={7}>7/9 - "Growth Potential"</option>
                      <option value={8}>8/9 - "60-Second Offer"</option>
                      <option value={9}>9/9 - "Seasonal Opportunity"</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <div className={dripStartStep <= 1 ? 'text-purple-600 font-medium' : 'text-gray-400'}>Day 0 (9AM): Email 1</div>
                  <div className={dripStartStep <= 2 ? 'text-purple-600 font-medium' : 'text-gray-400'}>Day 1 (1PM): Email 2</div>
                  <div className={dripStartStep <= 3 ? 'text-purple-600 font-medium' : 'text-gray-400'}>Day 2 (9AM): Email 3</div>
                  <div className={dripStartStep <= 4 ? 'text-purple-600 font-medium' : 'text-gray-400'}>Day 5 (1PM): Email 4</div>
                  <div className={dripStartStep <= 5 ? 'text-purple-600 font-medium' : 'text-gray-400'}>Day 6 (9AM): Email 5</div>
                  <div className={dripStartStep <= 6 ? 'text-purple-600 font-medium' : 'text-gray-400'}>Day 7 (1PM): Email 6</div>
                  <div className={dripStartStep <= 7 ? 'text-purple-600 font-medium' : 'text-gray-400'}>Day 13 (9AM): Email 7</div>
                  <div className={dripStartStep <= 8 ? 'text-purple-600 font-medium' : 'text-gray-400'}>Day 14 (1PM): Email 8</div>
                  <div className={dripStartStep <= 9 ? 'text-purple-600 font-medium' : 'text-gray-400'}>Day 15 (9AM): Email 9</div>
                </div>
                {dripStartStep > 1 && (
                  <p className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    Starting at step {dripStartStep}/9 - will send {10 - dripStartStep} emails total
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Template Selection (Single Mode Only) */}
        {sendMode === 'single' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  setCustomMessage('');
                  setCustomSubject('');
                }}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              >
                <option value="">-- Custom Message --</option>
                {(messageType === 'sms' ? smsCampaignTemplates : emailCampaignTemplates).map(t => (
                  <option key={t.id} value={t.id}>
                    {messageType === 'email' ? `${(t as any).step}/9: ` : ''}{t.name} - {t.description}
                  </option>
                ))}
              </select>

              {/* Preview Email Button and Inline Thumbnail */}
              {messageType === 'email' && selectedTemplate && (
                <div className="mt-3 space-y-3">
                  <button
                    onClick={() => setShowPreviewModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition"
                  >
                    <Eye className="w-5 h-5" />
                    Preview Full Email
                  </button>

                  {/* Inline Thumbnail Preview */}
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <div className="px-3 py-1.5 bg-gray-100 border-b text-xs font-medium text-gray-500 flex items-center justify-between">
                      <span>Template Preview</span>
                      <span className="text-purple-600">{selectedTemplateInfo?.step}/9</span>
                    </div>
                    <div className="relative h-[200px] overflow-hidden">
                      <iframe
                        src={getInlineThumbnailUrl()}
                        className="w-full border-0 pointer-events-none"
                        style={{
                          height: '600px',
                          transform: 'scale(0.33)',
                          transformOrigin: 'top left',
                          width: '300%',
                        }}
                        title="Template Thumbnail"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {messageType === 'email' && selectedTemplate ? 'Subject Line Preview' : 'Preview'}
              </label>
              <div className="p-4 bg-gray-50 rounded-lg border text-sm text-gray-600 min-h-[52px]">
                {getMessagePreview() || 'Select a template or write a custom message'}
              </div>
            </div>
          </div>
        )}

        {/* Drip Mode Info */}
        {sendMode === 'drip' && (
          <div className="space-y-3">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-purple-900">Automated Drip Campaign</p>
                  <p className="text-sm text-purple-700 mt-1">
                    Select leads below and click "Start Drip Campaign" to automatically send all 9 email templates over 16 days.
                    Emails stop automatically if a lead bounces or completes the sequence.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats summary */}
            <div className="p-3 bg-gray-100 rounded-lg flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span><strong>{leads.length}</strong> total leads</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-500" />
                <span><strong>{leadsWithEmail.length}</strong> have email</span>
              </div>
              {leadsWithoutEmail.length > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span><strong>{leadsWithoutEmail.length}</strong> missing email</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-purple-600">
                <Zap className="w-4 h-4" />
                <span><strong>{leadsInDrip.length}</strong> in drip</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <CheckCircle className="w-4 h-4" />
                <span><strong>{leadsEligibleForDrip.length}</strong> eligible</span>
              </div>
            </div>
          </div>
        )}

        {/* Custom Message Input (Single Mode Only) */}
        {sendMode === 'single' && !selectedTemplate && (
          <div className="mt-4 space-y-4">
            {messageType === 'email' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Use {firstName}, {lastName}, {businessName} for personalization"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {messageType === 'sms' ? 'SMS Message' : 'Email Content'}
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Use {firstName}, {lastName}, {businessName} for personalization"
                rows={4}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
              {messageType === 'sms' && (
                <p className="text-xs text-gray-500 mt-1">
                  {customMessage.length} characters
                  {customMessage.length > 160 && ' (will be sent as multiple messages)'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Drip Result */}
      {dripResult && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-800 font-semibold">
                Drip campaign started for {dripResult.started} lead{dripResult.started !== 1 ? 's' : ''}
              </p>

              {/* Skip breakdown */}
              {dripResult.skipped > 0 && dripResult.skipBreakdown && (
                <div className="mt-2 text-sm space-y-1">
                  <p className="text-amber-700 font-medium">{dripResult.skipped} skipped:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {dripResult.skipBreakdown.noEmail > 0 && (
                      <span className="text-gray-600">• {dripResult.skipBreakdown.noEmail} no email</span>
                    )}
                    {dripResult.skipBreakdown.alreadyInDrip > 0 && (
                      <span className="text-gray-600">• {dripResult.skipBreakdown.alreadyInDrip} already in drip</span>
                    )}
                    {dripResult.skipBreakdown.emailBounced > 0 && (
                      <span className="text-gray-600">• {dripResult.skipBreakdown.emailBounced} email bounced</span>
                    )}
                    {dripResult.skipBreakdown.notFound > 0 && (
                      <span className="text-gray-600">• {dripResult.skipBreakdown.notFound} not found</span>
                    )}
                    {dripResult.skipBreakdown.startFunctionFailed > 0 && (
                      <span className="text-gray-600">• {dripResult.skipBreakdown.startFunctionFailed} failed</span>
                    )}
                  </div>
                </div>
              )}

              {/* Verification stats */}
              {dripResult.verification && (
                <div className="mt-2 pt-2 border-t border-green-200 text-xs text-green-700">
                  <p className="font-medium">Database Status:</p>
                  <p>{dripResult.verification.totalLeadsInDB} total leads • {dripResult.verification.totalWithEmail} with email • <strong>{dripResult.verification.totalInDripNow} in drip</strong></p>
                </div>
              )}
            </div>
            <button
              onClick={() => setDripResult(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Lead Selection */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b bg-gray-50 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            >
              <option value="all">All Stages</option>
              {Object.entries(stageLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            >
              <option value="all">All Status</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            {leadsInDrip.length > 0 && (
              <span className="text-sm text-purple-600 font-medium">
                {leadsInDrip.length} in drip
              </span>
            )}
            {sendMode === 'drip' && leadsEligibleForDrip.length > 0 && (
              <button
                onClick={() => {
                  const eligibleIds = new Set(leadsEligibleForDrip.map(l => l.id));
                  setSelectedLeads(eligibleIds);
                }}
                className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
              >
                Select {leadsEligibleForDrip.length} Eligible
              </button>
            )}
          </div>

          {/* Selection Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#FF6B35]"
              >
                {selectedLeads.size === leads.length && leads.length > 0 ? (
                  <CheckSquare className="w-5 h-5 text-[#FF6B35]" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
                Select All
              </button>
              <span className="text-sm text-gray-500">
                {selectedLeads.size} of {leads.length} selected
                {leadsWithValidContact.length < leads.length && (
                  <span className="text-amber-600 ml-2">
                    ({leadsWithValidContact.length} have valid {messageType === 'sms' ? 'phone' : 'email'})
                  </span>
                )}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {sendMode === 'drip' && messageType === 'email' ? (
                <button
                  onClick={startDripCampaign}
                  disabled={startingDrip || selectedLeads.size === 0}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition ${
                    startingDrip || selectedLeads.size === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                  }`}
                >
                  {startingDrip ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Start at {dripStartStep}/9 for {selectedLeads.size} Lead{selectedLeads.size !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={sendBulkMessages}
                  disabled={sending || selectedLeads.size === 0 || (!selectedTemplate && !customMessage)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition ${
                    sending || selectedLeads.size === 0 || (!selectedTemplate && !customMessage)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : messageType === 'sms'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send to {selectedLeads.size} Lead{selectedLeads.size !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Send Result */}
        {sendResult && (
          <div className={`p-4 border-b ${sendResult.failed > 0 ? 'bg-amber-50' : 'bg-green-50'}`}>
            <div className="flex items-center gap-3">
              {sendResult.failed > 0 ? (
                <AlertCircle className="w-5 h-5 text-amber-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              <span className={sendResult.failed > 0 ? 'text-amber-800' : 'text-green-800'}>
                Campaign sent: {sendResult.success} successful, {sendResult.failed} failed out of {sendResult.total} total
              </span>
              <button
                onClick={() => setSendResult(null)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Lead List */}
        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Users className="w-12 h-12 mb-2 opacity-50" />
              <p>No leads found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="w-12 px-4 py-3"></th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Business</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                    {messageType === 'sms' ? 'Phone' : 'Email'}
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stage</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Drip</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map((lead) => {
                  const hasValidContact = messageType === 'sms' ? lead.phone : lead.email;
                  const inDrip = lead.dripCampaign;
                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-gray-50 transition ${!hasValidContact ? 'opacity-50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => hasValidContact && toggleLead(lead.id)}
                          disabled={!hasValidContact}
                          className={!hasValidContact ? 'cursor-not-allowed' : 'cursor-pointer'}
                        >
                          {selectedLeads.has(lead.id) ? (
                            <CheckSquare className="w-5 h-5 text-[#FF6B35]" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-300" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">
                          {lead.firstName} {lead.lastName}
                        </span>
                        {lead.emailBounced && (
                          <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded">
                            Bounced
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {lead.businessName || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {messageType === 'sms' ? (lead.phone || '-') : (lead.email || '-')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {stageLabels[lead.stage]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {inDrip ? (
                          <div className="flex items-center gap-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              lead.dripPaused
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {lead.dripStep || 0}/{lead.dripTotalSteps || 9}
                            </span>
                            {lead.dripPaused && (
                              <Pause className="w-3 h-3 text-amber-600" />
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {inDrip && (
                          <div className="flex items-center gap-1">
                            {lead.dripPaused ? (
                              <button
                                onClick={() => manageDrip(lead.id, 'resume')}
                                className="p-1 hover:bg-green-100 rounded text-green-600"
                                title="Resume drip"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => manageDrip(lead.id, 'pause')}
                                className="p-1 hover:bg-amber-100 rounded text-amber-600"
                                title="Pause drip"
                              >
                                <Pause className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => manageDrip(lead.id, 'stop')}
                              className="p-1 hover:bg-red-100 rounded text-red-600"
                              title="Stop drip"
                            >
                              <StopCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50 text-sm text-gray-500 text-center">
          <span className="font-medium">{leads.length}</span> leads total
          {messageType === 'email' && (
            <>
              <span className="mx-1">•</span>
              <span className="text-green-600">{leadsWithEmail.length} with email</span>
              {leadsWithoutEmail.length > 0 && (
                <>
                  <span className="mx-1">•</span>
                  <span className="text-red-600">{leadsWithoutEmail.length} no email</span>
                </>
              )}
              <span className="mx-1">•</span>
              <span className="text-purple-600 font-medium">{leadsInDrip.length} in drip</span>
              {sendMode === 'drip' && leadsEligibleForDrip.length > 0 && (
                <>
                  <span className="mx-1">•</span>
                  <span className="text-blue-600">{leadsEligibleForDrip.length} eligible to start</span>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Campaign Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use personalization tags like {'{firstName}'} and {'{businessName}'} for better engagement</li>
          <li>• SMS messages over 160 characters will be split into multiple messages</li>
          <li>• Filter leads by stage to target specific funnel positions</li>
          <li>• Test campaigns with a small group before sending to all leads</li>
          {messageType === 'email' && (
            <>
              <li>• Click "Preview Full Email" to see exactly how your email will look before sending</li>
              <li>• Use drip campaigns for automated multi-day email sequences</li>
              <li>• Leads automatically stop receiving drips if their email bounces</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
