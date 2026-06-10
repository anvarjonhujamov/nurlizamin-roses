'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { getUnseenOrdersCount, markOrdersAsSeen } from '../utils/orderHistory.js';

const OrderNotificationContext = createContext();

export function OrderNotificationProvider({ children }) {
    const [unseenCount, setUnseenCount] = useState(0);
    const [notification, setNotification] = useState(null);

    // Load initial unseen count
    useEffect(() => {
        setUnseenCount(getUnseenOrdersCount());
    }, []);

    // Refresh unseen count from localStorage
    const refreshUnseenCount = useCallback(() => {
        setUnseenCount(getUnseenOrdersCount());
    }, []);

    // Clear unseen badge
    const clearBadge = useCallback(() => {
        markOrdersAsSeen();
        setUnseenCount(0);
    }, []);

    // Show success notification
    const showOrderSuccess = useCallback((clientName) => {
        setNotification({
            type: 'success',
            message: `Заказ "${clientName}" успешно создан!`,
        });
        refreshUnseenCount();

        // Auto-hide after 4 seconds
        setTimeout(() => {
            setNotification(null);
        }, 4000);
    }, [refreshUnseenCount]);

    // Dismiss notification
    const dismissNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <OrderNotificationContext.Provider
            value={{
                unseenCount,
                notification,
                refreshUnseenCount,
                clearBadge,
                showOrderSuccess,
                dismissNotification,
            }}
        >
            {children}
        </OrderNotificationContext.Provider>
    );
}

export function useOrderNotification() {
    const context = useContext(OrderNotificationContext);
    if (!context) {
        throw new Error('useOrderNotification must be used within OrderNotificationProvider');
    }
    return context;
}
