'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Check, CreditCard, FileText, Upload, Building2, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import Footer from '@/components/Footer';
import { compressImage, needsCompression } from '@/lib/image-compression';

interface UploadedFile {
  file: File;
  fileData: string; // base64 encoded file data
  fileType: string; // MIME type
  status: 'uploading' | 'uploaded' | 'error';
  name: string;
  blobData?: Blob; // Store blob for mobile submission reliability
}

interface UploadState {
  bankStatement1: UploadedFile | null;
  bankStatement2: UploadedFile | null;
  bankStatement3: UploadedFile | null;
  driversLicense: UploadedFile | null;
  voidCheck: UploadedFile | null;
}

const FILE_LABELS: Record<keyof UploadState, { label: string; description: string; icon: any }> = {
  bankStatement1: {
    label: 'Bank Statement - Month 1',
    description: 'Most recent month',
    icon: FileText
  },
  bankStatement2: {
    label: 'Bank Statement - Month 2',
    description: 'Previous month',
    icon: FileText
  },
  bankStatement3: {
    label: 'Bank Statement - Month 3',
    description: 'Third month back',
    icon: FileText
  },
  driversLicense: {
    label: "Driver's License",
    description: 'Front of your license (clear photo)',
    icon: CreditCard
  },
  voidCheck: {
    label: 'Void Check',
    description: 'From business bank account',
    icon: Building2
  },
};

export default function DLVCPage() {
  const router = useRouter();
  const [applicationData, setApplicationData] = useState<any>(null);
  const [uploads, setUploads] = useState<UploadState>({
    bankStatement1: null,
    bankStatement2: null,
    bankStatement3: null,
    driversLicense: null,
    voidCheck: null,
  });
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplicationData, setHasApplicationData] = useState(false);

  useEffect(() => {
    // Try to get data from applicationData first (set by upload page after JotForm)
    // Fall back to demoFormData (set by quote page) if applicationData doesn't exist
    let storedData = sessionStorage.getItem('applicationData');

    if (!storedData) {
      // Fallback: check for demoFormData from quote page
      storedData = sessionStorage.getItem('demoFormData');
      if (storedData) {
        // Also save it as applicationData for consistency
        sessionStorage.setItem('applicationData', storedData);
        console.log('📋 Loaded data from demoFormData fallback');
      }
    }

    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        // Normalize field names (support both old and new formats)
        const normalizedData = {
          ...data,
          firstName: data.firstName || data.ownerFirstName || '',
          lastName: data.lastName || data.ownerLastName || '',
          businessName: data.businessName || data.legalBusinessName || '',
        };
        setApplicationData(normalizedData);
        if (normalizedData.email) setContactEmail(normalizedData.email);
        if (normalizedData.phone) setContactPhone(normalizedData.phone);
        setHasApplicationData(true);
        console.log('✅ Application data loaded:', {
          firstName: normalizedData.firstName,
          lastName: normalizedData.lastName,
          businessName: normalizedData.businessName,
        });
      } catch (e) {
        console.error('❌ Failed to parse stored data:', e);
      }
    } else {
      console.log('⚠️ No application data found in sessionStorage');
    }
  }, []);

  const uploadedCount = Object.values(uploads).filter(
    (u) => u?.status === 'uploaded'
  ).length;
  const totalRequired = 5;
  const allUploaded = uploadedCount === totalRequired;

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof UploadState
  ) => {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    const maxSize = 20 * 1024 * 1024; // 20MB
    if (originalFile.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        [field]: `File is too large (${(originalFile.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 20MB.`,
      }));
      e.target.value = '';
      return;
    }

    if (originalFile.size === 0) {
      setErrors((prev) => ({
        ...prev,
        [field]: 'The file appears to be empty. Please try a different file.',
      }));
      e.target.value = '';
      return;
    }

    // Show uploading state (and compressing if needed)
    const isCompressing = needsCompression(originalFile);
    setUploads((prev) => ({
      ...prev,
      [field]: { file: originalFile, fileData: '', fileType: '', status: 'uploading', name: isCompressing ? `Compressing ${originalFile.name}...` : originalFile.name },
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }

    // Work with the file (possibly compressed)
    let fileToUpload: File = originalFile;

    try {
      // Compress large images before upload
      if (isCompressing) {
        console.log(`🗜️ Compressing large image: ${originalFile.name}`);
        fileToUpload = await compressImage(originalFile);
        // Update the name to show actual filename after compression
        setUploads((prev) => ({
          ...prev,
          [field]: { file: fileToUpload, fileData: '', fileType: '', status: 'uploading', name: fileToUpload.name },
        }));
      }

      // Store blob data for reliable mobile submission
      const blobData = new Blob([await fileToUpload.arrayBuffer()], { type: fileToUpload.type });

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('fileType', field);
      formData.append('firstName', applicationData?.firstName || '');
      formData.append('lastName', applicationData?.lastName || '');
      formData.append('email', contactEmail || applicationData?.email || '');
      formData.append('phone', contactPhone || applicationData?.phone || '');
      formData.append('businessName', applicationData?.businessName || '');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch('/api/upload-single-file', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        // Store both base64 and blob data for reliability on mobile
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result as string;
          setUploads((prev) => ({
            ...prev,
            [field]: {
              file: fileToUpload,
              fileData: base64Data,
              fileType: fileToUpload.type,
              status: 'uploaded',
              name: fileToUpload.name,
              blobData: blobData,
            },
          }));
        };
        reader.onerror = () => {
          // Even if base64 fails, we have blob data
          setUploads((prev) => ({
            ...prev,
            [field]: {
              file: fileToUpload,
              fileData: '',
              fileType: fileToUpload.type,
              status: 'uploaded',
              name: fileToUpload.name,
              blobData: blobData,
            },
          }));
        };
        reader.readAsDataURL(fileToUpload);
      } else {
        let errorMessage = 'Upload failed. Please try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          if (response.status === 413) {
            errorMessage = 'File is too large. Please use a smaller file.';
          } else if (response.status === 408) {
            errorMessage = 'Upload timed out. Please check your connection.';
          }
        }
        setUploads((prev) => ({
          ...prev,
          [field]: { file: fileToUpload, fileData: '', fileType: fileToUpload.type, status: 'error', name: fileToUpload.name },
        }));
        setErrors((prev) => ({
          ...prev,
          [field]: errorMessage,
        }));
      }
    } catch (error: any) {
      console.error('Upload error:', error);

      let errorMessage = 'Upload failed. Please try again.';

      if (error?.name === 'AbortError') {
        errorMessage = 'Upload timed out. Please check your connection and try again.';
      } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error?.message?.includes('Failed to fetch')) {
        errorMessage = 'Connection lost. Please check your internet and try again.';
      }

      setUploads((prev) => ({
        ...prev,
        [field]: { file: originalFile, fileData: '', fileType: originalFile.type, status: 'error', name: originalFile.name },
      }));
      setErrors((prev) => ({
        ...prev,
        [field]: errorMessage,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!uploads.bankStatement1?.status || uploads.bankStatement1.status !== 'uploaded') {
      newErrors.bankStatement1 = 'Bank Statement Month 1 is required';
    }
    if (!uploads.bankStatement2?.status || uploads.bankStatement2.status !== 'uploaded') {
      newErrors.bankStatement2 = 'Bank Statement Month 2 is required';
    }
    if (!uploads.bankStatement3?.status || uploads.bankStatement3.status !== 'uploaded') {
      newErrors.bankStatement3 = 'Bank Statement Month 3 is required';
    }
    if (!uploads.driversLicense?.status || uploads.driversLicense.status !== 'uploaded') {
      newErrors.driversLicense = "Driver's License is required";
    }
    if (!uploads.voidCheck?.status || uploads.voidCheck.status !== 'uploaded') {
      newErrors.voidCheck = 'Void Check is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      console.log('📁 Starting DLVC final submission (files already uploaded individually)...');

      // Files are already uploaded individually via /api/upload-single-file
      // This submission just sends metadata and confirms completion
      const formData = new FormData();

      // Add application data only (no files - they're already sent)
      formData.append('firstName', applicationData?.firstName || '');
      formData.append('lastName', applicationData?.lastName || '');
      formData.append('email', contactEmail || applicationData?.email || '');
      formData.append('phone', contactPhone || applicationData?.phone || '');
      formData.append('businessName', applicationData?.businessName || '');
      formData.append('businessType', applicationData?.businessType || '');
      formData.append('fundingAmount', applicationData?.fundingAmount || '');
      formData.append('monthlyRevenue', applicationData?.monthlyRevenue || '');
      formData.append('source', 'dlvc');

      // Include pre-DLVC drip IDs for cancellation (if they exist)
      try {
        const storedDripIds = localStorage.getItem('preDlvcDripIds');
        if (storedDripIds) {
          formData.append('preDlvcDripIds', storedDripIds);
          console.log('📧 Including pre-DLVC drip IDs for cancellation:', storedDripIds);
        }
      } catch (e) {
        console.log('⚠️ Could not read drip IDs from localStorage');
      }

      console.log('📤 Sending final confirmation (no files - already sent)...');

      // Submit - this is now just metadata, so it's very fast
      const response = await fetch('/api/submit-dlvc', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('✅ DLVC submission successful');
        sessionStorage.removeItem('applicationData');

        // Clear the pre-DLVC drip IDs from localStorage
        try {
          localStorage.removeItem('preDlvcDripIds');
          console.log('🗑️ Cleared pre-DLVC drip IDs from localStorage');
        } catch (e) {
          // Ignore localStorage errors
        }

        const firstName = applicationData?.firstName || 'Valued';
        const lastName = applicationData?.lastName || 'Customer';
        const businessName = applicationData?.businessName || 'Your Business';

        // Use window.location for more reliable redirect on mobile
        setIsSubmitting(false);
        window.location.href = `/thank-you-dlvc?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&businessName=${encodeURIComponent(businessName)}`;
      } else {
        let errorMessage = 'There was an error submitting your documents. Please try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('❌ Server error:', errorData);
        } catch (parseErr) {
          console.error('❌ Response status:', response.status, response.statusText);
        }
        setIsSubmitting(false);
        alert(`Error: ${errorMessage}`);
      }
    } catch (error: any) {
      console.error('❌ Submit error:', error);
      setIsSubmitting(false);
      alert('There was an error submitting. Please check your internet connection and try again.');
    }
  };

  const renderUploadItem = (field: keyof UploadState) => {
    const { label, description, icon: Icon } = FILE_LABELS[field];
    const upload = uploads[field];
    const error = errors[field];
    const isUploading = upload?.status === 'uploading';
    const isUploaded = upload?.status === 'uploaded';
    const hasError = upload?.status === 'error' || !!error;

    return (
      <div key={field} className="relative">
        <input
          type="file"
          id={field}
          accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,image/*"
          onChange={(e) => handleFileChange(e, field)}
          className="hidden"
          disabled={isUploading}
        />
        <label
          htmlFor={field}
          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
            isUploading
              ? 'border-gray-300 bg-gray-50 cursor-wait'
              : isUploaded
              ? 'border-green-500 bg-green-50 hover:bg-green-100'
              : hasError
              ? 'border-red-500 bg-red-50 hover:border-red-600'
              : 'border-gray-200 bg-white hover:border-[#FF6B35] hover:bg-orange-50'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              isUploading
                ? 'bg-gray-200 text-gray-500'
                : isUploaded
                ? 'bg-green-500 text-white'
                : hasError
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isUploaded ? (
              <CheckCircle className="w-6 h-6" />
            ) : hasError ? (
              <AlertCircle className="w-6 h-6" />
            ) : (
              <Icon className="w-6 h-6" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-semibold ${isUploaded ? 'text-green-700' : hasError ? 'text-red-700' : 'text-gray-900'}`}>
              {label}
            </p>
            {isUploading ? (
              <p className="text-sm text-gray-500">Uploading...</p>
            ) : isUploaded ? (
              <p className="text-sm text-green-600 truncate">{upload.name}</p>
            ) : hasError ? (
              <p className="text-sm text-red-600">{error || 'Upload failed. Click to retry.'}</p>
            ) : (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
          <div className="flex-shrink-0">
            {isUploading ? (
              <span className="text-sm text-gray-500">Uploading...</span>
            ) : isUploaded ? (
              <span className="text-sm text-green-600 font-medium">Uploaded</span>
            ) : hasError ? (
              <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                <Upload className="w-4 h-4" />
                Retry
              </span>
            ) : (
              <span className="text-sm text-[#FF6B35] font-medium flex items-center gap-1">
                <Upload className="w-4 h-4" />
                Upload
              </span>
            )}
          </div>
        </label>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-[#FFB800] text-black py-2 px-4 text-center">
        <span className="text-sm md:text-base font-semibold">
          Already using Toast? Then you're pre-qualified for funding in minutes!
        </span>
      </div>
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/toast-capital-logo.png"
              alt="Toast Capital Logo"
              width={400}
              height={120}
              className="object-contain w-[100px] h-auto md:w-[180px]"
            />
          </Link>
          <div className="flex items-center gap-4">
            <a href="tel:617-533-3190" className="flex items-center gap-2 md:gap-3">
              <Phone className="w-6 h-6 md:w-10 md:h-10 text-[#FF6B35]" strokeWidth={1.5} />
              <div className="flex flex-col items-start">
                <span className="text-xs md:text-sm text-gray-800 font-semibold">Questions? Call Us!</span>
                <span className="hidden md:flex text-xs text-gray-600 items-center gap-1">
                  Live Agents Standing By{' '}
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                </span>
                <span className="text-xs md:hidden text-gray-600 flex items-center gap-1">
                  Live Agents <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                </span>
                <span className="font-bold text-sm md:text-xl text-gray-900">617-533-3190</span>
              </div>
            </a>
          </div>
        </div>
      </header>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FF6B35] shadow-lg">
        <a
          href="tel:617-533-3190"
          className="flex items-center justify-center gap-3 py-3 px-6">
          <Phone className="w-5 h-5 text-white" />
          <span className="text-white font-bold">Call: 617-533-3190</span>
        </a>
      </div>
      <div className="border-b py-6">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">Quote</span>
            </div>
            <div className="w-12 h-0.5 bg-[#FF6B35]"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">Verification</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
                3
              </div>
              <span className="text-sm text-gray-500">Documents</span>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-grow bg-gray-50 px-4 py-12 pb-24 md:pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Upload Your Documents
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Almost there{applicationData?.firstName ? `, ${applicationData.firstName}` : ''}! Upload the required documents to complete your application.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Upload Progress</span>
              <span className="text-sm font-medium text-gray-600">
                {uploadedCount} of {totalRequired} uploaded
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#FF6B35] h-3 rounded-full transition-all duration-500"
                style={{ width: `${(uploadedCount / totalRequired) * 100}%` }}
              ></div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl border-4 border-[#FF6B35] shadow-lg p-6 md:p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Bank Statements
                  </h2>
                  <p className="text-gray-600">Last 3 months of business bank statements</p>
                </div>
              </div>
              <div className="space-y-3">
                {renderUploadItem('bankStatement1')}
                {renderUploadItem('bankStatement2')}
                {renderUploadItem('bankStatement3')}
              </div>
            </div>
            <div className="bg-white rounded-2xl border-4 border-[#FF6B35] shadow-lg p-6 md:p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Identity & Banking Verification
                  </h2>
                  <p className="text-gray-600">Verify your identity and bank account</p>
                </div>
              </div>
              <div className="space-y-3">
                {renderUploadItem('driversLicense')}
                {renderUploadItem('voidCheck')}
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={!allUploaded || isSubmitting}
                  className={`w-full font-semibold py-4 px-8 rounded-lg text-lg transition flex items-center justify-center gap-2 ${
                    allUploaded && !isSubmitting
                      ? 'bg-[#1E3A8A] hover:bg-[#1E40AF] text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : allUploaded ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Complete Application
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload All Documents to Continue ({uploadedCount}/{totalRequired})
                    </>
                  )}
                </button>
                {!allUploaded && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Please upload all {totalRequired} documents to submit your application
                  </p>
                )}
              </div>
            </div>
          </form>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
            <p className="text-xl font-semibold text-gray-900 mb-4">
              Need Help or Have Questions?
            </p>
            <a
              href="tel:6175333190"
              className="inline-block bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              <Phone className="inline-block w-5 h-5 mr-2" />
              Call (617) 533-3190
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
