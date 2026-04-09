'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        // تم تغيير الخلفية هنا إلى الأزرق الداكن #0F172A
        <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0F172A] border-b-4 border-[#E47B15] shadow-lg" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">

                <Link href="/" className="flex items-center gap-3 z-50" onClick={closeMenu}>
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <Image src="/images/logo.png" alt="شعار الشبكة الذكية" width={40} height={40} className="object-contain p-1" priority />
                    </div>
                    <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                        TOURK
                    </span>
                </Link>

                <nav className="hidden md:flex gap-8 font-medium text-base text-gray-200">
                    <Link href="/" className="hover:text-[#F08A24] transition-colors duration-300">الرئيسية</Link>
                    <Link href="/#about" className="hover:text-[#F08A24] transition-colors duration-300">من نحن</Link>
                    <Link href="/#features" className="hover:text-[#F08A24] transition-colors duration-300">مميزاتنا</Link>
                    <Link href="/#clients" className="hover:text-[#F08A24] transition-colors duration-300">عملائنا</Link>
                    <Link href="/packages" className="hover:text-[#F08A24] transition-colors duration-300">الباقات</Link>
                    <Link href="/digital-menu" className="hover:text-[#F08A24] transition-colors duration-300">كروت الانترنت</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/customize" className="hidden sm:flex bg-[#E47B15] hover:bg-[#C9680E] text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold transition-all duration-300 shadow-md text-xs sm:text-sm items-center gap-2">
                        <span>طلب تسعيرة</span>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Link>

                    <button
                        className="md:hidden text-white hover:text-[#F08A24] focus:outline-none p-2 z-50"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                // تم تغيير خلفية القائمة المنسدلة إلى #0B1120
                <div className="md:hidden absolute top-full left-0 w-full bg-[#0B1120] border-b-4 border-[#E47B15] shadow-xl animate-fade-in">
                    <nav className="flex flex-col px-6 py-6 space-y-5 font-medium text-lg text-white text-center">
                        <Link href="/" onClick={closeMenu} className="hover:text-[#F08A24] transition-colors border-b border-white/10 pb-3">الرئيسية</Link>
                        <Link href="/#about" onClick={closeMenu} className="hover:text-[#F08A24] transition-colors border-b border-white/10 pb-3">من نحن</Link>
                        <Link href="/#features" onClick={closeMenu} className="hover:text-[#F08A24] transition-colors border-b border-white/10 pb-3">مميزاتنا</Link>
                        <Link href="/#clients" onClick={closeMenu} className="hover:text-[#F08A24] transition-colors border-b border-white/10 pb-3">عملائنا</Link>
                        <Link href="/packages" onClick={closeMenu} className="hover:text-[#F08A24] transition-colors border-b border-white/10 pb-3">الباقات والأسعار</Link>
                        <Link href="/digital-menu" onClick={closeMenu} className="hover:text-[#F08A24] transition-colors border-b border-white/10 pb-3">كروت  الانترنت</Link>
                        <Link href="/customize" onClick={closeMenu} className="bg-[#E47B15] text-white py-3 rounded-xl font-bold mt-4 shadow-lg">طلب تسعيرة الآن</Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
