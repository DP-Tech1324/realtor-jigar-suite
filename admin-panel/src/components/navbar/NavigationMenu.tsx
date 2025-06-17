
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';

interface NavigationMenuProps {
  className?: string;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ className }) => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  return (
    <ul className={cn("flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 text-realtor-navy", className)}>
      <li>
        <Link 
          to="/" 
          className={cn(
            "hover:text-realtor-gold transition-colors",
            location.pathname === '/' ? "text-realtor-gold font-semibold" : ""
          )}
        >
          Home
        </Link>
      </li>

      <li>
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(
            "flex items-center hover:text-realtor-gold transition-colors",
            location.pathname.includes('/listings') || location.pathname.includes('/properties') || location.pathname === '/rlp-search' || location.pathname === '/favorites' 
              ? "text-realtor-gold font-semibold" 
              : ""
          )}>
            Properties <ChevronDown className="h-4 w-4 ml-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white shadow-lg border">
            <DropdownMenuItem asChild>
              <Link to="/listings" className="w-full">Featured Listings</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>

      <li>
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(
            "flex items-center hover:text-realtor-gold transition-colors",
            location.pathname === '/services' ||
            location.pathname === '/property-sales' ||
            location.pathname === '/property-acquisition' ||
            location.pathname === '/relocation' ||
            location.pathname === '/investment' ||
            location.pathname === '/luxury' ||
            location.pathname === '/commercial'
              ? "text-realtor-gold font-semibold"
              : ""
          )}>
            Services <ChevronDown className="h-4 w-4 ml-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white shadow-lg border">
            <DropdownMenuItem asChild>
              <Link to="/services">Overview</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/property-sales">Property Sales</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/property-acquisition">Property Acquisition</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/relocation">Relocation Services</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/investment">Investment Properties</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/luxury">Luxury Properties</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/commercial">Commercial Real Estate</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
      
      <li>
        <Link 
          to="/about" 
          className={cn(
            "hover:text-realtor-gold transition-colors",
            location.pathname === '/about' ? "text-realtor-gold font-semibold" : ""
          )}
        >
          About
        </Link>
      </li>

      <li>
        <Link 
          to="/blog" 
          className={cn(
            "hover:text-realtor-gold transition-colors",
            location.pathname === '/blog' || location.pathname.includes('/blog/') ? "text-realtor-gold font-semibold" : ""
          )}
        >
          Blog
        </Link>
      </li>

      <li>
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(
            "flex items-center hover:text-realtor-gold transition-colors",
            location.pathname === '/resources' ||
            location.pathname.includes('/resources/') ||
            location.pathname === '/buyers' ||
            location.pathname === '/sellers' ||
            location.pathname === '/calculators' ||
            location.pathname === '/home-valuation'
              ? "text-realtor-gold font-semibold"
              : ""
          )}>
            Resources <ChevronDown className="h-4 w-4 ml-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white shadow-lg border">
            <DropdownMenuItem asChild>
              <Link to="/resources">All Resources</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/resources/for-buyers">For Buyers</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/resources/for-sellers">For Sellers</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/resources/mortgage-calculator">Mortgage Calculator</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/resources/home-valuation">Home Valuation</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
      
      <li>
        <Link 
          to="/contact" 
          className={cn(
            "hover:text-realtor-gold transition-colors",
            location.pathname === '/contact' ? "text-realtor-gold font-semibold" : ""
          )}
        >
          Contact
        </Link>
      </li>

    </ul>
  );
};

export default NavigationMenu;
