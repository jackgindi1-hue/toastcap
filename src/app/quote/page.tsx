'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone, Check, ChevronDown, Loader2, ShieldCheck } from 'lucide-react';
import Footer from '@/components/Footer';

// Session storage keys
const TOKEN_STORAGE_KEY = 'tc_session_token';
const LEAD_STORAGE_KEY = 'tc_session_lead';

// Redirect URL for invalid/missing tokens (used only for legacy, now we show 404)
const REDIRECT_URL = 'https://pos.toasttab.com/products/capital';

// Check if currently within business hours (Mon-Fri 9am-6pm ET)
function isBusinessHours(): boolean {
  const now = new Date();
  const etTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day = etTime.getDay();
  const hour = etTime.getHours();
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

// Phone number formatting function
function formatPhoneNumber(value: string): string {
  const phoneNumber = value.replace(/\D/g, '');
  if (phoneNumber.length === 0) return '';
  if (phoneNumber.length <= 3) return `(${phoneNumber}`;
  if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

function QuotePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    monthlyRevenue: '',
    numLocations: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Token validation state
  const [tokenValidating, setTokenValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenInvalid, setTokenInvalid] = useState(false); // For showing 404

  // OTP verification state
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [phoneNeedsChange, setPhoneNeedsChange] = useState(false);

  // Helper to build URLs with token
  const withToken = (path: string) => {
    if (!token) return path;
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}token=${token}`;
  };

  // Validate token on mount - check URL first, then sessionStorage
  useEffect(() => {
    const validateToken = async () => {
      const urlToken = searchParams.get('token');
      const storedToken = typeof window !== 'undefined' ? sessionStorage.getItem(TOKEN_STORAGE_KEY) : null;

      // Priority: URL token (with click consumption) > stored token (no click consumption)
      const tokenToValidate = urlToken || storedToken;
      const shouldConsumeClick = !!urlToken; // Only consume click if token came from URL

      if (!tokenToValidate) {
        // No token anywhere - show 404
        setTokenInvalid(true);
        setTokenValidating(false);
        return;
      }

      try {
        // Validate token (and optionally consume a click)
        const res = await fetch(`/api/tokens?token=${tokenToValidate}&page=quote${shouldConsumeClick ? '&consumeClick=true' : ''}`);
        const data = await res.json();

        if (data.valid) {
          setToken(tokenToValidate);
          setTokenValid(true);

          // Store in sessionStorage for future navigation
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(TOKEN_STORAGE_KEY, tokenToValidate);
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

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const revenueOptions = [
    { value: '', label: 'Approximate Monthly Revenue*' },
    { value: '25k-50k', label: '$25,000 - $50,000' },
    { value: '50k-100k', label: '$50,000 - $100,000' },
    { value: '100k-250k', label: '$100,000 - $250,000' },
    { value: '250k+', label: '$250,000+' }
  ];

  const locationOptions = [
    { value: '', label: 'Number of Locations*' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10+', label: '10+' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (formData.phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Valid phone required';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.monthlyRevenue) newErrors.monthlyRevenue = 'Please select monthly revenue';
    if (!formData.numLocations) newErrors.numLocations = 'Please select number of locations';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = async () => {
    setIsSendingCode(true);
    setOtpError('');

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const data = await response.json();

      if (data.success) {
        setCodeSent(true);
        setOtpCode('');
        setResendTimer(30);
      } else {
        setOtpError(data.error || 'Failed to send verification code');
      }
    } catch (error) {
      setOtpError('Failed to send verification code. Please try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyOtp = async () => {
    if (otpCode.length !== 6) {
      setOtpError('Please enter the 6-digit code');
      return false;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          otp: otpCode
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsPhoneVerified(true);
        setErrors(prev => ({ ...prev, phone: '' }));
        return true;
      } else {
        setOtpError(data.error || 'Invalid verification code');
        return false;
      }
    } catch (error) {
      setOtpError('Verification failed. Please try again.');
      return false;
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If code hasn't been sent yet, validate form and send code
    if (!codeSent) {
      if (!validateForm()) return;

      setIsSubmitting(true);
      await sendOtp();
      setIsSubmitting(false);
      return;
    }

    // If code is sent but not verified, verify the code
    if (!isPhoneVerified) {
      setIsSubmitting(true);
      const verified = await verifyOtp();
      if (!verified) {
        setIsSubmitting(false);
        return;
      }
    }

    // Phone is verified, submit the form
    setIsSubmitting(true);

    const submitData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      businessName: formData.businessName,
      monthlyRevenue: formData.monthlyRevenue,
      numLocations: formData.numLocations,
      phoneVerified: true
    };

    // Store for upload page
    sessionStorage.setItem('demoFormData', JSON.stringify(submitData));

    // Store token for next pages
    if (token) {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    }

    // Send to API
    try {
      const response = await fetch('/api/submit-demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      const result = await response.json();

      // Store scheduled drip email IDs for potential cancellation on DLVC completion
      if (result.scheduledDripIds && result.scheduledDripIds.length > 0) {
        try {
          localStorage.setItem('preDlvcDripIds', JSON.stringify(result.scheduledDripIds));
          console.log('✅ Stored pre-DLVC drip IDs for cancellation:', result.scheduledDripIds);
        } catch (storageError) {
          // localStorage might be unavailable - that's ok, drips will just send
          console.log('⚠️ Could not store drip IDs (localStorage unavailable)');
        }
      }

      // Progress token status to quote_completed
      if (token) {
        await fetch('/api/tokens', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, page: 'quote' }),
        });
      }
    } catch (error) {
      console.error('Error:', error);
      // Don't block navigation if API call fails
    }

    // Navigate to upload page with token
    router.push(withToken('/upload'));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'phone' ? formatPhoneNumber(value) : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

    // Reset phone verification if phone number changes after code was sent
    if (name === 'phone' && codeSent) {
      setCodeSent(false);
      setIsPhoneVerified(false);
      setOtpCode('');
      setOtpError('');
      setResendTimer(0);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtpCode(value);
    setOtpError('');
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
  if (tokenInvalid) {
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

  // If token is invalid, this component won't render (redirect happens in useEffect)
  if (!tokenValid) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
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
                {isBusinessHours() ? (
                  <>
                    <span className="hidden md:flex text-xs text-gray-600 items-center gap-1">Live Agents Standing By <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span></span>
                    <span className="text-xs md:hidden text-gray-600 flex items-center gap-1">Live Agents <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span></span>
                  </>
                ) : (
                  <>
                    <span className="hidden md:flex text-xs text-gray-600 items-center gap-1">Mon-Fri 9am-6pm ET <span className="w-2 h-2 bg-yellow-500 rounded-full inline-block"></span></span>
                    <span className="text-xs md:hidden text-gray-600 flex items-center gap-1">Mon-Fri 9-6 ET <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full inline-block"></span></span>
                  </>
                )}
                <span className="font-bold text-sm md:text-xl text-gray-900">617-533-3190</span>
              </div>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Footer - Phone */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FF6B35] shadow-lg">
        <a href="tel:617-533-3190" className="flex items-center justify-center gap-3 py-3 px-6">
          <Phone className="w-5 h-5 text-white" />
          <span className="text-white font-bold">Call: 617-533-3190</span>
        </a>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 pb-24 md:pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Side - Form */}
          <div>
            {/* Trust badge */}
            <div className="flex items-center gap-2 mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <path d="M12 2L3 7V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V7L12 2Z" fill="#FF6B35"/>
                <path d="M10 15.5L7 12.5L8.41 11.09L10 12.67L15.59 7.09L17 8.5L10 15.5Z" fill="white"/>
              </svg>
              <span className="text-gray-700 font-medium">164,000* locations like yours choose Toast</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Get a free,<br />
              funding quote
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Schedule a consultation with a funding expert to receive a no commitment quote, with flexible funding from $2,000 to $2,000,000.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-2xl border-4 border-[#FF6B35] p-6 md:p-8 shadow-lg">

                {/* Row 1: First Name, Last Name */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name*"
                      className={`w-full px-4 py-3.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition ${
                        errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name*"
                      className={`w-full px-4 py-3.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition ${
                        errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Row 2: Email, Phone */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address*"
                      className={`w-full px-4 py-3.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        handleInputChange(e);
                        if (phoneNeedsChange) setPhoneNeedsChange(false);
                      }}
                      placeholder="Phone Number*"
                      disabled={isPhoneVerified}
                      className={`w-full px-4 py-3.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition ${
                        errors.phone || phoneNeedsChange ? 'border-red-500 bg-red-50' : isPhoneVerified ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      } ${isPhoneVerified ? 'pr-10' : ''}`}
                      autoFocus={phoneNeedsChange}
                    />
                    {isPhoneVerified && (
                      <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                    )}
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    {phoneNeedsChange && !errors.phone && <p className="text-red-500 text-sm mt-1">Please enter your correct phone number</p>}
                  </div>
                </div>

                {/* Row 3: Business Name */}
                <div className="mb-4">
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Business Name*"
                    className={`w-full px-4 py-3.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition ${
                      errors.businessName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                </div>

                {/* Row 4: Monthly Revenue */}
                <div className="mb-4">
                  <div className="relative">
                    <select
                      name="monthlyRevenue"
                      value={formData.monthlyRevenue}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition appearance-none bg-white ${
                        errors.monthlyRevenue ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      } ${!formData.monthlyRevenue ? 'text-gray-400' : 'text-gray-900'}`}
                    >
                      {revenueOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.monthlyRevenue && <p className="text-red-500 text-sm mt-1">{errors.monthlyRevenue}</p>}
                </div>

                {/* Row 5: Number of Locations */}
                <div className={codeSent && !isPhoneVerified ? "mb-4" : "mb-6"}>
                  <div className="relative">
                    <select
                      name="numLocations"
                      value={formData.numLocations}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition appearance-none bg-white ${
                        errors.numLocations ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      } ${!formData.numLocations ? 'text-gray-400' : 'text-gray-900'}`}
                    >
                      {locationOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.numLocations && <p className="text-red-500 text-sm mt-1">{errors.numLocations}</p>}
                </div>

                {/* Code Entry Section - Shows after code is sent (ABOVE button) */}
                {codeSent && !isPhoneVerified && (
                  <div className="mb-4 p-4 bg-red-50 border-2 border-red-400 rounded-lg">
                    <label className="block text-red-700 font-semibold mb-2">
                      Enter code sent to {formData.phone}
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={handleOtpChange}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-center text-xl tracking-widest font-mono bg-white"
                      autoFocus
                    />
                    {otpError && <p className="text-red-600 text-sm mt-2 font-medium">{otpError}</p>}
                    <p className="text-red-600 text-xs mt-2">
                      Didn't receive the code?{' '}
                      {resendTimer > 0 ? (
                        <span className="text-gray-500">Resend in {resendTimer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={sendOtp}
                          disabled={isSendingCode}
                          className="underline hover:text-red-800 font-medium"
                        >
                          {isSendingCode ? 'Sending...' : 'Click here to resend'}
                        </button>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setCodeSent(false);
                        setOtpCode('');
                        setOtpError('');
                        setFormData(prev => ({ ...prev, phone: '' }));
                        setPhoneNeedsChange(true);
                      }}
                      className="text-gray-500 text-xs mt-2 underline hover:text-gray-700"
                    >
                      Not the right number? Change it
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isSendingCode || isVerifyingOtp}
                  className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold py-4 px-8 rounded-lg transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || isSendingCode ? 'Sending Code...' : isVerifyingOtp ? 'Verifying...' : codeSent ? 'Verify & Continue' : 'Get Your Free Quote'}
                </button>

                {/* Error Message - Shows when there's an error */}
                {otpError && !codeSent && (
                  <div className="mt-4 p-4 bg-red-50 border-2 border-red-400 rounded-lg">
                    <p className="text-red-600 font-medium">{otpError}</p>
                    <p className="text-red-500 text-sm mt-1">Please check your phone number and try again.</p>
                  </div>
                )}

                {/* Phone Verified Success */}
                {isPhoneVerified && (
                  <p className="text-center text-green-600 text-sm mt-3 flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" /> Phone verified successfully
                  </p>
                )}

                <p className="text-sm text-gray-500 text-center mt-4">
                  By requesting a quote, you agree to receive communications from Toast Capital.
                  We'll handle your info according to our{' '}
                  <Link href="/privacy" className="text-[#FF6B35] hover:underline">privacy statement</Link>.
                </p>
              </div>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <Link href={withToken('/upload')} className="text-[#FF6B35] font-semibold hover:underline">
                Log in →
              </Link>
            </p>
          </div>

          {/* Right Side - Image & Trust */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Product Image with badges */}
              <div className="relative">
                <Image
                  src="https://ext.same-assets.com/2820641348/2075179614.avif"
                  alt="Toast Capital Funding Dashboard"
                  width={600}
                  height={450}
                  className="w-full h-auto rounded-2xl"
                />
              </div>

              {/* Trust section */}
              <div className="mt-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Trusted by over 50,000<br />
                  business owners nationwide
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  We're giving business owners more freedom and helping them grow.
                  That's why Toast Capital is the preferred funding partner for successful businesses.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#FF6B35]">$2B+</p>
                  <p className="text-sm text-gray-600">Funded</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#FF6B35]">24hrs</p>
                  <p className="text-sm text-gray-600">Fast Approval</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#FF6B35]">4.9★</p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <QuotePageContent />
    </Suspense>
  );
}
