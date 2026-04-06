// app/customize/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CustomizePackagePage() { // تم تغيير اسم الـ Component
    const [formData, setFormData] = useState({
        system: 'نظام الـ 1000 ميجا',
        type: 'مطعم',
        name: '',
        phone: '',
        cafeName: '',
        address: '',
        message: '',
        captcha: '',
    });

    const validationCode = '77985';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("تم استلام طلب تخصيص الباقة بنجاح! سنتواصل معك قريباً لتأكيد التفاصيل.");
    };

    return (
        <main className="min-h-screen bg-[#fafafa] text-gray-900 font-sans" dir="rtl">


            {/* 2. Form Section */}
            <section className="pt-36 pb-24 px-6">
                <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">

                    {/* Header */}
                    <div className="text-center mb-10">
                        {/* تغيير العنوان ليتناسب مع الغرض */}
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">طلب تخصيص باقة</h1>
                        <div className="w-16 h-1.5 bg-[#F08A24] mx-auto mt-4 rounded-full"></div>
                        <p className="text-gray-500 mt-4 text-sm md:text-base">يرجى تعبئة النموذج أدناه بالخيارات التي تناسبك وسيقوم فريقنا بالتواصل معك.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* القوائم المنسدلة */}
                        <div className="grid md:grid-cols-2 gap-5">
                            <select
                                className="w-full bg-[#f4f7f6] border border-gray-200 text-gray-700 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E47B15] focus:bg-white transition-colors"
                                value={formData.system}
                                onChange={(e) => setFormData({ ...formData, system: e.target.value })}
                            >
                                <option>نظام الـ 1000 ميجا</option>
                                <option>نظام الـ 500 ميجا</option>
                                <option>باقة الشركات</option>
                            </select>

                            <select
                                className="w-full bg-[#f4f7f6] border border-gray-200 text-gray-700 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E47B15] focus:bg-white transition-colors"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option>مطعم</option>
                                <option>كافيه</option>
                                <option>فندق / قرية سياحية</option>
                                <option>أخرى</option>
                            </select>
                        </div>

                        {/* الحقول النصية (كما هي) */}
                        <input
                            type="text" placeholder="الاسم *" required
                            className="w-full bg-[#f4f7f6] border border-gray-200 text-gray-700 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E47B15] focus:bg-white transition-colors"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <input
                            type="tel" placeholder="الموبايل *" required
                            className="w-full bg-[#f4f7f6] border border-gray-200 text-gray-700 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E47B15] focus:bg-white transition-colors"
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />

                        <input
                            type="text" placeholder="إسم المنشأة (الكافيه/المطعم) *" required
                            className="w-full bg-[#f4f7f6] border border-gray-200 text-gray-700 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E47B15] focus:bg-white transition-colors"
                            onChange={(e) => setFormData({ ...formData, cafeName: e.target.value })}
                        />

                        <input
                            type="text" placeholder="عنوان المنشأة *" required
                            className="w-full bg-[#f4f7f6] border border-gray-200 text-gray-700 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E47B15] focus:bg-white transition-colors"
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />

                        <textarea
                            placeholder="اكتب رسالتك أو أي متطلبات إضافية هنا... *" required rows={4}
                            className="w-full bg-[#f4f7f6] border border-gray-200 text-gray-700 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E47B15] focus:bg-white transition-colors resize-none"
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        ></textarea>

                        {/* زر الإرسال */}
                        <button
                            type="submit"
                            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg mt-6"
                        >
                            إرسال طلب التعاقد
                        </button>

                    </form>
                </div>
            </section>

        </main>
    );
}