'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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

      {/* Main Content */}
      <div className="flex-grow bg-gray-50 px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link href="/" className="inline-flex items-center gap-2 text-[#FF8C42] hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-500 mb-8">Last Updated: January 2025</p>

            {/* SMS/Text Message Disclosure - Important for Twilio */}
            <section className="mb-10 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">SMS/Text Message Terms & Opt-In Disclosure</h2>

              <div className="space-y-4 text-gray-700">
                <p>
                  By providing your phone number and submitting an application through Toast Capital, you expressly consent to receive SMS/text messages from Toast Capital regarding your application status, funding updates, and related communications.
                </p>

                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-2">What Messages You Will Receive:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Application confirmation and status updates</li>
                    <li>Reminders to complete required steps (document uploads, identity verification)</li>
                    <li>Funding decision notifications</li>
                    <li>Important account and service updates</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-2">Message Frequency:</h3>
                  <p className="text-sm">
                    Message frequency varies based on your application status. Typically, you will receive 3-5 messages during the application process.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-2">Opt-Out Instructions:</h3>
                  <p className="text-sm">
                    You can opt out of SMS messages at any time by replying <strong>STOP</strong> to any message you receive from us. You may also contact us at <a href="tel:617-533-3190" className="text-[#FF8C42] font-semibold">617-533-3190</a> or <a href="mailto:info@toastcapital.com" className="text-[#FF8C42] font-semibold">info@toastcapital.com</a> to opt out.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-2">Costs:</h3>
                  <p className="text-sm">
                    Message and data rates may apply. Check with your mobile carrier for details about your text messaging plan.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-2">Help:</h3>
                  <p className="text-sm">
                    For help, reply <strong>HELP</strong> to any message or contact us at <a href="tel:617-533-3190" className="text-[#FF8C42] font-semibold">617-533-3190</a>.
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
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p><strong>Toast Capital</strong></p>
                  <p>333 Summer Street</p>
                  <p>Boston, MA 02210</p>
                  <p className="mt-2">
                    <strong>Phone:</strong> <a href="tel:617-533-3190" className="text-[#FF8C42]">617-533-3190</a>
                  </p>
                  <p>
                    <strong>Email:</strong> <a href="mailto:info@toastcapital.com" className="text-[#FF8C42]">info@toastcapital.com</a>
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
                <Link href="/privacy" className="text-[#FF8C42] font-semibold">Privacy Policy</Link>
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
