'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollReveal from '../../components/ScrollReveal';
import { supabase } from '@/lib/supabase';

// قائمة ألوان النوافذ (لإرجاع التصميم الأصلي)
const tipColors = [
    'bg-orange-100 text-[#E47B15]',
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-green-100 text-green-600'
];

export default function VouchersServicePage() {
    const [landingData, setLandingData] = useState<any>({});
    const [tips, setTips] = useState<any[]>([]);
    const [portfolio, setPortfolio] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userName, setUserName] = useState(''); 
    const [userMessage, setUserMessage] = useState(''); 
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: content } = await supabase.from('landing_content').select('*').single();
                if (content) setLandingData(content);

                const { data: tipsData } = await supabase.from('landing_tips').select('*').order('created_at', { ascending: true });
                if (tipsData) setTips(tipsData);

                const { data: portData } = await supabase.from('portfolio').select('*').order('created_at', { ascending: true });
                if (portData) setPortfolio(portData);

                const { data: setts } = await supabase.from('settings').select('*').single();
                if (setts) setSettings(setts);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userName.trim() !== '') {
            setIsSubmitting(true);
            try {
                // تسجيل الطلب في قاعدة البيانات للمتابعة
                await supabase.from('leads').insert([{
                    phone_number: 'تواصل مباشر عبر الواتساب',
                    notes: `طلب خدمة كروت الإنترنت\nالاسم: ${userName}\nالرسالة: ${userMessage || 'لا يوجد'}`
                }]);

                const adminWhatsApp = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || "201234567890";
                
                // تنسيق رسالة الواتساب الاحترافية
                const message = `📌 *طلب جديد - خدمة كروت الإنترنت*\n━━━━━━━━━━━━━━━━━\nمرحباً، أنا *${userName}*.\nأرغب في الاستفسار عن تصميم كروت إنترنت خاصة بكياني.\n\n💬 *الرسالة:*\n${userMessage || 'أرغب في معرفة المزيد من التفاصيل.'}\n━━━━━━━━━━━━━━━━━\n🌐 مرسل من صفحة كروت الإنترنت.`;

                setIsSubmitted(true);
                
                // ✅ الحل السحري لمشكلة الموبايل: استخدام location.href بدلاً من window.open
                window.location.href = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;
                
            } catch (error) {
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => { 
            setIsSubmitted(false); 
            setUserName(''); 
            setUserMessage('');
        }, 300);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E47B15]"></div>
            </div>
        );
    }

    const serviceList = landingData.service_text ? landingData.service_text.split('\n') : [];

    return (
        <main className="min-h-screen bg-[#fafafa] text-gray-900 font-sans relative" dir="rtl">

            {/* 1. Hero Section */}
            <section className="relative h-[45vh] md:h-[60vh] flex items-center justify-center overflow-hidden bg-[#0F172A]">
                <div className="absolute inset-0 z-0 opacity-40">
                    <img src={landingData.hero_bg_image || "/placeholder.png"} alt="خلفية" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent z-10"></div>
                </div>
                <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto mt-10">
                    <ScrollReveal>
                        <h1
                            className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white drop-shadow-lg"
                            dangerouslySetInnerHTML={{ __html: landingData.hero_title || 'حوّل خدمة الواي فاي من <span class="text-[#F08A24]">تكلفة</span> إلى مصدر ربح' }}
                        />
                        <p className="text-lg md:text-xl text-gray-300 font-light drop-shadow-md max-w-3xl mx-auto leading-relaxed">
                            {landingData.hero_subtitle}
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* 2. النصائح التسويقية (تصميم النقاط الاحترافي) */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <span className="text-[#E47B15] font-semibold tracking-wider text-sm">{landingData.tips_subtitle || 'نصائح لرواد الأعمال'}</span>
                            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-2">{landingData.tips_title || 'لماذا تعتبر كروت الإنترنت الحل الذكي لكيانك؟'}</h2>
                            <div className="w-16 h-1 bg-[#F08A24] rounded-full mt-4 mx-auto"></div>
                        </div>
                    </ScrollReveal>
                    
                    <div className="bg-[#f8f9fa] rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
                        <ul className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                            {tips.map((tip, index) => (
                                <ScrollReveal key={tip.id} delay={`delay-${(index % 4) * 100}`}>
                                    <li className="flex items-start gap-4 group">
                                        <div className="mt-1 w-7 h-7 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 group-hover:bg-[#E47B15] transition-colors duration-300">
                                            <svg className="w-4 h-4 text-[#E47B15] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700 text-lg leading-relaxed font-medium">
                                            {tip.title || tip.description}
                                        </span>
                                    </li>
                                </ScrollReveal>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* 3. ماذا تتضمن خدمتنا */}
            <section className="py-20 bg-[#0F172A] text-white">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-extrabold mb-8 tracking-tight">{landingData.service_title || 'ماذا تتضمن خدمتنا؟'}</h2>
                                <ul className="space-y-5">
                                    {serviceList.map((line: string, index: number) => (
                                        line.trim() && (
                                            <li key={index} className="flex items-start gap-4">
                                                <div className="w-6 h-6 rounded-full bg-[#F08A24] flex items-center justify-center shrink-0 mt-1">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <span className="text-gray-300 leading-relaxed text-lg">{line}</span>
                                            </li>
                                        )
                                    ))}
                                </ul>
                            </div>
                            <div className="md:w-1/2 relative w-full aspect-square md:aspect-auto md:h-[450px]">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#E47B15]/20 to-transparent rounded-3xl z-0 transform translate-x-4 translate-y-4"></div>
                                <img src={landingData.service_image || "/placeholder.png"} alt="الخدمة" className="w-full h-full object-cover rounded-3xl shadow-2xl z-10 relative" />
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 4. معرض النماذج */}
            <section className="py-20 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <span className="text-[#E47B15] font-semibold tracking-wider text-sm">{landingData.portfolio_subtitle || 'تصفح إبداعاتنا'}</span>
                            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-2">{landingData.portfolio_title || 'نماذج كروت تناسب كافة الكيانات'}</h2>
                            <div className="w-16 h-1 bg-[#F08A24] rounded-full mt-4 mx-auto"></div>
                        </div>
                    </ScrollReveal>
                    <div className="grid md:grid-cols-3 gap-8">
                        {portfolio.map((item, index) => (
                            <ScrollReveal key={item.id} delay={`delay-${(index + 1) * 100}`}>
                                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full group">
                                    <div className="h-56 w-full overflow-hidden relative">
                                        <div className="absolute inset-0 bg-[#0F172A]/10 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                                        <img src={item.image_url || '/placeholder.png'} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col items-center text-center">
                                        <h3 className="text-xl font-bold text-[#0F172A] mb-3">{item.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed flex-grow">{item.category}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Call to Action */}
            <section className="py-20 bg-white border-t border-gray-100 flex flex-col items-center text-center px-6">
                <ScrollReveal>
                    <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6 mx-auto">
                        <svg className="w-10 h-10 text-[#E47B15]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">{landingData.cta_title || 'جاهز للسيطرة على شبكتك؟'}</h2>
                    <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">{landingData.cta_text || 'تواصل معنا الآن لتصميم وطباعة كروت الإنترنت الخاصة بكيانك، وابدأ في تقديم خدمة احترافية تزيد من أرباحك.'}</p>
                    <button onClick={() => setIsModalOpen(true)} className="bg-[#E47B15] hover:bg-[#C9680E] text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-orange-500/20 inline-flex items-center gap-2 cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        اطلب تصميم كروتك الآن
                    </button>
                </ScrollReveal>
            </section>

            {/* ================= المودال الاحترافي للتواصل ================= */}
            {isModalOpen && !isSubmitted && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
                  <div className="bg-white rounded-3xl w-full max-w-4xl relative animate-fade-in-up shadow-2xl flex flex-col md:flex-row overflow-hidden my-auto">

                    {/* زر الإغلاق المحدث لتجنب التداخل */}
                    <button onClick={closeModal} className="absolute top-4 right-4 z-20 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    {/* الجزء الأيمن: نموذج طلب التواصل المحدث */}
                    <div className="w-full md:w-1/2 p-8 pt-16 md:p-12">
                      <div className="mb-6">
                        <h3 className="text-2xl font-extrabold text-[#0F172A] mb-2">دعنا نتواصل معك</h3>
                        <p className="text-gray-500 text-sm">أدخل اسمك وسنقوم بتوجيهك لمحادثة واتساب مباشرة لتصميم كروتك.</p>
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-4">
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
                          <label className="block text-sm font-bold text-gray-700 mb-2">رسالتك (اختياري)</label>
                          <textarea
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            placeholder="اكتب تفاصيل طلبك هنا..."
                            rows={3}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#E47B15] transition-colors resize-none"
                          ></textarea>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-[#E47B15] hover:bg-[#C9680E] disabled:bg-gray-400 text-white py-4 rounded-xl font-bold transition-all shadow-md flex justify-center items-center gap-2 mt-4">
                          {isSubmitting ? 'جاري التحويل...' : 'إرسال الطلب والتحويل للواتساب'}
                          {!isSubmitting && <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                        </button>
                      </form>
                    </div>

                    {/* الجزء الأيسر: معلومات التواصل المباشر */}
                    <div className="w-full md:w-1/2 bg-[#fafafa] p-8 md:p-12 border-t md:border-t-0 md:border-r border-gray-100 flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-[#0F172A] mb-6">أو تواصل معنا مباشرة</h3>
                      
                      <div className="space-y-4">
                        {/* الاتصال الهاتفي */}
                        {settings?.phone_number && (
                          <a href={`tel:${settings.phone_number}`} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-[#E47B15] hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-orange-50 text-[#E47B15] rounded-full flex items-center justify-center group-hover:bg-[#E47B15] group-hover:text-white transition-colors">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-bold mb-1">اتصل بنا هاتفياً</p>
                              <p className="text-[#0F172A] font-bold" dir="ltr">{settings.phone_number}</p>
                            </div>
                          </a>
                        )}

                        {/* الواتساب */}
                        {settings?.whatsapp_number && (
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
                        {settings?.facebook_url && (
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
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {/* نافذة النجاح الاحترافية */}
            {isModalOpen && isSubmitted && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                  <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative animate-fade-in-up shadow-2xl">
                    <button onClick={closeModal} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">تم استلام طلبك بنجاح!</h3>
                    <p className="text-gray-500 text-sm mb-6">سيتم توجيهك الآن للمحادثة عبر الواتساب لتكملة التفاصيل.</p>
                  </div>
                </div>
            )}

        </main>
    );
}
