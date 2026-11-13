import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const NAV = [
  { label: "Home", href: "/", children: [] },
  {
    label: "Listings", href: "/listings", children: [
      { label: "Residential Search", href: "/listings?category=residential" },
      { label: "Commercial Search", href: "/listings?category=commercial&propertyType=commercial" },
      { label: "Featured Listings", href: "/listings?featured=1" },
      { label: "Pre-Construction Condos", href: "/pre-construction" },
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
    label: "Resources", href: "/calculators", children: [
      { label: "Calculators", href: "/calculators" },
      { label: "Blog & Articles", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "All Tools", href: "/calculators" },
    ]
  }
];

export default function ClassicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<number | null>(null);

  // This is the combined height of your TaglineBar + AgentBar (adjust if needed)
  const HEADER_HEIGHT = 160; // px

  // A menu is active when the current page is its page or one of its sub-pages
  const isActive = (item: (typeof NAV)[number]) =>
    [item.href, ...item.children.map((c) => c.href)].some((href) => href.split("?")[0] === location.pathname) ||
    (item.label === "Listings" && ["/search", "/listings", "/pre-construction"].includes(location.pathname));

  const go = (href: string) => {
    setOpenDropdown(null);
    navigate(href);
  };

  return (
    <nav
      className="w-full bg-white shadow-md border-b border-slate-200 font-sans z-40 sticky top-0"
      style={{ zIndex: 40 }}
    >
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

        {/* Desktop NAV */}
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
                    ${isActive(item)
                      ? "border-b-2 border-blue-600 text-blue-700 bg-slate-100"
                      : "text-slate-900 hover:bg-slate-100"}`}
                  style={{
                    minWidth: 120,
                    fontSize: "16px",
                    letterSpacing: ".02em",
                    borderBottom: isActive(item)
                      ? "2.5px solid #2563eb"
                      : "2.5px solid transparent",
                  }}
                  aria-expanded={item.children.length ? openDropdown === idx : undefined}
                  onClick={() => {
                    // Tap opens the submenu on touch screens, where there is no hover. It never
                    // toggles closed here: on desktop the hover has already opened it.
                    if (item.children.length) setOpenDropdown(idx);
                    else go(item.href);
                  }}
                >
                  {item.label}
                  {!!item.children.length && (
                    <span className="ml-1 text-xs">&#x25BC;</span>
                  )}
                </button>
                {/* Dropdown */}
                {!!item.children.length && openDropdown === idx && (
                  <div className="absolute left-0 top-full mt-0 bg-white border border-slate-200 rounded shadow-xl min-w-[240px] z-50">
                    <ul>
                      {item.children.map((sub) => (
                        <li key={sub.label}>
                          <button
                            className="w-full text-left px-7 py-2 text-base hover:bg-blue-50 transition font-normal"
                            onClick={() => go(sub.href)}
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
        <div
          className="lg:hidden absolute left-0 w-full z-[99] bg-white shadow-xl border-t"
          style={{
            // put right below the header
            top: `58px`,
          }}
        >
          <div className="flex flex-col gap-2 p-4">
            {NAV.map((item, idx) => (
              <div key={item.label}>
                <button
                  className={`w-full flex items-center justify-between px-2 py-3 text-base font-semibold ${
                    isActive(item) ? "text-blue-700" : "text-slate-900"
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
      )}
    </nav>
  );
}
