
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  bgImage?: string;
  imageSlider?: string[];
  showCta?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  bgImage = "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3",
  imageSlider,
  showCta = false,
  ctaText = "Learn More",
  ctaLink = "#"
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Only set up the interval if we're using the image slider
  useEffect(() => {
    if (!imageSlider || imageSlider.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => 
        prevIndex === imageSlider.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, [imageSlider]);

  // Determine which image to use
  const backgroundImage = imageSlider && imageSlider.length > 0 
    ? imageSlider[currentImageIndex] 
    : bgImage;

  return (
    <div className="relative bg-realtor-navy py-28">
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 transition-opacity duration-1000 ease-in-out"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        ></div>
      )}
      
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-realtor-navy/90 to-realtor-navy/70"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in mb-8" 
               style={{ animationDelay: '0.2s' }}>
              {subtitle}
            </p>
          )}
          
          {showCta && (
            <Button 
              className="bg-realtor-gold hover:bg-realtor-gold/90 text-realtor-navy flex items-center gap-2 mx-auto animate-fade-in"
              style={{ animationDelay: '0.4s' }}
              asChild
            >
              <a href={ctaLink}>
                {ctaText}
                <ArrowRight size={16} />
              </a>
            </Button>
          )}
        </div>
        
        {imageSlider && imageSlider.length > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {imageSlider.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? 'bg-realtor-gold' : 'bg-white/50'
                } transition-colors`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
