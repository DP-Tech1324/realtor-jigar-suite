
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ServicesLinkProps {
  serviceId: string;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'xl';
  className?: string;
  children?: React.ReactNode;
}

const ServicesLink: React.FC<ServicesLinkProps> = ({ 
  serviceId, 
  variant = 'default', 
  size = 'default',
  className = '',
  children = 'Learn More' 
}) => {
  return (
    <Button 
      variant={variant === 'outline' ? 'outline' : 'realtor'} 
      size={size}
      className={className}
      asChild
    >
      <Link to={`/services/${serviceId}`}>
        {children}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
};

export default ServicesLink;
