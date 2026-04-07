'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, FileText, Upload, CheckCircle, Loader2, AlertCircle, Building2, Receipt, FileCheck, X } from 'lucide-react';
import Footer from '@/components/Footer';
import { compressImage, needsCompression } from '@/lib/image-compression';

interface UploadedFile {
  file: File;
  fileData: string;
  fileType: string;
  status: 'uploading' | 'uploaded' | 'error';
  name: string;
}

interface DocumentType {
  id: string;
  label: string;
  description: string;
  icon: any;
  required: boolean;
}

const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 'taxReturn',
    label: 'Tax Return',
    description: 'Most recent business tax return',
    icon: Receipt,
    required: false,
  },
  {
    id: 'processingStatements',
    label: 'Processing Statements',
    description: 'Credit card processing statements (3 months)',
    icon: FileText,
    required: false,
  },
  {
    id: 'einSS4',
    label: 'EIN / SS-4 Letter',
    description: 'IRS EIN confirmation letter',
    icon: Building2,
    required: false,
  },
  {
    id: 'articleOfIncorporation',
    label: 'Articles of Incorporation',
    description: 'Business formation documents',
    icon: FileCheck,
    required: false,
  },
  {
    id: 'businessLicense',
    label: 'Business License',
    description: 'Current business license or permit',
    icon: FileCheck,
    required: false,
  },
  {
    id: 'leaseAgreement',
    label: 'Lease Agreement',
    description: 'Commercial lease or rental agreement',
    icon: FileText,
    required: false,
  },
  {
    id: 'other1',
    label: 'Other Document 1',
    description: 'Any other requested document',
    icon: FileText,
    required: false,
  },
  {
    id: 'other2',
    label: 'Other Document 2',
    description: 'Any other requested document',
    icon: FileText,
    required: false,
  },
];

export default function MiscPage() {
  const [uploads, setUploads] = useState<Record<string, UploadedFile | null>>({});
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const uploadedCount = Object.values(uploads).filter(u => u?.status === 'uploaded').length;

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: string
  ) => {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    const maxSize = 20 * 1024 * 1024;
    if (originalFile.size > maxSize) {
      setErrors(prev => ({
        ...prev,
        [docType]: `File too large (${(originalFile.size / 1024 / 1024).toFixed(1)}MB). Max 20MB.`,
      }));
      e.target.value = '';
      return;
    }

    // Show uploading state (and compressing if needed)
    const isCompressing = needsCompression(originalFile);
    setUploads(prev => ({
      ...prev,
      [docType]: { file: originalFile, fileData: '', fileType: originalFile.type, status: 'uploading', name: isCompressing ? `Compressing ${originalFile.name}...` : originalFile.name },
    }));

    if (errors[docType]) {
      setErrors(prev => ({ ...prev, [docType]: '' }));
    }

    // Work with the file (possibly compressed)
    let fileToUpload: File = originalFile;

    try {
      // Compress large images before upload
      if (isCompressing) {
        console.log(`🗜️ Compressing large image: ${originalFile.name}`);
        fileToUpload = await compressImage(originalFile);
        setUploads(prev => ({
          ...prev,
          [docType]: { file: fileToUpload, fileData: '', fileType: fileToUpload.type, status: 'uploading', name: fileToUpload.name },
        }));
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('fileType', `misc_${docType}`);
      formData.append('email', contactEmail);
      formData.append('phone', contactPhone);
      formData.append('businessName', businessName);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch('/api/upload-single-file', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result as string;
          setUploads(prev => ({
            ...prev,
            [docType]: { file: fileToUpload, fileData: base64Data, fileType: fileToUpload.type, status: 'uploaded', name: fileToUpload.name },
          }));
        };
        reader.onerror = () => {
          setUploads(prev => ({
            ...prev,
            [docType]: { file: fileToUpload, fileData: '', fileType: fileToUpload.type, status: 'uploaded', name: fileToUpload.name },
          }));
        };
        reader.readAsDataURL(fileToUpload);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setUploads(prev => ({
          ...prev,
          [docType]: { file: originalFile, fileData: '', fileType: originalFile.type, status: 'error', name: originalFile.name },
        }));
        setErrors(prev => ({
          ...prev,
          [docType]: errorData.error || 'Upload failed',
        }));
      }
    } catch (error: any) {
      setUploads(prev => ({
        ...prev,
        [docType]: { file: originalFile, fileData: '', fileType: originalFile.type, status: 'error', name: originalFile.name },
      }));
      setErrors(prev => ({
        ...prev,
        [docType]: error?.name === 'AbortError' ? 'Upload timed out' : 'Upload failed',
      }));
    }
  };

  const removeFile = (docType: string) => {
    setUploads(prev => ({ ...prev, [docType]: null }));
    setErrors(prev => ({ ...prev, [docType]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required';
    }
    if (uploadedCount === 0) {
      newErrors.general = 'Please upload at least one document';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Build submission data
      const submissionData: any = {
        email: contactEmail,
        phone: contactPhone,
        businessName: businessName,
        notes: notes,
        documentType: 'misc',
        files: {},
      };

      Object.entries(uploads).forEach(([key, data]) => {
        if (data?.status === 'uploaded' && data.fileData) {
          submissionData.files[key] = {
            name: data.name,
            type: data.fileType,
            data: data.fileData,
          };
        }
      });

      const response = await fetch('/api/submit-misc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Submission failed. Please try again.');
      }
    } catch (error) {
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderUploadItem = (docType: DocumentType) => {
    const upload = uploads[docType.id];
    const error = errors[docType.id];
    const isUploading = upload?.status === 'uploading';
    const isUploaded = upload?.status === 'uploaded';
    const hasError = upload?.status === 'error' || !!error;
    const Icon = docType.icon;

    return (
      <div key={docType.id} className="relative">
        <input
          type="file"
          id={docType.id}
          accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,image/*"
          onChange={(e) => handleFileChange(e, docType.id)}
          className="hidden"
          disabled={isUploading}
        />
        <div className={`flex items-center gap-4 p-4 border-2 rounded-xl transition-all ${
          isUploading ? 'border-gray-300 bg-gray-50' :
          isUploaded ? 'border-green-500 bg-green-50' :
          hasError ? 'border-red-500 bg-red-50' :
          'border-gray-200 bg-white'
        }`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUploading ? 'bg-gray-200 text-gray-500' :
            isUploaded ? 'bg-green-500 text-white' :
            hasError ? 'bg-red-500 text-white' :
            'bg-gray-100 text-gray-600'
          }`}>
            {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> :
             isUploaded ? <CheckCircle className="w-6 h-6" /> :
             hasError ? <AlertCircle className="w-6 h-6" /> :
             <Icon className="w-6 h-6" />}
          </div>

          <div className="flex-1 min-w-0">
            <p className={`font-semibold ${isUploaded ? 'text-green-700' : hasError ? 'text-red-700' : 'text-gray-900'}`}>
              {docType.label}
            </p>
            {isUploading ? (
              <p className="text-sm text-gray-500">Uploading...</p>
            ) : isUploaded ? (
              <p className="text-sm text-green-600 truncate">{upload.name}</p>
            ) : hasError ? (
              <p className="text-sm text-red-600">{error || 'Upload failed'}</p>
            ) : (
              <p className="text-sm text-gray-500">{docType.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isUploaded && (
              <button
                type="button"
                onClick={() => removeFile(docType.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <label
              htmlFor={docType.id}
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isUploading ? 'bg-gray-100 text-gray-400 cursor-wait' :
                isUploaded ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                hasError ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                'bg-[#FF6B35] text-white hover:bg-[#e55a2b]'
              }`}
            >
              {isUploading ? 'Uploading...' : isUploaded ? 'Replace' : hasError ? 'Retry' : 'Upload'}
            </label>
          </div>
        </div>
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Documents Submitted!</h1>
          <p className="text-gray-600 mb-6">
            We've received your documents and will review them shortly.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#1E3A8A] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#1E40AF] transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-[#FFB800] text-black py-2 px-4 text-center">
        <span className="text-sm md:text-base font-semibold">
          Upload Additional Documents Requested by Your Funding Specialist
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
          <a href="tel:617-533-3190" className="flex items-center gap-2 md:gap-3">
            <Phone className="w-6 h-6 md:w-10 md:h-10 text-[#FF6B35]" strokeWidth={1.5} />
            <div className="flex flex-col items-start">
              <span className="text-xs md:text-sm text-gray-800 font-semibold">Questions? Call Us!</span>
              <span className="text-xs md:hidden text-gray-600 flex items-center gap-1">Live Agents <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span></span>
              <span className="font-bold text-sm md:text-xl text-gray-900">617-533-3190</span>
            </div>
          </a>
        </div>
      </header>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FF6B35] shadow-lg">
        <a href="tel:617-533-3190" className="flex items-center justify-center gap-3 py-3 px-6">
          <Phone className="w-5 h-5 text-white" />
          <span className="text-white font-bold">Call: 617-533-3190</span>
        </a>
      </div>

      <main className="flex-grow bg-gray-50 px-4 py-12 pb-24 md:pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Additional Documents
            </h1>
            <p className="text-lg text-gray-600">
              Upload any additional documents requested by your funding specialist.
            </p>
          </div>

          {uploadedCount > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Documents Uploaded</span>
                <span className="text-sm font-medium text-green-600">{uploadedCount} file(s)</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl border-4 border-[#FF6B35] shadow-lg p-6 md:p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Upload Documents</h2>
                  <p className="text-gray-600">Select the documents you need to upload</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {DOCUMENT_TYPES.map(renderUploadItem)}
              </div>

              {errors.general && (
                <p className="text-red-500 text-sm mb-4">{errors.general}</p>
              )}

              <div className="border-t pt-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Your Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-3 border-2 rounded-lg ${
                        errors.contactEmail ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your Business Name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes about these documents..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={uploadedCount === 0 || isSubmitting}
                className={`w-full mt-6 font-semibold py-4 px-8 rounded-lg text-lg transition flex items-center justify-center gap-2 ${
                  uploadedCount > 0 && !isSubmitting
                    ? 'bg-[#1E3A8A] hover:bg-[#1E40AF] text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submit Documents ({uploadedCount})
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
            <p className="text-xl font-semibold text-gray-900 mb-4">Need Help?</p>
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
