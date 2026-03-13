'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Check } from 'lucide-react';
import ProgressTracker from '@/components/ProgressTracker';
import Footer from '@/components/Footer';

// Application steps for progress tracker
const applicationSteps = [
  { id: 1, label: 'Get Quote', description: 'Business info' },
  { id: 2, label: 'Verify & Upload', description: 'Documents' },
  { id: 3, label: 'Get Funded', description: 'Approval' },
];

function ThankYouUploadContent() {
  const searchParams = useSearchParams();
  const firstName = searchParams.get('firstName') || '';
  const lastName = searchParams.get('lastName') || '';
  const businessName = searchParams.get('businessName') || 'Your Business';
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - reduced padding */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/toast-capital-logo.png" alt="Toast Capital Logo" width={400} height={120} className="object-contain w-[140px] h-auto md:w-[180px]" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm text-gray-600 font-medium">Questions? Call Us! Live agents standing by</span>
              <a href="tel:617-533-3190" className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#FF6B35]" />
                <span className="font-bold text-lg">617-533-3190</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow bg-gradient-to-br from-green-50 via-green-100 to-blue-50 px-4 py-12 pb-24 md:pb-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto w-full relative z-10">
          {/* Progress Tracker */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
            <ProgressTracker steps={applicationSteps} currentStep={3} />
          </div>

          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <Check className="w-16 h-16 text-green-600" strokeWidth={3} />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 text-center">
            Thank You{fullName && `, ${fullName}`}!
          </h1>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
            <div className="text-center mb-8">
              <p className="text-xl md:text-2xl text-gray-700 mb-6 font-semibold">
                We&apos;ve received your application and bank statements for {businessName}
              </p>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 md:p-8 mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-7 h-7 text-white" strokeWidth={3} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Application Submitted</h2>
                </div>

                <div className="space-y-4 text-left max-w-2xl mx-auto">
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 text-lg">
                      <strong>Your application is being reviewed</strong> - Our team is carefully reviewing your information
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 text-lg">
                      <strong>We&apos;ll call you soon</strong> - A funding specialist will contact you within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* NEXT STEP: Complete Identity Verification */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-400 rounded-2xl p-6 mb-6">
                <div className="text-center">
                  <p className="text-sm font-bold text-orange-600 mb-2 uppercase tracking-wide">
                    One More Step to Complete Your Application
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Complete Identity Verification
                  </h3>
                  <p className="text-gray-700 mb-6 max-w-lg mx-auto">
                    To finalize your funding application, please upload your driver&apos;s license and void check.
                  </p>
                  <Link
                    href="/dlvc"
                    className="inline-flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-bold py-4 px-10 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    Complete Identity Verification
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
                <p className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  Have Questions? We&apos;re Here to Help!
                </p>
                <div className="flex flex-col items-center gap-3">
                  <a
                    href="tel:6175333190"
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full text-center w-full md:w-auto text-lg transition-all transform hover:scale-105"
                  >
                    <Phone className="inline-block w-5 h-5 mr-2" />
                    Call (617) 533-3190
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ThankYouUploadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ThankYouUploadContent />
    </Suspense>
  );
}
