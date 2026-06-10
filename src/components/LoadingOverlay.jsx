import { FiLoader } from 'react-icons/fi';

export function LoadingOverlay({ message = 'Отправка заказа...' }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-8 py-6 shadow-2xl">
                <div className="relative">
                    {/* Spinning loader */}
                    <FiLoader className="h-12 w-12 animate-spin text-emerald-500" />
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 animate-ping rounded-full border-2 border-emerald-300 opacity-50" />
                </div>
                <div className="text-center">
                    <p className="text-lg font-semibold text-slate-800">{message}</p>
                    <p className="mt-1 text-sm text-slate-500">Пожалуйста, подождите...</p>
                </div>
            </div>
        </div>
    );
}
