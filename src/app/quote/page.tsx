'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Check, ChevronDown } from 'lucide-react';

// Phone number formatting function
function formatPhoneNumber(value: string): string {
  const phoneNumber = value.replace(/\D/g, '');
  if (phoneNumber.length === 0) return '';
  if (phoneNumber.length <= 3) return `(${phoneNumber}`;
  if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

export default function QuotePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    monthlyRevenue: '',
    numLocations: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Split full name
    const nameParts = formData.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const submitData = {
      firstName,
      lastName,
      email: formData.email,
      phone: formData.phone,
      businessName: formData.businessName,
      monthlyRevenue: formData.monthlyRevenue,
      numLocations: formData.numLocations
    };

    // Store for upload page
    sessionStorage.setItem('demoFormData', JSON.stringify(submitData));

    // Send to API
    try {
      await fetch('/api/submit-demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
    } catch (error) {
      console.error('Error:', error);
    }

    // Navigate to upload page
    router.push('/upload');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'phone' ? formatPhoneNumber(value) : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Yellow Banner */}
      <div className="bg-[#FFB800] text-black py-2 px-4 text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 font-semibold">
          <span className="text-sm md:text-base">Already a Toast POS Customer? You're pre-approved! Funding in as little as 24 hours</span>
          <span className="hidden md:inline">|</span>
          <a href="tel:617-533-3190" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>Call Us: (617) 533-3190</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-green-600"></span>
            </span>
          </a>
        </div>
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
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Side - Form */}
          <div>
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
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="First and Last Name*"
                      className={`w-full px-4 py-3.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition ${
                        errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>
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
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone number*"
                      className={`w-full px-4 py-3.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition ${
                        errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
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
                </div>

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

                <div className="mb-6">
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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold py-4 px-8 rounded-lg transition text-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Get Your Free Quote'}
                </button>

                <p className="text-sm text-gray-500 text-center mt-4">
                  By requesting a quote, you agree to receive communications from Toast Capital.
                  We'll handle your info according to our{' '}
                  <Link href="/privacy" className="text-[#FF6B35] hover:underline">privacy statement</Link>.
                </p>
              </div>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <Link href="/upload" className="text-[#FF6B35] font-semibold hover:underline">
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
                {/* Trust badges overlay */}
                <div className="absolute -top-4 -right-4 flex flex-col gap-2">
                  <div className="bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
                    <span className="text-xs font-semibold text-green-600">A+ Rating</span>
                  </div>
                </div>
              </div>

              {/* Trust section */}
              <div className="mt-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Trusted by over 50,000<br />
                  business owners nationwide
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  We're giving business owners more freedom and helping them grow.
                  That's why we're the preferred funding partner for successful businesses.
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
