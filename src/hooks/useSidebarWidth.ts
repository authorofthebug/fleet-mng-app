'use client';

import { useEffect } from 'react';

/**
 * Hook to set a CSS variable for the sidebar width
 * This allows us to position modals correctly regardless of sidebar state
 */
export function useSidebarWidth() {
  useEffect(() => {
    const updateSidebarWidth = () => {
      // Find the sidebar element
      const sidebar = document.querySelector('[class*="bg-gradient-to-b from-blue-600 to-blue-800"]');
      
      if (sidebar) {
        // Get the computed width
        const width = window.getComputedStyle(sidebar).width;
        
        // Set it as a CSS variable
        document.documentElement.style.setProperty('--sidebar-width', width);
      }
    };

    // Initial update
    updateSidebarWidth();

    // Set up a mutation observer to detect sidebar width changes
    const observer = new MutationObserver(updateSidebarWidth);
    
    const sidebar = document.querySelector('[class*="bg-gradient-to-b from-blue-600 to-blue-800"]');
    if (sidebar) {
      observer.observe(sidebar, { 
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    }

    // Also update on window resize
    window.addEventListener('resize', updateSidebarWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSidebarWidth);
    };
  }, []);
}
