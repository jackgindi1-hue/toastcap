'use client';

import { useState, useEffect } from 'react';
import {
  FileText, CheckCircle2, XCircle, AlertTriangle,
  Loader2, RefreshCw, Filter, ChevronDown, Eye, ClipboardCheck
} from 'lucide-react';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  stage: string;
  status: string;
  createdAt: string;
  documents?: {
    bankStatement1?: boolean;
    bankStatement2?: boolean;
    bankStatement3?: boolean;
    driversLicense?: boolean;
    voidCheck?: boolean;
  };
  documentsComplete?: boolean;
  readyForReview?: boolean;
}

interface ActualDocument {
  id: string;
  leadId: string;
  fileName: string;
  fileType: string;
  docType: string;
  uploadedAt: string;
}

interface DocumentStats {
  total: number;
  complete: number;
  incomplete: number;
  readyForReview: number;
  byDocument: {
    bankStatement1: number;
    bankStatement2: number;
    bankStatement3: number;
    driversLicense: number;
    voidCheck: number;
  };
}

interface DocumentChecklistProps {
  onSelectLead?: (lead: Lead) => void;
}

export default function DocumentChecklist({ onSelectLead }: DocumentChecklistProps) {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [filter, setFilter] = useState<'all' | 'incomplete' | 'ready'>('all');
  const [actualDocCounts, setActualDocCounts] = useState<Record<string, number>>({});
  const [loadingActualDocs, setLoadingActualDocs] = useState<string | null>(null);

  // Fetch actual document count for a lead
  const fetchActualDocCount = async (leadId: string) => {
    setLoadingActualDocs(leadId);
    try {
      const response = await fetch(`/api/leads/${leadId}`);
      const data = await response.json();
      const docCount = data.documents?.length || 0;
      setActualDocCounts(prev => ({ ...prev, [leadId]: docCount }));
    } catch (error) {
      console.error('Failed to fetch actual docs:', error);
    } finally {
      setLoadingActualDocs(null);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all leads with DLVC stage
      const response = await fetch('/api/leads?stage=dlvc');
      const data = await response.json();

      const dlvcLeads = data.leads || [];
      setLeads(dlvcLeads);

      // Calculate stats
      const stats: DocumentStats = {
        total: dlvcLeads.length,
        complete: 0,
        incomplete: 0,
        readyForReview: 0,
        byDocument: {
          bankStatement1: 0,
          bankStatement2: 0,
          bankStatement3: 0,
          driversLicense: 0,
          voidCheck: 0,
        },
      };

      for (const lead of dlvcLeads) {
        if (lead.documentsComplete) {
          stats.complete++;
        } else {
          stats.incomplete++;
        }
        if (lead.readyForReview) {
          stats.readyForReview++;
        }
        if (lead.documents) {
          if (lead.documents.bankStatement1) stats.byDocument.bankStatement1++;
          if (lead.documents.bankStatement2) stats.byDocument.bankStatement2++;
          if (lead.documents.bankStatement3) stats.byDocument.bankStatement3++;
          if (lead.documents.driversLicense) stats.byDocument.driversLicense++;
          if (lead.documents.voidCheck) stats.byDocument.voidCheck++;
        }
      }

      setStats(stats);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    if (filter === 'incomplete') return !lead.documentsComplete;
    if (filter === 'ready') return lead.readyForReview;
    return true;
  });

  // Count missing documents for a lead
  const getMissingCount = (lead: Lead): number => {
    if (!lead.documents) return 5;
    let count = 0;
    if (!lead.documents.bankStatement1) count++;
    if (!lead.documents.bankStatement2) count++;
    if (!lead.documents.bankStatement3) count++;
    if (!lead.documents.driversLicense) count++;
    if (!lead.documents.voidCheck) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Checklist</h2>
          <p className="text-gray-500 mt-1">Track document completion for DLVC applications</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Total DLVC</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Complete</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats?.complete || 0}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Incomplete</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats?.incomplete || 0}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <ClipboardCheck className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Ready for Review</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats?.readyForReview || 0}</p>
        </div>
      </div>

      {/* Document Breakdown */}
      {stats && stats.total > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Document Breakdown</h3>
          <div className="grid grid-cols-5 gap-4">
            {[
              { key: 'bankStatement1', label: 'Bank 1', count: stats.byDocument.bankStatement1 },
              { key: 'bankStatement2', label: 'Bank 2', count: stats.byDocument.bankStatement2 },
              { key: 'bankStatement3', label: 'Bank 3', count: stats.byDocument.bankStatement3 },
              { key: 'driversLicense', label: "Driver's License", count: stats.byDocument.driversLicense },
              { key: 'voidCheck', label: 'Void Check', count: stats.byDocument.voidCheck },
            ].map((doc) => {
              const percentage = stats.total > 0 ? Math.round((doc.count / stats.total) * 100) : 0;
              return (
                <div key={doc.key} className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke={percentage >= 80 ? '#22c55e' : percentage >= 50 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${percentage * 1.76} 176`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                      {percentage}%
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-600">{doc.label}</p>
                  <p className="text-xs text-gray-400">{doc.count}/{stats.total}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">Show:</span>
        {[
          { id: 'all', label: 'All' },
          { id: 'incomplete', label: 'Incomplete' },
          { id: 'ready', label: 'Ready for Review' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === f.id
                ? 'bg-[#FF6B35] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Lead</th>
              <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase" title="Bank Statement 1">B1</th>
              <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase" title="Bank Statement 2">B2</th>
              <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase" title="Bank Statement 3">B3</th>
              <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase" title="Driver's License">DL</th>
              <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase" title="Void Check">VC</th>
              <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase" title="Actual files uploaded">Files</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No leads found matching this filter</p>
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onSelectLead?.(lead)}
                      className="text-left hover:text-[#FF6B35] transition group"
                    >
                      <p className="font-semibold text-gray-900 group-hover:text-[#FF6B35]">
                        {lead.businessName || <span className="text-gray-400 italic">No business name</span>}
                      </p>
                      <p className="text-xs text-gray-500">
                        {lead.firstName || lead.lastName
                          ? `${lead.firstName} ${lead.lastName}`.trim()
                          : lead.email || 'No contact info'}
                      </p>
                    </button>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <DocIcon hasDoc={lead.documents?.bankStatement1} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <DocIcon hasDoc={lead.documents?.bankStatement2} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <DocIcon hasDoc={lead.documents?.bankStatement3} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <DocIcon hasDoc={lead.documents?.driversLicense} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <DocIcon hasDoc={lead.documents?.voidCheck} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    {actualDocCounts[lead.id] !== undefined ? (
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        actualDocCounts[lead.id] >= 5 ? 'bg-green-100 text-green-700' :
                        actualDocCounts[lead.id] > 0 ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {actualDocCounts[lead.id]}
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchActualDocCount(lead.id);
                        }}
                        disabled={loadingActualDocs === lead.id}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {loadingActualDocs === lead.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Check'
                        )}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {lead.readyForReview ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Ready
                      </span>
                    ) : lead.documentsComplete ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        {getMissingCount(lead)} missing
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelectLead?.(lead)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition ml-auto"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span>Document flag set</span>
        </div>
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-400" />
          <span>Document flag not set</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold bg-green-100 text-green-700">5</span>
          <span>Files = Actual uploaded files (click "Check" to verify)</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm">
        <p className="text-blue-800">
          <strong>Note:</strong> The B1-VC columns show internal tracking flags. The "Files" column shows actual uploaded files.
          If these don't match, the files were uploaded but flags weren't saved properly. Click "View" to see actual documents in the lead profile.
        </p>
      </div>
    </div>
  );
}

// Document Icon Component
function DocIcon({ hasDoc }: { hasDoc?: boolean }) {
  return hasDoc ? (
    <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
  ) : (
    <XCircle className="w-5 h-5 text-red-400 mx-auto" />
  );
}
