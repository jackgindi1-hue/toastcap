'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Check, PartyPopper } from 'lucide-react';

function ThankYouDLVCContent() {
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
            <Image src="/toast-capital-logo.png" alt="Toast Capital Logo" width={560} height={160} className="object-contain w-[180px] h-auto md:w-[250px]" />
          </Link>
          <div className="flex items-center gap-4">
            <a href="tel:617-533-3190" className="hidden md:flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#FF8C42]" />
              <span className="font-bold text-lg">617-533-3190</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Footer - Phone */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-green-500 shadow-lg">
        <a href="tel:617-533-3190" className="flex items-center justify-center gap-3 py-4 px-6">
          <Phone className="w-6 h-6 text-black flex-shrink-0" />
          <div className="flex flex-col items-start">
            <span className="text-xs font-semibold text-white">Questions? Tap to call!</span>
            <span className="text-lg font-bold text-black">617-533-3190</span>
          </div>
        </a>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gradient-to-br from-green-50 via-green-100 to-blue-50 px-4 py-12 pb-24 md:pb-12 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full translate-x-1/2 translate-y-1/2" />

        <div className="max-w-4xl mx-auto w-full relative z-10">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <PartyPopper className="w-14 h-14 text-green-600" strokeWidth={2} />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 text-center">
            Congratulations{fullName && `, ${fullName}`}!
          </h1>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
            <div className="text-center mb-8">
              <p className="text-xl md:text-2xl text-gray-700 mb-6 font-semibold">
                Your verification documents for {businessName} have been received!
              </p>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 md:p-8 mb-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-7 h-7 text-white" strokeWidth={3} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Documents Received</h2>
                </div>

                <div className="space-y-4 text-left max-w-2xl mx-auto">
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 text-lg">
                      <strong>Driver's License Received</strong> - Your identity verification document has been submitted
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 text-lg">
                      <strong>Void Check Received</strong> - Your bank account information has been recorded
                    </p>
                  </div>
                </div>
              </div>

              {/* What Happens Next */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">What Happens Next</h3>
                <div className="space-y-3 max-w-xl mx-auto">
                  <div className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                    <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Identity Verified</p>
                      <p className="text-sm text-gray-600">Your driver's license has been received</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                    <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Final Underwriting: In Progress!</p>
                      <p className="text-sm text-gray-600">Your bank details are being verified</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-yellow-50 rounded-lg p-3 shadow-sm border-2 border-yellow-400">
                    <div className="w-7 h-7 bg-[#FF8C42] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 animate-pulse">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Contract & Funding</p>
                      <p className="text-sm text-gray-600">Check your email for the funding agreement to sign</p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-green-700 font-medium mt-4">
                  We will reach out only if anything else is needed!
                </p>
              </div>

              {/* Call to Action */}
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-6 mb-6">
                <p className="text-xl font-semibold text-gray-900 mb-4">
                  Have Questions? We're Here to Help!
                </p>
                <div className="flex flex-col items-center gap-3">
                  <a
                    href="tel:6175333190"
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full text-center w-full md:w-auto text-lg transition-all transform hover:scale-105"
                  >
                    <Phone className="inline-block w-5 h-5 mr-2" />
                    Call (617) 533-3190
                  </a>
                  <p className="text-gray-600">
                    Our team is standing by to answer your questions
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-center mb-6 text-gray-900">Trusted by Thousands of Businesses, Just like you</h3>
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg mb-2 md:mb-3">
                    <Image
                      src="/bbb-accredited.png"
                      alt="BBB Accredited Business A+ Rating"
                      width={280}
                      height={110}
                      className="object-contain w-[90px] h-auto md:w-[180px]"
                    />
                  </div>
                  <p className="text-xs md:text-sm font-bold text-gray-800 text-center">1.4k+ 5 Star Reviews</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg mb-2 md:mb-3">
                    <Image
                      src="/trustpilot-new.png"
                      alt="Trustpilot 5 Stars"
                      width={280}
                      height={110}
                      className="object-contain w-[90px] h-auto md:w-[180px]"
                    />
                  </div>
                  <p className="text-xs md:text-sm font-bold text-gray-800 text-center">Rated 4.8/5 Stars</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg mb-2 md:mb-3">
                    <Image
                      src="/google-rating.png"
                      alt="Google 4.9 Rating"
                      width={280}
                      height={110}
                      className="object-contain w-[90px] h-auto md:w-[180px]"
                    />
                  </div>
                  <p className="text-xs md:text-sm font-bold text-gray-800 text-center">2.3k+ 5 Star Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Simplified */}
      <footer className="py-8 md:py-12 px-4 md:px-6 bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Logo and Links */}
            <div className="space-y-4">
              <Image src="/toast-capital-logo.png" alt="Toast Capital Logo" width={560} height={160} className="object-contain w-[180px] h-auto md:w-[220px]" />
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <a href="#" className="hover:text-[#FF8C42] transition">Terms & Conditions</a>
                <span>|</span>
                <Link href="/privacy" className="hover:text-[#FF8C42] transition">Privacy Policy</Link>
                <span>|</span>
                <a href="#" className="hover:text-[#FF8C42] transition">Contact Us</a>
              </div>
            </div>
            {/* Copyright */}
            <div className="text-sm text-gray-600">
              <p>&copy; 2025 Toast Capital. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function ThankYouDLVCPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8C42] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ThankYouDLVCContent />
    </Suspense>
  );
}
