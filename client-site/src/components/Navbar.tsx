import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { MenuIcon, XIcon } from "@heroicons/react/outline"; // use own SVG if you don't want to install

const NAV = [/* ...your NAV structure... */];

export default function ClassicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<number | null>(null);

  const isActive = (href) =>
    href === "/#listings" ? location.hash === "#listings" : location.pathname === href;

  return (
    <nav className="w-full bg-white shadow-md border-b border-slate-200 font-sans z-40 relative">
      {/* Top Bar */}
      <div className="max-w-[1240px] mx-auto flex items-center h-[58px] px-2">
        {/* Hamburger (mobile only) */}
        <button
          className="lg:hidden flex items-center mr-3"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <XIcon className="h-7 w-7 text-slate-700" />
          ) : (
            <MenuIcon className="h-7 w-7 text-slate-700" />
          )}
        </button>

        {/* Centered NAV (desktop) */}
        <div className="hidden lg:flex flex-1 justify-center">
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

        {/* Auth right (desktop) */}
        <div className="hidden lg:block ml-8 shrink-0">
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50">
          <div className="bg-white shadow-xl h-full w-72 p-5">
            <div className="flex flex-col gap-4">
              {NAV.map((item, idx) => (
                <div key={item.label}>
                  <button
                    className={`w-full flex items-center justify-between px-2 py-3 text-base font-semibold ${
                      isActive(item.href)
                        ? "text-blue-700"
                        : "text-slate-900"
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
                      <span className="ml-2">{mobileDropdown === idx ? "▲" : "▼"}</span>
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
