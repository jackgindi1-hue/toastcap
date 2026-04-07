'use client';

import { useState, useEffect } from 'react';
import { Check, Plus, Trash2, Loader2, Globe, Mail, AlertCircle } from 'lucide-react';

interface Settings {
  id: string;
  activeSendFromDomain: string;
  sendFromDomains: string[];
  activeLandingDomain: string;
  landingDomains: string[];
  trackingDomain: string;
  updatedAt: string;
}

export default function SettingsTab() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // New domain input states
  const [newSendFromDomain, setNewSendFromDomain] = useState('');
  const [newLandingDomain, setNewLandingDomain] = useState('');
  const [addingSendFrom, setAddingSendFrom] = useState(false);
  const [addingLanding, setAddingLanding] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      setError('Failed to load settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (action: string, domain: string, type?: string) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, domain, type }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update');
      }

      const updatedSettings = await res.json();
      setSettings(updatedSettings);
      setSuccess('Settings updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSetActiveSendFrom = (domain: string) => {
    updateSetting('setActiveSendFrom', domain);
  };

  const handleSetActiveLanding = (domain: string) => {
    updateSetting('setActiveLanding', domain);
  };

  const handleAddSendFromDomain = async () => {
    if (!newSendFromDomain.trim()) return;
    setAddingSendFrom(true);
    await updateSetting('addDomain', newSendFromDomain.trim().toLowerCase(), 'sendFrom');
    setNewSendFromDomain('');
    setAddingSendFrom(false);
  };

  const handleAddLandingDomain = async () => {
    if (!newLandingDomain.trim()) return;
    setAddingLanding(true);
    await updateSetting('addDomain', newLandingDomain.trim().toLowerCase(), 'landing');
    setNewLandingDomain('');
    setAddingLanding(false);
  };

  const handleRemoveSendFromDomain = (domain: string) => {
    if (confirm(`Remove ${domain} from send-from domains?`)) {
      updateSetting('removeDomain', domain, 'sendFrom');
    }
  };

  const handleRemoveLandingDomain = (domain: string) => {
    if (confirm(`Remove ${domain} from landing page domains?`)) {
      updateSetting('removeDomain', domain, 'landing');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">Manage email and landing page domains</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-500" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Send From Domain */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Mail className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Send From Domain</h3>
            <p className="text-sm text-gray-500">Emails will be sent from support@[domain]</p>
          </div>
        </div>

        <div className="space-y-2">
          {settings?.sendFromDomains.map((domain) => (
            <div
              key={domain}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                domain === settings.activeSendFromDomain
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSetActiveSendFrom(domain)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    domain === settings.activeSendFromDomain
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-gray-300'
                  }`}
                >
                  {domain === settings.activeSendFromDomain && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="font-medium">support@{domain}</span>
                {domain === settings.activeSendFromDomain && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              {settings.sendFromDomains.length > 1 && domain !== settings.activeSendFromDomain && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSendFromDomain(domain);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add new domain */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newSendFromDomain}
            onChange={(e) => setNewSendFromDomain(e.target.value)}
            placeholder="Add domain (e.g., toastcap.net)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAddSendFromDomain()}
          />
          <button
            onClick={handleAddSendFromDomain}
            disabled={addingSendFrom || !newSendFromDomain.trim()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {addingSendFrom ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Note: Domain must be verified in Resend before it can send emails.
        </p>
      </div>

      {/* Landing Page Domain */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Landing Page Domain</h3>
            <p className="text-sm text-gray-500">Email links will point to this domain</p>
          </div>
        </div>

        <div className="space-y-2">
          {settings?.landingDomains.map((domain) => (
            <div
              key={domain}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                domain === settings.activeLandingDomain
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSetActiveLanding(domain)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    domain === settings.activeLandingDomain
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {domain === settings.activeLandingDomain && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="font-medium">{domain}</span>
                {domain === settings.activeLandingDomain && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              {settings.landingDomains.length > 1 && domain !== settings.activeLandingDomain && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveLandingDomain(domain);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add new domain */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newLandingDomain}
            onChange={(e) => setNewLandingDomain(e.target.value)}
            placeholder="Add domain (e.g., toastcap.net)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAddLandingDomain()}
          />
          <button
            onClick={handleAddLandingDomain}
            disabled={addingLanding || !newLandingDomain.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {addingLanding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </div>
      </div>

      {/* Tracking Domain (Read-only info) */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Tracking Domain</h3>
            <p className="text-sm text-gray-500">Email opens/clicks are tracked through this domain</p>
          </div>
        </div>
        <div className="p-3 bg-white rounded-lg border border-gray-200">
          <span className="font-mono text-sm">{settings?.trackingDomain || 'toastcap-crm.netlify.app'}</span>
          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            Bulletproof
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          This is your CRM domain on Netlify - it can never be suspended.
        </p>
      </div>

      {/* Saving indicator */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
          <Loader2 className="w-4 h-4 animate-spin" />
          Saving...
        </div>
      )}
    </div>
  );
}
