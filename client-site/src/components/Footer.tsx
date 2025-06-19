import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Youtube,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

// Footer links (update as needed for your app's actual routes)
const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Jigar", href: "/#about" },
  { label: "Featured Listings", href: "/#listings" },
  { label: "For Buyers", href: "/buyers" },
  { label: "For Sellers", href: "/sellers" },
  { label: "Mortgage Calculator", href: "/calculators" },
];

const services = [
  { label: "Property Search", href: "/search" },
  { label: "Home Valuation", href: "/sellers/valuation" },
  //{ label: "Market Analysis", href: "/market-analysis" },
  //{ label: "Investment Properties", href: "/investment-properties" },
  { label: "First-Time Buyers", href: "/buyers/first-time-guide" },
  //{ label: "Luxury Homes", href: "/luxury-homes" },
];

const socials = [
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Linkedin, label: "LinkedIn" },
  { href: "#", icon: Youtube, label: "YouTube" },
];

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Smart smooth scroll for About Jigar link
  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const section = document.getElementById("about");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
    // If not on homepage, let the link work as normal (will go to /#about)
  };

  return (
    <footer
      id="contact"
      className="bg-gray-900 text-white font-sans border-t border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-4 shadow-md">
                <span className="text-white font-extrabold text-2xl tracking-wide">
                  JP
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">
                  Jigar Patel Real Estate
                </h3>
                <p className="text-gray-400 text-sm">
                  Your Trusted GTA Realtor
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-lg text-base">
              Helping families find their perfect home in the Greater Toronto Area.
              With years of experience and commitment to excellence, I'm here to guide
              you through every step of your real estate journey.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-blue-400" />
                <span className="text-base">(416) 555-0123</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-blue-400" />
                <span className="text-base">jigar@jigarpatelrealestate.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-blue-400" />
                <span className="text-base">Serving Greater Toronto Area</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-base">
              {quickLinks.map((link) =>
                link.label === "About Jigar" ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="footer-link"
                      onClick={handleAboutClick}
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="footer-link"
                    >
                      {link.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 tracking-wide">
              Services
            </h4>
            <ul className="space-y-2 text-base">
              {services.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="footer-link"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex space-x-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="footer-social"
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <div className="text-center md:text-right text-gray-400 text-sm">
              <p>
                &copy; 2024 <span className="font-semibold">Jigar Patel Real Estate</span>. All rights reserved.
              </p>
              <p className="mt-1">
                Licensed Real Estate Professional in Ontario
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Custom styles for link hover */}
      <style>
        {`
        .footer-link {
          color: #cbd5e1;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #fff;
          text-decoration: underline;
        }
        .footer-social {
          color: #94a3b8;
          transition: color 0.2s, transform 0.2s;
        }
        .footer-social:hover {
          color: #fff;
          transform: translateY(-2px) scale(1.1);
        }
        `}
      </style>
    </footer>
  );
};

export default Footer;
