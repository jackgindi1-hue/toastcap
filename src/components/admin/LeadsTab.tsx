'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, Phone, Mail, MessageSquare, FileText,
  User, Building2, DollarSign, Calendar, Tag, StickyNote,
  ChevronRight, X, Send, Download, Eye, Loader2,
  CheckCircle, Clock, AlertCircle, XCircle, RefreshCw
} from 'lucide-react';

// Types
type LeadStage = 'quote' | 'application' | 'dlvc' | 'funded';
type LeadStatus = 'new' | 'contacted' | 'in_review' | 'approved' | 'funded' | 'lost';
type LeadTag = 'hot' | 'follow_up' | 'waiting_docs' | 'problem' | 'vip';

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
  numLocations?: string;
  stage: LeadStage;
  status: LeadStatus;
  tags: LeadTag[];
  createdAt: string;
  updatedAt: string;
  quoteSubmittedAt?: string;
  applicationSubmittedAt?: string;
  dlvcSubmittedAt?: string;
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

interface LeadMessage {
  id: string;
  leadId: string;
  type: 'sms' | 'email';
  subject?: string;
  content: string;
  status: string;
  sentAt: string;
}

interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  createdAt: string;
}

// Stage badge colors
const stageColors: Record<LeadStage, string> = {
  quote: 'bg-gray-100 text-gray-700',
  application: 'bg-blue-100 text-blue-700',
  dlvc: 'bg-orange-100 text-orange-700',
  funded: 'bg-green-100 text-green-700',
};

const stageLabels: Record<LeadStage, string> = {
  quote: 'Quote',
  application: 'Application',
  dlvc: 'DLVC',
  funded: 'Funded',
};

// Status badge colors
const statusColors: Record<LeadStatus, string> = {
  new: 'bg-purple-100 text-purple-700',
  contacted: 'bg-blue-100 text-blue-700',
  in_review: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  funded: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-red-100 text-red-700',
};

const statusLabels: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  in_review: 'In Review',
  approved: 'Approved',
  funded: 'Funded',
  lost: 'Lost',
};

// Tag colors
const tagColors: Record<LeadTag, string> = {
  hot: 'bg-red-500 text-white',
  follow_up: 'bg-yellow-500 text-white',
  waiting_docs: 'bg-blue-500 text-white',
  problem: 'bg-gray-500 text-white',
  vip: 'bg-purple-500 text-white',
};

const tagLabels: Record<LeadTag, string> = {
  hot: 'Hot',
  follow_up: 'Follow Up',
  waiting_docs: 'Waiting Docs',
  problem: 'Problem',
  vip: 'VIP',
};

// SMS Templates with full message preview
const smsTemplates = [
  {
    id: 'follow_up',
    label: 'Follow Up',
    message: 'Hi {firstName}! This is Toast Capital following up on your funding application for {businessName}. Give us a call at (617) 533-3190 when you have a moment!'
  },
  {
    id: 'docs_reminder',
    label: 'Docs Reminder',
    message: 'Hi {firstName}! We\'re still waiting on your documents to complete your funding application for {businessName}. Upload them here: toastcapital.com/dlvc'
  },
  {
    id: 'approval',
    label: 'Approval',
    message: 'Great news {firstName}! Your funding for {businessName} has been approved! Call us at (617) 533-3190 to finalize.'
  },
  {
    id: 'checking_in',
    label: 'Checking In',
    message: 'Hi {firstName}, just checking in on your Toast Capital application. Any questions? Call us: (617) 533-3190'
  },
  {
    id: 'thank_you',
    label: 'Thank You',
    message: 'Thank you {firstName} for completing your application! Our team is reviewing it now and will be in touch shortly. - Toast Capital'
  },
];

// Email Templates with full details
const emailTemplates = [
  {
    id: 'follow_up',
    label: 'Follow Up',
    subject: 'Following up on your Toast Capital application',
    description: 'Friendly follow-up to check on their progress'
  },
  {
    id: 'docs_reminder',
    label: 'Documents Reminder',
    subject: 'Action needed: Upload your documents',
    description: 'Remind them to upload bank statements, DL, void check'
  },
  {
    id: 'approval',
    label: 'Approval Notification',
    subject: 'Great news! Your funding has been approved',
    description: 'Notify them their application was approved'
  },
  {
    id: 'checking_in',
    label: 'Checking In',
    subject: 'How can we help?',
    description: 'Casual check-in to see if they need assistance'
  },
];

export default function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadDetails, setLeadDetails] = useState<{
    documents: LeadDocument[];
    messages: LeadMessage[];
    notes: LeadNote[];
  } | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Message sending state
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [smsContent, setSmsContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Note state
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

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

  // Fetch lead details
  const fetchLeadDetails = async (leadId: string) => {
    setDetailsLoading(true);
    try {
      const response = await fetch(`/api/leads/${leadId}`);
      const data = await response.json();
      setLeadDetails({
        documents: data.documents || [],
        messages: data.messages || [],
        notes: data.notes || [],
      });
    } catch (error) {
      console.error('Failed to fetch lead details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Select a lead
  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    fetchLeadDetails(lead.id);
  };

  // Update lead status
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

  // Toggle tag
  const toggleTag = async (leadId: string, tag: LeadTag) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const newTags = lead.tags.includes(tag)
      ? lead.tags.filter(t => t !== tag)
      : [...lead.tags, tag];

    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: newTags }),
      });
      fetchLeads();
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, tags: newTags });
      }
    } catch (error) {
      console.error('Failed to update tags:', error);
    }
  };

  // Send SMS
  const sendSms = async () => {
    if (!selectedLead || !smsContent.trim()) return;
    setSendingMessage(true);
    try {
      const response = await fetch(`/api/leads/${selectedLead.id}/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: smsContent,
          template: selectedTemplate || undefined,
        }),
      });
      if (response.ok) {
        setShowSmsModal(false);
        setSmsContent('');
        setSelectedTemplate('');
        fetchLeadDetails(selectedLead.id);
        alert('SMS sent successfully!');
      } else {
        const data = await response.json();
        alert(`Failed to send SMS: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to send SMS');
    } finally {
      setSendingMessage(false);
    }
  };

  // Send Email
  const sendEmail = async () => {
    if (!selectedLead || (!emailContent.trim() && !selectedTemplate)) return;
    setSendingMessage(true);
    try {
      const response = await fetch(`/api/leads/${selectedLead.id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: emailSubject,
          content: emailContent,
          template: selectedTemplate || undefined,
        }),
      });
      if (response.ok) {
        setShowEmailModal(false);
        setEmailSubject('');
        setEmailContent('');
        setSelectedTemplate('');
        fetchLeadDetails(selectedLead.id);
        alert('Email sent successfully!');
      } else {
        const data = await response.json();
        alert(`Failed to send email: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to send email');
    } finally {
      setSendingMessage(false);
    }
  };

  // Add note
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

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="flex h-[calc(100vh-180px)]">
      {/* Lead List Panel */}
      <div className={`${selectedLead ? 'w-1/3' : 'w-full'} border-r overflow-hidden flex flex-col`}>
        {/* Search and Filters */}
        <div className="p-4 border-b bg-white space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            >
              <option value="all">All Stages</option>
              <option value="quote">Quote</option>
              <option value="application">Application</option>
              <option value="dlvc">DLVC</option>
              <option value="funded">Funded</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="funded">Funded</option>
              <option value="lost">Lost</option>
            </select>
            <button
              onClick={fetchLeads}
              className="p-2 border rounded-lg hover:bg-gray-50"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lead List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <User className="w-12 h-12 mb-2 opacity-50" />
              <p>No leads found</p>
              <p className="text-sm">Leads will appear here when forms are submitted</p>
            </div>
          ) : (
            <div className="divide-y">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => handleSelectLead(lead)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                    selectedLead?.id === lead.id ? 'bg-orange-50 border-l-4 border-[#FF6B35]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {lead.firstName || lead.lastName
                          ? `${lead.firstName} ${lead.lastName}`.trim()
                          : <span className="text-gray-400 italic">No name</span>}
                      </h3>
                      <p className="text-sm text-gray-700 font-medium truncate">
                        {lead.businessName || <span className="text-gray-400 italic">No business name</span>}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${stageColors[lead.stage]}`}>
                      {stageLabels[lead.stage]}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 mb-2">
                    {lead.email && (
                      <span className="flex items-center gap-1 truncate max-w-[180px]">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {lead.email}
                      </span>
                    )}
                    {lead.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        {lead.phone}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className={`px-2 py-0.5 rounded ${statusColors[lead.status]}`}>
                      {statusLabels[lead.status]}
                    </span>
                    <span>{formatDate(lead.createdAt)}</span>
                  </div>
                  {lead.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {lead.tags.map((tag) => (
                        <span key={tag} className={`px-2 py-0.5 rounded text-xs ${tagColors[tag]}`}>
                          {tagLabels[tag]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lead count */}
        <div className="p-3 border-t bg-gray-50 text-sm text-gray-500 text-center">
          {leads.length} lead{leads.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Lead Detail Panel */}
      {selectedLead && (
        <div className="flex-1 overflow-y-auto bg-white">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-4 z-10">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedLead.firstName} {selectedLead.lastName}
                </h2>
                <p className="text-gray-600">{selectedLead.businessName}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4">
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
              <button
                onClick={() => setShowSmsModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                <MessageSquare className="w-4 h-4" />
                SMS
              </button>
              <button
                onClick={() => setShowEmailModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Contact Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{selectedLead.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{selectedLead.phone || 'N/A'}</p>
                    {selectedLead.phoneVerified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium" title="Phone verified via OTP on quote form">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Business Type</p>
                  <p className="font-medium">{selectedLead.businessType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Monthly Revenue</p>
                  <p className="font-medium">{selectedLead.monthlyRevenue || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Funding Amount</p>
                  <p className="font-medium">{selectedLead.fundingAmount || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Locations</p>
                  <p className="font-medium">{selectedLead.numLocations || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Status & Tags */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Status & Tags
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => updateLeadStatus(selectedLead.id, key as LeadStatus)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                          selectedLead.status === key
                            ? statusColors[key as LeadStatus]
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(tagLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => toggleTag(selectedLead.id, key as LeadTag)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                          selectedLead.tags.includes(key as LeadTag)
                            ? tagColors[key as LeadTag]
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Timeline
              </h3>
              <div className="space-y-2 text-sm">
                {selectedLead.quoteSubmittedAt && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Quote submitted: {formatDate(selectedLead.quoteSubmittedAt)}</span>
                  </div>
                )}
                {selectedLead.applicationSubmittedAt && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Application submitted: {formatDate(selectedLead.applicationSubmittedAt)}</span>
                  </div>
                )}
                {selectedLead.dlvcSubmittedAt && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Documents submitted: {formatDate(selectedLead.dlvcSubmittedAt)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Created: {formatDate(selectedLead.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Documents */}
            {detailsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Documents ({leadDetails?.documents.length || 0})
                  </h3>
                  {leadDetails?.documents.length === 0 ? (
                    <p className="text-sm text-gray-500">No documents uploaded yet</p>
                  ) : (
                    <div className="space-y-2">
                      {leadDetails?.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">{doc.fileName}</p>
                              <p className="text-xs text-gray-500">
                                {doc.docType.replace(/_/g, ' ')} • {formatFileSize(doc.fileSize)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={`/api/leads/${selectedLead.id}/documents/${doc.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-gray-100 rounded"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <a
                              href={`/api/leads/${selectedLead.id}/documents/${doc.id}`}
                              download={doc.fileName}
                              className="p-2 hover:bg-gray-100 rounded"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Communication History ({leadDetails?.messages.length || 0})
                  </h3>
                  {leadDetails?.messages.length === 0 ? (
                    <p className="text-sm text-gray-500">No messages sent yet</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {leadDetails?.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className="p-3 bg-white rounded-lg border"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {msg.type === 'sms' ? (
                              <MessageSquare className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Mail className="w-4 h-4 text-purple-500" />
                            )}
                            <span className="text-xs font-medium uppercase">{msg.type}</span>
                            <span className="text-xs text-gray-500">{formatDate(msg.sentAt)}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              msg.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              msg.status === 'opened' ? 'bg-blue-100 text-blue-700' :
                              msg.status === 'clicked' ? 'bg-purple-100 text-purple-700' :
                              msg.status === 'failed' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {msg.status}
                            </span>
                          </div>
                          {msg.subject && (
                            <p className="text-sm font-medium">{msg.subject}</p>
                          )}
                          <p className="text-sm text-gray-600 line-clamp-2">{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <StickyNote className="w-4 h-4" />
                    Notes ({leadDetails?.notes.length || 0})
                  </h3>
                  <div className="space-y-2 mb-3">
                    {leadDetails?.notes.map((note) => (
                      <div key={note.id} className="p-3 bg-white rounded-lg border">
                        <p className="text-sm">{note.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(note.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note..."
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                      onKeyDown={(e) => e.key === 'Enter' && addNote()}
                    />
                    <button
                      onClick={addNote}
                      disabled={addingNote || !newNote.trim()}
                      className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] disabled:opacity-50 text-sm font-medium"
                    >
                      {addingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* SMS Modal */}
      {showSmsModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Send SMS to {selectedLead.firstName}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Template</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => {
                    setSelectedTemplate(e.target.value);
                    const template = smsTemplates.find(t => t.id === e.target.value);
                    if (template) {
                      // Replace all placeholders with actual values
                      const personalizedMsg = template.message
                        .replace(/{firstName}/g, selectedLead.firstName || 'there')
                        .replace(/{businessName}/g, selectedLead.businessName || 'your business');
                      setSmsContent(personalizedMsg);
                    }
                  }}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Custom message</option>
                  {smsTemplates.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
                {/* Show template preview */}
                {selectedTemplate && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs font-medium text-blue-700 mb-1">Template Preview:</p>
                    <p className="text-sm text-gray-700">
                      {smsTemplates.find(t => t.id === selectedTemplate)?.message
                        .replace(/{firstName}/g, selectedLead.firstName || 'there')
                        .replace(/{businessName}/g, selectedLead.businessName || 'your business')}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Message</label>
                <textarea
                  value={smsContent}
                  onChange={(e) => setSmsContent(e.target.value)}
                  rows={4}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                  placeholder="Type your message..."
                />
                <p className="text-xs text-gray-500 mt-1">{smsContent.length} characters</p>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowSmsModal(false)}
                  className="px-4 py-2 border rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={sendSms}
                  disabled={sendingMessage || !smsContent.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {sendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send SMS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-bold mb-4">Send Email to {selectedLead.firstName}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Template</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Custom email</option>
                  {emailTemplates.map((t) => (
                    <option key={t.id} value={t.id}>{t.label} - {t.description}</option>
                  ))}
                </select>
                {/* Show email template preview */}
                {selectedTemplate && (
                  <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs font-medium text-purple-700 mb-1">Email Template Preview:</p>
                    <p className="text-sm font-semibold text-gray-900">
                      Subject: {emailTemplates.find(t => t.id === selectedTemplate)?.subject
                        .replace(/{firstName}/g, selectedLead.firstName || 'there')
                        .replace(/{businessName}/g, selectedLead.businessName || 'your business')}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {emailTemplates.find(t => t.id === selectedTemplate)?.description}
                    </p>
                    <p className="text-xs text-purple-600 mt-2 italic">
                      Full HTML email will be sent with Toast Capital branding and CTA buttons.
                    </p>
                  </div>
                )}
              </div>
              {!selectedTemplate && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                      placeholder="Email subject..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Content</label>
                    <textarea
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      rows={6}
                      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                      placeholder="Email content..."
                    />
                  </div>
                </>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 border rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={sendEmail}
                  disabled={sendingMessage || (!selectedTemplate && (!emailSubject.trim() || !emailContent.trim()))}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {sendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
