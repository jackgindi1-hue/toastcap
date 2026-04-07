'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, Play, Pause, StopCircle, Loader2, CheckSquare, Square,
  Users, Zap, RefreshCw, Calendar, Eye, X, Mail
} from 'lucide-react';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  stage: 'quote' | 'application' | 'dlvc' | 'approved' | 'funded';
  dripCampaign?: 'cold_outreach' | null;
  dripStep?: number;
  dripTotalSteps?: number;
  nextDripAt?: string;
  dripPaused?: boolean;
  emailBounced?: boolean;
}

interface DripStep {
  step: number;
  name: string;
  day: number;
  templateId: string;
  subject: string;
  color: string;
  isV2?: boolean;
}

const DRIP_STEPS: DripStep[] = [
  { step: 1, name: "You've Been Approved", day: 0, templateId: 'cold_approved', subject: "You've Been Approved for a Toast Lending Offer!", color: '#FF6B35' },
  { step: 2, name: "Improved Terms", day: 1, templateId: 'cold_unlocked', subject: "[UNLOCKED] We've Improved Your Funding Terms!", color: '#059669' },
  { step: 3, name: "[UNLOCKED] Better Terms", day: 2, templateId: 'cold_better_terms', subject: "[UNLOCKED] Your Terms Have Been Upgraded!", color: '#059669' },
  { step: 4, name: "Special Access", day: 3, templateId: 'cold_special_access', subject: "You've Unlocked a Special Funding Offer!", color: '#1E3A8A' },
  { step: 5, name: "You've Been Invited", day: 5, templateId: 'cold_invited', subject: "You've been invited to apply for a Toast Capital Loan", color: '#1f2937' },
  { step: 6, name: "Limited Time Offer", day: 7, templateId: 'cold_limited', subject: "Don't Miss Out on This Opportunity", color: '#DC2626' },
  { step: 7, name: "Quick Question", day: 8, templateId: 'cold_question', subject: "Quick question for you", color: '#1E3A8A' },
  { step: 8, name: "Fuel Your Growth", day: 10, templateId: 'cold_growth', subject: "What Could Your Business Accomplish With Extra Capital?", color: '#1E3A8A' },
  { step: 9, name: "Growth Potential", day: 13, templateId: 'cold_potential', subject: "What's holding your business back from its next level?", color: '#FF6B35' },
  { step: 10, name: "60-Second Offer", day: 16, templateId: 'cold_60sec', subject: "60 seconds to see your funding offer", color: '#1E3A8A' },
  { step: 11, name: "Seasonal Opportunity", day: 19, templateId: 'cold_seasonal', subject: "Peak season is coming. Is your business ready?", color: '#059669' },
];

const DRIP_STEPS_V2: DripStep[] = [
  { step: 1, name: "You've Been Approved V2", day: 0, templateId: 'cold_approved_v2', subject: "You've Been Approved for a Toast Lending Offer!", color: '#FF6B35', isV2: true },
  { step: 2, name: "Improved Terms V2", day: 1, templateId: 'cold_unlocked_v2', subject: "[UNLOCKED] We've Improved Your Funding Terms!", color: '#059669', isV2: true },
  { step: 3, name: "[UNLOCKED] Better Terms V2", day: 2, templateId: 'cold_better_terms_v2', subject: "[UNLOCKED] Your Terms Have Been Upgraded!", color: '#059669', isV2: true },
  { step: 4, name: "Special Access V2", day: 3, templateId: 'cold_special_access_v2', subject: "You've Unlocked a Special Funding Offer!", color: '#1E3A8A', isV2: true },
  { step: 5, name: "You've Been Invited V2", day: 5, templateId: 'cold_invited_v2', subject: "You've been invited to apply for a Toast Capital Loan", color: '#1f2937', isV2: true },
  { step: 6, name: "Limited Time Offer V2", day: 7, templateId: 'cold_limited_v2', subject: "Don't Miss Out on This Opportunity", color: '#DC2626', isV2: true },
  { step: 7, name: "Quick Question V2", day: 8, templateId: 'cold_question_v2', subject: "Quick question for you", color: '#1E3A8A', isV2: true },
  { step: 8, name: "Fuel Your Growth V2", day: 10, templateId: 'cold_growth_v2', subject: "What Could Your Business Accomplish With Extra Capital?", color: '#1E3A8A', isV2: true },
  { step: 9, name: "Growth Potential V2", day: 13, templateId: 'cold_potential_v2', subject: "What's holding your business back from its next level?", color: '#FF6B35', isV2: true },
  { step: 10, name: "60-Second Offer V2", day: 16, templateId: 'cold_60sec_v2', subject: "60 seconds to see your funding offer", color: '#1E3A8A', isV2: true },
  { step: 11, name: "Seasonal Opportunity V2", day: 19, templateId: 'cold_seasonal_v2', subject: "Peak season is coming. Is your business ready?", color: '#059669', isV2: true },
];

export default function BulkMessagingTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'in_drip' | 'eligible'>('all');
  const [startingDrip, setStartingDrip] = useState(false);
  const [dripStyle, setDripStyle] = useState<'original' | 'v2'>('original');
  const [previewStep, setPreviewStep] = useState<DripStep | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [startAtStep, setStartAtStep] = useState(1);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [loadingThumbnails, setLoadingThumbnails] = useState(true);

  useEffect(() => {
    const loadThumbnails = async () => {
      setLoadingThumbnails(true);
      const thumbs: Record<string, string> = {};
      const allSteps = [...DRIP_STEPS, ...DRIP_STEPS_V2];
      await Promise.all(
        allSteps.map(async (step) => {
          try {
            const response = await fetch(`/api/campaigns/preview?templateId=${step.templateId}`);
            const data = await response.json();
            thumbs[step.templateId] = data.html || '';
          } catch {
            thumbs[step.templateId] = '';
          }
        })
      );
      setThumbnails(thumbs);
      setLoadingThumbnails(false);
    };
    loadThumbnails();
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      const response = await fetch(`/api/leads?${params.toString()}`);
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = leads.filter((lead) => {
    if (filter === 'in_drip') return lead.dripCampaign;
    if (filter === 'eligible') return lead.email && !lead.emailBounced && !lead.dripCampaign;
    return true;
  });

  const inDripCount = leads.filter((l) => l.dripCampaign).length;
  const eligibleCount = leads.filter((l) => l.email && !l.emailBounced && !l.dripCampaign).length;
  const pausedCount = leads.filter((l) => l.dripPaused).length;

  const toggleLead = (id: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedLeads(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === filteredLeads.length) setSelectedLeads(new Set());
    else setSelectedLeads(new Set(filteredLeads.map((l) => l.id)));
  };

  const startDripForSelected = async () => {
    const eligibleSelected = filteredLeads.filter(
      (l) => selectedLeads.has(l.id) && l.email && !l.emailBounced && !l.dripCampaign
    );
    if (eligibleSelected.length === 0) {
      alert('No eligible leads selected. Leads must have email and not already be in a drip.');
      return;
    }
    const styleLabel = dripStyle === 'v2' ? 'V2 (Website Style)' : 'Original';
    if (!confirm(`Start drip campaign for ${eligibleSelected.length} lead(s) at email ${startAtStep}/11 using ${styleLabel} emails?`)) return;

    setStartingDrip(true);
    try {
      const response = await fetch('/api/drip/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds: eligibleSelected.map((l) => l.id), startAtStep, style: dripStyle }),
      });
      const result = await response.json();
      if (result.success) {
        alert(`Started drip for ${result.started} lead(s) using ${styleLabel} emails`);
        fetchLeads();
        setSelectedLeads(new Set());
      } else {
        alert('Failed: ' + (result.error || 'Unknown error'));
      }
    } catch {
      alert('Failed to start drip');
    } finally {
      setStartingDrip(false);
    }
  };

  const manageDrip = async (leadId: string, action: 'pause' | 'resume' | 'stop') => {
    try {
      const response = await fetch('/api/drip/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, action }),
      });
      if (response.ok) fetchLeads();
    } catch (error) {
      console.error('Manage drip error:', error);
    }
  };

  const formatNextDrip = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    if (diffHours < 0) return 'Due now';
    if (diffHours < 1) return 'Less than 1 hour';
    if (diffHours < 24) return `${diffHours} hours`;
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  const fetchEmailPreview = async (step: DripStep) => {
    setPreviewStep(step);
    if (thumbnails[step.templateId]) {
      setPreviewHtml(thumbnails[step.templateId]);
      setLoadingPreview(false);
    } else {
      setLoadingPreview(true);
      try {
        const response = await fetch(`/api/campaigns/preview?templateId=${step.templateId}`);
        const data = await response.json();
        setPreviewHtml(data.html || '');
      } catch {
        setPreviewHtml('<p style="padding:20px;text-align:center;color:#666;">Failed to load preview</p>');
      } finally {
        setLoadingPreview(false);
      }
    }
  };

  const renderEmailGrid = (steps: DripStep[], isV2: boolean) => (
    <div className="grid grid-cols-5 gap-3">
      {steps.map((step) => (
        <button
          key={step.templateId}
          onClick={() => fetchEmailPreview(step)}
          className={`group relative bg-white rounded-lg border-2 ${isV2 ? 'border-orange-100 hover:border-orange-300' : 'border-gray-100 hover:border-purple-300'} hover:shadow-lg transition-all overflow-hidden`}
        >
          <div className="relative h-32 overflow-hidden bg-gray-50">
            {thumbnails[step.templateId] ? (
              <iframe
                srcDoc={thumbnails[step.templateId]}
                className="w-[400%] h-[400%] border-0 pointer-events-none"
                style={{ transform: 'scale(0.25)', transformOrigin: 'top left' }}
                title={`Preview ${step.name}`}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Mail className="w-8 h-8 text-gray-300" />
              </div>
            )}
            {isV2 && (
              <div className="absolute top-1 right-1 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">V2</div>
            )}
            <div className={`absolute inset-0 ${isV2 ? 'group-hover:bg-orange-600/10' : 'group-hover:bg-purple-600/10'} transition-colors flex items-center justify-center`}>
              <Eye className={`w-6 h-6 ${isV2 ? 'text-orange-600' : 'text-purple-600'} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          </div>
          <div className="p-2 border-t bg-white">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: step.color }} />
              <span className={`text-xs font-bold ${isV2 ? 'text-orange-600' : 'text-purple-600'}`}>{step.step}/11</span>
              <span className="text-xs text-gray-400">Day {step.day}</span>
            </div>
            <p className="text-xs text-gray-700 font-medium truncate">{step.name}</p>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{inDripCount}</p>
              <p className="text-sm text-gray-500">In Drip Campaign</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{eligibleCount}</p>
              <p className="text-sm text-gray-500">Eligible to Start</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Pause className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pausedCount}</p>
              <p className="text-sm text-gray-500">Paused</p>
            </div>
          </div>
        </div>
      </div>

      {/* Original Drip Schedule */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Original Style - 11-Email Drip (19 days)
        </h3>
        {loadingThumbnails ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          </div>
        ) : renderEmailGrid(DRIP_STEPS, false)}
      </div>

      {/* V2 Drip Schedule */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-2 py-0.5 rounded-full">V2</span>
          Website Style - Orange Banner + Clean Layout
        </h3>
        {loadingThumbnails ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          </div>
        ) : renderEmailGrid(DRIP_STEPS_V2, true)}
      </div>

      {/* Preview Modal */}
      {previewStep && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900">
                  Email Preview: Step {previewStep.step}/11
                  {previewStep.isV2 && <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">V2</span>}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Subject: {previewStep.subject}</p>
              </div>
              <button onClick={() => setPreviewStep(null)} className="p-2 hover:bg-gray-200 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              {loadingPreview ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>
              ) : (
                <iframe srcDoc={previewHtml} className="w-full border-0 bg-white rounded-lg" style={{ minHeight: '600px' }} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lead List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
            />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="px-4 py-2 border rounded-lg text-sm">
            <option value="all">All Leads ({leads.length})</option>
            <option value="in_drip">In Drip ({inDripCount})</option>
            <option value="eligible">Eligible ({eligibleCount})</option>
          </select>
          <button onClick={fetchLeads} className="p-2 border rounded-lg hover:bg-gray-50"><RefreshCw className="w-4 h-4" /></button>
        </div>

        {/* Actions Bar */}
        <div className="p-3 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={toggleSelectAll} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-purple-600">
              {selectedLeads.size === filteredLeads.length && filteredLeads.length > 0 ? <CheckSquare className="w-5 h-5 text-purple-600" /> : <Square className="w-5 h-5" />}
              Select All
            </button>
            <span className="text-sm text-gray-500">{selectedLeads.size} selected</span>
          </div>
          <div className="flex items-center gap-3">
            <select value={startAtStep} onChange={(e) => setStartAtStep(Number(e.target.value))} className="px-3 py-2 border rounded-lg text-sm">
              {DRIP_STEPS.map((step) => (
                <option key={step.step} value={step.step}>Email {step.step}/11 - {step.name}</option>
              ))}
            </select>
            <div className="flex rounded-lg border overflow-hidden">
              <button
                onClick={() => setDripStyle('original')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${dripStyle === 'original' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >Original</button>
              <button
                onClick={() => setDripStyle('v2')}
                className={`px-3 py-2 text-sm font-medium transition-colors border-l ${dripStyle === 'v2' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >V2 Website</button>
            </div>
            <button
              onClick={startDripForSelected}
              disabled={startingDrip || selectedLeads.size === 0}
              className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium disabled:opacity-50 ${dripStyle === 'v2' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {startingDrip ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Start Drip {dripStyle === 'v2' && '(V2)'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Users className="w-12 h-12 mb-2 opacity-50" /><p>No leads found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="w-10 px-4 py-3"></th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Drip Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Next Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <button onClick={() => toggleLead(lead.id)} disabled={!lead.email} className={!lead.email ? 'opacity-50' : ''}>
                        {selectedLeads.has(lead.id) ? <CheckSquare className="w-5 h-5 text-purple-600" /> : <Square className="w-5 h-5 text-gray-300" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{lead.firstName} {lead.lastName}</p>
                      <p className="text-sm text-gray-500">{lead.businessName}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {lead.email || <span className="text-red-500">No email</span>}
                      {lead.emailBounced && <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded">Bounced</span>}
                    </td>
                    <td className="px-4 py-3">
                      {lead.dripCampaign ? (
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${lead.dripPaused ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>
                            {lead.dripStep || 0}/{lead.dripTotalSteps || 11}
                          </span>
                          {lead.dripPaused && <span className="text-xs text-amber-600">Paused</span>}
                        </div>
                      ) : lead.email && !lead.emailBounced ? (
                        <span className="text-sm text-green-600">Eligible</span>
                      ) : <span className="text-sm text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{lead.dripCampaign && !lead.dripPaused ? formatNextDrip(lead.nextDripAt) : '-'}</td>
                    <td className="px-4 py-3">
                      {lead.dripCampaign && (
                        <div className="flex items-center gap-1">
                          {lead.dripPaused ? (
                            <button onClick={() => manageDrip(lead.id, 'resume')} className="p-1.5 hover:bg-green-100 rounded text-green-600"><Play className="w-4 h-4" /></button>
                          ) : (
                            <button onClick={() => manageDrip(lead.id, 'pause')} className="p-1.5 hover:bg-amber-100 rounded text-amber-600"><Pause className="w-4 h-4" /></button>
                          )}
                          <button onClick={() => manageDrip(lead.id, 'stop')} className="p-1.5 hover:bg-red-100 rounded text-red-600"><StopCircle className="w-4 h-4" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-3 border-t bg-gray-50 text-sm text-gray-500 text-center">{filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}</div>
      </div>
    </div>
  );
}
