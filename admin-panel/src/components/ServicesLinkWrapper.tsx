
import React from 'react';
import ServicesLink from './ServicesLink';

/**
 * This component adds functionality to the Services' "Learn More" buttons
 * by replacing them with working links to individual service pages.
 * 
 * It must be included in ServicesPage.tsx and Index.tsx after the Services component.
 */
const ServicesLinkWrapper: React.FC = () => {
  // Run once when component mounts
  React.useEffect(() => {
    // Find all service cards
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Replace buttons with working links
    serviceCards.forEach(card => {
      // Get the title text to determine which service it is
      const titleElement = card.querySelector('h3');
      if (!titleElement) return;
      
      const title = titleElement.textContent?.trim().toLowerCase();
      
      // Find the button in this card
      const button = card.querySelector('button');
      if (!button) return;
      
      // Create the appropriate service link based on the title
      if (title?.includes('property sales')) {
        const link = document.createElement('a');
        link.href = '/services/property-sales';
        link.className = button.className;
        link.innerHTML = button.innerHTML;
        button.replaceWith(link);
      }
      else if (title?.includes('property acquisition')) {
        const link = document.createElement('a');
        link.href = '/services/property-acquisition';
        link.className = button.className;
        link.innerHTML = button.innerHTML;
        button.replaceWith(link);
      }
      else if (title?.includes('relocation')) {
        const link = document.createElement('a');
        link.href = '/services/relocation-services';
        link.className = button.className;
        link.innerHTML = button.innerHTML;
        button.replaceWith(link);
      }
      // Add more service links as needed
    });
    
    // Fix "View All Services" button if it exists - using standard DOM methods instead of :contains
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (button.textContent?.includes('View All Services')) {
        const link = document.createElement('a');
        link.href = '/services';
        link.className = button.className;
        link.innerHTML = button.innerHTML;
        button.replaceWith(link);
      }
    });
    
  }, []);
  
  return null; // This is a utility component that doesn't render anything
};

export default ServicesLinkWrapper;
