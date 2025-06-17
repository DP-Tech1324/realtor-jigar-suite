
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white font-bold text-xl">JP</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Jigar Patel Real Estate</h3>
                <p className="text-gray-400">Your Trusted GTA Realtor</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              Helping families find their perfect home in the Greater Toronto Area. 
              With years of experience and commitment to excellence, I'm here to guide 
              you through every step of your real estate journey.
            </p>

            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-blue-400" />
                <span>(416) 555-0123</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-blue-400" />
                <span>jigar@jigarpatelrealestate.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-blue-400" />
                <span>Serving Greater Toronto Area</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">About Jigar</a></li>
              <li><a href="#listings" className="text-gray-300 hover:text-white transition-colors">Featured Listings</a></li>
              <li><a href="#buyers" className="text-gray-300 hover:text-white transition-colors">For Buyers</a></li>
              <li><a href="#sellers" className="text-gray-300 hover:text-white transition-colors">For Sellers</a></li>
              <li><a href="#calculator" className="text-gray-300 hover:text-white transition-colors">Mortgage Calculator</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Property Search</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Home Valuation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Market Analysis</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Investment Properties</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">First-Time Buyers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Luxury Homes</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
            
            <div className="text-center md:text-right text-gray-400 text-sm">
              <p>&copy; 2024 Jigar Patel Real Estate. All rights reserved.</p>
              <p className="mt-1">Licensed Real Estate Professional in Ontario</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
