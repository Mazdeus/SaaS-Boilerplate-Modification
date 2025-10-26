/**
 * useSidebar Hook
 * State management for collapsible sidebar
 * Part of Layout & Partial System - Templating Praktikum
 */

import { useCallback, useEffect, useState } from 'react';

type SidebarPosition = 'left' | 'right';
type SidebarState = {
  left: boolean;
  right: boolean;
};

export function useSidebar() {
  // Initialize with false to avoid SSR issues (window not available on server)
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    left: false,
    right: false,
  });

  // Detect mobile/desktop and set initial sidebar state AFTER mount
  useEffect(() => {
    const checkMobileAndSetInitialState = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);

      // Set initial sidebar state based on screen size
      setSidebarState({
        left: !mobile, // Auto-open on desktop
        right: !mobile, // Auto-open on desktop
      });
    };

    // Run once on mount to set initial state
    checkMobileAndSetInitialState();

    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []); // Run only once on mount

  // Toggle sidebar
  const toggleSidebar = useCallback((position: SidebarPosition) => {
    setSidebarState(prev => ({
      ...prev,
      [position]: !prev[position],
    }));
  }, []);

  // Open sidebar
  const openSidebar = useCallback((position: SidebarPosition) => {
    setSidebarState(prev => ({
      ...prev,
      [position]: true,
    }));
  }, []);

  // Close sidebar
  const closeSidebar = useCallback((position: SidebarPosition) => {
    setSidebarState(prev => ({
      ...prev,
      [position]: false,
    }));
  }, []);

  // Close all sidebars
  const closeAllSidebars = useCallback(() => {
    setSidebarState({
      left: false,
      right: false,
    });
  }, []);

  // Check if sidebar is open
  const isSidebarOpen = useCallback(
    (position: SidebarPosition) => {
      return sidebarState[position];
    },
    [sidebarState],
  );

  return {
    sidebarState,
    isMobile,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    closeAllSidebars,
    isSidebarOpen,
  };
}
