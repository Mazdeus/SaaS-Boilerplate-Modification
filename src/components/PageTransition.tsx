'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    // When pathname changes, fade out
    setTransitionStage('fadeOut');
  }, [pathname]);

  useEffect(() => {
    if (transitionStage === 'fadeOut') {
      const timer = setTimeout(() => {
        // Update children and start fading in
        setDisplayChildren(children);
        setTransitionStage('fadeIn');
      }, 300); // Wait for fade out to complete

      return () => clearTimeout(timer);
    }
  }, [transitionStage, children]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        transitionStage === 'fadeOut' 
          ? 'opacity-0 scale-95' 
          : 'opacity-100 scale-100'
      }`}
    >
      {displayChildren}
    </div>
  );
}
