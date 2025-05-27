import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Wait for browser to restore scroll, then scroll to top
    const scrollToTop = () => window.scrollTo(0, 0);

    // Using requestAnimationFrame ensures scrollToTop happens after native scroll restoration
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTop);
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
