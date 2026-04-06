// app/components/ScrollReveal.tsx
'use client'; 

import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ 
  children, 
  delay = "" 
}: { 
  children: React.ReactNode; 
  delay?: string; 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (domRef.current) observer.unobserve(domRef.current);
        }
      });
    }, { 
      threshold: 0.1 
    });

    if (domRef.current) observer.observe(domRef.current);

    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-opacity duration-300 ${isVisible ? `animate-fade-in-up ${delay}` : 'opacity-0'}`}
    >
      {children}
    </div>
  );
}