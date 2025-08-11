import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that scrolls to top when route changes
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Using 'instant' for immediate scroll without animation
    });
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;


