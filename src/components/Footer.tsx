import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
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
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1280px-Download_on_the_App_Store_Badge.svg.png" alt="Download on App Store" className="h-10 w-auto" />
              </a>
              <a href="#" className="block">
                <img src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" alt="Get it on Google Play" className="h-[60px] w-auto -my-2" />
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
  );
}
