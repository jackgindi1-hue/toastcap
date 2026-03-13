'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, ChevronDown, ChevronRight, Play, Phone, X, Building2, Coffee, Store, Utensils, ArrowRight, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

// Testimonials data
const testimonials = [
  {
    image: "https://ext.same-assets.com/2820641348/3369406675.jpeg",
    quote: "Being able to automatically repay daily as a fixed percentage of daily card transactions is beautiful. Not having to stress about making monthly payments is a relief.",
    name: "Don King",
    title: "Owner | Fat City Brew & BBQ"
  },
  {
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&h=400&fit=crop",
    quote: "Toast Capital made the funding process incredibly simple. We got approved in 24 hours and had the funds we needed to expand our second location. The flexible payments fit perfectly with our cash flow.",
    name: "Maria Santos",
    title: "Owner | Santos Family Restaurant"
  },
  {
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=400&fit=crop",
    quote: "What I love most is the weekly payment option. It works perfectly for our business model and there's no stress about missing payments. Plus the prepayment discount saved us thousands!",
    name: "James Mitchell",
    title: "Owner | The Corner Bistro"
  }
];

// Testimonials Carousel Component
function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const testimonial = testimonials[currentIndex];

  return (
    <div className="relative">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          <Image
            key={currentIndex}
            src={testimonial.image}
            alt={testimonial.name}
            width={500}
            height={400}
            className="w-full h-auto object-cover transition-opacity duration-500"
          />
        </div>
        <div>
          <div className="text-6xl text-[#FF6B35] mb-4">"</div>
          <p className="text-xl md:text-2xl text-gray-900 font-medium mb-6 leading-relaxed transition-opacity duration-500">
            {testimonial.quote}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Testimonial reflects the experience of the merchant and has been edited for clarity. Results may vary.
          </p>
          <div>
            <p className="font-bold text-gray-900">{testimonial.name}</p>
            <p className="text-gray-600">{testimonial.title}</p>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-3 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-[#FF6B35] w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Business type options for step 1
const businessTypes = [
  {
    id: 'full-service',
    label: 'Full Service Restaurant',
    icon: Utensils,
    description: 'Table service, waitstaff'
  },
  {
    id: 'quick-service',
    label: 'Quick Service Restaurant',
    icon: Coffee,
    description: 'Counter service, fast casual'
  },
  {
    id: 'bar-nightclub',
    label: 'Bar / Nightclub',
    icon: Store,
    description: 'Bars, pubs, nightlife'
  },
  {
    id: 'other',
    label: 'Other Business',
    icon: Building2,
    description: 'Retail, services, other'
  }
];

// Interactive Bar Chart Component
function InteractiveBarChart() {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  // Daily data - 7 days
  const dailyData = [
    { label: 'Mon', sales: 4200, payment: 420 },
    { label: 'Tue', sales: 5100, payment: 510 },
    { label: 'Wed', sales: 3800, payment: 380 },
    { label: 'Thu', sales: 6100, payment: 610 },
    { label: 'Fri', sales: 7200, payment: 720 },
    { label: 'Sat', sales: 8900, payment: 890 },
    { label: 'Sun', sales: 5400, payment: 540 },
  ];

  // Weekly data - 4 weeks
  const weeklyData = [
    { label: 'Week 1', sales: 28500, payment: 2850 },
    { label: 'Week 2', sales: 32100, payment: 3210 },
    { label: 'Week 3', sales: 29800, payment: 2980 },
    { label: 'Week 4', sales: 35600, payment: 3560 },
  ];

  const chartData = viewMode === 'daily' ? dailyData : weeklyData;

  // Find max for scaling
  const maxSales = Math.max(...chartData.map(d => d.sales));
  // 20% larger: scale height
  const chartHeight = 360;
  const barWidth = viewMode === 'daily' ? 32 : 48;
  const paymentBarWidth = viewMode === 'daily' ? 14 : 20;
  const barSpacing = viewMode === 'daily' ? 80 : 120;

  // Colors
  const salesColor = '#FF6B35';
  const paymentColor = '#C85000';

  // Reset selection when view mode changes
  useEffect(() => {
    setSelectedBar(null);
  }, [viewMode]);

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center">
      {/* Toggle Switch */}
      <div className="flex items-center gap-2 mb-8 bg-gray-100 p-1 rounded-full">
        <button
          onClick={() => setViewMode('daily')}
          className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
            viewMode === 'daily'
              ? 'bg-[#FF6B35] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setViewMode('weekly')}
          className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
            viewMode === 'weekly'
              ? 'bg-[#FF6B35] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Weekly
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          width="100%"
          height={chartHeight + 60}
          viewBox={`0 0 ${chartData.length * barSpacing + 40} ${chartHeight + 60}`}
          className="mx-auto"
        >
          {/* Y axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
            <text
              key={i}
              x={5}
              y={chartHeight - t * chartHeight + 20}
              fontSize="12"
              fill="#bbb"
              textAnchor="start"
            >
              ${(Math.round(maxSales * t) / 1000).toFixed(0)}k
            </text>
          ))}
          {/* Bars */}
          {chartData.map((d, i) => {
            const salesBarHeight = (d.sales / maxSales) * chartHeight;
            const paymentBarHeight = (d.payment / maxSales) * chartHeight;
            const xPos = i * barSpacing + 50;
            return (
              <g key={i}>
                {/* Sales bar */}
                <rect
                  x={xPos}
                  y={chartHeight - salesBarHeight + 20}
                  width={barWidth}
                  height={salesBarHeight}
                  rx={8}
                  fill={salesColor}
                  className="cursor-pointer transition-all duration-300"
                  style={{
                    opacity: selectedBar === i ? 1 : 0.85,
                    filter: selectedBar === i ? 'drop-shadow(0 4px 12px #FF6B35AA)' : 'none',
                    transform: selectedBar === i ? 'scale(1.02)' : 'scale(1)',
                    transformOrigin: 'bottom center',
                  }}
                  onClick={() => setSelectedBar(i)}
                />
                {/* Payment bar */}
                <rect
                  x={xPos + barWidth + 4}
                  y={chartHeight - paymentBarHeight + 20}
                  width={paymentBarWidth}
                  height={paymentBarHeight}
                  rx={6}
                  fill={paymentColor}
                  className="cursor-pointer transition-all duration-300"
                  style={{
                    opacity: selectedBar === i ? 1 : 0.85,
                    filter: selectedBar === i ? 'drop-shadow(0 4px 12px #C85000AA)' : 'none',
                  }}
                  onClick={() => setSelectedBar(i)}
                />
                {/* Label */}
                <text
                  x={xPos + (barWidth + paymentBarWidth) / 2}
                  y={chartHeight + 45}
                  fontSize="14"
                  fill="#666"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
          {/* X axis line */}
          <line
            x1={40}
            y1={chartHeight + 20}
            x2={chartData.length * barSpacing + 30}
            y2={chartHeight + 20}
            stroke="#e5e5e5"
            strokeWidth={2}
          />
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-[#FF6B35] inline-block"></span>
          <span className="text-sm text-gray-700 font-medium">Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-[#C85000] inline-block"></span>
          <span className="text-sm text-gray-700 font-medium">Payment (10%)</span>
        </div>
      </div>

      {/* Info for selected bar */}
      {selectedBar !== null && (
        <div className="mt-4 bg-white rounded-xl shadow-xl p-6 border border-gray-200 flex flex-col items-center animate-fade-in min-w-[280px]">
          <div className="text-sm font-semibold text-gray-500 mb-3">{chartData[selectedBar].label}</div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#FF6B35]"></div>
            <span className="text-sm text-gray-600">Sales:</span>
            <span className="text-2xl font-bold text-gray-900">${chartData[selectedBar].sales.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#C85000]"></div>
            <span className="text-sm text-gray-600">Payment:</span>
            <span className="text-2xl font-bold text-[#C85000]">${chartData[selectedBar].payment.toLocaleString()}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">10% of {viewMode === 'daily' ? 'daily' : 'weekly'} sales</div>
          <button
            className="mt-4 px-5 py-2 rounded-full bg-[#FF6B35] text-white font-semibold text-sm hover:bg-[#C85000] transition"
            onClick={() => setSelectedBar(null)}
          >
            Close
          </button>
        </div>
      )}
      <div className="text-xs text-gray-400 mt-3">Click a bar to see details</div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedBusinessType, setSelectedBusinessType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    monthlyRevenue: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
    setStep(1);
    setSelectedBusinessType(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      businessName: '',
      monthlyRevenue: ''
    });
    setFormErrors({});
    setTouched({});
  };

  const handleBusinessTypeSelect = (typeId: string) => {
    setSelectedBusinessType(typeId);
  };

  const handleNextStep = () => {
    if (step === 1 && selectedBusinessType) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  // Validation function
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        return '';
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (value.replace(/\D/g, '').length < 10) return 'Please enter a valid 10-digit phone number';
        return '';
      case 'businessName':
        if (!value.trim()) return 'Business name is required';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Apply phone formatting for phone field
    const newValue = name === 'phone' ? formatPhoneNumber(value) : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));

    // Validate and clear error if field is valid
    if (touched[name]) {
      const error = validateField(name, newValue);
      setFormErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAllFields = (): boolean => {
    const errors: Record<string, string> = {};
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'businessName'];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) errors[field] = error;
    });

    setFormErrors(errors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      businessName: true
    });

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submitting
    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);

    const submitData = {
      ...formData,
      businessType: selectedBusinessType
    };

    // Store form data in sessionStorage for the upload page
    sessionStorage.setItem('demoFormData', JSON.stringify(submitData));

    // Send confirmation email via API
    try {
      await fetch('/api/submit-demo-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
    } catch (error) {
      console.error('Error sending demo request:', error);
      // Continue even if email fails
    }

    // Navigate to upload page
    setTimeout(() => {
      setShowModal(false);
      router.push('/upload');
    }, 500);
  };

  const isStep2Valid = formData.firstName && formData.lastName && formData.email && formData.phone && formData.businessName && Object.values(formErrors).every(e => !e);

  const faqs = [
    {
      question: "How do you determine whether my business is eligible for a Toast Capital Loan?",
      answer: "Toast Capital Loan eligibility and the target terms your business is eligible for are based on a variety of factors. Some of these factors include your business's card processing volume, time in business, and status of any bankruptcy filings. You can apply to see if you have a pre-qualified offer."
    },
    {
      question: "Does applying for a Toast Capital Loan affect my credit score?",
      answer: "No, applying for a Toast Capital Loan does not affect your credit score. We perform a soft credit check that doesn't impact your credit rating."
    },
    {
      question: "How do I repay my Toast Capital Loan?",
      answer: "Repayment is automated and flexible. A fixed percentage of your daily card transactions is automatically applied to your loan, so you pay more on busy days and less on slower days."
    },
    {
      question: "How much does it cost?",
      answer: "Toast Capital Loans have just one simple fixed fee - no compounding interest, no personal guarantee, no giving up equity, and no late fees."
    },
    {
      question: "How can I use a Toast Capital Loan?",
      answer: "You can use your Toast Capital Loan for any business purpose including payroll, inventory, renovations, equipment purchases, marketing, or expansion."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Demo Request Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          {/* Modal Header with Progress */}
          <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF6B35] px-6 py-5">
            <div className="flex items-center justify-between mb-3">
              <DialogTitle className="text-white text-xl font-bold">
                {step === 1 ? 'Get Your Free Quote' : 'Tell Us About Yourself'}
              </DialogTitle>
            </div>
            {/* Progress Steps */}
            <div className="flex items-center gap-2">
              <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/40'}`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/40'}`} />
            </div>
            <p className="text-white/80 text-sm mt-2">Step {step} of 2</p>
          </div>

          <div className="p-6">
            {step === 1 ? (
              /* Step 1: Business Type Selection */
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How would you describe your business?
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Select the option that best fits your establishment
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {businessTypes.map((type) => {
                    const IconComponent = type.icon;
                    const isSelected = selectedBusinessType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleBusinessTypeSelect(type.id)}
                        className={`flex flex-col items-center p-5 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-[#FF6B35] bg-orange-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                          isSelected ? 'bg-[#FF6B35] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <IconComponent className="w-7 h-7" />
                        </div>
                        <span className={`font-semibold text-sm text-center ${isSelected ? 'text-[#FF6B35]' : 'text-gray-900'}`}>
                          {type.label}
                        </span>
                        <span className="text-xs text-gray-500 mt-1 text-center">
                          {type.description}
                        </span>
                        {isSelected && (
                          <div className="mt-2 w-5 h-5 rounded-full bg-[#FF6B35] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!selectedBusinessType}
                  className={`w-full mt-6 py-3.5 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    selectedBusinessType
                      ? 'bg-[#1E3A8A] hover:bg-[#1E40AF] text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              /* Step 2: Contact Information */
              <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Enter your contact information
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  We'll use this to personalize your funding options
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
                          formErrors.firstName && touched.firstName
                            ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500'
                            : 'border-gray-300 focus:ring-[#FF6B35] focus:border-[#FF6B35]'
                        }`}
                        placeholder="John"
                      />
                      {formErrors.firstName && touched.firstName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
                          formErrors.lastName && touched.lastName
                            ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500'
                            : 'border-gray-300 focus:ring-[#FF6B35] focus:border-[#FF6B35]'
                        }`}
                        placeholder="Smith"
                      />
                      {formErrors.lastName && touched.lastName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
                        formErrors.email && touched.email
                          ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500'
                          : 'border-gray-300 focus:ring-[#FF6B35] focus:border-[#FF6B35]'
                      }`}
                      placeholder="john@restaurant.com"
                    />
                    {formErrors.email && touched.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
                        formErrors.phone && touched.phone
                          ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500'
                          : 'border-gray-300 focus:ring-[#FF6B35] focus:border-[#FF6B35]'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {formErrors.phone && touched.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
                        formErrors.businessName && touched.businessName
                          ? 'border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500'
                          : 'border-gray-300 focus:ring-[#FF6B35] focus:border-[#FF6B35]'
                      }`}
                      placeholder="Your Restaurant Name"
                    />
                    {formErrors.businessName && touched.businessName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.businessName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Estimated Monthly Revenue
                    </label>
                    <select
                      id="monthlyRevenue"
                      name="monthlyRevenue"
                      value={formData.monthlyRevenue}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors bg-white"
                    >
                      <option value="">Select revenue range</option>
                      <option value="under-25k">Under $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k-250k">$100,000 - $250,000</option>
                      <option value="250k-plus">$250,000+</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 py-3.5 px-6 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!isStep2Valid || isSubmitting}
                    className={`flex-[2] py-3.5 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                      isStep2Valid && !isSubmitting
                        ? 'bg-[#1E3A8A] hover:bg-[#1E40AF] text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Get Your Free Quote
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By submitting, you agree to our{' '}
                  <Link href="/privacy" className="text-[#1E3A8A] hover:underline">Privacy Policy</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-[#1E3A8A] hover:underline">Terms of Service</Link>
                </p>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Yellow Banner */}
      <div className="bg-[#FFB800] text-black py-2 px-4 text-center">
        <span className="text-sm md:text-base font-semibold">Toast POS Merchant? Check your pre-qualification for funding in minutes.</span>
      </div>

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
                <Phone className="w-5 h-5 text-[#FF6B35]" />
                <span className="font-bold text-lg">617-533-3190</span>
              </a>
            </div>
            <Link
              href="/quote"
              className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold py-2 px-6 md:py-3 md:px-8 rounded-lg transition text-sm md:text-base whitespace-nowrap"
            >
              GET STARTED
            </Link>
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

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span className="w-6 h-6 bg-[#FF6B35] rounded flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect width="14" height="14" rx="2" fill="#FF6B35"/>
                  </svg>
                </span>
                <ChevronRight className="w-4 h-4" />
                <span>Products</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">Capital</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Fast, easy, and flexible funding from a partner who gets it
              </h1>

              <p className="text-lg text-gray-600 mb-8">
                Crunched for cash or ready to expand? Access loans ranging from $2,000 to $2,000,000 with Toast Capital.
              </p>

              <Link
                href="/quote"
                className="inline-block bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold py-4 px-8 rounded-lg transition text-lg mb-6"
              >
                Check for Pre-Qualified Offers
              </Link>

              <div className="mt-4">
                <p className="text-gray-500 text-sm mb-2">Not a Toast Capital Customer?</p>
                <Link
                  href="/quote"
                  className="text-[#1E3A8A] font-semibold flex items-center gap-2 hover:underline"
                >
                  Schedule Your Free Demo
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-video">
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

      {/* Financial Partner Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gray-50" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              A financial partner like no other
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We've been building alongside business owners for over a decade. Which means industry-specific nuances like seasonality don't scare us one bit. What else sets us apart?
            </p>
          </div>

          {/* Industry Expertise */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 lg:order-1">
              <Image
                src="https://ext.same-assets.com/2820641348/331200746.avif"
                alt="Industry expertise"
                width={500}
                height={400}
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Industry expertise</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">No credit score requirements:</span> We evaluate your business holistically and take industry-specific challenges like seasonality, into account.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Just one simple fixed fee:</span> No compounding interest, no personal guarantee, no giving up equity, no application fee or late fees.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">We expect the unexpected:</span> Our industry can be unpredictable, which is why repayments flex with your cash flow.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Fast and Flexible Loans */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Fast and flexible loans</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Apply in minutes:</span> Applying for a Toast Capital Loan takes just a few minutes. Plus there's no credit score impact, no credit score requirements, and no mountain of documents to dig up.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Next-day funding:</span> Once approved, you could receive funding as soon as the next business day after signing your loan agreement.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-600">
                    Send loan funds to your bank account so you can quickly cover payroll, inventory, or renovations.
                  </p>
                </li>
              </ul>
            </div>
            <div>
              <Image
                src="https://ext.same-assets.com/2820641348/1278487560.avif"
                alt="Fast and flexible loans"
                width={500}
                height={400}
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Easy Repayment */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Image
                src="https://ext.same-assets.com/2820641348/3968331115.avif"
                alt="Easy repayment"
                width={500}
                height={400}
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Easy repayment</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Daily or weekly payments - you choose:</span> Payments are made as a fixed percentage of your card transactions, with flexible daily or weekly options to fit your business.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Flexible payments:</span> On the days when your sales are higher, you will pay more than on days when your sales are lower.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Prepay and save:</span> Pay early and receive a discount on your total cost. No prepayment penalties.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Automated Daily Repayment Chart */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Flexible daily or weekly repayment
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            In our industry, unpredictability is, well, predictable. That's why Toast Capital Loan repayment flexes with your cash flow. Choose daily or weekly payments - on days when your sales are higher, you'll pay more than on days your sales are lower.
          </p>

          <InteractiveBarChart />
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Trusted by business owners like you
          </h2>

          <TestimonialsCarousel />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Already a business owner? Visit your personalized Toast Capital dashboard to see if you're pre-qualified for a loan today.
              </h2>
              <Link
                href="/quote"
                className="text-[#1E3A8A] font-semibold flex items-center gap-2 hover:underline"
              >
                Check eligibility
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <Image
                src="https://ext.same-assets.com/2820641348/878508799.avif"
                alt="Dashboard preview"
                width={400}
                height={300}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Get Started CTA */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get started today
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Talk to a funding expert today and learn how Toast Capital can help your business.
          </p>
          <Link
            href="/quote"
            className="inline-block bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold py-4 px-10 rounded-lg transition text-lg"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer - Toast Style */}
      <footer className="bg-white border-t">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Logo and Contact Info */}
            <div className="lg:col-span-1">
              <Link href="/">
                <Image src="/toast-capital-logo.png" alt="Toast Capital Logo" width={400} height={120} className="object-contain w-[140px] h-auto mb-6" />
              </Link>
              <div className="space-y-1 text-sm text-gray-600 mb-6">
                <p>333 Summer Street</p>
                <p>Boston, MA 02210</p>
              </div>
              <div className="space-y-1 text-sm mb-6">
                <p>
                  <a href="tel:617-533-3190" className="text-gray-600 hover:text-[#FF6B35]">
                    Sales: (617) 533-3190
                  </a>
                </p>
                <p>
                  <a href="tel:617-533-3190" className="text-gray-600 hover:text-[#FF6B35]">
                    Customer Care: (617) 533-3190
                  </a>
                </p>
              </div>
              {/* Social Icons */}
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>

            {/* Customers Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Customers</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">Sign In</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">System Status</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">Refer a Restaurant</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">Toast Central</a></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">Resource Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">POS Comparison</a></li>
              </ul>
            </div>

            {/* Products Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Products</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">Point of Sale</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">Software</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">Hardware</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">Integrations</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">Product Lifetime Policy</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">News</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">Leadership</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">Community</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">Investors</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#FF6B35] text-sm transition">Licenses</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Region and App Store Row */}
        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Region Selector */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Region: United States</span>
              </div>
              {/* App Store Badges */}
              <div className="flex items-center gap-3">
                <a href="#" className="block">
                  <Image src="https://ext.same-assets.com/2820641348/3711290340.png" alt="Download on App Store" width={120} height={40} className="h-10 w-auto" />
                </a>
                <a href="#" className="block">
                  <Image src="https://ext.same-assets.com/2820641348/2060743607.png" alt="Get it on Google Play" width={135} height={40} className="h-10 w-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                <Link href="/privacy" className="hover:text-gray-700 transition">Privacy Statement</Link>
                <Link href="/privacy" className="hover:text-gray-700 transition">California Privacy Statement</Link>
                <a href="#" className="hover:text-gray-700 transition">Manage Cookie Preferences</a>
                <a href="#" className="hover:text-gray-700 transition">Terms of Service</a>
                <a href="#" className="hover:text-gray-700 transition">Merchant Agreement</a>
                <a href="#" className="hover:text-gray-700 transition">Report IP</a>
                <a href="#" className="hover:text-gray-700 transition">Report a Vulnerability</a>
              </div>
              <p className="text-xs text-gray-500">&copy; 2026 Toast Capital, Inc.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
