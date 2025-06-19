import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import TaglineBar from "./TaglineBar";

const NAV = [
  {
    label: "Home",
    href: "/",
    children: [],
  },
  {
    label: "Listings",
    href: "/search",
    children: [
      { label: "Residential Search", href: "/search?type=residential" },
      { label: "Commercial Search", href: "/search?type=commercial" },
      { label: "Pre-Construction Condo List", href: "/precon-list" },
      { label: "Pre-Construction Condo Finder", href: "/precon-finder" },
      { label: "Featured Listings", href: "/#listings" },
    ],
  },
  {
    label: "Buying",
    href: "/buyers",
    children: [
      { label: "Buyers Guide", href: "/buyers" },
      { label: "Financing Options", href: "/buyers/financing-options" },
      { label: "First-Time Buyers", href: "/buyers/first-time-guide" },
      { label: "Buying Process", href: "/buyers/home-buying-process" },
    ],
  },
  {
    label: "Selling",
    href: "/sellers",
    children: [
      { label: "Sellers Guide", href: "/sellers" },
      { label: "Home Valuation", href: "/sellers/valuation" },
      { label: "Marketing Strategy", href: "/sellers/marketing-strategy" },
      { label: "Staging Tips", href: "/sellers/staging-tips" },
    ],
  },
  {
    label: "Map Search",
    href: "/map-search",
    children: [],
  },
  {
    label: "Contact Me",
    href: "/contact",
    children: [],
  },
  {
    label: "Useful Tools",
    href: "/tools",
    children: [
      { label: "Calculators", href: "/calculators" },
      { label: "Blog & Articles", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "All Tools", href: "/tools" },
    ],
  },
];

export default function ClassicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Check if nav is active
  const isActive = (href: string) =>
    href === "/#listings" ? location.hash === "#listings" : location.pathname === href;

  return (
    <div>
      
      
      <nav className="w-full bg-white shadow-md border-b border-slate-200 font-sans" style={{fontFamily: "'Open Sans', Arial, sans-serif"}}>
        <div className="max-w-[1240px] mx-auto flex items-center h-[58px] px-2">
         
          {/* Centered NAV */}
          <div className="flex-1 flex justify-center">
            <ul className="flex items-center gap-1">
              {NAV.map((item, idx) => (
                <li
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(idx)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`px-7 py-[14px] text-base font-semibold rounded-none border-0 bg-transparent transition
                      ${isActive(item.href)
                        ? "border-b-2 border-blue-600 text-blue-700 bg-slate-100"
                        : "text-slate-900 hover:bg-slate-100"}
                    `}
                    style={{
                      minWidth: 120,
                      height: 56,
                      fontFamily: "'Open Sans', Arial, sans-serif",
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
                  {/* Dropdown */}
                  {!!item.children.length && openDropdown === idx && (
                    <div className="absolute left-0 top-full mt-0 bg-white border border-slate-200 rounded shadow-xl min-w-[240px] z-50">
                      <ul>
                        {item.children.map((sub) => (
                          <li key={sub.label}>
                            <button
                              className="w-full text-left px-7 py-2 text-base hover:bg-blue-50 transition font-normal"
                              style={{fontFamily: "'Open Sans', Arial, sans-serif"}}
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
          {/* Auth right (optional) */}
          <div className="ml-8 shrink-0">
            <button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
              style={{fontFamily: "'Open Sans', Arial, sans-serif"}}
              onClick={() => navigate("/auth")}
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
