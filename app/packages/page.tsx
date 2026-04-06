'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [systemOptions, setSystemOptions] = useState<any[]>([]);
  const [entityOptions, setEntityOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // حالات النوافذ (Modals)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  const [selectedPackageName, setSelectedPackageName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // فورم الباقة السريعة المحدث (تم إضافة الاسم والمنشأة والعنوان)
  const [quickOrderForm, setQuickOrderForm] = useState({
    name: '',
    phone: '',
    business_name: '',
    address: ''
  });

  // فورم الباقة المخصصة (كما هو)
  const [customForm, setCustomForm] = useState({
    system_type: '',
    entity_type: '',
    customer_name: '',
    phone_number: '',
    business_name: '',
    business_address: '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: pkgs } = await supabase.from('packages').select('*').order('created_at', { ascending: true });
        if (pkgs) setPackages(pkgs);

        const { data: opts } = await supabase.from('form_options').select('*').order('created_at', { ascending: true });
        if (opts) {
          setSystemOptions(opts.filter(o => o.category === 'system'));
          setEntityOptions(opts.filter(o => o.category === 'entity'));
          
          const sys = opts.filter(o => o.category === 'system');
          const ent = opts.filter(o => o.category === 'entity');
          if(sys.length > 0) setCustomForm(prev => ({...prev, system_type: sys[0].option_name}));
          if(ent.length > 0) setCustomForm(prev => ({...prev, entity_type: ent[0].option_name}));
        }
      } catch (error) {
        console.error('Error fetching packages data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // دالة إرسال الباقة السريعة المحدثة
  const handleQuickOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // تجميع البيانات في خانة الملاحظات لتظهر بشكل مرتب في لوحة التحكم
      const detailedNotes = `طلب باقة: ${selectedPackageName}
👤 الاسم: ${quickOrderForm.name}
🏢 المنشأة: ${quickOrderForm.business_name || 'لم يحدد'}
📍 العنوان: ${quickOrderForm.address || 'لم يحدد'}`;

      await supabase.from('leads').insert([{ 
        phone_number: quickOrderForm.phone,
        notes: detailedNotes
      }]);
      
      setIsOrderModalOpen(false);
      setQuickOrderForm({ name: '', phone: '', business_name: '', address: '' });
      showSuccess();
    } catch (error) { console.error(error); } 
    finally { setIsSubmitting(false); }
  };

  // دالة إرسال الباقة المخصصة
  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await supabase.from('custom_requests').insert([customForm]);
      setIsCustomModalOpen(false);
      setCustomForm({ ...customForm, customer_name: '', phone_number: '', business_name: '', business_address: '', notes: '' });
      showSuccess();
    } catch (error) { console.error(error); } 
    finally { setIsSubmitting(false); }
  };

  const showSuccess = () => {
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 4000);
  };

  const openOrderModal = (pkgName: string) => {
    setSelectedPackageName(pkgName);
    setIsOrderModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E47B15]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pb-20" dir="rtl">
      
      {/* 1. رأس الصفحة */}
      <section className="bg-[#0F172A] py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/light-network-bg.png')] opacity-10 bg-cover bg-center pointer-events-none"></div>
        <div className="relative z-10 container mx-auto px-4 animate-fade-in-up">
          <p className="text-[#E47B15] font-bold text-lg mb-3">خطط الأسعار والباقات</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">جميع باقات القسائم المتاحة</h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            استكشف خططنا السنوية المصممة لتعزيز تجربة ضيوفك وإدارة منشأتك بكفاءة.
          </p>
        </div>
      </section>

      {/* 2. كروت الباقات */}
      <section className="container mx-auto px-4 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg) => {
            const featuresList = pkg.features ? pkg.features.split('\n') : [];
            
            return (
              <div key={pkg.id} className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-2xl transition-shadow duration-300 border border-gray-100 flex flex-col items-center">
                
                {/* رأس الكارت */}
                <div className="flex items-center justify-center gap-5 mb-8 w-full">
                  <div className="w-[72px] h-[72px] bg-[#F1F5F9] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <img 
                      src={pkg.icon_url || '/placeholder.png'} 
                      alt="Icon" 
                      className="w-10 h-10 object-contain" 
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <h3 className="text-[22px] font-bold text-[#0F172A] mb-1">{pkg.name}</h3>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-[#E47B15]">{pkg.price}</span>
                      {!pkg.price.includes('حسب') && !pkg.price.includes('تخصيص') && (
                        <span className="text-sm font-bold text-gray-400">ج. سنوياً</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* خط فاصل */}
                <div className="w-full h-px bg-gray-100 mb-8"></div>

                {/* قائمة المميزات */}
                <div className="flex-1 flex flex-col items-center w-full mb-8">
                  <ul className="space-y-4 inline-flex flex-col items-start">
                    {featuresList.map((feat: string, index: number) => (
                      feat.trim() && (
                        <li key={index} className="flex items-center gap-3 text-gray-600 font-medium">
                          <svg className="w-5 h-5 text-[#E47B15] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-[15px]">{feat}</span>
                        </li>
                      )
                    ))}
                  </ul>
                </div>

                {/* الزرار */}
                <button 
                  onClick={() => openOrderModal(pkg.name)}
                  className="w-full bg-[#E47B15] hover:bg-[#C9680E] text-white py-4 rounded-full font-bold text-lg transition-colors shadow-md mt-auto"
                >
                  اطلب الآن
                </button>

              </div>
            );
          })}
        </div>
      </section>

      {/* 3. قسم لم تجد الباقة المناسبة */}
      <section className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-[#0F172A] rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-gray-800">
          <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-[#E47B15] rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>
          <div className="relative z-10 text-white mb-8 md:mb-0 md:max-w-xl text-center md:text-right">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">لم تجد الباقة المناسبة؟</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              يمكننا تصميم حل مخصص لمنشأتك بناءً على متطلباتك الدقيقة. اختر السعة، عدد الكروت، وميزات النظام التي تحتاجها لنمو عملك.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto">
            <button 
              onClick={() => setIsCustomModalOpen(true)}
              className="w-full md:w-auto bg-[#E47B15] hover:bg-[#C9680E] text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-3 whitespace-nowrap"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              ابدأ التخصيص الآن
            </button>
          </div>
        </div>
      </section>

      {/* ================= النوافذ المنبثقة ================= */}

      {/* 1. نافذة طلب الباقة السريعة المحدثة */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md relative animate-fade-in-up shadow-2xl my-4">
            
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <div>
                <h3 className="text-xl font-extrabold text-[#0F172A]">طلب {selectedPackageName}</h3>
                <p className="text-gray-500 text-xs mt-1">سنتواصل معك لتفعيل الباقة الخاصة بك.</p>
              </div>
              <button onClick={() => setIsOrderModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleQuickOrderSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">الاسم *</label>
                <input type="text" required value={quickOrderForm.name} onChange={(e) => setQuickOrderForm({...quickOrderForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E47B15] transition-colors" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">رقم الهاتف *</label>
                <div className="relative">
                  <input type="tel" required value={quickOrderForm.phone} onChange={(e) => setQuickOrderForm({...quickOrderForm, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 text-sm outline-none focus:border-[#E47B15] transition-colors text-left" dir="ltr" />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-50">📞</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">اسم المنشأة</label>
                <input type="text" value={quickOrderForm.business_name} onChange={(e) => setQuickOrderForm({...quickOrderForm, business_name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E47B15] transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">عنوان المنشأة</label>
                <input type="text" value={quickOrderForm.address} onChange={(e) => setQuickOrderForm({...quickOrderForm, address: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E47B15] transition-colors" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-[#E47B15] hover:bg-[#C9680E] disabled:bg-gray-400 text-white py-3 rounded-lg font-bold text-base transition-colors shadow-md mt-2">
                {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* 2. نافذة التخصيص الكاملة */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl relative animate-fade-in-up shadow-2xl my-4">
            
            {/* رأس النافذة */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <div>
                <h3 className="text-xl font-extrabold text-[#0F172A]">طلب تخصيص باقة</h3>
                <p className="text-gray-500 text-xs mt-1">يرجى تعبئة النموذج وسيقوم فريقنا بالتواصل معك.</p>
              </div>
              <button onClick={() => setIsCustomModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-white rounded-full p-1.5 shadow-sm border border-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="p-5">
              <div className="grid md:grid-cols-2 gap-4 mb-5">
                
                {/* الصف الأول */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">النظام المفضل</label>
                  <select required value={customForm.system_type} onChange={(e) => setCustomForm({...customForm, system_type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E47B15] transition-colors cursor-pointer">
                    {systemOptions.map(opt => <option key={opt.id} value={opt.option_name}>{opt.option_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">نوع المنشأة</label>
                  <select required value={customForm.entity_type} onChange={(e) => setCustomForm({...customForm, entity_type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E47B15] transition-colors cursor-pointer">
                    {entityOptions.map(opt => <option key={opt.id} value={opt.option_name}>{opt.option_name}</option>)}
                  </select>
                </div>

                {/* الصف الثاني */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">الاسم *</label>
                  <input required type="text" value={customForm.customer_name} onChange={(e) => setCustomForm({...customForm, customer_name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E47B15] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">الموبايل *</label>
                  <input required type="tel" value={customForm.phone_number} onChange={(e) => setCustomForm({...customForm, phone_number: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E47B15] transition-colors text-left" dir="ltr" />
                </div>

                {/* الصف الثالث */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">اسم المنشأة</label>
                  <input type="text" value={customForm.business_name} onChange={(e) => setCustomForm({...customForm, business_name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E47B15] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">عنوان المنشأة</label>
                  <input type="text" value={customForm.business_address} onChange={(e) => setCustomForm({...customForm, business_address: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E47B15] transition-colors" />
                </div>

                {/* الصف الرابع */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">رسالتك أو أي متطلبات إضافية</label>
                  <textarea rows={2} value={customForm.notes} onChange={(e) => setCustomForm({...customForm, notes: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#E47B15] transition-colors resize-none"></textarea>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-[#0F172A] hover:bg-[#E47B15] disabled:bg-gray-400 text-white py-3 rounded-lg font-bold text-base transition-colors shadow-md">
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال طلب التعاقد'}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* 3. نافذة رسالة النجاح */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative animate-fade-in-up shadow-2xl">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">تم استلام طلبك بنجاح!</h3>
            <p className="text-gray-500 text-sm">سيقوم فريق المبيعات بالتواصل معك قريباً.</p>
          </div>
        </div>
      )}

    </div>
  );
}