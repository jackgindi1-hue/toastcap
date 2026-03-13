'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Lock, Clock } from 'lucide-react';

// DocuSign URL
const DOCUSIGN_URL = "https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=89764605-cb04-4695-9167-86dd1456c77a&env=na4&acct=c238cbb6-3f73-4721-9f47-2f0536de2c7a&v=2";

export default function DocuSignPage() {
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
                <Phone className="w-5 h-5 text-[#FF8C42]" />
                <span className="font-bold text-lg">617-533-3190</span>
              </a>
            </div>
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
      <div className="flex-grow bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Complete Your Application
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Just three simple steps to get funded!
            </p>
          </div>

          {/* Step 1: DocuSign - ACTIVE */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF8C42] to-[#FF7028] rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Step 1: Owner & Business Verification</h2>
                <p className="text-gray-600">
                  Zero impact to your credit score (Minimum 500 credit score to qualify)
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
              <iframe
                src={DOCUSIGN_URL}
                width="100%"
                height="800"
                frameBorder="0"
                className="w-full"
                title="DocuSign Identity Verification"
              />
            </div>
          </div>

          {/* Step 2: Bank Statements - PENDING */}
          <div className="bg-gray-100 rounded-2xl shadow-lg p-6 md:p-8 mb-6 opacity-60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-500">Step 2: Upload Bank Statements</h2>
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>
                </div>
                <p className="text-gray-400">Complete Step 1 first, then upload your bank statements</p>
              </div>
              <Lock className="w-6 h-6 text-gray-400" />
            </div>
            <div className="bg-gray-200 rounded-xl p-8 text-center">
              <p className="text-gray-500">This step will be available after completing identity verification</p>
              <Link href="/upload" className="inline-block mt-4 text-[#FF8C42] font-semibold hover:underline">
                Go to Upload Page →
              </Link>
            </div>
          </div>

          {/* Step 3: Get Funded - PENDING */}
          <div className="bg-gray-100 rounded-2xl shadow-lg p-6 md:p-8 mb-8 opacity-60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-500">Step 3: Get Funded</h2>
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>
                </div>
                <p className="text-gray-400">We'll take it from here once you complete the steps above</p>
              </div>
              <Lock className="w-6 h-6 text-gray-400" />
            </div>
            <div className="bg-gray-200 rounded-xl p-8 text-center">
              <p className="text-gray-500">A funding specialist will contact you after all steps are completed</p>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-6 text-center">
            <p className="text-xl font-semibold text-gray-900 mb-4">Need Help or Have Questions?</p>
            <a href="tel:6175333190" className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full transition-all transform hover:scale-105">
              <Phone className="inline-block w-5 h-5 mr-2" />
              Call (617) 533-3190
            </a>
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
