'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Phone, AlertCircle, Users, ArrowRight, RefreshCw, FlaskConical, Trophy, BarChart3 } from 'lucide-react';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  businessName: string;
  phone: string;
  email: string;
  stage: 'quote' | 'application' | 'dlvc' | 'funded';
  createdAt: string;
  updatedAt: string;
}

interface FunnelData {
  quote: number;
  application: number;
  dlvc: number;
  funded: number;
}

interface ABTestMetric {
  templateBase: string;
  templateName: string;
  original: { sent: number; opened: number; clicked: number; openRate: number; clickRate: number };
  v2: { sent: number; opened: number; clicked: number; openRate: number; clickRate: number };
  winner: 'original' | 'v2' | 'tie' | 'insufficient_data';
  confidenceLevel: number;
}

interface ABTestSummary {
  totalOriginalSent: number;
  totalV2Sent: number;
  avgOriginalOpenRate: number;
  avgV2OpenRate: number;
  overallWinner: 'original' | 'v2' | 'tie' | 'insufficient_data';
  templatesWithWinner: number;
}

export default function AnalyticsTab() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [funnel, setFunnel] = useState<FunnelData>({ quote: 0, application: 0, dlvc: 0, funded: 0 });
  const [needsAttention, setNeedsAttention] = useState<Lead[]>([]);
  const [abTestMetrics, setAbTestMetrics] = useState<ABTestMetric[]>([]);
  const [abTestSummary, setAbTestSummary] = useState<ABTestSummary | null>(null);
  const [loadingABTest, setLoadingABTest] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      const allLeads: Lead[] = data.leads || [];
      setLeads(allLeads);

      const funnelCounts: FunnelData = { quote: 0, application: 0, dlvc: 0, funded: 0 };
      allLeads.forEach((lead) => {
        if (lead.stage in funnelCounts) {
          funnelCounts[lead.stage as keyof FunnelData]++;
        }
      });
      setFunnel(funnelCounts);

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const stale = allLeads.filter((lead) => {
        if (lead.stage === 'funded') return false;
        const lastActivity = new Date(lead.updatedAt || lead.createdAt);
        return lastActivity < threeDaysAgo;
      });
      setNeedsAttention(stale.slice(0, 10));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchABTestData = useCallback(async () => {
    setLoadingABTest(true);
    try {
      const response = await fetch('/api/analytics/ab-test');
      const data = await response.json();
      if (data.success) {
        setAbTestMetrics(data.templates || []);
        setAbTestSummary(data.summary || null);
      }
    } catch (error) {
      console.error('Failed to fetch A/B test data:', error);
    } finally {
      setLoadingABTest(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchABTestData();
  }, [fetchData, fetchABTestData]);

  const getConversionRate = (from: number, to: number) => {
    if (from === 0) return 0;
    return Math.round((to / from) * 100);
  };

  const quoteToApp = getConversionRate(funnel.quote + funnel.application + funnel.dlvc + funnel.funded, funnel.application + funnel.dlvc + funnel.funded);
  const appToDlvc = getConversionRate(funnel.application + funnel.dlvc + funnel.funded, funnel.dlvc + funnel.funded);
  const dlvcToFunded = getConversionRate(funnel.dlvc + funnel.funded, funnel.funded);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const totalLeads = funnel.quote + funnel.application + funnel.dlvc + funnel.funded;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
          <p className="text-gray-500">{totalLeads} total leads</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
          <RefreshCw className="w-4 h-4" />Refresh
        </button>
      </div>

      {/* Funnel */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Pipeline</h3>
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <div className="inline-flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-gray-700">{funnel.quote}</span>
              </div>
              <span className="text-sm font-medium text-gray-600">Quote</span>
            </div>
          </div>
          <div className="flex flex-col items-center px-2">
            <ArrowRight className="w-6 h-6 text-gray-300" />
            <span className="text-xs text-gray-400 mt-1">{quoteToApp}%</span>
          </div>
          <div className="flex-1 text-center">
            <div className="inline-flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-blue-700">{funnel.application}</span>
              </div>
              <span className="text-sm font-medium text-gray-600">Application</span>
            </div>
          </div>
          <div className="flex flex-col items-center px-2">
            <ArrowRight className="w-6 h-6 text-gray-300" />
            <span className="text-xs text-gray-400 mt-1">{appToDlvc}%</span>
          </div>
          <div className="flex-1 text-center">
            <div className="inline-flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-orange-700">{funnel.dlvc}</span>
              </div>
              <span className="text-sm font-medium text-gray-600">DLVC</span>
            </div>
          </div>
          <div className="flex flex-col items-center px-2">
            <ArrowRight className="w-6 h-6 text-gray-300" />
            <span className="text-xs text-gray-400 mt-1">{dlvcToFunded}%</span>
          </div>
          <div className="flex-1 text-center">
            <div className="inline-flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-green-700">{funnel.funded}</span>
              </div>
              <span className="text-sm font-medium text-gray-600">Funded</span>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t flex justify-center gap-8 text-sm">
          <div className="text-center"><span className="text-gray-500">Quote → App</span><p className="font-bold text-lg">{quoteToApp}%</p></div>
          <div className="text-center"><span className="text-gray-500">App → DLVC</span><p className="font-bold text-lg">{appToDlvc}%</p></div>
          <div className="text-center"><span className="text-gray-500">DLVC → Funded</span><p className="font-bold text-lg">{dlvcToFunded}%</p></div>
        </div>
      </div>

      {/* Needs Attention */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-gray-900">Needs Attention</h3>
          <span className="text-sm text-gray-500">({needsAttention.length} leads with no activity in 3+ days)</span>
        </div>
        {needsAttention.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" /><p>All leads are active!</p>
          </div>
        ) : (
          <div className="divide-y">
            {needsAttention.map((lead) => (
              <div key={lead.id} className="py-3 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{lead.firstName} {lead.lastName}</p>
                  <p className="text-sm text-gray-500">{lead.businessName} • Last activity: {formatDate(lead.updatedAt || lead.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.stage === 'quote' ? 'bg-gray-100 text-gray-700' :
                    lead.stage === 'application' ? 'bg-blue-100 text-blue-700' :
                    lead.stage === 'dlvc' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                  }`}>{lead.stage}</span>
                  {lead.phone && (
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                      <Phone className="w-3 h-3" />Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* A/B Test Results */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">A/B Test: Original vs V2 Emails</h3>
          </div>
          <button onClick={fetchABTestData} disabled={loadingABTest} className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 rounded-lg text-sm text-purple-700 transition disabled:opacity-50">
            {loadingABTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}Refresh
          </button>
        </div>

        {loadingABTest && !abTestSummary ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-purple-500" /></div>
        ) : abTestSummary ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-xs text-purple-600 font-medium mb-1">Original Sent</p>
                <p className="text-2xl font-bold text-purple-900">{abTestSummary.totalOriginalSent}</p>
                <p className="text-sm text-purple-600">{abTestSummary.avgOriginalOpenRate}% open rate</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-xs text-orange-600 font-medium mb-1">V2 Sent</p>
                <p className="text-2xl font-bold text-orange-900">{abTestSummary.totalV2Sent}</p>
                <p className="text-sm text-orange-600">{abTestSummary.avgV2OpenRate}% open rate</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-medium mb-1">Templates Tested</p>
                <p className="text-2xl font-bold text-gray-900">{abTestMetrics.length}</p>
                <p className="text-sm text-gray-600">{abTestSummary.templatesWithWinner} with winners</p>
              </div>
              <div className={`rounded-lg p-4 ${abTestSummary.overallWinner === 'v2' ? 'bg-orange-100' : abTestSummary.overallWinner === 'original' ? 'bg-purple-100' : 'bg-gray-100'}`}>
                <p className="text-xs font-medium mb-1 text-gray-600">Overall Winner</p>
                <div className="flex items-center gap-2">
                  {abTestSummary.overallWinner !== 'insufficient_data' && <Trophy className="w-5 h-5 text-yellow-500" />}
                  <p className={`text-lg font-bold ${abTestSummary.overallWinner === 'v2' ? 'text-orange-700' : abTestSummary.overallWinner === 'original' ? 'text-purple-700' : abTestSummary.overallWinner === 'tie' ? 'text-gray-700' : 'text-gray-500'}`}>
                    {abTestSummary.overallWinner === 'v2' ? 'V2 Website Style' : abTestSummary.overallWinner === 'original' ? 'Original' : abTestSummary.overallWinner === 'tie' ? 'Tie' : 'Need More Data'}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Template</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-purple-600 uppercase">Original</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-orange-600 uppercase">V2</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Winner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {abTestMetrics.map((metric) => (
                    <tr key={metric.templateBase} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><p className="font-medium text-gray-900 text-sm">{metric.templateName}</p></td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-semibold text-gray-900">{metric.original.openRate}%</span>
                        <span className="text-xs text-gray-500 block">{metric.original.sent} sent</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-semibold text-gray-900">{metric.v2.openRate}%</span>
                        <span className="text-xs text-gray-500 block">{metric.v2.sent} sent</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {metric.winner === 'original' && <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"><Trophy className="w-3 h-3" /> Original</span>}
                        {metric.winner === 'v2' && <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"><Trophy className="w-3 h-3" /> V2</span>}
                        {metric.winner === 'tie' && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Tie</span>}
                        {metric.winner === 'insufficient_data' && <span className="px-2 py-1 bg-gray-50 text-gray-400 rounded-full text-xs font-medium">Need data</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">Winners determined by open rate. Minimum 50 sends per variant for statistical confidence.</p>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No A/B test data available yet</p>
            <p className="text-sm">Start sending emails with different styles to see comparisons</p>
          </div>
        )}
      </div>
    </div>
  );
}
