'use client';

import { useState, useEffect } from 'react';
import {
  Mail, MessageSquare, TrendingUp, Eye, MousePointer,
  Send, Loader2, RefreshCw, BarChart3, Award
} from 'lucide-react';

interface TemplateMetrics {
  templateId: string;
  templateName: string;
  type: 'email' | 'sms';
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;
  lastUsed: string;
}

interface DailyMetrics {
  date: string;
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
  smsSent: number;
  smsDelivered: number;
}

interface OverallStats {
  totalEmailsSent: number;
  totalEmailsOpened: number;
  totalEmailsClicked: number;
  totalSmsSent: number;
  totalSmsDelivered: number;
  overallOpenRate: number;
  overallClickRate: number;
  topTemplates: TemplateMetrics[];
}

export default function AnalyticsTab() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<TemplateMetrics[]>([]);
  const [smsTemplates, setSmsTemplates] = useState<TemplateMetrics[]>([]);
  const [activeView, setActiveView] = useState<'overview' | 'email' | 'sms'>('overview');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setDailyMetrics(data.dailyMetrics || []);
        setEmailTemplates(data.emailTemplates || []);
        setSmsTemplates(data.smsTemplates || []);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Calculate max value for chart scaling
  const maxDailyValue = Math.max(
    ...dailyMetrics.map(d => Math.max(d.emailsSent, d.smsSent)),
    1
  );

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
          <h2 className="text-2xl font-bold text-gray-900">Email & SMS Analytics</h2>
          <p className="text-gray-500 mt-1">Track performance of your messaging campaigns</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 border-b pb-4">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'email', label: 'Email Templates', icon: Mail },
          { id: 'sms', label: 'SMS Templates', icon: MessageSquare },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeView === tab.id
                ? 'bg-[#FF6B35] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeView === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Send className="w-5 h-5 text-blue-600" />}
              label="Emails Sent"
              value={stats?.totalEmailsSent || 0}
              bgColor="bg-blue-50"
            />
            <StatCard
              icon={<Eye className="w-5 h-5 text-green-600" />}
              label="Emails Opened"
              value={stats?.totalEmailsOpened || 0}
              subValue={`${stats?.overallOpenRate || 0}% open rate`}
              bgColor="bg-green-50"
            />
            <StatCard
              icon={<MousePointer className="w-5 h-5 text-purple-600" />}
              label="Emails Clicked"
              value={stats?.totalEmailsClicked || 0}
              subValue={`${stats?.overallClickRate || 0}% click rate`}
              bgColor="bg-purple-50"
            />
            <StatCard
              icon={<MessageSquare className="w-5 h-5 text-orange-600" />}
              label="SMS Sent"
              value={stats?.totalSmsSent || 0}
              subValue={`${stats?.totalSmsDelivered || 0} delivered`}
              bgColor="bg-orange-50"
            />
          </div>

          {/* Daily Activity Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Last 7 Days Activity</h3>
            {dailyMetrics.length > 0 ? (
              <div className="space-y-3">
                {dailyMetrics.slice(0, 7).reverse().map((day) => {
                  const date = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                  const emailWidth = maxDailyValue > 0 ? (day.emailsSent / maxDailyValue) * 100 : 0;
                  const smsWidth = maxDailyValue > 0 ? (day.smsSent / maxDailyValue) * 100 : 0;

                  return (
                    <div key={day.date} className="flex items-center gap-4">
                      <span className="w-24 text-sm text-gray-500 font-medium">{date}</span>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${emailWidth}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-16">
                            {day.emailsSent} emails
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-500 rounded-full transition-all"
                              style={{ width: `${smsWidth}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-16">
                            {day.smsSent} SMS
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No activity data yet. Start sending messages to see analytics!</p>
              </div>
            )}
          </div>

          {/* Top Templates */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Top Performing Templates
            </h3>
            {(stats?.topTemplates || []).length > 0 ? (
              <div className="space-y-3">
                {stats?.topTemplates.map((template, index) => (
                  <div
                    key={template.templateId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-200 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{template.templateName}</p>
                        <p className="text-xs text-gray-500">
                          {template.type === 'email' ? 'Email' : 'SMS'} • {template.sent} sent
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {template.type === 'email' && (
                        <>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-green-600">{template.openRate}%</p>
                            <p className="text-xs text-gray-500">Opens</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-purple-600">{template.clickRate}%</p>
                            <p className="text-xs text-gray-500">Clicks</p>
                          </div>
                        </>
                      )}
                      {template.type === 'sms' && (
                        <div className="text-center">
                          <p className="text-sm font-semibold text-blue-600">{template.delivered}</p>
                          <p className="text-xs text-gray-500">Delivered</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No template data yet. Send some campaigns to see performance!</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeView === 'email' && (
        <TemplateTable
          templates={emailTemplates}
          type="email"
        />
      )}

      {activeView === 'sms' && (
        <TemplateTable
          templates={smsTemplates}
          type="sms"
        />
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  subValue,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  subValue?: string;
  bgColor: string;
}) {
  return (
    <div className={`${bgColor} rounded-xl p-4 border`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
    </div>
  );
}

// Template Table Component
function TemplateTable({
  templates,
  type,
}: {
  templates: TemplateMetrics[];
  type: 'email' | 'sms';
}) {
  if (templates.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        {type === 'email' ? (
          <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        ) : (
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        )}
        <p className="text-gray-500">No {type} template metrics yet.</p>
        <p className="text-sm text-gray-400 mt-1">Send some {type}s to see performance data!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Template</th>
            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sent</th>
            {type === 'email' && (
              <>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Opened</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Open Rate</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Clicked</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Click Rate</th>
              </>
            )}
            {type === 'sms' && (
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Delivered</th>
            )}
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Used</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {templates.map((template) => (
            <tr key={template.templateId} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900">{template.templateName}</p>
                <p className="text-xs text-gray-500">{template.templateId}</p>
              </td>
              <td className="px-4 py-3 text-center font-medium">{template.sent}</td>
              {type === 'email' && (
                <>
                  <td className="px-4 py-3 text-center">{template.opened}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.openRate >= 30 ? 'bg-green-100 text-green-700' :
                      template.openRate >= 15 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {template.openRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{template.clicked}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.clickRate >= 10 ? 'bg-green-100 text-green-700' :
                      template.clickRate >= 5 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {template.clickRate}%
                    </span>
                  </td>
                </>
              )}
              {type === 'sms' && (
                <td className="px-4 py-3 text-center">{template.delivered}</td>
              )}
              <td className="px-4 py-3 text-right text-sm text-gray-500">
                {new Date(template.lastUsed).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
