'use client';

import { useState, useEffect } from 'react';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // الدالة دي بتشتغل لما كل محتوى الصفحة (صور، خلفيات، خطوط) يكتمل تحميله
    const handleLoad = () => {
      setIsFading(true); // نبدأ تأثير الاختفاء الناعم
      setTimeout(() => setIsLoading(false), 500); // نشيل الشاشة خالص بعد نص ثانية
    };

    // لو الصفحة متحملة جاهزة (من الكاش مثلاً)
    if (document.readyState === 'complete') {
      setTimeout(handleLoad, 300);
    } else {
      // لو لسه بتحمل، نستنى لحد ما تخلص
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#0F172A] flex flex-col items-center justify-center transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      dir="rtl"
    >
      {/* حركة الأيقونة (دوائر بتلف زي إشارة الشبكة) */}
      <div className="relative flex justify-center items-center w-24 h-24 mb-6">
        <div className="absolute w-full h-full border-4 border-transparent border-t-[#E47B15] rounded-full animate-spin"></div>
        <div className="absolute w-16 h-16 border-4 border-transparent border-r-white/20 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
        <div className="absolute w-10 h-10 border-4 border-transparent border-b-[#E47B15] rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
        
        {/* أيقونة واي فاي في المنتصف */}
        <svg className="w-5 h-5 text-[#E47B15] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      </div>

      {/* النص */}
      <h2 className="text-white text-2xl font-extrabold tracking-wider animate-pulse mb-2">الشبكة الذكية</h2>
      <p className="text-gray-400 text-sm font-medium tracking-wide">جاري تهيئة النظام...</p>
    </div>
  );
}