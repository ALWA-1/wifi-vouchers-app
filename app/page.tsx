'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [homeData, setHomeData] = useState<any>({});
  const [features, setFeatures] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  // حالات نافذة التواصل (Modal) المحدثة
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: content } = await supabase.from('home_content').select('*').limit(1).single();
        if (content) setHomeData(content);

        const { data: feat } = await supabase.from('home_features').select('*').order('created_at', { ascending: true });
        if (feat) setFeatures(feat);

        const { data: cli } = await supabase.from('clients').select('*').order('created_at', { ascending: true });
        if (cli) setClients(cli);

        const { data: setts } = await supabase.from('settings').select('*').single();
        if (setts) setSettings(setts);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // إرسال البيانات والتحويل للواتساب مباشرة
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. نسجل الطلب في الداشبورد عشان يفضل في السجلات (لو حبيت ترجعله)
      await supabase.from('leads').insert([{ 
        phone_number: 'تواصل مباشر', // نص افتراضي بدل الرقم
        notes: `الاسم: ${userName}\nالرسالة: ${userMessage || 'بدون رسالة'}\n(جاء من الصفحة الرئيسية)` 
      }]);
      
      // 2. تجهيز رسالة الواتساب المنسقة
      const adminWhatsApp = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || "201234567890";
      const message = `📌 *استفسار من الموقع الإلكتروني*\n━━━━━━━━━━━━━━━━━\nمرحباً، أنا *${userName}*.\nأتواصل معكم من الموقع لمعرفة بعض التفاصيل.\n\n💬 *رسالتي:*\n${userMessage ? userMessage : 'أرغب في الاستفسار عن خدماتكم.'}\n━━━━━━━━━━━━━━━━━`;

      // 3. إغلاق المودال وتفريغ الحقول
      setIsContactModalOpen(false);
      setUserName('');
      setUserMessage('');
      
      // 4. التحويل مباشرة لمحادثة الواتساب (التعديل تم هنا لحل مشكلة الموبايل)
      window.location.href = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E47B15]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans" dir="rtl">
      
      {/* 1. قسم الواجهة (Hero Section) */}
      <section id="hero" className="relative w-full h-[80vh] min-h-[500px] max-h-[800px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(max-width: 768px)" srcSet={homeData.hero_bg_mobile || '/placeholder-mobile.jpg'} />
            <img src={homeData.hero_bg_desktop || '/placeholder-desktop.jpg'} alt="Hero Background" className="w-full h-full object-cover" />
          </picture>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 w-full h-full flex flex-col items-center max-w-5xl mx-auto px-4">
          <div className="flex-1 flex flex-col justify-end pb-8 text-center animate-fade-in-up w-full">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
              {homeData.hero_title}
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              {homeData.hero_subtitle}
            </p>
          </div>

          <div className="h-[33%] w-full flex justify-center items-start pt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-row gap-3 w-full sm:w-auto justify-center px-1">
              <Link href="/packages" className="flex-1 sm:flex-none bg-[#E47B15] hover:bg-[#C9680E] text-white px-3 py-3.5 sm:px-8 sm:py-4 rounded-full font-bold text-[14px] sm:text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-1.5 whitespace-nowrap">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                شاهد الباقات
              </Link>
              <button onClick={() => setIsContactModalOpen(true)} className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-3.5 sm:px-8 sm:py-4 rounded-full font-bold text-[14px] sm:text-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                تواصل معنا
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. قسم من نحن */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-6">{homeData.about_title}</h2>
          <div className="w-20 h-1 bg-[#E47B15] mx-auto mb-8 rounded-full"></div>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">{homeData.about_text}</p>
        </div>
      </section>

      {/* 3. قسم مميزاتنا */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">{homeData.features_title}</h2>
            <div className="w-20 h-1 bg-[#E47B15] mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-500 text-lg">{homeData.features_subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feat) => (
              <div key={feat.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                <div className="h-56 overflow-hidden bg-gray-100">
                  <img src={feat.image_url || '/placeholder.png'} alt={feat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8 text-center">
                  <div className="w-12 h-1 bg-[#E47B15] mx-auto mb-6 rounded-full"></div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-4">{feat.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. قسم شركاء النجاح */}
      <section id="clients" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-[#E47B15] font-bold text-lg mb-2">{homeData.clients_subtitle}</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">{homeData.clients_title}</h3>
            <div className="w-20 h-1 bg-[#E47B15] mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clients.map((cli) => (
              <div key={cli.id} className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all group">
                <div className="h-48 rounded-2xl overflow-hidden mb-4 relative bg-gray-50">
                  <img src={cli.image_url || '/placeholder.png'} alt={cli.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 right-3 bg-[#E47B15] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">{cli.type}</div>
                </div>
                <h4 className="text-center font-bold text-lg text-[#0F172A]">{cli.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. قسم الدعوة لاتخاذ إجراء */}
      <section id="contact" className="py-24 relative overflow-hidden bg-[#fafafa]">
        <div className="absolute inset-0 bg-[url('/light-network-bg.png')] opacity-5 bg-cover bg-center pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-6">هل أنت جاهز للبدء؟</h2>
          <p className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed font-medium">اختر الباقة المثالية التي تناسب احتياجات منشأتك، أو تواصل معنا لمناقشة حل مخصص لك.</p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/packages" className="w-full sm:w-auto bg-[#D97706] hover:bg-[#B45309] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              شاهد الباقات
            </Link>

            <button onClick={() => setIsContactModalOpen(true)} className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#0F172A] border border-gray-200 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              تواصل معنا
            </button>
          </div>
        </div>
      </section>

      {/* ================= المودال الاحترافي للتواصل ================= */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl relative animate-fade-in-up shadow-2xl flex flex-col md:flex-row overflow-hidden my-auto">
            
            {/* زر الإغلاق */}
            <button onClick={() => setIsContactModalOpen(false)} className="absolute top-4 right-4 z-20 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* الجزء الأيمن: نموذج طلب التواصل المحدث */}
            <div className="w-full md:w-1/2 p-8 pt-16 md:p-12"> {/* pt-16 تم إضافتها لتفادي التداخل مع زرار الـ X في الموبايل */}
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold text-[#0F172A] mb-2">دعنا نتواصل معك</h3>
                <p className="text-gray-500 text-sm">أدخل اسمك وسنقوم بتوجيهك لمحادثة واتساب مباشرة لمعرفة التفاصيل.</p>
              </div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الاسم</label>
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="أدخل اسمك الكريم" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#E47B15] transition-colors" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">استفسارك (اختياري)</label>
                  <textarea 
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="اكتب ما تود الاستفسار عنه هنا..." 
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#E47B15] transition-colors resize-none" 
                  ></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-[#0F172A] hover:bg-[#E47B15] disabled:bg-gray-400 text-white py-4 rounded-xl font-bold transition-all shadow-md flex justify-center items-center gap-2 mt-4">
                  {isSubmitting ? 'جاري التحويل...' : 'تأكيد والانتقال للواتساب'}
                  {!isSubmitting && <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                </button>
              </form>
            </div>

            {/* الجزء الأيسر: معلومات التواصل المباشر (ديناميك من الإعدادات) */}
            <div className="w-full md:w-1/2 bg-[#fafafa] p-8 md:p-12 border-t md:border-t-0 md:border-r border-gray-100">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">أو تواصل معنا مباشرة</h3>
              
              <div className="space-y-4">
                {/* الواتساب */}
                {settings.whatsapp_number && (
                  <a href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-green-500 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold mb-1">عبر الواتساب</p>
                      <p className="text-[#0F172A] font-bold" dir="ltr">{settings.whatsapp_number}</p>
                    </div>
                  </a>
                )}

                {/* الفيسبوك */}
                {settings.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold mb-1">صفحتنا على فيسبوك</p>
                      <p className="text-[#0F172A] font-bold">زيارة الصفحة</p>
                    </div>
                  </a>
                )}

                {/* الانستجرام */}
                {settings.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-pink-500 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold mb-1">انستجرام</p>
                      <p className="text-[#0F172A] font-bold">تابعنا لمشاهدة أعمالنا</p>
                    </div>
                  </a>
                )}

                {/* العنوان */}
                {settings.address && (
                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100">
                    <div className="w-12 h-12 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold mb-1">المقر الرئيسي</p>
                      <p className="text-[#0F172A] font-bold">{settings.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
