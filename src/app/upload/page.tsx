'use client';
// BUILD_VERSION: 2026-01-30-v12-IFRAME-FOR-ALL

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Upload, Check, Mail, Loader2, ExternalLink, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import ProgressTracker from '@/components/ProgressTracker';

// Application steps for progress tracker
const applicationSteps = [
  { id: 1, label: 'Get Quote', description: 'Business info' },
  { id: 2, label: 'Verify & Upload', description: 'Documents' },
  { id: 3, label: 'Get Funded', description: 'Approval' },
];

// Phone number formatting function
function formatPhoneNumber(value: string): string {
  // Remove all non-digits
  const phoneNumber = value.replace(/\D/g, '');

  // Format based on length
  if (phoneNumber.length === 0) return '';
  if (phoneNumber.length <= 3) return `(${phoneNumber}`;
  if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

export default function UploadPage() {
  const router = useRouter();
  const [applicationData, setApplicationData] = useState<any>(null);
  const [files, setFiles] = useState<{
    statement1: File | null;
    statement2: File | null;
    statement3: File | null;
  }>({
    statement1: null,
    statement2: null,
    statement3: null,
  });
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactFirstName, setContactFirstName] = useState('');
  const [contactLastName, setContactLastName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNameFields, setShowNameFields] = useState(false);

  // DocuSign iframe state
  const [docusignLoading, setDocusignLoading] = useState(true);
  const [docusignError, setDocusignError] = useState(false);
  const [docusignKey, setDocusignKey] = useState(0); // Used to force iframe reload

  useEffect(() => {
    // First, check for demo form data (from the Get Started modal)
    const demoData = sessionStorage.getItem('demoFormData');
    if (demoData) {
      const data = JSON.parse(demoData);
      console.log('✅ Demo form data loaded:', data);

      // Create application data from demo form
      const appData = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        businessName: data.businessName || '',
        businessType: data.businessType || '',
        monthlyRevenue: data.monthlyRevenue || '',
      };

      setApplicationData(appData);
      if (data.email) setContactEmail(data.email);
      if (data.phone) setContactPhone(data.phone);
      if (data.firstName) setContactFirstName(data.firstName);
      if (data.lastName) setContactLastName(data.lastName);

      // Clear demo data after loading
      sessionStorage.removeItem('demoFormData');
      return;
    }

    // Fall back to application data from other sources
    const storedData = sessionStorage.getItem('applicationData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setApplicationData(data);
      // Pre-fill fields if available from session
      if (data.email) setContactEmail(data.email);
      if (data.phone) setContactPhone(data.phone);
      if (data.firstName) setContactFirstName(data.firstName);
      if (data.lastName) setContactLastName(data.lastName);
      console.log('✅ Application data loaded from session storage');
    } else {
      console.log('⚠️ No application data in session storage - user accessed /upload directly');
      // Show name fields for users coming from email link
      setShowNameFields(true);
    }
  }, [router]);

  // DocuSign iframe timeout handler
  useEffect(() => {
    if (docusignLoading) {
      const timeout = setTimeout(() => {
        // If still loading after 15 seconds, show error state
        if (docusignLoading) {
          console.log('⚠️ DocuSign iframe timeout - showing fallback');
          setDocusignError(true);
          setDocusignLoading(false);
        }
      }, 15000);
      return () => clearTimeout(timeout);
    }
  }, [docusignLoading, docusignKey]);

  // Handle DocuSign iframe load
  const handleDocusignLoad = useCallback(() => {
    console.log('✅ DocuSign iframe loaded successfully');
    setDocusignLoading(false);
    setDocusignError(false);
  }, []);

  // Retry loading DocuSign
  const retryDocusign = useCallback(() => {
    console.log('🔄 Retrying DocuSign iframe load...');
    setDocusignLoading(true);
    setDocusignError(false);
    setDocusignKey(prev => prev + 1);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'statement1' | 'statement2' | 'statement3') => {
    const file = e.target.files?.[0] || null;
    setFiles(prev => ({ ...prev, [field]: file }));
    // Clear error when file is selected
    if (file && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!files.statement1) newErrors.statement1 = 'Bank statement #1 is required';
    if (!files.statement2) newErrors.statement2 = 'Bank statement #2 is required';
    if (!files.statement3) newErrors.statement3 = 'Bank statement #3 is required';

    // Validate email
    if (!contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    // Validate phone
    if (!contactPhone.trim()) {
      newErrors.contactPhone = 'Phone number is required';
    } else if (contactPhone.replace(/\D/g, '').length < 10) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Add application data if available
      if (applicationData) {
        Object.keys(applicationData).forEach(key => {
          formData.append(key, applicationData[key]);
        });
      }

      // Always add contact info (override if they exist in applicationData)
      formData.set('email', contactEmail);
      formData.set('phone', contactPhone);
      if (contactFirstName) formData.set('firstName', contactFirstName);
      if (contactLastName) formData.set('lastName', contactLastName);

      // Add files
      if (files.statement1) formData.append('bankStatements', files.statement1);
      if (files.statement2) formData.append('bankStatements', files.statement2);
      if (files.statement3) formData.append('bankStatements', files.statement3);

      // Debug: Log what files are being sent
      const uploadedFiles = formData.getAll('bankStatements') as File[];
      console.log('📁 Sending files to server:', uploadedFiles.length);
      uploadedFiles.forEach((file, index) => {
        console.log(`  File ${index + 1}: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
      });

      const response = await fetch('/api/submit-with-files', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Clear session storage
        sessionStorage.removeItem('applicationData');

        // Redirect to thank you page with available data
        const firstName = applicationData?.firstName || 'Valued';
        const lastName = applicationData?.lastName || 'Customer';
        const businessName = applicationData?.businessName || 'Your Business';

        router.push(`/thank-you-upload?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&businessName=${encodeURIComponent(businessName)}`);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'There was an error submitting your documents. Please try again.'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('There was an error submitting your documents. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // DocuSign URL
  const DOCUSIGN_URL = "https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=89764605-cb04-4695-9167-86dd1456c77a&env=na4&acct=c238cbb6-3f73-4721-9f47-2f0536de2c7a&v=2";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Yellow Banner */}
      <div className="bg-[#FFB800] text-black py-2 px-4 text-center">
        <a href="tel:617-533-3190" className="flex items-center justify-center gap-2 font-semibold">
          <Phone className="w-4 h-4" />
          <span>Questions? Call Us: (617) 533-3190</span>
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-green-600"></span>
          </span>
          <span className="text-sm">Live Agents</span>
        </a>
      </div>

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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FF8C42] shadow-lg">
        <a href="tel:617-533-3190" className="flex items-center justify-center gap-3 py-3 px-6">
          <Phone className="w-5 h-5 text-white" />
          <span className="text-white font-bold">Call: 617-533-3190</span>
        </a>
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto">
          {/* Progress Tracker */}
          <div className="mb-8">
            <ProgressTracker steps={applicationSteps} currentStep={2} />
          </div>

          {/* Page Title with Personalized Welcome */}
          <div className="text-center mb-8">
            {applicationData?.firstName ? (
              <>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Check className="w-4 h-4" />
                  Welcome back, {applicationData.firstName}!
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Complete Your Application
                </h1>
                <p className="text-lg md:text-xl text-gray-600">
                  Just three simple steps to get funding for <span className="font-semibold text-gray-800">{applicationData.businessName || 'your business'}</span>!
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Complete Your Application
                </h1>
                <p className="text-lg md:text-xl text-gray-600">
                  Just three simple steps to get funded!
                </p>
              </>
            )}
          </div>

          {/* DocuSign Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF8C42] to-[#FF7028] rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Step 1: Owner & Business Verification</h2>
                <p className="text-gray-600 flex items-center gap-1.5">
                  Zero impact to your credit score (Minimum 500 credit score to qualify)
                </p>
              </div>
            </div>

            {/* DocuSign Embedded iframe with Loading State */}
            <div className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 relative">
              {/* Loading Overlay */}
              {docusignLoading && !docusignError && (
                <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-10 min-h-[400px]">
                  <Loader2 className="w-12 h-12 text-[#FF8C42] animate-spin mb-4" />
                  <p className="text-lg font-semibold text-gray-900 mb-2">Loading Owner & Business Verification...</p>
                  <p className="text-sm text-gray-600 text-center max-w-md px-4">
                    Please wait while we load the secure form. No impact to your credit score.
                  </p>
                  <p className="text-xs text-gray-400 mt-4">If this takes too long, check your internet connection</p>
                </div>
              )}

              {/* Error State with Fallback */}
              {docusignError && (
                <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                  <AlertCircle className="w-16 h-16 text-orange-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Having trouble loading?</h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    The DocuSign form is taking longer than expected to load. You can try again or open it directly in a new tab.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={retryDocusign}
                      className="flex items-center justify-center gap-2 bg-[#FF8C42] hover:bg-[#FF7028] text-white font-semibold py-3 px-6 rounded-full transition-all"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Try Again
                    </button>
                    <a
                      href={DOCUSIGN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-full transition-all"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Open in New Tab
                    </a>
                  </div>
                  <p className="text-xs text-gray-400 mt-6">
                    After completing verification in the new tab, return here to upload your documents.
                  </p>
                </div>
              )}

              {/* DocuSign iframe */}
              {!docusignError && (
                <iframe
                  key={docusignKey}
                  src={DOCUSIGN_URL}
                  width="100%"
                  height="800"
                  frameBorder="0"
                  className={`w-full transition-opacity duration-300 ${docusignLoading ? 'opacity-0' : 'opacity-100'}`}
                  title="DocuSign Identity Verification"
                  onLoad={handleDocusignLoad}
                  allow="geolocation; microphone; camera"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </div>

            {/* Alternative: Direct Link */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500 mb-2">
                Form not displaying correctly?
              </p>
              <a
                href={DOCUSIGN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#FF8C42] hover:text-[#FF7028] font-medium text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Click here to open verification in a new window
              </a>
            </div>
          </div>

          {/* Bank Statements Upload Section */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF8C42] to-[#FF7028] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Step 2: Upload Bank Statements</h2>
                    <p className="text-gray-600">Upload your last 3 months of business bank statements</p>
                  </div>
                </div>
                {/* File Upload Progress Indicator */}
                <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    {[files.statement1, files.statement2, files.statement3].filter(Boolean).length} / 3 Files
                  </span>
                </div>
              </div>

              {/* Mobile Progress Indicator */}
              <div className="md:hidden mb-4 bg-gray-100 px-4 py-2 rounded-full text-center">
                <span className="text-sm font-semibold text-gray-700">
                  {[files.statement1, files.statement2, files.statement3].filter(Boolean).length} of 3 Files Uploaded
                </span>
              </div>

              <div className="space-y-6">
                {/* Bank Statement #1 */}
                <div>
                  <label htmlFor="statement1" className="block text-lg font-semibold text-gray-900 mb-3">
                    Bank Statement #1 *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="statement1"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'statement1')}
                      className="hidden"
                    />
                    <label
                      htmlFor="statement1"
                      className={`flex items-center justify-center gap-3 w-full px-6 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all hover:border-green-500 hover:bg-green-50 ${
                        errors.statement1 ? 'border-red-500 bg-red-50' : files.statement1 ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      {files.statement1 ? (
                        <>
                          <Check className="w-6 h-6 text-green-600" />
                          <span className="text-green-700 font-medium">{files.statement1.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-500" />
                          <span className="text-gray-600">Click to upload or drag and drop</span>
                        </>
                      )}
                    </label>
                  </div>
                  {errors.statement1 && (
                    <p className="text-red-500 text-sm mt-2">{errors.statement1}</p>
                  )}
                </div>

                {/* Bank Statement #2 */}
                <div>
                  <label htmlFor="statement2" className="block text-lg font-semibold text-gray-900 mb-3">
                    Bank Statement #2 *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="statement2"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'statement2')}
                      className="hidden"
                    />
                    <label
                      htmlFor="statement2"
                      className={`flex items-center justify-center gap-3 w-full px-6 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all hover:border-green-500 hover:bg-green-50 ${
                        errors.statement2 ? 'border-red-500 bg-red-50' : files.statement2 ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      {files.statement2 ? (
                        <>
                          <Check className="w-6 h-6 text-green-600" />
                          <span className="text-green-700 font-medium">{files.statement2.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-500" />
                          <span className="text-gray-600">Click to upload or drag and drop</span>
                        </>
                      )}
                    </label>
                  </div>
                  {errors.statement2 && (
                    <p className="text-red-500 text-sm mt-2">{errors.statement2}</p>
                  )}
                </div>

                {/* Bank Statement #3 */}
                <div>
                  <label htmlFor="statement3" className="block text-lg font-semibold text-gray-900 mb-3">
                    Bank Statement #3 *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="statement3"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'statement3')}
                      className="hidden"
                    />
                    <label
                      htmlFor="statement3"
                      className={`flex items-center justify-center gap-3 w-full px-6 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all hover:border-green-500 hover:bg-green-50 ${
                        errors.statement3 ? 'border-red-500 bg-red-50' : files.statement3 ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      {files.statement3 ? (
                        <>
                          <Check className="w-6 h-6 text-green-600" />
                          <span className="text-green-700 font-medium">{files.statement3.name}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-500" />
                          <span className="text-gray-600">Click to upload or drag and drop</span>
                        </>
                      )}
                    </label>
                  </div>
                  {errors.statement3 && (
                    <p className="text-red-500 text-sm mt-2">{errors.statement3}</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#FF8C42]" />
                  Your Contact Information
                </h3>
                <p className="text-sm text-gray-600 mb-4">We'll send your funding updates and documents to this email.</p>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* First Name Field - shown for users coming from email links */}
                  {showNameFields && (
                    <div>
                      <label htmlFor="contactFirstName" className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="contactFirstName"
                        value={contactFirstName}
                        onChange={(e) => setContactFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8C42] transition-all border-gray-300 bg-white"
                      />
                    </div>
                  )}

                  {/* Last Name Field - shown for users coming from email links */}
                  {showNameFields && (
                    <div>
                      <label htmlFor="contactLastName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="contactLastName"
                        value={contactLastName}
                        onChange={(e) => setContactLastName(e.target.value)}
                        placeholder="Smith"
                        className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8C42] transition-all border-gray-300 bg-white"
                      />
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      value={contactEmail}
                      onChange={(e) => {
                        setContactEmail(e.target.value);
                        if (errors.contactEmail) setErrors(prev => ({ ...prev, contactEmail: '' }));
                      }}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8C42] transition-all ${
                        errors.contactEmail ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                    />
                    {errors.contactEmail && (
                      <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="contactPhone"
                      value={contactPhone}
                      onChange={(e) => {
                        setContactPhone(formatPhoneNumber(e.target.value));
                        if (errors.contactPhone) setErrors(prev => ({ ...prev, contactPhone: '' }));
                      }}
                      placeholder="(555) 123-4567"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8C42] transition-all ${
                        errors.contactPhone ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                    />
                    {errors.contactPhone && (
                      <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                {/* Warning if not all files uploaded */}
                {[files.statement1, files.statement2, files.statement3].filter(Boolean).length < 3 && (
                  <div className="mb-4 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 text-center">
                    <p className="text-sm font-semibold text-yellow-900">
                      Please upload all 3 bank statements before submitting
                    </p>
                    <p className="text-xs text-yellow-800 mt-1">
                      You have uploaded {[files.statement1, files.statement2, files.statement3].filter(Boolean).length} of 3 required files
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  {isSubmitting && (
                    <span className="absolute inset-0 flex items-center justify-center bg-green-500">
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  )}
                  <span className={isSubmitting ? 'invisible' : ''}>
                    {[files.statement1, files.statement2, files.statement3].filter(Boolean).length === 3
                      ? '✓ Submit Documents & Complete Application'
                      : 'Submit Documents & Complete Application'}
                  </span>
                </button>
              </div>
            </div>
          </form>

          {/* Step 3: Get Funded */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF8C42] to-[#FF7028] rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Step 3: Get Funded</h2>
                <p className="text-gray-600">We'll take it from here!</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                A dedicated funding specialist will reach out to discuss your personalized funding options, answer any questions, and guide you through the best solutions for your business needs.
              </p>

              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Expert Guidance</p>
                    <p className="text-sm text-gray-600">Personalized funding advice</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Fast Response</p>
                    <p className="text-sm text-gray-600">We'll contact you within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Quick Funding</p>
                    <p className="text-sm text-gray-600">Same-day approval available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-6 text-center">
            <p className="text-xl font-semibold text-gray-900 mb-4">
              Need Help or Have Questions?
            </p>
            <a
              href="tel:6175333190"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full transition-all transform hover:scale-105"
            >
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

      <style jsx global>{`
        .phone-hover:hover .phone-ring {
          animation: ring 1s ease-in-out;
        }

        @keyframes ring {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70% { transform: rotate(-10deg); }
          20%, 40%, 60%, 80% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
