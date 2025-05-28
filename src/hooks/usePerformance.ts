
import { useEffect } from 'react';

export const usePerformance = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // This would integrate with web-vitals library
      // For now, we'll use basic performance monitoring
    }
    
    // Monitor page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      if (process.env.NODE_ENV === 'development') {
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
      }
      
      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        // TODO: Send to analytics service
      }
    });
    
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
      
      return () => observer.disconnect();
    }
  }, []);
};
