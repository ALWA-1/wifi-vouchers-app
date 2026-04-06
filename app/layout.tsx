import type { Metadata } from "next";
import "./globals.css";
// استيراد المكونات
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";
import { siteConfig } from "@/lib/seo"; // استدعاء إعدادات الـ SEO

// إعدادات الـ SEO المتقدمة
export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | حلول كروت الإنترنت وإدارة شبكات الكافيهات`,
    template: `%s | ${siteConfig.name}`, // للصفحات الفرعية
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  
  // إعدادات الشير على السوشيال ميديا والواتساب (Open Graph)
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  
  // إعدادات الشير على تويتر
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  
  // أيقونات المتصفح
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body>
        
        {/* شاشة التحميل */}
        <Preloader />

        {/* الـ Navbar الثابت */}
        <Navbar />

        {/* المحتوى الرئيسي */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* الفوتر */}
        <Footer />
        
      </body>
    </html>
  );
}