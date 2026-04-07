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
import Footer from '@/components/Footer';

// Check if currently within business hours (Mon-Fri 9am-6pm ET)
function isBusinessHours(): boolean {
  const now = new Date();
  // Convert to ET timezone
  const etTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day = etTime.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = etTime.getHours();

  // Monday-Friday (1-5), 9am-6pm (9-17)
  const isWeekday = day >= 1 && day <= 5;
  const isWithinHours = hour >= 9 && hour < 18;

  return isWeekday && isWithinHours;
}

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
  const [repaymentPercent, setRepaymentPercent] = useState<number>(10);

  const dailyData = [
    { label: 'Sunday', sales: 3850 },
    { label: 'Monday', sales: 3550 },
    { label: 'Tuesday', sales: 3590 },
    { label: 'Wednesday', sales: 4280 },
    { label: 'Thursday', sales: 5220 },
    { label: 'Friday', sales: 5890 },
    { label: 'Saturday', sales: 6200 },
  ];

  const weeklyData = [
    { label: 'Week 1', sales: 28500 },
    { label: 'Week 2', sales: 32100 },
    { label: 'Week 3', sales: 29800 },
    { label: 'Week 4', sales: 35600 },
  ];

  const percentageOptions = [3, 5, 10];
  const chartData = viewMode === 'daily' ? dailyData : weeklyData;
  const maxSales = Math.max(...chartData.map(d => d.sales));
  const getPayment = (sales: number) => Math.round(sales * (repaymentPercent / 100));

  useEffect(() => {
    setSelectedBar(null);
  }, [viewMode]);

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center">
      {/* Toggle Switch */}
      <div className="flex items-center gap-2 mb-8 bg-gray-100 p-1.5 rounded-full">
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

      {/* Chart Container */}
      <div className="w-full max-w-4xl bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 relative">
        <div className="flex items-end justify-between gap-3 md:gap-6 mb-4 relative" style={{ height: '340px' }}>
          {chartData.map((d, i) => {
            const heightPercent = (d.sales / maxSales) * 100;
            const payment = getPayment(d.sales);
            const paymentHeightPercent = (payment / maxSales) * 100;
            const isSelected = selectedBar === i;
            // Check if weekend (Sunday = index 0, Saturday = index 6) in daily view
            const isWeekend = viewMode === 'daily' && (i === 0 || i === 6);
            return (
              <div
                key={i}
                className={`flex-1 flex items-end justify-center gap-1 group relative ${isWeekend ? 'cursor-default' : 'cursor-pointer'}`}
                style={{ height: '100%' }}
                onClick={() => !isWeekend && setSelectedBar(isSelected ? null : i)}
              >
                {/* Sales bar */}
                <div
                  className={`relative rounded-t-lg transition-all duration-300 ${
                    isWeekend ? '' : (isSelected ? 'shadow-lg scale-105' : 'group-hover:opacity-80')
                  }`}
                  style={{
                    width: viewMode === 'daily' ? (isWeekend ? '80%' : '60%') : '55%',
                    height: `${heightPercent}%`,
                    minHeight: '20px',
                    background: isWeekend
                      ? 'linear-gradient(180deg, #D1D5DB 0%, #9CA3AF 100%)'
                      : (isSelected
                        ? 'linear-gradient(180deg, #FF8F6B 0%, #FF6B35 100%)'
                        : 'linear-gradient(180deg, #FFB49A 0%, #FF9B7A 100%)'),
                    boxShadow: isWeekend ? 'none' : (isSelected ? '0 4px 20px rgba(255, 107, 53, 0.4)' : '0 2px 8px rgba(0,0,0,0.1)'),
                  }}
                >
                  {/* Plus icon - only show for non-weekend days */}
                  {!isWeekend && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-sm font-bold shadow-md opacity-100">
                      +
                    </div>
                  )}
                  {/* Bank Closed indicator for weekends */}
                  {isWeekend && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">No Payment</span>
                    </div>
                  )}
                </div>
                {/* Payment bar - only show for non-weekend days */}
                {!isWeekend && (
                  <div
                    className={`rounded-t-lg transition-all duration-300 ${isSelected ? 'scale-105' : ''}`}
                    style={{
                      width: viewMode === 'daily' ? '35%' : '40%',
                      height: `${paymentHeightPercent}%`,
                      minHeight: '10px',
                      background: isSelected
                        ? 'linear-gradient(180deg, #E85A30 0%, #C84520 100%)'
                        : 'linear-gradient(180deg, #FF7A50 0%, #E86840 100%)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                    }}
                  />
                )}

                {/* Popup ABOVE the bar */}
                {isSelected && (
                  <div
                    className="absolute z-20 animate-fade-in"
                    style={{
                      bottom: `${Math.min(heightPercent + 12, 92)}%`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      minWidth: '220px',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 relative">
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedBar(null); }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs font-bold"
                      >
                        X
                      </button>
                      <div className="text-center mb-3">
                        <div className="text-sm font-bold text-gray-900">{d.label}</div>
                      </div>
                      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded" style={{ background: 'linear-gradient(180deg, #FFB49A 0%, #FF9B7A 100%)' }}></div>
                          <span className="text-xs text-gray-600">Sales:</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">${d.sales.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded" style={{ background: 'linear-gradient(180deg, #FF7A50 0%, #E86840 100%)' }}></div>
                          <span className="text-xs text-gray-600">Payment:</span>
                        </div>
                        <span className="text-lg font-bold text-[#E85A30]">${getPayment(d.sales).toLocaleString()}</span>
                      </div>
                      {/* Percentage Options */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500 text-center mb-2">Repayment Rate:</div>
                        <div className="flex justify-center gap-2">
                          {percentageOptions.map((pct) => (
                            <button
                              key={pct}
                              onClick={(e) => { e.stopPropagation(); setRepaymentPercent(pct); }}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                repaymentPercent === pct
                                  ? 'bg-[#FF6B35] text-white shadow-md'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {pct}%
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Day Labels */}
        <div className="flex justify-between gap-2 md:gap-4 border-t border-gray-200 pt-4">
          {chartData.map((d, i) => {
            const isWeekend = viewMode === 'daily' && (i === 0 || i === 6);
            return (
              <div
                key={i}
                className={`flex-1 text-center text-xs md:text-sm font-medium transition-colors ${
                  isWeekend ? 'text-gray-400' : (selectedBar === i ? 'text-[#FF6B35]' : 'text-gray-500')
                }`}
              >
                {viewMode === 'daily' ? d.label.slice(0, 3) : d.label}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(180deg, #FFB49A 0%, #FF9B7A 100%)' }}></div>
            <span className="text-sm text-gray-600">{viewMode === 'daily' ? 'Daily' : 'Weekly'} Card Sales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(180deg, #FF7A50 0%, #E86840 100%)' }}></div>
            <span className="text-sm text-gray-600">{viewMode === 'daily' ? 'Daily' : 'Weekly'} Loan Repayment</span>
          </div>
          {viewMode === 'daily' && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(180deg, #D1D5DB 0%, #9CA3AF 100%)' }}></div>
              <span className="text-sm text-gray-600">Weekend (Bank Closed)</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-400 mt-4">Click any bar to see details and adjust repayment rate</p>
    </div>
  );
}

export default function FakeErrorPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-start justify-start p-8 md:p-24 font-sans">
      {/* Sad document icon */}
      <div className="mb-6">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4C9.79 4 8 5.79 8 8V40C8 42.21 9.79 44 12 44H36C38.21 44 40 42.21 40 40V16L28 4H12Z" fill="none" stroke="#646464" strokeWidth="2"/>
          <path d="M28 4V16H40" fill="none" stroke="#646464" strokeWidth="2"/>
          <circle cx="18" cy="26" r="2" fill="#646464"/>
          <circle cx="30" cy="26" r="2" fill="#646464"/>
          <path d="M18 34C18 34 21 31 24 31C27 31 30 34 30 34" stroke="#646464" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Main heading */}
      <h1 className="text-[21px] font-normal text-[#202124] mb-2">
        This site can't be reached
      </h1>

      {/* Subtext */}
      <p className="text-[14px] text-[#5f6368] mb-2">
        Check if there is a typo in <span className="font-medium">toastcapital.com</span>.
      </p>

      {/* Error code */}
      <p className="text-[12px] text-[#70757a] mb-8">
        DNS_PROBE_FINISHED_NXDOMAIN
      </p>

      {/* Reload button */}
      <div className="mt-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[14px] font-medium py-2 px-6 rounded-full transition"
        >
          Reload
        </button>
      </div>
    </div>
  );
}
