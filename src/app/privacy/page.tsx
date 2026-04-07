'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, ArrowLeft, Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';

// Session storage keys
const TOKEN_STORAGE_KEY = 'tc_session_token';
const LEAD_STORAGE_KEY = 'tc_session_lead';

// Redirect URL for 404 page
const REDIRECT_URL = 'https://pos.toasttab.com/products/capital';

type TokenState = 'loading' | 'valid' | 'invalid';

function PrivacyPageContent() {
  const searchParams = useSearchParams();
  const [tokenState, setTokenState] = useState<TokenState>('loading');
  const [token, setToken] = useState<string | null>(null);

  // Helper to build URLs with token
  const withToken = (path: string) => {
    if (!token) return path;
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}token=${token}`;
  };

  // Validate token on mount
  useEffect(() => {
    async function validateToken() {
      const urlToken = searchParams.get('token');
      const storedToken = typeof window !== 'undefined' ? sessionStorage.getItem(TOKEN_STORAGE_KEY) : null;
      const tokenToValidate = urlToken || storedToken;

      if (!tokenToValidate) {
        setTokenState('invalid');
        return;
      }

      try {
        const response = await fetch(`/api/tokens/validate?token=${tokenToValidate}&page=quote`);
        const data = await response.json();

        if (data.valid) {
          setToken(tokenToValidate);
          setTokenState('valid');

          // Store in sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(TOKEN_STORAGE_KEY, tokenToValidate);
            if (data.lead) {
              sessionStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(data.lead));
            }
          }
        } else {
          setTokenState('invalid');
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setTokenState('invalid');
      }
    }

    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Loading state
  if (tokenState === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 404 state
  if (tokenState === 'invalid') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="max-w-md mx-auto text-center">
          <Image src="/toast-capital-logo.png" alt="Toast Capital Logo" width={180} height={60} className="mx-auto mb-8" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-lg text-gray-700 mb-6">Sorry, this link is invalid or expired.</p>
          <a
            href={REDIRECT_URL}
            className="inline-block bg-[#FF6B35] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#FFB800] transition"
          >
            Visit Toast Capital
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Yellow Banner */}
      <div className="bg-[#FFB800] text-black py-2 px-4 text-center">
        <span className="text-sm md:text-base font-semibold">Already using Toast? Then you're pre-qualified for funding in minutes!</span>
      </div>

      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
          <Link href={withToken('/')} className="flex items-center">
            <Image src="/toast-capital-logo.png" alt="Toast Capital Logo" width={400} height={120} className="object-contain w-[80px] h-auto md:w-[180px]" />
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <a href="tel:617-533-3190" className="flex items-center gap-1 md:gap-3">
              <Phone className="w-5 h-5 md:w-10 md:h-10 text-[#FF6B35]" strokeWidth={1.5} />
              <div className="flex flex-col items-start">
                <span className="text-[10px] md:text-sm text-gray-800 font-semibold">Questions? Call Us!</span>
                <span className="hidden md:flex text-xs text-gray-600 items-center gap-1">Live Agents Standing By <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span></span>
                <span className="text-[10px] md:hidden text-gray-600 flex items-center gap-1">Live Agents <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span></span>
                <span className="font-bold text-xs md:text-xl text-gray-900">617-533-3190</span>
              </div>
            </a>
            <Link
              href={withToken('/quote')}
              className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold py-1.5 px-3 md:py-3 md:px-8 rounded-lg transition text-xs md:text-base whitespace-nowrap"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Footer - Phone (Orange like homepage) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FF6B35] shadow-lg">
        <a href="tel:617-533-3190" className="flex items-center justify-center gap-3 py-3 px-6">
          <Phone className="w-5 h-5 text-white" />
          <span className="text-white font-bold">Call: 617-533-3190</span>
        </a>
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 px-4 py-12 pb-24 md:pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link href={withToken('/')} className="inline-flex items-center gap-2 text-[#1E3A8A] hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-500 mb-8">Last Updated: January 2025</p>

            {/* SMS/Text Message Disclosure - Important for Twilio */}
            <section className="mb-10 p-6 bg-gray-50 border border-gray-200 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SMS/Text Message Terms & Opt-In Disclosure</h2>

              <div className="space-y-4 text-gray-700">
                <p>
                  By providing your phone number and submitting an application through Toast Capital, you expressly consent to receive SMS/text messages from Toast Capital regarding your application status, funding updates, and related communications.
                </p>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">What Messages You Will Receive:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Application confirmation and status updates</li>
                    <li>Reminders to complete required steps (document uploads, identity verification)</li>
                    <li>Funding decision notifications</li>
                    <li>Important account and service updates</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">Message Frequency:</h3>
                  <p className="text-sm">
                    Message frequency varies based on your application status. Typically, you will receive 3-5 messages during the application process.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">Opt-Out Instructions:</h3>
                  <p className="text-sm">
                    You can opt out of SMS messages at any time by replying <strong>STOP</strong> to any message you receive from us. You may also contact us at <a href="tel:617-533-3190" className="text-[#FF6B35] font-semibold">617-533-3190</a> or <a href="mailto:info@toastcap.com" className="text-[#FF6B35] font-semibold">info@toastcap.com</a> to opt out.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">Costs:</h3>
                  <p className="text-sm">
                    Message and data rates may apply. Check with your mobile carrier for details about your text messaging plan.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">Help:</h3>
                  <p className="text-sm">
                    For help, reply <strong>HELP</strong> to any message or contact us at <a href="tel:617-533-3190" className="text-[#FF6B35] font-semibold">617-533-3190</a>.
                  </p>
                </div>

                <p className="text-sm text-gray-600 italic">
                  By submitting your application, you confirm that you are the owner or authorized user of the mobile phone number provided and agree to receive automated SMS messages from Toast Capital. Consent is not a condition of purchase.
                </p>
              </div>
            </section>

            {/* General Privacy Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <div className="space-y-3 text-gray-700">
                <p>When you apply for funding through Toast Capital, we collect the following information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, date of birth</li>
                  <li><strong>Business Information:</strong> Business name, type, time in business, monthly revenue</li>
                  <li><strong>Financial Information:</strong> Bank statements, credit score range, funding amount requested</li>
                  <li><strong>Identity Verification:</strong> Driver's license, void check for bank verification</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <div className="space-y-3 text-gray-700">
                <p>We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Process and evaluate your funding application</li>
                  <li>Communicate with you about your application status via email and SMS</li>
                  <li>Verify your identity and business information</li>
                  <li>Connect you with appropriate funding partners</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Improve our services and customer experience</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
              <div className="space-y-3 text-gray-700">
                <p>We may share your information with:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Funding Partners:</strong> Lenders and financial institutions to process your application</li>
                  <li><strong>Service Providers:</strong> Third-party services that help us operate (email, SMS, document signing)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                </ul>
                <p className="mt-4">We do not sell your personal information to third parties for marketing purposes.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  We implement industry-standard security measures to protect your personal and financial information. All data transmitted through our website is encrypted using SSL/TLS technology. We regularly review and update our security practices to ensure your information remains protected.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <div className="space-y-3 text-gray-700">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information (subject to legal requirements)</li>
                  <li>Opt out of marketing communications</li>
                  <li>Opt out of SMS messages by replying STOP</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Our website uses cookies and similar technologies to improve your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookie settings through your browser preferences.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <div className="space-y-3 text-gray-700">
                <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200">
                  <p><strong>Toast Capital</strong></p>
                  <p>333 Summer Street</p>
                  <p>Boston, MA 02210</p>
                  <p className="mt-2">
                    <strong>Phone:</strong> <a href="tel:617-533-3190" className="text-[#FF6B35]">617-533-3190</a>
                  </p>
                  <p>
                    <strong>Email:</strong> <a href="mailto:info@toastcap.com" className="text-[#FF6B35]">info@toastcap.com</a>
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page with a new "Last Updated" date. Your continued use of our services after any changes indicates your acceptance of the updated policy.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PrivacyPageContent />
    </Suspense>
  );
}
