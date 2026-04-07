'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Check, ChevronRight, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';

function ThankYouUploadContent() {
  const searchParams = useSearchParams();
  const firstName = searchParams.get('firstName') || '';
  const lastName = searchParams.get('lastName') || '';
  const businessName = searchParams.get('businessName') || 'Your Business';
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Yellow Banner */}
      <div className="bg-[#FFB800] text-black py-2 px-4 text-center">
        <span className="text-sm md:text-base font-semibold">Already using Toast? Then you're pre-qualified for funding in minutes!</span>
      </div>

      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/toast-capital-logo.png" alt="Toast Capital Logo" width={400} height={120} className="object-contain w-[100px] h-auto md:w-[180px]" />
          </Link>
          <div className="flex items-center gap-4">
            <a href="tel:617-533-3190" className="flex items-center gap-2 md:gap-3">
              <Phone className="w-6 h-6 md:w-10 md:h-10 text-[#FF6B35]" strokeWidth={1.5} />
              <div className="flex flex-col items-start">
                <span className="text-xs md:text-sm text-gray-800 font-semibold">Questions? Call Us!</span>
                <span className="hidden md:flex text-xs text-gray-600 items-center gap-1">Live Agents Standing By <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span></span>
                <span className="text-xs md:hidden text-gray-600 flex items-center gap-1">Live Agents <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span></span>
                <span className="font-bold text-sm md:text-xl text-gray-900">617-533-3190</span>
              </div>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FF6B35] shadow-lg">
        <a href="tel:617-533-3190" className="flex items-center justify-center gap-3 py-3 px-6">
          <Phone className="w-5 h-5 text-white" />
          <span className="text-white font-bold">Call: 617-533-3190</span>
        </a>
      </div>

      {/* Hero Section - Matching Homepage Style */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <img src="/toast-icon.png" alt="Toast" className="w-6 h-6 rounded-full" />
                <ChevronRight className="w-4 h-4" />
                <span>Application</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">Application Submitted</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Thank You{fullName && `, ${fullName}`}!
              </h1>

              <p className="text-lg text-gray-600 mb-8">
                We've received your application and bank statements for <strong className="text-gray-900">{businessName}</strong>. One more step to complete your funding application.
              </p>

              {/* Progress Indicator */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#FF6B35] flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Quote</span>
                </div>
                <div className="w-8 h-1 bg-[#FF6B35] rounded"></div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#FF6B35] flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Verification</span>
                </div>
                <div className="w-8 h-1 bg-gray-300 rounded"></div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#FEF3C7] border-2 border-[#F59E0B] flex items-center justify-center">
                    <span className="text-[#D97706] font-bold">3</span>
                  </div>
                  <span className="text-sm font-semibold text-[#D97706]">Documents</span>
                </div>
              </div>

              <Link
                href="/dlvc"
                className="inline-flex items-center gap-2 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold py-4 px-8 rounded-lg transition text-lg"
              >
                Complete Identity Verification
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Right Content - Status Card */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#FF6B35] flex items-center justify-center">
                  <Check className="w-7 h-7 text-white" strokeWidth={3} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Application Submitted</h2>
              </div>

              {/* Status Items */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Your application is being reviewed</p>
                    <p className="text-sm text-gray-600">Our team is carefully reviewing your information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">We'll call you soon</p>
                    <p className="text-sm text-gray-600">A funding specialist will contact you within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Final Step CTA */}
              <div className="bg-orange-50 border-2 border-[#FF6B35] rounded-xl p-6">
                <p className="text-sm font-bold text-[#FF6B35] mb-2 uppercase tracking-wide">
                  One More Step
                </p>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Complete Identity Verification
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload your driver's license and void check to finalize your application.
                </p>
                <Link
                  href="/dlvc"
                  className="inline-flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold py-3 px-6 rounded-lg transition w-full"
                >
                  Complete Identity Verification
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What to expect next
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              After completing your identity verification, here's what happens.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-bold text-xl mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Documents</h3>
              <p className="text-gray-600">
                Upload your driver's license and void check to verify your identity.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white font-bold text-xl mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Review</h3>
              <p className="text-gray-600">
                Our team reviews your complete application within 24 hours.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="w-14 h-14 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white font-bold text-xl mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Funded</h3>
              <p className="text-gray-600">
                Sign your contract and receive funds as soon as the next business day!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white pb-24 md:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Have questions? We're here to help
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our funding specialists are standing by to answer any questions about your application.
          </p>
          <a
            href="tel:6175333190"
            className="inline-block bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold py-4 px-10 rounded-lg transition text-lg"
          >
            Call (617) 533-3190
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function ThankYouUploadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
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
