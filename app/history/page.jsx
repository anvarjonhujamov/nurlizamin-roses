'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiDownload, FiTrash2, FiPackage, FiCalendar, FiAlertTriangle } from 'react-icons/fi';
import { Navbar } from '@/components/Navbar';
import { useOrderNotification } from '@/context/OrderNotificationContext';
import { getOrderHistory, deleteOrderFromHistory } from '@/utils/orderHistory';

function DeleteConfirmModal({ order, onConfirm, onCancel }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <FiAlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-slate-900">Удалить заказ?</h3>
          <p className="mt-2 text-sm text-slate-600">
            Вы уверены, что хотите удалить заказ <span className="font-semibold">{order.clientName}</span>?
          </p>
          <p className="mt-1 text-xs text-slate-500">Это действие нельзя отменить.</p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Нет
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Да, удалить
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const { clearBadge } = useOrderNotification();
  const [orders, setOrders] = useState([]);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    setOrders(getOrderHistory());
    clearBadge();
  }, [clearBadge]);

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      deleteOrderFromHistory(orderToDelete.orderId);
      setOrders(getOrderHistory());
      setOrderToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOrderToDelete(null);
  };

  const handleDownload = (order) => {
    const link = document.createElement('a');
    if (order.fileDataUrl) {
      link.href = order.fileDataUrl;
      link.download = order.filename || `Заказ_${order.clientName}.xlsx`;
    } else if (order.fileUrl) {
      link.href = order.fileUrl;
      link.download = `Заказ_${order.clientName}.xlsx`;
    } else {
      console.error('No file data available for download');
      return;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <DeleteConfirmModal
        order={orderToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <Navbar />

      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6 pt-20 md:py-8 md:pt-24">
        <header className="mb-2 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => router.push('/catalog')}
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-rose-500 hover:text-rose-600 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <FiArrowLeft size={14} />
            <span>Вернуться к каталогу</span>
          </button>
          <div className="text-right">
            <h1 className="text-xl font-semibold text-slate-900">История заказов</h1>
            <p className="text-xs text-slate-500">
              Заказов: <span className="font-semibold">{orders.length}</span>
            </p>
          </div>
        </header>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="rounded-full bg-slate-100 p-6">
              <FiPackage className="h-12 w-12 text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Нет заказов</h2>
              <p className="mt-1 text-sm text-slate-500">История заказов пуста</p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/catalog')}
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Перейти в каталог
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{order.clientName}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <FiCalendar size={14} />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(order)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                    title="Скачать Excel"
                  >
                    <FiDownload size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(order)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                    title="Удалить"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => router.push('/catalog')}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
            >
              <FiArrowLeft size={16} />
              <span>Перейти в каталог</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
