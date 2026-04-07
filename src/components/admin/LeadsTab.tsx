'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, Phone, Mail, MessageSquare, X, Send,
  User, Loader2, RefreshCw, StickyNote, Eye, Download, FileText, CheckCircle, DollarSign
} from 'lucide-react';

// Types
type LeadStage = 'quote' | 'application' | 'dlvc' | 'approved' | 'funded';
type LeadStatus = 'new' | 'contacted' | 'in_review' | 'approved' | 'funded' | 'lost';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneVerified?: boolean;
  businessName: string;
  businessType?: string;
  monthlyRevenue?: string;
  fundingAmount?: string;
  stage: LeadStage;
  status: LeadStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  quoteSubmittedAt?: string;
  applicationSubmittedAt?: string;
  dlvcSubmittedAt?: string;
  documentsComplete?: boolean;
  documents?: {
    bankStatement1?: boolean;
    bankStatement2?: boolean;
    bankStatement3?: boolean;
    driversLicense?: boolean;
    voidCheck?: boolean;
  };
}

interface LeadDocument {
  id: string;
  leadId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  docType: string;
  uploadedAt: string;
}

interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  createdAt: string;
}

interface LeadMessage {
  id: string;
  leadId: string;
  type: 'sms' | 'email';
  subject?: string;
  content: string;
  status: string;
  sentAt: string;
  templateId?: string;
  templateName?: string;
}

// Stage config
const stageConfig: Record<LeadStage, { label: string; color: string }> = {
  quote: { label: 'Quote', color: 'bg-gray-100 text-gray-700' },
  application: { label: 'Application', color: 'bg-blue-100 text-blue-700' },
  dlvc: { label: 'DLVC', color: 'bg-orange-100 text-orange-700' },
  approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700' },
  funded: { label: 'Funded', color: 'bg-green-100 text-green-700' },
};

// Status config
const statusConfig: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-purple-100 text-purple-700' },
  contacted: { label: 'Contacted', color: 'bg-blue-100 text-blue-700' },
  in_review: { label: 'In Review', color: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700' },
  funded: { label: 'Funded', color: 'bg-emerald-100 text-emerald-700' },
  lost: { label: 'Lost', color: 'bg-red-100 text-red-700' },
};

// SMS Templates
const smsTemplates = [
  { id: 'follow_up', label: 'Follow Up', message: 'Hi {firstName}! This is Toast Capital following up on your funding application. Call us at (617) 533-3190!' },
  { id: 'docs_reminder', label: 'Docs Reminder', message: 'Hi {firstName}! Upload your documents here to complete your application: toastcap.com/dlvc' },
  { id: 'approval', label: 'Approval', message: 'Great news {firstName}! Your funding has been approved! Call us at (617) 533-3190 to finalize.' },
];

// Email Templates for the dropdown - Original Style
const emailTemplatesOriginal = [
  { id: 'custom', label: '-- Custom Email --', subject: '', templateId: '', isV2: false },
  { id: 'cold_approved', label: "1. You've Been Approved", subject: "You've Been Approved for a Toast Lending Offer!", templateId: 'cold_approved', isV2: false },
  { id: 'cold_unlocked', label: "2. [UNLOCKED] Improved Terms", subject: "[UNLOCKED] We've Improved Your Funding Terms!", templateId: 'cold_unlocked', isV2: false },
  { id: 'cold_better_terms', label: "3. [UNLOCKED] Better Terms", subject: "[UNLOCKED] Your Terms Have Been Upgraded!", templateId: 'cold_better_terms', isV2: false },
  { id: 'cold_special_access', label: "4. Special Access", subject: "{firstName}, You've Unlocked a Special Funding Offer!", templateId: 'cold_special_access', isV2: false },
  { id: 'cold_invited', label: "5. You've Been Invited", subject: "You've been invited to apply for a Toast Capital Loan", templateId: 'cold_invited', isV2: false },
  { id: 'cold_limited', label: "6. Limited Time Offer", subject: "Don't Miss Out on This Opportunity", templateId: 'cold_limited', isV2: false },
  { id: 'cold_question', label: "7. Quick Question", subject: "Quick question for you", templateId: 'cold_question', isV2: false },
  { id: 'cold_growth', label: "8. Fuel Your Growth", subject: "What Could {businessName} Accomplish With Extra Capital?", templateId: 'cold_growth', isV2: false },
  { id: 'cold_potential', label: "9. Growth Potential", subject: "What's holding {businessName} back from its next level?", templateId: 'cold_potential', isV2: false },
  { id: 'cold_60sec', label: "10. 60-Second Offer", subject: "60 seconds to see your funding offer", templateId: 'cold_60sec', isV2: false },
  { id: 'cold_seasonal', label: "11. Seasonal Opportunity", subject: "Peak season is coming. Is {businessName} ready?", templateId: 'cold_seasonal', isV2: false },
];

// Email Templates for the dropdown - V2 Website Style
const emailTemplatesV2 = [
  { id: 'custom', label: '-- Custom Email --', subject: '', templateId: '', isV2: false },
  { id: 'cold_approved_v2', label: "1. You've Been Approved (V2)", subject: "You've Been Approved for a Toast Lending Offer!", templateId: 'cold_approved_v2', isV2: true },
  { id: 'cold_unlocked_v2', label: "2. [UNLOCKED] Improved Terms (V2)", subject: "[UNLOCKED] We've Improved Your Funding Terms!", templateId: 'cold_unlocked_v2', isV2: true },
  { id: 'cold_better_terms_v2', label: "3. [UNLOCKED] Better Terms (V2)", subject: "[UNLOCKED] Your Terms Have Been Upgraded!", templateId: 'cold_better_terms_v2', isV2: true },
  { id: 'cold_special_access_v2', label: "4. Special Access (V2)", subject: "{firstName}, You've Unlocked a Special Funding Offer!", templateId: 'cold_special_access_v2', isV2: true },
  { id: 'cold_invited_v2', label: "5. You've Been Invited (V2)", subject: "You've been invited to apply for a Toast Capital Loan", templateId: 'cold_invited_v2', isV2: true },
  { id: 'cold_limited_v2', label: "6. Limited Time Offer (V2)", subject: "Don't Miss Out on This Opportunity", templateId: 'cold_limited_v2', isV2: true },
  { id: 'cold_question_v2', label: "7. Quick Question (V2)", subject: "Quick question for you", templateId: 'cold_question_v2', isV2: true },
  { id: 'cold_growth_v2', label: "8. Fuel Your Growth (V2)", subject: "What Could {businessName} Accomplish With Extra Capital?", templateId: 'cold_growth_v2', isV2: true },
  { id: 'cold_potential_v2', label: "9. Growth Potential (V2)", subject: "What's holding {businessName} back from its next level?", templateId: 'cold_potential_v2', isV2: true },
  { id: 'cold_60sec_v2', label: "10. 60-Second Offer (V2)", subject: "60 seconds to see your funding offer", templateId: 'cold_60sec_v2', isV2: true },
  { id: 'cold_seasonal_v2', label: "11. Seasonal Opportunity (V2)", subject: "Peak season is coming. Is {businessName} ready?", templateId: 'cold_seasonal_v2', isV2: true },
];

// Combined email templates (default to original)
const emailTemplates = emailTemplatesOriginal;

// Email template content for preview
const emailTemplateContent: Record<string, string> = {
  cold_approved: `Hi {firstName},

Great news! You've been approved for a Toast Lending offer. To view your terms and finalize your funding, reply to this email or call us at (617) 533-3190.

Looking forward to helping {businessName} grow!

Best,
Toast Capital Team`,
  cold_unlocked: `Hi {firstName},

We've unlocked improved funding terms for you! Reply to this email or call us at (617) 533-3190 to see your new offer.

Best,
Toast Capital Team`,
  cold_better_terms: `Hi {firstName},

Your funding terms have been upgraded! Let's discuss how Toast Capital can help {businessName} reach its goals.

Reply or call (617) 533-3190.

Best,
Toast Capital Team`,
  cold_special_access: `Hi {firstName},

Great news! As a valued Toast customer, {businessName} has unlocked exclusive access to Toast Capital funding based on your POS performance.

You've unlocked: $2K - $2M funding range with next-day funding speed!

No cost to apply, no obligation to accept, and no impact on your credit score.

Reply to this email or call (617) 533-3190 to check your offer.

Best,
Toast Capital Team`,
  cold_invited: `Hi {firstName},

You've been invited to apply for a Toast Capital loan. It's quick and easy—reply to this email or call us at (617) 533-3190.

Best,
Toast Capital Team`,
  cold_limited: `Hi {firstName},

This is a limited time opportunity for {businessName}. Don't miss out—reply to this email or call (617) 533-3190 to learn more.

Best,
Toast Capital Team`,
  cold_question: `Hi {firstName},

Quick question: Is {businessName} looking for extra capital this season? Reply to this email or call (617) 533-3190.

Best,
Toast Capital Team`,
  cold_growth: `Hi {firstName},

What could {businessName} accomplish with extra capital? Let's talk about your options—reply to this email or call (617) 533-3190.

Best,
Toast Capital Team`,
  cold_potential: `Hi {firstName},

What's holding {businessName} back from its next level? Toast Capital can help you unlock growth. Reply or call (617) 533-3190.

Best,
Toast Capital Team`,
  cold_60sec: `Hi {firstName},

It takes just 60 seconds to see your funding offer. Reply to this email or call (617) 533-3190 to get started.

Best,
Toast Capital Team`,
  cold_seasonal: `Hi {firstName},

Peak season is coming. Is {businessName} ready? Let's discuss funding options—reply to this email or call (617) 533-3190.

Best,
Toast Capital Team`,
};

export default function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [documents, setDocuments] = useState<LeadDocument[]>([]);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'pipeline'>('table');

  // Modal states
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [smsContent, setSmsContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [sending, setSending] = useState(false);

  // Email template dropdown state
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState('custom');
  const [emailHtmlPreview, setEmailHtmlPreview] = useState<string>('');
  const [loadingEmailPreview, setLoadingEmailPreview] = useState(false);
  const [useV2Templates, setUseV2Templates] = useState(false);

  // Get the active email templates based on V2 toggle
  const activeEmailTemplates = useV2Templates ? emailTemplatesV2 : emailTemplatesOriginal;

  // Approval modal state
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalData, setApprovalData] = useState({
    approvedAmount: '',
    term: '12 months',
    repaymentType: 'weekly' as 'daily' | 'weekly',
    repaymentAmount: '',
    feeAmount: '',
    feePercent: '',
    totalPayback: '',
    lendingPartner: '',
    verificationLink: '',
  });
  const [approving, setApproving] = useState(false);

  // Note state
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (stageFilter !== 'all') params.append('stage', stageFilter);
      if (searchQuery) params.append('search', searchQuery);
      const response = await fetch(`/api/leads?${params.toString()}`);
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  }, [stageFilter, searchQuery]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const fetchLeadDetails = async (leadId: string) => {
    setDetailsLoading(true);
    try {
      const response = await fetch(`/api/leads/${leadId}`);
      const data = await response.json();
      setDocuments(data.documents || []);
      setNotes(data.notes || []);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch lead details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    fetchLeadDetails(lead.id);
  };

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchLeads();
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const sendSms = async () => {
    if (!selectedLead || !smsContent.trim()) return;
    setSending(true);
    try {
      const response = await fetch(`/api/leads/${selectedLead.id}/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: smsContent }),
      });
      if (response.ok) {
        setShowSmsModal(false);
        setSmsContent('');
        alert('SMS sent!');
      } else {
        const data = await response.json();
        alert(`Failed: ${data.error}`);
      }
    } catch {
      alert('Failed to send SMS');
    } finally {
      setSending(false);
    }
  };

  const sendEmail = async () => {
    if (!selectedLead || !emailSubject.trim()) return;
    setSending(true);
    try {
      const payload: any = { subject: emailSubject };
      if (selectedEmailTemplate !== 'custom') {
        payload.template = selectedEmailTemplate;
      } else {
        payload.html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <img src="https://toastcap.com/toast-capital-logo.png" alt="Toast Capital" width="180" style="margin-bottom: 20px;">
  ${emailContent.split('\n').map(line => `<p style="color: #374151; line-height: 1.6; margin: 0 0 12px;">${line}</p>`).join('')}
  <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">Best regards,<br>The Toast Capital Team</p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
  <p style="color: #9ca3af; font-size: 12px; text-align: center;">Toast Capital | 333 Summer Street, Boston, MA 02210</p>
</body>
</html>`;
      }
      const response = await fetch(`/api/leads/${selectedLead.id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setShowEmailModal(false);
        setEmailSubject('');
        setEmailContent('');
        setSelectedEmailTemplate('custom');
        fetchLeadDetails(selectedLead.id);
        alert('Email sent!');
      } else {
        const data = await response.json();
        alert(`Failed: ${data.error}`);
      }
    } catch {
      alert('Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const addNote = async () => {
    if (!selectedLead || !newNote.trim()) return;
    setAddingNote(true);
    try {
      await fetch(`/api/leads/${selectedLead.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      });
      setNewNote('');
      fetchLeadDetails(selectedLead.id);
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setAddingNote(false);
    }
  };

  const approveLead = async () => {
    if (!selectedLead || !approvalData.approvedAmount || !approvalData.repaymentAmount) {
      alert('Please fill in all approval details');
      return;
    }
    setApproving(true);
    try {
      const response = await fetch('/api/leads/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          approvedAmount: approvalData.approvedAmount,
          term: approvalData.term,
          repaymentType: approvalData.repaymentType,
          repaymentAmount: approvalData.repaymentAmount,
          feeAmount: approvalData.feeAmount || undefined,
          feePercent: approvalData.feePercent || undefined,
          totalPayback: approvalData.totalPayback || undefined,
          lendingPartner: approvalData.lendingPartner || undefined,
          verificationLink: approvalData.verificationLink || undefined,
          sendEmail: true,
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchLeads();
        alert(`Approval email sent successfully to ${selectedLead.email}! You can send another email with different terms or close this modal.`);
        setSelectedLead({ ...selectedLead, stage: 'approved' as LeadStage, status: 'approved' as LeadStatus });
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to approve lead:', error);
      alert('Failed to approve lead');
    } finally {
      setApproving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const handleEmailTemplateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    setSelectedEmailTemplate(templateId);
    if (templateId === 'custom') {
      setEmailSubject('');
      setEmailContent('');
      setEmailHtmlPreview('');
      return;
    }
    const template = activeEmailTemplates.find(t => t.id === templateId);
    if (template) {
      const subject = template.subject
        .replace(/{firstName}/g, selectedLead?.firstName || 'there')
        .replace(/{businessName}/g, selectedLead?.businessName || 'your business');
      setEmailSubject(subject);
      setLoadingEmailPreview(true);
      try {
        const firstName = selectedLead?.firstName || 'there';
        const businessName = selectedLead?.businessName || 'your business';
        const response = await fetch(`/api/campaigns/preview?templateId=${templateId}&firstName=${encodeURIComponent(firstName)}&businessName=${encodeURIComponent(businessName)}`);
        const data = await response.json();
        setEmailHtmlPreview(data.html || '');
        setEmailContent('(Using HTML template)');
      } catch (error) {
        console.error('Failed to fetch email preview:', error);
        setEmailHtmlPreview('');
        const content = (emailTemplateContent[templateId] || '')
          .replace(/{firstName}/g, selectedLead?.firstName || 'there')
          .replace(/{businessName}/g, selectedLead?.businessName || 'your business');
        setEmailContent(content);
      } finally {
        setLoadingEmailPreview(false);
      }
    }
  };

  const renderEmailPreview = () => {
    if (selectedEmailTemplate === 'custom' || !selectedEmailTemplate) return null;
    if (loadingEmailPreview) {
      return (
        <div className="bg-gray-50 rounded-lg p-4 mt-2 border flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-purple-500 mr-2" />
          <span className="text-sm text-gray-500">Loading preview...</span>
        </div>
      );
    }
    if (emailHtmlPreview) {
      return (
        <div className="mt-2 border rounded-lg overflow-hidden">
          <div className="bg-purple-50 px-3 py-2 border-b flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600">HTML Email Preview</span>
          </div>
          <div className="bg-gray-100 p-2">
            <iframe srcDoc={emailHtmlPreview} className="w-full border-0 rounded bg-white" style={{ height: '300px' }} title="Email Preview" />
          </div>
        </div>
      );
    }
    const template = activeEmailTemplates.find(t => t.id === selectedEmailTemplate);
    if (!template) return null;
    let preview = emailTemplateContent[selectedEmailTemplate] || '';
    preview = preview.replace(/{firstName}/g, selectedLead?.firstName || 'there').replace(/{businessName}/g, selectedLead?.businessName || 'your business');
    return (
      <div className="bg-gray-50 rounded-lg p-3 mt-2 border">
        <div className="text-xs font-semibold text-gray-500 mb-1">Preview (Plain Text)</div>
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">{preview}</pre>
      </div>
    );
  };

  const stageCounts = {
    quote: leads.filter(l => l.stage === 'quote').length,
    application: leads.filter(l => l.stage === 'application').length,
    dlvc: leads.filter(l => l.stage === 'dlvc').length,
    approved: leads.filter(l => l.stage === 'approved').length,
    funded: leads.filter(l => l.stage === 'funded').length,
  };

  const renderPipelineView = () => (
    <div className="p-4 overflow-x-auto">
      <div className="flex gap-4 min-w-max">
        {(['quote', 'application', 'dlvc', 'approved', 'funded'] as LeadStage[]).map((stage) => {
          const stageLeads = leads.filter(l => l.stage === stage);
          const config = stageConfig[stage];
          const bgColor = stage === 'quote' ? 'bg-gray-100' : stage === 'application' ? 'bg-blue-100' : stage === 'dlvc' ? 'bg-orange-100' : stage === 'approved' ? 'bg-emerald-100' : 'bg-green-100';
          const bgLightColor = stage === 'quote' ? 'bg-gray-50' : stage === 'application' ? 'bg-blue-50' : stage === 'dlvc' ? 'bg-orange-50' : stage === 'approved' ? 'bg-emerald-50' : 'bg-green-50';
          const hoverColor = stage === 'quote' ? 'hover:border-[#FF6B35]' : stage === 'application' ? 'hover:border-blue-500' : stage === 'dlvc' ? 'hover:border-orange-500' : stage === 'approved' ? 'hover:border-emerald-500' : 'hover:border-green-500';
          return (
            <div key={stage} className="w-64 flex-shrink-0">
              <div className={`${bgColor} rounded-t-lg p-3 flex items-center justify-between`}>
                <span className={`font-semibold ${config.color.split(' ')[1]}`}>{config.label}</span>
                <span className={`${bgColor} ${config.color.split(' ')[1]} px-2 py-0.5 rounded-full text-xs font-medium`}>{stageCounts[stage]}</span>
              </div>
              <div className={`${bgLightColor} rounded-b-lg p-2 space-y-2 max-h-[500px] overflow-y-auto`}>
                {stageLeads.slice(0, 20).map(lead => (
                  <button key={lead.id} onClick={() => handleSelectLead(lead)} className={`w-full text-left p-3 bg-white rounded-lg border ${hoverColor} transition ${selectedLead?.id === lead.id ? 'border-[#FF6B35] ring-1 ring-[#FF6B35]' : ''}`}>
                    <p className="font-medium text-sm text-gray-900 truncate">{lead.firstName} {lead.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{lead.businessName}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(lead.createdAt)}</p>
                  </button>
                ))}
                {stageCounts[stage] > 20 && <p className="text-xs text-gray-400 text-center py-2">+{stageCounts[stage] - 20} more</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className={`${selectedLead ? 'w-2/3' : 'w-full'} flex flex-col`}>
        <div className="p-4 border-b flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name, email, phone, or business..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]" />
          </div>
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]">
            <option value="all">All Stages</option>
            {(['quote', 'application', 'dlvc', 'approved', 'funded'] as LeadStage[]).map(s => (
              <option key={s} value={s}>{stageConfig[s].label} ({stageCounts[s]})</option>
            ))}
          </select>
          <div className="flex border rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('table')} className={`px-3 py-2 text-sm font-medium ${viewMode === 'table' ? 'bg-[#FF6B35] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Table</button>
            <button onClick={() => setViewMode('pipeline')} className={`px-3 py-2 text-sm font-medium ${viewMode === 'pipeline' ? 'bg-[#FF6B35] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Pipeline</button>
          </div>
          <button onClick={fetchLeads} className="p-2 border rounded-lg hover:bg-gray-50" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
        </div>
        {viewMode === 'pipeline' && !loading && renderPipelineView()}
        {viewMode === 'table' && (
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500"><User className="w-12 h-12 mb-2 opacity-50" /><p className="font-medium">No leads found</p><p className="text-sm">Leads appear here when forms are submitted</p></div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Business</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stage</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leads.map((lead) => (
                    <tr key={lead.id} onClick={() => handleSelectLead(lead)} className={`cursor-pointer hover:bg-gray-50 transition ${selectedLead?.id === lead.id ? 'bg-orange-50' : ''}`}>
                      <td className="px-4 py-3"><span className="font-medium text-gray-900">{lead.firstName || lead.lastName ? `${lead.firstName || ''} ${lead.lastName || ''}`.trim() : <span className="text-gray-400 italic">No name</span>}</span></td>
                      <td className="px-4 py-3 text-gray-600">{lead.businessName || <span className="text-gray-400">-</span>}</td>
                      <td className="px-4 py-3">{lead.phone ? <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:underline text-sm">{lead.phone}</a> : <span className="text-gray-400">-</span>}</td>
                      <td className="px-4 py-3">{lead.email ? <span className="text-gray-600 text-sm truncate max-w-[200px] block">{lead.email}</span> : <span className="text-gray-400">-</span>}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${stageConfig[lead.stage].color}`}>{stageConfig[lead.stage].label}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(lead.updatedAt || lead.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        <div className="p-3 border-t bg-gray-50 text-sm text-gray-500 text-center">{leads.length} lead{leads.length !== 1 ? 's' : ''} {viewMode === 'pipeline' && '| Pipeline View'}</div>
      </div>

      {selectedLead && (
        <div className="w-1/3 border-l flex flex-col bg-white">
          <div className="p-4 border-b">
            <div className="flex items-start justify-between">
              <div><h2 className="text-lg font-bold text-gray-900">{selectedLead.firstName} {selectedLead.lastName}</h2><p className="text-sm text-gray-500">{selectedLead.businessName}</p></div>
              <button onClick={() => setSelectedLead(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex gap-2 mt-4">
              {selectedLead.phone && <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"><Phone className="w-4 h-4" />Call</a>}
              {selectedLead.phone && <button onClick={() => setShowSmsModal(true)} className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"><MessageSquare className="w-4 h-4" />SMS</button>}
              {selectedLead.email && <button onClick={() => setShowEmailModal(true)} className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"><Mail className="w-4 h-4" />Email</button>}
              <button onClick={() => setShowApprovalModal(true)} className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"><CheckCircle className="w-4 h-4" />{selectedLead.stage === 'approved' || selectedLead.stage === 'funded' ? 'Send Approval' : 'Approve'}</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {detailsLoading ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div> : (
              <>
                <div className="bg-gray-50 rounded-lg p-3"><h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Contact</h3><div className="space-y-1 text-sm"><p><span className="text-gray-500">Email:</span> {selectedLead.email || 'N/A'}</p><p><span className="text-gray-500">Phone:</span> {selectedLead.phone || 'N/A'}</p><p><span className="text-gray-500">Revenue:</span> {selectedLead.monthlyRevenue || 'N/A'}</p></div></div>
                <div className="bg-gray-50 rounded-lg p-3"><h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Status</h3><div className="flex flex-wrap gap-1">{Object.entries(statusConfig).map(([key, config]) => (<button key={key} onClick={() => updateLeadStatus(selectedLead.id, key as LeadStatus)} className={`px-2 py-1 rounded text-xs font-medium transition ${selectedLead.status === key ? config.color : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>{config.label}</button>))}</div></div>
                <div className="bg-gray-50 rounded-lg p-3"><h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Documents ({documents.length})</h3>{documents.length === 0 ? <p className="text-sm text-gray-400">No documents</p> : <div className="space-y-2">{documents.map((doc) => (<div key={doc.id} className="flex items-center justify-between p-2 bg-white rounded border"><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /><div><p className="text-sm font-medium truncate max-w-[150px]">{doc.fileName}</p><p className="text-xs text-gray-400">{formatFileSize(doc.fileSize)}</p></div></div><div className="flex gap-1"><a href={`/api/leads/${selectedLead.id}/documents/${doc.id}`} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded"><Eye className="w-4 h-4" /></a><a href={`/api/leads/${selectedLead.id}/documents/${doc.id}`} download={doc.fileName} className="p-1 hover:bg-gray-100 rounded"><Download className="w-4 h-4" /></a></div></div>))}</div>}</div>
                <div className="bg-purple-50 rounded-lg p-3 mb-3"><h3 className="text-xs font-semibold text-purple-600 uppercase mb-2 flex items-center gap-1"><Mail className="w-3 h-3" />Email History ({messages.filter(m => m.type === 'email').length})</h3>{messages.filter(m => m.type === 'email').length === 0 ? <p className="text-xs text-gray-500 italic">No emails sent yet</p> : <div className="space-y-2 max-h-48 overflow-y-auto">{messages.filter(m => m.type === 'email').map((msg) => (<div key={msg.id} className="p-2 bg-white rounded border text-sm"><div className="flex items-start justify-between gap-2"><div className="flex-1 min-w-0"><p className="font-medium text-gray-900 truncate" title={msg.subject}>{msg.subject || 'No subject'}</p>{msg.templateName && <span className="inline-block mt-1 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">{msg.templateName}</span>}</div><span className={`flex-shrink-0 px-1.5 py-0.5 text-xs rounded ${msg.status === 'sent' || msg.status === 'delivered' ? 'bg-green-100 text-green-700' : msg.status === 'opened' || msg.status === 'clicked' ? 'bg-blue-100 text-blue-700' : msg.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{msg.status}</span></div><p className="text-xs text-gray-400 mt-1">{formatDate(msg.sentAt)}</p></div>))}</div>}</div>
                <div className="bg-gray-50 rounded-lg p-3"><h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Notes ({notes.length})</h3><div className="space-y-2 mb-3">{notes.map((note) => (<div key={note.id} className="p-2 bg-white rounded border text-sm"><p>{note.content}</p><p className="text-xs text-gray-400 mt-1">{formatDate(note.createdAt)}</p></div>))}</div><div className="flex gap-2"><input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note..." className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]" onKeyDown={(e) => e.key === 'Enter' && addNote()} /><button onClick={addNote} disabled={addingNote || !newNote.trim()} className="px-3 py-2 bg-[#FF6B35] text-white rounded text-sm font-medium hover:bg-[#e55a2b] disabled:opacity-50">{addingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}</button></div></div>
              </>
            )}
          </div>
        </div>
      )}

      {showSmsModal && selectedLead && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-xl p-6 w-full max-w-md mx-4"><h3 className="text-lg font-bold mb-4">Send SMS to {selectedLead.firstName}</h3><div className="space-y-4"><div><label className="text-sm font-medium text-gray-700">Quick Template</label><select onChange={(e) => { const tpl = smsTemplates.find(t => t.id === e.target.value); if (tpl) setSmsContent(tpl.message.replace(/{firstName}/g, selectedLead.firstName || 'there').replace(/{businessName}/g, selectedLead.businessName || 'your business')); }} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"><option value="">Select template...</option>{smsTemplates.map((t) => (<option key={t.id} value={t.id}>{t.label}</option>))}</select></div><div><label className="text-sm font-medium text-gray-700">Message</label><textarea value={smsContent} onChange={(e) => setSmsContent(e.target.value)} rows={4} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="Type your message..." /></div><div className="flex gap-2 justify-end"><button onClick={() => setShowSmsModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button><button onClick={sendSms} disabled={sending || !smsContent.trim()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">{sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}Send</button></div></div></div></div>)}

      {showEmailModal && selectedLead && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4"><h3 className="text-lg font-bold mb-4">Send Email to {selectedLead.firstName}</h3><div className="space-y-4"><div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border"><div><p className="text-sm font-medium text-gray-700">Email Style</p><p className="text-xs text-gray-500">{useV2Templates ? 'V2 Website Style (orange banner, clean layout)' : 'Original Style (centered card)'}</p></div><button onClick={() => { setUseV2Templates(!useV2Templates); setSelectedEmailTemplate('custom'); setEmailHtmlPreview(''); }} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${useV2Templates ? 'bg-orange-500' : 'bg-gray-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useV2Templates ? 'translate-x-6' : 'translate-x-1'}`} /></button></div><div><div className="flex items-center justify-between"><label className="text-sm font-medium text-gray-700">Template</label>{useV2Templates && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">V2 Website Style</span>}</div><select value={selectedEmailTemplate} onChange={handleEmailTemplateChange} className={`w-full mt-1 px-3 py-2 border rounded-lg text-sm ${useV2Templates ? 'border-orange-300 focus:ring-orange-500' : ''}`}>{activeEmailTemplates.map((t) => (<option key={t.id} value={t.id}>{t.label}</option>))}</select>{renderEmailPreview()}</div><div><label className="text-sm font-medium text-gray-700">Subject</label><input type="text" value={emailSubject} onChange={(e) => { setEmailSubject(e.target.value); setSelectedEmailTemplate('custom'); }} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="Email subject..." /></div><div><label className="text-sm font-medium text-gray-700">Message</label><textarea value={emailContent} onChange={(e) => { setEmailContent(e.target.value); setSelectedEmailTemplate('custom'); }} rows={6} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="Email content..." /></div><div className="flex gap-2 justify-end"><button onClick={() => { setShowEmailModal(false); setSelectedEmailTemplate('custom'); setEmailSubject(''); setEmailContent(''); }} className="px-4 py-2 border rounded-lg text-sm">Cancel</button><button onClick={sendEmail} disabled={sending || !emailSubject.trim() || !emailContent.trim()} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm disabled:opacity-50">{sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}Send</button></div></div></div></div>)}

      {showApprovalModal && selectedLead && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"><h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-600" />Approve {selectedLead.firstName} - {selectedLead.businessName}</h3><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="text-sm font-medium text-gray-700">Approved Amount *</label><input type="text" value={approvalData.approvedAmount} onChange={(e) => setApprovalData({ ...approvalData, approvedAmount: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., $50,000" /></div><div><label className="text-sm font-medium text-gray-700">Total Payback</label><input type="text" value={approvalData.totalPayback} onChange={(e) => setApprovalData({ ...approvalData, totalPayback: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., $57,500" /></div></div><div className="grid grid-cols-2 gap-4"><div><label className="text-sm font-medium text-gray-700">Fee Amount</label><input type="text" value={approvalData.feeAmount} onChange={(e) => setApprovalData({ ...approvalData, feeAmount: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., $7,500" /></div><div><label className="text-sm font-medium text-gray-700">Fee %</label><input type="text" value={approvalData.feePercent} onChange={(e) => setApprovalData({ ...approvalData, feePercent: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., 15%" /></div></div><div><label className="text-sm font-medium text-gray-700">Term</label><select value={approvalData.term} onChange={(e) => setApprovalData({ ...approvalData, term: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"><option value="6 months">6 months</option><option value="9 months">9 months</option><option value="12 months">12 months</option><option value="18 months">18 months</option><option value="24 months">24 months</option></select></div><div className="grid grid-cols-2 gap-4"><div><label className="text-sm font-medium text-gray-700">Repayment Type</label><select value={approvalData.repaymentType} onChange={(e) => setApprovalData({ ...approvalData, repaymentType: e.target.value as 'daily' | 'weekly' })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"><option value="daily">Daily</option><option value="weekly">Weekly</option></select></div><div><label className="text-sm font-medium text-gray-700">Repayment Amount *</label><input type="text" value={approvalData.repaymentAmount} onChange={(e) => setApprovalData({ ...approvalData, repaymentAmount: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., $1,659/week" /></div></div><div><label className="text-sm font-medium text-gray-700">Lending Partner <span className="text-gray-400 font-normal">(optional)</span></label><input type="text" value={approvalData.lendingPartner} onChange={(e) => setApprovalData({ ...approvalData, lendingPartner: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., Funded via XYZ Capital" /></div><div><label className="text-sm font-medium text-gray-700">Verification Link <span className="text-gray-400 font-normal">(optional - adds "Verify Bank and Proceed" button)</span></label><input type="text" value={approvalData.verificationLink} onChange={(e) => setApprovalData({ ...approvalData, verificationLink: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., https://plaid.com/verify/abc123" /></div><div className="bg-gray-50 rounded-lg p-3 border"><p className="text-xs font-semibold text-gray-500 mb-2">EMAIL PREVIEW</p><p className="text-sm text-gray-700">The approval email will include: amount ({approvalData.approvedAmount || '--'}), fee ({approvalData.feeAmount || '--'} / {approvalData.feePercent || '--'}), total payback ({approvalData.totalPayback || '--'}), term ({approvalData.term}), {approvalData.repaymentType} repayment ({approvalData.repaymentAmount || '--'}), plus the refinance at 50% benefit visual.</p></div><div className="flex gap-2 justify-end pt-2"><button onClick={() => { setShowApprovalModal(false); setApprovalData({ approvedAmount: '', term: '12 months', repaymentType: 'weekly', repaymentAmount: '', feeAmount: '', feePercent: '', totalPayback: '', lendingPartner: '', verificationLink: '' }); }} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button><button onClick={approveLead} disabled={approving || !approvalData.approvedAmount || !approvalData.repaymentAmount} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed">{approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}Approve & Send Email</button></div></div></div></div>)}
    </div>
  );
}
