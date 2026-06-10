'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { FiPackage, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { selectTotalItems, clear } from '../store/basketSlice.js';
import { sendOrderToTelegram } from '../utils/telegram.js';
import { saveOrderToHistory } from '../utils/orderHistory.js';
import { useOrderNotification } from '../context/OrderNotificationContext.jsx';

/**
 * Trigger download of a blob file in the browser
 */
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function ClientInfoForm({ totalVarieties, basketItems = [], onSubmitting }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const totalItems = useSelector(selectTotalItems);
    const { showOrderSuccess, refreshUnseenCount } = useOrderNotification();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (basketItems.length === 0) {
            setSubmitStatus('error');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);
        onSubmitting?.(true);

        try {
            const result = await sendOrderToTelegram(formData, basketItems);

            if (result.success) {
                setSubmitStatus('success');

                saveOrderToHistory({
                    orderId: result.orderId,
                    clientName: result.clientName,
                    createdAt: result.createdAt,
                    fileDataUrl: result.fileDataUrl,
                    filename: result.filename,
                });

                showOrderSuccess(result.clientName);

                if (result.excelBlob && result.filename) {
                    downloadBlob(result.excelBlob, result.filename);
                }

                setFormData({ name: '', phone: '', email: '', address: '' });
                dispatch(clear());
                refreshUnseenCount();
                router.push('/history');
            } else {
                console.error('Order failed:', result.error);
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
            onSubmitting?.(false);
        }
    };

    return (
        <div className="sticky top-20 md:top-24">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
                    <FiPackage className="h-5 w-5 text-rose-500" />
                    <h2 className="text-base font-semibold text-slate-900">
                        Информация о заказе
                    </h2>
                </div>

                {submitStatus === 'success' && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2.5 text-sm text-green-800">
                        <FiCheck className="h-4 w-4 flex-shrink-0" />
                        <span>Заказ успешно отправлен!</span>
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-800">
                        <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Ошибка отправки. Попробуйте снова.</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="mb-1 block text-sm text-slate-600">
                            Имя пользователя <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                            placeholder="Введите ваше имя"
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="mb-1 block text-sm text-slate-600">
                            Телефон пользователя <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                            placeholder="Введите номер телефона"
                            autoComplete="tel"
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm text-slate-600">
                            Электронная почта
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            placeholder="example@mail.com"
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="mb-1 block text-sm text-slate-600">
                            Адрес пользователя <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                            placeholder="Введите адрес доставки"
                            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2 border-t border-slate-200 pt-3 text-sm">
                        <div className="flex justify-between text-slate-700">
                            <span>Товаров:</span>
                            <span className="font-semibold">{totalItems}</span>
                        </div>
                        <div className="flex justify-between text-slate-700">
                            <span>Сортов:</span>
                            <span className="font-semibold">{totalVarieties}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || basketItems.length === 0}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <FiLoader className="h-4 w-4 animate-spin" />
                                Отправка...
                            </>
                        ) : (
                            <>
                                <FiPackage className="h-4 w-4" />
                                Отправить заказ
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
