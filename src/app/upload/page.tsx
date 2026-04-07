'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, CheckCircle, Loader2 } from 'lucide-react';
import SignaturePad from 'signature_pad';
import Footer from '@/components/Footer';

// Session storage keys (consistent across all pages)
const TOKEN_STORAGE_KEY = 'tc_session_token';
const LEAD_STORAGE_KEY = 'tc_session_lead';

// Redirect URL for invalid/missing tokens (used in 404 page)
const REDIRECT_URL = 'https://pos.toasttab.com/products/capital';

// US States for dropdown
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const REVENUE_OPTIONS = [
  '$25,000-$50,000',
  '$50,000-$100,000',
  '$100,000-$250,000',
  '$250,000-$500,000',
  '$500,000+'
];

interface FormData {
  // Business Info
  legalBusinessName: string;
  email: string;
  phone: string;
  monthlyRevenue: string;
  businessStreet: string;
  businessStreet2: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
  businessStartDate: string;
  ein: string;
  // Owner Info
  ownerFirstName: string;
  ownerLastName: string;
  ownerStreet: string;
  ownerStreet2: string;
  ownerCity: string;
  ownerState: string;
  ownerZip: string;
  ownerDob: string;
  ownerSsn: string;
  ownershipPercentage: string;
  // Signature
  signatureDate: string;
}

function UploadPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signatureError, setSignatureError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Token validation state
  const [tokenValidating, setTokenValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenInvalid, setTokenInvalid] = useState(false); // For showing 404

  // Helper to build URLs with token
  const withToken = (path: string) => {
    if (!token) return path;
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}token=${token}`;
  };

  const [formData, setFormData] = useState<FormData>({
    legalBusinessName: '',
    email: '',
    phone: '',
    monthlyRevenue: '',
    businessStreet: '',
    businessStreet2: '',
    businessCity: '',
    businessState: '',
    businessZip: '',
    businessStartDate: '',
    ein: '',
    ownerFirstName: '',
    ownerLastName: '',
    ownerStreet: '',
    ownerStreet2: '',
    ownerCity: '',
    ownerState: '',
    ownerZip: '',
    ownerDob: '',
    ownerSsn: '',
    ownershipPercentage: '',
    signatureDate: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
  });

  // Validate token on mount - check URL first, then sessionStorage
  useEffect(() => {
    const validateToken = async () => {
      // Try to get token from URL or sessionStorage
      const urlToken = searchParams.get('token');
      const storedToken = typeof window !== 'undefined' ? sessionStorage.getItem(TOKEN_STORAGE_KEY) : null;
      const currentToken = urlToken || storedToken;

      if (!currentToken) {
        // No token anywhere - show 404
        setTokenInvalid(true);
        setTokenValidating(false);
        return;
      }

      try {
        const res = await fetch(`/api/tokens?token=${currentToken}&page=upload`);
        const data = await res.json();

        if (data.valid) {
          setToken(currentToken);
          setTokenValid(true);

          // Store in sessionStorage for future navigation
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(TOKEN_STORAGE_KEY, currentToken);
            if (data.lead) {
              sessionStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(data.lead));
            }
          }
        } else {
          // Invalid token - clear session and show 404
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem(TOKEN_STORAGE_KEY);
            sessionStorage.removeItem(LEAD_STORAGE_KEY);
          }
          setTokenInvalid(true);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setTokenInvalid(true);
      } finally {
        setTokenValidating(false);
      }
    };

    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Initialize signature pad
  useEffect(() => {
    if (signatureCanvasRef.current && !signaturePadRef.current) {
      signaturePadRef.current = new SignaturePad(signatureCanvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
      });

      // Resize canvas to fit container
      const resizeCanvas = () => {
        const canvas = signatureCanvasRef.current;
        if (canvas) {
          const ratio = Math.max(window.devicePixelRatio || 1, 1);
          const container = canvas.parentElement;
          if (container) {
            canvas.width = container.offsetWidth * ratio;
            canvas.height = 150 * ratio;
            canvas.style.width = `${container.offsetWidth}px`;
            canvas.style.height = '150px';
            canvas.getContext('2d')?.scale(ratio, ratio);
            signaturePadRef.current?.clear();
          }
        }
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, []);

  // Load prepopulated data from quote form
  useEffect(() => {
    const storedData = sessionStorage.getItem('demoFormData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setFormData(prev => ({
          ...prev,
          legalBusinessName: data.businessName || '',
          email: data.email || '',
          phone: data.phone || '',
          ownerFirstName: data.firstName || '',
          ownerLastName: data.lastName || '',
          monthlyRevenue: data.monthlyRevenue || '',
        }));
      } catch {
        // Ignore
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  // Format date as MM-DD-YYYY
  const formatDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 8)}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'businessStartDate' | 'ownerDob') => {
    const formatted = formatDate(e.target.value);
    setFormData(prev => ({ ...prev, [field]: formatted }));
    // Clear error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateDateOnBlur = (field: 'businessStartDate' | 'ownerDob') => {
    const value = formData[field];
    if (value && value.length > 0 && value.length < 10) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: 'Must be MM-DD-YYYY format (e.g., 01-15-2020)'
      }));
    } else if (value.length === 10) {
      const regex = /^\d{2}-\d{2}-\d{4}$/;
      if (!regex.test(value)) {
        setFieldErrors(prev => ({ ...prev, [field]: 'Invalid date format' }));
      } else {
        const [month, day, year] = value.split('-').map(Number);
        if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > 2100) {
          setFieldErrors(prev => ({ ...prev, [field]: 'Invalid date' }));
        } else {
          setFieldErrors(prev => ({ ...prev, [field]: '' }));
        }
      }
    }
  };

  // Format EIN as XX-XXXXXXX
  const formatEIN = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}-${digits.slice(2, 9)}`;
  };

  const handleEINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEIN(e.target.value);
    setFormData(prev => ({ ...prev, ein: formatted }));
    // Clear error when user starts typing
    if (fieldErrors.ein) {
      setFieldErrors(prev => ({ ...prev, ein: '' }));
    }
  };

  const validateEINOnBlur = () => {
    const value = formData.ein;
    const digitsOnly = value.replace(/\D/g, '');

    if (value && digitsOnly.length > 0 && digitsOnly.length < 9) {
      setFieldErrors(prev => ({
        ...prev,
        ein: 'EIN must be 9 digits (e.g., 12-3456789)'
      }));
    } else if (digitsOnly.length === 9) {
      const regex = /^\d{2}-\d{7}$/;
      if (!regex.test(value)) {
        setFieldErrors(prev => ({ ...prev, ein: 'Invalid EIN format' }));
      } else {
        setFieldErrors(prev => ({ ...prev, ein: '' }));
      }
    }
  };

  const formatSSN = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.slice(0, 9);
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSN(e.target.value);
    setFormData(prev => ({ ...prev, ownerSsn: formatted }));
    // Clear error when user starts typing
    if (fieldErrors.ownerSsn) {
      setFieldErrors(prev => ({ ...prev, ownerSsn: '' }));
    }
  };

  const validateSSNOnBlur = () => {
    const value = formData.ownerSsn;
    if (value && value.length > 0 && value.length < 9) {
      setFieldErrors(prev => ({
        ...prev,
        ownerSsn: 'Must be exactly 9 digits'
      }));
    } else {
      setFieldErrors(prev => ({ ...prev, ownerSsn: '' }));
    }
  };

  const clearSignature = () => {
    signaturePadRef.current?.clear();
    setSignatureError(false);
  };

  // Validation helpers
  const isValidDate = (value: string) => {
    // Must be exactly MM-DD-YYYY format (10 characters)
    if (value.length !== 10) return false;
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (!regex.test(value)) return false;

    // Check if it's a valid date
    const [month, day, year] = value.split('-').map(Number);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;
    return true;
  };

  const isValidEIN = (value: string) => {
    // Must be exactly 9 digits in XX-XXXXXXX format
    // With dash = 10 characters total, but 9 actual digits
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length !== 9) return false;
    const regex = /^\d{2}-\d{7}$/;
    return regex.test(value);
  };

  const isValidSSN = (value: string) => {
    // Must be exactly 9 digits
    return value.length === 9 && /^\d{9}$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSignatureError(false);

    // Validate Business Start Date (MM-DD-YYYY)
    if (!isValidDate(formData.businessStartDate)) {
      setError('Business Start Date must be in MM-DD-YYYY format (e.g., 01-15-2020)');
      return;
    }

    // Validate Owner DOB (MM-DD-YYYY)
    if (!isValidDate(formData.ownerDob)) {
      setError('Date of Birth must be in MM-DD-YYYY format (e.g., 06-20-1985)');
      return;
    }

    // Validate EIN (9 digits: XX-XXXXXXX)
    if (!isValidEIN(formData.ein)) {
      setError('Federal Tax ID (EIN) must be 9 digits in XX-XXXXXXX format (e.g., 12-3456789)');
      return;
    }

    // Validate SSN (9 digits)
    if (!isValidSSN(formData.ownerSsn)) {
      setError('Social Security Number must be exactly 9 digits');
      return;
    }

    // Check signature
    if (signaturePadRef.current?.isEmpty()) {
      setSignatureError(true);
      setError('Please provide your signature');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get signature as base64
      const signatureData = signaturePadRef.current?.toDataURL('image/png');

      // Submit to our API which forwards to JotForm
      const response = await fetch('/api/submit-jotform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          signature: signatureData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      // Store application data for /dlvc page
      // Map field names to what dlvc page expects
      sessionStorage.setItem('applicationData', JSON.stringify({
        ...formData,
        // Map to expected field names for dlvc page
        firstName: formData.ownerFirstName,
        lastName: formData.ownerLastName,
        businessName: formData.legalBusinessName,
        jotformSubmissionId: result.submissionId,
        jotformSubmitted: true,
      }));

      // Progress token status to upload_completed
      if (token) {
        sessionStorage.setItem('flowToken', token);
        await fetch('/api/tokens', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, page: 'upload' }),
        });
      }

      // Redirect to /dlvc with token
      router.push(withToken('/dlvc'));

    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Show loading while validating token
  if (tokenValidating) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show 404 if token is invalid or missing
  if (tokenInvalid || !tokenValid) {
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

      {/* Progress Steps */}
      <div className="border-b py-4 md:py-6">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {/* Step 1 - Complete */}
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#FF6B35] flex items-center justify-center">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-900">Quote</span>
            </div>
            <div className="w-6 md:w-12 h-0.5 bg-[#FF6B35]"></div>
            {/* Step 2 - Current */}
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-bold text-xs md:text-sm">
                2
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-900">Verification</span>
            </div>
            <div className="w-6 md:w-12 h-0.5 bg-gray-300"></div>
            {/* Step 3 */}
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs md:text-sm">
                3
              </div>
              <span className="text-xs md:text-sm text-gray-500">Documents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 px-4 py-6 md:py-8 pb-24 md:pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
              Complete Your Application
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-3">
              Fill out the form below to verify your business information.
            </p>
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-sm">
              <span className="flex items-center gap-1.5 text-green-700 font-medium">
                <CheckCircle className="w-4 h-4" />
                No cost to apply
              </span>
              <span className="flex items-center gap-1.5 text-green-700 font-medium">
                <CheckCircle className="w-4 h-4" />
                No credit impact
              </span>
              <span className="flex items-center gap-1.5 text-green-700 font-medium">
                <CheckCircle className="w-4 h-4" />
                No obligation
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border-4 border-[#FF6B35] p-6 md:p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Business Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Legal Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="legalBusinessName"
                    value={formData.legalBusinessName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(555) 555-5555"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approximate Monthly Revenue <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="monthlyRevenue"
                    value={formData.monthlyRevenue}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent bg-white"
                  >
                    <option value="">Please Select</option>
                    {REVENUE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessStartDate"
                    value={formData.businessStartDate}
                    onChange={(e) => handleDateChange(e, 'businessStartDate')}
                    onBlur={() => validateDateOnBlur('businessStartDate')}
                    placeholder="MM-DD-YYYY"
                    maxLength={10}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent ${
                      fieldErrors.businessStartDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.businessStartDate && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.businessStartDate}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessStreet"
                    value={formData.businessStreet}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address Line 2
                  </label>
                  <input
                    type="text"
                    name="businessStreet2"
                    value={formData.businessStreet2}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessCity"
                    value={formData.businessCity}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="businessState"
                      value={formData.businessState}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent bg-white"
                    >
                      <option value="">Select</option>
                      {US_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="businessZip"
                      value={formData.businessZip}
                      onChange={handleInputChange}
                      required
                      maxLength={10}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Federal Tax ID (EIN) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ein"
                    value={formData.ein}
                    onChange={handleEINChange}
                    onBlur={validateEINOnBlur}
                    required
                    placeholder="XX-XXXXXXX"
                    maxLength={10}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent ${
                      fieldErrors.ein ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.ein && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.ein}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Owner Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Owner Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerFirstName"
                    value={formData.ownerFirstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerLastName"
                    value={formData.ownerLastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerStreet"
                    value={formData.ownerStreet}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address Line 2
                  </label>
                  <input
                    type="text"
                    name="ownerStreet2"
                    value={formData.ownerStreet2}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerCity"
                    value={formData.ownerCity}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="ownerState"
                      value={formData.ownerState}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent bg-white"
                    >
                      <option value="">Select</option>
                      {US_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ownerZip"
                      value={formData.ownerZip}
                      onChange={handleInputChange}
                      required
                      maxLength={10}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerDob"
                    value={formData.ownerDob}
                    onChange={(e) => handleDateChange(e, 'ownerDob')}
                    onBlur={() => validateDateOnBlur('ownerDob')}
                    placeholder="MM-DD-YYYY"
                    maxLength={10}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent ${
                      fieldErrors.ownerDob ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.ownerDob && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.ownerDob}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Social Security Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="ownerSsn"
                    value={formData.ownerSsn}
                    onChange={handleSSNChange}
                    onBlur={validateSSNOnBlur}
                    placeholder="9 digits"
                    required
                    maxLength={9}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent ${
                      fieldErrors.ownerSsn ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.ownerSsn && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.ownerSsn}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Percentage of Ownership <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="ownershipPercentage"
                    value={formData.ownershipPercentage}
                    onChange={handleInputChange}
                    placeholder="e.g., 100"
                    required
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Authorization & Signature
              </h2>

              {/* Legal Disclosure */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 max-h-32 overflow-y-auto">
                <p className="text-xs text-gray-600 leading-relaxed">
                  By signing below, you certify that you are authorized to sign this application on behalf of the above listed business and merchant owner(s) (individually and collectively "Applicant") and to certify that all information and supporting documentation submitted with this application is true, correct and complete, and all such information may be relied upon by toastcap.com ("TC") and the Recipients (defined below). Applicant hereby authorizes TC and each of its representatives, successors, assigns and designees and third-party financial institutions and funding partners, which includes but is not limited to lenders, and other finance providers with whom TC has, or may in the future enter into, commercial-brokerage-financing relationships ("Recipients"): (1) to obtain consumer or personal, business credit and/or investigative reports from one or more consumer reporting agencies, such as TransUnion, Experian and Equifax and other information about you, including credit card processor statements and bank statements, (2) to obtain credit card processor statements and bank statements from banks, creditor and other third parties; (3) transmit this application form, along with any of the foregoing information obtained in connection with this application, to any or all the Recipients for the purposes of securing Applicant working capital; (4) to obtain the release, by any creditor or financial institution, of any information relating to you, and to share such information with any/all Recipients; and (5) to contact you via e-mail, call and/or text-message at the e-mail address and/or phone number provided above, or at any e-mail address and/or phone number reasonably identified as belonging to you, including wireless numbers (if applicable), even if listed on a Do-Not-Call registry, using an automated telephone dialing system or other similar system with respect to this application, future-related commercial-financing opportunities and/or other lawful telemarketing purposes. Applicant further certifies that should any of the foregoing information change, to the extent within its knowledge, that Applicant will promptly notify TC of such changes.
                </p>
              </div>

              {/* Signature Pad */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature <span className="text-red-500">*</span>
                </label>
                <div className={`border-2 rounded-lg overflow-hidden ${signatureError ? 'border-red-500' : 'border-gray-300'}`}>
                  <canvas
                    ref={signatureCanvasRef}
                    className="w-full touch-none"
                    style={{ height: '150px' }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">Sign above using your mouse or finger</span>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-sm text-[#FF6B35] hover:underline"
                  >
                    Clear Signature
                  </button>
                </div>
              </div>

              {/* Date */}
              <div className="max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="signatureDate"
                  value={formData.signatureDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                'Continue to Document Upload'
              )}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              By clicking continue, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          {/* Help Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 md:p-6 text-center mt-6">
            <p className="text-lg font-semibold text-gray-900 mb-3">
              Need Help or Have Questions?
            </p>
            <a
              href="tel:6175333190"
              className="inline-block bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold py-2.5 px-6 rounded-lg transition text-sm"
            >
              <Phone className="inline-block w-4 h-4 mr-2" />
              Call (617) 533-3190
            </a>
          </div>
        </div>
      </main>

      <div className="pb-20 md:pb-0">
        <Footer />
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <UploadPageContent />
    </Suspense>
  );
}
