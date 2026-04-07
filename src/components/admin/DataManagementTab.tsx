'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Database, Trash2, AlertTriangle, RefreshCw, Loader2,
  CheckCircle, Mail, FileText, MessageSquare, BarChart2
} from 'lucide-react';

interface DataCounts {
  messages: number;
  documents: number;
  notes: number;
  analytics: number;
  leads?: number;
}

export default function DataManagementTab() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<DataCounts | null>(null);
  const [leadsCount, setLeadsCount] = useState<number>(0);
  const [wiping, setWiping] = useState(false);
  const [wipeResult, setWipeResult] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const fetchCounts = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch blob store counts
      const blobResponse = await fetch('/api/wipe-all-data');
      const blobData = await blobResponse.json();

      // Fetch leads count
      const leadsResponse = await fetch('/api/leads');
      const leadsData = await leadsResponse.json();

      setCounts(blobData.counts || {});
      setLeadsCount(leadsData.leads?.length || 0);
    } catch (error) {
      console.error('Failed to fetch counts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const handleWipeAll = async () => {
    if (confirmText !== 'WIPE ALL') {
      alert('Please type "WIPE ALL" to confirm');
      return;
    }

    setWiping(true);
    setWipeResult(null);

    try {
      const response = await fetch('/api/wipe-all-data', {
        method: 'DELETE',
        headers: {
          'x-confirm-wipe': 'WIPE_ALL_DATA_CONFIRMED',
        },
      });

      const result = await response.json();
      setWipeResult(result);

      if (result.success) {
        // Refresh counts
        await fetchCounts();
        setShowConfirm(false);
        setConfirmText('');
      }
    } catch (error: any) {
      setWipeResult({ error: error.message });
    } finally {
      setWiping(false);
    }
  };

  const totalItems = (counts?.messages || 0) +
                     (counts?.documents || 0) +
                     (counts?.notes || 0) +
                     (counts?.analytics || 0) +
                     leadsCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="w-6 h-6 text-gray-600" />
            Data Management
          </h2>
          <p className="text-gray-500">View and manage all stored data across all systems</p>
        </div>
        <button
          onClick={fetchCounts}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Data Stores Overview */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Data Stores</h3>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Supabase Leads */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Database className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600">SUPABASE</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{leadsCount}</p>
              <p className="text-sm text-gray-500">Leads</p>
            </div>

            {/* Messages */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-xs font-medium text-green-600">BLOBS</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{counts?.messages ?? '-'}</p>
              <p className="text-sm text-gray-500">Messages</p>
            </div>

            {/* Documents */}
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-orange-600">BLOBS</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{counts?.documents ?? '-'}</p>
              <p className="text-sm text-gray-500">Documents</p>
            </div>

            {/* Notes */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-purple-600">BLOBS</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{counts?.notes ?? '-'}</p>
              <p className="text-sm text-gray-500">Notes</p>
            </div>

            {/* Analytics */}
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <BarChart2 className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-xs font-medium text-red-600">BLOBS</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{counts?.analytics ?? '-'}</p>
              <p className="text-sm text-gray-500">Analytics Events</p>
              <p className="text-xs text-red-500 mt-1">Email opens, clicks, etc.</p>
            </div>
          </div>
        )}

        {/* Total */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <span className="text-gray-600">Total Items:</span>
          <span className="text-xl font-bold text-gray-900">{totalItems}</span>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-bold text-red-700">Danger Zone</h3>
        </div>

        <p className="text-gray-600 mb-4">
          This will <strong>permanently delete ALL data</strong> from all stores:
        </p>

        <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
          <li>All {leadsCount} leads (Supabase)</li>
          <li>All {counts?.messages ?? 0} message logs (Netlify Blobs)</li>
          <li>All {counts?.documents ?? 0} uploaded documents (Netlify Blobs)</li>
          <li>All {counts?.notes ?? 0} notes (Netlify Blobs)</li>
          <li>All {counts?.analytics ?? 0} analytics events - <span className="text-red-600 font-medium">including email opens!</span> (Netlify Blobs)</li>
        </ul>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={totalItems === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Wipe All Data ({totalItems} items)
          </button>
        ) : (
          <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="font-medium text-red-700">
              ⚠️ This action cannot be undone! Type <code className="bg-red-100 px-1 rounded">WIPE ALL</code> to confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder='Type "WIPE ALL"'
              className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex gap-3">
              <button
                onClick={handleWipeAll}
                disabled={wiping || confirmText !== 'WIPE ALL'}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {wiping ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Wiping...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Confirm Wipe
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmText('');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {wipeResult && (
          <div className={`mt-4 p-4 rounded-lg ${wipeResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {wipeResult.success ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-700">All data wiped successfully!</span>
                </div>
                <p className="text-sm text-green-600">
                  Deleted {wipeResult.summary?.totalDeleted} items total
                </p>
                {wipeResult.details && (
                  <div className="mt-2 text-xs text-green-700">
                    {Object.entries(wipeResult.details).map(([key, val]: [string, any]) => (
                      <p key={key}>• {key}: {val.deleted} deleted</p>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-red-700">Error: {wipeResult.error}</p>
            )}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
        <h4 className="font-medium text-blue-800 mb-2">ℹ️ About Data Storage</h4>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>Supabase:</strong> Lead records with contact info, stage, drip status</p>
          <p><strong>Netlify Blobs - Messages:</strong> Email/SMS logs with send status</p>
          <p><strong>Netlify Blobs - Documents:</strong> Uploaded bank statements, DL, void checks</p>
          <p><strong>Netlify Blobs - Notes:</strong> Admin notes on leads</p>
          <p><strong>Netlify Blobs - Analytics:</strong> Email open/click tracking, daily metrics, template stats</p>
        </div>
      </div>
    </div>
  );
}
