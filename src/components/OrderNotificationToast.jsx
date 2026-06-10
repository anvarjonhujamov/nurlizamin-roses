'use client';

import { FiCheck, FiX } from 'react-icons/fi';
import { useOrderNotification } from '../context/OrderNotificationContext.jsx';

export function OrderNotificationToast() {
    const { notification, dismissNotification } = useOrderNotification();

    if (!notification) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm animate-fade-up md:left-auto md:right-6">
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white p-4 shadow-lg">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <FiCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">Заказ создан</p>
                    <p className="text-xs text-slate-600 truncate">{notification.message}</p>
                </div>
                <button
                    type="button"
                    onClick={dismissNotification}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                    <FiX className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
