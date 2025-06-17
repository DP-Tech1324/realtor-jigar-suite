
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component will scroll to the top whenever the route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Use smooth scrolling for a better user experience
    });
  }, [pathname]);
  
  return null; // This component doesn't render anything
};

export default ScrollToTop;
