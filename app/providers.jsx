'use client';

import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store';
import { OrderNotificationProvider } from '@/context/OrderNotificationContext';
import { OrderNotificationToast } from '@/components/OrderNotificationToast';
import { StoreHydrationProvider } from '@/context/StoreHydrationContext';

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <StoreHydrationProvider>
        <OrderNotificationProvider>
          {children}
          <OrderNotificationToast />
          <Toaster position="top-right" />
        </OrderNotificationProvider>
      </StoreHydrationProvider>
    </Provider>
  );
}
