import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const NAV = [
  { label: "Home", href: "/", children: [] },
  {
    label: "Listings", href: "/search", children: [
      { label: "Residential Search", href: "/search?type=residential" },
      { label: "Commercial Search", href: "/search?type=commercial" },
      { label: "Pre-Construction Condo List", href: "/precon-list" },
      { label: "Pre-Construction Condo Finder", href: "/precon-finder" },
      { label: "Featured Listings", href: "/#listings" },
    ]
  },
  {
    label: "Buying", href: "/buyers", children: [
      { label: "Buyers Guide", href: "/buyers" },
      { label: "Financing Options", href: "/buyers/financing-options" },
      { label: "First-Time Buyers", href: "/buyers/first-time-guide" },
      { label: "Buying Process", href: "/buyers/home-buying-process" },
    ]
  },
  {
    label: "Selling", href: "/sellers", children: [
      { label: "Sellers Guide", href: "/sellers" },
      { label: "Home Valuation", href: "/sellers/valuation" },
      { label: "Marketing Strategy", href: "/sellers/marketing-strategy" },
      { label: "Staging Tips", href: "/sellers/staging-tips" },
    ]
  },
  { label: "Map Search", href: "/map-search", children: [] },
  { label: "Contact Me", href: "/contact", children: [] },
  {
    label: "Useful Tools", href: "/tools", children: [
      { label: "Calculators", href: "/calculators" },
      { label: "Blog & Articles", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "All Tools", href: "/tools" },
    ]
  }
];

export default function ClassicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<number | null>(null);

  // Adjust this to match your tagline height exactly (in px)
  const TAGLINE_HEIGHT = 44;

  // Active link highlight logic
  const isActive = (href) =>
    href === "/#listings"
      ? location.hash === "#listings"
      : location.pathname === href;

  return (
    <nav className={`w-full bg-white shadow-md border-b border-slate-200 font-sans z-40 relative mt-[${TAGLINE_HEIGHT}px]`}>
      <div className="max-w-[1240px] mx-auto flex items-center h-[58px] px-2">

        {/* Hamburger (mobile only) */}
        <button
          className="flex items-center mr-3 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close Menu" : "Open Menu"}
        >
          {mobileOpen ? (
            <XMarkIcon className="h-7 w-7 text-slate-700" />
          ) : (
            <Bars3Icon className="h-7 w-7 text-slate-700" />
          )}
        </button>

        {/* Desktop NAV (horizontal, visible on lg+) */}
        <div className="flex-1 justify-center hidden lg:flex">
          <ul className="flex items-center gap-1">
            {NAV.map((item, idx) => (
              <li
                key={item.label}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(idx)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`px-5 py-3 text-base font-semibold bg-transparent transition
                    ${isActive(item.href)
                      ? "border-b-2 border-blue-600 text-blue-700 bg-slate-100"
                      : "text-slate-900 hover:bg-slate-100"}`}
                  style={{
                    minWidth: 120,
                    fontSize: "16px",
                    letterSpacing: ".02em",
                    borderBottom: isActive(item.href)
                      ? "2.5px solid #2563eb"
                      : "2.5px solid transparent",
                  }}
                  onClick={() => {
                    if (!item.children.length) navigate(item.href);
                  }}
                >
                  {item.label}
                  {!!item.children.length && (
                    <span className="ml-1 text-xs">&#x25BC;</span>
                  )}
                </button>
                {/* Dropdown (desktop only) */}
                {!!item.children.length && openDropdown === idx && (
                  <div className="absolute left-0 top-full mt-0 bg-white border border-slate-200 rounded shadow-xl min-w-[240px] z-50">
                    <ul>
                      {item.children.map((sub) => (
                        <li key={sub.label}>
                          <button
                            className="w-full text-left px-7 py-2 text-base hover:bg-blue-50 transition font-normal"
                            onClick={() => navigate(sub.href)}
                          >
                            {sub.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Auth button (desktop only) */}
        <div className="hidden lg:block ml-8 shrink-0">
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[90]">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar - starts just below the tagline */}
          <div
            className={`fixed top-[${TAGLINE_HEIGHT}px] left-0 h-[calc(100vh-${TAGLINE_HEIGHT}px)] w-72 bg-white shadow-xl z-[100] transition-transform`}
            style={{
              boxShadow: "0 4px 32px 0 rgba(0,0,0,.12)"
            }}
          >
            <div className="flex flex-col gap-4 p-5">
              {NAV.map((item, idx) => (
                <div key={item.label}>
                  <button
                    className={`w-full flex items-center justify-between px-2 py-3 text-base font-semibold ${
                      isActive(item.href) ? "text-blue-700" : "text-slate-900"
                    }`}
                    onClick={() => {
                      if (item.children.length) {
                        setMobileDropdown(mobileDropdown === idx ? null : idx);
                      } else {
                        setMobileOpen(false);
                        navigate(item.href);
                      }
                    }}
                  >
                    {item.label}
                    {!!item.children.length && (
                      <span className="ml-2">
                        {mobileDropdown === idx ? "▲" : "▼"}
                      </span>
                    )}
                  </button>
                  {!!item.children.length && mobileDropdown === idx && (
                    <ul className="pl-4">
                      {item.children.map((sub) => (
                        <li key={sub.label}>
                          <button
                            className="w-full text-left py-2 px-2 text-[15px] text-slate-700 hover:bg-blue-50"
                            onClick={() => {
                              setMobileOpen(false);
                              navigate(sub.href);
                            }}
                          >
                            {sub.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {/* Auth button mobile */}
              <button
                className="mt-6 w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/auth");
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
