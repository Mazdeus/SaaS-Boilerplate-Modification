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
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    left: false,
    right: false,
  });

  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
