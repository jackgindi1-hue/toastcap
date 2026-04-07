'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Check, ChevronRight, FileText, CreditCard, Building2, ArrowRight, Clock, DollarSign, TrendingUp, Sparkles } from 'lucide-react';
import Footer from '@/components/Footer';

function ThankYouDLVCContent() {
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

      {/* Hero Section - Celebration Style with Side-by-Side Layout */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-b from-green-50 via-white to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <img src="/toast-icon.png" alt="Toast" className="w-6 h-6 rounded-full" />
                <ChevronRight className="w-4 h-4" />
                <span>Application</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-green-600 font-semibold">Complete</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Congratulations{firstName && `, ${firstName}`}!
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                All documents for <strong className="text-gray-900">{businessName}</strong> have been received. You're one step closer to fast, flexible funding!
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                  <Clock className="w-6 h-6 text-[#FF6B35] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">24h</p>
                  <p className="text-xs text-gray-500">Review Time</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                  <DollarSign className="w-6 h-6 text-[#FF6B35] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">$2M</p>
                  <p className="text-xs text-gray-500">Max Funding</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                  <TrendingUp className="w-6 h-6 text-[#FF6B35] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">Flex</p>
                  <p className="text-xs text-gray-500">Payments</p>
                </div>
              </div>

              <a
                href="tel:6175333190"
                className="inline-flex items-center gap-2 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold py-4 px-8 rounded-lg transition text-lg"
              >
                <Phone className="w-5 h-5" />
                Questions? Call (617) 533-3190
              </a>
            </div>

            {/* Right Content - Success Card with Documents */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">All Documents Received</h2>
                    <p className="text-green-600 text-sm font-medium">5 of 5 documents uploaded</p>
                  </div>
                </div>

                {/* Document List */}
                <div className="space-y-2 mb-6">
                  {[
                    { icon: FileText, label: 'Bank Statement - Month 1' },
                    { icon: FileText, label: 'Bank Statement - Month 2' },
                    { icon: FileText, label: 'Bank Statement - Month 3' },
                    { icon: CreditCard, label: "Driver's License" },
                    { icon: Building2, label: 'Void Check' },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <doc.icon className="w-5 h-5 text-green-600" />
                      <span className="text-gray-900 font-medium flex-grow text-sm">{doc.label}</span>
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-center text-white">
                  <p className="font-semibold">
                    You're all set! We'll be in touch within 24 hours.
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#FF6B35]/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-500/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens Next Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What happens next
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our team is already reviewing your application. Here's what to expect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="absolute -top-5 left-8">
                <div className="w-12 h-12 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  1
                </div>
              </div>
              <div className="pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Application Review</h3>
                <p className="text-gray-600 mb-4">
                  Our team reviews your documents and assesses your funding options. This usually takes less than 24 hours.
                </p>
                <div className="flex items-center gap-2 text-[#FF6B35] font-medium text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  In Progress
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="absolute -top-5 left-8">
                <div className="w-12 h-12 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  2
                </div>
              </div>
              <div className="pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Funding Specialist Calls</h3>
                <p className="text-gray-600 mb-4">
                  A dedicated specialist will call you to discuss your funding options and answer any questions.
                </p>
                <div className="text-gray-400 font-medium text-sm">
                  Coming Soon
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="absolute -top-5 left-8">
                <div className="w-12 h-12 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  3
                </div>
              </div>
              <div className="pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sign & Get Funded</h3>
                <p className="text-gray-600 mb-4">
                  Sign your contract and receive funds as soon as the next business day!
                </p>
                <div className="text-gray-400 font-medium text-sm">
                  Final Step
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section - Like Home Page */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                See how Toast Capital helps businesses like yours grow
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Hear from real business owners who used Toast Capital to expand, renovate, and thrive. Your success story could be next!
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Real stories</span> from restaurant owners just like you
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Fast funding</span> that doesn't slow you down
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Flexible payments</span> that work with your cash flow
                  </p>
                </li>
              </ul>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-video border-4 border-[#FF6B35]">
                <iframe
                  src="https://www.youtube.com/embed/AK4m7m-r7mY?rel=0"
                  title="Toast Capital Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#1E3A8A] pb-24 md:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Have questions? We're here to help
          </h2>
          <p className="text-lg text-blue-200 mb-8">
            Our funding specialists are standing by to answer any questions about your application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:6175333190"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-[#1E3A8A] font-semibold py-4 px-10 rounded-lg transition text-lg"
            >
              <Phone className="w-5 h-5" />
              Call (617) 533-3190
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-4 px-10 rounded-lg transition text-lg"
            >
              Back to Home
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function ThankYouDLVCPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ThankYouDLVCContent />
    </Suspense>
  );
}
