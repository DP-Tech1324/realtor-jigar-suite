import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import NavigationMenu from './NavigationMenu';

interface MobileMenuProps {
  isOpen: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen }) => {
  const { isAdmin, userRole, user } = useAuth();

  return (
    <nav
      className={cn(
        "fixed md:static top-[72px] left-0 w-full h-[calc(100vh-72px)] md:h-auto md:w-auto md:flex bg-white md:bg-transparent overflow-y-auto md:overflow-visible transition-transform duration-300 transform",
        isOpen ? "translate-x-0 shadow-lg" : "translate-x-full md:translate-x-0"
      )}
      aria-hidden={!isOpen}
      aria-label="Mobile navigation menu"
    >
      <div className="w-full flex flex-col h-full justify-between">
        <div>
          <NavigationMenu className="p-6 md:p-0" />

          {/* OPTIONAL: Avatar and Role Display */}
          {/* 
          <div className="px-6 mt-4 flex flex-col items-center">
            <div className="text-sm font-medium text-gray-700">
              {user?.email}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              Role: {userRole}
            </div>
          </div> 
          */}
        </div>

        {/* CTA Buttons at Bottom */}
        <div className="p-6 border-t md:hidden space-y-2">
          <Button className="bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy w-full">
            <Link to="/contact">Contact Agent</Link>
          </Button>

        </div>
      </div>
    </nav>
  );
};

export default MobileMenu;
